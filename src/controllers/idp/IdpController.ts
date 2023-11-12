import {
	Body,
	Controller,
	Get,
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

	@Post('login')
	public login(@Body() loginDto: dto.LoginDto) {
		return { status: 'Ok' };
	}

	@Post('register')
	public register(@Body() loginDto: dto.RegisterDto) {
		return { status: 'Ok' };
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}

	@Get('/profile')
	public getProfile() {
		return { status: 'Ok' };
	}
}
