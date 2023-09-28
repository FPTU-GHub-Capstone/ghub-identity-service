import { Type, plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Min, ValidateNested, validateSync } from 'class-validator';


enum Environment {
	LOCAL = 'local',
	DEV = 'dev',
	PROD = 'prod',
}

class HttpVariables {
	@IsString()
	public host: string;

	@IsNumber()
	public port: string;
}

class ApplicationVariables {
	@IsEnum(Environment)
	public NODE_ENV: Environment;

	@IsNumber()
	@Min(1000)
	public jwt_expires_in: number;

	@IsString()
	public jwt_secret: string;
};

class EnvironmentVariables {
	@ValidateNested()
	@Type(() => HttpVariables)
	public http: HttpVariables;

	@ValidateNested()
	@Type(() => ApplicationVariables)
	public application: ApplicationVariables;
}

export default function validateEnv(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(
		EnvironmentVariables,
		config,
		{ enableImplicitConversion: true },
	);
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
