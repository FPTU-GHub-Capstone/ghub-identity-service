import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import firebase, { app as FirebaseApp } from 'firebase-admin';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';

import {
	AppConfigurationService,
	Types as TConfig,
} from '../../core/configuration';
import { Types as TLog, IGHubLogger } from '../../core/logging';


@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
	Strategy,
	'firebase-auth',
) {
	private _firebaseApp: FirebaseApp.App;

	constructor(
		@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
		this._firebaseApp = firebase.initializeApp({
			credential: firebase.credential.cert({
				clientEmail: this._cfgSvc.firebaseClientEmail,
				privateKey: this._cfgSvc.firebasePrivateKey,
				projectId: this._cfgSvc.firebaseProjectId,
			}),
		});
	}

	public async validate(token: string) {
		try {
			const firebaseUser = await this._firebaseApp.auth().verifyIdToken(token, true);
			if (!firebaseUser) {
				throw new UnauthorizedException('Invalid user');
			}
			return firebaseUser;
		}
		catch (error) {
			this._logger.error('Login fail', error);
			throw new UnauthorizedException(error.message);
		}
	}
}
