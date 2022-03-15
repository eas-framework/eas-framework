require('source-map-support').install(); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {try {

run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;
out_run_script.text+=`<!DOCTYPE html>
<html lang="en" me=more>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Home Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        
        Home Page
        

/Users/idoio/Documents/beyond-easy/dist/SystemData/WWWCompile/Website.mode.comp.js
    <script src="/serv/temp.js" async></script><script src="/V1dXL.pub.js" defer></script></head>
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
                
`;
run_script_code=`

    import DateString from './DateString.serv.js';

    if(Session){
        if(!Session.count)
            Session.count = 0;
        Session.count++;
    }
    var en = debug

`;
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
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:5:3

//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:5:3

out_run_script.text+=`



`;
run_script_code=`write(Query);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:20:7
write(Query);
out_run_script.text+=`

<meta name="viewport" 🥰 content="width=device-width, initial-"></meta>
<h1 `;
run_script_code=`write(true ? ' checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:27:28
write(true ? ' checked': '');
out_run_script.text+=`></h1>
<p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:28:30
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:29:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:30:35
write(_optionalChain([Session, 'optionalAccess', _ => _.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:33:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:33:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:34:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:35:35
write(_optionalChain([Session, 'optionalAccess', _2 => _2.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkb🥰ox" `;
run_script_code=`write(debug ? 'checked🥰': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:38:63
write(true ? 'checked🥰': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:38:133
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? 🥰 🥰 `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:39:23
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:40:35
write(_optionalChain([Session, 'optionalAccess', _3 => _3.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:43:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:43:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:44:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:45:35
write(_optionalChain([Session, 'optionalAccess', _4 => _4.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:48:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:48:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:49:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:50:35
write(_optionalChain([Session, 'optionalAccess', _5 => _5.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:53:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:53:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:54:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:55:35
write(_optionalChain([Session, 'optionalAccess', _6 => _6.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:58:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:58:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:59:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:60:35
write(_optionalChain([Session, 'optionalAccess', _7 => _7.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:63:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:63:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:64:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:65:35
write(_optionalChain([Session, 'optionalAccess', _8 => _8.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:68:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:68:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:69:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:70:35
write(_optionalChain([Session, 'optionalAccess', _9 => _9.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:73:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:73:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:74:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:75:35
write(_optionalChain([Session, 'optionalAccess', _10 => _10.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:78:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:78:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:79:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:80:35
write(_optionalChain([Session, 'optionalAccess', _11 => _11.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:83:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:83:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:84:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:85:35
write(_optionalChain([Session, 'optionalAccess', _12 => _12.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:88:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:88:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:89:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:90:35
write(_optionalChain([Session, 'optionalAccess', _13 => _13.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:93:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:93:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:94:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:95:35
write(_optionalChain([Session, 'optionalAccess', _14 => _14.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:98:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:98:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:99:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:100:35
write(_optionalChain([Session, 'optionalAccess', _15 => _15.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:103:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:103:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:104:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:105:35
write(_optionalChain([Session, 'optionalAccess', _16 => _16.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:108:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:108:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:109:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:110:35
write(_optionalChain([Session, 'optionalAccess', _17 => _17.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:113:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:113:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:114:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:115:35
write(_optionalChain([Session, 'optionalAccess', _18 => _18.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:118:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:118:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:119:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:120:35
write(_optionalChain([Session, 'optionalAccess', _19 => _19.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:123:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:123:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:124:19
write(en);
out_run_script.text+=`</p> 
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:125:35
write(_optionalChain([Session, 'optionalAccess', _20 => _20.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:128:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:128:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:129:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:130:35
write(_optionalChain([Session, 'optionalAccess', _21 => _21.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:133:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:133:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:134:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:135:35
write(_optionalChain([Session, 'optionalAccess', _22 => _22.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:138:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:138:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:139:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:140:35
write(_optionalChain([Session, 'optionalAccess', _23 => _23.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:143:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:143:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:144:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:145:35
write(_optionalChain([Session, 'optionalAccess', _24 => _24.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:148:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:148:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:149:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:150:35
write(_optionalChain([Session, 'optionalAccess', _25 => _25.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key 🥰 ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '🥰');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:153:62
write(true ? 'checked': '🥰');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:153:132
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:154:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:155:35
write(_optionalChain([Session, 'optionalAccess', _26 => _26.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:158:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:158:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:159:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:160:35
write(_optionalChain([Session, 'optionalAccess', _27 => _27.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:163:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:163:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:164:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:165:35
write(_optionalChain([Session, 'optionalAccess', _28 => _28.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:168:61
write(true ? 'checked': '');
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write(DateString());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:168:131
write(DateString());
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:169:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write(Session?.count);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:170:35
write(_optionalChain([Session, 'optionalAccess', _29 => _29.count]));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/:0:0
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write(debug ? 'checked': '');`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:173:61
write(true ? 'checked': '');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1dXVy9pbmRleC5wYWdlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL0NvbXBvbmVudHMvQnV0dG9uTGluay5pbnRlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7QUFLQTs7O0FBQ0E7QUFDQTs7QUFLQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzVCQTs7O0FDREE7QUY4QkE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNqQ0E7OztBQ0RBO0FGbUNBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDdENBOzs7QUNEQTtBRndDQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzNDQTs7O0FDREE7QUY2Q0E7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNoREE7OztBQ0RBO0FGa0RBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDckRBOzs7QUNEQTtBRnVEQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzFEQTs7O0FDREE7QUY0REE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUMvREE7OztBQ0RBO0FGaUVBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDcEVBOzs7QUNEQTtBRnNFQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3pFQTs7O0FDREE7QUYyRUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM5RUE7OztBQ0RBO0FGZ0ZBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDbkZBOzs7QUNEQTtBRnFGQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3hGQTs7O0FDREE7QUYwRkE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM3RkE7OztBQ0RBO0FGK0ZBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDbEdBOzs7QUNEQTtBRm9HQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3ZHQTs7O0FDREE7QUZ5R0E7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM1R0E7OztBQ0RBO0FGOEdBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDakhBOzs7QUNEQTtBRm1IQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3RIQTs7O0FDREE7QUZ3SEE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUMzSEE7OztBQ0RBOztBRjhIQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNoSUE7OztBQ0RBO0FGa0lBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDcklBOzs7QUNEQTtBRnVJQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzFJQTs7O0FDREE7QUY0SUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUMvSUE7OztBQ0RBO0FGaUpBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDcEpBOzs7QUNEQTtBRnNKQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3pKQTs7O0FDREE7QUYySkE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM5SkE7OztBQ0RBO0FGZ0tBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDbktBOzs7QUNEQTs7QUZzS0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDeEtBOzs7QUNEQTtBRjBLQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7QUQ3SEE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXgucGFnZS5janMifQ==