import DashboardShare from '../../../../src/domain/entity/DashboardShare';
import Entry from '../../../../src/domain/entity/Entry';

describe('Entity.Entry', () => {
	test('should create a new entry cost', () => {
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

	test('should create a new entry income', () => {
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

	test('should update an entry from the same user', () => {
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

	test('should update an entry from differente user that is shared with', () => {
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

	test('Cannot update an entry from differente user that dashboard share is invalid', () => {
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
});
