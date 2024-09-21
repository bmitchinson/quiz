import { json } from '@sveltejs/kit';
import { passwordIsValid } from '$lib/passwordcheck';

export async function POST({ request }) {
	const formData = await request.formData();
	const password = formData.get('password');

	if (typeof password !== 'string') {
		return { success: false, message: 'Invalid input' };
	}

	if (passwordIsValid(password)) {
		return json({ success: true });
	} else {
		return json({ success: false, message: 'Incorrect password' });
	}
}
