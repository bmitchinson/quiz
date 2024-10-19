import { invalidateAll } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';

const ttlSeconds = parseInt(process.env.COOKIE_TTL);

export const cookieTTL = { path: '/', maxAge: ttlSeconds };

export function adminPasswordIsValid(password: string): boolean {
	return password === process.env.ADMIN_PASSWORD;
}

export async function validateAuthAndRefreshCookie<T>(
	request: Request,
	cookies: Cookies,
	callback: (request: Request) => T
): Promise<T> {
	const password = cookies.get('adminPass');

	if (!adminPasswordIsValid(password)) {
		if (password) {
			console.error('Password at api route attempted - ' + password + ' route: ' + request.url);
		}
		return { error: 'Unauthorized. Knock it off this is a free app for kids :(' };
	} else {
		refreshTTL(cookies, password);
		return callback(request);
	}
}

function refreshTTL(cookies: Cookies, password: string): void {
	cookies.set('adminPass', password, cookieTTL);
}
