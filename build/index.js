import path from 'path';
import fsExtra from 'fs-extra';
const {emptyDir} = fsExtra;

const __dirname = path.resolve(), dist =  __dirname + '/dist/';

console.log('building...');

// deleting the content in dist directory
await emptyDir(dist);

await import('./build.js');

console.log('Done!');
