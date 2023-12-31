import { Request } from 'express';
import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNotEmpty, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { Match } from 'src/common/decorators';
import { GrantTypes } from 'src/constants';


type FirebaseUser = {
	email: string,
	name: string,
	picture: string,
}

export type FirebaseAuthenticatedRequest = Request & { user: FirebaseUser }

export class LoginDto {
	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(40)
	public username: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(40)
	public password: string;
}

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(40)
	public username: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(40)
	public password: string;

	@ApiProperty()
	@MinLength(6)
	@MaxLength(40)
	@Match('password', { message: 'Re-enterPassword should match' })
	@ValidateIf((obj) => obj.reenterPassword != null)
	public reenterPassword?: string;
}


export class RequestTokenDto {
	@ApiProperty()
	@IsNotEmpty()
	@Equals(GrantTypes.CLIENT_CREDENTIALS, {
		message: `Only support ${GrantTypes.CLIENT_CREDENTIALS}`,
	})
	public grant_type: string;

	@ApiProperty()
	@IsNotEmpty()
	public client_id: string;

	@ApiProperty()
	@IsNotEmpty()
	public client_secret: string;

	@ApiProperty()
	@IsNotEmpty()
	public scope: string;
}
