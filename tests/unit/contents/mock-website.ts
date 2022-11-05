import {fileURLToPath} from 'node:url';
import {directories, setDirectories} from '../../../src/Settings/ProjectConsts.js';
import PPath from '../../../src/Settings/PPath.js';

export const SAMPLE_WEBSITE = fileURLToPath(new URL('sample-website/', import.meta.url));

export function getMockPage() {
    return PPath.fromNested(directories.Locate.static, 'index.page');
}

export function setDirectoriesToSampleWebsite() {
    setDirectories(SAMPLE_WEBSITE);
}

