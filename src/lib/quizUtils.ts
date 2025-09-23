/**
 * Utility functions for quiz operations
 */

/**
 * Evaluates a mathematical expression string safely
 * @param expression The mathematical expression to evaluate (e.g., "1+3", "4/4", "5x5")
 * @returns The result of the expression or null if evaluation fails
 */
export function evaluateExpression(expression: string): number | null {
	try {
		// Remove any unwanted characters (whitelist numbers, operators, parentheses)
		const safeExpression = expression.replace(/[^-()\d/x+.\s]/g, '');
		// Replace X with * for evaluating multiplication
		const safeExpressionWithFixedMultiplication = safeExpression.replace(/x/g, '*');
		// Evaluate the expression
		// eslint-disable-next-line no-new-func
		return Function(`'use strict'; return (${safeExpressionWithFixedMultiplication})`)();
	} catch (e) {
		console.error('Error evaluating expression:', e);
		return null;
	}
}

/**
 * Parses quiz questions data into an array of individual questions
 * @param questionsData The raw questions data string (e.g., "1+3|4/4|9-0|5x5")
 * @returns Array of question strings
 */
export function parseQuestions(questionsData: string): string[] {
	return questionsData.split('|').map((q) => q.trim());
}

/**
 * Parses student answers into an array of numbers
 * @param answersData The raw answers data (string like "4,1" or string array like ["4", "1"])
 * @returns Array of student answers as numbers
 */
export function parseAnswers(answersData: string | string[]): number[] {
	if (Array.isArray(answersData)) {
		return answersData.map((a) => parseInt(a.trim(), 10));
	}
	return answersData.split(',').map((a) => parseInt(a.trim(), 10));
}

/**
 * Calculates the correct answers for all questions
 * @param questionsData The raw questions data string
 * @returns Array of correct answers
 */
export function getCorrectAnswers(questionsData: string): (number | null)[] {
	const questions = parseQuestions(questionsData);
	return questions.map((question) => evaluateExpression(question));
}

/**
 * Evaluates if a student's answer is correct
 * @param studentAnswer The student's answer
 * @param correctAnswer The correct answer
 * @returns Whether the answer is correct
 */
export function isAnswerCorrect(
	studentAnswer: number | null,
	correctAnswer: number | null
): boolean {
	if (correctAnswer === null || studentAnswer === null) return false;
	return studentAnswer === correctAnswer;
}

/**
 * Calculates the overall score for a quiz
 * @param questionsData The raw questions data string
 * @param answersData The raw answers data (string or string array)
 * @returns Object with score details
 */
export function calculateQuizScore(questionsData: string, answersData: string | string[]) {
	const questions = parseQuestions(questionsData);
	const studentAnswers = parseAnswers(answersData);
	const correctAnswers = getCorrectAnswers(questionsData);

	let correctCount = 0;
	const results = questions.map((question, index) => {
		const studentAnswer = studentAnswers[index] ?? null;
		const correctAnswer = correctAnswers[index];
		const isCorrect = studentAnswer !== null && isAnswerCorrect(studentAnswer, correctAnswer);

		if (isCorrect) correctCount++;

		return {
			question,
			studentAnswer,
			correctAnswer,
			isCorrect
		};
	});

	return {
		results,
		correctCount,
		totalQuestions: questions.length,
		percentage: Math.round((correctCount / questions.length) * 100)
	};
}
