import path from "node:path";
import { workingDirectory } from "../../../../../Settings/ProjectConsts";
import RequestWarper from "../../../../ProcessURL/RequestWarper";
import { NODE_MODULES, sendStaticFile } from "./utils";

const MARKDOWN_CODE_THEME_NODE_MODULES = path.join(NODE_MODULES, 'highlight.js', 'styles');
const GITHUB_THEME_NODE_MODULES = path.join(NODE_MODULES, 'github-markdown-css', 'github-markdown')

const CODE_THEME = 'serv/md/code-theme/';
const GITHUB_THEME = 'serv/md/theme/'
const AUTO_GITHUB_THEME = 'auto';

export async function markdownCodeTheme(warper: RequestWarper) {
    if (!warper.path.nested.startsWith(CODE_THEME)) {
        return
    }

    const fullPath = path.join(MARKDOWN_CODE_THEME_NODE_MODULES, warper.path.nested.substring(CODE_THEME.length))
    return sendStaticFile(fullPath, 'default', warper)
}

export async function markdownTheme(warper: RequestWarper) {
    if (!warper.path.nested.startsWith(GITHUB_THEME)) {
        return
    }

    let fileName = warper.path.nested.substring(GITHUB_THEME.length);

    if (fileName.startsWith(AUTO_GITHUB_THEME + '.')) {
        fileName = fileName.substring(AUTO_GITHUB_THEME.length)
    } else {
        fileName = '-' + fileName;
    }

    const fullPath = path.join(GITHUB_THEME_NODE_MODULES, fileName.replace(/\.css$/, '.min.css'))
    return sendStaticFile(fullPath, 'default', warper)
}