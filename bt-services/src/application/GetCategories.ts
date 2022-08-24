import Category from '../domain/entity/Category';
import UserData from '../domain/entity/UserData';
import CategoryRepository from '../domain/repository/CategoryRepository';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class GetCategories {
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
		Category.checkIfCurrentUserCanList(
			input.user,
			input.dashboard,
			currentDashboardShare
		);
		let categories = await this.categoryRepository.list(input.dashboard);
		return {
			categories,
		};
	}
}

type Input = {
	user: UserData;
	dashboard: string;
};

type Output = {
	categories: Category[];
};
