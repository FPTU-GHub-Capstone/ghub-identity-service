import { Global, Module } from '@nestjs/common';
import { WinstonModule ,
	WinstonModuleOptions,
	utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { transports as wTransports, format } from 'winston';

import { getAppName } from '../../../shared/environmentUtils';

import { Types as TLog } from './types';
import { GHubLoggger } from './GHubLoggger';



export * from './types';

const winstonModuleOptions: WinstonModuleOptions = {
	transports: new wTransports.Console({
		format: format.combine(
			format.timestamp(),
			format.ms(),
			nestWinstonModuleUtilities.format.nestLike(getAppName(), {
				colors: true,
				prettyPrint: true,
			}),
		),
	}),
};

@Global()
@Module({
	imports: [WinstonModule.forRoot(winstonModuleOptions)],
	providers: [
		{
			provide: TLog.LOGGER_SVC,
			useClass: GHubLoggger,
		},
	],
})
export class LoggingModule {}
