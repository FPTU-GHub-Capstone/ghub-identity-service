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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../modules/domain/auth';
import {
	BillStatus,
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
		const { bills: billIds, status } = billsQuery;
		let filteredBillIds: string[] = [];
		if (typeof billIds === 'string') {
			filteredBillIds = [billIds];
		}
		else {
			filteredBillIds = billIds;
		}
		const bills = await this._billSvc.findByUser(filteredBillIds, status);
		return { bills };
	}

	@Post('create-bills')
	public fireBillCreation() {
		this._bgJobs.fireBillCreationJob();
	}

	@Post('handle-unpaid-bills')
	public fireBillOverdueJob() {
		this._bgJobs.fireBillOverdueJob();
	}
}
