import GetEntries from '../../../src/application/GetEntries';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import Entry from '../../../src/domain/entity/Entry';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.GetEntries', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test('Should return the entries within year and month', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			month: 11,
			year: 2022,
		};
		entryRepository.save(
			new Entry(
				input.dashboard,
				new Date('2022-11-01'),
				'income',
				'salary',
				'salary',
				'transfer',
				7000
			)
		);
		let output = await new GetEntries(repositoryFactory).execute(input);
		let entries = output.entries;
		expect(entries).toHaveLength(1);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe('income');
		expect(entries[0].amount).toBe(7000);
	});

	test('Should return the entries from other user that dashboard is shared with', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			month: 11,
			year: 2022,
		};
		entryRepository.save(
			new Entry(
				input.dashboard,
				new Date('2022-11-01'),
				'income',
				'salary',
				'salary',
				'transfer',
				7000
			)
		);
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		dashboardShareRepository.save(
			new DashboardShare(
				input.dashboard,
				'otheruser@mail.com',
				input.user.id,
				'Approved',
				new Date(),
				new Date()
			)
		);
		let output = await new GetEntries(repositoryFactory).execute(input);
		let entries = output.entries;
		expect(entries).toHaveLength(1);
		expect(entries[0].dashboard).toBe(input.dashboard);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe('income');
		expect(entries[0].amount).toBe(7000);
	});

	test('Cannot return the entries from other user', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			month: 11,
			year: 2022,
		};
		entryRepository.save(
			new Entry(
				input.dashboard,
				new Date('2022-11-01'),
				'income',
				'salary',
				'salary',
				'transfer',
				7000
			)
		);
		await expect(
			new GetEntries(repositoryFactory).execute(input)
		).rejects.toThrow('The current user is not authorized to list the data');
	});
});
