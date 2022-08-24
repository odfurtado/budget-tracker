import CreateDashboardShare from '../../../src/application/CreateDashboardShare';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.CreateDashboardShare', () => {
	test('Should create a new dashboard share', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let input = {
			userId: 'userId-1111',
			dashboard: 'userId-1111',
			shareWith: 'anotheruser@mail.com',
		};
		await new CreateDashboardShare(repositoryFactory).execute(input);
		let dashboardShareSaved = await dashboardShareRepository.getByDashboard(
			'userId-1111'
		);
		expect(dashboardShareSaved).toHaveLength(1);
		expect(dashboardShareSaved[0].dashboard).toBe(input.dashboard);
		expect(dashboardShareSaved[0].sharedWithEmail).toBe(input.shareWith);
	});

	test('Should not duplicate a dashboard share with same user', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let input = {
			userId: 'userId-1111',
			dashboard: 'userId-1111',
			shareWith: 'anotheruser@mail.com',
		};
		await new CreateDashboardShare(repositoryFactory).execute(input);
		await expect(() =>
			new CreateDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow('Dashboard already shared with user');
	});

	test('Cannot share a dashboard from other user', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let input = {
			userId: 'userId-1111',
			dashboard: 'userId-1122',
			shareWith: 'anotheruser@mail.com',
		};
		await expect(() =>
			new CreateDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow('Cannot share this dashboard');
	});
});
