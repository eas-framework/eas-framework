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
        build2.Plus(i.text.trimEnd());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi93YXNtLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2Vzc2lvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvZXJyb3IudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd24udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaGVhZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3R5bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0NvbXBpbGVTdGF0ZS50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NpdGVNYXAudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GaWxlVHlwZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ltcG9ydEZpbGVSdW50aW1lLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQXBpQ2FsbC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0dldFBhZ2VzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvU2V0dGluZ3MudHMiLCAiLi4vc3JjL01haW5CdWlsZC9MaXN0ZW5HcmVlbkxvY2sudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBcHAgYXMgVGlueUFwcCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL1R5cGVzJztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5ncywgcmVxdWlyZVNldHRpbmdzLCBidWlsZEZpcnN0TG9hZCwgcGFnZUluUmFtQWN0aXZhdGVGdW5jfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBmb3JtaWRhYmxlIGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgVXBkYXRlR3JlZW5Mb2NrIH0gZnJvbSAnLi9MaXN0ZW5HcmVlbkxvY2snO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IGNoYW5nZVVSTFJ1bGVzKHJlcSwgcmVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hhbmdlVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgbGV0IHVybCA9IGZpbGVCeVVybC51cmxGaXgocmVxLnBhdGgpO1xuXG4gICAgXG4gICAgZm9yIChsZXQgaSBvZiBTZXR0aW5ncy5yb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpKSB7XG4gICAgICAgICAgICBpZiAoaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuc3Vic3RyaW5nKDAsIGkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSdWxlSW5kZXggPSBPYmplY3Qua2V5cyhTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzKS5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpO1xuXG4gICAgaWYgKFJ1bGVJbmRleCkge1xuICAgICAgICB1cmwgPSBhd2FpdCBTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzW1J1bGVJbmRleF0odXJsLCByZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgdXJsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZXJVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHVybDogc3RyaW5nKSB7XG4gICAgbGV0IG5vdFZhbGlkOiBhbnkgPSBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSkgfHwgU2V0dGluZ3Mucm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGkgPT4gdXJsLmVuZHNXaXRoKCcuJytpKSk7XG4gICAgXG4gICAgaWYoIW5vdFZhbGlkKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWxpZCBvZiBTZXR0aW5ncy5yb3V0aW5nLnZhbGlkUGF0aCl7IC8vIGNoZWNrIGlmIHVybCBpc24ndCB2YWxpZFxuICAgICAgICAgICAgaWYoIWF3YWl0IHZhbGlkKHVybCwgcmVxLCByZXMpKXtcbiAgICAgICAgICAgICAgICBub3RWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm90VmFsaWQpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gZmlsZUJ5VXJsLkdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCB1cmwuc3Vic3RyaW5nKDEpKTtcbn1cblxubGV0IGFwcE9ubGluZVxuXG4vKipcbiAqIEl0IHN0YXJ0cyB0aGUgc2VydmVyIGFuZCB0aGVuIGNhbGxzIFN0YXJ0TGlzdGluZ1xuICogQHBhcmFtIFtTZXJ2ZXJdIC0gVGhlIHNlcnZlciBvYmplY3QgdGhhdCBpcyBwYXNzZWQgaW4gYnkgdGhlIGNhbGxlci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gU3RhcnRBcHAoU2VydmVyPykge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBUaW55QXBwKCk7XG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICBhcHAudXNlKDxhbnk+Y29tcHJlc3Npb24oKSk7XG4gICAgfVxuICAgIGZpbGVCeVVybC5TZXR0aW5ncy5TZXNzaW9uU3RvcmUgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IFNldHRpbmdzLm1pZGRsZXdhcmUuc2Vzc2lvbihyZXEsIHJlcywgbmV4dCk7XG5cbiAgICBjb25zdCBPcGVuTGlzdGluZyA9IGF3YWl0IFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgU2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgYXdhaXQgZnVuYyhhcHAsIGFwcE9ubGluZS5zZXJ2ZXIsIFNldHRpbmdzKTtcbiAgICB9XG4gICAgYXdhaXQgcGFnZUluUmFtQWN0aXZhdGVGdW5jKCk/LigpXG5cbiAgICBhcHAuYWxsKFwiKlwiLCBQYXJzZVJlcXVlc3QpO1xuXG4gICAgYXdhaXQgT3Blbkxpc3RpbmcoU2V0dGluZ3Muc2VydmUucG9ydCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcCBsaXN0aW5nIGF0IHBvcnQ6IFwiICsgU2V0dGluZ3Muc2VydmUucG9ydCk7XG59XG5cbi8qKlxuICogSWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIHJlcXVlc3QsIHRoZW4gcGFyc2UgdGhlIHJlcXVlc3QgYm9keSwgdGhlbiBzZW5kIGl0IHRvIHJvdXRpbmcgc2V0dGluZ3NcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC0gVGhlIGluY29taW5nIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLSBSZXNwb25zZVxuICovXG5hc3luYyBmdW5jdGlvbiBQYXJzZVJlcXVlc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT0gJ1BPU1QnKSB7XG4gICAgICAgIGlmIChyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10/LnN0YXJ0c1dpdGg/LignYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICBTZXR0aW5ncy5taWRkbGV3YXJlLmJvZHlQYXJzZXIocmVxLCByZXMsICgpID0+IHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKFNldHRpbmdzLm1pZGRsZXdhcmUuZm9ybWlkYWJsZSkucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpIHtcbiAgICBpZiAoYXBwT25saW5lICYmIGFwcE9ubGluZS5jbG9zZSkge1xuICAgICAgICBhd2FpdCBhcHBPbmxpbmUuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcnZlciwgbGlzdGVuLCBjbG9zZSB9ID0gYXdhaXQgU2VydmVyKGFwcCk7XG5cbiAgICBhcHBPbmxpbmUgPSB7IHNlcnZlciwgY2xvc2UgfTtcblxuICAgIHJldHVybiBsaXN0ZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0U2VydmVyKHsgU2l0ZVBhdGggPSAnLi8nLCBIdHRwU2VydmVyID0gVXBkYXRlR3JlZW5Mb2NrIH0gPSB7fSkge1xuICAgIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciA9IFNpdGVQYXRoO1xuICAgIGJ1aWxkRmlyc3RMb2FkKCk7XG4gICAgYXdhaXQgcmVxdWlyZVNldHRpbmdzKCk7XG4gICAgU3RhcnRBcHAoSHR0cFNlcnZlcik7XG59XG5cbmV4cG9ydCB7IFNldHRpbmdzIH07IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcm9wID09ICdpbXBvcnRhbnQnKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5lcnJvcjtcbiAgICAgICAgICAgIFxuICAgICAgICBpZihwcmludE1vZGUgJiYgcHJvcCAhPSBcImRvLW5vdGhpbmdcIilcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQge0RpcmVudH0gZnJvbSAnZnMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtjd2R9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gJ3VybCdcbmltcG9ydCB7IEN1dFRoZUxhc3QgLCBTcGxpdEZpcnN0fSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVCeVNtYWxsUGF0aChzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIGdldFR5cGVzW1NwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnNoaWZ0KCldO1xufVxuXG5cblxuZXhwb3J0IHtcbiAgICBnZXREaXJuYW1lLFxuICAgIFN5c3RlbURhdGEsXG4gICAgd29ya2luZ0RpcmVjdG9yeSxcbiAgICBnZXRUeXBlcyxcbiAgICBCYXNpY1NldHRpbmdzXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuaW50ZXJmYWNlIGdsb2JhbFN0cmluZzxUPiB7XG4gICAgaW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBsYXN0SW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBzdGFydHNXaXRoKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0Rmlyc3Q8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4odHlwZTogc3RyaW5nLCBzdHJpbmc6IFQpOiBUW10ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YodHlwZSk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpXG4gICAgICAgIHJldHVybiBbc3RyaW5nXTtcblxuICAgIHJldHVybiBbc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCksIHN0cmluZy5zdWJzdHJpbmcoaW5kZXggKyB0eXBlLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3V0VGhlTGFzdCh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVuc2lvbjxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdHJpbmc6IFQpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLy4uL0pTUGFyc2VyJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9TZXNzaW9uJztcblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgPCV7P2RlYnVnX2ZpbGU/fSR7aS50ZXh0fSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVNjcmlwdENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnTGluZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlVGV4dENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlU2NyaXB0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VyLnN0YXJ0ID0gXCI8JVwiO1xuICAgIHBhcnNlci5lbmQgPSBcIiU+XCI7XG4gICAgcmV0dXJuIHBhcnNlci5SZUJ1aWxkVGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnSW5mbyhjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBhd2FpdCBQYXJzZVNjcmlwdENvZGUoY29kZSwgcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBBZGREZWJ1Z0luZm8oaXNvbGF0ZTogYm9vbGVhbiwgcGFnZU5hbWU6c3RyaW5nLCBGdWxsUGF0aDpzdHJpbmcsIFNtYWxsUGF0aDpzdHJpbmcsIGNhY2hlOiB7dmFsdWU/OiBzdHJpbmd9ID0ge30pe1xuICAgIGlmKCFjYWNoZS52YWx1ZSlcbiAgICAgICAgY2FjaGUudmFsdWUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbFBhdGgsICd1dGY4Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGxEYXRhOiBuZXcgU3RyaW5nVHJhY2tlcihgJHtwYWdlTmFtZX08bGluZT4ke1NtYWxsUGF0aH1gLCBpc29sYXRlID8gYDwleyU+JHtjYWNoZS52YWx1ZX08JX0lPmA6IGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkgPSB0aGlzLkRhdGFBcnJheS5jb25jYXQoZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcsIGluZm8gPSAnJykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheSA9IG5ld1N0cmluZy5EYXRhQXJyYXkuY29uY2F0KHRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgdGhpc1N1YnN0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzU3Vic3RyaW5nLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXNTdWJzdHJpbmcgPSB0aGlzU3Vic3RyaW5nLkN1dFN0cmluZyhpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IGVycm9yIGluZm8gZm9ybSBlcnJvciBtZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIGRlYnVnTGluZSh7IG1lc3NhZ2UsIHRleHQsIGxvY2F0aW9uLCBsaW5lLCBjb2x9OiB7IG1lc3NhZ2U/OiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcsIGxvY2F0aW9uPzogeyBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBsaW5lVGV4dD86IHN0cmluZyB9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXJ9KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSA/PyBsb2NhdGlvbj8ubGluZSA/PyAxKSwgY29sdW1uID0gY29sID8/IGxvY2F0aW9uPy5jb2x1bW4gPz8gMDtcbiAgICAgICAgaWYgKHNlYXJjaExpbmUuc3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgICAgICAgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZSgobGluZSA/PyBsb2NhdGlvbj8ubGluZSkgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHNlYXJjaExpbmUuYXQoY29sdW1uLTEpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgcmV0dXJuIGAke3RleHQgfHwgbWVzc2FnZX0sIG9uIGZpbGUgLT5cXG4ke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoK3NlYXJjaExpbmUuZXh0cmFjdEluZm8oKX06JHtkYXRhLmxpbmV9OiR7ZGF0YS5jaGFyfSR7bG9jYXRpb24/LmxpbmVUZXh0ID8gJ1xcbkxpbmU6IFwiJyArIGxvY2F0aW9uLmxpbmVUZXh0LnRyaW0oKSArICdcIic6ICcnfWA7XG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1dpdGhUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBvdXRwdXRXaXRoTWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24pXG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1RhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uLCBodHRwU291cmNlLCByZWxhdGl2ZSlcbiAgICB9XG59IiwgImltcG9ydCB7cHJvbWlzZXN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuY29uc3QgbG9hZFBhdGggPSB0eXBlb2YgZXNidWlsZCAhPT0gJ3VuZGVmaW5lZCcgPyAnLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC8nOiAnLy4uLyc7XG5jb25zdCB3YXNtTW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShhd2FpdCBwcm9taXNlcy5yZWFkRmlsZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCArIGxvYWRQYXRoICsgJ2J1aWxkLndhc20nKSkpO1xuY29uc3Qgd2FzbUluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKHdhc21Nb2R1bGUsIHt9KTtcbmNvbnN0IHdhc20gPSB3YXNtSW5zdGFuY2UuZXhwb3J0cztcblxubGV0IFdBU01fVkVDVE9SX0xFTiA9IDA7XG5cbmxldCBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRVaW50OE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0VWludDhNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0VWludDhNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0VWludDhNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dEVuY29kZXIgPSB0eXBlb2YgVGV4dEVuY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHRFbmNvZGVyIDogVGV4dEVuY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBsVGV4dEVuY29kZXIoJ3V0Zi04Jyk7XG5cbmNvbnN0IGVuY29kZVN0cmluZyA9ICh0eXBlb2YgY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvKGFyZywgdmlldyk7XG59XG4gICAgOiBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgdmlldy5zZXQoYnVmKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZWFkOiBhcmcubGVuZ3RoLFxuICAgICAgICB3cml0dGVuOiBidWYubGVuZ3RoXG4gICAgfTtcbn0pO1xuXG5mdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykge1xuXG4gICAgaWYgKHJlYWxsb2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICAgICAgY29uc3QgcHRyID0gbWFsbG9jKGJ1Zi5sZW5ndGgpO1xuICAgICAgICBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGJ1Zi5sZW5ndGgpLnNldChidWYpO1xuICAgICAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBidWYubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGxldCBsZW4gPSBhcmcubGVuZ3RoO1xuICAgIGxldCBwdHIgPSBtYWxsb2MobGVuKTtcblxuICAgIGNvbnN0IG1lbSA9IGdldFVpbnQ4TWVtb3J5MCgpO1xuXG4gICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICBmb3IgKDsgb2Zmc2V0IDwgbGVuOyBvZmZzZXQrKykge1xuICAgICAgICBjb25zdCBjb2RlID0gYXJnLmNoYXJDb2RlQXQob2Zmc2V0KTtcbiAgICAgICAgaWYgKGNvZGUgPiAweDdGKSBicmVhaztcbiAgICAgICAgbWVtW3B0ciArIG9mZnNldF0gPSBjb2RlO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXQgIT09IGxlbikge1xuICAgICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2Uob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBwdHIgPSByZWFsbG9jKHB0ciwgbGVuLCBsZW4gPSBvZmZzZXQgKyBhcmcubGVuZ3RoICogMyk7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7XG4gICAgICAgIGNvbnN0IHJldCA9IGVuY29kZVN0cmluZyhhcmcsIHZpZXcpO1xuXG4gICAgICAgIG9mZnNldCArPSByZXQud3JpdHRlbjtcbiAgICB9XG5cbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBvZmZzZXQ7XG4gICAgcmV0dXJuIHB0cjtcbn1cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0odGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfY2xvc2VfY2hhcih0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5sZXQgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0SW50MzJNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldEludDMyTWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldEludDMyTWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldEludDMyTWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHREZWNvZGVyID0gdHlwZW9mIFRleHREZWNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RGVjb2RlciA6IFRleHREZWNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dERlY29kZXIgPSBuZXcgbFRleHREZWNvZGVyKCd1dGYtOCcsIHsgaWdub3JlQk9NOiB0cnVlLCBmYXRhbDogdHJ1ZSB9KTtcblxuY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7XG5cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cbi8qKlxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfZXJyb3JzKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB3YXNtLmdldF9lcnJvcnMocmV0cHRyKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBibG9ja1xuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9ibG9jayh0ZXh0LCBibG9jaykge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoYmxvY2ssIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2VuZF9ibG9jayhwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHNraXBfc3BlY2lhbF90YWdcbiogQHBhcmFtIHtzdHJpbmd9IHNpbXBsZV9za2lwXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydF9jb21wb25lbnQoc2tpcF9zcGVjaWFsX3RhZywgc2ltcGxlX3NraXApIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHNraXBfc3BlY2lhbF90YWcsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNpbXBsZV9za2lwLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgd2FzbS5pbnNlcnRfY29tcG9uZW50KHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGVuZF90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBlbmRfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoZW5kX3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2VuZF9vZl9kZWYocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBxX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2VuZF9vZl9xKHB0cjAsIGxlbjAsIHFfdHlwZS5jb2RlUG9pbnRBdCgwKSk7XG4gICAgcmV0dXJuIHJldCA+Pj4gMDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHJhem9yX3RvX2Vqcyh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5yYXpvcl90b19lanMocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHJhem9yX3RvX2Vqc19taW4odGV4dCwgbmFtZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAobmFtZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5yYXpvcl90b19lanNfbWluKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gc3RhcnRcbiogQHBhcmFtIHtzdHJpbmd9IGVuZFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBlanNfcGFyc2UodGV4dCwgc3RhcnQsIGVuZCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc3RhcnQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIyID0gcGFzc1N0cmluZ1RvV2FzbTAoZW5kLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4yID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLmVqc19wYXJzZShyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEsIHB0cjIsIGxlbjIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcGFnZV9iYXNlX3BhcnNlcih0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5wYWdlX2Jhc2VfcGFyc2VyKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBodG1sX2F0dHJfcGFyc2VyKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLmh0bWxfYXR0cl9wYXJzZXIocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBjb25zdCBTaW1wbGVTa2lwID0gWyd0ZXh0YXJlYScsJ3NjcmlwdCcsICdzdHlsZSddO1xuZXhwb3J0IGNvbnN0IFNraXBTcGVjaWFsVGFnID0gW1tcIiVcIiwgXCIlXCJdLCBbXCIje2RlYnVnfVwiLCBcIntkZWJ1Z30jXCJdXTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgZmluZF9lbmRfb2ZfZGVmLCBmaW5kX2VuZF9vZl9xLCBmaW5kX2VuZF9ibG9jayB9IGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyc7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMnO1xuaW1wb3J0IHsgZ2V0RGlybmFtZSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuZXhwb3J0IGNvbnN0IHBvb2wgPSB3b3JrZXJQb29sLnBvb2woU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50L3dvcmtlckluc2VydENvbXBvbmVudC5qcycsIHsgbWF4V29ya2VyczogY3B1TGVuZ3RoIH0pO1xuXG5leHBvcnQgY2xhc3MgQmFzZVJlYWRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZW5kIG9mIHF1b3RhdGlvbiBtYXJrcywgc2tpcHBpbmcgdGhpbmdzIGxpa2UgZXNjYXBpbmc6IFwiXFxcXFwiXCJcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVudE9mUSh0ZXh0OiBzdHJpbmcsIHFUeXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShFbmRUeXBlKSkge1xuICAgICAgICAgICAgRW5kVHlwZSA9IFtFbmRUeXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgSlNPTi5zdHJpbmdpZnkoRW5kVHlwZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhbWUgYXMgJ2ZpbmRFbmRPZkRlZicgb25seSB3aXRoIG9wdGlvbiB0byBjdXN0b20gJ29wZW4nIGFuZCAnY2xvc2UnXG4gICAgICogYGBganNcbiAgICAgKiBGaW5kRW5kT2ZCbG9jayhgY29vbCBcIn1cIiB7IGRhdGEgfSB9IG5leHRgLCAneycsICd9JylcbiAgICAgKiBgYGBcbiAgICAgKiBpdCB3aWxsIHJldHVybiB0aGUgMTggLT4gXCJ9IG5leHRcIlxuICAgICAqICBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgRmluZEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCBvcGVuOiBzdHJpbmcsIGVuZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX2Jsb2NrKHRleHQsIG9wZW4gKyBlbmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIFNpbXBsZVNraXA6IHN0cmluZ1tdID0gU2V0dGluZ3MuU2ltcGxlU2tpcDtcbiAgICBTa2lwU3BlY2lhbFRhZzogc3RyaW5nW11bXSA9IFNldHRpbmdzLlNraXBTcGVjaWFsVGFnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmludE5ldz86IGFueSkgeyB9XG5cbiAgICBwcml2YXRlIHByaW50RXJyb3JzKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGVycm9yczogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmludE5ldykgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBKU09OLnBhcnNlKGVycm9ycykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50TmV3KHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke2kudHlwZV9uYW1lfVwiLCB1c2VkIGluOiAke3RleHQuYXQoTnVtYmVyKGkuaW5kZXgpKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFyKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhcicsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhckhUTUwodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFySFRNTCcsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG59XG5cbnR5cGUgUGFyc2VCbG9ja3MgPSB7IG5hbWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfVtdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTKHRleHQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlMnLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlNNaW5pKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXJbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKU01pbmknLCBbdGV4dCxmaW5kXSkpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFSlNQYXJzZXIodGV4dDogc3RyaW5nLCBzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ0VKU1BhcnNlcicsIFt0ZXh0LCBzdGFydCwgZW5kXSkpO1xufSIsICJcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cbmludGVyZmFjZSBTcGxpdFRleHQge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICB0eXBlX25hbWU6IHN0cmluZyxcbiAgICBpc19za2lwOiBib29sZWFuXG59XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmNvbnN0IHBhcnNlX3N0cmVhbSA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9yZWFkZXIvd29ya2VyLmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQYXJzZVRleHRTdHJlYW0odGV4dDogc3RyaW5nKTogUHJvbWlzZTxTcGxpdFRleHRbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdidWlsZF9zdHJlYW0nLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mRGVmU2tpcEJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2ZpbmRfZW5kX29mX2RlZl9za2lwX2Jsb2NrJywgW3RleHQsIEpTT04uc3RyaW5naWZ5KHR5cGVzKV0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdlbmRfb2ZfYmxvY2snLCBbdGV4dCwgdHlwZXMuam9pbignJyldKTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgQmFzZUVudGl0eUNvZGUge1xuICAgIFJlcGxhY2VBbGwodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZykge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0ZXh0LnNwbGl0KGZpbmQpKSB7XG4gICAgICAgICAgICBuZXdUZXh0ICs9IHJlcGxhY2UgKyBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQuc3Vic3RyaW5nKHJlcGxhY2UubGVuZ3RoKTtcbiAgICB9XG59XG5cblxuYWJzdHJhY3QgY2xhc3MgUmVCdWlsZENvZGVCYXNpYyBleHRlbmRzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBwdWJsaWMgUGFyc2VBcnJheTogU3BsaXRUZXh0W107XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLlBhcnNlQXJyYXkgPSBQYXJzZUFycmF5O1xuICAgIH1cblxuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgbGV0IE91dFN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgT3V0U3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLlJlcGxhY2VBbGwoT3V0U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cblxuXG50eXBlIERhdGFDb2RlSW5mbyA9IHtcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgaW5wdXRzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgY2xhc3MgUmVCdWlsZENvZGVTdHJpbmcgZXh0ZW5kcyBSZUJ1aWxkQ29kZUJhc2ljIHtcbiAgICBwcml2YXRlIERhdGFDb2RlOiBEYXRhQ29kZUluZm87XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcihQYXJzZUFycmF5KTtcbiAgICAgICAgdGhpcy5EYXRhQ29kZSA9IHsgdGV4dDogXCJcIiwgaW5wdXRzOiBbXSB9O1xuICAgICAgICB0aGlzLkNyZWF0ZURhdGFDb2RlKCk7XG4gICAgfVxuXG4gICAgZ2V0IENvZGVCdWlsZFRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLnRleHQ7XG4gICAgfVxuXG4gICAgc2V0IENvZGVCdWlsZFRleHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IEFsbElucHV0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ3JlYXRlRGF0YUNvZGUoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChpLmlzX3NraXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gYDx8JHt0aGlzLkRhdGFDb2RlLmlucHV0cy5sZW5ndGh9fCR7aS50eXBlX25hbWUgPz8gJyd9fD5gO1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUuaW5wdXRzLnB1c2goaS50ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlmIHRoZSA8fHw+IHN0YXJ0IHdpdGggYSAoKy4pIGxpa2UgdGhhdCBmb3IgZXhhbXBsZSwgXCIrLjx8fD5cIiwgdGhlIHVwZGF0ZSBmdW5jdGlvbiB3aWxsIGdldCB0aGUgbGFzdCBcIlNraXBUZXh0XCIgaW5zdGVhZCBnZXR0aW5nIHRoZSBuZXcgb25lXG4gICAgICogc2FtZSB3aXRoIGEgKC0uKSBqdXN0IGZvciBpZ25vcmluZyBjdXJyZW50IHZhbHVlXG4gICAgICogQHJldHVybnMgdGhlIGJ1aWxkZWQgY29kZVxuICAgICAqL1xuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5EYXRhQ29kZS50ZXh0LnJlcGxhY2UoLzxcXHwoWzAtOV0rKVxcfFtcXHddKlxcfD4vZ2ksIChfLCBnMSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzW2cxXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLlJlcGxhY2VBbGwobmV3U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8gfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBFSlNQYXJzZXIgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL3RyYW5zZm9ybS9FYXN5U2NyaXB0JztcblxuaW50ZXJmYWNlIEpTUGFyc2VyVmFsdWVzIHtcbiAgICB0eXBlOiAndGV4dCcgfCAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU1BhcnNlciB7XG4gICAgcHVibGljIHN0YXJ0OiBzdHJpbmc7XG4gICAgcHVibGljIHRleHQ6IFN0cmluZ1RyYWNrZXI7XG4gICAgcHVibGljIGVuZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWVzOiBKU1BhcnNlclZhbHVlc1tdO1xuXG4gICAgY29uc3RydWN0b3IodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBzdGFydCA9IFwiPCVcIiwgZW5kID0gXCIlPlwiLCB0eXBlID0gJ3NjcmlwdCcpIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBSZXBsYWNlVmFsdWVzKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlQWxsKGZpbmQsIHJlcGxhY2UpO1xuICAgIH1cblxuICAgIGZpbmRFbmRPZkRlZkdsb2JhbCh0ZXh0OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGVxID0gdGV4dC5lcVxuICAgICAgICBjb25zdCBmaW5kID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZXEsIFsnOycsICdcXG4nLCB0aGlzLmVuZF0pO1xuICAgICAgICByZXR1cm4gZmluZCAhPSAtMSA/IGZpbmQgKyAxIDogZXEubGVuZ3RoO1xuICAgIH1cblxuICAgIFNjcmlwdFdpdGhJbmZvKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgV2l0aEluZm8gPSBuZXcgU3RyaW5nVHJhY2tlcih0ZXh0LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsU2NyaXB0ID0gdGV4dC5zcGxpdCgnXFxuJyksIGxlbmd0aCA9IGFsbFNjcmlwdC5sZW5ndGg7XG4gICAgICAgIC8vbmV3IGxpbmUgZm9yIGRlYnVnIGFzIG5ldyBsaW5lIHN0YXJ0XG4gICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuXG4gICAgICAgIC8vZmlsZSBuYW1lIGluIGNvbW1lbnRcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNjcmlwdCkge1xuXG4gICAgICAgICAgICBpZihpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlU2FmZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlYnVnXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgXFxucnVuX3NjcmlwdF9uYW1lID0gXFxgJHtKU1BhcnNlci5maXhUZXh0KHN1YnN0cmluZyl9XFxgO2BcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzdWJzdHJpbmcsXG4gICAgICAgICAgICAgICAgdHlwZTogPGFueT50eXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0KHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvYC9naSwgJ1xcXFxgJykucmVwbGFjZSgvXFx1MDAyNC9naSwgJ1xcXFx1MDAyNCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0U2ltcGxlUXVvdGVzKHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpO1xuICAgIH1cblxuICAgIFJlQnVpbGRUZXh0KCkge1xuICAgICAgICBjb25zdCBhbGxjb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaS50eXBlID09ICduby10cmFjaycpIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgJyEnLCBpLnRleHQsIHRoaXMuZW5kKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXModGhpcy5zdGFydCwgaS50ZXh0LCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsY29kZTtcbiAgICB9XG5cbiAgICBCdWlsZEFsbChpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHJ1blNjcmlwdCA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuXG4gICAgICAgIGlmICghdGhpcy52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMkYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRGVidWcgJiYgaS50eXBlID09ICdzY3JpcHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYFxcbnJ1bl9zY3JpcHRfY29kZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmlwdFdpdGhJbmZvKGkudGV4dClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhpLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcmludEVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYDxwIHN0eWxlPVwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcIj4ke0pTUGFyc2VyLmZpeFRleHQobWVzc2FnZSl9PC9wPmA7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIFJ1bkFuZEV4cG9ydCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRleHQsIHBhdGgpXG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLkJ1aWxkQWxsKGlzRGVidWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHNwbGl0MkZyb21FbmQodGV4dDogc3RyaW5nLCBzcGxpdENoYXI6IHN0cmluZywgbnVtVG9TcGxpdEZyb21FbmQgPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0ZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PSBzcGxpdENoYXIpIHtcbiAgICAgICAgICAgICAgICBudW1Ub1NwbGl0RnJvbUVuZC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtVG9TcGxpdEZyb21FbmQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdGV4dC5zdWJzdHJpbmcoMCwgaSksIHRleHQuc3Vic3RyaW5nKGkgKyAxKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RleHRdO1xuICAgIH1cbn1cblxuXG4vL2J1aWxkIHNwZWNpYWwgY2xhc3MgZm9yIHBhcnNlciBjb21tZW50cyAvKiovIHNvIHlvdSBiZSBhYmxlIHRvIGFkZCBSYXpvciBpbnNpZGUgb2Ygc3R5bGUgb3Qgc2NyaXB0IHRhZ1xuXG5pbnRlcmZhY2UgR2xvYmFsUmVwbGFjZUFycmF5IHtcbiAgICB0eXBlOiAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgY2xhc3MgRW5hYmxlR2xvYmFsUmVwbGFjZSB7XG4gICAgcHJpdmF0ZSBzYXZlZEJ1aWxkRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5W10gPSBbXTtcbiAgICBwcml2YXRlIGJ1aWxkQ29kZTogUmVCdWlsZENvZGVTdHJpbmc7XG4gICAgcHJpdmF0ZSBwYXRoOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZXBsYWNlcjogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGRUZXh0ID0gXCJcIikge1xuICAgICAgICB0aGlzLnJlcGxhY2VyID0gUmVnRXhwKGAke2FkZFRleHR9XFxcXC9cXFxcKiFzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PlxcXFwqXFxcXC98c3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5gKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKGNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgICAgICB0aGlzLmJ1aWxkQ29kZSA9IG5ldyBSZUJ1aWxkQ29kZVN0cmluZyhhd2FpdCBQYXJzZVRleHRTdHJlYW0oYXdhaXQgdGhpcy5FeHRyYWN0QW5kU2F2ZUNvZGUoY29kZSkpKTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIEV4dHJhY3RBbmRTYXZlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb2RlID0gbmV3IEpTUGFyc2VyKGNvZGUsIHRoaXMucGF0aCk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb2RlLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgbGV0IG5ld1RleHQgPSBcIlwiO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb2RlLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBuZXdUZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlZEJ1aWxkRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogaS50eXBlLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpLnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBuZXdUZXh0ICs9IGBzeXN0ZW0tLTx8ZWpzfCR7Y291bnRlcisrfXw+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUGFyc2VPdXRzaWRlT2ZDb21tZW50KHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZXIoL3N5c3RlbS0tPFxcfGVqc1xcfChbMC05XSlcXHw+LywgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IFNwbGl0VG9SZXBsYWNlWzFdO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGluZGV4LlN0YXJ0SW5mbykuUGx1cyRgJHt0aGlzLmFkZFRleHR9Lyohc3lzdGVtLS08fGVqc3wke2luZGV4fXw+Ki9gO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgU3RhcnRCdWlsZCgpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvbW1lbnRzID0gbmV3IEpTUGFyc2VyKG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQpLCB0aGlzLnBhdGgsICcvKicsICcqLycpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29tbWVudHMuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvbW1lbnRzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpLnRleHQgPSB0aGlzLlBhcnNlT3V0c2lkZU9mQ29tbWVudChpLnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCA9IGV4dHJhY3RDb21tZW50cy5SZUJ1aWxkVGV4dCgpLmVxO1xuICAgICAgICByZXR1cm4gdGhpcy5idWlsZENvZGUuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZXN0b3JlQXNDb2RlKERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheSkge1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoRGF0YS50ZXh0LlN0YXJ0SW5mbykuUGx1cyRgPCUke0RhdGEudHlwZSA9PSAnbm8tdHJhY2snID8gJyEnOiAnJ30ke0RhdGEudGV4dH0lPmA7XG4gICAgfVxuXG4gICAgcHVibGljIFJlc3RvcmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZXIodGhpcy5yZXBsYWNlciwgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihTcGxpdFRvUmVwbGFjZVsxXSA/PyBTcGxpdFRvUmVwbGFjZVsyXSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLlJlc3RvcmVBc0NvZGUodGhpcy5zYXZlZEJ1aWxkRGF0YVtpbmRleF0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwgImltcG9ydCB7IGJ1aWxkLCBNZXNzYWdlLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuL3ByaW50TWVzc2FnZSc7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeUpTKHRleHQ6IHN0cmluZywgdHJhY2tlcjogU3RyaW5nVHJhY2tlcil7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qge2NvZGUsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybSh0ZXh0LCB7bWluaWZ5OiB0cnVlfSk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0cmFja2VyLCB3YXJuaW5ncyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcih0cmFja2VyLCBlcnIpXG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xufSIsICJpbXBvcnQgeyBidWlsZCwgTWVzc2FnZSwgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludEVycm9yKHtlcnJvcnN9OiB7ZXJyb3JzOiAgTWVzc2FnZVtdfSwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBmb3IoY29uc3QgZXJyIG9mIGVycm9ycyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBgJHtlcnIudGV4dH0sIG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyBlcnIubG9jYXRpb24uZmlsZX06JHtlcnI/LmxvY2F0aW9uPy5saW5lID8/IDB9OiR7ZXJyPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3Qgc291cmNlID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcihlcnIubG9jYXRpb24pO1xuICAgICAgICBpZihzb3VyY2Uuc291cmNlKVxuICAgICAgICAgICAgZXJyLmxvY2F0aW9uID0gPGFueT5zb3VyY2U7XG4gICAgfVxuICAgIEVTQnVpbGRQcmludEVycm9yKHtlcnJvcnN9LCBmaWxlUGF0aCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzOiBNZXNzYWdlW10sIGZpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogd2Fybi5wbHVnaW5OYW1lLFxuICAgICAgICAgICAgdGV4dDogYCR7d2Fybi50ZXh0fSBvbiBmaWxlIC0+ICR7ZmlsZVBhdGggPz8gd2Fybi5sb2NhdGlvbi5maWxlfToke3dhcm4/LmxvY2F0aW9uPy5saW5lID8/IDB9OiR7d2Fybj8ubG9jYXRpb24/LmNvbHVtbiA/PyAwfWBcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihiYXNlOiBTdHJpbmdUcmFja2VyLCB3YXJuaW5nczogTWVzc2FnZVtdKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogd2Fybi5wbHVnaW5OYW1lLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUod2FybilcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIHtlcnJvcnN9OntlcnJvcnM6IE1lc3NhZ2VbXX0pIHtcbiAgICBmb3IoY29uc3QgZXJyIG9mIGVycm9ycyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IGJhc2UuZGVidWdMaW5lKGVycilcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdQcmludCh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgICAgIHJldHVybiBbdHlwZSA9PSAnZXJyb3InID8gJ2ltcG9ydGFudCc6IHR5cGUsICh0ZXh0LnJlcGxhY2UoLzxsaW5lPi9naSwgJyAtPiAnKSArIGBcXG5cXG5FcnJvci1Db2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKV07XG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5jb25zdCBzZXJ2ZVNjcmlwdCA9ICcvc2Vydi90ZW1wLmpzJztcblxuYXN5bmMgZnVuY3Rpb24gdGVtcGxhdGUoQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlOiBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUsIG5hbWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIHBhcmFtczogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3Ike3NlbGVjdG9yID8gYCA9IFwiJHtzZWxlY3Rvcn1cImA6ICcnfSwgb3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9KXtcbiAgICAgICAgY29uc3Qge3dyaXRlLCB3cml0ZVNhZmUsIHNldFJlc3BvbnNlLCBzZW5kVG9TZWxlY3Rvcn0gPSBuZXcgYnVpbGRUZW1wbGF0ZShvdXRfcnVuX3NjcmlwdCk7XG4gICAgICAgICR7YXdhaXQgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlKHBhcnNlKX1cbiAgICAgICAgdmFyIGV4cG9ydHMgPSAke25hbWV9LmV4cG9ydHM7XG4gICAgICAgIHJldHVybiBzZW5kVG9TZWxlY3RvcihzZWxlY3Rvciwgb3V0X3J1bl9zY3JpcHQudGV4dCk7XG4gICAgfVxcbiR7bmFtZX0uZXhwb3J0cyA9IHt9O2Bcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLnBvcEFueVRyYWNrZXIoJ25hbWUnLCAnY29ubmVjdCcpLFxuICAgICAgICBkYXRhVGFnLnBvcEFueVRyYWNrZXIoJ3BhcmFtcycsICcnKSxcbiAgICAgICAgZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdzZWxlY3RvcicsICcnKSxcbiAgICAgICAgQmV0d2VlblRhZ0RhdGEsXG4gICAgICAgIHBhdGhOYW1lLFxuICAgICAgICBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpXG4gICAgKTtcblxuICAgIGNvbnN0IGFkZFNjcmlwdCA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSk7XG4gICAgaWYgKEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIk1pbkpTXCIpIHx8IEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIk1pbkFsbFwiKSkge1xuICAgICAgICBhZGRTY3JpcHQuYWRkVGV4dChhd2FpdCBtaW5pZnlKUyhzY3JpcHRJbmZvLmVxLCBCZXR3ZWVuVGFnRGF0YSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRTdHJpbmdUcmFja2VyKHNjcmlwdEluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBsZXQgUmVzQ29kZSA9IEJldHdlZW5UYWdEYXRhO1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZShcInNlcnZcIik7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUpO1xuXG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFeHRyYWN0ZWQgPSBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCk7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlbWFwOiAnZXh0ZXJuYWwnLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHttYXAsIGNvZGUsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgd2FybmluZ3MpO1xuICAgICAgICBcbiAgICAgICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBtYXApKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4vU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG1hcCA9IHR5cGVvZiBzb3VyY2VNYXAgPT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHNvdXJjZU1hcCk6IHNvdXJjZU1hcDtcblxuICAgIGNvbnN0IHRyYWNrQ29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIGNvbnN0IHNwbGl0TGluZXMgPSB0cmFja0NvZGUuc3BsaXQoJ1xcbicpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGlzTWFwID0gc3BsaXRMaW5lc1ttLmdlbmVyYXRlZExpbmUgLSAxXTtcbiAgICAgICAgaWYgKCFpc01hcCkgcmV0dXJuO1xuXG5cbiAgICAgICAgbGV0IGNoYXJDb3VudCA9IDE7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBpc01hcC5zdWJzdHJpbmcobS5nZW5lcmF0ZWRDb2x1bW4gPyBtLmdlbmVyYXRlZENvbHVtbiAtIDE6IDApLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgICAgICBpLmluZm8gPSBtLnNvdXJjZTtcbiAgICAgICAgICAgIGkubGluZSA9IG0ub3JpZ2luYWxMaW5lO1xuICAgICAgICAgICAgaS5jaGFyID0gY2hhckNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFja0NvZGU7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlcikge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIpO1xuICAgIHJldHVybiBuZXdUcmFja2VyO1xufVxuXG5mdW5jdGlvbiBtZXJnZVNhc3NJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgZ2VuZXJhdGVkOiBTdHJpbmdUcmFja2VyLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxMaW5lcyA9IG9yaWdpbmFsLnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ2VuZXJhdGVkLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgIGlmKGl0ZW0uaW5mbyA9PSBteVNvdXJjZSl7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBvcmlnaW5hbExpbmVzW2l0ZW0ubGluZSAtIDFdLmF0KGl0ZW0uY2hhci0xKT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgICAgIGl0ZW0uaW5mbyA9IGluZm87XG4gICAgICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbS5pbmZvKSB7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgoaXRlbS5pbmZvKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja1RvT3JpZ2luYWxTc3Mob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXAsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuZXdUcmFja2VyID0gYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIHNvdXJjZU1hcCk7XG4gICAgbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIsIG15U291cmNlKTtcblxuICAgIHJldHVybiBuZXdUcmFja2VyO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLnBvcFN0cmluZygndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6IHNlc3Npb25JbmZvLmRlYnVnID8gJ2V4dGVybmFsJyA6IGZhbHNlLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgbWFwLCBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhLmVxLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG5cbiAgICAgICAgcmVzdWx0Q29kZSA9IGNvZGU7XG4gICAgICAgIHJlc3VsdE1hcCA9IG1hcDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoaXNNb2RlbCA/ICdtb2R1bGUnIDogJ3NjcmlwdCcsIHRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHRNYXApIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKEpTT04ucGFyc2UocmVzdWx0TWFwKSwgQmV0d2VlblRhZ0RhdGEsIHJlc3VsdENvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRUZXh0KHJlc3VsdENvZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHNjcmlwdFdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNjcmlwdFdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgaWYgKGRhdGFUYWcuZXhpc3RzKCdzcmMnKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtCZXR3ZWVuVGFnRGF0YX08L3NjcmlwdD5gXG4gICAgICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdsYW5nJywgJ2pzJyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdzZXJ2ZXInKSkge1xuICAgICAgICByZXR1cm4gc2NyaXB0V2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NyaXB0V2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdIDogZ2V0VHlwZXMubm9kZV9tb2R1bGVzWzBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKHVybCwgcGF0aFRvRmlsZVVSTChvcmlnaW5hbFBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFsnc2NzcycsICdzYXNzJ10uaW5jbHVkZXMobGFuZ3VhZ2UpID8gU29tZVBsdWdpbnMoXCJNaW5BbGxcIiwgXCJNaW5TYXNzXCIpIDogU29tZVBsdWdpbnMoXCJNaW5Dc3NcIiwgXCJNaW5BbGxcIikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3R5bGUobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPiAke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsICB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG91dFN0eWxlQXNUcmltID0gQmV0d2VlblRhZ0RhdGEuZXEudHJpbSgpO1xuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZS5zdHlsZS5pbmNsdWRlcyhvdXRTdHlsZUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLnB1c2gob3V0U3R5bGVBc1RyaW0pO1xuXG4gICAgY29uc3QgeyByZXN1bHQsIG91dFN0eWxlIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc3R5bGUnLCBkYXRhVGFnLCAgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdD8uc291cmNlTWFwKVxuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoU291cmNlTWFwU3RvcmUuZml4VVJMU291cmNlTWFwKDxhbnk+cmVzdWx0LnNvdXJjZU1hcCksIEJldHdlZW5UYWdEYXRhLCBvdXRTdHlsZSk7XG4gICAgZWxzZVxuICAgICAgICBwdXNoU3R5bGUuYWRkU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgeyB0ZXh0OiBvdXRTdHlsZSB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHN0eWxlV2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc3R5bGVXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnY3NzJyk7XG5cbiAgICBpZihkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKXtcbiAgICAgICAgcmV0dXJuIHN0eWxlV2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlV2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IHBhdGhfbm9kZS5qb2luKHNtYWxsUGF0aCwgJy8uLi8nLCBpbnB1dFBhdGgpO1xuICAgIH1cblxuICAgIGlmICghcGF0aF9ub2RlLmV4dG5hbWUoaW5wdXRQYXRoKSlcbiAgICAgICAgaW5wdXRQYXRoICs9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7IENvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkIH0gfSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdChcImZyb21cIik7XG5cbiAgICBjb25zdCBpblN0YXRpYyA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHNtYWxsUGF0aFRvUGFnZSh0eXBlLmV4dHJhY3RJbmZvKCkpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWMsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogJHt0eXBlLmF0KDApLmxpbmVJbmZvfSAtPiAke0Z1bGxQYXRofWAsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdwYWdlLW5vdC1mb3VuZCcsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBKU1BhcnNlci5wcmludEVycm9yKGBQYWdlIG5vdCBmb3VuZDogJHtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKHR5cGUubGluZUluZm8pfSAtPiAke1NtYWxsUGF0aH1gKSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgUmV0dXJuRGF0YTogU3RyaW5nVHJhY2tlcjtcblxuICAgIGNvbnN0IGhhdmVDYWNoZSA9IGNhY2hlTWFwW2luU3RhdGljXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb24gfSA9IGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKGluU3RhdGljLCBnZXRUeXBlcy5TdGF0aWMsIHsgbmVzdGVkUGFnZTogcGF0aE5hbWUsIG5lc3RlZFBhZ2VEYXRhOiBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdvYmplY3QnKSB9KTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW2luU3RhdGljXSA9IHsgQ29tcGlsZWREYXRhOiA8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb24gfTtcbiAgICAgICAgUmV0dXJuRGF0YSA9IDxTdHJpbmdUcmFja2VyPkNvbXBpbGVkRGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgbmV3U2Vzc2lvbiB9ID0gY2FjaGVNYXBbaW5TdGF0aWNdO1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgdGhpcy5zYXZlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5zYXZlUGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gSlNPTi5wYXJzZShhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCkgfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBrZXkgaXMgaW4gdGhlIHN0b3JlLCByZXR1cm4gdGhlIHZhbHVlLiBJZiBub3QsIGNyZWF0ZSBhIG5ldyB2YWx1ZSwgc3RvcmUgaXQsIGFuZCByZXR1cm4gaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBsb29rIHVwIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0gW2NyZWF0ZV0gLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIGtleSBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgaGF2ZShrZXk6IHN0cmluZywgY3JlYXRlPzogKCkgPT4gc3RyaW5nKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5zdG9yZVtrZXldO1xuICAgICAgICBpZiAoaXRlbSB8fCAhY3JlYXRlKSByZXR1cm4gaXRlbTtcblxuICAgICAgICBpdGVtID0gY3JlYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlKGtleSwgaXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlKCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5zdG9yZSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuL1N0b3JlSlNPTlwiO1xuXG5leHBvcnQgY29uc3QgcGFnZURlcHMgPSBuZXcgU3RvcmVKU09OKCdQYWdlc0luZm8nKVxuXG4vKipcbiAqIENoZWNrIGlmIGFueSBvZiB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZSBwYWdlIGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7U3RyaW5nTnVtYmVyTWFwfSBkZXBlbmRlbmNpZXMgLSBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuIFRoZSBrZXkgaXMgdGhlIHBhdGggdG8gdGhlIGZpbGUsIGFuZFxuICogdGhlIHZhbHVlIGlzIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDpzdHJpbmcsIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0gcGFnZURlcHMuc3RvcmVbcGF0aF0pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggICsgIChpID09ICd0aGlzUGFnZScgPyBwYXRoOiBpKTtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IGRlcGVuZGVuY2llc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICFkZXBlbmRlbmNpZXM7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGlzb2xhdGUoQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbyk7XG5cbiAgICBjb21waWxlZFN0cmluZy5QbHVzJCBgPCV7JT4ke0JldHdlZW5UYWdEYXRhfTwlfSU+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ051bWJlck1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVnaXN0ZXJFeHRlbnNpb24gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9zc3InO1xuaW1wb3J0IHsgcmVidWlsZEZpbGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlLCB7IHJlc29sdmUsIGNsZWFyTW9kdWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9wcmVwcm9jZXNzJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmFzeW5jIGZ1bmN0aW9uIHNzckhUTUwoZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgRnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGdldFYgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGd2ID0gKG5hbWU6IHN0cmluZykgPT4gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KG5hbWUsJycpLnRyaW0oKSxcbiAgICAgICAgICAgIHZhbHVlID0gZ3YoJ3NzcicgKyBDYXBpdGFsaXplKG5hbWUpKSB8fCBndihuYW1lKTtcblxuICAgICAgICByZXR1cm4gdmFsdWUgPyBldmFsKGAoeyR7dmFsdWV9fSlgKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgYnVpbGRQYXRoID0gYXdhaXQgcmVnaXN0ZXJFeHRlbnNpb24oRnVsbFBhdGgsIHNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoYnVpbGRQYXRoKTtcblxuICAgIGNvbnN0IHsgaHRtbCwgaGVhZCB9ID0gbW9kZS5kZWZhdWx0LnJlbmRlcihnZXRWKCdwcm9wcycpLCBnZXRWKCdvcHRpb25zJykpO1xuICAgIHNlc3Npb25JbmZvLmhlYWRIVE1MICs9IGhlYWQ7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ2Zyb20nKSwgZ2V0VHlwZXMuU3RhdGljWzJdLCAnc3ZlbHRlJyk7XG4gICAgY29uc3QgaW5XZWJQYXRoID0gcmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBTbWFsbFBhdGgpLnJlcGxhY2UoL1xcXFwvZ2ksICcvJyk7XG5cbiAgICBzZXNzaW9uSW5mby5zdHlsZSgnLycgKyBpbldlYlBhdGggKyAnLmNzcycpO1xuXG4gICAgY29uc3QgaWQgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2lkJywgQmFzZTY0SWQoaW5XZWJQYXRoKSksXG4gICAgICAgIGhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdChuYW1lLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gYCwke25hbWV9Onske3ZhbHVlfX1gIDogJyc7XG4gICAgICAgIH0sIHNlbGVjdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VsZWN0b3InKTtcblxuICAgIGNvbnN0IHNzciA9ICFzZWxlY3RvciAmJiBkYXRhVGFnLnBvcEJvb2xlYW4oJ3NzcicpID8gYXdhaXQgc3NySFRNTChkYXRhVGFnLCBGdWxsUGF0aCwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbykgOiAnJztcblxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdtb2R1bGUnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KFxuYGltcG9ydCBBcHAke2lkfSBmcm9tICcvJHtpbldlYlBhdGh9JztcbmNvbnN0IHRhcmdldCR7aWR9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiR7c2VsZWN0b3IgPyBzZWxlY3RvciA6ICcjJyArIGlkfVwiKTtcbnRhcmdldCR7aWR9ICYmIG5ldyBBcHAke2lkfSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQke2lkfVxuICAgICR7aGF2ZSgncHJvcHMnKSArIGhhdmUoJ29wdGlvbnMnKX0ke3NzciA/ICcsIGh5ZHJhdGU6IHRydWUnIDogJyd9XG59KTtgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBzZWxlY3RvciA/ICcnIDogYDxkaXYgaWQ9XCIke2lkfVwiPiR7c3NyfTwvZGl2PmApLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJZCh0ZXh0OiBzdHJpbmcsIG1heCA9IDEwKXtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odGV4dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnN1YnN0cmluZygwLCBtYXgpLnJlcGxhY2UoL1xcKy8sICdfJykucmVwbGFjZSgvXFwvLywgJ18nKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgIHsgQ2FwaXRhbGl6ZSwgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgQ29tcGlsZU9wdGlvbnMgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBjbGVhck1vZHVsZSwgcmVzb2x2ZSB9IGZyb20gXCIuLi8uLi9yZWRpcmVjdENKU1wiO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGVQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbmFtZSA9IHBhdGgucGFyc2UoZmlsZVBhdGgpLm5hbWUucmVwbGFjZSgvXlxcZC8sICdfJCYnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8kXS9nLCAnJyk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgICAgICBuYW1lOiBDYXBpdGFsaXplKG5hbWUpLFxuICAgICAgICBnZW5lcmF0ZTogJ3NzcicsXG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGRldjogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIGVycm9yTW9kZTogJ3dhcm4nXG4gICAgfTtcblxuICAgIGNvbnN0IGluU3RhdGljRmlsZSA9IHBhdGgucmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzbWFsbFBhdGgpO1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljRmlsZTtcblxuICAgIGNvbnN0IGZ1bGxJbXBvcnRQYXRoID0gZnVsbENvbXBpbGVQYXRoICsgJy5zc3IuY2pzJztcbiAgICBjb25zdCB7c3ZlbHRlRmlsZXMsIGNvZGUsIG1hcCwgZGVwZW5kZW5jaWVzfSA9IGF3YWl0IHByZXByb2Nlc3MoZmlsZVBhdGgsIHNtYWxsUGF0aCxmdWxsSW1wb3J0UGF0aCxmYWxzZSwnLnNzci5janMnKTtcbiAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyxkZXBlbmRlbmNpZXMpO1xuICAgIG9wdGlvbnMuc291cmNlbWFwID0gbWFwO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBmb3IoY29uc3QgZmlsZSBvZiBzdmVsdGVGaWxlcyl7XG4gICAgICAgIGNsZWFyTW9kdWxlKHJlc29sdmUoZmlsZSkpOyAvLyBkZWxldGUgb2xkIGltcG9ydHNcbiAgICAgICAgcHJvbWlzZXMucHVzaChyZWdpc3RlckV4dGVuc2lvbihmaWxlLCBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGUpLCBzZXNzaW9uSW5mbykpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGNvbnN0IHsganMsIGNzcywgd2FybmluZ3MgfSA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIDxhbnk+b3B0aW9ucyk7XG4gICAgUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzLCBmaWxlUGF0aCwgbWFwKTtcblxuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbEltcG9ydFBhdGgsIGpzLmNvZGUpO1xuXG4gICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9ICcvJyArIGluU3RhdGljRmlsZS5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIGZ1bGxJbXBvcnRQYXRoO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IGRpcm5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgUHJpbnRTYXNzRXJyb3JUcmFja2VyLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFeHRlbnNpb24sIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCwgYmFja1RvT3JpZ2luYWxTc3MgfSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBhd2FpdCBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsPGFueT4gc291cmNlTWFwLCBzb3VyY2VNYXAuc291cmNlcy5maW5kKHggPT4geC5zdGFydHNXaXRoKCdkYXRhOicpKSksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydFsgXSp0eXBlfGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgaWYobGFuZyA9PSAndHMnICYmIGFyZ3NbNV0uZW5kc1dpdGgoJyB0eXBlJykpXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoYXJnc1sxMF0uZXEpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJycpXG4gICAgICAgICAgICBpZiAobGFuZyA9PSAndHMnKVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy50cycpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy5qcycpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGFyZ3NbMV0uUGx1cyhhcmdzWzldLCBhcmdzWzEwXSwgKGV4dCA9PSAnLnN2ZWx0ZScgPyBzdmVsdGVFeHQgOiAnJyksIGFyZ3NbOV0sIChhcmdzWzExXSA/PyAnJykpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJy5zdmVsdGUnKSB7XG4gICAgICAgICAgICBjb25uZWN0U3ZlbHRlLnB1c2goYXJnc1sxMF0uZXEpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhbmcgIT09ICd0cycgfHwgIWFyZ3NbNF0pXG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcblxuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgbWFwVG9rZW5baWRdID0gbmV3RGF0YTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYF9fX3RvS2VuXFxgJHtpZH1cXGBgKTtcbiAgICB9KTtcblxuICAgIGlmIChsYW5nICE9PSAndHMnKVxuICAgICAgICByZXR1cm4gY29udGVudDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSAoYXdhaXQgdHJhbnNmb3JtKGNvbnRlbnQuZXEsIHsgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgbG9hZGVyOiAndHMnLCBzb3VyY2VtYXA6IHRydWUgfSkpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgYmFja1RvT3JpZ2luYWwoY29udGVudCwgY29kZSwgbWFwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGNvbnRlbnQsIGVycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgfVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoL19fX3RvS2VuYChbXFx3XFxXXSs/KWAvbWksIGFyZ3MgPT4ge1xuICAgICAgICByZXR1cm4gbWFwVG9rZW5bYXJnc1sxXS5lcV0gPz8gbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzYXZlUGF0aCA9IHNtYWxsUGF0aCwgaHR0cFNvdXJjZSA9IHRydWUsIHN2ZWx0ZUV4dCA9ICcnKSB7ICAgIFxuICAgIGxldCB0ZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoc21hbGxQYXRoLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGxldCBzY3JpcHRMYW5nID0gJ2pzJywgc3R5bGVMYW5nID0gJ2Nzcyc7XG5cbiAgICBjb25zdCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSA9IFtdLCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzY3JpcHQpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHNjcmlwdExhbmcgPSBhcmdzWzRdPy5lcSA/PyAnanMnO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGF3YWl0IFNjcmlwdFN2ZWx0ZShhcmdzWzddLCBzY3JpcHRMYW5nLCBjb25uZWN0U3ZlbHRlLCBzdmVsdGVFeHQpLCBhcmdzWzhdKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0eWxlQ29kZSA9IGNvbm5lY3RTdmVsdGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuICAgIGxldCBoYWRTdHlsZSA9IGZhbHNlO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c3R5bGUpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGlmKHN0eWxlTGFuZyA9PSAnY3NzJykgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llczogZGVwcyB9ID0gYXdhaXQgU0FTU1N2ZWx0ZShhcmdzWzddLCBzdHlsZUxhbmcsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgc2NyaXB0TGFuZywgc3R5bGVMYW5nLCBjb2RlOiB0ZXh0LmVxLCBtYXA6IHRleHQuU3RyaW5nVGFjayhzYXZlUGF0aCwgaHR0cFNvdXJjZSksIGRlcGVuZGVuY2llczogc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBzdmVsdGVGaWxlczogY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiB4WzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1swXSArIHggOiBwYXRoLm5vcm1hbGl6ZShmdWxsUGF0aCArICcvLi4vJyArIHgpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuIiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgXG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXFxgJHtKU1BhcnNlci5wcmludEVycm9yKGBTeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX1gKX1cXGBgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IGVyci5lcnJvcnNbMF07XG4gICAgICAgICAgICBmaXJzdC5sb2NhdGlvbiAmJiAoZmlyc3QubG9jYXRpb24ubGluZVRleHQgPSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZSh0ZXh0LmRlYnVnTGluZShmaXJzdCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCAgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tIFwiLi9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXJcIjtcblxuXG5leHBvcnQgdHlwZSBzZXREYXRhSFRNTFRhZyA9IHtcbiAgICB1cmw6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwXG59XG5cbmV4cG9ydCB0eXBlIGNvbm5lY3RvckFycmF5ID0ge1xuICAgIHR5cGU6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgc2VuZFRvOiBzdHJpbmcsXG4gICAgdmFsaWRhdG9yOiBzdHJpbmdbXSxcbiAgICBvcmRlcj86IHN0cmluZ1tdLFxuICAgIG5vdFZhbGlkPzogc3RyaW5nLFxuICAgIG1lc3NhZ2U/OiBzdHJpbmcgfCBib29sZWFuLFxuICAgIHJlc3BvbnNlU2FmZT86IGJvb2xlYW5cbn1bXVxuXG5leHBvcnQgdHlwZSBjYWNoZUNvbXBvbmVudCA9IHtcbiAgICBba2V5OiBzdHJpbmddOiBudWxsIHwge1xuICAgICAgICBtdGltZU1zPzogbnVtYmVyLFxuICAgICAgICB2YWx1ZT86IHN0cmluZ1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgaW5UYWdDYWNoZSA9IHtcbiAgICBzdHlsZTogc3RyaW5nW11cbiAgICBzY3JpcHQ6IHN0cmluZ1tdXG4gICAgc2NyaXB0TW9kdWxlOiBzdHJpbmdbXVxufVxuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTaG9ydFNjcmlwdE5hbWVzJyk7XG5cbi8qIFRoZSBTZXNzaW9uQnVpbGQgY2xhc3MgaXMgdXNlZCB0byBidWlsZCB0aGUgaGVhZCBvZiB0aGUgcGFnZSAqL1xuZXhwb3J0IGNsYXNzIFNlc3Npb25CdWlsZCB7XG4gICAgY29ubmVjdG9yQXJyYXk6IGNvbm5lY3RvckFycmF5ID0gW11cbiAgICBwcml2YXRlIHNjcmlwdFVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBzdHlsZVVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBpblNjcmlwdFN0eWxlOiB7IHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBTb3VyY2VNYXBTdG9yZSB9W10gPSBbXVxuICAgIGhlYWRIVE1MID0gJydcbiAgICBjYWNoZTogaW5UYWdDYWNoZSA9IHtcbiAgICAgICAgc3R5bGU6IFtdLFxuICAgICAgICBzY3JpcHQ6IFtdLFxuICAgICAgICBzY3JpcHRNb2R1bGU6IFtdXG4gICAgfVxuICAgIGNhY2hlQ29tcGlsZVNjcmlwdDogYW55ID0ge31cbiAgICBjYWNoZUNvbXBvbmVudDogY2FjaGVDb21wb25lbnQgPSB7fVxuICAgIGNvbXBpbGVSdW5UaW1lU3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9XG4gICAgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSB7fVxuICAgIHJlY29yZE5hbWVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICBnZXQgc2FmZURlYnVnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWJ1ZyAmJiB0aGlzLl9zYWZlRGVidWc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNtYWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgZnVsbFBhdGg6IHN0cmluZywgcHVibGljIHR5cGVOYW1lPzogc3RyaW5nLCBwdWJsaWMgZGVidWc/OiBib29sZWFuLCBwcml2YXRlIF9zYWZlRGVidWc/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMgPSB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc3R5bGUodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgc2NyaXB0KHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcmlwdFVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgcmVjb3JkKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVwZW5kZW5jZShzbWFsbFBhdGg6IHN0cmluZywgZnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aCkge1xuICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEZXAgPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0O1xuICAgICAgICBpZiAoaGF2ZURlcCkge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSA9IGhhdmVEZXBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGUodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHNtYWxsUGF0aCA9IHRoaXMuc21hbGxQYXRoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5pblNjcmlwdFN0eWxlLmZpbmQoeCA9PiB4LnR5cGUgPT0gdHlwZSAmJiB4LnBhdGggPT0gc21hbGxQYXRoKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0geyB0eXBlLCBwYXRoOiBzbWFsbFBhdGgsIHZhbHVlOiBuZXcgU291cmNlTWFwU3RvcmUoc21hbGxQYXRoLCB0aGlzLnNhZmVEZWJ1ZywgdHlwZSA9PSAnc3R5bGUnLCB0cnVlKSB9XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaChkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhLnZhbHVlXG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGVQYWdlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIGRhdGFUYWcucG9wU3RyaW5nKCdwYWdlJykgPyB0aGlzLnNtYWxsUGF0aCA6IGluZm8uZXh0cmFjdEluZm8oKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVOYW1lKHRleHQ6IHN0cmluZykge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU3RhdGljRmlsZXNJbmZvLnN0b3JlKTtcbiAgICAgICAgd2hpbGUgKGtleSA9PSBudWxsIHx8IHZhbHVlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSBCYXNlNjRJZCh0ZXh0LCA1ICsgbGVuZ3RoKS5zdWJzdHJpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZEhlYWRUYWdzKCkge1xuICAgICAgICBjb25zdCBwYWdlTG9nID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTG9nID0gcGFnZUxvZyAmJiBpLnBhdGggPT0gdGhpcy5zbWFsbFBhdGg7XG4gICAgICAgICAgICBjb25zdCBzYXZlTG9jYXRpb24gPSBpc0xvZyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV0sIGFkZFF1ZXJ5ID0gaXNMb2cgPyAnP3Q9bCcgOiAnJztcbiAgICAgICAgICAgIGxldCB1cmwgPSBTdGF0aWNGaWxlc0luZm8uaGF2ZShpLnBhdGgsICgpID0+IFNlc3Npb25CdWlsZC5jcmVhdGVOYW1lKGkucGF0aCkpICsgJy5wdWInO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgZGVmZXI6IG51bGwgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcubWpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgdHlwZTogJ21vZHVsZScgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5jc3MnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlKCcvJyArIHVybCArIGFkZFF1ZXJ5KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShzYXZlTG9jYXRpb24gKyB1cmwsIGF3YWl0IGkudmFsdWUuY3JlYXRlRGF0YVdpdGhNYXAoKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkSGVhZCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRIZWFkVGFncygpO1xuXG4gICAgICAgIGNvbnN0IG1ha2VBdHRyaWJ1dGVzID0gKGk6IHNldERhdGFIVE1MVGFnKSA9PiBpLmF0dHJpYnV0ZXMgPyAnICcgKyBPYmplY3Qua2V5cyhpLmF0dHJpYnV0ZXMpLm1hcCh4ID0+IGkuYXR0cmlidXRlc1t4XSA/IHggKyBgPVwiJHtpLmF0dHJpYnV0ZXNbeF19XCJgIDogeCkuam9pbignICcpIDogJyc7XG5cbiAgICAgICAgbGV0IGJ1aWxkQnVuZGxlU3RyaW5nID0gJyc7IC8vIGFkZCBzY3JpcHRzIGFkZCBjc3NcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc3R5bGVVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0vPmA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNjcmlwdFVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8c2NyaXB0IHNyYz1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfT48L3NjcmlwdD5gO1xuXG4gICAgICAgIHJldHVybiBidWlsZEJ1bmRsZVN0cmluZyArIHRoaXMuaGVhZEhUTUw7XG4gICAgfVxuXG4gICAgZXh0ZW5kcyhmcm9tOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3JBcnJheS5wdXNoKC4uLmZyb20uY29ubmVjdG9yQXJyYXkpO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKC4uLmZyb20uc2NyaXB0VVJMU2V0KTtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKC4uLmZyb20uc3R5bGVVUkxTZXQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBmcm9tLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKHsgLi4uaSwgdmFsdWU6IGkudmFsdWUuY2xvbmUoKSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29weU9iamVjdHMgPSBbJ2NhY2hlQ29tcGlsZVNjcmlwdCcsICdjYWNoZUNvbXBvbmVudCcsICdkZXBlbmRlbmNpZXMnXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29weU9iamVjdHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpc1tjXSwgZnJvbVtjXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2goLi4uZnJvbS5yZWNvcmROYW1lcy5maWx0ZXIoeCA9PiAhdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyh4KSkpO1xuXG4gICAgICAgIHRoaXMuaGVhZEhUTUwgKz0gZnJvbS5oZWFkSFRNTDtcbiAgICAgICAgdGhpcy5jYWNoZS5zdHlsZS5wdXNoKC4uLmZyb20uY2FjaGUuc3R5bGUpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdC5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0KTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHRNb2R1bGUucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdE1vZHVsZSk7XG4gICAgfVxuXG4gICAgLy9iYXNpYyBtZXRob2RzXG4gICAgQnVpbGRTY3JpcHRXaXRoUHJhbXMoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gQnVpbGRTY3JpcHQoY29kZSwgaXNUcygpLCB0aGlzKTtcbiAgICB9XG59IiwgIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCBjbGVhck1vZHVsZSBmcm9tICdjbGVhci1tb2R1bGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCksIHJlc29sdmUgPSAocGF0aDogc3RyaW5nKSA9PiByZXF1aXJlLnJlc29sdmUocGF0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGZpbGVQYXRoKTtcbiAgICBjbGVhck1vZHVsZShmaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufVxuXG5leHBvcnQge1xuICAgIGNsZWFyTW9kdWxlLFxuICAgIHJlc29sdmVcbn0iLCAiaW1wb3J0IHsgV2FybmluZyB9IGZyb20gXCJzdmVsdGUvdHlwZXMvY29tcGlsZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5cbmNsYXNzIHJlTG9jYXRpb24ge1xuICAgIG1hcDogUHJvbWlzZTxTb3VyY2VNYXBDb25zdW1lcj5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRMb2NhdGlvbihsb2NhdGlvbjoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KXtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSAoYXdhaXQgdGhpcy5tYXApLm9yaWdpbmFsUG9zaXRpb25Gb3IobG9jYXRpb24pXG4gICAgICAgIHJldHVybiBgJHtsaW5lfToke2NvbHVtbn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlRXJyb3IoeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfTogV2FybmluZywgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcic7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICdAc2luZHJlc29yaHVzL3NsdWdpZnknO1xuaW1wb3J0IG1hcmtkb3duSXRBdHRycyBmcm9tICdtYXJrZG93bi1pdC1hdHRycyc7XG5pbXBvcnQgbWFya2Rvd25JdEFiYnIgZnJvbSAnbWFya2Rvd24taXQtYWJicidcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55LCBpY29uOiBzdHJpbmcpIHtcblxuICAgIGZ1bmN0aW9uIHJlbmRlckNvZGUob3JpZ1J1bGU6IGFueSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnUmVuZGVyZWQgPSBvcmlnUnVsZSguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNvZGUtY29weVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29weS1jbGlwYm9hcmRcIiBvbmNsaWNrPVwibWFya2Rvd25Db3B5KHRoaXMpXCI+JHtpY29ufTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke29yaWdSZW5kZXJlZH1cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2sgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2spO1xuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIFxuICAgIGNvbnN0IGhsanNDbGFzcyA9ZGF0YVRhZy5wb3BCb29sZWFuKCdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogZGF0YVRhZy5wb3BCb29sZWFuKCdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpLFxuICAgICAgICBicmVha3M6IGRhdGFUYWcucG9wQm9vbGVhbignYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSxcbiAgICAgICAgdHlwb2dyYXBoZXI6IGRhdGFUYWcucG9wQm9vbGVhbigndHlwb2dyYXBoZXInLCBtYXJrRG93blBsdWdpbj8udHlwb2dyYXBoZXIgPz8gdHJ1ZSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29weSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/ICdcdUQ4M0RcdURDQ0InKTtcbiAgICBpZiAoY29weSlcbiAgICAgICAgbWQudXNlKChtOmFueSk9PiBjb2RlV2l0aENvcHkobSwgY29weSkpO1xuXG4gICAgaWYgKGRhdGFUYWcucG9wQm9vbGVhbignaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhYmJyJywgbWFya0Rvd25QbHVnaW4/LmFiYnIgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QWJicik7XG5cbiAgICBsZXQgbWFya2Rvd25Db2RlID0gQmV0d2VlblRhZ0RhdGE/LmVxIHx8ICcnO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdmaWxlJywgJy4vbWFya2Rvd24nKTtcblxuICAgIGlmICghbWFya2Rvd25Db2RlPy50cmltPy4oKSAmJiBsb2NhdGlvbikge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBsb2NhdGlvblswXSA9PSAnLycgPyBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzJdLCBsb2NhdGlvbik6IHBhdGguam9pbihwYXRoLmRpcm5hbWUodHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JykpLCBsb2NhdGlvbik7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnBvcFN0cmluZygnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBpZih0aGVtZSAhPSAnbm9uZScpe1xuICAgICAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY29weSl7XG4gICAgICAgICAgICBzZXNzaW9uLnNjcmlwdCgnL3NlcnYvbWQuanMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCd0aGVtZScsICBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXY+YXtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAtN3B4OyAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8aGVhZCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy4uWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCcuLicpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCBudW06IG51bWJlcikgPT4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1zdHJpbmdcIjogW1xuICAgICAgICAvXnN0cmluZ3x0ZXh0K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBgXCIke3gudHJpbSgpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyl9XCJgKSxcbiAgICAgICAgKG9wdGlvbnM6IHN0cmluZ1tdLCB0ZXh0OiBzdHJpbmcpID0+IG9wdGlvbnMuaW5jbHVkZXModGV4dCksXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLW51bWJlclwiOiBbXG4gICAgICAgIC9ebnVtYmVyfG51bXxpbnRlZ2VyfGludCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gcGFyc2VGbG9hdCh4KSksXG4gICAgICAgIChvcHRpb25zOiBudW1iZXJbXSwgbnVtOiBudW1iZXIpID0+IG9wdGlvbnMuaW5jbHVkZXMobnVtKSxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF1cbn07XG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycyA9IFsuLi5udW1iZXJzXTtcblxuZm9yKGNvbnN0IGkgaW4gYnVpbHRJbkNvbm5lY3Rpb25SZWdleCl7XG4gICAgY29uc3QgdHlwZSA9IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbaV1bM107XG5cbiAgICBpZihidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXModHlwZSkpXG4gICAgICAgIGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5wdXNoKGkpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVmFsdWVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG5cbiAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb24uaW5jbHVkZXModmFsdWUpKVxuICAgICAgICByZXR1cm4gYFtcIiR7dmFsdWV9XCJdYDtcblxuICAgIGZvciAoY29uc3QgW25hbWUsIFt0ZXN0LCBnZXRBcmdzXV0gb2YgT2JqZWN0LmVudHJpZXMoYnVpbHRJbkNvbm5lY3Rpb25SZWdleCkpXG4gICAgICAgIGlmICgoPFJlZ0V4cD50ZXN0KS50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiBgW1wiJHtuYW1lfVwiLCAkeyg8YW55PmdldEFyZ3MpKHZhbHVlKX1dYDtcblxuICAgIHJldHVybiBgWyR7dmFsdWV9XWA7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VWYWxpZGF0aW9uSlNPTihhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogUHJvbWlzZTxib29sZWFuIHwgc3RyaW5nW10+IHtcblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudCwgLi4uZWxlbWVudEFyZ3NdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcbiAgICAgICAgbGV0IHJldHVybk5vdyA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBpc0RlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgY2FzZSAnbnVtJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICBjYXNlICdib29sJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgICAgY2FzZSAnaW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhZW1haWxWYWxpZGF0b3IudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGF2ZVJlZ2V4ID0gdmFsdWUgIT0gbnVsbCAmJiBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWhhdmVSZWdleFsyXShlbGVtZW50QXJncywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IGVsZW1lbnQudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWF3YWl0IGVsZW1lbnQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk5vdykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBgZmFpbGVkIGF0ICR7aX0gZmlsZWQgLSAke2lzRGVmYXVsdCA/IHJldHVybk5vdyA6ICdleHBlY3RlZCAnICsgZWxlbWVudH1gO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50QXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaW5mbyArPSBgLCBhcmd1bWVudHM6ICR7SlNPTi5zdHJpbmdpZnkoZWxlbWVudEFyZ3MpfWA7XG5cbiAgICAgICAgICAgIGluZm8gKz0gYCwgaW5wdXQ6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBbaW5mbywgZWxlbWVudCwgZWxlbWVudEFyZ3MsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VWYWx1ZXMoYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBwYXJzZWQgPSBbXTtcblxuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50XSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG5cbiAgICAgICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHBhcnNlRmxvYXQodmFsdWUpKTtcblxuICAgICAgICBlbHNlIGlmIChib29sZWFucy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgdHlwZSB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCB7IFNvbWVQbHVnaW5zIH0sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbmFtZScpLFxuICAgICAgICBzZW5kVG8gPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdzZW5kVG8nKSxcbiAgICAgICAgdmFsaWRhdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQgPSBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdub3RWYWxpZCcpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFTb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKSk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7IGFzeW5jOiBudWxsIH0pXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KHRlbXBsYXRlKG5hbWUpKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGEsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgbGV0IGJ1aWxkT2JqZWN0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2Ygc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkpIHtcbiAgICAgICAgaWYgKGkudHlwZSAhPSAnY29ubmVjdCcpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBidWlsZE9iamVjdCArPSBgLFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOlwiJHtpLm5hbWV9XCIsXG4gICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICBub3RWYWxpZDogJHtpLm5vdFZhbGlkIHx8ICdudWxsJ30sXG4gICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICB2YWxpZGF0b3I6WyR7KGkudmFsaWRhdG9yICYmIGkudmFsaWRhdG9yLm1hcChjb21waWxlVmFsdWVzKS5qb2luKCcsJykpIHx8ICcnfV1cbiAgICAgICAgfWA7XG4gICAgfVxuXG4gICAgYnVpbGRPYmplY3QgPSBgWyR7YnVpbGRPYmplY3Quc3Vic3RyaW5nKDEpfV1gO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gYFxuICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JDYWxsKXtcbiAgICAgICAgICAgIGlmKGF3YWl0IGhhbmRlbENvbm5lY3RvcihcImNvbm5lY3RcIiwgcGFnZSwgJHtidWlsZE9iamVjdH0pKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1gO1xuXG4gICAgaWYgKHBhZ2VEYXRhLmluY2x1ZGVzKFwiQENvbm5lY3RIZXJlXCIpKVxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKC9AQ29ubmVjdEhlcmUoOz8pLywgKCkgPT4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYWRkU2NyaXB0KSk7XG4gICAgZWxzZVxuICAgICAgICBwYWdlRGF0YS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGFkZFNjcmlwdCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yQXJyYXk6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzUGFnZS5Qb3N0Py5jb25uZWN0b3JDYWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cblxuICAgIGNvbnN0IGhhdmUgPSBjb25uZWN0b3JBcnJheS5maW5kKHggPT4geC5uYW1lID09IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC5uYW1lKTtcblxuICAgIGlmICghaGF2ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwudmFsdWVzO1xuICAgIGNvbnN0IGlzVmFsaWQgPSBoYXZlLnZhbGlkYXRvci5sZW5ndGggJiYgYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgaGF2ZS52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhdmUudmFsaWRhdG9yLmxlbmd0aCB8fCBpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGhhdmUuc2VuZFRvKC4uLnZhbHVlcykpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCkpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5tZXNzYWdlKVxuICAgICAgICBiZXR0ZXJKU09OKHtcbiAgICAgICAgICAgIGVycm9yOiB0eXBlb2YgaGF2ZS5tZXNzYWdlID09ICdzdHJpbmcnID8gaGF2ZS5tZXNzYWdlIDogKDxhbnk+aXNWYWxpZCkuc2hpZnQoKVxuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnN0YXR1cyg0MDApO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNvbXBpbGVWYWx1ZXMsIG1ha2VWYWxpZGF0aW9uSlNPTiwgcGFyc2VWYWx1ZXMgfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBjb25zdCBzZW5kVG8gPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3NlbmRUbycsJycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCAgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICAgICAgfTwvZm9ybT5gLFxuICAgICAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgICAgICB9XG5cblxuICAgIGNvbnN0IG5hbWUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ25hbWUnLHV1aWQoKSkudHJpbSgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb3JkZXInKSwgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcucG9wQm9vbGVhbignc2FmZScpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBsZXQgb3JkZXIgPSBbXTtcblxuICAgIGNvbnN0IHZhbGlkYXRvckFycmF5ID0gdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHsgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYW4gb3JkZXIgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIFwicHJvcDE6IHN0cmluZywgcHJvcDM6IG51bSwgcHJvcDI6IGJvb2xcIlxuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0Rmlyc3QoJzonLCB4LnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBvcmRlci5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuXG4gICAgICAgIHJldHVybiBzcGxpdC5wb3AoKTtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlckRlZmF1bHQpXG4gICAgICAgIG9yZGVyID0gb3JkZXJEZWZhdWx0LnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yQXJyYXksXG4gICAgICAgIG9yZGVyOiBvcmRlci5sZW5ndGggJiYgb3JkZXIsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZXNwb25zZVNhZmVcbiAgICB9KTtcblxuICAgIGRhdGFUYWcucHVzaFZhbHVlKCdtZXRob2QnLCAncG9zdCcpO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtzZW5kVG99KTtcbiU+PGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbm5lY3RvckZvcm1DYWxsXCIgdmFsdWU9XCIke25hbWV9XCIvPiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9ICdmb3JtJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHNlbmRUb1VuaWNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBpLnNlbmRUbykudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQENvbm5lY3RIZXJlRm9ybVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXCkoOz8pYCksIGNvbm5lY3REZWZhdWx0ID0gbmV3IFJlZ0V4cChgQFxcXFw/Q29ubmVjdEhlcmVGb3JtXFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgY29uc3Qgc2NyaXB0RGF0YSA9IGRhdGEgPT4ge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGFbMF0uU3RhcnRJbmZvKS5QbHVzJFxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JGb3JtQ2FsbCA9PSBcIiR7aS5uYW1lfVwiKXtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgaGFuZGVsQ29ubmVjdG9yKFwiZm9ybVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBbJHtpLm9yZGVyPy5tYXA/LihpdGVtID0+IGBcIiR7aXRlbX1cImApPy5qb2luKCcsJykgPz8gJyd9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoY291bnRlcilcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZShjb25uZWN0RGVmYXVsdCwgJycpOyAvLyBkZWxldGluZyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdERlZmF1bHQsIHNjcmlwdERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckluZm86IGFueSkge1xuXG4gICAgZGVsZXRlIHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yRm9ybUNhbGw7XG5cbiAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby5vcmRlci5sZW5ndGgpIC8vIHB1c2ggdmFsdWVzIGJ5IHNwZWNpZmljIG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjb25uZWN0b3JJbmZvLm9yZGVyKVxuICAgICAgICAgICAgdmFsdWVzLnB1c2godGhpc1BhZ2UuUG9zdFtpXSk7XG4gICAgZWxzZVxuICAgICAgICB2YWx1ZXMucHVzaCguLi5PYmplY3QudmFsdWVzKHRoaXNQYWdlLlBvc3QpKTtcblxuXG4gICAgbGV0IGlzVmFsaWQ6IGJvb2xlYW4gfCBzdHJpbmdbXSA9IHRydWU7XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby52YWxpZGF0b3IubGVuZ3RoKSB7IC8vIHZhbGlkYXRlIHZhbHVlc1xuICAgICAgICB2YWx1ZXMgPSBwYXJzZVZhbHVlcyh2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICAgICAgaXNWYWxpZCA9IGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzcG9uc2U6IGFueTtcblxuICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8uc2VuZFRvKC4uLnZhbHVlcyk7XG4gICAgZWxzZSBpZiAoY29ubmVjdG9ySW5mby5ub3RWYWxpZClcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCk7XG5cbiAgICBpZiAoIWlzVmFsaWQgJiYgIXJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5tZXNzYWdlID09PSB0cnVlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKGNvbm5lY3RvckluZm8ubWVzc2FnZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3BvbnNlID0gY29ubmVjdG9ySW5mby5tZXNzYWdlO1xuXG4gICAgaWYgKHJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5zYWZlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKHJlc3BvbnNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGUocmVzcG9uc2UpO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5jb25zdCByZWNvcmRTdG9yZSA9IG5ldyBTdG9yZUpTT04oJ1JlY29yZHMnKTtcblxuZnVuY3Rpb24gcmVjb3JkTGluayhkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbGluaycsIHNtYWxsUGF0aFRvUGFnZShzZXNzaW9uSW5mby5zbWFsbFBhdGgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZWNvcmRQYXRoKGRlZmF1bHROYW1lOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBsaW5rID0gcmVjb3JkTGluayhkYXRhVGFnLCBzZXNzaW9uSW5mbyksIHNhdmVOYW1lID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCduYW1lJywgZGVmYXVsdE5hbWUpO1xuXG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdID8/PSB7fTtcbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10gPz89ICcnO1xuICAgIHNlc3Npb25JbmZvLnJlY29yZChzYXZlTmFtZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdG9yZTogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdLFxuICAgICAgICBjdXJyZW50OiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10sXG4gICAgICAgIGxpbmtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZiAoIXNlc3Npb25JbmZvLnNtYWxsUGF0aC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSkgLy8gZG8gbm90IGFsbG93IHRoaXMgZm9yIGNvbXBpbGluZyBjb21wb25lbnQgYWxvbmVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgICAgICB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaHRtbCA9IGh0bWwudHJpbSgpO1xuXG4gICAgY29uc3QgeyBzdG9yZSwgbGluayB9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvcmVjb3JkLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZiAoIXN0b3JlW2xpbmtdLmluY2x1ZGVzKGh0bWwpKSB7XG4gICAgICAgIHN0b3JlW2xpbmtdICs9IGh0bWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQmVmb3JlUmVCdWlsZChzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG5hbWUgPSBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoKTtcbiAgICBmb3IgKGNvbnN0IHNhdmUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVdO1xuXG4gICAgICAgIGlmIChpdGVtW25hbWVdKSB7XG4gICAgICAgICAgICBpdGVtW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIGl0ZW1bbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVSZWNvcmRzKHNlc3Npb246IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbi5kZWJ1Zykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIHNlc3Npb24ucmVjb3JkTmFtZXMpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlckNvbXBpbGUoKSB7XG4gICAgcmVjb3JkU3RvcmUuY2xlYXIoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlKCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5pbXBvcnQgeyBtYWtlUmVjb3JkUGF0aCB9IGZyb20gJy4vcmVjb3JkJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZiAoIXNlc3Npb25JbmZvLnNtYWxsUGF0aC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSkgLy8gZG8gbm90IGFsbG93IHRoaXMgZm9yIGNvbXBpbGluZyBjb21wb25lbnQgYWxvbmVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgICAgICB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBzdG9yZSwgbGluaywgY3VycmVudCB9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvc2VhcmNoLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgY29uc3Qgc2VhcmNoT2JqZWN0ID0gYnVpbGRPYmplY3QoaHRtbCwgZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdtYXRjaCcsICdoMVtpZF0sIGgyW2lkXSwgaDNbaWRdLCBoNFtpZF0sIGg1W2lkXSwgaDZbaWRdJykpO1xuXG4gICAgaWYgKCFjdXJyZW50KSB7XG4gICAgICAgIHN0b3JlW2xpbmtdID0gc2VhcmNoT2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY3VycmVudC50aXRsZXMsIHNlYXJjaE9iamVjdC50aXRsZXMpO1xuXG4gICAgICAgIGlmICghY3VycmVudC50ZXh0LmluY2x1ZGVzKHNlYXJjaE9iamVjdC50ZXh0KSkge1xuICAgICAgICAgICAgY3VycmVudC50ZXh0ICs9IHNlYXJjaE9iamVjdC50ZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZE9iamVjdChodG1sOiBzdHJpbmcsIG1hdGNoOiBzdHJpbmcpIHtcbiAgICBjb25zdCByb290ID0gcGFyc2UoaHRtbCwge1xuICAgICAgICBibG9ja1RleHRFbGVtZW50czoge1xuICAgICAgICAgICAgc2NyaXB0OiBmYWxzZSxcbiAgICAgICAgICAgIHN0eWxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vc2NyaXB0OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aXRsZXM6IFN0cmluZ01hcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChtYXRjaCkpIHtcbiAgICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmF0dHJpYnV0ZXNbJ2lkJ107XG4gICAgICAgIHRpdGxlc1tpZF0gPSBlbGVtZW50LmlubmVyVGV4dC50cmltKCk7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGVzLFxuICAgICAgICB0ZXh0OiByb290LmlubmVyVGV4dC50cmltKCkucmVwbGFjZSgvWyBcXG5dezIsfS9nLCAnICcpLnJlcGxhY2UoL1tcXG5dL2csICcgJylcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vQ29tcG9uZW50cy9jbGllbnQnO1xuaW1wb3J0IHNjcmlwdCBmcm9tICcuL0NvbXBvbmVudHMvc2NyaXB0L2luZGV4JztcbmltcG9ydCBzdHlsZSBmcm9tICcuL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgnO1xuaW1wb3J0IHBhZ2UgZnJvbSAnLi9Db21wb25lbnRzL3BhZ2UnO1xuaW1wb3J0IGlzb2xhdGUgZnJvbSAnLi9Db21wb25lbnRzL2lzb2xhdGUnO1xuaW1wb3J0IHN2ZWx0ZSBmcm9tICcuL0NvbXBvbmVudHMvc3ZlbHRlJztcbmltcG9ydCBtYXJrZG93biBmcm9tICcuL0NvbXBvbmVudHMvbWFya2Rvd24nO1xuaW1wb3J0IGhlYWQsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkSGVhZCB9IGZyb20gJy4vQ29tcG9uZW50cy9oZWFkJztcbmltcG9ydCBjb25uZWN0LCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZENvbm5lY3QsIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JDb25uZWN0IH0gZnJvbSAnLi9Db21wb25lbnRzL2Nvbm5lY3QnO1xuaW1wb3J0IGZvcm0sIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkRm9ybSwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckZvcm0gfSBmcm9tICcuL0NvbXBvbmVudHMvZm9ybSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCByZWNvcmQsIHsgdXBkYXRlUmVjb3JkcywgcGVyQ29tcGlsZSBhcyBwZXJDb21waWxlUmVjb3JkLCBwb3N0Q29tcGlsZSBhcyBwb3N0Q29tcGlsZVJlY29yZCwgZGVsZXRlQmVmb3JlUmVCdWlsZCB9IGZyb20gJy4vQ29tcG9uZW50cy9yZWNvcmQnO1xuaW1wb3J0IHNlYXJjaCBmcm9tICcuL0NvbXBvbmVudHMvc2VhcmNoJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBjb25zdCBBbGxCdWlsZEluID0gW1wiY2xpZW50XCIsIFwic2NyaXB0XCIsIFwic3R5bGVcIiwgXCJwYWdlXCIsIFwiY29ubmVjdFwiLCBcImlzb2xhdGVcIiwgXCJmb3JtXCIsIFwiaGVhZFwiLCBcInN2ZWx0ZVwiLCBcIm1hcmtkb3duXCIsIFwicmVjb3JkXCIsIFwic2VhcmNoXCJdO1xuXG5leHBvcnQgZnVuY3Rpb24gU3RhcnRDb21waWxpbmcocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgbGV0IHJlRGF0YTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PjtcblxuICAgIHN3aXRjaCAodHlwZS5lcS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgXCJjbGllbnRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNsaWVudChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyZWNvcmRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHJlY29yZCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VhcmNoXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzZWFyY2goIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2NyaXB0KCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN0eWxlKCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGFnZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcGFnZShwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjb25uZWN0KHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZm9ybVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gZm9ybShwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpc29sYXRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBpc29sYXRlKEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaGVhZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaGVhZChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdmVsdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN2ZWx0ZSh0eXBlLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1hcmtkb3duXCI6XG4gICAgICAgICAgICByZURhdGEgPSBtYXJrZG93bih0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wb25lbnQgaXMgbm90IGJ1aWxkIHlldFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNJbmNsdWRlKHRhZ25hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBBbGxCdWlsZEluLmluY2x1ZGVzKHRhZ25hbWUudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZykge1xuICAgIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbkluZm8pO1xuXG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdChwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZEZvcm0ocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoL0BDb25uZWN0SGVyZSg7PykvZ2ksICcnKS5yZXBsYWNlKC9AQ29ubmVjdEhlcmVGb3JtKDs/KS9naSwgJycpO1xuXG4gICAgcGFnZURhdGEgPSBhd2FpdCBhZGRGaW5hbGl6ZUJ1aWxkSGVhZChwYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGZ1bGxDb21waWxlUGF0aCk7XG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yU2VydmljZSh0eXBlOiBzdHJpbmcsIHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICh0eXBlID09ICdjb25uZWN0JylcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckNvbm5lY3QodGhpc1BhZ2UsIGNvbm5lY3RvckFycmF5KTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JGb3JtKHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgXG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBQYXJzZURlYnVnSW5mbywgQ3JlYXRlRmlsZVBhdGgsIFBhdGhUeXBlcywgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQWxsQnVpbGRJbiwgSXNJbmNsdWRlLCBTdGFydENvbXBpbGluZyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgQXJyYXlNYXRjaCB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQge0NvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciwgcG9vbCB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc2VydENvbXBvbmVudCBleHRlbmRzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIHB1YmxpYyBkaXJGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbjtcbiAgICBwdWJsaWMgQ29tcGlsZUluRmlsZTogQ29tcGlsZUluRmlsZUZ1bmM7XG4gICAgcHVibGljIE1pY3JvUGx1Z2luczogU3RyaW5nQXJyYXlPck9iamVjdDtcbiAgICBwdWJsaWMgR2V0UGx1Z2luOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XG4gICAgcHVibGljIFNvbWVQbHVnaW5zOiAoLi4ubmFtZXM6IHN0cmluZ1tdKSA9PiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1RzOiAoKSA9PiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZWdleFNlYXJjaDogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IoUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSAmJiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gZGF0YVRhZ1NwbGljZWQucmVidWlsZFNwYWNlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBjb21wb25lbnQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9ID0gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKGNvbXBvbmVudCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7a2V5LHZhbHVlfSBvZiB0YWdEYXRhLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBrZXksIFwiZ2lcIik7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UocmUsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhOiBUYWdEYXRhUGFyc2VyLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBpbXBvcnRTb3VyY2UgPSAnLycgKyB0eXBlLmV4dHJhY3RJbmZvKCk7XG5cbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZScsIGltcG9ydFNvdXJjZSlcbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZURpcmVjdG9yeScsIHBhdGguZGlybmFtZShpbXBvcnRTb3VyY2UpKVxuXG4gICAgICAgIGNvbnN0ICBtYXBBdHRyaWJ1dGVzID0gZGF0YS5tYXAoKTtcbiAgICAgICAgbWFwQXR0cmlidXRlcy5yZWFkZXIgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG5cbiAgICAgICAgcmV0dXJuIG1hcEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlciB9KSB7XG4gICAgICAgIGNvbnN0IGRhdGFQYXJzZXIgPSBuZXcgVGFnRGF0YVBhcnNlcihkYXRhVGFnKSwgQnVpbGRJbiA9IElzSW5jbHVkZSh0eXBlLmVxKTtcbiAgICAgICAgYXdhaXQgZGF0YVBhcnNlci5wYXJzZXIoKTtcblxuICAgICAgICBsZXQgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaEluQ29tbWVudCA9IHRydWUsIEFsbFBhdGhUeXBlczogUGF0aFR5cGVzID0ge30sIGFkZFN0cmluZ0luZm86IHN0cmluZztcblxuICAgICAgICBpZiAoQnVpbGRJbikgey8vY2hlY2sgaWYgaXQgYnVpbGQgaW4gY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCB7IGNvbXBpbGVkU3RyaW5nLCBjaGVja0NvbXBvbmVudHMgfSA9IGF3YWl0IFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lLCB0eXBlLCBkYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGFQYXJzZXIucG9wSGF2ZURlZmF1bHQoJ2ZvbGRlcicsICcuJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGFsbERhdGEsIHRoaXMuaXNUcygpKTtcblxuICAgICAgICAgICAgLyphZGQgc3BlY2lhbCBhdHRyaWJ1dGVzICovXG4gICAgICAgICAgICBjb25zdCBtYXBBdHRyaWJ1dGVzID0gSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGFQYXJzZXIsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCB7YXR0cmlidXRlczogbWFwQXR0cmlidXRlc30pO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhUGFyc2VyLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke3RhZ1R5cGV9XCIsIHVzZWQgaW46ICR7dGFnVHlwZS5hdCgwKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBwb29sIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ3MgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBDUnVuVGltZSBmcm9tIFwiLi9Db21waWxlXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5cbmNvbnN0IGlnbm9yZUluaGVyaXQgPSBbJ2NvZGVmaWxlJ107XG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7IGRlZmluZToge30gfTtcblxuYXN5bmMgZnVuY3Rpb24gUGFnZUJhc2VQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICBjaGFyOiBzdHJpbmdcbiAgICB9W11cbn0+IHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IHBvb2wuZXhlYygnUGFnZUJhc2VQYXJzZXInLCBbdGV4dF0pO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBhcnNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsIGNoYXI/OiBzdHJpbmcgfVtdID0gW11cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIG5vbkR5bmFtaWMoaXNEeW5hbWljOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghaXNEeW5hbWljKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZUR5bmFtaWMgPSB0aGlzLnBvcEFueSgnZHluYW1pYycpO1xuICAgICAgICBpZiAoaGF2ZUR5bmFtaWMgIT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgICAgICBwYXJzZS5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgICAgIHBhcnNlLnZhbHVlQXJyYXkgPSBbLi4udGhpcy52YWx1ZUFycmF5LCB7IGtleTogJ2R5bmFtaWMnLCB2YWx1ZTogdHJ1ZSB9XTtcblxuICAgICAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHBhcnNlLmNsZWFyRGF0YS5lcSk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnZHluYW1pYy1zc3ItaW1wb3J0JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQWRkaW5nIFxcJ2R5bmFtaWNcXCcgYXR0cmlidXRlIHRvIGZpbGUgJyArIHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgeyBhdHRyaWJ1dGVzLCBkeW5hbWljQ2hlY2t9OiB7IGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXAsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCB0aGlzLnNlc3Npb25JbmZvLCBzbWFsbFBhdGgsIHRoaXMuaXNUcyk7XG4gICAgICAgIHRoaXMuY29kZSA9IGF3YWl0IHJ1bi5jb21waWxlKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGFyc2VCYXNlKHRoaXMuY29kZSk7XG4gICAgICAgIGlmKHRoaXMubm9uRHluYW1pYyhkeW5hbWljQ2hlY2spKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkQ29kZUZpbGUocGFnZVBhdGgsIHNtYWxsUGF0aCwgdGhpcy5pc1RzLCBwYWdlTmFtZSk7XG5cbiAgICAgICAgdGhpcy5sb2FkRGVmaW5lKHsgLi4uc2V0dGluZ3MuZGVmaW5lLCAuLi5ydW4uZGVmaW5lIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gYXdhaXQgUGFnZUJhc2VQYXJzZXIoY29kZS5lcSk7XG5cbiAgICAgICAgaWYocGFyc2VyLnN0YXJ0ID09IHBhcnNlci5lbmQpe1xuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBjb2RlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGNvbnN0IHtjaGFyLGVuZCxrZXksc3RhcnR9IG9mIHBhcnNlci52YWx1ZXMpe1xuICAgICAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goe2tleSwgdmFsdWU6IHN0YXJ0ID09PSBlbmQgPyB0cnVlOiBjb2RlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgY2hhcn0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUuc3Vic3RyaW5nKDAsIHBhcnNlci5zdGFydCkuUGx1cyhjb2RlLnN1YnN0cmluZyhwYXJzZXIuZW5kKSkudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZiAoIXRoaXMudmFsdWVBcnJheS5sZW5ndGgpIHJldHVybiB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnQFsnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSwgY2hhciB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9PSR7Y2hhcn0ke3ZhbHVlfSR7Y2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9IGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkLnN1YnN0cmluZygwLCBidWlsZC5sZW5ndGgtMSkuUGx1cygnXVxcbicpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGF3YWl0IHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBpZihpZ25vcmVJbmhlcml0LmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcGFyc2UucG9wKG5hbWUpXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGA8QCR7bmFtZX0+PDoke25hbWV9Lz48L0Ake25hbWV9PmApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZS5yZWJ1aWxkKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlLmNsZWFyRGF0YS5QbHVzKGJ1aWxkKTtcbiAgICB9XG5cbiAgICBnZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3AobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleSA9PT0gbmFtZSksIDEpWzBdPy52YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BBbnkobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmVOYW1lID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LnRvTG93ZXJDYXNlKCkgPT0gbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhdmVOYW1lICE9IC0xKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaGF2ZU5hbWUsIDEpWzBdLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFzVGFnID0gZ2V0RGF0YVRhZ3ModGhpcy5jbGVhckRhdGEsIFtuYW1lXSwgJ0AnKTtcblxuICAgICAgICBpZiAoIWFzVGFnLmZvdW5kWzBdKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBhc1RhZy5kYXRhO1xuXG4gICAgICAgIHJldHVybiBhc1RhZy5mb3VuZFswXS5kYXRhLnRyaW0oKTtcbiAgICB9XG5cbiAgICBieVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maWx0ZXIoeCA9PiB4LnZhbHVlICE9PSB0cnVlICYmIHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBkZWZhdWx0VmFsdWVQb3BBbnk8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IFQpOiBzdHJpbmcgfCBUIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wb3BBbnkobmFtZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlPy5lcTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5kZWZhdWx0VmFsdWVQb3BBbnkoJ2NvZGVmaWxlJywgJ2luaGVyaXQnKTtcbiAgICAgICAgaWYgKCFoYXZlQ29kZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLmRlZmF1bHRWYWx1ZVBvcEFueSgnbGFuZycsICdqcycpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gaGF2ZUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYWdlUGF0aDtcblxuICAgICAgICBjb25zdCBoYXZlRXh0ID0gcGF0aC5leHRuYW1lKGhhdmVDb2RlKS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoaGF2ZUV4dCkpIHtcbiAgICAgICAgICAgIGlmICgvKFxcXFx8XFwvKSQvLnRlc3QoaGF2ZUNvZGUpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhZ2VQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGlmICghQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhoYXZlRXh0KSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYXRoLmV4dG5hbWUocGFnZVBhdGgpO1xuICAgICAgICAgICAgaGF2ZUNvZGUgKz0gJy4nICsgKGxhbmcgPyBsYW5nIDogaXNUcyA/ICd0cycgOiAnanMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQ29kZVswXSA9PSAnLicpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocGFnZVBhdGgpLCBoYXZlQ29kZSlcblxuICAgICAgICBjb25zdCBTbWFsbFBhdGggPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGhhdmVDb2RlKTtcblxuICAgICAgICBpZiAoYXdhaXQgdGhpcy5zZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgaGF2ZUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IGJhc2VNb2RlbERhdGEuYWxsRGF0YS5yZXBsYWNlQWxsKFwiQFwiLCBcIkBAXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soJzwlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEFmdGVyTm9UcmFjaygnJT4nKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcgJiYgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgfSBlbHNlIGlmKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnICYmIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcpe1xuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShoYXZlQ29kZSwgJycpO1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NyZWF0ZS1jb2RlLWZpbGUnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgY3JlYXRlZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlLWZpbGUtbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgSlNQYXJzZXIucHJpbnRFcnJvcihgQ29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nYCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgc3RyaW5nKVtdW10gPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcy51bnNoaWZ0KC4uLk9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpKVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IENvbnZlcnRTeW50YXhNaW5pIH0gZnJvbSBcIi4uLy4uL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4XCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSBcIi4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENSdW5UaW1lIHtcbiAgICBkZWZpbmUgPSB7fVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzY3JpcHQ6IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBpc1RzOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHRlbXBsYXRlU2NyaXB0KHNjcmlwdHM6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG5fX3dyaXRlID0ge3RleHQ6ICcnfTtfX3dyaXRlQXJyYXkudW5zaGlmdChfX3dyaXRlKTtgKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhpKVxuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxucmV0dXJuIF9fd3JpdGVBcnJheWApO1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXRob2RzKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgY29uc3QgX19sb2NhbHBhdGggPSAnLycgKyBzbWFsbFBhdGhUb1BhZ2UodGhpcy5zZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RyaW5nOiAnc2NyaXB0LHN0eWxlLGRlZmluZSxzdG9yZSxwYWdlX19maWxlbmFtZSxwYWdlX19kaXJuYW1lLF9fbG9jYWxwYXRoLGF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgZnVuY3M6IFtcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnNjcmlwdC5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc3R5bGUuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHRoaXMuZGVmaW5lW1N0cmluZyhrZXkpXSA9IHZhbHVlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY29tcGlsZVJ1blRpbWVTdG9yZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoLFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoKSxcbiAgICAgICAgICAgICAgICBfX2xvY2FscGF0aCxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzIHx8IHt9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGRDb2RlKHBhcnNlcjogSlNQYXJzZXIsIGJ1aWxkU3RyaW5nczogeyB0ZXh0OiBzdHJpbmcgfVtdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKGkudGV4dC50cmltRW5kKCkpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhidWlsZFN0cmluZ3MucG9wKCkudGV4dCwgaS50ZXh0LkRlZmF1bHRJbmZvVGV4dC5pbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBhc3luYyBjb21waWxlKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgLyogbG9hZCBmcm9tIGNhY2hlICovXG4gICAgICAgIGNvbnN0IGhhdmVDYWNoZSA9IHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXTtcbiAgICAgICAgaWYgKGhhdmVDYWNoZSlcbiAgICAgICAgICAgIHJldHVybiAoYXdhaXQgaGF2ZUNhY2hlKSh0aGlzLm1ldGhvZHMoYXR0cmlidXRlcykuZnVuY3MpO1xuICAgICAgICBsZXQgZG9Gb3JBbGw6IChyZXNvbHZlOiAoZnVuY3M6IGFueVtdKSA9PiBTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPikgPT4gdm9pZDtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gbmV3IFByb21pc2UociA9PiBkb0ZvckFsbCA9IHIpO1xuXG4gICAgICAgIC8qIHJ1biB0aGUgc2NyaXB0ICovXG4gICAgICAgIHRoaXMuc2NyaXB0ID0gYXdhaXQgQ29udmVydFN5bnRheE1pbmkodGhpcy5zY3JpcHQsIFwiQGNvbXBpbGVcIiwgXCIqXCIpO1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGhpcy5zY3JpcHQsIHRoaXMuc21hbGxQYXRoLCAnPCUqJywgJyU+Jyk7XG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGlmIChwYXJzZXIudmFsdWVzLmxlbmd0aCA9PSAxICYmIHBhcnNlci52YWx1ZXNbMF0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlID0gKCkgPT4gdGhpcy5zY3JpcHQ7XG4gICAgICAgICAgICBkb0ZvckFsbChyZXNvbHZlKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdHlwZSwgZmlsZVBhdGhdID0gU3BsaXRGaXJzdCgnLycsIHRoaXMuc21hbGxQYXRoKSwgdHlwZUFycmF5ID0gZ2V0VHlwZXNbdHlwZV0gPz8gZ2V0VHlwZXMuU3RhdGljLFxuICAgICAgICAgICAgY29tcGlsZVBhdGggPSB0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY29tcC5qcyc7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoZmlsZVBhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlU2NyaXB0KHBhcnNlci52YWx1ZXMuZmlsdGVyKHggPT4geC50eXBlICE9ICd0ZXh0JykubWFwKHggPT4geC50ZXh0KSk7XG4gICAgICAgIGNvbnN0IHsgZnVuY3MsIHN0cmluZyB9ID0gdGhpcy5tZXRob2RzKGF0dHJpYnV0ZXMpXG5cbiAgICAgICAgY29uc3QgdG9JbXBvcnQgPSBhd2FpdCBjb21waWxlSW1wb3J0KHN0cmluZywgY29tcGlsZVBhdGgsIGZpbGVQYXRoLCB0eXBlQXJyYXksIHRoaXMuaXNUcywgdGhpcy5zZXNzaW9uSW5mby5kZWJ1ZywgdGVtcGxhdGUpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGUgPSBhc3luYyAoZnVuY3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYnVpbGRDb2RlKHBhcnNlciwgYXdhaXQgdG9JbXBvcnQoLi4uZnVuY3MpKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogZXJyLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSBleGVjdXRlOyAvLyBzYXZlIHRoaXMgdG8gY2FjaGVcbiAgICAgICAgY29uc3QgdGhpc0ZpcnN0ID0gYXdhaXQgZXhlY3V0ZShmdW5jcyk7XG4gICAgICAgIGRvRm9yQWxsKGV4ZWN1dGUpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNGaXJzdDtcbiAgICB9XG59IiwgImltcG9ydCB7IFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gXCJlc2J1aWxkLXdhc21cIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5U3ludGF4IGZyb20gXCIuLi9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheFwiO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gXCIuLi9Db21waWxlQ29kZS9KU1BhcnNlclwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4vcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgcGFnZURlcHMgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzXCI7XG5pbXBvcnQgQ3VzdG9tSW1wb3J0LCB7IGlzUGF0aEN1c3RvbSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9pbmRleFwiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3MsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZVwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCB9IGZyb20gXCIuLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZFwiO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvQWxpYXNcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuYXN5bmMgZnVuY3Rpb24gUmVwbGFjZUJlZm9yZShcbiAgY29kZTogc3RyaW5nLFxuICBkZWZpbmVEYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LFxuKSB7XG4gIGNvZGUgPSBhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlLCBkZWZpbmVEYXRhKTtcbiAgcmV0dXJuIGNvZGU7XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGNvZGU6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZGlyOiBzdHJpbmcsIGZpbGU6IHN0cmluZywgcGFyYW1zPzogc3RyaW5nKSB7XG4gIHJldHVybiBgJHtpc0RlYnVnID8gXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIgOiAnJ312YXIgX19kaXJuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGRpcilcbiAgICB9XCIsX19maWxlbmFtZT1cIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhmaWxlKVxuICAgIH1cIjttb2R1bGUuZXhwb3J0cyA9IChhc3luYyAocmVxdWlyZSR7cGFyYW1zID8gJywnICsgcGFyYW1zIDogJyd9KT0+e3ZhciBtb2R1bGU9e2V4cG9ydHM6e319LGV4cG9ydHM9bW9kdWxlLmV4cG9ydHM7JHtjb2RlfVxcbnJldHVybiBtb2R1bGUuZXhwb3J0czt9KTtgO1xufVxuXG5cbi8qKlxuICogSXQgdGFrZXMgYSBmaWxlIHBhdGgsIGFuZCByZXR1cm5zIHRoZSBjb21waWxlZCBjb2RlLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBjb21waWxlLlxuICogQHBhcmFtIHtzdHJpbmcgfCBudWxsfSBzYXZlUGF0aCAtIFRoZSBwYXRoIHRvIHNhdmUgdGhlIGNvbXBpbGVkIGZpbGUgdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZXNjcmlwdCAtIGJvb2xlYW5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gIC0gZmlsZVBhdGg6IFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcmV0dXJucyBUaGUgcmVzdWx0IG9mIHRoZSBzY3JpcHQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGZpbGVQYXRoOiBzdHJpbmcsIHNhdmVQYXRoOiBzdHJpbmcgfCBudWxsLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIHsgcGFyYW1zLCB0ZW1wbGF0ZVBhdGggPSBmaWxlUGF0aCwgY29kZU1pbmlmeSA9ICFpc0RlYnVnLCBtZXJnZVRyYWNrIH06IHsgY29kZU1pbmlmeT86IGJvb2xlYW4sIHRlbXBsYXRlUGF0aD86IHN0cmluZywgcGFyYW1zPzogc3RyaW5nLCBtZXJnZVRyYWNrPzogU3RyaW5nVHJhY2tlciB9ID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgIGZvcm1hdDogJ2NqcycsXG4gICAgbG9hZGVyOiBpc1R5cGVzY3JpcHQgPyAndHMnIDogJ2pzJyxcbiAgICBtaW5pZnk6IGNvZGVNaW5pZnksXG4gICAgc291cmNlbWFwOiBpc0RlYnVnID8gKG1lcmdlVHJhY2sgPyAnZXh0ZXJuYWwnIDogJ2lubGluZScpIDogZmFsc2UsXG4gICAgc291cmNlZmlsZTogc2F2ZVBhdGggJiYgcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpLCBmaWxlUGF0aCksXG4gICAgZGVmaW5lOiB7XG4gICAgICBkZWJ1ZzogXCJcIiArIGlzRGVidWdcbiAgICB9XG4gIH07XG5cbiAgbGV0IFJlc3VsdCA9IGF3YWl0IFJlcGxhY2VCZWZvcmUobWVyZ2VUcmFjaz8uZXEgfHwgYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZpbGVQYXRoKSwge30pO1xuICBSZXN1bHQgPSB0ZW1wbGF0ZShcbiAgICBSZXN1bHQsXG4gICAgaXNEZWJ1ZyxcbiAgICBwYXRoLmRpcm5hbWUodGVtcGxhdGVQYXRoKSxcbiAgICB0ZW1wbGF0ZVBhdGgsXG4gICAgcGFyYW1zXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvZGUsIHdhcm5pbmdzLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShSZXN1bHQsIE9wdGlvbnMpO1xuICAgIGlmIChtZXJnZVRyYWNrICYmIG1hcCkge1xuICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIHdhcm5pbmdzKTtcbiAgICAgIFJlc3VsdCA9IChhd2FpdCBiYWNrVG9PcmlnaW5hbChtZXJnZVRyYWNrLCBjb2RlLCBtYXApKS5TdHJpbmdXaXRoVGFjayhzYXZlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzLCBmaWxlUGF0aCk7XG4gICAgICBSZXN1bHQgPSBjb2RlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKG1lcmdlVHJhY2spIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihtZXJnZVRyYWNrLCBlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBFU0J1aWxkUHJpbnRFcnJvcihlcnIsIGZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc2F2ZVBhdGgpIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGguZGlybmFtZShzYXZlUGF0aCkpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoc2F2ZVBhdGgsIFJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIFJlc3VsdDtcbn1cblxuZnVuY3Rpb24gQ2hlY2tUcyhGaWxlUGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBGaWxlUGF0aC5lbmRzV2l0aChcIi50c1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChJblN0YXRpY1BhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgcmV0dXJuIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHR5cGVBcnJheVswXSArIEluU3RhdGljUGF0aCxcbiAgICB0eXBlQXJyYXlbMV0gKyBJblN0YXRpY1BhdGggKyBcIi5janNcIixcbiAgICBDaGVja1RzKEluU3RhdGljUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFkZEV4dGVuc2lvbihGaWxlUGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbGVFeHQgPSBwYXRoLmV4dG5hbWUoRmlsZVBhdGgpO1xuXG4gIGlmIChCYXNpY1NldHRpbmdzLnBhcnRFeHRlbnNpb25zLmluY2x1ZGVzKGZpbGVFeHQuc3Vic3RyaW5nKDEpKSlcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIChpc1RzKCkgPyBcInRzXCIgOiBcImpzXCIpXG4gIGVsc2UgaWYgKGZpbGVFeHQgPT0gJycpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyBCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc1tpc1RzKCkgPyBcInRzXCIgOiBcImpzXCJdO1xuXG4gIHJldHVybiBGaWxlUGF0aDtcbn1cblxuY29uc3QgU2F2ZWRNb2R1bGVzID0ge30sIFByZXBhcmVNYXAgPSB7fTtcblxuLyoqXG4gKiBMb2FkSW1wb3J0IGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggdG8gYSBmaWxlLCBhbmQgcmV0dXJucyB0aGUgbW9kdWxlIHRoYXQgaXMgYXQgdGhhdCBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1wb3J0RnJvbSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY3JlYXRlZCB0aGlzIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBJblN0YXRpY1BhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBbdXNlRGVwc10gLSBUaGlzIGlzIGEgbWFwIG9mIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHdpdGhvdXRDYWNoZSAtIGFuIGFycmF5IG9mIHBhdGhzIHRoYXQgd2lsbCBub3QgYmUgY2FjaGVkLlxuICogQHJldHVybnMgVGhlIG1vZHVsZSB0aGF0IHdhcyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gTG9hZEltcG9ydChpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCB7IGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcywgd2l0aG91dENhY2hlID0gW10sIG9ubHlQcmVwYXJlIH06IHsgaXNEZWJ1ZzogYm9vbGVhbiwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10sIG9ubHlQcmVwYXJlPzogYm9vbGVhbiB9KSB7XG4gIGxldCBUaW1lQ2hlY2s6IGFueTtcbiAgY29uc3Qgb3JpZ2luYWxQYXRoID0gcGF0aC5ub3JtYWxpemUoSW5TdGF0aWNQYXRoLnRvTG93ZXJDYXNlKCkpO1xuXG4gIEluU3RhdGljUGF0aCA9IEFkZEV4dGVuc2lvbihJblN0YXRpY1BhdGgpO1xuICBjb25zdCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoSW5TdGF0aWNQYXRoKS5zdWJzdHJpbmcoMSksIHRoaXNDdXN0b20gPSBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoLCBleHRlbnNpb24pIHx8ICFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoZXh0ZW5zaW9uKTtcbiAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aCksIGZpbGVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSwgSW5TdGF0aWNQYXRoKTtcblxuICAvL3dhaXQgaWYgdGhpcyBtb2R1bGUgaXMgb24gcHJvY2VzcywgaWYgbm90IGRlY2xhcmUgdGhpcyBhcyBvbiBwcm9jZXNzIG1vZHVsZVxuICBsZXQgcHJvY2Vzc0VuZDogKHY/OiBhbnkpID0+IHZvaWQ7XG4gIGlmKCFvbmx5UHJlcGFyZSl7XG4gICAgaWYgKCFTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0pXG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IHByb2Nlc3NFbmQgPSByKTtcbiAgICBlbHNlIGlmIChTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgYXdhaXQgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuICB9XG5cblxuICAvL2J1aWxkIHBhdGhzXG4gIGNvbnN0IHJlQnVpbGQgPSAhcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gfHwgcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gIT0gKFRpbWVDaGVjayA9IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCkpO1xuXG5cbiAgaWYgKHJlQnVpbGQpIHtcbiAgICBUaW1lQ2hlY2sgPSBUaW1lQ2hlY2sgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKTtcbiAgICBpZiAoVGltZUNoZWNrID09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7SW5TdGF0aWNQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7aW1wb3J0RnJvbX0nYFxuICAgICAgfSk7XG4gICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG51bGxcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXNDdXN0b20pIC8vIG9ubHkgaWYgbm90IGN1c3RvbSBidWlsZFxuICAgICAgYXdhaXQgQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcpO1xuICAgIHBhZ2VEZXBzLnVwZGF0ZShTYXZlZE1vZHVsZXNQYXRoLCBUaW1lQ2hlY2spO1xuICB9XG5cbiAgaWYgKHVzZURlcHMpIHtcbiAgICB1c2VEZXBzW0luU3RhdGljUGF0aF0gPSB7IHRoaXNGaWxlOiBUaW1lQ2hlY2sgfTtcbiAgICB1c2VEZXBzID0gdXNlRGVwc1tJblN0YXRpY1BhdGhdO1xuICB9XG5cbiAgY29uc3QgaW5oZXJpdGFuY2VDYWNoZSA9IHdpdGhvdXRDYWNoZVswXSA9PSBJblN0YXRpY1BhdGg7XG4gIGlmIChpbmhlcml0YW5jZUNhY2hlKVxuICAgIHdpdGhvdXRDYWNoZS5zaGlmdCgpXG4gIGVsc2UgaWYgKCFyZUJ1aWxkICYmIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSAmJiAhKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHJldHVybiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgucmVsYXRpdmUocCwgdHlwZUFycmF5WzBdKTtcbiAgICBlbHNlIHtcbiAgICAgIGlmIChwWzBdID09IFwiLlwiKSB7XG4gICAgICAgIHAgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKEluU3RhdGljUGF0aCksIHApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocFswXSAhPSBcIi9cIilcbiAgICAgICAgcmV0dXJuIEFsaWFzT3JQYWNrYWdlKHApO1xuICAgIH1cblxuICAgIHJldHVybiBMb2FkSW1wb3J0KGZpbGVQYXRoLCBwLCB0eXBlQXJyYXksIHsgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlOiBpbmhlcml0YW5jZUNhY2hlID8gd2l0aG91dENhY2hlIDogW10gfSk7XG4gIH1cblxuICBsZXQgTXlNb2R1bGU6IGFueTtcbiAgaWYgKHRoaXNDdXN0b20pIHtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGgsIGZpbGVQYXRoLCBleHRlbnNpb24sIHJlcXVpcmVNYXApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlcXVpcmVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIpO1xuICAgIE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHJlcXVpcmVQYXRoKTtcblxuICAgIGlmIChvbmx5UHJlcGFyZSkgeyAvLyBvbmx5IHByZXBhcmUgdGhlIG1vZHVsZSB3aXRob3V0IGFjdGl2ZWx5IGltcG9ydGluZyBpdFxuICAgICAgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSA9ICgpID0+IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE15TW9kdWxlID0gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gIH1cblxuICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBNeU1vZHVsZTtcbiAgcHJvY2Vzc0VuZD8uKCk7XG5cbiAgcmV0dXJuIE15TW9kdWxlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0RmlsZShpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZT86IHN0cmluZ1tdKSB7XG4gIGlmICghaXNEZWJ1Zykge1xuICAgIGNvbnN0IFNhdmVkTW9kdWxlc1BhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG4gICAgY29uc3QgaGF2ZUltcG9ydCA9IFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICAgIGlmIChoYXZlSW1wb3J0ICE9IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiBoYXZlSW1wb3J0O1xuICAgIGVsc2UgaWYgKFByZXBhcmVNYXBbU2F2ZWRNb2R1bGVzUGF0aF0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IGF3YWl0IFByZXBhcmVNYXBbU2F2ZWRNb2R1bGVzUGF0aF0oKTtcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG1vZHVsZTtcbiAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIExvYWRJbXBvcnQoaW1wb3J0RnJvbSwgSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIHtpc0RlYnVnLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGV9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVPbmNlKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgZmlsZVBhdGgsXG4gICAgdGVtcEZpbGUsXG4gICAgQ2hlY2tUcyhmaWxlUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBhd2FpdCBNeU1vZHVsZSgocGF0aDogc3RyaW5nKSA9PiBpbXBvcnQocGF0aCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUNqc1NjcmlwdChjb250ZW50OiBzdHJpbmcpIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG4gIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGVtcEZpbGUsIGNvbnRlbnQpO1xuXG4gIGNvbnN0IG1vZGVsID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIG1vZGVsO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmFrZSBzY3JpcHQgbG9jYXRpb24sIGEgZmlsZSBsb2NhdGlvbiwgYSB0eXBlIGFycmF5LCBhbmQgYSBib29sZWFuIGZvciB3aGV0aGVyIG9yIG5vdCBpdCdzXG4gKiBhIFR5cGVTY3JpcHQgZmlsZS4gSXQgdGhlbiBjb21waWxlcyB0aGUgc2NyaXB0IGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biB0aGUgbW9kdWxlXG4gKiBUaGlzIGlzIGZvciBSdW5UaW1lIENvbXBpbGUgU2NyaXB0c1xuICogQHBhcmFtIHtzdHJpbmd9IGdsb2JhbFByYW1zIC0gc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZyxcbiAqIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY3JpcHRMb2NhdGlvbiAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgc2NyaXB0IHRvIGJlIGNvbXBpbGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSAtIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBmaWxlIGZyb20gdGhlIHN0YXRpYyBmb2xkZXIuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBbc3RyaW5nLCBzdHJpbmddXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZVNjcmlwdCAtIGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBJZiB0cnVlLCB0aGUgY29kZSB3aWxsIGJlIGNvbXBpbGVkIHdpdGggZGVidWcgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZUNvZGUgLSBUaGUgY29kZSB0aGF0IHdpbGwgYmUgY29tcGlsZWQgYW5kIHNhdmVkIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU1hcENvbW1lbnQgLSBzdHJpbmdcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVJbXBvcnQoZ2xvYmFsUHJhbXM6IHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgbWVyZ2VUcmFjazogU3RyaW5nVHJhY2tlcikge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgdHlwZUFycmF5WzFdKTtcblxuICBjb25zdCBmdWxsU2F2ZUxvY2F0aW9uID0gc2NyaXB0TG9jYXRpb24gKyBcIi5janNcIjtcbiAgY29uc3QgdGVtcGxhdGVQYXRoID0gdHlwZUFycmF5WzBdICsgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlO1xuXG4gIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHNjcmlwdExvY2F0aW9uLFxuICAgIGZ1bGxTYXZlTG9jYXRpb24sXG4gICAgaXNUeXBlU2NyaXB0LFxuICAgIGlzRGVidWcsXG4gICAgeyBwYXJhbXM6IGdsb2JhbFByYW1zLCBtZXJnZVRyYWNrLCB0ZW1wbGF0ZVBhdGgsIGNvZGVNaW5pZnk6IGZhbHNlIH1cbiAgKTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHApO1xuXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQodGVtcGxhdGVQYXRoLCBwLCB0eXBlQXJyYXksIHtpc0RlYnVnfSk7XG4gIH1cblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShmdWxsU2F2ZUxvY2F0aW9uKTtcbiAgcmV0dXJuIGFzeW5jICguLi5hcnI6IGFueVtdKSA9PiBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwLCAuLi5hcnIpO1xufSIsICJpbXBvcnQgeyBTdHJpbmdNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBNaW5pU2VhcmNoLCB7U2VhcmNoT3B0aW9ucywgU2VhcmNoUmVzdWx0fSBmcm9tICdtaW5pc2VhcmNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoUmVjb3JkIHtcbiAgICBwcml2YXRlIGZ1bGxQYXRoOiBzdHJpbmdcbiAgICBwcml2YXRlIGluZGV4RGF0YToge1trZXk6IHN0cmluZ106IHtcbiAgICAgICAgdGl0bGVzOiBTdHJpbmdNYXAsXG4gICAgICAgIHRleHQ6IHN0cmluZ1xuICAgIH19XG4gICAgcHJpdmF0ZSBtaW5pU2VhcmNoOiBNaW5pU2VhcmNoO1xuICAgIGNvbnN0cnVjdG9yKGZpbGVwYXRoOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgZmlsZXBhdGggKyAnLmpzb24nXG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZCgpe1xuICAgICAgICB0aGlzLmluZGV4RGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5mdWxsUGF0aCk7XG4gICAgICAgIGNvbnN0IHVud3JhcHBlZDoge2lkOiBudW1iZXIsIHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9W10gPSBbXTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGZvcihjb25zdCBwYXRoIGluIHRoaXMuaW5kZXhEYXRhKXtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmluZGV4RGF0YVtwYXRoXTtcbiAgICAgICAgICAgIGZvcihjb25zdCBpZCBpbiBlbGVtZW50LnRpdGxlcyl7XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGl0bGVzW2lkXSwgdXJsOiBgLyR7cGF0aH0jJHtpZH1gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50ZXh0LCB1cmw6IGAvJHtwYXRofWB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWluaVNlYXJjaCA9IG5ldyBNaW5pU2VhcmNoKHtcbiAgICAgICAgICAgIGZpZWxkczogWyd0ZXh0J10sXG4gICAgICAgICAgICBzdG9yZUZpZWxkczogWydpZCcsICd0ZXh0JywgJ3VybCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMubWluaVNlYXJjaC5hZGRBbGxBc3luYyh1bndyYXBwZWQpO1xuICAgIH1cblxuLyoqXG4gKiBJdCBzZWFyY2hlcyBmb3IgYSBzdHJpbmcgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgbWF0Y2hlc1xuICogQHBhcmFtIHRleHQgLSBUaGUgdGV4dCB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIG9wdGlvbnMgLSBsZW5ndGggLSBtYXhpbXVtIGxlbmd0aCAtICpub3QgY3V0dGluZyBoYWxmIHdvcmRzKlxuICogXG4gKiBhZGRBZnRlck1heExlbmd0aCAtIGFkZCB0ZXh0IGlmIGEgdGV4dCByZXN1bHQgcmVhY2ggdGhlIG1heGltdW0gbGVuZ3RoLCBmb3IgZXhhbXBsZSAnLi4uJ1xuICogQHBhcmFtIHRhZyAtIFRoZSB0YWcgdG8gd3JhcCBhcm91bmQgdGhlIGZvdW5kZWQgc2VhcmNoIHRlcm1zLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgY29udGFpbmluZyB0aGUgYHRleHRgIG9mIHRoZSBzZWFyY2ggcmVzdWx0LCBgbGlua2AgdG8gdGhlIHBhZ2UsIGFuZCBhbiBhcnJheSBvZlxuICogb2JqZWN0cyBjb250YWluaW5nIHRoZSB0ZXJtcyBhbmQgdGhlIGluZGV4IG9mIHRoZSB0ZXJtIGluIHRoZSB0ZXh0LlxuICovXG4gICAgc2VhcmNoKHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyAmIHtsZW5ndGg/OiBudW1iZXIsIGFkZEFmdGVyTWF4TGVuZ3RoPzogc3RyaW5nfSA9IHtmdXp6eTogdHJ1ZSwgbGVuZ3RoOiAyMDAsIGFkZEFmdGVyTWF4TGVuZ3RoOiAnLi4uJ30sIHRhZyA9ICdiJyk6IChTZWFyY2hSZXN1bHQgJiB7dGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZ30pW117XG4gICAgICAgIGNvbnN0IGRhdGEgPSA8YW55PnRoaXMubWluaVNlYXJjaC5zZWFyY2godGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIGlmKCF0YWcpIHJldHVybiBkYXRhO1xuXG4gICAgICAgIGZvcihjb25zdCBpIG9mIGRhdGEpe1xuICAgICAgICAgICAgZm9yKGNvbnN0IHRlcm0gb2YgaS50ZXJtcyl7XG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5sZW5ndGggJiYgaS50ZXh0Lmxlbmd0aCA+IG9wdGlvbnMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gaS50ZXh0LnN1YnN0cmluZygwLCBvcHRpb25zLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGkudGV4dFtvcHRpb25zLmxlbmd0aF0udHJpbSgpICE9ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IHN1YnN0cmluZy5zdWJzdHJpbmcoMCwgc3Vic3RyaW5nLmxhc3RJbmRleE9mKCcgJykpICsgKG9wdGlvbnMuYWRkQWZ0ZXJNYXhMZW5ndGggPz8gJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaS50ZXh0ID0gc3Vic3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS50ZXh0ID0gaS50ZXh0LnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyID0gaS50ZXh0LnRvTG93ZXJDYXNlKCksIHJlYnVpbGQgPSAnJztcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIGxldCBiZWVuTGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGluZGV4ICE9IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgcmVidWlsZCArPSBpLnRleHQuc3Vic3RyaW5nKGJlZW5MZW5ndGgsIGJlZW5MZW5ndGggKyBpbmRleCkgKyAgYDwke3RhZ30+JHtpLnRleHQuc3Vic3RyaW5nKGluZGV4ICsgYmVlbkxlbmd0aCwgaW5kZXggKyB0ZXJtLmxlbmd0aCArIGJlZW5MZW5ndGgpfTwvJHt0YWd9PmBcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBsb3dlci5zdWJzdHJpbmcoaW5kZXggKyB0ZXJtLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJlZW5MZW5ndGggKz0gaW5kZXggKyB0ZXJtLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGkudGV4dCA9IHJlYnVpbGQgKyBpLnRleHQuc3Vic3RyaW5nKGJlZW5MZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgc3VnZ2VzdCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMpe1xuICAgICAgICByZXR1cm4gdGhpcy5taW5pU2VhcmNoLmF1dG9TdWdnZXN0KHRleHQsIG9wdGlvbnMpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFNlYXJjaFJlY29yZCBmcm9tIFwiLi4vLi4vLi4vQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkXCJcbmltcG9ydCB7U2V0dGluZ3N9ICBmcm9tICcuLi8uLi8uLi9NYWluQnVpbGQvU2VydmVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1NldHRpbmdzLCBTZWFyY2hSZWNvcmR9O1xufSIsICJpbXBvcnQgcGFja2FnZUV4cG9ydCBmcm9tIFwiLi9wYWNrYWdlRXhwb3J0XCI7XG5cbi8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBhbGlhc05hbWVzID0gW3BhY2thZ2VOYW1lXVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoOiBzdHJpbmcpOiBhbnkge1xuXG4gICAgc3dpdGNoIChvcmlnaW5hbFBhdGgpIHtcbiAgICAgICAgLy9AdHMtaWdub3JlLW5leHQtbGluZVxuICAgICAgICBjYXNlIHBhY2thZ2VOYW1lOlxuICAgICAgICAgICAgcmV0dXJuIHBhY2thZ2VFeHBvcnQoKVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFsaWFzT3JQYWNrYWdlKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgaGF2ZSA9IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGhhdmUpIHJldHVybiBoYXZlXG4gICAgcmV0dXJuIGltcG9ydChvcmlnaW5hbFBhdGgpO1xufSIsICJpbXBvcnQgSW1wb3J0QWxpYXMsIHsgYWxpYXNOYW1lcyB9IGZyb20gJy4vQWxpYXMnO1xuaW1wb3J0IEltcG9ydEJ5RXh0ZW5zaW9uLCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi9FeHRlbnNpb24vaW5kZXgnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNQYXRoQ3VzdG9tKG9yaWdpbmFsUGF0aDogc3RyaW5nLCBleHRlbnNpb246IHN0cmluZykge1xuICAgIHJldHVybiBjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pIHx8IGFsaWFzTmFtZXMuaW5jbHVkZXMob3JpZ2luYWxQYXRoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ3VzdG9tSW1wb3J0KG9yaWdpbmFsUGF0aDogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nLCBleHRlbnNpb246IHN0cmluZywgcmVxdWlyZTogKHA6IHN0cmluZykgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxpYXNFeHBvcnQgPSBhd2FpdCBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGgpO1xuICAgIGlmIChhbGlhc0V4cG9ydCkgcmV0dXJuIGFsaWFzRXhwb3J0O1xuICAgIHJldHVybiBJbXBvcnRCeUV4dGVuc2lvbihmdWxsUGF0aCwgZXh0ZW5zaW9uKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgUmF6b3JUb0VKUywgUmF6b3JUb0VKU01pbmkgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlcic7XG5cblxuY29uc3QgYWRkV3JpdGVNYXAgPSB7XG4gICAgXCJpbmNsdWRlXCI6IFwiYXdhaXQgXCIsXG4gICAgXCJpbXBvcnRcIjogXCJhd2FpdCBcIixcbiAgICBcInRyYW5zZmVyXCI6IFwicmV0dXJuIGF3YWl0IFwiXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXgodGV4dDogU3RyaW5nVHJhY2tlciwgb3B0aW9ucz86IGFueSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlModGV4dC5lcSk7XG4gICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHZhbHVlcykge1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgIHN3aXRjaCAoaS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoc3Vic3RyaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlPSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJlc2NhcGVcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JToke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHthZGRXcml0ZU1hcFtpLm5hbWVdfSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBidWlsZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0U3ludGF4TWluaSB0YWtlcyB0aGUgY29kZSBhbmQgYSBzZWFyY2ggc3RyaW5nIGFuZCBjb252ZXJ0IGN1cmx5IGJyYWNrZXRzXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IHRleHQgLSBUaGUgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaW5kIC0gVGhlIHN0cmluZyB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IGFkZEVKUyAtIFRoZSBzdHJpbmcgdG8gYWRkIHRvIHRoZSBzdGFydCBvZiB0aGUgZWpzLlxuICogQHJldHVybnMgQSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4TWluaSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaW5kOiBzdHJpbmcsIGFkZEVKUzogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKU01pbmkodGV4dC5lcSwgZmluZCk7XG4gICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgaWYgKHZhbHVlc1tpXSAhPSB2YWx1ZXNbaSArIDFdKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaV0sIHZhbHVlc1tpICsgMV0pKTtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcodmFsdWVzW2kgKyAyXSwgdmFsdWVzW2kgKyAzXSk7XG4gICAgICAgIGJ1aWxkLlBsdXMkYDwlJHthZGRFSlN9JHtzdWJzdHJpbmd9JT5gO1xuICAgIH1cblxuICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcoKHZhbHVlcy5hdCgtMSk/Py0xKSArIDEpKTtcblxuICAgIHJldHVybiBidWlsZDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBwb29sIH0gZnJvbSBcIi4uL0Jhc2VSZWFkZXIvUmVhZGVyXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIEhUTUxBdHRyUGFyc2VyKHRleHQ6IHN0cmluZyk6IFByb21pc2U8e1xuICAgIHNrOiBudW1iZXIsXG4gICAgZWs6IG51bWJlcixcbiAgICBzdjogbnVtYmVyLFxuICAgIGV2OiBudW1iZXIsXG4gICAgc3BhY2U6IGJvb2xlYW4sXG4gICAgY2hhcjogc3RyaW5nXG59W10+IHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IHBvb2wuZXhlYygnSFRNTEF0dHJQYXJzZXInLCBbdGV4dF0pXG4gICAgcmV0dXJuIEpTT04ucGFyc2UocGFyc2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWdEYXRhUGFyc2VyIHtcbiAgICB2YWx1ZUFycmF5OiB7XG4gICAgICAgIGtleT86IFN0cmluZ1RyYWNrZXJcbiAgICAgICAgdmFsdWU6IFN0cmluZ1RyYWNrZXIgfCB0cnVlLFxuICAgICAgICBzcGFjZTogYm9vbGVhbixcbiAgICAgICAgY2hhcj86IHN0cmluZ1xuICAgIH1bXSA9IFtdXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHBhcnNlcigpIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBhd2FpdCBIVE1MQXR0clBhcnNlcih0aGlzLnRleHQuZXEpO1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBjaGFyLCBlaywgZXYsIHNrLCBzcGFjZSwgc3YgfSBvZiBwYXJzZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goeyBjaGFyLCBzcGFjZSwga2V5OiB0aGlzLnRleHQuc3Vic3RyaW5nKHNrLCBlayksIHZhbHVlOiBzdiA9PSBldiA/IHRydWUgOiB0aGlzLnRleHQuc3Vic3RyaW5nKHN2LCBldikgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcG9wSXRlbShrZXk6IHN0cmluZyl7XG4gICAgICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSk7XG4gICAgICAgIHJldHVybiBpbmRleCA9PSAtMSA/IG51bGw6IHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaW5kZXgsIDEpLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgcG9wVHJhY2tlcihrZXk6IHN0cmluZyk6IFN0cmluZ1RyYWNrZXIgfCBudWxsIHwgYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcEl0ZW0oa2V5KT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3BIYXZlRGVmYXVsdFRyYWNrZXI8VCA9IHN0cmluZz4oa2V5OiBzdHJpbmcsIHZhbHVlOiBUID0gPGFueT4nJyk6IFN0cmluZ1RyYWNrZXIgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFRyYWNrZXIoa2V5KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSAnYm9vbGVhbicgPyB2YWx1ZSA6IGRhdGE7XG4gICAgfVxuXG4gICAgcG9wQW55VHJhY2tlcjxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogc3RyaW5nIHwgbnVsbCB8IFQge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5wb3BUcmFja2VyKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlciA/IGRhdGEuZXE6IHZhbHVlO1xuICAgIH1cblxuICAgIHBvcFN0cmluZyhrZXk6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgfCBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBvcEl0ZW0oa2V5KT8udmFsdWVcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlciA/IHZhbHVlLmVxIDogdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wQm9vbGVhbihrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlPzogYm9vbGVhbikge1xuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLnBvcFN0cmluZyhrZXkpID8/IGRlZmF1bHRWYWx1ZSlcbiAgICB9XG5cbiAgICBleGlzdHMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpICE9IG51bGxcbiAgICB9XG5cbiAgICBwb3BIYXZlRGVmYXVsdDxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogc3RyaW5nIHwgbnVsbCB8IFQge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5wb3BTdHJpbmcoa2V5KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSAnYm9vbGVhbicgPyB2YWx1ZSA6IGRhdGE7XG4gICAgfVxuXG4gICAgcG9wQW55RGVmYXVsdDxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogc3RyaW5nIHwgbnVsbCB8IFQge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5wb3BTdHJpbmcoa2V5KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyA/IGRhdGE6IHZhbHVlO1xuICAgIH1cblxuICAgIGFkZENsYXNzKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0gJ2NsYXNzJyk7XG4gICAgICAgIGlmIChoYXZlPy52YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpXG4gICAgICAgICAgICBoYXZlLnZhbHVlLkFkZFRleHRBZnRlck5vVHJhY2soJyAnICsgY2xhc3NOYW1lKS50cmltU3RhcnQoKTtcbiAgICAgICAgZWxzZSBpZiAoaGF2ZT8udmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGhhdmUudmFsdWUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wdXNoVmFsdWUoJ2NsYXNzJywgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYnVpbGRTcGFjZSgpIHtcbiAgICAgICAgY29uc3QgbmV3QXR0cmlidXRlcyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IHZhbHVlLCBjaGFyLCBrZXksIHNwYWNlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBzcGFjZSAmJiBuZXdBdHRyaWJ1dGVzLkFkZFRleHRBZnRlck5vVHJhY2soJyAnKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzKGtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMuUGx1cyRgJHtrZXl9PSR7Y2hhcn0ke3ZhbHVlfSR7Y2hhcn1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0F0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgcHVzaFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KTtcbiAgICAgICAgaWYgKGhhdmUpIHJldHVybiAoaGF2ZS52YWx1ZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKSk7XG5cbiAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goeyBrZXk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGtleSksIHZhbHVlOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB2YWx1ZSksIGNoYXI6ICdcIicsIHNwYWNlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIG1hcCgpIHtcbiAgICAgICAgY29uc3QgYXR0ck1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCB0cnVlIH0gPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgaWYgKGtleSkgYXR0ck1hcFtrZXkuZXFdID0gdmFsdWUgPT09IHRydWUgPyB0cnVlIDogdmFsdWUuZXE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXR0ck1hcDtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmluYWxpemVCdWlsZCB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuXG5cbmV4cG9ydCBjbGFzcyBQYWdlVGVtcGxhdGUgZXh0ZW5kcyBKU1BhcnNlciB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBBZGRQYWdlVGVtcGxhdGUodGV4dDogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgdHJ5IHtcXG5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IChfcmVxdWlyZSwgX2luY2x1ZGUsIF90cmFuc2ZlciwgcHJpdmF0ZV92YXIsIGhhbmRlbENvbm5lY3RvcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IF9fZmlsZW5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhzZXNzaW9uSW5mby5mdWxsUGF0aCl9XCIsIF9fZGlybmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHBhdGguZGlybmFtZShzZXNzaW9uSW5mby5mdWxsUGF0aCkpfVwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgeyBzZW5kRmlsZSwgd3JpdGVTYWZlLCB3cml0ZSwgZWNobywgc2V0UmVzcG9uc2UsIG91dF9ydW5fc2NyaXB0LCBydW5fc2NyaXB0X25hbWUsIFJlc3BvbnNlLCBSZXF1ZXN0LCBQb3N0LCBRdWVyeSwgU2Vzc2lvbiwgRmlsZXMsIENvb2tpZXMsIFBhZ2VWYXIsIEdsb2JhbFZhcn0gPSBwYWdlLFxuXG4gICAgICAgICAgICAgICAgICAgIHJ1bl9zY3JpcHRfY29kZSA9IHJ1bl9zY3JpcHRfbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHtgKTtcblxuXG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYFxcbn1cbiAgICAgICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdF9maWxlID0gcnVuX3NjcmlwdF9uYW1lLnNwbGl0KC8tPnw8bGluZT4vKS5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9uYW1lICs9ICcgLT4gPGxpbmU+JyArIGUuc3RhY2suc3BsaXQoL1xcXFxuKCApKmF0IC8pWzJdO1xuICAgICAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcke1BhZ2VUZW1wbGF0ZS5wcmludEVycm9yKGA8cD5FcnJvciBwYXRoOiAnICsgcnVuX3NjcmlwdF9uYW1lLnJlcGxhY2UoLzxsaW5lPi9naSwgJzxici8+JykgKyAnPC9wPjxwPkVycm9yIG1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UgKyAnPC9wPmApfSc7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGF0aDogXCIgKyBydW5fc2NyaXB0X25hbWUuc2xpY2UoMCwgLWxhc3RfZmlsZS5sZW5ndGgpLnJlcGxhY2UoLzxsaW5lPi9naSwgJ1xcXFxuJykpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoKX1cIiArIGxhc3RfZmlsZS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbWVzc2FnZTogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcnVubmluZyB0aGlzIGNvZGU6IFxcXFxcIlwiICsgcnVuX3NjcmlwdF9jb2RlICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzdGFjazogXCIgKyBlLnN0YWNrKTtcbiAgICAgICAgICAgICAgICB9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYH19KTt9YCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIGNvbnN0IGJ1aWx0Q29kZSA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5SdW5BbmRFeHBvcnQodGV4dCwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgICAgICByZXR1cm4gUGFnZVRlbXBsYXRlLkFkZFBhZ2VUZW1wbGF0ZShidWlsdENvZGUsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgQWRkQWZ0ZXJCdWlsZCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKFwicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgSW5QYWdlVGVtcGxhdGUodGV4dDogU3RyaW5nVHJhY2tlciwgZGF0YU9iamVjdDogYW55LCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYDwlIXtcbiAgICAgICAgICAgIGNvbnN0IF9wYWdlID0gcGFnZTtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB7Li4uX3BhZ2Uke2RhdGFPYmplY3QgPyAnLCcgKyBkYXRhT2JqZWN0IDogJyd9fTtcbiAgICAgICAgICAgIGNvbnN0IF9fZmlsZW5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhmdWxsUGF0aCl9XCIsIF9fZGlybmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHBhdGguZGlybmFtZShmdWxsUGF0aCkpfVwiO1xuICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgY29uc3QgaW5jbHVkZSA9IChwLCB3aXRoT2JqZWN0KSA9PiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHAsIHdpdGhPYmplY3QpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmZXIgPSAocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0KSA9PiAob3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9LCBfdHJhbnNmZXIocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0LCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UpKTtcbiAgICAgICAgICAgICAgICB7JT5gKTtcblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soJzwlIX19fSU+Jyk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufVxuIiwgImltcG9ydCBSYXpvclN5bnRheCBmcm9tICcuL1Jhem9yU3ludGF4J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHZXRTeW50YXgoQ29tcGlsZVR5cGU6IGFueSkge1xuICAgIGxldCBmdW5jOiBhbnk7XG4gICAgc3dpdGNoIChDb21waWxlVHlwZS5uYW1lIHx8IENvbXBpbGVUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJSYXpvclwiOlxuICAgICAgICAgICAgZnVuYyA9IFJhem9yU3ludGF4O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xufSIsICJpbXBvcnQgQWRkU3ludGF4IGZyb20gJy4vU3ludGF4L0luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRQbHVnaW4ge1xuXHRwdWJsaWMgU2V0dGluZ3NPYmplY3Q6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKFNldHRpbmdzT2JqZWN0OiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgICAgICB0aGlzLlNldHRpbmdzT2JqZWN0ID0gU2V0dGluZ3NPYmplY3RcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBkZWZhdWx0U3ludGF4KCl7XG4gICAgICAgIHJldHVybiB0aGlzLlNldHRpbmdzT2JqZWN0LkJhc2ljQ29tcGlsYXRpb25TeW50YXguY29uY2F0KHRoaXMuU2V0dGluZ3NPYmplY3QuQWRkQ29tcGlsZVN5bnRheCk7XG4gICAgfVxuXG4gICAgYXN5bmMgQnVpbGRCYXNpYyh0ZXh0OiBTdHJpbmdUcmFja2VyLCBPRGF0YTpzdHJpbmcgfGFueSwgcGF0aDpzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICAvL2FkZCBTeW50YXhcblxuICAgICAgICBpZiAoIU9EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShPRGF0YSkpIHtcbiAgICAgICAgICAgIE9EYXRhID0gW09EYXRhXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBPRGF0YSkge1xuICAgICAgICAgICAgY29uc3QgU3ludGF4ID0gYXdhaXQgQWRkU3ludGF4KGkpO1xuXG4gICAgICAgICAgICBpZiAoU3ludGF4KSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGF3YWl0IFN5bnRheCh0ZXh0LCBpLCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBwYWdlc1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIHRleHQgPSBhd2FpdCB0aGlzLkJ1aWxkQmFzaWModGV4dCwgdGhpcy5kZWZhdWx0U3ludGF4LCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIGNvbXBvbmVudHNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkQ29tcG9uZW50KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIHRleHQgPSBhd2FpdCB0aGlzLkJ1aWxkQmFzaWModGV4dCwgdGhpcy5kZWZhdWx0U3ludGF4LCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59IiwgIi8vZ2xvYmFsIHNldHRpbmdzIGZvciBidWlsZCBpbiBjb21wb25lbnRzXG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHtcbiAgICBwbHVnaW5zOiBbXVxufTsiLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4vSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4vU2NyaXB0VGVtcGxhdGUnO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoLCBQYXJzZURlYnVnTGluZSwgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0ICogYXMgZXh0cmljYXRlIGZyb20gJy4vWE1MSGVscGVycy9FeHRyaWNhdGUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEJ1aWxkU2NyaXB0IGZyb20gJy4vdHJhbnNmb3JtL1NjcmlwdCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBCdWlsZFNjcmlwdFNldHRpbmdzIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7IEFkZENvbXBpbGVTeW50YXg6IFtdLCBwbHVnaW5zOiBbXSwgQmFzaWNDb21waWxhdGlvblN5bnRheDogWydSYXpvciddIH07XG5jb25zdCBQbHVnaW5CdWlsZCA9IG5ldyBBZGRQbHVnaW4oU2V0dGluZ3MpO1xuZXhwb3J0IGNvbnN0IENvbXBvbmVudHMgPSBuZXcgSW5zZXJ0Q29tcG9uZW50KFBsdWdpbkJ1aWxkKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldFBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MucGx1Z2lucy5maW5kKGIgPT4gYiA9PSBuYW1lIHx8ICg8YW55PmIpPy5uYW1lID09IG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU29tZVBsdWdpbnMoLi4uZGF0YTogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gZGF0YS5zb21lKHggPT4gR2V0UGx1Z2luKHgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHMoKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLkFkZENvbXBpbGVTeW50YXguaW5jbHVkZXMoJ1R5cGVTY3JpcHQnKTtcbn1cblxuQ29tcG9uZW50cy5NaWNyb1BsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuQ29tcG9uZW50cy5HZXRQbHVnaW4gPSBHZXRQbHVnaW47XG5Db21wb25lbnRzLlNvbWVQbHVnaW5zID0gU29tZVBsdWdpbnM7XG5Db21wb25lbnRzLmlzVHMgPSBpc1RzO1xuXG5CdWlsZFNjcmlwdFNldHRpbmdzLnBsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuXG5hc3luYyBmdW5jdGlvbiBvdXRQYWdlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHNjcmlwdEZpbGU6IFN0cmluZ1RyYWNrZXIsIHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZHluYW1pY0NoZWNrPzogYm9vbGVhbik6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuXG4gICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShzZXNzaW9uSW5mbywgZGF0YSwgaXNUcygpKTtcbiAgICBpZighYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBwYWdlTmFtZSwge2R5bmFtaWNDaGVja30pKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsTmFtZSA9IGJhc2VEYXRhLmRlZmF1bHRWYWx1ZVBvcEFueSgnbW9kZWwnLCAnd2Vic2l0ZScpO1xuXG4gICAgaWYgKCFtb2RlbE5hbWUpIHJldHVybiBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSwgYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICBkYXRhID0gYmFzZURhdGEuY2xlYXJEYXRhO1xuXG4gICAgLy9pbXBvcnQgbW9kZWxcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBtb2RlbE5hbWUsICdNb2RlbHMnLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5tb2RlbCk7IC8vIGZpbmQgbG9jYXRpb24gb2YgdGhlIGZpbGVcblxuICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVsbFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yTWVzc2FnZSA9IGBFcnJvciBtb2RlbCBub3QgZm91bmQgLT4gJHttb2RlbE5hbWV9IGF0IHBhZ2UgJHtwYWdlTmFtZX1gO1xuXG4gICAgICAgIHByaW50LmVycm9yKEVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihkYXRhLkRlZmF1bHRJbmZvVGV4dCwgUGFnZVRlbXBsYXRlLnByaW50RXJyb3IoRXJyb3JNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsIEZ1bGxQYXRoKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgRnVsbFBhdGgsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICBsZXQgbW9kZWxEYXRhID0gYXdhaXQgUGFyc2VCYXNlUGFnZS5yZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGJhc2VNb2RlbERhdGEuYWxsRGF0YSk7XG5cbiAgICBzZXNzaW9uSW5mby5kZWJ1ZyAmJiBtb2RlbERhdGEuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgIHBhZ2VOYW1lICs9IFwiIC0+IFwiICsgU21hbGxQYXRoO1xuXG4gICAgLy9HZXQgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgYWxsRGF0YSA9IGV4dHJpY2F0ZS5nZXREYXRhVGFncyhtb2RlbERhdGEsIFsnJ10sICc6JywgZmFsc2UsIHRydWUpO1xuXG4gICAgaWYgKGFsbERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciB3aXRoaW4gbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1vZGVsRGF0YSA9IGFsbERhdGEuZGF0YTtcbiAgICBjb25zdCB0YWdBcnJheSA9IGFsbERhdGEuZm91bmQubWFwKHggPT4geC50YWcuc3Vic3RyaW5nKDEpKTtcbiAgICBjb25zdCBvdXREYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdzKGRhdGEsIHRhZ0FycmF5LCAnQCcpO1xuXG4gICAgaWYgKG91dERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBXaXRoIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvL0J1aWxkIFdpdGggcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbW9kZWxCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgYWxsRGF0YS5mb3VuZCkge1xuICAgICAgICBpLnRhZyA9IGkudGFnLnN1YnN0cmluZygxKTsgLy8gcmVtb3ZpbmcgdGhlICc6J1xuICAgICAgICBjb25zdCBob2xkZXJEYXRhID0gb3V0RGF0YS5mb3VuZC5maW5kKChlKSA9PiBlLnRhZyA9PSAnQCcgKyBpLnRhZyk7XG5cbiAgICAgICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YS5zdWJzdHJpbmcoMCwgaS5sb2MpKTtcbiAgICAgICAgbW9kZWxEYXRhID0gbW9kZWxEYXRhLnN1YnN0cmluZyhpLmxvYyk7XG5cbiAgICAgICAgaWYgKGhvbGRlckRhdGEpIHtcbiAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhob2xkZXJEYXRhLmRhdGEpO1xuICAgICAgICB9IGVsc2UgeyAvLyBUcnkgbG9hZGluZyBkYXRhIGZyb20gcGFnZSBiYXNlXG4gICAgICAgICAgICBjb25zdCBsb2FkRnJvbUJhc2UgPSBiYXNlRGF0YS5nZXQoaS50YWcpO1xuXG4gICAgICAgICAgICBpZiAobG9hZEZyb21CYXNlICYmIGxvYWRGcm9tQmFzZSAhPT0gdHJ1ZSAmJiBsb2FkRnJvbUJhc2UuZXEudG9Mb3dlckNhc2UoKSAhPSAnaW5oZXJpdCcpXG4gICAgICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGxvYWRGcm9tQmFzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhKTtcblxuICAgIHJldHVybiBhd2FpdCBvdXRQYWdlKG1vZGVsQnVpbGQsIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlKSwgRnVsbFBhdGgsIHBhZ2VOYW1lLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEluc2VydChkYXRhOiBzdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBuZXN0ZWRQYWdlOiBib29sZWFuLCBuZXN0ZWRQYWdlRGF0YTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKSB7XG4gICAgbGV0IERlYnVnU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBkYXRhKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IG91dFBhZ2UoRGVidWdTdHJpbmcsIG5ldyBTdHJpbmdUcmFja2VyKERlYnVnU3RyaW5nLkRlZmF1bHRJbmZvVGV4dCksIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8sIGR5bmFtaWNDaGVjayk7XG5cbiAgICBpZihEZWJ1Z1N0cmluZyA9PSBudWxsKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGx1Z2luQnVpbGQuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBDb21wb25lbnRzLkluc2VydChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7IC8vIGFkZCBjb21wb25lbnRzXG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhcnNlRGVidWdMaW5lKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xuXG4gICAgaWYgKG5lc3RlZFBhZ2UpIHsgLy8gcmV0dXJuIFN0cmluZ1RyYWNrZXIsIGJlY2F1c2UgdGhpcyBpbXBvcnQgd2FzIGZyb20gcGFnZVxuICAgICAgICByZXR1cm4gUGFnZVRlbXBsYXRlLkluUGFnZVRlbXBsYXRlKERlYnVnU3RyaW5nLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgpO1xuICAgIH1cblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgZmluYWxpemVCdWlsZChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8sIGZ1bGxQYXRoQ29tcGlsZSk7XG4gICAgXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYWdlVGVtcGxhdGUuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mbyk7XG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5CdWlsZFNjcmlwdFdpdGhQcmFtcyhEZWJ1Z1N0cmluZyk7XG4gICAgRGVidWdTdHJpbmc9IFBhZ2VUZW1wbGF0ZS5BZGRBZnRlckJ1aWxkKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5kZWJ1Zyk7XG5cbiAgICByZXR1cm4gRGVidWdTdHJpbmc7XG59IiwgImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQnVpbGRKUywgQnVpbGRKU1gsIEJ1aWxkVFMsIEJ1aWxkVFNYIH0gZnJvbSAnLi9Gb3JTdGF0aWMvU2NyaXB0JztcbmltcG9ydCBCdWlsZFN2ZWx0ZSBmcm9tICcuL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50JztcbmltcG9ydCB7IEJ1aWxkU3R5bGVTYXNzIH0gZnJvbSAnLi9Gb3JTdGF0aWMvU3R5bGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIFN5c3RlbURhdGEsIGdldERpcm5hbWUsIEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBSZXNwb25zZSwgUmVxdWVzdCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcHJvbXB0bHkgZnJvbSAncHJvbXB0bHknO1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuXG5jb25zdCBTdXBwb3J0ZWRUeXBlcyA9IFsnanMnLCAnc3ZlbHRlJywgJ3RzJywgJ2pzeCcsICd0c3gnLCAnY3NzJywgJ3Nhc3MnLCAnc2NzcyddO1xuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTdGF0aWNGaWxlcycpO1xuXG5hc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbyA9IFN0YXRpY0ZpbGVzSW5mby5zdG9yZVtwYXRoXTtcblxuICAgIGZvciAoY29uc3QgaSBpbiBvKSB7XG4gICAgICAgIGxldCBwID0gaTtcblxuICAgICAgICBpZiAoaSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBwID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgcGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBwO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gb1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gIW87XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBmdWxsQ29tcGlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBkZXBlbmRlbmNpZXM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG4gICAgc3dpdGNoIChleHQpIHtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRKUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRKU1goU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUU1goU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjc3MnOlxuICAgICAgICBjYXNlICdzYXNzJzpcbiAgICAgICAgY2FzZSAnc2Nzcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN0eWxlU2FzcyhTbWFsbFBhdGgsIGV4dCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3ZlbHRlJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3ZlbHRlKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBmdWxsQ29tcGlsZVBhdGggKz0gJy5qcyc7XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbENvbXBpbGVQYXRoKSkge1xuICAgICAgICBTdGF0aWNGaWxlc0luZm8udXBkYXRlKFNtYWxsUGF0aCwgZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFpc0RlYnVnKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbn1cblxuaW50ZXJmYWNlIGJ1aWxkSW4ge1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgZXh0Pzogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBpblNlcnZlcj86IHN0cmluZztcbn1cblxuY29uc3Qgc3RhdGljRmlsZXMgPSBTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvY2xpZW50Lyc7XG5jb25zdCBnZXRTdGF0aWM6IGJ1aWxkSW5bXSA9IFt7XG4gICAgcGF0aDogXCJzZXJ2L3RlbXAuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJidWlsZFRlbXBsYXRlLmpzXCJcbn0sXG57XG4gICAgcGF0aDogXCJzZXJ2L2Nvbm5lY3QuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJtYWtlQ29ubmVjdGlvbi5qc1wiXG59LFxue1xuICAgIHBhdGg6IFwic2Vydi9tZC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1hcmtkb3duQ29weS5qc1wiXG59XTtcblxuY29uc3QgZ2V0U3RhdGljRmlsZXNUeXBlOiBidWlsZEluW10gPSBbe1xuICAgIGV4dDogJy5wdWIuanMnLFxuICAgIHR5cGU6ICdqcydcbn0sXG57XG4gICAgZXh0OiAnLnB1Yi5tanMnLFxuICAgIHR5cGU6ICdqcydcbn0sXG57XG4gICAgZXh0OiAnLnB1Yi5jc3MnLFxuICAgIHR5cGU6ICdjc3MnXG59XTtcblxuYXN5bmMgZnVuY3Rpb24gc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdDogUmVxdWVzdCwgZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGZvdW5kID0gZ2V0U3RhdGljRmlsZXNUeXBlLmZpbmQoeCA9PiBmaWxlUGF0aC5lbmRzV2l0aCh4LmV4dCkpO1xuXG4gICAgaWYgKCFmb3VuZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBjb25zdCBiYXNlUGF0aCA9IFJlcXVlc3QucXVlcnkudCA9PSAnbCcgPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdO1xuICAgIGNvbnN0IGluU2VydmVyID0gcGF0aC5qb2luKGJhc2VQYXRoLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShpblNlcnZlcikpXG4gICAgICAgIHJldHVybiB7IC4uLmZvdW5kLCBpblNlcnZlciB9O1xufVxuXG5sZXQgZGVidWdnaW5nV2l0aFNvdXJjZTogbnVsbCB8IGJvb2xlYW4gPSBudWxsO1xuXG5pZiAoYXJndi5pbmNsdWRlcygnYWxsb3dTb3VyY2VEZWJ1ZycpKVxuICAgIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPSB0cnVlO1xuYXN5bmMgZnVuY3Rpb24gYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpIHtcbiAgICBpZiAodHlwZW9mIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPT0gJ2Jvb2xlYW4nKVxuICAgICAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcblxuICAgIHRyeSB7XG4gICAgICAgIGRlYnVnZ2luZ1dpdGhTb3VyY2UgPSAoYXdhaXQgcHJvbXB0bHkucHJvbXB0KFxuICAgICAgICAgICAgJ0FsbG93IGRlYnVnZ2luZyBKYXZhU2NyaXB0L0NTUyBpbiBzb3VyY2UgcGFnZT8gLSBleHBvc2luZyB5b3VyIHNvdXJjZSBjb2RlIChubyknLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvcih2OiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFsneWVzJywgJ25vJ10uaW5jbHVkZXModi50cmltKCkudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd5ZXMgb3Igbm8nKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAgKiAzMFxuICAgICAgICAgICAgfVxuICAgICAgICApKS50cmltKCkudG9Mb3dlckNhc2UoKSA9PSAneWVzJztcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgfSBjYXRjaCB7IH1cblxuXG4gICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG59XG5cbmNvbnN0IHNhZmVGb2xkZXJzID0gW2dldFR5cGVzLlN0YXRpY1syXSwgZ2V0VHlwZXMuTG9nc1syXSwgJ01vZGVscycsICdDb21wb25lbnRzJ107XG4vKipcbiAqIElmIHRoZSB1c2VyIGlzIGluIGRlYnVnIG1vZGUsIGFuZCB0aGUgZmlsZSBpcyBhIHNvdXJjZSBmaWxlLCBhbmQgdGhlIHVzZXIgY29tbWVuZCBsaW5lIGFyZ3VtZW50IGhhdmUgYWxsb3dTb3VyY2VEZWJ1Z1xuICogdGhlbiByZXR1cm4gdGhlIGZ1bGwgcGF0aCB0byB0aGUgZmlsZVxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gaXMgdGhlIGN1cnJlbnQgcGFnZSBhIGRlYnVnIHBhZ2U/XG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0aGF0IHdhcyBjbGlja2VkLlxuICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIC0gSWYgdGhpcyBwYXRoIGFscmVhZHkgYmVlbiBjaGVja2VkXG4gKiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSB0eXBlIG9mIHRoZSBmaWxlIGFuZCB0aGUgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5zYWZlRGVidWcoaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghaXNEZWJ1ZyB8fCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikgfHwgcGF0aC5leHRuYW1lKGZpbGVQYXRoKSAhPSAnLnNvdXJjZScgfHwgIXNhZmVGb2xkZXJzLmluY2x1ZGVzKGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnNoaWZ0KCkpIHx8ICFhd2FpdCBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNykpOyAvLyByZW1vdmluZyAnLnNvdXJjZSdcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdodG1sJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdHlsZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYmFzZUZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDQpOyAvLyByZW1vdmluZyAnLmNzcydcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGZpbGVQYXRoO1xuXG4gICAgbGV0IGV4aXN0czogYm9vbGVhbjtcbiAgICBpZiAocGF0aC5leHRuYW1lKGJhc2VGaWxlUGF0aCkgPT0gJy5zdmVsdGUnICYmIChjaGVja2VkIHx8IChleGlzdHMgPSBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmICFleGlzdHMpIHtcbiAgICAgICAgYXdhaXQgQnVpbGRGaWxlKGJhc2VGaWxlUGF0aCwgaXNEZWJ1ZywgZ2V0VHlwZXMuU3RhdGljWzFdICsgYmFzZUZpbGVQYXRoKVxuICAgICAgICByZXR1cm4gc3ZlbHRlU3R5bGUoZmlsZVBhdGgsIGNoZWNrZWQsIGZhbHNlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0YXRpYyhmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L3N2ZWx0ZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcycgKyBmaWxlUGF0aC5zdWJzdHJpbmcoNCkgKyAocGF0aC5leHRuYW1lKGZpbGVQYXRoKSA/ICcnIDogJy9pbmRleC5tanMnKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdqcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrZG93bkNvZGVUaGVtZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L21kL2NvZGUtdGhlbWUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3N0eWxlcycgKyBmaWxlUGF0aC5zdWJzdHJpbmcoMTgpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrZG93blRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvdGhlbWUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGxldCBmaWxlTmFtZSA9IGZpbGVQYXRoLnN1YnN0cmluZygxNCk7XG4gICAgaWYgKGZpbGVOYW1lLnN0YXJ0c1dpdGgoJ2F1dG8nKSlcbiAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoNClcbiAgICBlbHNlXG4gICAgICAgIGZpbGVOYW1lID0gJy0nICsgZmlsZU5hbWU7XG5cblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nICsgZmlsZU5hbWUucmVwbGFjZSgnLmNzcycsICcubWluLmNzcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZChSZXF1ZXN0OiBSZXF1ZXN0LCBpc0RlYnVnOiBib29sZWFuLCBwYXRoOiBzdHJpbmcsIGNoZWNrZWQgPSBmYWxzZSk6IFByb21pc2U8bnVsbCB8IGJ1aWxkSW4+IHtcbiAgICByZXR1cm4gYXdhaXQgc3ZlbHRlU3RhdGljKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IHN2ZWx0ZVN0eWxlKHBhdGgsIGNoZWNrZWQsIGlzRGVidWcpIHx8XG4gICAgICAgIGF3YWl0IHVuc2FmZURlYnVnKGlzRGVidWcsIHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IHNlcnZlckJ1aWxkQnlUeXBlKFJlcXVlc3QsIHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IG1hcmtkb3duVGhlbWUocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25Db2RlVGhlbWUocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgZ2V0U3RhdGljLmZpbmQoeCA9PiB4LnBhdGggPT0gcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWJ1aWxkRmlsZShTbWFsbFBhdGg6IHN0cmluZywgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKFNtYWxsUGF0aCkgJiYgYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIFJlcXVlc3Q6IFJlcXVlc3QsIFJlc3BvbnNlOiBSZXNwb25zZSkge1xuICAgIC8vZmlsZSBidWlsdCBpblxuICAgIGNvbnN0IGlzQnVpbGRJbiA9IGF3YWl0IHNlcnZlckJ1aWxkKFJlcXVlc3QsIGlzRGVidWcsIFNtYWxsUGF0aCwgdHJ1ZSk7XG5cbiAgICBpZiAoaXNCdWlsZEluKSB7XG4gICAgICAgIFJlc3BvbnNlLnR5cGUoaXNCdWlsZEluLnR5cGUpO1xuICAgICAgICBSZXNwb25zZS5lbmQoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGlzQnVpbGRJbi5pblNlcnZlcikpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvL2NvbXBpbGVkIGZpbGVzXG4gICAgY29uc3QgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgU21hbGxQYXRoO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgU21hbGxQYXRoO1xuXG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKFNtYWxsUGF0aCkuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAoIVN1cHBvcnRlZFR5cGVzLmluY2x1ZGVzKGV4dCkpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFsnc2FzcycsICdzY3NzJywgJ2NzcyddLmluY2x1ZGVzKGV4dCkpIHsgLy8gYWRkaW5nIHR5cGVcbiAgICAgICAgUmVzcG9uc2UudHlwZSgnY3NzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZSgnanMnKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzUGF0aCA9IGZ1bGxDb21waWxlUGF0aDtcblxuICAgIC8vIHJlLWNvbXBpbGluZyBpZiBuZWNlc3Nhcnkgb24gZGVidWcgbW9kZVxuICAgIGlmIChpc0RlYnVnICYmIChSZXF1ZXN0LnF1ZXJ5LnNvdXJjZSA9PSAndHJ1ZScgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKFNtYWxsUGF0aCkgJiYgIWF3YWl0IEJ1aWxkRmlsZShTbWFsbFBhdGgsIGlzRGVidWcsIGZ1bGxDb21waWxlUGF0aCkpKSB7XG4gICAgICAgIHJlc1BhdGggPSBmdWxsUGF0aDtcbiAgICB9IGVsc2UgaWYgKGV4dCA9PSAnc3ZlbHRlJylcbiAgICAgICAgcmVzUGF0aCArPSAnLmpzJztcblxuICAgIFJlc3BvbnNlLmVuZChhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShyZXNQYXRoLCAndXRmOCcpKTsgLy8gc2VuZGluZyB0aGUgZmlsZVxufSIsICJpbXBvcnQgeyBTb21lUGx1Z2lucywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yLCBFU0J1aWxkUHJpbnRXYXJuaW5ncyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5wdXRQYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbW9yZU9wdGlvbnM/OiBUcmFuc2Zvcm1PcHRpb25zKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpbnB1dFBhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGlucHV0UGF0aDtcbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBpbnB1dFBhdGggKyAnP3NvdXJjZT10cnVlJyxcbiAgICAgICAgc291cmNlbWFwOiBpc0RlYnVnID8gJ2lubGluZSc6IGZhbHNlLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyB0eXBlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpLCAuLi5tb3JlT3B0aW9uc1xuICAgIH07XG5cbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgd2FybmluZ3MgfSA9IGF3YWl0IHRyYW5zZm9ybShyZXN1bHQsIEFkZE9wdGlvbnMpO1xuICAgICAgICByZXN1bHQgPSBjb2RlO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5ncyh3YXJuaW5ncywgZnVsbFBhdGgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvcihlcnIsIGZ1bGxQYXRoKTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgcmVzdWx0KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ2pzJywgaXNEZWJ1ZywgdW5kZWZpbmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkVFMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAndHMnLCBpc0RlYnVnLCB7IGxvYWRlcjogJ3RzJyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ2pzeCcsIGlzRGVidWcsIHsgLi4uKEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pLCBsb2FkZXI6ICdqc3gnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAndHN4JywgaXNEZWJ1ZywgeyBsb2FkZXI6ICd0c3gnLCAuLi4oR2V0UGx1Z2luKFwiVFNYT3B0aW9uc1wiKSA/PyB7fSkgfSk7XG59XG4iLCAiaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCB7IFNvbWVQbHVnaW5zIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSBcImVzYnVpbGQtd2FzbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZVwiO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50LCBNZXJnZVNvdXJjZU1hcCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgUHJpbnRTdmVsdGVFcnJvciwgUHJpbnRTdmVsdGVXYXJuIH0gZnJvbSBcIi4vZXJyb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGluU3RhdGljUGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNQYXRoO1xuXG4gICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXMsIG1hcCwgc2NyaXB0TGFuZyB9ID0gYXdhaXQgcHJlcHJvY2VzcyhmdWxsUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5TdGF0aWNQYXRoKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZ1bGxQYXRoLnNwbGl0KC9cXC98XFwvLykucG9wKCk7XG4gICAgbGV0IGpzOiBhbnksIGNzczogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgZGV2OiBpc0RlYnVnLFxuICAgICAgICAgICAgc291cmNlbWFwOiBtYXAsXG4gICAgICAgICAgICBjc3M6IGZhbHNlLFxuICAgICAgICAgICAgaHlkcmF0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHN2ZWx0ZVBhdGg6ICcvc2Vydi9zdmVsdGUnXG4gICAgICAgIH0pO1xuICAgICAgICBQcmludFN2ZWx0ZVdhcm4ob3V0cHV0Lndhcm5pbmdzLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAganMgPSBvdXRwdXQuanM7XG4gICAgICAgIGNzcyA9IG91dHB1dC5jc3M7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgUHJpbnRTdmVsdGVFcnJvcihlcnIsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGhpc0ZpbGU6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHNvdXJjZUZpbGVDbGllbnQgPSBqcy5tYXAuc291cmNlc1swXS5zdWJzdHJpbmcoMSk7XG5cbiAgICBpZihpc0RlYnVnKXtcbiAgICAgICAganMubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgIH1cblxuICAgIGlmIChTb21lUGx1Z2lucyhcIk1pbkpTXCIpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKGpzLmNvZGUsIHtcbiAgICAgICAgICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgICAgICAgICAgbG9hZGVyOiA8YW55PnNjcmlwdExhbmcsXG4gICAgICAgICAgICAgICAgc291cmNlbWFwOiBpc0RlYnVnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAganMuY29kZSA9IGNvZGU7XG4gICAgICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICAgICAganMubWFwID0gYXdhaXQgTWVyZ2VTb3VyY2VNYXAoSlNPTi5wYXJzZShtYXApLCBqcy5tYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGF3YWl0IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwKGVyciwganMubWFwLCBmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICBqcy5jb2RlICs9IHRvVVJMQ29tbWVudChqcy5tYXApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgICAgICAgICAgY3NzLmNvZGUgKz0gdG9VUkxDb21tZW50KGNzcy5tYXAsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpblN0YXRpY1BhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmpzJywganMuY29kZSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlcGVuZGVuY2llcyxcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn0iLCAiaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ICBjcmVhdGVJbXBvcnRlciwgZ2V0U2Fzc0Vycm9yTGluZSwgUHJpbnRTYXNzRXJyb3IsIHNhc3NBbmRTb3VyY2UsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFN0eWxlU2FzcyhpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogXCJzYXNzXCIgfCBcInNjc3NcIiB8IFwiY3NzXCIsIGlzRGVidWc6IGJvb2xlYW4pOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0+IHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuXG4gICAgY29uc3QgZGVwZW5kZW5jZU9iamVjdCA9IHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpLCBmaWxlRGF0YURpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoZmlsZURhdGEsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCh0eXBlKSxcbiAgICAgICAgICAgIHN0eWxlOiBzYXNzU3R5bGUodHlwZSksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQ/LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2VPYmplY3RbQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCldID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5jc3M7XG5cbiAgICAgICAgaWYgKGlzRGVidWcgJiYgcmVzdWx0LnNvdXJjZU1hcCkge1xuICAgICAgICAgICAgc2Fzc0FuZFNvdXJjZShyZXN1bHQuc291cmNlTWFwLCBwYXRoVG9GaWxlVVJMKGZpbGVEYXRhKS5ocmVmKTtcbiAgICAgICAgICAgIHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcyA9IHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcy5tYXAoeCA9PiBwYXRoLnJlbGF0aXZlKGZpbGVEYXRhRGlybmFtZSwgZmlsZVVSTFRvUGF0aCh4KSkgKyAnP3NvdXJjZT10cnVlJyk7XG5cbiAgICAgICAgICAgIGRhdGEgKz0gYFxcclxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5zb3VyY2VNYXApKS50b1N0cmluZyhcImJhc2U2NFwiKX0qL2A7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCBkYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBkZXBlbmRlbmNlT2JqZWN0XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERpcmVudCB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IEluc2VydCwgQ29tcG9uZW50cywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IENsZWFyV2FybmluZyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3J1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgRGVsZXRlSW5EaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBSZXFTY3JpcHQgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBTdGF0aWNGaWxlcyBmcm9tICcuLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDb21waWxlU3RhdGUgZnJvbSAnLi9Db21waWxlU3RhdGUnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHsgY3JlYXRlU2l0ZU1hcCB9IGZyb20gJy4vU2l0ZU1hcCc7XG5pbXBvcnQgeyBleHRlbnNpb25JcywgaXNGaWxlVHlwZSwgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCB7IHBlckNvbXBpbGUsIHBvc3RDb21waWxlLCBwZXJDb21waWxlUGFnZSwgcG9zdENvbXBpbGVQYWdlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2NyaXB0VGVtcGxhdGUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5hc3luYyBmdW5jdGlvbiBjb21waWxlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB7IGlzRGVidWcsIGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrIH06IHsgaXNEZWJ1Zz86IGJvb2xlYW4sIGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZywgZHluYW1pY0NoZWNrPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCBGdWxsRmlsZVBhdGggPSBwYXRoLmpvaW4oYXJyYXlUeXBlWzBdLCBmaWxlUGF0aCksIEZ1bGxQYXRoQ29tcGlsZSA9IGFycmF5VHlwZVsxXSArIGZpbGVQYXRoICsgJy5janMnO1xuXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsRmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgY29uc3QgRXhjbHVVcmwgPSAobmVzdGVkUGFnZSA/IG5lc3RlZFBhZ2UgKyAnPGxpbmU+JyA6ICcnKSArIGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBoYXNTZXNzaW9uSW5mbyA/PyBuZXcgU2Vzc2lvbkJ1aWxkKGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoLCBGdWxsRmlsZVBhdGgsIGFycmF5VHlwZVsyXSwgaXNEZWJ1ZywgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpKTtcbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKCd0aGlzUGFnZScsIEZ1bGxGaWxlUGF0aCk7XG5cbiAgICBhd2FpdCBwZXJDb21waWxlUGFnZShzZXNzaW9uSW5mbywgRnVsbFBhdGhDb21waWxlKTtcbiAgICBjb25zdCBDb21waWxlZERhdGEgPSAoYXdhaXQgSW5zZXJ0KGh0bWwsIEZ1bGxQYXRoQ29tcGlsZSwgQm9vbGVhbihuZXN0ZWRQYWdlKSwgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvLCBkeW5hbWljQ2hlY2spKSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgIGF3YWl0IHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbywgRnVsbFBhdGhDb21waWxlKTtcblxuICAgIGlmICghbmVzdGVkUGFnZSAmJiBDb21waWxlZERhdGEubGVuZ3RoKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoRnVsbFBhdGhDb21waWxlLCBDb21waWxlZERhdGEuU3RyaW5nV2l0aFRhY2soRnVsbFBhdGhDb21waWxlKSk7XG4gICAgICAgIHBhZ2VEZXBzLnVwZGF0ZShFeGNsdVVybCwgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvIH07XG59XG5cbmZ1bmN0aW9uIFJlcXVpcmVTY3JpcHQoc2NyaXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gUmVxU2NyaXB0KCdQcm9kdWN0aW9uIExvYWRlcicsIHNjcmlwdCwgZ2V0VHlwZXMuU3RhdGljLCB7IGlzRGVidWc6IGZhbHNlLCBvbmx5UHJlcGFyZTogdHJ1ZSB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRmlsZXNJbkZvbGRlcihhcnJheVR5cGU6IHN0cmluZ1tdLCBwYXRoOiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKGFycmF5VHlwZVswXSArIHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMubWtkaXIoYXJyYXlUeXBlWzFdICsgY29ubmVjdCk7XG4gICAgICAgICAgICBhd2FpdCBGaWxlc0luRm9sZGVyKGFycmF5VHlwZSwgY29ubmVjdCArICcvJywgc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShhcnJheVR5cGVbMl0gKyAnLycgKyBjb25uZWN0KSkgLy9jaGVjayBpZiBub3QgYWxyZWFkeSBjb21waWxlIGZyb20gYSAnaW4tZmlsZScgY2FsbFxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb21waWxlRmlsZShjb25uZWN0LCBhcnJheVR5cGUsIHsgZHluYW1pY0NoZWNrOiAhZXh0ZW5zaW9uSXMobiwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBSZXF1aXJlU2NyaXB0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFN0YXRpY0ZpbGVzKGNvbm5lY3QsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVNjcmlwdHMoc2NyaXB0czogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2Ygc2NyaXB0cykge1xuICAgICAgICBhd2FpdCBSZXF1aXJlU2NyaXB0KHBhdGgpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQ3JlYXRlQ29tcGlsZSh0OiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB0eXBlcyA9IGdldFR5cGVzW3RdO1xuICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KHR5cGVzWzFdKTtcbiAgICByZXR1cm4gKCkgPT4gRmlsZXNJbkZvbGRlcih0eXBlcywgJycsIHN0YXRlKTtcbn1cblxuLyoqXG4gKiB3aGVuIHBhZ2UgY2FsbCBvdGhlciBwYWdlO1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGVJbkZpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCAgeyBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVjayB9OiB7IGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZywgZHluYW1pY0NoZWNrPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGgsIGFycmF5VHlwZVsxXSk7XG4gICAgcmV0dXJuIGF3YWl0IGNvbXBpbGVGaWxlKHBhdGgsIGFycmF5VHlwZSwge2lzRGVidWc6dHJ1ZSwgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2t9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgZHluYW1pY0NoZWNrPzogYm9vbGVhbikge1xuICAgIGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKHBhdGgsIGFycmF5VHlwZSwge2R5bmFtaWNDaGVja30pO1xuICAgIENsZWFyV2FybmluZygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUFsbChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKSB7XG4gICAgbGV0IHN0YXRlID0gIWFyZ3YuaW5jbHVkZXMoJ3JlYnVpbGQnKSAmJiBhd2FpdCBDb21waWxlU3RhdGUuY2hlY2tMb2FkKClcblxuICAgIGlmIChzdGF0ZSkgcmV0dXJuICgpID0+IFJlcXVpcmVTY3JpcHRzKHN0YXRlLnNjcmlwdHMpXG4gICAgcGFnZURlcHMuY2xlYXIoKTtcblxuICAgIHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpXG5cbiAgICBwZXJDb21waWxlKCk7XG5cbiAgICBjb25zdCBhY3RpdmF0ZUFycmF5ID0gW2F3YWl0IENyZWF0ZUNvbXBpbGUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzdGF0ZSksIGF3YWl0IENyZWF0ZUNvbXBpbGUoZ2V0VHlwZXMuTG9nc1syXSwgc3RhdGUpLCBDbGVhcldhcm5pbmddO1xuXG4gICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFjdGl2YXRlQXJyYXkpIHtcbiAgICAgICAgICAgIGF3YWl0IGkoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgc3RhdGUpO1xuICAgICAgICBzdGF0ZS5leHBvcnQoKVxuICAgICAgICBwb3N0Q29tcGlsZSgpXG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZ2V0U2V0dGluZ3NEYXRlIH0gZnJvbSBcIi4uL01haW5CdWlsZC9JbXBvcnRNb2R1bGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxudHlwZSBDU3RhdGUgPSB7XG4gICAgdXBkYXRlOiBudW1iZXJcbiAgICBwYWdlQXJyYXk6IHN0cmluZ1tdW10sXG4gICAgaW1wb3J0QXJyYXk6IHN0cmluZ1tdXG4gICAgZmlsZUFycmF5OiBzdHJpbmdbXVxufVxuXG4vKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gc3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBwcm9qZWN0ICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlU3RhdGUge1xuICAgIHByaXZhdGUgc3RhdGU6IENTdGF0ZSA9IHsgdXBkYXRlOiAwLCBwYWdlQXJyYXk6IFtdLCBpbXBvcnRBcnJheTogW10sIGZpbGVBcnJheTogW10gfVxuICAgIHN0YXRpYyBmaWxlUGF0aCA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBcIkNvbXBpbGVTdGF0ZS5qc29uXCIpXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUudXBkYXRlID0gZ2V0U2V0dGluZ3NEYXRlKClcbiAgICB9XG5cbiAgICBnZXQgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXlcbiAgICB9XG5cbiAgICBnZXQgcGFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnBhZ2VBcnJheVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZmlsZUFycmF5XG4gICAgfVxuXG4gICAgYWRkUGFnZShwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucGFnZUFycmF5LmZpbmQoeCA9PiB4WzBdID09IHBhdGggJiYgeFsxXSA9PSB0eXBlKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucGFnZUFycmF5LnB1c2goW3BhdGgsIHR5cGVdKVxuICAgIH1cblxuICAgIGFkZEltcG9ydChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmltcG9ydEFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgYWRkRmlsZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmZpbGVBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmlsZUFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZShDb21waWxlU3RhdGUuZmlsZVBhdGgsIHRoaXMuc3RhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNoZWNrTG9hZCgpIHtcbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLmZpbGVQYXRoKSkgcmV0dXJuXG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcbiAgICAgICAgc3RhdGUuc3RhdGUgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZmlsZVBhdGgpXG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAhPSBnZXRTZXR0aW5nc0RhdGUoKSkgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxufSIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBJbXBvcnRGaWxlLCB7QWRkRXh0ZW5zaW9uLCBSZXF1aXJlT25jZX0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7cHJpbnR9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTdGFydFJlcXVpcmUoYXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYXJyYXlGdW5jU2VydmVyID0gW107XG4gICAgZm9yIChsZXQgaSBvZiBhcnJheSkge1xuICAgICAgICBpID0gQWRkRXh0ZW5zaW9uKGkpO1xuXG4gICAgICAgIGNvbnN0IGIgPSBhd2FpdCBJbXBvcnRGaWxlKCdyb290IGZvbGRlciAoV1dXKScsIGksIGdldFR5cGVzLlN0YXRpYywge2lzRGVidWd9KTtcbiAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIuU3RhcnRTZXJ2ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJyYXlGdW5jU2VydmVyLnB1c2goYi5TdGFydFNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmludC5sb2coYENhbid0IGZpbmQgU3RhcnRTZXJ2ZXIgZnVuY3Rpb24gYXQgbW9kdWxlIC0gJHtpfVxcbmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RnVuY1NlcnZlcjtcbn1cblxubGV0IGxhc3RTZXR0aW5nc0ltcG9ydDogbnVtYmVyO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldFNldHRpbmdzKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pe1xuICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoICsgJy50cycpKXtcbiAgICAgICAgZmlsZVBhdGggKz0gJy50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggKz0gJy5qcydcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlVGltZSA9IDxhbnk+YXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbClcblxuICAgIGlmKGNoYW5nZVRpbWUgPT0gbGFzdFNldHRpbmdzSW1wb3J0IHx8ICFjaGFuZ2VUaW1lKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsYXN0U2V0dGluZ3NJbXBvcnQgPSBjaGFuZ2VUaW1lO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBSZXF1aXJlT25jZShmaWxlUGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIGRhdGEuZGVmYXVsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmdzRGF0ZSgpe1xuICAgIHJldHVybiBsYXN0U2V0dGluZ3NJbXBvcnRcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEltcG9ydEZpbGUgfSBmcm9tIFwiLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gXCIuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcywgeyBEaXJlbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gXCIuL0NvbXBpbGVTdGF0ZVwiO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSB9IGZyb20gXCIuL0ZpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9W107XG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2NhbkZpbGVzKCl7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLlN0YXRpYywgJycsIHN0YXRlKSxcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5Mb2dzLCAnJywgc3RhdGUpXG4gICAgXSlcbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWJ1Z1NpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyl7XG4gICAgcmV0dXJuIGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBhd2FpdCBzY2FuRmlsZXMoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB7IHJvdXRpbmcsIGRldmVsb3BtZW50IH0gPSBFeHBvcnQ7XG4gICAgaWYgKCFyb3V0aW5nLnNpdGVtYXApIHJldHVybjtcblxuICAgIGNvbnN0IHNpdGVtYXAgPSByb3V0aW5nLnNpdGVtYXAgPT09IHRydWUgPyB7fSA6IHJvdXRpbmcuc2l0ZW1hcDtcbiAgICBPYmplY3QuYXNzaWduKHNpdGVtYXAsIHtcbiAgICAgICAgcnVsZXM6IHRydWUsXG4gICAgICAgIHVybFN0b3A6IGZhbHNlLFxuICAgICAgICBlcnJvclBhZ2VzOiBmYWxzZSxcbiAgICAgICAgdmFsaWRQYXRoOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWdlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHVybHM6IC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGZvciAobGV0IFt1cmwsIHR5cGVdIG9mIHN0YXRlLnBhZ2VzKSB7XG5cbiAgICAgICAgaWYodHlwZSAhPSBnZXRUeXBlcy5TdGF0aWNbMl0gfHwgIXVybC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHVybCA9ICcvJyArIHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgaWYocGF0aC5leHRuYW1lKHVybCkgPT0gJy5zZXJ2JylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnVybFN0b3ApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gcGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2l0ZW1hcC5ydWxlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcucnVsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXdhaXQgcm91dGluZy5ydWxlc1twYXRoXSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoZW5kcyA9PiB1cmwuZW5kc1dpdGgoJy4nK2VuZHMpKSB8fFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVQYXRocy5maW5kKHN0YXJ0ID0+IHVybC5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2Ygcm91dGluZy52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWF3YWl0IGZ1bmModXJsKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2l0ZW1hcC5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVycm9yIGluIHJvdXRpbmcuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSAnLycgKyByb3V0aW5nLmVycm9yUGFnZXNbZXJyb3JdLnBhdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFnZXMucHVzaCh1cmwpO1xuICAgIH1cblxuICAgIGxldCB3cml0ZSA9IHRydWU7XG4gICAgaWYgKHNpdGVtYXAuZmlsZSkge1xuICAgICAgICBjb25zdCBmaWxlQWN0aW9uID0gYXdhaXQgSW1wb3J0RmlsZSgnU2l0ZW1hcCBJbXBvcnQnLCBzaXRlbWFwLmZpbGUsIGdldFR5cGVzLlN0YXRpYywgZGV2ZWxvcG1lbnQpO1xuICAgICAgICBpZighZmlsZUFjdGlvbj8uU2l0ZW1hcCl7XG4gICAgICAgICAgICBkdW1wLndhcm4oJ1xcJ1NpdGVtYXBcXCcgZnVuY3Rpb24gbm90IGZvdW5kIG9uIGZpbGUgLT4gJysgc2l0ZW1hcC5maWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdyaXRlID0gYXdhaXQgZmlsZUFjdGlvbi5TaXRlbWFwKHBhZ2VzLCBzdGF0ZSwgRXhwb3J0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKHdyaXRlICYmIHBhZ2VzLmxlbmd0aCl7XG4gICAgICAgIGNvbnN0IHBhdGggPSB3cml0ZSA9PT0gdHJ1ZSA/ICdzaXRlbWFwLnR4dCc6IHdyaXRlO1xuICAgICAgICBzdGF0ZS5hZGRGaWxlKHBhdGgpO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGdldFR5cGVzLlN0YXRpY1swXSArIHBhdGgsIHBhZ2VzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG59IiwgIi8qKlxuICogR2l2ZW4gYSBmaWxlIG5hbWUgYW5kIGFuIGV4dGVuc2lvbiwgcmV0dXJuIHRydWUgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggdGhlIGV4dGVuc2lvblxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHRuYW1lIC0gdGhlIGV4dGVuc2lvbiB0byBjaGVjayBmb3IuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbnNpb25JcyhuYW1lOiBzdHJpbmcsIGV4dG5hbWU6IHN0cmluZyl7XG4gICAgcmV0dXJuIG5hbWUuZW5kc1dpdGgoJy4nICsgZXh0bmFtZSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggb25lIG9mIHRoZSBnaXZlbiBmaWxlIHR5cGVzLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXMgLSBhbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaWxlVHlwZSh0eXBlczogc3RyaW5nW10sIG5hbWU6IHN0cmluZykge1xuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbklzKG5hbWUsdHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxhc3QgZG90IGFuZCBldmVyeXRoaW5nIGFmdGVyIGl0IGZyb20gYSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHJlbW92ZSB0aGUgZW5kIHR5cGUgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aG91dCB0aGUgbGFzdCBjaGFyYWN0ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZW1vdmVFbmRUeXBlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufSIsICJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgRmlsZXMgfSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5cbmNvbnN0IEV4cG9ydCA9IHtcbiAgICBQYWdlTG9hZFJhbToge30sXG4gICAgUGFnZVJhbTogdHJ1ZVxufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIHR5cGVBcnJheSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGggdG8gdGhlXG4gKiBmaWxlLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBkaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHthbnl9IERhdGFPYmplY3QgLSBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVBhZ2UoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIERhdGFPYmplY3Q6IGFueSkge1xuICAgIGNvbnN0IFJlcUZpbGVQYXRoID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuICAgIGNvbnN0IHJlc01vZGVsID0gKCkgPT4gUmVxRmlsZVBhdGgubW9kZWwoRGF0YU9iamVjdCk7XG5cbiAgICBsZXQgZmlsZUV4aXN0czogYm9vbGVhbjtcblxuICAgIGlmIChSZXFGaWxlUGF0aCkge1xuICAgICAgICBpZiAoIURhdGFPYmplY3QuaXNEZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuXG4gICAgICAgIGlmIChSZXFGaWxlUGF0aC5kYXRlID09IC0xKSB7XG4gICAgICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoUmVxRmlsZVBhdGgucGF0aCk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUV4aXN0cylcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYgKCFleHRuYW1lKSB7XG4gICAgICAgIGV4dG5hbWUgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICBmaWxlUGF0aCArPSAnLicgKyBleHRuYW1lO1xuICAgIH1cblxuICAgIGxldCBmdWxsUGF0aDogc3RyaW5nO1xuICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZVBhdGgpO1xuICAgICBlbHNlXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKCFbQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMuY29tcG9uZW50XS5pbmNsdWRlcyhleHRuYW1lKSkge1xuICAgICAgICBjb25zdCBpbXBvcnRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTtcbiAgICAgICAgRGF0YU9iamVjdC53cml0ZShpbXBvcnRUZXh0KTtcbiAgICAgICAgcmV0dXJuIGltcG9ydFRleHQ7XG4gICAgfVxuXG4gICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpO1xuICAgIGlmICghZmlsZUV4aXN0cykge1xuICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2NvcHlQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6ICgpID0+IHsgfSwgZGF0ZTogLTEsIHBhdGg6IGZ1bGxQYXRoIH07XG4gICAgICAgIHJldHVybiBMYXN0UmVxdWlyZVtjb3B5UGF0aF0ubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgaW5TdGF0aWNQYXRoID0gIHBhdGgucmVsYXRpdmUodHlwZUFycmF5WzBdLGZ1bGxQYXRoKTtcbiAgICBjb25zdCBTbWFsbFBhdGggPSB0eXBlQXJyYXlbMl0gKyAnLycgKyBpblN0YXRpY1BhdGg7XG4gICAgY29uc3QgcmVCdWlsZCA9IERhdGFPYmplY3QuaXNEZWJ1ZyAmJiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHR5cGVBcnJheVsxXSArICcvJyAraW5TdGF0aWNQYXRoICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoaW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGV4dG5hbWUgIT0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSAmJiAhcmVCdWlsZCkge1xuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXVswXSB9O1xuICAgICAgICByZXR1cm4gYXdhaXQgTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsKERhdGFPYmplY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bmMgPSBhd2FpdCBMb2FkUGFnZShTbWFsbFBhdGgsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKSB7XG4gICAgICAgIGlmICghRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF1bMF0gPSBmdW5jO1xuICAgIH1cblxuICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGZ1bmMgfTtcbiAgICByZXR1cm4gYXdhaXQgZnVuYyhEYXRhT2JqZWN0KTtcbn1cblxuY29uc3QgR2xvYmFsVmFyID0ge307XG5cbmZ1bmN0aW9uIGdldEZ1bGxQYXRoQ29tcGlsZSh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgcmV0dXJuIHR5cGVBcnJheVsxXSArIFNwbGl0SW5mb1sxXSArICcuY2pzJztcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgcGFnZSB0byBsb2FkLlxuICogQHBhcmFtIGV4dCAtIFRoZSBleHRlbnNpb24gb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2UodXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcblxuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgY29uc3QgTGFzdFJlcXVpcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIF9yZXF1aXJlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlRmlsZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luY2x1ZGUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcsIFdpdGhPYmplY3QgPSB7fSkge1xuICAgICAgICByZXR1cm4gUmVxdWlyZVBhZ2UocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCB7IC4uLldpdGhPYmplY3QsIC4uLkRhdGFPYmplY3QgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3RyYW5zZmVyKHA6IHN0cmluZywgcHJlc2VydmVGb3JtOiBib29sZWFuLCB3aXRoT2JqZWN0OiBhbnksIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSkge1xuICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgPSAnJztcblxuICAgICAgICBpZiAoIXByZXNlcnZlRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgcG9zdERhdGEgPSBEYXRhT2JqZWN0LlJlcXVlc3QuYm9keSA/IHt9IDogbnVsbDtcbiAgICAgICAgICAgIERhdGFPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgLi4uRGF0YU9iamVjdCxcbiAgICAgICAgICAgICAgICBSZXF1ZXN0OiB7IC4uLkRhdGFPYmplY3QuUmVxdWVzdCwgZmlsZXM6IHt9LCBxdWVyeToge30sIGJvZHk6IHBvc3REYXRhIH0sXG4gICAgICAgICAgICAgICAgUG9zdDogcG9zdERhdGEsIFF1ZXJ5OiB7fSwgRmlsZXM6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBEYXRhT2JqZWN0LCBwLCB3aXRoT2JqZWN0KTtcblxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIFNwbGl0SW5mb1sxXSArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsZXQgZXJyb3JUZXh0OiBzdHJpbmc7XG5cbiAgICAgICAgaWYoaXNEZWJ1Zyl7XG4gICAgICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHBhdGggLT4gXCIsIFJlbW92ZUVuZFR5cGUodXJsKSwgXCItPlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgICBlcnJvclRleHQgPSBKU1BhcnNlci5wcmludEVycm9yKGBFcnJvciBwYXRoOiAke3VybH08YnIvPkVycm9yIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gSlNQYXJzZXIucHJpbnRFcnJvcihgRXJyb3IgY29kZTogJHtlLmNvZGV9YClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiB7XG4gICAgICAgICAgICBEYXRhT2JqZWN0LlJlcXVlc3QuZXJyb3IgPSBlO1xuICAgICAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGVycm9yVGV4dDtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuLyoqXG4gKiBJdCB0YWtlcyBhIGZ1bmN0aW9uIHRoYXQgcHJlcGFyZSBhIHBhZ2UsIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBsb2FkcyBhIHBhZ2VcbiAqIEBwYXJhbSBMb2FkUGFnZUZ1bmMgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgaW4gYSBwYWdlIHRvIGV4ZWN1dGUgb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBydW5fc2NyaXB0X25hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2NyaXB0IHRvIHJ1bi5cbiAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuXG5mdW5jdGlvbiBCdWlsZFBhZ2UoTG9hZFBhZ2VGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IHZvaWQsIHJ1bl9zY3JpcHRfbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgUGFnZVZhciA9IHt9O1xuXG4gICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiAoUmVzcG9uc2U6IFJlc3BvbnNlLCBSZXF1ZXN0OiBSZXF1ZXN0LCBQb3N0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgbnVsbCwgUXVlcnk6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIENvb2tpZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIFNlc3Npb246IHsgW2tleTogc3RyaW5nXTogYW55IH0sIEZpbGVzOiBGaWxlcywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBvdXRfcnVuX3NjcmlwdCA9IHsgdGV4dDogJycgfTtcblxuICAgICAgICBmdW5jdGlvbiBUb1N0cmluZ0luZm8oc3RyOiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzU3RyaW5nID0gc3RyPy50b1N0cmluZz8uKCk7XG4gICAgICAgICAgICBpZiAoYXNTdHJpbmcgPT0gbnVsbCB8fCBhc1N0cmluZy5zdGFydHNXaXRoKCdbb2JqZWN0IE9iamVjdF0nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdHIsIG51bGwsIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UmVzcG9uc2UodGV4dDogYW55KSB7XG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ID0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCA9ICcnKSB7XG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB3cml0ZVNhZmUoc3RyID0gJycpIHtcbiAgICAgICAgICAgIHN0ciA9IFRvU3RyaW5nSW5mbyhzdHIpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2Ygc3RyKSB7XG4gICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSAnJiMnICsgaS5jaGFyQ29kZUF0KDApICsgJzsnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZWNobyhhcnI6IHN0cmluZ1tdLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgd3JpdGVTYWZlKHBhcmFtc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyLmF0KC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWRpcmVjdFBhdGg6IGFueSA9IGZhbHNlO1xuXG4gICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0ID0gKHBhdGg6IHN0cmluZywgc3RhdHVzPzogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSBTdHJpbmcocGF0aCk7XG4gICAgICAgICAgICBpZiAoc3RhdHVzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5zdGF0dXMoc3RhdHVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFJlc3BvbnNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICg8YW55PlJlc3BvbnNlKS5yZWxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBSZXNwb25zZS5yZWRpcmVjdChSZXF1ZXN0LnVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW5kRmlsZShmaWxlUGF0aCwgZGVsZXRlQWZ0ZXIgPSBmYWxzZSkge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0geyBmaWxlOiBmaWxlUGF0aCwgZGVsZXRlQWZ0ZXIgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IERhdGFTZW5kID0ge1xuICAgICAgICAgICAgc2VuZEZpbGUsXG4gICAgICAgICAgICB3cml0ZVNhZmUsXG4gICAgICAgICAgICB3cml0ZSxcbiAgICAgICAgICAgIGVjaG8sXG4gICAgICAgICAgICBzZXRSZXNwb25zZSxcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LFxuICAgICAgICAgICAgcnVuX3NjcmlwdF9uYW1lLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUG9zdCxcbiAgICAgICAgICAgIFF1ZXJ5LFxuICAgICAgICAgICAgU2Vzc2lvbixcbiAgICAgICAgICAgIEZpbGVzLFxuICAgICAgICAgICAgQ29va2llcyxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBQYWdlVmFyLFxuICAgICAgICAgICAgR2xvYmFsVmFyLFxuICAgICAgICAgICAgY29kZWJhc2U6ICcnXG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBMb2FkUGFnZUZ1bmMoRGF0YVNlbmQpO1xuXG4gICAgICAgIHJldHVybiB7IG91dF9ydW5fc2NyaXB0OiBvdXRfcnVuX3NjcmlwdC50ZXh0LCByZWRpcmVjdFBhdGggfVxuICAgIH0pXG59XG5cbmV4cG9ydCB7IExvYWRQYWdlLCBCdWlsZFBhZ2UsIGdldEZ1bGxQYXRoQ29tcGlsZSwgRXhwb3J0LCBTcGxpdEZpcnN0IH07XG4iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSwgQWRkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9BbGlhcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuXG50eXBlIFJlcXVpcmVGaWxlcyA9IHtcbiAgICBwYXRoOiBzdHJpbmdcbiAgICBzdGF0dXM/OiBudW1iZXJcbiAgICBtb2RlbDogYW55XG4gICAgZGVwZW5kZW5jaWVzPzogU3RyaW5nQW55TWFwXG4gICAgc3RhdGljPzogYm9vbGVhblxufVxuXG5jb25zdCBDYWNoZVJlcXVpcmVGaWxlcyA9IHt9O1xuXG4vKipcbiAqIEl0IG1ha2VzIGEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBkZXBlbmRlbmNpZXMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSBhcnJheSBvZiBiYXNlIHBhdGhzXG4gKiBAcGFyYW0gW2Jhc2VQYXRoXSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgY29tcGlsZWQuXG4gKiBAcGFyYW0gY2FjaGUgLSBBIGNhY2hlIG9mIHRoZSBsYXN0IHRpbWUgYSBmaWxlIHdhcyBtb2RpZmllZC5cbiAqIEByZXR1cm5zIEEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IFN0cmluZ0FueU1hcCwgdHlwZUFycmF5OiBzdHJpbmdbXSwgYmFzZVBhdGggPSAnJywgY2FjaGUgPSB7fSkge1xuICAgIGNvbnN0IGRlcGVuZGVuY2llc01hcDogU3RyaW5nQW55TWFwID0ge307XG4gICAgY29uc3QgcHJvbWlzZUFsbCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ZpbGVQYXRoLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBwcm9taXNlQWxsLnB1c2goKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aCA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWNoZVtiYXNlUGF0aF0pXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2Jhc2VQYXRoXSA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIGJhc2VQYXRoLCAnbXRpbWVNcycsIHRydWUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFsndGhpc0ZpbGUnXSA9IGNhY2hlW2Jhc2VQYXRoXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwW2ZpbGVQYXRoXSA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoPGFueT52YWx1ZSwgdHlwZUFycmF5LCBmaWxlUGF0aCwgY2FjaGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICkoKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZUFsbCk7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llc01hcDtcbn1cblxuLyoqXG4gKiBJZiB0aGUgb2xkIGRlcGVuZGVuY2llcyBhbmQgdGhlIG5ldyBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY3kgbWFwLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZS5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXApIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGRlcGVuZGVuY3kgdHJlZXMsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbmFtZXMgb2YgdGhlIG1vZHVsZXMgdGhhdCBoYXZlIGNoYW5nZWRcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIFtwYXJlbnRdIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmVudCBtb2R1bGUuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MuIEVhY2ggc3RyaW5nIHJlcHJlc2VudHMgYSBjaGFuZ2UgaW4gdGhlIGRlcGVuZGVuY3lcbiAqIHRyZWUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYW5nZUFycmF5KG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwLCBwYXJlbnQgPSAnJyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBjaGFuZ2VBcnJheSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghbmV3RGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChuYW1lKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlID0gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKC4uLmNoYW5nZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlQXJyYXk7XG59XG5cbi8qKlxuICogSXQgaW1wb3J0cyBhIGZpbGUgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gcGF0aHMgdHlwZXMuXG4gKiBAcGFyYW0gTGFzdFJlcXVpcmUgLSBBIG1hcCBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW5cbiAqIEByZXR1cm5zIFRoZSBtb2RlbCB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBMYXN0UmVxdWlyZTogeyBba2V5OiBzdHJpbmddOiBSZXF1aXJlRmlsZXMgfSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IFJlcUZpbGUgPSBMYXN0UmVxdWlyZVtmaWxlUGF0aF07XG5cbiAgICBsZXQgZmlsZUV4aXN0czogbnVtYmVyLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXA7XG4gICAgaWYgKFJlcUZpbGUpIHtcblxuICAgICAgICBpZiAoIWlzRGVidWcgfHwgaXNEZWJ1ZyAmJiAoUmVxRmlsZS5zdGF0dXMgPT0gLTEpKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIFJlcUZpbGUucGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcblxuICAgICAgICAgICAgbmV3RGVwcyA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSk7XG5cbiAgICAgICAgICAgIGlmIChjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShSZXFGaWxlLmRlcGVuZGVuY2llcywgbmV3RGVwcykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgfSBlbHNlIGlmIChSZXFGaWxlLnN0YXR1cyA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgc3RhdGljX21vZHVsZXMgPSBmYWxzZTtcblxuICAgIGlmICghUmVxRmlsZSkge1xuICAgICAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKVxuICAgICAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5yZWxhdGl2ZSh0eXBlQXJyYXlbMF0sIF9fZGlybmFtZSksIGZpbGVQYXRoKTtcblxuICAgICAgICBlbHNlIGlmIChmaWxlUGF0aFswXSAhPSAnLycpXG4gICAgICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IHRydWU7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCA9IFJlcUZpbGUucGF0aDtcbiAgICAgICAgc3RhdGljX21vZHVsZXMgPSBSZXFGaWxlLnN0YXRpYztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGljX21vZHVsZXMpXG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEFsaWFzT3JQYWNrYWdlKGNvcHlQYXRoKSwgc3RhdHVzOiAtMSwgc3RhdGljOiB0cnVlLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgIGVsc2Uge1xuICAgICAgICAvLyBhZGQgc2Vydi5qcyBvciBzZXJ2LnRzIGlmIG5lZWRlZFxuICAgICAgICBmaWxlUGF0aCA9IEFkZEV4dGVuc2lvbihmaWxlUGF0aCk7XG5cbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSB0eXBlQXJyYXlbMF0gKyBmaWxlUGF0aDtcbiAgICAgICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVNb2RlbCA9IENhY2hlUmVxdWlyZUZpbGVzW2ZpbGVQYXRoXTtcbiAgICAgICAgICAgIGlmIChoYXZlTW9kZWwgJiYgY29tcGFyZURlcGVuZGVuY2llc1NhbWUoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcyA9IG5ld0RlcHMgPz8gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpKSlcbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSBoYXZlTW9kZWw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdEZXBzID0gbmV3RGVwcyA/PyB7fTtcblxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEltcG9ydEZpbGUoX19maWxlbmFtZSwgZmlsZVBhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgbmV3RGVwcywgaGF2ZU1vZGVsICYmIGdldENoYW5nZUFycmF5KGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKSwgZGVwZW5kZW5jaWVzOiBuZXdEZXBzLCBwYXRoOiBmaWxlUGF0aCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiB7fSwgc3RhdHVzOiAwLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtmaWxlUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBidWlsdE1vZGVsID0gTGFzdFJlcXVpcmVbY29weVBhdGhdO1xuICAgIENhY2hlUmVxdWlyZUZpbGVzW2J1aWx0TW9kZWwucGF0aF0gPSBidWlsdE1vZGVsO1xuXG4gICAgcmV0dXJuIGJ1aWx0TW9kZWwubW9kZWw7XG59IiwgImltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIHRyaW1UeXBlLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuXG4vLyAtLSBzdGFydCBvZiBmZXRjaCBmaWxlICsgY2FjaGUgLS1cblxudHlwZSBhcGlJbmZvID0ge1xuICAgIHBhdGhTcGxpdDogbnVtYmVyLFxuICAgIGRlcHNNYXA6IHsgW2tleTogc3RyaW5nXTogYW55IH1cbn1cblxuY29uc3QgYXBpU3RhdGljTWFwOiB7IFtrZXk6IHN0cmluZ106IGFwaUluZm8gfSA9IHt9O1xuXG4vKipcbiAqIEdpdmVuIGEgdXJsLCByZXR1cm4gdGhlIHN0YXRpYyBwYXRoIGFuZCBkYXRhIGluZm8gaWYgdGhlIHVybCBpcyBpbiB0aGUgc3RhdGljIG1hcFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB0aGUgdXNlciBpcyByZXF1ZXN0aW5nLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhdGhTcGxpdCAtIHRoZSBudW1iZXIgb2Ygc2xhc2hlcyBpbiB0aGUgdXJsLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAqL1xuZnVuY3Rpb24gZ2V0QXBpRnJvbU1hcCh1cmw6IHN0cmluZywgcGF0aFNwbGl0OiBudW1iZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXBpU3RhdGljTWFwKTtcbiAgICBmb3IgKGNvbnN0IGkgb2Yga2V5cykge1xuICAgICAgICBjb25zdCBlID0gYXBpU3RhdGljTWFwW2ldO1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkgJiYgZS5wYXRoU3BsaXQgPT0gcGF0aFNwbGl0KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNQYXRoOiBpLFxuICAgICAgICAgICAgICAgIGRhdGFJbmZvOiBlXG4gICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBBUEkgZmlsZSBmb3IgYSBnaXZlbiBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBBUEkuXG4gKiBAcmV0dXJucyBUaGUgcGF0aCB0byB0aGUgQVBJIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZpbmRBcGlQYXRoKHVybDogc3RyaW5nKSB7XG5cbiAgICB3aGlsZSAodXJsLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzdGFydFBhdGggPSBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzBdLCB1cmwgKyAnLmFwaScpO1xuICAgICAgICBjb25zdCBtYWtlUHJvbWlzZSA9IGFzeW5jICh0eXBlOiBzdHJpbmcpID0+IChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShzdGFydFBhdGggKyAnLicgKyB0eXBlKSAmJiB0eXBlKTtcblxuICAgICAgICBjb25zdCBmaWxlVHlwZSA9IChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgndHMnKSxcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCdqcycpXG4gICAgICAgIF0pKS5maWx0ZXIoeCA9PiB4KS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChmaWxlVHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1cmwgKyAnLmFwaS4nICsgZmlsZVR5cGU7XG5cbiAgICAgICAgdXJsID0gQ3V0VGhlTGFzdCgnLycsIHVybCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aFNwbGl0ID0gdXJsLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgIGxldCB7IHN0YXRpY1BhdGgsIGRhdGFJbmZvIH0gPSBnZXRBcGlGcm9tTWFwKHVybCwgcGF0aFNwbGl0KTtcblxuICAgIGlmICghZGF0YUluZm8pIHtcbiAgICAgICAgc3RhdGljUGF0aCA9IGF3YWl0IGZpbmRBcGlQYXRoKHVybCk7XG5cbiAgICAgICAgaWYgKHN0YXRpY1BhdGgpIHtcbiAgICAgICAgICAgIGRhdGFJbmZvID0ge1xuICAgICAgICAgICAgICAgIHBhdGhTcGxpdCxcbiAgICAgICAgICAgICAgICBkZXBzTWFwOiB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcGlTdGF0aWNNYXBbc3RhdGljUGF0aF0gPSBkYXRhSW5mbztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhSW5mbykge1xuICAgICAgICByZXR1cm4gYXdhaXQgTWFrZUNhbGwoXG4gICAgICAgICAgICBhd2FpdCBSZXF1aXJlRmlsZSgnLycgKyBzdGF0aWNQYXRoLCAnYXBpLWNhbGwnLCAnJywgZ2V0VHlwZXMuU3RhdGljLCBkYXRhSW5mby5kZXBzTWFwLCBpc0RlYnVnKSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIHVybC5zdWJzdHJpbmcoc3RhdGljUGF0aC5sZW5ndGggLSA2KSxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBuZXh0UHJhc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4vLyAtLSBlbmQgb2YgZmV0Y2ggZmlsZSAtLVxuY29uc3QgYmFuV29yZHMgPSBbJ3ZhbGlkYXRlVVJMJywgJ3ZhbGlkYXRlRnVuYycsICdmdW5jJywgJ2RlZmluZScsIC4uLmh0dHAuTUVUSE9EU107XG4vKipcbiAqIEZpbmQgdGhlIEJlc3QgUGF0aFxuICovXG5mdW5jdGlvbiBmaW5kQmVzdFVybE9iamVjdChvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nKSB7XG4gICAgbGV0IG1heExlbmd0aCA9IDAsIHVybCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBpLmxlbmd0aDtcbiAgICAgICAgaWYgKG1heExlbmd0aCA8IGxlbmd0aCAmJiB1cmxGcm9tLnN0YXJ0c1dpdGgoaSkgJiYgIWJhbldvcmRzLmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBsZW5ndGg7XG4gICAgICAgICAgICB1cmwgPSBpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBQYXJzZSBBbmQgVmFsaWRhdGUgVVJMXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlVVJMRGF0YSh2YWxpZGF0ZTogYW55LCB2YWx1ZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBsZXQgcHVzaERhdGEgPSB2YWx1ZSwgcmVzRGF0YSA9IHRydWUsIGVycm9yOiBzdHJpbmc7XG5cbiAgICBzd2l0Y2ggKHZhbGlkYXRlKSB7XG4gICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICBjYXNlIHBhcnNlRmxvYXQ6XG4gICAgICAgIGNhc2UgcGFyc2VJbnQ6XG4gICAgICAgICAgICBwdXNoRGF0YSA9ICg8YW55PnZhbGlkYXRlKSh2YWx1ZSk7XG4gICAgICAgICAgICByZXNEYXRhID0gIWlzTmFOKHB1c2hEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICBwdXNoRGF0YSA9IHZhbHVlICE9ICdmYWxzZSc7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXNEYXRhID0gdmFsdWUgPT0gJ3RydWUnIHx8IHZhbHVlID09ICdmYWxzZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdGUpKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ha2VWYWxpZCA9IGF3YWl0IHZhbGlkYXRlKHZhbHVlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWtlVmFsaWQgJiYgdHlwZW9mIG1ha2VWYWxpZCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZC52YWxpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hEYXRhID0gbWFrZVZhbGlkLnBhcnNlID8/IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQ7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvciwgZmllbGQgLSAnICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUudGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNEYXRhKVxuICAgICAgICBlcnJvciA9ICdFcnJvciB2YWxpZGF0ZSBmaWVsZCwgdmFsdWUgaXMgXCInICsgdmFsdWUgKyAnXCInO1xuXG4gICAgcmV0dXJuIFtlcnJvciwgcHVzaERhdGFdO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIHRoZSBVUkwgZGF0YSBhbmQgcGFyc2VzIGl0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IG9iaiAtIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgVVJMIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gVGhlIFVSTCB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSB7YW55fSBkZWZpbmVPYmplY3QgLSBBbGwgdGhlIGRlZmluaXRpb25zIHRoYXQgaGFzIGJlZW4gZm91bmRcbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSBtYWtlTWFzc2FnZSAtIENyZWF0ZSBhbiBlcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBwcm9wZXJ0eS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlZmluaXRpb24ob2JqOiBhbnksIHVybEZyb206IHN0cmluZywgZGVmaW5lT2JqZWN0OiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGlmICghb2JqLmRlZmluZSlcbiAgICAgICAgcmV0dXJuIHVybEZyb207XG5cbiAgICBjb25zdCB2YWxpZGF0ZUZ1bmMgPSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcbiAgICBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYyA9IG51bGw7XG4gICAgZGVsZXRlIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9iai5kZWZpbmUpIHtcbiAgICAgICAgY29uc3QgW2RhdGFTbGFzaCwgbmV4dFVybEZyb21dID0gU3BsaXRGaXJzdCgnLycsIHVybEZyb20pO1xuICAgICAgICB1cmxGcm9tID0gbmV4dFVybEZyb207XG5cbiAgICAgICAgY29uc3QgW2Vycm9yLCBuZXdEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YShvYmouZGVmaW5lW25hbWVdLCBkYXRhU2xhc2gsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgaWYoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgXG4gICAgICAgIGRlZmluZU9iamVjdFtuYW1lXSA9IG5ld0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgdmFsaWRhdGVGdW5jKGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycgPyB2YWxpZGF0ZTogJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJ307XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybEZyb20gfHwgJyc7XG59XG4vKipcbiAqIFRoZSBmdW5jdGlvbiB3aWxsIHBhcnNlIHRoZSB1cmwgYW5kIGZpbmQgdGhlIGJlc3QgbWF0Y2ggZm9yIHRoZSB1cmxcbiAqIEBwYXJhbSB7YW55fSBmaWxlTW9kdWxlIC0gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRob2QgdGhhdCB5b3Ugd2FudCB0byBjYWxsLlxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSB0aGUgdXJsIHRoYXQgdGhlIHVzZXIgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSAoKSA9PiBQcm9taXNlPGFueT5cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSwgdGhlIHJlcXVlc3QgaXMgcHJvY2Vzc2VkLiBJZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgZmFsc2UsIHRoZSByZXF1ZXN0IGlzIG5vdCBwcm9jZXNzZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIE1ha2VDYWxsKGZpbGVNb2R1bGU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxsb3dFcnJvckluZm8gPSAhR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpICYmIGlzRGVidWcsIG1ha2VNYXNzYWdlID0gKGU6IGFueSkgPT4gKGlzRGVidWcgPyBwcmludC5lcnJvcihlKSA6IG51bGwpICsgKGFsbG93RXJyb3JJbmZvID8gYCwgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCA6ICcnKTtcbiAgICBjb25zdCBtZXRob2QgPSBSZXF1ZXN0Lm1ldGhvZDtcbiAgICBsZXQgbWV0aG9kT2JqID0gZmlsZU1vZHVsZVttZXRob2RdIHx8IGZpbGVNb2R1bGUuZGVmYXVsdFttZXRob2RdOyAvL0xvYWRpbmcgdGhlIG1vZHVsZSBieSBtZXRob2RcbiAgICBsZXQgaGF2ZU1ldGhvZCA9IHRydWU7XG5cbiAgICBpZighbWV0aG9kT2JqKXtcbiAgICAgICAgaGF2ZU1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBtZXRob2RPYmogPSBmaWxlTW9kdWxlLmRlZmF1bHQgfHwgZmlsZU1vZHVsZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlTWV0aG9kID0gbWV0aG9kT2JqO1xuXG4gICAgY29uc3QgZGVmaW5lT2JqZWN0ID0ge307XG5cbiAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7IC8vIHJvb3QgbGV2ZWwgZGVmaW5pdGlvblxuICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuXG4gICAgbGV0IG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSk7XG5cbiAgICAvL3BhcnNlIHRoZSB1cmwgcGF0aFxuICAgIGZvcihsZXQgaSA9IDA7IGk8IDI7IGkrKyl7XG4gICAgICAgIHdoaWxlICgobmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcbiAgICAgICAgICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICAgICAgICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG4gICAgXG4gICAgICAgICAgICB1cmxGcm9tID0gdHJpbVR5cGUoJy8nLCB1cmxGcm9tLnN1YnN0cmluZyhuZXN0ZWRVUkwubGVuZ3RoKSk7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbmVzdGVkVVJMXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFoYXZlTWV0aG9kKXsgLy8gY2hlY2sgaWYgdGhhdCBhIG1ldGhvZFxuICAgICAgICAgICAgaGF2ZU1ldGhvZCA9IHRydWU7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9iaj8uZnVuYyAmJiBtZXRob2RPYmogfHwgYmFzZU1ldGhvZDsgLy8gaWYgdGhlcmUgaXMgYW4gJ2FueScgbWV0aG9kXG5cblxuICAgIGlmICghbWV0aG9kT2JqPy5mdW5jKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsZWZ0RGF0YSA9IHVybEZyb20uc3BsaXQoJy8nKTtcbiAgICBjb25zdCB1cmxEYXRhID0gW107XG5cblxuICAgIGxldCBlcnJvcjogc3RyaW5nO1xuICAgIGlmIChtZXRob2RPYmoudmFsaWRhdGVVUkwpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHZhbGlkYXRlXSBvZiBPYmplY3QuZW50cmllcyhtZXRob2RPYmoudmFsaWRhdGVVUkwpKSB7XG4gICAgICAgICAgICBjb25zdCBbZXJyb3JVUkwsIHB1c2hEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YSh2YWxpZGF0ZSwgbGVmdERhdGFbaW5kZXhdLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JVUkwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IDxzdHJpbmc+ZXJyb3JVUkw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybERhdGEucHVzaChwdXNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdXJsRGF0YS5wdXNoKC4uLmxlZnREYXRhKTtcblxuICAgIGlmICghZXJyb3IgJiYgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYyhsZWZ0RGF0YSwgUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZTtcbiAgICAgICAgZWxzZSBpZiAoIXZhbGlkYXRlKVxuICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGluZyBVUkwnO1xuICAgIH1cblxuICAgIGlmIChlcnJvcilcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvciB9KTtcblxuICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGxldCBhcGlSZXNwb25zZTogYW55LCBuZXdSZXNwb25zZTogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGFwaVJlc3BvbnNlID0gYXdhaXQgbWV0aG9kT2JqLmZ1bmMoUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEsIGRlZmluZU9iamVjdCwgbGVmdERhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGFsbG93RXJyb3JJbmZvKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiBlLm1lc3NhZ2UgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6ICc1MDAgLSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhcGlSZXNwb25zZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyB0ZXh0OiBhcGlSZXNwb25zZSB9O1xuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSBhcGlSZXNwb25zZSB8fCBuZXdSZXNwb25zZTtcblxuICAgIGZpbmFsU3RlcCgpOyAgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgaWYgKG5ld1Jlc3BvbnNlICE9IG51bGwpXG4gICAgICAgIFJlc3BvbnNlLmpzb24obmV3UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSBhcyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgR2V0RmlsZSBhcyBHZXRTdGF0aWNGaWxlLCBzZXJ2ZXJCdWlsZCB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgKiBhcyBGdW5jU2NyaXB0IGZyb20gJy4vRnVuY3Rpb25TY3JpcHQnO1xuaW1wb3J0IE1ha2VBcGlDYWxsIGZyb20gJy4vQXBpQ2FsbCc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmNvbnN0IHsgRXhwb3J0IH0gPSBGdW5jU2NyaXB0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yUGFnZXMge1xuICAgIG5vdEZvdW5kPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9LFxuICAgIHNlcnZlckVycm9yPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9XG59XG5cbmludGVyZmFjZSBHZXRQYWdlc1NldHRpbmdzIHtcbiAgICBDYWNoZURheXM6IG51bWJlcixcbiAgICBEZXZNb2RlOiBib29sZWFuLFxuICAgIENvb2tpZVNldHRpbmdzPzogYW55LFxuICAgIENvb2tpZXM/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBDb29raWVFbmNyeXB0ZXI/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBTZXNzaW9uU3RvcmU/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBFcnJvclBhZ2VzOiBFcnJvclBhZ2VzXG59XG5cbmNvbnN0IFNldHRpbmdzOiBHZXRQYWdlc1NldHRpbmdzID0ge1xuICAgIENhY2hlRGF5czogMSxcbiAgICBEZXZNb2RlOiB0cnVlLFxuICAgIEVycm9yUGFnZXM6IHt9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlVG9SYW0odXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVuY1NjcmlwdC5nZXRGdWxsUGF0aENvbXBpbGUodXJsKSkpIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF0gPSBbXTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0gPSBhd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHVybCwgaXNEZWJ1Zyk7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UoRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0sIHVybCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkQWxsUGFnZXNUb1JhbShpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHBhZ2VEZXBzLnN0b3JlKSB7XG4gICAgICAgIGlmICghRXh0ZW5zaW9uSW5BcnJheShpLCA8YW55PkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkpKVxuICAgICAgICAgICAgYXdhaXQgTG9hZFBhZ2VUb1JhbShpLCBpc0RlYnVnKTtcblxuICAgIH1cbn1cblxuZnVuY3Rpb24gQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIEV4cG9ydC5QYWdlTG9hZFJhbSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGRlbGV0ZSBFeHBvcnQuUGFnZUxvYWRSYW1baV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBFeHRlbnNpb25JbkFycmF5KGZpbGVQYXRoOiBzdHJpbmcsIC4uLmFycmF5czogc3RyaW5nW10pIHtcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGguc3Vic3RyaW5nKGZpbGVQYXRoLmxlbmd0aCAtIGkubGVuZ3RoIC0gMSkgPT0gJy4nICsgaSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gR2V0RXJyb3JQYWdlKGNvZGU6IG51bWJlciwgTG9jU2V0dGluZ3M6ICdub3RGb3VuZCcgfCAnc2VydmVyRXJyb3InKSB7XG4gICAgbGV0IGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nO1xuICAgIGlmIChTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXSkge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWM7XG4gICAgICAgIHVybCA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLnBhdGg7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5jb2RlID8/IGNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuTG9ncztcbiAgICAgICAgdXJsID0gJ2UnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdXJsLCBhcnJheVR5cGUsIGNvZGUgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGNvZGU6IG51bWJlcikge1xuICAgIC8vZmlyc3Qgc3RlcCAtIHBhcnNlIGluZm9cbiAgICBpZiAoUmVxdWVzdC5tZXRob2QgPT0gXCJQT1NUXCIpIHtcbiAgICAgICAgaWYgKCFSZXF1ZXN0LmJvZHkgfHwgIU9iamVjdC5rZXlzKFJlcXVlc3QuYm9keSkubGVuZ3RoKVxuICAgICAgICAgICAgUmVxdWVzdC5ib2R5ID0gUmVxdWVzdC5maWVsZHMgfHwge307XG5cbiAgICB9IGVsc2VcbiAgICAgICAgUmVxdWVzdC5ib2R5ID0gZmFsc2U7XG5cblxuICAgIGlmIChSZXF1ZXN0LmNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZXMoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZUVuY3J5cHRlcihSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuU2Vzc2lvblN0b3JlKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG5cbiAgICBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgfHwge307XG4gICAgUmVxdWVzdC5maWxlcyA9IFJlcXVlc3QuZmlsZXMgfHwge307XG5cbiAgICBjb25zdCBDb3B5Q29va2llcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzKSk7XG5cbiAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gMjAxO1xuXG4gICAgLy9zZWNvbmQgc3RlcFxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChSZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDEpXG4gICAgICAgICAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gY29kZTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LnNpZ25lZENvb2tpZXMpIHsvL3VwZGF0ZSBjb29raWVzXG4gICAgICAgICAgICBpZiAodHlwZW9mIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSAnb2JqZWN0JyAmJiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gQ29weUNvb2tpZXNbaV0gfHwgSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldKSAhPSBKU09OLnN0cmluZ2lmeShDb3B5Q29va2llc1tpXSkpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY29va2llKGksIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSwgU2V0dGluZ3MuQ29va2llU2V0dGluZ3MpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gQ29weUNvb2tpZXMpIHsvL2RlbGV0ZSBub3QgZXhpdHMgY29va2llc1xuICAgICAgICAgICAgaWYgKFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNsZWFyQ29va2llKGkpO1xuXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vZm9yIGZpbmFsIHN0ZXBcbmZ1bmN0aW9uIG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55KSB7XG4gICAgaWYgKCFSZXF1ZXN0LmZpbGVzKSAvL2RlbGV0ZSBmaWxlc1xuICAgICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IGFyclBhdGggPSBbXVxuXG4gICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3QuZmlsZXMpIHtcblxuICAgICAgICBjb25zdCBlID0gUmVxdWVzdC5maWxlc1tpXTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBpbiBlKSB7XG4gICAgICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGVbYV0uZmlsZXBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGFyclBhdGgucHVzaChlLmZpbGVwYXRoKTtcblxuICAgIH1cblxuICAgIHJldHVybiBhcnJQYXRoO1xufVxuXG4vL2ZpbmFsIHN0ZXBcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJlcXVlc3RGaWxlcyhhcnJheTogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IGUgaW4gYXJyYXkpXG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNVUkxQYXRoQUZpbGUoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGlmIChjb2RlID09IDIwMCkge1xuICAgICAgICBjb25zdCBmdWxsUGFnZVVybCA9IGdldFR5cGVzLlN0YXRpY1swXSArIHVybDtcbiAgICAgICAgLy9jaGVjayB0aGF0IGlzIG5vdCBzZXJ2ZXIgZmlsZVxuICAgICAgICBpZiAoYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgU2V0dGluZ3MuRGV2TW9kZSwgdXJsKSB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgICAgICByZXR1cm4gZnVsbFBhZ2VVcmw7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aDogc3RyaW5nLCBmaXJzdEZ1bmM/OiBhbnkpIHtcbiAgICBjb25zdCBwYWdlQXJyYXkgPSBbZmlyc3RGdW5jID8/IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2Uoc21hbGxQYXRoLCBTZXR0aW5ncy5EZXZNb2RlKV07XG5cbiAgICBwYWdlQXJyYXlbMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShwYWdlQXJyYXlbMF0sIHNtYWxsUGF0aCk7XG5cbiAgICBpZiAoRXhwb3J0LlBhZ2VSYW0pXG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdID0gcGFnZUFycmF5O1xuXG4gICAgcmV0dXJuIHBhZ2VBcnJheVsxXTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gbG9hZCB0aGUgZHluYW1pYyBwYWdlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBUaGUgYXJyYXkgb2YgdHlwZXMgdGhhdCB0aGUgcGFnZSBpcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsUGFnZVVybCAtIFRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gc21hbGxQYXRoIC0gVGhlIHBhdGggdG8gdGhlIHBhZ2UgZmlsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gVGhlIHN0YXR1cyBjb2RlIG9mIHRoZSBwYWdlLlxuICogQHJldHVybnMgVGhlIER5bmFtaWNGdW5jIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIGdlbmVyYXRlIHRoZSBwYWdlLlxuICogVGhlIGNvZGUgaXMgdGhlIHN0YXR1cyBjb2RlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAqIFRoZSBmdWxsUGFnZVVybCBpcyB0aGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREeW5hbWljUGFnZShhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW5TdGF0aWMgPSB1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgIGNvbnN0IHNtYWxsUGF0aCA9IGFycmF5VHlwZVsyXSArICcvJyArIGluU3RhdGljO1xuICAgIGxldCBmdWxsUGFnZVVybCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc21hbGxQYXRoO1xuXG4gICAgbGV0IER5bmFtaWNGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IGFueTtcbiAgICBpZiAoU2V0dGluZ3MuRGV2TW9kZSAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpIHtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVsxXSArIGluU3RhdGljICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2Uoc21hbGxQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUodXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgYXJyYXlUeXBlKTtcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlsxXSlcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCwgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlswXSk7XG5cbiAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMV0pXG4gICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICBlbHNlIGlmICghRXhwb3J0LlBhZ2VSYW0gJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKVxuICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoLCBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzBdKTtcblxuICAgIGVsc2UgaWYgKGFycmF5VHlwZSAhPSBnZXRUeXBlcy5Mb2dzKSB7XG4gICAgICAgIGNvbnN0IHsgYXJyYXlUeXBlLCBjb2RlLCB1cmwgfSA9IEdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlLCB1cmwsIGNvZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIER5bmFtaWNGdW5jLFxuICAgICAgICBjb2RlLFxuICAgICAgICBmdWxsUGFnZVVybFxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTWFrZVBhZ2VSZXNwb25zZShEeW5hbWljUmVzcG9uc2U6IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55KSB7XG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGg/LmZpbGUpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IFJlc3BvbnNlLm9uKCdmaW5pc2gnLCByZXMpKTtcbiAgICB9IGVsc2UgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGgpIHtcbiAgICAgICAgUmVzcG9uc2Uud3JpdGVIZWFkKDMwMiwgeyBMb2NhdGlvbjogRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCB9KTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgUmVzUGFnZSA9IER5bmFtaWNSZXNwb25zZS5vdXRfcnVuX3NjcmlwdC50cmltKCk7XG4gICAgICAgIGlmIChSZXNQYWdlKSB7XG4gICAgICAgICAgICBSZXNwb25zZS5zZW5kKFJlc1BhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5kZWxldGVBZnRlcikge1xuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gYSBwYWdlLiBcbiAqIEl0IHdpbGwgY2hlY2sgaWYgdGhlIHBhZ2UgZXhpc3RzLCBhbmQgaWYgaXQgZG9lcywgaXQgd2lsbCByZXR1cm4gdGhlIHBhZ2UuIFxuICogSWYgaXQgZG9lcyBub3QgZXhpc3QsIGl0IHdpbGwgcmV0dXJuIGEgNDA0IHBhZ2VcbiAqIEBwYXJhbSB7UmVxdWVzdCB8IGFueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aHNcbiAqIGxvYWRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBwYWdlIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7eyBmaWxlOiBib29sZWFuLCBmdWxsUGFnZVVybDogc3RyaW5nIH19IEZpbGVJbmZvIC0gdGhlIGZpbGUgaW5mbyBvZiB0aGUgcGFnZSB0aGF0IGlzIGJlaW5nIGFjdGl2YXRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gbnVtYmVyXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBhZnRlciB0aGUgZHluYW1pYyBwYWdlXG4gKiBpcyBsb2FkZWQuXG4gKiBAcmV0dXJucyBOb3RoaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBBY3RpdmF0ZVBhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IHsgRHluYW1pY0Z1bmMsIGZ1bGxQYWdlVXJsLCBjb2RlOiBuZXdDb2RlIH0gPSBhd2FpdCBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgY29kZSk7XG5cbiAgICBpZiAoIWZ1bGxQYWdlVXJsIHx8ICFEeW5hbWljRnVuYyAmJiBjb2RlID09IDUwMClcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLnNlbmRTdGF0dXMobmV3Q29kZSk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG4gICAgICAgIGNvbnN0IHBhZ2VEYXRhID0gYXdhaXQgRHluYW1pY0Z1bmMoUmVzcG9uc2UsIFJlcXVlc3QsIFJlcXVlc3QuYm9keSwgUmVxdWVzdC5xdWVyeSwgUmVxdWVzdC5jb29raWVzLCBSZXF1ZXN0LnNlc3Npb24sIFJlcXVlc3QuZmlsZXMsIFNldHRpbmdzLkRldk1vZGUpO1xuICAgICAgICBmaW5hbFN0ZXAoKTsgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgICAgIGF3YWl0IE1ha2VQYWdlUmVzcG9uc2UoXG4gICAgICAgICAgICBwYWdlRGF0YSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICBwcmludC5lcnJvcihlKTtcbiAgICAgICAgUmVxdWVzdC5lcnJvciA9IGU7XG5cbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gR2V0RXJyb3JQYWdlKDUwMCwgJ3NlcnZlckVycm9yJyk7XG5cbiAgICAgICAgRHluYW1pY1BhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBEeW5hbWljUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnksIHVybDogc3RyaW5nLCBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWMsIGNvZGUgPSAyMDApIHtcbiAgICBjb25zdCBGaWxlSW5mbyA9IGF3YWl0IGlzVVJMUGF0aEFGaWxlKFJlcXVlc3QsIHVybCwgY29kZSk7XG5cbiAgICBjb25zdCBtYWtlRGVsZXRlQXJyYXkgPSBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdClcblxuICAgIGlmIChGaWxlSW5mbykge1xuICAgICAgICBTZXR0aW5ncy5DYWNoZURheXMgJiYgUmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcIm1heC1hZ2U9XCIgKyAoU2V0dGluZ3MuQ2FjaGVEYXlzICogMjQgKiA2MCAqIDYwKSk7XG4gICAgICAgIGF3YWl0IEdldFN0YXRpY0ZpbGUodXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFByYXNlID0gKCkgPT4gUGFyc2VCYXNpY0luZm8oUmVxdWVzdCwgUmVzcG9uc2UsIGNvZGUpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGNvbnN0IGlzQXBpID0gYXdhaXQgTWFrZUFwaUNhbGwoUmVxdWVzdCwgUmVzcG9uc2UsIHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgbmV4dFByYXNlKTtcbiAgICBpZiAoIWlzQXBpICYmICFhd2FpdCBBY3RpdmF0ZVBhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIGFycmF5VHlwZSwgdXJsLCBjb2RlLCBuZXh0UHJhc2UpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTsgLy8gZGVsZXRlIGZpbGVzXG59XG5cbmZ1bmN0aW9uIHVybEZpeCh1cmw6IHN0cmluZykge1xuICAgIGlmICh1cmwgPT0gJy8nKSB7XG4gICAgICAgIHVybCA9ICcvaW5kZXgnO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbn1cblxuZXhwb3J0IHtcbiAgICBTZXR0aW5ncyxcbiAgICBEeW5hbWljUGFnZSxcbiAgICBMb2FkQWxsUGFnZXNUb1JhbSxcbiAgICBDbGVhckFsbFBhZ2VzRnJvbVJhbSxcbiAgICB1cmxGaXgsXG4gICAgR2V0RXJyb3JQYWdlXG59IiwgImltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0ICogYXMgQnVpbGRTZXJ2ZXIgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IGNvb2tpZVBhcnNlciB9IGZyb20gJ0B0aW55aHR0cC9jb29raWUtcGFyc2VyJztcbmltcG9ydCBjb29raWVFbmNyeXB0ZXIgZnJvbSAnY29va2llLWVuY3J5cHRlcic7XG5pbXBvcnQgeyBhbGxvd1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgSW5zZXJ0TW9kZWxzU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IHsgU3RhcnRSZXF1aXJlLCBHZXRTZXR0aW5ncyB9IGZyb20gJy4vSW1wb3J0TW9kdWxlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIGNyZWF0ZU5ld1ByaW50U2V0dGluZ3MgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgTWVtb3J5U2Vzc2lvbiBmcm9tICdtZW1vcnlzdG9yZSc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBkZWJ1Z1NpdGVNYXAgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2l0ZU1hcCc7XG5pbXBvcnQgeyBzZXR0aW5ncyBhcyBkZWZpbmVTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHtFeHBvcnQgYXMgRXhwb3J0UmFtfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQnXG5cbmNvbnN0XG4gICAgQ29va2llc1NlY3JldCA9IHV1aWR2NCgpLnN1YnN0cmluZygwLCAzMiksXG4gICAgU2Vzc2lvblNlY3JldCA9IHV1aWR2NCgpLFxuICAgIE1lbW9yeVN0b3JlID0gTWVtb3J5U2Vzc2lvbihzZXNzaW9uKSxcblxuICAgIENvb2tpZXNNaWRkbGV3YXJlID0gY29va2llUGFyc2VyKENvb2tpZXNTZWNyZXQpLFxuICAgIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmUgPSBjb29raWVFbmNyeXB0ZXIoQ29va2llc1NlY3JldCwge30pLFxuICAgIENvb2tpZVNldHRpbmdzID0geyBodHRwT25seTogdHJ1ZSwgc2lnbmVkOiB0cnVlLCBtYXhBZ2U6IDg2NDAwMDAwICogMzAgfTtcblxuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZXMgPSA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZUVuY3J5cHRlciA9IDxhbnk+Q29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVTZXR0aW5ncyA9IENvb2tpZVNldHRpbmdzO1xuXG5sZXQgRGV2TW9kZV8gPSB0cnVlLCBjb21waWxhdGlvblNjYW46IFByb21pc2U8KCkgPT4gUHJvbWlzZTx2b2lkPj4sIFNlc3Npb25TdG9yZTtcblxubGV0IGZvcm1pZGFibGVTZXJ2ZXIsIGJvZHlQYXJzZXJTZXJ2ZXI7XG5cbmNvbnN0IHNlcnZlTGltaXRzID0ge1xuICAgIHNlc3Npb25Ub3RhbFJhbU1COiAxNTAsXG4gICAgc2Vzc2lvblRpbWVNaW51dGVzOiA0MCxcbiAgICBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzOiAzMCxcbiAgICBmaWxlTGltaXRNQjogMTAsXG4gICAgcmVxdWVzdExpbWl0TUI6IDRcbn1cblxubGV0IHBhZ2VJblJhbUFjdGl2YXRlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpe1xuICAgIHJldHVybiBwYWdlSW5SYW1BY3RpdmF0ZTtcbn1cblxuY29uc3QgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyA9IFsuLi5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5XTtcbmNvbnN0IGJhc2VWYWxpZFBhdGggPSBbKHBhdGg6IHN0cmluZykgPT4gcGF0aC5zcGxpdCgnLicpLmF0KC0yKSAhPSAnc2VydiddOyAvLyBpZ25vcmluZyBmaWxlcyB0aGF0IGVuZHMgd2l0aCAuc2Vydi4qXG5cbmV4cG9ydCBjb25zdCBFeHBvcnQ6IEV4cG9ydFNldHRpbmdzID0ge1xuICAgIGdldCBzZXR0aW5nc1BhdGgoKSB7XG4gICAgICAgIHJldHVybiB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgXCIvU2V0dGluZ3NcIjtcbiAgICB9LFxuICAgIHNldCBkZXZlbG9wbWVudCh2YWx1ZSkge1xuICAgICAgICBpZihEZXZNb2RlXyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgIERldk1vZGVfID0gdmFsdWU7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uU2NhbiA9IEJ1aWxkU2VydmVyLmNvbXBpbGVBbGwoRXhwb3J0KTtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkRldk1vZGUgPSB2YWx1ZTtcbiAgICAgICAgYWxsb3dQcmludCh2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXQgZGV2ZWxvcG1lbnQoKSB7XG4gICAgICAgIHJldHVybiBEZXZNb2RlXztcbiAgICB9LFxuICAgIG1pZGRsZXdhcmU6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKTogKHJlcTogUmVxdWVzdCwgX3JlczogUmVzcG9uc2U8YW55PiwgbmV4dD86IE5leHRGdW5jdGlvbikgPT4gdm9pZCB7XG4gICAgICAgICAgICByZXR1cm4gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZUVuY3J5cHRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU3RvcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmb3JtaWRhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1pZGFibGVTZXJ2ZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBib2R5UGFyc2VyKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvZHlQYXJzZXJTZXJ2ZXI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlY3JldDoge1xuICAgICAgICBnZXQgY29va2llcygpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzU2VjcmV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU2VjcmV0O1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZ2VuZXJhbDoge1xuICAgICAgICBpbXBvcnRPbkxvYWQ6IFtdLFxuICAgICAgICBzZXQgcGFnZUluUmFtKHZhbHVlKSB7XG4gICAgICAgICAgICBFeHBvcnRSYW0uUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlcGFyYXRpb25zID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgICAgICAgICAgICAgIGF3YWl0IHByZXBhcmF0aW9ucz8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVCeVVybC5Mb2FkQWxsUGFnZXNUb1JhbShFeHBvcnQuZGV2ZWxvcG1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVCeVVybC5DbGVhckFsbFBhZ2VzRnJvbVJhbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBhZ2VJblJhbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBFeHBvcnRSYW0uUGFnZVJhbTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcGlsZToge1xuICAgICAgICBzZXQgY29tcGlsZVN5bnRheCh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29tcGlsZVN5bnRheCgpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4O1xuICAgICAgICB9LFxuICAgICAgICBzZXQgaWdub3JlRXJyb3IodmFsdWUpIHtcbiAgICAgICAgICAgICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlnbm9yZUVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBwbHVnaW5zKHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgcGx1Z2lucygpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZGVmaW5lKCl7XG4gICAgICAgICAgICByZXR1cm4gZGVmaW5lU2V0dGluZ3MuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHNldCBkZWZpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIGRlZmluZVNldHRpbmdzLmRlZmluZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5nOiB7XG4gICAgICAgIHJ1bGVzOiB7fSxcbiAgICAgICAgdXJsU3RvcDogW10sXG4gICAgICAgIHZhbGlkUGF0aDogYmFzZVZhbGlkUGF0aCxcbiAgICAgICAgaWdub3JlVHlwZXM6IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMsXG4gICAgICAgIGlnbm9yZVBhdGhzOiBbXSxcbiAgICAgICAgc2l0ZW1hcDogdHJ1ZSxcbiAgICAgICAgZ2V0IGVycm9yUGFnZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBlcnJvclBhZ2VzKHZhbHVlKSB7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZUxpbWl0czoge1xuICAgICAgICBnZXQgY2FjaGVEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNhY2hlRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVzRXhwaXJlc0RheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVTZXR0aW5ncy5tYXhBZ2UgLyA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNvb2tpZXNFeHBpcmVzRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBDb29raWVTZXR0aW5ncy5tYXhBZ2UgPSB2YWx1ZSAqIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRvdGFsUmFtTUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRvdGFsUmFtTUIoKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25UaW1lTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRpbWVNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZmlsZUxpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmaWxlTGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHJlcXVlc3RMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICAgICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCByZXF1ZXN0TGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmU6IHtcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgaHR0cDI6IGZhbHNlLFxuICAgICAgICBncmVlbkxvY2s6IHtcbiAgICAgICAgICAgIHN0YWdpbmc6IG51bGwsXG4gICAgICAgICAgICBjbHVzdGVyOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICBhZ2VudDogbnVsbCxcbiAgICAgICAgICAgIGFncmVlVG9UZXJtczogZmFsc2UsXG4gICAgICAgICAgICBzaXRlczogW11cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybWlkYWJsZSgpIHtcbiAgICBmb3JtaWRhYmxlU2VydmVyID0ge1xuICAgICAgICBtYXhGaWxlU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLmZpbGVMaW1pdE1CICogMTA0ODU3NixcbiAgICAgICAgdXBsb2FkRGlyOiBTeXN0ZW1EYXRhICsgXCIvVXBsb2FkRmlsZXMvXCIsXG4gICAgICAgIG11bHRpcGxlczogdHJ1ZSxcbiAgICAgICAgbWF4RmllbGRzU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICogMTA0ODU3NlxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJvZHlQYXJzZXIoKSB7XG4gICAgYm9keVBhcnNlclNlcnZlciA9ICg8YW55PmJvZHlQYXJzZXIpLmpzb24oeyBsaW1pdDogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICsgJ21iJyB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZXNzaW9uKCkge1xuICAgIGlmICghRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyB8fCAhRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CKSB7XG4gICAgICAgIFNlc3Npb25TdG9yZSA9IChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2Vzc2lvblN0b3JlID0gc2Vzc2lvbih7XG4gICAgICAgIGNvb2tpZTogeyBtYXhBZ2U6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgKiA2MCAqIDEwMDAsIHNhbWVTaXRlOiB0cnVlIH0sXG4gICAgICAgIHNlY3JldDogU2Vzc2lvblNlY3JldCxcbiAgICAgICAgcmVzYXZlOiBmYWxzZSxcbiAgICAgICAgc2F2ZVVuaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzdG9yZTogbmV3IE1lbW9yeVN0b3JlKHtcbiAgICAgICAgICAgIGNoZWNrUGVyaW9kOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgIG1heDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CICogMTA0ODU3NlxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb3B5SlNPTih0bzogYW55LCBqc29uOiBhbnksIHJ1bGVzOiBzdHJpbmdbXSA9IFtdLCBydWxlc1R5cGU6ICdpZ25vcmUnIHwgJ29ubHknID0gJ2lnbm9yZScpIHtcbiAgICBpZighanNvbikgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBoYXNJbXBsZWF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGkgaW4ganNvbikge1xuICAgICAgICBjb25zdCBpbmNsdWRlID0gcnVsZXMuaW5jbHVkZXMoaSk7XG4gICAgICAgIGlmIChydWxlc1R5cGUgPT0gJ29ubHknICYmIGluY2x1ZGUgfHwgcnVsZXNUeXBlID09ICdpZ25vcmUnICYmICFpbmNsdWRlKSB7XG4gICAgICAgICAgICBoYXNJbXBsZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdG9baV0gPSBqc29uW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNJbXBsZWF0ZWQ7XG59XG5cbi8vIHJlYWQgdGhlIHNldHRpbmdzIG9mIHRoZSB3ZWJzaXRlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IFNldHRpbmdzOiBFeHBvcnRTZXR0aW5ncyA9IGF3YWl0IEdldFNldHRpbmdzKEV4cG9ydC5zZXR0aW5nc1BhdGgsIERldk1vZGVfKTtcbiAgICBpZihTZXR0aW5ncyA9PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxEZXYpO1xuXG4gICAgZWxzZVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsUHJvZCk7XG5cblxuICAgIGNvcHlKU09OKEV4cG9ydC5jb21waWxlLCBTZXR0aW5ncy5jb21waWxlKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5yb3V0aW5nLCBTZXR0aW5ncy5yb3V0aW5nLCBbJ2lnbm9yZVR5cGVzJywgJ3ZhbGlkUGF0aCddKTtcblxuICAgIC8vY29uY2F0IGRlZmF1bHQgdmFsdWVzIG9mIHJvdXRpbmdcbiAgICBjb25zdCBjb25jYXRBcnJheSA9IChuYW1lOiBzdHJpbmcsIGFycmF5OiBhbnlbXSkgPT4gU2V0dGluZ3Mucm91dGluZz8uW25hbWVdICYmIChFeHBvcnQucm91dGluZ1tuYW1lXSA9IFNldHRpbmdzLnJvdXRpbmdbbmFtZV0uY29uY2F0KGFycmF5KSk7XG5cbiAgICBjb25jYXRBcnJheSgnaWdub3JlVHlwZXMnLCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzKTtcbiAgICBjb25jYXRBcnJheSgndmFsaWRQYXRoJywgYmFzZVZhbGlkUGF0aCk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2NhY2hlRGF5cycsICdjb29raWVzRXhwaXJlc0RheXMnXSwgJ29ubHknKTtcblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnc2Vzc2lvblRvdGFsUmFtTUInLCAnc2Vzc2lvblRpbWVNaW51dGVzJywgJ3Nlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMnXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2ZpbGVMaW1pdE1CJywgJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuICAgIH1cblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZSwgU2V0dGluZ3Muc2VydmUpO1xuXG4gICAgLyogLS0tIHByb2JsZW1hdGljIHVwZGF0ZXMgLS0tICovXG4gICAgRXhwb3J0LmRldmVsb3BtZW50ID0gU2V0dGluZ3MuZGV2ZWxvcG1lbnRcblxuICAgIGlmIChTZXR0aW5ncy5nZW5lcmFsPy5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgRXhwb3J0LmdlbmVyYWwuaW1wb3J0T25Mb2FkID0gPGFueT5hd2FpdCBTdGFydFJlcXVpcmUoPGFueT5TZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCwgRGV2TW9kZV8pO1xuICAgIH1cblxuICAgIC8vbmVlZCB0byBkb3duIGxhc3RlZCBzbyBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aCAnaW1wb3J0T25Mb2FkJ1xuICAgIGlmICghY29weUpTT04oRXhwb3J0LmdlbmVyYWwsIFNldHRpbmdzLmdlbmVyYWwsIFsncGFnZUluUmFtJ10sICdvbmx5JykgJiYgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgfVxuXG4gICAgaWYoRXhwb3J0LmRldmVsb3BtZW50ICYmIEV4cG9ydC5yb3V0aW5nLnNpdGVtYXApeyAvLyBvbiBwcm9kdWN0aW9uIHRoaXMgd2lsbCBiZSBjaGVja2VkIGFmdGVyIGNyZWF0aW5nIHN0YXRlXG4gICAgICAgIGRlYnVnU2l0ZU1hcChFeHBvcnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlyc3RMb2FkKCkge1xuICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIGJ1aWxkQm9keVBhcnNlcigpO1xufSIsICJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMic7XG5pbXBvcnQgKiBhcyBjcmVhdGVDZXJ0IGZyb20gJ3NlbGZzaWduZWQnO1xuaW1wb3J0ICogYXMgR3JlZW5sb2NrIGZyb20gJ2dyZWVubG9jay1leHByZXNzJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGVsZXRlSW5EaXJlY3RvcnksIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBHcmVlbkxvY2tTaXRlIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgZm9sZGVyIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2VzXG4gKiBleGlzdCwgdXBkYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZvbGRlciB0byBjcmVhdGUuXG4gKiBAcGFyYW0gQ3JlYXRlSW5Ob3RFeGl0cyAtIHtcbiAqL1xuYXN5bmMgZnVuY3Rpb24gVG91Y2hTeXN0ZW1Gb2xkZXIoZm9OYW1lOiBzdHJpbmcsIENyZWF0ZUluTm90RXhpdHM6IHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGV4aXRzPzogYW55fSkge1xuICAgIGxldCBzYXZlUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyBcIi9TeXN0ZW1TYXZlL1wiO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgc2F2ZVBhdGggKz0gZm9OYW1lO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgaWYgKENyZWF0ZUluTm90RXhpdHMpIHtcbiAgICAgICAgc2F2ZVBhdGggKz0gJy8nO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHNhdmVQYXRoICsgQ3JlYXRlSW5Ob3RFeGl0cy5uYW1lO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBDcmVhdGVJbk5vdEV4aXRzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBhd2FpdCBDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKSwgZmlsZVBhdGgsIHNhdmVQYXRoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSXQgZ2VuZXJhdGVzIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgYW5kIHN0b3JlcyBpdCBpbiBhIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgY2VydGlmaWNhdGUgYW5kIGtleSBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldERlbW9DZXJ0aWZpY2F0ZSgpIHtcbiAgICBsZXQgQ2VydGlmaWNhdGU6IGFueTtcbiAgICBjb25zdCBDZXJ0aWZpY2F0ZVBhdGggPSBTeXN0ZW1EYXRhICsgJy9DZXJ0aWZpY2F0ZS5qc29uJztcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShDZXJ0aWZpY2F0ZVBhdGgpKSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gRWFzeUZzLnJlYWRKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUNlcnQuZ2VuZXJhdGUobnVsbCwgeyBkYXlzOiAzNjUwMCB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5cy5wcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgsIENlcnRpZmljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIENlcnRpZmljYXRlO1xufVxuXG5mdW5jdGlvbiBEZWZhdWx0TGlzdGVuKGFwcCkge1xuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5hdHRhY2gpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgbGlzdGVuKHBvcnQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCA8YW55PnJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIGdyZWVubG9jaywgaXQgd2lsbCBjcmVhdGUgYSBzZXJ2ZXIgdGhhdCB3aWxsIHNlcnZlIHlvdXIgYXBwIG92ZXIgaHR0cHNcbiAqIEBwYXJhbSBhcHAgLSBUaGUgdGlueUh0dHAgYXBwbGljYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdGhlIHNlcnZlciBtZXRob2RzXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFVwZGF0ZUdyZWVuTG9jayhhcHApIHtcblxuICAgIGlmICghKFNldHRpbmdzLnNlcnZlLmh0dHAyIHx8IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jaz8uYWdyZWVUb1Rlcm1zKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgRGVmYXVsdExpc3RlbihhcHApO1xuICAgIH1cblxuICAgIGlmICghU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFncmVlVG9UZXJtcykge1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwMi5jcmVhdGVTZWN1cmVTZXJ2ZXIoeyAuLi5hd2FpdCBHZXREZW1vQ2VydGlmaWNhdGUoKSwgYWxsb3dIVFRQMTogdHJ1ZSB9LCBhcHAuYXR0YWNoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuKHBvcnQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBUb3VjaFN5c3RlbUZvbGRlcihcImdyZWVubG9ja1wiLCB7XG4gICAgICAgIG5hbWU6IFwiY29uZmlnLmpzb25cIiwgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpdGVzOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXNcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGV4aXRzKGZpbGUsIF8sIGZvbGRlcikge1xuICAgICAgICAgICAgZmlsZSA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmlsZS5zaXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBmaWxlLnNpdGVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiA8R3JlZW5Mb2NrU2l0ZVtdPiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuc3ViamVjdCA9PSBlLnN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuYWx0bmFtZXMubGVuZ3RoICE9IGUuYWx0bmFtZXMubGVuZ3RoIHx8IGIuYWx0bmFtZXMuc29tZSh2ID0+IGUuYWx0bmFtZXMuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5hbHRuYW1lcyA9IGIuYWx0bmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUucmVuZXdBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGF2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnNpdGVzLnNwbGljZShpLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGZvbGRlciArIFwibGl2ZS9cIiArIGUuc3ViamVjdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NpdGVzID0gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzLmZpbHRlcigoeCkgPT4gIWZpbGUuc2l0ZXMuZmluZChiID0+IGIuc3ViamVjdCA9PSB4LnN1YmplY3QpKTtcblxuICAgICAgICAgICAgZmlsZS5zaXRlcy5wdXNoKC4uLm5ld1NpdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUod29ya2luZ0RpcmVjdG9yeSArIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgZ3JlZW5sb2NrT2JqZWN0OmFueSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBHcmVlbmxvY2suaW5pdCh7XG4gICAgICAgIHBhY2thZ2VSb290OiB3b3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBjb25maWdEaXI6IFwiU3lzdGVtU2F2ZS9ncmVlbmxvY2tcIixcbiAgICAgICAgcGFja2FnZUFnZW50OiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdlbnQgfHwgcGFja2FnZUluZm8ubmFtZSArICcvJyArIHBhY2thZ2VJbmZvLnZlcnNpb24sXG4gICAgICAgIG1haW50YWluZXJFbWFpbDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmVtYWlsLFxuICAgICAgICBjbHVzdGVyOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suY2x1c3RlcixcbiAgICAgICAgc3RhZ2luZzogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnN0YWdpbmdcbiAgICB9KS5yZWFkeShyZXMpKTtcblxuICAgIGZ1bmN0aW9uIENyZWF0ZVNlcnZlcih0eXBlLCBmdW5jLCBvcHRpb25zPykge1xuICAgICAgICBsZXQgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4geyB9O1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3RbdHlwZV0ob3B0aW9ucywgZnVuYyk7XG4gICAgICAgIGNvbnN0IGxpc3RlbiA9IChwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwU2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0Lmh0dHBTZXJ2ZXIoKTtcbiAgICAgICAgICAgIENsb3NlaHR0cFNlcnZlciA9ICgpID0+IGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UocmVzID0+IHNlcnZlci5saXN0ZW4oNDQzLCBcIjAuMC4wLjBcIiwgcmVzKSksIG5ldyBQcm9taXNlKHJlcyA9PiBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBcIjAuMC4wLjBcIiwgcmVzKSldKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHNlcnZlci5jbG9zZSgpOyBDbG9zZWh0dHBTZXJ2ZXIoKTsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3RlbixcbiAgICAgICAgICAgIGNsb3NlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cDJTZXJ2ZXInLCBhcHAuYXR0YWNoLCB7IGFsbG93SFRUUDE6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cHNTZXJ2ZXInLCBhcHAuYXR0YWNoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHNlcnZlciwge1NldHRpbmdzfSAgZnJvbSAnLi9NYWluQnVpbGQvU2VydmVyJztcbmltcG9ydCBhc3luY1JlcXVpcmUgZnJvbSAnLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHtnZXRUeXBlc30gZnJvbSAnLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gJy4vQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkJztcbmV4cG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9NYWluQnVpbGQvVHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQXN5bmNJbXBvcnQgPSAocGF0aDpzdHJpbmcsIGltcG9ydEZyb20gPSAnYXN5bmMgaW1wb3J0JykgPT4gYXN5bmNSZXF1aXJlKGltcG9ydEZyb20sIHBhdGgsIGdldFR5cGVzLlN0YXRpYywge2lzRGVidWc6IFNldHRpbmdzLmRldmVsb3BtZW50fSk7XG5leHBvcnQge1NldHRpbmdzLCBTZWFyY2hSZWNvcmR9O1xuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTs7O0FDRkE7OztBQ0FBLElBQUksWUFBWTtBQUVULG9CQUFvQixHQUFZO0FBQ25DLGNBQVk7QUFDaEI7QUFFTyxJQUFNLFFBQVEsSUFBSSxNQUFNLFNBQVE7QUFBQSxFQUNuQyxJQUFJLFFBQVEsTUFBTSxVQUFVO0FBQ3hCLFFBQUcsUUFBUTtBQUNQLGFB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
