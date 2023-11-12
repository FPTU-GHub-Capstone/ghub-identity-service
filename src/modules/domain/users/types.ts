import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

import { User, UserDocument } from './User';


export const enum Types {
	USR_SVC = 'domain:users:IUserService',
}

export interface IUserService {
	findOne(
		filter: FilterQuery<User>,
		projection?: ProjectionType<User>,
		options?: QueryOptions<User> | null,
	): Promise<UserDocument>;
	create(createUserDto: CreateUserDto): Promise<UserDocument>;
	count(filter?: FilterQuery<User>): Promise<number>;
}

export type CreateUserDto = Partial<User>
