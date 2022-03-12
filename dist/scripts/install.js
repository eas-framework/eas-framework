import { chdir } from "process";
import { autoCodeTheme, minifyMarkdownTheme } from "../BuildInComponents/Components/markdown.js";
chdir('../');
await minifyMarkdownTheme();
await autoCodeTheme();
//# sourceMappingURL=install.js.map