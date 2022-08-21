import UpdateEntry from "../../../src/application/UpdateEntry";
import Entry from "../../../src/domain/entity/Entry";
import RepositoryFactory from "../../../src/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../../../src/infra/out/repository/memory/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(() => {
  repositoryFactory = new MemoryRepositoryFactory();
});

test("should update an entry", async () => {
  var entryRepository = repositoryFactory.createEntryRepository();
  var entry = new Entry(
    "userid-1111",
    new Date("2022-11-01"),
    "income",
    "salary",
    "salary",
    "transfer",
    7000
  );
  entryRepository.save(entry);
  var input = {
    date: new Date("2023-12-01"),
    type: "cost" as "cost",
    description: "rock in rio",
    category: "fun",
    paymentType: "credit_card",
    amount: 1000
  };
  var updateEntry = new UpdateEntry(repositoryFactory);
  await updateEntry.execute(entry.id, input);
  var updatedEntry = (await entryRepository.get(entry.id)) as Entry;
  expect(updateEntry).not.toBeNull();
  expect(updatedEntry.month).toBe(12);
  expect(updatedEntry.year).toBe(2023);
  expect(updatedEntry.type).toBe("cost");
  expect(updatedEntry.description).toBe("rock in rio");
  expect(updatedEntry.category).toBe("fun");
  expect(updatedEntry.paymentType).toBe("credit_card");
  expect(updatedEntry.amount).toBe(1000);
});
