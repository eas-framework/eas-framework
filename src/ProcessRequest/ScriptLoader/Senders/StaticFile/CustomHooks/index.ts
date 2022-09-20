import RequestWarper from "../../../../ProcessURL/RequestWarper.js";
import { markdownCodeTheme, markdownTheme } from "./Markdown.js";
import serverPageByType from "./PageScript.js";
import sitemapFile from "./Sitemap.js";
import { sendFileByExtension } from "./StaticExtension/index.js";
import staticFiles from "./StaticFiles.js";
import { svelteStaticResources, svelteStyle } from "./Svelte.js";
import unsafeDebugPages from "./UnsafeDebug.js";

export async function sendStaticResource(warper: RequestWarper) {
    return await markdownCodeTheme(warper) ||
    await markdownTheme(warper) ||
    await serverPageByType(warper) ||
    await sitemapFile(warper) ||
    await staticFiles(warper) ||
    await svelteStyle(warper) ||
    await svelteStaticResources(warper) ||
    await unsafeDebugPages(warper) ||
    await sendFileByExtension(warper)
}

