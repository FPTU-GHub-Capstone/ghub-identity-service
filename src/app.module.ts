import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as httpContext from 'express-http-context';

import { HealthCheckController, IdpController } from './controllers';
import { LoggingModule } from './modules/core/logging';
import { RequestContextModule } from './modules/core/requestContext';
import { HttpContextMiddleware } from './common/middlewares/HttpContextMiddleware';
import { tracerMiddleware } from './common/middlewares/tracerMiddleware';
import { AppConfigurationModule } from './modules/core/configuration';


@Module({
	imports: [
		AppConfigurationModule,
		RequestContextModule,
		LoggingModule,
	],
	controllers: [HealthCheckController, IdpController],
	providers: [Logger],
})
export class AppModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				httpContext.middleware,
				tracerMiddleware,
				HttpContextMiddleware
			)
			.forRoutes(IdpController);
	}
}
