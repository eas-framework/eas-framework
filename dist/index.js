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
  return (await stat(path23, void 0, true)).isFile?.() && ifTrueReturn;
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
import path4 from "path";

// src/EasyDebug/SourceMapStore.ts
import { SourceMapGenerator, SourceMapConsumer } from "source-map-js";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

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

// src/EasyDebug/SourceMapStore.ts
var SourceMapBasic = class {
  constructor(filePath, httpSource = true, relative2 = false, isCss = false) {
    this.filePath = filePath;
    this.httpSource = httpSource;
    this.relative = relative2;
    this.isCss = isCss;
    this.lineCount = 0;
    this.map = new SourceMapGenerator({
      file: filePath.split(/\/|\\/).pop()
    });
    if (!httpSource)
      this.fileDirName = path3.dirname(this.filePath);
  }
  getSource(source) {
    source = source.split("<line>").pop().trim();
    if (this.httpSource) {
      if (BasicSettings.pageTypesArray.includes(path3.extname(source).substring(1)))
        source += ".source";
      else
        source = SplitFirst("/", source).pop() + "?source=true";
      return path3.normalize((this.relative ? "" : "/") + source.replace(/\\/gi, "/"));
    }
    return path3.relative(this.fileDirName, BasicSettings.fullWebSitePath + source);
  }
  getRowSourceMap() {
    return this.map.toJSON();
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
    super(filePath, httpSource, false, isCss);
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
      map.sources[i] = BasicSettings.relative(fileURLToPath2(map.sources[i]));
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

// src/EasyDebug/StringTrackerToSourceMap.ts
var createPageSourceMap = class extends SourceMapBasic {
  constructor(filePath, httpSource = false, relative2 = false) {
    super(filePath, httpSource, relative2);
    this.lineCount = 1;
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
function outputMap(text, filePath, httpSource, relative2) {
  const storeMap = new createPageSourceMap(filePath, httpSource, relative2);
  storeMap.addMappingFromTrack(text);
  return storeMap.getRowSourceMap();
}
function outputWithMap(text, filePath) {
  const storeMap = new createPageSourceMap(filePath);
  storeMap.addMappingFromTrack(text);
  return text.eq + storeMap.mapAsURLComment();
}

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
    return count;
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
  static join(arr) {
    let all = new StringTracker();
    for (const i of arr) {
      all.AddClone(i);
    }
    return all;
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
  async replacerAsync(searchValue, func) {
    let copy = this.Clone(), SplitToReplace;
    function ReMatch() {
      SplitToReplace = copy.match(searchValue);
    }
    ReMatch();
    const newText = new StringTracker(copy.StartInfo);
    while (SplitToReplace) {
      newText.Plus(copy.substring(0, SplitToReplace.index));
      newText.Plus(await func(SplitToReplace));
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
      nextMath = nextMath.substring(findIndex);
    }
    return ResultArray;
  }
  toString() {
    return this.OneString;
  }
  extractInfo(type = "<line>") {
    return this.DefaultInfoText.info.split(type).pop().trim();
  }
  debugLine({ message, text, location, line, col, sassStack }) {
    if (sassStack) {
      const loc = sassStack.match(/[0-9]+:[0-9]+/)[0].split(":").map((x) => Number(x));
      line = loc[0];
      col = loc[1];
    }
    let searchLine = this.getLine(line ?? location?.line ?? 1), column = col ?? location?.column ?? 0;
    if (searchLine.startsWith("//")) {
      searchLine = this.getLine((line ?? location?.line) - 1);
      column = 0;
    }
    const data = searchLine.DefaultInfoText;
    return `${text || message}, on file -> ${BasicSettings.fullWebSitePath}${data.info.split("<line>").shift()}:${data.line}:${column}`;
  }
  StringWithTack(fullSaveLocation) {
    return outputWithMap(this, fullSaveLocation);
  }
  StringTack(fullSaveLocation, httpSource, relative2) {
    return outputMap(this, fullSaveLocation, httpSource, relative2);
  }
};

// src/static/wasm/component/index.js
import { promises } from "fs";
import { fileURLToPath as fileURLToPath3 } from "url";
var loadPath = true ? "/../static/wasm/component/" : "/../";
var wasmModule = new WebAssembly.Module(await promises.readFile(fileURLToPath3(import.meta.url + loadPath + "build.wasm")));
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
async function EndOfDefSkipBlock(text, types) {
  return await parse_stream.exec("find_end_of_def_skip_block", [text, JSON.stringify(types)]);
}
async function EndOfBlock(text, types) {
  return await parse_stream.exec("end_of_block", [text, types.join("")]);
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
async function ParseDebugInfo(code, path23) {
  return await ParseScriptCode(code, path23);
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
    inputPath = `${path4.dirname(filePath)}/${inputPath}`;
  } else if (inputPath[0] == "/") {
    inputPath = `${getTypes.Static[pathType]}${inputPath}`;
  } else {
    inputPath = `${pathType == 0 ? workingDirectory + BasicSettings.WebSiteFolder + "/" : ""}${folder}/${inputPath}`;
  }
  return path4.normalize(inputPath);
}
function CreateFilePath(filePath, smallPath2, inputPath, folder, pageType) {
  return {
    SmallPath: CreateFilePathOnePath(smallPath2, inputPath, folder, pageType, 2),
    FullPath: CreateFilePathOnePath(filePath, inputPath, folder, pageType)
  };
}

// src/CompileCode/esbuild/minify.ts
import { transform } from "esbuild-wasm";

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

// src/CompileCode/esbuild/printMessage.ts
function ESBuildPrintError(filePath, { errors }) {
  for (const err of errors) {
    PrintIfNew({
      type: "error",
      errorName: "compilation-error",
      text: `${err.text}, on file -> ${filePath}:${err?.location?.line ?? 0}:${err?.location?.column ?? 0}`
    });
  }
}
function ESBuildPrintWarnings(filePath, warnings) {
  for (const warn of warnings) {
    PrintIfNew({
      type: "warn",
      errorName: warn.pluginName,
      text: `${warn.text} on file -> ${filePath}:${warn?.location?.line ?? 0}:${warn?.location?.column ?? 0}`
    });
  }
}
function ESBuildPrintWarningsStringTracker(base, warnings) {
  for (const warn of warnings) {
    PrintIfNew({
      type: "warn",
      errorName: warn.pluginName,
      text: base.debugLine(warn)
    });
  }
}
function ESBuildPrintErrorStringTracker(base, err) {
  PrintIfNew({
    errorName: "compilation-error",
    text: base.debugLine(err)
  });
}

// src/CompileCode/esbuild/minify.ts
async function minifyJS(text, tracker) {
  try {
    const { code, warnings } = await transform(text, { minify: true });
    ESBuildPrintWarningsStringTracker(tracker, warnings);
    return code;
  } catch (err) {
    ESBuildPrintErrorStringTracker(tracker, err);
  }
  return text;
}

// src/BuildInComponents/Components/client.ts
var serveScript = "/serv/temp.js";
async function template(BuildScriptWithoutModule, name2, params, selector, mainCode, path23, isDebug) {
  const parse2 = await JSParser.RunAndExport(mainCode, path23, isDebug);
  return new StringTracker().Plus$`function ${name2}({${params}}, selector = "${selector}", out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${await BuildScriptWithoutModule(parse2)}
        var exports = ${name2}.exports;
        return sendToSelector(selector, out_run_script.text);
    }\n${name2}.exports = {};`;
}
async function BuildCode(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2);
  sessionInfo2.script(serveScript, { async: null });
  let scriptInfo = await template(sessionInfo2.BuildScriptWithPrams, dataTag2.getValue("name"), dataTag2.getValue("params"), dataTag2.getValue("selector"), BetweenTagData, pathName, sessionInfo2.debug && !InsertComponent2.SomePlugins("SafeDebug"));
  const addScript = sessionInfo2.addScriptStylePage("script", dataTag2, type);
  if (InsertComponent2.SomePlugins("MinJS") || InsertComponent2.SomePlugins("MinAll")) {
    addScript.addText(await minifyJS(scriptInfo.eq, BetweenTagData));
  } else {
    addScript.addStringTracker(scriptInfo);
  }
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/script/server.ts
import { transform as transform2 } from "esbuild-wasm";

// src/EasyDebug/SourceMapLoad.ts
import { SourceMapConsumer as SourceMapConsumer2 } from "source-map-js";
import { fileURLToPath as fileURLToPath4 } from "url";
function SourceMapToStringTracker(code, sourceMap) {
  const map = typeof sourceMap == "string" ? JSON.parse(sourceMap) : sourceMap;
  const trackCode = new StringTracker(null, code);
  const splitLines = trackCode.split("\n");
  new SourceMapConsumer2(map).eachMapping((m) => {
    const isMap = splitLines[m.generatedLine - 1];
    if (!isMap)
      return;
    let charCount = 1;
    for (const i of isMap.substring(m.generatedColumn ? m.generatedColumn - 1 : 0).getDataArray()) {
      i.info = m.source;
      i.line = m.originalLine;
      i.char = charCount++;
    }
  });
  return trackCode;
}
function mergeInfoStringTracker(original, generated) {
  const originalLines = original.split("\n");
  for (const item of generated.getDataArray()) {
    const { line, char, info } = originalLines[item.line - 1].DefaultInfoText;
    item.line = line;
    item.info = info;
    item.char = char;
  }
}
function backToOriginal(original, code, sourceMap) {
  const newTracker = SourceMapToStringTracker(code, sourceMap);
  mergeInfoStringTracker(original, newTracker);
  return newTracker;
}
function mergeSassInfoStringTracker(original, generated, mySource) {
  const originalLines = original.split("\n");
  for (const item of generated.getDataArray()) {
    if (item.info == mySource) {
      const { line, char, info } = originalLines[item.line - 1].at(item.char - 1).DefaultInfoText;
      item.line = line;
      item.info = info;
      item.char = char;
    } else if (item.info) {
      item.info = BasicSettings.relative(fileURLToPath4(item.info));
    }
  }
}
function backToOriginalSss(original, code, sourceMap, mySource) {
  const newTracker = SourceMapToStringTracker(code, sourceMap);
  mergeSassInfoStringTracker(original, newTracker, mySource);
  return newTracker;
}

// src/BuildInComponents/Components/script/server.ts
var _a;
async function BuildCode2(language, pathName, type, dataTag2, BetweenTagData, InsertComponent2) {
  let ResCode = BetweenTagData;
  const SaveServerCode = new EnableGlobalReplace("serv");
  await SaveServerCode.load(BetweenTagData, pathName);
  const BetweenTagDataExtracted = await SaveServerCode.StartBuild();
  const AddOptions = __spreadValues({
    sourcefile: BetweenTagData.extractInfo(),
    minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
    sourcemap: "external"
  }, GetPlugin("transformOptions"));
  try {
    switch (language) {
      case "ts":
        AddOptions.loader = "ts";
        break;
      case "jsx":
        AddOptions.loader = "jsx";
        Object.assign(AddOptions, GetPlugin("JSXOptions") ?? {});
        break;
      case "tsx":
        AddOptions.loader = "tsx";
        Object.assign(AddOptions, GetPlugin("TSXOptions") ?? {});
        break;
    }
    const { map, code, warnings } = await transform2(BetweenTagDataExtracted, AddOptions);
    ESBuildPrintWarningsStringTracker(BetweenTagData, warnings);
    ResCode = SaveServerCode.RestoreCode(SourceMapToStringTracker(code, map));
  } catch (err) {
    ESBuildPrintErrorStringTracker(BetweenTagData, err);
  }
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a || (_a = __template(["<script", ">", "<\/script>"])), InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2), ResCode)
  };
}

// src/BuildInComponents/Components/script/client.ts
import { transform as transform3 } from "esbuild-wasm";
async function BuildCode3(language, tagData, BetweenTagData, sessionInfo2) {
  const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.getValue("type") == "module", isModelStringCache = isModel ? "scriptModule" : "script";
  if (sessionInfo2.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo2.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);
  let resultCode = "", resultMap;
  const AddOptions = __spreadValues({
    sourcefile: BetweenTagData.extractInfo(),
    minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
    sourcemap: sessionInfo2.debug ? "external" : false
  }, GetPlugin("transformOptions"));
  try {
    switch (language) {
      case "ts":
        AddOptions.loader = "ts";
        break;
      case "jsx":
        AddOptions.loader = "jsx";
        Object.assign(AddOptions, GetPlugin("JSXOptions") ?? {});
        break;
      case "tsx":
        AddOptions.loader = "tsx";
        Object.assign(AddOptions, GetPlugin("TSXOptions") ?? {});
        break;
    }
    const { map, code, warnings } = await transform3(BetweenTagData.eq, AddOptions);
    ESBuildPrintWarningsStringTracker(BetweenTagData, warnings);
    resultCode = code;
    resultMap = map;
  } catch (err) {
    ESBuildPrintErrorStringTracker(BetweenTagData, err);
  }
  const pushStyle = sessionInfo2.addScriptStylePage(isModel ? "module" : "script", tagData, BetweenTagData);
  if (resultMap) {
    pushStyle.addSourceMapWithStringTracker(JSON.parse(resultMap), BetweenTagData, resultCode);
  } else {
    pushStyle.addText(resultCode);
  }
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/script/index.ts
var _a2;
async function BuildCode4(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  if (dataTag2.have("src"))
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a2 || (_a2 = __template(["<script", ">", "<\/script>"])), InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2), BetweenTagData)
    };
  const language = dataTag2.remove("lang") || "js";
  if (dataTag2.have("server")) {
    dataTag2.remove("server");
    return BuildCode2(language, pathName, type, dataTag2, BetweenTagData, InsertComponent2);
  }
  return BuildCode3(language, dataTag2, BetweenTagData, sessionInfo2);
}

// src/BuildInComponents/Components/style/sass.ts
import { fileURLToPath as fileURLToPath5, pathToFileURL } from "url";
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
      const FullPath2 = fileURLToPath5(file);
      await sessionInfo2.dependence(BasicSettings.relative(FullPath2), FullPath2);
    }
  }
  sassAndSource(result.sourceMap, thisPageURL.href);
  return { result, outStyle, compressed };
}

// src/BuildInComponents/Components/style/server.ts
async function BuildCode5(language, pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
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

// src/BuildInComponents/Components/style/client.ts
async function BuildCode6(language, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const outStyleAsTrim = BetweenTagData.eq.trim();
  if (sessionInfo2.cache.style.includes(outStyleAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo2.cache.style.push(outStyleAsTrim);
  const { result, outStyle } = await compileSass(language, BetweenTagData, InsertComponent2, sessionInfo2);
  const pushStyle = sessionInfo2.addScriptStylePage("style", dataTag2, BetweenTagData);
  if (result?.sourceMap)
    pushStyle.addSourceMapWithStringTracker(SourceMapStore.fixURLSourceMap(result.sourceMap), BetweenTagData, outStyle);
  else
    pushStyle.addStringTracker(BetweenTagData, { text: outStyle });
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/style/index.ts
async function BuildCode7(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const language = dataTag2.remove("lang") || "css";
  if (dataTag2.have("server")) {
    dataTag2.remove("server");
    return BuildCode5(language, pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
  }
  return BuildCode6(language, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
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
function InFolderPagePath(inputPath, smallPath2) {
  if (inputPath[0] == ".") {
    if (inputPath[1] == "/") {
      inputPath = inputPath.substring(2);
    } else {
      inputPath = inputPath.substring(1);
    }
    let folder = path_node.dirname(smallPath2);
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
async function BuildCode8(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const filepath = dataTag2.getValue("from");
  const SmallPathWithoutFolder = InFolderPagePath(filepath, type.extractInfo());
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

// src/ImportFiles/ForStatic/Svelte/ssr.ts
import path7 from "path";

// src/ImportFiles/ForStatic/Svelte/preprocess.ts
import { transform as transform5 } from "esbuild-wasm";
import { extname } from "path";
import sass2 from "sass";
import { v4 as uuid } from "uuid";
import path5 from "path";
import { fileURLToPath as fileURLToPath6 } from "url";

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

// src/CompileCode/transform/Script.ts
import { transform as transform4 } from "esbuild-wasm";

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
  async exportVariable() {
    let newString = this.Build.CodeBuildText;
    let match;
    function Rematch() {
      match = newString.match(/(export[ \n]+)(var|let|const)[ \n]+([\p{L}\$_][\p{L}0-9\$_]*)/u);
    }
    Rematch();
    while (match) {
      const beforeMatch = newString.substring(0, match.index);
      const removeExport = match[0].substring(match[1].length);
      const afterMatch = newString.substring(match.index + match[0].length);
      let closeIndex = await EndOfDefSkipBlock(afterMatch, [";", "\n"]);
      if (closeIndex == -1) {
        closeIndex = afterMatch.length;
      }
      const beforeClose = afterMatch.substring(0, closeIndex), afterClose = afterMatch.substring(closeIndex);
      newString = `${beforeMatch + removeExport + beforeClose};exports.${match[3]}=${match[3]}${afterClose}`;
      Rematch();
    }
    this.Build.CodeBuildText = newString;
  }
  async exportBlock() {
    let newString = this.Build.CodeBuildText;
    let match;
    function Rematch() {
      match = newString.match(/(export[ \n]+)(default[ \n]+)?([^ \n])/u);
    }
    Rematch();
    while (match) {
      let beforeMatch = newString.substring(0, match.index);
      let removeExport = match[0].substring(match[1].length + (match[2] || "").length);
      const firstChar = match[3][0], isDefault = Boolean(match[2]);
      if (firstChar == "{") {
        let afterMatch = newString.substring(match.index + match[0].length);
        if (isDefault) {
          newString = beforeMatch + "exports.default=" + removeExport + afterMatch;
        } else {
          const endIndex = await EndOfBlock(afterMatch, ["{", "}"]);
          beforeMatch += `Object.assign(exports, ${removeExport + afterMatch.substring(0, endIndex + 1)})`;
          newString = beforeMatch + afterMatch.substring(endIndex + 1);
        }
      } else {
        let afterMatch = newString.substring(match.index + match[0].length - 1);
        removeExport = removeExport.slice(0, -1);
        let closeIndex = await EndOfDefSkipBlock(afterMatch, [";", "\n"]);
        if (closeIndex == -1) {
          closeIndex = afterMatch.trimEnd().length;
        }
        const beforeClose = afterMatch.substring(0, closeIndex);
        const blockMatch = beforeClose.match(/(function|class)[ |\n]+([\p{L}\$_][\p{L}0-9\$_]*)?/u);
        if (blockMatch?.[2]) {
          const afterClose = afterMatch.substring(closeIndex);
          newString = `${beforeMatch + removeExport + beforeClose}exports.${isDefault ? "default" : blockMatch[2]}=${blockMatch[2]}${afterClose}`;
        } else if (isDefault) {
          newString = beforeMatch + "exports.default=" + removeExport + afterMatch;
        } else {
          newString = `${beforeMatch}exports.${beforeClose.split(/ |\n/, 1).pop()}=${removeExport + afterMatch}`;
        }
      }
      Rematch();
    }
    this.Build.CodeBuildText = newString;
  }
  async BuildImports(defineData) {
    this.BuildImportType("import", "require");
    this.BuildImportType("export", "require", this.actionStringExport);
    this.BuildImportType("include");
    this.BuildInOneWord("import", "require");
    this.BuildInOneWord("export", "require", this.actionStringExportAll);
    this.BuildInOneWord("include");
    this.BuildInAsFunction("import", "require");
    await this.exportVariable();
    await this.exportBlock();
    defineData && this.Define(defineData);
  }
  BuiltString() {
    return this.Build.BuildCode();
  }
  static async BuildAndExportImports(code, defineData) {
    const builder = new EasySyntax();
    await builder.load(` ${code} `);
    await builder.BuildImports(defineData);
    code = builder.BuiltString();
    return code.substring(1, code.length - 1);
  }
};

// src/CompileCode/transform/Script.ts
function ErrorTemplate(info) {
  return `module.exports = () => (DataObject) => DataObject.out_run_script.text += "<p style=\\"color:red;text-align:left;font-size:16px;\\">Syntax Error: ${JSParser.fixTextSimpleQuotes(info.replaceAll("\n", "<br/>"))}</p>"`;
}
async function BuildScript(text, isTypescript, sessionInfo2) {
  text = text.trim();
  const Options = {
    format: "cjs",
    loader: isTypescript ? "ts" : "js",
    sourcemap: sessionInfo2.debug,
    sourcefile: sessionInfo2.smallPath,
    define: {
      debug: "" + sessionInfo2.debug
    }
  };
  let result;
  try {
    const { code, map, warnings } = await transform4(await EasySyntax.BuildAndExportImports(text.eq), Options);
    ESBuildPrintWarningsStringTracker(text, warnings);
    result = map ? backToOriginal(text, code, map) : new StringTracker(null, code);
  } catch (err) {
    ESBuildPrintErrorStringTracker(text, err);
    const errorMessage = text.debugLine(err);
    if (sessionInfo2.debug)
      result = new StringTracker(null, ErrorTemplate(errorMessage));
  }
  return result;
}

// src/CompileCode/Session.ts
var StaticFilesInfo = new StoreJSON("ShortScriptNames");
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
    this.BuildScriptWithPrams = this.BuildScriptWithPrams.bind(this);
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
    const values = Object.values(StaticFilesInfo.store);
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
      let url = StaticFilesInfo.have(i.path, () => SessionBuild.createName(i.path)) + ".pub";
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
  BuildScriptWithPrams(code) {
    return BuildScript(code, isTs(), this);
  }
};

// src/ImportFiles/ForStatic/Svelte/preprocess.ts
async function SASSSvelte(content, lang, fullPath) {
  if (lang == "css")
    return {
      code: new StringTracker()
    };
  try {
    const { css, sourceMap, loadedUrls } = await sass2.compileStringAsync(content.eq, {
      syntax: sassSyntax(lang),
      style: sassStyle(lang, SomePlugins),
      importer: createImporter(fullPath),
      logger: sass2.Logger.silent,
      sourceMap: true
    });
    return {
      code: backToOriginalSss(content, css, sourceMap, sourceMap.sources.find((x) => x.startsWith("data:"))),
      dependencies: loadedUrls.map((x) => fileURLToPath6(x))
    };
  } catch (err) {
    PrintIfNew({
      text: `${err.message}, on file -> ${fullPath}${err.line ? ":" + err.line : ""}`,
      errorName: err?.status == 5 ? "sass-warning" : "sass-error",
      type: err?.status == 5 ? "warn" : "error"
    });
  }
  return {
    code: new StringTracker()
  };
}
async function ScriptSvelte(content, lang, connectSvelte, svelteExt = "") {
  const mapToken = {};
  content = content.replacer(/((import({|[ ]*\(?)|((import|export)({|[ ]+)[\W\w]+?(}|[ ]+)from))(}|[ ]*))(["|'|`])([\W\w]+?)\9([ ]*\))?/m, (args) => {
    const ext = extname(args[10].eq);
    if (ext == "")
      if (lang == "ts")
        args[10].AddTextAfterNoTrack(".ts");
      else
        args[10].AddTextAfterNoTrack(".js");
    const newData = args[1].Plus(args[9], args[10], ext == ".svelte" ? svelteExt : "", args[9], args[11] ?? "");
    if (ext == ".svelte") {
      connectSvelte.push(args[10].eq);
    } else if (lang !== "ts" || !args[4])
      return newData;
    const id = uuid();
    mapToken[id] = newData;
    return new StringTracker(null, `___toKen\`${id}\``);
  });
  if (lang !== "ts")
    return content;
  try {
    const { code, map } = await transform5(content.eq, __spreadProps(__spreadValues({}, GetPlugin("transformOptions")), { loader: "ts", sourcemap: true }));
    content = backToOriginal(content, code, map);
  } catch (err) {
    ESBuildPrintErrorStringTracker(content, err);
    return new StringTracker();
  }
  content = content.replacer(/___toKen`([\w\W]+?)`/mi, (args) => {
    return mapToken[args[1].eq] ?? new StringTracker();
  });
  return content;
}
async function preprocess(fullPath, smallPath2, savePath, httpSource = true, svelteExt = "") {
  const filename = smallPath2.split(/\/|\//).pop();
  savePath ??= filename;
  let text = new StringTracker(filename, await EasyFs_default.readFile(fullPath));
  const connectSvelte = [], dependencies = [];
  text = await text.replacerAsync(/(<script)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>)(.*?)(<\/script>)/s, async (args) => {
    return args[1].Plus(args[6], await ScriptSvelte(args[7], args[4]?.eq ?? "js", connectSvelte, svelteExt), args[8]);
  });
  const styleCode = connectSvelte.map((x) => `@import "${x}.css";`).join("");
  let hadStyle = false;
  text = await text.replacerAsync(/(<style)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>)(.*?)(<\/style>)/s, async (args) => {
    const { code, dependencies: deps } = await SASSSvelte(args[7], args[4]?.eq ?? "css", fullPath);
    deps && dependencies.push(...deps);
    hadStyle = true;
    styleCode && code.AddTextBeforeNoTrack(styleCode);
    return args[1].Plus(args[6], code, args[8]);
    ;
  });
  if (!hadStyle && styleCode) {
    text.AddTextAfterNoTrack(`<style>${styleCode}</style>`);
  }
  const sessionInfo2 = new SessionBuild(smallPath2, fullPath), promises3 = [sessionInfo2.dependence(smallPath2, fullPath)];
  for (const full of dependencies) {
    promises3.push(sessionInfo2.dependence(BasicSettings.relative(full), full));
  }
  return { code: text.eq, map: text.StringTack(savePath, httpSource), dependencies: sessionInfo2.dependencies, svelteFiles: connectSvelte.map((x) => x[0] == "/" ? getTypes.Static[0] + x : path5.normalize(fullPath + "/../" + x)) };
}
function Capitalize(name2) {
  return name2[0].toUpperCase() + name2.slice(1);
}

// src/ImportFiles/ForStatic/Svelte/ssr.ts
import * as svelte from "svelte/compiler";

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

// src/ImportFiles/ForStatic/Svelte/ssr.ts
async function registerExtension(filePath, smallPath2, sessionInfo2) {
  const name2 = path7.parse(filePath).name.replace(/^\d/, "_$&").replace(/[^a-zA-Z0-9_$]/g, "");
  const options = {
    filename: filePath,
    name: Capitalize(name2),
    generate: "ssr",
    format: "cjs",
    dev: sessionInfo2.debug
  };
  const inStaticFile = path7.relative(getTypes.Static[2], smallPath2);
  const fullCompilePath = getTypes.Static[1] + inStaticFile;
  const fullImportPath = fullCompilePath + ".ssr.cjs";
  const { svelteFiles, code, map, dependencies } = await preprocess(filePath, smallPath2, fullImportPath, false, ".ssr.cjs");
  Object.assign(sessionInfo2.dependencies, dependencies);
  options.sourcemap = map;
  const promises3 = [];
  for (const file of svelteFiles) {
    clearModule(resolve(file));
    promises3.push(registerExtension(file, BasicSettings.relative(file), sessionInfo2));
  }
  await Promise.all(promises3);
  const { js, css, warnings } = svelte.compile(code, options);
  if (sessionInfo2.debug) {
    warnings.forEach((warning) => {
      PrintIfNew({
        errorName: warning.code,
        type: "warn",
        text: warning.message + "\n" + warning.frame
      });
    });
  }
  await EasyFs_default.writeFile(fullImportPath, js.code);
  if (css.code) {
    css.map.sources[0] = "/" + inStaticFile.split(/\/|\//).pop() + "?source=true";
    css.code += "\n/*# sourceMappingURL=" + css.map.toUrl() + "*/";
  }
  await EasyFs_default.writeFile(fullCompilePath + ".css", css.code ?? "");
  return fullImportPath;
}

// src/BuildInComponents/Components/svelte.ts
async function ssrHTML(dataTag, FullPath, smallPath, sessionInfo) {
  const getV = (name) => {
    const gv = (name2) => dataTag.getValue(name2).trim(), value = gv("ssr" + Capitalize(name)) || gv(name);
    return value ? eval(`(${value.charAt(0) == "{" ? value : `{${value}}`})`) : {};
  };
  const buildPath = await registerExtension(FullPath, smallPath, sessionInfo);
  const mode = await redirectCJS_default(buildPath);
  const { html, head } = mode.default.render(getV("props"), getV("options"));
  sessionInfo.headHTML += head;
  return html;
}
async function BuildCode9(type, dataTag2, sessionInfo2) {
  const LastSmallPath = type.extractInfo(), LastFullPath = BasicSettings.fullWebSitePath + LastSmallPath;
  const { SmallPath, FullPath: FullPath2 } = CreateFilePath(LastFullPath, LastSmallPath, dataTag2.remove("from"), getTypes.Static[2], "svelte");
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
async function BuildCode11(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2)}@DefaultInsertBundle</head>`,
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
async function BuildCode12(type, dataTag2, BetweenTagData, { SomePlugins: SomePlugins2 }, sessionInfo2) {
  const name2 = dataTag2.getValue("name"), sendTo = dataTag2.getValue("sendTo"), validator = dataTag2.getValue("validate"), notValid = dataTag2.remove("notValid");
  let message = parseTagDataStringBoolean(dataTag2, "message");
  if (message === null)
    message = sessionInfo2.debug && !SomePlugins2("SafeDebug");
  sessionInfo2.script(serveScript2, { async: null });
  sessionInfo2.addScriptStylePage("script", dataTag2, type).addText(template2(name2));
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
async function BuildCode13(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const sendTo = dataTag2.remove("sendTo").trim();
  if (!sendTo)
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$`<form${InsertComponent2.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag2)}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2)}</form>`,
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
    <input type="hidden" name="connectorFormCall" value="${name2}"/>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2)}</form>`;
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
async function BuildCode14(pathName, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2);
  const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo());
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
async function BuildCode15(pathName, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2);
  const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo());
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
function StartCompiling(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  let reData;
  switch (type.eq.toLowerCase()) {
    case "client":
      reData = BuildCode(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "record":
      reData = BuildCode14(pathName, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "search":
      reData = BuildCode15(pathName, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "script":
      reData = BuildCode4(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "style":
      reData = BuildCode7(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "page":
      reData = BuildCode8(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "connect":
      reData = BuildCode12(type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "form":
      reData = BuildCode13(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "isolate":
      reData = isolate(BetweenTagData);
      break;
    case "head":
      reData = BuildCode11(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2);
      break;
    case "svelte":
      reData = BuildCode9(type, dataTag2, sessionInfo2);
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
import { transform as transform6 } from "esbuild-wasm";
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
async function BuildScript2(filePath, savePath, isTypescript, isDebug, { params, haveSourceMap = isDebug, fileCode, templatePath = filePath, codeMinify = !isDebug } = {}) {
  const Options = {
    format: "cjs",
    loader: isTypescript ? "ts" : "js",
    minify: codeMinify,
    sourcemap: haveSourceMap ? "inline" : false,
    sourcefile: path10.relative(path10.dirname(savePath), filePath),
    define: {
      debug: "" + isDebug
    }
  };
  let Result = await ReplaceBefore(fileCode || await EasyFs_default.readFile(filePath), {});
  Result = template3(Result, isDebug, path10.dirname(templatePath), templatePath, params);
  try {
    const { code, warnings } = await transform6(Result, Options);
    Result = code;
    ESBuildPrintWarnings(filePath, warnings);
  } catch (err) {
    ESBuildPrintError(filePath, err);
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
  const build2 = new StringTracker();
  for (const i of values) {
    const substring = text.substring(i.start, i.end);
    switch (i.name) {
      case "text":
        build2.Plus(substring);
        break;
      case "script":
        build2.Plus$`<%${substring}%>`;
        break;
      case "print":
        build2.Plus$`<%=${substring}%>`;
        break;
      case "escape":
        build2.Plus$`<%:${substring}%>`;
        break;
      default:
        build2.Plus$`<%${addWriteMap[i.name]}${substring}%>`;
    }
  }
  return build2;
}
async function ConvertSyntaxMini(text, find, addEJS) {
  const values = await RazorToEJSMini(text.eq, find);
  const build2 = new StringTracker();
  for (let i = 0; i < values.length; i += 4) {
    if (values[i] != values[i + 1])
      build2.Plus(text.substring(values[i], values[i + 1]));
    const substring = text.substring(values[i + 2], values[i + 3]);
    build2.Plus$`<%${addEJS}${substring}%>`;
  }
  build2.Plus(text.substring((values.at(-1) ?? -1) + 1));
  return build2;
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
    const build2 = new StringTracker();
    build2.AddTextAfterNoTrack(`const __writeArray = []
        var __write;

        function write(text){
            __write.text += text;
        }`);
    for (const i of scripts) {
      build2.AddTextAfterNoTrack(`__write = {text: ''};
            __writeArray.push(__write);`);
      build2.Plus(i);
    }
    build2.AddTextAfterNoTrack(`return __writeArray`);
    return build2;
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
    const build2 = new StringTracker();
    for (const i of parser.values) {
      if (i.type == "text") {
        build2.Plus(i.text);
        continue;
      }
      build2.AddTextAfterNoTrack(buildStrings.pop().text);
    }
    return build2;
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
      const resolve3 = () => this.script;
      doForAll(resolve3);
      this.sessionInfo.cacheCompileScript[this.smallPath] = resolve3;
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
    const build2 = new StringTracker(null, "@[");
    for (const { key, value: value2 } of this.valueArray) {
      build2.Plus$`${key}="${value2.replaceAll('"', '\\"')}"`;
    }
    build2.Plus("]").Plus(this.clearData);
    this.clearData = build2;
  }
  static rebuildBaseInheritance(code) {
    const parse2 = new ParseBasePage();
    const build2 = new StringTracker();
    parse2.parseBase(code);
    for (const name2 of parse2.byValue("inherit")) {
      parse2.pop(name2);
      build2.Plus(`<@${name2}><:${name2}/></@${name2}>`);
    }
    parse2.rebuild();
    return parse2.clearData.Plus(build2);
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
  async buildTagBasic(fileData, tagData, path23, SmallPath, pathName, sessionInfo2, BetweenTagData) {
    fileData = await this.PluginBuild.BuildComponent(fileData, path23, pathName, sessionInfo2);
    fileData = this.parseComponentProps(tagData, fileData);
    fileData = fileData.replace(/<\:reader( )*\/>/gi, BetweenTagData ?? "");
    pathName = pathName + " -> " + SmallPath;
    fileData = await this.StartReplace(fileData, pathName, sessionInfo2);
    fileData = await ParseDebugInfo(fileData, `${pathName} ->
${SmallPath}`);
    return fileData;
  }
  async insertTagData(pathName, type, dataTag2, { BetweenTagData, sessionInfo: sessionInfo2 }) {
    const { data, mapAttributes } = this.tagData(dataTag2), BuildIn = IsInclude(type.eq);
    let fileData, SearchInComment = true, AllPathTypes = {}, addStringInfo;
    if (BuildIn) {
      const { compiledString, checkComponents } = await StartCompiling(pathName, type, data, BetweenTagData ?? new StringTracker(), this, sessionInfo2);
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
        return this.ReBuildTag(type, dataTag2, data, BetweenTagData, (BetweenTagData2) => this.StartReplace(BetweenTagData2, pathName, sessionInfo2));
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
      fileData = await this.buildTagBasic(fileData, data, BuildIn ? type.eq : FullPath2, BuildIn ? type.eq : SmallPath, pathName, sessionInfo2, BetweenTagData);
      addStringInfo && fileData.AddTextBeforeNoTrack(addStringInfo);
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
  async StartReplace(data, pathName, sessionInfo2) {
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
        promiseBuild.push(this.CheckMinHTML(cutStartData), this.insertTagData(pathName, tagType, inTag, { sessionInfo: sessionInfo2 }));
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
      promiseBuild.push(this.CheckMinHTML(cutStartData), this.insertTagData(pathName, tagType, inTag, { BetweenTagData, sessionInfo: sessionInfo2 }));
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
  async Insert(data, pathName, sessionInfo2) {
    data = data.replace(/<!--[\w\W]+?-->/, "");
    data = await this.StartReplace(data, pathName, sessionInfo2);
    data = data.replace(/<\:reader+( )*\/>/gi, '<%typeof page.codebase == "function" ? page.codebase(): write(page.codebase)%>');
    return this.RemoveUnnecessarySpace(data);
  }
};

// src/CompileCode/ScriptTemplate.ts
import path13 from "path";
var PageTemplate = class extends JSParser {
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
    return text;
  }
  static async BuildPage(text, fullPathCompile, sessionInfo2) {
    const builtCode = await PageTemplate.RunAndExport(text, sessionInfo2.fullPath, sessionInfo2.debug);
    return PageTemplate.AddPageTemplate(builtCode, fullPathCompile, sessionInfo2);
  }
  static AddAfterBuild(text, isDebug) {
    if (isDebug) {
      text.AddTextBeforeNoTrack("require('source-map-support').install();");
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
  let DebugString = new StringTracker(sessionInfo2.smallPath, data);
  DebugString = await outPage(DebugString, new StringTracker(DebugString.DefaultInfoText), sessionInfo2.fullPath, sessionInfo2.smallPath, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await PluginBuild.BuildPage(DebugString, sessionInfo2.fullPath, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await Components.Insert(DebugString, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await ParseDebugLine(DebugString, sessionInfo2.smallPath);
  if (nestedPage) {
    return PageTemplate.InPageTemplate(DebugString, nestedPageData, sessionInfo2.fullPath);
  }
  DebugString = await PageTemplate.BuildPage(DebugString, fullPathCompile, sessionInfo2);
  DebugString = await sessionInfo2.BuildScriptWithPrams(DebugString);
  DebugString = PageTemplate.AddAfterBuild(DebugString, sessionInfo2.debug);
  return DebugString;
}

// src/ImportFiles/StaticFiles.ts
import path15 from "path";

// src/ImportFiles/ForStatic/Script.ts
import { transform as transform7 } from "esbuild-wasm";
async function BuildScript3(inputPath, type, isDebug, moreOptions) {
  const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
  const AddOptions = __spreadValues(__spreadValues({
    sourcefile: inputPath + "?source=true",
    sourcemap: isDebug ? "inline" : false,
    minify: SomePlugins("Min" + type.toUpperCase()) || SomePlugins("MinAll")
  }, GetPlugin("transformOptions")), moreOptions);
  let result = await EasyFs_default.readFile(fullPath);
  try {
    const { code, warnings } = await transform7(result, AddOptions);
    result = code;
    ESBuildPrintWarnings(fullPath, warnings);
  } catch (err) {
    ESBuildPrintError(fullPath, err);
  }
  await EasyFs_default.makePathReal(inputPath, getTypes.Static[1]);
  await EasyFs_default.writeFile(fullCompilePath, result);
  return {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  };
}
function BuildJS(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "js", isDebug, void 0);
}
function BuildTS(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "ts", isDebug, { loader: "ts" });
}
function BuildJSX(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "jsx", isDebug, __spreadProps(__spreadValues({}, GetPlugin("JSXOptions") ?? {}), { loader: "jsx" }));
}
function BuildTSX(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "tsx", isDebug, __spreadValues({ loader: "tsx" }, GetPlugin("TSXOptions") ?? {}));
}

// src/ImportFiles/ForStatic/Svelte/client.ts
import * as svelte2 from "svelte/compiler";
import { transform as transform8 } from "esbuild-wasm";
async function BuildScript4(inStaticPath, isDebug) {
  const fullPath = getTypes.Static[0] + inStaticPath, fullCompilePath = getTypes.Static[1] + inStaticPath;
  const { code, dependencies, map } = await preprocess(fullPath, getTypes.Static[2] + "/" + inStaticPath);
  const filename = fullPath.split(/\/|\//).pop();
  const { js, css } = svelte2.compile(code, {
    filename,
    dev: isDebug,
    sourcemap: map,
    css: false,
    hydratable: true,
    sveltePath: "/serv/svelte"
  });
  if (SomePlugins("MinJS") || SomePlugins("MinAll")) {
    try {
      js.code = (await transform8(js.code, {
        minify: true
      })).code;
    } catch (err) {
      PrintIfNew({
        errorName: "minify",
        text: `${err.message} on file -> ${fullPath}`
      });
    }
  }
  if (isDebug) {
    js.map.sources[0].substring(1);
    js.code += "\n//# sourceMappingURL=" + js.map.toUrl();
    if (css.code) {
      css.map.sources[0] = js.map.sources[0];
      css.code += "\n/*# sourceMappingURL=" + css.map.toUrl() + "*/";
    }
  }
  await EasyFs_default.makePathReal(inStaticPath, getTypes.Static[1]);
  await EasyFs_default.writeFile(fullCompilePath + ".js", js.code);
  await EasyFs_default.writeFile(fullCompilePath + ".css", css.code ?? "");
  return __spreadProps(__spreadValues({}, dependencies), {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  });
}

// src/ImportFiles/ForStatic/Style.ts
import sass3 from "sass";
import path14 from "path";
import { fileURLToPath as fileURLToPath7, pathToFileURL as pathToFileURL3 } from "url";
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
    if (result?.loadedUrls) {
      for (const file of result.loadedUrls) {
        const FullPath2 = fileURLToPath7(file);
        dependenceObject[BasicSettings.relative(FullPath2)] = await EasyFs_default.stat(fullPath, "mtimeMs", true, null);
      }
    }
    let data = result.css;
    if (isDebug && result.sourceMap) {
      sassAndSource(result.sourceMap, pathToFileURL3(fileData).href);
      result.sourceMap.sources = result.sourceMap.sources.map((x) => path14.relative(fileDataDirname, fileURLToPath7(x)) + "?source=true");
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
var StaticFilesInfo2 = new StoreJSON("StaticFiles");
async function CheckDependencyChange2(path23) {
  const o = StaticFilesInfo2.store[path23];
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
      dependencies = await BuildScript4(SmallPath, isDebug);
      fullCompilePath += ".js";
  }
  if (isDebug && await EasyFs_default.existsFile(fullCompilePath)) {
    StaticFilesInfo2.update(SmallPath, dependencies);
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
  if (isDebug && !exists2) {
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
    await EasyFs_default.writeFile(FullPathCompile, CompiledData.StringWithTack(FullPathCompile));
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
function compareDependenciesSame(oldDeps, newDeps) {
  for (const name2 in oldDeps) {
    if (name2 == "thisFile") {
      if (newDeps[name2] != oldDeps[name2])
        return false;
    } else if (!compareDependenciesSame(oldDeps[name2], newDeps[name2]))
      return false;
  }
  return true;
}
function getChangeArray(oldDeps, newDeps, parent = "") {
  const changeArray = [];
  for (const name2 in oldDeps) {
    if (name2 == "thisFile") {
      if (newDeps[name2] != oldDeps[name2]) {
        changeArray.push(parent);
        break;
      }
    } else if (!newDeps[name2]) {
      changeArray.push(name2);
      break;
    } else {
      const change = getChangeArray(oldDeps[name2], newDeps[name2], name2);
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
  let fileExists, newDeps;
  if (ReqFile) {
    if (!isDebug || isDebug && ReqFile.status == -1)
      return ReqFile.model;
    fileExists = await EasyFs_default.stat(typeArray[0] + ReqFile.path, "mtimeMs", true, 0);
    if (fileExists) {
      newDeps = await makeDependencies(ReqFile.dependencies, typeArray);
      if (compareDependenciesSame(ReqFile.dependencies, newDeps))
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
      if (haveModel && compareDependenciesSame(haveModel.dependencies, newDeps = newDeps ?? await makeDependencies(haveModel.dependencies, typeArray)))
        LastRequire[copyPath] = haveModel;
      else {
        newDeps = newDeps ?? {};
        LastRequire[copyPath] = { model: await ImportFile(__filename, filePath, typeArray, isDebug, newDeps, haveModel && getChangeArray(haveModel.dependencies, newDeps)), dependencies: newDeps, path: filePath };
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
    const build2 = await BuildPageURL(arrayType, url, smallPath2, code);
    smallPath2 = build2.smallPath, url = build2.url, code = build2.code, fullPageUrl = build2.fullPageUrl, arrayType = build2.arrayType;
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
    get cacheDays() {
      return Settings4.CacheDays;
    },
    set cacheDays(value2) {
      Settings4.CacheDays = value2;
    },
    get cookiesExpiresDays() {
      return CookieSettings.maxAge / 864e5;
    },
    set cookiesExpiresDays(value2) {
      CookieSettings.maxAge = value2 * 864e5;
    },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zy50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlLnRzIiwgIi4uL3NyYy9TdHJpbmdNZXRob2RzL1NwbGl0dGluZy50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvUHJpbnROZXcudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L3dhc20udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1Nlc3Npb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL21hcmtkb3duLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2hlYWQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3R5bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0NvbXBpbGVTdGF0ZS50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NpdGVNYXAudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GaWxlVHlwZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ltcG9ydEZpbGVSdW50aW1lLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQXBpQ2FsbC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0dldFBhZ2VzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvU2V0dGluZ3MudHMiLCAiLi4vc3JjL01haW5CdWlsZC9MaXN0ZW5HcmVlbkxvY2sudHMiLCAiLi4vc3JjL0J1aWxkSW5GdW5jL2xvY2FsU3FsLnRzIiwgIi4uL3NyYy9CdWlsZEluRnVuYy9JbmRleC50cyIsICIuLi9zcmMvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEFwcCBhcyBUaW55QXBwIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vVHlwZXMnO1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzLCByZXF1aXJlU2V0dGluZ3MsIGJ1aWxkRmlyc3RMb2FkLCBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmN9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IGZvcm1pZGFibGUgZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgeyBVcGRhdGVHcmVlbkxvY2sgfSBmcm9tICcuL0xpc3RlbkdyZWVuTG9jayc7XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEFuZFNldHRpbmdzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgY2hhbmdlVVJMUnVsZXMocmVxLCByZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGFuZ2VVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBsZXQgdXJsID0gZmlsZUJ5VXJsLnVybEZpeChyZXEudXJsKTtcblxuICAgIFxuICAgIGZvciAobGV0IGkgb2YgU2V0dGluZ3Mucm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSkge1xuICAgICAgICAgICAgaWYgKGkuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgICAgIGkgPSBpLnN1YnN0cmluZygwLCBpLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgUnVsZUluZGV4ID0gT2JqZWN0LmtleXMoU2V0dGluZ3Mucm91dGluZy5ydWxlcykuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKTtcblxuICAgIGlmIChSdWxlSW5kZXgpIHtcbiAgICAgICAgdXJsID0gYXdhaXQgU2V0dGluZ3Mucm91dGluZy5ydWxlc1tSdWxlSW5kZXhdKHVybCwgcmVxLCByZXMpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIHVybCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbGVyVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCB1cmw6IHN0cmluZykge1xuICAgIGxldCBub3RWYWxpZDogYW55ID0gU2V0dGluZ3Mucm91dGluZy5pZ25vcmVQYXRocy5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpIHx8IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChpID0+IHVybC5lbmRzV2l0aCgnLicraSkpO1xuICAgIFxuICAgIGlmKCFub3RWYWxpZCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsaWQgb2YgU2V0dGluZ3Mucm91dGluZy52YWxpZFBhdGgpeyAvLyBjaGVjayBpZiB1cmwgaXNuJ3QgdmFsaWRcbiAgICAgICAgICAgIGlmKCFhd2FpdCB2YWxpZCh1cmwsIHJlcSwgcmVzKSl7XG4gICAgICAgICAgICAgICAgbm90VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vdFZhbGlkKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IGZpbGVCeVVybC5HZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgdXJsLnN1YnN0cmluZygxKSk7XG59XG5cbmxldCBhcHBPbmxpbmVcblxuLyoqXG4gKiBJdCBzdGFydHMgdGhlIHNlcnZlciBhbmQgdGhlbiBjYWxscyBTdGFydExpc3RpbmdcbiAqIEBwYXJhbSBbU2VydmVyXSAtIFRoZSBzZXJ2ZXIgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIGluIGJ5IHRoZSBjYWxsZXIuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0QXBwKFNlcnZlcj8pIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgVGlueUFwcCgpO1xuICAgIGlmICghU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgYXBwLnVzZSg8YW55PmNvbXByZXNzaW9uKCkpO1xuICAgIH1cbiAgICBmaWxlQnlVcmwuU2V0dGluZ3MuU2Vzc2lvblN0b3JlID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiBTZXR0aW5ncy5taWRkbGV3YXJlLnNlc3Npb24ocmVxLCByZXMsIG5leHQpO1xuXG4gICAgY29uc3QgT3Blbkxpc3RpbmcgPSBhd2FpdCBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpO1xuXG4gICAgZm9yIChjb25zdCBmdW5jIG9mIFNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIGF3YWl0IGZ1bmMoYXBwLCBhcHBPbmxpbmUuc2VydmVyLCBTZXR0aW5ncyk7XG4gICAgfVxuICAgIGF3YWl0IHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpPy4oKVxuXG4gICAgYXBwLmFsbChcIipcIiwgUGFyc2VSZXF1ZXN0KTtcblxuICAgIGF3YWl0IE9wZW5MaXN0aW5nKFNldHRpbmdzLnNlcnZlLnBvcnQpO1xuXG4gICAgY29uc29sZS5sb2coXCJBcHAgbGlzdGluZyBhdCBwb3J0OiBcIiArIFNldHRpbmdzLnNlcnZlLnBvcnQpO1xufVxuXG4vKipcbiAqIElmIHRoZSByZXF1ZXN0IGlzIGEgUE9TVCByZXF1ZXN0LCB0aGVuIHBhcnNlIHRoZSByZXF1ZXN0IGJvZHksIHRoZW4gc2VuZCBpdCB0byByb3V0aW5nIHNldHRpbmdzXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcSAtIFRoZSBpbmNvbWluZyByZXF1ZXN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC0gUmVzcG9uc2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gUGFyc2VSZXF1ZXN0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChyZXEubWV0aG9kID09ICdQT1NUJykge1xuICAgICAgICBpZiAocmVxLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddPy5zdGFydHNXaXRoPy4oJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICAgICAgU2V0dGluZ3MubWlkZGxld2FyZS5ib2R5UGFyc2VyKHJlcSwgcmVzLCAoKSA9PiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybShTZXR0aW5ncy5taWRkbGV3YXJlLmZvcm1pZGFibGUpLnBhcnNlKHJlcSwgKGVyciwgZmllbGRzLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVxLmZpZWxkcyA9IGZpZWxkcztcbiAgICAgICAgICAgICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKSB7XG4gICAgaWYgKGFwcE9ubGluZSAmJiBhcHBPbmxpbmUuY2xvc2UpIHtcbiAgICAgICAgYXdhaXQgYXBwT25saW5lLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZXJ2ZXIsIGxpc3RlbiwgY2xvc2UgfSA9IGF3YWl0IFNlcnZlcihhcHApO1xuXG4gICAgYXBwT25saW5lID0geyBzZXJ2ZXIsIGNsb3NlIH07XG5cbiAgICByZXR1cm4gbGlzdGVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTdGFydFNlcnZlcih7IFNpdGVQYXRoID0gJ1dlYnNpdGUnLCBIdHRwU2VydmVyID0gVXBkYXRlR3JlZW5Mb2NrIH0gPSB7fSkge1xuICAgIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciA9IFNpdGVQYXRoO1xuICAgIGJ1aWxkRmlyc3RMb2FkKCk7XG4gICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgU3RhcnRBcHAoSHR0cFNlcnZlcik7XG59XG5cbmV4cG9ydCB7IFNldHRpbmdzIH07IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcmludE1vZGUpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICB9XG59KTsiLCAiaW1wb3J0IHtEaXJlbnR9IGZyb20gJ2ZzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7Y3dkfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tICd1cmwnXG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5hc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgZ2V0RGlybmFtZSxcbiAgICBTeXN0ZW1EYXRhLFxuICAgIHdvcmtpbmdEaXJlY3RvcnksXG4gICAgRGVsZXRlSW5EaXJlY3RvcnksXG4gICAgZ2V0VHlwZXMsXG4gICAgQmFzaWNTZXR0aW5nc1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vLi4vSlNQYXJzZXInO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVRleHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGA8JXs/ZGVidWdfZmlsZT99JHtpLnRleHR9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlU2NyaXB0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGBydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdMaW5lKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VUZXh0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZXIuc3RhcnQgPSBcIjwlXCI7XG4gICAgcGFyc2VyLmVuZCA9IFwiJT5cIjtcbiAgICByZXR1cm4gcGFyc2VyLlJlQnVpbGRUZXh0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdJbmZvKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IFBhcnNlU2NyaXB0Q29kZShjb2RlLCBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEFkZERlYnVnSW5mbyhwYWdlTmFtZTpzdHJpbmcsIEZ1bGxQYXRoOnN0cmluZywgU21hbGxQYXRoOnN0cmluZywgY2FjaGU6IHt2YWx1ZT86IHN0cmluZ30gPSB7fSl7XG4gICAgaWYoIWNhY2hlLnZhbHVlKVxuICAgICAgICBjYWNoZS52YWx1ZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsUGF0aCwgJ3V0ZjgnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbERhdGE6IG5ldyBTdHJpbmdUcmFja2VyKGAke3BhZ2VOYW1lfTxsaW5lPiR7U21hbGxQYXRofWAsIGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChwYWdlTmFtZSl9XFxgOyU+YFxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aDogc3RyaW5nLCBpbnB1dFBhdGg6IHN0cmluZywgZm9sZGVyOnN0cmluZywgcGFnZVR5cGU6c3RyaW5nLCBwYXRoVHlwZSA9IDApIHtcbiAgICBpZiAocGFnZVR5cGUgJiYgIWlucHV0UGF0aC5lbmRzV2l0aCgnLicgKyBwYWdlVHlwZSkpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7aW5wdXRQYXRofS4ke3BhZ2VUeXBlfWA7XG4gICAgfVxuXG4gICAgaWYoaW5wdXRQYXRoWzBdID09ICdeJyl7IC8vIGxvYWQgZnJvbSBwYWNrYWdlc1xuICAgICAgICBjb25zdCBbcGFja2FnZU5hbWUsIGluUGF0aF0gPSBTcGxpdEZpcnN0KCcvJywgIGlucHV0UGF0aC5zdWJzdHJpbmcoMSkpO1xuICAgICAgICByZXR1cm4gKHBhdGhUeXBlID09IDAgPyB3b3JraW5nRGlyZWN0b3J5OiAnJykgKyBgbm9kZV9tb2R1bGVzLyR7cGFja2FnZU5hbWV9LyR7Zm9sZGVyfS8ke2luUGF0aH1gO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChpbnB1dFBhdGhbMV0gPT0gJy8nKSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDIpO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGAke3BhdGguZGlybmFtZShmaWxlUGF0aCl9LyR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIGlmIChpbnB1dFBhdGhbMF0gPT0gJy8nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2dldFR5cGVzLlN0YXRpY1twYXRoVHlwZV19JHtpbnB1dFBhdGh9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArICcvJyA6ICcnfSR7Zm9sZGVyfS8ke2lucHV0UGF0aH1gO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZShpbnB1dFBhdGgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGhUeXBlcyB7XG4gICAgU21hbGxQYXRoV2l0aG91dEZvbGRlcj86IHN0cmluZyxcbiAgICBTbWFsbFBhdGg/OiBzdHJpbmcsXG4gICAgRnVsbFBhdGg/OiBzdHJpbmcsXG4gICAgRnVsbFBhdGhDb21waWxlPzogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIENyZWF0ZUZpbGVQYXRoKGZpbGVQYXRoOnN0cmluZywgc21hbGxQYXRoOnN0cmluZywgaW5wdXRQYXRoOnN0cmluZywgZm9sZGVyOnN0cmluZywgcGFnZVR5cGU6IHN0cmluZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIFNtYWxsUGF0aDogQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKHNtYWxsUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlLCAyKSxcbiAgICAgICAgRnVsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlKSxcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUGFyc2VEZWJ1Z0xpbmUsXG4gICAgQ3JlYXRlRmlsZVBhdGgsXG4gICAgUGFyc2VEZWJ1Z0luZm9cbn07IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4vU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBHZW5lcmF0b3IsIFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJvdGVjdGVkIG1hcDogU291cmNlTWFwR2VuZXJhdG9yO1xuICAgIHByb3RlY3RlZCBmaWxlRGlyTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBsaW5lQ291bnQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBodHRwU291cmNlID0gdHJ1ZSwgcHJvdGVjdGVkIHJlbGF0aXZlID0gZmFsc2UsIHByb3RlY3RlZCBpc0NzcyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgICAgICAgICBmaWxlOiBmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5wb3AoKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWh0dHBTb3VyY2UpXG4gICAgICAgICAgICB0aGlzLmZpbGVEaXJOYW1lID0gcGF0aC5kaXJuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTb3VyY2Uoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgICAgc291cmNlID0gc291cmNlLnNwbGl0KCc8bGluZT4nKS5wb3AoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaHR0cFNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMocGF0aC5leHRuYW1lKHNvdXJjZSkuc3Vic3RyaW5nKDEpKSlcbiAgICAgICAgICAgICAgICBzb3VyY2UgKz0gJy5zb3VyY2UnO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IFNwbGl0Rmlyc3QoJy8nLCBzb3VyY2UpLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoKHRoaXMucmVsYXRpdmUgPyAnJzogJy8nKSArIHNvdXJjZS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRoaXMuZmlsZURpck5hbWUsIEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc291cmNlKTtcbiAgICB9XG5cbiAgICBnZXRSb3dTb3VyY2VNYXAoKTogUmF3U291cmNlTWFwe1xuICAgICAgICByZXR1cm4gKDxhbnk+dGhpcy5tYXApLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICBsZXQgbWFwU3RyaW5nID0gYHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20odGhpcy5tYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgICAgICBpZiAodGhpcy5pc0NzcylcbiAgICAgICAgICAgIG1hcFN0cmluZyA9IGAvKiMgJHttYXBTdHJpbmd9Ki9gXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgICAgICByZXR1cm4gJ1xcclxcbicgKyBtYXBTdHJpbmc7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VNYXBTdG9yZSBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcml2YXRlIHN0b3JlU3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Mb2FkOiB7IG5hbWU6IHN0cmluZywgZGF0YTogYW55W10gfVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgZGVidWcgPSB0cnVlLCBpc0NzcyA9IGZhbHNlLCBodHRwU291cmNlID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgZmFsc2UsIGlzQ3NzKTtcbiAgICB9XG5cbiAgICBub3RFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uTG9hZC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGFkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTdHJpbmdUcmFja2VyJywgZGF0YTogW3RyYWNrLCB7dGV4dH1dIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuXG4gICAgYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkVGV4dCcsIGRhdGE6IFt0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHRoaXMubGluZUNvdW50ICs9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VVJMU291cmNlTWFwKG1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1hcC5zb3VyY2VzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIG1hcC5zb3VyY2VzW2ldID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKG1hcC5zb3VyY2VzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG5cbiAgICBhc3luYyBhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbZnJvbU1hcCwgdHJhY2ssIHRleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkuZWFjaE1hcHBpbmcoKG0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFJbmZvID0gdHJhY2suZ2V0TGluZShtLm9yaWdpbmFsTGluZSkuZ2V0RGF0YUFycmF5KClbMF07XG5cbiAgICAgICAgICAgIGlmIChtLnNvdXJjZSA9PSB0aGlzLmZpbGVQYXRoKVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogZGF0YUluZm8ubGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUgKyB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hZGRUZXh0KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRBbGwoKSB7XG4gICAgICAgIGZvciAoY29uc3QgeyBuYW1lLCBkYXRhIH0gb2YgdGhpcy5hY3Rpb25Mb2FkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkVGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRUZXh0KC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICB0aGlzLmJ1aWxkQWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpXG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YVdpdGhNYXAoKSB7XG4gICAgICAgIHRoaXMuYnVpbGRBbGwoKTtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmcgKyBzdXBlci5tYXBBc1VSTENvbW1lbnQoKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBTb3VyY2VNYXBTdG9yZSh0aGlzLmZpbGVQYXRoLCB0aGlzLmRlYnVnLCB0aGlzLmlzQ3NzLCB0aGlzLmh0dHBTb3VyY2UpO1xuICAgICAgICBjb3B5LmFjdGlvbkxvYWQucHVzaCguLi50aGlzLmFjdGlvbkxvYWQpXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5pbnRlcmZhY2UgZ2xvYmFsU3RyaW5nPFQ+IHtcbiAgICBpbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIGxhc3RJbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIHN0YXJ0c1dpdGgoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3BsaXRGaXJzdDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+Pih0eXBlOiBzdHJpbmcsIHN0cmluZzogVCk6IFRbXSB7XG4gICAgY29uc3QgaW5kZXggPSBzdHJpbmcuaW5kZXhPZih0eXBlKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSlcbiAgICAgICAgcmV0dXJuIFtzdHJpbmddO1xuXG4gICAgcmV0dXJuIFtzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGV4KSwgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIHR5cGUubGVuZ3RoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDdXRUaGVMYXN0KHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YodHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0ZW5zaW9uPFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0cmluZzogVCkge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1UeXBlKHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICB3aGlsZSAoc3RyaW5nLnN0YXJ0c1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcodHlwZS5sZW5ndGgpO1xuXG4gICAgd2hpbGUgKHN0cmluZy5lbmRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGVuZ3RoIC0gdHlwZS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0cmluZ1N0YXJ0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0YXJ0OiBzdHJpbmcsIHN0cmluZzogVCk6IFQge1xuICAgIGlmKHN0cmluZy5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyaW5nO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBCYXNpYyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5cbmNsYXNzIGNyZWF0ZVBhZ2VTb3VyY2VNYXAgZXh0ZW5kcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZSA9IGZhbHNlLCByZWxhdGl2ZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgICAgIHRoaXMubGluZUNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBhZGRNYXBwaW5nRnJvbVRyYWNrKHRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IHRleHQsIGxpbmUsIGluZm8gfSA9IERhdGFBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0ID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3YWl0TmV4dExpbmUgJiYgbGluZSAmJiBpbmZvKSB7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UoaW5mbylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0TWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHN0b3JlTWFwLmdldFJvd1NvdXJjZU1hcCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0V2l0aE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHRleHQuZXEgKyBzdG9yZU1hcC5tYXBBc1VSTENvbW1lbnQoKTtcbn0iLCAiaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgb3V0cHV0TWFwLCBvdXRwdXRXaXRoTWFwIH0gZnJvbSBcIi4vU3RyaW5nVHJhY2tlclRvU291cmNlTWFwXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICB0ZXh0Pzogc3RyaW5nLFxuICAgIGluZm86IHN0cmluZyxcbiAgICBsaW5lPzogbnVtYmVyLFxuICAgIGNoYXI/OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFN0cmluZ0luZGV4ZXJJbmZvIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGxlbmd0aDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlNYXRjaCBleHRlbmRzIEFycmF5PFN0cmluZ1RyYWNrZXI+IHtcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBpbnB1dD86IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyaW5nVHJhY2tlciB7XG4gICAgcHJpdmF0ZSBEYXRhQXJyYXk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mb1tdID0gW107XG4gICAgcHVibGljIEluZm9UZXh0OiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBPbkxpbmUgPSAxO1xuICAgIHB1YmxpYyBPbkNoYXIgPSAxO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBJbmZvVGV4dCB0ZXh0IGluZm8gZm9yIGFsbCBuZXcgc3RyaW5nIHRoYXQgYXJlIGNyZWF0ZWQgaW4gdGhpcyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoSW5mbz86IHN0cmluZyB8IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgdGV4dD86IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIEluZm8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvO1xuICAgICAgICB9IGVsc2UgaWYgKEluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdChJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkFkZEZpbGVUZXh0KHRleHQsIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgZ2V0IGVtcHR5SW5mbygpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldERlZmF1bHQoSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0KSB7XG4gICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvLmluZm87XG4gICAgICAgIHRoaXMuT25MaW5lID0gSW5mby5saW5lO1xuICAgICAgICB0aGlzLk9uQ2hhciA9IEluZm8uY2hhcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGF0YUFycmF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGxhc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IERlZmF1bHRJbmZvVGV4dCgpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICBpZiAoIXRoaXMuRGF0YUFycmF5LmZpbmQoeCA9PiB4LmluZm8pICYmIHRoaXMuSW5mb1RleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiB0aGlzLkluZm9UZXh0LFxuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuT25MaW5lLFxuICAgICAgICAgICAgICAgIGNoYXI6IHRoaXMuT25DaGFyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbdGhpcy5EYXRhQXJyYXkubGVuZ3RoIC0gMV0gPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGZpcnN0IEluZm9UZXh0XG4gICAgICovXG4gICAgZ2V0IFN0YXJ0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5WzBdID8/IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgYXMgb25lIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0IE9uZVN0cmluZygpIHtcbiAgICAgICAgbGV0IGJpZ1N0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGJpZ1N0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmlnU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgc28geW91IGNhbiBjaGVjayBpZiBpdCBlcXVhbCBvciBub3RcbiAgICAgKiB1c2UgbGlrZSB0aGF0OiBteVN0cmluZy5lcSA9PSBcImNvb2xcIlxuICAgICAqL1xuICAgIGdldCBlcSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgaW5mbyBhYm91dCB0aGlzIHRleHRcbiAgICAgKi9cbiAgICBnZXQgbGluZUluZm8oKSB7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgY29uc3QgcyA9IGQuaW5mby5zcGxpdCgnPGxpbmU+Jyk7XG4gICAgICAgIHMucHVzaChCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHMucG9wKCkpO1xuXG4gICAgICAgIHJldHVybiBgJHtzLmpvaW4oJzxsaW5lPicpfToke2QubGluZX06JHtkLmNoYXJ9YDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGxlbmd0aCBvZiB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIGNvcHkgb2YgdGhpcyBzdHJpbmcgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIENsb25lKCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld0RhdGEuQWRkVGV4dEFmdGVyKGkudGV4dCwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBZGRDbG9uZShkYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goLi4uZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLkRhdGFBcnJheS51bnNoaWZ0KC4uLmNvcHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgVGV4dCBGaWxlIFRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRGaWxlVGV4dCh0ZXh0OiBzdHJpbmcsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKSB7XG4gICAgICAgIGxldCBMaW5lQ291bnQgPSAxLCBDaGFyQ291bnQgPSAxO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzaW1wbGUgbWV0aG9mIHRvIGN1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBuZXcgY3V0dGVkIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQ3V0U3RyaW5nKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuXG4gICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucHVzaCguLi50aGlzLkRhdGFBcnJheS5zbGljZShzdGFydCwgZW5kKSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG5cbiAgICAgICAgd2hpbGUgKChsaW1pdCA9PSBudWxsIHx8IGNvdW50ZXIgPCBsaW1pdCkgJiYgaGFzTWF0aD8uWzBdPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IFsuLi5oYXNNYXRoWzBdXS5sZW5ndGgsIGluZGV4ID0gdGhpcy5jaGFyTGVuZ3RoKGhhc01hdGguaW5kZXgpO1xuICAgICAgICAgICAgYWxsU3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4ICsgYWRkTmV4dCxcbiAgICAgICAgICAgICAgICBsZW5ndGhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYWluVGV4dCA9IG1haW5UZXh0LnNsaWNlKGhhc01hdGguaW5kZXggKyBoYXNNYXRoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGpvaW4oYXJyOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBsZXQgYWxsID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgYXJyKXtcbiAgICAgICAgICAgIGFsbC5BZGRDbG9uZShpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXBsYWNlckFzeW5jKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhhd2FpdCBmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbCwgc2Fzc1N0YWNrIH06IHsgc2Fzc1N0YWNrPzogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBsb2NhdGlvbj86IHsgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciB9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXIgfSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChzYXNzU3RhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICAgICAgICAgIGxpbmUgPSBsb2NbMF07XG4gICAgICAgICAgICBjb2wgPSBsb2NbMV07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZShsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEpLCBjb2x1bW4gPSBjb2wgPz8gbG9jYXRpb24/LmNvbHVtbiA/PyAwO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKChsaW5lID8/IGxvY2F0aW9uPy5saW5lKSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gc2VhcmNoTGluZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIHJldHVybiBgJHt0ZXh0IHx8IG1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGh9JHtkYXRhLmluZm8uc3BsaXQoJzxsaW5lPicpLnNoaWZ0KCl9OiR7ZGF0YS5saW5lfToke2NvbHVtbn1gO1xuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdXaXRoVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gb3V0cHV0V2l0aE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uKVxuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgICAgIHJldHVybiBvdXRwdXRNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbiwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpXG4gICAgfVxufSIsICJpbXBvcnQge3Byb21pc2VzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmNvbnN0IGxvYWRQYXRoID0gdHlwZW9mIGVzYnVpbGQgIT09ICd1bmRlZmluZWQnID8gJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvJzogJy8uLi8nO1xuY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwgKyBsb2FkUGF0aCArICdidWlsZC53YXNtJykpKTtcbmNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG5jb25zdCB3YXNtID0gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5sZXQgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldFVpbnQ4TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQ4TWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQ4TWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RW5jb2RlciA6IFRleHRFbmNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgbFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbShwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXIodGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXIocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxubGV0IGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRJbnQzMk1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRJbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRJbnQzMk1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dERlY29kZXIgOiBUZXh0RGVjb2RlcjtcblxubGV0IGNhY2hlZFRleHREZWNvZGVyID0gbmV3IGxUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG4vKipcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2Vycm9ycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5nZXRfZXJyb3JzKHJldHB0cik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gYmxvY2tcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfYmxvY2sodGV4dCwgYmxvY2spIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGJsb2NrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfYmxvY2socHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSBza2lwX3NwZWNpYWxfdGFnXG4qIEBwYXJhbSB7c3RyaW5nfSBzaW1wbGVfc2tpcFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfY29tcG9uZW50KHNraXBfc3BlY2lhbF90YWcsIHNpbXBsZV9za2lwKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChza2lwX3NwZWNpYWxfdGFnLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzaW1wbGVfc2tpcCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHdhc20uaW5zZXJ0X2NvbXBvbmVudChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgZW5kX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZF90eXBlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfZGVmKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gcV90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX3EodGV4dCwgcV90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfcShwdHIwLCBsZW4wLCBxX3R5cGUuY29kZVBvaW50QXQoMCkpO1xuICAgIHJldHVybiByZXQgPj4+IDA7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanModGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanNfbWluKHRleHQsIG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKG5hbWUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzX21pbihyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZWpzX3BhcnNlKHRleHQsIHN0YXJ0LCBlbmQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHN0YXJ0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMiA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5lanNfcGFyc2UocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwdHIyLCBsZW4yKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBjb25zdCBTaW1wbGVTa2lwID0gWyd0ZXh0YXJlYScsJ3NjcmlwdCcsICdzdHlsZSddO1xuZXhwb3J0IGNvbnN0IFNraXBTcGVjaWFsVGFnID0gW1tcIiVcIiwgXCIlXCJdLCBbXCIje2RlYnVnfVwiLCBcIntkZWJ1Z30jXCJdXTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgZmluZF9lbmRfb2ZfZGVmLCBmaW5kX2VuZF9vZl9xLCBmaW5kX2VuZF9ibG9jayB9IGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyc7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMnO1xuaW1wb3J0IHsgZ2V0RGlybmFtZSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBlbmQgb2YgcXVvdGF0aW9uIG1hcmtzLCBza2lwcGluZyB0aGluZ3MgbGlrZSBlc2NhcGluZzogXCJcXFxcXCJcIlxuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW50T2ZRKHRleHQ6IHN0cmluZywgcVR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9xKHRleHQsIHFUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGNoYXIgc2tpcHBpbmcgZGF0YSBpbnNpZGUgcXVvdGF0aW9uIG1hcmtzXG4gICAgICogQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIGZpbmRFbmRPZkRlZih0ZXh0OiBzdHJpbmcsIEVuZFR5cGU6IHN0cmluZ1tdIHwgc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KEVuZFR5cGUpKSB7XG4gICAgICAgICAgICBFbmRUeXBlID0gW0VuZFR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBKU09OLnN0cmluZ2lmeShFbmRUeXBlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2FtZSBhcyAnZmluZEVuZE9mRGVmJyBvbmx5IHdpdGggb3B0aW9uIHRvIGN1c3RvbSAnb3BlbicgYW5kICdjbG9zZSdcbiAgICAgKiBgYGBqc1xuICAgICAqIEZpbmRFbmRPZkJsb2NrKGBjb29sIFwifVwiIHsgZGF0YSB9IH0gbmV4dGAsICd7JywgJ30nKVxuICAgICAqIGBgYFxuICAgICAqIGl0IHdpbGwgcmV0dXJuIHRoZSAxOCAtPiBcIn0gbmV4dFwiXG4gICAgICogIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBGaW5kRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIG9wZW46IHN0cmluZywgZW5kOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfYmxvY2sodGV4dCwgb3BlbiArIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgU2ltcGxlU2tpcDogc3RyaW5nW10gPSBTZXR0aW5ncy5TaW1wbGVTa2lwO1xuICAgIFNraXBTcGVjaWFsVGFnOiBzdHJpbmdbXVtdID0gU2V0dGluZ3MuU2tpcFNwZWNpYWxUYWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW50TmV3PzogYW55KSB7IH1cblxuICAgIHByaXZhdGUgcHJpbnRFcnJvcnModGV4dDogU3RyaW5nVHJhY2tlciwgZXJyb3JzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByaW50TmV3KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIEpTT04ucGFyc2UoZXJyb3JzKS5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXcoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7aS50eXBlX25hbWV9XCIsIHVzZWQgaW46ICR7dGV4dC5hdChOdW1iZXIoaS5pbmRleCkpLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXIodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFyJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFySFRNTCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXJIVE1MJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cbn1cblxudHlwZSBQYXJzZUJsb2NrcyA9IHsgbmFtZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciB9W11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlModGV4dDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKUycsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKU01pbmkodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTTWluaScsIFt0ZXh0LGZpbmRdKSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVKU1BhcnNlcih0ZXh0OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnRUpTUGFyc2VyJywgW3RleHQsIHN0YXJ0LCBlbmRdKSk7XG59IiwgIlxuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuaW50ZXJmYWNlIFNwbGl0VGV4dCB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHR5cGVfbmFtZTogc3RyaW5nLFxuICAgIGlzX3NraXA6IGJvb2xlYW5cbn1cblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcGFyc2Vfc3RyZWFtID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL3JlYWRlci93b3JrZXIuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dFN0cmVhbSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFNwbGl0VGV4dFtdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2J1aWxkX3N0cmVhbScsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZEZWZTa2lwQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZmluZF9lbmRfb2ZfZGVmX3NraXBfYmxvY2snLCBbdGV4dCwgSlNPTi5zdHJpbmdpZnkodHlwZXMpXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2VuZF9vZl9ibG9jaycsIFt0ZXh0LCB0eXBlcy5qb2luKCcnKV0pO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgUmVwbGFjZUFsbCh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQuc3BsaXQoZmluZCkpIHtcbiAgICAgICAgICAgIG5ld1RleHQgKz0gcmVwbGFjZSArIGk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dC5zdWJzdHJpbmcocmVwbGFjZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuXG5hYnN0cmFjdCBjbGFzcyBSZUJ1aWxkQ29kZUJhc2ljIGV4dGVuZHMgQmFzZUVudGl0eUNvZGUge1xuICAgIHB1YmxpYyBQYXJzZUFycmF5OiBTcGxpdFRleHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuUGFyc2VBcnJheSA9IFBhcnNlQXJyYXk7XG4gICAgfVxuXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBsZXQgT3V0U3RyaW5nID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBPdXRTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUmVwbGFjZUFsbChPdXRTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuXG5cbnR5cGUgRGF0YUNvZGVJbmZvID0ge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbnB1dHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBjbGFzcyBSZUJ1aWxkQ29kZVN0cmluZyBleHRlbmRzIFJlQnVpbGRDb2RlQmFzaWMge1xuICAgIHByaXZhdGUgRGF0YUNvZGU6IERhdGFDb2RlSW5mbztcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKFBhcnNlQXJyYXkpO1xuICAgICAgICB0aGlzLkRhdGFDb2RlID0geyB0ZXh0OiBcIlwiLCBpbnB1dHM6IFtdIH07XG4gICAgICAgIHRoaXMuQ3JlYXRlRGF0YUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgQ29kZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUudGV4dDtcbiAgICB9XG5cbiAgICBzZXQgQ29kZUJ1aWxkVGV4dCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgQWxsSW5wdXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDcmVhdGVEYXRhQ29kZSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGkuaXNfc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBgPHwke3RoaXMuRGF0YUNvZGUuaW5wdXRzLmxlbmd0aH18JHtpLnR5cGVfbmFtZSA/PyAnJ318PmA7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS5pbnB1dHMucHVzaChpLnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIDx8fD4gc3RhcnQgd2l0aCBhICgrLikgbGlrZSB0aGF0IGZvciBleGFtcGxlLCBcIisuPHx8PlwiLCB0aGUgdXBkYXRlIGZ1bmN0aW9uIHdpbGwgZ2V0IHRoZSBsYXN0IFwiU2tpcFRleHRcIiBpbnN0ZWFkIGdldHRpbmcgdGhlIG5ldyBvbmVcbiAgICAgKiBzYW1lIHdpdGggYSAoLS4pIGp1c3QgZm9yIGlnbm9yaW5nIGN1cnJlbnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB0aGUgYnVpbGRlZCBjb2RlXG4gICAgICovXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkRhdGFDb2RlLnRleHQucmVwbGFjZSgvPFxcfChbMC05XSspXFx8W1xcd10qXFx8Pi9naSwgKF8sIGcxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHNbZzFdO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuUmVwbGFjZUFsbChuZXdTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoXG4gICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmIChjb3VudCAhPSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBXaXRoSW5mby5QbHVzKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFdpdGhJbmZvO1xuICAgIH1cblxuICAgIGFzeW5jIGZpbmRTY3JpcHRzKCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBFSlNQYXJzZXIodGhpcy50ZXh0LmVxLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgbGV0IHN1YnN0cmluZyA9IHRoaXMudGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBpLm5hbWU7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGUoJHtzdWJzdHJpbmd9KTtgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlc2NhcGVcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZVNhZmUoJHtzdWJzdHJpbmd9KTtgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWJ1Z1wiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYFxcbnJ1bl9zY3JpcHRfbmFtZSA9IFxcYCR7SlNQYXJzZXIuZml4VGV4dChzdWJzdHJpbmcpfVxcYDtgXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnbm8tdHJhY2snO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogc3Vic3RyaW5nLFxuICAgICAgICAgICAgICAgIHR5cGU6IDxhbnk+dHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dCh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL2AvZ2ksICdcXFxcYCcpLnJlcGxhY2UoL1xcJC9naSwgJ1xcXFx1MDAyNCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0U2ltcGxlUXVvdGVzKHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpO1xuICAgIH1cblxuICAgIFJlQnVpbGRUZXh0KCkge1xuICAgICAgICBjb25zdCBhbGxjb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaS50eXBlID09ICduby10cmFjaycpIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgJyEnLCBpLnRleHQsIHRoaXMuZW5kKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgaS50ZXh0LCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsY29kZTtcbiAgICB9XG5cbiAgICBCdWlsZEFsbChpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHJ1blNjcmlwdCA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuXG4gICAgICAgIGlmICghdGhpcy52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMkYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRGVidWcgJiYgaS50eXBlID09ICdzY3JpcHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYFxcbnJ1bl9zY3JpcHRfY29kZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmlwdFdpdGhJbmZvKGkudGV4dClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcmludEVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYDxwIHN0eWxlPVwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcIj4ke21lc3NhZ2V9PC9wPmA7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIFJ1bkFuZEV4cG9ydCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRleHQsIHBhdGgpXG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLkJ1aWxkQWxsKGlzRGVidWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHNwbGl0MkZyb21FbmQodGV4dDogc3RyaW5nLCBzcGxpdENoYXI6IHN0cmluZywgbnVtVG9TcGxpdEZyb21FbmQgPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0ZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PSBzcGxpdENoYXIpIHtcbiAgICAgICAgICAgICAgICBudW1Ub1NwbGl0RnJvbUVuZC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtVG9TcGxpdEZyb21FbmQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdGV4dC5zdWJzdHJpbmcoMCwgaSksIHRleHQuc3Vic3RyaW5nKGkgKyAxKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RleHRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBSZXN0b3JlVHJhY2sodGV4dDogc3RyaW5nLCBkZWZhdWx0SW5mbzogU3RyaW5nVHJhY2tlckRhdGFJbmZvKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrZXIgPSBuZXcgU3RyaW5nVHJhY2tlcihkZWZhdWx0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsTGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4vLyEnKTtcblxuICAgICAgICB0cmFja2VyLlBsdXMoYWxsTGluZXMuc2hpZnQoKSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbExpbmVzKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvTGluZSA9IGkuc3BsaXQoJ1xcbicsIDEpLnBvcCgpLCBkYXRhVGV4dCA9IGkuc3Vic3RyaW5nKGluZm9MaW5lLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtpbmZvVGV4dCwgbnVtYmVyc10gPSBKU1BhcnNlci5zcGxpdDJGcm9tRW5kKGluZm9MaW5lLCAnOicsIDIpLCBbbGluZSwgY2hhcl0gPSBudW1iZXJzLnNwbGl0KCc6Jyk7XG5cbiAgICAgICAgICAgIHRyYWNrZXIuUGx1cyhuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnXFxuLy8hJyArIGluZm9MaW5lKSk7XG4gICAgICAgICAgICB0cmFja2VyLkFkZFRleHRBZnRlcihkYXRhVGV4dCwgaW5mb1RleHQsIE51bWJlcihsaW5lKSAtIDEsIE51bWJlcihjaGFyKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJhY2tlcjtcbiAgICB9XG59XG5cblxuLy9idWlsZCBzcGVjaWFsIGNsYXNzIGZvciBwYXJzZXIgY29tbWVudHMgLyoqLyBzbyB5b3UgYmUgYWJsZSB0byBhZGQgUmF6b3IgaW5zaWRlIG9mIHN0eWxlIG90IHNjcmlwdCB0YWdcblxuaW50ZXJmYWNlIEdsb2JhbFJlcGxhY2VBcnJheSB7XG4gICAgdHlwZTogJ3NjcmlwdCcgfCAnbm8tdHJhY2snLFxuICAgIHRleHQ6IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGNsYXNzIEVuYWJsZUdsb2JhbFJlcGxhY2Uge1xuICAgIHByaXZhdGUgc2F2ZWRCdWlsZERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheVtdID0gW107XG4gICAgcHJpdmF0ZSBidWlsZENvZGU6IFJlQnVpbGRDb2RlU3RyaW5nO1xuICAgIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVwbGFjZXI6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRkVGV4dCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlciA9IFJlZ0V4cChgJHthZGRUZXh0fVxcXFwvXFxcXCohc3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5cXFxcKlxcXFwvfHN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+YCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5idWlsZENvZGUgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcoYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGF3YWl0IHRoaXMuRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGUpKSk7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBFeHRyYWN0QW5kU2F2ZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29kZSA9IG5ldyBKU1BhcnNlcihjb2RlLCB0aGlzLnBhdGgpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29kZS5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29kZS52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRCdWlsZERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGkudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBgc3lzdGVtLS08fGVqc3wke2NvdW50ZXIrK318PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFBhcnNlT3V0c2lkZU9mQ29tbWVudCh0ZXh0OiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2VyKC9zeXN0ZW0tLTxcXHxlanNcXHwoWzAtOV0pXFx8Pi8sIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBTcGxpdFRvUmVwbGFjZVsxXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihpbmRleC5TdGFydEluZm8pLlBsdXMkYCR7dGhpcy5hZGRUZXh0fS8qIXN5c3RlbS0tPHxlanN8JHtpbmRleH18PiovYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIFN0YXJ0QnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb21tZW50cyA9IG5ldyBKU1BhcnNlcihuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0KSwgdGhpcy5wYXRoLCAnLyonLCAnKi8nKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvbW1lbnRzLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb21tZW50cy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gdGhpcy5QYXJzZU91dHNpZGVPZkNvbW1lbnQoaS50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQgPSBleHRyYWN0Q29tbWVudHMuUmVCdWlsZFRleHQoKS5lcTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2RlLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVzdG9yZUFzQ29kZShEYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKERhdGEudGV4dC5TdGFydEluZm8pLlBsdXMkYDwlJHtEYXRhLnR5cGUgPT0gJ25vLXRyYWNrJyA/ICchJzogJyd9JHtEYXRhLnRleHR9JT5gO1xuICAgIH1cblxuICAgIHB1YmxpYyBSZXN0b3JlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2VyKHRoaXMucmVwbGFjZXIsIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIoU3BsaXRUb1JlcGxhY2VbMV0gPz8gU3BsaXRUb1JlcGxhY2VbMl0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5SZXN0b3JlQXNDb2RlKHRoaXMuc2F2ZWRCdWlsZERhdGFbaW5kZXhdKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBidWlsZCwgTWVzc2FnZSwgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi9wcmludE1lc3NhZ2UnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlKUyh0ZXh0OiBzdHJpbmcsIHRyYWNrZXI6IFN0cmluZ1RyYWNrZXIpe1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCB3YXJuaW5nc30gPSBhd2FpdCB0cmFuc2Zvcm0odGV4dCwge21pbmlmeTogdHJ1ZX0pO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIodHJhY2tlciwgd2FybmluZ3MpO1xuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodHJhY2tlciwgZXJyKVxuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbn0iLCAiaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByZXZlbnRMb2cge1xuICAgIGlkPzogc3RyaW5nLFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBlcnJvck5hbWU6IHN0cmluZyxcbiAgICB0eXBlPzogXCJ3YXJuXCIgfCBcImVycm9yXCJcbn1cblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzOiB7UHJldmVudEVycm9yczogc3RyaW5nW119ID0ge1xuICAgIFByZXZlbnRFcnJvcnM6IFtdXG59XG5cbmNvbnN0IFByZXZlbnREb3VibGVMb2c6IHN0cmluZ1tdID0gW107XG5cbmV4cG9ydCBjb25zdCBDbGVhcldhcm5pbmcgPSAoKSA9PiBQcmV2ZW50RG91YmxlTG9nLmxlbmd0aCA9IDA7XG5cbi8qKlxuICogSWYgdGhlIGVycm9yIGlzIG5vdCBpbiB0aGUgUHJldmVudEVycm9ycyBhcnJheSwgcHJpbnQgdGhlIGVycm9yXG4gKiBAcGFyYW0ge1ByZXZlbnRMb2d9ICAtIGBpZGAgLSBUaGUgaWQgb2YgdGhlIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUHJpbnRJZk5ldyh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBwcmludFt0eXBlXSh0ZXh0LnJlcGxhY2UoLzxsaW5lPi9naSwgJyAtPiAnKSwgYFxcblxcbkVycm9yIGNvZGU6ICR7ZXJyb3JOYW1lfVxcblxcbmApO1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IGJ1aWxkLCBNZXNzYWdlLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludEVycm9yKGZpbGVQYXRoOiBzdHJpbmcsIHtlcnJvcnN9OiB7ZXJyb3JzOiAgTWVzc2FnZVtdfSkge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYCR7ZXJyLnRleHR9LCBvbiBmaWxlIC0+ICR7ZmlsZVBhdGh9OiR7ZXJyPy5sb2NhdGlvbj8ubGluZSA/PyAwfToke2Vycj8ubG9jYXRpb24/LmNvbHVtbiA/PyAwfWBcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRXYXJuaW5ncyhmaWxlUGF0aDogc3RyaW5nLCB3YXJuaW5nczogTWVzc2FnZVtdKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBgJHt3YXJuLnRleHR9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aH06JHt3YXJuPy5sb2NhdGlvbj8ubGluZSA/PyAwfToke3dhcm4/LmxvY2F0aW9uPy5jb2x1bW4gPz8gMH1gXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihiYXNlOiBTdHJpbmdUcmFja2VyLCB3YXJuaW5nczogTWVzc2FnZVtdKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZSh3YXJuKVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihiYXNlOiBTdHJpbmdUcmFja2VyLCBlcnI6IE1lc3NhZ2UpIHtcbiAgICBQcmludElmTmV3KHtcbiAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZShlcnIpXG4gICAgfSk7XG59XG5cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogc3RyaW5nLCBwYXJhbXM6IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3IgPSBcIiR7c2VsZWN0b3J9XCIsIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke2F3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSl9XG4gICAgICAgIHZhciBleHBvcnRzID0gJHtuYW1lfS5leHBvcnRzO1xuICAgICAgICByZXR1cm4gc2VuZFRvU2VsZWN0b3Ioc2VsZWN0b3IsIG91dF9ydW5fc2NyaXB0LnRleHQpO1xuICAgIH1cXG4ke25hbWV9LmV4cG9ydHMgPSB7fTtgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIGRhdGFUYWcuZ2V0VmFsdWUoJ3BhcmFtcycpLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCdzZWxlY3RvcicpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6ICdleHRlcm5hbCcsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIilcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICdqc3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge21hcCwgY29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG4gICAgICAgIFxuICAgICAgICBSZXNDb2RlID0gU2F2ZVNlcnZlckNvZGUuUmVzdG9yZUNvZGUoU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIG1hcCkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4vU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwLWpzXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG1hcCA9IHR5cGVvZiBzb3VyY2VNYXAgPT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHNvdXJjZU1hcCk6IHNvdXJjZU1hcDtcblxuICAgIGNvbnN0IHRyYWNrQ29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIGNvbnN0IHNwbGl0TGluZXMgPSB0cmFja0NvZGUuc3BsaXQoJ1xcbicpO1xuICAgIG5ldyBTb3VyY2VNYXBDb25zdW1lcihtYXApLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBpc01hcCA9IHNwbGl0TGluZXNbbS5nZW5lcmF0ZWRMaW5lIC0gMV07XG4gICAgICAgIGlmICghaXNNYXApIHJldHVybjtcblxuXG4gICAgICAgIGxldCBjaGFyQ291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaXNNYXAuc3Vic3RyaW5nKG0uZ2VuZXJhdGVkQ29sdW1uID8gbS5nZW5lcmF0ZWRDb2x1bW4gLSAxOiAwKS5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICAgICAgaS5pbmZvID0gbS5zb3VyY2U7XG4gICAgICAgICAgICBpLmxpbmUgPSBtLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAgIGkuY2hhciA9IGNoYXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2tDb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ICA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0uRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIpO1xuXG4gICAgcmV0dXJuIG5ld1RyYWNrZXI7XG59XG5cbmZ1bmN0aW9uIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgaWYoaXRlbS5pbmZvID09IG15U291cmNlKXtcbiAgICAgICAgICAgIGNvbnN0IHtsaW5lLCBjaGFyLCBpbmZvfSA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0uYXQoaXRlbS5jaGFyLTEpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW0uaW5mbykge1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKGl0ZW0uaW5mbykpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsU3NzKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyLCBteVNvdXJjZSk7XG5cbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgdGFnRGF0YU9iamVjdEFycmF5IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHRhZ0RhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLmdldFZhbHVlKCd0eXBlJykgPT0gJ21vZHVsZScsIGlzTW9kZWxTdHJpbmdDYWNoZSA9IGlzTW9kZWwgPyAnc2NyaXB0TW9kdWxlJyA6ICdzY3JpcHQnO1xuXG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlW2lzTW9kZWxTdHJpbmdDYWNoZV0uaW5jbHVkZXMoQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlW2lzTW9kZWxTdHJpbmdDYWNoZV0ucHVzaChCZXR3ZWVuVGFnRGF0YUVxQXNUcmltKTtcblxuICAgIGxldCByZXN1bHRDb2RlID0gJycsIHJlc3VsdE1hcDogc3RyaW5nO1xuXG4gICAgY29uc3QgQWRkT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgc291cmNlZmlsZTogQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgbGFuZ3VhZ2UudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcgPyAnZXh0ZXJuYWwnIDogZmFsc2UsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIilcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICdqc3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBtYXAsIGNvZGUsIHdhcm5pbmdzIH0gPSBhd2FpdCB0cmFuc2Zvcm0oQmV0d2VlblRhZ0RhdGEuZXEsIEFkZE9wdGlvbnMpO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIHdhcm5pbmdzKTtcblxuICAgICAgICByZXN1bHRDb2RlID0gY29kZTtcbiAgICAgICAgcmVzdWx0TWFwID0gbWFwO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cblxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZShpc01vZGVsID8gJ21vZHVsZScgOiAnc2NyaXB0JywgdGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdE1hcCkge1xuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoSlNPTi5wYXJzZShyZXN1bHRNYXApLCBCZXR3ZWVuVGFnRGF0YSwgcmVzdWx0Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFRleHQocmVzdWx0Q29kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBzY3JpcHRXaXRoU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzY3JpcHRXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCxzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBpZiAoZGF0YVRhZy5oYXZlKCdzcmMnKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7QmV0d2VlblRhZ0RhdGF9PC9zY3JpcHQ+YFxuICAgICAgICB9XG5cbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucmVtb3ZlKCdsYW5nJykgfHwgJ2pzJztcblxuICAgIGlmIChkYXRhVGFnLmhhdmUoJ3NlcnZlcicpKSB7XG4gICAgICAgIGRhdGFUYWcucmVtb3ZlKCdzZXJ2ZXInKTtcbiAgICAgICAgcmV0dXJuIHNjcmlwdFdpdGhTZXJ2ZXIobGFuZ3VhZ2UsIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NyaXB0V2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCB9IGZyb20gXCJzb3VyY2UtbWFwLWpzXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50XCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZywgU29tZVBsdWdpbnM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nLCBTb21lUGx1Z2luczogYW55KSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIFNvbWVQbHVnaW5zKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJyl7XG4gICAgcmV0dXJuIGxhbmd1YWdlID09ICdzYXNzJyA/ICdpbmRlbnRlZCc6IGxhbmd1YWdlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Fzc0FuZFNvdXJjZShzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgc291cmNlOiBzdHJpbmcpe1xuICAgIGlmKCFzb3VyY2VNYXApIHJldHVybjtcbiAgICBmb3IoY29uc3QgaSBpbiBzb3VyY2VNYXAuc291cmNlcyl7XG4gICAgICAgIGlmKHNvdXJjZU1hcC5zb3VyY2VzW2ldLnN0YXJ0c1dpdGgoJ2RhdGE6Jykpe1xuICAgICAgICAgICAgc291cmNlTWFwLnNvdXJjZXNbaV0gPSBzb3VyY2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIG91dFN0eWxlID0gQmV0d2VlblRhZ0RhdGEuZXEpIHtcbiAgICBjb25zdCB0aGlzUGFnZSA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgdGhpc1BhZ2VVUkwgPSBwYXRoVG9GaWxlVVJMKHRoaXNQYWdlKSxcbiAgICAgICAgY29tcHJlc3NlZCA9IG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXhwcmVzc2lvbikge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIHRleHQ6IEJldHdlZW5UYWdEYXRhLmRlYnVnTGluZShleHByZXNzaW9uKSxcbiAgICAgICAgICAgIGVycm9yTmFtZTogZXhwcmVzc2lvbj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgICAgIHR5cGU6IGV4cHJlc3Npb24/LnN0YXR1cyA9PSA1ID8gJ3dhcm4nIDogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpLCBGdWxsUGF0aClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgdGhpc1BhZ2VVUkwuaHJlZik7XG4gICAgcmV0dXJuIHsgcmVzdWx0LCBvdXRTdHlsZSwgY29tcHJlc3NlZCB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEVuYWJsZUdsb2JhbFJlcGxhY2UgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgeyBjb21waWxlU2FzcyB9IGZyb20gJy4vc2Fzcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvLCBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCkpO1xuXG4gICAgaWYgKCFjb21wcmVzc2VkKVxuICAgICAgICBvdXRTdHlsZSA9IGBcXG4ke291dFN0eWxlfVxcbmA7XG5cbiAgICBjb25zdCByZVN0b3JlRGF0YSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbywgb3V0U3R5bGUpKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHN0eWxlJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIHRhZ0RhdGFPYmplY3RBcnJheSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5pbXBvcnQgeyBjb21waWxlU2FzcyB9IGZyb20gJy4vc2Fzcyc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG91dFN0eWxlQXNUcmltID0gQmV0d2VlblRhZ0RhdGEuZXEudHJpbSgpO1xuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZS5zdHlsZS5pbmNsdWRlcyhvdXRTdHlsZUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLnB1c2gob3V0U3R5bGVBc1RyaW0pO1xuXG4gICAgY29uc3QgeyByZXN1bHQsIG91dFN0eWxlIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzdHlsZScsIGRhdGFUYWcsICBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0Py5zb3VyY2VNYXApXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihTb3VyY2VNYXBTdG9yZS5maXhVUkxTb3VyY2VNYXAocmVzdWx0LnNvdXJjZU1hcCksIEJldHdlZW5UYWdEYXRhLCBvdXRTdHlsZSk7XG4gICAgZWxzZVxuICAgICAgICBwdXNoU3R5bGUuYWRkU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgeyB0ZXh0OiBvdXRTdHlsZSB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc3R5bGVXaXRoU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzdHlsZVdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5yZW1vdmUoJ2xhbmcnKSB8fCAnY3NzJztcblxuICAgIGlmKGRhdGFUYWcuaGF2ZSgnc2VydmVyJykpe1xuICAgICAgICBkYXRhVGFnLnJlbW92ZSgnc2VydmVyJyk7XG4gICAgICAgIHJldHVybiBzdHlsZVdpdGhTZXJ2ZXIobGFuZ3VhZ2UsIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlV2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGhfbm9kZSBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlIH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IEZhc3RDb21waWxlSW5GaWxlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZnVuY3Rpb24gSW5Gb2xkZXJQYWdlUGF0aChpbnB1dFBhdGg6IHN0cmluZywgc21hbGxQYXRoOnN0cmluZyl7XG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGlucHV0UGF0aFsxXSA9PSAnLycpIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb2xkZXIgPSBwYXRoX25vZGUuZGlybmFtZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIGlmKGZvbGRlcil7XG4gICAgICAgICAgICBmb2xkZXIgKz0gJy8nO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGZvbGRlciArIGlucHV0UGF0aDtcbiAgICB9IGVsc2UgaWYgKGlucHV0UGF0aFswXSA9PSAnLycpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWdlVHlwZSA9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgaWYoIWlucHV0UGF0aC5lbmRzV2l0aChwYWdlVHlwZSkpe1xuICAgICAgICBpbnB1dFBhdGggKz0gcGFnZVR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0UGF0aDtcbn1cblxuY29uc3QgY2FjaGVNYXA6IHsgW2tleTogc3RyaW5nXToge0NvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkfX0gPSB7fTtcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5nZXRWYWx1ZShcImZyb21cIik7XG5cbiAgICBjb25zdCBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyID0gSW5Gb2xkZXJQYWdlUGF0aChmaWxlcGF0aCwgdHlwZS5leHRyYWN0SW5mbygpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgU21hbGxQYXRoV2l0aG91dEZvbGRlciwgU21hbGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgU21hbGxQYXRoV2l0aG91dEZvbGRlcjtcblxuICAgIGlmICghKGF3YWl0IEVhc3lGcy5zdGF0KEZ1bGxQYXRoLCBudWxsLCB0cnVlKSkuaXNGaWxlPy4oKSkge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogJHt0eXBlLmF0KDApLmxpbmVJbmZvfSAtPiAke0Z1bGxQYXRofWAsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdwYWdlLW5vdC1mb3VuZCcsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBgPHAgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPlBhZ2Ugbm90IGZvdW5kOiAke3R5cGUubGluZUluZm99IC0+ICR7U21hbGxQYXRofTwvcD5gKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGxldCBSZXR1cm5EYXRhOiBTdHJpbmdUcmFja2VyO1xuXG4gICAgY29uc3QgaGF2ZUNhY2hlID0gY2FjaGVNYXBbU21hbGxQYXRoV2l0aG91dEZvbGRlcl07XG4gICAgaWYgKCFoYXZlQ2FjaGUgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKG51bGwsIGhhdmVDYWNoZS5uZXdTZXNzaW9uLmRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvOiBuZXdTZXNzaW9ufSA9IGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKFNtYWxsUGF0aFdpdGhvdXRGb2xkZXIsIGdldFR5cGVzLlN0YXRpYywgbnVsbCwgcGF0aE5hbWUsIGRhdGFUYWcucmVtb3ZlKCdvYmplY3QnKSk7XG4gICAgICAgIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzW1NtYWxsUGF0aF0gPSBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcy50aGlzUGFnZTtcbiAgICAgICAgZGVsZXRlIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBjYWNoZU1hcFtTbWFsbFBhdGhXaXRob3V0Rm9sZGVyXSA9IHtDb21waWxlZERhdGE6PFN0cmluZ1RyYWNrZXI+Q29tcGlsZWREYXRhLCBuZXdTZXNzaW9ufTtcbiAgICAgICAgUmV0dXJuRGF0YSA9PFN0cmluZ1RyYWNrZXI+Q29tcGlsZWREYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgQ29tcGlsZWREYXRhLCBuZXdTZXNzaW9uIH0gPSBjYWNoZU1hcFtTbWFsbFBhdGhXaXRob3V0Rm9sZGVyXTtcbiAgIFxuICAgICAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMpO1xuICAgICAgICBzZXNzaW9uSW5mby5leHRlbmRzKG5ld1Nlc3Npb24pXG5cbiAgICAgICAgUmV0dXJuRGF0YSA9IENvbXBpbGVkRGF0YTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogUmV0dXJuRGF0YVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuL0Vhc3lGc1wiO1xuXG4vKiBJdCdzIGEgSlNPTiBmaWxlIG1hbmFnZXIgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlSlNPTiB7XG4gICAgcHJpdmF0ZSBzYXZlUGF0aDogc3RyaW5nO1xuICAgIHN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGF1dG9Mb2FkID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNhdmVQYXRoID0gYCR7U3lzdGVtRGF0YX0vJHtmaWxlUGF0aH0uanNvbmA7XG4gICAgICAgIGF1dG9Mb2FkICYmIHRoaXMubG9hZEZpbGUoKTtcblxuICAgICAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcHJvY2Vzcy5leGl0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb2Nlc3Mub24oJ2V4aXQnLCB0aGlzLnNhdmUuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZEZpbGUoKSB7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnNhdmVQYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBKU09OLnBhcnNlKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnNhdmVQYXRoKSB8fCAne30nKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGtleSBpcyBpbiB0aGUgc3RvcmUsIHJldHVybiB0aGUgdmFsdWUuIElmIG5vdCwgY3JlYXRlIGEgbmV3IHZhbHVlLCBzdG9yZSBpdCwgYW5kIHJldHVybiBpdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIGxvb2sgdXAgaW4gdGhlIHN0b3JlLlxuICAgICAqIEBwYXJhbSBbY3JlYXRlXSAtIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc3RyaW5nLlxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBvZiB0aGUga2V5IGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBoYXZlKGtleTogc3RyaW5nLCBjcmVhdGU/OiAoKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0b3JlW2tleV07XG4gICAgICAgIGlmIChpdGVtIHx8ICFjcmVhdGUpIHJldHVybiBpdGVtO1xuXG4gICAgICAgIGl0ZW0gPSBjcmVhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoa2V5LCBpdGVtKTtcblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHRoaXMuc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVbaV0gPSB1bmRlZmluZWRcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0b3JlW2ldXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmUoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZSh0aGlzLnNhdmVQYXRoLCB0aGlzLnN0b3JlKTtcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4vU3RvcmVKU09OXCI7XG5cbmV4cG9ydCBjb25zdCBwYWdlRGVwcyA9IG5ldyBTdG9yZUpTT04oJ1BhZ2VzSW5mbycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYW55IG9mIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhlIHBhZ2UgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtTdHJpbmdOdW1iZXJNYXB9IGRlcGVuZGVuY2llcyAtIEEgbWFwIG9mIGRlcGVuZGVuY2llcy4gVGhlIGtleSBpcyB0aGUgcGF0aCB0byB0aGUgZmlsZSwgYW5kXG4gKiB0aGUgdmFsdWUgaXMgdGhlIGxhc3QgbW9kaWZpZWQgdGltZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOnN0cmluZywgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSBwYWdlRGVwcy5zdG9yZVtwYXRoXSkge1xuICAgIGZvciAoY29uc3QgaSBpbiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzUGFnZScpIHtcbiAgICAgICAgICAgIHAgPSBwYXRoICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCAgKyBwO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gZGVwZW5kZW5jaWVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gIWRlcGVuZGVuY2llcztcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcik6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvKTtcblxuICAgIGNvbXBpbGVkU3RyaW5nLlBsdXMkIGA8JXslPiR7QmV0d2VlblRhZ0RhdGF9PCV9JT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHJlbGF0aXZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlZ2lzdGVyRXh0ZW5zaW9uIGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyJztcbmltcG9ydCB7IHJlYnVpbGRGaWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSwgeyByZXNvbHZlLCBjbGVhck1vZHVsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IENhcGl0YWxpemUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MnO1xuXG5hc3luYyBmdW5jdGlvbiBzc3JIVE1MKGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgRnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGdldFYgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGd2ID0gKG5hbWU6IHN0cmluZykgPT4gZGF0YVRhZy5nZXRWYWx1ZShuYW1lKS50cmltKCksXG4gICAgICAgICAgICB2YWx1ZSA9IGd2KCdzc3InICsgQ2FwaXRhbGl6ZShuYW1lKSkgfHwgZ3YobmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gZXZhbChgKCR7dmFsdWUuY2hhckF0KDApID09ICd7JyA/IHZhbHVlIDogYHske3ZhbHVlfX1gfSlgKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgYnVpbGRQYXRoID0gYXdhaXQgcmVnaXN0ZXJFeHRlbnNpb24oRnVsbFBhdGgsIHNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoYnVpbGRQYXRoKTtcblxuICAgIGNvbnN0IHsgaHRtbCwgaGVhZCB9ID0gbW9kZS5kZWZhdWx0LnJlbmRlcihnZXRWKCdwcm9wcycpLCBnZXRWKCdvcHRpb25zJykpO1xuICAgIHNlc3Npb25JbmZvLmhlYWRIVE1MICs9IGhlYWQ7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IExhc3RTbWFsbFBhdGggPSB0eXBlLmV4dHJhY3RJbmZvKCksIExhc3RGdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgTGFzdFNtYWxsUGF0aDtcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKExhc3RGdWxsUGF0aCwgTGFzdFNtYWxsUGF0aCwgZGF0YVRhZy5yZW1vdmUoJ2Zyb20nKSwgZ2V0VHlwZXMuU3RhdGljWzJdLCAnc3ZlbHRlJyk7XG4gICAgY29uc3QgaW5XZWJQYXRoID0gcmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBTbWFsbFBhdGgpLnJlcGxhY2UoL1xcXFwvZ2ksICcvJyk7XG5cbiAgICBzZXNzaW9uSW5mby5zdHlsZSgnLycgKyBpbldlYlBhdGggKyAnLmNzcycpO1xuXG4gICAgY29uc3QgaWQgPSBkYXRhVGFnLnJlbW92ZSgnaWQnKSB8fCBCYXNlNjRJZChpbldlYlBhdGgpLFxuICAgICAgICBoYXZlID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhVGFnLmdldFZhbHVlKG5hbWUpLnRyaW0oKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IGAsJHtuYW1lfToke3ZhbHVlLmNoYXJBdCgwKSA9PSAneycgPyB2YWx1ZSA6IGB7JHt2YWx1ZX19YH1gIDogJyc7XG4gICAgICAgIH0sIHNlbGVjdG9yID0gZGF0YVRhZy5yZW1vdmUoJ3NlbGVjdG9yJyk7XG5cbiAgICBjb25zdCBzc3IgPSAhc2VsZWN0b3IgJiYgZGF0YVRhZy5oYXZlKCdzc3InKSA/IGF3YWl0IHNzckhUTUwoZGF0YVRhZywgRnVsbFBhdGgsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pIDogJyc7XG5cblxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlKCdtb2R1bGUnLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdwYWdlJykgPyBMYXN0U21hbGxQYXRoIDogdHlwZS5leHRyYWN0SW5mbygpKS5hZGRUZXh0KFxuYGltcG9ydCBBcHAke2lkfSBmcm9tICcvJHtpbldlYlBhdGh9JztcbmNvbnN0IHRhcmdldCR7aWR9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiR7c2VsZWN0b3IgPyBzZWxlY3RvciA6ICcjJyArIGlkfVwiKTtcbnRhcmdldCR7aWR9ICYmIG5ldyBBcHAke2lkfSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQke2lkfVxuICAgICR7aGF2ZSgncHJvcHMnKSArIGhhdmUoJ29wdGlvbnMnKX0ke3NzciA/ICcsIGh5ZHJhdGU6IHRydWUnIDogJyd9XG59KTtgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBzZWxlY3RvciA/ICcnIDogYDxkaXYgaWQ9XCIke2lkfVwiPiR7c3NyfTwvZGl2PmApLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJZCh0ZXh0OiBzdHJpbmcsIG1heCA9IDEwKXtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odGV4dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnN1YnN0cmluZygwLCBtYXgpLnJlcGxhY2UoL1xcKy8sICdfJykucmVwbGFjZSgvXFwvLywgJ18nKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgIHsgQ2FwaXRhbGl6ZSwgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgQ29tcGlsZU9wdGlvbnMgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGNsZWFyTW9kdWxlLCByZXNvbHZlIH0gZnJvbSBcIi4uLy4uL3JlZGlyZWN0Q0pTXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGVQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbmFtZSA9IHBhdGgucGFyc2UoZmlsZVBhdGgpLm5hbWUucmVwbGFjZSgvXlxcZC8sICdfJCYnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8kXS9nLCAnJyk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgICAgICBuYW1lOiBDYXBpdGFsaXplKG5hbWUpLFxuICAgICAgICBnZW5lcmF0ZTogJ3NzcicsXG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGRldjogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgfTtcblxuICAgIGNvbnN0IGluU3RhdGljRmlsZSA9IHBhdGgucmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzbWFsbFBhdGgpO1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljRmlsZTtcblxuICAgIGNvbnN0IGZ1bGxJbXBvcnRQYXRoID0gZnVsbENvbXBpbGVQYXRoICsgJy5zc3IuY2pzJztcbiAgICBjb25zdCB7c3ZlbHRlRmlsZXMsIGNvZGUsIG1hcCwgZGVwZW5kZW5jaWVzfSA9IGF3YWl0IHByZXByb2Nlc3MoZmlsZVBhdGgsIHNtYWxsUGF0aCxmdWxsSW1wb3J0UGF0aCxmYWxzZSwnLnNzci5janMnKTtcbiAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyxkZXBlbmRlbmNpZXMpO1xuICAgIG9wdGlvbnMuc291cmNlbWFwID0gbWFwO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBmb3IoY29uc3QgZmlsZSBvZiBzdmVsdGVGaWxlcyl7XG4gICAgICAgIGNsZWFyTW9kdWxlKHJlc29sdmUoZmlsZSkpOyAvLyBkZWxldGUgb2xkIGltcG9ydHNcbiAgICAgICAgcHJvbWlzZXMucHVzaChyZWdpc3RlckV4dGVuc2lvbihmaWxlLCBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGUpLCBzZXNzaW9uSW5mbykpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGNvbnN0IHsganMsIGNzcywgd2FybmluZ3MgfSA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIDxhbnk+b3B0aW9ucyk7XG5cbiAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgd2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHtcbiAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogd2FybmluZy5jb2RlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiB3YXJuaW5nLm1lc3NhZ2UgKyAnXFxuJyArIHdhcm5pbmcuZnJhbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSAnLycgKyBpblN0YXRpY0ZpbGUuc3BsaXQoL1xcL3xcXC8vKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICBjc3MuY29kZSArPSAnXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9JyArIGNzcy5tYXAudG9VcmwoKSArICcqLyc7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiBmdWxsSW1wb3J0UGF0aDtcbn1cbiIsICJpbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IGRpcm5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGNyZWF0ZUltcG9ydGVyLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFeHRlbnNpb24sIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCwgYmFja1RvT3JpZ2luYWxTc3MgfSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgaWYgKGxhbmcgPT0gJ2NzcycpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNzcywgc291cmNlTWFwLCBsb2FkZWRVcmxzIH0gPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhjb250ZW50LmVxLCB7XG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5nKSxcbiAgICAgICAgICAgIHN0eWxlOiBzYXNzU3R5bGUobGFuZywgU29tZVBsdWdpbnMpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsIHNvdXJjZU1hcCwgc291cmNlTWFwLnNvdXJjZXMuZmluZCh4ID0+IHguc3RhcnRzV2l0aCgnZGF0YTonKSkpLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBsb2FkZWRVcmxzLm1hcCh4ID0+IGZpbGVVUkxUb1BhdGgoPGFueT54KSlcbiAgICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sIG9uIGZpbGUgLT4gJHtmdWxsUGF0aH0ke2Vyci5saW5lID8gJzonICsgZXJyLmxpbmUgOiAnJ31gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgICAgICB0eXBlOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3dhcm4nIDogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgY29uc3QgZXh0ID0gZXh0bmFtZShhcmdzWzEwXS5lcSk7XG5cbiAgICAgICAgaWYgKGV4dCA9PSAnJylcbiAgICAgICAgICAgIGlmIChsYW5nID09ICd0cycpXG4gICAgICAgICAgICAgICAgYXJnc1sxMF0uQWRkVGV4dEFmdGVyTm9UcmFjaygnLnRzJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXJnc1sxMF0uQWRkVGV4dEFmdGVyTm9UcmFjaygnLmpzJyk7XG5cblxuICAgICAgICBjb25zdCBuZXdEYXRhID0gYXJnc1sxXS5QbHVzKGFyZ3NbOV0sIGFyZ3NbMTBdLCAoZXh0ID09ICcuc3ZlbHRlJyA/IHN2ZWx0ZUV4dCA6ICcnKSwgYXJnc1s5XSwgKGFyZ3NbMTFdID8/ICcnKSk7XG5cbiAgICAgICAgaWYgKGV4dCA9PSAnLnN2ZWx0ZScpIHtcbiAgICAgICAgICAgIGNvbm5lY3RTdmVsdGUucHVzaChhcmdzWzEwXS5lcSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGFuZyAhPT0gJ3RzJyB8fCAhYXJnc1s0XSlcbiAgICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuXG4gICAgICAgIGNvbnN0IGlkID0gdXVpZCgpO1xuICAgICAgICBtYXBUb2tlbltpZF0gPSBuZXdEYXRhO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgX19fdG9LZW5cXGAke2lkfVxcYGApO1xuICAgIH0pO1xuXG4gICAgaWYgKGxhbmcgIT09ICd0cycpXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IChhd2FpdCB0cmFuc2Zvcm0oY29udGVudC5lcSwgeyAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpLCBsb2FkZXI6ICd0cycsIHNvdXJjZW1hcDogdHJ1ZSB9KSk7XG4gICAgICAgIGNvbnRlbnQgPSBiYWNrVG9PcmlnaW5hbChjb250ZW50LCBjb2RlLCBtYXApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoY29udGVudCwgZXJyKTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICB9XG5cbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlcigvX19fdG9LZW5gKFtcXHdcXFddKz8pYC9taSwgYXJncyA9PiB7XG4gICAgICAgIHJldHVybiBtYXBUb2tlblthcmdzWzFdLmVxXSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udGVudDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByZXByb2Nlc3MoZnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIHNhdmVQYXRoPzogc3RyaW5nLCBodHRwU291cmNlID0gdHJ1ZSwgc3ZlbHRlRXh0ID0gJycpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IHNtYWxsUGF0aC5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpO1xuICAgIHNhdmVQYXRoID8/PSBmaWxlbmFtZTtcbiAgICBcbiAgICBsZXQgdGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGZpbGVuYW1lLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGNvbnN0IGNvbm5lY3RTdmVsdGU6IHN0cmluZ1tdID0gW10sIGRlcGVuZGVuY2llczogc3RyaW5nW10gPSBbXTtcbiAgICB0ZXh0ID0gYXdhaXQgdGV4dC5yZXBsYWNlckFzeW5jKC8oPHNjcmlwdClbIF0qKCBsYW5nPSgnfFwiKT8oW0EtWmEtel0rKSgnfFwiKT8pP1sgXSooPikoLio/KSg8XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHJldHVybiBhcmdzWzFdLlBsdXMoYXJnc1s2XSwgYXdhaXQgU2NyaXB0U3ZlbHRlKGFyZ3NbN10sIGFyZ3NbNF0/LmVxID8/ICdqcycsIGNvbm5lY3RTdmVsdGUsIHN2ZWx0ZUV4dCksIGFyZ3NbOF0pO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc3R5bGVDb2RlID0gY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiBgQGltcG9ydCBcIiR7eH0uY3NzXCI7YCkuam9pbignJyk7XG4gICAgbGV0IGhhZFN0eWxlID0gZmFsc2U7XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzdHlsZSlbIF0qKCBsYW5nPSgnfFwiKT8oW0EtWmEtel0rKSgnfFwiKT8pP1sgXSooPikoLio/KSg8XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXM6IGRlcHMgfSA9IGF3YWl0IFNBU1NTdmVsdGUoYXJnc1s3XSwgYXJnc1s0XT8uZXEgPz8gJ2NzcycsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgY29kZTogdGV4dC5lcSwgbWFwOiB0ZXh0LlN0cmluZ1RhY2soc2F2ZVBhdGgsIGh0dHBTb3VyY2UpLCBkZXBlbmRlbmNpZXM6IHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgc3ZlbHRlRmlsZXM6IGNvbm5lY3RTdmVsdGUubWFwKHggPT4geFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gKyB4IDogcGF0aC5ub3JtYWxpemUoZnVsbFBhdGggKyAnLy4uLycgKyB4KSkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcGl0YWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVbMF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59XG5cbiIsICJpbXBvcnQgdHlwZSB7IHRhZ0RhdGFPYmplY3RBcnJheX0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuXG5cbmNvbnN0IG51bWJlcnMgPSBbJ251bWJlcicsICdudW0nLCAnaW50ZWdlcicsICdpbnQnXSwgYm9vbGVhbnMgPSBbJ2Jvb2xlYW4nLCAnYm9vbCddO1xuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb24gPSBbJ2VtYWlsJywgJ3N0cmluZycsICd0ZXh0JywgLi4ubnVtYmVycywgLi4uYm9vbGVhbnNdO1xuXG5jb25zdCBlbWFpbFZhbGlkYXRvciA9IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC87XG5cblxuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvblJlZ2V4ID0ge1xuICAgIFwic3RyaW5nLWxlbmd0aC1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLVswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLScpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCB0ZXh0OiBzdHJpbmcpID0+IHRleHQubGVuZ3RoID49IG1pbiAmJiB0ZXh0Lmxlbmd0aCA8PSBtYXgsXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibnVtYmVyLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSsuLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heCxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2Utc3RyaW5nXCI6IFtcbiAgICAgICAgL15zdHJpbmd8dGV4dCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gYFwiJHt4LnRyaW0oKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpfVwiYCksXG4gICAgICAgIChvcHRpb25zOiBzdHJpbmdbXSwgdGV4dDogc3RyaW5nKSA9PiBvcHRpb25zLmluY2x1ZGVzKHRleHQpLFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1udW1iZXJcIjogW1xuICAgICAgICAvXm51bWJlcnxudW18aW50ZWdlcnxpbnQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpLFxuICAgICAgICAob3B0aW9uczogbnVtYmVyW10sIG51bTogbnVtYmVyKSA9PiBvcHRpb25zLmluY2x1ZGVzKG51bSksXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdXG59O1xuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMgPSBbLi4ubnVtYmVyc107XG5cbmZvcihjb25zdCBpIGluIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpe1xuICAgIGNvbnN0IHR5cGUgPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2ldWzNdO1xuXG4gICAgaWYoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKHR5cGUpKVxuICAgICAgICBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMucHVzaChpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVZhbHVlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGBbXCIke3ZhbHVlfVwiXWA7XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBbdGVzdCwgZ2V0QXJnc11dIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpKVxuICAgICAgICBpZiAoKDxSZWdFeHA+dGVzdCkudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gYFtcIiR7bmFtZX1cIiwgJHsoPGFueT5nZXRBcmdzKSh2YWx1ZSl9XWA7XG5cbiAgICByZXR1cm4gYFske3ZhbHVlfV1gO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlVmFsaWRhdGlvbkpTT04oYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IFByb21pc2U8Ym9vbGVhbiB8IHN0cmluZ1tdPiB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnQsIC4uLmVsZW1lbnRBcmdzXSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG4gICAgICAgIGxldCByZXR1cm5Ob3cgPSBmYWxzZTtcblxuICAgICAgICBsZXQgaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgY2FzZSAnYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIU51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWVtYWlsVmFsaWRhdG9yLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhdmVSZWdleCA9IHZhbHVlICE9IG51bGwgJiYgYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtlbGVtZW50XTtcblxuICAgICAgICAgICAgICAgIGlmKGhhdmVSZWdleCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFoYXZlUmVnZXhbMl0oZWxlbWVudEFyZ3MsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICBpc0RlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSBlbGVtZW50LnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFhd2FpdCBlbGVtZW50KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYGZhaWxlZCBhdCAke2l9IGZpbGVkIC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBmaW5kOiBzdHJpbmcsIGRlZmF1bHREYXRhOiBhbnkgPSBudWxsKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW57XG4gICAgY29uc3QgaGF2ZSA9IGRhdGEuaGF2ZShmaW5kKSwgdmFsdWUgPSBkYXRhLnJlbW92ZShmaW5kKTtcblxuICAgIGlmKGhhdmUgJiYgdmFsdWUgIT0gJ2ZhbHNlJykgcmV0dXJuIHZhbHVlIHx8IGhhdmUgICAgXG4gICAgaWYodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcblxuICAgIGlmKCFoYXZlKSByZXR1cm4gZGVmYXVsdERhdGE7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59IiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXCI8cCBzdHlsZT1cXFxcXCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1xcXFxcIj5TeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX08L3A+XCJgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gdGV4dC5kZWJ1Z0xpbmUoZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1ZylcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIEVycm9yVGVtcGxhdGUoZXJyb3JNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBFYXN5RnMucmVhZEpzb25GaWxlKHBhdGgpO1xufSIsICJpbXBvcnQgeyBwcm9taXNlcyB9IGZyb20gXCJmc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUocGF0aCkpO1xuICAgIGNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG4gICAgcmV0dXJuIHdhc21JbnN0YW5jZS5leHBvcnRzO1xufSIsICJpbXBvcnQganNvbiBmcm9tIFwiLi9qc29uXCI7XG5pbXBvcnQgd2FzbSBmcm9tIFwiLi93YXNtXCI7XG5cbmV4cG9ydCBjb25zdCBjdXN0b21UeXBlcyA9IFtcImpzb25cIiwgXCJ3YXNtXCJdO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIHJlcXVpcmU6IChwOiBzdHJpbmcpID0+IFByb21pc2U8YW55Pil7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICAgICAgcmV0dXJuIGpzb24ocGF0aClcbiAgICAgICAgY2FzZSBcIndhc21cIjpcbiAgICAgICAgICAgIHJldHVybiB3YXNtKHBhdGgpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGltcG9ydChwYXRoKVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQnO1xuaW1wb3J0IHsgQmFzZVJlYWRlciB9IGZyb20gJy4uL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IEVuZE9mQmxvY2ssIEVuZE9mRGVmU2tpcEJsb2NrLCBQYXJzZVRleHRTdHJlYW0sIFJlQnVpbGRDb2RlU3RyaW5nIH0gZnJvbSAnLi9FYXN5U2NyaXB0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFzeVN5bnRheCB7XG4gICAgcHJpdmF0ZSBCdWlsZDogUmVCdWlsZENvZGVTdHJpbmc7XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJzZUFycmF5ID0gYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGNvZGUpO1xuICAgICAgICB0aGlzLkJ1aWxkID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKHBhcnNlQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0ID0gdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgY29uc3QgJHtkYXRhT2JqZWN0fSA9IGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydChyZXBsYWNlVG9UeXBlLCBkYXRhT2JqZWN0LCBpbmRleCl9O09iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtkYXRhT2JqZWN0fSlgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbChyZXBsYWNlVG9UeXBlLCBpbmRleCl9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEltcG9ydFR5cGUodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAoYCR7dHlwZX1bIFxcXFxuXSsoW1xcXFwqXXswLDF9W1xcXFxwe0x9MC05XyxcXFxce1xcXFx9IFxcXFxuXSspWyBcXFxcbl0rZnJvbVsgXFxcXG5dKzxcXFxcfChbMC05XSspXFxcXHxcXFxcfD5gLCAndScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtYXRjaFsxXS50cmltKCk7XG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgbGV0IERhdGFPYmplY3Q6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGRhdGEuc3Vic3RyaW5nKDEpLnJlcGxhY2UoJyBhcyAnLCAnJykudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBTcGxpY2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWQgPSBkYXRhLnNwbGl0KCd9JywgMik7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMF0gKz0gJ30nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMV0gPSBTcGxpY2VkWzFdLnNwbGl0KCcsJykucG9wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJywnLCAxKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgU3BsaWNlZCA9IFNwbGljZWQubWFwKHggPT4geC50cmltKCkpLmZpbHRlcih4ID0+IHgubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzBdWzBdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gdGhpcy5CdWlsZC5BbGxJbnB1dHNbbWF0Y2hbMl1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnN1YnN0cmluZyhleHRlbnNpb24ubGFzdEluZGV4T2YoJy4nKSArIDEsIGV4dGVuc2lvbi5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBge2RlZmF1bHQ6JHtTcGxpY2VkWzBdfX1gOyAvL29ubHkgaWYgdGhpcyBpc24ndCBjdXN0b20gaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBgJHtEYXRhT2JqZWN0LnN1YnN0cmluZygwLCBEYXRhT2JqZWN0Lmxlbmd0aCAtIDEpfSxkZWZhdWx0OiR7U3BsaWNlZFsxXX19YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gRGF0YU9iamVjdC5yZXBsYWNlKC8gYXMgLywgJzonKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBEYXRhT2JqZWN0LCBtYXRjaFsyXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbk9uZVdvcmQodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSA9PiBzdHJpbmcgPSB0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbCkge1xuICAgICAgICBsZXQgYmVmb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaChuZXcgUmVnRXhwKHR5cGUgKyAnWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG5cbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBhY3Rpb25TdHJpbmcocmVwbGFjZVRvVHlwZSwgbWF0Y2hbMV0pO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nO1xuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGJlZm9yZVN0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoU3BhY2UoZnVuYzogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGZ1bmMoJyAnICsgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0KS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBEZWZpbmUoZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke2tleX0oW15cXFxccHtMfV0pYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB2YWx1ZSArIG1hdGNoWzJdXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW5Bc0Z1bmN0aW9uKHdvcmQ6IHN0cmluZywgdG9Xb3JkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke3dvcmR9KFsgXFxcXG5dKlxcXFwoKWAsICdndWknKSwgKC4uLm1hdGNoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB0b1dvcmQgKyBtYXRjaFsyXVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRWYXJpYWJsZSgpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykodmFyfGxldHxjb25zdClbIFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopL3UpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgYmVmb3JlTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBjbG9zZUluZGV4ID0gYXdhaXQgRW5kT2ZEZWZTa2lwQmxvY2soYWZ0ZXJNYXRjaCxbJzsnLCAnXFxuJ10pO1xuXG4gICAgICAgICAgICBpZihjbG9zZUluZGV4ID09IC0xKXtcbiAgICAgICAgICAgICAgICBjbG9zZUluZGV4ID0gYWZ0ZXJNYXRjaC5sZW5ndGhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYmVmb3JlQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBjbG9zZUluZGV4KSwgYWZ0ZXJDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKGNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9O2V4cG9ydHMuJHttYXRjaFszXX09JHttYXRjaFszXX0ke2FmdGVyQ2xvc2V9YDtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwb3J0QmxvY2soKXtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaCgvKGV4cG9ydFsgXFxuXSspKGRlZmF1bHRbIFxcbl0rKT8oW14gXFxuXSkvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBsZXQgYmVmb3JlTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIGxldCByZW1vdmVFeHBvcnQgPSBtYXRjaFswXS5zdWJzdHJpbmcobWF0Y2hbMV0ubGVuZ3RoICsgKG1hdGNoWzJdIHx8ICcnKS5sZW5ndGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IG1hdGNoWzNdWzBdLCBpc0RlZmF1bHQgPSBCb29sZWFuKG1hdGNoWzJdKTtcbiAgICAgICAgICAgIGlmKGZpcnN0Q2hhcj09ICd7Jyl7XG4gICAgICAgICAgICAgICAgbGV0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmKGlzRGVmYXVsdCl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgJ2V4cG9ydHMuZGVmYXVsdD0nICsgcmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IGF3YWl0IEVuZE9mQmxvY2soYWZ0ZXJNYXRjaCwgWyd7JywgJ30nXSk7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZU1hdGNoICs9IGBPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7cmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgrMSl9KWA7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoZW5kSW5kZXgrMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgtMSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRXhwb3J0ID0gcmVtb3ZlRXhwb3J0LnNsaWNlKDAsIC0xKTtcblxuICAgICAgICAgICAgICAgIGxldCBjbG9zZUluZGV4ID0gYXdhaXQgRW5kT2ZEZWZTa2lwQmxvY2soYWZ0ZXJNYXRjaCxbJzsnLCAnXFxuJ10pO1xuICAgICAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUluZGV4ID0gYWZ0ZXJNYXRjaC50cmltRW5kKCkubGVuZ3RoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYmVmb3JlQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBjbG9zZUluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9ja01hdGNoID0gYmVmb3JlQ2xvc2UubWF0Y2goLyhmdW5jdGlvbnxjbGFzcylbIHxcXG5dKyhbXFxwe0x9XFwkX11bXFxwe0x9MC05XFwkX10qKT8vdSk7XG5cbiAgICAgICAgICAgICAgICBpZihibG9ja01hdGNoPy5bMl0peyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKGNsb3NlSW5kZXgpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2ggKyByZW1vdmVFeHBvcnQrIGJlZm9yZUNsb3NlfWV4cG9ydHMuJHtpc0RlZmF1bHQgPyAnZGVmYXVsdCc6IGJsb2NrTWF0Y2hbMl19PSR7YmxvY2tNYXRjaFsyXX0ke2FmdGVyQ2xvc2V9YDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNofWV4cG9ydHMuJHtiZWZvcmVDbG9zZS5zcGxpdCgvIHxcXG4vLCAxKS5wb3AoKX09JHtyZW1vdmVFeHBvcnQrIGFmdGVyTWF0Y2h9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEltcG9ydHMoZGVmaW5lRGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0KTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2luY2x1ZGUnKTtcblxuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsKTtcbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbkFzRnVuY3Rpb24oJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG5cbiAgICAgICAgLy9lc20gdG8gY2pzIC0gZXhwb3J0XG4gICAgICAgIGF3YWl0IHRoaXMuZXhwb3J0VmFyaWFibGUoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRCbG9jaygpO1xuXG4gICAgICAgIGRlZmluZURhdGEgJiYgdGhpcy5EZWZpbmUoZGVmaW5lRGF0YSk7XG4gICAgfVxuXG4gICAgQnVpbHRTdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkJ1aWxkLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZTogc3RyaW5nLCBkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IEVhc3lTeW50YXgoKTtcbiAgICAgICAgYXdhaXQgYnVpbGRlci5sb2FkKGAgJHtjb2RlfSBgKTtcbiAgICAgICAgYXdhaXQgYnVpbGRlci5CdWlsZEltcG9ydHMoZGVmaW5lRGF0YSk7XG5cbiAgICAgICAgY29kZSA9IGJ1aWxkZXIuQnVpbHRTdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIGNvZGUuc3Vic3RyaW5nKDEsIGNvZGUubGVuZ3RoIC0gMSk7XG4gICAgfVxufSIsICJpbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZVwiO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwLCBTdHJpbmdNYXAsIFN0cmluZ051bWJlck1hcCwgdGFnRGF0YU9iamVjdEFycmF5IH0gZnJvbSBcIi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSBcIi4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0XCI7XG5pbXBvcnQgeyBpc1RzIH0gZnJvbSBcIi4vSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSBcIi4vdHJhbnNmb3JtL1NjcmlwdFwiO1xuXG5cbmV4cG9ydCB0eXBlIHNldERhdGFIVE1MVGFnID0ge1xuICAgIHVybDogc3RyaW5nLFxuICAgIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXBcbn1cblxuZXhwb3J0IHR5cGUgY29ubmVjdG9yQXJyYXkgPSB7XG4gICAgdHlwZTogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBzZW5kVG86IHN0cmluZyxcbiAgICB2YWxpZGF0b3I6IHN0cmluZ1tdLFxuICAgIG9yZGVyPzogc3RyaW5nW10sXG4gICAgbm90VmFsaWQ/OiBzdHJpbmcsXG4gICAgbWVzc2FnZT86IHN0cmluZyB8IGJvb2xlYW4sXG4gICAgcmVzcG9uc2VTYWZlPzogYm9vbGVhblxufVtdXG5cbmV4cG9ydCB0eXBlIGNhY2hlQ29tcG9uZW50ID0ge1xuICAgIFtrZXk6IHN0cmluZ106IG51bGwgfCB7XG4gICAgICAgIG10aW1lTXM/OiBudW1iZXIsXG4gICAgICAgIHZhbHVlPzogc3RyaW5nXG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBpblRhZ0NhY2hlID0ge1xuICAgIHN0eWxlOiBzdHJpbmdbXVxuICAgIHNjcmlwdDogc3RyaW5nW11cbiAgICBzY3JpcHRNb2R1bGU6IHN0cmluZ1tdXG59XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1Nob3J0U2NyaXB0TmFtZXMnKTtcblxuLyogVGhlIFNlc3Npb25CdWlsZCBjbGFzcyBpcyB1c2VkIHRvIGJ1aWxkIHRoZSBoZWFkIG9mIHRoZSBwYWdlICovXG5leHBvcnQgY2xhc3MgU2Vzc2lvbkJ1aWxkIHtcbiAgICBjb25uZWN0b3JBcnJheTogY29ubmVjdG9yQXJyYXkgPSBbXVxuICAgIHByaXZhdGUgc2NyaXB0VVJMU2V0OiBzZXREYXRhSFRNTFRhZ1tdID0gW11cbiAgICBwcml2YXRlIHN0eWxlVVJMU2V0OiBzZXREYXRhSFRNTFRhZ1tdID0gW11cbiAgICBwcml2YXRlIGluU2NyaXB0U3R5bGU6IHsgdHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHBhdGg6IHN0cmluZywgdmFsdWU6IFNvdXJjZU1hcFN0b3JlIH1bXSA9IFtdXG4gICAgaGVhZEhUTUwgPSAnJ1xuICAgIGNhY2hlOiBpblRhZ0NhY2hlID0ge1xuICAgICAgICBzdHlsZTogW10sXG4gICAgICAgIHNjcmlwdDogW10sXG4gICAgICAgIHNjcmlwdE1vZHVsZTogW11cbiAgICB9XG4gICAgY2FjaGVDb21waWxlU2NyaXB0OiBhbnkgPSB7fVxuICAgIGNhY2hlQ29tcG9uZW50OiBjYWNoZUNvbXBvbmVudCA9IHt9XG4gICAgY29tcGlsZVJ1blRpbWVTdG9yZTogU3RyaW5nQW55TWFwID0ge31cbiAgICBkZXBlbmRlbmNpZXM6IFN0cmluZ051bWJlck1hcCA9IHt9XG4gICAgcmVjb3JkTmFtZXM6IHN0cmluZ1tdID0gW11cblxuICAgIGdldCBzYWZlRGVidWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlYnVnICYmIHRoaXMuX3NhZmVEZWJ1ZztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBmdWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgdHlwZU5hbWU/OiBzdHJpbmcsIHB1YmxpYyBkZWJ1Zz86IGJvb2xlYW4sIHByaXZhdGUgX3NhZmVEZWJ1Zz86IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcyA9IHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBzdHlsZSh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zdHlsZVVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc3R5bGVVUkxTZXQucHVzaCh7IHVybCwgYXR0cmlidXRlcyB9KTtcbiAgICB9XG5cbiAgICBzY3JpcHQodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc2NyaXB0VVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zY3JpcHRVUkxTZXQucHVzaCh7IHVybCwgYXR0cmlidXRlcyB9KTtcbiAgICB9XG5cbiAgICByZWNvcmQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyhuYW1lKSlcbiAgICAgICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBhc3luYyBkZXBlbmRlbmNlKHNtYWxsUGF0aDogc3RyaW5nLCBmdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc21hbGxQYXRoKSB7XG4gICAgICAgIGlmICh0aGlzLmRlcGVuZGVuY2llc1tzbWFsbFBhdGhdKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZURlcCA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3Q7XG4gICAgICAgIGlmIChoYXZlRGVwKSB7XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llc1tzbWFsbFBhdGhdID0gaGF2ZURlcFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRTY3JpcHRTdHlsZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgc21hbGxQYXRoID0gdGhpcy5zbWFsbFBhdGgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmluU2NyaXB0U3R5bGUuZmluZCh4ID0+IHgudHlwZSA9PSB0eXBlICYmIHgucGF0aCA9PSBzbWFsbFBhdGgpO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSB7IHR5cGUsIHBhdGg6IHNtYWxsUGF0aCwgdmFsdWU6IG5ldyBTb3VyY2VNYXBTdG9yZShzbWFsbFBhdGgsIHRoaXMuc2FmZURlYnVnLCB0eXBlID09ICdzdHlsZScsIHRydWUpIH1cbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGEudmFsdWVcbiAgICB9XG5cbiAgICBhZGRTY3JpcHRTdHlsZVBhZ2UodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgaW5mbzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY3JpcHRTdHlsZSh0eXBlLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdwYWdlJykgPyB0aGlzLnNtYWxsUGF0aCA6IGluZm8uZXh0cmFjdEluZm8oKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVOYW1lKHRleHQ6IHN0cmluZykge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU3RhdGljRmlsZXNJbmZvLnN0b3JlKTtcbiAgICAgICAgd2hpbGUgKGtleSA9PSBudWxsIHx8IHZhbHVlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSBCYXNlNjRJZCh0ZXh0LCA1ICsgbGVuZ3RoKS5zdWJzdHJpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEhlYWRUYWdzKCkge1xuICAgICAgICBjb25zdCBpc0xvZ3MgPSB0aGlzLnR5cGVOYW1lID09IGdldFR5cGVzLkxvZ3NbMl1cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUxvY2F0aW9uID0gaS5wYXRoID09IHRoaXMuc21hbGxQYXRoICYmIGlzTG9ncyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV0sIGFkZFF1ZXJ5ID0gaXNMb2dzID8gJz90PWwnIDogJyc7XG4gICAgICAgICAgICBsZXQgdXJsID0gU3RhdGljRmlsZXNJbmZvLmhhdmUoaS5wYXRoLCAoKSA9PiBTZXNzaW9uQnVpbGQuY3JlYXRlTmFtZShpLnBhdGgpKSArICcucHViJztcblxuICAgICAgICAgICAgc3dpdGNoIChpLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IGRlZmVyOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLm1qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IHR5cGU6ICdtb2R1bGUnIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0eWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuY3NzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZSgnLycgKyB1cmwgKyBhZGRRdWVyeSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEVhc3lGcy53cml0ZUZpbGUoc2F2ZUxvY2F0aW9uICsgdXJsLCBpLnZhbHVlLmNyZWF0ZURhdGFXaXRoTWFwKCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZEhlYWQoKSB7XG4gICAgICAgIHRoaXMuYWRkSGVhZFRhZ3MoKTtcblxuICAgICAgICBjb25zdCBtYWtlQXR0cmlidXRlcyA9IChpOiBzZXREYXRhSFRNTFRhZykgPT4gaS5hdHRyaWJ1dGVzID8gJyAnICsgT2JqZWN0LmtleXMoaS5hdHRyaWJ1dGVzKS5tYXAoeCA9PiBpLmF0dHJpYnV0ZXNbeF0gPyB4ICsgYD1cIiR7aS5hdHRyaWJ1dGVzW3hdfVwiYCA6IHgpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgICAgIGNvbnN0IGFkZFR5cGVJbmZvID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdID8gJz90PWwnIDogJyc7XG4gICAgICAgIGxldCBidWlsZEJ1bmRsZVN0cmluZyA9ICcnOyAvLyBhZGQgc2NyaXB0cyBhZGQgY3NzXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnN0eWxlVVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtpLnVybCArIGFkZFR5cGVJbmZvfVwiJHttYWtlQXR0cmlidXRlcyhpKX0vPmA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNjcmlwdFVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8c2NyaXB0IHNyYz1cIiR7aS51cmwgKyBhZGRUeXBlSW5mb31cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Pjwvc2NyaXB0PmA7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkQnVuZGxlU3RyaW5nICsgdGhpcy5oZWFkSFRNTDtcbiAgICB9XG5cbiAgICBleHRlbmRzKGZyb206IFNlc3Npb25CdWlsZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3RvckFycmF5LnB1c2goLi4uZnJvbS5jb25uZWN0b3JBcnJheSk7XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goLi4uZnJvbS5zY3JpcHRVUkxTZXQpO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goLi4uZnJvbS5zdHlsZVVSTFNldCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGZyb20uaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goeyAuLi5pLCB2YWx1ZTogaS52YWx1ZS5jbG9uZSgpIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3B5T2JqZWN0cyA9IFsnY2FjaGVDb21waWxlU2NyaXB0JywgJ2NhY2hlQ29tcG9uZW50JywgJ2RlcGVuZGVuY2llcyddO1xuXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb3B5T2JqZWN0cykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzW2NdLCBmcm9tW2NdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaCguLi5mcm9tLnJlY29yZE5hbWVzLmZpbHRlcih4ID0+ICF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKHgpKSk7XG5cbiAgICAgICAgdGhpcy5oZWFkSFRNTCArPSBmcm9tLmhlYWRIVE1MO1xuICAgICAgICB0aGlzLmNhY2hlLnN0eWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0LnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHQpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdE1vZHVsZS5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0TW9kdWxlKTtcbiAgICB9XG5cbiAgICAvL2Jhc2ljIG1ldGhvZHNcbiAgICBCdWlsZFNjcmlwdFdpdGhQcmFtcyhjb2RlOiBTdHJpbmdUcmFja2VyKXtcbiAgICAgICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGNvZGUsIGlzVHMoKSwgdGhpcyk7ICBcbiAgICB9XG59IiwgIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCBjbGVhck1vZHVsZSBmcm9tICdjbGVhci1tb2R1bGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCksIHJlc29sdmUgPSAocGF0aDogc3RyaW5nKSA9PiByZXF1aXJlLnJlc29sdmUocGF0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGZpbGVQYXRoKTtcbiAgICBjbGVhck1vZHVsZShmaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufVxuXG5leHBvcnQge1xuICAgIGNsZWFyTW9kdWxlLFxuICAgIHJlc29sdmVcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55KSB7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJDb2RlKG9yaWdSdWxlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ1JlbmRlcmVkID0gb3JpZ1J1bGUoLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb2RlLWNvcHlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2NvcHktY2xpcGJvYXJkXCIgb25jbGljaz1cIm5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRoaXMucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0KVwiPmNvcHk8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgJHtvcmlnUmVuZGVyZWR9XG4gICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrKTtcbiAgICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuZmVuY2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIGNvbnN0IGhsanNDbGFzcyA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSkpLFxuICAgICAgICBicmVha3M6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSksXG4gICAgICAgIHR5cG9ncmFwaGVyOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3R5cG9ncmFwaGVyJywgbWFya0Rvd25QbHVnaW4/LnR5cG9ncmFwaGVyID8/IHRydWUpKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGVycixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdtYXJrZG93bi1wYXJzZXInXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoY29kZVdpdGhDb3B5KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYWJicicsIG1hcmtEb3duUGx1Z2luPy5hYmJyID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEFiYnIpO1xuXG4gICAgbGV0IG1hcmtkb3duQ29kZSA9IEJldHdlZW5UYWdEYXRhPy5lcTtcbiAgICBpZiAoIW1hcmtkb3duQ29kZSkge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpKSwgZGF0YVRhZy5yZW1vdmUoJ2ZpbGUnKSk7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnJlbW92ZSgnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICBzZXNzaW9uLnN0eWxlKGNzc0xpbmspO1xuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAndGhlbWUnLCBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgaWYgKGRhdGFUYWcubGVuZ3RoKVxuICAgICAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuICAgIGVsc2VcbiAgICAgICAgYnVpbGRIVE1MLkFkZFRleHRBZnRlcihyZW5kZXJIVE1MKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBidWlsZEhUTUwsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cbmNvbnN0IHRoZW1lQXJyYXkgPSBbJycsICctZGFyaycsICctbGlnaHQnXTtcbmNvbnN0IHRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlNYXJrZG93blRoZW1lKCkge1xuICAgIGZvciAoY29uc3QgaSBvZiB0aGVtZUFycmF5KSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSAoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoZW1lUGF0aCArIGkgKyAnLmNzcycpKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXG5cXC5tYXJrZG93bi1ib2R5IHspfCheLm1hcmtkb3duLWJvZHkgeykvZ20sIChtYXRjaDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoICsgJ3BhZGRpbmc6MjBweDsnXG4gICAgICAgICAgICB9KSArIGBcbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206LTMwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OjEwcHg7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTowO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weTpob3Zlcj5kaXYge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IGE6Zm9jdXMge1xuICAgICAgICAgICAgICAgIGNvbG9yOiM2YmI4NmFcbiAgICAgICAgICAgIH1gO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCAsIHNldERhdGFIVE1MVGFnfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxoZWFkJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB0eXBlIHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHsgU29tZVBsdWdpbnMgfSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG5hbWUgPSBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIHNlbmRUbyA9IGRhdGFUYWcuZ2V0VmFsdWUoJ3NlbmRUbycpLFxuICAgICAgICB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcuZ2V0VmFsdWUoJ3ZhbGlkYXRlJyksXG4gICAgICAgIG5vdFZhbGlkOiBzdHJpbmcgPSBkYXRhVGFnLnJlbW92ZSgnbm90VmFsaWQnKTtcblxuICAgIGxldCBtZXNzYWdlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnbWVzc2FnZScpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBpZiAobWVzc2FnZSA9PT0gbnVsbClcbiAgICAgICAgbWVzc2FnZSA9IHNlc3Npb25JbmZvLmRlYnVnICYmICFTb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKTtcblxuICAgICAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHsgYXN5bmM6IG51bGwgfSlcblxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dCh0ZW1wbGF0ZShuYW1lKSk7IC8vIGFkZCBzY3JpcHRcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiAnY29ubmVjdCcsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGxldCBidWlsZE9iamVjdCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gJ2Nvbm5lY3QnKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgYnVpbGRPYmplY3QgKz0gYCxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTpcIiR7aS5uYW1lfVwiLFxuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlskeyhpLnZhbGlkYXRvciAmJiBpLnZhbGlkYXRvci5tYXAoY29tcGlsZVZhbHVlcykuam9pbignLCcpKSB8fCAnJ31dXG4gICAgICAgIH1gO1xuICAgIH1cblxuICAgIGJ1aWxkT2JqZWN0ID0gYFske2J1aWxkT2JqZWN0LnN1YnN0cmluZygxKX1dYDtcblxuICAgIGNvbnN0IGFkZFNjcmlwdCA9IGBcbiAgICAgICAgaWYoUG9zdD8uY29ubmVjdG9yQ2FsbCl7XG4gICAgICAgICAgICBpZihhd2FpdCBoYW5kZWxDb25uZWN0b3IoXCJjb25uZWN0XCIsIHBhZ2UsICR7YnVpbGRPYmplY3R9KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9YDtcblxuICAgIGlmIChwYWdlRGF0YS5pbmNsdWRlcyhcIkBDb25uZWN0SGVyZVwiKSlcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcigvQENvbm5lY3RIZXJlKDs/KS8sICgpID0+IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGFkZFNjcmlwdCkpO1xuICAgIGVsc2VcbiAgICAgICAgcGFnZURhdGEuQWRkVGV4dEFmdGVyTm9UcmFjayhhZGRTY3JpcHQpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICghdGhpc1BhZ2UuUG9zdD8uY29ubmVjdG9yQ2FsbClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCBoYXZlID0gY29ubmVjdG9yQXJyYXkuZmluZCh4ID0+IHgubmFtZSA9PSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwubmFtZSk7XG5cbiAgICBpZiAoIWhhdmUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JDYWxsLnZhbHVlcztcbiAgICBjb25zdCBpc1ZhbGlkID0gaGF2ZS52YWxpZGF0b3IubGVuZ3RoICYmIGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGhhdmUudmFsaWRhdG9yKTtcblxuICAgIHRoaXNQYWdlLnNldFJlc3BvbnNlKCcnKTtcblxuICAgIGNvbnN0IGJldHRlckpTT04gPSAob2JqOiBhbnkpID0+IHtcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5lbmQoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gICAgfVxuXG4gICAgaWYgKCFoYXZlLnZhbGlkYXRvci5sZW5ndGggfHwgaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLnNlbmRUbyguLi52YWx1ZXMpKTtcblxuICAgIGVsc2UgaWYgKGhhdmUubm90VmFsaWQpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgaGF2ZS5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpKTtcblxuICAgIGVsc2UgaWYgKGhhdmUubWVzc2FnZSlcbiAgICAgICAgYmV0dGVySlNPTih7XG4gICAgICAgICAgICBlcnJvcjogdHlwZW9mIGhhdmUubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGhhdmUubWVzc2FnZSA6ICg8YW55PmlzVmFsaWQpLnNoaWZ0KClcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zdGF0dXMoNDAwKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNvbXBpbGVWYWx1ZXMsIG1ha2VWYWxpZGF0aW9uSlNPTiwgcGFyc2VWYWx1ZXMsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3Qgc2VuZFRvID0gZGF0YVRhZy5yZW1vdmUoJ3NlbmRUbycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgIHNlc3Npb25JbmZvKVxuICAgICAgICAgICAgICAgIH08L2Zvcm0+YCxcbiAgICAgICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICAgICAgfVxuXG5cbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5yZW1vdmUoJ25hbWUnKS50cmltKCkgfHwgdXVpZCgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCd2YWxpZGF0ZScpLCBvcmRlckRlZmF1bHQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdvcmRlcicpLCBub3RWYWxpZDogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcuaGF2ZSgnc2FmZScpO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdtZXNzYWdlJyk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlID09PSBudWxsKVxuICAgICAgICBtZXNzYWdlID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgIUluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKTtcblxuICAgIGxldCBvcmRlciA9IFtdO1xuXG4gICAgY29uc3QgdmFsaWRhdG9yQXJyYXkgPSB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geyAvLyBDaGVja2luZyBpZiB0aGVyZSBpcyBhbiBvcmRlciBpbmZvcm1hdGlvbiwgZm9yIGV4YW1wbGUgXCJwcm9wMTogc3RyaW5nLCBwcm9wMzogbnVtLCBwcm9wMjogYm9vbFwiXG4gICAgICAgIGNvbnN0IHNwbGl0ID0gU3BsaXRGaXJzdCgnOicsIHgudHJpbSgpKTtcblxuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIG9yZGVyLnB1c2goc3BsaXQuc2hpZnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIHNwbGl0LnBvcCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKG9yZGVyRGVmYXVsdClcbiAgICAgICAgb3JkZXIgPSBvcmRlckRlZmF1bHQuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JBcnJheSxcbiAgICAgICAgb3JkZXI6IG9yZGVyLmxlbmd0aCAmJiBvcmRlcixcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlc3BvbnNlU2FmZVxuICAgIH0pO1xuXG4gICAgaWYgKCFkYXRhVGFnLmhhdmUoJ21ldGhvZCcpKSB7XG4gICAgICAgIGRhdGFUYWcucHVzaCh7XG4gICAgICAgICAgICBuOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnbWV0aG9kJyksXG4gICAgICAgICAgICB2OiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAncG9zdCcpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkXG4gICAgICAgIGA8JSFcbkA/Q29ubmVjdEhlcmVGb3JtKCR7c2VuZFRvfSk7XG4lPjxmb3JtJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+XG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY29ubmVjdG9yRm9ybUNhbGxcIiB2YWx1ZT1cIiR7bmFtZX1cIi8+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pfTwvZm9ybT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gJ2Zvcm0nKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc2VuZFRvVW5pY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGkuc2VuZFRvKS51bmljb2RlLmVxXG4gICAgICAgIGNvbnN0IGNvbm5lY3QgPSBuZXcgUmVnRXhwKGBAQ29ubmVjdEhlcmVGb3JtXFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKSwgY29ubmVjdERlZmF1bHQgPSBuZXcgUmVnRXhwKGBAXFxcXD9Db25uZWN0SGVyZUZvcm1cXFxcKFsgXSoke3NlbmRUb1VuaWNvZGV9WyBdKlxcXFwpKDs/KWApO1xuXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBjb25zdCBzY3JpcHREYXRhID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YVswXS5TdGFydEluZm8pLlBsdXMkXG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgIGlmKFBvc3Q/LmNvbm5lY3RvckZvcm1DYWxsID09IFwiJHtpLm5hbWV9XCIpe1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBoYW5kZWxDb25uZWN0b3IoXCJmb3JtXCIsIHBhZ2UsIFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RWYWxpZDogJHtpLm5vdFZhbGlkIHx8ICdudWxsJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yOlske2kudmFsaWRhdG9yPy5tYXA/Lihjb21waWxlVmFsdWVzKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IFske2kub3JkZXI/Lm1hcD8uKGl0ZW0gPT4gYFwiJHtpdGVtfVwiYCk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6JHt0eXBlb2YgaS5tZXNzYWdlID09ICdzdHJpbmcnID8gYFwiJHtpLm1lc3NhZ2V9XCJgIDogaS5tZXNzYWdlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYWZlOiR7aS5yZXNwb25zZVNhZmV9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfWBcbiAgICAgICAgfTtcblxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3QsIHNjcmlwdERhdGEpO1xuXG4gICAgICAgIGlmIChjb3VudGVyKVxuICAgICAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKGNvbm5lY3REZWZhdWx0LCAnJyk7IC8vIGRlbGV0aW5nIGRlZmF1bHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0RGVmYXVsdCwgc2NyaXB0RGF0YSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9ySW5mbzogYW55KSB7XG5cbiAgICBkZWxldGUgdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JGb3JtQ2FsbDtcblxuICAgIGxldCB2YWx1ZXMgPSBbXTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLm9yZGVyLmxlbmd0aCkgLy8gcHVzaCB2YWx1ZXMgYnkgc3BlY2lmaWMgb3JkZXJcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNvbm5lY3RvckluZm8ub3JkZXIpXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzUGFnZS5Qb3N0W2ldKTtcbiAgICBlbHNlXG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLk9iamVjdC52YWx1ZXModGhpc1BhZ2UuUG9zdCkpO1xuXG5cbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiB8IHN0cmluZ1tdID0gdHJ1ZTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLnZhbGlkYXRvci5sZW5ndGgpIHsgLy8gdmFsaWRhdGUgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHBhcnNlVmFsdWVzKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgICAgICBpc1ZhbGlkID0gYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgIH1cblxuICAgIGxldCByZXNwb25zZTogYW55O1xuXG4gICAgaWYgKGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5zZW5kVG8oLi4udmFsdWVzKTtcbiAgICBlbHNlIGlmIChjb25uZWN0b3JJbmZvLm5vdFZhbGlkKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8ubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKTtcblxuICAgIGlmICghaXNWYWxpZCAmJiAhcmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLm1lc3NhZ2UgPT09IHRydWUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUoY29ubmVjdG9ySW5mby5tZXNzYWdlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzcG9uc2UgPSBjb25uZWN0b3JJbmZvLm1lc3NhZ2U7XG5cbiAgICBpZiAocmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLnNhZmUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUocmVzcG9uc2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZShyZXNwb25zZSk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcmVjb3JkU3RvcmUgPSBuZXcgU3RvcmVKU09OKCdSZWNvcmRzJyk7XG5cbmZ1bmN0aW9uIHJlY29yZExpbmsoZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGRhdGFUYWcucmVtb3ZlKCdsaW5rJyl8fCBDdXRUaGVMYXN0KCcuJywgU3BsaXRGaXJzdCgnLycsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCkucG9wKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVJlY29yZFBhdGgoZGVmYXVsdE5hbWU6IHN0cmluZywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKXtcbiAgICBjb25zdCBsaW5rID0gcmVjb3JkTGluayhkYXRhVGFnLCBzZXNzaW9uSW5mbyksIHNhdmVOYW1lID0gZGF0YVRhZy5yZW1vdmUoJ25hbWUnKSB8fCBkZWZhdWx0TmFtZTtcblxuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSA/Pz0ge307XG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdID8/PSAnJztcbiAgICBzZXNzaW9uSW5mby5yZWNvcmQoc2F2ZU5hbWUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RvcmU6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSxcbiAgICAgICAgY3VycmVudDogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdLFxuICAgICAgICBsaW5rXG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaHRtbCA9IGh0bWwudHJpbSgpO1xuXG4gICAgY29uc3Qge3N0b3JlLCBsaW5rfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3JlY29yZC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYoIXN0b3JlW2xpbmtdLmluY2x1ZGVzKGh0bWwpKXtcbiAgICAgICAgc3RvcmVbbGlua10gKz0gaHRtbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWNvcmRzKHNlc3Npb246IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbi5kZWJ1Zykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzZXNzaW9uLnJlY29yZE5hbWVzKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUocGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyQ29tcGlsZSgpe1xuICAgIHJlY29yZFN0b3JlLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpe1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBjb25zdCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKG5hbWUpO1xuICAgICAgICBpZihkaXJuYW1lKSBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGRpcm5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5pbXBvcnQgeyBtYWtlUmVjb3JkUGF0aH0gZnJvbSAnLi9yZWNvcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qge3N0b3JlLCBsaW5rLCBjdXJyZW50fSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3NlYXJjaC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IHNlYXJjaE9iamVjdCA9IGJ1aWxkT2JqZWN0KGh0bWwsIGRhdGFUYWcucmVtb3ZlKCdtYXRjaCcpIHx8ICdoMVtpZF0sIGgyW2lkXSwgaDNbaWRdLCBoNFtpZF0sIGg1W2lkXSwgaDZbaWRdJyk7XG5cbiAgICBpZighY3VycmVudCl7XG4gICAgICAgIHN0b3JlW2xpbmtdID0gc2VhcmNoT2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG5ld1RpdGxlcyA9IHNlYXJjaE9iamVjdC50aXRsZXMuZmlsdGVyKHggPT4gY3VycmVudC50aXRsZXMuZmluZChpID0+IGkuaWQgIT0geC5pZCkpXG4gICAgICAgIGN1cnJlbnQudGl0bGVzLnB1c2goLi4ubmV3VGl0bGVzKTtcblxuICAgICAgICBpZighY3VycmVudC50ZXh0LmluY2x1ZGVzKHNlYXJjaE9iamVjdC50ZXh0KSl7XG4gICAgICAgICAgICBjdXJyZW50LnRleHQgKz0gc2VhcmNoT2JqZWN0LnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0KGh0bWw6IHN0cmluZywgbWF0Y2g6IHN0cmluZykge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJzZShodG1sLCB7XG4gICAgICAgIGJsb2NrVGV4dEVsZW1lbnRzOiB7XG4gICAgICAgICAgICBzY3JpcHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3R5bGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9zY3JpcHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRpdGxlczoge2lkOiBzdHJpbmcsIHRleHQ6c3RyaW5nfVtdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKSkge1xuICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQuYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgdGl0bGVzLnB1c2goe1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICB0ZXh0OiBlbGVtZW50LmlubmVyVGV4dC50cmltKClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGVzLFxuICAgICAgICB0ZXh0OiByb290LmlubmVyVGV4dC50cmltKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9Db21wb25lbnRzL2NsaWVudCc7XG5pbXBvcnQgc2NyaXB0IGZyb20gJy4vQ29tcG9uZW50cy9zY3JpcHQvaW5kZXgnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vQ29tcG9uZW50cy9zdHlsZS9pbmRleCc7XG5pbXBvcnQgcGFnZSBmcm9tICcuL0NvbXBvbmVudHMvcGFnZSc7XG5pbXBvcnQgaXNvbGF0ZSBmcm9tICcuL0NvbXBvbmVudHMvaXNvbGF0ZSc7XG5pbXBvcnQgc3ZlbHRlIGZyb20gJy4vQ29tcG9uZW50cy9zdmVsdGUnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJy4vQ29tcG9uZW50cy9tYXJrZG93bic7XG5pbXBvcnQgaGVhZCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRIZWFkIH0gZnJvbSAnLi9Db21wb25lbnRzL2hlYWQnO1xuaW1wb3J0IGNvbm5lY3QsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdCwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckNvbm5lY3QgfSBmcm9tICcuL0NvbXBvbmVudHMvY29ubmVjdCc7XG5pbXBvcnQgZm9ybSwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRGb3JtLCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yRm9ybSB9IGZyb20gJy4vQ29tcG9uZW50cy9mb3JtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHJlY29yZCwgeyB1cGRhdGVSZWNvcmRzLCBwZXJDb21waWxlIGFzIHBlckNvbXBpbGVSZWNvcmQsIHBvc3RDb21waWxlIGFzIHBvc3RDb21waWxlUmVjb3JkIH0gZnJvbSAnLi9Db21wb25lbnRzL3JlY29yZCc7XG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vQ29tcG9uZW50cy9zZWFyY2gnO1xuXG5leHBvcnQgY29uc3QgQWxsQnVpbGRJbiA9IFtcImNsaWVudFwiLCBcInNjcmlwdFwiLCBcInN0eWxlXCIsIFwicGFnZVwiLCBcImNvbm5lY3RcIiwgXCJpc29sYXRlXCIsIFwiZm9ybVwiLCBcImhlYWRcIiwgXCJzdmVsdGVcIiwgXCJtYXJrZG93blwiLCBcInJlY29yZFwiLCBcInNlYXJjaFwiXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgbGV0IHJlRGF0YTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PjtcblxuICAgIHN3aXRjaCAodHlwZS5lcS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgXCJjbGllbnRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNsaWVudChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyZWNvcmRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHJlY29yZCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VhcmNoXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzZWFyY2goIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2NyaXB0KCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3R5bGUoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBhZ2VcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHBhZ2UocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY29ubmVjdCh0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZvcm1cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGZvcm0ocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXNvbGF0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGhlYWQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3ZlbHRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdmVsdGUodHlwZSwgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtYXJrZG93blwiOlxuICAgICAgICAgICAgcmVEYXRhID0gbWFya2Rvd24odHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ29tcG9uZW50IGlzIG5vdCBidWlsZCB5ZXRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzSW5jbHVkZSh0YWduYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gQWxsQnVpbGRJbi5pbmNsdWRlcyh0YWduYW1lLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB1cGRhdGVSZWNvcmRzKHNlc3Npb25JbmZvKTtcblxuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZENvbm5lY3QocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRGb3JtKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKC9AQ29ubmVjdEhlcmUoOz8pL2dpLCAnJykucmVwbGFjZSgvQENvbm5lY3RIZXJlRm9ybSg7PykvZ2ksICcnKTtcblxuICAgIHBhZ2VEYXRhID0gYXdhaXQgYWRkRmluYWxpemVCdWlsZEhlYWQocGFnZURhdGEsIHNlc3Npb25JbmZvLCBmdWxsQ29tcGlsZVBhdGgpO1xuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRlbENvbm5lY3RvclNlcnZpY2UodHlwZTogc3RyaW5nLCB0aGlzUGFnZTogYW55LCBjb25uZWN0b3JBcnJheTogYW55W10pIHtcbiAgICBpZiAodHlwZSA9PSAnY29ubmVjdCcpXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JDb25uZWN0KHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gaGFuZGVsQ29ubmVjdG9yRm9ybSh0aGlzUGFnZSwgY29ubmVjdG9yQXJyYXkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZSgpIHtcbiAgICBwZXJDb21waWxlUmVjb3JkKClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlKCkge1xuICAgIHBvc3RDb21waWxlUmVjb3JkKClcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFBhcnNlRGVidWdJbmZvLCBDcmVhdGVGaWxlUGF0aCwgUGF0aFR5cGVzLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBBbGxCdWlsZEluLCBJc0luY2x1ZGUsIFN0YXJ0Q29tcGlsaW5nIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBBcnJheU1hdGNoIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCB0YWdEYXRhT2JqZWN0QXNUZXh0LCBDb21waWxlSW5GaWxlRnVuYywgU3RyaW5nQXJyYXlPck9iamVjdCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5cbmludGVyZmFjZSBEZWZhdWx0VmFsdWVzIHtcbiAgICB2YWx1ZTogU3RyaW5nVHJhY2tlcixcbiAgICBlbGVtZW50czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50IGV4dGVuZHMgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgcHVibGljIGRpckZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBQbHVnaW5CdWlsZDogQWRkUGx1Z2luO1xuICAgIHB1YmxpYyBDb21waWxlSW5GaWxlOiBDb21waWxlSW5GaWxlRnVuYztcbiAgICBwdWJsaWMgTWljcm9QbHVnaW5zOiBTdHJpbmdBcnJheU9yT2JqZWN0O1xuICAgIHB1YmxpYyBHZXRQbHVnaW46IChuYW1lOiBzdHJpbmcpID0+IGFueTtcbiAgICBwdWJsaWMgU29tZVBsdWdpbnM6ICguLi5uYW1lczogc3RyaW5nW10pID0+IGJvb2xlYW47XG4gICAgcHVibGljIGlzVHM6ICgpID0+IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIHJlZ2V4U2VhcmNoOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3RvcihQbHVnaW5CdWlsZDogQWRkUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKFByaW50SWZOZXcpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0IHRha2VzIGEgc3RyaW5nIG9mIEhUTUwgYW5kIHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB0aGF0IGNvbnRhaW4gdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSxcbiAgICAgKiB0aGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSwgYW5kIHRoZSBjaGFyYWN0ZXIgdGhhdCBjb21lcyBhZnRlciB0aGUgYXR0cmlidXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSB0ZXh0IC0gVGhlIHRleHQgdG8gcGFyc2UuXG4gICAgICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAgICAgKi9cbiAgICB0YWdEYXRhKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiB7IGRhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgbWFwQXR0cmlidXRlczogU3RyaW5nQW55TWFwIH0ge1xuICAgICAgICBjb25zdCB0b2tlbkFycmF5ID0gW10sIGE6IHRhZ0RhdGFPYmplY3RBcnJheSA9IFtdLCBtYXBBdHRyaWJ1dGVzOiBTdHJpbmdBbnlNYXAgPSB7fTtcblxuICAgICAgICB0ZXh0ID0gdGV4dC50cmltKCkucmVwbGFjZXIoLyg8JSkoW1xcd1xcV10rPykoJT4pLywgZGF0YSA9PiB7XG4gICAgICAgICAgICB0b2tlbkFycmF5LnB1c2goZGF0YVsyXSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVsxXS5QbHVzKGRhdGFbM10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB1blRva2VuID0gKHRleHQ6IFN0cmluZ1RyYWNrZXIpID0+IHRleHQucmVwbGFjZXIoLyg8JSkoJT4pLywgKGRhdGEpID0+IGRhdGFbMV0uUGx1cyh0b2tlbkFycmF5LnNoaWZ0KCkpLlBsdXMoZGF0YVsyXSkpXG5cbiAgICAgICAgbGV0IGZhc3RUZXh0ID0gdGV4dC5lcTtcbiAgICAgICAgY29uc3QgU2tpcFR5cGVzID0gWydcIicsIFwiJ1wiLCAnYCddLCBCbG9ja1R5cGVzID0gW1xuICAgICAgICAgICAgWyd7JywgJ30nXSxcbiAgICAgICAgICAgIFsnKCcsICcpJ11cbiAgICAgICAgXTtcblxuICAgICAgICB3aGlsZSAoZmFzdFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGZhc3RUZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhciA9IGZhc3RUZXh0LmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhciA9PSAnPScpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRDaGFyID0gdGV4dC5hdChpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRDaGFyRXEgPSBuZXh0Q2hhci5lcSwgYXR0ck5hbWUgPSB0ZXh0LnN1YnN0cmluZygwLCBpKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWU6IFN0cmluZ1RyYWNrZXIsIGVuZEluZGV4OiBudW1iZXIsIGJsb2NrRW5kOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTa2lwVHlwZXMuaW5jbHVkZXMobmV4dENoYXJFcSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKGZhc3RUZXh0LnN1YnN0cmluZyhpICsgMiksIG5leHRDaGFyRXEpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGV4dC5zdWJzdHIoaSArIDIsIGVuZEluZGV4IC0gMik7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoYmxvY2tFbmQgPSBCbG9ja1R5cGVzLmZpbmQoeCA9PiB4WzBdID09IG5leHRDaGFyRXEpPy5bMV0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZmFzdFRleHQuc3Vic3RyaW5nKGkgKyAyKSwgW25leHRDaGFyRXEsIGJsb2NrRW5kXSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0ZXh0LnN1YnN0cihpICsgMSwgZW5kSW5kZXggKyAxKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBmYXN0VGV4dC5zdWJzdHJpbmcoaSArIDEpLnNlYXJjaCgvIHxcXG4vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRJbmRleCA9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGZhc3RUZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGV4dC5zdWJzdHIoaSArIDEsIGVuZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRDaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSB1blRva2VuKGF0dHJOYW1lKSwgdiA9IHVuVG9rZW4odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBtYXBBdHRyaWJ1dGVzW24uZXFdID0gdi5lcTtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4sXG4gICAgICAgICAgICAgICAgICAgICAgICB2LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcjogbmV4dENoYXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMSArIGVuZEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnICcgfHwgaSA9PSBmYXN0VGV4dC5sZW5ndGggLSAxICYmICsraSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gdW5Ub2tlbih0ZXh0LnN1YnN0cmluZygwLCBpKSk7XG4gICAgICAgICAgICAgICAgICAgIGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuOiBuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBtYXBBdHRyaWJ1dGVzW24uZXFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZhc3RUZXh0ID0gZmFzdFRleHQuc3Vic3RyaW5nKGkpLnRyaW0oKTtcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZyhpKS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL21ldGhvZHMgdG8gdGhlIGFycmF5XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKG5hbWU6IHN0cmluZykgPT4gYS5maW5kSW5kZXgoeCA9PiB4Lm4uZXEgPT0gbmFtZSk7XG4gICAgICAgIGNvbnN0IGdldFZhbHVlID0gKG5hbWU6IHN0cmluZykgPT4gYS5maW5kKHRhZyA9PiB0YWcubi5lcSA9PSBuYW1lKT8udj8uZXEgPz8gJyc7XG4gICAgICAgIGNvbnN0IHJlbW92ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVJbmRleCA9IGluZGV4KG5hbWUpO1xuICAgICAgICAgICAgaWYgKG5hbWVJbmRleCA9PSAtMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICByZXR1cm4gYS5zcGxpY2UobmFtZUluZGV4LCAxKS5wb3AoKS52Py5lcSA/PyAnJztcbiAgICAgICAgfTtcblxuICAgICAgICBhLmhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiBpbmRleChuYW1lKSAhPSAtMTtcbiAgICAgICAgYS5nZXRWYWx1ZSA9IGdldFZhbHVlO1xuICAgICAgICBhLnJlbW92ZSA9IHJlbW92ZTtcbiAgICAgICAgYS5hZGRDbGFzcyA9IGMgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IGluZGV4KCdjbGFzcycpO1xuICAgICAgICAgICAgaWYgKGkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goeyBuOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnY2xhc3MnKSwgdjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYyksIGNoYXI6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdcIicpIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0udi5sZW5ndGgpXG4gICAgICAgICAgICAgICAgYyA9ICcgJyArIGM7XG4gICAgICAgICAgICBpdGVtLnYuQWRkVGV4dEFmdGVyKGMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRhdGE6IGEsIG1hcEF0dHJpYnV0ZXMgfTtcbiAgICB9XG5cbiAgICBmaW5kSW5kZXhTZWFyY2hUYWcocXVlcnk6IHN0cmluZywgdGFnOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHF1ZXJ5LnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMFxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRhZy5pbmRleE9mKGkpXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgUmVCdWlsZFRhZ0RhdGEoc3RyaW5nSW5mbzogU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBkYXRhVGFnU3BsaXR0ZXI6IHRhZ0RhdGFPYmplY3RBcnJheSkge1xuICAgICAgICBsZXQgbmV3QXR0cmlidXRlcyA9IG5ldyBTdHJpbmdUcmFja2VyKHN0cmluZ0luZm8pO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhVGFnU3BsaXR0ZXIpIHtcbiAgICAgICAgICAgIGlmIChpLnYpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMkYCR7aS5ufT0ke2kuY2hhcn0ke2kudn0ke2kuY2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzKGkubiwgJyAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhVGFnU3BsaXR0ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoc3RyaW5nSW5mbywgJyAnKS5QbHVzKG5ld0F0dHJpYnV0ZXMuc3Vic3RyaW5nKDAsIG5ld0F0dHJpYnV0ZXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0F0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIFNlbmREYXRhRnVuYzogKHRleHQ6IFN0cmluZ1RyYWNrZXIpID0+IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pIHtcbiAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhICYmIHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhLlNwYWNlT25lKCcgJyk7XG5cbiAgICAgICAgICAgIGRhdGFUYWcgPSB0aGlzLlJlQnVpbGRUYWdEYXRhKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnU3BsaWNlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIGNvbXBvbmVudDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBsZXQgeyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH0gPSB0aGlzLmV4cG9ydERlZmF1bHRWYWx1ZXMoY29tcG9uZW50KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGFnRGF0YSkge1xuICAgICAgICAgICAgaWYgKGkubi5lcSA9PSAnJicpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmUgPSBpLm4uc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IEZvdW5kSW5kZXg6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIGlmIChyZS5pbmNsdWRlcygnJicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcmUuaW5kZXhPZignJicpO1xuICAgICAgICAgICAgICAgICAgICBGb3VuZEluZGV4ID0gdGhpcy5maW5kSW5kZXhTZWFyY2hUYWcocmUuc3Vic3RyaW5nKDAsIGluZGV4KS5lcSwgZmlsZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZSA9IHJlLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEZvdW5kSW5kZXggPSBmaWxlRGF0YS5zZWFyY2goL1xcIHxcXD4vKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVEYXRhTmV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGZpbGVEYXRhLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydERhdGEgPSBmaWxlRGF0YS5zdWJzdHJpbmcoMCwgRm91bmRJbmRleCk7XG4gICAgICAgICAgICAgICAgZmlsZURhdGFOZXh0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIoZmlsZURhdGEuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGAgJHtyZX09XCIke2kudiA/PyAnJ31cImAsXG4gICAgICAgICAgICAgICAgICAgIChzdGFydERhdGEuZW5kc1dpdGgoJyAnKSA/ICcnIDogJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZURhdGEuc3Vic3RyaW5nKEZvdW5kSW5kZXgpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGFOZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoXCJcXFxcflwiICsgaS5uLmVxLCBcImdpXCIpO1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZShyZSwgaS52ID8/IGkubik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5hZGREZWZhdWx0VmFsdWVzKGZvdW5kU2V0dGVycywgZmlsZURhdGEpO1xuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkVGFnQmFzaWMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIHRhZ0RhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIGFzeW5jIGluc2VydFRhZ0RhdGEocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgeyBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8gfTogeyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXJ9KSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YSwgbWFwQXR0cmlidXRlcyB9ID0gdGhpcy50YWdEYXRhKGRhdGFUYWcpLCBCdWlsZEluID0gSXNJbmNsdWRlKHR5cGUuZXEpO1xuXG4gICAgICAgIGxldCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgU2VhcmNoSW5Db21tZW50ID0gdHJ1ZSwgQWxsUGF0aFR5cGVzOiBQYXRoVHlwZXMgPSB7fSwgYWRkU3RyaW5nSW5mbzogc3RyaW5nO1xuXG4gICAgICAgIGlmIChCdWlsZEluKSB7Ly9jaGVjayBpZiBpdCBidWlsZCBpbiBjb21wb25lbnRcbiAgICAgICAgICAgIGNvbnN0IHsgY29tcGlsZWRTdHJpbmcsIGNoZWNrQ29tcG9uZW50cyB9ID0gYXdhaXQgU3RhcnRDb21waWxpbmcoIHBhdGhOYW1lLCB0eXBlLCBkYXRhLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGEuaGF2ZSgnZm9sZGVyJyk7XG5cbiAgICAgICAgICAgIGlmIChmb2xkZXIpXG4gICAgICAgICAgICAgICAgZm9sZGVyID0gZGF0YS5yZW1vdmUoJ2ZvbGRlcicpIHx8ICcuJztcblxuICAgICAgICAgICAgY29uc3QgdGFnUGF0aCA9IChmb2xkZXIgPyBmb2xkZXIgKyAnLycgOiAnJykgKyB0eXBlLnJlcGxhY2UoLzovZ2ksIFwiL1wiKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCA9IHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpLCByZWxhdGl2ZXNGaWxlUGF0aCA9IHBhdGhOb2RlLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwpO1xuICAgICAgICAgICAgQWxsUGF0aFR5cGVzID0gQ3JlYXRlRmlsZVBhdGgocmVsYXRpdmVzRmlsZVBhdGgsIHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwsIHRhZ1BhdGgsIHRoaXMuZGlyRm9sZGVyLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnQpO1xuXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPT09IG51bGwgfHwgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPT09IHVuZGVmaW5lZCAmJiAhYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoQWxsUGF0aFR5cGVzLkZ1bGxQYXRoKSkge1xuICAgICAgICAgICAgICAgIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChmb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlJlQnVpbGRUYWcodHlwZSwgZGF0YVRhZywgZGF0YSwgQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhID0+IHRoaXMuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXT8ubXRpbWVNcylcbiAgICAgICAgICAgICAgICBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IHsgbXRpbWVNczogYXdhaXQgRWFzeUZzLnN0YXQoQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCAnbXRpbWVNcycpIH07IC8vIGFkZCB0byBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICAgICAgICAgIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llc1tBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdLm10aW1lTXNcblxuICAgICAgICAgICAgY29uc3QgeyBhbGxEYXRhLCBzdHJpbmdJbmZvIH0gPSBhd2FpdCBBZGREZWJ1Z0luZm8ocGF0aE5hbWUsIEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0pO1xuICAgICAgICAgICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShhbGxEYXRhLCB0aGlzLmlzVHMoKSk7XG4gICAgICAgICAgICBhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3Moc2Vzc2lvbkluZm8sIEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCBtYXBBdHRyaWJ1dGVzKTtcblxuICAgICAgICAgICAgZmlsZURhdGEgPSBiYXNlRGF0YS5zY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICAgICAgICAgIGFkZFN0cmluZ0luZm8gPSBzdHJpbmdJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFNlYXJjaEluQ29tbWVudCAmJiAoZmlsZURhdGEubGVuZ3RoID4gMCB8fCBCZXR3ZWVuVGFnRGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQWxsUGF0aFR5cGVzO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuYnVpbGRUYWdCYXNpYyhmaWxlRGF0YSwgZGF0YSwgQnVpbGRJbiA/IHR5cGUuZXEgOiBGdWxsUGF0aCwgQnVpbGRJbiA/IHR5cGUuZXEgOiBTbWFsbFBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbywgQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyAmJiBmaWxlRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhhZGRTdHJpbmdJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIENoZWNrRG91YmxlU3BhY2UoLi4uZGF0YTogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKTtcbiAgICAgICAgbGV0IHN0YXJ0RGF0YSA9IGRhdGEuc2hpZnQoKTtcblxuICAgICAgICBpZiAobWluaSkge1xuICAgICAgICAgICAgc3RhcnREYXRhID0gc3RhcnREYXRhLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChtaW5pICYmIHN0YXJ0RGF0YS5lbmRzV2l0aCgnICcpICYmIGkuc3RhcnRzV2l0aCgnICcpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RhcnREYXRhID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgMSA9PSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnREYXRhLlBsdXMoaSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWluaSkge1xuICAgICAgICAgICAgc3RhcnREYXRhID0gc3RhcnREYXRhLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhcnREYXRhO1xuICAgIH1cblxuICAgIGFzeW5jIFN0YXJ0UmVwbGFjZShkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIGxldCBmaW5kOiBudW1iZXI7XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZUJ1aWxkOiAoU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pW10gPSBbXTtcblxuICAgICAgICB3aGlsZSAoKGZpbmQgPSBkYXRhLnNlYXJjaCh0aGlzLnJlZ2V4U2VhcmNoKSkgIT0gLTEpIHtcblxuICAgICAgICAgICAgLy9oZWNrIGlmIHRoZXJlIGlzIHNwZWNpYWwgdGFnIC0gbmVlZCB0byBza2lwIGl0XG4gICAgICAgICAgICBjb25zdCBsb2NTa2lwID0gZGF0YS5lcTtcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpYWxTa2lwID0gdGhpcy5GaW5kU3BlY2lhbFRhZ0J5U3RhcnQobG9jU2tpcC50cmltKCkpO1xuXG4gICAgICAgICAgICBpZiAoc3BlY2lhbFNraXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGxvY1NraXAuaW5kZXhPZihzcGVjaWFsU2tpcFswXSkgKyBzcGVjaWFsU2tpcFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gbG9jU2tpcC5zdWJzdHJpbmcoc3RhcnQpLmluZGV4T2Yoc3BlY2lhbFNraXBbMV0pICsgc3RhcnQgKyBzcGVjaWFsU2tpcFsxXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goZGF0YS5zdWJzdHJpbmcoMCwgZW5kKSk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGVuZCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZmluZGluZyB0aGUgdGFnXG4gICAgICAgICAgICBjb25zdCBjdXRTdGFydERhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kKTsgLy88XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0RnJvbSA9IGRhdGEuc3Vic3RyaW5nKGZpbmQpO1xuXG4gICAgICAgICAgICAvL3RhZyB0eXBlIFxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZUVuZCA9IHN0YXJ0RnJvbS5zZWFyY2goJ1xcIHwvfFxcPnwoPCUpJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1R5cGUgPSBzdGFydEZyb20uc3Vic3RyaW5nKDEsIHRhZ1R5cGVFbmQpO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kRW5kT2ZTbWFsbFRhZyA9IGF3YWl0IHRoaXMuRmluZENsb3NlQ2hhcihzdGFydEZyb20uc3Vic3RyaW5nKDEpLCAnPicpICsgMTtcblxuICAgICAgICAgICAgbGV0IGluVGFnID0gc3RhcnRGcm9tLnN1YnN0cmluZyh0YWdUeXBlRW5kICsgMSwgZmluZEVuZE9mU21hbGxUYWcpO1xuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhcnRGcm9tLmF0KGZpbmRFbmRPZlNtYWxsVGFnIC0gMSkuZXEgPT0gJy8nKSB7Ly9zbWFsbCB0YWdcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja01pbkhUTUwoY3V0U3RhcnREYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRUYWdEYXRhKHBhdGhOYW1lLCB0YWdUeXBlLCBpblRhZywgeyAgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7dGFnVHlwZX1cIiwgdXNlZCBpbjogJHt0YWdUeXBlLmF0KDApLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNsb3NlLXRhZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggIT0gbnVsbCAmJiBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoMCwgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcblxuICAgICAgICAgICAgLy9maW5kaW5nIGxhc3QgY2xvc2UgXG4gICAgICAgICAgICBjb25zdCBOZXh0RGF0YUNsb3NlID0gTmV4dFRleHRUYWcuc3Vic3RyaW5nKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBOZXh0RGF0YUFmdGVyQ2xvc2UgPSBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggIT0gbnVsbCA/IE5leHREYXRhQ2xvc2Uuc3Vic3RyaW5nKEJhc2VSZWFkZXIuZmluZEVuZE9mRGVmKE5leHREYXRhQ2xvc2UuZXEsICc+JykgKyAxKSA6IE5leHREYXRhQ2xvc2U7IC8vIHNlYXJjaCBmb3IgdGhlIGNsb3NlIG9mIGEgYmlnIHRhZyBqdXN0IGlmIHRoZSB0YWcgaXMgdmFsaWRcblxuICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgdGhpcy5DaGVja01pbkhUTUwoY3V0U3RhcnREYXRhKSxcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydFRhZ0RhdGEocGF0aE5hbWUsIHRhZ1R5cGUsIGluVGFnLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZGF0YSA9IE5leHREYXRhQWZ0ZXJDbG9zZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IHRleHRCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcHJvbWlzZUJ1aWxkKSB7XG4gICAgICAgICAgICB0ZXh0QnVpbGQgPSB0aGlzLkNoZWNrRG91YmxlU3BhY2UodGV4dEJ1aWxkLCBhd2FpdCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkNoZWNrTWluSFRNTCh0aGlzLkNoZWNrRG91YmxlU3BhY2UodGV4dEJ1aWxkLCBkYXRhKSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIFJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb2RlID0gY29kZS50cmltKCk7XG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoLyU+WyBdKzwlKD8hWz06XSkvLCAnJT48JScpO1xuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9XG5cbiAgICBhc3luYyBJbnNlcnQoZGF0YTogU3RyaW5nVHJhY2tlciwgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vcmVtb3ZpbmcgaHRtbCBjb21tZW50IHRhZ3NcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPCEtLVtcXHdcXFddKz8tLT4vLCAnJyk7XG5cbiAgICAgICAgZGF0YSA9IGF3YWl0IHRoaXMuU3RhcnRSZXBsYWNlKGRhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHJlYWRlciwgcmVwbGFjaW5nIGhpbSB3aXRoICdjb2RlYmFzZSdcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPFxcOnJlYWRlcisoICkqXFwvPi9naSwgJzwldHlwZW9mIHBhZ2UuY29kZWJhc2UgPT0gXCJmdW5jdGlvblwiID8gcGFnZS5jb2RlYmFzZSgpOiB3cml0ZShwYWdlLmNvZGViYXNlKSU+JykgLy8gcmVwbGFjZSBmb3IgaW1wb3J0aW5nIHBhZ2VzIC8gY29tcG9uZW50c1xuICAgICAgICByZXR1cm4gdGhpcy5SZW1vdmVVbm5lY2Vzc2FyeVNwYWNlKGRhdGEpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5mdW5jdGlvbiB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgIGxldCBhID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnN1YnN0cigtNCk7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXRNYWluKGRhdGE6IFN0cmluZ1RyYWNrZXIsIGFycmF5OnN0cmluZ1tdLCBzaW5nOnN0cmluZywgYmlnVGFnPzpib29sZWFuLCBzZWFyY2hGb3I/OmJvb2xlYW4pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGxldCBvdXQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZSBvZiBhcnJheSkge1xuICAgICAgICBvdXQgKz0gdW5pY29kZU1lKHNpbmcpICsgZSArIFwifFwiO1xuICAgIH1cbiAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKDAsIG91dC5sZW5ndGggLSAxKTtcbiAgICBvdXQgPSBgPCgke291dH0pJHtzZWFyY2hGb3IgPyBcIihbXFxcXHB7TH0wLTlfXFxcXC1cXFxcLl0rKVwiOiBcIlwifShcXFxcdTAwMjApKlxcXFx1MDAyRj8+YFxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgbmV3IFJlZ0V4cChvdXQsICd1JyksIHNpbmcsIGJpZ1RhZylcbn1cblxuZnVuY3Rpb24gb3V0VGFnTmFtZShkYXRhOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbmQgPSBkYXRhLmluZGV4T2YoXCI+XCIpO1xuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBlbmQpO1xuICAgIHdoaWxlIChkYXRhLmVuZHNXaXRoKFwiIFwiKSB8fCBkYXRhLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZGF0YS5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXREYXRhIHtcbiAgICB0YWc6IHN0cmluZyxcbiAgICBkYXRhOiBTdHJpbmdUcmFja2VyLFxuICAgIGxvYzogbnVtYmVyLFxufVxuXG5pbnRlcmZhY2UgU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBkYXRhPzogU3RyaW5nVHJhY2tlcixcbiAgICBlcnJvcj86IGJvb2xlYW4sXG4gICAgZm91bmQ/OiBTZWFyY2hDdXREYXRhW11cbn1cblxuLyoqXG4gKiBJdCBzZWFyY2hlcyBmb3IgYSBzcGVjaWZpYyB0YWcgYW5kIHJldHVybnMgdGhlIGRhdGEgaW5zaWRlIG9mIGl0LlxuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSBkYXRhIC0gVGhlIHN0cmluZyB5b3Ugd2FudCB0byBzZWFyY2ggdGhyb3VnaC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBmaW5kQXJyYXkgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2luZyAtIFRoZSBzdHJpbmcgdGhhdCB5b3Ugd2FudCB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIFtiaWdUYWc9dHJ1ZV0gLSBJZiB0cnVlLCB0aGUgZnVuY3Rpb24gd2lsbCBzZWFyY2ggZm9yIHRoZSBlbmQgb2YgdGhlIHRhZy4gSWYgZmFsc2UsIGl0IHdpbGxcbiAqIHNlYXJjaCBmb3IgdGhlIG5leHQgaW5zdGFuY2Ugb2YgdGhlIHRhZy5cbiAqIEBwYXJhbSBvdXRwdXQgLSBUaGUgb3V0cHV0IG9mIHRoZSBzZWFyY2guXG4gKiBAcGFyYW0ge1NlYXJjaEN1dERhdGFbXX0gcmV0dXJuQXJyYXkgLSBBbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgdGFnIG5hbWUsIHRoZSBkYXRhXG4gKiBpbnNpZGUgdGhlIHRhZywgYW5kIHRoZSBsb2NhdGlvbiBvZiB0aGUgdGFnIGluIHRoZSBvcmlnaW5hbCBzdHJpbmcuXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvZiB0aGUgZGF0YSB0aGF0IHdhcyBmb3VuZCwgYW5kIGFuIGFycmF5IG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLlxuICovXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXQoZGF0YTpTdHJpbmdUcmFja2VyLCBmaW5kQXJyYXk6UmVnRXhwLCBzaW5nOnN0cmluZywgYmlnVGFnID0gdHJ1ZSwgb3V0cHV0ID0gbmV3IFN0cmluZ1RyYWNrZXIoKSwgcmV0dXJuQXJyYXk6IFNlYXJjaEN1dERhdGFbXSA9IFtdKTogU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBjb25zdCBkYXRhQ29weSA9IGRhdGE7XG4gICAgY29uc3QgYmUgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgIGlmIChiZSA9PSAtMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogb3V0cHV0LlBsdXMoZGF0YSksIGZvdW5kOiByZXR1cm5BcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG91dHB1dC5QbHVzKGRhdGEuc3Vic3RyaW5nKDAsIGJlKSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoYmUgKyAxKTtcblxuICAgIGNvbnN0IHRhZyA9IG91dFRhZ05hbWUoZGF0YS5lcSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZFN0YXJ0KFwiPlwiLCBkYXRhKSk7XG5cbiAgICBsZXQgaW5UYWdEYXRhO1xuXG4gICAgaWYgKGJpZ1RhZykge1xuICAgICAgICBjb25zdCBlbmQgPSBmaW5kRW5kKFtcIjxcIiArIHRhZywgXCI8L1wiICsgdGFnXSwgZGF0YSk7XG4gICAgICAgIGlmIChlbmQgIT0gLTEpIHtcbiAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmROZXh0ID0gZGF0YS5zZWFyY2goZmluZEFycmF5KTtcbiAgICAgICAgICAgIGlmIChmaW5kTmV4dCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kTmV4dCk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmROZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybkFycmF5LnB1c2goe1xuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgZGF0YTogaW5UYWdEYXRhLFxuICAgICAgICBsb2M6IGJlXG4gICAgfSk7XG5cbiAgICBpZiAoZGF0YUNvcHkgPT0gZGF0YSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgZmluZEFycmF5LCBzaW5nLCBiaWdUYWcsIG91dHB1dCwgcmV0dXJuQXJyYXkpO1xufVxuXG5mdW5jdGlvbiBmaW5kU3RhcnQodHlwZTpzdHJpbmcsIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuICAgIHJldHVybiBkYXRhLmluZGV4T2YodHlwZSkgKyB0eXBlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gZmluZEVuZCh0eXBlczogc3RyaW5nW10sIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuXG4gICAgbGV0IF8wID0gZGF0YS5pbmRleE9mKHR5cGVzWzBdKTtcblxuICAgIGNvbnN0IF8xID0gZGF0YS5pbmRleE9mKHR5cGVzWzFdKTtcblxuICAgIGlmIChfMSA9PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKF8wIDwgXzEgJiYgXzAgIT0gLTEpIHtcbiAgICAgICAgXzArKztcbiAgICAgICAgY29uc3QgbmV4dCA9IF8wICsgZmluZEVuZCh0eXBlcywgZGF0YS5zdWJzdHJpbmcoXzApKSArIHR5cGVzWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG5leHQgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhuZXh0KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXzE7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7XG4gICAgc2VhcmNoRm9yQ3V0TWFpbiBhcyBnZXREYXRhVGFnZXNcbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2VSZWFkZXIgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBnZXREYXRhVGFnZXMgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IENSdW5UaW1lIGZyb20gXCIuL0NvbXBpbGVcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5cbmV4cG9ydCBjb25zdCBzZXR0aW5ncyA9IHtkZWZpbmU6IHt9fTtcblxuY29uc3Qgc3RyaW5nQXR0cmlidXRlcyA9IFsnXFwnJywgJ1wiJywgJ2AnXTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlQmFzZVBhZ2Uge1xuICAgIHB1YmxpYyBjbGVhckRhdGE6IFN0cmluZ1RyYWNrZXJcbiAgICBwdWJsaWMgc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBwdWJsaWMgdmFsdWVBcnJheTogeyBrZXk6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIgfVtdID0gW11cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCBzZXNzaW9uSW5mbywgc21hbGxQYXRoLCB0aGlzLmlzVHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSBhd2FpdCBydW4uY29tcGlsZShhdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLnBhcnNlQmFzZSh0aGlzLmNvZGUpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRDb2RlRmlsZShwYWdlUGF0aCwgc21hbGxQYXRoLCB0aGlzLmlzVHMsIHNlc3Npb25JbmZvLCBwYWdlTmFtZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvYWREZWZpbmUoey4uLnNldHRpbmdzLmRlZmluZSwgLi4ucnVuLmRlZmluZX0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgbGV0IGRhdGFTcGxpdDogU3RyaW5nVHJhY2tlcjtcblxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlcigvQFxcW1sgXSooKFtBLVphLXpfXVtBLVphLXpfMC05XSo9KChcIlteXCJdKlwiKXwoYFteYF0qYCl8KCdbXiddKicpfFtBLVphLXowLTlfXSspKFsgXSosP1sgXSopPykqKVxcXS8sIGRhdGEgPT4ge1xuICAgICAgICAgICAgZGF0YVNwbGl0ID0gZGF0YVsxXS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGRhdGFTcGxpdD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBmaW5kV29yZCA9IGRhdGFTcGxpdC5pbmRleE9mKCc9Jyk7XG5cbiAgICAgICAgICAgIGxldCB0aGlzV29yZCA9IGRhdGFTcGxpdC5zdWJzdHJpbmcoMCwgZmluZFdvcmQpLnRyaW0oKS5lcTtcblxuICAgICAgICAgICAgaWYgKHRoaXNXb3JkWzBdID09ICcsJylcbiAgICAgICAgICAgICAgICB0aGlzV29yZCA9IHRoaXNXb3JkLnN1YnN0cmluZygxKS50cmltKCk7XG5cbiAgICAgICAgICAgIGxldCBuZXh0VmFsdWUgPSBkYXRhU3BsaXQuc3Vic3RyaW5nKGZpbmRXb3JkICsgMSk7XG5cbiAgICAgICAgICAgIGxldCB0aGlzVmFsdWU6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQ2hhciA9IG5leHRWYWx1ZS5hdCgwKS5lcTtcbiAgICAgICAgICAgIGlmIChzdHJpbmdBdHRyaWJ1dGVzLmluY2x1ZGVzKGNsb3NlQ2hhcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVudE9mUShuZXh0VmFsdWUuZXEuc3Vic3RyaW5nKDEpLCBjbG9zZUNoYXIpO1xuICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoMSwgZW5kSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZyhlbmRJbmRleCArIDEpLnRyaW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBuZXh0VmFsdWUuc2VhcmNoKC9bXyAsXS8pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKGVuZEluZGV4KS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhU3BsaXQgPSBuZXh0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogdGhpc1dvcmQsIHZhbHVlOiB0aGlzVmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZighdGhpcy52YWx1ZUFycmF5Lmxlbmd0aCkgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ0BbJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGtleSwgdmFsdWUgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMkYCR7a2V5fT1cIiR7dmFsdWUucmVwbGFjZUFsbCgnXCInLCAnXFxcXFwiJyl9XCJgO1xuICAgICAgICB9XG4gICAgICAgIGJ1aWxkLlBsdXMoXCJdXCIpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBwYXJzZS5wb3AobmFtZSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMoYDxAJHtuYW1lfT48OiR7bmFtZX0vPjwvQCR7bmFtZX0+YClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICByZXR1cm4gcGFyc2UuY2xlYXJEYXRhLlBsdXMoYnVpbGQpO1xuICAgIH1cblxuXG4gICAgcG9wKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZSh0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkgPT09IG5hbWUpLCAxKVswXT8udmFsdWU7XG4gICAgfVxuXG4gICAgcG9wQW55KG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoYXZlTmFtZSA9IHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleS50b0xvd2VyQ2FzZSgpID09IG5hbWUpO1xuXG4gICAgICAgIGlmIChoYXZlTmFtZSAhPSAtMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKGhhdmVOYW1lLCAxKVswXS52YWx1ZTtcblxuICAgICAgICBjb25zdCBhc1RhZyA9IGdldERhdGFUYWdlcyh0aGlzLmNsZWFyRGF0YSwgW25hbWVdLCAnQCcpO1xuXG4gICAgICAgIGlmICghYXNUYWcuZm91bmRbMF0pIHJldHVybjtcblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGFzVGFnLmRhdGE7XG5cbiAgICAgICAgcmV0dXJuIGFzVGFnLmZvdW5kWzBdLmRhdGEudHJpbSgpO1xuICAgIH1cblxuICAgIGJ5VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbHRlcih4ID0+IHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5wb3BBbnkoJ2NvZGVmaWxlJyk/LmVxO1xuICAgICAgICBpZiAoIWhhdmVDb2RlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbGFuZyA9IHRoaXMucG9wQW55KCdsYW5nJyk/LmVxO1xuICAgICAgICBpZiAoaGF2ZUNvZGUudG9Mb3dlckNhc2UoKSA9PSAnaW5oZXJpdCcpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhZ2VQYXRoO1xuXG4gICAgICAgIGNvbnN0IGhhdmVFeHQgPSBwYXRoLmV4dG5hbWUoaGF2ZUNvZGUpLnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIVsnanMnLCAndHMnXS5pbmNsdWRlcyhoYXZlRXh0KSkge1xuICAgICAgICAgICAgaWYgKC8oXFxcXHxcXC8pJC8udGVzdChoYXZlQ29kZSkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGFnZVBhdGguc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKGhhdmVFeHQpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhdGguZXh0bmFtZShwYWdlUGF0aCk7XG4gICAgICAgICAgICBoYXZlQ29kZSArPSAnLicgKyAobGFuZyA/IGxhbmcgOiBpc1RzID8gJ3RzJyA6ICdqcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhdmVDb2RlWzBdID09ICcuJylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWdlUGF0aCksIGhhdmVDb2RlKVxuXG4gICAgICAgIGNvbnN0IFNtYWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoaGF2ZUNvZGUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLGhhdmVDb2RlKSkge1xuICAgICAgICAgICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIGJhc2VNb2RlbERhdGEuYWxsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjaygnPCUnKTtcbiAgICAgICAgICAgIGJhc2VNb2RlbERhdGEuYWxsRGF0YS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCclPicpO1xuXG4gICAgICAgICAgICBiYXNlTW9kZWxEYXRhLmFsbERhdGEuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gYmFzZU1vZGVsRGF0YS5hbGxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgaWQ6IFNtYWxsUGF0aCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvZGVGaWxlTm90Rm91bmQnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgbm90IGZvdW5kOiAke3BhZ2VQYXRofTxsaW5lPiR7U21hbGxQYXRofWBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgYDwlPVwiPHAgc3R5bGU9XFxcXFwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcXFxcXCI+Q29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nPC9wPlwiJT5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNldHRpbmcobmFtZSA9ICdkZWZpbmUnLCBsaW1pdEFyZ3VtZW50cyA9IDIpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMuY2xlYXJEYXRhLmluZGV4T2YoYEAke25hbWV9KGApO1xuICAgICAgICBpZiAoaGF2ZSA9PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGFyZ3VtZW50QXJyYXk6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuY2xlYXJEYXRhLnN1YnN0cmluZygwLCBoYXZlKTtcbiAgICAgICAgbGV0IHdvcmtEYXRhID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKGhhdmUgKyA4KS50cmltU3RhcnQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbWl0QXJndW1lbnRzOyBpKyspIHsgLy8gYXJndW1lbnRzIHJlYWRlciBsb29wXG4gICAgICAgICAgICBjb25zdCBxdW90YXRpb25TaWduID0gd29ya0RhdGEuYXQoMCkuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZFF1b3RlID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKHdvcmtEYXRhLmVxLnN1YnN0cmluZygxKSwgcXVvdGF0aW9uU2lnbik7XG5cbiAgICAgICAgICAgIGFyZ3VtZW50QXJyYXkucHVzaCh3b3JrRGF0YS5zdWJzdHJpbmcoMSwgZW5kUXVvdGUpKTtcblxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJBcmd1bWVudCA9IHdvcmtEYXRhLnN1YnN0cmluZyhlbmRRdW90ZSArIDEpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgaWYgKGFmdGVyQXJndW1lbnQuYXQoMCkuZXEgIT0gJywnKSB7XG4gICAgICAgICAgICAgICAgd29ya0RhdGEgPSBhZnRlckFyZ3VtZW50O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQuc3Vic3RyaW5nKDEpLnRyaW1TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya0RhdGEgPSB3b3JrRGF0YS5zdWJzdHJpbmcod29ya0RhdGEuaW5kZXhPZignKScpICsgMSk7XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYmVmb3JlLnRyaW1FbmQoKS5QbHVzKHdvcmtEYXRhLnRyaW1TdGFydCgpKTtcblxuICAgICAgICByZXR1cm4gYXJndW1lbnRBcnJheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWREZWZpbmUobW9yZURlZmluZTogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzOiAoU3RyaW5nVHJhY2tlcnxzdHJpbmcpW11bXSA9IE9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpO1xuICAgICAgICB3aGlsZSAobGFzdFZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZXMudW5zaGlmdChsYXN0VmFsdWUpO1xuICAgICAgICAgICAgbGFzdFZhbHVlID0gdGhpcy5sb2FkU2V0dGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YS5yZXBsYWNlQWxsKGA6JHtuYW1lfTpgLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZVwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBjb21waWxlSW1wb3J0IH0gZnJvbSBcIi4uLy4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBDb252ZXJ0U3ludGF4TWluaSB9IGZyb20gXCIuLi8uLi9QbHVnaW5zL1N5bnRheC9SYXpvclN5bnRheFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tIFwiLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmdcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vSlNQYXJzZXJcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1J1blRpbWUge1xuICAgIGRlZmluZSA9IHt9XG4gICAgY29uc3RydWN0b3IocHVibGljIHNjcmlwdDogU3RyaW5nVHJhY2tlciwgcHVibGljIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGlzVHM6IGJvb2xlYW4pe1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVNjcmlwdChzY3JpcHRzOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvcihjb25zdCBpIG9mIHNjcmlwdHMpe1xuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgX193cml0ZSA9IHt0ZXh0OiAnJ307XG4gICAgICAgICAgICBfX3dyaXRlQXJyYXkucHVzaChfX3dyaXRlKTtgKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhpKVxuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgcmV0dXJuIF9fd3JpdGVBcnJheWApO1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXRob2RzKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApe1xuICAgICAgICBjb25zdCBwYWdlX19maWxlbmFtZSA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgdGhpcy5zbWFsbFBhdGg7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHJpbmc6ICdzY3JpcHQsc3R5bGUsZGVmaW5lLHN0b3JlLHBhZ2VfX2ZpbGVuYW1lLHBhZ2VfX2Rpcm5hbWUsYXR0cmlidXRlcycsXG4gICAgICAgICAgICBmdW5jczogW1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc2NyaXB0LmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zdHlsZS5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kZWZpbmVbU3RyaW5nKGtleSldID0gdmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jb21waWxlUnVuVGltZVN0b3JlLFxuICAgICAgICAgICAgICAgIHBhZ2VfX2ZpbGVuYW1lLFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShwYWdlX19maWxlbmFtZSksXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1xuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkQ29kZShwYXJzZXI6IEpTUGFyc2VyLCBidWlsZFN0cmluZ3M6IHt0ZXh0OiBzdHJpbmd9W10pe1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcyl7XG4gICAgICAgICAgICBpZihpLnR5cGUgPT0gJ3RleHQnKXtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKGkudGV4dClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGJ1aWxkU3RyaW5ncy5wb3AoKS50ZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIGFzeW5jIGNvbXBpbGUoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIC8qIGxvYWQgZnJvbSBjYWNoZSAqL1xuICAgICAgICBjb25zdCBoYXZlQ2FjaGUgPSB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF07XG4gICAgICAgIGlmKGhhdmVDYWNoZSlcbiAgICAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhdmVDYWNoZSkoKTtcbiAgICAgICAgbGV0IGRvRm9yQWxsOiAocmVzb2x2ZTogKCkgPT4gU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pID0+IHZvaWQ7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gZG9Gb3JBbGwgPSByKTtcblxuICAgICAgICAvKiBydW4gdGhlIHNjcmlwdCAqL1xuICAgICAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IENvbnZlcnRTeW50YXhNaW5pKHRoaXMuc2NyaXB0LCBcIkBjb21waWxlXCIsIFwiKlwiKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRoaXMuc2NyaXB0LCB0aGlzLnNtYWxsUGF0aCwgJzwlKicsICclPicpO1xuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBpZihwYXJzZXIudmFsdWVzLmxlbmd0aCA9PSAxICYmIHBhcnNlci52YWx1ZXNbMF0udHlwZSA9PT0gJ3RleHQnKXtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiB0aGlzLnNjcmlwdDtcbiAgICAgICAgICAgIGRvRm9yQWxsKHJlc29sdmUpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFt0eXBlLCBmaWxlUGF0aF0gPVNwbGl0Rmlyc3QoJy8nLCB0aGlzLnNtYWxsUGF0aCksIHR5cGVBcnJheSA9IGdldFR5cGVzW3R5cGVdID8/IGdldFR5cGVzLlN0YXRpYywgXG4gICAgICAgIGNvbXBpbGVQYXRoID0gdHlwZUFycmF5WzFdICsgZmlsZVBhdGggKyAnLmNvbXAuanMnO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGZpbGVQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZVNjcmlwdChwYXJzZXIudmFsdWVzLmZpbHRlcih4ID0+IHgudHlwZSAhPSAndGV4dCcpLm1hcCh4ID0+IHgudGV4dCkpO1xuICAgICAgICBjb25zdCBzb3VyY2VNYXAgPSBuZXcgU291cmNlTWFwU3RvcmUoY29tcGlsZVBhdGgsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIGZhbHNlLCBmYWxzZSlcbiAgICAgICAgc291cmNlTWFwLmFkZFN0cmluZ1RyYWNrZXIodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCB7ZnVuY3MsIHN0cmluZ30gPSB0aGlzLm1ldGhvZHMoYXR0cmlidXRlcylcblxuICAgICAgICBjb25zdCB0b0ltcG9ydCA9IGF3YWl0IGNvbXBpbGVJbXBvcnQoc3RyaW5nLGNvbXBpbGVQYXRoLCBmaWxlUGF0aCwgdHlwZUFycmF5LCB0aGlzLmlzVHMsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIHRlbXBsYXRlLmVxLCBzb3VyY2VNYXAubWFwQXNVUkxDb21tZW50KCkpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGUgPSBhc3luYyAoKSA9PiB0aGlzLnJlYnVpbGRDb2RlKHBhcnNlciwgYXdhaXQgdG9JbXBvcnQoLi4uZnVuY3MpKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gZXhlY3V0ZTsgLy8gc2F2ZSB0aGlzIHRvIGNhY2hlXG4gICAgICAgIGNvbnN0IHRoaXNGaXJzdCA9IGF3YWl0IGV4ZWN1dGUoKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSBcImVzYnVpbGQtd2FzbVwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXhcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBpc1RzIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuXG4vL0B0cy1pZ25vcmUtbmV4dC1saW5lXG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4vcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgcGFnZURlcHMgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzXCI7XG5pbXBvcnQgQ3VzdG9tSW1wb3J0LCB7IGN1c3RvbVR5cGVzIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0XCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50V2FybmluZ3MgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2VcIjtcblxuYXN5bmMgZnVuY3Rpb24gUmVwbGFjZUJlZm9yZShcbiAgY29kZTogc3RyaW5nLFxuICBkZWZpbmVEYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LFxuKSB7XG4gIGNvZGUgPSBhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlLCBkZWZpbmVEYXRhKTtcbiAgcmV0dXJuIGNvZGU7XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGNvZGU6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZGlyOiBzdHJpbmcsIGZpbGU6IHN0cmluZywgcGFyYW1zPzogc3RyaW5nKSB7XG4gIHJldHVybiBgJHtpc0RlYnVnID8gXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIgOiAnJ312YXIgX19kaXJuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGRpcilcbiAgICB9XCIsX19maWxlbmFtZT1cIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhmaWxlKVxuICAgIH1cIjttb2R1bGUuZXhwb3J0cyA9IChhc3luYyAocmVxdWlyZSR7cGFyYW1zID8gJywnICsgcGFyYW1zIDogJyd9KT0+e3ZhciBtb2R1bGU9e2V4cG9ydHM6e319LGV4cG9ydHM9bW9kdWxlLmV4cG9ydHM7JHtjb2RlfVxcbnJldHVybiBtb2R1bGUuZXhwb3J0czt9KTtgO1xufVxuXG5cbi8qKlxuICogSXQgdGFrZXMgYSBmaWxlIHBhdGgsIGFuZCByZXR1cm5zIHRoZSBjb21waWxlZCBjb2RlLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBjb21waWxlLlxuICogQHBhcmFtIHtzdHJpbmcgfCBudWxsfSBzYXZlUGF0aCAtIFRoZSBwYXRoIHRvIHNhdmUgdGhlIGNvbXBpbGVkIGZpbGUgdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZXNjcmlwdCAtIGJvb2xlYW5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gIC0gZmlsZVBhdGg6IFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcmV0dXJucyBUaGUgcmVzdWx0IG9mIHRoZSBzY3JpcHQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGZpbGVQYXRoOiBzdHJpbmcsIHNhdmVQYXRoOiBzdHJpbmcgfCBudWxsLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIHsgcGFyYW1zLCBoYXZlU291cmNlTWFwID0gaXNEZWJ1ZywgZmlsZUNvZGUsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIGhhdmVTb3VyY2VNYXA/OiBib29sZWFuLCBmaWxlQ29kZT86IHN0cmluZyB9ID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgIGZvcm1hdDogJ2NqcycsXG4gICAgbG9hZGVyOiBpc1R5cGVzY3JpcHQgPyAndHMnIDogJ2pzJyxcbiAgICBtaW5pZnk6IGNvZGVNaW5pZnksXG4gICAgc291cmNlbWFwOiBoYXZlU291cmNlTWFwID8gJ2lubGluZScgOiBmYWxzZSxcbiAgICBzb3VyY2VmaWxlOiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIGRlYnVnOiBcIlwiICsgaXNEZWJ1Z1xuICAgIH1cbiAgfTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShmaWxlQ29kZSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7fSk7XG4gIFJlc3VsdCA9IHRlbXBsYXRlKFxuICAgIFJlc3VsdCxcbiAgICBpc0RlYnVnLFxuICAgIHBhdGguZGlybmFtZSh0ZW1wbGF0ZVBhdGgpLFxuICAgIHRlbXBsYXRlUGF0aCxcbiAgICBwYXJhbXNcbiAgKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHsgY29kZSwgd2FybmluZ3MgfSA9IGF3YWl0IHRyYW5zZm9ybShSZXN1bHQsIE9wdGlvbnMpO1xuICAgIFJlc3VsdCA9IGNvZGU7XG4gICAgRVNCdWlsZFByaW50V2FybmluZ3MoZmlsZVBhdGgsIHdhcm5pbmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgRVNCdWlsZFByaW50RXJyb3IoZmlsZVBhdGgsIGVycik7XG4gIH1cblxuICBpZiAoc2F2ZVBhdGgpIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGguZGlybmFtZShzYXZlUGF0aCkpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoc2F2ZVBhdGgsIFJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIFJlc3VsdDtcbn1cblxuZnVuY3Rpb24gQ2hlY2tUcyhGaWxlUGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBGaWxlUGF0aC5lbmRzV2l0aChcIi50c1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChJblN0YXRpY1BhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgcmV0dXJuIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHR5cGVBcnJheVswXSArIEluU3RhdGljUGF0aCxcbiAgICB0eXBlQXJyYXlbMV0gKyBJblN0YXRpY1BhdGggKyBcIi5janNcIixcbiAgICBDaGVja1RzKEluU3RhdGljUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFkZEV4dGVuc2lvbihGaWxlUGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbGVFeHQgPSBwYXRoLmV4dG5hbWUoRmlsZVBhdGgpO1xuXG4gIGlmIChCYXNpY1NldHRpbmdzLnBhcnRFeHRlbnNpb25zLmluY2x1ZGVzKGZpbGVFeHQuc3Vic3RyaW5nKDEpKSlcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIChpc1RzKCkgPyBcInRzXCIgOiBcImpzXCIpXG4gIGVsc2UgaWYgKGZpbGVFeHQgPT0gJycpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyBCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc1tpc1RzKCkgPyBcInRzXCIgOiBcImpzXCJdO1xuXG4gIHJldHVybiBGaWxlUGF0aDtcbn1cblxuY29uc3QgU2F2ZWRNb2R1bGVzID0ge307XG5cbi8qKlxuICogTG9hZEltcG9ydCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIHRvIGEgZmlsZSwgYW5kIHJldHVybnMgdGhlIG1vZHVsZSB0aGF0IGlzIGF0IHRoYXQgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IGltcG9ydEZyb20gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGNyZWF0ZWQgdGhpcyBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gSW5TdGF0aWNQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gW3VzZURlcHNdIC0gVGhpcyBpcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB3aXRob3V0Q2FjaGUgLSBhbiBhcnJheSBvZiBwYXRocyB0aGF0IHdpbGwgbm90IGJlIGNhY2hlZC5cbiAqIEByZXR1cm5zIFRoZSBtb2R1bGUgdGhhdCB3YXMgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIExvYWRJbXBvcnQoaW1wb3J0RnJvbTogc3RyaW5nLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU6IHN0cmluZ1tdID0gW10pIHtcbiAgbGV0IFRpbWVDaGVjazogYW55O1xuXG4gIEluU3RhdGljUGF0aCA9IHBhdGguam9pbihBZGRFeHRlbnNpb24oSW5TdGF0aWNQYXRoKS50b0xvd2VyQ2FzZSgpKTtcbiAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKEluU3RhdGljUGF0aCkuc3Vic3RyaW5nKDEpLCB0aGlzQ3VzdG9tID0gY3VzdG9tVHlwZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSB8fCAhWydqcycsICd0cyddLmluY2x1ZGVzKGV4dGVuc2lvbik7XG4gIGNvbnN0IFNhdmVkTW9kdWxlc1BhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgpLCBmaWxlUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIEluU3RhdGljUGF0aCk7XG5cbiAgLy93YWl0IGlmIHRoaXMgbW9kdWxlIGlzIG9uIHByb2Nlc3MsIGlmIG5vdCBkZWNsYXJlIHRoaXMgYXMgb24gcHJvY2VzcyBtb2R1bGVcbiAgbGV0IHByb2Nlc3NFbmQ6ICh2PzogYW55KSA9PiB2b2lkO1xuICBpZiAoIVNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSlcbiAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IHByb2Nlc3NFbmQgPSByKTtcbiAgZWxzZSBpZiAoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICBhd2FpdCBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgLy9idWlsZCBwYXRoc1xuICBjb25zdCByZUJ1aWxkID0gIXBhZ2VEZXBzLnN0b3JlW1NhdmVkTW9kdWxlc1BhdGhdIHx8IHBhZ2VEZXBzLnN0b3JlW1NhdmVkTW9kdWxlc1BhdGhdICE9IChUaW1lQ2hlY2sgPSBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpKTtcblxuXG4gIGlmIChyZUJ1aWxkKSB7XG4gICAgVGltZUNoZWNrID0gVGltZUNoZWNrID8/IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCk7XG4gICAgaWYgKFRpbWVDaGVjayA9PSBudWxsKSB7XG4gICAgICBQcmludElmTmV3KHtcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7SW5TdGF0aWNQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7aW1wb3J0RnJvbX0nYFxuICAgICAgfSlcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG51bGxcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXNDdXN0b20pIC8vIG9ubHkgaWYgbm90IGN1c3RvbSBidWlsZFxuICAgICAgYXdhaXQgQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcpO1xuICAgIHBhZ2VEZXBzLnVwZGF0ZShTYXZlZE1vZHVsZXNQYXRoLCBUaW1lQ2hlY2spO1xuICB9XG5cbiAgaWYgKHVzZURlcHMpIHtcbiAgICB1c2VEZXBzW0luU3RhdGljUGF0aF0gPSB7IHRoaXNGaWxlOiBUaW1lQ2hlY2sgfTtcbiAgICB1c2VEZXBzID0gdXNlRGVwc1tJblN0YXRpY1BhdGhdO1xuICB9XG5cbiAgY29uc3QgaW5oZXJpdGFuY2VDYWNoZSA9IHdpdGhvdXRDYWNoZVswXSA9PSBJblN0YXRpY1BhdGg7XG4gIGlmIChpbmhlcml0YW5jZUNhY2hlKVxuICAgIHdpdGhvdXRDYWNoZS5zaGlmdCgpXG4gIGVsc2UgaWYgKCFyZUJ1aWxkICYmIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSAmJiAhKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHJldHVybiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgubm9ybWFsaXplKHApLnN1YnN0cmluZyhwYXRoLm5vcm1hbGl6ZSh0eXBlQXJyYXlbMF0pLmxlbmd0aCk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBjb25zdCBkaXJQYXRoID0gcGF0aC5kaXJuYW1lKEluU3RhdGljUGF0aCk7XG4gICAgICAgIHAgPSAoZGlyUGF0aCAhPSBcIi9cIiA/IGRpclBhdGggKyBcIi9cIiA6IFwiXCIpICsgcDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBpbXBvcnQocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoZmlsZVBhdGgsIHAsIHR5cGVBcnJheSwgaXNEZWJ1ZywgdXNlRGVwcywgaW5oZXJpdGFuY2VDYWNoZSA/IHdpdGhvdXRDYWNoZSA6IFtdKTtcbiAgfVxuXG4gIGxldCBNeU1vZHVsZTogYW55O1xuICBpZiAodGhpc0N1c3RvbSkge1xuICAgIE15TW9kdWxlID0gYXdhaXQgQ3VzdG9tSW1wb3J0KGZpbGVQYXRoLCBleHRlbnNpb24sIHJlcXVpcmVNYXApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlcXVpcmVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIpO1xuICAgIE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHJlcXVpcmVQYXRoKTtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICB9XG5cbiAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gTXlNb2R1bGU7XG4gIHByb2Nlc3NFbmQ/LigpO1xuXG4gIHJldHVybiBNeU1vZHVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEltcG9ydEZpbGUoaW1wb3J0RnJvbTogc3RyaW5nLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSkge1xuICBpZiAoIWlzRGVidWcpIHtcbiAgICBjb25zdCBoYXZlSW1wb3J0ID0gU2F2ZWRNb2R1bGVzW3BhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKV07XG4gICAgaWYgKGhhdmVJbXBvcnQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGhhdmVJbXBvcnQ7XG4gIH1cblxuICByZXR1cm4gTG9hZEltcG9ydChpbXBvcnRGcm9tLCBJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVPbmNlKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgZmlsZVBhdGgsXG4gICAgdGVtcEZpbGUsXG4gICAgQ2hlY2tUcyhmaWxlUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBhd2FpdCBNeU1vZHVsZSgocGF0aDogc3RyaW5nKSA9PiBpbXBvcnQocGF0aCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUNqc1NjcmlwdChjb250ZW50OiBzdHJpbmcpIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG4gIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGVtcEZpbGUsIGNvbnRlbnQpO1xuXG4gIGNvbnN0IG1vZGVsID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIG1vZGVsO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmFrZSBzY3JpcHQgbG9jYXRpb24sIGEgZmlsZSBsb2NhdGlvbiwgYSB0eXBlIGFycmF5LCBhbmQgYSBib29sZWFuIGZvciB3aGV0aGVyIG9yIG5vdCBpdCdzXG4gKiBhIFR5cGVTY3JpcHQgZmlsZS4gSXQgdGhlbiBjb21waWxlcyB0aGUgc2NyaXB0IGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biB0aGUgbW9kdWxlXG4gKiBUaGlzIGlzIGZvciBSdW5UaW1lIENvbXBpbGUgU2NyaXB0c1xuICogQHBhcmFtIHtzdHJpbmd9IGdsb2JhbFByYW1zIC0gc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZyxcbiAqIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY3JpcHRMb2NhdGlvbiAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgc2NyaXB0IHRvIGJlIGNvbXBpbGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSAtIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBmaWxlIGZyb20gdGhlIHN0YXRpYyBmb2xkZXIuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBbc3RyaW5nLCBzdHJpbmddXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZVNjcmlwdCAtIGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBJZiB0cnVlLCB0aGUgY29kZSB3aWxsIGJlIGNvbXBpbGVkIHdpdGggZGVidWcgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZUNvZGUgLSBUaGUgY29kZSB0aGF0IHdpbGwgYmUgY29tcGlsZWQgYW5kIHNhdmVkIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU1hcENvbW1lbnQgLSBzdHJpbmdcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVJbXBvcnQoZ2xvYmFsUHJhbXM6IHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgc291cmNlTWFwQ29tbWVudDogc3RyaW5nKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCB0eXBlQXJyYXlbMV0pO1xuXG4gIGNvbnN0IGZ1bGxTYXZlTG9jYXRpb24gPSBzY3JpcHRMb2NhdGlvbiArIFwiLmNqc1wiO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0eXBlQXJyYXlbMF0gKyBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU7XG5cbiAgY29uc3QgUmVzdWx0ID0gYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgc2NyaXB0TG9jYXRpb24sXG4gICAgdW5kZWZpbmVkLFxuICAgIGlzVHlwZVNjcmlwdCxcbiAgICBpc0RlYnVnLFxuICAgIHsgcGFyYW1zOiBnbG9iYWxQcmFtcywgaGF2ZVNvdXJjZU1hcDogZmFsc2UsIGZpbGVDb2RlLCB0ZW1wbGF0ZVBhdGgsIGNvZGVNaW5pZnk6IGZhbHNlIH1cbiAgKTtcblxuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGguZGlybmFtZShmdWxsU2F2ZUxvY2F0aW9uKSk7XG4gIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbFNhdmVMb2NhdGlvbiwgUmVzdWx0ICsgc291cmNlTWFwQ29tbWVudCk7XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgubm9ybWFsaXplKHApLnN1YnN0cmluZyhwYXRoLm5vcm1hbGl6ZSh0eXBlQXJyYXlbMF0pLmxlbmd0aCk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBjb25zdCBkaXJQYXRoID0gcGF0aC5kaXJuYW1lKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSk7XG4gICAgICAgIHAgPSAoZGlyUGF0aCAhPSBcIi9cIiA/IGRpclBhdGggKyBcIi9cIiA6IFwiXCIpICsgcDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBpbXBvcnQocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQodGVtcGxhdGVQYXRoLCBwLCB0eXBlQXJyYXksIGlzRGVidWcpO1xuICB9XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoZnVsbFNhdmVMb2NhdGlvbik7XG4gIHJldHVybiBhc3luYyAoLi4uYXJyOiBhbnlbXSkgPT4gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCwgLi4uYXJyKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgUmF6b3JUb0VKUywgUmF6b3JUb0VKU01pbmkgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlcic7XG5cblxuY29uc3QgYWRkV3JpdGVNYXAgPSB7XG4gICAgXCJpbmNsdWRlXCI6IFwiYXdhaXQgXCIsXG4gICAgXCJpbXBvcnRcIjogXCJhd2FpdCBcIixcbiAgICBcInRyYW5zZmVyXCI6IFwicmV0dXJuIGF3YWl0IFwiXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXgodGV4dDogU3RyaW5nVHJhY2tlciwgb3B0aW9ucz86IGFueSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlModGV4dC5lcSk7XG4gICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHZhbHVlcykge1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgIHN3aXRjaCAoaS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoc3Vic3RyaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlPSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJlc2NhcGVcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JToke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHthZGRXcml0ZU1hcFtpLm5hbWVdfSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBidWlsZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0U3ludGF4TWluaSB0YWtlcyB0aGUgY29kZSBhbmQgYSBzZWFyY2ggc3RyaW5nIGFuZCBjb252ZXJ0IGN1cmx5IGJyYWNrZXRzXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IHRleHQgLSBUaGUgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaW5kIC0gVGhlIHN0cmluZyB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IGFkZEVKUyAtIFRoZSBzdHJpbmcgdG8gYWRkIHRvIHRoZSBzdGFydCBvZiB0aGUgZWpzLlxuICogQHJldHVybnMgQSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4TWluaSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaW5kOiBzdHJpbmcsIGFkZEVKUzogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKU01pbmkodGV4dC5lcSwgZmluZCk7XG4gICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgaWYgKHZhbHVlc1tpXSAhPSB2YWx1ZXNbaSArIDFdKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaV0sIHZhbHVlc1tpICsgMV0pKTtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcodmFsdWVzW2kgKyAyXSwgdmFsdWVzW2kgKyAzXSk7XG4gICAgICAgIGJ1aWxkLlBsdXMkYDwlJHthZGRFSlN9JHtzdWJzdHJpbmd9JT5gO1xuICAgIH1cblxuICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcoKHZhbHVlcy5hdCgtMSk/Py0xKSArIDEpKTtcblxuICAgIHJldHVybiBidWlsZDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcblxuXG5leHBvcnQgY2xhc3MgUGFnZVRlbXBsYXRlIGV4dGVuZHMgSlNQYXJzZXIge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgQWRkUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgdGV4dCA9IGF3YWl0IGZpbmFsaXplQnVpbGQodGV4dCwgc2Vzc2lvbkluZm8sIGZ1bGxQYXRoQ29tcGlsZSk7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPGxpbmU+L2dpLCAnPGJyLz4nKSArICc8L3A+PHA+RXJyb3IgbWVzc2FnZTogJyArIGUubWVzc2FnZSArICc8L3A+YCl9JztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXRoOiBcIiArIHJ1bl9zY3JpcHRfbmFtZS5yZXBsYWNlKC88bGluZT4vZ2ksICdcXFxcbicpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIG1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJ1bmluZyB0aGlzIGNvZGU6ICdcIiArIHJ1bl9zY3JpcHRfY29kZSArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN0YWNrOiBcIiArIGUuc3RhY2spO1xuICAgICAgICAgICAgICAgIH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgfX0pO31gKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIGNvbnN0IGJ1aWx0Q29kZSA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5SdW5BbmRFeHBvcnQodGV4dCwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgICAgICByZXR1cm4gUGFnZVRlbXBsYXRlLkFkZFBhZ2VUZW1wbGF0ZShidWlsdENvZGUsIGZ1bGxQYXRoQ29tcGlsZSwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHN0YXRpYyBBZGRBZnRlckJ1aWxkKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBJblBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBkYXRhT2JqZWN0OiBhbnksIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhe1xuICAgICAgICAgICAgY29uc3QgX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHsuLi5fcGFnZSR7ZGF0YU9iamVjdCA/ICcsJyArIGRhdGFPYmplY3QgOiAnJ319O1xuICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHslPmApO1xuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjaygnPCUhfX19JT4nKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFJhem9yU3ludGF4IGZyb20gJy4vUmF6b3JTeW50YXgnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdldFN5bnRheChDb21waWxlVHlwZTogYW55KSB7XG4gICAgbGV0IGZ1bmM6IGFueTtcbiAgICBzd2l0Y2ggKENvbXBpbGVUeXBlLm5hbWUgfHwgQ29tcGlsZVR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlJhem9yXCI6XG4gICAgICAgICAgICBmdW5jID0gUmF6b3JTeW50YXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59IiwgImltcG9ydCBBZGRTeW50YXggZnJvbSAnLi9TeW50YXgvSW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZFBsdWdpbiB7XG5cdHB1YmxpYyBTZXR0aW5nc09iamVjdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoU2V0dGluZ3NPYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgICAgIHRoaXMuU2V0dGluZ3NPYmplY3QgPSBTZXR0aW5nc09iamVjdFxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRlZmF1bHRTeW50YXgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2V0dGluZ3NPYmplY3QuQmFzaWNDb21waWxhdGlvblN5bnRheC5jb25jYXQodGhpcy5TZXR0aW5nc09iamVjdC5BZGRDb21waWxlU3ludGF4KTtcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEJhc2ljKHRleHQ6IFN0cmluZ1RyYWNrZXIsIE9EYXRhOnN0cmluZyB8YW55LCBwYXRoOnN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vYWRkIFN5bnRheFxuXG4gICAgICAgIGlmICghT0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KE9EYXRhKSkge1xuICAgICAgICAgICAgT0RhdGEgPSBbT0RhdGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIE9EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBTeW50YXggPSBhd2FpdCBBZGRTeW50YXgoaSk7XG5cbiAgICAgICAgICAgIGlmIChTeW50YXgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gYXdhaXQgU3ludGF4KHRleHQsIGksIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIHBhZ2VzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgY29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRDb21wb25lbnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn0iLCAiLy9nbG9iYWwgc2V0dGluZ3MgZm9yIGJ1aWxkIGluIGNvbXBvbmVudHNcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0ge1xuICAgIHBsdWdpbnM6IFtdXG59OyIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGgsIFBhcnNlRGVidWdMaW5lLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgKiBhcyBleHRyaWNhdGUgZnJvbSAnLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSAnLi90cmFuc2Zvcm0vU2NyaXB0JztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEJ1aWxkU2NyaXB0U2V0dGluZ3MgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncyc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0geyBBZGRDb21waWxlU3ludGF4OiBbXSwgcGx1Z2luczogW10sIEJhc2ljQ29tcGlsYXRpb25TeW50YXg6IFsnUmF6b3InXSB9O1xuY29uc3QgUGx1Z2luQnVpbGQgPSBuZXcgQWRkUGx1Z2luKFNldHRpbmdzKTtcbmV4cG9ydCBjb25zdCBDb21wb25lbnRzID0gbmV3IEluc2VydENvbXBvbmVudChQbHVnaW5CdWlsZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRQbHVnaW4obmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLnBsdWdpbnMuZmluZChiID0+IGIgPT0gbmFtZSB8fCAoPGFueT5iKT8ubmFtZSA9PSBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNvbWVQbHVnaW5zKC4uLmRhdGE6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGRhdGEuc29tZSh4ID0+IEdldFBsdWdpbih4KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RzKCkge1xuICAgIHJldHVybiBTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4LmluY2x1ZGVzKCdUeXBlU2NyaXB0Jyk7XG59XG5cbkNvbXBvbmVudHMuTWljcm9QbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcbkNvbXBvbmVudHMuR2V0UGx1Z2luID0gR2V0UGx1Z2luO1xuQ29tcG9uZW50cy5Tb21lUGx1Z2lucyA9IFNvbWVQbHVnaW5zO1xuQ29tcG9uZW50cy5pc1RzID0gaXNUcztcblxuQnVpbGRTY3JpcHRTZXR0aW5ncy5wbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcblxuYXN5bmMgZnVuY3Rpb24gb3V0UGFnZShkYXRhOiBTdHJpbmdUcmFja2VyLCBzY3JpcHRGaWxlOiBTdHJpbmdUcmFja2VyLCBwYWdlUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcblxuICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2UoZGF0YSwgaXNUcygpKTtcbiAgICBhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3Moc2Vzc2lvbkluZm8sIHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBwYWdlTmFtZSk7XG5cbiAgICBjb25zdCBtb2RlbE5hbWUgPSBiYXNlRGF0YS5wb3BBbnkoJ21vZGVsJyk/LmVxO1xuXG4gICAgaWYgKCFtb2RlbE5hbWUpIHJldHVybiBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSwgYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICBkYXRhID0gYmFzZURhdGEuY2xlYXJEYXRhO1xuXG4gICAgLy9pbXBvcnQgbW9kZWxcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBtb2RlbE5hbWUsICdNb2RlbHMnLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5tb2RlbCk7IC8vIGZpbmQgbG9jYXRpb24gb2YgdGhlIGZpbGVcblxuICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVsbFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yTWVzc2FnZSA9IGBFcnJvciBtb2RlbCBub3QgZm91bmQgLT4gJHttb2RlbE5hbWV9IGF0IHBhZ2UgJHtwYWdlTmFtZX1gO1xuXG4gICAgICAgIHByaW50LmVycm9yKEVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihkYXRhLkRlZmF1bHRJbmZvVGV4dCwgUGFnZVRlbXBsYXRlLnByaW50RXJyb3IoRXJyb3JNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsIEZ1bGxQYXRoKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKHBhZ2VOYW1lLCBGdWxsUGF0aCwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgIGxldCBtb2RlbERhdGEgPSBQYXJzZUJhc2VQYWdlLnJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoYmFzZU1vZGVsRGF0YS5hbGxEYXRhKTtcblxuICAgIG1vZGVsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgcGFnZU5hbWUgKz0gXCIgLT4gXCIgKyBTbWFsbFBhdGg7XG5cbiAgICAvL0dldCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBhbGxEYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdlcyhtb2RlbERhdGEsIFsnJ10sICc6JywgZmFsc2UsIHRydWUpO1xuXG4gICAgaWYgKGFsbERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciB3aXRoaW4gbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1vZGVsRGF0YSA9IGFsbERhdGEuZGF0YTtcbiAgICBjb25zdCB0YWdBcnJheSA9IGFsbERhdGEuZm91bmQubWFwKHggPT4geC50YWcuc3Vic3RyaW5nKDEpKTtcbiAgICBjb25zdCBvdXREYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdlcyhkYXRhLCB0YWdBcnJheSwgJ0AnKTtcblxuICAgIGlmIChvdXREYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgV2l0aCBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy9CdWlsZCBXaXRoIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1vZGVsQnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIGFsbERhdGEuZm91bmQpIHtcbiAgICAgICAgaS50YWcgPSBpLnRhZy5zdWJzdHJpbmcoMSk7IC8vIHJlbW92aW5nIHRoZSAnOidcbiAgICAgICAgY29uc3QgaG9sZGVyRGF0YSA9IG91dERhdGEuZm91bmQuZmluZCgoZSkgPT4gZS50YWcgPT0gJ0AnICsgaS50YWcpO1xuXG4gICAgICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEuc3Vic3RyaW5nKDAsIGkubG9jKSk7XG4gICAgICAgIG1vZGVsRGF0YSA9IG1vZGVsRGF0YS5zdWJzdHJpbmcoaS5sb2MpO1xuXG4gICAgICAgIGlmIChob2xkZXJEYXRhKSB7XG4gICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMoaG9sZGVyRGF0YS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHsgLy8gVHJ5IGxvYWRpbmcgZGF0YSBmcm9tIHBhZ2UgYmFzZVxuICAgICAgICAgICAgY29uc3QgbG9hZEZyb21CYXNlID0gYmFzZURhdGEucG9wKGkudGFnKTtcblxuICAgICAgICAgICAgaWYgKGxvYWRGcm9tQmFzZSAmJiBsb2FkRnJvbUJhc2UuZXEudG9Mb3dlckNhc2UoKSAhPSAnaW5oZXJpdCcpXG4gICAgICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGxvYWRGcm9tQmFzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhKTtcblxuICAgIHJldHVybiBhd2FpdCBvdXRQYWdlKG1vZGVsQnVpbGQsIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlKSwgRnVsbFBhdGgsIHBhZ2VOYW1lLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEluc2VydChkYXRhOiBzdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBuZXN0ZWRQYWdlOiBib29sZWFuLCBuZXN0ZWRQYWdlRGF0YTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgbGV0IERlYnVnU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBkYXRhKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IG91dFBhZ2UoRGVidWdTdHJpbmcsIG5ldyBTdHJpbmdUcmFja2VyKERlYnVnU3RyaW5nLkRlZmF1bHRJbmZvVGV4dCksIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQbHVnaW5CdWlsZC5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IENvbXBvbmVudHMuSW5zZXJ0KERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYWdlVGVtcGxhdGUuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBmdWxsUGF0aENvbXBpbGUsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zKERlYnVnU3RyaW5nKTtcbiAgICBEZWJ1Z1N0cmluZz0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgIHJldHVybiBEZWJ1Z1N0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCdWlsZEpTLCBCdWlsZEpTWCwgQnVpbGRUUywgQnVpbGRUU1ggfSBmcm9tICcuL0ZvclN0YXRpYy9TY3JpcHQnO1xuaW1wb3J0IEJ1aWxkU3ZlbHRlIGZyb20gJy4vRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTdHlsZVNhc3MgfSBmcm9tICcuL0ZvclN0YXRpYy9TdHlsZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgU3lzdGVtRGF0YSwgZ2V0RGlybmFtZSwgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFJlc3BvbnNlLCBSZXF1ZXN0IH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwcm9tcHRseSBmcm9tICdwcm9tcHRseSc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5cbmNvbnN0IFN1cHBvcnRlZFR5cGVzID0gWydqcycsICdzdmVsdGUnLCAndHMnLCAnanN4JywgJ3RzeCcsICdjc3MnLCAnc2FzcycsICdzY3NzJ107XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1N0YXRpY0ZpbGVzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvID0gU3RhdGljRmlsZXNJbmZvLnN0b3JlW3BhdGhdO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG8pIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIHAgPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBvW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAhbztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGZ1bGxDb21waWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBzd2l0Y2ggKGV4dCkge1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIGNhc2UgJ3Nhc3MnOlxuICAgICAgICBjYXNlICdzY3NzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3R5bGVTYXNzKFNtYWxsUGF0aCwgZXh0LCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmVsdGUnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdmVsdGUoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGZ1bGxDb21waWxlUGF0aCArPSAnLmpzJztcbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsQ29tcGlsZVBhdGgpKSB7XG4gICAgICAgIFN0YXRpY0ZpbGVzSW5mby51cGRhdGUoU21hbGxQYXRoLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGVidWcpXG4gICAgICAgIHJldHVybiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgYnVpbGRJbiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICBleHQ/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGluU2VydmVyPzogc3RyaW5nO1xufVxuXG5jb25zdCBzdGF0aWNGaWxlcyA9IFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy9jbGllbnQvJztcbmNvbnN0IGdldFN0YXRpYzogYnVpbGRJbltdID0gW3tcbiAgICBwYXRoOiBcInNlcnYvdGVtcC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcImJ1aWxkVGVtcGxhdGUuanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvY29ubmVjdC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1ha2VDb25uZWN0aW9uLmpzXCJcbn1dO1xuXG5jb25zdCBnZXRTdGF0aWNGaWxlc1R5cGU6IGJ1aWxkSW5bXSA9IFt7XG4gICAgZXh0OiAnLnB1Yi5qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLm1qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLmNzcycsXG4gICAgdHlwZTogJ2Nzcydcbn1dO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0OiBSZXF1ZXN0LCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgY29uc3QgZm91bmQgPSBnZXRTdGF0aWNGaWxlc1R5cGUuZmluZCh4ID0+IGZpbGVQYXRoLmVuZHNXaXRoKHguZXh0KSk7XG5cbiAgICBpZiAoIWZvdW5kKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGNvbnN0IGJhc2VQYXRoID0gUmVxdWVzdC5xdWVyeS50ID09ICdsJyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV07XG4gICAgY29uc3QgaW5TZXJ2ZXIgPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGluU2VydmVyKSlcbiAgICAgICAgcmV0dXJuIHsgLi4uZm91bmQsIGluU2VydmVyIH07XG59XG5cbmxldCBkZWJ1Z2dpbmdXaXRoU291cmNlOiBudWxsIHwgYm9vbGVhbiA9IG51bGw7XG5cbmlmIChhcmd2LmluY2x1ZGVzKCdhbGxvd1NvdXJjZURlYnVnJykpXG4gICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IHRydWU7XG5hc3luYyBmdW5jdGlvbiBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkge1xuICAgIGlmICh0eXBlb2YgZGVidWdnaW5nV2l0aFNvdXJjZSA9PSAnYm9vbGVhbicpXG4gICAgICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IChhd2FpdCBwcm9tcHRseS5wcm9tcHQoXG4gICAgICAgICAgICAnQWxsb3cgZGVidWdnaW5nIEphdmFTY3JpcHQvQ1NTIGluIHNvdXJjZSBwYWdlPyAtIGV4cG9zaW5nIHlvdXIgc291cmNlIGNvZGUgKG5vKScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKHY6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWyd5ZXMnLCAnbm8nXS5pbmNsdWRlcyh2LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3llcyBvciBubycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwXG4gICAgICAgICAgICB9XG4gICAgICAgICkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09ICd5ZXMnO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB9IGNhdGNoIHsgfVxuXG5cbiAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcbn1cblxuY29uc3Qgc2FmZUZvbGRlcnMgPSBbZ2V0VHlwZXMuU3RhdGljWzJdLCBnZXRUeXBlcy5Mb2dzWzJdLCAnTW9kZWxzJywgJ0NvbXBvbmVudHMnXTtcbi8qKlxuICogSWYgdGhlIHVzZXIgaXMgaW4gZGVidWcgbW9kZSwgYW5kIHRoZSBmaWxlIGlzIGEgc291cmNlIGZpbGUsIGFuZCB0aGUgdXNlciBjb21tZW5kIGxpbmUgYXJndW1lbnQgaGF2ZSBhbGxvd1NvdXJjZURlYnVnXG4gKiB0aGVuIHJldHVybiB0aGUgZnVsbCBwYXRoIHRvIHRoZSBmaWxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBpcyB0aGUgY3VycmVudCBwYWdlIGEgZGVidWcgcGFnZT9cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRoYXQgd2FzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSBJZiB0aGlzIHBhdGggYWxyZWFkeSBiZWVuIGNoZWNrZWRcbiAqIHRoZSBmaWxlLlxuICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGZpbGUgYW5kIHRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bnNhZmVEZWJ1Zyhpc0RlYnVnOiBib29sZWFuLCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFpc0RlYnVnIHx8IEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpICE9ICcuc291cmNlJyB8fCAhc2FmZUZvbGRlcnMuaW5jbHVkZXMoZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykuc2hpZnQoKSkgfHwgIWF3YWl0IGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA3KSk7IC8vIHJlbW92aW5nICcuc291cmNlJ1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlRmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNCk7IC8vIHJlbW92aW5nICcuY3NzJ1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgZmlsZVBhdGg7XG5cbiAgICBsZXQgZXhpc3RzOiBib29sZWFuO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoYmFzZUZpbGVQYXRoKSA9PSAnLnN2ZWx0ZScgJiYgKGNoZWNrZWQgfHwgKGV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSkpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgIWV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludFdhcm5pbmdzIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBtb3JlT3B0aW9ucz86IFRyYW5zZm9ybU9wdGlvbnMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IGlucHV0UGF0aCArICc/c291cmNlPXRydWUnLFxuICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAnaW5saW5lJzogZmFsc2UsXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIC4uLm1vcmVPcHRpb25zXG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IGNvZGU7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKGZ1bGxQYXRoLCB3YXJuaW5ncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGZ1bGxQYXRoLCBlcnIpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanMnLCBpc0RlYnVnLCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgbG9hZGVyOiAndHMnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanN4JywgaXNEZWJ1ZywgeyAuLi4oR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSksIGxvYWRlcjogJ2pzeCcgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0c3gnLCBpc0RlYnVnLCB7IGxvYWRlcjogJ3RzeCcsIC4uLihHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KSB9KTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tIFwiZXNidWlsZC13YXNtXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGluU3RhdGljUGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNQYXRoO1xuXG4gICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXMsIG1hcCB9ID0gYXdhaXQgcHJlcHJvY2VzcyhmdWxsUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5TdGF0aWNQYXRoKTtcblxuICAgIGNvbnN0IGZpbGVuYW1lID0gZnVsbFBhdGguc3BsaXQoL1xcL3xcXC8vKS5wb3AoKTtcbiAgICBjb25zdCB7IGpzLCBjc3MgfSA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIHtcbiAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgIGRldjogaXNEZWJ1ZyxcbiAgICAgICAgc291cmNlbWFwOiBtYXAsXG4gICAgICAgIGNzczogZmFsc2UsXG4gICAgICAgIGh5ZHJhdGFibGU6IHRydWUsXG4gICAgICAgIHN2ZWx0ZVBhdGg6ICcvc2Vydi9zdmVsdGUnXG4gICAgfSk7XG5cbiAgICBpZiAoU29tZVBsdWdpbnMoXCJNaW5KU1wiKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAganMuY29kZSA9IChhd2FpdCB0cmFuc2Zvcm0oanMuY29kZSwge1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZVxuICAgICAgICAgICAgfSkpLmNvZGVcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdtaW5pZnknLFxuICAgICAgICAgICAgICAgIHRleHQ6IGAke2Vyci5tZXNzYWdlfSBvbiBmaWxlIC0+ICR7ZnVsbFBhdGh9YFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgIGpzLm1hcC5zb3VyY2VzWzBdLnN1YnN0cmluZygxKTtcbiAgICAgICAganMuY29kZSArPSAnXFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9JyArIGpzLm1hcC50b1VybCgpO1xuXG4gICAgICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0ganMubWFwLnNvdXJjZXNbMF07XG4gICAgICAgICAgICBjc3MuY29kZSArPSAnXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9JyArIGNzcy5tYXAudG9VcmwoKSArICcqLyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuanMnLCBqcy5jb2RlKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVwZW5kZW5jaWVzLFxuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufSIsICJpbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyAgY3JlYXRlSW1wb3J0ZXIsIHNhc3NBbmRTb3VyY2UsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFN0eWxlU2FzcyhpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogXCJzYXNzXCIgfCBcInNjc3NcIiB8IFwiY3NzXCIsIGlzRGVidWc6IGJvb2xlYW4pOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0+IHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuXG4gICAgY29uc3QgZGVwZW5kZW5jZU9iamVjdCA9IHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpLCBmaWxlRGF0YURpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoZmlsZURhdGEsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCh0eXBlKSxcbiAgICAgICAgICAgIHN0eWxlOiBzYXNzU3R5bGUodHlwZSwgU29tZVBsdWdpbnMpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnQsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoPGFueT5maWxlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNlT2JqZWN0W0Jhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpXSA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuY3NzO1xuXG4gICAgICAgIGlmIChpc0RlYnVnICYmIHJlc3VsdC5zb3VyY2VNYXApIHtcbiAgICAgICAgICAgIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgcGF0aFRvRmlsZVVSTChmaWxlRGF0YSkuaHJlZik7XG4gICAgICAgICAgICByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMgPSByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMubWFwKHggPT4gcGF0aC5yZWxhdGl2ZShmaWxlRGF0YURpcm5hbWUsIGZpbGVVUkxUb1BhdGgoeCkpICsgJz9zb3VyY2U9dHJ1ZScpO1xuXG4gICAgICAgICAgICBkYXRhICs9IGBcXHJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXN1bHQuc291cmNlTWFwKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9Ki9gO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZXhwcmVzc2lvbikge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIHRleHQ6IGAke2V4cHJlc3Npb24ubWVzc2FnZX0sIG9uIGZpbGUgLT4gJHtmdWxsUGF0aH0ke2V4cHJlc3Npb24ubGluZSA/ICc6JyArIGV4cHJlc3Npb24ubGluZSA6ICcnfWAsXG4gICAgICAgICAgICBlcnJvck5hbWU6IGV4cHJlc3Npb24/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgICAgICB0eXBlOiBleHByZXNzaW9uPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkZXBlbmRlbmNlT2JqZWN0XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERpcmVudCB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IEluc2VydCwgQ29tcG9uZW50cywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IENsZWFyV2FybmluZyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3J1xuaW1wb3J0ICogYXMgU2VhcmNoRmlsZVN5c3RlbSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFJlcVNjcmlwdCBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IFN0YXRpY0ZpbGVzIGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tICcuL0NvbXBpbGVTdGF0ZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVTaXRlTWFwIH0gZnJvbSAnLi9TaXRlTWFwJztcbmltcG9ydCB7IGlzRmlsZVR5cGUsIFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgeyBwZXJDb21waWxlLCBwb3N0Q29tcGlsZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlJztcblxuYXN5bmMgZnVuY3Rpb24gY29tcGlsZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgaXNEZWJ1Zz86IGJvb2xlYW4sIGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZykge1xuICAgIGNvbnN0IEZ1bGxGaWxlUGF0aCA9IHBhdGguam9pbihhcnJheVR5cGVbMF0sIGZpbGVQYXRoKSwgRnVsbFBhdGhDb21waWxlID0gYXJyYXlUeXBlWzFdICsgZmlsZVBhdGggKyAnLmNqcyc7XG5cblxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbEZpbGVQYXRoLCAndXRmOCcpO1xuICAgIGNvbnN0IEV4Y2x1VXJsID0gKG5lc3RlZFBhZ2UgPyBuZXN0ZWRQYWdlICsgJzxsaW5lPicgOiAnJykgKyBhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aDtcblxuICAgIGNvbnN0IHNlc3Npb25JbmZvID0gaGFzU2Vzc2lvbkluZm8gPz8gbmV3IFNlc3Npb25CdWlsZChhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aCwgRnVsbEZpbGVQYXRoLCBhcnJheVR5cGVbMl0sIGlzRGVidWcsIEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSk7XG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZSgndGhpc1BhZ2UnLCBGdWxsRmlsZVBhdGgpO1xuXG4gICAgY29uc3QgQ29tcGlsZWREYXRhID0gYXdhaXQgSW5zZXJ0KGh0bWwsIEZ1bGxQYXRoQ29tcGlsZSwgQm9vbGVhbihuZXN0ZWRQYWdlKSwgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghbmVzdGVkUGFnZSkge1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKEZ1bGxQYXRoQ29tcGlsZSwgQ29tcGlsZWREYXRhLlN0cmluZ1dpdGhUYWNrKEZ1bGxQYXRoQ29tcGlsZSkpO1xuICAgICAgICBwYWdlRGVwcy51cGRhdGUoUmVtb3ZlRW5kVHlwZShFeGNsdVVybCksIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgQ29tcGlsZWREYXRhLCBzZXNzaW9uSW5mbyB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ta2RpcihhcnJheVR5cGVbMV0gKyBjb25uZWN0KTtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShTZWFyY2hGaWxlU3lzdGVtLkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgICAgIGlmIChhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoYXJyYXlUeXBlWzJdICsgJy8nICsgY29ubmVjdCkpIC8vY2hlY2sgaWYgbm90IGFscmVhZHkgY29tcGlsZSBmcm9tIGEgJ2luLWZpbGUnIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29tcGlsZUZpbGUoY29ubmVjdCwgYXJyYXlUeXBlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKFNlYXJjaEZpbGVTeXN0ZW0uQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgUmVxU2NyaXB0KCdQcm9kdWN0aW9uIExvYWRlciAtICcgKyBhcnJheVR5cGVbMl0sIGNvbm5lY3QsIGFycmF5VHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFN0YXRpY0ZpbGVzKGNvbm5lY3QsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVNjcmlwdHMoc2NyaXB0czogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2Ygc2NyaXB0cykge1xuICAgICAgICBhd2FpdCBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyJywgcGF0aCwgU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5TdGF0aWMsIGZhbHNlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIENyZWF0ZUNvbXBpbGUodDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgdHlwZXMgPSBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzW3RdO1xuICAgIGF3YWl0IFNlYXJjaEZpbGVTeXN0ZW0uRGVsZXRlSW5EaXJlY3RvcnkodHlwZXNbMV0pO1xuICAgIHJldHVybiAoKSA9PiBGaWxlc0luRm9sZGVyKHR5cGVzLCAnJywgc3RhdGUpO1xufVxuXG4vKipcbiAqIHdoZW4gcGFnZSBjYWxsIG90aGVyIHBhZ2U7XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZUluRmlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZykge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aCwgYXJyYXlUeXBlWzFdKTtcbiAgICByZXR1cm4gYXdhaXQgY29tcGlsZUZpbGUocGF0aCwgYXJyYXlUeXBlLCB0cnVlLCBzZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdKSB7XG4gICAgYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUocGF0aCwgYXJyYXlUeXBlKTtcbiAgICBDbGVhcldhcm5pbmcoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVBbGwoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncykge1xuICAgIGxldCBzdGF0ZSA9ICFhcmd2LmluY2x1ZGVzKCdyZWJ1aWxkJykgJiYgYXdhaXQgQ29tcGlsZVN0YXRlLmNoZWNrTG9hZCgpXG5cbiAgICBpZiAoc3RhdGUpIHJldHVybiAoKSA9PiBSZXF1aXJlU2NyaXB0cyhzdGF0ZS5zY3JpcHRzKVxuICAgIHBhZ2VEZXBzLmNsZWFyKCk7XG4gICAgXG4gICAgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcblxuICAgIHBlckNvbXBpbGUoKTtcblxuICAgIGNvbnN0IGFjdGl2YXRlQXJyYXkgPSBbYXdhaXQgQ3JlYXRlQ29tcGlsZShTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpY1syXSwgc3RhdGUpLCBhd2FpdCBDcmVhdGVDb21waWxlKFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuTG9nc1syXSwgc3RhdGUpLCBDbGVhcldhcm5pbmddO1xuXG4gICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFjdGl2YXRlQXJyYXkpIHtcbiAgICAgICAgICAgIGF3YWl0IGkoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgc3RhdGUpO1xuICAgICAgICBzdGF0ZS5leHBvcnQoKVxuICAgICAgICBwb3N0Q29tcGlsZSgpXG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZ2V0U2V0dGluZ3NEYXRlIH0gZnJvbSBcIi4uL01haW5CdWlsZC9JbXBvcnRNb2R1bGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxudHlwZSBDU3RhdGUgPSB7XG4gICAgdXBkYXRlOiBudW1iZXJcbiAgICBwYWdlQXJyYXk6IHN0cmluZ1tdW10sXG4gICAgaW1wb3J0QXJyYXk6IHN0cmluZ1tdXG4gICAgZmlsZUFycmF5OiBzdHJpbmdbXVxufVxuXG4vKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gc3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBwcm9qZWN0ICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlU3RhdGUge1xuICAgIHByaXZhdGUgc3RhdGU6IENTdGF0ZSA9IHsgdXBkYXRlOiAwLCBwYWdlQXJyYXk6IFtdLCBpbXBvcnRBcnJheTogW10sIGZpbGVBcnJheTogW10gfVxuICAgIHN0YXRpYyBmaWxlUGF0aCA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBcIkNvbXBpbGVTdGF0ZS5qc29uXCIpXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUudXBkYXRlID0gZ2V0U2V0dGluZ3NEYXRlKClcbiAgICB9XG5cbiAgICBnZXQgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXlcbiAgICB9XG5cbiAgICBnZXQgcGFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnBhZ2VBcnJheVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZmlsZUFycmF5XG4gICAgfVxuXG4gICAgYWRkUGFnZShwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucGFnZUFycmF5LmZpbmQoeCA9PiB4WzBdID09IHBhdGggJiYgeFsxXSA9PSB0eXBlKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucGFnZUFycmF5LnB1c2goW3BhdGgsIHR5cGVdKVxuICAgIH1cblxuICAgIGFkZEltcG9ydChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmltcG9ydEFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgYWRkRmlsZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmZpbGVBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmlsZUFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZShDb21waWxlU3RhdGUuZmlsZVBhdGgsIHRoaXMuc3RhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNoZWNrTG9hZCgpIHtcbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLmZpbGVQYXRoKSkgcmV0dXJuXG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcbiAgICAgICAgc3RhdGUuc3RhdGUgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZmlsZVBhdGgpXG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAhPSBnZXRTZXR0aW5nc0RhdGUoKSkgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxufSIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBJbXBvcnRGaWxlLCB7QWRkRXh0ZW5zaW9uLCBSZXF1aXJlT25jZX0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7cHJpbnR9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTdGFydFJlcXVpcmUoYXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYXJyYXlGdW5jU2VydmVyID0gW107XG4gICAgZm9yIChsZXQgaSBvZiBhcnJheSkge1xuICAgICAgICBpID0gQWRkRXh0ZW5zaW9uKGkpO1xuXG4gICAgICAgIGNvbnN0IGIgPSBhd2FpdCBJbXBvcnRGaWxlKCdyb290IGZvbGRlciAoV1dXKScsIGksIGdldFR5cGVzLlN0YXRpYywgaXNEZWJ1Zyk7XG4gICAgICAgIGlmIChiICYmIHR5cGVvZiBiLlN0YXJ0U2VydmVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFycmF5RnVuY1NlcnZlci5wdXNoKGIuU3RhcnRTZXJ2ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpbnQubG9nKGBDYW4ndCBmaW5kIFN0YXJ0U2VydmVyIGZ1bmN0aW9uIGF0IG1vZHVsZSAtICR7aX1cXG5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheUZ1bmNTZXJ2ZXI7XG59XG5cbmxldCBsYXN0U2V0dGluZ3NJbXBvcnQ6IG51bWJlcjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRTZXR0aW5ncyhmaWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKXtcbiAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCArICcudHMnKSl7XG4gICAgICAgIGZpbGVQYXRoICs9ICcudHMnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoICs9ICcuanMnXG4gICAgfVxuICAgIGNvbnN0IGNoYW5nZVRpbWUgPSA8YW55PmF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpXG5cbiAgICBpZihjaGFuZ2VUaW1lID09IGxhc3RTZXR0aW5nc0ltcG9ydCB8fCAhY2hhbmdlVGltZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgXG4gICAgbGFzdFNldHRpbmdzSW1wb3J0ID0gY2hhbmdlVGltZTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgUmVxdWlyZU9uY2UoZmlsZVBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBkYXRhLmRlZmF1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nc0RhdGUoKXtcbiAgICByZXR1cm4gbGFzdFNldHRpbmdzSW1wb3J0XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJbXBvcnRGaWxlIH0gZnJvbSBcIi4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMsIHsgRGlyZW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tIFwiLi9Db21waWxlU3RhdGVcIjtcbmltcG9ydCB7IGlzRmlsZVR5cGUgfSBmcm9tIFwiLi9GaWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPVtdO1xuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNjYW5GaWxlcygpe1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5TdGF0aWMsICcnLCBzdGF0ZSksXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuTG9ncywgJycsIHN0YXRlKVxuICAgIF0pXG4gICAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVidWdTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3Mpe1xuICAgIHJldHVybiBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgYXdhaXQgc2NhbkZpbGVzKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgeyByb3V0aW5nLCBkZXZlbG9wbWVudCB9ID0gRXhwb3J0O1xuICAgIGlmICghcm91dGluZy5zaXRlbWFwKSByZXR1cm47XG5cbiAgICBjb25zdCBzaXRlbWFwID0gcm91dGluZy5zaXRlbWFwID09PSB0cnVlID8ge30gOiByb3V0aW5nLnNpdGVtYXA7XG4gICAgT2JqZWN0LmFzc2lnbihzaXRlbWFwLCB7XG4gICAgICAgIHJ1bGVzOiB0cnVlLFxuICAgICAgICB1cmxTdG9wOiBmYWxzZSxcbiAgICAgICAgZXJyb3JQYWdlczogZmFsc2UsXG4gICAgICAgIHZhbGlkUGF0aDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFnZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICB1cmxzOiAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBmb3IgKGxldCBbdXJsLCB0eXBlXSBvZiBzdGF0ZS5wYWdlcykge1xuXG4gICAgICAgIGlmKHR5cGUgIT0gZ2V0VHlwZXMuU3RhdGljWzJdIHx8ICF1cmwuZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB1cmwgPSAnLycgKyB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmKHBhdGguZXh0bmFtZSh1cmwpID09ICcuc2VydicpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC51cmxTdG9wKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpdGVtYXAucnVsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGF3YWl0IHJvdXRpbmcucnVsZXNbcGF0aF0odXJsKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGVuZHMgPT4gdXJsLmVuZHNXaXRoKCcuJytlbmRzKSkgfHxcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChzdGFydCA9PiB1cmwuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHJvdXRpbmcudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhd2FpdCBmdW5jKHVybCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpdGVtYXAuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlcnJvciBpbiByb3V0aW5nLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gJy8nICsgcm91dGluZy5lcnJvclBhZ2VzW2Vycm9yXS5wYXRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VzLnB1c2godXJsKTtcbiAgICB9XG5cbiAgICBsZXQgd3JpdGUgPSB0cnVlO1xuICAgIGlmIChzaXRlbWFwLmZpbGUpIHtcbiAgICAgICAgY29uc3QgZmlsZUFjdGlvbiA9IGF3YWl0IEltcG9ydEZpbGUoJ1NpdGVtYXAgSW1wb3J0Jywgc2l0ZW1hcC5maWxlLCBnZXRUeXBlcy5TdGF0aWMsIGRldmVsb3BtZW50KTtcbiAgICAgICAgaWYoIWZpbGVBY3Rpb24/LlNpdGVtYXApe1xuICAgICAgICAgICAgZHVtcC53YXJuKCdcXCdTaXRlbWFwXFwnIGZ1bmN0aW9uIG5vdCBmb3VuZCBvbiBmaWxlIC0+ICcrIHNpdGVtYXAuZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3cml0ZSA9IGF3YWl0IGZpbGVBY3Rpb24uU2l0ZW1hcChwYWdlcywgc3RhdGUsIEV4cG9ydCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZih3cml0ZSAmJiBwYWdlcy5sZW5ndGgpe1xuICAgICAgICBjb25zdCBwYXRoID0gd3JpdGUgPT09IHRydWUgPyAnc2l0ZW1hcC50eHQnOiB3cml0ZTtcbiAgICAgICAgc3RhdGUuYWRkRmlsZShwYXRoKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShnZXRUeXBlcy5TdGF0aWNbMF0gKyBwYXRoLCBwYWdlcy5qb2luKCdcXG4nKSk7XG4gICAgfVxufSIsICIvKipcbiAqIENoZWNrIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gZmlsZSB0eXBlcy5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVzIC0gYW4gYXJyYXkgb2YgZmlsZSBleHRlbnNpb25zIHRvIG1hdGNoLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZVR5cGUodHlwZXM6IHN0cmluZ1tdLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCcuJyArIHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsYXN0IGRvdCBhbmQgZXZlcnl0aGluZyBhZnRlciBpdCBmcm9tIGEgc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byByZW1vdmUgdGhlIGVuZCB0eXBlIGZyb20uXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGhvdXQgdGhlIGxhc3QgY2hhcmFjdGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUmVtb3ZlRW5kVHlwZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBGaWxlcyB9IGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4Jztcbi8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuXG5jb25zdCBFeHBvcnQgPSB7XG4gICAgUGFnZUxvYWRSYW06IHt9LFxuICAgIFBhZ2VSYW06IHRydWVcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSB0eXBlQXJyYXkgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoIHRvIHRoZVxuICogZmlsZS5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgZGljdGlvbmFyeSBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7YW55fSBEYXRhT2JqZWN0IC0gVGhlIGRhdGEgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVQYWdlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBSZXFGaWxlUGF0aCA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcbiAgICBjb25zdCByZXNNb2RlbCA9ICgpID0+IFJlcUZpbGVQYXRoLm1vZGVsKERhdGFPYmplY3QpO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBpZiAoUmVxRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKCFEYXRhT2JqZWN0LmlzRGVidWcpXG4gICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcblxuICAgICAgICBpZiAoUmVxRmlsZVBhdGguZGF0ZSA9PSAtMSkge1xuICAgICAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKFJlcUZpbGVQYXRoLnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWZpbGVFeGlzdHMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICghZXh0bmFtZSkge1xuICAgICAgICBleHRuYW1lID0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgZmlsZVBhdGggKz0gJy4nICsgZXh0bmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFBhdGg6IHN0cmluZztcbiAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFsxXSA9PSAnLycpXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlUGF0aClcbiAgICB9IGVsc2VcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoIVtCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnRdLmluY2x1ZGVzKGV4dG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICBEYXRhT2JqZWN0LndyaXRlKGltcG9ydFRleHQpO1xuICAgICAgICByZXR1cm4gaW1wb3J0VGV4dDtcbiAgICB9XG5cbiAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCk7XG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtjb3B5UGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgfSlcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogKCkgPT4geyB9LCBkYXRlOiAtMSwgcGF0aDogZnVsbFBhdGggfTtcbiAgICAgICAgcmV0dXJuIExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBGb3JTYXZlUGF0aCA9IHR5cGVBcnJheVsyXSArICcvJyArIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSBleHRuYW1lLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IHJlQnVpbGQgPSBEYXRhT2JqZWN0LmlzRGVidWcgJiYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKEZvclNhdmVQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoZmlsZVBhdGgsIHR5cGVBcnJheSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdICYmICFyZUJ1aWxkKSB7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF1bMF0gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbChEYXRhT2JqZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jID0gYXdhaXQgTG9hZFBhZ2UoRm9yU2F2ZVBhdGgsIGV4dG5hbWUpO1xuICAgIGlmIChFeHBvcnQuUGFnZVJhbSkge1xuICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdWzBdID0gZnVuYztcbiAgICB9XG5cbiAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBmdW5jIH07XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMoRGF0YU9iamVjdCk7XG59XG5cbmNvbnN0IEdsb2JhbFZhciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRGdWxsUGF0aENvbXBpbGUodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIHJldHVybiB0eXBlQXJyYXlbMV0gKyBTcGxpdEluZm9bMV0gKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UgKyAnLmNqcyc7XG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIHBhZ2UgdG8gbG9hZC5cbiAqIEBwYXJhbSBleHQgLSBUaGUgZXh0ZW5zaW9uIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlKHVybDogc3RyaW5nLCBleHQgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG5cbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIGNvbnN0IExhc3RSZXF1aXJlID0ge307XG5cbiAgICBmdW5jdGlvbiBfcmVxdWlyZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gUmVxdWlyZUZpbGUocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmNsdWRlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nLCBXaXRoT2JqZWN0ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVQYWdlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgeyAuLi5XaXRoT2JqZWN0LCAuLi5EYXRhT2JqZWN0IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF90cmFuc2ZlcihwOiBzdHJpbmcsIHByZXNlcnZlRm9ybTogYm9vbGVhbiwgd2l0aE9iamVjdDogYW55LCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ID0gJyc7XG5cbiAgICAgICAgaWYgKCFwcmVzZXJ2ZUZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3REYXRhID0gRGF0YU9iamVjdC5SZXF1ZXN0LmJvZHkgPyB7fSA6IG51bGw7XG4gICAgICAgICAgICBEYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFPYmplY3QsXG4gICAgICAgICAgICAgICAgUmVxdWVzdDogeyAuLi5EYXRhT2JqZWN0LlJlcXVlc3QsIGZpbGVzOiB7fSwgcXVlcnk6IHt9LCBib2R5OiBwb3N0RGF0YSB9LFxuICAgICAgICAgICAgICAgIFBvc3Q6IHBvc3REYXRhLCBRdWVyeToge30sIEZpbGVzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgRGF0YU9iamVjdCwgcCwgd2l0aE9iamVjdCk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBTcGxpdEluZm9bMV0gKyBcIi5cIiArIGV4dCArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBkZWJ1Z19fZmlsZW5hbWUgPSB1cmwgKyBcIi5cIiArIGV4dDtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBwYXRoIC0+IFwiLCBkZWJ1Z19fZmlsZW5hbWUsIFwiLT5cIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gYDxkaXYgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPjxwPkVycm9yIHBhdGg6ICR7ZGVidWdfX2ZpbGVuYW1lfTwvcD48cD5FcnJvciBtZXNzYWdlOiAke2UubWVzc2FnZX08L3A+PC9kaXY+YDtcbiAgICB9XG59XG4vKipcbiAqIEl0IHRha2VzIGEgZnVuY3Rpb24gdGhhdCBwcmVwYXJlIGEgcGFnZSwgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIGEgcGFnZVxuICogQHBhcmFtIExvYWRQYWdlRnVuYyAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBpbiBhIHBhZ2UgdG8gZXhlY3V0ZSBvblxuICogQHBhcmFtIHtzdHJpbmd9IHJ1bl9zY3JpcHRfbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY3JpcHQgdG8gcnVuLlxuICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5cbmZ1bmN0aW9uIEJ1aWxkUGFnZShMb2FkUGFnZUZ1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gdm9pZCwgcnVuX3NjcmlwdF9uYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBQYWdlVmFyID0ge307XG5cbiAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChSZXNwb25zZTogUmVzcG9uc2UsIFJlcXVlc3Q6IFJlcXVlc3QsIFBvc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCBudWxsLCBRdWVyeTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgQ29va2llczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgU2Vzc2lvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRmlsZXM6IEZpbGVzLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG91dF9ydW5fc2NyaXB0ID0geyB0ZXh0OiAnJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nSW5mbyhzdHI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgYXNTdHJpbmcgPSBzdHI/LnRvU3RyaW5nPy4oKTtcbiAgICAgICAgICAgIGlmIChhc1N0cmluZyA9PSBudWxsIHx8IGFzU3RyaW5nLnN0YXJ0c1dpdGgoJ1tvYmplY3QgT2JqZWN0XScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0ciwgbnVsbCwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSZXNwb25zZSh0ZXh0OiBhbnkpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0ID0gJycpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlU2FmZShzdHIgPSAnJykge1xuICAgICAgICAgICAgc3RyID0gVG9TdHJpbmdJbmZvKHN0cik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcmIycgKyBpLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlY2hvKGFycjogc3RyaW5nW10sIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFycltpXTtcbiAgICAgICAgICAgICAgICB3cml0ZVNhZmUocGFyYW1zW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnIuYXQoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZGlyZWN0UGF0aDogYW55ID0gZmFsc2U7XG5cbiAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QgPSAocGF0aDogc3RyaW5nLCBzdGF0dXM/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1cyhzdGF0dXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVzcG9uc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+UmVzcG9uc2UpLnJlbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0KFJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGaWxlKGZpbGVQYXRoLCBkZWxldGVBZnRlciA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSB7IGZpbGU6IGZpbGVQYXRoLCBkZWxldGVBZnRlciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRGF0YVNlbmQgPSB7XG4gICAgICAgICAgICBzZW5kRmlsZSxcbiAgICAgICAgICAgIHdyaXRlU2FmZSxcbiAgICAgICAgICAgIHdyaXRlLFxuICAgICAgICAgICAgZWNobyxcbiAgICAgICAgICAgIHNldFJlc3BvbnNlLFxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQsXG4gICAgICAgICAgICBydW5fc2NyaXB0X25hbWUsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBQb3N0LFxuICAgICAgICAgICAgUXVlcnksXG4gICAgICAgICAgICBTZXNzaW9uLFxuICAgICAgICAgICAgRmlsZXMsXG4gICAgICAgICAgICBDb29raWVzLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIFBhZ2VWYXIsXG4gICAgICAgICAgICBHbG9iYWxWYXIsXG4gICAgICAgICAgICBjb2RlYmFzZTogJydcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IExvYWRQYWdlRnVuYyhEYXRhU2VuZCk7XG5cbiAgICAgICAgcmV0dXJuIHsgb3V0X3J1bl9zY3JpcHQ6IG91dF9ydW5fc2NyaXB0LnRleHQsIHJlZGlyZWN0UGF0aCB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHsgTG9hZFBhZ2UsIEJ1aWxkUGFnZSwgZ2V0RnVsbFBhdGhDb21waWxlLCBFeHBvcnQsIFNwbGl0Rmlyc3QgfTsiLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSwgQWRkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxudHlwZSBSZXF1aXJlRmlsZXMgPSB7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgc3RhdHVzPzogbnVtYmVyXG4gICAgbW9kZWw6IGFueVxuICAgIGRlcGVuZGVuY2llcz86IFN0cmluZ0FueU1hcFxuICAgIHN0YXRpYz86IGJvb2xlYW5cbn1cblxuY29uc3QgQ2FjaGVSZXF1aXJlRmlsZXMgPSB7fTtcblxuLyoqXG4gKiBJdCBtYWtlcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gZGVwZW5kZW5jaWVzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgYXJyYXkgb2YgYmFzZSBwYXRoc1xuICogQHBhcmFtIFtiYXNlUGF0aF0gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGNvbXBpbGVkLlxuICogQHBhcmFtIGNhY2hlIC0gQSBjYWNoZSBvZiB0aGUgbGFzdCB0aW1lIGEgZmlsZSB3YXMgbW9kaWZpZWQuXG4gKiBAcmV0dXJucyBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBTdHJpbmdBbnlNYXAsIHR5cGVBcnJheTogc3RyaW5nW10sIGJhc2VQYXRoID0gJycsIGNhY2hlID0ge30pIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNYXA6IFN0cmluZ0FueU1hcCA9IHt9O1xuICAgIGNvbnN0IHByb21pc2VBbGwgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgcHJvbWlzZUFsbC5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGggPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgICAgIGlmICghY2FjaGVbYmFzZVBhdGhdKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlUGF0aF0gPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBiYXNlUGF0aCwgJ210aW1lTXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbJ3RoaXNGaWxlJ10gPSBjYWNoZVtiYXNlUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFtmaWxlUGF0aF0gPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKDxhbnk+dmFsdWUsIHR5cGVBcnJheSwgZmlsZVBhdGgsIGNhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICApKCkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VBbGwpO1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNYXA7XG59XG5cbi8qKlxuICogSWYgdGhlIG9sZCBkZXBlbmRlbmNpZXMgYW5kIHRoZSBuZXcgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZSwgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmN5IG1hcC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkZXBlbmRlbmN5IHRyZWVzLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIHRoZSBtb2R1bGVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBbcGFyZW50XSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJlbnQgbW9kdWxlLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLiBFYWNoIHN0cmluZyByZXByZXNlbnRzIGEgY2hhbmdlIGluIHRoZSBkZXBlbmRlbmN5XG4gKiB0cmVlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VBcnJheShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCwgcGFyZW50ID0gJycpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgY2hhbmdlQXJyYXkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW5ld0RlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGdldENoYW5nZUFycmF5KG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0sIG5hbWUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaCguLi5jaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZUFycmF5O1xufVxuXG4vKipcbiAqIEl0IGltcG9ydHMgYSBmaWxlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIHBhdGhzIHR5cGVzLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBtYXAgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuXG4gKiBAcmV0dXJucyBUaGUgbW9kZWwgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogUmVxdWlyZUZpbGVzIH0sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBSZXFGaWxlID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IG51bWJlciwgbmV3RGVwczogU3RyaW5nQW55TWFwO1xuICAgIGlmIChSZXFGaWxlKSB7XG5cbiAgICAgICAgaWYgKCFpc0RlYnVnIHx8IGlzRGVidWcgJiYgKFJlcUZpbGUuc3RhdHVzID09IC0xKSlcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBSZXFGaWxlLnBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG5cbiAgICAgICAgICAgIG5ld0RlcHMgPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpO1xuXG4gICAgICAgICAgICBpZiAoY29tcGFyZURlcGVuZGVuY2llc1NhbWUoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoUmVxRmlsZS5zdGF0dXMgPT0gMClcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IHN0YXRpY19tb2R1bGVzID0gZmFsc2U7XG5cbiAgICBpZiAoIVJlcUZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJykge1xuXG4gICAgICAgICAgICBpZiAoZmlsZVBhdGhbMV0gPT0gJy8nKVxuICAgICAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xuXG4gICAgICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSwgX19kaXJuYW1lKSwgZmlsZVBhdGgpO1xuICAgICAgICB9IGVsc2UgaWYgKGZpbGVQYXRoWzBdICE9ICcvJylcbiAgICAgICAgICAgIHN0YXRpY19tb2R1bGVzID0gdHJ1ZTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoID0gUmVxRmlsZS5wYXRoO1xuICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IFJlcUZpbGUuc3RhdGljO1xuICAgIH1cblxuICAgIGlmIChzdGF0aWNfbW9kdWxlcylcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgaW1wb3J0KGZpbGVQYXRoKSwgc3RhdHVzOiAtMSwgc3RhdGljOiB0cnVlLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgIGVsc2Uge1xuICAgICAgICAvLyBhZGQgc2Vydi5qcyBvciBzZXJ2LnRzIGlmIG5lZWRlZFxuICAgICAgICBmaWxlUGF0aCA9IEFkZEV4dGVuc2lvbihmaWxlUGF0aCk7XG5cbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSB0eXBlQXJyYXlbMF0gKyBmaWxlUGF0aDtcbiAgICAgICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVNb2RlbCA9IENhY2hlUmVxdWlyZUZpbGVzW2ZpbGVQYXRoXTtcbiAgICAgICAgICAgIGlmIChoYXZlTW9kZWwgJiYgY29tcGFyZURlcGVuZGVuY2llc1NhbWUoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcyA9IG5ld0RlcHMgPz8gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpKSlcbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSBoYXZlTW9kZWw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdEZXBzID0gbmV3RGVwcyA/PyB7fTtcblxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEltcG9ydEZpbGUoX19maWxlbmFtZSwgZmlsZVBhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgbmV3RGVwcywgaGF2ZU1vZGVsICYmIGdldENoYW5nZUFycmF5KGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKSwgZGVwZW5kZW5jaWVzOiBuZXdEZXBzLCBwYXRoOiBmaWxlUGF0aCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiB7fSwgc3RhdHVzOiAwLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2ZpbGVQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWx0TW9kZWwgPSBMYXN0UmVxdWlyZVtjb3B5UGF0aF07XG4gICAgQ2FjaGVSZXF1aXJlRmlsZXNbYnVpbHRNb2RlbC5wYXRoXSA9IGJ1aWx0TW9kZWw7XG5cbiAgICByZXR1cm4gYnVpbHRNb2RlbC5tb2RlbDtcbn0iLCAiaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgdHJpbVR5cGUsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8vIC0tIHN0YXJ0IG9mIGZldGNoIGZpbGUgKyBjYWNoZSAtLVxuXG50eXBlIGFwaUluZm8gPSB7XG4gICAgcGF0aFNwbGl0OiBudW1iZXIsXG4gICAgZGVwc01hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfVxufVxuXG5jb25zdCBhcGlTdGF0aWNNYXA6IHsgW2tleTogc3RyaW5nXTogYXBpSW5mbyB9ID0ge307XG5cbi8qKlxuICogR2l2ZW4gYSB1cmwsIHJldHVybiB0aGUgc3RhdGljIHBhdGggYW5kIGRhdGEgaW5mbyBpZiB0aGUgdXJsIGlzIGluIHRoZSBzdGF0aWMgbWFwXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHRoZSB1c2VyIGlzIHJlcXVlc3RpbmcuXG4gKiBAcGFyYW0ge251bWJlcn0gcGF0aFNwbGl0IC0gdGhlIG51bWJlciBvZiBzbGFzaGVzIGluIHRoZSB1cmwuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICovXG5mdW5jdGlvbiBnZXRBcGlGcm9tTWFwKHVybDogc3RyaW5nLCBwYXRoU3BsaXQ6IG51bWJlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcGlTdGF0aWNNYXApO1xuICAgIGZvciAoY29uc3QgaSBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IGUgPSBhcGlTdGF0aWNNYXBbaV07XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSAmJiBlLnBhdGhTcGxpdCA9PSBwYXRoU3BsaXQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXRpY1BhdGg6IGksXG4gICAgICAgICAgICAgICAgZGF0YUluZm86IGVcbiAgICAgICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIEFQSSBmaWxlIGZvciBhIGdpdmVuIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIEFQSS5cbiAqIEByZXR1cm5zIFRoZSBwYXRoIHRvIHRoZSBBUEkgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZmluZEFwaVBhdGgodXJsOiBzdHJpbmcpIHtcblxuICAgIHdoaWxlICh1cmwubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UGF0aCA9IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMF0sIHVybCArICcuYXBpJyk7XG4gICAgICAgIGNvbnN0IG1ha2VQcm9taXNlID0gYXN5bmMgKHR5cGU6IHN0cmluZykgPT4gKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHN0YXJ0UGF0aCArICcuJyArIHR5cGUpICYmIHR5cGUpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVUeXBlID0gKGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCd0cycpLFxuICAgICAgICAgICAgbWFrZVByb21pc2UoJ2pzJylcbiAgICAgICAgXSkpLmZpbHRlcih4ID0+IHgpLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKGZpbGVUeXBlKVxuICAgICAgICAgICAgcmV0dXJuIHVybCArICcuYXBpLicgKyBmaWxlVHlwZTtcblxuICAgICAgICB1cmwgPSBDdXRUaGVMYXN0KCcvJywgdXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYXRoU3BsaXQgPSB1cmwuc3BsaXQoJy8nKS5sZW5ndGg7XG4gICAgbGV0IHsgc3RhdGljUGF0aCwgZGF0YUluZm8gfSA9IGdldEFwaUZyb21NYXAodXJsLCBwYXRoU3BsaXQpO1xuXG4gICAgaWYgKCFkYXRhSW5mbykge1xuICAgICAgICBzdGF0aWNQYXRoID0gYXdhaXQgZmluZEFwaVBhdGgodXJsKTtcblxuICAgICAgICBpZiAoc3RhdGljUGF0aCkge1xuICAgICAgICAgICAgZGF0YUluZm8gPSB7XG4gICAgICAgICAgICAgICAgcGF0aFNwbGl0LFxuICAgICAgICAgICAgICAgIGRlcHNNYXA6IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFwaVN0YXRpY01hcFtzdGF0aWNQYXRoXSA9IGRhdGFJbmZvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGFJbmZvKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBNYWtlQ2FsbChcbiAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVGaWxlKCcvJyArIHN0YXRpY1BhdGgsICdhcGktY2FsbCcsICcnLCBnZXRUeXBlcy5TdGF0aWMsIGRhdGFJbmZvLmRlcHNNYXAsIGlzRGVidWcpLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgdXJsLnN1YnN0cmluZyhzdGF0aWNQYXRoLmxlbmd0aCAtIDYpLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIG5leHRQcmFzZVxuICAgICAgICApO1xuICAgIH1cbn1cbi8vIC0tIGVuZCBvZiBmZXRjaCBmaWxlIC0tXG5jb25zdCBiYW5Xb3JkcyA9IFsndmFsaWRhdGVVUkwnLCAndmFsaWRhdGVGdW5jJywgJ2Z1bmMnLCAnZGVmaW5lJywgLi4uaHR0cC5NRVRIT0RTXTtcbi8qKlxuICogRmluZCB0aGUgQmVzdCBQYXRoXG4gKi9cbmZ1bmN0aW9uIGZpbmRCZXN0VXJsT2JqZWN0KG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcpIHtcbiAgICBsZXQgbWF4TGVuZ3RoID0gMCwgdXJsID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGkubGVuZ3RoO1xuICAgICAgICBpZiAobWF4TGVuZ3RoIDwgbGVuZ3RoICYmIHVybEZyb20uc3RhcnRzV2l0aChpKSAmJiAhYmFuV29yZHMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHVybCA9IGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFBhcnNlIEFuZCBWYWxpZGF0ZSBVUkxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VVUkxEYXRhKHZhbGlkYXRlOiBhbnksIHZhbHVlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGxldCBwdXNoRGF0YSA9IHZhbHVlLCByZXNEYXRhID0gdHJ1ZSwgZXJyb3I6IHN0cmluZztcblxuICAgIHN3aXRjaCAodmFsaWRhdGUpIHtcbiAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgIGNhc2UgcGFyc2VGbG9hdDpcbiAgICAgICAgY2FzZSBwYXJzZUludDpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gKDxhbnk+dmFsaWRhdGUpKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSAhaXNOYU4ocHVzaERhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gdmFsdWUgIT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSB2YWx1ZSA9PSAndHJ1ZScgfHwgdmFsdWUgPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhbnknOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxpZGF0ZSkpXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLmluY2x1ZGVzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFrZVZhbGlkID0gYXdhaXQgdmFsaWRhdGUodmFsdWUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ha2VWYWxpZCAmJiB0eXBlb2YgbWFrZVZhbGlkID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkLnZhbGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaERhdGEgPSBtYWtlVmFsaWQucGFyc2UgPz8gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZDtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yLCBmaWxlZCAtICcgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS50ZXN0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc0RhdGEpXG4gICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRlIGZpbGVkIC0gJyArIHZhbHVlO1xuXG4gICAgcmV0dXJuIFtlcnJvciwgcHVzaERhdGFdO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIHRoZSBVUkwgZGF0YSBhbmQgcGFyc2VzIGl0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IG9iaiAtIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgVVJMIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gVGhlIFVSTCB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSB7YW55fSBkZWZpbmVPYmplY3QgLSBBbGwgdGhlIGRlZmluaXRpb25zIHRoYXQgaGFzIGJlZW4gZm91bmRcbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSBtYWtlTWFzc2FnZSAtIENyZWF0ZSBhbiBlcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBwcm9wZXJ0eS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlZmluaXRpb24ob2JqOiBhbnksIHVybEZyb206IHN0cmluZywgZGVmaW5lT2JqZWN0OiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGlmICghb2JqLmRlZmluZSlcbiAgICAgICAgcmV0dXJuIHVybEZyb207XG5cbiAgICBjb25zdCB2YWxpZGF0ZUZ1bmMgPSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcbiAgICBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYyA9IG51bGw7XG4gICAgZGVsZXRlIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9iai5kZWZpbmUpIHtcbiAgICAgICAgY29uc3QgW2RhdGFTbGFzaCwgbmV4dFVybEZyb21dID0gU3BsaXRGaXJzdCgnLycsIHVybEZyb20pO1xuICAgICAgICB1cmxGcm9tID0gbmV4dFVybEZyb207XG5cbiAgICAgICAgY29uc3QgW2Vycm9yLCBuZXdEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YShvYmouZGVmaW5lW25hbWVdLCBkYXRhU2xhc2gsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgaWYoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgXG4gICAgICAgIGRlZmluZU9iamVjdFtuYW1lXSA9IG5ld0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgdmFsaWRhdGVGdW5jKGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycgPyB2YWxpZGF0ZTogJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJ307XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybEZyb207XG59XG4vKipcbiAqIFRoZSBmdW5jdGlvbiB3aWxsIHBhcnNlIHRoZSB1cmwgYW5kIGZpbmQgdGhlIGJlc3QgbWF0Y2ggZm9yIHRoZSB1cmxcbiAqIEBwYXJhbSB7YW55fSBmaWxlTW9kdWxlIC0gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRob2QgdGhhdCB5b3Ugd2FudCB0byBjYWxsLlxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSB0aGUgdXJsIHRoYXQgdGhlIHVzZXIgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSAoKSA9PiBQcm9taXNlPGFueT5cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSwgdGhlIHJlcXVlc3QgaXMgcHJvY2Vzc2VkLiBJZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgZmFsc2UsIHRoZSByZXF1ZXN0IGlzIG5vdCBwcm9jZXNzZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIE1ha2VDYWxsKGZpbGVNb2R1bGU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxsb3dFcnJvckluZm8gPSAhR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpICYmIGlzRGVidWcsIG1ha2VNYXNzYWdlID0gKGU6IGFueSkgPT4gKGlzRGVidWcgPyBwcmludC5lcnJvcihlKSA6IG51bGwpICsgKGFsbG93RXJyb3JJbmZvID8gYCwgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCA6ICcnKTtcbiAgICBjb25zdCBtZXRob2QgPSBSZXF1ZXN0Lm1ldGhvZDtcbiAgICBsZXQgbWV0aG9kT2JqID0gZmlsZU1vZHVsZVttZXRob2RdIHx8IGZpbGVNb2R1bGUuZGVmYXVsdFttZXRob2RdOyAvL0xvYWRpbmcgdGhlIG1vZHVsZSBieSBtZXRob2RcbiAgICBsZXQgaGF2ZU1ldGhvZCA9IHRydWU7XG5cbiAgICBpZighbWV0aG9kT2JqKXtcbiAgICAgICAgaGF2ZU1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBtZXRob2RPYmogPSBmaWxlTW9kdWxlLmRlZmF1bHQgfHwgZmlsZU1vZHVsZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlTWV0aG9kID0gbWV0aG9kT2JqO1xuXG4gICAgY29uc3QgZGVmaW5lT2JqZWN0ID0ge307XG5cbiAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7IC8vIHJvb3QgbGV2ZWwgZGVmaW5pdGlvblxuICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuXG4gICAgbGV0IG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSk7XG5cbiAgICAvL3BhcnNlIHRoZSB1cmwgcGF0aFxuICAgIGZvcihsZXQgaSA9IDA7IGk8IDI7IGkrKyl7XG4gICAgICAgIHdoaWxlICgobmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcbiAgICAgICAgICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICAgICAgICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG4gICAgXG4gICAgICAgICAgICB1cmxGcm9tID0gdHJpbVR5cGUoJy8nLCB1cmxGcm9tLnN1YnN0cmluZyhuZXN0ZWRVUkwubGVuZ3RoKSk7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbmVzdGVkVVJMXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFoYXZlTWV0aG9kKXsgLy8gY2hlY2sgaWYgdGhhdCBhIG1ldGhvZFxuICAgICAgICAgICAgaGF2ZU1ldGhvZCA9IHRydWU7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9iaj8uZnVuYyAmJiBtZXRob2RPYmogfHwgYmFzZU1ldGhvZDsgLy8gaWYgdGhlcmUgaXMgYW4gJ2FueScgbWV0aG9kXG5cblxuICAgIGlmICghbWV0aG9kT2JqPy5mdW5jKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsZWZ0RGF0YSA9IHVybEZyb20uc3BsaXQoJy8nKTtcbiAgICBjb25zdCB1cmxEYXRhID0gW107XG5cblxuICAgIGxldCBlcnJvcjogc3RyaW5nO1xuICAgIGlmIChtZXRob2RPYmoudmFsaWRhdGVVUkwpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHZhbGlkYXRlXSBvZiBPYmplY3QuZW50cmllcyhtZXRob2RPYmoudmFsaWRhdGVVUkwpKSB7XG4gICAgICAgICAgICBjb25zdCBbZXJyb3JVUkwsIHB1c2hEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YSh2YWxpZGF0ZSwgbGVmdERhdGFbaW5kZXhdLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JVUkwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IDxzdHJpbmc+ZXJyb3JVUkw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybERhdGEucHVzaChwdXNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdXJsRGF0YS5wdXNoKC4uLmxlZnREYXRhKTtcblxuICAgIGlmICghZXJyb3IgJiYgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYyhsZWZ0RGF0YSwgUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZTtcbiAgICAgICAgZWxzZSBpZiAoIXZhbGlkYXRlKVxuICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGluZyBVUkwnO1xuICAgIH1cblxuICAgIGlmIChlcnJvcilcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvciB9KTtcblxuICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGxldCBhcGlSZXNwb25zZTogYW55LCBuZXdSZXNwb25zZTogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGFwaVJlc3BvbnNlID0gYXdhaXQgbWV0aG9kT2JqLmZ1bmMoUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEsIGRlZmluZU9iamVjdCwgbGVmdERhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGFsbG93RXJyb3JJbmZvKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiBlLm1lc3NhZ2UgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6ICc1MDAgLSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhcGlSZXNwb25zZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyB0ZXh0OiBhcGlSZXNwb25zZSB9O1xuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSBhcGlSZXNwb25zZTtcblxuICAgIGZpbmFsU3RlcCgpOyAgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgaWYgKG5ld1Jlc3BvbnNlICE9IG51bGwpXG4gICAgICAgIFJlc3BvbnNlLmpzb24obmV3UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5nc30gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIGFzIEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBHZXRGaWxlIGFzIEdldFN0YXRpY0ZpbGUsIHNlcnZlckJ1aWxkIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCAqIGFzIEZ1bmNTY3JpcHQgZnJvbSAnLi9GdW5jdGlvblNjcmlwdCc7XG5pbXBvcnQgTWFrZUFwaUNhbGwgZnJvbSAnLi9BcGlDYWxsJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuY29uc3QgeyBFeHBvcnQgfSA9IEZ1bmNTY3JpcHQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JQYWdlcyB7XG4gICAgbm90Rm91bmQ/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH0sXG4gICAgc2VydmVyRXJyb3I/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH1cbn1cblxuaW50ZXJmYWNlIEdldFBhZ2VzU2V0dGluZ3Mge1xuICAgIENhY2hlRGF5czogbnVtYmVyLFxuICAgIFBhZ2VSYW06IGJvb2xlYW4sXG4gICAgRGV2TW9kZTogYm9vbGVhbixcbiAgICBDb29raWVTZXR0aW5ncz86IGFueSxcbiAgICBDb29raWVzPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgQ29va2llRW5jcnlwdGVyPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgU2Vzc2lvblN0b3JlPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgRXJyb3JQYWdlczogRXJyb3JQYWdlc1xufVxuXG5jb25zdCBTZXR0aW5nczogR2V0UGFnZXNTZXR0aW5ncyA9IHtcbiAgICBDYWNoZURheXM6IDEsXG4gICAgUGFnZVJhbTogZmFsc2UsXG4gICAgRGV2TW9kZTogdHJ1ZSxcbiAgICBFcnJvclBhZ2VzOiB7fVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZVRvUmFtKHVybDogc3RyaW5nKSB7XG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bmNTY3JpcHQuZ2V0RnVsbFBhdGhDb21waWxlKHVybCkpKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdID0gW107XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdID0gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZSh1cmwpO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdLCB1cmwpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZEFsbFBhZ2VzVG9SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHBhZ2VEZXBzLnN0b3JlKSB7XG4gICAgICAgIGlmICghRXh0ZW5zaW9uSW5BcnJheShpLCA8YW55PkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkpKVxuICAgICAgICAgICAgYXdhaXQgTG9hZFBhZ2VUb1JhbShpKTtcblxuICAgIH1cbn1cblxuZnVuY3Rpb24gQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIEV4cG9ydC5QYWdlTG9hZFJhbSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGRlbGV0ZSBFeHBvcnQuUGFnZUxvYWRSYW1baV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBFeHRlbnNpb25JbkFycmF5KGZpbGVQYXRoOiBzdHJpbmcsIC4uLmFycmF5czogc3RyaW5nW10pIHtcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGguc3Vic3RyaW5nKGZpbGVQYXRoLmxlbmd0aCAtIGkubGVuZ3RoIC0gMSkgPT0gJy4nICsgaSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gR2V0RXJyb3JQYWdlKGNvZGU6IG51bWJlciwgTG9jU2V0dGluZ3M6ICdub3RGb3VuZCcgfCAnc2VydmVyRXJyb3InKSB7XG4gICAgbGV0IGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nO1xuICAgIGlmIChTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXSkge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWM7XG4gICAgICAgIHVybCA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLnBhdGg7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5jb2RlID8/IGNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuTG9ncztcbiAgICAgICAgdXJsID0gJ2UnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdXJsLCBhcnJheVR5cGUsIGNvZGUgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGNvZGU6IG51bWJlcikge1xuICAgIC8vZmlyc3Qgc3RlcCAtIHBhcnNlIGluZm9cbiAgICBpZiAoUmVxdWVzdC5tZXRob2QgPT0gXCJQT1NUXCIpIHtcbiAgICAgICAgaWYgKCFSZXF1ZXN0LmJvZHkgfHwgIU9iamVjdC5rZXlzKFJlcXVlc3QuYm9keSkubGVuZ3RoKVxuICAgICAgICAgICAgUmVxdWVzdC5ib2R5ID0gUmVxdWVzdC5maWVsZHMgfHwge307XG5cbiAgICB9IGVsc2VcbiAgICAgICAgUmVxdWVzdC5ib2R5ID0gZmFsc2U7XG5cblxuICAgIGlmIChSZXF1ZXN0LmNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZXMoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZUVuY3J5cHRlcihSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuU2Vzc2lvblN0b3JlKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG5cbiAgICBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgfHwge307XG4gICAgUmVxdWVzdC5maWxlcyA9IFJlcXVlc3QuZmlsZXMgfHwge307XG5cbiAgICBjb25zdCBDb3B5Q29va2llcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzKSk7XG4gICAgUmVxdWVzdC5jb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzO1xuXG4gICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMTtcblxuICAgIC8vc2Vjb25kIHN0ZXBcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAxKVxuICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IGNvZGU7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5zaWduZWRDb29raWVzKSB7Ly91cGRhdGUgY29va2llc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gJ29iamVjdCcgJiYgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9IENvcHlDb29raWVzW2ldIHx8IEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSkgIT0gSlNPTi5zdHJpbmdpZnkoQ29weUNvb2tpZXNbaV0pKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNvb2tpZShpLCBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0sIFNldHRpbmdzLkNvb2tpZVNldHRpbmdzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIENvcHlDb29raWVzKSB7Ly9kZWxldGUgbm90IGV4aXRzIGNvb2tpZXNcbiAgICAgICAgICAgIGlmIChSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jbGVhckNvb2tpZShpKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuXG4vL2ZvciBmaW5hbCBzdGVwXG5mdW5jdGlvbiBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdDogUmVxdWVzdCB8IGFueSkge1xuICAgIGlmICghUmVxdWVzdC5maWxlcykgLy9kZWxldGUgZmlsZXNcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBhcnJQYXRoID0gW11cblxuICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LmZpbGVzKSB7XG5cbiAgICAgICAgY29uc3QgZSA9IFJlcXVlc3QuZmlsZXNbaV07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgaW4gZSkge1xuICAgICAgICAgICAgICAgIGFyclBhdGgucHVzaChlW2FdLmZpbGVwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBhcnJQYXRoLnB1c2goZS5maWxlcGF0aCk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyUGF0aDtcbn1cblxuLy9maW5hbCBzdGVwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVSZXF1ZXN0RmlsZXMoYXJyYXk6IHN0cmluZ1tdKSB7XG4gICAgZm9yKGNvbnN0IGUgaW4gYXJyYXkpXG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNVUkxQYXRoQUZpbGUoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIGNvZGU6IG51bWJlcikge1xuICAgIGxldCBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsyXTtcbiAgICBsZXQgZmlsZSA9IGZhbHNlO1xuXG4gICAgaWYgKGNvZGUgPT0gMjAwKSB7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgdXJsO1xuICAgICAgICAvL2NoZWNrIHRoYXQgaXMgbm90IHNlcnZlciBmaWxlXG4gICAgICAgIGlmIChhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBTZXR0aW5ncy5EZXZNb2RlLCB1cmwpIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIGZpbGUgPSB0cnVlO1xuICAgICAgICBlbHNlICAvLyB0aGVuIGl0IGEgc2VydmVyIHBhZ2Ugb3IgZXJyb3IgcGFnZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZmlsZSwgZnVsbFBhZ2VVcmwgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRMb2FkUGFnZShzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHBhZ2VBcnJheSA9IFthd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHNtYWxsUGF0aCldO1xuXG4gICAgcGFnZUFycmF5WzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UocGFnZUFycmF5WzBdLCBzbWFsbFBhdGgpO1xuXG4gICAgaWYgKFNldHRpbmdzLlBhZ2VSYW0pXG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdID0gcGFnZUFycmF5O1xuXG4gICAgcmV0dXJuIHBhZ2VBcnJheVsxXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRQYWdlVVJMKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgbGV0IGZ1bGxQYWdlVXJsOiBzdHJpbmc7XG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVswXSArIHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuXG4gICAgICAgIHVybCA9IEVycm9yUGFnZS51cmw7XG4gICAgICAgIGFycmF5VHlwZSA9IEVycm9yUGFnZS5hcnJheVR5cGU7XG4gICAgICAgIGNvZGUgPSBFcnJvclBhZ2UuY29kZTtcblxuICAgICAgICBzbWFsbFBhdGggPSBhcnJheVR5cGVbMl0gKyAnLycgKyB1cmw7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gdXJsICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoYXJyYXlUeXBlWzBdICsgZnVsbFBhZ2VVcmwpKVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsxXSArIGZ1bGxQYWdlVXJsICsgJy5janMnO1xuXG4gICAgfSBlbHNlXG4gICAgICAgIGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzFdICsgdXJsICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlICsgJy5janMnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXJyYXlUeXBlLFxuICAgICAgICBmdWxsUGFnZVVybCxcbiAgICAgICAgc21hbGxQYXRoLFxuICAgICAgICBjb2RlLFxuICAgICAgICB1cmxcbiAgICB9XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGxvYWQgdGhlIGR5bmFtaWMgcGFnZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gVGhlIGFycmF5IG9mIHR5cGVzIHRoYXQgdGhlIHBhZ2UgaXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbFBhZ2VVcmwgLSBUaGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNtYWxsUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlIGZpbGUuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFRoZSBzdGF0dXMgY29kZSBvZiB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIFRoZSBEeW5hbWljRnVuYyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byBnZW5lcmF0ZSB0aGUgcGFnZS5cbiAqIFRoZSBjb2RlIGlzIHRoZSBzdGF0dXMgY29kZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBUaGUgZnVsbFBhZ2VVcmwgaXMgdGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGZ1bGxQYWdlVXJsOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBjb25zdCBTZXROZXdVUkwgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gYXdhaXQgQnVpbGRQYWdlVVJMKGFycmF5VHlwZSwgdXJsLCBzbWFsbFBhdGgsIGNvZGUpO1xuICAgICAgICBzbWFsbFBhdGggPSBidWlsZC5zbWFsbFBhdGgsIHVybCA9IGJ1aWxkLnVybCwgY29kZSA9IGJ1aWxkLmNvZGUsIGZ1bGxQYWdlVXJsID0gYnVpbGQuZnVsbFBhZ2VVcmwsIGFycmF5VHlwZSA9IGJ1aWxkLmFycmF5VHlwZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGV0IER5bmFtaWNGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IGFueTtcbiAgICBpZiAoU2V0dGluZ3MuRGV2TW9kZSAmJiBhd2FpdCBTZXROZXdVUkwoKSAmJiBmdWxsUGFnZVVybCkge1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShzbWFsbFBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZSh1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBhcnJheVR5cGUpO1xuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSkge1xuXG4gICAgICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdKSB7XG4gICAgICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVswXSwgc21hbGxQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoU2V0dGluZ3MuUGFnZVJhbSlcbiAgICAgICAgICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV0gPSBEeW5hbWljRnVuYztcblxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cblxuICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0pXG4gICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICBlbHNlIGlmICghU2V0dGluZ3MuUGFnZVJhbSAmJiBhd2FpdCBTZXROZXdVUkwoKSAmJiBmdWxsUGFnZVVybClcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICBlbHNlIHtcbiAgICAgICAgY29kZSA9IFNldHRpbmdzLkVycm9yUGFnZXMubm90Rm91bmQ/LmNvZGUgPz8gNDA0O1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kICYmIEV4cG9ydC5QYWdlTG9hZFJhbVtnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kLnBhdGhdIHx8IEV4cG9ydC5QYWdlTG9hZFJhbVtnZXRUeXBlcy5Mb2dzWzJdICsgJy9lNDA0J107XG5cbiAgICAgICAgaWYgKEVycm9yUGFnZSlcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXJyb3JQYWdlWzFdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgRHluYW1pY0Z1bmMsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGZ1bGxQYWdlVXJsXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBNYWtlUGFnZVJlc3BvbnNlKER5bmFtaWNSZXNwb25zZTogYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aD8uZmlsZSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gUmVzcG9uc2Uub24oJ2ZpbmlzaCcsIHJlcykpO1xuICAgIH0gZWxzZSBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCkge1xuICAgICAgICBSZXNwb25zZS53cml0ZUhlYWQoMzAyLCB7IExvY2F0aW9uOiBEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoIH0pO1xuICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBSZXNQYWdlID0gRHluYW1pY1Jlc3BvbnNlLm91dF9ydW5fc2NyaXB0LnRyaW0oKTtcbiAgICAgICAgaWYgKFJlc1BhZ2UpIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnNlbmQoUmVzUGFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmRlbGV0ZUFmdGVyKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHJlcXVlc3QgaXMgbWFkZSB0byBhIHBhZ2UuIFxuICogSXQgd2lsbCBjaGVjayBpZiB0aGUgcGFnZSBleGlzdHMsIGFuZCBpZiBpdCBkb2VzLCBpdCB3aWxsIHJldHVybiB0aGUgcGFnZS4gXG4gKiBJZiBpdCBkb2VzIG5vdCBleGlzdCwgaXQgd2lsbCByZXR1cm4gYSA0MDQgcGFnZVxuICogQHBhcmFtIHtSZXF1ZXN0IHwgYW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoc1xuICogbG9hZGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIHBhZ2UgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHt7IGZpbGU6IGJvb2xlYW4sIGZ1bGxQYWdlVXJsOiBzdHJpbmcgfX0gRmlsZUluZm8gLSB0aGUgZmlsZSBpbmZvIG9mIHRoZSBwYWdlIHRoYXQgaXMgYmVpbmcgYWN0aXZhdGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBudW1iZXJcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGFmdGVyIHRoZSBkeW5hbWljIHBhZ2VcbiAqIGlzIGxvYWRlZC5cbiAqIEByZXR1cm5zIE5vdGhpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEFjdGl2YXRlUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBGaWxlSW5mbzogYW55LCBjb2RlOiBudW1iZXIsIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgeyBEeW5hbWljRnVuYywgZnVsbFBhZ2VVcmwsIGNvZGU6IG5ld0NvZGUgfSA9IGF3YWl0IEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBGaWxlSW5mby5mdWxsUGFnZVVybCwgRmlsZUluZm8uZnVsbFBhZ2VVcmwgKyAnLycgKyB1cmwsIGNvZGUpO1xuXG4gICAgaWYgKCFmdWxsUGFnZVVybCB8fCAhRHluYW1pY0Z1bmMgJiYgY29kZSA9PSA1MDApXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5zZW5kU3RhdHVzKG5ld0NvZGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuICAgICAgICBjb25zdCBwYWdlRGF0YSA9IGF3YWl0IER5bmFtaWNGdW5jKFJlc3BvbnNlLCBSZXF1ZXN0LCBSZXF1ZXN0LmJvZHksIFJlcXVlc3QucXVlcnksIFJlcXVlc3QuY29va2llcywgUmVxdWVzdC5zZXNzaW9uLCBSZXF1ZXN0LmZpbGVzLCBTZXR0aW5ncy5EZXZNb2RlKTtcbiAgICAgICAgZmluYWxTdGVwKCk7IC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgICAgICBhd2FpdCBNYWtlUGFnZVJlc3BvbnNlKFxuICAgICAgICAgICAgcGFnZURhdGEsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoZSk7XG4gICAgICAgIFJlcXVlc3QuZXJyb3IgPSBlO1xuXG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg1MDAsICdzZXJ2ZXJFcnJvcicpO1xuXG4gICAgICAgIER5bmFtaWNQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRHluYW1pY1BhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55LCB1cmw6IHN0cmluZywgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljLCBjb2RlID0gMjAwKSB7XG4gICAgY29uc3QgRmlsZUluZm8gPSBhd2FpdCBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0LCB1cmwsIGFycmF5VHlwZSwgY29kZSk7XG5cbiAgICBjb25zdCBtYWtlRGVsZXRlQXJyYXkgPSBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdClcblxuICAgIGlmIChGaWxlSW5mby5maWxlKSB7XG4gICAgICAgIFNldHRpbmdzLkNhY2hlRGF5cyAmJiBSZXNwb25zZS5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT1cIiArIChTZXR0aW5ncy5DYWNoZURheXMgKiAyNCAqIDYwICogNjApKTtcbiAgICAgICAgYXdhaXQgR2V0U3RhdGljRmlsZSh1cmwsIFNldHRpbmdzLkRldk1vZGUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0UHJhc2UgPSAoKSA9PiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0LCBSZXNwb25zZSwgY29kZSk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgY29uc3QgaXNBcGkgPSBhd2FpdCBNYWtlQXBpQ2FsbChSZXF1ZXN0LCBSZXNwb25zZSwgdXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBuZXh0UHJhc2UpO1xuICAgIGlmICghaXNBcGkgJiYgIWF3YWl0IEFjdGl2YXRlUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgYXJyYXlUeXBlLCB1cmwsIEZpbGVJbmZvLCBjb2RlLCBuZXh0UHJhc2UpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTsgLy8gZGVsZXRlIGZpbGVzXG59XG5cbmZ1bmN0aW9uIHVybEZpeCh1cmw6IHN0cmluZykge1xuICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmxhc3RJbmRleE9mKCc/JykpIHx8IHVybDtcblxuICAgIGlmICh1cmwgPT0gJy8nKSB7XG4gICAgICAgIHVybCA9ICcvaW5kZXgnO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbn1cblxuZXhwb3J0IHtcbiAgICBTZXR0aW5ncyxcbiAgICBEeW5hbWljUGFnZSxcbiAgICBMb2FkQWxsUGFnZXNUb1JhbSxcbiAgICBDbGVhckFsbFBhZ2VzRnJvbVJhbSxcbiAgICB1cmxGaXgsXG4gICAgR2V0RXJyb3JQYWdlXG59IiwgImltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0ICogYXMgQnVpbGRTZXJ2ZXIgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IGNvb2tpZVBhcnNlciB9IGZyb20gJ0B0aW55aHR0cC9jb29raWUtcGFyc2VyJztcbmltcG9ydCBjb29raWVFbmNyeXB0ZXIgZnJvbSAnY29va2llLWVuY3J5cHRlcic7XG5pbXBvcnQgeyBhbGxvd1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgSW5zZXJ0TW9kZWxzU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IHsgU3RhcnRSZXF1aXJlLCBHZXRTZXR0aW5ncyB9IGZyb20gJy4vSW1wb3J0TW9kdWxlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIFByaW50SWZOZXdTZXR0aW5ncyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBNZW1vcnlTZXNzaW9uIGZyb20gJ21lbW9yeXN0b3JlJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGRlYnVnU2l0ZU1hcCB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TaXRlTWFwJztcbmltcG9ydCB7IHNldHRpbmdzIGFzIGRlZmluZVNldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5cbmNvbnN0XG4gICAgQ29va2llc1NlY3JldCA9IHV1aWR2NCgpLnN1YnN0cmluZygwLCAzMiksXG4gICAgU2Vzc2lvblNlY3JldCA9IHV1aWR2NCgpLFxuICAgIE1lbW9yeVN0b3JlID0gTWVtb3J5U2Vzc2lvbihzZXNzaW9uKSxcblxuICAgIENvb2tpZXNNaWRkbGV3YXJlID0gY29va2llUGFyc2VyKENvb2tpZXNTZWNyZXQpLFxuICAgIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmUgPSBjb29raWVFbmNyeXB0ZXIoQ29va2llc1NlY3JldCwge30pLFxuICAgIENvb2tpZVNldHRpbmdzID0geyBodHRwT25seTogdHJ1ZSwgc2lnbmVkOiB0cnVlLCBtYXhBZ2U6IDg2NDAwMDAwICogMzAgfTtcblxuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZXMgPSA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZUVuY3J5cHRlciA9IDxhbnk+Q29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVTZXR0aW5ncyA9IENvb2tpZVNldHRpbmdzO1xuXG5sZXQgRGV2TW9kZV8gPSB0cnVlLCBjb21waWxhdGlvblNjYW46IFByb21pc2U8KCkgPT4gUHJvbWlzZTx2b2lkPj4sIFNlc3Npb25TdG9yZTtcblxubGV0IGZvcm1pZGFibGVTZXJ2ZXIsIGJvZHlQYXJzZXJTZXJ2ZXI7XG5cbmNvbnN0IHNlcnZlTGltaXRzID0ge1xuICAgIHNlc3Npb25Ub3RhbFJhbU1COiAxNTAsXG4gICAgc2Vzc2lvblRpbWVNaW51dGVzOiA0MCxcbiAgICBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzOiAzMCxcbiAgICBmaWxlTGltaXRNQjogMTAsXG4gICAgcmVxdWVzdExpbWl0TUI6IDRcbn1cblxubGV0IHBhZ2VJblJhbUFjdGl2YXRlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpe1xuICAgIHJldHVybiBwYWdlSW5SYW1BY3RpdmF0ZTtcbn1cblxuY29uc3QgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyA9IFsuLi5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5XTtcbmNvbnN0IGJhc2VWYWxpZFBhdGggPSBbKHBhdGg6IHN0cmluZykgPT4gcGF0aC5zcGxpdCgnLicpLmF0KC0yKSAhPSAnc2VydiddOyAvLyBpZ25vcmluZyBmaWxlcyB0aGF0IGVuZHMgd2l0aCAuc2Vydi4qXG5cbmV4cG9ydCBjb25zdCBFeHBvcnQ6IEV4cG9ydFNldHRpbmdzID0ge1xuICAgIGdldCBzZXR0aW5nc1BhdGgoKSB7XG4gICAgICAgIHJldHVybiB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgXCIvU2V0dGluZ3NcIjtcbiAgICB9LFxuICAgIHNldCBkZXZlbG9wbWVudCh2YWx1ZSkge1xuICAgICAgICBpZihEZXZNb2RlXyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgIERldk1vZGVfID0gdmFsdWU7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uU2NhbiA9IEJ1aWxkU2VydmVyLmNvbXBpbGVBbGwoRXhwb3J0KTtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkRldk1vZGUgPSB2YWx1ZTtcbiAgICAgICAgYWxsb3dQcmludCh2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXQgZGV2ZWxvcG1lbnQoKSB7XG4gICAgICAgIHJldHVybiBEZXZNb2RlXztcbiAgICB9LFxuICAgIG1pZGRsZXdhcmU6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKTogKHJlcTogUmVxdWVzdCwgX3JlczogUmVzcG9uc2U8YW55PiwgbmV4dD86IE5leHRGdW5jdGlvbikgPT4gdm9pZCB7XG4gICAgICAgICAgICByZXR1cm4gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZUVuY3J5cHRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU3RvcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmb3JtaWRhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1pZGFibGVTZXJ2ZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBib2R5UGFyc2VyKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvZHlQYXJzZXJTZXJ2ZXI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlY3JldDoge1xuICAgICAgICBnZXQgY29va2llcygpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzU2VjcmV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU2VjcmV0O1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZ2VuZXJhbDoge1xuICAgICAgICBpbXBvcnRPbkxvYWQ6IFtdLFxuICAgICAgICBzZXQgcGFnZUluUmFtKHZhbHVlKSB7XG4gICAgICAgICAgICBpZihmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSAhPSB2YWx1ZSl7XG4gICAgICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGFzeW5jICgpID0+IChhd2FpdCBjb21waWxhdGlvblNjYW4pPy4oKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlcGFyYXRpb25zID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgICAgICAgICAgICAgIGF3YWl0IHByZXBhcmF0aW9ucz8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlQnlVcmwuTG9hZEFsbFBhZ2VzVG9SYW0oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlQnlVcmwuQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwYWdlSW5SYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBpbGU6IHtcbiAgICAgICAgc2V0IGNvbXBpbGVTeW50YXgodmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXggPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvbXBpbGVTeW50YXgoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGlnbm9yZUVycm9yKHZhbHVlKSB7XG4gICAgICAgICAgICAoPGFueT5QcmludElmTmV3U2V0dGluZ3MpLlByZXZlbnRFcnJvcnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlnbm9yZUVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuICg8YW55PlByaW50SWZOZXdTZXR0aW5ncykuUHJldmVudEVycm9ycztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHBsdWdpbnModmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwbHVnaW5zKCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBkZWZpbmUoKXtcbiAgICAgICAgICAgIHJldHVybiBkZWZpbmVTZXR0aW5ncy5kZWZpbmVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGRlZmluZSh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lU2V0dGluZ3MuZGVmaW5lID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmc6IHtcbiAgICAgICAgcnVsZXM6IHt9LFxuICAgICAgICB1cmxTdG9wOiBbXSxcbiAgICAgICAgdmFsaWRQYXRoOiBiYXNlVmFsaWRQYXRoLFxuICAgICAgICBpZ25vcmVUeXBlczogYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyxcbiAgICAgICAgaWdub3JlUGF0aHM6IFtdLFxuICAgICAgICBzaXRlbWFwOiB0cnVlLFxuICAgICAgICBnZXQgZXJyb3JQYWdlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGVycm9yUGFnZXModmFsdWUpIHtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlTGltaXRzOiB7XG4gICAgICAgIGdldCBjYWNoZURheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY2FjaGVEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZXNFeHBpcmVzRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZVNldHRpbmdzLm1heEFnZSAvIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY29va2llc0V4cGlyZXNEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIENvb2tpZVNldHRpbmdzLm1heEFnZSA9IHZhbHVlICogODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVG90YWxSYW1NQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVG90YWxSYW1NQigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRpbWVNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVGltZU1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBmaWxlTGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZpbGVMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcmVxdWVzdExpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgICAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHJlcXVlc3RMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZToge1xuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBodHRwMjogZmFsc2UsXG4gICAgICAgIGdyZWVuTG9jazoge1xuICAgICAgICAgICAgc3RhZ2luZzogbnVsbCxcbiAgICAgICAgICAgIGNsdXN0ZXI6IG51bGwsXG4gICAgICAgICAgICBlbWFpbDogbnVsbCxcbiAgICAgICAgICAgIGFnZW50OiBudWxsLFxuICAgICAgICAgICAgYWdyZWVUb1Rlcm1zOiBmYWxzZSxcbiAgICAgICAgICAgIHNpdGVzOiBbXVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtaWRhYmxlKCkge1xuICAgIGZvcm1pZGFibGVTZXJ2ZXIgPSB7XG4gICAgICAgIG1heEZpbGVTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgKiAxMDQ4NTc2LFxuICAgICAgICB1cGxvYWREaXI6IFN5c3RlbURhdGEgKyBcIi9VcGxvYWRGaWxlcy9cIixcbiAgICAgICAgbXVsdGlwbGVzOiB0cnVlLFxuICAgICAgICBtYXhGaWVsZHNTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKiAxMDQ4NTc2XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQm9keVBhcnNlcigpIHtcbiAgICBib2R5UGFyc2VyU2VydmVyID0gKDxhbnk+Ym9keVBhcnNlcikuanNvbih7IGxpbWl0OiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKyAnbWInIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNlc3Npb24oKSB7XG4gICAgaWYgKCFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzIHx8ICFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIpIHtcbiAgICAgICAgU2Vzc2lvblN0b3JlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBTZXNzaW9uU3RvcmUgPSBzZXNzaW9uKHtcbiAgICAgICAgY29va2llOiB7IG1heEFnZTogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyAqIDYwICogMTAwMCwgc2FtZVNpdGU6IHRydWUgfSxcbiAgICAgICAgc2VjcmV0OiBTZXNzaW9uU2VjcmV0LFxuICAgICAgICByZXNhdmU6IGZhbHNlLFxuICAgICAgICBzYXZlVW5pbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgIHN0b3JlOiBuZXcgTWVtb3J5U3RvcmUoe1xuICAgICAgICAgICAgY2hlY2tQZXJpb2Q6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgbWF4OiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgKiAxMDQ4NTc2XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvcHlKU09OKHRvOiBhbnksIGpzb246IGFueSwgcnVsZXM6IHN0cmluZ1tdID0gW10sIHJ1bGVzVHlwZTogJ2lnbm9yZScgfCAnb25seScgPSAnaWdub3JlJykge1xuICAgIGlmKCFqc29uKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IGhhc0ltcGxlYXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgaSBpbiBqc29uKSB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGUgPSBydWxlcy5pbmNsdWRlcyhpKTtcbiAgICAgICAgaWYgKHJ1bGVzVHlwZSA9PSAnb25seScgJiYgaW5jbHVkZSB8fCBydWxlc1R5cGUgPT0gJ2lnbm9yZScgJiYgIWluY2x1ZGUpIHtcbiAgICAgICAgICAgIGhhc0ltcGxlYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0b1tpXSA9IGpzb25baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0ltcGxlYXRlZDtcbn1cblxuLy8gcmVhZCB0aGUgc2V0dGluZ3Mgb2YgdGhlIHdlYnNpdGVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlU2V0dGluZ3MoKSB7XG4gICAgY29uc3QgU2V0dGluZ3M6IEV4cG9ydFNldHRpbmdzID0gYXdhaXQgR2V0U2V0dGluZ3MoRXhwb3J0LnNldHRpbmdzUGF0aCwgRGV2TW9kZV8pO1xuICAgIGlmKFNldHRpbmdzID09IG51bGwpIHJldHVybjtcblxuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudClcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbERldik7XG5cbiAgICBlbHNlXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxQcm9kKTtcblxuXG4gICAgY29weUpTT04oRXhwb3J0LmNvbXBpbGUsIFNldHRpbmdzLmNvbXBpbGUpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnJvdXRpbmcsIFNldHRpbmdzLnJvdXRpbmcsIFsnaWdub3JlVHlwZXMnLCAndmFsaWRQYXRoJ10pO1xuXG4gICAgLy9jb25jYXQgZGVmYXVsdCB2YWx1ZXMgb2Ygcm91dGluZ1xuICAgIGNvbnN0IGNvbmNhdEFycmF5ID0gKG5hbWU6IHN0cmluZywgYXJyYXk6IGFueVtdKSA9PiBTZXR0aW5ncy5yb3V0aW5nPy5bbmFtZV0gJiYgKEV4cG9ydC5yb3V0aW5nW25hbWVdID0gU2V0dGluZ3Mucm91dGluZ1tuYW1lXS5jb25jYXQoYXJyYXkpKTtcblxuICAgIGNvbmNhdEFycmF5KCdpZ25vcmVUeXBlcycsIGJhc2VSb3V0aW5nSWdub3JlVHlwZXMpO1xuICAgIGNvbmNhdEFycmF5KCd2YWxpZFBhdGgnLCBiYXNlVmFsaWRQYXRoKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnY2FjaGVEYXlzJywgJ2Nvb2tpZXNFeHBpcmVzRGF5cyddLCAnb25seScpO1xuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydzZXNzaW9uVG90YWxSYW1NQicsICdzZXNzaW9uVGltZU1pbnV0ZXMnLCAnc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnZmlsZUxpbWl0TUInLCAncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG4gICAgfVxuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlLCBTZXR0aW5ncy5zZXJ2ZSk7XG5cbiAgICAvKiAtLS0gcHJvYmxlbWF0aWMgdXBkYXRlcyAtLS0gKi9cbiAgICBFeHBvcnQuZGV2ZWxvcG1lbnQgPSBTZXR0aW5ncy5kZXZlbG9wbWVudFxuXG4gICAgaWYgKFNldHRpbmdzLmdlbmVyYWw/LmltcG9ydE9uTG9hZCkge1xuICAgICAgICBFeHBvcnQuZ2VuZXJhbC5pbXBvcnRPbkxvYWQgPSA8YW55PmF3YWl0IFN0YXJ0UmVxdWlyZSg8YW55PlNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkLCBEZXZNb2RlXyk7XG4gICAgfVxuXG4gICAgLy9uZWVkIHRvIGRvd24gbGFzdGVkIHNvIGl0IHdvbid0IGludGVyZmVyZSB3aXRoICdpbXBvcnRPbkxvYWQnXG4gICAgaWYgKCFjb3B5SlNPTihFeHBvcnQuZ2VuZXJhbCwgU2V0dGluZ3MuZ2VuZXJhbCwgWydwYWdlSW5SYW0nXSwgJ29ubHknKSAmJiBTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICB9XG5cbiAgICBpZihFeHBvcnQuZGV2ZWxvcG1lbnQgJiYgRXhwb3J0LnJvdXRpbmcuc2l0ZW1hcCl7IC8vIG9uIHByb2R1Y3Rpb24gdGhpcyB3aWxsIGJlIGNoZWNrZWQgYWZ0ZXIgY3JlYXRpbmcgc3RhdGVcbiAgICAgICAgZGVidWdTaXRlTWFwKEV4cG9ydCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGaXJzdExvYWQoKSB7XG4gICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgYnVpbGRCb2R5UGFyc2VyKCk7XG59IiwgImltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHAyIGZyb20gJ2h0dHAyJztcbmltcG9ydCAqIGFzIGNyZWF0ZUNlcnQgZnJvbSAnc2VsZnNpZ25lZCc7XG5pbXBvcnQgKiBhcyBHcmVlbmxvY2sgZnJvbSAnZ3JlZW5sb2NrLWV4cHJlc3MnO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3N9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEZWxldGVJbkRpcmVjdG9yeSwgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEdyZWVuTG9ja1NpdGUgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuXG4vKipcbiAqIElmIHRoZSBmb2xkZXIgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNcbiAqIGV4aXN0LCB1cGRhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZm9sZGVyIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSBDcmVhdGVJbk5vdEV4aXRzIC0ge1xuICovXG5hc3luYyBmdW5jdGlvbiBUb3VjaFN5c3RlbUZvbGRlcihmb05hbWU6IHN0cmluZywgQ3JlYXRlSW5Ob3RFeGl0czoge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgZXhpdHM/OiBhbnl9KSB7XG4gICAgbGV0IHNhdmVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArIFwiL1N5c3RlbVNhdmUvXCI7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBzYXZlUGF0aCArPSBmb05hbWU7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBpZiAoQ3JlYXRlSW5Ob3RFeGl0cykge1xuICAgICAgICBzYXZlUGF0aCArPSAnLyc7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gc2F2ZVBhdGggKyBDcmVhdGVJbk5vdEV4aXRzLm5hbWU7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIENyZWF0ZUluTm90RXhpdHMudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKENyZWF0ZUluTm90RXhpdHMuZXhpdHMpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIGF3YWl0IENyZWF0ZUluTm90RXhpdHMuZXhpdHMoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpLCBmaWxlUGF0aCwgc2F2ZVBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBJdCBnZW5lcmF0ZXMgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBhbmQgc3RvcmVzIGl0IGluIGEgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSBjZXJ0aWZpY2F0ZSBhbmQga2V5IGFyZSBiZWluZyByZXR1cm5lZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RGVtb0NlcnRpZmljYXRlKCkge1xuICAgIGxldCBDZXJ0aWZpY2F0ZTogYW55O1xuICAgIGNvbnN0IENlcnRpZmljYXRlUGF0aCA9IFN5c3RlbURhdGEgKyAnL0NlcnRpZmljYXRlLmpzb24nO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKENlcnRpZmljYXRlUGF0aCkpIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBFYXN5RnMucmVhZEpzb25GaWxlKENlcnRpZmljYXRlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgY3JlYXRlQ2VydC5nZW5lcmF0ZShudWxsLCB7IGRheXM6IDM2NTAwIH0sIChlcnIsIGtleXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlzLnByaXZhdGUsXG4gICAgICAgICAgICAgICAgICAgIGNlcnQ6IGtleXMuY2VydFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKENlcnRpZmljYXRlUGF0aCwgQ2VydGlmaWNhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gQ2VydGlmaWNhdGU7XG59XG5cbmZ1bmN0aW9uIERlZmF1bHRMaXN0ZW4oYXBwKSB7XG4gICAgY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwLmF0dGFjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VydmVyLFxuICAgICAgICBsaXN0ZW4ocG9ydDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIDxhbnk+cmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZSgpIHtcbiAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgZ3JlZW5sb2NrLCBpdCB3aWxsIGNyZWF0ZSBhIHNlcnZlciB0aGF0IHdpbGwgc2VydmUgeW91ciBhcHAgb3ZlciBodHRwc1xuICogQHBhcmFtIGFwcCAtIFRoZSB0aW55SHR0cCBhcHBsaWNhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0aGUgc2VydmVyIG1ldGhvZHNcbiAqL1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gVXBkYXRlR3JlZW5Mb2NrKGFwcCkge1xuXG4gICAgaWYgKCEoU2V0dGluZ3Muc2VydmUuaHR0cDIgfHwgU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrPy5hZ3JlZVRvVGVybXMpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBEZWZhdWx0TGlzdGVuKGFwcCk7XG4gICAgfVxuXG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdyZWVUb1Rlcm1zKSB7XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGh0dHAyLmNyZWF0ZVNlY3VyZVNlcnZlcih7IC4uLmF3YWl0IEdldERlbW9DZXJ0aWZpY2F0ZSgpLCBhbGxvd0hUVFAxOiB0cnVlIH0sIGFwcC5hdHRhY2gpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4ocG9ydCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IFRvdWNoU3lzdGVtRm9sZGVyKFwiZ3JlZW5sb2NrXCIsIHtcbiAgICAgICAgbmFtZTogXCJjb25maWcuanNvblwiLCB2YWx1ZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc2l0ZXM6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlc1xuICAgICAgICB9KSxcbiAgICAgICAgYXN5bmMgZXhpdHMoZmlsZSwgXywgZm9sZGVyKSB7XG4gICAgICAgICAgICBmaWxlID0gSlNPTi5wYXJzZShmaWxlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBmaWxlLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IGZpbGUuc2l0ZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGhhdmU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIDxHcmVlbkxvY2tTaXRlW10+IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5zdWJqZWN0ID09IGUuc3ViamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGF2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5hbHRuYW1lcy5sZW5ndGggIT0gZS5hbHRuYW1lcy5sZW5ndGggfHwgYi5hbHRuYW1lcy5zb21lKHYgPT4gZS5hbHRuYW1lcy5pbmNsdWRlcyh2KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmFsdG5hbWVzID0gYi5hbHRuYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZS5yZW5ld0F0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFoYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGUuc2l0ZXMuc3BsaWNlKGksIGkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gZm9sZGVyICsgXCJsaXZlL1wiICsgZS5zdWJqZWN0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbmV3U2l0ZXMgPSBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMuZmlsdGVyKCh4KSA9PiAhZmlsZS5zaXRlcy5maW5kKGIgPT4gYi5zdWJqZWN0ID09IHguc3ViamVjdCkpO1xuXG4gICAgICAgICAgICBmaWxlLnNpdGVzLnB1c2goLi4ubmV3U2l0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh3b3JraW5nRGlyZWN0b3J5ICsgXCJwYWNrYWdlLmpzb25cIik7XG5cbiAgICBjb25zdCBncmVlbmxvY2tPYmplY3Q6YW55ID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IEdyZWVubG9jay5pbml0KHtcbiAgICAgICAgcGFja2FnZVJvb3Q6IHdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGNvbmZpZ0RpcjogXCJTeXN0ZW1TYXZlL2dyZWVubG9ja1wiLFxuICAgICAgICBwYWNrYWdlQWdlbnQ6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ2VudCB8fCBwYWNrYWdlSW5mby5uYW1lICsgJy8nICsgcGFja2FnZUluZm8udmVyc2lvbixcbiAgICAgICAgbWFpbnRhaW5lckVtYWlsOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suZW1haWwsXG4gICAgICAgIGNsdXN0ZXI6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5jbHVzdGVyLFxuICAgICAgICBzdGFnaW5nOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc3RhZ2luZ1xuICAgIH0pLnJlYWR5KHJlcykpO1xuXG4gICAgZnVuY3Rpb24gQ3JlYXRlU2VydmVyKHR5cGUsIGZ1bmMsIG9wdGlvbnM/KSB7XG4gICAgICAgIGxldCBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGdyZWVubG9ja09iamVjdFt0eXBlXShvcHRpb25zLCBmdW5jKTtcbiAgICAgICAgY29uc3QgbGlzdGVuID0gKHBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3QuaHR0cFNlcnZlcigpO1xuICAgICAgICAgICAgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4gaHR0cFNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtuZXcgUHJvbWlzZShyZXMgPT4gc2VydmVyLmxpc3Rlbig0NDMsIFwiMC4wLjAuMFwiLCByZXMpKSwgbmV3IFByb21pc2UocmVzID0+IGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsIFwiMC4wLjAuMFwiLCByZXMpKV0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgc2VydmVyLmNsb3NlKCk7IENsb3NlaHR0cFNlcnZlcigpOyB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuLFxuICAgICAgICAgICAgY2xvc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwMlNlcnZlcicsIGFwcC5hdHRhY2gsIHsgYWxsb3dIVFRQMTogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwc1NlcnZlcicsIGFwcC5hdHRhY2gpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgaW5pdFNxbEpzLCB7IERhdGFiYXNlIH0gZnJvbSAnc3FsLmpzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbFNxbCB7XG4gICAgcHVibGljIGRiOiBEYXRhYmFzZTtcbiAgICBwdWJsaWMgc2F2ZVBhdGg6IHN0cmluZztcbiAgICBwdWJsaWMgaGFkQ2hhbmdlID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHNhdmVQYXRoPzogc3RyaW5nLCBjaGVja0ludGVydmFsTWludXRlcyA9IDEwKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBzYXZlUGF0aCA/PyB3b3JraW5nRGlyZWN0b3J5ICsgXCJTeXN0ZW1TYXZlL0RhdGFCYXNlLmRiXCI7XG4gICAgICAgIHRoaXMudXBkYXRlTG9jYWxGaWxlID0gdGhpcy51cGRhdGVMb2NhbEZpbGUuYmluZCh0aGlzKTtcbiAgICAgICAgc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVMb2NhbEZpbGUsIDEwMDAgKiA2MCAqIGNoZWNrSW50ZXJ2YWxNaW51dGVzKTtcbiAgICAgICAgcHJvY2Vzcy5vbignU0lHSU5UJywgdGhpcy51cGRhdGVMb2NhbEZpbGUpXG4gICAgICAgIHByb2Nlc3Mub24oJ2V4aXQnLCB0aGlzLnVwZGF0ZUxvY2FsRmlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RMb2FkZWQoKXtcbiAgICAgICAgaWYoIXRoaXMubG9hZGVkKXtcbiAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2RuLW5vdC1sb2FkZWQnLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRhQmFzZSBpcyBub3QgbG9hZGVkLCBwbGVhc2UgdXNlIFxcJ2F3YWl0IGRiLmxvYWQoKVxcJycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKCkge1xuICAgICAgICBjb25zdCBub3RFeGl0cyA9IGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHBhdGguZGlybmFtZSh0aGlzLnNhdmVQYXRoKSk7XG4gICAgICAgIGNvbnN0IFNRTCA9IGF3YWl0IGluaXRTcWxKcygpO1xuXG4gICAgICAgIGxldCByZWFkRGF0YTogQnVmZmVyO1xuICAgICAgICBpZiAoIW5vdEV4aXRzICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuc2F2ZVBhdGgpKVxuICAgICAgICAgICAgcmVhZERhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCwgJ2JpbmFyeScpO1xuICAgICAgICB0aGlzLmRiID0gbmV3IFNRTC5EYXRhYmFzZShyZWFkRGF0YSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVMb2NhbEZpbGUoKXtcbiAgICAgICAgaWYoIXRoaXMuaGFkQ2hhbmdlKSByZXR1cm47XG4gICAgICAgIHRoaXMuaGFkQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgIEVhc3lGcy53cml0ZUZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5kYi5leHBvcnQoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZFF1ZXJ5VGVtcGxhdGUoYXJyOiBzdHJpbmdbXSwgcGFyYW1zOiBhbnlbXSkge1xuICAgICAgICBsZXQgcXVlcnkgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHBhcmFtcykge1xuICAgICAgICAgICAgcXVlcnkgKz0gYXJyW2ldICsgJz8nO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVlcnkgKz0gYXJyLmF0KC0xKTtcblxuICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgfVxuXG4gICAgaW5zZXJ0KHF1ZXJ5QXJyYXk6IHN0cmluZ1tdLCAuLi52YWx1ZXNBcnJheTogYW55W10pIHtcbiAgICAgICAgaWYodGhpcy5ub3RMb2FkZWQoKSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5kYi5wcmVwYXJlKHRoaXMuYnVpbGRRdWVyeVRlbXBsYXRlKHF1ZXJ5QXJyYXksIHZhbHVlc0FycmF5KSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHF1ZXJ5LmdldCh2YWx1ZXNBcnJheSlbMF07XG4gICAgICAgICAgICB0aGlzLmhhZENoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICBxdWVyeS5mcmVlKCk7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFmZmVjdGVkKHF1ZXJ5QXJyYXk6IHN0cmluZ1tdLCAuLi52YWx1ZXNBcnJheTogYW55W10pIHtcbiAgICAgICAgaWYodGhpcy5ub3RMb2FkZWQoKSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5kYi5wcmVwYXJlKHRoaXMuYnVpbGRRdWVyeVRlbXBsYXRlKHF1ZXJ5QXJyYXksIHZhbHVlc0FycmF5KSk7XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgIHF1ZXJ5LnJ1bih2YWx1ZXNBcnJheSlcbiAgICAgICAgICAgICBjb25zdCBlZmZlY3RlZCA9IHRoaXMuZGIuZ2V0Um93c01vZGlmaWVkKClcbiAgICAgICAgICAgICB0aGlzLmhhZENoYW5nZSB8fD0gZWZmZWN0ZWQgPiAwO1xuICAgICAgICAgICAgIHF1ZXJ5LmZyZWUoKTtcbiAgICAgICAgICAgICByZXR1cm4gZWZmZWN0ZWQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdChxdWVyeUFycmF5OiBzdHJpbmdbXSwgLi4udmFsdWVzQXJyYXk6IGFueVtdKSB7XG4gICAgICAgIGlmKHRoaXMubm90TG9hZGVkKCkpIHJldHVyblxuICAgICAgICBjb25zdCBxdWVyeSA9IHRoaXMuYnVpbGRRdWVyeVRlbXBsYXRlKHF1ZXJ5QXJyYXksIHZhbHVlc0FycmF5KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRiLmV4ZWMocXVlcnkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RPbmUocXVlcnlBcnJheTogc3RyaW5nW10sIC4uLnZhbHVlc0FycmF5OiBhbnlbXSkge1xuICAgICAgICBpZih0aGlzLm5vdExvYWRlZCgpKSByZXR1cm5cbiAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLmRiLnByZXBhcmUodGhpcy5idWlsZFF1ZXJ5VGVtcGxhdGUocXVlcnlBcnJheSwgdmFsdWVzQXJyYXkpKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHF1ZXJ5LnN0ZXAoKTtcbiAgICAgICAgICAgIGNvbnN0IG9uZSA9IHF1ZXJ5LmdldEFzT2JqZWN0KCk7XG4gICAgICAgICAgICBxdWVyeS5mcmVlKCk7XG4gICAgICAgICAgICByZXR1cm4gb25lO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IExvY2FsU3FsIGZyb20gJy4vbG9jYWxTcWwnXG5pbXBvcnQge3ByaW50fSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJ1xuXG4oPGFueT5nbG9iYWwpLkxvY2FsU3FsID0gTG9jYWxTcWw7XG4oPGFueT5nbG9iYWwpLmR1bXAgPSBwcmludDtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGxldCBMb2NhbFNxbDogTG9jYWxTcWxcbiAgICBsZXQgZHVtcDogdHlwZW9mIGNvbnNvbGVcbn1cblxuZXhwb3J0IHtMb2NhbFNxbCwgcHJpbnQgYXMgZHVtcH07IiwgImltcG9ydCBzZXJ2ZXIsIHtTZXR0aW5nc30gIGZyb20gJy4vTWFpbkJ1aWxkL1NlcnZlcic7XG5pbXBvcnQge0xvY2FsU3FsLCBkdW1wfSBmcm9tICcuL0J1aWxkSW5GdW5jL0luZGV4JztcbmltcG9ydCBhc3luY1JlcXVpcmUgZnJvbSAnLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHtnZXRUeXBlc30gZnJvbSAnLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5leHBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vTWFpbkJ1aWxkL1R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEFzeW5jSW1wb3J0ID0gKHBhdGg6c3RyaW5nLCBpbXBvcnRGcm9tID0gJ2FzeW5jIGltcG9ydCcpID0+IGFzeW5jUmVxdWlyZShpbXBvcnRGcm9tLCBwYXRoLCBnZXRUeXBlcy5TdGF0aWMsIFNldHRpbmdzLmRldmVsb3BtZW50KTtcbmV4cG9ydCBjb25zdCBTZXJ2ZXIgPSBzZXJ2ZXI7XG5leHBvcnQge1NldHRpbmdzLCBMb2NhbFNxbCwgZHVtcH07Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTs7O0FDRkE7OztBQ0FBLElBQUksWUFBWTtBQUVULG9CQUFvQixHQUFZO0FBQ25DLGNBQVk7QUFDaEI7QUFFTyxJQUFNLFFBQVEsSUFBSSxNQUFNLFNBQVE7QUFBQSxFQUNuQyxJQUFJLFFBQVEsTUFBTSxVQUFV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
