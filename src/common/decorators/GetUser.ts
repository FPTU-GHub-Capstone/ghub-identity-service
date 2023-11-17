import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { HttpUser } from '../../types';


export const GetUser = createParamDecorator(
	(_data, ctx: ExecutionContext): HttpUser => {
		const req = ctx.switchToHttp().getRequest();
		return req['user'] as HttpUser;
	},
);
