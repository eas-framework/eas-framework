require('source-map-support').install(); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/load.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {try {

run_script_code=`run_script_name=\`WWW/load.page\`;`;
//!WWW/load.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:0:34
run_script_name=`WWW/load.page`;
run_script_code=`

`;
//!WWW/load.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:1:3

//!WWW/load.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:1:3

//!WWW/load.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:1:3

out_run_script.text+=`
<!DOCTYPE html>
<html lang="en" me=more>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Home Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        
        



    <link rel="stylesheet" href="/add.svelte.css"/><link rel="stylesheet" href="/load-bG9hZ.pub.css"/><script src="/serv/connect.js" async></script><script src="/load-bG9hZ.pub.js" defer></script></head>
    <body>
        <header>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div class="container-fluid">
                <a class="navbar-brand" href="#">Beyond easy</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Getting started</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Guide</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">API reference</a>
                        </li>
                    </ul>
                </div>
                </div>
            </nav>
        </header>
        <nnn>
        
        <main class="flex-shrink-0 pt-5">
            <div class="container mt-5">
                

<p>cool</p>




<button onclick="heyFromServer()">what</button>


<div id="div2">
    <p>next to me</p>    
</div>

        <div id="YWRkLnN2ZW"><main><div class="cool svelte-130li7h"><p>ferw</p>
        <div class="copy-color svelte-fldnie">text ferw
</div></div>
    <button>more</button>
</main></div>
        <script type="module">
            import AppYWRkLnN2ZW from '/add.svelte';
            const targetYWRkLnN2ZW = document.querySelector("#YWRkLnN2ZW");
            if(targetYWRkLnN2ZW)
                new AppYWRkLnN2ZW({
                    target: targetYWRkLnN2ZW
                    ,props:{me: 'ferw'}, hydrate: true
                });
        </script>

            </div>
        </main>
    </body>
</html>`;
        if(_optionalChain([Post, 'optionalAccess', _ => _.connectorCall])){
            if(await handelConnector("connect", page, [
        {
            name:"getData",
            sendTo:getWord,
            notValid: null,
            message:true,
            validator:[["string-length-range", 1,3]]
        }])){
                return;
            }
        }
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvL1dXVy9sb2FkLnBhZ2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTs7Ozs7QUFRQTs7O0FBU0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBRGlCQTtBQUNBO0FBQ0E7QUFDQTtBQW5EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJsb2FkLnBhZ2UuY2pzIn0=