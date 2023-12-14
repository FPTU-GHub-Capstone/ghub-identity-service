import { Controller, Get, Inject } from '@nestjs/common';

import {
	AppConfigurationService,
	Types as TConfig,
} from '../modules/core/configuration';


@Controller()
export class HealthCheckController {
	constructor(
		@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService
	) {}

	@Get('/health')
	public getHealth() {
		return { status: 'Ok' };
	}

	@Get('/env')
	public getEnv() {
		return {
			GIT_SHA: this._cfgSvc.gitSha,
			NODE_ENV: process.env.NODE_ENV,
		};
	}
}
