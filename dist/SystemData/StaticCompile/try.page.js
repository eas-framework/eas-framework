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
    function sendRes(myNum: string){
        return '\\nCool! ' + myNum
    }

    function not(err){
        return 'info not valid - ' + err;
    };`;
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:2:3

//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:3:37
    function sendRes(myNum){
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:4:34
        return '\nCool! ' + myNum
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:5:6
    }
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:6:1

//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:7:23
    function not(err){
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:8:42
        return 'info not valid - ' + err;
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:9:5
    };
out_run_script.text+=`
`;
run_script_code=`

                if(Post?.connectorFormCall == "85a36a74-db6b-4fe1-b8fe-b5b0aa185e79"){
                    await handelConnector("form", page, 
                        {
                            sendTo:sendRes,
                            notValid: not,
                            validator:[["multiple-choice-number", 5,6]],
                            order: ["num"]
                        }
                    );
                }`;
//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:11:7

//!D:\Code\Projects\beyond-easy\tests\core\Website\Static\try.page:11:6

                if(_optionalChain([Post, 'optionalAccess', _ => _.connectorFormCall]) == "85a36a74-db6b-4fe1-b8fe-b5b0aa185e79"){
                    await handelConnector("form", page, 
                        {
                            sendTo:sendRes,
                            notValid: not,
                            validator:[["multiple-choice-number", 5,6]],
                            order: ["num"]
                        }
                    );
                }
out_run_script.text+=`<form method="POST">
    <input type="hidden" name="connectorFormCall" value="85a36a74-db6b-4fe1-b8fe-b5b0aa185e79"/>
    <input type="text" name="num" value="6"/> 
    <button type="submit">Submit</button>
</form>`;
        if(_optionalChain([Post, 'optionalAccess', _2 => _2.connectorCall])){
            if(await handelConnector("connect", page, [])){
                return;
            }
        }
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9TdGF0aWMvdHJ5LnBhZ2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQVZBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxBQURBO0FBQ0E7QUFDQTtBQUNBLEFBSEE7QUFDQSxBQURBO0FBQ0EsQUFEQTtBQUNBLEFBREE7QUFDQTtBQUNBO0FBQ0E7QUFIQSxBQVhBLEFBVUE7QUFDQSxBQURBO0FBQ0EsQUFYQSxBQVdBO0FBQ0EsQUFaQSxBQVlBO0FBQUE7QUFaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidHJ5LnBhZ2UuanMifQ==