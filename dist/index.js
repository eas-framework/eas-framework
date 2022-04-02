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
    if (prop == "important")
      return target.error;
    if (printMode && prop != "do-nothing")
      return target[prop];
    return () => {
    };
  }
});

// src/OutputInput/EasyFs.ts
import path from "path";
function exists(path22) {
  return new Promise((res) => {
    fs.stat(path22, (err, stat2) => {
      res(Boolean(stat2));
    });
  });
}
function stat(path22, filed, ignoreError, defaultValue = {}) {
  return new Promise((res) => {
    fs.stat(path22, (err, stat2) => {
      if (err && !ignoreError) {
        print.error(err);
      }
      res(filed && stat2 ? stat2[filed] : stat2 || defaultValue);
    });
  });
}
async function existsFile(path22, ifTrueReturn = true) {
  return (await stat(path22, void 0, true)).isFile?.() && ifTrueReturn;
}
function mkdir(path22) {
  return new Promise((res) => {
    fs.mkdir(path22, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function rmdir(path22) {
  return new Promise((res) => {
    fs.rmdir(path22, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function unlink(path22) {
  return new Promise((res) => {
    fs.unlink(path22, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function unlinkIfExists(path22) {
  if (await exists(path22)) {
    return await unlink(path22);
  }
  return false;
}
function readdir(path22, options = {}) {
  return new Promise((res) => {
    fs.readdir(path22, options, (err, files) => {
      if (err) {
        print.error(err);
      }
      res(files || []);
    });
  });
}
async function mkdirIfNotExists(path22) {
  if (!await exists(path22))
    return await mkdir(path22);
  return false;
}
function writeFile(path22, content) {
  return new Promise((res) => {
    fs.writeFile(path22, content, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function writeJsonFile(path22, content) {
  try {
    return await writeFile(path22, JSON.stringify(content));
  } catch (err) {
    print.error(err);
  }
  return false;
}
function readFile(path22, encoding = "utf8") {
  return new Promise((res) => {
    fs.readFile(path22, encoding, (err, data) => {
      if (err) {
        print.error(err);
      }
      res(data || "");
    });
  });
}
async function readJsonFile(path22, encoding) {
  try {
    return JSON.parse(await readFile(path22, encoding));
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

// src/RunTimeBuild/SearchFileSystem.ts
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
async function DeleteInDirectory(path22) {
  const allInFolder = await EasyFs_default.readdir(path22, { withFileTypes: true });
  for (const i of allInFolder) {
    const n = i.name;
    if (i.isDirectory()) {
      const dir = path22 + n + "/";
      await DeleteInDirectory(dir);
      await EasyFs_default.rmdir(dir);
    } else {
      await EasyFs_default.unlink(path22 + n);
    }
  }
}
function smallPathToPage(smallPath2) {
  return CutTheLast(".", SplitFirst("/", smallPath2).pop());
}

// src/CompileCode/XMLHelpers/CodeInfoAndDebug.ts
import path4 from "path";

// src/EasyDebug/SourceMapStore.ts
import { SourceMapGenerator as SourceMapGenerator2, SourceMapConsumer as SourceMapConsumer2 } from "source-map";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// src/EasyDebug/SourceMap.ts
import { SourceMapConsumer, SourceMapGenerator } from "source-map";
function toURLComment(map, isCss) {
  let mapString = `sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(map.toString()).toString("base64")}`;
  if (isCss)
    mapString = `/*# ${mapString}*/`;
  else
    mapString = "//# " + mapString;
  return "\r\n" + mapString;
}
async function MergeSourceMap(generatedMap, originalMap) {
  const original = await new SourceMapConsumer(originalMap);
  const newMap = new SourceMapGenerator();
  (await new SourceMapConsumer(generatedMap)).eachMapping((m) => {
    const location = original.originalPositionFor({ line: m.originalLine, column: m.originalColumn });
    if (!location.source)
      return;
    newMap.addMapping({
      generated: {
        column: m.generatedColumn,
        line: m.generatedLine
      },
      original: {
        column: location.column,
        line: location.line
      },
      source: location.source
    });
  });
  return newMap;
}

// src/EasyDebug/SourceMapStore.ts
var SourceMapBasic = class {
  constructor(filePath, httpSource = true, relative2 = false, isCss = false) {
    this.filePath = filePath;
    this.httpSource = httpSource;
    this.relative = relative2;
    this.isCss = isCss;
    this.lineCount = 0;
    this.map = new SourceMapGenerator2({
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
    return toURLComment(this.map, this.isCss);
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
  addSourceMapWithStringTracker(fromMap, track, text) {
    this.actionLoad.push({ name: "addSourceMapWithStringTracker", data: [fromMap, track, text] });
  }
  async _addSourceMapWithStringTracker(fromMap, track, text) {
    if (!this.debug)
      return this._addText(text);
    (await new SourceMapConsumer2(fromMap)).eachMapping((m) => {
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
  async buildAll() {
    for (const { name: name2, data } of this.actionLoad) {
      switch (name2) {
        case "addStringTracker":
          this._addStringTracker(...data);
          break;
        case "addText":
          this._addText(...data);
          break;
        case "addSourceMapWithStringTracker":
          await this._addSourceMapWithStringTracker(...data);
          break;
      }
    }
  }
  mapAsURLComment() {
    this.buildAll();
    return super.mapAsURLComment();
  }
  async createDataWithMap() {
    await this.buildAll();
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
    this.DataArray = this.DataArray.concat(data.DataArray);
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
  AddTextAfterNoTrack(text, info = "") {
    for (const char of text) {
      this.DataArray.push({
        text: char,
        info,
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
  AddTextBeforeNoTrack(text, info = "") {
    const copy = [];
    for (const char of text) {
      copy.push({
        text: char,
        info,
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
    newString.DataArray = newString.DataArray.concat(this.DataArray.slice(start, end));
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
    let thisSubstring = this.Clone();
    while ((limit == null || counter < limit) && hasMath?.[0]?.length) {
      const length = [...hasMath[0]].length, index = thisSubstring.charLength(hasMath.index);
      allSplit.push({
        index: index + addNext,
        length
      });
      mainText = mainText.slice(hasMath.index + hasMath[0].length);
      thisSubstring = thisSubstring.CutString(index + length);
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
  debugLine({ message, text, location, line, col }) {
    let searchLine = this.getLine(line ?? location?.line ?? 1), column = col ?? location?.column ?? 0;
    if (searchLine.startsWith("//")) {
      searchLine = this.getLine((line ?? location?.line) - 1);
      column = 0;
    }
    const data = searchLine.at(column - 1).DefaultInfoText;
    return `${text || message}, on file ->
${BasicSettings.fullWebSitePath + searchLine.extractInfo()}:${data.line}:${data.char}${location?.lineText ? '\nLine: "' + location.lineText.trim() + '"' : ""}`;
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
  constructor(text, path22, start = "<%", end = "%>", type = "script") {
    this.start = start;
    this.text = text;
    this.end = end;
    this.type = type;
    this.path = path22;
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
      if (i.eq.trim().length)
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
    return text.replace(/\\/gi, "\\\\").replace(/`/gi, "\\`").replace(/\u0024/gi, "\\u0024");
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
    return `<p style="color:red;text-align:left;font-size:16px;">${JSParser.fixText(message)}</p>`;
  }
  static async RunAndExport(text, path22, isDebug) {
    const parser = new JSParser(text, path22);
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
};
var EnableGlobalReplace = class {
  constructor(addText = "") {
    this.addText = addText;
    this.savedBuildData = [];
    this.replacer = RegExp(`${addText}\\/\\*!system--<\\|ejs\\|([0-9])\\|>\\*\\/|system--<\\|ejs\\|([0-9])\\|>`);
  }
  async load(code, path22) {
    this.buildCode = new ReBuildCodeString(await ParseTextStream(await this.ExtractAndSaveCode(code)));
    this.path = path22;
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
async function ParseTextCode(code, path22) {
  const parser = new JSParser(code, path22, "<#{debug}", "{debug}#>", "debug info");
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
async function ParseScriptCode(code, path22) {
  const parser = new JSParser(code, path22, "<#{debug}", "{debug}#>", "debug info");
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
async function ParseDebugLine(code, path22) {
  const parser = new JSParser(code, path22);
  await parser.findScripts();
  for (const i of parser.values) {
    if (i.type == "text") {
      i.text = await ParseTextCode(i.text, path22);
    } else {
      i.text = await ParseScriptCode(i.text, path22);
    }
  }
  parser.start = "<%";
  parser.end = "%>";
  return parser.ReBuildText();
}
async function ParseDebugInfo(code, path22) {
  return await ParseScriptCode(code, path22);
}
async function AddDebugInfo(isolate2, pageName, FullPath2, SmallPath, cache = {}) {
  if (!cache.value)
    cache.value = await EasyFs_default.readFile(FullPath2, "utf8");
  return {
    allData: new StringTracker(`${pageName}<line>${SmallPath}`, isolate2 ? `<%{%>${cache.value}<%}%>` : cache.value),
    stringInfo: `<%!
run_script_name=\`${JSParser.fixText(pageName + " -> " + SmallPath)}\`;%>`
  };
}
function CreateFilePathOnePath(filePath, inputPath, folder, pageType, pathType = 0) {
  if (pageType && !inputPath.endsWith("." + pageType)) {
    inputPath = `${inputPath}.${pageType}`;
  }
  if (inputPath[0] == "^") {
    const [packageName2, inPath] = SplitFirst("/", inputPath.substring(1));
    return (pathType == 0 ? workingDirectory : "") + `node_modules/${packageName2}/${folder}/${inPath}`;
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

// src/CompileCode/esbuild/printMessage.ts
import { SourceMapConsumer as SourceMapConsumer3 } from "source-map";

// src/OutputInput/PrintNew.ts
var Settings = {
  PreventErrors: []
};
var PreventDoubleLog = [];
var ClearWarning = () => PreventDoubleLog.length = 0;
function createNewPrint({ id, text, type = "warn", errorName }) {
  if (!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)) {
    PreventDoubleLog.push(id ?? text);
    return [type == "error" ? "important" : type, text.replace(/<line>/gi, " -> ") + `

Error-Code: ${errorName}

`];
  }
  return ["do-nothing"];
}

// src/CompileCode/esbuild/printMessage.ts
function ESBuildPrintError({ errors }, filePath) {
  for (const err of errors) {
    const [funcName, printText] = createNewPrint({
      type: "error",
      errorName: "compilation-error",
      text: `${err.text}, on file -> ${filePath ?? err.location.file}:${err?.location?.line ?? 0}:${err?.location?.column ?? 0}`
    });
    print[funcName](printText);
  }
}
async function ESBuildPrintErrorSourceMap({ errors }, sourceMap, filePath) {
  const original = await new SourceMapConsumer3(sourceMap);
  for (const err of errors) {
    const source = original.originalPositionFor(err.location);
    if (source.source)
      err.location = source;
  }
  ESBuildPrintError({ errors }, filePath);
}
function ESBuildPrintWarnings(warnings, filePath) {
  for (const warn of warnings) {
    const [funcName, printText] = createNewPrint({
      type: "warn",
      errorName: warn.pluginName,
      text: `${warn.text} on file -> ${filePath ?? warn.location.file}:${warn?.location?.line ?? 0}:${warn?.location?.column ?? 0}`
    });
    print[funcName](printText);
  }
}
function ESBuildPrintWarningsStringTracker(base, warnings) {
  for (const warn of warnings) {
    const [funcName, printText] = createNewPrint({
      type: "warn",
      errorName: warn.pluginName,
      text: base.debugLine(warn)
    });
    print[funcName](printText);
  }
}
function ESBuildPrintErrorStringTracker(base, { errors }) {
  for (const err of errors) {
    const [funcName, printText] = createNewPrint({
      errorName: "compilation-error",
      text: base.debugLine(err)
    });
    print[funcName](printText);
  }
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
async function template(BuildScriptWithoutModule, name2, params, selector, mainCode, path22, isDebug) {
  const parse2 = await JSParser.RunAndExport(mainCode, path22, isDebug);
  return new StringTracker().Plus$`function ${name2}({${params}}, selector${selector ? ` = "${selector}"` : ""}, out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${await BuildScriptWithoutModule(parse2)}
        var exports = ${name2}.exports;
        return sendToSelector(selector, out_run_script.text);
    }\n${name2}.exports = {};`;
}
async function BuildCode(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2);
  sessionInfo2.script(serveScript, { async: null });
  let scriptInfo = await template(sessionInfo2.BuildScriptWithPrams, dataTag2.popAnyTracker("name", "connect"), dataTag2.popAnyTracker("params", ""), dataTag2.popAnyDefault("selector", ""), BetweenTagData, pathName, sessionInfo2.debug && !InsertComponent2.SomePlugins("SafeDebug"));
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
import { SourceMapConsumer as SourceMapConsumer4 } from "source-map";
import { fileURLToPath as fileURLToPath4 } from "url";
async function SourceMapToStringTracker(code, sourceMap) {
  const map = typeof sourceMap == "string" ? JSON.parse(sourceMap) : sourceMap;
  const trackCode = new StringTracker(null, code);
  const splitLines = trackCode.split("\n");
  (await new SourceMapConsumer4(map)).eachMapping((m) => {
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
    const { line, char, info } = originalLines[item.line - 1]?.DefaultInfoText ?? StringTracker.emptyInfo;
    item.line = line;
    item.info = info;
    item.char = char;
  }
}
async function backToOriginal(original, code, sourceMap) {
  const newTracker = await SourceMapToStringTracker(code, sourceMap);
  mergeInfoStringTracker(original, newTracker);
  return newTracker;
}
function mergeSassInfoStringTracker(original, generated, mySource) {
  const originalLines = original.split("\n");
  for (const item of generated.getDataArray()) {
    if (item.info == mySource) {
      const { line, char, info } = originalLines[item.line - 1].at(item.char - 1)?.DefaultInfoText ?? StringTracker.emptyInfo;
      item.line = line;
      item.info = info;
      item.char = char;
    } else if (item.info) {
      item.info = BasicSettings.relative(fileURLToPath4(item.info));
    }
  }
}
async function backToOriginalSss(original, code, sourceMap, mySource) {
  const newTracker = await SourceMapToStringTracker(code, sourceMap);
  mergeSassInfoStringTracker(original, newTracker, mySource);
  return newTracker;
}

// src/BuildInComponents/Components/script/server.ts
var _a;
async function BuildCode2(language, pathName, type, dataTag2, BetweenTagData) {
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
    ResCode = SaveServerCode.RestoreCode(await SourceMapToStringTracker(code, map));
  } catch (err) {
    ESBuildPrintErrorStringTracker(BetweenTagData, err);
  }
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a || (_a = __template(["<script", ">", "<\/script>"])), dataTag2.rebuildSpace(), ResCode)
  };
}

// src/BuildInComponents/Components/script/client.ts
import { transform as transform3 } from "esbuild-wasm";
async function BuildCode3(language, tagData, BetweenTagData, sessionInfo2) {
  const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.popString("type") == "module", isModelStringCache = isModel ? "scriptModule" : "script";
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
async function BuildCode4(pathName, type, dataTag2, BetweenTagData, sessionInfo2) {
  if (dataTag2.exists("src"))
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a2 || (_a2 = __template(["<script", ">", "<\/script>"])), dataTag2.rebuildSpace(), BetweenTagData)
    };
  const language = dataTag2.popAnyDefault("lang", "js");
  if (dataTag2.popBoolean("server")) {
    return BuildCode2(language, pathName, type, dataTag2, BetweenTagData);
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
function minifyPluginSass(language) {
  return ["scss", "sass"].includes(language) ? SomePlugins("MinAll", "MinSass") : SomePlugins("MinCss", "MinAll");
}
function sassStyle(language) {
  return minifyPluginSass(language) ? "compressed" : "expanded";
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
function getSassErrorLine({ sassStack }) {
  const loc = sassStack.match(/[0-9]+:[0-9]+/)[0].split(":").map((x) => Number(x));
  return { line: loc[0], column: loc[1] };
}
function PrintSassError(err, { line, column } = getSassErrorLine(err)) {
  const [funcName, printText] = createNewPrint({
    text: `${err.message},
on file -> ${fileURLToPath5(err.span.url)}:${line ?? 0}:${column ?? 0}`,
    errorName: err?.status == 5 ? "sass-warning" : "sass-error",
    type: err?.status == 5 ? "warn" : "error"
  });
  print[funcName](printText);
}
function PrintSassErrorTracker(err, track) {
  if (err.span.url)
    return PrintSassError(err);
  err.location = getSassErrorLine(err);
  const [funcName, printText] = createNewPrint({
    text: track.debugLine(err),
    errorName: err?.status == 5 ? "sass-warning" : "sass-error",
    type: err?.status == 5 ? "warn" : "error"
  });
  print[funcName](printText);
}
async function compileSass(language, BetweenTagData, sessionInfo2, outStyle = BetweenTagData.eq) {
  const thisPage = BasicSettings.fullWebSitePath + BetweenTagData.extractInfo(), thisPageURL = pathToFileURL(thisPage), compressed = minifyPluginSass(language);
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
  } catch (err) {
    if (err.span.url) {
      const FullPath2 = fileURLToPath5(err.span.url);
      await sessionInfo2.dependence(BasicSettings.relative(FullPath2), FullPath2);
    }
    PrintSassErrorTracker(err, BetweenTagData);
    return { outStyle: "Sass Error (see console)" };
  }
  if (result?.loadedUrls) {
    for (const file of result.loadedUrls) {
      const FullPath2 = fileURLToPath5(file);
      await sessionInfo2.dependence(BasicSettings.relative(FullPath2), FullPath2);
    }
  }
  result?.sourceMap && sassAndSource(result.sourceMap, thisPageURL.href);
  return { result, outStyle, compressed };
}

// src/BuildInComponents/Components/style/server.ts
async function BuildCode5(language, pathName, type, dataTag2, BetweenTagData, sessionInfo2) {
  const SaveServerCode = new EnableGlobalReplace();
  await SaveServerCode.load(BetweenTagData.trimStart(), pathName);
  let { outStyle, compressed } = await compileSass(language, BetweenTagData, sessionInfo2, await SaveServerCode.StartBuild());
  if (!compressed)
    outStyle = `
${outStyle}
`;
  const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${dataTag2.rebuildSpace()}>${reStoreData}</style>`
  };
}

// src/BuildInComponents/Components/style/client.ts
async function BuildCode6(language, dataTag2, BetweenTagData, sessionInfo2) {
  const outStyleAsTrim = BetweenTagData.eq.trim();
  if (sessionInfo2.cache.style.includes(outStyleAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo2.cache.style.push(outStyleAsTrim);
  const { result, outStyle } = await compileSass(language, BetweenTagData, sessionInfo2);
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
async function BuildCode7(pathName, type, dataTag2, BetweenTagData, sessionInfo2) {
  const language = dataTag2.popAnyDefault("lang", "css");
  if (dataTag2.popBoolean("server")) {
    return BuildCode5(language, pathName, type, dataTag2, BetweenTagData, sessionInfo2);
  }
  return BuildCode6(language, dataTag2, BetweenTagData, sessionInfo2);
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
      setTimeout(() => process.exit());
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
async function CheckDependencyChange(path22, dependencies = pageDeps.store[path22]) {
  for (const i in dependencies) {
    const FilePath = BasicSettings.fullWebSitePath + (i == "thisPage" ? path22 : i);
    if (await EasyFs_default.stat(FilePath, "mtimeMs", true) != dependencies[i]) {
      return true;
    }
  }
  return !dependencies;
}

// src/BuildInComponents/Components/page.ts
function InFolderPagePath(inputPath, smallPath2) {
  if (inputPath[0] == ".") {
    inputPath = path_node.join(smallPath2, "/../", inputPath);
  }
  if (!path_node.extname(inputPath))
    inputPath += "." + BasicSettings.pageTypes.page;
  return inputPath;
}
var cacheMap = {};
async function BuildCode8(pathName, type, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  const filepath = dataTag2.popHaveDefault("from");
  const inStatic = InFolderPagePath(filepath, smallPathToPage(type.extractInfo()));
  const FullPath2 = getTypes.Static[0] + inStatic, SmallPath = getTypes.Static[2] + "/" + inStatic;
  if (!(await EasyFs_default.stat(FullPath2, null, true)).isFile?.()) {
    const [funcName, printText] = createNewPrint({
      text: `
Page not found: ${type.at(0).lineInfo} -> ${FullPath2}`,
      errorName: "page-not-found",
      type: "error"
    });
    print[funcName](printText);
    return {
      compiledString: new StringTracker(type.DefaultInfoText, JSParser.printError(`Page not found: ${BasicSettings.relative(type.lineInfo)} -> ${SmallPath}`))
    };
  }
  let ReturnData;
  const haveCache = cacheMap[inStatic];
  if (!haveCache || await CheckDependencyChange(null, haveCache.newSession.dependencies)) {
    const { CompiledData, sessionInfo: newSession } = await FastCompileInFile(inStatic, getTypes.Static, { nestedPage: pathName, nestedPageData: dataTag2.popHaveDefault("object") });
    newSession.dependencies[SmallPath] = newSession.dependencies.thisPage;
    delete newSession.dependencies.thisPage;
    sessionInfo2.extends(newSession);
    cacheMap[inStatic] = { CompiledData, newSession };
    ReturnData = CompiledData;
  } else {
    const { CompiledData, newSession } = cacheMap[inStatic];
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

// src/CompileCode/transform/Script.ts
import { transform as transform4 } from "esbuild-wasm";

// src/ImportFiles/CustomImport/Extension/json.ts
function json_default(path22) {
  return EasyFs_default.readJsonFile(path22);
}

// src/ImportFiles/CustomImport/Extension/wasm.ts
import { promises as promises2 } from "fs";
async function wasm_default(path22) {
  const wasmModule2 = new WebAssembly.Module(await promises2.readFile(path22));
  const wasmInstance2 = new WebAssembly.Instance(wasmModule2, {});
  return wasmInstance2.exports;
}

// src/ImportFiles/CustomImport/Extension/index.ts
var customTypes = ["json", "wasm"];
async function ImportByExtension(path22, type) {
  switch (type) {
    case "json":
      return json_default(path22);
    case "wasm":
      return wasm_default(path22);
    default:
      return import(path22);
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
  return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${JSParser.printError(`Syntax Error: ${JSParser.fixTextSimpleQuotes(info.replaceAll("\n", "<br/>"))}`)}\``;
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
    result = map ? await backToOriginal(text, code, map) : new StringTracker(null, code);
  } catch (err) {
    ESBuildPrintErrorStringTracker(text, err);
    if (sessionInfo2.debug) {
      const first = err.errors[0];
      first.location && (first.location.lineText = null);
      result = new StringTracker(null, ErrorTemplate(text.debugLine(first)));
    }
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
    return this.addScriptStyle(type, dataTag2.popString("page") ? this.smallPath : info.extractInfo());
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
  async addHeadTags() {
    const pageLog = this.typeName == getTypes.Logs[2];
    for (const i of this.inScriptStyle) {
      const isLog = pageLog && i.path == this.smallPath;
      const saveLocation = isLog ? getTypes.Logs[1] : getTypes.Static[1], addQuery = isLog ? "?t=l" : "";
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
      EasyFs_default.writeFile(saveLocation + url, await i.value.createDataWithMap());
    }
  }
  async buildHead() {
    await this.addHeadTags();
    const makeAttributes = (i) => i.attributes ? " " + Object.keys(i.attributes).map((x) => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(" ") : "";
    let buildBundleString = "";
    for (const i of this.styleURLSet)
      buildBundleString += `<link rel="stylesheet" href="${i.url}"${makeAttributes(i)}/>`;
    for (const i of this.scriptURLSet)
      buildBundleString += `<script src="${i.url}"${makeAttributes(i)}><\/script>`;
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
  try {
    const { css, sourceMap, loadedUrls } = await sass2.compileStringAsync(content.eq, {
      syntax: sassSyntax(lang),
      style: sassStyle(lang),
      importer: createImporter(fullPath),
      logger: sass2.Logger.silent,
      sourceMap: true
    });
    return {
      code: await backToOriginalSss(content, css, sourceMap, sourceMap.sources.find((x) => x.startsWith("data:"))),
      dependencies: loadedUrls.map((x) => fileURLToPath6(x))
    };
  } catch (err) {
    PrintSassErrorTracker(err, content);
  }
  return {
    code: new StringTracker()
  };
}
async function ScriptSvelte(content, lang, connectSvelte, svelteExt = "") {
  const mapToken = {};
  content = content.replacer(/((import({|[ ]*\(?)|((import[ ]*type|import|export)({|[ ]+)[\W\w]+?(}|[ ]+)from))(}|[ ]*))(["|'|`])([\W\w]+?)\9([ ]*\))?/m, (args) => {
    if (lang == "ts" && args[5].endsWith(" type"))
      return args[0];
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
    content = await backToOriginal(content, code, map);
  } catch (err) {
    ESBuildPrintErrorStringTracker(content, err);
    return new StringTracker();
  }
  content = content.replacer(/___toKen`([\w\W]+?)`/mi, (args) => {
    return mapToken[args[1].eq] ?? new StringTracker();
  });
  return content;
}
async function preprocess(fullPath, smallPath2, savePath = smallPath2, httpSource = true, svelteExt = "") {
  let text = new StringTracker(smallPath2, await EasyFs_default.readFile(fullPath));
  let scriptLang = "js", styleLang = "css";
  const connectSvelte = [], dependencies = [];
  text = await text.replacerAsync(/(<script)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/script>)/s, async (args) => {
    scriptLang = args[4]?.eq ?? "js";
    return args[1].Plus(args[6], await ScriptSvelte(args[7], scriptLang, connectSvelte, svelteExt), args[8]);
  });
  const styleCode = connectSvelte.map((x) => `@import "${x}.css";`).join("");
  let hadStyle = false;
  text = await text.replacerAsync(/(<style)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/style>)/s, async (args) => {
    styleLang = args[4]?.eq ?? "css";
    if (styleLang == "css")
      return args[0];
    const { code, dependencies: deps } = await SASSSvelte(args[7], styleLang, fullPath);
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
  return { scriptLang, styleLang, code: text.eq, map: text.StringTack(savePath, httpSource), dependencies: sessionInfo2.dependencies, svelteFiles: connectSvelte.map((x) => x[0] == "/" ? getTypes.Static[0] + x : path5.normalize(fullPath + "/../" + x)) };
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
var resolve = (path22) => require2.resolve(path22);
function redirectCJS_default(filePath) {
  filePath = path6.normalize(filePath);
  const module2 = require2(filePath);
  clearModule(filePath);
  return module2;
}

// src/ImportFiles/ForStatic/Svelte/error.ts
import { SourceMapConsumer as SourceMapConsumer5 } from "source-map";
var reLocation = class {
  constructor(sourceMap) {
    this.map = new SourceMapConsumer5(sourceMap);
  }
  async getLocation(location) {
    const { line, column } = (await this.map).originalPositionFor(location);
    return `${line}:${column}`;
  }
};
async function PrintSvelteError({ message, code, start, frame }, filePath, sourceMap) {
  const findLocation = new reLocation(sourceMap);
  const [funcName, printText] = createNewPrint({
    errorName: "svelte-" + code,
    type: "error",
    text: `${message}
${frame}
${filePath}:${await findLocation.getLocation(start)}`
  });
  print[funcName](printText);
}
async function PrintSvelteWarn(warnings, filePath, sourceMap) {
  const findLocation = new reLocation(sourceMap);
  for (const { message, code, start, frame } of warnings) {
    const [funcName, printText] = createNewPrint({
      errorName: "svelte-" + code,
      type: "warn",
      text: `${message}
${frame}
${filePath}:${await findLocation.getLocation(start)}`
    });
    print[funcName](printText);
  }
}

// src/ImportFiles/ForStatic/Svelte/ssr.ts
async function registerExtension(filePath, smallPath2, sessionInfo2) {
  const name2 = path7.parse(filePath).name.replace(/^\d/, "_$&").replace(/[^a-zA-Z0-9_$]/g, "");
  const options = {
    filename: filePath,
    name: Capitalize(name2),
    generate: "ssr",
    format: "cjs",
    dev: sessionInfo2.debug,
    errorMode: "warn"
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
  PrintSvelteWarn(warnings, filePath, map);
  await EasyFs_default.writeFile(fullImportPath, js.code);
  if (css.code) {
    css.map.sources[0] = "/" + inStaticFile.split(/\/|\//).pop() + "?source=true";
    css.code += toURLComment(css.map, true);
  }
  await EasyFs_default.writeFile(fullCompilePath + ".css", css.code ?? "");
  return fullImportPath;
}

// src/BuildInComponents/Components/svelte.ts
async function ssrHTML(dataTag, FullPath, smallPath, sessionInfo) {
  const getV = (name) => {
    const gv = (name2) => dataTag.popAnyDefault(name2, "").trim(), value = gv("ssr" + Capitalize(name)) || gv(name);
    return value ? eval(`({${value}})`) : {};
  };
  const buildPath = await registerExtension(FullPath, smallPath, sessionInfo);
  const mode = await redirectCJS_default(buildPath);
  const { html, head } = mode.default.render(getV("props"), getV("options"));
  sessionInfo.headHTML += head;
  return html;
}
async function BuildCode9(type, dataTag2, sessionInfo2) {
  const LastSmallPath = type.extractInfo(), LastFullPath = BasicSettings.fullWebSitePath + LastSmallPath;
  const { SmallPath, FullPath: FullPath2 } = CreateFilePath(LastFullPath, LastSmallPath, dataTag2.popHaveDefault("from"), getTypes.Static[2], "svelte");
  const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, "/");
  sessionInfo2.style("/" + inWebPath + ".css");
  const id = dataTag2.popAnyDefault("id", createId(inWebPath)), have = (name2) => {
    const value2 = dataTag2.popAnyDefault(name2, "").trim();
    return value2 ? `,${name2}:{${value2}}` : "";
  }, selector = dataTag2.popHaveDefault("selector");
  const ssr = !selector && dataTag2.popBoolean("ssr") ? await ssrHTML(dataTag2, FullPath2, SmallPath, sessionInfo2) : "";
  sessionInfo2.addScriptStylePage("module", dataTag2, type).addText(`import App${id} from '/${inWebPath}';
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
function codeWithCopy(md, icon) {
  function renderCode(origRule) {
    return (...args) => {
      const origRendered = origRule(...args);
      return `<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="markdownCopy(this)">${icon}</a>
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
  const hljsClass = dataTag2.popBoolean("hljs-class", markDownPlugin?.hljsClass ?? true) ? ' class="hljs"' : "";
  let haveHighlight = false;
  const md = markdown({
    html: true,
    xhtmlOut: true,
    linkify: dataTag2.popBoolean("linkify", markDownPlugin?.linkify),
    breaks: dataTag2.popBoolean("breaks", markDownPlugin?.breaks ?? true),
    typographer: dataTag2.popBoolean("typographer", markDownPlugin?.typographer ?? true),
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        haveHighlight = true;
        try {
          return `<pre${hljsClass}><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
        } catch (err) {
          const [funcName, printText] = createNewPrint({
            text: err,
            type: "error",
            errorName: "markdown-parser"
          });
          print[funcName](printText);
        }
      }
      return `<pre${hljsClass}><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  });
  const copy = dataTag2.popAnyDefault("copy-code", markDownPlugin?.copyCode ?? "\u{1F4CB}");
  if (copy)
    md.use((m) => codeWithCopy(m, copy));
  if (dataTag2.popBoolean("header-link", markDownPlugin?.headerLink ?? true))
    md.use(anchor, {
      slugify: (s) => slugify(s),
      permalink: anchor.permalink.headerLink()
    });
  if (dataTag2.popBoolean("attrs", markDownPlugin?.attrs ?? true))
    md.use(markdownItAttrs);
  if (dataTag2.popBoolean("abbr", markDownPlugin?.abbr ?? true))
    md.use(markdownItAbbr);
  let markdownCode = BetweenTagData?.eq || "";
  const location = dataTag2.popAnyDefault("file", "./markdown");
  if (!markdownCode?.trim?.() && location) {
    let filePath = location[0] == "/" ? path8.join(getTypes.Static[2], location) : path8.join(path8.dirname(type.extractInfo("<line>")), location);
    if (!path8.extname(filePath))
      filePath += ".serv.md";
    const fullPath = path8.join(BasicSettings.fullWebSitePath, filePath);
    markdownCode = await EasyFs_default.readFile(fullPath);
    await session2.dependence(filePath, fullPath);
  }
  const renderHTML = md.render(markdownCode), buildHTML = new StringTracker(type.DefaultInfoText);
  const theme = await createAutoTheme(dataTag2.popString("code-theme") || markDownPlugin?.codeTheme || "atom-one");
  if (haveHighlight) {
    if (theme != "none") {
      const cssLink2 = "/serv/md/code-theme/" + theme + ".css";
      session2.style(cssLink2);
    }
    if (copy) {
      session2.script("/serv/md.js");
    }
  }
  dataTag2.addClass("markdown-body");
  const style = dataTag2.popAnyDefault("theme", markDownPlugin?.theme ?? "auto");
  const cssLink = "/serv/md/theme/" + style + ".css";
  style != "none" && session2.style(cssLink);
  buildHTML.Plus$`<div${dataTag2.rebuildSpace()}>${renderHTML}</div>`;
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
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${dataTag2.rebuildSpace()}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2)}@DefaultInsertBundle</head>`,
    checkComponents: false
  };
}
async function addFinalizeBuild(pageData, sessionInfo2, fullCompilePath) {
  const buildBundleString = await sessionInfo2.buildHead();
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

// src/BuildInComponents/Components/connect.ts
var serveScript2 = "/serv/connect.js";
function template2(name2) {
  return `function ${name2}(...args){return connector("${name2}", args)}`;
}
async function BuildCode12(type, dataTag2, BetweenTagData, { SomePlugins: SomePlugins3 }, sessionInfo2) {
  const name2 = dataTag2.popHaveDefault("name"), sendTo = dataTag2.popHaveDefault("sendTo"), validator = dataTag2.popHaveDefault("validate"), notValid = dataTag2.popHaveDefault("notValid");
  const message = dataTag2.popAnyDefault("message", sessionInfo2.debug && !SomePlugins3("SafeDebug"));
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
  const sendTo = dataTag2.popAnyDefault("sendTo", "").trim();
  if (!sendTo)
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$`<form${dataTag2.rebuildSpace()}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2)}</form>`,
      checkComponents: false
    };
  const name2 = dataTag2.popAnyDefault("name", uuid2()).trim(), validator = dataTag2.popHaveDefault("validate"), orderDefault = dataTag2.popHaveDefault("order"), notValid = dataTag2.popHaveDefault("notValid"), responseSafe = dataTag2.popBoolean("safe");
  const message = dataTag2.popAnyDefault("message", sessionInfo2.debug && !InsertComponent2.SomePlugins("SafeDebug"));
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
  dataTag2.pushValue("method", "post");
  const compiledString = new StringTracker(type.DefaultInfoText).Plus$`<%!
@?ConnectHereForm(${sendTo});
%><form${dataTag2.rebuildSpace()}>
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
var recordStore = new StoreJSON("Records");
function recordLink(dataTag2, sessionInfo2) {
  return dataTag2.popAnyDefault("link", smallPathToPage(sessionInfo2.smallPath));
}
function makeRecordPath(defaultName, dataTag2, sessionInfo2) {
  const link = recordLink(dataTag2, sessionInfo2), saveName = dataTag2.popAnyDefault("name", defaultName);
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
  if (!sessionInfo2.smallPath.endsWith("." + BasicSettings.pageTypes.page))
    return {
      compiledString: BetweenTagData
    };
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
function deleteBeforeReBuild(smallPath2) {
  const name2 = smallPathToPage(smallPath2);
  for (const save in recordStore.store) {
    const item = recordStore.store[save];
    if (item[name2]) {
      item[name2] = void 0;
      delete item[name2];
    }
  }
}
async function updateRecords(session2) {
  if (!session2.debug) {
    return;
  }
  for (const name2 of session2.recordNames) {
    const filePath = getTypes.Static[0] + name2 + ".json";
    await EasyFs_default.makePathReal(name2, getTypes.Static[0]);
    EasyFs_default.writeJsonFile(filePath, recordStore.store[name2]);
  }
}
function perCompile() {
  recordStore.clear();
}
async function postCompile() {
  for (const name2 in recordStore.store) {
    const filePath = getTypes.Static[0] + name2 + ".json";
    await EasyFs_default.makePathReal(name2, getTypes.Static[0]);
    EasyFs_default.writeJsonFile(filePath, recordStore.store[name2]);
  }
}

// src/BuildInComponents/Components/search.ts
import { parse } from "node-html-parser";
async function BuildCode15(pathName, dataTag2, BetweenTagData, InsertComponent2, sessionInfo2) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2);
  if (!sessionInfo2.smallPath.endsWith("." + BasicSettings.pageTypes.page))
    return {
      compiledString: BetweenTagData
    };
  const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo());
  await parser.findScripts();
  let html2 = "";
  for (const i of parser.values) {
    if (i.type == "text") {
      html2 += i.text.eq;
    }
  }
  const { store, link, current } = makeRecordPath("records/search.serv", dataTag2, sessionInfo2);
  const searchObject = buildObject(html2, dataTag2.popAnyDefault("match", "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"));
  if (!current) {
    store[link] = searchObject;
  } else {
    Object.assign(current.titles, searchObject.titles);
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
  const titles = {};
  for (const element of root.querySelectorAll(match)) {
    const id = element.attributes["id"];
    titles[id] = element.innerText.trim();
    element.remove();
  }
  return {
    titles,
    text: root.innerText.trim().replace(/[ \n]{2,}/g, " ").replace(/[\n]/g, " ")
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
      reData = BuildCode4(pathName, type, dataTag2, BetweenTagData, sessionInfo2);
      break;
    case "style":
      reData = BuildCode7(pathName, type, dataTag2, BetweenTagData, sessionInfo2);
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
async function perCompilePage(sessionInfo2, fullCompilePath) {
  sessionInfo2.debug && deleteBeforeReBuild(sessionInfo2.smallPath);
}
async function postCompilePage(sessionInfo2, fullCompilePath) {
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
import path11 from "path";

// src/CompileCode/CompileScript/Compile.ts
import path10 from "path";

// src/ImportFiles/Script.ts
import { transform as transform6 } from "esbuild-wasm";
import path9 from "path";
import { v4 as uuid3 } from "uuid";

// src/BuildInFunc/SearchRecord.ts
import MiniSearch from "minisearch";
var SearchRecord = class {
  constructor(filepath) {
    this.fullPath = getTypes.Static[0] + filepath + ".json";
  }
  async load() {
    this.indexData = await EasyFs_default.readJsonFile(this.fullPath);
    const unwrapped = [];
    let counter = 0;
    for (const path22 in this.indexData) {
      const element = this.indexData[path22];
      for (const id in element.titles) {
        unwrapped.push({ id: counter++, text: element.titles[id], url: `/${path22}#${id}` });
      }
      unwrapped.push({ id: counter++, text: element.text, url: `/${path22}` });
    }
    this.miniSearch = new MiniSearch({
      fields: ["text"],
      storeFields: ["id", "text", "url"]
    });
    await this.miniSearch.addAllAsync(unwrapped);
  }
  search(text, options = { fuzzy: true, length: 200, addAfterMaxLength: "..." }, tag = "b") {
    const data = this.miniSearch.search(text, options);
    if (!tag)
      return data;
    for (const i of data) {
      for (const term of i.terms) {
        if (options.length && i.text.length > options.length) {
          const substring = i.text.substring(0, options.length);
          if (i.text[options.length].trim() != "") {
            i.text = substring.substring(0, substring.lastIndexOf(" ")) + (options.addAfterMaxLength ?? "");
          } else {
            i.text = substring;
          }
          i.text = i.text.trim();
        }
        let lower = i.text.toLowerCase(), rebuild = "";
        let index = lower.indexOf(term);
        let beenLength = 0;
        while (index != -1) {
          rebuild += i.text.substring(beenLength, beenLength + index) + `<${tag}>${i.text.substring(index + beenLength, index + term.length + beenLength)}</${tag}>`;
          lower = lower.substring(index + term.length);
          beenLength += index + term.length;
          index = lower.indexOf(term);
        }
        i.text = rebuild + i.text.substring(beenLength);
      }
    }
    return data;
  }
  suggest(text, options) {
    return this.miniSearch.autoSuggest(text, options);
  }
};

// src/ImportFiles/CustomImport/Alias/packageExport.ts
function packageExport_default() {
  return { Settings: Export, SearchRecord };
}

// src/ImportFiles/CustomImport/Alias/index.ts
var aliasNames = ["@eas-framework/server"];
function ImportAlias(originalPath) {
  switch (originalPath) {
    case "@eas-framework/server":
      return packageExport_default();
    default:
      return false;
  }
}
function AliasOrPackage(originalPath) {
  const have = ImportAlias(originalPath);
  if (have)
    return have;
  return import(originalPath);
}

// src/ImportFiles/CustomImport/index.ts
function isPathCustom(originalPath, extension) {
  return customTypes.includes(extension) || aliasNames.includes(originalPath);
}
async function CustomImport(originalPath, fullPath, extension, require3) {
  const aliasExport = await ImportAlias(originalPath);
  if (aliasExport)
    return aliasExport;
  return ImportByExtension(fullPath, extension);
}

// src/ImportFiles/Script.ts
async function ReplaceBefore(code, defineData) {
  code = await EasySyntax.BuildAndExportImports(code, defineData);
  return code;
}
function template3(code, isDebug, dir, file, params) {
  return `${isDebug ? "require('source-map-support').install();" : ""}var __dirname="${JSParser.fixTextSimpleQuotes(dir)}",__filename="${JSParser.fixTextSimpleQuotes(file)}";module.exports = (async (require${params ? "," + params : ""})=>{var module={exports:{}},exports=module.exports;${code}
return module.exports;});`;
}
async function BuildScript2(filePath, savePath, isTypescript, isDebug, { params, templatePath = filePath, codeMinify = !isDebug, mergeTrack } = {}) {
  const Options = {
    format: "cjs",
    loader: isTypescript ? "ts" : "js",
    minify: codeMinify,
    sourcemap: isDebug ? mergeTrack ? "external" : "inline" : false,
    sourcefile: savePath && path9.relative(path9.dirname(savePath), filePath),
    define: {
      debug: "" + isDebug
    }
  };
  let Result = await ReplaceBefore(mergeTrack?.eq || await EasyFs_default.readFile(filePath), {});
  Result = template3(Result, isDebug, path9.dirname(templatePath), templatePath, params);
  try {
    const { code, warnings, map } = await transform6(Result, Options);
    if (mergeTrack && map) {
      ESBuildPrintWarningsStringTracker(mergeTrack, warnings);
      Result = (await backToOriginal(mergeTrack, code, map)).StringWithTack(savePath);
    } else {
      ESBuildPrintWarnings(warnings, filePath);
      Result = code;
    }
  } catch (err) {
    if (mergeTrack) {
      ESBuildPrintErrorStringTracker(mergeTrack, err);
    } else {
      ESBuildPrintError(err, filePath);
    }
  }
  if (savePath) {
    await EasyFs_default.makePathReal(path9.dirname(savePath));
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
  const fileExt = path9.extname(FilePath);
  if (BasicSettings.partExtensions.includes(fileExt.substring(1)))
    FilePath += "." + (isTs() ? "ts" : "js");
  else if (fileExt == "")
    FilePath += "." + BasicSettings.ReqFileTypes[isTs() ? "ts" : "js"];
  return FilePath;
}
var SavedModules = {};
var PrepareMap = {};
async function LoadImport(importFrom, InStaticPath, typeArray, { isDebug = false, useDeps, withoutCache = [], onlyPrepare }) {
  let TimeCheck;
  const originalPath = path9.normalize(InStaticPath.toLowerCase());
  InStaticPath = AddExtension(InStaticPath);
  const extension = path9.extname(InStaticPath).substring(1), thisCustom = isPathCustom(originalPath, extension) || !["js", "ts"].includes(extension);
  const SavedModulesPath = path9.join(typeArray[2], InStaticPath), filePath = path9.join(typeArray[0], InStaticPath);
  let processEnd;
  if (!onlyPrepare) {
    if (!SavedModules[SavedModulesPath])
      SavedModules[SavedModulesPath] = new Promise((r) => processEnd = r);
    else if (SavedModules[SavedModulesPath] instanceof Promise)
      await SavedModules[SavedModulesPath];
  }
  const reBuild = !pageDeps.store[SavedModulesPath] || pageDeps.store[SavedModulesPath] != (TimeCheck = await EasyFs_default.stat(filePath, "mtimeMs", true, null));
  if (reBuild) {
    TimeCheck = TimeCheck ?? await EasyFs_default.stat(filePath, "mtimeMs", true, null);
    if (TimeCheck == null) {
      const [funcName, printText] = createNewPrint({
        type: "warn",
        errorName: "import-not-exists",
        text: `Import '${InStaticPath}' does not exists from '${importFrom}'`
      });
      print[funcName](printText);
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
    if (path9.isAbsolute(p))
      p = path9.relative(p, typeArray[0]);
    else {
      if (p[0] == ".") {
        p = path9.join(path9.dirname(InStaticPath), p);
      } else if (p[0] != "/")
        return AliasOrPackage(p);
    }
    return LoadImport(filePath, p, typeArray, { isDebug, useDeps, withoutCache: inheritanceCache ? withoutCache : [] });
  }
  let MyModule;
  if (thisCustom) {
    MyModule = await CustomImport(originalPath, filePath, extension, requireMap);
  } else {
    const requirePath = path9.join(typeArray[1], InStaticPath + ".cjs");
    MyModule = await redirectCJS_default(requirePath);
    if (onlyPrepare) {
      PrepareMap[SavedModulesPath] = () => MyModule(requireMap);
      return;
    }
    MyModule = await MyModule(requireMap);
  }
  SavedModules[SavedModulesPath] = MyModule;
  processEnd?.();
  return MyModule;
}
async function ImportFile(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache) {
  if (!isDebug) {
    const SavedModulesPath = path9.join(typeArray[2], InStaticPath.toLowerCase());
    const haveImport = SavedModules[SavedModulesPath];
    if (haveImport != void 0)
      return haveImport;
    else if (PrepareMap[SavedModulesPath]) {
      const module2 = await PrepareMap[SavedModulesPath]();
      SavedModules[SavedModulesPath] = module2;
      return module2;
    }
  }
  return LoadImport(importFrom, InStaticPath, typeArray, { isDebug, useDeps, withoutCache });
}
async function RequireOnce(filePath, isDebug) {
  const tempFile = path9.join(SystemData, `temp-${uuid3()}.cjs`);
  await BuildScript2(filePath, tempFile, CheckTs(filePath), isDebug);
  const MyModule = await redirectCJS_default(tempFile);
  EasyFs_default.unlink(tempFile);
  return await MyModule((path22) => import(path22));
}
async function compileImport(globalPrams, scriptLocation, inStaticLocationRelative, typeArray, isTypeScript, isDebug, mergeTrack) {
  await EasyFs_default.makePathReal(inStaticLocationRelative, typeArray[1]);
  const fullSaveLocation = scriptLocation + ".cjs";
  const templatePath = typeArray[0] + inStaticLocationRelative;
  await BuildScript2(scriptLocation, fullSaveLocation, isTypeScript, isDebug, { params: globalPrams, mergeTrack, templatePath, codeMinify: false });
  function requireMap(p) {
    if (path9.isAbsolute(p))
      p = path9.relative(p, typeArray[0]);
    else {
      if (p[0] == ".") {
        p = path9.join(inStaticLocationRelative, p);
      } else if (p[0] != "/")
        return AliasOrPackage(p);
    }
    return LoadImport(templatePath, p, typeArray, { isDebug });
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
      build2.AddTextAfterNoTrack(`
__write = {text: ''};__writeArray.unshift(__write);`);
      build2.Plus(i);
    }
    build2.AddTextAfterNoTrack(`
return __writeArray`);
    return build2;
  }
  methods(attributes) {
    const __localpath = "/" + smallPathToPage(this.sessionInfo.smallPath);
    return {
      string: "script,style,define,store,page__filename,page__dirname,__localpath,attributes",
      funcs: [
        this.sessionInfo.script.bind(this.sessionInfo),
        this.sessionInfo.style.bind(this.sessionInfo),
        (key, value2) => this.define[String(key)] = value2,
        this.sessionInfo.compileRunTimeStore,
        this.sessionInfo.fullPath,
        path10.dirname(this.sessionInfo.fullPath),
        __localpath,
        attributes || {}
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
      build2.AddTextAfterNoTrack(buildStrings.pop().text, i.text.DefaultInfoText.info);
    }
    return build2;
  }
  async compile(attributes) {
    const haveCache = this.sessionInfo.cacheCompileScript[this.smallPath];
    if (haveCache)
      return (await haveCache)(this.methods(attributes).funcs);
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
    const { funcs, string } = this.methods(attributes);
    const toImport = await compileImport(string, compilePath, filePath, typeArray, this.isTs, this.sessionInfo.debug, template4);
    const execute = async (funcs2) => {
      try {
        return this.rebuildCode(parser, await toImport(...funcs2));
      } catch (err) {
        const [funcName, printText] = createNewPrint({
          errorName: err,
          text: err.message,
          type: "error"
        });
        print[funcName](printText);
      }
    };
    this.sessionInfo.cacheCompileScript[this.smallPath] = execute;
    const thisFirst = await execute(funcs);
    doForAll(execute);
    return thisFirst;
  }
};

// src/CompileCode/CompileScript/PageBase.ts
var ignoreInherit = ["codefile"];
var settings = { define: {} };
async function PageBaseParser(text) {
  const parse2 = await pool.exec("PageBaseParser", [text]);
  return JSON.parse(parse2);
}
var ParseBasePage = class {
  constructor(sessionInfo2, code, isTs2) {
    this.sessionInfo = sessionInfo2;
    this.code = code;
    this.isTs = isTs2;
    this.scriptFile = new StringTracker();
    this.valueArray = [];
  }
  nonDynamic(isDynamic) {
    if (!isDynamic)
      return;
    const haveDynamic = this.popAny("dynamic");
    if (haveDynamic != null)
      return;
    if (this.sessionInfo.debug) {
      const parse2 = new ParseBasePage();
      parse2.clearData = this.clearData;
      parse2.valueArray = [...this.valueArray, { key: "dynamic", value: true }];
      parse2.rebuild();
      EasyFs_default.writeFile(this.sessionInfo.fullPath, parse2.clearData.eq);
      const [funcName, printText] = createNewPrint({
        type: "warn",
        errorName: "dynamic-ssr-import",
        text: "Adding 'dynamic' attribute to file " + this.sessionInfo.smallPath
      });
      print[funcName](printText);
    }
    return true;
  }
  async loadSettings(pagePath, smallPath2, pageName, { attributes, dynamicCheck }) {
    const run = new CRunTime(this.code, this.sessionInfo, smallPath2, this.isTs);
    this.code = await run.compile(attributes);
    await this.parseBase(this.code);
    if (this.nonDynamic(dynamicCheck)) {
      return false;
    }
    await this.loadCodeFile(pagePath, smallPath2, this.isTs, pageName);
    this.loadDefine(__spreadValues(__spreadValues({}, settings.define), run.define));
    return true;
  }
  async parseBase(code) {
    const parser = await PageBaseParser(code.eq);
    if (parser.start == parser.end) {
      this.clearData = code;
      return;
    }
    for (const { char, end, key, start } of parser.values) {
      this.valueArray.push({ key, value: start === end ? true : code.substring(start, end), char });
    }
    this.clearData = code.substring(0, parser.start).Plus(code.substring(parser.end)).trimStart();
  }
  rebuild() {
    if (!this.valueArray.length)
      return this.clearData;
    const build2 = new StringTracker(null, "@[");
    for (const { key, value: value2, char } of this.valueArray) {
      if (value2 !== true) {
        build2.Plus$`${key}=${char}${value2}${char} `;
      } else {
        build2.Plus$`${key} `;
      }
    }
    this.clearData = build2.substring(0, build2.length - 1).Plus("]\n").Plus(this.clearData);
  }
  static async rebuildBaseInheritance(code) {
    const parse2 = new ParseBasePage();
    const build2 = new StringTracker();
    await parse2.parseBase(code);
    for (const name2 of parse2.byValue("inherit")) {
      if (ignoreInherit.includes(name2.toLowerCase()))
        continue;
      parse2.pop(name2);
      build2.AddTextAfterNoTrack(`<@${name2}><:${name2}/></@${name2}>`);
    }
    parse2.rebuild();
    return parse2.clearData.Plus(build2);
  }
  get(name2) {
    return this.valueArray.find((x) => x.key === name2)?.value;
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
    return this.valueArray.filter((x) => x.value !== true && x.value.eq === value2).map((x) => x.key);
  }
  replaceValue(name2, value2) {
    const have = this.valueArray.find((x) => x.key === name2);
    if (have)
      have.value = value2;
  }
  defaultValuePopAny(name2, defaultValue) {
    const value2 = this.popAny(name2);
    return value2 === true ? defaultValue : value2?.eq;
  }
  async loadCodeFile(pagePath, pageSmallPath, isTs2, pageName) {
    let haveCode = this.defaultValuePopAny("codefile", "inherit");
    if (!haveCode)
      return;
    const lang = this.defaultValuePopAny("lang", "js");
    const originalValue = haveCode.toLowerCase();
    if (originalValue == "inherit")
      haveCode = pagePath;
    const haveExt = path11.extname(haveCode).substring(1);
    if (!["js", "ts"].includes(haveExt)) {
      if (/(\\|\/)$/.test(haveCode))
        haveCode += pagePath.split("/").pop();
      else if (!BasicSettings.pageTypesArray.includes(haveExt))
        haveCode += path11.extname(pagePath);
      haveCode += "." + (lang ? lang : isTs2 ? "ts" : "js");
    }
    if (haveCode[0] == ".")
      haveCode = path11.join(path11.dirname(pagePath), haveCode);
    const SmallPath = BasicSettings.relative(haveCode);
    if (await this.sessionInfo.dependence(SmallPath, haveCode)) {
      const baseModelData = await AddDebugInfo(false, pageName, haveCode, SmallPath);
      this.scriptFile = baseModelData.allData.replaceAll("@", "@@");
      this.scriptFile.AddTextBeforeNoTrack("<%");
      this.scriptFile.AddTextAfterNoTrack("%>");
      this.sessionInfo.debug && this.scriptFile.AddTextBeforeNoTrack(baseModelData.stringInfo);
    } else if (originalValue == "inherit" && this.sessionInfo.debug) {
      EasyFs_default.writeFile(haveCode, "");
      const [funcName, printText] = createNewPrint({
        id: SmallPath,
        type: "warn",
        errorName: "create-code-file",
        text: `
Code file created: ${pagePath}<line>${SmallPath}`
      });
      print[funcName](printText);
    } else {
      const [funcName, printText] = createNewPrint({
        id: SmallPath,
        type: "error",
        errorName: "code-file-not-found",
        text: `
Code file not found: ${pagePath}<line>${SmallPath}`
      });
      print[funcName](printText);
      this.scriptFile = new StringTracker(pageName, JSParser.printError(`Code File Not Found: '${pageSmallPath}' -> '${SmallPath}'`));
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
    const values = [];
    while (lastValue) {
      values.unshift(lastValue);
      lastValue = this.loadSetting();
    }
    values.unshift(...Object.entries(moreDefine));
    for (const [name2, value2] of values) {
      this.clearData = this.clearData.replaceAll(`:${name2}:`, value2);
    }
  }
};

// src/CompileCode/InsertComponent.ts
import path12 from "path";

// src/CompileCode/XMLHelpers/TagDataParser.ts
async function HTMLAttrParser(text) {
  const parse2 = await pool.exec("HTMLAttrParser", [text]);
  return JSON.parse(parse2);
}
var TagDataParser = class {
  constructor(text) {
    this.text = text;
    this.valueArray = [];
  }
  async parser() {
    const parse2 = await HTMLAttrParser(this.text.eq);
    for (const { char, ek, ev, sk, space, sv } of parse2) {
      this.valueArray.push({ char, space, key: this.text.substring(sk, ek), value: sv == ev ? true : this.text.substring(sv, ev) });
    }
  }
  popItem(key) {
    key = key.toLowerCase();
    const index = this.valueArray.findIndex((x) => x.key.eq.toLowerCase() == key);
    return index == -1 ? null : this.valueArray.splice(index, 1).shift();
  }
  popTracker(key) {
    return this.popItem(key)?.value;
  }
  popHaveDefaultTracker(key, value2 = "") {
    const data = this.popTracker(key);
    return typeof data === "boolean" ? value2 : data;
  }
  popAnyTracker(key, value2 = "") {
    const data = this.popTracker(key);
    return data instanceof StringTracker ? data.eq : value2;
  }
  popString(key) {
    const value2 = this.popItem(key)?.value;
    return value2 instanceof StringTracker ? value2.eq : value2;
  }
  popBoolean(key, defaultValue) {
    return Boolean(this.popString(key) ?? defaultValue);
  }
  exists(key) {
    return this.valueArray.find((x) => x.key.eq.toLowerCase() == key) != null;
  }
  popHaveDefault(key, value2 = "") {
    const data = this.popString(key);
    return typeof data === "boolean" ? value2 : data;
  }
  popAnyDefault(key, value2 = "") {
    const data = this.popString(key);
    return typeof data === "string" ? data : value2;
  }
  addClass(className) {
    const have = this.valueArray.find((x) => x.key.eq.toLowerCase() == "class");
    if (have?.value instanceof StringTracker)
      have.value.AddTextAfterNoTrack(" " + className).trimStart();
    else if (have?.value === true) {
      have.value = new StringTracker(null, className);
    } else {
      this.pushValue("class", className);
    }
  }
  rebuildSpace() {
    const newAttributes = new StringTracker();
    for (const { value: value2, char, key, space } of this.valueArray) {
      space && newAttributes.AddTextAfterNoTrack(" ");
      if (value2 === true) {
        newAttributes.Plus(key);
      } else {
        newAttributes.Plus$`${key}=${char}${value2}${char}`;
      }
    }
    return newAttributes;
  }
  pushValue(key, value2) {
    const have = this.valueArray.find((x) => x.key.eq.toLowerCase() == key);
    if (have)
      return have.value = new StringTracker(null, value2);
    this.valueArray.push({ key: new StringTracker(null, key), value: new StringTracker(null, value2), char: '"', space: true });
  }
  map() {
    const attrMap = {};
    for (const { key, value: value2 } of this.valueArray) {
      if (key)
        attrMap[key.eq] = value2 === true ? true : value2.eq;
    }
    return attrMap;
  }
};

// src/CompileCode/InsertComponent.ts
var InsertComponent = class extends InsertComponentBase {
  constructor(PluginBuild2) {
    super();
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
  findIndexSearchTag(query, tag) {
    const all = query.split(".");
    let counter = 0;
    for (const i of all) {
      const index = tag.indexOf(i);
      if (index == -1) {
        const [funcName, printText] = createNewPrint({
          text: `Waring, can't find all query in tag -> ${tag.eq}
${tag.lineInfo}`,
          errorName: "query-not-found"
        });
        print[funcName](printText);
        break;
      }
      counter += index + i.length;
      tag = tag.substring(index + i.length);
    }
    return counter + tag.search(/\ |\>/);
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
      dataTag2 = dataTagSpliced.rebuildSpace();
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
    for (const { key, value: value2 } of tagData.valueArray) {
      const re = new RegExp("\\~" + key, "gi");
      fileData = fileData.replace(re, value2);
    }
    return this.addDefaultValues(foundSetters, fileData);
  }
  async buildTagBasic(fileData, tagData, path22, SmallPath, pathName, sessionInfo2, BetweenTagData) {
    fileData = await this.PluginBuild.BuildComponent(fileData, path22, pathName, sessionInfo2);
    fileData = this.parseComponentProps(tagData, fileData);
    fileData = fileData.replace(/<\:reader( )*\/>/gi, BetweenTagData ?? "");
    pathName = pathName + " -> " + SmallPath;
    fileData = await this.StartReplace(fileData, pathName, sessionInfo2);
    fileData = await ParseDebugInfo(fileData, `${pathName} ->
${SmallPath}`);
    return fileData;
  }
  static addSpacialAttributes(data, type, BetweenTagData) {
    const importSource = "/" + type.extractInfo();
    data.pushValue("importSource", importSource);
    data.pushValue("importSourceDirectory", path12.dirname(importSource));
    const mapAttributes = data.map();
    mapAttributes.reader = BetweenTagData?.eq;
    return mapAttributes;
  }
  async insertTagData(pathName, type, dataTag2, { BetweenTagData, sessionInfo: sessionInfo2 }) {
    const dataParser = new TagDataParser(dataTag2), BuildIn = IsInclude(type.eq);
    await dataParser.parser();
    let fileData, SearchInComment = true, AllPathTypes = {}, addStringInfo;
    if (BuildIn) {
      const { compiledString, checkComponents } = await StartCompiling(pathName, type, dataParser, BetweenTagData ?? new StringTracker(), this, sessionInfo2);
      fileData = compiledString;
      SearchInComment = checkComponents;
    } else {
      let folder = dataParser.popHaveDefault("folder", ".");
      const tagPath = (folder ? folder + "/" : "") + type.replace(/:/gi, "/").eq;
      const relativesFilePathSmall = type.extractInfo(), relativesFilePath = pathNode.join(BasicSettings.fullWebSitePath, relativesFilePathSmall);
      AllPathTypes = CreateFilePath(relativesFilePath, relativesFilePathSmall, tagPath, this.dirFolder, BasicSettings.pageTypes.component);
      if (sessionInfo2.cacheComponent[AllPathTypes.SmallPath] === null || sessionInfo2.cacheComponent[AllPathTypes.SmallPath] === void 0 && !await EasyFs_default.existsFile(AllPathTypes.FullPath)) {
        sessionInfo2.cacheComponent[AllPathTypes.SmallPath] = null;
        if (folder) {
          const [funcName, printText] = createNewPrint({
            text: `Component ${type.eq} not found! -> ${pathName}
-> ${type.lineInfo}
${AllPathTypes.SmallPath}`,
            errorName: "component-not-found",
            type: "error"
          });
          print[funcName](printText);
        }
        return this.ReBuildTag(type, dataTag2, dataParser, BetweenTagData, (BetweenTagData2) => this.StartReplace(BetweenTagData2, pathName, sessionInfo2));
      }
      if (!sessionInfo2.cacheComponent[AllPathTypes.SmallPath]?.mtimeMs)
        sessionInfo2.cacheComponent[AllPathTypes.SmallPath] = { mtimeMs: await EasyFs_default.stat(AllPathTypes.FullPath, "mtimeMs") };
      sessionInfo2.dependencies[AllPathTypes.SmallPath] = sessionInfo2.cacheComponent[AllPathTypes.SmallPath].mtimeMs;
      const { allData, stringInfo } = await AddDebugInfo(true, pathName, AllPathTypes.FullPath, AllPathTypes.SmallPath, sessionInfo2.cacheComponent[AllPathTypes.SmallPath]);
      const baseData = new ParseBasePage(sessionInfo2, allData, this.isTs());
      const mapAttributes = InsertComponent.addSpacialAttributes(dataParser, type, BetweenTagData);
      await baseData.loadSettings(AllPathTypes.FullPath, AllPathTypes.SmallPath, pathName + " -> " + AllPathTypes.SmallPath, { attributes: mapAttributes });
      fileData = baseData.scriptFile.Plus(baseData.clearData);
      addStringInfo = sessionInfo2.debug && stringInfo;
    }
    if (SearchInComment && (fileData.length > 0 || BetweenTagData)) {
      const { SmallPath, FullPath: FullPath2 } = AllPathTypes;
      fileData = await this.buildTagBasic(fileData, dataParser, BuildIn ? type.eq : FullPath2, BuildIn ? type.eq : SmallPath, pathName, sessionInfo2, BetweenTagData);
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
      let inTag = startFrom.substring(tagTypeEnd, findEndOfSmallTag);
      if (inTag.at(inTag.length - 1).eq == "/") {
        inTag = inTag.substring(0, inTag.length - 1);
      }
      const NextTextTag = startFrom.substring(findEndOfSmallTag + 1);
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
          const [funcName, printText] = createNewPrint({
            text: `
Warning, you didn't write right this tag: "${tagType}", used in: ${tagType.at(0).lineInfo}
(the system will auto close it)`,
            errorName: "close-tag"
          });
          print[funcName](printText);
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
  static async AddPageTemplate(text, sessionInfo2) {
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
                    const last_file = run_script_name.split(/->|<line>/).pop();
                    run_script_name += ' -> <line>' + e.stack.split(/\\n( )*at /)[2];
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
                    console.error("Error path: " + run_script_name.slice(0, -last_file.length).replace(/<line>/gi, '\\n'));
                    console.error("${JSParser.fixTextSimpleQuotes(BasicSettings.fullWebSitePath)}" + last_file.trim());
                    console.error("Error message: " + e.message);
                    console.error("Error running this code: \\"" + run_script_code + '"');
                    console.error("Error stack: " + e.stack);
                }`);
    }
    text.AddTextAfterNoTrack(`}});}`);
    return text;
  }
  static async BuildPage(text, sessionInfo2) {
    const builtCode = await PageTemplate.RunAndExport(text, sessionInfo2.fullPath, sessionInfo2.debug);
    return PageTemplate.AddPageTemplate(builtCode, sessionInfo2);
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
  async BuildBasic(text, OData, path22, pathName, sessionInfo2) {
    if (!OData) {
      return text;
    }
    if (!Array.isArray(OData)) {
      OData = [OData];
    }
    for (const i of OData) {
      const Syntax = await GetSyntax(i);
      if (Syntax) {
        text = await Syntax(text, i, path22, pathName, sessionInfo2);
      }
    }
    return text;
  }
  async BuildPage(text, path22, pathName, sessionInfo2) {
    text = await this.BuildBasic(text, this.defaultSyntax, path22, pathName, sessionInfo2);
    return text;
  }
  async BuildComponent(text, path22, pathName, sessionInfo2) {
    text = await this.BuildBasic(text, this.defaultSyntax, path22, pathName, sessionInfo2);
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
async function outPage(data, scriptFile, pagePath, pageName, LastSmallPath, sessionInfo2, dynamicCheck) {
  const baseData = new ParseBasePage(sessionInfo2, data, isTs());
  if (!await baseData.loadSettings(pagePath, LastSmallPath, pageName, { dynamicCheck })) {
    return;
  }
  const modelName = baseData.defaultValuePopAny("model", "website");
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
  const baseModelData = await AddDebugInfo(false, pageName, FullPath2, SmallPath);
  let modelData = await ParseBasePage.rebuildBaseInheritance(baseModelData.allData);
  sessionInfo2.debug && modelData.AddTextBeforeNoTrack(baseModelData.stringInfo);
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
      const loadFromBase = baseData.get(i.tag);
      if (loadFromBase && loadFromBase !== true && loadFromBase.eq.toLowerCase() != "inherit")
        modelBuild.Plus(loadFromBase);
    }
  }
  modelBuild.Plus(modelData);
  return await outPage(modelBuild, scriptFile.Plus(baseData.scriptFile), FullPath2, pageName, SmallPath, sessionInfo2);
}
async function Insert(data, fullPathCompile, nestedPage, nestedPageData, sessionInfo2, dynamicCheck) {
  let DebugString = new StringTracker(sessionInfo2.smallPath, data);
  DebugString = await outPage(DebugString, new StringTracker(DebugString.DefaultInfoText), sessionInfo2.fullPath, sessionInfo2.smallPath, sessionInfo2.smallPath, sessionInfo2, dynamicCheck);
  if (DebugString == null) {
    return;
  }
  DebugString = await PluginBuild.BuildPage(DebugString, sessionInfo2.fullPath, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await Components.Insert(DebugString, sessionInfo2.smallPath, sessionInfo2);
  DebugString = await ParseDebugLine(DebugString, sessionInfo2.smallPath);
  if (nestedPage) {
    return PageTemplate.InPageTemplate(DebugString, nestedPageData, sessionInfo2.fullPath);
  }
  DebugString = await finalizeBuild(DebugString, sessionInfo2, fullPathCompile);
  DebugString = await PageTemplate.BuildPage(DebugString, sessionInfo2);
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
    ESBuildPrintWarnings(warnings, fullPath);
  } catch (err) {
    ESBuildPrintError(err, fullPath);
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
  const { code, dependencies, map, scriptLang } = await preprocess(fullPath, getTypes.Static[2] + "/" + inStaticPath);
  const filename = fullPath.split(/\/|\//).pop();
  let js, css;
  try {
    const output = svelte2.compile(code, {
      filename,
      dev: isDebug,
      sourcemap: map,
      css: false,
      hydratable: true,
      sveltePath: "/serv/svelte"
    });
    PrintSvelteWarn(output.warnings, fullPath, map);
    js = output.js;
    css = output.css;
  } catch (err) {
    PrintSvelteError(err, fullPath, map);
    return {
      thisFile: 0
    };
  }
  const sourceFileClient = js.map.sources[0].substring(1);
  if (isDebug) {
    js.map.sources[0] = sourceFileClient;
  }
  if (SomePlugins("MinJS") || SomePlugins("MinAll")) {
    try {
      const { code: code2, map: map2 } = await transform8(js.code, {
        minify: true,
        loader: scriptLang,
        sourcemap: isDebug
      });
      js.code = code2;
      if (map2) {
        js.map = await MergeSourceMap(JSON.parse(map2), js.map);
      }
    } catch (err) {
      await ESBuildPrintErrorSourceMap(err, js.map, fullPath);
    }
  }
  if (isDebug) {
    js.code += toURLComment(js.map);
    if (css.code) {
      css.map.sources[0] = sourceFileClient;
      css.code += toURLComment(css.map, true);
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
      style: sassStyle(type),
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
  } catch (err) {
    PrintSassError(err);
    return {};
  }
  return dependenceObject;
}

// src/ImportFiles/StaticFiles.ts
import fs2 from "fs";
import promptly from "promptly";
import { argv } from "process";
var SupportedTypes = ["js", "svelte", "ts", "jsx", "tsx", "css", "sass", "scss"];
var StaticFilesInfo2 = new StoreJSON("StaticFiles");
async function CheckDependencyChange2(path22) {
  const o = StaticFilesInfo2.store[path22];
  for (const i in o) {
    let p = i;
    if (i == "thisFile") {
      p = getTypes.Static[2] + "/" + path22;
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
  },
  {
    path: "serv/md.js",
    type: "js",
    inServer: staticFiles + "markdownCopy.js"
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
async function serverBuild(Request, isDebug, path22, checked = false) {
  return await svelteStatic(path22, checked) || await svelteStyle(path22, checked, isDebug) || await unsafeDebug(isDebug, path22, checked) || await serverBuildByType(Request, path22, checked) || await markdownTheme(path22, checked) || await markdownCodeTheme(path22, checked) || getStatic.find((x) => x.path == path22);
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
    const b = await LoadImport("root folder (WWW)", i, getTypes.Static, { isDebug });
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
  addPage(path22, type) {
    if (!this.state.pageArray.find((x) => x[0] == path22 && x[1] == type))
      this.state.pageArray.push([path22, type]);
  }
  addImport(path22) {
    if (!this.state.importArray.includes(path22))
      this.state.importArray.push(path22);
  }
  addFile(path22) {
    if (!this.state.fileArray.includes(path22))
      this.state.fileArray.push(path22);
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
function extensionIs(name2, extname2) {
  return name2.endsWith("." + extname2);
}
function isFileType(types, name2) {
  name2 = name2.toLowerCase();
  for (const type of types) {
    if (extensionIs(name2, type)) {
      return true;
    }
  }
  return false;
}
function RemoveEndType(string) {
  return string.substring(0, string.lastIndexOf("."));
}

// src/RunTimeBuild/SiteMap.ts
async function FilesInFolder(arrayType, path22, state) {
  const allInFolder = await EasyFs_default.readdir(arrayType[0] + path22, { withFileTypes: true });
  const promises3 = [];
  for (const i of allInFolder) {
    const n = i.name, connect = path22 + n;
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
        for (const path22 in routing.urlStop) {
          if (url.startsWith(path22)) {
            url = path22;
          }
          break;
        }
      }
      if (sitemap.rules) {
        for (const path22 in routing.rules) {
          if (url.startsWith(path22)) {
            url = await routing.rules[path22](url);
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
          const path22 = "/" + routing.errorPages[error].path;
          if (url.startsWith(path22)) {
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
    const path22 = write === true ? "sitemap.txt" : write;
    state.addFile(path22);
    await EasyFs_default.writeFile(getTypes.Static[0] + path22, pages.join("\n"));
  }
}

// src/RunTimeBuild/SearchPages.ts
async function compileFile(filePath, arrayType, { isDebug, hasSessionInfo, nestedPage, nestedPageData, dynamicCheck } = {}) {
  const FullFilePath = path18.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + ".cjs";
  const html2 = await EasyFs_default.readFile(FullFilePath, "utf8");
  const ExcluUrl = (nestedPage ? nestedPage + "<line>" : "") + arrayType[2] + "/" + filePath;
  const sessionInfo2 = hasSessionInfo ?? new SessionBuild(arrayType[2] + "/" + filePath, FullFilePath, arrayType[2], isDebug, GetPlugin("SafeDebug"));
  await sessionInfo2.dependence("thisPage", FullFilePath);
  await perCompilePage(sessionInfo2, FullPathCompile);
  const CompiledData = await Insert(html2, FullPathCompile, Boolean(nestedPage), nestedPageData, sessionInfo2, dynamicCheck) ?? new StringTracker();
  await postCompilePage(sessionInfo2, FullPathCompile);
  if (!nestedPage && CompiledData.length) {
    await EasyFs_default.writeFile(FullPathCompile, CompiledData.StringWithTack(FullPathCompile));
    pageDeps.update(ExcluUrl, sessionInfo2.dependencies);
  }
  return { CompiledData, sessionInfo: sessionInfo2 };
}
function RequireScript(script) {
  return LoadImport("Production Loader", script, getTypes.Static, { isDebug: false, onlyPrepare: true });
}
async function FilesInFolder2(arrayType, path22, state) {
  const allInFolder = await EasyFs_default.readdir(arrayType[0] + path22, { withFileTypes: true });
  for (const i of allInFolder) {
    const n = i.name, connect = path22 + n;
    if (i.isDirectory()) {
      await EasyFs_default.mkdir(arrayType[1] + connect);
      await FilesInFolder2(arrayType, connect + "/", state);
    } else {
      if (isFileType(BasicSettings.pageTypesArray, n)) {
        state.addPage(connect, arrayType[2]);
        if (await CheckDependencyChange(arrayType[2] + "/" + connect))
          await compileFile(connect, arrayType, { dynamicCheck: !extensionIs(n, BasicSettings.pageTypes.page) });
      } else if (arrayType == getTypes.Static && isFileType(BasicSettings.ReqFileTypesArray, n)) {
        state.addImport(connect);
        await RequireScript(connect);
      } else {
        state.addFile(connect);
        await BuildFile(connect, false);
      }
    }
  }
}
async function RequireScripts(scripts) {
  for (const path22 of scripts) {
    await RequireScript(path22);
  }
}
async function CreateCompile(t, state) {
  const types = getTypes[t];
  await DeleteInDirectory(types[1]);
  return () => FilesInFolder2(types, "", state);
}
async function FastCompileInFile(path22, arrayType, { hasSessionInfo, nestedPage, nestedPageData, dynamicCheck } = {}) {
  await EasyFs_default.makePathReal(path22, arrayType[1]);
  return await compileFile(path22, arrayType, { isDebug: true, hasSessionInfo, nestedPage, nestedPageData, dynamicCheck });
}
async function FastCompile(path22, arrayType, dynamicCheck) {
  await FastCompileInFile(path22, arrayType, { dynamicCheck });
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
  Export: () => Export2,
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
    if (filePath[0] == ".")
      filePath = path19.join(path19.relative(typeArray[0], __dirname), filePath);
    else if (filePath[0] != "/")
      static_modules = true;
    else
      filePath = filePath.substring(1);
  } else {
    filePath = ReqFile.path;
    static_modules = ReqFile.static;
  }
  if (static_modules)
    LastRequire[copyPath] = { model: await AliasOrPackage(copyPath), status: -1, static: true, path: filePath };
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
      const [funcName, printText] = createNewPrint({
        type: "warn",
        errorName: "import-not-exists",
        text: `Import '${filePath}' does not exists from '${__filename}'`
      });
      print[funcName](printText);
    }
  }
  const builtModel = LastRequire[copyPath];
  CacheRequireFiles[builtModel.path] = builtModel;
  return builtModel.model;
}

// src/RunTimeBuild/FunctionScript.ts
var Export2 = {
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
  if (filePath[0] == ".")
    fullPath = path20.join(__dirname, filePath);
  else
    fullPath = path20.join(typeArray[0], filePath);
  if (![BasicSettings.pageTypes.page, BasicSettings.pageTypes.component].includes(extname2)) {
    const importText = await EasyFs_default.readFile(fullPath);
    DataObject.write(importText);
    return importText;
  }
  fileExists = fileExists ?? await EasyFs_default.existsFile(fullPath);
  if (!fileExists) {
    const [funcName, printText] = createNewPrint({
      type: "warn",
      errorName: "import-not-exists",
      text: `Import '${copyPath}' does not exists from '${__filename}'`
    });
    print[funcName](printText);
    LastRequire[copyPath] = { model: () => {
    }, date: -1, path: fullPath };
    return LastRequire[copyPath].model;
  }
  const inStaticPath = path20.relative(typeArray[0], fullPath);
  const SmallPath = typeArray[2] + "/" + inStaticPath;
  const reBuild = DataObject.isDebug && (!await EasyFs_default.existsFile(typeArray[1] + "/" + inStaticPath + ".cjs") || await CheckDependencyChange(SmallPath));
  if (reBuild)
    await FastCompile(inStaticPath, typeArray, extname2 != BasicSettings.pageTypes.page);
  if (Export2.PageLoadRam[SmallPath] && !reBuild) {
    LastRequire[copyPath] = { model: Export2.PageLoadRam[SmallPath][0] };
    return await LastRequire[copyPath].model(DataObject);
  }
  const func = await LoadPage(SmallPath, DataObject.isDebug);
  if (Export2.PageRam) {
    if (!Export2.PageLoadRam[SmallPath]) {
      Export2.PageLoadRam[SmallPath] = [];
    }
    Export2.PageLoadRam[SmallPath][0] = func;
  }
  LastRequire[copyPath] = { model: func };
  return await func(DataObject);
}
var GlobalVar = {};
function getFullPathCompile(url) {
  const SplitInfo = SplitFirst("/", url);
  const typeArray = getTypes[SplitInfo[0]];
  return typeArray[1] + SplitInfo[1] + ".cjs";
}
async function LoadPage(url, isDebug) {
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
  const compiledPath = path20.join(typeArray[1], SplitInfo[1] + ".cjs");
  const private_var = {};
  try {
    const MyModule = await redirectCJS_default(compiledPath);
    return MyModule(_require, _include, _transfer, private_var, handelConnectorService);
  } catch (e) {
    let errorText;
    if (isDebug) {
      print.error("Error path -> ", RemoveEndType(url), "->", e.message);
      print.error(e.stack);
      errorText = JSParser.printError(`Error path: ${url}<br/>Error message: ${e.message}`);
    } else {
      errorText = JSParser.printError(`Error code: ${e.code}`);
    }
    return (DataObject) => {
      DataObject.Request.error = e;
      DataObject.out_run_script.text += errorText;
    };
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
    Response.redirect = (path22, status) => {
      redirectPath = String(path22);
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
          error = "Error on function validator, field - " + makeMassage(e);
        }
      }
      if (validate instanceof RegExp)
        resData = validate.test(value2);
  }
  if (!resData)
    error = 'Error validate field, value is "' + value2 + '"';
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
  return urlFrom || "";
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
    newResponse = apiResponse || newResponse;
  finalStep();
  if (newResponse != null)
    Response.json(newResponse);
  return true;
}

// src/RunTimeBuild/GetPages.ts
var { Export: Export3 } = FunctionScript_exports;
var Settings4 = {
  CacheDays: 1,
  DevMode: true,
  ErrorPages: {}
};
async function LoadPageToRam(url, isDebug) {
  if (await EasyFs_default.existsFile(getFullPathCompile(url))) {
    Export3.PageLoadRam[url] = [];
    Export3.PageLoadRam[url][0] = await LoadPage(url, isDebug);
    Export3.PageLoadRam[url][1] = BuildPage(Export3.PageLoadRam[url][0], url);
  }
}
async function LoadAllPagesToRam(isDebug) {
  for (const i in pageDeps.store) {
    if (!ExtensionInArray(i, BasicSettings.ReqFileTypesArray))
      await LoadPageToRam(i, isDebug);
  }
}
function ClearAllPagesFromRam() {
  for (const i in Export3.PageLoadRam) {
    Export3.PageLoadRam[i] = void 0;
    delete Export3.PageLoadRam[i];
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
async function isURLPathAFile(Request, url, code) {
  if (code == 200) {
    const fullPageUrl = getTypes.Static[0] + url;
    if (await serverBuild(Request, Settings4.DevMode, url) || await EasyFs_default.existsFile(fullPageUrl))
      return fullPageUrl;
  }
}
async function BuildLoadPage(smallPath2, firstFunc) {
  const pageArray = [firstFunc ?? await LoadPage(smallPath2, Settings4.DevMode)];
  pageArray[1] = BuildPage(pageArray[0], smallPath2);
  if (Export3.PageRam)
    Export3.PageLoadRam[smallPath2] = pageArray;
  return pageArray[1];
}
async function GetDynamicPage(arrayType, url, code) {
  const inStatic = url + "." + BasicSettings.pageTypes.page;
  const smallPath2 = arrayType[2] + "/" + inStatic;
  let fullPageUrl = BasicSettings.fullWebSitePath + smallPath2;
  let DynamicFunc;
  if (Settings4.DevMode && await EasyFs_default.existsFile(fullPageUrl)) {
    if (!await EasyFs_default.existsFile(arrayType[1] + inStatic + ".cjs") || await CheckDependencyChange(smallPath2)) {
      await FastCompile(url + "." + BasicSettings.pageTypes.page, arrayType);
      DynamicFunc = await BuildLoadPage(smallPath2);
    } else if (Export3.PageLoadRam[smallPath2]?.[1])
      DynamicFunc = Export3.PageLoadRam[smallPath2][1];
    else
      DynamicFunc = await BuildLoadPage(smallPath2, Export3.PageLoadRam[smallPath2]?.[0]);
  } else if (Export3.PageLoadRam[smallPath2]?.[1])
    DynamicFunc = Export3.PageLoadRam[smallPath2][1];
  else if (!Export3.PageRam && await EasyFs_default.existsFile(fullPageUrl))
    DynamicFunc = await BuildLoadPage(smallPath2, Export3.PageLoadRam[smallPath2]?.[0]);
  else if (arrayType != getTypes.Logs) {
    const { arrayType: arrayType2, code: code2, url: url2 } = GetErrorPage(404, "notFound");
    return GetDynamicPage(arrayType2, url2, code2);
  } else {
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
async function ActivatePage(Request, Response, arrayType, url, code, nextPrase) {
  const { DynamicFunc, fullPageUrl, code: newCode } = await GetDynamicPage(arrayType, url, code);
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
  const FileInfo = await isURLPathAFile(Request, url, code);
  const makeDeleteArray = makeDeleteRequestFilesArray(Request);
  if (FileInfo) {
    Settings4.CacheDays && Response.setHeader("Cache-Control", "max-age=" + Settings4.CacheDays * 24 * 60 * 60);
    await GetFile(url, Settings4.DevMode, Request, Response);
    deleteRequestFiles(makeDeleteArray);
    return;
  }
  const nextPrase = () => ParseBasicInfo(Request, Response, code);
  const isApi = await ApiCall_default(Request, Response, url, Settings4.DevMode, nextPrase);
  if (!isApi && !await ActivatePage(Request, Response, arrayType, url, code, nextPrase))
    return;
  deleteRequestFiles(makeDeleteArray);
}
function urlFix(url) {
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
var baseValidPath = [(path22) => path22.split(".").at(-2) != "serv"];
var Export = {
  get settingsPath() {
    return workingDirectory + BasicSettings.WebSiteFolder + "/Settings";
  },
  set development(value2) {
    if (DevMode_ == value2)
      return;
    DevMode_ = value2;
    if (!value2) {
      compilationScan = compileAll(Export);
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
      Export2.PageRam = value2;
      pageInRamActivate = async () => {
        const preparations = await compilationScan;
        await preparations?.();
        if (value2) {
          await LoadAllPagesToRam(Export.development);
        } else {
          ClearAllPagesFromRam();
        }
      };
    },
    get pageInRam() {
      return Export2.PageRam;
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
    maxFileSize: Export.serveLimits.fileLimitMB * 1048576,
    uploadDir: SystemData + "/UploadFiles/",
    multiples: true,
    maxFieldsSize: Export.serveLimits.requestLimitMB * 1048576
  };
}
function buildBodyParser() {
  bodyParserServer = bodyParser.json({ limit: Export.serveLimits.requestLimitMB + "mb" });
}
function buildSession() {
  if (!Export.serveLimits.sessionTimeMinutes || !Export.serveLimits.sessionTotalRamMB) {
    SessionStore = (req, res, next) => next();
    return;
  }
  SessionStore = session({
    cookie: { maxAge: Export.serveLimits.sessionTimeMinutes * 60 * 1e3, sameSite: true },
    secret: SessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: Export.serveLimits.sessionCheckPeriodMinutes * 60 * 1e3,
      max: Export.serveLimits.sessionTotalRamMB * 1048576
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
  const Settings5 = await GetSettings(Export.settingsPath, DevMode_);
  if (Settings5 == null)
    return;
  if (Settings5.development)
    Object.assign(Settings5, Settings5.implDev);
  else
    Object.assign(Settings5, Settings5.implProd);
  copyJSON(Export.compile, Settings5.compile);
  copyJSON(Export.routing, Settings5.routing, ["ignoreTypes", "validPath"]);
  const concatArray = (name2, array) => Settings5.routing?.[name2] && (Export.routing[name2] = Settings5.routing[name2].concat(array));
  concatArray("ignoreTypes", baseRoutingIgnoreTypes);
  concatArray("validPath", baseValidPath);
  copyJSON(Export.serveLimits, Settings5.serveLimits, ["cacheDays", "cookiesExpiresDays"], "only");
  if (copyJSON(serveLimits, Settings5.serveLimits, ["sessionTotalRamMB", "sessionTimeMinutes", "sessionCheckPeriodMinutes"], "only")) {
    buildSession();
  }
  if (copyJSON(serveLimits, Settings5.serveLimits, ["fileLimitMB", "requestLimitMB"], "only")) {
    buildFormidable();
  }
  if (copyJSON(serveLimits, Settings5.serveLimits, ["requestLimitMB"], "only")) {
    buildBodyParser();
  }
  copyJSON(Export.serve, Settings5.serve);
  Export.development = Settings5.development;
  if (Settings5.general?.importOnLoad) {
    Export.general.importOnLoad = await StartRequire(Settings5.general.importOnLoad, DevMode_);
  }
  if (!copyJSON(Export.general, Settings5.general, ["pageInRam"], "only") && Settings5.development) {
    pageInRamActivate = await compilationScan;
  }
  if (Export.development && Export.routing.sitemap) {
    debugSiteMap(Export);
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
  if (!(Export.serve.http2 || Export.serve.greenLock?.agreeToTerms)) {
    return await DefaultListen(app);
  }
  if (!Export.serve.greenLock.agreeToTerms) {
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
      sites: Export.serve.greenLock.sites
    }),
    async exits(file, _, folder) {
      file = JSON.parse(file);
      for (const i in file.sites) {
        const e = file.sites[i];
        let have;
        for (const b of Export.serve.greenLock.sites) {
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
          const path22 = folder + "live/" + e.subject;
          if (await EasyFs_default.exists(path22)) {
            await DeleteInDirectory(path22);
            await EasyFs_default.rmdir(path22);
          }
        }
      }
      const newSites = Export.serve.greenLock.sites.filter((x) => !file.sites.find((b) => b.subject == x.subject));
      file.sites.push(...newSites);
      return JSON.stringify(file);
    }
  });
  const packageInfo = await EasyFs_default.readJsonFile(workingDirectory + "package.json");
  const greenlockObject = await new Promise((res) => Greenlock.init({
    packageRoot: workingDirectory,
    configDir: "SystemSave/greenlock",
    packageAgent: Export.serve.greenLock.agent || packageInfo.name + "/" + packageInfo.version,
    maintainerEmail: Export.serve.greenLock.email,
    cluster: Export.serve.greenLock.cluster,
    staging: Export.serve.greenLock.staging
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
  if (Export.serve.http2) {
    return CreateServer("http2Server", app.attach, { allowHTTP1: true });
  } else {
    return CreateServer("httpsServer", app.attach);
  }
}

// src/MainBuild/Server.ts
async function requestAndSettings(req, res) {
  if (Export.development) {
    await requireSettings();
  }
  return await changeURLRules(req, res);
}
async function changeURLRules(req, res) {
  let url = urlFix(req.path);
  for (let i of Export.routing.urlStop) {
    if (url.startsWith(i)) {
      if (i.endsWith("/")) {
        i = i.substring(0, i.length - 1);
      }
      return await filerURLRules(req, res, i);
    }
  }
  const RuleIndex = Object.keys(Export.routing.rules).find((i) => url.startsWith(i));
  if (RuleIndex) {
    url = await Export.routing.rules[RuleIndex](url, req, res);
  }
  await filerURLRules(req, res, url);
}
async function filerURLRules(req, res, url) {
  let notValid = Export.routing.ignorePaths.find((i) => url.startsWith(i)) || Export.routing.ignoreTypes.find((i) => url.endsWith("." + i));
  if (!notValid) {
    for (const valid of Export.routing.validPath) {
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
async function StartApp(Server) {
  const app = new TinyApp();
  if (!Export.serve.http2) {
    app.use(compression());
  }
  Settings4.SessionStore = async (req, res, next) => Export.middleware.session(req, res, next);
  const OpenListing = await StartListing(app, Server);
  for (const func of Export.general.importOnLoad) {
    await func(app, appOnline.server, Export);
  }
  await pageInRamActivateFunc()?.();
  app.all("*", ParseRequest);
  await OpenListing(Export.serve.port);
  console.log("App listing at port: " + Export.serve.port);
}
async function ParseRequest(req, res) {
  if (req.method == "POST") {
    if (req.headers["content-type"]?.startsWith?.("application/json")) {
      Export.middleware.bodyParser(req, res, () => requestAndSettings(req, res));
    } else {
      new formidable.IncomingForm(Export.middleware.formidable).parse(req, (err, fields, files) => {
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
async function StartListing(app, Server) {
  if (appOnline && appOnline.close) {
    await appOnline.close();
  }
  const { server, listen, close } = await Server(app);
  appOnline = { server, close };
  return listen;
}
async function StartServer({ SitePath = "./", HttpServer = UpdateGreenLock } = {}) {
  BasicSettings.WebSiteFolder = SitePath;
  buildFirstLoad();
  await requireSettings();
  StartApp(HttpServer);
}

// src/index.ts
var AsyncImport = (path22, importFrom = "async import") => LoadImport(importFrom, path22, getTypes.Static, { isDebug: Export.development });
var src_default = StartServer;
export {
  AsyncImport,
  SearchRecord,
  Export as Settings,
  src_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi93YXNtLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2Vzc2lvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvZXJyb3IudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd24udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaGVhZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3R5bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0NvbXBpbGVTdGF0ZS50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NpdGVNYXAudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GaWxlVHlwZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ltcG9ydEZpbGVSdW50aW1lLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQXBpQ2FsbC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0dldFBhZ2VzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvU2V0dGluZ3MudHMiLCAiLi4vc3JjL01haW5CdWlsZC9MaXN0ZW5HcmVlbkxvY2sudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBcHAgYXMgVGlueUFwcCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL1R5cGVzJztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5ncywgcmVxdWlyZVNldHRpbmdzLCBidWlsZEZpcnN0TG9hZCwgcGFnZUluUmFtQWN0aXZhdGVGdW5jfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBmb3JtaWRhYmxlIGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgVXBkYXRlR3JlZW5Mb2NrIH0gZnJvbSAnLi9MaXN0ZW5HcmVlbkxvY2snO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IGNoYW5nZVVSTFJ1bGVzKHJlcSwgcmVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hhbmdlVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgbGV0IHVybCA9IGZpbGVCeVVybC51cmxGaXgocmVxLnBhdGgpO1xuXG4gICAgXG4gICAgZm9yIChsZXQgaSBvZiBTZXR0aW5ncy5yb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpKSB7XG4gICAgICAgICAgICBpZiAoaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuc3Vic3RyaW5nKDAsIGkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSdWxlSW5kZXggPSBPYmplY3Qua2V5cyhTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzKS5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpO1xuXG4gICAgaWYgKFJ1bGVJbmRleCkge1xuICAgICAgICB1cmwgPSBhd2FpdCBTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzW1J1bGVJbmRleF0odXJsLCByZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgdXJsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZXJVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHVybDogc3RyaW5nKSB7XG4gICAgbGV0IG5vdFZhbGlkOiBhbnkgPSBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSkgfHwgU2V0dGluZ3Mucm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGkgPT4gdXJsLmVuZHNXaXRoKCcuJytpKSk7XG4gICAgXG4gICAgaWYoIW5vdFZhbGlkKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWxpZCBvZiBTZXR0aW5ncy5yb3V0aW5nLnZhbGlkUGF0aCl7IC8vIGNoZWNrIGlmIHVybCBpc24ndCB2YWxpZFxuICAgICAgICAgICAgaWYoIWF3YWl0IHZhbGlkKHVybCwgcmVxLCByZXMpKXtcbiAgICAgICAgICAgICAgICBub3RWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm90VmFsaWQpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gZmlsZUJ5VXJsLkdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCB1cmwuc3Vic3RyaW5nKDEpKTtcbn1cblxubGV0IGFwcE9ubGluZVxuXG4vKipcbiAqIEl0IHN0YXJ0cyB0aGUgc2VydmVyIGFuZCB0aGVuIGNhbGxzIFN0YXJ0TGlzdGluZ1xuICogQHBhcmFtIFtTZXJ2ZXJdIC0gVGhlIHNlcnZlciBvYmplY3QgdGhhdCBpcyBwYXNzZWQgaW4gYnkgdGhlIGNhbGxlci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gU3RhcnRBcHAoU2VydmVyPykge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBUaW55QXBwKCk7XG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICBhcHAudXNlKDxhbnk+Y29tcHJlc3Npb24oKSk7XG4gICAgfVxuICAgIGZpbGVCeVVybC5TZXR0aW5ncy5TZXNzaW9uU3RvcmUgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IFNldHRpbmdzLm1pZGRsZXdhcmUuc2Vzc2lvbihyZXEsIHJlcywgbmV4dCk7XG5cbiAgICBjb25zdCBPcGVuTGlzdGluZyA9IGF3YWl0IFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgU2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgYXdhaXQgZnVuYyhhcHAsIGFwcE9ubGluZS5zZXJ2ZXIsIFNldHRpbmdzKTtcbiAgICB9XG4gICAgYXdhaXQgcGFnZUluUmFtQWN0aXZhdGVGdW5jKCk/LigpXG5cbiAgICBhcHAuYWxsKFwiKlwiLCBQYXJzZVJlcXVlc3QpO1xuXG4gICAgYXdhaXQgT3Blbkxpc3RpbmcoU2V0dGluZ3Muc2VydmUucG9ydCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcCBsaXN0aW5nIGF0IHBvcnQ6IFwiICsgU2V0dGluZ3Muc2VydmUucG9ydCk7XG59XG5cbi8qKlxuICogSWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIHJlcXVlc3QsIHRoZW4gcGFyc2UgdGhlIHJlcXVlc3QgYm9keSwgdGhlbiBzZW5kIGl0IHRvIHJvdXRpbmcgc2V0dGluZ3NcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC0gVGhlIGluY29taW5nIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLSBSZXNwb25zZVxuICovXG5hc3luYyBmdW5jdGlvbiBQYXJzZVJlcXVlc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT0gJ1BPU1QnKSB7XG4gICAgICAgIGlmIChyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10/LnN0YXJ0c1dpdGg/LignYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICBTZXR0aW5ncy5taWRkbGV3YXJlLmJvZHlQYXJzZXIocmVxLCByZXMsICgpID0+IHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKFNldHRpbmdzLm1pZGRsZXdhcmUuZm9ybWlkYWJsZSkucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpIHtcbiAgICBpZiAoYXBwT25saW5lICYmIGFwcE9ubGluZS5jbG9zZSkge1xuICAgICAgICBhd2FpdCBhcHBPbmxpbmUuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcnZlciwgbGlzdGVuLCBjbG9zZSB9ID0gYXdhaXQgU2VydmVyKGFwcCk7XG5cbiAgICBhcHBPbmxpbmUgPSB7IHNlcnZlciwgY2xvc2UgfTtcblxuICAgIHJldHVybiBsaXN0ZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0U2VydmVyKHsgU2l0ZVBhdGggPSAnLi8nLCBIdHRwU2VydmVyID0gVXBkYXRlR3JlZW5Mb2NrIH0gPSB7fSkge1xuICAgIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciA9IFNpdGVQYXRoO1xuICAgIGJ1aWxkRmlyc3RMb2FkKCk7XG4gICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgU3RhcnRBcHAoSHR0cFNlcnZlcik7XG59XG5cbmV4cG9ydCB7IFNldHRpbmdzIH07IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcm9wID09ICdpbXBvcnRhbnQnKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5lcnJvcjtcbiAgICAgICAgICAgIFxuICAgICAgICBpZihwcmludE1vZGUgJiYgcHJvcCAhPSBcImRvLW5vdGhpbmdcIilcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQge0RpcmVudH0gZnJvbSAnZnMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtjd2R9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gJ3VybCdcbmltcG9ydCB7IEN1dFRoZUxhc3QgLCBTcGxpdEZpcnN0fSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVCeVNtYWxsUGF0aChzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIGdldFR5cGVzW1NwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnNoaWZ0KCldO1xufVxuXG5cblxuZXhwb3J0IHtcbiAgICBnZXREaXJuYW1lLFxuICAgIFN5c3RlbURhdGEsXG4gICAgd29ya2luZ0RpcmVjdG9yeSxcbiAgICBnZXRUeXBlcyxcbiAgICBCYXNpY1NldHRpbmdzXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuaW50ZXJmYWNlIGdsb2JhbFN0cmluZzxUPiB7XG4gICAgaW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBsYXN0SW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBzdGFydHNXaXRoKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0Rmlyc3Q8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4odHlwZTogc3RyaW5nLCBzdHJpbmc6IFQpOiBUW10ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YodHlwZSk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpXG4gICAgICAgIHJldHVybiBbc3RyaW5nXTtcblxuICAgIHJldHVybiBbc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCksIHN0cmluZy5zdWJzdHJpbmcoaW5kZXggKyB0eXBlLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3V0VGhlTGFzdCh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVuc2lvbjxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdHJpbmc6IFQpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLy4uL0pTUGFyc2VyJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9TZXNzaW9uJztcblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgPCV7P2RlYnVnX2ZpbGU/fSR7aS50ZXh0fSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVNjcmlwdENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnTGluZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlVGV4dENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlU2NyaXB0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VyLnN0YXJ0ID0gXCI8JVwiO1xuICAgIHBhcnNlci5lbmQgPSBcIiU+XCI7XG4gICAgcmV0dXJuIHBhcnNlci5SZUJ1aWxkVGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnSW5mbyhjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBhd2FpdCBQYXJzZVNjcmlwdENvZGUoY29kZSwgcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBBZGREZWJ1Z0luZm8oaXNvbGF0ZTogYm9vbGVhbiwgcGFnZU5hbWU6c3RyaW5nLCBGdWxsUGF0aDpzdHJpbmcsIFNtYWxsUGF0aDpzdHJpbmcsIGNhY2hlOiB7dmFsdWU/OiBzdHJpbmd9ID0ge30pe1xuICAgIGlmKCFjYWNoZS52YWx1ZSlcbiAgICAgICAgY2FjaGUudmFsdWUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbFBhdGgsICd1dGY4Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGxEYXRhOiBuZXcgU3RyaW5nVHJhY2tlcihgJHtwYWdlTmFtZX08bGluZT4ke1NtYWxsUGF0aH1gLCBpc29sYXRlID8gYDwleyU+JHtjYWNoZS52YWx1ZX08JX0lPmA6IGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkgPSB0aGlzLkRhdGFBcnJheS5jb25jYXQoZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcsIGluZm8gPSAnJykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheSA9IG5ld1N0cmluZy5EYXRhQXJyYXkuY29uY2F0KHRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgdGhpc1N1YnN0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzU3Vic3RyaW5nLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXNTdWJzdHJpbmcgPSB0aGlzU3Vic3RyaW5nLkN1dFN0cmluZyhpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IGVycm9yIGluZm8gZm9ybSBlcnJvciBtZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIGRlYnVnTGluZSh7IG1lc3NhZ2UsIHRleHQsIGxvY2F0aW9uLCBsaW5lLCBjb2x9OiB7IG1lc3NhZ2U/OiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcsIGxvY2F0aW9uPzogeyBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBsaW5lVGV4dD86IHN0cmluZyB9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXJ9KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSA/PyBsb2NhdGlvbj8ubGluZSA/PyAxKSwgY29sdW1uID0gY29sID8/IGxvY2F0aW9uPy5jb2x1bW4gPz8gMDtcbiAgICAgICAgaWYgKHNlYXJjaExpbmUuc3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgICAgICAgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZSgobGluZSA/PyBsb2NhdGlvbj8ubGluZSkgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHNlYXJjaExpbmUuYXQoY29sdW1uLTEpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgcmV0dXJuIGAke3RleHQgfHwgbWVzc2FnZX0sIG9uIGZpbGUgLT5cXG4ke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoK3NlYXJjaExpbmUuZXh0cmFjdEluZm8oKX06JHtkYXRhLmxpbmV9OiR7ZGF0YS5jaGFyfSR7bG9jYXRpb24/LmxpbmVUZXh0ID8gJ1xcbkxpbmU6IFwiJyArIGxvY2F0aW9uLmxpbmVUZXh0LnRyaW0oKSArICdcIic6ICcnfWA7XG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1dpdGhUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBvdXRwdXRXaXRoTWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24pXG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1RhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uLCBodHRwU291cmNlLCByZWxhdGl2ZSlcbiAgICB9XG59IiwgImltcG9ydCB7cHJvbWlzZXN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuY29uc3QgbG9hZFBhdGggPSB0eXBlb2YgZXNidWlsZCAhPT0gJ3VuZGVmaW5lZCcgPyAnLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC8nOiAnLy4uLyc7XG5jb25zdCB3YXNtTW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShhd2FpdCBwcm9taXNlcy5yZWFkRmlsZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCArIGxvYWRQYXRoICsgJ2J1aWxkLndhc20nKSkpO1xuY29uc3Qgd2FzbUluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKHdhc21Nb2R1bGUsIHt9KTtcbmNvbnN0IHdhc20gPSB3YXNtSW5zdGFuY2UuZXhwb3J0cztcblxubGV0IFdBU01fVkVDVE9SX0xFTiA9IDA7XG5cbmxldCBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRVaW50OE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0VWludDhNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0VWludDhNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0VWludDhNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dEVuY29kZXIgPSB0eXBlb2YgVGV4dEVuY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHRFbmNvZGVyIDogVGV4dEVuY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBsVGV4dEVuY29kZXIoJ3V0Zi04Jyk7XG5cbmNvbnN0IGVuY29kZVN0cmluZyA9ICh0eXBlb2YgY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvKGFyZywgdmlldyk7XG59XG4gICAgOiBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgdmlldy5zZXQoYnVmKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZWFkOiBhcmcubGVuZ3RoLFxuICAgICAgICB3cml0dGVuOiBidWYubGVuZ3RoXG4gICAgfTtcbn0pO1xuXG5mdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykge1xuXG4gICAgaWYgKHJlYWxsb2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICAgICAgY29uc3QgcHRyID0gbWFsbG9jKGJ1Zi5sZW5ndGgpO1xuICAgICAgICBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGJ1Zi5sZW5ndGgpLnNldChidWYpO1xuICAgICAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBidWYubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGxldCBsZW4gPSBhcmcubGVuZ3RoO1xuICAgIGxldCBwdHIgPSBtYWxsb2MobGVuKTtcblxuICAgIGNvbnN0IG1lbSA9IGdldFVpbnQ4TWVtb3J5MCgpO1xuXG4gICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICBmb3IgKDsgb2Zmc2V0IDwgbGVuOyBvZmZzZXQrKykge1xuICAgICAgICBjb25zdCBjb2RlID0gYXJnLmNoYXJDb2RlQXQob2Zmc2V0KTtcbiAgICAgICAgaWYgKGNvZGUgPiAweDdGKSBicmVhaztcbiAgICAgICAgbWVtW3B0ciArIG9mZnNldF0gPSBjb2RlO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXQgIT09IGxlbikge1xuICAgICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2Uob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBwdHIgPSByZWFsbG9jKHB0ciwgbGVuLCBsZW4gPSBvZmZzZXQgKyBhcmcubGVuZ3RoICogMyk7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7XG4gICAgICAgIGNvbnN0IHJldCA9IGVuY29kZVN0cmluZyhhcmcsIHZpZXcpO1xuXG4gICAgICAgIG9mZnNldCArPSByZXQud3JpdHRlbjtcbiAgICB9XG5cbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBvZmZzZXQ7XG4gICAgcmV0dXJuIHB0cjtcbn1cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0odGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfY2xvc2VfY2hhcih0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5sZXQgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0SW50MzJNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldEludDMyTWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldEludDMyTWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldEludDMyTWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHREZWNvZGVyID0gdHlwZW9mIFRleHREZWNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RGVjb2RlciA6IFRleHREZWNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dERlY29kZXIgPSBuZXcgbFRleHREZWNvZGVyKCd1dGYtOCcsIHsgaWdub3JlQk9NOiB0cnVlLCBmYXRhbDogdHJ1ZSB9KTtcblxuY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7XG5cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cbi8qKlxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfZXJyb3JzKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB3YXNtLmdldF9lcnJvcnMocmV0cHRyKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBibG9ja1xuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9ibG9jayh0ZXh0LCBibG9jaykge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoYmxvY2ssIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2VuZF9ibG9jayhwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHNraXBfc3BlY2lhbF90YWdcbiogQHBhcmFtIHtzdHJpbmd9IHNpbXBsZV9za2lwXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydF9jb21wb25lbnQoc2tpcF9zcGVjaWFsX3RhZywgc2ltcGxlX3NraXApIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHNraXBfc3BlY2lhbF90YWcsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNpbXBsZV9za2lwLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgd2FzbS5pbnNlcnRfY29tcG9uZW50KHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGVuZF90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBlbmRfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoZW5kX3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2VuZF9vZl9kZWYocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBxX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2VuZF9vZl9xKHB0cjAsIGxlbjAsIHFfdHlwZS5jb2RlUG9pbnRBdCgwKSk7XG4gICAgcmV0dXJuIHJldCA+Pj4gMDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHJhem9yX3RvX2Vqcyh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5yYXpvcl90b19lanMocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHJhem9yX3RvX2Vqc19taW4odGV4dCwgbmFtZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAobmFtZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5yYXpvcl90b19lanNfbWluKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gc3RhcnRcbiogQHBhcmFtIHtzdHJpbmd9IGVuZFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBlanNfcGFyc2UodGV4dCwgc3RhcnQsIGVuZCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc3RhcnQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIyID0gcGFzc1N0cmluZ1RvV2FzbTAoZW5kLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4yID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLmVqc19wYXJzZShyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEsIHB0cjIsIGxlbjIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcGFnZV9iYXNlX3BhcnNlcih0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5wYWdlX2Jhc2VfcGFyc2VyKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBodG1sX2F0dHJfcGFyc2VyKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLmh0bWxfYXR0cl9wYXJzZXIocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBjb25zdCBTaW1wbGVTa2lwID0gWyd0ZXh0YXJlYScsJ3NjcmlwdCcsICdzdHlsZSddO1xuZXhwb3J0IGNvbnN0IFNraXBTcGVjaWFsVGFnID0gW1tcIiVcIiwgXCIlXCJdLCBbXCIje2RlYnVnfVwiLCBcIntkZWJ1Z30jXCJdXTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgZmluZF9lbmRfb2ZfZGVmLCBmaW5kX2VuZF9vZl9xLCBmaW5kX2VuZF9ibG9jayB9IGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyc7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMnO1xuaW1wb3J0IHsgZ2V0RGlybmFtZSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuZXhwb3J0IGNvbnN0IHBvb2wgPSB3b3JrZXJQb29sLnBvb2woU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50L3dvcmtlckluc2VydENvbXBvbmVudC5qcycsIHsgbWF4V29ya2VyczogY3B1TGVuZ3RoIH0pO1xuXG5leHBvcnQgY2xhc3MgQmFzZVJlYWRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZW5kIG9mIHF1b3RhdGlvbiBtYXJrcywgc2tpcHBpbmcgdGhpbmdzIGxpa2UgZXNjYXBpbmc6IFwiXFxcXFwiXCJcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVudE9mUSh0ZXh0OiBzdHJpbmcsIHFUeXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShFbmRUeXBlKSkge1xuICAgICAgICAgICAgRW5kVHlwZSA9IFtFbmRUeXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgSlNPTi5zdHJpbmdpZnkoRW5kVHlwZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhbWUgYXMgJ2ZpbmRFbmRPZkRlZicgb25seSB3aXRoIG9wdGlvbiB0byBjdXN0b20gJ29wZW4nIGFuZCAnY2xvc2UnXG4gICAgICogYGBganNcbiAgICAgKiBGaW5kRW5kT2ZCbG9jayhgY29vbCBcIn1cIiB7IGRhdGEgfSB9IG5leHRgLCAneycsICd9JylcbiAgICAgKiBgYGBcbiAgICAgKiBpdCB3aWxsIHJldHVybiB0aGUgMTggLT4gXCJ9IG5leHRcIlxuICAgICAqICBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgRmluZEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCBvcGVuOiBzdHJpbmcsIGVuZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX2Jsb2NrKHRleHQsIG9wZW4gKyBlbmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIFNpbXBsZVNraXA6IHN0cmluZ1tdID0gU2V0dGluZ3MuU2ltcGxlU2tpcDtcbiAgICBTa2lwU3BlY2lhbFRhZzogc3RyaW5nW11bXSA9IFNldHRpbmdzLlNraXBTcGVjaWFsVGFnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmludE5ldz86IGFueSkgeyB9XG5cbiAgICBwcml2YXRlIHByaW50RXJyb3JzKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGVycm9yczogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmludE5ldykgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBKU09OLnBhcnNlKGVycm9ycykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50TmV3KHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke2kudHlwZV9uYW1lfVwiLCB1c2VkIGluOiAke3RleHQuYXQoTnVtYmVyKGkuaW5kZXgpKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFyKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhcicsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhckhUTUwodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFySFRNTCcsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG59XG5cbnR5cGUgUGFyc2VCbG9ja3MgPSB7IG5hbWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfVtdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTKHRleHQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlMnLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlNNaW5pKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXJbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKU01pbmknLCBbdGV4dCxmaW5kXSkpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFSlNQYXJzZXIodGV4dDogc3RyaW5nLCBzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ0VKU1BhcnNlcicsIFt0ZXh0LCBzdGFydCwgZW5kXSkpO1xufSIsICJcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cbmludGVyZmFjZSBTcGxpdFRleHQge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICB0eXBlX25hbWU6IHN0cmluZyxcbiAgICBpc19za2lwOiBib29sZWFuXG59XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmNvbnN0IHBhcnNlX3N0cmVhbSA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9yZWFkZXIvd29ya2VyLmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQYXJzZVRleHRTdHJlYW0odGV4dDogc3RyaW5nKTogUHJvbWlzZTxTcGxpdFRleHRbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdidWlsZF9zdHJlYW0nLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mRGVmU2tpcEJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2ZpbmRfZW5kX29mX2RlZl9za2lwX2Jsb2NrJywgW3RleHQsIEpTT04uc3RyaW5naWZ5KHR5cGVzKV0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdlbmRfb2ZfYmxvY2snLCBbdGV4dCwgdHlwZXMuam9pbignJyldKTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgQmFzZUVudGl0eUNvZGUge1xuICAgIFJlcGxhY2VBbGwodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZykge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0ZXh0LnNwbGl0KGZpbmQpKSB7XG4gICAgICAgICAgICBuZXdUZXh0ICs9IHJlcGxhY2UgKyBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQuc3Vic3RyaW5nKHJlcGxhY2UubGVuZ3RoKTtcbiAgICB9XG59XG5cblxuYWJzdHJhY3QgY2xhc3MgUmVCdWlsZENvZGVCYXNpYyBleHRlbmRzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBwdWJsaWMgUGFyc2VBcnJheTogU3BsaXRUZXh0W107XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLlBhcnNlQXJyYXkgPSBQYXJzZUFycmF5O1xuICAgIH1cblxuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgbGV0IE91dFN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgT3V0U3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLlJlcGxhY2VBbGwoT3V0U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cblxuXG50eXBlIERhdGFDb2RlSW5mbyA9IHtcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgaW5wdXRzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgY2xhc3MgUmVCdWlsZENvZGVTdHJpbmcgZXh0ZW5kcyBSZUJ1aWxkQ29kZUJhc2ljIHtcbiAgICBwcml2YXRlIERhdGFDb2RlOiBEYXRhQ29kZUluZm87XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcihQYXJzZUFycmF5KTtcbiAgICAgICAgdGhpcy5EYXRhQ29kZSA9IHsgdGV4dDogXCJcIiwgaW5wdXRzOiBbXSB9O1xuICAgICAgICB0aGlzLkNyZWF0ZURhdGFDb2RlKCk7XG4gICAgfVxuXG4gICAgZ2V0IENvZGVCdWlsZFRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLnRleHQ7XG4gICAgfVxuXG4gICAgc2V0IENvZGVCdWlsZFRleHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IEFsbElucHV0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ3JlYXRlRGF0YUNvZGUoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChpLmlzX3NraXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gYDx8JHt0aGlzLkRhdGFDb2RlLmlucHV0cy5sZW5ndGh9fCR7aS50eXBlX25hbWUgPz8gJyd9fD5gO1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUuaW5wdXRzLnB1c2goaS50ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlmIHRoZSA8fHw+IHN0YXJ0IHdpdGggYSAoKy4pIGxpa2UgdGhhdCBmb3IgZXhhbXBsZSwgXCIrLjx8fD5cIiwgdGhlIHVwZGF0ZSBmdW5jdGlvbiB3aWxsIGdldCB0aGUgbGFzdCBcIlNraXBUZXh0XCIgaW5zdGVhZCBnZXR0aW5nIHRoZSBuZXcgb25lXG4gICAgICogc2FtZSB3aXRoIGEgKC0uKSBqdXN0IGZvciBpZ25vcmluZyBjdXJyZW50IHZhbHVlXG4gICAgICogQHJldHVybnMgdGhlIGJ1aWxkZWQgY29kZVxuICAgICAqL1xuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5EYXRhQ29kZS50ZXh0LnJlcGxhY2UoLzxcXHwoWzAtOV0rKVxcfFtcXHddKlxcfD4vZ2ksIChfLCBnMSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzW2cxXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLlJlcGxhY2VBbGwobmV3U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8gfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBFSlNQYXJzZXIgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL3RyYW5zZm9ybS9FYXN5U2NyaXB0JztcblxuaW50ZXJmYWNlIEpTUGFyc2VyVmFsdWVzIHtcbiAgICB0eXBlOiAndGV4dCcgfCAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU1BhcnNlciB7XG4gICAgcHVibGljIHN0YXJ0OiBzdHJpbmc7XG4gICAgcHVibGljIHRleHQ6IFN0cmluZ1RyYWNrZXI7XG4gICAgcHVibGljIGVuZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWVzOiBKU1BhcnNlclZhbHVlc1tdO1xuXG4gICAgY29uc3RydWN0b3IodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBzdGFydCA9IFwiPCVcIiwgZW5kID0gXCIlPlwiLCB0eXBlID0gJ3NjcmlwdCcpIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBSZXBsYWNlVmFsdWVzKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlQWxsKGZpbmQsIHJlcGxhY2UpO1xuICAgIH1cblxuICAgIGZpbmRFbmRPZkRlZkdsb2JhbCh0ZXh0OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGVxID0gdGV4dC5lcVxuICAgICAgICBjb25zdCBmaW5kID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZXEsIFsnOycsICdcXG4nLCB0aGlzLmVuZF0pO1xuICAgICAgICByZXR1cm4gZmluZCAhPSAtMSA/IGZpbmQgKyAxIDogZXEubGVuZ3RoO1xuICAgIH1cblxuICAgIFNjcmlwdFdpdGhJbmZvKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgV2l0aEluZm8gPSBuZXcgU3RyaW5nVHJhY2tlcih0ZXh0LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsU2NyaXB0ID0gdGV4dC5zcGxpdCgnXFxuJyksIGxlbmd0aCA9IGFsbFNjcmlwdC5sZW5ndGg7XG4gICAgICAgIC8vbmV3IGxpbmUgZm9yIGRlYnVnIGFzIG5ldyBsaW5lIHN0YXJ0XG4gICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuXG4gICAgICAgIC8vZmlsZSBuYW1lIGluIGNvbW1lbnRcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNjcmlwdCkge1xuXG4gICAgICAgICAgICBpZihpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlU2FmZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlYnVnXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgXFxucnVuX3NjcmlwdF9uYW1lID0gXFxgJHtKU1BhcnNlci5maXhUZXh0KHN1YnN0cmluZyl9XFxgO2BcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzdWJzdHJpbmcsXG4gICAgICAgICAgICAgICAgdHlwZTogPGFueT50eXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0KHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvYC9naSwgJ1xcXFxgJykucmVwbGFjZSgvXFx1MDAyNC9naSwgJ1xcXFx1MDAyNCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0U2ltcGxlUXVvdGVzKHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpO1xuICAgIH1cblxuICAgIFJlQnVpbGRUZXh0KCkge1xuICAgICAgICBjb25zdCBhbGxjb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaS50eXBlID09ICduby10cmFjaycpIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgJyEnLCBpLnRleHQsIHRoaXMuZW5kKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgaS50ZXh0LCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsY29kZTtcbiAgICB9XG5cbiAgICBCdWlsZEFsbChpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHJ1blNjcmlwdCA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuXG4gICAgICAgIGlmICghdGhpcy52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMkYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRGVidWcgJiYgaS50eXBlID09ICdzY3JpcHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYFxcbnJ1bl9zY3JpcHRfY29kZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmlwdFdpdGhJbmZvKGkudGV4dClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcmludEVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYDxwIHN0eWxlPVwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcIj4ke0pTUGFyc2VyLmZpeFRleHQobWVzc2FnZSl9PC9wPmA7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIFJ1bkFuZEV4cG9ydCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRleHQsIHBhdGgpXG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLkJ1aWxkQWxsKGlzRGVidWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHNwbGl0MkZyb21FbmQodGV4dDogc3RyaW5nLCBzcGxpdENoYXI6IHN0cmluZywgbnVtVG9TcGxpdEZyb21FbmQgPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0ZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PSBzcGxpdENoYXIpIHtcbiAgICAgICAgICAgICAgICBudW1Ub1NwbGl0RnJvbUVuZC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtVG9TcGxpdEZyb21FbmQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdGV4dC5zdWJzdHJpbmcoMCwgaSksIHRleHQuc3Vic3RyaW5nKGkgKyAxKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RleHRdO1xuICAgIH1cbn1cblxuXG4vL2J1aWxkIHNwZWNpYWwgY2xhc3MgZm9yIHBhcnNlciBjb21tZW50cyAvKiovIHNvIHlvdSBiZSBhYmxlIHRvIGFkZCBSYXpvciBpbnNpZGUgb2Ygc3R5bGUgb3Qgc2NyaXB0IHRhZ1xuXG5pbnRlcmZhY2UgR2xvYmFsUmVwbGFjZUFycmF5IHtcbiAgICB0eXBlOiAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgY2xhc3MgRW5hYmxlR2xvYmFsUmVwbGFjZSB7XG4gICAgcHJpdmF0ZSBzYXZlZEJ1aWxkRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5W10gPSBbXTtcbiAgICBwcml2YXRlIGJ1aWxkQ29kZTogUmVCdWlsZENvZGVTdHJpbmc7XG4gICAgcHJpdmF0ZSBwYXRoOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZXBsYWNlcjogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGRUZXh0ID0gXCJcIikge1xuICAgICAgICB0aGlzLnJlcGxhY2VyID0gUmVnRXhwKGAke2FkZFRleHR9XFxcXC9cXFxcKiFzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PlxcXFwqXFxcXC98c3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5gKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgICAgICB0aGlzLmJ1aWxkQ29kZSA9IG5ldyBSZUJ1aWxkQ29kZVN0cmluZyhhd2FpdCBQYXJzZVRleHRTdHJlYW0oYXdhaXQgdGhpcy5FeHRyYWN0QW5kU2F2ZUNvZGUoY29kZSkpKTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIEV4dHJhY3RBbmRTYXZlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb2RlID0gbmV3IEpTUGFyc2VyKGNvZGUsIHRoaXMucGF0aCk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb2RlLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgbGV0IG5ld1RleHQgPSBcIlwiO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb2RlLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBuZXdUZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlZEJ1aWxkRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogaS50eXBlLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpLnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBuZXdUZXh0ICs9IGBzeXN0ZW0tLTx8ZWpzfCR7Y291bnRlcisrfXw+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUGFyc2VPdXRzaWRlT2ZDb21tZW50KHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZXIoL3N5c3RlbS0tPFxcfGVqc1xcfChbMC05XSlcXHw+LywgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IFNwbGl0VG9SZXBsYWNlWzFdO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGluZGV4LlN0YXJ0SW5mbykuUGx1cyRgJHt0aGlzLmFkZFRleHR9Lyohc3lzdGVtLS08fGVqc3wke2luZGV4fXw+Ki9gO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgU3RhcnRCdWlsZCgpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvbW1lbnRzID0gbmV3IEpTUGFyc2VyKG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQpLCB0aGlzLnBhdGgsICcvKicsICcqLycpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29tbWVudHMuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvbW1lbnRzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpLnRleHQgPSB0aGlzLlBhcnNlT3V0c2lkZU9mQ29tbWVudChpLnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCA9IGV4dHJhY3RDb21tZW50cy5SZUJ1aWxkVGV4dCgpLmVxO1xuICAgICAgICByZXR1cm4gdGhpcy5idWlsZENvZGUuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZXN0b3JlQXNDb2RlKERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheSkge1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoRGF0YS50ZXh0LlN0YXJ0SW5mbykuUGx1cyRgPCUke0RhdGEudHlwZSA9PSAnbm8tdHJhY2snID8gJyEnOiAnJ30ke0RhdGEudGV4dH0lPmA7XG4gICAgfVxuXG4gICAgcHVibGljIFJlc3RvcmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZXIodGhpcy5yZXBsYWNlciwgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihTcGxpdFRvUmVwbGFjZVsxXSA/PyBTcGxpdFRvUmVwbGFjZVsyXSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLlJlc3RvcmVBc0NvZGUodGhpcy5zYXZlZEJ1aWxkRGF0YVtpbmRleF0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwgImltcG9ydCB7IGJ1aWxkLCBNZXNzYWdlLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuL3ByaW50TWVzc2FnZSc7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeUpTKHRleHQ6IHN0cmluZywgdHJhY2tlcjogU3RyaW5nVHJhY2tlcil7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qge2NvZGUsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybSh0ZXh0LCB7bWluaWZ5OiB0cnVlfSk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0cmFja2VyLCB3YXJuaW5ncyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcih0cmFja2VyLCBlcnIpXG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xufSIsICJpbXBvcnQgeyBidWlsZCwgTWVzc2FnZSwgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludEVycm9yKHtlcnJvcnN9OiB7ZXJyb3JzOiAgTWVzc2FnZVtdfSwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBmb3IoY29uc3QgZXJyIG9mIGVycm9ycyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBgJHtlcnIudGV4dH0sIG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyBlcnIubG9jYXRpb24uZmlsZX06JHtlcnI/LmxvY2F0aW9uPy5saW5lID8/IDB9OiR7ZXJyPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3Qgc291cmNlID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcihlcnIubG9jYXRpb24pO1xuICAgICAgICBpZihzb3VyY2Uuc291cmNlKVxuICAgICAgICAgICAgZXJyLmxvY2F0aW9uID0gPGFueT5zb3VyY2U7XG4gICAgfVxuICAgIEVTQnVpbGRQcmludEVycm9yKHtlcnJvcnN9LCBmaWxlUGF0aCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzOiBNZXNzYWdlW10sIGZpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogd2Fybi5wbHVnaW5OYW1lLFxuICAgICAgICAgICAgdGV4dDogYCR7d2Fybi50ZXh0fSBvbiBmaWxlIC0+ICR7ZmlsZVBhdGggPz8gd2Fybi5sb2NhdGlvbi5maWxlfToke3dhcm4/LmxvY2F0aW9uPy5saW5lID8/IDB9OiR7d2Fybj8ubG9jYXRpb24/LmNvbHVtbiA/PyAwfWBcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihiYXNlOiBTdHJpbmdUcmFja2VyLCB3YXJuaW5nczogTWVzc2FnZVtdKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogd2Fybi5wbHVnaW5OYW1lLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUod2FybilcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIHtlcnJvcnN9OntlcnJvcnM6IE1lc3NhZ2VbXX0pIHtcbiAgICBmb3IoY29uc3QgZXJyIG9mIGVycm9ycyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IGJhc2UuZGVidWdMaW5lKGVycilcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdQcmludCh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgICAgIHJldHVybiBbdHlwZSA9PSAnZXJyb3InID8gJ2ltcG9ydGFudCc6IHR5cGUsICh0ZXh0LnJlcGxhY2UoLzxsaW5lPi9naSwgJyAtPiAnKSArIGBcXG5cXG5FcnJvci1Db2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKV07XG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5jb25zdCBzZXJ2ZVNjcmlwdCA9ICcvc2Vydi90ZW1wLmpzJztcblxuYXN5bmMgZnVuY3Rpb24gdGVtcGxhdGUoQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlOiBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIG5hbWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIHBhcmFtczogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3Ike3NlbGVjdG9yID8gYCA9IFwiJHtzZWxlY3Rvcn1cImA6ICcnfSwgb3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9KXtcbiAgICAgICAgY29uc3Qge3dyaXRlLCB3cml0ZVNhZmUsIHNldFJlc3BvbnNlLCBzZW5kVG9TZWxlY3Rvcn0gPSBuZXcgYnVpbGRUZW1wbGF0ZShvdXRfcnVuX3NjcmlwdCk7XG4gICAgICAgICR7YXdhaXQgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlKHBhcnNlKX1cbiAgICAgICAgdmFyIGV4cG9ydHMgPSAke25hbWV9LmV4cG9ydHM7XG4gICAgICAgIHJldHVybiBzZW5kVG9TZWxlY3RvcihzZWxlY3Rvciwgb3V0X3J1bl9zY3JpcHQudGV4dCk7XG4gICAgfVxcbiR7bmFtZX0uZXhwb3J0cyA9IHt9O2Bcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLnBvcEFueVRyYWNrZXIoJ25hbWUnLCAnY29ubmVjdCcpLFxuICAgICAgICBkYXRhVGFnLnBvcEFueVRyYWNrZXIoJ3BhcmFtcycsICcnKSxcbiAgICAgICAgZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdzZWxlY3RvcicsICcnKSxcbiAgICAgICAgQmV0d2VlblRhZ0RhdGEsXG4gICAgICAgIHBhdGhOYW1lLFxuICAgICAgICBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpXG4gICAgKTtcblxuICAgIGNvbnN0IGFkZFNjcmlwdCA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSk7XG4gICAgaWYgKEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIk1pbkpTXCIpIHx8IEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIk1pbkFsbFwiKSkge1xuICAgICAgICBhZGRTY3JpcHQuYWRkVGV4dChhd2FpdCBtaW5pZnlKUyhzY3JpcHRJbmZvLmVxLCBCZXR3ZWVuVGFnRGF0YSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRTdHJpbmdUcmFja2VyKHNjcmlwdEluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBsZXQgUmVzQ29kZSA9IEJldHdlZW5UYWdEYXRhO1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZShcInNlcnZcIik7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUpO1xuXG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFeHRyYWN0ZWQgPSBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCk7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlbWFwOiAnZXh0ZXJuYWwnLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHttYXAsIGNvZGUsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgd2FybmluZ3MpO1xuICAgICAgICBcbiAgICAgICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBtYXApKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4vU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG1hcCA9IHR5cGVvZiBzb3VyY2VNYXAgPT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHNvdXJjZU1hcCk6IHNvdXJjZU1hcDtcblxuICAgIGNvbnN0IHRyYWNrQ29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIGNvbnN0IHNwbGl0TGluZXMgPSB0cmFja0NvZGUuc3BsaXQoJ1xcbicpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGlzTWFwID0gc3BsaXRMaW5lc1ttLmdlbmVyYXRlZExpbmUgLSAxXTtcbiAgICAgICAgaWYgKCFpc01hcCkgcmV0dXJuO1xuXG5cbiAgICAgICAgbGV0IGNoYXJDb3VudCA9IDE7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBpc01hcC5zdWJzdHJpbmcobS5nZW5lcmF0ZWRDb2x1bW4gPyBtLmdlbmVyYXRlZENvbHVtbiAtIDE6IDApLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgICAgICBpLmluZm8gPSBtLnNvdXJjZTtcbiAgICAgICAgICAgIGkubGluZSA9IG0ub3JpZ2luYWxMaW5lO1xuICAgICAgICAgICAgaS5jaGFyID0gY2hhckNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFja0NvZGU7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlcikge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIpO1xuICAgIHJldHVybiBuZXdUcmFja2VyO1xufVxuXG5mdW5jdGlvbiBtZXJnZVNhc3NJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgZ2VuZXJhdGVkOiBTdHJpbmdUcmFja2VyLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxMaW5lcyA9IG9yaWdpbmFsLnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ2VuZXJhdGVkLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgIGlmKGl0ZW0uaW5mbyA9PSBteVNvdXJjZSl7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBvcmlnaW5hbExpbmVzW2l0ZW0ubGluZSAtIDFdLmF0KGl0ZW0uY2hhci0xKT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgICAgIGl0ZW0uaW5mbyA9IGluZm87XG4gICAgICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbS5pbmZvKSB7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgoaXRlbS5pbmZvKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja1RvT3JpZ2luYWxTc3Mob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXAsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuZXdUcmFja2VyID0gYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIHNvdXJjZU1hcCk7XG4gICAgbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIsIG15U291cmNlKTtcblxuICAgIHJldHVybiBuZXdUcmFja2VyO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLnBvcFN0cmluZygndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6IHNlc3Npb25JbmZvLmRlYnVnID8gJ2V4dGVybmFsJyA6IGZhbHNlLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgbWFwLCBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhLmVxLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG5cbiAgICAgICAgcmVzdWx0Q29kZSA9IGNvZGU7XG4gICAgICAgIHJlc3VsdE1hcCA9IG1hcDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoaXNNb2RlbCA/ICdtb2R1bGUnIDogJ3NjcmlwdCcsIHRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHRNYXApIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKEpTT04ucGFyc2UocmVzdWx0TWFwKSwgQmV0d2VlblRhZ0RhdGEsIHJlc3VsdENvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRUZXh0KHJlc3VsdENvZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHNjcmlwdFdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNjcmlwdFdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgaWYgKGRhdGFUYWcuZXhpc3RzKCdzcmMnKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtCZXR3ZWVuVGFnRGF0YX08L3NjcmlwdD5gXG4gICAgICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdsYW5nJywgJ2pzJyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdzZXJ2ZXInKSkge1xuICAgICAgICByZXR1cm4gc2NyaXB0V2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NyaXB0V2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdIDogZ2V0VHlwZXMubm9kZV9tb2R1bGVzWzBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKHVybCwgcGF0aFRvRmlsZVVSTChvcmlnaW5hbFBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFsnc2NzcycsICdzYXNzJ10uaW5jbHVkZXMobGFuZ3VhZ2UpID8gU29tZVBsdWdpbnMoXCJNaW5BbGxcIiwgXCJNaW5TYXNzXCIpIDogU29tZVBsdWdpbnMoXCJNaW5Dc3NcIiwgXCJNaW5BbGxcIikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3R5bGUobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPiAke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsICB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG91dFN0eWxlQXNUcmltID0gQmV0d2VlblRhZ0RhdGEuZXEudHJpbSgpO1xuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZS5zdHlsZS5pbmNsdWRlcyhvdXRTdHlsZUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLnB1c2gob3V0U3R5bGVBc1RyaW0pO1xuXG4gICAgY29uc3QgeyByZXN1bHQsIG91dFN0eWxlIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc3R5bGUnLCBkYXRhVGFnLCAgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdD8uc291cmNlTWFwKVxuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoU291cmNlTWFwU3RvcmUuZml4VVJMU291cmNlTWFwKDxhbnk+cmVzdWx0LnNvdXJjZU1hcCksIEJldHdlZW5UYWdEYXRhLCBvdXRTdHlsZSk7XG4gICAgZWxzZVxuICAgICAgICBwdXNoU3R5bGUuYWRkU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgeyB0ZXh0OiBvdXRTdHlsZSB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHN0eWxlV2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc3R5bGVXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnY3NzJyk7XG5cbiAgICBpZihkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKXtcbiAgICAgICAgcmV0dXJuIHN0eWxlV2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlV2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IHBhdGhfbm9kZS5qb2luKHNtYWxsUGF0aCwgJy8uLi8nLCBpbnB1dFBhdGgpO1xuICAgIH1cblxuICAgIGlmICghcGF0aF9ub2RlLmV4dG5hbWUoaW5wdXRQYXRoKSlcbiAgICAgICAgaW5wdXRQYXRoICs9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7IENvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkIH0gfSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdChcImZyb21cIik7XG5cbiAgICBjb25zdCBpblN0YXRpYyA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHNtYWxsUGF0aFRvUGFnZSh0eXBlLmV4dHJhY3RJbmZvKCkpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWMsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogJHt0eXBlLmF0KDApLmxpbmVJbmZvfSAtPiAke0Z1bGxQYXRofWAsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdwYWdlLW5vdC1mb3VuZCcsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBKU1BhcnNlci5wcmludEVycm9yKGBQYWdlIG5vdCBmb3VuZDogJHtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKHR5cGUubGluZUluZm8pfSAtPiAke1NtYWxsUGF0aH1gKSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgUmV0dXJuRGF0YTogU3RyaW5nVHJhY2tlcjtcblxuICAgIGNvbnN0IGhhdmVDYWNoZSA9IGNhY2hlTWFwW2luU3RhdGljXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb24gfSA9IGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKGluU3RhdGljLCBnZXRUeXBlcy5TdGF0aWMsIHsgbmVzdGVkUGFnZTogcGF0aE5hbWUsIG5lc3RlZFBhZ2VEYXRhOiBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdvYmplY3QnKSB9KTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW2luU3RhdGljXSA9IHsgQ29tcGlsZWREYXRhOiA8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb24gfTtcbiAgICAgICAgUmV0dXJuRGF0YSA9IDxTdHJpbmdUcmFja2VyPkNvbXBpbGVkRGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgbmV3U2Vzc2lvbiB9ID0gY2FjaGVNYXBbaW5TdGF0aWNdO1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgdGhpcy5zYXZlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5zYXZlUGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gSlNPTi5wYXJzZShhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCkgfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBrZXkgaXMgaW4gdGhlIHN0b3JlLCByZXR1cm4gdGhlIHZhbHVlLiBJZiBub3QsIGNyZWF0ZSBhIG5ldyB2YWx1ZSwgc3RvcmUgaXQsIGFuZCByZXR1cm4gaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBsb29rIHVwIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0gW2NyZWF0ZV0gLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIGtleSBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgaGF2ZShrZXk6IHN0cmluZywgY3JlYXRlPzogKCkgPT4gc3RyaW5nKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5zdG9yZVtrZXldO1xuICAgICAgICBpZiAoaXRlbSB8fCAhY3JlYXRlKSByZXR1cm4gaXRlbTtcblxuICAgICAgICBpdGVtID0gY3JlYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlKGtleSwgaXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlKCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5zdG9yZSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuL1N0b3JlSlNPTlwiO1xuXG5leHBvcnQgY29uc3QgcGFnZURlcHMgPSBuZXcgU3RvcmVKU09OKCdQYWdlc0luZm8nKVxuXG4vKipcbiAqIENoZWNrIGlmIGFueSBvZiB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZSBwYWdlIGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7U3RyaW5nTnVtYmVyTWFwfSBkZXBlbmRlbmNpZXMgLSBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuIFRoZSBrZXkgaXMgdGhlIHBhdGggdG8gdGhlIGZpbGUsIGFuZFxuICogdGhlIHZhbHVlIGlzIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDpzdHJpbmcsIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0gcGFnZURlcHMuc3RvcmVbcGF0aF0pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggICsgIChpID09ICd0aGlzUGFnZScgPyBwYXRoOiBpKTtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IGRlcGVuZGVuY2llc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICFkZXBlbmRlbmNpZXM7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGlzb2xhdGUoQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbyk7XG5cbiAgICBjb21waWxlZFN0cmluZy5QbHVzJCBgPCV7JT4ke0JldHdlZW5UYWdEYXRhfTwlfSU+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ051bWJlck1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVnaXN0ZXJFeHRlbnNpb24gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9zc3InO1xuaW1wb3J0IHsgcmVidWlsZEZpbGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlLCB7IHJlc29sdmUsIGNsZWFyTW9kdWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9wcmVwcm9jZXNzJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmFzeW5jIGZ1bmN0aW9uIHNzckhUTUwoZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgRnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGdldFYgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGd2ID0gKG5hbWU6IHN0cmluZykgPT4gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KG5hbWUsJycpLnRyaW0oKSxcbiAgICAgICAgICAgIHZhbHVlID0gZ3YoJ3NzcicgKyBDYXBpdGFsaXplKG5hbWUpKSB8fCBndihuYW1lKTtcblxuICAgICAgICByZXR1cm4gdmFsdWUgPyBldmFsKGAoeyR7dmFsdWV9fSlgKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgYnVpbGRQYXRoID0gYXdhaXQgcmVnaXN0ZXJFeHRlbnNpb24oRnVsbFBhdGgsIHNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoYnVpbGRQYXRoKTtcblxuICAgIGNvbnN0IHsgaHRtbCwgaGVhZCB9ID0gbW9kZS5kZWZhdWx0LnJlbmRlcihnZXRWKCdwcm9wcycpLCBnZXRWKCdvcHRpb25zJykpO1xuICAgIHNlc3Npb25JbmZvLmhlYWRIVE1MICs9IGhlYWQ7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ2Zyb20nKSwgZ2V0VHlwZXMuU3RhdGljWzJdLCAnc3ZlbHRlJyk7XG4gICAgY29uc3QgaW5XZWJQYXRoID0gcmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBTbWFsbFBhdGgpLnJlcGxhY2UoL1xcXFwvZ2ksICcvJyk7XG5cbiAgICBzZXNzaW9uSW5mby5zdHlsZSgnLycgKyBpbldlYlBhdGggKyAnLmNzcycpO1xuXG4gICAgY29uc3QgaWQgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2lkJywgQmFzZTY0SWQoaW5XZWJQYXRoKSksXG4gICAgICAgIGhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdChuYW1lLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gYCwke25hbWV9Onske3ZhbHVlfX1gIDogJyc7XG4gICAgICAgIH0sIHNlbGVjdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VsZWN0b3InKTtcblxuICAgIGNvbnN0IHNzciA9ICFzZWxlY3RvciAmJiBkYXRhVGFnLnBvcEJvb2xlYW4oJ3NzcicpID8gYXdhaXQgc3NySFRNTChkYXRhVGFnLCBGdWxsUGF0aCwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbykgOiAnJztcblxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdtb2R1bGUnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KFxuYGltcG9ydCBBcHAke2lkfSBmcm9tICcvJHtpbldlYlBhdGh9JztcbmNvbnN0IHRhcmdldCR7aWR9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiR7c2VsZWN0b3IgPyBzZWxlY3RvciA6ICcjJyArIGlkfVwiKTtcbnRhcmdldCR7aWR9ICYmIG5ldyBBcHAke2lkfSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQke2lkfVxuICAgICR7aGF2ZSgncHJvcHMnKSArIGhhdmUoJ29wdGlvbnMnKX0ke3NzciA/ICcsIGh5ZHJhdGU6IHRydWUnIDogJyd9XG59KTtgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBzZWxlY3RvciA/ICcnIDogYDxkaXYgaWQ9XCIke2lkfVwiPiR7c3NyfTwvZGl2PmApLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJZCh0ZXh0OiBzdHJpbmcsIG1heCA9IDEwKXtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odGV4dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnN1YnN0cmluZygwLCBtYXgpLnJlcGxhY2UoL1xcKy8sICdfJykucmVwbGFjZSgvXFwvLywgJ18nKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgIHsgQ2FwaXRhbGl6ZSwgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgQ29tcGlsZU9wdGlvbnMgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBjbGVhck1vZHVsZSwgcmVzb2x2ZSB9IGZyb20gXCIuLi8uLi9yZWRpcmVjdENKU1wiO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGVQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbmFtZSA9IHBhdGgucGFyc2UoZmlsZVBhdGgpLm5hbWUucmVwbGFjZSgvXlxcZC8sICdfJCYnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8kXS9nLCAnJyk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgICAgICBuYW1lOiBDYXBpdGFsaXplKG5hbWUpLFxuICAgICAgICBnZW5lcmF0ZTogJ3NzcicsXG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGRldjogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIGVycm9yTW9kZTogJ3dhcm4nXG4gICAgfTtcblxuICAgIGNvbnN0IGluU3RhdGljRmlsZSA9IHBhdGgucmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzbWFsbFBhdGgpO1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljRmlsZTtcblxuICAgIGNvbnN0IGZ1bGxJbXBvcnRQYXRoID0gZnVsbENvbXBpbGVQYXRoICsgJy5zc3IuY2pzJztcbiAgICBjb25zdCB7c3ZlbHRlRmlsZXMsIGNvZGUsIG1hcCwgZGVwZW5kZW5jaWVzfSA9IGF3YWl0IHByZXByb2Nlc3MoZmlsZVBhdGgsIHNtYWxsUGF0aCxmdWxsSW1wb3J0UGF0aCxmYWxzZSwnLnNzci5janMnKTtcbiAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyxkZXBlbmRlbmNpZXMpO1xuICAgIG9wdGlvbnMuc291cmNlbWFwID0gbWFwO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBmb3IoY29uc3QgZmlsZSBvZiBzdmVsdGVGaWxlcyl7XG4gICAgICAgIGNsZWFyTW9kdWxlKHJlc29sdmUoZmlsZSkpOyAvLyBkZWxldGUgb2xkIGltcG9ydHNcbiAgICAgICAgcHJvbWlzZXMucHVzaChyZWdpc3RlckV4dGVuc2lvbihmaWxlLCBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGUpLCBzZXNzaW9uSW5mbykpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGNvbnN0IHsganMsIGNzcywgd2FybmluZ3MgfSA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIDxhbnk+b3B0aW9ucyk7XG4gICAgUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzLCBmaWxlUGF0aCwgbWFwKTtcblxuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbEltcG9ydFBhdGgsIGpzLmNvZGUpO1xuXG4gICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9ICcvJyArIGluU3RhdGljRmlsZS5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIGZ1bGxJbXBvcnRQYXRoO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IGRpcm5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgUHJpbnRTYXNzRXJyb3JUcmFja2VyLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFeHRlbnNpb24sIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCwgYmFja1RvT3JpZ2luYWxTc3MgfSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBhd2FpdCBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsPGFueT4gc291cmNlTWFwLCBzb3VyY2VNYXAuc291cmNlcy5maW5kKHggPT4geC5zdGFydHNXaXRoKCdkYXRhOicpKSksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydFsgXSp0eXBlfGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgaWYobGFuZyA9PSAndHMnICYmIGFyZ3NbNV0uZW5kc1dpdGgoJyB0eXBlJykpXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoYXJnc1sxMF0uZXEpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJycpXG4gICAgICAgICAgICBpZiAobGFuZyA9PSAndHMnKVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy50cycpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy5qcycpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGFyZ3NbMV0uUGx1cyhhcmdzWzldLCBhcmdzWzEwXSwgKGV4dCA9PSAnLnN2ZWx0ZScgPyBzdmVsdGVFeHQgOiAnJyksIGFyZ3NbOV0sIChhcmdzWzExXSA/PyAnJykpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJy5zdmVsdGUnKSB7XG4gICAgICAgICAgICBjb25uZWN0U3ZlbHRlLnB1c2goYXJnc1sxMF0uZXEpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhbmcgIT09ICd0cycgfHwgIWFyZ3NbNF0pXG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcblxuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgbWFwVG9rZW5baWRdID0gbmV3RGF0YTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYF9fX3RvS2VuXFxgJHtpZH1cXGBgKTtcbiAgICB9KTtcblxuICAgIGlmIChsYW5nICE9PSAndHMnKVxuICAgICAgICByZXR1cm4gY29udGVudDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSAoYXdhaXQgdHJhbnNmb3JtKGNvbnRlbnQuZXEsIHsgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgbG9hZGVyOiAndHMnLCBzb3VyY2VtYXA6IHRydWUgfSkpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgYmFja1RvT3JpZ2luYWwoY29udGVudCwgY29kZSwgbWFwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGNvbnRlbnQsIGVycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgfVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoL19fX3RvS2VuYChbXFx3XFxXXSs/KWAvbWksIGFyZ3MgPT4ge1xuICAgICAgICByZXR1cm4gbWFwVG9rZW5bYXJnc1sxXS5lcV0gPz8gbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzYXZlUGF0aCA9IHNtYWxsUGF0aCwgaHR0cFNvdXJjZSA9IHRydWUsIHN2ZWx0ZUV4dCA9ICcnKSB7ICAgIFxuICAgIGxldCB0ZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoc21hbGxQYXRoLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGxldCBzY3JpcHRMYW5nID0gJ2pzJywgc3R5bGVMYW5nID0gJ2Nzcyc7XG5cbiAgICBjb25zdCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSA9IFtdLCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzY3JpcHQpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHNjcmlwdExhbmcgPSBhcmdzWzRdPy5lcSA/PyAnanMnO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGF3YWl0IFNjcmlwdFN2ZWx0ZShhcmdzWzddLCBzY3JpcHRMYW5nLCBjb25uZWN0U3ZlbHRlLCBzdmVsdGVFeHQpLCBhcmdzWzhdKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0eWxlQ29kZSA9IGNvbm5lY3RTdmVsdGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuICAgIGxldCBoYWRTdHlsZSA9IGZhbHNlO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c3R5bGUpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGlmKHN0eWxlTGFuZyA9PSAnY3NzJykgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llczogZGVwcyB9ID0gYXdhaXQgU0FTU1N2ZWx0ZShhcmdzWzddLCBzdHlsZUxhbmcsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgc2NyaXB0TGFuZywgc3R5bGVMYW5nLCBjb2RlOiB0ZXh0LmVxLCBtYXA6IHRleHQuU3RyaW5nVGFjayhzYXZlUGF0aCwgaHR0cFNvdXJjZSksIGRlcGVuZGVuY2llczogc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBzdmVsdGVGaWxlczogY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiB4WzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1swXSArIHggOiBwYXRoLm5vcm1hbGl6ZShmdWxsUGF0aCArICcvLi4vJyArIHgpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuIiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgXG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXFxgJHtKU1BhcnNlci5wcmludEVycm9yKGBTeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX1gKX1cXGBgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IGVyci5lcnJvcnNbMF07XG4gICAgICAgICAgICBmaXJzdC5sb2NhdGlvbiAmJiAoZmlyc3QubG9jYXRpb24ubGluZVRleHQgPSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZSh0ZXh0LmRlYnVnTGluZShmaXJzdCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCAgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tIFwiLi9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXJcIjtcblxuXG5leHBvcnQgdHlwZSBzZXREYXRhSFRNTFRhZyA9IHtcbiAgICB1cmw6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwXG59XG5cbmV4cG9ydCB0eXBlIGNvbm5lY3RvckFycmF5ID0ge1xuICAgIHR5cGU6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgc2VuZFRvOiBzdHJpbmcsXG4gICAgdmFsaWRhdG9yOiBzdHJpbmdbXSxcbiAgICBvcmRlcj86IHN0cmluZ1tdLFxuICAgIG5vdFZhbGlkPzogc3RyaW5nLFxuICAgIG1lc3NhZ2U/OiBzdHJpbmcgfCBib29sZWFuLFxuICAgIHJlc3BvbnNlU2FmZT86IGJvb2xlYW5cbn1bXVxuXG5leHBvcnQgdHlwZSBjYWNoZUNvbXBvbmVudCA9IHtcbiAgICBba2V5OiBzdHJpbmddOiBudWxsIHwge1xuICAgICAgICBtdGltZU1zPzogbnVtYmVyLFxuICAgICAgICB2YWx1ZT86IHN0cmluZ1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgaW5UYWdDYWNoZSA9IHtcbiAgICBzdHlsZTogc3RyaW5nW11cbiAgICBzY3JpcHQ6IHN0cmluZ1tdXG4gICAgc2NyaXB0TW9kdWxlOiBzdHJpbmdbXVxufVxuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTaG9ydFNjcmlwdE5hbWVzJyk7XG5cbi8qIFRoZSBTZXNzaW9uQnVpbGQgY2xhc3MgaXMgdXNlZCB0byBidWlsZCB0aGUgaGVhZCBvZiB0aGUgcGFnZSAqL1xuZXhwb3J0IGNsYXNzIFNlc3Npb25CdWlsZCB7XG4gICAgY29ubmVjdG9yQXJyYXk6IGNvbm5lY3RvckFycmF5ID0gW11cbiAgICBwcml2YXRlIHNjcmlwdFVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBzdHlsZVVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBpblNjcmlwdFN0eWxlOiB7IHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBTb3VyY2VNYXBTdG9yZSB9W10gPSBbXVxuICAgIGhlYWRIVE1MID0gJydcbiAgICBjYWNoZTogaW5UYWdDYWNoZSA9IHtcbiAgICAgICAgc3R5bGU6IFtdLFxuICAgICAgICBzY3JpcHQ6IFtdLFxuICAgICAgICBzY3JpcHRNb2R1bGU6IFtdXG4gICAgfVxuICAgIGNhY2hlQ29tcGlsZVNjcmlwdDogYW55ID0ge31cbiAgICBjYWNoZUNvbXBvbmVudDogY2FjaGVDb21wb25lbnQgPSB7fVxuICAgIGNvbXBpbGVSdW5UaW1lU3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9XG4gICAgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSB7fVxuICAgIHJlY29yZE5hbWVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICBnZXQgc2FmZURlYnVnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWJ1ZyAmJiB0aGlzLl9zYWZlRGVidWc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNtYWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgZnVsbFBhdGg6IHN0cmluZywgcHVibGljIHR5cGVOYW1lPzogc3RyaW5nLCBwdWJsaWMgZGVidWc/OiBib29sZWFuLCBwcml2YXRlIF9zYWZlRGVidWc/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMgPSB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc3R5bGUodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgc2NyaXB0KHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcmlwdFVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgcmVjb3JkKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVwZW5kZW5jZShzbWFsbFBhdGg6IHN0cmluZywgZnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aCkge1xuICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEZXAgPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0O1xuICAgICAgICBpZiAoaGF2ZURlcCkge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSA9IGhhdmVEZXBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGUodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHNtYWxsUGF0aCA9IHRoaXMuc21hbGxQYXRoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5pblNjcmlwdFN0eWxlLmZpbmQoeCA9PiB4LnR5cGUgPT0gdHlwZSAmJiB4LnBhdGggPT0gc21hbGxQYXRoKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0geyB0eXBlLCBwYXRoOiBzbWFsbFBhdGgsIHZhbHVlOiBuZXcgU291cmNlTWFwU3RvcmUoc21hbGxQYXRoLCB0aGlzLnNhZmVEZWJ1ZywgdHlwZSA9PSAnc3R5bGUnLCB0cnVlKSB9XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaChkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhLnZhbHVlXG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGVQYWdlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIGRhdGFUYWcucG9wU3RyaW5nKCdwYWdlJykgPyB0aGlzLnNtYWxsUGF0aCA6IGluZm8uZXh0cmFjdEluZm8oKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVOYW1lKHRleHQ6IHN0cmluZykge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU3RhdGljRmlsZXNJbmZvLnN0b3JlKTtcbiAgICAgICAgd2hpbGUgKGtleSA9PSBudWxsIHx8IHZhbHVlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSBCYXNlNjRJZCh0ZXh0LCA1ICsgbGVuZ3RoKS5zdWJzdHJpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZEhlYWRUYWdzKCkge1xuICAgICAgICBjb25zdCBwYWdlTG9nID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTG9nID0gcGFnZUxvZyAmJiBpLnBhdGggPT0gdGhpcy5zbWFsbFBhdGg7XG4gICAgICAgICAgICBjb25zdCBzYXZlTG9jYXRpb24gPSBpc0xvZyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV0sIGFkZFF1ZXJ5ID0gaXNMb2cgPyAnP3Q9bCcgOiAnJztcbiAgICAgICAgICAgIGxldCB1cmwgPSBTdGF0aWNGaWxlc0luZm8uaGF2ZShpLnBhdGgsICgpID0+IFNlc3Npb25CdWlsZC5jcmVhdGVOYW1lKGkucGF0aCkpICsgJy5wdWInO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgZGVmZXI6IG51bGwgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcubWpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgdHlwZTogJ21vZHVsZScgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5jc3MnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlKCcvJyArIHVybCArIGFkZFF1ZXJ5KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShzYXZlTG9jYXRpb24gKyB1cmwsIGF3YWl0IGkudmFsdWUuY3JlYXRlRGF0YVdpdGhNYXAoKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkSGVhZCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRIZWFkVGFncygpO1xuXG4gICAgICAgIGNvbnN0IG1ha2VBdHRyaWJ1dGVzID0gKGk6IHNldERhdGFIVE1MVGFnKSA9PiBpLmF0dHJpYnV0ZXMgPyAnICcgKyBPYmplY3Qua2V5cyhpLmF0dHJpYnV0ZXMpLm1hcCh4ID0+IGkuYXR0cmlidXRlc1t4XSA/IHggKyBgPVwiJHtpLmF0dHJpYnV0ZXNbeF19XCJgIDogeCkuam9pbignICcpIDogJyc7XG5cbiAgICAgICAgbGV0IGJ1aWxkQnVuZGxlU3RyaW5nID0gJyc7IC8vIGFkZCBzY3JpcHRzIGFkZCBjc3NcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc3R5bGVVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0vPmA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNjcmlwdFVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8c2NyaXB0IHNyYz1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfT48L3NjcmlwdD5gO1xuXG4gICAgICAgIHJldHVybiBidWlsZEJ1bmRsZVN0cmluZyArIHRoaXMuaGVhZEhUTUw7XG4gICAgfVxuXG4gICAgZXh0ZW5kcyhmcm9tOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3JBcnJheS5wdXNoKC4uLmZyb20uY29ubmVjdG9yQXJyYXkpO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKC4uLmZyb20uc2NyaXB0VVJMU2V0KTtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKC4uLmZyb20uc3R5bGVVUkxTZXQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBmcm9tLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKHsgLi4uaSwgdmFsdWU6IGkudmFsdWUuY2xvbmUoKSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29weU9iamVjdHMgPSBbJ2NhY2hlQ29tcGlsZVNjcmlwdCcsICdjYWNoZUNvbXBvbmVudCcsICdkZXBlbmRlbmNpZXMnXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29weU9iamVjdHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpc1tjXSwgZnJvbVtjXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2goLi4uZnJvbS5yZWNvcmROYW1lcy5maWx0ZXIoeCA9PiAhdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyh4KSkpO1xuXG4gICAgICAgIHRoaXMuaGVhZEhUTUwgKz0gZnJvbS5oZWFkSFRNTDtcbiAgICAgICAgdGhpcy5jYWNoZS5zdHlsZS5wdXNoKC4uLmZyb20uY2FjaGUuc3R5bGUpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdC5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0KTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHRNb2R1bGUucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdE1vZHVsZSk7XG4gICAgfVxuXG4gICAgLy9iYXNpYyBtZXRob2RzXG4gICAgQnVpbGRTY3JpcHRXaXRoUHJhbXMoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gQnVpbGRTY3JpcHQoY29kZSwgaXNUcygpLCB0aGlzKTtcbiAgICB9XG59IiwgIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCBjbGVhck1vZHVsZSBmcm9tICdjbGVhci1tb2R1bGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCksIHJlc29sdmUgPSAocGF0aDogc3RyaW5nKSA9PiByZXF1aXJlLnJlc29sdmUocGF0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGZpbGVQYXRoKTtcbiAgICBjbGVhck1vZHVsZShmaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufVxuXG5leHBvcnQge1xuICAgIGNsZWFyTW9kdWxlLFxuICAgIHJlc29sdmVcbn0iLCAiaW1wb3J0IHsgV2FybmluZyB9IGZyb20gXCJzdmVsdGUvdHlwZXMvY29tcGlsZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5cbmNsYXNzIHJlTG9jYXRpb24ge1xuICAgIG1hcDogUHJvbWlzZTxTb3VyY2VNYXBDb25zdW1lcj5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRMb2NhdGlvbihsb2NhdGlvbjoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KXtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSAoYXdhaXQgdGhpcy5tYXApLm9yaWdpbmFsUG9zaXRpb25Gb3IobG9jYXRpb24pXG4gICAgICAgIHJldHVybiBgJHtsaW5lfToke2NvbHVtbn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlRXJyb3IoeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfTogV2FybmluZywgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcic7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICdAc2luZHJlc29yaHVzL3NsdWdpZnknO1xuaW1wb3J0IG1hcmtkb3duSXRBdHRycyBmcm9tICdtYXJrZG93bi1pdC1hdHRycyc7XG5pbXBvcnQgbWFya2Rvd25JdEFiYnIgZnJvbSAnbWFya2Rvd24taXQtYWJicidcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55LCBpY29uOiBzdHJpbmcpIHtcblxuICAgIGZ1bmN0aW9uIHJlbmRlckNvZGUob3JpZ1J1bGU6IGFueSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnUmVuZGVyZWQgPSBvcmlnUnVsZSguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNvZGUtY29weVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29weS1jbGlwYm9hcmRcIiBvbmNsaWNrPVwibWFya2Rvd25Db3B5KHRoaXMpXCI+JHtpY29ufTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke29yaWdSZW5kZXJlZH1cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2sgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2spO1xuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIFxuICAgIGNvbnN0IGhsanNDbGFzcyA9ZGF0YVRhZy5wb3BCb29sZWFuKCdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogZGF0YVRhZy5wb3BCb29sZWFuKCdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpLFxuICAgICAgICBicmVha3M6IGRhdGFUYWcucG9wQm9vbGVhbignYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSxcbiAgICAgICAgdHlwb2dyYXBoZXI6IGRhdGFUYWcucG9wQm9vbGVhbigndHlwb2dyYXBoZXInLCBtYXJrRG93blBsdWdpbj8udHlwb2dyYXBoZXIgPz8gdHJ1ZSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29weSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/ICdcdUQ4M0RcdURDQ0InKTtcbiAgICBpZiAoY29weSlcbiAgICAgICAgbWQudXNlKChtOmFueSk9PiBjb2RlV2l0aENvcHkobSwgY29weSkpO1xuXG4gICAgaWYgKGRhdGFUYWcucG9wQm9vbGVhbignaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhYmJyJywgbWFya0Rvd25QbHVnaW4/LmFiYnIgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QWJicik7XG5cbiAgICBsZXQgbWFya2Rvd25Db2RlID0gQmV0d2VlblRhZ0RhdGE/LmVxIHx8ICcnO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdmaWxlJywgJy4vbWFya2Rvd24nKTtcblxuICAgIGlmICghbWFya2Rvd25Db2RlPy50cmltPy4oKSAmJiBsb2NhdGlvbikge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBsb2NhdGlvblswXSA9PSAnLycgPyBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzJdLCBsb2NhdGlvbik6IHBhdGguam9pbihwYXRoLmRpcm5hbWUodHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JykpLCBsb2NhdGlvbik7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnBvcFN0cmluZygnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBpZih0aGVtZSAhPSAnbm9uZScpe1xuICAgICAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY29weSl7XG4gICAgICAgICAgICBzZXNzaW9uLnNjcmlwdCgnL3NlcnYvbWQuanMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCd0aGVtZScsICBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXY+YXtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAtN3B4OyAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8aGVhZCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy4uWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCcuLicpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCBudW06IG51bWJlcikgPT4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1zdHJpbmdcIjogW1xuICAgICAgICAvXnN0cmluZ3x0ZXh0K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBgXCIke3gudHJpbSgpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyl9XCJgKSxcbiAgICAgICAgKG9wdGlvbnM6IHN0cmluZ1tdLCB0ZXh0OiBzdHJpbmcpID0+IG9wdGlvbnMuaW5jbHVkZXModGV4dCksXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLW51bWJlclwiOiBbXG4gICAgICAgIC9ebnVtYmVyfG51bXxpbnRlZ2VyfGludCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gcGFyc2VGbG9hdCh4KSksXG4gICAgICAgIChvcHRpb25zOiBudW1iZXJbXSwgbnVtOiBudW1iZXIpID0+IG9wdGlvbnMuaW5jbHVkZXMobnVtKSxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF1cbn07XG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycyA9IFsuLi5udW1iZXJzXTtcblxuZm9yKGNvbnN0IGkgaW4gYnVpbHRJbkNvbm5lY3Rpb25SZWdleCl7XG4gICAgY29uc3QgdHlwZSA9IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbaV1bM107XG5cbiAgICBpZihidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXModHlwZSkpXG4gICAgICAgIGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5wdXNoKGkpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVmFsdWVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG5cbiAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb24uaW5jbHVkZXModmFsdWUpKVxuICAgICAgICByZXR1cm4gYFtcIiR7dmFsdWV9XCJdYDtcblxuICAgIGZvciAoY29uc3QgW25hbWUsIFt0ZXN0LCBnZXRBcmdzXV0gb2YgT2JqZWN0LmVudHJpZXMoYnVpbHRJbkNvbm5lY3Rpb25SZWdleCkpXG4gICAgICAgIGlmICgoPFJlZ0V4cD50ZXN0KS50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiBgW1wiJHtuYW1lfVwiLCAkeyg8YW55PmdldEFyZ3MpKHZhbHVlKX1dYDtcblxuICAgIHJldHVybiBgWyR7dmFsdWV9XWA7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VWYWxpZGF0aW9uSlNPTihhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogUHJvbWlzZTxib29sZWFuIHwgc3RyaW5nW10+IHtcblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudCwgLi4uZWxlbWVudEFyZ3NdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcbiAgICAgICAgbGV0IHJldHVybk5vdyA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBpc0RlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgY2FzZSAnbnVtJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICBjYXNlICdib29sJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgICAgY2FzZSAnaW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhZW1haWxWYWxpZGF0b3IudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGF2ZVJlZ2V4ID0gdmFsdWUgIT0gbnVsbCAmJiBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWhhdmVSZWdleFsyXShlbGVtZW50QXJncywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IGVsZW1lbnQudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWF3YWl0IGVsZW1lbnQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk5vdykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBgZmFpbGVkIGF0ICR7aX0gZmlsZWQgLSAke2lzRGVmYXVsdCA/IHJldHVybk5vdyA6ICdleHBlY3RlZCAnICsgZWxlbWVudH1gO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50QXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaW5mbyArPSBgLCBhcmd1bWVudHM6ICR7SlNPTi5zdHJpbmdpZnkoZWxlbWVudEFyZ3MpfWA7XG5cbiAgICAgICAgICAgIGluZm8gKz0gYCwgaW5wdXQ6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBbaW5mbywgZWxlbWVudCwgZWxlbWVudEFyZ3MsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VWYWx1ZXMoYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBwYXJzZWQgPSBbXTtcblxuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50XSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG5cbiAgICAgICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHBhcnNlRmxvYXQodmFsdWUpKTtcblxuICAgICAgICBlbHNlIGlmIChib29sZWFucy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgdHlwZSB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCB7IFNvbWVQbHVnaW5zIH0sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbmFtZScpLFxuICAgICAgICBzZW5kVG8gPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdzZW5kVG8nKSxcbiAgICAgICAgdmFsaWRhdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdub3RWYWxpZCcpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFTb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKSk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7IGFzeW5jOiBudWxsIH0pXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KHRlbXBsYXRlKG5hbWUpKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGEsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgbGV0IGJ1aWxkT2JqZWN0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2Ygc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkpIHtcbiAgICAgICAgaWYgKGkudHlwZSAhPSAnY29ubmVjdCcpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBidWlsZE9iamVjdCArPSBgLFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOlwiJHtpLm5hbWV9XCIsXG4gICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICBub3RWYWxpZDogJHtpLm5vdFZhbGlkIHx8ICdudWxsJ30sXG4gICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICB2YWxpZGF0b3I6WyR7KGkudmFsaWRhdG9yICYmIGkudmFsaWRhdG9yLm1hcChjb21waWxlVmFsdWVzKS5qb2luKCcsJykpIHx8ICcnfV1cbiAgICAgICAgfWA7XG4gICAgfVxuXG4gICAgYnVpbGRPYmplY3QgPSBgWyR7YnVpbGRPYmplY3Quc3Vic3RyaW5nKDEpfV1gO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gYFxuICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JDYWxsKXtcbiAgICAgICAgICAgIGlmKGF3YWl0IGhhbmRlbENvbm5lY3RvcihcImNvbm5lY3RcIiwgcGFnZSwgJHtidWlsZE9iamVjdH0pKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1gO1xuXG4gICAgaWYgKHBhZ2VEYXRhLmluY2x1ZGVzKFwiQENvbm5lY3RIZXJlXCIpKVxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKC9AQ29ubmVjdEhlcmUoOz8pLywgKCkgPT4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYWRkU2NyaXB0KSk7XG4gICAgZWxzZVxuICAgICAgICBwYWdlRGF0YS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGFkZFNjcmlwdCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yQXJyYXk6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzUGFnZS5Qb3N0Py5jb25uZWN0b3JDYWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cblxuICAgIGNvbnN0IGhhdmUgPSBjb25uZWN0b3JBcnJheS5maW5kKHggPT4geC5uYW1lID09IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC5uYW1lKTtcblxuICAgIGlmICghaGF2ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwudmFsdWVzO1xuICAgIGNvbnN0IGlzVmFsaWQgPSBoYXZlLnZhbGlkYXRvci5sZW5ndGggJiYgYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgaGF2ZS52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhdmUudmFsaWRhdG9yLmxlbmd0aCB8fCBpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGhhdmUuc2VuZFRvKC4uLnZhbHVlcykpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCkpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5tZXNzYWdlKVxuICAgICAgICBiZXR0ZXJKU09OKHtcbiAgICAgICAgICAgIGVycm9yOiB0eXBlb2YgaGF2ZS5tZXNzYWdlID09ICdzdHJpbmcnID8gaGF2ZS5tZXNzYWdlIDogKDxhbnk+aXNWYWxpZCkuc2hpZnQoKVxuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnN0YXR1cyg0MDApO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNvbXBpbGVWYWx1ZXMsIG1ha2VWYWxpZGF0aW9uSlNPTiwgcGFyc2VWYWx1ZXMgfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBjb25zdCBzZW5kVG8gPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3NlbmRUbycsJycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCAgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICAgICAgfTwvZm9ybT5gLFxuICAgICAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgICAgICB9XG5cblxuICAgIGNvbnN0IG5hbWUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ25hbWUnLHV1aWQoKSkudHJpbSgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb3JkZXInKSwgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcucG9wQm9vbGVhbignc2FmZScpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBsZXQgb3JkZXIgPSBbXTtcblxuICAgIGNvbnN0IHZhbGlkYXRvckFycmF5ID0gdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHsgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYW4gb3JkZXIgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIFwicHJvcDE6IHN0cmluZywgcHJvcDM6IG51bSwgcHJvcDI6IGJvb2xcIlxuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0Rmlyc3QoJzonLCB4LnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBvcmRlci5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuXG4gICAgICAgIHJldHVybiBzcGxpdC5wb3AoKTtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlckRlZmF1bHQpXG4gICAgICAgIG9yZGVyID0gb3JkZXJEZWZhdWx0LnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yQXJyYXksXG4gICAgICAgIG9yZGVyOiBvcmRlci5sZW5ndGggJiYgb3JkZXIsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZXNwb25zZVNhZmVcbiAgICB9KTtcblxuICAgIGRhdGFUYWcucHVzaFZhbHVlKCdtZXRob2QnLCAncG9zdCcpO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtzZW5kVG99KTtcbiU+PGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbm5lY3RvckZvcm1DYWxsXCIgdmFsdWU9XCIke25hbWV9XCIvPiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9ICdmb3JtJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHNlbmRUb1VuaWNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBpLnNlbmRUbykudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQENvbm5lY3RIZXJlRm9ybVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXCkoOz8pYCksIGNvbm5lY3REZWZhdWx0ID0gbmV3IFJlZ0V4cChgQFxcXFw/Q29ubmVjdEhlcmVGb3JtXFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgY29uc3Qgc2NyaXB0RGF0YSA9IGRhdGEgPT4ge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGFbMF0uU3RhcnRJbmZvKS5QbHVzJFxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JGb3JtQ2FsbCA9PSBcIiR7aS5uYW1lfVwiKXtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgaGFuZGVsQ29ubmVjdG9yKFwiZm9ybVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBbJHtpLm9yZGVyPy5tYXA/LihpdGVtID0+IGBcIiR7aXRlbX1cImApPy5qb2luKCcsJykgPz8gJyd9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoY291bnRlcilcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZShjb25uZWN0RGVmYXVsdCwgJycpOyAvLyBkZWxldGluZyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdERlZmF1bHQsIHNjcmlwdERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckluZm86IGFueSkge1xuXG4gICAgZGVsZXRlIHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yRm9ybUNhbGw7XG5cbiAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby5vcmRlci5sZW5ndGgpIC8vIHB1c2ggdmFsdWVzIGJ5IHNwZWNpZmljIG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjb25uZWN0b3JJbmZvLm9yZGVyKVxuICAgICAgICAgICAgdmFsdWVzLnB1c2godGhpc1BhZ2UuUG9zdFtpXSk7XG4gICAgZWxzZVxuICAgICAgICB2YWx1ZXMucHVzaCguLi5PYmplY3QudmFsdWVzKHRoaXNQYWdlLlBvc3QpKTtcblxuXG4gICAgbGV0IGlzVmFsaWQ6IGJvb2xlYW4gfCBzdHJpbmdbXSA9IHRydWU7XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby52YWxpZGF0b3IubGVuZ3RoKSB7IC8vIHZhbGlkYXRlIHZhbHVlc1xuICAgICAgICB2YWx1ZXMgPSBwYXJzZVZhbHVlcyh2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICAgICAgaXNWYWxpZCA9IGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzcG9uc2U6IGFueTtcblxuICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8uc2VuZFRvKC4uLnZhbHVlcyk7XG4gICAgZWxzZSBpZiAoY29ubmVjdG9ySW5mby5ub3RWYWxpZClcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCk7XG5cbiAgICBpZiAoIWlzVmFsaWQgJiYgIXJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5tZXNzYWdlID09PSB0cnVlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKGNvbm5lY3RvckluZm8ubWVzc2FnZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3BvbnNlID0gY29ubmVjdG9ySW5mby5tZXNzYWdlO1xuXG4gICAgaWYgKHJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5zYWZlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKHJlc3BvbnNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGUocmVzcG9uc2UpO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5jb25zdCByZWNvcmRTdG9yZSA9IG5ldyBTdG9yZUpTT04oJ1JlY29yZHMnKTtcblxuZnVuY3Rpb24gcmVjb3JkTGluayhkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbGluaycsIHNtYWxsUGF0aFRvUGFnZShzZXNzaW9uSW5mby5zbWFsbFBhdGgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZWNvcmRQYXRoKGRlZmF1bHROYW1lOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBsaW5rID0gcmVjb3JkTGluayhkYXRhVGFnLCBzZXNzaW9uSW5mbyksIHNhdmVOYW1lID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCduYW1lJywgZGVmYXVsdE5hbWUpO1xuXG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdID8/PSB7fTtcbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10gPz89ICcnO1xuICAgIHNlc3Npb25JbmZvLnJlY29yZChzYXZlTmFtZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdG9yZTogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdLFxuICAgICAgICBjdXJyZW50OiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10sXG4gICAgICAgIGxpbmtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZiAoIXNlc3Npb25JbmZvLnNtYWxsUGF0aC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSkgLy8gZG8gbm90IGFsbG93IHRoaXMgZm9yIGNvbXBpbGluZyBjb21wb25lbnQgYWxvbmVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgICAgICB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaHRtbCA9IGh0bWwudHJpbSgpO1xuXG4gICAgY29uc3QgeyBzdG9yZSwgbGluayB9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvcmVjb3JkLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZiAoIXN0b3JlW2xpbmtdLmluY2x1ZGVzKGh0bWwpKSB7XG4gICAgICAgIHN0b3JlW2xpbmtdICs9IGh0bWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQmVmb3JlUmVCdWlsZChzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG5hbWUgPSBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoKTtcbiAgICBmb3IgKGNvbnN0IHNhdmUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVdO1xuXG4gICAgICAgIGlmIChpdGVtW25hbWVdKSB7XG4gICAgICAgICAgICBpdGVtW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIGl0ZW1bbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVSZWNvcmRzKHNlc3Npb246IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbi5kZWJ1Zykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIHNlc3Npb24ucmVjb3JkTmFtZXMpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlckNvbXBpbGUoKSB7XG4gICAgcmVjb3JkU3RvcmUuY2xlYXIoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlKCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5pbXBvcnQgeyBtYWtlUmVjb3JkUGF0aCB9IGZyb20gJy4vcmVjb3JkJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZiAoIXNlc3Npb25JbmZvLnNtYWxsUGF0aC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSkgLy8gZG8gbm90IGFsbG93IHRoaXMgZm9yIGNvbXBpbGluZyBjb21wb25lbnQgYWxvbmVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgICAgICB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBzdG9yZSwgbGluaywgY3VycmVudCB9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvc2VhcmNoLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgY29uc3Qgc2VhcmNoT2JqZWN0ID0gYnVpbGRPYmplY3QoaHRtbCwgZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdtYXRjaCcsICdoMVtpZF0sIGgyW2lkXSwgaDNbaWRdLCBoNFtpZF0sIGg1W2lkXSwgaDZbaWRdJykpO1xuXG4gICAgaWYgKCFjdXJyZW50KSB7XG4gICAgICAgIHN0b3JlW2xpbmtdID0gc2VhcmNoT2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY3VycmVudC50aXRsZXMsIHNlYXJjaE9iamVjdC50aXRsZXMpO1xuXG4gICAgICAgIGlmICghY3VycmVudC50ZXh0LmluY2x1ZGVzKHNlYXJjaE9iamVjdC50ZXh0KSkge1xuICAgICAgICAgICAgY3VycmVudC50ZXh0ICs9IHNlYXJjaE9iamVjdC50ZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZE9iamVjdChodG1sOiBzdHJpbmcsIG1hdGNoOiBzdHJpbmcpIHtcbiAgICBjb25zdCByb290ID0gcGFyc2UoaHRtbCwge1xuICAgICAgICBibG9ja1RleHRFbGVtZW50czoge1xuICAgICAgICAgICAgc2NyaXB0OiBmYWxzZSxcbiAgICAgICAgICAgIHN0eWxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vc2NyaXB0OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aXRsZXM6IFN0cmluZ01hcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChtYXRjaCkpIHtcbiAgICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmF0dHJpYnV0ZXNbJ2lkJ107XG4gICAgICAgIHRpdGxlc1tpZF0gPSBlbGVtZW50LmlubmVyVGV4dC50cmltKCk7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGVzLFxuICAgICAgICB0ZXh0OiByb290LmlubmVyVGV4dC50cmltKCkucmVwbGFjZSgvWyBcXG5dezIsfS9nLCAnICcpLnJlcGxhY2UoL1tcXG5dL2csICcgJylcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vQ29tcG9uZW50cy9jbGllbnQnO1xuaW1wb3J0IHNjcmlwdCBmcm9tICcuL0NvbXBvbmVudHMvc2NyaXB0L2luZGV4JztcbmltcG9ydCBzdHlsZSBmcm9tICcuL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgnO1xuaW1wb3J0IHBhZ2UgZnJvbSAnLi9Db21wb25lbnRzL3BhZ2UnO1xuaW1wb3J0IGlzb2xhdGUgZnJvbSAnLi9Db21wb25lbnRzL2lzb2xhdGUnO1xuaW1wb3J0IHN2ZWx0ZSBmcm9tICcuL0NvbXBvbmVudHMvc3ZlbHRlJztcbmltcG9ydCBtYXJrZG93biBmcm9tICcuL0NvbXBvbmVudHMvbWFya2Rvd24nO1xuaW1wb3J0IGhlYWQsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkSGVhZCB9IGZyb20gJy4vQ29tcG9uZW50cy9oZWFkJztcbmltcG9ydCBjb25uZWN0LCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZENvbm5lY3QsIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JDb25uZWN0IH0gZnJvbSAnLi9Db21wb25lbnRzL2Nvbm5lY3QnO1xuaW1wb3J0IGZvcm0sIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkRm9ybSwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckZvcm0gfSBmcm9tICcuL0NvbXBvbmVudHMvZm9ybSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCByZWNvcmQsIHsgdXBkYXRlUmVjb3JkcywgcGVyQ29tcGlsZSBhcyBwZXJDb21waWxlUmVjb3JkLCBwb3N0Q29tcGlsZSBhcyBwb3N0Q29tcGlsZVJlY29yZCwgZGVsZXRlQmVmb3JlUmVCdWlsZCB9IGZyb20gJy4vQ29tcG9uZW50cy9yZWNvcmQnO1xuaW1wb3J0IHNlYXJjaCBmcm9tICcuL0NvbXBvbmVudHMvc2VhcmNoJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBjb25zdCBBbGxCdWlsZEluID0gW1wiY2xpZW50XCIsIFwic2NyaXB0XCIsIFwic3R5bGVcIiwgXCJwYWdlXCIsIFwiY29ubmVjdFwiLCBcImlzb2xhdGVcIiwgXCJmb3JtXCIsIFwiaGVhZFwiLCBcInN2ZWx0ZVwiLCBcIm1hcmtkb3duXCIsIFwicmVjb3JkXCIsIFwic2VhcmNoXCJdO1xuXG5leHBvcnQgZnVuY3Rpb24gU3RhcnRDb21waWxpbmcocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgbGV0IHJlRGF0YTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PjtcblxuICAgIHN3aXRjaCAodHlwZS5lcS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgXCJjbGllbnRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNsaWVudChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyZWNvcmRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHJlY29yZCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VhcmNoXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzZWFyY2goIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2NyaXB0KCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN0eWxlKCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGFnZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcGFnZShwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjb25uZWN0KHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZm9ybVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gZm9ybShwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpc29sYXRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBpc29sYXRlKEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaGVhZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaGVhZChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdmVsdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN2ZWx0ZSh0eXBlLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1hcmtkb3duXCI6XG4gICAgICAgICAgICByZURhdGEgPSBtYXJrZG93bih0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wb25lbnQgaXMgbm90IGJ1aWxkIHlldFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNJbmNsdWRlKHRhZ25hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBBbGxCdWlsZEluLmluY2x1ZGVzKHRhZ25hbWUudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZykge1xuICAgIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbkluZm8pO1xuXG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdChwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZEZvcm0ocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoL0BDb25uZWN0SGVyZSg7PykvZ2ksICcnKS5yZXBsYWNlKC9AQ29ubmVjdEhlcmVGb3JtKDs/KS9naSwgJycpO1xuXG4gICAgcGFnZURhdGEgPSBhd2FpdCBhZGRGaW5hbGl6ZUJ1aWxkSGVhZChwYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGZ1bGxDb21waWxlUGF0aCk7XG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yU2VydmljZSh0eXBlOiBzdHJpbmcsIHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICh0eXBlID09ICdjb25uZWN0JylcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckNvbm5lY3QodGhpc1BhZ2UsIGNvbm5lY3RvckFycmF5KTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JGb3JtKHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgXG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBQYXJzZURlYnVnSW5mbywgQ3JlYXRlRmlsZVBhdGgsIFBhdGhUeXBlcywgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQWxsQnVpbGRJbiwgSXNJbmNsdWRlLCBTdGFydENvbXBpbGluZyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgQXJyYXlNYXRjaCB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQge0NvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciwgcG9vbCB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc2VydENvbXBvbmVudCBleHRlbmRzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIHB1YmxpYyBkaXJGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbjtcbiAgICBwdWJsaWMgQ29tcGlsZUluRmlsZTogQ29tcGlsZUluRmlsZUZ1bmM7XG4gICAgcHVibGljIE1pY3JvUGx1Z2luczogU3RyaW5nQXJyYXlPck9iamVjdDtcbiAgICBwdWJsaWMgR2V0UGx1Z2luOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XG4gICAgcHVibGljIFNvbWVQbHVnaW5zOiAoLi4ubmFtZXM6IHN0cmluZ1tdKSA9PiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1RzOiAoKSA9PiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZWdleFNlYXJjaDogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IoUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSAmJiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gZGF0YVRhZ1NwbGljZWQucmVidWlsZFNwYWNlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBjb21wb25lbnQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9ID0gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKGNvbXBvbmVudCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7a2V5LHZhbHVlfSBvZiB0YWdEYXRhLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBrZXksIFwiZ2lcIik7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UocmUsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhOiBUYWdEYXRhUGFyc2VyLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBpbXBvcnRTb3VyY2UgPSAnLycgKyB0eXBlLmV4dHJhY3RJbmZvKCk7XG5cbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZScsIGltcG9ydFNvdXJjZSlcbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZURpcmVjdG9yeScsIHBhdGguZGlybmFtZShpbXBvcnRTb3VyY2UpKVxuXG4gICAgICAgIGNvbnN0ICBtYXBBdHRyaWJ1dGVzID0gZGF0YS5tYXAoKTtcbiAgICAgICAgbWFwQXR0cmlidXRlcy5yZWFkZXIgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG5cbiAgICAgICAgcmV0dXJuIG1hcEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlciB9KSB7XG4gICAgICAgIGNvbnN0IGRhdGFQYXJzZXIgPSBuZXcgVGFnRGF0YVBhcnNlcihkYXRhVGFnKSwgQnVpbGRJbiA9IElzSW5jbHVkZSh0eXBlLmVxKTtcbiAgICAgICAgYXdhaXQgZGF0YVBhcnNlci5wYXJzZXIoKTtcblxuICAgICAgICBsZXQgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaEluQ29tbWVudCA9IHRydWUsIEFsbFBhdGhUeXBlczogUGF0aFR5cGVzID0ge30sIGFkZFN0cmluZ0luZm86IHN0cmluZztcblxuICAgICAgICBpZiAoQnVpbGRJbikgey8vY2hlY2sgaWYgaXQgYnVpbGQgaW4gY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCB7IGNvbXBpbGVkU3RyaW5nLCBjaGVja0NvbXBvbmVudHMgfSA9IGF3YWl0IFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lLCB0eXBlLCBkYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGFQYXJzZXIucG9wSGF2ZURlZmF1bHQoJ2ZvbGRlcicsICcuJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGFsbERhdGEsIHRoaXMuaXNUcygpKTtcblxuICAgICAgICAgICAgLyphZGQgc3BlY2lhbCBhdHRyaWJ1dGVzICovXG4gICAgICAgICAgICBjb25zdCBtYXBBdHRyaWJ1dGVzID0gSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGFQYXJzZXIsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCB7YXR0cmlidXRlczogbWFwQXR0cmlidXRlc30pO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhUGFyc2VyLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke3RhZ1R5cGV9XCIsIHVzZWQgaW46ICR7dGFnVHlwZS5hdCgwKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBwb29sIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ3MgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBDUnVuVGltZSBmcm9tIFwiLi9Db21waWxlXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5cbmNvbnN0IGlnbm9yZUluaGVyaXQgPSBbJ2NvZGVmaWxlJ107XG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7IGRlZmluZToge30gfTtcblxuYXN5bmMgZnVuY3Rpb24gUGFnZUJhc2VQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICBjaGFyOiBzdHJpbmdcbiAgICB9W11cbn0+IHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IHBvb2wuZXhlYygnUGFnZUJhc2VQYXJzZXInLCBbdGV4dF0pO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBhcnNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsIGNoYXI/OiBzdHJpbmcgfVtdID0gW11cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIG5vbkR5bmFtaWMoaXNEeW5hbWljOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghaXNEeW5hbWljKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZUR5bmFtaWMgPSB0aGlzLnBvcEFueSgnZHluYW1pYycpO1xuICAgICAgICBpZiAoaGF2ZUR5bmFtaWMgIT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgICAgICBwYXJzZS5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgICAgIHBhcnNlLnZhbHVlQXJyYXkgPSBbLi4udGhpcy52YWx1ZUFycmF5LCB7IGtleTogJ2R5bmFtaWMnLCB2YWx1ZTogdHJ1ZSB9XTtcblxuICAgICAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHBhcnNlLmNsZWFyRGF0YS5lcSk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnZHluYW1pYy1zc3ItaW1wb3J0JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQWRkaW5nIFxcJ2R5bmFtaWNcXCcgYXR0cmlidXRlIHRvIGZpbGUgJyArIHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgeyBhdHRyaWJ1dGVzLCBkeW5hbWljQ2hlY2t9OiB7IGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXAsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCB0aGlzLnNlc3Npb25JbmZvLCBzbWFsbFBhdGgsIHRoaXMuaXNUcyk7XG4gICAgICAgIHRoaXMuY29kZSA9IGF3YWl0IHJ1bi5jb21waWxlKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGFyc2VCYXNlKHRoaXMuY29kZSk7XG4gICAgICAgIGlmKHRoaXMubm9uRHluYW1pYyhkeW5hbWljQ2hlY2spKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkQ29kZUZpbGUocGFnZVBhdGgsIHNtYWxsUGF0aCwgdGhpcy5pc1RzLCBwYWdlTmFtZSk7XG5cbiAgICAgICAgdGhpcy5sb2FkRGVmaW5lKHsgLi4uc2V0dGluZ3MuZGVmaW5lLCAuLi5ydW4uZGVmaW5lIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gYXdhaXQgUGFnZUJhc2VQYXJzZXIoY29kZS5lcSk7XG5cbiAgICAgICAgaWYocGFyc2VyLnN0YXJ0ID09IHBhcnNlci5lbmQpe1xuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBjb2RlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGNvbnN0IHtjaGFyLGVuZCxrZXksc3RhcnR9IG9mIHBhcnNlci52YWx1ZXMpe1xuICAgICAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goe2tleSwgdmFsdWU6IHN0YXJ0ID09PSBlbmQgPyB0cnVlOiBjb2RlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgY2hhcn0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUuc3Vic3RyaW5nKDAsIHBhcnNlci5zdGFydCkuUGx1cyhjb2RlLnN1YnN0cmluZyhwYXJzZXIuZW5kKSkudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZiAoIXRoaXMudmFsdWVBcnJheS5sZW5ndGgpIHJldHVybiB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnQFsnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSwgY2hhciB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9PSR7Y2hhcn0ke3ZhbHVlfSR7Y2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9IGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkLnN1YnN0cmluZygwLCBidWlsZC5sZW5ndGgtMSkuUGx1cygnXVxcbicpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGF3YWl0IHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBpZihpZ25vcmVJbmhlcml0LmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcGFyc2UucG9wKG5hbWUpXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGA8QCR7bmFtZX0+PDoke25hbWV9Lz48L0Ake25hbWV9PmApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZS5yZWJ1aWxkKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlLmNsZWFyRGF0YS5QbHVzKGJ1aWxkKTtcbiAgICB9XG5cbiAgICBnZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3AobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleSA9PT0gbmFtZSksIDEpWzBdPy52YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BBbnkobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmVOYW1lID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LnRvTG93ZXJDYXNlKCkgPT0gbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhdmVOYW1lICE9IC0xKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaGF2ZU5hbWUsIDEpWzBdLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFzVGFnID0gZ2V0RGF0YVRhZ3ModGhpcy5jbGVhckRhdGEsIFtuYW1lXSwgJ0AnKTtcblxuICAgICAgICBpZiAoIWFzVGFnLmZvdW5kWzBdKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBhc1RhZy5kYXRhO1xuXG4gICAgICAgIHJldHVybiBhc1RhZy5mb3VuZFswXS5kYXRhLnRyaW0oKTtcbiAgICB9XG5cbiAgICBieVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maWx0ZXIoeCA9PiB4LnZhbHVlICE9PSB0cnVlICYmIHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBkZWZhdWx0VmFsdWVQb3BBbnk8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IFQpOiBzdHJpbmcgfCBUIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wb3BBbnkobmFtZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlPy5lcTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5kZWZhdWx0VmFsdWVQb3BBbnkoJ2NvZGVmaWxlJywgJ2luaGVyaXQnKTtcbiAgICAgICAgaWYgKCFoYXZlQ29kZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLmRlZmF1bHRWYWx1ZVBvcEFueSgnbGFuZycsICdqcycpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gaGF2ZUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYWdlUGF0aDtcblxuICAgICAgICBjb25zdCBoYXZlRXh0ID0gcGF0aC5leHRuYW1lKGhhdmVDb2RlKS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoaGF2ZUV4dCkpIHtcbiAgICAgICAgICAgIGlmICgvKFxcXFx8XFwvKSQvLnRlc3QoaGF2ZUNvZGUpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhZ2VQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGlmICghQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhoYXZlRXh0KSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYXRoLmV4dG5hbWUocGFnZVBhdGgpO1xuICAgICAgICAgICAgaGF2ZUNvZGUgKz0gJy4nICsgKGxhbmcgPyBsYW5nIDogaXNUcyA/ICd0cycgOiAnanMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQ29kZVswXSA9PSAnLicpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocGFnZVBhdGgpLCBoYXZlQ29kZSlcblxuICAgICAgICBjb25zdCBTbWFsbFBhdGggPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGhhdmVDb2RlKTtcblxuICAgICAgICBpZiAoYXdhaXQgdGhpcy5zZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgaGF2ZUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IGJhc2VNb2RlbERhdGEuYWxsRGF0YS5yZXBsYWNlQWxsKFwiQFwiLCBcIkBAXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soJzwlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEFmdGVyTm9UcmFjaygnJT4nKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcgJiYgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgfSBlbHNlIGlmKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnICYmIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcpe1xuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShoYXZlQ29kZSwgJycpO1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NyZWF0ZS1jb2RlLWZpbGUnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgY3JlYXRlZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlLWZpbGUtbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgSlNQYXJzZXIucHJpbnRFcnJvcihgQ29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nYCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgc3RyaW5nKVtdW10gPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcy51bnNoaWZ0KC4uLk9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpKVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IENvbnZlcnRTeW50YXhNaW5pIH0gZnJvbSBcIi4uLy4uL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4XCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSBcIi4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENSdW5UaW1lIHtcbiAgICBkZWZpbmUgPSB7fVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzY3JpcHQ6IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBpc1RzOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHRlbXBsYXRlU2NyaXB0KHNjcmlwdHM6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG5fX3dyaXRlID0ge3RleHQ6ICcnfTtfX3dyaXRlQXJyYXkudW5zaGlmdChfX3dyaXRlKTtgKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhpKVxuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxucmV0dXJuIF9fd3JpdGVBcnJheWApO1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXRob2RzKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgY29uc3QgX19sb2NhbHBhdGggPSAnLycgKyBzbWFsbFBhdGhUb1BhZ2UodGhpcy5zZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RyaW5nOiAnc2NyaXB0LHN0eWxlLGRlZmluZSxzdG9yZSxwYWdlX19maWxlbmFtZSxwYWdlX19kaXJuYW1lLF9fbG9jYWxwYXRoLGF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgZnVuY3M6IFtcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnNjcmlwdC5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc3R5bGUuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHRoaXMuZGVmaW5lW1N0cmluZyhrZXkpXSA9IHZhbHVlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY29tcGlsZVJ1blRpbWVTdG9yZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoLFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoKSxcbiAgICAgICAgICAgICAgICBfX2xvY2FscGF0aCxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzIHx8IHt9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGRDb2RlKHBhcnNlcjogSlNQYXJzZXIsIGJ1aWxkU3RyaW5nczogeyB0ZXh0OiBzdHJpbmcgfVtdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKGkudGV4dClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGJ1aWxkU3RyaW5ncy5wb3AoKS50ZXh0LCBpLnRleHQuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIGFzeW5jIGNvbXBpbGUoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgICAgICAvKiBsb2FkIGZyb20gY2FjaGUgKi9cbiAgICAgICAgY29uc3QgaGF2ZUNhY2hlID0gdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdO1xuICAgICAgICBpZiAoaGF2ZUNhY2hlKVxuICAgICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXZlQ2FjaGUpKHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKS5mdW5jcyk7XG4gICAgICAgIGxldCBkb0ZvckFsbDogKHJlc29sdmU6IChmdW5jczogYW55W10pID0+IFN0cmluZ1RyYWNrZXIgfCBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSA9PiB2b2lkO1xuICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IGRvRm9yQWxsID0gcik7XG5cbiAgICAgICAgLyogcnVuIHRoZSBzY3JpcHQgKi9cbiAgICAgICAgdGhpcy5zY3JpcHQgPSBhd2FpdCBDb252ZXJ0U3ludGF4TWluaSh0aGlzLnNjcmlwdCwgXCJAY29tcGlsZVwiLCBcIipcIik7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcih0aGlzLnNjcmlwdCwgdGhpcy5zbWFsbFBhdGgsICc8JSonLCAnJT4nKTtcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgaWYgKHBhcnNlci52YWx1ZXMubGVuZ3RoID09IDEgJiYgcGFyc2VyLnZhbHVlc1swXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiB0aGlzLnNjcmlwdDtcbiAgICAgICAgICAgIGRvRm9yQWxsKHJlc29sdmUpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFt0eXBlLCBmaWxlUGF0aF0gPSBTcGxpdEZpcnN0KCcvJywgdGhpcy5zbWFsbFBhdGgpLCB0eXBlQXJyYXkgPSBnZXRUeXBlc1t0eXBlXSA/PyBnZXRUeXBlcy5TdGF0aWMsXG4gICAgICAgICAgICBjb21waWxlUGF0aCA9IHR5cGVBcnJheVsxXSArIGZpbGVQYXRoICsgJy5jb21wLmpzJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChmaWxlUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVTY3JpcHQocGFyc2VyLnZhbHVlcy5maWx0ZXIoeCA9PiB4LnR5cGUgIT0gJ3RleHQnKS5tYXAoeCA9PiB4LnRleHQpKTtcbiAgICAgICAgY29uc3QgeyBmdW5jcywgc3RyaW5nIH0gPSB0aGlzLm1ldGhvZHMoYXR0cmlidXRlcylcblxuICAgICAgICBjb25zdCB0b0ltcG9ydCA9IGF3YWl0IGNvbXBpbGVJbXBvcnQoc3RyaW5nLCBjb21waWxlUGF0aCwgZmlsZVBhdGgsIHR5cGVBcnJheSwgdGhpcy5pc1RzLCB0aGlzLnNlc3Npb25JbmZvLmRlYnVnLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgY29uc3QgZXhlY3V0ZSA9IGFzeW5jIChmdW5jczogYW55W10pID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVidWlsZENvZGUocGFyc2VyLCBhd2FpdCB0b0ltcG9ydCguLi5mdW5jcykpO1xuICAgICAgICAgICAgfSBjYXRjaChlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBlcnIsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IGV4ZWN1dGU7IC8vIHNhdmUgdGhpcyB0byBjYWNoZVxuICAgICAgICBjb25zdCB0aGlzRmlyc3QgPSBhd2FpdCBleGVjdXRlKGZ1bmNzKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSBcImVzYnVpbGQtd2FzbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgaXNUcyB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBwYWdlRGVwcyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHNcIjtcbmltcG9ydCBDdXN0b21JbXBvcnQsIHsgaXNQYXRoQ3VzdG9tIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L2luZGV4XCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5ncywgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkXCI7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9BbGlhc1wiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgZm9ybWF0OiAnY2pzJyxcbiAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cycgOiAnanMnLFxuICAgIG1pbmlmeTogY29kZU1pbmlmeSxcbiAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/ICdleHRlcm5hbCcgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBzb3VyY2VmaWxlOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIGRlYnVnOiBcIlwiICsgaXNEZWJ1Z1xuICAgIH1cbiAgfTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7fSk7XG4gIFJlc3VsdCA9IHRlbXBsYXRlKFxuICAgIFJlc3VsdCxcbiAgICBpc0RlYnVnLFxuICAgIHBhdGguZGlybmFtZSh0ZW1wbGF0ZVBhdGgpLFxuICAgIHRlbXBsYXRlUGF0aCxcbiAgICBwYXJhbXNcbiAgKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHsgY29kZSwgd2FybmluZ3MsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKFJlc3VsdCwgT3B0aW9ucyk7XG4gICAgaWYgKG1lcmdlVHJhY2sgJiYgbWFwKSB7XG4gICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIobWVyZ2VUcmFjaywgd2FybmluZ3MpO1xuICAgICAgUmVzdWx0ID0gKGF3YWl0IGJhY2tUb09yaWdpbmFsKG1lcmdlVHJhY2ssIGNvZGUsIG1hcCkpLlN0cmluZ1dpdGhUYWNrKHNhdmVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3MsIGZpbGVQYXRoKTtcbiAgICAgIFJlc3VsdCA9IGNvZGU7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzYXZlUGF0aCkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShzYXZlUGF0aCwgUmVzdWx0KTtcbiAgfVxuICByZXR1cm4gUmVzdWx0O1xufVxuXG5mdW5jdGlvbiBDaGVja1RzKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEZpbGVQYXRoLmVuZHNXaXRoKFwiLnRzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSkge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKEluU3RhdGljUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICByZXR1cm4gYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgdHlwZUFycmF5WzBdICsgSW5TdGF0aWNQYXRoLFxuICAgIHR5cGVBcnJheVsxXSArIEluU3RhdGljUGF0aCArIFwiLmNqc1wiLFxuICAgIENoZWNrVHMoSW5TdGF0aWNQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkRXh0ZW5zaW9uKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlsZUV4dCA9IHBhdGguZXh0bmFtZShGaWxlUGF0aCk7XG5cbiAgaWYgKEJhc2ljU2V0dGluZ3MucGFydEV4dGVuc2lvbnMuaW5jbHVkZXMoZmlsZUV4dC5zdWJzdHJpbmcoMSkpKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgKGlzVHMoKSA/IFwidHNcIiA6IFwianNcIilcbiAgZWxzZSBpZiAoZmlsZUV4dCA9PSAnJylcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzW2lzVHMoKSA/IFwidHNcIiA6IFwianNcIl07XG5cbiAgcmV0dXJuIEZpbGVQYXRoO1xufVxuXG5jb25zdCBTYXZlZE1vZHVsZXMgPSB7fSwgUHJlcGFyZU1hcCA9IHt9O1xuXG4vKipcbiAqIExvYWRJbXBvcnQgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCB0byBhIGZpbGUsIGFuZCByZXR1cm5zIHRoZSBtb2R1bGUgdGhhdCBpcyBhdCB0aGF0IHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbXBvcnRGcm9tIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBjcmVhdGVkIHRoaXMgaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IEluU3RhdGljUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IFt1c2VEZXBzXSAtIFRoaXMgaXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gd2l0aG91dENhY2hlIC0gYW4gYXJyYXkgb2YgcGF0aHMgdGhhdCB3aWxsIG5vdCBiZSBjYWNoZWQuXG4gKiBAcmV0dXJucyBUaGUgbW9kdWxlIHRoYXQgd2FzIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBMb2FkSW1wb3J0KGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIHsgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGUgPSBbXSwgb25seVByZXBhcmUgfTogeyBpc0RlYnVnOiBib29sZWFuLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSwgb25seVByZXBhcmU/OiBib29sZWFuIH0pIHtcbiAgbGV0IFRpbWVDaGVjazogYW55O1xuICBjb25zdCBvcmlnaW5hbFBhdGggPSBwYXRoLm5vcm1hbGl6ZShJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG5cbiAgSW5TdGF0aWNQYXRoID0gQWRkRXh0ZW5zaW9uKEluU3RhdGljUGF0aCk7XG4gIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShJblN0YXRpY1BhdGgpLnN1YnN0cmluZygxKSwgdGhpc0N1c3RvbSA9IGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGgsIGV4dGVuc2lvbikgfHwgIVsnanMnLCAndHMnXS5pbmNsdWRlcyhleHRlbnNpb24pO1xuICBjb25zdCBTYXZlZE1vZHVsZXNQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoKSwgZmlsZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBJblN0YXRpY1BhdGgpO1xuXG4gIC8vd2FpdCBpZiB0aGlzIG1vZHVsZSBpcyBvbiBwcm9jZXNzLCBpZiBub3QgZGVjbGFyZSB0aGlzIGFzIG9uIHByb2Nlc3MgbW9kdWxlXG4gIGxldCBwcm9jZXNzRW5kOiAodj86IGFueSkgPT4gdm9pZDtcbiAgaWYoIW9ubHlQcmVwYXJlKXtcbiAgICBpZiAoIVNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSlcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gcHJvY2Vzc0VuZCA9IHIpO1xuICAgIGVsc2UgaWYgKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgICBhd2FpdCBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG4gIH1cblxuXG4gIC8vYnVpbGQgcGF0aHNcbiAgY29uc3QgcmVCdWlsZCA9ICFwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSB8fCBwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSAhPSAoVGltZUNoZWNrID0gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKSk7XG5cblxuICBpZiAocmVCdWlsZCkge1xuICAgIFRpbWVDaGVjayA9IFRpbWVDaGVjayA/PyBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpO1xuICAgIGlmIChUaW1lQ2hlY2sgPT0gbnVsbCkge1xuICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgdGV4dDogYEltcG9ydCAnJHtJblN0YXRpY1BhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtpbXBvcnRGcm9tfSdgXG4gICAgICB9KTtcbiAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbnVsbFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpc0N1c3RvbSkgLy8gb25seSBpZiBub3QgY3VzdG9tIGJ1aWxkXG4gICAgICBhd2FpdCBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gICAgcGFnZURlcHMudXBkYXRlKFNhdmVkTW9kdWxlc1BhdGgsIFRpbWVDaGVjayk7XG4gIH1cblxuICBpZiAodXNlRGVwcykge1xuICAgIHVzZURlcHNbSW5TdGF0aWNQYXRoXSA9IHsgdGhpc0ZpbGU6IFRpbWVDaGVjayB9O1xuICAgIHVzZURlcHMgPSB1c2VEZXBzW0luU3RhdGljUGF0aF07XG4gIH1cblxuICBjb25zdCBpbmhlcml0YW5jZUNhY2hlID0gd2l0aG91dENhY2hlWzBdID09IEluU3RhdGljUGF0aDtcbiAgaWYgKGluaGVyaXRhbmNlQ2FjaGUpXG4gICAgd2l0aG91dENhY2hlLnNoaWZ0KClcbiAgZWxzZSBpZiAoIXJlQnVpbGQgJiYgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdICYmICEoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgcmV0dXJuIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoSW5TdGF0aWNQYXRoKSwgcCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoZmlsZVBhdGgsIHAsIHR5cGVBcnJheSwgeyBpc0RlYnVnLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGU6IGluaGVyaXRhbmNlQ2FjaGUgPyB3aXRob3V0Q2FjaGUgOiBbXSB9KTtcbiAgfVxuXG4gIGxldCBNeU1vZHVsZTogYW55O1xuICBpZiAodGhpc0N1c3RvbSkge1xuICAgIE15TW9kdWxlID0gYXdhaXQgQ3VzdG9tSW1wb3J0KG9yaWdpbmFsUGF0aCwgZmlsZVBhdGgsIGV4dGVuc2lvbiwgcmVxdWlyZU1hcCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVxdWlyZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBJblN0YXRpY1BhdGggKyBcIi5janNcIik7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUocmVxdWlyZVBhdGgpO1xuXG4gICAgaWYgKG9ubHlQcmVwYXJlKSB7IC8vIG9ubHkgcHJlcGFyZSB0aGUgbW9kdWxlIHdpdGhvdXQgYWN0aXZlbHkgaW1wb3J0aW5nIGl0XG4gICAgICBQcmVwYXJlTWFwW1NhdmVkTW9kdWxlc1BhdGhdID0gKCkgPT4gTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTXlNb2R1bGUgPSBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwKTtcbiAgfVxuXG4gIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IE15TW9kdWxlO1xuICBwcm9jZXNzRW5kPy4oKTtcblxuICByZXR1cm4gTXlNb2R1bGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbXBvcnRGaWxlKGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10pIHtcbiAgaWYgKCFpc0RlYnVnKSB7XG4gICAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCBoYXZlSW1wb3J0ID0gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gICAgaWYgKGhhdmVJbXBvcnQgIT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGhhdmVJbXBvcnQ7XG4gICAgZWxzZSBpZiAoUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSkge1xuICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSgpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbW9kdWxlO1xuICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTG9hZEltcG9ydChpbXBvcnRGcm9tLCBJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwge2lzRGVidWcsIHVzZURlcHMsIHdpdGhvdXRDYWNoZX0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZU9uY2UoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBmaWxlUGF0aCxcbiAgICB0ZW1wRmlsZSxcbiAgICBDaGVja1RzKGZpbGVQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIGF3YWl0IE15TW9kdWxlKChwYXRoOiBzdHJpbmcpID0+IGltcG9ydChwYXRoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlQ2pzU2NyaXB0KGNvbnRlbnQ6IHN0cmluZykge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0ZW1wRmlsZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kZWwgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBmYWtlIHNjcmlwdCBsb2NhdGlvbiwgYSBmaWxlIGxvY2F0aW9uLCBhIHR5cGUgYXJyYXksIGFuZCBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgb3Igbm90IGl0J3NcbiAqIGEgVHlwZVNjcmlwdCBmaWxlLiBJdCB0aGVuIGNvbXBpbGVzIHRoZSBzY3JpcHQgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIHRoZSBtb2R1bGVcbiAqIFRoaXMgaXMgZm9yIFJ1blRpbWUgQ29tcGlsZSBTY3JpcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2xvYmFsUHJhbXMgLSBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLFxuICogdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNjcmlwdExvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBzY3JpcHQgdG8gYmUgY29tcGlsZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGUgZnJvbSB0aGUgc3RhdGljIGZvbGRlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFtzdHJpbmcsIHN0cmluZ11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlU2NyaXB0IC0gYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIElmIHRydWUsIHRoZSBjb2RlIHdpbGwgYmUgY29tcGlsZWQgd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlQ29kZSAtIFRoZSBjb2RlIHRoYXQgd2lsbCBiZSBjb21waWxlZCBhbmQgc2F2ZWQgdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTWFwQ29tbWVudCAtIHN0cmluZ1xuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUltcG9ydChnbG9iYWxQcmFtczogc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBtZXJnZVRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCB0eXBlQXJyYXlbMV0pO1xuXG4gIGNvbnN0IGZ1bGxTYXZlTG9jYXRpb24gPSBzY3JpcHRMb2NhdGlvbiArIFwiLmNqc1wiO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0eXBlQXJyYXlbMF0gKyBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgc2NyaXB0TG9jYXRpb24sXG4gICAgZnVsbFNhdmVMb2NhdGlvbixcbiAgICBpc1R5cGVTY3JpcHQsXG4gICAgaXNEZWJ1ZyxcbiAgICB7IHBhcmFtczogZ2xvYmFsUHJhbXMsIG1lcmdlVHJhY2ssIHRlbXBsYXRlUGF0aCwgY29kZU1pbmlmeTogZmFsc2UgfVxuICApO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgcCk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydCh0ZW1wbGF0ZVBhdGgsIHAsIHR5cGVBcnJheSwge2lzRGVidWd9KTtcbiAgfVxuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGZ1bGxTYXZlTG9jYXRpb24pO1xuICByZXR1cm4gYXN5bmMgKC4uLmFycjogYW55W10pID0+IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXAsIC4uLmFycik7XG59IiwgImltcG9ydCB7IFN0cmluZ01hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IE1pbmlTZWFyY2gsIHtTZWFyY2hPcHRpb25zLCBTZWFyY2hSZXN1bHR9IGZyb20gJ21pbmlzZWFyY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hSZWNvcmQge1xuICAgIHByaXZhdGUgZnVsbFBhdGg6IHN0cmluZ1xuICAgIHByaXZhdGUgaW5kZXhEYXRhOiB7W2tleTogc3RyaW5nXToge1xuICAgICAgICB0aXRsZXM6IFN0cmluZ01hcCxcbiAgICAgICAgdGV4dDogc3RyaW5nXG4gICAgfX1cbiAgICBwcml2YXRlIG1pbmlTZWFyY2g6IE1pbmlTZWFyY2g7XG4gICAgY29uc3RydWN0b3IoZmlsZXBhdGg6IHN0cmluZyl7XG4gICAgICAgIHRoaXMuZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBmaWxlcGF0aCArICcuanNvbidcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKCl7XG4gICAgICAgIHRoaXMuaW5kZXhEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZ1bGxQYXRoKTtcbiAgICAgICAgY29uc3QgdW53cmFwcGVkOiB7aWQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZ31bXSA9IFtdO1xuXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgZm9yKGNvbnN0IHBhdGggaW4gdGhpcy5pbmRleERhdGEpe1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuaW5kZXhEYXRhW3BhdGhdO1xuICAgICAgICAgICAgZm9yKGNvbnN0IGlkIGluIGVsZW1lbnQudGl0bGVzKXtcbiAgICAgICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50aXRsZXNbaWRdLCB1cmw6IGAvJHtwYXRofSMke2lkfWB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVud3JhcHBlZC5wdXNoKHtpZDogY291bnRlcisrLCB0ZXh0OiBlbGVtZW50LnRleHQsIHVybDogYC8ke3BhdGh9YH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5taW5pU2VhcmNoID0gbmV3IE1pbmlTZWFyY2goe1xuICAgICAgICAgICAgZmllbGRzOiBbJ3RleHQnXSxcbiAgICAgICAgICAgIHN0b3JlRmllbGRzOiBbJ2lkJywgJ3RleHQnLCAndXJsJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5taW5pU2VhcmNoLmFkZEFsbEFzeW5jKHVud3JhcHBlZCk7XG4gICAgfVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHN0cmluZyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBtYXRjaGVzXG4gKiBAcGFyYW0gdGV4dCAtIFRoZSB0ZXh0IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIGxlbmd0aCAtIG1heGltdW0gbGVuZ3RoIC0gKm5vdCBjdXR0aW5nIGhhbGYgd29yZHMqXG4gKiBcbiAqIGFkZEFmdGVyTWF4TGVuZ3RoIC0gYWRkIHRleHQgaWYgYSB0ZXh0IHJlc3VsdCByZWFjaCB0aGUgbWF4aW11bSBsZW5ndGgsIGZvciBleGFtcGxlICcuLi4nXG4gKiBAcGFyYW0gdGFnIC0gVGhlIHRhZyB0byB3cmFwIGFyb3VuZCB0aGUgZm91bmRlZCBzZWFyY2ggdGVybXMuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBvYmplY3RzLCBlYWNoIG9iamVjdCBjb250YWluaW5nIHRoZSBgdGV4dGAgb2YgdGhlIHNlYXJjaCByZXN1bHQsIGBsaW5rYCB0byB0aGUgcGFnZSwgYW5kIGFuIGFycmF5IG9mXG4gKiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIHRlcm1zIGFuZCB0aGUgaW5kZXggb2YgdGhlIHRlcm0gaW4gdGhlIHRleHQuXG4gKi9cbiAgICBzZWFyY2godGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zICYge2xlbmd0aD86IG51bWJlciwgYWRkQWZ0ZXJNYXhMZW5ndGg/OiBzdHJpbmd9ID0ge2Z1enp5OiB0cnVlLCBsZW5ndGg6IDIwMCwgYWRkQWZ0ZXJNYXhMZW5ndGg6ICcuLi4nfSwgdGFnID0gJ2InKTogKFNlYXJjaFJlc3VsdCAmIHt0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nfSlbXXtcbiAgICAgICAgY29uc3QgZGF0YSA9IDxhbnk+dGhpcy5taW5pU2VhcmNoLnNlYXJjaCh0ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgaWYoIXRhZykgcmV0dXJuIGRhdGE7XG5cbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgZGF0YSl7XG4gICAgICAgICAgICBmb3IoY29uc3QgdGVybSBvZiBpLnRlcm1zKXtcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmxlbmd0aCAmJiBpLnRleHQubGVuZ3RoID4gb3B0aW9ucy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSBpLnRleHQuc3Vic3RyaW5nKDAsIG9wdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaS50ZXh0W29wdGlvbnMubGVuZ3RoXS50cmltKCkgIT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaS50ZXh0ID0gc3Vic3RyaW5nLnN1YnN0cmluZygwLCBzdWJzdHJpbmcubGFzdEluZGV4T2YoJyAnKSkgKyAob3B0aW9ucy5hZGRBZnRlck1heExlbmd0aCA/PyAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBzdWJzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBpLnRleHQudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXIgPSBpLnRleHQudG9Mb3dlckNhc2UoKSwgcmVidWlsZCA9ICcnO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxvd2VyLmluZGV4T2YodGVybSk7XG4gICAgICAgICAgICAgICAgbGV0IGJlZW5MZW5ndGggPSAwO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoaW5kZXggIT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICByZWJ1aWxkICs9IGkudGV4dC5zdWJzdHJpbmcoYmVlbkxlbmd0aCwgYmVlbkxlbmd0aCArIGluZGV4KSArICBgPCR7dGFnfT4ke2kudGV4dC5zdWJzdHJpbmcoaW5kZXggKyBiZWVuTGVuZ3RoLCBpbmRleCArIHRlcm0ubGVuZ3RoICsgYmVlbkxlbmd0aCl9PC8ke3RhZ30+YFxuICAgICAgICAgICAgICAgICAgICBsb3dlciA9IGxvd2VyLnN1YnN0cmluZyhpbmRleCArIHRlcm0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgYmVlbkxlbmd0aCArPSBpbmRleCArIHRlcm0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGxvd2VyLmluZGV4T2YodGVybSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gcmVidWlsZCArIGkudGV4dC5zdWJzdHJpbmcoYmVlbkxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBzdWdnZXN0KHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyl7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbmlTZWFyY2guYXV0b1N1Z2dlc3QodGV4dCwgb3B0aW9ucyk7XG4gICAgfVxufSIsICJpbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gXCIuLi8uLi8uLi9CdWlsZEluRnVuYy9TZWFyY2hSZWNvcmRcIlxuaW1wb3J0IHtTZXR0aW5nc30gIGZyb20gJy4uLy4uLy4uL01haW5CdWlsZC9TZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG59IiwgImltcG9ydCBwYWNrYWdlRXhwb3J0IGZyb20gXCIuL3BhY2thZ2VFeHBvcnRcIjtcblxuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGFsaWFzTmFtZXMgPSBbcGFja2FnZU5hbWVdXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGg6IHN0cmluZyk6IGFueSB7XG5cbiAgICBzd2l0Y2ggKG9yaWdpbmFsUGF0aCkge1xuICAgICAgICAvL0B0cy1pZ25vcmUtbmV4dC1saW5lXG4gICAgICAgIGNhc2UgcGFja2FnZU5hbWU6XG4gICAgICAgICAgICByZXR1cm4gcGFja2FnZUV4cG9ydCgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXNPclBhY2thZ2Uob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXZlID0gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoaGF2ZSkgcmV0dXJuIGhhdmVcbiAgICByZXR1cm4gaW1wb3J0KG9yaWdpbmFsUGF0aCk7XG59IiwgImltcG9ydCBJbXBvcnRBbGlhcywgeyBhbGlhc05hbWVzIH0gZnJvbSAnLi9BbGlhcyc7XG5pbXBvcnQgSW1wb3J0QnlFeHRlbnNpb24sIHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuL0V4dGVuc2lvbi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikgfHwgYWxpYXNOYW1lcy5pbmNsdWRlcyhvcmlnaW5hbFBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nLCByZXF1aXJlOiAocDogc3RyaW5nKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGlhc0V4cG9ydCA9IGF3YWl0IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGFsaWFzRXhwb3J0KSByZXR1cm4gYWxpYXNFeHBvcnQ7XG4gICAgcmV0dXJuIEltcG9ydEJ5RXh0ZW5zaW9uKGZ1bGxQYXRoLCBleHRlbnNpb24pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBSYXpvclRvRUpTLCBSYXpvclRvRUpTTWluaSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyJztcblxuXG5jb25zdCBhZGRXcml0ZU1hcCA9IHtcbiAgICBcImluY2x1ZGVcIjogXCJhd2FpdCBcIixcbiAgICBcImltcG9ydFwiOiBcImF3YWl0IFwiLFxuICAgIFwidHJhbnNmZXJcIjogXCJyZXR1cm4gYXdhaXQgXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBvcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKUyh0ZXh0LmVxKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhzdWJzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU9JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlOiR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZFdyaXRlTWFwW2kubmFtZV19JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuXG4vKipcbiAqIENvbnZlcnRTeW50YXhNaW5pIHRha2VzIHRoZSBjb2RlIGFuZCBhIHNlYXJjaCBzdHJpbmcgYW5kIGNvbnZlcnQgY3VybHkgYnJhY2tldHNcbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbmQgLSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWRkRUpTIC0gVGhlIHN0cmluZyB0byBhZGQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlanMuXG4gKiBAcmV0dXJucyBBIHN0cmluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXhNaW5pKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbmQ6IHN0cmluZywgYWRkRUpTOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTTWluaSh0ZXh0LmVxLCBmaW5kKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICBpZiAodmFsdWVzW2ldICE9IHZhbHVlc1tpICsgMV0pXG4gICAgICAgICAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpXSwgdmFsdWVzW2kgKyAxXSkpO1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaSArIDJdLCB2YWx1ZXNbaSArIDNdKTtcbiAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZEVKU30ke3N1YnN0cmluZ30lPmA7XG4gICAgfVxuXG4gICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZygodmFsdWVzLmF0KC0xKT8/LTEpICsgMSkpO1xuXG4gICAgcmV0dXJuIGJ1aWxkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBvb2wgfSBmcm9tIFwiLi4vQmFzZVJlYWRlci9SZWFkZXJcIjtcblxuYXN5bmMgZnVuY3Rpb24gSFRNTEF0dHJQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc2s6IG51bWJlcixcbiAgICBlazogbnVtYmVyLFxuICAgIHN2OiBudW1iZXIsXG4gICAgZXY6IG51bWJlcixcbiAgICBzcGFjZTogYm9vbGVhbixcbiAgICBjaGFyOiBzdHJpbmdcbn1bXT4ge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgcG9vbC5leGVjKCdIVE1MQXR0clBhcnNlcicsIFt0ZXh0XSlcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ0RhdGFQYXJzZXIge1xuICAgIHZhbHVlQXJyYXk6IHtcbiAgICAgICAga2V5PzogU3RyaW5nVHJhY2tlclxuICAgICAgICB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsXG4gICAgICAgIHNwYWNlOiBib29sZWFuLFxuICAgICAgICBjaGFyPzogc3RyaW5nXG4gICAgfVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGV4dDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VyKCkge1xuICAgICAgICBjb25zdCBwYXJzZSA9IGF3YWl0IEhUTUxBdHRyUGFyc2VyKHRoaXMudGV4dC5lcSk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGNoYXIsIGVrLCBldiwgc2ssIHNwYWNlLCBzdiB9IG9mIHBhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGNoYXIsIHNwYWNlLCBrZXk6IHRoaXMudGV4dC5zdWJzdHJpbmcoc2ssIGVrKSwgdmFsdWU6IHN2ID09IGV2ID8gdHJ1ZSA6IHRoaXMudGV4dC5zdWJzdHJpbmcoc3YsIGV2KSB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3BJdGVtKGtleTogc3RyaW5nKXtcbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09IC0xID8gbnVsbDogdGhpcy52YWx1ZUFycmF5LnNwbGljZShpbmRleCwgMSkuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBwb3BUcmFja2VyKGtleTogc3RyaW5nKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0VHJhY2tlcjxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wVHJhY2tlcihrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlUcmFja2VyPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFRyYWNrZXIoa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gZGF0YS5lcTogdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wU3RyaW5nKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gdmFsdWUuZXEgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BCb29sZWFuKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMucG9wU3RyaW5nKGtleSkgPz8gZGVmYXVsdFZhbHVlKVxuICAgIH1cblxuICAgIGV4aXN0cyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSkgIT0gbnVsbFxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YTogdmFsdWU7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSAnY2xhc3MnKTtcbiAgICAgICAgaWYgKGhhdmU/LnZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcilcbiAgICAgICAgICAgIGhhdmUudmFsdWUuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcgKyBjbGFzc05hbWUpLnRyaW1TdGFydCgpO1xuICAgICAgICBlbHNlIGlmIChoYXZlPy52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaGF2ZS52YWx1ZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hWYWx1ZSgnY2xhc3MnLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVidWlsZFNwYWNlKCkge1xuICAgICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgdmFsdWUsIGNoYXIsIGtleSwgc3BhY2UgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIHNwYWNlICYmIG5ld0F0dHJpYnV0ZXMuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBwdXNoVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpO1xuICAgICAgICBpZiAoaGF2ZSkgcmV0dXJuIChoYXZlLnZhbHVlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpKTtcblxuICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwga2V5KSwgdmFsdWU6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKSwgY2hhcjogJ1wiJywgc3BhY2U6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgbWFwKCkge1xuICAgICAgICBjb25zdCBhdHRyTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IHRydWUgfSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSBhdHRyTWFwW2tleS5lcV0gPSB2YWx1ZSA9PT0gdHJ1ZSA/IHRydWUgOiB2YWx1ZS5lcTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyTWFwO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0X2ZpbGUgPSBydW5fc2NyaXB0X25hbWUuc3BsaXQoLy0+fDxsaW5lPi8pLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPGxpbmU+L2dpLCAnPGJyLz4nKSArICc8L3A+PHA+RXJyb3IgbWVzc2FnZTogJyArIGUubWVzc2FnZSArICc8L3A+YCl9JztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXRoOiBcIiArIHJ1bl9zY3JpcHRfbmFtZS5zbGljZSgwLCAtbGFzdF9maWxlLmxlbmd0aCkucmVwbGFjZSgvPGxpbmU+L2dpLCAnXFxcXG4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgpfVwiICsgbGFzdF9maWxlLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBtZXNzYWdlOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBydW5uaW5nIHRoaXMgY29kZTogXFxcXFwiXCIgKyBydW5fc2NyaXB0X2NvZGUgKyAnXCInKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN0YWNrOiBcIiArIGUuc3RhY2spO1xuICAgICAgICAgICAgICAgIH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgfX0pO31gKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbHRDb2RlID0gYXdhaXQgUGFnZVRlbXBsYXRlLlJ1bkFuZEV4cG9ydCh0ZXh0LCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuQWRkUGFnZVRlbXBsYXRlKGJ1aWx0Q29kZSwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHN0YXRpYyBBZGRBZnRlckJ1aWxkKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBJblBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBkYXRhT2JqZWN0OiBhbnksIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhe1xuICAgICAgICAgICAgY29uc3QgX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHsuLi5fcGFnZSR7ZGF0YU9iamVjdCA/ICcsJyArIGRhdGFPYmplY3QgOiAnJ319O1xuICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHslPmApO1xuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjaygnPCUhfX19JT4nKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFJhem9yU3ludGF4IGZyb20gJy4vUmF6b3JTeW50YXgnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdldFN5bnRheChDb21waWxlVHlwZTogYW55KSB7XG4gICAgbGV0IGZ1bmM6IGFueTtcbiAgICBzd2l0Y2ggKENvbXBpbGVUeXBlLm5hbWUgfHwgQ29tcGlsZVR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlJhem9yXCI6XG4gICAgICAgICAgICBmdW5jID0gUmF6b3JTeW50YXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59IiwgImltcG9ydCBBZGRTeW50YXggZnJvbSAnLi9TeW50YXgvSW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZFBsdWdpbiB7XG5cdHB1YmxpYyBTZXR0aW5nc09iamVjdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoU2V0dGluZ3NPYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgICAgIHRoaXMuU2V0dGluZ3NPYmplY3QgPSBTZXR0aW5nc09iamVjdFxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRlZmF1bHRTeW50YXgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2V0dGluZ3NPYmplY3QuQmFzaWNDb21waWxhdGlvblN5bnRheC5jb25jYXQodGhpcy5TZXR0aW5nc09iamVjdC5BZGRDb21waWxlU3ludGF4KTtcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEJhc2ljKHRleHQ6IFN0cmluZ1RyYWNrZXIsIE9EYXRhOnN0cmluZyB8YW55LCBwYXRoOnN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vYWRkIFN5bnRheFxuXG4gICAgICAgIGlmICghT0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KE9EYXRhKSkge1xuICAgICAgICAgICAgT0RhdGEgPSBbT0RhdGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIE9EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBTeW50YXggPSBhd2FpdCBBZGRTeW50YXgoaSk7XG5cbiAgICAgICAgICAgIGlmIChTeW50YXgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gYXdhaXQgU3ludGF4KHRleHQsIGksIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIHBhZ2VzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgY29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRDb21wb25lbnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn0iLCAiLy9nbG9iYWwgc2V0dGluZ3MgZm9yIGJ1aWxkIGluIGNvbXBvbmVudHNcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0ge1xuICAgIHBsdWdpbnM6IFtdXG59OyIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGgsIFBhcnNlRGVidWdMaW5lLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgKiBhcyBleHRyaWNhdGUgZnJvbSAnLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSAnLi90cmFuc2Zvcm0vU2NyaXB0JztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEJ1aWxkU2NyaXB0U2V0dGluZ3MgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncyc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IGZpbmFsaXplQnVpbGQgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHsgQWRkQ29tcGlsZVN5bnRheDogW10sIHBsdWdpbnM6IFtdLCBCYXNpY0NvbXBpbGF0aW9uU3ludGF4OiBbJ1Jhem9yJ10gfTtcbmNvbnN0IFBsdWdpbkJ1aWxkID0gbmV3IEFkZFBsdWdpbihTZXR0aW5ncyk7XG5leHBvcnQgY29uc3QgQ29tcG9uZW50cyA9IG5ldyBJbnNlcnRDb21wb25lbnQoUGx1Z2luQnVpbGQpO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0UGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBTZXR0aW5ncy5wbHVnaW5zLmZpbmQoYiA9PiBiID09IG5hbWUgfHwgKDxhbnk+Yik/Lm5hbWUgPT0gbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTb21lUGx1Z2lucyguLi5kYXRhOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBkYXRhLnNvbWUoeCA9PiBHZXRQbHVnaW4oeCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcygpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheC5pbmNsdWRlcygnVHlwZVNjcmlwdCcpO1xufVxuXG5Db21wb25lbnRzLk1pY3JvUGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5Db21wb25lbnRzLkdldFBsdWdpbiA9IEdldFBsdWdpbjtcbkNvbXBvbmVudHMuU29tZVBsdWdpbnMgPSBTb21lUGx1Z2lucztcbkNvbXBvbmVudHMuaXNUcyA9IGlzVHM7XG5cbkJ1aWxkU2NyaXB0U2V0dGluZ3MucGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5cbmFzeW5jIGZ1bmN0aW9uIG91dFBhZ2UoZGF0YTogU3RyaW5nVHJhY2tlciwgc2NyaXB0RmlsZTogU3RyaW5nVHJhY2tlciwgcGFnZVBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG5cbiAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKHNlc3Npb25JbmZvLCBkYXRhLCBpc1RzKCkpO1xuICAgIGlmKCFhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3MocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIHBhZ2VOYW1lLCB7ZHluYW1pY0NoZWNrfSkpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWxOYW1lID0gYmFzZURhdGEuZGVmYXVsdFZhbHVlUG9wQW55KCdtb2RlbCcsICd3ZWJzaXRlJyk7XG5cbiAgICBpZiAoIW1vZGVsTmFtZSkgcmV0dXJuIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlLCBiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgIGRhdGEgPSBiYXNlRGF0YS5jbGVhckRhdGE7XG5cbiAgICAvL2ltcG9ydCBtb2RlbFxuICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQ3JlYXRlRmlsZVBhdGgocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIG1vZGVsTmFtZSwgJ01vZGVscycsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLm1vZGVsKTsgLy8gZmluZCBsb2NhdGlvbiBvZiB0aGUgZmlsZVxuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdWxsUGF0aCkpIHtcbiAgICAgICAgY29uc3QgRXJyb3JNZXNzYWdlID0gYEVycm9yIG1vZGVsIG5vdCBmb3VuZCAtPiAke21vZGVsTmFtZX0gYXQgcGFnZSAke3BhZ2VOYW1lfWA7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0LCBQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihFcnJvck1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgRnVsbFBhdGgpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3RcblxuICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBGdWxsUGF0aCwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgIGxldCBtb2RlbERhdGEgPSBhd2FpdCBQYXJzZUJhc2VQYWdlLnJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoYmFzZU1vZGVsRGF0YS5hbGxEYXRhKTtcblxuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIG1vZGVsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgcGFnZU5hbWUgKz0gXCIgLT4gXCIgKyBTbWFsbFBhdGg7XG5cbiAgICAvL0dldCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBhbGxEYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdzKG1vZGVsRGF0YSwgWycnXSwgJzonLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICBpZiAoYWxsRGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHdpdGhpbiBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgbW9kZWxEYXRhID0gYWxsRGF0YS5kYXRhO1xuICAgIGNvbnN0IHRhZ0FycmF5ID0gYWxsRGF0YS5mb3VuZC5tYXAoeCA9PiB4LnRhZy5zdWJzdHJpbmcoMSkpO1xuICAgIGNvbnN0IG91dERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ3MoZGF0YSwgdGFnQXJyYXksICdAJyk7XG5cbiAgICBpZiAob3V0RGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIFdpdGggbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vQnVpbGQgV2l0aCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBtb2RlbEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBhbGxEYXRhLmZvdW5kKSB7XG4gICAgICAgIGkudGFnID0gaS50YWcuc3Vic3RyaW5nKDEpOyAvLyByZW1vdmluZyB0aGUgJzonXG4gICAgICAgIGNvbnN0IGhvbGRlckRhdGEgPSBvdXREYXRhLmZvdW5kLmZpbmQoKGUpID0+IGUudGFnID09ICdAJyArIGkudGFnKTtcblxuICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhLnN1YnN0cmluZygwLCBpLmxvYykpO1xuICAgICAgICBtb2RlbERhdGEgPSBtb2RlbERhdGEuc3Vic3RyaW5nKGkubG9jKTtcblxuICAgICAgICBpZiAoaG9sZGVyRGF0YSkge1xuICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGhvbGRlckRhdGEuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFRyeSBsb2FkaW5nIGRhdGEgZnJvbSBwYWdlIGJhc2VcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGcm9tQmFzZSA9IGJhc2VEYXRhLmdldChpLnRhZyk7XG5cbiAgICAgICAgICAgIGlmIChsb2FkRnJvbUJhc2UgJiYgbG9hZEZyb21CYXNlICE9PSB0cnVlICYmIGxvYWRGcm9tQmFzZS5lcS50b0xvd2VyQ2FzZSgpICE9ICdpbmhlcml0JylcbiAgICAgICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobG9hZEZyb21CYXNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG91dFBhZ2UobW9kZWxCdWlsZCwgc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUpLCBGdWxsUGF0aCwgcGFnZU5hbWUsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW5zZXJ0KGRhdGE6IHN0cmluZywgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIG5lc3RlZFBhZ2U6IGJvb2xlYW4sIG5lc3RlZFBhZ2VEYXRhOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pIHtcbiAgICBsZXQgRGVidWdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGRhdGEpO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgb3V0UGFnZShEZWJ1Z1N0cmluZywgbmV3IFN0cmluZ1RyYWNrZXIoRGVidWdTdHJpbmcuRGVmYXVsdEluZm9UZXh0KSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbywgZHluYW1pY0NoZWNrKTtcblxuICAgIGlmKERlYnVnU3RyaW5nID09IG51bGwpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQbHVnaW5CdWlsZC5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IENvbXBvbmVudHMuSW5zZXJ0KERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBmaW5hbGl6ZUJ1aWxkKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mbywgZnVsbFBhdGhDb21waWxlKTtcbiAgICBcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zKERlYnVnU3RyaW5nKTtcbiAgICBEZWJ1Z1N0cmluZz0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgIHJldHVybiBEZWJ1Z1N0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCdWlsZEpTLCBCdWlsZEpTWCwgQnVpbGRUUywgQnVpbGRUU1ggfSBmcm9tICcuL0ZvclN0YXRpYy9TY3JpcHQnO1xuaW1wb3J0IEJ1aWxkU3ZlbHRlIGZyb20gJy4vRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTdHlsZVNhc3MgfSBmcm9tICcuL0ZvclN0YXRpYy9TdHlsZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgU3lzdGVtRGF0YSwgZ2V0RGlybmFtZSwgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFJlc3BvbnNlLCBSZXF1ZXN0IH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwcm9tcHRseSBmcm9tICdwcm9tcHRseSc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5cbmNvbnN0IFN1cHBvcnRlZFR5cGVzID0gWydqcycsICdzdmVsdGUnLCAndHMnLCAnanN4JywgJ3RzeCcsICdjc3MnLCAnc2FzcycsICdzY3NzJ107XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1N0YXRpY0ZpbGVzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvID0gU3RhdGljRmlsZXNJbmZvLnN0b3JlW3BhdGhdO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG8pIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIHAgPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBvW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAhbztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGZ1bGxDb21waWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBzd2l0Y2ggKGV4dCkge1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIGNhc2UgJ3Nhc3MnOlxuICAgICAgICBjYXNlICdzY3NzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3R5bGVTYXNzKFNtYWxsUGF0aCwgZXh0LCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmVsdGUnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdmVsdGUoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGZ1bGxDb21waWxlUGF0aCArPSAnLmpzJztcbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsQ29tcGlsZVBhdGgpKSB7XG4gICAgICAgIFN0YXRpY0ZpbGVzSW5mby51cGRhdGUoU21hbGxQYXRoLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGVidWcpXG4gICAgICAgIHJldHVybiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgYnVpbGRJbiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICBleHQ/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGluU2VydmVyPzogc3RyaW5nO1xufVxuXG5jb25zdCBzdGF0aWNGaWxlcyA9IFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy9jbGllbnQvJztcbmNvbnN0IGdldFN0YXRpYzogYnVpbGRJbltdID0gW3tcbiAgICBwYXRoOiBcInNlcnYvdGVtcC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcImJ1aWxkVGVtcGxhdGUuanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvY29ubmVjdC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1ha2VDb25uZWN0aW9uLmpzXCJcbn0sXG57XG4gICAgcGF0aDogXCJzZXJ2L21kLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFya2Rvd25Db3B5LmpzXCJcbn1dO1xuXG5jb25zdCBnZXRTdGF0aWNGaWxlc1R5cGU6IGJ1aWxkSW5bXSA9IFt7XG4gICAgZXh0OiAnLnB1Yi5qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLm1qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLmNzcycsXG4gICAgdHlwZTogJ2Nzcydcbn1dO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0OiBSZXF1ZXN0LCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgY29uc3QgZm91bmQgPSBnZXRTdGF0aWNGaWxlc1R5cGUuZmluZCh4ID0+IGZpbGVQYXRoLmVuZHNXaXRoKHguZXh0KSk7XG5cbiAgICBpZiAoIWZvdW5kKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGNvbnN0IGJhc2VQYXRoID0gUmVxdWVzdC5xdWVyeS50ID09ICdsJyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV07XG4gICAgY29uc3QgaW5TZXJ2ZXIgPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGluU2VydmVyKSlcbiAgICAgICAgcmV0dXJuIHsgLi4uZm91bmQsIGluU2VydmVyIH07XG59XG5cbmxldCBkZWJ1Z2dpbmdXaXRoU291cmNlOiBudWxsIHwgYm9vbGVhbiA9IG51bGw7XG5cbmlmIChhcmd2LmluY2x1ZGVzKCdhbGxvd1NvdXJjZURlYnVnJykpXG4gICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IHRydWU7XG5hc3luYyBmdW5jdGlvbiBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkge1xuICAgIGlmICh0eXBlb2YgZGVidWdnaW5nV2l0aFNvdXJjZSA9PSAnYm9vbGVhbicpXG4gICAgICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IChhd2FpdCBwcm9tcHRseS5wcm9tcHQoXG4gICAgICAgICAgICAnQWxsb3cgZGVidWdnaW5nIEphdmFTY3JpcHQvQ1NTIGluIHNvdXJjZSBwYWdlPyAtIGV4cG9zaW5nIHlvdXIgc291cmNlIGNvZGUgKG5vKScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKHY6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWyd5ZXMnLCAnbm8nXS5pbmNsdWRlcyh2LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3llcyBvciBubycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwXG4gICAgICAgICAgICB9XG4gICAgICAgICkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09ICd5ZXMnO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB9IGNhdGNoIHsgfVxuXG5cbiAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcbn1cblxuY29uc3Qgc2FmZUZvbGRlcnMgPSBbZ2V0VHlwZXMuU3RhdGljWzJdLCBnZXRUeXBlcy5Mb2dzWzJdLCAnTW9kZWxzJywgJ0NvbXBvbmVudHMnXTtcbi8qKlxuICogSWYgdGhlIHVzZXIgaXMgaW4gZGVidWcgbW9kZSwgYW5kIHRoZSBmaWxlIGlzIGEgc291cmNlIGZpbGUsIGFuZCB0aGUgdXNlciBjb21tZW5kIGxpbmUgYXJndW1lbnQgaGF2ZSBhbGxvd1NvdXJjZURlYnVnXG4gKiB0aGVuIHJldHVybiB0aGUgZnVsbCBwYXRoIHRvIHRoZSBmaWxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBpcyB0aGUgY3VycmVudCBwYWdlIGEgZGVidWcgcGFnZT9cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRoYXQgd2FzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSBJZiB0aGlzIHBhdGggYWxyZWFkeSBiZWVuIGNoZWNrZWRcbiAqIHRoZSBmaWxlLlxuICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGZpbGUgYW5kIHRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bnNhZmVEZWJ1Zyhpc0RlYnVnOiBib29sZWFuLCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFpc0RlYnVnIHx8IEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpICE9ICcuc291cmNlJyB8fCAhc2FmZUZvbGRlcnMuaW5jbHVkZXMoZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykuc2hpZnQoKSkgfHwgIWF3YWl0IGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA3KSk7IC8vIHJlbW92aW5nICcuc291cmNlJ1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlRmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNCk7IC8vIHJlbW92aW5nICcuY3NzJ1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgZmlsZVBhdGg7XG5cbiAgICBsZXQgZXhpc3RzOiBib29sZWFuO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoYmFzZUZpbGVQYXRoKSA9PSAnLnN2ZWx0ZScgJiYgKGNoZWNrZWQgfHwgKGV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSkpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgIWV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludFdhcm5pbmdzIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBtb3JlT3B0aW9ucz86IFRyYW5zZm9ybU9wdGlvbnMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IGlucHV0UGF0aCArICc/c291cmNlPXRydWUnLFxuICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAnaW5saW5lJzogZmFsc2UsXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIC4uLm1vcmVPcHRpb25zXG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IGNvZGU7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzLCBmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZnVsbFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanMnLCBpc0RlYnVnLCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgbG9hZGVyOiAndHMnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanN4JywgaXNEZWJ1ZywgeyAuLi4oR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSksIGxvYWRlcjogJ2pzeCcgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0c3gnLCBpc0RlYnVnLCB7IGxvYWRlcjogJ3RzeCcsIC4uLihHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KSB9KTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tIFwiZXNidWlsZC13YXNtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQsIE1lcmdlU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZUVycm9yLCBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWNQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY1BhdGg7XG5cbiAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llcywgbWFwLCBzY3JpcHRMYW5nIH0gPSBhd2FpdCBwcmVwcm9jZXNzKGZ1bGxQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBpblN0YXRpY1BhdGgpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnVsbFBhdGguc3BsaXQoL1xcL3xcXC8vKS5wb3AoKTtcbiAgICBsZXQganM6IGFueSwgY3NzOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwge1xuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXY6IGlzRGVidWcsXG4gICAgICAgICAgICBzb3VyY2VtYXA6IG1hcCxcbiAgICAgICAgICAgIGNzczogZmFsc2UsXG4gICAgICAgICAgICBoeWRyYXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3ZlbHRlUGF0aDogJy9zZXJ2L3N2ZWx0ZSdcbiAgICAgICAgfSk7XG4gICAgICAgIFByaW50U3ZlbHRlV2FybihvdXRwdXQud2FybmluZ3MsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICBqcyA9IG91dHB1dC5qcztcbiAgICAgICAgY3NzID0gb3V0cHV0LmNzcztcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBQcmludFN2ZWx0ZUVycm9yKGVyciwgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aGlzRmlsZTogMFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgY29uc3Qgc291cmNlRmlsZUNsaWVudCA9IGpzLm1hcC5zb3VyY2VzWzBdLnN1YnN0cmluZygxKTtcblxuICAgIGlmKGlzRGVidWcpe1xuICAgICAgICBqcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgfVxuXG4gICAgaWYgKFNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oanMuY29kZSwge1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb2FkZXI6IDxhbnk+c2NyaXB0TGFuZyxcbiAgICAgICAgICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqcy5jb2RlID0gY29kZTtcbiAgICAgICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgICAgICBqcy5tYXAgPSBhd2FpdCBNZXJnZVNvdXJjZU1hcChKU09OLnBhcnNlKG1hcCksIGpzLm1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXdhaXQgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoZXJyLCBqcy5tYXAsIGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgIGpzLmNvZGUgKz0gdG9VUkxDb21tZW50KGpzLm1hcCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3NzLmNvZGUpIHtcbiAgICAgICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuanMnLCBqcy5jb2RlKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVwZW5kZW5jaWVzLFxuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufSIsICJpbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkx9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgIGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgc2Fzc0FuZFNvdXJjZSwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU3R5bGVTYXNzKGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBcInNhc3NcIiB8IFwic2Nzc1wiIHwgXCJjc3NcIiwgaXNEZWJ1ZzogYm9vbGVhbik6IFByb21pc2U8eyBba2V5OiBzdHJpbmddOiBudW1iZXIgfT4ge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG5cbiAgICBjb25zdCBkZXBlbmRlbmNlT2JqZWN0ID0ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCksIGZpbGVEYXRhRGlybmFtZSA9IHBhdGguZGlybmFtZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhmaWxlRGF0YSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBpc0RlYnVnLFxuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KHR5cGUpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZSh0eXBlKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHJlc3VsdC5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jZU9iamVjdFtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKV0gPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhID0gcmVzdWx0LmNzcztcblxuICAgICAgICBpZiAoaXNEZWJ1ZyAmJiByZXN1bHQuc291cmNlTWFwKSB7XG4gICAgICAgICAgICBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHBhdGhUb0ZpbGVVUkwoZmlsZURhdGEpLmhyZWYpO1xuICAgICAgICAgICAgcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzID0gcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzLm1hcCh4ID0+IHBhdGgucmVsYXRpdmUoZmlsZURhdGFEaXJuYW1lLCBmaWxlVVJMVG9QYXRoKHgpKSArICc/c291cmNlPXRydWUnKTtcblxuICAgICAgICAgICAgZGF0YSArPSBgXFxyXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkocmVzdWx0LnNvdXJjZU1hcCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfSovYDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlcGVuZGVuY2VPYmplY3Rcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGlyZW50IH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgSW5zZXJ0LCBDb21wb25lbnRzLCBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgQ2xlYXJXYXJuaW5nIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnXG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBEZWxldGVJbkRpcmVjdG9yeSwgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFJlcVNjcmlwdCBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IFN0YXRpY0ZpbGVzIGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tICcuL0NvbXBpbGVTdGF0ZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVTaXRlTWFwIH0gZnJvbSAnLi9TaXRlTWFwJztcbmltcG9ydCB7IGV4dGVuc2lvbklzLCBpc0ZpbGVUeXBlLCBSZW1vdmVFbmRUeXBlIH0gZnJvbSAnLi9GaWxlVHlwZXMnO1xuaW1wb3J0IHsgcGVyQ29tcGlsZSwgcG9zdENvbXBpbGUsIHBlckNvbXBpbGVQYWdlLCBwb3N0Q29tcGlsZVBhZ2UgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIHsgaXNEZWJ1ZywgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2sgfTogeyBpc0RlYnVnPzogYm9vbGVhbiwgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IEZ1bGxGaWxlUGF0aCA9IHBhdGguam9pbihhcnJheVR5cGVbMF0sIGZpbGVQYXRoKSwgRnVsbFBhdGhDb21waWxlID0gYXJyYXlUeXBlWzFdICsgZmlsZVBhdGggKyAnLmNqcyc7XG5cbiAgICBjb25zdCBodG1sID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICBjb25zdCBFeGNsdVVybCA9IChuZXN0ZWRQYWdlID8gbmVzdGVkUGFnZSArICc8bGluZT4nIDogJycpICsgYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGg7XG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IGhhc1Nlc3Npb25JbmZvID8/IG5ldyBTZXNzaW9uQnVpbGQoYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGgsIEZ1bGxGaWxlUGF0aCwgYXJyYXlUeXBlWzJdLCBpc0RlYnVnLCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikpO1xuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoJ3RoaXNQYWdlJywgRnVsbEZpbGVQYXRoKTtcblxuICAgIGF3YWl0IHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuICAgIGNvbnN0IENvbXBpbGVkRGF0YSA9IChhd2FpdCBJbnNlcnQoaHRtbCwgRnVsbFBhdGhDb21waWxlLCBCb29sZWFuKG5lc3RlZFBhZ2UpLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGR5bmFtaWNDaGVjaykpID8/IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgYXdhaXQgcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgaWYgKCFuZXN0ZWRQYWdlICYmIENvbXBpbGVkRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShGdWxsUGF0aENvbXBpbGUsIENvbXBpbGVkRGF0YS5TdHJpbmdXaXRoVGFjayhGdWxsUGF0aENvbXBpbGUpKTtcbiAgICAgICAgcGFnZURlcHMudXBkYXRlKEV4Y2x1VXJsLCBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIHJldHVybiB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm8gfTtcbn1cblxuZnVuY3Rpb24gUmVxdWlyZVNjcmlwdChzY3JpcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyJywgc2NyaXB0LCBnZXRUeXBlcy5TdGF0aWMsIHsgaXNEZWJ1ZzogZmFsc2UsIG9ubHlQcmVwYXJlOiB0cnVlIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ta2RpcihhcnJheVR5cGVbMV0gKyBjb25uZWN0KTtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgICAgICBpZiAoYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKGFycmF5VHlwZVsyXSArICcvJyArIGNvbm5lY3QpKSAvL2NoZWNrIGlmIG5vdCBhbHJlYWR5IGNvbXBpbGUgZnJvbSBhICdpbi1maWxlJyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbXBpbGVGaWxlKGNvbm5lY3QsIGFycmF5VHlwZSwgeyBkeW5hbWljQ2hlY2s6ICFleHRlbnNpb25JcyhuLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVTY3JpcHQoY29ubmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgU3RhdGljRmlsZXMoY29ubmVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlU2NyaXB0cyhzY3JpcHRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBzY3JpcHRzKSB7XG4gICAgICAgIGF3YWl0IFJlcXVpcmVTY3JpcHQocGF0aCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBDcmVhdGVDb21waWxlKHQ6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHR5cGVzID0gZ2V0VHlwZXNbdF07XG4gICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkodHlwZXNbMV0pO1xuICAgIHJldHVybiAoKSA9PiBGaWxlc0luRm9sZGVyKHR5cGVzLCAnJywgc3RhdGUpO1xufVxuXG4vKipcbiAqIHdoZW4gcGFnZSBjYWxsIG90aGVyIHBhZ2U7XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZUluRmlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sICB7IGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrIH06IHsgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aCwgYXJyYXlUeXBlWzFdKTtcbiAgICByZXR1cm4gYXdhaXQgY29tcGlsZUZpbGUocGF0aCwgYXJyYXlUeXBlLCB7aXNEZWJ1Zzp0cnVlLCBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVja30pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKSB7XG4gICAgYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUocGF0aCwgYXJyYXlUeXBlLCB7ZHluYW1pY0NoZWNrfSk7XG4gICAgQ2xlYXJXYXJuaW5nKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlQWxsKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MpIHtcbiAgICBsZXQgc3RhdGUgPSAhYXJndi5pbmNsdWRlcygncmVidWlsZCcpICYmIGF3YWl0IENvbXBpbGVTdGF0ZS5jaGVja0xvYWQoKVxuXG4gICAgaWYgKHN0YXRlKSByZXR1cm4gKCkgPT4gUmVxdWlyZVNjcmlwdHMoc3RhdGUuc2NyaXB0cylcbiAgICBwYWdlRGVwcy5jbGVhcigpO1xuXG4gICAgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcblxuICAgIHBlckNvbXBpbGUoKTtcblxuICAgIGNvbnN0IGFjdGl2YXRlQXJyYXkgPSBbYXdhaXQgQ3JlYXRlQ29tcGlsZShnZXRUeXBlcy5TdGF0aWNbMl0sIHN0YXRlKSwgYXdhaXQgQ3JlYXRlQ29tcGlsZShnZXRUeXBlcy5Mb2dzWzJdLCBzdGF0ZSksIENsZWFyV2FybmluZ107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWN0aXZhdGVBcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgaSgpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmV4cG9ydCgpXG4gICAgICAgIHBvc3RDb21waWxlKClcbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBnZXRTZXR0aW5nc0RhdGUgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG50eXBlIENTdGF0ZSA9IHtcbiAgICB1cGRhdGU6IG51bWJlclxuICAgIHBhZ2VBcnJheTogc3RyaW5nW11bXSxcbiAgICBpbXBvcnRBcnJheTogc3RyaW5nW11cbiAgICBmaWxlQXJyYXk6IHN0cmluZ1tdXG59XG5cbi8qIFRoaXMgY2xhc3MgaXMgdXNlZCB0byBzdG9yZSB0aGUgc3RhdGUgb2YgdGhlIHByb2plY3QgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVTdGF0ZSB7XG4gICAgcHJpdmF0ZSBzdGF0ZTogQ1N0YXRlID0geyB1cGRhdGU6IDAsIHBhZ2VBcnJheTogW10sIGltcG9ydEFycmF5OiBbXSwgZmlsZUFycmF5OiBbXSB9XG4gICAgc3RhdGljIGZpbGVQYXRoID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIFwiQ29tcGlsZVN0YXRlLmpzb25cIilcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGUgPSBnZXRTZXR0aW5nc0RhdGUoKVxuICAgIH1cblxuICAgIGdldCBzY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5pbXBvcnRBcnJheVxuICAgIH1cblxuICAgIGdldCBwYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUucGFnZUFycmF5XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5maWxlQXJyYXlcbiAgICB9XG5cbiAgICBhZGRQYWdlKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5wYWdlQXJyYXkuZmluZCh4ID0+IHhbMF0gPT0gcGF0aCAmJiB4WzFdID09IHR5cGUpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wYWdlQXJyYXkucHVzaChbcGF0aCwgdHlwZV0pXG4gICAgfVxuXG4gICAgYWRkSW1wb3J0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW1wb3J0QXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmltcG9ydEFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBhZGRGaWxlKHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZmlsZUFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWxlQXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKENvbXBpbGVTdGF0ZS5maWxlUGF0aCwgdGhpcy5zdGF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tMb2FkKCkge1xuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuZmlsZVBhdGgpKSByZXR1cm5cblxuICAgICAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuICAgICAgICBzdGF0ZS5zdGF0ZSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5maWxlUGF0aClcblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICE9IGdldFNldHRpbmdzRGF0ZSgpKSByZXR1cm5cblxuICAgICAgICByZXR1cm4gc3RhdGVcbiAgICB9XG59IiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEltcG9ydEZpbGUsIHtBZGRFeHRlbnNpb24sIFJlcXVpcmVPbmNlfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0UmVxdWlyZShhcnJheTogc3RyaW5nW10sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBhcnJheUZ1bmNTZXJ2ZXIgPSBbXTtcbiAgICBmb3IgKGxldCBpIG9mIGFycmF5KSB7XG4gICAgICAgIGkgPSBBZGRFeHRlbnNpb24oaSk7XG5cbiAgICAgICAgY29uc3QgYiA9IGF3YWl0IEltcG9ydEZpbGUoJ3Jvb3QgZm9sZGVyIChXV1cpJywgaSwgZ2V0VHlwZXMuU3RhdGljLCB7aXNEZWJ1Z30pO1xuICAgICAgICBpZiAoYiAmJiB0eXBlb2YgYi5TdGFydFNlcnZlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhcnJheUZ1bmNTZXJ2ZXIucHVzaChiLlN0YXJ0U2VydmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByaW50LmxvZyhgQ2FuJ3QgZmluZCBTdGFydFNlcnZlciBmdW5jdGlvbiBhdCBtb2R1bGUgLSAke2l9XFxuYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXlGdW5jU2VydmVyO1xufVxuXG5sZXQgbGFzdFNldHRpbmdzSW1wb3J0OiBudW1iZXI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0U2V0dGluZ3MoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbil7XG4gICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGggKyAnLnRzJykpe1xuICAgICAgICBmaWxlUGF0aCArPSAnLnRzJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCArPSAnLmpzJ1xuICAgIH1cbiAgICBjb25zdCBjaGFuZ2VUaW1lID0gPGFueT5hd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKVxuXG4gICAgaWYoY2hhbmdlVGltZSA9PSBsYXN0U2V0dGluZ3NJbXBvcnQgfHwgIWNoYW5nZVRpbWUpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIFxuICAgIGxhc3RTZXR0aW5nc0ltcG9ydCA9IGNoYW5nZVRpbWU7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IFJlcXVpcmVPbmNlKGZpbGVQYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gZGF0YS5kZWZhdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGluZ3NEYXRlKCl7XG4gICAgcmV0dXJuIGxhc3RTZXR0aW5nc0ltcG9ydFxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSB9IGZyb20gXCIuLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSBcIi4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzXCI7XG5pbXBvcnQgRWFzeUZzLCB7IERpcmVudCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCBDb21waWxlU3RhdGUgZnJvbSBcIi4vQ29tcGlsZVN0YXRlXCI7XG5pbXBvcnQgeyBpc0ZpbGVUeXBlIH0gZnJvbSBcIi4vRmlsZVR5cGVzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuYXN5bmMgZnVuY3Rpb24gRmlsZXNJbkZvbGRlcihhcnJheVR5cGU6IHN0cmluZ1tdLCBwYXRoOiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKGFycmF5VHlwZVswXSArIHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IHByb21pc2VzID1bXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChGaWxlc0luRm9sZGVyKGFycmF5VHlwZSwgY29ubmVjdCArICcvJywgc3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJheVR5cGUgPT0gZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzY2FuRmlsZXMoKXtcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuU3RhdGljLCAnJywgc3RhdGUpLFxuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLkxvZ3MsICcnLCBzdGF0ZSlcbiAgICBdKVxuICAgIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlYnVnU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKXtcbiAgICByZXR1cm4gY3JlYXRlU2l0ZU1hcChFeHBvcnQsIGF3YWl0IHNjYW5GaWxlcygpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHsgcm91dGluZywgZGV2ZWxvcG1lbnQgfSA9IEV4cG9ydDtcbiAgICBpZiAoIXJvdXRpbmcuc2l0ZW1hcCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2l0ZW1hcCA9IHJvdXRpbmcuc2l0ZW1hcCA9PT0gdHJ1ZSA/IHt9IDogcm91dGluZy5zaXRlbWFwO1xuICAgIE9iamVjdC5hc3NpZ24oc2l0ZW1hcCwge1xuICAgICAgICBydWxlczogdHJ1ZSxcbiAgICAgICAgdXJsU3RvcDogZmFsc2UsXG4gICAgICAgIGVycm9yUGFnZXM6IGZhbHNlLFxuICAgICAgICB2YWxpZFBhdGg6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhZ2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgdXJsczogLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgXG4gICAgZm9yIChsZXQgW3VybCwgdHlwZV0gb2Ygc3RhdGUucGFnZXMpIHtcblxuICAgICAgICBpZih0eXBlICE9IGdldFR5cGVzLlN0YXRpY1syXSB8fCAhdXJsLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdXJsID0gJy8nICsgdXJsLnN1YnN0cmluZygwLCB1cmwubGVuZ3RoIC0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZS5sZW5ndGggLSAxKTtcblxuICAgICAgICBpZihwYXRoLmV4dG5hbWUodXJsKSA9PSAnLnNlcnYnKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudXJsU3RvcCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcudXJsU3RvcCkge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBwYXRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaXRlbWFwLnJ1bGVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy5ydWxlcykge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhd2FpdCByb3V0aW5nLnJ1bGVzW3BhdGhdKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChlbmRzID0+IHVybC5lbmRzV2l0aCgnLicrZW5kcykpIHx8XG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoc3RhcnQgPT4gdXJsLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICApXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiByb3V0aW5nLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgICAgIGlmICghYXdhaXQgZnVuYyh1cmwpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSB1cmxzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzaXRlbWFwLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXJyb3IgaW4gcm91dGluZy5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9ICcvJyArIHJvdXRpbmcuZXJyb3JQYWdlc1tlcnJvcl0ucGF0aDtcblxuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSB1cmxzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYWdlcy5wdXNoKHVybCk7XG4gICAgfVxuXG4gICAgbGV0IHdyaXRlID0gdHJ1ZTtcbiAgICBpZiAoc2l0ZW1hcC5maWxlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVBY3Rpb24gPSBhd2FpdCBJbXBvcnRGaWxlKCdTaXRlbWFwIEltcG9ydCcsIHNpdGVtYXAuZmlsZSwgZ2V0VHlwZXMuU3RhdGljLCBkZXZlbG9wbWVudCk7XG4gICAgICAgIGlmKCFmaWxlQWN0aW9uPy5TaXRlbWFwKXtcbiAgICAgICAgICAgIGR1bXAud2FybignXFwnU2l0ZW1hcFxcJyBmdW5jdGlvbiBub3QgZm91bmQgb24gZmlsZSAtPiAnKyBzaXRlbWFwLmZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3JpdGUgPSBhd2FpdCBmaWxlQWN0aW9uLlNpdGVtYXAocGFnZXMsIHN0YXRlLCBFeHBvcnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYod3JpdGUgJiYgcGFnZXMubGVuZ3RoKXtcbiAgICAgICAgY29uc3QgcGF0aCA9IHdyaXRlID09PSB0cnVlID8gJ3NpdGVtYXAudHh0Jzogd3JpdGU7XG4gICAgICAgIHN0YXRlLmFkZEZpbGUocGF0aCk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZ2V0VHlwZXMuU3RhdGljWzBdICsgcGF0aCwgcGFnZXMuam9pbignXFxuJykpO1xuICAgIH1cbn0iLCAiLyoqXG4gKiBHaXZlbiBhIGZpbGUgbmFtZSBhbmQgYW4gZXh0ZW5zaW9uLCByZXR1cm4gdHJ1ZSBpZiB0aGUgZmlsZSBuYW1lIGVuZHMgd2l0aCB0aGUgZXh0ZW5zaW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGV4dG5hbWUgLSB0aGUgZXh0ZW5zaW9uIHRvIGNoZWNrIGZvci5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuc2lvbklzKG5hbWU6IHN0cmluZywgZXh0bmFtZTogc3RyaW5nKXtcbiAgICByZXR1cm4gbmFtZS5lbmRzV2l0aCgnLicgKyBleHRuYW1lKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZmlsZSBuYW1lIGVuZHMgd2l0aCBvbmUgb2YgdGhlIGdpdmVuIGZpbGUgdHlwZXMuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlcyAtIGFuIGFycmF5IG9mIGZpbGUgZXh0ZW5zaW9ucyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpbGVUeXBlKHR5cGVzOiBzdHJpbmdbXSwgbmFtZTogc3RyaW5nKSB7XG4gICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uSXMobmFtZSx0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGFzdCBkb3QgYW5kIGV2ZXJ5dGhpbmcgYWZ0ZXIgaXQgZnJvbSBhIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgdG8gcmVtb3ZlIHRoZSBlbmQgdHlwZSBmcm9tLlxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRob3V0IHRoZSBsYXN0IGNoYXJhY3Rlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJlbW92ZUVuZFR5cGUoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59IiwgImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBGaWxlcyB9IGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBSZW1vdmVFbmRUeXBlIH0gZnJvbSAnLi9GaWxlVHlwZXMnO1xuaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgRmFzdENvbXBpbGUgfSBmcm9tICcuL1NlYXJjaFBhZ2VzJztcblxuY29uc3QgRXhwb3J0ID0ge1xuICAgIFBhZ2VMb2FkUmFtOiB7fSxcbiAgICBQYWdlUmFtOiB0cnVlXG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2ZpbGVuYW1lIC0gVGhlIGZpbGVuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZGlybmFtZSAtIFRoZSBkaXJlY3Rvcnkgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgdHlwZUFycmF5IGlzIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aCB0byB0aGVcbiAqIGZpbGUuXG4gKiBAcGFyYW0gTGFzdFJlcXVpcmUgLSBBIGRpY3Rpb25hcnkgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2FueX0gRGF0YU9iamVjdCAtIFRoZSBkYXRhIG9iamVjdCB0aGF0IGlzIHBhc3NlZCB0byB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBwYWdlLlxuICovXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlUGFnZShmaWxlUGF0aDogc3RyaW5nLCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBMYXN0UmVxdWlyZTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRGF0YU9iamVjdDogYW55KSB7XG4gICAgY29uc3QgUmVxRmlsZVBhdGggPSBMYXN0UmVxdWlyZVtmaWxlUGF0aF07XG4gICAgY29uc3QgcmVzTW9kZWwgPSAoKSA9PiBSZXFGaWxlUGF0aC5tb2RlbChEYXRhT2JqZWN0KTtcblxuICAgIGxldCBmaWxlRXhpc3RzOiBib29sZWFuO1xuXG4gICAgaWYgKFJlcUZpbGVQYXRoKSB7XG4gICAgICAgIGlmICghRGF0YU9iamVjdC5pc0RlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG5cbiAgICAgICAgaWYgKFJlcUZpbGVQYXRoLmRhdGUgPT0gLTEpIHtcbiAgICAgICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShSZXFGaWxlUGF0aC5wYXRoKTtcblxuICAgICAgICAgICAgaWYgKCFmaWxlRXhpc3RzKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb3B5UGF0aCA9IGZpbGVQYXRoO1xuICAgIGxldCBleHRuYW1lID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKS5zdWJzdHJpbmcoMSk7XG5cbiAgICBpZiAoIWV4dG5hbWUpIHtcbiAgICAgICAgZXh0bmFtZSA9IEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgICAgIGZpbGVQYXRoICs9ICcuJyArIGV4dG5hbWU7XG4gICAgfVxuXG4gICAgbGV0IGZ1bGxQYXRoOiBzdHJpbmc7XG4gICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJylcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlUGF0aCk7XG4gICAgIGVsc2VcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoIVtCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnRdLmluY2x1ZGVzKGV4dG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICBEYXRhT2JqZWN0LndyaXRlKGltcG9ydFRleHQpO1xuICAgICAgICByZXR1cm4gaW1wb3J0VGV4dDtcbiAgICB9XG5cbiAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCk7XG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7Y29weVBhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtfX2ZpbGVuYW1lfSdgXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogKCkgPT4geyB9LCBkYXRlOiAtMSwgcGF0aDogZnVsbFBhdGggfTtcbiAgICAgICAgcmV0dXJuIExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBpblN0YXRpY1BhdGggPSAgcGF0aC5yZWxhdGl2ZSh0eXBlQXJyYXlbMF0sZnVsbFBhdGgpO1xuICAgIGNvbnN0IFNtYWxsUGF0aCA9IHR5cGVBcnJheVsyXSArICcvJyArIGluU3RhdGljUGF0aDtcbiAgICBjb25zdCByZUJ1aWxkID0gRGF0YU9iamVjdC5pc0RlYnVnICYmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodHlwZUFycmF5WzFdICsgJy8nICtpblN0YXRpY1BhdGggKyAnLmNqcycpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpKTtcblxuICAgIGlmIChyZUJ1aWxkKVxuICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZShpblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgZXh0bmFtZSAhPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKTtcblxuXG4gICAgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdICYmICFyZUJ1aWxkKSB7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdWzBdIH07XG4gICAgICAgIHJldHVybiBhd2FpdCBMYXN0UmVxdWlyZVtjb3B5UGF0aF0ubW9kZWwoRGF0YU9iamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnVuYyA9IGF3YWl0IExvYWRQYWdlKFNtYWxsUGF0aCwgRGF0YU9iamVjdC5pc0RlYnVnKTtcbiAgICBpZiAoRXhwb3J0LlBhZ2VSYW0pIHtcbiAgICAgICAgaWYgKCFFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSkge1xuICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXVswXSA9IGZ1bmM7XG4gICAgfVxuXG4gICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogZnVuYyB9O1xuICAgIHJldHVybiBhd2FpdCBmdW5jKERhdGFPYmplY3QpO1xufVxuXG5jb25zdCBHbG9iYWxWYXIgPSB7fTtcblxuZnVuY3Rpb24gZ2V0RnVsbFBhdGhDb21waWxlKHVybDogc3RyaW5nKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG4gICAgY29uc3QgdHlwZUFycmF5ID0gZ2V0VHlwZXNbU3BsaXRJbmZvWzBdXTtcbiAgICByZXR1cm4gdHlwZUFycmF5WzFdICsgU3BsaXRJbmZvWzFdICsgJy5janMnO1xufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMIG9mIHRoZSBwYWdlIHRvIGxvYWQuXG4gKiBAcGFyYW0gZXh0IC0gVGhlIGV4dGVuc2lvbiBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIGRhdGEgb2JqZWN0IGFuZCByZXR1cm5zIGEgc3RyaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZSh1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuXG4gICAgY29uc3QgdHlwZUFycmF5ID0gZ2V0VHlwZXNbU3BsaXRJbmZvWzBdXTtcbiAgICBjb25zdCBMYXN0UmVxdWlyZSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gX3JlcXVpcmUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVGaWxlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgRGF0YU9iamVjdC5pc0RlYnVnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5jbHVkZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZywgV2l0aE9iamVjdCA9IHt9KSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlUGFnZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIHsgLi4uV2l0aE9iamVjdCwgLi4uRGF0YU9iamVjdCB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfdHJhbnNmZXIocDogc3RyaW5nLCBwcmVzZXJ2ZUZvcm06IGJvb2xlYW4sIHdpdGhPYmplY3Q6IGFueSwgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55KSB7XG4gICAgICAgIERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCA9ICcnO1xuXG4gICAgICAgIGlmICghcHJlc2VydmVGb3JtKSB7XG4gICAgICAgICAgICBjb25zdCBwb3N0RGF0YSA9IERhdGFPYmplY3QuUmVxdWVzdC5ib2R5ID8ge30gOiBudWxsO1xuICAgICAgICAgICAgRGF0YU9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICAuLi5EYXRhT2JqZWN0LFxuICAgICAgICAgICAgICAgIFJlcXVlc3Q6IHsgLi4uRGF0YU9iamVjdC5SZXF1ZXN0LCBmaWxlczoge30sIHF1ZXJ5OiB7fSwgYm9keTogcG9zdERhdGEgfSxcbiAgICAgICAgICAgICAgICBQb3N0OiBwb3N0RGF0YSwgUXVlcnk6IHt9LCBGaWxlczoge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIERhdGFPYmplY3QsIHAsIHdpdGhPYmplY3QpO1xuXG4gICAgfVxuXG4gICAgY29uc3QgY29tcGlsZWRQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgU3BsaXRJbmZvWzFdICsgJy5janMnKTtcbiAgICBjb25zdCBwcml2YXRlX3ZhciA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoY29tcGlsZWRQYXRoKTtcblxuICAgICAgICByZXR1cm4gTXlNb2R1bGUoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxldCBlcnJvclRleHQ6IHN0cmluZztcblxuICAgICAgICBpZihpc0RlYnVnKXtcbiAgICAgICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgcGF0aCAtPiBcIiwgUmVtb3ZlRW5kVHlwZSh1cmwpLCBcIi0+XCIsIGUubWVzc2FnZSk7XG4gICAgICAgICAgICBwcmludC5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICAgIGVycm9yVGV4dCA9IEpTUGFyc2VyLnByaW50RXJyb3IoYEVycm9yIHBhdGg6ICR7dXJsfTxici8+RXJyb3IgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvclRleHQgPSBKU1BhcnNlci5wcmludEVycm9yKGBFcnJvciBjb2RlOiAke2UuY29kZX1gKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChEYXRhT2JqZWN0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIERhdGFPYmplY3QuUmVxdWVzdC5lcnJvciA9IGU7XG4gICAgICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gZXJyb3JUZXh0O1xuICAgICAgICB9XG5cbiAgICB9XG59XG4vKipcbiAqIEl0IHRha2VzIGEgZnVuY3Rpb24gdGhhdCBwcmVwYXJlIGEgcGFnZSwgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIGEgcGFnZVxuICogQHBhcmFtIExvYWRQYWdlRnVuYyAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBpbiBhIHBhZ2UgdG8gZXhlY3V0ZSBvblxuICogQHBhcmFtIHtzdHJpbmd9IHJ1bl9zY3JpcHRfbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY3JpcHQgdG8gcnVuLlxuICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5cbmZ1bmN0aW9uIEJ1aWxkUGFnZShMb2FkUGFnZUZ1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gdm9pZCwgcnVuX3NjcmlwdF9uYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBQYWdlVmFyID0ge307XG5cbiAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChSZXNwb25zZTogUmVzcG9uc2UsIFJlcXVlc3Q6IFJlcXVlc3QsIFBvc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCBudWxsLCBRdWVyeTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgQ29va2llczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgU2Vzc2lvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRmlsZXM6IEZpbGVzLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG91dF9ydW5fc2NyaXB0ID0geyB0ZXh0OiAnJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nSW5mbyhzdHI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgYXNTdHJpbmcgPSBzdHI/LnRvU3RyaW5nPy4oKTtcbiAgICAgICAgICAgIGlmIChhc1N0cmluZyA9PSBudWxsIHx8IGFzU3RyaW5nLnN0YXJ0c1dpdGgoJ1tvYmplY3QgT2JqZWN0XScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0ciwgbnVsbCwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSZXNwb25zZSh0ZXh0OiBhbnkpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0ID0gJycpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlU2FmZShzdHIgPSAnJykge1xuICAgICAgICAgICAgc3RyID0gVG9TdHJpbmdJbmZvKHN0cik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcmIycgKyBpLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlY2hvKGFycjogc3RyaW5nW10sIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFycltpXTtcbiAgICAgICAgICAgICAgICB3cml0ZVNhZmUocGFyYW1zW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnIuYXQoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZGlyZWN0UGF0aDogYW55ID0gZmFsc2U7XG5cbiAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QgPSAocGF0aDogc3RyaW5nLCBzdGF0dXM/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1cyhzdGF0dXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVzcG9uc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+UmVzcG9uc2UpLnJlbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0KFJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGaWxlKGZpbGVQYXRoLCBkZWxldGVBZnRlciA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSB7IGZpbGU6IGZpbGVQYXRoLCBkZWxldGVBZnRlciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRGF0YVNlbmQgPSB7XG4gICAgICAgICAgICBzZW5kRmlsZSxcbiAgICAgICAgICAgIHdyaXRlU2FmZSxcbiAgICAgICAgICAgIHdyaXRlLFxuICAgICAgICAgICAgZWNobyxcbiAgICAgICAgICAgIHNldFJlc3BvbnNlLFxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQsXG4gICAgICAgICAgICBydW5fc2NyaXB0X25hbWUsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBQb3N0LFxuICAgICAgICAgICAgUXVlcnksXG4gICAgICAgICAgICBTZXNzaW9uLFxuICAgICAgICAgICAgRmlsZXMsXG4gICAgICAgICAgICBDb29raWVzLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIFBhZ2VWYXIsXG4gICAgICAgICAgICBHbG9iYWxWYXIsXG4gICAgICAgICAgICBjb2RlYmFzZTogJydcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IExvYWRQYWdlRnVuYyhEYXRhU2VuZCk7XG5cbiAgICAgICAgcmV0dXJuIHsgb3V0X3J1bl9zY3JpcHQ6IG91dF9ydW5fc2NyaXB0LnRleHQsIHJlZGlyZWN0UGF0aCB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHsgTG9hZFBhZ2UsIEJ1aWxkUGFnZSwgZ2V0RnVsbFBhdGhDb21waWxlLCBFeHBvcnQsIFNwbGl0Rmlyc3QgfTtcbiIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBJbXBvcnRGaWxlLCBBZGRFeHRlbnNpb24gfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5cbnR5cGUgUmVxdWlyZUZpbGVzID0ge1xuICAgIHBhdGg6IHN0cmluZ1xuICAgIHN0YXR1cz86IG51bWJlclxuICAgIG1vZGVsOiBhbnlcbiAgICBkZXBlbmRlbmNpZXM/OiBTdHJpbmdBbnlNYXBcbiAgICBzdGF0aWM/OiBib29sZWFuXG59XG5cbmNvbnN0IENhY2hlUmVxdWlyZUZpbGVzID0ge307XG5cbi8qKlxuICogSXQgbWFrZXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IGRlcGVuZGVuY2llcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzIG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIGFycmF5IG9mIGJhc2UgcGF0aHNcbiAqIEBwYXJhbSBbYmFzZVBhdGhdIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBpcyBiZWluZyBjb21waWxlZC5cbiAqIEBwYXJhbSBjYWNoZSAtIEEgY2FjaGUgb2YgdGhlIGxhc3QgdGltZSBhIGZpbGUgd2FzIG1vZGlmaWVkLlxuICogQHJldHVybnMgQSBtYXAgb2YgZGVwZW5kZW5jaWVzLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlRGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llczogU3RyaW5nQW55TWFwLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBiYXNlUGF0aCA9ICcnLCBjYWNoZSA9IHt9KSB7XG4gICAgY29uc3QgZGVwZW5kZW5jaWVzTWFwOiBTdHJpbmdBbnlNYXAgPSB7fTtcbiAgICBjb25zdCBwcm9taXNlQWxsID0gW107XG4gICAgZm9yIChjb25zdCBbZmlsZVBhdGgsIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgIHByb21pc2VBbGwucHVzaCgoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhY2hlW2Jhc2VQYXRoXSlcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVbYmFzZVBhdGhdID0gYXdhaXQgRWFzeUZzLnN0YXQodHlwZUFycmF5WzBdICsgYmFzZVBhdGgsICdtdGltZU1zJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwWyd0aGlzRmlsZSddID0gY2FjaGVbYmFzZVBhdGhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbZmlsZVBhdGhdID0gYXdhaXQgbWFrZURlcGVuZGVuY2llcyg8YW55PnZhbHVlLCB0eXBlQXJyYXksIGZpbGVQYXRoLCBjYWNoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKSgpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlQWxsKTtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzTWFwO1xufVxuXG4vKipcbiAqIElmIHRoZSBvbGQgZGVwZW5kZW5jaWVzIGFuZCB0aGUgbmV3IGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jeSBtYXAuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLlxuICovXG5mdW5jdGlvbiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShvbGREZXBzW25hbWVdLCBuZXdEZXBzW25hbWVdKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gZGVwZW5kZW5jeSB0cmVlcywgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBuYW1lcyBvZiB0aGUgbW9kdWxlcyB0aGF0IGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0gW3BhcmVudF0gLSBUaGUgbmFtZSBvZiB0aGUgcGFyZW50IG1vZHVsZS5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncy4gRWFjaCBzdHJpbmcgcmVwcmVzZW50cyBhIGNoYW5nZSBpbiB0aGUgZGVwZW5kZW5jeVxuICogdHJlZS5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXAsIHBhcmVudCA9ICcnKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNoYW5nZUFycmF5ID0gW107XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFuZXdEZXBzW25hbWVdKSB7XG4gICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBnZXRDaGFuZ2VBcnJheShvbGREZXBzW25hbWVdLCBuZXdEZXBzW25hbWVdLCBuYW1lKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2goLi4uY2hhbmdlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFuZ2VBcnJheTtcbn1cblxuLyoqXG4gKiBJdCBpbXBvcnRzIGEgZmlsZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2ZpbGVuYW1lIC0gVGhlIGZpbGVuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZGlybmFtZSAtIFRoZSBkaXJlY3Rvcnkgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBwYXRocyB0eXBlcy5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgbWFwIG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhblxuICogQHJldHVybnMgVGhlIG1vZGVsIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IFJlcXVpcmVGaWxlcyB9LCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgUmVxRmlsZSA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcblxuICAgIGxldCBmaWxlRXhpc3RzOiBudW1iZXIsIG5ld0RlcHM6IFN0cmluZ0FueU1hcDtcbiAgICBpZiAoUmVxRmlsZSkge1xuXG4gICAgICAgIGlmICghaXNEZWJ1ZyB8fCBpc0RlYnVnICYmIChSZXFGaWxlLnN0YXR1cyA9PSAtMSkpXG4gICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcblxuICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLnN0YXQodHlwZUFycmF5WzBdICsgUmVxRmlsZS5wYXRoLCAnbXRpbWVNcycsIHRydWUsIDApO1xuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuXG4gICAgICAgICAgICBuZXdEZXBzID0gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhSZXFGaWxlLmRlcGVuZGVuY2llcywgdHlwZUFycmF5KTtcblxuICAgICAgICAgICAgaWYgKGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCBuZXdEZXBzKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcblxuICAgICAgICB9IGVsc2UgaWYgKFJlcUZpbGUuc3RhdHVzID09IDApXG4gICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3B5UGF0aCA9IGZpbGVQYXRoO1xuICAgIGxldCBzdGF0aWNfbW9kdWxlcyA9IGZhbHNlO1xuXG4gICAgaWYgKCFSZXFGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpXG4gICAgICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSwgX19kaXJuYW1lKSwgZmlsZVBhdGgpO1xuXG4gICAgICAgIGVsc2UgaWYgKGZpbGVQYXRoWzBdICE9ICcvJylcbiAgICAgICAgICAgIHN0YXRpY19tb2R1bGVzID0gdHJ1ZTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoID0gUmVxRmlsZS5wYXRoO1xuICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IFJlcUZpbGUuc3RhdGljO1xuICAgIH1cblxuICAgIGlmIChzdGF0aWNfbW9kdWxlcylcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgQWxpYXNPclBhY2thZ2UoY29weVBhdGgpLCBzdGF0dXM6IC0xLCBzdGF0aWM6IHRydWUsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGFkZCBzZXJ2LmpzIG9yIHNlcnYudHMgaWYgbmVlZGVkXG4gICAgICAgIGZpbGVQYXRoID0gQWRkRXh0ZW5zaW9uKGZpbGVQYXRoKTtcblxuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHR5cGVBcnJheVswXSArIGZpbGVQYXRoO1xuICAgICAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcblxuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgaGF2ZU1vZGVsID0gQ2FjaGVSZXF1aXJlRmlsZXNbZmlsZVBhdGhdO1xuICAgICAgICAgICAgaWYgKGhhdmVNb2RlbCAmJiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzID0gbmV3RGVwcyA/PyBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSkpKVxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IGhhdmVNb2RlbDtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0RlcHMgPSBuZXdEZXBzID8/IHt9O1xuXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgSW1wb3J0RmlsZShfX2ZpbGVuYW1lLCBmaWxlUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnLCBuZXdEZXBzLCBoYXZlTW9kZWwgJiYgZ2V0Q2hhbmdlQXJyYXkoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcykpLCBkZXBlbmRlbmNpZXM6IG5ld0RlcHMsIHBhdGg6IGZpbGVQYXRoIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IHt9LCBzdGF0dXM6IDAsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2ZpbGVQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWx0TW9kZWwgPSBMYXN0UmVxdWlyZVtjb3B5UGF0aF07XG4gICAgQ2FjaGVSZXF1aXJlRmlsZXNbYnVpbHRNb2RlbC5wYXRoXSA9IGJ1aWx0TW9kZWw7XG5cbiAgICByZXR1cm4gYnVpbHRNb2RlbC5tb2RlbDtcbn0iLCAiaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgdHJpbVR5cGUsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8vIC0tIHN0YXJ0IG9mIGZldGNoIGZpbGUgKyBjYWNoZSAtLVxuXG50eXBlIGFwaUluZm8gPSB7XG4gICAgcGF0aFNwbGl0OiBudW1iZXIsXG4gICAgZGVwc01hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfVxufVxuXG5jb25zdCBhcGlTdGF0aWNNYXA6IHsgW2tleTogc3RyaW5nXTogYXBpSW5mbyB9ID0ge307XG5cbi8qKlxuICogR2l2ZW4gYSB1cmwsIHJldHVybiB0aGUgc3RhdGljIHBhdGggYW5kIGRhdGEgaW5mbyBpZiB0aGUgdXJsIGlzIGluIHRoZSBzdGF0aWMgbWFwXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHRoZSB1c2VyIGlzIHJlcXVlc3RpbmcuXG4gKiBAcGFyYW0ge251bWJlcn0gcGF0aFNwbGl0IC0gdGhlIG51bWJlciBvZiBzbGFzaGVzIGluIHRoZSB1cmwuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICovXG5mdW5jdGlvbiBnZXRBcGlGcm9tTWFwKHVybDogc3RyaW5nLCBwYXRoU3BsaXQ6IG51bWJlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcGlTdGF0aWNNYXApO1xuICAgIGZvciAoY29uc3QgaSBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IGUgPSBhcGlTdGF0aWNNYXBbaV07XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSAmJiBlLnBhdGhTcGxpdCA9PSBwYXRoU3BsaXQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXRpY1BhdGg6IGksXG4gICAgICAgICAgICAgICAgZGF0YUluZm86IGVcbiAgICAgICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIEFQSSBmaWxlIGZvciBhIGdpdmVuIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIEFQSS5cbiAqIEByZXR1cm5zIFRoZSBwYXRoIHRvIHRoZSBBUEkgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZmluZEFwaVBhdGgodXJsOiBzdHJpbmcpIHtcblxuICAgIHdoaWxlICh1cmwubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UGF0aCA9IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMF0sIHVybCArICcuYXBpJyk7XG4gICAgICAgIGNvbnN0IG1ha2VQcm9taXNlID0gYXN5bmMgKHR5cGU6IHN0cmluZykgPT4gKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHN0YXJ0UGF0aCArICcuJyArIHR5cGUpICYmIHR5cGUpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVUeXBlID0gKGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCd0cycpLFxuICAgICAgICAgICAgbWFrZVByb21pc2UoJ2pzJylcbiAgICAgICAgXSkpLmZpbHRlcih4ID0+IHgpLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKGZpbGVUeXBlKVxuICAgICAgICAgICAgcmV0dXJuIHVybCArICcuYXBpLicgKyBmaWxlVHlwZTtcblxuICAgICAgICB1cmwgPSBDdXRUaGVMYXN0KCcvJywgdXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYXRoU3BsaXQgPSB1cmwuc3BsaXQoJy8nKS5sZW5ndGg7XG4gICAgbGV0IHsgc3RhdGljUGF0aCwgZGF0YUluZm8gfSA9IGdldEFwaUZyb21NYXAodXJsLCBwYXRoU3BsaXQpO1xuXG4gICAgaWYgKCFkYXRhSW5mbykge1xuICAgICAgICBzdGF0aWNQYXRoID0gYXdhaXQgZmluZEFwaVBhdGgodXJsKTtcblxuICAgICAgICBpZiAoc3RhdGljUGF0aCkge1xuICAgICAgICAgICAgZGF0YUluZm8gPSB7XG4gICAgICAgICAgICAgICAgcGF0aFNwbGl0LFxuICAgICAgICAgICAgICAgIGRlcHNNYXA6IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFwaVN0YXRpY01hcFtzdGF0aWNQYXRoXSA9IGRhdGFJbmZvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGFJbmZvKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBNYWtlQ2FsbChcbiAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVGaWxlKCcvJyArIHN0YXRpY1BhdGgsICdhcGktY2FsbCcsICcnLCBnZXRUeXBlcy5TdGF0aWMsIGRhdGFJbmZvLmRlcHNNYXAsIGlzRGVidWcpLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgdXJsLnN1YnN0cmluZyhzdGF0aWNQYXRoLmxlbmd0aCAtIDYpLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIG5leHRQcmFzZVxuICAgICAgICApO1xuICAgIH1cbn1cbi8vIC0tIGVuZCBvZiBmZXRjaCBmaWxlIC0tXG5jb25zdCBiYW5Xb3JkcyA9IFsndmFsaWRhdGVVUkwnLCAndmFsaWRhdGVGdW5jJywgJ2Z1bmMnLCAnZGVmaW5lJywgLi4uaHR0cC5NRVRIT0RTXTtcbi8qKlxuICogRmluZCB0aGUgQmVzdCBQYXRoXG4gKi9cbmZ1bmN0aW9uIGZpbmRCZXN0VXJsT2JqZWN0KG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcpIHtcbiAgICBsZXQgbWF4TGVuZ3RoID0gMCwgdXJsID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGkubGVuZ3RoO1xuICAgICAgICBpZiAobWF4TGVuZ3RoIDwgbGVuZ3RoICYmIHVybEZyb20uc3RhcnRzV2l0aChpKSAmJiAhYmFuV29yZHMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHVybCA9IGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFBhcnNlIEFuZCBWYWxpZGF0ZSBVUkxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VVUkxEYXRhKHZhbGlkYXRlOiBhbnksIHZhbHVlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGxldCBwdXNoRGF0YSA9IHZhbHVlLCByZXNEYXRhID0gdHJ1ZSwgZXJyb3I6IHN0cmluZztcblxuICAgIHN3aXRjaCAodmFsaWRhdGUpIHtcbiAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgIGNhc2UgcGFyc2VGbG9hdDpcbiAgICAgICAgY2FzZSBwYXJzZUludDpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gKDxhbnk+dmFsaWRhdGUpKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSAhaXNOYU4ocHVzaERhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gdmFsdWUgIT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSB2YWx1ZSA9PSAndHJ1ZScgfHwgdmFsdWUgPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhbnknOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxpZGF0ZSkpXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLmluY2x1ZGVzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFrZVZhbGlkID0gYXdhaXQgdmFsaWRhdGUodmFsdWUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ha2VWYWxpZCAmJiB0eXBlb2YgbWFrZVZhbGlkID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkLnZhbGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaERhdGEgPSBtYWtlVmFsaWQucGFyc2UgPz8gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZDtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yLCBmaWVsZCAtICcgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS50ZXN0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc0RhdGEpXG4gICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRlIGZpZWxkLCB2YWx1ZSBpcyBcIicgKyB2YWx1ZSArICdcIic7XG5cbiAgICByZXR1cm4gW2Vycm9yLCBwdXNoRGF0YV07XG59XG5cbi8qKlxuICogSXQgdGFrZXMgdGhlIFVSTCBkYXRhIGFuZCBwYXJzZXMgaXQgaW50byBhbiBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gb2JqIC0gdGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBVUkwgZGVmaW5pdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSBUaGUgVVJMIHRoYXQgd2FzIHBhc3NlZCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHthbnl9IGRlZmluZU9iamVjdCAtIEFsbCB0aGUgZGVmaW5pdGlvbnMgdGhhdCBoYXMgYmVlbiBmb3VuZFxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIG1ha2VNYXNzYWdlIC0gQ3JlYXRlIGFuIGVycm9yIG1lc3NhZ2VcbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIGFuIGVycm9yIHByb3BlcnR5LlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlRGVmaW5pdGlvbihvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBkZWZpbmVPYmplY3Q6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCBtYWtlTWFzc2FnZTogKGU6IGFueSkgPT4gc3RyaW5nKSB7XG4gICAgaWYgKCFvYmouZGVmaW5lKVxuICAgICAgICByZXR1cm4gdXJsRnJvbTtcblxuICAgIGNvbnN0IHZhbGlkYXRlRnVuYyA9IG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuICAgIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jID0gbnVsbDtcbiAgICBkZWxldGUgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2JqLmRlZmluZSkge1xuICAgICAgICBjb25zdCBbZGF0YVNsYXNoLCBuZXh0VXJsRnJvbV0gPSBTcGxpdEZpcnN0KCcvJywgdXJsRnJvbSk7XG4gICAgICAgIHVybEZyb20gPSBuZXh0VXJsRnJvbTtcblxuICAgICAgICBjb25zdCBbZXJyb3IsIG5ld0RhdGFdID0gYXdhaXQgcGFyc2VVUkxEYXRhKG9iai5kZWZpbmVbbmFtZV0sIGRhdGFTbGFzaCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICBpZihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB7ZXJyb3J9O1xuICAgICAgICBcbiAgICAgICAgZGVmaW5lT2JqZWN0W25hbWVdID0gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBpZiAodmFsaWRhdGVGdW5jKSB7XG4gICAgICAgIGxldCB2YWxpZGF0ZTogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSBhd2FpdCB2YWxpZGF0ZUZ1bmMoZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvcicgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJyA/IHZhbGlkYXRlOiAnRXJyb3IgdmFsaWRhdGluZyBVUkwnfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsRnJvbSB8fCAnJztcbn1cbi8qKlxuICogVGhlIGZ1bmN0aW9uIHdpbGwgcGFyc2UgdGhlIHVybCBhbmQgZmluZCB0aGUgYmVzdCBtYXRjaCBmb3IgdGhlIHVybFxuICogQHBhcmFtIHthbnl9IGZpbGVNb2R1bGUgLSB0aGUgbW9kdWxlIHRoYXQgY29udGFpbnMgdGhlIG1ldGhvZCB0aGF0IHlvdSB3YW50IHRvIGNhbGwuXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIHRoZSB1cmwgdGhhdCB0aGUgdXNlciByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuLFxuICogQHBhcmFtIG5leHRQcmFzZSAtICgpID0+IFByb21pc2U8YW55PlxuICogQHJldHVybnMgYSBib29sZWFuIHZhbHVlLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlLCB0aGUgcmVxdWVzdCBpcyBwcm9jZXNzZWQuIElmIHRoZSBmdW5jdGlvblxuICogcmV0dXJucyBmYWxzZSwgdGhlIHJlcXVlc3QgaXMgbm90IHByb2Nlc3NlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTWFrZUNhbGwoZmlsZU1vZHVsZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIHVybEZyb206IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGxvd0Vycm9ySW5mbyA9ICFHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikgJiYgaXNEZWJ1ZywgbWFrZU1hc3NhZ2UgPSAoZTogYW55KSA9PiAoaXNEZWJ1ZyA/IHByaW50LmVycm9yKGUpIDogbnVsbCkgKyAoYWxsb3dFcnJvckluZm8gPyBgLCBtZXNzYWdlOiAke2UubWVzc2FnZX1gIDogJycpO1xuICAgIGNvbnN0IG1ldGhvZCA9IFJlcXVlc3QubWV0aG9kO1xuICAgIGxldCBtZXRob2RPYmogPSBmaWxlTW9kdWxlW21ldGhvZF0gfHwgZmlsZU1vZHVsZS5kZWZhdWx0W21ldGhvZF07IC8vTG9hZGluZyB0aGUgbW9kdWxlIGJ5IG1ldGhvZFxuICAgIGxldCBoYXZlTWV0aG9kID0gdHJ1ZTtcblxuICAgIGlmKCFtZXRob2RPYmope1xuICAgICAgICBoYXZlTWV0aG9kID0gZmFsc2U7XG4gICAgICAgIG1ldGhvZE9iaiA9IGZpbGVNb2R1bGUuZGVmYXVsdCB8fCBmaWxlTW9kdWxlO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2VNZXRob2QgPSBtZXRob2RPYmo7XG5cbiAgICBjb25zdCBkZWZpbmVPYmplY3QgPSB7fTtcblxuICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTsgLy8gcm9vdCBsZXZlbCBkZWZpbml0aW9uXG4gICAgaWYoKDxhbnk+ZGF0YURlZmluZSkuZXJyb3IpIHJldHVybiBSZXNwb25zZS5qc29uKGRhdGFEZWZpbmUpO1xuICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG5cbiAgICBsZXQgbmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKTtcblxuICAgIC8vcGFyc2UgdGhlIHVybCBwYXRoXG4gICAgZm9yKGxldCBpID0gMDsgaTwgMjsgaSsrKXtcbiAgICAgICAgd2hpbGUgKChuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pKSkge1xuICAgICAgICAgICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuICAgICAgICAgICAgaWYoKDxhbnk+ZGF0YURlZmluZSkuZXJyb3IpIHJldHVybiBSZXNwb25zZS5qc29uKGRhdGFEZWZpbmUpO1xuICAgICAgICAgICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcbiAgICBcbiAgICAgICAgICAgIHVybEZyb20gPSB0cmltVHlwZSgnLycsIHVybEZyb20uc3Vic3RyaW5nKG5lc3RlZFVSTC5sZW5ndGgpKTtcbiAgICAgICAgICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9ialtuZXN0ZWRVUkxdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWhhdmVNZXRob2QpeyAvLyBjaGVjayBpZiB0aGF0IGEgbWV0aG9kXG4gICAgICAgICAgICBoYXZlTWV0aG9kID0gdHJ1ZTtcbiAgICAgICAgICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqPy5mdW5jICYmIG1ldGhvZE9iaiB8fCBiYXNlTWV0aG9kOyAvLyBpZiB0aGVyZSBpcyBhbiAnYW55JyBtZXRob2RcblxuXG4gICAgaWYgKCFtZXRob2RPYmo/LmZ1bmMpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGxlZnREYXRhID0gdXJsRnJvbS5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHVybERhdGEgPSBbXTtcblxuXG4gICAgbGV0IGVycm9yOiBzdHJpbmc7XG4gICAgaWYgKG1ldGhvZE9iai52YWxpZGF0ZVVSTCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgdmFsaWRhdGVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGhvZE9iai52YWxpZGF0ZVVSTCkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtlcnJvclVSTCwgcHVzaERhdGFdID0gYXdhaXQgcGFyc2VVUkxEYXRhKHZhbGlkYXRlLCBsZWZ0RGF0YVtpbmRleF0sIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvclVSTCkge1xuICAgICAgICAgICAgICAgIGVycm9yID0gPHN0cmluZz5lcnJvclVSTDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXJsRGF0YS5wdXNoKHB1c2hEYXRhKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZVxuICAgICAgICB1cmxEYXRhLnB1c2goLi4ubGVmdERhdGEpO1xuXG4gICAgaWYgKCFlcnJvciAmJiBtZXRob2RPYmoudmFsaWRhdGVGdW5jKSB7XG4gICAgICAgIGxldCB2YWxpZGF0ZTogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSBhd2FpdCBtZXRob2RPYmoudmFsaWRhdGVGdW5jKGxlZnREYXRhLCBSZXF1ZXN0LCBSZXNwb25zZSwgdXJsRGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvcicgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBlcnJvciA9IHZhbGlkYXRlO1xuICAgICAgICBlbHNlIGlmICghdmFsaWRhdGUpXG4gICAgICAgICAgICBlcnJvciA9ICdFcnJvciB2YWxpZGF0aW5nIFVSTCc7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yIH0pO1xuXG4gICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgbGV0IGFwaVJlc3BvbnNlOiBhbnksIG5ld1Jlc3BvbnNlOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgYXBpUmVzcG9uc2UgPSBhd2FpdCBtZXRob2RPYmouZnVuYyhSZXF1ZXN0LCBSZXNwb25zZSwgdXJsRGF0YSwgZGVmaW5lT2JqZWN0LCBsZWZ0RGF0YSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoYWxsb3dFcnJvckluZm8pXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6IGUubWVzc2FnZSB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogJzUwMCAtIEludGVybmFsIFNlcnZlciBFcnJvcicgfTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFwaVJlc3BvbnNlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IHRleHQ6IGFwaVJlc3BvbnNlIH07XG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IGFwaVJlc3BvbnNlIHx8IG5ld1Jlc3BvbnNlO1xuXG4gICAgZmluYWxTdGVwKCk7ICAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICBpZiAobmV3UmVzcG9uc2UgIT0gbnVsbClcbiAgICAgICAgUmVzcG9uc2UuanNvbihuZXdSZXNwb25zZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIGFzIEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBHZXRGaWxlIGFzIEdldFN0YXRpY0ZpbGUsIHNlcnZlckJ1aWxkIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCAqIGFzIEZ1bmNTY3JpcHQgZnJvbSAnLi9GdW5jdGlvblNjcmlwdCc7XG5pbXBvcnQgTWFrZUFwaUNhbGwgZnJvbSAnLi9BcGlDYWxsJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuY29uc3QgeyBFeHBvcnQgfSA9IEZ1bmNTY3JpcHQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JQYWdlcyB7XG4gICAgbm90Rm91bmQ/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH0sXG4gICAgc2VydmVyRXJyb3I/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH1cbn1cblxuaW50ZXJmYWNlIEdldFBhZ2VzU2V0dGluZ3Mge1xuICAgIENhY2hlRGF5czogbnVtYmVyLFxuICAgIERldk1vZGU6IGJvb2xlYW4sXG4gICAgQ29va2llU2V0dGluZ3M/OiBhbnksXG4gICAgQ29va2llcz86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIENvb2tpZUVuY3J5cHRlcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIFNlc3Npb25TdG9yZT86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIEVycm9yUGFnZXM6IEVycm9yUGFnZXNcbn1cblxuY29uc3QgU2V0dGluZ3M6IEdldFBhZ2VzU2V0dGluZ3MgPSB7XG4gICAgQ2FjaGVEYXlzOiAxLFxuICAgIERldk1vZGU6IHRydWUsXG4gICAgRXJyb3JQYWdlczoge31cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2VUb1JhbSh1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdW5jU2NyaXB0LmdldEZ1bGxQYXRoQ29tcGlsZSh1cmwpKSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXSA9IFtdO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSA9IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2UodXJsLCBpc0RlYnVnKTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSwgdXJsKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRBbGxQYWdlc1RvUmFtKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gcGFnZURlcHMuc3RvcmUpIHtcbiAgICAgICAgaWYgKCFFeHRlbnNpb25JbkFycmF5KGksIDxhbnk+QmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSkpXG4gICAgICAgICAgICBhd2FpdCBMb2FkUGFnZVRvUmFtKGksIGlzRGVidWcpO1xuXG4gICAgfVxufVxuXG5mdW5jdGlvbiBDbGVhckFsbFBhZ2VzRnJvbVJhbSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gRXhwb3J0LlBhZ2VMb2FkUmFtKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGVsZXRlIEV4cG9ydC5QYWdlTG9hZFJhbVtpXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIEV4dGVuc2lvbkluQXJyYXkoZmlsZVBhdGg6IHN0cmluZywgLi4uYXJyYXlzOiBzdHJpbmdbXSkge1xuICAgIGZpbGVQYXRoID0gZmlsZVBhdGgudG9Mb3dlckNhc2UoKTtcbiAgICBmb3IgKGNvbnN0IGFycmF5IG9mIGFycmF5cykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aC5zdWJzdHJpbmcoZmlsZVBhdGgubGVuZ3RoIC0gaS5sZW5ndGggLSAxKSA9PSAnLicgKyBpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBHZXRFcnJvclBhZ2UoY29kZTogbnVtYmVyLCBMb2NTZXR0aW5nczogJ25vdEZvdW5kJyB8ICdzZXJ2ZXJFcnJvcicpIHtcbiAgICBsZXQgYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmc7XG4gICAgaWYgKFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdKSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYztcbiAgICAgICAgdXJsID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10ucGF0aDtcbiAgICAgICAgY29kZSA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLmNvZGUgPz8gY29kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5Mb2dzO1xuICAgICAgICB1cmwgPSAnZScgKyBjb2RlO1xuICAgIH1cbiAgICByZXR1cm4geyB1cmwsIGFycmF5VHlwZSwgY29kZSB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlQmFzaWNJbmZvKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSwgY29kZTogbnVtYmVyKSB7XG4gICAgLy9maXJzdCBzdGVwIC0gcGFyc2UgaW5mb1xuICAgIGlmIChSZXF1ZXN0Lm1ldGhvZCA9PSBcIlBPU1RcIikge1xuICAgICAgICBpZiAoIVJlcXVlc3QuYm9keSB8fCAhT2JqZWN0LmtleXMoUmVxdWVzdC5ib2R5KS5sZW5ndGgpXG4gICAgICAgICAgICBSZXF1ZXN0LmJvZHkgPSBSZXF1ZXN0LmZpZWxkcyB8fCB7fTtcblxuICAgIH0gZWxzZVxuICAgICAgICBSZXF1ZXN0LmJvZHkgPSBmYWxzZTtcblxuXG4gICAgaWYgKFJlcXVlc3QuY2xvc2VkKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuQ29va2llcyhSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5TZXNzaW9uU3RvcmUoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcblxuICAgIFJlcXVlc3Quc2lnbmVkQ29va2llcyA9IFJlcXVlc3Quc2lnbmVkQ29va2llcyB8fCB7fTtcbiAgICBSZXF1ZXN0LmZpbGVzID0gUmVxdWVzdC5maWxlcyB8fCB7fTtcblxuICAgIGNvbnN0IENvcHlDb29raWVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXMpKTtcblxuICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDE7XG5cbiAgICAvL3NlY29uZCBzdGVwXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMSlcbiAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSBjb2RlO1xuXG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3Quc2lnbmVkQ29va2llcykgey8vdXBkYXRlIGNvb2tpZXNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9ICdvYmplY3QnICYmIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSBDb3B5Q29va2llc1tpXSB8fCBKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0pICE9IEpTT04uc3RyaW5naWZ5KENvcHlDb29raWVzW2ldKSlcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jb29raWUoaSwgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldLCBTZXR0aW5ncy5Db29raWVTZXR0aW5ncyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBDb3B5Q29va2llcykgey8vZGVsZXRlIG5vdCBleGl0cyBjb29raWVzXG4gICAgICAgICAgICBpZiAoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY2xlYXJDb29raWUoaSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9mb3IgZmluYWwgc3RlcFxuZnVuY3Rpb24gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnkpIHtcbiAgICBpZiAoIVJlcXVlc3QuZmlsZXMpIC8vZGVsZXRlIGZpbGVzXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgY29uc3QgYXJyUGF0aCA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5maWxlcykge1xuXG4gICAgICAgIGNvbnN0IGUgPSBSZXF1ZXN0LmZpbGVzW2ldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIGluIGUpIHtcbiAgICAgICAgICAgICAgICBhcnJQYXRoLnB1c2goZVthXS5maWxlcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGUuZmlsZXBhdGgpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGFyclBhdGg7XG59XG5cbi8vZmluYWwgc3RlcFxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUmVxdWVzdEZpbGVzKGFycmF5OiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgZSBpbiBhcnJheSlcbiAgICAgICAgYXdhaXQgRWFzeUZzLnVubGlua0lmRXhpc3RzKGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgaWYgKGNvZGUgPT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IGZ1bGxQYWdlVXJsID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgdXJsO1xuICAgICAgICAvL2NoZWNrIHRoYXQgaXMgbm90IHNlcnZlciBmaWxlXG4gICAgICAgIGlmIChhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBTZXR0aW5ncy5EZXZNb2RlLCB1cmwpIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIHJldHVybiBmdWxsUGFnZVVybDtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZpcnN0RnVuYz86IGFueSkge1xuICAgIGNvbnN0IHBhZ2VBcnJheSA9IFtmaXJzdEZ1bmMgPz8gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZShzbWFsbFBhdGgsIFNldHRpbmdzLkRldk1vZGUpXTtcblxuICAgIHBhZ2VBcnJheVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKHBhZ2VBcnJheVswXSwgc21hbGxQYXRoKTtcblxuICAgIGlmIChFeHBvcnQuUGFnZVJhbSlcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0gPSBwYWdlQXJyYXk7XG5cbiAgICByZXR1cm4gcGFnZUFycmF5WzFdO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBsb2FkIHRoZSBkeW5hbWljIHBhZ2VcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIFRoZSBhcnJheSBvZiB0eXBlcyB0aGF0IHRoZSBwYWdlIGlzLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZ1bGxQYWdlVXJsIC0gVGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzbWFsbFBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZSBmaWxlLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBUaGUgc3RhdHVzIGNvZGUgb2YgdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBUaGUgRHluYW1pY0Z1bmMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgdG8gZ2VuZXJhdGUgdGhlIHBhZ2UuXG4gKiBUaGUgY29kZSBpcyB0aGUgc3RhdHVzIGNvZGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICogVGhlIGZ1bGxQYWdlVXJsIGlzIHRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldER5bmFtaWNQYWdlKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBjb25zdCBpblN0YXRpYyA9IHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgY29uc3Qgc21hbGxQYXRoID0gYXJyYXlUeXBlWzJdICsgJy8nICsgaW5TdGF0aWM7XG4gICAgbGV0IGZ1bGxQYWdlVXJsID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGg7XG5cbiAgICBsZXQgRHluYW1pY0Z1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gYW55O1xuICAgIGlmIChTZXR0aW5ncy5EZXZNb2RlICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSkge1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoYXJyYXlUeXBlWzFdICsgaW5TdGF0aWMgKyAnLmNqcycpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShzbWFsbFBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZSh1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBhcnJheVR5cGUpO1xuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzFdKVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoLCBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzBdKTtcblxuICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlsxXSlcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuICAgIGVsc2UgaWYgKCFFeHBvcnQuUGFnZVJhbSAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgsIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMF0pO1xuXG4gICAgZWxzZSBpZiAoYXJyYXlUeXBlICE9IGdldFR5cGVzLkxvZ3MpIHtcbiAgICAgICAgY29uc3QgeyBhcnJheVR5cGUsIGNvZGUsIHVybCB9ID0gR2V0RXJyb3JQYWdlKDQwNCwgJ25vdEZvdW5kJyk7XG4gICAgICAgIHJldHVybiBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgY29kZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBmdWxsUGFnZVVybCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgRHluYW1pY0Z1bmMsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGZ1bGxQYWdlVXJsXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBNYWtlUGFnZVJlc3BvbnNlKER5bmFtaWNSZXNwb25zZTogYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aD8uZmlsZSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gUmVzcG9uc2Uub24oJ2ZpbmlzaCcsIHJlcykpO1xuICAgIH0gZWxzZSBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCkge1xuICAgICAgICBSZXNwb25zZS53cml0ZUhlYWQoMzAyLCB7IExvY2F0aW9uOiBEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoIH0pO1xuICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBSZXNQYWdlID0gRHluYW1pY1Jlc3BvbnNlLm91dF9ydW5fc2NyaXB0LnRyaW0oKTtcbiAgICAgICAgaWYgKFJlc1BhZ2UpIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnNlbmQoUmVzUGFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmRlbGV0ZUFmdGVyKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHJlcXVlc3QgaXMgbWFkZSB0byBhIHBhZ2UuIFxuICogSXQgd2lsbCBjaGVjayBpZiB0aGUgcGFnZSBleGlzdHMsIGFuZCBpZiBpdCBkb2VzLCBpdCB3aWxsIHJldHVybiB0aGUgcGFnZS4gXG4gKiBJZiBpdCBkb2VzIG5vdCBleGlzdCwgaXQgd2lsbCByZXR1cm4gYSA0MDQgcGFnZVxuICogQHBhcmFtIHtSZXF1ZXN0IHwgYW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoc1xuICogbG9hZGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIHBhZ2UgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHt7IGZpbGU6IGJvb2xlYW4sIGZ1bGxQYWdlVXJsOiBzdHJpbmcgfX0gRmlsZUluZm8gLSB0aGUgZmlsZSBpbmZvIG9mIHRoZSBwYWdlIHRoYXQgaXMgYmVpbmcgYWN0aXZhdGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBudW1iZXJcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGFmdGVyIHRoZSBkeW5hbWljIHBhZ2VcbiAqIGlzIGxvYWRlZC5cbiAqIEByZXR1cm5zIE5vdGhpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEFjdGl2YXRlUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBjb2RlOiBudW1iZXIsIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgeyBEeW5hbWljRnVuYywgZnVsbFBhZ2VVcmwsIGNvZGU6IG5ld0NvZGUgfSA9IGF3YWl0IEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBjb2RlKTtcblxuICAgIGlmICghZnVsbFBhZ2VVcmwgfHwgIUR5bmFtaWNGdW5jICYmIGNvZGUgPT0gNTAwKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2Uuc2VuZFN0YXR1cyhuZXdDb2RlKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cbiAgICAgICAgY29uc3QgcGFnZURhdGEgPSBhd2FpdCBEeW5hbWljRnVuYyhSZXNwb25zZSwgUmVxdWVzdCwgUmVxdWVzdC5ib2R5LCBSZXF1ZXN0LnF1ZXJ5LCBSZXF1ZXN0LmNvb2tpZXMsIFJlcXVlc3Quc2Vzc2lvbiwgUmVxdWVzdC5maWxlcywgU2V0dGluZ3MuRGV2TW9kZSk7XG4gICAgICAgIGZpbmFsU3RlcCgpOyAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICAgICAgYXdhaXQgTWFrZVBhZ2VSZXNwb25zZShcbiAgICAgICAgICAgIHBhZ2VEYXRhLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIHByaW50LmVycm9yKGUpO1xuICAgICAgICBSZXF1ZXN0LmVycm9yID0gZTtcblxuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBHZXRFcnJvclBhZ2UoNTAwLCAnc2VydmVyRXJyb3InKTtcblxuICAgICAgICBEeW5hbWljUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIER5bmFtaWNQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYywgY29kZSA9IDIwMCkge1xuICAgIGNvbnN0IEZpbGVJbmZvID0gYXdhaXQgaXNVUkxQYXRoQUZpbGUoUmVxdWVzdCwgdXJsLCBjb2RlKTtcblxuICAgIGNvbnN0IG1ha2VEZWxldGVBcnJheSA9IG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0KVxuXG4gICAgaWYgKEZpbGVJbmZvKSB7XG4gICAgICAgIFNldHRpbmdzLkNhY2hlRGF5cyAmJiBSZXNwb25zZS5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT1cIiArIChTZXR0aW5ncy5DYWNoZURheXMgKiAyNCAqIDYwICogNjApKTtcbiAgICAgICAgYXdhaXQgR2V0U3RhdGljRmlsZSh1cmwsIFNldHRpbmdzLkRldk1vZGUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0UHJhc2UgPSAoKSA9PiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0LCBSZXNwb25zZSwgY29kZSk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgY29uc3QgaXNBcGkgPSBhd2FpdCBNYWtlQXBpQ2FsbChSZXF1ZXN0LCBSZXNwb25zZSwgdXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBuZXh0UHJhc2UpO1xuICAgIGlmICghaXNBcGkgJiYgIWF3YWl0IEFjdGl2YXRlUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgYXJyYXlUeXBlLCB1cmwsIGNvZGUsIG5leHRQcmFzZSkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpOyAvLyBkZWxldGUgZmlsZXNcbn1cblxuZnVuY3Rpb24gdXJsRml4KHVybDogc3RyaW5nKSB7XG4gICAgaWYgKHVybCA9PSAnLycpIHtcbiAgICAgICAgdXJsID0gJy9pbmRleCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh1cmwpO1xufVxuXG5leHBvcnQge1xuICAgIFNldHRpbmdzLFxuICAgIER5bmFtaWNQYWdlLFxuICAgIExvYWRBbGxQYWdlc1RvUmFtLFxuICAgIENsZWFyQWxsUGFnZXNGcm9tUmFtLFxuICAgIHVybEZpeCxcbiAgICBHZXRFcnJvclBhZ2Vcbn0iLCAiaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgKiBhcyBCdWlsZFNlcnZlciBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgY29va2llUGFyc2VyIH0gZnJvbSAnQHRpbnlodHRwL2Nvb2tpZS1wYXJzZXInO1xuaW1wb3J0IGNvb2tpZUVuY3J5cHRlciBmcm9tICdjb29raWUtZW5jcnlwdGVyJztcbmltcG9ydCB7IGFsbG93UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBzZXNzaW9uIGZyb20gJ2V4cHJlc3Mtc2Vzc2lvbic7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBJbnNlcnRNb2RlbHNTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgeyBTdGFydFJlcXVpcmUsIEdldFNldHRpbmdzIH0gZnJvbSAnLi9JbXBvcnRNb2R1bGUnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgY3JlYXRlTmV3UHJpbnRTZXR0aW5ncyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBNZW1vcnlTZXNzaW9uIGZyb20gJ21lbW9yeXN0b3JlJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGRlYnVnU2l0ZU1hcCB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TaXRlTWFwJztcbmltcG9ydCB7IHNldHRpbmdzIGFzIGRlZmluZVNldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQge0V4cG9ydCBhcyBFeHBvcnRSYW19IGZyb20gJy4uL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdCdcblxuY29uc3RcbiAgICBDb29raWVzU2VjcmV0ID0gdXVpZHY0KCkuc3Vic3RyaW5nKDAsIDMyKSxcbiAgICBTZXNzaW9uU2VjcmV0ID0gdXVpZHY0KCksXG4gICAgTWVtb3J5U3RvcmUgPSBNZW1vcnlTZXNzaW9uKHNlc3Npb24pLFxuXG4gICAgQ29va2llc01pZGRsZXdhcmUgPSBjb29raWVQYXJzZXIoQ29va2llc1NlY3JldCksXG4gICAgQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZSA9IGNvb2tpZUVuY3J5cHRlcihDb29raWVzU2VjcmV0LCB7fSksXG4gICAgQ29va2llU2V0dGluZ3MgPSB7IGh0dHBPbmx5OiB0cnVlLCBzaWduZWQ6IHRydWUsIG1heEFnZTogODY0MDAwMDAgKiAzMCB9O1xuXG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llcyA9IDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyID0gPGFueT5Db29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZVNldHRpbmdzID0gQ29va2llU2V0dGluZ3M7XG5cbmxldCBEZXZNb2RlXyA9IHRydWUsIGNvbXBpbGF0aW9uU2NhbjogUHJvbWlzZTwoKSA9PiBQcm9taXNlPHZvaWQ+PiwgU2Vzc2lvblN0b3JlO1xuXG5sZXQgZm9ybWlkYWJsZVNlcnZlciwgYm9keVBhcnNlclNlcnZlcjtcblxuY29uc3Qgc2VydmVMaW1pdHMgPSB7XG4gICAgc2Vzc2lvblRvdGFsUmFtTUI6IDE1MCxcbiAgICBzZXNzaW9uVGltZU1pbnV0ZXM6IDQwLFxuICAgIHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM6IDMwLFxuICAgIGZpbGVMaW1pdE1COiAxMCxcbiAgICByZXF1ZXN0TGltaXRNQjogNFxufVxuXG5sZXQgcGFnZUluUmFtQWN0aXZhdGU6ICgpID0+IFByb21pc2U8dm9pZD47XG5leHBvcnQgZnVuY3Rpb24gcGFnZUluUmFtQWN0aXZhdGVGdW5jKCl7XG4gICAgcmV0dXJuIHBhZ2VJblJhbUFjdGl2YXRlO1xufVxuXG5jb25zdCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzID0gWy4uLkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXldO1xuY29uc3QgYmFzZVZhbGlkUGF0aCA9IFsocGF0aDogc3RyaW5nKSA9PiBwYXRoLnNwbGl0KCcuJykuYXQoLTIpICE9ICdzZXJ2J107IC8vIGlnbm9yaW5nIGZpbGVzIHRoYXQgZW5kcyB3aXRoIC5zZXJ2LipcblxuZXhwb3J0IGNvbnN0IEV4cG9ydDogRXhwb3J0U2V0dGluZ3MgPSB7XG4gICAgZ2V0IHNldHRpbmdzUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyBcIi9TZXR0aW5nc1wiO1xuICAgIH0sXG4gICAgc2V0IGRldmVsb3BtZW50KHZhbHVlKSB7XG4gICAgICAgIGlmKERldk1vZGVfID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgRGV2TW9kZV8gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgY29tcGlsYXRpb25TY2FuID0gQnVpbGRTZXJ2ZXIuY29tcGlsZUFsbChFeHBvcnQpO1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBcInByb2R1Y3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRGV2TW9kZSA9IHZhbHVlO1xuICAgICAgICBhbGxvd1ByaW50KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldCBkZXZlbG9wbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIERldk1vZGVfO1xuICAgIH0sXG4gICAgbWlkZGxld2FyZToge1xuICAgICAgICBnZXQgY29va2llcygpOiAocmVxOiBSZXF1ZXN0LCBfcmVzOiBSZXNwb25zZTxhbnk+LCBuZXh0PzogTmV4dEZ1bmN0aW9uKSA9PiB2b2lkIHtcbiAgICAgICAgICAgIHJldHVybiA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llRW5jcnlwdGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TdG9yZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZvcm1pZGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWlkYWJsZVNlcnZlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGJvZHlQYXJzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keVBhcnNlclNlcnZlcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VjcmV0OiB7XG4gICAgICAgIGdldCBjb29raWVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXNTZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBnZW5lcmFsOiB7XG4gICAgICAgIGltcG9ydE9uTG9hZDogW10sXG4gICAgICAgIHNldCBwYWdlSW5SYW0odmFsdWUpIHtcbiAgICAgICAgICAgIEV4cG9ydFJhbS5QYWdlUmFtID0gdmFsdWU7XG4gICAgICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVwYXJhdGlvbnMgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgICAgICAgICAgICAgYXdhaXQgcHJlcGFyYXRpb25zPy4oKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZUJ5VXJsLkxvYWRBbGxQYWdlc1RvUmFtKEV4cG9ydC5kZXZlbG9wbWVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZUJ5VXJsLkNsZWFyQWxsUGFnZXNGcm9tUmFtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXQgcGFnZUluUmFtKCkge1xuICAgICAgICAgICAgcmV0dXJuIEV4cG9ydFJhbS5QYWdlUmFtO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21waWxlOiB7XG4gICAgICAgIHNldCBjb21waWxlU3ludGF4KHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4ID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb21waWxlU3ludGF4KCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBpZ25vcmVFcnJvcih2YWx1ZSkge1xuICAgICAgICAgICAgKDxhbnk+Y3JlYXRlTmV3UHJpbnRTZXR0aW5ncykuUHJldmVudEVycm9ycyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgaWdub3JlRXJyb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+Y3JlYXRlTmV3UHJpbnRTZXR0aW5ncykuUHJldmVudEVycm9ycztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHBsdWdpbnModmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwbHVnaW5zKCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBkZWZpbmUoKXtcbiAgICAgICAgICAgIHJldHVybiBkZWZpbmVTZXR0aW5ncy5kZWZpbmVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGRlZmluZSh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lU2V0dGluZ3MuZGVmaW5lID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmc6IHtcbiAgICAgICAgcnVsZXM6IHt9LFxuICAgICAgICB1cmxTdG9wOiBbXSxcbiAgICAgICAgdmFsaWRQYXRoOiBiYXNlVmFsaWRQYXRoLFxuICAgICAgICBpZ25vcmVUeXBlczogYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyxcbiAgICAgICAgaWdub3JlUGF0aHM6IFtdLFxuICAgICAgICBzaXRlbWFwOiB0cnVlLFxuICAgICAgICBnZXQgZXJyb3JQYWdlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGVycm9yUGFnZXModmFsdWUpIHtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlTGltaXRzOiB7XG4gICAgICAgIGdldCBjYWNoZURheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY2FjaGVEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZXNFeHBpcmVzRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZVNldHRpbmdzLm1heEFnZSAvIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY29va2llc0V4cGlyZXNEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIENvb2tpZVNldHRpbmdzLm1heEFnZSA9IHZhbHVlICogODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVG90YWxSYW1NQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVG90YWxSYW1NQigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRpbWVNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVGltZU1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBmaWxlTGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZpbGVMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcmVxdWVzdExpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgICAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHJlcXVlc3RMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZToge1xuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBodHRwMjogZmFsc2UsXG4gICAgICAgIGdyZWVuTG9jazoge1xuICAgICAgICAgICAgc3RhZ2luZzogbnVsbCxcbiAgICAgICAgICAgIGNsdXN0ZXI6IG51bGwsXG4gICAgICAgICAgICBlbWFpbDogbnVsbCxcbiAgICAgICAgICAgIGFnZW50OiBudWxsLFxuICAgICAgICAgICAgYWdyZWVUb1Rlcm1zOiBmYWxzZSxcbiAgICAgICAgICAgIHNpdGVzOiBbXVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtaWRhYmxlKCkge1xuICAgIGZvcm1pZGFibGVTZXJ2ZXIgPSB7XG4gICAgICAgIG1heEZpbGVTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgKiAxMDQ4NTc2LFxuICAgICAgICB1cGxvYWREaXI6IFN5c3RlbURhdGEgKyBcIi9VcGxvYWRGaWxlcy9cIixcbiAgICAgICAgbXVsdGlwbGVzOiB0cnVlLFxuICAgICAgICBtYXhGaWVsZHNTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKiAxMDQ4NTc2XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQm9keVBhcnNlcigpIHtcbiAgICBib2R5UGFyc2VyU2VydmVyID0gKDxhbnk+Ym9keVBhcnNlcikuanNvbih7IGxpbWl0OiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKyAnbWInIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNlc3Npb24oKSB7XG4gICAgaWYgKCFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzIHx8ICFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIpIHtcbiAgICAgICAgU2Vzc2lvblN0b3JlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBTZXNzaW9uU3RvcmUgPSBzZXNzaW9uKHtcbiAgICAgICAgY29va2llOiB7IG1heEFnZTogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyAqIDYwICogMTAwMCwgc2FtZVNpdGU6IHRydWUgfSxcbiAgICAgICAgc2VjcmV0OiBTZXNzaW9uU2VjcmV0LFxuICAgICAgICByZXNhdmU6IGZhbHNlLFxuICAgICAgICBzYXZlVW5pbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgIHN0b3JlOiBuZXcgTWVtb3J5U3RvcmUoe1xuICAgICAgICAgICAgY2hlY2tQZXJpb2Q6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgbWF4OiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgKiAxMDQ4NTc2XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvcHlKU09OKHRvOiBhbnksIGpzb246IGFueSwgcnVsZXM6IHN0cmluZ1tdID0gW10sIHJ1bGVzVHlwZTogJ2lnbm9yZScgfCAnb25seScgPSAnaWdub3JlJykge1xuICAgIGlmKCFqc29uKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IGhhc0ltcGxlYXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgaSBpbiBqc29uKSB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGUgPSBydWxlcy5pbmNsdWRlcyhpKTtcbiAgICAgICAgaWYgKHJ1bGVzVHlwZSA9PSAnb25seScgJiYgaW5jbHVkZSB8fCBydWxlc1R5cGUgPT0gJ2lnbm9yZScgJiYgIWluY2x1ZGUpIHtcbiAgICAgICAgICAgIGhhc0ltcGxlYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0b1tpXSA9IGpzb25baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0ltcGxlYXRlZDtcbn1cblxuLy8gcmVhZCB0aGUgc2V0dGluZ3Mgb2YgdGhlIHdlYnNpdGVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlU2V0dGluZ3MoKSB7XG4gICAgY29uc3QgU2V0dGluZ3M6IEV4cG9ydFNldHRpbmdzID0gYXdhaXQgR2V0U2V0dGluZ3MoRXhwb3J0LnNldHRpbmdzUGF0aCwgRGV2TW9kZV8pO1xuICAgIGlmKFNldHRpbmdzID09IG51bGwpIHJldHVybjtcblxuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudClcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbERldik7XG5cbiAgICBlbHNlXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxQcm9kKTtcblxuXG4gICAgY29weUpTT04oRXhwb3J0LmNvbXBpbGUsIFNldHRpbmdzLmNvbXBpbGUpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnJvdXRpbmcsIFNldHRpbmdzLnJvdXRpbmcsIFsnaWdub3JlVHlwZXMnLCAndmFsaWRQYXRoJ10pO1xuXG4gICAgLy9jb25jYXQgZGVmYXVsdCB2YWx1ZXMgb2Ygcm91dGluZ1xuICAgIGNvbnN0IGNvbmNhdEFycmF5ID0gKG5hbWU6IHN0cmluZywgYXJyYXk6IGFueVtdKSA9PiBTZXR0aW5ncy5yb3V0aW5nPy5bbmFtZV0gJiYgKEV4cG9ydC5yb3V0aW5nW25hbWVdID0gU2V0dGluZ3Mucm91dGluZ1tuYW1lXS5jb25jYXQoYXJyYXkpKTtcblxuICAgIGNvbmNhdEFycmF5KCdpZ25vcmVUeXBlcycsIGJhc2VSb3V0aW5nSWdub3JlVHlwZXMpO1xuICAgIGNvbmNhdEFycmF5KCd2YWxpZFBhdGgnLCBiYXNlVmFsaWRQYXRoKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnY2FjaGVEYXlzJywgJ2Nvb2tpZXNFeHBpcmVzRGF5cyddLCAnb25seScpO1xuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydzZXNzaW9uVG90YWxSYW1NQicsICdzZXNzaW9uVGltZU1pbnV0ZXMnLCAnc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnZmlsZUxpbWl0TUInLCAncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG4gICAgfVxuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlLCBTZXR0aW5ncy5zZXJ2ZSk7XG5cbiAgICAvKiAtLS0gcHJvYmxlbWF0aWMgdXBkYXRlcyAtLS0gKi9cbiAgICBFeHBvcnQuZGV2ZWxvcG1lbnQgPSBTZXR0aW5ncy5kZXZlbG9wbWVudFxuXG4gICAgaWYgKFNldHRpbmdzLmdlbmVyYWw/LmltcG9ydE9uTG9hZCkge1xuICAgICAgICBFeHBvcnQuZ2VuZXJhbC5pbXBvcnRPbkxvYWQgPSA8YW55PmF3YWl0IFN0YXJ0UmVxdWlyZSg8YW55PlNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkLCBEZXZNb2RlXyk7XG4gICAgfVxuXG4gICAgLy9uZWVkIHRvIGRvd24gbGFzdGVkIHNvIGl0IHdvbid0IGludGVyZmVyZSB3aXRoICdpbXBvcnRPbkxvYWQnXG4gICAgaWYgKCFjb3B5SlNPTihFeHBvcnQuZ2VuZXJhbCwgU2V0dGluZ3MuZ2VuZXJhbCwgWydwYWdlSW5SYW0nXSwgJ29ubHknKSAmJiBTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICB9XG5cbiAgICBpZihFeHBvcnQuZGV2ZWxvcG1lbnQgJiYgRXhwb3J0LnJvdXRpbmcuc2l0ZW1hcCl7IC8vIG9uIHByb2R1Y3Rpb24gdGhpcyB3aWxsIGJlIGNoZWNrZWQgYWZ0ZXIgY3JlYXRpbmcgc3RhdGVcbiAgICAgICAgZGVidWdTaXRlTWFwKEV4cG9ydCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGaXJzdExvYWQoKSB7XG4gICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgYnVpbGRCb2R5UGFyc2VyKCk7XG59IiwgImltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHAyIGZyb20gJ2h0dHAyJztcbmltcG9ydCAqIGFzIGNyZWF0ZUNlcnQgZnJvbSAnc2VsZnNpZ25lZCc7XG5pbXBvcnQgKiBhcyBHcmVlbmxvY2sgZnJvbSAnZ3JlZW5sb2NrLWV4cHJlc3MnO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3N9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEZWxldGVJbkRpcmVjdG9yeSwgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEdyZWVuTG9ja1NpdGUgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuXG4vKipcbiAqIElmIHRoZSBmb2xkZXIgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNcbiAqIGV4aXN0LCB1cGRhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZm9sZGVyIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSBDcmVhdGVJbk5vdEV4aXRzIC0ge1xuICovXG5hc3luYyBmdW5jdGlvbiBUb3VjaFN5c3RlbUZvbGRlcihmb05hbWU6IHN0cmluZywgQ3JlYXRlSW5Ob3RFeGl0czoge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgZXhpdHM/OiBhbnl9KSB7XG4gICAgbGV0IHNhdmVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArIFwiL1N5c3RlbVNhdmUvXCI7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBzYXZlUGF0aCArPSBmb05hbWU7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBpZiAoQ3JlYXRlSW5Ob3RFeGl0cykge1xuICAgICAgICBzYXZlUGF0aCArPSAnLyc7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gc2F2ZVBhdGggKyBDcmVhdGVJbk5vdEV4aXRzLm5hbWU7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIENyZWF0ZUluTm90RXhpdHMudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKENyZWF0ZUluTm90RXhpdHMuZXhpdHMpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIGF3YWl0IENyZWF0ZUluTm90RXhpdHMuZXhpdHMoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpLCBmaWxlUGF0aCwgc2F2ZVBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBJdCBnZW5lcmF0ZXMgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBhbmQgc3RvcmVzIGl0IGluIGEgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSBjZXJ0aWZpY2F0ZSBhbmQga2V5IGFyZSBiZWluZyByZXR1cm5lZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RGVtb0NlcnRpZmljYXRlKCkge1xuICAgIGxldCBDZXJ0aWZpY2F0ZTogYW55O1xuICAgIGNvbnN0IENlcnRpZmljYXRlUGF0aCA9IFN5c3RlbURhdGEgKyAnL0NlcnRpZmljYXRlLmpzb24nO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKENlcnRpZmljYXRlUGF0aCkpIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBFYXN5RnMucmVhZEpzb25GaWxlKENlcnRpZmljYXRlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgY3JlYXRlQ2VydC5nZW5lcmF0ZShudWxsLCB7IGRheXM6IDM2NTAwIH0sIChlcnIsIGtleXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlzLnByaXZhdGUsXG4gICAgICAgICAgICAgICAgICAgIGNlcnQ6IGtleXMuY2VydFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKENlcnRpZmljYXRlUGF0aCwgQ2VydGlmaWNhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gQ2VydGlmaWNhdGU7XG59XG5cbmZ1bmN0aW9uIERlZmF1bHRMaXN0ZW4oYXBwKSB7XG4gICAgY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwLmF0dGFjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VydmVyLFxuICAgICAgICBsaXN0ZW4ocG9ydDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIDxhbnk+cmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZSgpIHtcbiAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgZ3JlZW5sb2NrLCBpdCB3aWxsIGNyZWF0ZSBhIHNlcnZlciB0aGF0IHdpbGwgc2VydmUgeW91ciBhcHAgb3ZlciBodHRwc1xuICogQHBhcmFtIGFwcCAtIFRoZSB0aW55SHR0cCBhcHBsaWNhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0aGUgc2VydmVyIG1ldGhvZHNcbiAqL1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gVXBkYXRlR3JlZW5Mb2NrKGFwcCkge1xuXG4gICAgaWYgKCEoU2V0dGluZ3Muc2VydmUuaHR0cDIgfHwgU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrPy5hZ3JlZVRvVGVybXMpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBEZWZhdWx0TGlzdGVuKGFwcCk7XG4gICAgfVxuXG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdyZWVUb1Rlcm1zKSB7XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGh0dHAyLmNyZWF0ZVNlY3VyZVNlcnZlcih7IC4uLmF3YWl0IEdldERlbW9DZXJ0aWZpY2F0ZSgpLCBhbGxvd0hUVFAxOiB0cnVlIH0sIGFwcC5hdHRhY2gpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4ocG9ydCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IFRvdWNoU3lzdGVtRm9sZGVyKFwiZ3JlZW5sb2NrXCIsIHtcbiAgICAgICAgbmFtZTogXCJjb25maWcuanNvblwiLCB2YWx1ZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc2l0ZXM6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlc1xuICAgICAgICB9KSxcbiAgICAgICAgYXN5bmMgZXhpdHMoZmlsZSwgXywgZm9sZGVyKSB7XG4gICAgICAgICAgICBmaWxlID0gSlNPTi5wYXJzZShmaWxlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBmaWxlLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IGZpbGUuc2l0ZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGhhdmU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIDxHcmVlbkxvY2tTaXRlW10+IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5zdWJqZWN0ID09IGUuc3ViamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGF2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5hbHRuYW1lcy5sZW5ndGggIT0gZS5hbHRuYW1lcy5sZW5ndGggfHwgYi5hbHRuYW1lcy5zb21lKHYgPT4gZS5hbHRuYW1lcy5pbmNsdWRlcyh2KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmFsdG5hbWVzID0gYi5hbHRuYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZS5yZW5ld0F0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFoYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGUuc2l0ZXMuc3BsaWNlKGksIGkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gZm9sZGVyICsgXCJsaXZlL1wiICsgZS5zdWJqZWN0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbmV3U2l0ZXMgPSBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMuZmlsdGVyKCh4KSA9PiAhZmlsZS5zaXRlcy5maW5kKGIgPT4gYi5zdWJqZWN0ID09IHguc3ViamVjdCkpO1xuXG4gICAgICAgICAgICBmaWxlLnNpdGVzLnB1c2goLi4ubmV3U2l0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh3b3JraW5nRGlyZWN0b3J5ICsgXCJwYWNrYWdlLmpzb25cIik7XG5cbiAgICBjb25zdCBncmVlbmxvY2tPYmplY3Q6YW55ID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IEdyZWVubG9jay5pbml0KHtcbiAgICAgICAgcGFja2FnZVJvb3Q6IHdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGNvbmZpZ0RpcjogXCJTeXN0ZW1TYXZlL2dyZWVubG9ja1wiLFxuICAgICAgICBwYWNrYWdlQWdlbnQ6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ2VudCB8fCBwYWNrYWdlSW5mby5uYW1lICsgJy8nICsgcGFja2FnZUluZm8udmVyc2lvbixcbiAgICAgICAgbWFpbnRhaW5lckVtYWlsOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suZW1haWwsXG4gICAgICAgIGNsdXN0ZXI6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5jbHVzdGVyLFxuICAgICAgICBzdGFnaW5nOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc3RhZ2luZ1xuICAgIH0pLnJlYWR5KHJlcykpO1xuXG4gICAgZnVuY3Rpb24gQ3JlYXRlU2VydmVyKHR5cGUsIGZ1bmMsIG9wdGlvbnM/KSB7XG4gICAgICAgIGxldCBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGdyZWVubG9ja09iamVjdFt0eXBlXShvcHRpb25zLCBmdW5jKTtcbiAgICAgICAgY29uc3QgbGlzdGVuID0gKHBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3QuaHR0cFNlcnZlcigpO1xuICAgICAgICAgICAgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4gaHR0cFNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtuZXcgUHJvbWlzZShyZXMgPT4gc2VydmVyLmxpc3Rlbig0NDMsIFwiMC4wLjAuMFwiLCByZXMpKSwgbmV3IFByb21pc2UocmVzID0+IGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsIFwiMC4wLjAuMFwiLCByZXMpKV0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgc2VydmVyLmNsb3NlKCk7IENsb3NlaHR0cFNlcnZlcigpOyB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuLFxuICAgICAgICAgICAgY2xvc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwMlNlcnZlcicsIGFwcC5hdHRhY2gsIHsgYWxsb3dIVFRQMTogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwc1NlcnZlcicsIGFwcC5hdHRhY2gpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgc2VydmVyLCB7U2V0dGluZ3N9ICBmcm9tICcuL01haW5CdWlsZC9TZXJ2ZXInO1xuaW1wb3J0IGFzeW5jUmVxdWlyZSBmcm9tICcuL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQge2dldFR5cGVzfSBmcm9tICcuL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSAnLi9CdWlsZEluRnVuYy9TZWFyY2hSZWNvcmQnO1xuZXhwb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL01haW5CdWlsZC9UeXBlcyc7XG5cbmV4cG9ydCBjb25zdCBBc3luY0ltcG9ydCA9IChwYXRoOnN0cmluZywgaW1wb3J0RnJvbSA9ICdhc3luYyBpbXBvcnQnKSA9PiBhc3luY1JlcXVpcmUoaW1wb3J0RnJvbSwgcGF0aCwgZ2V0VHlwZXMuU3RhdGljLCB7aXNEZWJ1ZzogU2V0dGluZ3MuZGV2ZWxvcG1lbnR9KTtcbmV4cG9ydCB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBOzs7QUNGQTs7O0FDQUEsSUFBSSxZQUFZO0FBRVQsb0JBQW9CLEdBQVk7QUFDbkMsY0FBWTtBQUNoQjtBQUVPLElBQU0sUUFBUSxJQUFJLE1BQU0sU0FBUTtBQUFBLEVBQ25DLElBQUksUUFBUSxNQUFNLFVBQVU7QUFDeEIsUUFBRyxRQUFRO0FBQ1AsYUFBTyxPQUFPO0FB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
