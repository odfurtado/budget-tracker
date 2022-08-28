import DeleteEntry from '../../../src/application/DeleteEntry';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.DeleteEntry', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should delete an entry', async () => {
		let entryId = given
			.dashboard('userId-1111')
			.entry(
				new Date(),
				'cost',
				'my cost 01',
				'category 01',
				'payment type 01',
				120
			);
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let input = {
			user: userData,
			dashboard: userData.id,
			entry: entryId,
		};
		await new DeleteEntry(repositoryFactory).execute(input);
		let entry = await repositoryFactory.createEntryRepository().get(entryId);
		expect(entry).toBeUndefined();
	});

	test('Cannot delete an invalid entry', async () => {
		let entryId = 'invalidEntryId';
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let input = {
			user: userData,
			dashboard: userData.id,
			entry: entryId,
		};
		await expect(
			new DeleteEntry(repositoryFactory).execute(input)
		).rejects.toThrow('Entry not found');
	});
});
