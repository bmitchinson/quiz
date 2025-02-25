import { clearCookies } from '$lib/passwordUtils';
import { json } from '@sveltejs/kit';
import { logEvent } from '$lib/logging.js';
import { getSignedCookieValue } from '$lib/signedCookie.js';

export const POST = async ({ cookies }) => {
	const loginName = await getSignedCookieValue('loginName', cookies);
	logEvent(loginName, 'Logged Out');
	clearCookies(cookies);
	return json({});
};
