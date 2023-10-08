import { Module } from '@nestjs/common';


import { FirebaseAuthStrategy } from './FirebaseAuthStrategy';
import { FirebaseAuthGuard } from './firebase-auth.guard';


export * from './firebase-auth.guard';

@Module({
	providers: [
		FirebaseAuthStrategy,
		FirebaseAuthGuard,
	],
})
export class AuthenticationModule {};
