import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FIREBASE_STRATEGY_NAME } from '../../../constants';


@Injectable()
export class FirebaseAuthGuard extends AuthGuard(FIREBASE_STRATEGY_NAME) {
	constructor() {
		super();
	}
	public canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}
}
