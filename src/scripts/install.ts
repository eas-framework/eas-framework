import { chdir, cwd } from "process";
const pathThis = cwd().split('/');

function checkBase(index: number) {
    if (pathThis.at(-index) == 'node_modules') {
        chdir('../'.repeat(index))
        return true;
    }
}

if (!checkBase(2))
    checkBase(3);

import('./build-scripts.js');