import {
	Controller,
	Inject,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { IGHubLogger, Types as TLog } from '../../modules/core/logging';
import { Types as TConfig, BootConfigService } from '../../modules/core/configuration';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
		@Inject(TConfig.CFG_SVC) private readonly _config: BootConfigService
	) {}

	@Post('/authorize')
	public authorize() {
		return { status: 'Ok', node_env: this._config.NODE_ENV };
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
