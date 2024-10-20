import type { PageServerLoad } from './$types';
import { prisma } from '$lib/database';

export const load: PageServerLoad = async () => {
	const teachers = await prisma.teacher.findMany({
		select: { name: true, grade: true }
	});
	return { teachers };
};
