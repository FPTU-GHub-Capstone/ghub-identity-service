/* eslint-disable max-lines-per-function */
/* eslint-disable max-params */
/* eslint-disable max-lines */
import crypto from 'crypto';

import qs from 'qs';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import moment from 'moment';

import {
	AppConfigurationService,
	Types as TCfg,
} from '../../core/configuration';
import { DomainModels } from '../../../constants';
import { sortObject } from '../../../shared/miscUtils';
import { Bill, BillDocument, BillStatus, IBillService, Types as TBill } from '../bills';
import { IUserService, Types as TUsr } from '../users';
import { IGameService, Types as TExtApi } from '../../externalApi';

import {
	CreateTransactionParams,
	IPaymentService,
	VnpIpnParams,
	VnpParams,
	VnpPaymentResponse,
	VnpResCode,
	VnpTransactionParams,
} from './types';
import { Payment, PaymentDocument, PaymentStatus } from './Payment';


@Injectable()
export class VnPayService implements IPaymentService {
	constructor(
		@InjectModel(DomainModels.PAYMENT) private readonly _paymentModel: Model<Payment>,
		@Inject(TBill.BILL_SVC) private readonly _billSvc: IBillService,
		@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TUsr.USR_SVC) private readonly _usrSvc: IUserService,
		@Inject(TExtApi.GAME_SVC) private readonly _gameSvc: IGameService,
	) {}

	public findAll(status?: PaymentStatus): Promise<PaymentDocument[]> {
		const filter: FilterQuery<PaymentDocument> = {};
		status && Object.assign(filter, { status });
		return this._paymentModel.find(filter).populate(['paidBy', 'bills']);
	}

	public async createPaymentUrl(uid: string, ipAddress: string, bills: Bill[],): Promise<string> {
		const payment = await this._storePaymentRequest(bills, uid);
		const vnpUrl = this._cfgSvc.vnpayUrl;
		const secretKey = this._cfgSvc.vnpayHashSecret;
		const transactionParams = this._buildSortedTransactionParams(payment, ipAddress);
		const vnpParams: VnpParams = {
			vnp_SecureHash: this._signHashKey(transactionParams, secretKey),
			...transactionParams,
		};
		const url = vnpUrl + '?' + qs.stringify(vnpParams, { encode: false });
		return url;
	}

	public async vnpIpn(inpParams: VnpIpnParams): Promise<VnpPaymentResponse> {
		const isValid = this._validateCheckSum(inpParams);
		const { vnp_ResponseCode: vnpResCode } = inpParams;
		if (!isValid) {
			await this._updatePaymentStatus(inpParams, PaymentStatus.FailedForChecksum);
			return {
				vnpResCode: VnpResCode.ChecksumFailed,
				message: PaymentStatus.FailedForChecksum,
			};
		}
		return this._handlePaymentUpdate(inpParams, vnpResCode as VnpResCode);
	}

	// eslint-disable-next-line max-lines-per-function
	private async _handlePaymentUpdate(inpParams: VnpIpnParams, vnpResCode: VnpResCode) {
		const { vnp_TxnRef: paymentId } = inpParams;
		switch (vnpResCode) {
			case VnpResCode.Success:
				const payment = await this._paymentModel.findById(paymentId); // don't populate so bills is array of billId
				await Promise.all([
					this._updatePaymentStatus(inpParams, PaymentStatus.Success),
					this._updateBillStatus(payment),
				]);
				await this._activeOverdueBillGames((payment.bills as unknown) as string[]);
				return {
					vnpResCode: VnpResCode.Success,
					message: PaymentStatus.Success,
				};
			case VnpResCode.InvalidMerchant:
				await this._updatePaymentStatus(inpParams, PaymentStatus.FailedForInvalidMerchant);
				return {
					vnpResCode: VnpResCode.InvalidMerchant,
					message: PaymentStatus.FailedForInvalidMerchant,
				};
			case VnpResCode.InvalidAmount:
				await this._updatePaymentStatus(inpParams, PaymentStatus.FailedForInvalidAmount);
				return {
					vnpResCode: VnpResCode.InvalidAmount,
					message: PaymentStatus.FailedForInvalidAmount,
				};
			default:
				await this._updatePaymentStatus(inpParams, PaymentStatus.FailedForInvalidOrder);
				return {
					vnpResCode: VnpResCode.InvalidOrder,
					message: PaymentStatus.FailedForInvalidOrder,
				};
		}
	}

	private async _updatePaymentStatus(params: VnpIpnParams, status = PaymentStatus.Success): Promise<void> {
		const { vnp_TxnRef: paymentId } = params;
		await this._paymentModel.findByIdAndUpdate(
			paymentId,
			{
				status,
				bankCode: params.vnp_BankCode,
			},
			{ new: true },
		);
	}

	private async _updateBillStatus(payment: PaymentDocument): Promise<void> {
		await this._billSvc.updateMany(
			{
				_id: {
					$in: (payment.bills as unknown) as string[],
				},
			},
			{ status: BillStatus.PAID },
			{ new: true },
		);
	}

	private async _activeOverdueBillGames(billIds: string[]): Promise<void> {
		const activeGameIds: string[] = [];
		const uniqueBillIds = Array.from(new Set(billIds));
		for (const billId of uniqueBillIds) {
			const bill = await this._billSvc.findOne({ _id: billId });
			const gameId = bill.gameId;
			const gameBills = await this._billSvc.find({ gameId: gameId, status: BillStatus.OVERDUE });
			if (gameBills.length === 0) {
				activeGameIds.push(gameId);
			}
		}
		if (activeGameIds.length > 0) {
			await this._gameSvc.updateStatus(activeGameIds, true);
		}
	}


	private _validateCheckSum(inpParams: VnpIpnParams): boolean {
		let isValid = true;
		const secureHash = inpParams.vnp_SecureHash;
		delete inpParams.vnp_SecureHash;
		delete inpParams.vnp_SecureHashType;
		inpParams = sortObject(inpParams);

		const secretKey = this._cfgSvc.vnpayHashSecret;
		const signData = qs.stringify(inpParams, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		if (secureHash !== signed) {
			isValid = false;
		}
		return isValid;
	}


	private _buildSortedTransactionParams(payment: PaymentDocument, ipAddress: string) {
		const transactionParams = this._createTransactionParams(
			{
				amount: payment.amount,
				ipAddress,
				date: payment.date,
				orderInfo: payment.content,
				orderId: payment._id.toString(),
			}
		);
		return sortObject(transactionParams);
	}

	private async _storePaymentRequest(
		bills: Bill[],
		uid: string,
	): Promise<PaymentDocument> {
		const cfgSvc = this._cfgSvc;
		const user = await this._usrSvc.findOne({ uid });
		const amount = bills.reduce((acc, bill) => {
			if (bill.status !== BillStatus.PAID) {
				acc += (cfgSvc.writeUnitPrice * bill.writeUnits /* + cfgSvc.readUnitPrice * bill.readUnits */) * cfgSvc.usdToVnd;
			}
			return acc;
		}, 0);
		const payDate = moment(new Date()).format('YYYYMMDDHHmmss');
		const paymentMDb = await this._paymentModel.create({
			amount,
			bankCode: 'unknown',
			date: payDate,
			content: 'Payment:' + payDate,
			status: PaymentStatus.Initial,
			paidBy: user,
			bills,
		});
		return paymentMDb;
	}

	private _signHashKey(
		transactionParams: VnpTransactionParams,
		secretKey: string,
	): string {
		const signData = qs.stringify(transactionParams, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
		return signed;
	}

	private _createTransactionParams(
		params: CreateTransactionParams,
	): VnpTransactionParams {
		return {
			vnp_Version: '2.1.0',
			vnp_Command: 'pay',
			vnp_Locale: 'vn',
			vnp_CurrCode: 'VND',
			vnp_IpAddr: params.ipAddress,
			vnp_TxnRef: params.orderId,
			vnp_Amount: params.amount * 100,
			vnp_OrderInfo: params.orderInfo,
			vnp_CreateDate: params.date,
			vnp_TmnCode: this._cfgSvc.vnpayTmnCode,
			vnp_ReturnUrl: this._cfgSvc.vnpayReturnUrl,
			vnp_OrderType: 'other', // required
		};
	}
}
