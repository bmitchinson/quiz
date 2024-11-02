import {
	clearAllDbEntries,
	initializeTestQuizzes,
	initializeTestStudents,
	initializeTestTeachers
} from '../tests/testutils';

await clearAllDbEntries();
await initializeTestTeachers();
await initializeTestStudents();
await initializeTestQuizzes();
