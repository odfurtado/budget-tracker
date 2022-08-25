import Entry from '../../../../../src/domain/entity/Entry';
import EntryController from '../../../../../src/infra/in/controller/EntryController';
import MemoryRepositoryFactory from '../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('Controller.EntryController', () => {
	test('Should list all entries', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let entryRepository = repositoryFactory.createEntryRepository();
		await entryRepository.save(
			new Entry(
				'dashboard1',
				new Date('2022-07-10'),
				'cost',
				'My Cost 1',
				'Home',
				'Credit Card',
				100
			)
		);
		await entryRepository.save(
			new Entry(
				'dashboard1',
				new Date('2022-08-20'),
				'cost',
				'My Cost 2',
				'Health',
				'Online',
				250
			)
		);
		await entryRepository.save(
			new Entry(
				'dashboard1',
				new Date('2022-08-22'),
				'cost',
				'My Cost 3',
				'Car',
				'Debit Card',
				60
			)
		);

		let entryController = new EntryController(repositoryFactory);
		let result = await entryController.list(
			{ id: 'dashboard1', name: '', email: '' },
			{
				month: 8,
				year: 2022,
			}
		);
		expect(result).toHaveLength(2);
		result = await entryController.list(
			{ id: 'dashboard1', name: '', email: '' },
			{ month: 7, year: 2022 }
		);
		expect(result).toHaveLength(1);
	});

	test('Should create an entry', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let entryController = new EntryController(repositoryFactory);
		let body = {
			date: '2022-08-22',
			description: 'My Cost 01',
			type: 'cost' as 'cost',
			category: 'Car',
			paymentType: 'Online',
			installments: 1,
			amount: 100,
		};
		let resultSave = await entryController.save(
			{ id: 'dashboard1', name: '', email: '' },
			{},
			body
		);
		expect(resultSave.status).toBe(201);
		expect(resultSave.output.ids).toHaveLength(1);
		let resultList = await entryController.list(
			{ id: 'dashboard1', name: '', email: '' },
			{
				month: 8,
				year: 2022,
			}
		);
		expect(resultList).toHaveLength(1);
	});

	test('Should update an entry', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let entryRepository = repositoryFactory.createEntryRepository();
		let entry = new Entry(
			'dashboard1',
			new Date('2022-07-10'),
			'income',
			'My Cost 1',
			'Home',
			'Credit Card',
			100
		);
		await entryRepository.save(entry);
		let entryController = new EntryController(repositoryFactory);
		let body = {
			date: '2022-08-22',
			description: 'My Cost 001',
			type: 'cost' as 'cost',
			category: 'Car2',
			paymentType: 'PIX',
			amount: 200,
		};
		await entryController.update(
			{ id: 'dashboard1', name: '', email: '' },
			{ id: entry.id },
			body
		);
		let resultList = await entryController.list(
			{ id: 'dashboard1', name: '', email: '' },
			{
				month: 7,
				year: 2022,
			}
		);
		expect(resultList).toHaveLength(0);
		resultList = await entryController.list(
			{ id: 'dashboard1', name: '', email: '' },
			{
				month: 8,
				year: 2022,
			}
		);
		expect(resultList).toHaveLength(1);
	});
});
