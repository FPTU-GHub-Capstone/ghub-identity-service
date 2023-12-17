import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export enum BillStatus {
	OVERDUE = 'overdue',
	PENDING = 'pending',
	PAID = 'paid'
}

export type BillDocument = HydratedDocument<Bill>;

@Schema()
export class Bill {
	@Prop({ required: true })
	public gameId: string;

	@Prop({ required: true })
	public writeUnits: number;

	@Prop({ required: true })
	public readUnits: number;

	@Prop({ required: true })
	public time: Date;

	@Prop({ required: true, enum: BillStatus })
	public status: BillStatus;

	@Prop()
	public paidTime?: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
