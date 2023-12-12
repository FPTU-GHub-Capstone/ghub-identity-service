import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalApiModule } from 'src/modules/externalApi';

import { DomainModels } from '../../../constants';

import { BillSchema } from './Bill';
import { BillProcessJobs } from './BillProcessJobs';
import { Types as TBill } from './types';
import { BillService } from './BillService';


export * from './Bill';
export * from './BillProcessJobs';
export * from './types';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: DomainModels.BILL, schema: BillSchema },
		]),
		ExternalApiModule,
	],
	providers: [
		{
			provide: TBill.BILL_PROCESS_JOBS,
			useClass: BillProcessJobs,
		},
		{
			provide: TBill.BILL_SVC,
			useClass: BillService,
		},
	],
	exports: [TBill.BILL_PROCESS_JOBS, TBill.BILL_SVC],
})
export class BillModule {}
