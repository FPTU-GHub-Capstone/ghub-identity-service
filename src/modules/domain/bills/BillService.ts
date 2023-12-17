/* eslint-disable max-lines-per-function */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'mongodb';
import {
	Document,
	FilterQuery,
	Model,
	ProjectionType,
	QueryOptions,
	Types,
	UpdateQuery,
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

	public async findByUser(billIds?: string[], status?: BillStatus): Promise<BillDocument[]> {
		let bills: BillDocument[] = [];
		const sort: any = {
			status: '-1', // DESC of mongo
		};
		const filter: FilterQuery<BillDocument> = {};
		this._handleQueryByBillIds(filter, billIds);
		this._handleQueryByStatus(filter, status);
		const currentScp = this._reqCnTx.getScope();
		if (currentScp.includes('games:*:get')) {
			bills = await this.find(filter, undefined, { sort });
		}
		else {
			bills = await this._findBillByGm(currentScp, filter, sort);
		}
		return bills;
	}

	private _handleQueryByStatus(filter: FilterQuery<BillDocument>, status?: BillStatus) {
		status && Object.assign(filter, { status });
	}

	private _handleQueryByBillIds(filter: FilterQuery<BillDocument>, billIds?: string[]) {
		billIds && billIds.length && Object.assign(filter, {
			_id: {
				$in: billIds,
			},
		},);
	}

	private async _findBillByGm(
		gmScp: string[],
		filter: FilterQuery<BillDocument>,
		sort: any
	): Promise<BillDocument[]> {
		const gameIds = gmScp
			.filter((scp) => GET_GAME_PERMISSION_REGEX.test(scp))
			.map((game) => game.split(':')[1]); // games:d1dd98ef-3e76-4ee1-122b-08dbe97f23ee:get'
		Object.assign(filter, {
			gameId: {
				$in: Array.from(new Set(gameIds)),
			},
		});
		return this.find(filter, undefined, { sort });
	}

	public findOne(
		filter: FilterQuery<BillDocument>,
		projection?: ProjectionType<BillDocument>,
		options?: QueryOptions<BillDocument>,
	): Promise<BillDocument> {
		return this._billModel.findOne(filter, projection, options);
	}
	public find(
		filter: FilterQuery<BillDocument>,
		projection?: ProjectionType<BillDocument>,
		options?: QueryOptions<Bill>,
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

	public async updateMany(
		filter: FilterQuery<BillDocument>,
		update?: UpdateQuery<BillDocument>,
		options?: QueryOptions<BillDocument>
	): Promise<void> {
		await this._billModel.updateMany(filter, update, options);
	}
}
