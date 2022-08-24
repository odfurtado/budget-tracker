import Entry from '../domain/entity/Entry';
import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateEntry {
	private entryRepository: EntryRepository;
	private dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<Output> {
		let dashboardShare = await this.dashboardShareRepository.getCurrent(
			input.dashboard,
			input.user.id
		);
		Entry.checkIfCurrentUserCanCreate(
			input.user,
			input.dashboard,
			dashboardShare
		);
		let entries = Entry.createEntries(
			input.dashboard,
			input.date,
			input.type,
			input.description,
			input.category,
			input.paymentType,
			input.amount,
			input.installments
		);
		for (let entry of entries) {
			await this.entryRepository.save(entry);
		}
		return {
			ids: entries.map((entry) => entry.id),
			dashboard: entries[0].dashboard,
		};
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	date: Date;
	type: 'cost' | 'income';
	description: string;
	category: string;
	paymentType: string;
	installments: number;
	amount: number;
};

type Output = {
	ids: string[];
	dashboard: string;
};
