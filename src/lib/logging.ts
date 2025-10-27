import pino from 'pino';
import 'pino-loki';
import { getEnv } from './config';

const lokiUrl = getEnv('LOKI_URL', false);

let logger = (() => {
	if (lokiUrl) {
		console.log('Logging with loki @ ', lokiUrl);
		const lokiAuthUser = getEnv('LOKI_BASICAUTH')?.split(':')[0];
		const lokiAuthPass = getEnv('LOKI_BASICAUTH')?.split(':')[1];
		const transport = pino.transport({
			target: 'pino-loki',
			options: {
				host: lokiUrl,
				labels: { app: `quiz-${getEnv('NODE_ENV', false)?.toLowerCase() ?? 'development'}` },
				batching: true,
				interval: 5,
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
	const safeError = {
		name: (error as any)?.name ?? 'Error',
		message: (error as any)?.message ?? String(error),
		stack: (error as any)?.stack
	};

	// Derive a lightweight, JSON-safe summary of the event to avoid circular refs
	const eventInfo: Record<string, unknown> = {};
	try {
		const url = (event as any)?.url;
		if (url) eventInfo.url = typeof url === 'string' ? url : (url.href ?? String(url));

		const route = (event as any)?.route;
		if (route?.id) eventInfo.routeId = route.id;

		const req = (event as any)?.request;
		if (req?.method) eventInfo.method = req.method;

		const params = (event as any)?.params;
		if (params && typeof params === 'object') eventInfo.params = { ...params };
	} catch {
		// ignore extraction errors
	}

	const errorMsg = `SVELTE_ERR ${safeError.message}`;
	logger.error({ error: safeError, event: eventInfo }, errorMsg);
};
