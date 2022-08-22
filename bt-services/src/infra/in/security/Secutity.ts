export default interface Security {
	extract(token: string): Promise<string | null>;
}
