import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../users';

import { FirebaseAuthStrategy } from './FirebaseAuthStrategy';
import { FirebaseAuthGuard } from './FirebaseAuthGuard';
import { JwtFactory } from './JwtFactory';
import { AuthService } from './AuthService';
import { Types as TAuth } from './types';


export * from './FirebaseAuthGuard';
export * from './types';

@Module({
	imports: [
		JwtModule.registerAsync({
			useClass: JwtFactory,
		}),
		UserModule,
	],
	providers: [
		FirebaseAuthStrategy,
		FirebaseAuthGuard,
		{
			provide: TAuth.AUTH_SVC,
			useClass: AuthService,
		},
	],
	exports: [TAuth.AUTH_SVC],
})
export class AuthenticationModule {};
