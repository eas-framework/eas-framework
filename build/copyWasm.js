import fsExtra from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

const copyFrom = __dirname + '/src/CompileCode/', copyTo = __dirname + '/dist/CompileCode/';

const filesToCopy = ['BaseReader/RustBind', 'ScriptReader/RustBind'];

console.log('Copying wasm files...');

for(const i of filesToCopy){
    fsExtra.copy(copyFrom + i, copyTo + i);
}

console.log('Done!');
