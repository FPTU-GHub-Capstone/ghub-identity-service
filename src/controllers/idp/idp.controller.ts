import { Controller, Get, Post } from '@nestjs/common';


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
