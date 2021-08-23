import fsExtra from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

const copyFrom = __dirname + '/src/', copyTo = __dirname + '/dist/';

const filesToCopy = ['ImportFiles/ImportWithoutCache.cjs'];

console.log('Copying js files...');

for(const i of filesToCopy){
    fsExtra.copy(copyFrom + i, copyTo + i);
}

console.log('Done!');
