import winston from 'winston';
import LokiTransport from 'winston-loki';
import { getEnv } from './config';

const lokiUrl = getEnv('LOKI_URL', false);

const transports: winston.transport[] = [];

if (lokiUrl) {
	console.log('Confguring loki logger @ ' + lokiUrl);
	transports.push(
		new LokiTransport({
			host: lokiUrl,
			labels: { app: `quiz-${getEnv('NODE_ENV')?.toLowerCase()}` },
			json: true,
			interval: 5, // flush every 5s
			replaceTimestamp: true,
			basicAuth: getEnv('LOKI_BASICAUTH'),
			batching: true,
			onConnectionError: (err) => console.error(`LOKI ERROR: ${err}`)
		})
	);
} else {
	console.log('Using standard logger');
	const consoleTransport = new winston.transports.Console({
		format: winston.format.simple()
	});
	transports.push(consoleTransport);
}

const logger = winston.createLogger({
	format: lokiUrl ? undefined : winston.format.colorize(),
	transports
});

export const logEvent = (username: string, msg: string) => {
	logger.info(`USR_EVENT {${username}}: ${msg}`);
};

export const logDBError = (username: string, msg: string, error: object) => {
	logger.error(`DB_ERR {${username}}: ${msg}`, { error });
};

export const logAPIError = (username: string, msg: string, error: object) => {
	logger.error(`API_ERR {${username}}: ${msg}`, { error });
};

export const logSvelteError = (error: any, event: object) => {
	let errorMsg = `SVELTE_ERR ${error} - ${JSON.stringify(event)}`;
	if (error?.stack) errorMsg += ' - Stack: ' + error.stack;
	logger.error(errorMsg, { event });
};
