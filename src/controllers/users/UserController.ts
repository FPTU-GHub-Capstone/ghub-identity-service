import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Put,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../modules/domain/auth';
import { IUserService, Types as TUser } from '../../modules/domain/users';

import * as dto from './userDto';


@ApiBearerAuth('Bearer')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/users')
export class UserController {
	constructor(
		@Inject(TUser.USR_SVC) private readonly _usrSvc: IUserService,
	) {}

	@Get()
	public async getAll() {
		return await this._usrSvc.find({});
	}

	@Put(':uid/add-scope')
	public async update(
	@Param('uid') uid: string,
		@Body() { scope }: dto.AddScopeDto,
	) {
		return await this._usrSvc.addScope(uid, scope);
	}
}
