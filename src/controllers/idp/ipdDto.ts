import { Request } from 'express';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { Match } from 'src/common/decorators';


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
