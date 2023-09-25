import { Inject, Injectable, LogLevel, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


@Injectable()
export class GHubLoggger implements LoggerService {
	constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger) {}

	public log(message: any) {
		this._logger.info(message);
	}

	public error(message: any) {
		this._logger.error(message);
	}

	public warn(message: any) {
		this._logger.warn(message);
	}

	public debug?(message: any) {
		this._logger.debug(message);
	}
}