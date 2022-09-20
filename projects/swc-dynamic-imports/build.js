import {spawn} from 'child_process';
import {promises} from 'fs';
import path from 'path';
const RELEASE = process.argv.includes('release');

console.log('building...');


const stream = spawn('cargo', RELEASE ? ['build-wasm32',  '--release']: ['build-wasm32'], {stdio: 'inherit'});

stream.on('exit', copyFiles);

async function copyFiles(code){
    if (code){
        return;
    }

    const __dirname = path.resolve();
   
    const toPath = __dirname + '/../../src/static/wasm/easSyntax/';
    const fromPath = __dirname + '/target/wasm32-unknown-unknown/release/';

    promises.copyFile(fromPath + 'swc_dynamic_imports.wasm', toPath + 'build.wasm');

    console.log('Done!');
}
