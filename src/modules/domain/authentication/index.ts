import { Module } from '@nestjs/common';

import { FirebaseAuthStrategy } from './FirebaseAuthStrategy';
import { FirebaseAuthGuard } from './services/firebase-auth.guard';


export * from './services/firebase-auth.guard';

@Module({
	providers: [
		FirebaseAuthStrategy,
		FirebaseAuthGuard,
	],
})
export class AuthenticationModule {};
