import { Request } from 'express';


type FirebaseUser = {
	email: string,
	name: string,
	picture: string,
}

export type FirebaseAuthenticatedRequest = Request & { user: FirebaseUser }
