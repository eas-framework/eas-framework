//adding .js extension to imports in TypeScript files
import {promises} from 'fs';
import path from 'path';

const __dirname = path.resolve() + '/dist/';

/**
 * Searching all the files in dictionary
 * @param {string} path
 */

async function searchDir(path){
    const filesAndDirect = await promises.readdir(path, {withFileTypes: true});

    for(const i of filesAndDirect){
        const newPath = path + i.name;

        if(i.isDirectory()){
            searchDir(newPath + '/');
        } else if(i.name.endsWith('.js')) {
            fixImports(newPath);
        }
    }
}

/**
 * Fixing imports in file
 * @param {string} filepath
 */
async function fixImports(filepath){
    let content = await promises.readFile(filepath, 'utf8');

    const mathRegex = /(import|export)[ ]+[\*]{0,1}[\p{L}0-9_,\{\} ]+[ ]+(from[ ]+)?(['|`|"])([A-Za-z0-9_\-@\$\./\\]+)\3/gu;

    content = content.replace(mathRegex, (...match) => {
        const filePath = match[4];

        if ((filePath[0] == '.' || filePath[0] == '/') && !path.extname(filePath)) {
            let newImport = match[0].substring(0, match[0].indexOf(match[3])); // the start of the import

            newImport += match[3] + filePath + '.js' + match[3];

            return newImport;
        }

        return match[0];
    });

   await promises.writeFile(filepath, content);
}

console.log("Scanning files...");

searchDir(__dirname);

console.log("Imports fixed!");