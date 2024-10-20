import { json, type Cookies } from '@sveltejs/kit';
import {
	cookieTTL,
	adminPasswordIsValid,
	clearCookies,
	teacherPasswordIsValid
} from '$lib/passwordUtils';
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
			return (await validateTeacherAndUpdateCookies(data.inputValue, data.teacherName, cookies))
				? json({ success: true })
				: json({ success: false, errorMsg: 'Invalid teacher login' });
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

const validateTeacherAndUpdateCookies = async (
	teacherPassword: String,
	teacherName: String,
	cookies: Cookies
): Promise<boolean> => {
	if (teacherPasswordIsValid(teacherPassword)) {
		const teacher = await db.getTeacher(teacherName);
		if (teacher) {
			cookies.set('loginType', 'Teacher', cookieTTL);
			cookies.set('loginName', teacherName, cookieTTL);
			cookies.set('teacherId', teacher.id, cookieTTL);
			return true;
		} else {
			clearCookies(cookies);
			console.log('teacher', teacherName, 'does not exist or password is invalid');
			return false;
		}
	}
};
