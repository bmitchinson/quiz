import { addMinutes } from 'date-fns';
import { minutesToTakeQuiz, timeLimitQuizTakingFeatureFlag } from './config';

export const quizHasTakenLongerThanAllowed = (timeStarted: Date) =>
	timeLimitQuizTakingFeatureFlag && addMinutes(timeStarted, minutesToTakeQuiz) < new Date();
