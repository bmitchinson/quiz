import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setSignedCookieValue } from '$lib/signedCookie';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { schoolYear } = await request.json();

		if (!schoolYear) {
			return json({ error: 'School year is required' }, { status: 400 });
		}

		await setSignedCookieValue('schoolYear', schoolYear, cookies);

		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to set school year' }, { status: 500 });
	}
};
