import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators';
import { HttpUser } from 'src/types';
import { JwtAuthGuard } from 'src/modules/domain/auth';

import { IClientService, Types as TClient } from '../../modules/domain/clients';

import * as dto from './clientDto';


@ApiBearerAuth('Bearer')
@ApiTags('client')
@UseGuards(JwtAuthGuard)
@Controller('/v1/idp/clients')
export class ClientController {
	constructor(
		@Inject(TClient.CLIENT_SVC) private readonly _clientSvc: IClientService,
	) {}

	@Get(':id')
	public getByGame(@Param('id') id: string) {
		return this._clientSvc.findOne({ clientId: id });
	}

	@Post()
	public create(@Body() createClientDto: dto.CreateClientDto) {
		const { scope: reqScp, ...createClientParam } = createClientDto;
		const scope = reqScp.join(' ');
		return this._clientSvc.create({
			...createClientParam,
			scope,
		});
	}

	@Put(':id')
	public update(
	@Param('id') id: string,
		@Body() updateClientDto: dto.UpdateClientDto,
	) {
		const { scope: reqScp, ...updateClientParam } = updateClientDto;
		const scope = reqScp?.join(' ');
		return this._clientSvc.update(id, {
			scope,
			...updateClientParam,
		});
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	public async delete(@GetUser() user: HttpUser, @Param('id') id: string) {
		this._clientSvc.delete(id);
	}
}
