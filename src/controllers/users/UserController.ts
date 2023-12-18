import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Inject,
	Param,
	Put,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';

import { HttpUser } from '../../types';
import { JwtAuthGuard } from '../../modules/domain/auth';
import { IUserService, Types as TUser, User } from '../../modules/domain/users';
import { GetUser } from '../../common/decorators';

import * as dto from './userDto';


@ApiBearerAuth('Bearer')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/users')
export class UserController {
	constructor(@Inject(TUser.USR_SVC) private readonly _usrSvc: IUserService) {}

	@Get()
	public async getAll(
	@Query(new ValidationPipe({ transform: true })) usersQuery?: dto.UsersQuery,
	) {
		const { email, username } = usersQuery;
		const filter: FilterQuery<User> = {};
		email && Object.assign(filter, { email: { $regex: email } });
		username && Object.assign(filter, { username: { $regex: username } });
		const users = await this._usrSvc.find(filter);
		return { users };
	}

	@Put(':uid/update-status')
	public async updateUserStatus(
	@Param('uid') uid: string,
		@Body() { status }: dto.UpdateUserStatusDto,
		@GetUser() user: HttpUser
	) {
		if (!user.scp.includes('games:*:get')) {
			throw new ForbiddenException();
		}
		return await this._usrSvc.update(uid, { status });
	}

	@Put(':uid/add-scope')
	public async addScope(
	@Param('uid') uid: string,
		@Body() { scope }: dto.AddScopeDto,
	) {
		return await this._usrSvc.addScope(uid, scope);
	}

	@Put(':uid/remove-scope')
	public async removeScope(
	@Param('uid') uid: string,
		@Body() { scope }: dto.RemoveScopeDto,
	) {
		return await this._usrSvc.removeScope(uid, scope);
	}
}
