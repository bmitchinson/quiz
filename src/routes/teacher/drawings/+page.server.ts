import type { Actions, PageServerLoad } from './$types';
import { validateRole } from '$lib/passwordUtils';
import { loadDrawings, deleteDrawingById } from '../../drawingsUtils.server';
import { getYearIntFromCookies } from '$lib/cookieAndAuthUtils';

export const load: PageServerLoad = async ({ request, cookies, url }) =>
	validateRole(request, cookies, ['Teacher'], async (_, teacherName) => {
		const year = await getYearIntFromCookies(cookies);
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = 6;

		// For teachers, always filter by their own name
		const filters = {
			teacherName,
			year
		};

		const result = await loadDrawings(page, pageSize, filters);

		return result;
	});

export const actions: Actions = {
	deleteDrawing: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Teacher'], async (req, loginName) => {
			const data = await request.formData();
			const drawingId = data.get('drawingId');
			return deleteDrawingById(Number(drawingId), loginName);
		})
};
