import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { IUserService, Types as TUser, UserDocument } from '../users';
import { AppConfigurationService, Types as TCfg } from '../../core/configuration';
import { TokenTypes } from '../../../constants';
import { randomHash } from '../../../shared/miscUtils';

import { AccessTokenResponse, AuthenticatedUser, IAuthService, LoginParam, RegisterParam, TokenPayload } from './types';


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
			path: 'clients',
			strictPopulate: false,
		});
		usr.clients = usr.clients ?? [];
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
			path: 'clients',
			strictPopulate: false,
		});
		if (!usr) {
			const uid = await this._generateUid();
			usr = await this._usrSvc.create({
				...authenticatedUser,
				uid,
			});
		}
		usr.clients = usr.clients ?? [];
		return usr;
	}

	private async _generateUid() {
		return `D-${randomHash(6)}`;
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
