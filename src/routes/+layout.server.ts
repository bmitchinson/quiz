import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue } from '$lib/signedCookie';

const allowedAnonPages = ['/login', '/faq'];

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const loginType = await getSignedCookieValue('loginType', cookies);

	if (!loginType && !allowedAnonPages.includes(url.pathname)) {
		throw redirect(302, '/login');
	}

	return {
		loginType,
		loginName: await getSignedCookieValue('loginName', cookies).then((s) => s.toString()),
		bannerText: process.env.NODE_ENV !== 'production' ? 'Quiz App (Demo Environment)' : 'Quiz App'
	};
};
