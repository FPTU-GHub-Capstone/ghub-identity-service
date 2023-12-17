import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { BillStatus } from '../../modules/domain/bills';


export class BillsQuery {
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	@IsMongoId({
		each: true,
	})
	public bills?: string[];

	@IsOptional()
	@IsEnum(BillStatus)
	@ApiProperty({
		required: false,
		enum: BillStatus,
	})
	public status?: BillStatus;
}
