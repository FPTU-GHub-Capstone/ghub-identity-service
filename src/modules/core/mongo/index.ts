import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigurationModule, AppConfigurationService } from '../configuration';

import { MongoConnectionFactory } from './MongoConnectionFactory';


@Module({
	imports: [
		AppConfigurationModule,
		MongooseModule.forRootAsync({
			imports: [AppConfigurationModule],
			inject: [AppConfigurationService],
			useClass: MongoConnectionFactory,
		})],
	providers: [MongoConnectionFactory],
})
export class MongoModule {}
