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
  originalPositionFor(line, column) {
    let searchLine = this.getLine(line);
    if (searchLine.startsWith("//")) {
      searchLine = this.getLine(line - 1);
      column = 0;
    }
    return __spreadProps(__spreadValues({}, searchLine.at(column - 1).DefaultInfoText), {
      searchLine
    });
  }
  debugLine({ message, text, location, line, col }) {
    const data = this.originalPositionFor(line ?? location?.line ?? 1, col ?? location?.column ?? 0);
    return `${text || message}, on file -><color>${BasicSettings.fullWebSitePath + data.searchLine.extractInfo()}:${data.line}:${data.char}${location?.lineText ? '\nLine: "' + location.lineText.trim() + '"' : ""}`;
  }
  StringWithTack(fullSaveLocation) {
    return outputWithMap(this, fullSaveLocation);
  }
  StringTack(fullSaveLocation, httpSource, relative2) {
    return outputMap(this, fullSaveLocation, httpSource, relative2);
  }
};

// src/OutputInput/Logger.ts
import chalk from "chalk";
var Settings = {
  PreventErrors: []
};
var PreventDoubleLog = [];
var ClearWarning = () => PreventDoubleLog.length = 0;
function createNewPrint({ id, text, type = "warn", errorName }) {
  if (!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)) {
    PreventDoubleLog.push(id ?? text);
    const logType = type == "error" ? "important" : type;
    const splitColor = text.split("<color>");
    const mainMessage = chalk.magenta(splitColor.pop().replace(/<line>/gi, " -> "));
    let about = "-".repeat(10) + (type == "error" ? chalk.bold(type) : type) + "-".repeat(10);
    return [
      logType,
      about + "\n" + chalk.blue(splitColor.shift() || "") + "\n" + mainMessage + "\n" + chalk.red(`Error-Code: ${errorName}`) + "\n" + "-".repeat(type.length + 20) + "\n"
    ];
  }
  return ["do-nothing"];
}
function LogToHTML(log) {
  return log.replace(/\n|<line>|<color>/, "<br/>");
}

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
    return `<div style="color:red;text-align:left;font-size:16px;">${JSParser.fixText(LogToHTML(message))}</div>`;
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

// src/CompileCode/transpiler/minify.ts
import { minify } from "@swc/core";

// src/CompileCode/transpiler/printMessage.ts
import { SourceMapConsumer as SourceMapConsumer3 } from "source-map";
function parseSWCError(err, changeLocations = (line, char, info) => {
  return { line, char, info };
}) {
  const splitData = err.stack.trim().split("\n");
  const errorFileAsIndex = splitData.reverse().findIndex((x) => x.includes("//!"));
  if (errorFileAsIndex == -1) {
    const message = err.message.replace(/(;[0-9]m)(.*?)\[0m:([0-9]+):([0-9]+)\]/, (_, start, file, g1, g2) => {
      const { line, char, info } = changeLocations(Number(g1), Number(g2), file);
      return `${start}${info}:${line}:${char}]`;
    });
    return {
      errorCode: err.code,
      errorLines: splitData[0],
      errorFile: splitData[0],
      simpleMessage: message,
      fullMessage: message
    };
  }
  const errorFile = splitData[errorFileAsIndex].split("//!").pop();
  const errorLines = splitData.slice(splitData.length - errorFileAsIndex, -3).map((x) => x.substring(x.indexOf("\u2502") + 1)).join("\n");
  let errorCode = splitData.at(-2);
  errorCode = errorCode.substring(errorCode.indexOf("`")).split("[0m").shift().trim();
  const dataError = {
    get simpleMessage() {
      return `${dataError.errorCode}, on file -><color>
${dataError.errorFile}`;
    },
    get fullMessage() {
      return `${dataError.simpleMessage}
Lines: ${dataError.errorLines}`;
    },
    errorFile,
    errorLines,
    errorCode
  };
  return dataError;
}
function ESBuildPrintError(err) {
  const parseError = parseSWCError(err);
  const [funcName, printText] = createNewPrint({
    type: "error",
    errorName: "compilation-error",
    text: parseError.fullMessage
  });
  print[funcName](printText);
  return parseError;
}
async function ESBuildPrintErrorSourceMap(err, sourceMap, sourceFile) {
  const original = await new SourceMapConsumer3(sourceMap);
  const parseError = parseSWCError(err, (line, column) => {
    const position = original.originalPositionFor({ line, column });
    return {
      line: position.line,
      char: position.column,
      info: sourceFile ?? position.source
    };
  });
  const [funcName, printText] = createNewPrint({
    type: "error",
    errorName: "compilation-error",
    text: parseError.fullMessage
  });
  print[funcName](printText);
  return parseError;
}
function ESBuildPrintErrorStringTracker(base, err) {
  const parseError = parseSWCError(err, (line, column, info) => {
    const position = base.originalPositionFor(line, column);
    return __spreadProps(__spreadValues({}, position), {
      info: position.searchLine.extractInfo()
    });
  });
  const [funcName, printText] = createNewPrint({
    type: "error",
    errorName: "compilation-error",
    text: parseError.fullMessage
  });
  print[funcName](printText);
  return parseError;
}

// src/CompileCode/transpiler/minify.ts
async function minifyJS(text, tracker) {
  try {
    return (await minify(text)).code;
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

// src/BuildInComponents/Components/script/load-options.ts
import { transform } from "@swc/core";

// src/CompileCode/transpiler/settings.ts
var esTarget = "es2022";
function Decorators(data) {
  data.transform = {
    legacyDecorator: true,
    decoratorMetadata: true
  };
  data.parser.decorators = true;
  return data;
}
function TransformJSC(data) {
  return Decorators(__spreadValues({
    target: esTarget
  }, data));
}
function Commonjs(data) {
  data.module = {
    type: "commonjs",
    strict: false,
    strictMode: false
  };
  return data;
}

// src/BuildInComponents/Components/script/load-options.ts
async function transpilerWithOptions(BetweenTagData, language, sourceMaps, BetweenTagDataString = BetweenTagData.eq, options) {
  let resultCode = "", resultMap;
  const AddOptions = Commonjs(__spreadValues({
    filename: BetweenTagData.extractInfo(),
    minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
    sourceMaps,
    jsc: __spreadValues({
      target: esTarget
    }, options)
  }, GetPlugin("transformOptions")));
  try {
    switch (language) {
      case "ts":
        Decorators(AddOptions.jsc).parser = __spreadValues({
          syntax: "typescript"
        }, GetPlugin("TSOptions"));
        break;
      case "jsx":
        AddOptions.jsc.parser = __spreadValues({
          syntax: "ecmascript",
          jsx: true
        }, GetPlugin("JSXOptions"));
        break;
      case "tsx":
        Decorators(AddOptions.jsc).parser = __spreadValues({
          syntax: "ecmascript",
          jsx: true
        }, GetPlugin("TSXOptions"));
        break;
    }
    const { map, code } = await transform(BetweenTagDataString, AddOptions);
    resultCode = code;
    resultMap = map;
  } catch (err) {
    ESBuildPrintErrorStringTracker(BetweenTagData, err);
  }
  return { resultCode, resultMap };
}

// src/BuildInComponents/Components/script/server.ts
var _a;
async function BuildCode2(language, pathName, type, dataTag2, BetweenTagData) {
  let ResCode = BetweenTagData;
  const SaveServerCode = new EnableGlobalReplace("serv");
  await SaveServerCode.load(BetweenTagData, pathName);
  const BetweenTagDataExtracted = await SaveServerCode.StartBuild();
  const { resultCode, resultMap } = await transpilerWithOptions(BetweenTagData, language, false, BetweenTagDataExtracted, { preserveAllComments: true });
  ResCode = SaveServerCode.RestoreCode(await SourceMapToStringTracker(resultCode, resultMap));
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a || (_a = __template(["<script", ">", "<\/script>"])), dataTag2.rebuildSpace(), ResCode)
  };
}

