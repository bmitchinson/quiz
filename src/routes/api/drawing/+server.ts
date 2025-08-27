import { Database, type GetScoresFilters } from '$lib/database';
import { validateRole } from '$lib/passwordUtils.js';
import { json } from '@sveltejs/kit';
import { logDBError, logEvent } from '$lib/logging.js';
import { getSignedCookieValue } from '$lib/signedCookie.js';

const db = new Database();

// +server.ts
export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Student'], async (_r, loginName) => {
		const { jpgBase64, accessCode } = (await request.json()) as {
			jpgBase64: String;
			accessCode: String;
		};
		const studentId = await getSignedCookieValue('studentId', cookies);
		try {
			await db.saveDrawingImage(studentId, accessCode, jpgBase64);
			logEvent(loginName, `Finished drawing image for quiz: ${accessCode}`);
		} catch (err) {
			logDBError(
				loginName,
				`Failed save drawing for accessCode ${accessCode} for student ${loginName}`,
				err
			);
			throw err;
		}

		return json({ success: true });
	});
