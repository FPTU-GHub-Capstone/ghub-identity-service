import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DomainModels } from '../../constants';
import { GetUser } from '../../common/decorators';
import { HttpUser } from '../../types';
import {
	FirebaseAuthGuard,
	IAuthService,
	JwtAuthGuard,
	Types as TAuth,
} from '../../modules/domain/auth';
import { Types as TUser, UserService } from '../../modules/domain/users';

import * as dto from './ipdDto';


@ApiBearerAuth('Bearer')
@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(
		@Inject(TAuth.AUTH_SVC) private readonly _authSvc: IAuthService,
		@Inject(TUser.USR_SVC) private readonly _usrSvc: UserService,
	) {}

	@UseGuards(FirebaseAuthGuard)
	@Post('authorize')
	public async authorize(@Req() req: dto.FirebaseAuthenticatedRequest) {
		return await this._authSvc.issueUserToken(req.user);
	}

	@Post('login')
	public async login(@Body() loginDto: dto.LoginDto) {
		return await this._authSvc.login(loginDto);
	}

	@Post('register')
	public async register(@Body() registerDto: dto.RegisterDto) {
		return await this._authSvc.register(registerDto);
	}

	@UseGuards(JwtAuthGuard)
	@Post('oauth/token')
	public async issueToken(@GetUser() user: HttpUser, @Body() requestTokenDto: dto.RequestTokenDto) {
		return await this._authSvc.issueClientToken(user, requestTokenDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	public async getProfile(@GetUser() user: HttpUser) {
		return (await this._usrSvc.findOne({ uid: user.uid }, '-password')).populate({
			path: 'clients',
			strictPopulate: false,
		});
	}
}
