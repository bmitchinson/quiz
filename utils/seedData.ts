import {
	clearAllDbEntries,
	resetQuizzesToTestData,
	resetStudentsAndScores,
	initializeTestTeachers,
	resetDrawingsToTestData
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
const quizCodes = await resetQuizzesToTestData();
await resetStudentsAndScores();
await resetDrawingsToTestData();

console.log(quizCodes);
