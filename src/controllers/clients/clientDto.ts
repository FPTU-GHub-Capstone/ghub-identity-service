import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsOptional, MinLength } from 'class-validator';


export class CreateClientDto {
	@IsNotEmpty()
	@MinLength(5)
	@ApiProperty()
	public name: string;

	@IsNotEmpty()
	@MinLength(20)
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

	@IsNotEmpty()
	@ArrayNotEmpty()
	@ApiProperty()
	public scope: string[];
}

export class UpdateClientDto {
	@IsOptional()
	@MinLength(5)
	@ApiProperty()
	public name?: string;

	@IsOptional()
	@MinLength(20)
	@ApiProperty()
	public clientSecret?: string;

	@IsOptional()
	@ArrayNotEmpty()
	@ApiProperty()
	public scope?: string[];
}
