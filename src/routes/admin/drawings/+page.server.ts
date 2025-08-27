import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import { loadDrawings, deleteDrawingById } from '../../drawingsUtils.server';
import { getYearIntFromCookies } from '$lib/cookieAndAuthUtils';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies, url }) =>
	validateRole(request, cookies, ['Admin'], async () => {
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = 6;
		const gradeParam = url.searchParams.get('grade');
		const teacherName = url.searchParams.get('teacherName');
		const year = await getYearIntFromCookies(cookies);

		const filters = {
			...(gradeParam && { grade: parseInt(gradeParam) }),
			...(teacherName && { teacherName }),
			...(year && { year })
		};

		const result = await loadDrawings(page, pageSize, filters);
		const teachers = await db.getAllTeachers();

		return {
			...result,
			teachers
		};
	});

export const actions: Actions = {
	deleteDrawing: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Admin'], async (req, loginName) => {
			const data = await request.formData();
			const drawingId = data.get('drawingId');
			return deleteDrawingById(Number(drawingId), loginName);
		})
};
