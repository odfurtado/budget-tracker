import RepositoryFactory from '../../../../../../src/domain/repository/RepositoryFactory';
import ShareController from '../../../../../../src/infra/in/controller/dashboard/ShareController';
import MemoryRepositoryFactory from '../../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../../../../dataGenerator/DataGenerator';

describe('Controller.Dashboard.ShareController', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('List all dashboard share of user', async () => {
		given
			.dashboard('userId-1111')
			.pendingShareWith('anotherUser02@mail.com')
			.approvedShareWith('anotherUser03@mail.com', 'userId-3333')
			.rejectedShareWith('anotherUser04@mail.com');
		given
			.dashboard('userId-2222')
			.approvedShareWith('user01@mail.com', 'userId-1111')
			.cancelledShareWith('anotheruser04@mail.com.br', 'userId-4444');
		given.dashboard('userId-5555').pendingShareWith('user01@mail.com');
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let responseData = await new ShareController(repositoryFactory).list(
			userData,
			{ dashboard: userData.id }
		);
		expect(responseData).not.toBeNull();
		expect(responseData.shared).toHaveLength(3);
		expect(responseData.sharedWithMe).toHaveLength(2);
	});
});
