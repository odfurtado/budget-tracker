import Http, { CallbackFunction } from './Http';
import express, { Response } from 'express';
import bodyParser from 'body-parser';
import Security from '../security/Secutity';

export default class ExpressAdapter implements Http {
	private app: any;

	constructor() {
		this.app = express();
		this.app.use(bodyParser.json());
	}

	private parseUrl(url: string) {
		return url.replace(/\{/g, ':').replace(/\}/g, '');
	}

	on(method: string, url: string, callback: CallbackFunction): void {
		this.app[method](this.parseUrl(url), async (req: any, res: Response) => {
			try {
				let params = {
					...req.params,
					...req.query,
				};
				const result = await callback(req.userid, params, req.body);
				if (result?.status) {
					res.status(result.status);
				}
				if (result?.output) {
					res.json(result.output);
				} else {
					res.send();
				}
			} catch (e: any) {
				res.status(500).json(e.message);
			}
		});
	}

	secure(security: Security) {
		this.app.use(async (req: any, res: any, next: any) => {
			let token = req.get('Authorization');
			let userId = await security.extract(token);
			if (!userId) {
				res.status(401).send('Unauthorized');
				return;
			}
			req.userid = userId;
			next();
		});
	}

	listen(port: number): void {
		this.app.listen(port, () =>
			console.log(`Server running on port ${port}`)
		);
	}
}
