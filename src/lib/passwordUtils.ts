import { invalidateAll } from '$app/navigation';
import { type Cookies } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { clearCookies, getSignedCookieValue } from '$lib/cookieAndAuthUtils';
import { env } from '$env/dynamic/private';
import { logAPIError } from './logging';
import { getEnv } from './config';

export function adminPasswordIsValid(password: string): boolean {
	return password === getEnv('ADMIN_PASSWORD');
}

export function teacherPasswordIsValid(password: string): boolean {
	return password === getEnv('TEACHER_PASSWORD');
}

export async function validateRole<T>(
	request: Request,
	cookies: Cookies,
	requiredRole: string[],
	callback: (request: Request, loginName: string) => T
): Promise<T> {
	const loginType = await getSignedCookieValue('loginType', cookies);
	if (!requiredRole.includes(loginType)) {
		clearCookies(cookies);
		return { error: 'Unauthorized. Knock it off this is a free app for a school district :(' };
	} else {
		const loginName = await getSignedCookieValue('loginName', cookies);
		return callback(request, loginName);
	}
}
