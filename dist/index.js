var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

// src/MainBuild/Server.ts
import { App as TinyApp } from "@tinyhttp/app";
import compression from "compression";

// src/OutputInput/EasyFs.ts
import fs, { Dirent } from "fs";

// src/OutputInput/Console.ts
var printMode = true;
function allowPrint(d) {
  printMode = d;
}
var print = new Proxy(console, {
  get(target, prop, receiver) {
    if (printMode)
      return target[prop];
    return () => {
    };
  }
});

// src/OutputInput/EasyFs.ts
import path from "path";
function exists(path23) {
  return new Promise((res) => {
    fs.stat(path23, (err, stat2) => {
      res(Boolean(stat2));
    });
  });
}
function stat(path23, filed, ignoreError, defaultValue = {}) {
  return new Promise((res) => {
    fs.stat(path23, (err, stat2) => {
      if (err && !ignoreError) {
        print.error(err);
      }
      res(filed && stat2 ? stat2[filed] : stat2 || defaultValue);
    });
  });
}
async function existsFile(path23, ifTrueReturn = true) {
  return (await stat(path23, null, true)).isFile?.() && ifTrueReturn;
}
function mkdir(path23) {
  return new Promise((res) => {
    fs.mkdir(path23, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function rmdir(path23) {
  return new Promise((res) => {
    fs.rmdir(path23, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function unlink(path23) {
  return new Promise((res) => {
    fs.unlink(path23, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function unlinkIfExists(path23) {
  if (await exists(path23)) {
    return await unlink(path23);
  }
  return false;
}
function readdir(path23, options = {}) {
  return new Promise((res) => {
    fs.readdir(path23, options, (err, files) => {
      if (err) {
        print.error(err);
      }
      res(files || []);
    });
  });
}
async function mkdirIfNotExists(path23) {
  if (!await exists(path23))
    return await mkdir(path23);
  return false;
}
function writeFile(path23, content) {
  return new Promise((res) => {
    fs.writeFile(path23, content, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function writeJsonFile(path23, content) {
  try {
    return await writeFile(path23, JSON.stringify(content));
  } catch (err) {
    print.error(err);
  }
  return false;
}
function readFile(path23, encoding = "utf8") {
  return new Promise((res) => {
    fs.readFile(path23, encoding, (err, data) => {
      if (err) {
        print.error(err);
      }
      res(data || "");
    });
  });
}
async function readJsonFile(path23, encoding) {
  try {
    return JSON.parse(await readFile(path23, encoding));
  } catch (err) {
    print.error(err);
  }
  return {};
}
async function makePathReal(p, base = "") {
  p = path.dirname(p);
  if (!await exists(base + p)) {
    const all = p.split(/\\|\//);
    let pString = "";
    for (const i of all) {
      if (pString.length) {
        pString += "/";
      }
      pString += i;
      await mkdirIfNotExists(base + pString);
    }
  }
}
var EasyFs_default = __spreadProps(__spreadValues({}, fs.promises), {
  exists,
  existsFile,
  stat,
  mkdir,
  mkdirIfNotExists,
  writeFile,
  writeJsonFile,
  readFile,
  readJsonFile,
  rmdir,
  unlink,
  unlinkIfExists,
  readdir,
  makePathReal
});

// src/RunTimeBuild/SearchFileSystem.ts
import { cwd } from "process";
import path2 from "path";
import { fileURLToPath } from "url";
function getDirname(url) {
  return path2.dirname(fileURLToPath(url));
}
var SystemData = path2.join(getDirname(import.meta.url), "/SystemData");
var WebSiteFolder_ = "WebSite";
var StaticName = "WWW";
var LogsName = "Logs";
var ModulesName = "node_modules";
var StaticCompile = SystemData + `/${StaticName}Compile/`;
var CompileLogs = SystemData + `/${LogsName}Compile/`;
var CompileModule = SystemData + `/${ModulesName}Compile/`;
var workingDirectory = cwd() + "/";
function GetFullWebSitePath() {
  return path2.join(workingDirectory, WebSiteFolder_, "/");
}
var fullWebSitePath_ = GetFullWebSitePath();
function GetSource(name2) {
  return GetFullWebSitePath() + name2 + "/";
}
var getTypes = {
  Static: [
    GetSource(StaticName),
    StaticCompile,
    StaticName
  ],
  Logs: [
    GetSource(LogsName),
    CompileLogs,
    LogsName
  ],
  node_modules: [
    GetSource("node_modules"),
    CompileModule,
    ModulesName
  ],
  get [StaticName]() {
    return getTypes.Static;
  }
};
var pageTypes = {
  page: "page",
  model: "mode",
  component: "inte"
};
var BasicSettings = {
  pageTypes,
  pageTypesArray: [],
  pageCodeFile: {
    page: [pageTypes.page + ".js", pageTypes.page + ".ts"],
    model: [pageTypes.model + ".js", pageTypes.model + ".ts"],
    component: [pageTypes.component + ".js", pageTypes.component + ".ts"]
  },
  pageCodeFileArray: [],
  partExtensions: ["serv", "api"],
  ReqFileTypes: {
    js: "serv.js",
    ts: "serv.ts",
    "api-ts": "api.js",
    "api-js": "api.ts"
  },
  ReqFileTypesArray: [],
  get WebSiteFolder() {
    return WebSiteFolder_;
  },
  get fullWebSitePath() {
    return fullWebSitePath_;
  },
  set WebSiteFolder(value2) {
    WebSiteFolder_ = value2;
    fullWebSitePath_ = GetFullWebSitePath();
    getTypes.Static[0] = GetSource(StaticName);
    getTypes.Logs[0] = GetSource(LogsName);
  },
  get tsConfig() {
    return fullWebSitePath_ + "tsconfig.json";
  },
  async tsConfigFile() {
    if (await EasyFs_default.existsFile(this.tsConfig)) {
      return await EasyFs_default.readFile(this.tsConfig);
    }
  },
  relative(fullPath) {
    return path2.relative(fullWebSitePath_, fullPath);
  }
};
BasicSettings.pageTypesArray = Object.values(BasicSettings.pageTypes);
BasicSettings.pageCodeFileArray = Object.values(BasicSettings.pageCodeFile).flat();
BasicSettings.ReqFileTypesArray = Object.values(BasicSettings.ReqFileTypes);
async function DeleteInDirectory(path23) {
  const allInFolder = await EasyFs_default.readdir(path23, { withFileTypes: true });
  for (const i of allInFolder) {
    const n = i.name;
    if (i.isDirectory()) {
      const dir = path23 + n + "/";
      await DeleteInDirectory(dir);
      await EasyFs_default.rmdir(dir);
    } else {
      await EasyFs_default.unlink(path23 + n);
    }
  }
}

// src/CompileCode/XMLHelpers/CodeInfoAndDebug.ts
import path3 from "path";

// src/EasyDebug/StringTracker.ts
var StringTracker = class {
  constructor(Info, text) {
    this.DataArray = [];
    this.InfoText = null;
    this.OnLine = 1;
    this.OnChar = 1;
    if (typeof Info == "string") {
      this.InfoText = Info;
    } else if (Info) {
      this.setDefault(Info);
    }
    if (text) {
      this.AddFileText(text, this.DefaultInfoText.info);
    }
  }
  static get emptyInfo() {
    return {
      info: "",
      line: 0,
      char: 0
    };
  }
  setDefault(Info = this.DefaultInfoText) {
    this.InfoText = Info.info;
    this.OnLine = Info.line;
    this.OnChar = Info.char;
  }
  getDataArray() {
    return this.DataArray;
  }
  get DefaultInfoText() {
    if (!this.DataArray.find((x) => x.info) && this.InfoText != null) {
      return {
        info: this.InfoText,
        line: this.OnLine,
        char: this.OnChar
      };
    }
    return this.DataArray[this.DataArray.length - 1] ?? StringTracker.emptyInfo;
  }
  get StartInfo() {
    return this.DataArray[0] ?? this.DefaultInfoText;
  }
  get OneString() {
    let bigString = "";
    for (const i of this.DataArray) {
      bigString += i.text;
    }
    return bigString;
  }
  get eq() {
    return this.OneString;
  }
  get lineInfo() {
    const d = this.DefaultInfoText;
    const s = d.info.split("<line>");
    s.push(BasicSettings.fullWebSitePath + s.pop());
    return `${s.join("<line>")}:${d.line}:${d.char}`;
  }
  get length() {
    return this.DataArray.length;
  }
  Clone() {
    const newData = new StringTracker(this.StartInfo);
    for (const i of this.DataArray) {
      newData.AddTextAfter(i.text, i.info, i.line, i.char);
    }
    return newData;
  }
  AddClone(data) {
    this.DataArray.push(...data.DataArray);
    this.setDefault({
      info: data.InfoText,
      line: data.OnLine,
      char: data.OnChar
    });
  }
  static concat(...text) {
    const newString = new StringTracker();
    for (const i of text) {
      if (i instanceof StringTracker) {
        newString.AddClone(i);
      } else {
        newString.AddTextAfter(String(i));
      }
    }
    return newString;
  }
  ClonePlus(...data) {
    return StringTracker.concat(this.Clone(), ...data);
  }
  Plus(...data) {
    let lastinfo = this.DefaultInfoText;
    for (const i of data) {
      if (i instanceof StringTracker) {
        lastinfo = i.DefaultInfoText;
        this.AddClone(i);
      } else {
        this.AddTextAfter(String(i), lastinfo.info, lastinfo.line, lastinfo.char);
      }
    }
    return this;
  }
  Plus$(texts, ...values) {
    let lastValue = this.DefaultInfoText;
    for (const i in values) {
      const text = texts[i];
      const value2 = values[i];
      this.AddTextAfter(text, lastValue?.info, lastValue?.line, lastValue?.char);
      if (value2 instanceof StringTracker) {
        this.AddClone(value2);
        lastValue = value2.DefaultInfoText;
      } else if (value2 != null) {
        this.AddTextAfter(String(value2), lastValue?.info, lastValue?.line, lastValue?.char);
      }
    }
    this.AddTextAfter(texts[texts.length - 1], lastValue?.info, lastValue?.line, lastValue?.char);
    return this;
  }
  AddTextAction(text, action, info = this.DefaultInfoText.info, LineCount = 0, CharCount = 1) {
    const dataStore = [];
    for (const char of [...text]) {
      dataStore.push({
        text: char,
        info,
        line: LineCount,
        char: CharCount
      });
      CharCount++;
      if (char == "\n") {
        LineCount++;
        CharCount = 1;
      }
    }
    this.DataArray[action](...dataStore);
  }
  AddTextAfter(text, info, line, char) {
    this.AddTextAction(text, "push", info, line, char);
    return this;
  }
  AddTextAfterNoTrack(text) {
    for (const char of text) {
      this.DataArray.push({
        text: char,
        info: "",
        line: 0,
        char: 0
      });
    }
    return this;
  }
  AddTextBefore(text, info, line, char) {
    this.AddTextAction(text, "unshift", info, line, char);
    return this;
  }
  AddTextBeforeNoTrack(text) {
    const copy = [];
    for (const char of text) {
      copy.push({
        text: char,
        info: "",
        line: 0,
        char: 0
      });
    }
    this.DataArray.unshift(...copy);
    return this;
  }
  AddFileText(text, info = this.DefaultInfoText.info) {
    let LineCount = 1, CharCount = 1;
    for (const char of [...text]) {
      this.DataArray.push({
        text: char,
        info,
        line: LineCount,
        char: CharCount
      });
      CharCount++;
      if (char == "\n") {
        LineCount++;
        CharCount = 1;
      }
    }
  }
  CutString(start = 0, end = this.length) {
    const newString = new StringTracker(this.StartInfo);
    newString.DataArray.push(...this.DataArray.slice(start, end));
    return newString;
  }
  substring(start, end) {
    if (isNaN(end)) {
      end = void 0;
    } else {
      end = Math.abs(end);
    }
    if (isNaN(start)) {
      start = void 0;
    } else {
      start = Math.abs(start);
    }
    return this.CutString(start, end);
  }
  substr(start, length) {
    if (start < 0) {
      start = this.length - start;
    }
    return this.substring(start, length != null ? length + start : length);
  }
  slice(start, end) {
    if (start < 0) {
      start = this.length - start;
    }
    if (end < 0) {
      start = this.length - start;
    }
    return this.substring(start, end);
  }
  charAt(pos) {
    if (!pos) {
      pos = 0;
    }
    return this.CutString(pos, pos + 1);
  }
  at(pos) {
    return this.charAt(pos);
  }
  charCodeAt(pos) {
    return this.charAt(pos).OneString.charCodeAt(0);
  }
  codePointAt(pos) {
    return this.charAt(pos).OneString.codePointAt(0);
  }
  *[Symbol.iterator]() {
    for (const i of this.DataArray) {
      const char = new StringTracker();
      char.DataArray.push(i);
      yield char;
    }
  }
  getLine(line, startFromOne = true) {
    return this.split("\n")[line - +startFromOne];
  }
  charLength(index) {
    if (index <= 0) {
      return index;
    }
    let count = 0;
    for (const char of this.DataArray) {
      count++;
      index -= char.text.length;
      if (index <= 0)
        return count;
    }
  }
  indexOf(text) {
    return this.charLength(this.OneString.indexOf(text));
  }
  lastIndexOf(text) {
    return this.charLength(this.OneString.lastIndexOf(text));
  }
  unicodeMe(value2) {
    let a = "";
    for (const v of value2) {
      a += "\\u" + ("000" + v.charCodeAt(0).toString(16)).slice(-4);
    }
    return a;
  }
  get unicode() {
    const newString = new StringTracker();
    for (const i of this.DataArray) {
      newString.AddTextAfter(this.unicodeMe(i.text), i.info, i.line, i.char);
    }
    return newString;
  }
  search(regex) {
    return this.charLength(this.OneString.search(regex));
  }
  startsWith(search, position) {
    return this.OneString.startsWith(search, position);
  }
  endsWith(search, position) {
    return this.OneString.endsWith(search, position);
  }
  includes(search, position) {
    return this.OneString.includes(search, position);
  }
  trimStart() {
    const newString = this.Clone();
    newString.setDefault();
    for (let i = 0; i < newString.DataArray.length; i++) {
      const e = newString.DataArray[i];
      if (e.text.trim() == "") {
        newString.DataArray.shift();
        i--;
      } else {
        e.text = e.text.trimStart();
        break;
      }
    }
    return newString;
  }
  trimLeft() {
    return this.trimStart();
  }
  trimEnd() {
    const newString = this.Clone();
    newString.setDefault();
    for (let i = newString.DataArray.length - 1; i >= 0; i--) {
      const e = newString.DataArray[i];
      if (e.text.trim() == "") {
        newString.DataArray.pop();
      } else {
        e.text = e.text.trimEnd();
        break;
      }
    }
    return newString;
  }
  trimRight() {
    return this.trimEnd();
  }
  trim() {
    return this.trimStart().trimEnd();
  }
  SpaceOne(addInside) {
    const start = this.at(0);
    const end = this.at(this.length - 1);
    const copy = this.Clone().trim();
    if (start.eq) {
      copy.AddTextBefore(addInside || start.eq, start.DefaultInfoText.info, start.DefaultInfoText.line, start.DefaultInfoText.char);
    }
    if (end.eq) {
      copy.AddTextAfter(addInside || end.eq, end.DefaultInfoText.info, end.DefaultInfoText.line, end.DefaultInfoText.char);
    }
    return copy;
  }
  ActionString(Act) {
    const newString = this.Clone();
    for (const i of newString.DataArray) {
      i.text = Act(i.text);
    }
    return newString;
  }
  toLocaleLowerCase(locales) {
    return this.ActionString((s) => s.toLocaleLowerCase(locales));
  }
  toLocaleUpperCase(locales) {
    return this.ActionString((s) => s.toLocaleUpperCase(locales));
  }
  toUpperCase() {
    return this.ActionString((s) => s.toUpperCase());
  }
  toLowerCase() {
    return this.ActionString((s) => s.toLowerCase());
  }
  normalize() {
    return this.ActionString((s) => s.normalize());
  }
  StringIndexer(regex, limit) {
    if (regex instanceof RegExp) {
      regex = new RegExp(regex, regex.flags.replace("g", ""));
    }
    const allSplit = [];
    let mainText = this.OneString, hasMath = mainText.match(regex), addNext = 0, counter = 0;
    while ((limit == null || counter < limit) && hasMath?.[0]?.length) {
      const length = [...hasMath[0]].length, index = this.charLength(hasMath.index);
      allSplit.push({
        index: index + addNext,
        length
      });
      mainText = mainText.slice(hasMath.index + hasMath[0].length);
      addNext += index + length;
      hasMath = mainText.match(regex);
      counter++;
    }
    return allSplit;
  }
  RegexInString(searchValue) {
    if (searchValue instanceof RegExp) {
      return searchValue;
    }
    return new StringTracker("n", searchValue).unicode.eq;
  }
  split(separator, limit) {
    const allSplited = this.StringIndexer(this.RegexInString(separator), limit);
    const newSplit = [];
    let nextcut = 0;
    for (const i of allSplited) {
      newSplit.push(this.CutString(nextcut, i.index));
      nextcut = i.index + i.length;
    }
    newSplit.push(this.CutString(nextcut));
    return newSplit;
  }
  repeat(count) {
    const newString = this.Clone();
    for (let i = 0; i < count; i++) {
      newString.AddClone(this.Clone());
    }
    return newString;
  }
  replaceWithTimes(searchValue, replaceValue, limit) {
    const allSplited = this.StringIndexer(searchValue, limit);
    let newString = new StringTracker();
    let nextcut = 0;
    for (const i of allSplited) {
      newString = newString.ClonePlus(this.CutString(nextcut, i.index), replaceValue);
      nextcut = i.index + i.length;
    }
    newString.AddClone(this.CutString(nextcut));
    return newString;
  }
  replace(searchValue, replaceValue) {
    return this.replaceWithTimes(this.RegexInString(searchValue), replaceValue, searchValue instanceof RegExp ? void 0 : 1);
  }
  replacer(searchValue, func) {
    let copy = this.Clone(), SplitToReplace;
    function ReMatch() {
      SplitToReplace = copy.match(searchValue);
    }
    ReMatch();
    const newText = new StringTracker(copy.StartInfo);
    while (SplitToReplace) {
      newText.Plus(copy.substring(0, SplitToReplace.index));
      newText.Plus(func(SplitToReplace));
      copy = copy.substring(SplitToReplace.index + SplitToReplace[0].length);
      ReMatch();
    }
    newText.Plus(copy);
    return newText;
  }
  replaceAll(searchValue, replaceValue) {
    return this.replaceWithTimes(this.RegexInString(searchValue), replaceValue);
  }
  matchAll(searchValue) {
    const allMatchs = this.StringIndexer(searchValue);
    const mathArray = [];
    for (const i of allMatchs) {
      mathArray.push(this.substr(i.index, i.length));
    }
    return mathArray;
  }
  match(searchValue) {
    if (searchValue instanceof RegExp && searchValue.global) {
      return this.matchAll(searchValue);
    }
    const find = this.OneString.match(searchValue);
    if (find == null)
      return null;
    const ResultArray = [];
    ResultArray[0] = this.substr(find.index, find.shift().length);
    ResultArray.index = find.index;
    ResultArray.input = this.Clone();
    let nextMath = ResultArray[0].Clone();
    for (const i in find) {
      if (isNaN(Number(i))) {
        break;
      }
      const e = find[i];
      if (e == null) {
        ResultArray.push(e);
        continue;
      }
      const findIndex = nextMath.indexOf(e);
      ResultArray.push(nextMath.substr(findIndex, e.length));
      nextMath = nextMath.substring(findIndex + e.length);
    }
    return ResultArray;
  }
  toString() {
    return this.OneString;
  }
  extractInfo(type = "<line>") {
    return this.DefaultInfoText.info.split(type).pop().trim();
  }
  debugLine({ message, loc, line, col, sassStack }) {
    if (sassStack) {
      const loc2 = sassStack.match(/[0-9]+:[0-9]+/)[0].split(":").map((x) => Number(x));
      line = loc2[0];
      col = loc2[1];
    }
    let searchLine = this.getLine(line ?? loc?.line ?? 1), column = col ?? loc?.column ?? 0;
    if (searchLine.startsWith("//")) {
      searchLine = this.getLine((line ?? loc?.line) - 1);
      column = 0;
    }
    const data = searchLine.DefaultInfoText;
    return `${message}, on file -> ${BasicSettings.fullWebSitePath}${data.info.split("<line>").shift()}:${data.line}:${column}`;
  }
};

// src/static/wasm/component/index.js
import { promises } from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
var loadPath = true ? "/../static/wasm/component/" : "/../";
var wasmModule = new WebAssembly.Module(await promises.readFile(fileURLToPath2(import.meta.url + loadPath + "build.wasm")));
var wasmInstance = new WebAssembly.Instance(wasmModule, {});
var wasm = wasmInstance.exports;
var WASM_VECTOR_LEN = 0;
var cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}
var lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;
var cachedTextEncoder = new lTextEncoder("utf-8");
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
var lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
var cachedTextDecoder = new lTextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function find_end_block(text, block) {
  var ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  var ptr1 = passStringToWasm0(block, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  var ret = wasm.find_end_block(ptr0, len0, ptr1, len1);
  return ret;
}
function find_end_of_def(text, end_type) {
  var ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  var ptr1 = passStringToWasm0(end_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  var ret = wasm.find_end_of_def(ptr0, len0, ptr1, len1);
  return ret;
}
function find_end_of_q(text, q_type) {
  var ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  var ret = wasm.find_end_of_q(ptr0, len0, q_type.codePointAt(0));
  return ret >>> 0;
}

// src/static/wasm/component/Settings.js
var SimpleSkip = ["textarea", "script", "style"];
var SkipSpecialTag = [["%", "%"], ["#{debug}", "{debug}#"]];

// src/CompileCode/BaseReader/Reader.ts
import workerPool from "workerpool";
import { cpus } from "os";
var cpuLength = Math.max(1, Math.floor(cpus().length / 2));
var pool = workerPool.pool(SystemData + "/../static/wasm/component/workerInsertComponent.js", { maxWorkers: cpuLength });
var BaseReader = class {
  static findEntOfQ(text, qType) {
    return find_end_of_q(text, qType);
  }
  static findEndOfDef(text, EndType) {
    if (!Array.isArray(EndType)) {
      EndType = [EndType];
    }
    return find_end_of_def(text, JSON.stringify(EndType));
  }
  static FindEndOfBlock(text, open, end) {
    return find_end_block(text, open + end);
  }
};
var InsertComponentBase = class {
  constructor(printNew) {
    this.printNew = printNew;
    this.SimpleSkip = SimpleSkip;
    this.SkipSpecialTag = SkipSpecialTag;
  }
  printErrors(text, errors) {
    if (!this.printNew)
      return;
    for (const i of JSON.parse(errors).reverse()) {
      this.printNew({
        text: `
Warning, you didn't write right this tag: "${i.type_name}", used in: ${text.at(Number(i.index)).lineInfo}
(the system will auto close it)`,
        errorName: "close-tag"
      });
    }
  }
  async FindCloseChar(text, Search) {
    const [point, errors] = await pool.exec("FindCloseChar", [text.eq, Search]);
    this.printErrors(text, errors);
    return point;
  }
  async FindCloseCharHTML(text, Search) {
    const [point, errors] = await pool.exec("FindCloseCharHTML", [text.eq, Search]);
    this.printErrors(text, errors);
    return point;
  }
};
async function RazorToEJS(text) {
  return JSON.parse(await pool.exec("RazorToEJS", [text]));
}
async function RazorToEJSMini(text, find) {
  return JSON.parse(await pool.exec("RazorToEJSMini", [text, find]));
}
async function EJSParser(text, start, end) {
  return JSON.parse(await pool.exec("EJSParser", [text, start, end]));
}

// src/CompileCode/transform/EasyScript.ts
import workerPool2 from "workerpool";
import { cpus as cpus2 } from "os";
var cpuLength2 = Math.max(1, Math.floor(cpus2().length / 2));
var parse_stream = workerPool2.pool(SystemData + "/../static/wasm/reader/worker.js", { maxWorkers: cpuLength2 });
async function ParseTextStream(text) {
  return JSON.parse(await parse_stream.exec("build_stream", [text]));
}
var BaseEntityCode = class {
  ReplaceAll(text, find, replace) {
    let newText = "";
    for (const i of text.split(find)) {
      newText += replace + i;
    }
    return newText.substring(replace.length);
  }
};
var ReBuildCodeBasic = class extends BaseEntityCode {
  constructor(ParseArray) {
    super();
    this.ParseArray = ParseArray;
  }
  BuildCode() {
    let OutString = "";
    for (const i of this.ParseArray) {
      OutString += i.text;
    }
    return this.ReplaceAll(OutString, "<|-|>", "<||>");
  }
};
var ReBuildCodeString = class extends ReBuildCodeBasic {
  constructor(ParseArray) {
    super(ParseArray);
    this.DataCode = { text: "", inputs: [] };
    this.CreateDataCode();
  }
  get CodeBuildText() {
    return this.DataCode.text;
  }
  set CodeBuildText(value2) {
    this.DataCode.text = value2;
  }
  get AllInputs() {
    return this.DataCode.inputs;
  }
  CreateDataCode() {
    for (const i of this.ParseArray) {
      if (i.is_skip) {
        this.DataCode.text += `<|${this.DataCode.inputs.length}|${i.type_name ?? ""}|>`;
        this.DataCode.inputs.push(i.text);
      } else {
        this.DataCode.text += i.text;
      }
    }
  }
  BuildCode() {
    const newString = this.DataCode.text.replace(/<\|([0-9]+)\|[\w]*\|>/gi, (_, g1) => {
      return this.DataCode.inputs[g1];
    });
    return super.ReplaceAll(newString, "<|-|>", "<||>");
  }
};

// src/CompileCode/JSParser.ts
var JSParser = class {
  constructor(text, path23, start = "<%", end = "%>", type = "script") {
    this.start = start;
    this.text = text;
    this.end = end;
    this.type = type;
    this.path = path23;
  }
  ReplaceValues(find, replace) {
    this.text = this.text.replaceAll(find, replace);
  }
  findEndOfDefGlobal(text) {
    const eq = text.eq;
    const find = BaseReader.findEndOfDef(eq, [";", "\n", this.end]);
    return find != -1 ? find + 1 : eq.length;
  }
  ScriptWithInfo(text) {
    const WithInfo = new StringTracker(text.StartInfo);
    const allScript = text.split("\n"), length = allScript.length;
    WithInfo.Plus("\n");
    let count = 1;
    for (const i of allScript) {
      WithInfo.Plus(new StringTracker(null, `//!${i.lineInfo}
`), i);
      if (count != length) {
        WithInfo.Plus("\n");
        count++;
      }
    }
    return WithInfo;
  }
  async findScripts() {
    const values = await EJSParser(this.text.eq, this.start, this.end);
    this.values = [];
    for (const i of values) {
      let substring = this.text.substring(i.start, i.end);
      let type = i.name;
      switch (i.name) {
        case "print":
          substring = new StringTracker().Plus$`write(${substring});`;
          type = "script";
          break;
        case "escape":
          substring = new StringTracker().Plus$`writeSafe(${substring});`;
          type = "script";
          break;
        case "debug":
          substring = new StringTracker().Plus$`\nrun_script_name = \`${JSParser.fixText(substring)}\`;`;
          type = "no-track";
          break;
      }
      this.values.push({
        text: substring,
        type
      });
    }
  }
  static fixText(text) {
    return text.replace(/\\/gi, "\\\\").replace(/`/gi, "\\`").replace(/\$/gi, "\\u0024");
  }
  static fixTextSimpleQuotes(text) {
    return text.replace(/\\/gi, "\\\\").replace(/"/gi, '\\"');
  }
  ReBuildText() {
    const allcode = new StringTracker(this.values[0]?.text?.StartInfo);
    for (const i of this.values) {
      if (i.type == "text") {
        if (i.text.eq != "") {
          allcode.Plus(i.text);
        }
      } else if (i.type == "no-track") {
        allcode.Plus(this.start, "!", i.text, this.end);
      } else {
        allcode.Plus(this.start, i.text, this.end);
      }
    }
    return allcode;
  }
  BuildAll(isDebug) {
    const runScript = new StringTracker(this.values[0]?.text?.StartInfo);
    if (!this.values.length) {
      return runScript;
    }
    for (const i of this.values) {
      if (i.type == "text") {
        if (i.text.eq != "") {
          runScript.Plus$`\nout_run_script.text+=\`${JSParser.fixText(i.text)}\`;`;
        }
      } else {
        if (isDebug && i.type == "script") {
          runScript.Plus(new StringTracker(null, `
run_script_code=\`${JSParser.fixText(i.text)}\`;`), this.ScriptWithInfo(i.text));
        } else {
          runScript.Plus(i.text);
        }
      }
    }
    return runScript;
  }
  static printError(message) {
    return `<p style="color:red;text-align:left;font-size:16px;">${message}</p>`;
  }
  static async RunAndExport(text, path23, isDebug) {
    const parser = new JSParser(text, path23);
    await parser.findScripts();
    return parser.BuildAll(isDebug);
  }
  static split2FromEnd(text, splitChar, numToSplitFromEnd = 1) {
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] == splitChar) {
        numToSplitFromEnd--;
      }
      if (numToSplitFromEnd == 0) {
        return [text.substring(0, i), text.substring(i + 1)];
      }
    }
    return [text];
  }
  static RestoreTrack(text, defaultInfo) {
    const tracker = new StringTracker(defaultInfo);
    const allLines = text.split("\n//!");
    tracker.Plus(allLines.shift());
    for (const i of allLines) {
      const infoLine = i.split("\n", 1).pop(), dataText = i.substring(infoLine.length);
      const [infoText, numbers2] = JSParser.split2FromEnd(infoLine, ":", 2), [line, char] = numbers2.split(":");
      tracker.Plus(new StringTracker(null, "\n//!" + infoLine));
      tracker.AddTextAfter(dataText, infoText, Number(line) - 1, Number(char));
    }
    return tracker;
  }
};
var EnableGlobalReplace = class {
  constructor(addText = "") {
    this.addText = addText;
    this.savedBuildData = [];
    this.replacer = RegExp(`${addText}\\/\\*!system--<\\|ejs\\|([0-9])\\|>\\*\\/|system--<\\|ejs\\|([0-9])\\|>`);
  }
  async load(code, path23) {
    this.buildCode = new ReBuildCodeString(await ParseTextStream(await this.ExtractAndSaveCode(code)));
    this.path = path23;
  }
  async ExtractAndSaveCode(code) {
    const extractCode = new JSParser(code, this.path);
    await extractCode.findScripts();
    let newText = "";
    let counter = 0;
    for (const i of extractCode.values) {
      if (i.type == "text") {
        newText += i.text;
      } else {
        this.savedBuildData.push({
          type: i.type,
          text: i.text
        });
        newText += `system--<|ejs|${counter++}|>`;
      }
    }
    return newText;
  }
  ParseOutsideOfComment(text) {
    return text.replacer(/system--<\|ejs\|([0-9])\|>/, (SplitToReplace) => {
      const index = SplitToReplace[1];
      return new StringTracker(index.StartInfo).Plus$`${this.addText}/*!system--<|ejs|${index}|>*/`;
    });
  }
  async StartBuild() {
    const extractComments = new JSParser(new StringTracker(null, this.buildCode.CodeBuildText), this.path, "/*", "*/");
    await extractComments.findScripts();
    for (const i of extractComments.values) {
      if (i.type == "text") {
        i.text = this.ParseOutsideOfComment(i.text);
      }
    }
    this.buildCode.CodeBuildText = extractComments.ReBuildText().eq;
    return this.buildCode.BuildCode();
  }
  RestoreAsCode(Data) {
    return new StringTracker(Data.text.StartInfo).Plus$`<%${Data.type == "no-track" ? "!" : ""}${Data.text}%>`;
  }
  RestoreCode(code) {
    return code.replacer(this.replacer, (SplitToReplace) => {
      const index = Number(SplitToReplace[1] ?? SplitToReplace[2]);
      return this.RestoreAsCode(this.savedBuildData[index]);
    });
  }
};

// src/StringMethods/Splitting.ts
function SplitFirst(type, string) {
  const index = string.indexOf(type);
  if (index == -1)
    return [string];
  return [string.substring(0, index), string.substring(index + type.length)];
}
function CutTheLast(type, string) {
  return string.substring(0, string.lastIndexOf(type));
}
function trimType(type, string) {
  while (string.startsWith(type))
    string = string.substring(type.length);
  while (string.endsWith(type))
    string = string.substring(0, string.length - type.length);
  return string;
}

// src/CompileCode/XMLHelpers/CodeInfoAndDebug.ts
async function ParseTextCode(code, path23) {
  const parser = new JSParser(code, path23, "<#{debug}", "{debug}#>", "debug info");
  await parser.findScripts();
  const newCodeString = new StringTracker(code.DefaultInfoText);
  for (const i of parser.values) {
    if (i.type == "text") {
      newCodeString.Plus(i.text);
    } else {
      newCodeString.Plus$`<%{?debug_file?}${i.text}%>`;
    }
  }
  return newCodeString;
}
async function ParseScriptCode(code, path23) {
  const parser = new JSParser(code, path23, "<#{debug}", "{debug}#>", "debug info");
  await parser.findScripts();
  const newCodeString = new StringTracker(code.DefaultInfoText);
  for (const i of parser.values) {
    if (i.type == "text") {
      newCodeString.Plus(i.text);
    } else {
      newCodeString.Plus$`run_script_name=\`${JSParser.fixText(i.text)}\`;`;
    }
  }
  return newCodeString;
}
async function ParseDebugLine(code, path23) {
  const parser = new JSParser(code, path23);
  await parser.findScripts();
  for (const i of parser.values) {
    if (i.type == "text") {
      i.text = await ParseTextCode(i.text, path23);
    } else {
      i.text = await ParseScriptCode(i.text, path23);
    }
  }
  parser.start = "<%";
  parser.end = "%>";
  return parser.ReBuildText();
}
async function NoTrackStringCode(code, path23, isDebug, buildScript) {
  code = await ParseScriptCode(code, path23);
  code = await JSParser.RunAndExport(code, path23, isDebug);
  const NewCode = await buildScript(code);
  const newCodeStringTracker = JSParser.RestoreTrack(NewCode, code.DefaultInfoText);
  newCodeStringTracker.AddTextBeforeNoTrack("<%!{");
  newCodeStringTracker.AddTextAfterNoTrack("}%>");
  return newCodeStringTracker;
}
async function AddDebugInfo(pageName, FullPath2, SmallPath, cache = {}) {
  if (!cache.value)
    cache.value = await EasyFs_default.readFile(FullPath2, "utf8");
  return {
    allData: new StringTracker(`${pageName}<line>${SmallPath}`, cache.value),
    stringInfo: `<%run_script_name=\`${JSParser.fixText(pageName)}\`;%>`
  };
}
function CreateFilePathOnePath(filePath, inputPath, folder, pageType, pathType = 0) {
  if (pageType && !inputPath.endsWith("." + pageType)) {
    inputPath = `${inputPath}.${pageType}`;
  }
  if (inputPath[0] == "^") {
    const [packageName, inPath] = SplitFirst("/", inputPath.substring(1));
    return (pathType == 0 ? workingDirectory : "") + `node_modules/${packageName}/${folder}/${inPath}`;
  }
  if (inputPath[0] == ".") {
    if (inputPath[1] == "/") {
      inputPath = inputPath.substring(2);
    }
    inputPath = `${path3.dirname(filePath)}/${inputPath}`;
  } else if (inputPath[0] == "/") {
    inputPath = `${getTypes.Static[pathType]}${inputPath}`;
  } else {
    inputPath = `${pathType == 0 ? workingDirectory + BasicSettings.WebSiteFolder + "/" : ""}${folder}/${inputPath}`;
  }
  return path3.normalize(inputPath);
}
function CreateFilePath(filePath, smallPath2, inputPath, folder, pageType) {
  return {
    SmallPath: CreateFilePathOnePath(smallPath2, inputPath, folder, pageType, 2),
    FullPath: CreateFilePathOnePath(filePath, inputPath, folder, pageType)
  };
}

// src/BuildInComponents/Components/client.ts
import { minify } from "terser";

// src/OutputInput/PrintNew.ts
var Settings = {
  PreventErrors: []
};
var PreventDoubleLog = [];
var ClearWarning = () => PreventDoubleLog.length = 0;
function PrintIfNew({ id, text, type = "warn", errorName }) {
  if (!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)) {
    print[type](text.replace(/<line>/gi, " -> "), `

Error code: ${errorName}

`);
    PreventDoubleLog.push(id ?? text);
  }
}

// src/BuildInComponents/Components/client.ts
function replaceForClient(BetweenTagData, exportInfo) {
  BetweenTagData = BetweenTagData.replace(`"use strict";Object.defineProperty(exports, "__esModule", {value: true});`, exportInfo);
  return BetweenTagData;
}
var serveScript = "/serv/temp.js";
async function template(BuildScriptWithoutModule, name2, params, selector, mainCode, path23, isDebug) {
  const parse2 = await JSParser.RunAndExport(mainCode, path23, isDebug);
  return `function ${name2}({${params}}, selector = "${selector}", out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${replaceForClient(await BuildScriptWithoutModule(parse2), `var exports = ${name2}.exports;`)}
        return sendToSelector(selector, out_run_script.text);
    }
${name2}.exports = {};`;
}
async function BuildCode(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, BuildScriptWithoutModule, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, path23, LastSmallPath, (x) => x.eq, sessionInfo2);
  sessionInfo2.script(serveScript, { async: null });
  let scriptInfo = await template(BuildScriptWithoutModule, dataTag2.getValue("name"), dataTag2.getValue("params"), dataTag2.getValue("selector"), BetweenTagData, pathName, sessionInfo2.debug && !InsertComponent2.SomePlugins("SafeDebug"));
  const minScript = InsertComponent2.SomePlugins("MinJS") || InsertComponent2.SomePlugins("MinAll");
  if (minScript) {
    try {
      scriptInfo = (await minify(scriptInfo, { module: false, format: { comments: "all" } })).code;
    } catch (err) {
      PrintIfNew({
        errorName: "minify",
        text: BetweenTagData.debugLine(err)
      });
    }
  }
  sessionInfo2.addScriptStylePage("script", dataTag2, type).addText(scriptInfo);
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/script/server.ts
import { transform } from "sucrase";
import { minify as minify2 } from "terser";
var _a;
async function BuildCode2(language, path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2) {
  let result = "", ResCode = BetweenTagData;
  const SaveServerCode = new EnableGlobalReplace("serv");
  await SaveServerCode.load(BetweenTagData, pathName);
  const BetweenTagDataExtracted = await SaveServerCode.StartBuild();
  const AddOptions = __spreadValues({
    transforms: []
  }, InsertComponent2.GetPlugin("transformOptions"));
  try {
    switch (language) {
      case "ts":
        AddOptions.transforms.push("typescript");
        break;
      case "jsx":
        AddOptions.transforms.push("jsx");
        Object.assign(AddOptions, InsertComponent2.GetPlugin("JSXOptions") ?? {});
        break;
      case "tsx":
        AddOptions.transforms.push("typescript");
        AddOptions.transforms.push("jsx");
        Object.assign(AddOptions, InsertComponent2.GetPlugin("TSXOptions") ?? {});
        break;
    }
    result = transform(BetweenTagDataExtracted, AddOptions).code;
    if (InsertComponent2.SomePlugins("Min" + language.toUpperCase()) || InsertComponent2.SomePlugins("MinAll")) {
      try {
        result = (await minify2(result, { module: false, format: { comments: "all" } })).code;
      } catch (err) {
        PrintIfNew({
          errorName: "minify",
          text: BetweenTagData.debugLine(err)
        });
      }
    }
    ResCode = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, result));
  } catch (err) {
    PrintIfNew({
      errorName: "compilation-error",
      text: BetweenTagData.debugLine(err)
    });
  }
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a || (_a = __template(["<script", ">", "<\/script>"])), InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2), ResCode)
  };
}

// src/BuildInComponents/Components/script/client.ts
import { transform as transform2 } from "sucrase";
import { minify as minify3 } from "terser";

// src/BuildInComponents/Components/serv-connect/index.ts
var numbers = ["number", "num", "integer", "int"];
var booleans = ["boolean", "bool"];
var builtInConnection = ["email", "string", "text", ...numbers, ...booleans];
var emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var builtInConnectionRegex = {
  "string-length-range": [
    /^[0-9]+-[0-9]+$/,
    (validator) => validator.split("-").map((x) => Number(x)),
    ([min, max], text) => text.length >= min && text.length <= max,
    "string"
  ],
  "number-range": [
    /^[0-9]+..[0-9]+$/,
    (validator) => validator.split("..").map((x) => Number(x)),
    ([min, max], num) => num >= min && num <= max,
    "number"
  ],
  "multiple-choice-string": [
    /^string|text+[ ]*=>[ ]*(\|?[^|]+)+$/,
    (validator) => validator.split("=>").pop().split("|").map((x) => `"${x.trim().replace(/"/gi, '\\"')}"`),
    (options, text) => options.includes(text),
    "string"
  ],
  "multiple-choice-number": [
    /^number|num|integer|int+[ ]*=>[ ]*(\|?[^|]+)+$/,
    (validator) => validator.split("=>").pop().split("|").map((x) => parseFloat(x)),
    (options, num) => options.includes(num),
    "number"
  ]
};
var builtInConnectionNumbers = [...numbers];
for (const i in builtInConnectionRegex) {
  const type = builtInConnectionRegex[i][3];
  if (builtInConnectionNumbers.includes(type))
    builtInConnectionNumbers.push(i);
}
function compileValues(value2) {
  value2 = value2.toLowerCase().trim();
  if (builtInConnection.includes(value2))
    return `["${value2}"]`;
  for (const [name2, [test, getArgs]] of Object.entries(builtInConnectionRegex))
    if (test.test(value2))
      return `["${name2}", ${getArgs(value2)}]`;
  return `[${value2}]`;
}
async function makeValidationJSON(args, validatorArray) {
  for (const i in validatorArray) {
    const [element, ...elementArgs] = validatorArray[i], value2 = args[i];
    let returnNow = false;
    let isDefault = false;
    switch (element) {
      case "number":
      case "num":
        returnNow = typeof value2 !== "number";
        break;
      case "boolean":
      case "bool":
        returnNow = typeof value2 !== "boolean";
        break;
      case "integer":
      case "int":
        returnNow = !Number.isInteger(value2);
        break;
      case "string":
      case "text":
        returnNow = typeof value2 !== "string";
        break;
      case "email":
        returnNow = !emailValidator.test(value2);
        break;
      default: {
        const haveRegex = value2 != null && builtInConnectionRegex[element];
        if (haveRegex) {
          returnNow = !haveRegex[2](elementArgs, value2);
          break;
        }
        isDefault = true;
        if (element instanceof RegExp)
          returnNow = element.test(value2);
        else if (typeof element == "function")
          returnNow = !await element(value2);
      }
    }
    if (returnNow) {
      let info = `failed at ${i} filed - ${isDefault ? returnNow : "expected " + element}`;
      if (elementArgs.length)
        info += `, arguments: ${JSON.stringify(elementArgs)}`;
      info += `, input: ${JSON.stringify(value2)}`;
      return [info, element, elementArgs, value2];
    }
  }
  return true;
}
function parseValues(args, validatorArray) {
  const parsed = [];
  for (const i in validatorArray) {
    const [element] = validatorArray[i], value2 = args[i];
    if (builtInConnectionNumbers.includes(element))
      parsed.push(parseFloat(value2));
    else if (booleans.includes(element))
      parsed.push(value2 === "true" ? true : false);
    else
      parsed.push(value2);
  }
  return parsed;
}
function parseTagDataStringBoolean(data, find, defaultData = null) {
  const have = data.have(find), value2 = data.remove(find);
  if (have && value2 != "false")
    return value2 || have;
  if (value2 === "false")
    return false;
  if (!have)
    return defaultData;
  return value2;
}

// src/BuildInComponents/Components/script/client.ts
async function BuildCode3(language, tagData, LastSmallPath, BetweenTagData, pathName, InsertComponent2, sessionInfo2) {
  const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.getValue("type") == "module", isModelStringCache = isModel ? "scriptModule" : "script";
  if (sessionInfo2.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo2.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);
  let resultCode = "";
  const AddOptions = __spreadValues({
    transforms: []
  }, InsertComponent2.GetPlugin("transformOptions"));
  try {
    switch (language) {
      case "ts":
        AddOptions.transforms.push("typescript");
        break;
      case "jsx":
        AddOptions.transforms.push("jsx");
        Object.assign(AddOptions, InsertComponent2.GetPlugin("JSXOptions") ?? {});
        break;
      case "tsx":
        AddOptions.transforms.push("typescript");
        AddOptions.transforms.push("jsx");
        Object.assign(AddOptions, InsertComponent2.GetPlugin("TSXOptions") ?? {});
        break;
    }
    resultCode = transform2(BetweenTagData.eq, AddOptions).code;
    if (InsertComponent2.SomePlugins("Min" + language.toUpperCase()) || InsertComponent2.SomePlugins("MinAll")) {
      try {
        resultCode = (await minify3(resultCode, { module: false, format: { comments: "all" } })).code;
      } catch (err) {
        PrintIfNew({
          errorName: "minify",
          text: BetweenTagData.debugLine(err)
        });
      }
    }
  } catch (err) {
    PrintIfNew({
      errorName: "compilation-error",
      text: BetweenTagData.debugLine(err)
    });
  }
  const pushStyle = sessionInfo2.addScriptStyle(isModel ? "module" : "script", parseTagDataStringBoolean(tagData, "page") ? LastSmallPath : BetweenTagData.extractInfo());
  pushStyle.addStringTracker(BetweenTagData, { text: resultCode });
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/script/index.ts
var _a2;
async function BuildCode4(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, buildScript, sessionInfo2) {
  if (dataTag2.have("src"))
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a2 || (_a2 = __template(["<script", ">", "<\/script>"])), InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2), BetweenTagData)
    };
  const language = dataTag2.remove("lang") || "js";
  if (dataTag2.have("server")) {
    dataTag2.remove("server");
    return BuildCode2(language, path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2);
  }
  return BuildCode3(language, dataTag2, LastSmallPath, BetweenTagData, pathName, InsertComponent2, sessionInfo2);
}

// src/BuildInComponents/Components/style/sass.ts
import { fileURLToPath as fileURLToPath3, pathToFileURL } from "url";
import sass from "sass";
function createImporter(originalPath) {
  return {
    findFileUrl(url) {
      if (url[0] == "/" || url[0] == "~") {
        return new URL(url.substring(1), pathToFileURL(url[0] == "/" ? getTypes.Static[0] : getTypes.node_modules[0]));
      }
      return new URL(url, pathToFileURL(originalPath));
    }
  };
}
function minifyPluginSass(language, SomePlugins2) {
  return ["scss", "sass"].includes(language) ? SomePlugins2("MinAll", "MinSass") : SomePlugins2("MinCss", "MinAll");
}
function sassStyle(language, SomePlugins2) {
  return minifyPluginSass(language, SomePlugins2) ? "compressed" : "expanded";
}
function sassSyntax(language) {
  return language == "sass" ? "indented" : language;
}
function sassAndSource(sourceMap, source) {
  if (!sourceMap)
    return;
  for (const i in sourceMap.sources) {
    if (sourceMap.sources[i].startsWith("data:")) {
      sourceMap.sources[i] = source;
    }
  }
}
async function compileSass(language, BetweenTagData, InsertComponent2, sessionInfo2, outStyle = BetweenTagData.eq) {
  const thisPage = BasicSettings.fullWebSitePath + BetweenTagData.extractInfo(), thisPageURL = pathToFileURL(thisPage), compressed = minifyPluginSass(language, InsertComponent2.SomePlugins);
  let result;
  try {
    result = await sass.compileStringAsync(outStyle, {
      sourceMap: sessionInfo2.debug,
      syntax: sassSyntax(language),
      style: compressed ? "compressed" : "expanded",
      importer: createImporter(thisPage),
      logger: sass.Logger.silent
    });
    outStyle = result?.css ?? outStyle;
  } catch (expression) {
    PrintIfNew({
      text: BetweenTagData.debugLine(expression),
      errorName: expression?.status == 5 ? "sass-warning" : "sass-error",
      type: expression?.status == 5 ? "warn" : "error"
    });
  }
  if (result?.loadedUrls) {
    for (const file of result.loadedUrls) {
      const FullPath2 = fileURLToPath3(file);
      await sessionInfo2.dependence(BasicSettings.relative(FullPath2), FullPath2);
    }
  }
  sassAndSource(result.sourceMap, thisPageURL.href);
  return { result, outStyle, compressed };
}

// src/BuildInComponents/Components/style/server.ts
async function BuildCode5(language, path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const SaveServerCode = new EnableGlobalReplace();
  await SaveServerCode.load(BetweenTagData.trimStart(), pathName);
  let { outStyle, compressed } = await compileSass(language, BetweenTagData, InsertComponent2, sessionInfo2, await SaveServerCode.StartBuild());
  if (!compressed)
    outStyle = `
${outStyle}
`;
  const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>${reStoreData}</style>`
  };
}

// src/EasyDebug/SourceMapStore.ts
import { SourceMapGenerator, SourceMapConsumer } from "source-map-js";
import path4 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
var SourceMapBasic = class {
  constructor(filePath, httpSource = true, isCss = false) {
    this.filePath = filePath;
    this.httpSource = httpSource;
    this.isCss = isCss;
    this.lineCount = 0;
    this.map = new SourceMapGenerator({
      file: filePath.split(/\/|\\/).pop()
    });
    if (!httpSource)
      this.fileDirName = path4.dirname(this.filePath);
  }
  getSource(source) {
    source = source.split("<line>").pop().trim();
    if (this.httpSource) {
      if (BasicSettings.pageTypesArray.includes(path4.extname(source).substring(1)))
        source += ".source";
      else
        source = SplitFirst("/", source).pop() + "?source=true";
      return path4.join("/", source.replace(/\\/gi, "/"));
    }
    return path4.relative(this.fileDirName, BasicSettings.fullWebSitePath + source);
  }
  mapAsURLComment() {
    let mapString = `sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(this.map.toString()).toString("base64")}`;
    if (this.isCss)
      mapString = `/*# ${mapString}*/`;
    else
      mapString = "//# " + mapString;
    return "\r\n" + mapString;
  }
};
var SourceMapStore = class extends SourceMapBasic {
  constructor(filePath, debug = true, isCss = false, httpSource = true) {
    super(filePath, httpSource, isCss);
    this.debug = debug;
    this.storeString = "";
    this.actionLoad = [];
  }
  notEmpty() {
    return this.actionLoad.length > 0;
  }
  addStringTracker(track, { text = track.eq } = {}) {
    this.actionLoad.push({ name: "addStringTracker", data: [track, { text }] });
  }
  _addStringTracker(track, { text = track.eq } = {}) {
    if (!this.debug)
      return this._addText(text);
    const DataArray = track.getDataArray(), length = DataArray.length;
    let waitNextLine = false;
    for (let index = 0; index < length; index++) {
      const { text: text2, line, info } = DataArray[index];
      if (text2 == "\n") {
        this.lineCount++;
        waitNextLine = false;
        continue;
      }
      if (!waitNextLine && line && info) {
        waitNextLine = true;
        this.map.addMapping({
          original: { line, column: 0 },
          generated: { line: this.lineCount, column: 0 },
          source: this.getSource(info)
        });
      }
    }
    this.storeString += text;
  }
  addText(text) {
    this.actionLoad.push({ name: "addText", data: [text] });
  }
  _addText(text) {
    if (this.debug)
      this.lineCount += text.split("\n").length - 1;
    this.storeString += text;
  }
  static fixURLSourceMap(map) {
    for (let i = 0; i < map.sources.length; i++) {
      map.sources[i] = BasicSettings.relative(fileURLToPath4(map.sources[i]));
    }
    return map;
  }
  async addSourceMapWithStringTracker(fromMap, track, text) {
    this.actionLoad.push({ name: "addSourceMapWithStringTracker", data: [fromMap, track, text] });
  }
  async _addSourceMapWithStringTracker(fromMap, track, text) {
    if (!this.debug)
      return this._addText(text);
    new SourceMapConsumer(fromMap).eachMapping((m) => {
      const dataInfo = track.getLine(m.originalLine).getDataArray()[0];
      if (m.source == this.filePath)
        this.map.addMapping({
          source: this.getSource(m.source),
          original: { line: dataInfo.line, column: m.originalColumn },
          generated: { line: m.generatedLine + this.lineCount, column: m.generatedColumn }
        });
      else
        this.map.addMapping({
          source: this.getSource(m.source),
          original: { line: m.originalLine, column: m.originalColumn },
          generated: { line: m.generatedLine, column: m.generatedColumn }
        });
    });
    this._addText(text);
  }
  buildAll() {
    for (const { name: name2, data } of this.actionLoad) {
      switch (name2) {
        case "addStringTracker":
          this._addStringTracker(...data);
          break;
        case "addText":
          this._addText(...data);
          break;
        case "addSourceMapWithStringTracker":
          this._addSourceMapWithStringTracker(...data);
          break;
      }
    }
  }
  mapAsURLComment() {
    this.buildAll();
    return super.mapAsURLComment();
  }
  createDataWithMap() {
    this.buildAll();
    if (!this.debug)
      return this.storeString;
    return this.storeString + super.mapAsURLComment();
  }
  clone() {
    const copy = new SourceMapStore(this.filePath, this.debug, this.isCss, this.httpSource);
    copy.actionLoad.push(...this.actionLoad);
    return copy;
  }
};

// src/BuildInComponents/Components/style/client.ts
async function BuildCode6(language, path23, pathName, LastSmallPath, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const outStyleAsTrim = BetweenTagData.eq.trim();
  if (sessionInfo2.cache.style.includes(outStyleAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo2.cache.style.push(outStyleAsTrim);
  const { result, outStyle } = await compileSass(language, BetweenTagData, InsertComponent2, sessionInfo2);
  const pushStyle = sessionInfo2.addScriptStyle("style", parseTagDataStringBoolean(dataTag2, "page") ? LastSmallPath : BetweenTagData.extractInfo());
  if (result?.sourceMap)
    pushStyle.addSourceMapWithStringTracker(SourceMapStore.fixURLSourceMap(result.sourceMap), BetweenTagData, outStyle);
  else
    pushStyle.addStringTracker(BetweenTagData, { text: outStyle });
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/style/index.ts
async function BuildCode7(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const language = dataTag2.remove("lang") || "css";
  if (dataTag2.have("server")) {
    dataTag2.remove("server");
    return BuildCode5(language, path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
  }
  return BuildCode6(language, path23, pathName, LastSmallPath, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
}

// src/BuildInComponents/Components/page.ts
import path_node from "path";

// src/OutputInput/StoreJSON.ts
var StoreJSON = class {
  constructor(filePath, autoLoad = true) {
    this.store = {};
    this.savePath = `${SystemData}/${filePath}.json`;
    autoLoad && this.loadFile();
    process.on("SIGINT", () => {
      this.save();
      setTimeout(() => process.exit);
    });
    process.on("exit", this.save.bind(this));
  }
  async loadFile() {
    if (await EasyFs_default.existsFile(this.savePath))
      this.store = JSON.parse(await EasyFs_default.readFile(this.savePath) || "{}");
  }
  update(key, value2) {
    this.store[key] = value2;
  }
  have(key, create) {
    let item = this.store[key];
    if (item || !create)
      return item;
    item = create();
    this.update(key, item);
    return item;
  }
  clear() {
    for (const i in this.store) {
      this.store[i] = void 0;
      delete this.store[i];
    }
  }
  save() {
    return EasyFs_default.writeJsonFile(this.savePath, this.store);
  }
};

// src/OutputInput/StoreDeps.ts
var pageDeps = new StoreJSON("PagesInfo");
async function CheckDependencyChange(path23, dependencies = pageDeps.store[path23]) {
  for (const i in dependencies) {
    let p = i;
    if (i == "thisPage") {
      p = path23 + "." + BasicSettings.pageTypes.page;
    }
    const FilePath = BasicSettings.fullWebSitePath + p;
    if (await EasyFs_default.stat(FilePath, "mtimeMs", true) != dependencies[i]) {
      return true;
    }
  }
  return !dependencies;
}

// src/BuildInComponents/Components/page.ts
function InFolderPagePath(inputPath, fullPath) {
  if (inputPath[0] == ".") {
    if (inputPath[1] == "/") {
      inputPath = inputPath.substring(2);
    } else {
      inputPath = inputPath.substring(1);
    }
    let folder = path_node.dirname(fullPath).substring(getTypes.Static[0].length);
    if (folder) {
      folder += "/";
    }
    inputPath = folder + inputPath;
  } else if (inputPath[0] == "/") {
    inputPath = inputPath.substring(1);
  }
  const pageType = "." + BasicSettings.pageTypes.page;
  if (!inputPath.endsWith(pageType)) {
    inputPath += pageType;
  }
  return inputPath;
}
var cacheMap = {};
async function BuildCode8(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const filepath = dataTag2.getValue("from");
  const SmallPathWithoutFolder = InFolderPagePath(filepath, path23);
  const FullPath2 = getTypes.Static[0] + SmallPathWithoutFolder, SmallPath = getTypes.Static[2] + "/" + SmallPathWithoutFolder;
  if (!(await EasyFs_default.stat(FullPath2, null, true)).isFile?.()) {
    PrintIfNew({
      text: `
Page not found: ${type.at(0).lineInfo} -> ${FullPath2}`,
      errorName: "page-not-found",
      type: "error"
    });
    return {
      compiledString: new StringTracker(type.DefaultInfoText, `<p style="color:red;text-align:left;font-size:16px;">Page not found: ${type.lineInfo} -> ${SmallPath}</p>`)
    };
  }
  let ReturnData;
  const haveCache = cacheMap[SmallPathWithoutFolder];
  if (!haveCache || await CheckDependencyChange(null, haveCache.newSession.dependencies)) {
    const { CompiledData, sessionInfo: newSession } = await FastCompileInFile(SmallPathWithoutFolder, getTypes.Static, null, pathName, dataTag2.remove("object"));
    newSession.dependencies[SmallPath] = newSession.dependencies.thisPage;
    delete newSession.dependencies.thisPage;
    sessionInfo2.extends(newSession);
    cacheMap[SmallPathWithoutFolder] = { CompiledData, newSession };
    ReturnData = CompiledData;
  } else {
    const { CompiledData, newSession } = cacheMap[SmallPathWithoutFolder];
    Object.assign(sessionInfo2.dependencies, newSession.dependencies);
    sessionInfo2.extends(newSession);
    ReturnData = CompiledData;
  }
  return {
    compiledString: ReturnData
  };
}

// src/BuildInComponents/Components/isolate.ts
async function isolate(BetweenTagData) {
  const compiledString = new StringTracker(BetweenTagData.StartInfo);
  compiledString.Plus$`<%{%>${BetweenTagData}<%}%>`;
  return {
    compiledString,
    checkComponents: true
  };
}

// src/BuildInComponents/Components/svelte.ts
import { relative } from "path";

// src/StringMethods/Id.ts
function createId(text, max = 10) {
  return Buffer.from(text).toString("base64").substring(0, max).replace(/\+/, "_").replace(/\//, "_");
}

// src/BuildInComponents/Components/svelte.ts
import path7 from "path";

// src/ImportFiles/ForStatic/Svelte.ts
import { transform as transform3 } from "sucrase";
import { minify as minify4 } from "terser";
import * as svelte from "svelte/compiler";
import { extname } from "path";
import sass2 from "sass";
import { v4 as uuid } from "uuid";
import path5 from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
async function preprocess2(fullPath, smallPath2, dependenceObject = {}, makeAbsolute, svelteExt = "") {
  const content = await EasyFs_default.readFile(fullPath);
  const addStyle = [];
  const { code, dependencies, map } = await svelte.preprocess(content, {
    async style({ content: content2, attributes, filename }) {
      try {
        const { css, loadedUrls } = await sass2.compileStringAsync(content2, {
          syntax: sassSyntax(attributes.lang),
          style: sassStyle(attributes.lang, SomePlugins),
          importer: createImporter(fullPath),
          logger: sass2.Logger.silent
        });
        return {
          code: css,
          dependencies: loadedUrls.map((x) => fileURLToPath5(x))
        };
      } catch (err) {
        PrintIfNew({
          text: `${err.message}, on file -> ${fullPath}${err.line ? ":" + err.line : ""}`,
          errorName: err?.status == 5 ? "sass-warning" : "sass-error",
          type: err?.status == 5 ? "warn" : "error"
        });
      }
      return {
        code: ""
      };
    },
    async script({ content: content2, attributes }) {
      const mapToken = {};
      content2 = content2.replace(/((import({|[ ]*\(?)|((import|export)({|[ ]+)[\W\w]+?(}|[ ]+)from))(}|[ ]*))(["|'|`])([\W\w]+?)\9([ ]*\)?)/gmi, (substring, ...args) => {
        const ext = extname(args[9]);
        if (ext == ".svelte")
          addStyle.push(args[9]);
        else if (ext == "")
          if (attributes.lang == "ts")
            args[9] += ".ts";
          else
            args[9] += ".js";
        const newData = args[0] + args[8] + (makeAbsolute ? makeAbsolute(args[9]) : args[9]) + (ext == ".svelte" ? svelteExt : "") + args[8] + (args[10] ?? "");
        if (attributes.lang !== "ts")
          return newData;
        const id = uuid();
        mapToken[id] = newData;
        return newData + `/*uuid-${id}*/`;
      });
      if (attributes.lang !== "ts")
        return {
          code: content2,
          dependencies: []
        };
      let tokenCode;
      try {
        tokenCode = transform3(content2, __spreadProps(__spreadValues({}, GetPlugin("transformOptions")), { transforms: ["typescript"] })).code;
      } catch (err) {
        PrintIfNew({
          errorName: "compilation-error",
          text: `${err.message}, on file -> ${fullPath}:${err?.loc?.line ?? 0}:${err?.loc?.column ?? 0}`
        });
        return {
          code: ""
        };
      }
      tokenCode = tokenCode.replace(/\/\*uuid-([\w\W]+?)\*\//gmi, (substring, ...args) => {
        const data = mapToken[args[0]] ?? "";
        return tokenCode.includes(data) ? "" : data;
      });
      return {
        code: tokenCode,
        dependencies: []
      };
    }
  });
  dependencies.push(getTypes.Static[0] + path5.relative(getTypes.Static[2], smallPath2));
  for (const i of dependencies) {
    dependenceObject[BasicSettings.relative(i)] = await EasyFs_default.stat(i, "mtimeMs");
  }
  let fullCode = code;
  if (addStyle.length) {
    let styleCode = addStyle.map((x) => `@import "${x}.css";`).join("");
    const { code: code2 } = await svelte.preprocess(fullCode, {
      style({ content: content2 }) {
        const res = {
          code: styleCode + content2,
          dependencies: []
        };
        styleCode = "";
        return res;
      }
    });
    fullCode = code2;
    if (styleCode)
      fullCode += `<style>${styleCode}</style>`;
  }
  return { code: fullCode, dependenceObject, map };
}
function capitalize(name2) {
  return name2[0].toUpperCase() + name2.slice(1);
}
async function registerExtension(filePath, smallPath2, dependenceObject, isDebug) {
  const name2 = path5.parse(filePath).name.replace(/^\d/, "_$&").replace(/[^a-zA-Z0-9_$]/g, "");
  const options = {
    filename: filePath,
    name: capitalize(name2),
    generate: "ssr",
    format: "cjs",
    dev: isDebug
  };
  const waitForBuild = [];
  function makeReal(inStatic) {
    waitForBuild.push(registerExtension(getTypes.Static[0] + inStatic, getTypes.Static[2] + "/" + inStatic, dependenceObject, isDebug));
  }
  const inStaticFile = path5.relative(getTypes.Static[2], smallPath2), inStaticBasePath = inStaticFile + "/..", fullCompilePath = getTypes.Static[1] + inStaticFile;
  const context = await preprocess2(filePath, smallPath2, dependenceObject, (importPath) => {
    const inStatic = path5.relative(inStaticBasePath, importPath);
    makeReal(inStatic);
    return "./" + inStatic.replace(/\\/gi, "/");
  }, ".ssr.cjs");
  await Promise.all(waitForBuild);
  const { js, css, warnings } = svelte.compile(context.code, options);
  if (isDebug) {
    warnings.forEach((warning) => {
      PrintIfNew({
        errorName: warning.code,
        type: "warn",
        text: warning.message + "\n" + warning.frame
      });
    });
  }
  const fullImportPath = fullCompilePath + ".ssr.cjs";
  await EasyFs_default.writeFile(fullImportPath, js.code);
  if (css.code) {
    css.map.sources[0] = "/" + inStaticFile.split(/\/|\//).pop() + "?source=true";
    css.code += "\n/*# sourceMappingURL=" + css.map.toUrl() + "*/";
  }
  await EasyFs_default.writeFile(fullCompilePath + ".css", css.code ?? "");
  return fullImportPath;
}
async function BuildScript(inputPath, isDebug) {
  const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
  const { code, dependenceObject, map } = await preprocess2(fullPath, getTypes.Static[2] + "/" + inputPath);
  const { js, css } = svelte.compile(code, {
    filename: fullPath,
    dev: isDebug,
    sourcemap: map,
    css: false,
    hydratable: true,
    sveltePath: "/serv/svelte"
  });
  if (SomePlugins("MinJS") || SomePlugins("MinAll")) {
    try {
      js.code = (await minify4(js.code, { module: false })).code;
    } catch (err) {
      PrintIfNew({
        errorName: "minify",
        text: `${err.message} on file -> ${fullPath}`
      });
    }
  }
  if (isDebug) {
    js.map.sources[0] = fullPath.split(/\/|\//).pop() + "?source=true";
    js.code += "\n//# sourceMappingURL=" + js.map.toUrl();
    if (css.code) {
      css.map.sources[0] = js.map.sources[0];
      css.code += "\n/*# sourceMappingURL=" + css.map.toUrl() + "*/";
    }
  }
  await EasyFs_default.makePathReal(inputPath, getTypes.Static[1]);
  await EasyFs_default.writeFile(fullCompilePath + ".js", js.code);
  await EasyFs_default.writeFile(fullCompilePath + ".css", css.code ?? "");
  return __spreadProps(__spreadValues({}, dependenceObject), {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  });
}

// src/ImportFiles/redirectCJS.ts
import { createRequire } from "module";
import clearModule from "clear-module";
import path6 from "path";
var require2 = createRequire(import.meta.url);
var resolve = (path23) => require2.resolve(path23);
function redirectCJS_default(filePath) {
  filePath = path6.normalize(filePath);
  const module2 = require2(filePath);
  clearModule(filePath);
  return module2;
}

// src/BuildInComponents/Components/svelte.ts
async function ssrHTML(dataTag, FullPath, smallPath, sessionInfo) {
  const getV = (name) => {
    const gv = (name2) => dataTag.getValue(name2).trim(), value = gv("ssr" + capitalize(name)) || gv(name);
    return value ? eval(`(${value.charAt(0) == "{" ? value : `{${value}}`})`) : {};
  };
  const newDeps = {};
  const buildPath = await registerExtension(FullPath, smallPath, newDeps, sessionInfo.debug);
  Object.assign(sessionInfo.dependencies, newDeps);
  const mode = await redirectCJS_default(buildPath);
  for (const i in newDeps) {
    if (["sass", "scss", "css"].includes(path7.extname(i).substring(1)))
      continue;
    clearModule(resolve(getTypes.Static[1] + i.substring(getTypes.Static[2].length + 1) + ".ssr.cjs"));
  }
  const { html, head } = mode.default.render(getV("props"), getV("options"));
  sessionInfo.headHTML += head;
  return html;
}
async function BuildCode9(path23, LastSmallPath, type, dataTag2, sessionInfo2) {
  const { SmallPath, FullPath: FullPath2 } = CreateFilePath(path23, LastSmallPath, dataTag2.remove("from"), getTypes.Static[2], "svelte");
  const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, "/");
  sessionInfo2.style("/" + inWebPath + ".css");
  const id = dataTag2.remove("id") || createId(inWebPath), have = (name2) => {
    const value2 = dataTag2.getValue(name2).trim();
    return value2 ? `,${name2}:${value2.charAt(0) == "{" ? value2 : `{${value2}}`}` : "";
  }, selector = dataTag2.remove("selector");
  const ssr = !selector && dataTag2.have("ssr") ? await ssrHTML(dataTag2, FullPath2, SmallPath, sessionInfo2) : "";
  sessionInfo2.addScriptStyle("module", parseTagDataStringBoolean(dataTag2, "page") ? LastSmallPath : type.extractInfo()).addText(`import App${id} from '/${inWebPath}';
const target${id} = document.querySelector("${selector ? selector : "#" + id}");
target${id} && new App${id}({
    target: target${id}
    ${have("props") + have("options")}${ssr ? ", hydrate: true" : ""}
});`);
  return {
    compiledString: new StringTracker(null, selector ? "" : `<div id="${id}">${ssr}</div>`),
    checkComponents: true
  };
}

// src/BuildInComponents/Components/markdown.ts
import markdown from "markdown-it";
import hljs from "highlight.js";
import path8 from "path";
import anchor from "markdown-it-anchor";
import slugify from "@sindresorhus/slugify";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAbbr from "markdown-it-abbr";
function codeWithCopy(md) {
  function renderCode(origRule) {
    return (...args) => {
      const origRendered = origRule(...args);
      return `<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">copy</a>
                </div>
                ${origRendered}
            </div>`;
    };
  }
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block);
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence);
}
async function BuildCode10(type, dataTag2, BetweenTagData, InsertComponent2, session2) {
  const markDownPlugin = InsertComponent2.GetPlugin("markdown");
  const hljsClass = parseTagDataStringBoolean(dataTag2, "hljs-class", markDownPlugin?.hljsClass ?? true) ? ' class="hljs"' : "";
  let haveHighlight = false;
  const md = markdown({
    html: true,
    xhtmlOut: true,
    linkify: Boolean(parseTagDataStringBoolean(dataTag2, "linkify", markDownPlugin?.linkify)),
    breaks: Boolean(parseTagDataStringBoolean(dataTag2, "breaks", markDownPlugin?.breaks ?? true)),
    typographer: Boolean(parseTagDataStringBoolean(dataTag2, "typographer", markDownPlugin?.typographer ?? true)),
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        haveHighlight = true;
        try {
          return `<pre${hljsClass}><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
        } catch (err) {
          PrintIfNew({
            text: err,
            type: "error",
            errorName: "markdown-parser"
          });
        }
      }
      return `<pre${hljsClass}><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  });
  if (parseTagDataStringBoolean(dataTag2, "copy-code", markDownPlugin?.copyCode ?? true))
    md.use(codeWithCopy);
  if (parseTagDataStringBoolean(dataTag2, "header-link", markDownPlugin?.headerLink ?? true))
    md.use(anchor, {
      slugify: (s) => slugify(s),
      permalink: anchor.permalink.headerLink()
    });
  if (parseTagDataStringBoolean(dataTag2, "attrs", markDownPlugin?.attrs ?? true))
    md.use(markdownItAttrs);
  if (parseTagDataStringBoolean(dataTag2, "abbr", markDownPlugin?.abbr ?? true))
    md.use(markdownItAbbr);
  let markdownCode = BetweenTagData?.eq;
  if (!markdownCode) {
    let filePath = path8.join(path8.dirname(type.extractInfo("<line>")), dataTag2.remove("file"));
    if (!path8.extname(filePath))
      filePath += ".serv.md";
    const fullPath = path8.join(BasicSettings.fullWebSitePath, filePath);
    markdownCode = await EasyFs_default.readFile(fullPath);
    await session2.dependence(filePath, fullPath);
  }
  const renderHTML = md.render(markdownCode), buildHTML = new StringTracker(type.DefaultInfoText);
  const theme = await createAutoTheme(dataTag2.remove("code-theme") || markDownPlugin?.codeTheme || "atom-one");
  if (haveHighlight) {
    const cssLink2 = "/serv/md/code-theme/" + theme + ".css";
    session2.style(cssLink2);
  }
  dataTag2.addClass("markdown-body");
  const style = parseTagDataStringBoolean(dataTag2, "theme", markDownPlugin?.theme ?? "auto");
  const cssLink = "/serv/md/theme/" + style + ".css";
  style != "none" && session2.style(cssLink);
  if (dataTag2.length)
    buildHTML.Plus$`<div${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>${renderHTML}</div>`;
  else
    buildHTML.AddTextAfter(renderHTML);
  return {
    compiledString: buildHTML,
    checkComponents: false
  };
}
var themePath = workingDirectory + "node_modules/github-markdown-css/github-markdown";
function splitStart(text1, text2) {
  const [before, after, last] = text1.split(/(}|\*\/).hljs{/);
  const addBefore = text1[before.length] == "}" ? "}" : "*/";
  return [before + addBefore, ".hljs{" + (last ?? after), ".hljs{" + text2.split(/(}|\*\/).hljs{/).pop()];
}
var codeThemePath = workingDirectory + "node_modules/highlight.js/styles/";
async function createAutoTheme(theme) {
  const darkLightSplit = theme.split("|");
  if (darkLightSplit.length == 1)
    return theme;
  const name2 = darkLightSplit[2] || darkLightSplit.slice(0, 2).join("~").replace("/", "-");
  if (await EasyFs_default.existsFile(codeThemePath + name2 + ".css"))
    return name2;
  const lightText = await EasyFs_default.readFile(codeThemePath + darkLightSplit[0] + ".css");
  const darkText = await EasyFs_default.readFile(codeThemePath + darkLightSplit[1] + ".css");
  const [start, dark, light] = splitStart(darkText, lightText);
  const darkLight = `${start}@media(prefers-color-scheme:dark){${dark}}@media(prefers-color-scheme:light){${light}}`;
  await EasyFs_default.writeFile(codeThemePath + name2 + ".css", darkLight);
  return name2;
}

// src/BuildInComponents/Components/head.ts
async function BuildCode11(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, buildScript, sessionInfo2) {
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, path23, LastSmallPath, buildScript, sessionInfo2)}@DefaultInsertBundle</head>`,
    checkComponents: false
  };
}
async function addFinalizeBuild(pageData, sessionInfo2, fullCompilePath) {
  const buildBundleString = sessionInfo2.buildHead();
  const bundlePlaceholder = [/@InsertBundle(;?)/, /@DefaultInsertBundle(;?)/];
  const removeBundle = () => {
    bundlePlaceholder.forEach((x) => pageData = pageData.replace(x, ""));
    return pageData;
  };
  if (!buildBundleString)
    return removeBundle();
  const replaceWith = new StringTracker(null, buildBundleString);
  let bundleSucceed = false;
  for (let i = 0; i < bundlePlaceholder.length && !bundleSucceed; i++)
    pageData = pageData.replacer(bundlePlaceholder[i], () => (bundleSucceed = true) && replaceWith);
  if (bundleSucceed)
    return removeBundle();
  return pageData.Plus$`\nout_run_script.text+='${replaceWith}';`;
}

// src/BuildInComponents/Components/connect.ts
var serveScript2 = "/serv/connect.js";
function template2(name2) {
  return `function ${name2}(...args){return connector("${name2}", args)}`;
}
async function BuildCode12(LastSmallPath, type, dataTag2, BetweenTagData, { SomePlugins: SomePlugins2 }, sessionInfo2) {
  const name2 = dataTag2.getValue("name"), sendTo = dataTag2.getValue("sendTo"), validator = dataTag2.getValue("validate"), notValid = dataTag2.remove("notValid");
  let message = parseTagDataStringBoolean(dataTag2, "message");
  if (message === null)
    message = sessionInfo2.debug && !SomePlugins2("SafeDebug");
  sessionInfo2.script(serveScript2, { async: null });
  sessionInfo2.addScriptStyle("script", parseTagDataStringBoolean(dataTag2, "page") ? LastSmallPath : type.extractInfo()).addText(template2(name2));
  sessionInfo2.connectorArray.push({
    type: "connect",
    name: name2,
    sendTo,
    message,
    notValid,
    validator: validator && validator.split(",").map((x) => x.trim())
  });
  return {
    compiledString: BetweenTagData,
    checkComponents: true
  };
}
function addFinalizeBuild2(pageData, sessionInfo2) {
  if (!sessionInfo2.connectorArray.length)
    return pageData;
  let buildObject2 = "";
  for (const i of sessionInfo2.connectorArray) {
    if (i.type != "connect")
      continue;
    buildObject2 += `,
        {
            name:"${i.name}",
            sendTo:${i.sendTo},
            notValid: ${i.notValid || "null"},
            message:${typeof i.message == "string" ? `"${i.message}"` : i.message},
            validator:[${i.validator && i.validator.map(compileValues).join(",") || ""}]
        }`;
  }
  buildObject2 = `[${buildObject2.substring(1)}]`;
  const addScript = `
        if(Post?.connectorCall){
            if(await handelConnector("connect", page, ${buildObject2})){
                return;
            }
        }`;
  if (pageData.includes("@ConnectHere"))
    pageData = pageData.replacer(/@ConnectHere(;?)/, () => new StringTracker(null, addScript));
  else
    pageData.AddTextAfterNoTrack(addScript);
  return pageData;
}
async function handelConnector(thisPage, connectorArray) {
  if (!thisPage.Post?.connectorCall)
    return false;
  const have = connectorArray.find((x) => x.name == thisPage.Post.connectorCall.name);
  if (!have)
    return false;
  const values = thisPage.Post.connectorCall.values;
  const isValid = have.validator.length && await makeValidationJSON(values, have.validator);
  thisPage.setResponse("");
  const betterJSON = (obj) => {
    thisPage.Response.setHeader("Content-Type", "application/json");
    thisPage.Response.end(JSON.stringify(obj));
  };
  if (!have.validator.length || isValid === true)
    betterJSON(await have.sendTo(...values));
  else if (have.notValid)
    betterJSON(await have.notValid(...isValid));
  else if (have.message)
    betterJSON({
      error: typeof have.message == "string" ? have.message : isValid.shift()
    });
  else
    thisPage.Response.status(400);
  return true;
}

// src/BuildInComponents/Components/form.ts
import { v4 as uuid2 } from "uuid";
async function BuildCode13(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, buildScript, sessionInfo2) {
  const sendTo = dataTag2.remove("sendTo").trim();
  if (!sendTo)
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$`<form${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, path23, LastSmallPath, buildScript, sessionInfo2)}</form>`,
      checkComponents: false
    };
  const name2 = dataTag2.remove("name").trim() || uuid2(), validator = dataTag2.remove("validate"), orderDefault = dataTag2.remove("order"), notValid = dataTag2.remove("notValid"), responseSafe = dataTag2.have("safe");
  let message = parseTagDataStringBoolean(dataTag2, "message");
  if (message === null)
    message = sessionInfo2.debug && !InsertComponent2.SomePlugins("SafeDebug");
  let order = [];
  const validatorArray = validator && validator.split(",").map((x) => {
    const split = SplitFirst(":", x.trim());
    if (split.length > 1)
      order.push(split.shift());
    return split.pop();
  });
  if (orderDefault)
    order = orderDefault.split(",").map((x) => x.trim());
  sessionInfo2.connectorArray.push({
    type: "form",
    name: name2,
    sendTo,
    validator: validatorArray,
    order: order.length && order,
    notValid,
    message,
    responseSafe
  });
  if (!dataTag2.have("method")) {
    dataTag2.push({
      n: new StringTracker(null, "method"),
      v: new StringTracker(null, "post")
    });
  }
  const compiledString = new StringTracker(type.DefaultInfoText).Plus$`<%!
@?ConnectHereForm(${sendTo});
%><form${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>
    <input type="hidden" name="connectorFormCall" value="${name2}"/>${await InsertComponent2.StartReplace(BetweenTagData, pathName, path23, LastSmallPath, buildScript, sessionInfo2)}</form>`;
  return {
    compiledString,
    checkComponents: false
  };
}
function addFinalizeBuild3(pageData, sessionInfo2) {
  if (!sessionInfo2.connectorArray.length)
    return pageData;
  for (const i of sessionInfo2.connectorArray) {
    if (i.type != "form")
      continue;
    const sendToUnicode = new StringTracker(null, i.sendTo).unicode.eq;
    const connect = new RegExp(`@ConnectHereForm\\([ ]*${sendToUnicode}[ ]*\\)(;?)`), connectDefault = new RegExp(`@\\?ConnectHereForm\\([ ]*${sendToUnicode}[ ]*\\)(;?)`);
    let counter = 0;
    const scriptData = (data) => {
      counter++;
      return new StringTracker(data[0].StartInfo).Plus$`
                if(Post?.connectorFormCall == "${i.name}"){
                    await handelConnector("form", page, 
                        {
                            sendTo:${i.sendTo},
                            notValid: ${i.notValid || "null"},
                            validator:[${i.validator?.map?.(compileValues)?.join(",") ?? ""}],
                            order: [${i.order?.map?.((item) => `"${item}"`)?.join(",") ?? ""}],
                            message:${typeof i.message == "string" ? `"${i.message}"` : i.message},
                            safe:${i.responseSafe}
                        }
                    );
                }`;
    };
    pageData = pageData.replacer(connect, scriptData);
    if (counter)
      pageData = pageData.replace(connectDefault, "");
    else
      pageData = pageData.replacer(connectDefault, scriptData);
  }
  return pageData;
}
async function handelConnector2(thisPage, connectorInfo) {
  delete thisPage.Post.connectorFormCall;
  let values = [];
  if (connectorInfo.order.length)
    for (const i of connectorInfo.order)
      values.push(thisPage.Post[i]);
  else
    values.push(...Object.values(thisPage.Post));
  let isValid = true;
  if (connectorInfo.validator.length) {
    values = parseValues(values, connectorInfo.validator);
    isValid = await makeValidationJSON(values, connectorInfo.validator);
  }
  let response;
  if (isValid === true)
    response = await connectorInfo.sendTo(...values);
  else if (connectorInfo.notValid)
    response = await connectorInfo.notValid(...isValid);
  if (!isValid && !response)
    if (connectorInfo.message === true)
      thisPage.writeSafe(connectorInfo.message);
    else
      response = connectorInfo.message;
  if (response)
    if (connectorInfo.safe)
      thisPage.writeSafe(response);
    else
      thisPage.write(response);
}

// src/BuildInComponents/Components/record.ts
import path9 from "path";
var recordStore = new StoreJSON("Records");
function recordLink(dataTag2, sessionInfo2) {
  return dataTag2.remove("link") || CutTheLast(".", SplitFirst("/", sessionInfo2.smallPath).pop());
}
function makeRecordPath(defaultName, dataTag2, sessionInfo2) {
  const link = recordLink(dataTag2, sessionInfo2), saveName = dataTag2.remove("name") || defaultName;
  recordStore.store[saveName] ??= {};
  recordStore.store[saveName][link] ??= "";
  sessionInfo2.record(saveName);
  return {
    store: recordStore.store[saveName],
    current: recordStore.store[saveName][link],
    link
  };
}
async function BuildCode14(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, path23, LastSmallPath, (x) => x.eq, sessionInfo2);
  const parser = new JSParser(BetweenTagData, path23);
  await parser.findScripts();
  let html2 = "";
  for (const i of parser.values) {
    if (i.type == "text") {
      html2 += i.text.eq;
    }
  }
  html2 = html2.trim();
  const { store, link } = makeRecordPath("records/record.serv", dataTag2, sessionInfo2);
  if (!store[link].includes(html2)) {
    store[link] += html2;
  }
  return {
    compiledString: BetweenTagData
  };
}
function updateRecords(session2) {
  if (!session2.debug) {
    return;
  }
  for (const name2 of session2.recordNames) {
    const path23 = getTypes.Static[0] + name2 + ".json";
    EasyFs_default.writeJsonFile(path23, recordStore.store[name2]);
  }
}
function perCompile() {
  recordStore.clear();
}
async function postCompile() {
  for (const name2 in recordStore.store) {
    const filePath = getTypes.Static[0] + name2 + ".json";
    const dirname2 = path9.dirname(name2);
    if (dirname2)
      await EasyFs_default.makePathReal(dirname2, getTypes.Static[0]);
    EasyFs_default.writeJsonFile(filePath, recordStore.store[name2]);
  }
}

// src/BuildInComponents/Components/search.ts
import { parse } from "node-html-parser";
async function BuildCode15(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, path23, LastSmallPath, (x) => x.eq, sessionInfo2);
  const parser = new JSParser(BetweenTagData, path23);
  await parser.findScripts();
  let html2 = "";
  for (const i of parser.values) {
    if (i.type == "text") {
      html2 += i.text.eq;
    }
  }
  const { store, link, current } = makeRecordPath("records/search.serv", dataTag2, sessionInfo2);
  const searchObject = buildObject(html2, dataTag2.remove("match") || "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
  if (!current) {
    store[link] = searchObject;
  } else {
    const newTitles = searchObject.titles.filter((x) => current.titles.find((i) => i.id != x.id));
    current.titles.push(...newTitles);
    if (!current.text.includes(searchObject.text)) {
      current.text += searchObject.text;
    }
  }
  return {
    compiledString: BetweenTagData
  };
}
function buildObject(html2, match) {
  const root = parse(html2, {
    blockTextElements: {
      script: false,
      style: false,
      noscript: false
    }
  });
  const titles = [];
  for (const element of root.querySelectorAll(match)) {
    const id = element.attributes["id"];
    titles.push({
      id,
      text: element.innerText.trim()
    });
  }
  return {
    titles,
    text: root.innerText.trim()
  };
}

// src/BuildInComponents/index.ts
var AllBuildIn = ["client", "script", "style", "page", "connect", "isolate", "form", "head", "svelte", "markdown", "record", "search"];
function StartCompiling(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, BuildScriptWithoutModule, sessionInfo2) {
  let reData;
  switch (type.eq.toLowerCase()) {
    case "client":
      reData = BuildCode(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, BuildScriptWithoutModule, sessionInfo2);
      break;
    case "record":
      reData = BuildCode14(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "search":
      reData = BuildCode15(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "script":
      reData = BuildCode4(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, BuildScriptWithoutModule, sessionInfo2);
      break;
    case "style":
      reData = BuildCode7(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "page":
      reData = BuildCode8(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "connect":
      reData = BuildCode12(LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "form":
      reData = BuildCode13(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, BuildScriptWithoutModule, sessionInfo2);
      break;
    case "isolate":
      reData = isolate(BetweenTagData);
      break;
    case "head":
      reData = BuildCode11(path23, pathName, LastSmallPath, type, dataTag2, BetweenTagData, InsertComponent2, BuildScriptWithoutModule, sessionInfo2);
      break;
    case "svelte":
      reData = BuildCode9(path23, LastSmallPath, type, dataTag2, sessionInfo2);
      break;
    case "markdown":
      reData = BuildCode10(type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    default:
      console.error("Component is not build yet");
  }
  return reData;
}
function IsInclude(tagname) {
  return AllBuildIn.includes(tagname.toLowerCase());
}
async function finalizeBuild(pageData, sessionInfo2, fullCompilePath) {
  updateRecords(sessionInfo2);
  pageData = addFinalizeBuild2(pageData, sessionInfo2);
  pageData = addFinalizeBuild3(pageData, sessionInfo2);
  pageData = pageData.replace(/@ConnectHere(;?)/gi, "").replace(/@ConnectHereForm(;?)/gi, "");
  pageData = await addFinalizeBuild(pageData, sessionInfo2, fullCompilePath);
  return pageData;
}
function handelConnectorService(type, thisPage, connectorArray) {
  if (type == "connect")
    return handelConnector(thisPage, connectorArray);
  else
    return handelConnector2(thisPage, connectorArray);
}
async function perCompile2() {
  perCompile();
}
async function postCompile2() {
  postCompile();
}

// src/CompileCode/InsertComponent.ts
import pathNode from "path";

// src/CompileCode/XMLHelpers/Extricate.ts
function unicodeMe(value2) {
  let a = "";
  for (const v of value2) {
    a += "\\u" + ("000" + v.charCodeAt(0).toString(16)).substr(-4);
  }
  return a;
}
function searchForCutMain(data, array, sing, bigTag, searchFor) {
  let out = "";
  for (const e of array) {
    out += unicodeMe(sing) + e + "|";
  }
  out = out.substring(0, out.length - 1);
  out = `<(${out})${searchFor ? "([\\p{L}0-9_\\-\\.]+)" : ""}(\\u0020)*\\u002F?>`;
  return searchForCut(data, new RegExp(out, "u"), sing, bigTag);
}
function outTagName(data) {
  const end = data.indexOf(">");
  data = data.substring(0, end);
  while (data.endsWith(" ") || data.endsWith("/")) {
    data = data.substring(0, data.length - 1);
  }
  return data;
}
function searchForCut(data, findArray, sing, bigTag = true, output = new StringTracker(), returnArray = []) {
  const dataCopy = data;
  const be = data.search(findArray);
  if (be == -1) {
    return {
      data: output.Plus(data),
      found: returnArray
    };
  }
  output.Plus(data.substring(0, be));
  data = data.substring(be + 1);
  const tag = outTagName(data.eq);
  data = data.substring(findStart(">", data));
  let inTagData;
  if (bigTag) {
    const end = findEnd(["<" + tag, "</" + tag], data);
    if (end != -1) {
      inTagData = data.substring(0, end);
      data = data.substring(end);
      data = data.substring(findStart(">", data));
    } else {
      const findNext = data.search(findArray);
      if (findNext == -1) {
        inTagData = data;
        data = new StringTracker();
      } else {
        inTagData = data.substring(0, findNext);
        data = data.substring(findNext);
      }
    }
  }
  returnArray.push({
    tag,
    data: inTagData,
    loc: be
  });
  if (dataCopy == data) {
    return {
      error: true
    };
  }
  return searchForCut(data, findArray, sing, bigTag, output, returnArray);
}
function findStart(type, data) {
  return data.indexOf(type) + type.length;
}
function findEnd(types, data) {
  let _0 = data.indexOf(types[0]);
  const _1 = data.indexOf(types[1]);
  if (_1 == -1) {
    return -1;
  }
  if (_0 < _1 && _0 != -1) {
    _0++;
    const next = _0 + findEnd(types, data.substring(_0)) + types[0].length;
    return next + findEnd(types, data.substring(next));
  } else {
    return _1;
  }
}

// src/CompileCode/CompileScript/PageBase.ts
import path12 from "path";

// src/CompileCode/CompileScript/Compile.ts
import path11 from "path";

// src/ImportFiles/Script.ts
import { transform as transform4 } from "sucrase";
import { minify as minify5 } from "terser";

// src/ImportFiles/CustomImport/json.ts
function json_default(path23) {
  return EasyFs_default.readJsonFile(path23);
}

// src/ImportFiles/CustomImport/wasm.ts
import { promises as promises2 } from "fs";
async function wasm_default(path23) {
  const wasmModule2 = new WebAssembly.Module(await promises2.readFile(path23));
  const wasmInstance2 = new WebAssembly.Instance(wasmModule2, {});
  return wasmInstance2.exports;
}

// src/ImportFiles/CustomImport/index.ts
var customTypes = ["json", "wasm"];
async function CustomImport_default(path23, type, require3) {
  switch (type) {
    case "json":
      return json_default(path23);
    case "wasm":
      return wasm_default(path23);
    default:
      return import(path23);
  }
}

// src/CompileCode/transform/EasySyntax.ts
var EasySyntax = class {
  async load(code) {
    const parseArray = await ParseTextStream(code);
    this.Build = new ReBuildCodeString(parseArray);
    this.actionStringExport = this.actionStringExport.bind(this);
    this.actionStringExportAll = this.actionStringExportAll.bind(this);
  }
  actionStringImport(replaceToType, dataObject, index) {
    return `const ${dataObject} = await ${replaceToType}(<|${index}||>)`;
  }
  actionStringExport(replaceToType, dataObject, index) {
    return `${this.actionStringImport(replaceToType, dataObject, index)};Object.assign(exports, ${dataObject})`;
  }
  actionStringImportAll(replaceToType, index) {
    return `await ${replaceToType}(<|${index}||>)`;
  }
  actionStringExportAll(replaceToType, index) {
    return `Object.assign(exports, ${this.actionStringImportAll(replaceToType, index)})`;
  }
  BuildImportType(type, replaceToType = type, actionString = this.actionStringImport) {
    let beforeString = "";
    let newString = this.Build.CodeBuildText;
    let match;
    function Rematch() {
      match = newString.match(new RegExp(`${type}[ \\n]+([\\*]{0,1}[\\p{L}0-9_,\\{\\} \\n]+)[ \\n]+from[ \\n]+<\\|([0-9]+)\\|\\|>`, "u"));
    }
    Rematch();
    while (match) {
      const data = match[1].trim();
      beforeString += newString.substring(0, match.index);
      newString = newString.substring(match.index + match[0].length);
      let DataObject;
      if (data[0] == "*") {
        DataObject = data.substring(1).replace(" as ", "").trimStart();
      } else {
        let Spliced = [];
        if (data[0] == "{") {
          Spliced = data.split("}", 2);
          Spliced[0] += "}";
          if (Spliced[1])
            Spliced[1] = Spliced[1].split(",").pop();
        } else {
          Spliced = data.split(",", 1).reverse();
        }
        Spliced = Spliced.map((x) => x.trim()).filter((x) => x.length);
        if (Spliced.length == 1) {
          if (Spliced[0][0] == "{") {
            DataObject = Spliced[0];
          } else {
            let extension = this.Build.AllInputs[match[2]];
            extension = extension.substring(extension.lastIndexOf(".") + 1, extension.length - 1);
            if (customTypes.includes(extension))
              DataObject = Spliced[0];
            else
              DataObject = `{default:${Spliced[0]}}`;
          }
        } else {
          DataObject = Spliced[0];
          DataObject = `${DataObject.substring(0, DataObject.length - 1)},default:${Spliced[1]}}`;
        }
        DataObject = DataObject.replace(/ as /, ":");
      }
      beforeString += actionString(replaceToType, DataObject, match[2]);
      Rematch();
    }
    beforeString += newString;
    this.Build.CodeBuildText = beforeString;
  }
  BuildInOneWord(type, replaceToType = type, actionString = this.actionStringImportAll) {
    let beforeString = "";
    let newString = this.Build.CodeBuildText;
    let match;
    function Rematch() {
      match = newString.match(new RegExp(type + "[ \\n]+<\\|([0-9]+)\\|\\|>"));
    }
    Rematch();
    while (match) {
      beforeString += newString.substring(0, match.index);
      newString = newString.substring(match.index + match[0].length);
      beforeString += actionString(replaceToType, match[1]);
      Rematch();
    }
    beforeString += newString;
    this.Build.CodeBuildText = beforeString;
  }
  replaceWithSpace(func) {
    this.Build.CodeBuildText = func(" " + this.Build.CodeBuildText).substring(1);
  }
  Define(data) {
    for (const [key, value2] of Object.entries(data)) {
      this.replaceWithSpace((text) => text.replace(new RegExp(`([^\\p{L}])${key}([^\\p{L}])`, "gui"), (...match) => {
        return match[1] + value2 + match[2];
      }));
    }
  }
  BuildInAsFunction(word, toWord) {
    this.replaceWithSpace((text) => text.replace(new RegExp(`([^\\p{L}])${word}([ \\n]*\\()`, "gui"), (...match) => {
      return match[1] + toWord + match[2];
    }));
  }
  BuildImports(defineData) {
    this.BuildImportType("import", "require");
    this.BuildImportType("export", "require", this.actionStringExport);
    this.BuildImportType("include");
    this.BuildInOneWord("import", "require");
    this.BuildInOneWord("export", "require", this.actionStringExportAll);
    this.BuildInOneWord("include");
    this.BuildInAsFunction("import", "require");
    this.Define(defineData);
  }
  BuiltString() {
    return this.Build.BuildCode();
  }
  static async BuildAndExportImports(code, defineData = {}) {
    const builder = new EasySyntax();
    await builder.load(` ${code} `);
    builder.BuildImports(defineData);
    code = builder.BuiltString();
    return code.substring(1, code.length - 1);
  }
};

// src/ImportFiles/Script.ts
import path10 from "path";
import { v4 as uuid3 } from "uuid";
async function ReplaceBefore(code, defineData) {
  code = await EasySyntax.BuildAndExportImports(code, defineData);
  return code;
}
function template3(code, isDebug, dir, file, params) {
  return `${isDebug ? "require('source-map-support').install();" : ""}var __dirname="${JSParser.fixTextSimpleQuotes(dir)}",__filename="${JSParser.fixTextSimpleQuotes(file)}";module.exports = (async (require${params ? "," + params : ""})=>{var module={exports:{}},exports=module.exports;${code}
return module.exports;});`;
}
async function BuildScript2(filePath, savePath, isTypescript, isDebug, { params, haveSourceMap = isDebug, fileCode, templatePath = filePath, codeMinify = true } = {}) {
  const sourceMapFile = savePath && savePath.split(/\/|\\/).pop();
  const Options = {
    transforms: ["imports"],
    sourceMapOptions: haveSourceMap ? {
      compiledFilename: sourceMapFile
    } : void 0,
    filePath: haveSourceMap ? savePath && path10.relative(path10.dirname(savePath), filePath) : void 0
  }, define = {
    debug: "" + isDebug
  };
  if (isTypescript) {
    Options.transforms.push("typescript");
  }
  let Result = await ReplaceBefore(fileCode || await EasyFs_default.readFile(filePath), define), sourceMap;
  try {
    const { code, sourceMap: map } = transform4(Result, Options);
    Result = code;
    sourceMap = JSON.stringify(map);
  } catch (err) {
    PrintIfNew({
      errorName: "compilation-error",
      text: `${err.message}, on file -> ${filePath}`
    });
  }
  Result = template3(Result, isDebug, path10.dirname(templatePath), templatePath, params);
  if (isDebug) {
    if (haveSourceMap)
      Result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(sourceMap).toString("base64");
  } else if (codeMinify) {
    try {
      Result = (await minify5(Result, { module: false })).code;
    } catch (err) {
      PrintIfNew({
        errorName: "minify",
        text: `${err.message} on file -> ${filePath}`
      });
    }
  }
  if (savePath) {
    await EasyFs_default.makePathReal(path10.dirname(savePath));
    await EasyFs_default.writeFile(savePath, Result);
  }
  return Result;
}
function CheckTs(FilePath) {
  return FilePath.endsWith(".ts");
}
async function BuildScriptSmallPath(InStaticPath, typeArray, isDebug = false) {
  await EasyFs_default.makePathReal(InStaticPath, typeArray[1]);
  return await BuildScript2(typeArray[0] + InStaticPath, typeArray[1] + InStaticPath + ".cjs", CheckTs(InStaticPath), isDebug);
}
function AddExtension(FilePath) {
  const fileExt = path10.extname(FilePath);
  if (BasicSettings.partExtensions.includes(fileExt.substring(1)))
    FilePath += "." + (isTs() ? "ts" : "js");
  else if (fileExt == "")
    FilePath += "." + BasicSettings.ReqFileTypes[isTs() ? "ts" : "js"];
  return FilePath;
}
var SavedModules = {};
async function LoadImport(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache = []) {
  let TimeCheck;
  InStaticPath = path10.join(AddExtension(InStaticPath).toLowerCase());
  const extension = path10.extname(InStaticPath).substring(1), thisCustom = customTypes.includes(extension) || !["js", "ts"].includes(extension);
  const SavedModulesPath = path10.join(typeArray[2], InStaticPath), filePath = path10.join(typeArray[0], InStaticPath);
  let processEnd;
  if (!SavedModules[SavedModulesPath])
    SavedModules[SavedModulesPath] = new Promise((r) => processEnd = r);
  else if (SavedModules[SavedModulesPath] instanceof Promise)
    await SavedModules[SavedModulesPath];
  const reBuild = !pageDeps.store[SavedModulesPath] || pageDeps.store[SavedModulesPath] != (TimeCheck = await EasyFs_default.stat(filePath, "mtimeMs", true, null));
  if (reBuild) {
    TimeCheck = TimeCheck ?? await EasyFs_default.stat(filePath, "mtimeMs", true, null);
    if (TimeCheck == null) {
      PrintIfNew({
        type: "warn",
        errorName: "import-not-exists",
        text: `Import '${InStaticPath}' does not exists from '${importFrom}'`
      });
      SavedModules[SavedModulesPath] = null;
      return null;
    }
    if (!thisCustom)
      await BuildScriptSmallPath(InStaticPath, typeArray, isDebug);
    pageDeps.update(SavedModulesPath, TimeCheck);
  }
  if (useDeps) {
    useDeps[InStaticPath] = { thisFile: TimeCheck };
    useDeps = useDeps[InStaticPath];
  }
  const inheritanceCache = withoutCache[0] == InStaticPath;
  if (inheritanceCache)
    withoutCache.shift();
  else if (!reBuild && SavedModules[SavedModulesPath] && !(SavedModules[SavedModulesPath] instanceof Promise))
    return SavedModules[SavedModulesPath];
  function requireMap(p) {
    if (path10.isAbsolute(p))
      p = path10.normalize(p).substring(path10.normalize(typeArray[0]).length);
    else {
      if (p[0] == ".") {
        const dirPath = path10.dirname(InStaticPath);
        p = (dirPath != "/" ? dirPath + "/" : "") + p;
      } else if (p[0] != "/")
        return import(p);
    }
    return LoadImport(filePath, p, typeArray, isDebug, useDeps, inheritanceCache ? withoutCache : []);
  }
  let MyModule;
  if (thisCustom) {
    MyModule = await CustomImport_default(filePath, extension, requireMap);
  } else {
    const requirePath = path10.join(typeArray[1], InStaticPath + ".cjs");
    MyModule = await redirectCJS_default(requirePath);
    MyModule = await MyModule(requireMap);
  }
  SavedModules[SavedModulesPath] = MyModule;
  processEnd?.();
  return MyModule;
}
function ImportFile(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache) {
  if (!isDebug) {
    const haveImport = SavedModules[path10.join(typeArray[2], InStaticPath.toLowerCase())];
    if (haveImport !== void 0)
      return haveImport;
  }
  return LoadImport(importFrom, InStaticPath, typeArray, isDebug, useDeps, withoutCache);
}
async function RequireOnce(filePath, isDebug) {
  const tempFile = path10.join(SystemData, `temp-${uuid3()}.cjs`);
  await BuildScript2(filePath, tempFile, CheckTs(filePath), isDebug);
  const MyModule = await redirectCJS_default(tempFile);
  EasyFs_default.unlink(tempFile);
  return await MyModule((path23) => import(path23));
}
async function compileImport(globalPrams, scriptLocation, inStaticLocationRelative, typeArray, isTypeScript, isDebug, fileCode, sourceMapComment) {
  await EasyFs_default.makePathReal(inStaticLocationRelative, typeArray[1]);
  const fullSaveLocation = scriptLocation + ".cjs";
  const templatePath = typeArray[0] + inStaticLocationRelative;
  const Result = await BuildScript2(scriptLocation, void 0, isTypeScript, isDebug, { params: globalPrams, haveSourceMap: false, fileCode, templatePath, codeMinify: false });
  await EasyFs_default.makePathReal(path10.dirname(fullSaveLocation));
  await EasyFs_default.writeFile(fullSaveLocation, Result + sourceMapComment);
  function requireMap(p) {
    if (path10.isAbsolute(p))
      p = path10.normalize(p).substring(path10.normalize(typeArray[0]).length);
    else {
      if (p[0] == ".") {
        const dirPath = path10.dirname(inStaticLocationRelative);
        p = (dirPath != "/" ? dirPath + "/" : "") + p;
      } else if (p[0] != "/")
        return import(p);
    }
    return LoadImport(templatePath, p, typeArray, isDebug);
  }
  const MyModule = await redirectCJS_default(fullSaveLocation);
  return async (...arr) => await MyModule(requireMap, ...arr);
}

// src/Plugins/Syntax/RazorSyntax.ts
var addWriteMap = {
  "include": "await ",
  "import": "await ",
  "transfer": "return await "
};
async function ConvertSyntax(text, options) {
  const values = await RazorToEJS(text.eq);
  const build = new StringTracker();
  for (const i of values) {
    const substring = text.substring(i.start, i.end);
    switch (i.name) {
      case "text":
        build.Plus(substring);
        break;
      case "script":
        build.Plus$`<%${substring}%>`;
        break;
      case "print":
        build.Plus$`<%=${substring}%>`;
        break;
      case "escape":
        build.Plus$`<%:${substring}%>`;
        break;
      default:
        build.Plus$`<%${addWriteMap[i.name]}${substring}%>`;
    }
  }
  return build;
}
async function ConvertSyntaxMini(text, find, addEJS) {
  const values = await RazorToEJSMini(text.eq, find);
  const build = new StringTracker();
  for (let i = 0; i < values.length; i += 4) {
    if (values[i] != values[i + 1])
      build.Plus(text.substring(values[i], values[i + 1]));
    const substring = text.substring(values[i + 2], values[i + 3]);
    build.Plus$`<%${addEJS}${substring}%>`;
  }
  build.Plus(text.substring((values.at(-1) ?? -1) + 1));
  return build;
}

// src/CompileCode/CompileScript/Compile.ts
var CRunTime = class {
  constructor(script, sessionInfo2, smallPath2, isTs2) {
    this.script = script;
    this.sessionInfo = sessionInfo2;
    this.smallPath = smallPath2;
    this.isTs = isTs2;
    this.define = {};
  }
  templateScript(scripts) {
    const build = new StringTracker();
    build.AddTextAfterNoTrack(`const __writeArray = []
        var __write;

        function write(text){
            __write.text += text;
        }`);
    for (const i of scripts) {
      build.AddTextAfterNoTrack(`__write = {text: ''};
            __writeArray.push(__write);`);
      build.Plus(i);
    }
    build.AddTextAfterNoTrack(`return __writeArray`);
    return build;
  }
  methods(attributes) {
    const page__filename = BasicSettings.fullWebSitePath + this.smallPath;
    return {
      string: "script,style,define,store,page__filename,page__dirname,attributes",
      funcs: [
        this.sessionInfo.script.bind(this.sessionInfo),
        this.sessionInfo.style.bind(this.sessionInfo),
        (key, value2) => this.define[String(key)] = value2,
        this.sessionInfo.compileRunTimeStore,
        page__filename,
        path11.dirname(page__filename),
        attributes
      ]
    };
  }
  rebuildCode(parser, buildStrings) {
    const build = new StringTracker();
    for (const i of parser.values) {
      if (i.type == "text") {
        build.Plus(i.text);
        continue;
      }
      build.AddTextAfterNoTrack(buildStrings.pop().text);
    }
    return build;
  }
  async compile(attributes) {
    const haveCache = this.sessionInfo.cacheCompileScript[this.smallPath];
    if (haveCache)
      return (await haveCache)();
    let doForAll;
    this.sessionInfo.cacheCompileScript[this.smallPath] = new Promise((r) => doForAll = r);
    this.script = await ConvertSyntaxMini(this.script, "@compile", "*");
    const parser = new JSParser(this.script, this.smallPath, "<%*", "%>");
    await parser.findScripts();
    if (parser.values.length == 1 && parser.values[0].type === "text") {
      const resolve2 = () => this.script;
      doForAll(resolve2);
      this.sessionInfo.cacheCompileScript[this.smallPath] = resolve2;
      return this.script;
    }
    const [type, filePath] = SplitFirst("/", this.smallPath), typeArray = getTypes[type] ?? getTypes.Static, compilePath = typeArray[1] + filePath + ".comp.js";
    await EasyFs_default.makePathReal(filePath, typeArray[1]);
    const template4 = this.templateScript(parser.values.filter((x) => x.type != "text").map((x) => x.text));
    const sourceMap = new SourceMapStore(compilePath, this.sessionInfo.debug, false, false);
    sourceMap.addStringTracker(template4);
    const { funcs, string } = this.methods(attributes);
    const toImport = await compileImport(string, compilePath, filePath, typeArray, this.isTs, this.sessionInfo.debug, template4.eq, sourceMap.mapAsURLComment());
    const execute = async () => this.rebuildCode(parser, await toImport(...funcs));
    this.sessionInfo.cacheCompileScript[this.smallPath] = execute;
    const thisFirst = await execute();
    doForAll(execute);
    return thisFirst;
  }
};

// src/CompileCode/CompileScript/PageBase.ts
var settings = { define: {} };
var stringAttributes = ["'", '"', "`"];
var ParseBasePage = class {
  constructor(code, isTs2) {
    this.code = code;
    this.isTs = isTs2;
    this.scriptFile = new StringTracker();
    this.valueArray = [];
  }
  async loadSettings(sessionInfo2, pagePath, smallPath2, pageName, attributes) {
    const run = new CRunTime(this.code, sessionInfo2, smallPath2, this.isTs);
    this.code = await run.compile(attributes);
    this.parseBase(this.code);
    await this.loadCodeFile(pagePath, smallPath2, this.isTs, sessionInfo2, pageName);
    this.loadDefine(__spreadValues(__spreadValues({}, settings.define), run.define));
  }
  parseBase(code) {
    let dataSplit;
    code = code.replacer(/@\[[ ]*(([A-Za-z_][A-Za-z_0-9]*=(("[^"]*")|(`[^`]*`)|('[^']*')|[A-Za-z0-9_]+)([ ]*,?[ ]*)?)*)\]/, (data) => {
      dataSplit = data[1].trim();
      return new StringTracker();
    });
    while (dataSplit?.length) {
      const findWord = dataSplit.indexOf("=");
      let thisWord = dataSplit.substring(0, findWord).trim().eq;
      if (thisWord[0] == ",")
        thisWord = thisWord.substring(1).trim();
      let nextValue = dataSplit.substring(findWord + 1);
      let thisValue;
      const closeChar = nextValue.at(0).eq;
      if (stringAttributes.includes(closeChar)) {
        const endIndex = BaseReader.findEntOfQ(nextValue.eq.substring(1), closeChar);
        thisValue = nextValue.substring(1, endIndex);
        nextValue = nextValue.substring(endIndex + 1).trim();
      } else {
        const endIndex = nextValue.search(/[_ ,]/);
        if (endIndex == -1) {
          thisValue = nextValue;
          nextValue = null;
        } else {
          thisValue = nextValue.substring(0, endIndex);
          nextValue = nextValue.substring(endIndex).trim();
        }
      }
      dataSplit = nextValue;
      this.valueArray.push({ key: thisWord, value: thisValue });
    }
    this.clearData = code.trimStart();
  }
  rebuild() {
    if (!this.valueArray.length)
      return new StringTracker();
    const build = new StringTracker(null, "@[");
    for (const { key, value: value2 } of this.valueArray) {
      build.Plus$`${key}="${value2.replaceAll('"', '\\"')}"`;
    }
    build.Plus("]").Plus(this.clearData);
    this.clearData = build;
  }
  static rebuildBaseInheritance(code) {
    const parse2 = new ParseBasePage();
    const build = new StringTracker();
    parse2.parseBase(code);
    for (const name2 of parse2.byValue("inherit")) {
      parse2.pop(name2);
      build.Plus(`<@${name2}><:${name2}/></@${name2}>`);
    }
    parse2.rebuild();
    return parse2.clearData.Plus(build);
  }
  pop(name2) {
    return this.valueArray.splice(this.valueArray.findIndex((x) => x.key === name2), 1)[0]?.value;
  }
  popAny(name2) {
    const haveName = this.valueArray.findIndex((x) => x.key.toLowerCase() == name2);
    if (haveName != -1)
      return this.valueArray.splice(haveName, 1)[0].value;
    const asTag = searchForCutMain(this.clearData, [name2], "@");
    if (!asTag.found[0])
      return;
    this.clearData = asTag.data;
    return asTag.found[0].data.trim();
  }
  byValue(value2) {
    return this.valueArray.filter((x) => x.value.eq === value2).map((x) => x.key);
  }
  replaceValue(name2, value2) {
    const have = this.valueArray.find((x) => x.key === name2);
    if (have)
      have.value = value2;
  }
  async loadCodeFile(pagePath, pageSmallPath, isTs2, sessionInfo2, pageName) {
    let haveCode = this.popAny("codefile")?.eq;
    if (!haveCode)
      return;
    const lang = this.popAny("lang")?.eq;
    if (haveCode.toLowerCase() == "inherit")
      haveCode = pagePath;
    const haveExt = path12.extname(haveCode).substring(1);
    if (!["js", "ts"].includes(haveExt)) {
      if (/(\\|\/)$/.test(haveCode))
        haveCode += pagePath.split("/").pop();
      else if (!BasicSettings.pageTypesArray.includes(haveExt))
        haveCode += path12.extname(pagePath);
      haveCode += "." + (lang ? lang : isTs2 ? "ts" : "js");
    }
    if (haveCode[0] == ".")
      haveCode = path12.join(path12.dirname(pagePath), haveCode);
    const SmallPath = BasicSettings.relative(haveCode);
    if (await sessionInfo2.dependence(SmallPath, haveCode)) {
      const baseModelData = await AddDebugInfo(pageName, haveCode, SmallPath);
      baseModelData.allData.AddTextBeforeNoTrack("<%");
      baseModelData.allData.AddTextAfterNoTrack("%>");
      baseModelData.allData.AddTextBeforeNoTrack(baseModelData.stringInfo);
      this.scriptFile = baseModelData.allData;
    } else {
      PrintIfNew({
        id: SmallPath,
        type: "error",
        errorName: "codeFileNotFound",
        text: `
Code file not found: ${pagePath}<line>${SmallPath}`
      });
      this.scriptFile = new StringTracker(pageName, `<%="<p style=\\"color:red;text-align:left;font-size:16px;\\">Code File Not Found: '${pageSmallPath}' -> '${SmallPath}'</p>"%>`);
    }
  }
  loadSetting(name2 = "define", limitArguments = 2) {
    const have = this.clearData.indexOf(`@${name2}(`);
    if (have == -1)
      return false;
    const argumentArray = [];
    const before = this.clearData.substring(0, have);
    let workData = this.clearData.substring(have + 8).trimStart();
    for (let i = 0; i < limitArguments; i++) {
      const quotationSign = workData.at(0).eq;
      const endQuote = BaseReader.findEntOfQ(workData.eq.substring(1), quotationSign);
      argumentArray.push(workData.substring(1, endQuote));
      const afterArgument = workData.substring(endQuote + 1).trimStart();
      if (afterArgument.at(0).eq != ",") {
        workData = afterArgument;
        break;
      }
      workData = afterArgument.substring(1).trimStart();
    }
    workData = workData.substring(workData.indexOf(")") + 1);
    this.clearData = before.trimEnd().Plus(workData.trimStart());
    return argumentArray;
  }
  loadDefine(moreDefine) {
    let lastValue = this.loadSetting();
    const values = Object.entries(moreDefine);
    while (lastValue) {
      values.unshift(lastValue);
      lastValue = this.loadSetting();
    }
    for (const [name2, value2] of values) {
      this.clearData = this.clearData.replaceAll(`:${name2}:`, value2);
    }
  }
};

// src/CompileCode/InsertComponent.ts
var InsertComponent = class extends InsertComponentBase {
  constructor(PluginBuild2) {
    super(PrintIfNew);
    this.dirFolder = "Components";
    this.PluginBuild = PluginBuild2;
    this.regexSearch = new RegExp(`<([\\p{Lu}_\\-:0-9]|${AllBuildIn.join("|")})`, "u");
  }
  FindSpecialTagByStart(string) {
    for (const i of this.SkipSpecialTag) {
      if (string.substring(0, i[0].length) == i[0]) {
        return i;
      }
    }
  }
  tagData(text) {
    const tokenArray = [], a = [], mapAttributes = {};
    text = text.trim().replacer(/(<%)([\w\W]+?)(%>)/, (data) => {
      tokenArray.push(data[2]);
      return data[1].Plus(data[3]);
    });
    const unToken = (text2) => text2.replacer(/(<%)(%>)/, (data) => data[1].Plus(tokenArray.shift()).Plus(data[2]));
    let fastText = text.eq;
    const SkipTypes = ['"', "'", "`"], BlockTypes = [
      ["{", "}"],
      ["(", ")"]
    ];
    while (fastText.length) {
      let i = 0;
      for (; i < fastText.length; i++) {
        const char = fastText.charAt(i);
        if (char == "=") {
          let nextChar = text.at(i + 1);
          const nextCharEq = nextChar.eq, attrName = text.substring(0, i);
          let value2, endIndex, blockEnd;
          if (SkipTypes.includes(nextCharEq)) {
            endIndex = BaseReader.findEntOfQ(fastText.substring(i + 2), nextCharEq) + 1;
            value2 = text.substr(i + 2, endIndex - 2);
          } else if ((blockEnd = BlockTypes.find((x) => x[0] == nextCharEq)?.[1]) != null) {
            endIndex = BaseReader.findEndOfDef(fastText.substring(i + 2), [nextCharEq, blockEnd]) + 1;
            value2 = text.substr(i + 1, endIndex + 1);
          } else {
            endIndex = fastText.substring(i + 1).search(/ |\n/);
            if (endIndex == -1)
              endIndex = fastText.length;
            value2 = text.substr(i + 1, endIndex);
            nextChar = new StringTracker();
          }
          const n = unToken(attrName), v = unToken(value2);
          mapAttributes[n.eq] = v.eq;
          a.push({
            n,
            v,
            char: nextChar
          });
          i += 1 + endIndex;
          break;
        } else if (char == " " || i == fastText.length - 1 && ++i) {
          const n = unToken(text.substring(0, i));
          a.push({
            n
          });
          mapAttributes[n.eq] = true;
          break;
        }
      }
      fastText = fastText.substring(i).trim();
      text = text.substring(i).trim();
    }
    const index = (name2) => a.findIndex((x) => x.n.eq == name2);
    const getValue = (name2) => a.find((tag) => tag.n.eq == name2)?.v?.eq ?? "";
    const remove = (name2) => {
      const nameIndex = index(name2);
      if (nameIndex == -1)
        return "";
      return a.splice(nameIndex, 1).pop().v?.eq ?? "";
    };
    a.have = (name2) => index(name2) != -1;
    a.getValue = getValue;
    a.remove = remove;
    a.addClass = (c) => {
      const i = index("class");
      if (i == -1) {
        a.push({ n: new StringTracker(null, "class"), v: new StringTracker(null, c), char: new StringTracker(null, '"') });
        return;
      }
      const item = a[i];
      if (item.v.length)
        c = " " + c;
      item.v.AddTextAfter(c);
    };
    return { data: a, mapAttributes };
  }
  findIndexSearchTag(query, tag) {
    const all = query.split(".");
    let counter = 0;
    for (const i of all) {
      const index = tag.indexOf(i);
      if (index == -1) {
        PrintIfNew({
          text: `Waring, can't find all query in tag -> ${tag.eq}
${tag.lineInfo}`,
          errorName: "query-not-found"
        });
        break;
      }
      counter += index + i.length;
      tag = tag.substring(index + i.length);
    }
    return counter + tag.search(/\ |\>/);
  }
  ReBuildTagData(stringInfo, dataTagSplitter) {
    let newAttributes = new StringTracker(stringInfo);
    for (const i of dataTagSplitter) {
      if (i.v) {
        newAttributes.Plus$`${i.n}=${i.char}${i.v}${i.char} `;
      } else {
        newAttributes.Plus(i.n, " ");
      }
    }
    if (dataTagSplitter.length) {
      newAttributes = new StringTracker(stringInfo, " ").Plus(newAttributes.substring(0, newAttributes.length - 1));
    }
    return newAttributes;
  }
  CheckMinHTML(code) {
    if (this.SomePlugins("MinHTML", "MinAll")) {
      code = code.SpaceOne(" ");
    }
    return code;
  }
  async ReBuildTag(type, dataTag2, dataTagSpliced, BetweenTagData, SendDataFunc) {
    if (BetweenTagData && this.SomePlugins("MinHTML", "MinAll")) {
      BetweenTagData = BetweenTagData.SpaceOne(" ");
      dataTag2 = this.ReBuildTagData(type.DefaultInfoText, dataTagSpliced);
    } else if (dataTag2.eq.length) {
      dataTag2 = new StringTracker(type.DefaultInfoText, " ").Plus(dataTag2);
    }
    const tagData = new StringTracker(type.DefaultInfoText).Plus("<", type, dataTag2);
    if (BetweenTagData) {
      tagData.Plus$`>${await SendDataFunc(BetweenTagData)}</${type}>`;
    } else {
      tagData.Plus("/>");
    }
    return tagData;
  }
  exportDefaultValues(fileData, foundSetters = []) {
    const indexBasic = fileData.match(/@default[ ]*\(([A-Za-z0-9{}()\[\]_\-$"'`%*&|\/\@ \n]*)\)[ ]*\[([A-Za-z0-9_\-,$ \n]+)\]/);
    if (indexBasic == null)
      return { fileData, foundSetters };
    const WithoutBasic = fileData.substring(0, indexBasic.index).Plus(fileData.substring(indexBasic.index + indexBasic[0].length));
    const arrayValues = indexBasic[2].eq.split(",").map((x) => x.trim());
    foundSetters.push({
      value: indexBasic[1],
      elements: arrayValues
    });
    return this.exportDefaultValues(WithoutBasic, foundSetters);
  }
  addDefaultValues(arrayValues, fileData) {
    for (const i of arrayValues) {
      for (const be of i.elements) {
        fileData = fileData.replaceAll("#" + be, i.value);
      }
    }
    return fileData;
  }
  parseComponentProps(tagData, component) {
    let { fileData, foundSetters } = this.exportDefaultValues(component);
    for (const i of tagData) {
      if (i.n.eq == "&") {
        let re = i.n.substring(1);
        let FoundIndex;
        if (re.includes("&")) {
          const index = re.indexOf("&");
          FoundIndex = this.findIndexSearchTag(re.substring(0, index).eq, fileData);
          re = re.substring(index + 1);
        } else {
          FoundIndex = fileData.search(/\ |\>/);
        }
        const fileDataNext = new StringTracker(fileData.DefaultInfoText);
        const startData = fileData.substring(0, FoundIndex);
        fileDataNext.Plus(startData, new StringTracker(fileData.DefaultInfoText).Plus$` ${re}="${i.v ?? ""}"`, startData.endsWith(" ") ? "" : " ", fileData.substring(FoundIndex));
        fileData = fileDataNext;
      } else {
        const re = new RegExp("\\~" + i.n.eq, "gi");
        fileData = fileData.replace(re, i.v ?? i.n);
      }
    }
    return this.addDefaultValues(foundSetters, fileData);
  }
  async buildTagBasic(fileData, tagData, path23, pathName, FullPath2, SmallPath, buildScript, sessionInfo2, BetweenTagData) {
    fileData = await this.PluginBuild.BuildComponent(fileData, path23, pathName, sessionInfo2);
    fileData = this.parseComponentProps(tagData, fileData);
    fileData = fileData.replace(/<\:reader( )*\/>/gi, BetweenTagData ?? "");
    pathName = pathName + " -> " + SmallPath;
    fileData = await this.StartReplace(fileData, pathName, FullPath2, SmallPath, buildScript, sessionInfo2);
    fileData = await NoTrackStringCode(fileData, `${pathName} ->
${SmallPath}`, sessionInfo2.debug, buildScript);
    return fileData;
  }
  async insertTagData(path23, pathName, LastSmallPath, type, dataTag2, { BetweenTagData, buildScript, sessionInfo: sessionInfo2 }) {
    const { data, mapAttributes } = this.tagData(dataTag2), BuildIn = IsInclude(type.eq);
    let fileData, SearchInComment = true, AllPathTypes = {}, addStringInfo;
    if (BuildIn) {
      const { compiledString, checkComponents } = await StartCompiling(path23, pathName, LastSmallPath, type, data, BetweenTagData ?? new StringTracker(), this, buildScript, sessionInfo2);
      fileData = compiledString;
      SearchInComment = checkComponents;
    } else {
      let folder = data.have("folder");
      if (folder)
        folder = data.remove("folder") || ".";
      const tagPath = (folder ? folder + "/" : "") + type.replace(/:/gi, "/").eq;
      const relativesFilePathSmall = type.extractInfo("<line>"), relativesFilePath = pathNode.join(BasicSettings.fullWebSitePath, relativesFilePathSmall);
      AllPathTypes = CreateFilePath(relativesFilePath, relativesFilePathSmall, tagPath, this.dirFolder, BasicSettings.pageTypes.component);
      if (sessionInfo2.cacheComponent[AllPathTypes.SmallPath] === null || sessionInfo2.cacheComponent[AllPathTypes.SmallPath] === void 0 && !await EasyFs_default.existsFile(AllPathTypes.FullPath)) {
        sessionInfo2.cacheComponent[AllPathTypes.SmallPath] = null;
        if (folder) {
          PrintIfNew({
            text: `Component ${type.eq} not found! -> ${pathName}
-> ${type.lineInfo}
${AllPathTypes.SmallPath}`,
            errorName: "component-not-found",
            type: "error"
          });
        }
        return this.ReBuildTag(type, dataTag2, data, BetweenTagData, (BetweenTagData2) => this.StartReplace(BetweenTagData2, pathName, path23, LastSmallPath, buildScript, sessionInfo2));
      }
      if (!sessionInfo2.cacheComponent[AllPathTypes.SmallPath]?.mtimeMs)
        sessionInfo2.cacheComponent[AllPathTypes.SmallPath] = { mtimeMs: await EasyFs_default.stat(AllPathTypes.FullPath, "mtimeMs") };
      sessionInfo2.dependencies[AllPathTypes.SmallPath] = sessionInfo2.cacheComponent[AllPathTypes.SmallPath].mtimeMs;
      const { allData, stringInfo } = await AddDebugInfo(pathName, AllPathTypes.FullPath, AllPathTypes.SmallPath, sessionInfo2.cacheComponent[AllPathTypes.SmallPath]);
      const baseData = new ParseBasePage(allData, this.isTs());
      await baseData.loadSettings(sessionInfo2, AllPathTypes.FullPath, AllPathTypes.SmallPath, pathName + " -> " + AllPathTypes.SmallPath, mapAttributes);
      fileData = baseData.scriptFile.Plus(baseData.clearData);
      addStringInfo = stringInfo;
    }
    if (SearchInComment && (fileData.length > 0 || BetweenTagData)) {
      const { SmallPath, FullPath: FullPath2 } = AllPathTypes;
      fileData = await this.buildTagBasic(fileData, data, path23, pathName, BuildIn ? type.eq : FullPath2, BuildIn ? type.eq : SmallPath, buildScript, sessionInfo2, BetweenTagData);
      if (addStringInfo)
        fileData.AddTextBeforeNoTrack(addStringInfo);
    }
    return fileData;
  }
  CheckDoubleSpace(...data) {
    const mini = this.SomePlugins("MinHTML", "MinAll");
    let startData = data.shift();
    if (mini) {
      startData = startData.SpaceOne(" ");
    }
    for (let i of data) {
      if (mini && startData.endsWith(" ") && i.startsWith(" ")) {
        i = i.trimStart();
      }
      if (typeof startData == "string") {
      }
      startData.Plus(i);
    }
    if (mini) {
      startData = startData.SpaceOne(" ");
    }
    return startData;
  }
  async StartReplace(data, pathName, path23, smallPath2, buildScript, sessionInfo2) {
    let find;
    const promiseBuild = [];
    while ((find = data.search(this.regexSearch)) != -1) {
      const locSkip = data.eq;
      const specialSkip = this.FindSpecialTagByStart(locSkip.trim());
      if (specialSkip) {
        const start = locSkip.indexOf(specialSkip[0]) + specialSkip[0].length;
        const end = locSkip.substring(start).indexOf(specialSkip[1]) + start + specialSkip[1].length;
        promiseBuild.push(data.substring(0, end));
        data = data.substring(end);
        continue;
      }
      const cutStartData = data.substring(0, find);
      const startFrom = data.substring(find);
      const tagTypeEnd = startFrom.search(" |/|>|(<%)");
      const tagType = startFrom.substring(1, tagTypeEnd);
      const findEndOfSmallTag = await this.FindCloseChar(startFrom.substring(1), ">") + 1;
      let inTag = startFrom.substring(tagTypeEnd + 1, findEndOfSmallTag);
      const NextTextTag = startFrom.substring(findEndOfSmallTag + 1);
      if (inTag.at(inTag.length - 1).eq == "/") {
        inTag = inTag.substring(0, inTag.length - 1);
      }
      if (startFrom.at(findEndOfSmallTag - 1).eq == "/") {
        promiseBuild.push(this.CheckMinHTML(cutStartData), this.insertTagData(path23, pathName, smallPath2, tagType, inTag, { buildScript, sessionInfo: sessionInfo2 }));
        data = NextTextTag;
        continue;
      }
      let BetweenTagDataCloseIndex;
      if (this.SimpleSkip.includes(tagType.eq)) {
        BetweenTagDataCloseIndex = NextTextTag.indexOf("</" + tagType);
      } else {
        BetweenTagDataCloseIndex = await this.FindCloseCharHTML(NextTextTag, tagType.eq);
        if (BetweenTagDataCloseIndex == -1) {
          PrintIfNew({
            text: `
Warning, you didn't write right this tag: "${tagType}", used in: ${tagType.at(0).lineInfo}
(the system will auto close it)`,
            errorName: "close-tag"
          });
          BetweenTagDataCloseIndex = null;
        }
      }
      const BetweenTagData = BetweenTagDataCloseIndex != null && NextTextTag.substring(0, BetweenTagDataCloseIndex);
      const NextDataClose = NextTextTag.substring(BetweenTagDataCloseIndex);
      const NextDataAfterClose = BetweenTagDataCloseIndex != null ? NextDataClose.substring(BaseReader.findEndOfDef(NextDataClose.eq, ">") + 1) : NextDataClose;
      promiseBuild.push(this.CheckMinHTML(cutStartData), this.insertTagData(path23, pathName, smallPath2, tagType, inTag, { BetweenTagData, buildScript, sessionInfo: sessionInfo2 }));
      data = NextDataAfterClose;
    }
    let textBuild = new StringTracker(data.DefaultInfoText);
    for (const i of promiseBuild) {
      textBuild = this.CheckDoubleSpace(textBuild, await i);
    }
    return this.CheckMinHTML(this.CheckDoubleSpace(textBuild, data));
  }
  RemoveUnnecessarySpace(code) {
    code = code.trim();
    code = code.replaceAll(/%>[ ]+<%(?![=:])/, "%><%");
    return code;
  }
  async Insert(data, pathName, buildScript, sessionInfo2) {
    data = data.replace(/<!--[\w\W]+?-->/, "");
    data = await this.StartReplace(data, pathName, sessionInfo2.fullPath, sessionInfo2.smallPath, buildScript, sessionInfo2);
    data = data.replace(/<\:reader+( )*\/>/gi, '<%typeof page.codebase == "function" ? page.codebase(): write(page.codebase)%>');
    return this.RemoveUnnecessarySpace(data);
  }
};

// src/CompileCode/ScriptTemplate.ts
import path13 from "path";
var createPageSourceMap = class extends SourceMapBasic {
  constructor(filePath) {
    super(filePath, false);
  }
  addMappingFromTrack(track) {
    const DataArray = track.getDataArray(), length = DataArray.length;
    let waitNextLine = true;
    for (let index = 0; index < length; index++) {
      const { text, line, info } = DataArray[index];
      if (text == "\n") {
        this.lineCount++;
        waitNextLine = false;
        continue;
      }
      if (!waitNextLine && line && info) {
        waitNextLine = true;
        this.map.addMapping({
          original: { line, column: 0 },
          generated: { line: this.lineCount, column: 0 },
          source: this.getSource(info)
        });
      }
    }
  }
};
var PageTemplate = class extends JSParser {
  static CreateSourceMap(text, filePath) {
    const storeMap = new createPageSourceMap(filePath);
    storeMap.addMappingFromTrack(text);
    return storeMap.mapAsURLComment();
  }
  static async AddPageTemplate(text, fullPathCompile, sessionInfo2) {
    text = await finalizeBuild(text, sessionInfo2, fullPathCompile);
    if (sessionInfo2.debug) {
      text.AddTextBeforeNoTrack(`try {
`);
    }
    text.AddTextBeforeNoTrack(`
        module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "${JSParser.fixTextSimpleQuotes(sessionInfo2.fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path13.dirname(sessionInfo2.fullPath))}";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {`);
    if (sessionInfo2.debug) {
      text.AddTextAfterNoTrack(`
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\\n( )*at /)[2];
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }`);
    }
    text.AddTextAfterNoTrack(`}});}`);
    if (sessionInfo2.debug) {
      text.Plus(PageTemplate.CreateSourceMap(text, fullPathCompile));
    }
    return text;
  }
  static async BuildPage(text, fullPathCompile, sessionInfo2) {
    const builtCode = await PageTemplate.RunAndExport(text, sessionInfo2.fullPath, sessionInfo2.debug);
    return PageTemplate.AddPageTemplate(builtCode, fullPathCompile, sessionInfo2);
  }
  static AddAfterBuild(text, isDebug) {
    if (isDebug) {
      text = "require('source-map-support').install();" + text;
    }
    return text;
  }
  static InPageTemplate(text, dataObject, fullPath) {
    text.AddTextBeforeNoTrack(`<%!{
            const _page = page;
            {
            const page = {..._page${dataObject ? "," + dataObject : ""}};
            const __filename = "${JSParser.fixTextSimpleQuotes(fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path13.dirname(fullPath))}";
            const require = (p) => _require(__filename, __dirname, page, p);
            const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
            const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {%>`);
    text.AddTextAfterNoTrack("<%!}}}%>");
    return text;
  }
};

// src/Plugins/Syntax/Index.ts
function GetSyntax(CompileType) {
  let func;
  switch (CompileType.name || CompileType) {
    case "Razor":
      func = ConvertSyntax;
      break;
  }
  return func;
}

// src/Plugins/Index.ts
var AddPlugin = class {
  constructor(SettingsObject) {
    this.SettingsObject = SettingsObject;
  }
  get defaultSyntax() {
    return this.SettingsObject.BasicCompilationSyntax.concat(this.SettingsObject.AddCompileSyntax);
  }
  async BuildBasic(text, OData, path23, pathName, sessionInfo2) {
    if (!OData) {
      return text;
    }
    if (!Array.isArray(OData)) {
      OData = [OData];
    }
    for (const i of OData) {
      const Syntax = await GetSyntax(i);
      if (Syntax) {
        text = await Syntax(text, i, path23, pathName, sessionInfo2);
      }
    }
    return text;
  }
  async BuildPage(text, path23, pathName, sessionInfo2) {
    text = await this.BuildBasic(text, this.defaultSyntax, path23, pathName, sessionInfo2);
    return text;
  }
  async BuildComponent(text, path23, pathName, sessionInfo2) {
    text = await this.BuildBasic(text, this.defaultSyntax, path23, pathName, sessionInfo2);
    return text;
  }
};

// src/CompileCode/transform/Script.ts
import { transform as transform5 } from "sucrase";
import { minify as minify6 } from "terser";
async function ReplaceBefore2(code, defineData) {
  code = await EasySyntax.BuildAndExportImports(code, defineData);
  return code;
}
function ErrorTemplate(info) {
  return `module.exports = () => (DataObject) => DataObject.out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;">Syntax Error: ${info.replaceAll("\n", "<br/>")}</p>'`;
}
function ReplaceAfter(code) {
  return code.replace('"use strict";', "").replace('Object.defineProperty(exports, "__esModule", {value: true});', "");
}
async function BuildScript3(text, isTypescript, isDebug, removeToModule) {
  text = text.trim();
  const Options = {
    transforms: ["imports"]
  }, define = {
    debug: "" + isDebug
  };
  if (isTypescript) {
    Options.transforms.push("typescript");
  }
  let Result = { code: "" };
  try {
    Result = transform5(await ReplaceBefore2(text.eq, define), Options);
    Result.code = ReplaceAfter(Result.code);
  } catch (err) {
    const errorMessage = text.debugLine(err);
    PrintIfNew({
      errorName: "compilation-error",
      text: errorMessage
    });
    if (isDebug)
      Result.code = ErrorTemplate(errorMessage);
  }
  if (!isDebug && !removeToModule) {
    try {
      Result.code = (await minify6(Result.code, { module: false })).code;
    } catch (err) {
      PrintIfNew({
        errorName: "minify",
        text: text.debugLine(err)
      });
    }
  }
  return Result.code;
}

// src/BuildInComponents/Settings.ts
var Settings2 = {
  plugins: []
};

// src/CompileCode/InsertModels.ts
var Settings3 = { AddCompileSyntax: [], plugins: [], BasicCompilationSyntax: ["Razor"] };
var PluginBuild = new AddPlugin(Settings3);
var Components = new InsertComponent(PluginBuild);
function GetPlugin(name2) {
  return Settings3.plugins.find((b) => b == name2 || b?.name == name2);
}
function SomePlugins(...data) {
  return data.some((x) => GetPlugin(x));
}
function isTs() {
  return Settings3.AddCompileSyntax.includes("TypeScript");
}
Components.MicroPlugins = Settings3.plugins;
Components.GetPlugin = GetPlugin;
Components.SomePlugins = SomePlugins;
Components.isTs = isTs;
Settings2.plugins = Settings3.plugins;
async function outPage(data, scriptFile, pagePath, pageName, LastSmallPath, sessionInfo2) {
  const baseData = new ParseBasePage(data, isTs());
  await baseData.loadSettings(sessionInfo2, pagePath, LastSmallPath, pageName);
  const modelName = baseData.popAny("model")?.eq;
  if (!modelName)
    return scriptFile.Plus(baseData.scriptFile, baseData.clearData);
  data = baseData.clearData;
  const { SmallPath, FullPath: FullPath2 } = CreateFilePath(pagePath, LastSmallPath, modelName, "Models", BasicSettings.pageTypes.model);
  if (!await EasyFs_default.existsFile(FullPath2)) {
    const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;
    print.error(ErrorMessage);
    return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
  }
  await sessionInfo2.dependence(SmallPath, FullPath2);
  const baseModelData = await AddDebugInfo(pageName, FullPath2, SmallPath);
  let modelData = ParseBasePage.rebuildBaseInheritance(baseModelData.allData);
  modelData.AddTextBeforeNoTrack(baseModelData.stringInfo);
  pageName += " -> " + SmallPath;
  const allData = searchForCutMain(modelData, [""], ":", false, true);
  if (allData.error) {
    print.error("Error within model ->", modelName, "at page: ", pageName);
    return data;
  }
  modelData = allData.data;
  const tagArray = allData.found.map((x) => x.tag.substring(1));
  const outData = searchForCutMain(data, tagArray, "@");
  if (outData.error) {
    print.error("Error With model ->", modelName, "at page: ", pageName);
    return data;
  }
  const modelBuild = new StringTracker();
  for (const i of allData.found) {
    i.tag = i.tag.substring(1);
    const holderData = outData.found.find((e) => e.tag == "@" + i.tag);
    modelBuild.Plus(modelData.substring(0, i.loc));
    modelData = modelData.substring(i.loc);
    if (holderData) {
      modelBuild.Plus(holderData.data);
    } else {
      const loadFromBase = baseData.pop(i.tag);
      if (loadFromBase && loadFromBase.eq.toLowerCase() != "inherit")
        modelBuild.Plus(loadFromBase);
    }
  }
  modelBuild.Plus(modelData);
  return await outPage(modelBuild, scriptFile.Plus(baseData.scriptFile), FullPath2, pageName, SmallPath, sessionInfo2);
}
async function Insert(data, fullPathCompile, nestedPage, nestedPageData, sessionInfo2) {
  const BuildScriptWithPrams = (code, RemoveToModule = true) => BuildScript3(code, isTs(), sessionInfo2.debug, RemoveToModule);
  let DebugString = new StringTracker(sessionInfo2.smallPath, data);
  DebugString = await outPage(DebugString, new StringTracker(DebugString.DefaultInfoText), sessionInfo2.fullPath, sessionInfo2.smallPath, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await PluginBuild.BuildPage(DebugString, sessionInfo2.fullPath, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await Components.Insert(DebugString, sessionInfo2.smallPath, BuildScriptWithPrams, sessionInfo2);
  DebugString = await ParseDebugLine(DebugString, sessionInfo2.smallPath);
  if (nestedPage) {
    return PageTemplate.InPageTemplate(DebugString, nestedPageData, sessionInfo2.fullPath);
  }
  DebugString = await PageTemplate.BuildPage(DebugString, fullPathCompile, sessionInfo2);
  let DebugStringAsBuild = await BuildScriptWithPrams(DebugString);
  DebugStringAsBuild = PageTemplate.AddAfterBuild(DebugStringAsBuild, sessionInfo2.debug);
  return DebugStringAsBuild;
}

// src/ImportFiles/StaticFiles.ts
import path15 from "path";

// src/ImportFiles/ForStatic/Script.ts
import { transform as transform6 } from "sucrase";
import { minify as minify7 } from "terser";
async function BuildScript4(inputPath, type, isDebug, moreOptions, haveDifferentSource = true) {
  const AddOptions = __spreadValues(__spreadValues({
    transforms: [],
    sourceMapOptions: {
      compiledFilename: "/" + inputPath
    },
    filePath: inputPath
  }, GetPlugin("transformOptions")), moreOptions);
  const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
  let result = await EasyFs_default.readFile(fullPath);
  try {
    const { code, sourceMap } = transform6(result, AddOptions);
    result = code;
    if (isDebug && haveDifferentSource) {
      sourceMap.sources = sourceMap.sources.map((x) => x.split(/\/|\\/).pop() + "?source=true");
      result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(JSON.stringify(sourceMap)).toString("base64");
    }
  } catch (err) {
    PrintIfNew({
      errorName: "compilation-error",
      text: `${err.message}, on file -> ${fullPath}:${err?.loc?.line ?? 0}:${err?.loc?.column ?? 0}`
    });
  }
  if (SomePlugins("Min" + type.toUpperCase()) || SomePlugins("MinAll")) {
    try {
      result = (await minify7(result, { module: false })).code;
    } catch (err) {
      PrintIfNew({
        errorName: "minify",
        text: `${err.message} on file -> ${fullPath}`
      });
    }
  }
  await EasyFs_default.makePathReal(inputPath, getTypes.Static[1]);
  await EasyFs_default.writeFile(fullCompilePath, result);
  return {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  };
}
function BuildJS(inStaticPath, isDebug) {
  return BuildScript4(inStaticPath, "js", isDebug, void 0, false);
}
function BuildTS(inStaticPath, isDebug) {
  return BuildScript4(inStaticPath, "ts", isDebug, { transforms: ["typescript"] });
}
function BuildJSX(inStaticPath, isDebug) {
  return BuildScript4(inStaticPath, "jsx", isDebug, __spreadProps(__spreadValues({}, GetPlugin("JSXOptions") ?? {}), { transforms: ["jsx"] }));
}
function BuildTSX(inStaticPath, isDebug) {
  return BuildScript4(inStaticPath, "tsx", isDebug, __spreadValues({ transforms: ["typescript", "jsx"] }, GetPlugin("TSXOptions") ?? {}));
}

// src/ImportFiles/ForStatic/Style.ts
import sass3 from "sass";
import path14 from "path";
import { fileURLToPath as fileURLToPath6, pathToFileURL as pathToFileURL3 } from "url";
async function BuildStyleSass(inputPath, type, isDebug) {
  const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
  const dependenceObject = {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  };
  const fileData = await EasyFs_default.readFile(fullPath), fileDataDirname = path14.dirname(fullPath);
  try {
    const result = await sass3.compileStringAsync(fileData, {
      sourceMap: isDebug,
      syntax: sassSyntax(type),
      style: sassStyle(type, SomePlugins),
      logger: sass3.Logger.silent,
      importer: createImporter(fullPath)
    });
    let data = result.css;
    if (isDebug && result.sourceMap) {
      sassAndSource(result.sourceMap, pathToFileURL3(fileData).href);
      result.sourceMap.sources = result.sourceMap.sources.map((x) => path14.relative(fileDataDirname, fileURLToPath6(x)) + "?source=true");
      data += `\r
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(result.sourceMap)).toString("base64")}*/`;
    }
    await EasyFs_default.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs_default.writeFile(fullCompilePath, data);
  } catch (expression) {
    PrintIfNew({
      text: `${expression.message}, on file -> ${fullPath}${expression.line ? ":" + expression.line : ""}`,
      errorName: expression?.status == 5 ? "sass-warning" : "sass-error",
      type: expression?.status == 5 ? "warn" : "error"
    });
  }
  return dependenceObject;
}

// src/ImportFiles/StaticFiles.ts
import fs2 from "fs";
import promptly from "promptly";
import { argv } from "process";
var SupportedTypes = ["js", "svelte", "ts", "jsx", "tsx", "css", "sass", "scss"];
var StaticFilesInfo = new StoreJSON("StaticFiles");
async function CheckDependencyChange2(path23) {
  const o = StaticFilesInfo.store[path23];
  for (const i in o) {
    let p = i;
    if (i == "thisFile") {
      p = getTypes.Static[2] + "/" + path23;
    }
    const FilePath = BasicSettings.fullWebSitePath + p;
    if (await EasyFs_default.stat(FilePath, "mtimeMs", true) != o[i]) {
      return true;
    }
  }
  return !o;
}
async function BuildFile(SmallPath, isDebug, fullCompilePath) {
  const ext = path15.extname(SmallPath).substring(1).toLowerCase();
  let dependencies;
  switch (ext) {
    case "js":
      dependencies = await BuildJS(SmallPath, isDebug);
      break;
    case "ts":
      dependencies = await BuildTS(SmallPath, isDebug);
      break;
    case "jsx":
      dependencies = await BuildJSX(SmallPath, isDebug);
      break;
    case "tsx":
      dependencies = await BuildTSX(SmallPath, isDebug);
      break;
    case "css":
    case "sass":
    case "scss":
      dependencies = await BuildStyleSass(SmallPath, ext, isDebug);
      break;
    case "svelte":
      dependencies = await BuildScript(SmallPath, isDebug);
      fullCompilePath += ".js";
  }
  if (isDebug && await EasyFs_default.existsFile(fullCompilePath)) {
    StaticFilesInfo.update(SmallPath, dependencies);
    return true;
  }
  if (!isDebug)
    return true;
}
var staticFiles = SystemData + "/../static/client/";
var getStatic = [
  {
    path: "serv/temp.js",
    type: "js",
    inServer: staticFiles + "buildTemplate.js"
  },
  {
    path: "serv/connect.js",
    type: "js",
    inServer: staticFiles + "makeConnection.js"
  }
];
var getStaticFilesType = [
  {
    ext: ".pub.js",
    type: "js"
  },
  {
    ext: ".pub.mjs",
    type: "js"
  },
  {
    ext: ".pub.css",
    type: "css"
  }
];
async function serverBuildByType(Request, filePath, checked) {
  const found = getStaticFilesType.find((x) => filePath.endsWith(x.ext));
  if (!found)
    return;
  const basePath = Request.query.t == "l" ? getTypes.Logs[1] : getTypes.Static[1];
  const inServer = path15.join(basePath, filePath);
  if (checked || await EasyFs_default.existsFile(inServer))
    return __spreadProps(__spreadValues({}, found), { inServer });
}
var debuggingWithSource = null;
if (argv.includes("allowSourceDebug"))
  debuggingWithSource = true;
async function askDebuggingWithSource() {
  if (typeof debuggingWithSource == "boolean")
    return debuggingWithSource;
  try {
    debuggingWithSource = (await promptly.prompt("Allow debugging JavaScript/CSS in source page? - exposing your source code (no)", {
      validator(v) {
        if (["yes", "no"].includes(v.trim().toLowerCase()))
          return v;
        throw new Error("yes or no");
      },
      timeout: 1e3 * 30
    })).trim().toLowerCase() == "yes";
  } catch {
  }
  return debuggingWithSource;
}
var safeFolders = [getTypes.Static[2], getTypes.Logs[2], "Models", "Components"];
async function unsafeDebug(isDebug, filePath, checked) {
  if (!isDebug || GetPlugin("SafeDebug") || path15.extname(filePath) != ".source" || !safeFolders.includes(filePath.split(/\/|\\/).shift()) || !await askDebuggingWithSource())
    return;
  const fullPath = path15.join(BasicSettings.fullWebSitePath, filePath.substring(0, filePath.length - 7));
  if (checked || await EasyFs_default.existsFile(fullPath))
    return {
      type: "html",
      inServer: fullPath
    };
}
async function svelteStyle(filePath, checked, isDebug) {
  const baseFilePath = filePath.substring(0, filePath.length - 4);
  const fullPath = getTypes.Static[1] + filePath;
  let exists2;
  if (path15.extname(baseFilePath) == ".svelte" && (checked || (exists2 = await EasyFs_default.existsFile(fullPath))))
    return {
      type: "css",
      inServer: fullPath
    };
  if (isDebug && exists2) {
    await BuildFile(baseFilePath, isDebug, getTypes.Static[1] + baseFilePath);
    return svelteStyle(filePath, checked, false);
  }
}
async function svelteStatic(filePath, checked) {
  if (!filePath.startsWith("serv/svelte/"))
    return;
  const fullPath = workingDirectory + "node_modules" + filePath.substring(4) + (path15.extname(filePath) ? "" : "/index.mjs");
  if (checked || await EasyFs_default.existsFile(fullPath))
    return {
      type: "js",
      inServer: fullPath
    };
}
async function markdownCodeTheme(filePath, checked) {
  if (!filePath.startsWith("serv/md/code-theme/"))
    return;
  const fullPath = workingDirectory + "node_modules/highlight.js/styles" + filePath.substring(18);
  if (checked || await EasyFs_default.existsFile(fullPath))
    return {
      type: "css",
      inServer: fullPath
    };
}
async function markdownTheme(filePath, checked) {
  if (!filePath.startsWith("serv/md/theme/"))
    return;
  let fileName = filePath.substring(14);
  if (fileName.startsWith("auto"))
    fileName = fileName.substring(4);
  else
    fileName = "-" + fileName;
  const fullPath = workingDirectory + "node_modules/github-markdown-css/github-markdown" + fileName.replace(".css", ".min.css");
  if (checked || await EasyFs_default.existsFile(fullPath))
    return {
      type: "css",
      inServer: fullPath
    };
}
async function serverBuild(Request, isDebug, path23, checked = false) {
  return await svelteStatic(path23, checked) || await svelteStyle(path23, checked, isDebug) || await unsafeDebug(isDebug, path23, checked) || await serverBuildByType(Request, path23, checked) || await markdownTheme(path23, checked) || await markdownCodeTheme(path23, checked) || getStatic.find((x) => x.path == path23);
}
async function GetFile(SmallPath, isDebug, Request, Response) {
  const isBuildIn = await serverBuild(Request, isDebug, SmallPath, true);
  if (isBuildIn) {
    Response.type(isBuildIn.type);
    Response.end(await EasyFs_default.readFile(isBuildIn.inServer));
    return;
  }
  const fullCompilePath = getTypes.Static[1] + SmallPath;
  const fullPath = getTypes.Static[0] + SmallPath;
  const ext = path15.extname(SmallPath).substring(1).toLowerCase();
  if (!SupportedTypes.includes(ext)) {
    Response.sendFile(fullPath);
    return;
  }
  if (["sass", "scss", "css"].includes(ext)) {
    Response.type("css");
  } else {
    Response.type("js");
  }
  let resPath = fullCompilePath;
  if (isDebug && (Request.query.source == "true" || await CheckDependencyChange2(SmallPath) && !await BuildFile(SmallPath, isDebug, fullCompilePath))) {
    resPath = fullPath;
  } else if (ext == "svelte")
    resPath += ".js";
  Response.end(await fs2.promises.readFile(resPath, "utf8"));
}

// src/RunTimeBuild/SearchPages.ts
import path18 from "path";

// src/RunTimeBuild/CompileState.ts
import path16 from "path";

// src/MainBuild/ImportModule.ts
async function StartRequire(array, isDebug) {
  const arrayFuncServer = [];
  for (let i of array) {
    i = AddExtension(i);
    const b = await LoadImport("root folder (WWW)", i, getTypes.Static, isDebug);
    if (b && typeof b.StartServer == "function") {
      arrayFuncServer.push(b.StartServer);
    } else {
      print.log(`Can't find StartServer function at module - ${i}
`);
    }
  }
  return arrayFuncServer;
}
var lastSettingsImport;
async function GetSettings(filePath, isDebug) {
  if (await EasyFs_default.existsFile(filePath + ".ts")) {
    filePath += ".ts";
  } else {
    filePath += ".js";
  }
  const changeTime = await EasyFs_default.stat(filePath, "mtimeMs", true, null);
  if (changeTime == lastSettingsImport || !changeTime)
    return null;
  lastSettingsImport = changeTime;
  const data = await RequireOnce(filePath, isDebug);
  return data.default;
}
function getSettingsDate() {
  return lastSettingsImport;
}

// src/RunTimeBuild/CompileState.ts
var _CompileState = class {
  constructor() {
    this.state = { update: 0, pageArray: [], importArray: [], fileArray: [] };
    this.state.update = getSettingsDate();
  }
  get scripts() {
    return this.state.importArray;
  }
  get pages() {
    return this.state.pageArray;
  }
  get files() {
    return this.state.fileArray;
  }
  addPage(path23, type) {
    if (!this.state.pageArray.find((x) => x[0] == path23 && x[1] == type))
      this.state.pageArray.push([path23, type]);
  }
  addImport(path23) {
    if (!this.state.importArray.includes(path23))
      this.state.importArray.push(path23);
  }
  addFile(path23) {
    if (!this.state.fileArray.includes(path23))
      this.state.fileArray.push(path23);
  }
  export() {
    return EasyFs_default.writeJsonFile(_CompileState.filePath, this.state);
  }
  static async checkLoad() {
    if (!await EasyFs_default.existsFile(this.filePath))
      return;
    const state = new _CompileState();
    state.state = await EasyFs_default.readJsonFile(this.filePath);
    if (state.state.update != getSettingsDate())
      return;
    return state;
  }
};
var CompileState = _CompileState;
CompileState.filePath = path16.join(SystemData, "CompileState.json");

// src/CompileCode/Session.ts
var StaticFilesInfo2 = new StoreJSON("ShortScriptNames");
var SessionBuild = class {
  constructor(smallPath2, fullPath, typeName, debug, _safeDebug) {
    this.smallPath = smallPath2;
    this.fullPath = fullPath;
    this.typeName = typeName;
    this.debug = debug;
    this._safeDebug = _safeDebug;
    this.connectorArray = [];
    this.scriptURLSet = [];
    this.styleURLSet = [];
    this.inScriptStyle = [];
    this.headHTML = "";
    this.cache = {
      style: [],
      script: [],
      scriptModule: []
    };
    this.cacheCompileScript = {};
    this.cacheComponent = {};
    this.compileRunTimeStore = {};
    this.dependencies = {};
    this.recordNames = [];
  }
  get safeDebug() {
    return this.debug && this._safeDebug;
  }
  style(url, attributes) {
    if (this.styleURLSet.find((x) => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes)))
      return;
    this.styleURLSet.push({ url, attributes });
  }
  script(url, attributes) {
    if (this.scriptURLSet.find((x) => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes)))
      return;
    this.scriptURLSet.push({ url, attributes });
  }
  record(name2) {
    if (!this.recordNames.includes(name2))
      this.recordNames.push(name2);
  }
  async dependence(smallPath2, fullPath = BasicSettings.fullWebSitePath + smallPath2) {
    if (this.dependencies[smallPath2])
      return;
    const haveDep = await EasyFs_default.stat(fullPath, "mtimeMs", true, null);
    if (haveDep) {
      this.dependencies[smallPath2] = haveDep;
      return true;
    }
  }
  addScriptStyle(type, smallPath2 = this.smallPath) {
    let data = this.inScriptStyle.find((x) => x.type == type && x.path == smallPath2);
    if (!data) {
      data = { type, path: smallPath2, value: new SourceMapStore(smallPath2, this.safeDebug, type == "style", true) };
      this.inScriptStyle.push(data);
    }
    return data.value;
  }
  addScriptStylePage(type, dataTag2, info) {
    return this.addScriptStyle(type, parseTagDataStringBoolean(dataTag2, "page") ? this.smallPath : info.extractInfo());
  }
  static createName(text) {
    let length = 0;
    let key;
    const values = Object.values(StaticFilesInfo2.store);
    while (key == null || values.includes(key)) {
      key = createId(text, 5 + length).substring(length);
      length++;
    }
    return key;
  }
  addHeadTags() {
    const isLogs = this.typeName == getTypes.Logs[2];
    for (const i of this.inScriptStyle) {
      const saveLocation = i.path == this.smallPath && isLogs ? getTypes.Logs[1] : getTypes.Static[1], addQuery = isLogs ? "?t=l" : "";
      let url = StaticFilesInfo2.have(i.path, () => SessionBuild.createName(i.path)) + ".pub";
      switch (i.type) {
        case "script":
          url += ".js";
          this.script("/" + url + addQuery, { defer: null });
          break;
        case "module":
          url += ".mjs";
          this.script("/" + url + addQuery, { type: "module" });
          break;
        case "style":
          url += ".css";
          this.style("/" + url + addQuery);
          break;
      }
      EasyFs_default.writeFile(saveLocation + url, i.value.createDataWithMap());
    }
  }
  buildHead() {
    this.addHeadTags();
    const makeAttributes = (i) => i.attributes ? " " + Object.keys(i.attributes).map((x) => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(" ") : "";
    const addTypeInfo = this.typeName == getTypes.Logs[2] ? "?t=l" : "";
    let buildBundleString = "";
    for (const i of this.styleURLSet)
      buildBundleString += `<link rel="stylesheet" href="${i.url + addTypeInfo}"${makeAttributes(i)}/>`;
    for (const i of this.scriptURLSet)
      buildBundleString += `<script src="${i.url + addTypeInfo}"${makeAttributes(i)}><\/script>`;
    return buildBundleString + this.headHTML;
  }
  extends(from) {
    this.connectorArray.push(...from.connectorArray);
    this.scriptURLSet.push(...from.scriptURLSet);
    this.styleURLSet.push(...from.styleURLSet);
    for (const i of from.inScriptStyle) {
      this.inScriptStyle.push(__spreadProps(__spreadValues({}, i), { value: i.value.clone() }));
    }
    const copyObjects = ["cacheCompileScript", "cacheComponent", "dependencies"];
    for (const c of copyObjects) {
      Object.assign(this[c], from[c]);
    }
    this.recordNames.push(...from.recordNames.filter((x) => !this.recordNames.includes(x)));
    this.headHTML += from.headHTML;
    this.cache.style.push(...from.cache.style);
    this.cache.script.push(...from.cache.script);
    this.cache.scriptModule.push(...from.cache.scriptModule);
  }
};

// src/RunTimeBuild/SearchPages.ts
import { argv as argv2 } from "process";

// src/RunTimeBuild/SiteMap.ts
import path17 from "path";

// src/RunTimeBuild/FileTypes.ts
function isFileType(types, name2) {
  name2 = name2.toLowerCase();
  for (const type of types) {
    if (name2.endsWith("." + type)) {
      return true;
    }
  }
  return false;
}
function RemoveEndType(string) {
  return string.substring(0, string.lastIndexOf("."));
}

// src/RunTimeBuild/SiteMap.ts
async function FilesInFolder(arrayType, path23, state) {
  const allInFolder = await EasyFs_default.readdir(arrayType[0] + path23, { withFileTypes: true });
  const promises3 = [];
  for (const i of allInFolder) {
    const n = i.name, connect = path23 + n;
    if (i.isDirectory()) {
      promises3.push(FilesInFolder(arrayType, connect + "/", state));
    } else {
      if (isFileType(BasicSettings.pageTypesArray, n)) {
        state.addPage(connect, arrayType[2]);
      } else if (arrayType == getTypes.Static && isFileType(BasicSettings.ReqFileTypesArray, n)) {
        state.addImport(connect);
      } else {
        state.addFile(connect);
      }
    }
  }
  return Promise.all(promises3);
}
async function scanFiles() {
  const state = new CompileState();
  await Promise.all([
    FilesInFolder(getTypes.Static, "", state),
    FilesInFolder(getTypes.Logs, "", state)
  ]);
  return state;
}
async function debugSiteMap(Export4) {
  return createSiteMap(Export4, await scanFiles());
}
async function createSiteMap(Export4, state) {
  const { routing, development } = Export4;
  if (!routing.sitemap)
    return;
  const sitemap = routing.sitemap === true ? {} : routing.sitemap;
  Object.assign(sitemap, {
    rules: true,
    urlStop: false,
    errorPages: false,
    validPath: true
  });
  const pages = [];
  urls:
    for (let [url, type] of state.pages) {
      if (type != getTypes.Static[2] || !url.endsWith("." + BasicSettings.pageTypes.page))
        continue;
      url = "/" + url.substring(0, url.length - BasicSettings.pageTypes.page.length - 1);
      if (path17.extname(url) == ".serv")
        continue;
      if (sitemap.urlStop) {
        for (const path23 in routing.urlStop) {
          if (url.startsWith(path23)) {
            url = path23;
          }
          break;
        }
      }
      if (sitemap.rules) {
        for (const path23 in routing.rules) {
          if (url.startsWith(path23)) {
            url = await routing.rules[path23](url);
            break;
          }
        }
      }
      if (routing.ignoreTypes.find((ends) => url.endsWith("." + ends)) || routing.ignorePaths.find((start) => url.startsWith(start)))
        continue;
      if (sitemap.validPath) {
        for (const func of routing.validPath) {
          if (!await func(url))
            continue urls;
        }
      }
      if (!sitemap.errorPages) {
        for (const error in routing.errorPages) {
          const path23 = "/" + routing.errorPages[error].path;
          if (url.startsWith(path23)) {
            continue urls;
          }
        }
      }
      pages.push(url);
    }
  let write = true;
  if (sitemap.file) {
    const fileAction = await ImportFile("Sitemap Import", sitemap.file, getTypes.Static, development);
    if (!fileAction?.Sitemap) {
      dump.warn("'Sitemap' function not found on file -> " + sitemap.file);
    } else {
      write = await fileAction.Sitemap(pages, state, Export4);
    }
  }
  if (write && pages.length) {
    const path23 = write === true ? "sitemap.txt" : write;
    state.addFile(path23);
    await EasyFs_default.writeFile(getTypes.Static[0] + path23, pages.join("\n"));
  }
}

// src/RunTimeBuild/SearchPages.ts
async function compileFile(filePath, arrayType, isDebug, hasSessionInfo, nestedPage, nestedPageData) {
  const FullFilePath = path18.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + ".cjs";
  const html2 = await EasyFs_default.readFile(FullFilePath, "utf8");
  const ExcluUrl = (nestedPage ? nestedPage + "<line>" : "") + arrayType[2] + "/" + filePath;
  const sessionInfo2 = hasSessionInfo ?? new SessionBuild(arrayType[2] + "/" + filePath, FullFilePath, arrayType[2], isDebug, GetPlugin("SafeDebug"));
  await sessionInfo2.dependence("thisPage", FullFilePath);
  const CompiledData = await Insert(html2, FullPathCompile, Boolean(nestedPage), nestedPageData, sessionInfo2);
  if (!nestedPage) {
    await EasyFs_default.writeFile(FullPathCompile, CompiledData);
    pageDeps.update(RemoveEndType(ExcluUrl), sessionInfo2.dependencies);
  }
  return { CompiledData, sessionInfo: sessionInfo2 };
}
async function FilesInFolder2(arrayType, path23, state) {
  const allInFolder = await EasyFs_default.readdir(arrayType[0] + path23, { withFileTypes: true });
  for (const i of allInFolder) {
    const n = i.name, connect = path23 + n;
    if (i.isDirectory()) {
      await EasyFs_default.mkdir(arrayType[1] + connect);
      await FilesInFolder2(arrayType, connect + "/", state);
    } else {
      if (isFileType(BasicSettings.pageTypesArray, n)) {
        state.addPage(connect, arrayType[2]);
        if (await CheckDependencyChange(arrayType[2] + "/" + connect))
          await compileFile(connect, arrayType, false);
      } else if (arrayType == getTypes.Static && isFileType(BasicSettings.ReqFileTypesArray, n)) {
        state.addImport(connect);
        await LoadImport("Production Loader - " + arrayType[2], connect, arrayType, false);
      } else {
        state.addFile(connect);
        await BuildFile(connect, false);
      }
    }
  }
}
async function RequireScripts(scripts) {
  for (const path23 of scripts) {
    await LoadImport("Production Loader", path23, getTypes.Static, false);
  }
}
async function CreateCompile(t, state) {
  const types = getTypes[t];
  await DeleteInDirectory(types[1]);
  return () => FilesInFolder2(types, "", state);
}
async function FastCompileInFile(path23, arrayType, sessionInfo2, nestedPage, nestedPageData) {
  await EasyFs_default.makePathReal(path23, arrayType[1]);
  return await compileFile(path23, arrayType, true, sessionInfo2, nestedPage, nestedPageData);
}
async function FastCompile(path23, arrayType) {
  await FastCompileInFile(path23, arrayType);
  ClearWarning();
}
async function compileAll(Export4) {
  let state = !argv2.includes("rebuild") && await CompileState.checkLoad();
  if (state)
    return () => RequireScripts(state.scripts);
  pageDeps.clear();
  state = new CompileState();
  perCompile2();
  const activateArray = [await CreateCompile(getTypes.Static[2], state), await CreateCompile(getTypes.Logs[2], state), ClearWarning];
  return async () => {
    for (const i of activateArray) {
      await i();
    }
    await createSiteMap(Export4, state);
    state.export();
    postCompile2();
  };
}

// src/RunTimeBuild/FunctionScript.ts
var FunctionScript_exports = {};
__export(FunctionScript_exports, {
  BuildPage: () => BuildPage,
  Export: () => Export,
  LoadPage: () => LoadPage,
  SplitFirst: () => SplitFirst,
  getFullPathCompile: () => getFullPathCompile
});
import path20 from "path";

// src/RunTimeBuild/ImportFileRuntime.ts
import path19 from "path";
var CacheRequireFiles = {};
async function makeDependencies(dependencies, typeArray, basePath = "", cache = {}) {
  const dependenciesMap = {};
  const promiseAll = [];
  for (const [filePath, value2] of Object.entries(dependencies)) {
    promiseAll.push((async () => {
      if (filePath == "thisFile") {
        if (!cache[basePath])
          cache[basePath] = await EasyFs_default.stat(typeArray[0] + basePath, "mtimeMs", true);
        dependenciesMap["thisFile"] = cache[basePath];
      } else {
        dependenciesMap[filePath] = await makeDependencies(value2, typeArray, filePath, cache);
      }
    })());
  }
  await Promise.all(promiseAll);
  return dependenciesMap;
}
function compareDependenciesSame(oldDeps, newDeps2) {
  for (const name2 in oldDeps) {
    if (name2 == "thisFile") {
      if (newDeps2[name2] != oldDeps[name2])
        return false;
    } else if (!compareDependenciesSame(oldDeps[name2], newDeps2[name2]))
      return false;
  }
  return true;
}
function getChangeArray(oldDeps, newDeps2, parent = "") {
  const changeArray = [];
  for (const name2 in oldDeps) {
    if (name2 == "thisFile") {
      if (newDeps2[name2] != oldDeps[name2]) {
        changeArray.push(parent);
        break;
      }
    } else if (!newDeps2[name2]) {
      changeArray.push(name2);
      break;
    } else {
      const change = getChangeArray(oldDeps[name2], newDeps2[name2], name2);
      if (change.length) {
        if (parent)
          changeArray.push(parent);
        changeArray.push(...change);
        break;
      }
    }
  }
  return changeArray;
}
async function RequireFile(filePath, __filename, __dirname, typeArray, LastRequire, isDebug) {
  const ReqFile = LastRequire[filePath];
  let fileExists, newDeps2;
  if (ReqFile) {
    if (!isDebug || isDebug && ReqFile.status == -1)
      return ReqFile.model;
    fileExists = await EasyFs_default.stat(typeArray[0] + ReqFile.path, "mtimeMs", true, 0);
    if (fileExists) {
      newDeps2 = await makeDependencies(ReqFile.dependencies, typeArray);
      if (compareDependenciesSame(ReqFile.dependencies, newDeps2))
        return ReqFile.model;
    } else if (ReqFile.status == 0)
      return ReqFile.model;
  }
  const copyPath = filePath;
  let static_modules = false;
  if (!ReqFile) {
    if (filePath[0] == ".") {
      if (filePath[1] == "/")
        filePath = filePath.substring(2);
      filePath = path19.join(path19.relative(typeArray[0], __dirname), filePath);
    } else if (filePath[0] != "/")
      static_modules = true;
    else
      filePath = filePath.substring(1);
  } else {
    filePath = ReqFile.path;
    static_modules = ReqFile.static;
  }
  if (static_modules)
    LastRequire[copyPath] = { model: await import(filePath), status: -1, static: true, path: filePath };
  else {
    filePath = AddExtension(filePath);
    const fullPath = typeArray[0] + filePath;
    fileExists = fileExists ?? await EasyFs_default.stat(fullPath, "mtimeMs", true, 0);
    if (fileExists) {
      const haveModel = CacheRequireFiles[filePath];
      if (haveModel && compareDependenciesSame(haveModel.dependencies, newDeps2 = newDeps2 ?? await makeDependencies(haveModel.dependencies, typeArray)))
        LastRequire[copyPath] = haveModel;
      else {
        newDeps2 = newDeps2 ?? {};
        LastRequire[copyPath] = { model: await ImportFile(__filename, filePath, typeArray, isDebug, newDeps2, haveModel && getChangeArray(haveModel.dependencies, newDeps2)), dependencies: newDeps2, path: filePath };
      }
    } else {
      LastRequire[copyPath] = { model: {}, status: 0, path: filePath };
      PrintIfNew({
        type: "warn",
        errorName: "import-not-exists",
        text: `Import '${filePath}' does not exists from '${__filename}'`
      });
    }
  }
  const builtModel = LastRequire[copyPath];
  CacheRequireFiles[builtModel.path] = builtModel;
  return builtModel.model;
}

// src/RunTimeBuild/FunctionScript.ts
var Export = {
  PageLoadRam: {},
  PageRam: true
};
async function RequirePage(filePath, __filename, __dirname, typeArray, LastRequire, DataObject) {
  const ReqFilePath = LastRequire[filePath];
  const resModel = () => ReqFilePath.model(DataObject);
  let fileExists;
  if (ReqFilePath) {
    if (!DataObject.isDebug)
      return resModel();
    if (ReqFilePath.date == -1) {
      fileExists = await EasyFs_default.existsFile(ReqFilePath.path);
      if (!fileExists)
        return resModel();
    }
  }
  const copyPath = filePath;
  let extname2 = path20.extname(filePath).substring(1);
  if (!extname2) {
    extname2 = BasicSettings.pageTypes.page;
    filePath += "." + extname2;
  }
  let fullPath;
  if (filePath[0] == ".") {
    if (filePath[1] == "/")
      filePath = filePath.substring(2);
    else
      filePath = filePath.substring(1);
    fullPath = path20.join(__dirname, filePath);
  } else
    fullPath = path20.join(typeArray[0], filePath);
  if (![BasicSettings.pageTypes.page, BasicSettings.pageTypes.component].includes(extname2)) {
    const importText = await EasyFs_default.readFile(fullPath);
    DataObject.write(importText);
    return importText;
  }
  fileExists = fileExists ?? await EasyFs_default.existsFile(fullPath);
  if (!fileExists) {
    PrintIfNew({
      type: "warn",
      errorName: "import-not-exists",
      text: `Import '${copyPath}' does not exists from '${__filename}'`
    });
    LastRequire[copyPath] = { model: () => {
    }, date: -1, path: fullPath };
    return LastRequire[copyPath].model;
  }
  const ForSavePath = typeArray[2] + "/" + filePath.substring(0, filePath.length - extname2.length - 1);
  const reBuild = DataObject.isDebug && (!await EasyFs_default.existsFile(typeArray[1] + filePath + ".cjs") || await CheckDependencyChange(ForSavePath));
  if (reBuild)
    await FastCompile(filePath, typeArray);
  if (Export.PageLoadRam[ForSavePath] && !reBuild) {
    LastRequire[copyPath] = { model: Export.PageLoadRam[ForSavePath][0] };
    return await LastRequire[copyPath].model(DataObject);
  }
  const func = await LoadPage(ForSavePath, extname2);
  if (Export.PageRam) {
    if (!Export.PageLoadRam[ForSavePath]) {
      Export.PageLoadRam[ForSavePath] = [];
    }
    Export.PageLoadRam[ForSavePath][0] = func;
  }
  LastRequire[copyPath] = { model: func };
  return await func(DataObject);
}
var GlobalVar = {};
function getFullPathCompile(url) {
  const SplitInfo = SplitFirst("/", url);
  const typeArray = getTypes[SplitInfo[0]];
  return typeArray[1] + SplitInfo[1] + "." + BasicSettings.pageTypes.page + ".cjs";
}
async function LoadPage(url, ext = BasicSettings.pageTypes.page) {
  const SplitInfo = SplitFirst("/", url);
  const typeArray = getTypes[SplitInfo[0]];
  const LastRequire = {};
  function _require(__filename, __dirname, DataObject, p) {
    return RequireFile(p, __filename, __dirname, typeArray, LastRequire, DataObject.isDebug);
  }
  function _include(__filename, __dirname, DataObject, p, WithObject = {}) {
    return RequirePage(p, __filename, __dirname, typeArray, LastRequire, __spreadValues(__spreadValues({}, WithObject), DataObject));
  }
  function _transfer(p, preserveForm, withObject, __filename, __dirname, DataObject) {
    DataObject.out_run_script.text = "";
    if (!preserveForm) {
      const postData = DataObject.Request.body ? {} : null;
      DataObject = __spreadProps(__spreadValues({}, DataObject), {
        Request: __spreadProps(__spreadValues({}, DataObject.Request), { files: {}, query: {}, body: postData }),
        Post: postData,
        Query: {},
        Files: {}
      });
    }
    return _include(__filename, __dirname, DataObject, p, withObject);
  }
  const compiledPath = path20.join(typeArray[1], SplitInfo[1] + "." + ext + ".cjs");
  const private_var = {};
  try {
    const MyModule = await redirectCJS_default(compiledPath);
    return MyModule(_require, _include, _transfer, private_var, handelConnectorService);
  } catch (e) {
    const debug__filename = url + "." + ext;
    print.error("Error path -> ", debug__filename, "->", e.message);
    print.error(e.stack);
    return (DataObject) => DataObject.out_run_script.text += `<div style="color:red;text-align:left;font-size:16px;"><p>Error path: ${debug__filename}</p><p>Error message: ${e.message}</p></div>`;
  }
}
function BuildPage(LoadPageFunc, run_script_name) {
  const PageVar = {};
  return async function(Response, Request, Post, Query, Cookies, Session, Files, isDebug) {
    const out_run_script = { text: "" };
    function ToStringInfo(str) {
      const asString = str?.toString?.();
      if (asString == null || asString.startsWith("[object Object]")) {
        return JSON.stringify(str, null, 2);
      }
      return asString;
    }
    function setResponse(text) {
      out_run_script.text = ToStringInfo(text);
    }
    function write(text = "") {
      out_run_script.text += ToStringInfo(text);
    }
    ;
    function writeSafe(str = "") {
      str = ToStringInfo(str);
      for (const i of str) {
        out_run_script.text += "&#" + i.charCodeAt(0) + ";";
      }
    }
    function echo(arr, ...params) {
      for (const i in params) {
        out_run_script.text += arr[i];
        writeSafe(params[i]);
      }
      out_run_script.text += arr.at(-1);
    }
    let redirectPath = false;
    Response.redirect = (path23, status) => {
      redirectPath = String(path23);
      if (status != null) {
        Response.status(status);
      }
      return Response;
    };
    Response.reload = () => {
      Response.redirect(Request.url);
    };
    function sendFile(filePath, deleteAfter = false) {
      redirectPath = { file: filePath, deleteAfter };
    }
    const DataSend = {
      sendFile,
      writeSafe,
      write,
      echo,
      setResponse,
      out_run_script,
      run_script_name,
      Response,
      Request,
      Post,
      Query,
      Session,
      Files,
      Cookies,
      isDebug,
      PageVar,
      GlobalVar,
      codebase: ""
    };
    await LoadPageFunc(DataSend);
    return { out_run_script: out_run_script.text, redirectPath };
  };
}

// src/RunTimeBuild/ApiCall.ts
import path21 from "path";
import http from "http";
var apiStaticMap = {};
function getApiFromMap(url, pathSplit) {
  const keys = Object.keys(apiStaticMap);
  for (const i of keys) {
    const e = apiStaticMap[i];
    if (url.startsWith(i) && e.pathSplit == pathSplit)
      return {
        staticPath: i,
        dataInfo: e
      };
  }
  return {};
}
async function findApiPath(url) {
  while (url.length) {
    const startPath = path21.join(getTypes.Static[0], url + ".api");
    const makePromise = async (type) => await EasyFs_default.existsFile(startPath + "." + type) && type;
    const fileType = (await Promise.all([
      makePromise("ts"),
      makePromise("js")
    ])).filter((x) => x).shift();
    if (fileType)
      return url + ".api." + fileType;
    url = CutTheLast("/", url);
  }
  return url;
}
async function ApiCall_default(Request, Response, url, isDebug, nextPrase) {
  const pathSplit = url.split("/").length;
  let { staticPath, dataInfo } = getApiFromMap(url, pathSplit);
  if (!dataInfo) {
    staticPath = await findApiPath(url);
    if (staticPath) {
      dataInfo = {
        pathSplit,
        depsMap: {}
      };
      apiStaticMap[staticPath] = dataInfo;
    }
  }
  if (dataInfo) {
    return await MakeCall(await RequireFile("/" + staticPath, "api-call", "", getTypes.Static, dataInfo.depsMap, isDebug), Request, Response, url.substring(staticPath.length - 6), isDebug, nextPrase);
  }
}
var banWords = ["validateURL", "validateFunc", "func", "define", ...http.METHODS];
function findBestUrlObject(obj, urlFrom) {
  let maxLength = 0, url = "";
  for (const i in obj) {
    const length = i.length;
    if (maxLength < length && urlFrom.startsWith(i) && !banWords.includes(i)) {
      maxLength = length;
      url = i;
    }
  }
  return url;
}
async function parseURLData(validate, value2, Request, Response, makeMassage) {
  let pushData = value2, resData = true, error;
  switch (validate) {
    case Number:
    case parseFloat:
    case parseInt:
      pushData = validate(value2);
      resData = !isNaN(pushData);
      break;
    case Boolean:
      pushData = value2 != "false";
      value2 = value2.toLowerCase();
      resData = value2 == "true" || value2 == "false";
      break;
    case "any":
      break;
    default:
      if (Array.isArray(validate))
        resData = validate.includes(value2);
      if (typeof validate == "function") {
        try {
          const makeValid = await validate(value2, Request, Response);
          if (makeValid && typeof makeValid == "object") {
            resData = makeValid.valid;
            pushData = makeValid.parse ?? value2;
          } else
            resData = makeValid;
        } catch (e) {
          error = "Error on function validator, filed - " + makeMassage(e);
        }
      }
      if (validate instanceof RegExp)
        resData = validate.test(value2);
  }
  if (!resData)
    error = "Error validate filed - " + value2;
  return [error, pushData];
}
async function makeDefinition(obj, urlFrom, defineObject, Request, Response, makeMassage) {
  if (!obj.define)
    return urlFrom;
  const validateFunc = obj.define.validateFunc;
  obj.define.validateFunc = null;
  delete obj.define.validateFunc;
  for (const name2 in obj.define) {
    const [dataSlash, nextUrlFrom] = SplitFirst("/", urlFrom);
    urlFrom = nextUrlFrom;
    const [error, newData] = await parseURLData(obj.define[name2], dataSlash, Request, Response, makeMassage);
    if (error)
      return { error };
    defineObject[name2] = newData;
  }
  if (validateFunc) {
    let validate;
    try {
      validate = await validateFunc(defineObject, Request, Response);
    } catch (e) {
      validate = "Error on function validator" + makeMassage(e);
    }
    return { error: typeof validate == "string" ? validate : "Error validating URL" };
  }
  return urlFrom;
}
async function MakeCall(fileModule, Request, Response, urlFrom, isDebug, nextPrase) {
  const allowErrorInfo = !GetPlugin("SafeDebug") && isDebug, makeMassage = (e) => (isDebug ? print.error(e) : null) + (allowErrorInfo ? `, message: ${e.message}` : "");
  const method = Request.method;
  let methodObj = fileModule[method] || fileModule.default[method];
  let haveMethod = true;
  if (!methodObj) {
    haveMethod = false;
    methodObj = fileModule.default || fileModule;
  }
  const baseMethod = methodObj;
  const defineObject = {};
  const dataDefine = await makeDefinition(methodObj, urlFrom, defineObject, Request, Response, makeMassage);
  if (dataDefine.error)
    return Response.json(dataDefine);
  urlFrom = dataDefine;
  let nestedURL = findBestUrlObject(methodObj, urlFrom);
  for (let i = 0; i < 2; i++) {
    while (nestedURL = findBestUrlObject(methodObj, urlFrom)) {
      const dataDefine2 = await makeDefinition(methodObj, urlFrom, defineObject, Request, Response, makeMassage);
      if (dataDefine2.error)
        return Response.json(dataDefine2);
      urlFrom = dataDefine2;
      urlFrom = trimType("/", urlFrom.substring(nestedURL.length));
      methodObj = methodObj[nestedURL];
    }
    if (!haveMethod) {
      haveMethod = true;
      methodObj = methodObj[method];
    }
  }
  methodObj = methodObj?.func && methodObj || baseMethod;
  if (!methodObj?.func)
    return false;
  const leftData = urlFrom.split("/");
  const urlData = [];
  let error;
  if (methodObj.validateURL) {
    for (const [index, validate] of Object.entries(methodObj.validateURL)) {
      const [errorURL, pushData] = await parseURLData(validate, leftData[index], Request, Response, makeMassage);
      if (errorURL) {
        error = errorURL;
        break;
      }
      urlData.push(pushData);
    }
  } else
    urlData.push(...leftData);
  if (!error && methodObj.validateFunc) {
    let validate;
    try {
      validate = await methodObj.validateFunc(leftData, Request, Response, urlData);
    } catch (e) {
      validate = "Error on function validator" + makeMassage(e);
    }
    if (typeof validate == "string")
      error = validate;
    else if (!validate)
      error = "Error validating URL";
  }
  if (error)
    return Response.json({ error });
  const finalStep = await nextPrase();
  let apiResponse, newResponse;
  try {
    apiResponse = await methodObj.func(Request, Response, urlData, defineObject, leftData);
  } catch (e) {
    if (allowErrorInfo)
      newResponse = { error: e.message };
    else
      newResponse = { error: "500 - Internal Server Error" };
  }
  if (typeof apiResponse == "string")
    newResponse = { text: apiResponse };
  else
    newResponse = apiResponse;
  finalStep();
  if (newResponse != null)
    Response.json(newResponse);
  return true;
}

// src/RunTimeBuild/GetPages.ts
var { Export: Export2 } = FunctionScript_exports;
var Settings4 = {
  CacheDays: 1,
  PageRam: false,
  DevMode: true,
  ErrorPages: {}
};
async function LoadPageToRam(url) {
  if (await EasyFs_default.existsFile(getFullPathCompile(url))) {
    Export2.PageLoadRam[url] = [];
    Export2.PageLoadRam[url][0] = await LoadPage(url);
    Export2.PageLoadRam[url][1] = BuildPage(Export2.PageLoadRam[url][0], url);
  }
}
async function LoadAllPagesToRam() {
  for (const i in pageDeps.store) {
    if (!ExtensionInArray(i, BasicSettings.ReqFileTypesArray))
      await LoadPageToRam(i);
  }
}
function ClearAllPagesFromRam() {
  for (const i in Export2.PageLoadRam) {
    Export2.PageLoadRam[i] = void 0;
    delete Export2.PageLoadRam[i];
  }
}
function ExtensionInArray(filePath, ...arrays) {
  filePath = filePath.toLowerCase();
  for (const array of arrays) {
    for (const i of array) {
      if (filePath.substring(filePath.length - i.length - 1) == "." + i)
        return true;
    }
  }
  return false;
}
function GetErrorPage(code, LocSettings) {
  let arrayType, url;
  if (Settings4.ErrorPages[LocSettings]) {
    arrayType = getTypes.Static;
    url = Settings4.ErrorPages[LocSettings].path;
    code = Settings4.ErrorPages[LocSettings].code ?? code;
  } else {
    arrayType = getTypes.Logs;
    url = "e" + code;
  }
  return { url, arrayType, code };
}
async function ParseBasicInfo(Request, Response, code) {
  if (Request.method == "POST") {
    if (!Request.body || !Object.keys(Request.body).length)
      Request.body = Request.fields || {};
  } else
    Request.body = false;
  if (Request.closed)
    return;
  await new Promise((next) => Settings4.Cookies(Request, Response, next));
  await new Promise((next) => Settings4.CookieEncrypter(Request, Response, next));
  await new Promise((next) => Settings4.SessionStore(Request, Response, next));
  Request.signedCookies = Request.signedCookies || {};
  Request.files = Request.files || {};
  const CopyCookies = JSON.parse(JSON.stringify(Request.signedCookies));
  Request.cookies = Request.signedCookies;
  Response.statusCode = 201;
  return () => {
    if (Response.statusCode === 201)
      Response.statusCode = code;
    for (const i in Request.signedCookies) {
      if (typeof Request.signedCookies[i] != "object" && Request.signedCookies[i] != CopyCookies[i] || JSON.stringify(Request.signedCookies[i]) != JSON.stringify(CopyCookies[i]))
        Response.cookie(i, Request.signedCookies[i], Settings4.CookieSettings);
    }
    for (const i in CopyCookies) {
      if (Request.signedCookies[i] === void 0)
        Response.clearCookie(i);
    }
  };
}
function makeDeleteRequestFilesArray(Request) {
  if (!Request.files)
    return [];
  const arrPath = [];
  for (const i in Request.files) {
    const e = Request.files[i];
    if (Array.isArray(e)) {
      for (const a in e) {
        arrPath.push(e[a].filepath);
      }
    } else
      arrPath.push(e.filepath);
  }
  return arrPath;
}
async function deleteRequestFiles(array) {
  for (const e in array)
    await EasyFs_default.unlinkIfExists(e);
}
async function isURLPathAFile(Request, url, arrayType, code) {
  let fullPageUrl = arrayType[2];
  let file = false;
  if (code == 200) {
    fullPageUrl = getTypes.Static[0] + url;
    if (await serverBuild(Request, Settings4.DevMode, url) || await EasyFs_default.existsFile(fullPageUrl))
      file = true;
    else
      fullPageUrl = arrayType[2];
  }
  return { file, fullPageUrl };
}
async function BuildLoadPage(smallPath2) {
  const pageArray = [await LoadPage(smallPath2)];
  pageArray[1] = BuildPage(pageArray[0], smallPath2);
  if (Settings4.PageRam)
    Export2.PageLoadRam[smallPath2] = pageArray;
  return pageArray[1];
}
async function BuildPageURL(arrayType, url, smallPath2, code) {
  let fullPageUrl;
  if (!await EasyFs_default.existsFile(arrayType[0] + url + "." + BasicSettings.pageTypes.page)) {
    const ErrorPage = GetErrorPage(404, "notFound");
    url = ErrorPage.url;
    arrayType = ErrorPage.arrayType;
    code = ErrorPage.code;
    smallPath2 = arrayType[2] + "/" + url;
    fullPageUrl = url + "." + BasicSettings.pageTypes.page;
    if (!await EasyFs_default.existsFile(arrayType[0] + fullPageUrl))
      fullPageUrl = null;
    else
      fullPageUrl = arrayType[1] + fullPageUrl + ".cjs";
  } else
    fullPageUrl = arrayType[1] + url + "." + BasicSettings.pageTypes.page + ".cjs";
  return {
    arrayType,
    fullPageUrl,
    smallPath: smallPath2,
    code,
    url
  };
}
async function GetDynamicPage(arrayType, url, fullPageUrl, smallPath2, code) {
  const SetNewURL = async () => {
    const build = await BuildPageURL(arrayType, url, smallPath2, code);
    smallPath2 = build.smallPath, url = build.url, code = build.code, fullPageUrl = build.fullPageUrl, arrayType = build.arrayType;
    return true;
  };
  let DynamicFunc;
  if (Settings4.DevMode && await SetNewURL() && fullPageUrl) {
    if (!await EasyFs_default.existsFile(fullPageUrl) || await CheckDependencyChange(smallPath2)) {
      await FastCompile(url + "." + BasicSettings.pageTypes.page, arrayType);
      DynamicFunc = await BuildLoadPage(smallPath2);
    } else if (Export2.PageLoadRam[smallPath2]) {
      if (!Export2.PageLoadRam[smallPath2][1]) {
        DynamicFunc = BuildPage(Export2.PageLoadRam[smallPath2][0], smallPath2);
        if (Settings4.PageRam)
          Export2.PageLoadRam[smallPath2][1] = DynamicFunc;
      } else
        DynamicFunc = Export2.PageLoadRam[smallPath2][1];
    } else
      DynamicFunc = await BuildLoadPage(smallPath2);
  } else if (Export2.PageLoadRam[smallPath2])
    DynamicFunc = Export2.PageLoadRam[smallPath2][1];
  else if (!Settings4.PageRam && await SetNewURL() && fullPageUrl)
    DynamicFunc = await BuildLoadPage(smallPath2);
  else {
    code = Settings4.ErrorPages.notFound?.code ?? 404;
    const ErrorPage = Settings4.ErrorPages.notFound && Export2.PageLoadRam[getTypes.Static[2] + "/" + Settings4.ErrorPages.notFound.path] || Export2.PageLoadRam[getTypes.Logs[2] + "/e404"];
    if (ErrorPage)
      DynamicFunc = ErrorPage[1];
    else
      fullPageUrl = null;
  }
  return {
    DynamicFunc,
    code,
    fullPageUrl
  };
}
async function MakePageResponse(DynamicResponse, Response) {
  if (DynamicResponse.redirectPath?.file) {
    Response.sendFile(DynamicResponse.redirectPath.file);
    await new Promise((res) => Response.on("finish", res));
  } else if (DynamicResponse.redirectPath) {
    Response.writeHead(302, { Location: DynamicResponse.redirectPath });
    Response.end();
  } else {
    const ResPage = DynamicResponse.out_run_script.trim();
    if (ResPage) {
      Response.send(ResPage);
    } else {
      Response.end();
    }
  }
  if (DynamicResponse.redirectPath.deleteAfter) {
    await EasyFs_default.unlinkIfExists(Response.redirectPath.file);
  }
}
async function ActivatePage(Request, Response, arrayType, url, FileInfo, code, nextPrase) {
  const { DynamicFunc, fullPageUrl, code: newCode } = await GetDynamicPage(arrayType, url, FileInfo.fullPageUrl, FileInfo.fullPageUrl + "/" + url, code);
  if (!fullPageUrl || !DynamicFunc && code == 500)
    return Response.sendStatus(newCode);
  try {
    const finalStep = await nextPrase();
    const pageData = await DynamicFunc(Response, Request, Request.body, Request.query, Request.cookies, Request.session, Request.files, Settings4.DevMode);
    finalStep();
    await MakePageResponse(pageData, Response);
  } catch (e) {
    print.error(e);
    Request.error = e;
    const ErrorPage = GetErrorPage(500, "serverError");
    DynamicPage(Request, Response, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
    return false;
  }
  return true;
}
async function DynamicPage(Request, Response, url, arrayType = getTypes.Static, code = 200) {
  const FileInfo = await isURLPathAFile(Request, url, arrayType, code);
  const makeDeleteArray = makeDeleteRequestFilesArray(Request);
  if (FileInfo.file) {
    Settings4.CacheDays && Response.setHeader("Cache-Control", "max-age=" + Settings4.CacheDays * 24 * 60 * 60);
    await GetFile(url, Settings4.DevMode, Request, Response);
    deleteRequestFiles(makeDeleteArray);
    return;
  }
  const nextPrase = () => ParseBasicInfo(Request, Response, code);
  const isApi = await ApiCall_default(Request, Response, url, Settings4.DevMode, nextPrase);
  if (!isApi && !await ActivatePage(Request, Response, arrayType, url, FileInfo, code, nextPrase))
    return;
  deleteRequestFiles(makeDeleteArray);
}
function urlFix(url) {
  url = url.substring(0, url.lastIndexOf("?")) || url;
  if (url == "/") {
    url = "/index";
  }
  return decodeURIComponent(url);
}

// src/MainBuild/Settings.ts
import { v4 as uuidv4 } from "uuid";
import { cookieParser } from "@tinyhttp/cookie-parser";
import cookieEncrypter from "cookie-encrypter";
import session from "express-session";
import bodyParser from "body-parser";
import MemorySession from "memorystore";
var CookiesSecret = uuidv4().substring(0, 32);
var SessionSecret = uuidv4();
var MemoryStore = MemorySession(session);
var CookiesMiddleware = cookieParser(CookiesSecret);
var CookieEncrypterMiddleware = cookieEncrypter(CookiesSecret, {});
var CookieSettings = { httpOnly: true, signed: true, maxAge: 864e5 * 30 };
Settings4.Cookies = CookiesMiddleware;
Settings4.CookieEncrypter = CookieEncrypterMiddleware;
Settings4.CookieSettings = CookieSettings;
var DevMode_ = true;
var compilationScan;
var SessionStore;
var formidableServer;
var bodyParserServer;
var serveLimits = {
  sessionTotalRamMB: 150,
  sessionTimeMinutes: 40,
  sessionCheckPeriodMinutes: 30,
  fileLimitMB: 10,
  requestLimitMB: 4
};
var pageInRamActivate;
function pageInRamActivateFunc() {
  return pageInRamActivate;
}
var baseRoutingIgnoreTypes = [...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray, ...BasicSettings.pageCodeFileArray];
var baseValidPath = [(path23) => path23.split(".").at(-2) != "serv"];
var Export3 = {
  get settingsPath() {
    return workingDirectory + BasicSettings.WebSiteFolder + "/Settings";
  },
  set development(value2) {
    if (DevMode_ == value2)
      return;
    DevMode_ = value2;
    if (!value2) {
      compilationScan = compileAll(Export3);
      process.env.NODE_ENV = "production";
    }
    Settings4.DevMode = value2;
    allowPrint(value2);
  },
  get development() {
    return DevMode_;
  },
  middleware: {
    get cookies() {
      return CookiesMiddleware;
    },
    get cookieEncrypter() {
      return CookieEncrypterMiddleware;
    },
    get session() {
      return SessionStore;
    },
    get formidable() {
      return formidableServer;
    },
    get bodyParser() {
      return bodyParserServer;
    }
  },
  secret: {
    get cookies() {
      return CookiesSecret;
    },
    get session() {
      return SessionSecret;
    }
  },
  general: {
    importOnLoad: [],
    set pageInRam(value2) {
      if (Settings4.PageRam != value2) {
        Settings4.PageRam = value2;
        pageInRamActivate = async () => (await compilationScan)?.();
        return;
      }
      Settings4.PageRam = value2;
      pageInRamActivate = async () => {
        const preparations = await compilationScan;
        await preparations?.();
        if (!Settings4.PageRam) {
          await LoadAllPagesToRam();
        } else if (!value2) {
          ClearAllPagesFromRam();
        }
      };
    },
    get pageInRam() {
      return Settings4.PageRam;
    }
  },
  compile: {
    set compileSyntax(value2) {
      Settings3.AddCompileSyntax = value2;
    },
    get compileSyntax() {
      return Settings3.AddCompileSyntax;
    },
    set ignoreError(value2) {
      Settings.PreventErrors = value2;
    },
    get ignoreError() {
      return Settings.PreventErrors;
    },
    set plugins(value2) {
      Settings3.plugins.length = 0;
      Settings3.plugins.push(...value2);
    },
    get plugins() {
      return Settings3.plugins;
    },
    get define() {
      return settings.define;
    },
    set define(value2) {
      settings.define = value2;
    }
  },
  routing: {
    rules: {},
    urlStop: [],
    validPath: baseValidPath,
    ignoreTypes: baseRoutingIgnoreTypes,
    ignorePaths: [],
    sitemap: true,
    get errorPages() {
      return Settings4.ErrorPages;
    },
    set errorPages(value2) {
      Settings4.ErrorPages = value2;
    }
  },
  serveLimits: {
    cacheDays: 3,
    cookiesExpiresDays: 1,
    set sessionTotalRamMB(value2) {
      if (serveLimits.sessionTotalRamMB == value2)
        return;
      serveLimits.sessionTotalRamMB = value2;
      buildSession();
    },
    get sessionTotalRamMB() {
      return serveLimits.sessionTotalRamMB;
    },
    set sessionTimeMinutes(value2) {
      if (serveLimits.sessionTimeMinutes == value2)
        return;
      serveLimits.sessionTimeMinutes = value2;
      buildSession();
    },
    get sessionTimeMinutes() {
      return serveLimits.sessionTimeMinutes;
    },
    set sessionCheckPeriodMinutes(value2) {
      if (serveLimits.sessionCheckPeriodMinutes == value2)
        return;
      serveLimits.sessionCheckPeriodMinutes = value2;
      buildSession();
    },
    get sessionCheckPeriodMinutes() {
      return serveLimits.sessionCheckPeriodMinutes;
    },
    set fileLimitMB(value2) {
      if (serveLimits.fileLimitMB == value2)
        return;
      serveLimits.fileLimitMB = value2;
      buildFormidable();
    },
    get fileLimitMB() {
      return serveLimits.fileLimitMB;
    },
    set requestLimitMB(value2) {
      if (serveLimits.requestLimitMB == value2)
        return;
      serveLimits.requestLimitMB = value2;
      buildFormidable();
      buildBodyParser();
    },
    get requestLimitMB() {
      return serveLimits.requestLimitMB;
    }
  },
  serve: {
    port: 8080,
    http2: false,
    greenLock: {
      staging: null,
      cluster: null,
      email: null,
      agent: null,
      agreeToTerms: false,
      sites: []
    }
  }
};
function buildFormidable() {
  formidableServer = {
    maxFileSize: Export3.serveLimits.fileLimitMB * 1048576,
    uploadDir: SystemData + "/UploadFiles/",
    multiples: true,
    maxFieldsSize: Export3.serveLimits.requestLimitMB * 1048576
  };
}
function buildBodyParser() {
  bodyParserServer = bodyParser.json({ limit: Export3.serveLimits.requestLimitMB + "mb" });
}
function buildSession() {
  if (!Export3.serveLimits.sessionTimeMinutes || !Export3.serveLimits.sessionTotalRamMB) {
    SessionStore = (req, res, next) => next();
    return;
  }
  SessionStore = session({
    cookie: { maxAge: Export3.serveLimits.sessionTimeMinutes * 60 * 1e3, sameSite: true },
    secret: SessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: Export3.serveLimits.sessionCheckPeriodMinutes * 60 * 1e3,
      max: Export3.serveLimits.sessionTotalRamMB * 1048576
    })
  });
}
function copyJSON(to, json, rules = [], rulesType = "ignore") {
  if (!json)
    return false;
  let hasImpleated = false;
  for (const i in json) {
    const include = rules.includes(i);
    if (rulesType == "only" && include || rulesType == "ignore" && !include) {
      hasImpleated = true;
      to[i] = json[i];
    }
  }
  return hasImpleated;
}
async function requireSettings() {
  const Settings5 = await GetSettings(Export3.settingsPath, DevMode_);
  if (Settings5 == null)
    return;
  if (Settings5.development)
    Object.assign(Settings5, Settings5.implDev);
  else
    Object.assign(Settings5, Settings5.implProd);
  copyJSON(Export3.compile, Settings5.compile);
  copyJSON(Export3.routing, Settings5.routing, ["ignoreTypes", "validPath"]);
  const concatArray = (name2, array) => Settings5.routing?.[name2] && (Export3.routing[name2] = Settings5.routing[name2].concat(array));
  concatArray("ignoreTypes", baseRoutingIgnoreTypes);
  concatArray("validPath", baseValidPath);
  copyJSON(Export3.serveLimits, Settings5.serveLimits, ["cacheDays", "cookiesExpiresDays"], "only");
  if (copyJSON(serveLimits, Settings5.serveLimits, ["sessionTotalRamMB", "sessionTimeMinutes", "sessionCheckPeriodMinutes"], "only")) {
    buildSession();
  }
  if (copyJSON(serveLimits, Settings5.serveLimits, ["fileLimitMB", "requestLimitMB"], "only")) {
    buildFormidable();
  }
  if (copyJSON(serveLimits, Settings5.serveLimits, ["requestLimitMB"], "only")) {
    buildBodyParser();
  }
  copyJSON(Export3.serve, Settings5.serve);
  Export3.development = Settings5.development;
  if (Settings5.general?.importOnLoad) {
    Export3.general.importOnLoad = await StartRequire(Settings5.general.importOnLoad, DevMode_);
  }
  if (!copyJSON(Export3.general, Settings5.general, ["pageInRam"], "only") && Settings5.development) {
    pageInRamActivate = await compilationScan;
  }
  if (Export3.development && Export3.routing.sitemap) {
    debugSiteMap(Export3);
  }
}
function buildFirstLoad() {
  buildSession();
  buildFormidable();
  buildBodyParser();
}

// src/MainBuild/Server.ts
import formidable from "formidable";

// src/MainBuild/ListenGreenLock.ts
import http2 from "http";
import http22 from "http2";
import * as createCert from "selfsigned";
import * as Greenlock from "greenlock-express";
async function TouchSystemFolder(foName, CreateInNotExits) {
  let savePath = workingDirectory + "/SystemSave/";
  await EasyFs_default.mkdirIfNotExists(savePath);
  savePath += foName;
  await EasyFs_default.mkdirIfNotExists(savePath);
  if (CreateInNotExits) {
    savePath += "/";
    const filePath = savePath + CreateInNotExits.name;
    if (!await EasyFs_default.existsFile(filePath)) {
      await EasyFs_default.writeFile(filePath, CreateInNotExits.value);
    } else if (CreateInNotExits.exits) {
      await EasyFs_default.writeFile(filePath, await CreateInNotExits.exits(await EasyFs_default.readFile(filePath, "utf8"), filePath, savePath));
    }
  }
}
async function GetDemoCertificate() {
  let Certificate;
  const CertificatePath = SystemData + "/Certificate.json";
  if (await EasyFs_default.existsFile(CertificatePath)) {
    Certificate = EasyFs_default.readJsonFile(CertificatePath);
  } else {
    Certificate = await new Promise((res) => {
      createCert.generate(null, { days: 36500 }, (err, keys) => {
        if (err)
          throw err;
        res({
          key: keys.private,
          cert: keys.cert
        });
      });
    });
    EasyFs_default.writeJsonFile(CertificatePath, Certificate);
  }
  return Certificate;
}
function DefaultListen(app) {
  const server = http2.createServer(app.attach);
  return {
    server,
    listen(port) {
      return new Promise((res) => {
        server.listen(port, res);
      });
    },
    close() {
      server.close();
    }
  };
}
async function UpdateGreenLock(app) {
  if (!(Export3.serve.http2 || Export3.serve.greenLock?.agreeToTerms)) {
    return await DefaultListen(app);
  }
  if (!Export3.serve.greenLock.agreeToTerms) {
    const server = http22.createSecureServer(__spreadProps(__spreadValues({}, await GetDemoCertificate()), { allowHTTP1: true }), app.attach);
    return {
      server,
      listen(port) {
        server.listen(port);
      },
      stop() {
        server.close();
      }
    };
  }
  await TouchSystemFolder("greenlock", {
    name: "config.json",
    value: JSON.stringify({
      sites: Export3.serve.greenLock.sites
    }),
    async exits(file, _, folder) {
      file = JSON.parse(file);
      for (const i in file.sites) {
        const e = file.sites[i];
        let have;
        for (const b of Export3.serve.greenLock.sites) {
          if (b.subject == e.subject) {
            have = true;
            if (b.altnames.length != e.altnames.length || b.altnames.some((v) => e.altnames.includes(v))) {
              e.altnames = b.altnames;
              delete e.renewAt;
            }
            break;
          }
        }
        if (!have) {
          file.sites.splice(i, i);
          const path23 = folder + "live/" + e.subject;
          if (await EasyFs_default.exists(path23)) {
            await DeleteInDirectory(path23);
            await EasyFs_default.rmdir(path23);
          }
        }
      }
      const newSites = Export3.serve.greenLock.sites.filter((x) => !file.sites.find((b) => b.subject == x.subject));
      file.sites.push(...newSites);
      return JSON.stringify(file);
    }
  });
  const packageInfo = await EasyFs_default.readJsonFile(workingDirectory + "package.json");
  const greenlockObject = await new Promise((res) => Greenlock.init({
    packageRoot: workingDirectory,
    configDir: "SystemSave/greenlock",
    packageAgent: Export3.serve.greenLock.agent || packageInfo.name + "/" + packageInfo.version,
    maintainerEmail: Export3.serve.greenLock.email,
    cluster: Export3.serve.greenLock.cluster,
    staging: Export3.serve.greenLock.staging
  }).ready(res));
  function CreateServer(type, func, options) {
    let ClosehttpServer = () => {
    };
    const server = greenlockObject[type](options, func);
    const listen = (port) => {
      const httpServer = greenlockObject.httpServer();
      ClosehttpServer = () => httpServer.close();
      return Promise.all([new Promise((res) => server.listen(443, "0.0.0.0", res)), new Promise((res) => httpServer.listen(port, "0.0.0.0", res))]);
    };
    const close = () => {
      server.close();
      ClosehttpServer();
    };
    return {
      server,
      listen,
      close
    };
  }
  if (Export3.serve.http2) {
    return CreateServer("http2Server", app.attach, { allowHTTP1: true });
  } else {
    return CreateServer("httpsServer", app.attach);
  }
}

// src/MainBuild/Server.ts
async function requestAndSettings(req, res) {
  if (Export3.development) {
    await requireSettings();
  }
  return await changeURLRules(req, res);
}
async function changeURLRules(req, res) {
  let url = urlFix(req.url);
  for (let i of Export3.routing.urlStop) {
    if (url.startsWith(i)) {
      if (i.endsWith("/")) {
        i = i.substring(0, i.length - 1);
      }
      return await filerURLRules(req, res, i);
    }
  }
  const RuleIndex = Object.keys(Export3.routing.rules).find((i) => url.startsWith(i));
  if (RuleIndex) {
    url = await Export3.routing.rules[RuleIndex](url, req, res);
  }
  await filerURLRules(req, res, url);
}
async function filerURLRules(req, res, url) {
  let notValid = Export3.routing.ignorePaths.find((i) => url.startsWith(i)) || Export3.routing.ignoreTypes.find((i) => url.endsWith("." + i));
  if (!notValid) {
    for (const valid of Export3.routing.validPath) {
      if (!await valid(url, req, res)) {
        notValid = true;
        break;
      }
    }
  }
  if (notValid) {
    const ErrorPage = GetErrorPage(404, "notFound");
    return await DynamicPage(req, res, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
  }
  await DynamicPage(req, res, url.substring(1));
}
var appOnline;
async function StartApp(Server2) {
  const app = new TinyApp();
  if (!Export3.serve.http2) {
    app.use(compression());
  }
  Settings4.SessionStore = async (req, res, next) => Export3.middleware.session(req, res, next);
  const OpenListing = await StartListing(app, Server2);
  for (const func of Export3.general.importOnLoad) {
    await func(app, appOnline.server, Export3);
  }
  await pageInRamActivateFunc()?.();
  app.all("*", ParseRequest);
  await OpenListing(Export3.serve.port);
  console.log("App listing at port: " + Export3.serve.port);
}
async function ParseRequest(req, res) {
  if (req.method == "POST") {
    if (req.headers["content-type"]?.startsWith?.("application/json")) {
      Export3.middleware.bodyParser(req, res, () => requestAndSettings(req, res));
    } else {
      new formidable.IncomingForm(Export3.middleware.formidable).parse(req, (err, fields, files) => {
        if (err) {
          print.error(err);
        }
        req.fields = fields;
        req.files = files;
        requestAndSettings(req, res);
      });
    }
  } else {
    requestAndSettings(req, res);
  }
}
async function StartListing(app, Server2) {
  if (appOnline && appOnline.close) {
    await appOnline.close();
  }
  const { server, listen, close } = await Server2(app);
  appOnline = { server, close };
  return listen;
}
async function StartServer({ SitePath = "Website", HttpServer = UpdateGreenLock } = {}) {
  BasicSettings.WebSiteFolder = SitePath;
  buildFirstLoad();
  await requireSettings();
  StartApp(HttpServer);
}

// src/BuildInFunc/localSql.ts
import initSqlJs from "sql.js";
import path22 from "path";
var LocalSql = class {
  constructor(savePath, checkIntervalMinutes = 10) {
    this.hadChange = false;
    this.loaded = false;
    this.savePath = savePath ?? workingDirectory + "SystemSave/DataBase.db";
    this.updateLocalFile = this.updateLocalFile.bind(this);
    setInterval(this.updateLocalFile, 1e3 * 60 * checkIntervalMinutes);
    process.on("SIGINT", this.updateLocalFile);
    process.on("exit", this.updateLocalFile);
  }
  notLoaded() {
    if (!this.loaded) {
      PrintIfNew({
        errorName: "dn-not-loaded",
        text: "DataBase is not loaded, please use 'await db.load()'",
        type: "error"
      });
      return true;
    }
  }
  async load() {
    const notExits = await EasyFs_default.mkdirIfNotExists(path22.dirname(this.savePath));
    const SQL = await initSqlJs();
    let readData;
    if (!notExits && await EasyFs_default.existsFile(this.savePath))
      readData = await EasyFs_default.readFile(this.savePath, "binary");
    this.db = new SQL.Database(readData);
  }
  updateLocalFile() {
    if (!this.hadChange)
      return;
    this.hadChange = false;
    EasyFs_default.writeFile(this.savePath, this.db.export());
  }
  buildQueryTemplate(arr, params) {
    let query = "";
    for (const i in params) {
      query += arr[i] + "?";
    }
    query += arr.at(-1);
    return query;
  }
  insert(queryArray, ...valuesArray) {
    if (this.notLoaded())
      return;
    const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
    try {
      const id = query.get(valuesArray)[0];
      this.hadChange = true;
      query.free();
      return id;
    } catch (err) {
      print.error(err);
    }
  }
  affected(queryArray, ...valuesArray) {
    if (this.notLoaded())
      return;
    const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
    try {
      query.run(valuesArray);
      const effected = this.db.getRowsModified();
      this.hadChange ||= effected > 0;
      query.free();
      return effected;
    } catch (err) {
      print.error(err);
    }
  }
  select(queryArray, ...valuesArray) {
    if (this.notLoaded())
      return;
    const query = this.buildQueryTemplate(queryArray, valuesArray);
    try {
      return this.db.exec(query);
    } catch (err) {
      print.error(err);
    }
  }
  selectOne(queryArray, ...valuesArray) {
    if (this.notLoaded())
      return;
    const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
    try {
      query.step();
      const one = query.getAsObject();
      query.free();
      return one;
    } catch (err) {
      print.error(err);
    }
  }
};

// src/BuildInFunc/Index.ts
global.LocalSql = LocalSql;
global.dump = print;

// src/index.ts
var AsyncImport = (path23, importFrom = "async import") => LoadImport(importFrom, path23, getTypes.Static, Export3.development);
var Server = StartServer;
export {
  AsyncImport,
  LocalSql,
  Server,
  Export3 as Settings,
  print as dump
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zy50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9TdHJpbmdNZXRob2RzL1NwbGl0dGluZy50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jbGllbnQudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9zZXJ2ZXIudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L2luZGV4LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL2luZGV4LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3BhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1N0b3JlSlNPTi50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVEZXBzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2lzb2xhdGUudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3ZlbHRlLnRzIiwgIi4uL3NyYy9TdHJpbmdNZXRob2RzL0lkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUy50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93bi50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9oZWFkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2Nvbm5lY3QudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvZm9ybS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9yZWNvcmQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2VhcmNoLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0V4dHJpY2F0ZS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9QYWdlQmFzZS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9Db21waWxlLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9qc29uLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvd2FzbS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdHlsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQ29tcGlsZVN0YXRlLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvSW1wb3J0TW9kdWxlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9TZXNzaW9uLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2l0ZU1hcC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ZpbGVUeXBlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0Z1bmN0aW9uU2NyaXB0LnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvSW1wb3J0RmlsZVJ1bnRpbWUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9BcGlDYWxsLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvR2V0UGFnZXMudHMiLCAiLi4vc3JjL01haW5CdWlsZC9TZXR0aW5ncy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0xpc3RlbkdyZWVuTG9jay50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvbG9jYWxTcWwudHMiLCAiLi4vc3JjL0J1aWxkSW5GdW5jL0luZGV4LnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwIGFzIFRpbnlBcHAgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9UeXBlcyc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3MsIHJlcXVpcmVTZXR0aW5ncywgYnVpbGRGaXJzdExvYWQsIHBhZ2VJblJhbUFjdGl2YXRlRnVuY30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgZm9ybWlkYWJsZSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCB7IFVwZGF0ZUdyZWVuTG9jayB9IGZyb20gJy4vTGlzdGVuR3JlZW5Mb2NrJztcblxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBjaGFuZ2VVUkxSdWxlcyhyZXEsIHJlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYW5nZVVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGxldCB1cmwgPSBmaWxlQnlVcmwudXJsRml4KHJlcS51cmwpO1xuXG4gICAgXG4gICAgZm9yIChsZXQgaSBvZiBTZXR0aW5ncy5yb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpKSB7XG4gICAgICAgICAgICBpZiAoaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuc3Vic3RyaW5nKDAsIGkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSdWxlSW5kZXggPSBPYmplY3Qua2V5cyhTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzKS5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpO1xuXG4gICAgaWYgKFJ1bGVJbmRleCkge1xuICAgICAgICB1cmwgPSBhd2FpdCBTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzW1J1bGVJbmRleF0odXJsLCByZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgdXJsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZXJVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHVybDogc3RyaW5nKSB7XG4gICAgbGV0IG5vdFZhbGlkOiBhbnkgPSBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSkgfHwgU2V0dGluZ3Mucm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGkgPT4gdXJsLmVuZHNXaXRoKCcuJytpKSk7XG4gICAgXG4gICAgaWYoIW5vdFZhbGlkKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWxpZCBvZiBTZXR0aW5ncy5yb3V0aW5nLnZhbGlkUGF0aCl7IC8vIGNoZWNrIGlmIHVybCBpc24ndCB2YWxpZFxuICAgICAgICAgICAgaWYoIWF3YWl0IHZhbGlkKHVybCwgcmVxLCByZXMpKXtcbiAgICAgICAgICAgICAgICBub3RWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm90VmFsaWQpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gZmlsZUJ5VXJsLkdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCB1cmwuc3Vic3RyaW5nKDEpKTtcbn1cblxubGV0IGFwcE9ubGluZVxuXG4vKipcbiAqIEl0IHN0YXJ0cyB0aGUgc2VydmVyIGFuZCB0aGVuIGNhbGxzIFN0YXJ0TGlzdGluZ1xuICogQHBhcmFtIFtTZXJ2ZXJdIC0gVGhlIHNlcnZlciBvYmplY3QgdGhhdCBpcyBwYXNzZWQgaW4gYnkgdGhlIGNhbGxlci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gU3RhcnRBcHAoU2VydmVyPykge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBUaW55QXBwKCk7XG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICBhcHAudXNlKDxhbnk+Y29tcHJlc3Npb24oKSk7XG4gICAgfVxuICAgIGZpbGVCeVVybC5TZXR0aW5ncy5TZXNzaW9uU3RvcmUgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IFNldHRpbmdzLm1pZGRsZXdhcmUuc2Vzc2lvbihyZXEsIHJlcywgbmV4dCk7XG5cbiAgICBjb25zdCBPcGVuTGlzdGluZyA9IGF3YWl0IFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgU2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgYXdhaXQgZnVuYyhhcHAsIGFwcE9ubGluZS5zZXJ2ZXIsIFNldHRpbmdzKTtcbiAgICB9XG4gICAgYXdhaXQgcGFnZUluUmFtQWN0aXZhdGVGdW5jKCk/LigpXG5cbiAgICBhcHAuYWxsKFwiKlwiLCBQYXJzZVJlcXVlc3QpO1xuXG4gICAgYXdhaXQgT3Blbkxpc3RpbmcoU2V0dGluZ3Muc2VydmUucG9ydCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcCBsaXN0aW5nIGF0IHBvcnQ6IFwiICsgU2V0dGluZ3Muc2VydmUucG9ydCk7XG59XG5cbi8qKlxuICogSWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIHJlcXVlc3QsIHRoZW4gcGFyc2UgdGhlIHJlcXVlc3QgYm9keSwgdGhlbiBzZW5kIGl0IHRvIHJvdXRpbmcgc2V0dGluZ3NcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC0gVGhlIGluY29taW5nIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLSBSZXNwb25zZVxuICovXG5hc3luYyBmdW5jdGlvbiBQYXJzZVJlcXVlc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT0gJ1BPU1QnKSB7XG4gICAgICAgIGlmIChyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10/LnN0YXJ0c1dpdGg/LignYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICBTZXR0aW5ncy5taWRkbGV3YXJlLmJvZHlQYXJzZXIocmVxLCByZXMsICgpID0+IHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKFNldHRpbmdzLm1pZGRsZXdhcmUuZm9ybWlkYWJsZSkucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpIHtcbiAgICBpZiAoYXBwT25saW5lICYmIGFwcE9ubGluZS5jbG9zZSkge1xuICAgICAgICBhd2FpdCBhcHBPbmxpbmUuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcnZlciwgbGlzdGVuLCBjbG9zZSB9ID0gYXdhaXQgU2VydmVyKGFwcCk7XG5cbiAgICBhcHBPbmxpbmUgPSB7IHNlcnZlciwgY2xvc2UgfTtcblxuICAgIHJldHVybiBsaXN0ZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0U2VydmVyKHsgU2l0ZVBhdGggPSAnV2Vic2l0ZScsIEh0dHBTZXJ2ZXIgPSBVcGRhdGVHcmVlbkxvY2sgfSA9IHt9KSB7XG4gICAgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyID0gU2l0ZVBhdGg7XG4gICAgYnVpbGRGaXJzdExvYWQoKTtcbiAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICBTdGFydEFwcChIdHRwU2VydmVyKTtcbn1cblxuZXhwb3J0IHsgU2V0dGluZ3MgfTsiLCAiaW1wb3J0IGZzLCB7RGlyZW50LCBTdGF0c30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIGV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIHJlcyhCb29sZWFuKHN0YXQpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge3BhdGggb2YgdGhlIGZpbGV9IHBhdGggXG4gKiBAcGFyYW0ge2ZpbGVkIHRvIGdldCBmcm9tIHRoZSBzdGF0IG9iamVjdH0gZmlsZWQgXG4gKiBAcmV0dXJucyB0aGUgZmlsZWRcbiAqL1xuZnVuY3Rpb24gc3RhdChwYXRoOiBzdHJpbmcsIGZpbGVkPzogc3RyaW5nLCBpZ25vcmVFcnJvcj86IGJvb2xlYW4sIGRlZmF1bHRWYWx1ZTphbnkgPSB7fSk6IFByb21pc2U8U3RhdHMgfCBhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIGlmKGVyciAmJiAhaWdub3JlRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZWQgJiYgc3RhdD8gc3RhdFtmaWxlZF06IHN0YXQgfHwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGZpbGUgZXhpc3RzLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjaGVjay5cbiAqIEBwYXJhbSB7YW55fSBbaWZUcnVlUmV0dXJuPXRydWVdIC0gYW55ID0gdHJ1ZVxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiBleGlzdHNGaWxlKHBhdGg6IHN0cmluZywgaWZUcnVlUmV0dXJuOiBhbnkgPSB0cnVlKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gKGF3YWl0IHN0YXQocGF0aCwgbnVsbCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcmludE1vZGUpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICB9XG59KTsiLCAiaW1wb3J0IHtEaXJlbnR9IGZyb20gJ2ZzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7Y3dkfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tICd1cmwnXG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5hc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgZ2V0RGlybmFtZSxcbiAgICBTeXN0ZW1EYXRhLFxuICAgIHdvcmtpbmdEaXJlY3RvcnksXG4gICAgRGVsZXRlSW5EaXJlY3RvcnksXG4gICAgZ2V0VHlwZXMsXG4gICAgQmFzaWNTZXR0aW5nc1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vLi4vSlNQYXJzZXInO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgPCV7P2RlYnVnX2ZpbGU/fSR7aS50ZXh0fSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVNjcmlwdENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnTGluZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlVGV4dENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlU2NyaXB0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VyLnN0YXJ0ID0gXCI8JVwiO1xuICAgIHBhcnNlci5lbmQgPSBcIiU+XCI7XG4gICAgcmV0dXJuIHBhcnNlci5SZUJ1aWxkVGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBOb1RyYWNrU3RyaW5nQ29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgYnVpbGRTY3JpcHQ6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSkge1xuICAgIGNvZGUgPSBhd2FpdCBQYXJzZVNjcmlwdENvZGUoY29kZSwgcGF0aCk7XG4gICAgY29kZSA9IGF3YWl0IEpTUGFyc2VyLlJ1bkFuZEV4cG9ydChjb2RlLCBwYXRoLCBpc0RlYnVnKTtcblxuICAgIGNvbnN0IE5ld0NvZGUgPSBhd2FpdCBidWlsZFNjcmlwdChjb2RlKTtcbiAgIFxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmdUcmFja2VyID0gSlNQYXJzZXIuUmVzdG9yZVRyYWNrKE5ld0NvZGUsIGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgIG5ld0NvZGVTdHJpbmdUcmFja2VyLkFkZFRleHRCZWZvcmVOb1RyYWNrKCc8JSF7Jyk7XG4gICAgbmV3Q29kZVN0cmluZ1RyYWNrZXIuQWRkVGV4dEFmdGVyTm9UcmFjaygnfSU+Jyk7XG5cbiAgICByZXR1cm4gbmV3Q29kZVN0cmluZ1RyYWNrZXI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBBZGREZWJ1Z0luZm8ocGFnZU5hbWU6c3RyaW5nLCBGdWxsUGF0aDpzdHJpbmcsIFNtYWxsUGF0aDpzdHJpbmcsIGNhY2hlOiB7dmFsdWU/OiBzdHJpbmd9ID0ge30pe1xuICAgIGlmKCFjYWNoZS52YWx1ZSlcbiAgICAgICAgY2FjaGUudmFsdWUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbFBhdGgsICd1dGY4Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGxEYXRhOiBuZXcgU3RyaW5nVHJhY2tlcihgJHtwYWdlTmFtZX08bGluZT4ke1NtYWxsUGF0aH1gLCBjYWNoZS52YWx1ZSksXG4gICAgICAgIHN0cmluZ0luZm86IGA8JXJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpOiBQYXRoVHlwZXMge1xuICAgIHJldHVybiB7XG4gICAgICAgIFNtYWxsUGF0aDogQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKHNtYWxsUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlLCAyKSxcbiAgICAgICAgRnVsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlKSxcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUGFyc2VEZWJ1Z0xpbmUsXG4gICAgQ3JlYXRlRmlsZVBhdGgsXG4gICAgTm9UcmFja1N0cmluZ0NvZGVcbn07IiwgImltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHByaXZhdGUgc3RhdGljIGdldCBlbXB0eUluZm8oKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXREZWZhdWx0KEluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dCkge1xuICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mby5pbmZvO1xuICAgICAgICB0aGlzLk9uTGluZSA9IEluZm8ubGluZTtcbiAgICAgICAgdGhpcy5PbkNoYXIgPSBJbmZvLmNoYXI7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERhdGFBcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBsYXN0IEluZm9UZXh0XG4gICAgICovXG4gICAgcHVibGljIGdldCBEZWZhdWx0SW5mb1RleHQoKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgaWYgKCF0aGlzLkRhdGFBcnJheS5maW5kKHggPT4geC5pbmZvKSAmJiB0aGlzLkluZm9UZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5mbzogdGhpcy5JbmZvVGV4dCxcbiAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLk9uTGluZSxcbiAgICAgICAgICAgICAgICBjaGFyOiB0aGlzLk9uQ2hhclxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5W3RoaXMuRGF0YUFycmF5Lmxlbmd0aCAtIDFdID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBmaXJzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIGdldCBTdGFydEluZm8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVswXSA/PyB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IGFzIG9uZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCBPbmVTdHJpbmcoKSB7XG4gICAgICAgIGxldCBiaWdTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBiaWdTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpZ1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IHNvIHlvdSBjYW4gY2hlY2sgaWYgaXQgZXF1YWwgb3Igbm90XG4gICAgICogdXNlIGxpa2UgdGhhdDogbXlTdHJpbmcuZXEgPT0gXCJjb29sXCJcbiAgICAgKi9cbiAgICBnZXQgZXEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGluZm8gYWJvdXQgdGhpcyB0ZXh0XG4gICAgICovXG4gICAgZ2V0IGxpbmVJbmZvKCkge1xuICAgICAgICBjb25zdCBkID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGNvbnN0IHMgPSBkLmluZm8uc3BsaXQoJzxsaW5lPicpO1xuICAgICAgICBzLnB1c2goQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzLnBvcCgpKTtcblxuICAgICAgICByZXR1cm4gYCR7cy5qb2luKCc8bGluZT4nKX06JHtkLmxpbmV9OiR7ZC5jaGFyfWA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBsZW5ndGggb2YgdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5Lmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyBjb3B5IG9mIHRoaXMgc3RyaW5nIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZSgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdEYXRhLkFkZFRleHRBZnRlcihpLnRleHQsIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQWRkQ2xvbmUoZGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKC4uLmRhdGEuRGF0YUFycmF5KTtcblxuICAgICAgICB0aGlzLnNldERlZmF1bHQoe1xuICAgICAgICAgICAgaW5mbzogZGF0YS5JbmZvVGV4dCxcbiAgICAgICAgICAgIGxpbmU6IGRhdGEuT25MaW5lLFxuICAgICAgICAgICAgY2hhcjogZGF0YS5PbkNoYXJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgYW55IHRoaW5nIHRvIGNvbm5lY3RcbiAgICAgKiBAcmV0dXJucyBjb25uY3RlZCBzdHJpbmcgd2l0aCBhbGwgdGhlIHRleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvbmNhdCguLi50ZXh0OiBhbnlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0ZXh0KSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGRhdGEgXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgY2xvbmUgcGx1cyB0aGUgbmV3IGRhdGEgY29ubmVjdGVkXG4gICAgICovXG4gICAgcHVibGljIENsb25lUGx1cyguLi5kYXRhOiBhbnlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gU3RyaW5nVHJhY2tlci5jb25jYXQodGhpcy5DbG9uZSgpLCAuLi5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5nIG9yIGFueSBkYXRhIHRvIHRoaXMgc3RyaW5nXG4gICAgICogQHBhcmFtIGRhdGEgY2FuIGJlIGFueSB0aGluZ1xuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIChub3QgbmV3IHN0cmluZylcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyguLi5kYXRhOiBhbnlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIGxhc3RpbmZvID0gaS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKGkpLCBsYXN0aW5mby5pbmZvLCBsYXN0aW5mby5saW5lLCBsYXN0aW5mby5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbnMgb3Qgb3RoZXIgZGF0YSB3aXRoICdUZW1wbGF0ZSBsaXRlcmFscydcbiAgICAgKiB1c2VkIGxpa2UgdGhpczogbXlTdHJpbi4kUGx1cyBgdGhpcyB2ZXJ5JHtjb29sU3RyaW5nfSFgXG4gICAgICogQHBhcmFtIHRleHRzIGFsbCB0aGUgc3BsaXRlZCB0ZXh0XG4gICAgICogQHBhcmFtIHZhbHVlcyBhbGwgdGhlIHZhbHVlc1xuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzJCh0ZXh0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogKFN0cmluZ1RyYWNrZXIgfCBhbnkpW10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0c1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVzW2ldO1xuXG4gICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0LCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyh2YWx1ZSksIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dHNbdGV4dHMubGVuZ3RoIC0gMV0sIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IHN0cmluZyB0byBhZGRcbiAgICAgKiBAcGFyYW0gYWN0aW9uIHdoZXJlIHRvIGFkZCB0aGUgdGV4dFxuICAgICAqIEBwYXJhbSBpbmZvIGluZm8gdGhlIGNvbWUgd2l0aCB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRUZXh0QWN0aW9uKHRleHQ6IHN0cmluZywgYWN0aW9uOiBcInB1c2hcIiB8IFwidW5zaGlmdFwiLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbywgTGluZUNvdW50ID0gMCwgQ2hhckNvdW50ID0gMSk6IHZvaWQge1xuICAgICAgICBjb25zdCBkYXRhU3RvcmU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mb1tdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgZGF0YVN0b3JlLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkRhdGFBcnJheVthY3Rpb25dKC4uLmRhdGFTdG9yZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJwdXNoXCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZyB3aXRob3V0IHRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlck5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjb3B5ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICBjb3B5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkudW5zaGlmdCguLi5jb3B5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIFRleHQgRmlsZSBUcmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHByaXZhdGUgQWRkRmlsZVRleHQodGV4dDogc3RyaW5nLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbykge1xuICAgICAgICBsZXQgTGluZUNvdW50ID0gMSwgQ2hhckNvdW50ID0gMTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2ltcGxlIG1ldGhvZiB0byBjdXQgc3RyaW5nXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgbmV3IGN1dHRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEN1dFN0cmluZyhzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcblxuICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnB1c2goLi4udGhpcy5EYXRhQXJyYXkuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG5cbiAgICAgICAgd2hpbGUgKChsaW1pdCA9PSBudWxsIHx8IGNvdW50ZXIgPCBsaW1pdCkgJiYgaGFzTWF0aD8uWzBdPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IFsuLi5oYXNNYXRoWzBdXS5sZW5ndGgsIGluZGV4ID0gdGhpcy5jaGFyTGVuZ3RoKGhhc01hdGguaW5kZXgpO1xuICAgICAgICAgICAgYWxsU3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4ICsgYWRkTmV4dCxcbiAgICAgICAgICAgICAgICBsZW5ndGhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYWluVGV4dCA9IG1haW5UZXh0LnNsaWNlKGhhc01hdGguaW5kZXggKyBoYXNNYXRoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXggKyBlLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgbG9jLCBsaW5lLCBjb2wsIHNhc3NTdGFjayB9OiB7IHNhc3NTdGFjaz86IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBsb2M/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyIH0pOiBzdHJpbmcge1xuICAgICAgICBpZiAoc2Fzc1N0YWNrKSB7XG4gICAgICAgICAgICBjb25zdCBsb2MgPSBzYXNzU3RhY2subWF0Y2goL1swLTldKzpbMC05XSsvKVswXS5zcGxpdCgnOicpLm1hcCh4ID0+IE51bWJlcih4KSk7XG4gICAgICAgICAgICBsaW5lID0gbG9jWzBdO1xuICAgICAgICAgICAgY29sID0gbG9jWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSA/PyBsb2M/LmxpbmUgPz8gMSksIGNvbHVtbiA9IGNvbCA/PyBsb2M/LmNvbHVtbiA/PyAwO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKChsaW5lID8/IGxvYz8ubGluZSkgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHNlYXJjaExpbmUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICByZXR1cm4gYCR7bWVzc2FnZX0sIG9uIGZpbGUgLT4gJHtCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aH0ke2RhdGEuaW5mby5zcGxpdCgnPGxpbmU+Jykuc2hpZnQoKX06JHtkYXRhLmxpbmV9OiR7Y29sdW1ufWA7XG4gICAgfVxufSIsICJpbXBvcnQge3Byb21pc2VzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmNvbnN0IGxvYWRQYXRoID0gdHlwZW9mIGVzYnVpbGQgIT09ICd1bmRlZmluZWQnID8gJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvJzogJy8uLi8nO1xuY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwgKyBsb2FkUGF0aCArICdidWlsZC53YXNtJykpKTtcbmNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG5jb25zdCB3YXNtID0gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5sZXQgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldFVpbnQ4TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQ4TWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQ4TWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RW5jb2RlciA6IFRleHRFbmNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgbFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbShwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXIodGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXIocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxubGV0IGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRJbnQzMk1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRJbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRJbnQzMk1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dERlY29kZXIgOiBUZXh0RGVjb2RlcjtcblxubGV0IGNhY2hlZFRleHREZWNvZGVyID0gbmV3IGxUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG4vKipcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2Vycm9ycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5nZXRfZXJyb3JzKHJldHB0cik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gYmxvY2tcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfYmxvY2sodGV4dCwgYmxvY2spIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGJsb2NrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfYmxvY2socHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSBza2lwX3NwZWNpYWxfdGFnXG4qIEBwYXJhbSB7c3RyaW5nfSBzaW1wbGVfc2tpcFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfY29tcG9uZW50KHNraXBfc3BlY2lhbF90YWcsIHNpbXBsZV9za2lwKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChza2lwX3NwZWNpYWxfdGFnLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzaW1wbGVfc2tpcCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHdhc20uaW5zZXJ0X2NvbXBvbmVudChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgZW5kX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZF90eXBlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfZGVmKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gcV90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX3EodGV4dCwgcV90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfcShwdHIwLCBsZW4wLCBxX3R5cGUuY29kZVBvaW50QXQoMCkpO1xuICAgIHJldHVybiByZXQgPj4+IDA7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanModGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanNfbWluKHRleHQsIG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKG5hbWUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzX21pbihyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZWpzX3BhcnNlKHRleHQsIHN0YXJ0LCBlbmQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHN0YXJ0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMiA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5lanNfcGFyc2UocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwdHIyLCBsZW4yKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBjb25zdCBTaW1wbGVTa2lwID0gWyd0ZXh0YXJlYScsJ3NjcmlwdCcsICdzdHlsZSddO1xuZXhwb3J0IGNvbnN0IFNraXBTcGVjaWFsVGFnID0gW1tcIiVcIiwgXCIlXCJdLCBbXCIje2RlYnVnfVwiLCBcIntkZWJ1Z30jXCJdXTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgZmluZF9lbmRfb2ZfZGVmLCBmaW5kX2VuZF9vZl9xLCBmaW5kX2VuZF9ibG9jayB9IGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyc7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMnO1xuaW1wb3J0IHsgZ2V0RGlybmFtZSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBlbmQgb2YgcXVvdGF0aW9uIG1hcmtzLCBza2lwcGluZyB0aGluZ3MgbGlrZSBlc2NhcGluZzogXCJcXFxcXCJcIlxuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW50T2ZRKHRleHQ6IHN0cmluZywgcVR5cGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZykge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoRW5kVHlwZSkpIHtcbiAgICAgICAgICAgIEVuZFR5cGUgPSBbRW5kVHlwZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfZGVmKHRleHQsIEpTT04uc3RyaW5naWZ5KEVuZFR5cGUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYW1lIGFzICdmaW5kRW5kT2ZEZWYnIG9ubHkgd2l0aCBvcHRpb24gdG8gY3VzdG9tICdvcGVuJyBhbmQgJ2Nsb3NlJ1xuICAgICAqIGBgYGpzXG4gICAgICogRmluZEVuZE9mQmxvY2soYGNvb2wgXCJ9XCIgeyBkYXRhIH0gfSBuZXh0YCwgJ3snLCAnfScpXG4gICAgICogYGBgXG4gICAgICogaXQgd2lsbCByZXR1cm4gdGhlIDE4IC0+IFwifSBuZXh0XCJcbiAgICAgKiAgQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIEZpbmRFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgb3Blbjogc3RyaW5nLCBlbmQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfYmxvY2sodGV4dCwgb3BlbiArIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgU2ltcGxlU2tpcDogc3RyaW5nW10gPSBTZXR0aW5ncy5TaW1wbGVTa2lwO1xuICAgIFNraXBTcGVjaWFsVGFnOiBzdHJpbmdbXVtdID0gU2V0dGluZ3MuU2tpcFNwZWNpYWxUYWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW50TmV3PzogYW55KSB7IH1cblxuICAgIHByaXZhdGUgcHJpbnRFcnJvcnModGV4dDogU3RyaW5nVHJhY2tlciwgZXJyb3JzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByaW50TmV3KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIEpTT04ucGFyc2UoZXJyb3JzKS5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXcoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7aS50eXBlX25hbWV9XCIsIHVzZWQgaW46ICR7dGV4dC5hdChOdW1iZXIoaS5pbmRleCkpLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXIodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFyJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFySFRNTCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXJIVE1MJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cbn1cblxudHlwZSBQYXJzZUJsb2NrcyA9IHsgbmFtZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciB9W11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlModGV4dDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKUycsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKU01pbmkodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTTWluaScsIFt0ZXh0LGZpbmRdKSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVKU1BhcnNlcih0ZXh0OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnRUpTUGFyc2VyJywgW3RleHQsIHN0YXJ0LCBlbmRdKSk7XG59IiwgIlxuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuaW50ZXJmYWNlIFNwbGl0VGV4dCB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHR5cGVfbmFtZTogc3RyaW5nLFxuICAgIGlzX3NraXA6IGJvb2xlYW5cbn1cblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcGFyc2Vfc3RyZWFtID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL3JlYWRlci93b3JrZXIuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dFN0cmVhbSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFNwbGl0VGV4dFtdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2J1aWxkX3N0cmVhbScsIFt0ZXh0XSkpO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgUmVwbGFjZUFsbCh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQuc3BsaXQoZmluZCkpIHtcbiAgICAgICAgICAgIG5ld1RleHQgKz0gcmVwbGFjZSArIGk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dC5zdWJzdHJpbmcocmVwbGFjZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuXG5hYnN0cmFjdCBjbGFzcyBSZUJ1aWxkQ29kZUJhc2ljIGV4dGVuZHMgQmFzZUVudGl0eUNvZGUge1xuICAgIHB1YmxpYyBQYXJzZUFycmF5OiBTcGxpdFRleHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuUGFyc2VBcnJheSA9IFBhcnNlQXJyYXk7XG4gICAgfVxuXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBsZXQgT3V0U3RyaW5nID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBPdXRTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUmVwbGFjZUFsbChPdXRTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuXG5cbnR5cGUgRGF0YUNvZGVJbmZvID0ge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbnB1dHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBjbGFzcyBSZUJ1aWxkQ29kZVN0cmluZyBleHRlbmRzIFJlQnVpbGRDb2RlQmFzaWMge1xuICAgIHByaXZhdGUgRGF0YUNvZGU6IERhdGFDb2RlSW5mbztcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKFBhcnNlQXJyYXkpO1xuICAgICAgICB0aGlzLkRhdGFDb2RlID0geyB0ZXh0OiBcIlwiLCBpbnB1dHM6IFtdIH07XG4gICAgICAgIHRoaXMuQ3JlYXRlRGF0YUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgQ29kZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUudGV4dDtcbiAgICB9XG5cbiAgICBzZXQgQ29kZUJ1aWxkVGV4dCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgQWxsSW5wdXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDcmVhdGVEYXRhQ29kZSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGkuaXNfc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBgPHwke3RoaXMuRGF0YUNvZGUuaW5wdXRzLmxlbmd0aH18JHtpLnR5cGVfbmFtZSA/PyAnJ318PmA7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS5pbnB1dHMucHVzaChpLnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIDx8fD4gc3RhcnQgd2l0aCBhICgrLikgbGlrZSB0aGF0IGZvciBleGFtcGxlLCBcIisuPHx8PlwiLCB0aGUgdXBkYXRlIGZ1bmN0aW9uIHdpbGwgZ2V0IHRoZSBsYXN0IFwiU2tpcFRleHRcIiBpbnN0ZWFkIGdldHRpbmcgdGhlIG5ldyBvbmVcbiAgICAgKiBzYW1lIHdpdGggYSAoLS4pIGp1c3QgZm9yIGlnbm9yaW5nIGN1cnJlbnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB0aGUgYnVpbGRlZCBjb2RlXG4gICAgICovXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkRhdGFDb2RlLnRleHQucmVwbGFjZSgvPFxcfChbMC05XSspXFx8W1xcd10qXFx8Pi9naSwgKF8sIGcxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHNbZzFdO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuUmVwbGFjZUFsbChuZXdTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoXG4gICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmIChjb3VudCAhPSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBXaXRoSW5mby5QbHVzKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFdpdGhJbmZvO1xuICAgIH1cblxuICAgIGFzeW5jIGZpbmRTY3JpcHRzKCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBFSlNQYXJzZXIodGhpcy50ZXh0LmVxLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgbGV0IHN1YnN0cmluZyA9IHRoaXMudGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBpLm5hbWU7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGUoJHtzdWJzdHJpbmd9KTtgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlc2NhcGVcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZVNhZmUoJHtzdWJzdHJpbmd9KTtgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWJ1Z1wiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYFxcbnJ1bl9zY3JpcHRfbmFtZSA9IFxcYCR7SlNQYXJzZXIuZml4VGV4dChzdWJzdHJpbmcpfVxcYDtgXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnbm8tdHJhY2snO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogc3Vic3RyaW5nLFxuICAgICAgICAgICAgICAgIHR5cGU6IDxhbnk+dHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dCh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL2AvZ2ksICdcXFxcYCcpLnJlcGxhY2UoL1xcJC9naSwgJ1xcXFx1MDAyNCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0U2ltcGxlUXVvdGVzKHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpO1xuICAgIH1cblxuICAgIFJlQnVpbGRUZXh0KCkge1xuICAgICAgICBjb25zdCBhbGxjb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaS50eXBlID09ICduby10cmFjaycpIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgJyEnLCBpLnRleHQsIHRoaXMuZW5kKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgaS50ZXh0LCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsY29kZTtcbiAgICB9XG5cbiAgICBCdWlsZEFsbChpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHJ1blNjcmlwdCA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuXG4gICAgICAgIGlmICghdGhpcy52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMkYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRGVidWcgJiYgaS50eXBlID09ICdzY3JpcHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYFxcbnJ1bl9zY3JpcHRfY29kZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmlwdFdpdGhJbmZvKGkudGV4dClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcmludEVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYDxwIHN0eWxlPVwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcIj4ke21lc3NhZ2V9PC9wPmA7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIFJ1bkFuZEV4cG9ydCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRleHQsIHBhdGgpXG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLkJ1aWxkQWxsKGlzRGVidWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHNwbGl0MkZyb21FbmQodGV4dDogc3RyaW5nLCBzcGxpdENoYXI6IHN0cmluZywgbnVtVG9TcGxpdEZyb21FbmQgPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0ZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PSBzcGxpdENoYXIpIHtcbiAgICAgICAgICAgICAgICBudW1Ub1NwbGl0RnJvbUVuZC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtVG9TcGxpdEZyb21FbmQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdGV4dC5zdWJzdHJpbmcoMCwgaSksIHRleHQuc3Vic3RyaW5nKGkgKyAxKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RleHRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBSZXN0b3JlVHJhY2sodGV4dDogc3RyaW5nLCBkZWZhdWx0SW5mbzogU3RyaW5nVHJhY2tlckRhdGFJbmZvKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrZXIgPSBuZXcgU3RyaW5nVHJhY2tlcihkZWZhdWx0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsTGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4vLyEnKTtcblxuICAgICAgICB0cmFja2VyLlBsdXMoYWxsTGluZXMuc2hpZnQoKSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbExpbmVzKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvTGluZSA9IGkuc3BsaXQoJ1xcbicsIDEpLnBvcCgpLCBkYXRhVGV4dCA9IGkuc3Vic3RyaW5nKGluZm9MaW5lLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtpbmZvVGV4dCwgbnVtYmVyc10gPSBKU1BhcnNlci5zcGxpdDJGcm9tRW5kKGluZm9MaW5lLCAnOicsIDIpLCBbbGluZSwgY2hhcl0gPSBudW1iZXJzLnNwbGl0KCc6Jyk7XG5cbiAgICAgICAgICAgIHRyYWNrZXIuUGx1cyhuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnXFxuLy8hJyArIGluZm9MaW5lKSk7XG4gICAgICAgICAgICB0cmFja2VyLkFkZFRleHRBZnRlcihkYXRhVGV4dCwgaW5mb1RleHQsIE51bWJlcihsaW5lKSAtIDEsIE51bWJlcihjaGFyKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJhY2tlcjtcbiAgICB9XG59XG5cblxuLy9idWlsZCBzcGVjaWFsIGNsYXNzIGZvciBwYXJzZXIgY29tbWVudHMgLyoqLyBzbyB5b3UgYmUgYWJsZSB0byBhZGQgUmF6b3IgaW5zaWRlIG9mIHN0eWxlIG90IHNjcmlwdCB0YWdcblxuaW50ZXJmYWNlIEdsb2JhbFJlcGxhY2VBcnJheSB7XG4gICAgdHlwZTogJ3NjcmlwdCcgfCAnbm8tdHJhY2snLFxuICAgIHRleHQ6IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGNsYXNzIEVuYWJsZUdsb2JhbFJlcGxhY2Uge1xuICAgIHByaXZhdGUgc2F2ZWRCdWlsZERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheVtdID0gW107XG4gICAgcHJpdmF0ZSBidWlsZENvZGU6IFJlQnVpbGRDb2RlU3RyaW5nO1xuICAgIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVwbGFjZXI6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRkVGV4dCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlciA9IFJlZ0V4cChgJHthZGRUZXh0fVxcXFwvXFxcXCohc3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5cXFxcKlxcXFwvfHN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+YCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5idWlsZENvZGUgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcoYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGF3YWl0IHRoaXMuRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGUpKSk7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBFeHRyYWN0QW5kU2F2ZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29kZSA9IG5ldyBKU1BhcnNlcihjb2RlLCB0aGlzLnBhdGgpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29kZS5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29kZS52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRCdWlsZERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGkudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBgc3lzdGVtLS08fGVqc3wke2NvdW50ZXIrK318PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFBhcnNlT3V0c2lkZU9mQ29tbWVudCh0ZXh0OiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2VyKC9zeXN0ZW0tLTxcXHxlanNcXHwoWzAtOV0pXFx8Pi8sIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBTcGxpdFRvUmVwbGFjZVsxXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihpbmRleC5TdGFydEluZm8pLlBsdXMkYCR7dGhpcy5hZGRUZXh0fS8qIXN5c3RlbS0tPHxlanN8JHtpbmRleH18PiovYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIFN0YXJ0QnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb21tZW50cyA9IG5ldyBKU1BhcnNlcihuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0KSwgdGhpcy5wYXRoLCAnLyonLCAnKi8nKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvbW1lbnRzLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb21tZW50cy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gdGhpcy5QYXJzZU91dHNpZGVPZkNvbW1lbnQoaS50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQgPSBleHRyYWN0Q29tbWVudHMuUmVCdWlsZFRleHQoKS5lcTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2RlLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVzdG9yZUFzQ29kZShEYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKERhdGEudGV4dC5TdGFydEluZm8pLlBsdXMkYDwlJHtEYXRhLnR5cGUgPT0gJ25vLXRyYWNrJyA/ICchJzogJyd9JHtEYXRhLnRleHR9JT5gO1xuICAgIH1cblxuICAgIHB1YmxpYyBSZXN0b3JlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2VyKHRoaXMucmVwbGFjZXIsIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIoU3BsaXRUb1JlcGxhY2VbMV0gPz8gU3BsaXRUb1JlcGxhY2VbMl0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5SZXN0b3JlQXNDb2RlKHRoaXMuc2F2ZWRCdWlsZERhdGFbaW5kZXhdKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmludGVyZmFjZSBnbG9iYWxTdHJpbmc8VD4ge1xuICAgIGluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgc3RhcnRzV2l0aChzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTcGxpdEZpcnN0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHR5cGU6IHN0cmluZywgc3RyaW5nOiBUKTogVFtdIHtcbiAgICBjb25zdCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHR5cGUpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKVxuICAgICAgICByZXR1cm4gW3N0cmluZ107XG5cbiAgICByZXR1cm4gW3N0cmluZy5zdWJzdHJpbmcoMCwgaW5kZXgpLCBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgdHlwZS5sZW5ndGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1dFRoZUxhc3QodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZih0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBtaW5pZnkgfSBmcm9tIFwidGVyc2VyXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIHJlcGxhY2VGb3JDbGllbnQoQmV0d2VlblRhZ0RhdGE6IHN0cmluZywgZXhwb3J0SW5mbzogc3RyaW5nKSB7XG4gICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5yZXBsYWNlKGBcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHt2YWx1ZTogdHJ1ZX0pO2AsIGV4cG9ydEluZm8pO1xuICAgIHJldHVybiBCZXR3ZWVuVGFnRGF0YTtcbn1cblxuY29uc3Qgc2VydmVTY3JpcHQgPSAnL3NlcnYvdGVtcC5qcyc7XG5cbmFzeW5jIGZ1bmN0aW9uIHRlbXBsYXRlKEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZTogQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlLCBuYW1lOiBzdHJpbmcsIHBhcmFtczogc3RyaW5nLCBzZWxlY3Rvcjogc3RyaW5nLCBtYWluQ29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBKU1BhcnNlci5SdW5BbmRFeHBvcnQobWFpbkNvZGUsIHBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3IgPSBcIiR7c2VsZWN0b3J9XCIsIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke3JlcGxhY2VGb3JDbGllbnQoXG4gICAgICAgIGF3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSksXG4gICAgICAgIGB2YXIgZXhwb3J0cyA9ICR7bmFtZX0uZXhwb3J0cztgXG4gICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZW5kVG9TZWxlY3RvcihzZWxlY3Rvciwgb3V0X3J1bl9zY3JpcHQudGV4dCk7XG4gICAgfVxcbiR7bmFtZX0uZXhwb3J0cyA9IHt9O2Bcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlOiBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHBhdGgsIExhc3RTbWFsbFBhdGgsICh4OiBTdHJpbmdUcmFja2VyKSA9PiB4LmVxLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHthc3luYzogbnVsbH0pO1xuXG4gICAgbGV0IHNjcmlwdEluZm8gPSBhd2FpdCB0ZW1wbGF0ZShcbiAgICAgICAgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIGRhdGFUYWcuZ2V0VmFsdWUoJ3BhcmFtcycpLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCdzZWxlY3RvcicpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgbWluU2NyaXB0ID0gSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpO1xuXG4gICAgaWYgKG1pblNjcmlwdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2NyaXB0SW5mbyA9IChhd2FpdCBtaW5pZnkoc2NyaXB0SW5mbywgeyBtb2R1bGU6IGZhbHNlLCBmb3JtYXQ6IHsgY29tbWVudHM6ICdhbGwnIH0gfSkpLmNvZGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWluaWZ5JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBCZXR3ZWVuVGFnRGF0YS5kZWJ1Z0xpbmUoZXJyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dChzY3JpcHRJbmZvKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcblxuZXhwb3J0IGludGVyZmFjZSBQcmV2ZW50TG9nIHtcbiAgICBpZD86IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgZXJyb3JOYW1lOiBzdHJpbmcsXG4gICAgdHlwZT86IFwid2FyblwiIHwgXCJlcnJvclwiXG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nczoge1ByZXZlbnRFcnJvcnM6IHN0cmluZ1tdfSA9IHtcbiAgICBQcmV2ZW50RXJyb3JzOiBbXVxufVxuXG5jb25zdCBQcmV2ZW50RG91YmxlTG9nOiBzdHJpbmdbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgQ2xlYXJXYXJuaW5nID0gKCkgPT4gUHJldmVudERvdWJsZUxvZy5sZW5ndGggPSAwO1xuXG4vKipcbiAqIElmIHRoZSBlcnJvciBpcyBub3QgaW4gdGhlIFByZXZlbnRFcnJvcnMgYXJyYXksIHByaW50IHRoZSBlcnJvclxuICogQHBhcmFtIHtQcmV2ZW50TG9nfSAgLSBgaWRgIC0gVGhlIGlkIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByaW50SWZOZXcoe2lkLCB0ZXh0LCB0eXBlID0gXCJ3YXJuXCIsIGVycm9yTmFtZX06IFByZXZlbnRMb2cpIHtcbiAgICBpZighUHJldmVudERvdWJsZUxvZy5pbmNsdWRlcyhpZCA/PyB0ZXh0KSAmJiAhU2V0dGluZ3MuUHJldmVudEVycm9ycy5pbmNsdWRlcyhlcnJvck5hbWUpKXtcbiAgICAgICAgcHJpbnRbdHlwZV0odGV4dC5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJyksIGBcXG5cXG5FcnJvciBjb2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKTtcbiAgICAgICAgUHJldmVudERvdWJsZUxvZy5wdXNoKGlkID8/IHRleHQpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnc3VjcmFzZSc7XG5pbXBvcnQgeyBtaW5pZnkgfSBmcm9tIFwidGVyc2VyXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgbGV0IHJlc3VsdCA9ICcnLCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHRyYW5zZm9ybXM6IFtdLFxuICAgICAgICAuLi5JbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy50cmFuc2Zvcm1zLnB1c2goJ3R5cGVzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLnRyYW5zZm9ybXMucHVzaCgnanN4Jyk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy50cmFuc2Zvcm1zLnB1c2goJ3R5cGVzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLnRyYW5zZm9ybXMucHVzaCgnanN4Jyk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKFwiVFNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQgPSB0cmFuc2Zvcm0oQmV0d2VlblRhZ0RhdGFFeHRyYWN0ZWQsIEFkZE9wdGlvbnMpLmNvZGU7XG5cbiAgICAgICAgaWYgKEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIk1pblwiICsgbGFuZ3VhZ2UudG9VcHBlckNhc2UoKSkgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKXtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGF3YWl0IG1pbmlmeShyZXN1bHQsIHsgbW9kdWxlOiBmYWxzZSwgZm9ybWF0OiB7IGNvbW1lbnRzOiAnYWxsJyB9IH0pKS5jb2RlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21pbmlmeScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IEJldHdlZW5UYWdEYXRhLmRlYnVnTGluZShlcnIpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIFJlc0NvZGUgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIHJlc3VsdCkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IEJldHdlZW5UYWdEYXRhLmRlYnVnTGluZShlcnIpXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtSZXNDb2RlfTwvc2NyaXB0PmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ3N1Y3Jhc2UnO1xuaW1wb3J0IHsgbWluaWZ5IH0gZnJvbSBcInRlcnNlclwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4uL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCB0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIExhc3RTbWFsbFBhdGg6IHN0cmluZywgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLmdldFZhbHVlKCd0eXBlJykgPT0gJ21vZHVsZScsIGlzTW9kZWxTdHJpbmdDYWNoZSA9IGlzTW9kZWwgPyAnc2NyaXB0TW9kdWxlJzogJ3NjcmlwdCc7XG5cbiAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5pbmNsdWRlcyhCZXR3ZWVuVGFnRGF0YUVxQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5wdXNoKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pO1xuXG4gICAgbGV0IHJlc3VsdENvZGUgPSAnJztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHRyYW5zZm9ybXM6IFtdLFxuICAgICAgICAuLi5JbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy50cmFuc2Zvcm1zLnB1c2goJ3R5cGVzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLnRyYW5zZm9ybXMucHVzaCgnanN4Jyk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy50cmFuc2Zvcm1zLnB1c2goJ3R5cGVzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLnRyYW5zZm9ybXMucHVzaCgnanN4Jyk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKFwiVFNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRDb2RlID0gdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhLmVxLCBBZGRPcHRpb25zKS5jb2RlO1xuXG4gICAgICAgIGlmIChJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIk1pbkFsbFwiKSl7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3VsdENvZGUgPSAoYXdhaXQgbWluaWZ5KHJlc3VsdENvZGUsIHsgbW9kdWxlOiBmYWxzZSwgZm9ybWF0OiB7IGNvbW1lbnRzOiAnYWxsJyB9IH0pKS5jb2RlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21pbmlmeScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IEJldHdlZW5UYWdEYXRhLmRlYnVnTGluZShlcnIpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBCZXR3ZWVuVGFnRGF0YS5kZWJ1Z0xpbmUoZXJyKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZShpc01vZGVsID8gJ21vZHVsZSc6ICdzY3JpcHQnLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKHRhZ0RhdGEsICdwYWdlJykgPyBMYXN0U21hbGxQYXRoIDogQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSk7XG4gICAgcHVzaFN0eWxlLmFkZFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIHt0ZXh0OiByZXN1bHRDb2RlfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH07XG59IiwgImltcG9ydCB0eXBlIHsgdGFnRGF0YU9iamVjdEFycmF5fSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy4uWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCcuLicpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCBudW06IG51bWJlcikgPT4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1zdHJpbmdcIjogW1xuICAgICAgICAvXnN0cmluZ3x0ZXh0K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBgXCIke3gudHJpbSgpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyl9XCJgKSxcbiAgICAgICAgKG9wdGlvbnM6IHN0cmluZ1tdLCB0ZXh0OiBzdHJpbmcpID0+IG9wdGlvbnMuaW5jbHVkZXModGV4dCksXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLW51bWJlclwiOiBbXG4gICAgICAgIC9ebnVtYmVyfG51bXxpbnRlZ2VyfGludCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gcGFyc2VGbG9hdCh4KSksXG4gICAgICAgIChvcHRpb25zOiBudW1iZXJbXSwgbnVtOiBudW1iZXIpID0+IG9wdGlvbnMuaW5jbHVkZXMobnVtKSxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF1cbn07XG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycyA9IFsuLi5udW1iZXJzXTtcblxuZm9yKGNvbnN0IGkgaW4gYnVpbHRJbkNvbm5lY3Rpb25SZWdleCl7XG4gICAgY29uc3QgdHlwZSA9IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbaV1bM107XG5cbiAgICBpZihidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXModHlwZSkpXG4gICAgICAgIGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5wdXNoKGkpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVmFsdWVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG5cbiAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb24uaW5jbHVkZXModmFsdWUpKVxuICAgICAgICByZXR1cm4gYFtcIiR7dmFsdWV9XCJdYDtcblxuICAgIGZvciAoY29uc3QgW25hbWUsIFt0ZXN0LCBnZXRBcmdzXV0gb2YgT2JqZWN0LmVudHJpZXMoYnVpbHRJbkNvbm5lY3Rpb25SZWdleCkpXG4gICAgICAgIGlmICgoPFJlZ0V4cD50ZXN0KS50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiBgW1wiJHtuYW1lfVwiLCAkeyg8YW55PmdldEFyZ3MpKHZhbHVlKX1dYDtcblxuICAgIHJldHVybiBgWyR7dmFsdWV9XWA7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VWYWxpZGF0aW9uSlNPTihhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogUHJvbWlzZTxib29sZWFuIHwgc3RyaW5nW10+IHtcblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudCwgLi4uZWxlbWVudEFyZ3NdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcbiAgICAgICAgbGV0IHJldHVybk5vdyA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBpc0RlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgY2FzZSAnbnVtJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICBjYXNlICdib29sJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgICAgY2FzZSAnaW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhZW1haWxWYWxpZGF0b3IudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGF2ZVJlZ2V4ID0gdmFsdWUgIT0gbnVsbCAmJiBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWhhdmVSZWdleFsyXShlbGVtZW50QXJncywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IGVsZW1lbnQudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWF3YWl0IGVsZW1lbnQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk5vdykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBgZmFpbGVkIGF0ICR7aX0gZmlsZWQgLSAke2lzRGVmYXVsdCA/IHJldHVybk5vdyA6ICdleHBlY3RlZCAnICsgZWxlbWVudH1gO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50QXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaW5mbyArPSBgLCBhcmd1bWVudHM6ICR7SlNPTi5zdHJpbmdpZnkoZWxlbWVudEFyZ3MpfWA7XG5cbiAgICAgICAgICAgIGluZm8gKz0gYCwgaW5wdXQ6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBbaW5mbywgZWxlbWVudCwgZWxlbWVudEFyZ3MsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VWYWx1ZXMoYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBwYXJzZWQgPSBbXTtcblxuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50XSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG5cbiAgICAgICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHBhcnNlRmxvYXQodmFsdWUpKTtcblxuICAgICAgICBlbHNlIGlmIChib29sZWFucy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIGZpbmQ6IHN0cmluZywgZGVmYXVsdERhdGE6IGFueSA9IG51bGwpOiBzdHJpbmcgfCBudWxsIHwgYm9vbGVhbntcbiAgICBjb25zdCBoYXZlID0gZGF0YS5oYXZlKGZpbmQpLCB2YWx1ZSA9IGRhdGEucmVtb3ZlKGZpbmQpO1xuXG4gICAgaWYoaGF2ZSAmJiB2YWx1ZSAhPSAnZmFsc2UnKSByZXR1cm4gdmFsdWUgfHwgaGF2ZSAgICBcbiAgICBpZih2YWx1ZSA9PT0gJ2ZhbHNlJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYoIWhhdmUpIHJldHVybiBkZWZhdWx0RGF0YTtcblxuICAgIHJldHVybiB2YWx1ZTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBidWlsZFNjcmlwdDogQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBpZiAoZGF0YVRhZy5oYXZlKCdzcmMnKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7QmV0d2VlblRhZ0RhdGF9PC9zY3JpcHQ+YFxuICAgICAgICB9XG5cbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucmVtb3ZlKCdsYW5nJykgfHwgJ2pzJztcblxuICAgIGlmIChkYXRhVGFnLmhhdmUoJ3NlcnZlcicpKSB7XG4gICAgICAgIGRhdGFUYWcucmVtb3ZlKCdzZXJ2ZXInKTtcbiAgICAgICAgcmV0dXJuIHNjcmlwdFdpdGhTZXJ2ZXIobGFuZ3VhZ2UsIHBhdGgsIHBhdGhOYW1lLCBMYXN0U21hbGxQYXRoLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NyaXB0V2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgTGFzdFNtYWxsUGF0aCwgQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCB9IGZyb20gXCJzb3VyY2UtbWFwLWpzXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50XCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZywgU29tZVBsdWdpbnM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nLCBTb21lUGx1Z2luczogYW55KSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIFNvbWVQbHVnaW5zKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJyl7XG4gICAgcmV0dXJuIGxhbmd1YWdlID09ICdzYXNzJyA/ICdpbmRlbnRlZCc6IGxhbmd1YWdlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Fzc0FuZFNvdXJjZShzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgc291cmNlOiBzdHJpbmcpe1xuICAgIGlmKCFzb3VyY2VNYXApIHJldHVybjtcbiAgICBmb3IoY29uc3QgaSBpbiBzb3VyY2VNYXAuc291cmNlcyl7XG4gICAgICAgIGlmKHNvdXJjZU1hcC5zb3VyY2VzW2ldLnN0YXJ0c1dpdGgoJ2RhdGE6Jykpe1xuICAgICAgICAgICAgc291cmNlTWFwLnNvdXJjZXNbaV0gPSBzb3VyY2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIG91dFN0eWxlID0gQmV0d2VlblRhZ0RhdGEuZXEpIHtcbiAgICBjb25zdCB0aGlzUGFnZSA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgdGhpc1BhZ2VVUkwgPSBwYXRoVG9GaWxlVVJMKHRoaXNQYWdlKSxcbiAgICAgICAgY29tcHJlc3NlZCA9IG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXhwcmVzc2lvbikge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIHRleHQ6IEJldHdlZW5UYWdEYXRhLmRlYnVnTGluZShleHByZXNzaW9uKSxcbiAgICAgICAgICAgIGVycm9yTmFtZTogZXhwcmVzc2lvbj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgICAgIHR5cGU6IGV4cHJlc3Npb24/LnN0YXR1cyA9PSA1ID8gJ3dhcm4nIDogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpLCBGdWxsUGF0aClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgdGhpc1BhZ2VVUkwuaHJlZik7XG4gICAgcmV0dXJuIHsgcmVzdWx0LCBvdXRTdHlsZSwgY29tcHJlc3NlZCB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEVuYWJsZUdsb2JhbFJlcGxhY2UgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgeyBjb21waWxlU2FzcyB9IGZyb20gJy4vc2Fzcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZSgpO1xuICAgIGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLmxvYWQoQmV0d2VlblRhZ0RhdGEudHJpbVN0YXJ0KCksIHBhdGhOYW1lKTtcblxuICAgIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGxldCB7IG91dFN0eWxlLCBjb21wcmVzc2VkIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8sIGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKSk7XG5cbiAgICBpZiAoIWNvbXByZXNzZWQpXG4gICAgICAgIG91dFN0eWxlID0gYFxcbiR7b3V0U3R5bGV9XFxuYDtcblxuICAgIGNvbnN0IHJlU3RvcmVEYXRhID0gU2F2ZVNlcnZlckNvZGUuUmVzdG9yZUNvZGUobmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvLCBvdXRTdHlsZSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c3R5bGUke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke3JlU3RvcmVEYXRhfTwvc3R5bGU+YFxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4vU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBHZW5lcmF0b3IsIFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJvdGVjdGVkIG1hcDogU291cmNlTWFwR2VuZXJhdG9yO1xuICAgIHByb3RlY3RlZCBmaWxlRGlyTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBsaW5lQ291bnQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBodHRwU291cmNlID0gdHJ1ZSwgcHJvdGVjdGVkIGlzQ3NzID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnBvcCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaHR0cFNvdXJjZSlcbiAgICAgICAgICAgIHRoaXMuZmlsZURpck5hbWUgPSBwYXRoLmRpcm5hbWUodGhpcy5maWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFNvdXJjZShzb3VyY2U6IHN0cmluZykge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2Uuc3BsaXQoJzxsaW5lPicpLnBvcCgpLnRyaW0oKTtcblxuICAgICAgICBpZiAodGhpcy5odHRwU291cmNlKSB7XG4gICAgICAgICAgICBpZiAoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoc291cmNlKS5zdWJzdHJpbmcoMSkpKVxuICAgICAgICAgICAgICAgIHNvdXJjZSArPSAnLnNvdXJjZSc7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gU3BsaXRGaXJzdCgnLycsIHNvdXJjZSkucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4oJy8nLCBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICBsZXQgbWFwU3RyaW5nID0gYHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20odGhpcy5tYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgICAgICBpZiAodGhpcy5pc0NzcylcbiAgICAgICAgICAgIG1hcFN0cmluZyA9IGAvKiMgJHttYXBTdHJpbmd9Ki9gXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgICAgICByZXR1cm4gJ1xcclxcbicgKyBtYXBTdHJpbmc7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VNYXBTdG9yZSBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcml2YXRlIHN0b3JlU3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Mb2FkOiB7IG5hbWU6IHN0cmluZywgZGF0YTogYW55W10gfVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgZGVidWcgPSB0cnVlLCBpc0NzcyA9IGZhbHNlLCBodHRwU291cmNlID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFzeW5jIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIG5ldyBTb3VyY2VNYXBDb25zdW1lcihmcm9tTWFwKS5lYWNoTWFwcGluZygobSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUluZm8gPSB0cmFjay5nZXRMaW5lKG0ub3JpZ2luYWxMaW5lKS5nZXREYXRhQXJyYXkoKVswXTtcblxuICAgICAgICAgICAgaWYgKG0uc291cmNlID09IHRoaXMuZmlsZVBhdGgpXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBkYXRhSW5mby5saW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSArIHRoaXMubGluZUNvdW50LCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2FkZFRleHQodGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZEFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGRhdGEgfSBvZiB0aGlzLmFjdGlvbkxvYWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRUZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRleHQoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBBc1VSTENvbW1lbnQoKSB7XG4gICAgICAgIHRoaXMuYnVpbGRBbGwoKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIubWFwQXNVUkxDb21tZW50KClcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhV2l0aE1hcCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZztcblxuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZyArIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpO1xuICAgIH1cblxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IFNvdXJjZU1hcFN0b3JlKHRoaXMuZmlsZVBhdGgsIHRoaXMuZGVidWcsIHRoaXMuaXNDc3MsIHRoaXMuaHR0cFNvdXJjZSk7XG4gICAgICAgIGNvcHkuYWN0aW9uTG9hZC5wdXNoKC4uLnRoaXMuYWN0aW9uTG9hZClcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIHRhZ0RhdGFPYmplY3RBcnJheSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5pbXBvcnQgeyBjb21waWxlU2FzcyB9IGZyb20gJy4vc2Fzcyc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBvdXRTdHlsZUFzVHJpbSA9IEJldHdlZW5UYWdEYXRhLmVxLnRyaW0oKTtcbiAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUuaW5jbHVkZXMob3V0U3R5bGVBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZS5zdHlsZS5wdXNoKG91dFN0eWxlQXNUcmltKTtcblxuICAgIGNvbnN0IHsgcmVzdWx0LCBvdXRTdHlsZSB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlKCdzdHlsZScsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3BhZ2UnKSA/IExhc3RTbWFsbFBhdGggOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKTtcblxuICAgIGlmIChyZXN1bHQ/LnNvdXJjZU1hcClcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKFNvdXJjZU1hcFN0b3JlLmZpeFVSTFNvdXJjZU1hcChyZXN1bHQuc291cmNlTWFwKSwgQmV0d2VlblRhZ0RhdGEsIG91dFN0eWxlKTtcbiAgICBlbHNlXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB7IHRleHQ6IG91dFN0eWxlIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBzdHlsZVdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHN0eWxlV2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5yZW1vdmUoJ2xhbmcnKSB8fCAnY3NzJztcblxuICAgIGlmKGRhdGFUYWcuaGF2ZSgnc2VydmVyJykpe1xuICAgICAgICBkYXRhVGFnLnJlbW92ZSgnc2VydmVyJyk7XG4gICAgICAgIHJldHVybiBzdHlsZVdpdGhTZXJ2ZXIobGFuZ3VhZ2UsIHBhdGgsIHBhdGhOYW1lLCBMYXN0U21hbGxQYXRoLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlV2l0aENsaWVudChsYW5ndWFnZSwgcGF0aCwgcGF0aE5hbWUsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoX25vZGUgZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZUluRmlsZSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIEluRm9sZGVyUGFnZVBhdGgoaW5wdXRQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOnN0cmluZyl7XG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGlucHV0UGF0aFsxXSA9PSAnLycpIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb2xkZXIgPSBwYXRoX25vZGUuZGlybmFtZShmdWxsUGF0aCkuc3Vic3RyaW5nKGdldFR5cGVzLlN0YXRpY1swXS5sZW5ndGgpO1xuXG4gICAgICAgIGlmKGZvbGRlcil7XG4gICAgICAgICAgICBmb2xkZXIgKz0gJy8nO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGZvbGRlciArIGlucHV0UGF0aDtcbiAgICB9IGVsc2UgaWYgKGlucHV0UGF0aFswXSA9PSAnLycpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWdlVHlwZSA9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgaWYoIWlucHV0UGF0aC5lbmRzV2l0aChwYWdlVHlwZSkpe1xuICAgICAgICBpbnB1dFBhdGggKz0gcGFnZVR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0UGF0aDtcbn1cblxuY29uc3QgY2FjaGVNYXA6IHsgW2tleTogc3RyaW5nXToge0NvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkfX0gPSB7fTtcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBmaWxlcGF0aCA9IGRhdGFUYWcuZ2V0VmFsdWUoXCJmcm9tXCIpO1xuXG4gICAgY29uc3QgU21hbGxQYXRoV2l0aG91dEZvbGRlciA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHBhdGgpO1xuXG4gICAgY29uc3QgRnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyLCBTbWFsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdGV4dDogYFxcblBhZ2Ugbm90IGZvdW5kOiAke3R5cGUuYXQoMCkubGluZUluZm99IC0+ICR7RnVsbFBhdGh9YCxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3BhZ2Utbm90LWZvdW5kJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQsIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+UGFnZSBub3QgZm91bmQ6ICR7dHlwZS5saW5lSW5mb30gLT4gJHtTbWFsbFBhdGh9PC9wPmApXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtTbWFsbFBhdGhXaXRob3V0Rm9sZGVyXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb259ID0gYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUoU21hbGxQYXRoV2l0aG91dEZvbGRlciwgZ2V0VHlwZXMuU3RhdGljLCBudWxsLCBwYXRoTmFtZSwgZGF0YVRhZy5yZW1vdmUoJ29iamVjdCcpKTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdID0ge0NvbXBpbGVkRGF0YTo8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb259O1xuICAgICAgICBSZXR1cm5EYXRhID08U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdO1xuICAgXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvY2Vzcy5vbignZXhpdCcsIHRoaXMuc2F2ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkRmlsZSgpIHtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuc2F2ZVBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IEpTT04ucGFyc2UoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMuc2F2ZVBhdGgpIHx8ICd7fScpO1xuICAgIH1cblxuICAgIHVwZGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUga2V5IGlzIGluIHRoZSBzdG9yZSwgcmV0dXJuIHRoZSB2YWx1ZS4gSWYgbm90LCBjcmVhdGUgYSBuZXcgdmFsdWUsIHN0b3JlIGl0LCBhbmQgcmV0dXJuIGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gbG9vayB1cCBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIFtjcmVhdGVdIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdHJpbmcuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIG9mIHRoZSBrZXkgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIGhhdmUoa2V5OiBzdHJpbmcsIGNyZWF0ZT86ICgpID0+IHN0cmluZykge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RvcmVba2V5XTtcbiAgICAgICAgaWYgKGl0ZW0gfHwgIWNyZWF0ZSkgcmV0dXJuIGl0ZW07XG5cbiAgICAgICAgaXRlbSA9IGNyZWF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZShrZXksIGl0ZW0pO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdGhpcy5zdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVtpXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbaV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZSgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKHRoaXMuc2F2ZVBhdGgsIHRoaXMuc3RvcmUpO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuL0Vhc3lGc1wiO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tIFwiLi9TdG9yZUpTT05cIjtcblxuZXhwb3J0IGNvbnN0IHBhZ2VEZXBzID0gbmV3IFN0b3JlSlNPTignUGFnZXNJbmZvJylcblxuLyoqXG4gKiBDaGVjayBpZiBhbnkgb2YgdGhlIGRlcGVuZGVuY2llcyBvZiB0aGUgcGFnZSBoYXZlIGNoYW5nZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge1N0cmluZ051bWJlck1hcH0gZGVwZW5kZW5jaWVzIC0gQSBtYXAgb2YgZGVwZW5kZW5jaWVzLiBUaGUga2V5IGlzIHRoZSBwYXRoIHRvIHRoZSBmaWxlLCBhbmRcbiAqIHRoZSB2YWx1ZSBpcyB0aGUgbGFzdCBtb2RpZmllZCB0aW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHBhdGg6c3RyaW5nLCBkZXBlbmRlbmNpZXM6IFN0cmluZ051bWJlck1hcCA9IHBhZ2VEZXBzLnN0b3JlW3BhdGhdKSB7XG4gICAgZm9yIChjb25zdCBpIGluIGRlcGVuZGVuY2llcykge1xuICAgICAgICBsZXQgcCA9IGk7XG5cbiAgICAgICAgaWYgKGkgPT0gJ3RoaXNQYWdlJykge1xuICAgICAgICAgICAgcCA9IHBhdGggKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBGaWxlUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBkZXBlbmRlbmNpZXNbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiAhZGVwZW5kZW5jaWVzO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBpc29sYXRlKEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8pO1xuXG4gICAgY29tcGlsZWRTdHJpbmcuUGx1cyQgYDwleyU+JHtCZXR3ZWVuVGFnRGF0YX08JX0lPmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZyxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ051bWJlck1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IGdldFR5cGVzLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyByZWdpc3RlckV4dGVuc2lvbiwgY2FwaXRhbGl6ZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUnO1xuaW1wb3J0IHsgcmVidWlsZEZpbGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG4vL0B0cy1pZ25vcmUtbmV4dC1saW5lXG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlLCB7IHJlc29sdmUsIGNsZWFyTW9kdWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuXG5hc3luYyBmdW5jdGlvbiBzc3JIVE1MKGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgRnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGdldFYgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGd2ID0gKG5hbWU6IHN0cmluZykgPT4gZGF0YVRhZy5nZXRWYWx1ZShuYW1lKS50cmltKCksXG4gICAgICAgICAgICB2YWx1ZSA9IGd2KCdzc3InICsgY2FwaXRhbGl6ZShuYW1lKSkgfHwgZ3YobmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gZXZhbChgKCR7dmFsdWUuY2hhckF0KDApID09ICd7JyA/IHZhbHVlIDogYHske3ZhbHVlfX1gfSlgKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgbmV3RGVwcyA9IHt9O1xuICAgIGNvbnN0IGJ1aWxkUGF0aCA9IGF3YWl0IHJlZ2lzdGVyRXh0ZW5zaW9uKEZ1bGxQYXRoLCBzbWFsbFBhdGgsIG5ld0RlcHMsIHNlc3Npb25JbmZvLmRlYnVnKTtcbiAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgbmV3RGVwcyk7XG5cbiAgICBjb25zdCBtb2RlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGJ1aWxkUGF0aCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbmV3RGVwcykge1xuICAgICAgICBpZihbJ3Nhc3MnLCAnc2NzcycsICdjc3MnXS5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoaSkuc3Vic3RyaW5nKDEpKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBjbGVhck1vZHVsZShyZXNvbHZlKGdldFR5cGVzLlN0YXRpY1sxXSArIGkuc3Vic3RyaW5nKGdldFR5cGVzLlN0YXRpY1syXS5sZW5ndGggKyAxKSArICcuc3NyLmNqcycpKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGh0bWwsIGhlYWQgfSA9IG1vZGUuZGVmYXVsdC5yZW5kZXIoZ2V0VigncHJvcHMnKSwgZ2V0Vignb3B0aW9ucycpKTtcbiAgICBzZXNzaW9uSW5mby5oZWFkSFRNTCArPSBoZWFkO1xuICAgIHJldHVybiBodG1sO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChwYXRoLCBMYXN0U21hbGxQYXRoLCBkYXRhVGFnLnJlbW92ZSgnZnJvbScpLCBnZXRUeXBlcy5TdGF0aWNbMl0sICdzdmVsdGUnKTtcbiAgICBjb25zdCBpbldlYlBhdGggPSByZWxhdGl2ZShnZXRUeXBlcy5TdGF0aWNbMl0sIFNtYWxsUGF0aCkucmVwbGFjZSgvXFxcXC9naSwgJy8nKTtcblxuICAgIHNlc3Npb25JbmZvLnN0eWxlKCcvJyArIGluV2ViUGF0aCArICcuY3NzJyk7XG5cbiAgICBjb25zdCBpZCA9IGRhdGFUYWcucmVtb3ZlKCdpZCcpIHx8IEJhc2U2NElkKGluV2ViUGF0aCksXG4gICAgICAgIGhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGFUYWcuZ2V0VmFsdWUobmFtZSkudHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gYCwke25hbWV9OiR7dmFsdWUuY2hhckF0KDApID09ICd7JyA/IHZhbHVlIDogYHske3ZhbHVlfX1gfWAgOiAnJztcbiAgICAgICAgfSwgc2VsZWN0b3IgPSBkYXRhVGFnLnJlbW92ZSgnc2VsZWN0b3InKTtcblxuICAgIGNvbnN0IHNzciA9ICFzZWxlY3RvciAmJiBkYXRhVGFnLmhhdmUoJ3NzcicpID8gYXdhaXQgc3NySFRNTChkYXRhVGFnLCBGdWxsUGF0aCwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbykgOiAnJztcblxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGUoJ21vZHVsZScsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3BhZ2UnKSA/IExhc3RTbWFsbFBhdGggOiB0eXBlLmV4dHJhY3RJbmZvKCkpLmFkZFRleHQoXG5gaW1wb3J0IEFwcCR7aWR9IGZyb20gJy8ke2luV2ViUGF0aH0nO1xuY29uc3QgdGFyZ2V0JHtpZH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiJHtzZWxlY3RvciA/IHNlbGVjdG9yIDogJyMnICsgaWR9XCIpO1xudGFyZ2V0JHtpZH0gJiYgbmV3IEFwcCR7aWR9KHtcbiAgICB0YXJnZXQ6IHRhcmdldCR7aWR9XG4gICAgJHtoYXZlKCdwcm9wcycpICsgaGF2ZSgnb3B0aW9ucycpfSR7c3NyID8gJywgaHlkcmF0ZTogdHJ1ZScgOiAnJ31cbn0pO2ApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHNlbGVjdG9yID8gJycgOiBgPGRpdiBpZD1cIiR7aWR9XCI+JHtzc3J9PC9kaXY+YCksXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUlkKHRleHQ6IHN0cmluZywgbWF4ID0gMTApe1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh0ZXh0KS50b1N0cmluZygnYmFzZTY0Jykuc3Vic3RyaW5nKDAsIG1heCkucmVwbGFjZSgvXFwrLywgJ18nKS5yZXBsYWNlKC9cXC8vLCAnXycpO1xufSIsICJpbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdzdWNyYXNlJztcbmltcG9ydCB7IG1pbmlmeSB9IGZyb20gXCJ0ZXJzZXJcIjtcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7djQgYXMgdXVpZH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgY3JlYXRlSW1wb3J0ZXIsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBkZXBlbmRlbmNlT2JqZWN0OlN0cmluZ051bWJlck1hcCA9IHt9LCBtYWtlQWJzb2x1dGU/OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmcsIHN2ZWx0ZUV4dCA9ICcnKXtcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTtcblxuICAgIGNvbnN0IGFkZFN0eWxlID0gW107XG4gICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXMsIG1hcCB9ID0gIGF3YWl0IHN2ZWx0ZS5wcmVwcm9jZXNzKGNvbnRlbnQsIHtcbiAgICAgICAgYXN5bmMgc3R5bGUoeyBjb250ZW50LCBhdHRyaWJ1dGVzLCBmaWxlbmFtZSB9KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjc3MsIGxvYWRlZFVybHMgfSA9IGF3YWl0IHNhc3MuY29tcGlsZVN0cmluZ0FzeW5jKGNvbnRlbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+YXR0cmlidXRlcy5sYW5nKSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZSg8c3RyaW5nPmF0dHJpYnV0ZXMubGFuZywgU29tZVBsdWdpbnMpLFxuICAgICAgICAgICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICAgICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogY3NzLFxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7ZnVsbFBhdGh9JHtlcnIubGluZSA/ICc6JyArIGVyci5saW5lIDogJyd9YCxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29kZTogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgc2NyaXB0KHsgY29udGVudCwgYXR0cmlidXRlcyB9KSB7XG4gICAgICAgICAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvKChpbXBvcnQoe3xbIF0qXFwoPyl8KChpbXBvcnR8ZXhwb3J0KSh7fFsgXSspW1xcV1xcd10rPyh9fFsgXSspZnJvbSkpKH18WyBdKikpKFtcInwnfGBdKShbXFxXXFx3XSs/KVxcOShbIF0qXFwpPykvZ21pLCAoc3Vic3RyaW5nOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXh0ID0gZXh0bmFtZShhcmdzWzldKTtcblxuICAgICAgICAgICAgICAgIGlmKGV4dCA9PSAnLnN2ZWx0ZScpXG4gICAgICAgICAgICAgICAgICAgIGFkZFN0eWxlLnB1c2goYXJnc1s5XSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZihleHQgPT0gJycpXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLmxhbmcgPT0gJ3RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NbOV0gKz0gJy50cyc7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NbOV0gKz0gJy5qcyc7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRhID0gYXJnc1swXSArIGFyZ3NbOF0gKyAobWFrZUFic29sdXRlID8gbWFrZUFic29sdXRlKGFyZ3NbOV0pOiBhcmdzWzldKSArIChleHQgPT0gJy5zdmVsdGUnID8gc3ZlbHRlRXh0OiAnJykgKyBhcmdzWzhdICsgKGFyZ3NbMTBdID8/ICcnKTtcblxuICAgICAgICAgICAgICAgIGlmKGF0dHJpYnV0ZXMubGFuZyAhPT0gJ3RzJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgICAgICAgICBtYXBUb2tlbltpZF0gPSBuZXdEYXRhO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGEgKyBgLyp1dWlkLSR7aWR9Ki9gO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGFuZyAhPT0gJ3RzJykgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvZGU6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHRva2VuQ29kZTogc3RyaW5nO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0b2tlbkNvZGUgPSB0cmFuc2Zvcm0oY29udGVudCwgeyAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpLCB0cmFuc2Zvcm1zOiBbJ3R5cGVzY3JpcHQnXSB9KS5jb2RlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7ZnVsbFBhdGh9OiR7ZXJyPy5sb2M/LmxpbmUgPz8gMH06JHtlcnI/LmxvYz8uY29sdW1uID8/IDB9YFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6ICcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b2tlbkNvZGUgPSB0b2tlbkNvZGUucmVwbGFjZSgvXFwvXFwqdXVpZC0oW1xcd1xcV10rPylcXCpcXC8vZ21pLCAoc3Vic3RyaW5nOiBzdHJpbmcsIC4uLmFyZ3M6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtYXBUb2tlblthcmdzWzBdXSA/PyAnJztcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW5Db2RlLmluY2x1ZGVzKGRhdGEpID8gJyc6IGRhdGE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2RlOiB0b2tlbkNvZGUsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVwZW5kZW5jaWVzLnB1c2goZ2V0VHlwZXMuU3RhdGljWzBdK3BhdGgucmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzbWFsbFBhdGgpKTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGRlcGVuZGVuY2VPYmplY3RbQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShpKV0gPSBhd2FpdCBFYXN5RnMuc3RhdChpLCAnbXRpbWVNcycpO1xuICAgIH1cblxuICAgIGxldCBmdWxsQ29kZSA9IGNvZGU7XG5cbiAgICBpZihhZGRTdHlsZS5sZW5ndGgpe1xuICAgICAgICBsZXQgc3R5bGVDb2RlID0gYWRkU3R5bGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuXG4gICAgICAgIGNvbnN0IHtjb2RlfSA9IGF3YWl0IHN2ZWx0ZS5wcmVwcm9jZXNzKGZ1bGxDb2RlLCB7XG4gICAgICAgICAgICBzdHlsZSh7IGNvbnRlbnQgfSl7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0ge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBzdHlsZUNvZGUgKyBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXM6IFtdXG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIHN0eWxlQ29kZSA9ICcnO1xuICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bGxDb2RlID0gY29kZTtcblxuICAgICAgICBpZihzdHlsZUNvZGUpXG4gICAgICAgICAgICBmdWxsQ29kZSArPSBgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YDtcbiAgICB9XG5cbiAgICByZXR1cm4ge2NvZGU6IGZ1bGxDb2RlLCBkZXBlbmRlbmNlT2JqZWN0LCBtYXB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGVQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBkZXBlbmRlbmNlT2JqZWN0OiBTdHJpbmdOdW1iZXJNYXAsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuYW1lID0gcGF0aC5wYXJzZShmaWxlUGF0aCkubmFtZVxuICAgICAgICAucmVwbGFjZSgvXlxcZC8sICdfJCYnKVxuICAgICAgICAucmVwbGFjZSgvW15hLXpBLVowLTlfJF0vZywgJycpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgICAgICBuYW1lOiBjYXBpdGFsaXplKG5hbWUpLFxuICAgICAgICBnZW5lcmF0ZTogJ3NzcicsXG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGRldjogaXNEZWJ1ZyxcbiAgICB9O1xuXG4gICAgY29uc3Qgd2FpdEZvckJ1aWxkID0gW107XG4gICAgZnVuY3Rpb24gbWFrZVJlYWwoaW5TdGF0aWM6IHN0cmluZyl7XG4gICAgICAgIHdhaXRGb3JCdWlsZC5wdXNoKHJlZ2lzdGVyRXh0ZW5zaW9uKGdldFR5cGVzLlN0YXRpY1swXSArIGluU3RhdGljLCBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgK2luU3RhdGljLCBkZXBlbmRlbmNlT2JqZWN0LCBpc0RlYnVnKSk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5TdGF0aWNGaWxlID0gcGF0aC5yZWxhdGl2ZShnZXRUeXBlcy5TdGF0aWNbMl0sIHNtYWxsUGF0aCksIGluU3RhdGljQmFzZVBhdGggPSBpblN0YXRpY0ZpbGUgKyAnLy4uJywgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNGaWxlO1xuXG4gICAgY29uc3QgY29udGV4dCA9IGF3YWl0IHByZXByb2Nlc3MoZmlsZVBhdGgsIHNtYWxsUGF0aCwgZGVwZW5kZW5jZU9iamVjdCwgKGltcG9ydFBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBpblN0YXRpYyA9IHBhdGgucmVsYXRpdmUoaW5TdGF0aWNCYXNlUGF0aCwgaW1wb3J0UGF0aCk7XG4gICAgICAgIG1ha2VSZWFsKGluU3RhdGljKTtcblxuICAgICAgICByZXR1cm4gJy4vJyAraW5TdGF0aWMucmVwbGFjZSgvXFxcXC9naSwgJy8nKTtcbiAgICB9LCAnLnNzci5janMnKTtcblxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwod2FpdEZvckJ1aWxkKTtcbiAgICBjb25zdCB7IGpzLCBjc3MsIHdhcm5pbmdzIH0gPSBzdmVsdGUuY29tcGlsZShjb250ZXh0LmNvZGUsIDxhbnk+b3B0aW9ucyk7XG5cbiAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICB3YXJuaW5ncy5mb3JFYWNoKHdhcm5pbmcgPT4ge1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuaW5nLmNvZGUsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIHRleHQ6IHdhcm5pbmcubWVzc2FnZSArICdcXG4nICsgd2FybmluZy5mcmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bGxJbXBvcnRQYXRoID0gZnVsbENvbXBpbGVQYXRoICsgJy5zc3IuY2pzJztcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmKGNzcy5jb2RlKXtcbiAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gJy8nK2luU3RhdGljRmlsZS5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgIGNzcy5jb2RlICs9ICdcXG4vKiMgc291cmNlTWFwcGluZ1VSTD0nICsgY3NzLm1hcC50b1VybCgpICsgJyovJztcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIGZ1bGxJbXBvcnRQYXRoO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG5cbiAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2VPYmplY3QsIG1hcCB9ID0gYXdhaXQgcHJlcHJvY2VzcyhmdWxsUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5wdXRQYXRoKTtcblxuICAgIGNvbnN0IHsganMsIGNzcyB9ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwge1xuICAgICAgICBmaWxlbmFtZTogZnVsbFBhdGgsXG4gICAgICAgIGRldjogaXNEZWJ1ZyxcbiAgICAgICAgc291cmNlbWFwOiBtYXAsXG4gICAgICAgIGNzczogZmFsc2UsXG4gICAgICAgIGh5ZHJhdGFibGU6IHRydWUsXG4gICAgICAgIHN2ZWx0ZVBhdGg6ICcvc2Vydi9zdmVsdGUnXG4gICAgfSk7XG5cbiAgICBpZiAoU29tZVBsdWdpbnMoXCJNaW5KU1wiKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBqcy5jb2RlID0gKGF3YWl0IG1pbmlmeShqcy5jb2RlLCB7IG1vZHVsZTogZmFsc2UgfSkpLmNvZGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWluaWZ5JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0gb24gZmlsZSAtPiAke2Z1bGxQYXRofWBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICBqcy5tYXAuc291cmNlc1swXSA9IGZ1bGxQYXRoLnNwbGl0KC9cXC98XFwvLykucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAganMuY29kZSArPSAnXFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9JyArIGpzLm1hcC50b1VybCgpO1xuXG4gICAgICAgIGlmKGNzcy5jb2RlKXtcbiAgICAgICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9IGpzLm1hcC5zb3VyY2VzWzBdO1xuICAgICAgICAgICAgY3NzLmNvZGUgKz0gJ1xcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPScgKyBjc3MubWFwLnRvVXJsKCkgKyAnKi8nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmpzJywganMuY29kZSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlcGVuZGVuY2VPYmplY3QsXG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59IiwgIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCBjbGVhck1vZHVsZSBmcm9tICdjbGVhci1tb2R1bGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCksIHJlc29sdmUgPSAocGF0aDogc3RyaW5nKSA9PiByZXF1aXJlLnJlc29sdmUocGF0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGZpbGVQYXRoKTtcbiAgICBjbGVhck1vZHVsZShmaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufVxuXG5leHBvcnQge1xuICAgIGNsZWFyTW9kdWxlLFxuICAgIHJlc29sdmVcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55KSB7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJDb2RlKG9yaWdSdWxlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ1JlbmRlcmVkID0gb3JpZ1J1bGUoLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb2RlLWNvcHlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2NvcHktY2xpcGJvYXJkXCIgb25jbGljaz1cIm5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRoaXMucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0KVwiPmNvcHk8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgJHtvcmlnUmVuZGVyZWR9XG4gICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrKTtcbiAgICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuZmVuY2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIGNvbnN0IGhsanNDbGFzcyA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSkpLFxuICAgICAgICBicmVha3M6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSksXG4gICAgICAgIHR5cG9ncmFwaGVyOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3R5cG9ncmFwaGVyJywgbWFya0Rvd25QbHVnaW4/LnR5cG9ncmFwaGVyID8/IHRydWUpKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGVycixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdtYXJrZG93bi1wYXJzZXInXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoY29kZVdpdGhDb3B5KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYWJicicsIG1hcmtEb3duUGx1Z2luPy5hYmJyID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEFiYnIpO1xuXG4gICAgbGV0IG1hcmtkb3duQ29kZSA9IEJldHdlZW5UYWdEYXRhPy5lcTtcbiAgICBpZiAoIW1hcmtkb3duQ29kZSkge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpKSwgZGF0YVRhZy5yZW1vdmUoJ2ZpbGUnKSk7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnJlbW92ZSgnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICBzZXNzaW9uLnN0eWxlKGNzc0xpbmspO1xuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAndGhlbWUnLCBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgaWYgKGRhdGFUYWcubGVuZ3RoKVxuICAgICAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuICAgIGVsc2VcbiAgICAgICAgYnVpbGRIVE1MLkFkZFRleHRBZnRlcihyZW5kZXJIVE1MKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBidWlsZEhUTUwsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cbmNvbnN0IHRoZW1lQXJyYXkgPSBbJycsICctZGFyaycsICctbGlnaHQnXTtcbmNvbnN0IHRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlNYXJrZG93blRoZW1lKCkge1xuICAgIGZvciAoY29uc3QgaSBvZiB0aGVtZUFycmF5KSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSAoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoZW1lUGF0aCArIGkgKyAnLmNzcycpKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXG5cXC5tYXJrZG93bi1ib2R5IHspfCheLm1hcmtkb3duLWJvZHkgeykvZ20sIChtYXRjaDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoICsgJ3BhZGRpbmc6MjBweDsnXG4gICAgICAgICAgICB9KSArIGBcbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206LTMwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OjEwcHg7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTowO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weTpob3Zlcj5kaXYge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IGE6Zm9jdXMge1xuICAgICAgICAgICAgICAgIGNvbG9yOiM2YmI4NmFcbiAgICAgICAgICAgIH1gO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgYnVpbGRTY3JpcHQ6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGhlYWQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBwYXRoLCBMYXN0U21hbGxQYXRoLCBidWlsZFNjcmlwdCwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB0eXBlIHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKExhc3RTbWFsbFBhdGg6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgeyBTb21lUGx1Z2lucyB9LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcuZ2V0VmFsdWUoJ25hbWUnKSxcbiAgICAgICAgc2VuZFRvID0gZGF0YVRhZy5nZXRWYWx1ZSgnc2VuZFRvJyksXG4gICAgICAgIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5nZXRWYWx1ZSgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdub3RWYWxpZCcpO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdtZXNzYWdlJyk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlID09PSBudWxsKVxuICAgICAgICBtZXNzYWdlID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgIVNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwgeyBhc3luYzogbnVsbCB9KVxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGUoJ3NjcmlwdCcsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3BhZ2UnKSA/IExhc3RTbWFsbFBhdGg6IHR5cGUuZXh0cmFjdEluZm8oKSkuYWRkVGV4dCh0ZW1wbGF0ZShuYW1lKSk7IC8vIGFkZCBzY3JpcHRcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiAnY29ubmVjdCcsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGxldCBidWlsZE9iamVjdCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gJ2Nvbm5lY3QnKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgYnVpbGRPYmplY3QgKz0gYCxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTpcIiR7aS5uYW1lfVwiLFxuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlskeyhpLnZhbGlkYXRvciAmJiBpLnZhbGlkYXRvci5tYXAoY29tcGlsZVZhbHVlcykuam9pbignLCcpKSB8fCAnJ31dXG4gICAgICAgIH1gO1xuICAgIH1cblxuICAgIGJ1aWxkT2JqZWN0ID0gYFske2J1aWxkT2JqZWN0LnN1YnN0cmluZygxKX1dYDtcblxuICAgIGNvbnN0IGFkZFNjcmlwdCA9IGBcbiAgICAgICAgaWYoUG9zdD8uY29ubmVjdG9yQ2FsbCl7XG4gICAgICAgICAgICBpZihhd2FpdCBoYW5kZWxDb25uZWN0b3IoXCJjb25uZWN0XCIsIHBhZ2UsICR7YnVpbGRPYmplY3R9KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9YDtcblxuICAgIGlmIChwYWdlRGF0YS5pbmNsdWRlcyhcIkBDb25uZWN0SGVyZVwiKSlcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcigvQENvbm5lY3RIZXJlKDs/KS8sICgpID0+IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGFkZFNjcmlwdCkpO1xuICAgIGVsc2VcbiAgICAgICAgcGFnZURhdGEuQWRkVGV4dEFmdGVyTm9UcmFjayhhZGRTY3JpcHQpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICghdGhpc1BhZ2UuUG9zdD8uY29ubmVjdG9yQ2FsbClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCBoYXZlID0gY29ubmVjdG9yQXJyYXkuZmluZCh4ID0+IHgubmFtZSA9PSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwubmFtZSk7XG5cbiAgICBpZiAoIWhhdmUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JDYWxsLnZhbHVlcztcbiAgICBjb25zdCBpc1ZhbGlkID0gaGF2ZS52YWxpZGF0b3IubGVuZ3RoICYmIGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGhhdmUudmFsaWRhdG9yKTtcblxuICAgIHRoaXNQYWdlLnNldFJlc3BvbnNlKCcnKTtcblxuICAgIGNvbnN0IGJldHRlckpTT04gPSAob2JqOiBhbnkpID0+IHtcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5lbmQoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gICAgfVxuXG4gICAgaWYgKCFoYXZlLnZhbGlkYXRvci5sZW5ndGggfHwgaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLnNlbmRUbyguLi52YWx1ZXMpKTtcblxuICAgIGVsc2UgaWYgKGhhdmUubm90VmFsaWQpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgaGF2ZS5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpKTtcblxuICAgIGVsc2UgaWYgKGhhdmUubWVzc2FnZSlcbiAgICAgICAgYmV0dGVySlNPTih7XG4gICAgICAgICAgICBlcnJvcjogdHlwZW9mIGhhdmUubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGhhdmUubWVzc2FnZSA6ICg8YW55PmlzVmFsaWQpLnNoaWZ0KClcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zdGF0dXMoNDAwKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVZhbHVlcywgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgYnVpbGRTY3JpcHQ6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3Qgc2VuZFRvID0gZGF0YVRhZy5yZW1vdmUoJ3NlbmRUbycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgcGF0aCwgTGFzdFNtYWxsUGF0aCwgYnVpbGRTY3JpcHQsIHNlc3Npb25JbmZvKVxuICAgICAgICAgICAgICAgIH08L2Zvcm0+YCxcbiAgICAgICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICAgICAgfVxuXG5cbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5yZW1vdmUoJ25hbWUnKS50cmltKCkgfHwgdXVpZCgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCd2YWxpZGF0ZScpLCBvcmRlckRlZmF1bHQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdvcmRlcicpLCBub3RWYWxpZDogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcuaGF2ZSgnc2FmZScpO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdtZXNzYWdlJyk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlID09PSBudWxsKVxuICAgICAgICBtZXNzYWdlID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgIUluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKTtcblxuICAgIGxldCBvcmRlciA9IFtdO1xuXG4gICAgY29uc3QgdmFsaWRhdG9yQXJyYXkgPSB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geyAvLyBDaGVja2luZyBpZiB0aGVyZSBpcyBhbiBvcmRlciBpbmZvcm1hdGlvbiwgZm9yIGV4YW1wbGUgXCJwcm9wMTogc3RyaW5nLCBwcm9wMzogbnVtLCBwcm9wMjogYm9vbFwiXG4gICAgICAgIGNvbnN0IHNwbGl0ID0gU3BsaXRGaXJzdCgnOicsIHgudHJpbSgpKTtcblxuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIG9yZGVyLnB1c2goc3BsaXQuc2hpZnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIHNwbGl0LnBvcCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKG9yZGVyRGVmYXVsdClcbiAgICAgICAgb3JkZXIgPSBvcmRlckRlZmF1bHQuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JBcnJheSxcbiAgICAgICAgb3JkZXI6IG9yZGVyLmxlbmd0aCAmJiBvcmRlcixcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlc3BvbnNlU2FmZVxuICAgIH0pO1xuXG4gICAgaWYgKCFkYXRhVGFnLmhhdmUoJ21ldGhvZCcpKSB7XG4gICAgICAgIGRhdGFUYWcucHVzaCh7XG4gICAgICAgICAgICBuOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnbWV0aG9kJyksXG4gICAgICAgICAgICB2OiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAncG9zdCcpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkXG4gICAgICAgIGA8JSFcbkA/Q29ubmVjdEhlcmVGb3JtKCR7c2VuZFRvfSk7XG4lPjxmb3JtJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+XG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY29ubmVjdG9yRm9ybUNhbGxcIiB2YWx1ZT1cIiR7bmFtZX1cIi8+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgcGF0aCwgTGFzdFNtYWxsUGF0aCwgYnVpbGRTY3JpcHQsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9ICdmb3JtJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHNlbmRUb1VuaWNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBpLnNlbmRUbykudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQENvbm5lY3RIZXJlRm9ybVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXCkoOz8pYCksIGNvbm5lY3REZWZhdWx0ID0gbmV3IFJlZ0V4cChgQFxcXFw/Q29ubmVjdEhlcmVGb3JtXFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgY29uc3Qgc2NyaXB0RGF0YSA9IGRhdGEgPT4ge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGFbMF0uU3RhcnRJbmZvKS5QbHVzJFxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JGb3JtQ2FsbCA9PSBcIiR7aS5uYW1lfVwiKXtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgaGFuZGVsQ29ubmVjdG9yKFwiZm9ybVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBbJHtpLm9yZGVyPy5tYXA/LihpdGVtID0+IGBcIiR7aXRlbX1cImApPy5qb2luKCcsJykgPz8gJyd9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoY291bnRlcilcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZShjb25uZWN0RGVmYXVsdCwgJycpOyAvLyBkZWxldGluZyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdERlZmF1bHQsIHNjcmlwdERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckluZm86IGFueSkge1xuXG4gICAgZGVsZXRlIHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yRm9ybUNhbGw7XG5cbiAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby5vcmRlci5sZW5ndGgpIC8vIHB1c2ggdmFsdWVzIGJ5IHNwZWNpZmljIG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjb25uZWN0b3JJbmZvLm9yZGVyKVxuICAgICAgICAgICAgdmFsdWVzLnB1c2godGhpc1BhZ2UuUG9zdFtpXSk7XG4gICAgZWxzZVxuICAgICAgICB2YWx1ZXMucHVzaCguLi5PYmplY3QudmFsdWVzKHRoaXNQYWdlLlBvc3QpKTtcblxuXG4gICAgbGV0IGlzVmFsaWQ6IGJvb2xlYW4gfCBzdHJpbmdbXSA9IHRydWU7XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby52YWxpZGF0b3IubGVuZ3RoKSB7IC8vIHZhbGlkYXRlIHZhbHVlc1xuICAgICAgICB2YWx1ZXMgPSBwYXJzZVZhbHVlcyh2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICAgICAgaXNWYWxpZCA9IGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzcG9uc2U6IGFueTtcblxuICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8uc2VuZFRvKC4uLnZhbHVlcyk7XG4gICAgZWxzZSBpZiAoY29ubmVjdG9ySW5mby5ub3RWYWxpZClcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCk7XG5cbiAgICBpZiAoIWlzVmFsaWQgJiYgIXJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5tZXNzYWdlID09PSB0cnVlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKGNvbm5lY3RvckluZm8ubWVzc2FnZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3BvbnNlID0gY29ubmVjdG9ySW5mby5tZXNzYWdlO1xuXG4gICAgaWYgKHJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5zYWZlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKHJlc3BvbnNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGUocmVzcG9uc2UpO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlY29yZFN0b3JlID0gbmV3IFN0b3JlSlNPTignUmVjb3JkcycpO1xuXG5mdW5jdGlvbiByZWNvcmRMaW5rKGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBkYXRhVGFnLnJlbW92ZSgnbGluaycpfHwgQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZWNvcmRQYXRoKGRlZmF1bHROYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCl7XG4gICAgY29uc3QgbGluayA9IHJlY29yZExpbmsoZGF0YVRhZywgc2Vzc2lvbkluZm8pLCBzYXZlTmFtZSA9IGRhdGFUYWcucmVtb3ZlKCduYW1lJykgfHwgZGVmYXVsdE5hbWU7XG5cbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0gPz89IHt9O1xuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSA/Pz0gJyc7XG4gICAgc2Vzc2lvbkluZm8ucmVjb3JkKHNhdmVOYW1lKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0b3JlOiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0sXG4gICAgICAgIGN1cnJlbnQ6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSxcbiAgICAgICAgbGlua1xuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHBhdGgsIExhc3RTbWFsbFBhdGgsICh4OiBTdHJpbmdUcmFja2VyKSA9PiB4LmVxLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIHBhdGgpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaHRtbCA9IGh0bWwudHJpbSgpO1xuXG4gICAgY29uc3Qge3N0b3JlLCBsaW5rfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3JlY29yZC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYoIXN0b3JlW2xpbmtdLmluY2x1ZGVzKGh0bWwpKXtcbiAgICAgICAgc3RvcmVbbGlua10gKz0gaHRtbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWNvcmRzKHNlc3Npb246IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbi5kZWJ1Zykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzZXNzaW9uLnJlY29yZE5hbWVzKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUocGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyQ29tcGlsZSgpe1xuICAgIHJlY29yZFN0b3JlLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpe1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBjb25zdCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKG5hbWUpO1xuICAgICAgICBpZihkaXJuYW1lKSBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGRpcm5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5pbXBvcnQgeyBtYWtlUmVjb3JkUGF0aH0gZnJvbSAnLi9yZWNvcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBwYXRoLCBMYXN0U21hbGxQYXRoLCAoeDogU3RyaW5nVHJhY2tlcikgPT4geC5lcSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBwYXRoKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHtzdG9yZSwgbGluaywgY3VycmVudH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9zZWFyY2guc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBzZWFyY2hPYmplY3QgPSBidWlsZE9iamVjdChodG1sLCBkYXRhVGFnLnJlbW92ZSgnbWF0Y2gnKSB8fCAnaDFbaWRdLCBoMltpZF0sIGgzW2lkXSwgaDRbaWRdLCBoNVtpZF0sIGg2W2lkXScpO1xuXG4gICAgaWYoIWN1cnJlbnQpe1xuICAgICAgICBzdG9yZVtsaW5rXSA9IHNlYXJjaE9iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuZXdUaXRsZXMgPSBzZWFyY2hPYmplY3QudGl0bGVzLmZpbHRlcih4ID0+IGN1cnJlbnQudGl0bGVzLmZpbmQoaSA9PiBpLmlkICE9IHguaWQpKVxuICAgICAgICBjdXJyZW50LnRpdGxlcy5wdXNoKC4uLm5ld1RpdGxlcyk7XG5cbiAgICAgICAgaWYoIWN1cnJlbnQudGV4dC5pbmNsdWRlcyhzZWFyY2hPYmplY3QudGV4dCkpe1xuICAgICAgICAgICAgY3VycmVudC50ZXh0ICs9IHNlYXJjaE9iamVjdC50ZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZE9iamVjdChodG1sOiBzdHJpbmcsIG1hdGNoOiBzdHJpbmcpIHtcbiAgICBjb25zdCByb290ID0gcGFyc2UoaHRtbCwge1xuICAgICAgICBibG9ja1RleHRFbGVtZW50czoge1xuICAgICAgICAgICAgc2NyaXB0OiBmYWxzZSxcbiAgICAgICAgICAgIHN0eWxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vc2NyaXB0OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aXRsZXM6IHtpZDogc3RyaW5nLCB0ZXh0OnN0cmluZ31bXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChtYXRjaCkpIHtcbiAgICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmF0dHJpYnV0ZXNbJ2lkJ107XG4gICAgICAgIHRpdGxlcy5wdXNoKHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgdGV4dDogZWxlbWVudC5pbm5lclRleHQudHJpbSgpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlcyxcbiAgICAgICAgdGV4dDogcm9vdC5pbm5lclRleHQudHJpbSgpXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL0NvbXBvbmVudHMvY2xpZW50JztcbmltcG9ydCBzY3JpcHQgZnJvbSAnLi9Db21wb25lbnRzL3NjcmlwdC9pbmRleCc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9Db21wb25lbnRzL3N0eWxlL2luZGV4JztcbmltcG9ydCBwYWdlIGZyb20gJy4vQ29tcG9uZW50cy9wYWdlJztcbmltcG9ydCBpc29sYXRlIGZyb20gJy4vQ29tcG9uZW50cy9pc29sYXRlJztcbmltcG9ydCBzdmVsdGUgZnJvbSAnLi9Db21wb25lbnRzL3N2ZWx0ZSc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnLi9Db21wb25lbnRzL21hcmtkb3duJztcbmltcG9ydCBoZWFkLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEhlYWQgfSBmcm9tICcuL0NvbXBvbmVudHMvaGVhZCc7XG5pbXBvcnQgY29ubmVjdCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRDb25uZWN0LCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yQ29ubmVjdCB9IGZyb20gJy4vQ29tcG9uZW50cy9jb25uZWN0JztcbmltcG9ydCBmb3JtLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEZvcm0sIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JGb3JtIH0gZnJvbSAnLi9Db21wb25lbnRzL2Zvcm0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgcmVjb3JkLCB7IHVwZGF0ZVJlY29yZHMsIHBlckNvbXBpbGUgYXMgcGVyQ29tcGlsZVJlY29yZCwgcG9zdENvbXBpbGUgYXMgcG9zdENvbXBpbGVSZWNvcmQgfSBmcm9tICcuL0NvbXBvbmVudHMvcmVjb3JkJztcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9Db21wb25lbnRzL3NlYXJjaCc7XG5cbmV4cG9ydCBjb25zdCBBbGxCdWlsZEluID0gW1wiY2xpZW50XCIsIFwic2NyaXB0XCIsIFwic3R5bGVcIiwgXCJwYWdlXCIsIFwiY29ubmVjdFwiLCBcImlzb2xhdGVcIiwgXCJmb3JtXCIsIFwiaGVhZFwiLCBcInN2ZWx0ZVwiLCBcIm1hcmtkb3duXCIsIFwicmVjb3JkXCIsIFwic2VhcmNoXCJdO1xuXG5leHBvcnQgZnVuY3Rpb24gU3RhcnRDb21waWxpbmcocGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGxldCByZURhdGE6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD47XG5cbiAgICBzd2l0Y2ggKHR5cGUuZXEudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlIFwiY2xpZW50XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjbGllbnQocGF0aCwgcGF0aE5hbWUsIExhc3RTbWFsbFBhdGgsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyZWNvcmRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHJlY29yZChwYXRoLCBwYXRoTmFtZSwgTGFzdFNtYWxsUGF0aCwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNlYXJjaChwYXRoLCBwYXRoTmFtZSwgTGFzdFNtYWxsUGF0aCwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNjcmlwdChwYXRoLCBwYXRoTmFtZSwgTGFzdFNtYWxsUGF0aCwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN0eWxlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdHlsZShwYXRoLCBwYXRoTmFtZSwgTGFzdFNtYWxsUGF0aCwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwYWdlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBwYWdlKHBhdGgsIHBhdGhOYW1lLCBMYXN0U21hbGxQYXRoLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNvbm5lY3QoTGFzdFNtYWxsUGF0aCwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtXCI6XG4gICAgICAgICAgICByZURhdGEgPSBmb3JtKHBhdGgsIHBhdGhOYW1lLCBMYXN0U21hbGxQYXRoLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXNvbGF0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGhlYWQocGF0aCwgcGF0aE5hbWUsIExhc3RTbWFsbFBhdGgsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdmVsdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN2ZWx0ZShwYXRoLCBMYXN0U21hbGxQYXRoLCB0eXBlLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1hcmtkb3duXCI6XG4gICAgICAgICAgICByZURhdGEgPSBtYXJrZG93bih0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wb25lbnQgaXMgbm90IGJ1aWxkIHlldFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNJbmNsdWRlKHRhZ25hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBBbGxCdWlsZEluLmluY2x1ZGVzKHRhZ25hbWUudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZykge1xuICAgIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbkluZm8pO1xuXG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdChwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZEZvcm0ocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoL0BDb25uZWN0SGVyZSg7PykvZ2ksICcnKS5yZXBsYWNlKC9AQ29ubmVjdEhlcmVGb3JtKDs/KS9naSwgJycpO1xuXG4gICAgcGFnZURhdGEgPSBhd2FpdCBhZGRGaW5hbGl6ZUJ1aWxkSGVhZChwYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGZ1bGxDb21waWxlUGF0aCk7XG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yU2VydmljZSh0eXBlOiBzdHJpbmcsIHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICh0eXBlID09ICdjb25uZWN0JylcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckNvbm5lY3QodGhpc1BhZ2UsIGNvbm5lY3RvckFycmF5KTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JGb3JtKHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgTm9UcmFja1N0cmluZ0NvZGUsIENyZWF0ZUZpbGVQYXRoLCBQYXRoVHlwZXMsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEFsbEJ1aWxkSW4sIElzSW5jbHVkZSwgU3RhcnRDb21waWxpbmcgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8sIEFycmF5TWF0Y2ggfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIHRhZ0RhdGFPYmplY3RBc1RleHQsIENvbXBpbGVJbkZpbGVGdW5jLCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIFN0cmluZ0FycmF5T3JPYmplY3QsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IEluc2VydENvbXBvbmVudEJhc2UsIEJhc2VSZWFkZXIgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCBwYXRoTm9kZSBmcm9tICdwYXRoJztcbmltcG9ydCBQYXJzZUJhc2VQYWdlIGZyb20gJy4vQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuXG5pbnRlcmZhY2UgRGVmYXVsdFZhbHVlcyB7XG4gICAgdmFsdWU6IFN0cmluZ1RyYWNrZXIsXG4gICAgZWxlbWVudHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc2VydENvbXBvbmVudCBleHRlbmRzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIHB1YmxpYyBkaXJGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbjtcbiAgICBwdWJsaWMgQ29tcGlsZUluRmlsZTogQ29tcGlsZUluRmlsZUZ1bmM7XG4gICAgcHVibGljIE1pY3JvUGx1Z2luczogU3RyaW5nQXJyYXlPck9iamVjdDtcbiAgICBwdWJsaWMgR2V0UGx1Z2luOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XG4gICAgcHVibGljIFNvbWVQbHVnaW5zOiAoLi4ubmFtZXM6IHN0cmluZ1tdKSA9PiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1RzOiAoKSA9PiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZWdleFNlYXJjaDogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IoUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbikge1xuICAgICAgICBzdXBlcihQcmludElmTmV3KTtcbiAgICAgICAgdGhpcy5kaXJGb2xkZXIgPSAnQ29tcG9uZW50cyc7XG4gICAgICAgIHRoaXMuUGx1Z2luQnVpbGQgPSBQbHVnaW5CdWlsZDtcbiAgICAgICAgdGhpcy5yZWdleFNlYXJjaCA9IG5ldyBSZWdFeHAoYDwoW1xcXFxwe0x1fV9cXFxcLTowLTldfCR7QWxsQnVpbGRJbi5qb2luKCd8Jyl9KWAsICd1JylcbiAgICB9XG5cbiAgICBGaW5kU3BlY2lhbFRhZ0J5U3RhcnQoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuU2tpcFNwZWNpYWxUYWcpIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcuc3Vic3RyaW5nKDAsIGlbMF0ubGVuZ3RoKSA9PSBpWzBdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdCB0YWtlcyBhIHN0cmluZyBvZiBIVE1MIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUsXG4gICAgICogdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUsIGFuZCB0aGUgY2hhcmFjdGVyIHRoYXQgY29tZXMgYWZ0ZXIgdGhlIGF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSB0ZXh0IHRvIHBhcnNlLlxuICAgICAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6XG4gICAgICovXG4gICAgdGFnRGF0YSh0ZXh0OiBTdHJpbmdUcmFja2VyKTogeyBkYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIG1hcEF0dHJpYnV0ZXM6IFN0cmluZ0FueU1hcCB9IHtcbiAgICAgICAgY29uc3QgdG9rZW5BcnJheSA9IFtdLCBhOiB0YWdEYXRhT2JqZWN0QXJyYXkgPSBbXSwgbWFwQXR0cmlidXRlczogU3RyaW5nQW55TWFwID0ge307XG5cbiAgICAgICAgdGV4dCA9IHRleHQudHJpbSgpLnJlcGxhY2VyKC8oPCUpKFtcXHdcXFddKz8pKCU+KS8sIGRhdGEgPT4ge1xuICAgICAgICAgICAgdG9rZW5BcnJheS5wdXNoKGRhdGFbMl0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFbMV0uUGx1cyhkYXRhWzNdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgdW5Ub2tlbiA9ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiB0ZXh0LnJlcGxhY2VyKC8oPCUpKCU+KS8sIChkYXRhKSA9PiBkYXRhWzFdLlBsdXModG9rZW5BcnJheS5zaGlmdCgpKS5QbHVzKGRhdGFbMl0pKVxuXG4gICAgICAgIGxldCBmYXN0VGV4dCA9IHRleHQuZXE7XG4gICAgICAgIGNvbnN0IFNraXBUeXBlcyA9IFsnXCInLCBcIidcIiwgJ2AnXSwgQmxvY2tUeXBlcyA9IFtcbiAgICAgICAgICAgIFsneycsICd9J10sXG4gICAgICAgICAgICBbJygnLCAnKSddXG4gICAgICAgIF07XG5cbiAgICAgICAgd2hpbGUgKGZhc3RUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBmYXN0VGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoYXIgPSBmYXN0VGV4dC5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXIgPT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0Q2hhciA9IHRleHQuYXQoaSArIDEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0Q2hhckVxID0gbmV4dENoYXIuZXEsIGF0dHJOYW1lID0gdGV4dC5zdWJzdHJpbmcoMCwgaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlOiBTdHJpbmdUcmFja2VyLCBlbmRJbmRleDogbnVtYmVyLCBibG9ja0VuZDogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU2tpcFR5cGVzLmluY2x1ZGVzKG5leHRDaGFyRXEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVudE9mUShmYXN0VGV4dC5zdWJzdHJpbmcoaSArIDIpLCBuZXh0Q2hhckVxKSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRleHQuc3Vic3RyKGkgKyAyLCBlbmRJbmRleCAtIDIpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGJsb2NrRW5kID0gQmxvY2tUeXBlcy5maW5kKHggPT4geFswXSA9PSBuZXh0Q2hhckVxKT8uWzFdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVuZE9mRGVmKGZhc3RUZXh0LnN1YnN0cmluZyhpICsgMiksIFtuZXh0Q2hhckVxLCBibG9ja0VuZF0pICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGV4dC5zdWJzdHIoaSArIDEsIGVuZEluZGV4ICsgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gZmFzdFRleHQuc3Vic3RyaW5nKGkgKyAxKS5zZWFyY2goLyB8XFxuLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kSW5kZXggPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBmYXN0VGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRleHQuc3Vic3RyKGkgKyAxLCBlbmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Q2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gdW5Ub2tlbihhdHRyTmFtZSksIHYgPSB1blRva2VuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbWFwQXR0cmlidXRlc1tuLmVxXSA9IHYuZXE7XG4gICAgICAgICAgICAgICAgICAgIGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLFxuICAgICAgICAgICAgICAgICAgICAgICAgdixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXI6IG5leHRDaGFyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpICs9IDEgKyBlbmRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoYXIgPT0gJyAnIHx8IGkgPT0gZmFzdFRleHQubGVuZ3RoIC0gMSAmJiArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHVuVG9rZW4odGV4dC5zdWJzdHJpbmcoMCwgaSkpO1xuICAgICAgICAgICAgICAgICAgICBhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbjogblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbWFwQXR0cmlidXRlc1tuLmVxXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmYXN0VGV4dCA9IGZhc3RUZXh0LnN1YnN0cmluZyhpKS50cmltKCk7XG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoaSkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9tZXRob2RzIHRvIHRoZSBhcnJheVxuICAgICAgICBjb25zdCBpbmRleCA9IChuYW1lOiBzdHJpbmcpID0+IGEuZmluZEluZGV4KHggPT4geC5uLmVxID09IG5hbWUpO1xuICAgICAgICBjb25zdCBnZXRWYWx1ZSA9IChuYW1lOiBzdHJpbmcpID0+IGEuZmluZCh0YWcgPT4gdGFnLm4uZXEgPT0gbmFtZSk/LnY/LmVxID8/ICcnO1xuICAgICAgICBjb25zdCByZW1vdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lSW5kZXggPSBpbmRleChuYW1lKTtcbiAgICAgICAgICAgIGlmIChuYW1lSW5kZXggPT0gLTEpXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgcmV0dXJuIGEuc3BsaWNlKG5hbWVJbmRleCwgMSkucG9wKCkudj8uZXEgPz8gJyc7XG4gICAgICAgIH07XG5cbiAgICAgICAgYS5oYXZlID0gKG5hbWU6IHN0cmluZykgPT4gaW5kZXgobmFtZSkgIT0gLTE7XG4gICAgICAgIGEuZ2V0VmFsdWUgPSBnZXRWYWx1ZTtcbiAgICAgICAgYS5yZW1vdmUgPSByZW1vdmU7XG4gICAgICAgIGEuYWRkQ2xhc3MgPSBjID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBpbmRleCgnY2xhc3MnKTtcbiAgICAgICAgICAgIGlmIChpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKHsgbjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ2NsYXNzJyksIHY6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGMpLCBjaGFyOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnXCInKSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYVtpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLnYubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGMgPSAnICcgKyBjO1xuICAgICAgICAgICAgaXRlbS52LkFkZFRleHRBZnRlcihjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkYXRhOiBhLCBtYXBBdHRyaWJ1dGVzIH07XG4gICAgfVxuXG4gICAgZmluZEluZGV4U2VhcmNoVGFnKHF1ZXJ5OiBzdHJpbmcsIHRhZzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBhbGwgPSBxdWVyeS5zcGxpdCgnLicpO1xuICAgICAgICBsZXQgY291bnRlciA9IDBcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0YWcuaW5kZXhPZihpKVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGBXYXJpbmcsIGNhbid0IGZpbmQgYWxsIHF1ZXJ5IGluIHRhZyAtPiAke3RhZy5lcX1cXG4ke3RhZy5saW5lSW5mb31gLFxuICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwicXVlcnktbm90LWZvdW5kXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlciArPSBpbmRleCArIGkubGVuZ3RoXG4gICAgICAgICAgICB0YWcgPSB0YWcuc3Vic3RyaW5nKGluZGV4ICsgaS5sZW5ndGgpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnRlciArIHRhZy5zZWFyY2goL1xcIHxcXD4vKVxuICAgIH1cblxuICAgIFJlQnVpbGRUYWdEYXRhKHN0cmluZ0luZm86IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgZGF0YVRhZ1NwbGl0dGVyOiB0YWdEYXRhT2JqZWN0QXJyYXkpIHtcbiAgICAgICAgbGV0IG5ld0F0dHJpYnV0ZXMgPSBuZXcgU3RyaW5nVHJhY2tlcihzdHJpbmdJbmZvKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YVRhZ1NwbGl0dGVyKSB7XG4gICAgICAgICAgICBpZiAoaS52KSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzJGAke2kubn09JHtpLmNoYXJ9JHtpLnZ9JHtpLmNoYXJ9IGA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMuUGx1cyhpLm4sICcgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YVRhZ1NwbGl0dGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3QXR0cmlidXRlcyA9IG5ldyBTdHJpbmdUcmFja2VyKHN0cmluZ0luZm8sICcgJykuUGx1cyhuZXdBdHRyaWJ1dGVzLnN1YnN0cmluZygwLCBuZXdBdHRyaWJ1dGVzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdBdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIENoZWNrTWluSFRNTChjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGlmICh0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgY29kZSA9IGNvZGUuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9XG5cbiAgICBhc3luYyBSZUJ1aWxkVGFnKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWdTcGxpY2VkOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSAmJiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gdGhpcy5SZUJ1aWxkVGFnRGF0YSh0eXBlLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZ1NwbGljZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGFUYWcuZXEubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhVGFnID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQsICcgJykuUGx1cyhkYXRhVGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhZ0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyhcbiAgICAgICAgICAgICc8JywgdHlwZSwgZGF0YVRhZ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhKSB7XG4gICAgICAgICAgICB0YWdEYXRhLlBsdXMkYD4ke2F3YWl0IFNlbmREYXRhRnVuYyhCZXR3ZWVuVGFnRGF0YSl9PC8ke3R5cGV9PmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWdEYXRhLlBsdXMoJy8+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFnRGF0YTtcbiAgICB9XG5cbiAgICBleHBvcnREZWZhdWx0VmFsdWVzKGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCBmb3VuZFNldHRlcnM6IERlZmF1bHRWYWx1ZXNbXSA9IFtdKSB7XG4gICAgICAgIGNvbnN0IGluZGV4QmFzaWM6IEFycmF5TWF0Y2ggPSBmaWxlRGF0YS5tYXRjaCgvQGRlZmF1bHRbIF0qXFwoKFtBLVphLXowLTl7fSgpXFxbXFxdX1xcLSRcIidgJSomfFxcL1xcQCBcXG5dKilcXClbIF0qXFxbKFtBLVphLXowLTlfXFwtLCQgXFxuXSspXFxdLyk7XG5cbiAgICAgICAgaWYgKGluZGV4QmFzaWMgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB7IGZpbGVEYXRhLCBmb3VuZFNldHRlcnMgfTtcblxuICAgICAgICBjb25zdCBXaXRob3V0QmFzaWMgPSBmaWxlRGF0YS5zdWJzdHJpbmcoMCwgaW5kZXhCYXNpYy5pbmRleCkuUGx1cyhmaWxlRGF0YS5zdWJzdHJpbmcoaW5kZXhCYXNpYy5pbmRleCArIGluZGV4QmFzaWNbMF0ubGVuZ3RoKSk7XG5cbiAgICAgICAgY29uc3QgYXJyYXlWYWx1ZXMgPSBpbmRleEJhc2ljWzJdLmVxLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgICAgIGZvdW5kU2V0dGVycy5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBpbmRleEJhc2ljWzFdLFxuICAgICAgICAgICAgZWxlbWVudHM6IGFycmF5VmFsdWVzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmV4cG9ydERlZmF1bHRWYWx1ZXMoV2l0aG91dEJhc2ljLCBmb3VuZFNldHRlcnMpO1xuICAgIH1cblxuICAgIGFkZERlZmF1bHRWYWx1ZXMoYXJyYXlWYWx1ZXM6IERlZmF1bHRWYWx1ZXNbXSwgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5VmFsdWVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJlIG9mIGkuZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2VBbGwoJyMnICsgYmUsIGkudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHBhcnNlQ29tcG9uZW50UHJvcHModGFnRGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBjb21wb25lbnQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9ID0gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKGNvbXBvbmVudCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRhZ0RhdGEpIHtcbiAgICAgICAgICAgIGlmIChpLm4uZXEgPT0gJyYnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlID0gaS5uLnN1YnN0cmluZygxKTtcblxuICAgICAgICAgICAgICAgIGxldCBGb3VuZEluZGV4OiBudW1iZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAocmUuaW5jbHVkZXMoJyYnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHJlLmluZGV4T2YoJyYnKTtcbiAgICAgICAgICAgICAgICAgICAgRm91bmRJbmRleCA9IHRoaXMuZmluZEluZGV4U2VhcmNoVGFnKHJlLnN1YnN0cmluZygwLCBpbmRleCkuZXEsIGZpbGVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmUgPSByZS5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBGb3VuZEluZGV4ID0gZmlsZURhdGEuc2VhcmNoKC9cXCB8XFw+LylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlRGF0YU5leHQgPSBuZXcgU3RyaW5nVHJhY2tlcihmaWxlRGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnREYXRhID0gZmlsZURhdGEuc3Vic3RyaW5nKDAsIEZvdW5kSW5kZXgpO1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhTmV4dC5QbHVzKFxuICAgICAgICAgICAgICAgICAgICBzdGFydERhdGEsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTdHJpbmdUcmFja2VyKGZpbGVEYXRhLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgICR7cmV9PVwiJHtpLnYgPz8gJyd9XCJgLFxuICAgICAgICAgICAgICAgICAgICAoc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgPyAnJyA6ICcgJyksXG4gICAgICAgICAgICAgICAgICAgIGZpbGVEYXRhLnN1YnN0cmluZyhGb3VuZEluZGV4KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhTmV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKFwiXFxcXH5cIiArIGkubi5lcSwgXCJnaVwiKTtcbiAgICAgICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UocmUsIGkudiA/PyBpLm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkRGVmYXVsdFZhbHVlcyhmb3VuZFNldHRlcnMsIGZpbGVEYXRhKTtcbiAgICB9XG5cbiAgICBhc3luYyBidWlsZFRhZ0Jhc2ljKGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCB0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgRnVsbFBhdGg6IHN0cmluZywgU21hbGxQYXRoOiBzdHJpbmcsIGJ1aWxkU2NyaXB0OiBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuUGx1Z2luQnVpbGQuQnVpbGRDb21wb25lbnQoZmlsZURhdGEsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSB0aGlzLnBhcnNlQ29tcG9uZW50UHJvcHModGFnRGF0YSwgZmlsZURhdGEpO1xuXG4gICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZSgvPFxcOnJlYWRlciggKSpcXC8+L2dpLCBCZXR3ZWVuVGFnRGF0YSA/PyAnJyk7XG5cbiAgICAgICAgcGF0aE5hbWUgPSBwYXRoTmFtZSArICcgLT4gJyArIFNtYWxsUGF0aDtcblxuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuU3RhcnRSZXBsYWNlKGZpbGVEYXRhLCBwYXRoTmFtZSwgRnVsbFBhdGgsIFNtYWxsUGF0aCwgYnVpbGRTY3JpcHQsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IE5vVHJhY2tTdHJpbmdDb2RlKGZpbGVEYXRhLCBgJHtwYXRoTmFtZX0gLT5cXG4ke1NtYWxsUGF0aH1gLCBzZXNzaW9uSW5mby5kZWJ1ZywgYnVpbGRTY3JpcHQpO1xuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBhc3luYyBpbnNlcnRUYWdEYXRhKHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBidWlsZFNjcmlwdCwgc2Vzc2lvbkluZm8gfTogeyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXIsIGJ1aWxkU2NyaXB0OiBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGV9KSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YSwgbWFwQXR0cmlidXRlcyB9ID0gdGhpcy50YWdEYXRhKGRhdGFUYWcpLCBCdWlsZEluID0gSXNJbmNsdWRlKHR5cGUuZXEpO1xuXG4gICAgICAgIGxldCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgU2VhcmNoSW5Db21tZW50ID0gdHJ1ZSwgQWxsUGF0aFR5cGVzOiBQYXRoVHlwZXMgPSB7fSwgYWRkU3RyaW5nSW5mbzogc3RyaW5nO1xuXG4gICAgICAgIGlmIChCdWlsZEluKSB7Ly9jaGVjayBpZiBpdCBidWlsZCBpbiBjb21wb25lbnRcbiAgICAgICAgICAgIGNvbnN0IHsgY29tcGlsZWRTdHJpbmcsIGNoZWNrQ29tcG9uZW50cyB9ID0gYXdhaXQgU3RhcnRDb21waWxpbmcocGF0aCwgcGF0aE5hbWUsIExhc3RTbWFsbFBhdGgsIHR5cGUsIGRhdGEsIEJldHdlZW5UYWdEYXRhID8/IG5ldyBTdHJpbmdUcmFja2VyKCksIHRoaXMsIGJ1aWxkU2NyaXB0LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGEuaGF2ZSgnZm9sZGVyJyk7XG5cbiAgICAgICAgICAgIGlmIChmb2xkZXIpXG4gICAgICAgICAgICAgICAgZm9sZGVyID0gZGF0YS5yZW1vdmUoJ2ZvbGRlcicpIHx8ICcuJztcblxuICAgICAgICAgICAgY29uc3QgdGFnUGF0aCA9IChmb2xkZXIgPyBmb2xkZXIgKyAnLycgOiAnJykgKyB0eXBlLnJlcGxhY2UoLzovZ2ksIFwiL1wiKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCA9IHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpLCByZWxhdGl2ZXNGaWxlUGF0aCA9IHBhdGhOb2RlLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwpO1xuICAgICAgICAgICAgQWxsUGF0aFR5cGVzID0gQ3JlYXRlRmlsZVBhdGgocmVsYXRpdmVzRmlsZVBhdGgsIHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwsIHRhZ1BhdGgsIHRoaXMuZGlyRm9sZGVyLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnQpO1xuXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPT09IG51bGwgfHwgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPT09IHVuZGVmaW5lZCAmJiAhYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoQWxsUGF0aFR5cGVzLkZ1bGxQYXRoKSkge1xuICAgICAgICAgICAgICAgIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChmb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlJlQnVpbGRUYWcodHlwZSwgZGF0YVRhZywgZGF0YSwgQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhID0+IHRoaXMuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgcGF0aCwgTGFzdFNtYWxsUGF0aCwgYnVpbGRTY3JpcHQsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2UoYWxsRGF0YSwgdGhpcy5pc1RzKCkpO1xuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKHNlc3Npb25JbmZvLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHBhdGhOYW1lICsgJyAtPiAnICsgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgbWFwQXR0cmlidXRlcyk7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYmFzZURhdGEuc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLmNsZWFyRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvID0gc3RyaW5nSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChTZWFyY2hJbkNvbW1lbnQgJiYgKGZpbGVEYXRhLmxlbmd0aCA+IDAgfHwgQmV0d2VlblRhZ0RhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IEFsbFBhdGhUeXBlcztcblxuICAgICAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLmJ1aWxkVGFnQmFzaWMoZmlsZURhdGEsIGRhdGEsIHBhdGgsIHBhdGhOYW1lLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgYnVpbGRTY3JpcHQsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICAgICAgICAgIGlmIChhZGRTdHJpbmdJbmZvKVxuICAgICAgICAgICAgICAgIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIGJ1aWxkU2NyaXB0OiBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQgKyAxLCBmaW5kRW5kT2ZTbWFsbFRhZyk7XG5cbiAgICAgICAgICAgIGNvbnN0IE5leHRUZXh0VGFnID0gc3RhcnRGcm9tLnN1YnN0cmluZyhmaW5kRW5kT2ZTbWFsbFRhZyArIDEpO1xuXG4gICAgICAgICAgICBpZiAoaW5UYWcuYXQoaW5UYWcubGVuZ3RoIC0gMSkuZXEgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgaW5UYWcgPSBpblRhZy5zdWJzdHJpbmcoMCwgaW5UYWcubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGFydEZyb20uYXQoZmluZEVuZE9mU21hbGxUYWcgLSAxKS5lcSA9PSAnLycpIHsvL3NtYWxsIHRhZ1xuICAgICAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydFRhZ0RhdGEocGF0aCwgcGF0aE5hbWUsIHNtYWxsUGF0aCwgdGFnVHlwZSwgaW5UYWcsIHsgIGJ1aWxkU2NyaXB0LCBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gTmV4dFRleHRUYWc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYmlnIHRhZyB3aXRoIHJlYWRlclxuICAgICAgICAgICAgbGV0IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU2ltcGxlU2tpcC5pbmNsdWRlcyh0YWdUeXBlLmVxKSkge1xuICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IE5leHRUZXh0VGFnLmluZGV4T2YoJzwvJyArIHRhZ1R5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBhd2FpdCB0aGlzLkZpbmRDbG9zZUNoYXJIVE1MKE5leHRUZXh0VGFnLCB0YWdUeXBlLmVxKTtcbiAgICAgICAgICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYFxcbldhcm5pbmcsIHlvdSBkaWRuJ3Qgd3JpdGUgcmlnaHQgdGhpcyB0YWc6IFwiJHt0YWdUeXBlfVwiLCB1c2VkIGluOiAke3RhZ1R5cGUuYXQoMCkubGluZUluZm99XFxuKHRoZSBzeXN0ZW0gd2lsbCBhdXRvIGNsb3NlIGl0KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoLCBwYXRoTmFtZSwgc21hbGxQYXRoLCB0YWdUeXBlLCBpblRhZywgeyBCZXR3ZWVuVGFnRGF0YSwgYnVpbGRTY3JpcHQsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBidWlsZFNjcmlwdDogQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGJ1aWxkU2NyaXB0LCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHJlYWRlciwgcmVwbGFjaW5nIGhpbSB3aXRoICdjb2RlYmFzZSdcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPFxcOnJlYWRlcisoICkqXFwvPi9naSwgJzwldHlwZW9mIHBhZ2UuY29kZWJhc2UgPT0gXCJmdW5jdGlvblwiID8gcGFnZS5jb2RlYmFzZSgpOiB3cml0ZShwYWdlLmNvZGViYXNlKSU+JykgLy8gcmVwbGFjZSBmb3IgaW1wb3J0aW5nIHBhZ2VzIC8gY29tcG9uZW50c1xuICAgICAgICByZXR1cm4gdGhpcy5SZW1vdmVVbm5lY2Vzc2FyeVNwYWNlKGRhdGEpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5mdW5jdGlvbiB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgIGxldCBhID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnN1YnN0cigtNCk7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXRNYWluKGRhdGE6IFN0cmluZ1RyYWNrZXIsIGFycmF5OnN0cmluZ1tdLCBzaW5nOnN0cmluZywgYmlnVGFnPzpib29sZWFuLCBzZWFyY2hGb3I/OmJvb2xlYW4pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGxldCBvdXQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZSBvZiBhcnJheSkge1xuICAgICAgICBvdXQgKz0gdW5pY29kZU1lKHNpbmcpICsgZSArIFwifFwiO1xuICAgIH1cbiAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKDAsIG91dC5sZW5ndGggLSAxKTtcbiAgICBvdXQgPSBgPCgke291dH0pJHtzZWFyY2hGb3IgPyBcIihbXFxcXHB7TH0wLTlfXFxcXC1cXFxcLl0rKVwiOiBcIlwifShcXFxcdTAwMjApKlxcXFx1MDAyRj8+YFxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgbmV3IFJlZ0V4cChvdXQsICd1JyksIHNpbmcsIGJpZ1RhZylcbn1cblxuZnVuY3Rpb24gb3V0VGFnTmFtZShkYXRhOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbmQgPSBkYXRhLmluZGV4T2YoXCI+XCIpO1xuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBlbmQpO1xuICAgIHdoaWxlIChkYXRhLmVuZHNXaXRoKFwiIFwiKSB8fCBkYXRhLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZGF0YS5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXREYXRhIHtcbiAgICB0YWc6IHN0cmluZyxcbiAgICBkYXRhOiBTdHJpbmdUcmFja2VyLFxuICAgIGxvYzogbnVtYmVyLFxufVxuXG5pbnRlcmZhY2UgU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBkYXRhPzogU3RyaW5nVHJhY2tlcixcbiAgICBlcnJvcj86IGJvb2xlYW4sXG4gICAgZm91bmQ/OiBTZWFyY2hDdXREYXRhW11cbn1cblxuLyoqXG4gKiBJdCBzZWFyY2hlcyBmb3IgYSBzcGVjaWZpYyB0YWcgYW5kIHJldHVybnMgdGhlIGRhdGEgaW5zaWRlIG9mIGl0LlxuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSBkYXRhIC0gVGhlIHN0cmluZyB5b3Ugd2FudCB0byBzZWFyY2ggdGhyb3VnaC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBmaW5kQXJyYXkgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2luZyAtIFRoZSBzdHJpbmcgdGhhdCB5b3Ugd2FudCB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIFtiaWdUYWc9dHJ1ZV0gLSBJZiB0cnVlLCB0aGUgZnVuY3Rpb24gd2lsbCBzZWFyY2ggZm9yIHRoZSBlbmQgb2YgdGhlIHRhZy4gSWYgZmFsc2UsIGl0IHdpbGxcbiAqIHNlYXJjaCBmb3IgdGhlIG5leHQgaW5zdGFuY2Ugb2YgdGhlIHRhZy5cbiAqIEBwYXJhbSBvdXRwdXQgLSBUaGUgb3V0cHV0IG9mIHRoZSBzZWFyY2guXG4gKiBAcGFyYW0ge1NlYXJjaEN1dERhdGFbXX0gcmV0dXJuQXJyYXkgLSBBbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgdGFnIG5hbWUsIHRoZSBkYXRhXG4gKiBpbnNpZGUgdGhlIHRhZywgYW5kIHRoZSBsb2NhdGlvbiBvZiB0aGUgdGFnIGluIHRoZSBvcmlnaW5hbCBzdHJpbmcuXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvZiB0aGUgZGF0YSB0aGF0IHdhcyBmb3VuZCwgYW5kIGFuIGFycmF5IG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLlxuICovXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXQoZGF0YTpTdHJpbmdUcmFja2VyLCBmaW5kQXJyYXk6UmVnRXhwLCBzaW5nOnN0cmluZywgYmlnVGFnID0gdHJ1ZSwgb3V0cHV0ID0gbmV3IFN0cmluZ1RyYWNrZXIoKSwgcmV0dXJuQXJyYXk6IFNlYXJjaEN1dERhdGFbXSA9IFtdKTogU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBjb25zdCBkYXRhQ29weSA9IGRhdGE7XG4gICAgY29uc3QgYmUgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgIGlmIChiZSA9PSAtMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogb3V0cHV0LlBsdXMoZGF0YSksIGZvdW5kOiByZXR1cm5BcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG91dHB1dC5QbHVzKGRhdGEuc3Vic3RyaW5nKDAsIGJlKSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoYmUgKyAxKTtcblxuICAgIGNvbnN0IHRhZyA9IG91dFRhZ05hbWUoZGF0YS5lcSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZFN0YXJ0KFwiPlwiLCBkYXRhKSk7XG5cbiAgICBsZXQgaW5UYWdEYXRhO1xuXG4gICAgaWYgKGJpZ1RhZykge1xuICAgICAgICBjb25zdCBlbmQgPSBmaW5kRW5kKFtcIjxcIiArIHRhZywgXCI8L1wiICsgdGFnXSwgZGF0YSk7XG4gICAgICAgIGlmIChlbmQgIT0gLTEpIHtcbiAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmROZXh0ID0gZGF0YS5zZWFyY2goZmluZEFycmF5KTtcbiAgICAgICAgICAgIGlmIChmaW5kTmV4dCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kTmV4dCk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmROZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybkFycmF5LnB1c2goe1xuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgZGF0YTogaW5UYWdEYXRhLFxuICAgICAgICBsb2M6IGJlXG4gICAgfSk7XG5cbiAgICBpZiAoZGF0YUNvcHkgPT0gZGF0YSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgZmluZEFycmF5LCBzaW5nLCBiaWdUYWcsIG91dHB1dCwgcmV0dXJuQXJyYXkpO1xufVxuXG5mdW5jdGlvbiBmaW5kU3RhcnQodHlwZTpzdHJpbmcsIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuICAgIHJldHVybiBkYXRhLmluZGV4T2YodHlwZSkgKyB0eXBlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gZmluZEVuZCh0eXBlczogc3RyaW5nW10sIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuXG4gICAgbGV0IF8wID0gZGF0YS5pbmRleE9mKHR5cGVzWzBdKTtcblxuICAgIGNvbnN0IF8xID0gZGF0YS5pbmRleE9mKHR5cGVzWzFdKTtcblxuICAgIGlmIChfMSA9PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKF8wIDwgXzEgJiYgXzAgIT0gLTEpIHtcbiAgICAgICAgXzArKztcbiAgICAgICAgY29uc3QgbmV4dCA9IF8wICsgZmluZEVuZCh0eXBlcywgZGF0YS5zdWJzdHJpbmcoXzApKSArIHR5cGVzWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG5leHQgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhuZXh0KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXzE7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7XG4gICAgc2VhcmNoRm9yQ3V0TWFpbiBhcyBnZXREYXRhVGFnZXNcbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2VSZWFkZXIgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBnZXREYXRhVGFnZXMgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IENSdW5UaW1lIGZyb20gXCIuL0NvbXBpbGVcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5cbmV4cG9ydCBjb25zdCBzZXR0aW5ncyA9IHtkZWZpbmU6IHt9fTtcblxuY29uc3Qgc3RyaW5nQXR0cmlidXRlcyA9IFsnXFwnJywgJ1wiJywgJ2AnXTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlQmFzZVBhZ2Uge1xuICAgIHB1YmxpYyBjbGVhckRhdGE6IFN0cmluZ1RyYWNrZXJcbiAgICBwdWJsaWMgc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBwdWJsaWMgdmFsdWVBcnJheTogeyBrZXk6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIgfVtdID0gW11cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCBzZXNzaW9uSW5mbywgc21hbGxQYXRoLCB0aGlzLmlzVHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSBhd2FpdCBydW4uY29tcGlsZShhdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLnBhcnNlQmFzZSh0aGlzLmNvZGUpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRDb2RlRmlsZShwYWdlUGF0aCwgc21hbGxQYXRoLCB0aGlzLmlzVHMsIHNlc3Npb25JbmZvLCBwYWdlTmFtZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvYWREZWZpbmUoey4uLnNldHRpbmdzLmRlZmluZSwgLi4ucnVuLmRlZmluZX0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgbGV0IGRhdGFTcGxpdDogU3RyaW5nVHJhY2tlcjtcblxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlcigvQFxcW1sgXSooKFtBLVphLXpfXVtBLVphLXpfMC05XSo9KChcIlteXCJdKlwiKXwoYFteYF0qYCl8KCdbXiddKicpfFtBLVphLXowLTlfXSspKFsgXSosP1sgXSopPykqKVxcXS8sIGRhdGEgPT4ge1xuICAgICAgICAgICAgZGF0YVNwbGl0ID0gZGF0YVsxXS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGRhdGFTcGxpdD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBmaW5kV29yZCA9IGRhdGFTcGxpdC5pbmRleE9mKCc9Jyk7XG5cbiAgICAgICAgICAgIGxldCB0aGlzV29yZCA9IGRhdGFTcGxpdC5zdWJzdHJpbmcoMCwgZmluZFdvcmQpLnRyaW0oKS5lcTtcblxuICAgICAgICAgICAgaWYgKHRoaXNXb3JkWzBdID09ICcsJylcbiAgICAgICAgICAgICAgICB0aGlzV29yZCA9IHRoaXNXb3JkLnN1YnN0cmluZygxKS50cmltKCk7XG5cbiAgICAgICAgICAgIGxldCBuZXh0VmFsdWUgPSBkYXRhU3BsaXQuc3Vic3RyaW5nKGZpbmRXb3JkICsgMSk7XG5cbiAgICAgICAgICAgIGxldCB0aGlzVmFsdWU6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQ2hhciA9IG5leHRWYWx1ZS5hdCgwKS5lcTtcbiAgICAgICAgICAgIGlmIChzdHJpbmdBdHRyaWJ1dGVzLmluY2x1ZGVzKGNsb3NlQ2hhcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVudE9mUShuZXh0VmFsdWUuZXEuc3Vic3RyaW5nKDEpLCBjbG9zZUNoYXIpO1xuICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoMSwgZW5kSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZyhlbmRJbmRleCArIDEpLnRyaW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBuZXh0VmFsdWUuc2VhcmNoKC9bXyAsXS8pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKGVuZEluZGV4KS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhU3BsaXQgPSBuZXh0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogdGhpc1dvcmQsIHZhbHVlOiB0aGlzVmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZighdGhpcy52YWx1ZUFycmF5Lmxlbmd0aCkgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ0BbJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGtleSwgdmFsdWUgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMkYCR7a2V5fT1cIiR7dmFsdWUucmVwbGFjZUFsbCgnXCInLCAnXFxcXFwiJyl9XCJgO1xuICAgICAgICB9XG4gICAgICAgIGJ1aWxkLlBsdXMoXCJdXCIpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBwYXJzZS5wb3AobmFtZSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMoYDxAJHtuYW1lfT48OiR7bmFtZX0vPjwvQCR7bmFtZX0+YClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICByZXR1cm4gcGFyc2UuY2xlYXJEYXRhLlBsdXMoYnVpbGQpO1xuICAgIH1cblxuXG4gICAgcG9wKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZSh0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkgPT09IG5hbWUpLCAxKVswXT8udmFsdWU7XG4gICAgfVxuXG4gICAgcG9wQW55KG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoYXZlTmFtZSA9IHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleS50b0xvd2VyQ2FzZSgpID09IG5hbWUpO1xuXG4gICAgICAgIGlmIChoYXZlTmFtZSAhPSAtMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKGhhdmVOYW1lLCAxKVswXS52YWx1ZTtcblxuICAgICAgICBjb25zdCBhc1RhZyA9IGdldERhdGFUYWdlcyh0aGlzLmNsZWFyRGF0YSwgW25hbWVdLCAnQCcpO1xuXG4gICAgICAgIGlmICghYXNUYWcuZm91bmRbMF0pIHJldHVybjtcblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGFzVGFnLmRhdGE7XG5cbiAgICAgICAgcmV0dXJuIGFzVGFnLmZvdW5kWzBdLmRhdGEudHJpbSgpO1xuICAgIH1cblxuICAgIGJ5VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbHRlcih4ID0+IHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5wb3BBbnkoJ2NvZGVmaWxlJyk/LmVxO1xuICAgICAgICBpZiAoIWhhdmVDb2RlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbGFuZyA9IHRoaXMucG9wQW55KCdsYW5nJyk/LmVxO1xuICAgICAgICBpZiAoaGF2ZUNvZGUudG9Mb3dlckNhc2UoKSA9PSAnaW5oZXJpdCcpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhZ2VQYXRoO1xuXG4gICAgICAgIGNvbnN0IGhhdmVFeHQgPSBwYXRoLmV4dG5hbWUoaGF2ZUNvZGUpLnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIVsnanMnLCAndHMnXS5pbmNsdWRlcyhoYXZlRXh0KSkge1xuICAgICAgICAgICAgaWYgKC8oXFxcXHxcXC8pJC8udGVzdChoYXZlQ29kZSkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGFnZVBhdGguc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKGhhdmVFeHQpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhdGguZXh0bmFtZShwYWdlUGF0aCk7XG4gICAgICAgICAgICBoYXZlQ29kZSArPSAnLicgKyAobGFuZyA/IGxhbmcgOiBpc1RzID8gJ3RzJyA6ICdqcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhdmVDb2RlWzBdID09ICcuJylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWdlUGF0aCksIGhhdmVDb2RlKVxuXG4gICAgICAgIGNvbnN0IFNtYWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoaGF2ZUNvZGUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLGhhdmVDb2RlKSkge1xuICAgICAgICAgICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIGJhc2VNb2RlbERhdGEuYWxsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjaygnPCUnKTtcbiAgICAgICAgICAgIGJhc2VNb2RlbERhdGEuYWxsRGF0YS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCclPicpO1xuXG4gICAgICAgICAgICBiYXNlTW9kZWxEYXRhLmFsbERhdGEuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gYmFzZU1vZGVsRGF0YS5hbGxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgaWQ6IFNtYWxsUGF0aCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvZGVGaWxlTm90Rm91bmQnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgbm90IGZvdW5kOiAke3BhZ2VQYXRofTxsaW5lPiR7U21hbGxQYXRofWBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgYDwlPVwiPHAgc3R5bGU9XFxcXFwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcXFxcXCI+Q29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nPC9wPlwiJT5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNldHRpbmcobmFtZSA9ICdkZWZpbmUnLCBsaW1pdEFyZ3VtZW50cyA9IDIpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMuY2xlYXJEYXRhLmluZGV4T2YoYEAke25hbWV9KGApO1xuICAgICAgICBpZiAoaGF2ZSA9PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGFyZ3VtZW50QXJyYXk6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuY2xlYXJEYXRhLnN1YnN0cmluZygwLCBoYXZlKTtcbiAgICAgICAgbGV0IHdvcmtEYXRhID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKGhhdmUgKyA4KS50cmltU3RhcnQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbWl0QXJndW1lbnRzOyBpKyspIHsgLy8gYXJndW1lbnRzIHJlYWRlciBsb29wXG4gICAgICAgICAgICBjb25zdCBxdW90YXRpb25TaWduID0gd29ya0RhdGEuYXQoMCkuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZFF1b3RlID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKHdvcmtEYXRhLmVxLnN1YnN0cmluZygxKSwgcXVvdGF0aW9uU2lnbik7XG5cbiAgICAgICAgICAgIGFyZ3VtZW50QXJyYXkucHVzaCh3b3JrRGF0YS5zdWJzdHJpbmcoMSwgZW5kUXVvdGUpKTtcblxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJBcmd1bWVudCA9IHdvcmtEYXRhLnN1YnN0cmluZyhlbmRRdW90ZSArIDEpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgaWYgKGFmdGVyQXJndW1lbnQuYXQoMCkuZXEgIT0gJywnKSB7XG4gICAgICAgICAgICAgICAgd29ya0RhdGEgPSBhZnRlckFyZ3VtZW50O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQuc3Vic3RyaW5nKDEpLnRyaW1TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya0RhdGEgPSB3b3JrRGF0YS5zdWJzdHJpbmcod29ya0RhdGEuaW5kZXhPZignKScpICsgMSk7XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYmVmb3JlLnRyaW1FbmQoKS5QbHVzKHdvcmtEYXRhLnRyaW1TdGFydCgpKTtcblxuICAgICAgICByZXR1cm4gYXJndW1lbnRBcnJheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWREZWZpbmUobW9yZURlZmluZTogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzOiAoU3RyaW5nVHJhY2tlcnxzdHJpbmcpW11bXSA9IE9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpO1xuICAgICAgICB3aGlsZSAobGFzdFZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZXMudW5zaGlmdChsYXN0VmFsdWUpO1xuICAgICAgICAgICAgbGFzdFZhbHVlID0gdGhpcy5sb2FkU2V0dGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YS5yZXBsYWNlQWxsKGA6JHtuYW1lfTpgLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZVwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBjb21waWxlSW1wb3J0IH0gZnJvbSBcIi4uLy4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBDb252ZXJ0U3ludGF4TWluaSB9IGZyb20gXCIuLi8uLi9QbHVnaW5zL1N5bnRheC9SYXpvclN5bnRheFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tIFwiLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmdcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vSlNQYXJzZXJcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1J1blRpbWUge1xuICAgIGRlZmluZSA9IHt9XG4gICAgY29uc3RydWN0b3IocHVibGljIHNjcmlwdDogU3RyaW5nVHJhY2tlciwgcHVibGljIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGlzVHM6IGJvb2xlYW4pe1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVNjcmlwdChzY3JpcHRzOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvcihjb25zdCBpIG9mIHNjcmlwdHMpe1xuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgX193cml0ZSA9IHt0ZXh0OiAnJ307XG4gICAgICAgICAgICBfX3dyaXRlQXJyYXkucHVzaChfX3dyaXRlKTtgKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhpKVxuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgcmV0dXJuIF9fd3JpdGVBcnJheWApO1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXRob2RzKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApe1xuICAgICAgICBjb25zdCBwYWdlX19maWxlbmFtZSA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgdGhpcy5zbWFsbFBhdGg7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHJpbmc6ICdzY3JpcHQsc3R5bGUsZGVmaW5lLHN0b3JlLHBhZ2VfX2ZpbGVuYW1lLHBhZ2VfX2Rpcm5hbWUsYXR0cmlidXRlcycsXG4gICAgICAgICAgICBmdW5jczogW1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc2NyaXB0LmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zdHlsZS5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kZWZpbmVbU3RyaW5nKGtleSldID0gdmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jb21waWxlUnVuVGltZVN0b3JlLFxuICAgICAgICAgICAgICAgIHBhZ2VfX2ZpbGVuYW1lLFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShwYWdlX19maWxlbmFtZSksXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1xuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkQ29kZShwYXJzZXI6IEpTUGFyc2VyLCBidWlsZFN0cmluZ3M6IHt0ZXh0OiBzdHJpbmd9W10pe1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcyl7XG4gICAgICAgICAgICBpZihpLnR5cGUgPT0gJ3RleHQnKXtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKGkudGV4dClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGJ1aWxkU3RyaW5ncy5wb3AoKS50ZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIGFzeW5jIGNvbXBpbGUoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIC8qIGxvYWQgZnJvbSBjYWNoZSAqL1xuICAgICAgICBjb25zdCBoYXZlQ2FjaGUgPSB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF07XG4gICAgICAgIGlmKGhhdmVDYWNoZSlcbiAgICAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhdmVDYWNoZSkoKTtcbiAgICAgICAgbGV0IGRvRm9yQWxsOiAocmVzb2x2ZTogKCkgPT4gU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pID0+IHZvaWQ7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gZG9Gb3JBbGwgPSByKTtcblxuICAgICAgICAvKiBydW4gdGhlIHNjcmlwdCAqL1xuICAgICAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IENvbnZlcnRTeW50YXhNaW5pKHRoaXMuc2NyaXB0LCBcIkBjb21waWxlXCIsIFwiKlwiKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRoaXMuc2NyaXB0LCB0aGlzLnNtYWxsUGF0aCwgJzwlKicsICclPicpO1xuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBpZihwYXJzZXIudmFsdWVzLmxlbmd0aCA9PSAxICYmIHBhcnNlci52YWx1ZXNbMF0udHlwZSA9PT0gJ3RleHQnKXtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiB0aGlzLnNjcmlwdDtcbiAgICAgICAgICAgIGRvRm9yQWxsKHJlc29sdmUpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFt0eXBlLCBmaWxlUGF0aF0gPVNwbGl0Rmlyc3QoJy8nLCB0aGlzLnNtYWxsUGF0aCksIHR5cGVBcnJheSA9IGdldFR5cGVzW3R5cGVdID8/IGdldFR5cGVzLlN0YXRpYywgXG4gICAgICAgIGNvbXBpbGVQYXRoID0gdHlwZUFycmF5WzFdICsgZmlsZVBhdGggKyAnLmNvbXAuanMnO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGZpbGVQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZVNjcmlwdChwYXJzZXIudmFsdWVzLmZpbHRlcih4ID0+IHgudHlwZSAhPSAndGV4dCcpLm1hcCh4ID0+IHgudGV4dCkpO1xuICAgICAgICBjb25zdCBzb3VyY2VNYXAgPSBuZXcgU291cmNlTWFwU3RvcmUoY29tcGlsZVBhdGgsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIGZhbHNlLCBmYWxzZSlcbiAgICAgICAgc291cmNlTWFwLmFkZFN0cmluZ1RyYWNrZXIodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCB7ZnVuY3MsIHN0cmluZ30gPSB0aGlzLm1ldGhvZHMoYXR0cmlidXRlcylcblxuICAgICAgICBjb25zdCB0b0ltcG9ydCA9IGF3YWl0IGNvbXBpbGVJbXBvcnQoc3RyaW5nLGNvbXBpbGVQYXRoLCBmaWxlUGF0aCwgdHlwZUFycmF5LCB0aGlzLmlzVHMsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIHRlbXBsYXRlLmVxLCBzb3VyY2VNYXAubWFwQXNVUkxDb21tZW50KCkpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGUgPSBhc3luYyAoKSA9PiB0aGlzLnJlYnVpbGRDb2RlKHBhcnNlciwgYXdhaXQgdG9JbXBvcnQoLi4uZnVuY3MpKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gZXhlY3V0ZTsgLy8gc2F2ZSB0aGlzIHRvIGNhY2hlXG4gICAgICAgIGNvbnN0IHRoaXNGaXJzdCA9IGF3YWl0IGV4ZWN1dGUoKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tIFwic3VjcmFzZVwiO1xuaW1wb3J0IHsgbWluaWZ5IH0gZnJvbSBcInRlcnNlclwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXhcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBpc1RzIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuXG4vL0B0cy1pZ25vcmUtbmV4dC1saW5lXG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4vcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgcGFnZURlcHMgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzXCI7XG5pbXBvcnQgQ3VzdG9tSW1wb3J0LCB7IGN1c3RvbVR5cGVzIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0XCI7XG5cbmFzeW5jIGZ1bmN0aW9uIFJlcGxhY2VCZWZvcmUoXG4gIGNvZGU6IHN0cmluZyxcbiAgZGVmaW5lRGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSxcbikge1xuICBjb2RlID0gYXdhaXQgRWFzeVN5bnRheC5CdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZSwgZGVmaW5lRGF0YSk7XG4gIHJldHVybiBjb2RlO1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZShjb2RlOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGRpcjogc3RyaW5nLCBmaWxlOiBzdHJpbmcsIHBhcmFtcz86IHN0cmluZykge1xuICByZXR1cm4gYCR7aXNEZWJ1ZyA/IFwicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1wiIDogJyd9dmFyIF9fZGlybmFtZT1cIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhkaXIpXG4gICAgfVwiLF9fZmlsZW5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZmlsZSlcbiAgICB9XCI7bW9kdWxlLmV4cG9ydHMgPSAoYXN5bmMgKHJlcXVpcmUke3BhcmFtcyA/ICcsJyArIHBhcmFtcyA6ICcnfSk9Pnt2YXIgbW9kdWxlPXtleHBvcnRzOnt9fSxleHBvcnRzPW1vZHVsZS5leHBvcnRzOyR7Y29kZX1cXG5yZXR1cm4gbW9kdWxlLmV4cG9ydHM7fSk7YDtcbn1cblxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmlsZSBwYXRoLCBhbmQgcmV0dXJucyB0aGUgY29tcGlsZWQgY29kZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbH0gc2F2ZVBhdGggLSBUaGUgcGF0aCB0byBzYXZlIHRoZSBjb21waWxlZCBmaWxlIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBpc1R5cGVzY3JpcHQgLSBib29sZWFuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuLFxuICogQHBhcmFtICAtIGZpbGVQYXRoOiBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjb21waWxlLlxuICogQHJldHVybnMgVGhlIHJlc3VsdCBvZiB0aGUgc2NyaXB0LlxuICovXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChmaWxlUGF0aDogc3RyaW5nLCBzYXZlUGF0aDogc3RyaW5nIHwgbnVsbCwgaXNUeXBlc2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCB7IHBhcmFtcywgaGF2ZVNvdXJjZU1hcCA9IGlzRGVidWcsIGZpbGVDb2RlLCB0ZW1wbGF0ZVBhdGggPSBmaWxlUGF0aCwgY29kZU1pbmlmeSA9IHRydWUgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIGhhdmVTb3VyY2VNYXA/OiBib29sZWFuLCBmaWxlQ29kZT86IHN0cmluZyB9ID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuXG4gIGNvbnN0IHNvdXJjZU1hcEZpbGUgPSBzYXZlUGF0aCAmJiBzYXZlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5wb3AoKTtcblxuICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgIHRyYW5zZm9ybXM6IFtcImltcG9ydHNcIl0sXG4gICAgc291cmNlTWFwT3B0aW9uczogaGF2ZVNvdXJjZU1hcCA/IHtcbiAgICAgIGNvbXBpbGVkRmlsZW5hbWU6IHNvdXJjZU1hcEZpbGUsXG4gICAgfSA6IHVuZGVmaW5lZCxcbiAgICBmaWxlUGF0aDogaGF2ZVNvdXJjZU1hcCA/IHNhdmVQYXRoICYmIHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSwgZmlsZVBhdGgpIDogdW5kZWZpbmVkLFxuXG4gIH0sXG4gICAgZGVmaW5lID0ge1xuICAgICAgZGVidWc6IFwiXCIgKyBpc0RlYnVnLFxuICAgIH07XG5cbiAgaWYgKGlzVHlwZXNjcmlwdCkge1xuICAgIE9wdGlvbnMudHJhbnNmb3Jtcy5wdXNoKFwidHlwZXNjcmlwdFwiKTtcbiAgfVxuXG4gIGxldCBSZXN1bHQgPSBhd2FpdCBSZXBsYWNlQmVmb3JlKFxuICAgIGZpbGVDb2RlIHx8IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCksXG4gICAgZGVmaW5lLFxuICApLFxuICAgIHNvdXJjZU1hcDogc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb2RlLCBzb3VyY2VNYXA6IG1hcCB9ID0gdHJhbnNmb3JtKFJlc3VsdCwgT3B0aW9ucyk7XG4gICAgUmVzdWx0ID0gY29kZTtcbiAgICBzb3VyY2VNYXAgPSBKU09OLnN0cmluZ2lmeShtYXApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBQcmludElmTmV3KHtcbiAgICAgIGVycm9yTmFtZTogXCJjb21waWxhdGlvbi1lcnJvclwiLFxuICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7ZmlsZVBhdGh9YCxcbiAgICB9KTtcbiAgfVxuXG4gIFJlc3VsdCA9IHRlbXBsYXRlKFxuICAgIFJlc3VsdCxcbiAgICBpc0RlYnVnLFxuICAgIHBhdGguZGlybmFtZSh0ZW1wbGF0ZVBhdGgpLFxuICAgIHRlbXBsYXRlUGF0aCxcbiAgICBwYXJhbXNcbiAgKTtcblxuICBpZiAoaXNEZWJ1Zykge1xuICAgIGlmIChoYXZlU291cmNlTWFwKVxuICAgICAgUmVzdWx0ICs9IFwiXFxyXFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiICsgQnVmZmVyLmZyb20oc291cmNlTWFwKS50b1N0cmluZyhcImJhc2U2NFwiKTtcbiAgfSBlbHNlIGlmIChjb2RlTWluaWZ5KSB7XG4gICAgdHJ5IHtcbiAgICAgIFJlc3VsdCA9IChhd2FpdCBtaW5pZnkoUmVzdWx0LCB7IG1vZHVsZTogZmFsc2UgfSkpLmNvZGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBQcmludElmTmV3KHtcbiAgICAgICAgZXJyb3JOYW1lOiAnbWluaWZ5JyxcbiAgICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aH1gXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzYXZlUGF0aCkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShzYXZlUGF0aCwgUmVzdWx0KTtcbiAgfVxuICByZXR1cm4gUmVzdWx0O1xufVxuXG5mdW5jdGlvbiBDaGVja1RzKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEZpbGVQYXRoLmVuZHNXaXRoKFwiLnRzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSkge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKEluU3RhdGljUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICByZXR1cm4gYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgdHlwZUFycmF5WzBdICsgSW5TdGF0aWNQYXRoLFxuICAgIHR5cGVBcnJheVsxXSArIEluU3RhdGljUGF0aCArIFwiLmNqc1wiLFxuICAgIENoZWNrVHMoSW5TdGF0aWNQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkRXh0ZW5zaW9uKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlsZUV4dCA9IHBhdGguZXh0bmFtZShGaWxlUGF0aCk7XG5cbiAgaWYgKEJhc2ljU2V0dGluZ3MucGFydEV4dGVuc2lvbnMuaW5jbHVkZXMoZmlsZUV4dC5zdWJzdHJpbmcoMSkpKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgKGlzVHMoKSA/IFwidHNcIiA6IFwianNcIilcbiAgZWxzZSBpZiAoZmlsZUV4dCA9PSAnJylcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzW2lzVHMoKSA/IFwidHNcIiA6IFwianNcIl07XG5cbiAgcmV0dXJuIEZpbGVQYXRoO1xufVxuXG5jb25zdCBTYXZlZE1vZHVsZXMgPSB7fTtcblxuLyoqXG4gKiBMb2FkSW1wb3J0IGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggdG8gYSBmaWxlLCBhbmQgcmV0dXJucyB0aGUgbW9kdWxlIHRoYXQgaXMgYXQgdGhhdCBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1wb3J0RnJvbSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY3JlYXRlZCB0aGlzIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBJblN0YXRpY1BhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBbdXNlRGVwc10gLSBUaGlzIGlzIGEgbWFwIG9mIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHdpdGhvdXRDYWNoZSAtIGFuIGFycmF5IG9mIHBhdGhzIHRoYXQgd2lsbCBub3QgYmUgY2FjaGVkLlxuICogQHJldHVybnMgVGhlIG1vZHVsZSB0aGF0IHdhcyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gTG9hZEltcG9ydChpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZTogc3RyaW5nW10gPSBbXSkge1xuICBsZXQgVGltZUNoZWNrOiBhbnk7XG5cbiAgSW5TdGF0aWNQYXRoID0gcGF0aC5qb2luKEFkZEV4dGVuc2lvbihJblN0YXRpY1BhdGgpLnRvTG93ZXJDYXNlKCkpO1xuICBjb25zdCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoSW5TdGF0aWNQYXRoKS5zdWJzdHJpbmcoMSksIHRoaXNDdXN0b20gPSBjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pIHx8ICFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoZXh0ZW5zaW9uKTtcbiAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aCksIGZpbGVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSxJblN0YXRpY1BhdGgpO1xuXG4gIC8vd2FpdCBpZiB0aGlzIG1vZHVsZSBpcyBvbiBwcm9jZXNzLCBpZiBub3QgZGVjbGFyZSB0aGlzIGFzIG9uIHByb2Nlc3MgbW9kdWxlXG4gIGxldCBwcm9jZXNzRW5kOiAodj86IGFueSkgPT4gdm9pZDtcbiAgaWYgKCFTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0pXG4gICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbmV3IFByb21pc2UociA9PiBwcm9jZXNzRW5kID0gcik7XG4gIGVsc2UgaWYgKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgYXdhaXQgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gIC8vYnVpbGQgcGF0aHNcbiAgY29uc3QgcmVCdWlsZCA9ICFwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSB8fCBwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSAhPSAoVGltZUNoZWNrID0gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKSk7XG5cblxuICBpZiAocmVCdWlsZCkge1xuICAgIFRpbWVDaGVjayA9IFRpbWVDaGVjayA/PyBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpO1xuICAgIGlmIChUaW1lQ2hlY2sgPT0gbnVsbCkge1xuICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke0luU3RhdGljUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke2ltcG9ydEZyb219J2BcbiAgICAgIH0pXG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBudWxsXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzQ3VzdG9tKSAvLyBvbmx5IGlmIG5vdCBjdXN0b20gYnVpbGRcbiAgICAgIGF3YWl0IEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnKTtcbiAgICBwYWdlRGVwcy51cGRhdGUoU2F2ZWRNb2R1bGVzUGF0aCwgVGltZUNoZWNrKTtcbiAgfVxuXG4gIGlmICh1c2VEZXBzKSB7XG4gICAgdXNlRGVwc1tJblN0YXRpY1BhdGhdID0geyB0aGlzRmlsZTogVGltZUNoZWNrIH07XG4gICAgdXNlRGVwcyA9IHVzZURlcHNbSW5TdGF0aWNQYXRoXTtcbiAgfVxuXG4gIGNvbnN0IGluaGVyaXRhbmNlQ2FjaGUgPSB3aXRob3V0Q2FjaGVbMF0gPT0gSW5TdGF0aWNQYXRoO1xuICBpZiAoaW5oZXJpdGFuY2VDYWNoZSlcbiAgICB3aXRob3V0Q2FjaGUuc2hpZnQoKVxuICBlbHNlIGlmICghcmVCdWlsZCAmJiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gJiYgIShTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKSlcbiAgICByZXR1cm4gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLm5vcm1hbGl6ZShwKS5zdWJzdHJpbmcocGF0aC5ub3JtYWxpemUodHlwZUFycmF5WzBdKS5sZW5ndGgpO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgY29uc3QgZGlyUGF0aCA9IHBhdGguZGlybmFtZShJblN0YXRpY1BhdGgpO1xuICAgICAgICBwID0gKGRpclBhdGggIT0gXCIvXCIgPyBkaXJQYXRoICsgXCIvXCIgOiBcIlwiKSArIHA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gaW1wb3J0KHApO1xuICAgIH1cblxuICAgIHJldHVybiBMb2FkSW1wb3J0KGZpbGVQYXRoLCBwLCB0eXBlQXJyYXksIGlzRGVidWcsIHVzZURlcHMsIGluaGVyaXRhbmNlQ2FjaGUgPyB3aXRob3V0Q2FjaGUgOiBbXSk7XG4gIH1cblxuICBsZXQgTXlNb2R1bGU6IGFueTtcbiAgaWYodGhpc0N1c3RvbSl7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBDdXN0b21JbXBvcnQoZmlsZVBhdGgsIGV4dGVuc2lvbiwgcmVxdWlyZU1hcCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVxdWlyZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBJblN0YXRpY1BhdGggKyBcIi5janNcIik7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUocmVxdWlyZVBhdGgpO1xuICAgIE15TW9kdWxlID0gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gIH1cblxuICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBNeU1vZHVsZTtcbiAgcHJvY2Vzc0VuZD8uKCk7XG5cbiAgcmV0dXJuIE15TW9kdWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSW1wb3J0RmlsZShpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZT86IHN0cmluZ1tdKSB7XG4gIGlmICghaXNEZWJ1Zykge1xuICAgIGNvbnN0IGhhdmVJbXBvcnQgPSBTYXZlZE1vZHVsZXNbcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoLnRvTG93ZXJDYXNlKCkpXTtcbiAgICBpZiAoaGF2ZUltcG9ydCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaGF2ZUltcG9ydDtcbiAgfVxuXG4gIHJldHVybiBMb2FkSW1wb3J0KGltcG9ydEZyb20sIEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZU9uY2UoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBmaWxlUGF0aCxcbiAgICB0ZW1wRmlsZSxcbiAgICBDaGVja1RzKGZpbGVQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIGF3YWl0IE15TW9kdWxlKChwYXRoOiBzdHJpbmcpID0+IGltcG9ydChwYXRoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlQ2pzU2NyaXB0KGNvbnRlbnQ6IHN0cmluZykge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0ZW1wRmlsZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kZWwgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBmYWtlIHNjcmlwdCBsb2NhdGlvbiwgYSBmaWxlIGxvY2F0aW9uLCBhIHR5cGUgYXJyYXksIGFuZCBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgb3Igbm90IGl0J3NcbiAqIGEgVHlwZVNjcmlwdCBmaWxlLiBJdCB0aGVuIGNvbXBpbGVzIHRoZSBzY3JpcHQgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIHRoZSBtb2R1bGVcbiAqIFRoaXMgaXMgZm9yIFJ1blRpbWUgQ29tcGlsZSBTY3JpcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2xvYmFsUHJhbXMgLSBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLFxuICogdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNjcmlwdExvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBzY3JpcHQgdG8gYmUgY29tcGlsZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGUgZnJvbSB0aGUgc3RhdGljIGZvbGRlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFtzdHJpbmcsIHN0cmluZ11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlU2NyaXB0IC0gYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIElmIHRydWUsIHRoZSBjb2RlIHdpbGwgYmUgY29tcGlsZWQgd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlQ29kZSAtIFRoZSBjb2RlIHRoYXQgd2lsbCBiZSBjb21waWxlZCBhbmQgc2F2ZWQgdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTWFwQ29tbWVudCAtIHN0cmluZ1xuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUltcG9ydChnbG9iYWxQcmFtczogc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCBzb3VyY2VNYXBDb21tZW50OiBzdHJpbmcpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHR5cGVBcnJheVsxXSk7XG5cbiAgY29uc3QgZnVsbFNhdmVMb2NhdGlvbiA9IHNjcmlwdExvY2F0aW9uICsgXCIuY2pzXCI7XG4gIGNvbnN0IHRlbXBsYXRlUGF0aCA9IHR5cGVBcnJheVswXSArIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTtcblxuICBjb25zdCBSZXN1bHQgPSBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBzY3JpcHRMb2NhdGlvbixcbiAgICB1bmRlZmluZWQsXG4gICAgaXNUeXBlU2NyaXB0LFxuICAgIGlzRGVidWcsXG4gICAgeyBwYXJhbXM6IGdsb2JhbFByYW1zLCBoYXZlU291cmNlTWFwOiBmYWxzZSwgZmlsZUNvZGUsIHRlbXBsYXRlUGF0aCwgY29kZU1pbmlmeTogZmFsc2UgfVxuICApO1xuXG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aC5kaXJuYW1lKGZ1bGxTYXZlTG9jYXRpb24pKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsU2F2ZUxvY2F0aW9uLCBSZXN1bHQgKyBzb3VyY2VNYXBDb21tZW50KTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5ub3JtYWxpemUocCkuc3Vic3RyaW5nKHBhdGgubm9ybWFsaXplKHR5cGVBcnJheVswXSkubGVuZ3RoKTtcbiAgICBlbHNlIHtcbiAgICAgIGlmIChwWzBdID09IFwiLlwiKSB7XG4gICAgICAgIGNvbnN0IGRpclBhdGggPSBwYXRoLmRpcm5hbWUoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlKTtcbiAgICAgICAgcCA9IChkaXJQYXRoICE9IFwiL1wiID8gZGlyUGF0aCArIFwiL1wiIDogXCJcIikgKyBwO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocFswXSAhPSBcIi9cIilcbiAgICAgICAgcmV0dXJuIGltcG9ydChwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydCh0ZW1wbGF0ZVBhdGgsIHAsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gIH1cblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShmdWxsU2F2ZUxvY2F0aW9uKTtcbiAgcmV0dXJuIGFzeW5jICguLi5hcnI6IGFueVtdKSA9PiBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwLCAuLi5hcnIpO1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIEVhc3lGcy5yZWFkSnNvbkZpbGUocGF0aCk7XG59IiwgImltcG9ydCB7IHByb21pc2VzIH0gZnJvbSBcImZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3YXNtTW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShhd2FpdCBwcm9taXNlcy5yZWFkRmlsZShwYXRoKSk7XG4gICAgY29uc3Qgd2FzbUluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKHdhc21Nb2R1bGUsIHt9KTtcbiAgICByZXR1cm4gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG59IiwgImltcG9ydCBqc29uIGZyb20gXCIuL2pzb25cIjtcbmltcG9ydCB3YXNtIGZyb20gXCIuL3dhc21cIjtcblxuZXhwb3J0IGNvbnN0IGN1c3RvbVR5cGVzID0gW1wianNvblwiLCBcIndhc21cIl07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgcmVxdWlyZTogKHA6IHN0cmluZykgPT4gUHJvbWlzZTxhbnk+KXtcbiAgICBzd2l0Y2godHlwZSl7XG4gICAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgICAgICByZXR1cm4ganNvbihwYXRoKVxuICAgICAgICBjYXNlIFwid2FzbVwiOlxuICAgICAgICAgICAgcmV0dXJuIHdhc20ocGF0aCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0KHBhdGgpXG4gICAgfVxufSIsICJpbXBvcnQgeyBjdXN0b21UeXBlcyB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydCc7XG5pbXBvcnQgeyBQYXJzZVRleHRTdHJlYW0sIFJlQnVpbGRDb2RlU3RyaW5nIH0gZnJvbSAnLi9FYXN5U2NyaXB0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFzeVN5bnRheCB7XG4gICAgcHJpdmF0ZSBCdWlsZDogUmVCdWlsZENvZGVTdHJpbmc7XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJzZUFycmF5ID0gYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGNvZGUpO1xuICAgICAgICB0aGlzLkJ1aWxkID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKHBhcnNlQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0ID0gdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgY29uc3QgJHtkYXRhT2JqZWN0fSA9IGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydChyZXBsYWNlVG9UeXBlLCBkYXRhT2JqZWN0LCBpbmRleCl9O09iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtkYXRhT2JqZWN0fSlgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbChyZXBsYWNlVG9UeXBlLCBpbmRleCl9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEltcG9ydFR5cGUodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAoYCR7dHlwZX1bIFxcXFxuXSsoW1xcXFwqXXswLDF9W1xcXFxwe0x9MC05XyxcXFxce1xcXFx9IFxcXFxuXSspWyBcXFxcbl0rZnJvbVsgXFxcXG5dKzxcXFxcfChbMC05XSspXFxcXHxcXFxcfD5gLCAndScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtYXRjaFsxXS50cmltKCk7XG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgbGV0IERhdGFPYmplY3Q6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGRhdGEuc3Vic3RyaW5nKDEpLnJlcGxhY2UoJyBhcyAnLCAnJykudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBTcGxpY2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWQgPSBkYXRhLnNwbGl0KCd9JywgMik7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMF0gKz0gJ30nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMV0gPSBTcGxpY2VkWzFdLnNwbGl0KCcsJykucG9wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJywnLCAxKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgU3BsaWNlZCA9IFNwbGljZWQubWFwKHggPT4geC50cmltKCkpLmZpbHRlcih4ID0+IHgubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzBdWzBdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gdGhpcy5CdWlsZC5BbGxJbnB1dHNbbWF0Y2hbMl1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnN1YnN0cmluZyhleHRlbnNpb24ubGFzdEluZGV4T2YoJy4nKSArIDEsIGV4dGVuc2lvbi5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBge2RlZmF1bHQ6JHtTcGxpY2VkWzBdfX1gOyAvL29ubHkgaWYgdGhpcyBpc24ndCBjdXN0b20gaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBgJHtEYXRhT2JqZWN0LnN1YnN0cmluZygwLCBEYXRhT2JqZWN0Lmxlbmd0aCAtIDEpfSxkZWZhdWx0OiR7U3BsaWNlZFsxXX19YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gRGF0YU9iamVjdC5yZXBsYWNlKC8gYXMgLywgJzonKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBEYXRhT2JqZWN0LCBtYXRjaFsyXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbk9uZVdvcmQodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSA9PiBzdHJpbmcgPSB0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbCkge1xuICAgICAgICBsZXQgYmVmb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaChuZXcgUmVnRXhwKHR5cGUgKyAnWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG5cbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBhY3Rpb25TdHJpbmcocmVwbGFjZVRvVHlwZSwgbWF0Y2hbMV0pO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nO1xuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGJlZm9yZVN0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoU3BhY2UoZnVuYzogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGZ1bmMoJyAnICsgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0KS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBEZWZpbmUoZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke2tleX0oW15cXFxccHtMfV0pYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB2YWx1ZSArIG1hdGNoWzJdXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW5Bc0Z1bmN0aW9uKHdvcmQ6IHN0cmluZywgdG9Xb3JkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke3dvcmR9KFsgXFxcXG5dKlxcXFwoKWAsICdndWknKSwgKC4uLm1hdGNoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB0b1dvcmQgKyBtYXRjaFsyXVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgQnVpbGRJbXBvcnRzKGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0KTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2luY2x1ZGUnKTtcblxuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsKTtcbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbkFzRnVuY3Rpb24oJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuRGVmaW5lKGRlZmluZURhdGEpO1xuICAgIH1cblxuICAgIEJ1aWx0U3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5CdWlsZC5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGU6IHN0cmluZywgZGVmaW5lRGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFJhem9yVG9FSlMsIFJhem9yVG9FSlNNaW5pIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQmFzZVJlYWRlci9SZWFkZXInO1xuXG5cbmNvbnN0IGFkZFdyaXRlTWFwID0ge1xuICAgIFwiaW5jbHVkZVwiOiBcImF3YWl0IFwiLFxuICAgIFwiaW1wb3J0XCI6IFwiYXdhaXQgXCIsXG4gICAgXCJ0cmFuc2ZlclwiOiBcInJldHVybiBhd2FpdCBcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4KHRleHQ6IFN0cmluZ1RyYWNrZXIsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTKHRleHQuZXEpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKHN1YnN0cmluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JT0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU6JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkV3JpdGVNYXBbaS5uYW1lXX0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59XG5cbi8qKlxuICogQ29udmVydFN5bnRheE1pbmkgdGFrZXMgdGhlIGNvZGUgYW5kIGEgc2VhcmNoIHN0cmluZyBhbmQgY29udmVydCBjdXJseSBicmFja2V0c1xuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSB0ZXh0IC0gVGhlIHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmluZCAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhZGRFSlMgLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgc3RhcnQgb2YgdGhlIGVqcy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheE1pbmkodGV4dDogU3RyaW5nVHJhY2tlciwgZmluZDogc3RyaW5nLCBhZGRFSlM6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlNNaW5pKHRleHQuZXEsIGZpbmQpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgIGlmICh2YWx1ZXNbaV0gIT0gdmFsdWVzW2kgKyAxXSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcodmFsdWVzW2ldLCB2YWx1ZXNbaSArIDFdKSk7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpICsgMl0sIHZhbHVlc1tpICsgM10pO1xuICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkRUpTfSR7c3Vic3RyaW5nfSU+YDtcbiAgICB9XG5cbiAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKCh2YWx1ZXMuYXQoLTEpPz8tMSkgKyAxKSk7XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwLWpzXCI7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbmFsaXplQnVpbGQgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi9KU1BhcnNlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBCYXNpYyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgYWRkTWFwcGluZ0Zyb21UcmFjayh0cmFjazogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIENyZWF0ZVNvdXJjZU1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCk7XG4gICAgICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICAgICAgcmV0dXJuIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmdWxsUGF0aENvbXBpbGU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIHRleHQgPSBhd2FpdCBmaW5hbGl6ZUJ1aWxkKHRleHQsIHNlc3Npb25JbmZvLCBmdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgdHJ5IHtcXG5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IChfcmVxdWlyZSwgX2luY2x1ZGUsIF90cmFuc2ZlciwgcHJpdmF0ZV92YXIsIGhhbmRlbENvbm5lY3RvcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IF9fZmlsZW5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhzZXNzaW9uSW5mby5mdWxsUGF0aCl9XCIsIF9fZGlybmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHBhdGguZGlybmFtZShzZXNzaW9uSW5mby5mdWxsUGF0aCkpfVwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgeyBzZW5kRmlsZSwgd3JpdGVTYWZlLCB3cml0ZSwgZWNobywgc2V0UmVzcG9uc2UsIG91dF9ydW5fc2NyaXB0LCBydW5fc2NyaXB0X25hbWUsIFJlc3BvbnNlLCBSZXF1ZXN0LCBQb3N0LCBRdWVyeSwgU2Vzc2lvbiwgRmlsZXMsIENvb2tpZXMsIFBhZ2VWYXIsIEdsb2JhbFZhcn0gPSBwYWdlLFxuXG4gICAgICAgICAgICAgICAgICAgIHJ1bl9zY3JpcHRfY29kZSA9IHJ1bl9zY3JpcHRfbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHtgKTtcblxuXG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYFxcbn1cbiAgICAgICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9uYW1lICs9ICcgLT4gPGxpbmU+JyArIGUuc3RhY2suc3BsaXQoL1xcXFxuKCApKmF0IC8pWzJdO1xuICAgICAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcke1BhZ2VUZW1wbGF0ZS5wcmludEVycm9yKGA8cD5FcnJvciBwYXRoOiAnICsgcnVuX3NjcmlwdF9uYW1lLnJlcGxhY2UoLzxsaW5lPi9naSwgJzxici8+JykgKyAnPC9wPjxwPkVycm9yIG1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UgKyAnPC9wPmApfSc7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGF0aDogXCIgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPGxpbmU+L2dpLCAnXFxcXG4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBtZXNzYWdlOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBydW5pbmcgdGhpcyBjb2RlOiAnXCIgKyBydW5fc2NyaXB0X2NvZGUgKyBcIidcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzdGFjazogXCIgKyBlLnN0YWNrKTtcbiAgICAgICAgICAgICAgICB9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYH19KTt9YCk7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LlBsdXMoUGFnZVRlbXBsYXRlLkNyZWF0ZVNvdXJjZU1hcCh0ZXh0LCBmdWxsUGF0aENvbXBpbGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbHRDb2RlID0gYXdhaXQgUGFnZVRlbXBsYXRlLlJ1bkFuZEV4cG9ydCh0ZXh0LCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuQWRkUGFnZVRlbXBsYXRlKGJ1aWx0Q29kZSwgZnVsbFBhdGhDb21waWxlLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgc3RhdGljIEFkZEFmdGVyQnVpbGQodGV4dDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0ID0gXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIgKyB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBJblBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBkYXRhT2JqZWN0OiBhbnksIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhe1xuICAgICAgICAgICAgY29uc3QgX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHsuLi5fcGFnZSR7ZGF0YU9iamVjdCA/ICcsJyArIGRhdGFPYmplY3QgOiAnJ319O1xuICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHslPmApO1xuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjaygnPCUhfX19JT4nKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFJhem9yU3ludGF4IGZyb20gJy4vUmF6b3JTeW50YXgnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdldFN5bnRheChDb21waWxlVHlwZTogYW55KSB7XG4gICAgbGV0IGZ1bmM6IGFueTtcbiAgICBzd2l0Y2ggKENvbXBpbGVUeXBlLm5hbWUgfHwgQ29tcGlsZVR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlJhem9yXCI6XG4gICAgICAgICAgICBmdW5jID0gUmF6b3JTeW50YXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59IiwgImltcG9ydCBBZGRTeW50YXggZnJvbSAnLi9TeW50YXgvSW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZFBsdWdpbiB7XG5cdHB1YmxpYyBTZXR0aW5nc09iamVjdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoU2V0dGluZ3NPYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgICAgIHRoaXMuU2V0dGluZ3NPYmplY3QgPSBTZXR0aW5nc09iamVjdFxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRlZmF1bHRTeW50YXgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2V0dGluZ3NPYmplY3QuQmFzaWNDb21waWxhdGlvblN5bnRheC5jb25jYXQodGhpcy5TZXR0aW5nc09iamVjdC5BZGRDb21waWxlU3ludGF4KTtcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEJhc2ljKHRleHQ6IFN0cmluZ1RyYWNrZXIsIE9EYXRhOnN0cmluZyB8YW55LCBwYXRoOnN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vYWRkIFN5bnRheFxuXG4gICAgICAgIGlmICghT0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KE9EYXRhKSkge1xuICAgICAgICAgICAgT0RhdGEgPSBbT0RhdGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIE9EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBTeW50YXggPSBhd2FpdCBBZGRTeW50YXgoaSk7XG5cbiAgICAgICAgICAgIGlmIChTeW50YXgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gYXdhaXQgU3ludGF4KHRleHQsIGksIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIHBhZ2VzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgY29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRDb21wb25lbnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdzdWNyYXNlJztcbmltcG9ydCB7IG1pbmlmeSB9IGZyb20gXCJ0ZXJzZXJcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKGNvZGU6IHN0cmluZywgZGVmaW5lRGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICBjb2RlID0gYXdhaXQgRWFzeVN5bnRheC5CdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZSwgZGVmaW5lRGF0YSk7XG4gICAgcmV0dXJuIGNvZGU7XG59XG5cbmZ1bmN0aW9uIEVycm9yVGVtcGxhdGUoaW5mbzogc3RyaW5nKXtcbiAgICByZXR1cm4gYG1vZHVsZS5leHBvcnRzID0gKCkgPT4gKERhdGFPYmplY3QpID0+IERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCArPSAnPHAgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPlN5bnRheCBFcnJvcjogJHtpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpfTwvcD4nYDtcbn1cblxuZnVuY3Rpb24gUmVwbGFjZUFmdGVyKGNvZGU6IHN0cmluZyl7XG4gICAgcmV0dXJuIGNvZGUucmVwbGFjZSgnXCJ1c2Ugc3RyaWN0XCI7JywgJycpLnJlcGxhY2UoJ09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge3ZhbHVlOiB0cnVlfSk7JywgJycpO1xufVxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0ZXh0IFxuICogQHBhcmFtIHR5cGUgXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNUeXBlc2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCByZW1vdmVUb01vZHVsZTogYm9vbGVhbik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgdGV4dCA9IHRleHQudHJpbSgpO1xuXG4gICAgY29uc3QgT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgdHJhbnNmb3JtczogWydpbXBvcnRzJ10sXG4gICAgfSwgZGVmaW5lID0ge1xuICAgICAgICBkZWJ1ZzogJycgKyBpc0RlYnVnXG4gICAgfTtcbiAgICBpZiAoaXNUeXBlc2NyaXB0KSB7XG4gICAgICAgIE9wdGlvbnMudHJhbnNmb3Jtcy5wdXNoKCd0eXBlc2NyaXB0Jyk7XG4gICAgfVxuXG4gICAgbGV0IFJlc3VsdCA9IHsgY29kZTogJycgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIFJlc3VsdCA9IHRyYW5zZm9ybShhd2FpdCBSZXBsYWNlQmVmb3JlKHRleHQuZXEsIGRlZmluZSksIE9wdGlvbnMpO1xuICAgICAgICBSZXN1bHQuY29kZSA9IFJlcGxhY2VBZnRlcihSZXN1bHQuY29kZSk7XG5cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gdGV4dC5kZWJ1Z0xpbmUoZXJyKTtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBlcnJvck1lc3NhZ2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYoaXNEZWJ1ZylcbiAgICAgICAgICAgIFJlc3VsdC5jb2RlID0gRXJyb3JUZW1wbGF0ZShlcnJvck1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGlmICghaXNEZWJ1ZyAmJiAhcmVtb3ZlVG9Nb2R1bGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFJlc3VsdC5jb2RlID0gKGF3YWl0IG1pbmlmeShSZXN1bHQuY29kZSwgeyBtb2R1bGU6IGZhbHNlIH0pKS5jb2RlO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21pbmlmeScsXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dC5kZWJ1Z0xpbmUoZXJyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZXN1bHQuY29kZTtcbn0iLCAiLy9nbG9iYWwgc2V0dGluZ3MgZm9yIGJ1aWxkIGluIGNvbXBvbmVudHNcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0ge1xuICAgIHBsdWdpbnM6IFtdXG59OyIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4vSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4vU2NyaXB0VGVtcGxhdGUnO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoLCBQYXJzZURlYnVnTGluZSwgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0ICogYXMgZXh0cmljYXRlIGZyb20gJy4vWE1MSGVscGVycy9FeHRyaWNhdGUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEJ1aWxkU2NyaXB0IGZyb20gJy4vdHJhbnNmb3JtL1NjcmlwdCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBCdWlsZFNjcmlwdFNldHRpbmdzIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHsgQWRkQ29tcGlsZVN5bnRheDogW10sIHBsdWdpbnM6IFtdLCBCYXNpY0NvbXBpbGF0aW9uU3ludGF4OiBbJ1Jhem9yJ10gfTtcbmNvbnN0IFBsdWdpbkJ1aWxkID0gbmV3IEFkZFBsdWdpbihTZXR0aW5ncyk7XG5leHBvcnQgY29uc3QgQ29tcG9uZW50cyA9IG5ldyBJbnNlcnRDb21wb25lbnQoUGx1Z2luQnVpbGQpO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0UGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBTZXR0aW5ncy5wbHVnaW5zLmZpbmQoYiA9PiBiID09IG5hbWUgfHwgKDxhbnk+Yik/Lm5hbWUgPT0gbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTb21lUGx1Z2lucyguLi5kYXRhOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBkYXRhLnNvbWUoeCA9PiBHZXRQbHVnaW4oeCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcygpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheC5pbmNsdWRlcygnVHlwZVNjcmlwdCcpO1xufVxuXG5Db21wb25lbnRzLk1pY3JvUGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5Db21wb25lbnRzLkdldFBsdWdpbiA9IEdldFBsdWdpbjtcbkNvbXBvbmVudHMuU29tZVBsdWdpbnMgPSBTb21lUGx1Z2lucztcbkNvbXBvbmVudHMuaXNUcyA9IGlzVHM7XG5cbkJ1aWxkU2NyaXB0U2V0dGluZ3MucGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5cbmFzeW5jIGZ1bmN0aW9uIG91dFBhZ2UoZGF0YTogU3RyaW5nVHJhY2tlciwgc2NyaXB0RmlsZTogU3RyaW5nVHJhY2tlciwgcGFnZVBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG5cbiAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKGRhdGEsIGlzVHMoKSk7XG4gICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKHNlc3Npb25JbmZvLCBwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgcGFnZU5hbWUpO1xuXG4gICAgY29uc3QgbW9kZWxOYW1lID0gYmFzZURhdGEucG9wQW55KCdtb2RlbCcpPy5lcTtcblxuICAgIGlmICghbW9kZWxOYW1lKSByZXR1cm4gc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUsIGJhc2VEYXRhLmNsZWFyRGF0YSk7XG4gICAgZGF0YSA9IGJhc2VEYXRhLmNsZWFyRGF0YTtcblxuICAgIC8vaW1wb3J0IG1vZGVsXG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgbW9kZWxOYW1lLCAnTW9kZWxzJywgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMubW9kZWwpOyAvLyBmaW5kIGxvY2F0aW9uIG9mIHRoZSBmaWxlXG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bGxQYXRoKSkge1xuICAgICAgICBjb25zdCBFcnJvck1lc3NhZ2UgPSBgRXJyb3IgbW9kZWwgbm90IGZvdW5kIC0+ICR7bW9kZWxOYW1lfSBhdCBwYWdlICR7cGFnZU5hbWV9YDtcblxuICAgICAgICBwcmludC5lcnJvcihFcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQsIFBhZ2VUZW1wbGF0ZS5wcmludEVycm9yKEVycm9yTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLCBGdWxsUGF0aCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhwYWdlTmFtZSwgRnVsbFBhdGgsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICBsZXQgbW9kZWxEYXRhID0gUGFyc2VCYXNlUGFnZS5yZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGJhc2VNb2RlbERhdGEuYWxsRGF0YSk7XG5cbiAgICBtb2RlbERhdGEuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgIHBhZ2VOYW1lICs9IFwiIC0+IFwiICsgU21hbGxQYXRoO1xuXG4gICAgLy9HZXQgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgYWxsRGF0YSA9IGV4dHJpY2F0ZS5nZXREYXRhVGFnZXMobW9kZWxEYXRhLCBbJyddLCAnOicsIGZhbHNlLCB0cnVlKTtcblxuICAgIGlmIChhbGxEYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3Igd2l0aGluIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBtb2RlbERhdGEgPSBhbGxEYXRhLmRhdGE7XG4gICAgY29uc3QgdGFnQXJyYXkgPSBhbGxEYXRhLmZvdW5kLm1hcCh4ID0+IHgudGFnLnN1YnN0cmluZygxKSk7XG4gICAgY29uc3Qgb3V0RGF0YSA9IGV4dHJpY2F0ZS5nZXREYXRhVGFnZXMoZGF0YSwgdGFnQXJyYXksICdAJyk7XG5cbiAgICBpZiAob3V0RGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIFdpdGggbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vQnVpbGQgV2l0aCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBtb2RlbEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBhbGxEYXRhLmZvdW5kKSB7XG4gICAgICAgIGkudGFnID0gaS50YWcuc3Vic3RyaW5nKDEpOyAvLyByZW1vdmluZyB0aGUgJzonXG4gICAgICAgIGNvbnN0IGhvbGRlckRhdGEgPSBvdXREYXRhLmZvdW5kLmZpbmQoKGUpID0+IGUudGFnID09ICdAJyArIGkudGFnKTtcblxuICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhLnN1YnN0cmluZygwLCBpLmxvYykpO1xuICAgICAgICBtb2RlbERhdGEgPSBtb2RlbERhdGEuc3Vic3RyaW5nKGkubG9jKTtcblxuICAgICAgICBpZiAoaG9sZGVyRGF0YSkge1xuICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGhvbGRlckRhdGEuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFRyeSBsb2FkaW5nIGRhdGEgZnJvbSBwYWdlIGJhc2VcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGcm9tQmFzZSA9IGJhc2VEYXRhLnBvcChpLnRhZyk7XG5cbiAgICAgICAgICAgIGlmIChsb2FkRnJvbUJhc2UgJiYgbG9hZEZyb21CYXNlLmVxLnRvTG93ZXJDYXNlKCkgIT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhsb2FkRnJvbUJhc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YSk7XG5cbiAgICByZXR1cm4gYXdhaXQgb3V0UGFnZShtb2RlbEJ1aWxkLCBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSksIEZ1bGxQYXRoLCBwYWdlTmFtZSwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbnNlcnQoZGF0YTogc3RyaW5nLCBmdWxsUGF0aENvbXBpbGU6IHN0cmluZywgbmVzdGVkUGFnZT86IGJvb2xlYW4sIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBzZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IEJ1aWxkU2NyaXB0V2l0aFByYW1zID0gKGNvZGU6IFN0cmluZ1RyYWNrZXIsIFJlbW92ZVRvTW9kdWxlID0gdHJ1ZSk6IFByb21pc2U8c3RyaW5nPiA9PiBCdWlsZFNjcmlwdChjb2RlLCBpc1RzKCksIHNlc3Npb25JbmZvLmRlYnVnLCBSZW1vdmVUb01vZHVsZSk7XG5cbiAgICBsZXQgRGVidWdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGRhdGEpO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgb3V0UGFnZShEZWJ1Z1N0cmluZywgbmV3IFN0cmluZ1RyYWNrZXIoRGVidWdTdHJpbmcuRGVmYXVsdEluZm9UZXh0KSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBsdWdpbkJ1aWxkLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgQ29tcG9uZW50cy5JbnNlcnQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgQnVpbGRTY3JpcHRXaXRoUHJhbXMsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYWdlVGVtcGxhdGUuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBmdWxsUGF0aENvbXBpbGUsIHNlc3Npb25JbmZvKTtcblxuICAgIGxldCBEZWJ1Z1N0cmluZ0FzQnVpbGQgPSBhd2FpdCBCdWlsZFNjcmlwdFdpdGhQcmFtcyhEZWJ1Z1N0cmluZyk7XG4gICAgRGVidWdTdHJpbmdBc0J1aWxkID0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmdBc0J1aWxkLCBzZXNzaW9uSW5mby5kZWJ1Zyk7XG5cbiAgICByZXR1cm4gRGVidWdTdHJpbmdBc0J1aWxkO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJ1aWxkSlMsIEJ1aWxkSlNYLCBCdWlsZFRTLCBCdWlsZFRTWCB9IGZyb20gJy4vRm9yU3RhdGljL1NjcmlwdCc7XG5pbXBvcnQgQnVpbGRTdmVsdGUgZnJvbSAnLi9Gb3JTdGF0aWMvU3ZlbHRlJztcbmltcG9ydCB7IEJ1aWxkU3R5bGVTYXNzIH0gZnJvbSAnLi9Gb3JTdGF0aWMvU3R5bGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIFN5c3RlbURhdGEsIGdldERpcm5hbWUsIEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBSZXNwb25zZSwgUmVxdWVzdCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcHJvbXB0bHkgZnJvbSAncHJvbXB0bHknO1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuXG5jb25zdCBTdXBwb3J0ZWRUeXBlcyA9IFsnanMnLCAnc3ZlbHRlJywgJ3RzJywgJ2pzeCcsICd0c3gnLCAnY3NzJywgJ3Nhc3MnLCAnc2NzcyddO1xuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTdGF0aWNGaWxlcycpO1xuXG5hc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbyA9IFN0YXRpY0ZpbGVzSW5mby5zdG9yZVtwYXRoXTtcblxuICAgIGZvciAoY29uc3QgaSBpbiBvKSB7XG4gICAgICAgIGxldCBwID0gaTtcblxuICAgICAgICBpZiAoaSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBwID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgcGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBwO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gb1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gIW87XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBmdWxsQ29tcGlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBkZXBlbmRlbmNpZXM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG4gICAgc3dpdGNoIChleHQpIHtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRKUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRKU1goU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUU1goU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjc3MnOlxuICAgICAgICBjYXNlICdzYXNzJzpcbiAgICAgICAgY2FzZSAnc2Nzcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN0eWxlU2FzcyhTbWFsbFBhdGgsIGV4dCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3ZlbHRlJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3ZlbHRlKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBmdWxsQ29tcGlsZVBhdGggKz0gJy5qcyc7XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbENvbXBpbGVQYXRoKSkge1xuICAgICAgICBTdGF0aWNGaWxlc0luZm8udXBkYXRlKFNtYWxsUGF0aCwgZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFpc0RlYnVnKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbn1cblxuaW50ZXJmYWNlIGJ1aWxkSW4ge1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgZXh0Pzogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBpblNlcnZlcj86IHN0cmluZztcbn1cblxuY29uc3Qgc3RhdGljRmlsZXMgPSBTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvY2xpZW50Lyc7XG5jb25zdCBnZXRTdGF0aWM6IGJ1aWxkSW5bXSA9IFt7XG4gICAgcGF0aDogXCJzZXJ2L3RlbXAuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJidWlsZFRlbXBsYXRlLmpzXCJcbn0sXG57XG4gICAgcGF0aDogXCJzZXJ2L2Nvbm5lY3QuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJtYWtlQ29ubmVjdGlvbi5qc1wiXG59XTtcblxuY29uc3QgZ2V0U3RhdGljRmlsZXNUeXBlOiBidWlsZEluW10gPSBbe1xuICAgIGV4dDogJy5wdWIuanMnLFxuICAgIHR5cGU6ICdqcydcbn0sXG57XG4gICAgZXh0OiAnLnB1Yi5tanMnLFxuICAgIHR5cGU6ICdqcydcbn0sXG57XG4gICAgZXh0OiAnLnB1Yi5jc3MnLFxuICAgIHR5cGU6ICdjc3MnXG59XTtcblxuYXN5bmMgZnVuY3Rpb24gc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdDogUmVxdWVzdCwgZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGZvdW5kID0gZ2V0U3RhdGljRmlsZXNUeXBlLmZpbmQoeCA9PiBmaWxlUGF0aC5lbmRzV2l0aCh4LmV4dCkpO1xuXG4gICAgaWYgKCFmb3VuZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBjb25zdCBiYXNlUGF0aCA9IFJlcXVlc3QucXVlcnkudCA9PSAnbCcgPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdO1xuICAgIGNvbnN0IGluU2VydmVyID0gcGF0aC5qb2luKGJhc2VQYXRoLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShpblNlcnZlcikpXG4gICAgICAgIHJldHVybiB7IC4uLmZvdW5kLCBpblNlcnZlciB9O1xufVxuXG5sZXQgZGVidWdnaW5nV2l0aFNvdXJjZTogbnVsbCB8IGJvb2xlYW4gPSBudWxsO1xuXG5pZiAoYXJndi5pbmNsdWRlcygnYWxsb3dTb3VyY2VEZWJ1ZycpKVxuICAgIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPSB0cnVlO1xuYXN5bmMgZnVuY3Rpb24gYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpIHtcbiAgICBpZiAodHlwZW9mIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPT0gJ2Jvb2xlYW4nKVxuICAgICAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcblxuICAgIHRyeSB7XG4gICAgICAgIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPSAoYXdhaXQgcHJvbXB0bHkucHJvbXB0KFxuICAgICAgICAgICAgJ0FsbG93IGRlYnVnZ2luZyBKYXZhU2NyaXB0L0NTUyBpbiBzb3VyY2UgcGFnZT8gLSBleHBvc2luZyB5b3VyIHNvdXJjZSBjb2RlIChubyknLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvcih2OiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFsneWVzJywgJ25vJ10uaW5jbHVkZXModi50cmltKCkudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd5ZXMgb3Igbm8nKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAgKiAzMFxuICAgICAgICAgICAgfVxuICAgICAgICApKS50cmltKCkudG9Mb3dlckNhc2UoKSA9PSAneWVzJztcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgfSBjYXRjaCB7IH1cblxuXG4gICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG59XG5cbmNvbnN0IHNhZmVGb2xkZXJzID0gW2dldFR5cGVzLlN0YXRpY1syXSwgZ2V0VHlwZXMuTG9nc1syXSwgJ01vZGVscycsICdDb21wb25lbnRzJ107XG4vKipcbiAqIElmIHRoZSB1c2VyIGlzIGluIGRlYnVnIG1vZGUsIGFuZCB0aGUgZmlsZSBpcyBhIHNvdXJjZSBmaWxlLCBhbmQgdGhlIHVzZXIgY29tbWVuZCBsaW5lIGFyZ3VtZW50IGhhdmUgYWxsb3dTb3VyY2VEZWJ1Z1xuICogdGhlbiByZXR1cm4gdGhlIGZ1bGwgcGF0aCB0byB0aGUgZmlsZVxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gaXMgdGhlIGN1cnJlbnQgcGFnZSBhIGRlYnVnIHBhZ2U/XG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0aGF0IHdhcyBjbGlja2VkLlxuICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIC0gSWYgdGhpcyBwYXRoIGFscmVhZHkgYmVlbiBjaGVja2VkXG4gKiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSB0eXBlIG9mIHRoZSBmaWxlIGFuZCB0aGUgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5zYWZlRGVidWcoaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghaXNEZWJ1ZyB8fCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikgfHwgcGF0aC5leHRuYW1lKGZpbGVQYXRoKSAhPSAnLnNvdXJjZScgfHwgIXNhZmVGb2xkZXJzLmluY2x1ZGVzKGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnNoaWZ0KCkpIHx8ICFhd2FpdCBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNykpOyAvLyByZW1vdmluZyAnLnNvdXJjZSdcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdodG1sJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdHlsZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYmFzZUZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDQpOyAvLyByZW1vdmluZyAnLmNzcydcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGZpbGVQYXRoO1xuXG4gICAgbGV0IGV4aXN0czogYm9vbGVhbjtcbiAgICBpZiAocGF0aC5leHRuYW1lKGJhc2VGaWxlUGF0aCkgPT0gJy5zdmVsdGUnICYmIChjaGVja2VkIHx8IChleGlzdHMgPSBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmIGV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBTb21lUGx1Z2lucywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnc3VjcmFzZSc7XG5pbXBvcnQgeyBtaW5pZnkgfSBmcm9tIFwidGVyc2VyXCI7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5wdXRQYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbW9yZU9wdGlvbnM/OiBUcmFuc2Zvcm1PcHRpb25zLCBoYXZlRGlmZmVyZW50U291cmNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHRyYW5zZm9ybXM6IFtdLFxuICAgICAgICBzb3VyY2VNYXBPcHRpb25zOiB7XG4gICAgICAgICAgICBjb21waWxlZEZpbGVuYW1lOiAnLycgKyBpbnB1dFBhdGgsXG4gICAgICAgIH0sXG4gICAgICAgIGZpbGVQYXRoOiBpbnB1dFBhdGgsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIC4uLm1vcmVPcHRpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIHNvdXJjZU1hcCB9ID0gdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IGNvZGU7XG5cbiAgICAgICAgaWYgKGlzRGVidWcgJiYgaGF2ZURpZmZlcmVudFNvdXJjZSkge1xuICAgICAgICAgICAgc291cmNlTWFwLnNvdXJjZXMgPSBzb3VyY2VNYXAuc291cmNlcy5tYXAoeCA9PiB4LnNwbGl0KC9cXC98XFxcXC8pLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZScpO1xuXG4gICAgICAgICAgICByZXN1bHQgKz0gXCJcXHJcXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIgK1xuICAgICAgICAgICAgICAgIEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7ZnVsbFBhdGh9OiR7ZXJyPy5sb2M/LmxpbmUgPz8gMH06JHtlcnI/LmxvYz8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChhd2FpdCBtaW5pZnkocmVzdWx0LCB7IG1vZHVsZTogZmFsc2UgfSkpLmNvZGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWluaWZ5JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0gb24gZmlsZSAtPiAke2Z1bGxQYXRofWBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgcmVzdWx0KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ2pzJywgaXNEZWJ1ZywgdW5kZWZpbmVkLCBmYWxzZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzJywgaXNEZWJ1ZywgeyB0cmFuc2Zvcm1zOiBbJ3R5cGVzY3JpcHQnXSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ2pzeCcsIGlzRGVidWcsIHsgLi4uKEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pLCB0cmFuc2Zvcm1zOiBbJ2pzeCddIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAndHN4JywgaXNEZWJ1ZywgeyB0cmFuc2Zvcm1zOiBbJ3R5cGVzY3JpcHQnLCAnanN4J10sIC4uLihHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KSB9KTtcbn1cbiIsICJpbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyAgY3JlYXRlSW1wb3J0ZXIsIHNhc3NBbmRTb3VyY2UsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFN0eWxlU2FzcyhpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogXCJzYXNzXCIgfCBcInNjc3NcIiB8IFwiY3NzXCIsIGlzRGVidWc6IGJvb2xlYW4pOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0+IHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuXG4gICAgY29uc3QgZGVwZW5kZW5jZU9iamVjdCA9IHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpLCBmaWxlRGF0YURpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoZmlsZURhdGEsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCh0eXBlKSxcbiAgICAgICAgICAgIHN0eWxlOiBzYXNzU3R5bGUodHlwZSwgU29tZVBsdWdpbnMpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnQsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5jc3M7XG5cbiAgICAgICAgaWYgKGlzRGVidWcgJiYgcmVzdWx0LnNvdXJjZU1hcCkge1xuICAgICAgICAgICAgc2Fzc0FuZFNvdXJjZShyZXN1bHQuc291cmNlTWFwLCBwYXRoVG9GaWxlVVJMKGZpbGVEYXRhKS5ocmVmKTtcbiAgICAgICAgICAgIHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcyA9IHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcy5tYXAoeCA9PiBwYXRoLnJlbGF0aXZlKGZpbGVEYXRhRGlybmFtZSwgZmlsZVVSTFRvUGF0aCh4KSkgKyAnP3NvdXJjZT10cnVlJyk7XG5cbiAgICAgICAgICAgIGRhdGEgKz0gYFxcclxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5zb3VyY2VNYXApKS50b1N0cmluZyhcImJhc2U2NFwiKX0qL2A7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCBkYXRhKTtcbiAgICB9IGNhdGNoIChleHByZXNzaW9uKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdGV4dDogYCR7ZXhwcmVzc2lvbi5tZXNzYWdlfSwgb24gZmlsZSAtPiAke2Z1bGxQYXRofSR7ZXhwcmVzc2lvbi5saW5lID8gJzonICsgZXhwcmVzc2lvbi5saW5lIDogJyd9YCxcbiAgICAgICAgICAgIGVycm9yTmFtZTogZXhwcmVzc2lvbj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgICAgIHR5cGU6IGV4cHJlc3Npb24/LnN0YXR1cyA9PSA1ID8gJ3dhcm4nIDogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRlcGVuZGVuY2VPYmplY3Rcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGlyZW50IH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgSW5zZXJ0LCBDb21wb25lbnRzLCBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgQ2xlYXJXYXJuaW5nIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnXG5pbXBvcnQgKiBhcyBTZWFyY2hGaWxlU3lzdGVtIGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgUmVxU2NyaXB0IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgU3RhdGljRmlsZXMgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gJy4vQ29tcGlsZVN0YXRlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCB7IGNyZWF0ZVNpdGVNYXAgfSBmcm9tICcuL1NpdGVNYXAnO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSwgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCB7IHBlckNvbXBpbGUsIHBvc3RDb21waWxlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMnO1xuXG5hc3luYyBmdW5jdGlvbiBjb21waWxlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBpc0RlYnVnPzogYm9vbGVhbiwgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nKSB7XG4gICAgY29uc3QgRnVsbEZpbGVQYXRoID0gcGF0aC5qb2luKGFycmF5VHlwZVswXSwgZmlsZVBhdGgpLCBGdWxsUGF0aENvbXBpbGUgPSBhcnJheVR5cGVbMV0gKyBmaWxlUGF0aCArICcuY2pzJztcblxuXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsRmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgY29uc3QgRXhjbHVVcmwgPSAobmVzdGVkUGFnZSA/IG5lc3RlZFBhZ2UgKyAnPGxpbmU+JyA6ICcnKSArIGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBoYXNTZXNzaW9uSW5mbyA/PyBuZXcgU2Vzc2lvbkJ1aWxkKGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoLCBGdWxsRmlsZVBhdGgsIGFycmF5VHlwZVsyXSwgaXNEZWJ1ZywgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpKTtcbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKCd0aGlzUGFnZScsIEZ1bGxGaWxlUGF0aCk7XG5cbiAgICBjb25zdCBDb21waWxlZERhdGEgPSBhd2FpdCBJbnNlcnQoaHRtbCwgRnVsbFBhdGhDb21waWxlLCBCb29sZWFuKG5lc3RlZFBhZ2UpLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFuZXN0ZWRQYWdlKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoRnVsbFBhdGhDb21waWxlLCA8c3RyaW5nPkNvbXBpbGVkRGF0YSk7XG4gICAgICAgIHBhZ2VEZXBzLnVwZGF0ZShSZW1vdmVFbmRUeXBlKEV4Y2x1VXJsKSwgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLm1rZGlyKGFycmF5VHlwZVsxXSArIGNvbm5lY3QpO1xuICAgICAgICAgICAgYXdhaXQgRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKFNlYXJjaEZpbGVTeXN0ZW0uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShhcnJheVR5cGVbMl0gKyAnLycgKyBjb25uZWN0KSkgLy9jaGVjayBpZiBub3QgYWxyZWFkeSBjb21waWxlIGZyb20gYSAnaW4tZmlsZScgY2FsbFxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb21waWxlRmlsZShjb25uZWN0LCBhcnJheVR5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoU2VhcmNoRmlsZVN5c3RlbS5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyIC0gJyArIGFycmF5VHlwZVsyXSwgY29ubmVjdCwgYXJyYXlUeXBlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgU3RhdGljRmlsZXMoY29ubmVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlU2NyaXB0cyhzY3JpcHRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBzY3JpcHRzKSB7XG4gICAgICAgIGF3YWl0IFJlcVNjcmlwdCgnUHJvZHVjdGlvbiBMb2FkZXInLCBwYXRoLCBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpYywgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQ3JlYXRlQ29tcGlsZSh0OiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB0eXBlcyA9IFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXNbdF07XG4gICAgYXdhaXQgU2VhcmNoRmlsZVN5c3RlbS5EZWxldGVJbkRpcmVjdG9yeSh0eXBlc1sxXSk7XG4gICAgcmV0dXJuICgpID0+IEZpbGVzSW5Gb2xkZXIodHlwZXMsICcnLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogd2hlbiBwYWdlIGNhbGwgb3RoZXIgcGFnZTtcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlSW5GaWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgc2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLCBhcnJheVR5cGVbMV0pO1xuICAgIHJldHVybiBhd2FpdCBjb21waWxlRmlsZShwYXRoLCBhcnJheVR5cGUsIHRydWUsIHNlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10pIHtcbiAgICBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShwYXRoLCBhcnJheVR5cGUpO1xuICAgIENsZWFyV2FybmluZygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUFsbChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKSB7XG4gICAgbGV0IHN0YXRlID0gIWFyZ3YuaW5jbHVkZXMoJ3JlYnVpbGQnKSAmJiBhd2FpdCBDb21waWxlU3RhdGUuY2hlY2tMb2FkKClcblxuICAgIGlmIChzdGF0ZSkgcmV0dXJuICgpID0+IFJlcXVpcmVTY3JpcHRzKHN0YXRlLnNjcmlwdHMpXG4gICAgcGFnZURlcHMuY2xlYXIoKTtcbiAgICBcbiAgICBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuXG4gICAgcGVyQ29tcGlsZSgpO1xuXG4gICAgY29uc3QgYWN0aXZhdGVBcnJheSA9IFthd2FpdCBDcmVhdGVDb21waWxlKFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljWzJdLCBzdGF0ZSksIGF3YWl0IENyZWF0ZUNvbXBpbGUoU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5Mb2dzWzJdLCBzdGF0ZSksIENsZWFyV2FybmluZ107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWN0aXZhdGVBcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgaSgpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmV4cG9ydCgpXG4gICAgICAgIHBvc3RDb21waWxlKClcbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBnZXRTZXR0aW5nc0RhdGUgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG50eXBlIENTdGF0ZSA9IHtcbiAgICB1cGRhdGU6IG51bWJlclxuICAgIHBhZ2VBcnJheTogc3RyaW5nW11bXSxcbiAgICBpbXBvcnRBcnJheTogc3RyaW5nW11cbiAgICBmaWxlQXJyYXk6IHN0cmluZ1tdXG59XG5cbi8qIFRoaXMgY2xhc3MgaXMgdXNlZCB0byBzdG9yZSB0aGUgc3RhdGUgb2YgdGhlIHByb2plY3QgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVTdGF0ZSB7XG4gICAgcHJpdmF0ZSBzdGF0ZTogQ1N0YXRlID0geyB1cGRhdGU6IDAsIHBhZ2VBcnJheTogW10sIGltcG9ydEFycmF5OiBbXSwgZmlsZUFycmF5OiBbXSB9XG4gICAgc3RhdGljIGZpbGVQYXRoID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIFwiQ29tcGlsZVN0YXRlLmpzb25cIilcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGUgPSBnZXRTZXR0aW5nc0RhdGUoKVxuICAgIH1cblxuICAgIGdldCBzY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5pbXBvcnRBcnJheVxuICAgIH1cblxuICAgIGdldCBwYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUucGFnZUFycmF5XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5maWxlQXJyYXlcbiAgICB9XG5cbiAgICBhZGRQYWdlKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5wYWdlQXJyYXkuZmluZCh4ID0+IHhbMF0gPT0gcGF0aCAmJiB4WzFdID09IHR5cGUpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wYWdlQXJyYXkucHVzaChbcGF0aCwgdHlwZV0pXG4gICAgfVxuXG4gICAgYWRkSW1wb3J0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW1wb3J0QXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmltcG9ydEFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBhZGRGaWxlKHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZmlsZUFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWxlQXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKENvbXBpbGVTdGF0ZS5maWxlUGF0aCwgdGhpcy5zdGF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tMb2FkKCkge1xuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuZmlsZVBhdGgpKSByZXR1cm5cblxuICAgICAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuICAgICAgICBzdGF0ZS5zdGF0ZSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5maWxlUGF0aClcblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICE9IGdldFNldHRpbmdzRGF0ZSgpKSByZXR1cm5cblxuICAgICAgICByZXR1cm4gc3RhdGVcbiAgICB9XG59IiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEltcG9ydEZpbGUsIHtBZGRFeHRlbnNpb24sIFJlcXVpcmVPbmNlfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0UmVxdWlyZShhcnJheTogc3RyaW5nW10sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBhcnJheUZ1bmNTZXJ2ZXIgPSBbXTtcbiAgICBmb3IgKGxldCBpIG9mIGFycmF5KSB7XG4gICAgICAgIGkgPSBBZGRFeHRlbnNpb24oaSk7XG5cbiAgICAgICAgY29uc3QgYiA9IGF3YWl0IEltcG9ydEZpbGUoJ3Jvb3QgZm9sZGVyIChXV1cpJywgaSwgZ2V0VHlwZXMuU3RhdGljLCBpc0RlYnVnKTtcbiAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIuU3RhcnRTZXJ2ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJyYXlGdW5jU2VydmVyLnB1c2goYi5TdGFydFNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmludC5sb2coYENhbid0IGZpbmQgU3RhcnRTZXJ2ZXIgZnVuY3Rpb24gYXQgbW9kdWxlIC0gJHtpfVxcbmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RnVuY1NlcnZlcjtcbn1cblxubGV0IGxhc3RTZXR0aW5nc0ltcG9ydDogbnVtYmVyO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldFNldHRpbmdzKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pe1xuICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoICsgJy50cycpKXtcbiAgICAgICAgZmlsZVBhdGggKz0gJy50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggKz0gJy5qcydcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlVGltZSA9IDxhbnk+YXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbClcblxuICAgIGlmKGNoYW5nZVRpbWUgPT0gbGFzdFNldHRpbmdzSW1wb3J0IHx8ICFjaGFuZ2VUaW1lKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsYXN0U2V0dGluZ3NJbXBvcnQgPSBjaGFuZ2VUaW1lO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBSZXF1aXJlT25jZShmaWxlUGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIGRhdGEuZGVmYXVsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmdzRGF0ZSgpe1xuICAgIHJldHVybiBsYXN0U2V0dGluZ3NJbXBvcnRcbn0iLCAiaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlSlNPTlwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTWFwLCBTdHJpbmdOdW1iZXJNYXAsIHRhZ0RhdGFPYmplY3RBcnJheSB9IGZyb20gXCIuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gXCIuLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlcnYtY29ubmVjdFwiO1xuXG5cbmV4cG9ydCB0eXBlIHNldERhdGFIVE1MVGFnID0ge1xuICAgIHVybDogc3RyaW5nLFxuICAgIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXBcbn1cblxuZXhwb3J0IHR5cGUgY29ubmVjdG9yQXJyYXkgPSB7XG4gICAgdHlwZTogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBzZW5kVG86IHN0cmluZyxcbiAgICB2YWxpZGF0b3I6IHN0cmluZ1tdLFxuICAgIG9yZGVyPzogc3RyaW5nW10sXG4gICAgbm90VmFsaWQ/OiBzdHJpbmcsXG4gICAgbWVzc2FnZT86IHN0cmluZyB8IGJvb2xlYW4sXG4gICAgcmVzcG9uc2VTYWZlPzogYm9vbGVhblxufVtdXG5cbmV4cG9ydCB0eXBlIGNhY2hlQ29tcG9uZW50ID0ge1xuICAgIFtrZXk6IHN0cmluZ106IG51bGwgfCB7XG4gICAgICAgIG10aW1lTXM/OiBudW1iZXIsXG4gICAgICAgIHZhbHVlPzogc3RyaW5nXG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBpblRhZ0NhY2hlID0ge1xuICAgIHN0eWxlOiBzdHJpbmdbXVxuICAgIHNjcmlwdDogc3RyaW5nW11cbiAgICBzY3JpcHRNb2R1bGU6IHN0cmluZ1tdXG59XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1Nob3J0U2NyaXB0TmFtZXMnKTtcblxuLyogVGhlIFNlc3Npb25CdWlsZCBjbGFzcyBpcyB1c2VkIHRvIGJ1aWxkIHRoZSBoZWFkIG9mIHRoZSBwYWdlICovXG5leHBvcnQgY2xhc3MgU2Vzc2lvbkJ1aWxkIHtcbiAgICBjb25uZWN0b3JBcnJheTogY29ubmVjdG9yQXJyYXkgPSBbXVxuICAgIHByaXZhdGUgc2NyaXB0VVJMU2V0OiBzZXREYXRhSFRNTFRhZ1tdID0gW11cbiAgICBwcml2YXRlIHN0eWxlVVJMU2V0OiBzZXREYXRhSFRNTFRhZ1tdID0gW11cbiAgICBwcml2YXRlIGluU2NyaXB0U3R5bGU6IHsgdHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHBhdGg6IHN0cmluZywgdmFsdWU6IFNvdXJjZU1hcFN0b3JlIH1bXSA9IFtdXG4gICAgaGVhZEhUTUwgPSAnJ1xuICAgIGNhY2hlOiBpblRhZ0NhY2hlID0ge1xuICAgICAgICBzdHlsZTogW10sXG4gICAgICAgIHNjcmlwdDogW10sXG4gICAgICAgIHNjcmlwdE1vZHVsZTogW11cbiAgICB9XG4gICAgY2FjaGVDb21waWxlU2NyaXB0OiBhbnkgPSB7fVxuICAgIGNhY2hlQ29tcG9uZW50OiBjYWNoZUNvbXBvbmVudCA9IHt9XG4gICAgY29tcGlsZVJ1blRpbWVTdG9yZTogU3RyaW5nQW55TWFwID0ge31cbiAgICBkZXBlbmRlbmNpZXM6IFN0cmluZ051bWJlck1hcCA9IHt9XG4gICAgcmVjb3JkTmFtZXM6IHN0cmluZ1tdID0gW11cblxuICAgIGdldCBzYWZlRGVidWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlYnVnICYmIHRoaXMuX3NhZmVEZWJ1ZztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBmdWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgdHlwZU5hbWU6IHN0cmluZywgcHVibGljIGRlYnVnOiBib29sZWFuLCBwcml2YXRlIF9zYWZlRGVidWc6IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICBzdHlsZSh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zdHlsZVVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc3R5bGVVUkxTZXQucHVzaCh7IHVybCwgYXR0cmlidXRlcyB9KTtcbiAgICB9XG5cbiAgICBzY3JpcHQodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc2NyaXB0VVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zY3JpcHRVUkxTZXQucHVzaCh7IHVybCwgYXR0cmlidXRlcyB9KTtcbiAgICB9XG5cbiAgICByZWNvcmQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyhuYW1lKSlcbiAgICAgICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBhc3luYyBkZXBlbmRlbmNlKHNtYWxsUGF0aDogc3RyaW5nLCBmdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc21hbGxQYXRoKSB7XG4gICAgICAgIGlmICh0aGlzLmRlcGVuZGVuY2llc1tzbWFsbFBhdGhdKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZURlcCA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3Q7XG4gICAgICAgIGlmIChoYXZlRGVwKSB7XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llc1tzbWFsbFBhdGhdID0gaGF2ZURlcFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRTY3JpcHRTdHlsZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgc21hbGxQYXRoID0gdGhpcy5zbWFsbFBhdGgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmluU2NyaXB0U3R5bGUuZmluZCh4ID0+IHgudHlwZSA9PSB0eXBlICYmIHgucGF0aCA9PSBzbWFsbFBhdGgpO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSB7IHR5cGUsIHBhdGg6IHNtYWxsUGF0aCwgdmFsdWU6IG5ldyBTb3VyY2VNYXBTdG9yZShzbWFsbFBhdGgsIHRoaXMuc2FmZURlYnVnLCB0eXBlID09ICdzdHlsZScsIHRydWUpIH1cbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGEudmFsdWVcbiAgICB9XG5cbiAgICBhZGRTY3JpcHRTdHlsZVBhZ2UodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgaW5mbzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY3JpcHRTdHlsZSh0eXBlLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdwYWdlJykgPyB0aGlzLnNtYWxsUGF0aCA6IGluZm8uZXh0cmFjdEluZm8oKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVOYW1lKHRleHQ6IHN0cmluZykge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU3RhdGljRmlsZXNJbmZvLnN0b3JlKTtcbiAgICAgICAgd2hpbGUgKGtleSA9PSBudWxsIHx8IHZhbHVlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSBCYXNlNjRJZCh0ZXh0LCA1ICsgbGVuZ3RoKS5zdWJzdHJpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEhlYWRUYWdzKCkge1xuICAgICAgICBjb25zdCBpc0xvZ3MgPSB0aGlzLnR5cGVOYW1lID09IGdldFR5cGVzLkxvZ3NbMl1cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUxvY2F0aW9uID0gaS5wYXRoID09IHRoaXMuc21hbGxQYXRoICYmIGlzTG9ncyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV0sIGFkZFF1ZXJ5ID0gaXNMb2dzID8gJz90PWwnIDogJyc7XG4gICAgICAgICAgICBsZXQgdXJsID0gU3RhdGljRmlsZXNJbmZvLmhhdmUoaS5wYXRoLCAoKSA9PiBTZXNzaW9uQnVpbGQuY3JlYXRlTmFtZShpLnBhdGgpKSArICcucHViJztcblxuICAgICAgICAgICAgc3dpdGNoIChpLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IGRlZmVyOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLm1qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IHR5cGU6ICdtb2R1bGUnIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0eWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuY3NzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZSgnLycgKyB1cmwgKyBhZGRRdWVyeSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEVhc3lGcy53cml0ZUZpbGUoc2F2ZUxvY2F0aW9uICsgdXJsLCBpLnZhbHVlLmNyZWF0ZURhdGFXaXRoTWFwKCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZEhlYWQoKSB7XG4gICAgICAgIHRoaXMuYWRkSGVhZFRhZ3MoKTtcblxuICAgICAgICBjb25zdCBtYWtlQXR0cmlidXRlcyA9IChpOiBzZXREYXRhSFRNTFRhZykgPT4gaS5hdHRyaWJ1dGVzID8gJyAnICsgT2JqZWN0LmtleXMoaS5hdHRyaWJ1dGVzKS5tYXAoeCA9PiBpLmF0dHJpYnV0ZXNbeF0gPyB4ICsgYD1cIiR7aS5hdHRyaWJ1dGVzW3hdfVwiYCA6IHgpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgICAgIGNvbnN0IGFkZFR5cGVJbmZvID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdID8gJz90PWwnIDogJyc7XG4gICAgICAgIGxldCBidWlsZEJ1bmRsZVN0cmluZyA9ICcnOyAvLyBhZGQgc2NyaXB0cyBhZGQgY3NzXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnN0eWxlVVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtpLnVybCArIGFkZFR5cGVJbmZvfVwiJHttYWtlQXR0cmlidXRlcyhpKX0vPmA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNjcmlwdFVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8c2NyaXB0IHNyYz1cIiR7aS51cmwgKyBhZGRUeXBlSW5mb31cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Pjwvc2NyaXB0PmA7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkQnVuZGxlU3RyaW5nICsgdGhpcy5oZWFkSFRNTDtcbiAgICB9XG5cbiAgICBleHRlbmRzKGZyb206IFNlc3Npb25CdWlsZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3RvckFycmF5LnB1c2goLi4uZnJvbS5jb25uZWN0b3JBcnJheSk7XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goLi4uZnJvbS5zY3JpcHRVUkxTZXQpO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goLi4uZnJvbS5zdHlsZVVSTFNldCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGZyb20uaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goeyAuLi5pLCB2YWx1ZTogaS52YWx1ZS5jbG9uZSgpIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3B5T2JqZWN0cyA9IFsnY2FjaGVDb21waWxlU2NyaXB0JywgJ2NhY2hlQ29tcG9uZW50JywgJ2RlcGVuZGVuY2llcyddO1xuXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb3B5T2JqZWN0cykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzW2NdLCBmcm9tW2NdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaCguLi5mcm9tLnJlY29yZE5hbWVzLmZpbHRlcih4ID0+ICF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKHgpKSk7XG5cbiAgICAgICAgdGhpcy5oZWFkSFRNTCArPSBmcm9tLmhlYWRIVE1MO1xuICAgICAgICB0aGlzLmNhY2hlLnN0eWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0LnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHQpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdE1vZHVsZS5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0TW9kdWxlKTtcbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJbXBvcnRGaWxlIH0gZnJvbSBcIi4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMsIHsgRGlyZW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tIFwiLi9Db21waWxlU3RhdGVcIjtcbmltcG9ydCB7IGlzRmlsZVR5cGUgfSBmcm9tIFwiLi9GaWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPVtdO1xuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNjYW5GaWxlcygpe1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5TdGF0aWMsICcnLCBzdGF0ZSksXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuTG9ncywgJycsIHN0YXRlKVxuICAgIF0pXG4gICAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVidWdTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3Mpe1xuICAgIHJldHVybiBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgYXdhaXQgc2NhbkZpbGVzKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgeyByb3V0aW5nLCBkZXZlbG9wbWVudCB9ID0gRXhwb3J0O1xuICAgIGlmICghcm91dGluZy5zaXRlbWFwKSByZXR1cm47XG5cbiAgICBjb25zdCBzaXRlbWFwID0gcm91dGluZy5zaXRlbWFwID09PSB0cnVlID8ge30gOiByb3V0aW5nLnNpdGVtYXA7XG4gICAgT2JqZWN0LmFzc2lnbihzaXRlbWFwLCB7XG4gICAgICAgIHJ1bGVzOiB0cnVlLFxuICAgICAgICB1cmxTdG9wOiBmYWxzZSxcbiAgICAgICAgZXJyb3JQYWdlczogZmFsc2UsXG4gICAgICAgIHZhbGlkUGF0aDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFnZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICB1cmxzOiAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBmb3IgKGxldCBbdXJsLCB0eXBlXSBvZiBzdGF0ZS5wYWdlcykge1xuXG4gICAgICAgIGlmKHR5cGUgIT0gZ2V0VHlwZXMuU3RhdGljWzJdIHx8ICF1cmwuZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB1cmwgPSAnLycgKyB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmKHBhdGguZXh0bmFtZSh1cmwpID09ICcuc2VydicpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC51cmxTdG9wKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpdGVtYXAucnVsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGF3YWl0IHJvdXRpbmcucnVsZXNbcGF0aF0odXJsKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGVuZHMgPT4gdXJsLmVuZHNXaXRoKCcuJytlbmRzKSkgfHxcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChzdGFydCA9PiB1cmwuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHJvdXRpbmcudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhd2FpdCBmdW5jKHVybCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpdGVtYXAuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlcnJvciBpbiByb3V0aW5nLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gJy8nICsgcm91dGluZy5lcnJvclBhZ2VzW2Vycm9yXS5wYXRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VzLnB1c2godXJsKTtcbiAgICB9XG5cbiAgICBsZXQgd3JpdGUgPSB0cnVlO1xuICAgIGlmIChzaXRlbWFwLmZpbGUpIHtcbiAgICAgICAgY29uc3QgZmlsZUFjdGlvbiA9IGF3YWl0IEltcG9ydEZpbGUoJ1NpdGVtYXAgSW1wb3J0Jywgc2l0ZW1hcC5maWxlLCBnZXRUeXBlcy5TdGF0aWMsIGRldmVsb3BtZW50KTtcbiAgICAgICAgaWYoIWZpbGVBY3Rpb24/LlNpdGVtYXApe1xuICAgICAgICAgICAgZHVtcC53YXJuKCdcXCdTaXRlbWFwXFwnIGZ1bmN0aW9uIG5vdCBmb3VuZCBvbiBmaWxlIC0+ICcrIHNpdGVtYXAuZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3cml0ZSA9IGF3YWl0IGZpbGVBY3Rpb24uU2l0ZW1hcChwYWdlcywgc3RhdGUsIEV4cG9ydCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZih3cml0ZSAmJiBwYWdlcy5sZW5ndGgpe1xuICAgICAgICBjb25zdCBwYXRoID0gd3JpdGUgPT09IHRydWUgPyAnc2l0ZW1hcC50eHQnOiB3cml0ZTtcbiAgICAgICAgc3RhdGUuYWRkRmlsZShwYXRoKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShnZXRUeXBlcy5TdGF0aWNbMF0gKyBwYXRoLCBwYWdlcy5qb2luKCdcXG4nKSk7XG4gICAgfVxufSIsICIvKipcbiAqIENoZWNrIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gZmlsZSB0eXBlcy5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVzIC0gYW4gYXJyYXkgb2YgZmlsZSBleHRlbnNpb25zIHRvIG1hdGNoLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZVR5cGUodHlwZXM6IHN0cmluZ1tdLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCcuJyArIHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsYXN0IGRvdCBhbmQgZXZlcnl0aGluZyBhZnRlciBpdCBmcm9tIGEgc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byByZW1vdmUgdGhlIGVuZCB0eXBlIGZyb20uXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGhvdXQgdGhlIGxhc3QgY2hhcmFjdGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUmVtb3ZlRW5kVHlwZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBGaWxlcyB9IGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4Jztcbi8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuXG5jb25zdCBFeHBvcnQgPSB7XG4gICAgUGFnZUxvYWRSYW06IHt9LFxuICAgIFBhZ2VSYW06IHRydWVcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSB0eXBlQXJyYXkgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoIHRvIHRoZVxuICogZmlsZS5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgZGljdGlvbmFyeSBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7YW55fSBEYXRhT2JqZWN0IC0gVGhlIGRhdGEgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVQYWdlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBSZXFGaWxlUGF0aCA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcbiAgICBjb25zdCByZXNNb2RlbCA9ICgpID0+IFJlcUZpbGVQYXRoLm1vZGVsKERhdGFPYmplY3QpO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBpZiAoUmVxRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKCFEYXRhT2JqZWN0LmlzRGVidWcpXG4gICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcblxuICAgICAgICBpZiAoUmVxRmlsZVBhdGguZGF0ZSA9PSAtMSkge1xuICAgICAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKFJlcUZpbGVQYXRoLnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWZpbGVFeGlzdHMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICghZXh0bmFtZSkge1xuICAgICAgICBleHRuYW1lID0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgZmlsZVBhdGggKz0gJy4nICsgZXh0bmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFBhdGg6IHN0cmluZztcbiAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFsxXSA9PSAnLycpXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlUGF0aClcbiAgICB9IGVsc2VcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoIVtCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnRdLmluY2x1ZGVzKGV4dG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICBEYXRhT2JqZWN0LndyaXRlKGltcG9ydFRleHQpO1xuICAgICAgICByZXR1cm4gaW1wb3J0VGV4dDtcbiAgICB9XG5cbiAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCk7XG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtjb3B5UGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgfSlcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogKCkgPT4geyB9LCBkYXRlOiAtMSwgcGF0aDogZnVsbFBhdGggfTtcbiAgICAgICAgcmV0dXJuIExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBGb3JTYXZlUGF0aCA9IHR5cGVBcnJheVsyXSArICcvJyArIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSBleHRuYW1lLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IHJlQnVpbGQgPSBEYXRhT2JqZWN0LmlzRGVidWcgJiYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKEZvclNhdmVQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoZmlsZVBhdGgsIHR5cGVBcnJheSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdICYmICFyZUJ1aWxkKSB7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF1bMF0gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbChEYXRhT2JqZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jID0gYXdhaXQgTG9hZFBhZ2UoRm9yU2F2ZVBhdGgsIGV4dG5hbWUpO1xuICAgIGlmIChFeHBvcnQuUGFnZVJhbSkge1xuICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdWzBdID0gZnVuYztcbiAgICB9XG5cbiAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBmdW5jIH07XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMoRGF0YU9iamVjdCk7XG59XG5cbmNvbnN0IEdsb2JhbFZhciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRGdWxsUGF0aENvbXBpbGUodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIHJldHVybiB0eXBlQXJyYXlbMV0gKyBTcGxpdEluZm9bMV0gKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UgKyAnLmNqcyc7XG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIHBhZ2UgdG8gbG9hZC5cbiAqIEBwYXJhbSBleHQgLSBUaGUgZXh0ZW5zaW9uIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlKHVybDogc3RyaW5nLCBleHQgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG5cbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIGNvbnN0IExhc3RSZXF1aXJlID0ge307XG5cbiAgICBmdW5jdGlvbiBfcmVxdWlyZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gUmVxdWlyZUZpbGUocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmNsdWRlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nLCBXaXRoT2JqZWN0ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVQYWdlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgeyAuLi5XaXRoT2JqZWN0LCAuLi5EYXRhT2JqZWN0IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF90cmFuc2ZlcihwOiBzdHJpbmcsIHByZXNlcnZlRm9ybTogYm9vbGVhbiwgd2l0aE9iamVjdDogYW55LCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ID0gJyc7XG5cbiAgICAgICAgaWYgKCFwcmVzZXJ2ZUZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3REYXRhID0gRGF0YU9iamVjdC5SZXF1ZXN0LmJvZHkgPyB7fSA6IG51bGw7XG4gICAgICAgICAgICBEYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFPYmplY3QsXG4gICAgICAgICAgICAgICAgUmVxdWVzdDogeyAuLi5EYXRhT2JqZWN0LlJlcXVlc3QsIGZpbGVzOiB7fSwgcXVlcnk6IHt9LCBib2R5OiBwb3N0RGF0YSB9LFxuICAgICAgICAgICAgICAgIFBvc3Q6IHBvc3REYXRhLCBRdWVyeToge30sIEZpbGVzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgRGF0YU9iamVjdCwgcCwgd2l0aE9iamVjdCk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBTcGxpdEluZm9bMV0gKyBcIi5cIiArIGV4dCArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBkZWJ1Z19fZmlsZW5hbWUgPSB1cmwgKyBcIi5cIiArIGV4dDtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBwYXRoIC0+IFwiLCBkZWJ1Z19fZmlsZW5hbWUsIFwiLT5cIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gYDxkaXYgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPjxwPkVycm9yIHBhdGg6ICR7ZGVidWdfX2ZpbGVuYW1lfTwvcD48cD5FcnJvciBtZXNzYWdlOiAke2UubWVzc2FnZX08L3A+PC9kaXY+YDtcbiAgICB9XG59XG4vKipcbiAqIEl0IHRha2VzIGEgZnVuY3Rpb24gdGhhdCBwcmVwYXJlIGEgcGFnZSwgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIGEgcGFnZVxuICogQHBhcmFtIExvYWRQYWdlRnVuYyAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBpbiBhIHBhZ2UgdG8gZXhlY3V0ZSBvblxuICogQHBhcmFtIHtzdHJpbmd9IHJ1bl9zY3JpcHRfbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY3JpcHQgdG8gcnVuLlxuICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5cbmZ1bmN0aW9uIEJ1aWxkUGFnZShMb2FkUGFnZUZ1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gdm9pZCwgcnVuX3NjcmlwdF9uYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBQYWdlVmFyID0ge307XG5cbiAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChSZXNwb25zZTogUmVzcG9uc2UsIFJlcXVlc3Q6IFJlcXVlc3QsIFBvc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCBudWxsLCBRdWVyeTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgQ29va2llczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgU2Vzc2lvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRmlsZXM6IEZpbGVzLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG91dF9ydW5fc2NyaXB0ID0geyB0ZXh0OiAnJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nSW5mbyhzdHI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgYXNTdHJpbmcgPSBzdHI/LnRvU3RyaW5nPy4oKTtcbiAgICAgICAgICAgIGlmIChhc1N0cmluZyA9PSBudWxsIHx8IGFzU3RyaW5nLnN0YXJ0c1dpdGgoJ1tvYmplY3QgT2JqZWN0XScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0ciwgbnVsbCwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSZXNwb25zZSh0ZXh0OiBhbnkpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0ID0gJycpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlU2FmZShzdHIgPSAnJykge1xuICAgICAgICAgICAgc3RyID0gVG9TdHJpbmdJbmZvKHN0cik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcmIycgKyBpLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlY2hvKGFycjogc3RyaW5nW10sIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFycltpXTtcbiAgICAgICAgICAgICAgICB3cml0ZVNhZmUocGFyYW1zW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnIuYXQoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZGlyZWN0UGF0aDogYW55ID0gZmFsc2U7XG5cbiAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QgPSAocGF0aDogc3RyaW5nLCBzdGF0dXM/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1cyhzdGF0dXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVzcG9uc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+UmVzcG9uc2UpLnJlbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0KFJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGaWxlKGZpbGVQYXRoLCBkZWxldGVBZnRlciA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSB7IGZpbGU6IGZpbGVQYXRoLCBkZWxldGVBZnRlciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRGF0YVNlbmQgPSB7XG4gICAgICAgICAgICBzZW5kRmlsZSxcbiAgICAgICAgICAgIHdyaXRlU2FmZSxcbiAgICAgICAgICAgIHdyaXRlLFxuICAgICAgICAgICAgZWNobyxcbiAgICAgICAgICAgIHNldFJlc3BvbnNlLFxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQsXG4gICAgICAgICAgICBydW5fc2NyaXB0X25hbWUsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBQb3N0LFxuICAgICAgICAgICAgUXVlcnksXG4gICAgICAgICAgICBTZXNzaW9uLFxuICAgICAgICAgICAgRmlsZXMsXG4gICAgICAgICAgICBDb29raWVzLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIFBhZ2VWYXIsXG4gICAgICAgICAgICBHbG9iYWxWYXIsXG4gICAgICAgICAgICBjb2RlYmFzZTogJydcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IExvYWRQYWdlRnVuYyhEYXRhU2VuZCk7XG5cbiAgICAgICAgcmV0dXJuIHsgb3V0X3J1bl9zY3JpcHQ6IG91dF9ydW5fc2NyaXB0LnRleHQsIHJlZGlyZWN0UGF0aCB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHsgTG9hZFBhZ2UsIEJ1aWxkUGFnZSwgZ2V0RnVsbFBhdGhDb21waWxlLCBFeHBvcnQsIFNwbGl0Rmlyc3QgfTsiLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSwgQWRkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxudHlwZSBSZXF1aXJlRmlsZXMgPSB7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgc3RhdHVzPzogbnVtYmVyXG4gICAgbW9kZWw6IGFueVxuICAgIGRlcGVuZGVuY2llcz86IFN0cmluZ0FueU1hcFxuICAgIHN0YXRpYz86IGJvb2xlYW5cbn1cblxuY29uc3QgQ2FjaGVSZXF1aXJlRmlsZXMgPSB7fTtcblxuLyoqXG4gKiBJdCBtYWtlcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gZGVwZW5kZW5jaWVzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgYXJyYXkgb2YgYmFzZSBwYXRoc1xuICogQHBhcmFtIFtiYXNlUGF0aF0gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGNvbXBpbGVkLlxuICogQHBhcmFtIGNhY2hlIC0gQSBjYWNoZSBvZiB0aGUgbGFzdCB0aW1lIGEgZmlsZSB3YXMgbW9kaWZpZWQuXG4gKiBAcmV0dXJucyBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBTdHJpbmdBbnlNYXAsIHR5cGVBcnJheTogc3RyaW5nW10sIGJhc2VQYXRoID0gJycsIGNhY2hlID0ge30pIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNYXA6IFN0cmluZ0FueU1hcCA9IHt9O1xuICAgIGNvbnN0IHByb21pc2VBbGwgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgcHJvbWlzZUFsbC5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGggPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgICAgIGlmICghY2FjaGVbYmFzZVBhdGhdKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlUGF0aF0gPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBiYXNlUGF0aCwgJ210aW1lTXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbJ3RoaXNGaWxlJ10gPSBjYWNoZVtiYXNlUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFtmaWxlUGF0aF0gPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKDxhbnk+dmFsdWUsIHR5cGVBcnJheSwgZmlsZVBhdGgsIGNhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICApKCkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VBbGwpO1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNYXA7XG59XG5cbi8qKlxuICogSWYgdGhlIG9sZCBkZXBlbmRlbmNpZXMgYW5kIHRoZSBuZXcgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZSwgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmN5IG1hcC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkZXBlbmRlbmN5IHRyZWVzLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIHRoZSBtb2R1bGVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBbcGFyZW50XSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJlbnQgbW9kdWxlLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLiBFYWNoIHN0cmluZyByZXByZXNlbnRzIGEgY2hhbmdlIGluIHRoZSBkZXBlbmRlbmN5XG4gKiB0cmVlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VBcnJheShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCwgcGFyZW50ID0gJycpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgY2hhbmdlQXJyYXkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW5ld0RlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGdldENoYW5nZUFycmF5KG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0sIG5hbWUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaCguLi5jaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZUFycmF5O1xufVxuXG4vKipcbiAqIEl0IGltcG9ydHMgYSBmaWxlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIHBhdGhzIHR5cGVzLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBtYXAgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuXG4gKiBAcmV0dXJucyBUaGUgbW9kZWwgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogUmVxdWlyZUZpbGVzIH0sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBSZXFGaWxlID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IG51bWJlciwgbmV3RGVwczogU3RyaW5nQW55TWFwO1xuICAgIGlmIChSZXFGaWxlKSB7XG5cbiAgICAgICAgaWYgKCFpc0RlYnVnIHx8IGlzRGVidWcgJiYgKFJlcUZpbGUuc3RhdHVzID09IC0xKSlcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBSZXFGaWxlLnBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG5cbiAgICAgICAgICAgIG5ld0RlcHMgPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpO1xuXG4gICAgICAgICAgICBpZiAoY29tcGFyZURlcGVuZGVuY2llc1NhbWUoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoUmVxRmlsZS5zdGF0dXMgPT0gMClcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IHN0YXRpY19tb2R1bGVzID0gZmFsc2U7XG5cbiAgICBpZiAoIVJlcUZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJykge1xuXG4gICAgICAgICAgICBpZiAoZmlsZVBhdGhbMV0gPT0gJy8nKVxuICAgICAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xuXG4gICAgICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSwgX19kaXJuYW1lKSwgZmlsZVBhdGgpO1xuICAgICAgICB9IGVsc2UgaWYgKGZpbGVQYXRoWzBdICE9ICcvJylcbiAgICAgICAgICAgIHN0YXRpY19tb2R1bGVzID0gdHJ1ZTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoID0gUmVxRmlsZS5wYXRoO1xuICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IFJlcUZpbGUuc3RhdGljO1xuICAgIH1cblxuICAgIGlmIChzdGF0aWNfbW9kdWxlcylcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgaW1wb3J0KGZpbGVQYXRoKSwgc3RhdHVzOiAtMSwgc3RhdGljOiB0cnVlLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgIGVsc2Uge1xuICAgICAgICAvLyBhZGQgc2Vydi5qcyBvciBzZXJ2LnRzIGlmIG5lZWRlZFxuICAgICAgICBmaWxlUGF0aCA9IEFkZEV4dGVuc2lvbihmaWxlUGF0aCk7XG5cbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSB0eXBlQXJyYXlbMF0gKyBmaWxlUGF0aDtcbiAgICAgICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVNb2RlbCA9IENhY2hlUmVxdWlyZUZpbGVzW2ZpbGVQYXRoXTtcbiAgICAgICAgICAgIGlmIChoYXZlTW9kZWwgJiYgY29tcGFyZURlcGVuZGVuY2llc1NhbWUoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcyA9IG5ld0RlcHMgPz8gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpKSlcbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSBoYXZlTW9kZWw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdEZXBzID0gbmV3RGVwcyA/PyB7fTtcblxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEltcG9ydEZpbGUoX19maWxlbmFtZSwgZmlsZVBhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgbmV3RGVwcywgaGF2ZU1vZGVsICYmIGdldENoYW5nZUFycmF5KGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKSwgZGVwZW5kZW5jaWVzOiBuZXdEZXBzLCBwYXRoOiBmaWxlUGF0aCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiB7fSwgc3RhdHVzOiAwLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2ZpbGVQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWx0TW9kZWwgPSBMYXN0UmVxdWlyZVtjb3B5UGF0aF07XG4gICAgQ2FjaGVSZXF1aXJlRmlsZXNbYnVpbHRNb2RlbC5wYXRoXSA9IGJ1aWx0TW9kZWw7XG5cbiAgICByZXR1cm4gYnVpbHRNb2RlbC5tb2RlbDtcbn0iLCAiaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgdHJpbVR5cGUsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8vIC0tIHN0YXJ0IG9mIGZldGNoIGZpbGUgKyBjYWNoZSAtLVxuXG50eXBlIGFwaUluZm8gPSB7XG4gICAgcGF0aFNwbGl0OiBudW1iZXIsXG4gICAgZGVwc01hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfVxufVxuXG5jb25zdCBhcGlTdGF0aWNNYXA6IHsgW2tleTogc3RyaW5nXTogYXBpSW5mbyB9ID0ge307XG5cbi8qKlxuICogR2l2ZW4gYSB1cmwsIHJldHVybiB0aGUgc3RhdGljIHBhdGggYW5kIGRhdGEgaW5mbyBpZiB0aGUgdXJsIGlzIGluIHRoZSBzdGF0aWMgbWFwXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHRoZSB1c2VyIGlzIHJlcXVlc3RpbmcuXG4gKiBAcGFyYW0ge251bWJlcn0gcGF0aFNwbGl0IC0gdGhlIG51bWJlciBvZiBzbGFzaGVzIGluIHRoZSB1cmwuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICovXG5mdW5jdGlvbiBnZXRBcGlGcm9tTWFwKHVybDogc3RyaW5nLCBwYXRoU3BsaXQ6IG51bWJlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcGlTdGF0aWNNYXApO1xuICAgIGZvciAoY29uc3QgaSBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IGUgPSBhcGlTdGF0aWNNYXBbaV07XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSAmJiBlLnBhdGhTcGxpdCA9PSBwYXRoU3BsaXQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXRpY1BhdGg6IGksXG4gICAgICAgICAgICAgICAgZGF0YUluZm86IGVcbiAgICAgICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIEFQSSBmaWxlIGZvciBhIGdpdmVuIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIEFQSS5cbiAqIEByZXR1cm5zIFRoZSBwYXRoIHRvIHRoZSBBUEkgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZmluZEFwaVBhdGgodXJsOiBzdHJpbmcpIHtcblxuICAgIHdoaWxlICh1cmwubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UGF0aCA9IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMF0sIHVybCArICcuYXBpJyk7XG4gICAgICAgIGNvbnN0IG1ha2VQcm9taXNlID0gYXN5bmMgKHR5cGU6IHN0cmluZykgPT4gKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHN0YXJ0UGF0aCArICcuJyArIHR5cGUpICYmIHR5cGUpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVUeXBlID0gKGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCd0cycpLFxuICAgICAgICAgICAgbWFrZVByb21pc2UoJ2pzJylcbiAgICAgICAgXSkpLmZpbHRlcih4ID0+IHgpLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKGZpbGVUeXBlKVxuICAgICAgICAgICAgcmV0dXJuIHVybCArICcuYXBpLicgKyBmaWxlVHlwZTtcblxuICAgICAgICB1cmwgPSBDdXRUaGVMYXN0KCcvJywgdXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYXRoU3BsaXQgPSB1cmwuc3BsaXQoJy8nKS5sZW5ndGg7XG4gICAgbGV0IHsgc3RhdGljUGF0aCwgZGF0YUluZm8gfSA9IGdldEFwaUZyb21NYXAodXJsLCBwYXRoU3BsaXQpO1xuXG4gICAgaWYgKCFkYXRhSW5mbykge1xuICAgICAgICBzdGF0aWNQYXRoID0gYXdhaXQgZmluZEFwaVBhdGgodXJsKTtcblxuICAgICAgICBpZiAoc3RhdGljUGF0aCkge1xuICAgICAgICAgICAgZGF0YUluZm8gPSB7XG4gICAgICAgICAgICAgICAgcGF0aFNwbGl0LFxuICAgICAgICAgICAgICAgIGRlcHNNYXA6IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFwaVN0YXRpY01hcFtzdGF0aWNQYXRoXSA9IGRhdGFJbmZvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGFJbmZvKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBNYWtlQ2FsbChcbiAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVGaWxlKCcvJyArIHN0YXRpY1BhdGgsICdhcGktY2FsbCcsICcnLCBnZXRUeXBlcy5TdGF0aWMsIGRhdGFJbmZvLmRlcHNNYXAsIGlzRGVidWcpLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgdXJsLnN1YnN0cmluZyhzdGF0aWNQYXRoLmxlbmd0aCAtIDYpLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIG5leHRQcmFzZVxuICAgICAgICApO1xuICAgIH1cbn1cbi8vIC0tIGVuZCBvZiBmZXRjaCBmaWxlIC0tXG5jb25zdCBiYW5Xb3JkcyA9IFsndmFsaWRhdGVVUkwnLCAndmFsaWRhdGVGdW5jJywgJ2Z1bmMnLCAnZGVmaW5lJywgLi4uaHR0cC5NRVRIT0RTXTtcbi8qKlxuICogRmluZCB0aGUgQmVzdCBQYXRoXG4gKi9cbmZ1bmN0aW9uIGZpbmRCZXN0VXJsT2JqZWN0KG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcpIHtcbiAgICBsZXQgbWF4TGVuZ3RoID0gMCwgdXJsID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGkubGVuZ3RoO1xuICAgICAgICBpZiAobWF4TGVuZ3RoIDwgbGVuZ3RoICYmIHVybEZyb20uc3RhcnRzV2l0aChpKSAmJiAhYmFuV29yZHMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHVybCA9IGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFBhcnNlIEFuZCBWYWxpZGF0ZSBVUkxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VVUkxEYXRhKHZhbGlkYXRlOiBhbnksIHZhbHVlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGxldCBwdXNoRGF0YSA9IHZhbHVlLCByZXNEYXRhID0gdHJ1ZSwgZXJyb3I6IHN0cmluZztcblxuICAgIHN3aXRjaCAodmFsaWRhdGUpIHtcbiAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgIGNhc2UgcGFyc2VGbG9hdDpcbiAgICAgICAgY2FzZSBwYXJzZUludDpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gKDxhbnk+dmFsaWRhdGUpKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSAhaXNOYU4ocHVzaERhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gdmFsdWUgIT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSB2YWx1ZSA9PSAndHJ1ZScgfHwgdmFsdWUgPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhbnknOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxpZGF0ZSkpXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLmluY2x1ZGVzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFrZVZhbGlkID0gYXdhaXQgdmFsaWRhdGUodmFsdWUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ha2VWYWxpZCAmJiB0eXBlb2YgbWFrZVZhbGlkID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkLnZhbGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaERhdGEgPSBtYWtlVmFsaWQucGFyc2UgPz8gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZDtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yLCBmaWxlZCAtICcgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS50ZXN0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc0RhdGEpXG4gICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRlIGZpbGVkIC0gJyArIHZhbHVlO1xuXG4gICAgcmV0dXJuIFtlcnJvciwgcHVzaERhdGFdO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIHRoZSBVUkwgZGF0YSBhbmQgcGFyc2VzIGl0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IG9iaiAtIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgVVJMIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gVGhlIFVSTCB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSB7YW55fSBkZWZpbmVPYmplY3QgLSBBbGwgdGhlIGRlZmluaXRpb25zIHRoYXQgaGFzIGJlZW4gZm91bmRcbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSBtYWtlTWFzc2FnZSAtIENyZWF0ZSBhbiBlcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBwcm9wZXJ0eS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlZmluaXRpb24ob2JqOiBhbnksIHVybEZyb206IHN0cmluZywgZGVmaW5lT2JqZWN0OiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGlmICghb2JqLmRlZmluZSlcbiAgICAgICAgcmV0dXJuIHVybEZyb207XG5cbiAgICBjb25zdCB2YWxpZGF0ZUZ1bmMgPSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcbiAgICBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYyA9IG51bGw7XG4gICAgZGVsZXRlIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9iai5kZWZpbmUpIHtcbiAgICAgICAgY29uc3QgW2RhdGFTbGFzaCwgbmV4dFVybEZyb21dID0gU3BsaXRGaXJzdCgnLycsIHVybEZyb20pO1xuICAgICAgICB1cmxGcm9tID0gbmV4dFVybEZyb207XG5cbiAgICAgICAgY29uc3QgW2Vycm9yLCBuZXdEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YShvYmouZGVmaW5lW25hbWVdLCBkYXRhU2xhc2gsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgaWYoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgXG4gICAgICAgIGRlZmluZU9iamVjdFtuYW1lXSA9IG5ld0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgdmFsaWRhdGVGdW5jKGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycgPyB2YWxpZGF0ZTogJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJ307XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybEZyb207XG59XG4vKipcbiAqIFRoZSBmdW5jdGlvbiB3aWxsIHBhcnNlIHRoZSB1cmwgYW5kIGZpbmQgdGhlIGJlc3QgbWF0Y2ggZm9yIHRoZSB1cmxcbiAqIEBwYXJhbSB7YW55fSBmaWxlTW9kdWxlIC0gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRob2QgdGhhdCB5b3Ugd2FudCB0byBjYWxsLlxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSB0aGUgdXJsIHRoYXQgdGhlIHVzZXIgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSAoKSA9PiBQcm9taXNlPGFueT5cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSwgdGhlIHJlcXVlc3QgaXMgcHJvY2Vzc2VkLiBJZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgZmFsc2UsIHRoZSByZXF1ZXN0IGlzIG5vdCBwcm9jZXNzZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIE1ha2VDYWxsKGZpbGVNb2R1bGU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxsb3dFcnJvckluZm8gPSAhR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpICYmIGlzRGVidWcsIG1ha2VNYXNzYWdlID0gKGU6IGFueSkgPT4gKGlzRGVidWcgPyBwcmludC5lcnJvcihlKSA6IG51bGwpICsgKGFsbG93RXJyb3JJbmZvID8gYCwgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCA6ICcnKTtcbiAgICBjb25zdCBtZXRob2QgPSBSZXF1ZXN0Lm1ldGhvZDtcbiAgICBsZXQgbWV0aG9kT2JqID0gZmlsZU1vZHVsZVttZXRob2RdIHx8IGZpbGVNb2R1bGUuZGVmYXVsdFttZXRob2RdOyAvL0xvYWRpbmcgdGhlIG1vZHVsZSBieSBtZXRob2RcbiAgICBsZXQgaGF2ZU1ldGhvZCA9IHRydWU7XG5cbiAgICBpZighbWV0aG9kT2JqKXtcbiAgICAgICAgaGF2ZU1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBtZXRob2RPYmogPSBmaWxlTW9kdWxlLmRlZmF1bHQgfHwgZmlsZU1vZHVsZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlTWV0aG9kID0gbWV0aG9kT2JqO1xuXG4gICAgY29uc3QgZGVmaW5lT2JqZWN0ID0ge307XG5cbiAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7IC8vIHJvb3QgbGV2ZWwgZGVmaW5pdGlvblxuICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuXG4gICAgbGV0IG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSk7XG5cbiAgICAvL3BhcnNlIHRoZSB1cmwgcGF0aFxuICAgIGZvcihsZXQgaSA9IDA7IGk8IDI7IGkrKyl7XG4gICAgICAgIHdoaWxlICgobmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcbiAgICAgICAgICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICAgICAgICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG4gICAgXG4gICAgICAgICAgICB1cmxGcm9tID0gdHJpbVR5cGUoJy8nLCB1cmxGcm9tLnN1YnN0cmluZyhuZXN0ZWRVUkwubGVuZ3RoKSk7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbmVzdGVkVVJMXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFoYXZlTWV0aG9kKXsgLy8gY2hlY2sgaWYgdGhhdCBhIG1ldGhvZFxuICAgICAgICAgICAgaGF2ZU1ldGhvZCA9IHRydWU7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9iaj8uZnVuYyAmJiBtZXRob2RPYmogfHwgYmFzZU1ldGhvZDsgLy8gaWYgdGhlcmUgaXMgYW4gJ2FueScgbWV0aG9kXG5cblxuICAgIGlmICghbWV0aG9kT2JqPy5mdW5jKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsZWZ0RGF0YSA9IHVybEZyb20uc3BsaXQoJy8nKTtcbiAgICBjb25zdCB1cmxEYXRhID0gW107XG5cblxuICAgIGxldCBlcnJvcjogc3RyaW5nO1xuICAgIGlmIChtZXRob2RPYmoudmFsaWRhdGVVUkwpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHZhbGlkYXRlXSBvZiBPYmplY3QuZW50cmllcyhtZXRob2RPYmoudmFsaWRhdGVVUkwpKSB7XG4gICAgICAgICAgICBjb25zdCBbZXJyb3JVUkwsIHB1c2hEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YSh2YWxpZGF0ZSwgbGVmdERhdGFbaW5kZXhdLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JVUkwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IDxzdHJpbmc+ZXJyb3JVUkw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybERhdGEucHVzaChwdXNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdXJsRGF0YS5wdXNoKC4uLmxlZnREYXRhKTtcblxuICAgIGlmICghZXJyb3IgJiYgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYyhsZWZ0RGF0YSwgUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZTtcbiAgICAgICAgZWxzZSBpZiAoIXZhbGlkYXRlKVxuICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGluZyBVUkwnO1xuICAgIH1cblxuICAgIGlmIChlcnJvcilcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvciB9KTtcblxuICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGxldCBhcGlSZXNwb25zZTogYW55LCBuZXdSZXNwb25zZTogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGFwaVJlc3BvbnNlID0gYXdhaXQgbWV0aG9kT2JqLmZ1bmMoUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEsIGRlZmluZU9iamVjdCwgbGVmdERhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGFsbG93RXJyb3JJbmZvKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiBlLm1lc3NhZ2UgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6ICc1MDAgLSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhcGlSZXNwb25zZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyB0ZXh0OiBhcGlSZXNwb25zZSB9O1xuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSBhcGlSZXNwb25zZTtcblxuICAgIGZpbmFsU3RlcCgpOyAgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgaWYgKG5ld1Jlc3BvbnNlICE9IG51bGwpXG4gICAgICAgIFJlc3BvbnNlLmpzb24obmV3UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5nc30gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIGFzIEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBHZXRGaWxlIGFzIEdldFN0YXRpY0ZpbGUsIHNlcnZlckJ1aWxkIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCAqIGFzIEZ1bmNTY3JpcHQgZnJvbSAnLi9GdW5jdGlvblNjcmlwdCc7XG5pbXBvcnQgTWFrZUFwaUNhbGwgZnJvbSAnLi9BcGlDYWxsJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuY29uc3QgeyBFeHBvcnQgfSA9IEZ1bmNTY3JpcHQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JQYWdlcyB7XG4gICAgbm90Rm91bmQ/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH0sXG4gICAgc2VydmVyRXJyb3I/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH1cbn1cblxuaW50ZXJmYWNlIEdldFBhZ2VzU2V0dGluZ3Mge1xuICAgIENhY2hlRGF5czogbnVtYmVyLFxuICAgIFBhZ2VSYW06IGJvb2xlYW4sXG4gICAgRGV2TW9kZTogYm9vbGVhbixcbiAgICBDb29raWVTZXR0aW5ncz86IGFueSxcbiAgICBDb29raWVzPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgQ29va2llRW5jcnlwdGVyPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgU2Vzc2lvblN0b3JlPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgRXJyb3JQYWdlczogRXJyb3JQYWdlc1xufVxuXG5jb25zdCBTZXR0aW5nczogR2V0UGFnZXNTZXR0aW5ncyA9IHtcbiAgICBDYWNoZURheXM6IDEsXG4gICAgUGFnZVJhbTogZmFsc2UsXG4gICAgRGV2TW9kZTogdHJ1ZSxcbiAgICBFcnJvclBhZ2VzOiB7fVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZVRvUmFtKHVybDogc3RyaW5nKSB7XG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bmNTY3JpcHQuZ2V0RnVsbFBhdGhDb21waWxlKHVybCkpKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdID0gW107XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdID0gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZSh1cmwpO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdLCB1cmwpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZEFsbFBhZ2VzVG9SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHBhZ2VEZXBzLnN0b3JlKSB7XG4gICAgICAgIGlmICghRXh0ZW5zaW9uSW5BcnJheShpLCA8YW55PkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkpKVxuICAgICAgICAgICAgYXdhaXQgTG9hZFBhZ2VUb1JhbShpKTtcblxuICAgIH1cbn1cblxuZnVuY3Rpb24gQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIEV4cG9ydC5QYWdlTG9hZFJhbSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGRlbGV0ZSBFeHBvcnQuUGFnZUxvYWRSYW1baV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBFeHRlbnNpb25JbkFycmF5KGZpbGVQYXRoOiBzdHJpbmcsIC4uLmFycmF5czogc3RyaW5nW10pIHtcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGguc3Vic3RyaW5nKGZpbGVQYXRoLmxlbmd0aCAtIGkubGVuZ3RoIC0gMSkgPT0gJy4nICsgaSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gR2V0RXJyb3JQYWdlKGNvZGU6IG51bWJlciwgTG9jU2V0dGluZ3M6ICdub3RGb3VuZCcgfCAnc2VydmVyRXJyb3InKSB7XG4gICAgbGV0IGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nO1xuICAgIGlmIChTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXSkge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWM7XG4gICAgICAgIHVybCA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLnBhdGg7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5jb2RlID8/IGNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuTG9ncztcbiAgICAgICAgdXJsID0gJ2UnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdXJsLCBhcnJheVR5cGUsIGNvZGUgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGNvZGU6IG51bWJlcikge1xuICAgIC8vZmlyc3Qgc3RlcCAtIHBhcnNlIGluZm9cbiAgICBpZiAoUmVxdWVzdC5tZXRob2QgPT0gXCJQT1NUXCIpIHtcbiAgICAgICAgaWYgKCFSZXF1ZXN0LmJvZHkgfHwgIU9iamVjdC5rZXlzKFJlcXVlc3QuYm9keSkubGVuZ3RoKVxuICAgICAgICAgICAgUmVxdWVzdC5ib2R5ID0gUmVxdWVzdC5maWVsZHMgfHwge307XG5cbiAgICB9IGVsc2VcbiAgICAgICAgUmVxdWVzdC5ib2R5ID0gZmFsc2U7XG5cblxuICAgIGlmIChSZXF1ZXN0LmNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZXMoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZUVuY3J5cHRlcihSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuU2Vzc2lvblN0b3JlKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG5cbiAgICBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgfHwge307XG4gICAgUmVxdWVzdC5maWxlcyA9IFJlcXVlc3QuZmlsZXMgfHwge307XG5cbiAgICBjb25zdCBDb3B5Q29va2llcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzKSk7XG4gICAgUmVxdWVzdC5jb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzO1xuXG4gICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMTtcblxuICAgIC8vc2Vjb25kIHN0ZXBcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAxKVxuICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IGNvZGU7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5zaWduZWRDb29raWVzKSB7Ly91cGRhdGUgY29va2llc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gJ29iamVjdCcgJiYgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9IENvcHlDb29raWVzW2ldIHx8IEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSkgIT0gSlNPTi5zdHJpbmdpZnkoQ29weUNvb2tpZXNbaV0pKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNvb2tpZShpLCBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0sIFNldHRpbmdzLkNvb2tpZVNldHRpbmdzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIENvcHlDb29raWVzKSB7Ly9kZWxldGUgbm90IGV4aXRzIGNvb2tpZXNcbiAgICAgICAgICAgIGlmIChSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jbGVhckNvb2tpZShpKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuXG4vL2ZvciBmaW5hbCBzdGVwXG5mdW5jdGlvbiBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdDogUmVxdWVzdCB8IGFueSkge1xuICAgIGlmICghUmVxdWVzdC5maWxlcykgLy9kZWxldGUgZmlsZXNcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBhcnJQYXRoID0gW11cblxuICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LmZpbGVzKSB7XG5cbiAgICAgICAgY29uc3QgZSA9IFJlcXVlc3QuZmlsZXNbaV07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgaW4gZSkge1xuICAgICAgICAgICAgICAgIGFyclBhdGgucHVzaChlW2FdLmZpbGVwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBhcnJQYXRoLnB1c2goZS5maWxlcGF0aCk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyUGF0aDtcbn1cblxuLy9maW5hbCBzdGVwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVSZXF1ZXN0RmlsZXMoYXJyYXk6IHN0cmluZ1tdKSB7XG4gICAgZm9yKGNvbnN0IGUgaW4gYXJyYXkpXG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNVUkxQYXRoQUZpbGUoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIGNvZGU6IG51bWJlcikge1xuICAgIGxldCBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsyXTtcbiAgICBsZXQgZmlsZSA9IGZhbHNlO1xuXG4gICAgaWYgKGNvZGUgPT0gMjAwKSB7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgdXJsO1xuICAgICAgICAvL2NoZWNrIHRoYXQgaXMgbm90IHNlcnZlciBmaWxlXG4gICAgICAgIGlmIChhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBTZXR0aW5ncy5EZXZNb2RlLCB1cmwpIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIGZpbGUgPSB0cnVlO1xuICAgICAgICBlbHNlICAvLyB0aGVuIGl0IGEgc2VydmVyIHBhZ2Ugb3IgZXJyb3IgcGFnZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZmlsZSwgZnVsbFBhZ2VVcmwgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRMb2FkUGFnZShzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHBhZ2VBcnJheSA9IFthd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHNtYWxsUGF0aCldO1xuXG4gICAgcGFnZUFycmF5WzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UocGFnZUFycmF5WzBdLCBzbWFsbFBhdGgpO1xuXG4gICAgaWYgKFNldHRpbmdzLlBhZ2VSYW0pXG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdID0gcGFnZUFycmF5O1xuXG4gICAgcmV0dXJuIHBhZ2VBcnJheVsxXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRQYWdlVVJMKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgbGV0IGZ1bGxQYWdlVXJsOiBzdHJpbmc7XG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVswXSArIHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuXG4gICAgICAgIHVybCA9IEVycm9yUGFnZS51cmw7XG4gICAgICAgIGFycmF5VHlwZSA9IEVycm9yUGFnZS5hcnJheVR5cGU7XG4gICAgICAgIGNvZGUgPSBFcnJvclBhZ2UuY29kZTtcblxuICAgICAgICBzbWFsbFBhdGggPSBhcnJheVR5cGVbMl0gKyAnLycgKyB1cmw7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gdXJsICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoYXJyYXlUeXBlWzBdICsgZnVsbFBhZ2VVcmwpKVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsxXSArIGZ1bGxQYWdlVXJsICsgJy5janMnO1xuXG4gICAgfSBlbHNlXG4gICAgICAgIGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzFdICsgdXJsICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlICsgJy5janMnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXJyYXlUeXBlLFxuICAgICAgICBmdWxsUGFnZVVybCxcbiAgICAgICAgc21hbGxQYXRoLFxuICAgICAgICBjb2RlLFxuICAgICAgICB1cmxcbiAgICB9XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGxvYWQgdGhlIGR5bmFtaWMgcGFnZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gVGhlIGFycmF5IG9mIHR5cGVzIHRoYXQgdGhlIHBhZ2UgaXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbFBhZ2VVcmwgLSBUaGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNtYWxsUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlIGZpbGUuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFRoZSBzdGF0dXMgY29kZSBvZiB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIFRoZSBEeW5hbWljRnVuYyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byBnZW5lcmF0ZSB0aGUgcGFnZS5cbiAqIFRoZSBjb2RlIGlzIHRoZSBzdGF0dXMgY29kZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBUaGUgZnVsbFBhZ2VVcmwgaXMgdGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGZ1bGxQYWdlVXJsOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBjb25zdCBTZXROZXdVUkwgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gYXdhaXQgQnVpbGRQYWdlVVJMKGFycmF5VHlwZSwgdXJsLCBzbWFsbFBhdGgsIGNvZGUpO1xuICAgICAgICBzbWFsbFBhdGggPSBidWlsZC5zbWFsbFBhdGgsIHVybCA9IGJ1aWxkLnVybCwgY29kZSA9IGJ1aWxkLmNvZGUsIGZ1bGxQYWdlVXJsID0gYnVpbGQuZnVsbFBhZ2VVcmwsIGFycmF5VHlwZSA9IGJ1aWxkLmFycmF5VHlwZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGV0IER5bmFtaWNGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IGFueTtcbiAgICBpZiAoU2V0dGluZ3MuRGV2TW9kZSAmJiBhd2FpdCBTZXROZXdVUkwoKSAmJiBmdWxsUGFnZVVybCkge1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShzbWFsbFBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZSh1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBhcnJheVR5cGUpO1xuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSkge1xuXG4gICAgICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdKSB7XG4gICAgICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVswXSwgc21hbGxQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoU2V0dGluZ3MuUGFnZVJhbSlcbiAgICAgICAgICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV0gPSBEeW5hbWljRnVuYztcblxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cblxuICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0pXG4gICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICBlbHNlIGlmICghU2V0dGluZ3MuUGFnZVJhbSAmJiBhd2FpdCBTZXROZXdVUkwoKSAmJiBmdWxsUGFnZVVybClcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICBlbHNlIHtcbiAgICAgICAgY29kZSA9IFNldHRpbmdzLkVycm9yUGFnZXMubm90Rm91bmQ/LmNvZGUgPz8gNDA0O1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kICYmIEV4cG9ydC5QYWdlTG9hZFJhbVtnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kLnBhdGhdIHx8IEV4cG9ydC5QYWdlTG9hZFJhbVtnZXRUeXBlcy5Mb2dzWzJdICsgJy9lNDA0J107XG5cbiAgICAgICAgaWYgKEVycm9yUGFnZSlcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXJyb3JQYWdlWzFdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgRHluYW1pY0Z1bmMsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGZ1bGxQYWdlVXJsXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBNYWtlUGFnZVJlc3BvbnNlKER5bmFtaWNSZXNwb25zZTogYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aD8uZmlsZSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gUmVzcG9uc2Uub24oJ2ZpbmlzaCcsIHJlcykpO1xuICAgIH0gZWxzZSBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCkge1xuICAgICAgICBSZXNwb25zZS53cml0ZUhlYWQoMzAyLCB7IExvY2F0aW9uOiBEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoIH0pO1xuICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBSZXNQYWdlID0gRHluYW1pY1Jlc3BvbnNlLm91dF9ydW5fc2NyaXB0LnRyaW0oKTtcbiAgICAgICAgaWYgKFJlc1BhZ2UpIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnNlbmQoUmVzUGFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmRlbGV0ZUFmdGVyKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHJlcXVlc3QgaXMgbWFkZSB0byBhIHBhZ2UuIFxuICogSXQgd2lsbCBjaGVjayBpZiB0aGUgcGFnZSBleGlzdHMsIGFuZCBpZiBpdCBkb2VzLCBpdCB3aWxsIHJldHVybiB0aGUgcGFnZS4gXG4gKiBJZiBpdCBkb2VzIG5vdCBleGlzdCwgaXQgd2lsbCByZXR1cm4gYSA0MDQgcGFnZVxuICogQHBhcmFtIHtSZXF1ZXN0IHwgYW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoc1xuICogbG9hZGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIHBhZ2UgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHt7IGZpbGU6IGJvb2xlYW4sIGZ1bGxQYWdlVXJsOiBzdHJpbmcgfX0gRmlsZUluZm8gLSB0aGUgZmlsZSBpbmZvIG9mIHRoZSBwYWdlIHRoYXQgaXMgYmVpbmcgYWN0aXZhdGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBudW1iZXJcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGFmdGVyIHRoZSBkeW5hbWljIHBhZ2VcbiAqIGlzIGxvYWRlZC5cbiAqIEByZXR1cm5zIE5vdGhpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEFjdGl2YXRlUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBGaWxlSW5mbzogYW55LCBjb2RlOiBudW1iZXIsIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgeyBEeW5hbWljRnVuYywgZnVsbFBhZ2VVcmwsIGNvZGU6IG5ld0NvZGUgfSA9IGF3YWl0IEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBGaWxlSW5mby5mdWxsUGFnZVVybCwgRmlsZUluZm8uZnVsbFBhZ2VVcmwgKyAnLycgKyB1cmwsIGNvZGUpO1xuXG4gICAgaWYgKCFmdWxsUGFnZVVybCB8fCAhRHluYW1pY0Z1bmMgJiYgY29kZSA9PSA1MDApXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5zZW5kU3RhdHVzKG5ld0NvZGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuICAgICAgICBjb25zdCBwYWdlRGF0YSA9IGF3YWl0IER5bmFtaWNGdW5jKFJlc3BvbnNlLCBSZXF1ZXN0LCBSZXF1ZXN0LmJvZHksIFJlcXVlc3QucXVlcnksIFJlcXVlc3QuY29va2llcywgUmVxdWVzdC5zZXNzaW9uLCBSZXF1ZXN0LmZpbGVzLCBTZXR0aW5ncy5EZXZNb2RlKTtcbiAgICAgICAgZmluYWxTdGVwKCk7IC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgICAgICBhd2FpdCBNYWtlUGFnZVJlc3BvbnNlKFxuICAgICAgICAgICAgcGFnZURhdGEsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoZSk7XG4gICAgICAgIFJlcXVlc3QuZXJyb3IgPSBlO1xuXG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg1MDAsICdzZXJ2ZXJFcnJvcicpO1xuXG4gICAgICAgIER5bmFtaWNQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRHluYW1pY1BhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55LCB1cmw6IHN0cmluZywgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljLCBjb2RlID0gMjAwKSB7XG4gICAgY29uc3QgRmlsZUluZm8gPSBhd2FpdCBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0LCB1cmwsIGFycmF5VHlwZSwgY29kZSk7XG5cbiAgICBjb25zdCBtYWtlRGVsZXRlQXJyYXkgPSBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdClcblxuICAgIGlmIChGaWxlSW5mby5maWxlKSB7XG4gICAgICAgIFNldHRpbmdzLkNhY2hlRGF5cyAmJiBSZXNwb25zZS5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT1cIiArIChTZXR0aW5ncy5DYWNoZURheXMgKiAyNCAqIDYwICogNjApKTtcbiAgICAgICAgYXdhaXQgR2V0U3RhdGljRmlsZSh1cmwsIFNldHRpbmdzLkRldk1vZGUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0UHJhc2UgPSAoKSA9PiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0LCBSZXNwb25zZSwgY29kZSk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgY29uc3QgaXNBcGkgPSBhd2FpdCBNYWtlQXBpQ2FsbChSZXF1ZXN0LCBSZXNwb25zZSwgdXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBuZXh0UHJhc2UpO1xuICAgIGlmICghaXNBcGkgJiYgIWF3YWl0IEFjdGl2YXRlUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgYXJyYXlUeXBlLCB1cmwsIEZpbGVJbmZvLCBjb2RlLCBuZXh0UHJhc2UpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTsgLy8gZGVsZXRlIGZpbGVzXG59XG5cbmZ1bmN0aW9uIHVybEZpeCh1cmw6IHN0cmluZykge1xuICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmxhc3RJbmRleE9mKCc/JykpIHx8IHVybDtcblxuICAgIGlmICh1cmwgPT0gJy8nKSB7XG4gICAgICAgIHVybCA9ICcvaW5kZXgnO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbn1cblxuZXhwb3J0IHtcbiAgICBTZXR0aW5ncyxcbiAgICBEeW5hbWljUGFnZSxcbiAgICBMb2FkQWxsUGFnZXNUb1JhbSxcbiAgICBDbGVhckFsbFBhZ2VzRnJvbVJhbSxcbiAgICB1cmxGaXgsXG4gICAgR2V0RXJyb3JQYWdlXG59IiwgImltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0ICogYXMgQnVpbGRTZXJ2ZXIgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IGNvb2tpZVBhcnNlciB9IGZyb20gJ0B0aW55aHR0cC9jb29raWUtcGFyc2VyJztcbmltcG9ydCBjb29raWVFbmNyeXB0ZXIgZnJvbSAnY29va2llLWVuY3J5cHRlcic7XG5pbXBvcnQgeyBhbGxvd1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgSW5zZXJ0TW9kZWxzU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IHsgU3RhcnRSZXF1aXJlLCBHZXRTZXR0aW5ncyB9IGZyb20gJy4vSW1wb3J0TW9kdWxlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIFByaW50SWZOZXdTZXR0aW5ncyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBNZW1vcnlTZXNzaW9uIGZyb20gJ21lbW9yeXN0b3JlJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGRlYnVnU2l0ZU1hcCB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TaXRlTWFwJztcbmltcG9ydCB7IHNldHRpbmdzIGFzIGRlZmluZVNldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5cbmNvbnN0XG4gICAgQ29va2llc1NlY3JldCA9IHV1aWR2NCgpLnN1YnN0cmluZygwLCAzMiksXG4gICAgU2Vzc2lvblNlY3JldCA9IHV1aWR2NCgpLFxuICAgIE1lbW9yeVN0b3JlID0gTWVtb3J5U2Vzc2lvbihzZXNzaW9uKSxcblxuICAgIENvb2tpZXNNaWRkbGV3YXJlID0gY29va2llUGFyc2VyKENvb2tpZXNTZWNyZXQpLFxuICAgIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmUgPSBjb29raWVFbmNyeXB0ZXIoQ29va2llc1NlY3JldCwge30pLFxuICAgIENvb2tpZVNldHRpbmdzID0geyBodHRwT25seTogdHJ1ZSwgc2lnbmVkOiB0cnVlLCBtYXhBZ2U6IDg2NDAwMDAwICogMzAgfTtcblxuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZXMgPSA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZUVuY3J5cHRlciA9IDxhbnk+Q29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVTZXR0aW5ncyA9IENvb2tpZVNldHRpbmdzO1xuXG5sZXQgRGV2TW9kZV8gPSB0cnVlLCBjb21waWxhdGlvblNjYW46IFByb21pc2U8KCkgPT4gUHJvbWlzZTx2b2lkPj4sIFNlc3Npb25TdG9yZTtcblxubGV0IGZvcm1pZGFibGVTZXJ2ZXIsIGJvZHlQYXJzZXJTZXJ2ZXI7XG5cbmNvbnN0IHNlcnZlTGltaXRzID0ge1xuICAgIHNlc3Npb25Ub3RhbFJhbU1COiAxNTAsXG4gICAgc2Vzc2lvblRpbWVNaW51dGVzOiA0MCxcbiAgICBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzOiAzMCxcbiAgICBmaWxlTGltaXRNQjogMTAsXG4gICAgcmVxdWVzdExpbWl0TUI6IDRcbn1cblxubGV0IHBhZ2VJblJhbUFjdGl2YXRlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpe1xuICAgIHJldHVybiBwYWdlSW5SYW1BY3RpdmF0ZTtcbn1cblxuY29uc3QgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyA9IFsuLi5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5XTtcbmNvbnN0IGJhc2VWYWxpZFBhdGggPSBbKHBhdGg6IHN0cmluZykgPT4gcGF0aC5zcGxpdCgnLicpLmF0KC0yKSAhPSAnc2VydiddOyAvLyBpZ25vcmluZyBmaWxlcyB0aGF0IGVuZHMgd2l0aCAuc2Vydi4qXG5cbmV4cG9ydCBjb25zdCBFeHBvcnQ6IEV4cG9ydFNldHRpbmdzID0ge1xuICAgIGdldCBzZXR0aW5nc1BhdGgoKSB7XG4gICAgICAgIHJldHVybiB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgXCIvU2V0dGluZ3NcIjtcbiAgICB9LFxuICAgIHNldCBkZXZlbG9wbWVudCh2YWx1ZSkge1xuICAgICAgICBpZihEZXZNb2RlXyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgIERldk1vZGVfID0gdmFsdWU7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uU2NhbiA9IEJ1aWxkU2VydmVyLmNvbXBpbGVBbGwoRXhwb3J0KTtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkRldk1vZGUgPSB2YWx1ZTtcbiAgICAgICAgYWxsb3dQcmludCh2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXQgZGV2ZWxvcG1lbnQoKSB7XG4gICAgICAgIHJldHVybiBEZXZNb2RlXztcbiAgICB9LFxuICAgIG1pZGRsZXdhcmU6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKTogKHJlcTogUmVxdWVzdCwgX3JlczogUmVzcG9uc2U8YW55PiwgbmV4dD86IE5leHRGdW5jdGlvbikgPT4gdm9pZCB7XG4gICAgICAgICAgICByZXR1cm4gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZUVuY3J5cHRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU3RvcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmb3JtaWRhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1pZGFibGVTZXJ2ZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBib2R5UGFyc2VyKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvZHlQYXJzZXJTZXJ2ZXI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlY3JldDoge1xuICAgICAgICBnZXQgY29va2llcygpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzU2VjcmV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU2VjcmV0O1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZ2VuZXJhbDoge1xuICAgICAgICBpbXBvcnRPbkxvYWQ6IFtdLFxuICAgICAgICBzZXQgcGFnZUluUmFtKHZhbHVlKSB7XG4gICAgICAgICAgICBpZihmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSAhPSB2YWx1ZSl7XG4gICAgICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGFzeW5jICgpID0+IChhd2FpdCBjb21waWxhdGlvblNjYW4pPy4oKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlcGFyYXRpb25zID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgICAgICAgICAgICAgIGF3YWl0IHByZXBhcmF0aW9ucz8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlQnlVcmwuTG9hZEFsbFBhZ2VzVG9SYW0oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlQnlVcmwuQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwYWdlSW5SYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBpbGU6IHtcbiAgICAgICAgc2V0IGNvbXBpbGVTeW50YXgodmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXggPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvbXBpbGVTeW50YXgoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGlnbm9yZUVycm9yKHZhbHVlKSB7XG4gICAgICAgICAgICAoPGFueT5QcmludElmTmV3U2V0dGluZ3MpLlByZXZlbnRFcnJvcnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlnbm9yZUVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuICg8YW55PlByaW50SWZOZXdTZXR0aW5ncykuUHJldmVudEVycm9ycztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHBsdWdpbnModmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwbHVnaW5zKCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBkZWZpbmUoKXtcbiAgICAgICAgICAgIHJldHVybiBkZWZpbmVTZXR0aW5ncy5kZWZpbmVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGRlZmluZSh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lU2V0dGluZ3MuZGVmaW5lID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmc6IHtcbiAgICAgICAgcnVsZXM6IHt9LFxuICAgICAgICB1cmxTdG9wOiBbXSxcbiAgICAgICAgdmFsaWRQYXRoOiBiYXNlVmFsaWRQYXRoLFxuICAgICAgICBpZ25vcmVUeXBlczogYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyxcbiAgICAgICAgaWdub3JlUGF0aHM6IFtdLFxuICAgICAgICBzaXRlbWFwOiB0cnVlLFxuICAgICAgICBnZXQgZXJyb3JQYWdlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGVycm9yUGFnZXModmFsdWUpIHtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlTGltaXRzOiB7XG4gICAgICAgIGNhY2hlRGF5czogMyxcbiAgICAgICAgY29va2llc0V4cGlyZXNEYXlzOiAxLFxuICAgICAgICBzZXQgc2Vzc2lvblRvdGFsUmFtTUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRvdGFsUmFtTUIoKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25UaW1lTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRpbWVNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZmlsZUxpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmaWxlTGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHJlcXVlc3RMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICAgICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCByZXF1ZXN0TGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmU6IHtcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgaHR0cDI6IGZhbHNlLFxuICAgICAgICBncmVlbkxvY2s6IHtcbiAgICAgICAgICAgIHN0YWdpbmc6IG51bGwsXG4gICAgICAgICAgICBjbHVzdGVyOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICBhZ2VudDogbnVsbCxcbiAgICAgICAgICAgIGFncmVlVG9UZXJtczogZmFsc2UsXG4gICAgICAgICAgICBzaXRlczogW11cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybWlkYWJsZSgpIHtcbiAgICBmb3JtaWRhYmxlU2VydmVyID0ge1xuICAgICAgICBtYXhGaWxlU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLmZpbGVMaW1pdE1CICogMTA0ODU3NixcbiAgICAgICAgdXBsb2FkRGlyOiBTeXN0ZW1EYXRhICsgXCIvVXBsb2FkRmlsZXMvXCIsXG4gICAgICAgIG11bHRpcGxlczogdHJ1ZSxcbiAgICAgICAgbWF4RmllbGRzU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICogMTA0ODU3NlxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJvZHlQYXJzZXIoKSB7XG4gICAgYm9keVBhcnNlclNlcnZlciA9ICg8YW55PmJvZHlQYXJzZXIpLmpzb24oeyBsaW1pdDogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICsgJ21iJyB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZXNzaW9uKCkge1xuICAgIGlmICghRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyB8fCAhRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CKSB7XG4gICAgICAgIFNlc3Npb25TdG9yZSA9IChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2Vzc2lvblN0b3JlID0gc2Vzc2lvbih7XG4gICAgICAgIGNvb2tpZTogeyBtYXhBZ2U6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgKiA2MCAqIDEwMDAsIHNhbWVTaXRlOiB0cnVlIH0sXG4gICAgICAgIHNlY3JldDogU2Vzc2lvblNlY3JldCxcbiAgICAgICAgcmVzYXZlOiBmYWxzZSxcbiAgICAgICAgc2F2ZVVuaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzdG9yZTogbmV3IE1lbW9yeVN0b3JlKHtcbiAgICAgICAgICAgIGNoZWNrUGVyaW9kOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgIG1heDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CICogMTA0ODU3NlxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb3B5SlNPTih0bzogYW55LCBqc29uOiBhbnksIHJ1bGVzOiBzdHJpbmdbXSA9IFtdLCBydWxlc1R5cGU6ICdpZ25vcmUnIHwgJ29ubHknID0gJ2lnbm9yZScpIHtcbiAgICBpZighanNvbikgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBoYXNJbXBsZWF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGkgaW4ganNvbikge1xuICAgICAgICBjb25zdCBpbmNsdWRlID0gcnVsZXMuaW5jbHVkZXMoaSk7XG4gICAgICAgIGlmIChydWxlc1R5cGUgPT0gJ29ubHknICYmIGluY2x1ZGUgfHwgcnVsZXNUeXBlID09ICdpZ25vcmUnICYmICFpbmNsdWRlKSB7XG4gICAgICAgICAgICBoYXNJbXBsZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdG9baV0gPSBqc29uW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNJbXBsZWF0ZWQ7XG59XG5cbi8vIHJlYWQgdGhlIHNldHRpbmdzIG9mIHRoZSB3ZWJzaXRlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IFNldHRpbmdzOiBFeHBvcnRTZXR0aW5ncyA9IGF3YWl0IEdldFNldHRpbmdzKEV4cG9ydC5zZXR0aW5nc1BhdGgsIERldk1vZGVfKTtcbiAgICBpZihTZXR0aW5ncyA9PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxEZXYpO1xuXG4gICAgZWxzZVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsUHJvZCk7XG5cblxuICAgIGNvcHlKU09OKEV4cG9ydC5jb21waWxlLCBTZXR0aW5ncy5jb21waWxlKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5yb3V0aW5nLCBTZXR0aW5ncy5yb3V0aW5nLCBbJ2lnbm9yZVR5cGVzJywgJ3ZhbGlkUGF0aCddKTtcblxuICAgIC8vY29uY2F0IGRlZmF1bHQgdmFsdWVzIG9mIHJvdXRpbmdcbiAgICBjb25zdCBjb25jYXRBcnJheSA9IChuYW1lOiBzdHJpbmcsIGFycmF5OiBhbnlbXSkgPT4gU2V0dGluZ3Mucm91dGluZz8uW25hbWVdICYmIChFeHBvcnQucm91dGluZ1tuYW1lXSA9IFNldHRpbmdzLnJvdXRpbmdbbmFtZV0uY29uY2F0KGFycmF5KSk7XG5cbiAgICBjb25jYXRBcnJheSgnaWdub3JlVHlwZXMnLCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzKTtcbiAgICBjb25jYXRBcnJheSgndmFsaWRQYXRoJywgYmFzZVZhbGlkUGF0aCk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2NhY2hlRGF5cycsICdjb29raWVzRXhwaXJlc0RheXMnXSwgJ29ubHknKTtcblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnc2Vzc2lvblRvdGFsUmFtTUInLCAnc2Vzc2lvblRpbWVNaW51dGVzJywgJ3Nlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMnXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2ZpbGVMaW1pdE1CJywgJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuICAgIH1cblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZSwgU2V0dGluZ3Muc2VydmUpO1xuXG4gICAgLyogLS0tIHByb2JsZW1hdGljIHVwZGF0ZXMgLS0tICovXG4gICAgRXhwb3J0LmRldmVsb3BtZW50ID0gU2V0dGluZ3MuZGV2ZWxvcG1lbnRcblxuICAgIGlmIChTZXR0aW5ncy5nZW5lcmFsPy5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgRXhwb3J0LmdlbmVyYWwuaW1wb3J0T25Mb2FkID0gPGFueT5hd2FpdCBTdGFydFJlcXVpcmUoPGFueT5TZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCwgRGV2TW9kZV8pO1xuICAgIH1cblxuICAgIC8vbmVlZCB0byBkb3duIGxhc3RlZCBzbyBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aCAnaW1wb3J0T25Mb2FkJ1xuICAgIGlmICghY29weUpTT04oRXhwb3J0LmdlbmVyYWwsIFNldHRpbmdzLmdlbmVyYWwsIFsncGFnZUluUmFtJ10sICdvbmx5JykgJiYgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgfVxuXG4gICAgaWYoRXhwb3J0LmRldmVsb3BtZW50ICYmIEV4cG9ydC5yb3V0aW5nLnNpdGVtYXApeyAvLyBvbiBwcm9kdWN0aW9uIHRoaXMgd2lsbCBiZSBjaGVja2VkIGFmdGVyIGNyZWF0aW5nIHN0YXRlXG4gICAgICAgIGRlYnVnU2l0ZU1hcChFeHBvcnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlyc3RMb2FkKCkge1xuICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIGJ1aWxkQm9keVBhcnNlcigpO1xufSIsICJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMic7XG5pbXBvcnQgKiBhcyBjcmVhdGVDZXJ0IGZyb20gJ3NlbGZzaWduZWQnO1xuaW1wb3J0ICogYXMgR3JlZW5sb2NrIGZyb20gJ2dyZWVubG9jay1leHByZXNzJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGVsZXRlSW5EaXJlY3RvcnksIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBHcmVlbkxvY2tTaXRlIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgZm9sZGVyIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2VzXG4gKiBleGlzdCwgdXBkYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZvbGRlciB0byBjcmVhdGUuXG4gKiBAcGFyYW0gQ3JlYXRlSW5Ob3RFeGl0cyAtIHtcbiAqL1xuYXN5bmMgZnVuY3Rpb24gVG91Y2hTeXN0ZW1Gb2xkZXIoZm9OYW1lOiBzdHJpbmcsIENyZWF0ZUluTm90RXhpdHM6IHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGV4aXRzPzogYW55fSkge1xuICAgIGxldCBzYXZlUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyBcIi9TeXN0ZW1TYXZlL1wiO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgc2F2ZVBhdGggKz0gZm9OYW1lO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgaWYgKENyZWF0ZUluTm90RXhpdHMpIHtcbiAgICAgICAgc2F2ZVBhdGggKz0gJy8nO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHNhdmVQYXRoICsgQ3JlYXRlSW5Ob3RFeGl0cy5uYW1lO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBDcmVhdGVJbk5vdEV4aXRzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBhd2FpdCBDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKSwgZmlsZVBhdGgsIHNhdmVQYXRoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSXQgZ2VuZXJhdGVzIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgYW5kIHN0b3JlcyBpdCBpbiBhIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgY2VydGlmaWNhdGUgYW5kIGtleSBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldERlbW9DZXJ0aWZpY2F0ZSgpIHtcbiAgICBsZXQgQ2VydGlmaWNhdGU6IGFueTtcbiAgICBjb25zdCBDZXJ0aWZpY2F0ZVBhdGggPSBTeXN0ZW1EYXRhICsgJy9DZXJ0aWZpY2F0ZS5qc29uJztcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShDZXJ0aWZpY2F0ZVBhdGgpKSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gRWFzeUZzLnJlYWRKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUNlcnQuZ2VuZXJhdGUobnVsbCwgeyBkYXlzOiAzNjUwMCB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5cy5wcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgsIENlcnRpZmljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIENlcnRpZmljYXRlO1xufVxuXG5mdW5jdGlvbiBEZWZhdWx0TGlzdGVuKGFwcCkge1xuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5hdHRhY2gpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgbGlzdGVuKHBvcnQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCA8YW55PnJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIGdyZWVubG9jaywgaXQgd2lsbCBjcmVhdGUgYSBzZXJ2ZXIgdGhhdCB3aWxsIHNlcnZlIHlvdXIgYXBwIG92ZXIgaHR0cHNcbiAqIEBwYXJhbSBhcHAgLSBUaGUgdGlueUh0dHAgYXBwbGljYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdGhlIHNlcnZlciBtZXRob2RzXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFVwZGF0ZUdyZWVuTG9jayhhcHApIHtcblxuICAgIGlmICghKFNldHRpbmdzLnNlcnZlLmh0dHAyIHx8IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jaz8uYWdyZWVUb1Rlcm1zKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgRGVmYXVsdExpc3RlbihhcHApO1xuICAgIH1cblxuICAgIGlmICghU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFncmVlVG9UZXJtcykge1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwMi5jcmVhdGVTZWN1cmVTZXJ2ZXIoeyAuLi5hd2FpdCBHZXREZW1vQ2VydGlmaWNhdGUoKSwgYWxsb3dIVFRQMTogdHJ1ZSB9LCBhcHAuYXR0YWNoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuKHBvcnQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBUb3VjaFN5c3RlbUZvbGRlcihcImdyZWVubG9ja1wiLCB7XG4gICAgICAgIG5hbWU6IFwiY29uZmlnLmpzb25cIiwgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpdGVzOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXNcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGV4aXRzKGZpbGUsIF8sIGZvbGRlcikge1xuICAgICAgICAgICAgZmlsZSA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmlsZS5zaXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBmaWxlLnNpdGVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiA8R3JlZW5Mb2NrU2l0ZVtdPiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuc3ViamVjdCA9PSBlLnN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuYWx0bmFtZXMubGVuZ3RoICE9IGUuYWx0bmFtZXMubGVuZ3RoIHx8IGIuYWx0bmFtZXMuc29tZSh2ID0+IGUuYWx0bmFtZXMuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5hbHRuYW1lcyA9IGIuYWx0bmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUucmVuZXdBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGF2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnNpdGVzLnNwbGljZShpLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGZvbGRlciArIFwibGl2ZS9cIiArIGUuc3ViamVjdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NpdGVzID0gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzLmZpbHRlcigoeCkgPT4gIWZpbGUuc2l0ZXMuZmluZChiID0+IGIuc3ViamVjdCA9PSB4LnN1YmplY3QpKTtcblxuICAgICAgICAgICAgZmlsZS5zaXRlcy5wdXNoKC4uLm5ld1NpdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUod29ya2luZ0RpcmVjdG9yeSArIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgZ3JlZW5sb2NrT2JqZWN0OmFueSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBHcmVlbmxvY2suaW5pdCh7XG4gICAgICAgIHBhY2thZ2VSb290OiB3b3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBjb25maWdEaXI6IFwiU3lzdGVtU2F2ZS9ncmVlbmxvY2tcIixcbiAgICAgICAgcGFja2FnZUFnZW50OiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdlbnQgfHwgcGFja2FnZUluZm8ubmFtZSArICcvJyArIHBhY2thZ2VJbmZvLnZlcnNpb24sXG4gICAgICAgIG1haW50YWluZXJFbWFpbDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmVtYWlsLFxuICAgICAgICBjbHVzdGVyOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suY2x1c3RlcixcbiAgICAgICAgc3RhZ2luZzogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnN0YWdpbmdcbiAgICB9KS5yZWFkeShyZXMpKTtcblxuICAgIGZ1bmN0aW9uIENyZWF0ZVNlcnZlcih0eXBlLCBmdW5jLCBvcHRpb25zPykge1xuICAgICAgICBsZXQgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4geyB9O1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3RbdHlwZV0ob3B0aW9ucywgZnVuYyk7XG4gICAgICAgIGNvbnN0IGxpc3RlbiA9IChwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwU2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0Lmh0dHBTZXJ2ZXIoKTtcbiAgICAgICAgICAgIENsb3NlaHR0cFNlcnZlciA9ICgpID0+IGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UocmVzID0+IHNlcnZlci5saXN0ZW4oNDQzLCBcIjAuMC4wLjBcIiwgcmVzKSksIG5ldyBQcm9taXNlKHJlcyA9PiBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBcIjAuMC4wLjBcIiwgcmVzKSldKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHNlcnZlci5jbG9zZSgpOyBDbG9zZWh0dHBTZXJ2ZXIoKTsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3RlbixcbiAgICAgICAgICAgIGNsb3NlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cDJTZXJ2ZXInLCBhcHAuYXR0YWNoLCB7IGFsbG93SFRUUDE6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cHNTZXJ2ZXInLCBhcHAuYXR0YWNoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IGluaXRTcWxKcywgeyBEYXRhYmFzZSB9IGZyb20gJ3NxbC5qcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxTcWwge1xuICAgIHB1YmxpYyBkYjogRGF0YWJhc2U7XG4gICAgcHVibGljIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgcHVibGljIGhhZENoYW5nZSA9IGZhbHNlO1xuICAgIHByaXZhdGUgbG9hZGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihzYXZlUGF0aD86IHN0cmluZywgY2hlY2tJbnRlcnZhbE1pbnV0ZXMgPSAxMCkge1xuICAgICAgICB0aGlzLnNhdmVQYXRoID0gc2F2ZVBhdGggPz8gd29ya2luZ0RpcmVjdG9yeSArIFwiU3lzdGVtU2F2ZS9EYXRhQmFzZS5kYlwiO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsRmlsZSA9IHRoaXMudXBkYXRlTG9jYWxGaWxlLmJpbmQodGhpcyk7XG4gICAgICAgIHNldEludGVydmFsKHRoaXMudXBkYXRlTG9jYWxGaWxlLCAxMDAwICogNjAgKiBjaGVja0ludGVydmFsTWludXRlcyk7XG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIHRoaXMudXBkYXRlTG9jYWxGaWxlKVxuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgdGhpcy51cGRhdGVMb2NhbEZpbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbm90TG9hZGVkKCl7XG4gICAgICAgIGlmKCF0aGlzLmxvYWRlZCl7XG4gICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdkbi1ub3QtbG9hZGVkJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnRGF0YUJhc2UgaXMgbm90IGxvYWRlZCwgcGxlYXNlIHVzZSBcXCdhd2FpdCBkYi5sb2FkKClcXCcnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZCgpIHtcbiAgICAgICAgY29uc3Qgbm90RXhpdHMgPSBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhwYXRoLmRpcm5hbWUodGhpcy5zYXZlUGF0aCkpO1xuICAgICAgICBjb25zdCBTUUwgPSBhd2FpdCBpbml0U3FsSnMoKTtcblxuICAgICAgICBsZXQgcmVhZERhdGE6IEJ1ZmZlcjtcbiAgICAgICAgaWYgKCFub3RFeGl0cyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnNhdmVQYXRoKSlcbiAgICAgICAgICAgIHJlYWREYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMuc2F2ZVBhdGgsICdiaW5hcnknKTtcbiAgICAgICAgdGhpcy5kYiA9IG5ldyBTUUwuRGF0YWJhc2UocmVhZERhdGEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTG9jYWxGaWxlKCl7XG4gICAgICAgIGlmKCF0aGlzLmhhZENoYW5nZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLmhhZENoYW5nZSA9IGZhbHNlO1xuICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHRoaXMuc2F2ZVBhdGgsIHRoaXMuZGIuZXhwb3J0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRRdWVyeVRlbXBsYXRlKGFycjogc3RyaW5nW10sIHBhcmFtczogYW55W10pIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgIHF1ZXJ5ICs9IGFycltpXSArICc/JztcbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXJ5ICs9IGFyci5hdCgtMSk7XG5cbiAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cblxuICAgIGluc2VydChxdWVyeUFycmF5OiBzdHJpbmdbXSwgLi4udmFsdWVzQXJyYXk6IGFueVtdKSB7XG4gICAgICAgIGlmKHRoaXMubm90TG9hZGVkKCkpIHJldHVyblxuICAgICAgICBjb25zdCBxdWVyeSA9IHRoaXMuZGIucHJlcGFyZSh0aGlzLmJ1aWxkUXVlcnlUZW1wbGF0ZShxdWVyeUFycmF5LCB2YWx1ZXNBcnJheSkpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBxdWVyeS5nZXQodmFsdWVzQXJyYXkpWzBdO1xuICAgICAgICAgICAgdGhpcy5oYWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgcXVlcnkuZnJlZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZmZlY3RlZChxdWVyeUFycmF5OiBzdHJpbmdbXSwgLi4udmFsdWVzQXJyYXk6IGFueVtdKSB7XG4gICAgICAgIGlmKHRoaXMubm90TG9hZGVkKCkpIHJldHVyblxuICAgICAgICBjb25zdCBxdWVyeSA9IHRoaXMuZGIucHJlcGFyZSh0aGlzLmJ1aWxkUXVlcnlUZW1wbGF0ZShxdWVyeUFycmF5LCB2YWx1ZXNBcnJheSkpO1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICBxdWVyeS5ydW4odmFsdWVzQXJyYXkpXG4gICAgICAgICAgICAgY29uc3QgZWZmZWN0ZWQgPSB0aGlzLmRiLmdldFJvd3NNb2RpZmllZCgpXG4gICAgICAgICAgICAgdGhpcy5oYWRDaGFuZ2UgfHw9IGVmZmVjdGVkID4gMDtcbiAgICAgICAgICAgICBxdWVyeS5mcmVlKCk7XG4gICAgICAgICAgICAgcmV0dXJuIGVmZmVjdGVkO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3QocXVlcnlBcnJheTogc3RyaW5nW10sIC4uLnZhbHVlc0FycmF5OiBhbnlbXSkge1xuICAgICAgICBpZih0aGlzLm5vdExvYWRlZCgpKSByZXR1cm5cbiAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLmJ1aWxkUXVlcnlUZW1wbGF0ZShxdWVyeUFycmF5LCB2YWx1ZXNBcnJheSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYi5leGVjKHF1ZXJ5KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0T25lKHF1ZXJ5QXJyYXk6IHN0cmluZ1tdLCAuLi52YWx1ZXNBcnJheTogYW55W10pIHtcbiAgICAgICAgaWYodGhpcy5ub3RMb2FkZWQoKSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5kYi5wcmVwYXJlKHRoaXMuYnVpbGRRdWVyeVRlbXBsYXRlKHF1ZXJ5QXJyYXksIHZhbHVlc0FycmF5KSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBxdWVyeS5zdGVwKCk7XG4gICAgICAgICAgICBjb25zdCBvbmUgPSBxdWVyeS5nZXRBc09iamVjdCgpO1xuICAgICAgICAgICAgcXVlcnkuZnJlZSgpO1xuICAgICAgICAgICAgcmV0dXJuIG9uZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCBMb2NhbFNxbCBmcm9tICcuL2xvY2FsU3FsJ1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSdcblxuKDxhbnk+Z2xvYmFsKS5Mb2NhbFNxbCA9IExvY2FsU3FsO1xuKDxhbnk+Z2xvYmFsKS5kdW1wID0gcHJpbnQ7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBsZXQgTG9jYWxTcWw6IExvY2FsU3FsXG4gICAgbGV0IGR1bXA6IHR5cGVvZiBjb25zb2xlXG59XG5cbmV4cG9ydCB7TG9jYWxTcWwsIHByaW50IGFzIGR1bXB9OyIsICJpbXBvcnQgc2VydmVyLCB7U2V0dGluZ3N9ICBmcm9tICcuL01haW5CdWlsZC9TZXJ2ZXInO1xuaW1wb3J0IHtMb2NhbFNxbCwgZHVtcH0gZnJvbSAnLi9CdWlsZEluRnVuYy9JbmRleCc7XG5pbXBvcnQgYXN5bmNSZXF1aXJlIGZyb20gJy4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7Z2V0VHlwZXN9IGZyb20gJy4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuZXhwb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL01haW5CdWlsZC9UeXBlcyc7XG5cbmV4cG9ydCBjb25zdCBBc3luY0ltcG9ydCA9IChwYXRoOnN0cmluZywgaW1wb3J0RnJvbSA9ICdhc3luYyBpbXBvcnQnKSA9PiBhc3luY1JlcXVpcmUoaW1wb3J0RnJvbSwgcGF0aCwgZ2V0VHlwZXMuU3RhdGljLCBTZXR0aW5ncy5kZXZlbG9wbWVudCk7XG5leHBvcnQgY29uc3QgU2VydmVyID0gc2VydmVyO1xuZXhwb3J0IHtTZXR0aW5ncywgTG9jYWxTcWwsIGR1bXB9OyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7OztBQ0ZBOzs7QUNBQSxJQUFJ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
