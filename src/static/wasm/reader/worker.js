import workerPool from 'workerpool';
import {build_stream, find_end_of_def_skip_block, end_of_block} from './index.js';

workerPool.worker({
    build_stream,
    find_end_of_def_skip_block,
    end_of_block
});