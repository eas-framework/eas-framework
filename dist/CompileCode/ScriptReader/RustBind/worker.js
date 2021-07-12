import workerPool from 'workerpool';
import {build_stream} from './index.js';

workerPool.worker({
    build_stream
});