import {spawn} from 'child_process';
import {promises} from 'fs';
import path from 'path';

console.log('building...');

const stream = spawn('wasm-pack', ['build', '--release']);

stream.stdout.pipe(process.stdout);

stream.stderr.pipe(process.stdout);

stream.on('exit', copyFiles);

async function copyFiles(code){
    if (code){
        return;
    }

    const __dirname = path.resolve();
   
    const toPath = __dirname + '/../../src/static/wasm/component/';
    const fromPath = __dirname + '/pkg/';

    promises.copyFile(fromPath + 'rust_assembly_bg.wasm', toPath + 'build.wasm');


    let content = await promises.readFile(fromPath + 'rust_assembly_bg.js', 'utf8');

    content = "import {promises} from 'fs';\nimport { fileURLToPath } from 'url';\n" +content;
   
    content = content.replace("import * as wasm from './rust_assembly_bg.wasm';", 
`const loadPath = typeof esbuild !== 'undefined' ? '/../static/wasm/component/': '/../';
const wasmModule = new WebAssembly.Module(await promises.readFile(fileURLToPath(import.meta.url + loadPath + 'build.wasm')));
const wasmInstance = new WebAssembly.Instance(wasmModule, {});
const wasm = wasmInstance.exports;`);

    promises.writeFile(toPath + 'index.js', content);

    

    console.log('Done!');
}
