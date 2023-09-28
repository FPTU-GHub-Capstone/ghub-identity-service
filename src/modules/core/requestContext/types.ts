export const enum Types {
	REQUEST_CONTEXT = 'requestContext:IRequestContext'
}

export interface IRequestContext {
	setCorrelationId(correlationId: string): void;
	getCorrelationId(): string;
}
