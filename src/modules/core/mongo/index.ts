import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoConnectionFactory } from './MongoConnectionFactory';


@Module({
	imports: [
		MongooseModule.forRootAsync({
			useClass: MongoConnectionFactory,
		})],
	providers: [MongoConnectionFactory],
})
export class MongoModule {}
