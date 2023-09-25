import {
	Controller,
	Inject,
	Logger,
	LoggerService,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Types as TLog } from '../../modules/core/logging';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(@Inject(TLog.LOGGER_SVC) private readonly _logger: LoggerService) {}

	@Post('/authorize')
	public authorize() {
		return { status: 'Ok' };
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
