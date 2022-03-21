// @ts-nocheck
import { createRequire } from 'module';
import clearModule from 'clear-module';
import path from 'path';

const require = createRequire(import.meta.url), resolve = (path: string) => require.resolve(path);

export default function (filePath: string) {
    filePath = path.normalize(filePath);

    const module = require(filePath);
    clearModule(filePath);

    return module;
}

export {
    clearModule,
    resolve
}