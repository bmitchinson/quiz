import type { PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { getSignedCookieValue } from '$lib/signedCookie';

const db = new Database();

export const load: PageServerLoad = async ({ cookies }) => {
	const teacherName = await getSignedCookieValue('loginName', cookies);
	const teacher = await db.getTeacher(teacherName);
	return { grade: teacher?.grade };
};
