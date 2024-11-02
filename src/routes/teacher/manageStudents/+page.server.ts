import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/passwordUtils';
import { getSignedCookieValue } from '$lib/signedCookie';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) => {
	try {
		const students = await db.getStudentsOfTeacher(
			parseInt(await getSignedCookieValue('teacherId', cookies))
		);
		return { students };
	} catch (err) {
		throw error(500, 'Failed to load students');
	}
};

export const actions: Actions = {
	addStudents: async ({ request, cookies }) =>
		validateRole(request, cookies, 'Teacher', async () => {
			const formData = await request.formData();
			const lastNamesRaw = formData.get('lastNames');
			const teacherName = await getSignedCookieValue('loginName', cookies);

			const uniqueLastNames = Array.from(
				new Set(
					lastNamesRaw
						.split('\n')
						.map((studentName) => studentName.trim())
						.filter((studentName) => studentName.length > 0)
						.map((studentName) => ({
							studentName,
							teacherName
						}))
				)
			);

			console.log('lastNamesRaw:', lastNamesRaw);
			console.log('uniqueLastNames:', uniqueLastNames);

			try {
				await db.addStudents(uniqueLastNames);
				return { success: true, message: 'Students added successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to add students' };
			}
		}),

	deleteStudent: async ({ request, cookies }) =>
		validateRole(request, cookies, 'Teacher', async () => {
			const formData = await request.formData();
			const name = formData.get('name');

			try {
				await db.archiveStudent(name, parseInt(await getSignedCookieValue('teacherId', cookies)));
				return { success: true, message: 'Student deleted successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to delete student' };
			}
		})
};
