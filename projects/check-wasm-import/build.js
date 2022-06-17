import {spawn} from 'child_process';
import {promises} from 'fs';
import path from 'path';
const RELEASE = process.argv.includes('release');

console.log('building...');

const OUTPUT_NAME = 'check_wasm_import_bg.wasm';
const COPY_NAME = 'build.serv';
const stream = spawn('wasm-pack', ['build', RELEASE ? '--release': '--dev'], {stdio: 'inherit'});

stream.on('exit', copyFiles);

async function copyFiles(code){
    if (code){
        return;
    }

    const __dirname = path.resolve();
   
    const toPath = __dirname + '/../../tests/core/Website/WWW/server/wasm/';
    const fromPath = __dirname + '/pkg/';

    promises.copyFile(fromPath + OUTPUT_NAME, toPath + COPY_NAME + '.wasm');
    promises.copyFile(fromPath + OUTPUT_NAME + '.d.ts', toPath + COPY_NAME + '.d.ts');
    
    console.log('Done!');
}
