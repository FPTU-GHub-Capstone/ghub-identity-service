import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Client } from '../clients';
import { DomainModels } from '../../../common/constants';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop()
	public name: string;

	@Prop()
	public email: string;

	@Prop()
	public picture: string;

	@Prop()
	public uid: string;

	@Prop()
	public username: string;

	@Prop()
	public password: string;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: DomainModels.CLIENT }] })
	public clients: Client[];
}

export const UserSchema = SchemaFactory.createForClass(User);
