import CreateCategory from '../../../application/CreateCategory';
import DeleteCategory from '../../../application/DeleteCategory';
import GetCategories from '../../../application/GetCategories';
import UserData from '../../../domain/entity/UserData';
import RepositoryFactory from '../../../domain/repository/RepositoryFactory';
import Http from '../http/Http';

export default class CategoryController {
	constructor(private repositoryFactory: RepositoryFactory) {}

	list = async (userData: UserData) => {
		let input = {
			user: userData,
			dashboard: userData.id,
		};
		let output = await new GetCategories(this.repositoryFactory).execute(
			input
		);
		return {
			output: output.categories,
			status: 200,
		};
	};

	save = async (userData: UserData, _: any, body: BodySave) => {
		let input = {
			user: userData,
			dashboard: userData.id,
			...body,
		};
		try {
			let output = await new CreateCategory(this.repositoryFactory).execute(
				input
			);
			return {
				output: output.id,
				status: 201,
			};
		} catch (e: any) {
			return {
				output: e.message,
				status: 400,
			};
		}
	};

	delete = async (userData: UserData, params: any) => {
		let input = {
			user: userData,
			dashboard: userData.id,
			category: params['id'],
		};
		let message: string = '';
		let status: number;
		try {
			await new DeleteCategory(this.repositoryFactory).execute(input);
			status = 200;
		} catch (e: any) {
			message = e.message;
			status = 500;
			if (message === 'Category not found') {
				status = 404;
			}
		}
		return {
			output: message,
			status,
		};
	};

	public bind(http: Http) {
		http.on('get', '/categories', this.list);
		http.on('post', '/categories', this.save);
		http.on('delete', '/categories/{id}', this.delete);
	}
}

type BodySave = {
	name: string;
};
