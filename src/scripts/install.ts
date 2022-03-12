import { chdir, cwd } from "process";
import { autoCodeTheme, minifyMarkdownTheme } from "../BuildInComponents/Components/markdown";

console.log(cwd());
chdir('../')
await minifyMarkdownTheme();
await autoCodeTheme();