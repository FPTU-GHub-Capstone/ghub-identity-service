import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { DomainModels } from '../../../common/constants';
import { IGHubLogger, Types as TLog } from '../../../modules/core/logging';

import { CreateUserDto, IUserService } from './types';
import { User, UserDocument } from './User';


@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectModel(DomainModels.USER) private readonly _userModel: Model<User>,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
	) {}

	public findOne(
		filter: FilterQuery<User>,
		projection?: ProjectionType<User>,
		options?: QueryOptions<User> | null
	): Promise<UserDocument> {
		return this._userModel.findOne(filter, projection, options);
	}

	public create(createUserDto: CreateUserDto): Promise<UserDocument> {
		return this._userModel.create(createUserDto);
	}

	public count(filter?: FilterQuery<User>): Promise<number> {
		return this._userModel.count(filter);
	}
}
