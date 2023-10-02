import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import yamlLoader from './envLoader';
import { Types as TConfig } from './types';
import { AppConfigurationService } from './BootConfigService';
import validateEnv from './validateEnv';


export * from './BootConfigService';
export * from './types';


@Module({
	imports: [ConfigModule.forRoot({
		load: [yamlLoader],
		isGlobal: true,
		cache: true,
		expandVariables: true,
		validate: validateEnv,
	})],
	providers: [{
		provide: TConfig.CFG_SVC,
		useClass: AppConfigurationService,
	}],
	exports: [TConfig.CFG_SVC],
})
export class AppConfigurationModule {}
