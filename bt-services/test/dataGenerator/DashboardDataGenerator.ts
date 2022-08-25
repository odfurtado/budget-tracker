import DashboardShare from '../../src/domain/entity/DashboardShare';
import DashboardShareRepository from '../../src/domain/repository/DashboardShareRepository';
import RepositoryFactory from '../../src/domain/repository/RepositoryFactory';

export default class DashboardDataGenerator {
	private readonly dashboardShareRepository: DashboardShareRepository;
	private dashboardsShare: DashboardShare[] = [];

	constructor(
		private readonly dashboard: string,
		private readonly repositoryFactory: RepositoryFactory
	) {
		this.dashboardShareRepository =
			this.repositoryFactory.createDashboardShareRepository();
	}

	pendingShareWith(sharedWithEmail: string) {
		let dashboardShare = new DashboardShare(this.dashboard, sharedWithEmail);
		this.dashboardsShare.push(dashboardShare);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	approvedShareWith(sharedWithEmail: string, sharedWithId: string) {
		let dashboardShare = new DashboardShare(
			this.dashboard,
			sharedWithEmail,
			sharedWithId,
			'Approved',
			new Date(),
			new Date()
		);
		this.dashboardsShare.push(dashboardShare);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	rejectedShareWith(sharedWithEmail: string) {
		let dashboardShare = new DashboardShare(
			this.dashboard,
			sharedWithEmail,
			undefined,
			'Rejected'
		);
		this.dashboardsShare.push(dashboardShare);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	cancelledShareWith(sharedWithEmail: string, sharedWithId: string) {
		let dashboardShare = new DashboardShare(
			this.dashboard,
			sharedWithEmail,
			sharedWithId,
			'Cancelled',
			new Date(),
			new Date()
		);
		this.dashboardsShare.push(dashboardShare);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	getDashboardsShare() {
		return this.dashboardsShare;
	}
}
