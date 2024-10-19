import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const loginType = cookies.get('loginType');

	if (!loginType && url.pathname !== '/login') {
		throw redirect(302, '/login');
	}

	return {
		loginType,
		loginName: cookies.get('loginName')
	};
};
