import { SessionBuild } from "../../../src/CompilePage/Session.js";
import PPath from "../../../src/Settings/PPath.js";
import StringTracker from "../../../src/SourceTracker/StringTracker/StringTracker.js";

export const MOCK_SESSION = new SessionBuild(new PPath('Static/index.page'))
export const SOURCE_FILE = new PPath('Models/website.model')

export const compileRuntimeScript = new StringTracker(`
#code {
    import path from 'node:path'
}
what? #(path.join('a', 'b'))
#for(let i = 0; i < 10; i++){
    <p>#(i)</p>
}

print safe: #:({a: 2})
`)

export const compileRuntimeScriptExpectedResult = `

what? a/b

    <p>0</p>

    <p>1</p>

    <p>2</p>

    <p>3</p>

    <p>4</p>

    <p>5</p>

    <p>6</p>

    <p>7</p>

    <p>8</p>

    <p>9</p>


print safe: &#123;&#10;&#32;&#32;&#34;&#97;&#34;&#58;&#32;&#50;&#10;&#125;`

// minify production result
export const compileRuntimeScriptExpectedResultPRODUCTION = `

what? a/b

    <p>0</p>

    <p>1</p>

    <p>2</p>

    <p>3</p>

    <p>4</p>

    <p>5</p>

    <p>6</p>

    <p>7</p>

    <p>8</p>

    <p>9</p>


print safe: &#123;&#34;&#97;&#34;&#58;&#50;&#125;`