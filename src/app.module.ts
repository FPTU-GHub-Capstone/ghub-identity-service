import { Logger, Module } from '@nestjs/common';

import { HealthCheckController, IdpController } from './controllers';
import { LoggingModule } from './modules/core/logging';


@Module({
	imports: [LoggingModule],
	controllers: [HealthCheckController, IdpController],
	providers: [Logger],
})
export class AppModule {}
