import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateResult, DeleteResult } from 'mongodb';
import { removeNullishField } from 'src/shared/miscUtils';

import { DomainModels } from '../../../constants';
import { IGHubLogger, Types as TLog } from '../../../modules/core/logging';

import { CreateClientParam, IClientService, UpdateClientParam } from './types';
import { Client, ClientDocument } from './Client';


@Injectable()
export class ClientService implements IClientService {
	constructor(
		@InjectModel(DomainModels.CLIENT)
		private readonly _clientModel: Model<Client>,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
	) {}

	public findOne(
		filter: FilterQuery<Client>,
		projection?: ProjectionType<Client>,
		options?: QueryOptions<Client>,
	): Promise<ClientDocument> {
		return this._clientModel.findOne(filter, projection, options);
	}

	public findByGame(gameId: string): Promise<ClientDocument[]> {
		return this._clientModel.find({ gameId });
	}

	public async create(
		createClientParam: CreateClientParam,
	): Promise<ClientDocument> {
		await this._validateCreateClientParam(createClientParam);
		return this._clientModel.create(createClientParam);
	}

	private async _validateCreateClientParam(
		createClientParam: CreateClientParam,
	): Promise<void> {
		const duplicatedIdClient = await this.findOne({
			clientId: createClientParam.clientId,
		});
		if (duplicatedIdClient) {
			throw new BadRequestException('Client already exist');
		}

		const duplicatedNameClient = await this.findOne({
			gameId: createClientParam.gameId,
			name: createClientParam.name,
		});
		if (duplicatedNameClient) {
			throw new BadRequestException(
				'Client ids in a game should not same name',
			);
		}
	}

	public async update(
		clientId: string,
		updateClientParam: UpdateClientParam,
	): Promise<UpdateResult> {
		const client = await this.findOne({ clientId });
		if (!client) throw new NotFoundException('Client not exist');
		return this._clientModel.updateOne({ clientId }, updateClientParam, {
			new: true,
		});
	}

	public async delete(clientId: string): Promise<DeleteResult> {
		const client = await this.findOne({ clientId });
		if (!client) throw new NotFoundException('Client not exist');
		return this._clientModel.deleteOne({ clientId });
	}
}
