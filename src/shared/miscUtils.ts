import crypto from 'crypto';


export function isNil(value: any) {
	return value == null;
}

export function sanitizeFirebaseCert(key: string) {
	return key.replace(/\\n/gm, '\n');
}

export function generateAlphaNumericId(length: number): string {
	let text = '';
	const possible =
    'ABCDEFGHIkLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export function randomHash(length: number) {
	return crypto.randomBytes(length).toString('hex');
}

export function removeNullishField<T>(obj: T): T {
	Object.keys(obj).forEach((key) =>
	// eslint-disable-next-line eqeqeq
		obj[key] == undefined ? delete obj[key] : {},
	);
	return obj as T;
}

export function formatYYYYMMDDHHMMSS(date: Date) {
	function pad2(n: number) {
		return (n < 10 ? '0' : '') + n;
	}

	return (
		date.getFullYear() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds())
	);
};

export function sortObject<T>(obj: T): T {
	const sorted = {};
	const str = [];
	let key: string | number | symbol;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return <T>sorted;
};


export function IP6to4(ip6: string): string {
	const ip6parsed = parseIp6(ip6);
	const ip4 = `${ip6parsed[6] >> 8}.${ip6parsed[6] & 0xff}.${ip6parsed[7] >> 8}.${ip6parsed[7] & 0xff}`;
	return ip4;
}

export function ip6to4(ip6: string) {
	const ip6parsed = parseIp6(ip6);
	const ip4 = `${ip6parsed[6] >> 8}.${ip6parsed[6] & 0xff}.${ip6parsed[7] >> 8}.${ip6parsed[7] & 0xff}`;
	return ip4;
}

// eslint-disable-next-line complexity
function parseIp6(ip6str: string) {
	const str = ip6str.toString();
	const ar: number[] = new Array(8).fill(0);
	if (str === '::') return ar;
	const sar = str.split(':');
	let slen = sar.length;
	if (slen > 8) slen = 8;
	let j = 0;
	let i = 0;
	for (i = 0; i < slen; i++) {
		// This is a "::", switch to end-run mode
		if (i && sar[i] === '') {
			j = 9 - slen + i;
			continue;
		}
		ar[j] = parseInt(`0x0${sar[i]}`);
		j++;
	}
	return ar;
}
