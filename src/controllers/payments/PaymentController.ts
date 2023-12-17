/* eslint-disable max-lines-per-function */
import { Body, Controller, Get, HttpStatus, Inject, Ip, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { IP_V6_REGEX } from '../../constants';
import { ip6to4 } from '../../shared/miscUtils';
import { JwtAuthGuard } from '../../modules/domain/auth';
import { BillStatus, IBillService, Types as TBill } from '../../modules/domain/bills';
import { HttpUser } from '../../types';
import { GetUser, Public } from '../../common/decorators';
import { IPaymentService, Types as TPayment } from '../../modules/domain/payments/types';
import {
	AppConfigurationService,
	Types as TConfig,
} from '../../modules/core/configuration';

import * as dto from './paymentDto';


@ApiBearerAuth('Bearer')
@ApiTags('payment')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/payments')
export class PaymentController {
	constructor(
		@Inject(TBill.BILL_SVC) private readonly _billSvc: IBillService,
		@Inject(TPayment.PAYMENT_SVC) private readonly _vnPaySvc: IPaymentService,
		@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService
	) {}

	// @Redirect()
	@Post('create-url')
	public async createPaymentUrl(
	@Body() { bills: billIds }: dto.CreateUrlDto,
		@Ip() ip: string,
		@GetUser() user: HttpUser,
	) {
		let ipAddress: string;
		if (IP_V6_REGEX.test(ip)) {
			ipAddress = ip6to4(ip);
		}
		else {
			ipAddress = ip.replace(/^.*:/, '');
		}
		const bills = await this._billSvc.findByUser(billIds, BillStatus.PENDING);
		const paymentUrl = await this._vnPaySvc.createPaymentUrl(user.uid, ipAddress, bills);
		return {
			url: paymentUrl,
			status: HttpStatus.FOUND,
		};
	}

	@Public()
	@Get('vnpay-ipn')
	public async vnpIpn(@Query() query: dto.VnpIpnQuery, @Res() response: Response) {
		try {
			await this._vnPaySvc.vnpIpn(query);
			response.redirect(`${this._cfgSvc.ghubFeUrl}/successPayment`);
		}
		catch {
			response.redirect(`${this._cfgSvc.ghubFeUrl}/failPayment`);
		}
		return;
	}

	@Get()
	public async findAll() {
		return await this._vnPaySvc.findAll();
	}
}
