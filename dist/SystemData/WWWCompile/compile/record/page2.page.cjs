require('source-map-support').install();module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
  return async function(page) {
    const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/record/page2.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/record";
    const require2 = (p) => _require(__filename, __dirname, page, p);
    const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
    var module2 = { exports: {} }, exports2 = module2.exports, { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar } = page, run_script_code = run_script_name;
    const transfer = (p, preserveForm, withObject) => (out_run_script = { text: "" }, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
    {
      try {
        run_script_name = `WWW/compile/record/page2.page -> WWW/compile/server.mode -> Models/TestBreadcrumb.mode -> Models/Website.mode`;
        run_script_code = `
    const declareVariable = 9;
`;
        //!WWW/compile/record/page2.page -> WWW/compile/server.mode -> Models/TestBreadcrumb.mode<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Models/Website.mode:2:30
        const declareVariable = 9;
        out_run_script.text += `
<!DOCTYPE html>
<html lang="en" me=more>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EAS Tests |
        Compile | Record
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vinorodrigues/bootstrap-dark@0.6.1/dist/bootstrap-dark.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"><\/script>
    
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
        run_script_name = `WWW/compile/record/page2.page -> Components/NavLink.inte`;
        run_script_code = `{`;
        //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
        {
          out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/">Home</a>
</li>`;
          run_script_code = `}`;
          //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
        }
        out_run_script.text += `
                    `;
        run_script_name = `WWW/compile/record/page2.page -> Components/NavLink.inte`;
        run_script_code = `{`;
        //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
        {
          out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/tests">Tests</a>
</li>`;
          run_script_code = `}`;
          //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
        }
        out_run_script.text += `
                    `;
        run_script_name = `WWW/compile/record/page2.page -> Components/NavLink.inte`;
        run_script_code = `{`;
        //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
        {
          out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/static">Generated Static</a>
</li>`;
          run_script_code = `}`;
          //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
        }
        out_run_script.text += `
                    `;
        run_script_name = `WWW/compile/record/page2.page -> Components/NavLink.inte`;
        run_script_code = `{`;
        //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:1:3
        {
          out_run_script.text += `

<li class="nav-item">
    <a class="nav-link" href="/compile">Generated Compile</a>
</li>`;
          run_script_code = `}`;
          //!WWW/compile/record/page2.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/NavLink.inte:5:8
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
        <li class="breadcrumb-item"><a href="/compile/index">Compile</a></li>
        <li class="breadcrumb-item active" aria-current="page">Record</li>
    </ol>
</nav>
<hr/>


    <a href="./nested/page3">page 3</a>

    <h1>Page 2 record</h1>

    other text

        </div>
    </main>
</body>

</html>`;
      } catch (e) {
        const last_file = run_script_name.split(/->|<line>/).pop();
        run_script_name += " -> <line>" + e.stack.split(/\n( )*at /)[2];
        out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, "<br/>") + "</p><p>Error message: " + e.message + "</p></p>";
        console.error("Error path: " + run_script_name.slice(0, -last_file.length).replace(/<line>/gi, "\n"));
        console.error("/Users/idoio/Documents/beyond-easy/tests/core/Website/" + last_file.trim());
        console.error("Error message: " + e.message);
        console.error('Error running this code: "' + run_script_code + '"');
        console.error("Error stack: " + e.stack);
      }
    }
  };
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiLi4vLi4vLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL0NvbXBvbmVudHMvTmF2TGluay5pbnRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQ0ZBO0FBQ0E7O0FBQUE7QUFBQTtBQUFBOzs7QUFHQTtBQUNBO0FBQUE7Ozs7QUFMQTtBQUNBOztBQUFBO0FBQUE7QUFBQTs7O0FBR0E7QUFDQTtBQUFBOzs7O0FBTEE7QUFDQTs7QUFBQTtBQUFBO0FBQUE7OztBQUdBO0FBQ0E7QUFBQTs7OztBQUxBO0FBQ0E7O0FBQUE7QUFBQTtBQUFBOzs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEiLCJmaWxlIjoicGFnZTIucGFnZS5janMifQ==