import { redirect, type Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue } from '$lib/cookieAndAuthUtils';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if ((await getSignedCookieValue('loginType', cookies)) !== 'Student') {
		throw redirect(302, '/login');
	}
};
