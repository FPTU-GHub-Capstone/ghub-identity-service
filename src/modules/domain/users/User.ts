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
	public uid: string;

	@Prop()
	public username: string;

	@Prop()
	public password: string;

	@Prop({ required: true })
	public scope: string;

	@Prop()
	public status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
