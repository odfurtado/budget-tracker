import Entry from '../../../../src/domain/entity/Entry';

test('should create add a new entry cost', () => {
	var dashboard = 'dashboard-111';
	var date = new Date('2022-08-02');
	var description = 'ice cream';
	var category = 'fun';
	var paymentType = 'credit';
	var amount = 87.36;

	var entry = new Entry(
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

test('should create add a new entry income', () => {
	var dashboard = 'dashboard-111';
	var date = new Date('2022-11-01');
	var description = 'ice cream';
	var category = 'fun';
	var paymentType = 'credit';
	var amount = 87.36;

	var entry = new Entry(
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
