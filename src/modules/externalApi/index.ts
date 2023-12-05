import { Module } from '@nestjs/common';

import { RequestContextModule } from '../core/requestContext';
import { AuthenticationModule } from '../domain/auth';

import { Types as TGame } from './types';
import { GameService } from './GameService';


export * from './GameService';
export * from './types';


@Module({
	imports: [RequestContextModule, AuthenticationModule],
	providers: [
		{
			provide: TGame.GAME_SVC,
			useClass: GameService,
		},
	],
	exports: [TGame.GAME_SVC],
})
export class ExternalApiModule {}
