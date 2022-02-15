require('source-map-support').install();"use strict";module.exports = (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,
                    
                    run_script_code = run_script_name; 

                {try {

run_script_code=`run_script_name=\`WWW/about.page -> WWW/About.page.js\`;`;
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:0:56
run_script_name=`WWW/about.page -> WWW/About.page.js`;
run_script_code=`const me = Math.random() + Request.url;


console.log(me);


import fs from 'fs/promises'
async function readFolder(dir, ext){
    const all = await fs.readdir(dir, {withFileTypes: true});

    const stringMap = [];
    for(const file of all){
        if(file.isDirectory())
            stringMap.push(...(await readFolder(dir + file.name + '/', ext)).map(x => file.name + '/' + x));
        else if(file.name.endsWith(ext))
            stringMap.push(file.name.substring(0, file.name.length - ext.length));
    }

    return stringMap;
}
const data = await readFolder("/Users/idoio/Documents/beyond-easy/node_modules/highlight.js/styles/", ".css");

let buildText = '';

for(const i of data){
    buildText += \`'\u0024{i}' | \`;
}

buildText = buildText.substring(0, buildText.length-3);

write(buildText);`;
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:39
const me = Math.random() + Request.url;
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:4:16
console.log(me);
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:7:28
const {default:fs} = await require('fs/promises')
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:8:36
async function readFolder(dir, ext){
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:9:61
    const all = await fs.readdir(dir, {withFileTypes: true});
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:11:25
    const stringMap = [];
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:12:27
    for(const file of all){
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:13:30
        if(file.isDirectory())
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:14:108
            stringMap.push(...(await readFolder(dir + file.name + '/', ext)).map(x => file.name + '/' + x));
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:15:40
        else if(file.name.endsWith(ext))
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:16:82
            stringMap.push(file.name.substring(0, file.name.length - ext.length));
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:17:5
    }
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:19:21
    return stringMap;
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:20:1
}
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:21:110
const data = await readFolder("/Users/idoio/Documents/beyond-easy/node_modules/highlight.js/styles/", ".css");
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:23:19
let buildText = '';
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:25:21
for(const i of data){
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:26:29
    buildText += `'${i}' | `;
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:27:1
}
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:29:55
buildText = buildText.substring(0, buildText.length-3);
//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:1:1

//!WWW/about.page -> WWW/About.page.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/About.page.js:31:17
write(buildText);
run_script_code=`run_script_name=\`WWW/about.page -> WWW/nested.mode\`;`;
//!WWW/about.page -> WWW/nested.mode<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:0:54
run_script_name=`WWW/about.page -> WWW/nested.mode`;
run_script_code=``;
//!WWW/about.page -> WWW/nested.mode<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:2:1

out_run_script.text+=`
<!DOCTYPE html>
<html lang="en" me=more>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><:title/></title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        
        
    `;out_run_script.text+= `<link rel="stylesheet" href="/serv/markdown-theme/atom-one-light.css"/><script src="/about-YWJvd.pub.js" defer></script>`
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
        <meats/>
        
        <main class="flex-shrink-0 pt-5">
            <div class="container mt-5">
                
<p>Nested</p>

<p>Welcome to the new B@eyond Website!</p>
<p>Today date: `;
run_script_code=`write(new Date().toString());;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/about.page:11:39
write(new Date().toString());;
out_run_script.text+=`</p>
`;
run_script_code=`write(me);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/about.page:12:4
write(me);;
out_run_script.text+=`

`;
run_script_code=`run_script_name=\`WWW/about.page\`;`;
//!WWW/about.page -> Components/ButtonLink.inte -> Components/ButtonLink.inte.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:35
run_script_name=`WWW/about.page`;{"use strict";run_script_code=`run_script_name=\`WWW/about.page -> Components/ButtonLink.inte -> Components/ButtonLink.inte.js\`;`;
//!WWW/about.page -> Components/ButtonLink.inte -> Components/ButtonLink.inte.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:98
run_script_name=`WWW/about.page -> Components/ButtonLink.inte -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/about.page -> Components/ButtonLink.inte -> Components/ButtonLink.inte.js<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>Cool</a>`;}
out_run_script.text+=` 
<div name="4" div><h1>MR</h1>
<p>goto</p>
<pre class="hljs"><code><span class="hljs-keyword">var</span> i = <span class="hljs-number">9</span>;
</code></pre>
</div>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1dXVy9BYm91dC5wYWdlLmpzIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1dXVy9uZXN0ZWQubW9kZSIsIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9XV1cvYWJvdXQucGFnZSIsIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Db21wb25lbnRzL0J1dHRvbkxpbmsuaW50ZSIsIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Db21wb25lbnRzL0J1dHRvbkxpbmsuaW50ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1hBOzs7Ozs7QUFHQTs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQUVBOzs7O0FBRUE7Ozs7Ozs7O0FEM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUU3Q0E7O0FDT0E7QUFDQTs7O0FBQUE7QUFDQTtBQURBOzs7QUFBQTtBQUVBOztBQUFBOzs7QUNYQTs7O0FDREE7O0FBQUE7QUFDQTtBQURBO0FGaUJBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUgrQkE7QUFDQTtBQUNBO0FBQUE7QUFsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWJvdXQucGFnZS5janMifQ==