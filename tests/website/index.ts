import {fileURLToPath} from 'node:url';
import {appSettings, initialize} from '../../src/index.js';

export const WEBSITE_DIRECTORY = fileURLToPath(new URL('./', import.meta.url));
appSettings.websiteDirectory = WEBSITE_DIRECTORY;

await initialize();