import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IClientService, Types as TClient } from '../../modules/domain/clients';


@ApiBearerAuth('Bearer')
@ApiTags('game')
@Controller('/v1/idp/games')
export class GameController {
	constructor(
		@Inject(TClient.CLIENT_SVC) private readonly _clientSvc: IClientService,
	) {}

	@Get(':id/clients')
	public async getClients(@Param('id') gameId: string) {
		const clients = await this._clientSvc.find({ gameId });
		return { clients };
	}
}
