require('source-map-support').install();var __dirname="/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW",__filename="/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/change3.serv.ts";module.exports = (async (require)=>{var module={exports:{}},exports=module.exports;"use strict";Object.defineProperty(exports, "__esModule", {value: true});const {getData} = await require('./store.serv')

 function func(){
    return "change(8), data: " + getData();
} exports.func = func;
return module.exports;});