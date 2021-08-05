import sourceMapSupport from 'source-map-support'; sourceMapSupport.install({hookRequire: true});export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, isDebug, RequireVar} = page,
                    
                    run_script_code = run_script_name; 

                {try {

run_script_code=`if(true){;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:1:10
if(true){;
out_run_script.text+=`
    123
`;
run_script_code=`} else {;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:3:8
} else {;
out_run_script.text+=`
    <div>refre</div>
`;
run_script_code=`};`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:1:1
};
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0cnkucGFnZS5qcyJ9