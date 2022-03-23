import fsExtra from 'fs-extra';
import path from 'path';
import {build} from 'esbuild-wasm'

const __dirname = path.resolve();

/* copy basic */
const copyFrom = __dirname + '/src/', copyTo = __dirname + '/dist/';
const filesToCopy = ['static', 'SystemData'];
console.log('Copying js files...');

for(const i of filesToCopy){
    await fsExtra.copy(copyFrom + i, copyTo + i);
}

/* js to ts */

const fromScript = copyFrom + 'scripts/';
await fsExtra.ensureDir(copyTo+'scripts/');

const production = process.argv.includes('production');
build({
    external: ['./static/ImportWithoutCache.cjs', ...Object.keys((await fsExtra.readJSON(__dirname + '/package.json')).dependencies)],
    drop: ['debugger'],
    entryPoints: ['src/index.ts', fromScript + 'install.ts'],
    bundle: true,
    platform: 'node',
    outdir: copyTo,
    format: 'esm',
    target: 'node17',
    minify: production,
    sourcemap: production ? undefined: 'inline',
    define: {
        esbuild: true
    }
});

/* minify client */

/**
 * minify all the js files in the folder
 * @param {string} path 
 */
async function minifyFolder(from, to, path) {
    const files = await fsExtra.readdir(from + path, { withFileTypes: true });
    await fsExtra.ensureDir(to + path);

    for (const i of files) {
        const fullPath = path + i.name;

        if (i.isDirectory()) {
            minifyFolder(from, to, fullPath + '/');
        } else if (fullPath.endsWith('.js')) {
            build({
                entryPoints: [from + fullPath],
                bundle: false,
                platform: 'node',
                outfile: to + fullPath,
                minify: true
            });
        }
    }
}

minifyFolder(__dirname + '/src', __dirname + '/dist', '/static/client/');
