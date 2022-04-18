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
var pool = workerPool.pool(SystemData + "/../static/wasm/component/workerInsertComponent.js", { maxWorkers: cpus().length });
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
var parse_stream = workerPool2.pool(SystemData + "/../static/wasm/reader/worker.js", { maxWorkers: cpus2().length });
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
          substring = new StringTracker().Plus$`write(${substring})`;
          type = "script";
          break;
        case "escape":
          substring = new StringTracker().Plus$`writeSafe(${substring})`;
          type = "script";
          break;
        case "debug":
          substring = new StringTracker().Plus$`\nrun_script_name = \`${JSParser.fixText(substring)}\``;
          type = "no-track";
          break;
      }
      if (type != "text" && !substring.endsWith(";"))
        substring.AddTextAfterNoTrack(";");
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
var searchSpecificComponents = new RegExp(`<([\\p{Lu}_\\-:0-9]|${AllBuildIn.join("|")})`, "u");
var searchAllComponents = /<[\p{L}_\-:0-9]/u;
var InsertComponent = class extends InsertComponentBase {
  constructor(PluginBuild2) {
    super();
    this.dirFolder = "Components";
    this.PluginBuild = PluginBuild2;
  }
  get regexSearch() {
    return this.SomePlugins("MinHTML", "MinAll") ? searchAllComponents : searchSpecificComponents;
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
  CheckMinHTMLText(code) {
    if (!this.SomePlugins("MinHTML", "MinAll")) {
      return code;
    }
    while (/[ \n]{2,}/.test(code.eq)) {
      code = code.replace(/[ \n]{2,}/gi, " ");
    }
    return code;
  }
  async ReBuildTag(type, dataTag2, dataTagSpliced, BetweenTagData, SendDataFunc) {
    if (this.SomePlugins("MinHTML", "MinAll")) {
      if (BetweenTagData)
        BetweenTagData = BetweenTagData.SpaceOne(" ");
      dataTag2 = dataTagSpliced.rebuildSpace();
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
      const ReBuildTag = () => this.ReBuildTag(type, dataTag2, dataParser, BetweenTagData, (BetweenTagData2) => this.StartReplace(BetweenTagData2, pathName, sessionInfo2));
      const firstChar = type.at(0).eq;
      if (firstChar != firstChar.toUpperCase()) {
        return ReBuildTag();
      }
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
        return ReBuildTag();
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
        promiseBuild.push(this.CheckMinHTML(this.CheckMinHTMLText(cutStartData)), this.insertTagData(pathName, tagType, inTag, { sessionInfo: sessionInfo2 }));
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
    if (promiseBuild.length === 0 && !this.FindSpecialTagByStart(data.eq.trim())) {
      data = this.CheckMinHTMLText(data);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0xvZ2dlci50cyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzIiwgIi4uL3NyYy9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVNjcmlwdC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSlNQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvbWluaWZ5LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jbGllbnQudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9sb2FkLW9wdGlvbnMudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi93YXNtLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2Vzc2lvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvZXJyb3IudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd24udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaGVhZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jb25uZWN0LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2Zvcm0udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcmVjb3JkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlYXJjaC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvWE1MSGVscGVycy9FeHRyaWNhdGUudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvQ29tcGlsZS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU2NyaXB0LnRzIiwgIi4uL3NyYy9HbG9iYWwvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3R5bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0NvbXBpbGVTdGF0ZS50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NpdGVNYXAudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GaWxlVHlwZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ltcG9ydEZpbGVSdW50aW1lLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQXBpQ2FsbC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0dldFBhZ2VzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvU2V0dGluZ3MudHMiLCAiLi4vc3JjL01haW5CdWlsZC9MaXN0ZW5HcmVlbkxvY2sudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBcHAgYXMgVGlueUFwcCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL1R5cGVzJztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5ncywgcmVxdWlyZVNldHRpbmdzLCBidWlsZEZpcnN0TG9hZCwgcGFnZUluUmFtQWN0aXZhdGVGdW5jfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBmb3JtaWRhYmxlIGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgVXBkYXRlR3JlZW5Mb2NrIH0gZnJvbSAnLi9MaXN0ZW5HcmVlbkxvY2snO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IGNoYW5nZVVSTFJ1bGVzKHJlcSwgcmVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hhbmdlVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgbGV0IHVybCA9IGZpbGVCeVVybC51cmxGaXgocmVxLnBhdGgpO1xuXG4gICAgXG4gICAgZm9yIChsZXQgaSBvZiBTZXR0aW5ncy5yb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpKSB7XG4gICAgICAgICAgICBpZiAoaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuc3Vic3RyaW5nKDAsIGkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSdWxlSW5kZXggPSBPYmplY3Qua2V5cyhTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzKS5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpO1xuXG4gICAgaWYgKFJ1bGVJbmRleCkge1xuICAgICAgICB1cmwgPSBhd2FpdCBTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzW1J1bGVJbmRleF0odXJsLCByZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgdXJsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZXJVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHVybDogc3RyaW5nKSB7XG4gICAgbGV0IG5vdFZhbGlkOiBhbnkgPSBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSkgfHwgU2V0dGluZ3Mucm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGkgPT4gdXJsLmVuZHNXaXRoKCcuJytpKSk7XG4gICAgXG4gICAgaWYoIW5vdFZhbGlkKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWxpZCBvZiBTZXR0aW5ncy5yb3V0aW5nLnZhbGlkUGF0aCl7IC8vIGNoZWNrIGlmIHVybCBpc24ndCB2YWxpZFxuICAgICAgICAgICAgaWYoIWF3YWl0IHZhbGlkKHVybCwgcmVxLCByZXMpKXtcbiAgICAgICAgICAgICAgICBub3RWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm90VmFsaWQpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gZmlsZUJ5VXJsLkdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCB1cmwuc3Vic3RyaW5nKDEpKTtcbn1cblxubGV0IGFwcE9ubGluZVxuXG4vKipcbiAqIEl0IHN0YXJ0cyB0aGUgc2VydmVyIGFuZCB0aGVuIGNhbGxzIFN0YXJ0TGlzdGluZ1xuICogQHBhcmFtIFtTZXJ2ZXJdIC0gVGhlIHNlcnZlciBvYmplY3QgdGhhdCBpcyBwYXNzZWQgaW4gYnkgdGhlIGNhbGxlci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gU3RhcnRBcHAoU2VydmVyPykge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBUaW55QXBwKCk7XG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICBhcHAudXNlKDxhbnk+Y29tcHJlc3Npb24oKSk7XG4gICAgfVxuICAgIGZpbGVCeVVybC5TZXR0aW5ncy5TZXNzaW9uU3RvcmUgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IFNldHRpbmdzLm1pZGRsZXdhcmUuc2Vzc2lvbihyZXEsIHJlcywgbmV4dCk7XG5cbiAgICBjb25zdCBPcGVuTGlzdGluZyA9IGF3YWl0IFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgU2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgYXdhaXQgZnVuYyhhcHAsIGFwcE9ubGluZS5zZXJ2ZXIsIFNldHRpbmdzKTtcbiAgICB9XG4gICAgYXdhaXQgcGFnZUluUmFtQWN0aXZhdGVGdW5jKCk/LigpXG5cbiAgICBhcHAuYWxsKFwiKlwiLCBQYXJzZVJlcXVlc3QpO1xuXG4gICAgYXdhaXQgT3Blbkxpc3RpbmcoU2V0dGluZ3Muc2VydmUucG9ydCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcCBsaXN0aW5nIGF0IHBvcnQ6IFwiICsgU2V0dGluZ3Muc2VydmUucG9ydCk7XG59XG5cbi8qKlxuICogSWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIHJlcXVlc3QsIHRoZW4gcGFyc2UgdGhlIHJlcXVlc3QgYm9keSwgdGhlbiBzZW5kIGl0IHRvIHJvdXRpbmcgc2V0dGluZ3NcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC0gVGhlIGluY29taW5nIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLSBSZXNwb25zZVxuICovXG5hc3luYyBmdW5jdGlvbiBQYXJzZVJlcXVlc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT0gJ1BPU1QnKSB7XG4gICAgICAgIGlmIChyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10/LnN0YXJ0c1dpdGg/LignYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICBTZXR0aW5ncy5taWRkbGV3YXJlLmJvZHlQYXJzZXIocmVxLCByZXMsICgpID0+IHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKFNldHRpbmdzLm1pZGRsZXdhcmUuZm9ybWlkYWJsZSkucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpIHtcbiAgICBpZiAoYXBwT25saW5lICYmIGFwcE9ubGluZS5jbG9zZSkge1xuICAgICAgICBhd2FpdCBhcHBPbmxpbmUuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcnZlciwgbGlzdGVuLCBjbG9zZSB9ID0gYXdhaXQgU2VydmVyKGFwcCk7XG5cbiAgICBhcHBPbmxpbmUgPSB7IHNlcnZlciwgY2xvc2UgfTtcblxuICAgIHJldHVybiBsaXN0ZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0U2VydmVyKHsgU2l0ZVBhdGggPSAnLi8nLCBIdHRwU2VydmVyID0gVXBkYXRlR3JlZW5Mb2NrIH0gPSB7fSkge1xuICAgIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciA9IFNpdGVQYXRoO1xuICAgIGJ1aWxkRmlyc3RMb2FkKCk7XG4gICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgU3RhcnRBcHAoSHR0cFNlcnZlcik7XG59XG5cbmV4cG9ydCB7IFNldHRpbmdzIH07IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcm9wID09ICdpbXBvcnRhbnQnKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5lcnJvcjtcbiAgICAgICAgICAgIFxuICAgICAgICBpZihwcmludE1vZGUgJiYgcHJvcCAhPSBcImRvLW5vdGhpbmdcIilcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQge0RpcmVudH0gZnJvbSAnZnMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtjd2R9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gJ3VybCdcbmltcG9ydCB7IEN1dFRoZUxhc3QgLCBTcGxpdEZpcnN0fSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVCeVNtYWxsUGF0aChzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIGdldFR5cGVzW1NwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnNoaWZ0KCldO1xufVxuXG5cblxuZXhwb3J0IHtcbiAgICBnZXREaXJuYW1lLFxuICAgIFN5c3RlbURhdGEsXG4gICAgd29ya2luZ0RpcmVjdG9yeSxcbiAgICBnZXRUeXBlcyxcbiAgICBCYXNpY1NldHRpbmdzXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuaW50ZXJmYWNlIGdsb2JhbFN0cmluZzxUPiB7XG4gICAgaW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBsYXN0SW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBzdGFydHNXaXRoKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0Rmlyc3Q8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4odHlwZTogc3RyaW5nLCBzdHJpbmc6IFQpOiBUW10ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YodHlwZSk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpXG4gICAgICAgIHJldHVybiBbc3RyaW5nXTtcblxuICAgIHJldHVybiBbc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCksIHN0cmluZy5zdWJzdHJpbmcoaW5kZXggKyB0eXBlLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3V0VGhlTGFzdCh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVuc2lvbjxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdHJpbmc6IFQpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLy4uL0pTUGFyc2VyJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9TZXNzaW9uJztcblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgPCV7P2RlYnVnX2ZpbGU/fSR7aS50ZXh0fSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVNjcmlwdENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnTGluZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlVGV4dENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlU2NyaXB0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VyLnN0YXJ0ID0gXCI8JVwiO1xuICAgIHBhcnNlci5lbmQgPSBcIiU+XCI7XG4gICAgcmV0dXJuIHBhcnNlci5SZUJ1aWxkVGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnSW5mbyhjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBhd2FpdCBQYXJzZVNjcmlwdENvZGUoY29kZSwgcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBBZGREZWJ1Z0luZm8oaXNvbGF0ZTogYm9vbGVhbiwgcGFnZU5hbWU6c3RyaW5nLCBGdWxsUGF0aDpzdHJpbmcsIFNtYWxsUGF0aDpzdHJpbmcsIGNhY2hlOiB7dmFsdWU/OiBzdHJpbmd9ID0ge30pe1xuICAgIGlmKCFjYWNoZS52YWx1ZSlcbiAgICAgICAgY2FjaGUudmFsdWUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbFBhdGgsICd1dGY4Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGxEYXRhOiBuZXcgU3RyaW5nVHJhY2tlcihgJHtwYWdlTmFtZX08bGluZT4ke1NtYWxsUGF0aH1gLCBpc29sYXRlID8gYDwleyU+JHtjYWNoZS52YWx1ZX08JX0lPmA6IGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkgPSB0aGlzLkRhdGFBcnJheS5jb25jYXQoZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcsIGluZm8gPSAnJykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheSA9IG5ld1N0cmluZy5EYXRhQXJyYXkuY29uY2F0KHRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgdGhpc1N1YnN0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzU3Vic3RyaW5nLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXNTdWJzdHJpbmcgPSB0aGlzU3Vic3RyaW5nLkN1dFN0cmluZyhpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICBwdWJsaWMgb3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lOm51bWJlciwgY29sdW1uOm51bWJlcil7XG4gICAgICAgIGxldCBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUpO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnNlYXJjaExpbmUuYXQoY29sdW1uLTEpLkRlZmF1bHRJbmZvVGV4dCxcbiAgICAgICAgICAgIHNlYXJjaExpbmVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMub3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEsIGNvbCA/PyBsb2NhdGlvbj8uY29sdW1uID8/IDApXG5cbiAgICAgICAgcmV0dXJuIGAke3RleHQgfHwgbWVzc2FnZX0sIG9uIGZpbGUgLT48Y29sb3I+JHtCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCtkYXRhLnNlYXJjaExpbmUuZXh0cmFjdEluZm8oKX06JHtkYXRhLmxpbmV9OiR7ZGF0YS5jaGFyfSR7bG9jYXRpb24/LmxpbmVUZXh0ID8gJ1xcbkxpbmU6IFwiJyArIGxvY2F0aW9uLmxpbmVUZXh0LnRyaW0oKSArICdcIic6ICcnfWA7XG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1dpdGhUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBvdXRwdXRXaXRoTWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24pXG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1RhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uLCBodHRwU291cmNlLCByZWxhdGl2ZSlcbiAgICB9XG59IiwgImltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdQcmludCh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgICAgIGNvbnN0IGxvZ1R5cGUgPSB0eXBlID09ICdlcnJvcicgPyAnaW1wb3J0YW50JzogdHlwZTtcblxuICAgICAgICBjb25zdCBzcGxpdENvbG9yID0gdGV4dC5zcGxpdCgnPGNvbG9yPicpO1xuICAgICAgIFxuICAgICAgICBjb25zdCBtYWluTWVzc2FnZSA9IGNoYWxrLm1hZ2VudGEoc3BsaXRDb2xvci5wb3AoKS5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJykpXG4gICAgICAgIFxuICAgICAgICBsZXQgYWJvdXQgPSAnLScucmVwZWF0KDEwKSArICh0eXBlID09ICdlcnJvcicgPyBjaGFsay5ib2xkKHR5cGUpOiB0eXBlKSArICctJy5yZXBlYXQoMTApXG4gICAgICAgIHJldHVybiBbbG9nVHlwZSxcbiAgICAgICAgICAgIGFib3V0ICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbGsuYmx1ZShzcGxpdENvbG9yLnNoaWZ0KCkgfHwgJycpICsgJ1xcbicgKyBcbiAgICAgICAgICAgIG1haW5NZXNzYWdlICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbGsucmVkKGBFcnJvci1Db2RlOiAke2Vycm9yTmFtZX1gKSArICdcXG4nICtcbiAgICAgICAgICAgICctJy5yZXBlYXQodHlwZS5sZW5ndGgrMjApICsgJ1xcbiddXG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2dUb0hUTUwobG9nOiBzdHJpbmcpe1xuICAgIHJldHVybiBsb2cucmVwbGFjZSgvXFxufDxsaW5lPnw8Y29sb3I+LywgJzxici8+Jylcbn0iLCAiaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5jb25zdCBsb2FkUGF0aCA9IHR5cGVvZiBlc2J1aWxkICE9PSAndW5kZWZpbmVkJyA/ICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50Lyc6ICcvLi4vJztcbmNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsICsgbG9hZFBhdGggKyAnYnVpbGQud2FzbScpKSk7XG5jb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuY29uc3Qgd2FzbSA9IHdhc21JbnN0YW5jZS5leHBvcnRzO1xuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbSh0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuLyoqXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9lcnJvcnMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHdhc20uZ2V0X2Vycm9ycyhyZXRwdHIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGJsb2NrXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX2Jsb2NrKHRleHQsIGJsb2NrKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChibG9jaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX2Jsb2NrKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tpcF9zcGVjaWFsX3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gc2ltcGxlX3NraXBcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2NvbXBvbmVudChza2lwX3NwZWNpYWxfdGFnLCBzaW1wbGVfc2tpcCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2tpcF9zcGVjaWFsX3RhZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2ltcGxlX3NraXAsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB3YXNtLmluc2VydF9jb21wb25lbnQocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfZGVmKHRleHQsIGVuZF90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmRfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX2RlZihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHFfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9xKHRleHQsIHFfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX3EocHRyMCwgbGVuMCwgcV90eXBlLmNvZGVQb2ludEF0KDApKTtcbiAgICByZXR1cm4gcmV0ID4+PiAwO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2VqcyhyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzX21pbih0ZXh0LCBuYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2Vqc19taW4ocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzdGFydFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGVqc19wYXJzZSh0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGFydCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjIgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjIgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uZWpzX3BhcnNlKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMiwgbGVuMik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWdlX2Jhc2VfcGFyc2VyKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnBhZ2VfYmFzZV9wYXJzZXIocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWxfYXR0cl9wYXJzZXIodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uaHRtbF9hdHRyX3BhcnNlcihyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGNvbnN0IFNpbXBsZVNraXAgPSBbJ3RleHRhcmVhJywnc2NyaXB0JywgJ3N0eWxlJ107XG5leHBvcnQgY29uc3QgU2tpcFNwZWNpYWxUYWcgPSBbW1wiJVwiLCBcIiVcIl0sIFtcIiN7ZGVidWd9XCIsIFwie2RlYnVnfSNcIl1dOyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBmaW5kX2VuZF9vZl9kZWYsIGZpbmRfZW5kX29mX3EsIGZpbmRfZW5kX2Jsb2NrIH0gZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzJztcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9TZXR0aW5ncy5qcyc7XG5pbXBvcnQgeyBnZXREaXJuYW1lLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuXG5leHBvcnQgY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVzKCkubGVuZ3RoIH0pO1xuXG5leHBvcnQgY2xhc3MgQmFzZVJlYWRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZW5kIG9mIHF1b3RhdGlvbiBtYXJrcywgc2tpcHBpbmcgdGhpbmdzIGxpa2UgZXNjYXBpbmc6IFwiXFxcXFwiXCJcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVudE9mUSh0ZXh0OiBzdHJpbmcsIHFUeXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShFbmRUeXBlKSkge1xuICAgICAgICAgICAgRW5kVHlwZSA9IFtFbmRUeXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgSlNPTi5zdHJpbmdpZnkoRW5kVHlwZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhbWUgYXMgJ2ZpbmRFbmRPZkRlZicgb25seSB3aXRoIG9wdGlvbiB0byBjdXN0b20gJ29wZW4nIGFuZCAnY2xvc2UnXG4gICAgICogYGBganNcbiAgICAgKiBGaW5kRW5kT2ZCbG9jayhgY29vbCBcIn1cIiB7IGRhdGEgfSB9IG5leHRgLCAneycsICd9JylcbiAgICAgKiBgYGBcbiAgICAgKiBpdCB3aWxsIHJldHVybiB0aGUgMTggLT4gXCJ9IG5leHRcIlxuICAgICAqICBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgRmluZEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCBvcGVuOiBzdHJpbmcsIGVuZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX2Jsb2NrKHRleHQsIG9wZW4gKyBlbmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIFNpbXBsZVNraXA6IHN0cmluZ1tdID0gU2V0dGluZ3MuU2ltcGxlU2tpcDtcbiAgICBTa2lwU3BlY2lhbFRhZzogc3RyaW5nW11bXSA9IFNldHRpbmdzLlNraXBTcGVjaWFsVGFnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmludE5ldz86IGFueSkgeyB9XG5cbiAgICBwcml2YXRlIHByaW50RXJyb3JzKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGVycm9yczogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmludE5ldykgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBKU09OLnBhcnNlKGVycm9ycykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50TmV3KHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke2kudHlwZV9uYW1lfVwiLCB1c2VkIGluOiAke3RleHQuYXQoTnVtYmVyKGkuaW5kZXgpKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFyKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhcicsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhckhUTUwodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFySFRNTCcsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG59XG5cbnR5cGUgUGFyc2VCbG9ja3MgPSB7IG5hbWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfVtdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTKHRleHQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlMnLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlNNaW5pKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXJbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKU01pbmknLCBbdGV4dCxmaW5kXSkpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFSlNQYXJzZXIodGV4dDogc3RyaW5nLCBzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ0VKU1BhcnNlcicsIFt0ZXh0LCBzdGFydCwgZW5kXSkpO1xufSIsICJcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cbmludGVyZmFjZSBTcGxpdFRleHQge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICB0eXBlX25hbWU6IHN0cmluZyxcbiAgICBpc19za2lwOiBib29sZWFuXG59XG5cbmNvbnN0IHBhcnNlX3N0cmVhbSA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9yZWFkZXIvd29ya2VyLmpzJywgeyBtYXhXb3JrZXJzOiBjcHVzKCkubGVuZ3RoIH0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0U3RyZWFtKHRleHQ6IHN0cmluZyk6IFByb21pc2U8U3BsaXRUZXh0W10+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnYnVpbGRfc3RyZWFtJywgW3RleHRdKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkRlZlNraXBCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdmaW5kX2VuZF9vZl9kZWZfc2tpcF9ibG9jaycsIFt0ZXh0LCBKU09OLnN0cmluZ2lmeSh0eXBlcyldKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZW5kX29mX2Jsb2NrJywgW3RleHQsIHR5cGVzLmpvaW4oJycpXSk7XG59XG5cbmFic3RyYWN0IGNsYXNzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBSZXBsYWNlQWxsKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG5ld1RleHQgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dC5zcGxpdChmaW5kKSkge1xuICAgICAgICAgICAgbmV3VGV4dCArPSByZXBsYWNlICsgaTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdUZXh0LnN1YnN0cmluZyhyZXBsYWNlLmxlbmd0aCk7XG4gICAgfVxufVxuXG5cbmFic3RyYWN0IGNsYXNzIFJlQnVpbGRDb2RlQmFzaWMgZXh0ZW5kcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgcHVibGljIFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdO1xuXG4gICAgY29uc3RydWN0b3IoUGFyc2VBcnJheTogU3BsaXRUZXh0W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5QYXJzZUFycmF5ID0gUGFyc2VBcnJheTtcbiAgICB9XG5cbiAgICBCdWlsZENvZGUoKSB7XG4gICAgICAgIGxldCBPdXRTdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIE91dFN0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5SZXBsYWNlQWxsKE91dFN0cmluZywgJzx8LXw+JywgJzx8fD4nKTtcbiAgICB9XG59XG5cblxudHlwZSBEYXRhQ29kZUluZm8gPSB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGlucHV0czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGNsYXNzIFJlQnVpbGRDb2RlU3RyaW5nIGV4dGVuZHMgUmVCdWlsZENvZGVCYXNpYyB7XG4gICAgcHJpdmF0ZSBEYXRhQ29kZTogRGF0YUNvZGVJbmZvO1xuXG4gICAgY29uc3RydWN0b3IoUGFyc2VBcnJheTogU3BsaXRUZXh0W10pIHtcbiAgICAgICAgc3VwZXIoUGFyc2VBcnJheSk7XG4gICAgICAgIHRoaXMuRGF0YUNvZGUgPSB7IHRleHQ6IFwiXCIsIGlucHV0czogW10gfTtcbiAgICAgICAgdGhpcy5DcmVhdGVEYXRhQ29kZSgpO1xuICAgIH1cblxuICAgIGdldCBDb2RlQnVpbGRUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS50ZXh0O1xuICAgIH1cblxuICAgIHNldCBDb2RlQnVpbGRUZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBBbGxJbnB1dHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLmlucHV0cztcbiAgICB9XG5cbiAgICBwcml2YXRlIENyZWF0ZURhdGFDb2RlKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19za2lwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGA8fCR7dGhpcy5EYXRhQ29kZS5pbnB1dHMubGVuZ3RofXwke2kudHlwZV9uYW1lID8/ICcnfXw+YDtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLmlucHV0cy5wdXNoKGkudGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpZiB0aGUgPHx8PiBzdGFydCB3aXRoIGEgKCsuKSBsaWtlIHRoYXQgZm9yIGV4YW1wbGUsIFwiKy48fHw+XCIsIHRoZSB1cGRhdGUgZnVuY3Rpb24gd2lsbCBnZXQgdGhlIGxhc3QgXCJTa2lwVGV4dFwiIGluc3RlYWQgZ2V0dGluZyB0aGUgbmV3IG9uZVxuICAgICAqIHNhbWUgd2l0aCBhICgtLikganVzdCBmb3IgaWdub3JpbmcgY3VycmVudCB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHRoZSBidWlsZGVkIGNvZGVcbiAgICAgKi9cbiAgICBCdWlsZENvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuRGF0YUNvZGUudGV4dC5yZXBsYWNlKC88XFx8KFswLTldKylcXHxbXFx3XSpcXHw+L2dpLCAoXywgZzEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLmlucHV0c1tnMV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5SZXBsYWNlQWxsKG5ld1N0cmluZywgJzx8LXw+JywgJzx8fD4nKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgTG9nVG9IVE1MIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIGlmIChpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pYDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGVTYWZlKCR7c3Vic3RyaW5nfSlgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWJ1Z1wiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYFxcbnJ1bl9zY3JpcHRfbmFtZSA9IFxcYCR7SlNQYXJzZXIuZml4VGV4dChzdWJzdHJpbmcpfVxcYGBcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZSAhPSAndGV4dCcgJiYgIXN1YnN0cmluZy5lbmRzV2l0aCgnOycpKVxuICAgICAgICAgICAgICAgIHN1YnN0cmluZy5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCc7JylcblxuICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogc3Vic3RyaW5nLFxuICAgICAgICAgICAgICAgIHR5cGU6IDxhbnk+dHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dCh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL2AvZ2ksICdcXFxcYCcpLnJlcGxhY2UoL1xcdTAwMjQvZ2ksICdcXFxcdTAwMjQnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dFNpbXBsZVF1b3Rlcyh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyk7XG4gICAgfVxuXG4gICAgUmVCdWlsZFRleHQoKSB7XG4gICAgICAgIGNvbnN0IGFsbGNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpLnR5cGUgPT0gJ25vLXRyYWNrJykge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCAnIScsIGkudGV4dCwgdGhpcy5lbmQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCBpLnRleHQsIHRoaXMuZW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxjb2RlO1xuICAgIH1cblxuICAgIEJ1aWxkQWxsKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcnVuU2NyaXB0ID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyRgXFxub3V0X3J1bl9zY3JpcHQudGV4dCs9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1ZyAmJiBpLnR5cGUgPT0gJ3NjcmlwdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgXFxucnVuX3NjcmlwdF9jb2RlPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyaXB0V2l0aEluZm8oaS50ZXh0KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHByaW50RXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgPGRpdiBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+JHtKU1BhcnNlci5maXhUZXh0KExvZ1RvSFRNTChtZXNzYWdlKSl9PC9kaXY+YDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgUnVuQW5kRXhwb3J0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGV4dCwgcGF0aClcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG4gICAgICAgIHJldHVybiBwYXJzZXIuQnVpbGRBbGwoaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3BsaXQyRnJvbUVuZCh0ZXh0OiBzdHJpbmcsIHNwbGl0Q2hhcjogc3RyaW5nLCBudW1Ub1NwbGl0RnJvbUVuZCA9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRleHQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0ZXh0W2ldID09IHNwbGl0Q2hhcikge1xuICAgICAgICAgICAgICAgIG51bVRvU3BsaXRGcm9tRW5kLS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1Ub1NwbGl0RnJvbUVuZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0ZXh0LnN1YnN0cmluZygwLCBpKSwgdGV4dC5zdWJzdHJpbmcoaSArIDEpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdGV4dF07XG4gICAgfVxufVxuXG5cbi8vYnVpbGQgc3BlY2lhbCBjbGFzcyBmb3IgcGFyc2VyIGNvbW1lbnRzIC8qKi8gc28geW91IGJlIGFibGUgdG8gYWRkIFJhem9yIGluc2lkZSBvZiBzdHlsZSBvdCBzY3JpcHQgdGFnXG5cbmludGVyZmFjZSBHbG9iYWxSZXBsYWNlQXJyYXkge1xuICAgIHR5cGU6ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBjbGFzcyBFbmFibGVHbG9iYWxSZXBsYWNlIHtcbiAgICBwcml2YXRlIHNhdmVkQnVpbGREYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXlbXSA9IFtdO1xuICAgIHByaXZhdGUgYnVpbGRDb2RlOiBSZUJ1aWxkQ29kZVN0cmluZztcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIHJlcGxhY2VyOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkZFRleHQgPSBcIlwiKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZXIgPSBSZWdFeHAoYCR7YWRkVGV4dH1cXFxcL1xcXFwqIXN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+XFxcXCpcXFxcL3xzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PmApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoY29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYnVpbGRDb2RlID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKGF3YWl0IFBhcnNlVGV4dFN0cmVhbShhd2FpdCB0aGlzLkV4dHJhY3RBbmRTYXZlQ29kZShjb2RlKSkpO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvZGUgPSBuZXcgSlNQYXJzZXIoY29kZSwgdGhpcy5wYXRoKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvZGUuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvZGUudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVkQnVpbGREYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkudGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gYHN5c3RlbS0tPHxlanN8JHtjb3VudGVyKyt9fD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBQYXJzZU91dHNpZGVPZkNvbW1lbnQodGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlcigvc3lzdGVtLS08XFx8ZWpzXFx8KFswLTldKVxcfD4vLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gU3BsaXRUb1JlcGxhY2VbMV07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoaW5kZXguU3RhcnRJbmZvKS5QbHVzJGAke3RoaXMuYWRkVGV4dH0vKiFzeXN0ZW0tLTx8ZWpzfCR7aW5kZXh9fD4qL2A7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBTdGFydEJ1aWxkKCkge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29tbWVudHMgPSBuZXcgSlNQYXJzZXIobmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCksIHRoaXMucGF0aCwgJy8qJywgJyovJyk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb21tZW50cy5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29tbWVudHMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGkudGV4dCA9IHRoaXMuUGFyc2VPdXRzaWRlT2ZDb21tZW50KGkudGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0ID0gZXh0cmFjdENvbW1lbnRzLlJlQnVpbGRUZXh0KCkuZXE7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29kZS5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlc3RvcmVBc0NvZGUoRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihEYXRhLnRleHQuU3RhcnRJbmZvKS5QbHVzJGA8JSR7RGF0YS50eXBlID09ICduby10cmFjaycgPyAnIScgOiAnJ30ke0RhdGEudGV4dH0lPmA7XG4gICAgfVxuXG4gICAgcHVibGljIFJlc3RvcmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZXIodGhpcy5yZXBsYWNlciwgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihTcGxpdFRvUmVwbGFjZVsxXSA/PyBTcGxpdFRvUmVwbGFjZVsyXSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLlJlc3RvcmVBc0NvZGUodGhpcy5zYXZlZEJ1aWxkRGF0YVtpbmRleF0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwgImltcG9ydCB7IG1pbmlmeSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuL3ByaW50TWVzc2FnZSc7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeUpTKHRleHQ6IHN0cmluZywgdHJhY2tlcjogU3RyaW5nVHJhY2tlcil7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBtaW5pZnkodGV4dCkpLmNvZGVcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodHJhY2tlciwgZXJyKVxuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbn0iLCAiaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU1dDRXJyb3IoZXJyOiB7bWVzc2FnZTogc3RyaW5nLCBzdGFjazogc3RyaW5nLCBjb2RlOiBzdHJpbmd9LCBjaGFuZ2VMb2NhdGlvbnMgPSAobGluZTogbnVtYmVyLCBjaGFyOiBudW1iZXIsIGluZm86IHN0cmluZykgPT4ge3JldHVybiB7bGluZSwgY2hhciwgaW5mb319KXtcbiAgICBjb25zdCBzcGxpdERhdGE6c3RyaW5nW10gPSBlcnIuc3RhY2sudHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBlcnJvckZpbGVBc0luZGV4ID0gc3BsaXREYXRhLnJldmVyc2UoKS5maW5kSW5kZXgoKHg6c3RyaW5nKSA9PiB4LmluY2x1ZGVzKCcvLyEnKSlcblxuICAgIGlmKGVycm9yRmlsZUFzSW5kZXggPT0gLTEpe1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgvKDtbMC05XW0pKC4qPylcXFswbTooWzAtOV0rKTooWzAtOV0rKVxcXS8sIChfLCBzdGFydCwgZmlsZSwgZzEsIGcyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBjaGFuZ2VMb2NhdGlvbnMoTnVtYmVyKGcxKSwgTnVtYmVyKGcyKSwgZmlsZSlcbiAgICAgICAgICAgIHJldHVybiBgJHtzdGFydH0ke2luZm99OiR7bGluZX06JHtjaGFyfV1gXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogZXJyLmNvZGUsXG4gICAgICAgICAgICBlcnJvckxpbmVzOiBzcGxpdERhdGFbMF0sXG4gICAgICAgICAgICBlcnJvckZpbGU6IHNwbGl0RGF0YVswXSxcbiAgICAgICAgICAgIHNpbXBsZU1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICBmdWxsTWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JGaWxlID0gc3BsaXREYXRhW2Vycm9yRmlsZUFzSW5kZXhdLnNwbGl0KCcvLyEnKS5wb3AoKVxuICAgIGNvbnN0IGVycm9yTGluZXMgPSBzcGxpdERhdGEuc2xpY2Uoc3BsaXREYXRhLmxlbmd0aCAtIGVycm9yRmlsZUFzSW5kZXgsIC0gMykubWFwKHggPT4gIHguc3Vic3RyaW5nKHguaW5kZXhPZignXHUyNTAyJykrMSkpLmpvaW4oJ1xcbicpO1xuXG4gICAgbGV0IGVycm9yQ29kZTpzdHJpbmcgPSBzcGxpdERhdGEuYXQoLTIpO1xuICAgIGVycm9yQ29kZSA9IGVycm9yQ29kZS5zdWJzdHJpbmcoZXJyb3JDb2RlLmluZGV4T2YoJ2AnKSkuc3BsaXQoJ1swbScpLnNoaWZ0KCkudHJpbSgpO1xuXG4gICAgY29uc3QgZGF0YUVycm9yID0ge1xuICAgICAgICBnZXQgc2ltcGxlTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5lcnJvckNvZGV9LCBvbiBmaWxlIC0+PGNvbG9yPlxcbiR7ZGF0YUVycm9yLmVycm9yRmlsZX1gXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmdWxsTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5zaW1wbGVNZXNzYWdlfVxcbkxpbmVzOiAke2RhdGFFcnJvci5lcnJvckxpbmVzfWBcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JGaWxlLFxuICAgICAgICBlcnJvckxpbmVzLFxuICAgICAgICBlcnJvckNvZGVcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFFcnJvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCBwYXJzZUVycm9yID0gcGFyc2VTV0NFcnJvcihlcnIpO1xuICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICB0ZXh0OiBwYXJzZUVycm9yLmZ1bGxNZXNzYWdlXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgcmV0dXJuIHBhcnNlRXJyb3I7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnI6IGFueSwgc291cmNlTWFwOiBSYXdTb3VyY2VNYXAsIHNvdXJjZUZpbGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIFxuICAgIGNvbnN0IHBhcnNlRXJyb3IgPSBwYXJzZVNXQ0Vycm9yKGVyciwgKGxpbmUsIGNvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmUsIGNvbHVtbn0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lOiBwb3NpdGlvbi5saW5lLFxuICAgICAgICAgICAgY2hhcjogcG9zaXRpb24uY29sdW1uLFxuICAgICAgICAgICAgaW5mbzogc291cmNlRmlsZSA/PyBwb3NpdGlvbi5zb3VyY2VcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgIHRleHQ6IHBhcnNlRXJyb3IuZnVsbE1lc3NhZ2VcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICByZXR1cm4gcGFyc2VFcnJvcjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIGVycjogYW55KSB7XG5cbiAgICBjb25zdCBwYXJzZUVycm9yID0gcGFyc2VTV0NFcnJvcihlcnIsIChsaW5lLCBjb2x1bW4sIGluZm8pID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBiYXNlLm9yaWdpbmFsUG9zaXRpb25Gb3IobGluZSwgY29sdW1uKVxuICAgICAgICByZXR1cm4gPGFueT57XG4gICAgICAgICAgICAuLi5wb3NpdGlvbixcbiAgICAgICAgICAgIGluZm86IHBvc2l0aW9uLnNlYXJjaExpbmUuZXh0cmFjdEluZm8oKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgdGV4dDogcGFyc2VFcnJvci5mdWxsTWVzc2FnZVxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIHJldHVybiBwYXJzZUVycm9yO1xufVxuXG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBtaW5pZnlKUyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvbWluaWZ5JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgcGFyYW1zOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBzZWxlY3Rvcjogc3RyaW5nLCBtYWluQ29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBKU1BhcnNlci5SdW5BbmRFeHBvcnQobWFpbkNvZGUsIHBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkIGBmdW5jdGlvbiAke25hbWV9KHske3BhcmFtc319LCBzZWxlY3RvciR7c2VsZWN0b3IgPyBgID0gXCIke3NlbGVjdG9yfVwiYDogJyd9LCBvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30pe1xuICAgICAgICBjb25zdCB7d3JpdGUsIHdyaXRlU2FmZSwgc2V0UmVzcG9uc2UsIHNlbmRUb1NlbGVjdG9yfSA9IG5ldyBidWlsZFRlbXBsYXRlKG91dF9ydW5fc2NyaXB0KTtcbiAgICAgICAgJHthd2FpdCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUocGFyc2UpfVxuICAgICAgICB2YXIgZXhwb3J0cyA9ICR7bmFtZX0uZXhwb3J0cztcbiAgICAgICAgcmV0dXJuIHNlbmRUb1NlbGVjdG9yKHNlbGVjdG9yLCBvdXRfcnVuX3NjcmlwdC50ZXh0KTtcbiAgICB9XFxuJHtuYW1lfS5leHBvcnRzID0ge307YFxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHthc3luYzogbnVsbH0pO1xuXG4gICAgbGV0IHNjcmlwdEluZm8gPSBhd2FpdCB0ZW1wbGF0ZShcbiAgICAgICAgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMsXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcignbmFtZScsICdjb25uZWN0JyksXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcigncGFyYW1zJywgJycpLFxuICAgICAgICBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3NlbGVjdG9yJywgJycpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBtYXAgPSB0eXBlb2Ygc291cmNlTWFwID09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShzb3VyY2VNYXApOiBzb3VyY2VNYXA7XG5cbiAgICBjb25zdCB0cmFja0NvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICBjb25zdCBzcGxpdExpbmVzID0gdHJhY2tDb2RlLnNwbGl0KCdcXG4nKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBpc01hcCA9IHNwbGl0TGluZXNbbS5nZW5lcmF0ZWRMaW5lIC0gMV07XG4gICAgICAgIGlmICghaXNNYXApIHJldHVybjtcblxuXG4gICAgICAgIGxldCBjaGFyQ291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaXNNYXAuc3Vic3RyaW5nKG0uZ2VuZXJhdGVkQ29sdW1uID8gbS5nZW5lcmF0ZWRDb2x1bW4gLSAxOiAwKS5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICAgICAgaS5pbmZvID0gbS5zb3VyY2U7XG4gICAgICAgICAgICBpLmxpbmUgPSBtLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAgIGkuY2hhciA9IGNoYXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2tDb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ICA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgaXRlbS5pbmZvID0gaW5mbztcbiAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYWNrVG9PcmlnaW5hbChvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG5ld1RyYWNrZXIgPSBhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZSwgc291cmNlTWFwKTtcbiAgICBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyKTtcbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlciwgbXlTb3VyY2U6IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBpZihpdGVtLmluZm8gPT0gbXlTb3VyY2Upe1xuICAgICAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXS5hdChpdGVtLmNoYXItMSk/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW0uaW5mbykge1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKGl0ZW0uaW5mbykpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsU3NzKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyLCBteVNvdXJjZSk7XG5cbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0sIEpzY0NvbmZpZyB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlJztcbmltcG9ydCB7IENvbW1vbmpzLCBEZWNvcmF0b3JzLCBlc1RhcmdldCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJhbnNwaWxlcldpdGhPcHRpb25zKEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBsYW5ndWFnZTogc3RyaW5nLCBzb3VyY2VNYXBzOiBib29sZWFuLCBCZXR3ZWVuVGFnRGF0YVN0cmluZyA9IEJldHdlZW5UYWdEYXRhLmVxLCBvcHRpb25zPzogSnNjQ29uZmlnKSB7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAgICAgIGZpbGVuYW1lOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlTWFwcyxcbiAgICAgICAganNjOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IGVzVGFyZ2V0LFxuICAgICAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgICB9LFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgRGVjb3JhdG9ycyhBZGRPcHRpb25zLmpzYykucGFyc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICBzeW50YXg6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwiVFNPcHRpb25zXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMuanNjLnBhcnNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3ludGF4OiAnZWNtYXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgICAgIGpzeDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgICAgICBEZWNvcmF0b3JzKEFkZE9wdGlvbnMuanNjKS5wYXJzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ2VjbWFzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICBqc3g6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcIlRTWE9wdGlvbnNcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IG1hcCwgY29kZSB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhU3RyaW5nLCBBZGRPcHRpb25zKTtcblxuICAgICAgICByZXN1bHRDb2RlID0gY29kZTtcbiAgICAgICAgcmVzdWx0TWFwID0gbWFwO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cbiAgICByZXR1cm4geyByZXN1bHRDb2RlLCByZXN1bHRNYXAgfVxufSIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSwgSnNjQ29uZmlnIH0gZnJvbSAnQHN3Yy9jb3JlJztcblxuXG5leHBvcnQgY29uc3QgZXNUYXJnZXQgPSAnZXMyMDIyJztcblxuZXhwb3J0IGZ1bmN0aW9uIERlY29yYXRvcnMoZGF0YTogSnNjQ29uZmlnKXtcbiAgICBkYXRhLnRyYW5zZm9ybSA9IHtcbiAgICAgICAgbGVnYWN5RGVjb3JhdG9yOiB0cnVlLFxuICAgICAgICBkZWNvcmF0b3JNZXRhZGF0YTogdHJ1ZVxuICAgIH1cbiAgICBkYXRhLnBhcnNlci5kZWNvcmF0b3JzID0gdHJ1ZVxuICAgIHJldHVybiBkYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFuc2Zvcm1KU0MoZGF0YT86IEpzY0NvbmZpZyk6IEpzY0NvbmZpZ3tcbiAgICByZXR1cm4gRGVjb3JhdG9ycyh7XG4gICAgICAgIHRhcmdldDogZXNUYXJnZXQsXG4gICAgICAgIC4uLmRhdGFcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tbW9uanMoZGF0YTogVHJhbnNmb3JtT3B0aW9ucyl7XG4gICAgZGF0YS5tb2R1bGUgPSB7XG4gICAgICAgIHR5cGU6ICdjb21tb25qcycsXG4gICAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgICAgIHN0cmljdE1vZGU6IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgdHJhbnNwaWxlcldpdGhPcHRpb25zIH0gZnJvbSAnLi9sb2FkLW9wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IHtyZXN1bHRDb2RlLCByZXN1bHRNYXB9ID0gYXdhaXQgdHJhbnNwaWxlcldpdGhPcHRpb25zKEJldHdlZW5UYWdEYXRhLCBsYW5ndWFnZSwgZmFsc2UsIEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCB7cHJlc2VydmVBbGxDb21tZW50czogdHJ1ZX0pXG4gICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihyZXN1bHRDb2RlLCByZXN1bHRNYXApKTtcbiBcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgdHJhbnNwaWxlcldpdGhPcHRpb25zIH0gZnJvbSAnLi9sb2FkLW9wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLnBvcFN0cmluZygndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBjb25zdCB7cmVzdWx0Q29kZSwgcmVzdWx0TWFwfSA9IGF3YWl0IHRyYW5zcGlsZXJXaXRoT3B0aW9ucyhCZXR3ZWVuVGFnRGF0YSwgbGFuZ3VhZ2UsIHNlc3Npb25JbmZvLmRlYnVnKVxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZShpc01vZGVsID8gJ21vZHVsZScgOiAnc2NyaXB0JywgdGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdE1hcCkge1xuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoSlNPTi5wYXJzZShyZXN1bHRNYXApLCBCZXR3ZWVuVGFnRGF0YSwgcmVzdWx0Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFRleHQocmVzdWx0Q29kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBpZiAoZGF0YVRhZy5leGlzdHMoJ3NyYycpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke0JldHdlZW5UYWdEYXRhfTwvc2NyaXB0PmBcbiAgICAgICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnanMnKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKSB7XG4gICAgICAgIHJldHVybiBzY3JpcHRXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JpcHRXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdIDogZ2V0VHlwZXMubm9kZV9tb2R1bGVzWzBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKHVybCwgcGF0aFRvRmlsZVVSTChvcmlnaW5hbFBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFsnc2NzcycsICdzYXNzJ10uaW5jbHVkZXMobGFuZ3VhZ2UpID8gU29tZVBsdWdpbnMoXCJNaW5BbGxcIiwgXCJNaW5TYXNzXCIpIDogU29tZVBsdWdpbnMoXCJNaW5Dc3NcIiwgXCJNaW5BbGxcIikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3R5bGUobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPjxjb2xvcj4ke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzdHlsZScsIGRhdGFUYWcsICBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0Py5zb3VyY2VNYXApXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihTb3VyY2VNYXBTdG9yZS5maXhVUkxTb3VyY2VNYXAoPGFueT5yZXN1bHQuc291cmNlTWFwKSwgQmV0d2VlblRhZ0RhdGEsIG91dFN0eWxlKTtcbiAgICBlbHNlXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB7IHRleHQ6IG91dFN0eWxlIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc3R5bGVXaXRoU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzdHlsZVdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbGFuZycsICdjc3MnKTtcblxuICAgIGlmKGRhdGFUYWcucG9wQm9vbGVhbignc2VydmVyJykpe1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IHBhdGhfbm9kZS5qb2luKHNtYWxsUGF0aCwgJy8uLi8nLCBpbnB1dFBhdGgpO1xuICAgIH1cblxuICAgIGlmICghcGF0aF9ub2RlLmV4dG5hbWUoaW5wdXRQYXRoKSlcbiAgICAgICAgaW5wdXRQYXRoICs9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7IENvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkIH0gfSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdChcImZyb21cIik7XG5cbiAgICBjb25zdCBpblN0YXRpYyA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHNtYWxsUGF0aFRvUGFnZSh0eXBlLmV4dHJhY3RJbmZvKCkpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWMsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogPGNvbG9yPiR7dHlwZS5hdCgwKS5saW5lSW5mb30gLT4gJHtGdWxsUGF0aH1gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAncGFnZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgSlNQYXJzZXIucHJpbnRFcnJvcihgUGFnZSBub3QgZm91bmQ6ICR7QmFzaWNTZXR0aW5ncy5yZWxhdGl2ZSh0eXBlLmxpbmVJbmZvKX0gLT4gJHtTbWFsbFBhdGh9YCkpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtpblN0YXRpY107XG4gICAgaWYgKCFoYXZlQ2FjaGUgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKG51bGwsIGhhdmVDYWNoZS5uZXdTZXNzaW9uLmRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvOiBuZXdTZXNzaW9uIH0gPSBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShpblN0YXRpYywgZ2V0VHlwZXMuU3RhdGljLCB7IG5lc3RlZFBhZ2U6IHBhdGhOYW1lLCBuZXN0ZWRQYWdlRGF0YTogZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb2JqZWN0JykgfSk7XG4gICAgICAgIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzW1NtYWxsUGF0aF0gPSBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcy50aGlzUGFnZTtcbiAgICAgICAgZGVsZXRlIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBjYWNoZU1hcFtpblN0YXRpY10gPSB7IENvbXBpbGVkRGF0YTogPFN0cmluZ1RyYWNrZXI+Q29tcGlsZWREYXRhLCBuZXdTZXNzaW9uIH07XG4gICAgICAgIFJldHVybkRhdGEgPSA8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW2luU3RhdGljXTtcblxuICAgICAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMpO1xuICAgICAgICBzZXNzaW9uSW5mby5leHRlbmRzKG5ld1Nlc3Npb24pXG5cbiAgICAgICAgUmV0dXJuRGF0YSA9IENvbXBpbGVkRGF0YTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogUmV0dXJuRGF0YVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuL0Vhc3lGc1wiO1xuXG4vKiBJdCdzIGEgSlNPTiBmaWxlIG1hbmFnZXIgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlSlNPTiB7XG4gICAgcHJpdmF0ZSBzYXZlUGF0aDogc3RyaW5nO1xuICAgIHN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGF1dG9Mb2FkID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNhdmVQYXRoID0gYCR7U3lzdGVtRGF0YX0vJHtmaWxlUGF0aH0uanNvbmA7XG4gICAgICAgIGF1dG9Mb2FkICYmIHRoaXMubG9hZEZpbGUoKTtcblxuICAgICAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcHJvY2Vzcy5leGl0KCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkRmlsZSgpIHtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuc2F2ZVBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IEpTT04ucGFyc2UoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMuc2F2ZVBhdGgpIHx8ICd7fScpO1xuICAgIH1cblxuICAgIHVwZGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUga2V5IGlzIGluIHRoZSBzdG9yZSwgcmV0dXJuIHRoZSB2YWx1ZS4gSWYgbm90LCBjcmVhdGUgYSBuZXcgdmFsdWUsIHN0b3JlIGl0LCBhbmQgcmV0dXJuIGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gbG9vayB1cCBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIFtjcmVhdGVdIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdHJpbmcuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIG9mIHRoZSBrZXkgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIGhhdmUoa2V5OiBzdHJpbmcsIGNyZWF0ZT86ICgpID0+IHN0cmluZykge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RvcmVba2V5XTtcbiAgICAgICAgaWYgKGl0ZW0gfHwgIWNyZWF0ZSkgcmV0dXJuIGl0ZW07XG5cbiAgICAgICAgaXRlbSA9IGNyZWF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZShrZXksIGl0ZW0pO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdGhpcy5zdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVtpXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbaV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmUoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZSh0aGlzLnNhdmVQYXRoLCB0aGlzLnN0b3JlKTtcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4vU3RvcmVKU09OXCI7XG5cbmV4cG9ydCBjb25zdCBwYWdlRGVwcyA9IG5ldyBTdG9yZUpTT04oJ1BhZ2VzSW5mbycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYW55IG9mIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhlIHBhZ2UgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtTdHJpbmdOdW1iZXJNYXB9IGRlcGVuZGVuY2llcyAtIEEgbWFwIG9mIGRlcGVuZGVuY2llcy4gVGhlIGtleSBpcyB0aGUgcGF0aCB0byB0aGUgZmlsZSwgYW5kXG4gKiB0aGUgdmFsdWUgaXMgdGhlIGxhc3QgbW9kaWZpZWQgdGltZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOnN0cmluZywgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSBwYWdlRGVwcy5zdG9yZVtwYXRoXSkge1xuICAgIGZvciAoY29uc3QgaSBpbiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCAgKyAgKGkgPT0gJ3RoaXNQYWdlJyA/IHBhdGg6IGkpO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gZGVwZW5kZW5jaWVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gIWRlcGVuZGVuY2llcztcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcik6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvKTtcblxuICAgIGNvbXBpbGVkU3RyaW5nLlBsdXMkIGA8JXslPiR7QmV0d2VlblRhZ0RhdGF9PCV9JT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWdpc3RlckV4dGVuc2lvbiBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3Nzcic7XG5pbXBvcnQgeyByZWJ1aWxkRmlsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUsIHsgcmVzb2x2ZSwgY2xlYXJNb2R1bGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENhcGl0YWxpemUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuYXN5bmMgZnVuY3Rpb24gc3NySFRNTChkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBGdWxsUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZyxzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgZ2V0ViA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZ3YgPSAobmFtZTogc3RyaW5nKSA9PiBkYXRhVGFnLnBvcEFueURlZmF1bHQobmFtZSwnJykudHJpbSgpLFxuICAgICAgICAgICAgdmFsdWUgPSBndignc3NyJyArIENhcGl0YWxpemUobmFtZSkpIHx8IGd2KG5hbWUpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZSA/IGV2YWwoYCh7JHt2YWx1ZX19KWApIDoge307XG4gICAgfTtcbiAgICBjb25zdCBidWlsZFBhdGggPSBhd2FpdCByZWdpc3RlckV4dGVuc2lvbihGdWxsUGF0aCwgc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG4gICAgY29uc3QgbW9kZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShidWlsZFBhdGgpO1xuXG4gICAgY29uc3QgeyBodG1sLCBoZWFkIH0gPSBtb2RlLmRlZmF1bHQucmVuZGVyKGdldFYoJ3Byb3BzJyksIGdldFYoJ29wdGlvbnMnKSk7XG4gICAgc2Vzc2lvbkluZm8uaGVhZEhUTUwgKz0gaGVhZDtcbiAgICByZXR1cm4gaHRtbDtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IExhc3RTbWFsbFBhdGggPSB0eXBlLmV4dHJhY3RJbmZvKCksIExhc3RGdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgTGFzdFNtYWxsUGF0aDtcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKExhc3RGdWxsUGF0aCwgTGFzdFNtYWxsUGF0aCwgZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnZnJvbScpLCBnZXRUeXBlcy5TdGF0aWNbMl0sICdzdmVsdGUnKTtcbiAgICBjb25zdCBpbldlYlBhdGggPSByZWxhdGl2ZShnZXRUeXBlcy5TdGF0aWNbMl0sIFNtYWxsUGF0aCkucmVwbGFjZSgvXFxcXC9naSwgJy8nKTtcblxuICAgIHNlc3Npb25JbmZvLnN0eWxlKCcvJyArIGluV2ViUGF0aCArICcuY3NzJyk7XG5cbiAgICBjb25zdCBpZCA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnaWQnLCBCYXNlNjRJZChpbldlYlBhdGgpKSxcbiAgICAgICAgaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KG5hbWUsICcnKS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPyBgLCR7bmFtZX06eyR7dmFsdWV9fWAgOiAnJztcbiAgICAgICAgfSwgc2VsZWN0b3IgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdzZWxlY3RvcicpO1xuXG4gICAgY29uc3Qgc3NyID0gIXNlbGVjdG9yICYmIGRhdGFUYWcucG9wQm9vbGVhbignc3NyJykgPyBhd2FpdCBzc3JIVE1MKGRhdGFUYWcsIEZ1bGxQYXRoLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKSA6ICcnO1xuXG5cbiAgICBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ21vZHVsZScsIGRhdGFUYWcsIHR5cGUpLmFkZFRleHQoXG5gaW1wb3J0IEFwcCR7aWR9IGZyb20gJy8ke2luV2ViUGF0aH0nO1xuY29uc3QgdGFyZ2V0JHtpZH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiJHtzZWxlY3RvciA/IHNlbGVjdG9yIDogJyMnICsgaWR9XCIpO1xudGFyZ2V0JHtpZH0gJiYgbmV3IEFwcCR7aWR9KHtcbiAgICB0YXJnZXQ6IHRhcmdldCR7aWR9XG4gICAgJHtoYXZlKCdwcm9wcycpICsgaGF2ZSgnb3B0aW9ucycpfSR7c3NyID8gJywgaHlkcmF0ZTogdHJ1ZScgOiAnJ31cbn0pO2ApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHNlbGVjdG9yID8gJycgOiBgPGRpdiBpZD1cIiR7aWR9XCI+JHtzc3J9PC9kaXY+YCksXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUlkKHRleHQ6IHN0cmluZywgbWF4ID0gMTApe1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh0ZXh0KS50b1N0cmluZygnYmFzZTY0Jykuc3Vic3RyaW5nKDAsIG1heCkucmVwbGFjZSgvXFwrLywgJ18nKS5yZXBsYWNlKC9cXC8vLCAnXycpO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCAgeyBDYXBpdGFsaXplLCBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBDb21waWxlT3B0aW9ucyB9IGZyb20gXCJzdmVsdGUvdHlwZXMvY29tcGlsZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY2xlYXJNb2R1bGUsIHJlc29sdmUgfSBmcm9tIFwiLi4vLi4vcmVkaXJlY3RDSlNcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWdpc3RlckV4dGVuc2lvbihmaWxlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IG5hbWUgPSBwYXRoLnBhcnNlKGZpbGVQYXRoKS5uYW1lLnJlcGxhY2UoL15cXGQvLCAnXyQmJykucmVwbGFjZSgvW15hLXpBLVowLTlfJF0vZywgJycpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogQ29tcGlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgbmFtZTogQ2FwaXRhbGl6ZShuYW1lKSxcbiAgICAgICAgZ2VuZXJhdGU6ICdzc3InLFxuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBkZXY6IHNlc3Npb25JbmZvLmRlYnVnLFxuICAgICAgICBlcnJvck1vZGU6ICd3YXJuJ1xuICAgIH07XG5cbiAgICBjb25zdCBpblN0YXRpY0ZpbGUgPSBwYXRoLnJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgc21hbGxQYXRoKTtcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY0ZpbGU7XG5cbiAgICBjb25zdCBmdWxsSW1wb3J0UGF0aCA9IGZ1bGxDb21waWxlUGF0aCArICcuc3NyLmNqcyc7XG4gICAgY29uc3Qge3N2ZWx0ZUZpbGVzLCBjb2RlLCBtYXAsIGRlcGVuZGVuY2llc30gPSBhd2FpdCBwcmVwcm9jZXNzKGZpbGVQYXRoLCBzbWFsbFBhdGgsZnVsbEltcG9ydFBhdGgsZmFsc2UsJy5zc3IuY2pzJyk7XG4gICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsZGVwZW5kZW5jaWVzKTtcbiAgICBvcHRpb25zLnNvdXJjZW1hcCA9IG1hcDtcblxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgZm9yKGNvbnN0IGZpbGUgb2Ygc3ZlbHRlRmlsZXMpe1xuICAgICAgICBjbGVhck1vZHVsZShyZXNvbHZlKGZpbGUpKTsgLy8gZGVsZXRlIG9sZCBpbXBvcnRzXG4gICAgICAgIHByb21pc2VzLnB1c2gocmVnaXN0ZXJFeHRlbnNpb24oZmlsZSwgQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlKSwgc2Vzc2lvbkluZm8pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBjb25zdCB7IGpzLCBjc3MsIHdhcm5pbmdzIH0gPSBzdmVsdGUuY29tcGlsZShjb2RlLCA8YW55Pm9wdGlvbnMpO1xuICAgIFByaW50U3ZlbHRlV2Fybih3YXJuaW5ncywgZmlsZVBhdGgsIG1hcCk7XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSAnLycgKyBpblN0YXRpY0ZpbGUuc3BsaXQoL1xcL3xcXC8vKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiBmdWxsSW1wb3J0UGF0aDtcbn1cbiIsICJpbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgZXh0bmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgY3JlYXRlSW1wb3J0ZXIsIFByaW50U2Fzc0Vycm9yVHJhY2tlciwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwsIGJhY2tUb09yaWdpbmFsU3NzIH0gZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IHsgVHJhbnNmb3JtSlNDIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5ncyc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBhd2FpdCBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsPGFueT4gc291cmNlTWFwLCBzb3VyY2VNYXAuc291cmNlcy5maW5kKHggPT4geC5zdGFydHNXaXRoKCdkYXRhOicpKSksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydFsgXSp0eXBlfGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgaWYobGFuZyA9PSAndHMnICYmIGFyZ3NbNV0uZW5kc1dpdGgoJyB0eXBlJykpXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoYXJnc1sxMF0uZXEpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJycpXG4gICAgICAgICAgICBpZiAobGFuZyA9PSAndHMnKVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy50cycpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy5qcycpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGFyZ3NbMV0uUGx1cyhhcmdzWzldLCBhcmdzWzEwXSwgKGV4dCA9PSAnLnN2ZWx0ZScgPyBzdmVsdGVFeHQgOiAnJyksIGFyZ3NbOV0sIChhcmdzWzExXSA/PyAnJykpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJy5zdmVsdGUnKSB7XG4gICAgICAgICAgICBjb25uZWN0U3ZlbHRlLnB1c2goYXJnc1sxMF0uZXEpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhbmcgIT09ICd0cycgfHwgIWFyZ3NbNF0pXG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcblxuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgbWFwVG9rZW5baWRdID0gbmV3RGF0YTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYF9fX3RvS2VuXFxgJHtpZH1cXGBgKTtcbiAgICB9KTtcblxuICAgIGlmIChsYW5nICE9PSAndHMnKVxuICAgICAgICByZXR1cm4gY29udGVudDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSAoYXdhaXQgdHJhbnNmb3JtKGNvbnRlbnQuZXEsIHsgXG4gICAgICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICAgICAgcGFyc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ3R5cGVzY3JpcHQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzb3VyY2VNYXBzOiB0cnVlLFxuICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgXG4gICAgfSkpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgYmFja1RvT3JpZ2luYWwoY29udGVudCwgY29kZSwgbWFwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGNvbnRlbnQsIGVycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgfVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoL19fX3RvS2VuYChbXFx3XFxXXSs/KWAvbWksIGFyZ3MgPT4ge1xuICAgICAgICByZXR1cm4gbWFwVG9rZW5bYXJnc1sxXS5lcV0gPz8gbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzYXZlUGF0aCA9IHNtYWxsUGF0aCwgaHR0cFNvdXJjZSA9IHRydWUsIHN2ZWx0ZUV4dCA9ICcnKSB7ICAgIFxuICAgIGxldCB0ZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoc21hbGxQYXRoLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGxldCBzY3JpcHRMYW5nID0gJ2pzJywgc3R5bGVMYW5nID0gJ2Nzcyc7XG5cbiAgICBjb25zdCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSA9IFtdLCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzY3JpcHQpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHNjcmlwdExhbmcgPSBhcmdzWzRdPy5lcSA/PyAnanMnO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGF3YWl0IFNjcmlwdFN2ZWx0ZShhcmdzWzddLCBzY3JpcHRMYW5nLCBjb25uZWN0U3ZlbHRlLCBzdmVsdGVFeHQpLCBhcmdzWzhdKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0eWxlQ29kZSA9IGNvbm5lY3RTdmVsdGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuICAgIGxldCBoYWRTdHlsZSA9IGZhbHNlO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c3R5bGUpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGlmKHN0eWxlTGFuZyA9PSAnY3NzJykgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llczogZGVwcyB9ID0gYXdhaXQgU0FTU1N2ZWx0ZShhcmdzWzddLCBzdHlsZUxhbmcsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgc2NyaXB0TGFuZywgc3R5bGVMYW5nLCBjb2RlOiB0ZXh0LmVxLCBtYXA6IHRleHQuU3RyaW5nVGFjayhzYXZlUGF0aCwgaHR0cFNvdXJjZSksIGRlcGVuZGVuY2llczogc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBzdmVsdGVGaWxlczogY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiB4WzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1swXSArIHggOiBwYXRoLm5vcm1hbGl6ZShmdWxsUGF0aCArICcvLi4vJyArIHgpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuIiwgImltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSAnLi9FYXN5U3ludGF4JztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBDb21tb25qcywgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoL3dpbjMyJztcblxuZnVuY3Rpb24gRXJyb3JUZW1wbGF0ZShpbmZvOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBgbW9kdWxlLmV4cG9ydHMgPSAoKSA9PiAoRGF0YU9iamVjdCkgPT4gRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFxcYCR7SlNQYXJzZXIucHJpbnRFcnJvcihgU3ludGF4IEVycm9yOiAke2luZm99fWApfVxcYGA7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdGV4dCBcbiAqIEBwYXJhbSB0eXBlIFxuICogQHJldHVybnMgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgIHRleHQgPSB0ZXh0LnRyaW0oKTtcblxuICAgIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAgICAgIGpzYzogVHJhbnNmb3JtSlNDKHtcbiAgICAgICAgICAgIHBhcnNlcjoge1xuICAgICAgICAgICAgICAgIHN5bnRheDogaXNUeXBlc2NyaXB0ID8gJ3R5cGVzY3JpcHQnIDogJ2VjbWFzY3JpcHQnLFxuICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbigoaXNUeXBlc2NyaXB0ID8gJ1RTJyA6ICdKUycpICsgXCJPcHRpb25zXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmaWxlbmFtZTogc2Vzc2lvbkluZm8uc21hbGxQYXRoLFxuICAgICAgICBzb3VyY2VNYXBzOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0OiBTdHJpbmdUcmFja2VyXG5cbiAgICBjb25zdCBzY3JpcHREZWZpbmUgPSBhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxLCB7IGRlYnVnOiAnJyArIHNlc3Npb25JbmZvLmRlYnVnIH0pO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oc2NyaXB0RGVmaW5lLCBPcHRpb25zKTtcbiAgICAgICAgcmVzdWx0ID0gbWFwID8gYXdhaXQgYmFja1RvT3JpZ2luYWwodGV4dCwgY29kZSwgbWFwKSA6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBwYXJzZSA9IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcih0ZXh0LCBlcnIpO1xuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgcGFyc2UuZXJyb3JGaWxlID0gIEJhc2ljU2V0dGluZ3MucmVsYXRpdmUocGFyc2UuZXJyb3JGaWxlKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZShwYXJzZS5zaW1wbGVNZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIEVhc3lGcy5yZWFkSnNvbkZpbGUocGF0aCk7XG59IiwgImltcG9ydCB7IHByb21pc2VzIH0gZnJvbSBcImZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3YXNtTW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShhd2FpdCBwcm9taXNlcy5yZWFkRmlsZShwYXRoKSk7XG4gICAgY29uc3Qgd2FzbUluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKHdhc21Nb2R1bGUsIHt9KTtcbiAgICByZXR1cm4gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG59IiwgImltcG9ydCBqc29uIGZyb20gXCIuL2pzb25cIjtcbmltcG9ydCB3YXNtIGZyb20gXCIuL3dhc21cIjtcblxuZXhwb3J0IGNvbnN0IGN1c3RvbVR5cGVzID0gW1wianNvblwiLCBcIndhc21cIl07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEltcG9ydEJ5RXh0ZW5zaW9uKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKXtcbiAgICBzd2l0Y2godHlwZSl7XG4gICAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgICAgICByZXR1cm4ganNvbihwYXRoKVxuICAgICAgICBjYXNlIFwid2FzbVwiOlxuICAgICAgICAgICAgcmV0dXJuIHdhc20ocGF0aCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0KHBhdGgpXG4gICAgfVxufSIsICJpbXBvcnQgeyBjdXN0b21UeXBlcyB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vaW5kZXgnO1xuaW1wb3J0IHsgQmFzZVJlYWRlciB9IGZyb20gJy4uL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IEVuZE9mQmxvY2ssIEVuZE9mRGVmU2tpcEJsb2NrLCBQYXJzZVRleHRTdHJlYW0sIFJlQnVpbGRDb2RlU3RyaW5nIH0gZnJvbSAnLi9FYXN5U2NyaXB0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFzeVN5bnRheCB7XG4gICAgcHJpdmF0ZSBCdWlsZDogUmVCdWlsZENvZGVTdHJpbmc7XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJzZUFycmF5ID0gYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGNvZGUpO1xuICAgICAgICB0aGlzLkJ1aWxkID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKHBhcnNlQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0ID0gdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgY29uc3QgJHtkYXRhT2JqZWN0fSA9IGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0KHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydChyZXBsYWNlVG9UeXBlLCBkYXRhT2JqZWN0LCBpbmRleCl9O09iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtkYXRhT2JqZWN0fSlgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYGF3YWl0ICR7cmVwbGFjZVRvVHlwZX0oPHwke2luZGV4fXx8PilgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWN0aW9uU3RyaW5nRXhwb3J0QWxsKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHt0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbChyZXBsYWNlVG9UeXBlLCBpbmRleCl9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEltcG9ydFR5cGUodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAoYCR7dHlwZX1bIFxcXFxuXSsoW1xcXFwqXXswLDF9W1xcXFxwe0x9MC05XyxcXFxce1xcXFx9IFxcXFxuXSspWyBcXFxcbl0rZnJvbVsgXFxcXG5dKzxcXFxcfChbMC05XSspXFxcXHxcXFxcfD5gLCAndScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtYXRjaFsxXS50cmltKCk7XG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgbGV0IERhdGFPYmplY3Q6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGRhdGEuc3Vic3RyaW5nKDEpLnJlcGxhY2UoJyBhcyAnLCAnJykudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBTcGxpY2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWQgPSBkYXRhLnNwbGl0KCd9JywgMik7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMF0gKz0gJ30nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFNwbGljZWRbMV0gPSBTcGxpY2VkWzFdLnNwbGl0KCcsJykucG9wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJywnLCAxKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgU3BsaWNlZCA9IFNwbGljZWQubWFwKHggPT4geC50cmltKCkpLmZpbHRlcih4ID0+IHgubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzBdWzBdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gdGhpcy5CdWlsZC5BbGxJbnB1dHNbbWF0Y2hbMl1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnN1YnN0cmluZyhleHRlbnNpb24ubGFzdEluZGV4T2YoJy4nKSArIDEsIGV4dGVuc2lvbi5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBge2RlZmF1bHQ6JHtTcGxpY2VkWzBdfX1gOyAvL29ubHkgaWYgdGhpcyBpc24ndCBjdXN0b20gaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBgJHtEYXRhT2JqZWN0LnN1YnN0cmluZygwLCBEYXRhT2JqZWN0Lmxlbmd0aCAtIDEpfSxkZWZhdWx0OiR7U3BsaWNlZFsxXX19YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gRGF0YU9iamVjdC5yZXBsYWNlKC8gYXMgLywgJzonKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBEYXRhT2JqZWN0LCBtYXRjaFsyXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbk9uZVdvcmQodHlwZTogc3RyaW5nLCByZXBsYWNlVG9UeXBlID0gdHlwZSwgYWN0aW9uU3RyaW5nOiAocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSA9PiBzdHJpbmcgPSB0aGlzLmFjdGlvblN0cmluZ0ltcG9ydEFsbCkge1xuICAgICAgICBsZXQgYmVmb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaChuZXcgUmVnRXhwKHR5cGUgKyAnWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG5cbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBhY3Rpb25TdHJpbmcocmVwbGFjZVRvVHlwZSwgbWF0Y2hbMV0pO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nO1xuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGJlZm9yZVN0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoU3BhY2UoZnVuYzogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGZ1bmMoJyAnICsgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0KS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBEZWZpbmUoZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke2tleX0oW15cXFxccHtMfV0pYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB2YWx1ZSArIG1hdGNoWzJdXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW5Bc0Z1bmN0aW9uKHdvcmQ6IHN0cmluZywgdG9Xb3JkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlV2l0aFNwYWNlKHRleHQgPT4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChbXlxcXFxwe0x9XSkke3dvcmR9KFsgXFxcXG5dKlxcXFwoKWAsICdndWknKSwgKC4uLm1hdGNoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0gKyB0b1dvcmQgKyBtYXRjaFsyXVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRWYXJpYWJsZSgpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykodmFyfGxldHxjb25zdClbIFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopL3UpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgYmVmb3JlTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBjbG9zZUluZGV4ID0gYXdhaXQgRW5kT2ZEZWZTa2lwQmxvY2soYWZ0ZXJNYXRjaCxbJzsnLCAnXFxuJ10pO1xuXG4gICAgICAgICAgICBpZihjbG9zZUluZGV4ID09IC0xKXtcbiAgICAgICAgICAgICAgICBjbG9zZUluZGV4ID0gYWZ0ZXJNYXRjaC5sZW5ndGhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYmVmb3JlQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBjbG9zZUluZGV4KSwgYWZ0ZXJDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKGNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9O2V4cG9ydHMuJHttYXRjaFszXX09JHttYXRjaFszXX0ke2FmdGVyQ2xvc2V9YDtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwb3J0QmxvY2soKXtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaCgvKGV4cG9ydFsgXFxuXSspKGRlZmF1bHRbIFxcbl0rKT8oW14gXFxuXSkvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBsZXQgYmVmb3JlTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIGxldCByZW1vdmVFeHBvcnQgPSBtYXRjaFswXS5zdWJzdHJpbmcobWF0Y2hbMV0ubGVuZ3RoICsgKG1hdGNoWzJdIHx8ICcnKS5sZW5ndGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IG1hdGNoWzNdWzBdLCBpc0RlZmF1bHQgPSBCb29sZWFuKG1hdGNoWzJdKTtcbiAgICAgICAgICAgIGlmKGZpcnN0Q2hhcj09ICd7Jyl7XG4gICAgICAgICAgICAgICAgbGV0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGlmKGlzRGVmYXVsdCl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgJ2V4cG9ydHMuZGVmYXVsdD0nICsgcmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IGF3YWl0IEVuZE9mQmxvY2soYWZ0ZXJNYXRjaCwgWyd7JywgJ30nXSk7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZU1hdGNoICs9IGBPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7cmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgrMSl9KWA7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoZW5kSW5kZXgrMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgtMSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRXhwb3J0ID0gcmVtb3ZlRXhwb3J0LnNsaWNlKDAsIC0xKTtcblxuICAgICAgICAgICAgICAgIGxldCBjbG9zZUluZGV4ID0gYXdhaXQgRW5kT2ZEZWZTa2lwQmxvY2soYWZ0ZXJNYXRjaCxbJzsnLCAnXFxuJ10pO1xuICAgICAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUluZGV4ID0gYWZ0ZXJNYXRjaC50cmltRW5kKCkubGVuZ3RoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYmVmb3JlQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBjbG9zZUluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9ja01hdGNoID0gYmVmb3JlQ2xvc2UubWF0Y2goLyhmdW5jdGlvbnxjbGFzcylbIHxcXG5dKyhbXFxwe0x9XFwkX11bXFxwe0x9MC05XFwkX10qKT8vdSk7XG5cbiAgICAgICAgICAgICAgICBpZihibG9ja01hdGNoPy5bMl0peyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKGNsb3NlSW5kZXgpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2ggKyByZW1vdmVFeHBvcnQrIGJlZm9yZUNsb3NlfWV4cG9ydHMuJHtpc0RlZmF1bHQgPyAnZGVmYXVsdCc6IGJsb2NrTWF0Y2hbMl19PSR7YmxvY2tNYXRjaFsyXX0ke2FmdGVyQ2xvc2V9YDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNofWV4cG9ydHMuJHtiZWZvcmVDbG9zZS5zcGxpdCgvIHxcXG4vLCAxKS5wb3AoKX09JHtyZW1vdmVFeHBvcnQrIGFmdGVyTWF0Y2h9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEltcG9ydHMoZGVmaW5lRGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0KTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2luY2x1ZGUnKTtcblxuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdleHBvcnQnLCAncmVxdWlyZScsIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsKTtcbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbkFzRnVuY3Rpb24oJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG5cbiAgICAgICAgLy9lc20gdG8gY2pzIC0gZXhwb3J0XG4gICAgICAgIGF3YWl0IHRoaXMuZXhwb3J0VmFyaWFibGUoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRCbG9jaygpO1xuXG4gICAgICAgIGRlZmluZURhdGEgJiYgdGhpcy5EZWZpbmUoZGVmaW5lRGF0YSk7XG4gICAgfVxuXG4gICAgQnVpbHRTdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkJ1aWxkLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZTogc3RyaW5nLCBkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IEVhc3lTeW50YXgoKTtcbiAgICAgICAgYXdhaXQgYnVpbGRlci5sb2FkKGAgJHtjb2RlfSBgKTtcbiAgICAgICAgYXdhaXQgYnVpbGRlci5CdWlsZEltcG9ydHMoZGVmaW5lRGF0YSk7XG5cbiAgICAgICAgY29kZSA9IGJ1aWxkZXIuQnVpbHRTdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIGNvZGUuc3Vic3RyaW5nKDEsIGNvZGUubGVuZ3RoIC0gMSk7XG4gICAgfVxufSIsICJpbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZVwiO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwLCBTdHJpbmdNYXAsIFN0cmluZ051bWJlck1hcCwgIH0gZnJvbSBcIi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBpc1RzIH0gZnJvbSBcIi4vSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSBcIi4vdHJhbnNmb3JtL1NjcmlwdFwiO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSBcIi4vWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyXCI7XG5cblxuZXhwb3J0IHR5cGUgc2V0RGF0YUhUTUxUYWcgPSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcFxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JJbmZvID0ge1xuICAgIHR5cGU6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgc2VuZFRvOiBzdHJpbmcsXG4gICAgdmFsaWRhdG9yOiBzdHJpbmdbXSxcbiAgICBvcmRlcj86IHN0cmluZ1tdLFxuICAgIG5vdFZhbGlkPzogc3RyaW5nLFxuICAgIG1lc3NhZ2U/OiBzdHJpbmcgfCBib29sZWFuLFxuICAgIHJlc3BvbnNlU2FmZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgY29ubmVjdG9yQXJyYXkgPSBjb25uZWN0b3JJbmZvW11cblxuZXhwb3J0IHR5cGUgY2FjaGVDb21wb25lbnQgPSB7XG4gICAgW2tleTogc3RyaW5nXTogbnVsbCB8IHtcbiAgICAgICAgbXRpbWVNcz86IG51bWJlcixcbiAgICAgICAgdmFsdWU/OiBzdHJpbmdcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIGluVGFnQ2FjaGUgPSB7XG4gICAgc3R5bGU6IHN0cmluZ1tdXG4gICAgc2NyaXB0OiBzdHJpbmdbXVxuICAgIHNjcmlwdE1vZHVsZTogc3RyaW5nW11cbn1cblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU2hvcnRTY3JpcHROYW1lcycpO1xuXG4vKiBUaGUgU2Vzc2lvbkJ1aWxkIGNsYXNzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGhlYWQgb2YgdGhlIHBhZ2UgKi9cbmV4cG9ydCBjbGFzcyBTZXNzaW9uQnVpbGQge1xuICAgIGNvbm5lY3RvckFycmF5OiBjb25uZWN0b3JBcnJheSA9IFtdXG4gICAgcHJpdmF0ZSBzY3JpcHRVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgc3R5bGVVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgaW5TY3JpcHRTdHlsZTogeyB0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgcGF0aDogc3RyaW5nLCB2YWx1ZTogU291cmNlTWFwU3RvcmUgfVtdID0gW11cbiAgICBoZWFkSFRNTCA9ICcnXG4gICAgY2FjaGU6IGluVGFnQ2FjaGUgPSB7XG4gICAgICAgIHN0eWxlOiBbXSxcbiAgICAgICAgc2NyaXB0OiBbXSxcbiAgICAgICAgc2NyaXB0TW9kdWxlOiBbXVxuICAgIH1cbiAgICBjYWNoZUNvbXBpbGVTY3JpcHQ6IGFueSA9IHt9XG4gICAgY2FjaGVDb21wb25lbnQ6IGNhY2hlQ29tcG9uZW50ID0ge31cbiAgICBjb21waWxlUnVuVGltZVN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fVxuICAgIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0ge31cbiAgICByZWNvcmROYW1lczogc3RyaW5nW10gPSBbXVxuXG4gICAgZ2V0IHNhZmVEZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWcgJiYgdGhpcy5fc2FmZURlYnVnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGZ1bGxQYXRoOiBzdHJpbmcsIHB1YmxpYyB0eXBlTmFtZT86IHN0cmluZywgcHVibGljIGRlYnVnPzogYm9vbGVhbiwgcHJpdmF0ZSBfc2FmZURlYnVnPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zID0gdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHN0eWxlKHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlVVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHNjcmlwdCh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zY3JpcHRVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHJlY29yZChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKG5hbWUpKVxuICAgICAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcGVuZGVuY2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0pIHJldHVybjtcblxuICAgICAgICBjb25zdCBoYXZlRGVwID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdDtcbiAgICAgICAgaWYgKGhhdmVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0gPSBoYXZlRGVwXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBzbWFsbFBhdGggPSB0aGlzLnNtYWxsUGF0aCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuaW5TY3JpcHRTdHlsZS5maW5kKHggPT4geC50eXBlID09IHR5cGUgJiYgeC5wYXRoID09IHNtYWxsUGF0aCk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IHsgdHlwZSwgcGF0aDogc21hbGxQYXRoLCB2YWx1ZTogbmV3IFNvdXJjZU1hcFN0b3JlKHNtYWxsUGF0aCwgdGhpcy5zYWZlRGVidWcsIHR5cGUgPT0gJ3N0eWxlJywgdHJ1ZSkgfVxuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS52YWx1ZVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlUGFnZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgaW5mbzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY3JpcHRTdHlsZSh0eXBlLCBkYXRhVGFnLnBvcFN0cmluZygncGFnZScpID8gdGhpcy5zbWFsbFBhdGggOiBpbmZvLmV4dHJhY3RJbmZvKCkpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlTmFtZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGxldCBrZXk6IHN0cmluZztcblxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKFN0YXRpY0ZpbGVzSW5mby5zdG9yZSk7XG4gICAgICAgIHdoaWxlIChrZXkgPT0gbnVsbCB8fCB2YWx1ZXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAga2V5ID0gQmFzZTY0SWQodGV4dCwgNSArIGxlbmd0aCkuc3Vic3RyaW5nKGxlbmd0aCk7XG4gICAgICAgICAgICBsZW5ndGgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRIZWFkVGFncygpIHtcbiAgICAgICAgY29uc3QgcGFnZUxvZyA9IHRoaXMudHlwZU5hbWUgPT0gZ2V0VHlwZXMuTG9nc1syXVxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5pblNjcmlwdFN0eWxlKSB7XG4gICAgICAgICAgICBjb25zdCBpc0xvZyA9IHBhZ2VMb2cgJiYgaS5wYXRoID09IHRoaXMuc21hbGxQYXRoO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUxvY2F0aW9uID0gaXNMb2cgPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdLCBhZGRRdWVyeSA9IGlzTG9nID8gJz90PWwnIDogJyc7XG4gICAgICAgICAgICBsZXQgdXJsID0gU3RhdGljRmlsZXNJbmZvLmhhdmUoaS5wYXRoLCAoKSA9PiBTZXNzaW9uQnVpbGQuY3JlYXRlTmFtZShpLnBhdGgpKSArICcucHViJztcblxuICAgICAgICAgICAgc3dpdGNoIChpLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IGRlZmVyOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLm1qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IHR5cGU6ICdtb2R1bGUnIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0eWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuY3NzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZSgnLycgKyB1cmwgKyBhZGRRdWVyeSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEVhc3lGcy53cml0ZUZpbGUoc2F2ZUxvY2F0aW9uICsgdXJsLCBhd2FpdCBpLnZhbHVlLmNyZWF0ZURhdGFXaXRoTWFwKCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBidWlsZEhlYWQoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRkSGVhZFRhZ3MoKTtcblxuICAgICAgICBjb25zdCBtYWtlQXR0cmlidXRlcyA9IChpOiBzZXREYXRhSFRNTFRhZykgPT4gaS5hdHRyaWJ1dGVzID8gJyAnICsgT2JqZWN0LmtleXMoaS5hdHRyaWJ1dGVzKS5tYXAoeCA9PiBpLmF0dHJpYnV0ZXNbeF0gPyB4ICsgYD1cIiR7aS5hdHRyaWJ1dGVzW3hdfVwiYCA6IHgpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgICAgIGxldCBidWlsZEJ1bmRsZVN0cmluZyA9ICcnOyAvLyBhZGQgc2NyaXB0cyBhZGQgY3NzXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnN0eWxlVVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtpLnVybH1cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Lz5gO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zY3JpcHRVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPHNjcmlwdCBzcmM9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0+PC9zY3JpcHQ+YDtcblxuICAgICAgICByZXR1cm4gYnVpbGRCdW5kbGVTdHJpbmcgKyB0aGlzLmhlYWRIVE1MO1xuICAgIH1cblxuICAgIGV4dGVuZHMoZnJvbTogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yQXJyYXkucHVzaCguLi5mcm9tLmNvbm5lY3RvckFycmF5KTtcbiAgICAgICAgdGhpcy5zY3JpcHRVUkxTZXQucHVzaCguLi5mcm9tLnNjcmlwdFVSTFNldCk7XG4gICAgICAgIHRoaXMuc3R5bGVVUkxTZXQucHVzaCguLi5mcm9tLnN0eWxlVVJMU2V0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZnJvbS5pblNjcmlwdFN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaCh7IC4uLmksIHZhbHVlOiBpLnZhbHVlLmNsb25lKCkgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcHlPYmplY3RzID0gWydjYWNoZUNvbXBpbGVTY3JpcHQnLCAnY2FjaGVDb21wb25lbnQnLCAnZGVwZW5kZW5jaWVzJ107XG5cbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNvcHlPYmplY3RzKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXNbY10sIGZyb21bY10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKC4uLmZyb20ucmVjb3JkTmFtZXMuZmlsdGVyKHggPT4gIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMoeCkpKTtcblxuICAgICAgICB0aGlzLmhlYWRIVE1MICs9IGZyb20uaGVhZEhUTUw7XG4gICAgICAgIHRoaXMuY2FjaGUuc3R5bGUucHVzaCguLi5mcm9tLmNhY2hlLnN0eWxlKTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHQucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdCk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0TW9kdWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHRNb2R1bGUpO1xuICAgIH1cblxuICAgIC8vYmFzaWMgbWV0aG9kc1xuICAgIEJ1aWxkU2NyaXB0V2l0aFByYW1zKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGNvZGUsIGlzVHMoKSwgdGhpcyk7XG4gICAgfVxufSIsICIvLyBAdHMtbm9jaGVja1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgY2xlYXJNb2R1bGUgZnJvbSAnY2xlYXItbW9kdWxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpLCByZXNvbHZlID0gKHBhdGg6IHN0cmluZykgPT4gcmVxdWlyZS5yZXNvbHZlKHBhdGgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGZpbGVQYXRoID0gcGF0aC5ub3JtYWxpemUoZmlsZVBhdGgpO1xuXG4gICAgY29uc3QgbW9kdWxlID0gcmVxdWlyZShmaWxlUGF0aCk7XG4gICAgY2xlYXJNb2R1bGUoZmlsZVBhdGgpO1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn1cblxuZXhwb3J0IHtcbiAgICBjbGVhck1vZHVsZSxcbiAgICByZXNvbHZlXG59IiwgImltcG9ydCB7IFdhcm5pbmcgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0xvZ2dlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuY2xhc3MgcmVMb2NhdGlvbiB7XG4gICAgbWFwOiBQcm9taXNlPFNvdXJjZU1hcENvbnN1bWVyPlxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZU1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIH1cblxuICAgIGFzeW5jIGdldExvY2F0aW9uKGxvY2F0aW9uOiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn0pe1xuICAgICAgICBjb25zdCB7bGluZSwgY29sdW1ufSA9IChhd2FpdCB0aGlzLm1hcCkub3JpZ2luYWxQb3NpdGlvbkZvcihsb2NhdGlvbilcbiAgICAgICAgcmV0dXJuIGAke2xpbmV9OiR7Y29sdW1ufWA7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVFcnJvcih7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9OiBXYXJuaW5nLCBmaWxlUGF0aDogc3RyaW5nLCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IGZpbmRMb2NhdGlvbiA9IG5ldyByZUxvY2F0aW9uKHNvdXJjZU1hcClcbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfTxjb2xvcj4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX08Y29sb3I+JHtmaWxlUGF0aH06JHthd2FpdCBmaW5kTG9jYXRpb24uZ2V0TG9jYXRpb24oc3RhcnQpfWBcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgaGxqcyBmcm9tICdoaWdobGlnaHQuanMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZnVuY3Rpb24gY29kZVdpdGhDb3B5KG1kOiBhbnksIGljb246IHN0cmluZykge1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZShvcmlnUnVsZTogYW55KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdSZW5kZXJlZCA9IG9yaWdSdWxlKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY29kZS1jb3B5XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb3B5LWNsaXBib2FyZFwiIG9uY2xpY2s9XCJtYXJrZG93bkNvcHkodGhpcylcIj4ke2ljb259PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICR7b3JpZ1JlbmRlcmVkfVxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayk7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbWFya0Rvd25QbHVnaW4gPSBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKCdtYXJrZG93bicpO1xuXG4gICAgXG4gICAgY29uc3QgaGxqc0NsYXNzID1kYXRhVGFnLnBvcEJvb2xlYW4oJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBkYXRhVGFnLnBvcEJvb2xlYW4oJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSksXG4gICAgICAgIGJyZWFrczogZGF0YVRhZy5wb3BCb29sZWFuKCdicmVha3MnLCBtYXJrRG93blBsdWdpbj8uYnJlYWtzID8/IHRydWUpLFxuICAgICAgICB0eXBvZ3JhcGhlcjogZGF0YVRhZy5wb3BCb29sZWFuKCd0eXBvZ3JhcGhlcicsIG1hcmtEb3duUGx1Z2luPy50eXBvZ3JhcGhlciA/PyB0cnVlKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWFya2Rvd24tcGFyc2VyJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb3B5ID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdjb3B5LWNvZGUnLCBtYXJrRG93blBsdWdpbj8uY29weUNvZGUgPz8gJ1x1RDgzRFx1RENDQicpO1xuICAgIGlmIChjb3B5KVxuICAgICAgICBtZC51c2UoKG06YW55KT0+IGNvZGVXaXRoQ29weShtLCBjb3B5KSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ2F0dHJzJywgbWFya0Rvd25QbHVnaW4/LmF0dHJzID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEF0dHJzKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ2FiYnInLCBtYXJrRG93blBsdWdpbj8uYWJiciA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBYmJyKTtcblxuICAgIGxldCBtYXJrZG93bkNvZGUgPSBCZXR3ZWVuVGFnRGF0YT8uZXEgfHwgJyc7XG4gICAgY29uc3QgbG9jYXRpb24gPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2ZpbGUnLCAnLi9tYXJrZG93bicpO1xuXG4gICAgaWYgKCFtYXJrZG93bkNvZGU/LnRyaW0/LigpICYmIGxvY2F0aW9uKSB7XG4gICAgICAgIGxldCBmaWxlUGF0aCA9IGxvY2F0aW9uWzBdID09ICcvJyA/IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMl0sIGxvY2F0aW9uKTogcGF0aC5qb2luKHBhdGguZGlybmFtZSh0eXBlLmV4dHJhY3RJbmZvKCc8bGluZT4nKSksIGxvY2F0aW9uKTtcbiAgICAgICAgaWYgKCFwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKVxuICAgICAgICAgICAgZmlsZVBhdGggKz0gJy5zZXJ2Lm1kJ1xuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgICBtYXJrZG93bkNvZGUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpOyAvL2dldCBtYXJrZG93biBmcm9tIGZpbGVcbiAgICAgICAgYXdhaXQgc2Vzc2lvbi5kZXBlbmRlbmNlKGZpbGVQYXRoLCBmdWxsUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJIVE1MID0gbWQucmVuZGVyKG1hcmtkb3duQ29kZSksIGJ1aWxkSFRNTCA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgY3JlYXRlQXV0b1RoZW1lKGRhdGFUYWcucG9wU3RyaW5nKCdjb2RlLXRoZW1lJykgfHwgbWFya0Rvd25QbHVnaW4/LmNvZGVUaGVtZSB8fCAnYXRvbS1vbmUnKTtcblxuICAgIGlmIChoYXZlSGlnaGxpZ2h0KSB7XG4gICAgICAgIGlmKHRoZW1lICE9ICdub25lJyl7XG4gICAgICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICAgICAgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKTtcbiAgICAgICAgfVxuICAgICAgICBpZihjb3B5KXtcbiAgICAgICAgICAgIHNlc3Npb24uc2NyaXB0KCcvc2Vydi9tZC5qcycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGF0YVRhZy5hZGRDbGFzcygnbWFya2Rvd24tYm9keScpO1xuXG4gICAgY29uc3Qgc3R5bGUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3RoZW1lJywgIG1hcmtEb3duUGx1Z2luPy50aGVtZSA/PyAnYXV0bycpO1xuICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvdGhlbWUvJyArIHN0eWxlICsgJy5jc3MnO1xuICAgIHN0eWxlICE9ICdub25lJyAmJiBzZXNzaW9uLnN0eWxlKGNzc0xpbmspXG5cbiAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZW5kZXJIVE1MfTwvZGl2PmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogYnVpbGRIVE1MLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5jb25zdCB0aGVtZUFycmF5ID0gWycnLCAnLWRhcmsnLCAnLWxpZ2h0J107XG5jb25zdCB0aGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bic7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5TWFya2Rvd25UaGVtZSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgb2YgdGhlbWVBcnJheSkge1xuICAgICAgICBjb25zdCBtaW5pID0gKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGVtZVBhdGggKyBpICsgJy5jc3MnKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxuXFwubWFya2Rvd24tYm9keSB7KXwoXi5tYXJrZG93bi1ib2R5IHspL2dtLCAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCArICdwYWRkaW5nOjIwcHg7J1xuICAgICAgICAgICAgfSkgKyBgXG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdj5he1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDI1cHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgICAgICBib3R0b206IC03cHg7ICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk6aG92ZXI+ZGl2IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiBhOmZvY3VzIHtcbiAgICAgICAgICAgICAgICBjb2xvcjojNmJiODZhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBgO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgLCBzZXREYXRhSFRNTFRhZ30gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxoZWFkJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgIH1ARGVmYXVsdEluc2VydEJ1bmRsZTwvaGVhZD5gLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBidWlsZEJ1bmRsZVN0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLmJ1aWxkSGVhZCgpO1xuICAgIFxuICAgIGNvbnN0IGJ1bmRsZVBsYWNlaG9sZGVyID0gWy9ASW5zZXJ0QnVuZGxlKDs/KS8sIC9ARGVmYXVsdEluc2VydEJ1bmRsZSg7PykvXTtcbiAgICBjb25zdCByZW1vdmVCdW5kbGUgPSAoKSA9PiB7YnVuZGxlUGxhY2Vob2xkZXIuZm9yRWFjaCh4ID0+IHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSh4LCAnJykpOyByZXR1cm4gcGFnZURhdGF9O1xuXG5cbiAgICBpZiAoIWJ1aWxkQnVuZGxlU3RyaW5nKSAgLy8gdGhlcmUgaXNuJ3QgYW55dGhpbmcgdG8gYnVuZGxlXG4gICAgICAgIHJldHVybiByZW1vdmVCdW5kbGUoKTtcblxuICAgIGNvbnN0IHJlcGxhY2VXaXRoID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYnVpbGRCdW5kbGVTdHJpbmcpOyAvLyBhZGQgYnVuZGxlIHRvIHBhZ2VcbiAgICBsZXQgYnVuZGxlU3VjY2VlZCA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGVQbGFjZWhvbGRlci5sZW5ndGggJiYgIWJ1bmRsZVN1Y2NlZWQ7IGkrKylcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihidW5kbGVQbGFjZWhvbGRlcltpXSwgKCkgPT4gKGJ1bmRsZVN1Y2NlZWQgPSB0cnVlKSAmJiByZXBsYWNlV2l0aCk7XG5cbiAgICBpZihidW5kbGVTdWNjZWVkKVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGEuUGx1cyQgYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPScke3JlcGxhY2VXaXRofSc7YDtcbn0iLCAiaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuXG5jb25zdCBudW1iZXJzID0gWydudW1iZXInLCAnbnVtJywgJ2ludGVnZXInLCAnaW50J10sIGJvb2xlYW5zID0gWydib29sZWFuJywgJ2Jvb2wnXTtcbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uID0gWydlbWFpbCcsICdzdHJpbmcnLCAndGV4dCcsIC4uLm51bWJlcnMsIC4uLmJvb2xlYW5zXTtcblxuY29uc3QgZW1haWxWYWxpZGF0b3IgPSAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvO1xuXG5cblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25SZWdleCA9IHtcbiAgICBcInN0cmluZy1sZW5ndGgtcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy1bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy0nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgdGV4dDogc3RyaW5nKSA9PiB0ZXh0Lmxlbmd0aCA+PSBtaW4gJiYgdGV4dC5sZW5ndGggPD0gbWF4LFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZS1pbnRlZ2VyXCI6IFtcbiAgICAgICAgL15bMC05XSsuLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IE51bWJlci5pc0ludGVnZXIobnVtKSAmJiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibnVtYmVyLXJhbmdlLWZsb2F0XCI6IFtcbiAgICAgICAgL15bMC05XStcXC5bMC05XSsuLlswLTldK1xcLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heCxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2Utc3RyaW5nXCI6IFtcbiAgICAgICAgL15zdHJpbmd8dGV4dCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gYFwiJHt4LnRyaW0oKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpfVwiYCksXG4gICAgICAgIChvcHRpb25zOiBzdHJpbmdbXSwgdGV4dDogc3RyaW5nKSA9PiBvcHRpb25zLmluY2x1ZGVzKHRleHQpLFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1udW1iZXJcIjogW1xuICAgICAgICAvXm51bWJlcnxudW18aW50ZWdlcnxpbnQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpLFxuICAgICAgICAob3B0aW9uczogbnVtYmVyW10sIG51bTogbnVtYmVyKSA9PiBvcHRpb25zLmluY2x1ZGVzKG51bSksXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdXG59O1xuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMgPSBbLi4ubnVtYmVyc107XG5cbmZvcihjb25zdCBpIGluIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpe1xuICAgIGNvbnN0IHR5cGUgPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2ldWzNdO1xuXG4gICAgaWYoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKHR5cGUpKVxuICAgICAgICBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMucHVzaChpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVZhbHVlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGBbXCIke3ZhbHVlfVwiXWA7XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBbdGVzdCwgZ2V0QXJnc11dIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpKVxuICAgICAgICBpZiAoKDxSZWdFeHA+dGVzdCkudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gYFtcIiR7bmFtZX1cIiwgJHsoPGFueT5nZXRBcmdzKSh2YWx1ZSl9XWA7XG5cbiAgICByZXR1cm4gYFske3ZhbHVlfV1gO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlVmFsaWRhdGlvbkpTT04oYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IFByb21pc2U8Ym9vbGVhbiB8IHN0cmluZ1tdPiB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnQsIC4uLmVsZW1lbnRBcmdzXSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG4gICAgICAgIGxldCByZXR1cm5Ob3c6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZTtcblxuICAgICAgICBsZXQgaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgY2FzZSAnYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIU51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWVtYWlsVmFsaWRhdG9yLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhdmVSZWdleCA9IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbZWxlbWVudF07XG5cbiAgICAgICAgICAgICAgICBpZihoYXZlUmVnZXgpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB2YWx1ZSA9PSBudWxsIHx8ICFoYXZlUmVnZXhbMl0oZWxlbWVudEFyZ3MsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gKCFlbGVtZW50LnRlc3QodmFsdWUpKSAmJiAncmVnZXggLSAnICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gKCFhd2FpdCBlbGVtZW50KHZhbHVlKSkgJiYgJ2Z1bmN0aW9uIC0gJyArIChlbGVtZW50Lm5hbWUgfHwgJ2Fub255bW91cycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk5vdykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBgVmFsaWRhdGlvbiBmYWlsZWQgYXQgZmlsZWQgJHtOdW1iZXIoaSkrMX0gLSAke2lzRGVmYXVsdCA/IHJldHVybk5vdyA6ICdleHBlY3RlZCAnICsgZWxlbWVudH1gO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50QXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaW5mbyArPSBgLCBhcmd1bWVudHM6ICR7SlNPTi5zdHJpbmdpZnkoZWxlbWVudEFyZ3MpfWA7XG5cbiAgICAgICAgICAgIGluZm8gKz0gYCwgaW5wdXQ6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBbaW5mbywgZWxlbWVudCwgZWxlbWVudEFyZ3MsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VWYWx1ZXMoYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBwYXJzZWQgPSBbXTtcblxuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50XSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG5cbiAgICAgICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHBhcnNlRmxvYXQodmFsdWUpKTtcblxuICAgICAgICBlbHNlIGlmIChib29sZWFucy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufSIsICJpbXBvcnQgeyBjb25uZWN0b3JJbmZvLCBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSBcIi4uLy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvcHJlcHJvY2Vzc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oY29ubmVjdE5hbWU6IHN0cmluZywgY29ubmVjdG9yQ2FsbDogc3RyaW5nLCBjb25uZWN0aW9uVHlwZTogc3RyaW5nLCBwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgYnVpbGRBcmd1bWVudHM6IChpbmZvOiBjb25uZWN0b3JJbmZvKSA9PiBzdHJpbmcsIHtyZXR1cm5EYXRhfToge3JldHVybkRhdGE/OiBib29sZWFufSA9IHt9KSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5maW5kKHggPT4geC50eXBlID09IGNvbm5lY3Rpb25UeXBlKSlcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gY29ubmVjdGlvblR5cGUpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzZW5kVG9Vbmljb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgaS5uYW1lKS51bmljb2RlLmVxXG4gICAgICAgIGNvbnN0IGNvbm5lY3QgPSBuZXcgUmVnRXhwKGBAJHtjb25uZWN0TmFtZX1cXFxcKFsgXSoke3NlbmRUb1VuaWNvZGV9WyBdKlxcXFwpKDs/KWApLCBjb25uZWN0RGVmYXVsdCA9IG5ldyBSZWdFeHAoYEBcXFxcPyR7Y29ubmVjdE5hbWV9XFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKWApO1xuXG4gICAgICAgIGxldCBoYWRSZXBsYWNlbWVudCA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IHNjcmlwdERhdGEgPSAoKSA9PiB7XG4gICAgICAgICAgICBoYWRSZXBsYWNlbWVudCA9IHRydWVcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgaWYoUG9zdD8uJHtjb25uZWN0b3JDYWxsfSA9PSBcIiR7aS5uYW1lfVwiKXtcbiAgICAgICAgICAgICAgICAke3JldHVybkRhdGEgPyAncmV0dXJuICc6ICcnfWF3YWl0IGhhbmRlbENvbm5lY3RvcihcIiR7Y29ubmVjdGlvblR5cGV9XCIsIHBhZ2UsIFxuICAgICAgICAgICAgICAgICAgICAke2J1aWxkQXJndW1lbnRzKGkpfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9YClcbiAgICAgICAgfTtcblxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3QsIHNjcmlwdERhdGEpO1xuXG4gICAgICAgIGlmIChoYWRSZXBsYWNlbWVudClcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZShjb25uZWN0RGVmYXVsdCwgJycpOyAvLyBkZWxldGluZyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdERlZmF1bHQsIHNjcmlwdERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgdHlwZSB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBjb25uZWN0b3JJbmZvLCBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgeyBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCB7IFNvbWVQbHVnaW5zIH0sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbmFtZScpLFxuICAgICAgICBzZW5kVG8gPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdzZW5kVG8nKSxcbiAgICAgICAgdmFsaWRhdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdub3RWYWxpZCcpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFTb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKSk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7IGFzeW5jOiBudWxsIH0pXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KHRlbXBsYXRlKG5hbWUpKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IEJldHdlZW5UYWdEYXRhIHx8IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICBjb21waWxlZFN0cmluZy5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhQEA/Q29ubmVjdEhlcmUoJHtuYW1lfSklPmApXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZyxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbignQ29ubmVjdEhlcmUnLCAnY29ubmVjdG9yQ2FsbD8ubmFtZScsICdjb25uZWN0JywgcGFnZURhdGEsIHNlc3Npb25JbmZvLCBpID0+IHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTpcIiR7aS5uYW1lfVwiLFxuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlskeyhpLnZhbGlkYXRvciAmJiBpLnZhbGlkYXRvci5tYXAoY29tcGlsZVZhbHVlcykuam9pbignLCcpKSB8fCAnJ31dXG4gICAgICAgIH1gXG4gICAgfSwge3JldHVybkRhdGE6IHRydWV9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvcjogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JDYWxsLnZhbHVlcztcbiAgICBjb25zdCBpc1ZhbGlkID0gY29ubmVjdG9yLnZhbGlkYXRvci5sZW5ndGggJiYgYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9yLnZhbGlkYXRvcik7XG5cbiAgICB0aGlzUGFnZS5zZXRSZXNwb25zZSgnJyk7XG5cbiAgICBjb25zdCBiZXR0ZXJKU09OID0gKG9iajogYW55KSA9PiB7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2UuZW5kKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIH1cblxuICAgIGlmICghY29ubmVjdG9yLnZhbGlkYXRvci5sZW5ndGggfHwgaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBjb25uZWN0b3Iuc2VuZFRvKC4uLnZhbHVlcykpO1xuXG4gICAgZWxzZSBpZiAoY29ubmVjdG9yLm5vdFZhbGlkKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGNvbm5lY3Rvci5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpKTtcblxuICAgIGVsc2UgaWYgKGNvbm5lY3Rvci5tZXNzYWdlKVxuICAgICAgICBiZXR0ZXJKU09OKHtcbiAgICAgICAgICAgIGVycm9yOiB0eXBlb2YgY29ubmVjdG9yLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBjb25uZWN0b3IubWVzc2FnZSA6ICg8YW55PmlzVmFsaWQpLnNoaWZ0KClcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zdGF0dXMoNDAwKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04sIHBhcnNlVmFsdWVzIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcbmltcG9ydCB7IGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvY29ubmVjdC1ub2RlJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3Qgc2VuZFRvID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdzZW5kVG8nLCAnJykudHJpbSgpO1xuXG4gICAgaWYgKCFzZW5kVG8pICAvLyBzcGVjaWFsIGFjdGlvbiBub3QgZm91bmRcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKVxuICAgICAgICAgICAgICAgIH08L2Zvcm0+YCxcbiAgICAgICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICAgICAgfVxuXG5cbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCduYW1lJywgdXVpZCgpKS50cmltKCksIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgndmFsaWRhdGUnKSwgb3JkZXJEZWZhdWx0OiBzdHJpbmcgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdvcmRlcicpLCBub3RWYWxpZDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbm90VmFsaWQnKSwgcmVzcG9uc2VTYWZlID0gZGF0YVRhZy5wb3BCb29sZWFuKCdzYWZlJyk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdtZXNzYWdlJywgc2Vzc2lvbkluZm8uZGVidWcgJiYgIUluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKSk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGxldCBvcmRlciA9IFtdO1xuXG4gICAgY29uc3QgdmFsaWRhdG9yQXJyYXkgPSB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geyAvLyBDaGVja2luZyBpZiB0aGVyZSBpcyBhbiBvcmRlciBpbmZvcm1hdGlvbiwgZm9yIGV4YW1wbGUgXCJwcm9wMTogc3RyaW5nLCBwcm9wMzogbnVtLCBwcm9wMjogYm9vbFwiXG4gICAgICAgIGNvbnN0IHNwbGl0ID0gU3BsaXRGaXJzdCgnOicsIHgudHJpbSgpKTtcblxuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIG9yZGVyLnB1c2goc3BsaXQuc2hpZnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIHNwbGl0LnBvcCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKG9yZGVyRGVmYXVsdClcbiAgICAgICAgb3JkZXIgPSBvcmRlckRlZmF1bHQuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JBcnJheSxcbiAgICAgICAgb3JkZXI6IG9yZGVyLmxlbmd0aCAmJiBvcmRlcixcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlc3BvbnNlU2FmZVxuICAgIH0pO1xuXG4gICAgZGF0YVRhZy5wdXNoVmFsdWUoJ21ldGhvZCcsICdwb3N0Jyk7XG5cbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJFxuICAgICAgICBgPCUhXG5AP0Nvbm5lY3RIZXJlRm9ybSgke25hbWV9KVxuJT48Zm9ybSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+XG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY29ubmVjdG9yRm9ybUNhbGxcIiB2YWx1ZT1cIiR7bmFtZX1cIi8+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pfTwvZm9ybT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oJ0Nvbm5lY3RIZXJlRm9ybScsICdjb25uZWN0b3JGb3JtQ2FsbCcsICdmb3JtJywgcGFnZURhdGEsIHNlc3Npb25JbmZvLCBpID0+IHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAge1xuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlske2kudmFsaWRhdG9yPy5tYXA/Lihjb21waWxlVmFsdWVzKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICBvcmRlcjogWyR7aS5vcmRlcj8ubWFwPy4oaXRlbSA9PiBgXCIke2l0ZW19XCJgKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICBzYWZlOiR7aS5yZXNwb25zZVNhZmV9XG4gICAgICAgIH1gXG4gICAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3JJbmZvOiBhbnkpIHtcblxuICAgIGRlbGV0ZSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckZvcm1DYWxsO1xuXG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8ub3JkZXIubGVuZ3RoKSAvLyBwdXNoIHZhbHVlcyBieSBzcGVjaWZpYyBvcmRlclxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY29ubmVjdG9ySW5mby5vcmRlcilcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRoaXNQYWdlLlBvc3RbaV0pO1xuICAgIGVsc2VcbiAgICAgICAgdmFsdWVzLnB1c2goLi4uT2JqZWN0LnZhbHVlcyh0aGlzUGFnZS5Qb3N0KSk7XG5cblxuICAgIGxldCBpc1ZhbGlkOiBib29sZWFuIHwgc3RyaW5nW10gPSB0cnVlO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8udmFsaWRhdG9yLmxlbmd0aCkgeyAvLyB2YWxpZGF0ZSB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcGFyc2VWYWx1ZXModmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgICAgIGlzVmFsaWQgPSBhd2FpdCBtYWtlVmFsaWRhdGlvbkpTT04odmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgfVxuXG4gICAgbGV0IHJlc3BvbnNlOiBhbnk7XG5cbiAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLnNlbmRUbyguLi52YWx1ZXMpO1xuICAgIGVsc2UgaWYgKGNvbm5lY3RvckluZm8ubm90VmFsaWQpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpO1xuXG4gICAgaWYgKGlzVmFsaWQgJiYgIXJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5tZXNzYWdlID09PSB0cnVlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKGlzVmFsaWRbMF0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXNwb25zZSA9IGNvbm5lY3RvckluZm8ubWVzc2FnZTtcblxuICAgIGlmIChyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8uc2FmZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShyZXNwb25zZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlKHJlc3BvbnNlKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHNtYWxsUGF0aFRvUGFnZSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuY29uc3QgcmVjb3JkU3RvcmUgPSBuZXcgU3RvcmVKU09OKCdSZWNvcmRzJyk7XG5cbmZ1bmN0aW9uIHJlY29yZExpbmsoZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xpbmsnLCBzbWFsbFBhdGhUb1BhZ2Uoc2Vzc2lvbkluZm8uc21hbGxQYXRoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmVjb3JkUGF0aChkZWZhdWx0TmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbGluayA9IHJlY29yZExpbmsoZGF0YVRhZywgc2Vzc2lvbkluZm8pLCBzYXZlTmFtZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbmFtZScsIGRlZmF1bHROYW1lKTtcblxuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSA/Pz0ge307XG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdID8/PSAnJztcbiAgICBzZXNzaW9uSW5mby5yZWNvcmQoc2F2ZU5hbWUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RvcmU6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSxcbiAgICAgICAgY3VycmVudDogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdLFxuICAgICAgICBsaW5rXG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFzZXNzaW9uSW5mby5zbWFsbFBhdGguZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpIC8vIGRvIG5vdCBhbGxvdyB0aGlzIGZvciBjb21waWxpbmcgY29tcG9uZW50IGFsb25lXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICAgICAgfVxuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGh0bWwgPSBodG1sLnRyaW0oKTtcblxuICAgIGNvbnN0IHsgc3RvcmUsIGxpbmsgfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3JlY29yZC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFzdG9yZVtsaW5rXS5pbmNsdWRlcyhodG1sKSkge1xuICAgICAgICBzdG9yZVtsaW5rXSArPSBodG1sO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc21hbGxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuYW1lID0gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aCk7XG4gICAgZm9yIChjb25zdCBzYXZlIGluIHJlY29yZFN0b3JlLnN0b3JlKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSByZWNvcmRTdG9yZS5zdG9yZVtzYXZlXTtcblxuICAgICAgICBpZiAoaXRlbVtuYW1lXSkge1xuICAgICAgICAgICAgaXRlbVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlbGV0ZSBpdGVtW25hbWVdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjb3JkcyhzZXNzaW9uOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb24uZGVidWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzZXNzaW9uLnJlY29yZE5hbWVzKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHJlY29yZFN0b3JlLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInO1xuaW1wb3J0IHsgbWFrZVJlY29yZFBhdGggfSBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYgKCFzZXNzaW9uSW5mby5zbWFsbFBhdGguZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpIC8vIGRvIG5vdCBhbGxvdyB0aGlzIGZvciBjb21waWxpbmcgY29tcG9uZW50IGFsb25lXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICAgICAgfVxuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHsgc3RvcmUsIGxpbmssIGN1cnJlbnQgfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3NlYXJjaC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IHNlYXJjaE9iamVjdCA9IGJ1aWxkT2JqZWN0KGh0bWwsIGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWF0Y2gnLCAnaDFbaWRdLCBoMltpZF0sIGgzW2lkXSwgaDRbaWRdLCBoNVtpZF0sIGg2W2lkXScpKTtcblxuICAgIGlmICghY3VycmVudCkge1xuICAgICAgICBzdG9yZVtsaW5rXSA9IHNlYXJjaE9iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuYXNzaWduKGN1cnJlbnQudGl0bGVzLCBzZWFyY2hPYmplY3QudGl0bGVzKTtcblxuICAgICAgICBpZiAoIWN1cnJlbnQudGV4dC5pbmNsdWRlcyhzZWFyY2hPYmplY3QudGV4dCkpIHtcbiAgICAgICAgICAgIGN1cnJlbnQudGV4dCArPSBzZWFyY2hPYmplY3QudGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRPYmplY3QoaHRtbDogc3RyaW5nLCBtYXRjaDogc3RyaW5nKSB7XG4gICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwsIHtcbiAgICAgICAgYmxvY2tUZXh0RWxlbWVudHM6IHtcbiAgICAgICAgICAgIHNjcmlwdDogZmFsc2UsXG4gICAgICAgICAgICBzdHlsZTogZmFsc2UsXG4gICAgICAgICAgICBub3NjcmlwdDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdGl0bGVzOiBTdHJpbmdNYXAgPSB7fTtcblxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGwobWF0Y2gpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5hdHRyaWJ1dGVzWydpZCddO1xuICAgICAgICB0aXRsZXNbaWRdID0gZWxlbWVudC5pbm5lclRleHQudHJpbSgpO1xuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlcyxcbiAgICAgICAgdGV4dDogcm9vdC5pbm5lclRleHQudHJpbSgpLnJlcGxhY2UoL1sgXFxuXXsyLH0vZywgJyAnKS5yZXBsYWNlKC9bXFxuXS9nLCAnICcpXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL0NvbXBvbmVudHMvY2xpZW50JztcbmltcG9ydCBzY3JpcHQgZnJvbSAnLi9Db21wb25lbnRzL3NjcmlwdC9pbmRleCc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9Db21wb25lbnRzL3N0eWxlL2luZGV4JztcbmltcG9ydCBwYWdlIGZyb20gJy4vQ29tcG9uZW50cy9wYWdlJztcbmltcG9ydCBpc29sYXRlIGZyb20gJy4vQ29tcG9uZW50cy9pc29sYXRlJztcbmltcG9ydCBzdmVsdGUgZnJvbSAnLi9Db21wb25lbnRzL3N2ZWx0ZSc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnLi9Db21wb25lbnRzL21hcmtkb3duJztcbmltcG9ydCBoZWFkLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEhlYWQgfSBmcm9tICcuL0NvbXBvbmVudHMvaGVhZCc7XG5pbXBvcnQgY29ubmVjdCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRDb25uZWN0LCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yQ29ubmVjdCB9IGZyb20gJy4vQ29tcG9uZW50cy9jb25uZWN0JztcbmltcG9ydCBmb3JtLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEZvcm0sIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JGb3JtIH0gZnJvbSAnLi9Db21wb25lbnRzL2Zvcm0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgcmVjb3JkLCB7IHVwZGF0ZVJlY29yZHMsIHBlckNvbXBpbGUgYXMgcGVyQ29tcGlsZVJlY29yZCwgcG9zdENvbXBpbGUgYXMgcG9zdENvbXBpbGVSZWNvcmQsIGRlbGV0ZUJlZm9yZVJlQnVpbGQgfSBmcm9tICcuL0NvbXBvbmVudHMvcmVjb3JkJztcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9Db21wb25lbnRzL3NlYXJjaCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgY29uc3QgQWxsQnVpbGRJbiA9IFtcImNsaWVudFwiLCBcInNjcmlwdFwiLCBcInN0eWxlXCIsIFwicGFnZVwiLCBcImNvbm5lY3RcIiwgXCJpc29sYXRlXCIsIFwiZm9ybVwiLCBcImhlYWRcIiwgXCJzdmVsdGVcIiwgXCJtYXJrZG93blwiLCBcInJlY29yZFwiLCBcInNlYXJjaFwiXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGxldCByZURhdGE6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD47XG5cbiAgICBzd2l0Y2ggKHR5cGUuZXEudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlIFwiY2xpZW50XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjbGllbnQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmVjb3JkXCI6XG4gICAgICAgICAgICByZURhdGEgPSByZWNvcmQoIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNlYXJjaFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2VhcmNoKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNjcmlwdCggcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN0eWxlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdHlsZSggcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBhZ2VcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHBhZ2UocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY29ubmVjdCh0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZvcm1cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGZvcm0ocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXNvbGF0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGhlYWQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3ZlbHRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdmVsdGUodHlwZSwgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtYXJrZG93blwiOlxuICAgICAgICAgICAgcmVEYXRhID0gbWFya2Rvd24odHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ29tcG9uZW50IGlzIG5vdCBidWlsZCB5ZXRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzSW5jbHVkZSh0YWduYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gQWxsQnVpbGRJbi5pbmNsdWRlcyh0YWduYW1lLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB1cGRhdGVSZWNvcmRzKHNlc3Npb25JbmZvKTtcblxuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZENvbm5lY3QocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRGb3JtKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKC9AQ29ubmVjdEhlcmUoOz8pL2dpLCAnJykucmVwbGFjZSgvQENvbm5lY3RIZXJlRm9ybSg7PykvZ2ksICcnKTtcblxuICAgIHBhZ2VEYXRhID0gYXdhaXQgYWRkRmluYWxpemVCdWlsZEhlYWQocGFnZURhdGEsIHNlc3Npb25JbmZvLCBmdWxsQ29tcGlsZVBhdGgpO1xuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRlbENvbm5lY3RvclNlcnZpY2UodHlwZTogc3RyaW5nLCB0aGlzUGFnZTogYW55LCBjb25uZWN0b3I6IGFueSkge1xuICAgIGlmICh0eXBlID09ICdjb25uZWN0JylcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckNvbm5lY3QodGhpc1BhZ2UsIGNvbm5lY3Rvcik7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gaGFuZGVsQ29ubmVjdG9yRm9ybSh0aGlzUGFnZSwgY29ubmVjdG9yKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBlckNvbXBpbGUoKSB7XG4gICAgcGVyQ29tcGlsZVJlY29yZCgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpIHtcbiAgICBwb3N0Q29tcGlsZVJlY29yZCgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgZGVsZXRlQmVmb3JlUmVCdWlsZChzZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKXtcbiAgICBcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFBhcnNlRGVidWdJbmZvLCBDcmVhdGVGaWxlUGF0aCwgUGF0aFR5cGVzLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBBbGxCdWlsZEluLCBJc0luY2x1ZGUsIFN0YXJ0Q29tcGlsaW5nIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBBcnJheU1hdGNoIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7Q29tcGlsZUluRmlsZUZ1bmMsIFN0cmluZ0FycmF5T3JPYmplY3QsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciwgcG9vbCB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5jb25zdCBzZWFyY2hTcGVjaWZpY0NvbXBvbmVudHMgPSBuZXcgUmVnRXhwKGA8KFtcXFxccHtMdX1fXFxcXC06MC05XXwke0FsbEJ1aWxkSW4uam9pbignfCcpfSlgLCAndScpXG5jb25zdCBzZWFyY2hBbGxDb21wb25lbnRzID0gLzxbXFxwe0x9X1xcLTowLTldL3VcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnNlcnRDb21wb25lbnQgZXh0ZW5kcyBJbnNlcnRDb21wb25lbnRCYXNlIHtcbiAgICBwdWJsaWMgZGlyRm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIFBsdWdpbkJ1aWxkOiBBZGRQbHVnaW47XG4gICAgcHVibGljIENvbXBpbGVJbkZpbGU6IENvbXBpbGVJbkZpbGVGdW5jO1xuICAgIHB1YmxpYyBNaWNyb1BsdWdpbnM6IFN0cmluZ0FycmF5T3JPYmplY3Q7XG4gICAgcHVibGljIEdldFBsdWdpbjogKG5hbWU6IHN0cmluZykgPT4gYW55O1xuICAgIHB1YmxpYyBTb21lUGx1Z2luczogKC4uLm5hbWVzOiBzdHJpbmdbXSkgPT4gYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNUczogKCkgPT4gYm9vbGVhbjtcblxuXG4gICAgZ2V0IHJlZ2V4U2VhcmNoKCl7XG4gICAgICAgIHJldHVybiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSA/IHNlYXJjaEFsbENvbXBvbmVudHM6IHNlYXJjaFNwZWNpZmljQ29tcG9uZW50c1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFBsdWdpbkJ1aWxkOiBBZGRQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kaXJGb2xkZXIgPSAnQ29tcG9uZW50cyc7XG4gICAgICAgIHRoaXMuUGx1Z2luQnVpbGQgPSBQbHVnaW5CdWlsZDtcbiAgICB9XG5cbiAgICBGaW5kU3BlY2lhbFRhZ0J5U3RhcnQoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuU2tpcFNwZWNpYWxUYWcpIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcuc3Vic3RyaW5nKDAsIGlbMF0ubGVuZ3RoKSA9PSBpWzBdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kSW5kZXhTZWFyY2hUYWcocXVlcnk6IHN0cmluZywgdGFnOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHF1ZXJ5LnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMFxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRhZy5pbmRleE9mKGkpXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGBXYXJpbmcsIGNhbid0IGZpbmQgYWxsIHF1ZXJ5IGluIHRhZyAtPjxjb2xvcj4ke3RhZy5lcX1cXG4ke3RhZy5saW5lSW5mb31gLFxuICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwicXVlcnktbm90LWZvdW5kXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlciArPSBpbmRleCArIGkubGVuZ3RoXG4gICAgICAgICAgICB0YWcgPSB0YWcuc3Vic3RyaW5nKGluZGV4ICsgaS5sZW5ndGgpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnRlciArIHRhZy5zZWFyY2goL1xcIHxcXD4vKVxuICAgIH1cblxuICAgIENoZWNrTWluSFRNTChjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGlmICh0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgY29kZSA9IGNvZGUuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9XG5cbiAgICBDaGVja01pbkhUTUxUZXh0KGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSgvWyBcXG5dezIsfS8udGVzdChjb2RlLmVxKSl7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKC9bIFxcbl17Mix9L2dpLCAnICcpXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgYXN5bmMgUmVCdWlsZFRhZyh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnU3BsaWNlZDogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIFNlbmREYXRhRnVuYzogKHRleHQ6IFN0cmluZ1RyYWNrZXIpID0+IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBpZihCZXR3ZWVuVGFnRGF0YSlcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhLlNwYWNlT25lKCcgJyk7XG5cbiAgICAgICAgICAgIGRhdGFUYWcgPSBkYXRhVGFnU3BsaWNlZC5yZWJ1aWxkU3BhY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhZ0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyhcbiAgICAgICAgICAgICc8JywgdHlwZSwgZGF0YVRhZ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhKSB7XG4gICAgICAgICAgICB0YWdEYXRhLlBsdXMkYD4ke2F3YWl0IFNlbmREYXRhRnVuYyhCZXR3ZWVuVGFnRGF0YSl9PC8ke3R5cGV9PmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWdEYXRhLlBsdXMoJy8+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFnRGF0YTtcbiAgICB9XG5cbiAgICBleHBvcnREZWZhdWx0VmFsdWVzKGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCBmb3VuZFNldHRlcnM6IERlZmF1bHRWYWx1ZXNbXSA9IFtdKSB7XG4gICAgICAgIGNvbnN0IGluZGV4QmFzaWM6IEFycmF5TWF0Y2ggPSBmaWxlRGF0YS5tYXRjaCgvQGRlZmF1bHRbIF0qXFwoKFtBLVphLXowLTl7fSgpXFxbXFxdX1xcLSRcIidgJSomfFxcL1xcQCBcXG5dKilcXClbIF0qXFxbKFtBLVphLXowLTlfXFwtLCQgXFxuXSspXFxdLyk7XG5cbiAgICAgICAgaWYgKGluZGV4QmFzaWMgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB7IGZpbGVEYXRhLCBmb3VuZFNldHRlcnMgfTtcblxuICAgICAgICBjb25zdCBXaXRob3V0QmFzaWMgPSBmaWxlRGF0YS5zdWJzdHJpbmcoMCwgaW5kZXhCYXNpYy5pbmRleCkuUGx1cyhmaWxlRGF0YS5zdWJzdHJpbmcoaW5kZXhCYXNpYy5pbmRleCArIGluZGV4QmFzaWNbMF0ubGVuZ3RoKSk7XG5cbiAgICAgICAgY29uc3QgYXJyYXlWYWx1ZXMgPSBpbmRleEJhc2ljWzJdLmVxLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgICAgIGZvdW5kU2V0dGVycy5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBpbmRleEJhc2ljWzFdLFxuICAgICAgICAgICAgZWxlbWVudHM6IGFycmF5VmFsdWVzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmV4cG9ydERlZmF1bHRWYWx1ZXMoV2l0aG91dEJhc2ljLCBmb3VuZFNldHRlcnMpO1xuICAgIH1cblxuICAgIGFkZERlZmF1bHRWYWx1ZXMoYXJyYXlWYWx1ZXM6IERlZmF1bHRWYWx1ZXNbXSwgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5VmFsdWVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJlIG9mIGkuZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2VBbGwoJyMnICsgYmUsIGkudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHBhcnNlQ29tcG9uZW50UHJvcHModGFnRGF0YTogVGFnRGF0YVBhcnNlciwgY29tcG9uZW50OiBTdHJpbmdUcmFja2VyKSB7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIGxldCB7IGZpbGVEYXRhLCBmb3VuZFNldHRlcnMgfSA9IHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhjb21wb25lbnQpO1xuXG4gICAgICAgIGZvciAoY29uc3Qge2tleSx2YWx1ZX0gb2YgdGFnRGF0YS52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoXCJcXFxcflwiICsga2V5LCBcImdpXCIpO1xuICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKHJlLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5hZGREZWZhdWx0VmFsdWVzKGZvdW5kU2V0dGVycywgZmlsZURhdGEpO1xuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkVGFnQmFzaWMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIHRhZ0RhdGE6IFRhZ0RhdGFQYXJzZXIsIHBhdGg6IHN0cmluZywgU21hbGxQYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuUGx1Z2luQnVpbGQuQnVpbGRDb21wb25lbnQoZmlsZURhdGEsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSB0aGlzLnBhcnNlQ29tcG9uZW50UHJvcHModGFnRGF0YSwgZmlsZURhdGEpO1xuXG4gICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZSgvPFxcOnJlYWRlciggKSpcXC8+L2dpLCBCZXR3ZWVuVGFnRGF0YSA/PyAnJyk7XG5cbiAgICAgICAgcGF0aE5hbWUgPSBwYXRoTmFtZSArICcgLT4gJyArIFNtYWxsUGF0aDtcblxuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuU3RhcnRSZXBsYWNlKGZpbGVEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgUGFyc2VEZWJ1Z0luZm8oZmlsZURhdGEsIGAke3BhdGhOYW1lfSAtPlxcbiR7U21hbGxQYXRofWApO1xuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkU3BhY2lhbEF0dHJpYnV0ZXMoZGF0YTogVGFnRGF0YVBhcnNlciwgdHlwZTogU3RyaW5nVHJhY2tlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0U291cmNlID0gJy8nICsgdHlwZS5leHRyYWN0SW5mbygpO1xuXG4gICAgICAgIGRhdGEucHVzaFZhbHVlKCdpbXBvcnRTb3VyY2UnLCBpbXBvcnRTb3VyY2UpXG4gICAgICAgIGRhdGEucHVzaFZhbHVlKCdpbXBvcnRTb3VyY2VEaXJlY3RvcnknLCBwYXRoLmRpcm5hbWUoaW1wb3J0U291cmNlKSlcblxuICAgICAgICBjb25zdCAgbWFwQXR0cmlidXRlcyA9IGRhdGEubWFwKCk7XG4gICAgICAgIG1hcEF0dHJpYnV0ZXMucmVhZGVyID0gQmV0d2VlblRhZ0RhdGE/LmVxO1xuXG4gICAgICAgIHJldHVybiBtYXBBdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIGFzeW5jIGluc2VydFRhZ0RhdGEocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgeyBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8gfTogeyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXIgfSkge1xuICAgICAgICBjb25zdCBkYXRhUGFyc2VyID0gbmV3IFRhZ0RhdGFQYXJzZXIoZGF0YVRhZyksIEJ1aWxkSW4gPSBJc0luY2x1ZGUodHlwZS5lcSk7XG4gICAgICAgIGF3YWl0IGRhdGFQYXJzZXIucGFyc2VyKCk7XG5cbiAgICAgICAgbGV0IGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCBTZWFyY2hJbkNvbW1lbnQgPSB0cnVlLCBBbGxQYXRoVHlwZXM6IFBhdGhUeXBlcyA9IHt9LCBhZGRTdHJpbmdJbmZvOiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKEJ1aWxkSW4pIHsvL2NoZWNrIGlmIGl0IGJ1aWxkIGluIGNvbXBvbmVudFxuICAgICAgICAgICAgY29uc3QgeyBjb21waWxlZFN0cmluZywgY2hlY2tDb21wb25lbnRzIH0gPSBhd2FpdCBTdGFydENvbXBpbGluZyhwYXRoTmFtZSwgdHlwZSwgZGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGEgPz8gbmV3IFN0cmluZ1RyYWNrZXIoKSwgdGhpcywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgZmlsZURhdGEgPSBjb21waWxlZFN0cmluZztcbiAgICAgICAgICAgIFNlYXJjaEluQ29tbWVudCA9IGNoZWNrQ29tcG9uZW50cztcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9yZWJ1aWxkIGZvcm1hdHRlZCBjb21wb25lbnRcbiAgICAgICAgICAgIGNvbnN0IFJlQnVpbGRUYWcgPSAoKSA9PiB0aGlzLlJlQnVpbGRUYWcodHlwZSwgZGF0YVRhZywgZGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhID0+IHRoaXMuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pKTtcblxuICAgICAgICAgICAgLy9jaGVjayBpZiBjb21wb25lbnQgbm90IHN0YXJ0cyB3aXRoIHVwcGVyIGNhc2VcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IHR5cGUuYXQoMCkuZXFcbiAgICAgICAgICAgIGlmKGZpcnN0Q2hhciAhPSBmaXJzdENoYXIudG9VcHBlckNhc2UoKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlQnVpbGRUYWcoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZm9sZGVyOiBib29sZWFuIHwgc3RyaW5nID0gZGF0YVBhcnNlci5wb3BIYXZlRGVmYXVsdCgnZm9sZGVyJywgJy4nKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnUGF0aCA9IChmb2xkZXIgPyBmb2xkZXIgKyAnLycgOiAnJykgKyB0eXBlLnJlcGxhY2UoLzovZ2ksIFwiL1wiKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCA9IHR5cGUuZXh0cmFjdEluZm8oKSwgcmVsYXRpdmVzRmlsZVBhdGggPSBwYXRoTm9kZS5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCByZWxhdGl2ZXNGaWxlUGF0aFNtYWxsKTtcbiAgICAgICAgICAgIEFsbFBhdGhUeXBlcyA9IENyZWF0ZUZpbGVQYXRoKHJlbGF0aXZlc0ZpbGVQYXRoLCByZWxhdGl2ZXNGaWxlUGF0aFNtYWxsLCB0YWdQYXRoLCB0aGlzLmRpckZvbGRlciwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMuY29tcG9uZW50KTtcblxuICAgICAgICAgICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID09PSBudWxsIHx8IHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID09PSB1bmRlZmluZWQgJiYgIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCkpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBDb21wb25lbnQgJHt0eXBlLmVxfSBub3QgZm91bmQhIC0+PGNvbG9yPiR7cGF0aE5hbWV9XFxuLT4gJHt0eXBlLmxpbmVJbmZvfVxcbiR7QWxsUGF0aFR5cGVzLlNtYWxsUGF0aH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNvbXBvbmVudC1ub3QtZm91bmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUmVCdWlsZFRhZygpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGFsbERhdGEsIHRoaXMuaXNUcygpKTtcblxuICAgICAgICAgICAgLyphZGQgc3BlY2lhbCBhdHRyaWJ1dGVzICovXG4gICAgICAgICAgICBjb25zdCBtYXBBdHRyaWJ1dGVzID0gSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGFQYXJzZXIsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCB7YXR0cmlidXRlczogbWFwQXR0cmlidXRlc30pO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhUGFyc2VyLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tNaW5IVE1MVGV4dChjdXRTdGFydERhdGEpKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRUYWdEYXRhKHBhdGhOYW1lLCB0YWdUeXBlLCBpblRhZywgeyBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gTmV4dFRleHRUYWc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYmlnIHRhZyB3aXRoIHJlYWRlclxuICAgICAgICAgICAgbGV0IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU2ltcGxlU2tpcC5pbmNsdWRlcyh0YWdUeXBlLmVxKSkge1xuICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IE5leHRUZXh0VGFnLmluZGV4T2YoJzwvJyArIHRhZ1R5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBhd2FpdCB0aGlzLkZpbmRDbG9zZUNoYXJIVE1MKE5leHRUZXh0VGFnLCB0YWdUeXBlLmVxKTtcbiAgICAgICAgICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7dGFnVHlwZX1cIiwgdXNlZCBpbjogJHt0YWdUeXBlLmF0KDApLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNsb3NlLXRhZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEJldHdlZW5UYWdEYXRhID0gQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ICE9IG51bGwgJiYgTmV4dFRleHRUYWcuc3Vic3RyaW5nKDAsIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIC8vZmluZGluZyBsYXN0IGNsb3NlIFxuICAgICAgICAgICAgY29uc3QgTmV4dERhdGFDbG9zZSA9IE5leHRUZXh0VGFnLnN1YnN0cmluZyhCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgTmV4dERhdGFBZnRlckNsb3NlID0gQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ICE9IG51bGwgPyBOZXh0RGF0YUNsb3NlLnN1YnN0cmluZyhCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihOZXh0RGF0YUNsb3NlLmVxLCAnPicpICsgMSkgOiBOZXh0RGF0YUNsb3NlOyAvLyBzZWFyY2ggZm9yIHRoZSBjbG9zZSBvZiBhIGJpZyB0YWcganVzdCBpZiB0aGUgdGFnIGlzIHZhbGlkXG5cbiAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKFxuICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRUYWdEYXRhKHBhdGhOYW1lLCB0YWdUeXBlLCBpblRhZywgeyBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGRhdGEgPSBOZXh0RGF0YUFmdGVyQ2xvc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCB0ZXh0QnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihkYXRhLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHByb21pc2VCdWlsZCkge1xuICAgICAgICAgICAgdGV4dEJ1aWxkID0gdGhpcy5DaGVja0RvdWJsZVNwYWNlKHRleHRCdWlsZCwgYXdhaXQgaSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0lmIHRoaXMgb25seSB0ZXh0IHRoZW4gZGVsZXRlIGRvdWJsZSBzcGFjaW5nXG4gICAgICAgIGlmKHByb21pc2VCdWlsZC5sZW5ndGggPT09IDAgJiYgIXRoaXMuRmluZFNwZWNpYWxUYWdCeVN0YXJ0KGRhdGEuZXEudHJpbSgpKSl7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5DaGVja01pbkhUTUxUZXh0KGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DaGVja01pbkhUTUwodGhpcy5DaGVja0RvdWJsZVNwYWNlKHRleHRCdWlsZCwgZGF0YSkpO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZW1vdmVVbm5lY2Vzc2FyeVNwYWNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29kZSA9IGNvZGUudHJpbSgpO1xuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlQWxsKC8lPlsgXSs8JSg/IVs9Ol0pLywgJyU+PCUnKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgYXN5bmMgSW5zZXJ0KGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICAvL3JlbW92aW5nIGh0bWwgY29tbWVudCB0YWdzXG4gICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoLzwhLS1bXFx3XFxXXSs/LS0+LywgJycpO1xuXG4gICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLlN0YXJ0UmVwbGFjZShkYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgICAgIC8vaWYgdGhlcmUgaXMgYSByZWFkZXIsIHJlcGxhY2luZyBoaW0gd2l0aCAnY29kZWJhc2UnXG4gICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoLzxcXDpyZWFkZXIrKCApKlxcLz4vZ2ksICc8JXR5cGVvZiBwYWdlLmNvZGViYXNlID09IFwiZnVuY3Rpb25cIiA/IHBhZ2UuY29kZWJhc2UoKTogd3JpdGUocGFnZS5jb2RlYmFzZSklPicpIC8vIHJlcGxhY2UgZm9yIGltcG9ydGluZyBwYWdlcyAvIGNvbXBvbmVudHNcbiAgICAgICAgcmV0dXJuIHRoaXMuUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShkYXRhKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuZnVuY3Rpb24gdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBsZXQgYSA9IFwiXCI7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTQpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gc2VhcmNoRm9yQ3V0TWFpbihkYXRhOiBTdHJpbmdUcmFja2VyLCBhcnJheTpzdHJpbmdbXSwgc2luZzpzdHJpbmcsIGJpZ1RhZz86Ym9vbGVhbiwgc2VhcmNoRm9yPzpib29sZWFuKTogU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBsZXQgb3V0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGUgb2YgYXJyYXkpIHtcbiAgICAgICAgb3V0ICs9IHVuaWNvZGVNZShzaW5nKSArIGUgKyBcInxcIjtcbiAgICB9XG4gICAgb3V0ID0gb3V0LnN1YnN0cmluZygwLCBvdXQubGVuZ3RoIC0gMSk7XG4gICAgb3V0ID0gYDwoJHtvdXR9KSR7c2VhcmNoRm9yID8gXCIoW1xcXFxwe0x9MC05X1xcXFwtXFxcXC5dKylcIjogXCJcIn0oXFxcXHUwMDIwKSpcXFxcdTAwMkY/PmBcbiAgICByZXR1cm4gc2VhcmNoRm9yQ3V0KGRhdGEsIG5ldyBSZWdFeHAob3V0LCAndScpLCBzaW5nLCBiaWdUYWcpXG59XG5cbmZ1bmN0aW9uIG91dFRhZ05hbWUoZGF0YTogc3RyaW5nKSB7XG4gICAgY29uc3QgZW5kID0gZGF0YS5pbmRleE9mKFwiPlwiKTtcbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICB3aGlsZSAoZGF0YS5lbmRzV2l0aChcIiBcIikgfHwgZGF0YS5lbmRzV2l0aChcIi9cIikpIHtcbiAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGRhdGEubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuXG5pbnRlcmZhY2UgU2VhcmNoQ3V0RGF0YSB7XG4gICAgdGFnOiBzdHJpbmcsXG4gICAgZGF0YTogU3RyaW5nVHJhY2tlcixcbiAgICBsb2M6IG51bWJlcixcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dE91dHB1dCB7XG4gICAgZGF0YT86IFN0cmluZ1RyYWNrZXIsXG4gICAgZXJyb3I/OiBib29sZWFuLFxuICAgIGZvdW5kPzogU2VhcmNoQ3V0RGF0YVtdXG59XG5cbi8qKlxuICogSXQgc2VhcmNoZXMgZm9yIGEgc3BlY2lmaWMgdGFnIGFuZCByZXR1cm5zIHRoZSBkYXRhIGluc2lkZSBvZiBpdC5cbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gZGF0YSAtIFRoZSBzdHJpbmcgeW91IHdhbnQgdG8gc2VhcmNoIHRocm91Z2guXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZmluZEFycmF5IC0gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHNpbmcgLSBUaGUgc3RyaW5nIHRoYXQgeW91IHdhbnQgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSBbYmlnVGFnPXRydWVdIC0gSWYgdHJ1ZSwgdGhlIGZ1bmN0aW9uIHdpbGwgc2VhcmNoIGZvciB0aGUgZW5kIG9mIHRoZSB0YWcuIElmIGZhbHNlLCBpdCB3aWxsXG4gKiBzZWFyY2ggZm9yIHRoZSBuZXh0IGluc3RhbmNlIG9mIHRoZSB0YWcuXG4gKiBAcGFyYW0gb3V0cHV0IC0gVGhlIG91dHB1dCBvZiB0aGUgc2VhcmNoLlxuICogQHBhcmFtIHtTZWFyY2hDdXREYXRhW119IHJldHVybkFycmF5IC0gQW4gYXJyYXkgb2Ygb2JqZWN0cyB0aGF0IGNvbnRhaW4gdGhlIHRhZyBuYW1lLCB0aGUgZGF0YVxuICogaW5zaWRlIHRoZSB0YWcsIGFuZCB0aGUgbG9jYXRpb24gb2YgdGhlIHRhZyBpbiB0aGUgb3JpZ2luYWwgc3RyaW5nLlxuICogQHJldHVybnMgQSBzdHJpbmcgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQsIGFuZCBhbiBhcnJheSBvZiB0aGUgZGF0YSB0aGF0IHdhcyBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gc2VhcmNoRm9yQ3V0KGRhdGE6U3RyaW5nVHJhY2tlciwgZmluZEFycmF5OlJlZ0V4cCwgc2luZzpzdHJpbmcsIGJpZ1RhZyA9IHRydWUsIG91dHB1dCA9IG5ldyBTdHJpbmdUcmFja2VyKCksIHJldHVybkFycmF5OiBTZWFyY2hDdXREYXRhW10gPSBbXSk6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgY29uc3QgZGF0YUNvcHkgPSBkYXRhO1xuICAgIGNvbnN0IGJlID0gZGF0YS5zZWFyY2goZmluZEFycmF5KTtcbiAgICBpZiAoYmUgPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGE6IG91dHB1dC5QbHVzKGRhdGEpLCBmb3VuZDogcmV0dXJuQXJyYXlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvdXRwdXQuUGx1cyhkYXRhLnN1YnN0cmluZygwLCBiZSkpO1xuXG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGJlICsgMSk7XG5cbiAgICBjb25zdCB0YWcgPSBvdXRUYWdOYW1lKGRhdGEuZXEpO1xuXG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuXG4gICAgbGV0IGluVGFnRGF0YTtcblxuICAgIGlmIChiaWdUYWcpIHtcbiAgICAgICAgY29uc3QgZW5kID0gZmluZEVuZChbXCI8XCIgKyB0YWcsIFwiPC9cIiArIHRhZ10sIGRhdGEpO1xuICAgICAgICBpZiAoZW5kICE9IC0xKSB7XG4gICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGVuZCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZFN0YXJ0KFwiPlwiLCBkYXRhKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmaW5kTmV4dCA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgICAgICAgICBpZiAoZmluZE5leHQgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZmluZE5leHQpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kTmV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm5BcnJheS5wdXNoKHtcbiAgICAgICAgdGFnOiB0YWcsXG4gICAgICAgIGRhdGE6IGluVGFnRGF0YSxcbiAgICAgICAgbG9jOiBiZVxuICAgIH0pO1xuXG4gICAgaWYgKGRhdGFDb3B5ID09IGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VhcmNoRm9yQ3V0KGRhdGEsIGZpbmRBcnJheSwgc2luZywgYmlnVGFnLCBvdXRwdXQsIHJldHVybkFycmF5KTtcbn1cblxuZnVuY3Rpb24gZmluZFN0YXJ0KHR5cGU6c3RyaW5nLCBkYXRhOlN0cmluZ1RyYWNrZXIpIHtcbiAgICByZXR1cm4gZGF0YS5pbmRleE9mKHR5cGUpICsgdHlwZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGZpbmRFbmQodHlwZXM6IHN0cmluZ1tdLCBkYXRhOlN0cmluZ1RyYWNrZXIpIHtcblxuICAgIGxldCBfMCA9IGRhdGEuaW5kZXhPZih0eXBlc1swXSk7XG5cbiAgICBjb25zdCBfMSA9IGRhdGEuaW5kZXhPZih0eXBlc1sxXSk7XG5cbiAgICBpZiAoXzEgPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChfMCA8IF8xICYmIF8wICE9IC0xKSB7XG4gICAgICAgIF8wKys7XG4gICAgICAgIGNvbnN0IG5leHQgPSBfMCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKF8wKSkgKyB0eXBlc1swXS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBuZXh0ICsgZmluZEVuZCh0eXBlcywgZGF0YS5zdWJzdHJpbmcobmV4dCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF8xO1xuICAgIH1cbn1cblxuXG5leHBvcnQge1xuICAgIHNlYXJjaEZvckN1dE1haW4gYXMgZ2V0RGF0YVRhZ3Ncbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2VSZWFkZXIsIHBvb2wgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBnZXREYXRhVGFncyB9IGZyb20gXCIuLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZVwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwLCBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBBZGREZWJ1Z0luZm8gfSBmcm9tICcuLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCBDUnVuVGltZSBmcm9tIFwiLi9Db21waWxlXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5cbmNvbnN0IGlnbm9yZUluaGVyaXQgPSBbJ2NvZGVmaWxlJ107XG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7IGRlZmluZToge30gfTtcblxuYXN5bmMgZnVuY3Rpb24gUGFnZUJhc2VQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICBjaGFyOiBzdHJpbmdcbiAgICB9W11cbn0+IHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IHBvb2wuZXhlYygnUGFnZUJhc2VQYXJzZXInLCBbdGV4dF0pO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBhcnNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsIGNoYXI/OiBzdHJpbmcgfVtdID0gW11cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIG5vbkR5bmFtaWMoaXNEeW5hbWljOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghaXNEeW5hbWljKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZUR5bmFtaWMgPSB0aGlzLnBvcEFueSgnZHluYW1pYycpO1xuICAgICAgICBpZiAoaGF2ZUR5bmFtaWMgIT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgICAgICBwYXJzZS5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgICAgIHBhcnNlLnZhbHVlQXJyYXkgPSBbLi4udGhpcy52YWx1ZUFycmF5LCB7IGtleTogJ2R5bmFtaWMnLCB2YWx1ZTogdHJ1ZSB9XTtcblxuICAgICAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHBhcnNlLmNsZWFyRGF0YS5lcSk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnZHluYW1pYy1zc3ItaW1wb3J0JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQWRkaW5nIFxcJ2R5bmFtaWNcXCcgYXR0cmlidXRlIHRvIGZpbGUgPGNvbG9yPicgKyB0aGlzLnNlc3Npb25JbmZvLnNtYWxsUGF0aFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpXG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkU2V0dGluZ3MocGFnZVBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIHBhZ2VOYW1lOiBzdHJpbmcsIHsgYXR0cmlidXRlcywgZHluYW1pY0NoZWNrfTogeyBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0pIHtcbiAgICAgICAgY29uc3QgcnVuID0gbmV3IENSdW5UaW1lKHRoaXMuY29kZSwgdGhpcy5zZXNzaW9uSW5mbywgc21hbGxQYXRoLCB0aGlzLmlzVHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSBhd2FpdCBydW4uY29tcGlsZShhdHRyaWJ1dGVzKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnBhcnNlQmFzZSh0aGlzLmNvZGUpO1xuICAgICAgICBpZih0aGlzLm5vbkR5bmFtaWMoZHluYW1pY0NoZWNrKSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZENvZGVGaWxlKHBhZ2VQYXRoLCBzbWFsbFBhdGgsIHRoaXMuaXNUcywgcGFnZU5hbWUpO1xuXG4gICAgICAgIHRoaXMubG9hZERlZmluZSh7IC4uLnNldHRpbmdzLmRlZmluZSwgLi4ucnVuLmRlZmluZSB9KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHBhcnNlQmFzZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IGF3YWl0IFBhZ2VCYXNlUGFyc2VyKGNvZGUuZXEpO1xuXG4gICAgICAgIGlmKHBhcnNlci5zdGFydCA9PSBwYXJzZXIuZW5kKXtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gY29kZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihjb25zdCB7Y2hhcixlbmQsa2V5LHN0YXJ0fSBvZiBwYXJzZXIudmFsdWVzKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWVBcnJheS5wdXNoKHtrZXksIHZhbHVlOiBzdGFydCA9PT0gZW5kID8gdHJ1ZTogY29kZS5zdWJzdHJpbmcoc3RhcnQsIGVuZCksIGNoYXJ9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBjb2RlLnN1YnN0cmluZygwLCBwYXJzZXIuc3RhcnQpLlBsdXMoY29kZS5zdWJzdHJpbmcocGFyc2VyLmVuZCkpLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlQXJyYXkubGVuZ3RoKSByZXR1cm4gdGhpcy5jbGVhckRhdGE7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ0BbJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGtleSwgdmFsdWUsIGNoYXIgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYCR7a2V5fT0ke2NoYXJ9JHt2YWx1ZX0ke2NoYXJ9IGA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYCR7a2V5fSBgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBidWlsZC5zdWJzdHJpbmcoMCwgYnVpbGQubGVuZ3RoLTEpLlBsdXMoJ11cXG4nKS5QbHVzKHRoaXMuY2xlYXJEYXRhKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgcmVidWlsZEJhc2VJbmhlcml0YW5jZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlID0gbmV3IFBhcnNlQmFzZVBhZ2UoKTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICBhd2FpdCBwYXJzZS5wYXJzZUJhc2UoY29kZSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHBhcnNlLmJ5VmFsdWUoJ2luaGVyaXQnKSkge1xuICAgICAgICAgICAgaWYoaWdub3JlSW5oZXJpdC5pbmNsdWRlcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSBjb250aW51ZTtcbiAgICAgICAgICAgIHBhcnNlLnBvcChuYW1lKVxuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPEAke25hbWV9Pjw6JHtuYW1lfS8+PC9AJHtuYW1lfT5gKVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgIHJldHVybiBwYXJzZS5jbGVhckRhdGEuUGx1cyhidWlsZCk7XG4gICAgfVxuXG4gICAgZ2V0KG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSk/LnZhbHVlXG4gICAgfVxuXG4gICAgcG9wKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZSh0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkgPT09IG5hbWUpLCAxKVswXT8udmFsdWU7XG4gICAgfVxuXG4gICAgcG9wQW55KG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoYXZlTmFtZSA9IHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleS50b0xvd2VyQ2FzZSgpID09IG5hbWUpO1xuXG4gICAgICAgIGlmIChoYXZlTmFtZSAhPSAtMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKGhhdmVOYW1lLCAxKVswXS52YWx1ZTtcblxuICAgICAgICBjb25zdCBhc1RhZyA9IGdldERhdGFUYWdzKHRoaXMuY2xlYXJEYXRhLCBbbmFtZV0sICdAJyk7XG5cbiAgICAgICAgaWYgKCFhc1RhZy5mb3VuZFswXSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYXNUYWcuZGF0YTtcblxuICAgICAgICByZXR1cm4gYXNUYWcuZm91bmRbMF0uZGF0YS50cmltKCk7XG4gICAgfVxuXG4gICAgYnlWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmlsdGVyKHggPT4geC52YWx1ZSAhPT0gdHJ1ZSAmJiB4LnZhbHVlLmVxID09PSB2YWx1ZSkubWFwKHggPT4geC5rZXkpXG4gICAgfVxuXG4gICAgcmVwbGFjZVZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkgPT09IG5hbWUpXG4gICAgICAgIGlmIChoYXZlKSBoYXZlLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZGVmYXVsdFZhbHVlUG9wQW55PFQ+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBUKTogc3RyaW5nIHwgVCB8IG51bGwge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucG9wQW55KG5hbWUpO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgPyBkZWZhdWx0VmFsdWUgOiB2YWx1ZT8uZXE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkQ29kZUZpbGUocGFnZVBhdGg6IHN0cmluZywgcGFnZVNtYWxsUGF0aDogc3RyaW5nLCBpc1RzOiBib29sZWFuLCBwYWdlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBoYXZlQ29kZSA9IHRoaXMuZGVmYXVsdFZhbHVlUG9wQW55KCdjb2RlZmlsZScsICdpbmhlcml0Jyk7XG4gICAgICAgIGlmICghaGF2ZUNvZGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsYW5nID0gdGhpcy5kZWZhdWx0VmFsdWVQb3BBbnkoJ2xhbmcnLCAnanMnKTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGhhdmVDb2RlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChvcmlnaW5hbFZhbHVlID09ICdpbmhlcml0JylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGFnZVBhdGg7XG5cbiAgICAgICAgY29uc3QgaGF2ZUV4dCA9IHBhdGguZXh0bmFtZShoYXZlQ29kZSkuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgIGlmICghWydqcycsICd0cyddLmluY2x1ZGVzKGhhdmVFeHQpKSB7XG4gICAgICAgICAgICBpZiAoLyhcXFxcfFxcLykkLy50ZXN0KGhhdmVDb2RlKSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYWdlUGF0aC5zcGxpdCgnLycpLnBvcCgpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIUJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMoaGF2ZUV4dCkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGF0aC5leHRuYW1lKHBhZ2VQYXRoKTtcbiAgICAgICAgICAgIGhhdmVDb2RlICs9ICcuJyArIChsYW5nID8gbGFuZyA6IGlzVHMgPyAndHMnIDogJ2pzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGF2ZUNvZGVbMF0gPT0gJy4nKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHBhZ2VQYXRoKSwgaGF2ZUNvZGUpXG5cbiAgICAgICAgY29uc3QgU21hbGxQYXRoID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShoYXZlQ29kZSk7XG5cbiAgICAgICAgaWYgKGF3YWl0IHRoaXMuc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsIGhhdmVDb2RlKSkge1xuICAgICAgICAgICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhmYWxzZSwgcGFnZU5hbWUsIGhhdmVDb2RlLCBTbWFsbFBhdGgpOyAvLyByZWFkIG1vZGVsXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBiYXNlTW9kZWxEYXRhLmFsbERhdGEucmVwbGFjZUFsbChcIkBcIiwgXCJAQFwiKTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKCc8JScpO1xuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRBZnRlck5vVHJhY2soJyU+Jyk7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmRlYnVnICYmIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgICAgIH0gZWxzZSBpZihvcmlnaW5hbFZhbHVlID09ICdpbmhlcml0JyAmJiB0aGlzLnNlc3Npb25JbmZvLmRlYnVnKXtcbiAgICAgICAgICAgIEVhc3lGcy53cml0ZUZpbGUoaGF2ZUNvZGUsICcnKTtcbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICBpZDogU21hbGxQYXRoLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjcmVhdGUtY29kZS1maWxlJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIGNyZWF0ZWQ6IDxjb2xvcj4ke3BhZ2VQYXRofTxsaW5lPiR7U21hbGxQYXRofWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgaWQ6IFNtYWxsUGF0aCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvZGUtZmlsZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgbm90IGZvdW5kOiA8Y29sb3I+JHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgSlNQYXJzZXIucHJpbnRFcnJvcihgQ29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nYCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgc3RyaW5nKVtdW10gPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcy51bnNoaWZ0KC4uLk9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpKVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyXCI7XG5pbXBvcnQgeyBDb252ZXJ0U3ludGF4TWluaSB9IGZyb20gXCIuLi8uLi9QbHVnaW5zL1N5bnRheC9SYXpvclN5bnRheFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHNtYWxsUGF0aFRvUGFnZSB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gXCIuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZ1wiO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gXCIuLi9KU1BhcnNlclwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uL1Nlc3Npb25cIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gXCIuLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDUnVuVGltZSB7XG4gICAgZGVmaW5lID0ge31cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2NyaXB0OiBTdHJpbmdUcmFja2VyLCBwdWJsaWMgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgcHVibGljIHNtYWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgaXNUczogYm9vbGVhbikge1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVNjcmlwdChzY3JpcHRzOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBjb25zdCBfX3dyaXRlQXJyYXkgPSBbXVxuICAgICAgICB2YXIgX193cml0ZTtcblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0KXtcbiAgICAgICAgICAgIF9fd3JpdGUudGV4dCArPSB0ZXh0O1xuICAgICAgICB9YClcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2Ygc2NyaXB0cykge1xuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxuX193cml0ZSA9IHt0ZXh0OiAnJ307X193cml0ZUFycmF5LnVuc2hpZnQoX193cml0ZSk7YClcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMoaSlcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYFxcbnJldHVybiBfX3dyaXRlQXJyYXlgKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWV0aG9kcyhhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGNvbnN0IF9fbG9jYWxwYXRoID0gJy8nICsgc21hbGxQYXRoVG9QYWdlKHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0cmluZzogJ3NjcmlwdCxzdHlsZSxkZWZpbmUsc3RvcmUscGFnZV9fZmlsZW5hbWUscGFnZV9fZGlybmFtZSxfX2xvY2FscGF0aCxhdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgIGZ1bmNzOiBbXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zY3JpcHQuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnN0eWxlLmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB0aGlzLmRlZmluZVtTdHJpbmcoa2V5KV0gPSB2YWx1ZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNvbXBpbGVSdW5UaW1lU3RvcmUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5mdWxsUGF0aCxcbiAgICAgICAgICAgICAgICBwYXRoLmRpcm5hbWUodGhpcy5zZXNzaW9uSW5mby5mdWxsUGF0aCksXG4gICAgICAgICAgICAgICAgX19sb2NhbHBhdGgsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcyB8fCB7fVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkQ29kZShwYXJzZXI6IEpTUGFyc2VyLCBidWlsZFN0cmluZ3M6IHsgdGV4dDogc3RyaW5nIH1bXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhpLnRleHQpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhidWlsZFN0cmluZ3MucG9wKCkudGV4dCwgaS50ZXh0LkRlZmF1bHRJbmZvVGV4dC5pbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBhc3luYyBjb21waWxlKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgLyogbG9hZCBmcm9tIGNhY2hlICovXG4gICAgICAgIGNvbnN0IGhhdmVDYWNoZSA9IHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXTtcbiAgICAgICAgaWYgKGhhdmVDYWNoZSlcbiAgICAgICAgICAgIHJldHVybiAoYXdhaXQgaGF2ZUNhY2hlKSh0aGlzLm1ldGhvZHMoYXR0cmlidXRlcykuZnVuY3MpO1xuICAgICAgICBsZXQgZG9Gb3JBbGw6IChyZXNvbHZlOiAoZnVuY3M6IGFueVtdKSA9PiBTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPikgPT4gdm9pZDtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gbmV3IFByb21pc2UociA9PiBkb0ZvckFsbCA9IHIpO1xuXG4gICAgICAgIC8qIHJ1biB0aGUgc2NyaXB0ICovXG4gICAgICAgIHRoaXMuc2NyaXB0ID0gYXdhaXQgQ29udmVydFN5bnRheE1pbmkodGhpcy5zY3JpcHQsIFwiQGNvbXBpbGVcIiwgXCIqXCIpO1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGhpcy5zY3JpcHQsIHRoaXMuc21hbGxQYXRoLCAnPCUqJywgJyU+Jyk7XG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGlmIChwYXJzZXIudmFsdWVzLmxlbmd0aCA9PSAxICYmIHBhcnNlci52YWx1ZXNbMF0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlID0gKCkgPT4gdGhpcy5zY3JpcHQ7XG4gICAgICAgICAgICBkb0ZvckFsbChyZXNvbHZlKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdHlwZSwgZmlsZVBhdGhdID0gU3BsaXRGaXJzdCgnLycsIHRoaXMuc21hbGxQYXRoKSwgdHlwZUFycmF5ID0gZ2V0VHlwZXNbdHlwZV0gPz8gZ2V0VHlwZXMuU3RhdGljLFxuICAgICAgICAgICAgY29tcGlsZVBhdGggPSB0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY29tcC5qcyc7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoZmlsZVBhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlU2NyaXB0KHBhcnNlci52YWx1ZXMuZmlsdGVyKHggPT4geC50eXBlICE9ICd0ZXh0JykubWFwKHggPT4geC50ZXh0KSk7XG4gICAgICAgIGNvbnN0IHsgZnVuY3MsIHN0cmluZyB9ID0gdGhpcy5tZXRob2RzKGF0dHJpYnV0ZXMpXG5cbiAgICAgICAgY29uc3QgdG9JbXBvcnQgPSBhd2FpdCBjb21waWxlSW1wb3J0KHN0cmluZywgY29tcGlsZVBhdGgsIGZpbGVQYXRoLCB0eXBlQXJyYXksIHRoaXMuaXNUcywgdGhpcy5zZXNzaW9uSW5mby5kZWJ1ZywgdGVtcGxhdGUpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGUgPSBhc3luYyAoZnVuY3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYnVpbGRDb2RlKHBhcnNlciwgYXdhaXQgdG9JbXBvcnQoLi4uZnVuY3MpKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogZXJyLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSBleGVjdXRlOyAvLyBzYXZlIHRoaXMgdG8gY2FjaGVcbiAgICAgICAgY29uc3QgdGhpc0ZpcnN0ID0gYXdhaXQgZXhlY3V0ZShmdW5jcyk7XG4gICAgICAgIGRvRm9yQWxsKGV4ZWN1dGUpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNGaXJzdDtcbiAgICB9XG59IiwgImltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0xvZ2dlclwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXhcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIGlzVHMgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4vcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgcGFnZURlcHMgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzXCI7XG5pbXBvcnQgQ3VzdG9tSW1wb3J0LCB7IGlzUGF0aEN1c3RvbSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9pbmRleFwiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gXCIuLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZVwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCB9IGZyb20gXCIuLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZFwiO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvQWxpYXNcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCB7IENvbW1vbmpzLCBlc1RhcmdldCwgVHJhbnNmb3JtSlNDIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5ncyc7XG5cbmFzeW5jIGZ1bmN0aW9uIFJlcGxhY2VCZWZvcmUoXG4gIGNvZGU6IHN0cmluZyxcbiAgZGVmaW5lRGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSxcbikge1xuICBjb2RlID0gYXdhaXQgRWFzeVN5bnRheC5CdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZSwgZGVmaW5lRGF0YSk7XG4gIHJldHVybiBjb2RlO1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZShjb2RlOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGRpcjogc3RyaW5nLCBmaWxlOiBzdHJpbmcsIHBhcmFtcz86IHN0cmluZykge1xuICByZXR1cm4gYCR7aXNEZWJ1ZyA/IFwicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1wiIDogJyd9dmFyIF9fZGlybmFtZT1cIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhkaXIpXG4gICAgfVwiLF9fZmlsZW5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZmlsZSlcbiAgICB9XCI7bW9kdWxlLmV4cG9ydHMgPSAoYXN5bmMgKHJlcXVpcmUke3BhcmFtcyA/ICcsJyArIHBhcmFtcyA6ICcnfSk9Pnt2YXIgbW9kdWxlPXtleHBvcnRzOnt9fSxleHBvcnRzPW1vZHVsZS5leHBvcnRzOyR7Y29kZX1cXG5yZXR1cm4gbW9kdWxlLmV4cG9ydHM7fSk7YDtcbn1cblxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmlsZSBwYXRoLCBhbmQgcmV0dXJucyB0aGUgY29tcGlsZWQgY29kZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbH0gc2F2ZVBhdGggLSBUaGUgcGF0aCB0byBzYXZlIHRoZSBjb21waWxlZCBmaWxlIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBpc1R5cGVzY3JpcHQgLSBib29sZWFuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuLFxuICogQHBhcmFtICAtIGZpbGVQYXRoOiBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjb21waWxlLlxuICogQHJldHVybnMgVGhlIHJlc3VsdCBvZiB0aGUgc2NyaXB0LlxuICovXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChmaWxlUGF0aDogc3RyaW5nLCBzYXZlUGF0aDogc3RyaW5nIHwgbnVsbCwgaXNUeXBlc2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCB7IHBhcmFtcywgdGVtcGxhdGVQYXRoID0gZmlsZVBhdGgsIGNvZGVNaW5pZnkgPSAhaXNEZWJ1ZywgbWVyZ2VUcmFjayB9OiB7IGNvZGVNaW5pZnk/OiBib29sZWFuLCB0ZW1wbGF0ZVBhdGg/OiBzdHJpbmcsIHBhcmFtcz86IHN0cmluZywgbWVyZ2VUcmFjaz86IFN0cmluZ1RyYWNrZXIgfSA9IHt9KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IENvbW1vbmpzKHtcbiAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICBwYXJzZXI6IHtcbiAgICAgICAgc3ludGF4OiBpc1R5cGVzY3JpcHQgPyBcInR5cGVzY3JpcHRcIiA6IFwiZWNtYXNjcmlwdFwiLFxuICAgICAgICAuLi5HZXRQbHVnaW4oKGlzVHlwZXNjcmlwdCA/ICdUUycgOiAnSlMnKSArIFwiT3B0aW9uc1wiKVxuICAgICAgfVxuICAgIH0pLFxuICAgIG1pbmlmeTogY29kZU1pbmlmeSxcbiAgICBmaWxlbmFtZTogZmlsZVBhdGgsXG4gICAgc291cmNlTWFwczogaXNEZWJ1ZyA/IChtZXJnZVRyYWNrID8gdHJ1ZSA6ICdpbmxpbmUnKSA6IGZhbHNlLFxuICAgIG91dHB1dFBhdGg6IHNhdmVQYXRoICYmIHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSwgZmlsZVBhdGgpXG4gIH0pO1xuXG4gIGxldCBSZXN1bHQgPSBhd2FpdCBSZXBsYWNlQmVmb3JlKG1lcmdlVHJhY2s/LmVxIHx8IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCksIHsgZGVidWc6IFwiXCIgKyBpc0RlYnVnIH0pO1xuICBSZXN1bHQgPSB0ZW1wbGF0ZShcbiAgICBSZXN1bHQsXG4gICAgaXNEZWJ1ZyxcbiAgICBwYXRoLmRpcm5hbWUodGVtcGxhdGVQYXRoKSxcbiAgICB0ZW1wbGF0ZVBhdGgsXG4gICAgcGFyYW1zXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKFJlc3VsdCwgT3B0aW9ucyk7XG4gICAgUmVzdWx0ID0gbWVyZ2VUcmFjayAmJiBtYXAgJiYgKGF3YWl0IGJhY2tUb09yaWdpbmFsKG1lcmdlVHJhY2ssIGNvZGUsIG1hcCkpLlN0cmluZ1dpdGhUYWNrKHNhdmVQYXRoKSB8fCBjb2RlO1xuXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChtZXJnZVRyYWNrKSB7XG4gICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIobWVyZ2VUcmFjaywgZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc2F2ZVBhdGgpIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGguZGlybmFtZShzYXZlUGF0aCkpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoc2F2ZVBhdGgsIFJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIFJlc3VsdDtcbn1cblxuZnVuY3Rpb24gQ2hlY2tUcyhGaWxlUGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBGaWxlUGF0aC5lbmRzV2l0aChcIi50c1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChJblN0YXRpY1BhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgcmV0dXJuIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHR5cGVBcnJheVswXSArIEluU3RhdGljUGF0aCxcbiAgICB0eXBlQXJyYXlbMV0gKyBJblN0YXRpY1BhdGggKyBcIi5janNcIixcbiAgICBDaGVja1RzKEluU3RhdGljUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFkZEV4dGVuc2lvbihGaWxlUGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbGVFeHQgPSBwYXRoLmV4dG5hbWUoRmlsZVBhdGgpO1xuXG4gIGlmIChCYXNpY1NldHRpbmdzLnBhcnRFeHRlbnNpb25zLmluY2x1ZGVzKGZpbGVFeHQuc3Vic3RyaW5nKDEpKSlcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIChpc1RzKCkgPyBcInRzXCIgOiBcImpzXCIpXG4gIGVsc2UgaWYgKGZpbGVFeHQgPT0gJycpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyBCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc1tpc1RzKCkgPyBcInRzXCIgOiBcImpzXCJdO1xuXG4gIHJldHVybiBGaWxlUGF0aDtcbn1cblxuY29uc3QgU2F2ZWRNb2R1bGVzID0ge30sIFByZXBhcmVNYXAgPSB7fTtcblxuLyoqXG4gKiBMb2FkSW1wb3J0IGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggdG8gYSBmaWxlLCBhbmQgcmV0dXJucyB0aGUgbW9kdWxlIHRoYXQgaXMgYXQgdGhhdCBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBpbXBvcnRGcm9tIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBjcmVhdGVkIHRoaXMgaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IEluU3RhdGljUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IFt1c2VEZXBzXSAtIFRoaXMgaXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gd2l0aG91dENhY2hlIC0gYW4gYXJyYXkgb2YgcGF0aHMgdGhhdCB3aWxsIG5vdCBiZSBjYWNoZWQuXG4gKiBAcmV0dXJucyBUaGUgbW9kdWxlIHRoYXQgd2FzIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBMb2FkSW1wb3J0KGltcG9ydEZyb206IHN0cmluZ1tdLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgeyBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHMsIHdpdGhvdXRDYWNoZSA9IFtdLCBvbmx5UHJlcGFyZSB9OiB7IGlzRGVidWc6IGJvb2xlYW4sIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZT86IHN0cmluZ1tdLCBvbmx5UHJlcGFyZT86IGJvb2xlYW4gfSkge1xuICBsZXQgVGltZUNoZWNrOiBhbnk7XG4gIGNvbnN0IG9yaWdpbmFsUGF0aCA9IHBhdGgubm9ybWFsaXplKEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcblxuICBJblN0YXRpY1BhdGggPSBBZGRFeHRlbnNpb24oSW5TdGF0aWNQYXRoKTtcbiAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKEluU3RhdGljUGF0aCkuc3Vic3RyaW5nKDEpLCB0aGlzQ3VzdG9tID0gaXNQYXRoQ3VzdG9tKG9yaWdpbmFsUGF0aCwgZXh0ZW5zaW9uKSB8fCAhWydqcycsICd0cyddLmluY2x1ZGVzKGV4dGVuc2lvbik7XG4gIGNvbnN0IFNhdmVkTW9kdWxlc1BhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgpLCBmaWxlUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIEluU3RhdGljUGF0aCk7XG5cbiAgaWYoaW1wb3J0RnJvbS5pbmNsdWRlcyhTYXZlZE1vZHVsZXNQYXRoKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgIGVycm9yTmFtZTogJ2NpcmNsZS1pbXBvcnQnLFxuICAgICAgdGV4dDogYEltcG9ydCAnJHtTYXZlZE1vZHVsZXNQYXRofScgY3JlYXRlcyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgPGNvbG9yPiR7aW1wb3J0RnJvbS5zbGljZShpbXBvcnRGcm9tLmluZGV4T2YoU2F2ZWRNb2R1bGVzUGF0aCkpLmNvbmNhdChmaWxlUGF0aCkuam9pbignIC0+XFxuJyl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG51bGxcbiAgICB1c2VEZXBzW0luU3RhdGljUGF0aF0gPSB7IHRoaXNGaWxlOiAtMSB9O1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvL3dhaXQgaWYgdGhpcyBtb2R1bGUgaXMgb24gcHJvY2VzcywgaWYgbm90IGRlY2xhcmUgdGhpcyBhcyBvbiBwcm9jZXNzIG1vZHVsZVxuICBsZXQgcHJvY2Vzc0VuZDogKHY/OiBhbnkpID0+IHZvaWQ7XG4gIGlmICghb25seVByZXBhcmUpIHtcbiAgICBpZiAoIVNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSlcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gcHJvY2Vzc0VuZCA9IHIpO1xuICAgIGVsc2UgaWYgKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgICBhd2FpdCBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG4gIH1cblxuXG4gIC8vYnVpbGQgcGF0aHNcbiAgY29uc3QgcmVCdWlsZCA9ICFwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSB8fCBwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSAhPSAoVGltZUNoZWNrID0gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKSk7XG5cblxuICBpZiAocmVCdWlsZCkge1xuICAgIFRpbWVDaGVjayA9IFRpbWVDaGVjayA/PyBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpO1xuICAgIGlmIChUaW1lQ2hlY2sgPT0gbnVsbCkge1xuICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgdGV4dDogYEltcG9ydCAnJHtJblN0YXRpY1BhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSA8Y29sb3I+JyR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGh9LyR7aW1wb3J0RnJvbS5hdCgtMSl9J2BcbiAgICAgIH0pO1xuICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBudWxsXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzQ3VzdG9tKSAvLyBvbmx5IGlmIG5vdCBjdXN0b20gYnVpbGRcbiAgICAgIGF3YWl0IEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnKTtcbiAgICBwYWdlRGVwcy51cGRhdGUoU2F2ZWRNb2R1bGVzUGF0aCwgVGltZUNoZWNrKTtcbiAgfVxuXG4gIGlmICh1c2VEZXBzKSB7XG4gICAgdXNlRGVwc1tJblN0YXRpY1BhdGhdID0geyB0aGlzRmlsZTogVGltZUNoZWNrIH07XG4gICAgdXNlRGVwcyA9IHVzZURlcHNbSW5TdGF0aWNQYXRoXTtcbiAgfVxuXG4gIGNvbnN0IGluaGVyaXRhbmNlQ2FjaGUgPSB3aXRob3V0Q2FjaGVbMF0gPT0gSW5TdGF0aWNQYXRoO1xuICBpZiAoaW5oZXJpdGFuY2VDYWNoZSlcbiAgICB3aXRob3V0Q2FjaGUuc2hpZnQoKVxuICBlbHNlIGlmICghcmVCdWlsZCAmJiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gJiYgIShTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKSlcbiAgICByZXR1cm4gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShJblN0YXRpY1BhdGgpLCBwKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydChbLi4uaW1wb3J0RnJvbSwgU2F2ZWRNb2R1bGVzUGF0aF0sIHAsIHR5cGVBcnJheSwgeyBpc0RlYnVnLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGU6IGluaGVyaXRhbmNlQ2FjaGUgPyB3aXRob3V0Q2FjaGUgOiBbXSB9KTtcbiAgfVxuXG4gIGxldCBNeU1vZHVsZTogYW55O1xuICBpZiAodGhpc0N1c3RvbSkge1xuICAgIE15TW9kdWxlID0gYXdhaXQgQ3VzdG9tSW1wb3J0KG9yaWdpbmFsUGF0aCwgZmlsZVBhdGgsIGV4dGVuc2lvbiwgcmVxdWlyZU1hcCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVxdWlyZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBJblN0YXRpY1BhdGggKyBcIi5janNcIik7XG4gICAgTXlNb2R1bGUgPSBJbXBvcnRXaXRob3V0Q2FjaGUocmVxdWlyZVBhdGgpO1xuXG4gICAgaWYgKG9ubHlQcmVwYXJlKSB7IC8vIG9ubHkgcHJlcGFyZSB0aGUgbW9kdWxlIHdpdGhvdXQgYWN0aXZlbHkgaW1wb3J0aW5nIGl0XG4gICAgICBQcmVwYXJlTWFwW1NhdmVkTW9kdWxlc1BhdGhdID0gKCkgPT4gTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHsgXG4gICAgICBNeU1vZHVsZSA9IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICAgIH1cbiAgICAgY2F0Y2ggKGVycikge1xuICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtZXJyb3InLFxuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX08Y29sb3I+JHtpbXBvcnRGcm9tLmNvbmNhdChmaWxlUGF0aCkucmV2ZXJzZSgpLmpvaW4oJyAtPlxcbicpfWBcbiAgICAgIH0pO1xuICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgIH1cbiAgfVxuXG4gIC8vaW4gY2FzZSBvbiBhbiBlcnJvciAtIHJlbGVhc2UgdGhlIGFzeW5jXG4gIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IE15TW9kdWxlO1xuICBwcm9jZXNzRW5kPy4oKTtcblxuXG4gIHJldHVybiBNeU1vZHVsZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEltcG9ydEZpbGUoaW1wb3J0RnJvbTogc3RyaW5nLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSkge1xuICBpZiAoIWlzRGVidWcpIHtcbiAgICBjb25zdCBTYXZlZE1vZHVsZXNQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoLnRvTG93ZXJDYXNlKCkpO1xuICAgIGNvbnN0IGhhdmVJbXBvcnQgPSBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgICBpZiAoaGF2ZUltcG9ydCAhPSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gaGF2ZUltcG9ydDtcbiAgICBlbHNlIGlmIChQcmVwYXJlTWFwW1NhdmVkTW9kdWxlc1BhdGhdKSB7XG4gICAgICBjb25zdCBtb2R1bGUgPSBhd2FpdCBQcmVwYXJlTWFwW1NhdmVkTW9kdWxlc1BhdGhdKCk7XG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBtb2R1bGU7XG4gICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBMb2FkSW1wb3J0KFtpbXBvcnRGcm9tXSwgSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIHsgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZU9uY2UoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBmaWxlUGF0aCxcbiAgICB0ZW1wRmlsZSxcbiAgICBDaGVja1RzKGZpbGVQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIGF3YWl0IE15TW9kdWxlKChwYXRoOiBzdHJpbmcpID0+IGltcG9ydChwYXRoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlQ2pzU2NyaXB0KGNvbnRlbnQ6IHN0cmluZykge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0ZW1wRmlsZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kZWwgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBmYWtlIHNjcmlwdCBsb2NhdGlvbiwgYSBmaWxlIGxvY2F0aW9uLCBhIHR5cGUgYXJyYXksIGFuZCBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgb3Igbm90IGl0J3NcbiAqIGEgVHlwZVNjcmlwdCBmaWxlLiBJdCB0aGVuIGNvbXBpbGVzIHRoZSBzY3JpcHQgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIHRoZSBtb2R1bGVcbiAqIFRoaXMgaXMgZm9yIFJ1blRpbWUgQ29tcGlsZSBTY3JpcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2xvYmFsUHJhbXMgLSBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLFxuICogdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNjcmlwdExvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBzY3JpcHQgdG8gYmUgY29tcGlsZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGUgZnJvbSB0aGUgc3RhdGljIGZvbGRlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFtzdHJpbmcsIHN0cmluZ11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlU2NyaXB0IC0gYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIElmIHRydWUsIHRoZSBjb2RlIHdpbGwgYmUgY29tcGlsZWQgd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlQ29kZSAtIFRoZSBjb2RlIHRoYXQgd2lsbCBiZSBjb21waWxlZCBhbmQgc2F2ZWQgdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTWFwQ29tbWVudCAtIHN0cmluZ1xuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUltcG9ydChnbG9iYWxQcmFtczogc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBtZXJnZVRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCB0eXBlQXJyYXlbMV0pO1xuXG4gIGNvbnN0IGZ1bGxTYXZlTG9jYXRpb24gPSBzY3JpcHRMb2NhdGlvbiArIFwiLmNqc1wiO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0eXBlQXJyYXlbMF0gKyBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgc2NyaXB0TG9jYXRpb24sXG4gICAgZnVsbFNhdmVMb2NhdGlvbixcbiAgICBpc1R5cGVTY3JpcHQsXG4gICAgaXNEZWJ1ZyxcbiAgICB7IHBhcmFtczogZ2xvYmFsUHJhbXMsIG1lcmdlVHJhY2ssIHRlbXBsYXRlUGF0aCwgY29kZU1pbmlmeTogZmFsc2UgfVxuICApO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgcCk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydChbdGVtcGxhdGVQYXRoXSwgcCwgdHlwZUFycmF5LCB7IGlzRGVidWcgfSk7XG4gIH1cblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShmdWxsU2F2ZUxvY2F0aW9uKTtcbiAgcmV0dXJuIGFzeW5jICguLi5hcnI6IGFueVtdKSA9PiBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwLCAuLi5hcnIpO1xufSIsICJpbXBvcnQgeyBTdHJpbmdNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBNaW5pU2VhcmNoLCB7U2VhcmNoT3B0aW9ucywgU2VhcmNoUmVzdWx0fSBmcm9tICdtaW5pc2VhcmNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoUmVjb3JkIHtcbiAgICBwcml2YXRlIGZ1bGxQYXRoOiBzdHJpbmdcbiAgICBwcml2YXRlIGluZGV4RGF0YToge1trZXk6IHN0cmluZ106IHtcbiAgICAgICAgdGl0bGVzOiBTdHJpbmdNYXAsXG4gICAgICAgIHRleHQ6IHN0cmluZ1xuICAgIH19XG4gICAgcHJpdmF0ZSBtaW5pU2VhcmNoOiBNaW5pU2VhcmNoO1xuICAgIGNvbnN0cnVjdG9yKGZpbGVwYXRoOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgZmlsZXBhdGggKyAnLmpzb24nXG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZCgpe1xuICAgICAgICB0aGlzLmluZGV4RGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5mdWxsUGF0aCk7XG4gICAgICAgIGNvbnN0IHVud3JhcHBlZDoge2lkOiBudW1iZXIsIHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9W10gPSBbXTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGZvcihjb25zdCBwYXRoIGluIHRoaXMuaW5kZXhEYXRhKXtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmluZGV4RGF0YVtwYXRoXTtcbiAgICAgICAgICAgIGZvcihjb25zdCBpZCBpbiBlbGVtZW50LnRpdGxlcyl7XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGl0bGVzW2lkXSwgdXJsOiBgLyR7cGF0aH0jJHtpZH1gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50ZXh0LCB1cmw6IGAvJHtwYXRofWB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWluaVNlYXJjaCA9IG5ldyBNaW5pU2VhcmNoKHtcbiAgICAgICAgICAgIGZpZWxkczogWyd0ZXh0J10sXG4gICAgICAgICAgICBzdG9yZUZpZWxkczogWydpZCcsICd0ZXh0JywgJ3VybCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMubWluaVNlYXJjaC5hZGRBbGxBc3luYyh1bndyYXBwZWQpO1xuICAgIH1cblxuLyoqXG4gKiBJdCBzZWFyY2hlcyBmb3IgYSBzdHJpbmcgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgbWF0Y2hlc1xuICogQHBhcmFtIHRleHQgLSBUaGUgdGV4dCB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIG9wdGlvbnMgLSBsZW5ndGggLSBtYXhpbXVtIGxlbmd0aCAtICpub3QgY3V0dGluZyBoYWxmIHdvcmRzKlxuICogXG4gKiBhZGRBZnRlck1heExlbmd0aCAtIGFkZCB0ZXh0IGlmIGEgdGV4dCByZXN1bHQgcmVhY2ggdGhlIG1heGltdW0gbGVuZ3RoLCBmb3IgZXhhbXBsZSAnLi4uJ1xuICogQHBhcmFtIHRhZyAtIFRoZSB0YWcgdG8gd3JhcCBhcm91bmQgdGhlIGZvdW5kZWQgc2VhcmNoIHRlcm1zLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgY29udGFpbmluZyB0aGUgYHRleHRgIG9mIHRoZSBzZWFyY2ggcmVzdWx0LCBgbGlua2AgdG8gdGhlIHBhZ2UsIGFuZCBhbiBhcnJheSBvZlxuICogb2JqZWN0cyBjb250YWluaW5nIHRoZSB0ZXJtcyBhbmQgdGhlIGluZGV4IG9mIHRoZSB0ZXJtIGluIHRoZSB0ZXh0LlxuICovXG4gICAgc2VhcmNoKHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyAmIHtsZW5ndGg/OiBudW1iZXIsIGFkZEFmdGVyTWF4TGVuZ3RoPzogc3RyaW5nfSA9IHtmdXp6eTogdHJ1ZSwgbGVuZ3RoOiAyMDAsIGFkZEFmdGVyTWF4TGVuZ3RoOiAnLi4uJ30sIHRhZyA9ICdiJyk6IChTZWFyY2hSZXN1bHQgJiB7dGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZ30pW117XG4gICAgICAgIGNvbnN0IGRhdGEgPSA8YW55PnRoaXMubWluaVNlYXJjaC5zZWFyY2godGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIGlmKCF0YWcpIHJldHVybiBkYXRhO1xuXG4gICAgICAgIGZvcihjb25zdCBpIG9mIGRhdGEpe1xuICAgICAgICAgICAgZm9yKGNvbnN0IHRlcm0gb2YgaS50ZXJtcyl7XG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5sZW5ndGggJiYgaS50ZXh0Lmxlbmd0aCA+IG9wdGlvbnMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gaS50ZXh0LnN1YnN0cmluZygwLCBvcHRpb25zLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGkudGV4dFtvcHRpb25zLmxlbmd0aF0udHJpbSgpICE9ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IHN1YnN0cmluZy5zdWJzdHJpbmcoMCwgc3Vic3RyaW5nLmxhc3RJbmRleE9mKCcgJykpICsgKG9wdGlvbnMuYWRkQWZ0ZXJNYXhMZW5ndGggPz8gJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaS50ZXh0ID0gc3Vic3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS50ZXh0ID0gaS50ZXh0LnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyID0gaS50ZXh0LnRvTG93ZXJDYXNlKCksIHJlYnVpbGQgPSAnJztcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIGxldCBiZWVuTGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGluZGV4ICE9IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgcmVidWlsZCArPSBpLnRleHQuc3Vic3RyaW5nKGJlZW5MZW5ndGgsIGJlZW5MZW5ndGggKyBpbmRleCkgKyAgYDwke3RhZ30+JHtpLnRleHQuc3Vic3RyaW5nKGluZGV4ICsgYmVlbkxlbmd0aCwgaW5kZXggKyB0ZXJtLmxlbmd0aCArIGJlZW5MZW5ndGgpfTwvJHt0YWd9PmBcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBsb3dlci5zdWJzdHJpbmcoaW5kZXggKyB0ZXJtLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJlZW5MZW5ndGggKz0gaW5kZXggKyB0ZXJtLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGkudGV4dCA9IHJlYnVpbGQgKyBpLnRleHQuc3Vic3RyaW5nKGJlZW5MZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgc3VnZ2VzdCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMpe1xuICAgICAgICByZXR1cm4gdGhpcy5taW5pU2VhcmNoLmF1dG9TdWdnZXN0KHRleHQsIG9wdGlvbnMpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFNlYXJjaFJlY29yZCBmcm9tIFwiLi4vLi4vLi4vR2xvYmFsL1NlYXJjaFJlY29yZFwiXG5pbXBvcnQge1NldHRpbmdzfSAgZnJvbSAnLi4vLi4vLi4vTWFpbkJ1aWxkL1NlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbn0iLCAiaW1wb3J0IHBhY2thZ2VFeHBvcnQgZnJvbSBcIi4vcGFja2FnZUV4cG9ydFwiO1xuXG4vL0B0cy1pZ25vcmUtbmV4dC1saW5lXG5leHBvcnQgY29uc3QgYWxpYXNOYW1lcyA9IFtwYWNrYWdlTmFtZV1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aDogc3RyaW5nKTogYW55IHtcblxuICAgIHN3aXRjaCAob3JpZ2luYWxQYXRoKSB7XG4gICAgICAgIC8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbiAgICAgICAgY2FzZSBwYWNrYWdlTmFtZTpcbiAgICAgICAgICAgIHJldHVybiBwYWNrYWdlRXhwb3J0KClcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGlhc09yUGFja2FnZShvcmlnaW5hbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGhhdmUgPSBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGgpO1xuICAgIGlmIChoYXZlKSByZXR1cm4gaGF2ZVxuICAgIHJldHVybiBpbXBvcnQob3JpZ2luYWxQYXRoKTtcbn0iLCAiaW1wb3J0IEltcG9ydEFsaWFzLCB7IGFsaWFzTmFtZXMgfSBmcm9tICcuL0FsaWFzJztcbmltcG9ydCBJbXBvcnRCeUV4dGVuc2lvbiwgeyBjdXN0b21UeXBlcyB9IGZyb20gJy4vRXh0ZW5zaW9uL2luZGV4JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY3VzdG9tVHlwZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSB8fCBhbGlhc05hbWVzLmluY2x1ZGVzKG9yaWdpbmFsUGF0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGg6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcsIHJlcXVpcmU6IChwOiBzdHJpbmcpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsaWFzRXhwb3J0ID0gYXdhaXQgSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoYWxpYXNFeHBvcnQpIHJldHVybiBhbGlhc0V4cG9ydDtcbiAgICByZXR1cm4gSW1wb3J0QnlFeHRlbnNpb24oZnVsbFBhdGgsIGV4dGVuc2lvbik7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFJhem9yVG9FSlMsIFJhem9yVG9FSlNNaW5pIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQmFzZVJlYWRlci9SZWFkZXInO1xuXG5cbmNvbnN0IGFkZFdyaXRlTWFwID0ge1xuICAgIFwiaW5jbHVkZVwiOiBcImF3YWl0IFwiLFxuICAgIFwiaW1wb3J0XCI6IFwiYXdhaXQgXCIsXG4gICAgXCJ0cmFuc2ZlclwiOiBcInJldHVybiBhd2FpdCBcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4KHRleHQ6IFN0cmluZ1RyYWNrZXIsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTKHRleHQuZXEpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKHN1YnN0cmluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JT0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU6JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkV3JpdGVNYXBbaS5uYW1lXX0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59XG5cbi8qKlxuICogQ29udmVydFN5bnRheE1pbmkgdGFrZXMgdGhlIGNvZGUgYW5kIGEgc2VhcmNoIHN0cmluZyBhbmQgY29udmVydCBjdXJseSBicmFja2V0c1xuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSB0ZXh0IC0gVGhlIHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmluZCAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhZGRFSlMgLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgc3RhcnQgb2YgdGhlIGVqcy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheE1pbmkodGV4dDogU3RyaW5nVHJhY2tlciwgZmluZDogc3RyaW5nLCBhZGRFSlM6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlNNaW5pKHRleHQuZXEsIGZpbmQpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgIGlmICh2YWx1ZXNbaV0gIT0gdmFsdWVzW2kgKyAxXSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcodmFsdWVzW2ldLCB2YWx1ZXNbaSArIDFdKSk7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpICsgMl0sIHZhbHVlc1tpICsgM10pO1xuICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkRUpTfSR7c3Vic3RyaW5nfSU+YDtcbiAgICB9XG5cbiAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKCh2YWx1ZXMuYXQoLTEpPz8tMSkgKyAxKSk7XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgcG9vbCB9IGZyb20gXCIuLi9CYXNlUmVhZGVyL1JlYWRlclwiO1xuXG5hc3luYyBmdW5jdGlvbiBIVE1MQXR0clBhcnNlcih0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHtcbiAgICBzazogbnVtYmVyLFxuICAgIGVrOiBudW1iZXIsXG4gICAgc3Y6IG51bWJlcixcbiAgICBldjogbnVtYmVyLFxuICAgIHNwYWNlOiBib29sZWFuLFxuICAgIGNoYXI6IHN0cmluZ1xufVtdPiB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBwb29sLmV4ZWMoJ0hUTUxBdHRyUGFyc2VyJywgW3RleHRdKVxuICAgIHJldHVybiBKU09OLnBhcnNlKHBhcnNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFnRGF0YVBhcnNlciB7XG4gICAgdmFsdWVBcnJheToge1xuICAgICAgICBrZXk/OiBTdHJpbmdUcmFja2VyXG4gICAgICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyIHwgdHJ1ZSxcbiAgICAgICAgc3BhY2U6IGJvb2xlYW4sXG4gICAgICAgIGNoYXI/OiBzdHJpbmdcbiAgICB9W10gPSBbXVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB0ZXh0OiBTdHJpbmdUcmFja2VyKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBwYXJzZXIoKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSFRNTEF0dHJQYXJzZXIodGhpcy50ZXh0LmVxKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgY2hhciwgZWssIGV2LCBzaywgc3BhY2UsIHN2IH0gb2YgcGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVBcnJheS5wdXNoKHsgY2hhciwgc3BhY2UsIGtleTogdGhpcy50ZXh0LnN1YnN0cmluZyhzaywgZWspLCB2YWx1ZTogc3YgPT0gZXYgPyB0cnVlIDogdGhpcy50ZXh0LnN1YnN0cmluZyhzdiwgZXYpIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHBvcEl0ZW0oa2V5OiBzdHJpbmcpe1xuICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpO1xuICAgICAgICByZXR1cm4gaW5kZXggPT0gLTEgPyBudWxsOiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKGluZGV4LCAxKS5zaGlmdCgpO1xuICAgIH1cblxuICAgIHBvcFRyYWNrZXIoa2V5OiBzdHJpbmcpOiBTdHJpbmdUcmFja2VyIHwgbnVsbCB8IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3BJdGVtKGtleSk/LnZhbHVlXG4gICAgfVxuXG4gICAgcG9wSGF2ZURlZmF1bHRUcmFja2VyPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBTdHJpbmdUcmFja2VyIHwgbnVsbCB8IFQge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5wb3BUcmFja2VyKGtleSk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ2Jvb2xlYW4nID8gdmFsdWUgOiBkYXRhO1xuICAgIH1cblxuICAgIHBvcEFueVRyYWNrZXI8VCA9IHN0cmluZz4oa2V5OiBzdHJpbmcsIHZhbHVlOiBUID0gPGFueT4nJyk6IHN0cmluZyB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wVHJhY2tlcihrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIgPyBkYXRhLmVxOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BTdHJpbmcoa2V5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHwgYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wb3BJdGVtKGtleSk/LnZhbHVlXG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIgPyB2YWx1ZS5lcSA6IHZhbHVlO1xuICAgIH1cblxuICAgIHBvcEJvb2xlYW4oa2V5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IGJvb2xlYW4pIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5wb3BTdHJpbmcoa2V5KSA/PyBkZWZhdWx0VmFsdWUpXG4gICAgfVxuXG4gICAgZXhpc3RzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KSAhPSBudWxsXG4gICAgfVxuXG4gICAgcG9wSGF2ZURlZmF1bHQ8VCA9IHN0cmluZz4oa2V5OiBzdHJpbmcsIHZhbHVlOiBUID0gPGFueT4nJyk6IHN0cmluZyB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wU3RyaW5nKGtleSk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ2Jvb2xlYW4nID8gdmFsdWUgOiBkYXRhO1xuICAgIH1cblxuICAgIHBvcEFueURlZmF1bHQ8VCA9IHN0cmluZz4oa2V5OiBzdHJpbmcsIHZhbHVlOiBUID0gPGFueT4nJyk6IHN0cmluZyB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wU3RyaW5nKGtleSk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyBkYXRhOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBhZGRDbGFzcyhjbGFzc05hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09ICdjbGFzcycpO1xuICAgICAgICBpZiAoaGF2ZT8udmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKVxuICAgICAgICAgICAgaGF2ZS52YWx1ZS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcgJyArIGNsYXNzTmFtZSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIGVsc2UgaWYgKGhhdmU/LnZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBoYXZlLnZhbHVlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgY2xhc3NOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHVzaFZhbHVlKCdjbGFzcycsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWJ1aWxkU3BhY2UoKSB7XG4gICAgICAgIGNvbnN0IG5ld0F0dHJpYnV0ZXMgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgeyB2YWx1ZSwgY2hhciwga2V5LCBzcGFjZSB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgc3BhY2UgJiYgbmV3QXR0cmlidXRlcy5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcgJyk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMuUGx1cyhrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMkYCR7a2V5fT0ke2NoYXJ9JHt2YWx1ZX0ke2NoYXJ9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdBdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIHB1c2hWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSk7XG4gICAgICAgIGlmIChoYXZlKSByZXR1cm4gKGhhdmUudmFsdWUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB2YWx1ZSkpO1xuXG4gICAgICAgIHRoaXMudmFsdWVBcnJheS5wdXNoKHsga2V5OiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBrZXkpLCB2YWx1ZTogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpLCBjaGFyOiAnXCInLCBzcGFjZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBtYXAoKSB7XG4gICAgICAgIGNvbnN0IGF0dHJNYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgdHJ1ZSB9ID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGtleSwgdmFsdWUgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkpIGF0dHJNYXBba2V5LmVxXSA9IHZhbHVlID09PSB0cnVlID8gdHJ1ZSA6IHZhbHVlLmVxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF0dHJNYXA7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbmFsaXplQnVpbGQgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi9KU1BhcnNlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuXG5leHBvcnQgY2xhc3MgUGFnZVRlbXBsYXRlIGV4dGVuZHMgSlNQYXJzZXIge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgQWRkUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYHRyeSB7XFxuYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGBcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSAoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3IpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoc2Vzc2lvbkluZm8uZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoc2Vzc2lvbkluZm8uZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5jbHVkZSA9IChwLCB3aXRoT2JqZWN0KSA9PiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHAsIHdpdGhPYmplY3QpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlID0geyBleHBvcnRzOiB7fSB9LFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgICAgICAgICAgICAgIHsgc2VuZEZpbGUsIHdyaXRlU2FmZSwgd3JpdGUsIGVjaG8sIHNldFJlc3BvbnNlLCBvdXRfcnVuX3NjcmlwdCwgcnVuX3NjcmlwdF9uYW1lLCBSZXNwb25zZSwgUmVxdWVzdCwgUG9zdCwgUXVlcnksIFNlc3Npb24sIEZpbGVzLCBDb29raWVzLCBQYWdlVmFyLCBHbG9iYWxWYXJ9ID0gcGFnZSxcblxuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X2NvZGUgPSBydW5fc2NyaXB0X25hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmZXIgPSAocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0KSA9PiAob3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9LCBfdHJhbnNmZXIocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0LCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UpKTtcbiAgICAgICAgICAgICAgICB7YCk7XG5cblxuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG59XG4gICAgICAgICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RfZmlsZSA9IHJ1bl9zY3JpcHRfbmFtZS5zcGxpdCgvLT58PGxpbmU+LykucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSArPSAnIC0+IDxsaW5lPicgKyBlLnN0YWNrLnNwbGl0KC9cXFxcbiggKSphdCAvKVsyXTtcbiAgICAgICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSAnJHtQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihgPHA+RXJyb3IgcGF0aDogJyArIHJ1bl9zY3JpcHRfbmFtZS5yZXBsYWNlKC88KGxpbmV8Y29sb3IpPi9naSwgJzxici8+JykgKyAnPC9wPjxwPkVycm9yIG1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UgKyAnPC9wPmApfSc7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGF0aDogXCIgKyBydW5fc2NyaXB0X25hbWUuc2xpY2UoMCwgLWxhc3RfZmlsZS5sZW5ndGgpLnJlcGxhY2UoLzxsaW5lPi9naSwgJ1xcXFxuJykpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoKX1cIiArIGxhc3RfZmlsZS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbWVzc2FnZTogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcnVubmluZyB0aGlzIGNvZGU6IFxcXFxcIlwiICsgcnVuX3NjcmlwdF9jb2RlICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzdGFjazogXCIgKyBlLnN0YWNrKTtcbiAgICAgICAgICAgICAgICB9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYH19KTt9YCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIGNvbnN0IGJ1aWx0Q29kZSA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5SdW5BbmRFeHBvcnQodGV4dCwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgICAgICByZXR1cm4gUGFnZVRlbXBsYXRlLkFkZFBhZ2VUZW1wbGF0ZShidWlsdENvZGUsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgQWRkQWZ0ZXJCdWlsZCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKFwicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgSW5QYWdlVGVtcGxhdGUodGV4dDogU3RyaW5nVHJhY2tlciwgZGF0YU9iamVjdDogYW55LCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYDwlIXtcbiAgICAgICAgICAgIGNvbnN0IF9wYWdlID0gcGFnZTtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB7Li4uX3BhZ2Uke2RhdGFPYmplY3QgPyAnLCcgKyBkYXRhT2JqZWN0IDogJyd9fTtcbiAgICAgICAgICAgIGNvbnN0IF9fZmlsZW5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhmdWxsUGF0aCl9XCIsIF9fZGlybmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHBhdGguZGlybmFtZShmdWxsUGF0aCkpfVwiO1xuICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgY29uc3QgaW5jbHVkZSA9IChwLCB3aXRoT2JqZWN0KSA9PiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHAsIHdpdGhPYmplY3QpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmZXIgPSAocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0KSA9PiAob3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9LCBfdHJhbnNmZXIocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0LCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UpKTtcbiAgICAgICAgICAgICAgICB7JT5gKTtcblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soJzwlIX19fSU+Jyk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufVxuIiwgImltcG9ydCBSYXpvclN5bnRheCBmcm9tICcuL1Jhem9yU3ludGF4J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHZXRTeW50YXgoQ29tcGlsZVR5cGU6IGFueSkge1xuICAgIGxldCBmdW5jOiBhbnk7XG4gICAgc3dpdGNoIChDb21waWxlVHlwZS5uYW1lIHx8IENvbXBpbGVUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJSYXpvclwiOlxuICAgICAgICAgICAgZnVuYyA9IFJhem9yU3ludGF4O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xufSIsICJpbXBvcnQgQWRkU3ludGF4IGZyb20gJy4vU3ludGF4L0luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRQbHVnaW4ge1xuXHRwdWJsaWMgU2V0dGluZ3NPYmplY3Q6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKFNldHRpbmdzT2JqZWN0OiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgICAgICB0aGlzLlNldHRpbmdzT2JqZWN0ID0gU2V0dGluZ3NPYmplY3RcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBkZWZhdWx0U3ludGF4KCl7XG4gICAgICAgIHJldHVybiB0aGlzLlNldHRpbmdzT2JqZWN0LkJhc2ljQ29tcGlsYXRpb25TeW50YXguY29uY2F0KHRoaXMuU2V0dGluZ3NPYmplY3QuQWRkQ29tcGlsZVN5bnRheCk7XG4gICAgfVxuXG4gICAgYXN5bmMgQnVpbGRCYXNpYyh0ZXh0OiBTdHJpbmdUcmFja2VyLCBPRGF0YTpzdHJpbmcgfGFueSwgcGF0aDpzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICAvL2FkZCBTeW50YXhcblxuICAgICAgICBpZiAoIU9EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShPRGF0YSkpIHtcbiAgICAgICAgICAgIE9EYXRhID0gW09EYXRhXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBPRGF0YSkge1xuICAgICAgICAgICAgY29uc3QgU3ludGF4ID0gYXdhaXQgQWRkU3ludGF4KGkpO1xuXG4gICAgICAgICAgICBpZiAoU3ludGF4KSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGF3YWl0IFN5bnRheCh0ZXh0LCBpLCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBwYWdlc1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIHRleHQgPSBhd2FpdCB0aGlzLkJ1aWxkQmFzaWModGV4dCwgdGhpcy5kZWZhdWx0U3ludGF4LCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIGNvbXBvbmVudHNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkQ29tcG9uZW50KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIHRleHQgPSBhd2FpdCB0aGlzLkJ1aWxkQmFzaWModGV4dCwgdGhpcy5kZWZhdWx0U3ludGF4LCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59IiwgIi8vZ2xvYmFsIHNldHRpbmdzIGZvciBidWlsZCBpbiBjb21wb25lbnRzXG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHtcbiAgICBwbHVnaW5zOiBbXVxufTsiLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4vSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4vU2NyaXB0VGVtcGxhdGUnO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoLCBQYXJzZURlYnVnTGluZSwgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0ICogYXMgZXh0cmljYXRlIGZyb20gJy4vWE1MSGVscGVycy9FeHRyaWNhdGUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEJ1aWxkU2NyaXB0IGZyb20gJy4vdHJhbnNmb3JtL1NjcmlwdCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBCdWlsZFNjcmlwdFNldHRpbmdzIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7IEFkZENvbXBpbGVTeW50YXg6IFtdLCBwbHVnaW5zOiBbXSwgQmFzaWNDb21waWxhdGlvblN5bnRheDogWydSYXpvciddIH07XG5jb25zdCBQbHVnaW5CdWlsZCA9IG5ldyBBZGRQbHVnaW4oU2V0dGluZ3MpO1xuZXhwb3J0IGNvbnN0IENvbXBvbmVudHMgPSBuZXcgSW5zZXJ0Q29tcG9uZW50KFBsdWdpbkJ1aWxkKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldFBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MucGx1Z2lucy5maW5kKGIgPT4gYiA9PSBuYW1lIHx8ICg8YW55PmIpPy5uYW1lID09IG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU29tZVBsdWdpbnMoLi4uZGF0YTogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gZGF0YS5zb21lKHggPT4gR2V0UGx1Z2luKHgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHMoKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLkFkZENvbXBpbGVTeW50YXguaW5jbHVkZXMoJ1R5cGVTY3JpcHQnKTtcbn1cblxuQ29tcG9uZW50cy5NaWNyb1BsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuQ29tcG9uZW50cy5HZXRQbHVnaW4gPSBHZXRQbHVnaW47XG5Db21wb25lbnRzLlNvbWVQbHVnaW5zID0gU29tZVBsdWdpbnM7XG5Db21wb25lbnRzLmlzVHMgPSBpc1RzO1xuXG5CdWlsZFNjcmlwdFNldHRpbmdzLnBsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuXG5hc3luYyBmdW5jdGlvbiBvdXRQYWdlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHNjcmlwdEZpbGU6IFN0cmluZ1RyYWNrZXIsIHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZHluYW1pY0NoZWNrPzogYm9vbGVhbik6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuXG4gICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShzZXNzaW9uSW5mbywgZGF0YSwgaXNUcygpKTtcbiAgICBpZighYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBwYWdlTmFtZSwge2R5bmFtaWNDaGVja30pKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsTmFtZSA9IGJhc2VEYXRhLmRlZmF1bHRWYWx1ZVBvcEFueSgnbW9kZWwnLCAnd2Vic2l0ZScpO1xuXG4gICAgaWYgKCFtb2RlbE5hbWUpIHJldHVybiBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSwgYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICBkYXRhID0gYmFzZURhdGEuY2xlYXJEYXRhO1xuXG4gICAgLy9pbXBvcnQgbW9kZWxcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBtb2RlbE5hbWUsICdNb2RlbHMnLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5tb2RlbCk7IC8vIGZpbmQgbG9jYXRpb24gb2YgdGhlIGZpbGVcblxuICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVsbFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yTWVzc2FnZSA9IGBFcnJvciBtb2RlbCBub3QgZm91bmQgLT4gJHttb2RlbE5hbWV9IGF0IHBhZ2UgJHtwYWdlTmFtZX1gO1xuXG4gICAgICAgIHByaW50LmVycm9yKEVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihkYXRhLkRlZmF1bHRJbmZvVGV4dCwgUGFnZVRlbXBsYXRlLnByaW50RXJyb3IoRXJyb3JNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsIEZ1bGxQYXRoKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgRnVsbFBhdGgsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICBsZXQgbW9kZWxEYXRhID0gYXdhaXQgUGFyc2VCYXNlUGFnZS5yZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGJhc2VNb2RlbERhdGEuYWxsRGF0YSk7XG5cbiAgICBzZXNzaW9uSW5mby5kZWJ1ZyAmJiBtb2RlbERhdGEuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgIHBhZ2VOYW1lICs9IFwiIC0+IFwiICsgU21hbGxQYXRoO1xuXG4gICAgLy9HZXQgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgYWxsRGF0YSA9IGV4dHJpY2F0ZS5nZXREYXRhVGFncyhtb2RlbERhdGEsIFsnJ10sICc6JywgZmFsc2UsIHRydWUpO1xuXG4gICAgaWYgKGFsbERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciB3aXRoaW4gbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1vZGVsRGF0YSA9IGFsbERhdGEuZGF0YTtcbiAgICBjb25zdCB0YWdBcnJheSA9IGFsbERhdGEuZm91bmQubWFwKHggPT4geC50YWcuc3Vic3RyaW5nKDEpKTtcbiAgICBjb25zdCBvdXREYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdzKGRhdGEsIHRhZ0FycmF5LCAnQCcpO1xuXG4gICAgaWYgKG91dERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBXaXRoIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvL0J1aWxkIFdpdGggcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbW9kZWxCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgYWxsRGF0YS5mb3VuZCkge1xuICAgICAgICBpLnRhZyA9IGkudGFnLnN1YnN0cmluZygxKTsgLy8gcmVtb3ZpbmcgdGhlICc6J1xuICAgICAgICBjb25zdCBob2xkZXJEYXRhID0gb3V0RGF0YS5mb3VuZC5maW5kKChlKSA9PiBlLnRhZyA9PSAnQCcgKyBpLnRhZyk7XG5cbiAgICAgICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YS5zdWJzdHJpbmcoMCwgaS5sb2MpKTtcbiAgICAgICAgbW9kZWxEYXRhID0gbW9kZWxEYXRhLnN1YnN0cmluZyhpLmxvYyk7XG5cbiAgICAgICAgaWYgKGhvbGRlckRhdGEpIHtcbiAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhob2xkZXJEYXRhLmRhdGEpO1xuICAgICAgICB9IGVsc2UgeyAvLyBUcnkgbG9hZGluZyBkYXRhIGZyb20gcGFnZSBiYXNlXG4gICAgICAgICAgICBjb25zdCBsb2FkRnJvbUJhc2UgPSBiYXNlRGF0YS5nZXQoaS50YWcpO1xuXG4gICAgICAgICAgICBpZiAobG9hZEZyb21CYXNlICYmIGxvYWRGcm9tQmFzZSAhPT0gdHJ1ZSAmJiBsb2FkRnJvbUJhc2UuZXEudG9Mb3dlckNhc2UoKSAhPSAnaW5oZXJpdCcpXG4gICAgICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGxvYWRGcm9tQmFzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhKTtcblxuICAgIHJldHVybiBhd2FpdCBvdXRQYWdlKG1vZGVsQnVpbGQsIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlKSwgRnVsbFBhdGgsIHBhZ2VOYW1lLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEluc2VydChkYXRhOiBzdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBuZXN0ZWRQYWdlOiBib29sZWFuLCBuZXN0ZWRQYWdlRGF0YTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKSB7XG4gICAgbGV0IERlYnVnU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBkYXRhKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IG91dFBhZ2UoRGVidWdTdHJpbmcsIG5ldyBTdHJpbmdUcmFja2VyKERlYnVnU3RyaW5nLkRlZmF1bHRJbmZvVGV4dCksIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8sIGR5bmFtaWNDaGVjayk7XG5cbiAgICBpZihEZWJ1Z1N0cmluZyA9PSBudWxsKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGx1Z2luQnVpbGQuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBDb21wb25lbnRzLkluc2VydChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7IC8vIGFkZCBjb21wb25lbnRzXG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhcnNlRGVidWdMaW5lKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xuXG4gICAgaWYgKG5lc3RlZFBhZ2UpIHsgLy8gcmV0dXJuIFN0cmluZ1RyYWNrZXIsIGJlY2F1c2UgdGhpcyBpbXBvcnQgd2FzIGZyb20gcGFnZVxuICAgICAgICByZXR1cm4gUGFnZVRlbXBsYXRlLkluUGFnZVRlbXBsYXRlKERlYnVnU3RyaW5nLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgpO1xuICAgIH1cblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgZmluYWxpemVCdWlsZChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8sIGZ1bGxQYXRoQ29tcGlsZSk7XG4gICAgXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYWdlVGVtcGxhdGUuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mbyk7XG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5CdWlsZFNjcmlwdFdpdGhQcmFtcyhEZWJ1Z1N0cmluZyk7XG4gICAgRGVidWdTdHJpbmc9IFBhZ2VUZW1wbGF0ZS5BZGRBZnRlckJ1aWxkKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5kZWJ1Zyk7XG5cbiAgICByZXR1cm4gRGVidWdTdHJpbmc7XG59IiwgImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQnVpbGRKUywgQnVpbGRKU1gsIEJ1aWxkVFMsIEJ1aWxkVFNYIH0gZnJvbSAnLi9Gb3JTdGF0aWMvU2NyaXB0JztcbmltcG9ydCBCdWlsZFN2ZWx0ZSBmcm9tICcuL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50JztcbmltcG9ydCB7IEJ1aWxkU3R5bGVTYXNzIH0gZnJvbSAnLi9Gb3JTdGF0aWMvU3R5bGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIFN5c3RlbURhdGEsIGdldERpcm5hbWUsIEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBSZXNwb25zZSwgUmVxdWVzdCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcHJvbXB0bHkgZnJvbSAncHJvbXB0bHknO1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuXG5jb25zdCBTdXBwb3J0ZWRUeXBlcyA9IFsnanMnLCAnc3ZlbHRlJywgJ3RzJywgJ2pzeCcsICd0c3gnLCAnY3NzJywgJ3Nhc3MnLCAnc2NzcyddO1xuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTdGF0aWNGaWxlcycpO1xuXG5hc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbyA9IFN0YXRpY0ZpbGVzSW5mby5zdG9yZVtwYXRoXTtcblxuICAgIGZvciAoY29uc3QgaSBpbiBvKSB7XG4gICAgICAgIGxldCBwID0gaTtcblxuICAgICAgICBpZiAoaSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBwID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgcGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBwO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gb1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gIW87XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBmdWxsQ29tcGlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBkZXBlbmRlbmNpZXM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG4gICAgc3dpdGNoIChleHQpIHtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRKUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRKU1goU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUU1goU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjc3MnOlxuICAgICAgICBjYXNlICdzYXNzJzpcbiAgICAgICAgY2FzZSAnc2Nzcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN0eWxlU2FzcyhTbWFsbFBhdGgsIGV4dCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3ZlbHRlJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3ZlbHRlKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBmdWxsQ29tcGlsZVBhdGggKz0gJy5qcyc7XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbENvbXBpbGVQYXRoKSkge1xuICAgICAgICBTdGF0aWNGaWxlc0luZm8udXBkYXRlKFNtYWxsUGF0aCwgZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFpc0RlYnVnKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbn1cblxuaW50ZXJmYWNlIGJ1aWxkSW4ge1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgZXh0Pzogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBpblNlcnZlcj86IHN0cmluZztcbn1cblxuY29uc3Qgc3RhdGljRmlsZXMgPSBTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvY2xpZW50Lyc7XG5jb25zdCBnZXRTdGF0aWM6IGJ1aWxkSW5bXSA9IFt7XG4gICAgcGF0aDogXCJzZXJ2L3RlbXAuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJidWlsZFRlbXBsYXRlLmpzXCJcbn0sXG57XG4gICAgcGF0aDogXCJzZXJ2L2Nvbm5lY3QuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJtYWtlQ29ubmVjdGlvbi5qc1wiXG59LFxue1xuICAgIHBhdGg6IFwic2Vydi9tZC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1hcmtkb3duQ29weS5qc1wiXG59XTtcblxuY29uc3QgZ2V0U3RhdGljRmlsZXNUeXBlOiBidWlsZEluW10gPSBbe1xuICAgIGV4dDogJy5wdWIuanMnLFxuICAgIHR5cGU6ICdqcydcbn0sXG57XG4gICAgZXh0OiAnLnB1Yi5tanMnLFxuICAgIHR5cGU6ICdqcydcbn0sXG57XG4gICAgZXh0OiAnLnB1Yi5jc3MnLFxuICAgIHR5cGU6ICdjc3MnXG59XTtcblxuYXN5bmMgZnVuY3Rpb24gc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdDogUmVxdWVzdCwgZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGZvdW5kID0gZ2V0U3RhdGljRmlsZXNUeXBlLmZpbmQoeCA9PiBmaWxlUGF0aC5lbmRzV2l0aCh4LmV4dCkpO1xuXG4gICAgaWYgKCFmb3VuZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBjb25zdCBiYXNlUGF0aCA9IFJlcXVlc3QucXVlcnkudCA9PSAnbCcgPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdO1xuICAgIGNvbnN0IGluU2VydmVyID0gcGF0aC5qb2luKGJhc2VQYXRoLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShpblNlcnZlcikpXG4gICAgICAgIHJldHVybiB7IC4uLmZvdW5kLCBpblNlcnZlciB9O1xufVxuXG5sZXQgZGVidWdnaW5nV2l0aFNvdXJjZTogbnVsbCB8IGJvb2xlYW4gPSBudWxsO1xuXG5pZiAoYXJndi5pbmNsdWRlcygnYWxsb3dTb3VyY2VEZWJ1ZycpKVxuICAgIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPSB0cnVlO1xuYXN5bmMgZnVuY3Rpb24gYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpIHtcbiAgICBpZiAodHlwZW9mIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPT0gJ2Jvb2xlYW4nKVxuICAgICAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcblxuICAgIHRyeSB7XG4gICAgICAgIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPSAoYXdhaXQgcHJvbXB0bHkucHJvbXB0KFxuICAgICAgICAgICAgJ0FsbG93IGRlYnVnZ2luZyBKYXZhU2NyaXB0L0NTUyBpbiBzb3VyY2UgcGFnZT8gLSBleHBvc2luZyB5b3VyIHNvdXJjZSBjb2RlIChubyknLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvcih2OiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFsneWVzJywgJ25vJ10uaW5jbHVkZXModi50cmltKCkudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd5ZXMgb3Igbm8nKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAgKiAzMFxuICAgICAgICAgICAgfVxuICAgICAgICApKS50cmltKCkudG9Mb3dlckNhc2UoKSA9PSAneWVzJztcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgfSBjYXRjaCB7IH1cblxuXG4gICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG59XG5cbmNvbnN0IHNhZmVGb2xkZXJzID0gW2dldFR5cGVzLlN0YXRpY1syXSwgZ2V0VHlwZXMuTG9nc1syXSwgJ01vZGVscycsICdDb21wb25lbnRzJ107XG4vKipcbiAqIElmIHRoZSB1c2VyIGlzIGluIGRlYnVnIG1vZGUsIGFuZCB0aGUgZmlsZSBpcyBhIHNvdXJjZSBmaWxlLCBhbmQgdGhlIHVzZXIgY29tbWVuZCBsaW5lIGFyZ3VtZW50IGhhdmUgYWxsb3dTb3VyY2VEZWJ1Z1xuICogdGhlbiByZXR1cm4gdGhlIGZ1bGwgcGF0aCB0byB0aGUgZmlsZVxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gaXMgdGhlIGN1cnJlbnQgcGFnZSBhIGRlYnVnIHBhZ2U/XG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0aGF0IHdhcyBjbGlja2VkLlxuICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIC0gSWYgdGhpcyBwYXRoIGFscmVhZHkgYmVlbiBjaGVja2VkXG4gKiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSB0eXBlIG9mIHRoZSBmaWxlIGFuZCB0aGUgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5zYWZlRGVidWcoaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghaXNEZWJ1ZyB8fCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikgfHwgcGF0aC5leHRuYW1lKGZpbGVQYXRoKSAhPSAnLnNvdXJjZScgfHwgIXNhZmVGb2xkZXJzLmluY2x1ZGVzKGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnNoaWZ0KCkpIHx8ICFhd2FpdCBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNykpOyAvLyByZW1vdmluZyAnLnNvdXJjZSdcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdodG1sJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdHlsZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYmFzZUZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDQpOyAvLyByZW1vdmluZyAnLmNzcydcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGZpbGVQYXRoO1xuXG4gICAgbGV0IGV4aXN0czogYm9vbGVhbjtcbiAgICBpZiAocGF0aC5leHRuYW1lKGJhc2VGaWxlUGF0aCkgPT0gJy5zdmVsdGUnICYmIChjaGVja2VkIHx8IChleGlzdHMgPSBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmICFleGlzdHMpIHtcbiAgICAgICAgYXdhaXQgQnVpbGRGaWxlKGJhc2VGaWxlUGF0aCwgaXNEZWJ1ZywgZ2V0VHlwZXMuU3RhdGljWzFdICsgYmFzZUZpbGVQYXRoKVxuICAgICAgICByZXR1cm4gc3ZlbHRlU3R5bGUoZmlsZVBhdGgsIGNoZWNrZWQsIGZhbHNlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0YXRpYyhmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L3N2ZWx0ZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcycgKyBmaWxlUGF0aC5zdWJzdHJpbmcoNCkgKyAocGF0aC5leHRuYW1lKGZpbGVQYXRoKSA/ICcnIDogJy9pbmRleC5tanMnKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdqcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrZG93bkNvZGVUaGVtZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L21kL2NvZGUtdGhlbWUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3N0eWxlcycgKyBmaWxlUGF0aC5zdWJzdHJpbmcoMTgpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrZG93blRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvdGhlbWUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGxldCBmaWxlTmFtZSA9IGZpbGVQYXRoLnN1YnN0cmluZygxNCk7XG4gICAgaWYgKGZpbGVOYW1lLnN0YXJ0c1dpdGgoJ2F1dG8nKSlcbiAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoNClcbiAgICBlbHNlXG4gICAgICAgIGZpbGVOYW1lID0gJy0nICsgZmlsZU5hbWU7XG5cblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nICsgZmlsZU5hbWUucmVwbGFjZSgnLmNzcycsICcubWluLmNzcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZChSZXF1ZXN0OiBSZXF1ZXN0LCBpc0RlYnVnOiBib29sZWFuLCBwYXRoOiBzdHJpbmcsIGNoZWNrZWQgPSBmYWxzZSk6IFByb21pc2U8bnVsbCB8IGJ1aWxkSW4+IHtcbiAgICByZXR1cm4gYXdhaXQgc3ZlbHRlU3RhdGljKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IHN2ZWx0ZVN0eWxlKHBhdGgsIGNoZWNrZWQsIGlzRGVidWcpIHx8XG4gICAgICAgIGF3YWl0IHVuc2FmZURlYnVnKGlzRGVidWcsIHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IHNlcnZlckJ1aWxkQnlUeXBlKFJlcXVlc3QsIHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IG1hcmtkb3duVGhlbWUocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25Db2RlVGhlbWUocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgZ2V0U3RhdGljLmZpbmQoeCA9PiB4LnBhdGggPT0gcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWJ1aWxkRmlsZShTbWFsbFBhdGg6IHN0cmluZywgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKFNtYWxsUGF0aCkgJiYgYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIFJlcXVlc3Q6IFJlcXVlc3QsIFJlc3BvbnNlOiBSZXNwb25zZSkge1xuICAgIC8vZmlsZSBidWlsdCBpblxuICAgIGNvbnN0IGlzQnVpbGRJbiA9IGF3YWl0IHNlcnZlckJ1aWxkKFJlcXVlc3QsIGlzRGVidWcsIFNtYWxsUGF0aCwgdHJ1ZSk7XG5cbiAgICBpZiAoaXNCdWlsZEluKSB7XG4gICAgICAgIFJlc3BvbnNlLnR5cGUoaXNCdWlsZEluLnR5cGUpO1xuICAgICAgICBSZXNwb25zZS5lbmQoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGlzQnVpbGRJbi5pblNlcnZlcikpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvL2NvbXBpbGVkIGZpbGVzXG4gICAgY29uc3QgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgU21hbGxQYXRoO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgU21hbGxQYXRoO1xuXG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKFNtYWxsUGF0aCkuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAoIVN1cHBvcnRlZFR5cGVzLmluY2x1ZGVzKGV4dCkpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFsnc2FzcycsICdzY3NzJywgJ2NzcyddLmluY2x1ZGVzKGV4dCkpIHsgLy8gYWRkaW5nIHR5cGVcbiAgICAgICAgUmVzcG9uc2UudHlwZSgnY3NzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZSgnanMnKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzUGF0aCA9IGZ1bGxDb21waWxlUGF0aDtcblxuICAgIC8vIHJlLWNvbXBpbGluZyBpZiBuZWNlc3Nhcnkgb24gZGVidWcgbW9kZVxuICAgIGlmIChpc0RlYnVnICYmIChSZXF1ZXN0LnF1ZXJ5LnNvdXJjZSA9PSAndHJ1ZScgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKFNtYWxsUGF0aCkgJiYgIWF3YWl0IEJ1aWxkRmlsZShTbWFsbFBhdGgsIGlzRGVidWcsIGZ1bGxDb21waWxlUGF0aCkpKSB7XG4gICAgICAgIHJlc1BhdGggPSBmdWxsUGF0aDtcbiAgICB9IGVsc2UgaWYgKGV4dCA9PSAnc3ZlbHRlJylcbiAgICAgICAgcmVzUGF0aCArPSAnLmpzJztcblxuICAgIFJlc3BvbnNlLmVuZChhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShyZXNQYXRoLCAndXRmOCcpKTsgLy8gc2VuZGluZyB0aGUgZmlsZVxufSIsICJpbXBvcnQgeyBTb21lUGx1Z2lucywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtLCBQYXJzZXJDb25maWcgfSBmcm9tICdAc3djL2NvcmUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlJztcbmltcG9ydCB7IGVzVGFyZ2V0LCBUcmFuc2Zvcm1KU0MgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3NldHRpbmdzJztcblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5wdXRQYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgcGFyc2VyPzogUGFyc2VyQ29uZmlnLCBvcHRpb25zTmFtZT86IHN0cmluZykge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG4gICAgY29uc3QgQWRkT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZ1bGxQYXRoLFxuICAgICAgICBzb3VyY2VGaWxlTmFtZTogaW5wdXRQYXRoICsgJz9zb3VyY2U9dHJ1ZScsXG4gICAgICAgIGpzYzogVHJhbnNmb3JtSlNDKHtcbiAgICAgICAgICAgIHBhcnNlcjoge1xuICAgICAgICAgICAgICAgIC4uLnBhcnNlcixcbiAgICAgICAgICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpLFxuICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihvcHRpb25zTmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIHNvdXJjZU1hcHM6IGlzRGVidWcgPyAnaW5saW5lJyA6IGZhbHNlXG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gKGF3YWl0IHRyYW5zZm9ybShyZXN1bHQsIEFkZE9wdGlvbnMpKS5jb2RlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvcihlcnIpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanMnLCBpc0RlYnVnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkVFMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAndHMnLCBpc0RlYnVnLCB7IHN5bnRheDogJ3R5cGVzY3JpcHQnLCBkZWNvcmF0b3JzOiB0cnVlIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanN4JywgaXNEZWJ1ZywgeyBzeW50YXg6ICdlY21hc2NyaXB0JywganN4OiB0cnVlIH0sICdKU1hPcHRpb25zJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0c3gnLCBpc0RlYnVnLCB7IHN5bnRheDogJ3R5cGVzY3JpcHQnLCB0c3g6IHRydWUsIGRlY29yYXRvcnM6IHRydWUsIH0sICdUU1hPcHRpb25zJyk7XG59XG4iLCAiaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tIFwiQHN3Yy9jb3JlXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQsIE1lcmdlU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0xvZ2dlclwiO1xuaW1wb3J0IHsgUHJpbnRTdmVsdGVFcnJvciwgUHJpbnRTdmVsdGVXYXJuIH0gZnJvbSBcIi4vZXJyb3JcIjtcbmltcG9ydCB7IGVzVGFyZ2V0LCBUcmFuc2Zvcm1KU0MgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5nc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWNQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY1BhdGg7XG5cbiAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llcywgbWFwLCBzY3JpcHRMYW5nIH0gPSBhd2FpdCBwcmVwcm9jZXNzKGZ1bGxQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBpblN0YXRpY1BhdGgpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnVsbFBhdGguc3BsaXQoL1xcL3xcXC8vKS5wb3AoKTtcbiAgICBsZXQganM6IGFueSwgY3NzOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwge1xuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXY6IGlzRGVidWcsXG4gICAgICAgICAgICBzb3VyY2VtYXA6IG1hcCxcbiAgICAgICAgICAgIGNzczogZmFsc2UsXG4gICAgICAgICAgICBoeWRyYXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3ZlbHRlUGF0aDogJy9zZXJ2L3N2ZWx0ZSdcbiAgICAgICAgfSk7XG4gICAgICAgIFByaW50U3ZlbHRlV2FybihvdXRwdXQud2FybmluZ3MsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICBqcyA9IG91dHB1dC5qcztcbiAgICAgICAgY3NzID0gb3V0cHV0LmNzcztcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBQcmludFN2ZWx0ZUVycm9yKGVyciwgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aGlzRmlsZTogMFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgY29uc3Qgc291cmNlRmlsZUNsaWVudCA9IGpzLm1hcC5zb3VyY2VzWzBdLnN1YnN0cmluZygxKTtcblxuICAgIGlmKGlzRGVidWcpe1xuICAgICAgICBqcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgfVxuXG4gICAgaWYgKFNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oanMuY29kZSwge1xuICAgICAgICAgICAgICAgIGpzYzogVHJhbnNmb3JtSlNDKHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyOntcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bnRheDogc2NyaXB0TGFuZyA9PSAnanMnID8gJ2VjbWFzY3JpcHQnOiAndHlwZXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5HZXRQbHVnaW4oc2NyaXB0TGFuZy50b1VwcGVyQ2FzZSgpICtcIk9wdGlvbnNcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzb3VyY2VNYXBzOiBpc0RlYnVnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAganMuY29kZSA9IGNvZGU7XG4gICAgICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICAgICAganMubWFwID0gYXdhaXQgTWVyZ2VTb3VyY2VNYXAoSlNPTi5wYXJzZShtYXApLCBqcy5tYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGF3YWl0IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwKGVyciwganMubWFwLCBmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICBqcy5jb2RlICs9IHRvVVJMQ29tbWVudChqcy5tYXApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgICAgICAgICAgY3NzLmNvZGUgKz0gdG9VUkxDb21tZW50KGNzcy5tYXAsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpblN0YXRpY1BhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmpzJywganMuY29kZSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlcGVuZGVuY2llcyxcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn0iLCAiaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyAgY3JlYXRlSW1wb3J0ZXIsIFByaW50U2Fzc0Vycm9yLCBzYXNzQW5kU291cmNlLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTdHlsZVNhc3MoaW5wdXRQYXRoOiBzdHJpbmcsIHR5cGU6IFwic2Fzc1wiIHwgXCJzY3NzXCIgfCBcImNzc1wiLCBpc0RlYnVnOiBib29sZWFuKTogUHJvbWlzZTx7IFtrZXk6IHN0cmluZ106IG51bWJlciB9PiB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpbnB1dFBhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGlucHV0UGF0aDtcblxuICAgIGNvbnN0IGRlcGVuZGVuY2VPYmplY3QgPSB7XG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGVEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSwgZmlsZURhdGFEaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNhc3MuY29tcGlsZVN0cmluZ0FzeW5jKGZpbGVEYXRhLCB7XG4gICAgICAgICAgICBzb3VyY2VNYXA6IGlzRGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgodHlwZSksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKHR5cGUpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnQsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoPGFueT5maWxlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNlT2JqZWN0W0Jhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpXSA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuY3NzO1xuXG4gICAgICAgIGlmIChpc0RlYnVnICYmIHJlc3VsdC5zb3VyY2VNYXApIHtcbiAgICAgICAgICAgIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgcGF0aFRvRmlsZVVSTChmaWxlRGF0YSkuaHJlZik7XG4gICAgICAgICAgICByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMgPSByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMubWFwKHggPT4gcGF0aC5yZWxhdGl2ZShmaWxlRGF0YURpcm5hbWUsIGZpbGVVUkxUb1BhdGgoeCkpICsgJz9zb3VyY2U9dHJ1ZScpO1xuXG4gICAgICAgICAgICBkYXRhICs9IGBcXHJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXN1bHQuc291cmNlTWFwKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9Ki9gO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIFByaW50U2Fzc0Vycm9yKGVycik7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwZW5kZW5jZU9iamVjdFxufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEaXJlbnQgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBJbnNlcnQsIENvbXBvbmVudHMsIEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBDbGVhcldhcm5pbmcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Mb2dnZXInXG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBEZWxldGVJbkRpcmVjdG9yeSwgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFJlcVNjcmlwdCBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IFN0YXRpY0ZpbGVzIGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tICcuL0NvbXBpbGVTdGF0ZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVTaXRlTWFwIH0gZnJvbSAnLi9TaXRlTWFwJztcbmltcG9ydCB7IGV4dGVuc2lvbklzLCBpc0ZpbGVUeXBlLCBSZW1vdmVFbmRUeXBlIH0gZnJvbSAnLi9GaWxlVHlwZXMnO1xuaW1wb3J0IHsgcGVyQ29tcGlsZSwgcG9zdENvbXBpbGUsIHBlckNvbXBpbGVQYWdlLCBwb3N0Q29tcGlsZVBhZ2UgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIHsgaXNEZWJ1ZywgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2sgfTogeyBpc0RlYnVnPzogYm9vbGVhbiwgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IEZ1bGxGaWxlUGF0aCA9IHBhdGguam9pbihhcnJheVR5cGVbMF0sIGZpbGVQYXRoKSwgRnVsbFBhdGhDb21waWxlID0gYXJyYXlUeXBlWzFdICsgZmlsZVBhdGggKyAnLmNqcyc7XG5cbiAgICBjb25zdCBodG1sID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICBjb25zdCBFeGNsdVVybCA9IChuZXN0ZWRQYWdlID8gbmVzdGVkUGFnZSArICc8bGluZT4nIDogJycpICsgYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGg7XG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IGhhc1Nlc3Npb25JbmZvID8/IG5ldyBTZXNzaW9uQnVpbGQoYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGgsIEZ1bGxGaWxlUGF0aCwgYXJyYXlUeXBlWzJdLCBpc0RlYnVnLCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikpO1xuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoJ3RoaXNQYWdlJywgRnVsbEZpbGVQYXRoKTtcblxuICAgIGF3YWl0IHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuICAgIGNvbnN0IENvbXBpbGVkRGF0YSA9IChhd2FpdCBJbnNlcnQoaHRtbCwgRnVsbFBhdGhDb21waWxlLCBCb29sZWFuKG5lc3RlZFBhZ2UpLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGR5bmFtaWNDaGVjaykpID8/IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgYXdhaXQgcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgaWYgKCFuZXN0ZWRQYWdlICYmIENvbXBpbGVkRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShGdWxsUGF0aENvbXBpbGUsIENvbXBpbGVkRGF0YS5TdHJpbmdXaXRoVGFjayhGdWxsUGF0aENvbXBpbGUpKTtcbiAgICAgICAgcGFnZURlcHMudXBkYXRlKEV4Y2x1VXJsLCBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIHJldHVybiB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm8gfTtcbn1cblxuZnVuY3Rpb24gUmVxdWlyZVNjcmlwdChzY3JpcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBSZXFTY3JpcHQoWydQcm9kdWN0aW9uIExvYWRlciddLCBzY3JpcHQsIGdldFR5cGVzLlN0YXRpYywgeyBpc0RlYnVnOiBmYWxzZSwgb25seVByZXBhcmU6IHRydWUgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLm1rZGlyKGFycmF5VHlwZVsxXSArIGNvbm5lY3QpO1xuICAgICAgICAgICAgYXdhaXQgRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgICAgIGlmIChhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoYXJyYXlUeXBlWzJdICsgJy8nICsgY29ubmVjdCkpIC8vY2hlY2sgaWYgbm90IGFscmVhZHkgY29tcGlsZSBmcm9tIGEgJ2luLWZpbGUnIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29tcGlsZUZpbGUoY29ubmVjdCwgYXJyYXlUeXBlLCB7IGR5bmFtaWNDaGVjazogIWV4dGVuc2lvbklzKG4sIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJheVR5cGUgPT0gZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgUmVxdWlyZVNjcmlwdChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBTdGF0aWNGaWxlcyhjb25uZWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVTY3JpcHRzKHNjcmlwdHM6IHN0cmluZ1tdKSB7XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgYXdhaXQgUmVxdWlyZVNjcmlwdChwYXRoKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIENyZWF0ZUNvbXBpbGUodDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgdHlwZXMgPSBnZXRUeXBlc1t0XTtcbiAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeSh0eXBlc1sxXSk7XG4gICAgcmV0dXJuICgpID0+IEZpbGVzSW5Gb2xkZXIodHlwZXMsICcnLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogd2hlbiBwYWdlIGNhbGwgb3RoZXIgcGFnZTtcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlSW5GaWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgIHsgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2sgfTogeyBoYXNTZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgbmVzdGVkUGFnZT86IHN0cmluZywgbmVzdGVkUGFnZURhdGE/OiBzdHJpbmcsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLCBhcnJheVR5cGVbMV0pO1xuICAgIHJldHVybiBhd2FpdCBjb21waWxlRmlsZShwYXRoLCBhcnJheVR5cGUsIHtpc0RlYnVnOnRydWUsIGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pIHtcbiAgICBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShwYXRoLCBhcnJheVR5cGUsIHtkeW5hbWljQ2hlY2t9KTtcbiAgICBDbGVhcldhcm5pbmcoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVBbGwoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncykge1xuICAgIGxldCBzdGF0ZSA9ICFhcmd2LmluY2x1ZGVzKCdyZWJ1aWxkJykgJiYgYXdhaXQgQ29tcGlsZVN0YXRlLmNoZWNrTG9hZCgpXG5cbiAgICBpZiAoc3RhdGUpIHJldHVybiAoKSA9PiBSZXF1aXJlU2NyaXB0cyhzdGF0ZS5zY3JpcHRzKVxuICAgIHBhZ2VEZXBzLmNsZWFyKCk7XG5cbiAgICBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuXG4gICAgcGVyQ29tcGlsZSgpO1xuXG4gICAgY29uc3QgYWN0aXZhdGVBcnJheSA9IFthd2FpdCBDcmVhdGVDb21waWxlKGdldFR5cGVzLlN0YXRpY1syXSwgc3RhdGUpLCBhd2FpdCBDcmVhdGVDb21waWxlKGdldFR5cGVzLkxvZ3NbMl0sIHN0YXRlKSwgQ2xlYXJXYXJuaW5nXTtcblxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhY3RpdmF0ZUFycmF5KSB7XG4gICAgICAgICAgICBhd2FpdCBpKCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY3JlYXRlU2l0ZU1hcChFeHBvcnQsIHN0YXRlKTtcbiAgICAgICAgc3RhdGUuZXhwb3J0KClcbiAgICAgICAgcGFnZURlcHMuc2F2ZSgpO1xuICAgICAgICBwb3N0Q29tcGlsZSgpXG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZ2V0U2V0dGluZ3NEYXRlIH0gZnJvbSBcIi4uL01haW5CdWlsZC9JbXBvcnRNb2R1bGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxudHlwZSBDU3RhdGUgPSB7XG4gICAgdXBkYXRlOiBudW1iZXJcbiAgICBwYWdlQXJyYXk6IHN0cmluZ1tdW10sXG4gICAgaW1wb3J0QXJyYXk6IHN0cmluZ1tdXG4gICAgZmlsZUFycmF5OiBzdHJpbmdbXVxufVxuXG4vKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gc3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBwcm9qZWN0ICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlU3RhdGUge1xuICAgIHByaXZhdGUgc3RhdGU6IENTdGF0ZSA9IHsgdXBkYXRlOiAwLCBwYWdlQXJyYXk6IFtdLCBpbXBvcnRBcnJheTogW10sIGZpbGVBcnJheTogW10gfVxuICAgIHN0YXRpYyBmaWxlUGF0aCA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBcIkNvbXBpbGVTdGF0ZS5qc29uXCIpXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUudXBkYXRlID0gZ2V0U2V0dGluZ3NEYXRlKClcbiAgICB9XG5cbiAgICBnZXQgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXlcbiAgICB9XG5cbiAgICBnZXQgcGFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnBhZ2VBcnJheVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZmlsZUFycmF5XG4gICAgfVxuXG4gICAgYWRkUGFnZShwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucGFnZUFycmF5LmZpbmQoeCA9PiB4WzBdID09IHBhdGggJiYgeFsxXSA9PSB0eXBlKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucGFnZUFycmF5LnB1c2goW3BhdGgsIHR5cGVdKVxuICAgIH1cblxuICAgIGFkZEltcG9ydChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmltcG9ydEFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgYWRkRmlsZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmZpbGVBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmlsZUFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZShDb21waWxlU3RhdGUuZmlsZVBhdGgsIHRoaXMuc3RhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNoZWNrTG9hZCgpIHtcbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLmZpbGVQYXRoKSkgcmV0dXJuXG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcbiAgICAgICAgc3RhdGUuc3RhdGUgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZmlsZVBhdGgpXG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAhPSBnZXRTZXR0aW5nc0RhdGUoKSkgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxufSIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBJbXBvcnRGaWxlLCB7QWRkRXh0ZW5zaW9uLCBSZXF1aXJlT25jZX0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7cHJpbnR9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTdGFydFJlcXVpcmUoYXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYXJyYXlGdW5jU2VydmVyID0gW107XG4gICAgZm9yIChsZXQgaSBvZiBhcnJheSkge1xuICAgICAgICBpID0gQWRkRXh0ZW5zaW9uKGkpO1xuXG4gICAgICAgIGNvbnN0IGIgPSBhd2FpdCBJbXBvcnRGaWxlKFsncm9vdCBmb2xkZXIgKFdXVyknXSwgaSwgZ2V0VHlwZXMuU3RhdGljLCB7aXNEZWJ1Z30pO1xuICAgICAgICBpZiAoYiAmJiB0eXBlb2YgYi5TdGFydFNlcnZlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhcnJheUZ1bmNTZXJ2ZXIucHVzaChiLlN0YXJ0U2VydmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByaW50LmxvZyhgQ2FuJ3QgZmluZCBTdGFydFNlcnZlciBmdW5jdGlvbiBhdCBtb2R1bGUgLSAke2l9XFxuYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXlGdW5jU2VydmVyO1xufVxuXG5sZXQgbGFzdFNldHRpbmdzSW1wb3J0OiBudW1iZXI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0U2V0dGluZ3MoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbil7XG4gICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGggKyAnLnRzJykpe1xuICAgICAgICBmaWxlUGF0aCArPSAnLnRzJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCArPSAnLmpzJ1xuICAgIH1cbiAgICBjb25zdCBjaGFuZ2VUaW1lID0gPGFueT5hd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKVxuXG4gICAgaWYoY2hhbmdlVGltZSA9PSBsYXN0U2V0dGluZ3NJbXBvcnQgfHwgIWNoYW5nZVRpbWUpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIFxuICAgIGxhc3RTZXR0aW5nc0ltcG9ydCA9IGNoYW5nZVRpbWU7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IFJlcXVpcmVPbmNlKGZpbGVQYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gZGF0YS5kZWZhdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGluZ3NEYXRlKCl7XG4gICAgcmV0dXJuIGxhc3RTZXR0aW5nc0ltcG9ydFxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSB9IGZyb20gXCIuLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSBcIi4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzXCI7XG5pbXBvcnQgRWFzeUZzLCB7IERpcmVudCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCBDb21waWxlU3RhdGUgZnJvbSBcIi4vQ29tcGlsZVN0YXRlXCI7XG5pbXBvcnQgeyBpc0ZpbGVUeXBlIH0gZnJvbSBcIi4vRmlsZVR5cGVzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuYXN5bmMgZnVuY3Rpb24gRmlsZXNJbkZvbGRlcihhcnJheVR5cGU6IHN0cmluZ1tdLCBwYXRoOiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKGFycmF5VHlwZVswXSArIHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IHByb21pc2VzID1bXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChGaWxlc0luRm9sZGVyKGFycmF5VHlwZSwgY29ubmVjdCArICcvJywgc3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJheVR5cGUgPT0gZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzY2FuRmlsZXMoKXtcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuU3RhdGljLCAnJywgc3RhdGUpLFxuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLkxvZ3MsICcnLCBzdGF0ZSlcbiAgICBdKVxuICAgIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlYnVnU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKXtcbiAgICByZXR1cm4gY3JlYXRlU2l0ZU1hcChFeHBvcnQsIGF3YWl0IHNjYW5GaWxlcygpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHsgcm91dGluZywgZGV2ZWxvcG1lbnQgfSA9IEV4cG9ydDtcbiAgICBpZiAoIXJvdXRpbmcuc2l0ZW1hcCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2l0ZW1hcCA9IHJvdXRpbmcuc2l0ZW1hcCA9PT0gdHJ1ZSA/IHt9IDogcm91dGluZy5zaXRlbWFwO1xuICAgIE9iamVjdC5hc3NpZ24oc2l0ZW1hcCwge1xuICAgICAgICBydWxlczogdHJ1ZSxcbiAgICAgICAgdXJsU3RvcDogZmFsc2UsXG4gICAgICAgIGVycm9yUGFnZXM6IGZhbHNlLFxuICAgICAgICB2YWxpZFBhdGg6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhZ2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgdXJsczogLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgXG4gICAgZm9yIChsZXQgW3VybCwgdHlwZV0gb2Ygc3RhdGUucGFnZXMpIHtcblxuICAgICAgICBpZih0eXBlICE9IGdldFR5cGVzLlN0YXRpY1syXSB8fCAhdXJsLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdXJsID0gJy8nICsgdXJsLnN1YnN0cmluZygwLCB1cmwubGVuZ3RoIC0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZS5sZW5ndGggLSAxKTtcblxuICAgICAgICBpZihwYXRoLmV4dG5hbWUodXJsKSA9PSAnLnNlcnYnKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudXJsU3RvcCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcudXJsU3RvcCkge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBwYXRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaXRlbWFwLnJ1bGVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy5ydWxlcykge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhd2FpdCByb3V0aW5nLnJ1bGVzW3BhdGhdKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChlbmRzID0+IHVybC5lbmRzV2l0aCgnLicrZW5kcykpIHx8XG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoc3RhcnQgPT4gdXJsLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICApXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiByb3V0aW5nLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgICAgIGlmICghYXdhaXQgZnVuYyh1cmwpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSB1cmxzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzaXRlbWFwLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXJyb3IgaW4gcm91dGluZy5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9ICcvJyArIHJvdXRpbmcuZXJyb3JQYWdlc1tlcnJvcl0ucGF0aDtcblxuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSB1cmxzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYWdlcy5wdXNoKHVybCk7XG4gICAgfVxuXG4gICAgbGV0IHdyaXRlID0gdHJ1ZTtcbiAgICBpZiAoc2l0ZW1hcC5maWxlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVBY3Rpb24gPSBhd2FpdCBJbXBvcnRGaWxlKCdTaXRlbWFwIEltcG9ydCcsIHNpdGVtYXAuZmlsZSwgZ2V0VHlwZXMuU3RhdGljLCBkZXZlbG9wbWVudCk7XG4gICAgICAgIGlmKCFmaWxlQWN0aW9uPy5TaXRlbWFwKXtcbiAgICAgICAgICAgIGR1bXAud2FybignXFwnU2l0ZW1hcFxcJyBmdW5jdGlvbiBub3QgZm91bmQgb24gZmlsZSAtPiAnKyBzaXRlbWFwLmZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3JpdGUgPSBhd2FpdCBmaWxlQWN0aW9uLlNpdGVtYXAocGFnZXMsIHN0YXRlLCBFeHBvcnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYod3JpdGUgJiYgcGFnZXMubGVuZ3RoKXtcbiAgICAgICAgY29uc3QgcGF0aCA9IHdyaXRlID09PSB0cnVlID8gJ3NpdGVtYXAudHh0Jzogd3JpdGU7XG4gICAgICAgIHN0YXRlLmFkZEZpbGUocGF0aCk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZ2V0VHlwZXMuU3RhdGljWzBdICsgcGF0aCwgcGFnZXMuam9pbignXFxuJykpO1xuICAgIH1cbn0iLCAiLyoqXG4gKiBHaXZlbiBhIGZpbGUgbmFtZSBhbmQgYW4gZXh0ZW5zaW9uLCByZXR1cm4gdHJ1ZSBpZiB0aGUgZmlsZSBuYW1lIGVuZHMgd2l0aCB0aGUgZXh0ZW5zaW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGV4dG5hbWUgLSB0aGUgZXh0ZW5zaW9uIHRvIGNoZWNrIGZvci5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuc2lvbklzKG5hbWU6IHN0cmluZywgZXh0bmFtZTogc3RyaW5nKXtcbiAgICByZXR1cm4gbmFtZS5lbmRzV2l0aCgnLicgKyBleHRuYW1lKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZmlsZSBuYW1lIGVuZHMgd2l0aCBvbmUgb2YgdGhlIGdpdmVuIGZpbGUgdHlwZXMuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlcyAtIGFuIGFycmF5IG9mIGZpbGUgZXh0ZW5zaW9ucyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpbGVUeXBlKHR5cGVzOiBzdHJpbmdbXSwgbmFtZTogc3RyaW5nKSB7XG4gICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uSXMobmFtZSx0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGFzdCBkb3QgYW5kIGV2ZXJ5dGhpbmcgYWZ0ZXIgaXQgZnJvbSBhIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgdG8gcmVtb3ZlIHRoZSBlbmQgdHlwZSBmcm9tLlxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRob3V0IHRoZSBsYXN0IGNoYXJhY3Rlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJlbW92ZUVuZFR5cGUoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59IiwgImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBGaWxlcyB9IGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5cbmNvbnN0IEV4cG9ydCA9IHtcbiAgICBQYWdlTG9hZFJhbToge30sXG4gICAgUGFnZVJhbTogdHJ1ZVxufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIHR5cGVBcnJheSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGggdG8gdGhlXG4gKiBmaWxlLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBkaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHthbnl9IERhdGFPYmplY3QgLSBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVBhZ2UoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIERhdGFPYmplY3Q6IGFueSkge1xuICAgIGNvbnN0IFJlcUZpbGVQYXRoID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuICAgIGNvbnN0IHJlc01vZGVsID0gKCkgPT4gUmVxRmlsZVBhdGgubW9kZWwoRGF0YU9iamVjdCk7XG5cbiAgICBsZXQgZmlsZUV4aXN0czogYm9vbGVhbjtcblxuICAgIGlmIChSZXFGaWxlUGF0aCkge1xuICAgICAgICBpZiAoIURhdGFPYmplY3QuaXNEZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuXG4gICAgICAgIGlmIChSZXFGaWxlUGF0aC5kYXRlID09IC0xKSB7XG4gICAgICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoUmVxRmlsZVBhdGgucGF0aCk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUV4aXN0cylcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYgKCFleHRuYW1lKSB7XG4gICAgICAgIGV4dG5hbWUgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICBmaWxlUGF0aCArPSAnLicgKyBleHRuYW1lO1xuICAgIH1cblxuICAgIGxldCBmdWxsUGF0aDogc3RyaW5nO1xuICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZVBhdGgpO1xuICAgICBlbHNlXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKCFbQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMuY29tcG9uZW50XS5pbmNsdWRlcyhleHRuYW1lKSkge1xuICAgICAgICBjb25zdCBpbXBvcnRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTtcbiAgICAgICAgRGF0YU9iamVjdC53cml0ZShpbXBvcnRUZXh0KTtcbiAgICAgICAgcmV0dXJuIGltcG9ydFRleHQ7XG4gICAgfVxuXG4gICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpO1xuICAgIGlmICghZmlsZUV4aXN0cykge1xuICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2NvcHlQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gPGNvbG9yPicke19fZmlsZW5hbWV9J2BcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiAoKSA9PiB7IH0sIGRhdGU6IC0xLCBwYXRoOiBmdWxsUGF0aCB9O1xuICAgICAgICByZXR1cm4gTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGluU3RhdGljUGF0aCA9ICBwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSxmdWxsUGF0aCk7XG4gICAgY29uc3QgU21hbGxQYXRoID0gdHlwZUFycmF5WzJdICsgJy8nICsgaW5TdGF0aWNQYXRoO1xuICAgIGNvbnN0IHJlQnVpbGQgPSBEYXRhT2JqZWN0LmlzRGVidWcgJiYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0eXBlQXJyYXlbMV0gKyAnLycgK2luU3RhdGljUGF0aCArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKFNtYWxsUGF0aCkpO1xuXG4gICAgaWYgKHJlQnVpbGQpXG4gICAgICAgIGF3YWl0IEZhc3RDb21waWxlKGluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBleHRuYW1lICE9IEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpO1xuXG5cbiAgICBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0gJiYgIXJlQnVpbGQpIHtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF1bMF0gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbChEYXRhT2JqZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jID0gYXdhaXQgTG9hZFBhZ2UoU21hbGxQYXRoLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIGlmIChFeHBvcnQuUGFnZVJhbSkge1xuICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdKSB7XG4gICAgICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdWzBdID0gZnVuYztcbiAgICB9XG5cbiAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBmdW5jIH07XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMoRGF0YU9iamVjdCk7XG59XG5cbmNvbnN0IEdsb2JhbFZhciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRGdWxsUGF0aENvbXBpbGUodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIHJldHVybiB0eXBlQXJyYXlbMV0gKyBTcGxpdEluZm9bMV0gKyAnLmNqcyc7XG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIHBhZ2UgdG8gbG9hZC5cbiAqIEBwYXJhbSBleHQgLSBUaGUgZXh0ZW5zaW9uIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlKHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG5cbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIGNvbnN0IExhc3RSZXF1aXJlID0ge307XG5cbiAgICBmdW5jdGlvbiBfcmVxdWlyZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gUmVxdWlyZUZpbGUocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmNsdWRlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nLCBXaXRoT2JqZWN0ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVQYWdlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgeyAuLi5XaXRoT2JqZWN0LCAuLi5EYXRhT2JqZWN0IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF90cmFuc2ZlcihwOiBzdHJpbmcsIHByZXNlcnZlRm9ybTogYm9vbGVhbiwgd2l0aE9iamVjdDogYW55LCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ID0gJyc7XG5cbiAgICAgICAgaWYgKCFwcmVzZXJ2ZUZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3REYXRhID0gRGF0YU9iamVjdC5SZXF1ZXN0LmJvZHkgPyB7fSA6IG51bGw7XG4gICAgICAgICAgICBEYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFPYmplY3QsXG4gICAgICAgICAgICAgICAgUmVxdWVzdDogeyAuLi5EYXRhT2JqZWN0LlJlcXVlc3QsIGZpbGVzOiB7fSwgcXVlcnk6IHt9LCBib2R5OiBwb3N0RGF0YSB9LFxuICAgICAgICAgICAgICAgIFBvc3Q6IHBvc3REYXRhLCBRdWVyeToge30sIEZpbGVzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgRGF0YU9iamVjdCwgcCwgd2l0aE9iamVjdCk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBTcGxpdEluZm9bMV0gKyAnLmNqcycpO1xuICAgIGNvbnN0IHByaXZhdGVfdmFyID0ge307XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShjb21waWxlZFBhdGgpO1xuXG4gICAgICAgIHJldHVybiBNeU1vZHVsZShfcmVxdWlyZSwgX2luY2x1ZGUsIF90cmFuc2ZlciwgcHJpdmF0ZV92YXIsIGhhbmRlbENvbm5lY3RvclNlcnZpY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbGV0IGVycm9yVGV4dDogc3RyaW5nO1xuXG4gICAgICAgIGlmKGlzRGVidWcpe1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBwYXRoIC0+IFwiLCBSZW1vdmVFbmRUeXBlKHVybCksIFwiLT5cIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIHByaW50LmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gSlNQYXJzZXIucHJpbnRFcnJvcihgRXJyb3IgcGF0aDogJHt1cmx9PGJyLz5FcnJvciBtZXNzYWdlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yVGV4dCA9IEpTUGFyc2VyLnByaW50RXJyb3IoYEVycm9yIGNvZGU6ICR7ZS5jb2RlfWApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKERhdGFPYmplY3Q6IGFueSkgPT4ge1xuICAgICAgICAgICAgRGF0YU9iamVjdC5SZXF1ZXN0LmVycm9yID0gZTtcbiAgICAgICAgICAgIERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCArPSBlcnJvclRleHQ7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbi8qKlxuICogSXQgdGFrZXMgYSBmdW5jdGlvbiB0aGF0IHByZXBhcmUgYSBwYWdlLCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgbG9hZHMgYSBwYWdlXG4gKiBAcGFyYW0gTG9hZFBhZ2VGdW5jIC0gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGluIGEgcGFnZSB0byBleGVjdXRlIG9uXG4gKiBAcGFyYW0ge3N0cmluZ30gcnVuX3NjcmlwdF9uYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjcmlwdCB0byBydW4uXG4gKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKi9cblxuZnVuY3Rpb24gQnVpbGRQYWdlKExvYWRQYWdlRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiB2b2lkLCBydW5fc2NyaXB0X25hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IFBhZ2VWYXIgPSB7fTtcblxuICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKFJlc3BvbnNlOiBSZXNwb25zZSwgUmVxdWVzdDogUmVxdWVzdCwgUG9zdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IG51bGwsIFF1ZXJ5OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBDb29raWVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBTZXNzaW9uOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBGaWxlczogRmlsZXMsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgb3V0X3J1bl9zY3JpcHQgPSB7IHRleHQ6ICcnIH07XG5cbiAgICAgICAgZnVuY3Rpb24gVG9TdHJpbmdJbmZvKHN0cjogYW55KSB7XG4gICAgICAgICAgICBjb25zdCBhc1N0cmluZyA9IHN0cj8udG9TdHJpbmc/LigpO1xuICAgICAgICAgICAgaWYgKGFzU3RyaW5nID09IG51bGwgfHwgYXNTdHJpbmcuc3RhcnRzV2l0aCgnW29iamVjdCBPYmplY3RdJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RyLCBudWxsLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhc1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJlc3BvbnNlKHRleHQ6IGFueSkge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCA9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQgPSAnJykge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGVTYWZlKHN0ciA9ICcnKSB7XG4gICAgICAgICAgICBzdHIgPSBUb1N0cmluZ0luZm8oc3RyKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIHN0cikge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyYjJyArIGkuY2hhckNvZGVBdCgwKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVjaG8oYXJyOiBzdHJpbmdbXSwgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIHdyaXRlU2FmZShwYXJhbXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFyci5hdCgtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVkaXJlY3RQYXRoOiBhbnkgPSBmYWxzZTtcblxuICAgICAgICBSZXNwb25zZS5yZWRpcmVjdCA9IChwYXRoOiBzdHJpbmcsIHN0YXR1cz86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0gU3RyaW5nKHBhdGgpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzKHN0YXR1cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBSZXNwb25zZTtcbiAgICAgICAgfTtcblxuICAgICAgICAoPGFueT5SZXNwb25zZSkucmVsb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QoUmVxdWVzdC51cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VuZEZpbGUoZmlsZVBhdGgsIGRlbGV0ZUFmdGVyID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IHsgZmlsZTogZmlsZVBhdGgsIGRlbGV0ZUFmdGVyIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBEYXRhU2VuZCA9IHtcbiAgICAgICAgICAgIHNlbmRGaWxlLFxuICAgICAgICAgICAgd3JpdGVTYWZlLFxuICAgICAgICAgICAgd3JpdGUsXG4gICAgICAgICAgICBlY2hvLFxuICAgICAgICAgICAgc2V0UmVzcG9uc2UsXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdCxcbiAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFBvc3QsXG4gICAgICAgICAgICBRdWVyeSxcbiAgICAgICAgICAgIFNlc3Npb24sXG4gICAgICAgICAgICBGaWxlcyxcbiAgICAgICAgICAgIENvb2tpZXMsXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgUGFnZVZhcixcbiAgICAgICAgICAgIEdsb2JhbFZhcixcbiAgICAgICAgICAgIGNvZGViYXNlOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgTG9hZFBhZ2VGdW5jKERhdGFTZW5kKTtcblxuICAgICAgICByZXR1cm4geyBvdXRfcnVuX3NjcmlwdDogb3V0X3J1bl9zY3JpcHQudGV4dCwgcmVkaXJlY3RQYXRoIH1cbiAgICB9KVxufVxuXG5leHBvcnQgeyBMb2FkUGFnZSwgQnVpbGRQYWdlLCBnZXRGdWxsUGF0aENvbXBpbGUsIEV4cG9ydCwgU3BsaXRGaXJzdCB9O1xuIiwgImltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEltcG9ydEZpbGUsIEFkZEV4dGVuc2lvbiB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcblxudHlwZSBSZXF1aXJlRmlsZXMgPSB7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgc3RhdHVzPzogbnVtYmVyXG4gICAgbW9kZWw6IGFueVxuICAgIGRlcGVuZGVuY2llcz86IFN0cmluZ0FueU1hcFxuICAgIHN0YXRpYz86IGJvb2xlYW5cbn1cblxuY29uc3QgQ2FjaGVSZXF1aXJlRmlsZXMgPSB7fTtcblxuLyoqXG4gKiBJdCBtYWtlcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gZGVwZW5kZW5jaWVzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgYXJyYXkgb2YgYmFzZSBwYXRoc1xuICogQHBhcmFtIFtiYXNlUGF0aF0gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGNvbXBpbGVkLlxuICogQHBhcmFtIGNhY2hlIC0gQSBjYWNoZSBvZiB0aGUgbGFzdCB0aW1lIGEgZmlsZSB3YXMgbW9kaWZpZWQuXG4gKiBAcmV0dXJucyBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBTdHJpbmdBbnlNYXAsIHR5cGVBcnJheTogc3RyaW5nW10sIGJhc2VQYXRoID0gJycsIGNhY2hlID0ge30pIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNYXA6IFN0cmluZ0FueU1hcCA9IHt9O1xuICAgIGNvbnN0IHByb21pc2VBbGwgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgcHJvbWlzZUFsbC5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGggPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgICAgIGlmICghY2FjaGVbYmFzZVBhdGhdKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlUGF0aF0gPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBiYXNlUGF0aCwgJ210aW1lTXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbJ3RoaXNGaWxlJ10gPSBjYWNoZVtiYXNlUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFtmaWxlUGF0aF0gPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKDxhbnk+dmFsdWUsIHR5cGVBcnJheSwgZmlsZVBhdGgsIGNhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICApKCkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VBbGwpO1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNYXA7XG59XG5cbi8qKlxuICogSWYgdGhlIG9sZCBkZXBlbmRlbmNpZXMgYW5kIHRoZSBuZXcgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZSwgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmN5IG1hcC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkZXBlbmRlbmN5IHRyZWVzLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIHRoZSBtb2R1bGVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBbcGFyZW50XSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJlbnQgbW9kdWxlLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLiBFYWNoIHN0cmluZyByZXByZXNlbnRzIGEgY2hhbmdlIGluIHRoZSBkZXBlbmRlbmN5XG4gKiB0cmVlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VBcnJheShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCwgcGFyZW50ID0gJycpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgY2hhbmdlQXJyYXkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW5ld0RlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGdldENoYW5nZUFycmF5KG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0sIG5hbWUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaCguLi5jaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZUFycmF5O1xufVxuXG4vKipcbiAqIEl0IGltcG9ydHMgYSBmaWxlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIHBhdGhzIHR5cGVzLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBtYXAgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuXG4gKiBAcmV0dXJucyBUaGUgbW9kZWwgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogUmVxdWlyZUZpbGVzIH0sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBSZXFGaWxlID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IG51bWJlciwgbmV3RGVwczogU3RyaW5nQW55TWFwO1xuICAgIGlmIChSZXFGaWxlKSB7XG5cbiAgICAgICAgaWYgKCFpc0RlYnVnIHx8IGlzRGVidWcgJiYgKFJlcUZpbGUuc3RhdHVzID09IC0xKSlcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBSZXFGaWxlLnBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG5cbiAgICAgICAgICAgIG5ld0RlcHMgPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpO1xuXG4gICAgICAgICAgICBpZiAoY29tcGFyZURlcGVuZGVuY2llc1NhbWUoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoUmVxRmlsZS5zdGF0dXMgPT0gMClcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IHN0YXRpY19tb2R1bGVzID0gZmFsc2U7XG5cbiAgICBpZiAoIVJlcUZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJylcbiAgICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHBhdGgucmVsYXRpdmUodHlwZUFycmF5WzBdLCBfX2Rpcm5hbWUpLCBmaWxlUGF0aCk7XG5cbiAgICAgICAgZWxzZSBpZiAoZmlsZVBhdGhbMF0gIT0gJy8nKVxuICAgICAgICAgICAgc3RhdGljX21vZHVsZXMgPSB0cnVlO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDEpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggPSBSZXFGaWxlLnBhdGg7XG4gICAgICAgIHN0YXRpY19tb2R1bGVzID0gUmVxRmlsZS5zdGF0aWM7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRpY19tb2R1bGVzKVxuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBhd2FpdCBBbGlhc09yUGFja2FnZShjb3B5UGF0aCksIHN0YXR1czogLTEsIHN0YXRpYzogdHJ1ZSwgcGF0aDogZmlsZVBhdGggfTtcbiAgICBlbHNlIHtcbiAgICAgICAgLy8gYWRkIHNlcnYuanMgb3Igc2Vydi50cyBpZiBuZWVkZWRcbiAgICAgICAgZmlsZVBhdGggPSBBZGRFeHRlbnNpb24oZmlsZVBhdGgpO1xuXG4gICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gdHlwZUFycmF5WzBdICsgZmlsZVBhdGg7XG4gICAgICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIDApO1xuXG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBoYXZlTW9kZWwgPSBDYWNoZVJlcXVpcmVGaWxlc1tmaWxlUGF0aF07XG4gICAgICAgICAgICBpZiAoaGF2ZU1vZGVsICYmIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMgPSBuZXdEZXBzID8/IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgdHlwZUFycmF5KSkpXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0gaGF2ZU1vZGVsO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3RGVwcyA9IG5ld0RlcHMgPz8ge307XG5cbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBhd2FpdCBJbXBvcnRGaWxlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoX19maWxlbmFtZSksIGZpbGVQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcsIG5ld0RlcHMsIGhhdmVNb2RlbCAmJiBnZXRDaGFuZ2VBcnJheShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzKSksIGRlcGVuZGVuY2llczogbmV3RGVwcywgcGF0aDogZmlsZVBhdGggfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDoge30sIHN0YXR1czogMCwgcGF0aDogZmlsZVBhdGggfTtcbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7ZmlsZVBhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSA8Y29sb3I+JyR7X19maWxlbmFtZX0nYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWx0TW9kZWwgPSBMYXN0UmVxdWlyZVtjb3B5UGF0aF07XG4gICAgQ2FjaGVSZXF1aXJlRmlsZXNbYnVpbHRNb2RlbC5wYXRoXSA9IGJ1aWx0TW9kZWw7XG5cbiAgICByZXR1cm4gYnVpbHRNb2RlbC5tb2RlbDtcbn0iLCAiaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgdHJpbVR5cGUsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8vIC0tIHN0YXJ0IG9mIGZldGNoIGZpbGUgKyBjYWNoZSAtLVxuXG50eXBlIGFwaUluZm8gPSB7XG4gICAgcGF0aFNwbGl0OiBudW1iZXIsXG4gICAgZGVwc01hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfVxufVxuXG5jb25zdCBhcGlTdGF0aWNNYXA6IHsgW2tleTogc3RyaW5nXTogYXBpSW5mbyB9ID0ge307XG5cbi8qKlxuICogR2l2ZW4gYSB1cmwsIHJldHVybiB0aGUgc3RhdGljIHBhdGggYW5kIGRhdGEgaW5mbyBpZiB0aGUgdXJsIGlzIGluIHRoZSBzdGF0aWMgbWFwXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHRoZSB1c2VyIGlzIHJlcXVlc3RpbmcuXG4gKiBAcGFyYW0ge251bWJlcn0gcGF0aFNwbGl0IC0gdGhlIG51bWJlciBvZiBzbGFzaGVzIGluIHRoZSB1cmwuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICovXG5mdW5jdGlvbiBnZXRBcGlGcm9tTWFwKHVybDogc3RyaW5nLCBwYXRoU3BsaXQ6IG51bWJlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcGlTdGF0aWNNYXApO1xuICAgIGZvciAoY29uc3QgaSBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IGUgPSBhcGlTdGF0aWNNYXBbaV07XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSAmJiBlLnBhdGhTcGxpdCA9PSBwYXRoU3BsaXQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXRpY1BhdGg6IGksXG4gICAgICAgICAgICAgICAgZGF0YUluZm86IGVcbiAgICAgICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIEFQSSBmaWxlIGZvciBhIGdpdmVuIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIEFQSS5cbiAqIEByZXR1cm5zIFRoZSBwYXRoIHRvIHRoZSBBUEkgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZmluZEFwaVBhdGgodXJsOiBzdHJpbmcpIHtcblxuICAgIHdoaWxlICh1cmwubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UGF0aCA9IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMF0sIHVybCArICcuYXBpJyk7XG4gICAgICAgIGNvbnN0IG1ha2VQcm9taXNlID0gYXN5bmMgKHR5cGU6IHN0cmluZykgPT4gKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHN0YXJ0UGF0aCArICcuJyArIHR5cGUpICYmIHR5cGUpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVUeXBlID0gKGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCd0cycpLFxuICAgICAgICAgICAgbWFrZVByb21pc2UoJ2pzJylcbiAgICAgICAgXSkpLmZpbHRlcih4ID0+IHgpLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKGZpbGVUeXBlKVxuICAgICAgICAgICAgcmV0dXJuIHVybCArICcuYXBpLicgKyBmaWxlVHlwZTtcblxuICAgICAgICB1cmwgPSBDdXRUaGVMYXN0KCcvJywgdXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYXRoU3BsaXQgPSB1cmwuc3BsaXQoJy8nKS5sZW5ndGg7XG4gICAgbGV0IHsgc3RhdGljUGF0aCwgZGF0YUluZm8gfSA9IGdldEFwaUZyb21NYXAodXJsLCBwYXRoU3BsaXQpO1xuXG4gICAgaWYgKCFkYXRhSW5mbykge1xuICAgICAgICBzdGF0aWNQYXRoID0gYXdhaXQgZmluZEFwaVBhdGgodXJsKTtcblxuICAgICAgICBpZiAoc3RhdGljUGF0aCkge1xuICAgICAgICAgICAgZGF0YUluZm8gPSB7XG4gICAgICAgICAgICAgICAgcGF0aFNwbGl0LFxuICAgICAgICAgICAgICAgIGRlcHNNYXA6IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFwaVN0YXRpY01hcFtzdGF0aWNQYXRoXSA9IGRhdGFJbmZvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGFJbmZvKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBNYWtlQ2FsbChcbiAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVGaWxlKCcvJyArIHN0YXRpY1BhdGgsICdhcGktY2FsbCcsICcnLCBnZXRUeXBlcy5TdGF0aWMsIGRhdGFJbmZvLmRlcHNNYXAsIGlzRGVidWcpLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgdXJsLnN1YnN0cmluZyhzdGF0aWNQYXRoLmxlbmd0aCAtIDYpLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIG5leHRQcmFzZVxuICAgICAgICApO1xuICAgIH1cbn1cbi8vIC0tIGVuZCBvZiBmZXRjaCBmaWxlIC0tXG5jb25zdCBiYW5Xb3JkcyA9IFsndmFsaWRhdGVVUkwnLCAndmFsaWRhdGVGdW5jJywgJ2Z1bmMnLCAnZGVmaW5lJywgLi4uaHR0cC5NRVRIT0RTXTtcbi8qKlxuICogRmluZCB0aGUgQmVzdCBQYXRoXG4gKi9cbmZ1bmN0aW9uIGZpbmRCZXN0VXJsT2JqZWN0KG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcpIHtcbiAgICBsZXQgbWF4TGVuZ3RoID0gMCwgdXJsID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGkubGVuZ3RoO1xuICAgICAgICBpZiAobWF4TGVuZ3RoIDwgbGVuZ3RoICYmIHVybEZyb20uc3RhcnRzV2l0aChpKSAmJiAhYmFuV29yZHMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHVybCA9IGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFBhcnNlIEFuZCBWYWxpZGF0ZSBVUkxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VVUkxEYXRhKHZhbGlkYXRlOiBhbnksIHZhbHVlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGxldCBwdXNoRGF0YSA9IHZhbHVlLCByZXNEYXRhID0gdHJ1ZSwgZXJyb3I6IHN0cmluZztcblxuICAgIHN3aXRjaCAodmFsaWRhdGUpIHtcbiAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgIGNhc2UgcGFyc2VGbG9hdDpcbiAgICAgICAgY2FzZSBwYXJzZUludDpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gKDxhbnk+dmFsaWRhdGUpKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSAhaXNOYU4ocHVzaERhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gdmFsdWUgIT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSB2YWx1ZSA9PSAndHJ1ZScgfHwgdmFsdWUgPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhbnknOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxpZGF0ZSkpXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLmluY2x1ZGVzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFrZVZhbGlkID0gYXdhaXQgdmFsaWRhdGUodmFsdWUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ha2VWYWxpZCAmJiB0eXBlb2YgbWFrZVZhbGlkID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkLnZhbGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaERhdGEgPSBtYWtlVmFsaWQucGFyc2UgPz8gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZDtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yLCBmaWVsZCAtICcgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS50ZXN0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc0RhdGEpXG4gICAgICAgIGVycm9yID0gJ1ZhbGlkYXRpb24gZXJyb3Igd2l0aCB2YWx1ZSBcIicgKyB2YWx1ZSArICdcIic7XG5cbiAgICByZXR1cm4gW2Vycm9yLCBwdXNoRGF0YV07XG59XG5cbi8qKlxuICogSXQgdGFrZXMgdGhlIFVSTCBkYXRhIGFuZCBwYXJzZXMgaXQgaW50byBhbiBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gb2JqIC0gdGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBVUkwgZGVmaW5pdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSBUaGUgVVJMIHRoYXQgd2FzIHBhc3NlZCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHthbnl9IGRlZmluZU9iamVjdCAtIEFsbCB0aGUgZGVmaW5pdGlvbnMgdGhhdCBoYXMgYmVlbiBmb3VuZFxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIG1ha2VNYXNzYWdlIC0gQ3JlYXRlIGFuIGVycm9yIG1lc3NhZ2VcbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIGFuIGVycm9yIHByb3BlcnR5LlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlRGVmaW5pdGlvbihvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBkZWZpbmVPYmplY3Q6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCBtYWtlTWFzc2FnZTogKGU6IGFueSkgPT4gc3RyaW5nKSB7XG4gICAgaWYgKCFvYmouZGVmaW5lKVxuICAgICAgICByZXR1cm4gdXJsRnJvbTtcblxuICAgIGNvbnN0IHZhbGlkYXRlRnVuYyA9IG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuICAgIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jID0gbnVsbDtcbiAgICBkZWxldGUgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2JqLmRlZmluZSkge1xuICAgICAgICBjb25zdCBbZGF0YVNsYXNoLCBuZXh0VXJsRnJvbV0gPSBTcGxpdEZpcnN0KCcvJywgdXJsRnJvbSk7XG4gICAgICAgIHVybEZyb20gPSBuZXh0VXJsRnJvbTtcblxuICAgICAgICBjb25zdCBbZXJyb3IsIG5ld0RhdGFdID0gYXdhaXQgcGFyc2VVUkxEYXRhKG9iai5kZWZpbmVbbmFtZV0sIGRhdGFTbGFzaCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICBpZihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB7ZXJyb3J9O1xuICAgICAgICBcbiAgICAgICAgZGVmaW5lT2JqZWN0W25hbWVdID0gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBpZiAodmFsaWRhdGVGdW5jKSB7XG4gICAgICAgIGxldCB2YWxpZGF0ZTogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSBhd2FpdCB2YWxpZGF0ZUZ1bmMoZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvcicgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJyA/IHZhbGlkYXRlOiAnRXJyb3IgdmFsaWRhdGluZyBVUkwnfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsRnJvbSB8fCAnJztcbn1cbi8qKlxuICogVGhlIGZ1bmN0aW9uIHdpbGwgcGFyc2UgdGhlIHVybCBhbmQgZmluZCB0aGUgYmVzdCBtYXRjaCBmb3IgdGhlIHVybFxuICogQHBhcmFtIHthbnl9IGZpbGVNb2R1bGUgLSB0aGUgbW9kdWxlIHRoYXQgY29udGFpbnMgdGhlIG1ldGhvZCB0aGF0IHlvdSB3YW50IHRvIGNhbGwuXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIHRoZSB1cmwgdGhhdCB0aGUgdXNlciByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuLFxuICogQHBhcmFtIG5leHRQcmFzZSAtICgpID0+IFByb21pc2U8YW55PlxuICogQHJldHVybnMgYSBib29sZWFuIHZhbHVlLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlLCB0aGUgcmVxdWVzdCBpcyBwcm9jZXNzZWQuIElmIHRoZSBmdW5jdGlvblxuICogcmV0dXJucyBmYWxzZSwgdGhlIHJlcXVlc3QgaXMgbm90IHByb2Nlc3NlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTWFrZUNhbGwoZmlsZU1vZHVsZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIHVybEZyb206IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGxvd0Vycm9ySW5mbyA9ICFHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikgJiYgaXNEZWJ1ZywgbWFrZU1hc3NhZ2UgPSAoZTogYW55KSA9PiAoaXNEZWJ1ZyA/IHByaW50LmVycm9yKGUpIDogbnVsbCkgKyAoYWxsb3dFcnJvckluZm8gPyBgLCBtZXNzYWdlOiAke2UubWVzc2FnZX1gIDogJycpO1xuICAgIGNvbnN0IG1ldGhvZCA9IFJlcXVlc3QubWV0aG9kO1xuICAgIGxldCBtZXRob2RPYmogPSBmaWxlTW9kdWxlW21ldGhvZF0gfHwgZmlsZU1vZHVsZS5kZWZhdWx0W21ldGhvZF07IC8vTG9hZGluZyB0aGUgbW9kdWxlIGJ5IG1ldGhvZFxuICAgIGxldCBoYXZlTWV0aG9kID0gdHJ1ZTtcblxuICAgIGlmKCFtZXRob2RPYmope1xuICAgICAgICBoYXZlTWV0aG9kID0gZmFsc2U7XG4gICAgICAgIG1ldGhvZE9iaiA9IGZpbGVNb2R1bGUuZGVmYXVsdCB8fCBmaWxlTW9kdWxlO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2VNZXRob2QgPSBtZXRob2RPYmo7XG5cbiAgICBjb25zdCBkZWZpbmVPYmplY3QgPSB7fTtcblxuICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTsgLy8gcm9vdCBsZXZlbCBkZWZpbml0aW9uXG4gICAgaWYoKDxhbnk+ZGF0YURlZmluZSkuZXJyb3IpIHJldHVybiBSZXNwb25zZS5qc29uKGRhdGFEZWZpbmUpO1xuICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG5cbiAgICBsZXQgbmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKTtcblxuICAgIC8vcGFyc2UgdGhlIHVybCBwYXRoXG4gICAgZm9yKGxldCBpID0gMDsgaTwgMjsgaSsrKXtcbiAgICAgICAgd2hpbGUgKChuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pKSkge1xuICAgICAgICAgICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuICAgICAgICAgICAgaWYoKDxhbnk+ZGF0YURlZmluZSkuZXJyb3IpIHJldHVybiBSZXNwb25zZS5qc29uKGRhdGFEZWZpbmUpO1xuICAgICAgICAgICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcbiAgICBcbiAgICAgICAgICAgIHVybEZyb20gPSB0cmltVHlwZSgnLycsIHVybEZyb20uc3Vic3RyaW5nKG5lc3RlZFVSTC5sZW5ndGgpKTtcbiAgICAgICAgICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9ialtuZXN0ZWRVUkxdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWhhdmVNZXRob2QpeyAvLyBjaGVjayBpZiB0aGF0IGEgbWV0aG9kXG4gICAgICAgICAgICBoYXZlTWV0aG9kID0gdHJ1ZTtcbiAgICAgICAgICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqPy5mdW5jICYmIG1ldGhvZE9iaiB8fCBiYXNlTWV0aG9kOyAvLyBpZiB0aGVyZSBpcyBhbiAnYW55JyBtZXRob2RcblxuXG4gICAgaWYgKCFtZXRob2RPYmo/LmZ1bmMpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGxlZnREYXRhID0gdXJsRnJvbS5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHVybERhdGEgPSBbXTtcblxuXG4gICAgbGV0IGVycm9yOiBzdHJpbmc7XG4gICAgaWYgKG1ldGhvZE9iai52YWxpZGF0ZVVSTCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgdmFsaWRhdGVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGhvZE9iai52YWxpZGF0ZVVSTCkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtlcnJvclVSTCwgcHVzaERhdGFdID0gYXdhaXQgcGFyc2VVUkxEYXRhKHZhbGlkYXRlLCBsZWZ0RGF0YVtpbmRleF0sIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvclVSTCkge1xuICAgICAgICAgICAgICAgIGVycm9yID0gPHN0cmluZz5lcnJvclVSTDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXJsRGF0YS5wdXNoKHB1c2hEYXRhKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZVxuICAgICAgICB1cmxEYXRhLnB1c2goLi4ubGVmdERhdGEpO1xuXG4gICAgaWYgKCFlcnJvciAmJiBtZXRob2RPYmoudmFsaWRhdGVGdW5jKSB7XG4gICAgICAgIGxldCB2YWxpZGF0ZTogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSBhd2FpdCBtZXRob2RPYmoudmFsaWRhdGVGdW5jKGxlZnREYXRhLCBSZXF1ZXN0LCBSZXNwb25zZSwgdXJsRGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvcicgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBlcnJvciA9IHZhbGlkYXRlO1xuICAgICAgICBlbHNlIGlmICghdmFsaWRhdGUpXG4gICAgICAgICAgICBlcnJvciA9ICdFcnJvciB2YWxpZGF0aW5nIFVSTCc7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yIH0pO1xuXG4gICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgbGV0IGFwaVJlc3BvbnNlOiBhbnksIG5ld1Jlc3BvbnNlOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgYXBpUmVzcG9uc2UgPSBhd2FpdCBtZXRob2RPYmouZnVuYyhSZXF1ZXN0LCBSZXNwb25zZSwgdXJsRGF0YSwgZGVmaW5lT2JqZWN0LCBsZWZ0RGF0YSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoYWxsb3dFcnJvckluZm8pXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6IGUubWVzc2FnZSB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogJzUwMCAtIEludGVybmFsIFNlcnZlciBFcnJvcicgfTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFwaVJlc3BvbnNlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IHRleHQ6IGFwaVJlc3BvbnNlIH07XG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IGFwaVJlc3BvbnNlIHx8IG5ld1Jlc3BvbnNlO1xuXG4gICAgZmluYWxTdGVwKCk7ICAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICBpZiAobmV3UmVzcG9uc2UgIT0gbnVsbClcbiAgICAgICAgUmVzcG9uc2UuanNvbihuZXdSZXNwb25zZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIGFzIEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBHZXRGaWxlIGFzIEdldFN0YXRpY0ZpbGUsIHNlcnZlckJ1aWxkIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCAqIGFzIEZ1bmNTY3JpcHQgZnJvbSAnLi9GdW5jdGlvblNjcmlwdCc7XG5pbXBvcnQgTWFrZUFwaUNhbGwgZnJvbSAnLi9BcGlDYWxsJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuY29uc3QgeyBFeHBvcnQgfSA9IEZ1bmNTY3JpcHQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JQYWdlcyB7XG4gICAgbm90Rm91bmQ/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH0sXG4gICAgc2VydmVyRXJyb3I/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH1cbn1cblxuaW50ZXJmYWNlIEdldFBhZ2VzU2V0dGluZ3Mge1xuICAgIENhY2hlRGF5czogbnVtYmVyLFxuICAgIERldk1vZGU6IGJvb2xlYW4sXG4gICAgQ29va2llU2V0dGluZ3M/OiBhbnksXG4gICAgQ29va2llcz86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIENvb2tpZUVuY3J5cHRlcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIFNlc3Npb25TdG9yZT86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIEVycm9yUGFnZXM6IEVycm9yUGFnZXNcbn1cblxuY29uc3QgU2V0dGluZ3M6IEdldFBhZ2VzU2V0dGluZ3MgPSB7XG4gICAgQ2FjaGVEYXlzOiAxLFxuICAgIERldk1vZGU6IHRydWUsXG4gICAgRXJyb3JQYWdlczoge31cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2VUb1JhbSh1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdW5jU2NyaXB0LmdldEZ1bGxQYXRoQ29tcGlsZSh1cmwpKSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXSA9IFtdO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSA9IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2UodXJsLCBpc0RlYnVnKTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSwgdXJsKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRBbGxQYWdlc1RvUmFtKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gcGFnZURlcHMuc3RvcmUpIHtcbiAgICAgICAgaWYgKCFFeHRlbnNpb25JbkFycmF5KGksIDxhbnk+QmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSkpXG4gICAgICAgICAgICBhd2FpdCBMb2FkUGFnZVRvUmFtKGksIGlzRGVidWcpO1xuXG4gICAgfVxufVxuXG5mdW5jdGlvbiBDbGVhckFsbFBhZ2VzRnJvbVJhbSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gRXhwb3J0LlBhZ2VMb2FkUmFtKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGVsZXRlIEV4cG9ydC5QYWdlTG9hZFJhbVtpXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIEV4dGVuc2lvbkluQXJyYXkoZmlsZVBhdGg6IHN0cmluZywgLi4uYXJyYXlzOiBzdHJpbmdbXSkge1xuICAgIGZpbGVQYXRoID0gZmlsZVBhdGgudG9Mb3dlckNhc2UoKTtcbiAgICBmb3IgKGNvbnN0IGFycmF5IG9mIGFycmF5cykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aC5zdWJzdHJpbmcoZmlsZVBhdGgubGVuZ3RoIC0gaS5sZW5ndGggLSAxKSA9PSAnLicgKyBpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBHZXRFcnJvclBhZ2UoY29kZTogbnVtYmVyLCBMb2NTZXR0aW5nczogJ25vdEZvdW5kJyB8ICdzZXJ2ZXJFcnJvcicpIHtcbiAgICBsZXQgYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmc7XG4gICAgaWYgKFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdKSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYztcbiAgICAgICAgdXJsID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10ucGF0aDtcbiAgICAgICAgY29kZSA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLmNvZGUgPz8gY29kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5Mb2dzO1xuICAgICAgICB1cmwgPSAnZScgKyBjb2RlO1xuICAgIH1cbiAgICByZXR1cm4geyB1cmwsIGFycmF5VHlwZSwgY29kZSB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlQmFzaWNJbmZvKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSwgY29kZTogbnVtYmVyKSB7XG4gICAgLy9maXJzdCBzdGVwIC0gcGFyc2UgaW5mb1xuICAgIGlmIChSZXF1ZXN0Lm1ldGhvZCA9PSBcIlBPU1RcIikge1xuICAgICAgICBpZiAoIVJlcXVlc3QuYm9keSB8fCAhT2JqZWN0LmtleXMoUmVxdWVzdC5ib2R5KS5sZW5ndGgpXG4gICAgICAgICAgICBSZXF1ZXN0LmJvZHkgPSBSZXF1ZXN0LmZpZWxkcyB8fCB7fTtcblxuICAgIH0gZWxzZVxuICAgICAgICBSZXF1ZXN0LmJvZHkgPSBmYWxzZTtcblxuXG4gICAgaWYgKFJlcXVlc3QuY2xvc2VkKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuQ29va2llcyhSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5TZXNzaW9uU3RvcmUoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcblxuICAgIFJlcXVlc3Quc2lnbmVkQ29va2llcyA9IFJlcXVlc3Quc2lnbmVkQ29va2llcyB8fCB7fTtcbiAgICBSZXF1ZXN0LmZpbGVzID0gUmVxdWVzdC5maWxlcyB8fCB7fTtcblxuICAgIGNvbnN0IENvcHlDb29raWVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXMpKTtcblxuICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDE7XG5cbiAgICAvL3NlY29uZCBzdGVwXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMSlcbiAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSBjb2RlO1xuXG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3Quc2lnbmVkQ29va2llcykgey8vdXBkYXRlIGNvb2tpZXNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9ICdvYmplY3QnICYmIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSBDb3B5Q29va2llc1tpXSB8fCBKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0pICE9IEpTT04uc3RyaW5naWZ5KENvcHlDb29raWVzW2ldKSlcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jb29raWUoaSwgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldLCBTZXR0aW5ncy5Db29raWVTZXR0aW5ncyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBDb3B5Q29va2llcykgey8vZGVsZXRlIG5vdCBleGl0cyBjb29raWVzXG4gICAgICAgICAgICBpZiAoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY2xlYXJDb29raWUoaSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9mb3IgZmluYWwgc3RlcFxuZnVuY3Rpb24gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnkpIHtcbiAgICBpZiAoIVJlcXVlc3QuZmlsZXMpIC8vZGVsZXRlIGZpbGVzXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgY29uc3QgYXJyUGF0aCA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5maWxlcykge1xuXG4gICAgICAgIGNvbnN0IGUgPSBSZXF1ZXN0LmZpbGVzW2ldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIGluIGUpIHtcbiAgICAgICAgICAgICAgICBhcnJQYXRoLnB1c2goZVthXS5maWxlcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGUuZmlsZXBhdGgpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGFyclBhdGg7XG59XG5cbi8vZmluYWwgc3RlcFxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUmVxdWVzdEZpbGVzKGFycmF5OiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgZSBpbiBhcnJheSlcbiAgICAgICAgYXdhaXQgRWFzeUZzLnVubGlua0lmRXhpc3RzKGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgaWYgKGNvZGUgPT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IGZ1bGxQYWdlVXJsID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgdXJsO1xuICAgICAgICAvL2NoZWNrIHRoYXQgaXMgbm90IHNlcnZlciBmaWxlXG4gICAgICAgIGlmIChhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBTZXR0aW5ncy5EZXZNb2RlLCB1cmwpIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIHJldHVybiBmdWxsUGFnZVVybDtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZpcnN0RnVuYz86IGFueSkge1xuICAgIGNvbnN0IHBhZ2VBcnJheSA9IFtmaXJzdEZ1bmMgPz8gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZShzbWFsbFBhdGgsIFNldHRpbmdzLkRldk1vZGUpXTtcblxuICAgIHBhZ2VBcnJheVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKHBhZ2VBcnJheVswXSwgc21hbGxQYXRoKTtcblxuICAgIGlmIChFeHBvcnQuUGFnZVJhbSlcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0gPSBwYWdlQXJyYXk7XG5cbiAgICByZXR1cm4gcGFnZUFycmF5WzFdO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBsb2FkIHRoZSBkeW5hbWljIHBhZ2VcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIFRoZSBhcnJheSBvZiB0eXBlcyB0aGF0IHRoZSBwYWdlIGlzLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZ1bGxQYWdlVXJsIC0gVGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzbWFsbFBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZSBmaWxlLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBUaGUgc3RhdHVzIGNvZGUgb2YgdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBUaGUgRHluYW1pY0Z1bmMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgdG8gZ2VuZXJhdGUgdGhlIHBhZ2UuXG4gKiBUaGUgY29kZSBpcyB0aGUgc3RhdHVzIGNvZGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICogVGhlIGZ1bGxQYWdlVXJsIGlzIHRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldER5bmFtaWNQYWdlKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBjb25zdCBpblN0YXRpYyA9IHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgY29uc3Qgc21hbGxQYXRoID0gYXJyYXlUeXBlWzJdICsgJy8nICsgaW5TdGF0aWM7XG4gICAgbGV0IGZ1bGxQYWdlVXJsID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGg7XG5cbiAgICBsZXQgRHluYW1pY0Z1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gYW55O1xuICAgIGlmIChTZXR0aW5ncy5EZXZNb2RlICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSkge1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoYXJyYXlUeXBlWzFdICsgaW5TdGF0aWMgKyAnLmNqcycpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShzbWFsbFBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZSh1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBhcnJheVR5cGUpO1xuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzFdKVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoLCBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzBdKTtcblxuICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlsxXSlcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuICAgIGVsc2UgaWYgKCFFeHBvcnQuUGFnZVJhbSAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgsIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMF0pO1xuXG4gICAgZWxzZSBpZiAoYXJyYXlUeXBlICE9IGdldFR5cGVzLkxvZ3MpIHtcbiAgICAgICAgY29uc3QgeyBhcnJheVR5cGUsIGNvZGUsIHVybCB9ID0gR2V0RXJyb3JQYWdlKDQwNCwgJ25vdEZvdW5kJyk7XG4gICAgICAgIHJldHVybiBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgY29kZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBmdWxsUGFnZVVybCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgRHluYW1pY0Z1bmMsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGZ1bGxQYWdlVXJsXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBNYWtlUGFnZVJlc3BvbnNlKER5bmFtaWNSZXNwb25zZTogYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aD8uZmlsZSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gUmVzcG9uc2Uub24oJ2ZpbmlzaCcsIHJlcykpO1xuICAgIH0gZWxzZSBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCkge1xuICAgICAgICBSZXNwb25zZS53cml0ZUhlYWQoMzAyLCB7IExvY2F0aW9uOiBEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoIH0pO1xuICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBSZXNQYWdlID0gRHluYW1pY1Jlc3BvbnNlLm91dF9ydW5fc2NyaXB0LnRyaW0oKTtcbiAgICAgICAgaWYgKFJlc1BhZ2UpIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnNlbmQoUmVzUGFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmRlbGV0ZUFmdGVyKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHJlcXVlc3QgaXMgbWFkZSB0byBhIHBhZ2UuIFxuICogSXQgd2lsbCBjaGVjayBpZiB0aGUgcGFnZSBleGlzdHMsIGFuZCBpZiBpdCBkb2VzLCBpdCB3aWxsIHJldHVybiB0aGUgcGFnZS4gXG4gKiBJZiBpdCBkb2VzIG5vdCBleGlzdCwgaXQgd2lsbCByZXR1cm4gYSA0MDQgcGFnZVxuICogQHBhcmFtIHtSZXF1ZXN0IHwgYW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoc1xuICogbG9hZGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIHBhZ2UgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHt7IGZpbGU6IGJvb2xlYW4sIGZ1bGxQYWdlVXJsOiBzdHJpbmcgfX0gRmlsZUluZm8gLSB0aGUgZmlsZSBpbmZvIG9mIHRoZSBwYWdlIHRoYXQgaXMgYmVpbmcgYWN0aXZhdGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBudW1iZXJcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGFmdGVyIHRoZSBkeW5hbWljIHBhZ2VcbiAqIGlzIGxvYWRlZC5cbiAqIEByZXR1cm5zIE5vdGhpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEFjdGl2YXRlUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBjb2RlOiBudW1iZXIsIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgeyBEeW5hbWljRnVuYywgZnVsbFBhZ2VVcmwsIGNvZGU6IG5ld0NvZGUgfSA9IGF3YWl0IEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBjb2RlKTtcblxuICAgIGlmICghZnVsbFBhZ2VVcmwgfHwgIUR5bmFtaWNGdW5jICYmIGNvZGUgPT0gNTAwKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2Uuc2VuZFN0YXR1cyhuZXdDb2RlKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cbiAgICAgICAgY29uc3QgcGFnZURhdGEgPSBhd2FpdCBEeW5hbWljRnVuYyhSZXNwb25zZSwgUmVxdWVzdCwgUmVxdWVzdC5ib2R5LCBSZXF1ZXN0LnF1ZXJ5LCBSZXF1ZXN0LmNvb2tpZXMsIFJlcXVlc3Quc2Vzc2lvbiwgUmVxdWVzdC5maWxlcywgU2V0dGluZ3MuRGV2TW9kZSk7XG4gICAgICAgIGZpbmFsU3RlcCgpOyAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICAgICAgYXdhaXQgTWFrZVBhZ2VSZXNwb25zZShcbiAgICAgICAgICAgIHBhZ2VEYXRhLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIHByaW50LmVycm9yKGUpO1xuICAgICAgICBSZXF1ZXN0LmVycm9yID0gZTtcblxuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBHZXRFcnJvclBhZ2UoNTAwLCAnc2VydmVyRXJyb3InKTtcblxuICAgICAgICBEeW5hbWljUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIER5bmFtaWNQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYywgY29kZSA9IDIwMCkge1xuICAgIGNvbnN0IEZpbGVJbmZvID0gYXdhaXQgaXNVUkxQYXRoQUZpbGUoUmVxdWVzdCwgdXJsLCBjb2RlKTtcblxuICAgIGNvbnN0IG1ha2VEZWxldGVBcnJheSA9IG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0KVxuXG4gICAgaWYgKEZpbGVJbmZvKSB7XG4gICAgICAgIFNldHRpbmdzLkNhY2hlRGF5cyAmJiBSZXNwb25zZS5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT1cIiArIChTZXR0aW5ncy5DYWNoZURheXMgKiAyNCAqIDYwICogNjApKTtcbiAgICAgICAgYXdhaXQgR2V0U3RhdGljRmlsZSh1cmwsIFNldHRpbmdzLkRldk1vZGUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0UHJhc2UgPSAoKSA9PiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0LCBSZXNwb25zZSwgY29kZSk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgY29uc3QgaXNBcGkgPSBhd2FpdCBNYWtlQXBpQ2FsbChSZXF1ZXN0LCBSZXNwb25zZSwgdXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBuZXh0UHJhc2UpO1xuICAgIGlmICghaXNBcGkgJiYgIWF3YWl0IEFjdGl2YXRlUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgYXJyYXlUeXBlLCB1cmwsIGNvZGUsIG5leHRQcmFzZSkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpOyAvLyBkZWxldGUgZmlsZXNcbn1cblxuZnVuY3Rpb24gdXJsRml4KHVybDogc3RyaW5nKSB7XG4gICAgaWYgKHVybCA9PSAnLycpIHtcbiAgICAgICAgdXJsID0gJy9pbmRleCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh1cmwpO1xufVxuXG5leHBvcnQge1xuICAgIFNldHRpbmdzLFxuICAgIER5bmFtaWNQYWdlLFxuICAgIExvYWRBbGxQYWdlc1RvUmFtLFxuICAgIENsZWFyQWxsUGFnZXNGcm9tUmFtLFxuICAgIHVybEZpeCxcbiAgICBHZXRFcnJvclBhZ2Vcbn0iLCAiaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgKiBhcyBCdWlsZFNlcnZlciBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgY29va2llUGFyc2VyIH0gZnJvbSAnQHRpbnlodHRwL2Nvb2tpZS1wYXJzZXInO1xuaW1wb3J0IGNvb2tpZUVuY3J5cHRlciBmcm9tICdjb29raWUtZW5jcnlwdGVyJztcbmltcG9ydCB7IGFsbG93UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBzZXNzaW9uIGZyb20gJ2V4cHJlc3Mtc2Vzc2lvbic7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBJbnNlcnRNb2RlbHNTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgeyBTdGFydFJlcXVpcmUsIEdldFNldHRpbmdzIH0gZnJvbSAnLi9JbXBvcnRNb2R1bGUnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgY3JlYXRlTmV3UHJpbnRTZXR0aW5ncyB9IGZyb20gJy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgTWVtb3J5U2Vzc2lvbiBmcm9tICdtZW1vcnlzdG9yZSc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBkZWJ1Z1NpdGVNYXAgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2l0ZU1hcCc7XG5pbXBvcnQgeyBzZXR0aW5ncyBhcyBkZWZpbmVTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHtFeHBvcnQgYXMgRXhwb3J0UmFtfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQnXG5cbmNvbnN0XG4gICAgQ29va2llc1NlY3JldCA9IHV1aWR2NCgpLnN1YnN0cmluZygwLCAzMiksXG4gICAgU2Vzc2lvblNlY3JldCA9IHV1aWR2NCgpLFxuICAgIE1lbW9yeVN0b3JlID0gTWVtb3J5U2Vzc2lvbihzZXNzaW9uKSxcblxuICAgIENvb2tpZXNNaWRkbGV3YXJlID0gY29va2llUGFyc2VyKENvb2tpZXNTZWNyZXQpLFxuICAgIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmUgPSBjb29raWVFbmNyeXB0ZXIoQ29va2llc1NlY3JldCwge30pLFxuICAgIENvb2tpZVNldHRpbmdzID0geyBodHRwT25seTogdHJ1ZSwgc2lnbmVkOiB0cnVlLCBtYXhBZ2U6IDg2NDAwMDAwICogMzAgfTtcblxuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZXMgPSA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZUVuY3J5cHRlciA9IDxhbnk+Q29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVTZXR0aW5ncyA9IENvb2tpZVNldHRpbmdzO1xuXG5sZXQgRGV2TW9kZV8gPSB0cnVlLCBjb21waWxhdGlvblNjYW46IFByb21pc2U8KCkgPT4gUHJvbWlzZTx2b2lkPj4sIFNlc3Npb25TdG9yZTtcblxubGV0IGZvcm1pZGFibGVTZXJ2ZXIsIGJvZHlQYXJzZXJTZXJ2ZXI7XG5cbmNvbnN0IHNlcnZlTGltaXRzID0ge1xuICAgIHNlc3Npb25Ub3RhbFJhbU1COiAxNTAsXG4gICAgc2Vzc2lvblRpbWVNaW51dGVzOiA0MCxcbiAgICBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzOiAzMCxcbiAgICBmaWxlTGltaXRNQjogMTAsXG4gICAgcmVxdWVzdExpbWl0TUI6IDRcbn1cblxubGV0IHBhZ2VJblJhbUFjdGl2YXRlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpe1xuICAgIHJldHVybiBwYWdlSW5SYW1BY3RpdmF0ZTtcbn1cblxuY29uc3QgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyA9IFsuLi5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5XTtcbmNvbnN0IGJhc2VWYWxpZFBhdGggPSBbKHBhdGg6IHN0cmluZykgPT4gcGF0aC5zcGxpdCgnLicpLmF0KC0yKSAhPSAnc2VydiddOyAvLyBpZ25vcmluZyBmaWxlcyB0aGF0IGVuZHMgd2l0aCAuc2Vydi4qXG5cbmV4cG9ydCBjb25zdCBFeHBvcnQ6IEV4cG9ydFNldHRpbmdzID0ge1xuICAgIGdldCBzZXR0aW5nc1BhdGgoKSB7XG4gICAgICAgIHJldHVybiB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgXCIvU2V0dGluZ3NcIjtcbiAgICB9LFxuICAgIHNldCBkZXZlbG9wbWVudCh2YWx1ZSkge1xuICAgICAgICBpZihEZXZNb2RlXyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgIERldk1vZGVfID0gdmFsdWU7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uU2NhbiA9IEJ1aWxkU2VydmVyLmNvbXBpbGVBbGwoRXhwb3J0KTtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkRldk1vZGUgPSB2YWx1ZTtcbiAgICAgICAgYWxsb3dQcmludCh2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXQgZGV2ZWxvcG1lbnQoKSB7XG4gICAgICAgIHJldHVybiBEZXZNb2RlXztcbiAgICB9LFxuICAgIG1pZGRsZXdhcmU6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKTogKHJlcTogUmVxdWVzdCwgX3JlczogUmVzcG9uc2U8YW55PiwgbmV4dD86IE5leHRGdW5jdGlvbikgPT4gdm9pZCB7XG4gICAgICAgICAgICByZXR1cm4gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZUVuY3J5cHRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU3RvcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmb3JtaWRhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1pZGFibGVTZXJ2ZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBib2R5UGFyc2VyKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvZHlQYXJzZXJTZXJ2ZXI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlY3JldDoge1xuICAgICAgICBnZXQgY29va2llcygpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzU2VjcmV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU2VjcmV0O1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZ2VuZXJhbDoge1xuICAgICAgICBpbXBvcnRPbkxvYWQ6IFtdLFxuICAgICAgICBzZXQgcGFnZUluUmFtKHZhbHVlKSB7XG4gICAgICAgICAgICBFeHBvcnRSYW0uUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlcGFyYXRpb25zID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgICAgICAgICAgICAgIGF3YWl0IHByZXBhcmF0aW9ucz8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVCeVVybC5Mb2FkQWxsUGFnZXNUb1JhbShFeHBvcnQuZGV2ZWxvcG1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVCeVVybC5DbGVhckFsbFBhZ2VzRnJvbVJhbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBhZ2VJblJhbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBFeHBvcnRSYW0uUGFnZVJhbTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcGlsZToge1xuICAgICAgICBzZXQgY29tcGlsZVN5bnRheCh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29tcGlsZVN5bnRheCgpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4O1xuICAgICAgICB9LFxuICAgICAgICBzZXQgaWdub3JlRXJyb3IodmFsdWUpIHtcbiAgICAgICAgICAgICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlnbm9yZUVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBwbHVnaW5zKHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgcGx1Z2lucygpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZGVmaW5lKCl7XG4gICAgICAgICAgICByZXR1cm4gZGVmaW5lU2V0dGluZ3MuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHNldCBkZWZpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIGRlZmluZVNldHRpbmdzLmRlZmluZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5nOiB7XG4gICAgICAgIHJ1bGVzOiB7fSxcbiAgICAgICAgdXJsU3RvcDogW10sXG4gICAgICAgIHZhbGlkUGF0aDogYmFzZVZhbGlkUGF0aCxcbiAgICAgICAgaWdub3JlVHlwZXM6IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMsXG4gICAgICAgIGlnbm9yZVBhdGhzOiBbXSxcbiAgICAgICAgc2l0ZW1hcDogdHJ1ZSxcbiAgICAgICAgZ2V0IGVycm9yUGFnZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBlcnJvclBhZ2VzKHZhbHVlKSB7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZUxpbWl0czoge1xuICAgICAgICBnZXQgY2FjaGVEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNhY2hlRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVzRXhwaXJlc0RheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVTZXR0aW5ncy5tYXhBZ2UgLyA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNvb2tpZXNFeHBpcmVzRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBDb29raWVTZXR0aW5ncy5tYXhBZ2UgPSB2YWx1ZSAqIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRvdGFsUmFtTUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRvdGFsUmFtTUIoKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25UaW1lTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRpbWVNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZmlsZUxpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmaWxlTGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHJlcXVlc3RMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICAgICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCByZXF1ZXN0TGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmU6IHtcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgaHR0cDI6IGZhbHNlLFxuICAgICAgICBncmVlbkxvY2s6IHtcbiAgICAgICAgICAgIHN0YWdpbmc6IG51bGwsXG4gICAgICAgICAgICBjbHVzdGVyOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICBhZ2VudDogbnVsbCxcbiAgICAgICAgICAgIGFncmVlVG9UZXJtczogZmFsc2UsXG4gICAgICAgICAgICBzaXRlczogW11cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybWlkYWJsZSgpIHtcbiAgICBmb3JtaWRhYmxlU2VydmVyID0ge1xuICAgICAgICBtYXhGaWxlU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLmZpbGVMaW1pdE1CICogMTA0ODU3NixcbiAgICAgICAgdXBsb2FkRGlyOiBTeXN0ZW1EYXRhICsgXCIvVXBsb2FkRmlsZXMvXCIsXG4gICAgICAgIG11bHRpcGxlczogdHJ1ZSxcbiAgICAgICAgbWF4RmllbGRzU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICogMTA0ODU3NlxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJvZHlQYXJzZXIoKSB7XG4gICAgYm9keVBhcnNlclNlcnZlciA9ICg8YW55PmJvZHlQYXJzZXIpLmpzb24oeyBsaW1pdDogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICsgJ21iJyB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZXNzaW9uKCkge1xuICAgIGlmICghRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyB8fCAhRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CKSB7XG4gICAgICAgIFNlc3Npb25TdG9yZSA9IChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2Vzc2lvblN0b3JlID0gc2Vzc2lvbih7XG4gICAgICAgIGNvb2tpZTogeyBtYXhBZ2U6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgKiA2MCAqIDEwMDAsIHNhbWVTaXRlOiB0cnVlIH0sXG4gICAgICAgIHNlY3JldDogU2Vzc2lvblNlY3JldCxcbiAgICAgICAgcmVzYXZlOiBmYWxzZSxcbiAgICAgICAgc2F2ZVVuaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzdG9yZTogbmV3IE1lbW9yeVN0b3JlKHtcbiAgICAgICAgICAgIGNoZWNrUGVyaW9kOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgIG1heDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CICogMTA0ODU3NlxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb3B5SlNPTih0bzogYW55LCBqc29uOiBhbnksIHJ1bGVzOiBzdHJpbmdbXSA9IFtdLCBydWxlc1R5cGU6ICdpZ25vcmUnIHwgJ29ubHknID0gJ2lnbm9yZScpIHtcbiAgICBpZighanNvbikgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBoYXNJbXBsZWF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGkgaW4ganNvbikge1xuICAgICAgICBjb25zdCBpbmNsdWRlID0gcnVsZXMuaW5jbHVkZXMoaSk7XG4gICAgICAgIGlmIChydWxlc1R5cGUgPT0gJ29ubHknICYmIGluY2x1ZGUgfHwgcnVsZXNUeXBlID09ICdpZ25vcmUnICYmICFpbmNsdWRlKSB7XG4gICAgICAgICAgICBoYXNJbXBsZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdG9baV0gPSBqc29uW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNJbXBsZWF0ZWQ7XG59XG5cbi8vIHJlYWQgdGhlIHNldHRpbmdzIG9mIHRoZSB3ZWJzaXRlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IFNldHRpbmdzOiBFeHBvcnRTZXR0aW5ncyA9IGF3YWl0IEdldFNldHRpbmdzKEV4cG9ydC5zZXR0aW5nc1BhdGgsIERldk1vZGVfKTtcbiAgICBpZihTZXR0aW5ncyA9PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxEZXYpO1xuXG4gICAgZWxzZVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsUHJvZCk7XG5cblxuICAgIGNvcHlKU09OKEV4cG9ydC5jb21waWxlLCBTZXR0aW5ncy5jb21waWxlKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5yb3V0aW5nLCBTZXR0aW5ncy5yb3V0aW5nLCBbJ2lnbm9yZVR5cGVzJywgJ3ZhbGlkUGF0aCddKTtcblxuICAgIC8vY29uY2F0IGRlZmF1bHQgdmFsdWVzIG9mIHJvdXRpbmdcbiAgICBjb25zdCBjb25jYXRBcnJheSA9IChuYW1lOiBzdHJpbmcsIGFycmF5OiBhbnlbXSkgPT4gU2V0dGluZ3Mucm91dGluZz8uW25hbWVdICYmIChFeHBvcnQucm91dGluZ1tuYW1lXSA9IFNldHRpbmdzLnJvdXRpbmdbbmFtZV0uY29uY2F0KGFycmF5KSk7XG5cbiAgICBjb25jYXRBcnJheSgnaWdub3JlVHlwZXMnLCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzKTtcbiAgICBjb25jYXRBcnJheSgndmFsaWRQYXRoJywgYmFzZVZhbGlkUGF0aCk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2NhY2hlRGF5cycsICdjb29raWVzRXhwaXJlc0RheXMnXSwgJ29ubHknKTtcblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnc2Vzc2lvblRvdGFsUmFtTUInLCAnc2Vzc2lvblRpbWVNaW51dGVzJywgJ3Nlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMnXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2ZpbGVMaW1pdE1CJywgJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuICAgIH1cblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZSwgU2V0dGluZ3Muc2VydmUpO1xuXG4gICAgLyogLS0tIHByb2JsZW1hdGljIHVwZGF0ZXMgLS0tICovXG4gICAgRXhwb3J0LmRldmVsb3BtZW50ID0gU2V0dGluZ3MuZGV2ZWxvcG1lbnRcblxuICAgIGlmIChTZXR0aW5ncy5nZW5lcmFsPy5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgRXhwb3J0LmdlbmVyYWwuaW1wb3J0T25Mb2FkID0gPGFueT5hd2FpdCBTdGFydFJlcXVpcmUoPGFueT5TZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCwgRGV2TW9kZV8pO1xuICAgIH1cblxuICAgIC8vbmVlZCB0byBkb3duIGxhc3RlZCBzbyBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aCAnaW1wb3J0T25Mb2FkJ1xuICAgIGlmICghY29weUpTT04oRXhwb3J0LmdlbmVyYWwsIFNldHRpbmdzLmdlbmVyYWwsIFsncGFnZUluUmFtJ10sICdvbmx5JykgJiYgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgfVxuXG4gICAgaWYoRXhwb3J0LmRldmVsb3BtZW50ICYmIEV4cG9ydC5yb3V0aW5nLnNpdGVtYXApeyAvLyBvbiBwcm9kdWN0aW9uIHRoaXMgd2lsbCBiZSBjaGVja2VkIGFmdGVyIGNyZWF0aW5nIHN0YXRlXG4gICAgICAgIGRlYnVnU2l0ZU1hcChFeHBvcnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlyc3RMb2FkKCkge1xuICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIGJ1aWxkQm9keVBhcnNlcigpO1xufSIsICJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMic7XG5pbXBvcnQgKiBhcyBjcmVhdGVDZXJ0IGZyb20gJ3NlbGZzaWduZWQnO1xuaW1wb3J0ICogYXMgR3JlZW5sb2NrIGZyb20gJ2dyZWVubG9jay1leHByZXNzJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGVsZXRlSW5EaXJlY3RvcnksIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBHcmVlbkxvY2tTaXRlIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgZm9sZGVyIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2VzXG4gKiBleGlzdCwgdXBkYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZvbGRlciB0byBjcmVhdGUuXG4gKiBAcGFyYW0gQ3JlYXRlSW5Ob3RFeGl0cyAtIHtcbiAqL1xuYXN5bmMgZnVuY3Rpb24gVG91Y2hTeXN0ZW1Gb2xkZXIoZm9OYW1lOiBzdHJpbmcsIENyZWF0ZUluTm90RXhpdHM6IHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGV4aXRzPzogYW55fSkge1xuICAgIGxldCBzYXZlUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyBcIi9TeXN0ZW1TYXZlL1wiO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgc2F2ZVBhdGggKz0gZm9OYW1lO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgaWYgKENyZWF0ZUluTm90RXhpdHMpIHtcbiAgICAgICAgc2F2ZVBhdGggKz0gJy8nO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHNhdmVQYXRoICsgQ3JlYXRlSW5Ob3RFeGl0cy5uYW1lO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBDcmVhdGVJbk5vdEV4aXRzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBhd2FpdCBDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKSwgZmlsZVBhdGgsIHNhdmVQYXRoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSXQgZ2VuZXJhdGVzIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgYW5kIHN0b3JlcyBpdCBpbiBhIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgY2VydGlmaWNhdGUgYW5kIGtleSBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldERlbW9DZXJ0aWZpY2F0ZSgpIHtcbiAgICBsZXQgQ2VydGlmaWNhdGU6IGFueTtcbiAgICBjb25zdCBDZXJ0aWZpY2F0ZVBhdGggPSBTeXN0ZW1EYXRhICsgJy9DZXJ0aWZpY2F0ZS5qc29uJztcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShDZXJ0aWZpY2F0ZVBhdGgpKSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gRWFzeUZzLnJlYWRKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUNlcnQuZ2VuZXJhdGUobnVsbCwgeyBkYXlzOiAzNjUwMCB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5cy5wcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgsIENlcnRpZmljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIENlcnRpZmljYXRlO1xufVxuXG5mdW5jdGlvbiBEZWZhdWx0TGlzdGVuKGFwcCkge1xuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5hdHRhY2gpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgbGlzdGVuKHBvcnQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCA8YW55PnJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIGdyZWVubG9jaywgaXQgd2lsbCBjcmVhdGUgYSBzZXJ2ZXIgdGhhdCB3aWxsIHNlcnZlIHlvdXIgYXBwIG92ZXIgaHR0cHNcbiAqIEBwYXJhbSBhcHAgLSBUaGUgdGlueUh0dHAgYXBwbGljYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdGhlIHNlcnZlciBtZXRob2RzXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFVwZGF0ZUdyZWVuTG9jayhhcHApIHtcblxuICAgIGlmICghKFNldHRpbmdzLnNlcnZlLmh0dHAyIHx8IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jaz8uYWdyZWVUb1Rlcm1zKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgRGVmYXVsdExpc3RlbihhcHApO1xuICAgIH1cblxuICAgIGlmICghU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFncmVlVG9UZXJtcykge1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwMi5jcmVhdGVTZWN1cmVTZXJ2ZXIoeyAuLi5hd2FpdCBHZXREZW1vQ2VydGlmaWNhdGUoKSwgYWxsb3dIVFRQMTogdHJ1ZSB9LCBhcHAuYXR0YWNoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuKHBvcnQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBUb3VjaFN5c3RlbUZvbGRlcihcImdyZWVubG9ja1wiLCB7XG4gICAgICAgIG5hbWU6IFwiY29uZmlnLmpzb25cIiwgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpdGVzOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXNcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGV4aXRzKGZpbGUsIF8sIGZvbGRlcikge1xuICAgICAgICAgICAgZmlsZSA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmlsZS5zaXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBmaWxlLnNpdGVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiA8R3JlZW5Mb2NrU2l0ZVtdPiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuc3ViamVjdCA9PSBlLnN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuYWx0bmFtZXMubGVuZ3RoICE9IGUuYWx0bmFtZXMubGVuZ3RoIHx8IGIuYWx0bmFtZXMuc29tZSh2ID0+IGUuYWx0bmFtZXMuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5hbHRuYW1lcyA9IGIuYWx0bmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUucmVuZXdBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGF2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnNpdGVzLnNwbGljZShpLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGZvbGRlciArIFwibGl2ZS9cIiArIGUuc3ViamVjdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NpdGVzID0gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzLmZpbHRlcigoeCkgPT4gIWZpbGUuc2l0ZXMuZmluZChiID0+IGIuc3ViamVjdCA9PSB4LnN1YmplY3QpKTtcblxuICAgICAgICAgICAgZmlsZS5zaXRlcy5wdXNoKC4uLm5ld1NpdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUod29ya2luZ0RpcmVjdG9yeSArIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgZ3JlZW5sb2NrT2JqZWN0OmFueSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBHcmVlbmxvY2suaW5pdCh7XG4gICAgICAgIHBhY2thZ2VSb290OiB3b3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBjb25maWdEaXI6IFwiU3lzdGVtU2F2ZS9ncmVlbmxvY2tcIixcbiAgICAgICAgcGFja2FnZUFnZW50OiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdlbnQgfHwgcGFja2FnZUluZm8ubmFtZSArICcvJyArIHBhY2thZ2VJbmZvLnZlcnNpb24sXG4gICAgICAgIG1haW50YWluZXJFbWFpbDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmVtYWlsLFxuICAgICAgICBjbHVzdGVyOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suY2x1c3RlcixcbiAgICAgICAgc3RhZ2luZzogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnN0YWdpbmdcbiAgICB9KS5yZWFkeShyZXMpKTtcblxuICAgIGZ1bmN0aW9uIENyZWF0ZVNlcnZlcih0eXBlLCBmdW5jLCBvcHRpb25zPykge1xuICAgICAgICBsZXQgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4geyB9O1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3RbdHlwZV0ob3B0aW9ucywgZnVuYyk7XG4gICAgICAgIGNvbnN0IGxpc3RlbiA9IChwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwU2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0Lmh0dHBTZXJ2ZXIoKTtcbiAgICAgICAgICAgIENsb3NlaHR0cFNlcnZlciA9ICgpID0+IGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UocmVzID0+IHNlcnZlci5saXN0ZW4oNDQzLCBcIjAuMC4wLjBcIiwgcmVzKSksIG5ldyBQcm9taXNlKHJlcyA9PiBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBcIjAuMC4wLjBcIiwgcmVzKSldKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHNlcnZlci5jbG9zZSgpOyBDbG9zZWh0dHBTZXJ2ZXIoKTsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3RlbixcbiAgICAgICAgICAgIGNsb3NlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cDJTZXJ2ZXInLCBhcHAuYXR0YWNoLCB7IGFsbG93SFRUUDE6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cHNTZXJ2ZXInLCBhcHAuYXR0YWNoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHNlcnZlciwge1NldHRpbmdzfSAgZnJvbSAnLi9NYWluQnVpbGQvU2VydmVyJztcbmltcG9ydCBhc3luY1JlcXVpcmUgZnJvbSAnLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHtnZXRUeXBlc30gZnJvbSAnLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gJy4vR2xvYmFsL1NlYXJjaFJlY29yZCc7XG5leHBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vTWFpbkJ1aWxkL1R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEFzeW5jSW1wb3J0ID0gKHBhdGg6c3RyaW5nLCBpbXBvcnRGcm9tID0gJ2FzeW5jIGltcG9ydCcpID0+IGFzeW5jUmVxdWlyZShbaW1wb3J0RnJvbV0sIHBhdGgsIGdldFR5cGVzLlN0YXRpYywge2lzRGVidWc6IFNldHRpbmdzLmRldmVsb3BtZW50fSk7XG5leHBvcnQge1NldHRpbmdzLCBTZWFyY2hSZWNvcmR9O1xuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTs7O0FDRkE7OztBQ0FBLElBQUksWUFBWTtBQUVULG9CQUFvQixHQUFZO0FBQ25DLGNBQVk7QUFDaEI7QUFFTyxJQUFNLFFBQVEsSUFBSSxNQUFNLFNBQVE7QUFBQSxFQUNuQyxJQUFJLFFBQVEsTUFBTSxVQUFVO0FBQ3hCLFFBQUcsUUFBUTtBQUNQLGFBQU8sT0FBTztBQUVsQixRQUFHLGFBQWEsUUFBUTtBQUNwQixhQUFPLE9BQU87QUFDbEIsV0FBTyxNQUFNO0FBQUEsSUFBQztBQUFBLEVBQ2xCO0FB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
