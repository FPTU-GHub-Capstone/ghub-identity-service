import { AxiosInstance } from 'axios';


export const enum Types {
	GAME_SVC = 'externalApi:IGameService'
}


export interface IGameService {
	getGames(): Promise<GetGameResponse[]>;
	getGame(gameId: string): Promise<GetGameResponse>;
	resetRecords(gameIds: string[]): Promise<void>;
	updateStatus(gameIds: string[], status: boolean): Promise<void>;
}

export type RequestExecutor = (axiosInstance: AxiosInstance) => Promise<any>;

export type AutoWrapper<T = any> = {
	message: string,
	isError: boolean,
	result: T,
};

export type GetGameResponse = {
	monthlyWriteUnits: number,
	monthlyReadUnits: number,
	name: string,
	logo: string,
	link: string,
	id: string,
	banner: string,
	createdAt: string,
	modifiedAt: string,
};
