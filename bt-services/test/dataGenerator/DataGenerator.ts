import RepositoryFactory from '../../src/domain/repository/RepositoryFactory';
import DashboardDataGenerator from './DashboardDataGenerator';

export default class DataGenerator {
	private dashboards: {
		[key: string]: DashboardDataGenerator;
	} = {};
	constructor(private readonly repositoryFactory: RepositoryFactory) {}

	dashboard(dashboard: string): DashboardDataGenerator {
		if (!this.dashboards[dashboard]) {
			this.dashboards[dashboard] = new DashboardDataGenerator(
				dashboard,
				this.repositoryFactory
			);
		}
		return this.dashboards[dashboard];
	}
}
