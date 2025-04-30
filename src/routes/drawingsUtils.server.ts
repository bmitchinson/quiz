import { Database } from '$lib/database';
import { error, fail } from '@sveltejs/kit';
import { logEvent } from '$lib/logging';

const db = new Database();

// Shared function to load drawings with pagination and filters
export async function loadDrawings(page: number, pageSize: number, filters: any) {
	try {
		const { drawings, total } = await db.getDrawings(page, pageSize, filters);
		return {
			drawings,
			total,
			currentPage: page,
			pageSize,
			totalPages: Math.ceil(total / pageSize)
		};
	} catch (err) {
		console.error('Failed to load drawings:', err);
		throw error(500, 'Failed to load drawings');
	}
}

// Shared function to delete a drawing
export async function deleteDrawingById(drawingId: number, loginName: string) {
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
}
