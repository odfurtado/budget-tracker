import Security from './Secutity';
import { google } from 'googleapis';

export default class GoogleSecurity implements Security {
	async extract(token: string): Promise<string | null> {
		try {
			const oauth2 = google.oauth2({
				version: 'v2',
				headers: {
					Authorization: token,
				},
			});
			let userInfo = await oauth2.userinfo.get();

			if (userInfo && userInfo.data) {
				return userInfo.data.id as string;
			}
		} catch (e: any) {
			console.log('GoogleSecurity.extract :: ERROR :: ', e.message);
		}

		return null;
	}
}
