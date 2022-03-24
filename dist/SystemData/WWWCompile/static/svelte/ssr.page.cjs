require('source-map-support').install();module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
  return async function(page) {
    const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/static/svelte/ssr.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/static/svelte";
    const require2 = (p) => _require(__filename, __dirname, page, p);
    const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
    var module2 = { exports: {} }, exports2 = module2.exports, { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar } = page, run_script_code = run_script_name;
    const transfer = (p, preserveForm, withObject) => (out_run_script = { text: "" }, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
    {
      try {
        run_script_code = `run_script_name=\`WWW/static/svelte/ssr.page -> WWW/static/server.mode\`;`;
        //!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
        run_script_name = `WWW/static/svelte/ssr.page -> WWW/static/server.mode`;
        out_run_script.text += `<!DOCTYPE html>
<html lang="en" me=more>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EAS Tests |
        Static | Svelte SSR
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vinorodrigues/bootstrap-dark@0.6.1/dist/bootstrap-dark.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"><\/script>
    
<link rel="stylesheet" href="/static/svelte/from1.svelte.css"/><script src="/1dXL3.pub.mjs" type="module"><\/script></head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">EAS - Tests</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    `;
        run_script_code = `run_script_name=\`WWW/static/svelte/ssr.page\`;`;
        //!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
        run_script_name = `WWW/static/svelte/ssr.page`;
        out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/">Home</a>
</li>
                    `;
        run_script_code = `run_script_name=\`WWW/static/svelte/ssr.page\`;`;
        //!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
        run_script_name = `WWW/static/svelte/ssr.page`;
        out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/tests">Tests</a>
</li>
                    `;
        run_script_code = `run_script_name=\`WWW/static/svelte/ssr.page\`;`;
        //!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
        run_script_name = `WWW/static/svelte/ssr.page`;
        out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/static">Generated Static</a>
</li>
                    `;
        run_script_code = `run_script_name=\`WWW/static/svelte/ssr.page\`;`;
        //!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
        run_script_name = `WWW/static/svelte/ssr.page`;
        out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/compile">Generated Compile</a>
</li>
                </ul>
                <form class="d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
    
    <main class="flex-shrink-0 pt-5">
        <div class="container mt-5">
            
<div id="c3RhdGljL3"><main><div class="counter svelte-11tu8i0"><p class="svelte-11tu8i0">Counte: 5</p>
        <button class="svelte-11tu8i0">+</button></div>
    <div class="number-color svelte-1lqy072"><p style="font-size:16px">This number: 0.532</p>
</div>
    {
  &quot;max&quot;: 100,
  &quot;current&quot;: 5
}
</main></div>
        </div>
    </main>
</body>

</html>`;
      } catch (e) {
        run_script_name += " -> <line>" + e.stack.split(/\n( )*at /)[2];
        out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, "<br/>") + "</p><p>Error message: " + e.message + "</p></p>";
        console.error("Error path: " + run_script_name.replace(/<line>/gi, "\n"));
        console.error("Error message: " + e.message);
        console.error("Error runing this code: '" + run_script_code + "'");
        console.error("Error stack: " + e.stack);
      }
    }
  };
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJzc3IucGFnZS5janMifQ==