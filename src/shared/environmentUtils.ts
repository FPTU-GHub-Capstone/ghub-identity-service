export function getAppInfo(): ApplicationInfo {
	return {
		environment: process.env.NODE_ENV,
		name: getAppName(),
		version: getAppVersion(),
	};
}

export function getAppVersion(): string {
	const commitId = process.env.GIT_SHA ?? 'git-unknown';
	const parts = commitId.split('-');
	const hash = parts.length === 1 ? commitId : parts[1];
	return hash.slice(0, 10);
}

export function getAppName(): string {
	return process.env.APP_NAME || 'ghub-idp-service';
}
