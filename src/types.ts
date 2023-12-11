export type ApplicationInfo = {
	environment: string,
	name: string,
	version: string,
};

export type HttpUser = {
	uid: string,
	scp: string[],
};
