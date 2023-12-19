/* eslint-disable max-lines */
/* eslint-disable max-params */
/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';

import { DomainModels } from '../../../constants';
import { IGameService, Types as TExtApi } from '../../externalApi';
import { IGHubLogger, Types as TLog } from '../../core/logging';
import {
	AppConfigurationService,
	Types as TConfig,
} from '../../core/configuration';
import { IUserService, Types as TUsr } from '../../domain/users';


import { IGHubJobs } from './types';
import { Bill, BillDocument, BillStatus } from './Bill';


const VNPAY_MINIMUM_AMOUNT_TRANSACTION = 10000;
// const transporter = nodemailer.createTransport({
// 	host: 'sandbox.smtp.mailtrap.io',
// 	port: 2525,
// 	auth: {
// 		user: '64eeb667c907cd',
// 		pass: ,
// 	},
// });

// async function sendMails(listEmail: string) {
// 	const info = await transporter.sendMail({
// 		from: 'GHub <ghub-fpt.web.app>', // sender address
// 		to: listEmail, // 'bar@example.com, baz@example.com', // list of receivers
// 		subject: 'GHub Bill Reminder ✔', // Subject line
// 		text: 'Please pay to continue', // plain text body
// 		html: '<b>Please pay to continue <a>https://ghub-fpt.web.app/billing</a></b>', // html body
// 	});

// 	console.log('Message sent: %s', info.messageId);
// }

@Injectable()
export class BillProcessJobs implements OnModuleInit, IGHubJobs {
	private _billCreationJob: CronJob;
	private _billOverdueJob: CronJob;
	private _billReminderJob: CronJob;
	private _transporter: nodemailer.Transporter;

	constructor(
		@InjectModel(DomainModels.BILL) private readonly _billModel: Model<Bill>,
		@Inject(TExtApi.GAME_SVC) private readonly _gameSvc: IGameService,
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
		@Inject(TConfig.CFG_SVC) private readonly _cfgSvc: AppConfigurationService,
		@Inject(TUsr.USR_SVC) private readonly _usrSvc: IUserService,
	) {
		this._transporter = nodemailer.createTransport({
			host: 'sandbox.smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: '64eeb667c907cd',
				pass: _cfgSvc.forwardMailPassword,
			},
		});
	}

	private async _sendMails(listEmail: string): Promise<void> {
		const info = await this._transporter.sendMail({
			from: 'GHub <ghub-fpt.web.app>', // sender address
			to: listEmail, // 'bar@example.com, baz@example.com', // list of receivers
			subject: 'GHub Bill Reminder ✔', // Subject line
			text: 'Please pay to continue', // plain text body
			html: '<b>Please pay to continue <a>https://ghub-fpt.web.app/billing</a></b>', // html body
		});

		console.log('Message sent: %s', info.messageId);
	}

	public onModuleInit() {
		this._billCreationJob = this._buildBillCreationJob();
		this._billOverdueJob = this._buildBillOverdueJob();
		this._billReminderJob = this._buildBillReminderJob();
	}

	private _buildBillReminderJob() {
		return CronJob.from({
			cronTime: '0 7 1-4 * *',
			onTick: this._billReminderOnTick.bind(this),
			start: true,
			timeZone: 'Asia/Ho_Chi_Minh',
		});
	}

	private async _billReminderOnTick() {
		try {
			// get all pending and overdue bills
			const bills = await this._billModel.find({
				status: {
					$in: [BillStatus.PENDING, BillStatus.OVERDUE],
				},
			});
			// get gameId
			const gameIds = bills.map((bill) => bill.gameId);
			const uniqGameIds = Array.from(new Set(gameIds));
			// find user by game and send mail
			let mails: string[] = [];
			for (const gameId of uniqGameIds) {
				const users = await this._usrSvc.find({ scope: {
					$regex: `games:${gameId}:get`,
				} });
				mails = mails.concat(users.map((user) => user.email));
			}
			const mailList = Array.from(new Set(mails)).join(', ');
			if (mailList.length > 0) {
				await this._sendMails(mailList);
			}
		}
		catch (err) {
			this._logger.error('_billReminderOnTick error', err);
			// throw new err;
		}
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
			const gameIds = unpaidBills.map((bill) => bill.gameId);
			await this._gameSvc.updateStatus(Array.from(new Set(gameIds)), false);
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
			const cfgSvc = this._cfgSvc;
			for (const game of games) {
				const amount =
          (game.monthlyWriteUnits * cfgSvc.writeUnitPrice/*  + game.monthlyReadUnits * cfgSvc.readUnitPrice */) * cfgSvc.usdToVnd;
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
			const gameIds = bills.map((bill) => bill.gameId);
			if (gameIds.length) {
				await this._gameSvc.resetRecords(gameIds);
			}
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

	public fireBillBillReminderJob(): void {
		this._billReminderJob.fireOnTick();
	}
}
