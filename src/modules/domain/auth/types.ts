import { GrantTypes, TokenTypes } from '../../../common/contants';


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
	issueToken(authenticatedUser: AuthenticatedUser): Promise<AccessTokenResponse>,
}

export type AuthenticatedUser = {
	email: string,
	name: string,
	picture: string,
}

export type TokenPayload = {
	usr: string,
	auth_time: number,
	iat: number,
	scp: string[],
}
