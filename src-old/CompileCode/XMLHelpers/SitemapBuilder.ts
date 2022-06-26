import path from 'path';
import { SitemapStream, streamToPromise, SitemapStreamOptions, SitemapItem, XMLToSitemapItemStream } from 'sitemap';
import EasyFs from '../../OutputInput/EasyFs';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import { XMLParser } from 'fast-xml-parser';
import { SessionBuild } from '../Session';
import { Export } from '../../MainBuild/Settings';
import { DevIgnoredWebsiteExtensions } from '../../ImportFiles/StaticFiles';
import { Request, Response } from '../../MainBuild/Types';
import SitemapEventEmitter from './SitemapEventEmitter';

const PROTOCOL = 'https://';
const AUTO_DOMAIN = '__auto_domain__';  
/**
 * It takes a string containing XML, parses it, and returns an array of SitemapItem objects
 * @param {string} fileContent - The content of the sitemap file.
 * @returns An array of SitemapItem objects.
 */
async function parseSitemap(fileContent: string): Promise<SitemapItem[]> {
    const urls = [];
    return new Promise((resolve, reject) => {
        const parser = new XMLToSitemapItemStream();
        parser.on('data', (smi) => urls.push(smi))
            .on('end', () => {
                resolve(urls);
            })
            .on('error', (error) => {
                reject(error);
            });
        parser.write(fileContent);
        parser.end();
    });
}

/* It's a class that builds a sitemap.xml file and saves it to a location */
export class SitemapBuilder {
    links = {};
    xmlns: string[] = [];
    private firstLoad = true;
    private loadPromise: Promise<any>;
    private cacheBuild: Buffer

    get location() {
        return this.savePath;
    }

    set location(value) {
        if (this.savePath == value)
            return;
        this.savePath = value;
        this.promiseLoad();
    }

    get fullPath() {
        return path.join(getTypes.Static[0], this.savePath);
    }

    constructor(private savePath?: string, public options?: SitemapStreamOptions) {
    }

    clear(){
        this.firstLoad = false;
        this.links = {};
        this.xmlns = [];
        this.cacheBuild = null;
    }

    /**
     * It adds a link to the sitemap
     * @param  - url - The URL of the page.
     */
    async link({ url, hide, xmlns, ...rest }: { url: string, hide?: boolean, xmlns?: string | string[] } & SitemapItem) {
        this.cacheBuild = null;
        const formattedURL = new URL(url, PROTOCOL + AUTO_DOMAIN).href;

        if (hide) {
            this.links[formattedURL] = null;
            delete this.links[formattedURL];
            return;
        };

        if (this.firstLoad) {
            this.promiseLoad();
            this.firstLoad = false;
        }

        if (xmlns) {
            if (!Array.isArray(xmlns))
                xmlns = [xmlns];
            this.xmlns.push(...xmlns.map(x => x.trim()))
        }

        this.links[formattedURL] = { ...rest, ...this.links[formattedURL] };
    }

    /**
     * It takes an HTML string and a URL, parses the HTML string into an XML object, and add it to the sitemap.
     * @param {string} html - The HTML string to parse.
     * @param {string} url - The URL of the page being scraped.
     * @returns The link object is being returned.
     */
    fromHTML(html: string, url: string) {
        const parseXML = new XMLParser().parse(html);
        return this.link({ url, ...parseXML });
    }

    /**
     * It use a list of links and returns a sitemap
     * @returns The sitemap.xml file
     */
    async build() {
        if (this.cacheBuild) {
            return this.cacheBuild;
        }

        if (!Object.keys(this.links).length) return; // if empty

        const sitemap = new SitemapStream(this.options);
        const savePromise = streamToPromise(sitemap);

        for (const url in this.links) {
            sitemap.write({ url, ...this.links[url] });
        }
        sitemap.xmlNS.custom ??= [];
        sitemap.xmlNS.custom.push(...this.xmlns);
        sitemap.end();

        this.cacheBuild = await savePromise;
        return this.cacheBuild;
    }

    async buildAndSave() {
        this.saveContent(await this.build());
    }

    /**
     * It saves the sitemap to the file system
     * @param {Buffer} content - The content to save.
     * @returns The promise of the file being written.
     */
    private async saveContent(content: Buffer) {
        if(!content) return;
        await this.loadPromise;

        await EasyFs.makePathReal(this.savePath, getTypes.Static[0]);
        return EasyFs.writeFile(this.fullPath, content);
    }

    private promiseLoad() {
        this.loadPromise = this.load(this.loadPromise);
    }

    /**
     * It reads the file, parses it, and links the items
     * @param lastPromise - The promise that was returned from the previous call to load.
     * @returns a promise.
     */
    private async load(lastPromise: Promise<any>) {
        if (!this.savePath) return;

        await lastPromise;
        const fileContent = await EasyFs.readFile(this.fullPath, 'utf8', true);
        if (!fileContent) return;

        const items = await parseSitemap(fileContent)
        for (const item of items) {
            this.link(item);
        }
    }

