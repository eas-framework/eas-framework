import sourceMapSupport from 'source-map-support'; sourceMapSupport.install({hookRequire: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, isDebug, RequireVar} = page,
                    
                    run_script_code = run_script_name; 

                {try {

run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Models\Website.mode:0:38
run_script_name=`Static/index.page`;
out_run_script.text+=`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Home Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        
    </head>
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

        
        <main class="flex-shrink-0 pt-5">
            <div class="container mt-5">
                
`;
run_script_code=`

    import DateString from './DateString.serv.js';

    if(Session){
        if(!Session.count)
            Session.count = 0;
        Session.count++;
    }
;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:4:3

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:5:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:6:51
    const {default:DateString} = await require('./DateString.serv.js');
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:7:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:8:17
    if(Session){
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:9:27
        if(!Session.count)
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:10:31
            Session.count = 0;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:11:25
        Session.count++;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:12:6
    }
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:12:7
;
out_run_script.text+=`
<p>Today date: `;
run_script_code=`write((DateString()));;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:14:31
write((DateString()));;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(debug);;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:15:22
write(true);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:16:36
write((_optionalChain([Session, 'optionalAccess', _ => _.count])));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Components\ButtonLink.inte:0:38
run_script_name=`Static/index.page`;{"use strict";out_run_script.text+=`<a onclick="window.location.reload()"  href="#">
    <button>Reload page</button>
</a>
`;};
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((isDebug ? 'checked': ''));;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:19:64
write((isDebug ? 'checked': ''));;
out_run_script.text+=`/><label for="checkbox">checkbox</label>
            </div>
        </main>
    </body>
</html>`;
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1N0YXRpYy9pbmRleC5wYWdlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL0NvbXBvbmVudHMvQnV0dG9uTGluay5pbnRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLEFBREEsQUFDQTtBQUNBO0FBQ0EsQUFIQSxBQUdBO0FBQ0EsQUFKQSxBQUlBO0FBQ0EsQUNKQSxBRElBO0FBQ0EsQUFOQSxBQU1BO0FBQ0EsQUFQQSxBQU9BO0FBQ0E7QUFDQSxBQVBBLEFBT0E7QUFDQTtBQUNBO0FBQ0EsQUFaQSxBQVlBO0FBQ0EsQUFiQSxBQWFBO0FBQ0EsQUFkQSxBQWNBO0FBQ0EsQUFmQSxBQWVBO0FBQ0EsQUFoQkEsQUFnQkE7QUFDQSxBQUZBLEFBRUE7QUFDQSxBQWxCQSxBQWtCQTtBQUNBLEFBbkJBLEFBbUJBO0FBQ0EsQUFwQkEsQUFvQkE7QUFDQSxBQXJCQSxBQXFCQTtBQUNBLEFBRkEsQUFFQTtBQUNBLEFBdkJBLEFBdUJBO0FBQ0EsQUF4QkEsQUF3QkE7QUFDQSxBQUZBLEFBRUE7QUFDQSxBQTFCQSxBQTBCQTtBQUNBLEFBM0JBLEFBMkJBO0FBQ0EsQUFGQSxBQUVBO0FBQ0EsQUE3QkEsQUE2QkE7QUFDQSxBQTlCQSxBQThCQTtBQUNBLEFBRkEsQUFFQTtBQUNBLEFBYkEsQUFhQTtBQUNBLEFBZkEsQUFlQTtBQUNBLEFBckJBLEFBcUJBO0FBQ0EsQUF2QkEsQUF1QkE7QUFDQSxBQXpCQSxBQXlCQTtBQUNBO0FBQ0E7QUFDQSxBQXZDQSxBQXVDQTtBQUNBLEFBeENBLEFBd0NBO0FBQ0EsQUN2Q0E7QUFBQTs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBLEFBREE7QUFDQTs7O0FBQUE7QUFDQSxBQURBO0FBQ0E7OztBQUFBO0FBQ0EsQUFEQTtBQUFBOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBRFdBO0FBQ0E7QUFDQSxBQWxCQSxBQWtCQTs7O0FBQUE7QUFDQSxBQURBLEFBbEJBLEFBa0JBLEFEdUJBO0FBQ0EsQUFGQSxBQUVBO0FBQ0EsQUFKQSxBQUlBO0FBQ0EsQUFsQ0EsQUFrQ0E7QUFBQSxBQTNDQSIsImZpbGUiOiJpbmRleC5wYWdlLmpzIn0=