import { addDays, addHours, addMonths, addMinutes } from 'date-fns';

export const getReadableTitleOfQuiz = (quiz: Quiz) =>
	`G${quiz.grade}-Q${quiz.quarter}-${quiz.sequenceLetter}`;

export const parseEnteredQuestionsIntoEvalAble = (enteredQuestions: string) => {
	// Step 1: Remove all characters except numbers, operators (+, -, x, /), parentheses, and newlines
	let evalAbleQuestions = enteredQuestions.replace(/[^\d+\-/x()\n]/g, '');
	// Step 2: Remove spaces and tabs
	evalAbleQuestions = evalAbleQuestions.replace(/[ \t]+/g, '');
	// Step 3: Replace multiple newlines with a single newline
	evalAbleQuestions = evalAbleQuestions.replace(/\n+/g, '\n');
	// Step 4: Ensure one space before and after each operator (+, -, x, /)
	evalAbleQuestions = evalAbleQuestions.replace(/\s*([+\-x/])\s*/g, ' $1 ');
	// Step 5: Replace existing newline characters with a | symbol
	evalAbleQuestions = evalAbleQuestions.replace(/\n/g, '|');
	// Step 6: Ensure there are no consecutive operators (+, -, x, /)
	evalAbleQuestions = evalAbleQuestions.replace(/([+\-x/])\s*([+\-x/])/g, '$1');

	return evalAbleQuestions;
};

export const getPercentageCorrect = (correct: number, totalQuestions: number) =>
	((correct / totalQuestions) * 100).toFixed(0) + '%';

export const getRandomDateForQuarterAndSequence = (quarter: number, sequenceLetter: number) => {
	const quarterMonthOffset = 9 / 4; // 9 months a school year
	const letterDayOffset = 80 / 4; // 80 days a quarter
	const startOfSchoolYear = new Date(Date.UTC(2024, 8, 1, 17, 0, 0));

	let result = addMonths(startOfSchoolYear, quarterMonthOffset * quarter);

	let sequenceLetterDayOffset = letterDayOffset;
	if (sequenceLetter === 1) {
		sequenceLetterDayOffset = letterDayOffset * 2;
	} else if (sequenceLetter === 2) {
		sequenceLetterDayOffset = letterDayOffset * 3;
	} else if (sequenceLetter === 3) {
		sequenceLetterDayOffset = letterDayOffset * 4;
	}
	result = addDays(result, sequenceLetterDayOffset);

	const randomDayOffset = Math.floor(Math.random() * 7) - 3;
	result = addDays(result, randomDayOffset);

	const randomHourOffset = Math.floor(Math.random() * 7) - 3;
	result = addHours(result, randomHourOffset);

	const randomMinuteOffset = Math.floor(Math.random() * 60) - 30;
	result = addMinutes(result, randomMinuteOffset);

	return result;
};