    /**
     * It creates a new instance of the SitemapBuilder class and copies all the properties from the current
     * instance to the new instance.
     * @returns A new instance of SitemapBuilder with the same properties as the original.
     */
    clone() {
        const myClone = new SitemapBuilder(this.savePath, this.options);
        myClone.firstLoad = this.firstLoad;
        myClone.links = { ...this.links };
        myClone.xmlns = [...this.xmlns];
        myClone.cacheBuild = this.cacheBuild;
        return myClone;
    }
}

export const GlobalSitemapBuilder = new SitemapBuilder('sitemap.xml');

/**
 * It takes a file path, and an array of types, and if the file path is a page, and not ignored, it
 * adds it to the sitemap
 * @param {SessionBuild} sessionInfo - SessionBuild - this is the session information that is passed to
 * the build function.
 * @param {string} filePath - The path to the file being built.
 * @param {string[]} arrayType - The types of the file being built.
 * @returns A promise
 */
export async function addSiteMap(sessionInfo: SessionBuild, filePath: string, arrayType: string[]) {
    if (!Export.routing.sitemap) return

    const buildURL = await urlBuilder(filePath, arrayType)
    if (!buildURL) return; // if not a page or if it's ignored

    GlobalSitemapBuilder.fromHTML(sessionInfo.sitemapBuild.eq, buildURL)

    if (sessionInfo.debug) {
        GlobalSitemapBuilder.buildAndSave()
    }
}

const defaultSiteMapSettings = {
    rules: true,
    urlStop: false,
    errorPages: false,
    validPath: true
};

function getSiteMapSettings() {
    const sitemap = Export.routing.sitemap === true ? {} : Export.routing.sitemap;
    Object.assign(sitemap, /* Add default setting for the sitemap. */
        { defaultSiteMapSettings, ...sitemap }
    );
    return sitemap;
}

/**
 * It takes a file path and an array of file types, and returns a URL if the file is a page, and if
 * it's follow the sitemap settings.
 * @param {string} filePath - The path of the file.
 * @param {string[]} arrayType - The type of the file.
 * @returns The file path.
 */
async function urlBuilder(filePath: string, arrayType: string[]) {
    if (arrayType[2] != getTypes.Static[2] || !filePath.endsWith('.' + BasicSettings.pageTypes.page))
        return;

    // remove .page extension
    filePath = '/' + filePath.substring(0, filePath.length - BasicSettings.pageTypes.page.length - 1);

    const secondExtension = path.extname(filePath).substring(1); // skip '.serv' and '.api'
    if (BasicSettings.partExtensions.includes(secondExtension))
        return;

    const settings = <typeof defaultSiteMapSettings>getSiteMapSettings();

    if (settings.urlStop) {
        for (const path in Export.routing.urlStop) {
            if (filePath.startsWith(path)) {
                filePath = path;
            }
            break;
        }
    }

    if (settings.rules) {
        for (const path in Export.routing.rules) {
            if (filePath.startsWith(path)) {
                filePath = await Export.routing.rules[path](filePath);
                break;
            }
        }
    }

    if (DevIgnoredWebsiteExtensions.includes(secondExtension) || Export.routing.ignorePaths.find(start => filePath.startsWith(start)))
        return;

    if (settings.validPath) {
        for (const func of Export.routing.validPath) {
            if (!await func(filePath))
                return;
        }
    }

    if (!settings.errorPages) {
        for (const error in Export.routing.errorPages) {
            const path = '/' + Export.routing.errorPages[error].path;

            if (filePath.startsWith(path)) {
                return;
            }
        }
    }

    return filePath;
}
export const sitemapEventEmitter = new SitemapEventEmitter();


/**
 * > This function replaces the string `__auto_domain__` with the domain name of the current request
 * @param {string} sitemapText - The text of the sitemap.xml file.
 * @param {Request} req - The request object from the HTTP request.
 * @returns The sitemapText is being returned.
 */
function replaceSitemapGlobals(sitemapText: string, req: Request) {
    sitemapText = sitemapText.replaceAll(AUTO_DOMAIN, req.headers.host)
    return sitemapText;
}

/**
 * It clones the global sitemap builder, calls all the listeners, and then returns the result sitemap
 * @returns Sitemap string
 */
async function createSiteMapWithoutCache() {
    const listeners = sitemapEventEmitter.listeners('request');
    const stringSiteMap = async (builder: SitemapBuilder) => (await builder.build())?.toString();

    if (listeners.length == 0) {
        return stringSiteMap(GlobalSitemapBuilder);
    }

    const siteMapBuilder = GlobalSitemapBuilder.clone();

    await sitemapEventEmitter.emit('request', siteMapBuilder);
    await sitemapEventEmitter.emit('response', siteMapBuilder);

    return stringSiteMap(siteMapBuilder);
}


export let cacheSitemap = {internal: 0, lastCheck: 0, data: null};
/**
 * > If the cache is older than the cache interval, then create a new sitemap and update the cache
 * @param {Request} req - Request - The request object from the client.
 * @returns A sitemap
 */
export async function onSitemapRequest(req: Request): Promise<string | null> {
    if(Date.now() - cacheSitemap.lastCheck > cacheSitemap.internal){
        cacheSitemap.data = await createSiteMapWithoutCache();
        cacheSitemap.lastCheck = Date.now();
    }
    return cacheSitemap.data && replaceSitemapGlobals(cacheSitemap.data, req);
}