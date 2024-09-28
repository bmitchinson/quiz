import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	return {
		validatedUsername: cookies.get('validatedUsername'),
		adminPass: cookies.get('adminPass')
	};
};
