import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IClientService, Types as TClient } from '../../modules/domain/clients';
import { IUserService, Types as TUsr } from '../../modules/domain/users';
import { JwtAuthGuard } from '../../modules/domain/auth';


@ApiBearerAuth('Bearer')
@ApiTags('game')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/games')
export class GameController {
	constructor(
		@Inject(TClient.CLIENT_SVC) private readonly _clientSvc: IClientService,
		@Inject(TUsr.USR_SVC) private readonly _usrSvc: IUserService,
	) {}

	@Get(':id/clients')
	public async getClients(@Param('id') gameId: string) {
		const clients = await this._clientSvc.find({ gameId });
		return { clients };
	}


	@Get(':id/users')
	public async getUsers(@Param('id') gameId: string) {
		const users = await this._usrSvc.find({ scope: {
			$regex: `games:${gameId}:get`,
		} });
		return { users };
	}
}
