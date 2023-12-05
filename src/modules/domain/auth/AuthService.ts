/* eslint-disable max-params */
/* eslint-disable max-lines */
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { IUserService, Types as TUser, UserDocument } from '../users';
import { AppConfigurationService, Types as TCfg } from '../../core/configuration';
import { GrantTypes, TokenTypes } from '../../../constants';
import { randomHash } from '../../../shared/miscUtils';
import { HttpUser } from '../../../types';
import { IClientService, Types as TClient } from '../clients';

import {
	AccessTokenResponse,
	AuthenticatedUser,
	ClientTokenPayload,
	IAuthService,
	IssueClientTokenParam,
	LoginParam,
	RegisterParam,
	ServiceTokenPayload,
	UserTokenPayload,
} from './types';


@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private readonly _jwtService: JwtService,
		@Inject(TUser.USR_SVC) private readonly _usrSvc: IUserService,
		@Inject(TClient.CLIENT_SVC) private readonly _clientSvc: IClientService,
		@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
	) {}

	public async issueClientToken(
		user: HttpUser,
		issueClientTokenParam: IssueClientTokenParam,
	) {
		const {
			client_id: clientId,
			client_secret: clientSecret,
			scope,
		} = issueClientTokenParam;
		await this._validateClient(clientId, clientSecret, scope);
		const token: AccessTokenResponse = {
			access_token: this._genClientToken(user, issueClientTokenParam),
			token_type: TokenTypes.BEARER,
			expires_in: this._cfgSvc.jwtExpiresIn,
			scope: scope,
		};
		return token;
	}

	private async _validateClient(clientId: string, rawClientSecret: string, scope: string) {
		const client = await this._clientSvc.findOne({ clientId });
		if (! client) {
			throw new UnauthorizedException('Unable to find client or client is disabled');
		}
		const isMatch = await bcrypt.compare(rawClientSecret, client.hashedClientSecret);
		if (! isMatch) {
			throw new UnauthorizedException('Invalid client_id or client_secret');
		}
		const grantedScope = client.scope.split(' ');
		const invalidScope = scope.split(' ').filter((grant) => !grantedScope.includes(grant));
		if (invalidScope.length) {
			throw new UnauthorizedException('Request scopes exceed those granted by  the resource owner');
		}
	}

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
			scope: this._cfgSvc.gmsDefaultScope,
		});
	}

	public async login(loginParams: LoginParam): Promise<AccessTokenResponse> {
		const usr = await this._usrSvc.findOne({ username: loginParams.username });
		await this._validatePassword(usr, loginParams.password);
		const token: AccessTokenResponse = {
			access_token: this._genUserToken(usr),
			token_type: TokenTypes.BEARER,
			expires_in: this._cfgSvc.jwtExpiresIn,
			scope: usr.scope,
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

	public async issueUserToken(authenticatedUser: AuthenticatedUser): Promise<AccessTokenResponse> {
		const usr = await this._getAuthenticatedUser(authenticatedUser);
		const token: AccessTokenResponse = {
			access_token: this._genUserToken(usr),
			token_type: TokenTypes.BEARER,
			expires_in: this._cfgSvc.jwtExpiresIn,
			scope: usr.scope,
		};
		return token;
	}

	private async _getAuthenticatedUser(authenticatedUser: AuthenticatedUser): Promise<UserDocument> {
		let usr = await this._usrSvc.findOne({ email: authenticatedUser.email });

		if (!usr) {
			const uid = await this._generateUid();
			usr = await this._usrSvc.create({
				...authenticatedUser,
				uid,
				scope: this._cfgSvc.gmsDefaultScope,
			});
		}
		usr = await usr.populate({
			path: 'clients',
			strictPopulate: false,
		});
		return usr;
	}

	private async _generateUid() {
		return `D-${randomHash(6)}`;
	}

	private _genUserToken(usr: UserDocument) {
		const now = Date.now();
		const payload: UserTokenPayload = {
			auth_time: now,
			iat: now,
			uid: usr.uid,
			usr: usr.email,
			scp: usr.scope.split(' '),
		};
		return this._jwtService.sign(payload);
	}

	private _genClientToken(
		user: HttpUser,
		{ client_id: clientId, scope, grant_type: grantType }: IssueClientTokenParam,
	): string {
		const now = Date.now();
		const payload: ClientTokenPayload = {
			auth_time: now,
			iat: now,
			uid: user.uid,
			cid: clientId,
			gty: grantType,
			scp: scope.split(' '),
		};
		return this._jwtService.sign(payload);
	}

	public issueServiceToken(scp: string[]): string {
		const now = Date.now();
		const payload: ServiceTokenPayload = {
			auth_time: now,
			iat: now,
			sid: this._cfgSvc.appName,
			gty: GrantTypes.CLIENT_CREDENTIALS,
			scp: scp,
		};
		return this._jwtService.sign(payload);
	}
}
