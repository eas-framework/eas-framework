export default function MinCss(code) {
    while (code.includes('  ')) {
        code = code.replace(/ {2}/gi, ' ');
    }
    code = code.replace(/\r\n|\n/gi, '');
    code = code.replace(/, /gi, ',');
    code = code.replace(/: /gi, ':');
    code = code.replace(/ \{/gi, '{');
    code = code.replace(/\{ /gi, '{');
    code = code.replace(/; /gi, ';');
    return code.trim();
}
//# sourceMappingURL=CssMinimizer.js.map