import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ required: false })
	public username?: string;

	@Prop({ required: false })
	public password?: string;

	@Prop({ required: false })
	public email?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
