import {
	Controller,
	Inject,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FirebaseAuthGuard, IAuthService, Types as TAuth } from '../../modules/domain/auth';

import * as dto from './ipdDto';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(
		@Inject(TAuth.AUTH_SVC) private readonly _authSvc: IAuthService,
	) {}

	@UseGuards(FirebaseAuthGuard)
	@Post('/authorize')
	public authorize(@Req() req: dto.FirebaseAuthenticatedRequest) {
		return this._authSvc.issueToken(req.user);
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
