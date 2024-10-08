import { invalidateAll } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';

const ttlSeconds = parseInt(process.env.COOKIE_TTL);

console.log('starting up with cookie TTL of ' + ttlSeconds + ' seconds');

export const cookieTTL = { path: '/', maxAge: ttlSeconds };

export function passwordIsValid(password: string): boolean {
	return password === process.env.ADMIN_PASSWORD;
}

export async function validatePasswordAndRefreshCookie<T>(
	request: Request,
	cookies: Cookies,
	callback: (request: Request) => T
): Promise<T> {
	const password = cookies.get('pass');

	if (!passwordIsValid(password)) {
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
	cookies.set('pass', password, cookieTTL);
}
