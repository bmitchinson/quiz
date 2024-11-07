export const getReadableTitleOfQuiz = (quiz: Quiz) =>
	`G${quiz.grade}-Q${quiz.quarter}-${quiz.sequenceLetter}`;
