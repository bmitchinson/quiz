import {
	clearAllDbEntries,
	resetQuizzesToTestData,
	initializeTestStudents,
	initializeTestTeachers,
	printQuizCodes
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await initializeTestStudents();
await resetQuizzesToTestData();

await printQuizCodes();
