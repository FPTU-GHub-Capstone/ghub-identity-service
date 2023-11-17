import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DomainModels } from '../../../constants';

import { ClientSchema } from './Client';


export * from './Client';


@Module({
	imports: [MongooseModule.forFeature([{ name: DomainModels.CLIENT, schema: ClientSchema }])],
})
export class ClientModule {}
