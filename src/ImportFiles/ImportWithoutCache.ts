import {promises} from 'fs';
import {v4 as uuid} from 'uuid';

export default async function(path: string, func: (path: string) => any) {
    const newPath = path + uuid() + '.js';
    await promises.copyFile(path, newPath);
    let module = await func(newPath);
    await promises.unlink(newPath);
    return module;
}