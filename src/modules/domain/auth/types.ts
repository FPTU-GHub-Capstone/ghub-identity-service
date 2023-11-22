import { HttpUser } from '../../../types';
import { GrantTypes, TokenTypes } from '../../../constants';


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
	issueUserToken(authenticatedUser: AuthenticatedUser): Promise<AccessTokenResponse>,
	login(loginParam: LoginParam): Promise<AccessTokenResponse>,
	register(registerParam: RegisterParam): Promise<void>,
	issueClientToken(user: HttpUser, issueClientTokenParam: IssueClientTokenParam): Promise<AccessTokenResponse>,
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
	usr: string,
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

export type LoginParam = {
	username: string,
	password: string,
}

export class RegisterParam {
	public username: string;
	public password: string;
}
