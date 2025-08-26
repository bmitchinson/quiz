import { json } from '@sveltejs/kit';
import { logout } from '$lib/cookieAndAuthUtils.js';

export const POST = async ({ cookies }) => {
	logout(cookies);
	return json({});
};
