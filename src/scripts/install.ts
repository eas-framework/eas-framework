import { chdir, cwd } from "process";
import { autoCodeTheme, minifyMarkdownTheme } from "../BuildInComponents/Components/markdown";

if(cwd().split('/').at(-2) == 'node_modules')
    chdir('../../')
await minifyMarkdownTheme();
await autoCodeTheme();