import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CancelDashboardShare {
	private readonly dashboardShareRepository: DashboardShareRepository;
	constructor(repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<void> {
		let dashboardShare = await this.dashboardShareRepository.get(
			input.dashboardShareId
		);
		if (!dashboardShare) {
			throw new Error('Dashboard share not found or not authorized');
		}
		dashboardShare.cancelBy(input.user.email);
		await this.dashboardShareRepository.save(dashboardShare);
	}
}

type Input = {
	user: UserData;
	dashboardShareId: string;
};
