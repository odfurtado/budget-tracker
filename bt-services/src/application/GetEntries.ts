import Entry from '../domain/entity/Entry';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class GetEntries {
	private entryRepository: EntryRepository;

	constructor(readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(input: Input): Promise<Output> {
		var entries = await this.entryRepository.list(
			input.user.id,
			input.year,
			input.month
		);
		return {
			entries,
		};
	}
}

type Input = {
	user: {
		id: string;
	};
	month?: number;
	year?: number;
};

type Output = {
	entries: Entry[];
};
