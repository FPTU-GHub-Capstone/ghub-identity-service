import { Type, plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, MinLength, ValidateNested, validateSync } from 'class-validator';


enum Environment {
	LOCAL = 'local',
	DEV = 'dev',
	PROD = 'prod',
}

class HttpVariables {
	@IsNotEmpty()
	@IsString()
	public host: string;

	@IsNotEmpty()
	@IsNumber()
	public port: number;
}

class ApplicationVariables {
	@IsNotEmpty()
	@IsEnum(Environment)
	public NODE_ENV: Environment;

	@IsNotEmpty()
	@IsNumber()
	@Min(1000)
	public jwt_expires_in: number;

	@IsNotEmpty()
	@IsString()
	public jwt_secret: string;

	@IsNotEmpty()
	@IsString()
	public FE_DOMAIN: string;
};

class MongoVariables {
	@IsNotEmpty()
	@IsString()
	@MinLength(10)
	public username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(10)
	public password: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(30)
	public connection_string: string;

	@IsNotEmpty()
	@IsString()
	public name: string; // database name
}

class DatabaseVariables {
	@ValidateNested()
	@Type(() => MongoVariables)
	public mongo: MongoVariables;
}

class FirebaseVariables {
	@IsNotEmpty()
	@IsString()
	public client_email: string;

	@IsNotEmpty()
	@IsString()
	public private_key: string;

	@IsNotEmpty()
	@IsString()
	public project_id: string;
}

export class EnvironmentVariables {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => HttpVariables)
	public http: HttpVariables;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ApplicationVariables)
	public application: ApplicationVariables;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DatabaseVariables)
	public database: DatabaseVariables;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => FirebaseVariables)
	public firebase: FirebaseVariables;
}

export default function validateEnv(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(
		EnvironmentVariables,
		config,
		{
			enableImplicitConversion: true,
		},
	);
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
