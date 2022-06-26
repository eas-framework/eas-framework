import {createHash} from 'node:crypto';

export default function createId(text: string, max = 10){
    return Buffer.from(text).toString('base64').substring(0, max).replace(/\+/g, '_').replace(/\//g, '_');
}

export function hashString(text: string){
    return createHash('md5').update(text).digest('hex');
}