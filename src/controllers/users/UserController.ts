import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';

import { JwtAuthGuard } from '../../modules/domain/auth';
import { IUserService, Types as TUser, User } from '../../modules/domain/users';

import * as dto from './userDto';


@ApiBearerAuth('Bearer')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/users')
export class UserController {
	constructor(
		@Inject(TUser.USR_SVC) private readonly _usrSvc: IUserService,
	) {}

	@ApiQuery({
		name: 'email',
		type: String,
		required: false,
	})
	@Get()
	public async getAll(@Query('email') email?: string) {
		const filter: FilterQuery<User> = {};
		email && Object.assign(filter, { email: {
			$regex: email,
		} });
		const users = await this._usrSvc.find(filter);
		return { users };
	}

	@Put(':uid/add-scope')
	public async update(
	@Param('uid') uid: string,
		@Body() { scope }: dto.AddScopeDto,
	) {
		return await this._usrSvc.addScope(uid, scope);
	}
}
