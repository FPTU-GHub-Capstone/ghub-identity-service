export const enum RequestHeaders {
	CORRELATION_ID = 'x-correlationid',
}

export enum GrantTypes {
	AUTHORIZATION_CODE = 'authorization_code',
	CLIENT_CREDENTIALS = 'client_credentials',
	PASSWORD = 'password',
}

export enum TokenTypes {
	BEARER = 'Bearer',
	MAC = 'MAC',
}

export const enum DomainModels {
	USER = 'User',
	CLIENT = 'Client'
}
