import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Client } from '../clients';
import { DomainModels } from '../../../constants';


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

	@Prop({ required: true })
	public scope: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
