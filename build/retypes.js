import path from 'path';
import fsExtra from 'fs-extra';
const {readFile, readJSON, writeFile} = fsExtra;

const __dirname = path.resolve(), dist =  __dirname + '/dist/';

const typesFile = 'index.d.ts'
const {name} = await readJSON(__dirname + '/package.json');
let types = await readFile(dist + typesFile, 'utf8');

const cache = [];
types = types.replace(/(declare module ")(.*)(")/gi, (_, g1, path, g2) => {
    if(path == "index") return g1 + name + g2;

    cache.push(path);
    return g1 + name + '/' + path + g2;
})

types = types.replace(/(")(.*?)(")/gi, (all, g1, path, g2) => {
    if(!cache.includes(path)) return all;
    
    return g1 + name + '/' + path + g2;
});

writeFile(dist + typesFile, types);
