export const enum Headers {
	CORRELATION_ID = 'x-correlationid',
	AUTHORIZATION = 'Authorization',
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
	CLIENT = 'Client',
	BILL = 'Bill'
}

export const IS_PUBLIC_KEY = 'gis:isPublic';
export const FIREBASE_STRATEGY_NAME = 'firebase-auth';
