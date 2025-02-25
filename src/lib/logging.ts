export const logEvent = (username: string, msg: string) => {
	console.log(`USR_EVENT {${username}}:`, msg);
};

export const logDBError = (username: string, msg: string, error: object) => {
	console.error(`DB_ERR {${username}}:`, msg, error);
};

export const logAPIError = (username: string, msg: string, error: object) => {
	console.error(`API_ERR {${username}}:`, msg);
};
