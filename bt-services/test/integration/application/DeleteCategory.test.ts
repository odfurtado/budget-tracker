import DeleteCategory from '../../../src/application/DeleteCategory';
import Category from '../../../src/domain/entity/Category';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.DeleteCategory', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test("Should delete an user's category", async () => {
		let dashboard = 'userId-1111';
		let categoryRepository = repositoryFactory.createCategoryRepository();
		categoryRepository.save(new Category(null, 'home'));
		categoryRepository.save(new Category(null, 'car'));
		let userCategory1 = new Category(dashboard, 'user category 1');
		let userCategory2 = new Category(dashboard, 'user category 2');
		categoryRepository.save(userCategory1);
		categoryRepository.save(userCategory2);
		let input = {
			user: {
				id: dashboard,
				name: '',
				email: 'user@mail.com',
			},
			dashboard,
			category: userCategory1.id,
		};
		await new DeleteCategory(repositoryFactory).execute(input);
		let categories = await categoryRepository.list(dashboard);
		expect(categories).toHaveLength(3);
	});

	test('Should not delete system category', async () => {
		let dashboard = 'userId-1111';
		let categoryRepository = repositoryFactory.createCategoryRepository();
		let systemCategory01 = new Category(null, 'home');
		categoryRepository.save(systemCategory01);
		categoryRepository.save(new Category(null, 'car'));
		categoryRepository.save(new Category(dashboard, 'user category 1'));
		let input = {
			user: {
				id: dashboard,
				name: '',
				email: 'user@mail.com',
			},
			dashboard,
			category: systemCategory01.id,
		};
		await expect(
			new DeleteCategory(repositoryFactory).execute(input)
		).rejects.toThrow('Category not found');
		let categories = await categoryRepository.list(dashboard);
		expect(categories).toHaveLength(3);
	});

	test('Should delete a category from other user that dashboard is shared', async () => {
		let dashboard = 'userId-1111';
		let categoryRepository = repositoryFactory.createCategoryRepository();
		let category = new Category(dashboard, 'user category 1');
		categoryRepository.save(category);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: dashboard,
			category: category.id,
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
		await new DeleteCategory(repositoryFactory).execute(input);
		let categories = await categoryRepository.list(dashboard);
		expect(categories).toHaveLength(0);
	});

	test('Cannot delete a category from other user that dashboard is not shared', async () => {
		let dashboard = 'userId-1111';
		let categoryRepository = repositoryFactory.createCategoryRepository();
		let category = new Category(dashboard, 'user category 1');
		categoryRepository.save(category);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: dashboard,
			category: category.id,
		};
		await expect(
			new DeleteCategory(repositoryFactory).execute(input)
		).rejects.toThrow('The current user is not authorized to delete data');
		let categories = await categoryRepository.list(dashboard);
		expect(categories).toHaveLength(1);
	});
});
