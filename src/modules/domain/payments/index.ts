import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalApiModule } from 'src/modules/externalApi';

import { DomainModels } from '../../../constants';
import { UserModule } from '../users';
import { BillModule } from '../bills';

import { PaymentSchema } from './Payment';
import { Types as TPayment } from './types';
import { VnPayService } from './VnPayService';


export * from './Payment';
export * from './types';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: DomainModels.PAYMENT, schema: PaymentSchema },
		]),
		UserModule,
		BillModule,
		ExternalApiModule,
	],
	providers: [
		{
			provide: TPayment.PAYMENT_SVC,
			useClass: VnPayService,
		},
	],
	exports: [TPayment.PAYMENT_SVC],
})
export class PaymentModule {}
