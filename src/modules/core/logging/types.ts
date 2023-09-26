export const enum Types {
	LOGGER_SVC = 'logging:ILoggerService',
}

export interface IGHubLogger {
	log(message: any, payload?: object): void;
	error(message: any, payload?: object): void;
	warn(message: any, payload?: object): void;
	debug(message: any, payload?: object): void;
}
