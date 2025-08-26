import type { PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { logout, userIsLoggedIn } from '$lib/cookieAndAuthUtils';
import { redirect } from '@sveltejs/kit';

const db = new Database();

export const load: PageServerLoad = async ({ cookies }) => {
	if (await userIsLoggedIn(cookies)) {
		await logout(cookies);
		throw redirect(302, '/');
	}

	const teachers = await db.getAllTeachers();
	return { teachers };
};
