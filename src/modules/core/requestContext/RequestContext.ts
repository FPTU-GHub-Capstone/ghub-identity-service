import { Injectable } from '@nestjs/common';
import * as httpContext from 'express-http-context';

import { IRequestContext } from './types';


@Injectable()
export class RequestContext implements IRequestContext {
	public setCorrelationId(correlationId: string): void {
		httpContext.set('correlationId', correlationId);
	}

	public getCorrelationId(): string {
		return httpContext.get('correlationId');
	}
}
