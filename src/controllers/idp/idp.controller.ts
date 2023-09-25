import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {

	@Post('/authorize')
	public authorize() {
		return { status: 'Ok' };
	}


	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
