import { Module } from '@nestjs/common';

import { RequestContext } from './RequestContext';
import { Types as T } from './types';


export * from './types';

@Module({
	providers: [
		{
			provide: T.REQUEST_CONTEXT,
			useClass: RequestContext,
		},
	],
	exports: [T.REQUEST_CONTEXT],
})
export class RequestContextModule {}
