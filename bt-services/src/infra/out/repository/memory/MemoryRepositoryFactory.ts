import CategoryRepository from '../../../../domain/repository/CategoryRepository';
import EntryRepository from '../../../../domain/repository/EntryRepository';
import PaymentTypeRepository from '../../../../domain/repository/PaymentTypeRepository';
import RepositoryFactory from '../../../../domain/repository/RepositoryFactory';
import CategoryRepositoryMemory from './CategoryRepositoryMemory';
import EntryRepositoryMemory from './EntryRepositoryMemory';
import PaymentTypeRepositoryMemory from './PaymentTypeRepositoryMemory';

export default class MemoryRepositoryFactory implements RepositoryFactory {
	entryRepository: EntryRepository;
	categoryRepository: CategoryRepository;
	paymentTypeRepository: PaymentTypeRepository;

	constructor() {
		this.entryRepository = new EntryRepositoryMemory();
		this.categoryRepository = new CategoryRepositoryMemory();
		this.paymentTypeRepository = new PaymentTypeRepositoryMemory();
	}

	createEntryRepository(): EntryRepository {
		return this.entryRepository;
	}

	createCategoryRepository(): CategoryRepository {
		return this.categoryRepository;
	}

	createPaymentTypeRepository(): PaymentTypeRepository {
		return this.paymentTypeRepository;
	}
}
