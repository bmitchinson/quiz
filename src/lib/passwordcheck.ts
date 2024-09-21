import { invalidateAll } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';

export const hourTTL = { path: '/', maxAge: 60 * 60 * 1 };

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
		console.error('Password at api route attempted - ' + password + ' route: ' + request.url);
		return { error: 'Unauthorized. Knock it off this is a free app for kids :(' };
	} else {
		refreshTTL(cookies, password);
		return callback(request);
	}
}

function refreshTTL(cookies: Cookies, password: string): void {
	cookies.set('pass', password, hourTTL);
}
