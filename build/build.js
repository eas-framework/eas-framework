import fsExtra from 'fs-extra';
import path from 'path';
import {build} from 'esbuild-wasm';
import {args} from './tools/StreamCommand.js';
import './buildprojects.js';

const __dirname = path.resolve();

/* copy basic */
const copyFrom = __dirname + '/src/', copyTo = __dirname + '/dist/';
const filesToCopy = ['static', 'SystemData'];
console.log('Copying js files...');

for (const i of filesToCopy) {
    await fsExtra.copy(copyFrom + i, copyTo + i);
}

/* js to ts */

const fromScript = copyFrom + 'scripts/';
await fsExtra.ensureDir(copyTo + 'scripts/');

const {dependencies, name: packageName} = await fsExtra.readJSON(__dirname + '/package.json');

await build({
    external: ['./static/ImportWithoutCache.cjs', ...Object.keys(dependencies)],
    drop: ['debugger'],
    entryPoints: ['src/index.ts', fromScript + 'install.ts'],
    bundle: true,
    platform: 'node',
    outdir: copyTo,
    format: 'esm',
    target: 'node17',
    minify: args.production,
    sourcemap: args.production ? undefined : 'inline',
    define: {
        debug: !args.production ? 'true' : 'false',
        esbuild: 'true',
        packageName: `'${packageName}'`
    }
});

/* minify client */

/**
 * minify all the js files in the folder
 * @param {string} path
 */
async function minifyFolder(from, to, path) {
    const files = await fsExtra.readdir(from + path, {withFileTypes: true});
    await fsExtra.ensureDir(to + path);

    const promises = [];
    for (const i of files) {
        const fullPath = path + i.name;

        if (i.isDirectory()) {
            promises.push(
                minifyFolder(from, to, fullPath + '/')
            );
        } else if (fullPath.endsWith('.js')) {
            promises.push(
                build({
                    entryPoints: [from + fullPath],
                    bundle: false,
                    platform: 'node',
                    outfile: to + fullPath,
                    minify: true
                })
            );
        }
    }

    await Promise.all(promises);
}

await minifyFolder(__dirname + '/src', __dirname + '/dist', '/static/client/');
