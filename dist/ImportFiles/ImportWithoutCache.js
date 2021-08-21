import EasyFs from "../OutputInput/EasyFs.js";
import { v4 as uuid } from 'uuid';
//update the 'file' in the source map
async function updateSourceMaps(fromPath, toPath) {
    let content = await EasyFs.readFile(fromPath);
    content = content.replace(/(\/\/# sourceMappingURL=data:application\/json;charset=utf\-8;base64,)([A-Za-z0-9+/]+={0,2}$)/, (...match) => {
        const map = JSON.parse(Buffer.from(match[2], 'base64').toString());
        map.file = toPath;
        return match[1] + Buffer.from(JSON.stringify(map)).toString('base64');
    });
    await EasyFs.writeFile(toPath, content);
}
//import file without cache
export default async function (path, func) {
    const newPath = path.substring(0, path.length - 3) + '-' + uuid() + '.js';
    await updateSourceMaps(path, newPath);
    const module = await func(newPath);
    //setTimeout(() => EasyFs.unlink(newPath));
    return module;
}
//# sourceMappingURL=ImportWithoutCache.js.map