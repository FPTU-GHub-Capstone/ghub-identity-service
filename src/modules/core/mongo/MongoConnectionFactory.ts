import { Inject, Injectable } from '@nestjs/common';
import {
	MongooseModuleOptions,
	MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { BootConfigService, Types as TConfig } from '../configuration';


@Injectable()
export class MongoConnectionFactory implements MongooseOptionsFactory {
	constructor(@Inject(TConfig.CFG_SVC) private readonly _configSvc: BootConfigService) {}

	public createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
		return {
			uri: this._configSvc.MDB_CONNECTION_STRING,
			dbName: this._configSvc.MDB_NAME,
		};
	}
}
