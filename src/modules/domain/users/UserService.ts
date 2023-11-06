import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { DomainModels } from '..';
import { IGHubLogger, Types as TLog } from '../../../modules/core/logging';

import { CreateUserDto, IUserService } from './types';
import { User, UserDocument } from './User';


@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectModel(DomainModels.USER) private readonly _userModel: Model<User>,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
	) {}

	public async findOne(
		filter: FilterQuery<UserDocument>,
		projection?: ProjectionType<UserDocument>,
		options?: QueryOptions<UserDocument> | null
	): Promise<UserDocument> {
		const user = await this._userModel.findOne(filter, projection, options);
		return user;
	}

	public create(createUserDto: CreateUserDto): Promise<UserDocument> {
		return this._userModel.create(createUserDto);
	}
}
