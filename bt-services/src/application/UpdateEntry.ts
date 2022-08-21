import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class UpdateEntry {
	private entryRepository: EntryRepository;

	constructor(readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(id: string, input: Input): Promise<void> {
		var entry = await this.entryRepository.get(id);
		if (!entry) {
			throw new Error('Entry not found!');
		}
		entry.define(
			input.date,
			input.type,
			input.description,
			input.category,
			input.paymentType,
			input.amount
		);
		await this.entryRepository.save(entry);
	}
}

type Input = {
	date: Date;
	type: 'cost' | 'income';
	description: string;
	category: string;
	paymentType: string;
	amount: number;
};
