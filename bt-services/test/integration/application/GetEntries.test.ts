import GetEntries from "../../../src/application/GetEntries";
import Entry from "../../../src/domain/entity/Entry";
import RepositoryFactory from "../../../src/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../../../src/infra/out/repository/memory/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(() => {
  repositoryFactory = new MemoryRepositoryFactory();
});

test("should return the entries within year and month", async () => {
  var entryRepository = repositoryFactory.createEntryRepository();
  var input = {
    user: {
      id: "userid-1111"
    },
    month: 11,
    year: 2022
  };
  entryRepository.save(
    new Entry(
      input.user.id,
      new Date("2022-11-01"),
      "income",
      "salary",
      "salary",
      "transfer",
      7000
    )
  );
  var getEntries = new GetEntries(repositoryFactory);
  var output = await getEntries.execute(input);
  var entries = output.entries;
  expect(entries).toHaveLength(1);
  expect(entries[0].month).toBe(11);
  expect(entries[0].year).toBe(2022);
  expect(entries[0].type).toBe("income");
  expect(entries[0].amount).toBe(7000);
});
