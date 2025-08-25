import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue } from '$lib/signedCookie';

const allowedAnonPages = ['/login', '/faq'];

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const loginType = await getSignedCookieValue('loginType', cookies);

	if (!loginType && !allowedAnonPages.includes(url.pathname)) {
		throw redirect(302, '/login');
	}

	// Get school year from cookie, default to current year if not set
	const generateCurrentSchoolYear = () => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const isAfterJuly1 = now.getMonth() >= 6;
		const currentSchoolYearStart = isAfterJuly1 ? currentYear : currentYear - 1;
		const nextYear = currentSchoolYearStart + 1;
		return `${currentSchoolYearStart.toString().slice(-2)}-${nextYear.toString().slice(-2)}`;
	};

	const schoolYear =
		(await getSignedCookieValue('schoolYear', cookies).then((s) => s.toString())) ||
		generateCurrentSchoolYear();

	return {
		loginType,
		loginName: await getSignedCookieValue('loginName', cookies).then((s) => s.toString()),
		bannerText: process.env.NODE_ENV !== 'production' ? 'Quiz App (Demo Environment)' : 'Quiz App',
		schoolYear
	};
};
