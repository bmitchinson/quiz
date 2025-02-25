import { invalidateAll } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { getSignedCookieValue } from './signedCookie';
import { env } from '$env/dynamic/private';

export function getEnv(name: string): string {
	const value = env[name];
	if (!value) {
		throw new Error(`Missing environment variable ${name}`);
	}
	return value;
}

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
		console.error('Bad actor attempt on route: ' + request.url);
		return { error: 'Unauthorized. Knock it off this is a free app for a school district :(' };
	} else {
		const loginName = await getSignedCookieValue('loginName', cookies);
		return callback(request, loginName);
	}
}

export function clearCookies(cookies: Cookies): void {
	cookies.delete('loginType', { path: '/' });
	cookies.delete('loginName', { path: '/' });
	cookies.delete('studentId', { path: '/' });
	cookies.delete('teacherId', { path: '/' });
}
