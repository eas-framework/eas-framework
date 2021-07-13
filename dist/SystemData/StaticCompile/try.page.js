import sourceMapSupport from 'source-map-support'; sourceMapSupport.install({hookRequire: true});export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, isDebug, RequireVar} = page,
                    
                    run_script_code = run_script_name; 

                {try {

out_run_script.text+=`<p `;
run_script_code=`write(isDebug);;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:1:14
write(isDebug);;
out_run_script.text+=`>
kkk
</p>`;
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9TdGF0aWMvdHJ5LnBhZ2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLEFBREE7OztBQUFBO0FBQ0EsQUFEQTtBQUNBO0FBQUEsQUFEQSIsImZpbGUiOiJ0cnkucGFnZS5qcyJ9