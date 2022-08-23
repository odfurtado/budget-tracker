import CreateEntry from '../../../application/CreateEntry';
import GetEntries from '../../../application/GetEntries';
import UpdateEntry from '../../../application/UpdateEntry';
import RepositoryFactory from '../../../domain/repository/RepositoryFactory';
import Http from '../http/Http';

export default class EntryController {
	constructor(private repositoryFactory: RepositoryFactory) {}

	list = async (userId: string, params: any) => {
		let input = {
			user: {
				id: userId,
			},
			month: params['month'],
			year: params['year'],
		};
		let output = await new GetEntries(this.repositoryFactory).execute(input);
		return {
			output: output.entries,
			status: 200,
		};
	};

	save = async (userId: string, _: any, body: BodySave) => {
		let input = {
			user: {
				id: userId,
			},
			...body,
			date: new Date(body.date),
		};
		let output = await new CreateEntry(this.repositoryFactory).execute(input);
		return {
			output,
			status: 201,
		};
	};

	update = async (userId: string, params: any, body: BodyUpdate) => {
		let input = {
			user: {
				id: userId,
			},
			...body,
			date: new Date(body.date),
		};
		let entryId = params['id'];
		let output = await new UpdateEntry(this.repositoryFactory).execute(
			entryId,
			input
		);
		return {
			output: '',
			status: 200,
		};
	};

	public bind(http: Http) {
		http.on('get', '/entries', this.list);
		http.on('post', '/entries', this.save);
		http.on('put', '/entries/{id}', this.update);
		//http.on('delete', '/entries/{id}', this.delete);
	}
}

type BodySave = {
	date: string;
	description: string;
	type: 'cost' | 'income';
	category: string;
	paymentType: string;
	installments: number;
	amount: number;
};

type BodyUpdate = {
	date: string;
	description: string;
	type: 'cost' | 'income';
	category: string;
	paymentType: string;
	amount: number;
};
