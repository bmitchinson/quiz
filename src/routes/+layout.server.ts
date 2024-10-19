import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (!cookies.get('loginType') && url.pathname !== '/login') {
		redirect(302, '/login');
	}
};
