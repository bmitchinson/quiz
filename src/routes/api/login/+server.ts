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
			return (await validateAdminAndUpdateCookies(data.inputValue, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid admin login' });
			break;
		case 'Student':
			return (await validateStudentAndUpdateCookies(data.inputValue, data.selectedTeacher, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid student login' });
			break;
		case 'Teacher':
			return (await validateTeacherAndUpdateCookies(data.inputValue, data.teacherName, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid teacher login' });
			break;
	}
};

const validateAdminAndUpdateCookies = async (password: String, cookies: Cookies): boolean => {
	if (adminPasswordIsValid(password)) {
		await setSignedCookieValue('loginType', 'Admin', cookies);
		await setSignedCookieValue('loginName', 'Admin', cookies);
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
		await setSignedCookieValue('loginType', 'Student', cookies);
		await setSignedCookieValue('loginName', studentName, cookies);
		await setSignedCookieValue('studentId', studentId.toString(), cookies);
		return true;
	} else {
		clearCookies(cookies);
		console.log('student', studentName, 'does not belong to teacher', teacherName);
		return false;
	}
};

const validateTeacherAndUpdateCookies = async (
	teacherPassword: String,
	teacherName: String,
	cookies: Cookies
): Promise<boolean> => {
	if (teacherPasswordIsValid(teacherPassword)) {
		const teacher = await db.getTeacher(teacherName);
		if (teacher) {
			await setSignedCookieValue('loginType', 'Teacher', cookies);
			await setSignedCookieValue('loginName', teacherName, cookies);
			await setSignedCookieValue('teacherId', teacher.id.toString(), cookies);
			return true;
		}
	}

	clearCookies(cookies);
	console.log('teacher:', teacherName, 'used invalid teacher password:', teacherPassword);
	return false;
};
