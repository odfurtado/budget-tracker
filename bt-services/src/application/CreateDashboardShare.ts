import DashboardShare from '../domain/entity/DashboardShare';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateDashboardShare {
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<void> {
		let dashboardAlreadyShared = await this.getDashboardShareAlreadyShared(
			input.dashboard,
			input.shareWith
		);
		if (input.dashboard !== input.userId) {
			throw new Error('Cannot share this dashboard');
		}
		if (dashboardAlreadyShared.length !== 0) {
			throw new Error('Dashboard already shared with user');
		}
		let dashboardShare = new DashboardShare(input.dashboard, input.shareWith);
		await this.dashboardShareRepository.save(dashboardShare);
	}

	private async getDashboardShareAlreadyShared(
		dashboard: string,
		shareWith: string
	) {
		let dashboardSharedWithUsers =
			await this.dashboardShareRepository.getByDashboard(dashboard);
		return dashboardSharedWithUsers.filter(
			(dashboardShare) =>
				dashboardShare.sharedWithEmail === shareWith &&
				(dashboardShare.status === 'Approved' ||
					dashboardShare.status === 'PendingApproval')
		);
	}
}

type Input = {
	userId: string;
	dashboard: string;
	shareWith: string;
};
