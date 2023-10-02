import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DomainModels } from '..';

import { Types as TUser } from './types';
import { UserService } from './UserService';
import { UserSchema } from './userEntity';


export * from './UserService';
export * from './types';
export * from './userEntity';


@Module({
	imports: [MongooseModule.forFeature([{ name: DomainModels.USER, schema: UserSchema }])],
	providers: [
		{
			provide: TUser.USER_SVC,
			useClass: UserService,
		},
	],
	exports: [TUser.USER_SVC],
})
export class UserModule {}
