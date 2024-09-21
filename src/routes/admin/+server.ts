import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const formData = await request.formData();
	const password = formData.get('password');

	if (typeof password !== 'string') {
		return { success: false, message: 'Invalid input' };
	}

	if (password === process.env.ADMIN_PASSWORD) {
		return json({ success: true });
	} else {
		return json({ success: false, message: 'Incorrect password' });
	}
}
