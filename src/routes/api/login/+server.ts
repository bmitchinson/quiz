import { json, type Cookies } from '@sveltejs/kit';
import { cookieTTL, adminPasswordIsValid, clearCookies } from '$lib/passwordUtils';
import { Database } from '$lib/database';

const db = new Database();

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const loginType = data.loginType;

	switch (loginType) {
		case 'Admin':
			return validateAdminAndUpdateCookies(data.inputValue, cookies)
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid admin login' });
			break;
		case 'Student':
			return (await validateStudentAndUpdateCookies(data.inputValue, data.selectedTeacher, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid student login' });
			break;
		case 'Teacher':
			// cookies.delete('validatedUsername', { path: '/' });
			return json();
			break;
	}
};

const validateAdminAndUpdateCookies = (password: String, cookies: Cookies): boolean => {
	if (adminPasswordIsValid(password)) {
		cookies.set('loginType', 'Admin', cookieTTL);
		cookies.set('loginName', 'Admin', cookieTTL);
		return true;
	} else {
		clearCookies(cookies);
		return false;
	}
};

const validateStudentAndUpdateCookies = async (
	studentName: String,
	teacherName: String,
	cookies: Cookies
): Promise<boolean> => {
	const studentId = await db.studentBelongsToTeacher(studentName, teacherName);
	if (studentId) {
		cookies.set('loginType', 'Student', cookieTTL);
		cookies.set('loginName', studentName, cookieTTL);
		cookies.set('studentId', studentId, cookieTTL);
		console.log('student', studentName, 'belongs to teacher', teacherName);
		return true;
	} else {
		clearCookies(cookies);
		console.log('student', studentName, 'does not belong to teacher', teacherName);
		return false;
	}
};
