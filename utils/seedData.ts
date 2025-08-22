import {
	clearAllDbEntries,
	resetQuizzesToTestData,
	resetStudentsAndScores,
	initializeTestTeachers
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await resetQuizzesToTestData();
await resetStudentsAndScores();
