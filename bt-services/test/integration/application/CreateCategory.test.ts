import CreateCategory from "../../../src/application/CreateCategory";
import Category from "../../../src/domain/entity/Category";
import RepositoryFactory from "../../../src/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../../../src/infra/out/repository/memory/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;
beforeEach(() => {
  repositoryFactory = new MemoryRepositoryFactory();
});

test("Should create an user´s category", async () => {
  let createCategory = new CreateCategory(repositoryFactory);
  let user = {
    id: "user-id1111"
  };
  let input = {
    user,
    name: "My Category"
  };
  let output = await createCategory.execute(input);
  expect(output.id).not.toBeNull();
  let categoryRepository = repositoryFactory.createCategoryRepository();
  let categories = await categoryRepository.list(user.id);
  expect(categories).toHaveLength(1);
  expect(categories[0].id).toBe(output.id);
  expect(categories[0].dashboard).toBe(user.id);
  expect(categories[0].name).toBe(input.name);
});
