import { Controller, Get } from '@nestjs/common';


@Controller()
export class HealthCheckController {
	@Get('/health')
	public getHealth() {
		return { status: 'Ok' };
	}

	@Get('/env')
	public getEnv() {
		return {
			GIT_SHA: process.env.GIT_SHA,
			NODE_ENV: process.env.NODE_ENV,
		};
	}
}
