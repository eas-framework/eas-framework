import fetch from 'node-fetch'
import { promises } from 'fs'
import sourceMapSupport from 'source-map-support';
import { fileURLToPath } from 'url';
import path from 'path';
import puppeteer from 'puppeteer'

sourceMapSupport.install({ hookRequire: true });

//activate server
const { default: Server, Settings } = await import('../../dist/index.js');
await Server({ SitePath: './tests/core/Website' });

//load pages
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function testPages(name = "test"){
    const paths = await promises.readFile(path.join(__dirname, 'Website', 'WWW', 'sitemap.txt'), 'utf8')

    const browser = await puppeteer.launch({ headless: true })
    const pathSplit = paths.split('\n');
    for (const index in pathSplit) {
        const p = pathSplit[index];
        const page = await browser.newPage()
    
        page.on('dialog', async (dialog) => {
            await dialog.accept("This is a test");
        });
    
        await page.goto(`http://localhost:${Settings.serve.port + p}`, { timeout: 5000, waitUntil: 'networkidle2' });
        await page.screenshot({ path: `./tests/core/screenshots/${p.replace(/\//g, '_')}.png` })
        page.close()

        console.log(`${name}: ${index} of ${pathSplit.length}`)
    }
    
    console.log(`${name}: done\n`)
}

if(!process.argv.includes('only'))
    await testPages()

if(process.argv.includes('with-production')){
    Settings.development = false
    await testPages('production')
}

//close server if this only a test
if (!process.argv.includes('server'))
    process.exit(0)