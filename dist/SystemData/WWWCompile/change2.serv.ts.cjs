require('source-map-support').install();var __dirname="/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW",__filename="/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change2.serv.ts";module.exports = (async (require)=>{var module={exports:{}},exports=module.exports;"use strict";Object.defineProperty(exports, "__esModule", {value: true});const {func:change3} = await require('./change3.serv')


 function func(){
    return "change?32 " + change3();
} exports.func = func;
return module.exports;});