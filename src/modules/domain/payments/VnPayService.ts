import crypto from 'crypto';

import qs from 'qs';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import moment from 'moment';

import {
	AppConfigurationService,
	Types as TCfg,
} from '../../core/configuration';
import { DomainModels } from '../../../constants';
import { sortObject } from '../../../shared/miscUtils';
import { Bill } from '../bills';
import { IUserService, Types as TUsr } from '../users';

import {
	CreateTransactionParams,
	IPaymentService,
	VnpParams,
	VnpTransactionParams,
} from './types';
import { Payment, PaymentDocument, PaymentStatus } from './Payment';


const USD_TO_VND = 24275;

@Injectable()
export class VnPayService implements IPaymentService {
	constructor(
		@InjectModel(DomainModels.PAYMENT) private readonly _paymentModel: Model<Payment>,
		@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TUsr.USR_SVC) private readonly _usrSvc: IUserService,
	) {}

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

	private async _storePaymentRequest(bills: Bill[], uid: string): Promise<PaymentDocument> {
		const user = await this._usrSvc.findOne({ uid });
		const amount = bills.reduce(
			(acc, bill) => acc + this._cfgSvc.writeUnitPrice * bill.writeUnits * USD_TO_VND,
			0,
		);
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
