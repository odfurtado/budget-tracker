import CategoryRepository from '../domain/repository/CategoryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class DeleteCategory {
	private categoryRepository: CategoryRepository;
	constructor(repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
	}

	async execute(input: Input): Promise<void> {
		let category = await this.categoryRepository.get(input.user.id, input.id);
		if (!category) {
			throw new Error('Category not found');
		}

		if (category.canDelete(input.user.id)) {
			this.categoryRepository.delete(category.id);
		} else {
			throw new Error('Category could not be delete');
		}
	}
}

type Input = {
	user: {
		id: string;
	};
	id: string;
};
