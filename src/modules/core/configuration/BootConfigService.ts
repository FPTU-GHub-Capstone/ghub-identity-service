import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AppConfigurationService {
	constructor(private _configService: ConfigService) {}

	public get GIT_SHA(): string {
		return this._configService.get('application.GIT_SHA');
	}

	public get NODE_ENV(): string {
		return this._configService.get('application.NODE_ENV');
	}

	public get MDB_USERNAME(): string {
		return this._configService.get('database.mongo.username');
	}

	public get MDB_PASSWORD(): string {
		return this._configService.get('database.mongo.password');
	}

	public get MDB_CONNECTION_STRING(): string {
		return this._configService.get('database.mongo.connection_string');
	}

	public get MDB_NAME(): string {
		return this._configService.get('database.mongo.name');
	}
}
