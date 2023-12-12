import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateResult } from 'mongodb';

import { Bill, BillDocument, BillStatus } from './Bill';


export const enum Types {
	BILL_PROCESS_JOBS = 'domain:bills:IGHubJobs',
	BILL_SVC = 'domain:bills:IBillService',
}

export interface IGHubJobs {
	fireBillCreationJob(): void;
}

export interface IBillService {
	findByUser(status?: BillStatus): Promise<BillDocument[]>;
	findOne(
		filter: FilterQuery<BillDocument>,
		projection?: ProjectionType<Bill>,
		options?: QueryOptions<Bill> | null,
	): Promise<BillDocument>;
	find(
		filter: FilterQuery<BillDocument>,
		projection?: ProjectionType<Bill> | null,
		options?: QueryOptions<Bill> | null,
	): Promise<BillDocument[]>;
	update(id: string, updateBillParam: UpdateBillParam): Promise<UpdateResult>;
}


export type UpdateBillParam = Partial<Bill>;
