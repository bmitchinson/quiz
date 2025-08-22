import type { PlaywrightTestConfig } from '@playwright/test';
import { config } from 'dotenv';
config({ path: '.env' });

const playwrightConfig: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	timeout: 10000
};

export default playwrightConfig;
