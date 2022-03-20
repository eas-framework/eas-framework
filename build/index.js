import {exec} from 'child_process';
import path from 'path';
import fsExtra from 'fs-extra';
const {copy, remove, mkdir} = fsExtra;

const __dirname = path.resolve(), dist =  __dirname + '/dist/';

console.log('building...');

// deleting the content in dist directory
await remove(dist);
await mkdir(dist);

await import('./build.js');

console.log('Done!');
