import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { AppConfigurationService, Types as TCfg } from '../../core/configuration';


@Injectable()
export class JwtFactory implements JwtOptionsFactory {
	constructor(@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService) {}

	public createJwtOptions(): JwtModuleOptions {
		return {
			global: true,
			signOptions: { expiresIn: this._cfgSvc.jwtExpiresIn },
			secret: this._cfgSvc.jwtSecret,
		};
	}
}
