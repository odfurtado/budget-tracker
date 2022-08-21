import GetCategories from '../../../application/GetCategories';
import RepositoryFactory from '../../../domain/repository/RepositoryFactory';
import Http from '../http/Http';

export default class CategoryController {
	constructor(private repositoryFactory: RepositoryFactory) {}

	list = async (params: any) => {
		let input = {
			user: {
				id: 'my-user-id',
			},
		};
		return await new GetCategories(this.repositoryFactory).execute(input);
	};

	save = async () => {
		console.log('CategoryController - save');
	};

	delete = async () => {
		console.log('CategoryController - delete');
	};

	public bind(http: Http) {
		http.on('get', '/categories', this.list);
		http.on('post', '/categories', this.save);
		http.on('delete', '/categories/{id}', this.delete);
	}
}
