import CreateEntry from "../../../src/application/CreateEntry";
import RepositoryFactory from "../../../src/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../../../src/infra/out/repository/memory/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(async function () {
  repositoryFactory = new MemoryRepositoryFactory();
});

test("Should create an entry - 3 installments", async () => {
  var createEntry = new CreateEntry(repositoryFactory);
  var input = {
    user: {
      id: "id-user-01"
    },
    date: new Date("2022-11-02"),
    type: "cost" as "cost",
    description: "ice cream",
    category: "fun",
    paymentType: "credit",
    amount: 87.36,
    installments: 3
  };
  var output = await createEntry.execute(input);
  expect(output.ids).toHaveLength(3);

  let entries = await repositoryFactory
    .createEntryRepository()
    .list(output.dashboard);

  expect(entries).toHaveLength(3);
  expect(entries[0].month).toBe(11);
  expect(entries[0].year).toBe(2022);
  expect(entries[0].type).toBe(input.type);
  expect(entries[0].category).toBe(input.category);
  expect(entries[0].paymentType).toBe(input.paymentType);
  expect(entries[0].amount).toBe(input.amount / input.installments);
  expect(entries[1].month).toBe(12);
  expect(entries[1].year).toBe(2022);
  expect(entries[1].amount).toBe(input.amount / input.installments);
  expect(entries[2].month).toBe(1);
  expect(entries[2].year).toBe(2023);
  expect(entries[2].amount).toBe(input.amount / input.installments);
});

test("Should create an entry - 1 installments", async () => {
  var createEntry = new CreateEntry(repositoryFactory);
  var input = {
    user: {
      id: "id-user-01"
    },
    date: new Date("2022-11-02"),
    type: "cost" as "cost",
    description: "ice cream",
    category: "fun",
    paymentType: "credit",
    amount: 87.36,
    installments: 1
  };
  var output = await createEntry.execute(input);
  expect(output.ids).toHaveLength(1);

  let entries = await repositoryFactory
    .createEntryRepository()
    .list(output.dashboard);

  expect(entries).toHaveLength(1);
  expect(entries[0].month).toBe(11);
  expect(entries[0].year).toBe(2022);
  expect(entries[0].type).toBe(input.type);
  expect(entries[0].category).toBe(input.category);
  expect(entries[0].paymentType).toBe(input.paymentType);
  expect(entries[0].amount).toBe(input.amount);
});
