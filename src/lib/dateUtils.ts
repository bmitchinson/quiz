import { addMinutes } from 'date-fns';
import { minutesToTakeQuiz } from './config';

// feb 24th disabling because will didn't like that I accidentally left at 1
// minute
export const quizHasTakenLongerThanAllowed = (timeStarted: Date) => false;
// addMinutes(timeStarted, minutesToTakeQuiz) < new Date();
