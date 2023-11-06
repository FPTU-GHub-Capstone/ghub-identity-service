import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request as XRequest, Response as XResponse } from 'express';

import { AppModule } from './app.module';
import { IGHubLogger, Types as TLog } from './modules/core/logging';
import { AppConfigurationService, Types as TConfig } from './modules/core/configuration';


function enableSwagger(app: INestApplication): void {
	const config = new DocumentBuilder()
		.setTitle('GHub Identity Service')
		.setDescription('GHub Idp')
		.setVersion('1.0')
		.addSecurity('Bearer', {
			type: 'http',
			scheme: 'Bearer',
		})
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api', app, document);
}

function createHandler(event: string) {
	return (reason: any) => {
		console.error(
			`An error caught in ${event}`,
			JSON.stringify({
				level: 'error',
				message: `Critical ${reason.toString()}`,
				data: {
					details: JSON.stringify(reason),
					stack: reason.stack,
				},
			}),
		);
	};
}

function setHstsHeader(_req: XRequest, res: XResponse, next: NextFunction) {
	res.setHeader(
		'Strict-Transport-Security',
		'max-age=31536000, includeSubDomains',
	);
	next();
}

function setCSPHeader(_req: XRequest, res: XResponse, next: NextFunction) {
	res.setHeader('Content-Security-Policy', "script-src 'self'");
	next();
}

function handleUnexpectedError(): void {
	process.on('uncaughtException', createHandler('uncaughtException'));
	process.on('unhandledRejection', createHandler('unhandledRejection'));
	process.on('SIGINT', createHandler('SIGINT'));
	process.on('SIGTERM', createHandler('SIGTERM'));
}

async function setGlobalLogger(app: INestApplication) {
	const logger: IGHubLogger = await app.resolve(TLog.LOGGER_SVC);
	app.useLogger(logger);
}

async function bootstrap() {
	handleUnexpectedError;
	const app = await NestFactory.create(AppModule, { cors: true });
	app.use(setHstsHeader);
	app.use(setCSPHeader);
	enableSwagger(app);
	await setGlobalLogger(app);
	await app.listen(8080);
}
bootstrap();
