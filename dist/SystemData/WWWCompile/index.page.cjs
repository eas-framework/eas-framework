require('source-map-support').install();"use strict"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }module.exports = (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, RequestVar} = page,
                    
                    run_script_code = run_script_name; 

                {try {

run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:0:35
run_script_name=`WWW/index.page`;
run_script_code=``;
//!WWW/index.page -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:2:1

out_run_script.text+=`
<!DOCTYPE html>
<html lang="en" me=more>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Home Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        
        Home Page
    `;out_run_script.text+= `<script src="/serv/temp.js" async></script><script src="/index-aW5kZ.pub.js" defer></script>`
out_run_script.text+=`</head>
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
    var en = debug`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:5:3

//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:5:3

//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:7:50
    const {default:DateString} = await require('./DateString.serv.js');
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:5:3

//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:9:16
    if(Session){
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:10:26
        if(!Session.count)
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:11:30
            Session.count = 0;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:12:24
        Session.count++;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:13:5
    }
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:14:18
    var en = true
out_run_script.text+=`


<meta name="viewport" content="width=device-width, initial-"></meta>
<p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:23:30
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:24:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:25:35
write(_optionalChain([Session, 'optionalAccess', _ => _.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:28:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:28:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:29:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:30:35
write(_optionalChain([Session, 'optionalAccess', _2 => _2.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:33:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:33:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:34:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:35:35
write(_optionalChain([Session, 'optionalAccess', _3 => _3.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:38:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:38:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:39:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:40:35
write(_optionalChain([Session, 'optionalAccess', _4 => _4.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:43:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:43:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:44:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:45:35
write(_optionalChain([Session, 'optionalAccess', _5 => _5.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:48:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:48:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:49:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:50:35
write(_optionalChain([Session, 'optionalAccess', _6 => _6.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:53:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:53:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:54:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:55:35
write(_optionalChain([Session, 'optionalAccess', _7 => _7.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:58:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:58:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:59:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:60:35
write(_optionalChain([Session, 'optionalAccess', _8 => _8.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:63:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:63:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:64:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:65:35
write(_optionalChain([Session, 'optionalAccess', _9 => _9.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:68:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:68:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:69:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:70:35
write(_optionalChain([Session, 'optionalAccess', _10 => _10.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:73:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:73:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:74:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:75:35
write(_optionalChain([Session, 'optionalAccess', _11 => _11.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:78:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:78:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:79:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:80:35
write(_optionalChain([Session, 'optionalAccess', _12 => _12.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:83:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:83:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:84:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:85:35
write(_optionalChain([Session, 'optionalAccess', _13 => _13.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:88:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:88:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:89:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:90:35
write(_optionalChain([Session, 'optionalAccess', _14 => _14.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:93:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:93:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:94:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:95:35
write(_optionalChain([Session, 'optionalAccess', _15 => _15.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:98:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:98:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:99:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:100:35
write(_optionalChain([Session, 'optionalAccess', _16 => _16.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:103:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:103:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:104:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:105:35
write(_optionalChain([Session, 'optionalAccess', _17 => _17.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:108:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:108:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:109:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:110:35
write(_optionalChain([Session, 'optionalAccess', _18 => _18.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:113:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:113:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:114:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:115:35
write(_optionalChain([Session, 'optionalAccess', _19 => _19.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:118:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:118:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:119:19
write(en);;
out_run_script.text+=`</p> 
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:120:35
write(_optionalChain([Session, 'optionalAccess', _20 => _20.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:123:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:123:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:124:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:125:35
write(_optionalChain([Session, 'optionalAccess', _21 => _21.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:128:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:128:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:129:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:130:35
write(_optionalChain([Session, 'optionalAccess', _22 => _22.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:133:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:133:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:134:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:135:35
write(_optionalChain([Session, 'optionalAccess', _23 => _23.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:138:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:138:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:139:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:140:35
write(_optionalChain([Session, 'optionalAccess', _24 => _24.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:143:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:143:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:144:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:145:35
write(_optionalChain([Session, 'optionalAccess', _25 => _25.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:148:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:148:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:149:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:150:35
write(_optionalChain([Session, 'optionalAccess', _26 => _26.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:153:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:153:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:154:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:155:35
write(_optionalChain([Session, 'optionalAccess', _27 => _27.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:158:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:158:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:159:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:160:35
write(_optionalChain([Session, 'optionalAccess', _28 => _28.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:163:61
write(true ? 'checked': '');;
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:163:131
write(DateString());;
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:164:19
write(en);;
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:165:35
write(_optionalChain([Session, 'optionalAccess', _29 => _29.count]));;
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{"use strict";run_script_code=`run_script_name=\`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page onclick="window.location.reload()"  -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:168:61
write(true ? 'checked': '');;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1dXVy9pbmRleC5wYWdlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL0NvbXBvbmVudHMvQnV0dG9uTGluay5pbnRlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL0NvbXBvbmVudHMvQnV0dG9uTGluay5pbnRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7QUFSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBO0FBQ0E7OztBQU9BO0FBQ0E7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3ZCQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGMEJBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzVCQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGK0JBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ2pDQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGb0NBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3RDQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGeUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzNDQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGOENBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ2hEQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGbURBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3JEQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGd0RBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzFEQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGNkRBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQy9EQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGa0VBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3BFQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGdUVBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3pFQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGNEVBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzlFQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGaUZBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ25GQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGc0ZBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3hGQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGMkZBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzdGQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGZ0dBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ2xHQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGcUdBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3ZHQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGMEdBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzVHQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGK0dBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ2pIQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGb0hBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3RIQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGeUhBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzNIQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGOEhBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ2hJQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGbUlBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3JJQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGd0lBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzFJQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGNklBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQy9JQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGa0pBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3BKQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGdUpBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3pKQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGNEpBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzlKQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGaUtBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ25LQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGc0tBO0FBQ0E7OztBQUFBO0FBQ0E7QUR4SEE7QUFDQTtBQUNBO0FBQUE7QUFsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXgucGFnZS5janMifQ==