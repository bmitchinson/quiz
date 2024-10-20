import { invalidateAll } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';

const ttlSeconds = parseInt(process.env.COOKIE_TTL);

export const cookieTTL = { path: '/', maxAge: ttlSeconds };

export function adminPasswordIsValid(password: string): boolean {
	return password === process.env.ADMIN_PASSWORD;
}

export async function validateAdmin<T>(
	request: Request,
	cookies: Cookies,
	callback: (request: Request) => T
): Promise<T> {
	if (!cookies.get('loginType') === 'Admin') {
		console.error('Password at api route attempted - ' + password + ' route: ' + request.url);
		return { error: 'Unauthorized. Knock it off this is a free app for kids :(' };
	} else {
		return callback(request);
	}
}

export function clearCookies(cookies: Cookies): void {
	cookies.delete('loginType', { path: '/' });
	cookies.delete('loginName', { path: '/' });
	cookies.delete('studentId', { path: '/' });
}
