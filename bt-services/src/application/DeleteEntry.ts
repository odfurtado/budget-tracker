import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class DeleteEntry {
	private readonly entryRepository: EntryRepository;
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<void> {
		let entry = await this.entryRepository.get(input.entry);
		if (!entry) {
			throw new Error('Entry not found');
		}

		let dashboardShare = await this.dashboardShareRepository.getCurrent(
			input.dashboard,
			input.user.id
		);
		entry?.delete(input.user, dashboardShare);
		await this.entryRepository.delete(entry?.id as string);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	entry: string;
};
