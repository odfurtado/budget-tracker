import dotenv from 'dotenv';
import ShareController from './infra/in/controller/dashboard/ShareController';
import MeController from './infra/in/controller/MeController';
import PaymentTypeController from './infra/in/controller/PaymentTypeController';
import ExpressAdapter from './infra/in/http/ExpressAdapter';
import GoogleSecurity from './infra/in/security/GoogleSecurity';
import MongoDBRepositoryFactory from './infra/out/repository/mongodb/MongoDBRepositoryFactory';

dotenv.config();
let repositoryFactory = new MongoDBRepositoryFactory();
let http = new ExpressAdapter();
http.secure(new GoogleSecurity());
new PaymentTypeController(repositoryFactory).bind(http);
// new CategoryController(repositoryFactory).bind(http);
// new EntryController(repositoryFactory).bind(http);
new MeController(repositoryFactory).bind(http);
new ShareController(repositoryFactory).bind(http);
let serverPort = parseInt(process.env.SERVER_PORT as string) || 8080;
http.listen(serverPort);
