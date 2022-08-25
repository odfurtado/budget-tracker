import RepositoryFactory from '../../src/domain/repository/RepositoryFactory';
import DashboardDataGenerator from './DashboardDataGenerator';

export default class DataGenerator {
	constructor(private readonly repositoryFactory: RepositoryFactory) {}

	dashboard(dashboard: string) {
		return new DashboardDataGenerator(dashboard, this.repositoryFactory);
	}
}
