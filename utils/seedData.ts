import {
	clearAllDbEntries,
	resetQuizzesToTestData,
	resetStudentsAndScores,
	initializeTestTeachers,
	resetScoresToTestData,
	printQuizCodes
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await resetQuizzesToTestData();
await resetStudentsAndScores();
