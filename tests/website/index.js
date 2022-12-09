import { GlobalSettings } from '../../src/Settings/GlobalSettings.js';
import { fileURLToPath } from 'node:url';
import { initialize } from '../../src/index.js';
export const WEBSITE_DIRECTORY = fileURLToPath(new URL('./', import.meta.url));
GlobalSettings.websiteDirectory = WEBSITE_DIRECTORY;
await initialize();
