import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateResult } from 'mongodb';

import { DomainModels } from '../../../constants';
import { IGHubLogger, Types as TLog } from '../../../modules/core/logging';

import { CreateUserParam, IUserService, UpdateUserParam } from './types';
import { User, UserDocument } from './User';


@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectModel(DomainModels.USER) private readonly _userModel: Model<User>,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
	) {}

	public async removeScope(uid: string, scope: string[]): Promise<UpdateResult> {
		const usr = await this.findOne({ uid });
		if (!usr) throw new NotFoundException('User not exist');
		const usrScope = usr.scope.split(' ');
		for (const scp of scope) {
			const index = usrScope.indexOf(scp);
			usrScope.splice(index, 1);
		}
		return this._userModel.updateOne({ uid }, {
			scope: usrScope.join(' '),
		}, {
			new: true,
		});
	}

	public async addScope(uid: string, scope: string[]): Promise<UpdateResult> {
		const usr = await this.findOne({ uid });
		if (!usr) throw new NotFoundException('User not exist');
		return this._userModel.updateOne({ uid }, {
			scope: usr.scope + ' ' + scope.join(' '),
		}, {
			new: true,
		});
	}

	public async update(
		uid: string,
		updateUserParam: UpdateUserParam,
	): Promise<UpdateResult> {
		const usr = await this.findOne({ uid });
		if (!usr) throw new NotFoundException('User not exist');
		return this._userModel.updateOne({ uid }, updateUserParam, {
			new: true,
		});
	}

	public find(
		filter: FilterQuery<User>,
		projection?: ProjectionType<User>,
		options?: QueryOptions<User>,
	): Promise<UserDocument[]> {
		return this._userModel.find(filter, projection, options);
	}

	public findOne(
		filter: FilterQuery<User>,
		projection?: ProjectionType<User>,
		options?: QueryOptions<User> | null
	): Promise<UserDocument> {
		return this._userModel.findOne(filter, projection, options);
	}

	public create(createUserParam: CreateUserParam): Promise<UserDocument> {
		return this._userModel.create(createUserParam);
	}

	public count(filter?: FilterQuery<User>): Promise<number> {
		return this._userModel.count(filter);
	}
}
