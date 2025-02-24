import { json, type Cookies } from '@sveltejs/kit';
import { adminPasswordIsValid, clearCookies, teacherPasswordIsValid } from '$lib/passwordUtils';
import { Database } from '$lib/database';
import { setSignedCookieValue } from '$lib/signedCookie';

const db = new Database();

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const loginType = data.loginType;

	switch (loginType) {
		case 'Admin':
			return (await checkAdminLoginAndSetCookies(data.inputValue, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid admin login' });
			break;
		case 'Student':
			return (await checkStudentLoginAndSetCookies(data.inputValue, data.selectedTeacher, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid student login' });
			break;
		case 'Teacher':
			return (await checkTeacherLoginAndSetCookies(data.inputValue, data.teacherName, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid teacher login' });
			break;
	}
};

const checkAdminLoginAndSetCookies = async (password: String, cookies: Cookies): boolean => {
	clearCookies(cookies);
	if (adminPasswordIsValid(password)) {
		await setSignedCookieValue('loginType', 'Admin', cookies);
		await setSignedCookieValue('loginName', 'Admin', cookies);
		return true;
	} else {
		return false;
	}
};

const checkStudentLoginAndSetCookies = async (
	studentName: String,
	teacherName: String,
	cookies: Cookies
): Promise<boolean> => {
	const studentId = await db.studentBelongsToTeacher(studentName, teacherName);
	clearCookies(cookies);
	if (studentId) {
		await setSignedCookieValue('loginType', 'Student', cookies);
		await setSignedCookieValue('loginName', studentName.toLowerCase(), cookies);
		await setSignedCookieValue('studentId', studentId.toString(), cookies);
		return true;
	} else {
		console.log('student', studentName, 'does not belong to teacher', teacherName);
		return false;
	}
};

const checkTeacherLoginAndSetCookies = async (
	teacherPassword: String,
	teacherName: String,
	cookies: Cookies
): Promise<boolean> => {
	clearCookies(cookies);
	if (teacherPasswordIsValid(teacherPassword)) {
		const teacher = await db.getTeacher(teacherName.toLowerCase());
		if (teacher) {
			await setSignedCookieValue('loginType', 'Teacher', cookies);
			await setSignedCookieValue('loginName', teacherName.toLowerCase(), cookies);
			await setSignedCookieValue('teacherId', teacher.id.toString(), cookies);
			return true;
		}
	}
	console.log('teacher:', teacherName, 'used invalid teacher password:', teacherPassword);
	return false;
};
