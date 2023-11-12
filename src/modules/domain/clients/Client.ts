import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
	@Prop()
	public clientId: string;

	@Prop()
	public clientSecret: string;

	@Prop()
	public scope: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);