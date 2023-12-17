/* eslint-disable max-params */
/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DomainModels } from '../../../constants';
import { IGameService, Types as TExtApi } from '../../externalApi';
import { IGHubLogger, Types as TLog } from '../../core/logging';
import {
	AppConfigurationService,
	Types as TConfig,
} from '../../core/configuration';

import { IGHubJobs } from './types';
import { Bill, BillDocument, BillStatus } from './Bill';


const VNPAY_MINIMUM_AMOUNT_TRANSACTION = 10000;

@Injectable()
export class BillProcessJobs implements OnModuleInit, IGHubJobs {
	private _billCreationJob: CronJob;
	private _billOverdueJob: CronJob;

	constructor(
		@InjectModel(DomainModels.BILL) private readonly _billModel: Model<Bill>,
		@Inject(TExtApi.GAME_SVC) private readonly _gameSvc: IGameService,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
		@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService
	) {}

	public onModuleInit() {
		this._billCreationJob = this._buildBillCreationJob();
		this._billOverdueJob = this._buildBillOverdueJob();
	}

	private _buildBillOverdueJob() {
		return CronJob.from({
			cronTime: '0 0 5 * *',
			onTick: this._billOverdueOnTick.bind(this),
			start: true,
			timeZone: 'Asia/Ho_Chi_Minh',
		});
	}

	private async _billOverdueOnTick() {
		try {
			const bills: BillDocument[] = (await this._billModel.find()) || [];
			const unpaidBills = bills.filter((bill) => bill.status === BillStatus.PENDING);
			const unpaidBillIds = unpaidBills.map<string>((bill) => bill._id.toString());
			await this._billModel.updateMany(
				{
					_id: {
						$in: unpaidBillIds,
					},
				},
				{ status: BillStatus.OVERDUE },
				{ new: true },
			);
			// inactive game
		}
		catch (err) {
			this._logger.error('_billOverdueOnTick error', err);
			// throw new err;
		}
	}

	private _buildBillCreationJob() {
		return CronJob.from({
			cronTime: '0 0 1 * *',
			onTick: this._billCreationOnTick.bind(this),
			start: true,
			timeZone: 'Asia/Ho_Chi_Minh',
		});
	}

	private async _billCreationOnTick() {
		try {
			const bills: Bill[] = [];
			const games = await this._gameSvc.getGames();
			for (const game of games) {
				const amount =
          (game.monthlyWriteUnits * this._cfgSvc.writeUnitPrice +
            game.monthlyReadUnits * this._cfgSvc.readUnitPrice) *
          this._cfgSvc.usdToVnd;
				if (amount > VNPAY_MINIMUM_AMOUNT_TRANSACTION) {
					bills.push({
						gameId: game.id,
						writeUnits: game.monthlyWriteUnits,
						readUnits: game.monthlyReadUnits,
						status: BillStatus.PENDING,
						time: new Date(),
					});
				}
			}
			await this._billModel.create(bills);
			// reset count of games that create bill
		}
		catch (err) {
			this._logger.error('Get games error', err);
			// throw new err;
		}
	}

	public fireBillOverdueJob(): void {
		this._billOverdueJob.fireOnTick();
	}

	public fireBillCreationJob(): void {
		this._billCreationJob.fireOnTick();
	}
}
