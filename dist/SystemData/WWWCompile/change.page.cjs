require('source-map-support').install(); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {try {

run_script_code=`
    import {func} from './change'
`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change.page:1:3

//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change.page:2:33
    const {func} = await require('./change')
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change.page:1:3

out_run_script.text+=`
<h1>Try it</h1>
<p>`;
run_script_code=`write(func());`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change.page:5:11
write(func());
out_run_script.text+=`</p>
`;{
            const _page = page;
            {
            const page = {..._page};
            const __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page", __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW";
            const require = (p) => _require(__filename, __dirname, page, p);
            const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
            const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {
run_script_code=`
    import {setData, getData} from './store'
    function me(i){
        console.log('have: ' + getData())
        setData(i.length);
        console.log(getData())
        write('cool -' + i)
    }
`;
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:1:3

//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:2:44
    const {setData, getData} = await require('./store')
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:3:19
    function me(i){
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:4:41
        console.log('have: ' + getData())
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:5:26
        setData(i.length);
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:6:30
        console.log(getData())
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:7:27
        write('cool -' + i)
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:8:5
    }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:1:3

out_run_script.text+=`

`;
run_script_code=`write(__filename);`;
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:11:12
write(__filename);
out_run_script.text+=`

`;

                if(_optionalChain([Post, 'optionalAccess', _ => _.connectorFormCall]) == "bdc9a7ad-cd3b-486e-94bd-29f6693a5a6b"){
                    await handelConnector("form", page, 
                        {
                            sendTo:me,
                            notValid: null,
                            validator:[],
                            order: [],
                            message:true,
                            safe:false
                        }
                    );
                }

out_run_script.text+=`<form method=post>
    <input type="hidden" name="connectorFormCall" value="bdc9a7ad-cd3b-486e-94bd-29f6693a5a6b"/>
    <input name="am" value="more--------++"/>
</form>


`;
run_script_code=` 
    function checkLogin(name, password){
        if(testLogin(mail, password))
            return Response.redirect('/');
        write('<p>Wrong email or password</p>');
    }
`;
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:18:3
 
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:19:40
    function checkLogin(name, password){
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:20:37
        if(testLogin(mail, password))
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:21:42
            return Response.redirect('/');
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:22:48
        write('<p>Wrong email or password</p>');
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:23:5
    }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:18:3

out_run_script.text+=`

`;

                if(_optionalChain([Post, 'optionalAccess', _2 => _2.connectorFormCall]) == "55726cbd-c54e-4a00-a086-c166524aaa64"){
                    await handelConnector("form", page, 
                        {
                            sendTo:checkLogin,
                            notValid: null,
                            validator:[],
                            order: [],
                            message:true,
                            safe:false
                        }
                    );
                }

out_run_script.text+=`<form action="post" validator="email:email,password:6:30" method=post>
    <input type="hidden" name="connectorFormCall" value="55726cbd-c54e-4a00-a086-c166524aaa64"/>
    <input type="email" name="email" placeholder="Enter your email address"/>
    <input type="password" name="password" placeholder="Enter your password"/>
    <button type="submit">Submit</button>
</form>

`;
run_script_code=`
    async function userMessage(text, userId){
        try {
            await sendMessageToUser(text, userId, Session.userId)
            return "Message sent"
        } catch {
            return "Can't send message - make sure this use exists"
        }
    }
`;
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:32:3

//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:33:45
    async function userMessage(text, userId){
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:34:13
        try {
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:35:65
            await sendMessageToUser(text, userId, Session.userId)
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:36:33
            return "Message sent"
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:37:17
        } catch (e2) {
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:38:67
            return "Can't send message - make sure this use exists"
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:39:9
        }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:40:5
    }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:32:3

out_run_script.text+=`


<input type="number" id="userId" placeholder="User Id"/>
<textarea id="message" name="message" placeholder="Enter your message"></textarea>
<button onclick="sendMessage()">Send Message</button>



`;

                if(_optionalChain([Post, 'optionalAccess', _3 => _3.connectorFormCall]) == "55726cbd-c54e-4a00-a086-c166524aaa64"){
                    await handelConnector("form", page, 
                        {
                            sendTo:checkLogin,
                            notValid: null,
                            validator:[],
                            order: [],
                            message:true,
                            safe:false
                        }
                    );
                }

out_run_script.text+=`<form action="post" method=post>
    <input type="hidden" name="connectorFormCall" value="67279858-b1fd-4b54-a77e-66da27f855e5"/>
    <input type="email" name="email" placeholder="Enter your email address"/>
    <input type="password" name="password" placeholder="Enter your password"/>
    <button type="submit">Submit</button>
</form>`;}}}
out_run_script.text+=`
<div class="markdown-body"><h1 class="i-am" id="so-coo" tabindex="-1"><a class="header-anchor" href="#so-coo">So coo</a></h1>
<p>this is <abbr title="Hyper Text Markup Language">HTML</abbr> and you</p>
</div>
`;
run_script_code=`run_script_name=\`WWW/change.page\`;`;
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/foo/C.inte:0:36
run_script_name=`WWW/change.page`;{out_run_script.text+=`<h1>FFFF</h1>`;}
        if(_optionalChain([Post, 'optionalAccess', _4 => _4.connectorCall])){
            if(await handelConnector("connect", page, [
        {
            name:"sendMessageServer",
            sendTo:userMessage,
            notValid: null,
            message:true,
            validator:[]
        }])){
                return;
            }
        }
out_run_script.text+='<link rel="stylesheet" href="/serv/md/theme/light.css"/><script src="/serv/connect.js" async></script><script src="/change-Y2hhb.pub.js" defer></script>';
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy9XV1cvY2hhbmdlLnBhZ2UiLCIvVXNlcnMvaWRvaW8vRG9jdW1lbnRzL2JleW9uZC1lYXN5L3Rlc3RzL2NvcmUvV2Vic2l0ZS8vV1dXL2NvbmQucGFnZSIsIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy9XV1cvZm9vL0MuaW50ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7OztBQUVBO0FBQ0E7OztBQUFBO0FBQ0E7QUFEQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUFOQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7QUFFQTs7O0FBQ0E7QUFDQTs7QUFBQTs7QUFHQTtBQUFBO0FBQ0E7QUFDQTtBQUZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBSEE7O0FBQUE7QUFBQTs7O0FBR0E7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7OztBQUVBOztBQUdBO0FBQUE7QUFDQTtBQUNBO0FBRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFIQTs7QUFBQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBSUE7QUFDQTtBQUNBOzs7O0FBU0E7O0FBR0E7QUFBQTtBQUNBO0FBQ0E7QUFGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUhBOztBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBMURBO0FETUE7OztBQUFBOzs7QUVOQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNoYW5nZS5wYWdlLmNqcyJ9