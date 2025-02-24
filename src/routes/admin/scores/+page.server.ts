import type { PageServerLoad } from './$types';
import { Database } from '$lib/database';

const db = new Database();

export const load: PageServerLoad = async ({ cookies }) => {
	const teachers = await db.getAllTeachers();
	return { teachers };
};
