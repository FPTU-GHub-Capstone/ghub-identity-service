import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DomainModels } from '..';

import { Types as TUser } from './types';
import { UserService } from './UserService';
import { UserSchema } from './User';


export * from './UserService';
export * from './types';
export * from './User';


@Module({
	imports: [MongooseModule.forFeature([{ name: DomainModels.USER, schema: UserSchema }])],
	providers: [
		{
			provide: TUser.USR_SVC,
			useClass: UserService,
		},
	],
	exports: [TUser.USR_SVC],
})
export class UserModule {}
