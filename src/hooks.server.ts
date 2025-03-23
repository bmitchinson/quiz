import type { HandleServerError } from '@sveltejs/kit';
import { logSvelteError } from './lib/logging';

export const handleError: HandleServerError = async ({ error, event }) => {
	// reminder: for other apps you'd want to filter event, it has auth data,
	// for this, who cares.
	logSvelteError(error, event);

	// todo: I should probably not log errors in the database level, and just tag
	// them so that they're logged more appropriately here. Current setup will
	// log twice.
};
