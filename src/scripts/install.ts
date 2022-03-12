import { chdir } from "process";
import { autoCodeTheme, minifyMarkdownTheme } from "../BuildInComponents/Components/markdown";

chdir('../')
await minifyMarkdownTheme();
await autoCodeTheme();