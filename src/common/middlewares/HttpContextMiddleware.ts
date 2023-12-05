import { BadRequestException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request as XRequest, Response as XResponse } from 'express';
import * as joi from 'joi';
import * as rTracer from 'cls-rtracer';

import { Headers } from '../../constants';
import { IRequestContext, Types as TCntx } from '../../modules/core/requestContext/types';


const errMsg = `HTTP header ${Headers.CORRELATION_ID} must be provided`;
const schema = joi.string().required().messages({
	'string.base': errMsg,
	'string.empty': errMsg,
	'any.required': errMsg,
});

@Injectable()
export class HttpContextMiddleware implements NestMiddleware {
	constructor(@Inject(TCntx.REQUEST_CONTEXT) private readonly _reqCnTx: IRequestContext) {}

	public use(req: XRequest, res: XResponse, next: NextFunction) {
		const correlationId = req.header(Headers.CORRELATION_ID) ?? <string>rTracer.id();
		const { value, error } = schema.validate(correlationId);
		if (error) {
			throw new BadRequestException(error.message);
		}
		this._setCorrelationId(res, value);
		next();
	}

	private _setCorrelationId(res: XResponse, correlationId: string) {
		this._reqCnTx.setCorrelationId(correlationId);
		res.header(Headers.CORRELATION_ID, correlationId);
	}
}
