import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

import { IRequestContext, Types as TCntx } from '../core/requestContext';
import { AppConfigurationService, Types as TCfg } from '../core/configuration';
import { Headers } from '../../constants';
import { IAuthService, Types as TAuth } from '../domain/auth';

import {
	AutoWrapper,
	GetGameResponse,
	IGameService,
	RequestExecutor,
} from './types';


const REQUEST_TIMEOUT = 60000;
const GET_GAME_SCOPE = 'games:*:get';
const RESET_GAME_RECORD_SCOPE = 'games:*:resetrecords';

@Injectable()
export class GameService implements IGameService {
	constructor(
		@Inject(TCntx.REQUEST_CONTEXT) private readonly _reqCnTx: IRequestContext,
		@Inject(TCfg.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TAuth.AUTH_SVC) private readonly _authSvc: IAuthService,
	) {}

	public resetRecords(gameIds: string[]): Promise<void> {
		return this._makeRequest(async (axiosInstance) => {
			await axiosInstance.put(
				'/games/reset-record', {
					ids: gameIds,
				}
			);
		}, [RESET_GAME_RECORD_SCOPE]);
	}

	public getGames(): Promise<GetGameResponse[]> {
		return this._makeRequest(async (axiosInstance) => {
			const response = await axiosInstance.get<AutoWrapper<GetGameResponse[]>>(
				'/games',
			);
			return response.data.result;
		}, [GET_GAME_SCOPE]);
	}

	public async getGame(gameId: string): Promise<GetGameResponse> {
		return this._makeRequest(async (axiosInstance) => {
			const response = await axiosInstance.get<AutoWrapper<GetGameResponse>>(
				`/games/${gameId}`,
			);
			return response.data.result;
		}, [GET_GAME_SCOPE]);
	}

	private async _makeRequest<TResponse = any>(
		executor: RequestExecutor,
		scope: string[],
	): Promise<TResponse> {
		const options = this._getRequestOptions(scope);
		const axiosInstance = axios.create({
			...options,
			baseURL: this._cfgSvc.gmsUrl,
		});
		const response = await executor(axiosInstance);
		return response;
	}

	private _getRequestOptions(scope: string[]): AxiosRequestConfig<any> {
		const accessToken = this._authSvc.issueServiceToken(scope);
		return {
			timeout: REQUEST_TIMEOUT,
			headers: {
				[Headers.CORRELATION_ID]: this._reqCnTx.getCorrelationId(),
				[Headers.AUTHORIZATION]: `Bearer ${accessToken}`,
			},
		};
	}
}
