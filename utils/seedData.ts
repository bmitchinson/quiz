import {
	clearAllDbEntries,
	resetQuizzesToTestData,
	resetStudentsAndScores,
	initializeTestTeachers,
	resetDrawingsToTestData
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await resetQuizzesToTestData();
await resetStudentsAndScores();
await resetDrawingsToTestData();
