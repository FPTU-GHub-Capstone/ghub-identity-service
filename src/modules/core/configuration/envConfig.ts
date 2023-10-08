import { readFileSync } from 'fs';
import path from 'path';

import yaml from 'js-yaml';

import validateEnv, { EnvironmentVariables } from './validateEnv';


const YAML_CONFIG_FILENAME = `${process.env.NODE_ENV}.yaml`;

export default async function yamlLoader(): Promise<EnvironmentVariables> {
	const yamlConfig = await yaml.load(
		readFileSync(path.join(__dirname, `../../../env/${YAML_CONFIG_FILENAME}`), 'utf-8')
	) as Record<string, unknown>;
	return validateEnv(yamlConfig);
}
