
         var b = 9;
        function more({name,cool}, selector = "", out_run_script = {text: ''}){
        const {write, safeWrite, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        "use strict";out_run_script.text+=`
    `;
run_script_code=`for(var i = 0; i < 20; i++){`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:18:33
for(var i = 0; i < 20; i++){
out_run_script.text+=`
        `;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:0:35
run_script_name=`WWW/index.page`;{
run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte.js\`;`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:0:68
run_script_name=`WWW/index.page -> Components/ButtonLink.inte.js`;
run_script_code=`console.log('ButtonLink2')`;
//!WWW/index.page -> Components/ButtonLink.inte.js -><line>/Users/idoio/Documents/beyond-easy/tests/core/Website/Components/ButtonLink.inte.js:1:26
console.log('ButtonLink2')
out_run_script.text+=`<a>`;
run_script_code=`write(i);;`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:19:23
write(i);;
out_run_script.text+=`+Cool</a>`;}
out_run_script.text+=`
    `;
run_script_code=`}`;
//!/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/index.page:20:5
}
out_run_script.text+=`
`;
        return sendToSelector(selector, out_run_script.text);
    }
more.exports = {};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vZGVscy9XZWJzaXRlLm1vZGUuc291cmNlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFZQTtBQUNBIiwiZmlsZSI6ImluZGV4LnBhZ2UifQ==