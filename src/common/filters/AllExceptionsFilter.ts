import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { IGHubLogger, Types as TLog } from '../../modules/core/logging';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
		private readonly _httpAdapterHost: HttpAdapterHost
	) {}

	public catch(exception: unknown, host: ArgumentsHost): void {
		this._logger.error(exception as any);
		const { httpAdapter } = this._httpAdapterHost;
		const ctx = host.switchToHttp();
		let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		let responseBody: unknown = {
			statusCode: httpStatus,
			message: 'Internal Server Error',
			error: 'SERVER_ERROR',
		};
		if (exception instanceof HttpException) {
			httpStatus = exception.getStatus();
			responseBody = exception.getResponse();
		}
		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
