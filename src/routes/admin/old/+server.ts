import { json } from '@sveltejs/kit';
import { cookieTTL, adminPasswordIsValid } from '$lib/passwordUtils';

export async function POST({ request, cookies }) {
	const formData = await request.formData();
	const password = formData.get('password');

	if (adminPasswordIsValid(password)) {
		cookies.set('adminPass', formData.get('password'), cookieTTL);
		return json({ success: true });
	} else {
		return json({ success: false, message: 'Incorrect password' });
	}
}
