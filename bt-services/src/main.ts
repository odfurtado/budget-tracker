import dotenv from 'dotenv';
import CategoryController from './infra/in/controller/CategoryController';
import PaymentTypeController from './infra/in/controller/PaymentTypeController';
import ExpressAdapter from './infra/in/http/ExpressAdapter';
import MongoDBRepositoryFactory from './infra/out/repository/mongodb/MongoDBRepositoryFactory';

dotenv.config();
let repositoryFactory = new MongoDBRepositoryFactory();
let http = new ExpressAdapter();
new PaymentTypeController(repositoryFactory).bind(http);
new CategoryController(repositoryFactory).bind(http);
let serverPort = parseInt(process.env.SERVER_PORT as string) || 8080;
http.listen(serverPort);
