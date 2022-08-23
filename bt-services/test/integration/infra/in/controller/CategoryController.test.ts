import Category from '../../../../../src/domain/entity/Category';
import CategoryController from '../../../../../src/infra/in/controller/CategoryController';
import MemoryRepositoryFactory from '../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

test('Should list all categories', async () => {
	let repositoryFactory = new MemoryRepositoryFactory();
	let categoryRepository = repositoryFactory.createCategoryRepository();
	await categoryRepository.save(new Category('dashboard1', 'Category 1'));
	await categoryRepository.save(new Category('dashboard1', 'Category 2'));
	await categoryRepository.save(new Category('dashboard1', 'Category 3'));
	await categoryRepository.save(new Category('dashboard2', 'Category 4'));
	let categoryController = new CategoryController(repositoryFactory);
	let result = await categoryController.list('dashboard1');
	expect(result.output).toHaveLength(3);
	expect(result.status).toBe(200);
	result = await categoryController.list('dashboard2');
	expect(result.output).toHaveLength(1);
});

test('Should save category', async () => {
	let repositoryFactory = new MemoryRepositoryFactory();
	let categoryController = new CategoryController(repositoryFactory);
	let resultSave = await categoryController.save('dashboard1', null, {
		name: 'My Category',
	});
	expect(resultSave.status).toBe(201);
	let resultList = await categoryController.list('dashboard1');
	expect(resultList.output).toHaveLength(1);
});

test('Should not save a empty category', async () => {
	let repositoryFactory = new MemoryRepositoryFactory();
	let categoryController = new CategoryController(repositoryFactory);
	let resultSave = await categoryController.save(
		'dashboard1',
		null,
		{} as any
	);
	expect(resultSave.status).toBe(400);
	let resultList = await categoryController.list('dashboard1');
	expect(resultList.output).toHaveLength(0);
});

test('Should delete a category', async () => {
	let repositoryFactory = new MemoryRepositoryFactory();
	let categoryRepository = repositoryFactory.createCategoryRepository();
	let category = new Category('dashboard1', 'Category 1');
	await categoryRepository.save(category);
	let categoryController = new CategoryController(repositoryFactory);
	let resultDelete = await categoryController.delete('dashboard1', {
		id: category.id,
	});
	expect(resultDelete.status).toBe(200);
	let resultList = await categoryController.list('dashboard1');
	expect(resultList.output).toHaveLength(0);
});