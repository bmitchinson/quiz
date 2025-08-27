import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSignedCookieValue, setSignedCookieValue } from '$lib/cookieAndAuthUtils';

const allowedAnonPages = ['/login', '/faq'];

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const loginType = await getSignedCookieValue('loginType', cookies);

	if (!loginType && !allowedAnonPages.includes(url.pathname)) {
		throw redirect(302, '/login');
	}

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

	// Generate school year options dynamically
	const generateSchoolYearOptions = () => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const isAfterJuly1 = now.getMonth() >= 6; // July is month 6 (0-indexed)

		const currentSchoolYearStart = isAfterJuly1 ? currentYear : currentYear - 1;
		const years = [];

		for (let year = 2024; year <= currentSchoolYearStart; year++) {
			const nextYear = year + 1;
			const yearLabel = `${year.toString().slice(-2)}-${nextYear.toString().slice(-2)}`;
			const yearValue = parseInt(`${year.toString().slice(-2)}${nextYear.toString().slice(-2)}`);
			years.push({ label: yearLabel, value: yearValue });
		}

		return years;
	};

	let selectedSchoolYearInt = await getSignedCookieValue('schoolYear', cookies)
		.then((s) => (s ? parseInt(s.toString()) : null))
		.catch(() => null);

	// If no school year cookie exists and user is Admin or Teacher, set it automatically
	if (!selectedSchoolYearInt && (loginType === 'Admin' || loginType === 'Teacher')) {
		selectedSchoolYearInt = generateCurrentSchoolYearInt();
		await setSignedCookieValue('schoolYear', selectedSchoolYearInt.toString(), cookies);
	}

	// Fallback to current year if still not set
	if (!selectedSchoolYearInt) {
		selectedSchoolYearInt = generateCurrentSchoolYearInt();
	}

	return {
		loginType,
		loginName: await getSignedCookieValue('loginName', cookies).then((s) => s.toString()),
		bannerText: process.env.NODE_ENV !== 'production' ? 'Quiz App (Demo Environment)' : 'Quiz App',
		selectedSchoolYear: selectedSchoolYearInt,
		schoolYearOptions: generateSchoolYearOptions()
	};
};
