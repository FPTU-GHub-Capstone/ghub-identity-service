import { GrantTypes, TokenTypes } from '../../../common/constants';


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
	auth_time: number,
	iat: number,
	uid: string,
	usr: string,
	scp: string[],
}
