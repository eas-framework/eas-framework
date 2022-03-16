require('source-map-support').install();var __dirname="/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW",__filename="/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change.serv.ts";module.exports = (async (require)=>{var module={exports:{}},exports=module.exports;"use strict";Object.defineProperty(exports, "__esModule", {value: true});const {func:change2} = await require('./change2.serv')

 function func(){
    return "change +++++3" + change2();
} exports.func = func;
return module.exports;});