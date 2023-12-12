import { Controller, HttpStatus, Inject, Ip, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IP_V6_REGEX } from '../../constants';
import { ip6to4 } from '../../shared/miscUtils';
import { JwtAuthGuard } from '../../modules/domain/auth';
import { BillStatus, IBillService, Types as TBill } from '../../modules/domain/bills';
import { HttpUser } from '../../types';
import { GetUser } from '../../common/decorators';
import { IPaymentService, Types as TPayment } from '../../modules/domain/payments/types';


@ApiBearerAuth('Bearer')
@ApiTags('payment')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/payments')
export class PaymentController {
	constructor(
		@Inject(TBill.BILL_SVC) private readonly _billSvc: IBillService,
		@Inject(TPayment.PAYMENT_SVC) private readonly _vnPaySvc: IPaymentService,
	) {}

	// @Redirect()
	@Post('create-url')
	public async createPaymentUrl(
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
		const bills = await this._billSvc.findByUser(BillStatus.PENDING);
		const paymentUrl = await this._vnPaySvc.createPaymentUrl(user.uid, ipAddress, bills);
		return {
			url: paymentUrl,
			status: HttpStatus.FOUND,
		};
	}
}
