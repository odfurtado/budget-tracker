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
			input.dashboardSharedId
		);
		if (!dashboardShare) {
			throw new Error('Dashboard share not found or not authorized');
		}
		dashboardShare.cancelBy(input.userEmail);
		await this.dashboardShareRepository.save(dashboardShare);
	}
}

type Input = {
	userEmail: string;
	dashboardSharedId: string;
};
