import Category from '../../../../src/domain/entity/Category';

test('should create a generic category', () => {
	var dashboard = 'dashboard-111';
	var name = 'Fun';

	var category = new Category(null, name);
	expect(category.id).not.toBeNull();
	expect(category.dashboard).toBeNull();
	expect(category.name).toBe(name);
});

test('should create an internal category ', () => {
	var dashboard = 'dashboard-111';
	var name = 'Fun';

	var category = new Category(dashboard, name);
	expect(category.id).not.toBeNull();
	expect(category.dashboard).toBe(dashboard);
	expect(category.name).toBe(name);
});
