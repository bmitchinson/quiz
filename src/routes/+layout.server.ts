import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue, setSignedCookieValue } from '$lib/cookieAndAuthUtils';

const allowedAnonPages = ['/login', '/faq'];

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const loginType = await getSignedCookieValue('loginType', cookies);

	if (!loginType && !allowedAnonPages.includes(url.pathname)) {
		throw redirect(302, '/login');
	}

	// Get school year from cookie, default to current year if not set
	const generateCurrentSchoolYearInt = () => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const isAfterJuly1 = now.getMonth() >= 6;
		const currentSchoolYearStart = isAfterJuly1 ? currentYear : currentYear - 1;
		const nextYear = currentSchoolYearStart + 1;
		return parseInt(
			`${currentSchoolYearStart.toString().slice(-2)}${nextYear.toString().slice(-2)}`
		);
	};

	let schoolYearInt = await getSignedCookieValue('schoolYear', cookies)
		.then((s) => (s ? parseInt(s.toString()) : null))
		.catch(() => null);

	// If no school year cookie exists and user is Admin or Teacher, set it automatically
	if (!schoolYearInt && (loginType === 'Admin' || loginType === 'Teacher')) {
		schoolYearInt = generateCurrentSchoolYearInt();
		await setSignedCookieValue('schoolYear', schoolYearInt.toString(), cookies);
	}

	// Fallback to current year if still not set
	if (!schoolYearInt) {
		schoolYearInt = generateCurrentSchoolYearInt();
	}

	// Convert integer format back to display format for the dropdown
	const schoolYear = schoolYearInt
		? `${Math.floor(schoolYearInt / 100)}-${schoolYearInt % 100}`
		: `${Math.floor(generateCurrentSchoolYearInt() / 100)}-${generateCurrentSchoolYearInt() % 100}`;

	return {
		loginType,
		loginName: await getSignedCookieValue('loginName', cookies).then((s) => s.toString()),
		bannerText: process.env.NODE_ENV !== 'production' ? 'Quiz App (Demo Environment)' : 'Quiz App',
		schoolYear
	};
};
