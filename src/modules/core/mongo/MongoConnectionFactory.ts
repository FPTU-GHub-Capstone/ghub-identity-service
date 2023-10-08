import { Inject, Injectable } from '@nestjs/common';
import {
	MongooseModuleOptions,
	MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { AppConfigurationService, Types as TConfig } from '../configuration';


@Injectable()
export class MongoConnectionFactory implements MongooseOptionsFactory {
	constructor(@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService) {}

	public createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
		return {
			uri: this._cfgSvc.mdbConnectionString,
			dbName: this._cfgSvc.mdbDatabaseName,
		};
	}
}
