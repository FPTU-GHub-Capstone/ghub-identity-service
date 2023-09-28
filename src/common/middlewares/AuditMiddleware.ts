import { Injectable, NestMiddleware, Logger, Inject } from '@nestjs/common';
import { Request as XRequest, Response as XResponse, NextFunction } from 'express';

import { IGHubLogger, Types as TLog } from '../../modules/core/logging';


@Injectable()
export class AuditMiddleware implements NestMiddleware {
	constructor(
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
	) {}

	public use(request: XRequest, response: XResponse, next: NextFunction): void {
		const { ip, method, originalUrl: url } = request;
		const userAgent = request.get('user-agent') || '';

		response.on('close', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');

			this._logger.log(
				`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
			);
		});

		next();
	}
}
