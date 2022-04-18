import fetch from 'node-fetch'
import {promises} from 'fs'
import sourceMapSupport from 'source-map-support'; 
import { fileURLToPath } from 'url';
import path from 'path';
sourceMapSupport.install({hookRequire: true});

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {default: Server, Settings} = await import('../../dist/index.js');

await Server({SitePath: './tests/core/Website'});


if(process.argv.includes('coverage')){
    const paths = await promises.readFile(path.join(__dirname, 'Website', 'WWW', 'sitemap.txt'), 'utf8')
    
    
    for(const p of paths.split('\n')){
        const timeout = setTimeout(() => console.log('time-out: ', p), 1000)
        await fetch(`http://localhost:${Settings.serve.port + p}`)
        clearTimeout(timeout)
    }

    console.log('all-fetched')
}

if(!process.argv.includes('server'))
    process.exit(0)