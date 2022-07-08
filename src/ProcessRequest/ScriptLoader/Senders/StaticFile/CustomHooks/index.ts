import RequestWarper from "../../../../ProcessURL/RequestWarper";
import { markdownCodeTheme, markdownTheme } from "./Markdown";
import serverPageByType from "./PageScript";
import sitemapFile from "./Sitemap";
import { sendFileByExtension } from "./StaticExtension/index";
import staticFiles from "./StaticFiles";
import { svelteStaticResources, svelteStyle } from "./Svelte";
import unsafeDebugPages from "./UnsafeDebug";

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

