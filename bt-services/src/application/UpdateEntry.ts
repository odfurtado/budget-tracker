import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class UpdateEntry {
	private entryRepository: EntryRepository;
	private dashboardShareRepository: DashboardShareRepository;

	constructor(readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<void> {
		var entry = await this.entryRepository.get(input.id);
		if (!entry) {
			throw new Error('Entry not found!');
		}
		let dashboardShare = await this.dashboardShareRepository.getCurrent(
			entry.dashboard,
			input.user.id
		);
		entry.update(input.user, dashboardShare, {
			date: input.date,
			type: input.type,
			description: input.description,
			category: input.category,
			paymentType: input.paymentType,
			amount: input.amount,
		});
		await this.entryRepository.save(entry);
	}
}

type Input = {
	user: UserData;
	id: string;
	date?: Date;
	type?: 'cost' | 'income';
	description?: string;
	category?: string;
	paymentType?: string;
	amount?: number;
};
