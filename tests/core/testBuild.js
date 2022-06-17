import { fileURLToPath } from 'url';
import path from 'path';
import puppeteer from 'puppeteer'
import fs from 'fs-extra'

const MAX_PAGE_MULTI_TEST = 5;

//load pages
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshots = __dirname + '/screenshots/';

async function clearLast() {
    await fs.emptyDir(screenshots)
    await fs.writeFile(screenshots + '.gitkeep', '')
}

function* parseSourceMap(builder) {
    const pathSplit = Object.keys(builder.links);
    for (const index in pathSplit) {
        yield pathSplit[index].split('__auto_domain__').pop();
    }
}

/**
 * Test a page
 * @param {import('puppeteer').Browser} browser 
 */
async function openPage(browser, smallURL, fullURL) {
    const page = await browser.newPage()

    page.on('dialog', async (dialog) => {
        await dialog.accept("This is a test");
    });

    await page.goto(fullURL, { timeout: 999999999, waitUntil: 'load' });

    const saveScreenshot = screenshots + smallURL.replace(/\//g, '_') + '.png'
    await page.screenshot({ path: saveScreenshot })
    page.waitForTimeout(500) // wait .5s for all script to load

    page.close()
}

function calcAavTime(logger, filter){
    const pages = logger.eventLog.filter(filter)
    const sumTime = pages.reduce((last, current) => last + current.time, 0)
    return (sumTime / pages.length).toFixed(3)
}

function pageURLTemplate(page, port){
    return `http://localhost:${port}/${page}`
}

export default async function runTest(name, sitemap, logger, filter, port) {
    await clearLast()

    const browser = await puppeteer.launch({ headless: true })
    const pages = [...parseSourceMap(sitemap)]

    let countDown = 0

    /**
     * @type {Promise[]}
     */
    const wait = []

    for (const pageURLIndex in pages) {
        if(pageURLIndex%MAX_PAGE_MULTI_TEST == 0){
            await Promise.all(wait)
        }

        const smallPageURL = pages[pageURLIndex]
        const fullPageURL = pageURLTemplate(smallPageURL, port);
        wait.push(
            openPage(browser, smallPageURL, fullPageURL).then(() => {
                console.log(`${name}: ${++countDown} of ${pages.length}`)
            })
        )

    }

    await Promise.all(wait)

    console.log(`${name}: done, average time:${calcAavTime(logger, filter)}s \n`)
}