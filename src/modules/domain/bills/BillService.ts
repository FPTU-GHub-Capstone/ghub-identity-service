import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'mongodb';
import {
	Document,
	FilterQuery,
	Model,
	ProjectionType,
	QueryOptions,
	Types,
} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { DomainModels } from '../../../constants';
import {
	IRequestContext,
	Types as TCntx,
} from '../../core/requestContext';

import { IBillService } from './types';
import { Bill, BillDocument, BillStatus } from './Bill';


const GET_GAME_PERMISSION_REGEX =
  /^games:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}):get$/;

@Injectable()
export class BillService implements IBillService {
	constructor(
		@InjectModel(DomainModels.BILL) private readonly _billModel: Model<Bill>,
		@Inject(TCntx.REQUEST_CONTEXT) private readonly _reqCnTx: IRequestContext,
	) {}

	public async findByUser(status?: BillStatus): Promise<BillDocument[]> {
		let bills: BillDocument[] = [];
		const filter: FilterQuery<Bill> = {};
		status && Object.assign(filter, { status });
		const currentScp = this._reqCnTx.getScope();
		if (currentScp.includes('games:*:get')) {
			bills = await this.find(filter);
		}
		else {
			bills = await this._findBillByGm(currentScp, filter);
		}
		return bills;
	}

	private async _findBillByGm(
		gmScp: string[],
		filter: FilterQuery<Bill>,
	): Promise<BillDocument[]> {
		const gameIds = gmScp
			.filter((scp) => GET_GAME_PERMISSION_REGEX.test(scp))
			.map((game) => game.split(':')[1]); // games:d1dd98ef-3e76-4ee1-122b-08dbe97f23ee:get'
		Object.assign(filter, {
			gameId: {
				$in: Array.from(new Set(gameIds)),
			},
		});
		return this.find(filter);
	}

	public findOne(
		filter: FilterQuery<Bill>,
		projection?: ProjectionType<Bill>,
		options?: QueryOptions<Bill> | null,
	): Promise<BillDocument> {
		return this._billModel.findOne(filter, projection, options);
	}
	public find(
		filter: FilterQuery<Bill>,
		projection?: ProjectionType<Bill>,
		options?: QueryOptions<Bill> | null,
	): Promise<BillDocument[]> {
		return this._billModel.find(filter, projection, options);
	}
	public async update(
		id: string,
		updateBillParam: Partial<Bill>,
	): Promise<UpdateResult> {
		const bill = await this.findOne({ _id: id });
		if (!bill) throw new NotFoundException('Bill not exist');
		return this._billModel.updateOne(
			{ _id: id },
			updateBillParam,
			{
				new: true,
			},
		);
	}
}
