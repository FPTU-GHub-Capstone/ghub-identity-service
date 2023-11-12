import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { generateAlphaNumericId, randomHash } from '../../../shared/miscUtils';
import { IUserService, Types as TUser, UserDocument } from '../users';
import { AppConfigurationService, Types as TCfg } from '../../core/configuration';
import { TokenTypes, DomainModels } from '../../../common/constants';

import { AccessTokenResponse, AuthenticatedUser, IAuthService, LoginParam, RegisterParam, TokenPayload } from './types';


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
	public async register(registerParams: RegisterParam): Promise<void> {
		const usr = await this._usrSvc.findOne({ username: registerParams.username });
		if (usr) {
			throw new BadRequestException('User exist');
		}
		const uid = await this._generateUid();
		await this._usrSvc.create({
			username: registerParams.username,
			password: await bcrypt.hash(registerParams.password, 8),
			uid,
		});
	}

	public async login(loginParams: LoginParam): Promise<AccessTokenResponse> {
		const usr = await(
			await this._usrSvc.findOne({ username: loginParams.username })
		).populate({
			path: DomainModels.CLIENT,
			strictPopulate: false,
		});
		await this._validatePassword(usr, loginParams.password);
		const token: AccessTokenResponse = {
			access_token: this._genUserToken(usr),
			token_type: TokenTypes.BEARER,
			expires_in: this._cfgSvc.jwtExpiresIn,
			scope: this._getUserScope(usr).join(' '),
		};
		return token;
	}

	private async _validatePassword(usr: UserDocument, rawPassword: string) {
		if (! usr) {
			throw new UnauthorizedException();
		}
		const isMatch = await bcrypt.compare(rawPassword, usr.password);
		if (! isMatch) {
			throw new UnauthorizedException();
		}
	}

	public async issueToken(authenticatedUser: AuthenticatedUser): Promise<AccessTokenResponse> {
		const usr = await this._getAuthenticatedUser(authenticatedUser);
		const token: AccessTokenResponse = {
			access_token: this._genUserToken(usr),
			token_type: TokenTypes.BEARER,
			expires_in: this._cfgSvc.jwtExpiresIn,
			scope: this._getUserScope(usr).join(' '),
		};
		return token;
	}

	private async _getAuthenticatedUser(authenticatedUser: AuthenticatedUser): Promise<UserDocument> {
		let usr = await (
			await this._usrSvc.findOne({ email: authenticatedUser.email })
		).populate({
			path: DomainModels.CLIENT,
			strictPopulate: false,
		});
		if (!usr) {
			const uid = await this._generateUid();
			usr = await this._usrSvc.create({
				...authenticatedUser,
				uid,
				// clientId: this._generateClientId(),
				// clientSecret: randomHash(CLIENT_SECRET_LENGTH),
				// scope: this._cfgSvc.gmsDefaultScope,
			});
		}
		usr.clients = usr.clients ?? [];
		return usr;
	}

	private async _generateUid() {
		const numOfUsers = await this._usrSvc.count();
		return `D${numOfUsers + 1}`;
	}

	private _generateClientId() {
		const strArr: string[] = [];
		for (let i = 0; i < CLIENT_ID_SUBSTR_PARTS; i++) {
			strArr.push(generateAlphaNumericId(CLIENT_ID_SUBSTR_LENGTH));
		}
		return strArr.join('-').toUpperCase();
	}

	private _genUserToken(user: UserDocument) {
		const now = Date.now();
		const payload: TokenPayload = {
			auth_time: now,
			iat: now,
			uid: user.uid,
			usr: user.email,
			scp: this._getUserScope(user),
		};
		return this._jwtService.sign(payload);
	}

	private _getUserScope(user: UserDocument): string[] {
		const defaultScope = this._cfgSvc.gmsDefaultScope.split(' ');
		const clientScope = user.clients.map((client) => client.scope.split(' ')).flat();
		return Array.from(new Set(defaultScope.concat(clientScope)));
	}
}
