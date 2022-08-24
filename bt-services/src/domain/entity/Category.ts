import { v4 as uuidv4 } from 'uuid';
import DashboardShare from './DashboardShare';
import UserData from './UserData';

export default class Category {
	id: string;

	constructor(
		readonly dashboard: string | null,
		readonly name: string,
		id?: string
	) {
		this.id = id ? id : uuidv4();
	}

	checkIfCurrentUserCanDelete(
		user: UserData,
		dashboardShare: DashboardShare | null
	) {
		if (!this.dashboard) {
			throw new Error('Category could not be delete');
		}

		if (!Category.hasAccess(user, this.dashboard, dashboardShare)) {
			throw new Error('The current user is not authorized to delete data');
		}
	}

	static hasAccess(
		user: UserData,
		dashboard: string,
		dashboardShare: DashboardShare | null
	) {
		let dashboardFromCurrentUser = dashboard === user.id;
		let dashboardShareIsActive =
			dashboardShare && dashboardShare.isActive(dashboard, user.id);

		return dashboardFromCurrentUser || dashboardShareIsActive;
	}

	public static checkIfCurrentUserCanList(
		user: UserData,
		dashboard: string,
		dashboardShare: DashboardShare | null
	) {
		if (!Category.hasAccess(user, dashboard, dashboardShare)) {
			throw new Error('The current user is not authorized to list the data');
		}
	}
}
