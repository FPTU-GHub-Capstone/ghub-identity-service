/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as XRequest } from 'express';
import { JwtService } from '@nestjs/jwt';

import { AppConfigurationService, Types as TCfg } from '../../core/configuration';
import { IS_PUBLIC_KEY } from '../../../constants';
import { IRequestContext, Types as TCntx } from '../../core/requestContext/types';


@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly _jwtService: JwtService,
		private readonly _reflector: Reflector,
		@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TCntx.REQUEST_CONTEXT) private readonly _reqCnTx: IRequestContext,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}
		const request: XRequest = context.switchToHttp().getRequest();
		const token = this._extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this._jwtService.verifyAsync(token, {
				secret: this._cfgSvc.jwtSecret,
				// ignoreExpiration: false, // some issue, verifyAsync not verify token is expired
			});
			if (payload.exp < Date.now()) {
				throw new UnauthorizedException();
			}

			request['user'] = payload;
			this._reqCnTx.setScope(payload.scp);
		}
		catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private _extractTokenFromHeader(request: XRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
