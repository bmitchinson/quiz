import { logSvelteError } from './lib/logging';

export function handleError({ error, event }) {
	// reminder: for other apps you'd want to filter event, it has auth data,
	// for this, who cares.
	logSvelteError(error, event);

	// Let SvelteKit handle the error normally
	return;
}
