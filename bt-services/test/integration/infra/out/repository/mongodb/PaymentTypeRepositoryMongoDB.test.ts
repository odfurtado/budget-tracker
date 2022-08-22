import mongoose from 'mongoose';
import PaymentTypeRepositoryMongoDB from '../../../../../../src/infra/out/repository/mongodb/PaymentTypeRepositoryMongoDB';

let connection: mongoose.Connection;

beforeAll(() => {
	connection = mongoose.createConnection(process.env.MONGODB_URL as string);
});

test('Should return data from database', async () => {
	let paymentTypeRepository = new PaymentTypeRepositoryMongoDB(connection);
	var paymentTypes = await paymentTypeRepository.list();
	expect(paymentTypes).not.toBeNull();
	expect(paymentTypes).not.toBeUndefined();
	expect(paymentTypes).toHaveLength(2);
});

afterAll(async () => {
	await connection.destroy(true);
});
