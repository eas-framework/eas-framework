import { cpus } from 'os';
import path from 'path';
import workerPool from 'workerpool';
import { SystemData } from '../../Settings/ProjectConsts.js';

const workerPath = path.join(SystemData, '..', 'static', 'wasm', 'component', 'workerInsertComponent.js')
export const pool = workerPool.pool(workerPath, { maxWorkers: cpus().length });