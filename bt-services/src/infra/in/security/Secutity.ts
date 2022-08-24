export default interface Security {
	extract(token: string): Promise<UserData | null>;
}

export type UserData = {
	id: string;
	email: string;
	name: string;
};
