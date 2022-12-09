import path from 'node:path';
export function moo(x) {
    return path.join(x, x.repeat(10));
}
export default function kool() {
    return moo('why');
}
