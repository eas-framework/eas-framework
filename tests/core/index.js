import {chdir} from 'process';
import path from 'path';

chdir(path.dirname(new URL(import.meta.url).pathname).substring(1));

const {Server} = await import('../../dist/index.js');

Server();