/* eslint-disable max-lines-per-function */
import {
	Controller,
	Get,
	Inject,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators';
import { JwtAuthGuard } from '../../modules/domain/auth';
import {
	IBillService,
	IGHubJobs,
	Types as TBill,
} from '../../modules/domain/bills';
import {
	IRequestContext,
	Types as TCntx,
} from '../../modules/core/requestContext';

import * as dto from './billDto';


@ApiBearerAuth('Bearer')
@ApiTags('bill')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/bills')
export class BillController {
	constructor(
		@Inject(TBill.BILL_PROCESS_JOBS) private readonly _bgJobs: IGHubJobs,
		@Inject(TBill.BILL_SVC) private readonly _billSvc: IBillService,
		@Inject(TCntx.REQUEST_CONTEXT) private readonly _reqCnTx: IRequestContext,
	) {}

	@Get()
	public async getAll(@Query(new ValidationPipe({ transform: true })) billsQuery?: dto.BillsQuery) {
		const { bills: billIds, status, gameId } = billsQuery;
		let filteredBillIds: string[] = [];
		if (typeof billIds === 'string') {
			filteredBillIds = [billIds];
		}
		else {
			filteredBillIds = billIds;
		}
		const bills = await this._billSvc.findByUser(filteredBillIds, status, gameId);
		return { bills };
	}

	@Public()
	@Post('create-bills')
	public fireBillCreation() {
		this._bgJobs.fireBillCreationJob();
	}

	@Public()
	@Post('handle-unpaid-bills')
	public fireBillOverdueJob() {
		this._bgJobs.fireBillOverdueJob();
	}

	@Public()
	@Post('remind-unpaid-bills')
	public fireBillBillReminderJob() {
		this._bgJobs.fireBillBillReminderJob();
	}
}
