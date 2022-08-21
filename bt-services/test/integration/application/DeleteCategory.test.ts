import DeleteCategory from "../../../src/application/DeleteCategory";
import Category from "../../../src/domain/entity/Category";
import RepositoryFactory from "../../../src/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../../../src/infra/out/repository/memory/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;
beforeEach(() => {
  repositoryFactory = new MemoryRepositoryFactory();
});

test("Should delete an user's category", async () => {
  let userId = "user-id1111";
  let categoryRepository = repositoryFactory.createCategoryRepository();
  categoryRepository.save(new Category(null, "home"));
  categoryRepository.save(new Category(null, "car"));
  let userCategory1 = new Category(userId, "user category 1");
  let userCategory2 = new Category(userId, "user category 2");
  categoryRepository.save(userCategory1);
  categoryRepository.save(userCategory2);
  let deleteCategory = new DeleteCategory(repositoryFactory);
  let input = {
    user: {
      id: userId
    },
    id: userCategory1.id
  };
  await deleteCategory.execute(input);
  let categories = await categoryRepository.list(userId);
  expect(categories).toHaveLength(3);
});

test("Should not delete system category", async () => {
  let userId = "user-id1111";
  let categoryRepository = repositoryFactory.createCategoryRepository();
  let systemCategory01 = new Category(null, "home");
  categoryRepository.save(systemCategory01);
  categoryRepository.save(new Category(null, "car"));
  categoryRepository.save(new Category(userId, "user category 1"));
  let deleteCategory = new DeleteCategory(repositoryFactory);
  let input = {
    user: {
      id: userId
    },
    id: systemCategory01.id
  };
  expect(async () => {
    await deleteCategory.execute(input);
  }).rejects.toThrow("Category not found");

  let categories = await categoryRepository.list(userId);
  expect(categories).toHaveLength(3);
});
