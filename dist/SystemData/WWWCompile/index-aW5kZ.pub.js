
         var b = 9;
        function more({name,cool}, selector = "", out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        out_run_script.text+=`
    `;
run_script_code=`for(var i = 0; i < 20; i++){`;
//!WWW/index.page:19:33
for(var i = 0; i < 20; i++){
out_run_script.text+=`
        `;
run_script_code=`run_script_name=\`WWW/index.page\`;`;
//!WWW/index.page:0:35
run_script_name=`WWW/index.page`;{
run_script_code=`run_script_name=\`WWW/index.page -> Components/ButtonLink.inte\`;`;
//!WWW/index.page -> Components/ButtonLink.inte<line>Components/ButtonLink.inte.js:0:65
run_script_name=`WWW/index.page -> Components/ButtonLink.inte`;
out_run_script.text+=`<a>`;
run_script_code=`write(i);`;
//!WWW/index.page:20:23
write(i);
out_run_script.text+=`+Cool</a>`;}
out_run_script.text+=`
    `;
run_script_code=`}`;
//!WWW/index.page:21:5
}
out_run_script.text+=`
`;
        return sendToSelector(selector, out_run_script.text);
    }
more.exports = {};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Nb2RlbHMvV2Vic2l0ZS5tb2RlLnNvdXJjZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZQTtBQUNBIiwiZmlsZSI6ImluZGV4LnBhZ2UifQ==