// src/BuildInComponents/Components/script/client.ts
async function BuildCode3(language, tagData, BetweenTagData, sessionInfo2) {
  const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.popString("type") == "module", isModelStringCache = isModel ? "scriptModule" : "script";
  if (sessionInfo2.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo2.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);
  const { resultCode, resultMap } = await transpilerWithOptions(BetweenTagData, language, sessionInfo2.debug);
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
on file -><color>${fileURLToPath5(err.span.url)}:${line ?? 0}:${column ?? 0}`,
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
    process.on("SIGINT", async () => {
      await this.save();
      setTimeout(() => process.exit());
    });
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
Page not found: <color>${type.at(0).lineInfo} -> ${FullPath2}`,
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
import { transform as transform3 } from "@swc/core";
import { extname } from "path";
import sass2 from "sass";
import { v4 as uuid } from "uuid";
import path5 from "path";
import { fileURLToPath as fileURLToPath6 } from "url";

// src/CompileCode/transform/Script.ts
import { transform as transform2 } from "@swc/core";

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
  return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${JSParser.printError(`Syntax Error: ${info}}`)}\``;
}
async function BuildScript(text, isTypescript, sessionInfo2) {
  text = text.trim();
  const Options = Commonjs({
    jsc: TransformJSC({
      parser: __spreadValues({
        syntax: isTypescript ? "typescript" : "ecmascript"
      }, GetPlugin((isTypescript ? "TS" : "JS") + "Options"))
    }),
    filename: sessionInfo2.smallPath,
    sourceMaps: true
  });
  let result;
  const scriptDefine = await EasySyntax.BuildAndExportImports(text.eq, { debug: "" + sessionInfo2.debug });
  try {
    const { code, map } = await transform2(scriptDefine, Options);
    result = map ? await backToOriginal(text, code, map) : new StringTracker(null, code);
  } catch (err) {
    const parse2 = ESBuildPrintErrorStringTracker(text, err);
    if (sessionInfo2.debug) {
      parse2.errorFile = BasicSettings.relative(parse2.errorFile);
      result = new StringTracker(null, ErrorTemplate(parse2.simpleMessage));
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
    const { code, map } = await transform3(content.eq, __spreadValues({
      jsc: TransformJSC({
        parser: {
          syntax: "typescript"
        }
      }),
      sourceMaps: true
    }, GetPlugin("transformOptions")));
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
${frame}<color>${filePath}:${await findLocation.getLocation(start)}`
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
${frame}<color>${filePath}:${await findLocation.getLocation(start)}`
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
  "number-range-integer": [
    /^[0-9]+..[0-9]+$/,
    (validator) => validator.split("..").map((x) => Number(x)),
    ([min, max], num) => Number.isInteger(num) && num >= min && num <= max,
    "number"
  ],
  "number-range-float": [
    /^[0-9]+\.[0-9]+..[0-9]+\.[0-9]+$/,
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
        const haveRegex = builtInConnectionRegex[element];
        if (haveRegex) {
          returnNow = value2 == null || !haveRegex[2](elementArgs, value2);
          break;
        }
        isDefault = true;
        if (element instanceof RegExp)
          returnNow = !element.test(value2) && "regex - " + value2;
        else if (typeof element == "function")
          returnNow = !await element(value2) && "function - " + (element.name || "anonymous");
      }
    }
    if (returnNow) {
      let info = `Validation failed at filed ${Number(i) + 1} - ${isDefault ? returnNow : "expected " + element}`;
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

// src/BuildInComponents/Components/serv-connect/connect-node.ts
function addFinalizeBuildAnyConnection(connectName, connectorCall, connectionType, pageData, sessionInfo2, buildArguments, { returnData } = {}) {
  if (!sessionInfo2.connectorArray.find((x) => x.type == connectionType))
    return pageData;
  for (const i of sessionInfo2.connectorArray) {
    if (i.type != connectionType)
      continue;
    const sendToUnicode = new StringTracker(null, i.name).unicode.eq;
    const connect = new RegExp(`@${connectName}\\([ ]*${sendToUnicode}[ ]*\\)(;?)`), connectDefault = new RegExp(`@\\?${connectName}\\([ ]*${sendToUnicode}[ ]*\\)`);
    let hadReplacement = false;
    const scriptData = () => {
      hadReplacement = true;
      return new StringTracker(null, `if(Post?.${connectorCall} == "${i.name}"){
                ${returnData ? "return " : ""}await handelConnector("${connectionType}", page, 
                    ${buildArguments(i)}
                );
            }`);
    };
    pageData = pageData.replacer(connect, scriptData);
    if (hadReplacement)
      pageData = pageData.replace(connectDefault, "");
    else
      pageData = pageData.replacer(connectDefault, scriptData);
  }
  return pageData;
}

// src/BuildInComponents/Components/connect.ts
var serveScript2 = "/serv/connect.js";
function template2(name2) {
  return `function ${name2}(...args){return connector("${name2}", args)}`;
}
async function BuildCode12(type, dataTag2, BetweenTagData, { SomePlugins: SomePlugins2 }, sessionInfo2) {
  const name2 = dataTag2.popHaveDefault("name"), sendTo = dataTag2.popHaveDefault("sendTo"), validator = dataTag2.popHaveDefault("validate"), notValid = dataTag2.popHaveDefault("notValid");
  const message = dataTag2.popAnyDefault("message", sessionInfo2.debug && !SomePlugins2("SafeDebug"));
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
  const compiledString = BetweenTagData || new StringTracker();
  compiledString.AddTextBeforeNoTrack(`<%!@@?ConnectHere(${name2})%>`);
  return {
    compiledString,
    checkComponents: true
  };
}
function addFinalizeBuild2(pageData, sessionInfo2) {
  return addFinalizeBuildAnyConnection("ConnectHere", "connectorCall?.name", "connect", pageData, sessionInfo2, (i) => {
    return `
        {
            name:"${i.name}",
            sendTo:${i.sendTo},
            notValid: ${i.notValid || "null"},
            message:${typeof i.message == "string" ? `"${i.message}"` : i.message},
            validator:[${i.validator && i.validator.map(compileValues).join(",") || ""}]
        }`;
  }, { returnData: true });
}
async function handelConnector(thisPage, connector) {
  const values = thisPage.Post.connectorCall.values;
  const isValid = connector.validator.length && await makeValidationJSON(values, connector.validator);
  thisPage.setResponse("");
  const betterJSON = (obj) => {
    thisPage.Response.setHeader("Content-Type", "application/json");
    thisPage.Response.end(JSON.stringify(obj));
  };
  if (!connector.validator.length || isValid === true)
    betterJSON(await connector.sendTo(...values));
  else if (connector.notValid)
    betterJSON(await connector.notValid(...isValid));
  else if (connector.message)
    betterJSON({
      error: typeof connector.message == "string" ? connector.message : isValid.shift()
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
@?ConnectHereForm(${name2})
%><form${dataTag2.rebuildSpace()}>
    <input type="hidden" name="connectorFormCall" value="${name2}"/>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo2)}</form>`;
  return {
    compiledString,
    checkComponents: false
  };
}
function addFinalizeBuild3(pageData, sessionInfo2) {
  return addFinalizeBuildAnyConnection("ConnectHereForm", "connectorFormCall", "form", pageData, sessionInfo2, (i) => {
    return `
        {
            sendTo:${i.sendTo},
            notValid: ${i.notValid || "null"},
            validator:[${i.validator?.map?.(compileValues)?.join(",") ?? ""}],
            order: [${i.order?.map?.((item) => `"${item}"`)?.join(",") ?? ""}],
            message:${typeof i.message == "string" ? `"${i.message}"` : i.message},
            safe:${i.responseSafe}
        }`;
  });
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
  if (isValid && !response)
    if (connectorInfo.message === true)
      thisPage.writeSafe(isValid[0]);
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
function handelConnectorService(type, thisPage, connector) {
  if (type == "connect")
    return handelConnector(thisPage, connector);
  else
    return handelConnector2(thisPage, connector);
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
import { transform as transform4 } from "@swc/core";
import path9 from "path";
import { v4 as uuid3 } from "uuid";

// src/Global/SearchRecord.ts
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
  const Options = Commonjs({
    jsc: TransformJSC({
      parser: __spreadValues({
        syntax: isTypescript ? "typescript" : "ecmascript"
      }, GetPlugin((isTypescript ? "TS" : "JS") + "Options"))
    }),
    minify: codeMinify,
    filename: filePath,
    sourceMaps: isDebug ? mergeTrack ? true : "inline" : false,
    outputPath: savePath && path9.relative(path9.dirname(savePath), filePath)
  });
  let Result = await ReplaceBefore(mergeTrack?.eq || await EasyFs_default.readFile(filePath), { debug: "" + isDebug });
  Result = template3(Result, isDebug, path9.dirname(templatePath), templatePath, params);
  try {
    const { code, map } = await transform4(Result, Options);
    Result = mergeTrack && map && (await backToOriginal(mergeTrack, code, map)).StringWithTack(savePath) || code;
  } catch (err) {
    if (mergeTrack) {
      ESBuildPrintErrorStringTracker(mergeTrack, err);
    } else {
      ESBuildPrintError(err);
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
  if (importFrom.includes(SavedModulesPath)) {
    const [funcName, printText] = createNewPrint({
      type: "error",
      errorName: "circle-import",
      text: `Import '${SavedModulesPath}' creates a circular dependency <color>${importFrom.slice(importFrom.indexOf(SavedModulesPath)).concat(filePath).join(" ->\n")}`
    });
    print[funcName](printText);
    SavedModules[SavedModulesPath] = null;
    useDeps[InStaticPath] = { thisFile: -1 };
    return null;
  }
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
        text: `Import '${InStaticPath}' does not exists from <color>'${BasicSettings.fullWebSitePath}/${importFrom.at(-1)}'`
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
    return LoadImport([...importFrom, SavedModulesPath], p, typeArray, { isDebug, useDeps, withoutCache: inheritanceCache ? withoutCache : [] });
  }
  let MyModule;
  if (thisCustom) {
    MyModule = await CustomImport(originalPath, filePath, extension, requireMap);
  } else {
    const requirePath = path9.join(typeArray[1], InStaticPath + ".cjs");
    MyModule = redirectCJS_default(requirePath);
    if (onlyPrepare) {
      PrepareMap[SavedModulesPath] = () => MyModule(requireMap);
      return;
    }
    try {
      MyModule = await MyModule(requireMap);
    } catch (err) {
      const [funcName, printText] = createNewPrint({
        type: "error",
        errorName: "import-error",
        text: `${err.message}<color>${importFrom.concat(filePath).reverse().join(" ->\n")}`
      });
      print[funcName](printText);
    }
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
  return LoadImport([importFrom], InStaticPath, typeArray, { isDebug, useDeps, withoutCache });
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
    return LoadImport([templatePath], p, typeArray, { isDebug });
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
      build.AddTextAfterNoTrack(`
__write = {text: ''};__writeArray.unshift(__write);`);
      build.Plus(i);
    }
    build.AddTextAfterNoTrack(`
return __writeArray`);
    return build;
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
    const build = new StringTracker();
    for (const i of parser.values) {
      if (i.type == "text") {
        build.Plus(i.text);
        continue;
      }
      build.AddTextAfterNoTrack(buildStrings.pop().text, i.text.DefaultInfoText.info);
    }
    return build;
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
        text: "Adding 'dynamic' attribute to file <color>" + this.sessionInfo.smallPath
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
    const build = new StringTracker(null, "@[");
    for (const { key, value: value2, char } of this.valueArray) {
      if (value2 !== true) {
        build.Plus$`${key}=${char}${value2}${char} `;
      } else {
        build.Plus$`${key} `;
      }
    }
    this.clearData = build.substring(0, build.length - 1).Plus("]\n").Plus(this.clearData);
  }
  static async rebuildBaseInheritance(code) {
    const parse2 = new ParseBasePage();
    const build = new StringTracker();
    await parse2.parseBase(code);
    for (const name2 of parse2.byValue("inherit")) {
      if (ignoreInherit.includes(name2.toLowerCase()))
        continue;
      parse2.pop(name2);
      build.AddTextAfterNoTrack(`<@${name2}><:${name2}/></@${name2}>`);
    }
    parse2.rebuild();
    return parse2.clearData.Plus(build);
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
Code file created: <color>${pagePath}<line>${SmallPath}`
      });
      print[funcName](printText);
    } else {
      const [funcName, printText] = createNewPrint({
        id: SmallPath,
        type: "error",
        errorName: "code-file-not-found",
        text: `
Code file not found: <color>${pagePath}<line>${SmallPath}`
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
          text: `Waring, can't find all query in tag -><color>${tag.eq}
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
            text: `Component ${type.eq} not found! -><color>${pathName}
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
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<(line|color)>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
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
import { transform as transform5 } from "@swc/core";
async function BuildScript3(inputPath, type, isDebug, parser, optionsName) {
  const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
  const AddOptions = {
    filename: fullPath,
    sourceFileName: inputPath + "?source=true",
    jsc: TransformJSC({
      parser: __spreadValues(__spreadValues(__spreadValues({}, parser), GetPlugin("transformOptions")), GetPlugin(optionsName))
    }),
    minify: SomePlugins("Min" + type.toUpperCase()) || SomePlugins("MinAll"),
    sourceMaps: isDebug ? "inline" : false
  };
  let result = await EasyFs_default.readFile(fullPath);
  try {
    result = (await transform5(result, AddOptions)).code;
  } catch (err) {
    ESBuildPrintError(err);
  }
  await EasyFs_default.makePathReal(inputPath, getTypes.Static[1]);
  await EasyFs_default.writeFile(fullCompilePath, result);
  return {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  };
}
function BuildJS(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "js", isDebug);
}
function BuildTS(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "ts", isDebug, { syntax: "typescript", decorators: true });
}
function BuildJSX(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "jsx", isDebug, { syntax: "ecmascript", jsx: true }, "JSXOptions");
}
function BuildTSX(inStaticPath, isDebug) {
  return BuildScript3(inStaticPath, "tsx", isDebug, { syntax: "typescript", tsx: true, decorators: true }, "TSXOptions");
}

// src/ImportFiles/ForStatic/Svelte/client.ts
import * as svelte2 from "svelte/compiler";
import { transform as transform6 } from "@swc/core";
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
      const { code: code2, map: map2 } = await transform6(js.code, {
        jsc: TransformJSC({
          parser: __spreadValues({
            syntax: scriptLang == "js" ? "ecmascript" : "typescript"
          }, GetPlugin(scriptLang.toUpperCase() + "Options"))
        }),
        minify: true,
        sourceMaps: isDebug
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
import { fileURLToPath as fileURLToPath7, pathToFileURL as pathToFileURL2 } from "url";
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
      sassAndSource(result.sourceMap, pathToFileURL2(fileData).href);
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
    const b = await LoadImport(["root folder (WWW)"], i, getTypes.Static, { isDebug });
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
  return LoadImport(["Production Loader"], script, getTypes.Static, { isDebug: false, onlyPrepare: true });
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
    pageDeps.save();
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
        LastRequire[copyPath] = { model: await ImportFile(BasicSettings.relative(__filename), filePath, typeArray, isDebug, newDeps, haveModel && getChangeArray(haveModel.dependencies, newDeps)), dependencies: newDeps, path: filePath };
      }
    } else {
      LastRequire[copyPath] = { model: {}, status: 0, path: filePath };
      const [funcName, printText] = createNewPrint({
        type: "warn",
        errorName: "import-not-exists",
        text: `Import '${filePath}' does not exists from <color>'${__filename}'`
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
      text: `Import '${copyPath}' does not exists from <color>'${__filename}'`
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
    error = 'Validation error with value "' + value2 + '"';
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
var AsyncImport = (path22, importFrom = "async import") => LoadImport([importFrom], path22, getTypes.Static, { isDebug: Export.development });
var src_default = StartServer;
export {
  AsyncImport,
  SearchRecord,
  Export as Settings,
  src_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0xvZ2dlci50cyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzIiwgIi4uL3NyYy9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVNjcmlwdC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSlNQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvbWluaWZ5LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jbGllbnQudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9sb2FkLW9wdGlvbnMudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi93YXNtLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2Vzc2lvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvZXJyb3IudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd24udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaGVhZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jb25uZWN0LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2Zvcm0udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcmVjb3JkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlYXJjaC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvWE1MSGVscGVycy9FeHRyaWNhdGUudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvQ29tcGlsZS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU2NyaXB0LnRzIiwgIi4uL3NyYy9HbG9iYWwvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3R5bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0NvbXBpbGVTdGF0ZS50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NpdGVNYXAudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GaWxlVHlwZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ltcG9ydEZpbGVSdW50aW1lLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQXBpQ2FsbC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0dldFBhZ2VzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvU2V0dGluZ3MudHMiLCAiLi4vc3JjL01haW5CdWlsZC9MaXN0ZW5HcmVlbkxvY2sudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBcHAgYXMgVGlueUFwcCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL1R5cGVzJztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5ncywgcmVxdWlyZVNldHRpbmdzLCBidWlsZEZpcnN0TG9hZCwgcGFnZUluUmFtQWN0aXZhdGVGdW5jfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBmb3JtaWRhYmxlIGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgVXBkYXRlR3JlZW5Mb2NrIH0gZnJvbSAnLi9MaXN0ZW5HcmVlbkxvY2snO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IGNoYW5nZVVSTFJ1bGVzKHJlcSwgcmVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hhbmdlVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgbGV0IHVybCA9IGZpbGVCeVVybC51cmxGaXgocmVxLnBhdGgpO1xuXG4gICAgXG4gICAgZm9yIChsZXQgaSBvZiBTZXR0aW5ncy5yb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpKSB7XG4gICAgICAgICAgICBpZiAoaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuc3Vic3RyaW5nKDAsIGkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSdWxlSW5kZXggPSBPYmplY3Qua2V5cyhTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzKS5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpO1xuXG4gICAgaWYgKFJ1bGVJbmRleCkge1xuICAgICAgICB1cmwgPSBhd2FpdCBTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzW1J1bGVJbmRleF0odXJsLCByZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgdXJsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZXJVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHVybDogc3RyaW5nKSB7XG4gICAgbGV0IG5vdFZhbGlkOiBhbnkgPSBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSkgfHwgU2V0dGluZ3Mucm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGkgPT4gdXJsLmVuZHNXaXRoKCcuJytpKSk7XG4gICAgXG4gICAgaWYoIW5vdFZhbGlkKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWxpZCBvZiBTZXR0aW5ncy5yb3V0aW5nLnZhbGlkUGF0aCl7IC8vIGNoZWNrIGlmIHVybCBpc24ndCB2YWxpZFxuICAgICAgICAgICAgaWYoIWF3YWl0IHZhbGlkKHVybCwgcmVxLCByZXMpKXtcbiAgICAgICAgICAgICAgICBub3RWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm90VmFsaWQpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gZmlsZUJ5VXJsLkdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCB1cmwuc3Vic3RyaW5nKDEpKTtcbn1cblxubGV0IGFwcE9ubGluZVxuXG4vKipcbiAqIEl0IHN0YXJ0cyB0aGUgc2VydmVyIGFuZCB0aGVuIGNhbGxzIFN0YXJ0TGlzdGluZ1xuICogQHBhcmFtIFtTZXJ2ZXJdIC0gVGhlIHNlcnZlciBvYmplY3QgdGhhdCBpcyBwYXNzZWQgaW4gYnkgdGhlIGNhbGxlci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gU3RhcnRBcHAoU2VydmVyPykge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBUaW55QXBwKCk7XG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICBhcHAudXNlKDxhbnk+Y29tcHJlc3Npb24oKSk7XG4gICAgfVxuICAgIGZpbGVCeVVybC5TZXR0aW5ncy5TZXNzaW9uU3RvcmUgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IFNldHRpbmdzLm1pZGRsZXdhcmUuc2Vzc2lvbihyZXEsIHJlcywgbmV4dCk7XG5cbiAgICBjb25zdCBPcGVuTGlzdGluZyA9IGF3YWl0IFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgU2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgYXdhaXQgZnVuYyhhcHAsIGFwcE9ubGluZS5zZXJ2ZXIsIFNldHRpbmdzKTtcbiAgICB9XG4gICAgYXdhaXQgcGFnZUluUmFtQWN0aXZhdGVGdW5jKCk/LigpXG5cbiAgICBhcHAuYWxsKFwiKlwiLCBQYXJzZVJlcXVlc3QpO1xuXG4gICAgYXdhaXQgT3Blbkxpc3RpbmcoU2V0dGluZ3Muc2VydmUucG9ydCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcCBsaXN0aW5nIGF0IHBvcnQ6IFwiICsgU2V0dGluZ3Muc2VydmUucG9ydCk7XG59XG5cbi8qKlxuICogSWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIHJlcXVlc3QsIHRoZW4gcGFyc2UgdGhlIHJlcXVlc3QgYm9keSwgdGhlbiBzZW5kIGl0IHRvIHJvdXRpbmcgc2V0dGluZ3NcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC0gVGhlIGluY29taW5nIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLSBSZXNwb25zZVxuICovXG5hc3luYyBmdW5jdGlvbiBQYXJzZVJlcXVlc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT0gJ1BPU1QnKSB7XG4gICAgICAgIGlmIChyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10/LnN0YXJ0c1dpdGg/LignYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICBTZXR0aW5ncy5taWRkbGV3YXJlLmJvZHlQYXJzZXIocmVxLCByZXMsICgpID0+IHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKFNldHRpbmdzLm1pZGRsZXdhcmUuZm9ybWlkYWJsZSkucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpIHtcbiAgICBpZiAoYXBwT25saW5lICYmIGFwcE9ubGluZS5jbG9zZSkge1xuICAgICAgICBhd2FpdCBhcHBPbmxpbmUuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcnZlciwgbGlzdGVuLCBjbG9zZSB9ID0gYXdhaXQgU2VydmVyKGFwcCk7XG5cbiAgICBhcHBPbmxpbmUgPSB7IHNlcnZlciwgY2xvc2UgfTtcblxuICAgIHJldHVybiBsaXN0ZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0U2VydmVyKHsgU2l0ZVBhdGggPSAnLi8nLCBIdHRwU2VydmVyID0gVXBkYXRlR3JlZW5Mb2NrIH0gPSB7fSkge1xuICAgIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciA9IFNpdGVQYXRoO1xuICAgIGJ1aWxkRmlyc3RMb2FkKCk7XG4gICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgU3RhcnRBcHAoSHR0cFNlcnZlcik7XG59XG5cbmV4cG9ydCB7IFNldHRpbmdzIH07IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcm9wID09ICdpbXBvcnRhbnQnKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5lcnJvcjtcbiAgICAgICAgICAgIFxuICAgICAgICBpZihwcmludE1vZGUgJiYgcHJvcCAhPSBcImRvLW5vdGhpbmdcIilcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQge0RpcmVudH0gZnJvbSAnZnMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtjd2R9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gJ3VybCdcbmltcG9ydCB7IEN1dFRoZUxhc3QgLCBTcGxpdEZpcnN0fSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVCeVNtYWxsUGF0aChzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIGdldFR5cGVzW1NwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnNoaWZ0KCldO1xufVxuXG5cblxuZXhwb3J0IHtcbiAgICBnZXREaXJuYW1lLFxuICAgIFN5c3RlbURhdGEsXG4gICAgd29ya2luZ0RpcmVjdG9yeSxcbiAgICBnZXRUeXBlcyxcbiAgICBCYXNpY1NldHRpbmdzXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuaW50ZXJmYWNlIGdsb2JhbFN0cmluZzxUPiB7XG4gICAgaW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBsYXN0SW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBzdGFydHNXaXRoKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0Rmlyc3Q8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4odHlwZTogc3RyaW5nLCBzdHJpbmc6IFQpOiBUW10ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YodHlwZSk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpXG4gICAgICAgIHJldHVybiBbc3RyaW5nXTtcblxuICAgIHJldHVybiBbc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCksIHN0cmluZy5zdWJzdHJpbmcoaW5kZXggKyB0eXBlLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3V0VGhlTGFzdCh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVuc2lvbjxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdHJpbmc6IFQpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLy4uL0pTUGFyc2VyJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9TZXNzaW9uJztcblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgPCV7P2RlYnVnX2ZpbGU/fSR7aS50ZXh0fSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVNjcmlwdENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnTGluZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlVGV4dENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlU2NyaXB0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VyLnN0YXJ0ID0gXCI8JVwiO1xuICAgIHBhcnNlci5lbmQgPSBcIiU+XCI7XG4gICAgcmV0dXJuIHBhcnNlci5SZUJ1aWxkVGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnSW5mbyhjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBhd2FpdCBQYXJzZVNjcmlwdENvZGUoY29kZSwgcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBBZGREZWJ1Z0luZm8oaXNvbGF0ZTogYm9vbGVhbiwgcGFnZU5hbWU6c3RyaW5nLCBGdWxsUGF0aDpzdHJpbmcsIFNtYWxsUGF0aDpzdHJpbmcsIGNhY2hlOiB7dmFsdWU/OiBzdHJpbmd9ID0ge30pe1xuICAgIGlmKCFjYWNoZS52YWx1ZSlcbiAgICAgICAgY2FjaGUudmFsdWUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbFBhdGgsICd1dGY4Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGxEYXRhOiBuZXcgU3RyaW5nVHJhY2tlcihgJHtwYWdlTmFtZX08bGluZT4ke1NtYWxsUGF0aH1gLCBpc29sYXRlID8gYDwleyU+JHtjYWNoZS52YWx1ZX08JX0lPmA6IGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkgPSB0aGlzLkRhdGFBcnJheS5jb25jYXQoZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcsIGluZm8gPSAnJykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheSA9IG5ld1N0cmluZy5EYXRhQXJyYXkuY29uY2F0KHRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgdGhpc1N1YnN0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzU3Vic3RyaW5nLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXNTdWJzdHJpbmcgPSB0aGlzU3Vic3RyaW5nLkN1dFN0cmluZyhpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICBwdWJsaWMgb3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lOm51bWJlciwgY29sdW1uOm51bWJlcil7XG4gICAgICAgIGxldCBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUpO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnNlYXJjaExpbmUuYXQoY29sdW1uLTEpLkRlZmF1bHRJbmZvVGV4dCxcbiAgICAgICAgICAgIHNlYXJjaExpbmVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMub3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEsIGNvbCA/PyBsb2NhdGlvbj8uY29sdW1uID8/IDApXG5cbiAgICAgICAgcmV0dXJuIGAke3RleHQgfHwgbWVzc2FnZX0sIG9uIGZpbGUgLT48Y29sb3I+JHtCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCtkYXRhLnNlYXJjaExpbmUuZXh0cmFjdEluZm8oKX06JHtkYXRhLmxpbmV9OiR7ZGF0YS5jaGFyfSR7bG9jYXRpb24/LmxpbmVUZXh0ID8gJ1xcbkxpbmU6IFwiJyArIGxvY2F0aW9uLmxpbmVUZXh0LnRyaW0oKSArICdcIic6ICcnfWA7XG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1dpdGhUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBvdXRwdXRXaXRoTWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24pXG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1RhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uLCBodHRwU291cmNlLCByZWxhdGl2ZSlcbiAgICB9XG59IiwgImltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdQcmludCh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgICAgIGNvbnN0IGxvZ1R5cGUgPSB0eXBlID09ICdlcnJvcicgPyAnaW1wb3J0YW50JzogdHlwZTtcblxuICAgICAgICBjb25zdCBzcGxpdENvbG9yID0gdGV4dC5zcGxpdCgnPGNvbG9yPicpO1xuICAgICAgIFxuICAgICAgICBjb25zdCBtYWluTWVzc2FnZSA9IGNoYWxrLm1hZ2VudGEoc3BsaXRDb2xvci5wb3AoKS5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJykpXG4gICAgICAgIFxuICAgICAgICBsZXQgYWJvdXQgPSAnLScucmVwZWF0KDEwKSArICh0eXBlID09ICdlcnJvcicgPyBjaGFsay5ib2xkKHR5cGUpOiB0eXBlKSArICctJy5yZXBlYXQoMTApXG4gICAgICAgIHJldHVybiBbbG9nVHlwZSxcbiAgICAgICAgICAgIGFib3V0ICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbGsuYmx1ZShzcGxpdENvbG9yLnNoaWZ0KCkgfHwgJycpICsgJ1xcbicgKyBcbiAgICAgICAgICAgIG1haW5NZXNzYWdlICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbGsucmVkKGBFcnJvci1Db2RlOiAke2Vycm9yTmFtZX1gKSArICdcXG4nICtcbiAgICAgICAgICAgICctJy5yZXBlYXQodHlwZS5sZW5ndGgrMjApICsgJ1xcbiddXG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2dUb0hUTUwobG9nOiBzdHJpbmcpe1xuICAgIHJldHVybiBsb2cucmVwbGFjZSgvXFxufDxsaW5lPnw8Y29sb3I+LywgJzxici8+Jylcbn0iLCAiaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5jb25zdCBsb2FkUGF0aCA9IHR5cGVvZiBlc2J1aWxkICE9PSAndW5kZWZpbmVkJyA/ICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50Lyc6ICcvLi4vJztcbmNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsICsgbG9hZFBhdGggKyAnYnVpbGQud2FzbScpKSk7XG5jb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuY29uc3Qgd2FzbSA9IHdhc21JbnN0YW5jZS5leHBvcnRzO1xuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbSh0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuLyoqXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9lcnJvcnMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHdhc20uZ2V0X2Vycm9ycyhyZXRwdHIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGJsb2NrXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX2Jsb2NrKHRleHQsIGJsb2NrKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChibG9jaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX2Jsb2NrKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tpcF9zcGVjaWFsX3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gc2ltcGxlX3NraXBcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2NvbXBvbmVudChza2lwX3NwZWNpYWxfdGFnLCBzaW1wbGVfc2tpcCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2tpcF9zcGVjaWFsX3RhZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2ltcGxlX3NraXAsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB3YXNtLmluc2VydF9jb21wb25lbnQocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfZGVmKHRleHQsIGVuZF90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmRfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX2RlZihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHFfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9xKHRleHQsIHFfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX3EocHRyMCwgbGVuMCwgcV90eXBlLmNvZGVQb2ludEF0KDApKTtcbiAgICByZXR1cm4gcmV0ID4+PiAwO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2VqcyhyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzX21pbih0ZXh0LCBuYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2Vqc19taW4ocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzdGFydFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGVqc19wYXJzZSh0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGFydCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjIgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjIgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uZWpzX3BhcnNlKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMiwgbGVuMik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWdlX2Jhc2VfcGFyc2VyKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnBhZ2VfYmFzZV9wYXJzZXIocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWxfYXR0cl9wYXJzZXIodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uaHRtbF9hdHRyX3BhcnNlcihyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGNvbnN0IFNpbXBsZVNraXAgPSBbJ3RleHRhcmVhJywnc2NyaXB0JywgJ3N0eWxlJ107XG5leHBvcnQgY29uc3QgU2tpcFNwZWNpYWxUYWcgPSBbW1wiJVwiLCBcIiVcIl0sIFtcIiN7ZGVidWd9XCIsIFwie2RlYnVnfSNcIl1dOyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBmaW5kX2VuZF9vZl9kZWYsIGZpbmRfZW5kX29mX3EsIGZpbmRfZW5kX2Jsb2NrIH0gZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzJztcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9TZXR0aW5ncy5qcyc7XG5pbXBvcnQgeyBnZXREaXJuYW1lLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuXG5jb25zdCBjcHVMZW5ndGggPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGNwdXMoKS5sZW5ndGggLyAyKSk7XG5leHBvcnQgY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBlbmQgb2YgcXVvdGF0aW9uIG1hcmtzLCBza2lwcGluZyB0aGluZ3MgbGlrZSBlc2NhcGluZzogXCJcXFxcXCJcIlxuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW50T2ZRKHRleHQ6IHN0cmluZywgcVR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9xKHRleHQsIHFUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGNoYXIgc2tpcHBpbmcgZGF0YSBpbnNpZGUgcXVvdGF0aW9uIG1hcmtzXG4gICAgICogQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIGZpbmRFbmRPZkRlZih0ZXh0OiBzdHJpbmcsIEVuZFR5cGU6IHN0cmluZ1tdIHwgc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KEVuZFR5cGUpKSB7XG4gICAgICAgICAgICBFbmRUeXBlID0gW0VuZFR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBKU09OLnN0cmluZ2lmeShFbmRUeXBlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2FtZSBhcyAnZmluZEVuZE9mRGVmJyBvbmx5IHdpdGggb3B0aW9uIHRvIGN1c3RvbSAnb3BlbicgYW5kICdjbG9zZSdcbiAgICAgKiBgYGBqc1xuICAgICAqIEZpbmRFbmRPZkJsb2NrKGBjb29sIFwifVwiIHsgZGF0YSB9IH0gbmV4dGAsICd7JywgJ30nKVxuICAgICAqIGBgYFxuICAgICAqIGl0IHdpbGwgcmV0dXJuIHRoZSAxOCAtPiBcIn0gbmV4dFwiXG4gICAgICogIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBGaW5kRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIG9wZW46IHN0cmluZywgZW5kOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfYmxvY2sodGV4dCwgb3BlbiArIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgU2ltcGxlU2tpcDogc3RyaW5nW10gPSBTZXR0aW5ncy5TaW1wbGVTa2lwO1xuICAgIFNraXBTcGVjaWFsVGFnOiBzdHJpbmdbXVtdID0gU2V0dGluZ3MuU2tpcFNwZWNpYWxUYWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW50TmV3PzogYW55KSB7IH1cblxuICAgIHByaXZhdGUgcHJpbnRFcnJvcnModGV4dDogU3RyaW5nVHJhY2tlciwgZXJyb3JzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByaW50TmV3KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIEpTT04ucGFyc2UoZXJyb3JzKS5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXcoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7aS50eXBlX25hbWV9XCIsIHVzZWQgaW46ICR7dGV4dC5hdChOdW1iZXIoaS5pbmRleCkpLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXIodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFyJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFySFRNTCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXJIVE1MJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cbn1cblxudHlwZSBQYXJzZUJsb2NrcyA9IHsgbmFtZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciB9W11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlModGV4dDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKUycsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKU01pbmkodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTTWluaScsIFt0ZXh0LGZpbmRdKSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVKU1BhcnNlcih0ZXh0OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnRUpTUGFyc2VyJywgW3RleHQsIHN0YXJ0LCBlbmRdKSk7XG59IiwgIlxuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuaW50ZXJmYWNlIFNwbGl0VGV4dCB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHR5cGVfbmFtZTogc3RyaW5nLFxuICAgIGlzX3NraXA6IGJvb2xlYW5cbn1cblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcGFyc2Vfc3RyZWFtID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL3JlYWRlci93b3JrZXIuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dFN0cmVhbSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFNwbGl0VGV4dFtdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2J1aWxkX3N0cmVhbScsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZEZWZTa2lwQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZmluZF9lbmRfb2ZfZGVmX3NraXBfYmxvY2snLCBbdGV4dCwgSlNPTi5zdHJpbmdpZnkodHlwZXMpXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2VuZF9vZl9ibG9jaycsIFt0ZXh0LCB0eXBlcy5qb2luKCcnKV0pO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgUmVwbGFjZUFsbCh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQuc3BsaXQoZmluZCkpIHtcbiAgICAgICAgICAgIG5ld1RleHQgKz0gcmVwbGFjZSArIGk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dC5zdWJzdHJpbmcocmVwbGFjZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuXG5hYnN0cmFjdCBjbGFzcyBSZUJ1aWxkQ29kZUJhc2ljIGV4dGVuZHMgQmFzZUVudGl0eUNvZGUge1xuICAgIHB1YmxpYyBQYXJzZUFycmF5OiBTcGxpdFRleHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuUGFyc2VBcnJheSA9IFBhcnNlQXJyYXk7XG4gICAgfVxuXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBsZXQgT3V0U3RyaW5nID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBPdXRTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUmVwbGFjZUFsbChPdXRTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuXG5cbnR5cGUgRGF0YUNvZGVJbmZvID0ge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbnB1dHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBjbGFzcyBSZUJ1aWxkQ29kZVN0cmluZyBleHRlbmRzIFJlQnVpbGRDb2RlQmFzaWMge1xuICAgIHByaXZhdGUgRGF0YUNvZGU6IERhdGFDb2RlSW5mbztcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKFBhcnNlQXJyYXkpO1xuICAgICAgICB0aGlzLkRhdGFDb2RlID0geyB0ZXh0OiBcIlwiLCBpbnB1dHM6IFtdIH07XG4gICAgICAgIHRoaXMuQ3JlYXRlRGF0YUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgQ29kZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUudGV4dDtcbiAgICB9XG5cbiAgICBzZXQgQ29kZUJ1aWxkVGV4dCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgQWxsSW5wdXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDcmVhdGVEYXRhQ29kZSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGkuaXNfc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBgPHwke3RoaXMuRGF0YUNvZGUuaW5wdXRzLmxlbmd0aH18JHtpLnR5cGVfbmFtZSA/PyAnJ318PmA7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS5pbnB1dHMucHVzaChpLnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIDx8fD4gc3RhcnQgd2l0aCBhICgrLikgbGlrZSB0aGF0IGZvciBleGFtcGxlLCBcIisuPHx8PlwiLCB0aGUgdXBkYXRlIGZ1bmN0aW9uIHdpbGwgZ2V0IHRoZSBsYXN0IFwiU2tpcFRleHRcIiBpbnN0ZWFkIGdldHRpbmcgdGhlIG5ldyBvbmVcbiAgICAgKiBzYW1lIHdpdGggYSAoLS4pIGp1c3QgZm9yIGlnbm9yaW5nIGN1cnJlbnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB0aGUgYnVpbGRlZCBjb2RlXG4gICAgICovXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkRhdGFDb2RlLnRleHQucmVwbGFjZSgvPFxcfChbMC05XSspXFx8W1xcd10qXFx8Pi9naSwgKF8sIGcxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHNbZzFdO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuUmVwbGFjZUFsbChuZXdTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IExvZ1RvSFRNTCB9IGZyb20gJy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBFSlNQYXJzZXIgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL3RyYW5zZm9ybS9FYXN5U2NyaXB0JztcblxuaW50ZXJmYWNlIEpTUGFyc2VyVmFsdWVzIHtcbiAgICB0eXBlOiAndGV4dCcgfCAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU1BhcnNlciB7XG4gICAgcHVibGljIHN0YXJ0OiBzdHJpbmc7XG4gICAgcHVibGljIHRleHQ6IFN0cmluZ1RyYWNrZXI7XG4gICAgcHVibGljIGVuZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWVzOiBKU1BhcnNlclZhbHVlc1tdO1xuXG4gICAgY29uc3RydWN0b3IodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBzdGFydCA9IFwiPCVcIiwgZW5kID0gXCIlPlwiLCB0eXBlID0gJ3NjcmlwdCcpIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBSZXBsYWNlVmFsdWVzKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlQWxsKGZpbmQsIHJlcGxhY2UpO1xuICAgIH1cblxuICAgIGZpbmRFbmRPZkRlZkdsb2JhbCh0ZXh0OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGVxID0gdGV4dC5lcVxuICAgICAgICBjb25zdCBmaW5kID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZXEsIFsnOycsICdcXG4nLCB0aGlzLmVuZF0pO1xuICAgICAgICByZXR1cm4gZmluZCAhPSAtMSA/IGZpbmQgKyAxIDogZXEubGVuZ3RoO1xuICAgIH1cblxuICAgIFNjcmlwdFdpdGhJbmZvKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgV2l0aEluZm8gPSBuZXcgU3RyaW5nVHJhY2tlcih0ZXh0LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsU2NyaXB0ID0gdGV4dC5zcGxpdCgnXFxuJyksIGxlbmd0aCA9IGFsbFNjcmlwdC5sZW5ndGg7XG4gICAgICAgIC8vbmV3IGxpbmUgZm9yIGRlYnVnIGFzIG5ldyBsaW5lIHN0YXJ0XG4gICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuXG4gICAgICAgIC8vZmlsZSBuYW1lIGluIGNvbW1lbnRcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNjcmlwdCkge1xuXG4gICAgICAgICAgICBpZihpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlU2FmZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlYnVnXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgXFxucnVuX3NjcmlwdF9uYW1lID0gXFxgJHtKU1BhcnNlci5maXhUZXh0KHN1YnN0cmluZyl9XFxgO2BcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzdWJzdHJpbmcsXG4gICAgICAgICAgICAgICAgdHlwZTogPGFueT50eXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0KHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvYC9naSwgJ1xcXFxgJykucmVwbGFjZSgvXFx1MDAyNC9naSwgJ1xcXFx1MDAyNCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0U2ltcGxlUXVvdGVzKHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpO1xuICAgIH1cblxuICAgIFJlQnVpbGRUZXh0KCkge1xuICAgICAgICBjb25zdCBhbGxjb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaS50eXBlID09ICduby10cmFjaycpIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgJyEnLCBpLnRleHQsIHRoaXMuZW5kKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgaS50ZXh0LCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsY29kZTtcbiAgICB9XG5cbiAgICBCdWlsZEFsbChpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHJ1blNjcmlwdCA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuXG4gICAgICAgIGlmICghdGhpcy52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMkYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRGVidWcgJiYgaS50eXBlID09ICdzY3JpcHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYFxcbnJ1bl9zY3JpcHRfY29kZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmlwdFdpdGhJbmZvKGkudGV4dClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcmludEVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPiR7SlNQYXJzZXIuZml4VGV4dChMb2dUb0hUTUwobWVzc2FnZSkpfTwvZGl2PmA7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIFJ1bkFuZEV4cG9ydCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRleHQsIHBhdGgpXG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLkJ1aWxkQWxsKGlzRGVidWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHNwbGl0MkZyb21FbmQodGV4dDogc3RyaW5nLCBzcGxpdENoYXI6IHN0cmluZywgbnVtVG9TcGxpdEZyb21FbmQgPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0ZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PSBzcGxpdENoYXIpIHtcbiAgICAgICAgICAgICAgICBudW1Ub1NwbGl0RnJvbUVuZC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtVG9TcGxpdEZyb21FbmQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdGV4dC5zdWJzdHJpbmcoMCwgaSksIHRleHQuc3Vic3RyaW5nKGkgKyAxKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RleHRdO1xuICAgIH1cbn1cblxuXG4vL2J1aWxkIHNwZWNpYWwgY2xhc3MgZm9yIHBhcnNlciBjb21tZW50cyAvKiovIHNvIHlvdSBiZSBhYmxlIHRvIGFkZCBSYXpvciBpbnNpZGUgb2Ygc3R5bGUgb3Qgc2NyaXB0IHRhZ1xuXG5pbnRlcmZhY2UgR2xvYmFsUmVwbGFjZUFycmF5IHtcbiAgICB0eXBlOiAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgY2xhc3MgRW5hYmxlR2xvYmFsUmVwbGFjZSB7XG4gICAgcHJpdmF0ZSBzYXZlZEJ1aWxkRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5W10gPSBbXTtcbiAgICBwcml2YXRlIGJ1aWxkQ29kZTogUmVCdWlsZENvZGVTdHJpbmc7XG4gICAgcHJpdmF0ZSBwYXRoOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZXBsYWNlcjogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGRUZXh0ID0gXCJcIikge1xuICAgICAgICB0aGlzLnJlcGxhY2VyID0gUmVnRXhwKGAke2FkZFRleHR9XFxcXC9cXFxcKiFzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PlxcXFwqXFxcXC98c3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5gKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgICAgICB0aGlzLmJ1aWxkQ29kZSA9IG5ldyBSZUJ1aWxkQ29kZVN0cmluZyhhd2FpdCBQYXJzZVRleHRTdHJlYW0oYXdhaXQgdGhpcy5FeHRyYWN0QW5kU2F2ZUNvZGUoY29kZSkpKTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIEV4dHJhY3RBbmRTYXZlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb2RlID0gbmV3IEpTUGFyc2VyKGNvZGUsIHRoaXMucGF0aCk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb2RlLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgbGV0IG5ld1RleHQgPSBcIlwiO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb2RlLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBuZXdUZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlZEJ1aWxkRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogaS50eXBlLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpLnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBuZXdUZXh0ICs9IGBzeXN0ZW0tLTx8ZWpzfCR7Y291bnRlcisrfXw+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUGFyc2VPdXRzaWRlT2ZDb21tZW50KHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZXIoL3N5c3RlbS0tPFxcfGVqc1xcfChbMC05XSlcXHw+LywgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IFNwbGl0VG9SZXBsYWNlWzFdO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGluZGV4LlN0YXJ0SW5mbykuUGx1cyRgJHt0aGlzLmFkZFRleHR9Lyohc3lzdGVtLS08fGVqc3wke2luZGV4fXw+Ki9gO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgU3RhcnRCdWlsZCgpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvbW1lbnRzID0gbmV3IEpTUGFyc2VyKG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQpLCB0aGlzLnBhdGgsICcvKicsICcqLycpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29tbWVudHMuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvbW1lbnRzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpLnRleHQgPSB0aGlzLlBhcnNlT3V0c2lkZU9mQ29tbWVudChpLnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCA9IGV4dHJhY3RDb21tZW50cy5SZUJ1aWxkVGV4dCgpLmVxO1xuICAgICAgICByZXR1cm4gdGhpcy5idWlsZENvZGUuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZXN0b3JlQXNDb2RlKERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheSkge1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoRGF0YS50ZXh0LlN0YXJ0SW5mbykuUGx1cyRgPCUke0RhdGEudHlwZSA9PSAnbm8tdHJhY2snID8gJyEnOiAnJ30ke0RhdGEudGV4dH0lPmA7XG4gICAgfVxuXG4gICAgcHVibGljIFJlc3RvcmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZXIodGhpcy5yZXBsYWNlciwgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihTcGxpdFRvUmVwbGFjZVsxXSA/PyBTcGxpdFRvUmVwbGFjZVsyXSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLlJlc3RvcmVBc0NvZGUodGhpcy5zYXZlZEJ1aWxkRGF0YVtpbmRleF0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwgImltcG9ydCB7IG1pbmlmeSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuL3ByaW50TWVzc2FnZSc7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeUpTKHRleHQ6IHN0cmluZywgdHJhY2tlcjogU3RyaW5nVHJhY2tlcil7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBtaW5pZnkodGV4dCkpLmNvZGVcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodHJhY2tlciwgZXJyKVxuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbn0iLCAiaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU1dDRXJyb3IoZXJyOiB7bWVzc2FnZTogc3RyaW5nLCBzdGFjazogc3RyaW5nLCBjb2RlOiBzdHJpbmd9LCBjaGFuZ2VMb2NhdGlvbnMgPSAobGluZTogbnVtYmVyLCBjaGFyOiBudW1iZXIsIGluZm86IHN0cmluZykgPT4ge3JldHVybiB7bGluZSwgY2hhciwgaW5mb319KXtcbiAgICBjb25zdCBzcGxpdERhdGE6c3RyaW5nW10gPSBlcnIuc3RhY2sudHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBlcnJvckZpbGVBc0luZGV4ID0gc3BsaXREYXRhLnJldmVyc2UoKS5maW5kSW5kZXgoKHg6c3RyaW5nKSA9PiB4LmluY2x1ZGVzKCcvLyEnKSlcblxuICAgIGlmKGVycm9yRmlsZUFzSW5kZXggPT0gLTEpe1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgvKDtbMC05XW0pKC4qPylcXFswbTooWzAtOV0rKTooWzAtOV0rKVxcXS8sIChfLCBzdGFydCwgZmlsZSwgZzEsIGcyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBjaGFuZ2VMb2NhdGlvbnMoTnVtYmVyKGcxKSwgTnVtYmVyKGcyKSwgZmlsZSlcbiAgICAgICAgICAgIHJldHVybiBgJHtzdGFydH0ke2luZm99OiR7bGluZX06JHtjaGFyfV1gXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogZXJyLmNvZGUsXG4gICAgICAgICAgICBlcnJvckxpbmVzOiBzcGxpdERhdGFbMF0sXG4gICAgICAgICAgICBlcnJvckZpbGU6IHNwbGl0RGF0YVswXSxcbiAgICAgICAgICAgIHNpbXBsZU1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICBmdWxsTWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JGaWxlID0gc3BsaXREYXRhW2Vycm9yRmlsZUFzSW5kZXhdLnNwbGl0KCcvLyEnKS5wb3AoKVxuICAgIGNvbnN0IGVycm9yTGluZXMgPSBzcGxpdERhdGEuc2xpY2Uoc3BsaXREYXRhLmxlbmd0aCAtIGVycm9yRmlsZUFzSW5kZXgsIC0gMykubWFwKHggPT4gIHguc3Vic3RyaW5nKHguaW5kZXhPZignXHUyNTAyJykrMSkpLmpvaW4oJ1xcbicpO1xuXG4gICAgbGV0IGVycm9yQ29kZTpzdHJpbmcgPSBzcGxpdERhdGEuYXQoLTIpO1xuICAgIGVycm9yQ29kZSA9IGVycm9yQ29kZS5zdWJzdHJpbmcoZXJyb3JDb2RlLmluZGV4T2YoJ2AnKSkuc3BsaXQoJ1swbScpLnNoaWZ0KCkudHJpbSgpO1xuXG4gICAgY29uc3QgZGF0YUVycm9yID0ge1xuICAgICAgICBnZXQgc2ltcGxlTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5lcnJvckNvZGV9LCBvbiBmaWxlIC0+PGNvbG9yPlxcbiR7ZGF0YUVycm9yLmVycm9yRmlsZX1gXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmdWxsTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5zaW1wbGVNZXNzYWdlfVxcbkxpbmVzOiAke2RhdGFFcnJvci5lcnJvckxpbmVzfWBcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JGaWxlLFxuICAgICAgICBlcnJvckxpbmVzLFxuICAgICAgICBlcnJvckNvZGVcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFFcnJvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCBwYXJzZUVycm9yID0gcGFyc2VTV0NFcnJvcihlcnIpO1xuICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICB0ZXh0OiBwYXJzZUVycm9yLmZ1bGxNZXNzYWdlXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgcmV0dXJuIHBhcnNlRXJyb3I7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnI6IGFueSwgc291cmNlTWFwOiBSYXdTb3VyY2VNYXAsIHNvdXJjZUZpbGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIFxuICAgIGNvbnN0IHBhcnNlRXJyb3IgPSBwYXJzZVNXQ0Vycm9yKGVyciwgKGxpbmUsIGNvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmUsIGNvbHVtbn0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lOiBwb3NpdGlvbi5saW5lLFxuICAgICAgICAgICAgY2hhcjogcG9zaXRpb24uY29sdW1uLFxuICAgICAgICAgICAgaW5mbzogc291cmNlRmlsZSA/PyBwb3NpdGlvbi5zb3VyY2VcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgIHRleHQ6IHBhcnNlRXJyb3IuZnVsbE1lc3NhZ2VcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICByZXR1cm4gcGFyc2VFcnJvcjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIGVycjogYW55KSB7XG5cbiAgICBjb25zdCBwYXJzZUVycm9yID0gcGFyc2VTV0NFcnJvcihlcnIsIChsaW5lLCBjb2x1bW4sIGluZm8pID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBiYXNlLm9yaWdpbmFsUG9zaXRpb25Gb3IobGluZSwgY29sdW1uKVxuICAgICAgICByZXR1cm4gPGFueT57XG4gICAgICAgICAgICAuLi5wb3NpdGlvbixcbiAgICAgICAgICAgIGluZm86IHBvc2l0aW9uLnNlYXJjaExpbmUuZXh0cmFjdEluZm8oKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgdGV4dDogcGFyc2VFcnJvci5mdWxsTWVzc2FnZVxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIHJldHVybiBwYXJzZUVycm9yO1xufVxuXG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBtaW5pZnlKUyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvbWluaWZ5JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgcGFyYW1zOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBzZWxlY3Rvcjogc3RyaW5nLCBtYWluQ29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBKU1BhcnNlci5SdW5BbmRFeHBvcnQobWFpbkNvZGUsIHBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkIGBmdW5jdGlvbiAke25hbWV9KHske3BhcmFtc319LCBzZWxlY3RvciR7c2VsZWN0b3IgPyBgID0gXCIke3NlbGVjdG9yfVwiYDogJyd9LCBvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30pe1xuICAgICAgICBjb25zdCB7d3JpdGUsIHdyaXRlU2FmZSwgc2V0UmVzcG9uc2UsIHNlbmRUb1NlbGVjdG9yfSA9IG5ldyBidWlsZFRlbXBsYXRlKG91dF9ydW5fc2NyaXB0KTtcbiAgICAgICAgJHthd2FpdCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUocGFyc2UpfVxuICAgICAgICB2YXIgZXhwb3J0cyA9ICR7bmFtZX0uZXhwb3J0cztcbiAgICAgICAgcmV0dXJuIHNlbmRUb1NlbGVjdG9yKHNlbGVjdG9yLCBvdXRfcnVuX3NjcmlwdC50ZXh0KTtcbiAgICB9XFxuJHtuYW1lfS5leHBvcnRzID0ge307YFxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHthc3luYzogbnVsbH0pO1xuXG4gICAgbGV0IHNjcmlwdEluZm8gPSBhd2FpdCB0ZW1wbGF0ZShcbiAgICAgICAgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMsXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcignbmFtZScsICdjb25uZWN0JyksXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcigncGFyYW1zJywgJycpLFxuICAgICAgICBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3NlbGVjdG9yJywgJycpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBtYXAgPSB0eXBlb2Ygc291cmNlTWFwID09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShzb3VyY2VNYXApOiBzb3VyY2VNYXA7XG5cbiAgICBjb25zdCB0cmFja0NvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICBjb25zdCBzcGxpdExpbmVzID0gdHJhY2tDb2RlLnNwbGl0KCdcXG4nKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBpc01hcCA9IHNwbGl0TGluZXNbbS5nZW5lcmF0ZWRMaW5lIC0gMV07XG4gICAgICAgIGlmICghaXNNYXApIHJldHVybjtcblxuXG4gICAgICAgIGxldCBjaGFyQ291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaXNNYXAuc3Vic3RyaW5nKG0uZ2VuZXJhdGVkQ29sdW1uID8gbS5nZW5lcmF0ZWRDb2x1bW4gLSAxOiAwKS5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICAgICAgaS5pbmZvID0gbS5zb3VyY2U7XG4gICAgICAgICAgICBpLmxpbmUgPSBtLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAgIGkuY2hhciA9IGNoYXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2tDb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ICA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgaXRlbS5pbmZvID0gaW5mbztcbiAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYWNrVG9PcmlnaW5hbChvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG5ld1RyYWNrZXIgPSBhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZSwgc291cmNlTWFwKTtcbiAgICBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyKTtcbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlciwgbXlTb3VyY2U6IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBpZihpdGVtLmluZm8gPT0gbXlTb3VyY2Upe1xuICAgICAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXS5hdChpdGVtLmNoYXItMSk/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW0uaW5mbykge1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKGl0ZW0uaW5mbykpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsU3NzKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyLCBteVNvdXJjZSk7XG5cbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0sIEpzY0NvbmZpZyB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlJztcbmltcG9ydCB7IENvbW1vbmpzLCBEZWNvcmF0b3JzLCBlc1RhcmdldCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJhbnNwaWxlcldpdGhPcHRpb25zKEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBsYW5ndWFnZTogc3RyaW5nLCBzb3VyY2VNYXBzOiBib29sZWFuLCBCZXR3ZWVuVGFnRGF0YVN0cmluZyA9IEJldHdlZW5UYWdEYXRhLmVxLCBvcHRpb25zPzogSnNjQ29uZmlnKSB7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAgICAgIGZpbGVuYW1lOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlTWFwcyxcbiAgICAgICAganNjOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IGVzVGFyZ2V0LFxuICAgICAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgICB9LFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgRGVjb3JhdG9ycyhBZGRPcHRpb25zLmpzYykucGFyc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICBzeW50YXg6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwiVFNPcHRpb25zXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMuanNjLnBhcnNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3ludGF4OiAnZWNtYXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgICAgIGpzeDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgICAgICBEZWNvcmF0b3JzKEFkZE9wdGlvbnMuanNjKS5wYXJzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ2VjbWFzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICBqc3g6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcIlRTWE9wdGlvbnNcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IG1hcCwgY29kZSB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhU3RyaW5nLCBBZGRPcHRpb25zKTtcblxuICAgICAgICByZXN1bHRDb2RlID0gY29kZTtcbiAgICAgICAgcmVzdWx0TWFwID0gbWFwO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cbiAgICByZXR1cm4geyByZXN1bHRDb2RlLCByZXN1bHRNYXAgfVxufSIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSwgSnNjQ29uZmlnIH0gZnJvbSAnQHN3Yy9jb3JlJztcblxuXG5leHBvcnQgY29uc3QgZXNUYXJnZXQgPSAnZXMyMDIyJztcblxuZXhwb3J0IGZ1bmN0aW9uIERlY29yYXRvcnMoZGF0YTogSnNjQ29uZmlnKXtcbiAgICBkYXRhLnRyYW5zZm9ybSA9IHtcbiAgICAgICAgbGVnYWN5RGVjb3JhdG9yOiB0cnVlLFxuICAgICAgICBkZWNvcmF0b3JNZXRhZGF0YTogdHJ1ZVxuICAgIH1cbiAgICBkYXRhLnBhcnNlci5kZWNvcmF0b3JzID0gdHJ1ZVxuICAgIHJldHVybiBkYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFuc2Zvcm1KU0MoZGF0YT86IEpzY0NvbmZpZyk6IEpzY0NvbmZpZ3tcbiAgICByZXR1cm4gRGVjb3JhdG9ycyh7XG4gICAgICAgIHRhcmdldDogZXNUYXJnZXQsXG4gICAgICAgIC4uLmRhdGFcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tbW9uanMoZGF0YTogVHJhbnNmb3JtT3B0aW9ucyl7XG4gICAgZGF0YS5tb2R1bGUgPSB7XG4gICAgICAgIHR5cGU6ICdjb21tb25qcycsXG4gICAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgICAgIHN0cmljdE1vZGU6IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgdHJhbnNwaWxlcldpdGhPcHRpb25zIH0gZnJvbSAnLi9sb2FkLW9wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IHtyZXN1bHRDb2RlLCByZXN1bHRNYXB9ID0gYXdhaXQgdHJhbnNwaWxlcldpdGhPcHRpb25zKEJldHdlZW5UYWdEYXRhLCBsYW5ndWFnZSwgZmFsc2UsIEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCB7cHJlc2VydmVBbGxDb21tZW50czogdHJ1ZX0pXG4gICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihyZXN1bHRDb2RlLCByZXN1bHRNYXApKTtcbiBcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgdHJhbnNwaWxlcldpdGhPcHRpb25zIH0gZnJvbSAnLi9sb2FkLW9wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLnBvcFN0cmluZygndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBjb25zdCB7cmVzdWx0Q29kZSwgcmVzdWx0TWFwfSA9IGF3YWl0IHRyYW5zcGlsZXJXaXRoT3B0aW9ucyhCZXR3ZWVuVGFnRGF0YSwgbGFuZ3VhZ2UsIHNlc3Npb25JbmZvLmRlYnVnKVxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZShpc01vZGVsID8gJ21vZHVsZScgOiAnc2NyaXB0JywgdGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdE1hcCkge1xuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoSlNPTi5wYXJzZShyZXN1bHRNYXApLCBCZXR3ZWVuVGFnRGF0YSwgcmVzdWx0Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFRleHQocmVzdWx0Q29kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBpZiAoZGF0YVRhZy5leGlzdHMoJ3NyYycpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke0JldHdlZW5UYWdEYXRhfTwvc2NyaXB0PmBcbiAgICAgICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnanMnKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKSB7XG4gICAgICAgIHJldHVybiBzY3JpcHRXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JpcHRXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdIDogZ2V0VHlwZXMubm9kZV9tb2R1bGVzWzBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKHVybCwgcGF0aFRvRmlsZVVSTChvcmlnaW5hbFBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFsnc2NzcycsICdzYXNzJ10uaW5jbHVkZXMobGFuZ3VhZ2UpID8gU29tZVBsdWdpbnMoXCJNaW5BbGxcIiwgXCJNaW5TYXNzXCIpIDogU29tZVBsdWdpbnMoXCJNaW5Dc3NcIiwgXCJNaW5BbGxcIikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3R5bGUobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPjxjb2xvcj4ke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzdHlsZScsIGRhdGFUYWcsICBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0Py5zb3VyY2VNYXApXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihTb3VyY2VNYXBTdG9yZS5maXhVUkxTb3VyY2VNYXAoPGFueT5yZXN1bHQuc291cmNlTWFwKSwgQmV0d2VlblRhZ0RhdGEsIG91dFN0eWxlKTtcbiAgICBlbHNlXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB7IHRleHQ6IG91dFN0eWxlIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc3R5bGVXaXRoU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzdHlsZVdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbGFuZycsICdjc3MnKTtcblxuICAgIGlmKGRhdGFUYWcucG9wQm9vbGVhbignc2VydmVyJykpe1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IHBhdGhfbm9kZS5qb2luKHNtYWxsUGF0aCwgJy8uLi8nLCBpbnB1dFBhdGgpO1xuICAgIH1cblxuICAgIGlmICghcGF0aF9ub2RlLmV4dG5hbWUoaW5wdXRQYXRoKSlcbiAgICAgICAgaW5wdXRQYXRoICs9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7IENvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkIH0gfSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdChcImZyb21cIik7XG5cbiAgICBjb25zdCBpblN0YXRpYyA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHNtYWxsUGF0aFRvUGFnZSh0eXBlLmV4dHJhY3RJbmZvKCkpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWMsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogPGNvbG9yPiR7dHlwZS5hdCgwKS5saW5lSW5mb30gLT4gJHtGdWxsUGF0aH1gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAncGFnZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgSlNQYXJzZXIucHJpbnRFcnJvcihgUGFnZSBub3QgZm91bmQ6ICR7QmFzaWNTZXR0aW5ncy5yZWxhdGl2ZSh0eXBlLmxpbmVJbmZvKX0gLT4gJHtTbWFsbFBhdGh9YCkpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtpblN0YXRpY107XG4gICAgaWYgKCFoYXZlQ2FjaGUgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKG51bGwsIGhhdmVDYWNoZS5uZXdTZXNzaW9uLmRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvOiBuZXdTZXNzaW9uIH0gPSBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShpblN0YXRpYywgZ2V0VHlwZXMuU3RhdGljLCB7IG5lc3RlZFBhZ2U6IHBhdGhOYW1lLCBuZXN0ZWRQYWdlRGF0YTogZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb2JqZWN0JykgfSk7XG4gICAgICAgIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzW1NtYWxsUGF0aF0gPSBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcy50aGlzUGFnZTtcbiAgICAgICAgZGVsZXRlIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBjYWNoZU1hcFtpblN0YXRpY10gPSB7IENvbXBpbGVkRGF0YTogPFN0cmluZ1RyYWNrZXI+Q29tcGlsZWREYXRhLCBuZXdTZXNzaW9uIH07XG4gICAgICAgIFJldHVybkRhdGEgPSA8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW2luU3RhdGljXTtcblxuICAgICAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMpO1xuICAgICAgICBzZXNzaW9uSW5mby5leHRlbmRzKG5ld1Nlc3Npb24pXG5cbiAgICAgICAgUmV0dXJuRGF0YSA9IENvbXBpbGVkRGF0YTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogUmV0dXJuRGF0YVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuL0Vhc3lGc1wiO1xuXG4vKiBJdCdzIGEgSlNPTiBmaWxlIG1hbmFnZXIgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlSlNPTiB7XG4gICAgcHJpdmF0ZSBzYXZlUGF0aDogc3RyaW5nO1xuICAgIHN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGF1dG9Mb2FkID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNhdmVQYXRoID0gYCR7U3lzdGVtRGF0YX0vJHtmaWxlUGF0aH0uanNvbmA7XG4gICAgICAgIGF1dG9Mb2FkICYmIHRoaXMubG9hZEZpbGUoKTtcblxuICAgICAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcHJvY2Vzcy5leGl0KCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkRmlsZSgpIHtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuc2F2ZVBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IEpTT04ucGFyc2UoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMuc2F2ZVBhdGgpIHx8ICd7fScpO1xuICAgIH1cblxuICAgIHVwZGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUga2V5IGlzIGluIHRoZSBzdG9yZSwgcmV0dXJuIHRoZSB2YWx1ZS4gSWYgbm90LCBjcmVhdGUgYSBuZXcgdmFsdWUsIHN0b3JlIGl0LCBhbmQgcmV0dXJuIGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gbG9vayB1cCBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIFtjcmVhdGVdIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdHJpbmcuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIG9mIHRoZSBrZXkgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIGhhdmUoa2V5OiBzdHJpbmcsIGNyZWF0ZT86ICgpID0+IHN0cmluZykge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RvcmVba2V5XTtcbiAgICAgICAgaWYgKGl0ZW0gfHwgIWNyZWF0ZSkgcmV0dXJuIGl0ZW07XG5cbiAgICAgICAgaXRlbSA9IGNyZWF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZShrZXksIGl0ZW0pO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdGhpcy5zdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVtpXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbaV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmUoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZSh0aGlzLnNhdmVQYXRoLCB0aGlzLnN0b3JlKTtcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4vU3RvcmVKU09OXCI7XG5cbmV4cG9ydCBjb25zdCBwYWdlRGVwcyA9IG5ldyBTdG9yZUpTT04oJ1BhZ2VzSW5mbycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYW55IG9mIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhlIHBhZ2UgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtTdHJpbmdOdW1iZXJNYXB9IGRlcGVuZGVuY2llcyAtIEEgbWFwIG9mIGRlcGVuZGVuY2llcy4gVGhlIGtleSBpcyB0aGUgcGF0aCB0byB0aGUgZmlsZSwgYW5kXG4gKiB0aGUgdmFsdWUgaXMgdGhlIGxhc3QgbW9kaWZpZWQgdGltZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOnN0cmluZywgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSBwYWdlRGVwcy5zdG9yZVtwYXRoXSkge1xuICAgIGZvciAoY29uc3QgaSBpbiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCAgKyAgKGkgPT0gJ3RoaXNQYWdlJyA/IHBhdGg6IGkpO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gZGVwZW5kZW5jaWVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gIWRlcGVuZGVuY2llcztcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcik6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvKTtcblxuICAgIGNvbXBpbGVkU3RyaW5nLlBsdXMkIGA8JXslPiR7QmV0d2VlblRhZ0RhdGF9PCV9JT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWdpc3RlckV4dGVuc2lvbiBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3Nzcic7XG5pbXBvcnQgeyByZWJ1aWxkRmlsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUsIHsgcmVzb2x2ZSwgY2xlYXJNb2R1bGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENhcGl0YWxpemUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuYXN5bmMgZnVuY3Rpb24gc3NySFRNTChkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBGdWxsUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZyxzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgZ2V0ViA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZ3YgPSAobmFtZTogc3RyaW5nKSA9PiBkYXRhVGFnLnBvcEFueURlZmF1bHQobmFtZSwnJykudHJpbSgpLFxuICAgICAgICAgICAgdmFsdWUgPSBndignc3NyJyArIENhcGl0YWxpemUobmFtZSkpIHx8IGd2KG5hbWUpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZSA/IGV2YWwoYCh7JHt2YWx1ZX19KWApIDoge307XG4gICAgfTtcbiAgICBjb25zdCBidWlsZFBhdGggPSBhd2FpdCByZWdpc3RlckV4dGVuc2lvbihGdWxsUGF0aCwgc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG4gICAgY29uc3QgbW9kZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShidWlsZFBhdGgpO1xuXG4gICAgY29uc3QgeyBodG1sLCBoZWFkIH0gPSBtb2RlLmRlZmF1bHQucmVuZGVyKGdldFYoJ3Byb3BzJyksIGdldFYoJ29wdGlvbnMnKSk7XG4gICAgc2Vzc2lvbkluZm8uaGVhZEhUTUwgKz0gaGVhZDtcbiAgICByZXR1cm4gaHRtbDtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IExhc3RTbWFsbFBhdGggPSB0eXBlLmV4dHJhY3RJbmZvKCksIExhc3RGdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgTGFzdFNtYWxsUGF0aDtcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKExhc3RGdWxsUGF0aCwgTGFzdFNtYWxsUGF0aCwgZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnZnJvbScpLCBnZXRUeXBlcy5TdGF0aWNbMl0sICdzdmVsdGUnKTtcbiAgICBjb25zdCBpbldlYlBhdGggPSByZWxhdGl2ZShnZXRUeXBlcy5TdGF0aWNbMl0sIFNtYWxsUGF0aCkucmVwbGFjZSgvXFxcXC9naSwgJy8nKTtcblxuICAgIHNlc3Npb25JbmZvLnN0eWxlKCcvJyArIGluV2ViUGF0aCArICcuY3NzJyk7XG5cbiAgICBjb25zdCBpZCA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnaWQnLCBCYXNlNjRJZChpbldlYlBhdGgpKSxcbiAgICAgICAgaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KG5hbWUsICcnKS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPyBgLCR7bmFtZX06eyR7dmFsdWV9fWAgOiAnJztcbiAgICAgICAgfSwgc2VsZWN0b3IgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdzZWxlY3RvcicpO1xuXG4gICAgY29uc3Qgc3NyID0gIXNlbGVjdG9yICYmIGRhdGFUYWcucG9wQm9vbGVhbignc3NyJykgPyBhd2FpdCBzc3JIVE1MKGRhdGFUYWcsIEZ1bGxQYXRoLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKSA6ICcnO1xuXG5cbiAgICBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ21vZHVsZScsIGRhdGFUYWcsIHR5cGUpLmFkZFRleHQoXG5gaW1wb3J0IEFwcCR7aWR9IGZyb20gJy8ke2luV2ViUGF0aH0nO1xuY29uc3QgdGFyZ2V0JHtpZH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiJHtzZWxlY3RvciA/IHNlbGVjdG9yIDogJyMnICsgaWR9XCIpO1xudGFyZ2V0JHtpZH0gJiYgbmV3IEFwcCR7aWR9KHtcbiAgICB0YXJnZXQ6IHRhcmdldCR7aWR9XG4gICAgJHtoYXZlKCdwcm9wcycpICsgaGF2ZSgnb3B0aW9ucycpfSR7c3NyID8gJywgaHlkcmF0ZTogdHJ1ZScgOiAnJ31cbn0pO2ApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHNlbGVjdG9yID8gJycgOiBgPGRpdiBpZD1cIiR7aWR9XCI+JHtzc3J9PC9kaXY+YCksXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUlkKHRleHQ6IHN0cmluZywgbWF4ID0gMTApe1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh0ZXh0KS50b1N0cmluZygnYmFzZTY0Jykuc3Vic3RyaW5nKDAsIG1heCkucmVwbGFjZSgvXFwrLywgJ18nKS5yZXBsYWNlKC9cXC8vLCAnXycpO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCAgeyBDYXBpdGFsaXplLCBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBDb21waWxlT3B0aW9ucyB9IGZyb20gXCJzdmVsdGUvdHlwZXMvY29tcGlsZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY2xlYXJNb2R1bGUsIHJlc29sdmUgfSBmcm9tIFwiLi4vLi4vcmVkaXJlY3RDSlNcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWdpc3RlckV4dGVuc2lvbihmaWxlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IG5hbWUgPSBwYXRoLnBhcnNlKGZpbGVQYXRoKS5uYW1lLnJlcGxhY2UoL15cXGQvLCAnXyQmJykucmVwbGFjZSgvW15hLXpBLVowLTlfJF0vZywgJycpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogQ29tcGlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgbmFtZTogQ2FwaXRhbGl6ZShuYW1lKSxcbiAgICAgICAgZ2VuZXJhdGU6ICdzc3InLFxuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBkZXY6IHNlc3Npb25JbmZvLmRlYnVnLFxuICAgICAgICBlcnJvck1vZGU6ICd3YXJuJ1xuICAgIH07XG5cbiAgICBjb25zdCBpblN0YXRpY0ZpbGUgPSBwYXRoLnJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgc21hbGxQYXRoKTtcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY0ZpbGU7XG5cbiAgICBjb25zdCBmdWxsSW1wb3J0UGF0aCA9IGZ1bGxDb21waWxlUGF0aCArICcuc3NyLmNqcyc7XG4gICAgY29uc3Qge3N2ZWx0ZUZpbGVzLCBjb2RlLCBtYXAsIGRlcGVuZGVuY2llc30gPSBhd2FpdCBwcmVwcm9jZXNzKGZpbGVQYXRoLCBzbWFsbFBhdGgsZnVsbEltcG9ydFBhdGgsZmFsc2UsJy5zc3IuY2pzJyk7XG4gICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsZGVwZW5kZW5jaWVzKTtcbiAgICBvcHRpb25zLnNvdXJjZW1hcCA9IG1hcDtcblxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgZm9yKGNvbnN0IGZpbGUgb2Ygc3ZlbHRlRmlsZXMpe1xuICAgICAgICBjbGVhck1vZHVsZShyZXNvbHZlKGZpbGUpKTsgLy8gZGVsZXRlIG9sZCBpbXBvcnRzXG4gICAgICAgIHByb21pc2VzLnB1c2gocmVnaXN0ZXJFeHRlbnNpb24oZmlsZSwgQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlKSwgc2Vzc2lvbkluZm8pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBjb25zdCB7IGpzLCBjc3MsIHdhcm5pbmdzIH0gPSBzdmVsdGUuY29tcGlsZShjb2RlLCA8YW55Pm9wdGlvbnMpO1xuICAgIFByaW50U3ZlbHRlV2Fybih3YXJuaW5ncywgZmlsZVBhdGgsIG1hcCk7XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSAnLycgKyBpblN0YXRpY0ZpbGUuc3BsaXQoL1xcL3xcXC8vKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiBmdWxsSW1wb3J0UGF0aDtcbn1cbiIsICJpbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgZXh0bmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgY3JlYXRlSW1wb3J0ZXIsIFByaW50U2Fzc0Vycm9yVHJhY2tlciwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwsIGJhY2tUb09yaWdpbmFsU3NzIH0gZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IHsgVHJhbnNmb3JtSlNDIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5ncyc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBhd2FpdCBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsPGFueT4gc291cmNlTWFwLCBzb3VyY2VNYXAuc291cmNlcy5maW5kKHggPT4geC5zdGFydHNXaXRoKCdkYXRhOicpKSksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydFsgXSp0eXBlfGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgaWYobGFuZyA9PSAndHMnICYmIGFyZ3NbNV0uZW5kc1dpdGgoJyB0eXBlJykpXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoYXJnc1sxMF0uZXEpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJycpXG4gICAgICAgICAgICBpZiAobGFuZyA9PSAndHMnKVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy50cycpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy5qcycpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGFyZ3NbMV0uUGx1cyhhcmdzWzldLCBhcmdzWzEwXSwgKGV4dCA9PSAnLnN2ZWx0ZScgPyBzdmVsdGVFeHQgOiAnJyksIGFyZ3NbOV0sIChhcmdzWzExXSA/PyAnJykpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJy5zdmVsdGUnKSB7XG4gICAgICAgICAgICBjb25uZWN0U3ZlbHRlLnB1c2goYXJnc1sxMF0uZXEpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhbmcgIT09ICd0cycgfHwgIWFyZ3NbNF0pXG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcblxuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgbWFwVG9rZW5baWRdID0gbmV3RGF0YTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYF9fX3RvS2VuXFxgJHtpZH1cXGBgKTtcbiAgICB9KTtcblxuICAgIGlmIChsYW5nICE9PSAndHMnKVxuICAgICAgICByZXR1cm4gY29udGVudDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSAoYXdhaXQgdHJhbnNmb3JtKGNvbnRlbnQuZXEsIHsgXG4gICAgICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICAgICAgcGFyc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ3R5cGVzY3JpcHQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzb3VyY2VNYXBzOiB0cnVlLFxuICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgXG4gICAgfSkpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgYmFja1RvT3JpZ2luYWwoY29udGVudCwgY29kZSwgbWFwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGNvbnRlbnQsIGVycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgfVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoL19fX3RvS2VuYChbXFx3XFxXXSs/KWAvbWksIGFyZ3MgPT4ge1xuICAgICAgICByZXR1cm4gbWFwVG9rZW5bYXJnc1sxXS5lcV0gPz8gbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzYXZlUGF0aCA9IHNtYWxsUGF0aCwgaHR0cFNvdXJjZSA9IHRydWUsIHN2ZWx0ZUV4dCA9ICcnKSB7ICAgIFxuICAgIGxldCB0ZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoc21hbGxQYXRoLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGxldCBzY3JpcHRMYW5nID0gJ2pzJywgc3R5bGVMYW5nID0gJ2Nzcyc7XG5cbiAgICBjb25zdCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSA9IFtdLCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzY3JpcHQpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHNjcmlwdExhbmcgPSBhcmdzWzRdPy5lcSA/PyAnanMnO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGF3YWl0IFNjcmlwdFN2ZWx0ZShhcmdzWzddLCBzY3JpcHRMYW5nLCBjb25uZWN0U3ZlbHRlLCBzdmVsdGVFeHQpLCBhcmdzWzhdKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0eWxlQ29kZSA9IGNvbm5lY3RTdmVsdGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuICAgIGxldCBoYWRTdHlsZSA9IGZhbHNlO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c3R5bGUpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGlmKHN0eWxlTGFuZyA9PSAnY3NzJykgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llczogZGVwcyB9ID0gYXdhaXQgU0FTU1N2ZWx0ZShhcmdzWzddLCBzdHlsZUxhbmcsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgc2NyaXB0TGFuZywgc3R5bGVMYW5nLCBjb2RlOiB0ZXh0LmVxLCBtYXA6IHRleHQuU3RyaW5nVGFjayhzYXZlUGF0aCwgaHR0cFNvdXJjZSksIGRlcGVuZGVuY2llczogc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBzdmVsdGVGaWxlczogY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiB4WzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1swXSArIHggOiBwYXRoLm5vcm1hbGl6ZShmdWxsUGF0aCArICcvLi4vJyArIHgpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuIiwgImltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSAnLi9FYXN5U3ludGF4JztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBDb21tb25qcywgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoL3dpbjMyJztcblxuZnVuY3Rpb24gRXJyb3JUZW1wbGF0ZShpbmZvOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBgbW9kdWxlLmV4cG9ydHMgPSAoKSA9PiAoRGF0YU9iamVjdCkgPT4gRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFxcYCR7SlNQYXJzZXIucHJpbnRFcnJvcihgU3ludGF4IEVycm9yOiAke2luZm99fWApfVxcYGA7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdGV4dCBcbiAqIEBwYXJhbSB0eXBlIFxuICogQHJldHVybnMgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgIHRleHQgPSB0ZXh0LnRyaW0oKTtcblxuICAgIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAgICAgIGpzYzogVHJhbnNmb3JtSlNDKHtcbiAgICAgICAgICAgIHBhcnNlcjoge1xuICAgICAgICAgICAgICAgIHN5bnRheDogaXNUeXBlc2NyaXB0ID8gJ3R5cGVzY3JpcHQnIDogJ2VjbWFzY3JpcHQnLFxuICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbigoaXNUeXBlc2NyaXB0ID8gJ1RTJyA6ICdKUycpICsgXCJPcHRpb25zXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmaWxlbmFtZTogc2Vzc2lvbkluZm8uc21hbGxQYXRoLFxuICAgICAgICBzb3VyY2VNYXBzOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0OiBTdHJpbmdUcmFja2VyXG5cbiAgICBjb25zdCBzY3JpcHREZWZpbmUgPSBhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxLCB7IGRlYnVnOiAnJyArIHNlc3Npb25JbmZvLmRlYnVnIH0pO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oc2NyaXB0RGVmaW5lLCBPcHRpb25zKTtcbiAgICAgICAgcmVzdWx0ID0gbWFwID8gYXdhaXQgYmFja1RvT3JpZ2luYWwodGV4dCwgY29kZSwgbWFwKSA6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBwYXJzZSA9IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcih0ZXh0LCBlcnIpO1xuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgcGFyc2UuZXJyb3JGaWxlID0gIEJhc2ljU2V0dGluZ3MucmVsYXRpdmUocGFyc2UuZXJyb3JGaWxlKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZShwYXJzZS5zaW1wbGVNZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIEVhc3lGcy5yZWFkSnNvbkZpbGUocGF0aCk7XG59IiwgImltcG9ydCB7IHByb21pc2VzIH0gZnJvbSBcImZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3YXNtTW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShhd2FpdCBwcm9taXNlcy5yZWFkRmlsZShwYXRoKSk7XG4gICAgY29uc3Qgd2FzbUluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKHdhc21Nb2R1bGUsIHt9KTtcbiAgICByZXR1cm4gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG59IiwgImltcG9ydCBqc29uIGZyb20gXCIuL2pzb25cIjtcbmltcG9ydCB3YXNtIGZyb20gXCIuL3dhc21cIjtcblxuZXhwb3J0IGNvbnN0IGN1c3RvbVR5cGVzID0gW1wianNvblwiLCBcIndhc21cIl07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEltcG9ydEJ5RXh0ZW5zaW9uKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKXtcbiAgICBzd2l0Y2godHlwZSl7XG4gICAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgICAgICByZXR1cm4ganNvbihwYXRoKVxuICAgICAgICBjYXNlIFwid2FzbVwiOlxuICAgICAgICAgICAgcmV0dXJuIHdhc20ocGF0aCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0KHBhdGgpXG4gICAgfVxufSIsICJpbXBvcnQgeyBjdXN0b21UeXBlcyB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vaW5kZXgnO1xuaW1wb3J0IHsgQmFzZVJlYWRlciB9IGZyb20gJy4uL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IEVuZE9mQmxvY2ssIEVuZE9mRGVmU2tpcEJsb2NrLCBQYXJzZVRleHRTdHJlYW0sIFJlQnVpbGRDb2RlU3RyaW5nIH0gZnJvbSAnLi9FYXN5U2NyaXB0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFzeVN5bnRheCB7XG4gICAgcHJpdmF0ZSBCdWlsZDogUmVCdWlsZENvZGVTdHJpbmc7XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJzZUFycmF5ID0gYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGNvZGUpO1xuICAgICAgICB0aGlzLkJ1aWxkID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKHBhcnNlQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0ID0gdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgY29uc3QgJHtkYXRhT2JqZWN0fSA9IGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydChyZXBsYWNlVG9UeXBlLCBkYXRhT2JqZWN0LCBpbmRleCl9O09iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtkYXRhT2JqZWN0fSlgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbChyZXBsYWNlVG9UeXBlLCBpbmRleCl9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEltcG9ydFR5cGUodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAoYCR7dHlwZX1bIFxcXFxuXSsoW1xcXFwqXXswLDF9W1xcXFxwe0x9MC05XyxcXFxce1xcXFx9IFxcXFxuXSspWyBcXFxcbl0rZnJvbVsgXFxcXG5dKzxcXFxcfChbMC05XSspXFxcXHxcXFxcfD5gLCAndScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtYXRjaFsxXS50cmltKCk7XG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgbGV0IERhdGFPYmplY3Q6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGRhdGEuc3Vic3RyaW5nKDEpLnJlcGxhY2UoJyBhcyAnLCAnJykudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBTcGxpY2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWQgPSBkYXRhLnNwbGl0KCd9JywgMik7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMF0gKz0gJ30nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMV0gPSBTcGxpY2VkWzFdLnNwbGl0KCcsJykucG9wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJywnLCAxKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgU3BsaWNlZCA9IFNwbGljZWQubWFwKHggPT4geC50cmltKCkpLmZpbHRlcih4ID0+IHgubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzBdWzBdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gdGhpcy5CdWlsZC5BbGxJbnB1dHNbbWF0Y2hbMl1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnN1YnN0cmluZyhleHRlbnNpb24ubGFzdEluZGV4T2YoJy4nKSArIDEsIGV4dGVuc2lvbi5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBge2RlZmF1bHQ6JHtTcGxpY2VkWzBdfX1gOyAvL29ubHkgaWYgdGhpcyBpc24ndCBjdXN0b20gaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBgJHtEYXRhT2JqZWN0LnN1YnN0cmluZygwLCBEYXRhT2JqZWN0Lmxlbmd0aCAtIDEpfSxkZWZhdWx0OiR7U3BsaWNlZFsxXX19YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gRGF0YU9iamVjdC5yZXBsYWNlKC8gYXMgLywgJzonKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBEYXRhT2JqZWN0LCBtYXRjaFsyXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbk9uZVdvcmQodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSA9PiBzdHJpbmcgPSB0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbCkge1xuICAgICAgICBsZXQgYmVmb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaChuZXcgUmVnRXhwKHR5cGUgKyAnWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG5cbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBhY3Rpb25TdHJpbmcocmVwbGFjZVRvVHlwZSwgbWF0Y2hbMV0pO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nO1xuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGJlZm9yZVN0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoU3BhY2UoZnVuYzogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGZ1bmMoJyAnICsgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0KS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBEZWZpbmUoZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke2tleX0oW15cXFxccHtMfV0pYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB2YWx1ZSArIG1hdGNoWzJdXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW5Bc0Z1bmN0aW9uKHdvcmQ6IHN0cmluZywgdG9Xb3JkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke3dvcmR9KFsgXFxcXG5dKlxcXFwoKWAsICdndWknKSwgKC4uLm1hdGNoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB0b1dvcmQgKyBtYXRjaFsyXVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRWYXJpYWJsZSgpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykodmFyfGxldHxjb25zdClbIFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopL3UpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgYmVmb3JlTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBjbG9zZUluZGV4ID0gYXdhaXQgRW5kT2ZEZWZTa2lwQmxvY2soYWZ0ZXJNYXRjaCxbJzsnLCAnXFxuJ10pO1xuXG4gICAgICAgICAgICBpZihjbG9zZUluZGV4ID09IC0xKXtcbiAgICAgICAgICAgICAgICBjbG9zZUluZGV4ID0gYWZ0ZXJNYXRjaC5sZW5ndGhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYmVmb3JlQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBjbG9zZUluZGV4KSwgYWZ0ZXJDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKGNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9O2V4cG9ydHMuJHttYXRjaFszXX09JHttYXRjaFszXX0ke2FmdGVyQ2xvc2V9YDtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwb3J0QmxvY2soKXtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaCgvKGV4cG9ydFsgXFxuXSspKGRlZmF1bHRbIFxcbl0rKT8oW14gXFxuXSkvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBsZXQgYmVmb3JlTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIGxldCByZW1vdmVFeHBvcnQgPSBtYXRjaFswXS5zdWJzdHJpbmcobWF0Y2hbMV0ubGVuZ3RoICsgKG1hdGNoWzJdIHx8ICcnKS5sZW5ndGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IG1hdGNoWzNdWzBdLCBpc0RlZmF1bHQgPSBCb29sZWFuKG1hdGNoWzJdKTtcbiAgICAgICAgICAgIGlmKGZpcnN0Q2hhcj09ICd7Jyl7XG4gICAgICAgICAgICAgICAgbGV0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmKGlzRGVmYXVsdCl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgJ2V4cG9ydHMuZGVmYXVsdD0nICsgcmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IGF3YWl0IEVuZE9mQmxvY2soYWZ0ZXJNYXRjaCwgWyd7JywgJ30nXSk7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZU1hdGNoICs9IGBPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7cmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgrMSl9KWA7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoZW5kSW5kZXgrMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgtMSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRXhwb3J0ID0gcmVtb3ZlRXhwb3J0LnNsaWNlKDAsIC0xKTtcblxuICAgICAgICAgICAgICAgIGxldCBjbG9zZUluZGV4ID0gYXdhaXQgRW5kT2ZEZWZTa2lwQmxvY2soYWZ0ZXJNYXRjaCxbJzsnLCAnXFxuJ10pO1xuICAgICAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUluZGV4ID0gYWZ0ZXJNYXRjaC50cmltRW5kKCkubGVuZ3RoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYmVmb3JlQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBjbG9zZUluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9ja01hdGNoID0gYmVmb3JlQ2xvc2UubWF0Y2goLyhmdW5jdGlvbnxjbGFzcylbIHxcXG5dKyhbXFxwe0x9XFwkX11bXFxwe0x9MC05XFwkX10qKT8vdSk7XG5cbiAgICAgICAgICAgICAgICBpZihibG9ja01hdGNoPy5bMl0peyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKGNsb3NlSW5kZXgpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2ggKyByZW1vdmVFeHBvcnQrIGJlZm9yZUNsb3NlfWV4cG9ydHMuJHtpc0RlZmF1bHQgPyAnZGVmYXVsdCc6IGJsb2NrTWF0Y2hbMl19PSR7YmxvY2tNYXRjaFsyXX0ke2FmdGVyQ2xvc2V9YDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNofWV4cG9ydHMuJHtiZWZvcmVDbG9zZS5zcGxpdCgvIHxcXG4vLCAxKS5wb3AoKX09JHtyZW1vdmVFeHBvcnQrIGFmdGVyTWF0Y2h9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEltcG9ydHMoZGVmaW5lRGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0KTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2luY2x1ZGUnKTtcblxuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsKTtcbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbkFzRnVuY3Rpb24oJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG5cbiAgICAgICAgLy9lc20gdG8gY2pzIC0gZXhwb3J0XG4gICAgICAgIGF3YWl0IHRoaXMuZXhwb3J0VmFyaWFibGUoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRCbG9jaygpO1xuXG4gICAgICAgIGRlZmluZURhdGEgJiYgdGhpcy5EZWZpbmUoZGVmaW5lRGF0YSk7XG4gICAgfVxuXG4gICAgQnVpbHRTdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkJ1aWxkLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZTogc3RyaW5nLCBkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IEVhc3lTeW50YXgoKTtcbiAgICAgICAgYXdhaXQgYnVpbGRlci5sb2FkKGAgJHtjb2RlfSBgKTtcbiAgICAgICAgYXdhaXQgYnVpbGRlci5CdWlsZEltcG9ydHMoZGVmaW5lRGF0YSk7XG5cbiAgICAgICAgY29kZSA9IGJ1aWxkZXIuQnVpbHRTdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIGNvZGUuc3Vic3RyaW5nKDEsIGNvZGUubGVuZ3RoIC0gMSk7XG4gICAgfVxufSIsICJpbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZVwiO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwLCBTdHJpbmdNYXAsIFN0cmluZ051bWJlck1hcCwgIH0gZnJvbSBcIi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBpc1RzIH0gZnJvbSBcIi4vSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSBcIi4vdHJhbnNmb3JtL1NjcmlwdFwiO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSBcIi4vWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyXCI7XG5cblxuZXhwb3J0IHR5cGUgc2V0RGF0YUhUTUxUYWcgPSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcFxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JJbmZvID0ge1xuICAgIHR5cGU6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgc2VuZFRvOiBzdHJpbmcsXG4gICAgdmFsaWRhdG9yOiBzdHJpbmdbXSxcbiAgICBvcmRlcj86IHN0cmluZ1tdLFxuICAgIG5vdFZhbGlkPzogc3RyaW5nLFxuICAgIG1lc3NhZ2U/OiBzdHJpbmcgfCBib29sZWFuLFxuICAgIHJlc3BvbnNlU2FmZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgY29ubmVjdG9yQXJyYXkgPSBjb25uZWN0b3JJbmZvW11cblxuZXhwb3J0IHR5cGUgY2FjaGVDb21wb25lbnQgPSB7XG4gICAgW2tleTogc3RyaW5nXTogbnVsbCB8IHtcbiAgICAgICAgbXRpbWVNcz86IG51bWJlcixcbiAgICAgICAgdmFsdWU/OiBzdHJpbmdcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIGluVGFnQ2FjaGUgPSB7XG4gICAgc3R5bGU6IHN0cmluZ1tdXG4gICAgc2NyaXB0OiBzdHJpbmdbXVxuICAgIHNjcmlwdE1vZHVsZTogc3RyaW5nW11cbn1cblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU2hvcnRTY3JpcHROYW1lcycpO1xuXG4vKiBUaGUgU2Vzc2lvbkJ1aWxkIGNsYXNzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGhlYWQgb2YgdGhlIHBhZ2UgKi9cbmV4cG9ydCBjbGFzcyBTZXNzaW9uQnVpbGQge1xuICAgIGNvbm5lY3RvckFycmF5OiBjb25uZWN0b3JBcnJheSA9IFtdXG4gICAgcHJpdmF0ZSBzY3JpcHRVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgc3R5bGVVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgaW5TY3JpcHRTdHlsZTogeyB0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgcGF0aDogc3RyaW5nLCB2YWx1ZTogU291cmNlTWFwU3RvcmUgfVtdID0gW11cbiAgICBoZWFkSFRNTCA9ICcnXG4gICAgY2FjaGU6IGluVGFnQ2FjaGUgPSB7XG4gICAgICAgIHN0eWxlOiBbXSxcbiAgICAgICAgc2NyaXB0OiBbXSxcbiAgICAgICAgc2NyaXB0TW9kdWxlOiBbXVxuICAgIH1cbiAgICBjYWNoZUNvbXBpbGVTY3JpcHQ6IGFueSA9IHt9XG4gICAgY2FjaGVDb21wb25lbnQ6IGNhY2hlQ29tcG9uZW50ID0ge31cbiAgICBjb21waWxlUnVuVGltZVN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fVxuICAgIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0ge31cbiAgICByZWNvcmROYW1lczogc3RyaW5nW10gPSBbXVxuXG4gICAgZ2V0IHNhZmVEZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWcgJiYgdGhpcy5fc2FmZURlYnVnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGZ1bGxQYXRoOiBzdHJpbmcsIHB1YmxpYyB0eXBlTmFtZT86IHN0cmluZywgcHVibGljIGRlYnVnPzogYm9vbGVhbiwgcHJpdmF0ZSBfc2FmZURlYnVnPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zID0gdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHN0eWxlKHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlVVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHNjcmlwdCh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zY3JpcHRVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHJlY29yZChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKG5hbWUpKVxuICAgICAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcGVuZGVuY2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0pIHJldHVybjtcblxuICAgICAgICBjb25zdCBoYXZlRGVwID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdDtcbiAgICAgICAgaWYgKGhhdmVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0gPSBoYXZlRGVwXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBzbWFsbFBhdGggPSB0aGlzLnNtYWxsUGF0aCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuaW5TY3JpcHRTdHlsZS5maW5kKHggPT4geC50eXBlID09IHR5cGUgJiYgeC5wYXRoID09IHNtYWxsUGF0aCk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IHsgdHlwZSwgcGF0aDogc21hbGxQYXRoLCB2YWx1ZTogbmV3IFNvdXJjZU1hcFN0b3JlKHNtYWxsUGF0aCwgdGhpcy5zYWZlRGVidWcsIHR5cGUgPT0gJ3N0eWxlJywgdHJ1ZSkgfVxuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS52YWx1ZVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlUGFnZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgaW5mbzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY3JpcHRTdHlsZSh0eXBlLCBkYXRhVGFnLnBvcFN0cmluZygncGFnZScpID8gdGhpcy5zbWFsbFBhdGggOiBpbmZvLmV4dHJhY3RJbmZvKCkpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlTmFtZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGxldCBrZXk6IHN0cmluZztcblxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKFN0YXRpY0ZpbGVzSW5mby5zdG9yZSk7XG4gICAgICAgIHdoaWxlIChrZXkgPT0gbnVsbCB8fCB2YWx1ZXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAga2V5ID0gQmFzZTY0SWQodGV4dCwgNSArIGxlbmd0aCkuc3Vic3RyaW5nKGxlbmd0aCk7XG4gICAgICAgICAgICBsZW5ndGgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRIZWFkVGFncygpIHtcbiAgICAgICAgY29uc3QgcGFnZUxvZyA9IHRoaXMudHlwZU5hbWUgPT0gZ2V0VHlwZXMuTG9nc1syXVxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5pblNjcmlwdFN0eWxlKSB7XG4gICAgICAgICAgICBjb25zdCBpc0xvZyA9IHBhZ2VMb2cgJiYgaS5wYXRoID09IHRoaXMuc21hbGxQYXRoO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUxvY2F0aW9uID0gaXNMb2cgPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdLCBhZGRRdWVyeSA9IGlzTG9nID8gJz90PWwnIDogJyc7XG4gICAgICAgICAgICBsZXQgdXJsID0gU3RhdGljRmlsZXNJbmZvLmhhdmUoaS5wYXRoLCAoKSA9PiBTZXNzaW9uQnVpbGQuY3JlYXRlTmFtZShpLnBhdGgpKSArICcucHViJztcblxuICAgICAgICAgICAgc3dpdGNoIChpLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IGRlZmVyOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLm1qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IHR5cGU6ICdtb2R1bGUnIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0eWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuY3NzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZSgnLycgKyB1cmwgKyBhZGRRdWVyeSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEVhc3lGcy53cml0ZUZpbGUoc2F2ZUxvY2F0aW9uICsgdXJsLCBhd2FpdCBpLnZhbHVlLmNyZWF0ZURhdGFXaXRoTWFwKCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBidWlsZEhlYWQoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRkSGVhZFRhZ3MoKTtcblxuICAgICAgICBjb25zdCBtYWtlQXR0cmlidXRlcyA9IChpOiBzZXREYXRhSFRNTFRhZykgPT4gaS5hdHRyaWJ1dGVzID8gJyAnICsgT2JqZWN0LmtleXMoaS5hdHRyaWJ1dGVzKS5tYXAoeCA9PiBpLmF0dHJpYnV0ZXNbeF0gPyB4ICsgYD1cIiR7aS5hdHRyaWJ1dGVzW3hdfVwiYCA6IHgpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgICAgIGxldCBidWlsZEJ1bmRsZVN0cmluZyA9ICcnOyAvLyBhZGQgc2NyaXB0cyBhZGQgY3NzXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnN0eWxlVVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtpLnVybH1cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Lz5gO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zY3JpcHRVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPHNjcmlwdCBzcmM9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0+PC9zY3JpcHQ+YDtcblxuICAgICAgICByZXR1cm4gYnVpbGRCdW5kbGVTdHJpbmcgKyB0aGlzLmhlYWRIVE1MO1xuICAgIH1cblxuICAgIGV4dGVuZHMoZnJvbTogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yQXJyYXkucHVzaCguLi5mcm9tLmNvbm5lY3RvckFycmF5KTtcbiAgICAgICAgdGhpcy5zY3JpcHRVUkxTZXQucHVzaCguLi5mcm9tLnNjcmlwdFVSTFNldCk7XG4gICAgICAgIHRoaXMuc3R5bGVVUkxTZXQucHVzaCguLi5mcm9tLnN0eWxlVVJMU2V0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZnJvbS5pblNjcmlwdFN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaCh7IC4uLmksIHZhbHVlOiBpLnZhbHVlLmNsb25lKCkgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcHlPYmplY3RzID0gWydjYWNoZUNvbXBpbGVTY3JpcHQnLCAnY2FjaGVDb21wb25lbnQnLCAnZGVwZW5kZW5jaWVzJ107XG5cbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNvcHlPYmplY3RzKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXNbY10sIGZyb21bY10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKC4uLmZyb20ucmVjb3JkTmFtZXMuZmlsdGVyKHggPT4gIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMoeCkpKTtcblxuICAgICAgICB0aGlzLmhlYWRIVE1MICs9IGZyb20uaGVhZEhUTUw7XG4gICAgICAgIHRoaXMuY2FjaGUuc3R5bGUucHVzaCguLi5mcm9tLmNhY2hlLnN0eWxlKTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHQucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdCk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0TW9kdWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHRNb2R1bGUpO1xuICAgIH1cblxuICAgIC8vYmFzaWMgbWV0aG9kc1xuICAgIEJ1aWxkU2NyaXB0V2l0aFByYW1zKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGNvZGUsIGlzVHMoKSwgdGhpcyk7XG4gICAgfVxufSIsICIvLyBAdHMtbm9jaGVja1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgY2xlYXJNb2R1bGUgZnJvbSAnY2xlYXItbW9kdWxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpLCByZXNvbHZlID0gKHBhdGg6IHN0cmluZykgPT4gcmVxdWlyZS5yZXNvbHZlKHBhdGgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGZpbGVQYXRoID0gcGF0aC5ub3JtYWxpemUoZmlsZVBhdGgpO1xuXG4gICAgY29uc3QgbW9kdWxlID0gcmVxdWlyZShmaWxlUGF0aCk7XG4gICAgY2xlYXJNb2R1bGUoZmlsZVBhdGgpO1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn1cblxuZXhwb3J0IHtcbiAgICBjbGVhck1vZHVsZSxcbiAgICByZXNvbHZlXG59IiwgImltcG9ydCB7IFdhcm5pbmcgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0xvZ2dlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuY2xhc3MgcmVMb2NhdGlvbiB7XG4gICAgbWFwOiBQcm9taXNlPFNvdXJjZU1hcENvbnN1bWVyPlxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZU1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIH1cblxuICAgIGFzeW5jIGdldExvY2F0aW9uKGxvY2F0aW9uOiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn0pe1xuICAgICAgICBjb25zdCB7bGluZSwgY29sdW1ufSA9IChhd2FpdCB0aGlzLm1hcCkub3JpZ2luYWxQb3NpdGlvbkZvcihsb2NhdGlvbilcbiAgICAgICAgcmV0dXJuIGAke2xpbmV9OiR7Y29sdW1ufWA7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVFcnJvcih7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9OiBXYXJuaW5nLCBmaWxlUGF0aDogc3RyaW5nLCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IGZpbmRMb2NhdGlvbiA9IG5ldyByZUxvY2F0aW9uKHNvdXJjZU1hcClcbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfTxjb2xvcj4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX08Y29sb3I+JHtmaWxlUGF0aH06JHthd2FpdCBmaW5kTG9jYXRpb24uZ2V0TG9jYXRpb24oc3RhcnQpfWBcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgaGxqcyBmcm9tICdoaWdobGlnaHQuanMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZnVuY3Rpb24gY29kZVdpdGhDb3B5KG1kOiBhbnksIGljb246IHN0cmluZykge1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZShvcmlnUnVsZTogYW55KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdSZW5kZXJlZCA9IG9yaWdSdWxlKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY29kZS1jb3B5XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb3B5LWNsaXBib2FyZFwiIG9uY2xpY2s9XCJtYXJrZG93bkNvcHkodGhpcylcIj4ke2ljb259PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICR7b3JpZ1JlbmRlcmVkfVxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayk7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbWFya0Rvd25QbHVnaW4gPSBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKCdtYXJrZG93bicpO1xuXG4gICAgXG4gICAgY29uc3QgaGxqc0NsYXNzID1kYXRhVGFnLnBvcEJvb2xlYW4oJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBkYXRhVGFnLnBvcEJvb2xlYW4oJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSksXG4gICAgICAgIGJyZWFrczogZGF0YVRhZy5wb3BCb29sZWFuKCdicmVha3MnLCBtYXJrRG93blBsdWdpbj8uYnJlYWtzID8/IHRydWUpLFxuICAgICAgICB0eXBvZ3JhcGhlcjogZGF0YVRhZy5wb3BCb29sZWFuKCd0eXBvZ3JhcGhlcicsIG1hcmtEb3duUGx1Z2luPy50eXBvZ3JhcGhlciA/PyB0cnVlKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWFya2Rvd24tcGFyc2VyJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb3B5ID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdjb3B5LWNvZGUnLCBtYXJrRG93blBsdWdpbj8uY29weUNvZGUgPz8gJ1x1RDgzRFx1RENDQicpO1xuICAgIGlmIChjb3B5KVxuICAgICAgICBtZC51c2UoKG06YW55KT0+IGNvZGVXaXRoQ29weShtLCBjb3B5KSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ2F0dHJzJywgbWFya0Rvd25QbHVnaW4/LmF0dHJzID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEF0dHJzKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ2FiYnInLCBtYXJrRG93blBsdWdpbj8uYWJiciA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBYmJyKTtcblxuICAgIGxldCBtYXJrZG93bkNvZGUgPSBCZXR3ZWVuVGFnRGF0YT8uZXEgfHwgJyc7XG4gICAgY29uc3QgbG9jYXRpb24gPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2ZpbGUnLCAnLi9tYXJrZG93bicpO1xuXG4gICAgaWYgKCFtYXJrZG93bkNvZGU/LnRyaW0/LigpICYmIGxvY2F0aW9uKSB7XG4gICAgICAgIGxldCBmaWxlUGF0aCA9IGxvY2F0aW9uWzBdID09ICcvJyA/IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMl0sIGxvY2F0aW9uKTogcGF0aC5qb2luKHBhdGguZGlybmFtZSh0eXBlLmV4dHJhY3RJbmZvKCc8bGluZT4nKSksIGxvY2F0aW9uKTtcbiAgICAgICAgaWYgKCFwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKVxuICAgICAgICAgICAgZmlsZVBhdGggKz0gJy5zZXJ2Lm1kJ1xuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgICBtYXJrZG93bkNvZGUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpOyAvL2dldCBtYXJrZG93biBmcm9tIGZpbGVcbiAgICAgICAgYXdhaXQgc2Vzc2lvbi5kZXBlbmRlbmNlKGZpbGVQYXRoLCBmdWxsUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJIVE1MID0gbWQucmVuZGVyKG1hcmtkb3duQ29kZSksIGJ1aWxkSFRNTCA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgY3JlYXRlQXV0b1RoZW1lKGRhdGFUYWcucG9wU3RyaW5nKCdjb2RlLXRoZW1lJykgfHwgbWFya0Rvd25QbHVnaW4/LmNvZGVUaGVtZSB8fCAnYXRvbS1vbmUnKTtcblxuICAgIGlmIChoYXZlSGlnaGxpZ2h0KSB7XG4gICAgICAgIGlmKHRoZW1lICE9ICdub25lJyl7XG4gICAgICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICAgICAgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKTtcbiAgICAgICAgfVxuICAgICAgICBpZihjb3B5KXtcbiAgICAgICAgICAgIHNlc3Npb24uc2NyaXB0KCcvc2Vydi9tZC5qcycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGF0YVRhZy5hZGRDbGFzcygnbWFya2Rvd24tYm9keScpO1xuXG4gICAgY29uc3Qgc3R5bGUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3RoZW1lJywgIG1hcmtEb3duUGx1Z2luPy50aGVtZSA/PyAnYXV0bycpO1xuICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvdGhlbWUvJyArIHN0eWxlICsgJy5jc3MnO1xuICAgIHN0eWxlICE9ICdub25lJyAmJiBzZXNzaW9uLnN0eWxlKGNzc0xpbmspXG5cbiAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZW5kZXJIVE1MfTwvZGl2PmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogYnVpbGRIVE1MLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5jb25zdCB0aGVtZUFycmF5ID0gWycnLCAnLWRhcmsnLCAnLWxpZ2h0J107XG5jb25zdCB0aGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bic7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5TWFya2Rvd25UaGVtZSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgb2YgdGhlbWVBcnJheSkge1xuICAgICAgICBjb25zdCBtaW5pID0gKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGVtZVBhdGggKyBpICsgJy5jc3MnKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxuXFwubWFya2Rvd24tYm9keSB7KXwoXi5tYXJrZG93bi1ib2R5IHspL2dtLCAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCArICdwYWRkaW5nOjIwcHg7J1xuICAgICAgICAgICAgfSkgKyBgXG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdj5he1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDI1cHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgICAgICBib3R0b206IC03cHg7ICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk6aG92ZXI+ZGl2IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiBhOmZvY3VzIHtcbiAgICAgICAgICAgICAgICBjb2xvcjojNmJiODZhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBgO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgLCBzZXREYXRhSFRNTFRhZ30gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxoZWFkJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgIH1ARGVmYXVsdEluc2VydEJ1bmRsZTwvaGVhZD5gLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBidWlsZEJ1bmRsZVN0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLmJ1aWxkSGVhZCgpO1xuICAgIFxuICAgIGNvbnN0IGJ1bmRsZVBsYWNlaG9sZGVyID0gWy9ASW5zZXJ0QnVuZGxlKDs/KS8sIC9ARGVmYXVsdEluc2VydEJ1bmRsZSg7PykvXTtcbiAgICBjb25zdCByZW1vdmVCdW5kbGUgPSAoKSA9PiB7YnVuZGxlUGxhY2Vob2xkZXIuZm9yRWFjaCh4ID0+IHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSh4LCAnJykpOyByZXR1cm4gcGFnZURhdGF9O1xuXG5cbiAgICBpZiAoIWJ1aWxkQnVuZGxlU3RyaW5nKSAgLy8gdGhlcmUgaXNuJ3QgYW55dGhpbmcgdG8gYnVuZGxlXG4gICAgICAgIHJldHVybiByZW1vdmVCdW5kbGUoKTtcblxuICAgIGNvbnN0IHJlcGxhY2VXaXRoID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYnVpbGRCdW5kbGVTdHJpbmcpOyAvLyBhZGQgYnVuZGxlIHRvIHBhZ2VcbiAgICBsZXQgYnVuZGxlU3VjY2VlZCA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGVQbGFjZWhvbGRlci5sZW5ndGggJiYgIWJ1bmRsZVN1Y2NlZWQ7IGkrKylcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihidW5kbGVQbGFjZWhvbGRlcltpXSwgKCkgPT4gKGJ1bmRsZVN1Y2NlZWQgPSB0cnVlKSAmJiByZXBsYWNlV2l0aCk7XG5cbiAgICBpZihidW5kbGVTdWNjZWVkKVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGEuUGx1cyQgYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPScke3JlcGxhY2VXaXRofSc7YDtcbn0iLCAiaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuXG5jb25zdCBudW1iZXJzID0gWydudW1iZXInLCAnbnVtJywgJ2ludGVnZXInLCAnaW50J10sIGJvb2xlYW5zID0gWydib29sZWFuJywgJ2Jvb2wnXTtcbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uID0gWydlbWFpbCcsICdzdHJpbmcnLCAndGV4dCcsIC4uLm51bWJlcnMsIC4uLmJvb2xlYW5zXTtcblxuY29uc3QgZW1haWxWYWxpZGF0b3IgPSAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvO1xuXG5cblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25SZWdleCA9IHtcbiAgICBcInN0cmluZy1sZW5ndGgtcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy1bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy0nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgdGV4dDogc3RyaW5nKSA9PiB0ZXh0Lmxlbmd0aCA+PSBtaW4gJiYgdGV4dC5sZW5ndGggPD0gbWF4LFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZS1pbnRlZ2VyXCI6IFtcbiAgICAgICAgL15bMC05XSsuLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IE51bWJlci5pc0ludGVnZXIobnVtKSAmJiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibnVtYmVyLXJhbmdlLWZsb2F0XCI6IFtcbiAgICAgICAgL15bMC05XStcXC5bMC05XSsuLlswLTldK1xcLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heCxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2Utc3RyaW5nXCI6IFtcbiAgICAgICAgL15zdHJpbmd8dGV4dCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gYFwiJHt4LnRyaW0oKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpfVwiYCksXG4gICAgICAgIChvcHRpb25zOiBzdHJpbmdbXSwgdGV4dDogc3RyaW5nKSA9PiBvcHRpb25zLmluY2x1ZGVzKHRleHQpLFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1udW1iZXJcIjogW1xuICAgICAgICAvXm51bWJlcnxudW18aW50ZWdlcnxpbnQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpLFxuICAgICAgICAob3B0aW9uczogbnVtYmVyW10sIG51bTogbnVtYmVyKSA9PiBvcHRpb25zLmluY2x1ZGVzKG51bSksXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdXG59O1xuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMgPSBbLi4ubnVtYmVyc107XG5cbmZvcihjb25zdCBpIGluIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpe1xuICAgIGNvbnN0IHR5cGUgPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2ldWzNdO1xuXG4gICAgaWYoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKHR5cGUpKVxuICAgICAgICBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMucHVzaChpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVZhbHVlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGBbXCIke3ZhbHVlfVwiXWA7XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBbdGVzdCwgZ2V0QXJnc11dIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpKVxuICAgICAgICBpZiAoKDxSZWdFeHA+dGVzdCkudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gYFtcIiR7bmFtZX1cIiwgJHsoPGFueT5nZXRBcmdzKSh2YWx1ZSl9XWA7XG5cbiAgICByZXR1cm4gYFske3ZhbHVlfV1gO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlVmFsaWRhdGlvbkpTT04oYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IFByb21pc2U8Ym9vbGVhbiB8IHN0cmluZ1tdPiB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnQsIC4uLmVsZW1lbnRBcmdzXSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG4gICAgICAgIGxldCByZXR1cm5Ob3c6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZTtcblxuICAgICAgICBsZXQgaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgY2FzZSAnYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIU51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWVtYWlsVmFsaWRhdG9yLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhdmVSZWdleCA9IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbZWxlbWVudF07XG5cbiAgICAgICAgICAgICAgICBpZihoYXZlUmVnZXgpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB2YWx1ZSA9PSBudWxsIHx8ICFoYXZlUmVnZXhbMl0oZWxlbWVudEFyZ3MsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gKCFlbGVtZW50LnRlc3QodmFsdWUpKSAmJiAncmVnZXggLSAnICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gKCFhd2FpdCBlbGVtZW50KHZhbHVlKSkgJiYgJ2Z1bmN0aW9uIC0gJyArIChlbGVtZW50Lm5hbWUgfHwgJ2Fub255bW91cycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk5vdykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBgVmFsaWRhdGlvbiBmYWlsZWQgYXQgZmlsZWQgJHtOdW1iZXIoaSkrMX0gLSAke2lzRGVmYXVsdCA/IHJldHVybk5vdyA6ICdleHBlY3RlZCAnICsgZWxlbWVudH1gO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50QXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaW5mbyArPSBgLCBhcmd1bWVudHM6ICR7SlNPTi5zdHJpbmdpZnkoZWxlbWVudEFyZ3MpfWA7XG5cbiAgICAgICAgICAgIGluZm8gKz0gYCwgaW5wdXQ6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBbaW5mbywgZWxlbWVudCwgZWxlbWVudEFyZ3MsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VWYWx1ZXMoYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBwYXJzZWQgPSBbXTtcblxuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50XSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG5cbiAgICAgICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHBhcnNlRmxvYXQodmFsdWUpKTtcblxuICAgICAgICBlbHNlIGlmIChib29sZWFucy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufSIsICJpbXBvcnQgeyBjb25uZWN0b3JJbmZvLCBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSBcIi4uLy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvcHJlcHJvY2Vzc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oY29ubmVjdE5hbWU6IHN0cmluZywgY29ubmVjdG9yQ2FsbDogc3RyaW5nLCBjb25uZWN0aW9uVHlwZTogc3RyaW5nLCBwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgYnVpbGRBcmd1bWVudHM6IChpbmZvOiBjb25uZWN0b3JJbmZvKSA9PiBzdHJpbmcsIHtyZXR1cm5EYXRhfToge3JldHVybkRhdGE/OiBib29sZWFufSA9IHt9KSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5maW5kKHggPT4geC50eXBlID09IGNvbm5lY3Rpb25UeXBlKSlcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gY29ubmVjdGlvblR5cGUpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzZW5kVG9Vbmljb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgaS5uYW1lKS51bmljb2RlLmVxXG4gICAgICAgIGNvbnN0IGNvbm5lY3QgPSBuZXcgUmVnRXhwKGBAJHtjb25uZWN0TmFtZX1cXFxcKFsgXSoke3NlbmRUb1VuaWNvZGV9WyBdKlxcXFwpKDs/KWApLCBjb25uZWN0RGVmYXVsdCA9IG5ldyBSZWdFeHAoYEBcXFxcPyR7Y29ubmVjdE5hbWV9XFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKWApO1xuXG4gICAgICAgIGxldCBoYWRSZXBsYWNlbWVudCA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IHNjcmlwdERhdGEgPSAoKSA9PiB7XG4gICAgICAgICAgICBoYWRSZXBsYWNlbWVudCA9IHRydWVcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgaWYoUG9zdD8uJHtjb25uZWN0b3JDYWxsfSA9PSBcIiR7aS5uYW1lfVwiKXtcbiAgICAgICAgICAgICAgICAke3JldHVybkRhdGEgPyAncmV0dXJuICc6ICcnfWF3YWl0IGhhbmRlbENvbm5lY3RvcihcIiR7Y29ubmVjdGlvblR5cGV9XCIsIHBhZ2UsIFxuICAgICAgICAgICAgICAgICAgICAke2J1aWxkQXJndW1lbnRzKGkpfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9YClcbiAgICAgICAgfTtcblxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3QsIHNjcmlwdERhdGEpO1xuXG4gICAgICAgIGlmIChoYWRSZXBsYWNlbWVudClcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZShjb25uZWN0RGVmYXVsdCwgJycpOyAvLyBkZWxldGluZyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdERlZmF1bHQsIHNjcmlwdERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgdHlwZSB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBjb25uZWN0b3JJbmZvLCBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgeyBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCB7IFNvbWVQbHVnaW5zIH0sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbmFtZScpLFxuICAgICAgICBzZW5kVG8gPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdzZW5kVG8nKSxcbiAgICAgICAgdmFsaWRhdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdub3RWYWxpZCcpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFTb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKSk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7IGFzeW5jOiBudWxsIH0pXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KHRlbXBsYXRlKG5hbWUpKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IEJldHdlZW5UYWdEYXRhIHx8IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICBjb21waWxlZFN0cmluZy5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhQEA/Q29ubmVjdEhlcmUoJHtuYW1lfSklPmApXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZyxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbignQ29ubmVjdEhlcmUnLCAnY29ubmVjdG9yQ2FsbD8ubmFtZScsICdjb25uZWN0JywgcGFnZURhdGEsIHNlc3Npb25JbmZvLCBpID0+IHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTpcIiR7aS5uYW1lfVwiLFxuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlskeyhpLnZhbGlkYXRvciAmJiBpLnZhbGlkYXRvci5tYXAoY29tcGlsZVZhbHVlcykuam9pbignLCcpKSB8fCAnJ31dXG4gICAgICAgIH1gXG4gICAgfSwge3JldHVybkRhdGE6IHRydWV9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvcjogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JDYWxsLnZhbHVlcztcbiAgICBjb25zdCBpc1ZhbGlkID0gY29ubmVjdG9yLnZhbGlkYXRvci5sZW5ndGggJiYgYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9yLnZhbGlkYXRvcik7XG5cbiAgICB0aGlzUGFnZS5zZXRSZXNwb25zZSgnJyk7XG5cbiAgICBjb25zdCBiZXR0ZXJKU09OID0gKG9iajogYW55KSA9PiB7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2UuZW5kKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIH1cblxuICAgIGlmICghY29ubmVjdG9yLnZhbGlkYXRvci5sZW5ndGggfHwgaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBjb25uZWN0b3Iuc2VuZFRvKC4uLnZhbHVlcykpO1xuXG4gICAgZWxzZSBpZiAoY29ubmVjdG9yLm5vdFZhbGlkKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGNvbm5lY3Rvci5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpKTtcblxuICAgIGVsc2UgaWYgKGNvbm5lY3Rvci5tZXNzYWdlKVxuICAgICAgICBiZXR0ZXJKU09OKHtcbiAgICAgICAgICAgIGVycm9yOiB0eXBlb2YgY29ubmVjdG9yLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBjb25uZWN0b3IubWVzc2FnZSA6ICg8YW55PmlzVmFsaWQpLnNoaWZ0KClcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zdGF0dXMoNDAwKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04sIHBhcnNlVmFsdWVzIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcbmltcG9ydCB7IGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvY29ubmVjdC1ub2RlJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3Qgc2VuZFRvID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdzZW5kVG8nLCAnJykudHJpbSgpO1xuXG4gICAgaWYgKCFzZW5kVG8pICAvLyBzcGVjaWFsIGFjdGlvbiBub3QgZm91bmRcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKVxuICAgICAgICAgICAgICAgIH08L2Zvcm0+YCxcbiAgICAgICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICAgICAgfVxuXG5cbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCduYW1lJywgdXVpZCgpKS50cmltKCksIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgndmFsaWRhdGUnKSwgb3JkZXJEZWZhdWx0OiBzdHJpbmcgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdvcmRlcicpLCBub3RWYWxpZDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbm90VmFsaWQnKSwgcmVzcG9uc2VTYWZlID0gZGF0YVRhZy5wb3BCb29sZWFuKCdzYWZlJyk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdtZXNzYWdlJywgc2Vzc2lvbkluZm8uZGVidWcgJiYgIUluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKSk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGxldCBvcmRlciA9IFtdO1xuXG4gICAgY29uc3QgdmFsaWRhdG9yQXJyYXkgPSB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geyAvLyBDaGVja2luZyBpZiB0aGVyZSBpcyBhbiBvcmRlciBpbmZvcm1hdGlvbiwgZm9yIGV4YW1wbGUgXCJwcm9wMTogc3RyaW5nLCBwcm9wMzogbnVtLCBwcm9wMjogYm9vbFwiXG4gICAgICAgIGNvbnN0IHNwbGl0ID0gU3BsaXRGaXJzdCgnOicsIHgudHJpbSgpKTtcblxuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIG9yZGVyLnB1c2goc3BsaXQuc2hpZnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIHNwbGl0LnBvcCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKG9yZGVyRGVmYXVsdClcbiAgICAgICAgb3JkZXIgPSBvcmRlckRlZmF1bHQuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JBcnJheSxcbiAgICAgICAgb3JkZXI6IG9yZGVyLmxlbmd0aCAmJiBvcmRlcixcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlc3BvbnNlU2FmZVxuICAgIH0pO1xuXG4gICAgZGF0YVRhZy5wdXNoVmFsdWUoJ21ldGhvZCcsICdwb3N0Jyk7XG5cbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJFxuICAgICAgICBgPCUhXG5AP0Nvbm5lY3RIZXJlRm9ybSgke25hbWV9KVxuJT48Zm9ybSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+XG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY29ubmVjdG9yRm9ybUNhbGxcIiB2YWx1ZT1cIiR7bmFtZX1cIi8+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pfTwvZm9ybT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oJ0Nvbm5lY3RIZXJlRm9ybScsICdjb25uZWN0b3JGb3JtQ2FsbCcsICdmb3JtJywgcGFnZURhdGEsIHNlc3Npb25JbmZvLCBpID0+IHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAge1xuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlske2kudmFsaWRhdG9yPy5tYXA/Lihjb21waWxlVmFsdWVzKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICBvcmRlcjogWyR7aS5vcmRlcj8ubWFwPy4oaXRlbSA9PiBgXCIke2l0ZW19XCJgKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICBzYWZlOiR7aS5yZXNwb25zZVNhZmV9XG4gICAgICAgIH1gXG4gICAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3JJbmZvOiBhbnkpIHtcblxuICAgIGRlbGV0ZSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckZvcm1DYWxsO1xuXG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8ub3JkZXIubGVuZ3RoKSAvLyBwdXNoIHZhbHVlcyBieSBzcGVjaWZpYyBvcmRlclxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY29ubmVjdG9ySW5mby5vcmRlcilcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRoaXNQYWdlLlBvc3RbaV0pO1xuICAgIGVsc2VcbiAgICAgICAgdmFsdWVzLnB1c2goLi4uT2JqZWN0LnZhbHVlcyh0aGlzUGFnZS5Qb3N0KSk7XG5cblxuICAgIGxldCBpc1ZhbGlkOiBib29sZWFuIHwgc3RyaW5nW10gPSB0cnVlO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8udmFsaWRhdG9yLmxlbmd0aCkgeyAvLyB2YWxpZGF0ZSB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcGFyc2VWYWx1ZXModmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgICAgIGlzVmFsaWQgPSBhd2FpdCBtYWtlVmFsaWRhdGlvbkpTT04odmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgfVxuXG4gICAgbGV0IHJlc3BvbnNlOiBhbnk7XG5cbiAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLnNlbmRUbyguLi52YWx1ZXMpO1xuICAgIGVsc2UgaWYgKGNvbm5lY3RvckluZm8ubm90VmFsaWQpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpO1xuXG4gICAgaWYgKGlzVmFsaWQgJiYgIXJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5tZXNzYWdlID09PSB0cnVlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKGlzVmFsaWRbMF0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXNwb25zZSA9IGNvbm5lY3RvckluZm8ubWVzc2FnZTtcblxuICAgIGlmIChyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8uc2FmZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShyZXNwb25zZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlKHJlc3BvbnNlKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHNtYWxsUGF0aFRvUGFnZSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuY29uc3QgcmVjb3JkU3RvcmUgPSBuZXcgU3RvcmVKU09OKCdSZWNvcmRzJyk7XG5cbmZ1bmN0aW9uIHJlY29yZExpbmsoZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xpbmsnLCBzbWFsbFBhdGhUb1BhZ2Uoc2Vzc2lvbkluZm8uc21hbGxQYXRoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmVjb3JkUGF0aChkZWZhdWx0TmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbGluayA9IHJlY29yZExpbmsoZGF0YVRhZywgc2Vzc2lvbkluZm8pLCBzYXZlTmFtZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbmFtZScsIGRlZmF1bHROYW1lKTtcblxuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSA/Pz0ge307XG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdID8/PSAnJztcbiAgICBzZXNzaW9uSW5mby5yZWNvcmQoc2F2ZU5hbWUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RvcmU6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSxcbiAgICAgICAgY3VycmVudDogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdLFxuICAgICAgICBsaW5rXG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFzZXNzaW9uSW5mby5zbWFsbFBhdGguZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpIC8vIGRvIG5vdCBhbGxvdyB0aGlzIGZvciBjb21waWxpbmcgY29tcG9uZW50IGFsb25lXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICAgICAgfVxuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGh0bWwgPSBodG1sLnRyaW0oKTtcblxuICAgIGNvbnN0IHsgc3RvcmUsIGxpbmsgfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3JlY29yZC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFzdG9yZVtsaW5rXS5pbmNsdWRlcyhodG1sKSkge1xuICAgICAgICBzdG9yZVtsaW5rXSArPSBodG1sO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc21hbGxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuYW1lID0gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aCk7XG4gICAgZm9yIChjb25zdCBzYXZlIGluIHJlY29yZFN0b3JlLnN0b3JlKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSByZWNvcmRTdG9yZS5zdG9yZVtzYXZlXTtcblxuICAgICAgICBpZiAoaXRlbVtuYW1lXSkge1xuICAgICAgICAgICAgaXRlbVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlbGV0ZSBpdGVtW25hbWVdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjb3JkcyhzZXNzaW9uOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb24uZGVidWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzZXNzaW9uLnJlY29yZE5hbWVzKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHJlY29yZFN0b3JlLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInO1xuaW1wb3J0IHsgbWFrZVJlY29yZFBhdGggfSBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFzZXNzaW9uSW5mby5zbWFsbFBhdGguZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpIC8vIGRvIG5vdCBhbGxvdyB0aGlzIGZvciBjb21waWxpbmcgY29tcG9uZW50IGFsb25lXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICAgICAgfVxuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHsgc3RvcmUsIGxpbmssIGN1cnJlbnQgfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3NlYXJjaC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IHNlYXJjaE9iamVjdCA9IGJ1aWxkT2JqZWN0KGh0bWwsIGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWF0Y2gnLCAnaDFbaWRdLCBoMltpZF0sIGgzW2lkXSwgaDRbaWRdLCBoNVtpZF0sIGg2W2lkXScpKTtcblxuICAgIGlmICghY3VycmVudCkge1xuICAgICAgICBzdG9yZVtsaW5rXSA9IHNlYXJjaE9iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuYXNzaWduKGN1cnJlbnQudGl0bGVzLCBzZWFyY2hPYmplY3QudGl0bGVzKTtcblxuICAgICAgICBpZiAoIWN1cnJlbnQudGV4dC5pbmNsdWRlcyhzZWFyY2hPYmplY3QudGV4dCkpIHtcbiAgICAgICAgICAgIGN1cnJlbnQudGV4dCArPSBzZWFyY2hPYmplY3QudGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRPYmplY3QoaHRtbDogc3RyaW5nLCBtYXRjaDogc3RyaW5nKSB7XG4gICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwsIHtcbiAgICAgICAgYmxvY2tUZXh0RWxlbWVudHM6IHtcbiAgICAgICAgICAgIHNjcmlwdDogZmFsc2UsXG4gICAgICAgICAgICBzdHlsZTogZmFsc2UsXG4gICAgICAgICAgICBub3NjcmlwdDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdGl0bGVzOiBTdHJpbmdNYXAgPSB7fTtcblxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGwobWF0Y2gpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5hdHRyaWJ1dGVzWydpZCddO1xuICAgICAgICB0aXRsZXNbaWRdID0gZWxlbWVudC5pbm5lclRleHQudHJpbSgpO1xuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlcyxcbiAgICAgICAgdGV4dDogcm9vdC5pbm5lclRleHQudHJpbSgpLnJlcGxhY2UoL1sgXFxuXXsyLH0vZywgJyAnKS5yZXBsYWNlKC9bXFxuXS9nLCAnICcpXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL0NvbXBvbmVudHMvY2xpZW50JztcbmltcG9ydCBzY3JpcHQgZnJvbSAnLi9Db21wb25lbnRzL3NjcmlwdC9pbmRleCc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9Db21wb25lbnRzL3N0eWxlL2luZGV4JztcbmltcG9ydCBwYWdlIGZyb20gJy4vQ29tcG9uZW50cy9wYWdlJztcbmltcG9ydCBpc29sYXRlIGZyb20gJy4vQ29tcG9uZW50cy9pc29sYXRlJztcbmltcG9ydCBzdmVsdGUgZnJvbSAnLi9Db21wb25lbnRzL3N2ZWx0ZSc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnLi9Db21wb25lbnRzL21hcmtkb3duJztcbmltcG9ydCBoZWFkLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEhlYWQgfSBmcm9tICcuL0NvbXBvbmVudHMvaGVhZCc7XG5pbXBvcnQgY29ubmVjdCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRDb25uZWN0LCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yQ29ubmVjdCB9IGZyb20gJy4vQ29tcG9uZW50cy9jb25uZWN0JztcbmltcG9ydCBmb3JtLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEZvcm0sIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JGb3JtIH0gZnJvbSAnLi9Db21wb25lbnRzL2Zvcm0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgcmVjb3JkLCB7IHVwZGF0ZVJlY29yZHMsIHBlckNvbXBpbGUgYXMgcGVyQ29tcGlsZVJlY29yZCwgcG9zdENvbXBpbGUgYXMgcG9zdENvbXBpbGVSZWNvcmQsIGRlbGV0ZUJlZm9yZVJlQnVpbGQgfSBmcm9tICcuL0NvbXBvbmVudHMvcmVjb3JkJztcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9Db21wb25lbnRzL3NlYXJjaCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgY29uc3QgQWxsQnVpbGRJbiA9IFtcImNsaWVudFwiLCBcInNjcmlwdFwiLCBcInN0eWxlXCIsIFwicGFnZVwiLCBcImNvbm5lY3RcIiwgXCJpc29sYXRlXCIsIFwiZm9ybVwiLCBcImhlYWRcIiwgXCJzdmVsdGVcIiwgXCJtYXJrZG93blwiLCBcInJlY29yZFwiLCBcInNlYXJjaFwiXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGxldCByZURhdGE6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD47XG5cbiAgICBzd2l0Y2ggKHR5cGUuZXEudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlIFwiY2xpZW50XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjbGllbnQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmVjb3JkXCI6XG4gICAgICAgICAgICByZURhdGEgPSByZWNvcmQoIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNlYXJjaFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2VhcmNoKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNjcmlwdCggcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN0eWxlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdHlsZSggcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBhZ2VcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHBhZ2UocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY29ubmVjdCh0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZvcm1cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGZvcm0ocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXNvbGF0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGhlYWQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3ZlbHRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdmVsdGUodHlwZSwgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtYXJrZG93blwiOlxuICAgICAgICAgICAgcmVEYXRhID0gbWFya2Rvd24odHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ29tcG9uZW50IGlzIG5vdCBidWlsZCB5ZXRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzSW5jbHVkZSh0YWduYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gQWxsQnVpbGRJbi5pbmNsdWRlcyh0YWduYW1lLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB1cGRhdGVSZWNvcmRzKHNlc3Npb25JbmZvKTtcblxuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZENvbm5lY3QocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRGb3JtKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKC9AQ29ubmVjdEhlcmUoOz8pL2dpLCAnJykucmVwbGFjZSgvQENvbm5lY3RIZXJlRm9ybSg7PykvZ2ksICcnKTtcblxuICAgIHBhZ2VEYXRhID0gYXdhaXQgYWRkRmluYWxpemVCdWlsZEhlYWQocGFnZURhdGEsIHNlc3Npb25JbmZvLCBmdWxsQ29tcGlsZVBhdGgpO1xuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRlbENvbm5lY3RvclNlcnZpY2UodHlwZTogc3RyaW5nLCB0aGlzUGFnZTogYW55LCBjb25uZWN0b3I6IGFueSkge1xuICAgIGlmICh0eXBlID09ICdjb25uZWN0JylcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckNvbm5lY3QodGhpc1BhZ2UsIGNvbm5lY3Rvcik7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gaGFuZGVsQ29ubmVjdG9yRm9ybSh0aGlzUGFnZSwgY29ubmVjdG9yKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBlckNvbXBpbGUoKSB7XG4gICAgcGVyQ29tcGlsZVJlY29yZCgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpIHtcbiAgICBwb3N0Q29tcGlsZVJlY29yZCgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgZGVsZXRlQmVmb3JlUmVCdWlsZChzZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKXtcbiAgICBcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFBhcnNlRGVidWdJbmZvLCBDcmVhdGVGaWxlUGF0aCwgUGF0aFR5cGVzLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBBbGxCdWlsZEluLCBJc0luY2x1ZGUsIFN0YXJ0Q29tcGlsaW5nIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBBcnJheU1hdGNoIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7Q29tcGlsZUluRmlsZUZ1bmMsIFN0cmluZ0FycmF5T3JPYmplY3QsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciwgcG9vbCB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc2VydENvbXBvbmVudCBleHRlbmRzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIHB1YmxpYyBkaXJGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbjtcbiAgICBwdWJsaWMgQ29tcGlsZUluRmlsZTogQ29tcGlsZUluRmlsZUZ1bmM7XG4gICAgcHVibGljIE1pY3JvUGx1Z2luczogU3RyaW5nQXJyYXlPck9iamVjdDtcbiAgICBwdWJsaWMgR2V0UGx1Z2luOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XG4gICAgcHVibGljIFNvbWVQbHVnaW5zOiAoLi4ubmFtZXM6IHN0cmluZ1tdKSA9PiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1RzOiAoKSA9PiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZWdleFNlYXJjaDogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IoUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+PGNvbG9yPiR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSAmJiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gZGF0YVRhZ1NwbGljZWQucmVidWlsZFNwYWNlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBjb21wb25lbnQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9ID0gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKGNvbXBvbmVudCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7a2V5LHZhbHVlfSBvZiB0YWdEYXRhLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBrZXksIFwiZ2lcIik7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UocmUsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhOiBUYWdEYXRhUGFyc2VyLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBpbXBvcnRTb3VyY2UgPSAnLycgKyB0eXBlLmV4dHJhY3RJbmZvKCk7XG5cbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZScsIGltcG9ydFNvdXJjZSlcbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZURpcmVjdG9yeScsIHBhdGguZGlybmFtZShpbXBvcnRTb3VyY2UpKVxuXG4gICAgICAgIGNvbnN0ICBtYXBBdHRyaWJ1dGVzID0gZGF0YS5tYXAoKTtcbiAgICAgICAgbWFwQXR0cmlidXRlcy5yZWFkZXIgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG5cbiAgICAgICAgcmV0dXJuIG1hcEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlciB9KSB7XG4gICAgICAgIGNvbnN0IGRhdGFQYXJzZXIgPSBuZXcgVGFnRGF0YVBhcnNlcihkYXRhVGFnKSwgQnVpbGRJbiA9IElzSW5jbHVkZSh0eXBlLmVxKTtcbiAgICAgICAgYXdhaXQgZGF0YVBhcnNlci5wYXJzZXIoKTtcblxuICAgICAgICBsZXQgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaEluQ29tbWVudCA9IHRydWUsIEFsbFBhdGhUeXBlczogUGF0aFR5cGVzID0ge30sIGFkZFN0cmluZ0luZm86IHN0cmluZztcblxuICAgICAgICBpZiAoQnVpbGRJbikgey8vY2hlY2sgaWYgaXQgYnVpbGQgaW4gY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCB7IGNvbXBpbGVkU3RyaW5nLCBjaGVja0NvbXBvbmVudHMgfSA9IGF3YWl0IFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lLCB0eXBlLCBkYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGFQYXJzZXIucG9wSGF2ZURlZmF1bHQoJ2ZvbGRlcicsICcuJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPjxjb2xvcj4ke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGFsbERhdGEsIHRoaXMuaXNUcygpKTtcblxuICAgICAgICAgICAgLyphZGQgc3BlY2lhbCBhdHRyaWJ1dGVzICovXG4gICAgICAgICAgICBjb25zdCBtYXBBdHRyaWJ1dGVzID0gSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGFQYXJzZXIsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCB7YXR0cmlidXRlczogbWFwQXR0cmlidXRlc30pO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhUGFyc2VyLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke3RhZ1R5cGV9XCIsIHVzZWQgaW46ICR7dGFnVHlwZS5hdCgwKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBwb29sIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ3MgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyXCI7XG5pbXBvcnQgQ1J1blRpbWUgZnJvbSBcIi4vQ29tcGlsZVwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uL1Nlc3Npb25cIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gXCIuLi9KU1BhcnNlclwiO1xuXG5jb25zdCBpZ25vcmVJbmhlcml0ID0gWydjb2RlZmlsZSddO1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0geyBkZWZpbmU6IHt9IH07XG5cbmFzeW5jIGZ1bmN0aW9uIFBhZ2VCYXNlUGFyc2VyKHRleHQ6IHN0cmluZyk6IFByb21pc2U8e1xuICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgZW5kOiBudW1iZXIsXG4gICAgdmFsdWVzOiB7XG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgY2hhcjogc3RyaW5nXG4gICAgfVtdXG59PiB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBwb29sLmV4ZWMoJ1BhZ2VCYXNlUGFyc2VyJywgW3RleHRdKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlQmFzZVBhZ2Uge1xuICAgIHB1YmxpYyBjbGVhckRhdGE6IFN0cmluZ1RyYWNrZXJcbiAgICBwdWJsaWMgc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBwdWJsaWMgdmFsdWVBcnJheTogeyBrZXk6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIgfCB0cnVlLCBjaGFyPzogc3RyaW5nIH1bXSA9IFtdXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgcHVibGljIGNvZGU/OiBTdHJpbmdUcmFja2VyLCBwdWJsaWMgaXNUcz86IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICBub25EeW5hbWljKGlzRHluYW1pYzogYm9vbGVhbikge1xuICAgICAgICBpZiAoIWlzRHluYW1pYykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEeW5hbWljID0gdGhpcy5wb3BBbnkoJ2R5bmFtaWMnKTtcbiAgICAgICAgaWYgKGhhdmVEeW5hbWljICE9IG51bGwpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICAgICAgcGFyc2UuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGE7XG4gICAgICAgICAgICBwYXJzZS52YWx1ZUFycmF5ID0gWy4uLnRoaXMudmFsdWVBcnJheSwgeyBrZXk6ICdkeW5hbWljJywgdmFsdWU6IHRydWUgfV07XG5cbiAgICAgICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZSh0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoLCBwYXJzZS5jbGVhckRhdGEuZXEpO1xuXG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2R5bmFtaWMtc3NyLWltcG9ydCcsXG4gICAgICAgICAgICAgICAgdGV4dDogJ0FkZGluZyBcXCdkeW5hbWljXFwnIGF0dHJpYnV0ZSB0byBmaWxlIDxjb2xvcj4nICsgdGhpcy5zZXNzaW9uSW5mby5zbWFsbFBhdGhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KVxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKHBhZ2VQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCB7IGF0dHJpYnV0ZXMsIGR5bmFtaWNDaGVja306IHsgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCwgZHluYW1pY0NoZWNrPzogYm9vbGVhbiB9KSB7XG4gICAgICAgIGNvbnN0IHJ1biA9IG5ldyBDUnVuVGltZSh0aGlzLmNvZGUsIHRoaXMuc2Vzc2lvbkluZm8sIHNtYWxsUGF0aCwgdGhpcy5pc1RzKTtcbiAgICAgICAgdGhpcy5jb2RlID0gYXdhaXQgcnVuLmNvbXBpbGUoYXR0cmlidXRlcyk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wYXJzZUJhc2UodGhpcy5jb2RlKTtcbiAgICAgICAgaWYodGhpcy5ub25EeW5hbWljKGR5bmFtaWNDaGVjaykpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRDb2RlRmlsZShwYWdlUGF0aCwgc21hbGxQYXRoLCB0aGlzLmlzVHMsIHBhZ2VOYW1lKTtcblxuICAgICAgICB0aGlzLmxvYWREZWZpbmUoeyAuLi5zZXR0aW5ncy5kZWZpbmUsIC4uLnJ1bi5kZWZpbmUgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwYXJzZUJhc2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBhd2FpdCBQYWdlQmFzZVBhcnNlcihjb2RlLmVxKTtcblxuICAgICAgICBpZihwYXJzZXIuc3RhcnQgPT0gcGFyc2VyLmVuZCl7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoY29uc3Qge2NoYXIsZW5kLGtleSxzdGFydH0gb2YgcGFyc2VyLnZhbHVlcyl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7a2V5LCB2YWx1ZTogc3RhcnQgPT09IGVuZCA/IHRydWU6IGNvZGUuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLCBjaGFyfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gY29kZS5zdWJzdHJpbmcoMCwgcGFyc2VyLnN0YXJ0KS5QbHVzKGNvZGUuc3Vic3RyaW5nKHBhcnNlci5lbmQpKS50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGQoKSB7XG4gICAgICAgIGlmICghdGhpcy52YWx1ZUFycmF5Lmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xlYXJEYXRhO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdAWycpO1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlLCBjaGFyIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfSBgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGAke2tleX0gYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYnVpbGQuc3Vic3RyaW5nKDAsIGJ1aWxkLmxlbmd0aC0xKS5QbHVzKCddXFxuJykuUGx1cyh0aGlzLmNsZWFyRGF0YSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgYXdhaXQgcGFyc2UucGFyc2VCYXNlKGNvZGUpO1xuXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwYXJzZS5ieVZhbHVlKCdpbmhlcml0JykpIHtcbiAgICAgICAgICAgIGlmKGlnbm9yZUluaGVyaXQuaW5jbHVkZXMobmFtZS50b0xvd2VyQ2FzZSgpKSkgY29udGludWU7XG4gICAgICAgICAgICBwYXJzZS5wb3AobmFtZSlcbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYDxAJHtuYW1lfT48OiR7bmFtZX0vPjwvQCR7bmFtZX0+YClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICByZXR1cm4gcGFyc2UuY2xlYXJEYXRhLlBsdXMoYnVpbGQpO1xuICAgIH1cblxuICAgIGdldChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkgPT09IG5hbWUpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UodGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5ID09PSBuYW1lKSwgMSlbMF0/LnZhbHVlO1xuICAgIH1cblxuICAgIHBvcEFueShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZU5hbWUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkudG9Mb3dlckNhc2UoKSA9PSBuYW1lKTtcblxuICAgICAgICBpZiAoaGF2ZU5hbWUgIT0gLTEpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZShoYXZlTmFtZSwgMSlbMF0udmFsdWU7XG5cbiAgICAgICAgY29uc3QgYXNUYWcgPSBnZXREYXRhVGFncyh0aGlzLmNsZWFyRGF0YSwgW25hbWVdLCAnQCcpO1xuXG4gICAgICAgIGlmICghYXNUYWcuZm91bmRbMF0pIHJldHVybjtcblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGFzVGFnLmRhdGE7XG5cbiAgICAgICAgcmV0dXJuIGFzVGFnLmZvdW5kWzBdLmRhdGEudHJpbSgpO1xuICAgIH1cblxuICAgIGJ5VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbHRlcih4ID0+IHgudmFsdWUgIT09IHRydWUgJiYgeC52YWx1ZS5lcSA9PT0gdmFsdWUpLm1hcCh4ID0+IHgua2V5KVxuICAgIH1cblxuICAgIHJlcGxhY2VWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKVxuICAgICAgICBpZiAoaGF2ZSkgaGF2ZS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGRlZmF1bHRWYWx1ZVBvcEFueTxUPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogVCk6IHN0cmluZyB8IFQgfCBudWxsIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBvcEFueShuYW1lKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlID8gZGVmYXVsdFZhbHVlIDogdmFsdWU/LmVxO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbG9hZENvZGVGaWxlKHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VTbWFsbFBhdGg6IHN0cmluZywgaXNUczogYm9vbGVhbiwgcGFnZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgaGF2ZUNvZGUgPSB0aGlzLmRlZmF1bHRWYWx1ZVBvcEFueSgnY29kZWZpbGUnLCAnaW5oZXJpdCcpO1xuICAgICAgICBpZiAoIWhhdmVDb2RlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbGFuZyA9IHRoaXMuZGVmYXVsdFZhbHVlUG9wQW55KCdsYW5nJywgJ2pzJyk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBoYXZlQ29kZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAob3JpZ2luYWxWYWx1ZSA9PSAnaW5oZXJpdCcpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhZ2VQYXRoO1xuXG4gICAgICAgIGNvbnN0IGhhdmVFeHQgPSBwYXRoLmV4dG5hbWUoaGF2ZUNvZGUpLnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIVsnanMnLCAndHMnXS5pbmNsdWRlcyhoYXZlRXh0KSkge1xuICAgICAgICAgICAgaWYgKC8oXFxcXHxcXC8pJC8udGVzdChoYXZlQ29kZSkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGFnZVBhdGguc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKGhhdmVFeHQpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhdGguZXh0bmFtZShwYWdlUGF0aCk7XG4gICAgICAgICAgICBoYXZlQ29kZSArPSAnLicgKyAobGFuZyA/IGxhbmcgOiBpc1RzID8gJ3RzJyA6ICdqcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhdmVDb2RlWzBdID09ICcuJylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWdlUGF0aCksIGhhdmVDb2RlKVxuXG4gICAgICAgIGNvbnN0IFNtYWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoaGF2ZUNvZGUpO1xuXG4gICAgICAgIGlmIChhd2FpdCB0aGlzLnNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLCBoYXZlQ29kZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBoYXZlQ29kZSwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gYmFzZU1vZGVsRGF0YS5hbGxEYXRhLnJlcGxhY2VBbGwoXCJAXCIsIFwiQEBcIik7XG5cbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjaygnPCUnKTtcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCclPicpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5kZWJ1ZyAmJiB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgICAgICB9IGVsc2UgaWYob3JpZ2luYWxWYWx1ZSA9PSAnaW5oZXJpdCcgJiYgdGhpcy5zZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKGhhdmVDb2RlLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgaWQ6IFNtYWxsUGF0aCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnY3JlYXRlLWNvZGUtZmlsZScsXG4gICAgICAgICAgICAgICAgdGV4dDogYFxcbkNvZGUgZmlsZSBjcmVhdGVkOiA8Y29sb3I+JHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlLWZpbGUtbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogPGNvbG9yPiR7cGFnZVBhdGh9PGxpbmU+JHtTbWFsbFBhdGh9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIocGFnZU5hbWUsIEpTUGFyc2VyLnByaW50RXJyb3IoYENvZGUgRmlsZSBOb3QgRm91bmQ6ICcke3BhZ2VTbWFsbFBhdGh9JyAtPiAnJHtTbWFsbFBhdGh9J2ApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNldHRpbmcobmFtZSA9ICdkZWZpbmUnLCBsaW1pdEFyZ3VtZW50cyA9IDIpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMuY2xlYXJEYXRhLmluZGV4T2YoYEAke25hbWV9KGApO1xuICAgICAgICBpZiAoaGF2ZSA9PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGFyZ3VtZW50QXJyYXk6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuY2xlYXJEYXRhLnN1YnN0cmluZygwLCBoYXZlKTtcbiAgICAgICAgbGV0IHdvcmtEYXRhID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKGhhdmUgKyA4KS50cmltU3RhcnQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbWl0QXJndW1lbnRzOyBpKyspIHsgLy8gYXJndW1lbnRzIHJlYWRlciBsb29wXG4gICAgICAgICAgICBjb25zdCBxdW90YXRpb25TaWduID0gd29ya0RhdGEuYXQoMCkuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZFF1b3RlID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKHdvcmtEYXRhLmVxLnN1YnN0cmluZygxKSwgcXVvdGF0aW9uU2lnbik7XG5cbiAgICAgICAgICAgIGFyZ3VtZW50QXJyYXkucHVzaCh3b3JrRGF0YS5zdWJzdHJpbmcoMSwgZW5kUXVvdGUpKTtcblxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJBcmd1bWVudCA9IHdvcmtEYXRhLnN1YnN0cmluZyhlbmRRdW90ZSArIDEpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgaWYgKGFmdGVyQXJndW1lbnQuYXQoMCkuZXEgIT0gJywnKSB7XG4gICAgICAgICAgICAgICAgd29ya0RhdGEgPSBhZnRlckFyZ3VtZW50O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQuc3Vic3RyaW5nKDEpLnRyaW1TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya0RhdGEgPSB3b3JrRGF0YS5zdWJzdHJpbmcod29ya0RhdGEuaW5kZXhPZignKScpICsgMSk7XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYmVmb3JlLnRyaW1FbmQoKS5QbHVzKHdvcmtEYXRhLnRyaW1TdGFydCgpKTtcblxuICAgICAgICByZXR1cm4gYXJndW1lbnRBcnJheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWREZWZpbmUobW9yZURlZmluZTogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IHN0cmluZylbXVtdID0gW107XG4gICAgICAgIHdoaWxlIChsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlcy51bnNoaWZ0KGxhc3RWYWx1ZSk7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZXMudW5zaGlmdCguLi5PYmplY3QuZW50cmllcyhtb3JlRGVmaW5lKSlcblxuICAgICAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IHRoaXMuY2xlYXJEYXRhLnJlcGxhY2VBbGwoYDoke25hbWV9OmAsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGNvbXBpbGVJbXBvcnQgfSBmcm9tIFwiLi4vLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0xvZ2dlclwiO1xuaW1wb3J0IHsgQ29udmVydFN5bnRheE1pbmkgfSBmcm9tIFwiLi4vLi4vUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXhcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tIFwiLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmdcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vSlNQYXJzZXJcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1J1blRpbWUge1xuICAgIGRlZmluZSA9IHt9XG4gICAgY29uc3RydWN0b3IocHVibGljIHNjcmlwdDogU3RyaW5nVHJhY2tlciwgcHVibGljIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGlzVHM6IGJvb2xlYW4pIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgdGVtcGxhdGVTY3JpcHQoc2NyaXB0czogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgY29uc3QgX193cml0ZUFycmF5ID0gW11cbiAgICAgICAgdmFyIF9fd3JpdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCl7XG4gICAgICAgICAgICBfX3dyaXRlLnRleHQgKz0gdGV4dDtcbiAgICAgICAgfWApXG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYFxcbl9fd3JpdGUgPSB7dGV4dDogJyd9O19fd3JpdGVBcnJheS51bnNoaWZ0KF9fd3JpdGUpO2ApXG4gICAgICAgICAgICBidWlsZC5QbHVzKGkpXG4gICAgICAgIH1cblxuICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG5yZXR1cm4gX193cml0ZUFycmF5YCk7XG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ldGhvZHMoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBfX2xvY2FscGF0aCA9ICcvJyArIHNtYWxsUGF0aFRvUGFnZSh0aGlzLnNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHJpbmc6ICdzY3JpcHQsc3R5bGUsZGVmaW5lLHN0b3JlLHBhZ2VfX2ZpbGVuYW1lLHBhZ2VfX2Rpcm5hbWUsX19sb2NhbHBhdGgsYXR0cmlidXRlcycsXG4gICAgICAgICAgICBmdW5jczogW1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc2NyaXB0LmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zdHlsZS5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kZWZpbmVbU3RyaW5nKGtleSldID0gdmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jb21waWxlUnVuVGltZVN0b3JlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgpLFxuICAgICAgICAgICAgICAgIF9fbG9jYWxwYXRoLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgfHwge31cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZENvZGUocGFyc2VyOiBKU1BhcnNlciwgYnVpbGRTdHJpbmdzOiB7IHRleHQ6IHN0cmluZyB9W10pIHtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoaS50ZXh0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYnVpbGRTdHJpbmdzLnBvcCgpLnRleHQsIGkudGV4dC5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgYXN5bmMgY29tcGlsZShhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIC8qIGxvYWQgZnJvbSBjYWNoZSAqL1xuICAgICAgICBjb25zdCBoYXZlQ2FjaGUgPSB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF07XG4gICAgICAgIGlmIChoYXZlQ2FjaGUpXG4gICAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhdmVDYWNoZSkodGhpcy5tZXRob2RzKGF0dHJpYnV0ZXMpLmZ1bmNzKTtcbiAgICAgICAgbGV0IGRvRm9yQWxsOiAocmVzb2x2ZTogKGZ1bmNzOiBhbnlbXSkgPT4gU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pID0+IHZvaWQ7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gZG9Gb3JBbGwgPSByKTtcblxuICAgICAgICAvKiBydW4gdGhlIHNjcmlwdCAqL1xuICAgICAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IENvbnZlcnRTeW50YXhNaW5pKHRoaXMuc2NyaXB0LCBcIkBjb21waWxlXCIsIFwiKlwiKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRoaXMuc2NyaXB0LCB0aGlzLnNtYWxsUGF0aCwgJzwlKicsICclPicpO1xuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBpZiAocGFyc2VyLnZhbHVlcy5sZW5ndGggPT0gMSAmJiBwYXJzZXIudmFsdWVzWzBdLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgY29uc3QgcmVzb2x2ZSA9ICgpID0+IHRoaXMuc2NyaXB0O1xuICAgICAgICAgICAgZG9Gb3JBbGwocmVzb2x2ZSk7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSByZXNvbHZlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW3R5cGUsIGZpbGVQYXRoXSA9IFNwbGl0Rmlyc3QoJy8nLCB0aGlzLnNtYWxsUGF0aCksIHR5cGVBcnJheSA9IGdldFR5cGVzW3R5cGVdID8/IGdldFR5cGVzLlN0YXRpYyxcbiAgICAgICAgICAgIGNvbXBpbGVQYXRoID0gdHlwZUFycmF5WzFdICsgZmlsZVBhdGggKyAnLmNvbXAuanMnO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGZpbGVQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZVNjcmlwdChwYXJzZXIudmFsdWVzLmZpbHRlcih4ID0+IHgudHlwZSAhPSAndGV4dCcpLm1hcCh4ID0+IHgudGV4dCkpO1xuICAgICAgICBjb25zdCB7IGZ1bmNzLCBzdHJpbmcgfSA9IHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKVxuXG4gICAgICAgIGNvbnN0IHRvSW1wb3J0ID0gYXdhaXQgY29tcGlsZUltcG9ydChzdHJpbmcsIGNvbXBpbGVQYXRoLCBmaWxlUGF0aCwgdHlwZUFycmF5LCB0aGlzLmlzVHMsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIHRlbXBsYXRlKTtcblxuICAgICAgICBjb25zdCBleGVjdXRlID0gYXN5bmMgKGZ1bmNzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWJ1aWxkQ29kZShwYXJzZXIsIGF3YWl0IHRvSW1wb3J0KC4uLmZ1bmNzKSk7XG4gICAgICAgICAgICB9IGNhdGNoKGVycil7XG4gICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IGVycixcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gZXhlY3V0ZTsgLy8gc2F2ZSB0aGlzIHRvIGNhY2hlXG4gICAgICAgIGNvbnN0IHRoaXNGaXJzdCA9IGF3YWl0IGV4ZWN1dGUoZnVuY3MpO1xuICAgICAgICBkb0ZvckFsbChleGVjdXRlKVxuXG4gICAgICAgIHJldHVybiB0aGlzRmlyc3Q7XG4gICAgfVxufSIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBpc1RzIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHBhZ2VEZXBzIH0gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlRGVwc1wiO1xuaW1wb3J0IEN1c3RvbUltcG9ydCwgeyBpc1BhdGhDdXN0b20gfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvaW5kZXhcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yLCBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwgfSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWRcIjtcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L0FsaWFzXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5pbXBvcnQgeyBDb21tb25qcywgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgcGFyc2VyOiB7XG4gICAgICAgIHN5bnRheDogaXNUeXBlc2NyaXB0ID8gXCJ0eXBlc2NyaXB0XCIgOiBcImVjbWFzY3JpcHRcIixcbiAgICAgICAgLi4uR2V0UGx1Z2luKChpc1R5cGVzY3JpcHQgPyAnVFMnIDogJ0pTJykgKyBcIk9wdGlvbnNcIilcbiAgICAgIH1cbiAgICB9KSxcbiAgICBtaW5pZnk6IGNvZGVNaW5pZnksXG4gICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgIHNvdXJjZU1hcHM6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/IHRydWUgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBvdXRwdXRQYXRoOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKVxuICB9KTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7IGRlYnVnOiBcIlwiICsgaXNEZWJ1ZyB9KTtcbiAgUmVzdWx0ID0gdGVtcGxhdGUoXG4gICAgUmVzdWx0LFxuICAgIGlzRGVidWcsXG4gICAgcGF0aC5kaXJuYW1lKHRlbXBsYXRlUGF0aCksXG4gICAgdGVtcGxhdGVQYXRoLFxuICAgIHBhcmFtc1xuICApO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShSZXN1bHQsIE9wdGlvbnMpO1xuICAgIFJlc3VsdCA9IG1lcmdlVHJhY2sgJiYgbWFwICYmIChhd2FpdCBiYWNrVG9PcmlnaW5hbChtZXJnZVRyYWNrLCBjb2RlLCBtYXApKS5TdHJpbmdXaXRoVGFjayhzYXZlUGF0aCkgfHwgY29kZTtcblxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNhdmVQYXRoKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHNhdmVQYXRoLCBSZXN1bHQpO1xuICB9XG4gIHJldHVybiBSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIENoZWNrVHMoRmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gRmlsZVBhdGguZW5kc1dpdGgoXCIudHNcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gIHJldHVybiBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICB0eXBlQXJyYXlbMF0gKyBJblN0YXRpY1BhdGgsXG4gICAgdHlwZUFycmF5WzFdICsgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIsXG4gICAgQ2hlY2tUcyhJblN0YXRpY1BhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRFeHRlbnNpb24oRmlsZVBhdGg6IHN0cmluZykge1xuICBjb25zdCBmaWxlRXh0ID0gcGF0aC5leHRuYW1lKEZpbGVQYXRoKTtcblxuICBpZiAoQmFzaWNTZXR0aW5ncy5wYXJ0RXh0ZW5zaW9ucy5pbmNsdWRlcyhmaWxlRXh0LnN1YnN0cmluZygxKSkpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyAoaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiKVxuICBlbHNlIGlmIChmaWxlRXh0ID09ICcnKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNbaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiXTtcblxuICByZXR1cm4gRmlsZVBhdGg7XG59XG5cbmNvbnN0IFNhdmVkTW9kdWxlcyA9IHt9LCBQcmVwYXJlTWFwID0ge307XG5cbi8qKlxuICogTG9hZEltcG9ydCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIHRvIGEgZmlsZSwgYW5kIHJldHVybnMgdGhlIG1vZHVsZSB0aGF0IGlzIGF0IHRoYXQgcGF0aFxuICogQHBhcmFtIHtzdHJpbmdbXX0gaW1wb3J0RnJvbSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY3JlYXRlZCB0aGlzIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBJblN0YXRpY1BhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBbdXNlRGVwc10gLSBUaGlzIGlzIGEgbWFwIG9mIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHdpdGhvdXRDYWNoZSAtIGFuIGFycmF5IG9mIHBhdGhzIHRoYXQgd2lsbCBub3QgYmUgY2FjaGVkLlxuICogQHJldHVybnMgVGhlIG1vZHVsZSB0aGF0IHdhcyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gTG9hZEltcG9ydChpbXBvcnRGcm9tOiBzdHJpbmdbXSwgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIHsgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGUgPSBbXSwgb25seVByZXBhcmUgfTogeyBpc0RlYnVnOiBib29sZWFuLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSwgb25seVByZXBhcmU/OiBib29sZWFuIH0pIHtcbiAgbGV0IFRpbWVDaGVjazogYW55O1xuICBjb25zdCBvcmlnaW5hbFBhdGggPSBwYXRoLm5vcm1hbGl6ZShJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG5cbiAgSW5TdGF0aWNQYXRoID0gQWRkRXh0ZW5zaW9uKEluU3RhdGljUGF0aCk7XG4gIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShJblN0YXRpY1BhdGgpLnN1YnN0cmluZygxKSwgdGhpc0N1c3RvbSA9IGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGgsIGV4dGVuc2lvbikgfHwgIVsnanMnLCAndHMnXS5pbmNsdWRlcyhleHRlbnNpb24pO1xuICBjb25zdCBTYXZlZE1vZHVsZXNQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoKSwgZmlsZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBJblN0YXRpY1BhdGgpO1xuXG4gIGlmKGltcG9ydEZyb20uaW5jbHVkZXMoU2F2ZWRNb2R1bGVzUGF0aCkpe1xuICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICBlcnJvck5hbWU6ICdjaXJjbGUtaW1wb3J0JyxcbiAgICAgIHRleHQ6IGBJbXBvcnQgJyR7U2F2ZWRNb2R1bGVzUGF0aH0nIGNyZWF0ZXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5IDxjb2xvcj4ke2ltcG9ydEZyb20uc2xpY2UoaW1wb3J0RnJvbS5pbmRleE9mKFNhdmVkTW9kdWxlc1BhdGgpKS5jb25jYXQoZmlsZVBhdGgpLmpvaW4oJyAtPlxcbicpfWBcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBudWxsXG4gICAgdXNlRGVwc1tJblN0YXRpY1BhdGhdID0geyB0aGlzRmlsZTogLTEgfTtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy93YWl0IGlmIHRoaXMgbW9kdWxlIGlzIG9uIHByb2Nlc3MsIGlmIG5vdCBkZWNsYXJlIHRoaXMgYXMgb24gcHJvY2VzcyBtb2R1bGVcbiAgbGV0IHByb2Nlc3NFbmQ6ICh2PzogYW55KSA9PiB2b2lkO1xuICBpZiAoIW9ubHlQcmVwYXJlKSB7XG4gICAgaWYgKCFTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0pXG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IHByb2Nlc3NFbmQgPSByKTtcbiAgICBlbHNlIGlmIChTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgYXdhaXQgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuICB9XG5cblxuICAvL2J1aWxkIHBhdGhzXG4gIGNvbnN0IHJlQnVpbGQgPSAhcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gfHwgcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gIT0gKFRpbWVDaGVjayA9IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCkpO1xuXG5cbiAgaWYgKHJlQnVpbGQpIHtcbiAgICBUaW1lQ2hlY2sgPSBUaW1lQ2hlY2sgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKTtcbiAgICBpZiAoVGltZUNoZWNrID09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7SW5TdGF0aWNQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gPGNvbG9yPicke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRofS8ke2ltcG9ydEZyb20uYXQoLTEpfSdgXG4gICAgICB9KTtcbiAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbnVsbFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpc0N1c3RvbSkgLy8gb25seSBpZiBub3QgY3VzdG9tIGJ1aWxkXG4gICAgICBhd2FpdCBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gICAgcGFnZURlcHMudXBkYXRlKFNhdmVkTW9kdWxlc1BhdGgsIFRpbWVDaGVjayk7XG4gIH1cblxuICBpZiAodXNlRGVwcykge1xuICAgIHVzZURlcHNbSW5TdGF0aWNQYXRoXSA9IHsgdGhpc0ZpbGU6IFRpbWVDaGVjayB9O1xuICAgIHVzZURlcHMgPSB1c2VEZXBzW0luU3RhdGljUGF0aF07XG4gIH1cblxuICBjb25zdCBpbmhlcml0YW5jZUNhY2hlID0gd2l0aG91dENhY2hlWzBdID09IEluU3RhdGljUGF0aDtcbiAgaWYgKGluaGVyaXRhbmNlQ2FjaGUpXG4gICAgd2l0aG91dENhY2hlLnNoaWZ0KClcbiAgZWxzZSBpZiAoIXJlQnVpbGQgJiYgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdICYmICEoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgcmV0dXJuIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoSW5TdGF0aWNQYXRoKSwgcCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoWy4uLmltcG9ydEZyb20sIFNhdmVkTW9kdWxlc1BhdGhdLCBwLCB0eXBlQXJyYXksIHsgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlOiBpbmhlcml0YW5jZUNhY2hlID8gd2l0aG91dENhY2hlIDogW10gfSk7XG4gIH1cblxuICBsZXQgTXlNb2R1bGU6IGFueTtcbiAgaWYgKHRoaXNDdXN0b20pIHtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGgsIGZpbGVQYXRoLCBleHRlbnNpb24sIHJlcXVpcmVNYXApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlcXVpcmVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIpO1xuICAgIE15TW9kdWxlID0gSW1wb3J0V2l0aG91dENhY2hlKHJlcXVpcmVQYXRoKTtcblxuICAgIGlmIChvbmx5UHJlcGFyZSkgeyAvLyBvbmx5IHByZXBhcmUgdGhlIG1vZHVsZSB3aXRob3V0IGFjdGl2ZWx5IGltcG9ydGluZyBpdFxuICAgICAgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSA9ICgpID0+IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7IFxuICAgICAgTXlNb2R1bGUgPSBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwKTtcbiAgICB9XG4gICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LWVycm9yJyxcbiAgICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9PGNvbG9yPiR7aW1wb3J0RnJvbS5jb25jYXQoZmlsZVBhdGgpLnJldmVyc2UoKS5qb2luKCcgLT5cXG4nKX1gXG4gICAgICB9KTtcbiAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICB9XG4gIH1cblxuICAvL2luIGNhc2Ugb24gYW4gZXJyb3IgLSByZWxlYXNlIHRoZSBhc3luY1xuICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBNeU1vZHVsZTtcbiAgcHJvY2Vzc0VuZD8uKCk7XG5cblxuICByZXR1cm4gTXlNb2R1bGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbXBvcnRGaWxlKGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10pIHtcbiAgaWYgKCFpc0RlYnVnKSB7XG4gICAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCBoYXZlSW1wb3J0ID0gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gICAgaWYgKGhhdmVJbXBvcnQgIT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGhhdmVJbXBvcnQ7XG4gICAgZWxzZSBpZiAoUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSkge1xuICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSgpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbW9kdWxlO1xuICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTG9hZEltcG9ydChbaW1wb3J0RnJvbV0sIEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCB7IGlzRGVidWcsIHVzZURlcHMsIHdpdGhvdXRDYWNoZSB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVPbmNlKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgZmlsZVBhdGgsXG4gICAgdGVtcEZpbGUsXG4gICAgQ2hlY2tUcyhmaWxlUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBhd2FpdCBNeU1vZHVsZSgocGF0aDogc3RyaW5nKSA9PiBpbXBvcnQocGF0aCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUNqc1NjcmlwdChjb250ZW50OiBzdHJpbmcpIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG4gIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGVtcEZpbGUsIGNvbnRlbnQpO1xuXG4gIGNvbnN0IG1vZGVsID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIG1vZGVsO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmFrZSBzY3JpcHQgbG9jYXRpb24sIGEgZmlsZSBsb2NhdGlvbiwgYSB0eXBlIGFycmF5LCBhbmQgYSBib29sZWFuIGZvciB3aGV0aGVyIG9yIG5vdCBpdCdzXG4gKiBhIFR5cGVTY3JpcHQgZmlsZS4gSXQgdGhlbiBjb21waWxlcyB0aGUgc2NyaXB0IGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biB0aGUgbW9kdWxlXG4gKiBUaGlzIGlzIGZvciBSdW5UaW1lIENvbXBpbGUgU2NyaXB0c1xuICogQHBhcmFtIHtzdHJpbmd9IGdsb2JhbFByYW1zIC0gc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZyxcbiAqIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY3JpcHRMb2NhdGlvbiAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgc2NyaXB0IHRvIGJlIGNvbXBpbGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSAtIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBmaWxlIGZyb20gdGhlIHN0YXRpYyBmb2xkZXIuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBbc3RyaW5nLCBzdHJpbmddXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZVNjcmlwdCAtIGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBJZiB0cnVlLCB0aGUgY29kZSB3aWxsIGJlIGNvbXBpbGVkIHdpdGggZGVidWcgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZUNvZGUgLSBUaGUgY29kZSB0aGF0IHdpbGwgYmUgY29tcGlsZWQgYW5kIHNhdmVkIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU1hcENvbW1lbnQgLSBzdHJpbmdcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVJbXBvcnQoZ2xvYmFsUHJhbXM6IHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgbWVyZ2VUcmFjazogU3RyaW5nVHJhY2tlcikge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgdHlwZUFycmF5WzFdKTtcblxuICBjb25zdCBmdWxsU2F2ZUxvY2F0aW9uID0gc2NyaXB0TG9jYXRpb24gKyBcIi5janNcIjtcbiAgY29uc3QgdGVtcGxhdGVQYXRoID0gdHlwZUFycmF5WzBdICsgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlO1xuXG4gIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHNjcmlwdExvY2F0aW9uLFxuICAgIGZ1bGxTYXZlTG9jYXRpb24sXG4gICAgaXNUeXBlU2NyaXB0LFxuICAgIGlzRGVidWcsXG4gICAgeyBwYXJhbXM6IGdsb2JhbFByYW1zLCBtZXJnZVRyYWNrLCB0ZW1wbGF0ZVBhdGgsIGNvZGVNaW5pZnk6IGZhbHNlIH1cbiAgKTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHApO1xuXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoW3RlbXBsYXRlUGF0aF0sIHAsIHR5cGVBcnJheSwgeyBpc0RlYnVnIH0pO1xuICB9XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoZnVsbFNhdmVMb2NhdGlvbik7XG4gIHJldHVybiBhc3luYyAoLi4uYXJyOiBhbnlbXSkgPT4gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCwgLi4uYXJyKTtcbn0iLCAiaW1wb3J0IHsgU3RyaW5nTWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgTWluaVNlYXJjaCwge1NlYXJjaE9wdGlvbnMsIFNlYXJjaFJlc3VsdH0gZnJvbSAnbWluaXNlYXJjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFJlY29yZCB7XG4gICAgcHJpdmF0ZSBmdWxsUGF0aDogc3RyaW5nXG4gICAgcHJpdmF0ZSBpbmRleERhdGE6IHtba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIHRpdGxlczogU3RyaW5nTWFwLFxuICAgICAgICB0ZXh0OiBzdHJpbmdcbiAgICB9fVxuICAgIHByaXZhdGUgbWluaVNlYXJjaDogTWluaVNlYXJjaDtcbiAgICBjb25zdHJ1Y3RvcihmaWxlcGF0aDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5mdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGZpbGVwYXRoICsgJy5qc29uJ1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoKXtcbiAgICAgICAgdGhpcy5pbmRleERhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZnVsbFBhdGgpO1xuICAgICAgICBjb25zdCB1bndyYXBwZWQ6IHtpZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nfVtdID0gW107XG5cbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IoY29uc3QgcGF0aCBpbiB0aGlzLmluZGV4RGF0YSl7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5pbmRleERhdGFbcGF0aF07XG4gICAgICAgICAgICBmb3IoY29uc3QgaWQgaW4gZWxlbWVudC50aXRsZXMpe1xuICAgICAgICAgICAgICAgIHVud3JhcHBlZC5wdXNoKHtpZDogY291bnRlcisrLCB0ZXh0OiBlbGVtZW50LnRpdGxlc1tpZF0sIHVybDogYC8ke3BhdGh9IyR7aWR9YH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGV4dCwgdXJsOiBgLyR7cGF0aH1gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2ggPSBuZXcgTWluaVNlYXJjaCh7XG4gICAgICAgICAgICBmaWVsZHM6IFsndGV4dCddLFxuICAgICAgICAgICAgc3RvcmVGaWVsZHM6IFsnaWQnLCAndGV4dCcsICd1cmwnXVxuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLm1pbmlTZWFyY2guYWRkQWxsQXN5bmModW53cmFwcGVkKTtcbiAgICB9XG5cbi8qKlxuICogSXQgc2VhcmNoZXMgZm9yIGEgc3RyaW5nIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIG1hdGNoZXNcbiAqIEBwYXJhbSB0ZXh0IC0gVGhlIHRleHQgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSBvcHRpb25zIC0gbGVuZ3RoIC0gbWF4aW11bSBsZW5ndGggLSAqbm90IGN1dHRpbmcgaGFsZiB3b3JkcypcbiAqIFxuICogYWRkQWZ0ZXJNYXhMZW5ndGggLSBhZGQgdGV4dCBpZiBhIHRleHQgcmVzdWx0IHJlYWNoIHRoZSBtYXhpbXVtIGxlbmd0aCwgZm9yIGV4YW1wbGUgJy4uLidcbiAqIEBwYXJhbSB0YWcgLSBUaGUgdGFnIHRvIHdyYXAgYXJvdW5kIHRoZSBmb3VuZGVkIHNlYXJjaCB0ZXJtcy5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIG9iamVjdHMsIGVhY2ggb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGB0ZXh0YCBvZiB0aGUgc2VhcmNoIHJlc3VsdCwgYGxpbmtgIHRvIHRoZSBwYWdlLCBhbmQgYW4gYXJyYXkgb2ZcbiAqIG9iamVjdHMgY29udGFpbmluZyB0aGUgdGVybXMgYW5kIHRoZSBpbmRleCBvZiB0aGUgdGVybSBpbiB0aGUgdGV4dC5cbiAqL1xuICAgIHNlYXJjaCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgJiB7bGVuZ3RoPzogbnVtYmVyLCBhZGRBZnRlck1heExlbmd0aD86IHN0cmluZ30gPSB7ZnV6enk6IHRydWUsIGxlbmd0aDogMjAwLCBhZGRBZnRlck1heExlbmd0aDogJy4uLid9LCB0YWcgPSAnYicpOiAoU2VhcmNoUmVzdWx0ICYge3RleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9KVtde1xuICAgICAgICBjb25zdCBkYXRhID0gPGFueT50aGlzLm1pbmlTZWFyY2guc2VhcmNoKHRleHQsIG9wdGlvbnMpO1xuICAgICAgICBpZighdGFnKSByZXR1cm4gZGF0YTtcblxuICAgICAgICBmb3IoY29uc3QgaSBvZiBkYXRhKXtcbiAgICAgICAgICAgIGZvcihjb25zdCB0ZXJtIG9mIGkudGVybXMpe1xuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubGVuZ3RoICYmIGkudGV4dC5sZW5ndGggPiBvcHRpb25zLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IGkudGV4dC5zdWJzdHJpbmcoMCwgb3B0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZihpLnRleHRbb3B0aW9ucy5sZW5ndGhdLnRyaW0oKSAhPSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBzdWJzdHJpbmcuc3Vic3RyaW5nKDAsIHN1YnN0cmluZy5sYXN0SW5kZXhPZignICcpKSArIChvcHRpb25zLmFkZEFmdGVyTWF4TGVuZ3RoID8/ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IHN1YnN0cmluZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IGkudGV4dC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBsb3dlciA9IGkudGV4dC50b0xvd2VyQ2FzZSgpLCByZWJ1aWxkID0gJyc7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICBsZXQgYmVlbkxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShpbmRleCAhPSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHJlYnVpbGQgKz0gaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoLCBiZWVuTGVuZ3RoICsgaW5kZXgpICsgIGA8JHt0YWd9PiR7aS50ZXh0LnN1YnN0cmluZyhpbmRleCArIGJlZW5MZW5ndGgsIGluZGV4ICsgdGVybS5sZW5ndGggKyBiZWVuTGVuZ3RoKX08LyR7dGFnfT5gXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbG93ZXIuc3Vic3RyaW5nKGluZGV4ICsgdGVybS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBiZWVuTGVuZ3RoICs9IGluZGV4ICsgdGVybS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpLnRleHQgPSByZWJ1aWxkICsgaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHN1Z2dlc3QodGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluaVNlYXJjaC5hdXRvU3VnZ2VzdCh0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG59IiwgImltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSBcIi4uLy4uLy4uL0dsb2JhbC9TZWFyY2hSZWNvcmRcIlxuaW1wb3J0IHtTZXR0aW5nc30gIGZyb20gJy4uLy4uLy4uL01haW5CdWlsZC9TZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG59IiwgImltcG9ydCBwYWNrYWdlRXhwb3J0IGZyb20gXCIuL3BhY2thZ2VFeHBvcnRcIjtcblxuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGFsaWFzTmFtZXMgPSBbcGFja2FnZU5hbWVdXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGg6IHN0cmluZyk6IGFueSB7XG5cbiAgICBzd2l0Y2ggKG9yaWdpbmFsUGF0aCkge1xuICAgICAgICAvL0B0cy1pZ25vcmUtbmV4dC1saW5lXG4gICAgICAgIGNhc2UgcGFja2FnZU5hbWU6XG4gICAgICAgICAgICByZXR1cm4gcGFja2FnZUV4cG9ydCgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXNPclBhY2thZ2Uob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXZlID0gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoaGF2ZSkgcmV0dXJuIGhhdmVcbiAgICByZXR1cm4gaW1wb3J0KG9yaWdpbmFsUGF0aCk7XG59IiwgImltcG9ydCBJbXBvcnRBbGlhcywgeyBhbGlhc05hbWVzIH0gZnJvbSAnLi9BbGlhcyc7XG5pbXBvcnQgSW1wb3J0QnlFeHRlbnNpb24sIHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuL0V4dGVuc2lvbi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikgfHwgYWxpYXNOYW1lcy5pbmNsdWRlcyhvcmlnaW5hbFBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nLCByZXF1aXJlOiAocDogc3RyaW5nKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGlhc0V4cG9ydCA9IGF3YWl0IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGFsaWFzRXhwb3J0KSByZXR1cm4gYWxpYXNFeHBvcnQ7XG4gICAgcmV0dXJuIEltcG9ydEJ5RXh0ZW5zaW9uKGZ1bGxQYXRoLCBleHRlbnNpb24pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBSYXpvclRvRUpTLCBSYXpvclRvRUpTTWluaSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyJztcblxuXG5jb25zdCBhZGRXcml0ZU1hcCA9IHtcbiAgICBcImluY2x1ZGVcIjogXCJhd2FpdCBcIixcbiAgICBcImltcG9ydFwiOiBcImF3YWl0IFwiLFxuICAgIFwidHJhbnNmZXJcIjogXCJyZXR1cm4gYXdhaXQgXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBvcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKUyh0ZXh0LmVxKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhzdWJzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU9JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlOiR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZFdyaXRlTWFwW2kubmFtZV19JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuXG4vKipcbiAqIENvbnZlcnRTeW50YXhNaW5pIHRha2VzIHRoZSBjb2RlIGFuZCBhIHNlYXJjaCBzdHJpbmcgYW5kIGNvbnZlcnQgY3VybHkgYnJhY2tldHNcbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbmQgLSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWRkRUpTIC0gVGhlIHN0cmluZyB0byBhZGQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlanMuXG4gKiBAcmV0dXJucyBBIHN0cmluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXhNaW5pKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbmQ6IHN0cmluZywgYWRkRUpTOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTTWluaSh0ZXh0LmVxLCBmaW5kKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICBpZiAodmFsdWVzW2ldICE9IHZhbHVlc1tpICsgMV0pXG4gICAgICAgICAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpXSwgdmFsdWVzW2kgKyAxXSkpO1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaSArIDJdLCB2YWx1ZXNbaSArIDNdKTtcbiAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZEVKU30ke3N1YnN0cmluZ30lPmA7XG4gICAgfVxuXG4gICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZygodmFsdWVzLmF0KC0xKT8/LTEpICsgMSkpO1xuXG4gICAgcmV0dXJuIGJ1aWxkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBvb2wgfSBmcm9tIFwiLi4vQmFzZVJlYWRlci9SZWFkZXJcIjtcblxuYXN5bmMgZnVuY3Rpb24gSFRNTEF0dHJQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc2s6IG51bWJlcixcbiAgICBlazogbnVtYmVyLFxuICAgIHN2OiBudW1iZXIsXG4gICAgZXY6IG51bWJlcixcbiAgICBzcGFjZTogYm9vbGVhbixcbiAgICBjaGFyOiBzdHJpbmdcbn1bXT4ge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgcG9vbC5leGVjKCdIVE1MQXR0clBhcnNlcicsIFt0ZXh0XSlcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ0RhdGFQYXJzZXIge1xuICAgIHZhbHVlQXJyYXk6IHtcbiAgICAgICAga2V5PzogU3RyaW5nVHJhY2tlclxuICAgICAgICB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsXG4gICAgICAgIHNwYWNlOiBib29sZWFuLFxuICAgICAgICBjaGFyPzogc3RyaW5nXG4gICAgfVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGV4dDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VyKCkge1xuICAgICAgICBjb25zdCBwYXJzZSA9IGF3YWl0IEhUTUxBdHRyUGFyc2VyKHRoaXMudGV4dC5lcSk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGNoYXIsIGVrLCBldiwgc2ssIHNwYWNlLCBzdiB9IG9mIHBhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGNoYXIsIHNwYWNlLCBrZXk6IHRoaXMudGV4dC5zdWJzdHJpbmcoc2ssIGVrKSwgdmFsdWU6IHN2ID09IGV2ID8gdHJ1ZSA6IHRoaXMudGV4dC5zdWJzdHJpbmcoc3YsIGV2KSB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3BJdGVtKGtleTogc3RyaW5nKXtcbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09IC0xID8gbnVsbDogdGhpcy52YWx1ZUFycmF5LnNwbGljZShpbmRleCwgMSkuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBwb3BUcmFja2VyKGtleTogc3RyaW5nKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0VHJhY2tlcjxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wVHJhY2tlcihrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlUcmFja2VyPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFRyYWNrZXIoa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gZGF0YS5lcTogdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wU3RyaW5nKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gdmFsdWUuZXEgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BCb29sZWFuKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMucG9wU3RyaW5nKGtleSkgPz8gZGVmYXVsdFZhbHVlKVxuICAgIH1cblxuICAgIGV4aXN0cyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSkgIT0gbnVsbFxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YTogdmFsdWU7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSAnY2xhc3MnKTtcbiAgICAgICAgaWYgKGhhdmU/LnZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcilcbiAgICAgICAgICAgIGhhdmUudmFsdWUuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcgKyBjbGFzc05hbWUpLnRyaW1TdGFydCgpO1xuICAgICAgICBlbHNlIGlmIChoYXZlPy52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaGF2ZS52YWx1ZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hWYWx1ZSgnY2xhc3MnLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVidWlsZFNwYWNlKCkge1xuICAgICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgdmFsdWUsIGNoYXIsIGtleSwgc3BhY2UgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIHNwYWNlICYmIG5ld0F0dHJpYnV0ZXMuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBwdXNoVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpO1xuICAgICAgICBpZiAoaGF2ZSkgcmV0dXJuIChoYXZlLnZhbHVlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpKTtcblxuICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwga2V5KSwgdmFsdWU6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKSwgY2hhcjogJ1wiJywgc3BhY2U6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgbWFwKCkge1xuICAgICAgICBjb25zdCBhdHRyTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IHRydWUgfSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSBhdHRyTWFwW2tleS5lcV0gPSB2YWx1ZSA9PT0gdHJ1ZSA/IHRydWUgOiB2YWx1ZS5lcTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyTWFwO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0X2ZpbGUgPSBydW5fc2NyaXB0X25hbWUuc3BsaXQoLy0+fDxsaW5lPi8pLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPChsaW5lfGNvbG9yKT4vZ2ksICc8YnIvPicpICsgJzwvcD48cD5FcnJvciBtZXNzYWdlOiAnICsgZS5tZXNzYWdlICsgJzwvcD5gKX0nO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBhdGg6IFwiICsgcnVuX3NjcmlwdF9uYW1lLnNsaWNlKDAsIC1sYXN0X2ZpbGUubGVuZ3RoKS5yZXBsYWNlKC88bGluZT4vZ2ksICdcXFxcbicpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCl9XCIgKyBsYXN0X2ZpbGUudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIG1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJ1bm5pbmcgdGhpcyBjb2RlOiBcXFxcXCJcIiArIHJ1bl9zY3JpcHRfY29kZSArICdcIicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc3RhY2s6IFwiICsgZS5zdGFjayk7XG4gICAgICAgICAgICAgICAgfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGB9fSk7fWApO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgICAgICBjb25zdCBidWlsdENvZGUgPSBhd2FpdCBQYWdlVGVtcGxhdGUuUnVuQW5kRXhwb3J0KHRleHQsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5kZWJ1Zyk7XG5cbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5BZGRQYWdlVGVtcGxhdGUoYnVpbHRDb2RlLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgc3RhdGljIEFkZEFmdGVyQnVpbGQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIEluUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGRhdGFPYmplY3Q6IGFueSwgZnVsbFBhdGg6IHN0cmluZykge1xuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGA8JSF7XG4gICAgICAgICAgICBjb25zdCBfcGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gey4uLl9wYWdlJHtkYXRhT2JqZWN0ID8gJywnICsgZGF0YU9iamVjdCA6ICcnfX07XG4gICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAgeyU+YCk7XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCc8JSF9fX0lPicpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgUmF6b3JTeW50YXggZnJvbSAnLi9SYXpvclN5bnRheCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2V0U3ludGF4KENvbXBpbGVUeXBlOiBhbnkpIHtcbiAgICBsZXQgZnVuYzogYW55O1xuICAgIHN3aXRjaCAoQ29tcGlsZVR5cGUubmFtZSB8fCBDb21waWxlVHlwZSkge1xuICAgICAgICBjYXNlIFwiUmF6b3JcIjpcbiAgICAgICAgICAgIGZ1bmMgPSBSYXpvclN5bnRheDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbn0iLCAiaW1wb3J0IEFkZFN5bnRheCBmcm9tICcuL1N5bnRheC9JbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkUGx1Z2luIHtcblx0cHVibGljIFNldHRpbmdzT2JqZWN0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihTZXR0aW5nc09iamVjdDoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICAgICAgdGhpcy5TZXR0aW5nc09iamVjdCA9IFNldHRpbmdzT2JqZWN0XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZGVmYXVsdFN5bnRheCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5TZXR0aW5nc09iamVjdC5CYXNpY0NvbXBpbGF0aW9uU3ludGF4LmNvbmNhdCh0aGlzLlNldHRpbmdzT2JqZWN0LkFkZENvbXBpbGVTeW50YXgpO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkQmFzaWModGV4dDogU3RyaW5nVHJhY2tlciwgT0RhdGE6c3RyaW5nIHxhbnksIHBhdGg6c3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9hZGQgU3ludGF4XG5cbiAgICAgICAgaWYgKCFPRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoT0RhdGEpKSB7XG4gICAgICAgICAgICBPRGF0YSA9IFtPRGF0YV07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgT0RhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IFN5bnRheCA9IGF3YWl0IEFkZFN5bnRheChpKTtcblxuICAgICAgICAgICAgaWYgKFN5bnRheCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBhd2FpdCBTeW50YXgodGV4dCwgaSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgcGFnZXNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBjb21wb25lbnRzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZENvbXBvbmVudCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufSIsICIvL2dsb2JhbCBzZXR0aW5ncyBmb3IgYnVpbGQgaW4gY29tcG9uZW50c1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7XG4gICAgcGx1Z2luczogW11cbn07IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuL1NjcmlwdFRlbXBsYXRlJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCwgUGFyc2VEZWJ1Z0xpbmUsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCAqIGFzIGV4dHJpY2F0ZSBmcm9tICcuL1hNTEhlbHBlcnMvRXh0cmljYXRlJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tICcuL3RyYW5zZm9ybS9TY3JpcHQnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgQnVpbGRTY3JpcHRTZXR0aW5ncyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzJztcbmltcG9ydCBQYXJzZUJhc2VQYWdlIGZyb20gJy4vQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuaW1wb3J0IHsgZmluYWxpemVCdWlsZCB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0geyBBZGRDb21waWxlU3ludGF4OiBbXSwgcGx1Z2luczogW10sIEJhc2ljQ29tcGlsYXRpb25TeW50YXg6IFsnUmF6b3InXSB9O1xuY29uc3QgUGx1Z2luQnVpbGQgPSBuZXcgQWRkUGx1Z2luKFNldHRpbmdzKTtcbmV4cG9ydCBjb25zdCBDb21wb25lbnRzID0gbmV3IEluc2VydENvbXBvbmVudChQbHVnaW5CdWlsZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRQbHVnaW4obmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLnBsdWdpbnMuZmluZChiID0+IGIgPT0gbmFtZSB8fCAoPGFueT5iKT8ubmFtZSA9PSBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNvbWVQbHVnaW5zKC4uLmRhdGE6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGRhdGEuc29tZSh4ID0+IEdldFBsdWdpbih4KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RzKCkge1xuICAgIHJldHVybiBTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4LmluY2x1ZGVzKCdUeXBlU2NyaXB0Jyk7XG59XG5cbkNvbXBvbmVudHMuTWljcm9QbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcbkNvbXBvbmVudHMuR2V0UGx1Z2luID0gR2V0UGx1Z2luO1xuQ29tcG9uZW50cy5Tb21lUGx1Z2lucyA9IFNvbWVQbHVnaW5zO1xuQ29tcG9uZW50cy5pc1RzID0gaXNUcztcblxuQnVpbGRTY3JpcHRTZXR0aW5ncy5wbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcblxuYXN5bmMgZnVuY3Rpb24gb3V0UGFnZShkYXRhOiBTdHJpbmdUcmFja2VyLCBzY3JpcHRGaWxlOiBTdHJpbmdUcmFja2VyLCBwYWdlUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcblxuICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGRhdGEsIGlzVHMoKSk7XG4gICAgaWYoIWF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgcGFnZU5hbWUsIHtkeW5hbWljQ2hlY2t9KSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlbE5hbWUgPSBiYXNlRGF0YS5kZWZhdWx0VmFsdWVQb3BBbnkoJ21vZGVsJywgJ3dlYnNpdGUnKTtcblxuICAgIGlmICghbW9kZWxOYW1lKSByZXR1cm4gc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUsIGJhc2VEYXRhLmNsZWFyRGF0YSk7XG4gICAgZGF0YSA9IGJhc2VEYXRhLmNsZWFyRGF0YTtcblxuICAgIC8vaW1wb3J0IG1vZGVsXG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgbW9kZWxOYW1lLCAnTW9kZWxzJywgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMubW9kZWwpOyAvLyBmaW5kIGxvY2F0aW9uIG9mIHRoZSBmaWxlXG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bGxQYXRoKSkge1xuICAgICAgICBjb25zdCBFcnJvck1lc3NhZ2UgPSBgRXJyb3IgbW9kZWwgbm90IGZvdW5kIC0+ICR7bW9kZWxOYW1lfSBhdCBwYWdlICR7cGFnZU5hbWV9YDtcblxuICAgICAgICBwcmludC5lcnJvcihFcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQsIFBhZ2VUZW1wbGF0ZS5wcmludEVycm9yKEVycm9yTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLCBGdWxsUGF0aCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhmYWxzZSwgcGFnZU5hbWUsIEZ1bGxQYXRoLCBTbWFsbFBhdGgpOyAvLyByZWFkIG1vZGVsXG4gICAgbGV0IG1vZGVsRGF0YSA9IGF3YWl0IFBhcnNlQmFzZVBhZ2UucmVidWlsZEJhc2VJbmhlcml0YW5jZShiYXNlTW9kZWxEYXRhLmFsbERhdGEpO1xuXG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgbW9kZWxEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICBwYWdlTmFtZSArPSBcIiAtPiBcIiArIFNtYWxsUGF0aDtcblxuICAgIC8vR2V0IHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IGFsbERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ3MobW9kZWxEYXRhLCBbJyddLCAnOicsIGZhbHNlLCB0cnVlKTtcblxuICAgIGlmIChhbGxEYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3Igd2l0aGluIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBtb2RlbERhdGEgPSBhbGxEYXRhLmRhdGE7XG4gICAgY29uc3QgdGFnQXJyYXkgPSBhbGxEYXRhLmZvdW5kLm1hcCh4ID0+IHgudGFnLnN1YnN0cmluZygxKSk7XG4gICAgY29uc3Qgb3V0RGF0YSA9IGV4dHJpY2F0ZS5nZXREYXRhVGFncyhkYXRhLCB0YWdBcnJheSwgJ0AnKTtcblxuICAgIGlmIChvdXREYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgV2l0aCBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy9CdWlsZCBXaXRoIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1vZGVsQnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIGFsbERhdGEuZm91bmQpIHtcbiAgICAgICAgaS50YWcgPSBpLnRhZy5zdWJzdHJpbmcoMSk7IC8vIHJlbW92aW5nIHRoZSAnOidcbiAgICAgICAgY29uc3QgaG9sZGVyRGF0YSA9IG91dERhdGEuZm91bmQuZmluZCgoZSkgPT4gZS50YWcgPT0gJ0AnICsgaS50YWcpO1xuXG4gICAgICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEuc3Vic3RyaW5nKDAsIGkubG9jKSk7XG4gICAgICAgIG1vZGVsRGF0YSA9IG1vZGVsRGF0YS5zdWJzdHJpbmcoaS5sb2MpO1xuXG4gICAgICAgIGlmIChob2xkZXJEYXRhKSB7XG4gICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMoaG9sZGVyRGF0YS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHsgLy8gVHJ5IGxvYWRpbmcgZGF0YSBmcm9tIHBhZ2UgYmFzZVxuICAgICAgICAgICAgY29uc3QgbG9hZEZyb21CYXNlID0gYmFzZURhdGEuZ2V0KGkudGFnKTtcblxuICAgICAgICAgICAgaWYgKGxvYWRGcm9tQmFzZSAmJiBsb2FkRnJvbUJhc2UgIT09IHRydWUgJiYgbG9hZEZyb21CYXNlLmVxLnRvTG93ZXJDYXNlKCkgIT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhsb2FkRnJvbUJhc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YSk7XG5cbiAgICByZXR1cm4gYXdhaXQgb3V0UGFnZShtb2RlbEJ1aWxkLCBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSksIEZ1bGxQYXRoLCBwYWdlTmFtZSwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbnNlcnQoZGF0YTogc3RyaW5nLCBmdWxsUGF0aENvbXBpbGU6IHN0cmluZywgbmVzdGVkUGFnZTogYm9vbGVhbiwgbmVzdGVkUGFnZURhdGE6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZHluYW1pY0NoZWNrPzogYm9vbGVhbikge1xuICAgIGxldCBEZWJ1Z1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgZGF0YSk7XG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBvdXRQYWdlKERlYnVnU3RyaW5nLCBuZXcgU3RyaW5nVHJhY2tlcihEZWJ1Z1N0cmluZy5EZWZhdWx0SW5mb1RleHQpLCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLCBkeW5hbWljQ2hlY2spO1xuXG4gICAgaWYoRGVidWdTdHJpbmcgPT0gbnVsbCl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBsdWdpbkJ1aWxkLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgQ29tcG9uZW50cy5JbnNlcnQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pOyAvLyBhZGQgY29tcG9uZW50c1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYXJzZURlYnVnTGluZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcblxuICAgIGlmIChuZXN0ZWRQYWdlKSB7IC8vIHJldHVybiBTdHJpbmdUcmFja2VyLCBiZWNhdXNlIHRoaXMgaW1wb3J0IHdhcyBmcm9tIHBhZ2VcbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5JblBhZ2VUZW1wbGF0ZShEZWJ1Z1N0cmluZywgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvLmZ1bGxQYXRoKTtcbiAgICB9XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IGZpbmFsaXplQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLCBmdWxsUGF0aENvbXBpbGUpO1xuICAgIFxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFnZVRlbXBsYXRlLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMoRGVidWdTdHJpbmcpO1xuICAgIERlYnVnU3RyaW5nPSBQYWdlVGVtcGxhdGUuQWRkQWZ0ZXJCdWlsZChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgcmV0dXJuIERlYnVnU3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJ1aWxkSlMsIEJ1aWxkSlNYLCBCdWlsZFRTLCBCdWlsZFRTWCB9IGZyb20gJy4vRm9yU3RhdGljL1NjcmlwdCc7XG5pbXBvcnQgQnVpbGRTdmVsdGUgZnJvbSAnLi9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFN0eWxlU2FzcyB9IGZyb20gJy4vRm9yU3RhdGljL1N0eWxlJztcbmltcG9ydCB7IGdldFR5cGVzLCBTeXN0ZW1EYXRhLCBnZXREaXJuYW1lLCBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgUmVzcG9uc2UsIFJlcXVlc3QgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHByb21wdGx5IGZyb20gJ3Byb21wdGx5JztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcblxuY29uc3QgU3VwcG9ydGVkVHlwZXMgPSBbJ2pzJywgJ3N2ZWx0ZScsICd0cycsICdqc3gnLCAndHN4JywgJ2NzcycsICdzYXNzJywgJ3Njc3MnXTtcblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU3RhdGljRmlsZXMnKTtcblxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG8gPSBTdGF0aWNGaWxlc0luZm8uc3RvcmVbcGF0aF07XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbykge1xuICAgICAgICBsZXQgcCA9IGk7XG5cbiAgICAgICAgaWYgKGkgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgcCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBGaWxlUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IG9baV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICFvO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkRmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZnVsbENvbXBpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKFNtYWxsUGF0aCkuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgZGVwZW5kZW5jaWVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xuICAgIHN3aXRjaCAoZXh0KSB7XG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3NzJzpcbiAgICAgICAgY2FzZSAnc2Fzcyc6XG4gICAgICAgIGNhc2UgJ3Njc3MnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdHlsZVNhc3MoU21hbGxQYXRoLCBleHQsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N2ZWx0ZSc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN2ZWx0ZShTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgZnVsbENvbXBpbGVQYXRoICs9ICcuanMnO1xuICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxDb21waWxlUGF0aCkpIHtcbiAgICAgICAgU3RhdGljRmlsZXNJbmZvLnVwZGF0ZShTbWFsbFBhdGgsIGRlcGVuZGVuY2llcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghaXNEZWJ1ZylcbiAgICAgICAgcmV0dXJuIHRydWU7XG59XG5cbmludGVyZmFjZSBidWlsZEluIHtcbiAgICBwYXRoPzogc3RyaW5nO1xuICAgIGV4dD86IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgaW5TZXJ2ZXI/OiBzdHJpbmc7XG59XG5cbmNvbnN0IHN0YXRpY0ZpbGVzID0gU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL2NsaWVudC8nO1xuY29uc3QgZ2V0U3RhdGljOiBidWlsZEluW10gPSBbe1xuICAgIHBhdGg6IFwic2Vydi90ZW1wLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwiYnVpbGRUZW1wbGF0ZS5qc1wiXG59LFxue1xuICAgIHBhdGg6IFwic2Vydi9jb25uZWN0LmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFrZUNvbm5lY3Rpb24uanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvbWQuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJtYXJrZG93bkNvcHkuanNcIlxufV07XG5cbmNvbnN0IGdldFN0YXRpY0ZpbGVzVHlwZTogYnVpbGRJbltdID0gW3tcbiAgICBleHQ6ICcucHViLmpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIubWpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIuY3NzJyxcbiAgICB0eXBlOiAnY3NzJ1xufV07XG5cbmFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkQnlUeXBlKFJlcXVlc3Q6IFJlcXVlc3QsIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmb3VuZCA9IGdldFN0YXRpY0ZpbGVzVHlwZS5maW5kKHggPT4gZmlsZVBhdGguZW5kc1dpdGgoeC5leHQpKTtcblxuICAgIGlmICghZm91bmQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgY29uc3QgYmFzZVBhdGggPSBSZXF1ZXN0LnF1ZXJ5LnQgPT0gJ2wnID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXTtcbiAgICBjb25zdCBpblNlcnZlciA9IHBhdGguam9pbihiYXNlUGF0aCwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoaW5TZXJ2ZXIpKVxuICAgICAgICByZXR1cm4geyAuLi5mb3VuZCwgaW5TZXJ2ZXIgfTtcbn1cblxubGV0IGRlYnVnZ2luZ1dpdGhTb3VyY2U6IG51bGwgfCBib29sZWFuID0gbnVsbDtcblxuaWYgKGFyZ3YuaW5jbHVkZXMoJ2FsbG93U291cmNlRGVidWcnKSlcbiAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gdHJ1ZTtcbmFzeW5jIGZ1bmN0aW9uIGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSB7XG4gICAgaWYgKHR5cGVvZiBkZWJ1Z2dpbmdXaXRoU291cmNlID09ICdib29sZWFuJylcbiAgICAgICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG5cbiAgICB0cnkge1xuICAgICAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gKGF3YWl0IHByb21wdGx5LnByb21wdChcbiAgICAgICAgICAgICdBbGxvdyBkZWJ1Z2dpbmcgSmF2YVNjcmlwdC9DU1MgaW4gc291cmNlIHBhZ2U/IC0gZXhwb3NpbmcgeW91ciBzb3VyY2UgY29kZSAobm8pJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iodjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ3llcycsICdubyddLmluY2x1ZGVzKHYudHJpbSgpLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigneWVzIG9yIG5vJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwICogMzBcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSkudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT0gJ3llcyc7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIH0gY2F0Y2ggeyB9XG5cblxuICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xufVxuXG5jb25zdCBzYWZlRm9sZGVycyA9IFtnZXRUeXBlcy5TdGF0aWNbMl0sIGdldFR5cGVzLkxvZ3NbMl0sICdNb2RlbHMnLCAnQ29tcG9uZW50cyddO1xuLyoqXG4gKiBJZiB0aGUgdXNlciBpcyBpbiBkZWJ1ZyBtb2RlLCBhbmQgdGhlIGZpbGUgaXMgYSBzb3VyY2UgZmlsZSwgYW5kIHRoZSB1c2VyIGNvbW1lbmQgbGluZSBhcmd1bWVudCBoYXZlIGFsbG93U291cmNlRGVidWdcbiAqIHRoZW4gcmV0dXJuIHRoZSBmdWxsIHBhdGggdG8gdGhlIGZpbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGlzIHRoZSBjdXJyZW50IHBhZ2UgYSBkZWJ1ZyBwYWdlP1xuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggb2YgdGhlIGZpbGUgdGhhdCB3YXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZCAtIElmIHRoaXMgcGF0aCBhbHJlYWR5IGJlZW4gY2hlY2tlZFxuICogdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgdHlwZSBvZiB0aGUgZmlsZSBhbmQgdGhlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVuc2FmZURlYnVnKGlzRGVidWc6IGJvb2xlYW4sIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWlzRGVidWcgfHwgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpIHx8IHBhdGguZXh0bmFtZShmaWxlUGF0aCkgIT0gJy5zb3VyY2UnIHx8ICFzYWZlRm9sZGVycy5pbmNsdWRlcyhmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5zaGlmdCgpKSB8fCAhYXdhaXQgYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDcpKTsgLy8gcmVtb3ZpbmcgJy5zb3VyY2UnXG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3R5bGUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGJhc2VGaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA0KTsgLy8gcmVtb3ZpbmcgJy5jc3MnXG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBmaWxlUGF0aDtcblxuICAgIGxldCBleGlzdHM6IGJvb2xlYW47XG4gICAgaWYgKHBhdGguZXh0bmFtZShiYXNlRmlsZVBhdGgpID09ICcuc3ZlbHRlJyAmJiAoY2hlY2tlZCB8fCAoZXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiAhZXhpc3RzKSB7XG4gICAgICAgIGF3YWl0IEJ1aWxkRmlsZShiYXNlRmlsZVBhdGgsIGlzRGVidWcsIGdldFR5cGVzLlN0YXRpY1sxXSArIGJhc2VGaWxlUGF0aClcbiAgICAgICAgcmV0dXJuIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoLCBjaGVja2VkLCBmYWxzZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdGF0aWMoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9zdmVsdGUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDQpICsgKHBhdGguZXh0bmFtZShmaWxlUGF0aCkgPyAnJyA6ICcvaW5kZXgubWpzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnanMnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25Db2RlVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC9jb2RlLXRoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDE4KTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25UaGVtZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L21kL3RoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBsZXQgZmlsZU5hbWUgPSBmaWxlUGF0aC5zdWJzdHJpbmcoMTQpO1xuICAgIGlmIChmaWxlTmFtZS5zdGFydHNXaXRoKCdhdXRvJykpXG4gICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyaW5nKDQpXG4gICAgZWxzZVxuICAgICAgICBmaWxlTmFtZSA9ICctJyArIGZpbGVOYW1lO1xuXG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJyArIGZpbGVOYW1lLnJlcGxhY2UoJy5jc3MnLCAnLm1pbi5jc3MnKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VydmVyQnVpbGQoUmVxdWVzdDogUmVxdWVzdCwgaXNEZWJ1ZzogYm9vbGVhbiwgcGF0aDogc3RyaW5nLCBjaGVja2VkID0gZmFsc2UpOiBQcm9taXNlPG51bGwgfCBidWlsZEluPiB7XG4gICAgcmV0dXJuIGF3YWl0IHN2ZWx0ZVN0YXRpYyhwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBzdmVsdGVTdHlsZShwYXRoLCBjaGVja2VkLCBpc0RlYnVnKSB8fFxuICAgICAgICBhd2FpdCB1bnNhZmVEZWJ1Zyhpc0RlYnVnLCBwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0LCBwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93blRoZW1lKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IG1hcmtkb3duQ29kZVRoZW1lKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGdldFN0YXRpYy5maW5kKHggPT4geC5wYXRoID09IHBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVidWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpICYmIGF3YWl0IEJ1aWxkRmlsZShTbWFsbFBhdGgsIGlzRGVidWcsIGZ1bGxDb21waWxlUGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBSZXF1ZXN0OiBSZXF1ZXN0LCBSZXNwb25zZTogUmVzcG9uc2UpIHtcbiAgICAvL2ZpbGUgYnVpbHQgaW5cbiAgICBjb25zdCBpc0J1aWxkSW4gPSBhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBpc0RlYnVnLCBTbWFsbFBhdGgsIHRydWUpO1xuXG4gICAgaWYgKGlzQnVpbGRJbikge1xuICAgICAgICBSZXNwb25zZS50eXBlKGlzQnVpbGRJbi50eXBlKTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShpc0J1aWxkSW4uaW5TZXJ2ZXIpKTsgLy8gc2VuZGluZyB0aGUgZmlsZVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy9jb21waWxlZCBmaWxlc1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIFNtYWxsUGF0aDtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIFNtYWxsUGF0aDtcblxuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKCFTdXBwb3J0ZWRUeXBlcy5pbmNsdWRlcyhleHQpKSB7XG4gICAgICAgIFJlc3BvbnNlLnNlbmRGaWxlKGZ1bGxQYXRoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChbJ3Nhc3MnLCAnc2NzcycsICdjc3MnXS5pbmNsdWRlcyhleHQpKSB7IC8vIGFkZGluZyB0eXBlXG4gICAgICAgIFJlc3BvbnNlLnR5cGUoJ2NzcycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFJlc3BvbnNlLnR5cGUoJ2pzJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlc1BhdGggPSBmdWxsQ29tcGlsZVBhdGg7XG5cbiAgICAvLyByZS1jb21waWxpbmcgaWYgbmVjZXNzYXJ5IG9uIGRlYnVnIG1vZGVcbiAgICBpZiAoaXNEZWJ1ZyAmJiAoUmVxdWVzdC5xdWVyeS5zb3VyY2UgPT0gJ3RydWUnIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpICYmICFhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpKSkge1xuICAgICAgICByZXNQYXRoID0gZnVsbFBhdGg7XG4gICAgfSBlbHNlIGlmIChleHQgPT0gJ3N2ZWx0ZScpXG4gICAgICAgIHJlc1BhdGggKz0gJy5qcyc7XG5cbiAgICBSZXNwb25zZS5lbmQoYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocmVzUGF0aCwgJ3V0ZjgnKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbn0iLCAiaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSwgUGFyc2VyQ29uZmlnIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBlc1RhcmdldCwgVHJhbnNmb3JtSlNDIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5ncyc7XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIHBhcnNlcj86IFBhcnNlckNvbmZpZywgb3B0aW9uc05hbWU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmdWxsUGF0aCxcbiAgICAgICAgc291cmNlRmlsZU5hbWU6IGlucHV0UGF0aCArICc/c291cmNlPXRydWUnLFxuICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICBwYXJzZXI6IHtcbiAgICAgICAgICAgICAgICAuLi5wYXJzZXIsXG4gICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSxcbiAgICAgICAgICAgICAgICAuLi5HZXRQbHVnaW4ob3B0aW9uc05hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyB0eXBlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VNYXBzOiBpc0RlYnVnID8gJ2lubGluZScgOiBmYWxzZVxuICAgIH07XG5cbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IChhd2FpdCB0cmFuc2Zvcm0ocmVzdWx0LCBBZGRPcHRpb25zKSkuY29kZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgcmVzdWx0KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ2pzJywgaXNEZWJ1Zyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzJywgaXNEZWJ1ZywgeyBzeW50YXg6ICd0eXBlc2NyaXB0JywgZGVjb3JhdG9yczogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ2pzeCcsIGlzRGVidWcsIHsgc3ludGF4OiAnZWNtYXNjcmlwdCcsIGpzeDogdHJ1ZSB9LCAnSlNYT3B0aW9ucycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAndHN4JywgaXNEZWJ1ZywgeyBzeW50YXg6ICd0eXBlc2NyaXB0JywgdHN4OiB0cnVlLCBkZWNvcmF0b3JzOiB0cnVlLCB9LCAnVFNYT3B0aW9ucycpO1xufVxuIiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSBcIkBzd2MvY29yZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZVwiO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50LCBNZXJnZVNvdXJjZU1hcCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlRXJyb3IsIFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5pbXBvcnQgeyBlc1RhcmdldCwgVHJhbnNmb3JtSlNDIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGluU3RhdGljUGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNQYXRoO1xuXG4gICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXMsIG1hcCwgc2NyaXB0TGFuZyB9ID0gYXdhaXQgcHJlcHJvY2VzcyhmdWxsUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5TdGF0aWNQYXRoKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZ1bGxQYXRoLnNwbGl0KC9cXC98XFwvLykucG9wKCk7XG4gICAgbGV0IGpzOiBhbnksIGNzczogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgZGV2OiBpc0RlYnVnLFxuICAgICAgICAgICAgc291cmNlbWFwOiBtYXAsXG4gICAgICAgICAgICBjc3M6IGZhbHNlLFxuICAgICAgICAgICAgaHlkcmF0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHN2ZWx0ZVBhdGg6ICcvc2Vydi9zdmVsdGUnXG4gICAgICAgIH0pO1xuICAgICAgICBQcmludFN2ZWx0ZVdhcm4ob3V0cHV0Lndhcm5pbmdzLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAganMgPSBvdXRwdXQuanM7XG4gICAgICAgIGNzcyA9IG91dHB1dC5jc3M7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgUHJpbnRTdmVsdGVFcnJvcihlcnIsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGhpc0ZpbGU6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHNvdXJjZUZpbGVDbGllbnQgPSBqcy5tYXAuc291cmNlc1swXS5zdWJzdHJpbmcoMSk7XG5cbiAgICBpZihpc0RlYnVnKXtcbiAgICAgICAganMubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgIH1cblxuICAgIGlmIChTb21lUGx1Z2lucyhcIk1pbkpTXCIpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKGpzLmNvZGUsIHtcbiAgICAgICAgICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlcjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeW50YXg6IHNjcmlwdExhbmcgPT0gJ2pzJyA/ICdlY21hc2NyaXB0JzogJ3R5cGVzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKHNjcmlwdExhbmcudG9VcHBlckNhc2UoKSArXCJPcHRpb25zXCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgICAgICAgICAgc291cmNlTWFwczogaXNEZWJ1Z1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGpzLmNvZGUgPSBjb2RlO1xuICAgICAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgICAgIGpzLm1hcCA9IGF3YWl0IE1lcmdlU291cmNlTWFwKEpTT04ucGFyc2UobWFwKSwganMubWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhd2FpdCBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnIsIGpzLm1hcCwgZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAganMuY29kZSArPSB0b1VSTENvbW1lbnQoanMubWFwKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICAgICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5qcycsIGpzLmNvZGUpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5jc3MnLCBjc3MuY29kZSA/PyAnJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZXBlbmRlbmNpZXMsXG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59IiwgImltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkx9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgIGNyZWF0ZUltcG9ydGVyLCBQcmludFNhc3NFcnJvciwgc2Fzc0FuZFNvdXJjZSwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU3R5bGVTYXNzKGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBcInNhc3NcIiB8IFwic2Nzc1wiIHwgXCJjc3NcIiwgaXNEZWJ1ZzogYm9vbGVhbik6IFByb21pc2U8eyBba2V5OiBzdHJpbmddOiBudW1iZXIgfT4ge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG5cbiAgICBjb25zdCBkZXBlbmRlbmNlT2JqZWN0ID0ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCksIGZpbGVEYXRhRGlybmFtZSA9IHBhdGguZGlybmFtZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhmaWxlRGF0YSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBpc0RlYnVnLFxuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KHR5cGUpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZSh0eXBlKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHJlc3VsdC5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jZU9iamVjdFtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKV0gPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhID0gcmVzdWx0LmNzcztcblxuICAgICAgICBpZiAoaXNEZWJ1ZyAmJiByZXN1bHQuc291cmNlTWFwKSB7XG4gICAgICAgICAgICBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHBhdGhUb0ZpbGVVUkwoZmlsZURhdGEpLmhyZWYpO1xuICAgICAgICAgICAgcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzID0gcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzLm1hcCh4ID0+IHBhdGgucmVsYXRpdmUoZmlsZURhdGFEaXJuYW1lLCBmaWxlVVJMVG9QYXRoKHgpKSArICc/c291cmNlPXRydWUnKTtcblxuICAgICAgICAgICAgZGF0YSArPSBgXFxyXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkocmVzdWx0LnNvdXJjZU1hcCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfSovYDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlcGVuZGVuY2VPYmplY3Rcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGlyZW50IH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgSW5zZXJ0LCBDb21wb25lbnRzLCBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgQ2xlYXJXYXJuaW5nIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJ1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgRGVsZXRlSW5EaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBSZXFTY3JpcHQgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBTdGF0aWNGaWxlcyBmcm9tICcuLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDb21waWxlU3RhdGUgZnJvbSAnLi9Db21waWxlU3RhdGUnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHsgY3JlYXRlU2l0ZU1hcCB9IGZyb20gJy4vU2l0ZU1hcCc7XG5pbXBvcnQgeyBleHRlbnNpb25JcywgaXNGaWxlVHlwZSwgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCB7IHBlckNvbXBpbGUsIHBvc3RDb21waWxlLCBwZXJDb21waWxlUGFnZSwgcG9zdENvbXBpbGVQYWdlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2NyaXB0VGVtcGxhdGUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5hc3luYyBmdW5jdGlvbiBjb21waWxlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB7IGlzRGVidWcsIGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrIH06IHsgaXNEZWJ1Zz86IGJvb2xlYW4sIGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZywgZHluYW1pY0NoZWNrPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCBGdWxsRmlsZVBhdGggPSBwYXRoLmpvaW4oYXJyYXlUeXBlWzBdLCBmaWxlUGF0aCksIEZ1bGxQYXRoQ29tcGlsZSA9IGFycmF5VHlwZVsxXSArIGZpbGVQYXRoICsgJy5janMnO1xuXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsRmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgY29uc3QgRXhjbHVVcmwgPSAobmVzdGVkUGFnZSA/IG5lc3RlZFBhZ2UgKyAnPGxpbmU+JyA6ICcnKSArIGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBoYXNTZXNzaW9uSW5mbyA/PyBuZXcgU2Vzc2lvbkJ1aWxkKGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoLCBGdWxsRmlsZVBhdGgsIGFycmF5VHlwZVsyXSwgaXNEZWJ1ZywgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpKTtcbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKCd0aGlzUGFnZScsIEZ1bGxGaWxlUGF0aCk7XG5cbiAgICBhd2FpdCBwZXJDb21waWxlUGFnZShzZXNzaW9uSW5mbywgRnVsbFBhdGhDb21waWxlKTtcbiAgICBjb25zdCBDb21waWxlZERhdGEgPSAoYXdhaXQgSW5zZXJ0KGh0bWwsIEZ1bGxQYXRoQ29tcGlsZSwgQm9vbGVhbihuZXN0ZWRQYWdlKSwgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvLCBkeW5hbWljQ2hlY2spKSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgIGF3YWl0IHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbywgRnVsbFBhdGhDb21waWxlKTtcblxuICAgIGlmICghbmVzdGVkUGFnZSAmJiBDb21waWxlZERhdGEubGVuZ3RoKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoRnVsbFBhdGhDb21waWxlLCBDb21waWxlZERhdGEuU3RyaW5nV2l0aFRhY2soRnVsbFBhdGhDb21waWxlKSk7XG4gICAgICAgIHBhZ2VEZXBzLnVwZGF0ZShFeGNsdVVybCwgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvIH07XG59XG5cbmZ1bmN0aW9uIFJlcXVpcmVTY3JpcHQoc2NyaXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gUmVxU2NyaXB0KFsnUHJvZHVjdGlvbiBMb2FkZXInXSwgc2NyaXB0LCBnZXRUeXBlcy5TdGF0aWMsIHsgaXNEZWJ1ZzogZmFsc2UsIG9ubHlQcmVwYXJlOiB0cnVlIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ta2RpcihhcnJheVR5cGVbMV0gKyBjb25uZWN0KTtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgICAgICBpZiAoYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKGFycmF5VHlwZVsyXSArICcvJyArIGNvbm5lY3QpKSAvL2NoZWNrIGlmIG5vdCBhbHJlYWR5IGNvbXBpbGUgZnJvbSBhICdpbi1maWxlJyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbXBpbGVGaWxlKGNvbm5lY3QsIGFycmF5VHlwZSwgeyBkeW5hbWljQ2hlY2s6ICFleHRlbnNpb25JcyhuLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVTY3JpcHQoY29ubmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgU3RhdGljRmlsZXMoY29ubmVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlU2NyaXB0cyhzY3JpcHRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBzY3JpcHRzKSB7XG4gICAgICAgIGF3YWl0IFJlcXVpcmVTY3JpcHQocGF0aCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBDcmVhdGVDb21waWxlKHQ6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHR5cGVzID0gZ2V0VHlwZXNbdF07XG4gICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkodHlwZXNbMV0pO1xuICAgIHJldHVybiAoKSA9PiBGaWxlc0luRm9sZGVyKHR5cGVzLCAnJywgc3RhdGUpO1xufVxuXG4vKipcbiAqIHdoZW4gcGFnZSBjYWxsIG90aGVyIHBhZ2U7XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZUluRmlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sICB7IGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrIH06IHsgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aCwgYXJyYXlUeXBlWzFdKTtcbiAgICByZXR1cm4gYXdhaXQgY29tcGlsZUZpbGUocGF0aCwgYXJyYXlUeXBlLCB7aXNEZWJ1Zzp0cnVlLCBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVja30pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKSB7XG4gICAgYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUocGF0aCwgYXJyYXlUeXBlLCB7ZHluYW1pY0NoZWNrfSk7XG4gICAgQ2xlYXJXYXJuaW5nKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlQWxsKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MpIHtcbiAgICBsZXQgc3RhdGUgPSAhYXJndi5pbmNsdWRlcygncmVidWlsZCcpICYmIGF3YWl0IENvbXBpbGVTdGF0ZS5jaGVja0xvYWQoKVxuXG4gICAgaWYgKHN0YXRlKSByZXR1cm4gKCkgPT4gUmVxdWlyZVNjcmlwdHMoc3RhdGUuc2NyaXB0cylcbiAgICBwYWdlRGVwcy5jbGVhcigpO1xuXG4gICAgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcblxuICAgIHBlckNvbXBpbGUoKTtcblxuICAgIGNvbnN0IGFjdGl2YXRlQXJyYXkgPSBbYXdhaXQgQ3JlYXRlQ29tcGlsZShnZXRUeXBlcy5TdGF0aWNbMl0sIHN0YXRlKSwgYXdhaXQgQ3JlYXRlQ29tcGlsZShnZXRUeXBlcy5Mb2dzWzJdLCBzdGF0ZSksIENsZWFyV2FybmluZ107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWN0aXZhdGVBcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgaSgpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmV4cG9ydCgpXG4gICAgICAgIHBhZ2VEZXBzLnNhdmUoKTtcbiAgICAgICAgcG9zdENvbXBpbGUoKVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGdldFNldHRpbmdzRGF0ZSB9IGZyb20gXCIuLi9NYWluQnVpbGQvSW1wb3J0TW9kdWxlXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbnR5cGUgQ1N0YXRlID0ge1xuICAgIHVwZGF0ZTogbnVtYmVyXG4gICAgcGFnZUFycmF5OiBzdHJpbmdbXVtdLFxuICAgIGltcG9ydEFycmF5OiBzdHJpbmdbXVxuICAgIGZpbGVBcnJheTogc3RyaW5nW11cbn1cblxuLyogVGhpcyBjbGFzcyBpcyB1c2VkIHRvIHN0b3JlIHRoZSBzdGF0ZSBvZiB0aGUgcHJvamVjdCAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZVN0YXRlIHtcbiAgICBwcml2YXRlIHN0YXRlOiBDU3RhdGUgPSB7IHVwZGF0ZTogMCwgcGFnZUFycmF5OiBbXSwgaW1wb3J0QXJyYXk6IFtdLCBmaWxlQXJyYXk6IFtdIH1cbiAgICBzdGF0aWMgZmlsZVBhdGggPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgXCJDb21waWxlU3RhdGUuanNvblwiKVxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnVwZGF0ZSA9IGdldFNldHRpbmdzRGF0ZSgpXG4gICAgfVxuXG4gICAgZ2V0IHNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmltcG9ydEFycmF5XG4gICAgfVxuXG4gICAgZ2V0IHBhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5wYWdlQXJyYXlcbiAgICB9XG5cbiAgICBnZXQgZmlsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmZpbGVBcnJheVxuICAgIH1cblxuICAgIGFkZFBhZ2UocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnBhZ2VBcnJheS5maW5kKHggPT4geFswXSA9PSBwYXRoICYmIHhbMV0gPT0gdHlwZSkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBhZ2VBcnJheS5wdXNoKFtwYXRoLCB0eXBlXSlcbiAgICB9XG5cbiAgICBhZGRJbXBvcnQocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGFkZEZpbGUocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5maWxlQXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZpbGVBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUoQ29tcGlsZVN0YXRlLmZpbGVQYXRoLCB0aGlzLnN0YXRlKVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjaGVja0xvYWQoKSB7XG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5maWxlUGF0aCkpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpXG4gICAgICAgIHN0YXRlLnN0YXRlID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZpbGVQYXRoKVxuXG4gICAgICAgIGlmIChzdGF0ZS5zdGF0ZS51cGRhdGUgIT0gZ2V0U2V0dGluZ3NEYXRlKCkpIHJldHVyblxuXG4gICAgICAgIHJldHVybiBzdGF0ZVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgSW1wb3J0RmlsZSwge0FkZEV4dGVuc2lvbiwgUmVxdWlyZU9uY2V9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge3ByaW50fSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gU3RhcnRSZXF1aXJlKGFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGFycmF5RnVuY1NlcnZlciA9IFtdO1xuICAgIGZvciAobGV0IGkgb2YgYXJyYXkpIHtcbiAgICAgICAgaSA9IEFkZEV4dGVuc2lvbihpKTtcblxuICAgICAgICBjb25zdCBiID0gYXdhaXQgSW1wb3J0RmlsZShbJ3Jvb3QgZm9sZGVyIChXV1cpJ10sIGksIGdldFR5cGVzLlN0YXRpYywge2lzRGVidWd9KTtcbiAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIuU3RhcnRTZXJ2ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJyYXlGdW5jU2VydmVyLnB1c2goYi5TdGFydFNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmludC5sb2coYENhbid0IGZpbmQgU3RhcnRTZXJ2ZXIgZnVuY3Rpb24gYXQgbW9kdWxlIC0gJHtpfVxcbmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RnVuY1NlcnZlcjtcbn1cblxubGV0IGxhc3RTZXR0aW5nc0ltcG9ydDogbnVtYmVyO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldFNldHRpbmdzKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pe1xuICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoICsgJy50cycpKXtcbiAgICAgICAgZmlsZVBhdGggKz0gJy50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggKz0gJy5qcydcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlVGltZSA9IDxhbnk+YXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbClcblxuICAgIGlmKGNoYW5nZVRpbWUgPT0gbGFzdFNldHRpbmdzSW1wb3J0IHx8ICFjaGFuZ2VUaW1lKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsYXN0U2V0dGluZ3NJbXBvcnQgPSBjaGFuZ2VUaW1lO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBSZXF1aXJlT25jZShmaWxlUGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIGRhdGEuZGVmYXVsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmdzRGF0ZSgpe1xuICAgIHJldHVybiBsYXN0U2V0dGluZ3NJbXBvcnRcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEltcG9ydEZpbGUgfSBmcm9tIFwiLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gXCIuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcywgeyBEaXJlbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gXCIuL0NvbXBpbGVTdGF0ZVwiO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSB9IGZyb20gXCIuL0ZpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9W107XG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2NhbkZpbGVzKCl7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLlN0YXRpYywgJycsIHN0YXRlKSxcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5Mb2dzLCAnJywgc3RhdGUpXG4gICAgXSlcbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWJ1Z1NpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyl7XG4gICAgcmV0dXJuIGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBhd2FpdCBzY2FuRmlsZXMoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB7IHJvdXRpbmcsIGRldmVsb3BtZW50IH0gPSBFeHBvcnQ7XG4gICAgaWYgKCFyb3V0aW5nLnNpdGVtYXApIHJldHVybjtcblxuICAgIGNvbnN0IHNpdGVtYXAgPSByb3V0aW5nLnNpdGVtYXAgPT09IHRydWUgPyB7fSA6IHJvdXRpbmcuc2l0ZW1hcDtcbiAgICBPYmplY3QuYXNzaWduKHNpdGVtYXAsIHtcbiAgICAgICAgcnVsZXM6IHRydWUsXG4gICAgICAgIHVybFN0b3A6IGZhbHNlLFxuICAgICAgICBlcnJvclBhZ2VzOiBmYWxzZSxcbiAgICAgICAgdmFsaWRQYXRoOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWdlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHVybHM6IC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGZvciAobGV0IFt1cmwsIHR5cGVdIG9mIHN0YXRlLnBhZ2VzKSB7XG5cbiAgICAgICAgaWYodHlwZSAhPSBnZXRUeXBlcy5TdGF0aWNbMl0gfHwgIXVybC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHVybCA9ICcvJyArIHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgaWYocGF0aC5leHRuYW1lKHVybCkgPT0gJy5zZXJ2JylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnVybFN0b3ApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gcGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2l0ZW1hcC5ydWxlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcucnVsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXdhaXQgcm91dGluZy5ydWxlc1twYXRoXSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoZW5kcyA9PiB1cmwuZW5kc1dpdGgoJy4nK2VuZHMpKSB8fFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVQYXRocy5maW5kKHN0YXJ0ID0+IHVybC5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2Ygcm91dGluZy52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWF3YWl0IGZ1bmModXJsKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2l0ZW1hcC5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVycm9yIGluIHJvdXRpbmcuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSAnLycgKyByb3V0aW5nLmVycm9yUGFnZXNbZXJyb3JdLnBhdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFnZXMucHVzaCh1cmwpO1xuICAgIH1cblxuICAgIGxldCB3cml0ZSA9IHRydWU7XG4gICAgaWYgKHNpdGVtYXAuZmlsZSkge1xuICAgICAgICBjb25zdCBmaWxlQWN0aW9uID0gYXdhaXQgSW1wb3J0RmlsZSgnU2l0ZW1hcCBJbXBvcnQnLCBzaXRlbWFwLmZpbGUsIGdldFR5cGVzLlN0YXRpYywgZGV2ZWxvcG1lbnQpO1xuICAgICAgICBpZighZmlsZUFjdGlvbj8uU2l0ZW1hcCl7XG4gICAgICAgICAgICBkdW1wLndhcm4oJ1xcJ1NpdGVtYXBcXCcgZnVuY3Rpb24gbm90IGZvdW5kIG9uIGZpbGUgLT4gJysgc2l0ZW1hcC5maWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdyaXRlID0gYXdhaXQgZmlsZUFjdGlvbi5TaXRlbWFwKHBhZ2VzLCBzdGF0ZSwgRXhwb3J0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKHdyaXRlICYmIHBhZ2VzLmxlbmd0aCl7XG4gICAgICAgIGNvbnN0IHBhdGggPSB3cml0ZSA9PT0gdHJ1ZSA/ICdzaXRlbWFwLnR4dCc6IHdyaXRlO1xuICAgICAgICBzdGF0ZS5hZGRGaWxlKHBhdGgpO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGdldFR5cGVzLlN0YXRpY1swXSArIHBhdGgsIHBhZ2VzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG59IiwgIi8qKlxuICogR2l2ZW4gYSBmaWxlIG5hbWUgYW5kIGFuIGV4dGVuc2lvbiwgcmV0dXJuIHRydWUgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggdGhlIGV4dGVuc2lvblxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHRuYW1lIC0gdGhlIGV4dGVuc2lvbiB0byBjaGVjayBmb3IuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbnNpb25JcyhuYW1lOiBzdHJpbmcsIGV4dG5hbWU6IHN0cmluZyl7XG4gICAgcmV0dXJuIG5hbWUuZW5kc1dpdGgoJy4nICsgZXh0bmFtZSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggb25lIG9mIHRoZSBnaXZlbiBmaWxlIHR5cGVzLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXMgLSBhbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaWxlVHlwZSh0eXBlczogc3RyaW5nW10sIG5hbWU6IHN0cmluZykge1xuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbklzKG5hbWUsdHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxhc3QgZG90IGFuZCBldmVyeXRoaW5nIGFmdGVyIGl0IGZyb20gYSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHJlbW92ZSB0aGUgZW5kIHR5cGUgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aG91dCB0aGUgbGFzdCBjaGFyYWN0ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZW1vdmVFbmRUeXBlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufSIsICJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgRmlsZXMgfSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgUmVxdWlyZUZpbGUgZnJvbSAnLi9JbXBvcnRGaWxlUnVudGltZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuXG5jb25zdCBFeHBvcnQgPSB7XG4gICAgUGFnZUxvYWRSYW06IHt9LFxuICAgIFBhZ2VSYW06IHRydWVcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSB0eXBlQXJyYXkgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoIHRvIHRoZVxuICogZmlsZS5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgZGljdGlvbmFyeSBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7YW55fSBEYXRhT2JqZWN0IC0gVGhlIGRhdGEgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVQYWdlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBSZXFGaWxlUGF0aCA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcbiAgICBjb25zdCByZXNNb2RlbCA9ICgpID0+IFJlcUZpbGVQYXRoLm1vZGVsKERhdGFPYmplY3QpO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBpZiAoUmVxRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKCFEYXRhT2JqZWN0LmlzRGVidWcpXG4gICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcblxuICAgICAgICBpZiAoUmVxRmlsZVBhdGguZGF0ZSA9PSAtMSkge1xuICAgICAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKFJlcUZpbGVQYXRoLnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWZpbGVFeGlzdHMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICghZXh0bmFtZSkge1xuICAgICAgICBleHRuYW1lID0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgZmlsZVBhdGggKz0gJy4nICsgZXh0bmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFBhdGg6IHN0cmluZztcbiAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKVxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGVQYXRoKTtcbiAgICAgZWxzZVxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIGZpbGVQYXRoKTtcblxuICAgIGlmICghW0Jhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudF0uaW5jbHVkZXMoZXh0bmFtZSkpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0VGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIERhdGFPYmplY3Qud3JpdGUoaW1wb3J0VGV4dCk7XG4gICAgICAgIHJldHVybiBpbXBvcnRUZXh0O1xuICAgIH1cblxuICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKTtcbiAgICBpZiAoIWZpbGVFeGlzdHMpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtjb3B5UGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tIDxjb2xvcj4nJHtfX2ZpbGVuYW1lfSdgXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogKCkgPT4geyB9LCBkYXRlOiAtMSwgcGF0aDogZnVsbFBhdGggfTtcbiAgICAgICAgcmV0dXJuIExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBpblN0YXRpY1BhdGggPSAgcGF0aC5yZWxhdGl2ZSh0eXBlQXJyYXlbMF0sZnVsbFBhdGgpO1xuICAgIGNvbnN0IFNtYWxsUGF0aCA9IHR5cGVBcnJheVsyXSArICcvJyArIGluU3RhdGljUGF0aDtcbiAgICBjb25zdCByZUJ1aWxkID0gRGF0YU9iamVjdC5pc0RlYnVnICYmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodHlwZUFycmF5WzFdICsgJy8nICtpblN0YXRpY1BhdGggKyAnLmNqcycpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpKTtcblxuICAgIGlmIChyZUJ1aWxkKVxuICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZShpblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgZXh0bmFtZSAhPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKTtcblxuXG4gICAgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdICYmICFyZUJ1aWxkKSB7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdWzBdIH07XG4gICAgICAgIHJldHVybiBhd2FpdCBMYXN0UmVxdWlyZVtjb3B5UGF0aF0ubW9kZWwoRGF0YU9iamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnVuYyA9IGF3YWl0IExvYWRQYWdlKFNtYWxsUGF0aCwgRGF0YU9iamVjdC5pc0RlYnVnKTtcbiAgICBpZiAoRXhwb3J0LlBhZ2VSYW0pIHtcbiAgICAgICAgaWYgKCFFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSkge1xuICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXVswXSA9IGZ1bmM7XG4gICAgfVxuXG4gICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogZnVuYyB9O1xuICAgIHJldHVybiBhd2FpdCBmdW5jKERhdGFPYmplY3QpO1xufVxuXG5jb25zdCBHbG9iYWxWYXIgPSB7fTtcblxuZnVuY3Rpb24gZ2V0RnVsbFBhdGhDb21waWxlKHVybDogc3RyaW5nKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG4gICAgY29uc3QgdHlwZUFycmF5ID0gZ2V0VHlwZXNbU3BsaXRJbmZvWzBdXTtcbiAgICByZXR1cm4gdHlwZUFycmF5WzFdICsgU3BsaXRJbmZvWzFdICsgJy5janMnO1xufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMIG9mIHRoZSBwYWdlIHRvIGxvYWQuXG4gKiBAcGFyYW0gZXh0IC0gVGhlIGV4dGVuc2lvbiBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIGRhdGEgb2JqZWN0IGFuZCByZXR1cm5zIGEgc3RyaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZSh1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuXG4gICAgY29uc3QgdHlwZUFycmF5ID0gZ2V0VHlwZXNbU3BsaXRJbmZvWzBdXTtcbiAgICBjb25zdCBMYXN0UmVxdWlyZSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gX3JlcXVpcmUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVGaWxlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgRGF0YU9iamVjdC5pc0RlYnVnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5jbHVkZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZywgV2l0aE9iamVjdCA9IHt9KSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlUGFnZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIHsgLi4uV2l0aE9iamVjdCwgLi4uRGF0YU9iamVjdCB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfdHJhbnNmZXIocDogc3RyaW5nLCBwcmVzZXJ2ZUZvcm06IGJvb2xlYW4sIHdpdGhPYmplY3Q6IGFueSwgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55KSB7XG4gICAgICAgIERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCA9ICcnO1xuXG4gICAgICAgIGlmICghcHJlc2VydmVGb3JtKSB7XG4gICAgICAgICAgICBjb25zdCBwb3N0RGF0YSA9IERhdGFPYmplY3QuUmVxdWVzdC5ib2R5ID8ge30gOiBudWxsO1xuICAgICAgICAgICAgRGF0YU9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICAuLi5EYXRhT2JqZWN0LFxuICAgICAgICAgICAgICAgIFJlcXVlc3Q6IHsgLi4uRGF0YU9iamVjdC5SZXF1ZXN0LCBmaWxlczoge30sIHF1ZXJ5OiB7fSwgYm9keTogcG9zdERhdGEgfSxcbiAgICAgICAgICAgICAgICBQb3N0OiBwb3N0RGF0YSwgUXVlcnk6IHt9LCBGaWxlczoge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIERhdGFPYmplY3QsIHAsIHdpdGhPYmplY3QpO1xuXG4gICAgfVxuXG4gICAgY29uc3QgY29tcGlsZWRQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgU3BsaXRJbmZvWzFdICsgJy5janMnKTtcbiAgICBjb25zdCBwcml2YXRlX3ZhciA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoY29tcGlsZWRQYXRoKTtcblxuICAgICAgICByZXR1cm4gTXlNb2R1bGUoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxldCBlcnJvclRleHQ6IHN0cmluZztcblxuICAgICAgICBpZihpc0RlYnVnKXtcbiAgICAgICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgcGF0aCAtPiBcIiwgUmVtb3ZlRW5kVHlwZSh1cmwpLCBcIi0+XCIsIGUubWVzc2FnZSk7XG4gICAgICAgICAgICBwcmludC5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICAgIGVycm9yVGV4dCA9IEpTUGFyc2VyLnByaW50RXJyb3IoYEVycm9yIHBhdGg6ICR7dXJsfTxici8+RXJyb3IgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvclRleHQgPSBKU1BhcnNlci5wcmludEVycm9yKGBFcnJvciBjb2RlOiAke2UuY29kZX1gKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChEYXRhT2JqZWN0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIERhdGFPYmplY3QuUmVxdWVzdC5lcnJvciA9IGU7XG4gICAgICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gZXJyb3JUZXh0O1xuICAgICAgICB9XG5cbiAgICB9XG59XG4vKipcbiAqIEl0IHRha2VzIGEgZnVuY3Rpb24gdGhhdCBwcmVwYXJlIGEgcGFnZSwgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIGEgcGFnZVxuICogQHBhcmFtIExvYWRQYWdlRnVuYyAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBpbiBhIHBhZ2UgdG8gZXhlY3V0ZSBvblxuICogQHBhcmFtIHtzdHJpbmd9IHJ1bl9zY3JpcHRfbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY3JpcHQgdG8gcnVuLlxuICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5cbmZ1bmN0aW9uIEJ1aWxkUGFnZShMb2FkUGFnZUZ1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gdm9pZCwgcnVuX3NjcmlwdF9uYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBQYWdlVmFyID0ge307XG5cbiAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChSZXNwb25zZTogUmVzcG9uc2UsIFJlcXVlc3Q6IFJlcXVlc3QsIFBvc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCBudWxsLCBRdWVyeTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgQ29va2llczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgU2Vzc2lvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRmlsZXM6IEZpbGVzLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG91dF9ydW5fc2NyaXB0ID0geyB0ZXh0OiAnJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nSW5mbyhzdHI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgYXNTdHJpbmcgPSBzdHI/LnRvU3RyaW5nPy4oKTtcbiAgICAgICAgICAgIGlmIChhc1N0cmluZyA9PSBudWxsIHx8IGFzU3RyaW5nLnN0YXJ0c1dpdGgoJ1tvYmplY3QgT2JqZWN0XScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0ciwgbnVsbCwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSZXNwb25zZSh0ZXh0OiBhbnkpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0ID0gJycpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlU2FmZShzdHIgPSAnJykge1xuICAgICAgICAgICAgc3RyID0gVG9TdHJpbmdJbmZvKHN0cik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcmIycgKyBpLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlY2hvKGFycjogc3RyaW5nW10sIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFycltpXTtcbiAgICAgICAgICAgICAgICB3cml0ZVNhZmUocGFyYW1zW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnIuYXQoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZGlyZWN0UGF0aDogYW55ID0gZmFsc2U7XG5cbiAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QgPSAocGF0aDogc3RyaW5nLCBzdGF0dXM/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1cyhzdGF0dXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVzcG9uc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+UmVzcG9uc2UpLnJlbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0KFJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGaWxlKGZpbGVQYXRoLCBkZWxldGVBZnRlciA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSB7IGZpbGU6IGZpbGVQYXRoLCBkZWxldGVBZnRlciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRGF0YVNlbmQgPSB7XG4gICAgICAgICAgICBzZW5kRmlsZSxcbiAgICAgICAgICAgIHdyaXRlU2FmZSxcbiAgICAgICAgICAgIHdyaXRlLFxuICAgICAgICAgICAgZWNobyxcbiAgICAgICAgICAgIHNldFJlc3BvbnNlLFxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQsXG4gICAgICAgICAgICBydW5fc2NyaXB0X25hbWUsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBQb3N0LFxuICAgICAgICAgICAgUXVlcnksXG4gICAgICAgICAgICBTZXNzaW9uLFxuICAgICAgICAgICAgRmlsZXMsXG4gICAgICAgICAgICBDb29raWVzLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIFBhZ2VWYXIsXG4gICAgICAgICAgICBHbG9iYWxWYXIsXG4gICAgICAgICAgICBjb2RlYmFzZTogJydcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IExvYWRQYWdlRnVuYyhEYXRhU2VuZCk7XG5cbiAgICAgICAgcmV0dXJuIHsgb3V0X3J1bl9zY3JpcHQ6IG91dF9ydW5fc2NyaXB0LnRleHQsIHJlZGlyZWN0UGF0aCB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHsgTG9hZFBhZ2UsIEJ1aWxkUGFnZSwgZ2V0RnVsbFBhdGhDb21waWxlLCBFeHBvcnQsIFNwbGl0Rmlyc3QgfTtcbiIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBJbXBvcnRGaWxlLCBBZGRFeHRlbnNpb24gfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9BbGlhcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5cbnR5cGUgUmVxdWlyZUZpbGVzID0ge1xuICAgIHBhdGg6IHN0cmluZ1xuICAgIHN0YXR1cz86IG51bWJlclxuICAgIG1vZGVsOiBhbnlcbiAgICBkZXBlbmRlbmNpZXM/OiBTdHJpbmdBbnlNYXBcbiAgICBzdGF0aWM/OiBib29sZWFuXG59XG5cbmNvbnN0IENhY2hlUmVxdWlyZUZpbGVzID0ge307XG5cbi8qKlxuICogSXQgbWFrZXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IGRlcGVuZGVuY2llcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzIG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIGFycmF5IG9mIGJhc2UgcGF0aHNcbiAqIEBwYXJhbSBbYmFzZVBhdGhdIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBpcyBiZWluZyBjb21waWxlZC5cbiAqIEBwYXJhbSBjYWNoZSAtIEEgY2FjaGUgb2YgdGhlIGxhc3QgdGltZSBhIGZpbGUgd2FzIG1vZGlmaWVkLlxuICogQHJldHVybnMgQSBtYXAgb2YgZGVwZW5kZW5jaWVzLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlRGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llczogU3RyaW5nQW55TWFwLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBiYXNlUGF0aCA9ICcnLCBjYWNoZSA9IHt9KSB7XG4gICAgY29uc3QgZGVwZW5kZW5jaWVzTWFwOiBTdHJpbmdBbnlNYXAgPSB7fTtcbiAgICBjb25zdCBwcm9taXNlQWxsID0gW107XG4gICAgZm9yIChjb25zdCBbZmlsZVBhdGgsIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgIHByb21pc2VBbGwucHVzaCgoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhY2hlW2Jhc2VQYXRoXSlcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVbYmFzZVBhdGhdID0gYXdhaXQgRWFzeUZzLnN0YXQodHlwZUFycmF5WzBdICsgYmFzZVBhdGgsICdtdGltZU1zJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwWyd0aGlzRmlsZSddID0gY2FjaGVbYmFzZVBhdGhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbZmlsZVBhdGhdID0gYXdhaXQgbWFrZURlcGVuZGVuY2llcyg8YW55PnZhbHVlLCB0eXBlQXJyYXksIGZpbGVQYXRoLCBjYWNoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKSgpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlQWxsKTtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzTWFwO1xufVxuXG4vKipcbiAqIElmIHRoZSBvbGQgZGVwZW5kZW5jaWVzIGFuZCB0aGUgbmV3IGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jeSBtYXAuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLlxuICovXG5mdW5jdGlvbiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShvbGREZXBzW25hbWVdLCBuZXdEZXBzW25hbWVdKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gZGVwZW5kZW5jeSB0cmVlcywgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBuYW1lcyBvZiB0aGUgbW9kdWxlcyB0aGF0IGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0gW3BhcmVudF0gLSBUaGUgbmFtZSBvZiB0aGUgcGFyZW50IG1vZHVsZS5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncy4gRWFjaCBzdHJpbmcgcmVwcmVzZW50cyBhIGNoYW5nZSBpbiB0aGUgZGVwZW5kZW5jeVxuICogdHJlZS5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXAsIHBhcmVudCA9ICcnKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNoYW5nZUFycmF5ID0gW107XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFuZXdEZXBzW25hbWVdKSB7XG4gICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBnZXRDaGFuZ2VBcnJheShvbGREZXBzW25hbWVdLCBuZXdEZXBzW25hbWVdLCBuYW1lKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2goLi4uY2hhbmdlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFuZ2VBcnJheTtcbn1cblxuLyoqXG4gKiBJdCBpbXBvcnRzIGEgZmlsZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2ZpbGVuYW1lIC0gVGhlIGZpbGVuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZGlybmFtZSAtIFRoZSBkaXJlY3Rvcnkgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBwYXRocyB0eXBlcy5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgbWFwIG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhblxuICogQHJldHVybnMgVGhlIG1vZGVsIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IFJlcXVpcmVGaWxlcyB9LCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgUmVxRmlsZSA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcblxuICAgIGxldCBmaWxlRXhpc3RzOiBudW1iZXIsIG5ld0RlcHM6IFN0cmluZ0FueU1hcDtcbiAgICBpZiAoUmVxRmlsZSkge1xuXG4gICAgICAgIGlmICghaXNEZWJ1ZyB8fCBpc0RlYnVnICYmIChSZXFGaWxlLnN0YXR1cyA9PSAtMSkpXG4gICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcblxuICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLnN0YXQodHlwZUFycmF5WzBdICsgUmVxRmlsZS5wYXRoLCAnbXRpbWVNcycsIHRydWUsIDApO1xuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuXG4gICAgICAgICAgICBuZXdEZXBzID0gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhSZXFGaWxlLmRlcGVuZGVuY2llcywgdHlwZUFycmF5KTtcblxuICAgICAgICAgICAgaWYgKGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCBuZXdEZXBzKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcblxuICAgICAgICB9IGVsc2UgaWYgKFJlcUZpbGUuc3RhdHVzID09IDApXG4gICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3B5UGF0aCA9IGZpbGVQYXRoO1xuICAgIGxldCBzdGF0aWNfbW9kdWxlcyA9IGZhbHNlO1xuXG4gICAgaWYgKCFSZXFGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpXG4gICAgICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSwgX19kaXJuYW1lKSwgZmlsZVBhdGgpO1xuXG4gICAgICAgIGVsc2UgaWYgKGZpbGVQYXRoWzBdICE9ICcvJylcbiAgICAgICAgICAgIHN0YXRpY19tb2R1bGVzID0gdHJ1ZTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoID0gUmVxRmlsZS5wYXRoO1xuICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IFJlcUZpbGUuc3RhdGljO1xuICAgIH1cblxuICAgIGlmIChzdGF0aWNfbW9kdWxlcylcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgQWxpYXNPclBhY2thZ2UoY29weVBhdGgpLCBzdGF0dXM6IC0xLCBzdGF0aWM6IHRydWUsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGFkZCBzZXJ2LmpzIG9yIHNlcnYudHMgaWYgbmVlZGVkXG4gICAgICAgIGZpbGVQYXRoID0gQWRkRXh0ZW5zaW9uKGZpbGVQYXRoKTtcblxuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHR5cGVBcnJheVswXSArIGZpbGVQYXRoO1xuICAgICAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcblxuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgaGF2ZU1vZGVsID0gQ2FjaGVSZXF1aXJlRmlsZXNbZmlsZVBhdGhdO1xuICAgICAgICAgICAgaWYgKGhhdmVNb2RlbCAmJiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzID0gbmV3RGVwcyA/PyBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSkpKVxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IGhhdmVNb2RlbDtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0RlcHMgPSBuZXdEZXBzID8/IHt9O1xuXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgSW1wb3J0RmlsZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKF9fZmlsZW5hbWUpLCBmaWxlUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnLCBuZXdEZXBzLCBoYXZlTW9kZWwgJiYgZ2V0Q2hhbmdlQXJyYXkoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcykpLCBkZXBlbmRlbmNpZXM6IG5ld0RlcHMsIHBhdGg6IGZpbGVQYXRoIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IHt9LCBzdGF0dXM6IDAsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2ZpbGVQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gPGNvbG9yPicke19fZmlsZW5hbWV9J2BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBidWlsdE1vZGVsID0gTGFzdFJlcXVpcmVbY29weVBhdGhdO1xuICAgIENhY2hlUmVxdWlyZUZpbGVzW2J1aWx0TW9kZWwucGF0aF0gPSBidWlsdE1vZGVsO1xuXG4gICAgcmV0dXJuIGJ1aWx0TW9kZWwubW9kZWw7XG59IiwgImltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIHRyaW1UeXBlLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuXG4vLyAtLSBzdGFydCBvZiBmZXRjaCBmaWxlICsgY2FjaGUgLS1cblxudHlwZSBhcGlJbmZvID0ge1xuICAgIHBhdGhTcGxpdDogbnVtYmVyLFxuICAgIGRlcHNNYXA6IHsgW2tleTogc3RyaW5nXTogYW55IH1cbn1cblxuY29uc3QgYXBpU3RhdGljTWFwOiB7IFtrZXk6IHN0cmluZ106IGFwaUluZm8gfSA9IHt9O1xuXG4vKipcbiAqIEdpdmVuIGEgdXJsLCByZXR1cm4gdGhlIHN0YXRpYyBwYXRoIGFuZCBkYXRhIGluZm8gaWYgdGhlIHVybCBpcyBpbiB0aGUgc3RhdGljIG1hcFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB0aGUgdXNlciBpcyByZXF1ZXN0aW5nLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhdGhTcGxpdCAtIHRoZSBudW1iZXIgb2Ygc2xhc2hlcyBpbiB0aGUgdXJsLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAqL1xuZnVuY3Rpb24gZ2V0QXBpRnJvbU1hcCh1cmw6IHN0cmluZywgcGF0aFNwbGl0OiBudW1iZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXBpU3RhdGljTWFwKTtcbiAgICBmb3IgKGNvbnN0IGkgb2Yga2V5cykge1xuICAgICAgICBjb25zdCBlID0gYXBpU3RhdGljTWFwW2ldO1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkgJiYgZS5wYXRoU3BsaXQgPT0gcGF0aFNwbGl0KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNQYXRoOiBpLFxuICAgICAgICAgICAgICAgIGRhdGFJbmZvOiBlXG4gICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBBUEkgZmlsZSBmb3IgYSBnaXZlbiBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBBUEkuXG4gKiBAcmV0dXJucyBUaGUgcGF0aCB0byB0aGUgQVBJIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZpbmRBcGlQYXRoKHVybDogc3RyaW5nKSB7XG5cbiAgICB3aGlsZSAodXJsLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzdGFydFBhdGggPSBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzBdLCB1cmwgKyAnLmFwaScpO1xuICAgICAgICBjb25zdCBtYWtlUHJvbWlzZSA9IGFzeW5jICh0eXBlOiBzdHJpbmcpID0+IChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShzdGFydFBhdGggKyAnLicgKyB0eXBlKSAmJiB0eXBlKTtcblxuICAgICAgICBjb25zdCBmaWxlVHlwZSA9IChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgndHMnKSxcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCdqcycpXG4gICAgICAgIF0pKS5maWx0ZXIoeCA9PiB4KS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChmaWxlVHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1cmwgKyAnLmFwaS4nICsgZmlsZVR5cGU7XG5cbiAgICAgICAgdXJsID0gQ3V0VGhlTGFzdCgnLycsIHVybCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aFNwbGl0ID0gdXJsLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgIGxldCB7IHN0YXRpY1BhdGgsIGRhdGFJbmZvIH0gPSBnZXRBcGlGcm9tTWFwKHVybCwgcGF0aFNwbGl0KTtcblxuICAgIGlmICghZGF0YUluZm8pIHtcbiAgICAgICAgc3RhdGljUGF0aCA9IGF3YWl0IGZpbmRBcGlQYXRoKHVybCk7XG5cbiAgICAgICAgaWYgKHN0YXRpY1BhdGgpIHtcbiAgICAgICAgICAgIGRhdGFJbmZvID0ge1xuICAgICAgICAgICAgICAgIHBhdGhTcGxpdCxcbiAgICAgICAgICAgICAgICBkZXBzTWFwOiB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcGlTdGF0aWNNYXBbc3RhdGljUGF0aF0gPSBkYXRhSW5mbztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhSW5mbykge1xuICAgICAgICByZXR1cm4gYXdhaXQgTWFrZUNhbGwoXG4gICAgICAgICAgICBhd2FpdCBSZXF1aXJlRmlsZSgnLycgKyBzdGF0aWNQYXRoLCAnYXBpLWNhbGwnLCAnJywgZ2V0VHlwZXMuU3RhdGljLCBkYXRhSW5mby5kZXBzTWFwLCBpc0RlYnVnKSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIHVybC5zdWJzdHJpbmcoc3RhdGljUGF0aC5sZW5ndGggLSA2KSxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBuZXh0UHJhc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4vLyAtLSBlbmQgb2YgZmV0Y2ggZmlsZSAtLVxuY29uc3QgYmFuV29yZHMgPSBbJ3ZhbGlkYXRlVVJMJywgJ3ZhbGlkYXRlRnVuYycsICdmdW5jJywgJ2RlZmluZScsIC4uLmh0dHAuTUVUSE9EU107XG4vKipcbiAqIEZpbmQgdGhlIEJlc3QgUGF0aFxuICovXG5mdW5jdGlvbiBmaW5kQmVzdFVybE9iamVjdChvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nKSB7XG4gICAgbGV0IG1heExlbmd0aCA9IDAsIHVybCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBpLmxlbmd0aDtcbiAgICAgICAgaWYgKG1heExlbmd0aCA8IGxlbmd0aCAmJiB1cmxGcm9tLnN0YXJ0c1dpdGgoaSkgJiYgIWJhbldvcmRzLmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBsZW5ndGg7XG4gICAgICAgICAgICB1cmwgPSBpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBQYXJzZSBBbmQgVmFsaWRhdGUgVVJMXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlVVJMRGF0YSh2YWxpZGF0ZTogYW55LCB2YWx1ZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBsZXQgcHVzaERhdGEgPSB2YWx1ZSwgcmVzRGF0YSA9IHRydWUsIGVycm9yOiBzdHJpbmc7XG5cbiAgICBzd2l0Y2ggKHZhbGlkYXRlKSB7XG4gICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICBjYXNlIHBhcnNlRmxvYXQ6XG4gICAgICAgIGNhc2UgcGFyc2VJbnQ6XG4gICAgICAgICAgICBwdXNoRGF0YSA9ICg8YW55PnZhbGlkYXRlKSh2YWx1ZSk7XG4gICAgICAgICAgICByZXNEYXRhID0gIWlzTmFOKHB1c2hEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICBwdXNoRGF0YSA9IHZhbHVlICE9ICdmYWxzZSc7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXNEYXRhID0gdmFsdWUgPT0gJ3RydWUnIHx8IHZhbHVlID09ICdmYWxzZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdGUpKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ha2VWYWxpZCA9IGF3YWl0IHZhbGlkYXRlKHZhbHVlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWtlVmFsaWQgJiYgdHlwZW9mIG1ha2VWYWxpZCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZC52YWxpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hEYXRhID0gbWFrZVZhbGlkLnBhcnNlID8/IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQ7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvciwgZmllbGQgLSAnICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUudGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNEYXRhKVxuICAgICAgICBlcnJvciA9ICdWYWxpZGF0aW9uIGVycm9yIHdpdGggdmFsdWUgXCInICsgdmFsdWUgKyAnXCInO1xuXG4gICAgcmV0dXJuIFtlcnJvciwgcHVzaERhdGFdO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIHRoZSBVUkwgZGF0YSBhbmQgcGFyc2VzIGl0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IG9iaiAtIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgVVJMIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gVGhlIFVSTCB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSB7YW55fSBkZWZpbmVPYmplY3QgLSBBbGwgdGhlIGRlZmluaXRpb25zIHRoYXQgaGFzIGJlZW4gZm91bmRcbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSBtYWtlTWFzc2FnZSAtIENyZWF0ZSBhbiBlcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBwcm9wZXJ0eS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlZmluaXRpb24ob2JqOiBhbnksIHVybEZyb206IHN0cmluZywgZGVmaW5lT2JqZWN0OiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGlmICghb2JqLmRlZmluZSlcbiAgICAgICAgcmV0dXJuIHVybEZyb207XG5cbiAgICBjb25zdCB2YWxpZGF0ZUZ1bmMgPSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcbiAgICBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYyA9IG51bGw7XG4gICAgZGVsZXRlIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9iai5kZWZpbmUpIHtcbiAgICAgICAgY29uc3QgW2RhdGFTbGFzaCwgbmV4dFVybEZyb21dID0gU3BsaXRGaXJzdCgnLycsIHVybEZyb20pO1xuICAgICAgICB1cmxGcm9tID0gbmV4dFVybEZyb207XG5cbiAgICAgICAgY29uc3QgW2Vycm9yLCBuZXdEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YShvYmouZGVmaW5lW25hbWVdLCBkYXRhU2xhc2gsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgaWYoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgXG4gICAgICAgIGRlZmluZU9iamVjdFtuYW1lXSA9IG5ld0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgdmFsaWRhdGVGdW5jKGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycgPyB2YWxpZGF0ZTogJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJ307XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybEZyb20gfHwgJyc7XG59XG4vKipcbiAqIFRoZSBmdW5jdGlvbiB3aWxsIHBhcnNlIHRoZSB1cmwgYW5kIGZpbmQgdGhlIGJlc3QgbWF0Y2ggZm9yIHRoZSB1cmxcbiAqIEBwYXJhbSB7YW55fSBmaWxlTW9kdWxlIC0gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRob2QgdGhhdCB5b3Ugd2FudCB0byBjYWxsLlxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSB0aGUgdXJsIHRoYXQgdGhlIHVzZXIgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSAoKSA9PiBQcm9taXNlPGFueT5cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSwgdGhlIHJlcXVlc3QgaXMgcHJvY2Vzc2VkLiBJZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgZmFsc2UsIHRoZSByZXF1ZXN0IGlzIG5vdCBwcm9jZXNzZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIE1ha2VDYWxsKGZpbGVNb2R1bGU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxsb3dFcnJvckluZm8gPSAhR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpICYmIGlzRGVidWcsIG1ha2VNYXNzYWdlID0gKGU6IGFueSkgPT4gKGlzRGVidWcgPyBwcmludC5lcnJvcihlKSA6IG51bGwpICsgKGFsbG93RXJyb3JJbmZvID8gYCwgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCA6ICcnKTtcbiAgICBjb25zdCBtZXRob2QgPSBSZXF1ZXN0Lm1ldGhvZDtcbiAgICBsZXQgbWV0aG9kT2JqID0gZmlsZU1vZHVsZVttZXRob2RdIHx8IGZpbGVNb2R1bGUuZGVmYXVsdFttZXRob2RdOyAvL0xvYWRpbmcgdGhlIG1vZHVsZSBieSBtZXRob2RcbiAgICBsZXQgaGF2ZU1ldGhvZCA9IHRydWU7XG5cbiAgICBpZighbWV0aG9kT2JqKXtcbiAgICAgICAgaGF2ZU1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBtZXRob2RPYmogPSBmaWxlTW9kdWxlLmRlZmF1bHQgfHwgZmlsZU1vZHVsZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlTWV0aG9kID0gbWV0aG9kT2JqO1xuXG4gICAgY29uc3QgZGVmaW5lT2JqZWN0ID0ge307XG5cbiAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7IC8vIHJvb3QgbGV2ZWwgZGVmaW5pdGlvblxuICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuXG4gICAgbGV0IG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSk7XG5cbiAgICAvL3BhcnNlIHRoZSB1cmwgcGF0aFxuICAgIGZvcihsZXQgaSA9IDA7IGk8IDI7IGkrKyl7XG4gICAgICAgIHdoaWxlICgobmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcbiAgICAgICAgICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICAgICAgICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG4gICAgXG4gICAgICAgICAgICB1cmxGcm9tID0gdHJpbVR5cGUoJy8nLCB1cmxGcm9tLnN1YnN0cmluZyhuZXN0ZWRVUkwubGVuZ3RoKSk7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbmVzdGVkVVJMXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFoYXZlTWV0aG9kKXsgLy8gY2hlY2sgaWYgdGhhdCBhIG1ldGhvZFxuICAgICAgICAgICAgaGF2ZU1ldGhvZCA9IHRydWU7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9iaj8uZnVuYyAmJiBtZXRob2RPYmogfHwgYmFzZU1ldGhvZDsgLy8gaWYgdGhlcmUgaXMgYW4gJ2FueScgbWV0aG9kXG5cblxuICAgIGlmICghbWV0aG9kT2JqPy5mdW5jKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsZWZ0RGF0YSA9IHVybEZyb20uc3BsaXQoJy8nKTtcbiAgICBjb25zdCB1cmxEYXRhID0gW107XG5cblxuICAgIGxldCBlcnJvcjogc3RyaW5nO1xuICAgIGlmIChtZXRob2RPYmoudmFsaWRhdGVVUkwpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHZhbGlkYXRlXSBvZiBPYmplY3QuZW50cmllcyhtZXRob2RPYmoudmFsaWRhdGVVUkwpKSB7XG4gICAgICAgICAgICBjb25zdCBbZXJyb3JVUkwsIHB1c2hEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YSh2YWxpZGF0ZSwgbGVmdERhdGFbaW5kZXhdLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JVUkwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IDxzdHJpbmc+ZXJyb3JVUkw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybERhdGEucHVzaChwdXNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdXJsRGF0YS5wdXNoKC4uLmxlZnREYXRhKTtcblxuICAgIGlmICghZXJyb3IgJiYgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYyhsZWZ0RGF0YSwgUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZTtcbiAgICAgICAgZWxzZSBpZiAoIXZhbGlkYXRlKVxuICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGluZyBVUkwnO1xuICAgIH1cblxuICAgIGlmIChlcnJvcilcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvciB9KTtcblxuICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGxldCBhcGlSZXNwb25zZTogYW55LCBuZXdSZXNwb25zZTogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGFwaVJlc3BvbnNlID0gYXdhaXQgbWV0aG9kT2JqLmZ1bmMoUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEsIGRlZmluZU9iamVjdCwgbGVmdERhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGFsbG93RXJyb3JJbmZvKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiBlLm1lc3NhZ2UgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6ICc1MDAgLSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhcGlSZXNwb25zZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyB0ZXh0OiBhcGlSZXNwb25zZSB9O1xuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSBhcGlSZXNwb25zZSB8fCBuZXdSZXNwb25zZTtcblxuICAgIGZpbmFsU3RlcCgpOyAgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgaWYgKG5ld1Jlc3BvbnNlICE9IG51bGwpXG4gICAgICAgIFJlc3BvbnNlLmpzb24obmV3UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSBhcyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgR2V0RmlsZSBhcyBHZXRTdGF0aWNGaWxlLCBzZXJ2ZXJCdWlsZCB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgKiBhcyBGdW5jU2NyaXB0IGZyb20gJy4vRnVuY3Rpb25TY3JpcHQnO1xuaW1wb3J0IE1ha2VBcGlDYWxsIGZyb20gJy4vQXBpQ2FsbCc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmNvbnN0IHsgRXhwb3J0IH0gPSBGdW5jU2NyaXB0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yUGFnZXMge1xuICAgIG5vdEZvdW5kPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9LFxuICAgIHNlcnZlckVycm9yPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9XG59XG5cbmludGVyZmFjZSBHZXRQYWdlc1NldHRpbmdzIHtcbiAgICBDYWNoZURheXM6IG51bWJlcixcbiAgICBEZXZNb2RlOiBib29sZWFuLFxuICAgIENvb2tpZVNldHRpbmdzPzogYW55LFxuICAgIENvb2tpZXM/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBDb29raWVFbmNyeXB0ZXI/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBTZXNzaW9uU3RvcmU/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBFcnJvclBhZ2VzOiBFcnJvclBhZ2VzXG59XG5cbmNvbnN0IFNldHRpbmdzOiBHZXRQYWdlc1NldHRpbmdzID0ge1xuICAgIENhY2hlRGF5czogMSxcbiAgICBEZXZNb2RlOiB0cnVlLFxuICAgIEVycm9yUGFnZXM6IHt9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlVG9SYW0odXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVuY1NjcmlwdC5nZXRGdWxsUGF0aENvbXBpbGUodXJsKSkpIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF0gPSBbXTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0gPSBhd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHVybCwgaXNEZWJ1Zyk7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UoRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0sIHVybCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkQWxsUGFnZXNUb1JhbShpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHBhZ2VEZXBzLnN0b3JlKSB7XG4gICAgICAgIGlmICghRXh0ZW5zaW9uSW5BcnJheShpLCA8YW55PkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkpKVxuICAgICAgICAgICAgYXdhaXQgTG9hZFBhZ2VUb1JhbShpLCBpc0RlYnVnKTtcblxuICAgIH1cbn1cblxuZnVuY3Rpb24gQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIEV4cG9ydC5QYWdlTG9hZFJhbSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGRlbGV0ZSBFeHBvcnQuUGFnZUxvYWRSYW1baV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBFeHRlbnNpb25JbkFycmF5KGZpbGVQYXRoOiBzdHJpbmcsIC4uLmFycmF5czogc3RyaW5nW10pIHtcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGguc3Vic3RyaW5nKGZpbGVQYXRoLmxlbmd0aCAtIGkubGVuZ3RoIC0gMSkgPT0gJy4nICsgaSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gR2V0RXJyb3JQYWdlKGNvZGU6IG51bWJlciwgTG9jU2V0dGluZ3M6ICdub3RGb3VuZCcgfCAnc2VydmVyRXJyb3InKSB7XG4gICAgbGV0IGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nO1xuICAgIGlmIChTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXSkge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWM7XG4gICAgICAgIHVybCA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLnBhdGg7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5jb2RlID8/IGNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuTG9ncztcbiAgICAgICAgdXJsID0gJ2UnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdXJsLCBhcnJheVR5cGUsIGNvZGUgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGNvZGU6IG51bWJlcikge1xuICAgIC8vZmlyc3Qgc3RlcCAtIHBhcnNlIGluZm9cbiAgICBpZiAoUmVxdWVzdC5tZXRob2QgPT0gXCJQT1NUXCIpIHtcbiAgICAgICAgaWYgKCFSZXF1ZXN0LmJvZHkgfHwgIU9iamVjdC5rZXlzKFJlcXVlc3QuYm9keSkubGVuZ3RoKVxuICAgICAgICAgICAgUmVxdWVzdC5ib2R5ID0gUmVxdWVzdC5maWVsZHMgfHwge307XG5cbiAgICB9IGVsc2VcbiAgICAgICAgUmVxdWVzdC5ib2R5ID0gZmFsc2U7XG5cblxuICAgIGlmIChSZXF1ZXN0LmNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZXMoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZUVuY3J5cHRlcihSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuU2Vzc2lvblN0b3JlKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG5cbiAgICBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgfHwge307XG4gICAgUmVxdWVzdC5maWxlcyA9IFJlcXVlc3QuZmlsZXMgfHwge307XG5cbiAgICBjb25zdCBDb3B5Q29va2llcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzKSk7XG5cbiAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gMjAxO1xuXG4gICAgLy9zZWNvbmQgc3RlcFxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChSZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDEpXG4gICAgICAgICAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gY29kZTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LnNpZ25lZENvb2tpZXMpIHsvL3VwZGF0ZSBjb29raWVzXG4gICAgICAgICAgICBpZiAodHlwZW9mIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSAnb2JqZWN0JyAmJiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gQ29weUNvb2tpZXNbaV0gfHwgSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldKSAhPSBKU09OLnN0cmluZ2lmeShDb3B5Q29va2llc1tpXSkpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY29va2llKGksIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSwgU2V0dGluZ3MuQ29va2llU2V0dGluZ3MpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gQ29weUNvb2tpZXMpIHsvL2RlbGV0ZSBub3QgZXhpdHMgY29va2llc1xuICAgICAgICAgICAgaWYgKFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNsZWFyQ29va2llKGkpO1xuXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vZm9yIGZpbmFsIHN0ZXBcbmZ1bmN0aW9uIG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55KSB7XG4gICAgaWYgKCFSZXF1ZXN0LmZpbGVzKSAvL2RlbGV0ZSBmaWxlc1xuICAgICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IGFyclBhdGggPSBbXVxuXG4gICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3QuZmlsZXMpIHtcblxuICAgICAgICBjb25zdCBlID0gUmVxdWVzdC5maWxlc1tpXTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBpbiBlKSB7XG4gICAgICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGVbYV0uZmlsZXBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGFyclBhdGgucHVzaChlLmZpbGVwYXRoKTtcblxuICAgIH1cblxuICAgIHJldHVybiBhcnJQYXRoO1xufVxuXG4vL2ZpbmFsIHN0ZXBcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJlcXVlc3RGaWxlcyhhcnJheTogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IGUgaW4gYXJyYXkpXG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNVUkxQYXRoQUZpbGUoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGlmIChjb2RlID09IDIwMCkge1xuICAgICAgICBjb25zdCBmdWxsUGFnZVVybCA9IGdldFR5cGVzLlN0YXRpY1swXSArIHVybDtcbiAgICAgICAgLy9jaGVjayB0aGF0IGlzIG5vdCBzZXJ2ZXIgZmlsZVxuICAgICAgICBpZiAoYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgU2V0dGluZ3MuRGV2TW9kZSwgdXJsKSB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgICAgICByZXR1cm4gZnVsbFBhZ2VVcmw7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aDogc3RyaW5nLCBmaXJzdEZ1bmM/OiBhbnkpIHtcbiAgICBjb25zdCBwYWdlQXJyYXkgPSBbZmlyc3RGdW5jID8/IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2Uoc21hbGxQYXRoLCBTZXR0aW5ncy5EZXZNb2RlKV07XG5cbiAgICBwYWdlQXJyYXlbMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShwYWdlQXJyYXlbMF0sIHNtYWxsUGF0aCk7XG5cbiAgICBpZiAoRXhwb3J0LlBhZ2VSYW0pXG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdID0gcGFnZUFycmF5O1xuXG4gICAgcmV0dXJuIHBhZ2VBcnJheVsxXTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gbG9hZCB0aGUgZHluYW1pYyBwYWdlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBUaGUgYXJyYXkgb2YgdHlwZXMgdGhhdCB0aGUgcGFnZSBpcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsUGFnZVVybCAtIFRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gc21hbGxQYXRoIC0gVGhlIHBhdGggdG8gdGhlIHBhZ2UgZmlsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gVGhlIHN0YXR1cyBjb2RlIG9mIHRoZSBwYWdlLlxuICogQHJldHVybnMgVGhlIER5bmFtaWNGdW5jIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIGdlbmVyYXRlIHRoZSBwYWdlLlxuICogVGhlIGNvZGUgaXMgdGhlIHN0YXR1cyBjb2RlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAqIFRoZSBmdWxsUGFnZVVybCBpcyB0aGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREeW5hbWljUGFnZShhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW5TdGF0aWMgPSB1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgIGNvbnN0IHNtYWxsUGF0aCA9IGFycmF5VHlwZVsyXSArICcvJyArIGluU3RhdGljO1xuICAgIGxldCBmdWxsUGFnZVVybCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc21hbGxQYXRoO1xuXG4gICAgbGV0IER5bmFtaWNGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IGFueTtcbiAgICBpZiAoU2V0dGluZ3MuRGV2TW9kZSAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpIHtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVsxXSArIGluU3RhdGljICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2Uoc21hbGxQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUodXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgYXJyYXlUeXBlKTtcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlsxXSlcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCwgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlswXSk7XG5cbiAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMV0pXG4gICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICBlbHNlIGlmICghRXhwb3J0LlBhZ2VSYW0gJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKVxuICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoLCBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzBdKTtcblxuICAgIGVsc2UgaWYgKGFycmF5VHlwZSAhPSBnZXRUeXBlcy5Mb2dzKSB7XG4gICAgICAgIGNvbnN0IHsgYXJyYXlUeXBlLCBjb2RlLCB1cmwgfSA9IEdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlLCB1cmwsIGNvZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIER5bmFtaWNGdW5jLFxuICAgICAgICBjb2RlLFxuICAgICAgICBmdWxsUGFnZVVybFxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTWFrZVBhZ2VSZXNwb25zZShEeW5hbWljUmVzcG9uc2U6IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55KSB7XG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGg/LmZpbGUpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IFJlc3BvbnNlLm9uKCdmaW5pc2gnLCByZXMpKTtcbiAgICB9IGVsc2UgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGgpIHtcbiAgICAgICAgUmVzcG9uc2Uud3JpdGVIZWFkKDMwMiwgeyBMb2NhdGlvbjogRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCB9KTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgUmVzUGFnZSA9IER5bmFtaWNSZXNwb25zZS5vdXRfcnVuX3NjcmlwdC50cmltKCk7XG4gICAgICAgIGlmIChSZXNQYWdlKSB7XG4gICAgICAgICAgICBSZXNwb25zZS5zZW5kKFJlc1BhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5kZWxldGVBZnRlcikge1xuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gYSBwYWdlLiBcbiAqIEl0IHdpbGwgY2hlY2sgaWYgdGhlIHBhZ2UgZXhpc3RzLCBhbmQgaWYgaXQgZG9lcywgaXQgd2lsbCByZXR1cm4gdGhlIHBhZ2UuIFxuICogSWYgaXQgZG9lcyBub3QgZXhpc3QsIGl0IHdpbGwgcmV0dXJuIGEgNDA0IHBhZ2VcbiAqIEBwYXJhbSB7UmVxdWVzdCB8IGFueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aHNcbiAqIGxvYWRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBwYWdlIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7eyBmaWxlOiBib29sZWFuLCBmdWxsUGFnZVVybDogc3RyaW5nIH19IEZpbGVJbmZvIC0gdGhlIGZpbGUgaW5mbyBvZiB0aGUgcGFnZSB0aGF0IGlzIGJlaW5nIGFjdGl2YXRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gbnVtYmVyXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBhZnRlciB0aGUgZHluYW1pYyBwYWdlXG4gKiBpcyBsb2FkZWQuXG4gKiBAcmV0dXJucyBOb3RoaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBBY3RpdmF0ZVBhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IHsgRHluYW1pY0Z1bmMsIGZ1bGxQYWdlVXJsLCBjb2RlOiBuZXdDb2RlIH0gPSBhd2FpdCBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgY29kZSk7XG5cbiAgICBpZiAoIWZ1bGxQYWdlVXJsIHx8ICFEeW5hbWljRnVuYyAmJiBjb2RlID09IDUwMClcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLnNlbmRTdGF0dXMobmV3Q29kZSk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG4gICAgICAgIGNvbnN0IHBhZ2VEYXRhID0gYXdhaXQgRHluYW1pY0Z1bmMoUmVzcG9uc2UsIFJlcXVlc3QsIFJlcXVlc3QuYm9keSwgUmVxdWVzdC5xdWVyeSwgUmVxdWVzdC5jb29raWVzLCBSZXF1ZXN0LnNlc3Npb24sIFJlcXVlc3QuZmlsZXMsIFNldHRpbmdzLkRldk1vZGUpO1xuICAgICAgICBmaW5hbFN0ZXAoKTsgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgICAgIGF3YWl0IE1ha2VQYWdlUmVzcG9uc2UoXG4gICAgICAgICAgICBwYWdlRGF0YSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICBwcmludC5lcnJvcihlKTtcbiAgICAgICAgUmVxdWVzdC5lcnJvciA9IGU7XG5cbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gR2V0RXJyb3JQYWdlKDUwMCwgJ3NlcnZlckVycm9yJyk7XG5cbiAgICAgICAgRHluYW1pY1BhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBEeW5hbWljUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnksIHVybDogc3RyaW5nLCBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWMsIGNvZGUgPSAyMDApIHtcbiAgICBjb25zdCBGaWxlSW5mbyA9IGF3YWl0IGlzVVJMUGF0aEFGaWxlKFJlcXVlc3QsIHVybCwgY29kZSk7XG5cbiAgICBjb25zdCBtYWtlRGVsZXRlQXJyYXkgPSBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdClcblxuICAgIGlmIChGaWxlSW5mbykge1xuICAgICAgICBTZXR0aW5ncy5DYWNoZURheXMgJiYgUmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcIm1heC1hZ2U9XCIgKyAoU2V0dGluZ3MuQ2FjaGVEYXlzICogMjQgKiA2MCAqIDYwKSk7XG4gICAgICAgIGF3YWl0IEdldFN0YXRpY0ZpbGUodXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFByYXNlID0gKCkgPT4gUGFyc2VCYXNpY0luZm8oUmVxdWVzdCwgUmVzcG9uc2UsIGNvZGUpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGNvbnN0IGlzQXBpID0gYXdhaXQgTWFrZUFwaUNhbGwoUmVxdWVzdCwgUmVzcG9uc2UsIHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgbmV4dFByYXNlKTtcbiAgICBpZiAoIWlzQXBpICYmICFhd2FpdCBBY3RpdmF0ZVBhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIGFycmF5VHlwZSwgdXJsLCBjb2RlLCBuZXh0UHJhc2UpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTsgLy8gZGVsZXRlIGZpbGVzXG59XG5cbmZ1bmN0aW9uIHVybEZpeCh1cmw6IHN0cmluZykge1xuICAgIGlmICh1cmwgPT0gJy8nKSB7XG4gICAgICAgIHVybCA9ICcvaW5kZXgnO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbn1cblxuZXhwb3J0IHtcbiAgICBTZXR0aW5ncyxcbiAgICBEeW5hbWljUGFnZSxcbiAgICBMb2FkQWxsUGFnZXNUb1JhbSxcbiAgICBDbGVhckFsbFBhZ2VzRnJvbVJhbSxcbiAgICB1cmxGaXgsXG4gICAgR2V0RXJyb3JQYWdlXG59IiwgImltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0ICogYXMgQnVpbGRTZXJ2ZXIgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IGNvb2tpZVBhcnNlciB9IGZyb20gJ0B0aW55aHR0cC9jb29raWUtcGFyc2VyJztcbmltcG9ydCBjb29raWVFbmNyeXB0ZXIgZnJvbSAnY29va2llLWVuY3J5cHRlcic7XG5pbXBvcnQgeyBhbGxvd1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgSW5zZXJ0TW9kZWxzU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IHsgU3RhcnRSZXF1aXJlLCBHZXRTZXR0aW5ncyB9IGZyb20gJy4vSW1wb3J0TW9kdWxlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIGNyZWF0ZU5ld1ByaW50U2V0dGluZ3MgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IE1lbW9yeVNlc3Npb24gZnJvbSAnbWVtb3J5c3RvcmUnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgZGVidWdTaXRlTWFwIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NpdGVNYXAnO1xuaW1wb3J0IHsgc2V0dGluZ3MgYXMgZGVmaW5lU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7RXhwb3J0IGFzIEV4cG9ydFJhbX0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0Z1bmN0aW9uU2NyaXB0J1xuXG5jb25zdFxuICAgIENvb2tpZXNTZWNyZXQgPSB1dWlkdjQoKS5zdWJzdHJpbmcoMCwgMzIpLFxuICAgIFNlc3Npb25TZWNyZXQgPSB1dWlkdjQoKSxcbiAgICBNZW1vcnlTdG9yZSA9IE1lbW9yeVNlc3Npb24oc2Vzc2lvbiksXG5cbiAgICBDb29raWVzTWlkZGxld2FyZSA9IGNvb2tpZVBhcnNlcihDb29raWVzU2VjcmV0KSxcbiAgICBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlID0gY29va2llRW5jcnlwdGVyKENvb2tpZXNTZWNyZXQsIHt9KSxcbiAgICBDb29raWVTZXR0aW5ncyA9IHsgaHR0cE9ubHk6IHRydWUsIHNpZ25lZDogdHJ1ZSwgbWF4QWdlOiA4NjQwMDAwMCAqIDMwIH07XG5cbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVzID0gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIgPSA8YW55PkNvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llU2V0dGluZ3MgPSBDb29raWVTZXR0aW5ncztcblxubGV0IERldk1vZGVfID0gdHJ1ZSwgY29tcGlsYXRpb25TY2FuOiBQcm9taXNlPCgpID0+IFByb21pc2U8dm9pZD4+LCBTZXNzaW9uU3RvcmU7XG5cbmxldCBmb3JtaWRhYmxlU2VydmVyLCBib2R5UGFyc2VyU2VydmVyO1xuXG5jb25zdCBzZXJ2ZUxpbWl0cyA9IHtcbiAgICBzZXNzaW9uVG90YWxSYW1NQjogMTUwLFxuICAgIHNlc3Npb25UaW1lTWludXRlczogNDAsXG4gICAgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlczogMzAsXG4gICAgZmlsZUxpbWl0TUI6IDEwLFxuICAgIHJlcXVlc3RMaW1pdE1COiA0XG59XG5cbmxldCBwYWdlSW5SYW1BY3RpdmF0ZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCBmdW5jdGlvbiBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKXtcbiAgICByZXR1cm4gcGFnZUluUmFtQWN0aXZhdGU7XG59XG5cbmNvbnN0IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMgPSBbLi4uQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheV07XG5jb25zdCBiYXNlVmFsaWRQYXRoID0gWyhwYXRoOiBzdHJpbmcpID0+IHBhdGguc3BsaXQoJy4nKS5hdCgtMikgIT0gJ3NlcnYnXTsgLy8gaWdub3JpbmcgZmlsZXMgdGhhdCBlbmRzIHdpdGggLnNlcnYuKlxuXG5leHBvcnQgY29uc3QgRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyA9IHtcbiAgICBnZXQgc2V0dGluZ3NQYXRoKCkge1xuICAgICAgICByZXR1cm4gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArIFwiL1NldHRpbmdzXCI7XG4gICAgfSxcbiAgICBzZXQgZGV2ZWxvcG1lbnQodmFsdWUpIHtcbiAgICAgICAgaWYoRGV2TW9kZV8gPT0gdmFsdWUpIHJldHVyblxuICAgICAgICBEZXZNb2RlXyA9IHZhbHVlO1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICBjb21waWxhdGlvblNjYW4gPSBCdWlsZFNlcnZlci5jb21waWxlQWxsKEV4cG9ydCk7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwicHJvZHVjdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5EZXZNb2RlID0gdmFsdWU7XG4gICAgICAgIGFsbG93UHJpbnQodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0IGRldmVsb3BtZW50KCkge1xuICAgICAgICByZXR1cm4gRGV2TW9kZV87XG4gICAgfSxcbiAgICBtaWRkbGV3YXJlOiB7XG4gICAgICAgIGdldCBjb29raWVzKCk6IChyZXE6IFJlcXVlc3QsIF9yZXM6IFJlc3BvbnNlPGFueT4sIG5leHQ/OiBOZXh0RnVuY3Rpb24pID0+IHZvaWQge1xuICAgICAgICAgICAgcmV0dXJuIDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVFbmNyeXB0ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblN0b3JlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZm9ybWlkYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtaWRhYmxlU2VydmVyO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgYm9keVBhcnNlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBib2R5UGFyc2VyU2VydmVyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZWNyZXQ6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llc1NlY3JldDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblNlY3JldDtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGdlbmVyYWw6IHtcbiAgICAgICAgaW1wb3J0T25Mb2FkOiBbXSxcbiAgICAgICAgc2V0IHBhZ2VJblJhbSh2YWx1ZSkge1xuICAgICAgICAgICAgRXhwb3J0UmFtLlBhZ2VSYW0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXBhcmF0aW9ucyA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICAgICAgICAgICAgICBhd2FpdCBwcmVwYXJhdGlvbnM/LigpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlQnlVcmwuTG9hZEFsbFBhZ2VzVG9SYW0oRXhwb3J0LmRldmVsb3BtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxlQnlVcmwuQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwYWdlSW5SYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gRXhwb3J0UmFtLlBhZ2VSYW07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBpbGU6IHtcbiAgICAgICAgc2V0IGNvbXBpbGVTeW50YXgodmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXggPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvbXBpbGVTeW50YXgoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGlnbm9yZUVycm9yKHZhbHVlKSB7XG4gICAgICAgICAgICAoPGFueT5jcmVhdGVOZXdQcmludFNldHRpbmdzKS5QcmV2ZW50RXJyb3JzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBpZ25vcmVFcnJvcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoPGFueT5jcmVhdGVOZXdQcmludFNldHRpbmdzKS5QcmV2ZW50RXJyb3JzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcGx1Z2lucyh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucy5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBsdWdpbnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGRlZmluZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGRlZmluZVNldHRpbmdzLmRlZmluZVxuICAgICAgICB9LFxuICAgICAgICBzZXQgZGVmaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICBkZWZpbmVTZXR0aW5ncy5kZWZpbmUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZzoge1xuICAgICAgICBydWxlczoge30sXG4gICAgICAgIHVybFN0b3A6IFtdLFxuICAgICAgICB2YWxpZFBhdGg6IGJhc2VWYWxpZFBhdGgsXG4gICAgICAgIGlnbm9yZVR5cGVzOiBiYXNlUm91dGluZ0lnbm9yZVR5cGVzLFxuICAgICAgICBpZ25vcmVQYXRoczogW10sXG4gICAgICAgIHNpdGVtYXA6IHRydWUsXG4gICAgICAgIGdldCBlcnJvclBhZ2VzKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZXJyb3JQYWdlcyh2YWx1ZSkge1xuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXMgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVMaW1pdHM6IHtcbiAgICAgICAgZ2V0IGNhY2hlRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBjYWNoZURheXModmFsdWUpe1xuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llc0V4cGlyZXNEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llU2V0dGluZ3MubWF4QWdlIC8gODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBjb29raWVzRXhwaXJlc0RheXModmFsdWUpe1xuICAgICAgICAgICAgQ29va2llU2V0dGluZ3MubWF4QWdlID0gdmFsdWUgKiA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25Ub3RhbFJhbU1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25Ub3RhbFJhbU1CKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVGltZU1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25UaW1lTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGZpbGVMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgZmlsZUxpbWl0TUIoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuZmlsZUxpbWl0TUI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCByZXF1ZXN0TGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgICAgICAgICBidWlsZEJvZHlQYXJzZXIoKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgcmVxdWVzdExpbWl0TUIoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlOiB7XG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGh0dHAyOiBmYWxzZSxcbiAgICAgICAgZ3JlZW5Mb2NrOiB7XG4gICAgICAgICAgICBzdGFnaW5nOiBudWxsLFxuICAgICAgICAgICAgY2x1c3RlcjogbnVsbCxcbiAgICAgICAgICAgIGVtYWlsOiBudWxsLFxuICAgICAgICAgICAgYWdlbnQ6IG51bGwsXG4gICAgICAgICAgICBhZ3JlZVRvVGVybXM6IGZhbHNlLFxuICAgICAgICAgICAgc2l0ZXM6IFtdXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZvcm1pZGFibGUoKSB7XG4gICAgZm9ybWlkYWJsZVNlcnZlciA9IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiAqIDEwNDg1NzYsXG4gICAgICAgIHVwbG9hZERpcjogU3lzdGVtRGF0YSArIFwiL1VwbG9hZEZpbGVzL1wiLFxuICAgICAgICBtdWx0aXBsZXM6IHRydWUsXG4gICAgICAgIG1heEZpZWxkc1NpemU6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiAqIDEwNDg1NzZcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRCb2R5UGFyc2VyKCkge1xuICAgIGJvZHlQYXJzZXJTZXJ2ZXIgPSAoPGFueT5ib2R5UGFyc2VyKS5qc29uKHsgbGltaXQ6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiArICdtYicgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2Vzc2lvbigpIHtcbiAgICBpZiAoIUV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgfHwgIUV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQikge1xuICAgICAgICBTZXNzaW9uU3RvcmUgPSAocmVxLCByZXMsIG5leHQpID0+IG5leHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFNlc3Npb25TdG9yZSA9IHNlc3Npb24oe1xuICAgICAgICBjb29raWU6IHsgbWF4QWdlOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzICogNjAgKiAxMDAwLCBzYW1lU2l0ZTogdHJ1ZSB9LFxuICAgICAgICBzZWNyZXQ6IFNlc3Npb25TZWNyZXQsXG4gICAgICAgIHJlc2F2ZTogZmFsc2UsXG4gICAgICAgIHNhdmVVbmluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgICAgc3RvcmU6IG5ldyBNZW1vcnlTdG9yZSh7XG4gICAgICAgICAgICBjaGVja1BlcmlvZDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgICBtYXg6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiAqIDEwNDg1NzZcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY29weUpTT04odG86IGFueSwganNvbjogYW55LCBydWxlczogc3RyaW5nW10gPSBbXSwgcnVsZXNUeXBlOiAnaWdub3JlJyB8ICdvbmx5JyA9ICdpZ25vcmUnKSB7XG4gICAgaWYoIWpzb24pIHJldHVybiBmYWxzZTtcbiAgICBsZXQgaGFzSW1wbGVhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBpIGluIGpzb24pIHtcbiAgICAgICAgY29uc3QgaW5jbHVkZSA9IHJ1bGVzLmluY2x1ZGVzKGkpO1xuICAgICAgICBpZiAocnVsZXNUeXBlID09ICdvbmx5JyAmJiBpbmNsdWRlIHx8IHJ1bGVzVHlwZSA9PSAnaWdub3JlJyAmJiAhaW5jbHVkZSkge1xuICAgICAgICAgICAgaGFzSW1wbGVhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvW2ldID0ganNvbltpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzSW1wbGVhdGVkO1xufVxuXG4vLyByZWFkIHRoZSBzZXR0aW5ncyBvZiB0aGUgd2Vic2l0ZVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVTZXR0aW5ncygpIHtcbiAgICBjb25zdCBTZXR0aW5nczogRXhwb3J0U2V0dGluZ3MgPSBhd2FpdCBHZXRTZXR0aW5ncyhFeHBvcnQuc2V0dGluZ3NQYXRoLCBEZXZNb2RlXyk7XG4gICAgaWYoU2V0dGluZ3MgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsRGV2KTtcblxuICAgIGVsc2VcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbFByb2QpO1xuXG5cbiAgICBjb3B5SlNPTihFeHBvcnQuY29tcGlsZSwgU2V0dGluZ3MuY29tcGlsZSk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQucm91dGluZywgU2V0dGluZ3Mucm91dGluZywgWydpZ25vcmVUeXBlcycsICd2YWxpZFBhdGgnXSk7XG5cbiAgICAvL2NvbmNhdCBkZWZhdWx0IHZhbHVlcyBvZiByb3V0aW5nXG4gICAgY29uc3QgY29uY2F0QXJyYXkgPSAobmFtZTogc3RyaW5nLCBhcnJheTogYW55W10pID0+IFNldHRpbmdzLnJvdXRpbmc/LltuYW1lXSAmJiAoRXhwb3J0LnJvdXRpbmdbbmFtZV0gPSBTZXR0aW5ncy5yb3V0aW5nW25hbWVdLmNvbmNhdChhcnJheSkpO1xuXG4gICAgY29uY2F0QXJyYXkoJ2lnbm9yZVR5cGVzJywgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyk7XG4gICAgY29uY2F0QXJyYXkoJ3ZhbGlkUGF0aCcsIGJhc2VWYWxpZFBhdGgpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydjYWNoZURheXMnLCAnY29va2llc0V4cGlyZXNEYXlzJ10sICdvbmx5Jyk7XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3Nlc3Npb25Ub3RhbFJhbU1CJywgJ3Nlc3Npb25UaW1lTWludXRlcycsICdzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydmaWxlTGltaXRNQicsICdyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEJvZHlQYXJzZXIoKTtcbiAgICB9XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmUsIFNldHRpbmdzLnNlcnZlKTtcblxuICAgIC8qIC0tLSBwcm9ibGVtYXRpYyB1cGRhdGVzIC0tLSAqL1xuICAgIEV4cG9ydC5kZXZlbG9wbWVudCA9IFNldHRpbmdzLmRldmVsb3BtZW50XG5cbiAgICBpZiAoU2V0dGluZ3MuZ2VuZXJhbD8uaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIEV4cG9ydC5nZW5lcmFsLmltcG9ydE9uTG9hZCA9IDxhbnk+YXdhaXQgU3RhcnRSZXF1aXJlKDxhbnk+U2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQsIERldk1vZGVfKTtcbiAgICB9XG5cbiAgICAvL25lZWQgdG8gZG93biBsYXN0ZWQgc28gaXQgd29uJ3QgaW50ZXJmZXJlIHdpdGggJ2ltcG9ydE9uTG9hZCdcbiAgICBpZiAoIWNvcHlKU09OKEV4cG9ydC5nZW5lcmFsLCBTZXR0aW5ncy5nZW5lcmFsLCBbJ3BhZ2VJblJhbSddLCAnb25seScpICYmIFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgIH1cblxuICAgIGlmKEV4cG9ydC5kZXZlbG9wbWVudCAmJiBFeHBvcnQucm91dGluZy5zaXRlbWFwKXsgLy8gb24gcHJvZHVjdGlvbiB0aGlzIHdpbGwgYmUgY2hlY2tlZCBhZnRlciBjcmVhdGluZyBzdGF0ZVxuICAgICAgICBkZWJ1Z1NpdGVNYXAoRXhwb3J0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZpcnN0TG9hZCgpIHtcbiAgICBidWlsZFNlc3Npb24oKTtcbiAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICBidWlsZEJvZHlQYXJzZXIoKTtcbn0iLCAiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cDIgZnJvbSAnaHR0cDInO1xuaW1wb3J0ICogYXMgY3JlYXRlQ2VydCBmcm9tICdzZWxmc2lnbmVkJztcbmltcG9ydCAqIGFzIEdyZWVubG9jayBmcm9tICdncmVlbmxvY2stZXhwcmVzcyc7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5nc30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERlbGV0ZUluRGlyZWN0b3J5LCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgR3JlZW5Mb2NrU2l0ZSB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5cbi8qKlxuICogSWYgdGhlIGZvbGRlciBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc1xuICogZXhpc3QsIHVwZGF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IGZvTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmb2xkZXIgdG8gY3JlYXRlLlxuICogQHBhcmFtIENyZWF0ZUluTm90RXhpdHMgLSB7XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFRvdWNoU3lzdGVtRm9sZGVyKGZvTmFtZTogc3RyaW5nLCBDcmVhdGVJbk5vdEV4aXRzOiB7bmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBleGl0cz86IGFueX0pIHtcbiAgICBsZXQgc2F2ZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgXCIvU3lzdGVtU2F2ZS9cIjtcblxuICAgIGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHNhdmVQYXRoKTtcblxuICAgIHNhdmVQYXRoICs9IGZvTmFtZTtcblxuICAgIGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHNhdmVQYXRoKTtcblxuICAgIGlmIChDcmVhdGVJbk5vdEV4aXRzKSB7XG4gICAgICAgIHNhdmVQYXRoICs9ICcvJztcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBzYXZlUGF0aCArIENyZWF0ZUluTm90RXhpdHMubmFtZTtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmaWxlUGF0aCwgQ3JlYXRlSW5Ob3RFeGl0cy52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoQ3JlYXRlSW5Ob3RFeGl0cy5leGl0cykge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmaWxlUGF0aCwgYXdhaXQgQ3JlYXRlSW5Ob3RFeGl0cy5leGl0cyhhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JyksIGZpbGVQYXRoLCBzYXZlUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEl0IGdlbmVyYXRlcyBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGFuZCBzdG9yZXMgaXQgaW4gYSBmaWxlLlxuICogQHJldHVybnMgVGhlIGNlcnRpZmljYXRlIGFuZCBrZXkgYXJlIGJlaW5nIHJldHVybmVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREZW1vQ2VydGlmaWNhdGUoKSB7XG4gICAgbGV0IENlcnRpZmljYXRlOiBhbnk7XG4gICAgY29uc3QgQ2VydGlmaWNhdGVQYXRoID0gU3lzdGVtRGF0YSArICcvQ2VydGlmaWNhdGUuanNvbic7XG5cbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoQ2VydGlmaWNhdGVQYXRoKSkge1xuICAgICAgICBDZXJ0aWZpY2F0ZSA9IEVhc3lGcy5yZWFkSnNvbkZpbGUoQ2VydGlmaWNhdGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBDZXJ0aWZpY2F0ZSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICBjcmVhdGVDZXJ0LmdlbmVyYXRlKG51bGwsIHsgZGF5czogMzY1MDAgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleXMucHJpdmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgY2VydDoga2V5cy5jZXJ0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoQ2VydGlmaWNhdGVQYXRoLCBDZXJ0aWZpY2F0ZSk7XG4gICAgfVxuICAgIHJldHVybiBDZXJ0aWZpY2F0ZTtcbn1cblxuZnVuY3Rpb24gRGVmYXVsdExpc3RlbihhcHApIHtcbiAgICBjb25zdCBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHAuYXR0YWNoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZXJ2ZXIsXG4gICAgICAgIGxpc3Rlbihwb3J0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgPGFueT5yZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIElmIHlvdSB3YW50IHRvIHVzZSBncmVlbmxvY2ssIGl0IHdpbGwgY3JlYXRlIGEgc2VydmVyIHRoYXQgd2lsbCBzZXJ2ZSB5b3VyIGFwcCBvdmVyIGh0dHBzXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHRpbnlIdHRwIGFwcGxpY2F0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRoZSBzZXJ2ZXIgbWV0aG9kc1xuICovXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBVcGRhdGVHcmVlbkxvY2soYXBwKSB7XG5cbiAgICBpZiAoIShTZXR0aW5ncy5zZXJ2ZS5odHRwMiB8fCBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2s/LmFncmVlVG9UZXJtcykpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IERlZmF1bHRMaXN0ZW4oYXBwKTtcbiAgICB9XG5cbiAgICBpZiAoIVNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ3JlZVRvVGVybXMpIHtcbiAgICAgICAgY29uc3Qgc2VydmVyID0gaHR0cDIuY3JlYXRlU2VjdXJlU2VydmVyKHsgLi4uYXdhaXQgR2V0RGVtb0NlcnRpZmljYXRlKCksIGFsbG93SFRUUDE6IHRydWUgfSwgYXBwLmF0dGFjaCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3Rlbihwb3J0KSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgVG91Y2hTeXN0ZW1Gb2xkZXIoXCJncmVlbmxvY2tcIiwge1xuICAgICAgICBuYW1lOiBcImNvbmZpZy5qc29uXCIsIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzaXRlczogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzXG4gICAgICAgIH0pLFxuICAgICAgICBhc3luYyBleGl0cyhmaWxlLCBfLCBmb2xkZXIpIHtcbiAgICAgICAgICAgIGZpbGUgPSBKU09OLnBhcnNlKGZpbGUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbGUuc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlID0gZmlsZS5zaXRlc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgaGF2ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgPEdyZWVuTG9ja1NpdGVbXT4gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLnN1YmplY3QgPT0gZS5zdWJqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLmFsdG5hbWVzLmxlbmd0aCAhPSBlLmFsdG5hbWVzLmxlbmd0aCB8fCBiLmFsdG5hbWVzLnNvbWUodiA9PiBlLmFsdG5hbWVzLmluY2x1ZGVzKHYpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuYWx0bmFtZXMgPSBiLmFsdG5hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlLnJlbmV3QXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWhhdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5zaXRlcy5zcGxpY2UoaSwgaSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBmb2xkZXIgKyBcImxpdmUvXCIgKyBlLnN1YmplY3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHMocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnJtZGlyKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdTaXRlcyA9IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcy5maWx0ZXIoKHgpID0+ICFmaWxlLnNpdGVzLmZpbmQoYiA9PiBiLnN1YmplY3QgPT0geC5zdWJqZWN0KSk7XG5cbiAgICAgICAgICAgIGZpbGUuc2l0ZXMucHVzaCguLi5uZXdTaXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShmaWxlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFja2FnZUluZm8gPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHdvcmtpbmdEaXJlY3RvcnkgKyBcInBhY2thZ2UuanNvblwiKTtcblxuICAgIGNvbnN0IGdyZWVubG9ja09iamVjdDphbnkgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gR3JlZW5sb2NrLmluaXQoe1xuICAgICAgICBwYWNrYWdlUm9vdDogd29ya2luZ0RpcmVjdG9yeSxcbiAgICAgICAgY29uZmlnRGlyOiBcIlN5c3RlbVNhdmUvZ3JlZW5sb2NrXCIsXG4gICAgICAgIHBhY2thZ2VBZ2VudDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFnZW50IHx8IHBhY2thZ2VJbmZvLm5hbWUgKyAnLycgKyBwYWNrYWdlSW5mby52ZXJzaW9uLFxuICAgICAgICBtYWludGFpbmVyRW1haWw6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5lbWFpbCxcbiAgICAgICAgY2x1c3RlcjogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmNsdXN0ZXIsXG4gICAgICAgIHN0YWdpbmc6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zdGFnaW5nXG4gICAgfSkucmVhZHkocmVzKSk7XG5cbiAgICBmdW5jdGlvbiBDcmVhdGVTZXJ2ZXIodHlwZSwgZnVuYywgb3B0aW9ucz8pIHtcbiAgICAgICAgbGV0IENsb3NlaHR0cFNlcnZlciA9ICgpID0+IHsgfTtcbiAgICAgICAgY29uc3Qgc2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0W3R5cGVdKG9wdGlvbnMsIGZ1bmMpO1xuICAgICAgICBjb25zdCBsaXN0ZW4gPSAocG9ydCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGdyZWVubG9ja09iamVjdC5odHRwU2VydmVyKCk7XG4gICAgICAgICAgICBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiBodHRwU2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW25ldyBQcm9taXNlKHJlcyA9PiBzZXJ2ZXIubGlzdGVuKDQ0MywgXCIwLjAuMC4wXCIsIHJlcykpLCBuZXcgUHJvbWlzZShyZXMgPT4gaHR0cFNlcnZlci5saXN0ZW4ocG9ydCwgXCIwLjAuMC4wXCIsIHJlcykpXSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBzZXJ2ZXIuY2xvc2UoKTsgQ2xvc2VodHRwU2VydmVyKCk7IH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4sXG4gICAgICAgICAgICBjbG9zZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFNldHRpbmdzLnNlcnZlLmh0dHAyKSB7XG4gICAgICAgIHJldHVybiBDcmVhdGVTZXJ2ZXIoJ2h0dHAyU2VydmVyJywgYXBwLmF0dGFjaCwgeyBhbGxvd0hUVFAxOiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdGVTZXJ2ZXIoJ2h0dHBzU2VydmVyJywgYXBwLmF0dGFjaCk7XG4gICAgfVxufVxuIiwgImltcG9ydCBzZXJ2ZXIsIHtTZXR0aW5nc30gIGZyb20gJy4vTWFpbkJ1aWxkL1NlcnZlcic7XG5pbXBvcnQgYXN5bmNSZXF1aXJlIGZyb20gJy4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7Z2V0VHlwZXN9IGZyb20gJy4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFNlYXJjaFJlY29yZCBmcm9tICcuL0dsb2JhbC9TZWFyY2hSZWNvcmQnO1xuZXhwb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL01haW5CdWlsZC9UeXBlcyc7XG5cbmV4cG9ydCBjb25zdCBBc3luY0ltcG9ydCA9IChwYXRoOnN0cmluZywgaW1wb3J0RnJvbSA9ICdhc3luYyBpbXBvcnQnKSA9PiBhc3luY1JlcXVpcmUoW2ltcG9ydEZyb21dLCBwYXRoLCBnZXRUeXBlcy5TdGF0aWMsIHtpc0RlYnVnOiBTZXR0aW5ncy5kZXZlbG9wbWVudH0pO1xuZXhwb3J0IHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7OztBQ0ZBOzs7QUNBQSxJQUFJLFlBQVk7QUFFVCxvQkFBb0IsR0FBWTtBQUNuQyxjQUFZO0FBQ2hCO0FBRU8sSUFBTSxRQUFRLElBQUksTUFBTSxTQUFRO0FBQUEsRUFDbkMsSUFBSSxRQUFRLE1BQU0sVUFBVTtBQUN4QixRQUFHLFFBQVE7QUFDUCxhQUFPLE9BQU87QUFFbEIsUUFBRyxhQUFhLFFBQVE7QUFDcEIsYUFBTyxPQUFPO0FBQ2xCLFdBQU8sTUFBTTtBQUFB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
