import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength, ValidateIf } from 'class-validator';
import { isNil } from 'src/shared/miscUtils';


export class PasswordLoginDto {
	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	public username: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	public password: string;
}

export class EmailLoginDto {
	@ApiProperty()
	@IsNotEmpty()
	public email: string;
}
