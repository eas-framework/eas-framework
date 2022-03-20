import path from 'path';
import fsExtra from 'fs-extra';
import { StreamCommand } from './tools/StreamCommand.js';
const {emptyDir} = fsExtra;

const __dirname = path.resolve(), dist =  __dirname + '/dist/';

console.log('building...');

// deleting the content in dist directory
await emptyDir(dist);
await StreamCommand('npm run build:ts'); //create types

await import('./build.js');

console.log('Done!');
