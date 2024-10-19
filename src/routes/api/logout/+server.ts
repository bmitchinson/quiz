import { clearCookies } from '$lib/passwordUtils';
import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	clearCookies(cookies);
	return json({});
};
