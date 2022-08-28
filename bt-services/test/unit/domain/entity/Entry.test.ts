import DashboardShare from '../../../../src/domain/entity/DashboardShare';
import Entry from '../../../../src/domain/entity/Entry';

describe('Entity.Entry', () => {
	test('Should create a cost entry', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-08-02');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'cost',
			description,
			category,
			paymentType,
			amount
		);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(8);
		expect(entry.year).toBe(2022);
		expect(entry.date).toBe(date);
		expect(entry.type).toBe('cost');
		expect(entry.description).toBe(description);
		expect(entry.category).toBe(category);
		expect(entry.paymentType).toBe(paymentType);
		expect(entry.amount).toBe(amount);
	});

	test('Should create an income entry ', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-11-01');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'income',
			description,
			category,
			paymentType,
			amount
		);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(11);
		expect(entry.year).toBe(2022);
		expect(entry.date).toBe(date);
		expect(entry.type).toBe('income');
		expect(entry.description).toBe(description);
		expect(entry.category).toBe(category);
		expect(entry.paymentType).toBe(paymentType);
		expect(entry.amount).toBe(amount);
	});

	test('Should update an entry', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-11-01');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'income',
			description,
			category,
			paymentType,
			amount
		);
		let userData = {
			id: 'userId-1111',
			name: '',
			email: '',
		};
		let updateData = {
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		entry.update(userData, null, updateData);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(updateData.date.getUTCMonth() + 1);
		expect(entry.year).toBe(updateData.date.getUTCFullYear());
		expect(entry.date).toStrictEqual(updateData.date);
		expect(entry.type).toBe(updateData.type);
		expect(entry.description).toBe(updateData.description);
		expect(entry.category).toBe(updateData.category);
		expect(entry.paymentType).toBe(updateData.paymentType);
		expect(entry.amount).toBe(updateData.amount);
	});

	test('Should update an entry from dashboard shared with other user', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-11-01');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'income',
			description,
			category,
			paymentType,
			amount
		);
		let userData = {
			id: 'userId-1111',
			name: '',
			email: '',
		};
		let updateData = {
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'otheruser@mail.com',
			'userId-2222',
			'Approved',
			new Date(),
			new Date()
		);
		entry.update(userData, dashboardShare, updateData);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(updateData.date.getUTCMonth() + 1);
		expect(entry.year).toBe(updateData.date.getUTCFullYear());
		expect(entry.date).toStrictEqual(updateData.date);
		expect(entry.type).toBe(updateData.type);
		expect(entry.description).toBe(updateData.description);
		expect(entry.category).toBe(updateData.category);
		expect(entry.paymentType).toBe(updateData.paymentType);
		expect(entry.amount).toBe(updateData.amount);
	});

	test('Cannot update an entry from dashboard that is not shared', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-11-01');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'income',
			description,
			category,
			paymentType,
			amount
		);
		let userData = {
			id: 'userId-2222',
			name: '',
			email: '',
		};
		let updateData = {
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'otheruser@mail.com',
			'userId-2222',
			'Cancelled',
			new Date(),
			new Date()
		);
		expect(() => entry.update(userData, dashboardShare, updateData)).toThrow(
			'The current user is not authorized to change the data'
		);
	});

	test('Should create entry', async () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		expect(
			Entry.checkIfCurrentUserCanCreate(userData, 'userId-1111', null)
		).toBeUndefined();
	});

	test('Should create entry from dashboard shared with other user', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'user02@mail.com',
			'userId-2222',
			'Approved'
		);
		expect(
			Entry.checkIfCurrentUserCanCreate(
				userData,
				'userId-1111',
				dashboardShare
			)
		).toBeUndefined();
	});

	test('Cannot create entry from dashboard that is not shared', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		expect(() =>
			Entry.checkIfCurrentUserCanCreate(userData, 'userId-1111', null)
		).toThrow('The current user is not authorized to create data');
	});

	test('Should list entries', async () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		expect(
			Entry.checkIfCurrentUserCanList(userData, 'userId-1111', null)
		).toBeUndefined();
	});

	test('Should list entries from dashboard shared with other user', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'user02@mail.com',
			'userId-2222',
			'Approved'
		);
		expect(
			Entry.checkIfCurrentUserCanList(
				userData,
				'userId-1111',
				dashboardShare
			)
		).toBeUndefined();
	});

	test('Cannot list entries from dashboard that is not shared', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		expect(() =>
			Entry.checkIfCurrentUserCanList(userData, 'userId-1111', null)
		).toThrow('The current user is not authorized to list the data');
	});

	test('Should delete an entry', async () => {
		let entry = new Entry(
			'userId-1111',
			new Date('2022-08-02'),
			'cost',
			'ice cream',
			'fun',
			'credit',
			87.36
		);
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		expect(entry.delete(userData, null)).toBeUndefined();
	});

	test('Should delete an entry from dashboard shared with other user', async () => {
		let entry = new Entry(
			'userId-1111',
			new Date('2022-08-02'),
			'cost',
			'ice cream',
			'fun',
			'credit',
			87.36
		);
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'user02@mail.com',
			'userId-2222',
			'Approved'
		);
		expect(entry.delete(userData, dashboardShare)).toBeUndefined();
	});

	test('Cannot delete an entry from dashboard that is not shared', async () => {
		let entry = new Entry(
			'userId-1111',
			new Date('2022-08-02'),
			'cost',
			'ice cream',
			'fun',
			'credit',
			87.36
		);
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		expect(() => entry.delete(userData, null)).toThrow(
			'The current user is not authorized to delete the data'
		);
	});
});
