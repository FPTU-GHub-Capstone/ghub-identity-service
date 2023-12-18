import {
	BadRequestException,
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


const ADMIN_SCOPE = 'games:*:get';


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
		@GetUser() user: HttpUser
	) {
		if (!user.scp.includes(ADMIN_SCOPE)) {
			if (scope.includes(ADMIN_SCOPE)) {
				throw new ForbiddenException('Only admin could add admin scope');
			}
			this._validateGameScope(scope);
			// this._validateUserPermission(user.scp, scope);
		}
		return await this._usrSvc.addScope(uid, scope);
	}

	private _validateUserPermission(userScope: string[], scopeRequests: string[]) {
		for (const scopeRequest of scopeRequests) {
			const gameId = scopeRequest.split(':')[1]; // games:{gameId}:action
			if (!userScope.includes(`games:${gameId}:update`)) {
				throw new ForbiddenException(`Don't have permission to update game ${gameId}`);
			}
		}
	}

	private _validateGameScope(scope: string[]) {
		const gameScopeRegex = /^games:(?:[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}):(.+)$/;
		const isInvalid = scope.some((scp) => !gameScopeRegex.test(scp));
		if (isInvalid) {
			throw new BadRequestException('Scope should have format games:{gameId}:{action}');
		}
	}

	@Put(':uid/remove-scope')
	public async removeScope(
	@Param('uid') uid: string,
		@Body() { scope }: dto.RemoveScopeDto,
		@GetUser() user: HttpUser
	) {
		if (!user.scp.includes(ADMIN_SCOPE)) {
			this._validateGameScope(scope);
			// this._validateUserPermission(user.scp, scope);
		}
		return await this._usrSvc.removeScope(uid, scope);
	}
}
