import {promises} from 'fs';
import { minify } from "terser";
import path from 'path';

const minifyFolderPath = path.resolve() + '/src/ImportFiles/client/';

/**
 * minify all the js files in the folder
 * @param {string} path 
 */
async function minifyFolder(path){
    const files = await promises.readdir(path, {withFileTypes: true});

    for(const i of files) {
        const fullPath = path + i.name;
        
        if(i.isDirectory()){
            minifyFolder(fullPath + '/');
        } else if(fullPath.endsWith('.js')){
            let content = await promises.readFile(fullPath, 'utf8');

            content = (await minify(content, { module: false })).code;

            await promises.writeFile(fullPath, content);
        }
    }
}

minifyFolder(minifyFolderPath);