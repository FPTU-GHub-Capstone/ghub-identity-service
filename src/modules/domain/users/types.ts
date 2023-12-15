import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateResult } from 'mongodb';

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
	find(
		filter: FilterQuery<User>,
		projection?: ProjectionType<User>,
		options?: QueryOptions<User> | null,
	): Promise<UserDocument[]>;
	create(createUserParam: CreateUserParam): Promise<UserDocument>;
	count(filter?: FilterQuery<User>): Promise<number>;
	addScope(uid: string, scope: string[]): Promise<UpdateResult>;
	removeScope(uid: string, scope: string[]): Promise<UpdateResult>;
	update(uid: string, updateUserParam: UpdateUserParam): Promise<UpdateResult>;
}

export type UpdateUserParam = Partial<User>

export type CreateUserParam = Partial<User>
