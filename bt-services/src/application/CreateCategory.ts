import Category from '../domain/entity/Category';
import CategoryRepository from '../domain/repository/CategoryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateCategory {
	private categoryRepository: CategoryRepository;
	constructor(repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
	}

	async execute(input: Input): Promise<Output> {
		let category = new Category(input.user.id, input.name);
		await this.categoryRepository.save(category);
		return { id: category.id };
	}
}

type Input = {
	user: {
		id: string;
	};
	name: string;
};

type Output = {
	id: string;
};
