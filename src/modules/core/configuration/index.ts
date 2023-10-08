import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import yamlLoader from './envConfig';
import { Types as TConfig } from './types';
import { AppConfigurationService } from './AppConfigurationService';


export * from './AppConfigurationService';
export * from './types';


@Global()
@Module({
	imports: [ConfigModule.forRoot({
		load: [yamlLoader],
		isGlobal: true,
		cache: true,
		expandVariables: true,
	})],
	providers: [{
		provide: TConfig.CFG_SVC,
		useClass: AppConfigurationService,
	}],
	exports: [TConfig.CFG_SVC],
})
export class AppConfigurationModule {}
