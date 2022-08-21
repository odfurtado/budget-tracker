import CategoryRepository from './CategoryRepository';
import EntryRepository from './EntryRepository';
import PaymentTypeRepository from './PaymentTypeRepository';

export default interface RepositoryFactory {
	createEntryRepository(): EntryRepository;
	createCategoryRepository(): CategoryRepository;
	createPaymentTypeRepository(): PaymentTypeRepository;
}
