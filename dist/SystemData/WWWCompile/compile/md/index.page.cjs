module.exports = (_require, _include, _transfer, private_var, handelConnector)=>{
    return async function(page) {
        const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/md/index.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/md";
        const require = (p)=>_require(__filename, __dirname, page, p)
        ;
        const include = (p, withObject)=>_include(__filename, __dirname, page, p, withObject)
        ;
        var module = {
            exports: {}
        }, exports = module.exports, { sendFile , writeSafe , write , echo , setResponse , out_run_script , run_script_name , Response , Request , Post , Query , Session , Files , Cookies , PageVar , GlobalVar  } = page, run_script_code = run_script_name;
        const transfer = (p, preserveForm, withObject)=>(out_run_script = {
                text: ''
            }, _transfer(p, preserveForm, withObject, __filename, __dirname, page))
        ;
        {
            const declareVariable = 9;
            out_run_script.text += `<!DOCTYPE html> <html lang="en" me=more> <head> <meta charset="UTF-8"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title> EAS Tests | Compile | Import Page </title> <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/> <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vinorodrigues/bootstrap-dark@0.6.1/dist/bootstrap-dark.min.css"/> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script> <link rel="stylesheet" href="/serv/md/code-theme/atom-one.css"/><link rel="stylesheet" href="/serv/md/theme/auto.css"/><script src="/serv/md.js"></script></head> <body> <nav class="navbar navbar-expand-lg navbar-light bg-light"> <div class="container-fluid"> <a class="navbar-brand" href="/"> EAS - Tests </a> <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarSupportedContent"> <ul class="navbar-nav me-auto mb-2 mb-lg-0"> `;
            {
                out_run_script.text += ` <li class="nav-item"> <a class="nav-link" href="/"> Home </a> </li> `;
            }
            {
                out_run_script.text += ` <li class="nav-item"> <a class="nav-link" href="/tests"> Tests </a> </li> `;
            }
            {
                out_run_script.text += ` <li class="nav-item"> <a class="nav-link" href="/static"> Generated Static </a> </li> `;
            }
            {
                out_run_script.text += ` <li class="nav-item"> <a class="nav-link" href="/compile"> Generated Compile </a> </li> `;
            }
            out_run_script.text += ` </ul> <form class="d-flex"> <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/> <button class="btn btn-outline-success" type="submit"> Search </button> </form> </div> </div> </nav> <main class="flex-shrink-0 pt-5"> <div class="container mt-5"> <nav aria-label="breadcrumb"> <ol class="breadcrumb"> <li class="breadcrumb-item"> <a href="/"> Home </a> </li> <li class="breadcrumb-item"> <a href="/compile/index"> Compile </a> </li> <li class="breadcrumb-item active" aria-current="page"> Import Page </li> </ol> </nav> <hr/> <div class="markdown-body"><h1 id="code" tabindex="-1"><a class="header-anchor" href="#code">Code</a></h1>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-keyword">var</span> i = <span class="hljs-number">9</span>; <span class="hljs-comment">//very long comment</span>
</code></pre>

            </div></div> <div class="markdown-body"><h1 id="code" tabindex="-1"><a class="header-anchor" href="#code">Code</a></h1>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">Copy</a>
                </div>
                <pre class="hljs"><code><span class="hljs-keyword">var</span> i = <span class="hljs-number">9</span>; <span class="hljs-comment">//very long comment</span>
</code></pre>

            </div></div> `;
            {
                out_run_script.text += ` <div class="markdown-body"><p>Create a new project and install EAS-Framework</p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code>npm install @eas-framework/server
</code></pre>

            </div><p>Make your project a module project, add this to your <code>package.json</code></p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;module&quot;</span>
</code></pre>

            </div><p>Create <code>index.js</code> file in your root folder</p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-keyword">import</span> server <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@eas-framework/server&#x27;</span>;

<span class="hljs-title function_">server</span>(); <span class="hljs-comment">//start the server (all the settings via Settings.js file)</span>
</code></pre>

            </div><p>Create ‘www’ folder in your root folder that will contain all the SSR and static content of your website</p>
<h3 id="vs-code-debug-support" tabindex="-1"><a class="header-anchor" href="#vs-code-debug-support">VS Code debug support</a></h3>
<p>Create <code>.vscode/launch.json</code></p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;version&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;0.2.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;configurations&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
        <span class="hljs-punctuation">{</span>
            <span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;pwa-node&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;request&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;launch&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Launch Program Node&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;skipFiles&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
                <span class="hljs-string">&quot;&lt;node_internals&gt;/**&quot;</span>
            <span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;program&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;\u0024{workspaceFolder}\\\\index.js&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;args&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-string">&quot;allowSourceDebug&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-string">&quot;rebuild&quot;</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// allow source debug in browser and rebuild even on production mode</span>
            <span class="hljs-attr">&quot;outFiles&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
                <span class="hljs-string">&quot;\u0024{workspaceFolder}/node_modules/eas-framework/dist/*&quot;</span><span class="hljs-punctuation">,</span>
                <span class="hljs-string">&quot;\u0024{workspaceFolder}/**/*.js&quot;</span>
            <span class="hljs-punctuation">]</span>
        <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span>
<span class="hljs-punctuation">}</span>
</code></pre>

            </div></div> `;
            }
            out_run_script.text += ` <div class="markdown-body"><p>Create a new project and install EAS-Framework</p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code>npm install @@eas-framework/server
</code></pre>

            </div><p>Make your project a module project, add this to your <code>package.json</code></p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;module&quot;</span>
</code></pre>

            </div><p>Create <code>index.js</code> file in your root folder</p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-keyword">import</span> server <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@@eas-framework/server&#x27;</span>;

<span class="hljs-title function_">server</span>(); <span class="hljs-comment">//start the server (all the settings via Settings.js file)</span>
</code></pre>

            </div><p>Create ‘www’ folder in your root folder that will contain all the SSR and static content of your website</p>
<h3 id="vs-code-debug-support" tabindex="-1"><a class="header-anchor" href="#vs-code-debug-support">VS Code debug support</a></h3>
<p>Create <code>.vscode/launch.json</code></p>
<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">📋</a>
                </div>
                <pre class="hljs"><code><span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;version&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;0.2.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;configurations&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
        <span class="hljs-punctuation">{</span>
            <span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;pwa-node&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;request&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;launch&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Launch Program Node&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;skipFiles&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
                <span class="hljs-string">&quot;&lt;node_internals&gt;/**&quot;</span>
            <span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;program&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;\u0024{workspaceFolder}\\\\index.js&quot;</span><span class="hljs-punctuation">,</span>
            <span class="hljs-attr">&quot;args&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-string">&quot;allowSourceDebug&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-string">&quot;rebuild&quot;</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// allow source debug in browser and rebuild even on production mode</span>
            <span class="hljs-attr">&quot;outFiles&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
                <span class="hljs-string">&quot;\u0024{workspaceFolder}/node_modules/eas-framework/dist/*&quot;</span><span class="hljs-punctuation">,</span>
                <span class="hljs-string">&quot;\u0024{workspaceFolder}/**/*.js&quot;</span>
            <span class="hljs-punctuation">]</span>
        <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span>
<span class="hljs-punctuation">}</span></code></pre>

            </div></div> </div> </main> </body> </html>`;
        }
    };
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoiaW5kZXgucGFnZS5janMifQ==