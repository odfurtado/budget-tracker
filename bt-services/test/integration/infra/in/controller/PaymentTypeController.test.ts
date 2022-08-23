import PaymentTypeController from '../../../../../src/infra/in/controller/PaymentTypeController';
import MemoryRepositoryFactory from '../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

test('Should list all payment types', async () => {
	let repositoryFactory = new MemoryRepositoryFactory();
	let paymentTypeController = new PaymentTypeController(repositoryFactory);
	let result = await paymentTypeController.list();
	expect(result.output).toHaveLength(4);
	expect(result.status).toBe(200);
});
