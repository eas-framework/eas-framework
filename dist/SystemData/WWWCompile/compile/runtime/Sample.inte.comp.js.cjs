var __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/runtime", __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/compile/runtime/Sample.inte";
module.exports = async (require, script, style, define, store, page__filename, page__dirname, __localpath, attributes)=>{
    var module = {
        exports: {}
    }, exports = module.exports;
    const __writeArray = [];
    var __write;
    function write(text) {
        __write.text += text;
    }
    __write = {
        text: ''
    };
    __writeArray.unshift(__write);
    write(__dirname + '<br/>');
    write(__filename + '<br/>');
    write(page__dirname + '<br/>');
    write(page__filename + '<br/>');
    write(__localpath + '<br/>');
    write(JSON.stringify(attributes, null, 2));
    return __writeArray;
    return module.exports;
};
