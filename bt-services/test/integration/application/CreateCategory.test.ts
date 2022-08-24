import CreateCategory from '../../../src/application/CreateCategory';
import Category from '../../../src/domain/entity/Category';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.CreateCategory', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test('Should create an user´s category', async () => {
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: 'user@mail.com',
			},
			dashboard: 'userId-1111',
			name: 'My Category',
		};
		let output = await new CreateCategory(repositoryFactory).execute(input);
		expect(output.id).not.toBeNull();
		let categoryRepository = repositoryFactory.createCategoryRepository();
		let categories = await categoryRepository.list(input.dashboard);
		expect(categories).toHaveLength(1);
		expect(categories[0].id).toBe(output.id);
		expect(categories[0].dashboard).toBe(input.dashboard);
		expect(categories[0].name).toBe(input.name);
	});

	test('Should create a category in other dashboard that is shared', async () => {
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: 'userId-1111',
			name: 'My Category',
		};
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		dashboardShareRepository.save(
			new DashboardShare(
				input.dashboard,
				input.user.email,
				input.user.id,
				'Approved',
				new Date(),
				new Date()
			)
		);
		let output = await new CreateCategory(repositoryFactory).execute(input);
		expect(output.id).not.toBeNull();
		let categoryRepository = repositoryFactory.createCategoryRepository();
		let categories = await categoryRepository.list(input.dashboard);
		expect(categories).toHaveLength(1);
		expect(categories[0].id).toBe(output.id);
		expect(categories[0].dashboard).toBe(input.dashboard);
		expect(categories[0].name).toBe(input.name);
	});

	test('Cannot create a category in other dashboard that is not shared', async () => {
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: 'userId-1111',
			name: 'My Category',
		};
		await expect(
			new CreateCategory(repositoryFactory).execute(input)
		).rejects.toThrow('The current user is not authorized to create data');
	});

	test('Cannot create a category in other dashboard that shared is rejected', async () => {
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: 'userId-1111',
			name: 'My Category',
		};
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		dashboardShareRepository.save(
			new DashboardShare(
				input.dashboard,
				input.user.email,
				input.user.id,
				'Rejected',
				new Date()
			)
		);
		await expect(
			new CreateCategory(repositoryFactory).execute(input)
		).rejects.toThrow('The current user is not authorized to create data');
	});
});
