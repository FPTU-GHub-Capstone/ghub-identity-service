import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


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
	public clientId: string;

	@Prop()
	public clientSecret: string;

	@Prop()
	public scope: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
