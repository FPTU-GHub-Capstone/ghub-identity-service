import { HttpUser } from '../../../types';
import { GrantTypes, TokenTypes } from '../../../constants';
import { User } from '../users';


export const enum Types {
	AUTH_SVC = 'domain:auth:AuthService'
}


export type AccessTokenResponse = {
	access_token: string,
	token_type: TokenTypes,
	expires_in?: number,
	scope?: string,
}

export type AccessTokenRequest = {
	grant_type: GrantTypes,
	scope?: string,
}

export type IAuthService = {
	exchangeToken(user: HttpUser): Promise<AccessTokenResponse>,
	issueUserToken(authenticatedUser: AuthenticatedUser): Promise<AccessTokenResponse>,
	login(loginParam: LoginParam): Promise<AccessTokenResponse>,
	register(registerParam: RegisterParam): Promise<User>,
	issueClientToken(user: HttpUser, issueClientTokenParam: IssueClientTokenParam): Promise<AccessTokenResponse>,
	issueServiceToken(scp: string[]): string,
}

export type IssueClientTokenParam = {
	grant_type: string,
	client_id: string,
	client_secret: string,
	scope: string,
}

export type AuthenticatedUser = {
	email: string,
	name: string,
	picture: string,
}

export type UserTokenPayload = {
	auth_time: number,
	iat: number,
	uid: string,
	scp: string[],
}

export type ClientTokenPayload = {
	auth_time: number,
	iat: number,
	uid: string,
	cid: string,
	gty: string,
	scp: string[],
}


export type ServiceTokenPayload = {
	auth_time: number,
	iat: number,
	sid: string,
	gty: string,
	scp: string[],
}

export type LoginParam = {
	username: string,
	password: string,
}

export class RegisterParam {
	public username: string;
	public password: string;
}
