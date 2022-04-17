require('source-map-support').install();module.exports = (_require, _include, _transfer, private_var, handelConnector)=>{
    return async function(page) {
        const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/server/import/circle/index.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/server/import/circle";
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
            try {
                run_script_name = `WWW/server/import/circle/index.page -> WWW/server/import/circle/index.page.ts`;
                run_script_code = `import './from1.serv'`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/server/import/circle/index.page.ts:1:21
                await require('./from1.serv');
                run_script_name = `WWW/server/import/circle/index.page -> WWW/server/server.mode -> Models/TestBreadcrumb.mode -> Models/Website.mode -> Models/Website.mode.ts`;
                run_script_code = `const declareVariable = 9;`;
                //!WWW/server/import/circle/index.page -> WWW/server/server.mode -> Models/TestBreadcrumb.mode -> Models/Website.mode<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode.ts:1:26
                const declareVariable = 9;
                run_script_name = `WWW/server/import/circle/index.page -> WWW/server/server.mode -> Models/TestBreadcrumb.mode -> Models/Website.mode`;
                out_run_script.text += `
<!DOCTYPE html>
<html lang="en" me=more>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EAS Tests |
        Server | Import
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vinorodrigues/bootstrap-dark@0.6.1/dist/bootstrap-dark.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    
</head>

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
                run_script_name = `WWW/server/import/circle/index.page -> Components/NavLink.inte`;
                run_script_code = `{`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
                {
                    out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/">Home</a>
</li>`;
                    run_script_code = `}`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
                }
                out_run_script.text += `
                    `;
                run_script_name = `WWW/server/import/circle/index.page -> Components/NavLink.inte`;
                run_script_code = `{`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
                {
                    out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/tests">Tests</a>
</li>`;
                    run_script_code = `}`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
                }
                out_run_script.text += `
                    `;
                run_script_name = `WWW/server/import/circle/index.page -> Components/NavLink.inte`;
                run_script_code = `{`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
                {
                    out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/static">Generated Static</a>
</li>`;
                    run_script_code = `}`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
                }
                out_run_script.text += `
                    `;
                run_script_name = `WWW/server/import/circle/index.page -> Components/NavLink.inte`;
                run_script_code = `{`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
                {
                    out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/compile">Generated Compile</a>
</li>`;
                    run_script_code = `}`;
                //!WWW/server/import/circle/index.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
                }
                out_run_script.text += `
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
            
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="/server/index">Server</a></li>
        <li class="breadcrumb-item active" aria-current="page">Import</li>
    </ol>
</nav>
<hr/>

<p>Also see the console</p>
        </div>
    </main>
</body>

</html>`;
            } catch (e) {
                const last_file = run_script_name.split(/->|<line>/).pop();
                run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                out_run_script.text += '<div style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<(line|color)>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></div>';
                console.error("Error path: " + run_script_name.slice(0, -last_file.length).replace(/<line>/gi, '\n'));
                console.error("/Users/idoio/Documents/beyond-easy/tests/core/Website/" + last_file.trim());
                console.error("Error message: " + e.message);
                console.error("Error running this code: \"" + run_script_code + '"');
                console.error("Error stack: " + e.stack);
            }
        }
    };
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9XV1cvc2VydmVyL2ltcG9ydC9jaXJjbGUvaW5kZXgucGFnZS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL01vZGVscy9XZWJzaXRlLm1vZGUiLCIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0cy9jb3JlL1dlYnNpdGUvV1dXL3NlcnZlci9pbXBvcnQvY2lyY2xlL2luZGV4LnBhZ2UiLCIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0cy9jb3JlL1dlYnNpdGUvQ29tcG9uZW50cy9OYXZMaW5rLmludGUiLCIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0cy9jb3JlL1dlYnNpdGUvTW9kZWxzL1Rlc3RCcmVhZGNydW1iLm1vZGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTs7O0FDQUE7QUFBQTs7QUNFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUNSQTtBRFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7OztBRTFCQTtBQUNBO0FBQUE7O0FBRUE7QUFDQTtBQUFBOztBQUFBO0FBQ0E7QUZzQkE7QUFBQTs7O0FFM0JBO0FBQ0E7QUFBQTs7QUFFQTtBQUNBO0FBQUE7O0FBQUE7QUFDQTtBRnVCQTtBQUFBOzs7QUU1QkE7QUFDQTtBQUFBOztBQUVBO0FBQ0E7QUFBQTs7QUFBQTtBQUNBO0FGd0JBO0FBQUE7OztBRTdCQTtBQUNBO0FBQUE7O0FBRUE7QUFDQTtBQUFBOztBQUFBO0FBQ0E7QUZ5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FHdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBSGlDQTtBQUNBO0FBQ0E7OztBQUVBIiwiZmlsZSI6ImluZGV4LnBhZ2UuY2pzIn0=