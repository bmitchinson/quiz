import { redirect, type Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (cookies.get('loginType') !== 'Teacher') {
		throw redirect(302, '/login');
	}
};
