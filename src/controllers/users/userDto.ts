import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';


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
