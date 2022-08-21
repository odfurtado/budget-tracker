import GetPaymentTypes from '../../../application/GetPaymentTypes';
import RepositoryFactory from '../../../domain/repository/RepositoryFactory';
import Http from '../http/Http';

export default class PaymentTypeController {
	constructor(private repositoryFactory: RepositoryFactory) {}

	list = async (params: any) => {
		return await new GetPaymentTypes(this.repositoryFactory).execute();
	};

	public bind(http: Http) {
		http.on('get', '/paymenttypes', this.list);
	}
}
