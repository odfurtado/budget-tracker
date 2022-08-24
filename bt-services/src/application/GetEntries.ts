import Entry from '../domain/entity/Entry';
import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class GetEntries {
	private entryRepository: EntryRepository;
	private dashboardShareRepository: DashboardShareRepository;

	constructor(readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<Output> {
		let dashboardShare = await this.dashboardShareRepository.getCurrent(
			input.dashboard,
			input.user.id
		);
		Entry.checkIfCurrentUserCanList(
			input.user,
			input.dashboard,
			dashboardShare
		);

		var entries = await this.entryRepository.list(
			input.dashboard,
			input.year,
			input.month
		);
		return {
			entries,
		};
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	month?: number;
	year?: number;
};

type Output = {
	entries: Entry[];
};
