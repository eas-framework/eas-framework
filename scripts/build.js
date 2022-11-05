import {spinner} from 'zx/experimental';

const REMOVE_FILES = ['package.json'];
const cwd = process.cwd();


// building the typescript files
const tsOutputFiles = path.join(cwd, 'dist');
const nestedDir = path.join(tsOutputFiles, 'src');
let output;
await spinner('Build TypeScript files', async () => {
    await fs.emptyDir(tsOutputFiles);
    output = await $`npm run build:ts`;
    if (output.stderr) {
        return;
    }

    await Promise.all(REMOVE_FILES.map(x => fs.unlink(path.join(tsOutputFiles, x))));
    await fs.copy(nestedDir, tsOutputFiles);
    await fs.remove(nestedDir);
});
output.stderr && console.log(output.stderr);
console.log(chalk.green('✅ TypeScript files built'));


// copying the static files
const copyStatic = {
    from: path.join(cwd, 'src', 'StaticFiles'),
    to: path.join(cwd, 'dist', 'StaticFiles')
};
await spinner('Copy static files', () => fs.copy(copyStatic.from, copyStatic.to));
console.log(chalk.green('✅ Static files copied'));


// minify static '.js' files
const minifyFolderPath = path.join(cwd, 'dist', 'StaticFiles', 'client');
await spinner('Minify static files', (async function minifyFolder(folderPath = minifyFolderPath) {
    const files = await fs.readdir(folderPath, {withFileTypes: true});

    const promises = [];
    for (const file of files) {
        const nestedJoin = path.join(folderPath, file.name);

        if (file.isDirectory()) {
            promises.push(minifyFolder(nestedJoin));
        } else {
            promises.push($`terser "${nestedJoin}" --compress sequences=false --mangle --output "${nestedJoin}"`);
        }
    }

    await Promise.all(promises);
}));
console.log(chalk.green('✅ Static files minified'));