import {chdir} from 'process';
import path from 'path';
import {fileURLToPath} from 'url'
import sourceMapSupport from 'source-map-support'; 
sourceMapSupport.install({hookRequire: true});

// chdir(path.dirname(fileURLToPath(import.meta.url)));

const {default: Server} = await import('../../dist/index.js');

Server({SitePath: './tests/core/Website'});