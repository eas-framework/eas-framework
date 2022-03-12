export default function MinCss(code: string){
    while(code.includes('  ')){
        code = code.replace(/ {2}/gi, ' ');
    }

    //removing spaces
    code = code.replace(/\r\n|\n/gi, '');
    code = code.replace(/, /gi, ',');
    code = code.replace(/: /gi, ':');
    code = code.replace(/ \{/gi, '{');
    code = code.replace(/\{ /gi, '{');
    code = code.replace(/; /gi, ';');

    code = code.replace(/\/\*.*?\*\//gms, ''); // remove comments

    return code.trim();
}