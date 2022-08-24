import UserData from '../../../domain/entity/UserData';

export default interface Http {
	on(method: string, url: string, callback: CallbackFunction): void;
	secure(validator: any): void;
	listen(port: number): void;
}

export type CallbackOutput =
	| Promise<{
			output?: any;
			status?: number;
	  }>
	| Promise<void>;

export type CallbackFunction = (
	userData: UserData,
	params: any,
	body: any
) => CallbackOutput;
