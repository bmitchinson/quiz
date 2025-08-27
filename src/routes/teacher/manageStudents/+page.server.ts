import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/passwordUtils';
import { getSignedCookieValue, getYearIntFromCookies } from '$lib/cookieAndAuthUtils';
import { logAPIError, logDBError, logEvent } from '$lib/logging';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) => {
	try {
		const students = await db.getStudentsOfTeacher(
			parseInt(await getSignedCookieValue('teacherId', cookies)),
			await getYearIntFromCookies(cookies)
		);
		return { students };
	} catch (err) {
		logAPIError(
			await getSignedCookieValue('loginName', cookies),
			`Failed to load students on manageStudents`,
			err
		);
		throw error(500, 'Failed to load students');
	}
};

export const actions: Actions = {
	addStudents: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Teacher'], async (_r, loginName) => {
			const formData = await request.formData();
			const lastNamesRawString = formData.get('lastNames')?.toString();
			const teacherName = loginName;

			const uniqueLastNames = lastNamesRawString
				.replace(/[^A-Za-z\n]/g, '')
				.split('\n')
				.map((studentName) => studentName.trim())
				.filter((studentName) => studentName.length > 0);

			try {
				await db.addStudents(uniqueLastNames, teacherName, await getYearIntFromCookies(cookies));
				logEvent(loginName, `Added ${uniqueLastNames.length} students successfully`);
				return { success: true, message: 'Students added successfully' };
			} catch (err) {
				logDBError(loginName, `Failed to add students to database`, err);
				return { success: false, message: 'Failed to add students to database' };
			}
		}),

	deleteStudent: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Teacher'], async (_r, loginName) => {
			const formData = await request.formData();
			const name = formData.get('name');

			try {
				await db.archiveStudent(name, parseInt(await getSignedCookieValue('teacherId', cookies)));
				logEvent(loginName, `Archived Student: ${name}`);
				return { success: true, message: 'Student deleted successfully' };
			} catch (err) {
				logDBError(loginName, `Failed to delete student`, err);
				return { success: false, message: 'Failed to delete student' };
			}
		})
};
