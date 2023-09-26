import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { IRequestContext, Types as TCntx } from '../requestContext';
import { getAppInfo } from '../../../shared/environmentUtils';

import { IGHubLogger } from './types';


@Injectable()
export class GHubLogger implements LoggerService, IGHubLogger {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
		@Inject(TCntx.REQUEST_CONTEXT) private readonly _reqCnTx: IRequestContext
	) {}

	public log(message: any, payload?: object) {
		this._writeLog('info', message, payload);
	}

	public error(message: any, payload?: object) {
		let errPayload: any;
		if (payload && payload instanceof Error && !Object.getOwnPropertyDescriptor(payload, 'stack').enumerable) {
			Object.defineProperty(payload, 'stack', { enumerable: true });
			errPayload = this._preparePayload(payload);
			Object.defineProperty(payload, 'stack', { enumerable: false });
		}
		else {
			errPayload = this._preparePayload(payload);
		}
		this._logger.error(message, errPayload);
	}

	public warn(message: any, payload?: object) {
		this._writeLog('warn', message, payload);
	}

	public debug(message: any, payload?: object) {
		this._writeLog('debug', message, payload);
	}

	private _writeLog(logFn: 'info' | 'debug' | 'warn', msg: string, payload: any) {
		this._logger[logFn].call(this._logger, msg, this._preparePayload(payload));
	}

	public _preparePayload(payload: any) {
		const appInfo = getAppInfo();
		const logPayload = {
			correlationId: this._reqCnTx.getCorrelationId(),
			...appInfo,
			...payload,
		};
		return logPayload;
	}
}
