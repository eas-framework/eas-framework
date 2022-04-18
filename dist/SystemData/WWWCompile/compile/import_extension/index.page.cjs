module.exports = (_require, _include, _transfer, private_var, handelConnector)=>{
    return async function(page) {
        const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/import_extension/index.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/import_extension";
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
            const { data  } = await require('./json_data.json');
            const echoData = ()=>write(` <p> data: ${data} </p> `)
            ;
            const declareVariable = 9;
            out_run_script.text += `<!DOCTYPE html> <html lang="en" me=more> <head> <meta charset="UTF-8"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title> EAS Tests | Compile | Import Extension </title> <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/> <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vinorodrigues/bootstrap-dark@0.6.1/dist/bootstrap-dark.min.css"/> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script> </head> <body> <nav class="navbar navbar-expand-lg navbar-light bg-light"> <div class="container-fluid"> <a class="navbar-brand" href="/"> EAS - Tests </a> <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarSupportedContent"> <ul class="navbar-nav me-auto mb-2 mb-lg-0"> `;
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
            out_run_script.text += ` </ul> <form class="d-flex"> <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/> <button class="btn btn-outline-success" type="submit"> Search </button> </form> </div> </div> </nav> <main class="flex-shrink-0 pt-5"> <div class="container mt-5"> <nav aria-label="breadcrumb"> <ol class="breadcrumb"> <li class="breadcrumb-item"> <a href="/"> Home </a> </li> <li class="breadcrumb-item"> <a href="/compile/index"> Compile </a> </li> <li class="breadcrumb-item active" aria-current="page"> Import Extension </li> </ol> </nav> <hr/> 

`;
            echoData();
            out_run_script.text += ` </div> </main> </body> </html>`;
        }
    };
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9XV1cvY29tcGlsZS9pbXBvcnRfZXh0ZW5zaW9uL2luZGV4LnBhZ2UudHMiLCIuLi8uLi8uLi8uLi8uLi90ZXN0cy9jb3JlL1dlYnNpdGUvTW9kZWxzL1dlYnNpdGUubW9kZS50cyIsIi4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvVGVzdEJyZWFkY3J1bWIubW9kZSIsIi4uLy4uLy4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9XV1cvY29tcGlsZS9pbXBvcnRfZXh0ZW5zaW9uL2luZGV4LnBhZ2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FDQUE7QURBQTtBQ0FBO0FBQUE7QUFBQTs7QUNTQTs7QUNSQTtBQUVBOzs7Ozs7Ozs7QURNQTs7QUNSQTtBQUVBIiwiZmlsZSI6ImluZGV4LnBhZ2UuY2pzIn0=