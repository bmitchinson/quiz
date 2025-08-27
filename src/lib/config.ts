export function getEnv(name: string, required = true) {
	const value = process.env[name];
	if (value == undefined && required) {
		throw new Error(`Missing environment variable ${name}`);
	}
	return value;
}

// feb 24th disabling because will didn't like that I accidentally left at 1 min
export const timeLimitQuizTakingFeatureFlag = false;
export const minutesToTakeQuiz = 1; // only has impact if above is true

export const disallowDistractionsFeatureFlag = true;
export const allowedDistractionsBeforeQuizEnds = 4; // only has impact if above is true

export const tempDisablePrismaQuery = false;

// export const timeToDrawAfterSubmittingQuiz = 300;
