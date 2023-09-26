import {
	Controller,
	Inject,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IGHubLogger, Types as TLog } from '../../modules/core/logging';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger) {}

	@Post('/authorize')
	public authorize() {
		return { status: 'Ok' };
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
