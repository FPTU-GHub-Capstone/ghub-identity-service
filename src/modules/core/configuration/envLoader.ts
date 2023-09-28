import { readFileSync } from 'fs';
import path from 'path';

import yaml from 'js-yaml';


const YAML_CONFIG_FILENAME = `${process.env.NODE_ENV}.yaml`;


export default function yamlLoader() {
	return yaml.load(
		readFileSync(path.join(__dirname, `../../../env/${YAML_CONFIG_FILENAME}`), 'utf-8')
	) as Record<string, unknown>;
}
