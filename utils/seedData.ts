import {
	clearAllDbEntries,
	initializeTestQuizzes,
	initializeTestStudents,
	initializeTestTeachers,
	printQuizCodes
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await initializeTestStudents();
await initializeTestQuizzes();

await printQuizCodes();
