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
