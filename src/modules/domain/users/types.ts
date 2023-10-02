import { UserDocument } from './userEntity';


export const enum Types {
	USER_SVC = 'business:users:IUserService',
}

export interface IUserService {
	create(createUserDto: CreateUserDto): Promise<UserDocument>;
}

export type CreateUserDto = PasswordLoginUser | EmailLoginUser

export type PasswordLoginUser = {
	username: string,
	password: string,
}

export type EmailLoginUser = {
	email: string,
}
