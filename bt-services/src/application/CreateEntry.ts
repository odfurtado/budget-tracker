import Entry from '../domain/entity/Entry';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateEntry {
	entryRepository: EntryRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(input: Input): Promise<Output> {
		var entries = Entry.createEntries(
			input.user.id,
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
	user: {
		id: string;
	};
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
