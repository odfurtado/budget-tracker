import DashboardShare from '../../../../src/domain/entity/DashboardShare';

describe('Entity.DashboardShare', () => {
	test('Share a dashboard with another user', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(dashboard, email);
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('PendingApproval');
		expect(dashboardShare.sharedWithEmail).toBe(email);
		expect(dashboardShare.sharedWithUserId).toBeNull();
		expect(dashboardShare.createdAt).not.toBeNull();
		expect(dashboardShare.approvedAt).toBeNull();
	});

	test('Approve a dashboard share', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(dashboard, email);
		let userId = 'userId-2222';
		dashboardShare.acceptBy(userId, email);
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('Approved');
		expect(dashboardShare.sharedWithEmail).toBe(email);
		expect(dashboardShare.sharedWithUserId).toBe(userId);
		expect(dashboardShare.createdAt).not.toBeNull();
		expect(dashboardShare.approvedAt).not.toBeNull();
	});

	test('Cannot aprove a dashboard share with a status != PendingApproval', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(
			dashboard,
			email,
			'userId-2222',
			'Approved',
			new Date(),
			new Date()
		);
		let userId = 'userId-2222';
		expect(() => dashboardShare.acceptBy(userId, email)).toThrowError(
			'Cannot accept a dashboard share with status != PendingApproval'
		);
	});

	test('Cannot aprove a dashboard share from other user', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(
			dashboard,
			email,
			'userId-2222',
			'Approved',
			new Date(),
			new Date()
		);
		let userId = 'userId-2222';
		expect(() =>
			dashboardShare.acceptBy(userId, 'invaliduser@email.com')
		).toThrowError('Dashboard share not authorized for user');
	});

	test('Cancel a dashboard share with status == PendingApproval', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(dashboard, email);
		dashboardShare.cancelBy('validuser@mail.com');
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('Rejected');
		expect(dashboardShare.sharedWithEmail).toBe(email);
		expect(dashboardShare.sharedWithUserId).toBeNull();
		expect(dashboardShare.createdAt).not.toBeNull();
		expect(dashboardShare.approvedAt).toBeNull();
	});

	test('Cancel a dashboard share with status == Approved', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(
			dashboard,
			email,
			'userId-2222',
			'Approved',
			new Date(),
			new Date()
		);
		dashboardShare.cancelBy('validuser@mail.com');
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('Cancelled');
		expect(dashboardShare.sharedWithEmail).toBe(email);
		expect(dashboardShare.sharedWithUserId).not.toBeNull();
		expect(dashboardShare.createdAt).not.toBeNull();
		expect(dashboardShare.approvedAt).not.toBeNull();
	});

	test('Cannot cancel a dashboard share from other user', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(dashboard, email);

		expect(() =>
			dashboardShare.cancelBy('invaliduser@mail.com')
		).toThrowError('Dashboard share not authorized for user');
	});
});
