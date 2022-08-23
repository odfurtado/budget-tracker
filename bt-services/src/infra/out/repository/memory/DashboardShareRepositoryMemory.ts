import DashboardShare from '../../../../domain/entity/DashboardShare';
import DashboardShareRepository from '../../../../domain/repository/DashboardShareRepository';

export default class DashboardShareRepositoryMemory
	implements DashboardShareRepository
{
	private dashboardShares: DashboardShare[] = [];

	async save(dashboardShare: DashboardShare): Promise<void> {
		var index = this.dashboardShares.findIndex(
			(e) => e.id === dashboardShare.id
		);
		if (index === -1) {
			this.dashboardShares.push(dashboardShare);
		} else {
			this.dashboardShares[index] = dashboardShare;
		}
	}

	async get(id: string): Promise<DashboardShare | null> {
		return this.dashboardShares.find(
			(dashboardShare) => dashboardShare.id === id
		) as DashboardShare;
	}

	async getByUser(userId: string): Promise<DashboardShare[]> {
		return this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.sharedWithUserId === userId
		);
	}

	async getByDashboard(dashboard: string): Promise<DashboardShare[]> {
		return this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.dashboard === dashboard
		);
	}

	//For test only
	async list(): Promise<DashboardShare[]> {
		return this.dashboardShares;
	}

	async delete(id: string): Promise<void> {
		this.dashboardShares = this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.id !== id
		);
	}
}
