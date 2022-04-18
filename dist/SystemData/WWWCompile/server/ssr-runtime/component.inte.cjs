module.exports = (_require, _include, _transfer, private_var, handelConnector)=>{
    return async function(page) {
        const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/server/ssr-runtime/component.inte", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/server/ssr-runtime";
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
            out_run_script.text += `<p> Hello </p>`;
        }
    };
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjb21wb25lbnQuaW50ZS5janMifQ==