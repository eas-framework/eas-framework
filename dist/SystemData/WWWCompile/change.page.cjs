require('source-map-support').install(); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }module.exports = (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,
                    
                    run_script_code = run_script_name; 

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
`;
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

                if(_optionalChain([Post, 'optionalAccess', _ => _.connectorFormCall]) == "4bb25a9b-db9e-45f1-a87f-b0668986e2b9"){
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
    <input type="hidden" name="connectorFormCall" value="4bb25a9b-db9e-45f1-a87f-b0668986e2b9"/>
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
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:16:3
 
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:17:40
    function checkLogin(name, password){
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:18:37
        if(testLogin(mail, password))
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:19:42
            return Response.redirect('/');
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:20:48
        write('<p>Wrong email or password</p>');
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:21:5
    }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:16:3

out_run_script.text+=`

`;

                if(_optionalChain([Post, 'optionalAccess', _2 => _2.connectorFormCall]) == "27a5ac5d-87cf-4fcf-a4d3-2bbc37979ff9"){
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
    <input type="hidden" name="connectorFormCall" value="27a5ac5d-87cf-4fcf-a4d3-2bbc37979ff9"/>
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
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:30:3

//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:31:45
    async function userMessage(text, userId){
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:32:13
        try {
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:33:65
            await sendMessageToUser(text, userId, Session.userId)
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:34:33
            return "Message sent"
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:35:17
        } catch (e2) {
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:36:67
            return "Can't send message - make sure this use exists"
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:37:9
        }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:38:5
    }
//!WWW/change.page<line>/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/cond.page:30:3

out_run_script.text+=`


<input type="number" id="userId" placeholder="User Id"/>
<textarea id="message" name="message" placeholder="Enter your message"></textarea>
<button onclick="sendMessage()">Send Message</button>



`;

                if(_optionalChain([Post, 'optionalAccess', _3 => _3.connectorFormCall]) == "27a5ac5d-87cf-4fcf-a4d3-2bbc37979ff9"){
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
    <input type="hidden" name="connectorFormCall" value="27d7c077-c5fb-4612-a559-e87edaf20823"/>
    <input type="email" name="email" placeholder="Enter your email address"/>
    <input type="password" name="password" placeholder="Enter your password"/>
    <button type="submit">Submit</button>
</form>
<h1>So coo;</h1>

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
out_run_script.text+='<script src="/serv/connect.js" async></script><script src="/change-Y2hhb.pub.js" defer></script>';
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy9XV1cvY2hhbmdlLnBhZ2UiLCIvVXNlcnMvaWRvaW8vRG9jdW1lbnRzL2JleW9uZC1lYXN5L3Rlc3RzL2NvcmUvV2Vic2l0ZS8vV1dXL2NvbmQucGFnZSIsIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlLy9XV1cvZm9vL0MuaW50ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFFQTtBQUNBOzs7QUFBQTtBQUNBO0FBREE7Ozs7Ozs7Ozs7Ozs7QUNIQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7QUFFQTs7QUFHQTtBQUFBO0FBQ0E7QUFDQTtBQUZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBSEE7O0FBQUE7QUFBQTs7O0FBR0E7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7OztBQUVBOztBQUdBO0FBQUE7QUFDQTtBQUNBO0FBRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFIQTs7QUFBQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBSUE7QUFDQTtBQUNBOzs7O0FBU0E7O0FBR0E7QUFBQTtBQUNBO0FBQ0E7QUFGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUhBOztBQUFBO0FBQ0E7QUFDQTtBQUFBOzs7QURsREE7OztBRU5BO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY2hhbmdlLnBhZ2UuY2pzIn0=