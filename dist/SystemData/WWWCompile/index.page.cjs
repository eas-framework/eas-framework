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
//!WWW/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:0:35
run_script_name=`WWW/index.page`;
run_script_code=`

`;
//!WWW/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:1:3

//!WWW/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:1:3

//!WWW/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:1:3

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
    <script src="/serv/temp.js" async></script><script src="/index-aW5kZ.pub.js" defer></script></head>
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
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:17:7
write(Query);
out_run_script.text+=`

<meta name="viewport" 🥰 content="width=device-width, initial-"></meta>
<h1 `;
run_script_code=`write((true ? ' checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:24:29
write((true ? ' checked': ''));
out_run_script.text+=`></h1>
<p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:25:31
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:26:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:27:36
write((_optionalChain([Session, 'optionalAccess', _ => _.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:30:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:30:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:31:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:32:36
write((_optionalChain([Session, 'optionalAccess', _2 => _2.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkb🥰ox" `;
run_script_code=`write((debug ? 'checked🥰': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:35:64
write((true ? 'checked🥰': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:35:134
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? 🥰 🥰 `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:36:23
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:37:36
write((_optionalChain([Session, 'optionalAccess', _3 => _3.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:40:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:40:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:41:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:42:36
write((_optionalChain([Session, 'optionalAccess', _4 => _4.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:45:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:45:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:46:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:47:36
write((_optionalChain([Session, 'optionalAccess', _5 => _5.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:50:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:50:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:51:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:52:36
write((_optionalChain([Session, 'optionalAccess', _6 => _6.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:55:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:55:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:56:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:57:36
write((_optionalChain([Session, 'optionalAccess', _7 => _7.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:60:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:60:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:61:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:62:36
write((_optionalChain([Session, 'optionalAccess', _8 => _8.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:65:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:65:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:66:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:67:36
write((_optionalChain([Session, 'optionalAccess', _9 => _9.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:70:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:70:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:71:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:72:36
write((_optionalChain([Session, 'optionalAccess', _10 => _10.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:75:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:75:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:76:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:77:36
write((_optionalChain([Session, 'optionalAccess', _11 => _11.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:80:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:80:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:81:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:82:36
write((_optionalChain([Session, 'optionalAccess', _12 => _12.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:85:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:85:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:86:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:87:36
write((_optionalChain([Session, 'optionalAccess', _13 => _13.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:90:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:90:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:91:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:92:36
write((_optionalChain([Session, 'optionalAccess', _14 => _14.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:95:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:95:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:96:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:97:36
write((_optionalChain([Session, 'optionalAccess', _15 => _15.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:100:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:100:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:101:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:102:36
write((_optionalChain([Session, 'optionalAccess', _16 => _16.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:105:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:105:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:106:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:107:36
write((_optionalChain([Session, 'optionalAccess', _17 => _17.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:110:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:110:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:111:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:112:36
write((_optionalChain([Session, 'optionalAccess', _18 => _18.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:115:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:115:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:116:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:117:36
write((_optionalChain([Session, 'optionalAccess', _19 => _19.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:120:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:120:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:121:19
write(en);
out_run_script.text+=`</p> 
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:122:36
write((_optionalChain([Session, 'optionalAccess', _20 => _20.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:125:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:125:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:126:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:127:36
write((_optionalChain([Session, 'optionalAccess', _21 => _21.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:130:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:130:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:131:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:132:36
write((_optionalChain([Session, 'optionalAccess', _22 => _22.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:135:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:135:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:136:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:137:36
write((_optionalChain([Session, 'optionalAccess', _23 => _23.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:140:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:140:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:141:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:142:36
write((_optionalChain([Session, 'optionalAccess', _24 => _24.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:145:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:145:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:146:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:147:36
write((_optionalChain([Session, 'optionalAccess', _25 => _25.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key 🥰 ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': '🥰'));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:150:63
write((true ? 'checked': '🥰'));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:150:133
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:151:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:152:36
write((_optionalChain([Session, 'optionalAccess', _26 => _26.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:155:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:155:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:156:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:157:36
write((_optionalChain([Session, 'optionalAccess', _27 => _27.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:160:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:160:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:161:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:162:36
write((_optionalChain([Session, 'optionalAccess', _28 => _28.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:165:62
write((true ? 'checked': ''));
out_run_script.text+=`/><label for="checkbox">checkbox</label><p>Today date: `;
run_script_code=`write((DateString()));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:165:132
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(en);`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:166:19
write(en);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:167:36
write((_optionalChain([Session, 'optionalAccess', _29 => _29.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website//Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/index.page`;{run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>Reload page</a>`;}
out_run_script.text+=` 
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>
<input type="checkbox" id="checkbox" `;
run_script_code=`write((debug ? 'checked': ''));`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:170:62
write((true ? 'checked': ''));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvL1dXVy9pbmRleC5wYWdlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvL0NvbXBvbmVudHMvQnV0dG9uTGluay5pbnRlIiwiL1VzZXJzL2lkb2lvL0RvY3VtZW50cy9iZXlvbmQtZWFzeS90ZXN0cy9jb3JlL1dlYnNpdGUvL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Db21wb25lbnRzL0J1dHRvbkxpbmsuaW50ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FBVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBOzs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7QUFDQTtBQUNBOztBQUtBO0FBQ0E7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDekJBOzs7QUNEQTtBQUFBO0FGNEJBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzlCQTs7O0FDREE7QUFBQTtBRmlDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNuQ0E7OztBQ0RBO0FBQUE7QUZzQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDeENBOzs7QUNEQTtBQUFBO0FGMkNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzdDQTs7O0FDREE7QUFBQTtBRmdEQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNsREE7OztBQ0RBO0FBQUE7QUZxREE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDdkRBOzs7QUNEQTtBQUFBO0FGMERBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzVEQTs7O0FDREE7QUFBQTtBRitEQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNqRUE7OztBQ0RBO0FBQUE7QUZvRUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDdEVBOzs7QUNEQTtBQUFBO0FGeUVBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzNFQTs7O0FDREE7QUFBQTtBRjhFQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUNoRkE7OztBQ0RBO0FBQUE7QUZtRkE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDckZBOzs7QUNEQTtBQUFBO0FGd0ZBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQzFGQTs7O0FDREE7QUFBQTtBRjZGQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUMvRkE7OztBQ0RBO0FBQUE7QUZrR0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDcEdBOzs7QUNEQTtBQUFBO0FGdUdBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3pHQTs7O0FDREE7QUFBQTtBRjRHQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM5R0E7OztBQ0RBO0FBQUE7QUZpSEE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDbkhBOzs7QUNEQTtBQUFBO0FGc0hBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3hIQTs7O0FDREE7QUFBQTtBRjJIQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM3SEE7OztBQ0RBO0FBQUE7QUZnSUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDbElBOzs7QUNEQTtBQUFBO0FGcUlBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3ZJQTs7O0FDREE7QUFBQTtBRjBJQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUM1SUE7OztBQ0RBO0FBQUE7QUYrSUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDakpBOzs7QUNEQTtBQUFBO0FGb0pBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3RKQTs7O0FDREE7QUFBQTtBRnlKQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFEQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQURBOzs7QUMzSkE7OztBQ0RBO0FBQUE7QUY4SkE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBREE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBQUE7OztBQUFBO0FBQ0E7QUFEQTs7O0FDaEtBOzs7QUNEQTtBQUFBO0FGbUtBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQURBO0FBQ0E7QUFBQTs7O0FBQUE7QUFDQTtBQUFBOzs7QUFBQTtBQUNBO0FBREE7OztBQ3JLQTs7O0FDREE7QUFBQTtBRndLQTtBQUNBOzs7QUFBQTtBQUNBO0FEMUhBO0FBQ0E7QUFDQTtBQUNBO0FBbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LnBhZ2UuY2pzIn0=