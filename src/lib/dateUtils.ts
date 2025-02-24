import { addMinutes } from 'date-fns';

export const quizHasTakenLongerThan5Minutes = (timeStarted: Date, timeFinished: Date) =>
	addMinutes(timeStarted, 5) < timeFinished;
