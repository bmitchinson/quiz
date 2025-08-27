import { Logtail } from '@logtail/node';
import { getEnv } from './config';

const sourceToken = getEnv('SOURCE_TOKEN', false);
const ingestingHost = getEnv('INGESTING_HOST', false);

class FakeLogtail {
	error(msg, object) {
		console.error(`${msg} ${object || ''}`);
	}
	info(msg, object) {
		console.info(`${msg} ${object || ''}`);
	}
	flush() {}
}

const logger =
	sourceToken && ingestingHost
		? new Logtail(sourceToken, {
				endpoint: `https://${ingestingHost}`
			})
		: new FakeLogtail();

export const logEvent = (username: string, msg: string) => {
	logger.info(`USR_EVENT {${username}}: ${msg}`);
	logger.flush();
};

export const logDBError = (username: string, msg: string, error: object) => {
	logger.error(`DB_ERR {${username}}: ${msg} ${error}`);
	logger.flush();
};

export const logAPIError = (username: string, msg: string, error: object) => {
	logger.error(`API_ERR {${username}}: ${msg} ${error}`);
	logger.flush();
};

export const logSvelteError = (error: object, event: object) => {
	let errorMsg = `SVELTE_ERR {${error}} - {${JSON.stringify(event)}}`;
	if (error?.stack) {
		errorMsg += ' - Stack: ' + JSON.stringify(error.stack);
	}
	logger.error(errorMsg);
	logger.flush();
};
