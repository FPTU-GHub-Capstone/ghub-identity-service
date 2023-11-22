import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateResult, DeleteResult } from 'mongodb';


import { Client, ClientDocument } from './Client';


export const enum Types {
	CLIENT_SVC = 'domain:clients:IClientService',
}

export interface IClientService {
	findOne(
		filter: FilterQuery<Client>,
		projection?: ProjectionType<Client>,
		options?: QueryOptions<Client> | null,
	): Promise<ClientDocument>;
	find(
		filter: FilterQuery<Client>,
		projection?: ProjectionType<Client> | null,
		options?: QueryOptions<Client> | null,
	): Promise<ClientDocument[]>;
	create(createClientParam: CreateClientParam): Promise<ClientDocument>;
	update(clientId: string, updateClientParam: UpdateClientParam): Promise<UpdateResult>;
	delete(clientId: string): Promise<DeleteResult>;
}

export type CreateClientParam = {
	name: string,
	gameId: string,
	clientId: string,
	clientSecret: string,
	scope: string,
};

export type UpdateClientParam = Partial<Omit<CreateClientParam, 'clientId' | 'gameId'>>;
