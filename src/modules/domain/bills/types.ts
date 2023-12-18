import { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import { UpdateResult } from 'mongodb';

import { Bill, BillDocument, BillStatus } from './Bill';


export const enum Types {
	BILL_PROCESS_JOBS = 'domain:bills:IGHubJobs',
	BILL_SVC = 'domain:bills:IBillService',
}

export interface IGHubJobs {
	fireBillCreationJob(): void;
	fireBillOverdueJob(): void;
	fireBillBillReminderJob(): void;
}

export interface IBillService {
	findByUser(billIds?: string[], status?: BillStatus, gameId?: string): Promise<BillDocument[]>;
	findOne(
		filter: FilterQuery<BillDocument>,
		projection?: ProjectionType<BillDocument>,
		options?: QueryOptions<BillDocument>,
	): Promise<BillDocument>;
	find(
		filter: FilterQuery<BillDocument>,
		projection?: ProjectionType<BillDocument>,
		options?: QueryOptions<BillDocument>,
	): Promise<BillDocument[]>;
	update(id: string, updateBillParam: UpdateBillParam): Promise<UpdateResult>;
	updateMany(
		filter: FilterQuery<BillDocument>,
		update?: UpdateQuery<BillDocument>,
		options?: QueryOptions<BillDocument>
	): Promise<void>;
}


export type UpdateBillParam = Partial<Bill>;
