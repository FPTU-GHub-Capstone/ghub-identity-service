import { Request } from 'express';


type FirebaseUser = {
	email: string,
}

export type FirebaseAuthenticatedRequest = Request & { user: FirebaseUser }
