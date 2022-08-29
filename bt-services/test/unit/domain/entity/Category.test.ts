import Category from '../../../../src/domain/entity/Category';
import DashboardShare from '../../../../src/domain/entity/DashboardShare';

describe('Entity.Category', () => {
	test('Should create a generic category', () => {
		var name = 'Fun';
		var category = new Category(null, name);
		expect(category.id).not.toBeNull();
		expect(category.dashboard).toBeNull();
		expect(category.name).toBe(name);
	});

	test('Should create an user category ', () => {
		var dashboard = 'dashboard-111';
		var name = 'Fun';
		var category = new Category(dashboard, name);
		expect(category.id).not.toBeNull();
		expect(category.dashboard).toBe(dashboard);
		expect(category.name).toBe(name);
	});

	test('Should create a category', () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let dashboard = 'userId-1111';
		expect(
			Category.checkIfCurrentUserCanCreate(userData, dashboard)
		).toBeUndefined();
	});

	test('Should create a category from dashboard shared with other user', () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		let dashboardShare = new DashboardShare(
			dashboard,
			userData.email,
			userData.id,
			'Approved'
		);
		expect(
			Category.checkIfCurrentUserCanCreate(
				userData,
				dashboard,
				dashboardShare
			)
		).toBeUndefined();
	});

	test('Cannot create a category from dashboard that is not shared', () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		expect(() =>
			Category.checkIfCurrentUserCanCreate(userData, dashboard)
		).toThrow('The current user is not authorized to create data');
	});

	test('Should list categories', () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let dashboard = 'userId-1111';
		expect(
			Category.checkIfCurrentUserCanList(userData, dashboard)
		).toBeUndefined();
	});

	test('Should list categories from dashboard shared with other user', () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		let dashboardShare = new DashboardShare(
			dashboard,
			userData.email,
			userData.id,
			'Approved'
		);
		expect(
			Category.checkIfCurrentUserCanList(userData, dashboard, dashboardShare)
		).toBeUndefined();
	});

	test('Cannot list categories from dashboard that is not shared', () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		expect(() =>
			Category.checkIfCurrentUserCanList(userData, dashboard)
		).toThrow('The current user is not authorized to list data');
	});

	test('Should delete a category', () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let dashboard = 'userId-1111';
		let category = new Category(dashboard, 'category 01');
		expect(category.delete(userData)).toBeUndefined();
	});

	test('Should delete a category from dashboard shared with other user', () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		let dashboardShare = new DashboardShare(
			dashboard,
			userData.email,
			userData.id,
			'Approved'
		);
		let category = new Category(dashboard, 'category 01');
		expect(category.delete(userData, dashboardShare)).toBeUndefined();
	});

	test('Cannot delete a category from dashboard that is not shared', () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		let category = new Category(dashboard, 'category 01');
		expect(() => category.delete(userData)).toThrow(
			'The current user is not authorized to delete data'
		);
	});

	test('Cannot delete a system category', () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let category = new Category(null, 'category 01');
		expect(() => category.delete(userData)).toThrow(
			'Category cannot be delete'
		);
	});
});
