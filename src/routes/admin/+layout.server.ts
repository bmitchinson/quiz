import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => ({
	authenticated: !!cookies.get('pass')
});
