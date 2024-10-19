import { json, type Cookies } from '@sveltejs/kit';
import { cookieTTL, adminPasswordIsValid } from '$lib/passwordUtils';

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const loginType = data.loginType;

	switch (loginType) {
		case 'Admin':
			return validateAdminAndUpdateCookies(data.inputValue, cookies)
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid admin login' });
		case 'Student':
			cookies.delete('validatedUsername', { path: '/' });
			return json({ success: true });
		case 'Teacher':
			cookies.delete('validatedUsername', { path: '/' });
			return json({ success: true });
	}
};

const validateAdminAndUpdateCookies = (password: String, cookies: Cookies): boolean => {
	if (adminPasswordIsValid(password)) {
		cookies.set('loginType', 'Admin', cookieTTL);
		cookies.set('loginName', 'Admin', cookieTTL);
		return true;
	} else {
		cookies.delete('loginType', { path: '/' });
		cookies.delete('loginName', { path: '/' });
		return false;
	}
};
