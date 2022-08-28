import UpdateEntry from '../../../src/application/UpdateEntry';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import Entry from '../../../src/domain/entity/Entry';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

let repositoryFactory: RepositoryFactory;

describe('UseCase.UpdateEntry', () => {
	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test('Should update an entry', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let entry = new Entry(
			'userId-1111',
			new Date('2022-11-01'),
			'income',
			'salary',
			'salary',
			'transfer',
			7000
		);
		entryRepository.save(entry);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			id: entry.id,
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		await new UpdateEntry(repositoryFactory).execute(input);
		let entrySaved = (await entryRepository.get(entry.id)) as Entry;
		expect(entrySaved).not.toBeNull();
		expect(entrySaved.month).toBe(input.date.getUTCMonth() + 1);
		expect(entrySaved.year).toBe(input.date.getUTCFullYear());
		expect(entrySaved.type).toBe(input.type);
		expect(entrySaved.description).toBe(input.description);
		expect(entrySaved.category).toBe(input.category);
		expect(entrySaved.paymentType).toBe(input.paymentType);
		expect(entrySaved.amount).toBe(input.amount);
	});

	test('Should update an entry from other user that dashboard is shared', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let entry = new Entry(
			'userId-1111',
			new Date('2022-11-01'),
			'income',
			'salary',
			'salary',
			'transfer',
			7000
		);
		await entryRepository.save(entry);
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'otheruser@mail.com',
			'userId-2222',
			'Approved',
			new Date(),
			new Date()
		);
		await dashboardShareRepository.save(dashboardShare);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			id: entry.id,
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		await new UpdateEntry(repositoryFactory).execute(input);
		let entrySaved = (await entryRepository.get(entry.id)) as Entry;
		expect(entrySaved).not.toBeNull();
		expect(entrySaved.month).toBe(input.date.getUTCMonth() + 1);
		expect(entrySaved.year).toBe(input.date.getUTCFullYear());
		expect(entrySaved.type).toBe(input.type);
		expect(entrySaved.description).toBe(input.description);
		expect(entrySaved.category).toBe(input.category);
		expect(entrySaved.paymentType).toBe(input.paymentType);
		expect(entrySaved.amount).toBe(input.amount);
	});

	test('Cannot update an entry from other user that dashboard is not shared', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let entry = new Entry(
			'userId-1111',
			new Date('2022-11-01'),
			'income',
			'salary',
			'salary',
			'transfer',
			7000
		);
		await entryRepository.save(entry);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			id: entry.id,
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		await expect(
			new UpdateEntry(repositoryFactory).execute(input)
		).rejects.toThrow(
			'The current user is not authorized to change the data'
		);
		let entrySaved = (await entryRepository.get(entry.id)) as Entry;
		expect(entrySaved).not.toBeNull();
		expect(entrySaved.month).toBe(entry.date.getUTCMonth() + 1);
		expect(entrySaved.year).toBe(entry.date.getUTCFullYear());
		expect(entrySaved.type).toBe(entry.type);
		expect(entrySaved.description).toBe(entry.description);
		expect(entrySaved.category).toBe(entry.category);
		expect(entrySaved.paymentType).toBe(entry.paymentType);
		expect(entrySaved.amount).toBe(entry.amount);
	});

	test('Cannot update an invalid entry', async () => {
		let entryRepository = repositoryFactory.createEntryRepository();
		let entry = new Entry(
			'userId-1111',
			new Date('2022-11-01'),
			'income',
			'salary',
			'salary',
			'transfer',
			7000
		);
		await entryRepository.save(entry);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			id: 'invalidentryid',
		};
		await expect(
			new UpdateEntry(repositoryFactory).execute(input)
		).rejects.toThrow('Entry not found');
	});
});
