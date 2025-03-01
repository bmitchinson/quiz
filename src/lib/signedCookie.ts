import type { Cookies } from '@sveltejs/kit';
import signature from 'cookie-signature-subtle';
import { getEnv } from './config';

const cookieSecret = getEnv('COOKIE_SECRET');

const ttlSeconds = parseInt(getEnv('COOKIE_TTL'));

const cookieTTL = { path: '/', maxAge: ttlSeconds };

export async function setSignedCookieValue(
	attr: String,
	value: String,
	cookies: Cookies
): Promise<void> {
	return signature.sign(value, cookieSecret).then((result) => {
		cookies.set(attr, result, cookieTTL);
	});
}

export async function getSignedCookieValue(attr: String, cookies: Cookies): Promise<String> {
	const signedValue = cookies.get(attr);
	try {
		const unsignedValue = await signature.unsign(signedValue, cookieSecret);
		if (unsignedValue === false) {
			throw new Error('Invalid cookie signature:' + unsignedValue);
		} else {
			return unsignedValue;
		}
	} catch (e) {
		return '';
	}
}

export function clearCookies(cookies: Cookies): void {
	cookies.delete('loginType', { path: '/' });
	cookies.delete('loginName', { path: '/' });
	cookies.delete('studentId', { path: '/' });
	cookies.delete('teacherId', { path: '/' });
}
