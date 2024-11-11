import {
	clearAllDbEntries,
	resetQuizzesToTestData,
	initializeTestStudents,
	initializeTestTeachers,
	resetScoresToTestData,
	printQuizCodes
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await initializeTestStudents();
await resetQuizzesToTestData();
await resetScoresToTestData();
