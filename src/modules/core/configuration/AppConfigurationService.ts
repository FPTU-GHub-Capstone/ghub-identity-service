import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { sanitizeFirebaseCert } from '../../../shared/miscUtils';


@Injectable()
export class AppConfigurationService {
	constructor(private _configService: ConfigService) {}

	public get port(): string {
		return this._configService.get('http.port');
	}

	public get gitSha(): string {
		return this._configService.get('application.GIT_SHA');
	}

	public get gmsDefaultScope(): string {
		return this._configService.get('application.gms_default_scope');
	}

	public get jwtExpiresIn(): number {
		return this._configService.get('application.jwt_expires_in');
	}

	public get jwtSecret(): string {
		return this._configService.get('application.jwt_secret');
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
		return this._configService.get('firebase.client_email');
	}

	public get firebasePrivateKey(): string {
		return sanitizeFirebaseCert(this._configService.get('firebase.private_key'));
	}

	public get firebaseProjectId(): string {
		return this._configService.get('firebase.project_id');
	}
}
