import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from '../users';
import { DomainModels } from '../../../constants';
import { Bill } from '../bills';


export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentStatus {
	Initial = 'Initial',
	Success = 'Success',
	FailedForInvalidMerchant = 'InvalidMerchant',
	FailedForInvalidAmount = 'InvalidAmount',
	FailedForInvalidOrder = 'InvalidOrder',
	FailedForChecksum = 'FailedForChecksum'
}

@Schema()
export class Payment {
	@Prop({ required: true })
	public amount: number;

	@Prop({ required: true })
	public date: string;

	@Prop({ required: true })
	public content: string;

	@Prop({ required: true })
	public bankCode: string;

	@Prop({ required: true, enum: PaymentStatus })
	public status: PaymentStatus;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: DomainModels.USER })
	public paidBy: User;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: DomainModels.BILL }] })
	public bills: Bill[];
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
