import GetCategories from "../../../src/application/GetCategories";
import Category from "../../../src/domain/entity/Category";
import RepositoryFactory from "../../../src/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../../../src/infra/out/repository/memory/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;
beforeEach(() => {
  repositoryFactory = new MemoryRepositoryFactory();
  let categoryRepository = repositoryFactory.createCategoryRepository();
  categoryRepository.save(new Category(null, "Salary"));
  categoryRepository.save(new Category(null, "Home"));
  categoryRepository.save(new Category(null, "Car"));
});

test("shoould list all categories", async () => {
  let getCategories = new GetCategories(repositoryFactory);
  let input = {
    user: {
      id: "user-id1111"
    }
  };
  let output = await getCategories.execute(input);
  expect(output).not.toBeNull();
  expect(output.categories).not.toBeUndefined();
  expect(output.categories).not.toBeNull();
  expect(output.categories).toHaveLength(3);
});

test("shoould list all categories and user categories", async () => {
  let categoryRepository = repositoryFactory.createCategoryRepository();
  categoryRepository.save(new Category("user-id1111", "User´s Category 1"));
  categoryRepository.save(new Category("user-id2222", "User´s Category 2"));
  let getCategories = new GetCategories(repositoryFactory);
  let input = {
    user: {
      id: "user-id1111"
    }
  };
  let output = await getCategories.execute(input);
  expect(output).not.toBeNull();
  expect(output.categories).not.toBeUndefined();
  expect(output.categories).not.toBeNull();
  expect(output.categories).toHaveLength(4);
});
