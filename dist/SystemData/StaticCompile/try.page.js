import sourceMapSupport from 'source-map-support'; sourceMapSupport.install({hookRequire: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, isDebug, RequireVar} = page,
                    
                    run_script_code = run_script_name; 

                {try {

run_script_code=`


    let i = 0;
    async function servInfo(text) {
        return '123 ' + text + i;
    }

    
        if(Post?.connectorCall){
            if(await handelConnector("connect", page, [{name:"getInfo",sendTo:servInfo,message:true,validator:[["text"]]}])){
                return;
            }
        }
;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:16:3

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:17:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:18:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:19:15
    let i = 0;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:20:36
    async function servInfo(text) {
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:21:34
        return '123 ' + text + i;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:22:6
    }
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:23:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:24:18
    
        if(_optionalChain([Post, 'optionalAccess', _ => _.connectorCall])){
            if(await handelConnector("connect", page, [{name:"getInfo",sendTo:servInfo,message:true,validator:[["text"]]}])){
                return;
            }
        }
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/try.page:24:19
;
out_run_script.text+=`
`;{"use strict";out_run_script.text+=`<script src="/serv/connect.js"></script>
    <script defer>
        function getInfo(...args){
            return connector("getInfo", args);
        }
    </script>
    `;};
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9TdGF0aWMvdHJ5LnBhZ2UiLCIuLi8uLi8uLi90ZXN0cy9jb3JlL0BDb25uZWN0SGVyZTsiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBRFVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQURrQkE7O0FBQUE7QUFDQTtBQUFBLEFBbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidHJ5LnBhZ2UuanMifQ==