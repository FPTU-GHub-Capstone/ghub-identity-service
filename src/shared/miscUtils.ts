function isNil(value: any) {
	return value == null;
}

function sanitizeFirebaseCert(key: string) {
	return key.replace(/\\n/gm, '\n');
}

export {
	isNil,
	sanitizeFirebaseCert,
};
