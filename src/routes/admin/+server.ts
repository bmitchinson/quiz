import { json } from '@sveltejs/kit';
import { cookieTTL, passwordIsValid } from '$lib/passwordcheck';

export async function POST({ request, cookies }) {
	const formData = await request.formData();
	const password = formData.get('password');

	if (passwordIsValid(password)) {
		cookies.set('pass', formData.get('password'), cookieTTL);
		return json({ success: true });
	} else {
		return json({ success: false, message: 'Incorrect password' });
	}
}
