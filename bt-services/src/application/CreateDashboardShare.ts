import DashboardShare from '../domain/entity/DashboardShare';
import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateDashboardShare {
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<string> {
		if (input.dashboard !== input.user.id) {
			throw new Error('Cannot share this dashboard');
		}
		let pendingOrApprovedDashboardShare =
			await this.getPendingOrApprovedDashboardShare(
				input.dashboard,
				input.shareWith
			);
		if (pendingOrApprovedDashboardShare.length !== 0) {
			throw new Error('Dashboard already shared with user');
		}
		let dashboardShare = new DashboardShare(input.dashboard, input.shareWith);
		await this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	private async getPendingOrApprovedDashboardShare(
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
	user: UserData;
	dashboard: string;
	shareWith: string;
};
