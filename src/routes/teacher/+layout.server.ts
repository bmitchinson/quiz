import { redirect, type Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue } from '$lib/signedCookie';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if ((await getSignedCookieValue('loginType', cookies)) !== 'Teacher') {
		throw redirect(302, '/login');
	}
};
