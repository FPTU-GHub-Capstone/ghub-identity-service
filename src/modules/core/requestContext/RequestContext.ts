import { Injectable } from '@nestjs/common';
import * as httpContext from 'express-http-context';

import { IRequestContext } from './types';


@Injectable()
export class RequestContext implements IRequestContext {
	public setCorrelationId(correlationId: string): void {
		httpContext.set('correlationId', correlationId);
	}

	public setScope(scope: string[]): void {
		httpContext.set('scope', scope);
	}

	public getCorrelationId(): string {
		return httpContext.get('correlationId');
	}

	public getScope(): string[] {
		return httpContext.get('scope');
	}
}
