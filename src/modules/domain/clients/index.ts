import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DomainModels } from '../../../constants';

import { ClientSchema } from './Client';
import { Types as TClient } from './types';
import { ClientService } from './ClientService';


export * from './Client';
export * from './types';


@Module({
	imports: [MongooseModule.forFeature([{ name: DomainModels.CLIENT, schema: ClientSchema }])],
	providers: [
		{
			provide: TClient.CLIENT_SVC,
			useClass: ClientService,
		},
	],
	exports: [TClient.CLIENT_SVC],
})
export class ClientModule {}
