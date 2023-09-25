import { Module } from '@nestjs/common';

import { HealthCheckController, IdpController } from './controllers';


@Module({
	imports: [],
	controllers: [HealthCheckController, IdpController],
	providers: [],
})
export class AppModule {}
