import { SessionBuild } from "../../../src/CompilePage/Session.js";
import PPath from "../../../src/Settings/PPath.js";
import StringTracker from "../../../src/SourceTracker/StringTracker/StringTracker.js";
export declare function getMockSession(): SessionBuild;
export declare function getMockModel(): PPath;
export declare const compileRuntimeScript: StringTracker;
export declare const compileRuntimeScriptExpectedResult = "\n\nwhat? a/b\n\n    <p>0</p>\n\n    <p>1</p>\n\n    <p>2</p>\n\n    <p>3</p>\n\n    <p>4</p>\n\n    <p>5</p>\n\n    <p>6</p>\n\n    <p>7</p>\n\n    <p>8</p>\n\n    <p>9</p>\n\n\nprint safe: &#123;&#10;&#32;&#32;&#34;&#97;&#34;&#58;&#32;&#50;&#10;&#125;";
export declare const compileRuntimeScriptExpectedResultPRODUCTION = "\n\nwhat? a/b\n\n    <p>0</p>\n\n    <p>1</p>\n\n    <p>2</p>\n\n    <p>3</p>\n\n    <p>4</p>\n\n    <p>5</p>\n\n    <p>6</p>\n\n    <p>7</p>\n\n    <p>8</p>\n\n    <p>9</p>\n\n\nprint safe: &#123;&#34;&#97;&#34;&#58;&#50;&#125;";
