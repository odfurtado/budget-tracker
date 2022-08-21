import Http from './Http';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

export default class ExpressAdapter implements Http {
	private app: any;

	constructor() {
		this.app = express();
		this.app.use(bodyParser.json());
	}

	private parseUrl(url: string) {
		return url.replace(/\{/g, ':').replace(/\}/g, '');
	}

	on(method: string, url: string, callback: Function): void {
		this.app[method](
			this.parseUrl(url),
			async (req: Request, res: Response) => {
				const output = await callback(req.params, req.body);
				res.json(output);
			}
		);
	}

	listen(port: number): void {
		this.app.listen(port, () =>
			console.log(`Server running on port ${port}`)
		);
	}
}
