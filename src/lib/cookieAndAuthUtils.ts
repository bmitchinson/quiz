import type { Cookies } from '@sveltejs/kit';
// todo: why aren't I using 'cookie-signature' instead. 44m weekly and has types.
import signature from 'cookie-signature-subtle';
import { getEnv } from './config';
import { getCurrentYearInt } from './dataUtils';
import { logEvent } from '$lib/logging.js';

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

export async function userIsLoggedIn(cookies: Cookies) {
	const loggedInUser = await getSignedCookieValue('loginName', cookies);
	return !!loggedInUser;
}

export async function logout(cookies: Cookies) {
	const loginName = await getSignedCookieValue('loginName', cookies);
	logEvent(loginName, 'Logged Out');
	clearCookies(cookies);
}

export function clearCookies(cookies: Cookies): void {
	cookies.delete('loginType', { path: '/' });
	cookies.delete('loginName', { path: '/' });
	cookies.delete('studentId', { path: '/' });
	cookies.delete('teacherId', { path: '/' });
	cookies.delete('schoolYear', { path: '/' });
}

export async function getYearIntFromCookies(cookies: Cookies) {
	return await getSignedCookieValue('schoolYear', cookies).then((year) =>
		year ? parseInt(year) : getCurrentYearInt()
	);
}
