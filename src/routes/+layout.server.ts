import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue } from '$lib/signedCookie';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const loginType = await getSignedCookieValue('loginType', cookies);

	if (!loginType && url.pathname !== '/login') {
		throw redirect(302, '/login');
	}

	return {
		loginType,
		loginName: await getSignedCookieValue('loginName', cookies).then((s) => s.toString())
	};
};
