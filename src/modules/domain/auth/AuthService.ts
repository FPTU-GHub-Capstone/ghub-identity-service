import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { generateAlphaNumericId, randomHash } from '../../../shared/miscUtils';
import { IUserService, Types as TUser, UserDocument } from '../users';
import { AppConfigurationService, Types as TCfg } from '../../core/configuration';
import { TokenTypes } from '../../../common/contants';

import { AccessTokenResponse, AuthenticatedUser, IAuthService, TokenPayload } from './types';


const CLIENT_ID_SUBSTR_LENGTH = 4;
const CLIENT_ID_SUBSTR_PARTS = 6;
const CLIENT_SECRET_LENGTH = 30;

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
			return await this._usrSvc.create({
				...authenticatedUser,
				clientId: this._generateClientId(),
				clientSecret: randomHash(19),
				scope: this._cfgSvc.gmsDefaultScope,
			});
		}
		return usr;
	}

	private _generateClientId() {
		const strArr: string[] = [];
		for (let i = 0; i < CLIENT_ID_SUBSTR_PARTS; i++) {
			strArr.push(generateAlphaNumericId(CLIENT_ID_SUBSTR_LENGTH));
		}
		return strArr.join('-').toUpperCase();
	}


	private _genToken(user: UserDocument) {
		const now = Date.now();
		const payload: TokenPayload = {
			auth_time: now,
			iat: now,
			uid: user.clientId,
			usr: user.email,
			scp: user.scope.split(' '),
		};
		return this._jwtService.sign(payload);
	}
}
