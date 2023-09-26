export const enum Types {
	REQUEST_CONTEXT = 'core:requestContext'
}

export interface IRequestContext {
	setCorrelationId(correlationId: string): void;
	getCorrelationId(): string;
}
