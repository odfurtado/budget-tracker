import DashboardShare from '../../../../domain/entity/DashboardShare';
import UserData from '../../../../domain/entity/UserData';
import RepositoryFactory from '../../../../domain/repository/RepositoryFactory';
import Http from '../../http/Http';

export default class ShareController {
	private readonly dashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	list = async (userData: UserData, req: any) => {
		let dashboard = req['dashboard'];
		let shared: DashboardShare[] = [];
		if (dashboard === userData.id) {
			shared = await this.dashboardShareRepository.getByDashboard(dashboard);
		}
		let sharedWithMe = await this.dashboardShareRepository.getByEmail(
			userData.email
		);
		return {
			shared: shared.map(this.mapEntityToShareData),
			sharedWithMe: sharedWithMe.map(this.mapEntityToShareData),
		};
	};

	private mapEntityToShareData(dashboardShare: DashboardShare): ShareData {
		return {
			id: dashboardShare.id,
			dashboard: dashboardShare.dashboard,
			sharedWith: {
				id: dashboardShare.sharedWithUserId as string,
				email: dashboardShare.sharedWithEmail as string,
			},
			status: dashboardShare.status as string,
			createdAt: dashboardShare.createdAt,
			approvedAt: dashboardShare.approvedAt,
		};
	}

	bind(http: Http) {
		http.on('get', '/dashboard/{dashboard/share', this.list);
	}
}

type ShareData = {
	id: string;
	dashboard: string;
	sharedWith: {
		id: string;
		email: string;
	};
	status: string;
	createdAt: Date;
	approvedAt: Date | null;
};
