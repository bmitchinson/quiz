import { invalidateAll } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';
import { get } from 'svelte/store';

const ttlSeconds = parseInt(getEnv('COOKIE_TTL'));

export const cookieTTL = { path: '/', maxAge: ttlSeconds };

function getEnv(name: string): string {
	const value = process.env[name];
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
	requiredRole: string,
	callback: (request: Request) => T
): Promise<T> {
	if (!cookies.get('loginType') === requiredRole) {
		console.error('Bad actor attempt on route: ' + request.url);
		return { error: 'Unauthorized. Knock it off this is a free app for kids :(' };
	} else {
		return callback(request);
	}
}

export function clearCookies(cookies: Cookies): void {
	cookies.delete('loginType', { path: '/' });
	cookies.delete('loginName', { path: '/' });
	cookies.delete('studentId', { path: '/' });
	cookies.delete('teacherId', { path: '/' });
}
