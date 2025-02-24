import { addMinutes } from 'date-fns';
import { minutesToTakeQuiz } from './config';

export const quizHasTakenLongerThanAllowed = (timeStarted: Date) =>
	addMinutes(timeStarted, minutesToTakeQuiz) < new Date();
