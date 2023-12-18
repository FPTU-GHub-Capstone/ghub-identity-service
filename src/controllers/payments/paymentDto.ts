import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaymentStatus } from 'src/modules/domain/payments';


export class VnpIpnQuery {
	@ApiProperty()
	public vnp_BankCode: string;

	@ApiProperty()
	public vnp_TransactionNo: number;

	@ApiProperty()
	public vnp_ResponseCode: string;

	@ApiProperty()
	public vnp_TransactionStatus: number;

	@ApiProperty()
	public vnp_SecureHashType?: number;

	@ApiProperty()
	public vnp_PayDate: string;

	public vnp_Version: '2.0.1' | '2.1.0';

	@ApiProperty()
	public vnp_Command: 'pay';

	@ApiProperty()
	public vnp_Locale: 'vn';

	@ApiProperty()
	public vnp_CurrCode: 'VND';

	@ApiProperty()
	public vnp_Amount: number;

	@ApiProperty()
	public vnp_TmnCode: string;

	@ApiProperty()
	public vnp_CreateDate: string;

	@ApiProperty()
	public vnp_IpAddr: string;

	@ApiProperty()
	public vnp_OrderInfo: string;

	@ApiProperty()
	public vnp_ReturnUrl: string;

	@ApiProperty()
	public vnp_TxnRef: string;

	@ApiProperty()
	public vnp_OrderType: string;

	@ApiProperty()
	public vnp_SecureHash: string;
}


export class CreateUrlDto {
	@IsOptional()
	@ArrayNotEmpty()
	@IsMongoId({ each: true })
	@ApiProperty()
	public bills?: string[];
}

export class PaymentsQuery {
	@IsOptional()
	@IsEnum(PaymentStatus)
	@ApiProperty({
		required: false,
		enum: PaymentStatus,
	})
	public status?: PaymentStatus;
}
