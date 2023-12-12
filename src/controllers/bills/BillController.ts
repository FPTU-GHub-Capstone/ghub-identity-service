/* eslint-disable max-lines-per-function */
import {
	Controller,
	Get,
	Inject,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';

import { JwtAuthGuard } from '../../modules/domain/auth';
import {
	Bill,
	BillStatus,
	IBillService,
	IGHubJobs,
	Types as TBill,
} from '../../modules/domain/bills';
import {
	IRequestContext,
	Types as TCntx,
} from '../../modules/core/requestContext';


const GET_GAME_PERMISSION_REGEX =
  /^games:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}):get$/;

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

	@ApiQuery({
		name: 'status',
		enum: BillStatus,
		required: false,
	})
	@Get()
	public async getAll(@Query('status') status?: BillStatus) {
		let bills = [];
		const filter: FilterQuery<Bill> = {};
		status && Object.assign(filter, { status });
		const currentScp = this._reqCnTx.getScope();
		if (currentScp.includes('games:*:get')) {
			bills = await this._billSvc.find(filter);
		}
		else {
			bills = await this._findBillByGm(currentScp, filter, status);
		}
		return { bills };
	}

	private _findBillByGm(gmScp: string[], filter: FilterQuery<Bill>, status?: BillStatus): Promise<Bill[]> {
		const gameIds = gmScp
			.filter((scp) => GET_GAME_PERMISSION_REGEX.test(scp))
			.map((game) => game.split(':')[1]); // games:d1dd98ef-3e76-4ee1-122b-08dbe97f23ee:get'
		Object.assign(filter, {
			status,
			gameId: {
				$in: Array.from(new Set(gameIds)),
			},
		});
		return this._billSvc.find(filter);
	}

	@Post('create-bills')
	public fireBillCreation() {
		this._bgJobs.fireBillCreationJob();
	}
}
