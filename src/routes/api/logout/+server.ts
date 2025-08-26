import { json } from '@sveltejs/kit';
import { logout } from '$lib/cookieAndAuthUtils.js';

export const POST = async ({ cookies }) => {
	await logout(cookies);
	return json({});
};
