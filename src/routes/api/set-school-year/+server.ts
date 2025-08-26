import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setSignedCookieValue } from '$lib/cookieAndAuthUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { schoolYear } = await request.json();

		if (!schoolYear || typeof schoolYear !== 'number') {
			return json({ error: 'School year is required and must be a number' }, { status: 400 });
		}

		await setSignedCookieValue('schoolYear', schoolYear.toString(), cookies);

		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to set school year' }, { status: 500 });
	}
};
