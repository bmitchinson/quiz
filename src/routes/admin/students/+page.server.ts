import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';

const db = new Database();

export const load: PageServerLoad = async () => {
	try {
		const students = await db.getAllStudents();
		return { students };
	} catch (err) {
		throw error(500, 'Failed to load students');
	}
};

export const actions: Actions = {
	addStudents: async ({ request }) => {
		const formData = await request.formData();
		const lastNamesRaw = formData.get('lastNames');

		if (typeof lastNamesRaw !== 'string') {
			return { success: false, message: 'Invalid input' };
		}

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
	},
	deleteStudent: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');

		if (typeof name !== 'string') {
			return { success: false, message: 'Invalid input' };
		}

		try {
			await db.deleteStudent(name);
			return { success: true, message: 'Student deleted successfully' };
		} catch (err) {
			return { success: false, message: 'Failed to delete student' };
		}
	}
};
