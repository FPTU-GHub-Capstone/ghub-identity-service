import { Global, Module } from '@nestjs/common';
import { WinstonModule ,
	WinstonModuleOptions,
	utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { transports as wTransports, format as wFormat } from 'winston';
import winston from 'winston/lib/winston/config';

import { getAppName } from '../../../shared/environmentUtils';
import { RequestContextModule } from '../requestContext';

import { Types as TLog } from './types';
import { GHubLogger } from './GHubLoggger';



export * from './types';

const winstonModuleOptions: WinstonModuleOptions = {
	format: wFormat.combine(
		wFormat.label({ label: getAppName() }),
		wFormat.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		wFormat.errors({ stack: true }),
		wFormat.splat(),
		wFormat.json()
	),
	transports: new wTransports.Console({
		format: wFormat.combine(
			wFormat.ms(),
			nestWinstonModuleUtilities.format.nestLike(getAppName(), {
				colors: true,
				prettyPrint: true,
			}),
		),
	}),
	exitOnError: false,
};

@Global()
@Module({
	imports: [WinstonModule.forRoot(winstonModuleOptions), RequestContextModule],
	providers: [
		{
			provide: TLog.LOGGER_SVC,
			useClass: GHubLogger,
		},
	],
	exports: [TLog.LOGGER_SVC]
})
export class LoggingModule {}
