import {promises} from 'fs';
import { minify } from "terser";
import path from 'path';

const minifyFolderPath = '/ImportFiles/client/', from = path.resolve() + '/src', to = path.resolve() + '/dist';

/**
 * minify all the js files in the folder
 * @param {string} path 
 */
async function minifyFolder(from, to, path){
    const files = await promises.readdir(from + path, {withFileTypes: true});
    await promises.mkdir(to + path);

    for(const i of files) {
        const fullPath = path + i.name;
        
        if(i.isDirectory()){
            minifyFolder(from, to, fullPath + '/');
        } else if(fullPath.endsWith('.js')){
            let content = await promises.readFile(from + fullPath, 'utf8');

            content = (await minify(content, { module: false })).code;

            await promises.writeFile(to + fullPath, content);
        }
    }
}

minifyFolder(from, to, minifyFolderPath);