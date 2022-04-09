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
var AsyncImport = (path22, importFrom = "async import") => LoadImport(importFrom, path22, getTypes.Static, { isDebug: Export.development });
var src_default = StartServer;
export {
  AsyncImport,
  SearchRecord,
  Export as Settings,
  src_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi93YXNtLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2Vzc2lvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvZXJyb3IudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd24udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaGVhZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jb25uZWN0LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2Zvcm0udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcmVjb3JkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlYXJjaC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvWE1MSGVscGVycy9FeHRyaWNhdGUudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvQ29tcGlsZS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU2NyaXB0LnRzIiwgIi4uL3NyYy9CdWlsZEluRnVuYy9TZWFyY2hSZWNvcmQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9BbGlhcy9wYWNrYWdlRXhwb3J0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvaW5kZXgudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9pbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2NyaXB0VGVtcGxhdGUudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L0luZGV4LnRzIiwgIi4uL3NyYy9QbHVnaW5zL0luZGV4LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncy50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1NjcmlwdC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdHlsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQ29tcGlsZVN0YXRlLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvSW1wb3J0TW9kdWxlLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2l0ZU1hcC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ZpbGVUeXBlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0Z1bmN0aW9uU2NyaXB0LnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvSW1wb3J0RmlsZVJ1bnRpbWUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9BcGlDYWxsLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvR2V0UGFnZXMudHMiLCAiLi4vc3JjL01haW5CdWlsZC9TZXR0aW5ncy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0xpc3RlbkdyZWVuTG9jay50cyIsICIuLi9zcmMvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEFwcCBhcyBUaW55QXBwIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vVHlwZXMnO1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzLCByZXF1aXJlU2V0dGluZ3MsIGJ1aWxkRmlyc3RMb2FkLCBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmN9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IGZvcm1pZGFibGUgZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgeyBVcGRhdGVHcmVlbkxvY2sgfSBmcm9tICcuL0xpc3RlbkdyZWVuTG9jayc7XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEFuZFNldHRpbmdzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgY2hhbmdlVVJMUnVsZXMocmVxLCByZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGFuZ2VVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBsZXQgdXJsID0gZmlsZUJ5VXJsLnVybEZpeChyZXEucGF0aCk7XG5cbiAgICBcbiAgICBmb3IgKGxldCBpIG9mIFNldHRpbmdzLnJvdXRpbmcudXJsU3RvcCkge1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkpIHtcbiAgICAgICAgICAgIGlmIChpLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS5zdWJzdHJpbmcoMCwgaS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBmaWxlclVSTFJ1bGVzKHJlcSwgcmVzLCBpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IFJ1bGVJbmRleCA9IE9iamVjdC5rZXlzKFNldHRpbmdzLnJvdXRpbmcucnVsZXMpLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSk7XG5cbiAgICBpZiAoUnVsZUluZGV4KSB7XG4gICAgICAgIHVybCA9IGF3YWl0IFNldHRpbmdzLnJvdXRpbmcucnVsZXNbUnVsZUluZGV4XSh1cmwsIHJlcSwgcmVzKTtcbiAgICB9XG5cbiAgICBhd2FpdCBmaWxlclVSTFJ1bGVzKHJlcSwgcmVzLCB1cmwpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaWxlclVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgdXJsOiBzdHJpbmcpIHtcbiAgICBsZXQgbm90VmFsaWQ6IGFueSA9IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKSB8fCBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoaSA9PiB1cmwuZW5kc1dpdGgoJy4nK2kpKTtcbiAgICBcbiAgICBpZighbm90VmFsaWQpIHtcbiAgICAgICAgZm9yKGNvbnN0IHZhbGlkIG9mIFNldHRpbmdzLnJvdXRpbmcudmFsaWRQYXRoKXsgLy8gY2hlY2sgaWYgdXJsIGlzbid0IHZhbGlkXG4gICAgICAgICAgICBpZighYXdhaXQgdmFsaWQodXJsLCByZXEsIHJlcykpe1xuICAgICAgICAgICAgICAgIG5vdFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub3RWYWxpZCkge1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBmaWxlQnlVcmwuR2V0RXJyb3JQYWdlKDQwNCwgJ25vdEZvdW5kJyk7XG4gICAgICAgIHJldHVybiBhd2FpdCBmaWxlQnlVcmwuRHluYW1pY1BhZ2UocmVxLCByZXMsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBmaWxlQnlVcmwuRHluYW1pY1BhZ2UocmVxLCByZXMsIHVybC5zdWJzdHJpbmcoMSkpO1xufVxuXG5sZXQgYXBwT25saW5lXG5cbi8qKlxuICogSXQgc3RhcnRzIHRoZSBzZXJ2ZXIgYW5kIHRoZW4gY2FsbHMgU3RhcnRMaXN0aW5nXG4gKiBAcGFyYW0gW1NlcnZlcl0gLSBUaGUgc2VydmVyIG9iamVjdCB0aGF0IGlzIHBhc3NlZCBpbiBieSB0aGUgY2FsbGVyLlxuICovXG5hc3luYyBmdW5jdGlvbiBTdGFydEFwcChTZXJ2ZXI/KSB7XG4gICAgY29uc3QgYXBwID0gbmV3IFRpbnlBcHAoKTtcbiAgICBpZiAoIVNldHRpbmdzLnNlcnZlLmh0dHAyKSB7XG4gICAgICAgIGFwcC51c2UoPGFueT5jb21wcmVzc2lvbigpKTtcbiAgICB9XG4gICAgZmlsZUJ5VXJsLlNldHRpbmdzLlNlc3Npb25TdG9yZSA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4gU2V0dGluZ3MubWlkZGxld2FyZS5zZXNzaW9uKHJlcSwgcmVzLCBuZXh0KTtcblxuICAgIGNvbnN0IE9wZW5MaXN0aW5nID0gYXdhaXQgU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKTtcblxuICAgIGZvciAoY29uc3QgZnVuYyBvZiBTZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCkge1xuICAgICAgICBhd2FpdCBmdW5jKGFwcCwgYXBwT25saW5lLnNlcnZlciwgU2V0dGluZ3MpO1xuICAgIH1cbiAgICBhd2FpdCBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKT8uKClcblxuICAgIGFwcC5hbGwoXCIqXCIsIFBhcnNlUmVxdWVzdCk7XG5cbiAgICBhd2FpdCBPcGVuTGlzdGluZyhTZXR0aW5ncy5zZXJ2ZS5wb3J0KTtcblxuICAgIGNvbnNvbGUubG9nKFwiQXBwIGxpc3RpbmcgYXQgcG9ydDogXCIgKyBTZXR0aW5ncy5zZXJ2ZS5wb3J0KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcmVxdWVzdCBpcyBhIFBPU1QgcmVxdWVzdCwgdGhlbiBwYXJzZSB0aGUgcmVxdWVzdCBib2R5LCB0aGVuIHNlbmQgaXQgdG8gcm91dGluZyBzZXR0aW5nc1xuICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLSBUaGUgaW5jb21pbmcgcmVxdWVzdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlcyAtIFJlc3BvbnNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlUmVxdWVzdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAocmVxLm1ldGhvZCA9PSAnUE9TVCcpIHtcbiAgICAgICAgaWYgKHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXT8uc3RhcnRzV2l0aD8uKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgICAgIFNldHRpbmdzLm1pZGRsZXdhcmUuYm9keVBhcnNlcihyZXEsIHJlcywgKCkgPT4gcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgZm9ybWlkYWJsZS5JbmNvbWluZ0Zvcm0oU2V0dGluZ3MubWlkZGxld2FyZS5mb3JtaWRhYmxlKS5wYXJzZShyZXEsIChlcnIsIGZpZWxkcywgZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcikge1xuICAgIGlmIChhcHBPbmxpbmUgJiYgYXBwT25saW5lLmNsb3NlKSB7XG4gICAgICAgIGF3YWl0IGFwcE9ubGluZS5jbG9zZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VydmVyLCBsaXN0ZW4sIGNsb3NlIH0gPSBhd2FpdCBTZXJ2ZXIoYXBwKTtcblxuICAgIGFwcE9ubGluZSA9IHsgc2VydmVyLCBjbG9zZSB9O1xuXG4gICAgcmV0dXJuIGxpc3Rlbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU3RhcnRTZXJ2ZXIoeyBTaXRlUGF0aCA9ICcuLycsIEh0dHBTZXJ2ZXIgPSBVcGRhdGVHcmVlbkxvY2sgfSA9IHt9KSB7XG4gICAgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyID0gU2l0ZVBhdGg7XG4gICAgYnVpbGRGaXJzdExvYWQoKTtcbiAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICBTdGFydEFwcChIdHRwU2VydmVyKTtcbn1cblxuZXhwb3J0IHsgU2V0dGluZ3MgfTsiLCAiaW1wb3J0IGZzLCB7RGlyZW50LCBTdGF0c30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIGV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIHJlcyhCb29sZWFuKHN0YXQpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge3BhdGggb2YgdGhlIGZpbGV9IHBhdGggXG4gKiBAcGFyYW0ge2ZpbGVkIHRvIGdldCBmcm9tIHRoZSBzdGF0IG9iamVjdH0gZmlsZWQgXG4gKiBAcmV0dXJucyB0aGUgZmlsZWRcbiAqL1xuZnVuY3Rpb24gc3RhdChwYXRoOiBzdHJpbmcsIGZpbGVkPzogc3RyaW5nLCBpZ25vcmVFcnJvcj86IGJvb2xlYW4sIGRlZmF1bHRWYWx1ZTphbnkgPSB7fSk6IFByb21pc2U8U3RhdHMgfCBhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIGlmKGVyciAmJiAhaWdub3JlRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZWQgJiYgc3RhdD8gc3RhdFtmaWxlZF06IHN0YXQgfHwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGZpbGUgZXhpc3RzLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjaGVjay5cbiAqIEBwYXJhbSB7YW55fSBbaWZUcnVlUmV0dXJuPXRydWVdIC0gYW55ID0gdHJ1ZVxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiBleGlzdHNGaWxlKHBhdGg6IHN0cmluZywgaWZUcnVlUmV0dXJuOiBhbnkgPSB0cnVlKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gKGF3YWl0IHN0YXQocGF0aCwgdW5kZWZpbmVkLCB0cnVlKSkuaXNGaWxlPy4oKSAmJiBpZlRydWVSZXR1cm47XG59XG5cbi8qKlxuICogSXQgY3JlYXRlcyBhIGRpcmVjdG9yeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIG1rZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLm1rZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHJtZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcm1kaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucm1kaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgdW5saW5rYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gdW5saW5rKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnVubGluayhwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGV4aXN0cywgZGVsZXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSB0byBiZSB1bmxpbmtlZC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5saW5rSWZFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZihhd2FpdCBleGlzdHMocGF0aCkpe1xuICAgICAgICByZXR1cm4gYXdhaXQgdW5saW5rKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRkaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbnMgb2JqZWN0LCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHtcbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHJlYWRkaXIocGF0aDogc3RyaW5nLCBvcHRpb25zID0ge30pOiBQcm9taXNlPHN0cmluZ1tdIHwgQnVmZmVyW10gfCBEaXJlbnRbXT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRkaXIocGF0aCwgb3B0aW9ucywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlcyB8fCBbXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkaXJlY3Rvcnkgd2FzIGNyZWF0ZWQgb3Igbm90LlxuICovXG5hc3luYyBmdW5jdGlvbiBta2RpcklmTm90RXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoIWF3YWl0IGV4aXN0cyhwYXRoKSlcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1rZGlyKHBhdGgpO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIGZpbGUgdG8gdGhlIGZpbGUgc3lzdGVtXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHtzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHdyaXRlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6ICBzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3KTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMud3JpdGVGaWxlKHBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHdyaXRlSnNvbkZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGEgY29udGVudCBhbmQgd3JpdGVzIHRoZSBjb250ZW50IHRvIHRoZSBmaWxlIGF0XG4gKiB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7YW55fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSnNvbkZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgd3JpdGVGaWxlKHBhdGgsIEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZEZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbmFsIGVuY29kaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gKiByZXNvbHZlcyB0byB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXQgdGhlIGdpdmVuIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBbZW5jb2Rpbmc9dXRmOF0gLSBUaGUgZW5jb2Rpbmcgb2YgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlYWRGaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZyA9ICd1dGY4Jyk6IFByb21pc2U8c3RyaW5nfGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRGaWxlKHBhdGgsIDxhbnk+ZW5jb2RpbmcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhkYXRhIHx8IFwiXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJdCByZWFkcyBhIEpTT04gZmlsZSBhbmQgcmV0dXJucyB0aGUgcGFyc2VkIEpTT04gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIHtzdHJpbmd9IFtlbmNvZGluZ10gLSBUaGUgZW5jb2RpbmcgdG8gdXNlIHdoZW4gcmVhZGluZyB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZEpzb25GaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZz86c3RyaW5nKTogUHJvbWlzZTxhbnk+e1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHJlYWRGaWxlKHBhdGgsIGVuY29kaW5nKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSBwIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBuZWVkcyB0byBiZSBjcmVhdGVkLlxuICogQHBhcmFtIFtiYXNlXSAtIFRoZSBiYXNlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VQYXRoUmVhbChwOnN0cmluZywgYmFzZSA9ICcnKSB7XG4gICAgcCA9IHBhdGguZGlybmFtZShwKTtcblxuICAgIGlmICghYXdhaXQgZXhpc3RzKGJhc2UgKyBwKSkge1xuICAgICAgICBjb25zdCBhbGwgPSBwLnNwbGl0KC9cXFxcfFxcLy8pO1xuXG4gICAgICAgIGxldCBwU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGlmIChwU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHBTdHJpbmcgKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcFN0cmluZyArPSBpO1xuXG4gICAgICAgICAgICBhd2FpdCBta2RpcklmTm90RXhpc3RzKGJhc2UgKyBwU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy90eXBlc1xuZXhwb3J0IHtcbiAgICBEaXJlbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC4uLmZzLnByb21pc2VzLFxuICAgIGV4aXN0cyxcbiAgICBleGlzdHNGaWxlLFxuICAgIHN0YXQsXG4gICAgbWtkaXIsXG4gICAgbWtkaXJJZk5vdEV4aXN0cyxcbiAgICB3cml0ZUZpbGUsXG4gICAgd3JpdGVKc29uRmlsZSxcbiAgICByZWFkRmlsZSxcbiAgICByZWFkSnNvbkZpbGUsXG4gICAgcm1kaXIsXG4gICAgdW5saW5rLFxuICAgIHVubGlua0lmRXhpc3RzLFxuICAgIHJlYWRkaXIsXG4gICAgbWFrZVBhdGhSZWFsXG59IiwgImxldCBwcmludE1vZGUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dQcmludChkOiBib29sZWFuKSB7XG4gICAgcHJpbnRNb2RlID0gZDtcbn1cblxuZXhwb3J0IGNvbnN0IHByaW50ID0gbmV3IFByb3h5KGNvbnNvbGUse1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmKHByb3AgPT0gJ2ltcG9ydGFudCcpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmVycm9yO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmKHByaW50TW9kZSAmJiBwcm9wICE9IFwiZG8tbm90aGluZ1wiKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgfVxufSk7IiwgImltcG9ydCB7RGlyZW50fSBmcm9tICdmcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge2N3ZH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCAsIFNwbGl0Rmlyc3R9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcblxuZnVuY3Rpb24gZ2V0RGlybmFtZSh1cmw6IHN0cmluZyl7XG4gICAgcmV0dXJuIHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKHVybCkpO1xufVxuXG5jb25zdCBTeXN0ZW1EYXRhID0gcGF0aC5qb2luKGdldERpcm5hbWUoaW1wb3J0Lm1ldGEudXJsKSwgJy9TeXN0ZW1EYXRhJyk7XG5cbmxldCBXZWJTaXRlRm9sZGVyXyA9IFwiV2ViU2l0ZVwiO1xuXG5jb25zdCBTdGF0aWNOYW1lID0gJ1dXVycsIExvZ3NOYW1lID0gJ0xvZ3MnLCBNb2R1bGVzTmFtZSA9ICdub2RlX21vZHVsZXMnO1xuXG5jb25zdCBTdGF0aWNDb21waWxlID0gU3lzdGVtRGF0YSArIGAvJHtTdGF0aWNOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVMb2dzID0gU3lzdGVtRGF0YSArIGAvJHtMb2dzTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTW9kdWxlID0gU3lzdGVtRGF0YSArIGAvJHtNb2R1bGVzTmFtZX1Db21waWxlL2A7XG5cbmNvbnN0IHdvcmtpbmdEaXJlY3RvcnkgPSBjd2QoKSArICcvJztcblxuZnVuY3Rpb24gR2V0RnVsbFdlYlNpdGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSxXZWJTaXRlRm9sZGVyXywgJy8nKTtcbn1cbmxldCBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG5cbmZ1bmN0aW9uIEdldFNvdXJjZShuYW1lKSB7XG4gICAgcmV0dXJuICBHZXRGdWxsV2ViU2l0ZVBhdGgoKSArIG5hbWUgKyAnLydcbn1cblxuLyogQSBvYmplY3QgdGhhdCBjb250YWlucyBhbGwgdGhlIHBhdGhzIG9mIHRoZSBmaWxlcyBpbiB0aGUgcHJvamVjdC4gKi9cbmNvbnN0IGdldFR5cGVzID0ge1xuICAgIFN0YXRpYzogW1xuICAgICAgICBHZXRTb3VyY2UoU3RhdGljTmFtZSksXG4gICAgICAgIFN0YXRpY0NvbXBpbGUsXG4gICAgICAgIFN0YXRpY05hbWVcbiAgICBdLFxuICAgIExvZ3M6IFtcbiAgICAgICAgR2V0U291cmNlKExvZ3NOYW1lKSxcbiAgICAgICAgQ29tcGlsZUxvZ3MsXG4gICAgICAgIExvZ3NOYW1lXG4gICAgXSxcbiAgICBub2RlX21vZHVsZXM6IFtcbiAgICAgICAgR2V0U291cmNlKCdub2RlX21vZHVsZXMnKSxcbiAgICAgICAgQ29tcGlsZU1vZHVsZSxcbiAgICAgICAgTW9kdWxlc05hbWVcbiAgICBdLFxuICAgIGdldCBbU3RhdGljTmFtZV0oKXtcbiAgICAgICAgcmV0dXJuIGdldFR5cGVzLlN0YXRpYztcbiAgICB9XG59XG5cbmNvbnN0IHBhZ2VUeXBlcyA9IHtcbiAgICBwYWdlOiBcInBhZ2VcIixcbiAgICBtb2RlbDogXCJtb2RlXCIsXG4gICAgY29tcG9uZW50OiBcImludGVcIlxufVxuXG5cbmNvbnN0IEJhc2ljU2V0dGluZ3MgPSB7XG4gICAgcGFnZVR5cGVzLFxuXG4gICAgcGFnZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgcGFnZUNvZGVGaWxlOiB7XG4gICAgICAgIHBhZ2U6IFtwYWdlVHlwZXMucGFnZStcIi5qc1wiLCBwYWdlVHlwZXMucGFnZStcIi50c1wiXSxcbiAgICAgICAgbW9kZWw6IFtwYWdlVHlwZXMubW9kZWwrXCIuanNcIiwgcGFnZVR5cGVzLm1vZGVsK1wiLnRzXCJdLFxuICAgICAgICBjb21wb25lbnQ6IFtwYWdlVHlwZXMuY29tcG9uZW50K1wiLmpzXCIsIHBhZ2VUeXBlcy5jb21wb25lbnQrXCIudHNcIl1cbiAgICB9LFxuXG4gICAgcGFnZUNvZGVGaWxlQXJyYXk6IFtdLFxuXG4gICAgcGFydEV4dGVuc2lvbnM6IFsnc2VydicsICdhcGknXSxcblxuICAgIFJlcUZpbGVUeXBlczoge1xuICAgICAgICBqczogXCJzZXJ2LmpzXCIsXG4gICAgICAgIHRzOiBcInNlcnYudHNcIixcbiAgICAgICAgJ2FwaS10cyc6IFwiYXBpLmpzXCIsXG4gICAgICAgICdhcGktanMnOiBcImFwaS50c1wiXG4gICAgfSxcbiAgICBSZXFGaWxlVHlwZXNBcnJheTogW10sXG5cbiAgICBnZXQgV2ViU2l0ZUZvbGRlcigpIHtcbiAgICAgICAgcmV0dXJuIFdlYlNpdGVGb2xkZXJfO1xuICAgIH0sXG4gICAgZ2V0IGZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF87XG4gICAgfSxcbiAgICBzZXQgV2ViU2l0ZUZvbGRlcih2YWx1ZSkge1xuICAgICAgICBXZWJTaXRlRm9sZGVyXyA9IHZhbHVlO1xuXG4gICAgICAgIGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcbiAgICAgICAgZ2V0VHlwZXMuU3RhdGljWzBdID0gR2V0U291cmNlKFN0YXRpY05hbWUpO1xuICAgICAgICBnZXRUeXBlcy5Mb2dzWzBdID0gR2V0U291cmNlKExvZ3NOYW1lKTtcbiAgICB9LFxuICAgIGdldCB0c0NvbmZpZygpe1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXyArICd0c2NvbmZpZy5qc29uJzsgXG4gICAgfSxcbiAgICBhc3luYyB0c0NvbmZpZ0ZpbGUoKSB7XG4gICAgICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMudHNDb25maWcpKXtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy50c0NvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbGF0aXZlKGZ1bGxQYXRoOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShmdWxsV2ViU2l0ZVBhdGhfLCBmdWxsUGF0aClcbiAgICB9XG59XG5cbkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzKTtcbkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlKS5mbGF0KCk7XG5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlcyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBDdXRUaGVMYXN0KCcuJywgU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkucG9wKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZUJ5U21hbGxQYXRoKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gZ2V0VHlwZXNbU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkuc2hpZnQoKV07XG59XG5cblxuXG5leHBvcnQge1xuICAgIGdldERpcm5hbWUsXG4gICAgU3lzdGVtRGF0YSxcbiAgICB3b3JraW5nRGlyZWN0b3J5LFxuICAgIGdldFR5cGVzLFxuICAgIEJhc2ljU2V0dGluZ3Ncbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5pbnRlcmZhY2UgZ2xvYmFsU3RyaW5nPFQ+IHtcbiAgICBpbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIGxhc3RJbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIHN0YXJ0c1dpdGgoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3BsaXRGaXJzdDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+Pih0eXBlOiBzdHJpbmcsIHN0cmluZzogVCk6IFRbXSB7XG4gICAgY29uc3QgaW5kZXggPSBzdHJpbmcuaW5kZXhPZih0eXBlKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSlcbiAgICAgICAgcmV0dXJuIFtzdHJpbmddO1xuXG4gICAgcmV0dXJuIFtzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGV4KSwgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIHR5cGUubGVuZ3RoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDdXRUaGVMYXN0KHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YodHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0ZW5zaW9uPFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0cmluZzogVCkge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1UeXBlKHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICB3aGlsZSAoc3RyaW5nLnN0YXJ0c1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcodHlwZS5sZW5ndGgpO1xuXG4gICAgd2hpbGUgKHN0cmluZy5lbmRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGVuZ3RoIC0gdHlwZS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0cmluZ1N0YXJ0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0YXJ0OiBzdHJpbmcsIHN0cmluZzogVCk6IFQge1xuICAgIGlmKHN0cmluZy5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vLi4vSlNQYXJzZXInO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVRleHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGA8JXs/ZGVidWdfZmlsZT99JHtpLnRleHR9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlU2NyaXB0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGBydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdMaW5lKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VUZXh0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZXIuc3RhcnQgPSBcIjwlXCI7XG4gICAgcGFyc2VyLmVuZCA9IFwiJT5cIjtcbiAgICByZXR1cm4gcGFyc2VyLlJlQnVpbGRUZXh0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdJbmZvKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IFBhcnNlU2NyaXB0Q29kZShjb2RlLCBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEFkZERlYnVnSW5mbyhpc29sYXRlOiBib29sZWFuLCBwYWdlTmFtZTpzdHJpbmcsIEZ1bGxQYXRoOnN0cmluZywgU21hbGxQYXRoOnN0cmluZywgY2FjaGU6IHt2YWx1ZT86IHN0cmluZ30gPSB7fSl7XG4gICAgaWYoIWNhY2hlLnZhbHVlKVxuICAgICAgICBjYWNoZS52YWx1ZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsUGF0aCwgJ3V0ZjgnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbERhdGE6IG5ldyBTdHJpbmdUcmFja2VyKGAke3BhZ2VOYW1lfTxsaW5lPiR7U21hbGxQYXRofWAsIGlzb2xhdGUgPyBgPCV7JT4ke2NhY2hlLnZhbHVlfTwlfSU+YDogY2FjaGUudmFsdWUpLFxuICAgICAgICBzdHJpbmdJbmZvOiBgPCUhXFxucnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChwYWdlTmFtZSArICcgLT4gJyArIFNtYWxsUGF0aCl9XFxgOyU+YFxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aDogc3RyaW5nLCBpbnB1dFBhdGg6IHN0cmluZywgZm9sZGVyOnN0cmluZywgcGFnZVR5cGU6c3RyaW5nLCBwYXRoVHlwZSA9IDApIHtcbiAgICBpZiAocGFnZVR5cGUgJiYgIWlucHV0UGF0aC5lbmRzV2l0aCgnLicgKyBwYWdlVHlwZSkpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7aW5wdXRQYXRofS4ke3BhZ2VUeXBlfWA7XG4gICAgfVxuXG4gICAgaWYoaW5wdXRQYXRoWzBdID09ICdeJyl7IC8vIGxvYWQgZnJvbSBwYWNrYWdlc1xuICAgICAgICBjb25zdCBbcGFja2FnZU5hbWUsIGluUGF0aF0gPSBTcGxpdEZpcnN0KCcvJywgIGlucHV0UGF0aC5zdWJzdHJpbmcoMSkpO1xuICAgICAgICByZXR1cm4gKHBhdGhUeXBlID09IDAgPyB3b3JraW5nRGlyZWN0b3J5OiAnJykgKyBgbm9kZV9tb2R1bGVzLyR7cGFja2FnZU5hbWV9LyR7Zm9sZGVyfS8ke2luUGF0aH1gO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChpbnB1dFBhdGhbMV0gPT0gJy8nKSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDIpO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGAke3BhdGguZGlybmFtZShmaWxlUGF0aCl9LyR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIGlmIChpbnB1dFBhdGhbMF0gPT0gJy8nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2dldFR5cGVzLlN0YXRpY1twYXRoVHlwZV19JHtpbnB1dFBhdGh9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArICcvJyA6ICcnfSR7Zm9sZGVyfS8ke2lucHV0UGF0aH1gO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZShpbnB1dFBhdGgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGhUeXBlcyB7XG4gICAgU21hbGxQYXRoV2l0aG91dEZvbGRlcj86IHN0cmluZyxcbiAgICBTbWFsbFBhdGg/OiBzdHJpbmcsXG4gICAgRnVsbFBhdGg/OiBzdHJpbmcsXG4gICAgRnVsbFBhdGhDb21waWxlPzogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIENyZWF0ZUZpbGVQYXRoKGZpbGVQYXRoOnN0cmluZywgc21hbGxQYXRoOnN0cmluZywgaW5wdXRQYXRoOnN0cmluZywgZm9sZGVyOnN0cmluZywgcGFnZVR5cGU6IHN0cmluZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIFNtYWxsUGF0aDogQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKHNtYWxsUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlLCAyKSxcbiAgICAgICAgRnVsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlKSxcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUGFyc2VEZWJ1Z0xpbmUsXG4gICAgQ3JlYXRlRmlsZVBhdGgsXG4gICAgUGFyc2VEZWJ1Z0luZm9cbn07IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4vU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBHZW5lcmF0b3IsIFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gJy4vU291cmNlTWFwJztcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJvdGVjdGVkIG1hcDogU291cmNlTWFwR2VuZXJhdG9yO1xuICAgIHByb3RlY3RlZCBmaWxlRGlyTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBsaW5lQ291bnQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBodHRwU291cmNlID0gdHJ1ZSwgcHJvdGVjdGVkIHJlbGF0aXZlID0gZmFsc2UsIHByb3RlY3RlZCBpc0NzcyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgICAgICAgICBmaWxlOiBmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5wb3AoKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWh0dHBTb3VyY2UpXG4gICAgICAgICAgICB0aGlzLmZpbGVEaXJOYW1lID0gcGF0aC5kaXJuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTb3VyY2Uoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgICAgc291cmNlID0gc291cmNlLnNwbGl0KCc8bGluZT4nKS5wb3AoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaHR0cFNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMocGF0aC5leHRuYW1lKHNvdXJjZSkuc3Vic3RyaW5nKDEpKSlcbiAgICAgICAgICAgICAgICBzb3VyY2UgKz0gJy5zb3VyY2UnO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IFNwbGl0Rmlyc3QoJy8nLCBzb3VyY2UpLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoKHRoaXMucmVsYXRpdmUgPyAnJzogJy8nKSArIHNvdXJjZS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRoaXMuZmlsZURpck5hbWUsIEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc291cmNlKTtcbiAgICB9XG5cbiAgICBnZXRSb3dTb3VyY2VNYXAoKTogUmF3U291cmNlTWFwe1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAudG9KU09OKClcbiAgICB9XG5cbiAgICBtYXBBc1VSTENvbW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0b1VSTENvbW1lbnQodGhpcy5tYXAsIHRoaXMuaXNDc3MpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlTWFwU3RvcmUgZXh0ZW5kcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJpdmF0ZSBzdG9yZVN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgYWN0aW9uTG9hZDogeyBuYW1lOiBzdHJpbmcsIGRhdGE6IGFueVtdIH1bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgcHJvdGVjdGVkIGRlYnVnID0gdHJ1ZSwgaXNDc3MgPSBmYWxzZSwgaHR0cFNvdXJjZSA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIGZhbHNlLCBpc0Nzcyk7XG4gICAgfVxuXG4gICAgbm90RW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvbkxvYWQubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBhZGRTdHJpbmdUcmFja2VyKHRyYWNrOiBTdHJpbmdUcmFja2VyLCB7IHRleHQ6IHRleHQgPSB0cmFjay5lcSB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU3RyaW5nVHJhY2tlcicsIGRhdGE6IFt0cmFjaywge3RleHR9XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRTdHJpbmdUcmFja2VyKHRyYWNrOiBTdHJpbmdUcmFja2VyLCB7IHRleHQ6IHRleHQgPSB0cmFjay5lcSB9ID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFRleHQodGV4dCk7XG5cbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IHRleHQsIGxpbmUsIGluZm8gfSA9IERhdGFBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0ID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3YWl0TmV4dExpbmUgJiYgbGluZSAmJiBpbmZvKSB7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UoaW5mbylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cblxuICAgIGFkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFRleHQnLCBkYXRhOiBbdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVidWcpXG4gICAgICAgICAgICB0aGlzLmxpbmVDb3VudCArPSB0ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxO1xuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFVSTFNvdXJjZU1hcChtYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtYXAuc291cmNlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBtYXAuc291cmNlc1tpXSA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZmlsZVVSTFRvUGF0aChtYXAuc291cmNlc1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuXG4gICAgYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyJywgZGF0YTogW2Zyb21NYXAsIHRyYWNrLCB0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFRleHQodGV4dCk7XG5cbiAgICAgICAgKGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihmcm9tTWFwKSkuZWFjaE1hcHBpbmcoKG0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFJbmZvID0gdHJhY2suZ2V0TGluZShtLm9yaWdpbmFsTGluZSkuZ2V0RGF0YUFycmF5KClbMF07XG5cbiAgICAgICAgICAgIGlmIChtLnNvdXJjZSA9PSB0aGlzLmZpbGVQYXRoKVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogZGF0YUluZm8ubGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUgKyB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hZGRUZXh0KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYnVpbGRBbGwoKSB7XG4gICAgICAgIGZvciAoY29uc3QgeyBuYW1lLCBkYXRhIH0gb2YgdGhpcy5hY3Rpb25Mb2FkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkVGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRUZXh0KC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICB0aGlzLmJ1aWxkQWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpXG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlRGF0YVdpdGhNYXAoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYnVpbGRBbGwoKTtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmcgKyBzdXBlci5tYXBBc1VSTENvbW1lbnQoKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBTb3VyY2VNYXBTdG9yZSh0aGlzLmZpbGVQYXRoLCB0aGlzLmRlYnVnLCB0aGlzLmlzQ3NzLCB0aGlzLmh0dHBTb3VyY2UpO1xuICAgICAgICBjb3B5LmFjdGlvbkxvYWQucHVzaCguLi50aGlzLmFjdGlvbkxvYWQpXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVVJMQ29tbWVudChtYXA6IFNvdXJjZU1hcEdlbmVyYXRvciwgaXNDc3M/OiBib29sZWFuKSB7XG4gICAgbGV0IG1hcFN0cmluZyA9IGBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKG1hcC50b1N0cmluZygpKS50b1N0cmluZyhcImJhc2U2NFwiKX1gO1xuXG4gICAgaWYgKGlzQ3NzKVxuICAgICAgICBtYXBTdHJpbmcgPSBgLyojICR7bWFwU3RyaW5nfSovYFxuICAgIGVsc2VcbiAgICAgICAgbWFwU3RyaW5nID0gJy8vIyAnICsgbWFwU3RyaW5nO1xuXG4gICAgcmV0dXJuICdcXHJcXG4nICsgbWFwU3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gTWVyZ2VTb3VyY2VNYXAoZ2VuZXJhdGVkTWFwOiBSYXdTb3VyY2VNYXAsIG9yaWdpbmFsTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihvcmlnaW5hbE1hcCk7XG4gICAgY29uc3QgbmV3TWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcigpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZ2VuZXJhdGVkTWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcih7bGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbn0pXG4gICAgICAgIGlmKCFsb2NhdGlvbi5zb3VyY2UpIHJldHVybjtcbiAgICAgICAgbmV3TWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBtLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbG9jYXRpb24uY29sdW1uLFxuICAgICAgICAgICAgICAgIGxpbmU6IGxvY2F0aW9uLmxpbmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3VyY2U6IGxvY2F0aW9uLnNvdXJjZVxuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ld01hcDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwQmFzaWMgfSBmcm9tICcuLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuXG5jbGFzcyBjcmVhdGVQYWdlU291cmNlTWFwIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2UgPSBmYWxzZSwgcmVsYXRpdmUgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgICAgICB0aGlzLmxpbmVDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgYWRkTWFwcGluZ0Zyb21UcmFjayh0cmFjazogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dHB1dE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgc3RvcmVNYXAuYWRkTWFwcGluZ0Zyb21UcmFjayh0ZXh0KTtcblxuICAgIHJldHVybiBzdG9yZU1hcC5nZXRSb3dTb3VyY2VNYXAoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dHB1dFdpdGhNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZyl7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCk7XG4gICAgc3RvcmVNYXAuYWRkTWFwcGluZ0Zyb21UcmFjayh0ZXh0KTtcblxuICAgIHJldHVybiB0ZXh0LmVxICsgc3RvcmVNYXAubWFwQXNVUkxDb21tZW50KCk7XG59IiwgImltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IG91dHB1dE1hcCwgb3V0cHV0V2l0aE1hcCB9IGZyb20gXCIuL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgdGV4dD86IHN0cmluZyxcbiAgICBpbmZvOiBzdHJpbmcsXG4gICAgbGluZT86IG51bWJlcixcbiAgICBjaGFyPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTdHJpbmdJbmRleGVySW5mbyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5TWF0Y2ggZXh0ZW5kcyBBcnJheTxTdHJpbmdUcmFja2VyPiB7XG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgaW5wdXQ/OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmluZ1RyYWNrZXIge1xuICAgIHByaXZhdGUgRGF0YUFycmF5OiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuICAgIHB1YmxpYyBJbmZvVGV4dDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgT25MaW5lID0gMTtcbiAgICBwdWJsaWMgT25DaGFyID0gMTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gSW5mb1RleHQgdGV4dCBpbmZvIGZvciBhbGwgbmV3IHN0cmluZyB0aGF0IGFyZSBjcmVhdGVkIGluIHRoaXMgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKEluZm8/OiBzdHJpbmcgfCBTdHJpbmdUcmFja2VyRGF0YUluZm8sIHRleHQ/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBJbmZvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mbztcbiAgICAgICAgfSBlbHNlIGlmIChJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHQoSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgdGhpcy5BZGRGaWxlVGV4dCh0ZXh0LCB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhdGljIGdldCBlbXB0eUluZm8oKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXREZWZhdWx0KEluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dCkge1xuICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mby5pbmZvO1xuICAgICAgICB0aGlzLk9uTGluZSA9IEluZm8ubGluZTtcbiAgICAgICAgdGhpcy5PbkNoYXIgPSBJbmZvLmNoYXI7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERhdGFBcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBsYXN0IEluZm9UZXh0XG4gICAgICovXG4gICAgcHVibGljIGdldCBEZWZhdWx0SW5mb1RleHQoKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgaWYgKCF0aGlzLkRhdGFBcnJheS5maW5kKHggPT4geC5pbmZvKSAmJiB0aGlzLkluZm9UZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5mbzogdGhpcy5JbmZvVGV4dCxcbiAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLk9uTGluZSxcbiAgICAgICAgICAgICAgICBjaGFyOiB0aGlzLk9uQ2hhclxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5W3RoaXMuRGF0YUFycmF5Lmxlbmd0aCAtIDFdID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBmaXJzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIGdldCBTdGFydEluZm8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVswXSA/PyB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IGFzIG9uZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCBPbmVTdHJpbmcoKSB7XG4gICAgICAgIGxldCBiaWdTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBiaWdTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpZ1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IHNvIHlvdSBjYW4gY2hlY2sgaWYgaXQgZXF1YWwgb3Igbm90XG4gICAgICogdXNlIGxpa2UgdGhhdDogbXlTdHJpbmcuZXEgPT0gXCJjb29sXCJcbiAgICAgKi9cbiAgICBnZXQgZXEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGluZm8gYWJvdXQgdGhpcyB0ZXh0XG4gICAgICovXG4gICAgZ2V0IGxpbmVJbmZvKCkge1xuICAgICAgICBjb25zdCBkID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGNvbnN0IHMgPSBkLmluZm8uc3BsaXQoJzxsaW5lPicpO1xuICAgICAgICBzLnB1c2goQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzLnBvcCgpKTtcblxuICAgICAgICByZXR1cm4gYCR7cy5qb2luKCc8bGluZT4nKX06JHtkLmxpbmV9OiR7ZC5jaGFyfWA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBsZW5ndGggb2YgdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5Lmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyBjb3B5IG9mIHRoaXMgc3RyaW5nIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZSgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdEYXRhLkFkZFRleHRBZnRlcihpLnRleHQsIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQWRkQ2xvbmUoZGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICB0aGlzLkRhdGFBcnJheSA9IHRoaXMuRGF0YUFycmF5LmNvbmNhdChkYXRhLkRhdGFBcnJheSk7XG5cbiAgICAgICAgdGhpcy5zZXREZWZhdWx0KHtcbiAgICAgICAgICAgIGluZm86IGRhdGEuSW5mb1RleHQsXG4gICAgICAgICAgICBsaW5lOiBkYXRhLk9uTGluZSxcbiAgICAgICAgICAgIGNoYXI6IGRhdGEuT25DaGFyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IGFueSB0aGluZyB0byBjb25uZWN0XG4gICAgICogQHJldHVybnMgY29ubmN0ZWQgc3RyaW5nIHdpdGggYWxsIHRoZSB0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb25jYXQoLi4udGV4dDogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dCkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIGNsb25lIHBsdXMgdGhlIG5ldyBkYXRhIGNvbm5lY3RlZFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZVBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZ1RyYWNrZXIuY29uY2F0KHRoaXMuQ2xvbmUoKSwgLi4uZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmluZyBvciBhbnkgZGF0YSB0byB0aGlzIHN0cmluZ1xuICAgICAqIEBwYXJhbSBkYXRhIGNhbiBiZSBhbnkgdGhpbmdcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyAobm90IG5ldyBzdHJpbmcpXG4gICAgICovXG4gICAgcHVibGljIFBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0aW5mbyA9IGkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSwgbGFzdGluZm8uaW5mbywgbGFzdGluZm8ubGluZSwgbGFzdGluZm8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5zIG90IG90aGVyIGRhdGEgd2l0aCAnVGVtcGxhdGUgbGl0ZXJhbHMnXG4gICAgICogdXNlZCBsaWtlIHRoaXM6IG15U3RyaW4uJFBsdXMgYHRoaXMgdmVyeSR7Y29vbFN0cmluZ30hYFxuICAgICAqIEBwYXJhbSB0ZXh0cyBhbGwgdGhlIHNwbGl0ZWQgdGV4dFxuICAgICAqIEBwYXJhbSB2YWx1ZXMgYWxsIHRoZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyQodGV4dHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgYW55KVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0VmFsdWU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dHNbaV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcblxuICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dCwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcodmFsdWUpLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHRzW3RleHRzLmxlbmd0aCAtIDFdLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBzdHJpbmcgdG8gYWRkXG4gICAgICogQHBhcmFtIGFjdGlvbiB3aGVyZSB0byBhZGQgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gaW5mbyBpbmZvIHRoZSBjb21lIHdpdGggdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQWRkVGV4dEFjdGlvbih0ZXh0OiBzdHJpbmcsIGFjdGlvbjogXCJwdXNoXCIgfCBcInVuc2hpZnRcIiwgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8sIExpbmVDb3VudCA9IDAsIENoYXJDb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlOiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIGRhdGFTdG9yZS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5EYXRhQXJyYXlbYWN0aW9uXSguLi5kYXRhU3RvcmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlcih0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwicHVzaFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmcgd2l0aG91dCB0cmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXJOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nLCBpbmZvID0gJycpIHtcbiAgICAgICAgY29uc3QgY29weSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgY29weS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkudW5zaGlmdCguLi5jb3B5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIFRleHQgRmlsZSBUcmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHByaXZhdGUgQWRkRmlsZVRleHQodGV4dDogc3RyaW5nLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbykge1xuICAgICAgICBsZXQgTGluZUNvdW50ID0gMSwgQ2hhckNvdW50ID0gMTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2ltcGxlIG1ldGhvZiB0byBjdXQgc3RyaW5nXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgbmV3IGN1dHRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEN1dFN0cmluZyhzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcblxuICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5ID0gbmV3U3RyaW5nLkRhdGFBcnJheS5jb25jYXQodGhpcy5EYXRhQXJyYXkuc2xpY2Uoc3RhcnQsIGVuZCkpXG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG4gICAgICAgIGxldCB0aGlzU3Vic3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIHdoaWxlICgobGltaXQgPT0gbnVsbCB8fCBjb3VudGVyIDwgbGltaXQpICYmIGhhc01hdGg/LlswXT8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBbLi4uaGFzTWF0aFswXV0ubGVuZ3RoLCBpbmRleCA9IHRoaXNTdWJzdHJpbmcuY2hhckxlbmd0aChoYXNNYXRoLmluZGV4KTtcbiAgICAgICAgICAgIGFsbFNwbGl0LnB1c2goe1xuICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCArIGFkZE5leHQsXG4gICAgICAgICAgICAgICAgbGVuZ3RoXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFpblRleHQgPSBtYWluVGV4dC5zbGljZShoYXNNYXRoLmluZGV4ICsgaGFzTWF0aFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpc1N1YnN0cmluZyA9IHRoaXNTdWJzdHJpbmcuQ3V0U3RyaW5nKGluZGV4ICsgbGVuZ3RoKTtcbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGpvaW4oYXJyOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBsZXQgYWxsID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgYXJyKXtcbiAgICAgICAgICAgIGFsbC5BZGRDbG9uZShpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXBsYWNlckFzeW5jKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhhd2FpdCBmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBsZXQgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZShsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEpLCBjb2x1bW4gPSBjb2wgPz8gbG9jYXRpb24/LmNvbHVtbiA/PyAwO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKChsaW5lID8/IGxvY2F0aW9uPy5saW5lKSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gc2VhcmNoTGluZS5hdChjb2x1bW4tMSkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICByZXR1cm4gYCR7dGV4dCB8fCBtZXNzYWdlfSwgb24gZmlsZSAtPlxcbiR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrc2VhcmNoTGluZS5leHRyYWN0SW5mbygpfToke2RhdGEubGluZX06JHtkYXRhLmNoYXJ9JHtsb2NhdGlvbj8ubGluZVRleHQgPyAnXFxuTGluZTogXCInICsgbG9jYXRpb24ubGluZVRleHQudHJpbSgpICsgJ1wiJzogJyd9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nV2l0aFRhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dFdpdGhNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbilcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgICAgICByZXR1cm4gb3V0cHV0TWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24sIGh0dHBTb3VyY2UsIHJlbGF0aXZlKVxuICAgIH1cbn0iLCAiaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5jb25zdCBsb2FkUGF0aCA9IHR5cGVvZiBlc2J1aWxkICE9PSAndW5kZWZpbmVkJyA/ICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50Lyc6ICcvLi4vJztcbmNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsICsgbG9hZFBhdGggKyAnYnVpbGQud2FzbScpKSk7XG5jb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuY29uc3Qgd2FzbSA9IHdhc21JbnN0YW5jZS5leHBvcnRzO1xuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbSh0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuLyoqXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9lcnJvcnMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHdhc20uZ2V0X2Vycm9ycyhyZXRwdHIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGJsb2NrXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX2Jsb2NrKHRleHQsIGJsb2NrKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChibG9jaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX2Jsb2NrKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tpcF9zcGVjaWFsX3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gc2ltcGxlX3NraXBcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2NvbXBvbmVudChza2lwX3NwZWNpYWxfdGFnLCBzaW1wbGVfc2tpcCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2tpcF9zcGVjaWFsX3RhZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2ltcGxlX3NraXAsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB3YXNtLmluc2VydF9jb21wb25lbnQocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfZGVmKHRleHQsIGVuZF90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmRfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX2RlZihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHFfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9xKHRleHQsIHFfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX3EocHRyMCwgbGVuMCwgcV90eXBlLmNvZGVQb2ludEF0KDApKTtcbiAgICByZXR1cm4gcmV0ID4+PiAwO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2VqcyhyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzX21pbih0ZXh0LCBuYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2Vqc19taW4ocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzdGFydFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGVqc19wYXJzZSh0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGFydCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjIgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjIgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uZWpzX3BhcnNlKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMiwgbGVuMik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWdlX2Jhc2VfcGFyc2VyKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnBhZ2VfYmFzZV9wYXJzZXIocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWxfYXR0cl9wYXJzZXIodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uaHRtbF9hdHRyX3BhcnNlcihyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGNvbnN0IFNpbXBsZVNraXAgPSBbJ3RleHRhcmVhJywnc2NyaXB0JywgJ3N0eWxlJ107XG5leHBvcnQgY29uc3QgU2tpcFNwZWNpYWxUYWcgPSBbW1wiJVwiLCBcIiVcIl0sIFtcIiN7ZGVidWd9XCIsIFwie2RlYnVnfSNcIl1dOyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBmaW5kX2VuZF9vZl9kZWYsIGZpbmRfZW5kX29mX3EsIGZpbmRfZW5kX2Jsb2NrIH0gZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzJztcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9TZXR0aW5ncy5qcyc7XG5pbXBvcnQgeyBnZXREaXJuYW1lLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuXG5jb25zdCBjcHVMZW5ndGggPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGNwdXMoKS5sZW5ndGggLyAyKSk7XG5leHBvcnQgY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBlbmQgb2YgcXVvdGF0aW9uIG1hcmtzLCBza2lwcGluZyB0aGluZ3MgbGlrZSBlc2NhcGluZzogXCJcXFxcXCJcIlxuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW50T2ZRKHRleHQ6IHN0cmluZywgcVR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9xKHRleHQsIHFUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGNoYXIgc2tpcHBpbmcgZGF0YSBpbnNpZGUgcXVvdGF0aW9uIG1hcmtzXG4gICAgICogQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIGZpbmRFbmRPZkRlZih0ZXh0OiBzdHJpbmcsIEVuZFR5cGU6IHN0cmluZ1tdIHwgc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KEVuZFR5cGUpKSB7XG4gICAgICAgICAgICBFbmRUeXBlID0gW0VuZFR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBKU09OLnN0cmluZ2lmeShFbmRUeXBlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2FtZSBhcyAnZmluZEVuZE9mRGVmJyBvbmx5IHdpdGggb3B0aW9uIHRvIGN1c3RvbSAnb3BlbicgYW5kICdjbG9zZSdcbiAgICAgKiBgYGBqc1xuICAgICAqIEZpbmRFbmRPZkJsb2NrKGBjb29sIFwifVwiIHsgZGF0YSB9IH0gbmV4dGAsICd7JywgJ30nKVxuICAgICAqIGBgYFxuICAgICAqIGl0IHdpbGwgcmV0dXJuIHRoZSAxOCAtPiBcIn0gbmV4dFwiXG4gICAgICogIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBGaW5kRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIG9wZW46IHN0cmluZywgZW5kOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfYmxvY2sodGV4dCwgb3BlbiArIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgU2ltcGxlU2tpcDogc3RyaW5nW10gPSBTZXR0aW5ncy5TaW1wbGVTa2lwO1xuICAgIFNraXBTcGVjaWFsVGFnOiBzdHJpbmdbXVtdID0gU2V0dGluZ3MuU2tpcFNwZWNpYWxUYWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW50TmV3PzogYW55KSB7IH1cblxuICAgIHByaXZhdGUgcHJpbnRFcnJvcnModGV4dDogU3RyaW5nVHJhY2tlciwgZXJyb3JzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByaW50TmV3KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIEpTT04ucGFyc2UoZXJyb3JzKS5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXcoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7aS50eXBlX25hbWV9XCIsIHVzZWQgaW46ICR7dGV4dC5hdChOdW1iZXIoaS5pbmRleCkpLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXIodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFyJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFySFRNTCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXJIVE1MJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cbn1cblxudHlwZSBQYXJzZUJsb2NrcyA9IHsgbmFtZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciB9W11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlModGV4dDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKUycsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKU01pbmkodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTTWluaScsIFt0ZXh0LGZpbmRdKSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVKU1BhcnNlcih0ZXh0OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnRUpTUGFyc2VyJywgW3RleHQsIHN0YXJ0LCBlbmRdKSk7XG59IiwgIlxuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuaW50ZXJmYWNlIFNwbGl0VGV4dCB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHR5cGVfbmFtZTogc3RyaW5nLFxuICAgIGlzX3NraXA6IGJvb2xlYW5cbn1cblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcGFyc2Vfc3RyZWFtID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL3JlYWRlci93b3JrZXIuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dFN0cmVhbSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFNwbGl0VGV4dFtdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2J1aWxkX3N0cmVhbScsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZEZWZTa2lwQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZmluZF9lbmRfb2ZfZGVmX3NraXBfYmxvY2snLCBbdGV4dCwgSlNPTi5zdHJpbmdpZnkodHlwZXMpXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2VuZF9vZl9ibG9jaycsIFt0ZXh0LCB0eXBlcy5qb2luKCcnKV0pO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgUmVwbGFjZUFsbCh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQuc3BsaXQoZmluZCkpIHtcbiAgICAgICAgICAgIG5ld1RleHQgKz0gcmVwbGFjZSArIGk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dC5zdWJzdHJpbmcocmVwbGFjZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuXG5hYnN0cmFjdCBjbGFzcyBSZUJ1aWxkQ29kZUJhc2ljIGV4dGVuZHMgQmFzZUVudGl0eUNvZGUge1xuICAgIHB1YmxpYyBQYXJzZUFycmF5OiBTcGxpdFRleHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuUGFyc2VBcnJheSA9IFBhcnNlQXJyYXk7XG4gICAgfVxuXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBsZXQgT3V0U3RyaW5nID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBPdXRTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUmVwbGFjZUFsbChPdXRTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuXG5cbnR5cGUgRGF0YUNvZGVJbmZvID0ge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbnB1dHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBjbGFzcyBSZUJ1aWxkQ29kZVN0cmluZyBleHRlbmRzIFJlQnVpbGRDb2RlQmFzaWMge1xuICAgIHByaXZhdGUgRGF0YUNvZGU6IERhdGFDb2RlSW5mbztcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKFBhcnNlQXJyYXkpO1xuICAgICAgICB0aGlzLkRhdGFDb2RlID0geyB0ZXh0OiBcIlwiLCBpbnB1dHM6IFtdIH07XG4gICAgICAgIHRoaXMuQ3JlYXRlRGF0YUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgQ29kZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUudGV4dDtcbiAgICB9XG5cbiAgICBzZXQgQ29kZUJ1aWxkVGV4dCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgQWxsSW5wdXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDcmVhdGVEYXRhQ29kZSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGkuaXNfc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBgPHwke3RoaXMuRGF0YUNvZGUuaW5wdXRzLmxlbmd0aH18JHtpLnR5cGVfbmFtZSA/PyAnJ318PmA7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS5pbnB1dHMucHVzaChpLnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIDx8fD4gc3RhcnQgd2l0aCBhICgrLikgbGlrZSB0aGF0IGZvciBleGFtcGxlLCBcIisuPHx8PlwiLCB0aGUgdXBkYXRlIGZ1bmN0aW9uIHdpbGwgZ2V0IHRoZSBsYXN0IFwiU2tpcFRleHRcIiBpbnN0ZWFkIGdldHRpbmcgdGhlIG5ldyBvbmVcbiAgICAgKiBzYW1lIHdpdGggYSAoLS4pIGp1c3QgZm9yIGlnbm9yaW5nIGN1cnJlbnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB0aGUgYnVpbGRlZCBjb2RlXG4gICAgICovXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkRhdGFDb2RlLnRleHQucmVwbGFjZSgvPFxcfChbMC05XSspXFx8W1xcd10qXFx8Pi9naSwgKF8sIGcxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHNbZzFdO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuUmVwbGFjZUFsbChuZXdTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIGlmKGkuZXEudHJpbSgpLmxlbmd0aClcbiAgICAgICAgICAgICAgICBXaXRoSW5mby5QbHVzKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgLy8hJHtpLmxpbmVJbmZvfVxcbmApLFxuICAgICAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiAoY291bnQgIT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBXaXRoSW5mbztcbiAgICB9XG5cbiAgICBhc3luYyBmaW5kU2NyaXB0cygpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXdhaXQgRUpTUGFyc2VyKHRoaXMudGV4dC5lcSwgdGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGxldCBzdWJzdHJpbmcgPSB0aGlzLnRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gaS5uYW1lO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlKCR7c3Vic3RyaW5nfSk7YDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGVTYWZlKCR7c3Vic3RyaW5nfSk7YDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVidWdcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGBcXG5ydW5fc2NyaXB0X25hbWUgPSBcXGAke0pTUGFyc2VyLmZpeFRleHQoc3Vic3RyaW5nKX1cXGA7YFxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ25vLXRyYWNrJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IHN1YnN0cmluZyxcbiAgICAgICAgICAgICAgICB0eXBlOiA8YW55PnR5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFRleHQodGV4dDogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9gL2dpLCAnXFxcXGAnKS5yZXBsYWNlKC9cXHUwMDI0L2dpLCAnXFxcXHUwMDI0Jyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFRleHRTaW1wbGVRdW90ZXModGV4dDogU3RyaW5nVHJhY2tlciB8IHN0cmluZyl7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyk7XG4gICAgfVxuXG4gICAgUmVCdWlsZFRleHQoKSB7XG4gICAgICAgIGNvbnN0IGFsbGNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpLnR5cGUgPT0gJ25vLXRyYWNrJykge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCAnIScsIGkudGV4dCwgdGhpcy5lbmQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCBpLnRleHQsIHRoaXMuZW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxjb2RlO1xuICAgIH1cblxuICAgIEJ1aWxkQWxsKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcnVuU2NyaXB0ID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyRgXFxub3V0X3J1bl9zY3JpcHQudGV4dCs9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1ZyAmJiBpLnR5cGUgPT0gJ3NjcmlwdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgXFxucnVuX3NjcmlwdF9jb2RlPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyaXB0V2l0aEluZm8oaS50ZXh0KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHByaW50RXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgPHAgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPiR7SlNQYXJzZXIuZml4VGV4dChtZXNzYWdlKX08L3A+YDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgUnVuQW5kRXhwb3J0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGV4dCwgcGF0aClcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG4gICAgICAgIHJldHVybiBwYXJzZXIuQnVpbGRBbGwoaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3BsaXQyRnJvbUVuZCh0ZXh0OiBzdHJpbmcsIHNwbGl0Q2hhcjogc3RyaW5nLCBudW1Ub1NwbGl0RnJvbUVuZCA9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRleHQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0ZXh0W2ldID09IHNwbGl0Q2hhcikge1xuICAgICAgICAgICAgICAgIG51bVRvU3BsaXRGcm9tRW5kLS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1Ub1NwbGl0RnJvbUVuZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0ZXh0LnN1YnN0cmluZygwLCBpKSwgdGV4dC5zdWJzdHJpbmcoaSArIDEpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdGV4dF07XG4gICAgfVxufVxuXG5cbi8vYnVpbGQgc3BlY2lhbCBjbGFzcyBmb3IgcGFyc2VyIGNvbW1lbnRzIC8qKi8gc28geW91IGJlIGFibGUgdG8gYWRkIFJhem9yIGluc2lkZSBvZiBzdHlsZSBvdCBzY3JpcHQgdGFnXG5cbmludGVyZmFjZSBHbG9iYWxSZXBsYWNlQXJyYXkge1xuICAgIHR5cGU6ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBjbGFzcyBFbmFibGVHbG9iYWxSZXBsYWNlIHtcbiAgICBwcml2YXRlIHNhdmVkQnVpbGREYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXlbXSA9IFtdO1xuICAgIHByaXZhdGUgYnVpbGRDb2RlOiBSZUJ1aWxkQ29kZVN0cmluZztcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIHJlcGxhY2VyOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkZFRleHQgPSBcIlwiKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZXIgPSBSZWdFeHAoYCR7YWRkVGV4dH1cXFxcL1xcXFwqIXN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+XFxcXCpcXFxcL3xzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PmApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoY29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYnVpbGRDb2RlID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKGF3YWl0IFBhcnNlVGV4dFN0cmVhbShhd2FpdCB0aGlzLkV4dHJhY3RBbmRTYXZlQ29kZShjb2RlKSkpO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvZGUgPSBuZXcgSlNQYXJzZXIoY29kZSwgdGhpcy5wYXRoKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvZGUuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvZGUudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVkQnVpbGREYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkudGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gYHN5c3RlbS0tPHxlanN8JHtjb3VudGVyKyt9fD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBQYXJzZU91dHNpZGVPZkNvbW1lbnQodGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlcigvc3lzdGVtLS08XFx8ZWpzXFx8KFswLTldKVxcfD4vLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gU3BsaXRUb1JlcGxhY2VbMV07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoaW5kZXguU3RhcnRJbmZvKS5QbHVzJGAke3RoaXMuYWRkVGV4dH0vKiFzeXN0ZW0tLTx8ZWpzfCR7aW5kZXh9fD4qL2A7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBTdGFydEJ1aWxkKCkge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29tbWVudHMgPSBuZXcgSlNQYXJzZXIobmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCksIHRoaXMucGF0aCwgJy8qJywgJyovJyk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb21tZW50cy5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29tbWVudHMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGkudGV4dCA9IHRoaXMuUGFyc2VPdXRzaWRlT2ZDb21tZW50KGkudGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0ID0gZXh0cmFjdENvbW1lbnRzLlJlQnVpbGRUZXh0KCkuZXE7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29kZS5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlc3RvcmVBc0NvZGUoRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihEYXRhLnRleHQuU3RhcnRJbmZvKS5QbHVzJGA8JSR7RGF0YS50eXBlID09ICduby10cmFjaycgPyAnISc6ICcnfSR7RGF0YS50ZXh0fSU+YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgUmVzdG9yZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlcih0aGlzLnJlcGxhY2VyLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFNwbGl0VG9SZXBsYWNlWzFdID8/IFNwbGl0VG9SZXBsYWNlWzJdKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUmVzdG9yZUFzQ29kZSh0aGlzLnNhdmVkQnVpbGREYXRhW2luZGV4XSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgYnVpbGQsIE1lc3NhZ2UsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4vcHJpbnRNZXNzYWdlJztcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5SlModGV4dDogc3RyaW5nLCB0cmFja2VyOiBTdHJpbmdUcmFja2VyKXtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7Y29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKHRleHQsIHttaW5pZnk6IHRydWV9KTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKHRyYWNrZXIsIHdhcm5pbmdzKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKHRyYWNrZXIsIGVycilcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG59IiwgImltcG9ydCB7IGJ1aWxkLCBNZXNzYWdlLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IGAke2Vyci50ZXh0fSwgb24gZmlsZSAtPiAke2ZpbGVQYXRoID8/IGVyci5sb2NhdGlvbi5maWxlfToke2Vycj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHtlcnI/LmxvY2F0aW9uPy5jb2x1bW4gPz8gMH1gXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcCh7ZXJyb3JzfToge2Vycm9yczogIE1lc3NhZ2VbXX0sIHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcCk7XG4gICAgZm9yKGNvbnN0IGVyciBvZiBlcnJvcnMpe1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBvcmlnaW5hbC5vcmlnaW5hbFBvc2l0aW9uRm9yKGVyci5sb2NhdGlvbik7XG4gICAgICAgIGlmKHNvdXJjZS5zb3VyY2UpXG4gICAgICAgICAgICBlcnIubG9jYXRpb24gPSA8YW55PnNvdXJjZTtcbiAgICB9XG4gICAgRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc30sIGZpbGVQYXRoKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3M6IE1lc3NhZ2VbXSwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBmb3IgKGNvbnN0IHdhcm4gb2Ygd2FybmluZ3MpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBgJHt3YXJuLnRleHR9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyB3YXJuLmxvY2F0aW9uLmZpbGV9OiR7d2Fybj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHt3YXJuPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIHdhcm5pbmdzOiBNZXNzYWdlW10pIHtcbiAgICBmb3IgKGNvbnN0IHdhcm4gb2Ygd2FybmluZ3MpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZSh3YXJuKVxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwge2Vycm9yc306e2Vycm9yczogTWVzc2FnZVtdfSkge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUoZXJyKVxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGludGVyZmFjZSBQcmV2ZW50TG9nIHtcbiAgICBpZD86IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgZXJyb3JOYW1lOiBzdHJpbmcsXG4gICAgdHlwZT86IFwid2FyblwiIHwgXCJlcnJvclwiXG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nczoge1ByZXZlbnRFcnJvcnM6IHN0cmluZ1tdfSA9IHtcbiAgICBQcmV2ZW50RXJyb3JzOiBbXVxufVxuXG5jb25zdCBQcmV2ZW50RG91YmxlTG9nOiBzdHJpbmdbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgQ2xlYXJXYXJuaW5nID0gKCkgPT4gUHJldmVudERvdWJsZUxvZy5sZW5ndGggPSAwO1xuXG4vKipcbiAqIElmIHRoZSBlcnJvciBpcyBub3QgaW4gdGhlIFByZXZlbnRFcnJvcnMgYXJyYXksIHByaW50IHRoZSBlcnJvclxuICogQHBhcmFtIHtQcmV2ZW50TG9nfSAgLSBgaWRgIC0gVGhlIGlkIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5ld1ByaW50KHtpZCwgdGV4dCwgdHlwZSA9IFwid2FyblwiLCBlcnJvck5hbWV9OiBQcmV2ZW50TG9nKSB7XG4gICAgaWYoIVByZXZlbnREb3VibGVMb2cuaW5jbHVkZXMoaWQgPz8gdGV4dCkgJiYgIVNldHRpbmdzLlByZXZlbnRFcnJvcnMuaW5jbHVkZXMoZXJyb3JOYW1lKSl7XG4gICAgICAgIFByZXZlbnREb3VibGVMb2cucHVzaChpZCA/PyB0ZXh0KTtcbiAgICAgICAgcmV0dXJuIFt0eXBlID09ICdlcnJvcicgPyAnaW1wb3J0YW50JzogdHlwZSwgKHRleHQucmVwbGFjZSgvPGxpbmU+L2dpLCAnIC0+ICcpICsgYFxcblxcbkVycm9yLUNvZGU6ICR7ZXJyb3JOYW1lfVxcblxcbmApXTtcbiAgICB9XG4gICAgcmV0dXJuIFtcImRvLW5vdGhpbmdcIl1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBtaW5pZnlKUyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvbWluaWZ5JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgcGFyYW1zOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBzZWxlY3Rvcjogc3RyaW5nLCBtYWluQ29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBKU1BhcnNlci5SdW5BbmRFeHBvcnQobWFpbkNvZGUsIHBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkIGBmdW5jdGlvbiAke25hbWV9KHske3BhcmFtc319LCBzZWxlY3RvciR7c2VsZWN0b3IgPyBgID0gXCIke3NlbGVjdG9yfVwiYDogJyd9LCBvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30pe1xuICAgICAgICBjb25zdCB7d3JpdGUsIHdyaXRlU2FmZSwgc2V0UmVzcG9uc2UsIHNlbmRUb1NlbGVjdG9yfSA9IG5ldyBidWlsZFRlbXBsYXRlKG91dF9ydW5fc2NyaXB0KTtcbiAgICAgICAgJHthd2FpdCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUocGFyc2UpfVxuICAgICAgICB2YXIgZXhwb3J0cyA9ICR7bmFtZX0uZXhwb3J0cztcbiAgICAgICAgcmV0dXJuIHNlbmRUb1NlbGVjdG9yKHNlbGVjdG9yLCBvdXRfcnVuX3NjcmlwdC50ZXh0KTtcbiAgICB9XFxuJHtuYW1lfS5leHBvcnRzID0ge307YFxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHthc3luYzogbnVsbH0pO1xuXG4gICAgbGV0IHNjcmlwdEluZm8gPSBhd2FpdCB0ZW1wbGF0ZShcbiAgICAgICAgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMsXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcignbmFtZScsICdjb25uZWN0JyksXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcigncGFyYW1zJywgJycpLFxuICAgICAgICBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3NlbGVjdG9yJywgJycpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IEVuYWJsZUdsb2JhbFJlcGxhY2UgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6ICdleHRlcm5hbCcsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIilcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICdqc3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge21hcCwgY29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG4gICAgICAgIFxuICAgICAgICBSZXNDb2RlID0gU2F2ZVNlcnZlckNvZGUuUmVzdG9yZUNvZGUoYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIG1hcCkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtSZXNDb2RlfTwvc2NyaXB0PmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbWFwID0gdHlwZW9mIHNvdXJjZU1hcCA9PSAnc3RyaW5nJyA/IEpTT04ucGFyc2Uoc291cmNlTWFwKTogc291cmNlTWFwO1xuXG4gICAgY29uc3QgdHJhY2tDb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgY29kZSk7XG4gICAgY29uc3Qgc3BsaXRMaW5lcyA9IHRyYWNrQ29kZS5zcGxpdCgnXFxuJyk7XG4gICAgKGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihtYXApKS5lYWNoTWFwcGluZyhtID0+IHtcbiAgICAgICAgY29uc3QgaXNNYXAgPSBzcGxpdExpbmVzW20uZ2VuZXJhdGVkTGluZSAtIDFdO1xuICAgICAgICBpZiAoIWlzTWFwKSByZXR1cm47XG5cblxuICAgICAgICBsZXQgY2hhckNvdW50ID0gMTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGlzTWFwLnN1YnN0cmluZyhtLmdlbmVyYXRlZENvbHVtbiA/IG0uZ2VuZXJhdGVkQ29sdW1uIC0gMTogMCkuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgICAgIGkuaW5mbyA9IG0uc291cmNlO1xuICAgICAgICAgICAgaS5saW5lID0gbS5vcmlnaW5hbExpbmU7XG4gICAgICAgICAgICBpLmNoYXIgPSBjaGFyQ291bnQrKztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYWNrQ29kZTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgZ2VuZXJhdGVkOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxMaW5lcyA9IG9yaWdpbmFsLnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ2VuZXJhdGVkLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgIGNvbnN0IHtsaW5lLCBjaGFyLCBpbmZvfSAgPSBvcmlnaW5hbExpbmVzW2l0ZW0ubGluZSAtIDFdPy5EZWZhdWx0SW5mb1RleHQgPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgIGl0ZW0uaW5mbyA9IGluZm87XG4gICAgICAgIGl0ZW0uY2hhciA9IGNoYXI7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja1RvT3JpZ2luYWwob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBuZXdUcmFja2VyID0gYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIHNvdXJjZU1hcCk7XG4gICAgbWVyZ2VJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbCwgbmV3VHJhY2tlcik7XG4gICAgcmV0dXJuIG5ld1RyYWNrZXI7XG59XG5cbmZ1bmN0aW9uIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgaWYoaXRlbS5pbmZvID09IG15U291cmNlKXtcbiAgICAgICAgICAgIGNvbnN0IHtsaW5lLCBjaGFyLCBpbmZvfSA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0uYXQoaXRlbS5jaGFyLTEpPy5EZWZhdWx0SW5mb1RleHQgPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gaW5mbztcbiAgICAgICAgICAgIGl0ZW0uY2hhciA9IGNoYXI7XG4gICAgICAgIH0gZWxzZSBpZihpdGVtLmluZm8pIHtcbiAgICAgICAgICAgIGl0ZW0uaW5mbyA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZmlsZVVSTFRvUGF0aChpdGVtLmluZm8pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYWNrVG9PcmlnaW5hbFNzcyhvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCwgbXlTb3VyY2U6IHN0cmluZykge1xuICAgIGNvbnN0IG5ld1RyYWNrZXIgPSBhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZSwgc291cmNlTWFwKTtcbiAgICBtZXJnZVNhc3NJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbCwgbmV3VHJhY2tlciwgbXlTb3VyY2UpO1xuXG4gICAgcmV0dXJuIG5ld1RyYWNrZXI7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsICB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCB0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUVxID0gQmV0d2VlblRhZ0RhdGEuZXEsIEJldHdlZW5UYWdEYXRhRXFBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YUVxLnRyaW0oKSwgaXNNb2RlbCA9IHRhZ0RhdGEucG9wU3RyaW5nKCd0eXBlJykgPT0gJ21vZHVsZScsIGlzTW9kZWxTdHJpbmdDYWNoZSA9IGlzTW9kZWwgPyAnc2NyaXB0TW9kdWxlJyA6ICdzY3JpcHQnO1xuXG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlW2lzTW9kZWxTdHJpbmdDYWNoZV0uaW5jbHVkZXMoQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlW2lzTW9kZWxTdHJpbmdDYWNoZV0ucHVzaChCZXR3ZWVuVGFnRGF0YUVxQXNUcmltKTtcblxuICAgIGxldCByZXN1bHRDb2RlID0gJycsIHJlc3VsdE1hcDogc3RyaW5nO1xuXG4gICAgY29uc3QgQWRkT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgc291cmNlZmlsZTogQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgbGFuZ3VhZ2UudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcgPyAnZXh0ZXJuYWwnIDogZmFsc2UsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIilcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICdqc3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBtYXAsIGNvZGUsIHdhcm5pbmdzIH0gPSBhd2FpdCB0cmFuc2Zvcm0oQmV0d2VlblRhZ0RhdGEuZXEsIEFkZE9wdGlvbnMpO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIHdhcm5pbmdzKTtcblxuICAgICAgICByZXN1bHRDb2RlID0gY29kZTtcbiAgICAgICAgcmVzdWx0TWFwID0gbWFwO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cblxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZShpc01vZGVsID8gJ21vZHVsZScgOiAnc2NyaXB0JywgdGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdE1hcCkge1xuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoSlNPTi5wYXJzZShyZXN1bHRNYXApLCBCZXR3ZWVuVGFnRGF0YSwgcmVzdWx0Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFRleHQocmVzdWx0Q29kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBpZiAoZGF0YVRhZy5leGlzdHMoJ3NyYycpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke0JldHdlZW5UYWdEYXRhfTwvc2NyaXB0PmBcbiAgICAgICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnanMnKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKSB7XG4gICAgICAgIHJldHVybiBzY3JpcHRXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JpcHRXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCB9IGZyb20gXCJzb3VyY2UtbWFwLWpzXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50XCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1wb3J0ZXIob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kRmlsZVVybCh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKHVybFswXSA9PSAnLycgfHwgdXJsWzBdID09ICd+Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKFxuICAgICAgICAgICAgICAgICAgICB1cmwuc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgICAgICBwYXRoVG9GaWxlVVJMKHVybFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UpID8gJ2NvbXByZXNzZWQnIDogJ2V4cGFuZGVkJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTeW50YXgobGFuZ3VhZ2U6ICdzYXNzJyB8ICdzY3NzJyB8ICdjc3MnKSB7XG4gICAgcmV0dXJuIGxhbmd1YWdlID09ICdzYXNzJyA/ICdpbmRlbnRlZCcgOiBsYW5ndWFnZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NBbmRTb3VyY2Uoc291cmNlTWFwOiBSYXdTb3VyY2VNYXAsIHNvdXJjZTogc3RyaW5nKSB7XG4gICAgaWYgKCFzb3VyY2VNYXApIHJldHVybjtcbiAgICBmb3IgKGNvbnN0IGkgaW4gc291cmNlTWFwLnNvdXJjZXMpIHtcbiAgICAgICAgaWYgKHNvdXJjZU1hcC5zb3VyY2VzW2ldLnN0YXJ0c1dpdGgoJ2RhdGE6JykpIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcC5zb3VyY2VzW2ldID0gc291cmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Fzc0Vycm9yTGluZSh7IHNhc3NTdGFjayB9KSB7XG4gICAgY29uc3QgbG9jID0gc2Fzc1N0YWNrLm1hdGNoKC9bMC05XSs6WzAtOV0rLylbMF0uc3BsaXQoJzonKS5tYXAoeCA9PiBOdW1iZXIoeCkpO1xuICAgIHJldHVybiB7IGxpbmU6IGxvY1swXSwgY29sdW1uOiBsb2NbMV0gfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUHJpbnRTYXNzRXJyb3IoZXJyOiBhbnksIHtsaW5lLCBjb2x1bW59ID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpKXtcbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHRleHQ6IGAke2Vyci5tZXNzYWdlfSxcXG5vbiBmaWxlIC0+ICR7ZmlsZVVSTFRvUGF0aChlcnIuc3Bhbi51cmwpfToke2xpbmUgPz8gMH06JHtjb2x1bW4gPz8gMH1gLFxuICAgICAgICBlcnJvck5hbWU6IGVycj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgdHlwZTogZXJyPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnI6IGFueSwgdHJhY2s6IFN0cmluZ1RyYWNrZXIpe1xuICAgIGlmKGVyci5zcGFuLnVybCkgcmV0dXJuIFByaW50U2Fzc0Vycm9yKGVycik7XG5cbiAgICBlcnIubG9jYXRpb24gPSBnZXRTYXNzRXJyb3JMaW5lKGVycik7XG5cbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHRleHQ6IHRyYWNrLmRlYnVnTGluZShlcnIpLFxuICAgICAgICBlcnJvck5hbWU6IGVycj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgdHlwZTogZXJyPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVTYXNzKGxhbmd1YWdlOiBzdHJpbmcsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBvdXRTdHlsZSA9IEJldHdlZW5UYWdEYXRhLmVxKSB7XG4gICAgY29uc3QgdGhpc1BhZ2UgPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIHRoaXNQYWdlVVJMID0gcGF0aFRvRmlsZVVSTCh0aGlzUGFnZSksXG4gICAgICAgIGNvbXByZXNzZWQgPSBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKTtcblxuICAgIGxldCByZXN1bHQ6IHNhc3MuQ29tcGlsZVJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhvdXRTdHlsZSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBzZXNzaW9uSW5mby5kZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCg8YW55Pmxhbmd1YWdlKSxcbiAgICAgICAgICAgIHN0eWxlOiBjb21wcmVzc2VkID8gJ2NvbXByZXNzZWQnIDogJ2V4cGFuZGVkJyxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcih0aGlzUGFnZSksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudFxuICAgICAgICB9KTtcbiAgICAgICAgb3V0U3R5bGUgPSByZXN1bHQ/LmNzcyA/PyBvdXRTdHlsZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYoZXJyLnNwYW4udXJsKXtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aChlcnIuc3Bhbi51cmwpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgUHJpbnRTYXNzRXJyb3JUcmFja2VyKGVyciwgQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICByZXR1cm4ge291dFN0eWxlOiAnU2FzcyBFcnJvciAoc2VlIGNvbnNvbGUpJ31cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpLCBGdWxsUGF0aClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdD8uc291cmNlTWFwICYmIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgdGhpc1BhZ2VVUkwuaHJlZik7XG4gICAgcmV0dXJuIHsgcmVzdWx0LCBvdXRTdHlsZSwgY29tcHJlc3NlZCB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZyxwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZSgpO1xuICAgIGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLmxvYWQoQmV0d2VlblRhZ0RhdGEudHJpbVN0YXJ0KCksIHBhdGhOYW1lKTtcblxuICAgIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGxldCB7IG91dFN0eWxlLCBjb21wcmVzc2VkIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvLCBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCkpO1xuXG4gICAgaWYgKCFjb21wcmVzc2VkKVxuICAgICAgICBvdXRTdHlsZSA9IGBcXG4ke291dFN0eWxlfVxcbmA7XG5cbiAgICBjb25zdCByZVN0b3JlRGF0YSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbywgb3V0U3R5bGUpKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHN0eWxlJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke3JlU3RvcmVEYXRhfTwvc3R5bGU+YFxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzdHlsZScsIGRhdGFUYWcsICBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0Py5zb3VyY2VNYXApXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihTb3VyY2VNYXBTdG9yZS5maXhVUkxTb3VyY2VNYXAoPGFueT5yZXN1bHQuc291cmNlTWFwKSwgQmV0d2VlblRhZ0RhdGEsIG91dFN0eWxlKTtcbiAgICBlbHNlXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB7IHRleHQ6IG91dFN0eWxlIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc3R5bGVXaXRoU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzdHlsZVdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbGFuZycsICdjc3MnKTtcblxuICAgIGlmKGRhdGFUYWcucG9wQm9vbGVhbignc2VydmVyJykpe1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoX25vZGUgZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZUluRmlsZSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5cbmZ1bmN0aW9uIEluRm9sZGVyUGFnZVBhdGgoaW5wdXRQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nKSB7XG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gcGF0aF9ub2RlLmpvaW4oc21hbGxQYXRoLCAnLy4uLycsIGlucHV0UGF0aCk7XG4gICAgfVxuXG4gICAgaWYgKCFwYXRoX25vZGUuZXh0bmFtZShpbnB1dFBhdGgpKVxuICAgICAgICBpbnB1dFBhdGggKz0gJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcblxuICAgIHJldHVybiBpbnB1dFBhdGg7XG59XG5cbmNvbnN0IGNhY2hlTWFwOiB7IFtrZXk6IHN0cmluZ106IHsgQ29tcGlsZWREYXRhOiBTdHJpbmdUcmFja2VyLCBuZXdTZXNzaW9uOiBTZXNzaW9uQnVpbGQgfSB9ID0ge307XG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgZmlsZXBhdGggPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KFwiZnJvbVwiKTtcblxuICAgIGNvbnN0IGluU3RhdGljID0gSW5Gb2xkZXJQYWdlUGF0aChmaWxlcGF0aCwgc21hbGxQYXRoVG9QYWdlKHR5cGUuZXh0cmFjdEluZm8oKSkpO1xuXG4gICAgY29uc3QgRnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpblN0YXRpYywgU21hbGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5TdGF0aWM7XG5cbiAgICBpZiAoIShhd2FpdCBFYXN5RnMuc3RhdChGdWxsUGF0aCwgbnVsbCwgdHJ1ZSkpLmlzRmlsZT8uKCkpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdGV4dDogYFxcblBhZ2Ugbm90IGZvdW5kOiAke3R5cGUuYXQoMCkubGluZUluZm99IC0+ICR7RnVsbFBhdGh9YCxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3BhZ2Utbm90LWZvdW5kJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQsIEpTUGFyc2VyLnByaW50RXJyb3IoYFBhZ2Ugbm90IGZvdW5kOiAke0Jhc2ljU2V0dGluZ3MucmVsYXRpdmUodHlwZS5saW5lSW5mbyl9IC0+ICR7U21hbGxQYXRofWApKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGxldCBSZXR1cm5EYXRhOiBTdHJpbmdUcmFja2VyO1xuXG4gICAgY29uc3QgaGF2ZUNhY2hlID0gY2FjaGVNYXBbaW5TdGF0aWNdO1xuICAgIGlmICghaGF2ZUNhY2hlIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShudWxsLCBoYXZlQ2FjaGUubmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgIGNvbnN0IHsgQ29tcGlsZWREYXRhLCBzZXNzaW9uSW5mbzogbmV3U2Vzc2lvbiB9ID0gYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUoaW5TdGF0aWMsIGdldFR5cGVzLlN0YXRpYywgeyBuZXN0ZWRQYWdlOiBwYXRoTmFtZSwgbmVzdGVkUGFnZURhdGE6IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ29iamVjdCcpIH0pO1xuICAgICAgICBuZXdTZXNzaW9uLmRlcGVuZGVuY2llc1tTbWFsbFBhdGhdID0gbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG4gICAgICAgIGRlbGV0ZSBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcy50aGlzUGFnZTtcblxuICAgICAgICBzZXNzaW9uSW5mby5leHRlbmRzKG5ld1Nlc3Npb24pXG5cbiAgICAgICAgY2FjaGVNYXBbaW5TdGF0aWNdID0geyBDb21waWxlZERhdGE6IDxTdHJpbmdUcmFja2VyPkNvbXBpbGVkRGF0YSwgbmV3U2Vzc2lvbiB9O1xuICAgICAgICBSZXR1cm5EYXRhID0gPFN0cmluZ1RyYWNrZXI+Q29tcGlsZWREYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgQ29tcGlsZWREYXRhLCBuZXdTZXNzaW9uIH0gPSBjYWNoZU1hcFtpblN0YXRpY107XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIFJldHVybkRhdGEgPSBDb21waWxlZERhdGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IFJldHVybkRhdGFcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcblxuLyogSXQncyBhIEpTT04gZmlsZSBtYW5hZ2VyICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZUpTT04ge1xuICAgIHByaXZhdGUgc2F2ZVBhdGg6IHN0cmluZztcbiAgICBzdG9yZTogU3RyaW5nQW55TWFwID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBhdXRvTG9hZCA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5zYXZlUGF0aCA9IGAke1N5c3RlbURhdGF9LyR7ZmlsZVBhdGh9Lmpzb25gO1xuICAgICAgICBhdXRvTG9hZCAmJiB0aGlzLmxvYWRGaWxlKCk7XG5cbiAgICAgICAgcHJvY2Vzcy5vbignU0lHSU5UJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHByb2Nlc3MuZXhpdCgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZEZpbGUoKSB7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnNhdmVQYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBKU09OLnBhcnNlKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnNhdmVQYXRoKSB8fCAne30nKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGtleSBpcyBpbiB0aGUgc3RvcmUsIHJldHVybiB0aGUgdmFsdWUuIElmIG5vdCwgY3JlYXRlIGEgbmV3IHZhbHVlLCBzdG9yZSBpdCwgYW5kIHJldHVybiBpdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIGxvb2sgdXAgaW4gdGhlIHN0b3JlLlxuICAgICAqIEBwYXJhbSBbY3JlYXRlXSAtIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc3RyaW5nLlxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBvZiB0aGUga2V5IGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBoYXZlKGtleTogc3RyaW5nLCBjcmVhdGU/OiAoKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0b3JlW2tleV07XG4gICAgICAgIGlmIChpdGVtIHx8ICFjcmVhdGUpIHJldHVybiBpdGVtO1xuXG4gICAgICAgIGl0ZW0gPSBjcmVhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoa2V5LCBpdGVtKTtcblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHRoaXMuc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVbaV0gPSB1bmRlZmluZWRcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0b3JlW2ldXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlKCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5zdG9yZSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuL1N0b3JlSlNPTlwiO1xuXG5leHBvcnQgY29uc3QgcGFnZURlcHMgPSBuZXcgU3RvcmVKU09OKCdQYWdlc0luZm8nKVxuXG4vKipcbiAqIENoZWNrIGlmIGFueSBvZiB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZSBwYWdlIGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7U3RyaW5nTnVtYmVyTWFwfSBkZXBlbmRlbmNpZXMgLSBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuIFRoZSBrZXkgaXMgdGhlIHBhdGggdG8gdGhlIGZpbGUsIGFuZFxuICogdGhlIHZhbHVlIGlzIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDpzdHJpbmcsIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0gcGFnZURlcHMuc3RvcmVbcGF0aF0pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggICsgIChpID09ICd0aGlzUGFnZScgPyBwYXRoOiBpKTtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IGRlcGVuZGVuY2llc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICFkZXBlbmRlbmNpZXM7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGlzb2xhdGUoQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbyk7XG5cbiAgICBjb21waWxlZFN0cmluZy5QbHVzJCBgPCV7JT4ke0JldHdlZW5UYWdEYXRhfTwlfSU+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ051bWJlck1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVnaXN0ZXJFeHRlbnNpb24gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9zc3InO1xuaW1wb3J0IHsgcmVidWlsZEZpbGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlLCB7IHJlc29sdmUsIGNsZWFyTW9kdWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9wcmVwcm9jZXNzJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmFzeW5jIGZ1bmN0aW9uIHNzckhUTUwoZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgRnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGdldFYgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGd2ID0gKG5hbWU6IHN0cmluZykgPT4gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KG5hbWUsJycpLnRyaW0oKSxcbiAgICAgICAgICAgIHZhbHVlID0gZ3YoJ3NzcicgKyBDYXBpdGFsaXplKG5hbWUpKSB8fCBndihuYW1lKTtcblxuICAgICAgICByZXR1cm4gdmFsdWUgPyBldmFsKGAoeyR7dmFsdWV9fSlgKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgYnVpbGRQYXRoID0gYXdhaXQgcmVnaXN0ZXJFeHRlbnNpb24oRnVsbFBhdGgsIHNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoYnVpbGRQYXRoKTtcblxuICAgIGNvbnN0IHsgaHRtbCwgaGVhZCB9ID0gbW9kZS5kZWZhdWx0LnJlbmRlcihnZXRWKCdwcm9wcycpLCBnZXRWKCdvcHRpb25zJykpO1xuICAgIHNlc3Npb25JbmZvLmhlYWRIVE1MICs9IGhlYWQ7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ2Zyb20nKSwgZ2V0VHlwZXMuU3RhdGljWzJdLCAnc3ZlbHRlJyk7XG4gICAgY29uc3QgaW5XZWJQYXRoID0gcmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBTbWFsbFBhdGgpLnJlcGxhY2UoL1xcXFwvZ2ksICcvJyk7XG5cbiAgICBzZXNzaW9uSW5mby5zdHlsZSgnLycgKyBpbldlYlBhdGggKyAnLmNzcycpO1xuXG4gICAgY29uc3QgaWQgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2lkJywgQmFzZTY0SWQoaW5XZWJQYXRoKSksXG4gICAgICAgIGhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdChuYW1lLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gYCwke25hbWV9Onske3ZhbHVlfX1gIDogJyc7XG4gICAgICAgIH0sIHNlbGVjdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VsZWN0b3InKTtcblxuICAgIGNvbnN0IHNzciA9ICFzZWxlY3RvciAmJiBkYXRhVGFnLnBvcEJvb2xlYW4oJ3NzcicpID8gYXdhaXQgc3NySFRNTChkYXRhVGFnLCBGdWxsUGF0aCwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbykgOiAnJztcblxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdtb2R1bGUnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KFxuYGltcG9ydCBBcHAke2lkfSBmcm9tICcvJHtpbldlYlBhdGh9JztcbmNvbnN0IHRhcmdldCR7aWR9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiR7c2VsZWN0b3IgPyBzZWxlY3RvciA6ICcjJyArIGlkfVwiKTtcbnRhcmdldCR7aWR9ICYmIG5ldyBBcHAke2lkfSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQke2lkfVxuICAgICR7aGF2ZSgncHJvcHMnKSArIGhhdmUoJ29wdGlvbnMnKX0ke3NzciA/ICcsIGh5ZHJhdGU6IHRydWUnIDogJyd9XG59KTtgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBzZWxlY3RvciA/ICcnIDogYDxkaXYgaWQ9XCIke2lkfVwiPiR7c3NyfTwvZGl2PmApLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJZCh0ZXh0OiBzdHJpbmcsIG1heCA9IDEwKXtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odGV4dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnN1YnN0cmluZygwLCBtYXgpLnJlcGxhY2UoL1xcKy8sICdfJykucmVwbGFjZSgvXFwvLywgJ18nKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgIHsgQ2FwaXRhbGl6ZSwgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgQ29tcGlsZU9wdGlvbnMgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBjbGVhck1vZHVsZSwgcmVzb2x2ZSB9IGZyb20gXCIuLi8uLi9yZWRpcmVjdENKU1wiO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGVQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbmFtZSA9IHBhdGgucGFyc2UoZmlsZVBhdGgpLm5hbWUucmVwbGFjZSgvXlxcZC8sICdfJCYnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8kXS9nLCAnJyk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgICAgICBuYW1lOiBDYXBpdGFsaXplKG5hbWUpLFxuICAgICAgICBnZW5lcmF0ZTogJ3NzcicsXG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGRldjogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIGVycm9yTW9kZTogJ3dhcm4nXG4gICAgfTtcblxuICAgIGNvbnN0IGluU3RhdGljRmlsZSA9IHBhdGgucmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzbWFsbFBhdGgpO1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljRmlsZTtcblxuICAgIGNvbnN0IGZ1bGxJbXBvcnRQYXRoID0gZnVsbENvbXBpbGVQYXRoICsgJy5zc3IuY2pzJztcbiAgICBjb25zdCB7c3ZlbHRlRmlsZXMsIGNvZGUsIG1hcCwgZGVwZW5kZW5jaWVzfSA9IGF3YWl0IHByZXByb2Nlc3MoZmlsZVBhdGgsIHNtYWxsUGF0aCxmdWxsSW1wb3J0UGF0aCxmYWxzZSwnLnNzci5janMnKTtcbiAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyxkZXBlbmRlbmNpZXMpO1xuICAgIG9wdGlvbnMuc291cmNlbWFwID0gbWFwO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBmb3IoY29uc3QgZmlsZSBvZiBzdmVsdGVGaWxlcyl7XG4gICAgICAgIGNsZWFyTW9kdWxlKHJlc29sdmUoZmlsZSkpOyAvLyBkZWxldGUgb2xkIGltcG9ydHNcbiAgICAgICAgcHJvbWlzZXMucHVzaChyZWdpc3RlckV4dGVuc2lvbihmaWxlLCBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGUpLCBzZXNzaW9uSW5mbykpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGNvbnN0IHsganMsIGNzcywgd2FybmluZ3MgfSA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIDxhbnk+b3B0aW9ucyk7XG4gICAgUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzLCBmaWxlUGF0aCwgbWFwKTtcblxuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbEltcG9ydFBhdGgsIGpzLmNvZGUpO1xuXG4gICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9ICcvJyArIGluU3RhdGljRmlsZS5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIGZ1bGxJbXBvcnRQYXRoO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IGRpcm5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgUHJpbnRTYXNzRXJyb3JUcmFja2VyLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFeHRlbnNpb24sIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCwgYmFja1RvT3JpZ2luYWxTc3MgfSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBhd2FpdCBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsPGFueT4gc291cmNlTWFwLCBzb3VyY2VNYXAuc291cmNlcy5maW5kKHggPT4geC5zdGFydHNXaXRoKCdkYXRhOicpKSksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydFsgXSp0eXBlfGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgaWYobGFuZyA9PSAndHMnICYmIGFyZ3NbNV0uZW5kc1dpdGgoJyB0eXBlJykpXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoYXJnc1sxMF0uZXEpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJycpXG4gICAgICAgICAgICBpZiAobGFuZyA9PSAndHMnKVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy50cycpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy5qcycpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGFyZ3NbMV0uUGx1cyhhcmdzWzldLCBhcmdzWzEwXSwgKGV4dCA9PSAnLnN2ZWx0ZScgPyBzdmVsdGVFeHQgOiAnJyksIGFyZ3NbOV0sIChhcmdzWzExXSA/PyAnJykpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJy5zdmVsdGUnKSB7XG4gICAgICAgICAgICBjb25uZWN0U3ZlbHRlLnB1c2goYXJnc1sxMF0uZXEpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhbmcgIT09ICd0cycgfHwgIWFyZ3NbNF0pXG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcblxuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgbWFwVG9rZW5baWRdID0gbmV3RGF0YTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYF9fX3RvS2VuXFxgJHtpZH1cXGBgKTtcbiAgICB9KTtcblxuICAgIGlmIChsYW5nICE9PSAndHMnKVxuICAgICAgICByZXR1cm4gY29udGVudDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSAoYXdhaXQgdHJhbnNmb3JtKGNvbnRlbnQuZXEsIHsgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgbG9hZGVyOiAndHMnLCBzb3VyY2VtYXA6IHRydWUgfSkpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgYmFja1RvT3JpZ2luYWwoY29udGVudCwgY29kZSwgbWFwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGNvbnRlbnQsIGVycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgfVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoL19fX3RvS2VuYChbXFx3XFxXXSs/KWAvbWksIGFyZ3MgPT4ge1xuICAgICAgICByZXR1cm4gbWFwVG9rZW5bYXJnc1sxXS5lcV0gPz8gbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzYXZlUGF0aCA9IHNtYWxsUGF0aCwgaHR0cFNvdXJjZSA9IHRydWUsIHN2ZWx0ZUV4dCA9ICcnKSB7ICAgIFxuICAgIGxldCB0ZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoc21hbGxQYXRoLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGxldCBzY3JpcHRMYW5nID0gJ2pzJywgc3R5bGVMYW5nID0gJ2Nzcyc7XG5cbiAgICBjb25zdCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSA9IFtdLCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzY3JpcHQpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHNjcmlwdExhbmcgPSBhcmdzWzRdPy5lcSA/PyAnanMnO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGF3YWl0IFNjcmlwdFN2ZWx0ZShhcmdzWzddLCBzY3JpcHRMYW5nLCBjb25uZWN0U3ZlbHRlLCBzdmVsdGVFeHQpLCBhcmdzWzhdKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0eWxlQ29kZSA9IGNvbm5lY3RTdmVsdGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuICAgIGxldCBoYWRTdHlsZSA9IGZhbHNlO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c3R5bGUpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGlmKHN0eWxlTGFuZyA9PSAnY3NzJykgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llczogZGVwcyB9ID0gYXdhaXQgU0FTU1N2ZWx0ZShhcmdzWzddLCBzdHlsZUxhbmcsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgc2NyaXB0TGFuZywgc3R5bGVMYW5nLCBjb2RlOiB0ZXh0LmVxLCBtYXA6IHRleHQuU3RyaW5nVGFjayhzYXZlUGF0aCwgaHR0cFNvdXJjZSksIGRlcGVuZGVuY2llczogc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBzdmVsdGVGaWxlczogY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiB4WzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1swXSArIHggOiBwYXRoLm5vcm1hbGl6ZShmdWxsUGF0aCArICcvLi4vJyArIHgpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuIiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgXG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXFxgJHtKU1BhcnNlci5wcmludEVycm9yKGBTeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX1gKX1cXGBgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IGVyci5lcnJvcnNbMF07XG4gICAgICAgICAgICBmaXJzdC5sb2NhdGlvbiAmJiAoZmlyc3QubG9jYXRpb24ubGluZVRleHQgPSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZSh0ZXh0LmRlYnVnTGluZShmaXJzdCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCAgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tIFwiLi9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXJcIjtcblxuXG5leHBvcnQgdHlwZSBzZXREYXRhSFRNTFRhZyA9IHtcbiAgICB1cmw6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwXG59XG5cbmV4cG9ydCB0eXBlIGNvbm5lY3RvckluZm8gPSB7XG4gICAgdHlwZTogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBzZW5kVG86IHN0cmluZyxcbiAgICB2YWxpZGF0b3I6IHN0cmluZ1tdLFxuICAgIG9yZGVyPzogc3RyaW5nW10sXG4gICAgbm90VmFsaWQ/OiBzdHJpbmcsXG4gICAgbWVzc2FnZT86IHN0cmluZyB8IGJvb2xlYW4sXG4gICAgcmVzcG9uc2VTYWZlPzogYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JBcnJheSA9IGNvbm5lY3RvckluZm9bXVxuXG5leHBvcnQgdHlwZSBjYWNoZUNvbXBvbmVudCA9IHtcbiAgICBba2V5OiBzdHJpbmddOiBudWxsIHwge1xuICAgICAgICBtdGltZU1zPzogbnVtYmVyLFxuICAgICAgICB2YWx1ZT86IHN0cmluZ1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgaW5UYWdDYWNoZSA9IHtcbiAgICBzdHlsZTogc3RyaW5nW11cbiAgICBzY3JpcHQ6IHN0cmluZ1tdXG4gICAgc2NyaXB0TW9kdWxlOiBzdHJpbmdbXVxufVxuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTaG9ydFNjcmlwdE5hbWVzJyk7XG5cbi8qIFRoZSBTZXNzaW9uQnVpbGQgY2xhc3MgaXMgdXNlZCB0byBidWlsZCB0aGUgaGVhZCBvZiB0aGUgcGFnZSAqL1xuZXhwb3J0IGNsYXNzIFNlc3Npb25CdWlsZCB7XG4gICAgY29ubmVjdG9yQXJyYXk6IGNvbm5lY3RvckFycmF5ID0gW11cbiAgICBwcml2YXRlIHNjcmlwdFVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBzdHlsZVVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBpblNjcmlwdFN0eWxlOiB7IHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBTb3VyY2VNYXBTdG9yZSB9W10gPSBbXVxuICAgIGhlYWRIVE1MID0gJydcbiAgICBjYWNoZTogaW5UYWdDYWNoZSA9IHtcbiAgICAgICAgc3R5bGU6IFtdLFxuICAgICAgICBzY3JpcHQ6IFtdLFxuICAgICAgICBzY3JpcHRNb2R1bGU6IFtdXG4gICAgfVxuICAgIGNhY2hlQ29tcGlsZVNjcmlwdDogYW55ID0ge31cbiAgICBjYWNoZUNvbXBvbmVudDogY2FjaGVDb21wb25lbnQgPSB7fVxuICAgIGNvbXBpbGVSdW5UaW1lU3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9XG4gICAgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSB7fVxuICAgIHJlY29yZE5hbWVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICBnZXQgc2FmZURlYnVnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWJ1ZyAmJiB0aGlzLl9zYWZlRGVidWc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNtYWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgZnVsbFBhdGg6IHN0cmluZywgcHVibGljIHR5cGVOYW1lPzogc3RyaW5nLCBwdWJsaWMgZGVidWc/OiBib29sZWFuLCBwcml2YXRlIF9zYWZlRGVidWc/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMgPSB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc3R5bGUodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgc2NyaXB0KHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcmlwdFVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgcmVjb3JkKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVwZW5kZW5jZShzbWFsbFBhdGg6IHN0cmluZywgZnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aCkge1xuICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEZXAgPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0O1xuICAgICAgICBpZiAoaGF2ZURlcCkge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSA9IGhhdmVEZXBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGUodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHNtYWxsUGF0aCA9IHRoaXMuc21hbGxQYXRoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5pblNjcmlwdFN0eWxlLmZpbmQoeCA9PiB4LnR5cGUgPT0gdHlwZSAmJiB4LnBhdGggPT0gc21hbGxQYXRoKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0geyB0eXBlLCBwYXRoOiBzbWFsbFBhdGgsIHZhbHVlOiBuZXcgU291cmNlTWFwU3RvcmUoc21hbGxQYXRoLCB0aGlzLnNhZmVEZWJ1ZywgdHlwZSA9PSAnc3R5bGUnLCB0cnVlKSB9XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaChkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhLnZhbHVlXG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGVQYWdlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIGRhdGFUYWcucG9wU3RyaW5nKCdwYWdlJykgPyB0aGlzLnNtYWxsUGF0aCA6IGluZm8uZXh0cmFjdEluZm8oKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVOYW1lKHRleHQ6IHN0cmluZykge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU3RhdGljRmlsZXNJbmZvLnN0b3JlKTtcbiAgICAgICAgd2hpbGUgKGtleSA9PSBudWxsIHx8IHZhbHVlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSBCYXNlNjRJZCh0ZXh0LCA1ICsgbGVuZ3RoKS5zdWJzdHJpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZEhlYWRUYWdzKCkge1xuICAgICAgICBjb25zdCBwYWdlTG9nID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTG9nID0gcGFnZUxvZyAmJiBpLnBhdGggPT0gdGhpcy5zbWFsbFBhdGg7XG4gICAgICAgICAgICBjb25zdCBzYXZlTG9jYXRpb24gPSBpc0xvZyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV0sIGFkZFF1ZXJ5ID0gaXNMb2cgPyAnP3Q9bCcgOiAnJztcbiAgICAgICAgICAgIGxldCB1cmwgPSBTdGF0aWNGaWxlc0luZm8uaGF2ZShpLnBhdGgsICgpID0+IFNlc3Npb25CdWlsZC5jcmVhdGVOYW1lKGkucGF0aCkpICsgJy5wdWInO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgZGVmZXI6IG51bGwgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcubWpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgdHlwZTogJ21vZHVsZScgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5jc3MnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlKCcvJyArIHVybCArIGFkZFF1ZXJ5KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShzYXZlTG9jYXRpb24gKyB1cmwsIGF3YWl0IGkudmFsdWUuY3JlYXRlRGF0YVdpdGhNYXAoKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkSGVhZCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRIZWFkVGFncygpO1xuXG4gICAgICAgIGNvbnN0IG1ha2VBdHRyaWJ1dGVzID0gKGk6IHNldERhdGFIVE1MVGFnKSA9PiBpLmF0dHJpYnV0ZXMgPyAnICcgKyBPYmplY3Qua2V5cyhpLmF0dHJpYnV0ZXMpLm1hcCh4ID0+IGkuYXR0cmlidXRlc1t4XSA/IHggKyBgPVwiJHtpLmF0dHJpYnV0ZXNbeF19XCJgIDogeCkuam9pbignICcpIDogJyc7XG5cbiAgICAgICAgbGV0IGJ1aWxkQnVuZGxlU3RyaW5nID0gJyc7IC8vIGFkZCBzY3JpcHRzIGFkZCBjc3NcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc3R5bGVVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0vPmA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNjcmlwdFVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8c2NyaXB0IHNyYz1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfT48L3NjcmlwdD5gO1xuXG4gICAgICAgIHJldHVybiBidWlsZEJ1bmRsZVN0cmluZyArIHRoaXMuaGVhZEhUTUw7XG4gICAgfVxuXG4gICAgZXh0ZW5kcyhmcm9tOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3JBcnJheS5wdXNoKC4uLmZyb20uY29ubmVjdG9yQXJyYXkpO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKC4uLmZyb20uc2NyaXB0VVJMU2V0KTtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKC4uLmZyb20uc3R5bGVVUkxTZXQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBmcm9tLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKHsgLi4uaSwgdmFsdWU6IGkudmFsdWUuY2xvbmUoKSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29weU9iamVjdHMgPSBbJ2NhY2hlQ29tcGlsZVNjcmlwdCcsICdjYWNoZUNvbXBvbmVudCcsICdkZXBlbmRlbmNpZXMnXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29weU9iamVjdHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpc1tjXSwgZnJvbVtjXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2goLi4uZnJvbS5yZWNvcmROYW1lcy5maWx0ZXIoeCA9PiAhdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyh4KSkpO1xuXG4gICAgICAgIHRoaXMuaGVhZEhUTUwgKz0gZnJvbS5oZWFkSFRNTDtcbiAgICAgICAgdGhpcy5jYWNoZS5zdHlsZS5wdXNoKC4uLmZyb20uY2FjaGUuc3R5bGUpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdC5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0KTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHRNb2R1bGUucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdE1vZHVsZSk7XG4gICAgfVxuXG4gICAgLy9iYXNpYyBtZXRob2RzXG4gICAgQnVpbGRTY3JpcHRXaXRoUHJhbXMoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gQnVpbGRTY3JpcHQoY29kZSwgaXNUcygpLCB0aGlzKTtcbiAgICB9XG59IiwgIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCBjbGVhck1vZHVsZSBmcm9tICdjbGVhci1tb2R1bGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCksIHJlc29sdmUgPSAocGF0aDogc3RyaW5nKSA9PiByZXF1aXJlLnJlc29sdmUocGF0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGZpbGVQYXRoKTtcbiAgICBjbGVhck1vZHVsZShmaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufVxuXG5leHBvcnQge1xuICAgIGNsZWFyTW9kdWxlLFxuICAgIHJlc29sdmVcbn0iLCAiaW1wb3J0IHsgV2FybmluZyB9IGZyb20gXCJzdmVsdGUvdHlwZXMvY29tcGlsZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5cbmNsYXNzIHJlTG9jYXRpb24ge1xuICAgIG1hcDogUHJvbWlzZTxTb3VyY2VNYXBDb25zdW1lcj5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRMb2NhdGlvbihsb2NhdGlvbjoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KXtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSAoYXdhaXQgdGhpcy5tYXApLm9yaWdpbmFsUG9zaXRpb25Gb3IobG9jYXRpb24pXG4gICAgICAgIHJldHVybiBgJHtsaW5lfToke2NvbHVtbn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlRXJyb3IoeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfTogV2FybmluZywgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcic7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICdAc2luZHJlc29yaHVzL3NsdWdpZnknO1xuaW1wb3J0IG1hcmtkb3duSXRBdHRycyBmcm9tICdtYXJrZG93bi1pdC1hdHRycyc7XG5pbXBvcnQgbWFya2Rvd25JdEFiYnIgZnJvbSAnbWFya2Rvd24taXQtYWJicidcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55LCBpY29uOiBzdHJpbmcpIHtcblxuICAgIGZ1bmN0aW9uIHJlbmRlckNvZGUob3JpZ1J1bGU6IGFueSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnUmVuZGVyZWQgPSBvcmlnUnVsZSguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNvZGUtY29weVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29weS1jbGlwYm9hcmRcIiBvbmNsaWNrPVwibWFya2Rvd25Db3B5KHRoaXMpXCI+JHtpY29ufTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke29yaWdSZW5kZXJlZH1cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2sgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2spO1xuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIFxuICAgIGNvbnN0IGhsanNDbGFzcyA9ZGF0YVRhZy5wb3BCb29sZWFuKCdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogZGF0YVRhZy5wb3BCb29sZWFuKCdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpLFxuICAgICAgICBicmVha3M6IGRhdGFUYWcucG9wQm9vbGVhbignYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSxcbiAgICAgICAgdHlwb2dyYXBoZXI6IGRhdGFUYWcucG9wQm9vbGVhbigndHlwb2dyYXBoZXInLCBtYXJrRG93blBsdWdpbj8udHlwb2dyYXBoZXIgPz8gdHJ1ZSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29weSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/ICdcdUQ4M0RcdURDQ0InKTtcbiAgICBpZiAoY29weSlcbiAgICAgICAgbWQudXNlKChtOmFueSk9PiBjb2RlV2l0aENvcHkobSwgY29weSkpO1xuXG4gICAgaWYgKGRhdGFUYWcucG9wQm9vbGVhbignaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhYmJyJywgbWFya0Rvd25QbHVnaW4/LmFiYnIgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QWJicik7XG5cbiAgICBsZXQgbWFya2Rvd25Db2RlID0gQmV0d2VlblRhZ0RhdGE/LmVxIHx8ICcnO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdmaWxlJywgJy4vbWFya2Rvd24nKTtcblxuICAgIGlmICghbWFya2Rvd25Db2RlPy50cmltPy4oKSAmJiBsb2NhdGlvbikge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBsb2NhdGlvblswXSA9PSAnLycgPyBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzJdLCBsb2NhdGlvbik6IHBhdGguam9pbihwYXRoLmRpcm5hbWUodHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JykpLCBsb2NhdGlvbik7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnBvcFN0cmluZygnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBpZih0aGVtZSAhPSAnbm9uZScpe1xuICAgICAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY29weSl7XG4gICAgICAgICAgICBzZXNzaW9uLnNjcmlwdCgnL3NlcnYvbWQuanMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCd0aGVtZScsICBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXY+YXtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAtN3B4OyAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8aGVhZCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2UtaW50ZWdlclwiOiBbXG4gICAgICAgIC9eWzAtOV0rLi5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZS1mbG9hdFwiOiBbXG4gICAgICAgIC9eWzAtOV0rXFwuWzAtOV0rLi5bMC05XStcXC5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLXN0cmluZ1wiOiBbXG4gICAgICAgIC9ec3RyaW5nfHRleHQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IGBcIiR7eC50cmltKCkucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKX1cImApLFxuICAgICAgICAob3B0aW9uczogc3RyaW5nW10sIHRleHQ6IHN0cmluZykgPT4gb3B0aW9ucy5pbmNsdWRlcyh0ZXh0KSxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2UtbnVtYmVyXCI6IFtcbiAgICAgICAgL15udW1iZXJ8bnVtfGludGVnZXJ8aW50K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKSxcbiAgICAgICAgKG9wdGlvbnM6IG51bWJlcltdLCBudW06IG51bWJlcikgPT4gb3B0aW9ucy5pbmNsdWRlcyhudW0pLFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXVxufTtcblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzID0gWy4uLm51bWJlcnNdO1xuXG5mb3IoY29uc3QgaSBpbiBidWlsdEluQ29ubmVjdGlvblJlZ2V4KXtcbiAgICBjb25zdCB0eXBlID0gYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtpXVszXTtcblxuICAgIGlmKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyh0eXBlKSlcbiAgICAgICAgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLnB1c2goaSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVWYWx1ZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIGlmIChidWlsdEluQ29ubmVjdGlvbi5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBgW1wiJHt2YWx1ZX1cIl1gO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgW3Rlc3QsIGdldEFyZ3NdXSBvZiBPYmplY3QuZW50cmllcyhidWlsdEluQ29ubmVjdGlvblJlZ2V4KSlcbiAgICAgICAgaWYgKCg8UmVnRXhwPnRlc3QpLnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIGBbXCIke25hbWV9XCIsICR7KDxhbnk+Z2V0QXJncykodmFsdWUpfV1gO1xuXG4gICAgcmV0dXJuIGBbJHt2YWx1ZX1dYDtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVZhbGlkYXRpb25KU09OKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBQcm9taXNlPGJvb2xlYW4gfCBzdHJpbmdbXT4ge1xuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50LCAuLi5lbGVtZW50QXJnc10gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuICAgICAgICBsZXQgcmV0dXJuTm93OiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdudW0nOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICBjYXNlICdpbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFlbWFpbFZhbGlkYXRvci50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXZlUmVnZXggPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdmFsdWUgPT0gbnVsbCB8fCAhaGF2ZVJlZ2V4WzJdKGVsZW1lbnRBcmdzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICghZWxlbWVudC50ZXN0KHZhbHVlKSkgJiYgJ3JlZ2V4IC0gJyArIHZhbHVlO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICghYXdhaXQgZWxlbWVudCh2YWx1ZSkpICYmICdmdW5jdGlvbiAtICcgKyAoZWxlbWVudC5uYW1lIHx8ICdhbm9ueW1vdXMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYFZhbGlkYXRpb24gZmFpbGVkIGF0IGZpbGVkICR7TnVtYmVyKGkpKzF9IC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn0iLCAiaW1wb3J0IHsgY29ubmVjdG9ySW5mbywgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQ2FwaXRhbGl6ZSB9IGZyb20gXCIuLi8uLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uKGNvbm5lY3ROYW1lOiBzdHJpbmcsIGNvbm5lY3RvckNhbGw6IHN0cmluZywgY29ubmVjdGlvblR5cGU6IHN0cmluZywgcGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGJ1aWxkQXJndW1lbnRzOiAoaW5mbzogY29ubmVjdG9ySW5mbykgPT4gc3RyaW5nLCB7cmV0dXJuRGF0YX06IHtyZXR1cm5EYXRhPzogYm9vbGVhbn0gPSB7fSkge1xuICAgIGlmICghc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkuZmluZCh4ID0+IHgudHlwZSA9PSBjb25uZWN0aW9uVHlwZSkpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9IGNvbm5lY3Rpb25UeXBlKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc2VuZFRvVW5pY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGkubmFtZSkudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQCR7Y29ubmVjdE5hbWV9XFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKSwgY29ubmVjdERlZmF1bHQgPSBuZXcgUmVnRXhwKGBAXFxcXD8ke2Nvbm5lY3ROYW1lfVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXClgKTtcblxuICAgICAgICBsZXQgaGFkUmVwbGFjZW1lbnQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBzY3JpcHREYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgaGFkUmVwbGFjZW1lbnQgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYGlmKFBvc3Q/LiR7Y29ubmVjdG9yQ2FsbH0gPT0gXCIke2kubmFtZX1cIil7XG4gICAgICAgICAgICAgICAgJHtyZXR1cm5EYXRhID8gJ3JldHVybiAnOiAnJ31hd2FpdCBoYW5kZWxDb25uZWN0b3IoXCIke2Nvbm5lY3Rpb25UeXBlfVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgJHtidWlsZEFyZ3VtZW50cyhpKX1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfWApXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoaGFkUmVwbGFjZW1lbnQpXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoY29ubmVjdERlZmF1bHQsICcnKTsgLy8gZGVsZXRpbmcgZGVmYXVsdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3REZWZhdWx0LCBzY3JpcHREYXRhKTtcblxuICAgIH1cblxuICAgIHJldHVybiBwYWdlRGF0YTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgY29ubmVjdG9ySW5mbywgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9jb25uZWN0LW5vZGUnO1xuXG5jb25zdCBzZXJ2ZVNjcmlwdCA9ICcvc2Vydi9jb25uZWN0LmpzJztcblxuZnVuY3Rpb24gdGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAke25hbWV9KC4uLmFyZ3Mpe3JldHVybiBjb25uZWN0b3IoXCIke25hbWV9XCIsIGFyZ3MpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgeyBTb21lUGx1Z2lucyB9LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25hbWUnKSxcbiAgICAgICAgc2VuZFRvID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VuZFRvJyksXG4gICAgICAgIHZhbGlkYXRvciA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksXG4gICAgICAgIG5vdFZhbGlkID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbm90VmFsaWQnKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ21lc3NhZ2UnLCBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcblxuICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwgeyBhc3luYzogbnVsbCB9KVxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dCh0ZW1wbGF0ZShuYW1lKSk7IC8vIGFkZCBzY3JpcHRcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiAnY29ubmVjdCcsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBCZXR3ZWVuVGFnRGF0YSB8fCBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgY29tcGlsZWRTdHJpbmcuQWRkVGV4dEJlZm9yZU5vVHJhY2soYDwlIUBAP0Nvbm5lY3RIZXJlKCR7bmFtZX0pJT5gKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oJ0Nvbm5lY3RIZXJlJywgJ2Nvbm5lY3RvckNhbGw/Lm5hbWUnLCAnY29ubmVjdCcsIHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgaSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6XCIke2kubmFtZX1cIixcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6JHt0eXBlb2YgaS5tZXNzYWdlID09ICdzdHJpbmcnID8gYFwiJHtpLm1lc3NhZ2V9XCJgIDogaS5tZXNzYWdlfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHsoaS52YWxpZGF0b3IgJiYgaS52YWxpZGF0b3IubWFwKGNvbXBpbGVWYWx1ZXMpLmpvaW4oJywnKSkgfHwgJyd9XVxuICAgICAgICB9YFxuICAgIH0sIHtyZXR1cm5EYXRhOiB0cnVlfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3I6IGFueSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC52YWx1ZXM7XG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbm5lY3Rvci52YWxpZGF0b3IubGVuZ3RoICYmIGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3Rvci52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbm5lY3Rvci52YWxpZGF0b3IubGVuZ3RoIHx8IGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgY29ubmVjdG9yLnNlbmRUbyguLi52YWx1ZXMpKTtcblxuICAgIGVsc2UgaWYgKGNvbm5lY3Rvci5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBjb25uZWN0b3Iubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKSk7XG5cbiAgICBlbHNlIGlmIChjb25uZWN0b3IubWVzc2FnZSlcbiAgICAgICAgYmV0dGVySlNPTih7XG4gICAgICAgICAgICBlcnJvcjogdHlwZW9mIGNvbm5lY3Rvci5tZXNzYWdlID09ICdzdHJpbmcnID8gY29ubmVjdG9yLm1lc3NhZ2UgOiAoPGFueT5pc1ZhbGlkKS5zaGlmdCgpXG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc3RhdHVzKDQwMCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVZhbHVlcyB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgeyBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IHNlbmRUbyA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnc2VuZFRvJywgJycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgICAgICB9PC9mb3JtPmAsXG4gICAgICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgICAgIH1cblxuXG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbmFtZScsIHV1aWQoKSkudHJpbSgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb3JkZXInKSwgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcucG9wQm9vbGVhbignc2FmZScpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBsZXQgb3JkZXIgPSBbXTtcblxuICAgIGNvbnN0IHZhbGlkYXRvckFycmF5ID0gdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHsgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYW4gb3JkZXIgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIFwicHJvcDE6IHN0cmluZywgcHJvcDM6IG51bSwgcHJvcDI6IGJvb2xcIlxuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0Rmlyc3QoJzonLCB4LnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBvcmRlci5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuXG4gICAgICAgIHJldHVybiBzcGxpdC5wb3AoKTtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlckRlZmF1bHQpXG4gICAgICAgIG9yZGVyID0gb3JkZXJEZWZhdWx0LnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yQXJyYXksXG4gICAgICAgIG9yZGVyOiBvcmRlci5sZW5ndGggJiYgb3JkZXIsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZXNwb25zZVNhZmVcbiAgICB9KTtcblxuICAgIGRhdGFUYWcucHVzaFZhbHVlKCdtZXRob2QnLCAncG9zdCcpO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtuYW1lfSlcbiU+PGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbm5lY3RvckZvcm1DYWxsXCIgdmFsdWU9XCIke25hbWV9XCIvPiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uKCdDb25uZWN0SGVyZUZvcm0nLCAnY29ubmVjdG9yRm9ybUNhbGwnLCAnZm9ybScsIHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgaSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgb3JkZXI6IFske2kub3JkZXI/Lm1hcD8uKGl0ZW0gPT4gYFwiJHtpdGVtfVwiYCk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICB9YFxuICAgIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9ySW5mbzogYW55KSB7XG5cbiAgICBkZWxldGUgdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JGb3JtQ2FsbDtcblxuICAgIGxldCB2YWx1ZXMgPSBbXTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLm9yZGVyLmxlbmd0aCkgLy8gcHVzaCB2YWx1ZXMgYnkgc3BlY2lmaWMgb3JkZXJcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNvbm5lY3RvckluZm8ub3JkZXIpXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzUGFnZS5Qb3N0W2ldKTtcbiAgICBlbHNlXG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLk9iamVjdC52YWx1ZXModGhpc1BhZ2UuUG9zdCkpO1xuXG5cbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiB8IHN0cmluZ1tdID0gdHJ1ZTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLnZhbGlkYXRvci5sZW5ndGgpIHsgLy8gdmFsaWRhdGUgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHBhcnNlVmFsdWVzKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgICAgICBpc1ZhbGlkID0gYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgIH1cblxuICAgIGxldCByZXNwb25zZTogYW55O1xuXG4gICAgaWYgKGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5zZW5kVG8oLi4udmFsdWVzKTtcbiAgICBlbHNlIGlmIChjb25uZWN0b3JJbmZvLm5vdFZhbGlkKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8ubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKTtcblxuICAgIGlmIChpc1ZhbGlkICYmICFyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8ubWVzc2FnZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShpc1ZhbGlkWzBdKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzcG9uc2UgPSBjb25uZWN0b3JJbmZvLm1lc3NhZ2U7XG5cbiAgICBpZiAocmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLnNhZmUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUocmVzcG9uc2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZShyZXNwb25zZSk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHJlY29yZFN0b3JlID0gbmV3IFN0b3JlSlNPTignUmVjb3JkcycpO1xuXG5mdW5jdGlvbiByZWNvcmRMaW5rKGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdsaW5rJywgc21hbGxQYXRoVG9QYWdlKHNlc3Npb25JbmZvLnNtYWxsUGF0aCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVJlY29yZFBhdGgoZGVmYXVsdE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGxpbmsgPSByZWNvcmRMaW5rKGRhdGFUYWcsIHNlc3Npb25JbmZvKSwgc2F2ZU5hbWUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ25hbWUnLCBkZWZhdWx0TmFtZSk7XG5cbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0gPz89IHt9O1xuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSA/Pz0gJyc7XG4gICAgc2Vzc2lvbkluZm8ucmVjb3JkKHNhdmVOYW1lKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0b3JlOiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0sXG4gICAgICAgIGN1cnJlbnQ6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSxcbiAgICAgICAgbGlua1xuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc2Vzc2lvbkluZm8uc21hbGxQYXRoLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSAvLyBkbyBub3QgYWxsb3cgdGhpcyBmb3IgY29tcGlsaW5nIGNvbXBvbmVudCBhbG9uZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgICAgIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBodG1sID0gaHRtbC50cmltKCk7XG5cbiAgICBjb25zdCB7IHN0b3JlLCBsaW5rIH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9yZWNvcmQuc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc3RvcmVbbGlua10uaW5jbHVkZXMoaHRtbCkpIHtcbiAgICAgICAgc3RvcmVbbGlua10gKz0gaHRtbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVCZWZvcmVSZUJ1aWxkKHNtYWxsUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbmFtZSA9IHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGgpO1xuICAgIGZvciAoY29uc3Qgc2F2ZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBpdGVtID0gcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZV07XG5cbiAgICAgICAgaWYgKGl0ZW1bbmFtZV0pIHtcbiAgICAgICAgICAgIGl0ZW1bbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkZWxldGUgaXRlbVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uLmRlYnVnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgb2Ygc2Vzc2lvbi5yZWNvcmROYW1lcykge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyQ29tcGlsZSgpIHtcbiAgICByZWNvcmRTdG9yZS5jbGVhcigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHJlY29yZFN0b3JlLnN0b3JlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ01hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdub2RlLWh0bWwtcGFyc2VyJztcbmltcG9ydCB7IG1ha2VSZWNvcmRQYXRoIH0gZnJvbSAnLi9yZWNvcmQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc2Vzc2lvbkluZm8uc21hbGxQYXRoLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSAvLyBkbyBub3QgYWxsb3cgdGhpcyBmb3IgY29tcGlsaW5nIGNvbXBvbmVudCBhbG9uZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgICAgIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IHN0b3JlLCBsaW5rLCBjdXJyZW50IH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9zZWFyY2guc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBzZWFyY2hPYmplY3QgPSBidWlsZE9iamVjdChodG1sLCBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ21hdGNoJywgJ2gxW2lkXSwgaDJbaWRdLCBoM1tpZF0sIGg0W2lkXSwgaDVbaWRdLCBoNltpZF0nKSk7XG5cbiAgICBpZiAoIWN1cnJlbnQpIHtcbiAgICAgICAgc3RvcmVbbGlua10gPSBzZWFyY2hPYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihjdXJyZW50LnRpdGxlcywgc2VhcmNoT2JqZWN0LnRpdGxlcyk7XG5cbiAgICAgICAgaWYgKCFjdXJyZW50LnRleHQuaW5jbHVkZXMoc2VhcmNoT2JqZWN0LnRleHQpKSB7XG4gICAgICAgICAgICBjdXJyZW50LnRleHQgKz0gc2VhcmNoT2JqZWN0LnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0KGh0bWw6IHN0cmluZywgbWF0Y2g6IHN0cmluZykge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJzZShodG1sLCB7XG4gICAgICAgIGJsb2NrVGV4dEVsZW1lbnRzOiB7XG4gICAgICAgICAgICBzY3JpcHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3R5bGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9zY3JpcHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRpdGxlczogU3RyaW5nTWFwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKSkge1xuICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQuYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgdGl0bGVzW2lkXSA9IGVsZW1lbnQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZXMsXG4gICAgICAgIHRleHQ6IHJvb3QuaW5uZXJUZXh0LnRyaW0oKS5yZXBsYWNlKC9bIFxcbl17Mix9L2csICcgJykucmVwbGFjZSgvW1xcbl0vZywgJyAnKVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9Db21wb25lbnRzL2NsaWVudCc7XG5pbXBvcnQgc2NyaXB0IGZyb20gJy4vQ29tcG9uZW50cy9zY3JpcHQvaW5kZXgnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vQ29tcG9uZW50cy9zdHlsZS9pbmRleCc7XG5pbXBvcnQgcGFnZSBmcm9tICcuL0NvbXBvbmVudHMvcGFnZSc7XG5pbXBvcnQgaXNvbGF0ZSBmcm9tICcuL0NvbXBvbmVudHMvaXNvbGF0ZSc7XG5pbXBvcnQgc3ZlbHRlIGZyb20gJy4vQ29tcG9uZW50cy9zdmVsdGUnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJy4vQ29tcG9uZW50cy9tYXJrZG93bic7XG5pbXBvcnQgaGVhZCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRIZWFkIH0gZnJvbSAnLi9Db21wb25lbnRzL2hlYWQnO1xuaW1wb3J0IGNvbm5lY3QsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdCwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckNvbm5lY3QgfSBmcm9tICcuL0NvbXBvbmVudHMvY29ubmVjdCc7XG5pbXBvcnQgZm9ybSwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRGb3JtLCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yRm9ybSB9IGZyb20gJy4vQ29tcG9uZW50cy9mb3JtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHJlY29yZCwgeyB1cGRhdGVSZWNvcmRzLCBwZXJDb21waWxlIGFzIHBlckNvbXBpbGVSZWNvcmQsIHBvc3RDb21waWxlIGFzIHBvc3RDb21waWxlUmVjb3JkLCBkZWxldGVCZWZvcmVSZUJ1aWxkIH0gZnJvbSAnLi9Db21wb25lbnRzL3JlY29yZCc7XG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vQ29tcG9uZW50cy9zZWFyY2gnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGNvbnN0IEFsbEJ1aWxkSW4gPSBbXCJjbGllbnRcIiwgXCJzY3JpcHRcIiwgXCJzdHlsZVwiLCBcInBhZ2VcIiwgXCJjb25uZWN0XCIsIFwiaXNvbGF0ZVwiLCBcImZvcm1cIiwgXCJoZWFkXCIsIFwic3ZlbHRlXCIsIFwibWFya2Rvd25cIiwgXCJyZWNvcmRcIiwgXCJzZWFyY2hcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGFydENvbXBpbGluZyhwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBsZXQgcmVEYXRhOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+O1xuXG4gICAgc3dpdGNoICh0eXBlLmVxLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSBcImNsaWVudFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY2xpZW50KHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJlY29yZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcmVjb3JkKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNlYXJjaCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBzY3JpcHQoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3R5bGUoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwYWdlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBwYWdlKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNvbm5lY3QodHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtXCI6XG4gICAgICAgICAgICByZURhdGEgPSBmb3JtKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImlzb2xhdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGlzb2xhdGUoQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJoZWFkXCI6XG4gICAgICAgICAgICByZURhdGEgPSBoZWFkKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN2ZWx0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3ZlbHRlKHR5cGUsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWFya2Rvd25cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IG1hcmtkb3duKHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBvbmVudCBpcyBub3QgYnVpbGQgeWV0XCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0luY2x1ZGUodGFnbmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEFsbEJ1aWxkSW4uaW5jbHVkZXModGFnbmFtZS50b0xvd2VyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdXBkYXRlUmVjb3JkcyhzZXNzaW9uSW5mbyk7XG5cbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRDb25uZWN0KHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkRm9ybShwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSgvQENvbm5lY3RIZXJlKDs/KS9naSwgJycpLnJlcGxhY2UoL0BDb25uZWN0SGVyZUZvcm0oOz8pL2dpLCAnJyk7XG5cbiAgICBwYWdlRGF0YSA9IGF3YWl0IGFkZEZpbmFsaXplQnVpbGRIZWFkKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgZnVsbENvbXBpbGVQYXRoKTtcbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKHR5cGU6IHN0cmluZywgdGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yOiBhbnkpIHtcbiAgICBpZiAodHlwZSA9PSAnY29ubmVjdCcpXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JDb25uZWN0KHRoaXNQYWdlLCBjb25uZWN0b3IpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckZvcm0odGhpc1BhZ2UsIGNvbm5lY3Rvcik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgXG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBQYXJzZURlYnVnSW5mbywgQ3JlYXRlRmlsZVBhdGgsIFBhdGhUeXBlcywgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQWxsQnVpbGRJbiwgSXNJbmNsdWRlLCBTdGFydENvbXBpbGluZyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgQXJyYXlNYXRjaCB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQge0NvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciwgcG9vbCB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc2VydENvbXBvbmVudCBleHRlbmRzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIHB1YmxpYyBkaXJGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbjtcbiAgICBwdWJsaWMgQ29tcGlsZUluRmlsZTogQ29tcGlsZUluRmlsZUZ1bmM7XG4gICAgcHVibGljIE1pY3JvUGx1Z2luczogU3RyaW5nQXJyYXlPck9iamVjdDtcbiAgICBwdWJsaWMgR2V0UGx1Z2luOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XG4gICAgcHVibGljIFNvbWVQbHVnaW5zOiAoLi4ubmFtZXM6IHN0cmluZ1tdKSA9PiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1RzOiAoKSA9PiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZWdleFNlYXJjaDogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IoUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSAmJiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gZGF0YVRhZ1NwbGljZWQucmVidWlsZFNwYWNlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBjb21wb25lbnQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9ID0gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKGNvbXBvbmVudCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7a2V5LHZhbHVlfSBvZiB0YWdEYXRhLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBrZXksIFwiZ2lcIik7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UocmUsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhOiBUYWdEYXRhUGFyc2VyLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBpbXBvcnRTb3VyY2UgPSAnLycgKyB0eXBlLmV4dHJhY3RJbmZvKCk7XG5cbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZScsIGltcG9ydFNvdXJjZSlcbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZURpcmVjdG9yeScsIHBhdGguZGlybmFtZShpbXBvcnRTb3VyY2UpKVxuXG4gICAgICAgIGNvbnN0ICBtYXBBdHRyaWJ1dGVzID0gZGF0YS5tYXAoKTtcbiAgICAgICAgbWFwQXR0cmlidXRlcy5yZWFkZXIgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG5cbiAgICAgICAgcmV0dXJuIG1hcEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlciB9KSB7XG4gICAgICAgIGNvbnN0IGRhdGFQYXJzZXIgPSBuZXcgVGFnRGF0YVBhcnNlcihkYXRhVGFnKSwgQnVpbGRJbiA9IElzSW5jbHVkZSh0eXBlLmVxKTtcbiAgICAgICAgYXdhaXQgZGF0YVBhcnNlci5wYXJzZXIoKTtcblxuICAgICAgICBsZXQgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaEluQ29tbWVudCA9IHRydWUsIEFsbFBhdGhUeXBlczogUGF0aFR5cGVzID0ge30sIGFkZFN0cmluZ0luZm86IHN0cmluZztcblxuICAgICAgICBpZiAoQnVpbGRJbikgey8vY2hlY2sgaWYgaXQgYnVpbGQgaW4gY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCB7IGNvbXBpbGVkU3RyaW5nLCBjaGVja0NvbXBvbmVudHMgfSA9IGF3YWl0IFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lLCB0eXBlLCBkYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGFQYXJzZXIucG9wSGF2ZURlZmF1bHQoJ2ZvbGRlcicsICcuJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGFsbERhdGEsIHRoaXMuaXNUcygpKTtcblxuICAgICAgICAgICAgLyphZGQgc3BlY2lhbCBhdHRyaWJ1dGVzICovXG4gICAgICAgICAgICBjb25zdCBtYXBBdHRyaWJ1dGVzID0gSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGFQYXJzZXIsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCB7YXR0cmlidXRlczogbWFwQXR0cmlidXRlc30pO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhUGFyc2VyLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke3RhZ1R5cGV9XCIsIHVzZWQgaW46ICR7dGFnVHlwZS5hdCgwKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBwb29sIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ3MgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBDUnVuVGltZSBmcm9tIFwiLi9Db21waWxlXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5cbmNvbnN0IGlnbm9yZUluaGVyaXQgPSBbJ2NvZGVmaWxlJ107XG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7IGRlZmluZToge30gfTtcblxuYXN5bmMgZnVuY3Rpb24gUGFnZUJhc2VQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICBjaGFyOiBzdHJpbmdcbiAgICB9W11cbn0+IHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IHBvb2wuZXhlYygnUGFnZUJhc2VQYXJzZXInLCBbdGV4dF0pO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBhcnNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsIGNoYXI/OiBzdHJpbmcgfVtdID0gW11cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIG5vbkR5bmFtaWMoaXNEeW5hbWljOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghaXNEeW5hbWljKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZUR5bmFtaWMgPSB0aGlzLnBvcEFueSgnZHluYW1pYycpO1xuICAgICAgICBpZiAoaGF2ZUR5bmFtaWMgIT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgICAgICBwYXJzZS5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgICAgIHBhcnNlLnZhbHVlQXJyYXkgPSBbLi4udGhpcy52YWx1ZUFycmF5LCB7IGtleTogJ2R5bmFtaWMnLCB2YWx1ZTogdHJ1ZSB9XTtcblxuICAgICAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHBhcnNlLmNsZWFyRGF0YS5lcSk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnZHluYW1pYy1zc3ItaW1wb3J0JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQWRkaW5nIFxcJ2R5bmFtaWNcXCcgYXR0cmlidXRlIHRvIGZpbGUgJyArIHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgeyBhdHRyaWJ1dGVzLCBkeW5hbWljQ2hlY2t9OiB7IGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXAsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCB0aGlzLnNlc3Npb25JbmZvLCBzbWFsbFBhdGgsIHRoaXMuaXNUcyk7XG4gICAgICAgIHRoaXMuY29kZSA9IGF3YWl0IHJ1bi5jb21waWxlKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGFyc2VCYXNlKHRoaXMuY29kZSk7XG4gICAgICAgIGlmKHRoaXMubm9uRHluYW1pYyhkeW5hbWljQ2hlY2spKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkQ29kZUZpbGUocGFnZVBhdGgsIHNtYWxsUGF0aCwgdGhpcy5pc1RzLCBwYWdlTmFtZSk7XG5cbiAgICAgICAgdGhpcy5sb2FkRGVmaW5lKHsgLi4uc2V0dGluZ3MuZGVmaW5lLCAuLi5ydW4uZGVmaW5lIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gYXdhaXQgUGFnZUJhc2VQYXJzZXIoY29kZS5lcSk7XG5cbiAgICAgICAgaWYocGFyc2VyLnN0YXJ0ID09IHBhcnNlci5lbmQpe1xuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBjb2RlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGNvbnN0IHtjaGFyLGVuZCxrZXksc3RhcnR9IG9mIHBhcnNlci52YWx1ZXMpe1xuICAgICAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goe2tleSwgdmFsdWU6IHN0YXJ0ID09PSBlbmQgPyB0cnVlOiBjb2RlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgY2hhcn0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUuc3Vic3RyaW5nKDAsIHBhcnNlci5zdGFydCkuUGx1cyhjb2RlLnN1YnN0cmluZyhwYXJzZXIuZW5kKSkudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZiAoIXRoaXMudmFsdWVBcnJheS5sZW5ndGgpIHJldHVybiB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnQFsnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSwgY2hhciB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9PSR7Y2hhcn0ke3ZhbHVlfSR7Y2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9IGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkLnN1YnN0cmluZygwLCBidWlsZC5sZW5ndGgtMSkuUGx1cygnXVxcbicpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGF3YWl0IHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBpZihpZ25vcmVJbmhlcml0LmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcGFyc2UucG9wKG5hbWUpXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGA8QCR7bmFtZX0+PDoke25hbWV9Lz48L0Ake25hbWV9PmApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZS5yZWJ1aWxkKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlLmNsZWFyRGF0YS5QbHVzKGJ1aWxkKTtcbiAgICB9XG5cbiAgICBnZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3AobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleSA9PT0gbmFtZSksIDEpWzBdPy52YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BBbnkobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmVOYW1lID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LnRvTG93ZXJDYXNlKCkgPT0gbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhdmVOYW1lICE9IC0xKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaGF2ZU5hbWUsIDEpWzBdLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFzVGFnID0gZ2V0RGF0YVRhZ3ModGhpcy5jbGVhckRhdGEsIFtuYW1lXSwgJ0AnKTtcblxuICAgICAgICBpZiAoIWFzVGFnLmZvdW5kWzBdKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBhc1RhZy5kYXRhO1xuXG4gICAgICAgIHJldHVybiBhc1RhZy5mb3VuZFswXS5kYXRhLnRyaW0oKTtcbiAgICB9XG5cbiAgICBieVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maWx0ZXIoeCA9PiB4LnZhbHVlICE9PSB0cnVlICYmIHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBkZWZhdWx0VmFsdWVQb3BBbnk8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IFQpOiBzdHJpbmcgfCBUIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wb3BBbnkobmFtZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlPy5lcTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5kZWZhdWx0VmFsdWVQb3BBbnkoJ2NvZGVmaWxlJywgJ2luaGVyaXQnKTtcbiAgICAgICAgaWYgKCFoYXZlQ29kZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLmRlZmF1bHRWYWx1ZVBvcEFueSgnbGFuZycsICdqcycpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gaGF2ZUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYWdlUGF0aDtcblxuICAgICAgICBjb25zdCBoYXZlRXh0ID0gcGF0aC5leHRuYW1lKGhhdmVDb2RlKS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoaGF2ZUV4dCkpIHtcbiAgICAgICAgICAgIGlmICgvKFxcXFx8XFwvKSQvLnRlc3QoaGF2ZUNvZGUpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhZ2VQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGlmICghQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhoYXZlRXh0KSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYXRoLmV4dG5hbWUocGFnZVBhdGgpO1xuICAgICAgICAgICAgaGF2ZUNvZGUgKz0gJy4nICsgKGxhbmcgPyBsYW5nIDogaXNUcyA/ICd0cycgOiAnanMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQ29kZVswXSA9PSAnLicpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocGFnZVBhdGgpLCBoYXZlQ29kZSlcblxuICAgICAgICBjb25zdCBTbWFsbFBhdGggPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGhhdmVDb2RlKTtcblxuICAgICAgICBpZiAoYXdhaXQgdGhpcy5zZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgaGF2ZUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IGJhc2VNb2RlbERhdGEuYWxsRGF0YS5yZXBsYWNlQWxsKFwiQFwiLCBcIkBAXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soJzwlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEFmdGVyTm9UcmFjaygnJT4nKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcgJiYgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgfSBlbHNlIGlmKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnICYmIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcpe1xuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShoYXZlQ29kZSwgJycpO1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NyZWF0ZS1jb2RlLWZpbGUnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgY3JlYXRlZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlLWZpbGUtbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgSlNQYXJzZXIucHJpbnRFcnJvcihgQ29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nYCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgc3RyaW5nKVtdW10gPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcy51bnNoaWZ0KC4uLk9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpKVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IENvbnZlcnRTeW50YXhNaW5pIH0gZnJvbSBcIi4uLy4uL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4XCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSBcIi4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENSdW5UaW1lIHtcbiAgICBkZWZpbmUgPSB7fVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzY3JpcHQ6IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBpc1RzOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHRlbXBsYXRlU2NyaXB0KHNjcmlwdHM6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG5fX3dyaXRlID0ge3RleHQ6ICcnfTtfX3dyaXRlQXJyYXkudW5zaGlmdChfX3dyaXRlKTtgKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhpKVxuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxucmV0dXJuIF9fd3JpdGVBcnJheWApO1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXRob2RzKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgY29uc3QgX19sb2NhbHBhdGggPSAnLycgKyBzbWFsbFBhdGhUb1BhZ2UodGhpcy5zZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RyaW5nOiAnc2NyaXB0LHN0eWxlLGRlZmluZSxzdG9yZSxwYWdlX19maWxlbmFtZSxwYWdlX19kaXJuYW1lLF9fbG9jYWxwYXRoLGF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgZnVuY3M6IFtcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnNjcmlwdC5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc3R5bGUuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHRoaXMuZGVmaW5lW1N0cmluZyhrZXkpXSA9IHZhbHVlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY29tcGlsZVJ1blRpbWVTdG9yZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoLFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoKSxcbiAgICAgICAgICAgICAgICBfX2xvY2FscGF0aCxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzIHx8IHt9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGRDb2RlKHBhcnNlcjogSlNQYXJzZXIsIGJ1aWxkU3RyaW5nczogeyB0ZXh0OiBzdHJpbmcgfVtdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKGkudGV4dClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGJ1aWxkU3RyaW5ncy5wb3AoKS50ZXh0LCBpLnRleHQuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIGFzeW5jIGNvbXBpbGUoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgICAgICAvKiBsb2FkIGZyb20gY2FjaGUgKi9cbiAgICAgICAgY29uc3QgaGF2ZUNhY2hlID0gdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdO1xuICAgICAgICBpZiAoaGF2ZUNhY2hlKVxuICAgICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXZlQ2FjaGUpKHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKS5mdW5jcyk7XG4gICAgICAgIGxldCBkb0ZvckFsbDogKHJlc29sdmU6IChmdW5jczogYW55W10pID0+IFN0cmluZ1RyYWNrZXIgfCBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSA9PiB2b2lkO1xuICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IGRvRm9yQWxsID0gcik7XG5cbiAgICAgICAgLyogcnVuIHRoZSBzY3JpcHQgKi9cbiAgICAgICAgdGhpcy5zY3JpcHQgPSBhd2FpdCBDb252ZXJ0U3ludGF4TWluaSh0aGlzLnNjcmlwdCwgXCJAY29tcGlsZVwiLCBcIipcIik7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcih0aGlzLnNjcmlwdCwgdGhpcy5zbWFsbFBhdGgsICc8JSonLCAnJT4nKTtcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgaWYgKHBhcnNlci52YWx1ZXMubGVuZ3RoID09IDEgJiYgcGFyc2VyLnZhbHVlc1swXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiB0aGlzLnNjcmlwdDtcbiAgICAgICAgICAgIGRvRm9yQWxsKHJlc29sdmUpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFt0eXBlLCBmaWxlUGF0aF0gPSBTcGxpdEZpcnN0KCcvJywgdGhpcy5zbWFsbFBhdGgpLCB0eXBlQXJyYXkgPSBnZXRUeXBlc1t0eXBlXSA/PyBnZXRUeXBlcy5TdGF0aWMsXG4gICAgICAgICAgICBjb21waWxlUGF0aCA9IHR5cGVBcnJheVsxXSArIGZpbGVQYXRoICsgJy5jb21wLmpzJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChmaWxlUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVTY3JpcHQocGFyc2VyLnZhbHVlcy5maWx0ZXIoeCA9PiB4LnR5cGUgIT0gJ3RleHQnKS5tYXAoeCA9PiB4LnRleHQpKTtcbiAgICAgICAgY29uc3QgeyBmdW5jcywgc3RyaW5nIH0gPSB0aGlzLm1ldGhvZHMoYXR0cmlidXRlcylcblxuICAgICAgICBjb25zdCB0b0ltcG9ydCA9IGF3YWl0IGNvbXBpbGVJbXBvcnQoc3RyaW5nLCBjb21waWxlUGF0aCwgZmlsZVBhdGgsIHR5cGVBcnJheSwgdGhpcy5pc1RzLCB0aGlzLnNlc3Npb25JbmZvLmRlYnVnLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgY29uc3QgZXhlY3V0ZSA9IGFzeW5jIChmdW5jczogYW55W10pID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVidWlsZENvZGUocGFyc2VyLCBhd2FpdCB0b0ltcG9ydCguLi5mdW5jcykpO1xuICAgICAgICAgICAgfSBjYXRjaChlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBlcnIsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IGV4ZWN1dGU7IC8vIHNhdmUgdGhpcyB0byBjYWNoZVxuICAgICAgICBjb25zdCB0aGlzRmlyc3QgPSBhd2FpdCBleGVjdXRlKGZ1bmNzKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSBcImVzYnVpbGQtd2FzbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgaXNUcyB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBwYWdlRGVwcyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHNcIjtcbmltcG9ydCBDdXN0b21JbXBvcnQsIHsgaXNQYXRoQ3VzdG9tIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L2luZGV4XCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5ncywgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkXCI7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9BbGlhc1wiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgZm9ybWF0OiAnY2pzJyxcbiAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cycgOiAnanMnLFxuICAgIG1pbmlmeTogY29kZU1pbmlmeSxcbiAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/ICdleHRlcm5hbCcgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBzb3VyY2VmaWxlOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIGRlYnVnOiBcIlwiICsgaXNEZWJ1Z1xuICAgIH1cbiAgfTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7fSk7XG4gIFJlc3VsdCA9IHRlbXBsYXRlKFxuICAgIFJlc3VsdCxcbiAgICBpc0RlYnVnLFxuICAgIHBhdGguZGlybmFtZSh0ZW1wbGF0ZVBhdGgpLFxuICAgIHRlbXBsYXRlUGF0aCxcbiAgICBwYXJhbXNcbiAgKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHsgY29kZSwgd2FybmluZ3MsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKFJlc3VsdCwgT3B0aW9ucyk7XG4gICAgaWYgKG1lcmdlVHJhY2sgJiYgbWFwKSB7XG4gICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIobWVyZ2VUcmFjaywgd2FybmluZ3MpO1xuICAgICAgUmVzdWx0ID0gKGF3YWl0IGJhY2tUb09yaWdpbmFsKG1lcmdlVHJhY2ssIGNvZGUsIG1hcCkpLlN0cmluZ1dpdGhUYWNrKHNhdmVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3MsIGZpbGVQYXRoKTtcbiAgICAgIFJlc3VsdCA9IGNvZGU7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzYXZlUGF0aCkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShzYXZlUGF0aCwgUmVzdWx0KTtcbiAgfVxuICByZXR1cm4gUmVzdWx0O1xufVxuXG5mdW5jdGlvbiBDaGVja1RzKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEZpbGVQYXRoLmVuZHNXaXRoKFwiLnRzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSkge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKEluU3RhdGljUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICByZXR1cm4gYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgdHlwZUFycmF5WzBdICsgSW5TdGF0aWNQYXRoLFxuICAgIHR5cGVBcnJheVsxXSArIEluU3RhdGljUGF0aCArIFwiLmNqc1wiLFxuICAgIENoZWNrVHMoSW5TdGF0aWNQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkRXh0ZW5zaW9uKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlsZUV4dCA9IHBhdGguZXh0bmFtZShGaWxlUGF0aCk7XG5cbiAgaWYgKEJhc2ljU2V0dGluZ3MucGFydEV4dGVuc2lvbnMuaW5jbHVkZXMoZmlsZUV4dC5zdWJzdHJpbmcoMSkpKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgKGlzVHMoKSA/IFwidHNcIiA6IFwianNcIilcbiAgZWxzZSBpZiAoZmlsZUV4dCA9PSAnJylcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzW2lzVHMoKSA/IFwidHNcIiA6IFwianNcIl07XG5cbiAgcmV0dXJuIEZpbGVQYXRoO1xufVxuXG5jb25zdCBTYXZlZE1vZHVsZXMgPSB7fSwgUHJlcGFyZU1hcCA9IHt9O1xuXG4vKipcbiAqIExvYWRJbXBvcnQgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCB0byBhIGZpbGUsIGFuZCByZXR1cm5zIHRoZSBtb2R1bGUgdGhhdCBpcyBhdCB0aGF0IHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbXBvcnRGcm9tIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBjcmVhdGVkIHRoaXMgaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IEluU3RhdGljUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IFt1c2VEZXBzXSAtIFRoaXMgaXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gd2l0aG91dENhY2hlIC0gYW4gYXJyYXkgb2YgcGF0aHMgdGhhdCB3aWxsIG5vdCBiZSBjYWNoZWQuXG4gKiBAcmV0dXJucyBUaGUgbW9kdWxlIHRoYXQgd2FzIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBMb2FkSW1wb3J0KGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIHsgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGUgPSBbXSwgb25seVByZXBhcmUgfTogeyBpc0RlYnVnOiBib29sZWFuLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSwgb25seVByZXBhcmU/OiBib29sZWFuIH0pIHtcbiAgbGV0IFRpbWVDaGVjazogYW55O1xuICBjb25zdCBvcmlnaW5hbFBhdGggPSBwYXRoLm5vcm1hbGl6ZShJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG5cbiAgSW5TdGF0aWNQYXRoID0gQWRkRXh0ZW5zaW9uKEluU3RhdGljUGF0aCk7XG4gIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShJblN0YXRpY1BhdGgpLnN1YnN0cmluZygxKSwgdGhpc0N1c3RvbSA9IGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGgsIGV4dGVuc2lvbikgfHwgIVsnanMnLCAndHMnXS5pbmNsdWRlcyhleHRlbnNpb24pO1xuICBjb25zdCBTYXZlZE1vZHVsZXNQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoKSwgZmlsZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBJblN0YXRpY1BhdGgpO1xuXG4gIC8vd2FpdCBpZiB0aGlzIG1vZHVsZSBpcyBvbiBwcm9jZXNzLCBpZiBub3QgZGVjbGFyZSB0aGlzIGFzIG9uIHByb2Nlc3MgbW9kdWxlXG4gIGxldCBwcm9jZXNzRW5kOiAodj86IGFueSkgPT4gdm9pZDtcbiAgaWYoIW9ubHlQcmVwYXJlKXtcbiAgICBpZiAoIVNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSlcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gcHJvY2Vzc0VuZCA9IHIpO1xuICAgIGVsc2UgaWYgKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgICBhd2FpdCBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG4gIH1cblxuXG4gIC8vYnVpbGQgcGF0aHNcbiAgY29uc3QgcmVCdWlsZCA9ICFwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSB8fCBwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSAhPSAoVGltZUNoZWNrID0gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKSk7XG5cblxuICBpZiAocmVCdWlsZCkge1xuICAgIFRpbWVDaGVjayA9IFRpbWVDaGVjayA/PyBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpO1xuICAgIGlmIChUaW1lQ2hlY2sgPT0gbnVsbCkge1xuICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgdGV4dDogYEltcG9ydCAnJHtJblN0YXRpY1BhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtpbXBvcnRGcm9tfSdgXG4gICAgICB9KTtcbiAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbnVsbFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpc0N1c3RvbSkgLy8gb25seSBpZiBub3QgY3VzdG9tIGJ1aWxkXG4gICAgICBhd2FpdCBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gICAgcGFnZURlcHMudXBkYXRlKFNhdmVkTW9kdWxlc1BhdGgsIFRpbWVDaGVjayk7XG4gIH1cblxuICBpZiAodXNlRGVwcykge1xuICAgIHVzZURlcHNbSW5TdGF0aWNQYXRoXSA9IHsgdGhpc0ZpbGU6IFRpbWVDaGVjayB9O1xuICAgIHVzZURlcHMgPSB1c2VEZXBzW0luU3RhdGljUGF0aF07XG4gIH1cblxuICBjb25zdCBpbmhlcml0YW5jZUNhY2hlID0gd2l0aG91dENhY2hlWzBdID09IEluU3RhdGljUGF0aDtcbiAgaWYgKGluaGVyaXRhbmNlQ2FjaGUpXG4gICAgd2l0aG91dENhY2hlLnNoaWZ0KClcbiAgZWxzZSBpZiAoIXJlQnVpbGQgJiYgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdICYmICEoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgcmV0dXJuIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoSW5TdGF0aWNQYXRoKSwgcCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoZmlsZVBhdGgsIHAsIHR5cGVBcnJheSwgeyBpc0RlYnVnLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGU6IGluaGVyaXRhbmNlQ2FjaGUgPyB3aXRob3V0Q2FjaGUgOiBbXSB9KTtcbiAgfVxuXG4gIGxldCBNeU1vZHVsZTogYW55O1xuICBpZiAodGhpc0N1c3RvbSkge1xuICAgIE15TW9kdWxlID0gYXdhaXQgQ3VzdG9tSW1wb3J0KG9yaWdpbmFsUGF0aCwgZmlsZVBhdGgsIGV4dGVuc2lvbiwgcmVxdWlyZU1hcCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVxdWlyZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBJblN0YXRpY1BhdGggKyBcIi5janNcIik7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUocmVxdWlyZVBhdGgpO1xuXG4gICAgaWYgKG9ubHlQcmVwYXJlKSB7IC8vIG9ubHkgcHJlcGFyZSB0aGUgbW9kdWxlIHdpdGhvdXQgYWN0aXZlbHkgaW1wb3J0aW5nIGl0XG4gICAgICBQcmVwYXJlTWFwW1NhdmVkTW9kdWxlc1BhdGhdID0gKCkgPT4gTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTXlNb2R1bGUgPSBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwKTtcbiAgfVxuXG4gIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IE15TW9kdWxlO1xuICBwcm9jZXNzRW5kPy4oKTtcblxuICByZXR1cm4gTXlNb2R1bGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbXBvcnRGaWxlKGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10pIHtcbiAgaWYgKCFpc0RlYnVnKSB7XG4gICAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCBoYXZlSW1wb3J0ID0gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gICAgaWYgKGhhdmVJbXBvcnQgIT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGhhdmVJbXBvcnQ7XG4gICAgZWxzZSBpZiAoUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSkge1xuICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSgpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbW9kdWxlO1xuICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTG9hZEltcG9ydChpbXBvcnRGcm9tLCBJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwge2lzRGVidWcsIHVzZURlcHMsIHdpdGhvdXRDYWNoZX0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZU9uY2UoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBmaWxlUGF0aCxcbiAgICB0ZW1wRmlsZSxcbiAgICBDaGVja1RzKGZpbGVQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIGF3YWl0IE15TW9kdWxlKChwYXRoOiBzdHJpbmcpID0+IGltcG9ydChwYXRoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlQ2pzU2NyaXB0KGNvbnRlbnQ6IHN0cmluZykge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0ZW1wRmlsZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kZWwgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBmYWtlIHNjcmlwdCBsb2NhdGlvbiwgYSBmaWxlIGxvY2F0aW9uLCBhIHR5cGUgYXJyYXksIGFuZCBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgb3Igbm90IGl0J3NcbiAqIGEgVHlwZVNjcmlwdCBmaWxlLiBJdCB0aGVuIGNvbXBpbGVzIHRoZSBzY3JpcHQgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIHRoZSBtb2R1bGVcbiAqIFRoaXMgaXMgZm9yIFJ1blRpbWUgQ29tcGlsZSBTY3JpcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2xvYmFsUHJhbXMgLSBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLFxuICogdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNjcmlwdExvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBzY3JpcHQgdG8gYmUgY29tcGlsZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGUgZnJvbSB0aGUgc3RhdGljIGZvbGRlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFtzdHJpbmcsIHN0cmluZ11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlU2NyaXB0IC0gYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIElmIHRydWUsIHRoZSBjb2RlIHdpbGwgYmUgY29tcGlsZWQgd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlQ29kZSAtIFRoZSBjb2RlIHRoYXQgd2lsbCBiZSBjb21waWxlZCBhbmQgc2F2ZWQgdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTWFwQ29tbWVudCAtIHN0cmluZ1xuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUltcG9ydChnbG9iYWxQcmFtczogc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBtZXJnZVRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCB0eXBlQXJyYXlbMV0pO1xuXG4gIGNvbnN0IGZ1bGxTYXZlTG9jYXRpb24gPSBzY3JpcHRMb2NhdGlvbiArIFwiLmNqc1wiO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0eXBlQXJyYXlbMF0gKyBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgc2NyaXB0TG9jYXRpb24sXG4gICAgZnVsbFNhdmVMb2NhdGlvbixcbiAgICBpc1R5cGVTY3JpcHQsXG4gICAgaXNEZWJ1ZyxcbiAgICB7IHBhcmFtczogZ2xvYmFsUHJhbXMsIG1lcmdlVHJhY2ssIHRlbXBsYXRlUGF0aCwgY29kZU1pbmlmeTogZmFsc2UgfVxuICApO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgcCk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydCh0ZW1wbGF0ZVBhdGgsIHAsIHR5cGVBcnJheSwge2lzRGVidWd9KTtcbiAgfVxuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGZ1bGxTYXZlTG9jYXRpb24pO1xuICByZXR1cm4gYXN5bmMgKC4uLmFycjogYW55W10pID0+IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXAsIC4uLmFycik7XG59IiwgImltcG9ydCB7IFN0cmluZ01hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IE1pbmlTZWFyY2gsIHtTZWFyY2hPcHRpb25zLCBTZWFyY2hSZXN1bHR9IGZyb20gJ21pbmlzZWFyY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hSZWNvcmQge1xuICAgIHByaXZhdGUgZnVsbFBhdGg6IHN0cmluZ1xuICAgIHByaXZhdGUgaW5kZXhEYXRhOiB7W2tleTogc3RyaW5nXToge1xuICAgICAgICB0aXRsZXM6IFN0cmluZ01hcCxcbiAgICAgICAgdGV4dDogc3RyaW5nXG4gICAgfX1cbiAgICBwcml2YXRlIG1pbmlTZWFyY2g6IE1pbmlTZWFyY2g7XG4gICAgY29uc3RydWN0b3IoZmlsZXBhdGg6IHN0cmluZyl7XG4gICAgICAgIHRoaXMuZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBmaWxlcGF0aCArICcuanNvbidcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKCl7XG4gICAgICAgIHRoaXMuaW5kZXhEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZ1bGxQYXRoKTtcbiAgICAgICAgY29uc3QgdW53cmFwcGVkOiB7aWQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZ31bXSA9IFtdO1xuXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgZm9yKGNvbnN0IHBhdGggaW4gdGhpcy5pbmRleERhdGEpe1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuaW5kZXhEYXRhW3BhdGhdO1xuICAgICAgICAgICAgZm9yKGNvbnN0IGlkIGluIGVsZW1lbnQudGl0bGVzKXtcbiAgICAgICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50aXRsZXNbaWRdLCB1cmw6IGAvJHtwYXRofSMke2lkfWB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVud3JhcHBlZC5wdXNoKHtpZDogY291bnRlcisrLCB0ZXh0OiBlbGVtZW50LnRleHQsIHVybDogYC8ke3BhdGh9YH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5taW5pU2VhcmNoID0gbmV3IE1pbmlTZWFyY2goe1xuICAgICAgICAgICAgZmllbGRzOiBbJ3RleHQnXSxcbiAgICAgICAgICAgIHN0b3JlRmllbGRzOiBbJ2lkJywgJ3RleHQnLCAndXJsJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5taW5pU2VhcmNoLmFkZEFsbEFzeW5jKHVud3JhcHBlZCk7XG4gICAgfVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHN0cmluZyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBtYXRjaGVzXG4gKiBAcGFyYW0gdGV4dCAtIFRoZSB0ZXh0IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIGxlbmd0aCAtIG1heGltdW0gbGVuZ3RoIC0gKm5vdCBjdXR0aW5nIGhhbGYgd29yZHMqXG4gKiBcbiAqIGFkZEFmdGVyTWF4TGVuZ3RoIC0gYWRkIHRleHQgaWYgYSB0ZXh0IHJlc3VsdCByZWFjaCB0aGUgbWF4aW11bSBsZW5ndGgsIGZvciBleGFtcGxlICcuLi4nXG4gKiBAcGFyYW0gdGFnIC0gVGhlIHRhZyB0byB3cmFwIGFyb3VuZCB0aGUgZm91bmRlZCBzZWFyY2ggdGVybXMuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBvYmplY3RzLCBlYWNoIG9iamVjdCBjb250YWluaW5nIHRoZSBgdGV4dGAgb2YgdGhlIHNlYXJjaCByZXN1bHQsIGBsaW5rYCB0byB0aGUgcGFnZSwgYW5kIGFuIGFycmF5IG9mXG4gKiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIHRlcm1zIGFuZCB0aGUgaW5kZXggb2YgdGhlIHRlcm0gaW4gdGhlIHRleHQuXG4gKi9cbiAgICBzZWFyY2godGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zICYge2xlbmd0aD86IG51bWJlciwgYWRkQWZ0ZXJNYXhMZW5ndGg/OiBzdHJpbmd9ID0ge2Z1enp5OiB0cnVlLCBsZW5ndGg6IDIwMCwgYWRkQWZ0ZXJNYXhMZW5ndGg6ICcuLi4nfSwgdGFnID0gJ2InKTogKFNlYXJjaFJlc3VsdCAmIHt0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nfSlbXXtcbiAgICAgICAgY29uc3QgZGF0YSA9IDxhbnk+dGhpcy5taW5pU2VhcmNoLnNlYXJjaCh0ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgaWYoIXRhZykgcmV0dXJuIGRhdGE7XG5cbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgZGF0YSl7XG4gICAgICAgICAgICBmb3IoY29uc3QgdGVybSBvZiBpLnRlcm1zKXtcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmxlbmd0aCAmJiBpLnRleHQubGVuZ3RoID4gb3B0aW9ucy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSBpLnRleHQuc3Vic3RyaW5nKDAsIG9wdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaS50ZXh0W29wdGlvbnMubGVuZ3RoXS50cmltKCkgIT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaS50ZXh0ID0gc3Vic3RyaW5nLnN1YnN0cmluZygwLCBzdWJzdHJpbmcubGFzdEluZGV4T2YoJyAnKSkgKyAob3B0aW9ucy5hZGRBZnRlck1heExlbmd0aCA/PyAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBzdWJzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBpLnRleHQudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXIgPSBpLnRleHQudG9Mb3dlckNhc2UoKSwgcmVidWlsZCA9ICcnO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxvd2VyLmluZGV4T2YodGVybSk7XG4gICAgICAgICAgICAgICAgbGV0IGJlZW5MZW5ndGggPSAwO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoaW5kZXggIT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICByZWJ1aWxkICs9IGkudGV4dC5zdWJzdHJpbmcoYmVlbkxlbmd0aCwgYmVlbkxlbmd0aCArIGluZGV4KSArICBgPCR7dGFnfT4ke2kudGV4dC5zdWJzdHJpbmcoaW5kZXggKyBiZWVuTGVuZ3RoLCBpbmRleCArIHRlcm0ubGVuZ3RoICsgYmVlbkxlbmd0aCl9PC8ke3RhZ30+YFxuICAgICAgICAgICAgICAgICAgICBsb3dlciA9IGxvd2VyLnN1YnN0cmluZyhpbmRleCArIHRlcm0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgYmVlbkxlbmd0aCArPSBpbmRleCArIHRlcm0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGxvd2VyLmluZGV4T2YodGVybSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gcmVidWlsZCArIGkudGV4dC5zdWJzdHJpbmcoYmVlbkxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBzdWdnZXN0KHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyl7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbmlTZWFyY2guYXV0b1N1Z2dlc3QodGV4dCwgb3B0aW9ucyk7XG4gICAgfVxufSIsICJpbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gXCIuLi8uLi8uLi9CdWlsZEluRnVuYy9TZWFyY2hSZWNvcmRcIlxuaW1wb3J0IHtTZXR0aW5nc30gIGZyb20gJy4uLy4uLy4uL01haW5CdWlsZC9TZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG59IiwgImltcG9ydCBwYWNrYWdlRXhwb3J0IGZyb20gXCIuL3BhY2thZ2VFeHBvcnRcIjtcblxuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGFsaWFzTmFtZXMgPSBbcGFja2FnZU5hbWVdXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGg6IHN0cmluZyk6IGFueSB7XG5cbiAgICBzd2l0Y2ggKG9yaWdpbmFsUGF0aCkge1xuICAgICAgICAvL0B0cy1pZ25vcmUtbmV4dC1saW5lXG4gICAgICAgIGNhc2UgcGFja2FnZU5hbWU6XG4gICAgICAgICAgICByZXR1cm4gcGFja2FnZUV4cG9ydCgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXNPclBhY2thZ2Uob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXZlID0gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoaGF2ZSkgcmV0dXJuIGhhdmVcbiAgICByZXR1cm4gaW1wb3J0KG9yaWdpbmFsUGF0aCk7XG59IiwgImltcG9ydCBJbXBvcnRBbGlhcywgeyBhbGlhc05hbWVzIH0gZnJvbSAnLi9BbGlhcyc7XG5pbXBvcnQgSW1wb3J0QnlFeHRlbnNpb24sIHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuL0V4dGVuc2lvbi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikgfHwgYWxpYXNOYW1lcy5pbmNsdWRlcyhvcmlnaW5hbFBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nLCByZXF1aXJlOiAocDogc3RyaW5nKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGlhc0V4cG9ydCA9IGF3YWl0IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGFsaWFzRXhwb3J0KSByZXR1cm4gYWxpYXNFeHBvcnQ7XG4gICAgcmV0dXJuIEltcG9ydEJ5RXh0ZW5zaW9uKGZ1bGxQYXRoLCBleHRlbnNpb24pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBSYXpvclRvRUpTLCBSYXpvclRvRUpTTWluaSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyJztcblxuXG5jb25zdCBhZGRXcml0ZU1hcCA9IHtcbiAgICBcImluY2x1ZGVcIjogXCJhd2FpdCBcIixcbiAgICBcImltcG9ydFwiOiBcImF3YWl0IFwiLFxuICAgIFwidHJhbnNmZXJcIjogXCJyZXR1cm4gYXdhaXQgXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBvcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKUyh0ZXh0LmVxKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhzdWJzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU9JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlOiR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZFdyaXRlTWFwW2kubmFtZV19JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuXG4vKipcbiAqIENvbnZlcnRTeW50YXhNaW5pIHRha2VzIHRoZSBjb2RlIGFuZCBhIHNlYXJjaCBzdHJpbmcgYW5kIGNvbnZlcnQgY3VybHkgYnJhY2tldHNcbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbmQgLSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWRkRUpTIC0gVGhlIHN0cmluZyB0byBhZGQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlanMuXG4gKiBAcmV0dXJucyBBIHN0cmluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXhNaW5pKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbmQ6IHN0cmluZywgYWRkRUpTOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTTWluaSh0ZXh0LmVxLCBmaW5kKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICBpZiAodmFsdWVzW2ldICE9IHZhbHVlc1tpICsgMV0pXG4gICAgICAgICAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpXSwgdmFsdWVzW2kgKyAxXSkpO1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaSArIDJdLCB2YWx1ZXNbaSArIDNdKTtcbiAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZEVKU30ke3N1YnN0cmluZ30lPmA7XG4gICAgfVxuXG4gICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZygodmFsdWVzLmF0KC0xKT8/LTEpICsgMSkpO1xuXG4gICAgcmV0dXJuIGJ1aWxkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBvb2wgfSBmcm9tIFwiLi4vQmFzZVJlYWRlci9SZWFkZXJcIjtcblxuYXN5bmMgZnVuY3Rpb24gSFRNTEF0dHJQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc2s6IG51bWJlcixcbiAgICBlazogbnVtYmVyLFxuICAgIHN2OiBudW1iZXIsXG4gICAgZXY6IG51bWJlcixcbiAgICBzcGFjZTogYm9vbGVhbixcbiAgICBjaGFyOiBzdHJpbmdcbn1bXT4ge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgcG9vbC5leGVjKCdIVE1MQXR0clBhcnNlcicsIFt0ZXh0XSlcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ0RhdGFQYXJzZXIge1xuICAgIHZhbHVlQXJyYXk6IHtcbiAgICAgICAga2V5PzogU3RyaW5nVHJhY2tlclxuICAgICAgICB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsXG4gICAgICAgIHNwYWNlOiBib29sZWFuLFxuICAgICAgICBjaGFyPzogc3RyaW5nXG4gICAgfVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGV4dDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VyKCkge1xuICAgICAgICBjb25zdCBwYXJzZSA9IGF3YWl0IEhUTUxBdHRyUGFyc2VyKHRoaXMudGV4dC5lcSk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGNoYXIsIGVrLCBldiwgc2ssIHNwYWNlLCBzdiB9IG9mIHBhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGNoYXIsIHNwYWNlLCBrZXk6IHRoaXMudGV4dC5zdWJzdHJpbmcoc2ssIGVrKSwgdmFsdWU6IHN2ID09IGV2ID8gdHJ1ZSA6IHRoaXMudGV4dC5zdWJzdHJpbmcoc3YsIGV2KSB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3BJdGVtKGtleTogc3RyaW5nKXtcbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09IC0xID8gbnVsbDogdGhpcy52YWx1ZUFycmF5LnNwbGljZShpbmRleCwgMSkuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBwb3BUcmFja2VyKGtleTogc3RyaW5nKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0VHJhY2tlcjxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wVHJhY2tlcihrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlUcmFja2VyPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFRyYWNrZXIoa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gZGF0YS5lcTogdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wU3RyaW5nKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gdmFsdWUuZXEgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BCb29sZWFuKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMucG9wU3RyaW5nKGtleSkgPz8gZGVmYXVsdFZhbHVlKVxuICAgIH1cblxuICAgIGV4aXN0cyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSkgIT0gbnVsbFxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YTogdmFsdWU7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSAnY2xhc3MnKTtcbiAgICAgICAgaWYgKGhhdmU/LnZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcilcbiAgICAgICAgICAgIGhhdmUudmFsdWUuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcgKyBjbGFzc05hbWUpLnRyaW1TdGFydCgpO1xuICAgICAgICBlbHNlIGlmIChoYXZlPy52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaGF2ZS52YWx1ZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hWYWx1ZSgnY2xhc3MnLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVidWlsZFNwYWNlKCkge1xuICAgICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgdmFsdWUsIGNoYXIsIGtleSwgc3BhY2UgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIHNwYWNlICYmIG5ld0F0dHJpYnV0ZXMuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBwdXNoVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpO1xuICAgICAgICBpZiAoaGF2ZSkgcmV0dXJuIChoYXZlLnZhbHVlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpKTtcblxuICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwga2V5KSwgdmFsdWU6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKSwgY2hhcjogJ1wiJywgc3BhY2U6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgbWFwKCkge1xuICAgICAgICBjb25zdCBhdHRyTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IHRydWUgfSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSBhdHRyTWFwW2tleS5lcV0gPSB2YWx1ZSA9PT0gdHJ1ZSA/IHRydWUgOiB2YWx1ZS5lcTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyTWFwO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0X2ZpbGUgPSBydW5fc2NyaXB0X25hbWUuc3BsaXQoLy0+fDxsaW5lPi8pLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPGxpbmU+L2dpLCAnPGJyLz4nKSArICc8L3A+PHA+RXJyb3IgbWVzc2FnZTogJyArIGUubWVzc2FnZSArICc8L3A+YCl9JztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXRoOiBcIiArIHJ1bl9zY3JpcHRfbmFtZS5zbGljZSgwLCAtbGFzdF9maWxlLmxlbmd0aCkucmVwbGFjZSgvPGxpbmU+L2dpLCAnXFxcXG4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgpfVwiICsgbGFzdF9maWxlLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBtZXNzYWdlOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBydW5uaW5nIHRoaXMgY29kZTogXFxcXFwiXCIgKyBydW5fc2NyaXB0X2NvZGUgKyAnXCInKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN0YWNrOiBcIiArIGUuc3RhY2spO1xuICAgICAgICAgICAgICAgIH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgfX0pO31gKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbHRDb2RlID0gYXdhaXQgUGFnZVRlbXBsYXRlLlJ1bkFuZEV4cG9ydCh0ZXh0LCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuQWRkUGFnZVRlbXBsYXRlKGJ1aWx0Q29kZSwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHN0YXRpYyBBZGRBZnRlckJ1aWxkKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBJblBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBkYXRhT2JqZWN0OiBhbnksIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhe1xuICAgICAgICAgICAgY29uc3QgX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHsuLi5fcGFnZSR7ZGF0YU9iamVjdCA/ICcsJyArIGRhdGFPYmplY3QgOiAnJ319O1xuICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHslPmApO1xuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjaygnPCUhfX19JT4nKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFJhem9yU3ludGF4IGZyb20gJy4vUmF6b3JTeW50YXgnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdldFN5bnRheChDb21waWxlVHlwZTogYW55KSB7XG4gICAgbGV0IGZ1bmM6IGFueTtcbiAgICBzd2l0Y2ggKENvbXBpbGVUeXBlLm5hbWUgfHwgQ29tcGlsZVR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlJhem9yXCI6XG4gICAgICAgICAgICBmdW5jID0gUmF6b3JTeW50YXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59IiwgImltcG9ydCBBZGRTeW50YXggZnJvbSAnLi9TeW50YXgvSW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZFBsdWdpbiB7XG5cdHB1YmxpYyBTZXR0aW5nc09iamVjdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoU2V0dGluZ3NPYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgICAgIHRoaXMuU2V0dGluZ3NPYmplY3QgPSBTZXR0aW5nc09iamVjdFxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRlZmF1bHRTeW50YXgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2V0dGluZ3NPYmplY3QuQmFzaWNDb21waWxhdGlvblN5bnRheC5jb25jYXQodGhpcy5TZXR0aW5nc09iamVjdC5BZGRDb21waWxlU3ludGF4KTtcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEJhc2ljKHRleHQ6IFN0cmluZ1RyYWNrZXIsIE9EYXRhOnN0cmluZyB8YW55LCBwYXRoOnN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vYWRkIFN5bnRheFxuXG4gICAgICAgIGlmICghT0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KE9EYXRhKSkge1xuICAgICAgICAgICAgT0RhdGEgPSBbT0RhdGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIE9EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBTeW50YXggPSBhd2FpdCBBZGRTeW50YXgoaSk7XG5cbiAgICAgICAgICAgIGlmIChTeW50YXgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gYXdhaXQgU3ludGF4KHRleHQsIGksIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIHBhZ2VzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgY29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRDb21wb25lbnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn0iLCAiLy9nbG9iYWwgc2V0dGluZ3MgZm9yIGJ1aWxkIGluIGNvbXBvbmVudHNcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0ge1xuICAgIHBsdWdpbnM6IFtdXG59OyIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGgsIFBhcnNlRGVidWdMaW5lLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgKiBhcyBleHRyaWNhdGUgZnJvbSAnLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSAnLi90cmFuc2Zvcm0vU2NyaXB0JztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEJ1aWxkU2NyaXB0U2V0dGluZ3MgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncyc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IGZpbmFsaXplQnVpbGQgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHsgQWRkQ29tcGlsZVN5bnRheDogW10sIHBsdWdpbnM6IFtdLCBCYXNpY0NvbXBpbGF0aW9uU3ludGF4OiBbJ1Jhem9yJ10gfTtcbmNvbnN0IFBsdWdpbkJ1aWxkID0gbmV3IEFkZFBsdWdpbihTZXR0aW5ncyk7XG5leHBvcnQgY29uc3QgQ29tcG9uZW50cyA9IG5ldyBJbnNlcnRDb21wb25lbnQoUGx1Z2luQnVpbGQpO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0UGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBTZXR0aW5ncy5wbHVnaW5zLmZpbmQoYiA9PiBiID09IG5hbWUgfHwgKDxhbnk+Yik/Lm5hbWUgPT0gbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTb21lUGx1Z2lucyguLi5kYXRhOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBkYXRhLnNvbWUoeCA9PiBHZXRQbHVnaW4oeCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcygpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheC5pbmNsdWRlcygnVHlwZVNjcmlwdCcpO1xufVxuXG5Db21wb25lbnRzLk1pY3JvUGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5Db21wb25lbnRzLkdldFBsdWdpbiA9IEdldFBsdWdpbjtcbkNvbXBvbmVudHMuU29tZVBsdWdpbnMgPSBTb21lUGx1Z2lucztcbkNvbXBvbmVudHMuaXNUcyA9IGlzVHM7XG5cbkJ1aWxkU2NyaXB0U2V0dGluZ3MucGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5cbmFzeW5jIGZ1bmN0aW9uIG91dFBhZ2UoZGF0YTogU3RyaW5nVHJhY2tlciwgc2NyaXB0RmlsZTogU3RyaW5nVHJhY2tlciwgcGFnZVBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG5cbiAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKHNlc3Npb25JbmZvLCBkYXRhLCBpc1RzKCkpO1xuICAgIGlmKCFhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3MocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIHBhZ2VOYW1lLCB7ZHluYW1pY0NoZWNrfSkpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWxOYW1lID0gYmFzZURhdGEuZGVmYXVsdFZhbHVlUG9wQW55KCdtb2RlbCcsICd3ZWJzaXRlJyk7XG5cbiAgICBpZiAoIW1vZGVsTmFtZSkgcmV0dXJuIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlLCBiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgIGRhdGEgPSBiYXNlRGF0YS5jbGVhckRhdGE7XG5cbiAgICAvL2ltcG9ydCBtb2RlbFxuICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQ3JlYXRlRmlsZVBhdGgocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIG1vZGVsTmFtZSwgJ01vZGVscycsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLm1vZGVsKTsgLy8gZmluZCBsb2NhdGlvbiBvZiB0aGUgZmlsZVxuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdWxsUGF0aCkpIHtcbiAgICAgICAgY29uc3QgRXJyb3JNZXNzYWdlID0gYEVycm9yIG1vZGVsIG5vdCBmb3VuZCAtPiAke21vZGVsTmFtZX0gYXQgcGFnZSAke3BhZ2VOYW1lfWA7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0LCBQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihFcnJvck1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgRnVsbFBhdGgpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3RcblxuICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBGdWxsUGF0aCwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgIGxldCBtb2RlbERhdGEgPSBhd2FpdCBQYXJzZUJhc2VQYWdlLnJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoYmFzZU1vZGVsRGF0YS5hbGxEYXRhKTtcblxuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIG1vZGVsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgcGFnZU5hbWUgKz0gXCIgLT4gXCIgKyBTbWFsbFBhdGg7XG5cbiAgICAvL0dldCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBhbGxEYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdzKG1vZGVsRGF0YSwgWycnXSwgJzonLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICBpZiAoYWxsRGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHdpdGhpbiBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgbW9kZWxEYXRhID0gYWxsRGF0YS5kYXRhO1xuICAgIGNvbnN0IHRhZ0FycmF5ID0gYWxsRGF0YS5mb3VuZC5tYXAoeCA9PiB4LnRhZy5zdWJzdHJpbmcoMSkpO1xuICAgIGNvbnN0IG91dERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ3MoZGF0YSwgdGFnQXJyYXksICdAJyk7XG5cbiAgICBpZiAob3V0RGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIFdpdGggbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vQnVpbGQgV2l0aCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBtb2RlbEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBhbGxEYXRhLmZvdW5kKSB7XG4gICAgICAgIGkudGFnID0gaS50YWcuc3Vic3RyaW5nKDEpOyAvLyByZW1vdmluZyB0aGUgJzonXG4gICAgICAgIGNvbnN0IGhvbGRlckRhdGEgPSBvdXREYXRhLmZvdW5kLmZpbmQoKGUpID0+IGUudGFnID09ICdAJyArIGkudGFnKTtcblxuICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhLnN1YnN0cmluZygwLCBpLmxvYykpO1xuICAgICAgICBtb2RlbERhdGEgPSBtb2RlbERhdGEuc3Vic3RyaW5nKGkubG9jKTtcblxuICAgICAgICBpZiAoaG9sZGVyRGF0YSkge1xuICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGhvbGRlckRhdGEuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFRyeSBsb2FkaW5nIGRhdGEgZnJvbSBwYWdlIGJhc2VcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGcm9tQmFzZSA9IGJhc2VEYXRhLmdldChpLnRhZyk7XG5cbiAgICAgICAgICAgIGlmIChsb2FkRnJvbUJhc2UgJiYgbG9hZEZyb21CYXNlICE9PSB0cnVlICYmIGxvYWRGcm9tQmFzZS5lcS50b0xvd2VyQ2FzZSgpICE9ICdpbmhlcml0JylcbiAgICAgICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobG9hZEZyb21CYXNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG91dFBhZ2UobW9kZWxCdWlsZCwgc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUpLCBGdWxsUGF0aCwgcGFnZU5hbWUsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW5zZXJ0KGRhdGE6IHN0cmluZywgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIG5lc3RlZFBhZ2U6IGJvb2xlYW4sIG5lc3RlZFBhZ2VEYXRhOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pIHtcbiAgICBsZXQgRGVidWdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGRhdGEpO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgb3V0UGFnZShEZWJ1Z1N0cmluZywgbmV3IFN0cmluZ1RyYWNrZXIoRGVidWdTdHJpbmcuRGVmYXVsdEluZm9UZXh0KSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbywgZHluYW1pY0NoZWNrKTtcblxuICAgIGlmKERlYnVnU3RyaW5nID09IG51bGwpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQbHVnaW5CdWlsZC5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IENvbXBvbmVudHMuSW5zZXJ0KERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBmaW5hbGl6ZUJ1aWxkKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mbywgZnVsbFBhdGhDb21waWxlKTtcbiAgICBcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zKERlYnVnU3RyaW5nKTtcbiAgICBEZWJ1Z1N0cmluZz0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgIHJldHVybiBEZWJ1Z1N0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCdWlsZEpTLCBCdWlsZEpTWCwgQnVpbGRUUywgQnVpbGRUU1ggfSBmcm9tICcuL0ZvclN0YXRpYy9TY3JpcHQnO1xuaW1wb3J0IEJ1aWxkU3ZlbHRlIGZyb20gJy4vRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTdHlsZVNhc3MgfSBmcm9tICcuL0ZvclN0YXRpYy9TdHlsZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgU3lzdGVtRGF0YSwgZ2V0RGlybmFtZSwgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFJlc3BvbnNlLCBSZXF1ZXN0IH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwcm9tcHRseSBmcm9tICdwcm9tcHRseSc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5cbmNvbnN0IFN1cHBvcnRlZFR5cGVzID0gWydqcycsICdzdmVsdGUnLCAndHMnLCAnanN4JywgJ3RzeCcsICdjc3MnLCAnc2FzcycsICdzY3NzJ107XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1N0YXRpY0ZpbGVzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvID0gU3RhdGljRmlsZXNJbmZvLnN0b3JlW3BhdGhdO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG8pIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIHAgPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBvW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAhbztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGZ1bGxDb21waWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBzd2l0Y2ggKGV4dCkge1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIGNhc2UgJ3Nhc3MnOlxuICAgICAgICBjYXNlICdzY3NzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3R5bGVTYXNzKFNtYWxsUGF0aCwgZXh0LCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmVsdGUnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdmVsdGUoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGZ1bGxDb21waWxlUGF0aCArPSAnLmpzJztcbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsQ29tcGlsZVBhdGgpKSB7XG4gICAgICAgIFN0YXRpY0ZpbGVzSW5mby51cGRhdGUoU21hbGxQYXRoLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGVidWcpXG4gICAgICAgIHJldHVybiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgYnVpbGRJbiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICBleHQ/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGluU2VydmVyPzogc3RyaW5nO1xufVxuXG5jb25zdCBzdGF0aWNGaWxlcyA9IFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy9jbGllbnQvJztcbmNvbnN0IGdldFN0YXRpYzogYnVpbGRJbltdID0gW3tcbiAgICBwYXRoOiBcInNlcnYvdGVtcC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcImJ1aWxkVGVtcGxhdGUuanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvY29ubmVjdC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1ha2VDb25uZWN0aW9uLmpzXCJcbn0sXG57XG4gICAgcGF0aDogXCJzZXJ2L21kLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFya2Rvd25Db3B5LmpzXCJcbn1dO1xuXG5jb25zdCBnZXRTdGF0aWNGaWxlc1R5cGU6IGJ1aWxkSW5bXSA9IFt7XG4gICAgZXh0OiAnLnB1Yi5qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLm1qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLmNzcycsXG4gICAgdHlwZTogJ2Nzcydcbn1dO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0OiBSZXF1ZXN0LCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgY29uc3QgZm91bmQgPSBnZXRTdGF0aWNGaWxlc1R5cGUuZmluZCh4ID0+IGZpbGVQYXRoLmVuZHNXaXRoKHguZXh0KSk7XG5cbiAgICBpZiAoIWZvdW5kKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGNvbnN0IGJhc2VQYXRoID0gUmVxdWVzdC5xdWVyeS50ID09ICdsJyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV07XG4gICAgY29uc3QgaW5TZXJ2ZXIgPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGluU2VydmVyKSlcbiAgICAgICAgcmV0dXJuIHsgLi4uZm91bmQsIGluU2VydmVyIH07XG59XG5cbmxldCBkZWJ1Z2dpbmdXaXRoU291cmNlOiBudWxsIHwgYm9vbGVhbiA9IG51bGw7XG5cbmlmIChhcmd2LmluY2x1ZGVzKCdhbGxvd1NvdXJjZURlYnVnJykpXG4gICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IHRydWU7XG5hc3luYyBmdW5jdGlvbiBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkge1xuICAgIGlmICh0eXBlb2YgZGVidWdnaW5nV2l0aFNvdXJjZSA9PSAnYm9vbGVhbicpXG4gICAgICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IChhd2FpdCBwcm9tcHRseS5wcm9tcHQoXG4gICAgICAgICAgICAnQWxsb3cgZGVidWdnaW5nIEphdmFTY3JpcHQvQ1NTIGluIHNvdXJjZSBwYWdlPyAtIGV4cG9zaW5nIHlvdXIgc291cmNlIGNvZGUgKG5vKScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKHY6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWyd5ZXMnLCAnbm8nXS5pbmNsdWRlcyh2LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3llcyBvciBubycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwXG4gICAgICAgICAgICB9XG4gICAgICAgICkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09ICd5ZXMnO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB9IGNhdGNoIHsgfVxuXG5cbiAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcbn1cblxuY29uc3Qgc2FmZUZvbGRlcnMgPSBbZ2V0VHlwZXMuU3RhdGljWzJdLCBnZXRUeXBlcy5Mb2dzWzJdLCAnTW9kZWxzJywgJ0NvbXBvbmVudHMnXTtcbi8qKlxuICogSWYgdGhlIHVzZXIgaXMgaW4gZGVidWcgbW9kZSwgYW5kIHRoZSBmaWxlIGlzIGEgc291cmNlIGZpbGUsIGFuZCB0aGUgdXNlciBjb21tZW5kIGxpbmUgYXJndW1lbnQgaGF2ZSBhbGxvd1NvdXJjZURlYnVnXG4gKiB0aGVuIHJldHVybiB0aGUgZnVsbCBwYXRoIHRvIHRoZSBmaWxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBpcyB0aGUgY3VycmVudCBwYWdlIGEgZGVidWcgcGFnZT9cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRoYXQgd2FzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSBJZiB0aGlzIHBhdGggYWxyZWFkeSBiZWVuIGNoZWNrZWRcbiAqIHRoZSBmaWxlLlxuICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGZpbGUgYW5kIHRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bnNhZmVEZWJ1Zyhpc0RlYnVnOiBib29sZWFuLCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFpc0RlYnVnIHx8IEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpICE9ICcuc291cmNlJyB8fCAhc2FmZUZvbGRlcnMuaW5jbHVkZXMoZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykuc2hpZnQoKSkgfHwgIWF3YWl0IGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA3KSk7IC8vIHJlbW92aW5nICcuc291cmNlJ1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlRmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNCk7IC8vIHJlbW92aW5nICcuY3NzJ1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgZmlsZVBhdGg7XG5cbiAgICBsZXQgZXhpc3RzOiBib29sZWFuO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoYmFzZUZpbGVQYXRoKSA9PSAnLnN2ZWx0ZScgJiYgKGNoZWNrZWQgfHwgKGV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSkpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgIWV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludFdhcm5pbmdzIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBtb3JlT3B0aW9ucz86IFRyYW5zZm9ybU9wdGlvbnMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IGlucHV0UGF0aCArICc/c291cmNlPXRydWUnLFxuICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAnaW5saW5lJzogZmFsc2UsXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIC4uLm1vcmVPcHRpb25zXG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IGNvZGU7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzLCBmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZnVsbFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanMnLCBpc0RlYnVnLCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgbG9hZGVyOiAndHMnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanN4JywgaXNEZWJ1ZywgeyAuLi4oR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSksIGxvYWRlcjogJ2pzeCcgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0c3gnLCBpc0RlYnVnLCB7IGxvYWRlcjogJ3RzeCcsIC4uLihHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KSB9KTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tIFwiZXNidWlsZC13YXNtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQsIE1lcmdlU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZUVycm9yLCBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWNQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY1BhdGg7XG5cbiAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llcywgbWFwLCBzY3JpcHRMYW5nIH0gPSBhd2FpdCBwcmVwcm9jZXNzKGZ1bGxQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBpblN0YXRpY1BhdGgpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnVsbFBhdGguc3BsaXQoL1xcL3xcXC8vKS5wb3AoKTtcbiAgICBsZXQganM6IGFueSwgY3NzOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwge1xuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXY6IGlzRGVidWcsXG4gICAgICAgICAgICBzb3VyY2VtYXA6IG1hcCxcbiAgICAgICAgICAgIGNzczogZmFsc2UsXG4gICAgICAgICAgICBoeWRyYXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3ZlbHRlUGF0aDogJy9zZXJ2L3N2ZWx0ZSdcbiAgICAgICAgfSk7XG4gICAgICAgIFByaW50U3ZlbHRlV2FybihvdXRwdXQud2FybmluZ3MsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICBqcyA9IG91dHB1dC5qcztcbiAgICAgICAgY3NzID0gb3V0cHV0LmNzcztcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBQcmludFN2ZWx0ZUVycm9yKGVyciwgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aGlzRmlsZTogMFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgY29uc3Qgc291cmNlRmlsZUNsaWVudCA9IGpzLm1hcC5zb3VyY2VzWzBdLnN1YnN0cmluZygxKTtcblxuICAgIGlmKGlzRGVidWcpe1xuICAgICAgICBqcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgfVxuXG4gICAgaWYgKFNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oanMuY29kZSwge1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb2FkZXI6IDxhbnk+c2NyaXB0TGFuZyxcbiAgICAgICAgICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqcy5jb2RlID0gY29kZTtcbiAgICAgICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgICAgICBqcy5tYXAgPSBhd2FpdCBNZXJnZVNvdXJjZU1hcChKU09OLnBhcnNlKG1hcCksIGpzLm1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXdhaXQgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoZXJyLCBqcy5tYXAsIGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgIGpzLmNvZGUgKz0gdG9VUkxDb21tZW50KGpzLm1hcCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3NzLmNvZGUpIHtcbiAgICAgICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuanMnLCBqcy5jb2RlKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVwZW5kZW5jaWVzLFxuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufSIsICJpbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkx9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgIGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgc2Fzc0FuZFNvdXJjZSwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU3R5bGVTYXNzKGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBcInNhc3NcIiB8IFwic2Nzc1wiIHwgXCJjc3NcIiwgaXNEZWJ1ZzogYm9vbGVhbik6IFByb21pc2U8eyBba2V5OiBzdHJpbmddOiBudW1iZXIgfT4ge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG5cbiAgICBjb25zdCBkZXBlbmRlbmNlT2JqZWN0ID0ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCksIGZpbGVEYXRhRGlybmFtZSA9IHBhdGguZGlybmFtZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhmaWxlRGF0YSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBpc0RlYnVnLFxuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KHR5cGUpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZSh0eXBlKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHJlc3VsdC5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jZU9iamVjdFtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKV0gPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhID0gcmVzdWx0LmNzcztcblxuICAgICAgICBpZiAoaXNEZWJ1ZyAmJiByZXN1bHQuc291cmNlTWFwKSB7XG4gICAgICAgICAgICBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHBhdGhUb0ZpbGVVUkwoZmlsZURhdGEpLmhyZWYpO1xuICAgICAgICAgICAgcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzID0gcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzLm1hcCh4ID0+IHBhdGgucmVsYXRpdmUoZmlsZURhdGFEaXJuYW1lLCBmaWxlVVJMVG9QYXRoKHgpKSArICc/c291cmNlPXRydWUnKTtcblxuICAgICAgICAgICAgZGF0YSArPSBgXFxyXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkocmVzdWx0LnNvdXJjZU1hcCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfSovYDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlcGVuZGVuY2VPYmplY3Rcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGlyZW50IH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgSW5zZXJ0LCBDb21wb25lbnRzLCBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgQ2xlYXJXYXJuaW5nIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnXG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBEZWxldGVJbkRpcmVjdG9yeSwgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFJlcVNjcmlwdCBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IFN0YXRpY0ZpbGVzIGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tICcuL0NvbXBpbGVTdGF0ZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVTaXRlTWFwIH0gZnJvbSAnLi9TaXRlTWFwJztcbmltcG9ydCB7IGV4dGVuc2lvbklzLCBpc0ZpbGVUeXBlLCBSZW1vdmVFbmRUeXBlIH0gZnJvbSAnLi9GaWxlVHlwZXMnO1xuaW1wb3J0IHsgcGVyQ29tcGlsZSwgcG9zdENvbXBpbGUsIHBlckNvbXBpbGVQYWdlLCBwb3N0Q29tcGlsZVBhZ2UgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIHsgaXNEZWJ1ZywgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2sgfTogeyBpc0RlYnVnPzogYm9vbGVhbiwgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IEZ1bGxGaWxlUGF0aCA9IHBhdGguam9pbihhcnJheVR5cGVbMF0sIGZpbGVQYXRoKSwgRnVsbFBhdGhDb21waWxlID0gYXJyYXlUeXBlWzFdICsgZmlsZVBhdGggKyAnLmNqcyc7XG5cbiAgICBjb25zdCBodG1sID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICBjb25zdCBFeGNsdVVybCA9IChuZXN0ZWRQYWdlID8gbmVzdGVkUGFnZSArICc8bGluZT4nIDogJycpICsgYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGg7XG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IGhhc1Nlc3Npb25JbmZvID8/IG5ldyBTZXNzaW9uQnVpbGQoYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGgsIEZ1bGxGaWxlUGF0aCwgYXJyYXlUeXBlWzJdLCBpc0RlYnVnLCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikpO1xuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoJ3RoaXNQYWdlJywgRnVsbEZpbGVQYXRoKTtcblxuICAgIGF3YWl0IHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuICAgIGNvbnN0IENvbXBpbGVkRGF0YSA9IChhd2FpdCBJbnNlcnQoaHRtbCwgRnVsbFBhdGhDb21waWxlLCBCb29sZWFuKG5lc3RlZFBhZ2UpLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGR5bmFtaWNDaGVjaykpID8/IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgYXdhaXQgcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgaWYgKCFuZXN0ZWRQYWdlICYmIENvbXBpbGVkRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShGdWxsUGF0aENvbXBpbGUsIENvbXBpbGVkRGF0YS5TdHJpbmdXaXRoVGFjayhGdWxsUGF0aENvbXBpbGUpKTtcbiAgICAgICAgcGFnZURlcHMudXBkYXRlKEV4Y2x1VXJsLCBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIHJldHVybiB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm8gfTtcbn1cblxuZnVuY3Rpb24gUmVxdWlyZVNjcmlwdChzY3JpcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyJywgc2NyaXB0LCBnZXRUeXBlcy5TdGF0aWMsIHsgaXNEZWJ1ZzogZmFsc2UsIG9ubHlQcmVwYXJlOiB0cnVlIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ta2RpcihhcnJheVR5cGVbMV0gKyBjb25uZWN0KTtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgICAgICBpZiAoYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKGFycmF5VHlwZVsyXSArICcvJyArIGNvbm5lY3QpKSAvL2NoZWNrIGlmIG5vdCBhbHJlYWR5IGNvbXBpbGUgZnJvbSBhICdpbi1maWxlJyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbXBpbGVGaWxlKGNvbm5lY3QsIGFycmF5VHlwZSwgeyBkeW5hbWljQ2hlY2s6ICFleHRlbnNpb25JcyhuLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVTY3JpcHQoY29ubmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgU3RhdGljRmlsZXMoY29ubmVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlU2NyaXB0cyhzY3JpcHRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBzY3JpcHRzKSB7XG4gICAgICAgIGF3YWl0IFJlcXVpcmVTY3JpcHQocGF0aCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBDcmVhdGVDb21waWxlKHQ6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHR5cGVzID0gZ2V0VHlwZXNbdF07XG4gICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkodHlwZXNbMV0pO1xuICAgIHJldHVybiAoKSA9PiBGaWxlc0luRm9sZGVyKHR5cGVzLCAnJywgc3RhdGUpO1xufVxuXG4vKipcbiAqIHdoZW4gcGFnZSBjYWxsIG90aGVyIHBhZ2U7XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZUluRmlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sICB7IGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrIH06IHsgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aCwgYXJyYXlUeXBlWzFdKTtcbiAgICByZXR1cm4gYXdhaXQgY29tcGlsZUZpbGUocGF0aCwgYXJyYXlUeXBlLCB7aXNEZWJ1Zzp0cnVlLCBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVja30pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKSB7XG4gICAgYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUocGF0aCwgYXJyYXlUeXBlLCB7ZHluYW1pY0NoZWNrfSk7XG4gICAgQ2xlYXJXYXJuaW5nKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlQWxsKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MpIHtcbiAgICBsZXQgc3RhdGUgPSAhYXJndi5pbmNsdWRlcygncmVidWlsZCcpICYmIGF3YWl0IENvbXBpbGVTdGF0ZS5jaGVja0xvYWQoKVxuXG4gICAgaWYgKHN0YXRlKSByZXR1cm4gKCkgPT4gUmVxdWlyZVNjcmlwdHMoc3RhdGUuc2NyaXB0cylcbiAgICBwYWdlRGVwcy5jbGVhcigpO1xuXG4gICAgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcblxuICAgIHBlckNvbXBpbGUoKTtcblxuICAgIGNvbnN0IGFjdGl2YXRlQXJyYXkgPSBbYXdhaXQgQ3JlYXRlQ29tcGlsZShnZXRUeXBlcy5TdGF0aWNbMl0sIHN0YXRlKSwgYXdhaXQgQ3JlYXRlQ29tcGlsZShnZXRUeXBlcy5Mb2dzWzJdLCBzdGF0ZSksIENsZWFyV2FybmluZ107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWN0aXZhdGVBcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgaSgpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmV4cG9ydCgpXG4gICAgICAgIHBhZ2VEZXBzLnNhdmUoKTtcbiAgICAgICAgcG9zdENvbXBpbGUoKVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGdldFNldHRpbmdzRGF0ZSB9IGZyb20gXCIuLi9NYWluQnVpbGQvSW1wb3J0TW9kdWxlXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbnR5cGUgQ1N0YXRlID0ge1xuICAgIHVwZGF0ZTogbnVtYmVyXG4gICAgcGFnZUFycmF5OiBzdHJpbmdbXVtdLFxuICAgIGltcG9ydEFycmF5OiBzdHJpbmdbXVxuICAgIGZpbGVBcnJheTogc3RyaW5nW11cbn1cblxuLyogVGhpcyBjbGFzcyBpcyB1c2VkIHRvIHN0b3JlIHRoZSBzdGF0ZSBvZiB0aGUgcHJvamVjdCAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZVN0YXRlIHtcbiAgICBwcml2YXRlIHN0YXRlOiBDU3RhdGUgPSB7IHVwZGF0ZTogMCwgcGFnZUFycmF5OiBbXSwgaW1wb3J0QXJyYXk6IFtdLCBmaWxlQXJyYXk6IFtdIH1cbiAgICBzdGF0aWMgZmlsZVBhdGggPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgXCJDb21waWxlU3RhdGUuanNvblwiKVxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnVwZGF0ZSA9IGdldFNldHRpbmdzRGF0ZSgpXG4gICAgfVxuXG4gICAgZ2V0IHNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmltcG9ydEFycmF5XG4gICAgfVxuXG4gICAgZ2V0IHBhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5wYWdlQXJyYXlcbiAgICB9XG5cbiAgICBnZXQgZmlsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmZpbGVBcnJheVxuICAgIH1cblxuICAgIGFkZFBhZ2UocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnBhZ2VBcnJheS5maW5kKHggPT4geFswXSA9PSBwYXRoICYmIHhbMV0gPT0gdHlwZSkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBhZ2VBcnJheS5wdXNoKFtwYXRoLCB0eXBlXSlcbiAgICB9XG5cbiAgICBhZGRJbXBvcnQocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGFkZEZpbGUocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5maWxlQXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZpbGVBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUoQ29tcGlsZVN0YXRlLmZpbGVQYXRoLCB0aGlzLnN0YXRlKVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjaGVja0xvYWQoKSB7XG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5maWxlUGF0aCkpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpXG4gICAgICAgIHN0YXRlLnN0YXRlID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZpbGVQYXRoKVxuXG4gICAgICAgIGlmIChzdGF0ZS5zdGF0ZS51cGRhdGUgIT0gZ2V0U2V0dGluZ3NEYXRlKCkpIHJldHVyblxuXG4gICAgICAgIHJldHVybiBzdGF0ZVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgSW1wb3J0RmlsZSwge0FkZEV4dGVuc2lvbiwgUmVxdWlyZU9uY2V9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge3ByaW50fSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gU3RhcnRSZXF1aXJlKGFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGFycmF5RnVuY1NlcnZlciA9IFtdO1xuICAgIGZvciAobGV0IGkgb2YgYXJyYXkpIHtcbiAgICAgICAgaSA9IEFkZEV4dGVuc2lvbihpKTtcblxuICAgICAgICBjb25zdCBiID0gYXdhaXQgSW1wb3J0RmlsZSgncm9vdCBmb2xkZXIgKFdXVyknLCBpLCBnZXRUeXBlcy5TdGF0aWMsIHtpc0RlYnVnfSk7XG4gICAgICAgIGlmIChiICYmIHR5cGVvZiBiLlN0YXJ0U2VydmVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFycmF5RnVuY1NlcnZlci5wdXNoKGIuU3RhcnRTZXJ2ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpbnQubG9nKGBDYW4ndCBmaW5kIFN0YXJ0U2VydmVyIGZ1bmN0aW9uIGF0IG1vZHVsZSAtICR7aX1cXG5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheUZ1bmNTZXJ2ZXI7XG59XG5cbmxldCBsYXN0U2V0dGluZ3NJbXBvcnQ6IG51bWJlcjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRTZXR0aW5ncyhmaWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKXtcbiAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCArICcudHMnKSl7XG4gICAgICAgIGZpbGVQYXRoICs9ICcudHMnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoICs9ICcuanMnXG4gICAgfVxuICAgIGNvbnN0IGNoYW5nZVRpbWUgPSA8YW55PmF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpXG5cbiAgICBpZihjaGFuZ2VUaW1lID09IGxhc3RTZXR0aW5nc0ltcG9ydCB8fCAhY2hhbmdlVGltZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgXG4gICAgbGFzdFNldHRpbmdzSW1wb3J0ID0gY2hhbmdlVGltZTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgUmVxdWlyZU9uY2UoZmlsZVBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBkYXRhLmRlZmF1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nc0RhdGUoKXtcbiAgICByZXR1cm4gbGFzdFNldHRpbmdzSW1wb3J0XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJbXBvcnRGaWxlIH0gZnJvbSBcIi4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMsIHsgRGlyZW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tIFwiLi9Db21waWxlU3RhdGVcIjtcbmltcG9ydCB7IGlzRmlsZVR5cGUgfSBmcm9tIFwiLi9GaWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPVtdO1xuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNjYW5GaWxlcygpe1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5TdGF0aWMsICcnLCBzdGF0ZSksXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuTG9ncywgJycsIHN0YXRlKVxuICAgIF0pXG4gICAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVidWdTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3Mpe1xuICAgIHJldHVybiBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgYXdhaXQgc2NhbkZpbGVzKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgeyByb3V0aW5nLCBkZXZlbG9wbWVudCB9ID0gRXhwb3J0O1xuICAgIGlmICghcm91dGluZy5zaXRlbWFwKSByZXR1cm47XG5cbiAgICBjb25zdCBzaXRlbWFwID0gcm91dGluZy5zaXRlbWFwID09PSB0cnVlID8ge30gOiByb3V0aW5nLnNpdGVtYXA7XG4gICAgT2JqZWN0LmFzc2lnbihzaXRlbWFwLCB7XG4gICAgICAgIHJ1bGVzOiB0cnVlLFxuICAgICAgICB1cmxTdG9wOiBmYWxzZSxcbiAgICAgICAgZXJyb3JQYWdlczogZmFsc2UsXG4gICAgICAgIHZhbGlkUGF0aDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFnZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICB1cmxzOiAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBmb3IgKGxldCBbdXJsLCB0eXBlXSBvZiBzdGF0ZS5wYWdlcykge1xuXG4gICAgICAgIGlmKHR5cGUgIT0gZ2V0VHlwZXMuU3RhdGljWzJdIHx8ICF1cmwuZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB1cmwgPSAnLycgKyB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmKHBhdGguZXh0bmFtZSh1cmwpID09ICcuc2VydicpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC51cmxTdG9wKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpdGVtYXAucnVsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGF3YWl0IHJvdXRpbmcucnVsZXNbcGF0aF0odXJsKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGVuZHMgPT4gdXJsLmVuZHNXaXRoKCcuJytlbmRzKSkgfHxcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChzdGFydCA9PiB1cmwuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHJvdXRpbmcudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhd2FpdCBmdW5jKHVybCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpdGVtYXAuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlcnJvciBpbiByb3V0aW5nLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gJy8nICsgcm91dGluZy5lcnJvclBhZ2VzW2Vycm9yXS5wYXRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VzLnB1c2godXJsKTtcbiAgICB9XG5cbiAgICBsZXQgd3JpdGUgPSB0cnVlO1xuICAgIGlmIChzaXRlbWFwLmZpbGUpIHtcbiAgICAgICAgY29uc3QgZmlsZUFjdGlvbiA9IGF3YWl0IEltcG9ydEZpbGUoJ1NpdGVtYXAgSW1wb3J0Jywgc2l0ZW1hcC5maWxlLCBnZXRUeXBlcy5TdGF0aWMsIGRldmVsb3BtZW50KTtcbiAgICAgICAgaWYoIWZpbGVBY3Rpb24/LlNpdGVtYXApe1xuICAgICAgICAgICAgZHVtcC53YXJuKCdcXCdTaXRlbWFwXFwnIGZ1bmN0aW9uIG5vdCBmb3VuZCBvbiBmaWxlIC0+ICcrIHNpdGVtYXAuZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3cml0ZSA9IGF3YWl0IGZpbGVBY3Rpb24uU2l0ZW1hcChwYWdlcywgc3RhdGUsIEV4cG9ydCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZih3cml0ZSAmJiBwYWdlcy5sZW5ndGgpe1xuICAgICAgICBjb25zdCBwYXRoID0gd3JpdGUgPT09IHRydWUgPyAnc2l0ZW1hcC50eHQnOiB3cml0ZTtcbiAgICAgICAgc3RhdGUuYWRkRmlsZShwYXRoKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShnZXRUeXBlcy5TdGF0aWNbMF0gKyBwYXRoLCBwYWdlcy5qb2luKCdcXG4nKSk7XG4gICAgfVxufSIsICIvKipcbiAqIEdpdmVuIGEgZmlsZSBuYW1lIGFuZCBhbiBleHRlbnNpb24sIHJldHVybiB0cnVlIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIHRoZSBleHRlbnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZXh0bmFtZSAtIHRoZSBleHRlbnNpb24gdG8gY2hlY2sgZm9yLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5zaW9uSXMobmFtZTogc3RyaW5nLCBleHRuYW1lOiBzdHJpbmcpe1xuICAgIHJldHVybiBuYW1lLmVuZHNXaXRoKCcuJyArIGV4dG5hbWUpO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gZmlsZSB0eXBlcy5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVzIC0gYW4gYXJyYXkgb2YgZmlsZSBleHRlbnNpb25zIHRvIG1hdGNoLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZVR5cGUodHlwZXM6IHN0cmluZ1tdLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICAgIGlmIChleHRlbnNpb25JcyhuYW1lLHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsYXN0IGRvdCBhbmQgZXZlcnl0aGluZyBhZnRlciBpdCBmcm9tIGEgc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byByZW1vdmUgdGhlIGVuZCB0eXBlIGZyb20uXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGhvdXQgdGhlIGxhc3QgY2hhcmFjdGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUmVtb3ZlRW5kVHlwZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn0iLCAiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEZpbGVzIH0gZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGhhbmRlbENvbm5lY3RvclNlcnZpY2UgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgUmVxdWlyZUZpbGUgZnJvbSAnLi9JbXBvcnRGaWxlUnVudGltZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuXG5jb25zdCBFeHBvcnQgPSB7XG4gICAgUGFnZUxvYWRSYW06IHt9LFxuICAgIFBhZ2VSYW06IHRydWVcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSB0eXBlQXJyYXkgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoIHRvIHRoZVxuICogZmlsZS5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgZGljdGlvbmFyeSBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7YW55fSBEYXRhT2JqZWN0IC0gVGhlIGRhdGEgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVQYWdlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBSZXFGaWxlUGF0aCA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcbiAgICBjb25zdCByZXNNb2RlbCA9ICgpID0+IFJlcUZpbGVQYXRoLm1vZGVsKERhdGFPYmplY3QpO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBpZiAoUmVxRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKCFEYXRhT2JqZWN0LmlzRGVidWcpXG4gICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcblxuICAgICAgICBpZiAoUmVxRmlsZVBhdGguZGF0ZSA9PSAtMSkge1xuICAgICAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKFJlcUZpbGVQYXRoLnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWZpbGVFeGlzdHMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICghZXh0bmFtZSkge1xuICAgICAgICBleHRuYW1lID0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgZmlsZVBhdGggKz0gJy4nICsgZXh0bmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFBhdGg6IHN0cmluZztcbiAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKVxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGVQYXRoKTtcbiAgICAgZWxzZVxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIGZpbGVQYXRoKTtcblxuICAgIGlmICghW0Jhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudF0uaW5jbHVkZXMoZXh0bmFtZSkpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0VGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIERhdGFPYmplY3Qud3JpdGUoaW1wb3J0VGV4dCk7XG4gICAgICAgIHJldHVybiBpbXBvcnRUZXh0O1xuICAgIH1cblxuICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKTtcbiAgICBpZiAoIWZpbGVFeGlzdHMpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtjb3B5UGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiAoKSA9PiB7IH0sIGRhdGU6IC0xLCBwYXRoOiBmdWxsUGF0aCB9O1xuICAgICAgICByZXR1cm4gTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGluU3RhdGljUGF0aCA9ICBwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSxmdWxsUGF0aCk7XG4gICAgY29uc3QgU21hbGxQYXRoID0gdHlwZUFycmF5WzJdICsgJy8nICsgaW5TdGF0aWNQYXRoO1xuICAgIGNvbnN0IHJlQnVpbGQgPSBEYXRhT2JqZWN0LmlzRGVidWcgJiYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0eXBlQXJyYXlbMV0gKyAnLycgK2luU3RhdGljUGF0aCArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKFNtYWxsUGF0aCkpO1xuXG4gICAgaWYgKHJlQnVpbGQpXG4gICAgICAgIGF3YWl0IEZhc3RDb21waWxlKGluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBleHRuYW1lICE9IEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpO1xuXG5cbiAgICBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0gJiYgIXJlQnVpbGQpIHtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF1bMF0gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbChEYXRhT2JqZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jID0gYXdhaXQgTG9hZFBhZ2UoU21hbGxQYXRoLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIGlmIChFeHBvcnQuUGFnZVJhbSkge1xuICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdKSB7XG4gICAgICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdWzBdID0gZnVuYztcbiAgICB9XG5cbiAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBmdW5jIH07XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMoRGF0YU9iamVjdCk7XG59XG5cbmNvbnN0IEdsb2JhbFZhciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRGdWxsUGF0aENvbXBpbGUodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIHJldHVybiB0eXBlQXJyYXlbMV0gKyBTcGxpdEluZm9bMV0gKyAnLmNqcyc7XG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIHBhZ2UgdG8gbG9hZC5cbiAqIEBwYXJhbSBleHQgLSBUaGUgZXh0ZW5zaW9uIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlKHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG5cbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIGNvbnN0IExhc3RSZXF1aXJlID0ge307XG5cbiAgICBmdW5jdGlvbiBfcmVxdWlyZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gUmVxdWlyZUZpbGUocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmNsdWRlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nLCBXaXRoT2JqZWN0ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVQYWdlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgeyAuLi5XaXRoT2JqZWN0LCAuLi5EYXRhT2JqZWN0IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF90cmFuc2ZlcihwOiBzdHJpbmcsIHByZXNlcnZlRm9ybTogYm9vbGVhbiwgd2l0aE9iamVjdDogYW55LCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ID0gJyc7XG5cbiAgICAgICAgaWYgKCFwcmVzZXJ2ZUZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3REYXRhID0gRGF0YU9iamVjdC5SZXF1ZXN0LmJvZHkgPyB7fSA6IG51bGw7XG4gICAgICAgICAgICBEYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFPYmplY3QsXG4gICAgICAgICAgICAgICAgUmVxdWVzdDogeyAuLi5EYXRhT2JqZWN0LlJlcXVlc3QsIGZpbGVzOiB7fSwgcXVlcnk6IHt9LCBib2R5OiBwb3N0RGF0YSB9LFxuICAgICAgICAgICAgICAgIFBvc3Q6IHBvc3REYXRhLCBRdWVyeToge30sIEZpbGVzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgRGF0YU9iamVjdCwgcCwgd2l0aE9iamVjdCk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBTcGxpdEluZm9bMV0gKyAnLmNqcycpO1xuICAgIGNvbnN0IHByaXZhdGVfdmFyID0ge307XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShjb21waWxlZFBhdGgpO1xuXG4gICAgICAgIHJldHVybiBNeU1vZHVsZShfcmVxdWlyZSwgX2luY2x1ZGUsIF90cmFuc2ZlciwgcHJpdmF0ZV92YXIsIGhhbmRlbENvbm5lY3RvclNlcnZpY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbGV0IGVycm9yVGV4dDogc3RyaW5nO1xuXG4gICAgICAgIGlmKGlzRGVidWcpe1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBwYXRoIC0+IFwiLCBSZW1vdmVFbmRUeXBlKHVybCksIFwiLT5cIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIHByaW50LmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gSlNQYXJzZXIucHJpbnRFcnJvcihgRXJyb3IgcGF0aDogJHt1cmx9PGJyLz5FcnJvciBtZXNzYWdlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yVGV4dCA9IEpTUGFyc2VyLnByaW50RXJyb3IoYEVycm9yIGNvZGU6ICR7ZS5jb2RlfWApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKERhdGFPYmplY3Q6IGFueSkgPT4ge1xuICAgICAgICAgICAgRGF0YU9iamVjdC5SZXF1ZXN0LmVycm9yID0gZTtcbiAgICAgICAgICAgIERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCArPSBlcnJvclRleHQ7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbi8qKlxuICogSXQgdGFrZXMgYSBmdW5jdGlvbiB0aGF0IHByZXBhcmUgYSBwYWdlLCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgbG9hZHMgYSBwYWdlXG4gKiBAcGFyYW0gTG9hZFBhZ2VGdW5jIC0gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGluIGEgcGFnZSB0byBleGVjdXRlIG9uXG4gKiBAcGFyYW0ge3N0cmluZ30gcnVuX3NjcmlwdF9uYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjcmlwdCB0byBydW4uXG4gKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKi9cblxuZnVuY3Rpb24gQnVpbGRQYWdlKExvYWRQYWdlRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiB2b2lkLCBydW5fc2NyaXB0X25hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IFBhZ2VWYXIgPSB7fTtcblxuICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKFJlc3BvbnNlOiBSZXNwb25zZSwgUmVxdWVzdDogUmVxdWVzdCwgUG9zdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IG51bGwsIFF1ZXJ5OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBDb29raWVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBTZXNzaW9uOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBGaWxlczogRmlsZXMsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgb3V0X3J1bl9zY3JpcHQgPSB7IHRleHQ6ICcnIH07XG5cbiAgICAgICAgZnVuY3Rpb24gVG9TdHJpbmdJbmZvKHN0cjogYW55KSB7XG4gICAgICAgICAgICBjb25zdCBhc1N0cmluZyA9IHN0cj8udG9TdHJpbmc/LigpO1xuICAgICAgICAgICAgaWYgKGFzU3RyaW5nID09IG51bGwgfHwgYXNTdHJpbmcuc3RhcnRzV2l0aCgnW29iamVjdCBPYmplY3RdJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RyLCBudWxsLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhc1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJlc3BvbnNlKHRleHQ6IGFueSkge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCA9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQgPSAnJykge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGVTYWZlKHN0ciA9ICcnKSB7XG4gICAgICAgICAgICBzdHIgPSBUb1N0cmluZ0luZm8oc3RyKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIHN0cikge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyYjJyArIGkuY2hhckNvZGVBdCgwKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVjaG8oYXJyOiBzdHJpbmdbXSwgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIHdyaXRlU2FmZShwYXJhbXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFyci5hdCgtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVkaXJlY3RQYXRoOiBhbnkgPSBmYWxzZTtcblxuICAgICAgICBSZXNwb25zZS5yZWRpcmVjdCA9IChwYXRoOiBzdHJpbmcsIHN0YXR1cz86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0gU3RyaW5nKHBhdGgpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzKHN0YXR1cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBSZXNwb25zZTtcbiAgICAgICAgfTtcblxuICAgICAgICAoPGFueT5SZXNwb25zZSkucmVsb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QoUmVxdWVzdC51cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VuZEZpbGUoZmlsZVBhdGgsIGRlbGV0ZUFmdGVyID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IHsgZmlsZTogZmlsZVBhdGgsIGRlbGV0ZUFmdGVyIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBEYXRhU2VuZCA9IHtcbiAgICAgICAgICAgIHNlbmRGaWxlLFxuICAgICAgICAgICAgd3JpdGVTYWZlLFxuICAgICAgICAgICAgd3JpdGUsXG4gICAgICAgICAgICBlY2hvLFxuICAgICAgICAgICAgc2V0UmVzcG9uc2UsXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdCxcbiAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFBvc3QsXG4gICAgICAgICAgICBRdWVyeSxcbiAgICAgICAgICAgIFNlc3Npb24sXG4gICAgICAgICAgICBGaWxlcyxcbiAgICAgICAgICAgIENvb2tpZXMsXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgUGFnZVZhcixcbiAgICAgICAgICAgIEdsb2JhbFZhcixcbiAgICAgICAgICAgIGNvZGViYXNlOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgTG9hZFBhZ2VGdW5jKERhdGFTZW5kKTtcblxuICAgICAgICByZXR1cm4geyBvdXRfcnVuX3NjcmlwdDogb3V0X3J1bl9zY3JpcHQudGV4dCwgcmVkaXJlY3RQYXRoIH1cbiAgICB9KVxufVxuXG5leHBvcnQgeyBMb2FkUGFnZSwgQnVpbGRQYWdlLCBnZXRGdWxsUGF0aENvbXBpbGUsIEV4cG9ydCwgU3BsaXRGaXJzdCB9O1xuIiwgImltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEltcG9ydEZpbGUsIEFkZEV4dGVuc2lvbiB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcblxudHlwZSBSZXF1aXJlRmlsZXMgPSB7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgc3RhdHVzPzogbnVtYmVyXG4gICAgbW9kZWw6IGFueVxuICAgIGRlcGVuZGVuY2llcz86IFN0cmluZ0FueU1hcFxuICAgIHN0YXRpYz86IGJvb2xlYW5cbn1cblxuY29uc3QgQ2FjaGVSZXF1aXJlRmlsZXMgPSB7fTtcblxuLyoqXG4gKiBJdCBtYWtlcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gZGVwZW5kZW5jaWVzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgYXJyYXkgb2YgYmFzZSBwYXRoc1xuICogQHBhcmFtIFtiYXNlUGF0aF0gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGNvbXBpbGVkLlxuICogQHBhcmFtIGNhY2hlIC0gQSBjYWNoZSBvZiB0aGUgbGFzdCB0aW1lIGEgZmlsZSB3YXMgbW9kaWZpZWQuXG4gKiBAcmV0dXJucyBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBTdHJpbmdBbnlNYXAsIHR5cGVBcnJheTogc3RyaW5nW10sIGJhc2VQYXRoID0gJycsIGNhY2hlID0ge30pIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNYXA6IFN0cmluZ0FueU1hcCA9IHt9O1xuICAgIGNvbnN0IHByb21pc2VBbGwgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgcHJvbWlzZUFsbC5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGggPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgICAgIGlmICghY2FjaGVbYmFzZVBhdGhdKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlUGF0aF0gPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBiYXNlUGF0aCwgJ210aW1lTXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbJ3RoaXNGaWxlJ10gPSBjYWNoZVtiYXNlUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFtmaWxlUGF0aF0gPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKDxhbnk+dmFsdWUsIHR5cGVBcnJheSwgZmlsZVBhdGgsIGNhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICApKCkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VBbGwpO1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNYXA7XG59XG5cbi8qKlxuICogSWYgdGhlIG9sZCBkZXBlbmRlbmNpZXMgYW5kIHRoZSBuZXcgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZSwgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmN5IG1hcC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkZXBlbmRlbmN5IHRyZWVzLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIHRoZSBtb2R1bGVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBbcGFyZW50XSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJlbnQgbW9kdWxlLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLiBFYWNoIHN0cmluZyByZXByZXNlbnRzIGEgY2hhbmdlIGluIHRoZSBkZXBlbmRlbmN5XG4gKiB0cmVlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VBcnJheShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCwgcGFyZW50ID0gJycpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgY2hhbmdlQXJyYXkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW5ld0RlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGdldENoYW5nZUFycmF5KG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0sIG5hbWUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaCguLi5jaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZUFycmF5O1xufVxuXG4vKipcbiAqIEl0IGltcG9ydHMgYSBmaWxlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIHBhdGhzIHR5cGVzLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBtYXAgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuXG4gKiBAcmV0dXJucyBUaGUgbW9kZWwgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogUmVxdWlyZUZpbGVzIH0sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBSZXFGaWxlID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IG51bWJlciwgbmV3RGVwczogU3RyaW5nQW55TWFwO1xuICAgIGlmIChSZXFGaWxlKSB7XG5cbiAgICAgICAgaWYgKCFpc0RlYnVnIHx8IGlzRGVidWcgJiYgKFJlcUZpbGUuc3RhdHVzID09IC0xKSlcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBSZXFGaWxlLnBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG5cbiAgICAgICAgICAgIG5ld0RlcHMgPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpO1xuXG4gICAgICAgICAgICBpZiAoY29tcGFyZURlcGVuZGVuY2llc1NhbWUoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoUmVxRmlsZS5zdGF0dXMgPT0gMClcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IHN0YXRpY19tb2R1bGVzID0gZmFsc2U7XG5cbiAgICBpZiAoIVJlcUZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJylcbiAgICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHBhdGgucmVsYXRpdmUodHlwZUFycmF5WzBdLCBfX2Rpcm5hbWUpLCBmaWxlUGF0aCk7XG5cbiAgICAgICAgZWxzZSBpZiAoZmlsZVBhdGhbMF0gIT0gJy8nKVxuICAgICAgICAgICAgc3RhdGljX21vZHVsZXMgPSB0cnVlO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDEpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggPSBSZXFGaWxlLnBhdGg7XG4gICAgICAgIHN0YXRpY19tb2R1bGVzID0gUmVxRmlsZS5zdGF0aWM7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRpY19tb2R1bGVzKVxuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBhd2FpdCBBbGlhc09yUGFja2FnZShjb3B5UGF0aCksIHN0YXR1czogLTEsIHN0YXRpYzogdHJ1ZSwgcGF0aDogZmlsZVBhdGggfTtcbiAgICBlbHNlIHtcbiAgICAgICAgLy8gYWRkIHNlcnYuanMgb3Igc2Vydi50cyBpZiBuZWVkZWRcbiAgICAgICAgZmlsZVBhdGggPSBBZGRFeHRlbnNpb24oZmlsZVBhdGgpO1xuXG4gICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gdHlwZUFycmF5WzBdICsgZmlsZVBhdGg7XG4gICAgICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIDApO1xuXG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBoYXZlTW9kZWwgPSBDYWNoZVJlcXVpcmVGaWxlc1tmaWxlUGF0aF07XG4gICAgICAgICAgICBpZiAoaGF2ZU1vZGVsICYmIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMgPSBuZXdEZXBzID8/IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgdHlwZUFycmF5KSkpXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0gaGF2ZU1vZGVsO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3RGVwcyA9IG5ld0RlcHMgPz8ge307XG5cbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBhd2FpdCBJbXBvcnRGaWxlKF9fZmlsZW5hbWUsIGZpbGVQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcsIG5ld0RlcHMsIGhhdmVNb2RlbCAmJiBnZXRDaGFuZ2VBcnJheShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzKSksIGRlcGVuZGVuY2llczogbmV3RGVwcywgcGF0aDogZmlsZVBhdGggfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDoge30sIHN0YXR1czogMCwgcGF0aDogZmlsZVBhdGggfTtcbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7ZmlsZVBhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtfX2ZpbGVuYW1lfSdgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYnVpbHRNb2RlbCA9IExhc3RSZXF1aXJlW2NvcHlQYXRoXTtcbiAgICBDYWNoZVJlcXVpcmVGaWxlc1tidWlsdE1vZGVsLnBhdGhdID0gYnVpbHRNb2RlbDtcblxuICAgIHJldHVybiBidWlsdE1vZGVsLm1vZGVsO1xufSIsICJpbXBvcnQgUmVxdWlyZUZpbGUgZnJvbSAnLi9JbXBvcnRGaWxlUnVudGltZSc7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCB0cmltVHlwZSwgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcblxuLy8gLS0gc3RhcnQgb2YgZmV0Y2ggZmlsZSArIGNhY2hlIC0tXG5cbnR5cGUgYXBpSW5mbyA9IHtcbiAgICBwYXRoU3BsaXQ6IG51bWJlcixcbiAgICBkZXBzTWFwOiB7IFtrZXk6IHN0cmluZ106IGFueSB9XG59XG5cbmNvbnN0IGFwaVN0YXRpY01hcDogeyBba2V5OiBzdHJpbmddOiBhcGlJbmZvIH0gPSB7fTtcblxuLyoqXG4gKiBHaXZlbiBhIHVybCwgcmV0dXJuIHRoZSBzdGF0aWMgcGF0aCBhbmQgZGF0YSBpbmZvIGlmIHRoZSB1cmwgaXMgaW4gdGhlIHN0YXRpYyBtYXBcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgdGhlIHVzZXIgaXMgcmVxdWVzdGluZy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXRoU3BsaXQgLSB0aGUgbnVtYmVyIG9mIHNsYXNoZXMgaW4gdGhlIHVybC5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6XG4gKi9cbmZ1bmN0aW9uIGdldEFwaUZyb21NYXAodXJsOiBzdHJpbmcsIHBhdGhTcGxpdDogbnVtYmVyKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFwaVN0YXRpY01hcCk7XG4gICAgZm9yIChjb25zdCBpIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgZSA9IGFwaVN0YXRpY01hcFtpXTtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpICYmIGUucGF0aFNwbGl0ID09IHBhdGhTcGxpdClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdGljUGF0aDogaSxcbiAgICAgICAgICAgICAgICBkYXRhSW5mbzogZVxuICAgICAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogRmluZCB0aGUgQVBJIGZpbGUgZm9yIGEgZ2l2ZW4gVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiB0aGUgQVBJLlxuICogQHJldHVybnMgVGhlIHBhdGggdG8gdGhlIEFQSSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBmaW5kQXBpUGF0aCh1cmw6IHN0cmluZykge1xuXG4gICAgd2hpbGUgKHVybC5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQYXRoID0gcGF0aC5qb2luKGdldFR5cGVzLlN0YXRpY1swXSwgdXJsICsgJy5hcGknKTtcbiAgICAgICAgY29uc3QgbWFrZVByb21pc2UgPSBhc3luYyAodHlwZTogc3RyaW5nKSA9PiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoc3RhcnRQYXRoICsgJy4nICsgdHlwZSkgJiYgdHlwZSk7XG5cbiAgICAgICAgY29uc3QgZmlsZVR5cGUgPSAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgbWFrZVByb21pc2UoJ3RzJyksXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgnanMnKVxuICAgICAgICBdKSkuZmlsdGVyKHggPT4geCkuc2hpZnQoKTtcblxuICAgICAgICBpZiAoZmlsZVR5cGUpXG4gICAgICAgICAgICByZXR1cm4gdXJsICsgJy5hcGkuJyArIGZpbGVUeXBlO1xuXG4gICAgICAgIHVybCA9IEN1dFRoZUxhc3QoJy8nLCB1cmwpO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHBhdGhTcGxpdCA9IHVybC5zcGxpdCgnLycpLmxlbmd0aDtcbiAgICBsZXQgeyBzdGF0aWNQYXRoLCBkYXRhSW5mbyB9ID0gZ2V0QXBpRnJvbU1hcCh1cmwsIHBhdGhTcGxpdCk7XG5cbiAgICBpZiAoIWRhdGFJbmZvKSB7XG4gICAgICAgIHN0YXRpY1BhdGggPSBhd2FpdCBmaW5kQXBpUGF0aCh1cmwpO1xuXG4gICAgICAgIGlmIChzdGF0aWNQYXRoKSB7XG4gICAgICAgICAgICBkYXRhSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBwYXRoU3BsaXQsXG4gICAgICAgICAgICAgICAgZGVwc01hcDoge31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBpU3RhdGljTWFwW3N0YXRpY1BhdGhdID0gZGF0YUluZm87XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YUluZm8pIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IE1ha2VDYWxsKFxuICAgICAgICAgICAgYXdhaXQgUmVxdWlyZUZpbGUoJy8nICsgc3RhdGljUGF0aCwgJ2FwaS1jYWxsJywgJycsIGdldFR5cGVzLlN0YXRpYywgZGF0YUluZm8uZGVwc01hcCwgaXNEZWJ1ZyksXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICB1cmwuc3Vic3RyaW5nKHN0YXRpY1BhdGgubGVuZ3RoIC0gNiksXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgbmV4dFByYXNlXG4gICAgICAgICk7XG4gICAgfVxufVxuLy8gLS0gZW5kIG9mIGZldGNoIGZpbGUgLS1cbmNvbnN0IGJhbldvcmRzID0gWyd2YWxpZGF0ZVVSTCcsICd2YWxpZGF0ZUZ1bmMnLCAnZnVuYycsICdkZWZpbmUnLCAuLi5odHRwLk1FVEhPRFNdO1xuLyoqXG4gKiBGaW5kIHRoZSBCZXN0IFBhdGhcbiAqL1xuZnVuY3Rpb24gZmluZEJlc3RVcmxPYmplY3Qob2JqOiBhbnksIHVybEZyb206IHN0cmluZykge1xuICAgIGxldCBtYXhMZW5ndGggPSAwLCB1cmwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBpbiBvYmopIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaS5sZW5ndGg7XG4gICAgICAgIGlmIChtYXhMZW5ndGggPCBsZW5ndGggJiYgdXJsRnJvbS5zdGFydHNXaXRoKGkpICYmICFiYW5Xb3Jkcy5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgICAgbWF4TGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICAgICAgdXJsID0gaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogUGFyc2UgQW5kIFZhbGlkYXRlIFVSTFxuICovXG5hc3luYyBmdW5jdGlvbiBwYXJzZVVSTERhdGEodmFsaWRhdGU6IGFueSwgdmFsdWU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCBtYWtlTWFzc2FnZTogKGU6IGFueSkgPT4gc3RyaW5nKSB7XG4gICAgbGV0IHB1c2hEYXRhID0gdmFsdWUsIHJlc0RhdGEgPSB0cnVlLCBlcnJvcjogc3RyaW5nO1xuXG4gICAgc3dpdGNoICh2YWxpZGF0ZSkge1xuICAgICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgY2FzZSBwYXJzZUZsb2F0OlxuICAgICAgICBjYXNlIHBhcnNlSW50OlxuICAgICAgICAgICAgcHVzaERhdGEgPSAoPGFueT52YWxpZGF0ZSkodmFsdWUpO1xuICAgICAgICAgICAgcmVzRGF0YSA9ICFpc05hTihwdXNoRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBCb29sZWFuOlxuICAgICAgICAgICAgcHVzaERhdGEgPSB2YWx1ZSAhPSAnZmFsc2UnO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcmVzRGF0YSA9IHZhbHVlID09ICd0cnVlJyB8fCB2YWx1ZSA9PSAnZmFsc2UnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2FueSc6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbGlkYXRlKSlcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUuaW5jbHVkZXModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWtlVmFsaWQgPSBhd2FpdCB2YWxpZGF0ZSh2YWx1ZSwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWFrZVZhbGlkICYmIHR5cGVvZiBtYWtlVmFsaWQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQudmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoRGF0YSA9IG1ha2VWYWxpZC5wYXJzZSA/PyB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3IsIGZpZWxkIC0gJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodmFsaWRhdGUgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLnRlc3QodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghcmVzRGF0YSlcbiAgICAgICAgZXJyb3IgPSAnVmFsaWRhdGlvbiBlcnJvciB3aXRoIHZhbHVlIFwiJyArIHZhbHVlICsgJ1wiJztcblxuICAgIHJldHVybiBbZXJyb3IsIHB1c2hEYXRhXTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyB0aGUgVVJMIGRhdGEgYW5kIHBhcnNlcyBpdCBpbnRvIGFuIG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBvYmogLSB0aGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIFVSTCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIFRoZSBVUkwgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0ge2FueX0gZGVmaW5lT2JqZWN0IC0gQWxsIHRoZSBkZWZpbml0aW9ucyB0aGF0IGhhcyBiZWVuIGZvdW5kXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0gbWFrZU1hc3NhZ2UgLSBDcmVhdGUgYW4gZXJyb3IgbWVzc2FnZVxuICogQHJldHVybnMgQSBzdHJpbmcgb3IgYW4gb2JqZWN0IHdpdGggYW4gZXJyb3IgcHJvcGVydHkuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZWZpbml0aW9uKG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGRlZmluZU9iamVjdDogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBpZiAoIW9iai5kZWZpbmUpXG4gICAgICAgIHJldHVybiB1cmxGcm9tO1xuXG4gICAgY29uc3QgdmFsaWRhdGVGdW5jID0gb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG4gICAgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmMgPSBudWxsO1xuICAgIGRlbGV0ZSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvYmouZGVmaW5lKSB7XG4gICAgICAgIGNvbnN0IFtkYXRhU2xhc2gsIG5leHRVcmxGcm9tXSA9IFNwbGl0Rmlyc3QoJy8nLCB1cmxGcm9tKTtcbiAgICAgICAgdXJsRnJvbSA9IG5leHRVcmxGcm9tO1xuXG4gICAgICAgIGNvbnN0IFtlcnJvciwgbmV3RGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEob2JqLmRlZmluZVtuYW1lXSwgZGF0YVNsYXNoLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgIGlmKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHtlcnJvcn07XG4gICAgICAgIFxuICAgICAgICBkZWZpbmVPYmplY3RbbmFtZV0gPSBuZXdEYXRhO1xuICAgIH1cblxuICAgIGlmICh2YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IHZhbGlkYXRlRnVuYyhkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnID8gdmFsaWRhdGU6ICdFcnJvciB2YWxpZGF0aW5nIFVSTCd9O1xuICAgIH1cblxuICAgIHJldHVybiB1cmxGcm9tIHx8ICcnO1xufVxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gd2lsbCBwYXJzZSB0aGUgdXJsIGFuZCBmaW5kIHRoZSBiZXN0IG1hdGNoIGZvciB0aGUgdXJsXG4gKiBAcGFyYW0ge2FueX0gZmlsZU1vZHVsZSAtIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgbWV0aG9kIHRoYXQgeW91IHdhbnQgdG8gY2FsbC5cbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gdGhlIHVybCB0aGF0IHRoZSB1c2VyIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gKCkgPT4gUHJvbWlzZTxhbnk+XG4gKiBAcmV0dXJucyBhIGJvb2xlYW4gdmFsdWUuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUsIHRoZSByZXF1ZXN0IGlzIHByb2Nlc3NlZC4gSWYgdGhlIGZ1bmN0aW9uXG4gKiByZXR1cm5zIGZhbHNlLCB0aGUgcmVxdWVzdCBpcyBub3QgcHJvY2Vzc2VkLlxuICovXG5hc3luYyBmdW5jdGlvbiBNYWtlQ2FsbChmaWxlTW9kdWxlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsbG93RXJyb3JJbmZvID0gIUdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSAmJiBpc0RlYnVnLCBtYWtlTWFzc2FnZSA9IChlOiBhbnkpID0+IChpc0RlYnVnID8gcHJpbnQuZXJyb3IoZSkgOiBudWxsKSArIChhbGxvd0Vycm9ySW5mbyA/IGAsIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWAgOiAnJyk7XG4gICAgY29uc3QgbWV0aG9kID0gUmVxdWVzdC5tZXRob2Q7XG4gICAgbGV0IG1ldGhvZE9iaiA9IGZpbGVNb2R1bGVbbWV0aG9kXSB8fCBmaWxlTW9kdWxlLmRlZmF1bHRbbWV0aG9kXTsgLy9Mb2FkaW5nIHRoZSBtb2R1bGUgYnkgbWV0aG9kXG4gICAgbGV0IGhhdmVNZXRob2QgPSB0cnVlO1xuXG4gICAgaWYoIW1ldGhvZE9iail7XG4gICAgICAgIGhhdmVNZXRob2QgPSBmYWxzZTtcbiAgICAgICAgbWV0aG9kT2JqID0gZmlsZU1vZHVsZS5kZWZhdWx0IHx8IGZpbGVNb2R1bGU7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZU1ldGhvZCA9IG1ldGhvZE9iajtcblxuICAgIGNvbnN0IGRlZmluZU9iamVjdCA9IHt9O1xuXG4gICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpOyAvLyByb290IGxldmVsIGRlZmluaXRpb25cbiAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcblxuICAgIGxldCBuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pO1xuXG4gICAgLy9wYXJzZSB0aGUgdXJsIHBhdGhcbiAgICBmb3IobGV0IGkgPSAwOyBpPCAyOyBpKyspe1xuICAgICAgICB3aGlsZSAoKG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSkpKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG4gICAgICAgICAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgICAgICAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuICAgIFxuICAgICAgICAgICAgdXJsRnJvbSA9IHRyaW1UeXBlKCcvJywgdXJsRnJvbS5zdWJzdHJpbmcobmVzdGVkVVJMLmxlbmd0aCkpO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW25lc3RlZFVSTF07XG4gICAgICAgIH1cblxuICAgICAgICBpZighaGF2ZU1ldGhvZCl7IC8vIGNoZWNrIGlmIHRoYXQgYSBtZXRob2RcbiAgICAgICAgICAgIGhhdmVNZXRob2QgPSB0cnVlO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW21ldGhvZF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXRob2RPYmogPSBtZXRob2RPYmo/LmZ1bmMgJiYgbWV0aG9kT2JqIHx8IGJhc2VNZXRob2Q7IC8vIGlmIHRoZXJlIGlzIGFuICdhbnknIG1ldGhvZFxuXG5cbiAgICBpZiAoIW1ldGhvZE9iaj8uZnVuYylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgbGVmdERhdGEgPSB1cmxGcm9tLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgdXJsRGF0YSA9IFtdO1xuXG5cbiAgICBsZXQgZXJyb3I6IHN0cmluZztcbiAgICBpZiAobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCB2YWxpZGF0ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSkge1xuICAgICAgICAgICAgY29uc3QgW2Vycm9yVVJMLCBwdXNoRGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEodmFsaWRhdGUsIGxlZnREYXRhW2luZGV4XSwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yVVJMKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSA8c3RyaW5nPmVycm9yVVJMO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cmxEYXRhLnB1c2gocHVzaERhdGEpO1xuICAgICAgICB9XG4gICAgfSBlbHNlXG4gICAgICAgIHVybERhdGEucHVzaCguLi5sZWZ0RGF0YSk7XG5cbiAgICBpZiAoIWVycm9yICYmIG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMobGVmdERhdGEsIFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIGVycm9yID0gdmFsaWRhdGU7XG4gICAgICAgIGVsc2UgaWYgKCF2YWxpZGF0ZSlcbiAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJztcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgZXJyb3IgfSk7XG5cbiAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBsZXQgYXBpUmVzcG9uc2U6IGFueSwgbmV3UmVzcG9uc2U6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBhcGlSZXNwb25zZSA9IGF3YWl0IG1ldGhvZE9iai5mdW5jKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhLCBkZWZpbmVPYmplY3QsIGxlZnREYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChhbGxvd0Vycm9ySW5mbylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogZS5tZXNzYWdlIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiAnNTAwIC0gSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYXBpUmVzcG9uc2UgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgdGV4dDogYXBpUmVzcG9uc2UgfTtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0gYXBpUmVzcG9uc2UgfHwgbmV3UmVzcG9uc2U7XG5cbiAgICBmaW5hbFN0ZXAoKTsgIC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgIGlmIChuZXdSZXNwb25zZSAhPSBudWxsKVxuICAgICAgICBSZXNwb25zZS5qc29uKG5ld1Jlc3BvbnNlKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgRmFzdENvbXBpbGUgYXMgRmFzdENvbXBpbGUgfSBmcm9tICcuL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IEdldEZpbGUgYXMgR2V0U3RhdGljRmlsZSwgc2VydmVyQnVpbGQgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0ICogYXMgRnVuY1NjcmlwdCBmcm9tICcuL0Z1bmN0aW9uU2NyaXB0JztcbmltcG9ydCBNYWtlQXBpQ2FsbCBmcm9tICcuL0FwaUNhbGwnO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5jb25zdCB7IEV4cG9ydCB9ID0gRnVuY1NjcmlwdDtcblxuZXhwb3J0IGludGVyZmFjZSBFcnJvclBhZ2VzIHtcbiAgICBub3RGb3VuZD86IHtcbiAgICAgICAgcGF0aDogc3RyaW5nLFxuICAgICAgICBjb2RlPzogbnVtYmVyXG4gICAgfSxcbiAgICBzZXJ2ZXJFcnJvcj86IHtcbiAgICAgICAgcGF0aDogc3RyaW5nLFxuICAgICAgICBjb2RlPzogbnVtYmVyXG4gICAgfVxufVxuXG5pbnRlcmZhY2UgR2V0UGFnZXNTZXR0aW5ncyB7XG4gICAgQ2FjaGVEYXlzOiBudW1iZXIsXG4gICAgRGV2TW9kZTogYm9vbGVhbixcbiAgICBDb29raWVTZXR0aW5ncz86IGFueSxcbiAgICBDb29raWVzPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgQ29va2llRW5jcnlwdGVyPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgU2Vzc2lvblN0b3JlPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgRXJyb3JQYWdlczogRXJyb3JQYWdlc1xufVxuXG5jb25zdCBTZXR0aW5nczogR2V0UGFnZXNTZXR0aW5ncyA9IHtcbiAgICBDYWNoZURheXM6IDEsXG4gICAgRGV2TW9kZTogdHJ1ZSxcbiAgICBFcnJvclBhZ2VzOiB7fVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZVRvUmFtKHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bmNTY3JpcHQuZ2V0RnVsbFBhdGhDb21waWxlKHVybCkpKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdID0gW107XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdID0gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZSh1cmwsIGlzRGVidWcpO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdLCB1cmwpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZEFsbFBhZ2VzVG9SYW0oaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGZvciAoY29uc3QgaSBpbiBwYWdlRGVwcy5zdG9yZSkge1xuICAgICAgICBpZiAoIUV4dGVuc2lvbkluQXJyYXkoaSwgPGFueT5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5KSlcbiAgICAgICAgICAgIGF3YWl0IExvYWRQYWdlVG9SYW0oaSwgaXNEZWJ1Zyk7XG5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIENsZWFyQWxsUGFnZXNGcm9tUmFtKCkge1xuICAgIGZvciAoY29uc3QgaSBpbiBFeHBvcnQuUGFnZUxvYWRSYW0pIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBkZWxldGUgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gRXh0ZW5zaW9uSW5BcnJheShmaWxlUGF0aDogc3RyaW5nLCAuLi5hcnJheXM6IHN0cmluZ1tdKSB7XG4gICAgZmlsZVBhdGggPSBmaWxlUGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgIGZvciAoY29uc3QgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheSkge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoLnN1YnN0cmluZyhmaWxlUGF0aC5sZW5ndGggLSBpLmxlbmd0aCAtIDEpID09ICcuJyArIGkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIEdldEVycm9yUGFnZShjb2RlOiBudW1iZXIsIExvY1NldHRpbmdzOiAnbm90Rm91bmQnIHwgJ3NlcnZlckVycm9yJykge1xuICAgIGxldCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZztcbiAgICBpZiAoU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10pIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljO1xuICAgICAgICB1cmwgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5wYXRoO1xuICAgICAgICBjb2RlID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10uY29kZSA/PyBjb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLkxvZ3M7XG4gICAgICAgIHVybCA9ICdlJyArIGNvZGU7XG4gICAgfVxuICAgIHJldHVybiB7IHVybCwgYXJyYXlUeXBlLCBjb2RlIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VCYXNpY0luZm8oUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBjb2RlOiBudW1iZXIpIHtcbiAgICAvL2ZpcnN0IHN0ZXAgLSBwYXJzZSBpbmZvXG4gICAgaWYgKFJlcXVlc3QubWV0aG9kID09IFwiUE9TVFwiKSB7XG4gICAgICAgIGlmICghUmVxdWVzdC5ib2R5IHx8ICFPYmplY3Qua2V5cyhSZXF1ZXN0LmJvZHkpLmxlbmd0aClcbiAgICAgICAgICAgIFJlcXVlc3QuYm9keSA9IFJlcXVlc3QuZmllbGRzIHx8IHt9O1xuXG4gICAgfSBlbHNlXG4gICAgICAgIFJlcXVlc3QuYm9keSA9IGZhbHNlO1xuXG5cbiAgICBpZiAoUmVxdWVzdC5jbG9zZWQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVzKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLlNlc3Npb25TdG9yZShSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuXG4gICAgUmVxdWVzdC5zaWduZWRDb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzIHx8IHt9O1xuICAgIFJlcXVlc3QuZmlsZXMgPSBSZXF1ZXN0LmZpbGVzIHx8IHt9O1xuXG4gICAgY29uc3QgQ29weUNvb2tpZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llcykpO1xuXG4gICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMTtcblxuICAgIC8vc2Vjb25kIHN0ZXBcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAxKVxuICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IGNvZGU7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5zaWduZWRDb29raWVzKSB7Ly91cGRhdGUgY29va2llc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gJ29iamVjdCcgJiYgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9IENvcHlDb29raWVzW2ldIHx8IEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSkgIT0gSlNPTi5zdHJpbmdpZnkoQ29weUNvb2tpZXNbaV0pKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNvb2tpZShpLCBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0sIFNldHRpbmdzLkNvb2tpZVNldHRpbmdzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIENvcHlDb29raWVzKSB7Ly9kZWxldGUgbm90IGV4aXRzIGNvb2tpZXNcbiAgICAgICAgICAgIGlmIChSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jbGVhckNvb2tpZShpKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuXG4vL2ZvciBmaW5hbCBzdGVwXG5mdW5jdGlvbiBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdDogUmVxdWVzdCB8IGFueSkge1xuICAgIGlmICghUmVxdWVzdC5maWxlcykgLy9kZWxldGUgZmlsZXNcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBhcnJQYXRoID0gW11cblxuICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LmZpbGVzKSB7XG5cbiAgICAgICAgY29uc3QgZSA9IFJlcXVlc3QuZmlsZXNbaV07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgaW4gZSkge1xuICAgICAgICAgICAgICAgIGFyclBhdGgucHVzaChlW2FdLmZpbGVwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBhcnJQYXRoLnB1c2goZS5maWxlcGF0aCk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyUGF0aDtcbn1cblxuLy9maW5hbCBzdGVwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVSZXF1ZXN0RmlsZXMoYXJyYXk6IHN0cmluZ1tdKSB7XG4gICAgZm9yIChjb25zdCBlIGluIGFycmF5KVxuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGlzVVJMUGF0aEFGaWxlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIHVybDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBpZiAoY29kZSA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgZnVsbFBhZ2VVcmwgPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyB1cmw7XG4gICAgICAgIC8vY2hlY2sgdGhhdCBpcyBub3Qgc2VydmVyIGZpbGVcbiAgICAgICAgaWYgKGF3YWl0IHNlcnZlckJ1aWxkKFJlcXVlc3QsIFNldHRpbmdzLkRldk1vZGUsIHVybCkgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKVxuICAgICAgICAgICAgcmV0dXJuIGZ1bGxQYWdlVXJsO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRMb2FkUGFnZShzbWFsbFBhdGg6IHN0cmluZywgZmlyc3RGdW5jPzogYW55KSB7XG4gICAgY29uc3QgcGFnZUFycmF5ID0gW2ZpcnN0RnVuYyA/PyBhd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHNtYWxsUGF0aCwgU2V0dGluZ3MuRGV2TW9kZSldO1xuXG4gICAgcGFnZUFycmF5WzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UocGFnZUFycmF5WzBdLCBzbWFsbFBhdGgpO1xuXG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSA9IHBhZ2VBcnJheTtcblxuICAgIHJldHVybiBwYWdlQXJyYXlbMV07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGxvYWQgdGhlIGR5bmFtaWMgcGFnZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gVGhlIGFycmF5IG9mIHR5cGVzIHRoYXQgdGhlIHBhZ2UgaXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbFBhZ2VVcmwgLSBUaGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNtYWxsUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlIGZpbGUuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFRoZSBzdGF0dXMgY29kZSBvZiB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIFRoZSBEeW5hbWljRnVuYyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byBnZW5lcmF0ZSB0aGUgcGFnZS5cbiAqIFRoZSBjb2RlIGlzIHRoZSBzdGF0dXMgY29kZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBUaGUgZnVsbFBhZ2VVcmwgaXMgdGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGNvbnN0IGluU3RhdGljID0gdXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICBjb25zdCBzbWFsbFBhdGggPSBhcnJheVR5cGVbMl0gKyAnLycgKyBpblN0YXRpYztcbiAgICBsZXQgZnVsbFBhZ2VVcmwgPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aDtcblxuICAgIGxldCBEeW5hbWljRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiBhbnk7XG4gICAgaWYgKFNldHRpbmdzLkRldk1vZGUgJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKSB7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShhcnJheVR5cGVbMV0gKyBpblN0YXRpYyArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHNtYWxsUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEZhc3RDb21waWxlKHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIGFycmF5VHlwZSk7XG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMV0pXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgsIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMF0pO1xuXG4gICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzFdKVxuICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG4gICAgZWxzZSBpZiAoIUV4cG9ydC5QYWdlUmFtICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCwgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlswXSk7XG5cbiAgICBlbHNlIGlmIChhcnJheVR5cGUgIT0gZ2V0VHlwZXMuTG9ncykge1xuICAgICAgICBjb25zdCB7IGFycmF5VHlwZSwgY29kZSwgdXJsIH0gPSBHZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcbiAgICAgICAgcmV0dXJuIEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBjb2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBEeW5hbWljRnVuYyxcbiAgICAgICAgY29kZSxcbiAgICAgICAgZnVsbFBhZ2VVcmxcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIE1ha2VQYWdlUmVzcG9uc2UoRHluYW1pY1Jlc3BvbnNlOiBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSkge1xuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoPy5maWxlKSB7XG4gICAgICAgIFJlc3BvbnNlLnNlbmRGaWxlKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBSZXNwb25zZS5vbignZmluaXNoJywgcmVzKSk7XG4gICAgfSBlbHNlIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoKSB7XG4gICAgICAgIFJlc3BvbnNlLndyaXRlSGVhZCgzMDIsIHsgTG9jYXRpb246IER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGggfSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IFJlc1BhZ2UgPSBEeW5hbWljUmVzcG9uc2Uub3V0X3J1bl9zY3JpcHQudHJpbSgpO1xuICAgICAgICBpZiAoUmVzUGFnZSkge1xuICAgICAgICAgICAgUmVzcG9uc2Uuc2VuZChSZXNQYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLmVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGguZGVsZXRlQWZ0ZXIpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLnVubGlua0lmRXhpc3RzKFJlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIGEgcmVxdWVzdCBpcyBtYWRlIHRvIGEgcGFnZS4gXG4gKiBJdCB3aWxsIGNoZWNrIGlmIHRoZSBwYWdlIGV4aXN0cywgYW5kIGlmIGl0IGRvZXMsIGl0IHdpbGwgcmV0dXJuIHRoZSBwYWdlLiBcbiAqIElmIGl0IGRvZXMgbm90IGV4aXN0LCBpdCB3aWxsIHJldHVybiBhIDQwNCBwYWdlXG4gKiBAcGFyYW0ge1JlcXVlc3QgfCBhbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGhzXG4gKiBsb2FkZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiB0aGUgcGFnZSB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3sgZmlsZTogYm9vbGVhbiwgZnVsbFBhZ2VVcmw6IHN0cmluZyB9fSBGaWxlSW5mbyAtIHRoZSBmaWxlIGluZm8gb2YgdGhlIHBhZ2UgdGhhdCBpcyBiZWluZyBhY3RpdmF0ZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIG51bWJlclxuICogQHBhcmFtIG5leHRQcmFzZSAtIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS4gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGR5bmFtaWMgcGFnZVxuICogaXMgbG9hZGVkLlxuICogQHJldHVybnMgTm90aGluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQWN0aXZhdGVQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSwgYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlciwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCB7IER5bmFtaWNGdW5jLCBmdWxsUGFnZVVybCwgY29kZTogbmV3Q29kZSB9ID0gYXdhaXQgR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlLCB1cmwsIGNvZGUpO1xuXG4gICAgaWYgKCFmdWxsUGFnZVVybCB8fCAhRHluYW1pY0Z1bmMgJiYgY29kZSA9PSA1MDApXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5zZW5kU3RhdHVzKG5ld0NvZGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuICAgICAgICBjb25zdCBwYWdlRGF0YSA9IGF3YWl0IER5bmFtaWNGdW5jKFJlc3BvbnNlLCBSZXF1ZXN0LCBSZXF1ZXN0LmJvZHksIFJlcXVlc3QucXVlcnksIFJlcXVlc3QuY29va2llcywgUmVxdWVzdC5zZXNzaW9uLCBSZXF1ZXN0LmZpbGVzLCBTZXR0aW5ncy5EZXZNb2RlKTtcbiAgICAgICAgZmluYWxTdGVwKCk7IC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgICAgICBhd2FpdCBNYWtlUGFnZVJlc3BvbnNlKFxuICAgICAgICAgICAgcGFnZURhdGEsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoZSk7XG4gICAgICAgIFJlcXVlc3QuZXJyb3IgPSBlO1xuXG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg1MDAsICdzZXJ2ZXJFcnJvcicpO1xuXG4gICAgICAgIER5bmFtaWNQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRHluYW1pY1BhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55LCB1cmw6IHN0cmluZywgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljLCBjb2RlID0gMjAwKSB7XG4gICAgY29uc3QgRmlsZUluZm8gPSBhd2FpdCBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0LCB1cmwsIGNvZGUpO1xuXG4gICAgY29uc3QgbWFrZURlbGV0ZUFycmF5ID0gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3QpXG5cbiAgICBpZiAoRmlsZUluZm8pIHtcbiAgICAgICAgU2V0dGluZ3MuQ2FjaGVEYXlzICYmIFJlc3BvbnNlLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJtYXgtYWdlPVwiICsgKFNldHRpbmdzLkNhY2hlRGF5cyAqIDI0ICogNjAgKiA2MCkpO1xuICAgICAgICBhd2FpdCBHZXRTdGF0aWNGaWxlKHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRQcmFzZSA9ICgpID0+IFBhcnNlQmFzaWNJbmZvKFJlcXVlc3QsIFJlc3BvbnNlLCBjb2RlKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBjb25zdCBpc0FwaSA9IGF3YWl0IE1ha2VBcGlDYWxsKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmwsIFNldHRpbmdzLkRldk1vZGUsIG5leHRQcmFzZSk7XG4gICAgaWYgKCFpc0FwaSAmJiAhYXdhaXQgQWN0aXZhdGVQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBhcnJheVR5cGUsIHVybCwgY29kZSwgbmV4dFByYXNlKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7IC8vIGRlbGV0ZSBmaWxlc1xufVxuXG5mdW5jdGlvbiB1cmxGaXgodXJsOiBzdHJpbmcpIHtcbiAgICBpZiAodXJsID09ICcvJykge1xuICAgICAgICB1cmwgPSAnL2luZGV4JztcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHVybCk7XG59XG5cbmV4cG9ydCB7XG4gICAgU2V0dGluZ3MsXG4gICAgRHluYW1pY1BhZ2UsXG4gICAgTG9hZEFsbFBhZ2VzVG9SYW0sXG4gICAgQ2xlYXJBbGxQYWdlc0Zyb21SYW0sXG4gICAgdXJsRml4LFxuICAgIEdldEVycm9yUGFnZVxufSIsICJpbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCAqIGFzIEJ1aWxkU2VydmVyIGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBjb29raWVQYXJzZXIgfSBmcm9tICdAdGlueWh0dHAvY29va2llLXBhcnNlcic7XG5pbXBvcnQgY29va2llRW5jcnlwdGVyIGZyb20gJ2Nvb2tpZS1lbmNyeXB0ZXInO1xuaW1wb3J0IHsgYWxsb3dQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHNlc3Npb24gZnJvbSAnZXhwcmVzcy1zZXNzaW9uJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEluc2VydE1vZGVsc1NldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCB7IFN0YXJ0UmVxdWlyZSwgR2V0U2V0dGluZ3MgfSBmcm9tICcuL0ltcG9ydE1vZHVsZSc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBjcmVhdGVOZXdQcmludFNldHRpbmdzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IE1lbW9yeVNlc3Npb24gZnJvbSAnbWVtb3J5c3RvcmUnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgZGVidWdTaXRlTWFwIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NpdGVNYXAnO1xuaW1wb3J0IHsgc2V0dGluZ3MgYXMgZGVmaW5lU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7RXhwb3J0IGFzIEV4cG9ydFJhbX0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0Z1bmN0aW9uU2NyaXB0J1xuXG5jb25zdFxuICAgIENvb2tpZXNTZWNyZXQgPSB1dWlkdjQoKS5zdWJzdHJpbmcoMCwgMzIpLFxuICAgIFNlc3Npb25TZWNyZXQgPSB1dWlkdjQoKSxcbiAgICBNZW1vcnlTdG9yZSA9IE1lbW9yeVNlc3Npb24oc2Vzc2lvbiksXG5cbiAgICBDb29raWVzTWlkZGxld2FyZSA9IGNvb2tpZVBhcnNlcihDb29raWVzU2VjcmV0KSxcbiAgICBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlID0gY29va2llRW5jcnlwdGVyKENvb2tpZXNTZWNyZXQsIHt9KSxcbiAgICBDb29raWVTZXR0aW5ncyA9IHsgaHR0cE9ubHk6IHRydWUsIHNpZ25lZDogdHJ1ZSwgbWF4QWdlOiA4NjQwMDAwMCAqIDMwIH07XG5cbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVzID0gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIgPSA8YW55PkNvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llU2V0dGluZ3MgPSBDb29raWVTZXR0aW5ncztcblxubGV0IERldk1vZGVfID0gdHJ1ZSwgY29tcGlsYXRpb25TY2FuOiBQcm9taXNlPCgpID0+IFByb21pc2U8dm9pZD4+LCBTZXNzaW9uU3RvcmU7XG5cbmxldCBmb3JtaWRhYmxlU2VydmVyLCBib2R5UGFyc2VyU2VydmVyO1xuXG5jb25zdCBzZXJ2ZUxpbWl0cyA9IHtcbiAgICBzZXNzaW9uVG90YWxSYW1NQjogMTUwLFxuICAgIHNlc3Npb25UaW1lTWludXRlczogNDAsXG4gICAgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlczogMzAsXG4gICAgZmlsZUxpbWl0TUI6IDEwLFxuICAgIHJlcXVlc3RMaW1pdE1COiA0XG59XG5cbmxldCBwYWdlSW5SYW1BY3RpdmF0ZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCBmdW5jdGlvbiBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKXtcbiAgICByZXR1cm4gcGFnZUluUmFtQWN0aXZhdGU7XG59XG5cbmNvbnN0IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMgPSBbLi4uQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheV07XG5jb25zdCBiYXNlVmFsaWRQYXRoID0gWyhwYXRoOiBzdHJpbmcpID0+IHBhdGguc3BsaXQoJy4nKS5hdCgtMikgIT0gJ3NlcnYnXTsgLy8gaWdub3JpbmcgZmlsZXMgdGhhdCBlbmRzIHdpdGggLnNlcnYuKlxuXG5leHBvcnQgY29uc3QgRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyA9IHtcbiAgICBnZXQgc2V0dGluZ3NQYXRoKCkge1xuICAgICAgICByZXR1cm4gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArIFwiL1NldHRpbmdzXCI7XG4gICAgfSxcbiAgICBzZXQgZGV2ZWxvcG1lbnQodmFsdWUpIHtcbiAgICAgICAgaWYoRGV2TW9kZV8gPT0gdmFsdWUpIHJldHVyblxuICAgICAgICBEZXZNb2RlXyA9IHZhbHVlO1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICBjb21waWxhdGlvblNjYW4gPSBCdWlsZFNlcnZlci5jb21waWxlQWxsKEV4cG9ydCk7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwicHJvZHVjdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5EZXZNb2RlID0gdmFsdWU7XG4gICAgICAgIGFsbG93UHJpbnQodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0IGRldmVsb3BtZW50KCkge1xuICAgICAgICByZXR1cm4gRGV2TW9kZV87XG4gICAgfSxcbiAgICBtaWRkbGV3YXJlOiB7XG4gICAgICAgIGdldCBjb29raWVzKCk6IChyZXE6IFJlcXVlc3QsIF9yZXM6IFJlc3BvbnNlPGFueT4sIG5leHQ/OiBOZXh0RnVuY3Rpb24pID0+IHZvaWQge1xuICAgICAgICAgICAgcmV0dXJuIDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVFbmNyeXB0ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblN0b3JlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZm9ybWlkYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtaWRhYmxlU2VydmVyO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgYm9keVBhcnNlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBib2R5UGFyc2VyU2VydmVyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZWNyZXQ6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llc1NlY3JldDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblNlY3JldDtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGdlbmVyYWw6IHtcbiAgICAgICAgaW1wb3J0T25Mb2FkOiBbXSxcbiAgICAgICAgc2V0IHBhZ2VJblJhbSh2YWx1ZSkge1xuICAgICAgICAgICAgRXhwb3J0UmFtLlBhZ2VSYW0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXBhcmF0aW9ucyA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICAgICAgICAgICAgICBhd2FpdCBwcmVwYXJhdGlvbnM/LigpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlQnlVcmwuTG9hZEFsbFBhZ2VzVG9SYW0oRXhwb3J0LmRldmVsb3BtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxlQnlVcmwuQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwYWdlSW5SYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gRXhwb3J0UmFtLlBhZ2VSYW07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBpbGU6IHtcbiAgICAgICAgc2V0IGNvbXBpbGVTeW50YXgodmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXggPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvbXBpbGVTeW50YXgoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGlnbm9yZUVycm9yKHZhbHVlKSB7XG4gICAgICAgICAgICAoPGFueT5jcmVhdGVOZXdQcmludFNldHRpbmdzKS5QcmV2ZW50RXJyb3JzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBpZ25vcmVFcnJvcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoPGFueT5jcmVhdGVOZXdQcmludFNldHRpbmdzKS5QcmV2ZW50RXJyb3JzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcGx1Z2lucyh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucy5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBsdWdpbnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGRlZmluZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGRlZmluZVNldHRpbmdzLmRlZmluZVxuICAgICAgICB9LFxuICAgICAgICBzZXQgZGVmaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICBkZWZpbmVTZXR0aW5ncy5kZWZpbmUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZzoge1xuICAgICAgICBydWxlczoge30sXG4gICAgICAgIHVybFN0b3A6IFtdLFxuICAgICAgICB2YWxpZFBhdGg6IGJhc2VWYWxpZFBhdGgsXG4gICAgICAgIGlnbm9yZVR5cGVzOiBiYXNlUm91dGluZ0lnbm9yZVR5cGVzLFxuICAgICAgICBpZ25vcmVQYXRoczogW10sXG4gICAgICAgIHNpdGVtYXA6IHRydWUsXG4gICAgICAgIGdldCBlcnJvclBhZ2VzKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZXJyb3JQYWdlcyh2YWx1ZSkge1xuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXMgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVMaW1pdHM6IHtcbiAgICAgICAgZ2V0IGNhY2hlRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBjYWNoZURheXModmFsdWUpe1xuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llc0V4cGlyZXNEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llU2V0dGluZ3MubWF4QWdlIC8gODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBjb29raWVzRXhwaXJlc0RheXModmFsdWUpe1xuICAgICAgICAgICAgQ29va2llU2V0dGluZ3MubWF4QWdlID0gdmFsdWUgKiA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25Ub3RhbFJhbU1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25Ub3RhbFJhbU1CKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVGltZU1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25UaW1lTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGZpbGVMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgZmlsZUxpbWl0TUIoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuZmlsZUxpbWl0TUI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCByZXF1ZXN0TGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgICAgICAgICBidWlsZEJvZHlQYXJzZXIoKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgcmVxdWVzdExpbWl0TUIoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlOiB7XG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGh0dHAyOiBmYWxzZSxcbiAgICAgICAgZ3JlZW5Mb2NrOiB7XG4gICAgICAgICAgICBzdGFnaW5nOiBudWxsLFxuICAgICAgICAgICAgY2x1c3RlcjogbnVsbCxcbiAgICAgICAgICAgIGVtYWlsOiBudWxsLFxuICAgICAgICAgICAgYWdlbnQ6IG51bGwsXG4gICAgICAgICAgICBhZ3JlZVRvVGVybXM6IGZhbHNlLFxuICAgICAgICAgICAgc2l0ZXM6IFtdXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZvcm1pZGFibGUoKSB7XG4gICAgZm9ybWlkYWJsZVNlcnZlciA9IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiAqIDEwNDg1NzYsXG4gICAgICAgIHVwbG9hZERpcjogU3lzdGVtRGF0YSArIFwiL1VwbG9hZEZpbGVzL1wiLFxuICAgICAgICBtdWx0aXBsZXM6IHRydWUsXG4gICAgICAgIG1heEZpZWxkc1NpemU6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiAqIDEwNDg1NzZcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRCb2R5UGFyc2VyKCkge1xuICAgIGJvZHlQYXJzZXJTZXJ2ZXIgPSAoPGFueT5ib2R5UGFyc2VyKS5qc29uKHsgbGltaXQ6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiArICdtYicgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2Vzc2lvbigpIHtcbiAgICBpZiAoIUV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgfHwgIUV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQikge1xuICAgICAgICBTZXNzaW9uU3RvcmUgPSAocmVxLCByZXMsIG5leHQpID0+IG5leHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFNlc3Npb25TdG9yZSA9IHNlc3Npb24oe1xuICAgICAgICBjb29raWU6IHsgbWF4QWdlOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzICogNjAgKiAxMDAwLCBzYW1lU2l0ZTogdHJ1ZSB9LFxuICAgICAgICBzZWNyZXQ6IFNlc3Npb25TZWNyZXQsXG4gICAgICAgIHJlc2F2ZTogZmFsc2UsXG4gICAgICAgIHNhdmVVbmluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgICAgc3RvcmU6IG5ldyBNZW1vcnlTdG9yZSh7XG4gICAgICAgICAgICBjaGVja1BlcmlvZDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgICBtYXg6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiAqIDEwNDg1NzZcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY29weUpTT04odG86IGFueSwganNvbjogYW55LCBydWxlczogc3RyaW5nW10gPSBbXSwgcnVsZXNUeXBlOiAnaWdub3JlJyB8ICdvbmx5JyA9ICdpZ25vcmUnKSB7XG4gICAgaWYoIWpzb24pIHJldHVybiBmYWxzZTtcbiAgICBsZXQgaGFzSW1wbGVhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBpIGluIGpzb24pIHtcbiAgICAgICAgY29uc3QgaW5jbHVkZSA9IHJ1bGVzLmluY2x1ZGVzKGkpO1xuICAgICAgICBpZiAocnVsZXNUeXBlID09ICdvbmx5JyAmJiBpbmNsdWRlIHx8IHJ1bGVzVHlwZSA9PSAnaWdub3JlJyAmJiAhaW5jbHVkZSkge1xuICAgICAgICAgICAgaGFzSW1wbGVhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvW2ldID0ganNvbltpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzSW1wbGVhdGVkO1xufVxuXG4vLyByZWFkIHRoZSBzZXR0aW5ncyBvZiB0aGUgd2Vic2l0ZVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVTZXR0aW5ncygpIHtcbiAgICBjb25zdCBTZXR0aW5nczogRXhwb3J0U2V0dGluZ3MgPSBhd2FpdCBHZXRTZXR0aW5ncyhFeHBvcnQuc2V0dGluZ3NQYXRoLCBEZXZNb2RlXyk7XG4gICAgaWYoU2V0dGluZ3MgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsRGV2KTtcblxuICAgIGVsc2VcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbFByb2QpO1xuXG5cbiAgICBjb3B5SlNPTihFeHBvcnQuY29tcGlsZSwgU2V0dGluZ3MuY29tcGlsZSk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQucm91dGluZywgU2V0dGluZ3Mucm91dGluZywgWydpZ25vcmVUeXBlcycsICd2YWxpZFBhdGgnXSk7XG5cbiAgICAvL2NvbmNhdCBkZWZhdWx0IHZhbHVlcyBvZiByb3V0aW5nXG4gICAgY29uc3QgY29uY2F0QXJyYXkgPSAobmFtZTogc3RyaW5nLCBhcnJheTogYW55W10pID0+IFNldHRpbmdzLnJvdXRpbmc/LltuYW1lXSAmJiAoRXhwb3J0LnJvdXRpbmdbbmFtZV0gPSBTZXR0aW5ncy5yb3V0aW5nW25hbWVdLmNvbmNhdChhcnJheSkpO1xuXG4gICAgY29uY2F0QXJyYXkoJ2lnbm9yZVR5cGVzJywgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyk7XG4gICAgY29uY2F0QXJyYXkoJ3ZhbGlkUGF0aCcsIGJhc2VWYWxpZFBhdGgpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydjYWNoZURheXMnLCAnY29va2llc0V4cGlyZXNEYXlzJ10sICdvbmx5Jyk7XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3Nlc3Npb25Ub3RhbFJhbU1CJywgJ3Nlc3Npb25UaW1lTWludXRlcycsICdzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydmaWxlTGltaXRNQicsICdyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEJvZHlQYXJzZXIoKTtcbiAgICB9XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmUsIFNldHRpbmdzLnNlcnZlKTtcblxuICAgIC8qIC0tLSBwcm9ibGVtYXRpYyB1cGRhdGVzIC0tLSAqL1xuICAgIEV4cG9ydC5kZXZlbG9wbWVudCA9IFNldHRpbmdzLmRldmVsb3BtZW50XG5cbiAgICBpZiAoU2V0dGluZ3MuZ2VuZXJhbD8uaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIEV4cG9ydC5nZW5lcmFsLmltcG9ydE9uTG9hZCA9IDxhbnk+YXdhaXQgU3RhcnRSZXF1aXJlKDxhbnk+U2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQsIERldk1vZGVfKTtcbiAgICB9XG5cbiAgICAvL25lZWQgdG8gZG93biBsYXN0ZWQgc28gaXQgd29uJ3QgaW50ZXJmZXJlIHdpdGggJ2ltcG9ydE9uTG9hZCdcbiAgICBpZiAoIWNvcHlKU09OKEV4cG9ydC5nZW5lcmFsLCBTZXR0aW5ncy5nZW5lcmFsLCBbJ3BhZ2VJblJhbSddLCAnb25seScpICYmIFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgIH1cblxuICAgIGlmKEV4cG9ydC5kZXZlbG9wbWVudCAmJiBFeHBvcnQucm91dGluZy5zaXRlbWFwKXsgLy8gb24gcHJvZHVjdGlvbiB0aGlzIHdpbGwgYmUgY2hlY2tlZCBhZnRlciBjcmVhdGluZyBzdGF0ZVxuICAgICAgICBkZWJ1Z1NpdGVNYXAoRXhwb3J0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZpcnN0TG9hZCgpIHtcbiAgICBidWlsZFNlc3Npb24oKTtcbiAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICBidWlsZEJvZHlQYXJzZXIoKTtcbn0iLCAiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cDIgZnJvbSAnaHR0cDInO1xuaW1wb3J0ICogYXMgY3JlYXRlQ2VydCBmcm9tICdzZWxmc2lnbmVkJztcbmltcG9ydCAqIGFzIEdyZWVubG9jayBmcm9tICdncmVlbmxvY2stZXhwcmVzcyc7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5nc30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERlbGV0ZUluRGlyZWN0b3J5LCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgR3JlZW5Mb2NrU2l0ZSB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5cbi8qKlxuICogSWYgdGhlIGZvbGRlciBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc1xuICogZXhpc3QsIHVwZGF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IGZvTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmb2xkZXIgdG8gY3JlYXRlLlxuICogQHBhcmFtIENyZWF0ZUluTm90RXhpdHMgLSB7XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFRvdWNoU3lzdGVtRm9sZGVyKGZvTmFtZTogc3RyaW5nLCBDcmVhdGVJbk5vdEV4aXRzOiB7bmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBleGl0cz86IGFueX0pIHtcbiAgICBsZXQgc2F2ZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgXCIvU3lzdGVtU2F2ZS9cIjtcblxuICAgIGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHNhdmVQYXRoKTtcblxuICAgIHNhdmVQYXRoICs9IGZvTmFtZTtcblxuICAgIGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHNhdmVQYXRoKTtcblxuICAgIGlmIChDcmVhdGVJbk5vdEV4aXRzKSB7XG4gICAgICAgIHNhdmVQYXRoICs9ICcvJztcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBzYXZlUGF0aCArIENyZWF0ZUluTm90RXhpdHMubmFtZTtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmaWxlUGF0aCwgQ3JlYXRlSW5Ob3RFeGl0cy52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoQ3JlYXRlSW5Ob3RFeGl0cy5leGl0cykge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmaWxlUGF0aCwgYXdhaXQgQ3JlYXRlSW5Ob3RFeGl0cy5leGl0cyhhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JyksIGZpbGVQYXRoLCBzYXZlUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEl0IGdlbmVyYXRlcyBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGFuZCBzdG9yZXMgaXQgaW4gYSBmaWxlLlxuICogQHJldHVybnMgVGhlIGNlcnRpZmljYXRlIGFuZCBrZXkgYXJlIGJlaW5nIHJldHVybmVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREZW1vQ2VydGlmaWNhdGUoKSB7XG4gICAgbGV0IENlcnRpZmljYXRlOiBhbnk7XG4gICAgY29uc3QgQ2VydGlmaWNhdGVQYXRoID0gU3lzdGVtRGF0YSArICcvQ2VydGlmaWNhdGUuanNvbic7XG5cbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoQ2VydGlmaWNhdGVQYXRoKSkge1xuICAgICAgICBDZXJ0aWZpY2F0ZSA9IEVhc3lGcy5yZWFkSnNvbkZpbGUoQ2VydGlmaWNhdGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBDZXJ0aWZpY2F0ZSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICBjcmVhdGVDZXJ0LmdlbmVyYXRlKG51bGwsIHsgZGF5czogMzY1MDAgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleXMucHJpdmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgY2VydDoga2V5cy5jZXJ0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoQ2VydGlmaWNhdGVQYXRoLCBDZXJ0aWZpY2F0ZSk7XG4gICAgfVxuICAgIHJldHVybiBDZXJ0aWZpY2F0ZTtcbn1cblxuZnVuY3Rpb24gRGVmYXVsdExpc3RlbihhcHApIHtcbiAgICBjb25zdCBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHAuYXR0YWNoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZXJ2ZXIsXG4gICAgICAgIGxpc3Rlbihwb3J0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgPGFueT5yZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIElmIHlvdSB3YW50IHRvIHVzZSBncmVlbmxvY2ssIGl0IHdpbGwgY3JlYXRlIGEgc2VydmVyIHRoYXQgd2lsbCBzZXJ2ZSB5b3VyIGFwcCBvdmVyIGh0dHBzXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHRpbnlIdHRwIGFwcGxpY2F0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRoZSBzZXJ2ZXIgbWV0aG9kc1xuICovXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBVcGRhdGVHcmVlbkxvY2soYXBwKSB7XG5cbiAgICBpZiAoIShTZXR0aW5ncy5zZXJ2ZS5odHRwMiB8fCBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2s/LmFncmVlVG9UZXJtcykpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IERlZmF1bHRMaXN0ZW4oYXBwKTtcbiAgICB9XG5cbiAgICBpZiAoIVNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ3JlZVRvVGVybXMpIHtcbiAgICAgICAgY29uc3Qgc2VydmVyID0gaHR0cDIuY3JlYXRlU2VjdXJlU2VydmVyKHsgLi4uYXdhaXQgR2V0RGVtb0NlcnRpZmljYXRlKCksIGFsbG93SFRUUDE6IHRydWUgfSwgYXBwLmF0dGFjaCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3Rlbihwb3J0KSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgVG91Y2hTeXN0ZW1Gb2xkZXIoXCJncmVlbmxvY2tcIiwge1xuICAgICAgICBuYW1lOiBcImNvbmZpZy5qc29uXCIsIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzaXRlczogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzXG4gICAgICAgIH0pLFxuICAgICAgICBhc3luYyBleGl0cyhmaWxlLCBfLCBmb2xkZXIpIHtcbiAgICAgICAgICAgIGZpbGUgPSBKU09OLnBhcnNlKGZpbGUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbGUuc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlID0gZmlsZS5zaXRlc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgaGF2ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgPEdyZWVuTG9ja1NpdGVbXT4gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLnN1YmplY3QgPT0gZS5zdWJqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLmFsdG5hbWVzLmxlbmd0aCAhPSBlLmFsdG5hbWVzLmxlbmd0aCB8fCBiLmFsdG5hbWVzLnNvbWUodiA9PiBlLmFsdG5hbWVzLmluY2x1ZGVzKHYpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuYWx0bmFtZXMgPSBiLmFsdG5hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlLnJlbmV3QXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWhhdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5zaXRlcy5zcGxpY2UoaSwgaSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBmb2xkZXIgKyBcImxpdmUvXCIgKyBlLnN1YmplY3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHMocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnJtZGlyKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdTaXRlcyA9IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcy5maWx0ZXIoKHgpID0+ICFmaWxlLnNpdGVzLmZpbmQoYiA9PiBiLnN1YmplY3QgPT0geC5zdWJqZWN0KSk7XG5cbiAgICAgICAgICAgIGZpbGUuc2l0ZXMucHVzaCguLi5uZXdTaXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShmaWxlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFja2FnZUluZm8gPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHdvcmtpbmdEaXJlY3RvcnkgKyBcInBhY2thZ2UuanNvblwiKTtcblxuICAgIGNvbnN0IGdyZWVubG9ja09iamVjdDphbnkgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gR3JlZW5sb2NrLmluaXQoe1xuICAgICAgICBwYWNrYWdlUm9vdDogd29ya2luZ0RpcmVjdG9yeSxcbiAgICAgICAgY29uZmlnRGlyOiBcIlN5c3RlbVNhdmUvZ3JlZW5sb2NrXCIsXG4gICAgICAgIHBhY2thZ2VBZ2VudDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFnZW50IHx8IHBhY2thZ2VJbmZvLm5hbWUgKyAnLycgKyBwYWNrYWdlSW5mby52ZXJzaW9uLFxuICAgICAgICBtYWludGFpbmVyRW1haWw6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5lbWFpbCxcbiAgICAgICAgY2x1c3RlcjogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmNsdXN0ZXIsXG4gICAgICAgIHN0YWdpbmc6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zdGFnaW5nXG4gICAgfSkucmVhZHkocmVzKSk7XG5cbiAgICBmdW5jdGlvbiBDcmVhdGVTZXJ2ZXIodHlwZSwgZnVuYywgb3B0aW9ucz8pIHtcbiAgICAgICAgbGV0IENsb3NlaHR0cFNlcnZlciA9ICgpID0+IHsgfTtcbiAgICAgICAgY29uc3Qgc2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0W3R5cGVdKG9wdGlvbnMsIGZ1bmMpO1xuICAgICAgICBjb25zdCBsaXN0ZW4gPSAocG9ydCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGdyZWVubG9ja09iamVjdC5odHRwU2VydmVyKCk7XG4gICAgICAgICAgICBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiBodHRwU2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW25ldyBQcm9taXNlKHJlcyA9PiBzZXJ2ZXIubGlzdGVuKDQ0MywgXCIwLjAuMC4wXCIsIHJlcykpLCBuZXcgUHJvbWlzZShyZXMgPT4gaHR0cFNlcnZlci5saXN0ZW4ocG9ydCwgXCIwLjAuMC4wXCIsIHJlcykpXSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBzZXJ2ZXIuY2xvc2UoKTsgQ2xvc2VodHRwU2VydmVyKCk7IH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4sXG4gICAgICAgICAgICBjbG9zZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFNldHRpbmdzLnNlcnZlLmh0dHAyKSB7XG4gICAgICAgIHJldHVybiBDcmVhdGVTZXJ2ZXIoJ2h0dHAyU2VydmVyJywgYXBwLmF0dGFjaCwgeyBhbGxvd0hUVFAxOiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdGVTZXJ2ZXIoJ2h0dHBzU2VydmVyJywgYXBwLmF0dGFjaCk7XG4gICAgfVxufVxuIiwgImltcG9ydCBzZXJ2ZXIsIHtTZXR0aW5nc30gIGZyb20gJy4vTWFpbkJ1aWxkL1NlcnZlcic7XG5pbXBvcnQgYXN5bmNSZXF1aXJlIGZyb20gJy4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7Z2V0VHlwZXN9IGZyb20gJy4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFNlYXJjaFJlY29yZCBmcm9tICcuL0J1aWxkSW5GdW5jL1NlYXJjaFJlY29yZCc7XG5leHBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vTWFpbkJ1aWxkL1R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEFzeW5jSW1wb3J0ID0gKHBhdGg6c3RyaW5nLCBpbXBvcnRGcm9tID0gJ2FzeW5jIGltcG9ydCcpID0+IGFzeW5jUmVxdWlyZShpbXBvcnRGcm9tLCBwYXRoLCBnZXRUeXBlcy5TdGF0aWMsIHtpc0RlYnVnOiBTZXR0aW5ncy5kZXZlbG9wbWVudH0pO1xuZXhwb3J0IHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7OztBQ0ZBOzs7QUNBQSxJQUFJLFlBQVk7QUFFVCxvQkFBb0IsR0FBWTtBQUNuQyxjQUFZO0FBQ2hCO0FBRU8sSUFBTSxRQUFRLElBQUksTUFBTSxTQUFRO0FBQUEsRUFDbkMsSUFBSSxRQUFRLE1BQU0sVUFBVTtBQUN4QixRQUFHLFFBQVE7QUFDUCxhQUFPLE9BQU87QUFFbEIsUUFBRyxhQUFhLFFBQVE7QUFDcEIsYUFBTyxPQUFPO0FBQ2xCLFdBQU8sTUFBTTtBQUFBLElBQUM7QUFBQSxFQUNsQjtBQUNKLENBQUM7OztBRGJEO0FBRUEsZ0JBQWdCLFFBQStCO0FBQzNDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxLQUFLLFFBQU0sQ0FBQyxLQUFLLFVBQVM7QUFDekIsVUFBSSxRQUFRLEtBQUksQ0FBQztBQUFBLElBQ3JCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQVFBLGNBQWMsUUFBYyxPQUFnQixhQUF1QixlQUFtQixDQUFDLEdBQXdCO0FBQzNHLFNBQU8s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
