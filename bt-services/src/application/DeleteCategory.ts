import UserData from '../domain/entity/UserData';
import CategoryRepository from '../domain/repository/CategoryRepository';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class DeleteCategory {
	private categoryRepository: CategoryRepository;
	private dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<void> {
		let category = await this.categoryRepository.get(
			input.dashboard,
			input.category
		);
		if (!category) {
			throw new Error('Category not found');
		}
		let currentDashboardShare =
			await this.dashboardShareRepository.getCurrent(
				input.dashboard,
				input.user.id
			);
		category.delete(input.user, currentDashboardShare);
		this.categoryRepository.delete(category.id);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	category: string;
};
