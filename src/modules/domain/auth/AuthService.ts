import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUserService, Types as TUser, UserDocument } from '../users';
import { AppConfigurationService, Types as TCfg } from '../../core/configuration';
import { TokenTypes } from '../../../common/contants';

import { AccessTokenResponse, AuthenticatedUser, IAuthService, TokenPayload } from './types';


@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private readonly _jwtService: JwtService,
		@Inject(TUser.USR_SVC) private readonly _usrSvc: IUserService,
		@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
	) {}

	public async 	issueToken(authenticatedUser: AuthenticatedUser): Promise<AccessTokenResponse> {
		const usr = await this._getUser(authenticatedUser);
		const token: AccessTokenResponse = {
			access_token: this._genToken(usr),
			token_type: TokenTypes.BEARER,
			expires_in: this._cfgSvc.jwtExpiresIn,
			scope: this._cfgSvc.gmsDefaultScope,
		};
		return token;
	}

	private async _getUser(authenticatedUser: AuthenticatedUser): Promise<UserDocument> {
		const usr = await this._usrSvc.findOne({ email: authenticatedUser.email });
		if (!usr) {
			return await this._usrSvc.create(authenticatedUser);
		}
		return usr;
	}

	private _genToken(user: UserDocument) {
		const now = Date.now();
		const payload: TokenPayload = {
			usr: user.email,
			auth_time: now,
			iat: now,
			scp: this._cfgSvc.gmsDefaultScope.split(' '),
		};
		return this._jwtService.sign(payload);
	}
}
