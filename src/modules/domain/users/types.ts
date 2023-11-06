import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

import { UserDocument } from './User';


export const enum Types {
	USR_SVC = 'domain:users:IUserService',
}

export interface IUserService {
	findOne(
		filter: FilterQuery<UserDocument>,
		projection?: ProjectionType<UserDocument>,
		options?: QueryOptions<UserDocument> | null,
	): Promise<UserDocument>;
	create(createUserDto: CreateUserDto): Promise<UserDocument>;
}

export type CreateUserDto = {
	name: string,
	email: string,
	picture: string,
};
