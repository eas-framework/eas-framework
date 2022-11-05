import {cpus} from 'os';
import path from 'path';
import workerPool from 'workerpool';
import {frameworkFiles} from '../../Settings/ProjectConsts.js';

const workerPath = path.join(frameworkFiles, 'StaticFiles', 'wasm', 'component', 'workerInsertComponent.js');
export const pool = workerPool.pool(workerPath, {maxWorkers: cpus().length});