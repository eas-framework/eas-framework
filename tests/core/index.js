import { promises } from 'fs'
import sourceMapSupport from 'source-map-support';
import { fileURLToPath } from 'url';
import path from 'path';
import puppeteer from 'puppeteer'
import fs from 'fs-extra'

sourceMapSupport.install({ hookRequire: true });

//activate server
const { default: Server, Settings, waitProductionBuild, PageTimeLogger, GlobalSitemapBuilder } = await import('../../dist/index.js');
await Server({ SitePath: './tests/core/Website' });

//load pages
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function testPages(name, filter){
    await fs.emptyDir(__dirname + '/screenshots/')
    await fs.writeFile(__dirname + '/screenshots/.gitkeep', '')
        
    const browser = await puppeteer.launch({ headless: true })
    const pathSplit = Object.keys(GlobalSitemapBuilder.links);
    for (const index in pathSplit) {
        const p = pathSplit[index].split('__auto_domain__').pop();
        const page = await browser.newPage()
    
        page.on('dialog', async (dialog) => {
            await dialog.accept("This is a test");
        });
    
        await page.goto(`http://localhost:${Settings.serve.port + p}`, { timeout: 999999999, waitUntil: 'networkidle2' });
        await page.screenshot({ path: `./tests/core/screenshots/${p.replace(/\//g, '_')}.png` })
        page.close()

        console.log(`${name}: ${index} of ${pathSplit.length}`)
    }
    
    const pageTimeLogsFilter = PageTimeLogger.eventLog.filter(filter)
    const sumTime = pageTimeLogsFilter.reduce((last, current) => last + current.time, 0)
    console.log(`${name}: done, average time:${(sumTime/pageTimeLogsFilter.length).toFixed(3)}s \n`)
}

PageTimeLogger.event('compile-time', ({time, file}) => {
    console.log(`compile-time: ${time}s ${file}`)
})

if(!process.argv.includes('only'))
    await testPages("test", x => x)

if(process.argv.includes('with-production')){
    Settings.development = false
    await waitProductionBuild()

    await testPages('production', x => x.debug)
}

//close server if this only a test
if (!process.argv.includes('server'))
    process.exit(0)