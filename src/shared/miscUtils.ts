import crypto from 'crypto';


function isNil(value: any) {
	return value == null;
}

function sanitizeFirebaseCert(key: string) {
	return key.replace(/\\n/gm, '\n');
}

function generateAlphaNumericId(length: number): string {
	let text = '';
	const possible =
    'ABCDEFGHIkLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function randomHash(length: number) {
	return crypto.randomBytes(length).toString('hex');
}

export { isNil, generateAlphaNumericId, randomHash, sanitizeFirebaseCert };
