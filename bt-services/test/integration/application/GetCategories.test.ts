import GetCategories from '../../../src/application/GetCategories';
import Category from '../../../src/domain/entity/Category';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.GetCategories', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		let categoryRepository = repositoryFactory.createCategoryRepository();
		categoryRepository.save(new Category(null, 'Salary'));
		categoryRepository.save(new Category(null, 'Home'));
		categoryRepository.save(new Category(null, 'Car'));
	});

	test('Should list all categories', async () => {
		let categoryRepository = repositoryFactory.createCategoryRepository();
		categoryRepository.save(new Category('userId-1111', 'User´s Category 1'));
		categoryRepository.save(new Category('user-id2222', 'User´s Category 2'));
		let getCategories = new GetCategories(repositoryFactory);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
		};
		let output = await getCategories.execute(input);
		expect(output).not.toBeNull();
		expect(output.categories).not.toBeUndefined();
		expect(output.categories).not.toBeNull();
		expect(output.categories).toHaveLength(4);
	});

	test('Should list all categories from other user that dashboard is shared', async () => {
		let categoryRepository = repositoryFactory.createCategoryRepository();
		categoryRepository.save(new Category('userId-1111', 'User´s Category 1'));
		categoryRepository.save(new Category('user-id2222', 'User´s Category 2'));
		let getCategories = new GetCategories(repositoryFactory);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'otheruser@mail.com',
			},
			dashboard: 'userId-1111',
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
		let output = await getCategories.execute(input);
		expect(output).not.toBeNull();
		expect(output.categories).not.toBeUndefined();
		expect(output.categories).not.toBeNull();
		expect(output.categories).toHaveLength(4);
	});

	test('Cannot list all categories from other user that dashboard is not shared', async () => {
		let categoryRepository = repositoryFactory.createCategoryRepository();
		categoryRepository.save(new Category('userId-1111', 'User´s Category 1'));
		categoryRepository.save(new Category('user-id2222', 'User´s Category 2'));
		let getCategories = new GetCategories(repositoryFactory);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
		};
		await expect(getCategories.execute(input)).rejects.toThrow(
			'The current user is not authorized to list data'
		);
	});
});
