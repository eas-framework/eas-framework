const me = Math.random() + Request.url;


console.log(me);


import fs from 'fs/promises'
async function readFolder(dir, ext){
    const all = await fs.readdir(dir, {withFileTypes: true});

    const stringMap = [];
    for(const file of all){
        if(file.isDirectory())
            stringMap.push(...(await readFolder(dir + file.name + '/', ext)).map(x => file.name + '/' + x));
        else if(file.name.endsWith(ext))
            stringMap.push(file.name.substring(0, file.name.length - ext.length));
    }

    return stringMap;
}
const data = await readFolder("/Users/idoio/Documents/beyond-easy/node_modules/highlight.js/styles/", ".css");

let buildText = '';

for(const i of data){
    buildText += `'${i}' | `;
}

buildText = buildText.substring(0, buildText.length-3);

write(buildText);