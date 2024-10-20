import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validateAdmin } from '../../../lib/passwordUtils';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) => {
	try {
		const students = await db.getAllStudents();
		return { students };
	} catch (err) {
		throw error(500, 'Failed to load students');
	}
};

export const actions: Actions = {
	addStudents: async ({ request, cookies }) =>
		validateAdmin(request, cookies, async () => {
			const formData = await request.formData();
			const lastNamesRaw = formData.get('lastNames');

			const uniqueLastNames = Array.from(
				new Set(
					lastNamesRaw
						.split('\n')
						.map((name) => name.trim())
						.filter((name) => name.length > 0)
				)
			);

			try {
				await db.addStudents(uniqueLastNames);
				return { success: true, message: 'Students added successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to add students' };
			}
		}),

	deleteStudent: async ({ request, cookies }) =>
		validateAdmin(request, cookies, async () => {
			const formData = await request.formData();
			const name = formData.get('name');

			try {
				await db.archiveStudent(name);
				return { success: true, message: 'Student deleted successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to delete student' };
			}
		})
};
