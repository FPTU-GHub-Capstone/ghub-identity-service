import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
	@Prop({ required: true })
	public name: string;

	@Prop({ required: true })
	public clientId: string;

	@Prop({ required: true })
	public clientSecret: string;

	@Prop({ required: true })
	public scope: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
