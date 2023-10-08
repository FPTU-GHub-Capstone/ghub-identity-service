import {
	Controller,
	Inject,
	Post,
	Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IGHubLogger, Types as TLog } from '../../modules/core/logging';
import { AppConfigurationService, Types as TConfig } from '../../modules/core/configuration';
import { IUserService, Types as TUser } from '../../modules/domain/users';

import * as dto from './ipdDto';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
		@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TUser.USER_SVC) private readonly _usrSvc: IUserService,
	) {}

	@Post('/authorize')
	public authorize(@Req() req: dto.FirebaseAuthenticatedRequest) {
		console.log(req.user);
		console.log(this._cfgSvc);
		// return this._usrSvc.create(loginDto);
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
