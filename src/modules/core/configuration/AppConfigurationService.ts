import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AppConfigurationService {
	constructor(private _configService: ConfigService) {}

	public get gitSha(): string {
		return this._configService.get('application.GIT_SHA');
	}

	public get mdbUsername(): string {
		return this._configService.get('database.mongo.username');
	}

	public get mdbPassword(): string {
		return this._configService.get('database.mongo.password');
	}

	public get mdbConnectionString(): string {
		return this._configService.get('database.mongo.connection_string');
	}

	public get mdbDatabaseName(): string {
		return this._configService.get('database.mongo.name');
	}

	public get firebaseClientEmail(): string {
		return this._configService.get('database.mongo.name');
	}

	public get firebasePrivateKey(): string {
		return this._configService.get('database.mongo.name');
	}

	public get firebaseProjectId(): string {
		return this._configService.get('database.mongo.name');
	}
}
