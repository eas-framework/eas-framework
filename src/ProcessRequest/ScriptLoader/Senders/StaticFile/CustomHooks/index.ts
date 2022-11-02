import RequestWrapper from "../../../../ProcessURL/RequestWrapper.js";
import {markdownCodeTheme, markdownTheme} from "./Markdown.js";
import serverPageByType from "./PageScript.js";
import sitemapFile from "./Sitemap.js";
import {sendFileByExtension} from "./StaticExtension/index.js";
import staticFiles from "./StaticFiles.js";
import {svelteStaticResources, svelteStyle} from "./Svelte.js";
import unsafeDebugPages from "./UnsafeDebug.js";

export async function sendStaticResource(wrapper: RequestWrapper): Promise<boolean> {
    return await markdownCodeTheme(wrapper) ||
        await markdownTheme(wrapper) ||
        await serverPageByType(wrapper) ||
        await sitemapFile(wrapper) ||
        await staticFiles(wrapper) ||
        await svelteStyle(wrapper) ||
        await svelteStaticResources(wrapper) ||
        await unsafeDebugPages(wrapper) ||
        await sendFileByExtension(wrapper);
}

