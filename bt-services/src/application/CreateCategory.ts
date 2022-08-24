import Category from '../domain/entity/Category';
import UserData from '../domain/entity/UserData';
import CategoryRepository from '../domain/repository/CategoryRepository';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateCategory {
	private categoryRepository: CategoryRepository;
	private dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<Output> {
		let currentDashboardShare =
			await this.dashboardShareRepository.getCurrent(
				input.dashboard,
				input.user.id
			);
		Category.checkIfCurrentUserCanCreate(
			input.user,
			input.dashboard,
			currentDashboardShare
		);
		let category = new Category(input.dashboard, input.name);
		await this.categoryRepository.save(category);
		return { id: category.id };
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	name: string;
};

type Output = {
	id: string;
};
