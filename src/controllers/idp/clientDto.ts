import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, MinLength } from 'class-validator';


export class CreateClientDto {
	@IsNotEmpty()
	@MinLength(10)
	@ApiProperty()
	public name: string;

	@IsNotEmpty()
	@Length(36)
	@ApiProperty()
	public gameId: string;

	@IsNotEmpty()
	@MinLength(20)
	@ApiProperty()
	public clientId: string;

	@IsNotEmpty()
	@MinLength(20)
	@ApiProperty()
	public clientSecret: string;

	@IsNotEmpty({
		each: true,
	})
	@ApiProperty()
	public scope: string[];
}

export class UpdateClientDto {
	@IsOptional()
	@MinLength(10)
	@ApiProperty()
	public name?: string;

	@IsOptional()
	@MinLength(20)
	@ApiProperty()
	public clientSecret?: string;

	@IsOptional()
	@ApiProperty()
	public scope?: string[];
}
