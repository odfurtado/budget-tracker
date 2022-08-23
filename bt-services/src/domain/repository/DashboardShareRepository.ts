import DashboardShare from '../entity/DashboardShare';

export default interface DashboardShareRepository {
	save(dashboardShare: DashboardShare): Promise<void>;
	get(id: string): Promise<DashboardShare | null>;
	getByUser(userId: string): Promise<DashboardShare[]>;
	getByDashboard(dashboard: string): Promise<DashboardShare[]>;
	//For test only
	list(): Promise<DashboardShare[]>;
	delete(id: string): Promise<void>;
}
