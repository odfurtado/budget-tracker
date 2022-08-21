import Category from '../domain/entity/Category';
import CategoryRepository from '../domain/repository/CategoryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class GetCategories {
	private categoryRepository: CategoryRepository;
	constructor(repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
	}

	async execute(input: Input): Promise<Output> {
		let categories = await this.categoryRepository.list(input.user.id);
		return {
			categories,
		};
	}
}

type Input = {
	user: {
		id: string;
	};
};

type Output = {
	categories: Category[];
};
