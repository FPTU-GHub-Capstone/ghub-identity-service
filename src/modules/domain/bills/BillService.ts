import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'mongodb';
import {
	FilterQuery,
	Model,
	ProjectionType,
	QueryOptions,
} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { DomainModels } from '../../../constants';

import { IBillService } from './types';
import { Bill, BillDocument } from './Bill';


@Injectable()
export class BillService implements IBillService {
	constructor(
		@InjectModel(DomainModels.BILL) private readonly _billModel: Model<Bill>,
	) {}

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
