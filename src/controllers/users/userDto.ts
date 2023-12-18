import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';


export class AddScopeDto {
	@IsNotEmpty()
	@ArrayNotEmpty()
	@ApiProperty()
	public scope: string[];
}


export class RemoveScopeDto {
	@IsNotEmpty()
	@ArrayNotEmpty()
	@ApiProperty()
	public scope: string[];
}


export class UsersQuery {
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	public email?: string;

	@IsOptional()
	@ApiProperty({
		required: false,
	})
	public username?: string;
}
