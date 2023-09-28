import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class BootConfigService {
	constructor(private _configService: ConfigService) {}

	public get GIT_SHA(): string {
		return this._configService.get('application.GIT_SHA');
	}

	public get NODE_ENV(): string {
		return this._configService.get('application.NODE_ENV');
	}
}
