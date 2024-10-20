import { Database } from '$lib/database';

const db = new Database();

export async function resetStudentsAndTeachersToTestData(): Promise<void> {
	await db.prisma.student.deleteMany({});
	await db.prisma.teacher.deleteMany({});
	await db.addTeacher('teacher1', 1);
	await db.addTeacher('mitchinson', 2);
	await db.addStudents([
		{ studentName: 'asmith', teacherName: 'mitchinson' },
		{ studentName: 'bjohnson', teacherName: 'mitchinson' },
		{ studentName: 'cbrown', teacherName: 'mitchinson' },
		{ studentName: 'dtaylor', teacherName: 'mitchinson' },
		{ studentName: 'eclark', teacherName: 'mitchinson' },
		{ studentName: 'fmiller', teacherName: 'teacher1' },
		{ studentName: 'gwilson', teacherName: 'teacher1' },
		{ studentName: 'hmoore', teacherName: 'teacher1' },
		{ studentName: 'ijones', teacherName: 'teacher1' },
		{ studentName: 'jgarcia', teacherName: 'teacher1' }
	]);
}

export async function resetQuizzesToTestData(): Promise<void> {
	await db.prisma.quiz.deleteMany({});
	await db.addQuiz('Quiz 1', '1+2\n3+4\n5+6');
	await db.addQuiz('Quiz 2', '1+2\n3+4\n5+6');
	await db.addQuiz('Quiz 3', '7+8\n9+1\n4+6');
}
