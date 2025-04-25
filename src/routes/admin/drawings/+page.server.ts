import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error, fail } from '@sveltejs/kit';
import { validateRole } from '$lib/passwordUtils';
import { logEvent } from '$lib/logging';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies, url }) =>
	validateRole(request, cookies, ['Admin'], async () => {
		try {
			const page = parseInt(url.searchParams.get('page') || '1');
			const pageSize = 6;
			const gradeParam = url.searchParams.get('grade');
			const teacherName = url.searchParams.get('teacherName');
			const quizCode = url.searchParams.get('quizCode');

			const filters = {
				...(gradeParam && { grade: parseInt(gradeParam) }),
				...(teacherName && { teacherName }),
				...(quizCode && { quizCode })
			};

			const { drawings, total } = await db.getDrawings(page, pageSize, filters);
			const teachers = await db.getAllTeachers();
			return {
				drawings,
				total,
				currentPage: page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
				teachers
			};
		} catch (err) {
			throw error(500, 'Failed to load drawings');
		}
	});

export const actions: Actions = {
	deleteDrawing: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Admin'], async (req, loginName) => {
			const data = await request.formData();
			const drawingId = data.get('drawingId');

			if (!drawingId) {
				return fail(400, { error: 'Missing drawing ID' });
			}

			try {
				await db.deleteDrawing(Number(drawingId));
				logEvent(loginName, `Deleted drawing ${drawingId}`);
				return { success: true };
			} catch (err) {
				logEvent(loginName, `Failed to delete drawing ${drawingId}: ${err.message}`);
				return fail(500, { error: 'Failed to delete drawing' });
			}
		})
};
