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
			replaceTimestamp: true,
			basicAuth: getEnv('LOKI_BASICAUTH'),
			batching: false,
			// ^ I need to disable batching to send logs as soon as they arrive.
			// A race condition against svelte resolving a request which has vercel end the active process.
			// This was a major engineering flaw, but I didn't
			//   know I'd care for log aggregation to this app when choosing serverless.
			// log drains would fix this, but I don't want to pay.
			// adding async blocking logging could fix this as a stop gap, but I don't want to risk a
			//    failing log stopping the application.
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
