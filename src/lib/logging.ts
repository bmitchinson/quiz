import pino from 'pino';
import 'pino-loki';
import { getEnv } from './config';

const lokiUrl = getEnv('LOKI_URL', false);

let logger = (() => {
	if (lokiUrl) {
		const isVercel = !!getEnv('VERCEL', false);
		const lokiAuthUser = getEnv('LOKI_BASICAUTH')?.split(':')[0];
		const lokiAuthPass = getEnv('LOKI_BASICAUTH')?.split(':')[1];
		const transport = pino.transport({
			target: 'pino-loki',
			options: {
				host: lokiUrl,
				labels: { app: `quiz-${getEnv('NODE_ENV', false)?.toLowerCase() ?? 'development'}` },
				batching: !isVercel,
				interval: 1,
				basicAuth: {
					username: lokiAuthUser,
					password: lokiAuthPass
				}
			}
		});
		return pino(transport);
	} else {
		return pino();
	}
})();

export const logEvent = (username: string, msg: string) => {
	logger.info(`USR_EVENT {${username}}: ${msg}`);
};

export const logDBError = (username: string, msg: string, error: object) => {
	logger.error({ error }, `DB_ERR {${username}}: ${msg}`);
};

export const logAPIError = (username: string, msg: string, error: object) => {
	logger.error({ error }, `API_ERR {${username}}: ${msg}`);
};

export const logSvelteError = (error: any, event: object) => {
	let errorMsg = `SVELTE_ERR ${error} - ${JSON.stringify(event)}`;
	if (error?.stack) errorMsg += ' - Stack: ' + error.stack;
	logger.error({ event, error }, errorMsg);
};
