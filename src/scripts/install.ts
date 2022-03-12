import { chdir, cwd } from "process";

if(cwd().split('/').at(-2) == 'node_modules')
    chdir('../../')

import('./build-scripts.js');