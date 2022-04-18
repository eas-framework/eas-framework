var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
function GetSource(name) {
  return GetFullWebSitePath() + name + "/";
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
  set WebSiteFolder(value) {
    WebSiteFolder_ = value;
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
function smallPathToPage(smallPath) {
  return CutTheLast(".", SplitFirst("/", smallPath).pop());
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
    for (const { name, data } of this.actionLoad) {
      switch (name) {
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
      const value = values[i];
      this.AddTextAfter(text, lastValue?.info, lastValue?.line, lastValue?.char);
      if (value instanceof StringTracker) {
        this.AddClone(value);
        lastValue = value.DefaultInfoText;
      } else if (value != null) {
        this.AddTextAfter(String(value), lastValue?.info, lastValue?.line, lastValue?.char);
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
  unicodeMe(value) {
    let a = "";
    for (const v of value) {
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
  set CodeBuildText(value) {
    this.DataCode.text = value;
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
async function AddDebugInfo(isolate2, pageName, FullPath, SmallPath, cache = {}) {
  if (!cache.value)
    cache.value = await EasyFs_default.readFile(FullPath, "utf8");
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
function CreateFilePath(filePath, smallPath, inputPath, folder, pageType) {
  return {
    SmallPath: CreateFilePathOnePath(smallPath, inputPath, folder, pageType, 2),
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
async function template(BuildScriptWithoutModule, name, params, selector, mainCode, path22, isDebug) {
  const parse2 = await JSParser.RunAndExport(mainCode, path22, isDebug);
  return new StringTracker().Plus$`function ${name}({${params}}, selector${selector ? ` = "${selector}"` : ""}, out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${await BuildScriptWithoutModule(parse2)}
        var exports = ${name}.exports;
        return sendToSelector(selector, out_run_script.text);
    }\n${name}.exports = {};`;
}
async function BuildCode(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo);
  sessionInfo.script(serveScript, { async: null });
  let scriptInfo = await template(sessionInfo.BuildScriptWithPrams, dataTag.popAnyTracker("name", "connect"), dataTag.popAnyTracker("params", ""), dataTag.popAnyDefault("selector", ""), BetweenTagData, pathName, sessionInfo.debug && !InsertComponent2.SomePlugins("SafeDebug"));
  const addScript = sessionInfo.addScriptStylePage("script", dataTag, type);
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
async function BuildCode2(language, pathName, type, dataTag, BetweenTagData) {
  let ResCode = BetweenTagData;
  const SaveServerCode = new EnableGlobalReplace("serv");
  await SaveServerCode.load(BetweenTagData, pathName);
  const BetweenTagDataExtracted = await SaveServerCode.StartBuild();
  const { resultCode, resultMap } = await transpilerWithOptions(BetweenTagData, language, false, BetweenTagDataExtracted, { preserveAllComments: true });
  ResCode = SaveServerCode.RestoreCode(await SourceMapToStringTracker(resultCode, resultMap));
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a || (_a = __template(["<script", ">", "<\/script>"])), dataTag.rebuildSpace(), ResCode)
  };
}

// src/BuildInComponents/Components/script/client.ts
async function BuildCode3(language, tagData, BetweenTagData, sessionInfo) {
  const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.popString("type") == "module", isModelStringCache = isModel ? "scriptModule" : "script";
  if (sessionInfo.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);
  const { resultCode, resultMap } = await transpilerWithOptions(BetweenTagData, language, sessionInfo.debug);
  const pushStyle = sessionInfo.addScriptStylePage(isModel ? "module" : "script", tagData, BetweenTagData);
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
async function BuildCode4(pathName, type, dataTag, BetweenTagData, sessionInfo) {
  if (dataTag.exists("src"))
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$(_a2 || (_a2 = __template(["<script", ">", "<\/script>"])), dataTag.rebuildSpace(), BetweenTagData)
    };
  const language = dataTag.popAnyDefault("lang", "js");
  if (dataTag.popBoolean("server")) {
    return BuildCode2(language, pathName, type, dataTag, BetweenTagData);
  }
  return BuildCode3(language, dataTag, BetweenTagData, sessionInfo);
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
async function compileSass(language, BetweenTagData, sessionInfo, outStyle = BetweenTagData.eq) {
  const thisPage = BasicSettings.fullWebSitePath + BetweenTagData.extractInfo(), thisPageURL = pathToFileURL(thisPage), compressed = minifyPluginSass(language);
  let result;
  try {
    result = await sass.compileStringAsync(outStyle, {
      sourceMap: sessionInfo.debug,
      syntax: sassSyntax(language),
      style: compressed ? "compressed" : "expanded",
      importer: createImporter(thisPage),
      logger: sass.Logger.silent
    });
    outStyle = result?.css ?? outStyle;
  } catch (err) {
    if (err.span.url) {
      const FullPath = fileURLToPath5(err.span.url);
      await sessionInfo.dependence(BasicSettings.relative(FullPath), FullPath);
    }
    PrintSassErrorTracker(err, BetweenTagData);
    return { outStyle: "Sass Error (see console)" };
  }
  if (result?.loadedUrls) {
    for (const file of result.loadedUrls) {
      const FullPath = fileURLToPath5(file);
      await sessionInfo.dependence(BasicSettings.relative(FullPath), FullPath);
    }
  }
  result?.sourceMap && sassAndSource(result.sourceMap, thisPageURL.href);
  return { result, outStyle, compressed };
}

// src/BuildInComponents/Components/style/server.ts
async function BuildCode5(language, pathName, type, dataTag, BetweenTagData, sessionInfo) {
  const SaveServerCode = new EnableGlobalReplace();
  await SaveServerCode.load(BetweenTagData.trimStart(), pathName);
  let { outStyle, compressed } = await compileSass(language, BetweenTagData, sessionInfo, await SaveServerCode.StartBuild());
  if (!compressed)
    outStyle = `
${outStyle}
`;
  const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${dataTag.rebuildSpace()}>${reStoreData}</style>`
  };
}

// src/BuildInComponents/Components/style/client.ts
async function BuildCode6(language, dataTag, BetweenTagData, sessionInfo) {
  const outStyleAsTrim = BetweenTagData.eq.trim();
  if (sessionInfo.cache.style.includes(outStyleAsTrim))
    return {
      compiledString: new StringTracker()
    };
  sessionInfo.cache.style.push(outStyleAsTrim);
  const { result, outStyle } = await compileSass(language, BetweenTagData, sessionInfo);
  const pushStyle = sessionInfo.addScriptStylePage("style", dataTag, BetweenTagData);
  if (result?.sourceMap)
    pushStyle.addSourceMapWithStringTracker(SourceMapStore.fixURLSourceMap(result.sourceMap), BetweenTagData, outStyle);
  else
    pushStyle.addStringTracker(BetweenTagData, { text: outStyle });
  return {
    compiledString: new StringTracker()
  };
}

// src/BuildInComponents/Components/style/index.ts
async function BuildCode7(pathName, type, dataTag, BetweenTagData, sessionInfo) {
  const language = dataTag.popAnyDefault("lang", "css");
  if (dataTag.popBoolean("server")) {
    return BuildCode5(language, pathName, type, dataTag, BetweenTagData, sessionInfo);
  }
  return BuildCode6(language, dataTag, BetweenTagData, sessionInfo);
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
  update(key, value) {
    this.store[key] = value;
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
function InFolderPagePath(inputPath, smallPath) {
  if (inputPath[0] == ".") {
    inputPath = path_node.join(smallPath, "/../", inputPath);
  }
  if (!path_node.extname(inputPath))
    inputPath += "." + BasicSettings.pageTypes.page;
  return inputPath;
}
var cacheMap = {};
async function BuildCode8(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  const filepath = dataTag.popHaveDefault("from");
  const inStatic = InFolderPagePath(filepath, smallPathToPage(type.extractInfo()));
  const FullPath = getTypes.Static[0] + inStatic, SmallPath = getTypes.Static[2] + "/" + inStatic;
  if (!(await EasyFs_default.stat(FullPath, null, true)).isFile?.()) {
    const [funcName, printText] = createNewPrint({
      text: `
Page not found: <color>${type.at(0).lineInfo} -> ${FullPath}`,
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
    const { CompiledData, sessionInfo: newSession } = await FastCompileInFile(inStatic, getTypes.Static, { nestedPage: pathName, nestedPageData: dataTag.popHaveDefault("object") });
    newSession.dependencies[SmallPath] = newSession.dependencies.thisPage;
    delete newSession.dependencies.thisPage;
    sessionInfo.extends(newSession);
    cacheMap[inStatic] = { CompiledData, newSession };
    ReturnData = CompiledData;
  } else {
    const { CompiledData, newSession } = cacheMap[inStatic];
    Object.assign(sessionInfo.dependencies, newSession.dependencies);
    sessionInfo.extends(newSession);
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
    for (const [key, value] of Object.entries(data)) {
      this.replaceWithSpace((text) => text.replace(new RegExp(`([^\\p{L}])${key}([^\\p{L}])`, "gui"), (...match) => {
        return match[1] + value + match[2];
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
async function BuildScript(text, isTypescript, sessionInfo) {
  text = text.trim();
  const Options = Commonjs({
    jsc: TransformJSC({
      parser: __spreadValues({
        syntax: isTypescript ? "typescript" : "ecmascript"
      }, GetPlugin((isTypescript ? "TS" : "JS") + "Options"))
    }),
    filename: sessionInfo.smallPath,
    sourceMaps: true
  });
  let result;
  const scriptDefine = await EasySyntax.BuildAndExportImports(text.eq, { debug: "" + sessionInfo.debug });
  try {
    const { code, map } = await transform2(scriptDefine, Options);
    result = map ? await backToOriginal(text, code, map) : new StringTracker(null, code);
  } catch (err) {
    const parse2 = ESBuildPrintErrorStringTracker(text, err);
    if (sessionInfo.debug) {
      parse2.errorFile = BasicSettings.relative(parse2.errorFile);
      result = new StringTracker(null, ErrorTemplate(parse2.simpleMessage));
    }
  }
  return result;
}

// src/CompileCode/Session.ts
var StaticFilesInfo = new StoreJSON("ShortScriptNames");
var SessionBuild = class {
  constructor(smallPath, fullPath, typeName, debug, _safeDebug) {
    this.smallPath = smallPath;
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
  record(name) {
    if (!this.recordNames.includes(name))
      this.recordNames.push(name);
  }
  async dependence(smallPath, fullPath = BasicSettings.fullWebSitePath + smallPath) {
    if (this.dependencies[smallPath])
      return;
    const haveDep = await EasyFs_default.stat(fullPath, "mtimeMs", true, null);
    if (haveDep) {
      this.dependencies[smallPath] = haveDep;
      return true;
    }
  }
  addScriptStyle(type, smallPath = this.smallPath) {
    let data = this.inScriptStyle.find((x) => x.type == type && x.path == smallPath);
    if (!data) {
      data = { type, path: smallPath, value: new SourceMapStore(smallPath, this.safeDebug, type == "style", true) };
      this.inScriptStyle.push(data);
    }
    return data.value;
  }
  addScriptStylePage(type, dataTag, info) {
    return this.addScriptStyle(type, dataTag.popString("page") ? this.smallPath : info.extractInfo());
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
async function preprocess(fullPath, smallPath, savePath = smallPath, httpSource = true, svelteExt = "") {
  let text = new StringTracker(smallPath, await EasyFs_default.readFile(fullPath));
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
  const sessionInfo = new SessionBuild(smallPath, fullPath), promises3 = [sessionInfo.dependence(smallPath, fullPath)];
  for (const full of dependencies) {
    promises3.push(sessionInfo.dependence(BasicSettings.relative(full), full));
  }
  return { scriptLang, styleLang, code: text.eq, map: text.StringTack(savePath, httpSource), dependencies: sessionInfo.dependencies, svelteFiles: connectSvelte.map((x) => x[0] == "/" ? getTypes.Static[0] + x : path5.normalize(fullPath + "/../" + x)) };
}
function Capitalize(name) {
  return name[0].toUpperCase() + name.slice(1);
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
async function registerExtension(filePath, smallPath, sessionInfo) {
  const name = path7.parse(filePath).name.replace(/^\d/, "_$&").replace(/[^a-zA-Z0-9_$]/g, "");
  const options = {
    filename: filePath,
    name: Capitalize(name),
    generate: "ssr",
    format: "cjs",
    dev: sessionInfo.debug,
    errorMode: "warn"
  };
  const inStaticFile = path7.relative(getTypes.Static[2], smallPath);
  const fullCompilePath = getTypes.Static[1] + inStaticFile;
  const fullImportPath = fullCompilePath + ".ssr.cjs";
  const { svelteFiles, code, map, dependencies } = await preprocess(filePath, smallPath, fullImportPath, false, ".ssr.cjs");
  Object.assign(sessionInfo.dependencies, dependencies);
  options.sourcemap = map;
  const promises3 = [];
  for (const file of svelteFiles) {
    clearModule(resolve(file));
    promises3.push(registerExtension(file, BasicSettings.relative(file), sessionInfo));
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
import JSON5 from "json5";
async function ssrHTML(dataTag, FullPath, smallPath, sessionInfo) {
  const getV = (name) => {
    const gv = (name2) => dataTag.popAnyDefault(name2, "").trim(), value = gv("ssr" + Capitalize(name)) || gv(name);
    return value ? JSON5.parse(`{${value}}`) : {};
  };
  const buildPath = await registerExtension(FullPath, smallPath, sessionInfo);
  const mode = await redirectCJS_default(buildPath);
  const { html, head } = mode.default.render(getV("props"), getV("options"));
  sessionInfo.headHTML += head;
  return html;
}
async function BuildCode9(type, dataTag, sessionInfo) {
  const LastSmallPath = type.extractInfo(), LastFullPath = BasicSettings.fullWebSitePath + LastSmallPath;
  const { SmallPath, FullPath } = CreateFilePath(LastFullPath, LastSmallPath, dataTag.popHaveDefault("from"), getTypes.Static[2], "svelte");
  const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, "/");
  sessionInfo.style("/" + inWebPath + ".css");
  const id = dataTag.popAnyDefault("id", createId(inWebPath)), have = (name) => {
    const value = dataTag.popAnyDefault(name, "").trim();
    return value ? `,${name}:{${value}}` : "";
  }, selector = dataTag.popHaveDefault("selector");
  const ssr = !selector && dataTag.popBoolean("ssr") ? await ssrHTML(dataTag, FullPath, SmallPath, sessionInfo) : "";
  sessionInfo.addScriptStylePage("module", dataTag, type).addText(`import App${id} from '/${inWebPath}';
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
async function BuildCode10(type, dataTag, BetweenTagData, InsertComponent2, session2) {
  const markDownPlugin = InsertComponent2.GetPlugin("markdown");
  const hljsClass = dataTag.popBoolean("hljs-class", markDownPlugin?.hljsClass ?? true) ? ' class="hljs"' : "";
  let haveHighlight = false;
  const md = markdown({
    html: true,
    xhtmlOut: true,
    linkify: dataTag.popBoolean("linkify", markDownPlugin?.linkify),
    breaks: dataTag.popBoolean("breaks", markDownPlugin?.breaks ?? true),
    typographer: dataTag.popBoolean("typographer", markDownPlugin?.typographer ?? true),
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
  const copy = dataTag.popAnyDefault("copy-code", markDownPlugin?.copyCode ?? "\u{1F4CB}");
  if (copy)
    md.use((m) => codeWithCopy(m, copy));
  if (dataTag.popBoolean("header-link", markDownPlugin?.headerLink ?? true))
    md.use(anchor, {
      slugify: (s) => slugify(s),
      permalink: anchor.permalink.headerLink()
    });
  if (dataTag.popBoolean("attrs", markDownPlugin?.attrs ?? true))
    md.use(markdownItAttrs);
  if (dataTag.popBoolean("abbr", markDownPlugin?.abbr ?? true))
    md.use(markdownItAbbr);
  let markdownCode = BetweenTagData?.eq || "";
  const location = dataTag.popAnyDefault("file", "./markdown");
  if (!markdownCode?.trim?.() && location) {
    let filePath = location[0] == "/" ? path8.join(getTypes.Static[2], location) : path8.join(path8.dirname(type.extractInfo("<line>")), location);
    if (!path8.extname(filePath))
      filePath += ".serv.md";
    const fullPath = path8.join(BasicSettings.fullWebSitePath, filePath);
    markdownCode = await EasyFs_default.readFile(fullPath);
    await session2.dependence(filePath, fullPath);
  }
  const renderHTML = md.render(markdownCode), buildHTML = new StringTracker(type.DefaultInfoText);
  const theme = await createAutoTheme(dataTag.popString("code-theme") || markDownPlugin?.codeTheme || "atom-one");
  if (haveHighlight) {
    if (theme != "none") {
      const cssLink2 = "/serv/md/code-theme/" + theme + ".css";
      session2.style(cssLink2);
    }
    if (copy) {
      session2.script("/serv/md.js");
    }
  }
  dataTag.addClass("markdown-body");
  const style = dataTag.popAnyDefault("theme", markDownPlugin?.theme ?? "auto");
  const cssLink = "/serv/md/theme/" + style + ".css";
  style != "none" && session2.style(cssLink);
  buildHTML.Plus$`<div${dataTag.rebuildSpace()}>${renderHTML}</div>`;
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
  const name = darkLightSplit[2] || darkLightSplit.slice(0, 2).join("~").replace("/", "-");
  if (await EasyFs_default.existsFile(codeThemePath + name + ".css"))
    return name;
  const lightText = await EasyFs_default.readFile(codeThemePath + darkLightSplit[0] + ".css");
  const darkText = await EasyFs_default.readFile(codeThemePath + darkLightSplit[1] + ".css");
  const [start, dark, light] = splitStart(darkText, lightText);
  const darkLight = `${start}@media(prefers-color-scheme:dark){${dark}}@media(prefers-color-scheme:light){${light}}`;
  await EasyFs_default.writeFile(codeThemePath + name + ".css", darkLight);
  return name;
}

// src/BuildInComponents/Components/head.ts
async function BuildCode11(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  return {
    compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${dataTag.rebuildSpace()}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo)}@DefaultInsertBundle</head>`,
    checkComponents: false
  };
}
async function addFinalizeBuild(pageData, sessionInfo, fullCompilePath) {
  const buildBundleString = await sessionInfo.buildHead();
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
function compileValues(value) {
  value = value.toLowerCase().trim();
  if (builtInConnection.includes(value))
    return `["${value}"]`;
  for (const [name, [test, getArgs]] of Object.entries(builtInConnectionRegex))
    if (test.test(value))
      return `["${name}", ${getArgs(value)}]`;
  return `[${value}]`;
}
async function makeValidationJSON(args, validatorArray) {
  for (const i in validatorArray) {
    const [element, ...elementArgs] = validatorArray[i], value = args[i];
    let returnNow = false;
    let isDefault = false;
    switch (element) {
      case "number":
      case "num":
        returnNow = typeof value !== "number";
        break;
      case "boolean":
      case "bool":
        returnNow = typeof value !== "boolean";
        break;
      case "integer":
      case "int":
        returnNow = !Number.isInteger(value);
        break;
      case "string":
      case "text":
        returnNow = typeof value !== "string";
        break;
      case "email":
        returnNow = !emailValidator.test(value);
        break;
      default: {
        const haveRegex = builtInConnectionRegex[element];
        if (haveRegex) {
          returnNow = value == null || !haveRegex[2](elementArgs, value);
          break;
        }
        isDefault = true;
        if (element instanceof RegExp)
          returnNow = !element.test(value) && "regex - " + value;
        else if (typeof element == "function")
          returnNow = !await element(value) && "function - " + (element.name || "anonymous");
      }
    }
    if (returnNow) {
      let info = `Validation failed at filed ${Number(i) + 1} - ${isDefault ? returnNow : "expected " + element}`;
      if (elementArgs.length)
        info += `, arguments: ${JSON.stringify(elementArgs)}`;
      info += `, input: ${JSON.stringify(value)}`;
      return [info, element, elementArgs, value];
    }
  }
  return true;
}
function parseValues(args, validatorArray) {
  const parsed = [];
  for (const i in validatorArray) {
    const [element] = validatorArray[i], value = args[i];
    if (builtInConnectionNumbers.includes(element))
      parsed.push(parseFloat(value));
    else if (booleans.includes(element))
      parsed.push(value === "true" ? true : false);
    else
      parsed.push(value);
  }
  return parsed;
}

// src/BuildInComponents/Components/serv-connect/connect-node.ts
function addFinalizeBuildAnyConnection(connectName, connectorCall, connectionType, pageData, sessionInfo, buildArguments, { returnData } = {}) {
  if (!sessionInfo.connectorArray.find((x) => x.type == connectionType))
    return pageData;
  for (const i of sessionInfo.connectorArray) {
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
function template2(name) {
  return `function ${name}(...args){return connector("${name}", args)}`;
}
async function BuildCode12(type, dataTag, BetweenTagData, { SomePlugins: SomePlugins2 }, sessionInfo) {
  const name = dataTag.popHaveDefault("name"), sendTo = dataTag.popHaveDefault("sendTo"), validator = dataTag.popHaveDefault("validate"), notValid = dataTag.popHaveDefault("notValid");
  const message = dataTag.popAnyDefault("message", sessionInfo.debug && !SomePlugins2("SafeDebug"));
  sessionInfo.script(serveScript2, { async: null });
  sessionInfo.addScriptStylePage("script", dataTag, type).addText(template2(name));
  sessionInfo.connectorArray.push({
    type: "connect",
    name,
    sendTo,
    message,
    notValid,
    validator: validator && validator.split(",").map((x) => x.trim())
  });
  const compiledString = BetweenTagData || new StringTracker();
  compiledString.AddTextBeforeNoTrack(`<%!@@?ConnectHere(${name})%>`);
  return {
    compiledString,
    checkComponents: true
  };
}
function addFinalizeBuild2(pageData, sessionInfo) {
  return addFinalizeBuildAnyConnection("ConnectHere", "connectorCall?.name", "connect", pageData, sessionInfo, (i) => {
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
async function BuildCode13(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  const sendTo = dataTag.popAnyDefault("sendTo", "").trim();
  if (!sendTo)
    return {
      compiledString: new StringTracker(type.DefaultInfoText).Plus$`<form${dataTag.rebuildSpace()}>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo)}</form>`,
      checkComponents: false
    };
  const name = dataTag.popAnyDefault("name", uuid2()).trim(), validator = dataTag.popHaveDefault("validate"), orderDefault = dataTag.popHaveDefault("order"), notValid = dataTag.popHaveDefault("notValid"), responseSafe = dataTag.popBoolean("safe");
  const message = dataTag.popAnyDefault("message", sessionInfo.debug && !InsertComponent2.SomePlugins("SafeDebug"));
  let order = [];
  const validatorArray = validator && validator.split(",").map((x) => {
    const split = SplitFirst(":", x.trim());
    if (split.length > 1)
      order.push(split.shift());
    return split.pop();
  });
  if (orderDefault)
    order = orderDefault.split(",").map((x) => x.trim());
  sessionInfo.connectorArray.push({
    type: "form",
    name,
    sendTo,
    validator: validatorArray,
    order: order.length && order,
    notValid,
    message,
    responseSafe
  });
  dataTag.pushValue("method", "post");
  const compiledString = new StringTracker(type.DefaultInfoText).Plus$`<%!
@?ConnectHereForm(${name})
%><form${dataTag.rebuildSpace()}>
    <input type="hidden" name="connectorFormCall" value="${name}"/>${await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo)}</form>`;
  return {
    compiledString,
    checkComponents: false
  };
}
function addFinalizeBuild3(pageData, sessionInfo) {
  return addFinalizeBuildAnyConnection("ConnectHereForm", "connectorFormCall", "form", pageData, sessionInfo, (i) => {
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
function recordLink(dataTag, sessionInfo) {
  return dataTag.popAnyDefault("link", smallPathToPage(sessionInfo.smallPath));
}
function makeRecordPath(defaultName, dataTag, sessionInfo) {
  const link = recordLink(dataTag, sessionInfo), saveName = dataTag.popAnyDefault("name", defaultName);
  recordStore.store[saveName] ??= {};
  recordStore.store[saveName][link] ??= "";
  sessionInfo.record(saveName);
  return {
    store: recordStore.store[saveName],
    current: recordStore.store[saveName][link],
    link
  };
}
async function BuildCode14(pathName, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo);
  if (!sessionInfo.smallPath.endsWith("." + BasicSettings.pageTypes.page))
    return {
      compiledString: BetweenTagData
    };
  const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo());
  await parser.findScripts();
  let html = "";
  for (const i of parser.values) {
    if (i.type == "text") {
      html += i.text.eq;
    }
  }
  html = html.trim();
  const { store, link } = makeRecordPath("records/record.serv", dataTag, sessionInfo);
  if (!store[link].includes(html)) {
    store[link] += html;
  }
  return {
    compiledString: BetweenTagData
  };
}
function deleteBeforeReBuild(smallPath) {
  const name = smallPathToPage(smallPath);
  for (const save in recordStore.store) {
    const item = recordStore.store[save];
    if (item[name]) {
      item[name] = void 0;
      delete item[name];
    }
  }
}
async function updateRecords(session2) {
  if (!session2.debug) {
    return;
  }
  for (const name of session2.recordNames) {
    const filePath = getTypes.Static[0] + name + ".json";
    await EasyFs_default.makePathReal(name, getTypes.Static[0]);
    EasyFs_default.writeJsonFile(filePath, recordStore.store[name]);
  }
}
function perCompile() {
  recordStore.clear();
}
async function postCompile() {
  for (const name in recordStore.store) {
    const filePath = getTypes.Static[0] + name + ".json";
    await EasyFs_default.makePathReal(name, getTypes.Static[0]);
    EasyFs_default.writeJsonFile(filePath, recordStore.store[name]);
  }
}

// src/BuildInComponents/Components/search.ts
import { parse } from "node-html-parser";
async function BuildCode15(pathName, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  BetweenTagData = await InsertComponent2.StartReplace(BetweenTagData, pathName, sessionInfo);
  if (!sessionInfo.smallPath.endsWith("." + BasicSettings.pageTypes.page))
    return {
      compiledString: BetweenTagData
    };
  const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo());
  await parser.findScripts();
  let html = "";
  for (const i of parser.values) {
    if (i.type == "text") {
      html += i.text.eq;
    }
  }
  const { store, link, current } = makeRecordPath("records/search.serv", dataTag, sessionInfo);
  const searchObject = buildObject(html, dataTag.popAnyDefault("match", "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"));
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
function buildObject(html, match) {
  const root = parse(html, {
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
function StartCompiling(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo) {
  let reData;
  switch (type.eq.toLowerCase()) {
    case "client":
      reData = BuildCode(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "record":
      reData = BuildCode14(pathName, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "search":
      reData = BuildCode15(pathName, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "script":
      reData = BuildCode4(pathName, type, dataTag, BetweenTagData, sessionInfo);
      break;
    case "style":
      reData = BuildCode7(pathName, type, dataTag, BetweenTagData, sessionInfo);
      break;
    case "page":
      reData = BuildCode8(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "connect":
      reData = BuildCode12(type, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "form":
      reData = BuildCode13(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "isolate":
      reData = isolate(BetweenTagData);
      break;
    case "head":
      reData = BuildCode11(pathName, type, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    case "svelte":
      reData = BuildCode9(type, dataTag, sessionInfo);
      break;
    case "markdown":
      reData = BuildCode10(type, dataTag, BetweenTagData, InsertComponent2, sessionInfo);
      break;
    default:
      console.error("Component is not build yet");
  }
  return reData;
}
function IsInclude(tagname) {
  return AllBuildIn.includes(tagname.toLowerCase());
}
async function finalizeBuild(pageData, sessionInfo, fullCompilePath) {
  updateRecords(sessionInfo);
  pageData = addFinalizeBuild2(pageData, sessionInfo);
  pageData = addFinalizeBuild3(pageData, sessionInfo);
  pageData = pageData.replace(/@ConnectHere(;?)/gi, "").replace(/@ConnectHereForm(;?)/gi, "");
  pageData = await addFinalizeBuild(pageData, sessionInfo, fullCompilePath);
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
async function perCompilePage(sessionInfo, fullCompilePath) {
  sessionInfo.debug && deleteBeforeReBuild(sessionInfo.smallPath);
}
async function postCompilePage(sessionInfo, fullCompilePath) {
}

// src/CompileCode/InsertComponent.ts
import pathNode from "path";

// src/CompileCode/XMLHelpers/Extricate.ts
function unicodeMe(value) {
  let a = "";
  for (const v of value) {
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
  constructor(script, sessionInfo, smallPath, isTs2) {
    this.script = script;
    this.sessionInfo = sessionInfo;
    this.smallPath = smallPath;
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
        (key, value) => this.define[String(key)] = value,
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
      const resolve2 = () => this.script;
      doForAll(resolve2);
      this.sessionInfo.cacheCompileScript[this.smallPath] = resolve2;
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
  constructor(sessionInfo, code, isTs2) {
    this.sessionInfo = sessionInfo;
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
  async loadSettings(pagePath, smallPath, pageName, { attributes, dynamicCheck }) {
    const run = new CRunTime(this.code, this.sessionInfo, smallPath, this.isTs);
    this.code = await run.compile(attributes);
    await this.parseBase(this.code);
    if (this.nonDynamic(dynamicCheck)) {
      return false;
    }
    await this.loadCodeFile(pagePath, smallPath, this.isTs, pageName);
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
    for (const { key, value, char } of this.valueArray) {
      if (value !== true) {
        build.Plus$`${key}=${char}${value}${char} `;
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
    for (const name of parse2.byValue("inherit")) {
      if (ignoreInherit.includes(name.toLowerCase()))
        continue;
      parse2.pop(name);
      build.AddTextAfterNoTrack(`<@${name}><:${name}/></@${name}>`);
    }
    parse2.rebuild();
    return parse2.clearData.Plus(build);
  }
  get(name) {
    return this.valueArray.find((x) => x.key === name)?.value;
  }
  pop(name) {
    return this.valueArray.splice(this.valueArray.findIndex((x) => x.key === name), 1)[0]?.value;
  }
  popAny(name) {
    const haveName = this.valueArray.findIndex((x) => x.key.toLowerCase() == name);
    if (haveName != -1)
      return this.valueArray.splice(haveName, 1)[0].value;
    const asTag = searchForCutMain(this.clearData, [name], "@");
    if (!asTag.found[0])
      return;
    this.clearData = asTag.data;
    return asTag.found[0].data.trim();
  }
  byValue(value) {
    return this.valueArray.filter((x) => x.value !== true && x.value.eq === value).map((x) => x.key);
  }
  replaceValue(name, value) {
    const have = this.valueArray.find((x) => x.key === name);
    if (have)
      have.value = value;
  }
  defaultValuePopAny(name, defaultValue) {
    const value = this.popAny(name);
    return value === true ? defaultValue : value?.eq;
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
  loadSetting(name = "define", limitArguments = 2) {
    const have = this.clearData.indexOf(`@${name}(`);
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
    for (const [name, value] of values) {
      this.clearData = this.clearData.replaceAll(`:${name}:`, value);
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
  popHaveDefaultTracker(key, value = "") {
    const data = this.popTracker(key);
    return typeof data === "boolean" ? value : data;
  }
  popAnyTracker(key, value = "") {
    const data = this.popTracker(key);
    return data instanceof StringTracker ? data.eq : value;
  }
  popString(key) {
    const value = this.popItem(key)?.value;
    return value instanceof StringTracker ? value.eq : value;
  }
  popBoolean(key, defaultValue) {
    return Boolean(this.popString(key) ?? defaultValue);
  }
  exists(key) {
    return this.valueArray.find((x) => x.key.eq.toLowerCase() == key) != null;
  }
  popHaveDefault(key, value = "") {
    const data = this.popString(key);
    return typeof data === "boolean" ? value : data;
  }
  popAnyDefault(key, value = "") {
    const data = this.popString(key);
    return typeof data === "string" ? data : value;
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
    for (const { value, char, key, space } of this.valueArray) {
      space && newAttributes.AddTextAfterNoTrack(" ");
      if (value === true) {
        newAttributes.Plus(key);
      } else {
        newAttributes.Plus$`${key}=${char}${value}${char}`;
      }
    }
    return newAttributes;
  }
  pushValue(key, value) {
    const have = this.valueArray.find((x) => x.key.eq.toLowerCase() == key);
    if (have)
      return have.value = new StringTracker(null, value);
    this.valueArray.push({ key: new StringTracker(null, key), value: new StringTracker(null, value), char: '"', space: true });
  }
  map() {
    const attrMap = {};
    for (const { key, value } of this.valueArray) {
      if (key)
        attrMap[key.eq] = value === true ? true : value.eq;
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
  async ReBuildTag(type, dataTag, dataTagSpliced, BetweenTagData, SendDataFunc) {
    if (this.SomePlugins("MinHTML", "MinAll")) {
      if (BetweenTagData)
        BetweenTagData = BetweenTagData.SpaceOne(" ");
      dataTag = dataTagSpliced.rebuildSpace();
    }
    const tagData = new StringTracker(type.DefaultInfoText).Plus("<", type, dataTag);
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
    for (const { key, value } of tagData.valueArray) {
      const re = new RegExp("\\~" + key, "gi");
      fileData = fileData.replace(re, value);
    }
    return this.addDefaultValues(foundSetters, fileData);
  }
  async buildTagBasic(fileData, tagData, path22, SmallPath, pathName, sessionInfo, BetweenTagData) {
    fileData = await this.PluginBuild.BuildComponent(fileData, path22, pathName, sessionInfo);
    fileData = this.parseComponentProps(tagData, fileData);
    fileData = fileData.replace(/<\:reader( )*\/>/gi, BetweenTagData ?? "");
    pathName = pathName + " -> " + SmallPath;
    fileData = await this.StartReplace(fileData, pathName, sessionInfo);
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
  async insertTagData(pathName, type, dataTag, { BetweenTagData, sessionInfo }) {
    const dataParser = new TagDataParser(dataTag), BuildIn = IsInclude(type.eq);
    await dataParser.parser();
    let fileData, SearchInComment = true, AllPathTypes = {}, addStringInfo;
    if (BuildIn) {
      const { compiledString, checkComponents } = await StartCompiling(pathName, type, dataParser, BetweenTagData ?? new StringTracker(), this, sessionInfo);
      fileData = compiledString;
      SearchInComment = checkComponents;
    } else {
      const ReBuildTag = () => this.ReBuildTag(type, dataTag, dataParser, BetweenTagData, (BetweenTagData2) => this.StartReplace(BetweenTagData2, pathName, sessionInfo));
      const firstChar = type.at(0).eq;
      if (firstChar != firstChar.toUpperCase()) {
        return ReBuildTag();
      }
      let folder = dataParser.popHaveDefault("folder", ".");
      const tagPath = (folder ? folder + "/" : "") + type.replace(/:/gi, "/").eq;
      const relativesFilePathSmall = type.extractInfo(), relativesFilePath = pathNode.join(BasicSettings.fullWebSitePath, relativesFilePathSmall);
      AllPathTypes = CreateFilePath(relativesFilePath, relativesFilePathSmall, tagPath, this.dirFolder, BasicSettings.pageTypes.component);
      if (sessionInfo.cacheComponent[AllPathTypes.SmallPath] === null || sessionInfo.cacheComponent[AllPathTypes.SmallPath] === void 0 && !await EasyFs_default.existsFile(AllPathTypes.FullPath)) {
        sessionInfo.cacheComponent[AllPathTypes.SmallPath] = null;
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
      if (!sessionInfo.cacheComponent[AllPathTypes.SmallPath]?.mtimeMs)
        sessionInfo.cacheComponent[AllPathTypes.SmallPath] = { mtimeMs: await EasyFs_default.stat(AllPathTypes.FullPath, "mtimeMs") };
      sessionInfo.dependencies[AllPathTypes.SmallPath] = sessionInfo.cacheComponent[AllPathTypes.SmallPath].mtimeMs;
      const { allData, stringInfo } = await AddDebugInfo(true, pathName, AllPathTypes.FullPath, AllPathTypes.SmallPath, sessionInfo.cacheComponent[AllPathTypes.SmallPath]);
      const baseData = new ParseBasePage(sessionInfo, allData, this.isTs());
      const mapAttributes = InsertComponent.addSpacialAttributes(dataParser, type, BetweenTagData);
      await baseData.loadSettings(AllPathTypes.FullPath, AllPathTypes.SmallPath, pathName + " -> " + AllPathTypes.SmallPath, { attributes: mapAttributes });
      fileData = baseData.scriptFile.Plus(baseData.clearData);
      addStringInfo = sessionInfo.debug && stringInfo;
    }
    if (SearchInComment && (fileData.length > 0 || BetweenTagData)) {
      const { SmallPath, FullPath } = AllPathTypes;
      fileData = await this.buildTagBasic(fileData, dataParser, BuildIn ? type.eq : FullPath, BuildIn ? type.eq : SmallPath, pathName, sessionInfo, BetweenTagData);
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
  async StartReplace(data, pathName, sessionInfo) {
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
        promiseBuild.push(this.CheckMinHTML(this.CheckMinHTMLText(cutStartData)), this.insertTagData(pathName, tagType, inTag, { sessionInfo }));
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
      promiseBuild.push(this.CheckMinHTML(cutStartData), this.insertTagData(pathName, tagType, inTag, { BetweenTagData, sessionInfo }));
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
  async Insert(data, pathName, sessionInfo) {
    data = data.replace(/<!--[\w\W]+?-->/, "");
    data = await this.StartReplace(data, pathName, sessionInfo);
    data = data.replace(/<\:reader+( )*\/>/gi, '<%typeof page.codebase == "function" ? page.codebase(): write(page.codebase)%>');
    return this.RemoveUnnecessarySpace(data);
  }
};

// src/CompileCode/ScriptTemplate.ts
import path13 from "path";
var PageTemplate = class extends JSParser {
  static async AddPageTemplate(text, sessionInfo) {
    if (sessionInfo.debug) {
      text.AddTextBeforeNoTrack(`try {
`);
    }
    text.AddTextBeforeNoTrack(`
        module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "${JSParser.fixTextSimpleQuotes(sessionInfo.fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path13.dirname(sessionInfo.fullPath))}";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {`);
    if (sessionInfo.debug) {
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
  static async BuildPage(text, sessionInfo) {
    const builtCode = await PageTemplate.RunAndExport(text, sessionInfo.fullPath, sessionInfo.debug);
    return PageTemplate.AddPageTemplate(builtCode, sessionInfo);
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
  async BuildBasic(text, OData, path22, pathName, sessionInfo) {
    if (!OData) {
      return text;
    }
    if (!Array.isArray(OData)) {
      OData = [OData];
    }
    for (const i of OData) {
      const Syntax = await GetSyntax(i);
      if (Syntax) {
        text = await Syntax(text, i, path22, pathName, sessionInfo);
      }
    }
    return text;
  }
  async BuildPage(text, path22, pathName, sessionInfo) {
    text = await this.BuildBasic(text, this.defaultSyntax, path22, pathName, sessionInfo);
    return text;
  }
  async BuildComponent(text, path22, pathName, sessionInfo) {
    text = await this.BuildBasic(text, this.defaultSyntax, path22, pathName, sessionInfo);
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
function GetPlugin(name) {
  return Settings3.plugins.find((b) => b == name || b?.name == name);
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
async function outPage(data, scriptFile, pagePath, pageName, LastSmallPath, sessionInfo, dynamicCheck) {
  const baseData = new ParseBasePage(sessionInfo, data, isTs());
  if (!await baseData.loadSettings(pagePath, LastSmallPath, pageName, { dynamicCheck })) {
    return;
  }
  const modelName = baseData.defaultValuePopAny("model", "website");
  if (!modelName)
    return scriptFile.Plus(baseData.scriptFile, baseData.clearData);
  data = baseData.clearData;
  const { SmallPath, FullPath } = CreateFilePath(pagePath, LastSmallPath, modelName, "Models", BasicSettings.pageTypes.model);
  if (!await EasyFs_default.existsFile(FullPath)) {
    const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;
    print.error(ErrorMessage);
    return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
  }
  await sessionInfo.dependence(SmallPath, FullPath);
  const baseModelData = await AddDebugInfo(false, pageName, FullPath, SmallPath);
  let modelData = await ParseBasePage.rebuildBaseInheritance(baseModelData.allData);
  sessionInfo.debug && modelData.AddTextBeforeNoTrack(baseModelData.stringInfo);
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
  return await outPage(modelBuild, scriptFile.Plus(baseData.scriptFile), FullPath, pageName, SmallPath, sessionInfo);
}
async function Insert(data, fullPathCompile, nestedPage, nestedPageData, sessionInfo, dynamicCheck) {
  let DebugString = new StringTracker(sessionInfo.smallPath, data);
  DebugString = await outPage(DebugString, new StringTracker(DebugString.DefaultInfoText), sessionInfo.fullPath, sessionInfo.smallPath, sessionInfo.smallPath, sessionInfo, dynamicCheck);
  if (DebugString == null) {
    return;
  }
  DebugString = await PluginBuild.BuildPage(DebugString, sessionInfo.fullPath, sessionInfo.smallPath, sessionInfo);
  DebugString = await Components.Insert(DebugString, sessionInfo.smallPath, sessionInfo);
  DebugString = await ParseDebugLine(DebugString, sessionInfo.smallPath);
  if (nestedPage) {
    return PageTemplate.InPageTemplate(DebugString, nestedPageData, sessionInfo.fullPath);
  }
  DebugString = await finalizeBuild(DebugString, sessionInfo, fullPathCompile);
  DebugString = await PageTemplate.BuildPage(DebugString, sessionInfo);
  DebugString = await sessionInfo.BuildScriptWithPrams(DebugString);
  DebugString = PageTemplate.AddAfterBuild(DebugString, sessionInfo.debug);
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
        const FullPath = fileURLToPath7(file);
        dependenceObject[BasicSettings.relative(FullPath)] = await EasyFs_default.stat(fullPath, "mtimeMs", true, null);
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
  if (fileName.startsWith("auto."))
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
function extensionIs(name, extname2) {
  return name.endsWith("." + extname2);
}
function isFileType(types, name) {
  name = name.toLowerCase();
  for (const type of types) {
    if (extensionIs(name, type)) {
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
  const html = await EasyFs_default.readFile(FullFilePath, "utf8");
  const ExcluUrl = (nestedPage ? nestedPage + "<line>" : "") + arrayType[2] + "/" + filePath;
  const sessionInfo = hasSessionInfo ?? new SessionBuild(arrayType[2] + "/" + filePath, FullFilePath, arrayType[2], isDebug, GetPlugin("SafeDebug"));
  await sessionInfo.dependence("thisPage", FullFilePath);
  await perCompilePage(sessionInfo, FullPathCompile);
  const CompiledData = await Insert(html, FullPathCompile, Boolean(nestedPage), nestedPageData, sessionInfo, dynamicCheck) ?? new StringTracker();
  await postCompilePage(sessionInfo, FullPathCompile);
  if (!nestedPage && CompiledData.length) {
    await EasyFs_default.writeFile(FullPathCompile, CompiledData.StringWithTack(FullPathCompile));
    pageDeps.update(ExcluUrl, sessionInfo.dependencies);
  }
  return { CompiledData, sessionInfo };
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
  for (const [filePath, value] of Object.entries(dependencies)) {
    promiseAll.push((async () => {
      if (filePath == "thisFile") {
        if (!cache[basePath])
          cache[basePath] = await EasyFs_default.stat(typeArray[0] + basePath, "mtimeMs", true);
        dependenciesMap["thisFile"] = cache[basePath];
      } else {
        dependenciesMap[filePath] = await makeDependencies(value, typeArray, filePath, cache);
      }
    })());
  }
  await Promise.all(promiseAll);
  return dependenciesMap;
}
function compareDependenciesSame(oldDeps, newDeps) {
  for (const name in oldDeps) {
    if (name == "thisFile") {
      if (newDeps[name] != oldDeps[name])
        return false;
    } else if (!compareDependenciesSame(oldDeps[name], newDeps[name]))
      return false;
  }
  return true;
}
function getChangeArray(oldDeps, newDeps, parent = "") {
  const changeArray = [];
  for (const name in oldDeps) {
    if (name == "thisFile") {
      if (newDeps[name] != oldDeps[name]) {
        changeArray.push(parent);
        break;
      }
    } else if (!newDeps[name]) {
      changeArray.push(name);
      break;
    } else {
      const change = getChangeArray(oldDeps[name], newDeps[name], name);
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
async function parseURLData(validate, value, Request, Response, makeMassage) {
  let pushData = value, resData = true, error;
  switch (validate) {
    case Number:
    case parseFloat:
    case parseInt:
      pushData = validate(value);
      resData = !isNaN(pushData);
      break;
    case Boolean:
      pushData = value != "false";
      value = value.toLowerCase();
      resData = value == "true" || value == "false";
      break;
    case "any":
      break;
    default:
      if (Array.isArray(validate))
        resData = validate.includes(value);
      if (typeof validate == "function") {
        try {
          const makeValid = await validate(value, Request, Response);
          if (makeValid && typeof makeValid == "object") {
            resData = makeValid.valid;
            pushData = makeValid.parse ?? value;
          } else
            resData = makeValid;
        } catch (e) {
          error = "Error on function validator, field - " + makeMassage(e);
        }
      }
      if (validate instanceof RegExp)
        resData = validate.test(value);
  }
  if (!resData)
    error = 'Validation error with value "' + value + '"';
  return [error, pushData];
}
async function makeDefinition(obj, urlFrom, defineObject, Request, Response, makeMassage) {
  if (!obj.define)
    return urlFrom;
  const validateFunc = obj.define.validateFunc;
  obj.define.validateFunc = null;
  delete obj.define.validateFunc;
  for (const name in obj.define) {
    const [dataSlash, nextUrlFrom] = SplitFirst("/", urlFrom);
    urlFrom = nextUrlFrom;
    const [error, newData] = await parseURLData(obj.define[name], dataSlash, Request, Response, makeMassage);
    if (error)
      return { error };
    defineObject[name] = newData;
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
async function BuildLoadPage(smallPath, firstFunc) {
  const pageArray = [firstFunc ?? await LoadPage(smallPath, Settings4.DevMode)];
  pageArray[1] = BuildPage(pageArray[0], smallPath);
  if (Export3.PageRam)
    Export3.PageLoadRam[smallPath] = pageArray;
  return pageArray[1];
}
async function GetDynamicPage(arrayType, url, code) {
  const inStatic = url + "." + BasicSettings.pageTypes.page;
  const smallPath = arrayType[2] + "/" + inStatic;
  let fullPageUrl = BasicSettings.fullWebSitePath + smallPath;
  let DynamicFunc;
  if (Settings4.DevMode && await EasyFs_default.existsFile(fullPageUrl)) {
    if (!await EasyFs_default.existsFile(arrayType[1] + inStatic + ".cjs") || await CheckDependencyChange(smallPath)) {
      await FastCompile(url + "." + BasicSettings.pageTypes.page, arrayType);
      DynamicFunc = await BuildLoadPage(smallPath);
    } else if (Export3.PageLoadRam[smallPath]?.[1])
      DynamicFunc = Export3.PageLoadRam[smallPath][1];
    else
      DynamicFunc = await BuildLoadPage(smallPath, Export3.PageLoadRam[smallPath]?.[0]);
  } else if (Export3.PageLoadRam[smallPath]?.[1])
    DynamicFunc = Export3.PageLoadRam[smallPath][1];
  else if (!Export3.PageRam && await EasyFs_default.existsFile(fullPageUrl))
    DynamicFunc = await BuildLoadPage(smallPath, Export3.PageLoadRam[smallPath]?.[0]);
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
  set development(value) {
    if (DevMode_ == value)
      return;
    DevMode_ = value;
    if (!value) {
      compilationScan = compileAll(Export);
      process.env.NODE_ENV = "production";
    }
    Settings4.DevMode = value;
    allowPrint(value);
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
    set pageInRam(value) {
      Export2.PageRam = value;
      pageInRamActivate = async () => {
        const preparations = await compilationScan;
        await preparations?.();
        if (value) {
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
    set compileSyntax(value) {
      Settings3.AddCompileSyntax = value;
    },
    get compileSyntax() {
      return Settings3.AddCompileSyntax;
    },
    set ignoreError(value) {
      Settings.PreventErrors = value;
    },
    get ignoreError() {
      return Settings.PreventErrors;
    },
    set plugins(value) {
      Settings3.plugins.length = 0;
      Settings3.plugins.push(...value);
    },
    get plugins() {
      return Settings3.plugins;
    },
    get define() {
      return settings.define;
    },
    set define(value) {
      settings.define = value;
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
    set errorPages(value) {
      Settings4.ErrorPages = value;
    }
  },
  serveLimits: {
    get cacheDays() {
      return Settings4.CacheDays;
    },
    set cacheDays(value) {
      Settings4.CacheDays = value;
    },
    get cookiesExpiresDays() {
      return CookieSettings.maxAge / 864e5;
    },
    set cookiesExpiresDays(value) {
      CookieSettings.maxAge = value * 864e5;
    },
    set sessionTotalRamMB(value) {
      if (serveLimits.sessionTotalRamMB == value)
        return;
      serveLimits.sessionTotalRamMB = value;
      buildSession();
    },
    get sessionTotalRamMB() {
      return serveLimits.sessionTotalRamMB;
    },
    set sessionTimeMinutes(value) {
      if (serveLimits.sessionTimeMinutes == value)
        return;
      serveLimits.sessionTimeMinutes = value;
      buildSession();
    },
    get sessionTimeMinutes() {
      return serveLimits.sessionTimeMinutes;
    },
    set sessionCheckPeriodMinutes(value) {
      if (serveLimits.sessionCheckPeriodMinutes == value)
        return;
      serveLimits.sessionCheckPeriodMinutes = value;
      buildSession();
    },
    get sessionCheckPeriodMinutes() {
      return serveLimits.sessionCheckPeriodMinutes;
    },
    set fileLimitMB(value) {
      if (serveLimits.fileLimitMB == value)
        return;
      serveLimits.fileLimitMB = value;
      buildFormidable();
    },
    get fileLimitMB() {
      return serveLimits.fileLimitMB;
    },
    set requestLimitMB(value) {
      if (serveLimits.requestLimitMB == value)
        return;
      serveLimits.requestLimitMB = value;
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
  const concatArray = (name, array) => Settings5.routing?.[name] && (Export.routing[name] = Settings5.routing[name].concat(array));
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
  await StartApp(HttpServer);
  return appOnline;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0xvZ2dlci50cyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzIiwgIi4uL3NyYy9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVNjcmlwdC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSlNQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvbWluaWZ5LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jbGllbnQudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9sb2FkLW9wdGlvbnMudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vanNvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi93YXNtLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2Vzc2lvbi50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvZXJyb3IudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd24udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaGVhZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9jb25uZWN0LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2Zvcm0udHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcmVjb3JkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlYXJjaC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvWE1MSGVscGVycy9FeHRyaWNhdGUudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvQ29tcGlsZS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU2NyaXB0LnRzIiwgIi4uL3NyYy9HbG9iYWwvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXIudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlLnRzIiwgIi4uL3NyYy9QbHVnaW5zL1N5bnRheC9JbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9JbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TY3JpcHQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvY2xpZW50LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3R5bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0NvbXBpbGVTdGF0ZS50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NpdGVNYXAudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GaWxlVHlwZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ltcG9ydEZpbGVSdW50aW1lLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQXBpQ2FsbC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0dldFBhZ2VzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvU2V0dGluZ3MudHMiLCAiLi4vc3JjL01haW5CdWlsZC9MaXN0ZW5HcmVlbkxvY2sudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBcHAgYXMgVGlueUFwcCB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL1R5cGVzJztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5ncywgcmVxdWlyZVNldHRpbmdzLCBidWlsZEZpcnN0TG9hZCwgcGFnZUluUmFtQWN0aXZhdGVGdW5jfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBmb3JtaWRhYmxlIGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgVXBkYXRlR3JlZW5Mb2NrIH0gZnJvbSAnLi9MaXN0ZW5HcmVlbkxvY2snO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEFuZFNldHRpbmdzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgY2hhbmdlVVJMUnVsZXMocmVxLCByZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGFuZ2VVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBsZXQgdXJsID0gZmlsZUJ5VXJsLnVybEZpeChyZXEucGF0aCk7XG5cbiAgICBcbiAgICBmb3IgKGxldCBpIG9mIFNldHRpbmdzLnJvdXRpbmcudXJsU3RvcCkge1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkpIHtcbiAgICAgICAgICAgIGlmIChpLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS5zdWJzdHJpbmcoMCwgaS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBmaWxlclVSTFJ1bGVzKHJlcSwgcmVzLCBpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IFJ1bGVJbmRleCA9IE9iamVjdC5rZXlzKFNldHRpbmdzLnJvdXRpbmcucnVsZXMpLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSk7XG5cbiAgICBpZiAoUnVsZUluZGV4KSB7XG4gICAgICAgIHVybCA9IGF3YWl0IFNldHRpbmdzLnJvdXRpbmcucnVsZXNbUnVsZUluZGV4XSh1cmwsIHJlcSwgcmVzKTtcbiAgICB9XG5cbiAgICBhd2FpdCBmaWxlclVSTFJ1bGVzKHJlcSwgcmVzLCB1cmwpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaWxlclVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgdXJsOiBzdHJpbmcpIHtcbiAgICBsZXQgbm90VmFsaWQ6IGFueSA9IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKSB8fCBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoaSA9PiB1cmwuZW5kc1dpdGgoJy4nK2kpKTtcbiAgICBcbiAgICBpZighbm90VmFsaWQpIHtcbiAgICAgICAgZm9yKGNvbnN0IHZhbGlkIG9mIFNldHRpbmdzLnJvdXRpbmcudmFsaWRQYXRoKXsgLy8gY2hlY2sgaWYgdXJsIGlzbid0IHZhbGlkXG4gICAgICAgICAgICBpZighYXdhaXQgdmFsaWQodXJsLCByZXEsIHJlcykpe1xuICAgICAgICAgICAgICAgIG5vdFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub3RWYWxpZCkge1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBmaWxlQnlVcmwuR2V0RXJyb3JQYWdlKDQwNCwgJ25vdEZvdW5kJyk7XG4gICAgICAgIHJldHVybiBhd2FpdCBmaWxlQnlVcmwuRHluYW1pY1BhZ2UocmVxLCByZXMsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBmaWxlQnlVcmwuRHluYW1pY1BhZ2UocmVxLCByZXMsIHVybC5zdWJzdHJpbmcoMSkpO1xufVxuXG5sZXQgYXBwT25saW5lOiB7Y2xvc2U6ICgpID0+IHZvaWQsIHNlcnZlcjogaHR0cC5TZXJ2ZXJ9XG5cbi8qKlxuICogSXQgc3RhcnRzIHRoZSBzZXJ2ZXIgYW5kIHRoZW4gY2FsbHMgU3RhcnRMaXN0aW5nXG4gKiBAcGFyYW0gW1NlcnZlcl0gLSBUaGUgc2VydmVyIG9iamVjdCB0aGF0IGlzIHBhc3NlZCBpbiBieSB0aGUgY2FsbGVyLlxuICovXG5hc3luYyBmdW5jdGlvbiBTdGFydEFwcChTZXJ2ZXI/KSB7XG4gICAgY29uc3QgYXBwID0gbmV3IFRpbnlBcHAoKTtcbiAgICBpZiAoIVNldHRpbmdzLnNlcnZlLmh0dHAyKSB7XG4gICAgICAgIGFwcC51c2UoPGFueT5jb21wcmVzc2lvbigpKTtcbiAgICB9XG4gICAgZmlsZUJ5VXJsLlNldHRpbmdzLlNlc3Npb25TdG9yZSA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4gU2V0dGluZ3MubWlkZGxld2FyZS5zZXNzaW9uKHJlcSwgcmVzLCBuZXh0KTtcblxuICAgIGNvbnN0IE9wZW5MaXN0aW5nID0gYXdhaXQgU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKTtcblxuICAgIGZvciAoY29uc3QgZnVuYyBvZiBTZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCkge1xuICAgICAgICBhd2FpdCBmdW5jKGFwcCwgYXBwT25saW5lLnNlcnZlciwgU2V0dGluZ3MpO1xuICAgIH1cbiAgICBhd2FpdCBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKT8uKClcblxuICAgIGFwcC5hbGwoXCIqXCIsIFBhcnNlUmVxdWVzdCk7XG5cbiAgICBhd2FpdCBPcGVuTGlzdGluZyhTZXR0aW5ncy5zZXJ2ZS5wb3J0KTtcblxuICAgIGNvbnNvbGUubG9nKFwiQXBwIGxpc3RpbmcgYXQgcG9ydDogXCIgKyBTZXR0aW5ncy5zZXJ2ZS5wb3J0KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcmVxdWVzdCBpcyBhIFBPU1QgcmVxdWVzdCwgdGhlbiBwYXJzZSB0aGUgcmVxdWVzdCBib2R5LCB0aGVuIHNlbmQgaXQgdG8gcm91dGluZyBzZXR0aW5nc1xuICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLSBUaGUgaW5jb21pbmcgcmVxdWVzdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlcyAtIFJlc3BvbnNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlUmVxdWVzdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAocmVxLm1ldGhvZCA9PSAnUE9TVCcpIHtcbiAgICAgICAgaWYgKHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXT8uc3RhcnRzV2l0aD8uKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgICAgIFNldHRpbmdzLm1pZGRsZXdhcmUuYm9keVBhcnNlcihyZXEsIHJlcywgKCkgPT4gcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgZm9ybWlkYWJsZS5JbmNvbWluZ0Zvcm0oU2V0dGluZ3MubWlkZGxld2FyZS5mb3JtaWRhYmxlKS5wYXJzZShyZXEsIChlcnIsIGZpZWxkcywgZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcikge1xuICAgIGlmIChhcHBPbmxpbmUgJiYgYXBwT25saW5lLmNsb3NlKSB7XG4gICAgICAgIGF3YWl0IGFwcE9ubGluZS5jbG9zZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VydmVyLCBsaXN0ZW4sIGNsb3NlIH0gPSBhd2FpdCBTZXJ2ZXIoYXBwKTtcblxuICAgIGFwcE9ubGluZSA9IHsgc2VydmVyLCBjbG9zZSB9O1xuXG4gICAgcmV0dXJuIGxpc3Rlbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU3RhcnRTZXJ2ZXIoeyBTaXRlUGF0aCA9ICcuLycsIEh0dHBTZXJ2ZXIgPSBVcGRhdGVHcmVlbkxvY2sgfSA9IHt9KSB7XG4gICAgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyID0gU2l0ZVBhdGg7XG4gICAgYnVpbGRGaXJzdExvYWQoKTtcbiAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICBhd2FpdCBTdGFydEFwcChIdHRwU2VydmVyKTtcbiAgICByZXR1cm4gYXBwT25saW5lXG59XG5cbmV4cG9ydCB7IFNldHRpbmdzIH07IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJsZXQgcHJpbnRNb2RlID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJpbnQoZDogYm9vbGVhbikge1xuICAgIHByaW50TW9kZSA9IGQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmludCA9IG5ldyBQcm94eShjb25zb2xlLHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZihwcm9wID09ICdpbXBvcnRhbnQnKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5lcnJvcjtcbiAgICAgICAgICAgIFxuICAgICAgICBpZihwcmludE1vZGUgJiYgcHJvcCAhPSBcImRvLW5vdGhpbmdcIilcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQge0RpcmVudH0gZnJvbSAnZnMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtjd2R9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gJ3VybCdcbmltcG9ydCB7IEN1dFRoZUxhc3QgLCBTcGxpdEZpcnN0fSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVCeVNtYWxsUGF0aChzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIGdldFR5cGVzW1NwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnNoaWZ0KCldO1xufVxuXG5cblxuZXhwb3J0IHtcbiAgICBnZXREaXJuYW1lLFxuICAgIFN5c3RlbURhdGEsXG4gICAgd29ya2luZ0RpcmVjdG9yeSxcbiAgICBnZXRUeXBlcyxcbiAgICBCYXNpY1NldHRpbmdzXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuaW50ZXJmYWNlIGdsb2JhbFN0cmluZzxUPiB7XG4gICAgaW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBsYXN0SW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBzdGFydHNXaXRoKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0Rmlyc3Q8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4odHlwZTogc3RyaW5nLCBzdHJpbmc6IFQpOiBUW10ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YodHlwZSk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpXG4gICAgICAgIHJldHVybiBbc3RyaW5nXTtcblxuICAgIHJldHVybiBbc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCksIHN0cmluZy5zdWJzdHJpbmcoaW5kZXggKyB0eXBlLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3V0VGhlTGFzdCh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVuc2lvbjxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdHJpbmc6IFQpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLy4uL0pTUGFyc2VyJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9TZXNzaW9uJztcblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgPCV7P2RlYnVnX2ZpbGU/fSR7aS50ZXh0fSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVNjcmlwdENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cblxuICAgIGNvbnN0IG5ld0NvZGVTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihjb2RlLkRlZmF1bHRJbmZvVGV4dCk7XG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyhpLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzJCBgcnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDb2RlU3RyaW5nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnTGluZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlVGV4dENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkudGV4dCA9IGF3YWl0IFBhcnNlU2NyaXB0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VyLnN0YXJ0ID0gXCI8JVwiO1xuICAgIHBhcnNlci5lbmQgPSBcIiU+XCI7XG4gICAgcmV0dXJuIHBhcnNlci5SZUJ1aWxkVGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZURlYnVnSW5mbyhjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBhd2FpdCBQYXJzZVNjcmlwdENvZGUoY29kZSwgcGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBBZGREZWJ1Z0luZm8oaXNvbGF0ZTogYm9vbGVhbiwgcGFnZU5hbWU6c3RyaW5nLCBGdWxsUGF0aDpzdHJpbmcsIFNtYWxsUGF0aDpzdHJpbmcsIGNhY2hlOiB7dmFsdWU/OiBzdHJpbmd9ID0ge30pe1xuICAgIGlmKCFjYWNoZS52YWx1ZSlcbiAgICAgICAgY2FjaGUudmFsdWUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbFBhdGgsICd1dGY4Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGxEYXRhOiBuZXcgU3RyaW5nVHJhY2tlcihgJHtwYWdlTmFtZX08bGluZT4ke1NtYWxsUGF0aH1gLCBpc29sYXRlID8gYDwleyU+JHtjYWNoZS52YWx1ZX08JX0lPmA6IGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkgPSB0aGlzLkRhdGFBcnJheS5jb25jYXQoZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcsIGluZm8gPSAnJykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheSA9IG5ld1N0cmluZy5EYXRhQXJyYXkuY29uY2F0KHRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgdGhpc1N1YnN0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzU3Vic3RyaW5nLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXNTdWJzdHJpbmcgPSB0aGlzU3Vic3RyaW5nLkN1dFN0cmluZyhpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICBwdWJsaWMgb3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lOm51bWJlciwgY29sdW1uOm51bWJlcil7XG4gICAgICAgIGxldCBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUpO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnNlYXJjaExpbmUuYXQoY29sdW1uLTEpLkRlZmF1bHRJbmZvVGV4dCxcbiAgICAgICAgICAgIHNlYXJjaExpbmVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMub3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEsIGNvbCA/PyBsb2NhdGlvbj8uY29sdW1uID8/IDApXG5cbiAgICAgICAgcmV0dXJuIGAke3RleHQgfHwgbWVzc2FnZX0sIG9uIGZpbGUgLT48Y29sb3I+JHtCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCtkYXRhLnNlYXJjaExpbmUuZXh0cmFjdEluZm8oKX06JHtkYXRhLmxpbmV9OiR7ZGF0YS5jaGFyfSR7bG9jYXRpb24/LmxpbmVUZXh0ID8gJ1xcbkxpbmU6IFwiJyArIGxvY2F0aW9uLmxpbmVUZXh0LnRyaW0oKSArICdcIic6ICcnfWA7XG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1dpdGhUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBvdXRwdXRXaXRoTWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24pXG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1RhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uLCBodHRwU291cmNlLCByZWxhdGl2ZSlcbiAgICB9XG59IiwgImltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdQcmludCh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgICAgIGNvbnN0IGxvZ1R5cGUgPSB0eXBlID09ICdlcnJvcicgPyAnaW1wb3J0YW50JzogdHlwZTtcblxuICAgICAgICBjb25zdCBzcGxpdENvbG9yID0gdGV4dC5zcGxpdCgnPGNvbG9yPicpO1xuICAgICAgIFxuICAgICAgICBjb25zdCBtYWluTWVzc2FnZSA9IGNoYWxrLm1hZ2VudGEoc3BsaXRDb2xvci5wb3AoKS5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJykpXG4gICAgICAgIFxuICAgICAgICBsZXQgYWJvdXQgPSAnLScucmVwZWF0KDEwKSArICh0eXBlID09ICdlcnJvcicgPyBjaGFsay5ib2xkKHR5cGUpOiB0eXBlKSArICctJy5yZXBlYXQoMTApXG4gICAgICAgIHJldHVybiBbbG9nVHlwZSxcbiAgICAgICAgICAgIGFib3V0ICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbGsuYmx1ZShzcGxpdENvbG9yLnNoaWZ0KCkgfHwgJycpICsgJ1xcbicgKyBcbiAgICAgICAgICAgIG1haW5NZXNzYWdlICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbGsucmVkKGBFcnJvci1Db2RlOiAke2Vycm9yTmFtZX1gKSArICdcXG4nICtcbiAgICAgICAgICAgICctJy5yZXBlYXQodHlwZS5sZW5ndGgrMjApICsgJ1xcbiddXG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2dUb0hUTUwobG9nOiBzdHJpbmcpe1xuICAgIHJldHVybiBsb2cucmVwbGFjZSgvXFxufDxsaW5lPnw8Y29sb3I+LywgJzxici8+Jylcbn0iLCAiaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5jb25zdCBsb2FkUGF0aCA9IHR5cGVvZiBlc2J1aWxkICE9PSAndW5kZWZpbmVkJyA/ICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50Lyc6ICcvLi4vJztcbmNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsICsgbG9hZFBhdGggKyAnYnVpbGQud2FzbScpKSk7XG5jb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuY29uc3Qgd2FzbSA9IHdhc21JbnN0YW5jZS5leHBvcnRzO1xuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbSh0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuLyoqXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9lcnJvcnMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHdhc20uZ2V0X2Vycm9ycyhyZXRwdHIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGJsb2NrXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX2Jsb2NrKHRleHQsIGJsb2NrKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChibG9jaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX2Jsb2NrKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tpcF9zcGVjaWFsX3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gc2ltcGxlX3NraXBcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2NvbXBvbmVudChza2lwX3NwZWNpYWxfdGFnLCBzaW1wbGVfc2tpcCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2tpcF9zcGVjaWFsX3RhZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2ltcGxlX3NraXAsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB3YXNtLmluc2VydF9jb21wb25lbnQocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfZGVmKHRleHQsIGVuZF90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmRfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX2RlZihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHFfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9xKHRleHQsIHFfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX3EocHRyMCwgbGVuMCwgcV90eXBlLmNvZGVQb2ludEF0KDApKTtcbiAgICByZXR1cm4gcmV0ID4+PiAwO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2VqcyhyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzX21pbih0ZXh0LCBuYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2Vqc19taW4ocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzdGFydFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGVqc19wYXJzZSh0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGFydCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjIgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjIgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uZWpzX3BhcnNlKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMiwgbGVuMik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWdlX2Jhc2VfcGFyc2VyKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnBhZ2VfYmFzZV9wYXJzZXIocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWxfYXR0cl9wYXJzZXIodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uaHRtbF9hdHRyX3BhcnNlcihyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGNvbnN0IFNpbXBsZVNraXAgPSBbJ3RleHRhcmVhJywnc2NyaXB0JywgJ3N0eWxlJ107XG5leHBvcnQgY29uc3QgU2tpcFNwZWNpYWxUYWcgPSBbW1wiJVwiLCBcIiVcIl0sIFtcIiN7ZGVidWd9XCIsIFwie2RlYnVnfSNcIl1dOyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBmaW5kX2VuZF9vZl9kZWYsIGZpbmRfZW5kX29mX3EsIGZpbmRfZW5kX2Jsb2NrIH0gZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L2luZGV4LmpzJztcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9TZXR0aW5ncy5qcyc7XG5pbXBvcnQgeyBnZXREaXJuYW1lLCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuXG5leHBvcnQgY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVzKCkubGVuZ3RoIH0pO1xuXG5leHBvcnQgY2xhc3MgQmFzZVJlYWRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZW5kIG9mIHF1b3RhdGlvbiBtYXJrcywgc2tpcHBpbmcgdGhpbmdzIGxpa2UgZXNjYXBpbmc6IFwiXFxcXFwiXCJcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVudE9mUSh0ZXh0OiBzdHJpbmcsIHFUeXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShFbmRUeXBlKSkge1xuICAgICAgICAgICAgRW5kVHlwZSA9IFtFbmRUeXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgSlNPTi5zdHJpbmdpZnkoRW5kVHlwZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhbWUgYXMgJ2ZpbmRFbmRPZkRlZicgb25seSB3aXRoIG9wdGlvbiB0byBjdXN0b20gJ29wZW4nIGFuZCAnY2xvc2UnXG4gICAgICogYGBganNcbiAgICAgKiBGaW5kRW5kT2ZCbG9jayhgY29vbCBcIn1cIiB7IGRhdGEgfSB9IG5leHRgLCAneycsICd9JylcbiAgICAgKiBgYGBcbiAgICAgKiBpdCB3aWxsIHJldHVybiB0aGUgMTggLT4gXCJ9IG5leHRcIlxuICAgICAqICBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgRmluZEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCBvcGVuOiBzdHJpbmcsIGVuZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX2Jsb2NrKHRleHQsIG9wZW4gKyBlbmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIFNpbXBsZVNraXA6IHN0cmluZ1tdID0gU2V0dGluZ3MuU2ltcGxlU2tpcDtcbiAgICBTa2lwU3BlY2lhbFRhZzogc3RyaW5nW11bXSA9IFNldHRpbmdzLlNraXBTcGVjaWFsVGFnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmludE5ldz86IGFueSkgeyB9XG5cbiAgICBwcml2YXRlIHByaW50RXJyb3JzKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGVycm9yczogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmludE5ldykgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBKU09OLnBhcnNlKGVycm9ycykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50TmV3KHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke2kudHlwZV9uYW1lfVwiLCB1c2VkIGluOiAke3RleHQuYXQoTnVtYmVyKGkuaW5kZXgpKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFyKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhcicsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhckhUTUwodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFySFRNTCcsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG59XG5cbnR5cGUgUGFyc2VCbG9ja3MgPSB7IG5hbWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfVtdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTKHRleHQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlMnLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlNNaW5pKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXJbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKU01pbmknLCBbdGV4dCxmaW5kXSkpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFSlNQYXJzZXIodGV4dDogc3RyaW5nLCBzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ0VKU1BhcnNlcicsIFt0ZXh0LCBzdGFydCwgZW5kXSkpO1xufSIsICJcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cbmludGVyZmFjZSBTcGxpdFRleHQge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICB0eXBlX25hbWU6IHN0cmluZyxcbiAgICBpc19za2lwOiBib29sZWFuXG59XG5cbmNvbnN0IHBhcnNlX3N0cmVhbSA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9yZWFkZXIvd29ya2VyLmpzJywgeyBtYXhXb3JrZXJzOiBjcHVzKCkubGVuZ3RoIH0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0U3RyZWFtKHRleHQ6IHN0cmluZyk6IFByb21pc2U8U3BsaXRUZXh0W10+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnYnVpbGRfc3RyZWFtJywgW3RleHRdKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkRlZlNraXBCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdmaW5kX2VuZF9vZl9kZWZfc2tpcF9ibG9jaycsIFt0ZXh0LCBKU09OLnN0cmluZ2lmeSh0eXBlcyldKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZW5kX29mX2Jsb2NrJywgW3RleHQsIHR5cGVzLmpvaW4oJycpXSk7XG59XG5cbmFic3RyYWN0IGNsYXNzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBSZXBsYWNlQWxsKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG5ld1RleHQgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dC5zcGxpdChmaW5kKSkge1xuICAgICAgICAgICAgbmV3VGV4dCArPSByZXBsYWNlICsgaTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdUZXh0LnN1YnN0cmluZyhyZXBsYWNlLmxlbmd0aCk7XG4gICAgfVxufVxuXG5cbmFic3RyYWN0IGNsYXNzIFJlQnVpbGRDb2RlQmFzaWMgZXh0ZW5kcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgcHVibGljIFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdO1xuXG4gICAgY29uc3RydWN0b3IoUGFyc2VBcnJheTogU3BsaXRUZXh0W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5QYXJzZUFycmF5ID0gUGFyc2VBcnJheTtcbiAgICB9XG5cbiAgICBCdWlsZENvZGUoKSB7XG4gICAgICAgIGxldCBPdXRTdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIE91dFN0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5SZXBsYWNlQWxsKE91dFN0cmluZywgJzx8LXw+JywgJzx8fD4nKTtcbiAgICB9XG59XG5cblxudHlwZSBEYXRhQ29kZUluZm8gPSB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGlucHV0czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGNsYXNzIFJlQnVpbGRDb2RlU3RyaW5nIGV4dGVuZHMgUmVCdWlsZENvZGVCYXNpYyB7XG4gICAgcHJpdmF0ZSBEYXRhQ29kZTogRGF0YUNvZGVJbmZvO1xuXG4gICAgY29uc3RydWN0b3IoUGFyc2VBcnJheTogU3BsaXRUZXh0W10pIHtcbiAgICAgICAgc3VwZXIoUGFyc2VBcnJheSk7XG4gICAgICAgIHRoaXMuRGF0YUNvZGUgPSB7IHRleHQ6IFwiXCIsIGlucHV0czogW10gfTtcbiAgICAgICAgdGhpcy5DcmVhdGVEYXRhQ29kZSgpO1xuICAgIH1cblxuICAgIGdldCBDb2RlQnVpbGRUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS50ZXh0O1xuICAgIH1cblxuICAgIHNldCBDb2RlQnVpbGRUZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBBbGxJbnB1dHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLmlucHV0cztcbiAgICB9XG5cbiAgICBwcml2YXRlIENyZWF0ZURhdGFDb2RlKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19za2lwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGA8fCR7dGhpcy5EYXRhQ29kZS5pbnB1dHMubGVuZ3RofXwke2kudHlwZV9uYW1lID8/ICcnfXw+YDtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLmlucHV0cy5wdXNoKGkudGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpZiB0aGUgPHx8PiBzdGFydCB3aXRoIGEgKCsuKSBsaWtlIHRoYXQgZm9yIGV4YW1wbGUsIFwiKy48fHw+XCIsIHRoZSB1cGRhdGUgZnVuY3Rpb24gd2lsbCBnZXQgdGhlIGxhc3QgXCJTa2lwVGV4dFwiIGluc3RlYWQgZ2V0dGluZyB0aGUgbmV3IG9uZVxuICAgICAqIHNhbWUgd2l0aCBhICgtLikganVzdCBmb3IgaWdub3JpbmcgY3VycmVudCB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHRoZSBidWlsZGVkIGNvZGVcbiAgICAgKi9cbiAgICBCdWlsZENvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuRGF0YUNvZGUudGV4dC5yZXBsYWNlKC88XFx8KFswLTldKylcXHxbXFx3XSpcXHw+L2dpLCAoXywgZzEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLmlucHV0c1tnMV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5SZXBsYWNlQWxsKG5ld1N0cmluZywgJzx8LXw+JywgJzx8fD4nKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgTG9nVG9IVE1MIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIGlmIChpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pYDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGVTYWZlKCR7c3Vic3RyaW5nfSlgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWJ1Z1wiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYFxcbnJ1bl9zY3JpcHRfbmFtZSA9IFxcYCR7SlNQYXJzZXIuZml4VGV4dChzdWJzdHJpbmcpfVxcYGBcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZSAhPSAndGV4dCcgJiYgIXN1YnN0cmluZy5lbmRzV2l0aCgnOycpKVxuICAgICAgICAgICAgICAgIHN1YnN0cmluZy5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCc7JylcblxuICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogc3Vic3RyaW5nLFxuICAgICAgICAgICAgICAgIHR5cGU6IDxhbnk+dHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dCh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL2AvZ2ksICdcXFxcYCcpLnJlcGxhY2UoL1xcdTAwMjQvZ2ksICdcXFxcdTAwMjQnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dFNpbXBsZVF1b3Rlcyh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyk7XG4gICAgfVxuXG4gICAgUmVCdWlsZFRleHQoKSB7XG4gICAgICAgIGNvbnN0IGFsbGNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpLnR5cGUgPT0gJ25vLXRyYWNrJykge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCAnIScsIGkudGV4dCwgdGhpcy5lbmQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCBpLnRleHQsIHRoaXMuZW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxjb2RlO1xuICAgIH1cblxuICAgIEJ1aWxkQWxsKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcnVuU2NyaXB0ID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyRgXFxub3V0X3J1bl9zY3JpcHQudGV4dCs9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1ZyAmJiBpLnR5cGUgPT0gJ3NjcmlwdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgXFxucnVuX3NjcmlwdF9jb2RlPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyaXB0V2l0aEluZm8oaS50ZXh0KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHByaW50RXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgPGRpdiBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+JHtKU1BhcnNlci5maXhUZXh0KExvZ1RvSFRNTChtZXNzYWdlKSl9PC9kaXY+YDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgUnVuQW5kRXhwb3J0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGV4dCwgcGF0aClcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG4gICAgICAgIHJldHVybiBwYXJzZXIuQnVpbGRBbGwoaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3BsaXQyRnJvbUVuZCh0ZXh0OiBzdHJpbmcsIHNwbGl0Q2hhcjogc3RyaW5nLCBudW1Ub1NwbGl0RnJvbUVuZCA9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRleHQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0ZXh0W2ldID09IHNwbGl0Q2hhcikge1xuICAgICAgICAgICAgICAgIG51bVRvU3BsaXRGcm9tRW5kLS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1Ub1NwbGl0RnJvbUVuZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0ZXh0LnN1YnN0cmluZygwLCBpKSwgdGV4dC5zdWJzdHJpbmcoaSArIDEpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdGV4dF07XG4gICAgfVxufVxuXG5cbi8vYnVpbGQgc3BlY2lhbCBjbGFzcyBmb3IgcGFyc2VyIGNvbW1lbnRzIC8qKi8gc28geW91IGJlIGFibGUgdG8gYWRkIFJhem9yIGluc2lkZSBvZiBzdHlsZSBvdCBzY3JpcHQgdGFnXG5cbmludGVyZmFjZSBHbG9iYWxSZXBsYWNlQXJyYXkge1xuICAgIHR5cGU6ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBjbGFzcyBFbmFibGVHbG9iYWxSZXBsYWNlIHtcbiAgICBwcml2YXRlIHNhdmVkQnVpbGREYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXlbXSA9IFtdO1xuICAgIHByaXZhdGUgYnVpbGRDb2RlOiBSZUJ1aWxkQ29kZVN0cmluZztcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIHJlcGxhY2VyOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkZFRleHQgPSBcIlwiKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZXIgPSBSZWdFeHAoYCR7YWRkVGV4dH1cXFxcL1xcXFwqIXN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+XFxcXCpcXFxcL3xzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PmApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoY29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYnVpbGRDb2RlID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKGF3YWl0IFBhcnNlVGV4dFN0cmVhbShhd2FpdCB0aGlzLkV4dHJhY3RBbmRTYXZlQ29kZShjb2RlKSkpO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvZGUgPSBuZXcgSlNQYXJzZXIoY29kZSwgdGhpcy5wYXRoKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvZGUuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvZGUudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVkQnVpbGREYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkudGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gYHN5c3RlbS0tPHxlanN8JHtjb3VudGVyKyt9fD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBQYXJzZU91dHNpZGVPZkNvbW1lbnQodGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlcigvc3lzdGVtLS08XFx8ZWpzXFx8KFswLTldKVxcfD4vLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gU3BsaXRUb1JlcGxhY2VbMV07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoaW5kZXguU3RhcnRJbmZvKS5QbHVzJGAke3RoaXMuYWRkVGV4dH0vKiFzeXN0ZW0tLTx8ZWpzfCR7aW5kZXh9fD4qL2A7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBTdGFydEJ1aWxkKCkge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29tbWVudHMgPSBuZXcgSlNQYXJzZXIobmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCksIHRoaXMucGF0aCwgJy8qJywgJyovJyk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb21tZW50cy5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29tbWVudHMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGkudGV4dCA9IHRoaXMuUGFyc2VPdXRzaWRlT2ZDb21tZW50KGkudGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0ID0gZXh0cmFjdENvbW1lbnRzLlJlQnVpbGRUZXh0KCkuZXE7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29kZS5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlc3RvcmVBc0NvZGUoRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihEYXRhLnRleHQuU3RhcnRJbmZvKS5QbHVzJGA8JSR7RGF0YS50eXBlID09ICduby10cmFjaycgPyAnIScgOiAnJ30ke0RhdGEudGV4dH0lPmA7XG4gICAgfVxuXG4gICAgcHVibGljIFJlc3RvcmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZXIodGhpcy5yZXBsYWNlciwgKFNwbGl0VG9SZXBsYWNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihTcGxpdFRvUmVwbGFjZVsxXSA/PyBTcGxpdFRvUmVwbGFjZVsyXSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLlJlc3RvcmVBc0NvZGUodGhpcy5zYXZlZEJ1aWxkRGF0YVtpbmRleF0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwgImltcG9ydCB7IG1pbmlmeSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuL3ByaW50TWVzc2FnZSc7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeUpTKHRleHQ6IHN0cmluZywgdHJhY2tlcjogU3RyaW5nVHJhY2tlcil7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBtaW5pZnkodGV4dCkpLmNvZGVcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodHJhY2tlciwgZXJyKVxuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbn0iLCAiaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU1dDRXJyb3IoZXJyOiB7bWVzc2FnZTogc3RyaW5nLCBzdGFjazogc3RyaW5nLCBjb2RlOiBzdHJpbmd9LCBjaGFuZ2VMb2NhdGlvbnMgPSAobGluZTogbnVtYmVyLCBjaGFyOiBudW1iZXIsIGluZm86IHN0cmluZykgPT4ge3JldHVybiB7bGluZSwgY2hhciwgaW5mb319KXtcbiAgICBjb25zdCBzcGxpdERhdGE6c3RyaW5nW10gPSBlcnIuc3RhY2sudHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBlcnJvckZpbGVBc0luZGV4ID0gc3BsaXREYXRhLnJldmVyc2UoKS5maW5kSW5kZXgoKHg6c3RyaW5nKSA9PiB4LmluY2x1ZGVzKCcvLyEnKSlcblxuICAgIGlmKGVycm9yRmlsZUFzSW5kZXggPT0gLTEpe1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgvKDtbMC05XW0pKC4qPylcXFswbTooWzAtOV0rKTooWzAtOV0rKVxcXS8sIChfLCBzdGFydCwgZmlsZSwgZzEsIGcyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBjaGFuZ2VMb2NhdGlvbnMoTnVtYmVyKGcxKSwgTnVtYmVyKGcyKSwgZmlsZSlcbiAgICAgICAgICAgIHJldHVybiBgJHtzdGFydH0ke2luZm99OiR7bGluZX06JHtjaGFyfV1gXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogZXJyLmNvZGUsXG4gICAgICAgICAgICBlcnJvckxpbmVzOiBzcGxpdERhdGFbMF0sXG4gICAgICAgICAgICBlcnJvckZpbGU6IHNwbGl0RGF0YVswXSxcbiAgICAgICAgICAgIHNpbXBsZU1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICBmdWxsTWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JGaWxlID0gc3BsaXREYXRhW2Vycm9yRmlsZUFzSW5kZXhdLnNwbGl0KCcvLyEnKS5wb3AoKVxuICAgIGNvbnN0IGVycm9yTGluZXMgPSBzcGxpdERhdGEuc2xpY2Uoc3BsaXREYXRhLmxlbmd0aCAtIGVycm9yRmlsZUFzSW5kZXgsIC0gMykubWFwKHggPT4gIHguc3Vic3RyaW5nKHguaW5kZXhPZignXHUyNTAyJykrMSkpLmpvaW4oJ1xcbicpO1xuXG4gICAgbGV0IGVycm9yQ29kZTpzdHJpbmcgPSBzcGxpdERhdGEuYXQoLTIpO1xuICAgIGVycm9yQ29kZSA9IGVycm9yQ29kZS5zdWJzdHJpbmcoZXJyb3JDb2RlLmluZGV4T2YoJ2AnKSkuc3BsaXQoJ1swbScpLnNoaWZ0KCkudHJpbSgpO1xuXG4gICAgY29uc3QgZGF0YUVycm9yID0ge1xuICAgICAgICBnZXQgc2ltcGxlTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5lcnJvckNvZGV9LCBvbiBmaWxlIC0+PGNvbG9yPlxcbiR7ZGF0YUVycm9yLmVycm9yRmlsZX1gXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmdWxsTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5zaW1wbGVNZXNzYWdlfVxcbkxpbmVzOiAke2RhdGFFcnJvci5lcnJvckxpbmVzfWBcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JGaWxlLFxuICAgICAgICBlcnJvckxpbmVzLFxuICAgICAgICBlcnJvckNvZGVcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFFcnJvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCBwYXJzZUVycm9yID0gcGFyc2VTV0NFcnJvcihlcnIpO1xuICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICB0ZXh0OiBwYXJzZUVycm9yLmZ1bGxNZXNzYWdlXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgcmV0dXJuIHBhcnNlRXJyb3I7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnI6IGFueSwgc291cmNlTWFwOiBSYXdTb3VyY2VNYXAsIHNvdXJjZUZpbGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIFxuICAgIGNvbnN0IHBhcnNlRXJyb3IgPSBwYXJzZVNXQ0Vycm9yKGVyciwgKGxpbmUsIGNvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmUsIGNvbHVtbn0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lOiBwb3NpdGlvbi5saW5lLFxuICAgICAgICAgICAgY2hhcjogcG9zaXRpb24uY29sdW1uLFxuICAgICAgICAgICAgaW5mbzogc291cmNlRmlsZSA/PyBwb3NpdGlvbi5zb3VyY2VcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgIHRleHQ6IHBhcnNlRXJyb3IuZnVsbE1lc3NhZ2VcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICByZXR1cm4gcGFyc2VFcnJvcjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIGVycjogYW55KSB7XG5cbiAgICBjb25zdCBwYXJzZUVycm9yID0gcGFyc2VTV0NFcnJvcihlcnIsIChsaW5lLCBjb2x1bW4sIGluZm8pID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBiYXNlLm9yaWdpbmFsUG9zaXRpb25Gb3IobGluZSwgY29sdW1uKVxuICAgICAgICByZXR1cm4gPGFueT57XG4gICAgICAgICAgICAuLi5wb3NpdGlvbixcbiAgICAgICAgICAgIGluZm86IHBvc2l0aW9uLnNlYXJjaExpbmUuZXh0cmFjdEluZm8oKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgdGV4dDogcGFyc2VFcnJvci5mdWxsTWVzc2FnZVxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIHJldHVybiBwYXJzZUVycm9yO1xufVxuXG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBtaW5pZnlKUyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvbWluaWZ5JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgcGFyYW1zOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBzZWxlY3Rvcjogc3RyaW5nLCBtYWluQ29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBKU1BhcnNlci5SdW5BbmRFeHBvcnQobWFpbkNvZGUsIHBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkIGBmdW5jdGlvbiAke25hbWV9KHske3BhcmFtc319LCBzZWxlY3RvciR7c2VsZWN0b3IgPyBgID0gXCIke3NlbGVjdG9yfVwiYDogJyd9LCBvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30pe1xuICAgICAgICBjb25zdCB7d3JpdGUsIHdyaXRlU2FmZSwgc2V0UmVzcG9uc2UsIHNlbmRUb1NlbGVjdG9yfSA9IG5ldyBidWlsZFRlbXBsYXRlKG91dF9ydW5fc2NyaXB0KTtcbiAgICAgICAgJHthd2FpdCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUocGFyc2UpfVxuICAgICAgICB2YXIgZXhwb3J0cyA9ICR7bmFtZX0uZXhwb3J0cztcbiAgICAgICAgcmV0dXJuIHNlbmRUb1NlbGVjdG9yKHNlbGVjdG9yLCBvdXRfcnVuX3NjcmlwdC50ZXh0KTtcbiAgICB9XFxuJHtuYW1lfS5leHBvcnRzID0ge307YFxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHthc3luYzogbnVsbH0pO1xuXG4gICAgbGV0IHNjcmlwdEluZm8gPSBhd2FpdCB0ZW1wbGF0ZShcbiAgICAgICAgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMsXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcignbmFtZScsICdjb25uZWN0JyksXG4gICAgICAgIGRhdGFUYWcucG9wQW55VHJhY2tlcigncGFyYW1zJywgJycpLFxuICAgICAgICBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3NlbGVjdG9yJywgJycpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBtYXAgPSB0eXBlb2Ygc291cmNlTWFwID09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShzb3VyY2VNYXApOiBzb3VyY2VNYXA7XG5cbiAgICBjb25zdCB0cmFja0NvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICBjb25zdCBzcGxpdExpbmVzID0gdHJhY2tDb2RlLnNwbGl0KCdcXG4nKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBpc01hcCA9IHNwbGl0TGluZXNbbS5nZW5lcmF0ZWRMaW5lIC0gMV07XG4gICAgICAgIGlmICghaXNNYXApIHJldHVybjtcblxuXG4gICAgICAgIGxldCBjaGFyQ291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaXNNYXAuc3Vic3RyaW5nKG0uZ2VuZXJhdGVkQ29sdW1uID8gbS5nZW5lcmF0ZWRDb2x1bW4gLSAxOiAwKS5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICAgICAgaS5pbmZvID0gbS5zb3VyY2U7XG4gICAgICAgICAgICBpLmxpbmUgPSBtLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAgIGkuY2hhciA9IGNoYXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2tDb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ICA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgaXRlbS5pbmZvID0gaW5mbztcbiAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYWNrVG9PcmlnaW5hbChvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG5ld1RyYWNrZXIgPSBhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZSwgc291cmNlTWFwKTtcbiAgICBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyKTtcbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlciwgbXlTb3VyY2U6IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBpZihpdGVtLmluZm8gPT0gbXlTb3VyY2Upe1xuICAgICAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXS5hdChpdGVtLmNoYXItMSk/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW0uaW5mbykge1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKGl0ZW0uaW5mbykpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsU3NzKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyLCBteVNvdXJjZSk7XG5cbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0sIEpzY0NvbmZpZyB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlJztcbmltcG9ydCB7IENvbW1vbmpzLCBEZWNvcmF0b3JzLCBlc1RhcmdldCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJhbnNwaWxlcldpdGhPcHRpb25zKEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBsYW5ndWFnZTogc3RyaW5nLCBzb3VyY2VNYXBzOiBib29sZWFuLCBCZXR3ZWVuVGFnRGF0YVN0cmluZyA9IEJldHdlZW5UYWdEYXRhLmVxLCBvcHRpb25zPzogSnNjQ29uZmlnKSB7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAgICAgIGZpbGVuYW1lOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlTWFwcyxcbiAgICAgICAganNjOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IGVzVGFyZ2V0LFxuICAgICAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgICB9LFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgRGVjb3JhdG9ycyhBZGRPcHRpb25zLmpzYykucGFyc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICBzeW50YXg6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwiVFNPcHRpb25zXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMuanNjLnBhcnNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3ludGF4OiAnZWNtYXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgICAgIGpzeDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgICAgICBEZWNvcmF0b3JzKEFkZE9wdGlvbnMuanNjKS5wYXJzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ2VjbWFzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICBqc3g6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcIlRTWE9wdGlvbnNcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IG1hcCwgY29kZSB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhU3RyaW5nLCBBZGRPcHRpb25zKTtcblxuICAgICAgICByZXN1bHRDb2RlID0gY29kZTtcbiAgICAgICAgcmVzdWx0TWFwID0gbWFwO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cbiAgICByZXR1cm4geyByZXN1bHRDb2RlLCByZXN1bHRNYXAgfVxufSIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSwgSnNjQ29uZmlnIH0gZnJvbSAnQHN3Yy9jb3JlJztcblxuXG5leHBvcnQgY29uc3QgZXNUYXJnZXQgPSAnZXMyMDIyJztcblxuZXhwb3J0IGZ1bmN0aW9uIERlY29yYXRvcnMoZGF0YTogSnNjQ29uZmlnKXtcbiAgICBkYXRhLnRyYW5zZm9ybSA9IHtcbiAgICAgICAgbGVnYWN5RGVjb3JhdG9yOiB0cnVlLFxuICAgICAgICBkZWNvcmF0b3JNZXRhZGF0YTogdHJ1ZVxuICAgIH1cbiAgICBkYXRhLnBhcnNlci5kZWNvcmF0b3JzID0gdHJ1ZVxuICAgIHJldHVybiBkYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFuc2Zvcm1KU0MoZGF0YT86IEpzY0NvbmZpZyk6IEpzY0NvbmZpZ3tcbiAgICByZXR1cm4gRGVjb3JhdG9ycyh7XG4gICAgICAgIHRhcmdldDogZXNUYXJnZXQsXG4gICAgICAgIC4uLmRhdGFcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tbW9uanMoZGF0YTogVHJhbnNmb3JtT3B0aW9ucyl7XG4gICAgZGF0YS5tb2R1bGUgPSB7XG4gICAgICAgIHR5cGU6ICdjb21tb25qcycsXG4gICAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgICAgIHN0cmljdE1vZGU6IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgdHJhbnNwaWxlcldpdGhPcHRpb25zIH0gZnJvbSAnLi9sb2FkLW9wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IHtyZXN1bHRDb2RlLCByZXN1bHRNYXB9ID0gYXdhaXQgdHJhbnNwaWxlcldpdGhPcHRpb25zKEJldHdlZW5UYWdEYXRhLCBsYW5ndWFnZSwgZmFsc2UsIEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCB7cHJlc2VydmVBbGxDb21tZW50czogdHJ1ZX0pXG4gICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihyZXN1bHRDb2RlLCByZXN1bHRNYXApKTtcbiBcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgdHJhbnNwaWxlcldpdGhPcHRpb25zIH0gZnJvbSAnLi9sb2FkLW9wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFcSA9IEJldHdlZW5UYWdEYXRhLmVxLCBCZXR3ZWVuVGFnRGF0YUVxQXNUcmltID0gQmV0d2VlblRhZ0RhdGFFcS50cmltKCksIGlzTW9kZWwgPSB0YWdEYXRhLnBvcFN0cmluZygndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBjb25zdCB7cmVzdWx0Q29kZSwgcmVzdWx0TWFwfSA9IGF3YWl0IHRyYW5zcGlsZXJXaXRoT3B0aW9ucyhCZXR3ZWVuVGFnRGF0YSwgbGFuZ3VhZ2UsIHNlc3Npb25JbmZvLmRlYnVnKVxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZShpc01vZGVsID8gJ21vZHVsZScgOiAnc2NyaXB0JywgdGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdE1hcCkge1xuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoSlNPTi5wYXJzZShyZXN1bHRNYXApLCBCZXR3ZWVuVGFnRGF0YSwgcmVzdWx0Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFRleHQocmVzdWx0Q29kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBpZiAoZGF0YVRhZy5leGlzdHMoJ3NyYycpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke0JldHdlZW5UYWdEYXRhfTwvc2NyaXB0PmBcbiAgICAgICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnanMnKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKSB7XG4gICAgICAgIHJldHVybiBzY3JpcHRXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JpcHRXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdIDogZ2V0VHlwZXMubm9kZV9tb2R1bGVzWzBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKHVybCwgcGF0aFRvRmlsZVVSTChvcmlnaW5hbFBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFsnc2NzcycsICdzYXNzJ10uaW5jbHVkZXMobGFuZ3VhZ2UpID8gU29tZVBsdWdpbnMoXCJNaW5BbGxcIiwgXCJNaW5TYXNzXCIpIDogU29tZVBsdWdpbnMoXCJNaW5Dc3NcIiwgXCJNaW5BbGxcIikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3R5bGUobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPjxjb2xvcj4ke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCAgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzdHlsZScsIGRhdGFUYWcsICBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0Py5zb3VyY2VNYXApXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihTb3VyY2VNYXBTdG9yZS5maXhVUkxTb3VyY2VNYXAoPGFueT5yZXN1bHQuc291cmNlTWFwKSwgQmV0d2VlblRhZ0RhdGEsIG91dFN0eWxlKTtcbiAgICBlbHNlXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB7IHRleHQ6IG91dFN0eWxlIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc3R5bGVXaXRoU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzdHlsZVdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbGFuZycsICdjc3MnKTtcblxuICAgIGlmKGRhdGFUYWcucG9wQm9vbGVhbignc2VydmVyJykpe1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0xvZ2dlcic7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IHBhdGhfbm9kZS5qb2luKHNtYWxsUGF0aCwgJy8uLi8nLCBpbnB1dFBhdGgpO1xuICAgIH1cblxuICAgIGlmICghcGF0aF9ub2RlLmV4dG5hbWUoaW5wdXRQYXRoKSlcbiAgICAgICAgaW5wdXRQYXRoICs9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7IENvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkIH0gfSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdChcImZyb21cIik7XG5cbiAgICBjb25zdCBpblN0YXRpYyA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHNtYWxsUGF0aFRvUGFnZSh0eXBlLmV4dHJhY3RJbmZvKCkpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWMsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogPGNvbG9yPiR7dHlwZS5hdCgwKS5saW5lSW5mb30gLT4gJHtGdWxsUGF0aH1gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAncGFnZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgSlNQYXJzZXIucHJpbnRFcnJvcihgUGFnZSBub3QgZm91bmQ6ICR7QmFzaWNTZXR0aW5ncy5yZWxhdGl2ZSh0eXBlLmxpbmVJbmZvKX0gLT4gJHtTbWFsbFBhdGh9YCkpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtpblN0YXRpY107XG4gICAgaWYgKCFoYXZlQ2FjaGUgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKG51bGwsIGhhdmVDYWNoZS5uZXdTZXNzaW9uLmRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvOiBuZXdTZXNzaW9uIH0gPSBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShpblN0YXRpYywgZ2V0VHlwZXMuU3RhdGljLCB7IG5lc3RlZFBhZ2U6IHBhdGhOYW1lLCBuZXN0ZWRQYWdlRGF0YTogZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb2JqZWN0JykgfSk7XG4gICAgICAgIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzW1NtYWxsUGF0aF0gPSBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcy50aGlzUGFnZTtcbiAgICAgICAgZGVsZXRlIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBjYWNoZU1hcFtpblN0YXRpY10gPSB7IENvbXBpbGVkRGF0YTogPFN0cmluZ1RyYWNrZXI+Q29tcGlsZWREYXRhLCBuZXdTZXNzaW9uIH07XG4gICAgICAgIFJldHVybkRhdGEgPSA8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW2luU3RhdGljXTtcblxuICAgICAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMpO1xuICAgICAgICBzZXNzaW9uSW5mby5leHRlbmRzKG5ld1Nlc3Npb24pXG5cbiAgICAgICAgUmV0dXJuRGF0YSA9IENvbXBpbGVkRGF0YTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogUmV0dXJuRGF0YVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuL0Vhc3lGc1wiO1xuXG4vKiBJdCdzIGEgSlNPTiBmaWxlIG1hbmFnZXIgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlSlNPTiB7XG4gICAgcHJpdmF0ZSBzYXZlUGF0aDogc3RyaW5nO1xuICAgIHN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGF1dG9Mb2FkID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNhdmVQYXRoID0gYCR7U3lzdGVtRGF0YX0vJHtmaWxlUGF0aH0uanNvbmA7XG4gICAgICAgIGF1dG9Mb2FkICYmIHRoaXMubG9hZEZpbGUoKTtcblxuICAgICAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcHJvY2Vzcy5leGl0KCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkRmlsZSgpIHtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuc2F2ZVBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IEpTT04ucGFyc2UoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMuc2F2ZVBhdGgpIHx8ICd7fScpO1xuICAgIH1cblxuICAgIHVwZGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUga2V5IGlzIGluIHRoZSBzdG9yZSwgcmV0dXJuIHRoZSB2YWx1ZS4gSWYgbm90LCBjcmVhdGUgYSBuZXcgdmFsdWUsIHN0b3JlIGl0LCBhbmQgcmV0dXJuIGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gbG9vayB1cCBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIFtjcmVhdGVdIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdHJpbmcuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIG9mIHRoZSBrZXkgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIGhhdmUoa2V5OiBzdHJpbmcsIGNyZWF0ZT86ICgpID0+IHN0cmluZykge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RvcmVba2V5XTtcbiAgICAgICAgaWYgKGl0ZW0gfHwgIWNyZWF0ZSkgcmV0dXJuIGl0ZW07XG5cbiAgICAgICAgaXRlbSA9IGNyZWF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZShrZXksIGl0ZW0pO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdGhpcy5zdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVtpXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbaV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmUoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZSh0aGlzLnNhdmVQYXRoLCB0aGlzLnN0b3JlKTtcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4vU3RvcmVKU09OXCI7XG5cbmV4cG9ydCBjb25zdCBwYWdlRGVwcyA9IG5ldyBTdG9yZUpTT04oJ1BhZ2VzSW5mbycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYW55IG9mIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhlIHBhZ2UgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtTdHJpbmdOdW1iZXJNYXB9IGRlcGVuZGVuY2llcyAtIEEgbWFwIG9mIGRlcGVuZGVuY2llcy4gVGhlIGtleSBpcyB0aGUgcGF0aCB0byB0aGUgZmlsZSwgYW5kXG4gKiB0aGUgdmFsdWUgaXMgdGhlIGxhc3QgbW9kaWZpZWQgdGltZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOnN0cmluZywgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSBwYWdlRGVwcy5zdG9yZVtwYXRoXSkge1xuICAgIGZvciAoY29uc3QgaSBpbiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCAgKyAgKGkgPT0gJ3RoaXNQYWdlJyA/IHBhdGg6IGkpO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gZGVwZW5kZW5jaWVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gIWRlcGVuZGVuY2llcztcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcik6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvKTtcblxuICAgIGNvbXBpbGVkU3RyaW5nLlBsdXMkIGA8JXslPiR7QmV0d2VlblRhZ0RhdGF9PCV9JT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCByZWdpc3RlckV4dGVuc2lvbiBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3Nzcic7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlLCB7ICB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2FwaXRhbGl6ZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvcHJlcHJvY2Vzcyc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IEpTT041IGZyb20gJ2pzb241J1xuXG5hc3luYyBmdW5jdGlvbiBzc3JIVE1MKGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBnZXRWID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBndiA9IChuYW1lOiBzdHJpbmcpID0+IGRhdGFUYWcucG9wQW55RGVmYXVsdChuYW1lLCcnKS50cmltKCksXG4gICAgICAgICAgICB2YWx1ZSA9IGd2KCdzc3InICsgQ2FwaXRhbGl6ZShuYW1lKSkgfHwgZ3YobmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gSlNPTjUucGFyc2UoYHske3ZhbHVlfX1gKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgYnVpbGRQYXRoID0gYXdhaXQgcmVnaXN0ZXJFeHRlbnNpb24oRnVsbFBhdGgsIHNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoYnVpbGRQYXRoKTtcblxuICAgIGNvbnN0IHsgaHRtbCwgaGVhZCB9ID0gbW9kZS5kZWZhdWx0LnJlbmRlcihnZXRWKCdwcm9wcycpLCBnZXRWKCdvcHRpb25zJykpO1xuICAgIHNlc3Npb25JbmZvLmhlYWRIVE1MICs9IGhlYWQ7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ2Zyb20nKSwgZ2V0VHlwZXMuU3RhdGljWzJdLCAnc3ZlbHRlJyk7XG4gICAgY29uc3QgaW5XZWJQYXRoID0gcmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBTbWFsbFBhdGgpLnJlcGxhY2UoL1xcXFwvZ2ksICcvJyk7XG5cbiAgICBzZXNzaW9uSW5mby5zdHlsZSgnLycgKyBpbldlYlBhdGggKyAnLmNzcycpO1xuXG4gICAgY29uc3QgaWQgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2lkJywgQmFzZTY0SWQoaW5XZWJQYXRoKSksXG4gICAgICAgIGhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdChuYW1lLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gYCwke25hbWV9Onske3ZhbHVlfX1gIDogJyc7XG4gICAgICAgIH0sIHNlbGVjdG9yID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VsZWN0b3InKTtcblxuICAgIGNvbnN0IHNzciA9ICFzZWxlY3RvciAmJiBkYXRhVGFnLnBvcEJvb2xlYW4oJ3NzcicpID8gYXdhaXQgc3NySFRNTChkYXRhVGFnLCBGdWxsUGF0aCwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbykgOiAnJztcblxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdtb2R1bGUnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KFxuYGltcG9ydCBBcHAke2lkfSBmcm9tICcvJHtpbldlYlBhdGh9JztcbmNvbnN0IHRhcmdldCR7aWR9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiR7c2VsZWN0b3IgPyBzZWxlY3RvciA6ICcjJyArIGlkfVwiKTtcbnRhcmdldCR7aWR9ICYmIG5ldyBBcHAke2lkfSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQke2lkfVxuICAgICR7aGF2ZSgncHJvcHMnKSArIGhhdmUoJ29wdGlvbnMnKX0ke3NzciA/ICcsIGh5ZHJhdGU6IHRydWUnIDogJyd9XG59KTtgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBzZWxlY3RvciA/ICcnIDogYDxkaXYgaWQ9XCIke2lkfVwiPiR7c3NyfTwvZGl2PmApLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJZCh0ZXh0OiBzdHJpbmcsIG1heCA9IDEwKXtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odGV4dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnN1YnN0cmluZygwLCBtYXgpLnJlcGxhY2UoL1xcKy8sICdfJykucmVwbGFjZSgvXFwvLywgJ18nKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgIHsgQ2FwaXRhbGl6ZSwgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgQ29tcGlsZU9wdGlvbnMgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGNsZWFyTW9kdWxlLCByZXNvbHZlIH0gZnJvbSBcIi4uLy4uL3JlZGlyZWN0Q0pTXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFwiO1xuaW1wb3J0IHsgUHJpbnRTdmVsdGVXYXJuIH0gZnJvbSBcIi4vZXJyb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJFeHRlbnNpb24oZmlsZVBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBuYW1lID0gcGF0aC5wYXJzZShmaWxlUGF0aCkubmFtZS5yZXBsYWNlKC9eXFxkLywgJ18kJicpLnJlcGxhY2UoL1teYS16QS1aMC05XyRdL2csICcnKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IENvbXBpbGVPcHRpb25zID0ge1xuICAgICAgICBmaWxlbmFtZTogZmlsZVBhdGgsXG4gICAgICAgIG5hbWU6IENhcGl0YWxpemUobmFtZSksXG4gICAgICAgIGdlbmVyYXRlOiAnc3NyJyxcbiAgICAgICAgZm9ybWF0OiAnY2pzJyxcbiAgICAgICAgZGV2OiBzZXNzaW9uSW5mby5kZWJ1ZyxcbiAgICAgICAgZXJyb3JNb2RlOiAnd2FybidcbiAgICB9O1xuXG4gICAgY29uc3QgaW5TdGF0aWNGaWxlID0gcGF0aC5yZWxhdGl2ZShnZXRUeXBlcy5TdGF0aWNbMl0sIHNtYWxsUGF0aCk7XG4gICAgY29uc3QgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNGaWxlO1xuXG4gICAgY29uc3QgZnVsbEltcG9ydFBhdGggPSBmdWxsQ29tcGlsZVBhdGggKyAnLnNzci5janMnO1xuICAgIGNvbnN0IHtzdmVsdGVGaWxlcywgY29kZSwgbWFwLCBkZXBlbmRlbmNpZXN9ID0gYXdhaXQgcHJlcHJvY2VzcyhmaWxlUGF0aCwgc21hbGxQYXRoLGZ1bGxJbXBvcnRQYXRoLGZhbHNlLCcuc3NyLmNqcycpO1xuICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLGRlcGVuZGVuY2llcyk7XG4gICAgb3B0aW9ucy5zb3VyY2VtYXAgPSBtYXA7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgIGZvcihjb25zdCBmaWxlIG9mIHN2ZWx0ZUZpbGVzKXtcbiAgICAgICAgY2xlYXJNb2R1bGUocmVzb2x2ZShmaWxlKSk7IC8vIGRlbGV0ZSBvbGQgaW1wb3J0c1xuICAgICAgICBwcm9taXNlcy5wdXNoKHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGUsIEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZmlsZSksIHNlc3Npb25JbmZvKSlcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgY29uc3QgeyBqcywgY3NzLCB3YXJuaW5ncyB9ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwgPGFueT5vcHRpb25zKTtcbiAgICBQcmludFN2ZWx0ZVdhcm4od2FybmluZ3MsIGZpbGVQYXRoLCBtYXApO1xuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsSW1wb3J0UGF0aCwganMuY29kZSk7XG5cbiAgICBpZiAoY3NzLmNvZGUpIHtcbiAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gJy8nICsgaW5TdGF0aWNGaWxlLnNwbGl0KC9cXC98XFwvLykucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAgY3NzLmNvZGUgKz0gdG9VUkxDb21tZW50KGNzcy5tYXAsIHRydWUpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5jc3MnLCBjc3MuY29kZSA/PyAnJyk7XG5cbiAgICByZXR1cm4gZnVsbEltcG9ydFBhdGg7XG59XG4iLCAiaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGNyZWF0ZUltcG9ydGVyLCBQcmludFNhc3NFcnJvclRyYWNrZXIsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsLCBiYWNrVG9PcmlnaW5hbFNzcyB9IGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkJztcbmltcG9ydCB7IFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuXG5hc3luYyBmdW5jdGlvbiBTQVNTU3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY3NzLCBzb3VyY2VNYXAsIGxvYWRlZFVybHMgfSA9IGF3YWl0IHNhc3MuY29tcGlsZVN0cmluZ0FzeW5jKGNvbnRlbnQuZXEsIHtcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCg8YW55PmxhbmcpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZShsYW5nKSxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIHNvdXJjZU1hcDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogYXdhaXQgYmFja1RvT3JpZ2luYWxTc3MoY29udGVudCwgY3NzLDxhbnk+IHNvdXJjZU1hcCwgc291cmNlTWFwLnNvdXJjZXMuZmluZCh4ID0+IHguc3RhcnRzV2l0aCgnZGF0YTonKSkpLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBsb2FkZWRVcmxzLm1hcCh4ID0+IGZpbGVVUkxUb1BhdGgoPGFueT54KSlcbiAgICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3JUcmFja2VyKGVyciwgY29udGVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU2NyaXB0U3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10sIHN2ZWx0ZUV4dCA9ICcnKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgY29uc3QgbWFwVG9rZW4gPSB7fTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlcigvKChpbXBvcnQoe3xbIF0qXFwoPyl8KChpbXBvcnRbIF0qdHlwZXxpbXBvcnR8ZXhwb3J0KSh7fFsgXSspW1xcV1xcd10rPyh9fFsgXSspZnJvbSkpKH18WyBdKikpKFtcInwnfGBdKShbXFxXXFx3XSs/KVxcOShbIF0qXFwpKT8vbSwgYXJncyA9PiB7XG4gICAgICAgIGlmKGxhbmcgPT0gJ3RzJyAmJiBhcmdzWzVdLmVuZHNXaXRoKCcgdHlwZScpKVxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCBleHQgPSBleHRuYW1lKGFyZ3NbMTBdLmVxKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcnKVxuICAgICAgICAgICAgaWYgKGxhbmcgPT0gJ3RzJylcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcudHMnKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcuanMnKTtcblxuXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBhcmdzWzFdLlBsdXMoYXJnc1s5XSwgYXJnc1sxMF0sIChleHQgPT0gJy5zdmVsdGUnID8gc3ZlbHRlRXh0IDogJycpLCBhcmdzWzldLCAoYXJnc1sxMV0gPz8gJycpKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcuc3ZlbHRlJykge1xuICAgICAgICAgICAgY29ubmVjdFN2ZWx0ZS5wdXNoKGFyZ3NbMTBdLmVxKTtcbiAgICAgICAgfSBlbHNlIGlmIChsYW5nICE9PSAndHMnIHx8ICFhcmdzWzRdKVxuICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG5cbiAgICAgICAgY29uc3QgaWQgPSB1dWlkKCk7XG4gICAgICAgIG1hcFRva2VuW2lkXSA9IG5ld0RhdGE7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBfX190b0tlblxcYCR7aWR9XFxgYCk7XG4gICAgfSk7XG5cbiAgICBpZiAobGFuZyAhPT0gJ3RzJylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gKGF3YWl0IHRyYW5zZm9ybShjb250ZW50LmVxLCB7IFxuICAgICAgICAgICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgICAgICAgICAgIHBhcnNlcjoge1xuICAgICAgICAgICAgICAgICAgICBzeW50YXg6ICd0eXBlc2NyaXB0J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc291cmNlTWFwczogdHJ1ZSxcbiAgICAgICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIFxuICAgIH0pKTtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IGJhY2tUb09yaWdpbmFsKGNvbnRlbnQsIGNvZGUsIG1hcCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihjb250ZW50LCBlcnIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgIH1cblxuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC9fX190b0tlbmAoW1xcd1xcV10rPylgL21pLCBhcmdzID0+IHtcbiAgICAgICAgcmV0dXJuIG1hcFRva2VuW2FyZ3NbMV0uZXFdID8/IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250ZW50O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcHJvY2VzcyhmdWxsUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2F2ZVBhdGggPSBzbWFsbFBhdGgsIGh0dHBTb3VyY2UgPSB0cnVlLCBzdmVsdGVFeHQgPSAnJykgeyAgICBcbiAgICBsZXQgdGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKHNtYWxsUGF0aCwgYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSk7XG5cbiAgICBsZXQgc2NyaXB0TGFuZyA9ICdqcycsIHN0eWxlTGFuZyA9ICdjc3MnO1xuXG4gICAgY29uc3QgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10gPSBbXSwgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c2NyaXB0KVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+XFxuPykoLio/KShcXG4/PFxcL3NjcmlwdD4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzY3JpcHRMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2pzJztcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBhd2FpdCBTY3JpcHRTdmVsdGUoYXJnc1s3XSwgc2NyaXB0TGFuZywgY29ubmVjdFN2ZWx0ZSwgc3ZlbHRlRXh0KSwgYXJnc1s4XSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHlsZUNvZGUgPSBjb25uZWN0U3ZlbHRlLm1hcCh4ID0+IGBAaW1wb3J0IFwiJHt4fS5jc3NcIjtgKS5qb2luKCcnKTtcbiAgICBsZXQgaGFkU3R5bGUgPSBmYWxzZTtcbiAgICB0ZXh0ID0gYXdhaXQgdGV4dC5yZXBsYWNlckFzeW5jKC8oPHN0eWxlKVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+XFxuPykoLio/KShcXG4/PFxcL3N0eWxlPikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHN0eWxlTGFuZyA9IGFyZ3NbNF0/LmVxID8/ICdjc3MnO1xuICAgICAgICBpZihzdHlsZUxhbmcgPT0gJ2NzcycpIHJldHVybiBhcmdzWzBdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXM6IGRlcHMgfSA9IGF3YWl0IFNBU1NTdmVsdGUoYXJnc1s3XSwgc3R5bGVMYW5nLCBmdWxsUGF0aCk7XG4gICAgICAgIGRlcHMgJiYgZGVwZW5kZW5jaWVzLnB1c2goLi4uZGVwcyk7XG4gICAgICAgIGhhZFN0eWxlID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVDb2RlICYmIGNvZGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soc3R5bGVDb2RlKTtcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBjb2RlLCBhcmdzWzhdKTs7XG4gICAgfSk7XG5cbiAgICBpZiAoIWhhZFN0eWxlICYmIHN0eWxlQ29kZSkge1xuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYDxzdHlsZT4ke3N0eWxlQ29kZX08L3N0eWxlPmApO1xuICAgIH1cblxuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBuZXcgU2Vzc2lvbkJ1aWxkKHNtYWxsUGF0aCwgZnVsbFBhdGgpLCBwcm9taXNlcyA9IFtzZXNzaW9uSW5mby5kZXBlbmRlbmNlKHNtYWxsUGF0aCwgZnVsbFBhdGgpXTtcblxuICAgIGZvciAoY29uc3QgZnVsbCBvZiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZnVsbCksIGZ1bGwpKTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7IHNjcmlwdExhbmcsIHN0eWxlTGFuZywgY29kZTogdGV4dC5lcSwgbWFwOiB0ZXh0LlN0cmluZ1RhY2soc2F2ZVBhdGgsIGh0dHBTb3VyY2UpLCBkZXBlbmRlbmNpZXM6IHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgc3ZlbHRlRmlsZXM6IGNvbm5lY3RTdmVsdGUubWFwKHggPT4geFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gKyB4IDogcGF0aC5ub3JtYWxpemUoZnVsbFBhdGggKyAnLy4uLycgKyB4KSkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcGl0YWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVbMF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59XG5cbiIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCB9IGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uL3RyYW5zcGlsZXIvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi9KU1BhcnNlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9TZXNzaW9uJztcbmltcG9ydCBFYXN5U3ludGF4IGZyb20gJy4vRWFzeVN5bnRheCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgQ29tbW9uanMsIGVzVGFyZ2V0LCBUcmFuc2Zvcm1KU0MgfSBmcm9tICcuLi90cmFuc3BpbGVyL3NldHRpbmdzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aC93aW4zMic7XG5cbmZ1bmN0aW9uIEVycm9yVGVtcGxhdGUoaW5mbzogc3RyaW5nKSB7XG5cbiAgICByZXR1cm4gYG1vZHVsZS5leHBvcnRzID0gKCkgPT4gKERhdGFPYmplY3QpID0+IERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCArPSBcXGAke0pTUGFyc2VyLnByaW50RXJyb3IoYFN5bnRheCBFcnJvcjogJHtpbmZvfX1gKX1cXGBgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0gQ29tbW9uanMoe1xuICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICBwYXJzZXI6IHtcbiAgICAgICAgICAgICAgICBzeW50YXg6IGlzVHlwZXNjcmlwdCA/ICd0eXBlc2NyaXB0JyA6ICdlY21hc2NyaXB0JyxcbiAgICAgICAgICAgICAgICAuLi5HZXRQbHVnaW4oKGlzVHlwZXNjcmlwdCA/ICdUUycgOiAnSlMnKSArIFwiT3B0aW9uc1wiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgZmlsZW5hbWU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgc291cmNlTWFwczogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IHJlc3VsdDogU3RyaW5nVHJhY2tlclxuXG4gICAgY29uc3Qgc2NyaXB0RGVmaW5lID0gYXdhaXQgRWFzeVN5bnRheC5CdWlsZEFuZEV4cG9ydEltcG9ydHModGV4dC5lcSwgeyBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1ZyB9KTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKHNjcmlwdERlZmluZSwgT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCkgOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHBhcnNlLmVycm9yRmlsZSA9ICBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKHBhcnNlLmVycm9yRmlsZSlcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIEVycm9yVGVtcGxhdGUocGFyc2Uuc2ltcGxlTWVzc2FnZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBFYXN5RnMucmVhZEpzb25GaWxlKHBhdGgpO1xufSIsICJpbXBvcnQgeyBwcm9taXNlcyB9IGZyb20gXCJmc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUocGF0aCkpO1xuICAgIGNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG4gICAgcmV0dXJuIHdhc21JbnN0YW5jZS5leHBvcnRzO1xufSIsICJpbXBvcnQganNvbiBmcm9tIFwiLi9qc29uXCI7XG5pbXBvcnQgd2FzbSBmcm9tIFwiLi93YXNtXCI7XG5cbmV4cG9ydCBjb25zdCBjdXN0b21UeXBlcyA9IFtcImpzb25cIiwgXCJ3YXNtXCJdO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBJbXBvcnRCeUV4dGVuc2lvbihwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZyl7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICAgICAgcmV0dXJuIGpzb24ocGF0aClcbiAgICAgICAgY2FzZSBcIndhc21cIjpcbiAgICAgICAgICAgIHJldHVybiB3YXNtKHBhdGgpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGltcG9ydChwYXRoKVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4JztcbmltcG9ydCB7IEJhc2VSZWFkZXIgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBFbmRPZkJsb2NrLCBFbmRPZkRlZlNraXBCbG9jaywgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vRWFzeVNjcmlwdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhc3lTeW50YXgge1xuICAgIHByaXZhdGUgQnVpbGQ6IFJlQnVpbGRDb2RlU3RyaW5nO1xuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFyc2VBcnJheSA9IGF3YWl0IFBhcnNlVGV4dFN0cmVhbShjb2RlKTtcbiAgICAgICAgdGhpcy5CdWlsZCA9IG5ldyBSZUJ1aWxkQ29kZVN0cmluZyhwYXJzZUFycmF5KTtcblxuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsID0gdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0ltcG9ydChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYGNvbnN0ICR7ZGF0YU9iamVjdH0gPSBhd2FpdCAke3JlcGxhY2VUb1R5cGV9KDx8JHtpbmRleH18fD4pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0V4cG9ydChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZSwgZGF0YU9iamVjdCwgaW5kZXgpfTtPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7ZGF0YU9iamVjdH0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0ltcG9ydEFsbChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBhd2FpdCAke3JlcGxhY2VUb1R5cGV9KDx8JHtpbmRleH18fD4pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0V4cG9ydEFsbChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7dGhpcy5hY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZSwgaW5kZXgpfSlgO1xuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbXBvcnRUeXBlKHR5cGU6IHN0cmluZywgcmVwbGFjZVRvVHlwZSA9IHR5cGUsIGFjdGlvblN0cmluZzogKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSA9PiBzdHJpbmcgPSB0aGlzLmFjdGlvblN0cmluZ0ltcG9ydCkge1xuICAgICAgICBsZXQgYmVmb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaChuZXcgUmVnRXhwKGAke3R5cGV9WyBcXFxcbl0rKFtcXFxcKl17MCwxfVtcXFxccHtMfTAtOV8sXFxcXHtcXFxcfSBcXFxcbl0rKVsgXFxcXG5dK2Zyb21bIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+YCwgJ3UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGxldCBEYXRhT2JqZWN0OiBzdHJpbmc7XG5cbiAgICAgICAgICAgIGlmIChkYXRhWzBdID09ICcqJykge1xuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBkYXRhLnN1YnN0cmluZygxKS5yZXBsYWNlKCcgYXMgJywgJycpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgU3BsaWNlZDogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhWzBdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnfScsIDIpO1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkWzBdICs9ICd9JztcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICBTcGxpY2VkWzFdID0gU3BsaWNlZFsxXS5zcGxpdCgnLCcpLnBvcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWQgPSBkYXRhLnNwbGl0KCcsJywgMSkucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFNwbGljZWQgPSBTcGxpY2VkLm1hcCh4ID0+IHgudHJpbSgpKS5maWx0ZXIoeCA9PiB4Lmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZFswXVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbiA9IHRoaXMuQnVpbGQuQWxsSW5wdXRzW21hdGNoWzJdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvbi5zdWJzdHJpbmcoZXh0ZW5zaW9uLmxhc3RJbmRleE9mKCcuJykgKyAxLCBleHRlbnNpb24ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VzdG9tVHlwZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gYHtkZWZhdWx0OiR7U3BsaWNlZFswXX19YDsgLy9vbmx5IGlmIHRoaXMgaXNuJ3QgY3VzdG9tIGltcG9ydFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcblxuICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gYCR7RGF0YU9iamVjdC5zdWJzdHJpbmcoMCwgRGF0YU9iamVjdC5sZW5ndGggLSAxKX0sZGVmYXVsdDoke1NwbGljZWRbMV19fWA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IERhdGFPYmplY3QucmVwbGFjZSgvIGFzIC8sICc6Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBhY3Rpb25TdHJpbmcocmVwbGFjZVRvVHlwZSwgRGF0YU9iamVjdCwgbWF0Y2hbMl0pO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nO1xuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGJlZm9yZVN0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW5PbmVXb3JkKHR5cGU6IHN0cmluZywgcmVwbGFjZVRvVHlwZSA9IHR5cGUsIGFjdGlvblN0cmluZzogKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnRBbGwpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cCh0eXBlICsgJ1sgXFxcXG5dKzxcXFxcfChbMC05XSspXFxcXHxcXFxcfD4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIG1hdGNoWzFdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBsYWNlV2l0aFNwYWNlKGZ1bmM6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBmdW5jKCcgJyArIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCkuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgRGVmaW5lKGRhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZVdpdGhTcGFjZSh0ZXh0ID0+IHRleHQucmVwbGFjZShuZXcgUmVnRXhwKGAoW15cXFxccHtMfV0pJHtrZXl9KFteXFxcXHB7TH1dKWAsICdndWknKSwgKC4uLm1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdICsgdmFsdWUgKyBtYXRjaFsyXVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluQXNGdW5jdGlvbih3b3JkOiBzdHJpbmcsIHRvV29yZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZVdpdGhTcGFjZSh0ZXh0ID0+IHRleHQucmVwbGFjZShuZXcgUmVnRXhwKGAoW15cXFxccHtMfV0pJHt3b3JkfShbIFxcXFxuXSpcXFxcKClgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdICsgdG9Xb3JkICsgbWF0Y2hbMl1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwb3J0VmFyaWFibGUoKXtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaCgvKGV4cG9ydFsgXFxuXSspKHZhcnxsZXR8Y29uc3QpWyBcXG5dKyhbXFxwe0x9XFwkX11bXFxwe0x9MC05XFwkX10qKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGJlZm9yZU1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVFeHBvcnQgPSBtYXRjaFswXS5zdWJzdHJpbmcobWF0Y2hbMV0ubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2xvc2VJbmRleCA9IGF3YWl0IEVuZE9mRGVmU2tpcEJsb2NrKGFmdGVyTWF0Y2gsWyc7JywgJ1xcbiddKTtcblxuICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgY2xvc2VJbmRleCA9IGFmdGVyTWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGJlZm9yZUNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgY2xvc2VJbmRleCksIGFmdGVyQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZyhjbG9zZUluZGV4KTtcblxuICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2ggKyByZW1vdmVFeHBvcnQrIGJlZm9yZUNsb3NlfTtleHBvcnRzLiR7bWF0Y2hbM119PSR7bWF0Y2hbM119JHthZnRlckNsb3NlfWA7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydEJsb2NrKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKShkZWZhdWx0WyBcXG5dKyk/KFteIFxcbl0pL3UpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgbGV0IGJlZm9yZU1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCArIChtYXRjaFsyXSB8fCAnJykubGVuZ3RoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBmaXJzdENoYXIgPSBtYXRjaFszXVswXSwgaXNEZWZhdWx0ID0gQm9vbGVhbihtYXRjaFsyXSk7XG4gICAgICAgICAgICBpZihmaXJzdENoYXI9PSAneycpe1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBhd2FpdCBFbmRPZkJsb2NrKGFmdGVyTWF0Y2gsIFsneycsICd9J10pO1xuICAgICAgICAgICAgICAgICAgICBiZWZvcmVNYXRjaCArPSBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3JlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGVuZEluZGV4KzEpfSlgO1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArIGFmdGVyTWF0Y2guc3Vic3RyaW5nKGVuZEluZGV4KzEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoLTEpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUV4cG9ydCA9IHJlbW92ZUV4cG9ydC5zbGljZSgwLCAtMSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2xvc2VJbmRleCA9IGF3YWl0IEVuZE9mRGVmU2tpcEJsb2NrKGFmdGVyTWF0Y2gsWyc7JywgJ1xcbiddKTtcbiAgICAgICAgICAgICAgICBpZihjbG9zZUluZGV4ID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VJbmRleCA9IGFmdGVyTWF0Y2gudHJpbUVuZCgpLmxlbmd0aFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZUNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgY2xvc2VJbmRleCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2tNYXRjaCA9IGJlZm9yZUNsb3NlLm1hdGNoKC8oZnVuY3Rpb258Y2xhc3MpWyB8XFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKik/L3UpO1xuXG4gICAgICAgICAgICAgICAgaWYoYmxvY2tNYXRjaD8uWzJdKXsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFmdGVyQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZyhjbG9zZUluZGV4KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX1leHBvcnRzLiR7aXNEZWZhdWx0ID8gJ2RlZmF1bHQnOiBibG9ja01hdGNoWzJdfT0ke2Jsb2NrTWF0Y2hbMl19JHthZnRlckNsb3NlfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzRGVmYXVsdCl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgJ2V4cG9ydHMuZGVmYXVsdD0nICsgcmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaH1leHBvcnRzLiR7YmVmb3JlQ2xvc2Uuc3BsaXQoLyB8XFxuLywgMSkucG9wKCl9PSR7cmVtb3ZlRXhwb3J0KyBhZnRlck1hdGNofWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgYXN5bmMgQnVpbGRJbXBvcnRzKGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnZXhwb3J0JywgJ3JlcXVpcmUnLCB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydCk7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnZXhwb3J0JywgJ3JlcXVpcmUnLCB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2luY2x1ZGUnKTtcblxuICAgICAgICB0aGlzLkJ1aWxkSW5Bc0Z1bmN0aW9uKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuXG4gICAgICAgIC8vZXNtIHRvIGNqcyAtIGV4cG9ydFxuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydFZhcmlhYmxlKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZXhwb3J0QmxvY2soKTtcblxuICAgICAgICBkZWZpbmVEYXRhICYmIHRoaXMuRGVmaW5lKGRlZmluZURhdGEpO1xuICAgIH1cblxuICAgIEJ1aWx0U3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5CdWlsZC5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGU6IHN0cmluZywgZGVmaW5lRGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBFYXN5U3ludGF4KCk7XG4gICAgICAgIGF3YWl0IGJ1aWxkZXIubG9hZChgICR7Y29kZX0gYCk7XG4gICAgICAgIGF3YWl0IGJ1aWxkZXIuQnVpbGRJbXBvcnRzKGRlZmluZURhdGEpO1xuXG4gICAgICAgIGNvZGUgPSBidWlsZGVyLkJ1aWx0U3RyaW5nKCk7XG4gICAgICAgIHJldHVybiBjb2RlLnN1YnN0cmluZygxLCBjb2RlLmxlbmd0aCAtIDEpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlSlNPTlwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTWFwLCBTdHJpbmdOdW1iZXJNYXAsICB9IGZyb20gXCIuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgaXNUcyB9IGZyb20gXCIuL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IEJ1aWxkU2NyaXB0IGZyb20gXCIuL3RyYW5zZm9ybS9TY3JpcHRcIjtcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gXCIuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlclwiO1xuXG5cbmV4cG9ydCB0eXBlIHNldERhdGFIVE1MVGFnID0ge1xuICAgIHVybDogc3RyaW5nLFxuICAgIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXBcbn1cblxuZXhwb3J0IHR5cGUgY29ubmVjdG9ySW5mbyA9IHtcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHNlbmRUbzogc3RyaW5nLFxuICAgIHZhbGlkYXRvcjogc3RyaW5nW10sXG4gICAgb3JkZXI/OiBzdHJpbmdbXSxcbiAgICBub3RWYWxpZD86IHN0cmluZyxcbiAgICBtZXNzYWdlPzogc3RyaW5nIHwgYm9vbGVhbixcbiAgICByZXNwb25zZVNhZmU/OiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIGNvbm5lY3RvckFycmF5ID0gY29ubmVjdG9ySW5mb1tdXG5cbmV4cG9ydCB0eXBlIGNhY2hlQ29tcG9uZW50ID0ge1xuICAgIFtrZXk6IHN0cmluZ106IG51bGwgfCB7XG4gICAgICAgIG10aW1lTXM/OiBudW1iZXIsXG4gICAgICAgIHZhbHVlPzogc3RyaW5nXG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBpblRhZ0NhY2hlID0ge1xuICAgIHN0eWxlOiBzdHJpbmdbXVxuICAgIHNjcmlwdDogc3RyaW5nW11cbiAgICBzY3JpcHRNb2R1bGU6IHN0cmluZ1tdXG59XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1Nob3J0U2NyaXB0TmFtZXMnKTtcblxuLyogVGhlIFNlc3Npb25CdWlsZCBjbGFzcyBpcyB1c2VkIHRvIGJ1aWxkIHRoZSBoZWFkIG9mIHRoZSBwYWdlICovXG5leHBvcnQgY2xhc3MgU2Vzc2lvbkJ1aWxkIHtcbiAgICBjb25uZWN0b3JBcnJheTogY29ubmVjdG9yQXJyYXkgPSBbXVxuICAgIHByaXZhdGUgc2NyaXB0VVJMU2V0OiBzZXREYXRhSFRNTFRhZ1tdID0gW11cbiAgICBwcml2YXRlIHN0eWxlVVJMU2V0OiBzZXREYXRhSFRNTFRhZ1tdID0gW11cbiAgICBwcml2YXRlIGluU2NyaXB0U3R5bGU6IHsgdHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHBhdGg6IHN0cmluZywgdmFsdWU6IFNvdXJjZU1hcFN0b3JlIH1bXSA9IFtdXG4gICAgaGVhZEhUTUwgPSAnJ1xuICAgIGNhY2hlOiBpblRhZ0NhY2hlID0ge1xuICAgICAgICBzdHlsZTogW10sXG4gICAgICAgIHNjcmlwdDogW10sXG4gICAgICAgIHNjcmlwdE1vZHVsZTogW11cbiAgICB9XG4gICAgY2FjaGVDb21waWxlU2NyaXB0OiBhbnkgPSB7fVxuICAgIGNhY2hlQ29tcG9uZW50OiBjYWNoZUNvbXBvbmVudCA9IHt9XG4gICAgY29tcGlsZVJ1blRpbWVTdG9yZTogU3RyaW5nQW55TWFwID0ge31cbiAgICBkZXBlbmRlbmNpZXM6IFN0cmluZ051bWJlck1hcCA9IHt9XG4gICAgcmVjb3JkTmFtZXM6IHN0cmluZ1tdID0gW11cblxuICAgIGdldCBzYWZlRGVidWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlYnVnICYmIHRoaXMuX3NhZmVEZWJ1ZztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBmdWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgdHlwZU5hbWU/OiBzdHJpbmcsIHB1YmxpYyBkZWJ1Zz86IGJvb2xlYW4sIHByaXZhdGUgX3NhZmVEZWJ1Zz86IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcyA9IHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBzdHlsZSh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zdHlsZVVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc3R5bGVVUkxTZXQucHVzaCh7IHVybCwgYXR0cmlidXRlcyB9KTtcbiAgICB9XG5cbiAgICBzY3JpcHQodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc2NyaXB0VVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zY3JpcHRVUkxTZXQucHVzaCh7IHVybCwgYXR0cmlidXRlcyB9KTtcbiAgICB9XG5cbiAgICByZWNvcmQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyhuYW1lKSlcbiAgICAgICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBhc3luYyBkZXBlbmRlbmNlKHNtYWxsUGF0aDogc3RyaW5nLCBmdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc21hbGxQYXRoKSB7XG4gICAgICAgIGlmICh0aGlzLmRlcGVuZGVuY2llc1tzbWFsbFBhdGhdKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZURlcCA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3Q7XG4gICAgICAgIGlmIChoYXZlRGVwKSB7XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llc1tzbWFsbFBhdGhdID0gaGF2ZURlcFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRTY3JpcHRTdHlsZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgc21hbGxQYXRoID0gdGhpcy5zbWFsbFBhdGgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmluU2NyaXB0U3R5bGUuZmluZCh4ID0+IHgudHlwZSA9PSB0eXBlICYmIHgucGF0aCA9PSBzbWFsbFBhdGgpO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSB7IHR5cGUsIHBhdGg6IHNtYWxsUGF0aCwgdmFsdWU6IG5ldyBTb3VyY2VNYXBTdG9yZShzbWFsbFBhdGgsIHRoaXMuc2FmZURlYnVnLCB0eXBlID09ICdzdHlsZScsIHRydWUpIH1cbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGEudmFsdWVcbiAgICB9XG5cbiAgICBhZGRTY3JpcHRTdHlsZVBhZ2UodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIGluZm86IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NyaXB0U3R5bGUodHlwZSwgZGF0YVRhZy5wb3BTdHJpbmcoJ3BhZ2UnKSA/IHRoaXMuc21hbGxQYXRoIDogaW5mby5leHRyYWN0SW5mbygpKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZU5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTdGF0aWNGaWxlc0luZm8uc3RvcmUpO1xuICAgICAgICB3aGlsZSAoa2V5ID09IG51bGwgfHwgdmFsdWVzLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIGtleSA9IEJhc2U2NElkKHRleHQsIDUgKyBsZW5ndGgpLnN1YnN0cmluZyhsZW5ndGgpO1xuICAgICAgICAgICAgbGVuZ3RoKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYWRkSGVhZFRhZ3MoKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VMb2cgPSB0aGlzLnR5cGVOYW1lID09IGdldFR5cGVzLkxvZ3NbMl1cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgY29uc3QgaXNMb2cgPSBwYWdlTG9nICYmIGkucGF0aCA9PSB0aGlzLnNtYWxsUGF0aDtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVMb2NhdGlvbiA9IGlzTG9nID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXSwgYWRkUXVlcnkgPSBpc0xvZyA/ICc/dD1sJyA6ICcnO1xuICAgICAgICAgICAgbGV0IHVybCA9IFN0YXRpY0ZpbGVzSW5mby5oYXZlKGkucGF0aCwgKCkgPT4gU2Vzc2lvbkJ1aWxkLmNyZWF0ZU5hbWUoaS5wYXRoKSkgKyAnLnB1Yic7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2NyaXB0JzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyBkZWZlcjogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtb2R1bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5tanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyB0eXBlOiAnbW9kdWxlJyB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmNzcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUoJy8nICsgdXJsICsgYWRkUXVlcnkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHNhdmVMb2NhdGlvbiArIHVybCwgYXdhaXQgaS52YWx1ZS5jcmVhdGVEYXRhV2l0aE1hcCgpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRIZWFkKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZEhlYWRUYWdzKCk7XG5cbiAgICAgICAgY29uc3QgbWFrZUF0dHJpYnV0ZXMgPSAoaTogc2V0RGF0YUhUTUxUYWcpID0+IGkuYXR0cmlidXRlcyA/ICcgJyArIE9iamVjdC5rZXlzKGkuYXR0cmlidXRlcykubWFwKHggPT4gaS5hdHRyaWJ1dGVzW3hdID8geCArIGA9XCIke2kuYXR0cmlidXRlc1t4XX1cImAgOiB4KS5qb2luKCcgJykgOiAnJztcblxuICAgICAgICBsZXQgYnVpbGRCdW5kbGVTdHJpbmcgPSAnJzsgLy8gYWRkIHNjcmlwdHMgYWRkIGNzc1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zdHlsZVVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfS8+YDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc2NyaXB0VVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxzY3JpcHQgc3JjPVwiJHtpLnVybH1cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Pjwvc2NyaXB0PmA7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkQnVuZGxlU3RyaW5nICsgdGhpcy5oZWFkSFRNTDtcbiAgICB9XG5cbiAgICBleHRlbmRzKGZyb206IFNlc3Npb25CdWlsZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3RvckFycmF5LnB1c2goLi4uZnJvbS5jb25uZWN0b3JBcnJheSk7XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goLi4uZnJvbS5zY3JpcHRVUkxTZXQpO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goLi4uZnJvbS5zdHlsZVVSTFNldCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGZyb20uaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goeyAuLi5pLCB2YWx1ZTogaS52YWx1ZS5jbG9uZSgpIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3B5T2JqZWN0cyA9IFsnY2FjaGVDb21waWxlU2NyaXB0JywgJ2NhY2hlQ29tcG9uZW50JywgJ2RlcGVuZGVuY2llcyddO1xuXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb3B5T2JqZWN0cykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzW2NdLCBmcm9tW2NdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaCguLi5mcm9tLnJlY29yZE5hbWVzLmZpbHRlcih4ID0+ICF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKHgpKSk7XG5cbiAgICAgICAgdGhpcy5oZWFkSFRNTCArPSBmcm9tLmhlYWRIVE1MO1xuICAgICAgICB0aGlzLmNhY2hlLnN0eWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0LnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHQpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdE1vZHVsZS5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0TW9kdWxlKTtcbiAgICB9XG5cbiAgICAvL2Jhc2ljIG1ldGhvZHNcbiAgICBCdWlsZFNjcmlwdFdpdGhQcmFtcyhjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBCdWlsZFNjcmlwdChjb2RlLCBpc1RzKCksIHRoaXMpO1xuICAgIH1cbn0iLCAiLy8gQHRzLW5vY2hlY2tcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IGNsZWFyTW9kdWxlIGZyb20gJ2NsZWFyLW1vZHVsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKSwgcmVzb2x2ZSA9IChwYXRoOiBzdHJpbmcpID0+IHJlcXVpcmUucmVzb2x2ZShwYXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUoZmlsZVBhdGgpO1xuICAgIGNsZWFyTW9kdWxlKGZpbGVQYXRoKTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59XG5cbmV4cG9ydCB7XG4gICAgY2xlYXJNb2R1bGUsXG4gICAgcmVzb2x2ZVxufSIsICJpbXBvcnQgeyBXYXJuaW5nIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5cbmNsYXNzIHJlTG9jYXRpb24ge1xuICAgIG1hcDogUHJvbWlzZTxTb3VyY2VNYXBDb25zdW1lcj5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRMb2NhdGlvbihsb2NhdGlvbjoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KXtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSAoYXdhaXQgdGhpcy5tYXApLm9yaWdpbmFsUG9zaXRpb25Gb3IobG9jYXRpb24pXG4gICAgICAgIHJldHVybiBgJHtsaW5lfToke2NvbHVtbn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlRXJyb3IoeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfTogV2FybmluZywgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX08Y29sb3I+JHtmaWxlUGF0aH06JHthd2FpdCBmaW5kTG9jYXRpb24uZ2V0TG9jYXRpb24oc3RhcnQpfWBcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlV2Fybih3YXJuaW5nczogV2FybmluZ1tdLCBmaWxlUGF0aDogc3RyaW5nLCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IGZpbmRMb2NhdGlvbiA9IG5ldyByZUxvY2F0aW9uKHNvdXJjZU1hcCk7XG4gICAgZm9yKGNvbnN0IHsgbWVzc2FnZSwgY29kZSwgc3RhcnQsIGZyYW1lIH0gb2Ygd2FybmluZ3Mpe1xuICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICB0ZXh0OiBgJHttZXNzYWdlfVxcbiR7ZnJhbWV9PGNvbG9yPiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IGhsanMgZnJvbSAnaGlnaGxpZ2h0LmpzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcic7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICdAc2luZHJlc29yaHVzL3NsdWdpZnknO1xuaW1wb3J0IG1hcmtkb3duSXRBdHRycyBmcm9tICdtYXJrZG93bi1pdC1hdHRycyc7XG5pbXBvcnQgbWFya2Rvd25JdEFiYnIgZnJvbSAnbWFya2Rvd24taXQtYWJicidcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55LCBpY29uOiBzdHJpbmcpIHtcblxuICAgIGZ1bmN0aW9uIHJlbmRlckNvZGUob3JpZ1J1bGU6IGFueSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnUmVuZGVyZWQgPSBvcmlnUnVsZSguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNvZGUtY29weVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29weS1jbGlwYm9hcmRcIiBvbmNsaWNrPVwibWFya2Rvd25Db3B5KHRoaXMpXCI+JHtpY29ufTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke29yaWdSZW5kZXJlZH1cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2sgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2spO1xuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIFxuICAgIGNvbnN0IGhsanNDbGFzcyA9ZGF0YVRhZy5wb3BCb29sZWFuKCdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogZGF0YVRhZy5wb3BCb29sZWFuKCdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpLFxuICAgICAgICBicmVha3M6IGRhdGFUYWcucG9wQm9vbGVhbignYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSxcbiAgICAgICAgdHlwb2dyYXBoZXI6IGRhdGFUYWcucG9wQm9vbGVhbigndHlwb2dyYXBoZXInLCBtYXJrRG93blBsdWdpbj8udHlwb2dyYXBoZXIgPz8gdHJ1ZSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29weSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/ICdcdUQ4M0RcdURDQ0InKTtcbiAgICBpZiAoY29weSlcbiAgICAgICAgbWQudXNlKChtOmFueSk9PiBjb2RlV2l0aENvcHkobSwgY29weSkpO1xuXG4gICAgaWYgKGRhdGFUYWcucG9wQm9vbGVhbignaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhYmJyJywgbWFya0Rvd25QbHVnaW4/LmFiYnIgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QWJicik7XG5cbiAgICBsZXQgbWFya2Rvd25Db2RlID0gQmV0d2VlblRhZ0RhdGE/LmVxIHx8ICcnO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdmaWxlJywgJy4vbWFya2Rvd24nKTtcblxuICAgIGlmICghbWFya2Rvd25Db2RlPy50cmltPy4oKSAmJiBsb2NhdGlvbikge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBsb2NhdGlvblswXSA9PSAnLycgPyBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzJdLCBsb2NhdGlvbik6IHBhdGguam9pbihwYXRoLmRpcm5hbWUodHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JykpLCBsb2NhdGlvbik7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnBvcFN0cmluZygnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBpZih0aGVtZSAhPSAnbm9uZScpe1xuICAgICAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY29weSl7XG4gICAgICAgICAgICBzZXNzaW9uLnNjcmlwdCgnL3NlcnYvbWQuanMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCd0aGVtZScsICBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXY+YXtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAtN3B4OyAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8aGVhZCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2UtaW50ZWdlclwiOiBbXG4gICAgICAgIC9eWzAtOV0rLi5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZS1mbG9hdFwiOiBbXG4gICAgICAgIC9eWzAtOV0rXFwuWzAtOV0rLi5bMC05XStcXC5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLXN0cmluZ1wiOiBbXG4gICAgICAgIC9ec3RyaW5nfHRleHQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IGBcIiR7eC50cmltKCkucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKX1cImApLFxuICAgICAgICAob3B0aW9uczogc3RyaW5nW10sIHRleHQ6IHN0cmluZykgPT4gb3B0aW9ucy5pbmNsdWRlcyh0ZXh0KSxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2UtbnVtYmVyXCI6IFtcbiAgICAgICAgL15udW1iZXJ8bnVtfGludGVnZXJ8aW50K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKSxcbiAgICAgICAgKG9wdGlvbnM6IG51bWJlcltdLCBudW06IG51bWJlcikgPT4gb3B0aW9ucy5pbmNsdWRlcyhudW0pLFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXVxufTtcblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzID0gWy4uLm51bWJlcnNdO1xuXG5mb3IoY29uc3QgaSBpbiBidWlsdEluQ29ubmVjdGlvblJlZ2V4KXtcbiAgICBjb25zdCB0eXBlID0gYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtpXVszXTtcblxuICAgIGlmKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyh0eXBlKSlcbiAgICAgICAgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLnB1c2goaSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVWYWx1ZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIGlmIChidWlsdEluQ29ubmVjdGlvbi5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBgW1wiJHt2YWx1ZX1cIl1gO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgW3Rlc3QsIGdldEFyZ3NdXSBvZiBPYmplY3QuZW50cmllcyhidWlsdEluQ29ubmVjdGlvblJlZ2V4KSlcbiAgICAgICAgaWYgKCg8UmVnRXhwPnRlc3QpLnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIGBbXCIke25hbWV9XCIsICR7KDxhbnk+Z2V0QXJncykodmFsdWUpfV1gO1xuXG4gICAgcmV0dXJuIGBbJHt2YWx1ZX1dYDtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVZhbGlkYXRpb25KU09OKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBQcm9taXNlPGJvb2xlYW4gfCBzdHJpbmdbXT4ge1xuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50LCAuLi5lbGVtZW50QXJnc10gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuICAgICAgICBsZXQgcmV0dXJuTm93OiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdudW0nOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICBjYXNlICdpbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFlbWFpbFZhbGlkYXRvci50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXZlUmVnZXggPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdmFsdWUgPT0gbnVsbCB8fCAhaGF2ZVJlZ2V4WzJdKGVsZW1lbnRBcmdzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICghZWxlbWVudC50ZXN0KHZhbHVlKSkgJiYgJ3JlZ2V4IC0gJyArIHZhbHVlO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICghYXdhaXQgZWxlbWVudCh2YWx1ZSkpICYmICdmdW5jdGlvbiAtICcgKyAoZWxlbWVudC5uYW1lIHx8ICdhbm9ueW1vdXMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYFZhbGlkYXRpb24gZmFpbGVkIGF0IGZpbGVkICR7TnVtYmVyKGkpKzF9IC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn0iLCAiaW1wb3J0IHsgY29ubmVjdG9ySW5mbywgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQ2FwaXRhbGl6ZSB9IGZyb20gXCIuLi8uLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uKGNvbm5lY3ROYW1lOiBzdHJpbmcsIGNvbm5lY3RvckNhbGw6IHN0cmluZywgY29ubmVjdGlvblR5cGU6IHN0cmluZywgcGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGJ1aWxkQXJndW1lbnRzOiAoaW5mbzogY29ubmVjdG9ySW5mbykgPT4gc3RyaW5nLCB7cmV0dXJuRGF0YX06IHtyZXR1cm5EYXRhPzogYm9vbGVhbn0gPSB7fSkge1xuICAgIGlmICghc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkuZmluZCh4ID0+IHgudHlwZSA9PSBjb25uZWN0aW9uVHlwZSkpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9IGNvbm5lY3Rpb25UeXBlKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc2VuZFRvVW5pY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGkubmFtZSkudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQCR7Y29ubmVjdE5hbWV9XFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKSwgY29ubmVjdERlZmF1bHQgPSBuZXcgUmVnRXhwKGBAXFxcXD8ke2Nvbm5lY3ROYW1lfVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXClgKTtcblxuICAgICAgICBsZXQgaGFkUmVwbGFjZW1lbnQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBzY3JpcHREYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgaGFkUmVwbGFjZW1lbnQgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYGlmKFBvc3Q/LiR7Y29ubmVjdG9yQ2FsbH0gPT0gXCIke2kubmFtZX1cIil7XG4gICAgICAgICAgICAgICAgJHtyZXR1cm5EYXRhID8gJ3JldHVybiAnOiAnJ31hd2FpdCBoYW5kZWxDb25uZWN0b3IoXCIke2Nvbm5lY3Rpb25UeXBlfVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgJHtidWlsZEFyZ3VtZW50cyhpKX1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfWApXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoaGFkUmVwbGFjZW1lbnQpXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoY29ubmVjdERlZmF1bHQsICcnKTsgLy8gZGVsZXRpbmcgZGVmYXVsdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3REZWZhdWx0LCBzY3JpcHREYXRhKTtcblxuICAgIH1cblxuICAgIHJldHVybiBwYWdlRGF0YTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgY29ubmVjdG9ySW5mbywgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9jb25uZWN0LW5vZGUnO1xuXG5jb25zdCBzZXJ2ZVNjcmlwdCA9ICcvc2Vydi9jb25uZWN0LmpzJztcblxuZnVuY3Rpb24gdGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAke25hbWV9KC4uLmFyZ3Mpe3JldHVybiBjb25uZWN0b3IoXCIke25hbWV9XCIsIGFyZ3MpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgeyBTb21lUGx1Z2lucyB9LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25hbWUnKSxcbiAgICAgICAgc2VuZFRvID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VuZFRvJyksXG4gICAgICAgIHZhbGlkYXRvciA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksXG4gICAgICAgIG5vdFZhbGlkID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbm90VmFsaWQnKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ21lc3NhZ2UnLCBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcblxuICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwgeyBhc3luYzogbnVsbCB9KVxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dCh0ZW1wbGF0ZShuYW1lKSk7IC8vIGFkZCBzY3JpcHRcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiAnY29ubmVjdCcsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBCZXR3ZWVuVGFnRGF0YSB8fCBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgY29tcGlsZWRTdHJpbmcuQWRkVGV4dEJlZm9yZU5vVHJhY2soYDwlIUBAP0Nvbm5lY3RIZXJlKCR7bmFtZX0pJT5gKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oJ0Nvbm5lY3RIZXJlJywgJ2Nvbm5lY3RvckNhbGw/Lm5hbWUnLCAnY29ubmVjdCcsIHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgaSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6XCIke2kubmFtZX1cIixcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6JHt0eXBlb2YgaS5tZXNzYWdlID09ICdzdHJpbmcnID8gYFwiJHtpLm1lc3NhZ2V9XCJgIDogaS5tZXNzYWdlfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHsoaS52YWxpZGF0b3IgJiYgaS52YWxpZGF0b3IubWFwKGNvbXBpbGVWYWx1ZXMpLmpvaW4oJywnKSkgfHwgJyd9XVxuICAgICAgICB9YFxuICAgIH0sIHtyZXR1cm5EYXRhOiB0cnVlfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3I6IGFueSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC52YWx1ZXM7XG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbm5lY3Rvci52YWxpZGF0b3IubGVuZ3RoICYmIGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3Rvci52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbm5lY3Rvci52YWxpZGF0b3IubGVuZ3RoIHx8IGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgY29ubmVjdG9yLnNlbmRUbyguLi52YWx1ZXMpKTtcblxuICAgIGVsc2UgaWYgKGNvbm5lY3Rvci5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBjb25uZWN0b3Iubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKSk7XG5cbiAgICBlbHNlIGlmIChjb25uZWN0b3IubWVzc2FnZSlcbiAgICAgICAgYmV0dGVySlNPTih7XG4gICAgICAgICAgICBlcnJvcjogdHlwZW9mIGNvbm5lY3Rvci5tZXNzYWdlID09ICdzdHJpbmcnID8gY29ubmVjdG9yLm1lc3NhZ2UgOiAoPGFueT5pc1ZhbGlkKS5zaGlmdCgpXG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc3RhdHVzKDQwMCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVZhbHVlcyB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgeyBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IHNlbmRUbyA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnc2VuZFRvJywgJycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgICAgICB9PC9mb3JtPmAsXG4gICAgICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgICAgIH1cblxuXG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbmFtZScsIHV1aWQoKSkudHJpbSgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb3JkZXInKSwgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcucG9wQm9vbGVhbignc2FmZScpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBsZXQgb3JkZXIgPSBbXTtcblxuICAgIGNvbnN0IHZhbGlkYXRvckFycmF5ID0gdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHsgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYW4gb3JkZXIgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIFwicHJvcDE6IHN0cmluZywgcHJvcDM6IG51bSwgcHJvcDI6IGJvb2xcIlxuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0Rmlyc3QoJzonLCB4LnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBvcmRlci5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuXG4gICAgICAgIHJldHVybiBzcGxpdC5wb3AoKTtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlckRlZmF1bHQpXG4gICAgICAgIG9yZGVyID0gb3JkZXJEZWZhdWx0LnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yQXJyYXksXG4gICAgICAgIG9yZGVyOiBvcmRlci5sZW5ndGggJiYgb3JkZXIsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZXNwb25zZVNhZmVcbiAgICB9KTtcblxuICAgIGRhdGFUYWcucHVzaFZhbHVlKCdtZXRob2QnLCAncG9zdCcpO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtuYW1lfSlcbiU+PGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbm5lY3RvckZvcm1DYWxsXCIgdmFsdWU9XCIke25hbWV9XCIvPiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uKCdDb25uZWN0SGVyZUZvcm0nLCAnY29ubmVjdG9yRm9ybUNhbGwnLCAnZm9ybScsIHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgaSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgb3JkZXI6IFske2kub3JkZXI/Lm1hcD8uKGl0ZW0gPT4gYFwiJHtpdGVtfVwiYCk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICB9YFxuICAgIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9ySW5mbzogYW55KSB7XG5cbiAgICBkZWxldGUgdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JGb3JtQ2FsbDtcblxuICAgIGxldCB2YWx1ZXMgPSBbXTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLm9yZGVyLmxlbmd0aCkgLy8gcHVzaCB2YWx1ZXMgYnkgc3BlY2lmaWMgb3JkZXJcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNvbm5lY3RvckluZm8ub3JkZXIpXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzUGFnZS5Qb3N0W2ldKTtcbiAgICBlbHNlXG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLk9iamVjdC52YWx1ZXModGhpc1BhZ2UuUG9zdCkpO1xuXG5cbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiB8IHN0cmluZ1tdID0gdHJ1ZTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLnZhbGlkYXRvci5sZW5ndGgpIHsgLy8gdmFsaWRhdGUgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHBhcnNlVmFsdWVzKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgICAgICBpc1ZhbGlkID0gYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgIH1cblxuICAgIGxldCByZXNwb25zZTogYW55O1xuXG4gICAgaWYgKGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5zZW5kVG8oLi4udmFsdWVzKTtcbiAgICBlbHNlIGlmIChjb25uZWN0b3JJbmZvLm5vdFZhbGlkKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8ubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKTtcblxuICAgIGlmIChpc1ZhbGlkICYmICFyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8ubWVzc2FnZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShpc1ZhbGlkWzBdKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzcG9uc2UgPSBjb25uZWN0b3JJbmZvLm1lc3NhZ2U7XG5cbiAgICBpZiAocmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLnNhZmUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUocmVzcG9uc2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZShyZXNwb25zZSk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHJlY29yZFN0b3JlID0gbmV3IFN0b3JlSlNPTignUmVjb3JkcycpO1xuXG5mdW5jdGlvbiByZWNvcmRMaW5rKGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdsaW5rJywgc21hbGxQYXRoVG9QYWdlKHNlc3Npb25JbmZvLnNtYWxsUGF0aCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVJlY29yZFBhdGgoZGVmYXVsdE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGxpbmsgPSByZWNvcmRMaW5rKGRhdGFUYWcsIHNlc3Npb25JbmZvKSwgc2F2ZU5hbWUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ25hbWUnLCBkZWZhdWx0TmFtZSk7XG5cbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0gPz89IHt9O1xuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSA/Pz0gJyc7XG4gICAgc2Vzc2lvbkluZm8ucmVjb3JkKHNhdmVOYW1lKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0b3JlOiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0sXG4gICAgICAgIGN1cnJlbnQ6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSxcbiAgICAgICAgbGlua1xuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc2Vzc2lvbkluZm8uc21hbGxQYXRoLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSAvLyBkbyBub3QgYWxsb3cgdGhpcyBmb3IgY29tcGlsaW5nIGNvbXBvbmVudCBhbG9uZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgICAgIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBodG1sID0gaHRtbC50cmltKCk7XG5cbiAgICBjb25zdCB7IHN0b3JlLCBsaW5rIH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9yZWNvcmQuc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc3RvcmVbbGlua10uaW5jbHVkZXMoaHRtbCkpIHtcbiAgICAgICAgc3RvcmVbbGlua10gKz0gaHRtbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVCZWZvcmVSZUJ1aWxkKHNtYWxsUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbmFtZSA9IHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGgpO1xuICAgIGZvciAoY29uc3Qgc2F2ZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBpdGVtID0gcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZV07XG5cbiAgICAgICAgaWYgKGl0ZW1bbmFtZV0pIHtcbiAgICAgICAgICAgIGl0ZW1bbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkZWxldGUgaXRlbVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uLmRlYnVnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgb2Ygc2Vzc2lvbi5yZWNvcmROYW1lcykge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyQ29tcGlsZSgpIHtcbiAgICByZWNvcmRTdG9yZS5jbGVhcigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHJlY29yZFN0b3JlLnN0b3JlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ01hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdub2RlLWh0bWwtcGFyc2VyJztcbmltcG9ydCB7IG1ha2VSZWNvcmRQYXRoIH0gZnJvbSAnLi9yZWNvcmQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc2Vzc2lvbkluZm8uc21hbGxQYXRoLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSAvLyBkbyBub3QgYWxsb3cgdGhpcyBmb3IgY29tcGlsaW5nIGNvbXBvbmVudCBhbG9uZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgICAgIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IHN0b3JlLCBsaW5rLCBjdXJyZW50IH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9zZWFyY2guc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBzZWFyY2hPYmplY3QgPSBidWlsZE9iamVjdChodG1sLCBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ21hdGNoJywgJ2gxW2lkXSwgaDJbaWRdLCBoM1tpZF0sIGg0W2lkXSwgaDVbaWRdLCBoNltpZF0nKSk7XG5cbiAgICBpZiAoIWN1cnJlbnQpIHtcbiAgICAgICAgc3RvcmVbbGlua10gPSBzZWFyY2hPYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihjdXJyZW50LnRpdGxlcywgc2VhcmNoT2JqZWN0LnRpdGxlcyk7XG5cbiAgICAgICAgaWYgKCFjdXJyZW50LnRleHQuaW5jbHVkZXMoc2VhcmNoT2JqZWN0LnRleHQpKSB7XG4gICAgICAgICAgICBjdXJyZW50LnRleHQgKz0gc2VhcmNoT2JqZWN0LnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0KGh0bWw6IHN0cmluZywgbWF0Y2g6IHN0cmluZykge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJzZShodG1sLCB7XG4gICAgICAgIGJsb2NrVGV4dEVsZW1lbnRzOiB7XG4gICAgICAgICAgICBzY3JpcHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3R5bGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9zY3JpcHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRpdGxlczogU3RyaW5nTWFwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKSkge1xuICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQuYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgdGl0bGVzW2lkXSA9IGVsZW1lbnQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZXMsXG4gICAgICAgIHRleHQ6IHJvb3QuaW5uZXJUZXh0LnRyaW0oKS5yZXBsYWNlKC9bIFxcbl17Mix9L2csICcgJykucmVwbGFjZSgvW1xcbl0vZywgJyAnKVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9Db21wb25lbnRzL2NsaWVudCc7XG5pbXBvcnQgc2NyaXB0IGZyb20gJy4vQ29tcG9uZW50cy9zY3JpcHQvaW5kZXgnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vQ29tcG9uZW50cy9zdHlsZS9pbmRleCc7XG5pbXBvcnQgcGFnZSBmcm9tICcuL0NvbXBvbmVudHMvcGFnZSc7XG5pbXBvcnQgaXNvbGF0ZSBmcm9tICcuL0NvbXBvbmVudHMvaXNvbGF0ZSc7XG5pbXBvcnQgc3ZlbHRlIGZyb20gJy4vQ29tcG9uZW50cy9zdmVsdGUnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJy4vQ29tcG9uZW50cy9tYXJrZG93bic7XG5pbXBvcnQgaGVhZCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRIZWFkIH0gZnJvbSAnLi9Db21wb25lbnRzL2hlYWQnO1xuaW1wb3J0IGNvbm5lY3QsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdCwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckNvbm5lY3QgfSBmcm9tICcuL0NvbXBvbmVudHMvY29ubmVjdCc7XG5pbXBvcnQgZm9ybSwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRGb3JtLCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yRm9ybSB9IGZyb20gJy4vQ29tcG9uZW50cy9mb3JtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHJlY29yZCwgeyB1cGRhdGVSZWNvcmRzLCBwZXJDb21waWxlIGFzIHBlckNvbXBpbGVSZWNvcmQsIHBvc3RDb21waWxlIGFzIHBvc3RDb21waWxlUmVjb3JkLCBkZWxldGVCZWZvcmVSZUJ1aWxkIH0gZnJvbSAnLi9Db21wb25lbnRzL3JlY29yZCc7XG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vQ29tcG9uZW50cy9zZWFyY2gnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGNvbnN0IEFsbEJ1aWxkSW4gPSBbXCJjbGllbnRcIiwgXCJzY3JpcHRcIiwgXCJzdHlsZVwiLCBcInBhZ2VcIiwgXCJjb25uZWN0XCIsIFwiaXNvbGF0ZVwiLCBcImZvcm1cIiwgXCJoZWFkXCIsIFwic3ZlbHRlXCIsIFwibWFya2Rvd25cIiwgXCJyZWNvcmRcIiwgXCJzZWFyY2hcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGFydENvbXBpbGluZyhwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBsZXQgcmVEYXRhOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+O1xuXG4gICAgc3dpdGNoICh0eXBlLmVxLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSBcImNsaWVudFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY2xpZW50KHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJlY29yZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcmVjb3JkKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNlYXJjaCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBzY3JpcHQoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3R5bGUoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwYWdlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBwYWdlKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNvbm5lY3QodHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtXCI6XG4gICAgICAgICAgICByZURhdGEgPSBmb3JtKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImlzb2xhdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGlzb2xhdGUoQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJoZWFkXCI6XG4gICAgICAgICAgICByZURhdGEgPSBoZWFkKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN2ZWx0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3ZlbHRlKHR5cGUsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWFya2Rvd25cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IG1hcmtkb3duKHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBvbmVudCBpcyBub3QgYnVpbGQgeWV0XCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0luY2x1ZGUodGFnbmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEFsbEJ1aWxkSW4uaW5jbHVkZXModGFnbmFtZS50b0xvd2VyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdXBkYXRlUmVjb3JkcyhzZXNzaW9uSW5mbyk7XG5cbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRDb25uZWN0KHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkRm9ybShwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSgvQENvbm5lY3RIZXJlKDs/KS9naSwgJycpLnJlcGxhY2UoL0BDb25uZWN0SGVyZUZvcm0oOz8pL2dpLCAnJyk7XG5cbiAgICBwYWdlRGF0YSA9IGF3YWl0IGFkZEZpbmFsaXplQnVpbGRIZWFkKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgZnVsbENvbXBpbGVQYXRoKTtcbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKHR5cGU6IHN0cmluZywgdGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yOiBhbnkpIHtcbiAgICBpZiAodHlwZSA9PSAnY29ubmVjdCcpXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JDb25uZWN0KHRoaXNQYWdlLCBjb25uZWN0b3IpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckZvcm0odGhpc1BhZ2UsIGNvbm5lY3Rvcik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgXG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBQYXJzZURlYnVnSW5mbywgQ3JlYXRlRmlsZVBhdGgsIFBhdGhUeXBlcywgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQWxsQnVpbGRJbiwgSXNJbmNsdWRlLCBTdGFydENvbXBpbGluZyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgQXJyYXlNYXRjaCB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQge0NvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCB7IEluc2VydENvbXBvbmVudEJhc2UsIEJhc2VSZWFkZXIsIHBvb2wgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCBwYXRoTm9kZSBmcm9tICdwYXRoJztcbmltcG9ydCBQYXJzZUJhc2VQYWdlIGZyb20gJy4vQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5cbmludGVyZmFjZSBEZWZhdWx0VmFsdWVzIHtcbiAgICB2YWx1ZTogU3RyaW5nVHJhY2tlcixcbiAgICBlbGVtZW50czogc3RyaW5nW11cbn1cblxuY29uc3Qgc2VhcmNoU3BlY2lmaWNDb21wb25lbnRzID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuY29uc3Qgc2VhcmNoQWxsQ29tcG9uZW50cyA9IC88W1xccHtMfV9cXC06MC05XS91XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50IGV4dGVuZHMgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgcHVibGljIGRpckZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBQbHVnaW5CdWlsZDogQWRkUGx1Z2luO1xuICAgIHB1YmxpYyBDb21waWxlSW5GaWxlOiBDb21waWxlSW5GaWxlRnVuYztcbiAgICBwdWJsaWMgTWljcm9QbHVnaW5zOiBTdHJpbmdBcnJheU9yT2JqZWN0O1xuICAgIHB1YmxpYyBHZXRQbHVnaW46IChuYW1lOiBzdHJpbmcpID0+IGFueTtcbiAgICBwdWJsaWMgU29tZVBsdWdpbnM6ICguLi5uYW1lczogc3RyaW5nW10pID0+IGJvb2xlYW47XG4gICAgcHVibGljIGlzVHM6ICgpID0+IGJvb2xlYW47XG5cblxuICAgIGdldCByZWdleFNlYXJjaCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikgPyBzZWFyY2hBbGxDb21wb25lbnRzOiBzZWFyY2hTcGVjaWZpY0NvbXBvbmVudHNcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihQbHVnaW5CdWlsZDogQWRkUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGlyRm9sZGVyID0gJ0NvbXBvbmVudHMnO1xuICAgICAgICB0aGlzLlBsdWdpbkJ1aWxkID0gUGx1Z2luQnVpbGQ7XG4gICAgfVxuXG4gICAgRmluZFNwZWNpYWxUYWdCeVN0YXJ0KHN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlNraXBTcGVjaWFsVGFnKSB7XG4gICAgICAgICAgICBpZiAoc3RyaW5nLnN1YnN0cmluZygwLCBpWzBdLmxlbmd0aCkgPT0gaVswXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZEluZGV4U2VhcmNoVGFnKHF1ZXJ5OiBzdHJpbmcsIHRhZzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBhbGwgPSBxdWVyeS5zcGxpdCgnLicpO1xuICAgICAgICBsZXQgY291bnRlciA9IDBcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0YWcuaW5kZXhPZihpKVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgV2FyaW5nLCBjYW4ndCBmaW5kIGFsbCBxdWVyeSBpbiB0YWcgLT48Y29sb3I+JHt0YWcuZXF9XFxuJHt0YWcubGluZUluZm99YCxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcInF1ZXJ5LW5vdC1mb3VuZFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIgKz0gaW5kZXggKyBpLmxlbmd0aFxuICAgICAgICAgICAgdGFnID0gdGFnLnN1YnN0cmluZyhpbmRleCArIGkubGVuZ3RoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50ZXIgKyB0YWcuc2VhcmNoKC9cXCB8XFw+LylcbiAgICB9XG5cbiAgICBDaGVja01pbkhUTUwoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBpZiAodGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikpIHtcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MVGV4dChjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGlmICghdGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUoL1sgXFxuXXsyLH0vLnRlc3QoY29kZS5lcSkpe1xuICAgICAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvWyBcXG5dezIsfS9naSwgJyAnKVxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmICh0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgaWYoQmV0d2VlblRhZ0RhdGEpXG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gZGF0YVRhZ1NwbGljZWQucmVidWlsZFNwYWNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YWdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMoXG4gICAgICAgICAgICAnPCcsIHR5cGUsIGRhdGFUYWdcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSkge1xuICAgICAgICAgICAgdGFnRGF0YS5QbHVzJGA+JHthd2FpdCBTZW5kRGF0YUZ1bmMoQmV0d2VlblRhZ0RhdGEpfTwvJHt0eXBlfT5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFnRGF0YS5QbHVzKCcvPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhZ0RhdGE7XG4gICAgfVxuXG4gICAgZXhwb3J0RGVmYXVsdFZhbHVlcyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgZm91bmRTZXR0ZXJzOiBEZWZhdWx0VmFsdWVzW10gPSBbXSkge1xuICAgICAgICBjb25zdCBpbmRleEJhc2ljOiBBcnJheU1hdGNoID0gZmlsZURhdGEubWF0Y2goL0BkZWZhdWx0WyBdKlxcKChbQS1aYS16MC05e30oKVxcW1xcXV9cXC0kXCInYCUqJnxcXC9cXEAgXFxuXSopXFwpWyBdKlxcWyhbQS1aYS16MC05X1xcLSwkIFxcbl0rKVxcXS8pO1xuXG4gICAgICAgIGlmIChpbmRleEJhc2ljID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4geyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH07XG5cbiAgICAgICAgY29uc3QgV2l0aG91dEJhc2ljID0gZmlsZURhdGEuc3Vic3RyaW5nKDAsIGluZGV4QmFzaWMuaW5kZXgpLlBsdXMoZmlsZURhdGEuc3Vic3RyaW5nKGluZGV4QmFzaWMuaW5kZXggKyBpbmRleEJhc2ljWzBdLmxlbmd0aCkpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5VmFsdWVzID0gaW5kZXhCYXNpY1syXS5lcS5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKTtcblxuICAgICAgICBmb3VuZFNldHRlcnMucHVzaCh7XG4gICAgICAgICAgICB2YWx1ZTogaW5kZXhCYXNpY1sxXSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBhcnJheVZhbHVlc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKFdpdGhvdXRCYXNpYywgZm91bmRTZXR0ZXJzKTtcbiAgICB9XG5cbiAgICBhZGREZWZhdWx0VmFsdWVzKGFycmF5VmFsdWVzOiBEZWZhdWx0VmFsdWVzW10sIGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheVZhbHVlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiZSBvZiBpLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlQWxsKCcjJyArIGJlLCBpLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBwYXJzZUNvbXBvbmVudFByb3BzKHRhZ0RhdGE6IFRhZ0RhdGFQYXJzZXIsIGNvbXBvbmVudDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBsZXQgeyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH0gPSB0aGlzLmV4cG9ydERlZmF1bHRWYWx1ZXMoY29tcG9uZW50KTtcblxuICAgICAgICBmb3IgKGNvbnN0IHtrZXksdmFsdWV9IG9mIHRhZ0RhdGEudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKFwiXFxcXH5cIiArIGtleSwgXCJnaVwiKTtcbiAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZShyZSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkRGVmYXVsdFZhbHVlcyhmb3VuZFNldHRlcnMsIGZpbGVEYXRhKTtcbiAgICB9XG5cbiAgICBhc3luYyBidWlsZFRhZ0Jhc2ljKGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCB0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBwYXRoOiBzdHJpbmcsIFNtYWxsUGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLlBsdWdpbkJ1aWxkLkJ1aWxkQ29tcG9uZW50KGZpbGVEYXRhLCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgICAgIGZpbGVEYXRhID0gdGhpcy5wYXJzZUNvbXBvbmVudFByb3BzKHRhZ0RhdGEsIGZpbGVEYXRhKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UoLzxcXDpyZWFkZXIoICkqXFwvPi9naSwgQmV0d2VlblRhZ0RhdGEgPz8gJycpO1xuXG4gICAgICAgIHBhdGhOYW1lID0gcGF0aE5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGg7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLlN0YXJ0UmVwbGFjZShmaWxlRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IFBhcnNlRGVidWdJbmZvKGZpbGVEYXRhLCBgJHtwYXRoTmFtZX0gLT5cXG4ke1NtYWxsUGF0aH1gKTtcblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGE6IFRhZ0RhdGFQYXJzZXIsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFNvdXJjZSA9ICcvJyArIHR5cGUuZXh0cmFjdEluZm8oKTtcblxuICAgICAgICBkYXRhLnB1c2hWYWx1ZSgnaW1wb3J0U291cmNlJywgaW1wb3J0U291cmNlKVxuICAgICAgICBkYXRhLnB1c2hWYWx1ZSgnaW1wb3J0U291cmNlRGlyZWN0b3J5JywgcGF0aC5kaXJuYW1lKGltcG9ydFNvdXJjZSkpXG5cbiAgICAgICAgY29uc3QgIG1hcEF0dHJpYnV0ZXMgPSBkYXRhLm1hcCgpO1xuICAgICAgICBtYXBBdHRyaWJ1dGVzLnJlYWRlciA9IEJldHdlZW5UYWdEYXRhPy5lcTtcblxuICAgICAgICByZXR1cm4gbWFwQXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBhc3luYyBpbnNlcnRUYWdEYXRhKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFN0cmluZ1RyYWNrZXIsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH06IHsgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyIH0pIHtcbiAgICAgICAgY29uc3QgZGF0YVBhcnNlciA9IG5ldyBUYWdEYXRhUGFyc2VyKGRhdGFUYWcpLCBCdWlsZEluID0gSXNJbmNsdWRlKHR5cGUuZXEpO1xuICAgICAgICBhd2FpdCBkYXRhUGFyc2VyLnBhcnNlcigpO1xuXG4gICAgICAgIGxldCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgU2VhcmNoSW5Db21tZW50ID0gdHJ1ZSwgQWxsUGF0aFR5cGVzOiBQYXRoVHlwZXMgPSB7fSwgYWRkU3RyaW5nSW5mbzogc3RyaW5nO1xuXG4gICAgICAgIGlmIChCdWlsZEluKSB7Ly9jaGVjayBpZiBpdCBidWlsZCBpbiBjb21wb25lbnRcbiAgICAgICAgICAgIGNvbnN0IHsgY29tcGlsZWRTdHJpbmcsIGNoZWNrQ29tcG9uZW50cyB9ID0gYXdhaXQgU3RhcnRDb21waWxpbmcocGF0aE5hbWUsIHR5cGUsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhID8/IG5ldyBTdHJpbmdUcmFja2VyKCksIHRoaXMsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGZpbGVEYXRhID0gY29tcGlsZWRTdHJpbmc7XG4gICAgICAgICAgICBTZWFyY2hJbkNvbW1lbnQgPSBjaGVja0NvbXBvbmVudHM7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vcmVidWlsZCBmb3JtYXR0ZWQgY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCBSZUJ1aWxkVGFnID0gKCkgPT4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG5cbiAgICAgICAgICAgIC8vY2hlY2sgaWYgY29tcG9uZW50IG5vdCBzdGFydHMgd2l0aCB1cHBlciBjYXNlXG4gICAgICAgICAgICBjb25zdCBmaXJzdENoYXIgPSB0eXBlLmF0KDApLmVxXG4gICAgICAgICAgICBpZihmaXJzdENoYXIgIT0gZmlyc3RDaGFyLnRvVXBwZXJDYXNlKCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBSZUJ1aWxkVGFnKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGFQYXJzZXIucG9wSGF2ZURlZmF1bHQoJ2ZvbGRlcicsICcuJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPjxjb2xvcj4ke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlQnVpbGRUYWcoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdPy5tdGltZU1zKVxuICAgICAgICAgICAgICAgIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0geyBtdGltZU1zOiBhd2FpdCBFYXN5RnMuc3RhdChBbGxQYXRoVHlwZXMuRnVsbFBhdGgsICdtdGltZU1zJykgfTsgLy8gYWRkIHRvIGRlcGVuZGVuY2VPYmplY3RcblxuICAgICAgICAgICAgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzW0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0gc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0ubXRpbWVNc1xuXG4gICAgICAgICAgICBjb25zdCB7IGFsbERhdGEsIHN0cmluZ0luZm8gfSA9IGF3YWl0IEFkZERlYnVnSW5mbyh0cnVlLCBwYXRoTmFtZSwgQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSk7XG4gICAgICAgICAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKHNlc3Npb25JbmZvLCBhbGxEYXRhLCB0aGlzLmlzVHMoKSk7XG5cbiAgICAgICAgICAgIC8qYWRkIHNwZWNpYWwgYXR0cmlidXRlcyAqL1xuICAgICAgICAgICAgY29uc3QgbWFwQXR0cmlidXRlcyA9IEluc2VydENvbXBvbmVudC5hZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhUGFyc2VyLCB0eXBlLCBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHBhdGhOYW1lICsgJyAtPiAnICsgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwge2F0dHJpYnV0ZXM6IG1hcEF0dHJpYnV0ZXN9KTtcblxuICAgICAgICAgICAgZmlsZURhdGEgPSBiYXNlRGF0YS5zY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICAgICAgICAgIGFkZFN0cmluZ0luZm8gPSBzZXNzaW9uSW5mby5kZWJ1ZyAmJiBzdHJpbmdJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFNlYXJjaEluQ29tbWVudCAmJiAoZmlsZURhdGEubGVuZ3RoID4gMCB8fCBCZXR3ZWVuVGFnRGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQWxsUGF0aFR5cGVzO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuYnVpbGRUYWdCYXNpYyhmaWxlRGF0YSwgZGF0YVBhcnNlciwgQnVpbGRJbiA/IHR5cGUuZXEgOiBGdWxsUGF0aCwgQnVpbGRJbiA/IHR5cGUuZXEgOiBTbWFsbFBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbywgQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyAmJiBmaWxlRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhhZGRTdHJpbmdJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIENoZWNrRG91YmxlU3BhY2UoLi4uZGF0YTogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKTtcbiAgICAgICAgbGV0IHN0YXJ0RGF0YSA9IGRhdGEuc2hpZnQoKTtcblxuICAgICAgICBpZiAobWluaSkge1xuICAgICAgICAgICAgc3RhcnREYXRhID0gc3RhcnREYXRhLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChtaW5pICYmIHN0YXJ0RGF0YS5lbmRzV2l0aCgnICcpICYmIGkuc3RhcnRzV2l0aCgnICcpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RhcnREYXRhID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgMSA9PSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnREYXRhLlBsdXMoaSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWluaSkge1xuICAgICAgICAgICAgc3RhcnREYXRhID0gc3RhcnREYXRhLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhcnREYXRhO1xuICAgIH1cblxuICAgIGFzeW5jIFN0YXJ0UmVwbGFjZShkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIGxldCBmaW5kOiBudW1iZXI7XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZUJ1aWxkOiAoU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pW10gPSBbXTtcblxuICAgICAgICB3aGlsZSAoKGZpbmQgPSBkYXRhLnNlYXJjaCh0aGlzLnJlZ2V4U2VhcmNoKSkgIT0gLTEpIHtcblxuICAgICAgICAgICAgLy9oZWNrIGlmIHRoZXJlIGlzIHNwZWNpYWwgdGFnIC0gbmVlZCB0byBza2lwIGl0XG4gICAgICAgICAgICBjb25zdCBsb2NTa2lwID0gZGF0YS5lcTtcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpYWxTa2lwID0gdGhpcy5GaW5kU3BlY2lhbFRhZ0J5U3RhcnQobG9jU2tpcC50cmltKCkpO1xuXG4gICAgICAgICAgICBpZiAoc3BlY2lhbFNraXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGxvY1NraXAuaW5kZXhPZihzcGVjaWFsU2tpcFswXSkgKyBzcGVjaWFsU2tpcFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gbG9jU2tpcC5zdWJzdHJpbmcoc3RhcnQpLmluZGV4T2Yoc3BlY2lhbFNraXBbMV0pICsgc3RhcnQgKyBzcGVjaWFsU2tpcFsxXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goZGF0YS5zdWJzdHJpbmcoMCwgZW5kKSk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGVuZCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZmluZGluZyB0aGUgdGFnXG4gICAgICAgICAgICBjb25zdCBjdXRTdGFydERhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kKTsgLy88XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0RnJvbSA9IGRhdGEuc3Vic3RyaW5nKGZpbmQpO1xuXG4gICAgICAgICAgICAvL3RhZyB0eXBlIFxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZUVuZCA9IHN0YXJ0RnJvbS5zZWFyY2goJ1xcIHwvfFxcPnwoPCUpJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1R5cGUgPSBzdGFydEZyb20uc3Vic3RyaW5nKDEsIHRhZ1R5cGVFbmQpO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kRW5kT2ZTbWFsbFRhZyA9IGF3YWl0IHRoaXMuRmluZENsb3NlQ2hhcihzdGFydEZyb20uc3Vic3RyaW5nKDEpLCAnPicpICsgMTtcblxuICAgICAgICAgICAgbGV0IGluVGFnID0gc3RhcnRGcm9tLnN1YnN0cmluZyh0YWdUeXBlRW5kLCBmaW5kRW5kT2ZTbWFsbFRhZyk7XG5cbiAgICAgICAgICAgIGlmIChpblRhZy5hdChpblRhZy5sZW5ndGggLSAxKS5lcSA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICBpblRhZyA9IGluVGFnLnN1YnN0cmluZygwLCBpblRhZy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgTmV4dFRleHRUYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKGZpbmRFbmRPZlNtYWxsVGFnICsgMSk7XG5cbiAgICAgICAgICAgIGlmIChzdGFydEZyb20uYXQoZmluZEVuZE9mU21hbGxUYWcgLSAxKS5lcSA9PSAnLycpIHsvL3NtYWxsIHRhZ1xuICAgICAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTCh0aGlzLkNoZWNrTWluSFRNTFRleHQoY3V0U3RhcnREYXRhKSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke3RhZ1R5cGV9XCIsIHVzZWQgaW46ICR7dGFnVHlwZS5hdCgwKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9JZiB0aGlzIG9ubHkgdGV4dCB0aGVuIGRlbGV0ZSBkb3VibGUgc3BhY2luZ1xuICAgICAgICBpZihwcm9taXNlQnVpbGQubGVuZ3RoID09PSAwICYmICF0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChkYXRhLmVxLnRyaW0oKSkpe1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuQ2hlY2tNaW5IVE1MVGV4dChkYXRhKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBwb29sIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ3MgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyXCI7XG5pbXBvcnQgQ1J1blRpbWUgZnJvbSBcIi4vQ29tcGlsZVwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uL1Nlc3Npb25cIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gXCIuLi9KU1BhcnNlclwiO1xuXG5jb25zdCBpZ25vcmVJbmhlcml0ID0gWydjb2RlZmlsZSddO1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0geyBkZWZpbmU6IHt9IH07XG5cbmFzeW5jIGZ1bmN0aW9uIFBhZ2VCYXNlUGFyc2VyKHRleHQ6IHN0cmluZyk6IFByb21pc2U8e1xuICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgZW5kOiBudW1iZXIsXG4gICAgdmFsdWVzOiB7XG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgY2hhcjogc3RyaW5nXG4gICAgfVtdXG59PiB7XG4gICAgY29uc3QgcGFyc2UgPSBhd2FpdCBwb29sLmV4ZWMoJ1BhZ2VCYXNlUGFyc2VyJywgW3RleHRdKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlQmFzZVBhZ2Uge1xuICAgIHB1YmxpYyBjbGVhckRhdGE6IFN0cmluZ1RyYWNrZXJcbiAgICBwdWJsaWMgc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBwdWJsaWMgdmFsdWVBcnJheTogeyBrZXk6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIgfCB0cnVlLCBjaGFyPzogc3RyaW5nIH1bXSA9IFtdXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgcHVibGljIGNvZGU/OiBTdHJpbmdUcmFja2VyLCBwdWJsaWMgaXNUcz86IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICBub25EeW5hbWljKGlzRHluYW1pYzogYm9vbGVhbikge1xuICAgICAgICBpZiAoIWlzRHluYW1pYykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEeW5hbWljID0gdGhpcy5wb3BBbnkoJ2R5bmFtaWMnKTtcbiAgICAgICAgaWYgKGhhdmVEeW5hbWljICE9IG51bGwpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICAgICAgcGFyc2UuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGE7XG4gICAgICAgICAgICBwYXJzZS52YWx1ZUFycmF5ID0gWy4uLnRoaXMudmFsdWVBcnJheSwgeyBrZXk6ICdkeW5hbWljJywgdmFsdWU6IHRydWUgfV07XG5cbiAgICAgICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZSh0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoLCBwYXJzZS5jbGVhckRhdGEuZXEpO1xuXG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2R5bmFtaWMtc3NyLWltcG9ydCcsXG4gICAgICAgICAgICAgICAgdGV4dDogJ0FkZGluZyBcXCdkeW5hbWljXFwnIGF0dHJpYnV0ZSB0byBmaWxlIDxjb2xvcj4nICsgdGhpcy5zZXNzaW9uSW5mby5zbWFsbFBhdGhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KVxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKHBhZ2VQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCB7IGF0dHJpYnV0ZXMsIGR5bmFtaWNDaGVja306IHsgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCwgZHluYW1pY0NoZWNrPzogYm9vbGVhbiB9KSB7XG4gICAgICAgIGNvbnN0IHJ1biA9IG5ldyBDUnVuVGltZSh0aGlzLmNvZGUsIHRoaXMuc2Vzc2lvbkluZm8sIHNtYWxsUGF0aCwgdGhpcy5pc1RzKTtcbiAgICAgICAgdGhpcy5jb2RlID0gYXdhaXQgcnVuLmNvbXBpbGUoYXR0cmlidXRlcyk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wYXJzZUJhc2UodGhpcy5jb2RlKTtcbiAgICAgICAgaWYodGhpcy5ub25EeW5hbWljKGR5bmFtaWNDaGVjaykpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRDb2RlRmlsZShwYWdlUGF0aCwgc21hbGxQYXRoLCB0aGlzLmlzVHMsIHBhZ2VOYW1lKTtcblxuICAgICAgICB0aGlzLmxvYWREZWZpbmUoeyAuLi5zZXR0aW5ncy5kZWZpbmUsIC4uLnJ1bi5kZWZpbmUgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwYXJzZUJhc2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBhd2FpdCBQYWdlQmFzZVBhcnNlcihjb2RlLmVxKTtcblxuICAgICAgICBpZihwYXJzZXIuc3RhcnQgPT0gcGFyc2VyLmVuZCl7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoY29uc3Qge2NoYXIsZW5kLGtleSxzdGFydH0gb2YgcGFyc2VyLnZhbHVlcyl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7a2V5LCB2YWx1ZTogc3RhcnQgPT09IGVuZCA/IHRydWU6IGNvZGUuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLCBjaGFyfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gY29kZS5zdWJzdHJpbmcoMCwgcGFyc2VyLnN0YXJ0KS5QbHVzKGNvZGUuc3Vic3RyaW5nKHBhcnNlci5lbmQpKS50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGQoKSB7XG4gICAgICAgIGlmICghdGhpcy52YWx1ZUFycmF5Lmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xlYXJEYXRhO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdAWycpO1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlLCBjaGFyIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfSBgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGAke2tleX0gYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYnVpbGQuc3Vic3RyaW5nKDAsIGJ1aWxkLmxlbmd0aC0xKS5QbHVzKCddXFxuJykuUGx1cyh0aGlzLmNsZWFyRGF0YSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgYXdhaXQgcGFyc2UucGFyc2VCYXNlKGNvZGUpO1xuXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwYXJzZS5ieVZhbHVlKCdpbmhlcml0JykpIHtcbiAgICAgICAgICAgIGlmKGlnbm9yZUluaGVyaXQuaW5jbHVkZXMobmFtZS50b0xvd2VyQ2FzZSgpKSkgY29udGludWU7XG4gICAgICAgICAgICBwYXJzZS5wb3AobmFtZSlcbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYDxAJHtuYW1lfT48OiR7bmFtZX0vPjwvQCR7bmFtZX0+YClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICByZXR1cm4gcGFyc2UuY2xlYXJEYXRhLlBsdXMoYnVpbGQpO1xuICAgIH1cblxuICAgIGdldChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkgPT09IG5hbWUpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UodGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5ID09PSBuYW1lKSwgMSlbMF0/LnZhbHVlO1xuICAgIH1cblxuICAgIHBvcEFueShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZU5hbWUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkudG9Mb3dlckNhc2UoKSA9PSBuYW1lKTtcblxuICAgICAgICBpZiAoaGF2ZU5hbWUgIT0gLTEpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZShoYXZlTmFtZSwgMSlbMF0udmFsdWU7XG5cbiAgICAgICAgY29uc3QgYXNUYWcgPSBnZXREYXRhVGFncyh0aGlzLmNsZWFyRGF0YSwgW25hbWVdLCAnQCcpO1xuXG4gICAgICAgIGlmICghYXNUYWcuZm91bmRbMF0pIHJldHVybjtcblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGFzVGFnLmRhdGE7XG5cbiAgICAgICAgcmV0dXJuIGFzVGFnLmZvdW5kWzBdLmRhdGEudHJpbSgpO1xuICAgIH1cblxuICAgIGJ5VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbHRlcih4ID0+IHgudmFsdWUgIT09IHRydWUgJiYgeC52YWx1ZS5lcSA9PT0gdmFsdWUpLm1hcCh4ID0+IHgua2V5KVxuICAgIH1cblxuICAgIHJlcGxhY2VWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKVxuICAgICAgICBpZiAoaGF2ZSkgaGF2ZS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGRlZmF1bHRWYWx1ZVBvcEFueTxUPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogVCk6IHN0cmluZyB8IFQgfCBudWxsIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBvcEFueShuYW1lKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlID8gZGVmYXVsdFZhbHVlIDogdmFsdWU/LmVxO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbG9hZENvZGVGaWxlKHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VTbWFsbFBhdGg6IHN0cmluZywgaXNUczogYm9vbGVhbiwgcGFnZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgaGF2ZUNvZGUgPSB0aGlzLmRlZmF1bHRWYWx1ZVBvcEFueSgnY29kZWZpbGUnLCAnaW5oZXJpdCcpO1xuICAgICAgICBpZiAoIWhhdmVDb2RlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbGFuZyA9IHRoaXMuZGVmYXVsdFZhbHVlUG9wQW55KCdsYW5nJywgJ2pzJyk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBoYXZlQ29kZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAob3JpZ2luYWxWYWx1ZSA9PSAnaW5oZXJpdCcpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhZ2VQYXRoO1xuXG4gICAgICAgIGNvbnN0IGhhdmVFeHQgPSBwYXRoLmV4dG5hbWUoaGF2ZUNvZGUpLnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIVsnanMnLCAndHMnXS5pbmNsdWRlcyhoYXZlRXh0KSkge1xuICAgICAgICAgICAgaWYgKC8oXFxcXHxcXC8pJC8udGVzdChoYXZlQ29kZSkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGFnZVBhdGguc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKGhhdmVFeHQpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhdGguZXh0bmFtZShwYWdlUGF0aCk7XG4gICAgICAgICAgICBoYXZlQ29kZSArPSAnLicgKyAobGFuZyA/IGxhbmcgOiBpc1RzID8gJ3RzJyA6ICdqcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhdmVDb2RlWzBdID09ICcuJylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWdlUGF0aCksIGhhdmVDb2RlKVxuXG4gICAgICAgIGNvbnN0IFNtYWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoaGF2ZUNvZGUpO1xuXG4gICAgICAgIGlmIChhd2FpdCB0aGlzLnNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLCBoYXZlQ29kZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBoYXZlQ29kZSwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gYmFzZU1vZGVsRGF0YS5hbGxEYXRhLnJlcGxhY2VBbGwoXCJAXCIsIFwiQEBcIik7XG5cbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjaygnPCUnKTtcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCclPicpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5kZWJ1ZyAmJiB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soYmFzZU1vZGVsRGF0YS5zdHJpbmdJbmZvKTtcblxuICAgICAgICB9IGVsc2UgaWYob3JpZ2luYWxWYWx1ZSA9PSAnaW5oZXJpdCcgJiYgdGhpcy5zZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKGhhdmVDb2RlLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgaWQ6IFNtYWxsUGF0aCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnY3JlYXRlLWNvZGUtZmlsZScsXG4gICAgICAgICAgICAgICAgdGV4dDogYFxcbkNvZGUgZmlsZSBjcmVhdGVkOiA8Y29sb3I+JHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlLWZpbGUtbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogPGNvbG9yPiR7cGFnZVBhdGh9PGxpbmU+JHtTbWFsbFBhdGh9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIocGFnZU5hbWUsIEpTUGFyc2VyLnByaW50RXJyb3IoYENvZGUgRmlsZSBOb3QgRm91bmQ6ICcke3BhZ2VTbWFsbFBhdGh9JyAtPiAnJHtTbWFsbFBhdGh9J2ApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNldHRpbmcobmFtZSA9ICdkZWZpbmUnLCBsaW1pdEFyZ3VtZW50cyA9IDIpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMuY2xlYXJEYXRhLmluZGV4T2YoYEAke25hbWV9KGApO1xuICAgICAgICBpZiAoaGF2ZSA9PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGFyZ3VtZW50QXJyYXk6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuY2xlYXJEYXRhLnN1YnN0cmluZygwLCBoYXZlKTtcbiAgICAgICAgbGV0IHdvcmtEYXRhID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKGhhdmUgKyA4KS50cmltU3RhcnQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbWl0QXJndW1lbnRzOyBpKyspIHsgLy8gYXJndW1lbnRzIHJlYWRlciBsb29wXG4gICAgICAgICAgICBjb25zdCBxdW90YXRpb25TaWduID0gd29ya0RhdGEuYXQoMCkuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZFF1b3RlID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKHdvcmtEYXRhLmVxLnN1YnN0cmluZygxKSwgcXVvdGF0aW9uU2lnbik7XG5cbiAgICAgICAgICAgIGFyZ3VtZW50QXJyYXkucHVzaCh3b3JrRGF0YS5zdWJzdHJpbmcoMSwgZW5kUXVvdGUpKTtcblxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJBcmd1bWVudCA9IHdvcmtEYXRhLnN1YnN0cmluZyhlbmRRdW90ZSArIDEpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgaWYgKGFmdGVyQXJndW1lbnQuYXQoMCkuZXEgIT0gJywnKSB7XG4gICAgICAgICAgICAgICAgd29ya0RhdGEgPSBhZnRlckFyZ3VtZW50O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQuc3Vic3RyaW5nKDEpLnRyaW1TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya0RhdGEgPSB3b3JrRGF0YS5zdWJzdHJpbmcod29ya0RhdGEuaW5kZXhPZignKScpICsgMSk7XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYmVmb3JlLnRyaW1FbmQoKS5QbHVzKHdvcmtEYXRhLnRyaW1TdGFydCgpKTtcblxuICAgICAgICByZXR1cm4gYXJndW1lbnRBcnJheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWREZWZpbmUobW9yZURlZmluZTogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IHN0cmluZylbXVtdID0gW107XG4gICAgICAgIHdoaWxlIChsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlcy51bnNoaWZ0KGxhc3RWYWx1ZSk7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZXMudW5zaGlmdCguLi5PYmplY3QuZW50cmllcyhtb3JlRGVmaW5lKSlcblxuICAgICAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IHRoaXMuY2xlYXJEYXRhLnJlcGxhY2VBbGwoYDoke25hbWV9OmAsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGNvbXBpbGVJbXBvcnQgfSBmcm9tIFwiLi4vLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0xvZ2dlclwiO1xuaW1wb3J0IHsgQ29udmVydFN5bnRheE1pbmkgfSBmcm9tIFwiLi4vLi4vUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXhcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tIFwiLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmdcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vSlNQYXJzZXJcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1J1blRpbWUge1xuICAgIGRlZmluZSA9IHt9XG4gICAgY29uc3RydWN0b3IocHVibGljIHNjcmlwdDogU3RyaW5nVHJhY2tlciwgcHVibGljIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGlzVHM6IGJvb2xlYW4pIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgdGVtcGxhdGVTY3JpcHQoc2NyaXB0czogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgY29uc3QgX193cml0ZUFycmF5ID0gW11cbiAgICAgICAgdmFyIF9fd3JpdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCl7XG4gICAgICAgICAgICBfX3dyaXRlLnRleHQgKz0gdGV4dDtcbiAgICAgICAgfWApXG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYFxcbl9fd3JpdGUgPSB7dGV4dDogJyd9O19fd3JpdGVBcnJheS51bnNoaWZ0KF9fd3JpdGUpO2ApXG4gICAgICAgICAgICBidWlsZC5QbHVzKGkpXG4gICAgICAgIH1cblxuICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG5yZXR1cm4gX193cml0ZUFycmF5YCk7XG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ldGhvZHMoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBfX2xvY2FscGF0aCA9ICcvJyArIHNtYWxsUGF0aFRvUGFnZSh0aGlzLnNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHJpbmc6ICdzY3JpcHQsc3R5bGUsZGVmaW5lLHN0b3JlLHBhZ2VfX2ZpbGVuYW1lLHBhZ2VfX2Rpcm5hbWUsX19sb2NhbHBhdGgsYXR0cmlidXRlcycsXG4gICAgICAgICAgICBmdW5jczogW1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc2NyaXB0LmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zdHlsZS5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kZWZpbmVbU3RyaW5nKGtleSldID0gdmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jb21waWxlUnVuVGltZVN0b3JlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgpLFxuICAgICAgICAgICAgICAgIF9fbG9jYWxwYXRoLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgfHwge31cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZENvZGUocGFyc2VyOiBKU1BhcnNlciwgYnVpbGRTdHJpbmdzOiB7IHRleHQ6IHN0cmluZyB9W10pIHtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoaS50ZXh0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYnVpbGRTdHJpbmdzLnBvcCgpLnRleHQsIGkudGV4dC5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgYXN5bmMgY29tcGlsZShhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIC8qIGxvYWQgZnJvbSBjYWNoZSAqL1xuICAgICAgICBjb25zdCBoYXZlQ2FjaGUgPSB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF07XG4gICAgICAgIGlmIChoYXZlQ2FjaGUpXG4gICAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhdmVDYWNoZSkodGhpcy5tZXRob2RzKGF0dHJpYnV0ZXMpLmZ1bmNzKTtcbiAgICAgICAgbGV0IGRvRm9yQWxsOiAocmVzb2x2ZTogKGZ1bmNzOiBhbnlbXSkgPT4gU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pID0+IHZvaWQ7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gZG9Gb3JBbGwgPSByKTtcblxuICAgICAgICAvKiBydW4gdGhlIHNjcmlwdCAqL1xuICAgICAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IENvbnZlcnRTeW50YXhNaW5pKHRoaXMuc2NyaXB0LCBcIkBjb21waWxlXCIsIFwiKlwiKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRoaXMuc2NyaXB0LCB0aGlzLnNtYWxsUGF0aCwgJzwlKicsICclPicpO1xuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBpZiAocGFyc2VyLnZhbHVlcy5sZW5ndGggPT0gMSAmJiBwYXJzZXIudmFsdWVzWzBdLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgY29uc3QgcmVzb2x2ZSA9ICgpID0+IHRoaXMuc2NyaXB0O1xuICAgICAgICAgICAgZG9Gb3JBbGwocmVzb2x2ZSk7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSByZXNvbHZlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW3R5cGUsIGZpbGVQYXRoXSA9IFNwbGl0Rmlyc3QoJy8nLCB0aGlzLnNtYWxsUGF0aCksIHR5cGVBcnJheSA9IGdldFR5cGVzW3R5cGVdID8/IGdldFR5cGVzLlN0YXRpYyxcbiAgICAgICAgICAgIGNvbXBpbGVQYXRoID0gdHlwZUFycmF5WzFdICsgZmlsZVBhdGggKyAnLmNvbXAuanMnO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGZpbGVQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZVNjcmlwdChwYXJzZXIudmFsdWVzLmZpbHRlcih4ID0+IHgudHlwZSAhPSAndGV4dCcpLm1hcCh4ID0+IHgudGV4dCkpO1xuICAgICAgICBjb25zdCB7IGZ1bmNzLCBzdHJpbmcgfSA9IHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKVxuXG4gICAgICAgIGNvbnN0IHRvSW1wb3J0ID0gYXdhaXQgY29tcGlsZUltcG9ydChzdHJpbmcsIGNvbXBpbGVQYXRoLCBmaWxlUGF0aCwgdHlwZUFycmF5LCB0aGlzLmlzVHMsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIHRlbXBsYXRlKTtcblxuICAgICAgICBjb25zdCBleGVjdXRlID0gYXN5bmMgKGZ1bmNzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWJ1aWxkQ29kZShwYXJzZXIsIGF3YWl0IHRvSW1wb3J0KC4uLmZ1bmNzKSk7XG4gICAgICAgICAgICB9IGNhdGNoKGVycil7XG4gICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IGVycixcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gZXhlY3V0ZTsgLy8gc2F2ZSB0aGlzIHRvIGNhY2hlXG4gICAgICAgIGNvbnN0IHRoaXNGaXJzdCA9IGF3YWl0IGV4ZWN1dGUoZnVuY3MpO1xuICAgICAgICBkb0ZvckFsbChleGVjdXRlKVxuXG4gICAgICAgIHJldHVybiB0aGlzRmlyc3Q7XG4gICAgfVxufSIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9Mb2dnZXJcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBpc1RzIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHBhZ2VEZXBzIH0gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlRGVwc1wiO1xuaW1wb3J0IEN1c3RvbUltcG9ydCwgeyBpc1BhdGhDdXN0b20gfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvaW5kZXhcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yLCBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwgfSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWRcIjtcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L0FsaWFzXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5pbXBvcnQgeyBDb21tb25qcywgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgcGFyc2VyOiB7XG4gICAgICAgIHN5bnRheDogaXNUeXBlc2NyaXB0ID8gXCJ0eXBlc2NyaXB0XCIgOiBcImVjbWFzY3JpcHRcIixcbiAgICAgICAgLi4uR2V0UGx1Z2luKChpc1R5cGVzY3JpcHQgPyAnVFMnIDogJ0pTJykgKyBcIk9wdGlvbnNcIilcbiAgICAgIH1cbiAgICB9KSxcbiAgICBtaW5pZnk6IGNvZGVNaW5pZnksXG4gICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgIHNvdXJjZU1hcHM6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/IHRydWUgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBvdXRwdXRQYXRoOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKVxuICB9KTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7IGRlYnVnOiBcIlwiICsgaXNEZWJ1ZyB9KTtcbiAgUmVzdWx0ID0gdGVtcGxhdGUoXG4gICAgUmVzdWx0LFxuICAgIGlzRGVidWcsXG4gICAgcGF0aC5kaXJuYW1lKHRlbXBsYXRlUGF0aCksXG4gICAgdGVtcGxhdGVQYXRoLFxuICAgIHBhcmFtc1xuICApO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShSZXN1bHQsIE9wdGlvbnMpO1xuICAgIFJlc3VsdCA9IG1lcmdlVHJhY2sgJiYgbWFwICYmIChhd2FpdCBiYWNrVG9PcmlnaW5hbChtZXJnZVRyYWNrLCBjb2RlLCBtYXApKS5TdHJpbmdXaXRoVGFjayhzYXZlUGF0aCkgfHwgY29kZTtcblxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNhdmVQYXRoKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHNhdmVQYXRoLCBSZXN1bHQpO1xuICB9XG4gIHJldHVybiBSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIENoZWNrVHMoRmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gRmlsZVBhdGguZW5kc1dpdGgoXCIudHNcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gIHJldHVybiBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICB0eXBlQXJyYXlbMF0gKyBJblN0YXRpY1BhdGgsXG4gICAgdHlwZUFycmF5WzFdICsgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIsXG4gICAgQ2hlY2tUcyhJblN0YXRpY1BhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRFeHRlbnNpb24oRmlsZVBhdGg6IHN0cmluZykge1xuICBjb25zdCBmaWxlRXh0ID0gcGF0aC5leHRuYW1lKEZpbGVQYXRoKTtcblxuICBpZiAoQmFzaWNTZXR0aW5ncy5wYXJ0RXh0ZW5zaW9ucy5pbmNsdWRlcyhmaWxlRXh0LnN1YnN0cmluZygxKSkpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyAoaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiKVxuICBlbHNlIGlmIChmaWxlRXh0ID09ICcnKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNbaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiXTtcblxuICByZXR1cm4gRmlsZVBhdGg7XG59XG5cbmNvbnN0IFNhdmVkTW9kdWxlcyA9IHt9LCBQcmVwYXJlTWFwID0ge307XG5cbi8qKlxuICogTG9hZEltcG9ydCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIHRvIGEgZmlsZSwgYW5kIHJldHVybnMgdGhlIG1vZHVsZSB0aGF0IGlzIGF0IHRoYXQgcGF0aFxuICogQHBhcmFtIHtzdHJpbmdbXX0gaW1wb3J0RnJvbSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY3JlYXRlZCB0aGlzIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBJblN0YXRpY1BhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBbdXNlRGVwc10gLSBUaGlzIGlzIGEgbWFwIG9mIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHdpdGhvdXRDYWNoZSAtIGFuIGFycmF5IG9mIHBhdGhzIHRoYXQgd2lsbCBub3QgYmUgY2FjaGVkLlxuICogQHJldHVybnMgVGhlIG1vZHVsZSB0aGF0IHdhcyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gTG9hZEltcG9ydChpbXBvcnRGcm9tOiBzdHJpbmdbXSwgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIHsgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGUgPSBbXSwgb25seVByZXBhcmUgfTogeyBpc0RlYnVnOiBib29sZWFuLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSwgb25seVByZXBhcmU/OiBib29sZWFuIH0pIHtcbiAgbGV0IFRpbWVDaGVjazogYW55O1xuICBjb25zdCBvcmlnaW5hbFBhdGggPSBwYXRoLm5vcm1hbGl6ZShJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG5cbiAgSW5TdGF0aWNQYXRoID0gQWRkRXh0ZW5zaW9uKEluU3RhdGljUGF0aCk7XG4gIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShJblN0YXRpY1BhdGgpLnN1YnN0cmluZygxKSwgdGhpc0N1c3RvbSA9IGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGgsIGV4dGVuc2lvbikgfHwgIVsnanMnLCAndHMnXS5pbmNsdWRlcyhleHRlbnNpb24pO1xuICBjb25zdCBTYXZlZE1vZHVsZXNQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoKSwgZmlsZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBJblN0YXRpY1BhdGgpO1xuXG4gIGlmKGltcG9ydEZyb20uaW5jbHVkZXMoU2F2ZWRNb2R1bGVzUGF0aCkpe1xuICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICBlcnJvck5hbWU6ICdjaXJjbGUtaW1wb3J0JyxcbiAgICAgIHRleHQ6IGBJbXBvcnQgJyR7U2F2ZWRNb2R1bGVzUGF0aH0nIGNyZWF0ZXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5IDxjb2xvcj4ke2ltcG9ydEZyb20uc2xpY2UoaW1wb3J0RnJvbS5pbmRleE9mKFNhdmVkTW9kdWxlc1BhdGgpKS5jb25jYXQoZmlsZVBhdGgpLmpvaW4oJyAtPlxcbicpfWBcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBudWxsXG4gICAgdXNlRGVwc1tJblN0YXRpY1BhdGhdID0geyB0aGlzRmlsZTogLTEgfTtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy93YWl0IGlmIHRoaXMgbW9kdWxlIGlzIG9uIHByb2Nlc3MsIGlmIG5vdCBkZWNsYXJlIHRoaXMgYXMgb24gcHJvY2VzcyBtb2R1bGVcbiAgbGV0IHByb2Nlc3NFbmQ6ICh2PzogYW55KSA9PiB2b2lkO1xuICBpZiAoIW9ubHlQcmVwYXJlKSB7XG4gICAgaWYgKCFTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0pXG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IHByb2Nlc3NFbmQgPSByKTtcbiAgICBlbHNlIGlmIChTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgYXdhaXQgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuICB9XG5cblxuICAvL2J1aWxkIHBhdGhzXG4gIGNvbnN0IHJlQnVpbGQgPSAhcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gfHwgcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gIT0gKFRpbWVDaGVjayA9IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCkpO1xuXG5cbiAgaWYgKHJlQnVpbGQpIHtcbiAgICBUaW1lQ2hlY2sgPSBUaW1lQ2hlY2sgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKTtcbiAgICBpZiAoVGltZUNoZWNrID09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7SW5TdGF0aWNQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gPGNvbG9yPicke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRofS8ke2ltcG9ydEZyb20uYXQoLTEpfSdgXG4gICAgICB9KTtcbiAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbnVsbFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpc0N1c3RvbSkgLy8gb25seSBpZiBub3QgY3VzdG9tIGJ1aWxkXG4gICAgICBhd2FpdCBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gICAgcGFnZURlcHMudXBkYXRlKFNhdmVkTW9kdWxlc1BhdGgsIFRpbWVDaGVjayk7XG4gIH1cblxuICBpZiAodXNlRGVwcykge1xuICAgIHVzZURlcHNbSW5TdGF0aWNQYXRoXSA9IHsgdGhpc0ZpbGU6IFRpbWVDaGVjayB9O1xuICAgIHVzZURlcHMgPSB1c2VEZXBzW0luU3RhdGljUGF0aF07XG4gIH1cblxuICBjb25zdCBpbmhlcml0YW5jZUNhY2hlID0gd2l0aG91dENhY2hlWzBdID09IEluU3RhdGljUGF0aDtcbiAgaWYgKGluaGVyaXRhbmNlQ2FjaGUpXG4gICAgd2l0aG91dENhY2hlLnNoaWZ0KClcbiAgZWxzZSBpZiAoIXJlQnVpbGQgJiYgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdICYmICEoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgcmV0dXJuIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoSW5TdGF0aWNQYXRoKSwgcCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoWy4uLmltcG9ydEZyb20sIFNhdmVkTW9kdWxlc1BhdGhdLCBwLCB0eXBlQXJyYXksIHsgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlOiBpbmhlcml0YW5jZUNhY2hlID8gd2l0aG91dENhY2hlIDogW10gfSk7XG4gIH1cblxuICBsZXQgTXlNb2R1bGU6IGFueTtcbiAgaWYgKHRoaXNDdXN0b20pIHtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGgsIGZpbGVQYXRoLCBleHRlbnNpb24sIHJlcXVpcmVNYXApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlcXVpcmVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIpO1xuICAgIE15TW9kdWxlID0gSW1wb3J0V2l0aG91dENhY2hlKHJlcXVpcmVQYXRoKTtcblxuICAgIGlmIChvbmx5UHJlcGFyZSkgeyAvLyBvbmx5IHByZXBhcmUgdGhlIG1vZHVsZSB3aXRob3V0IGFjdGl2ZWx5IGltcG9ydGluZyBpdFxuICAgICAgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSA9ICgpID0+IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7IFxuICAgICAgTXlNb2R1bGUgPSBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwKTtcbiAgICB9XG4gICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LWVycm9yJyxcbiAgICAgICAgdGV4dDogYCR7ZXJyLm1lc3NhZ2V9PGNvbG9yPiR7aW1wb3J0RnJvbS5jb25jYXQoZmlsZVBhdGgpLnJldmVyc2UoKS5qb2luKCcgLT5cXG4nKX1gXG4gICAgICB9KTtcbiAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICB9XG4gIH1cblxuICAvL2luIGNhc2Ugb24gYW4gZXJyb3IgLSByZWxlYXNlIHRoZSBhc3luY1xuICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBNeU1vZHVsZTtcbiAgcHJvY2Vzc0VuZD8uKCk7XG5cblxuICByZXR1cm4gTXlNb2R1bGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbXBvcnRGaWxlKGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10pIHtcbiAgaWYgKCFpc0RlYnVnKSB7XG4gICAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCBoYXZlSW1wb3J0ID0gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gICAgaWYgKGhhdmVJbXBvcnQgIT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGhhdmVJbXBvcnQ7XG4gICAgZWxzZSBpZiAoUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSkge1xuICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSgpO1xuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbW9kdWxlO1xuICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTG9hZEltcG9ydChbaW1wb3J0RnJvbV0sIEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCB7IGlzRGVidWcsIHVzZURlcHMsIHdpdGhvdXRDYWNoZSB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVPbmNlKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgZmlsZVBhdGgsXG4gICAgdGVtcEZpbGUsXG4gICAgQ2hlY2tUcyhmaWxlUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBhd2FpdCBNeU1vZHVsZSgocGF0aDogc3RyaW5nKSA9PiBpbXBvcnQocGF0aCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUNqc1NjcmlwdChjb250ZW50OiBzdHJpbmcpIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG4gIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGVtcEZpbGUsIGNvbnRlbnQpO1xuXG4gIGNvbnN0IG1vZGVsID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIG1vZGVsO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmFrZSBzY3JpcHQgbG9jYXRpb24sIGEgZmlsZSBsb2NhdGlvbiwgYSB0eXBlIGFycmF5LCBhbmQgYSBib29sZWFuIGZvciB3aGV0aGVyIG9yIG5vdCBpdCdzXG4gKiBhIFR5cGVTY3JpcHQgZmlsZS4gSXQgdGhlbiBjb21waWxlcyB0aGUgc2NyaXB0IGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biB0aGUgbW9kdWxlXG4gKiBUaGlzIGlzIGZvciBSdW5UaW1lIENvbXBpbGUgU2NyaXB0c1xuICogQHBhcmFtIHtzdHJpbmd9IGdsb2JhbFByYW1zIC0gc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZyxcbiAqIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY3JpcHRMb2NhdGlvbiAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgc2NyaXB0IHRvIGJlIGNvbXBpbGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSAtIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBmaWxlIGZyb20gdGhlIHN0YXRpYyBmb2xkZXIuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBbc3RyaW5nLCBzdHJpbmddXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZVNjcmlwdCAtIGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBJZiB0cnVlLCB0aGUgY29kZSB3aWxsIGJlIGNvbXBpbGVkIHdpdGggZGVidWcgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZUNvZGUgLSBUaGUgY29kZSB0aGF0IHdpbGwgYmUgY29tcGlsZWQgYW5kIHNhdmVkIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU1hcENvbW1lbnQgLSBzdHJpbmdcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVJbXBvcnQoZ2xvYmFsUHJhbXM6IHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgbWVyZ2VUcmFjazogU3RyaW5nVHJhY2tlcikge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgdHlwZUFycmF5WzFdKTtcblxuICBjb25zdCBmdWxsU2F2ZUxvY2F0aW9uID0gc2NyaXB0TG9jYXRpb24gKyBcIi5janNcIjtcbiAgY29uc3QgdGVtcGxhdGVQYXRoID0gdHlwZUFycmF5WzBdICsgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlO1xuXG4gIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHNjcmlwdExvY2F0aW9uLFxuICAgIGZ1bGxTYXZlTG9jYXRpb24sXG4gICAgaXNUeXBlU2NyaXB0LFxuICAgIGlzRGVidWcsXG4gICAgeyBwYXJhbXM6IGdsb2JhbFByYW1zLCBtZXJnZVRyYWNrLCB0ZW1wbGF0ZVBhdGgsIGNvZGVNaW5pZnk6IGZhbHNlIH1cbiAgKTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHApO1xuXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoW3RlbXBsYXRlUGF0aF0sIHAsIHR5cGVBcnJheSwgeyBpc0RlYnVnIH0pO1xuICB9XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoZnVsbFNhdmVMb2NhdGlvbik7XG4gIHJldHVybiBhc3luYyAoLi4uYXJyOiBhbnlbXSkgPT4gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCwgLi4uYXJyKTtcbn0iLCAiaW1wb3J0IHsgU3RyaW5nTWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgTWluaVNlYXJjaCwge1NlYXJjaE9wdGlvbnMsIFNlYXJjaFJlc3VsdH0gZnJvbSAnbWluaXNlYXJjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFJlY29yZCB7XG4gICAgcHJpdmF0ZSBmdWxsUGF0aDogc3RyaW5nXG4gICAgcHJpdmF0ZSBpbmRleERhdGE6IHtba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIHRpdGxlczogU3RyaW5nTWFwLFxuICAgICAgICB0ZXh0OiBzdHJpbmdcbiAgICB9fVxuICAgIHByaXZhdGUgbWluaVNlYXJjaDogTWluaVNlYXJjaDtcbiAgICBjb25zdHJ1Y3RvcihmaWxlcGF0aDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5mdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGZpbGVwYXRoICsgJy5qc29uJ1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoKXtcbiAgICAgICAgdGhpcy5pbmRleERhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZnVsbFBhdGgpO1xuICAgICAgICBjb25zdCB1bndyYXBwZWQ6IHtpZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nfVtdID0gW107XG5cbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IoY29uc3QgcGF0aCBpbiB0aGlzLmluZGV4RGF0YSl7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5pbmRleERhdGFbcGF0aF07XG4gICAgICAgICAgICBmb3IoY29uc3QgaWQgaW4gZWxlbWVudC50aXRsZXMpe1xuICAgICAgICAgICAgICAgIHVud3JhcHBlZC5wdXNoKHtpZDogY291bnRlcisrLCB0ZXh0OiBlbGVtZW50LnRpdGxlc1tpZF0sIHVybDogYC8ke3BhdGh9IyR7aWR9YH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGV4dCwgdXJsOiBgLyR7cGF0aH1gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2ggPSBuZXcgTWluaVNlYXJjaCh7XG4gICAgICAgICAgICBmaWVsZHM6IFsndGV4dCddLFxuICAgICAgICAgICAgc3RvcmVGaWVsZHM6IFsnaWQnLCAndGV4dCcsICd1cmwnXVxuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLm1pbmlTZWFyY2guYWRkQWxsQXN5bmModW53cmFwcGVkKTtcbiAgICB9XG5cbi8qKlxuICogSXQgc2VhcmNoZXMgZm9yIGEgc3RyaW5nIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIG1hdGNoZXNcbiAqIEBwYXJhbSB0ZXh0IC0gVGhlIHRleHQgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSBvcHRpb25zIC0gbGVuZ3RoIC0gbWF4aW11bSBsZW5ndGggLSAqbm90IGN1dHRpbmcgaGFsZiB3b3JkcypcbiAqIFxuICogYWRkQWZ0ZXJNYXhMZW5ndGggLSBhZGQgdGV4dCBpZiBhIHRleHQgcmVzdWx0IHJlYWNoIHRoZSBtYXhpbXVtIGxlbmd0aCwgZm9yIGV4YW1wbGUgJy4uLidcbiAqIEBwYXJhbSB0YWcgLSBUaGUgdGFnIHRvIHdyYXAgYXJvdW5kIHRoZSBmb3VuZGVkIHNlYXJjaCB0ZXJtcy5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIG9iamVjdHMsIGVhY2ggb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGB0ZXh0YCBvZiB0aGUgc2VhcmNoIHJlc3VsdCwgYGxpbmtgIHRvIHRoZSBwYWdlLCBhbmQgYW4gYXJyYXkgb2ZcbiAqIG9iamVjdHMgY29udGFpbmluZyB0aGUgdGVybXMgYW5kIHRoZSBpbmRleCBvZiB0aGUgdGVybSBpbiB0aGUgdGV4dC5cbiAqL1xuICAgIHNlYXJjaCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgJiB7bGVuZ3RoPzogbnVtYmVyLCBhZGRBZnRlck1heExlbmd0aD86IHN0cmluZ30gPSB7ZnV6enk6IHRydWUsIGxlbmd0aDogMjAwLCBhZGRBZnRlck1heExlbmd0aDogJy4uLid9LCB0YWcgPSAnYicpOiAoU2VhcmNoUmVzdWx0ICYge3RleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9KVtde1xuICAgICAgICBjb25zdCBkYXRhID0gPGFueT50aGlzLm1pbmlTZWFyY2guc2VhcmNoKHRleHQsIG9wdGlvbnMpO1xuICAgICAgICBpZighdGFnKSByZXR1cm4gZGF0YTtcblxuICAgICAgICBmb3IoY29uc3QgaSBvZiBkYXRhKXtcbiAgICAgICAgICAgIGZvcihjb25zdCB0ZXJtIG9mIGkudGVybXMpe1xuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubGVuZ3RoICYmIGkudGV4dC5sZW5ndGggPiBvcHRpb25zLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IGkudGV4dC5zdWJzdHJpbmcoMCwgb3B0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZihpLnRleHRbb3B0aW9ucy5sZW5ndGhdLnRyaW0oKSAhPSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBzdWJzdHJpbmcuc3Vic3RyaW5nKDAsIHN1YnN0cmluZy5sYXN0SW5kZXhPZignICcpKSArIChvcHRpb25zLmFkZEFmdGVyTWF4TGVuZ3RoID8/ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IHN1YnN0cmluZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IGkudGV4dC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBsb3dlciA9IGkudGV4dC50b0xvd2VyQ2FzZSgpLCByZWJ1aWxkID0gJyc7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICBsZXQgYmVlbkxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShpbmRleCAhPSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHJlYnVpbGQgKz0gaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoLCBiZWVuTGVuZ3RoICsgaW5kZXgpICsgIGA8JHt0YWd9PiR7aS50ZXh0LnN1YnN0cmluZyhpbmRleCArIGJlZW5MZW5ndGgsIGluZGV4ICsgdGVybS5sZW5ndGggKyBiZWVuTGVuZ3RoKX08LyR7dGFnfT5gXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbG93ZXIuc3Vic3RyaW5nKGluZGV4ICsgdGVybS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBiZWVuTGVuZ3RoICs9IGluZGV4ICsgdGVybS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpLnRleHQgPSByZWJ1aWxkICsgaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHN1Z2dlc3QodGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluaVNlYXJjaC5hdXRvU3VnZ2VzdCh0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG59IiwgImltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSBcIi4uLy4uLy4uL0dsb2JhbC9TZWFyY2hSZWNvcmRcIlxuaW1wb3J0IHtTZXR0aW5nc30gIGZyb20gJy4uLy4uLy4uL01haW5CdWlsZC9TZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG59IiwgImltcG9ydCBwYWNrYWdlRXhwb3J0IGZyb20gXCIuL3BhY2thZ2VFeHBvcnRcIjtcblxuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGFsaWFzTmFtZXMgPSBbcGFja2FnZU5hbWVdXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGg6IHN0cmluZyk6IGFueSB7XG5cbiAgICBzd2l0Y2ggKG9yaWdpbmFsUGF0aCkge1xuICAgICAgICAvL0B0cy1pZ25vcmUtbmV4dC1saW5lXG4gICAgICAgIGNhc2UgcGFja2FnZU5hbWU6XG4gICAgICAgICAgICByZXR1cm4gcGFja2FnZUV4cG9ydCgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXNPclBhY2thZ2Uob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXZlID0gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoaGF2ZSkgcmV0dXJuIGhhdmVcbiAgICByZXR1cm4gaW1wb3J0KG9yaWdpbmFsUGF0aCk7XG59IiwgImltcG9ydCBJbXBvcnRBbGlhcywgeyBhbGlhc05hbWVzIH0gZnJvbSAnLi9BbGlhcyc7XG5pbXBvcnQgSW1wb3J0QnlFeHRlbnNpb24sIHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuL0V4dGVuc2lvbi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikgfHwgYWxpYXNOYW1lcy5pbmNsdWRlcyhvcmlnaW5hbFBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nLCByZXF1aXJlOiAocDogc3RyaW5nKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGlhc0V4cG9ydCA9IGF3YWl0IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGFsaWFzRXhwb3J0KSByZXR1cm4gYWxpYXNFeHBvcnQ7XG4gICAgcmV0dXJuIEltcG9ydEJ5RXh0ZW5zaW9uKGZ1bGxQYXRoLCBleHRlbnNpb24pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBSYXpvclRvRUpTLCBSYXpvclRvRUpTTWluaSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyJztcblxuXG5jb25zdCBhZGRXcml0ZU1hcCA9IHtcbiAgICBcImluY2x1ZGVcIjogXCJhd2FpdCBcIixcbiAgICBcImltcG9ydFwiOiBcImF3YWl0IFwiLFxuICAgIFwidHJhbnNmZXJcIjogXCJyZXR1cm4gYXdhaXQgXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBvcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKUyh0ZXh0LmVxKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhzdWJzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU9JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlOiR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZFdyaXRlTWFwW2kubmFtZV19JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuXG4vKipcbiAqIENvbnZlcnRTeW50YXhNaW5pIHRha2VzIHRoZSBjb2RlIGFuZCBhIHNlYXJjaCBzdHJpbmcgYW5kIGNvbnZlcnQgY3VybHkgYnJhY2tldHNcbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbmQgLSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWRkRUpTIC0gVGhlIHN0cmluZyB0byBhZGQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlanMuXG4gKiBAcmV0dXJucyBBIHN0cmluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXhNaW5pKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbmQ6IHN0cmluZywgYWRkRUpTOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTTWluaSh0ZXh0LmVxLCBmaW5kKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICBpZiAodmFsdWVzW2ldICE9IHZhbHVlc1tpICsgMV0pXG4gICAgICAgICAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpXSwgdmFsdWVzW2kgKyAxXSkpO1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaSArIDJdLCB2YWx1ZXNbaSArIDNdKTtcbiAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZEVKU30ke3N1YnN0cmluZ30lPmA7XG4gICAgfVxuXG4gICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZygodmFsdWVzLmF0KC0xKT8/LTEpICsgMSkpO1xuXG4gICAgcmV0dXJuIGJ1aWxkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBvb2wgfSBmcm9tIFwiLi4vQmFzZVJlYWRlci9SZWFkZXJcIjtcblxuYXN5bmMgZnVuY3Rpb24gSFRNTEF0dHJQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc2s6IG51bWJlcixcbiAgICBlazogbnVtYmVyLFxuICAgIHN2OiBudW1iZXIsXG4gICAgZXY6IG51bWJlcixcbiAgICBzcGFjZTogYm9vbGVhbixcbiAgICBjaGFyOiBzdHJpbmdcbn1bXT4ge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgcG9vbC5leGVjKCdIVE1MQXR0clBhcnNlcicsIFt0ZXh0XSlcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ0RhdGFQYXJzZXIge1xuICAgIHZhbHVlQXJyYXk6IHtcbiAgICAgICAga2V5PzogU3RyaW5nVHJhY2tlclxuICAgICAgICB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsXG4gICAgICAgIHNwYWNlOiBib29sZWFuLFxuICAgICAgICBjaGFyPzogc3RyaW5nXG4gICAgfVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGV4dDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VyKCkge1xuICAgICAgICBjb25zdCBwYXJzZSA9IGF3YWl0IEhUTUxBdHRyUGFyc2VyKHRoaXMudGV4dC5lcSk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGNoYXIsIGVrLCBldiwgc2ssIHNwYWNlLCBzdiB9IG9mIHBhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGNoYXIsIHNwYWNlLCBrZXk6IHRoaXMudGV4dC5zdWJzdHJpbmcoc2ssIGVrKSwgdmFsdWU6IHN2ID09IGV2ID8gdHJ1ZSA6IHRoaXMudGV4dC5zdWJzdHJpbmcoc3YsIGV2KSB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3BJdGVtKGtleTogc3RyaW5nKXtcbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09IC0xID8gbnVsbDogdGhpcy52YWx1ZUFycmF5LnNwbGljZShpbmRleCwgMSkuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBwb3BUcmFja2VyKGtleTogc3RyaW5nKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0VHJhY2tlcjxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wVHJhY2tlcihrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlUcmFja2VyPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFRyYWNrZXIoa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gZGF0YS5lcTogdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wU3RyaW5nKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gdmFsdWUuZXEgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BCb29sZWFuKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMucG9wU3RyaW5nKGtleSkgPz8gZGVmYXVsdFZhbHVlKVxuICAgIH1cblxuICAgIGV4aXN0cyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSkgIT0gbnVsbFxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YTogdmFsdWU7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSAnY2xhc3MnKTtcbiAgICAgICAgaWYgKGhhdmU/LnZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcilcbiAgICAgICAgICAgIGhhdmUudmFsdWUuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcgKyBjbGFzc05hbWUpLnRyaW1TdGFydCgpO1xuICAgICAgICBlbHNlIGlmIChoYXZlPy52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaGF2ZS52YWx1ZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hWYWx1ZSgnY2xhc3MnLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVidWlsZFNwYWNlKCkge1xuICAgICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgdmFsdWUsIGNoYXIsIGtleSwgc3BhY2UgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIHNwYWNlICYmIG5ld0F0dHJpYnV0ZXMuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBwdXNoVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpO1xuICAgICAgICBpZiAoaGF2ZSkgcmV0dXJuIChoYXZlLnZhbHVlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpKTtcblxuICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwga2V5KSwgdmFsdWU6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKSwgY2hhcjogJ1wiJywgc3BhY2U6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgbWFwKCkge1xuICAgICAgICBjb25zdCBhdHRyTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IHRydWUgfSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSBhdHRyTWFwW2tleS5lcV0gPSB2YWx1ZSA9PT0gdHJ1ZSA/IHRydWUgOiB2YWx1ZS5lcTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyTWFwO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0X2ZpbGUgPSBydW5fc2NyaXB0X25hbWUuc3BsaXQoLy0+fDxsaW5lPi8pLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPChsaW5lfGNvbG9yKT4vZ2ksICc8YnIvPicpICsgJzwvcD48cD5FcnJvciBtZXNzYWdlOiAnICsgZS5tZXNzYWdlICsgJzwvcD5gKX0nO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBhdGg6IFwiICsgcnVuX3NjcmlwdF9uYW1lLnNsaWNlKDAsIC1sYXN0X2ZpbGUubGVuZ3RoKS5yZXBsYWNlKC88bGluZT4vZ2ksICdcXFxcbicpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCl9XCIgKyBsYXN0X2ZpbGUudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIG1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJ1bm5pbmcgdGhpcyBjb2RlOiBcXFxcXCJcIiArIHJ1bl9zY3JpcHRfY29kZSArICdcIicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc3RhY2s6IFwiICsgZS5zdGFjayk7XG4gICAgICAgICAgICAgICAgfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGB9fSk7fWApO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgICAgICBjb25zdCBidWlsdENvZGUgPSBhd2FpdCBQYWdlVGVtcGxhdGUuUnVuQW5kRXhwb3J0KHRleHQsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5kZWJ1Zyk7XG5cbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5BZGRQYWdlVGVtcGxhdGUoYnVpbHRDb2RlLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgc3RhdGljIEFkZEFmdGVyQnVpbGQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIEluUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGRhdGFPYmplY3Q6IGFueSwgZnVsbFBhdGg6IHN0cmluZykge1xuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGA8JSF7XG4gICAgICAgICAgICBjb25zdCBfcGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gey4uLl9wYWdlJHtkYXRhT2JqZWN0ID8gJywnICsgZGF0YU9iamVjdCA6ICcnfX07XG4gICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAgeyU+YCk7XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCc8JSF9fX0lPicpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgUmF6b3JTeW50YXggZnJvbSAnLi9SYXpvclN5bnRheCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2V0U3ludGF4KENvbXBpbGVUeXBlOiBhbnkpIHtcbiAgICBsZXQgZnVuYzogYW55O1xuICAgIHN3aXRjaCAoQ29tcGlsZVR5cGUubmFtZSB8fCBDb21waWxlVHlwZSkge1xuICAgICAgICBjYXNlIFwiUmF6b3JcIjpcbiAgICAgICAgICAgIGZ1bmMgPSBSYXpvclN5bnRheDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbn0iLCAiaW1wb3J0IEFkZFN5bnRheCBmcm9tICcuL1N5bnRheC9JbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkUGx1Z2luIHtcblx0cHVibGljIFNldHRpbmdzT2JqZWN0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihTZXR0aW5nc09iamVjdDoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICAgICAgdGhpcy5TZXR0aW5nc09iamVjdCA9IFNldHRpbmdzT2JqZWN0XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZGVmYXVsdFN5bnRheCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5TZXR0aW5nc09iamVjdC5CYXNpY0NvbXBpbGF0aW9uU3ludGF4LmNvbmNhdCh0aGlzLlNldHRpbmdzT2JqZWN0LkFkZENvbXBpbGVTeW50YXgpO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkQmFzaWModGV4dDogU3RyaW5nVHJhY2tlciwgT0RhdGE6c3RyaW5nIHxhbnksIHBhdGg6c3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9hZGQgU3ludGF4XG5cbiAgICAgICAgaWYgKCFPRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoT0RhdGEpKSB7XG4gICAgICAgICAgICBPRGF0YSA9IFtPRGF0YV07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgT0RhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IFN5bnRheCA9IGF3YWl0IEFkZFN5bnRheChpKTtcblxuICAgICAgICAgICAgaWYgKFN5bnRheCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBhd2FpdCBTeW50YXgodGV4dCwgaSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgcGFnZXNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBjb21wb25lbnRzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZENvbXBvbmVudCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufSIsICIvL2dsb2JhbCBzZXR0aW5ncyBmb3IgYnVpbGQgaW4gY29tcG9uZW50c1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7XG4gICAgcGx1Z2luczogW11cbn07IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuL1NjcmlwdFRlbXBsYXRlJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCwgUGFyc2VEZWJ1Z0xpbmUsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCAqIGFzIGV4dHJpY2F0ZSBmcm9tICcuL1hNTEhlbHBlcnMvRXh0cmljYXRlJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tICcuL3RyYW5zZm9ybS9TY3JpcHQnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgQnVpbGRTY3JpcHRTZXR0aW5ncyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzJztcbmltcG9ydCBQYXJzZUJhc2VQYWdlIGZyb20gJy4vQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuaW1wb3J0IHsgZmluYWxpemVCdWlsZCB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0geyBBZGRDb21waWxlU3ludGF4OiBbXSwgcGx1Z2luczogW10sIEJhc2ljQ29tcGlsYXRpb25TeW50YXg6IFsnUmF6b3InXSB9O1xuY29uc3QgUGx1Z2luQnVpbGQgPSBuZXcgQWRkUGx1Z2luKFNldHRpbmdzKTtcbmV4cG9ydCBjb25zdCBDb21wb25lbnRzID0gbmV3IEluc2VydENvbXBvbmVudChQbHVnaW5CdWlsZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRQbHVnaW4obmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLnBsdWdpbnMuZmluZChiID0+IGIgPT0gbmFtZSB8fCAoPGFueT5iKT8ubmFtZSA9PSBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNvbWVQbHVnaW5zKC4uLmRhdGE6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGRhdGEuc29tZSh4ID0+IEdldFBsdWdpbih4KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RzKCkge1xuICAgIHJldHVybiBTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4LmluY2x1ZGVzKCdUeXBlU2NyaXB0Jyk7XG59XG5cbkNvbXBvbmVudHMuTWljcm9QbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcbkNvbXBvbmVudHMuR2V0UGx1Z2luID0gR2V0UGx1Z2luO1xuQ29tcG9uZW50cy5Tb21lUGx1Z2lucyA9IFNvbWVQbHVnaW5zO1xuQ29tcG9uZW50cy5pc1RzID0gaXNUcztcblxuQnVpbGRTY3JpcHRTZXR0aW5ncy5wbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcblxuYXN5bmMgZnVuY3Rpb24gb3V0UGFnZShkYXRhOiBTdHJpbmdUcmFja2VyLCBzY3JpcHRGaWxlOiBTdHJpbmdUcmFja2VyLCBwYWdlUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcblxuICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGRhdGEsIGlzVHMoKSk7XG4gICAgaWYoIWF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgcGFnZU5hbWUsIHtkeW5hbWljQ2hlY2t9KSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlbE5hbWUgPSBiYXNlRGF0YS5kZWZhdWx0VmFsdWVQb3BBbnkoJ21vZGVsJywgJ3dlYnNpdGUnKTtcblxuICAgIGlmICghbW9kZWxOYW1lKSByZXR1cm4gc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUsIGJhc2VEYXRhLmNsZWFyRGF0YSk7XG4gICAgZGF0YSA9IGJhc2VEYXRhLmNsZWFyRGF0YTtcblxuICAgIC8vaW1wb3J0IG1vZGVsXG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgbW9kZWxOYW1lLCAnTW9kZWxzJywgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMubW9kZWwpOyAvLyBmaW5kIGxvY2F0aW9uIG9mIHRoZSBmaWxlXG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bGxQYXRoKSkge1xuICAgICAgICBjb25zdCBFcnJvck1lc3NhZ2UgPSBgRXJyb3IgbW9kZWwgbm90IGZvdW5kIC0+ICR7bW9kZWxOYW1lfSBhdCBwYWdlICR7cGFnZU5hbWV9YDtcblxuICAgICAgICBwcmludC5lcnJvcihFcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQsIFBhZ2VUZW1wbGF0ZS5wcmludEVycm9yKEVycm9yTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLCBGdWxsUGF0aCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhmYWxzZSwgcGFnZU5hbWUsIEZ1bGxQYXRoLCBTbWFsbFBhdGgpOyAvLyByZWFkIG1vZGVsXG4gICAgbGV0IG1vZGVsRGF0YSA9IGF3YWl0IFBhcnNlQmFzZVBhZ2UucmVidWlsZEJhc2VJbmhlcml0YW5jZShiYXNlTW9kZWxEYXRhLmFsbERhdGEpO1xuXG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgbW9kZWxEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICBwYWdlTmFtZSArPSBcIiAtPiBcIiArIFNtYWxsUGF0aDtcblxuICAgIC8vR2V0IHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IGFsbERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ3MobW9kZWxEYXRhLCBbJyddLCAnOicsIGZhbHNlLCB0cnVlKTtcblxuICAgIGlmIChhbGxEYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3Igd2l0aGluIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBtb2RlbERhdGEgPSBhbGxEYXRhLmRhdGE7XG4gICAgY29uc3QgdGFnQXJyYXkgPSBhbGxEYXRhLmZvdW5kLm1hcCh4ID0+IHgudGFnLnN1YnN0cmluZygxKSk7XG4gICAgY29uc3Qgb3V0RGF0YSA9IGV4dHJpY2F0ZS5nZXREYXRhVGFncyhkYXRhLCB0YWdBcnJheSwgJ0AnKTtcblxuICAgIGlmIChvdXREYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgV2l0aCBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy9CdWlsZCBXaXRoIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1vZGVsQnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIGFsbERhdGEuZm91bmQpIHtcbiAgICAgICAgaS50YWcgPSBpLnRhZy5zdWJzdHJpbmcoMSk7IC8vIHJlbW92aW5nIHRoZSAnOidcbiAgICAgICAgY29uc3QgaG9sZGVyRGF0YSA9IG91dERhdGEuZm91bmQuZmluZCgoZSkgPT4gZS50YWcgPT0gJ0AnICsgaS50YWcpO1xuXG4gICAgICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEuc3Vic3RyaW5nKDAsIGkubG9jKSk7XG4gICAgICAgIG1vZGVsRGF0YSA9IG1vZGVsRGF0YS5zdWJzdHJpbmcoaS5sb2MpO1xuXG4gICAgICAgIGlmIChob2xkZXJEYXRhKSB7XG4gICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMoaG9sZGVyRGF0YS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHsgLy8gVHJ5IGxvYWRpbmcgZGF0YSBmcm9tIHBhZ2UgYmFzZVxuICAgICAgICAgICAgY29uc3QgbG9hZEZyb21CYXNlID0gYmFzZURhdGEuZ2V0KGkudGFnKTtcblxuICAgICAgICAgICAgaWYgKGxvYWRGcm9tQmFzZSAmJiBsb2FkRnJvbUJhc2UgIT09IHRydWUgJiYgbG9hZEZyb21CYXNlLmVxLnRvTG93ZXJDYXNlKCkgIT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhsb2FkRnJvbUJhc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YSk7XG5cbiAgICByZXR1cm4gYXdhaXQgb3V0UGFnZShtb2RlbEJ1aWxkLCBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSksIEZ1bGxQYXRoLCBwYWdlTmFtZSwgU21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBJbnNlcnQoZGF0YTogc3RyaW5nLCBmdWxsUGF0aENvbXBpbGU6IHN0cmluZywgbmVzdGVkUGFnZTogYm9vbGVhbiwgbmVzdGVkUGFnZURhdGE6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZHluYW1pY0NoZWNrPzogYm9vbGVhbikge1xuICAgIGxldCBEZWJ1Z1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgZGF0YSk7XG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBvdXRQYWdlKERlYnVnU3RyaW5nLCBuZXcgU3RyaW5nVHJhY2tlcihEZWJ1Z1N0cmluZy5EZWZhdWx0SW5mb1RleHQpLCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLCBkeW5hbWljQ2hlY2spO1xuXG4gICAgaWYoRGVidWdTdHJpbmcgPT0gbnVsbCl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBsdWdpbkJ1aWxkLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgQ29tcG9uZW50cy5JbnNlcnQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pOyAvLyBhZGQgY29tcG9uZW50c1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYXJzZURlYnVnTGluZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcblxuICAgIGlmIChuZXN0ZWRQYWdlKSB7IC8vIHJldHVybiBTdHJpbmdUcmFja2VyLCBiZWNhdXNlIHRoaXMgaW1wb3J0IHdhcyBmcm9tIHBhZ2VcbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5JblBhZ2VUZW1wbGF0ZShEZWJ1Z1N0cmluZywgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvLmZ1bGxQYXRoKTtcbiAgICB9XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IGZpbmFsaXplQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLCBmdWxsUGF0aENvbXBpbGUpO1xuICAgIFxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFnZVRlbXBsYXRlLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMoRGVidWdTdHJpbmcpO1xuICAgIERlYnVnU3RyaW5nPSBQYWdlVGVtcGxhdGUuQWRkQWZ0ZXJCdWlsZChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgcmV0dXJuIERlYnVnU3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJ1aWxkSlMsIEJ1aWxkSlNYLCBCdWlsZFRTLCBCdWlsZFRTWCB9IGZyb20gJy4vRm9yU3RhdGljL1NjcmlwdCc7XG5pbXBvcnQgQnVpbGRTdmVsdGUgZnJvbSAnLi9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFN0eWxlU2FzcyB9IGZyb20gJy4vRm9yU3RhdGljL1N0eWxlJztcbmltcG9ydCB7IGdldFR5cGVzLCBTeXN0ZW1EYXRhLCBnZXREaXJuYW1lLCBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgUmVzcG9uc2UsIFJlcXVlc3QgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHByb21wdGx5IGZyb20gJ3Byb21wdGx5JztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcblxuY29uc3QgU3VwcG9ydGVkVHlwZXMgPSBbJ2pzJywgJ3N2ZWx0ZScsICd0cycsICdqc3gnLCAndHN4JywgJ2NzcycsICdzYXNzJywgJ3Njc3MnXTtcblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU3RhdGljRmlsZXMnKTtcblxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG8gPSBTdGF0aWNGaWxlc0luZm8uc3RvcmVbcGF0aF07XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbykge1xuICAgICAgICBsZXQgcCA9IGk7XG5cbiAgICAgICAgaWYgKGkgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgcCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBGaWxlUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IG9baV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICFvO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkRmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZnVsbENvbXBpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKFNtYWxsUGF0aCkuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgZGVwZW5kZW5jaWVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xuICAgIHN3aXRjaCAoZXh0KSB7XG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3NzJzpcbiAgICAgICAgY2FzZSAnc2Fzcyc6XG4gICAgICAgIGNhc2UgJ3Njc3MnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdHlsZVNhc3MoU21hbGxQYXRoLCBleHQsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N2ZWx0ZSc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN2ZWx0ZShTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgZnVsbENvbXBpbGVQYXRoICs9ICcuanMnO1xuICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxDb21waWxlUGF0aCkpIHtcbiAgICAgICAgU3RhdGljRmlsZXNJbmZvLnVwZGF0ZShTbWFsbFBhdGgsIGRlcGVuZGVuY2llcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghaXNEZWJ1ZylcbiAgICAgICAgcmV0dXJuIHRydWU7XG59XG5cbmludGVyZmFjZSBidWlsZEluIHtcbiAgICBwYXRoPzogc3RyaW5nO1xuICAgIGV4dD86IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgaW5TZXJ2ZXI/OiBzdHJpbmc7XG59XG5cbmNvbnN0IHN0YXRpY0ZpbGVzID0gU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL2NsaWVudC8nO1xuY29uc3QgZ2V0U3RhdGljOiBidWlsZEluW10gPSBbe1xuICAgIHBhdGg6IFwic2Vydi90ZW1wLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwiYnVpbGRUZW1wbGF0ZS5qc1wiXG59LFxue1xuICAgIHBhdGg6IFwic2Vydi9jb25uZWN0LmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFrZUNvbm5lY3Rpb24uanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvbWQuanNcIixcbiAgICB0eXBlOiBcImpzXCIsXG4gICAgaW5TZXJ2ZXI6IHN0YXRpY0ZpbGVzICsgXCJtYXJrZG93bkNvcHkuanNcIlxufV07XG5cbmNvbnN0IGdldFN0YXRpY0ZpbGVzVHlwZTogYnVpbGRJbltdID0gW3tcbiAgICBleHQ6ICcucHViLmpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIubWpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIuY3NzJyxcbiAgICB0eXBlOiAnY3NzJ1xufV07XG5cbmFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkQnlUeXBlKFJlcXVlc3Q6IFJlcXVlc3QsIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmb3VuZCA9IGdldFN0YXRpY0ZpbGVzVHlwZS5maW5kKHggPT4gZmlsZVBhdGguZW5kc1dpdGgoeC5leHQpKTtcblxuICAgIGlmICghZm91bmQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgY29uc3QgYmFzZVBhdGggPSBSZXF1ZXN0LnF1ZXJ5LnQgPT0gJ2wnID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXTtcbiAgICBjb25zdCBpblNlcnZlciA9IHBhdGguam9pbihiYXNlUGF0aCwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoaW5TZXJ2ZXIpKVxuICAgICAgICByZXR1cm4geyAuLi5mb3VuZCwgaW5TZXJ2ZXIgfTtcbn1cblxubGV0IGRlYnVnZ2luZ1dpdGhTb3VyY2U6IG51bGwgfCBib29sZWFuID0gbnVsbDtcblxuaWYgKGFyZ3YuaW5jbHVkZXMoJ2FsbG93U291cmNlRGVidWcnKSlcbiAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gdHJ1ZTtcbmFzeW5jIGZ1bmN0aW9uIGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSB7XG4gICAgaWYgKHR5cGVvZiBkZWJ1Z2dpbmdXaXRoU291cmNlID09ICdib29sZWFuJylcbiAgICAgICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG5cbiAgICB0cnkge1xuICAgICAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gKGF3YWl0IHByb21wdGx5LnByb21wdChcbiAgICAgICAgICAgICdBbGxvdyBkZWJ1Z2dpbmcgSmF2YVNjcmlwdC9DU1MgaW4gc291cmNlIHBhZ2U/IC0gZXhwb3NpbmcgeW91ciBzb3VyY2UgY29kZSAobm8pJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iodjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ3llcycsICdubyddLmluY2x1ZGVzKHYudHJpbSgpLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigneWVzIG9yIG5vJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwICogMzBcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSkudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT0gJ3llcyc7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIH0gY2F0Y2ggeyB9XG5cblxuICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xufVxuXG5jb25zdCBzYWZlRm9sZGVycyA9IFtnZXRUeXBlcy5TdGF0aWNbMl0sIGdldFR5cGVzLkxvZ3NbMl0sICdNb2RlbHMnLCAnQ29tcG9uZW50cyddO1xuLyoqXG4gKiBJZiB0aGUgdXNlciBpcyBpbiBkZWJ1ZyBtb2RlLCBhbmQgdGhlIGZpbGUgaXMgYSBzb3VyY2UgZmlsZSwgYW5kIHRoZSB1c2VyIGNvbW1lbmQgbGluZSBhcmd1bWVudCBoYXZlIGFsbG93U291cmNlRGVidWdcbiAqIHRoZW4gcmV0dXJuIHRoZSBmdWxsIHBhdGggdG8gdGhlIGZpbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGlzIHRoZSBjdXJyZW50IHBhZ2UgYSBkZWJ1ZyBwYWdlP1xuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggb2YgdGhlIGZpbGUgdGhhdCB3YXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZCAtIElmIHRoaXMgcGF0aCBhbHJlYWR5IGJlZW4gY2hlY2tlZFxuICogdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgdHlwZSBvZiB0aGUgZmlsZSBhbmQgdGhlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVuc2FmZURlYnVnKGlzRGVidWc6IGJvb2xlYW4sIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWlzRGVidWcgfHwgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpIHx8IHBhdGguZXh0bmFtZShmaWxlUGF0aCkgIT0gJy5zb3VyY2UnIHx8ICFzYWZlRm9sZGVycy5pbmNsdWRlcyhmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5zaGlmdCgpKSB8fCAhYXdhaXQgYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDcpKTsgLy8gcmVtb3ZpbmcgJy5zb3VyY2UnXG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3R5bGUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGJhc2VGaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA0KTsgLy8gcmVtb3ZpbmcgJy5jc3MnXG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBmaWxlUGF0aDtcblxuICAgIGxldCBleGlzdHM6IGJvb2xlYW47XG4gICAgaWYgKHBhdGguZXh0bmFtZShiYXNlRmlsZVBhdGgpID09ICcuc3ZlbHRlJyAmJiAoY2hlY2tlZCB8fCAoZXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiAhZXhpc3RzKSB7XG4gICAgICAgIGF3YWl0IEJ1aWxkRmlsZShiYXNlRmlsZVBhdGgsIGlzRGVidWcsIGdldFR5cGVzLlN0YXRpY1sxXSArIGJhc2VGaWxlUGF0aClcbiAgICAgICAgcmV0dXJuIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoLCBjaGVja2VkLCBmYWxzZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdGF0aWMoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9zdmVsdGUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDQpICsgKHBhdGguZXh0bmFtZShmaWxlUGF0aCkgPyAnJyA6ICcvaW5kZXgubWpzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnanMnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25Db2RlVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC9jb2RlLXRoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDE4KTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25UaGVtZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L21kL3RoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBsZXQgZmlsZU5hbWUgPSBmaWxlUGF0aC5zdWJzdHJpbmcoMTQpO1xuICAgIGlmIChmaWxlTmFtZS5zdGFydHNXaXRoKCdhdXRvLicpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0sIFBhcnNlckNvbmZpZyB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBwYXJzZXI/OiBQYXJzZXJDb25maWcsIG9wdGlvbnNOYW1lPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpbnB1dFBhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGlucHV0UGF0aDtcbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmaWxlbmFtZTogZnVsbFBhdGgsXG4gICAgICAgIHNvdXJjZUZpbGVOYW1lOiBpbnB1dFBhdGggKyAnP3NvdXJjZT10cnVlJyxcbiAgICAgICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgICAgICAgcGFyc2VyOiB7XG4gICAgICAgICAgICAgICAgLi4ucGFyc2VyLFxuICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksXG4gICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKG9wdGlvbnNOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgdHlwZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlTWFwczogaXNEZWJ1ZyA/ICdpbmxpbmUnIDogZmFsc2VcbiAgICB9O1xuXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSAoYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucykpLmNvZGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGVycik7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqcycsIGlzRGVidWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgc3ludGF4OiAndHlwZXNjcmlwdCcsIGRlY29yYXRvcnM6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqc3gnLCBpc0RlYnVnLCB7IHN5bnRheDogJ2VjbWFzY3JpcHQnLCBqc3g6IHRydWUgfSwgJ0pTWE9wdGlvbnMnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkVFNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzeCcsIGlzRGVidWcsIHsgc3ludGF4OiAndHlwZXNjcmlwdCcsIHRzeDogdHJ1ZSwgZGVjb3JhdG9yczogdHJ1ZSwgfSwgJ1RTWE9wdGlvbnMnKTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gXCJAc3djL2NvcmVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCwgTWVyZ2VTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvTG9nZ2VyXCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZUVycm9yLCBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuaW1wb3J0IHsgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpblN0YXRpY1BhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljUGF0aDtcblxuICAgIGNvbnN0IHsgY29kZSwgZGVwZW5kZW5jaWVzLCBtYXAsIHNjcmlwdExhbmcgfSA9IGF3YWl0IHByZXByb2Nlc3MoZnVsbFBhdGgsIGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljUGF0aCk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmdWxsUGF0aC5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpO1xuICAgIGxldCBqczogYW55LCBjc3M6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBzdmVsdGUuY29tcGlsZShjb2RlLCB7XG4gICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgIGRldjogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHNvdXJjZW1hcDogbWFwLFxuICAgICAgICAgICAgY3NzOiBmYWxzZSxcbiAgICAgICAgICAgIGh5ZHJhdGFibGU6IHRydWUsXG4gICAgICAgICAgICBzdmVsdGVQYXRoOiAnL3NlcnYvc3ZlbHRlJ1xuICAgICAgICB9KTtcbiAgICAgICAgUHJpbnRTdmVsdGVXYXJuKG91dHB1dC53YXJuaW5ncywgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIGpzID0gb3V0cHV0LmpzO1xuICAgICAgICBjc3MgPSBvdXRwdXQuY3NzO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIFByaW50U3ZlbHRlRXJyb3IoZXJyLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRoaXNGaWxlOiAwXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICBjb25zdCBzb3VyY2VGaWxlQ2xpZW50ID0ganMubWFwLnNvdXJjZXNbMF0uc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYoaXNEZWJ1Zyl7XG4gICAgICAgIGpzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICB9XG5cbiAgICBpZiAoU29tZVBsdWdpbnMoXCJNaW5KU1wiKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShqcy5jb2RlLCB7XG4gICAgICAgICAgICAgICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgICAgICAgICAgICAgICBwYXJzZXI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4OiBzY3JpcHRMYW5nID09ICdqcycgPyAnZWNtYXNjcmlwdCc6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihzY3JpcHRMYW5nLnRvVXBwZXJDYXNlKCkgK1wiT3B0aW9uc1wiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHNvdXJjZU1hcHM6IGlzRGVidWdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqcy5jb2RlID0gY29kZTtcbiAgICAgICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgICAgICBqcy5tYXAgPSBhd2FpdCBNZXJnZVNvdXJjZU1hcChKU09OLnBhcnNlKG1hcCksIGpzLm1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXdhaXQgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoZXJyLCBqcy5tYXAsIGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgIGpzLmNvZGUgKz0gdG9VUkxDb21tZW50KGpzLm1hcCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3NzLmNvZGUpIHtcbiAgICAgICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuanMnLCBqcy5jb2RlKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVwZW5kZW5jaWVzLFxuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufSIsICJpbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ICBjcmVhdGVJbXBvcnRlciwgUHJpbnRTYXNzRXJyb3IsIHNhc3NBbmRTb3VyY2UsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFN0eWxlU2FzcyhpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogXCJzYXNzXCIgfCBcInNjc3NcIiB8IFwiY3NzXCIsIGlzRGVidWc6IGJvb2xlYW4pOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0+IHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuXG4gICAgY29uc3QgZGVwZW5kZW5jZU9iamVjdCA9IHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpLCBmaWxlRGF0YURpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoZmlsZURhdGEsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCh0eXBlKSxcbiAgICAgICAgICAgIHN0eWxlOiBzYXNzU3R5bGUodHlwZSksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQ/LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2VPYmplY3RbQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCldID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5jc3M7XG5cbiAgICAgICAgaWYgKGlzRGVidWcgJiYgcmVzdWx0LnNvdXJjZU1hcCkge1xuICAgICAgICAgICAgc2Fzc0FuZFNvdXJjZShyZXN1bHQuc291cmNlTWFwLCBwYXRoVG9GaWxlVVJMKGZpbGVEYXRhKS5ocmVmKTtcbiAgICAgICAgICAgIHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcyA9IHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcy5tYXAoeCA9PiBwYXRoLnJlbGF0aXZlKGZpbGVEYXRhRGlybmFtZSwgZmlsZVVSTFRvUGF0aCh4KSkgKyAnP3NvdXJjZT10cnVlJyk7XG5cbiAgICAgICAgICAgIGRhdGEgKz0gYFxcclxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5zb3VyY2VNYXApKS50b1N0cmluZyhcImJhc2U2NFwiKX0qL2A7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCBkYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBkZXBlbmRlbmNlT2JqZWN0XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERpcmVudCB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IEluc2VydCwgQ29tcG9uZW50cywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IENsZWFyV2FybmluZyB9IGZyb20gJy4uL091dHB1dElucHV0L0xvZ2dlcidcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIERlbGV0ZUluRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgUmVxU2NyaXB0IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgU3RhdGljRmlsZXMgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gJy4vQ29tcGlsZVN0YXRlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCB7IGNyZWF0ZVNpdGVNYXAgfSBmcm9tICcuL1NpdGVNYXAnO1xuaW1wb3J0IHsgZXh0ZW5zaW9uSXMsIGlzRmlsZVR5cGUsIFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgeyBwZXJDb21waWxlLCBwb3N0Q29tcGlsZSwgcGVyQ29tcGlsZVBhZ2UsIHBvc3RDb21waWxlUGFnZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuYXN5bmMgZnVuY3Rpb24gY29tcGlsZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgeyBpc0RlYnVnLCBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVjayB9OiB7IGlzRGVidWc/OiBib29sZWFuLCBoYXNTZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgbmVzdGVkUGFnZT86IHN0cmluZywgbmVzdGVkUGFnZURhdGE/OiBzdHJpbmcsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgRnVsbEZpbGVQYXRoID0gcGF0aC5qb2luKGFycmF5VHlwZVswXSwgZmlsZVBhdGgpLCBGdWxsUGF0aENvbXBpbGUgPSBhcnJheVR5cGVbMV0gKyBmaWxlUGF0aCArICcuY2pzJztcblxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbEZpbGVQYXRoLCAndXRmOCcpO1xuICAgIGNvbnN0IEV4Y2x1VXJsID0gKG5lc3RlZFBhZ2UgPyBuZXN0ZWRQYWdlICsgJzxsaW5lPicgOiAnJykgKyBhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aDtcblxuICAgIGNvbnN0IHNlc3Npb25JbmZvID0gaGFzU2Vzc2lvbkluZm8gPz8gbmV3IFNlc3Npb25CdWlsZChhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aCwgRnVsbEZpbGVQYXRoLCBhcnJheVR5cGVbMl0sIGlzRGVidWcsIEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSk7XG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZSgndGhpc1BhZ2UnLCBGdWxsRmlsZVBhdGgpO1xuXG4gICAgYXdhaXQgcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm8sIEZ1bGxQYXRoQ29tcGlsZSk7XG4gICAgY29uc3QgQ29tcGlsZWREYXRhID0gKGF3YWl0IEluc2VydChodG1sLCBGdWxsUGF0aENvbXBpbGUsIEJvb2xlYW4obmVzdGVkUGFnZSksIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgZHluYW1pY0NoZWNrKSkgPz8gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICBhd2FpdCBwb3N0Q29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm8sIEZ1bGxQYXRoQ29tcGlsZSk7XG5cbiAgICBpZiAoIW5lc3RlZFBhZ2UgJiYgQ29tcGlsZWREYXRhLmxlbmd0aCkge1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKEZ1bGxQYXRoQ29tcGlsZSwgQ29tcGlsZWREYXRhLlN0cmluZ1dpdGhUYWNrKEZ1bGxQYXRoQ29tcGlsZSkpO1xuICAgICAgICBwYWdlRGVwcy51cGRhdGUoRXhjbHVVcmwsIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgQ29tcGlsZWREYXRhLCBzZXNzaW9uSW5mbyB9O1xufVxuXG5mdW5jdGlvbiBSZXF1aXJlU2NyaXB0KHNjcmlwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFJlcVNjcmlwdChbJ1Byb2R1Y3Rpb24gTG9hZGVyJ10sIHNjcmlwdCwgZ2V0VHlwZXMuU3RhdGljLCB7IGlzRGVidWc6IGZhbHNlLCBvbmx5UHJlcGFyZTogdHJ1ZSB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRmlsZXNJbkZvbGRlcihhcnJheVR5cGU6IHN0cmluZ1tdLCBwYXRoOiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKGFycmF5VHlwZVswXSArIHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMubWtkaXIoYXJyYXlUeXBlWzFdICsgY29ubmVjdCk7XG4gICAgICAgICAgICBhd2FpdCBGaWxlc0luRm9sZGVyKGFycmF5VHlwZSwgY29ubmVjdCArICcvJywgc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShhcnJheVR5cGVbMl0gKyAnLycgKyBjb25uZWN0KSkgLy9jaGVjayBpZiBub3QgYWxyZWFkeSBjb21waWxlIGZyb20gYSAnaW4tZmlsZScgY2FsbFxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb21waWxlRmlsZShjb25uZWN0LCBhcnJheVR5cGUsIHsgZHluYW1pY0NoZWNrOiAhZXh0ZW5zaW9uSXMobiwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBSZXF1aXJlU2NyaXB0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFN0YXRpY0ZpbGVzKGNvbm5lY3QsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVNjcmlwdHMoc2NyaXB0czogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2Ygc2NyaXB0cykge1xuICAgICAgICBhd2FpdCBSZXF1aXJlU2NyaXB0KHBhdGgpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQ3JlYXRlQ29tcGlsZSh0OiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB0eXBlcyA9IGdldFR5cGVzW3RdO1xuICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KHR5cGVzWzFdKTtcbiAgICByZXR1cm4gKCkgPT4gRmlsZXNJbkZvbGRlcih0eXBlcywgJycsIHN0YXRlKTtcbn1cblxuLyoqXG4gKiB3aGVuIHBhZ2UgY2FsbCBvdGhlciBwYWdlO1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGVJbkZpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCAgeyBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVjayB9OiB7IGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZywgZHluYW1pY0NoZWNrPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGgsIGFycmF5VHlwZVsxXSk7XG4gICAgcmV0dXJuIGF3YWl0IGNvbXBpbGVGaWxlKHBhdGgsIGFycmF5VHlwZSwge2lzRGVidWc6dHJ1ZSwgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2t9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgZHluYW1pY0NoZWNrPzogYm9vbGVhbikge1xuICAgIGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKHBhdGgsIGFycmF5VHlwZSwge2R5bmFtaWNDaGVja30pO1xuICAgIENsZWFyV2FybmluZygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUFsbChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKSB7XG4gICAgbGV0IHN0YXRlID0gIWFyZ3YuaW5jbHVkZXMoJ3JlYnVpbGQnKSAmJiBhd2FpdCBDb21waWxlU3RhdGUuY2hlY2tMb2FkKClcblxuICAgIGlmIChzdGF0ZSkgcmV0dXJuICgpID0+IFJlcXVpcmVTY3JpcHRzKHN0YXRlLnNjcmlwdHMpXG4gICAgcGFnZURlcHMuY2xlYXIoKTtcblxuICAgIHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpXG5cbiAgICBwZXJDb21waWxlKCk7XG5cbiAgICBjb25zdCBhY3RpdmF0ZUFycmF5ID0gW2F3YWl0IENyZWF0ZUNvbXBpbGUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzdGF0ZSksIGF3YWl0IENyZWF0ZUNvbXBpbGUoZ2V0VHlwZXMuTG9nc1syXSwgc3RhdGUpLCBDbGVhcldhcm5pbmddO1xuXG4gICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFjdGl2YXRlQXJyYXkpIHtcbiAgICAgICAgICAgIGF3YWl0IGkoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgc3RhdGUpO1xuICAgICAgICBzdGF0ZS5leHBvcnQoKVxuICAgICAgICBwYWdlRGVwcy5zYXZlKCk7XG4gICAgICAgIHBvc3RDb21waWxlKClcbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBnZXRTZXR0aW5nc0RhdGUgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG50eXBlIENTdGF0ZSA9IHtcbiAgICB1cGRhdGU6IG51bWJlclxuICAgIHBhZ2VBcnJheTogc3RyaW5nW11bXSxcbiAgICBpbXBvcnRBcnJheTogc3RyaW5nW11cbiAgICBmaWxlQXJyYXk6IHN0cmluZ1tdXG59XG5cbi8qIFRoaXMgY2xhc3MgaXMgdXNlZCB0byBzdG9yZSB0aGUgc3RhdGUgb2YgdGhlIHByb2plY3QgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVTdGF0ZSB7XG4gICAgcHJpdmF0ZSBzdGF0ZTogQ1N0YXRlID0geyB1cGRhdGU6IDAsIHBhZ2VBcnJheTogW10sIGltcG9ydEFycmF5OiBbXSwgZmlsZUFycmF5OiBbXSB9XG4gICAgc3RhdGljIGZpbGVQYXRoID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIFwiQ29tcGlsZVN0YXRlLmpzb25cIilcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGUgPSBnZXRTZXR0aW5nc0RhdGUoKVxuICAgIH1cblxuICAgIGdldCBzY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5pbXBvcnRBcnJheVxuICAgIH1cblxuICAgIGdldCBwYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUucGFnZUFycmF5XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5maWxlQXJyYXlcbiAgICB9XG5cbiAgICBhZGRQYWdlKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5wYWdlQXJyYXkuZmluZCh4ID0+IHhbMF0gPT0gcGF0aCAmJiB4WzFdID09IHR5cGUpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wYWdlQXJyYXkucHVzaChbcGF0aCwgdHlwZV0pXG4gICAgfVxuXG4gICAgYWRkSW1wb3J0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW1wb3J0QXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmltcG9ydEFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBhZGRGaWxlKHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZmlsZUFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWxlQXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKENvbXBpbGVTdGF0ZS5maWxlUGF0aCwgdGhpcy5zdGF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tMb2FkKCkge1xuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuZmlsZVBhdGgpKSByZXR1cm5cblxuICAgICAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuICAgICAgICBzdGF0ZS5zdGF0ZSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5maWxlUGF0aClcblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICE9IGdldFNldHRpbmdzRGF0ZSgpKSByZXR1cm5cblxuICAgICAgICByZXR1cm4gc3RhdGVcbiAgICB9XG59IiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEltcG9ydEZpbGUsIHtBZGRFeHRlbnNpb24sIFJlcXVpcmVPbmNlfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0UmVxdWlyZShhcnJheTogc3RyaW5nW10sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBhcnJheUZ1bmNTZXJ2ZXIgPSBbXTtcbiAgICBmb3IgKGxldCBpIG9mIGFycmF5KSB7XG4gICAgICAgIGkgPSBBZGRFeHRlbnNpb24oaSk7XG5cbiAgICAgICAgY29uc3QgYiA9IGF3YWl0IEltcG9ydEZpbGUoWydyb290IGZvbGRlciAoV1dXKSddLCBpLCBnZXRUeXBlcy5TdGF0aWMsIHtpc0RlYnVnfSk7XG4gICAgICAgIGlmIChiICYmIHR5cGVvZiBiLlN0YXJ0U2VydmVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFycmF5RnVuY1NlcnZlci5wdXNoKGIuU3RhcnRTZXJ2ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpbnQubG9nKGBDYW4ndCBmaW5kIFN0YXJ0U2VydmVyIGZ1bmN0aW9uIGF0IG1vZHVsZSAtICR7aX1cXG5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheUZ1bmNTZXJ2ZXI7XG59XG5cbmxldCBsYXN0U2V0dGluZ3NJbXBvcnQ6IG51bWJlcjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRTZXR0aW5ncyhmaWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKXtcbiAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCArICcudHMnKSl7XG4gICAgICAgIGZpbGVQYXRoICs9ICcudHMnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoICs9ICcuanMnXG4gICAgfVxuICAgIGNvbnN0IGNoYW5nZVRpbWUgPSA8YW55PmF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpXG5cbiAgICBpZihjaGFuZ2VUaW1lID09IGxhc3RTZXR0aW5nc0ltcG9ydCB8fCAhY2hhbmdlVGltZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgXG4gICAgbGFzdFNldHRpbmdzSW1wb3J0ID0gY2hhbmdlVGltZTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgUmVxdWlyZU9uY2UoZmlsZVBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBkYXRhLmRlZmF1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nc0RhdGUoKXtcbiAgICByZXR1cm4gbGFzdFNldHRpbmdzSW1wb3J0XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJbXBvcnRGaWxlIH0gZnJvbSBcIi4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMsIHsgRGlyZW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tIFwiLi9Db21waWxlU3RhdGVcIjtcbmltcG9ydCB7IGlzRmlsZVR5cGUgfSBmcm9tIFwiLi9GaWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPVtdO1xuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNjYW5GaWxlcygpe1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5TdGF0aWMsICcnLCBzdGF0ZSksXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuTG9ncywgJycsIHN0YXRlKVxuICAgIF0pXG4gICAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVidWdTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3Mpe1xuICAgIHJldHVybiBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgYXdhaXQgc2NhbkZpbGVzKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgeyByb3V0aW5nLCBkZXZlbG9wbWVudCB9ID0gRXhwb3J0O1xuICAgIGlmICghcm91dGluZy5zaXRlbWFwKSByZXR1cm47XG5cbiAgICBjb25zdCBzaXRlbWFwID0gcm91dGluZy5zaXRlbWFwID09PSB0cnVlID8ge30gOiByb3V0aW5nLnNpdGVtYXA7XG4gICAgT2JqZWN0LmFzc2lnbihzaXRlbWFwLCB7XG4gICAgICAgIHJ1bGVzOiB0cnVlLFxuICAgICAgICB1cmxTdG9wOiBmYWxzZSxcbiAgICAgICAgZXJyb3JQYWdlczogZmFsc2UsXG4gICAgICAgIHZhbGlkUGF0aDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFnZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICB1cmxzOiAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBmb3IgKGxldCBbdXJsLCB0eXBlXSBvZiBzdGF0ZS5wYWdlcykge1xuXG4gICAgICAgIGlmKHR5cGUgIT0gZ2V0VHlwZXMuU3RhdGljWzJdIHx8ICF1cmwuZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB1cmwgPSAnLycgKyB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmKHBhdGguZXh0bmFtZSh1cmwpID09ICcuc2VydicpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC51cmxTdG9wKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpdGVtYXAucnVsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGF3YWl0IHJvdXRpbmcucnVsZXNbcGF0aF0odXJsKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGVuZHMgPT4gdXJsLmVuZHNXaXRoKCcuJytlbmRzKSkgfHxcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChzdGFydCA9PiB1cmwuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHJvdXRpbmcudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhd2FpdCBmdW5jKHVybCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpdGVtYXAuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlcnJvciBpbiByb3V0aW5nLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gJy8nICsgcm91dGluZy5lcnJvclBhZ2VzW2Vycm9yXS5wYXRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VzLnB1c2godXJsKTtcbiAgICB9XG5cbiAgICBsZXQgd3JpdGUgPSB0cnVlO1xuICAgIGlmIChzaXRlbWFwLmZpbGUpIHtcbiAgICAgICAgY29uc3QgZmlsZUFjdGlvbiA9IGF3YWl0IEltcG9ydEZpbGUoJ1NpdGVtYXAgSW1wb3J0Jywgc2l0ZW1hcC5maWxlLCBnZXRUeXBlcy5TdGF0aWMsIGRldmVsb3BtZW50KTtcbiAgICAgICAgaWYoIWZpbGVBY3Rpb24/LlNpdGVtYXApe1xuICAgICAgICAgICAgZHVtcC53YXJuKCdcXCdTaXRlbWFwXFwnIGZ1bmN0aW9uIG5vdCBmb3VuZCBvbiBmaWxlIC0+ICcrIHNpdGVtYXAuZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3cml0ZSA9IGF3YWl0IGZpbGVBY3Rpb24uU2l0ZW1hcChwYWdlcywgc3RhdGUsIEV4cG9ydCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZih3cml0ZSAmJiBwYWdlcy5sZW5ndGgpe1xuICAgICAgICBjb25zdCBwYXRoID0gd3JpdGUgPT09IHRydWUgPyAnc2l0ZW1hcC50eHQnOiB3cml0ZTtcbiAgICAgICAgc3RhdGUuYWRkRmlsZShwYXRoKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShnZXRUeXBlcy5TdGF0aWNbMF0gKyBwYXRoLCBwYWdlcy5qb2luKCdcXG4nKSk7XG4gICAgfVxufSIsICIvKipcbiAqIEdpdmVuIGEgZmlsZSBuYW1lIGFuZCBhbiBleHRlbnNpb24sIHJldHVybiB0cnVlIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIHRoZSBleHRlbnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZXh0bmFtZSAtIHRoZSBleHRlbnNpb24gdG8gY2hlY2sgZm9yLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5zaW9uSXMobmFtZTogc3RyaW5nLCBleHRuYW1lOiBzdHJpbmcpe1xuICAgIHJldHVybiBuYW1lLmVuZHNXaXRoKCcuJyArIGV4dG5hbWUpO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gZmlsZSB0eXBlcy5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVzIC0gYW4gYXJyYXkgb2YgZmlsZSBleHRlbnNpb25zIHRvIG1hdGNoLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZVR5cGUodHlwZXM6IHN0cmluZ1tdLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICAgIGlmIChleHRlbnNpb25JcyhuYW1lLHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsYXN0IGRvdCBhbmQgZXZlcnl0aGluZyBhZnRlciBpdCBmcm9tIGEgc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byByZW1vdmUgdGhlIGVuZCB0eXBlIGZyb20uXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGhvdXQgdGhlIGxhc3QgY2hhcmFjdGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUmVtb3ZlRW5kVHlwZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn0iLCAiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEZpbGVzIH0gZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGhhbmRlbENvbm5lY3RvclNlcnZpY2UgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Mb2dnZXInO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBSZW1vdmVFbmRUeXBlIH0gZnJvbSAnLi9GaWxlVHlwZXMnO1xuaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgRmFzdENvbXBpbGUgfSBmcm9tICcuL1NlYXJjaFBhZ2VzJztcblxuY29uc3QgRXhwb3J0ID0ge1xuICAgIFBhZ2VMb2FkUmFtOiB7fSxcbiAgICBQYWdlUmFtOiB0cnVlXG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2ZpbGVuYW1lIC0gVGhlIGZpbGVuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZGlybmFtZSAtIFRoZSBkaXJlY3Rvcnkgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgdHlwZUFycmF5IGlzIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aCB0byB0aGVcbiAqIGZpbGUuXG4gKiBAcGFyYW0gTGFzdFJlcXVpcmUgLSBBIGRpY3Rpb25hcnkgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2FueX0gRGF0YU9iamVjdCAtIFRoZSBkYXRhIG9iamVjdCB0aGF0IGlzIHBhc3NlZCB0byB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBwYWdlLlxuICovXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlUGFnZShmaWxlUGF0aDogc3RyaW5nLCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBMYXN0UmVxdWlyZTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRGF0YU9iamVjdDogYW55KSB7XG4gICAgY29uc3QgUmVxRmlsZVBhdGggPSBMYXN0UmVxdWlyZVtmaWxlUGF0aF07XG4gICAgY29uc3QgcmVzTW9kZWwgPSAoKSA9PiBSZXFGaWxlUGF0aC5tb2RlbChEYXRhT2JqZWN0KTtcblxuICAgIGxldCBmaWxlRXhpc3RzOiBib29sZWFuO1xuXG4gICAgaWYgKFJlcUZpbGVQYXRoKSB7XG4gICAgICAgIGlmICghRGF0YU9iamVjdC5pc0RlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG5cbiAgICAgICAgaWYgKFJlcUZpbGVQYXRoLmRhdGUgPT0gLTEpIHtcbiAgICAgICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShSZXFGaWxlUGF0aC5wYXRoKTtcblxuICAgICAgICAgICAgaWYgKCFmaWxlRXhpc3RzKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb3B5UGF0aCA9IGZpbGVQYXRoO1xuICAgIGxldCBleHRuYW1lID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKS5zdWJzdHJpbmcoMSk7XG5cbiAgICBpZiAoIWV4dG5hbWUpIHtcbiAgICAgICAgZXh0bmFtZSA9IEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgICAgIGZpbGVQYXRoICs9ICcuJyArIGV4dG5hbWU7XG4gICAgfVxuXG4gICAgbGV0IGZ1bGxQYXRoOiBzdHJpbmc7XG4gICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJylcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlUGF0aCk7XG4gICAgIGVsc2VcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoIVtCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnRdLmluY2x1ZGVzKGV4dG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICBEYXRhT2JqZWN0LndyaXRlKGltcG9ydFRleHQpO1xuICAgICAgICByZXR1cm4gaW1wb3J0VGV4dDtcbiAgICB9XG5cbiAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCk7XG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7Y29weVBhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSA8Y29sb3I+JyR7X19maWxlbmFtZX0nYFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6ICgpID0+IHsgfSwgZGF0ZTogLTEsIHBhdGg6IGZ1bGxQYXRoIH07XG4gICAgICAgIHJldHVybiBMYXN0UmVxdWlyZVtjb3B5UGF0aF0ubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgaW5TdGF0aWNQYXRoID0gIHBhdGgucmVsYXRpdmUodHlwZUFycmF5WzBdLGZ1bGxQYXRoKTtcbiAgICBjb25zdCBTbWFsbFBhdGggPSB0eXBlQXJyYXlbMl0gKyAnLycgKyBpblN0YXRpY1BhdGg7XG4gICAgY29uc3QgcmVCdWlsZCA9IERhdGFPYmplY3QuaXNEZWJ1ZyAmJiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHR5cGVBcnJheVsxXSArICcvJyAraW5TdGF0aWNQYXRoICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoaW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGV4dG5hbWUgIT0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSAmJiAhcmVCdWlsZCkge1xuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXVswXSB9O1xuICAgICAgICByZXR1cm4gYXdhaXQgTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsKERhdGFPYmplY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bmMgPSBhd2FpdCBMb2FkUGFnZShTbWFsbFBhdGgsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKSB7XG4gICAgICAgIGlmICghRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF1bMF0gPSBmdW5jO1xuICAgIH1cblxuICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGZ1bmMgfTtcbiAgICByZXR1cm4gYXdhaXQgZnVuYyhEYXRhT2JqZWN0KTtcbn1cblxuY29uc3QgR2xvYmFsVmFyID0ge307XG5cbmZ1bmN0aW9uIGdldEZ1bGxQYXRoQ29tcGlsZSh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgcmV0dXJuIHR5cGVBcnJheVsxXSArIFNwbGl0SW5mb1sxXSArICcuY2pzJztcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgcGFnZSB0byBsb2FkLlxuICogQHBhcmFtIGV4dCAtIFRoZSBleHRlbnNpb24gb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2UodXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcblxuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgY29uc3QgTGFzdFJlcXVpcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIF9yZXF1aXJlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlRmlsZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luY2x1ZGUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcsIFdpdGhPYmplY3QgPSB7fSkge1xuICAgICAgICByZXR1cm4gUmVxdWlyZVBhZ2UocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCB7IC4uLldpdGhPYmplY3QsIC4uLkRhdGFPYmplY3QgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3RyYW5zZmVyKHA6IHN0cmluZywgcHJlc2VydmVGb3JtOiBib29sZWFuLCB3aXRoT2JqZWN0OiBhbnksIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSkge1xuICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgPSAnJztcblxuICAgICAgICBpZiAoIXByZXNlcnZlRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgcG9zdERhdGEgPSBEYXRhT2JqZWN0LlJlcXVlc3QuYm9keSA/IHt9IDogbnVsbDtcbiAgICAgICAgICAgIERhdGFPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgLi4uRGF0YU9iamVjdCxcbiAgICAgICAgICAgICAgICBSZXF1ZXN0OiB7IC4uLkRhdGFPYmplY3QuUmVxdWVzdCwgZmlsZXM6IHt9LCBxdWVyeToge30sIGJvZHk6IHBvc3REYXRhIH0sXG4gICAgICAgICAgICAgICAgUG9zdDogcG9zdERhdGEsIFF1ZXJ5OiB7fSwgRmlsZXM6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBEYXRhT2JqZWN0LCBwLCB3aXRoT2JqZWN0KTtcblxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIFNwbGl0SW5mb1sxXSArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsZXQgZXJyb3JUZXh0OiBzdHJpbmc7XG5cbiAgICAgICAgaWYoaXNEZWJ1Zyl7XG4gICAgICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHBhdGggLT4gXCIsIFJlbW92ZUVuZFR5cGUodXJsKSwgXCItPlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgICBlcnJvclRleHQgPSBKU1BhcnNlci5wcmludEVycm9yKGBFcnJvciBwYXRoOiAke3VybH08YnIvPkVycm9yIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gSlNQYXJzZXIucHJpbnRFcnJvcihgRXJyb3IgY29kZTogJHtlLmNvZGV9YClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiB7XG4gICAgICAgICAgICBEYXRhT2JqZWN0LlJlcXVlc3QuZXJyb3IgPSBlO1xuICAgICAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGVycm9yVGV4dDtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuLyoqXG4gKiBJdCB0YWtlcyBhIGZ1bmN0aW9uIHRoYXQgcHJlcGFyZSBhIHBhZ2UsIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBsb2FkcyBhIHBhZ2VcbiAqIEBwYXJhbSBMb2FkUGFnZUZ1bmMgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgaW4gYSBwYWdlIHRvIGV4ZWN1dGUgb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBydW5fc2NyaXB0X25hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2NyaXB0IHRvIHJ1bi5cbiAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuXG5mdW5jdGlvbiBCdWlsZFBhZ2UoTG9hZFBhZ2VGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IHZvaWQsIHJ1bl9zY3JpcHRfbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgUGFnZVZhciA9IHt9O1xuXG4gICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiAoUmVzcG9uc2U6IFJlc3BvbnNlLCBSZXF1ZXN0OiBSZXF1ZXN0LCBQb3N0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgbnVsbCwgUXVlcnk6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIENvb2tpZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIFNlc3Npb246IHsgW2tleTogc3RyaW5nXTogYW55IH0sIEZpbGVzOiBGaWxlcywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBvdXRfcnVuX3NjcmlwdCA9IHsgdGV4dDogJycgfTtcblxuICAgICAgICBmdW5jdGlvbiBUb1N0cmluZ0luZm8oc3RyOiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzU3RyaW5nID0gc3RyPy50b1N0cmluZz8uKCk7XG4gICAgICAgICAgICBpZiAoYXNTdHJpbmcgPT0gbnVsbCB8fCBhc1N0cmluZy5zdGFydHNXaXRoKCdbb2JqZWN0IE9iamVjdF0nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdHIsIG51bGwsIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UmVzcG9uc2UodGV4dDogYW55KSB7XG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ID0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCA9ICcnKSB7XG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB3cml0ZVNhZmUoc3RyID0gJycpIHtcbiAgICAgICAgICAgIHN0ciA9IFRvU3RyaW5nSW5mbyhzdHIpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2Ygc3RyKSB7XG4gICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSAnJiMnICsgaS5jaGFyQ29kZUF0KDApICsgJzsnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZWNobyhhcnI6IHN0cmluZ1tdLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgd3JpdGVTYWZlKHBhcmFtc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyLmF0KC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWRpcmVjdFBhdGg6IGFueSA9IGZhbHNlO1xuXG4gICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0ID0gKHBhdGg6IHN0cmluZywgc3RhdHVzPzogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSBTdHJpbmcocGF0aCk7XG4gICAgICAgICAgICBpZiAoc3RhdHVzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5zdGF0dXMoc3RhdHVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFJlc3BvbnNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICg8YW55PlJlc3BvbnNlKS5yZWxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBSZXNwb25zZS5yZWRpcmVjdChSZXF1ZXN0LnVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW5kRmlsZShmaWxlUGF0aCwgZGVsZXRlQWZ0ZXIgPSBmYWxzZSkge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0geyBmaWxlOiBmaWxlUGF0aCwgZGVsZXRlQWZ0ZXIgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IERhdGFTZW5kID0ge1xuICAgICAgICAgICAgc2VuZEZpbGUsXG4gICAgICAgICAgICB3cml0ZVNhZmUsXG4gICAgICAgICAgICB3cml0ZSxcbiAgICAgICAgICAgIGVjaG8sXG4gICAgICAgICAgICBzZXRSZXNwb25zZSxcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LFxuICAgICAgICAgICAgcnVuX3NjcmlwdF9uYW1lLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUG9zdCxcbiAgICAgICAgICAgIFF1ZXJ5LFxuICAgICAgICAgICAgU2Vzc2lvbixcbiAgICAgICAgICAgIEZpbGVzLFxuICAgICAgICAgICAgQ29va2llcyxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBQYWdlVmFyLFxuICAgICAgICAgICAgR2xvYmFsVmFyLFxuICAgICAgICAgICAgY29kZWJhc2U6ICcnXG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBMb2FkUGFnZUZ1bmMoRGF0YVNlbmQpO1xuXG4gICAgICAgIHJldHVybiB7IG91dF9ydW5fc2NyaXB0OiBvdXRfcnVuX3NjcmlwdC50ZXh0LCByZWRpcmVjdFBhdGggfVxuICAgIH0pXG59XG5cbmV4cG9ydCB7IExvYWRQYWdlLCBCdWlsZFBhZ2UsIGdldEZ1bGxQYXRoQ29tcGlsZSwgRXhwb3J0LCBTcGxpdEZpcnN0IH07XG4iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSwgQWRkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuXG50eXBlIFJlcXVpcmVGaWxlcyA9IHtcbiAgICBwYXRoOiBzdHJpbmdcbiAgICBzdGF0dXM/OiBudW1iZXJcbiAgICBtb2RlbDogYW55XG4gICAgZGVwZW5kZW5jaWVzPzogU3RyaW5nQW55TWFwXG4gICAgc3RhdGljPzogYm9vbGVhblxufVxuXG5jb25zdCBDYWNoZVJlcXVpcmVGaWxlcyA9IHt9O1xuXG4vKipcbiAqIEl0IG1ha2VzIGEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBkZXBlbmRlbmNpZXMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSBhcnJheSBvZiBiYXNlIHBhdGhzXG4gKiBAcGFyYW0gW2Jhc2VQYXRoXSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgY29tcGlsZWQuXG4gKiBAcGFyYW0gY2FjaGUgLSBBIGNhY2hlIG9mIHRoZSBsYXN0IHRpbWUgYSBmaWxlIHdhcyBtb2RpZmllZC5cbiAqIEByZXR1cm5zIEEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IFN0cmluZ0FueU1hcCwgdHlwZUFycmF5OiBzdHJpbmdbXSwgYmFzZVBhdGggPSAnJywgY2FjaGUgPSB7fSkge1xuICAgIGNvbnN0IGRlcGVuZGVuY2llc01hcDogU3RyaW5nQW55TWFwID0ge307XG4gICAgY29uc3QgcHJvbWlzZUFsbCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ZpbGVQYXRoLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBwcm9taXNlQWxsLnB1c2goKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aCA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWNoZVtiYXNlUGF0aF0pXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2Jhc2VQYXRoXSA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIGJhc2VQYXRoLCAnbXRpbWVNcycsIHRydWUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFsndGhpc0ZpbGUnXSA9IGNhY2hlW2Jhc2VQYXRoXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwW2ZpbGVQYXRoXSA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoPGFueT52YWx1ZSwgdHlwZUFycmF5LCBmaWxlUGF0aCwgY2FjaGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICkoKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZUFsbCk7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llc01hcDtcbn1cblxuLyoqXG4gKiBJZiB0aGUgb2xkIGRlcGVuZGVuY2llcyBhbmQgdGhlIG5ldyBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY3kgbWFwLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZS5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXApIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGRlcGVuZGVuY3kgdHJlZXMsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbmFtZXMgb2YgdGhlIG1vZHVsZXMgdGhhdCBoYXZlIGNoYW5nZWRcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIFtwYXJlbnRdIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmVudCBtb2R1bGUuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MuIEVhY2ggc3RyaW5nIHJlcHJlc2VudHMgYSBjaGFuZ2UgaW4gdGhlIGRlcGVuZGVuY3lcbiAqIHRyZWUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYW5nZUFycmF5KG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwLCBwYXJlbnQgPSAnJyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBjaGFuZ2VBcnJheSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghbmV3RGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChuYW1lKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlID0gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKC4uLmNoYW5nZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlQXJyYXk7XG59XG5cbi8qKlxuICogSXQgaW1wb3J0cyBhIGZpbGUgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gcGF0aHMgdHlwZXMuXG4gKiBAcGFyYW0gTGFzdFJlcXVpcmUgLSBBIG1hcCBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW5cbiAqIEByZXR1cm5zIFRoZSBtb2RlbCB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBMYXN0UmVxdWlyZTogeyBba2V5OiBzdHJpbmddOiBSZXF1aXJlRmlsZXMgfSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IFJlcUZpbGUgPSBMYXN0UmVxdWlyZVtmaWxlUGF0aF07XG5cbiAgICBsZXQgZmlsZUV4aXN0czogbnVtYmVyLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXA7XG4gICAgaWYgKFJlcUZpbGUpIHtcblxuICAgICAgICBpZiAoIWlzRGVidWcgfHwgaXNEZWJ1ZyAmJiAoUmVxRmlsZS5zdGF0dXMgPT0gLTEpKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIFJlcUZpbGUucGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcblxuICAgICAgICAgICAgbmV3RGVwcyA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSk7XG5cbiAgICAgICAgICAgIGlmIChjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShSZXFGaWxlLmRlcGVuZGVuY2llcywgbmV3RGVwcykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgfSBlbHNlIGlmIChSZXFGaWxlLnN0YXR1cyA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgc3RhdGljX21vZHVsZXMgPSBmYWxzZTtcblxuICAgIGlmICghUmVxRmlsZSkge1xuICAgICAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKVxuICAgICAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5yZWxhdGl2ZSh0eXBlQXJyYXlbMF0sIF9fZGlybmFtZSksIGZpbGVQYXRoKTtcblxuICAgICAgICBlbHNlIGlmIChmaWxlUGF0aFswXSAhPSAnLycpXG4gICAgICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IHRydWU7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCA9IFJlcUZpbGUucGF0aDtcbiAgICAgICAgc3RhdGljX21vZHVsZXMgPSBSZXFGaWxlLnN0YXRpYztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGljX21vZHVsZXMpXG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEFsaWFzT3JQYWNrYWdlKGNvcHlQYXRoKSwgc3RhdHVzOiAtMSwgc3RhdGljOiB0cnVlLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgIGVsc2Uge1xuICAgICAgICAvLyBhZGQgc2Vydi5qcyBvciBzZXJ2LnRzIGlmIG5lZWRlZFxuICAgICAgICBmaWxlUGF0aCA9IEFkZEV4dGVuc2lvbihmaWxlUGF0aCk7XG5cbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSB0eXBlQXJyYXlbMF0gKyBmaWxlUGF0aDtcbiAgICAgICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVNb2RlbCA9IENhY2hlUmVxdWlyZUZpbGVzW2ZpbGVQYXRoXTtcbiAgICAgICAgICAgIGlmIChoYXZlTW9kZWwgJiYgY29tcGFyZURlcGVuZGVuY2llc1NhbWUoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcyA9IG5ld0RlcHMgPz8gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpKSlcbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSBoYXZlTW9kZWw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdEZXBzID0gbmV3RGVwcyA/PyB7fTtcblxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEltcG9ydEZpbGUoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShfX2ZpbGVuYW1lKSwgZmlsZVBhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgbmV3RGVwcywgaGF2ZU1vZGVsICYmIGdldENoYW5nZUFycmF5KGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKSwgZGVwZW5kZW5jaWVzOiBuZXdEZXBzLCBwYXRoOiBmaWxlUGF0aCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiB7fSwgc3RhdHVzOiAwLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtmaWxlUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tIDxjb2xvcj4nJHtfX2ZpbGVuYW1lfSdgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYnVpbHRNb2RlbCA9IExhc3RSZXF1aXJlW2NvcHlQYXRoXTtcbiAgICBDYWNoZVJlcXVpcmVGaWxlc1tidWlsdE1vZGVsLnBhdGhdID0gYnVpbHRNb2RlbDtcblxuICAgIHJldHVybiBidWlsdE1vZGVsLm1vZGVsO1xufSIsICJpbXBvcnQgUmVxdWlyZUZpbGUgZnJvbSAnLi9JbXBvcnRGaWxlUnVudGltZSc7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCB0cmltVHlwZSwgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcblxuLy8gLS0gc3RhcnQgb2YgZmV0Y2ggZmlsZSArIGNhY2hlIC0tXG5cbnR5cGUgYXBpSW5mbyA9IHtcbiAgICBwYXRoU3BsaXQ6IG51bWJlcixcbiAgICBkZXBzTWFwOiB7IFtrZXk6IHN0cmluZ106IGFueSB9XG59XG5cbmNvbnN0IGFwaVN0YXRpY01hcDogeyBba2V5OiBzdHJpbmddOiBhcGlJbmZvIH0gPSB7fTtcblxuLyoqXG4gKiBHaXZlbiBhIHVybCwgcmV0dXJuIHRoZSBzdGF0aWMgcGF0aCBhbmQgZGF0YSBpbmZvIGlmIHRoZSB1cmwgaXMgaW4gdGhlIHN0YXRpYyBtYXBcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgdGhlIHVzZXIgaXMgcmVxdWVzdGluZy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXRoU3BsaXQgLSB0aGUgbnVtYmVyIG9mIHNsYXNoZXMgaW4gdGhlIHVybC5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6XG4gKi9cbmZ1bmN0aW9uIGdldEFwaUZyb21NYXAodXJsOiBzdHJpbmcsIHBhdGhTcGxpdDogbnVtYmVyKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFwaVN0YXRpY01hcCk7XG4gICAgZm9yIChjb25zdCBpIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgZSA9IGFwaVN0YXRpY01hcFtpXTtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpICYmIGUucGF0aFNwbGl0ID09IHBhdGhTcGxpdClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdGljUGF0aDogaSxcbiAgICAgICAgICAgICAgICBkYXRhSW5mbzogZVxuICAgICAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogRmluZCB0aGUgQVBJIGZpbGUgZm9yIGEgZ2l2ZW4gVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiB0aGUgQVBJLlxuICogQHJldHVybnMgVGhlIHBhdGggdG8gdGhlIEFQSSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBmaW5kQXBpUGF0aCh1cmw6IHN0cmluZykge1xuXG4gICAgd2hpbGUgKHVybC5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQYXRoID0gcGF0aC5qb2luKGdldFR5cGVzLlN0YXRpY1swXSwgdXJsICsgJy5hcGknKTtcbiAgICAgICAgY29uc3QgbWFrZVByb21pc2UgPSBhc3luYyAodHlwZTogc3RyaW5nKSA9PiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoc3RhcnRQYXRoICsgJy4nICsgdHlwZSkgJiYgdHlwZSk7XG5cbiAgICAgICAgY29uc3QgZmlsZVR5cGUgPSAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgbWFrZVByb21pc2UoJ3RzJyksXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgnanMnKVxuICAgICAgICBdKSkuZmlsdGVyKHggPT4geCkuc2hpZnQoKTtcblxuICAgICAgICBpZiAoZmlsZVR5cGUpXG4gICAgICAgICAgICByZXR1cm4gdXJsICsgJy5hcGkuJyArIGZpbGVUeXBlO1xuXG4gICAgICAgIHVybCA9IEN1dFRoZUxhc3QoJy8nLCB1cmwpO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHBhdGhTcGxpdCA9IHVybC5zcGxpdCgnLycpLmxlbmd0aDtcbiAgICBsZXQgeyBzdGF0aWNQYXRoLCBkYXRhSW5mbyB9ID0gZ2V0QXBpRnJvbU1hcCh1cmwsIHBhdGhTcGxpdCk7XG5cbiAgICBpZiAoIWRhdGFJbmZvKSB7XG4gICAgICAgIHN0YXRpY1BhdGggPSBhd2FpdCBmaW5kQXBpUGF0aCh1cmwpO1xuXG4gICAgICAgIGlmIChzdGF0aWNQYXRoKSB7XG4gICAgICAgICAgICBkYXRhSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBwYXRoU3BsaXQsXG4gICAgICAgICAgICAgICAgZGVwc01hcDoge31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBpU3RhdGljTWFwW3N0YXRpY1BhdGhdID0gZGF0YUluZm87XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YUluZm8pIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IE1ha2VDYWxsKFxuICAgICAgICAgICAgYXdhaXQgUmVxdWlyZUZpbGUoJy8nICsgc3RhdGljUGF0aCwgJ2FwaS1jYWxsJywgJycsIGdldFR5cGVzLlN0YXRpYywgZGF0YUluZm8uZGVwc01hcCwgaXNEZWJ1ZyksXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICB1cmwuc3Vic3RyaW5nKHN0YXRpY1BhdGgubGVuZ3RoIC0gNiksXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgbmV4dFByYXNlXG4gICAgICAgICk7XG4gICAgfVxufVxuLy8gLS0gZW5kIG9mIGZldGNoIGZpbGUgLS1cbmNvbnN0IGJhbldvcmRzID0gWyd2YWxpZGF0ZVVSTCcsICd2YWxpZGF0ZUZ1bmMnLCAnZnVuYycsICdkZWZpbmUnLCAuLi5odHRwLk1FVEhPRFNdO1xuLyoqXG4gKiBGaW5kIHRoZSBCZXN0IFBhdGhcbiAqL1xuZnVuY3Rpb24gZmluZEJlc3RVcmxPYmplY3Qob2JqOiBhbnksIHVybEZyb206IHN0cmluZykge1xuICAgIGxldCBtYXhMZW5ndGggPSAwLCB1cmwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBpbiBvYmopIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaS5sZW5ndGg7XG4gICAgICAgIGlmIChtYXhMZW5ndGggPCBsZW5ndGggJiYgdXJsRnJvbS5zdGFydHNXaXRoKGkpICYmICFiYW5Xb3Jkcy5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgICAgbWF4TGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICAgICAgdXJsID0gaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogUGFyc2UgQW5kIFZhbGlkYXRlIFVSTFxuICovXG5hc3luYyBmdW5jdGlvbiBwYXJzZVVSTERhdGEodmFsaWRhdGU6IGFueSwgdmFsdWU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCBtYWtlTWFzc2FnZTogKGU6IGFueSkgPT4gc3RyaW5nKSB7XG4gICAgbGV0IHB1c2hEYXRhID0gdmFsdWUsIHJlc0RhdGEgPSB0cnVlLCBlcnJvcjogc3RyaW5nO1xuXG4gICAgc3dpdGNoICh2YWxpZGF0ZSkge1xuICAgICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgY2FzZSBwYXJzZUZsb2F0OlxuICAgICAgICBjYXNlIHBhcnNlSW50OlxuICAgICAgICAgICAgcHVzaERhdGEgPSAoPGFueT52YWxpZGF0ZSkodmFsdWUpO1xuICAgICAgICAgICAgcmVzRGF0YSA9ICFpc05hTihwdXNoRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBCb29sZWFuOlxuICAgICAgICAgICAgcHVzaERhdGEgPSB2YWx1ZSAhPSAnZmFsc2UnO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcmVzRGF0YSA9IHZhbHVlID09ICd0cnVlJyB8fCB2YWx1ZSA9PSAnZmFsc2UnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2FueSc6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbGlkYXRlKSlcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUuaW5jbHVkZXModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWtlVmFsaWQgPSBhd2FpdCB2YWxpZGF0ZSh2YWx1ZSwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWFrZVZhbGlkICYmIHR5cGVvZiBtYWtlVmFsaWQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQudmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoRGF0YSA9IG1ha2VWYWxpZC5wYXJzZSA/PyB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3IsIGZpZWxkIC0gJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodmFsaWRhdGUgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLnRlc3QodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghcmVzRGF0YSlcbiAgICAgICAgZXJyb3IgPSAnVmFsaWRhdGlvbiBlcnJvciB3aXRoIHZhbHVlIFwiJyArIHZhbHVlICsgJ1wiJztcblxuICAgIHJldHVybiBbZXJyb3IsIHB1c2hEYXRhXTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyB0aGUgVVJMIGRhdGEgYW5kIHBhcnNlcyBpdCBpbnRvIGFuIG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBvYmogLSB0aGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIFVSTCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIFRoZSBVUkwgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0ge2FueX0gZGVmaW5lT2JqZWN0IC0gQWxsIHRoZSBkZWZpbml0aW9ucyB0aGF0IGhhcyBiZWVuIGZvdW5kXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0gbWFrZU1hc3NhZ2UgLSBDcmVhdGUgYW4gZXJyb3IgbWVzc2FnZVxuICogQHJldHVybnMgQSBzdHJpbmcgb3IgYW4gb2JqZWN0IHdpdGggYW4gZXJyb3IgcHJvcGVydHkuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZWZpbml0aW9uKG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGRlZmluZU9iamVjdDogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBpZiAoIW9iai5kZWZpbmUpXG4gICAgICAgIHJldHVybiB1cmxGcm9tO1xuXG4gICAgY29uc3QgdmFsaWRhdGVGdW5jID0gb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG4gICAgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmMgPSBudWxsO1xuICAgIGRlbGV0ZSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvYmouZGVmaW5lKSB7XG4gICAgICAgIGNvbnN0IFtkYXRhU2xhc2gsIG5leHRVcmxGcm9tXSA9IFNwbGl0Rmlyc3QoJy8nLCB1cmxGcm9tKTtcbiAgICAgICAgdXJsRnJvbSA9IG5leHRVcmxGcm9tO1xuXG4gICAgICAgIGNvbnN0IFtlcnJvciwgbmV3RGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEob2JqLmRlZmluZVtuYW1lXSwgZGF0YVNsYXNoLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgIGlmKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHtlcnJvcn07XG4gICAgICAgIFxuICAgICAgICBkZWZpbmVPYmplY3RbbmFtZV0gPSBuZXdEYXRhO1xuICAgIH1cblxuICAgIGlmICh2YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IHZhbGlkYXRlRnVuYyhkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnID8gdmFsaWRhdGU6ICdFcnJvciB2YWxpZGF0aW5nIFVSTCd9O1xuICAgIH1cblxuICAgIHJldHVybiB1cmxGcm9tIHx8ICcnO1xufVxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gd2lsbCBwYXJzZSB0aGUgdXJsIGFuZCBmaW5kIHRoZSBiZXN0IG1hdGNoIGZvciB0aGUgdXJsXG4gKiBAcGFyYW0ge2FueX0gZmlsZU1vZHVsZSAtIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgbWV0aG9kIHRoYXQgeW91IHdhbnQgdG8gY2FsbC5cbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gdGhlIHVybCB0aGF0IHRoZSB1c2VyIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gKCkgPT4gUHJvbWlzZTxhbnk+XG4gKiBAcmV0dXJucyBhIGJvb2xlYW4gdmFsdWUuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUsIHRoZSByZXF1ZXN0IGlzIHByb2Nlc3NlZC4gSWYgdGhlIGZ1bmN0aW9uXG4gKiByZXR1cm5zIGZhbHNlLCB0aGUgcmVxdWVzdCBpcyBub3QgcHJvY2Vzc2VkLlxuICovXG5hc3luYyBmdW5jdGlvbiBNYWtlQ2FsbChmaWxlTW9kdWxlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsbG93RXJyb3JJbmZvID0gIUdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSAmJiBpc0RlYnVnLCBtYWtlTWFzc2FnZSA9IChlOiBhbnkpID0+IChpc0RlYnVnID8gcHJpbnQuZXJyb3IoZSkgOiBudWxsKSArIChhbGxvd0Vycm9ySW5mbyA/IGAsIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWAgOiAnJyk7XG4gICAgY29uc3QgbWV0aG9kID0gUmVxdWVzdC5tZXRob2Q7XG4gICAgbGV0IG1ldGhvZE9iaiA9IGZpbGVNb2R1bGVbbWV0aG9kXSB8fCBmaWxlTW9kdWxlLmRlZmF1bHRbbWV0aG9kXTsgLy9Mb2FkaW5nIHRoZSBtb2R1bGUgYnkgbWV0aG9kXG4gICAgbGV0IGhhdmVNZXRob2QgPSB0cnVlO1xuXG4gICAgaWYoIW1ldGhvZE9iail7XG4gICAgICAgIGhhdmVNZXRob2QgPSBmYWxzZTtcbiAgICAgICAgbWV0aG9kT2JqID0gZmlsZU1vZHVsZS5kZWZhdWx0IHx8IGZpbGVNb2R1bGU7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZU1ldGhvZCA9IG1ldGhvZE9iajtcblxuICAgIGNvbnN0IGRlZmluZU9iamVjdCA9IHt9O1xuXG4gICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpOyAvLyByb290IGxldmVsIGRlZmluaXRpb25cbiAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcblxuICAgIGxldCBuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pO1xuXG4gICAgLy9wYXJzZSB0aGUgdXJsIHBhdGhcbiAgICBmb3IobGV0IGkgPSAwOyBpPCAyOyBpKyspe1xuICAgICAgICB3aGlsZSAoKG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSkpKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG4gICAgICAgICAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgICAgICAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuICAgIFxuICAgICAgICAgICAgdXJsRnJvbSA9IHRyaW1UeXBlKCcvJywgdXJsRnJvbS5zdWJzdHJpbmcobmVzdGVkVVJMLmxlbmd0aCkpO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW25lc3RlZFVSTF07XG4gICAgICAgIH1cblxuICAgICAgICBpZighaGF2ZU1ldGhvZCl7IC8vIGNoZWNrIGlmIHRoYXQgYSBtZXRob2RcbiAgICAgICAgICAgIGhhdmVNZXRob2QgPSB0cnVlO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW21ldGhvZF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXRob2RPYmogPSBtZXRob2RPYmo/LmZ1bmMgJiYgbWV0aG9kT2JqIHx8IGJhc2VNZXRob2Q7IC8vIGlmIHRoZXJlIGlzIGFuICdhbnknIG1ldGhvZFxuXG5cbiAgICBpZiAoIW1ldGhvZE9iaj8uZnVuYylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgbGVmdERhdGEgPSB1cmxGcm9tLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgdXJsRGF0YSA9IFtdO1xuXG5cbiAgICBsZXQgZXJyb3I6IHN0cmluZztcbiAgICBpZiAobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCB2YWxpZGF0ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSkge1xuICAgICAgICAgICAgY29uc3QgW2Vycm9yVVJMLCBwdXNoRGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEodmFsaWRhdGUsIGxlZnREYXRhW2luZGV4XSwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yVVJMKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSA8c3RyaW5nPmVycm9yVVJMO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cmxEYXRhLnB1c2gocHVzaERhdGEpO1xuICAgICAgICB9XG4gICAgfSBlbHNlXG4gICAgICAgIHVybERhdGEucHVzaCguLi5sZWZ0RGF0YSk7XG5cbiAgICBpZiAoIWVycm9yICYmIG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMobGVmdERhdGEsIFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIGVycm9yID0gdmFsaWRhdGU7XG4gICAgICAgIGVsc2UgaWYgKCF2YWxpZGF0ZSlcbiAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJztcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgZXJyb3IgfSk7XG5cbiAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBsZXQgYXBpUmVzcG9uc2U6IGFueSwgbmV3UmVzcG9uc2U6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBhcGlSZXNwb25zZSA9IGF3YWl0IG1ldGhvZE9iai5mdW5jKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhLCBkZWZpbmVPYmplY3QsIGxlZnREYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChhbGxvd0Vycm9ySW5mbylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogZS5tZXNzYWdlIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiAnNTAwIC0gSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYXBpUmVzcG9uc2UgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgdGV4dDogYXBpUmVzcG9uc2UgfTtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0gYXBpUmVzcG9uc2UgfHwgbmV3UmVzcG9uc2U7XG5cbiAgICBmaW5hbFN0ZXAoKTsgIC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgIGlmIChuZXdSZXNwb25zZSAhPSBudWxsKVxuICAgICAgICBSZXNwb25zZS5qc29uKG5ld1Jlc3BvbnNlKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgRmFzdENvbXBpbGUgYXMgRmFzdENvbXBpbGUgfSBmcm9tICcuL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IEdldEZpbGUgYXMgR2V0U3RhdGljRmlsZSwgc2VydmVyQnVpbGQgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0ICogYXMgRnVuY1NjcmlwdCBmcm9tICcuL0Z1bmN0aW9uU2NyaXB0JztcbmltcG9ydCBNYWtlQXBpQ2FsbCBmcm9tICcuL0FwaUNhbGwnO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5jb25zdCB7IEV4cG9ydCB9ID0gRnVuY1NjcmlwdDtcblxuZXhwb3J0IGludGVyZmFjZSBFcnJvclBhZ2VzIHtcbiAgICBub3RGb3VuZD86IHtcbiAgICAgICAgcGF0aDogc3RyaW5nLFxuICAgICAgICBjb2RlPzogbnVtYmVyXG4gICAgfSxcbiAgICBzZXJ2ZXJFcnJvcj86IHtcbiAgICAgICAgcGF0aDogc3RyaW5nLFxuICAgICAgICBjb2RlPzogbnVtYmVyXG4gICAgfVxufVxuXG5pbnRlcmZhY2UgR2V0UGFnZXNTZXR0aW5ncyB7XG4gICAgQ2FjaGVEYXlzOiBudW1iZXIsXG4gICAgRGV2TW9kZTogYm9vbGVhbixcbiAgICBDb29raWVTZXR0aW5ncz86IGFueSxcbiAgICBDb29raWVzPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgQ29va2llRW5jcnlwdGVyPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgU2Vzc2lvblN0b3JlPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgRXJyb3JQYWdlczogRXJyb3JQYWdlc1xufVxuXG5jb25zdCBTZXR0aW5nczogR2V0UGFnZXNTZXR0aW5ncyA9IHtcbiAgICBDYWNoZURheXM6IDEsXG4gICAgRGV2TW9kZTogdHJ1ZSxcbiAgICBFcnJvclBhZ2VzOiB7fVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZVRvUmFtKHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bmNTY3JpcHQuZ2V0RnVsbFBhdGhDb21waWxlKHVybCkpKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdID0gW107XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdID0gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZSh1cmwsIGlzRGVidWcpO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdLCB1cmwpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZEFsbFBhZ2VzVG9SYW0oaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGZvciAoY29uc3QgaSBpbiBwYWdlRGVwcy5zdG9yZSkge1xuICAgICAgICBpZiAoIUV4dGVuc2lvbkluQXJyYXkoaSwgPGFueT5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5KSlcbiAgICAgICAgICAgIGF3YWl0IExvYWRQYWdlVG9SYW0oaSwgaXNEZWJ1Zyk7XG5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIENsZWFyQWxsUGFnZXNGcm9tUmFtKCkge1xuICAgIGZvciAoY29uc3QgaSBpbiBFeHBvcnQuUGFnZUxvYWRSYW0pIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBkZWxldGUgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gRXh0ZW5zaW9uSW5BcnJheShmaWxlUGF0aDogc3RyaW5nLCAuLi5hcnJheXM6IHN0cmluZ1tdKSB7XG4gICAgZmlsZVBhdGggPSBmaWxlUGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgIGZvciAoY29uc3QgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheSkge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoLnN1YnN0cmluZyhmaWxlUGF0aC5sZW5ndGggLSBpLmxlbmd0aCAtIDEpID09ICcuJyArIGkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIEdldEVycm9yUGFnZShjb2RlOiBudW1iZXIsIExvY1NldHRpbmdzOiAnbm90Rm91bmQnIHwgJ3NlcnZlckVycm9yJykge1xuICAgIGxldCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZztcbiAgICBpZiAoU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10pIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljO1xuICAgICAgICB1cmwgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5wYXRoO1xuICAgICAgICBjb2RlID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10uY29kZSA/PyBjb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLkxvZ3M7XG4gICAgICAgIHVybCA9ICdlJyArIGNvZGU7XG4gICAgfVxuICAgIHJldHVybiB7IHVybCwgYXJyYXlUeXBlLCBjb2RlIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VCYXNpY0luZm8oUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBjb2RlOiBudW1iZXIpIHtcbiAgICAvL2ZpcnN0IHN0ZXAgLSBwYXJzZSBpbmZvXG4gICAgaWYgKFJlcXVlc3QubWV0aG9kID09IFwiUE9TVFwiKSB7XG4gICAgICAgIGlmICghUmVxdWVzdC5ib2R5IHx8ICFPYmplY3Qua2V5cyhSZXF1ZXN0LmJvZHkpLmxlbmd0aClcbiAgICAgICAgICAgIFJlcXVlc3QuYm9keSA9IFJlcXVlc3QuZmllbGRzIHx8IHt9O1xuXG4gICAgfSBlbHNlXG4gICAgICAgIFJlcXVlc3QuYm9keSA9IGZhbHNlO1xuXG5cbiAgICBpZiAoUmVxdWVzdC5jbG9zZWQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVzKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLlNlc3Npb25TdG9yZShSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuXG4gICAgUmVxdWVzdC5zaWduZWRDb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzIHx8IHt9O1xuICAgIFJlcXVlc3QuZmlsZXMgPSBSZXF1ZXN0LmZpbGVzIHx8IHt9O1xuXG4gICAgY29uc3QgQ29weUNvb2tpZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llcykpO1xuXG4gICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMTtcblxuICAgIC8vc2Vjb25kIHN0ZXBcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAxKVxuICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IGNvZGU7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5zaWduZWRDb29raWVzKSB7Ly91cGRhdGUgY29va2llc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gJ29iamVjdCcgJiYgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9IENvcHlDb29raWVzW2ldIHx8IEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSkgIT0gSlNPTi5zdHJpbmdpZnkoQ29weUNvb2tpZXNbaV0pKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNvb2tpZShpLCBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0sIFNldHRpbmdzLkNvb2tpZVNldHRpbmdzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIENvcHlDb29raWVzKSB7Ly9kZWxldGUgbm90IGV4aXRzIGNvb2tpZXNcbiAgICAgICAgICAgIGlmIChSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jbGVhckNvb2tpZShpKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuXG4vL2ZvciBmaW5hbCBzdGVwXG5mdW5jdGlvbiBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdDogUmVxdWVzdCB8IGFueSkge1xuICAgIGlmICghUmVxdWVzdC5maWxlcykgLy9kZWxldGUgZmlsZXNcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBhcnJQYXRoID0gW11cblxuICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LmZpbGVzKSB7XG5cbiAgICAgICAgY29uc3QgZSA9IFJlcXVlc3QuZmlsZXNbaV07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgaW4gZSkge1xuICAgICAgICAgICAgICAgIGFyclBhdGgucHVzaChlW2FdLmZpbGVwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBhcnJQYXRoLnB1c2goZS5maWxlcGF0aCk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyUGF0aDtcbn1cblxuLy9maW5hbCBzdGVwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVSZXF1ZXN0RmlsZXMoYXJyYXk6IHN0cmluZ1tdKSB7XG4gICAgZm9yIChjb25zdCBlIGluIGFycmF5KVxuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGlzVVJMUGF0aEFGaWxlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIHVybDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBpZiAoY29kZSA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgZnVsbFBhZ2VVcmwgPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyB1cmw7XG4gICAgICAgIC8vY2hlY2sgdGhhdCBpcyBub3Qgc2VydmVyIGZpbGVcbiAgICAgICAgaWYgKGF3YWl0IHNlcnZlckJ1aWxkKFJlcXVlc3QsIFNldHRpbmdzLkRldk1vZGUsIHVybCkgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKVxuICAgICAgICAgICAgcmV0dXJuIGZ1bGxQYWdlVXJsO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRMb2FkUGFnZShzbWFsbFBhdGg6IHN0cmluZywgZmlyc3RGdW5jPzogYW55KSB7XG4gICAgY29uc3QgcGFnZUFycmF5ID0gW2ZpcnN0RnVuYyA/PyBhd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHNtYWxsUGF0aCwgU2V0dGluZ3MuRGV2TW9kZSldO1xuXG4gICAgcGFnZUFycmF5WzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UocGFnZUFycmF5WzBdLCBzbWFsbFBhdGgpO1xuXG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSA9IHBhZ2VBcnJheTtcblxuICAgIHJldHVybiBwYWdlQXJyYXlbMV07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGxvYWQgdGhlIGR5bmFtaWMgcGFnZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gVGhlIGFycmF5IG9mIHR5cGVzIHRoYXQgdGhlIHBhZ2UgaXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbFBhZ2VVcmwgLSBUaGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNtYWxsUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlIGZpbGUuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFRoZSBzdGF0dXMgY29kZSBvZiB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIFRoZSBEeW5hbWljRnVuYyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byBnZW5lcmF0ZSB0aGUgcGFnZS5cbiAqIFRoZSBjb2RlIGlzIHRoZSBzdGF0dXMgY29kZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBUaGUgZnVsbFBhZ2VVcmwgaXMgdGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGNvbnN0IGluU3RhdGljID0gdXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICBjb25zdCBzbWFsbFBhdGggPSBhcnJheVR5cGVbMl0gKyAnLycgKyBpblN0YXRpYztcbiAgICBsZXQgZnVsbFBhZ2VVcmwgPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aDtcblxuICAgIGxldCBEeW5hbWljRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiBhbnk7XG4gICAgaWYgKFNldHRpbmdzLkRldk1vZGUgJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKSB7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShhcnJheVR5cGVbMV0gKyBpblN0YXRpYyArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHNtYWxsUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEZhc3RDb21waWxlKHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIGFycmF5VHlwZSk7XG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMV0pXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgsIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMF0pO1xuXG4gICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzFdKVxuICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG4gICAgZWxzZSBpZiAoIUV4cG9ydC5QYWdlUmFtICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCwgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlswXSk7XG5cbiAgICBlbHNlIGlmIChhcnJheVR5cGUgIT0gZ2V0VHlwZXMuTG9ncykge1xuICAgICAgICBjb25zdCB7IGFycmF5VHlwZSwgY29kZSwgdXJsIH0gPSBHZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcbiAgICAgICAgcmV0dXJuIEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBjb2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBEeW5hbWljRnVuYyxcbiAgICAgICAgY29kZSxcbiAgICAgICAgZnVsbFBhZ2VVcmxcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIE1ha2VQYWdlUmVzcG9uc2UoRHluYW1pY1Jlc3BvbnNlOiBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSkge1xuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoPy5maWxlKSB7XG4gICAgICAgIFJlc3BvbnNlLnNlbmRGaWxlKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBSZXNwb25zZS5vbignZmluaXNoJywgcmVzKSk7XG4gICAgfSBlbHNlIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoKSB7XG4gICAgICAgIFJlc3BvbnNlLndyaXRlSGVhZCgzMDIsIHsgTG9jYXRpb246IER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGggfSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IFJlc1BhZ2UgPSBEeW5hbWljUmVzcG9uc2Uub3V0X3J1bl9zY3JpcHQudHJpbSgpO1xuICAgICAgICBpZiAoUmVzUGFnZSkge1xuICAgICAgICAgICAgUmVzcG9uc2Uuc2VuZChSZXNQYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLmVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGguZGVsZXRlQWZ0ZXIpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLnVubGlua0lmRXhpc3RzKFJlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIGEgcmVxdWVzdCBpcyBtYWRlIHRvIGEgcGFnZS4gXG4gKiBJdCB3aWxsIGNoZWNrIGlmIHRoZSBwYWdlIGV4aXN0cywgYW5kIGlmIGl0IGRvZXMsIGl0IHdpbGwgcmV0dXJuIHRoZSBwYWdlLiBcbiAqIElmIGl0IGRvZXMgbm90IGV4aXN0LCBpdCB3aWxsIHJldHVybiBhIDQwNCBwYWdlXG4gKiBAcGFyYW0ge1JlcXVlc3QgfCBhbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGhzXG4gKiBsb2FkZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiB0aGUgcGFnZSB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3sgZmlsZTogYm9vbGVhbiwgZnVsbFBhZ2VVcmw6IHN0cmluZyB9fSBGaWxlSW5mbyAtIHRoZSBmaWxlIGluZm8gb2YgdGhlIHBhZ2UgdGhhdCBpcyBiZWluZyBhY3RpdmF0ZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIG51bWJlclxuICogQHBhcmFtIG5leHRQcmFzZSAtIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS4gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGR5bmFtaWMgcGFnZVxuICogaXMgbG9hZGVkLlxuICogQHJldHVybnMgTm90aGluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQWN0aXZhdGVQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSwgYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlciwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCB7IER5bmFtaWNGdW5jLCBmdWxsUGFnZVVybCwgY29kZTogbmV3Q29kZSB9ID0gYXdhaXQgR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlLCB1cmwsIGNvZGUpO1xuXG4gICAgaWYgKCFmdWxsUGFnZVVybCB8fCAhRHluYW1pY0Z1bmMgJiYgY29kZSA9PSA1MDApXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5zZW5kU3RhdHVzKG5ld0NvZGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuICAgICAgICBjb25zdCBwYWdlRGF0YSA9IGF3YWl0IER5bmFtaWNGdW5jKFJlc3BvbnNlLCBSZXF1ZXN0LCBSZXF1ZXN0LmJvZHksIFJlcXVlc3QucXVlcnksIFJlcXVlc3QuY29va2llcywgUmVxdWVzdC5zZXNzaW9uLCBSZXF1ZXN0LmZpbGVzLCBTZXR0aW5ncy5EZXZNb2RlKTtcbiAgICAgICAgZmluYWxTdGVwKCk7IC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgICAgICBhd2FpdCBNYWtlUGFnZVJlc3BvbnNlKFxuICAgICAgICAgICAgcGFnZURhdGEsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoZSk7XG4gICAgICAgIFJlcXVlc3QuZXJyb3IgPSBlO1xuXG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg1MDAsICdzZXJ2ZXJFcnJvcicpO1xuXG4gICAgICAgIER5bmFtaWNQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRHluYW1pY1BhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55LCB1cmw6IHN0cmluZywgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljLCBjb2RlID0gMjAwKSB7XG4gICAgY29uc3QgRmlsZUluZm8gPSBhd2FpdCBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0LCB1cmwsIGNvZGUpO1xuXG4gICAgY29uc3QgbWFrZURlbGV0ZUFycmF5ID0gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3QpXG5cbiAgICBpZiAoRmlsZUluZm8pIHtcbiAgICAgICAgU2V0dGluZ3MuQ2FjaGVEYXlzICYmIFJlc3BvbnNlLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJtYXgtYWdlPVwiICsgKFNldHRpbmdzLkNhY2hlRGF5cyAqIDI0ICogNjAgKiA2MCkpO1xuICAgICAgICBhd2FpdCBHZXRTdGF0aWNGaWxlKHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRQcmFzZSA9ICgpID0+IFBhcnNlQmFzaWNJbmZvKFJlcXVlc3QsIFJlc3BvbnNlLCBjb2RlKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBjb25zdCBpc0FwaSA9IGF3YWl0IE1ha2VBcGlDYWxsKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmwsIFNldHRpbmdzLkRldk1vZGUsIG5leHRQcmFzZSk7XG4gICAgaWYgKCFpc0FwaSAmJiAhYXdhaXQgQWN0aXZhdGVQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBhcnJheVR5cGUsIHVybCwgY29kZSwgbmV4dFByYXNlKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7IC8vIGRlbGV0ZSBmaWxlc1xufVxuXG5mdW5jdGlvbiB1cmxGaXgodXJsOiBzdHJpbmcpIHtcbiAgICBpZiAodXJsID09ICcvJykge1xuICAgICAgICB1cmwgPSAnL2luZGV4JztcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHVybCk7XG59XG5cbmV4cG9ydCB7XG4gICAgU2V0dGluZ3MsXG4gICAgRHluYW1pY1BhZ2UsXG4gICAgTG9hZEFsbFBhZ2VzVG9SYW0sXG4gICAgQ2xlYXJBbGxQYWdlc0Zyb21SYW0sXG4gICAgdXJsRml4LFxuICAgIEdldEVycm9yUGFnZVxufSIsICJpbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCAqIGFzIEJ1aWxkU2VydmVyIGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBjb29raWVQYXJzZXIgfSBmcm9tICdAdGlueWh0dHAvY29va2llLXBhcnNlcic7XG5pbXBvcnQgY29va2llRW5jcnlwdGVyIGZyb20gJ2Nvb2tpZS1lbmNyeXB0ZXInO1xuaW1wb3J0IHsgYWxsb3dQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHNlc3Npb24gZnJvbSAnZXhwcmVzcy1zZXNzaW9uJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEluc2VydE1vZGVsc1NldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCB7IFN0YXJ0UmVxdWlyZSwgR2V0U2V0dGluZ3MgfSBmcm9tICcuL0ltcG9ydE1vZHVsZSc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBjcmVhdGVOZXdQcmludFNldHRpbmdzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvTG9nZ2VyJztcbmltcG9ydCBNZW1vcnlTZXNzaW9uIGZyb20gJ21lbW9yeXN0b3JlJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGRlYnVnU2l0ZU1hcCB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TaXRlTWFwJztcbmltcG9ydCB7IHNldHRpbmdzIGFzIGRlZmluZVNldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQge0V4cG9ydCBhcyBFeHBvcnRSYW19IGZyb20gJy4uL1J1blRpbWVCdWlsZC9GdW5jdGlvblNjcmlwdCdcblxuY29uc3RcbiAgICBDb29raWVzU2VjcmV0ID0gdXVpZHY0KCkuc3Vic3RyaW5nKDAsIDMyKSxcbiAgICBTZXNzaW9uU2VjcmV0ID0gdXVpZHY0KCksXG4gICAgTWVtb3J5U3RvcmUgPSBNZW1vcnlTZXNzaW9uKHNlc3Npb24pLFxuXG4gICAgQ29va2llc01pZGRsZXdhcmUgPSBjb29raWVQYXJzZXIoQ29va2llc1NlY3JldCksXG4gICAgQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZSA9IGNvb2tpZUVuY3J5cHRlcihDb29raWVzU2VjcmV0LCB7fSksXG4gICAgQ29va2llU2V0dGluZ3MgPSB7IGh0dHBPbmx5OiB0cnVlLCBzaWduZWQ6IHRydWUsIG1heEFnZTogODY0MDAwMDAgKiAzMCB9O1xuXG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llcyA9IDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyID0gPGFueT5Db29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZVNldHRpbmdzID0gQ29va2llU2V0dGluZ3M7XG5cbmxldCBEZXZNb2RlXyA9IHRydWUsIGNvbXBpbGF0aW9uU2NhbjogUHJvbWlzZTwoKSA9PiBQcm9taXNlPHZvaWQ+PiwgU2Vzc2lvblN0b3JlO1xuXG5sZXQgZm9ybWlkYWJsZVNlcnZlciwgYm9keVBhcnNlclNlcnZlcjtcblxuY29uc3Qgc2VydmVMaW1pdHMgPSB7XG4gICAgc2Vzc2lvblRvdGFsUmFtTUI6IDE1MCxcbiAgICBzZXNzaW9uVGltZU1pbnV0ZXM6IDQwLFxuICAgIHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM6IDMwLFxuICAgIGZpbGVMaW1pdE1COiAxMCxcbiAgICByZXF1ZXN0TGltaXRNQjogNFxufVxuXG5sZXQgcGFnZUluUmFtQWN0aXZhdGU6ICgpID0+IFByb21pc2U8dm9pZD47XG5leHBvcnQgZnVuY3Rpb24gcGFnZUluUmFtQWN0aXZhdGVGdW5jKCl7XG4gICAgcmV0dXJuIHBhZ2VJblJhbUFjdGl2YXRlO1xufVxuXG5jb25zdCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzID0gWy4uLkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXldO1xuY29uc3QgYmFzZVZhbGlkUGF0aCA9IFsocGF0aDogc3RyaW5nKSA9PiBwYXRoLnNwbGl0KCcuJykuYXQoLTIpICE9ICdzZXJ2J107IC8vIGlnbm9yaW5nIGZpbGVzIHRoYXQgZW5kcyB3aXRoIC5zZXJ2LipcblxuZXhwb3J0IGNvbnN0IEV4cG9ydDogRXhwb3J0U2V0dGluZ3MgPSB7XG4gICAgZ2V0IHNldHRpbmdzUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyBcIi9TZXR0aW5nc1wiO1xuICAgIH0sXG4gICAgc2V0IGRldmVsb3BtZW50KHZhbHVlKSB7XG4gICAgICAgIGlmKERldk1vZGVfID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgRGV2TW9kZV8gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgY29tcGlsYXRpb25TY2FuID0gQnVpbGRTZXJ2ZXIuY29tcGlsZUFsbChFeHBvcnQpO1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBcInByb2R1Y3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRGV2TW9kZSA9IHZhbHVlO1xuICAgICAgICBhbGxvd1ByaW50KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldCBkZXZlbG9wbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIERldk1vZGVfO1xuICAgIH0sXG4gICAgbWlkZGxld2FyZToge1xuICAgICAgICBnZXQgY29va2llcygpOiAocmVxOiBSZXF1ZXN0LCBfcmVzOiBSZXNwb25zZTxhbnk+LCBuZXh0PzogTmV4dEZ1bmN0aW9uKSA9PiB2b2lkIHtcbiAgICAgICAgICAgIHJldHVybiA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llRW5jcnlwdGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TdG9yZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZvcm1pZGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWlkYWJsZVNlcnZlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGJvZHlQYXJzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keVBhcnNlclNlcnZlcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VjcmV0OiB7XG4gICAgICAgIGdldCBjb29raWVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXNTZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBnZW5lcmFsOiB7XG4gICAgICAgIGltcG9ydE9uTG9hZDogW10sXG4gICAgICAgIHNldCBwYWdlSW5SYW0odmFsdWUpIHtcbiAgICAgICAgICAgIEV4cG9ydFJhbS5QYWdlUmFtID0gdmFsdWU7XG4gICAgICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVwYXJhdGlvbnMgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgICAgICAgICAgICAgYXdhaXQgcHJlcGFyYXRpb25zPy4oKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZUJ5VXJsLkxvYWRBbGxQYWdlc1RvUmFtKEV4cG9ydC5kZXZlbG9wbWVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZUJ5VXJsLkNsZWFyQWxsUGFnZXNGcm9tUmFtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXQgcGFnZUluUmFtKCkge1xuICAgICAgICAgICAgcmV0dXJuIEV4cG9ydFJhbS5QYWdlUmFtO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21waWxlOiB7XG4gICAgICAgIHNldCBjb21waWxlU3ludGF4KHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4ID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb21waWxlU3ludGF4KCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBpZ25vcmVFcnJvcih2YWx1ZSkge1xuICAgICAgICAgICAgKDxhbnk+Y3JlYXRlTmV3UHJpbnRTZXR0aW5ncykuUHJldmVudEVycm9ycyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgaWdub3JlRXJyb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+Y3JlYXRlTmV3UHJpbnRTZXR0aW5ncykuUHJldmVudEVycm9ycztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHBsdWdpbnModmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwbHVnaW5zKCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBkZWZpbmUoKXtcbiAgICAgICAgICAgIHJldHVybiBkZWZpbmVTZXR0aW5ncy5kZWZpbmVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGRlZmluZSh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lU2V0dGluZ3MuZGVmaW5lID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmc6IHtcbiAgICAgICAgcnVsZXM6IHt9LFxuICAgICAgICB1cmxTdG9wOiBbXSxcbiAgICAgICAgdmFsaWRQYXRoOiBiYXNlVmFsaWRQYXRoLFxuICAgICAgICBpZ25vcmVUeXBlczogYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyxcbiAgICAgICAgaWdub3JlUGF0aHM6IFtdLFxuICAgICAgICBzaXRlbWFwOiB0cnVlLFxuICAgICAgICBnZXQgZXJyb3JQYWdlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGVycm9yUGFnZXModmFsdWUpIHtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlTGltaXRzOiB7XG4gICAgICAgIGdldCBjYWNoZURheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY2FjaGVEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZXNFeHBpcmVzRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZVNldHRpbmdzLm1heEFnZSAvIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY29va2llc0V4cGlyZXNEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIENvb2tpZVNldHRpbmdzLm1heEFnZSA9IHZhbHVlICogODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVG90YWxSYW1NQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVG90YWxSYW1NQigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRpbWVNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVGltZU1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBmaWxlTGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZpbGVMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcmVxdWVzdExpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgICAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHJlcXVlc3RMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZToge1xuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBodHRwMjogZmFsc2UsXG4gICAgICAgIGdyZWVuTG9jazoge1xuICAgICAgICAgICAgc3RhZ2luZzogbnVsbCxcbiAgICAgICAgICAgIGNsdXN0ZXI6IG51bGwsXG4gICAgICAgICAgICBlbWFpbDogbnVsbCxcbiAgICAgICAgICAgIGFnZW50OiBudWxsLFxuICAgICAgICAgICAgYWdyZWVUb1Rlcm1zOiBmYWxzZSxcbiAgICAgICAgICAgIHNpdGVzOiBbXVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtaWRhYmxlKCkge1xuICAgIGZvcm1pZGFibGVTZXJ2ZXIgPSB7XG4gICAgICAgIG1heEZpbGVTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgKiAxMDQ4NTc2LFxuICAgICAgICB1cGxvYWREaXI6IFN5c3RlbURhdGEgKyBcIi9VcGxvYWRGaWxlcy9cIixcbiAgICAgICAgbXVsdGlwbGVzOiB0cnVlLFxuICAgICAgICBtYXhGaWVsZHNTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKiAxMDQ4NTc2XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQm9keVBhcnNlcigpIHtcbiAgICBib2R5UGFyc2VyU2VydmVyID0gKDxhbnk+Ym9keVBhcnNlcikuanNvbih7IGxpbWl0OiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKyAnbWInIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNlc3Npb24oKSB7XG4gICAgaWYgKCFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzIHx8ICFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIpIHtcbiAgICAgICAgU2Vzc2lvblN0b3JlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBTZXNzaW9uU3RvcmUgPSBzZXNzaW9uKHtcbiAgICAgICAgY29va2llOiB7IG1heEFnZTogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyAqIDYwICogMTAwMCwgc2FtZVNpdGU6IHRydWUgfSxcbiAgICAgICAgc2VjcmV0OiBTZXNzaW9uU2VjcmV0LFxuICAgICAgICByZXNhdmU6IGZhbHNlLFxuICAgICAgICBzYXZlVW5pbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgIHN0b3JlOiBuZXcgTWVtb3J5U3RvcmUoe1xuICAgICAgICAgICAgY2hlY2tQZXJpb2Q6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgbWF4OiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgKiAxMDQ4NTc2XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvcHlKU09OKHRvOiBhbnksIGpzb246IGFueSwgcnVsZXM6IHN0cmluZ1tdID0gW10sIHJ1bGVzVHlwZTogJ2lnbm9yZScgfCAnb25seScgPSAnaWdub3JlJykge1xuICAgIGlmKCFqc29uKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IGhhc0ltcGxlYXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgaSBpbiBqc29uKSB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGUgPSBydWxlcy5pbmNsdWRlcyhpKTtcbiAgICAgICAgaWYgKHJ1bGVzVHlwZSA9PSAnb25seScgJiYgaW5jbHVkZSB8fCBydWxlc1R5cGUgPT0gJ2lnbm9yZScgJiYgIWluY2x1ZGUpIHtcbiAgICAgICAgICAgIGhhc0ltcGxlYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0b1tpXSA9IGpzb25baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0ltcGxlYXRlZDtcbn1cblxuLy8gcmVhZCB0aGUgc2V0dGluZ3Mgb2YgdGhlIHdlYnNpdGVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlU2V0dGluZ3MoKSB7XG4gICAgY29uc3QgU2V0dGluZ3M6IEV4cG9ydFNldHRpbmdzID0gYXdhaXQgR2V0U2V0dGluZ3MoRXhwb3J0LnNldHRpbmdzUGF0aCwgRGV2TW9kZV8pO1xuICAgIGlmKFNldHRpbmdzID09IG51bGwpIHJldHVybjtcblxuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudClcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbERldik7XG5cbiAgICBlbHNlXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxQcm9kKTtcblxuXG4gICAgY29weUpTT04oRXhwb3J0LmNvbXBpbGUsIFNldHRpbmdzLmNvbXBpbGUpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnJvdXRpbmcsIFNldHRpbmdzLnJvdXRpbmcsIFsnaWdub3JlVHlwZXMnLCAndmFsaWRQYXRoJ10pO1xuXG4gICAgLy9jb25jYXQgZGVmYXVsdCB2YWx1ZXMgb2Ygcm91dGluZ1xuICAgIGNvbnN0IGNvbmNhdEFycmF5ID0gKG5hbWU6IHN0cmluZywgYXJyYXk6IGFueVtdKSA9PiBTZXR0aW5ncy5yb3V0aW5nPy5bbmFtZV0gJiYgKEV4cG9ydC5yb3V0aW5nW25hbWVdID0gU2V0dGluZ3Mucm91dGluZ1tuYW1lXS5jb25jYXQoYXJyYXkpKTtcblxuICAgIGNvbmNhdEFycmF5KCdpZ25vcmVUeXBlcycsIGJhc2VSb3V0aW5nSWdub3JlVHlwZXMpO1xuICAgIGNvbmNhdEFycmF5KCd2YWxpZFBhdGgnLCBiYXNlVmFsaWRQYXRoKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnY2FjaGVEYXlzJywgJ2Nvb2tpZXNFeHBpcmVzRGF5cyddLCAnb25seScpO1xuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydzZXNzaW9uVG90YWxSYW1NQicsICdzZXNzaW9uVGltZU1pbnV0ZXMnLCAnc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnZmlsZUxpbWl0TUInLCAncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG4gICAgfVxuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlLCBTZXR0aW5ncy5zZXJ2ZSk7XG5cbiAgICAvKiAtLS0gcHJvYmxlbWF0aWMgdXBkYXRlcyAtLS0gKi9cbiAgICBFeHBvcnQuZGV2ZWxvcG1lbnQgPSBTZXR0aW5ncy5kZXZlbG9wbWVudFxuXG4gICAgaWYgKFNldHRpbmdzLmdlbmVyYWw/LmltcG9ydE9uTG9hZCkge1xuICAgICAgICBFeHBvcnQuZ2VuZXJhbC5pbXBvcnRPbkxvYWQgPSA8YW55PmF3YWl0IFN0YXJ0UmVxdWlyZSg8YW55PlNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkLCBEZXZNb2RlXyk7XG4gICAgfVxuXG4gICAgLy9uZWVkIHRvIGRvd24gbGFzdGVkIHNvIGl0IHdvbid0IGludGVyZmVyZSB3aXRoICdpbXBvcnRPbkxvYWQnXG4gICAgaWYgKCFjb3B5SlNPTihFeHBvcnQuZ2VuZXJhbCwgU2V0dGluZ3MuZ2VuZXJhbCwgWydwYWdlSW5SYW0nXSwgJ29ubHknKSAmJiBTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICB9XG5cbiAgICBpZihFeHBvcnQuZGV2ZWxvcG1lbnQgJiYgRXhwb3J0LnJvdXRpbmcuc2l0ZW1hcCl7IC8vIG9uIHByb2R1Y3Rpb24gdGhpcyB3aWxsIGJlIGNoZWNrZWQgYWZ0ZXIgY3JlYXRpbmcgc3RhdGVcbiAgICAgICAgZGVidWdTaXRlTWFwKEV4cG9ydCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGaXJzdExvYWQoKSB7XG4gICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgYnVpbGRCb2R5UGFyc2VyKCk7XG59IiwgImltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHAyIGZyb20gJ2h0dHAyJztcbmltcG9ydCAqIGFzIGNyZWF0ZUNlcnQgZnJvbSAnc2VsZnNpZ25lZCc7XG5pbXBvcnQgKiBhcyBHcmVlbmxvY2sgZnJvbSAnZ3JlZW5sb2NrLWV4cHJlc3MnO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3N9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEZWxldGVJbkRpcmVjdG9yeSwgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEdyZWVuTG9ja1NpdGUgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuXG4vKipcbiAqIElmIHRoZSBmb2xkZXIgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNcbiAqIGV4aXN0LCB1cGRhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZm9sZGVyIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSBDcmVhdGVJbk5vdEV4aXRzIC0ge1xuICovXG5hc3luYyBmdW5jdGlvbiBUb3VjaFN5c3RlbUZvbGRlcihmb05hbWU6IHN0cmluZywgQ3JlYXRlSW5Ob3RFeGl0czoge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgZXhpdHM/OiBhbnl9KSB7XG4gICAgbGV0IHNhdmVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArIFwiL1N5c3RlbVNhdmUvXCI7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBzYXZlUGF0aCArPSBmb05hbWU7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBpZiAoQ3JlYXRlSW5Ob3RFeGl0cykge1xuICAgICAgICBzYXZlUGF0aCArPSAnLyc7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gc2F2ZVBhdGggKyBDcmVhdGVJbk5vdEV4aXRzLm5hbWU7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIENyZWF0ZUluTm90RXhpdHMudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKENyZWF0ZUluTm90RXhpdHMuZXhpdHMpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIGF3YWl0IENyZWF0ZUluTm90RXhpdHMuZXhpdHMoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpLCBmaWxlUGF0aCwgc2F2ZVBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBJdCBnZW5lcmF0ZXMgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBhbmQgc3RvcmVzIGl0IGluIGEgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSBjZXJ0aWZpY2F0ZSBhbmQga2V5IGFyZSBiZWluZyByZXR1cm5lZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RGVtb0NlcnRpZmljYXRlKCkge1xuICAgIGxldCBDZXJ0aWZpY2F0ZTogYW55O1xuICAgIGNvbnN0IENlcnRpZmljYXRlUGF0aCA9IFN5c3RlbURhdGEgKyAnL0NlcnRpZmljYXRlLmpzb24nO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKENlcnRpZmljYXRlUGF0aCkpIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBFYXN5RnMucmVhZEpzb25GaWxlKENlcnRpZmljYXRlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgY3JlYXRlQ2VydC5nZW5lcmF0ZShudWxsLCB7IGRheXM6IDM2NTAwIH0sIChlcnIsIGtleXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlzLnByaXZhdGUsXG4gICAgICAgICAgICAgICAgICAgIGNlcnQ6IGtleXMuY2VydFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKENlcnRpZmljYXRlUGF0aCwgQ2VydGlmaWNhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gQ2VydGlmaWNhdGU7XG59XG5cbmZ1bmN0aW9uIERlZmF1bHRMaXN0ZW4oYXBwKSB7XG4gICAgY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwLmF0dGFjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VydmVyLFxuICAgICAgICBsaXN0ZW4ocG9ydDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIDxhbnk+cmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZSgpIHtcbiAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgZ3JlZW5sb2NrLCBpdCB3aWxsIGNyZWF0ZSBhIHNlcnZlciB0aGF0IHdpbGwgc2VydmUgeW91ciBhcHAgb3ZlciBodHRwc1xuICogQHBhcmFtIGFwcCAtIFRoZSB0aW55SHR0cCBhcHBsaWNhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0aGUgc2VydmVyIG1ldGhvZHNcbiAqL1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gVXBkYXRlR3JlZW5Mb2NrKGFwcCkge1xuXG4gICAgaWYgKCEoU2V0dGluZ3Muc2VydmUuaHR0cDIgfHwgU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrPy5hZ3JlZVRvVGVybXMpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBEZWZhdWx0TGlzdGVuKGFwcCk7XG4gICAgfVxuXG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdyZWVUb1Rlcm1zKSB7XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGh0dHAyLmNyZWF0ZVNlY3VyZVNlcnZlcih7IC4uLmF3YWl0IEdldERlbW9DZXJ0aWZpY2F0ZSgpLCBhbGxvd0hUVFAxOiB0cnVlIH0sIGFwcC5hdHRhY2gpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4ocG9ydCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IFRvdWNoU3lzdGVtRm9sZGVyKFwiZ3JlZW5sb2NrXCIsIHtcbiAgICAgICAgbmFtZTogXCJjb25maWcuanNvblwiLCB2YWx1ZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc2l0ZXM6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlc1xuICAgICAgICB9KSxcbiAgICAgICAgYXN5bmMgZXhpdHMoZmlsZSwgXywgZm9sZGVyKSB7XG4gICAgICAgICAgICBmaWxlID0gSlNPTi5wYXJzZShmaWxlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBmaWxlLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IGZpbGUuc2l0ZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGhhdmU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIDxHcmVlbkxvY2tTaXRlW10+IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5zdWJqZWN0ID09IGUuc3ViamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGF2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5hbHRuYW1lcy5sZW5ndGggIT0gZS5hbHRuYW1lcy5sZW5ndGggfHwgYi5hbHRuYW1lcy5zb21lKHYgPT4gZS5hbHRuYW1lcy5pbmNsdWRlcyh2KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmFsdG5hbWVzID0gYi5hbHRuYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZS5yZW5ld0F0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFoYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGUuc2l0ZXMuc3BsaWNlKGksIGkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gZm9sZGVyICsgXCJsaXZlL1wiICsgZS5zdWJqZWN0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbmV3U2l0ZXMgPSBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMuZmlsdGVyKCh4KSA9PiAhZmlsZS5zaXRlcy5maW5kKGIgPT4gYi5zdWJqZWN0ID09IHguc3ViamVjdCkpO1xuXG4gICAgICAgICAgICBmaWxlLnNpdGVzLnB1c2goLi4ubmV3U2l0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh3b3JraW5nRGlyZWN0b3J5ICsgXCJwYWNrYWdlLmpzb25cIik7XG5cbiAgICBjb25zdCBncmVlbmxvY2tPYmplY3Q6YW55ID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IEdyZWVubG9jay5pbml0KHtcbiAgICAgICAgcGFja2FnZVJvb3Q6IHdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGNvbmZpZ0RpcjogXCJTeXN0ZW1TYXZlL2dyZWVubG9ja1wiLFxuICAgICAgICBwYWNrYWdlQWdlbnQ6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ2VudCB8fCBwYWNrYWdlSW5mby5uYW1lICsgJy8nICsgcGFja2FnZUluZm8udmVyc2lvbixcbiAgICAgICAgbWFpbnRhaW5lckVtYWlsOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suZW1haWwsXG4gICAgICAgIGNsdXN0ZXI6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5jbHVzdGVyLFxuICAgICAgICBzdGFnaW5nOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc3RhZ2luZ1xuICAgIH0pLnJlYWR5KHJlcykpO1xuXG4gICAgZnVuY3Rpb24gQ3JlYXRlU2VydmVyKHR5cGUsIGZ1bmMsIG9wdGlvbnM/KSB7XG4gICAgICAgIGxldCBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGdyZWVubG9ja09iamVjdFt0eXBlXShvcHRpb25zLCBmdW5jKTtcbiAgICAgICAgY29uc3QgbGlzdGVuID0gKHBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3QuaHR0cFNlcnZlcigpO1xuICAgICAgICAgICAgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4gaHR0cFNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtuZXcgUHJvbWlzZShyZXMgPT4gc2VydmVyLmxpc3Rlbig0NDMsIFwiMC4wLjAuMFwiLCByZXMpKSwgbmV3IFByb21pc2UocmVzID0+IGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsIFwiMC4wLjAuMFwiLCByZXMpKV0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgc2VydmVyLmNsb3NlKCk7IENsb3NlaHR0cFNlcnZlcigpOyB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuLFxuICAgICAgICAgICAgY2xvc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwMlNlcnZlcicsIGFwcC5hdHRhY2gsIHsgYWxsb3dIVFRQMTogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwc1NlcnZlcicsIGFwcC5hdHRhY2gpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgc2VydmVyLCB7U2V0dGluZ3N9ICBmcm9tICcuL01haW5CdWlsZC9TZXJ2ZXInO1xuaW1wb3J0IGFzeW5jUmVxdWlyZSBmcm9tICcuL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQge2dldFR5cGVzfSBmcm9tICcuL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSAnLi9HbG9iYWwvU2VhcmNoUmVjb3JkJztcbmV4cG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9NYWluQnVpbGQvVHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQXN5bmNJbXBvcnQgPSAocGF0aDpzdHJpbmcsIGltcG9ydEZyb20gPSAnYXN5bmMgaW1wb3J0JykgPT4gYXN5bmNSZXF1aXJlKFtpbXBvcnRGcm9tXSwgcGF0aCwgZ2V0VHlwZXMuU3RhdGljLCB7aXNEZWJ1ZzogU2V0dGluZ3MuZGV2ZWxvcG1lbnR9KTtcbmV4cG9ydCB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBOzs7QUNGQTs7O0FDQUEsSUFBSSxZQUFZO0FBRVQsb0JBQW9CLEdBQVk7QUFDbkMsY0FBWTtBQUNoQjtBQUVPLElBQU0sUUFBUSxJQUFJLE1BQU0sU0FBUTtBQUFBLEVBQ25DLElBQUksUUFBUSxNQUFNLFVBQVU7QUFDeEIsUUFBRyxRQUFRO0FBQ1AsYUFBTyxPQUFPO0FBRWxCLFFBQUcsYUFBYSxRQUFRO0FBQ3BCLGFBQU8sT0FBTztBQUNsQixXQUFPLE1BQU07QUFBQSxJQUFDO0FBQUEsRUFDbEI7QUFDSixDQUFDOzs7QURiRDtBQUVBLGdCQUFnQixRQUErQjtBQUMzQyxTQUFPLElBQUksUUFBUSxTQUFPO0FBQ3RCLE9BQUcsS0FBSyxRQUFNLENBQUMsS0FBSyxVQUFTO0FBQ3pCLFVBQUksUUFBUSxLQUFJLENBQUM7QUFBQSxJQUNyQixDQUFDO0FBQUEsRUFDTCxDQUFDO0FBQ0w7QUFRQSxjQUFjLFFBQWMsT0FBZ0IsYUFBdUIsZUFBbUIsQ0FBQyxHQUF3QjtBQUMzRyxTQUFPLElBQUksUUFBUSxTQUFPO0FBQ3RCLE9BQUcsS0FBSyxRQUFNLENBQUMsS0FBSyxVQUFTO0FBQ3pCLFVBQUcsT0FBTyxDQUFDLGFBQVk7QUFDbkIsY0FBTSxNQUFNLEdBQUc7QUFBQSxNQUNuQjtBQUNBLFVBQUksU0FBUyxRQUFNLE1BQUssU0FBUSxTQUFRLFlBQVk7QUFBQSxJQUN4RCxDQUFDO0FBQUEsRUFDTCxDQUFDO0FBQ0w7QUFRQSwwQkFBMEIsUUFBYyxlQUFvQixNQUF1QjtBQUMvRSxTQUFRLE9BQU0sS0FBSyxRQUFNLFFBQVcsSUFBSSxHQUFHLFNBQVMsS0FBSztBQUM3RDtBQU9BLGVBQWUsUUFBK0I7QUFDMUMsU0FBTyxJQUFJLFFBQVEsU0FBTztBQUN0QixPQUFHLE1BQU0sUUFBTSxDQUFDLFFBQVE7QUFDcEIsVUFBRyxLQUFJO0FBQ0gsY0FBTSxNQUFNLEdBQUc7QUFBQSxNQUNuQjtBQUNBLFVBQUksQ0FBQyxHQUFHO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDTCxDQUFDO0FBQ0w7QUFPQSxlQUFlLFFBQStCO0FBQzFDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxNQUFNLFFBQU0sQ0FBQyxRQUFRO0FBQ3BCLFVBQUcsS0FBSTtBQUNILGNBQU0sTUFBTSxHQUFHO0FBQUEsTUFDbkI7QUFDQSxVQUFJLENBQUMsR0FBRztBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMO0FBT0EsZ0JBQWdCLFFBQStCO0FBQzNDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxPQUFPLFFBQU0sQ0FBQyxRQUFRO0FBQ3JCLFVBQUcsS0FBSTtBQUNILGNBQU0sTUFBTSxHQUFHO0FBQUEsTUFDbkI7QUFDQSxVQUFJLENBQUMsR0FBRztBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMO0FBT0EsOEJBQThCLFFBQStCO0FBQ3pELE1BQUcsTUFBTSxPQUFPLE1BQUksR0FBRTtBQUNsQixXQUFPLE1BQU0sT0FBTyxNQUFJO0FBQUEsRUFDNUI7QUFDQSxTQUFPO0FBQ1g7QUFTQSxpQkFBaUIsUUFBYyxVQUFVLENBQUMsR0FBMkM7QUFDakYsU0FBTyxJQUFJLFFBQVEsU0FBTztBQUN0QixPQUFHLFFBQVEsUUFBTSxTQUFTLENBQUMsS0FBSyxVQUFVO0FBQ3RDLFVBQUcsS0FBSTtBQUNILGNBQU0sTUFBTSxHQUFHO0FBQUEsTUFDbkI7QUFDQSxVQUFJLFNBQVMsQ0FBQyxDQUFDO0FBQUEsSUFDbkIsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMO0FBT0EsZ0NBQWdDLFFBQStCO0FBQzNELE1BQUcsQ0FBQyxNQUFNLE9BQU8sTUFBSTtBQUNqQixXQUFPLE1BQU0sTUFBTSxNQUFJO0FBQzNCLFNBQU87QUFDWDtBQVFBLG1CQUFtQixRQUFjLFNBQTREO0FBQ3pGLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxVQUFVLFFBQU0sU0FBUyxDQUFDLFFBQVE7QUFDakMsVUFBRyxLQUFJO0FBQ0gsY0FBTSxNQUFNLEdBQUc7QUFBQSxNQUNuQjtBQUNBLFVBQUksQ0FBQyxHQUFHO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDTCxDQUFDO0FBQ0w7QUFTQSw2QkFBNkIsUUFBYyxTQUFnQztBQUN2RSxNQUFJO0FBQ0EsV0FBTyxNQUFNLFVBQVUsUUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDO0FBQUEsRUFDeEQsU0FBUSxLQUFOO0FBQ0UsVUFBTSxNQUFNLEdBQUc7QUFBQSxFQUNuQjtBQUVBLFNBQU87QUFDWDtBQVNBLGtCQUFrQixRQUFhLFdBQVcsUUFBNEI7QUFDbEUsU0FBTyxJQUFJLFFBQVEsU0FBTztBQUN0QixPQUFHLFNBQVMsUUFBVyxVQUFVLENBQUMsS0FBSyxTQUFTO0FBQzVDLFVBQUcsS0FBSTtBQUNILGNBQU0sTUFBTSxHQUFHO0FBQUEsTUFDbkI7QUFDQSxVQUFJLFFBQVEsRUFBRTtBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQVFBLDRCQUE0QixRQUFhLFVBQStCO0FBQ3BFLE1BQUk7QUFDQSxXQUFPLEtBQUssTUFBTSxNQUFNLFNBQVMsUUFBTSxRQUFRLENBQUM7QUFBQSxFQUNwRCxTQUFRLEtBQU47QUFDRSxVQUFNLE1BQU0sR0FBRztBQUFBLEVBQ25CO0FBRUEsU0FBTyxDQUFDO0FBQ1o7QUFPQSw0QkFBNEIsR0FBVSxPQUFPLElBQUk7QUFDN0MsTUFBSSxLQUFLLFFBQVEsQ0FBQztBQUVsQixNQUFJLENBQUMsTUFBTSxPQUFPLE9BQU8sQ0FBQyxHQUFHO0FBQ3pCLFVBQU0sTUFBTSxFQUFFLE1BQU0sT0FBTztBQUUzQixRQUFJLFVBQVU7QUFDZCxlQUFXLEtBQUssS0FBSztBQUNqQixVQUFJLFFBQVEsUUFBUTtBQUNoQixtQkFBVztBQUFBLE1BQ2Y7QUFDQSxpQkFBVztBQUVYLFlBQU0saUJBQWlCLE9BQU8sT0FBTztBQUFBLElBQ3pDO0FBQUEsRUFDSjtBQUNKO0FBT0EsSUFBTyxpQkFBUSxpQ0FDUixHQUFHLFdBREs7QUFBQSxFQUVYO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNKOzs7QUU5T0E7QUFDQTtBQUNBOzs7QUNLTyxvQkFBK0MsTUFBYyxRQUFnQjtBQUNoRixRQUFNLFFBQVEsT0FBTyxRQUFRLElBQUk7QUFFakMsTUFBSSxTQUFTO0FBQ1QsV0FBTyxDQUFDLE1BQU07QUFFbEIsU0FBTyxDQUFDLE9BQU8sVUFBVSxHQUFHLEtBQUssR0FBRyxPQUFPLFVBQVUsUUFBUSxLQUFLLE1BQU0sQ0FBQztBQUM3RTtBQUVPLG9CQUFvQixNQUFjLFFBQWdCO0FBQ3JELFNBQU8sT0FBTyxVQUFVLEdBQUcsT0FBTyxZQUFZLElBQUksQ0FBQztBQUN2RDtBQU1PLGtCQUFrQixNQUFjLFFBQWdCO0FBQ25ELFNBQU8sT0FBTyxXQUFXLElBQUk7QUFDekIsYUFBUyxPQUFPLFVBQVUsS0FBSyxNQUFNO0FBRXpDLFNBQU8sT0FBTyxTQUFTLElBQUk7QUFDdkIsYUFBUyxPQUFPLFVBQVUsR0FBRyxPQUFPLFNBQVMsS0FBSyxNQUFNO0FBRTVELFNBQU87QUFDWDs7O0FEM0JBLG9CQUFvQixLQUFZO0FBQzVCLFNBQU8sTUFBSyxRQUFRLGNBQWMsR0FBRyxDQUFDO0FBQzFDO0FBRUEsSUFBTSxhQUFhLE1BQUssS0FBSyxXQUFXLFlBQVksR0FBRyxHQUFHLGFBQWE7QUFFdkUsSUFBSSxpQkFBaUI7QUFFckIsSUFBTSxhQUFhO0FBQW5CLElBQTBCLFdBQVc7QUFBckMsSUFBNkMsY0FBYztBQUUzRCxJQUFNLGdCQUFnQixhQUFhLElBQUk7QUFDdkMsSUFBTSxjQUFjLGFBQWEsSUFBSTtBQUNyQyxJQUFNLGdCQUFnQixhQUFhLElBQUk7QUFFdkMsSUFBTSxtQkFBbUIsSUFBSSxJQUFJO0FBRWpDLDhCQUE4QjtBQUMxQixTQUFPLE1BQUssS0FBSyxrQkFBaUIsZ0JBQWdCLEdBQUc7QUFDekQ7QUFDQSxJQUFJLG1CQUFtQixtQkFBbUI7QUFFMUMsbUJBQW1CLE1BQU07QUFDckIsU0FBUSxtQkFBbUIsSUFBSSxPQUFPO0FBQzFDO0FBR0EsSUFBTSxXQUFXO0FBQUEsRUFDYixRQUFRO0FBQUEsSUFDSixVQUFVLFVBQVU7QUFBQSxJQUNwQjtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDRixVQUFVLFFBQVE7QUFBQSxJQUNsQjtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDVixVQUFVLGNBQWM7QUFBQSxJQUN4QjtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQUEsT0FDSyxjQUFhO0FBQ2QsV0FBTyxTQUFTO0FBQUEsRUFDcEI7QUFDSjtBQUVBLElBQU0sWUFBWTtBQUFBLEVBQ2QsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLEVBQ1AsV0FBVztBQUNmO0FBR0EsSUFBTSxnQkFBZ0I7QUFBQSxFQUNsQjtBQUFBLEVBRUEsZ0JBQWdCLENBQUM7QUFBQSxFQUVqQixjQUFjO0FBQUEsSUFDVixNQUFNLENBQUMsVUFBVSxPQUFLLE9BQU8sVUFBVSxPQUFLLEtBQUs7QUFBQSxJQUNqRCxPQUFPLENBQUMsVUFBVSxRQUFNLE9BQU8sVUFBVSxRQUFNLEtBQUs7QUFBQSxJQUNwRCxXQUFXLENBQUMsVUFBVSxZQUFVLE9BQU8sVUFBVSxZQUFVLEtBQUs7QUFBQSxFQUNwRTtBQUFBLEVBRUEsbUJBQW1CLENBQUM7QUFBQSxFQUVwQixnQkFBZ0IsQ0FBQyxRQUFRLEtBQUs7QUFBQSxFQUU5QixjQUFjO0FBQUEsSUFDVixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsRUFDZDtBQUFBLEVBQ0EsbUJBQW1CLENBQUM7QUFBQSxNQUVoQixnQkFBZ0I7QUFDaEIsV0FBTztBQUFBLEVBQ1g7QUFBQSxNQUNJLGtCQUFrQjtBQUNsQixXQUFPO0FBQUEsRUFDWDtBQUFBLE1BQ0ksY0FBYyxPQUFPO0FBQ3JCLHFCQUFpQjtBQUVqQix1QkFBbUIsbUJBQW1CO0FBQ3RDLGFBQVMsT0FBTyxLQUFLLFVBQVUsVUFBVTtBQUN6QyxhQUFTLEtBQUssS0FBSyxVQUFVLFFBQVE7QUFBQSxFQUN6QztBQUFBLE1BQ0ksV0FBVTtBQUNWLFdBQU8sbUJBQW1CO0FBQUEsRUFDOUI7QUFBQSxRQUNNLGVBQWU7QUFDakIsUUFBRyxNQUFNLGVBQU8sV0FBVyxLQUFLLFFBQVEsR0FBRTtBQUN0QyxhQUFPLE1BQU0sZUFBTyxTQUFTLEtBQUssUUFBUTtBQUFBLElBQzlDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUyxVQUFpQjtBQUN0QixXQUFPLE1BQUssU0FBUyxrQkFBa0IsUUFBUTtBQUFBLEVBQ25EO0FBQ0o7QUFFQSxjQUFjLGlCQUFpQixPQUFPLE9BQU8sY0FBYyxTQUFTO0FBQ3BFLGNBQWMsb0JBQW9CLE9BQU8sT0FBTyxjQUFjLFlBQVksRUFBRSxLQUFLO0FBQ2pGLGNBQWMsb0JBQW9CLE9BQU8sT0FBTyxjQUFjLFlBQVk7QUFFMUUsaUNBQXdDLFFBQU07QUFDMUMsUUFBTSxjQUFjLE1BQU0sZUFBTyxRQUFRLFFBQU0sRUFBRSxlQUFlLEtBQUssQ0FBQztBQUN0RSxhQUFXLEtBQWdCLGFBQWM7QUFDckMsVUFBTSxJQUFJLEVBQUU7QUFDWixRQUFJLEVBQUUsWUFBWSxHQUFHO0FBQ2pCLFlBQU0sTUFBTSxTQUFPLElBQUk7QUFDdkIsWUFBTSxrQkFBa0IsR0FBRztBQUMzQixZQUFNLGVBQU8sTUFBTSxHQUFHO0FBQUEsSUFDMUIsT0FDSztBQUNELFlBQU0sZUFBTyxPQUFPLFNBQU8sQ0FBQztBQUFBLElBQ2hDO0FBQUEsRUFDSjtBQUNKO0FBRU8seUJBQXlCLFdBQWtCO0FBQzlDLFNBQU8sV0FBVyxLQUFLLFdBQVcsS0FBSyxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQzNEOzs7QUVuSUE7OztBQ0NBO0FBQ0E7QUFFQTs7O0FDSkE7QUFFTyxzQkFBc0IsS0FBeUIsT0FBaUI7QUFDbkUsTUFBSSxZQUFZLCtEQUErRCxPQUFPLEtBQUssSUFBSSxTQUFTLENBQUMsRUFBRSxTQUFTLFFBQVE7QUFFNUgsTUFBSTtBQUNBLGdCQUFZLE9BQU87QUFBQTtBQUVuQixnQkFBWSxTQUFTO0FBRXpCLFNBQU8sU0FBUztBQUNwQjtBQUVBLDhCQUFxQyxjQUE0QixhQUEyQjtBQUN4RixRQUFNLFdBQVcsTUFBTSxJQUFJLGtCQUFrQixXQUFXO0FBQ3hELFFBQU0sU0FBUyxJQUFJLG1CQUFtQjtBQUN0QyxFQUFDLE9BQU0sSUFBSSxrQkFBa0IsWUFBWSxHQUFHLFlBQVksT0FBSztBQUN6RCxVQUFNLFdBQVcsU0FBUyxvQkFBb0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxRQUFRLEVBQUUsZUFBYyxDQUFDO0FBQzlGLFFBQUcsQ0FBQyxTQUFTO0FBQVE7QUFDckIsV0FBTyxXQUFXO0FBQUEsTUFDZCxXQUFXO0FBQUEsUUFDUCxRQUFRLEVBQUU7QUFBQSxRQUNWLE1BQU0sRUFBRTtBQUFBLE1BQ1o7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNOLFFBQVEsU0FBUztBQUFBLFFBQ2pCLE1BQU0sU0FBUztBQUFBLE1BQ25CO0FBQUEsTUFDQSxRQUFRLFNBQVM7QUFBQSxJQUNyQixDQUFDO0FBQUEsRUFDTCxDQUFDO0FBRUQsU0FBTztBQUNYOzs7QUQxQk8sMkJBQThCO0FBQUEsRUFLakMsWUFBc0IsVUFBNEIsYUFBYSxNQUFnQixZQUFXLE9BQWlCLFFBQVEsT0FBTztBQUFwRztBQUE0QjtBQUE2QjtBQUE0QjtBQUZqRyxxQkFBWTtBQUdsQixTQUFLLE1BQU0sSUFBSSxvQkFBbUI7QUFBQSxNQUM5QixNQUFNLFNBQVMsTUFBTSxPQUFPLEVBQUUsSUFBSTtBQUFBLElBQ3RDLENBQUM7QUFFRCxRQUFJLENBQUM7QUFDRCxXQUFLLGNBQWMsTUFBSyxRQUFRLEtBQUssUUFBUTtBQUFBLEVBQ3JEO0FBQUEsRUFFVSxVQUFVLFFBQWdCO0FBQ2hDLGFBQVMsT0FBTyxNQUFNLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSztBQUUzQyxRQUFJLEtBQUssWUFBWTtBQUNqQixVQUFJLGNBQWMsZUFBZSxTQUFTLE1BQUssUUFBUSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkUsa0JBQVU7QUFBQTtBQUVWLGlCQUFTLFdBQVcsS0FBSyxNQUFNLEVBQUUsSUFBSSxJQUFJO0FBQzdDLGFBQU8sTUFBSyxVQUFXLE1BQUssV0FBVyxLQUFJLE9BQU8sT0FBTyxRQUFRLFFBQVEsR0FBRyxDQUFDO0FBQUEsSUFDakY7QUFFQSxXQUFPLE1BQUssU0FBUyxLQUFLLGFBQWEsY0FBYyxrQkFBa0IsTUFBTTtBQUFBLEVBQ2pGO0FBQUEsRUFFQSxrQkFBK0I7QUFDM0IsV0FBTyxLQUFLLElBQUksT0FBTztBQUFBLEVBQzNCO0FBQUEsRUFFQSxrQkFBa0I7QUFDZCxXQUFPLGFBQWEsS0FBSyxLQUFLLEtBQUssS0FBSztBQUFBLEVBQzVDO0FBQ0o7QUFFQSxtQ0FBNEMsZUFBZTtBQUFBLEVBSXZELFlBQVksVUFBNEIsUUFBUSxNQUFNLFFBQVEsT0FBTyxhQUFhLE1BQU07QUFDcEYsVUFBTSxVQUFVLFlBQVksT0FBTyxLQUFLO0FBREo7QUFIaEMsdUJBQWM7QUFDZCxzQkFBOEMsQ0FBQztBQUFBLEVBSXZEO0FBQUEsRUFFQSxXQUFXO0FBQ1AsV0FBTyxLQUFLLFdBQVcsU0FBUztBQUFBLEVBQ3BDO0FBQUEsRUFFQSxpQkFBaUIsT0FBc0IsRUFBRSxPQUFhLE1BQU0sT0FBTyxDQUFDLEdBQUc7QUFDbkUsU0FBSyxXQUFXLEtBQUssRUFBRSxNQUFNLG9CQUFvQixNQUFNLENBQUMsT0FBTyxFQUFDLEtBQUksQ0FBQyxFQUFFLENBQUM7QUFBQSxFQUM1RTtBQUFBLEVBRVEsa0JBQWtCLE9BQXNCLEVBQUUsT0FBYSxNQUFNLE9BQU8sQ0FBQyxHQUFHO0FBQzVFLFFBQUksQ0FBQyxLQUFLO0FBQ04sYUFBTyxLQUFLLFNBQVMsSUFBSTtBQUU3QixVQUFNLFlBQVksTUFBTSxhQUFhLEdBQUcsU0FBUyxVQUFVO0FBQzNELFFBQUksZUFBZTtBQUVuQixhQUFTLFFBQVEsR0FBRyxRQUFRLFFBQVEsU0FBUztBQUN6QyxZQUFNLEVBQUUsYUFBTSxNQUFNLFNBQVMsVUFBVTtBQUV2QyxVQUFJLFNBQVEsTUFBTTtBQUNkLGFBQUs7QUFDTCx1QkFBZTtBQUNmO0FBQUEsTUFDSjtBQUVBLFVBQUksQ0FBQyxnQkFBZ0IsUUFBUSxNQUFNO0FBQy9CLHVCQUFlO0FBQ2YsYUFBSyxJQUFJLFdBQVc7QUFBQSxVQUNoQixVQUFVLEVBQUUsTUFBTSxRQUFRLEVBQUU7QUFBQSxVQUM1QixXQUFXLEVBQUUsTUFBTSxLQUFLLFdBQVcsUUFBUSxFQUFFO0FBQUEsVUFDN0MsUUFBUSxLQUFLLFVBQVUsSUFBSTtBQUFBLFFBQy9CLENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSjtBQUVBLFNBQUssZUFBZTtBQUFBLEVBQ3hCO0FBQUEsRUFHQSxRQUFRLE1BQWM7QUFDbEIsU0FBSyxXQUFXLEtBQUssRUFBRSxNQUFNLFdBQVcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQUEsRUFDMUQ7QUFBQSxFQUVRLFNBQVMsTUFBYztBQUMzQixRQUFJLEtBQUs7QUFDTCxXQUFLLGFBQWEsS0FBSyxNQUFNLElBQUksRUFBRSxTQUFTO0FBQ2hELFNBQUssZUFBZTtBQUFBLEVBQ3hCO0FBQUEsU0FFTyxnQkFBZ0IsS0FBa0I7QUFDckMsYUFBUSxJQUFJLEdBQUcsSUFBSSxJQUFJLFFBQVEsUUFBUSxLQUFJO0FBQ3ZDLFVBQUksUUFBUSxLQUFLLGNBQWMsU0FBUyxlQUFjLElBQUksUUFBUSxFQUFFLENBQUM7QUFBQSxJQUN6RTtBQUNBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFQSw4QkFBOEIsU0FBdUIsT0FBc0IsTUFBYztBQUNyRixTQUFLLFdBQVcsS0FBSyxFQUFFLE1BQU0saUNBQWlDLE1BQU0sQ0FBQyxTQUFTLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFBQSxFQUNoRztBQUFBLFFBRWMsK0JBQStCLFNBQXVCLE9BQXNCLE1BQWM7QUFDcEcsUUFBSSxDQUFDLEtBQUs7QUFDTixhQUFPLEtBQUssU0FBUyxJQUFJO0FBRTdCLElBQUMsT0FBTSxJQUFJLG1CQUFrQixPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU07QUFDdEQsWUFBTSxXQUFXLE1BQU0sUUFBUSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUU7QUFFOUQsVUFBSSxFQUFFLFVBQVUsS0FBSztBQUNqQixhQUFLLElBQUksV0FBVztBQUFBLFVBQ2hCLFFBQVEsS0FBSyxVQUFVLEVBQUUsTUFBTTtBQUFBLFVBQy9CLFVBQVUsRUFBRSxNQUFNLFNBQVMsTUFBTSxRQUFRLEVBQUUsZUFBZTtBQUFBLFVBQzFELFdBQVcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEtBQUssV0FBVyxRQUFRLEVBQUUsZ0JBQWdCO0FBQUEsUUFDbkYsQ0FBQztBQUFBO0FBRUQsYUFBSyxJQUFJLFdBQVc7QUFBQSxVQUNoQixRQUFRLEtBQUssVUFBVSxFQUFFLE1BQU07QUFBQSxVQUMvQixVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsUUFBUSxFQUFFLGVBQWU7QUFBQSxVQUMzRCxXQUFXLEVBQUUsTUFBTSxFQUFFLGVBQWUsUUFBUSxFQUFFLGdCQUFnQjtBQUFBLFFBQ2xFLENBQUM7QUFBQSxJQUNULENBQUM7QUFFRCxTQUFLLFNBQVMsSUFBSTtBQUFBLEVBQ3RCO0FBQUEsUUFFYyxXQUFXO0FBQ3JCLGVBQVcsRUFBRSxNQUFNLFVBQVUsS0FBSyxZQUFZO0FBQzFDLGNBQVE7QUFBQSxhQUNDO0FBRUQsZUFBSyxrQkFBa0IsR0FBRyxJQUFJO0FBQzlCO0FBQUEsYUFDQztBQUVELGVBQUssU0FBUyxHQUFHLElBQUk7QUFDckI7QUFBQSxhQUNDO0FBRUQsZ0JBQU0sS0FBSywrQkFBK0IsR0FBRyxJQUFJO0FBQ2pEO0FBQUE7QUFBQSxJQUVaO0FBQUEsRUFDSjtBQUFBLEVBRUEsa0JBQWtCO0FBQ2QsU0FBSyxTQUFTO0FBRWQsV0FBTyxNQUFNLGdCQUFnQjtBQUFBLEVBQ2pDO0FBQUEsUUFFTSxvQkFBb0I7QUFDdEIsVUFBTSxLQUFLLFNBQVM7QUFDcEIsUUFBSSxDQUFDLEtBQUs7QUFDTixhQUFPLEtBQUs7QUFFaEIsV0FBTyxLQUFLLGNBQWMsTUFBTSxnQkFBZ0I7QUFBQSxFQUNwRDtBQUFBLEVBRUEsUUFBUTtBQUNKLFVBQU0sT0FBTyxJQUFJLGVBQWUsS0FBSyxVQUFVLEtBQUssT0FBTyxLQUFLLE9BQU8sS0FBSyxVQUFVO0FBQ3RGLFNBQUssV0FBVyxLQUFLLEdBQUcsS0FBSyxVQUFVO0FBQ3ZDLFdBQU87QUFBQSxFQUNYO0FBQ0o7OztBRTFLQSx3Q0FBa0MsZUFBZTtBQUFBLEVBQzdDLFlBQVksVUFBa0IsYUFBYSxPQUFPLFlBQVcsT0FBTztBQUNoRSxVQUFNLFVBQVUsWUFBWSxTQUFRO0FBQ3BDLFNBQUssWUFBWTtBQUFBLEVBQ3JCO0FBQUEsRUFFQSxvQkFBb0IsT0FBc0I7QUFDdEMsVUFBTSxZQUFZLE1BQU0sYUFBYSxHQUFHLFNBQVMsVUFBVTtBQUMzRCxRQUFJLGVBQWU7QUFFbkIsYUFBUyxRQUFRLEdBQUcsUUFBUSxRQUFRLFNBQVM7QUFDekMsWUFBTSxFQUFFLE1BQU0sTUFBTSxTQUFTLFVBQVU7QUFFdkMsVUFBSSxRQUFRLE1BQU07QUFDZCxhQUFLO0FBQ0wsdUJBQWU7QUFDZjtBQUFBLE1BQ0o7QUFFQSxVQUFJLENBQUMsZ0JBQWdCLFFBQVEsTUFBTTtBQUMvQix1QkFBZTtBQUNmLGFBQUssSUFBSSxXQUFXO0FBQUEsVUFDaEIsVUFBVSxFQUFFLE1BQU0sUUFBUSxFQUFFO0FBQUEsVUFDNUIsV0FBVyxFQUFFLE1BQU0sS0FBSyxXQUFXLFFBQVEsRUFBRTtBQUFBLFVBQzdDLFFBQVEsS0FBSyxVQUFVLElBQUk7QUFBQSxRQUMvQixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0o7QUFBQSxFQUVKO0FBQ0o7QUFFTyxtQkFBbUIsTUFBcUIsVUFBa0IsWUFBc0IsV0FBbUI7QUFDdEcsUUFBTSxXQUFXLElBQUksb0JBQW9CLFVBQVUsWUFBWSxTQUFRO0FBQ3ZFLFdBQVMsb0JBQW9CLElBQUk7QUFFakMsU0FBTyxTQUFTLGdCQUFnQjtBQUNwQztBQUVPLHVCQUF1QixNQUFxQixVQUFpQjtBQUNoRSxRQUFNLFdBQVcsSUFBSSxvQkFBb0IsUUFBUTtBQUNqRCxXQUFTLG9CQUFvQixJQUFJO0FBRWpDLFNBQU8sS0FBSyxLQUFLLFNBQVMsZ0JBQWdCO0FBQzlDOzs7QUMzQkEsMEJBQW1DO0FBQUEsRUFReEIsWUFBWSxNQUF1QyxNQUFlO0FBUGpFLHFCQUFxQyxDQUFDO0FBQ3ZDLG9CQUFtQjtBQUNuQixrQkFBUztBQUNULGtCQUFTO0FBS1osUUFBSSxPQUFPLFFBQVEsVUFBVTtBQUN6QixXQUFLLFdBQVc7QUFBQSxJQUNwQixXQUFXLE1BQU07QUFDYixXQUFLLFdBQVcsSUFBSTtBQUFBLElBQ3hCO0FBRUEsUUFBSSxNQUFNO0FBQ04sV0FBSyxZQUFZLE1BQU0sS0FBSyxnQkFBZ0IsSUFBSTtBQUFBLElBQ3BEO0FBQUEsRUFDSjtBQUFBLGFBR1csWUFBbUM7QUFDMUMsV0FBTztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1Y7QUFBQSxFQUNKO0FBQUEsRUFFTyxXQUFXLE9BQU8sS0FBSyxpQkFBaUI7QUFDM0MsU0FBSyxXQUFXLEtBQUs7QUFDckIsU0FBSyxTQUFTLEtBQUs7QUFDbkIsU0FBSyxTQUFTLEtBQUs7QUFBQSxFQUN2QjtBQUFBLEVBRU8sZUFBZTtBQUNsQixXQUFPLEtBQUs7QUFBQSxFQUNoQjtBQUFBLE1BS1csa0JBQXlDO0FBQ2hELFFBQUksQ0FBQyxLQUFLLFVBQVUsS0FBSyxPQUFLLEVBQUUsSUFBSSxLQUFLLEtBQUssWUFBWSxNQUFNO0FBQzVELGFBQU87QUFBQSxRQUNILE1BQU0sS0FBSztBQUFBLFFBQ1gsTUFBTSxLQUFLO0FBQUEsUUFDWCxNQUFNLEtBQUs7QUFBQSxNQUNmO0FBQUEsSUFDSjtBQUVBLFdBQU8sS0FBSyxVQUFVLEtBQUssVUFBVSxTQUFTLE1BQU0sY0FBYztBQUFBLEVBQ3RFO0FBQUEsTUFLSSxZQUFZO0FBQ1osV0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLO0FBQUEsRUFDckM7QUFBQSxNQUtZLFlBQVk7QUFDcEIsUUFBSSxZQUFZO0FBQ2hCLGVBQVcsS0FBSyxLQUFLLFdBQVc7QUFDNUIsbUJBQWEsRUFBRTtBQUFBLElBQ25CO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxNQU1JLEtBQUs7QUFDTCxXQUFPLEtBQUs7QUFBQSxFQUNoQjtBQUFBLE1BS0ksV0FBVztBQUNYLFVBQU0sSUFBSSxLQUFLO0FBQ2YsVUFBTSxJQUFJLEVBQUUsS0FBSyxNQUFNLFFBQVE7QUFDL0IsTUFBRSxLQUFLLGNBQWMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDO0FBRTlDLFdBQU8sR0FBRyxFQUFFLEtBQUssUUFBUSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQUEsRUFDOUM7QUFBQSxNQU1JLFNBQWlCO0FBQ2pCLFdBQU8sS0FBSyxVQUFVO0FBQUEsRUFDMUI7QUFBQSxFQU1PLFFBQXVCO0FBQzFCLFVBQU0sVUFBVSxJQUFJLGNBQWMsS0FBSyxTQUFTO0FBQ2hELGVBQVcsS0FBSyxLQUFLLFdBQVc7QUFDNUIsY0FBUSxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSTtBQUFBLElBQ3ZEO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVRLFNBQVMsTUFBcUI7QUFDbEMsU0FBSyxZQUFZLEtBQUssVUFBVSxPQUFPLEtBQUssU0FBUztBQUVyRCxTQUFLLFdBQVc7QUFBQSxNQUNaLE1BQU0sS0FBSztBQUFBLE1BQ1gsTUFBTSxLQUFLO0FBQUEsTUFDWCxNQUFNLEtBQUs7QUFBQSxJQUNmLENBQUM7QUFBQSxFQUNMO0FBQUEsU0FPYyxVQUFVLE1BQTRCO0FBQ2hELFVBQU0sWUFBWSxJQUFJLGNBQWM7QUFFcEMsZUFBVyxLQUFLLE1BQU07QUFDbEIsVUFBSSxhQUFhLGVBQWU7QUFDNUIsa0JBQVUsU0FBUyxDQUFDO0FBQUEsTUFDeEIsT0FBTztBQUNILGtCQUFVLGFBQWEsT0FBTyxDQUFDLENBQUM7QUFBQSxNQUNwQztBQUFBLElBQ0o7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBT08sYUFBYSxNQUE0QjtBQUM1QyxXQUFPLGNBQWMsT0FBTyxLQUFLLE1BQU0sR0FBRyxHQUFHLElBQUk7QUFBQSxFQUNyRDtBQUFBLEVBT08sUUFBUSxNQUE0QjtBQUN2QyxRQUFJLFdBQVcsS0FBSztBQUNwQixlQUFXLEtBQUssTUFBTTtBQUNsQixVQUFJLGFBQWEsZUFBZTtBQUM1QixtQkFBVyxFQUFFO0FBQ2IsYUFBSyxTQUFTLENBQUM7QUFBQSxNQUNuQixPQUFPO0FBQ0gsYUFBSyxhQUFhLE9BQU8sQ0FBQyxHQUFHLFNBQVMsTUFBTSxTQUFTLE1BQU0sU0FBUyxJQUFJO0FBQUEsTUFDNUU7QUFBQSxJQUNKO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQVFPLE1BQU0sVUFBZ0MsUUFBZ0Q7QUFDekYsUUFBSSxZQUFtQyxLQUFLO0FBQzVDLGVBQVcsS0FBSyxRQUFRO0FBQ3BCLFlBQU0sT0FBTyxNQUFNO0FBQ25CLFlBQU0sUUFBUSxPQUFPO0FBRXJCLFdBQUssYUFBYSxNQUFNLFdBQVcsTUFBTSxXQUFXLE1BQU0sV0FBVyxJQUFJO0FBRXpFLFVBQUksaUJBQWlCLGVBQWU7QUFDaEMsYUFBSyxTQUFTLEtBQUs7QUFDbkIsb0JBQVksTUFBTTtBQUFBLE1BQ3RCLFdBQVcsU0FBUyxNQUFNO0FBQ3RCLGFBQUssYUFBYSxPQUFPLEtBQUssR0FBRyxXQUFXLE1BQU0sV0FBVyxNQUFNLFdBQVcsSUFBSTtBQUFBLE1BQ3RGO0FBQUEsSUFDSjtBQUVBLFNBQUssYUFBYSxNQUFNLE1BQU0sU0FBUyxJQUFJLFdBQVcsTUFBTSxXQUFXLE1BQU0sV0FBVyxJQUFJO0FBRTVGLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFRUSxjQUFjLE1BQWMsUUFBNEIsT0FBTyxLQUFLLGdCQUFnQixNQUFNLFlBQVksR0FBRyxZQUFZLEdBQVM7QUFDbEksVUFBTSxZQUFxQyxDQUFDO0FBRTVDLGVBQVcsUUFBUSxDQUFDLEdBQUcsSUFBSSxHQUFHO0FBQzFCLGdCQUFVLEtBQUs7QUFBQSxRQUNYLE1BQU07QUFBQSxRQUNOO0FBQUEsUUFDQSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDVixDQUFDO0FBQ0Q7QUFFQSxVQUFJLFFBQVEsTUFBTTtBQUNkO0FBQ0Esb0JBQVk7QUFBQSxNQUNoQjtBQUFBLElBQ0o7QUFFQSxTQUFLLFVBQVUsUUFBUSxHQUFHLFNBQVM7QUFBQSxFQUN2QztBQUFBLEVBT08sYUFBYSxNQUFjLE1BQWUsTUFBZSxNQUFlO0FBQzNFLFNBQUssY0FBYyxNQUFNLFFBQVEsTUFBTSxNQUFNLElBQUk7QUFDakQsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQU1PLG9CQUFvQixNQUFjLE9BQU8sSUFBSTtBQUNoRCxlQUFXLFFBQVEsTUFBTTtBQUNyQixXQUFLLFVBQVUsS0FBSztBQUFBLFFBQ2hCLE1BQU07QUFBQSxRQUNOO0FBQUEsUUFDQSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDVixDQUFDO0FBQUEsSUFDTDtBQUNBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFPTyxjQUFjLE1BQWMsTUFBZSxNQUFlLE1BQWU7QUFDNUUsU0FBSyxjQUFjLE1BQU0sV0FBVyxNQUFNLE1BQU0sSUFBSTtBQUNwRCxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBTU8scUJBQXFCLE1BQWMsT0FBTyxJQUFJO0FBQ2pELFVBQU0sT0FBTyxDQUFDO0FBQ2QsZUFBVyxRQUFRLE1BQU07QUFDckIsV0FBSyxLQUFLO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0EsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1YsQ0FBQztBQUFBLElBQ0w7QUFFQSxTQUFLLFVBQVUsUUFBUSxHQUFHLElBQUk7QUFDOUIsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQU9RLFlBQVksTUFBYyxPQUFPLEtBQUssZ0JBQWdCLE1BQU07QUFDaEUsUUFBSSxZQUFZLEdBQUcsWUFBWTtBQUUvQixlQUFXLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRztBQUMxQixXQUFLLFVBQVUsS0FBSztBQUFBLFFBQ2hCLE1BQU07QUFBQSxRQUNOO0FBQUEsUUFDQSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDVixDQUFDO0FBQ0Q7QUFFQSxVQUFJLFFBQVEsTUFBTTtBQUNkO0FBQ0Esb0JBQVk7QUFBQSxNQUNoQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFRUSxVQUFVLFFBQVEsR0FBRyxNQUFNLEtBQUssUUFBdUI7QUFDM0QsVUFBTSxZQUFZLElBQUksY0FBYyxLQUFLLFNBQVM7QUFFbEQsY0FBVSxZQUFZLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxNQUFNLE9BQU8sR0FBRyxDQUFDO0FBRWpGLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFLTyxVQUFVLE9BQWUsS0FBYztBQUMxQyxRQUFJLE1BQU0sR0FBRyxHQUFHO0FBQ1osWUFBTTtBQUFBLElBQ1YsT0FBTztBQUNILFlBQU0sS0FBSyxJQUFJLEdBQUc7QUFBQSxJQUN0QjtBQUVBLFFBQUksTUFBTSxLQUFLLEdBQUc7QUFDZCxjQUFRO0FBQUEsSUFDWixPQUFPO0FBQ0gsY0FBUSxLQUFLLElBQUksS0FBSztBQUFBLElBQzFCO0FBRUEsV0FBTyxLQUFLLFVBQVUsT0FBTyxHQUFHO0FBQUEsRUFDcEM7QUFBQSxFQVFPLE9BQU8sT0FBZSxRQUFnQztBQUN6RCxRQUFJLFFBQVEsR0FBRztBQUNYLGNBQVEsS0FBSyxTQUFTO0FBQUEsSUFDMUI7QUFDQSxXQUFPLEtBQUssVUFBVSxPQUFPLFVBQVUsT0FBTyxTQUFTLFFBQVEsTUFBTTtBQUFBLEVBQ3pFO0FBQUEsRUFRTyxNQUFNLE9BQWUsS0FBYztBQUN0QyxRQUFJLFFBQVEsR0FBRztBQUNYLGNBQVEsS0FBSyxTQUFTO0FBQUEsSUFDMUI7QUFFQSxRQUFJLE1BQU0sR0FBRztBQUNULGNBQVEsS0FBSyxTQUFTO0FBQUEsSUFDMUI7QUFFQSxXQUFPLEtBQUssVUFBVSxPQUFPLEdBQUc7QUFBQSxFQUNwQztBQUFBLEVBRU8sT0FBTyxLQUFhO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLO0FBQ04sWUFBTTtBQUFBLElBQ1Y7QUFDQSxXQUFPLEtBQUssVUFBVSxLQUFLLE1BQU0sQ0FBQztBQUFBLEVBQ3RDO0FBQUEsRUFFTyxHQUFHLEtBQWE7QUFDbkIsV0FBTyxLQUFLLE9BQU8sR0FBRztBQUFBLEVBQzFCO0FBQUEsRUFFTyxXQUFXLEtBQWE7QUFDM0IsV0FBTyxLQUFLLE9BQU8sR0FBRyxFQUFFLFVBQVUsV0FBVyxDQUFDO0FBQUEsRUFDbEQ7QUFBQSxFQUVPLFlBQVksS0FBYTtBQUM1QixXQUFPLEtBQUssT0FBTyxHQUFHLEVBQUUsVUFBVSxZQUFZLENBQUM7QUFBQSxFQUNuRDtBQUFBLElBRUUsT0FBTyxZQUFZO0FBQ2pCLGVBQVcsS0FBSyxLQUFLLFdBQVc7QUFDNUIsWUFBTSxPQUFPLElBQUksY0FBYztBQUMvQixXQUFLLFVBQVUsS0FBSyxDQUFDO0FBQ3JCLFlBQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUFBLEVBRU8sUUFBUSxNQUFjLGVBQWUsTUFBTTtBQUM5QyxXQUFPLEtBQUssTUFBTSxJQUFJLEVBQUUsT0FBTyxDQUFDO0FBQUEsRUFDcEM7QUFBQSxFQU9RLFdBQVcsT0FBZTtBQUM5QixRQUFJLFNBQVMsR0FBRztBQUNaLGFBQU87QUFBQSxJQUNYO0FBRUEsUUFBSSxRQUFRO0FBQ1osZUFBVyxRQUFRLEtBQUssV0FBVztBQUMvQjtBQUNBLGVBQVMsS0FBSyxLQUFLO0FBQ25CLFVBQUksU0FBUztBQUNULGVBQU87QUFBQSxJQUNmO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVPLFFBQVEsTUFBYztBQUN6QixXQUFPLEtBQUssV0FBVyxLQUFLLFVBQVUsUUFBUSxJQUFJLENBQUM7QUFBQSxFQUN2RDtBQUFBLEVBRU8sWUFBWSxNQUFjO0FBQzdCLFdBQU8sS0FBSyxXQUFXLEtBQUssVUFBVSxZQUFZLElBQUksQ0FBQztBQUFBLEVBQzNEO0FBQUEsRUFLUSxVQUFVLE9BQWU7QUFDN0IsUUFBSSxJQUFJO0FBQ1IsZUFBVyxLQUFLLE9BQU87QUFDbkIsV0FBSyxRQUFTLFNBQVEsRUFBRSxXQUFXLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxNQUFNLEVBQUU7QUFBQSxJQUNoRTtBQUNBLFdBQU87QUFBQSxFQUNYO0FBQUEsTUFLVyxVQUFVO0FBQ2pCLFVBQU0sWUFBWSxJQUFJLGNBQWM7QUFFcEMsZUFBVyxLQUFLLEtBQUssV0FBVztBQUM1QixnQkFBVSxhQUFhLEtBQUssVUFBVSxFQUFFLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSTtBQUFBLElBQ3pFO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVPLE9BQU8sT0FBd0I7QUFDbEMsV0FBTyxLQUFLLFdBQVcsS0FBSyxVQUFVLE9BQU8sS0FBSyxDQUFDO0FBQUEsRUFDdkQ7QUFBQSxFQUVPLFdBQVcsUUFBZ0IsVUFBbUI7QUFDakQsV0FBTyxLQUFLLFVBQVUsV0FBVyxRQUFRLFFBQVE7QUFBQSxFQUNyRDtBQUFBLEVBRU8sU0FBUyxRQUFnQixVQUFtQjtBQUMvQyxXQUFPLEtBQUssVUFBVSxTQUFTLFFBQVEsUUFBUTtBQUFBLEVBQ25EO0FBQUEsRUFFTyxTQUFTLFFBQWdCLFVBQW1CO0FBQy9DLFdBQU8sS0FBSyxVQUFVLFNBQVMsUUFBUSxRQUFRO0FBQUEsRUFDbkQ7QUFBQSxFQUVPLFlBQVk7QUFDZixVQUFNLFlBQVksS0FBSyxNQUFNO0FBQzdCLGNBQVUsV0FBVztBQUVyQixhQUFTLElBQUksR0FBRyxJQUFJLFVBQVUsVUFBVSxRQUFRLEtBQUs7QUFDakQsWUFBTSxJQUFJLFVBQVUsVUFBVTtBQUU5QixVQUFJLEVBQUUsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUNyQixrQkFBVSxVQUFVLE1BQU07QUFDMUI7QUFBQSxNQUNKLE9BQU87QUFDSCxVQUFFLE9BQU8sRUFBRSxLQUFLLFVBQVU7QUFDMUI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFTyxXQUFXO0FBQ2QsV0FBTyxLQUFLLFVBQVU7QUFBQSxFQUMxQjtBQUFBLEVBRU8sVUFBVTtBQUNiLFVBQU0sWUFBWSxLQUFLLE1BQU07QUFDN0IsY0FBVSxXQUFXO0FBRXJCLGFBQVMsSUFBSSxVQUFVLFVBQVUsU0FBUyxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQ3RELFlBQU0sSUFBSSxVQUFVLFVBQVU7QUFFOUIsVUFBSSxFQUFFLEtBQUssS0FBSyxLQUFLLElBQUk7QUFDckIsa0JBQVUsVUFBVSxJQUFJO0FBQUEsTUFDNUIsT0FBTztBQUNILFVBQUUsT0FBTyxFQUFFLEtBQUssUUFBUTtBQUN4QjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVPLFlBQVk7QUFDZixXQUFPLEtBQUssUUFBUTtBQUFBLEVBQ3hCO0FBQUEsRUFFTyxPQUFPO0FBQ1YsV0FBTyxLQUFLLFVBQVUsRUFBRSxRQUFRO0FBQUEsRUFDcEM7QUFBQSxFQUVPLFNBQVMsV0FBb0I7QUFDaEMsVUFBTSxRQUFRLEtBQUssR0FBRyxDQUFDO0FBQ3ZCLFVBQU0sTUFBTSxLQUFLLEdBQUcsS0FBSyxTQUFTLENBQUM7QUFDbkMsVUFBTSxPQUFPLEtBQUssTUFBTSxFQUFFLEtBQUs7QUFFL0IsUUFBSSxNQUFNLElBQUk7QUFDVixXQUFLLGNBQWMsYUFBYSxNQUFNLElBQUksTUFBTSxnQkFBZ0IsTUFBTSxNQUFNLGdCQUFnQixNQUFNLE1BQU0sZ0JBQWdCLElBQUk7QUFBQSxJQUNoSTtBQUVBLFFBQUksSUFBSSxJQUFJO0FBQ1IsV0FBSyxhQUFhLGFBQWEsSUFBSSxJQUFJLElBQUksZ0JBQWdCLE1BQU0sSUFBSSxnQkFBZ0IsTUFBTSxJQUFJLGdCQUFnQixJQUFJO0FBQUEsSUFDdkg7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRVEsYUFBYSxLQUErQjtBQUNoRCxVQUFNLFlBQVksS0FBSyxNQUFNO0FBRTdCLGVBQVcsS0FBSyxVQUFVLFdBQVc7QUFDakMsUUFBRSxPQUFPLElBQUksRUFBRSxJQUFJO0FBQUEsSUFDdkI7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRU8sa0JBQWtCLFNBQTZCO0FBQ2xELFdBQU8sS0FBSyxhQUFhLE9BQUssRUFBRSxrQkFBa0IsT0FBTyxDQUFDO0FBQUEsRUFDOUQ7QUFBQSxFQUVPLGtCQUFrQixTQUE2QjtBQUNsRCxXQUFPLEtBQUssYUFBYSxPQUFLLEVBQUUsa0JBQWtCLE9BQU8sQ0FBQztBQUFBLEVBQzlEO0FBQUEsRUFFTyxjQUFjO0FBQ2pCLFdBQU8sS0FBSyxhQUFhLE9BQUssRUFBRSxZQUFZLENBQUM7QUFBQSxFQUNqRDtBQUFBLEVBRU8sY0FBYztBQUNqQixXQUFPLEtBQUssYUFBYSxPQUFLLEVBQUUsWUFBWSxDQUFDO0FBQUEsRUFDakQ7QUFBQSxFQUVPLFlBQVk7QUFDZixXQUFPLEtBQUssYUFBYSxPQUFLLEVBQUUsVUFBVSxDQUFDO0FBQUEsRUFDL0M7QUFBQSxFQUVRLGNBQWMsT0FBd0IsT0FBcUM7QUFDL0UsUUFBSSxpQkFBaUIsUUFBUTtBQUN6QixjQUFRLElBQUksT0FBTyxPQUFPLE1BQU0sTUFBTSxRQUFRLEtBQUssRUFBRSxDQUFDO0FBQUEsSUFDMUQ7QUFFQSxVQUFNLFdBQWdDLENBQUM7QUFFdkMsUUFBSSxXQUFXLEtBQUssV0FBVyxVQUE0QixTQUFTLE1BQU0sS0FBSyxHQUFHLFVBQVUsR0FBRyxVQUFVO0FBQ3pHLFFBQUksZ0JBQWdCLEtBQUssTUFBTTtBQUUvQixXQUFRLFVBQVMsUUFBUSxVQUFVLFVBQVUsVUFBVSxJQUFJLFFBQVE7QUFDL0QsWUFBTSxTQUFTLENBQUMsR0FBRyxRQUFRLEVBQUUsRUFBRSxRQUFRLFFBQVEsY0FBYyxXQUFXLFFBQVEsS0FBSztBQUNyRixlQUFTLEtBQUs7QUFBQSxRQUNWLE9BQU8sUUFBUTtBQUFBLFFBQ2Y7QUFBQSxNQUNKLENBQUM7QUFFRCxpQkFBVyxTQUFTLE1BQU0sUUFBUSxRQUFRLFFBQVEsR0FBRyxNQUFNO0FBQzNELHNCQUFnQixjQUFjLFVBQVUsUUFBUSxNQUFNO0FBQ3RELGlCQUFXLFFBQVE7QUFFbkIsZ0JBQVUsU0FBUyxNQUFNLEtBQUs7QUFDOUI7QUFBQSxJQUNKO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVRLGNBQWMsYUFBOEI7QUFDaEQsUUFBSSx1QkFBdUIsUUFBUTtBQUMvQixhQUFPO0FBQUEsSUFDWDtBQUNBLFdBQU8sSUFBSSxjQUFjLEtBQUssV0FBVyxFQUFFLFFBQVE7QUFBQSxFQUN2RDtBQUFBLEVBRU8sTUFBTSxXQUE0QixPQUFpQztBQUN0RSxVQUFNLGFBQWEsS0FBSyxjQUFjLEtBQUssY0FBYyxTQUFTLEdBQUcsS0FBSztBQUMxRSxVQUFNLFdBQTRCLENBQUM7QUFFbkMsUUFBSSxVQUFVO0FBRWQsZUFBVyxLQUFLLFlBQVk7QUFDeEIsZUFBUyxLQUFLLEtBQUssVUFBVSxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQzlDLGdCQUFVLEVBQUUsUUFBUSxFQUFFO0FBQUEsSUFDMUI7QUFFQSxhQUFTLEtBQUssS0FBSyxVQUFVLE9BQU8sQ0FBQztBQUVyQyxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRU8sT0FBTyxPQUFlO0FBQ3pCLFVBQU0sWUFBWSxLQUFLLE1BQU07QUFDN0IsYUFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLEtBQUs7QUFDNUIsZ0JBQVUsU0FBUyxLQUFLLE1BQU0sQ0FBQztBQUFBLElBQ25DO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFBQSxTQUVjLEtBQUssS0FBcUI7QUFDcEMsUUFBSSxNQUFNLElBQUksY0FBYztBQUM1QixlQUFVLEtBQUssS0FBSTtBQUNmLFVBQUksU0FBUyxDQUFDO0FBQUEsSUFDbEI7QUFDQSxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRVEsaUJBQWlCLGFBQThCLGNBQXNDLE9BQWdCO0FBQ3pHLFVBQU0sYUFBYSxLQUFLLGNBQWMsYUFBYSxLQUFLO0FBQ3hELFFBQUksWUFBWSxJQUFJLGNBQWM7QUFFbEMsUUFBSSxVQUFVO0FBQ2QsZUFBVyxLQUFLLFlBQVk7QUFDeEIsa0JBQVksVUFBVSxVQUNsQixLQUFLLFVBQVUsU0FBUyxFQUFFLEtBQUssR0FDL0IsWUFDSjtBQUVBLGdCQUFVLEVBQUUsUUFBUSxFQUFFO0FBQUEsSUFDMUI7QUFFQSxjQUFVLFNBQVMsS0FBSyxVQUFVLE9BQU8sQ0FBQztBQUUxQyxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRU8sUUFBUSxhQUE4QixjQUFzQztBQUMvRSxXQUFPLEtBQUssaUJBQWlCLEtBQUssY0FBYyxXQUFXLEdBQUcsY0FBYyx1QkFBdUIsU0FBUyxTQUFZLENBQUM7QUFBQSxFQUM3SDtBQUFBLEVBRU8sU0FBUyxhQUFxQixNQUEyQztBQUM1RSxRQUFJLE9BQU8sS0FBSyxNQUFNLEdBQUc7QUFDekIsdUJBQW1CO0FBQ2YsdUJBQWlCLEtBQUssTUFBTSxXQUFXO0FBQUEsSUFDM0M7QUFDQSxZQUFRO0FBRVIsVUFBTSxVQUFVLElBQUksY0FBYyxLQUFLLFNBQVM7QUFFaEQsV0FBTyxnQkFBZ0I7QUFDbkIsY0FBUSxLQUFLLEtBQUssVUFBVSxHQUFHLGVBQWUsS0FBSyxDQUFDO0FBQ3BELGNBQVEsS0FBSyxLQUFLLGNBQWMsQ0FBQztBQUVqQyxhQUFPLEtBQUssVUFBVSxlQUFlLFFBQVEsZUFBZSxHQUFHLE1BQU07QUFDckUsY0FBUTtBQUFBLElBQ1o7QUFDQSxZQUFRLEtBQUssSUFBSTtBQUVqQixXQUFPO0FBQUEsRUFDWDtBQUFBLFFBRWEsY0FBYyxhQUFxQixNQUFvRDtBQUNoRyxRQUFJLE9BQU8sS0FBSyxNQUFNLEdBQUc7QUFDekIsdUJBQW1CO0FBQ2YsdUJBQWlCLEtBQUssTUFBTSxXQUFXO0FBQUEsSUFDM0M7QUFDQSxZQUFRO0FBRVIsVUFBTSxVQUFVLElBQUksY0FBYyxLQUFLLFNBQVM7QUFFaEQsV0FBTyxnQkFBZ0I7QUFDbkIsY0FBUSxLQUFLLEtBQUssVUFBVSxHQUFHLGVBQWUsS0FBSyxDQUFDO0FBQ3BELGNBQVEsS0FBSyxNQUFNLEtBQUssY0FBYyxDQUFDO0FBRXZDLGFBQU8sS0FBSyxVQUFVLGVBQWUsUUFBUSxlQUFlLEdBQUcsTUFBTTtBQUNyRSxjQUFRO0FBQUEsSUFDWjtBQUNBLFlBQVEsS0FBSyxJQUFJO0FBRWpCLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFTyxXQUFXLGFBQThCLGNBQXNDO0FBQ2xGLFdBQU8sS0FBSyxpQkFBaUIsS0FBSyxjQUFjLFdBQVcsR0FBRyxZQUFZO0FBQUEsRUFDOUU7QUFBQSxFQUVPLFNBQVMsYUFBK0M7QUFDM0QsVUFBTSxZQUFZLEtBQUssY0FBYyxXQUFXO0FBQ2hELFVBQU0sWUFBWSxDQUFDO0FBRW5CLGVBQVcsS0FBSyxXQUFXO0FBQ3ZCLGdCQUFVLEtBQUssS0FBSyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUFBLElBQ2pEO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVPLE1BQU0sYUFBNEQ7QUFDckUsUUFBSSx1QkFBdUIsVUFBVSxZQUFZLFFBQVE7QUFDckQsYUFBTyxLQUFLLFNBQVMsV0FBVztBQUFBLElBQ3BDO0FBRUEsVUFBTSxPQUFPLEtBQUssVUFBVSxNQUFNLFdBQVc7QUFFN0MsUUFBSSxRQUFRO0FBQU0sYUFBTztBQUV6QixVQUFNLGNBQTBCLENBQUM7QUFFakMsZ0JBQVksS0FBSyxLQUFLLE9BQU8sS0FBSyxPQUFPLEtBQUssTUFBTSxFQUFFLE1BQU07QUFDNUQsZ0JBQVksUUFBUSxLQUFLO0FBQ3pCLGdCQUFZLFFBQVEsS0FBSyxNQUFNO0FBRS9CLFFBQUksV0FBVyxZQUFZLEdBQUcsTUFBTTtBQUVwQyxlQUFXLEtBQUssTUFBTTtBQUNsQixVQUFJLE1BQU0sT0FBTyxDQUFDLENBQUMsR0FBRztBQUNsQjtBQUFBLE1BQ0o7QUFDQSxZQUFNLElBQUksS0FBSztBQUVmLFVBQUksS0FBSyxNQUFNO0FBQ1gsb0JBQVksS0FBVSxDQUFDO0FBQ3ZCO0FBQUEsTUFDSjtBQUVBLFlBQU0sWUFBWSxTQUFTLFFBQVEsQ0FBQztBQUNwQyxrQkFBWSxLQUFLLFNBQVMsT0FBTyxXQUFXLEVBQUUsTUFBTSxDQUFDO0FBQ3JELGlCQUFXLFNBQVMsVUFBVSxTQUFTO0FBQUEsSUFDM0M7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRU8sV0FBVztBQUNkLFdBQU8sS0FBSztBQUFBLEVBQ2hCO0FBQUEsRUFFTyxZQUFZLE9BQU8sVUFBa0I7QUFDeEMsV0FBTyxLQUFLLGdCQUFnQixLQUFLLE1BQU0sSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLO0FBQUEsRUFDNUQ7QUFBQSxFQUVPLG9CQUFvQixNQUFhLFFBQWM7QUFDbEQsUUFBSSxhQUFhLEtBQUssUUFBUSxJQUFJO0FBQ2xDLFFBQUksV0FBVyxXQUFXLElBQUksR0FBRztBQUM3QixtQkFBYSxLQUFLLFFBQVEsT0FBTyxDQUFDO0FBQ2xDLGVBQVM7QUFBQSxJQUNiO0FBQ0EsV0FBTyxpQ0FDQSxXQUFXLEdBQUcsU0FBTyxDQUFDLEVBQUUsa0JBRHhCO0FBQUEsTUFFSDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFLTyxVQUFVLEVBQUUsU0FBUyxNQUFNLFVBQVUsTUFBTSxPQUErSTtBQUU3TCxVQUFNLE9BQU8sS0FBSyxvQkFBb0IsUUFBUSxVQUFVLFFBQVEsR0FBRyxPQUFPLFVBQVUsVUFBVSxDQUFDO0FBRS9GLFdBQU8sR0FBRyxRQUFRLDZCQUE2QixjQUFjLGtCQUFnQixLQUFLLFdBQVcsWUFBWSxLQUFLLEtBQUssUUFBUSxLQUFLLE9BQU8sVUFBVSxXQUFXLGNBQWMsU0FBUyxTQUFTLEtBQUssSUFBSSxNQUFLO0FBQUEsRUFDOU07QUFBQSxFQUVPLGVBQWUsa0JBQXlCO0FBQzNDLFdBQU8sY0FBYyxNQUFNLGdCQUFnQjtBQUFBLEVBQy9DO0FBQUEsRUFFTyxXQUFXLGtCQUEwQixZQUFzQixXQUFtQjtBQUNqRixXQUFPLFVBQVUsTUFBTSxrQkFBa0IsWUFBWSxTQUFRO0FBQUEsRUFDakU7QUFDSjs7O0FDanlCQTtBQVNPLElBQU0sV0FBc0M7QUFBQSxFQUMvQyxlQUFlLENBQUM7QUFDcEI7QUFFQSxJQUFNLG1CQUE2QixDQUFDO0FBRTdCLElBQU0sZUFBZSxNQUFNLGlCQUFpQixTQUFTO0FBTXJELHdCQUF3QixFQUFDLElBQUksTUFBTSxPQUFPLFFBQVEsYUFBd0I7QUFDN0UsTUFBRyxDQUFDLGlCQUFpQixTQUFTLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxjQUFjLFNBQVMsU0FBUyxHQUFFO0FBQ3JGLHFCQUFpQixLQUFLLE1BQU0sSUFBSTtBQUNoQyxVQUFNLFVBQVUsUUFBUSxVQUFVLGNBQWE7QUFFL0MsVUFBTSxhQUFhLEtBQUssTUFBTSxTQUFTO0FBRXZDLFVBQU0sY0FBYyxNQUFNLFFBQVEsV0FBVyxJQUFJLEVBQUUsUUFBUSxZQUFZLE1BQU0sQ0FBQztBQUU5RSxRQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUUsSUFBSyxTQUFRLFVBQVUsTUFBTSxLQUFLLElBQUksSUFBRyxRQUFRLElBQUksT0FBTyxFQUFFO0FBQ3ZGLFdBQU87QUFBQSxNQUFDO0FBQUEsTUFDSixRQUFRLE9BQ1IsTUFBTSxLQUFLLFdBQVcsTUFBTSxLQUFLLEVBQUUsSUFBSSxPQUN2QyxjQUFjLE9BQ2QsTUFBTSxJQUFJLGVBQWUsV0FBVyxJQUFJLE9BQ3hDLElBQUksT0FBTyxLQUFLLFNBQU8sRUFBRSxJQUFJO0FBQUEsSUFBSTtBQUFBLEVBQ3pDO0FBQ0EsU0FBTyxDQUFDLFlBQVk7QUFDeEI7QUFFTyxtQkFBbUIsS0FBWTtBQUNsQyxTQUFPLElBQUksUUFBUSxxQkFBcUIsT0FBTztBQUNuRDs7O0FDM0NBO0FBQ0E7QUFDQSxJQUFNLFdBQVcsT0FBaUMsK0JBQThCO0FBQ2hGLElBQU0sYUFBYSxJQUFJLFlBQVksT0FBTyxNQUFNLFNBQVMsU0FBUyxlQUFjLFlBQVksTUFBTSxXQUFXLFlBQVksQ0FBQyxDQUFDO0FBQzNILElBQU0sZUFBZSxJQUFJLFlBQVksU0FBUyxZQUFZLENBQUMsQ0FBQztBQUM1RCxJQUFNLE9BQU8sYUFBYTtBQUUxQixJQUFJLGtCQUFrQjtBQUV0QixJQUFJLHVCQUF1QjtBQUMzQiwyQkFBMkI7QUFDdkIsTUFBSSx5QkFBeUIsUUFBUSxxQkFBcUIsV0FBVyxLQUFLLE9BQU8sUUFBUTtBQUNyRiwyQkFBdUIsSUFBSSxXQUFXLEtBQUssT0FBTyxNQUFNO0FBQUEsRUFDNUQ7QUFDQSxTQUFPO0FBQ1g7QUFFQSxJQUFNLGVBQWUsT0FBTyxnQkFBZ0IsY0FBZSxJQUFHLE9BQU8sU0FBUyxNQUFNLEVBQUUsY0FBYztBQUVwRyxJQUFJLG9CQUFvQixJQUFJLGFBQWEsT0FBTztBQUVoRCxJQUFNLGVBQWdCLE9BQU8sa0JBQWtCLGVBQWUsYUFDeEQsU0FBVSxLQUFLLE1BQU07QUFDdkIsU0FBTyxrQkFBa0IsV0FBVyxLQUFLLElBQUk7QUFDakQsSUFDTSxTQUFVLEtBQUssTUFBTTtBQUN2QixRQUFNLE1BQU0sa0JBQWtCLE9BQU8sR0FBRztBQUN4QyxPQUFLLElBQUksR0FBRztBQUNaLFNBQU87QUFBQSxJQUNILE1BQU0sSUFBSTtBQUFBLElBQ1YsU0FBUyxJQUFJO0FBQUEsRUFDakI7QUFDSjtBQUVBLDJCQUEyQixLQUFLLFFBQVEsU0FBUztBQUU3QyxNQUFJLFlBQVksUUFBVztBQUN2QixVQUFNLE1BQU0sa0JBQWtCLE9BQU8sR0FBRztBQUN4QyxVQUFNLE9BQU0sT0FBTyxJQUFJLE1BQU07QUFDN0Isb0JBQWdCLEVBQUUsU0FBUyxNQUFLLE9BQU0sSUFBSSxNQUFNLEVBQUUsSUFBSSxHQUFHO0FBQ3pELHNCQUFrQixJQUFJO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBRUEsTUFBSSxNQUFNLElBQUk7QUFDZCxNQUFJLE1BQU0sT0FBTyxHQUFHO0FBRXBCLFFBQU0sTUFBTSxnQkFBZ0I7QUFFNUIsTUFBSSxTQUFTO0FBRWIsU0FBTyxTQUFTLEtBQUssVUFBVTtBQUMzQixVQUFNLE9BQU8sSUFBSSxXQUFXLE1BQU07QUFDbEMsUUFBSSxPQUFPO0FBQU07QUFDakIsUUFBSSxNQUFNLFVBQVU7QUFBQSxFQUN4QjtBQUVBLE1BQUksV0FBVyxLQUFLO0FBQ2hCLFFBQUksV0FBVyxHQUFHO0FBQ2QsWUFBTSxJQUFJLE1BQU0sTUFBTTtBQUFBLElBQzFCO0FBQ0EsVUFBTSxRQUFRLEtBQUssS0FBSyxNQUFNLFNBQVMsSUFBSSxTQUFTLENBQUM7QUFDckQsVUFBTSxPQUFPLGdCQUFnQixFQUFFLFNBQVMsTUFBTSxRQUFRLE1BQU0sR0FBRztBQUMvRCxVQUFNLE1BQU0sYUFBYSxLQUFLLElBQUk7QUFFbEMsY0FBVSxJQUFJO0FBQUEsRUFDbEI7QUFFQSxvQkFBa0I7QUFDbEIsU0FBTztBQUNYO0FBcUNBLElBQU0sZUFBZSxPQUFPLGdCQUFnQixjQUFlLElBQUcsT0FBTyxTQUFTLE1BQU0sRUFBRSxjQUFjO0FBRXBHLElBQUksb0JBQW9CLElBQUksYUFBYSxTQUFTLEVBQUUsV0FBVyxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBRWxGLGtCQUFrQixPQUFPO0FBMEJsQix3QkFBd0IsTUFBTSxPQUFPO0FBQ3hDLE1BQUksT0FBTyxrQkFBa0IsTUFBTSxLQUFLLG1CQUFtQixLQUFLLGtCQUFrQjtBQUNsRixNQUFJLE9BQU87QUFDWCxNQUFJLE9BQU8sa0JBQWtCLE9BQU8sS0FBSyxtQkFBbUIsS0FBSyxrQkFBa0I7QUFDbkYsTUFBSSxPQUFPO0FBQ1gsTUFBSSxNQUFNLEtBQUssZUFBZSxNQUFNLE1BQU0sTUFBTSxJQUFJO0FBQ3BELFNBQU87QUFDWDtBQW1CTyx5QkFBeUIsTUFBTSxVQUFVO0FBQzVDLE1BQUksT0FBTyxrQkFBa0IsTUFBTSxLQUFLLG1CQUFtQixLQUFLLGtCQUFrQjtBQUNsRixNQUFJLE9BQU87QUFDWCxNQUFJLE9BQU8sa0JBQWtCLFVBQVUsS0FBSyxtQkFBbUIsS0FBSyxrQkFBa0I7QUFDdEYsTUFBSSxPQUFPO0FBQ1gsTUFBSSxNQUFNLEtBQUssZ0JBQWdCLE1BQU0sTUFBTSxNQUFNLElBQUk7QUFDckQsU0FBTztBQUNYO0FBT08sdUJBQXVCLE1BQU0sUUFBUTtBQUN4QyxNQUFJLE9BQU8sa0JBQWtCLE1BQU0sS0FBSyxtQkFBbUIsS0FBSyxrQkFBa0I7QUFDbEYsTUFBSSxPQUFPO0FBQ1gsTUFBSSxNQUFNLEtBQUssY0FBYyxNQUFNLE1BQU0sT0FBTyxZQUFZLENBQUMsQ0FBQztBQUM5RCxTQUFPLFFBQVE7QUFDbkI7OztBQ3RMTyxJQUFNLGFBQWEsQ0FBQyxZQUFXLFVBQVUsT0FBTztBQUNoRCxJQUFNLGlCQUFpQixDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLFVBQVUsQ0FBQzs7O0FDR25FO0FBQ0E7QUFFTyxJQUFNLE9BQU8sV0FBVyxLQUFLLGFBQWEsc0RBQXNELEVBQUUsWUFBWSxLQUFLLEVBQUUsT0FBTyxDQUFDO0FBRTdILHVCQUFpQjtBQUFBLFNBS2IsV0FBVyxNQUFjLE9BQXVCO0FBQ25ELFdBQU8sY0FBYyxNQUFNLEtBQUs7QUFBQSxFQUNwQztBQUFBLFNBTU8sYUFBYSxNQUFjLFNBQW9DO0FBQ2xFLFFBQUksQ0FBQyxNQUFNLFFBQVEsT0FBTyxHQUFHO0FBQ3pCLGdCQUFVLENBQUMsT0FBTztBQUFBLElBQ3RCO0FBRUEsV0FBTyxnQkFBZ0IsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDO0FBQUEsRUFDeEQ7QUFBQSxTQVVPLGVBQWUsTUFBYyxNQUFjLEtBQXFCO0FBQ25FLFdBQU8sZUFBZSxNQUFNLE9BQU8sR0FBRztBQUFBLEVBQzFDO0FBQ0o7QUFFTyxnQ0FBMEI7QUFBQSxFQUk3QixZQUFvQixVQUFnQjtBQUFoQjtBQUhwQixzQkFBZ0M7QUFDaEMsMEJBQXNDO0FBQUEsRUFFQTtBQUFBLEVBRTlCLFlBQVksTUFBcUIsUUFBZ0I7QUFDckQsUUFBSSxDQUFDLEtBQUs7QUFBVTtBQUVwQixlQUFXLEtBQUssS0FBSyxNQUFNLE1BQU0sRUFBRSxRQUFRLEdBQUc7QUFDMUMsV0FBSyxTQUFTO0FBQUEsUUFDVixNQUFNO0FBQUEsNkNBQWdELEVBQUUsd0JBQXdCLEtBQUssR0FBRyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFBQTtBQUFBLFFBQ3pHLFdBQVc7QUFBQSxNQUNmLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUFBLFFBQ2EsY0FBYyxNQUFxQixRQUFnQjtBQUM1RCxVQUFNLENBQUMsT0FBTyxVQUFVLE1BQU0sS0FBSyxLQUFLLGlCQUFpQixDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7QUFDMUUsU0FBSyxZQUFZLE1BQU0sTUFBTTtBQUU3QixXQUFPO0FBQUEsRUFDWDtBQUFBLFFBRWEsa0JBQWtCLE1BQXFCLFFBQWdCO0FBQ2hFLFVBQU0sQ0FBQyxPQUFPLFVBQVUsTUFBTSxLQUFLLEtBQUsscUJBQXFCLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQztBQUM5RSxTQUFLLFlBQVksTUFBTSxNQUFNO0FBRTdCLFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFJQSwwQkFBaUMsTUFBb0M7QUFDakUsU0FBTyxLQUFLLE1BQU0sTUFBTSxLQUFLLEtBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNEO0FBRUEsOEJBQXFDLE1BQWMsTUFBaUM7QUFDaEYsU0FBTyxLQUFLLE1BQU0sTUFBTSxLQUFLLEtBQUssa0JBQWtCLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQztBQUNwRTtBQUdBLHlCQUFnQyxNQUFjLE9BQWUsS0FBbUM7QUFDNUYsU0FBTyxLQUFLLE1BQU0sTUFBTSxLQUFLLEtBQUssYUFBYSxDQUFDLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztBQUN0RTs7O0FDdEZBO0FBQ0E7QUFTQSxJQUFNLGVBQWUsWUFBVyxLQUFLLGFBQWEsb0NBQW9DLEVBQUUsWUFBWSxNQUFLLEVBQUUsT0FBTyxDQUFDO0FBRW5ILCtCQUFzQyxNQUFvQztBQUN0RSxTQUFPLEtBQUssTUFBTSxNQUFNLGFBQWEsS0FBSyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRTtBQUVBLGlDQUF3QyxNQUFjLE9BQWtDO0FBQ3BGLFNBQU8sTUFBTSxhQUFhLEtBQUssOEJBQThCLENBQUMsTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUM7QUFDOUY7QUFFQSwwQkFBaUMsTUFBYyxPQUFrQztBQUM3RSxTQUFPLE1BQU0sYUFBYSxLQUFLLGdCQUFnQixDQUFDLE1BQU0sTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3pFO0FBRUEsMkJBQThCO0FBQUEsRUFDMUIsV0FBVyxNQUFjLE1BQWMsU0FBaUI7QUFDcEQsUUFBSSxVQUFVO0FBQ2QsZUFBVyxLQUFLLEtBQUssTUFBTSxJQUFJLEdBQUc7QUFDOUIsaUJBQVcsVUFBVTtBQUFBLElBQ3pCO0FBRUEsV0FBTyxRQUFRLFVBQVUsUUFBUSxNQUFNO0FBQUEsRUFDM0M7QUFDSjtBQUdBLHFDQUF3QyxlQUFlO0FBQUEsRUFHbkQsWUFBWSxZQUF5QjtBQUNqQyxVQUFNO0FBQ04sU0FBSyxhQUFhO0FBQUEsRUFDdEI7QUFBQSxFQUVBLFlBQVk7QUFDUixRQUFJLFlBQVk7QUFFaEIsZUFBVyxLQUFLLEtBQUssWUFBWTtBQUM3QixtQkFBYSxFQUFFO0FBQUEsSUFDbkI7QUFFQSxXQUFPLEtBQUssV0FBVyxXQUFXLFNBQVMsTUFBTTtBQUFBLEVBQ3JEO0FBQ0o7QUFRTyxzQ0FBZ0MsaUJBQWlCO0FBQUEsRUFHcEQsWUFBWSxZQUF5QjtBQUNqQyxVQUFNLFVBQVU7QUFDaEIsU0FBSyxXQUFXLEVBQUUsTUFBTSxJQUFJLFFBQVEsQ0FBQyxFQUFFO0FBQ3ZDLFNBQUssZUFBZTtBQUFBLEVBQ3hCO0FBQUEsTUFFSSxnQkFBZ0I7QUFDaEIsV0FBTyxLQUFLLFNBQVM7QUFBQSxFQUN6QjtBQUFBLE1BRUksY0FBYyxPQUFPO0FBQ3JCLFNBQUssU0FBUyxPQUFPO0FBQUEsRUFDekI7QUFBQSxNQUVJLFlBQVk7QUFDWixXQUFPLEtBQUssU0FBUztBQUFBLEVBQ3pCO0FBQUEsRUFFUSxpQkFBaUI7QUFDckIsZUFBVyxLQUFLLEtBQUssWUFBWTtBQUM3QixVQUFJLEVBQUUsU0FBUztBQUNYLGFBQUssU0FBUyxRQUFRLEtBQUssS0FBSyxTQUFTLE9BQU8sVUFBVSxFQUFFLGFBQWE7QUFDekUsYUFBSyxTQUFTLE9BQU8sS0FBSyxFQUFFLElBQUk7QUFBQSxNQUNwQyxPQUFPO0FBQ0gsYUFBSyxTQUFTLFFBQVEsRUFBRTtBQUFBLE1BQzVCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQU9BLFlBQVk7QUFDUixVQUFNLFlBQVksS0FBSyxTQUFTLEtBQUssUUFBUSwyQkFBMkIsQ0FBQyxHQUFHLE9BQU87QUFDL0UsYUFBTyxLQUFLLFNBQVMsT0FBTztBQUFBLElBQ2hDLENBQUM7QUFFRCxXQUFPLE1BQU0sV0FBVyxXQUFXLFNBQVMsTUFBTTtBQUFBLEVBQ3REO0FBQ0o7OztBQ2hHQSxxQkFBOEI7QUFBQSxFQVExQixZQUFZLE1BQXFCLFFBQWMsUUFBUSxNQUFNLE1BQU0sTUFBTSxPQUFPLFVBQVU7QUFDdEYsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQ1osU0FBSyxNQUFNO0FBQ1gsU0FBSyxPQUFPO0FBQ1osU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVBLGNBQWMsTUFBYyxTQUFpQjtBQUN6QyxTQUFLLE9BQU8sS0FBSyxLQUFLLFdBQVcsTUFBTSxPQUFPO0FBQUEsRUFDbEQ7QUFBQSxFQUVBLG1CQUFtQixNQUFxQjtBQUNwQyxVQUFNLEtBQUssS0FBSztBQUNoQixVQUFNLE9BQU8sV0FBVyxhQUFhLElBQUksQ0FBQyxLQUFLLE1BQU0sS0FBSyxHQUFHLENBQUM7QUFDOUQsV0FBTyxRQUFRLEtBQUssT0FBTyxJQUFJLEdBQUc7QUFBQSxFQUN0QztBQUFBLEVBRUEsZUFBZSxNQUFvQztBQUMvQyxVQUFNLFdBQVcsSUFBSSxjQUFjLEtBQUssU0FBUztBQUVqRCxVQUFNLFlBQVksS0FBSyxNQUFNLElBQUksR0FBRyxTQUFTLFVBQVU7QUFFdkQsYUFBUyxLQUFLLElBQUk7QUFHbEIsUUFBSSxRQUFRO0FBQ1osZUFBVyxLQUFLLFdBQVc7QUFFdkIsVUFBSSxFQUFFLEdBQUcsS0FBSyxFQUFFO0FBQ1osaUJBQVMsS0FDTCxJQUFJLGNBQWMsTUFBTSxNQUFNLEVBQUU7QUFBQSxDQUFZLEdBQzVDLENBQ0o7QUFFSixVQUFJLFNBQVMsUUFBUTtBQUNqQixpQkFBUyxLQUFLLElBQUk7QUFDbEI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsUUFFTSxjQUFjO0FBQ2hCLFVBQU0sU0FBUyxNQUFNLFVBQVUsS0FBSyxLQUFLLElBQUksS0FBSyxPQUFPLEtBQUssR0FBRztBQUNqRSxTQUFLLFNBQVMsQ0FBQztBQUVmLGVBQVcsS0FBSyxRQUFRO0FBQ3BCLFVBQUksWUFBWSxLQUFLLEtBQUssVUFBVSxFQUFFLE9BQU8sRUFBRSxHQUFHO0FBQ2xELFVBQUksT0FBTyxFQUFFO0FBRWIsY0FBUSxFQUFFO0FBQUEsYUFDRDtBQUNELHNCQUFZLElBQUksY0FBYyxFQUFFLGNBQWM7QUFDOUMsaUJBQU87QUFDUDtBQUFBLGFBQ0M7QUFDRCxzQkFBWSxJQUFJLGNBQWMsRUFBRSxrQkFBa0I7QUFDbEQsaUJBQU87QUFDUDtBQUFBLGFBQ0M7QUFDRCxzQkFBWSxJQUFJLGNBQWMsRUFBRSw4QkFBOEIsU0FBUyxRQUFRLFNBQVM7QUFDeEYsaUJBQU87QUFDUDtBQUFBO0FBR1IsVUFBSSxRQUFRLFVBQVUsQ0FBQyxVQUFVLFNBQVMsR0FBRztBQUN6QyxrQkFBVSxvQkFBb0IsR0FBRztBQUVyQyxXQUFLLE9BQU8sS0FBSztBQUFBLFFBQ2IsTUFBTTtBQUFBLFFBQ047QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUFBLFNBRU8sUUFBUSxNQUE4QjtBQUN6QyxXQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sRUFBRSxRQUFRLE9BQU8sS0FBSyxFQUFFLFFBQVEsWUFBWSxTQUFTO0FBQUEsRUFDM0Y7QUFBQSxTQUVPLG9CQUFvQixNQUE4QjtBQUNyRCxXQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sRUFBRSxRQUFRLE9BQU8sS0FBSztBQUFBLEVBQzVEO0FBQUEsRUFFQSxjQUFjO0FBQ1YsVUFBTSxVQUFVLElBQUksY0FBYyxLQUFLLE9BQU8sSUFBSSxNQUFNLFNBQVM7QUFDakUsZUFBVyxLQUFLLEtBQUssUUFBUTtBQUN6QixVQUFJLEVBQUUsUUFBUSxRQUFRO0FBQ2xCLFlBQUksRUFBRSxLQUFLLE1BQU0sSUFBSTtBQUNqQixrQkFBUSxLQUFLLEVBQUUsSUFBSTtBQUFBLFFBQ3ZCO0FBQUEsTUFDSixXQUFXLEVBQUUsUUFBUSxZQUFZO0FBQzdCLGdCQUFRLEtBQUssS0FBSyxPQUFPLEtBQUssRUFBRSxNQUFNLEtBQUssR0FBRztBQUFBLE1BRWxELE9BQU87QUFDSCxnQkFBUSxLQUFLLEtBQUssT0FBTyxFQUFFLE1BQU0sS0FBSyxHQUFHO0FBQUEsTUFDN0M7QUFBQSxJQUNKO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVBLFNBQVMsU0FBa0I7QUFDdkIsVUFBTSxZQUFZLElBQUksY0FBYyxLQUFLLE9BQU8sSUFBSSxNQUFNLFNBQVM7QUFFbkUsUUFBSSxDQUFDLEtBQUssT0FBTyxRQUFRO0FBQ3JCLGFBQU87QUFBQSxJQUNYO0FBRUEsZUFBVyxLQUFLLEtBQUssUUFBUTtBQUN6QixVQUFJLEVBQUUsUUFBUSxRQUFRO0FBQ2xCLFlBQUksRUFBRSxLQUFLLE1BQU0sSUFBSTtBQUNqQixvQkFBVSxpQ0FBaUMsU0FBUyxRQUFRLEVBQUUsSUFBSTtBQUFBLFFBQ3RFO0FBQUEsTUFDSixPQUFPO0FBQ0gsWUFBSSxXQUFXLEVBQUUsUUFBUSxVQUFVO0FBQy9CLG9CQUFVLEtBQ04sSUFBSSxjQUFjLE1BQU07QUFBQSxvQkFBdUIsU0FBUyxRQUFRLEVBQUUsSUFBSSxNQUFNLEdBQzVFLEtBQUssZUFBZSxFQUFFLElBQUksQ0FDOUI7QUFBQSxRQUNKLE9BQU87QUFDSCxvQkFBVSxLQUFLLEVBQUUsSUFBSTtBQUFBLFFBQ3pCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLFNBRWMsV0FBVyxTQUFpQjtBQUN0QyxXQUFPLDBEQUEwRCxTQUFTLFFBQVEsVUFBVSxPQUFPLENBQUM7QUFBQSxFQUN4RztBQUFBLGVBRWEsYUFBYSxNQUFxQixRQUFjLFNBQWtCO0FBQzNFLFVBQU0sU0FBUyxJQUFJLFNBQVMsTUFBTSxNQUFJO0FBQ3RDLFVBQU0sT0FBTyxZQUFZO0FBQ3pCLFdBQU8sT0FBTyxTQUFTLE9BQU87QUFBQSxFQUNsQztBQUFBLFNBRWUsY0FBYyxNQUFjLFdBQW1CLG9CQUFvQixHQUFHO0FBQ2pGLGFBQVMsSUFBSSxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsS0FBSztBQUN2QyxVQUFJLEtBQUssTUFBTSxXQUFXO0FBQ3RCO0FBQUEsTUFDSjtBQUVBLFVBQUkscUJBQXFCLEdBQUc7QUFDeEIsZUFBTyxDQUFDLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBRyxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFBQSxNQUN2RDtBQUFBLElBQ0o7QUFDQSxXQUFPLENBQUMsSUFBSTtBQUFBLEVBQ2hCO0FBQ0o7QUFVTyxnQ0FBMEI7QUFBQSxFQU03QixZQUFvQixVQUFVLElBQUk7QUFBZDtBQUxaLDBCQUF1QyxDQUFDO0FBTTVDLFNBQUssV0FBVyxPQUFPLEdBQUcsaUZBQWlGO0FBQUEsRUFDL0c7QUFBQSxRQUVNLEtBQUssTUFBcUIsUUFBYztBQUMxQyxTQUFLLFlBQVksSUFBSSxrQkFBa0IsTUFBTSxnQkFBZ0IsTUFBTSxLQUFLLG1CQUFtQixJQUFJLENBQUMsQ0FBQztBQUNqRyxTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLFFBRWMsbUJBQW1CLE1BQXFCO0FBQ2xELFVBQU0sY0FBYyxJQUFJLFNBQVMsTUFBTSxLQUFLLElBQUk7QUFDaEQsVUFBTSxZQUFZLFlBQVk7QUFFOUIsUUFBSSxVQUFVO0FBQ2QsUUFBSSxVQUFVO0FBRWQsZUFBVyxLQUFLLFlBQVksUUFBUTtBQUNoQyxVQUFJLEVBQUUsUUFBUSxRQUFRO0FBQ2xCLG1CQUFXLEVBQUU7QUFBQSxNQUNqQixPQUFPO0FBQ0gsYUFBSyxlQUFlLEtBQUs7QUFBQSxVQUNyQixNQUFNLEVBQUU7QUFBQSxVQUNSLE1BQU0sRUFBRTtBQUFBLFFBQ1osQ0FBQztBQUNELG1CQUFXLGlCQUFpQjtBQUFBLE1BQ2hDO0FBQUEsSUFDSjtBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFUSxzQkFBc0IsTUFBb0M7QUFDOUQsV0FBTyxLQUFLLFNBQVMsOEJBQThCLENBQUMsbUJBQW1CO0FBQ25FLFlBQU0sUUFBUSxlQUFlO0FBQzdCLGFBQU8sSUFBSSxjQUFjLE1BQU0sU0FBUyxFQUFFLFFBQVEsS0FBSywyQkFBMkI7QUFBQSxJQUN0RixDQUFDO0FBQUEsRUFDTDtBQUFBLFFBRWEsYUFBYTtBQUN0QixVQUFNLGtCQUFrQixJQUFJLFNBQVMsSUFBSSxjQUFjLE1BQU0sS0FBSyxVQUFVLGFBQWEsR0FBRyxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ2pILFVBQU0sZ0JBQWdCLFlBQVk7QUFFbEMsZUFBVyxLQUFLLGdCQUFnQixRQUFRO0FBQ3BDLFVBQUksRUFBRSxRQUFRLFFBQVE7QUFDbEIsVUFBRSxPQUFPLEtBQUssc0JBQXNCLEVBQUUsSUFBSTtBQUFBLE1BQzlDO0FBQUEsSUFDSjtBQUVBLFNBQUssVUFBVSxnQkFBZ0IsZ0JBQWdCLFlBQVksRUFBRTtBQUM3RCxXQUFPLEtBQUssVUFBVSxVQUFVO0FBQUEsRUFDcEM7QUFBQSxFQUVRLGNBQWMsTUFBMEI7QUFDNUMsV0FBTyxJQUFJLGNBQWMsS0FBSyxLQUFLLFNBQVMsRUFBRSxVQUFVLEtBQUssUUFBUSxhQUFhLE1BQU0sS0FBSyxLQUFLO0FBQUEsRUFDdEc7QUFBQSxFQUVPLFlBQVksTUFBcUI7QUFDcEMsV0FBTyxLQUFLLFNBQVMsS0FBSyxVQUFVLENBQUMsbUJBQW1CO0FBQ3BELFlBQU0sUUFBUSxPQUFPLGVBQWUsTUFBTSxlQUFlLEVBQUU7QUFFM0QsYUFBTyxLQUFLLGNBQWMsS0FBSyxlQUFlLE1BQU07QUFBQSxJQUN4RCxDQUFDO0FBQUEsRUFDTDtBQUNKOzs7QVZqUEEsNkJBQTZCLE1BQW9CLFFBQWE7QUFDMUQsUUFBTSxTQUFTLElBQUksU0FBUyxNQUFNLFFBQU0sYUFBYSxhQUFhLFlBQVk7QUFDOUUsUUFBTSxPQUFPLFlBQVk7QUFFekIsUUFBTSxnQkFBZ0IsSUFBSSxjQUFjLEtBQUssZUFBZTtBQUM1RCxhQUFXLEtBQUssT0FBTyxRQUFRO0FBQzNCLFFBQUksRUFBRSxRQUFRLFFBQVE7QUFDbEIsb0JBQWMsS0FBSyxFQUFFLElBQUk7QUFBQSxJQUM3QixPQUFPO0FBQ0gsb0JBQWMsd0JBQXlCLEVBQUU7QUFBQSxJQUM3QztBQUFBLEVBQ0o7QUFFQSxTQUFPO0FBQ1g7QUFFQSwrQkFBK0IsTUFBb0IsUUFBYTtBQUM1RCxRQUFNLFNBQVMsSUFBSSxTQUFTLE1BQU0sUUFBTSxhQUFhLGFBQWEsWUFBWTtBQUM5RSxRQUFNLE9BQU8sWUFBWTtBQUd6QixRQUFNLGdCQUFnQixJQUFJLGNBQWMsS0FBSyxlQUFlO0FBQzVELGFBQVcsS0FBSyxPQUFPLFFBQVE7QUFDM0IsUUFBSSxFQUFFLFFBQVEsUUFBUTtBQUNsQixvQkFBYyxLQUFLLEVBQUUsSUFBSTtBQUFBLElBQzdCLE9BQU87QUFDSCxvQkFBYywwQkFBMkIsU0FBUyxRQUFRLEVBQUUsSUFBSTtBQUFBLElBQ3BFO0FBQUEsRUFDSjtBQUNBLFNBQU87QUFDWDtBQUVBLDhCQUE4QixNQUFvQixRQUFhO0FBQzNELFFBQU0sU0FBUyxJQUFJLFNBQVMsTUFBTSxNQUFJO0FBQ3RDLFFBQU0sT0FBTyxZQUFZO0FBRXpCLGFBQVcsS0FBSyxPQUFPLFFBQVE7QUFDM0IsUUFBSSxFQUFFLFFBQVEsUUFBUTtBQUNsQixRQUFFLE9BQU8sTUFBTSxjQUFjLEVBQUUsTUFBTSxNQUFJO0FBQUEsSUFDN0MsT0FBTztBQUNILFFBQUUsT0FBTyxNQUFNLGdCQUFnQixFQUFFLE1BQU0sTUFBSTtBQUFBLElBQy9DO0FBQUEsRUFDSjtBQUVBLFNBQU8sUUFBUTtBQUNmLFNBQU8sTUFBTTtBQUNiLFNBQU8sT0FBTyxZQUFZO0FBQzlCO0FBRUEsOEJBQThCLE1BQW9CLFFBQWM7QUFDNUQsU0FBTyxNQUFNLGdCQUFnQixNQUFNLE1BQUk7QUFDM0M7QUFFQSw0QkFBbUMsVUFBa0IsVUFBaUIsVUFBaUIsV0FBa0IsUUFBMEIsQ0FBQyxHQUFFO0FBQ2xJLE1BQUcsQ0FBQyxNQUFNO0FBQ04sVUFBTSxRQUFRLE1BQU0sZUFBTyxTQUFTLFVBQVUsTUFBTTtBQUV4RCxTQUFPO0FBQUEsSUFDSCxTQUFTLElBQUksY0FBYyxHQUFHLGlCQUFpQixhQUFhLFdBQVUsUUFBUSxNQUFNLGVBQWMsTUFBTSxLQUFLO0FBQUEsSUFDN0csWUFBWTtBQUFBLG9CQUEwQixTQUFTLFFBQVEsV0FBVyxTQUFTLFNBQVM7QUFBQSxFQUN4RjtBQUNKO0FBRU8sK0JBQStCLFVBQWtCLFdBQW1CLFFBQWUsVUFBaUIsV0FBVyxHQUFHO0FBQ3JILE1BQUksWUFBWSxDQUFDLFVBQVUsU0FBUyxNQUFNLFFBQVEsR0FBRztBQUNqRCxnQkFBWSxHQUFHLGFBQWE7QUFBQSxFQUNoQztBQUVBLE1BQUcsVUFBVSxNQUFNLEtBQUk7QUFDbkIsVUFBTSxDQUFDLGNBQWEsVUFBVSxXQUFXLEtBQU0sVUFBVSxVQUFVLENBQUMsQ0FBQztBQUNyRSxXQUFRLGFBQVksSUFBSSxtQkFBa0IsTUFBTSxnQkFBZ0IsZ0JBQWUsVUFBVTtBQUFBLEVBQzdGO0FBRUEsTUFBSSxVQUFVLE1BQU0sS0FBSztBQUNyQixRQUFJLFVBQVUsTUFBTSxLQUFLO0FBQ3JCLGtCQUFZLFVBQVUsVUFBVSxDQUFDO0FBQUEsSUFDckM7QUFDQSxnQkFBWSxHQUFHLE1BQUssUUFBUSxRQUFRLEtBQUs7QUFBQSxFQUM3QyxXQUFXLFVBQVUsTUFBTSxLQUFLO0FBQzVCLGdCQUFZLEdBQUcsU0FBUyxPQUFPLFlBQVk7QUFBQSxFQUMvQyxPQUFPO0FBQ0gsZ0JBQVksR0FBRyxZQUFZLElBQUksbUJBQW1CLGNBQWMsZ0JBQWdCLE1BQU0sS0FBSyxVQUFVO0FBQUEsRUFDekc7QUFFQSxTQUFPLE1BQUssVUFBVSxTQUFTO0FBQ25DO0FBU0Esd0JBQXdCLFVBQWlCLFdBQWtCLFdBQWtCLFFBQWUsVUFBa0I7QUFDMUcsU0FBTztBQUFBLElBQ0gsV0FBVyxzQkFBc0IsV0FBVyxXQUFXLFFBQVEsVUFBVSxDQUFDO0FBQUEsSUFDMUUsVUFBVSxzQkFBc0IsVUFBVSxXQUFXLFFBQVEsUUFBUTtBQUFBLEVBQ3pFO0FBQ0o7OztBVzNHQTs7O0FDQUE7QUFLTyx1QkFBdUIsS0FBcUQsa0JBQWtCLENBQUMsTUFBYyxNQUFjLFNBQWlCO0FBQUMsU0FBTyxFQUFDLE1BQU0sTUFBTSxLQUFJO0FBQUMsR0FBRTtBQUMzSyxRQUFNLFlBQXFCLElBQUksTUFBTSxLQUFLLEVBQUUsTUFBTSxJQUFJO0FBQ3RELFFBQU0sbUJBQW1CLFVBQVUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxNQUFhLEVBQUUsU0FBUyxLQUFLLENBQUM7QUFFdEYsTUFBRyxvQkFBb0IsSUFBRztBQUN0QixVQUFNLFVBQVUsSUFBSSxRQUFRLFFBQVEsMENBQTBDLENBQUMsR0FBRyxPQUFPLE1BQU0sSUFBSSxPQUFPO0FBQ3RHLFlBQU0sRUFBQyxNQUFNLE1BQU0sU0FBUSxnQkFBZ0IsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLEdBQUcsSUFBSTtBQUN2RSxhQUFPLEdBQUcsUUFBUSxRQUFRLFFBQVE7QUFBQSxJQUN0QyxDQUFDO0FBRUQsV0FBTztBQUFBLE1BQ0gsV0FBVyxJQUFJO0FBQUEsTUFDZixZQUFZLFVBQVU7QUFBQSxNQUN0QixXQUFXLFVBQVU7QUFBQSxNQUNyQixlQUFlO0FBQUEsTUFDZixhQUFhO0FBQUEsSUFDakI7QUFBQSxFQUNKO0FBRUEsUUFBTSxZQUFZLFVBQVUsa0JBQWtCLE1BQU0sS0FBSyxFQUFFLElBQUk7QUFDL0QsUUFBTSxhQUFhLFVBQVUsTUFBTSxVQUFVLFNBQVMsa0JBQWtCLEVBQUcsRUFBRSxJQUFJLE9BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxRQUFHLElBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJO0FBRS9ILE1BQUksWUFBbUIsVUFBVSxHQUFHLEVBQUU7QUFDdEMsY0FBWSxVQUFVLFVBQVUsVUFBVSxRQUFRLEdBQUcsQ0FBQyxFQUFFLE1BQU0sS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLO0FBRWxGLFFBQU0sWUFBWTtBQUFBLFFBQ1YsZ0JBQWU7QUFDZixhQUFPLEdBQUcsVUFBVTtBQUFBLEVBQWlDLFVBQVU7QUFBQSxJQUNuRTtBQUFBLFFBQ0ksY0FBYTtBQUNiLGFBQU8sR0FBRyxVQUFVO0FBQUEsU0FBeUIsVUFBVTtBQUFBLElBQzNEO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSjtBQUNBLFNBQU87QUFDWDtBQUVPLDJCQUEyQixLQUFVO0FBQ3hDLFFBQU0sYUFBYSxjQUFjLEdBQUc7QUFDcEMsUUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsSUFDekMsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLElBQ1gsTUFBTSxXQUFXO0FBQUEsRUFDckIsQ0FBQztBQUNELFFBQU0sVUFBVSxTQUFTO0FBQ3pCLFNBQU87QUFDWDtBQUVBLDBDQUFpRCxLQUFVLFdBQXlCLFlBQXFCO0FBQ3JHLFFBQU0sV0FBVyxNQUFNLElBQUksbUJBQWtCLFNBQVM7QUFFdEQsUUFBTSxhQUFhLGNBQWMsS0FBSyxDQUFDLE1BQU0sV0FBVztBQUNwRCxVQUFNLFdBQVcsU0FBUyxvQkFBb0IsRUFBQyxNQUFNLE9BQU0sQ0FBQztBQUM1RCxXQUFPO0FBQUEsTUFDSCxNQUFNLFNBQVM7QUFBQSxNQUNmLE1BQU0sU0FBUztBQUFBLE1BQ2YsTUFBTSxjQUFjLFNBQVM7QUFBQSxJQUNqQztBQUFBLEVBQ0osQ0FBQztBQUVELFFBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLElBQ3pDLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYLE1BQU0sV0FBVztBQUFBLEVBQ3JCLENBQUM7QUFDRCxRQUFNLFVBQVUsU0FBUztBQUN6QixTQUFPO0FBQ1g7QUFHTyx3Q0FBd0MsTUFBcUIsS0FBVTtBQUUxRSxRQUFNLGFBQWEsY0FBYyxLQUFLLENBQUMsTUFBTSxRQUFRLFNBQVM7QUFDMUQsVUFBTSxXQUFXLEtBQUssb0JBQW9CLE1BQU0sTUFBTTtBQUN0RCxXQUFZLGlDQUNMLFdBREs7QUFBQSxNQUVSLE1BQU0sU0FBUyxXQUFXLFlBQVk7QUFBQSxJQUMxQztBQUFBLEVBQ0osQ0FBQztBQUVELFFBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLElBQ3pDLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYLE1BQU0sV0FBVztBQUFBLEVBQ3JCLENBQUM7QUFDRCxRQUFNLFVBQVUsU0FBUztBQUN6QixTQUFPO0FBQ1g7OztBRHpGQSx3QkFBK0IsTUFBYyxTQUF1QjtBQUNoRSxNQUFJO0FBQ0EsV0FBUSxPQUFNLE9BQU8sSUFBSSxHQUFHO0FBQUEsRUFDaEMsU0FBUSxLQUFOO0FBQ0UsbUNBQStCLFNBQVMsR0FBRztBQUFBLEVBQy9DO0FBQ0EsU0FBTztBQUNYOzs7QUVKQSxJQUFNLGNBQWM7QUFFcEIsd0JBQXdCLDBCQUFvRCxNQUE4QixRQUFnQyxVQUFrQixVQUF5QixRQUFjLFNBQWtCO0FBQ2pOLFFBQU0sU0FBUSxNQUFNLFNBQVMsYUFBYSxVQUFVLFFBQU0sT0FBTztBQUNqRSxTQUFPLElBQUksY0FBYyxFQUFFLGlCQUFrQixTQUFTLG9CQUFvQixXQUFXLE9BQU8sY0FBYTtBQUFBO0FBQUEsVUFFbkcsTUFBTSx5QkFBeUIsTUFBSztBQUFBLHdCQUN0QjtBQUFBO0FBQUEsU0FFZjtBQUNUO0FBRUEseUJBQXdDLFVBQWtCLE1BQXFCLFNBQXdCLGdCQUErQixrQkFBa0MsYUFBc0Q7QUFFMU4sbUJBQWlCLE1BQU0saUJBQWdCLGFBQWEsZ0JBQWdCLFVBQVUsV0FBVztBQUV6RixjQUFZLE9BQU8sYUFBYSxFQUFDLE9BQU8sS0FBSSxDQUFDO0FBRTdDLE1BQUksYUFBYSxNQUFNLFNBQ25CLFlBQVksc0JBQ1osUUFBUSxjQUFjLFFBQVEsU0FBUyxHQUN2QyxRQUFRLGNBQWMsVUFBVSxFQUFFLEdBQ2xDLFFBQVEsY0FBYyxZQUFZLEVBQUUsR0FDcEMsZ0JBQ0EsVUFDQSxZQUFZLFNBQVMsQ0FBQyxpQkFBZ0IsWUFBWSxXQUFXLENBQ2pFO0FBRUEsUUFBTSxZQUFZLFlBQVksbUJBQW1CLFVBQVUsU0FBUyxJQUFJO0FBQ3hFLE1BQUksaUJBQWdCLFlBQVksT0FBTyxLQUFLLGlCQUFnQixZQUFZLFFBQVEsR0FBRztBQUMvRSxjQUFVLFFBQVEsTUFBTSxTQUFTLFdBQVcsSUFBSSxjQUFjLENBQUM7QUFBQSxFQUNuRSxPQUFPO0FBQ0gsY0FBVSxpQkFBaUIsVUFBVTtBQUFBLEVBQ3pDO0FBRUEsU0FBTztBQUFBLElBQ0gsZ0JBQWdCLElBQUksY0FBYztBQUFBLEVBQ3RDO0FBQ0o7OztBQzdDQTtBQUNBO0FBR0Esd0NBQXVELE1BQWMsV0FBa0M7QUFDbkcsUUFBTSxNQUFNLE9BQU8sYUFBYSxXQUFXLEtBQUssTUFBTSxTQUFTLElBQUc7QUFFbEUsUUFBTSxZQUFZLElBQUksY0FBYyxNQUFNLElBQUk7QUFDOUMsUUFBTSxhQUFhLFVBQVUsTUFBTSxJQUFJO0FBQ3ZDLEVBQUMsT0FBTSxJQUFJLG1CQUFrQixHQUFHLEdBQUcsWUFBWSxPQUFLO0FBQ2hELFVBQU0sUUFBUSxXQUFXLEVBQUUsZ0JBQWdCO0FBQzNDLFFBQUksQ0FBQztBQUFPO0FBR1osUUFBSSxZQUFZO0FBQ2hCLGVBQVcsS0FBSyxNQUFNLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsSUFBRyxDQUFDLEVBQUUsYUFBYSxHQUFHO0FBQzFGLFFBQUUsT0FBTyxFQUFFO0FBQ1gsUUFBRSxPQUFPLEVBQUU7QUFDWCxRQUFFLE9BQU87QUFBQSxJQUNiO0FBQUEsRUFDSixDQUFDO0FBRUQsU0FBTztBQUNYO0FBRUEsZ0NBQWdDLFVBQXlCLFdBQTBCO0FBQy9FLFFBQU0sZ0JBQWdCLFNBQVMsTUFBTSxJQUFJO0FBQ3pDLGFBQVcsUUFBUSxVQUFVLGFBQWEsR0FBRztBQUN6QyxVQUFNLEVBQUMsTUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLLE9BQU8sSUFBSSxtQkFBbUIsY0FBYztBQUMzRixTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUNKO0FBRUEsOEJBQXFDLFVBQXlCLE1BQWMsV0FBa0M7QUFDMUcsUUFBTSxhQUFhLE1BQU0seUJBQXlCLE1BQU0sU0FBUztBQUNqRSx5QkFBdUIsVUFBVSxVQUFVO0FBQzNDLFNBQU87QUFDWDtBQUVBLG9DQUFvQyxVQUF5QixXQUEwQixVQUFrQjtBQUNyRyxRQUFNLGdCQUFnQixTQUFTLE1BQU0sSUFBSTtBQUN6QyxhQUFXLFFBQVEsVUFBVSxhQUFhLEdBQUc7QUFDekMsUUFBRyxLQUFLLFFBQVEsVUFBUztBQUNyQixZQUFNLEVBQUMsTUFBTSxNQUFNLFNBQVEsY0FBYyxLQUFLLE9BQU8sR0FBRyxHQUFHLEtBQUssT0FBSyxDQUFDLEdBQUcsbUJBQW1CLGNBQWM7QUFDMUcsV0FBSyxPQUFPO0FBQ1osV0FBSyxPQUFPO0FBQ1osV0FBSyxPQUFPO0FBQUEsSUFDaEIsV0FBVSxLQUFLLE1BQU07QUFDakIsV0FBSyxPQUFPLGNBQWMsU0FBUyxlQUFjLEtBQUssSUFBSSxDQUFDO0FBQUEsSUFDL0Q7QUFBQSxFQUNKO0FBQ0o7QUFDQSxpQ0FBd0MsVUFBeUIsTUFBYyxXQUFrQyxVQUFrQjtBQUMvSCxRQUFNLGFBQWEsTUFBTSx5QkFBeUIsTUFBTSxTQUFTO0FBQ2pFLDZCQUEyQixVQUFVLFlBQVksUUFBUTtBQUV6RCxTQUFPO0FBQ1g7OztBQzVEQTs7O0FDR08sSUFBTSxXQUFXO0FBRWpCLG9CQUFvQixNQUFnQjtBQUN2QyxPQUFLLFlBQVk7QUFBQSxJQUNiLGlCQUFpQjtBQUFBLElBQ2pCLG1CQUFtQjtBQUFBLEVBQ3ZCO0FBQ0EsT0FBSyxPQUFPLGFBQWE7QUFDekIsU0FBTztBQUNYO0FBRU8sc0JBQXNCLE1BQTRCO0FBQ3JELFNBQU8sV0FBVztBQUFBLElBQ2QsUUFBUTtBQUFBLEtBQ0wsS0FDTjtBQUNMO0FBRU8sa0JBQWtCLE1BQXVCO0FBQzVDLE9BQUssU0FBUztBQUFBLElBQ1YsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLEVBQ2hCO0FBQ0EsU0FBTztBQUNYOzs7QUR0QkEscUNBQTRDLGdCQUErQixVQUFrQixZQUFxQix1QkFBdUIsZUFBZSxJQUFJLFNBQXFCO0FBRTdLLE1BQUksYUFBYSxJQUFJO0FBRXJCLFFBQU0sYUFBK0IsU0FBUztBQUFBLElBQzFDLFVBQVUsZUFBZSxZQUFZO0FBQUEsSUFDckMsUUFBUSxZQUFZLFFBQVEsU0FBUyxZQUFZLENBQUMsS0FBSyxZQUFZLFFBQVE7QUFBQSxJQUMzRTtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0QsUUFBUTtBQUFBLE9BQ0w7QUFBQSxLQUVKLFVBQVUsa0JBQWtCLEVBQ2xDO0FBRUQsTUFBSTtBQUNBLFlBQVE7QUFBQSxXQUNDO0FBQ0QsbUJBQVcsV0FBVyxHQUFHLEVBQUUsU0FBUztBQUFBLFVBQ2hDLFFBQVE7QUFBQSxXQUNMLFVBQVUsV0FBVztBQUc1QjtBQUFBLFdBRUM7QUFDRCxtQkFBVyxJQUFJLFNBQVM7QUFBQSxVQUNwQixRQUFRO0FBQUEsVUFDUixLQUFLO0FBQUEsV0FDRixVQUFVLFlBQVk7QUFFN0I7QUFBQSxXQUVDO0FBQ0QsbUJBQVcsV0FBVyxHQUFHLEVBQUUsU0FBUztBQUFBLFVBQ2hDLFFBQVE7QUFBQSxVQUNSLEtBQUs7QUFBQSxXQUNGLFVBQVUsWUFBWTtBQUU3QjtBQUFBO0FBR1IsVUFBTSxFQUFFLEtBQUssU0FBUyxNQUFNLFVBQVUsc0JBQXNCLFVBQVU7QUFFdEUsaUJBQWE7QUFDYixnQkFBWTtBQUFBLEVBQ2hCLFNBQVMsS0FBUDtBQUNFLG1DQUErQixnQkFBZ0IsR0FBRztBQUFBLEVBQ3REO0FBRUEsU0FBTyxFQUFFLFlBQVksVUFBVTtBQUNuQzs7O0FFekRBO0FBT0EsMEJBQXdDLFVBQWtCLFVBQWtCLE1BQXFCLFNBQXdCLGdCQUEwRDtBQUUvSyxNQUFJLFVBQVU7QUFFZCxRQUFNLGlCQUFpQixJQUFJLG9CQUFvQixNQUFNO0FBQ3JELFFBQU0sZUFBZSxLQUFLLGdCQUFnQixRQUFRO0FBRWxELFFBQU0sMEJBQTBCLE1BQU0sZUFBZSxXQUFXO0FBRWhFLFFBQU0sRUFBQyxZQUFZLGNBQWEsTUFBTSxzQkFBc0IsZ0JBQWdCLFVBQVUsT0FBTyx5QkFBeUIsRUFBQyxxQkFBcUIsS0FBSSxDQUFDO0FBQ2pKLFlBQVUsZUFBZSxZQUFZLE1BQU0seUJBQXlCLFlBQVksU0FBUyxDQUFDO0FBRTFGLFNBQU87QUFBQSxJQUNILGdCQUFnQixJQUFJLGNBQWMsS0FBSyxlQUFlLEVBQUUsTUFBeEMsWUFBNkMsdUJBQWdDLEtBQVcsaUJBQWpDLFFBQVEsYUFBYSxHQUFLO0FBQUEsRUFDckc7QUFDSjs7O0FDaEJBLDBCQUF3QyxVQUFrQixTQUF3QixnQkFBZ0MsYUFBc0Q7QUFDcEssUUFBTSxtQkFBbUIsZUFBZSxJQUFJLHlCQUF5QixpQkFBaUIsS0FBSyxHQUFHLFVBQVUsUUFBUSxVQUFVLE1BQU0sS0FBSyxVQUFVLHFCQUFxQixVQUFVLGlCQUFpQjtBQUUvTCxNQUFJLFlBQVksTUFBTSxvQkFBb0IsU0FBUyxzQkFBc0I7QUFDckUsV0FBTztBQUFBLE1BQ0gsZ0JBQWdCLElBQUksY0FBYztBQUFBLElBQ3RDO0FBQ0osY0FBWSxNQUFNLG9CQUFvQixLQUFLLHNCQUFzQjtBQUVqRSxRQUFNLEVBQUMsWUFBWSxjQUFhLE1BQU0sc0JBQXNCLGdCQUFnQixVQUFVLFlBQVksS0FBSztBQUN2RyxRQUFNLFlBQVksWUFBWSxtQkFBbUIsVUFBVSxXQUFXLFVBQVUsU0FBUyxjQUFjO0FBRXZHLE1BQUksV0FBVztBQUNYLGNBQVUsOEJBQThCLEtBQUssTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLFVBQVU7QUFBQSxFQUM3RixPQUFPO0FBQ0gsY0FBVSxRQUFRLFVBQVU7QUFBQSxFQUNoQztBQUVBLFNBQU87QUFBQSxJQUNILGdCQUFnQixJQUFJLGNBQWM7QUFBQSxFQUN0QztBQUNKOzs7QUMzQkE7QUFVQSwwQkFBd0MsVUFBa0IsTUFBcUIsU0FBd0IsZ0JBQStCLGFBQXNEO0FBRXhMLE1BQUksUUFBUSxPQUFPLEtBQUs7QUFDcEIsV0FBTztBQUFBLE1BQ0gsZ0JBQWdCLElBQUksY0FBYyxLQUFLLGVBQWUsRUFBRSxNQUF4QyxjQUE2Qyx1QkFBZ0MsS0FBa0IsaUJBQXhDLFFBQVEsYUFBYSxHQUFLO0FBQUEsSUFDckc7QUFFSixRQUFNLFdBQVcsUUFBUSxjQUFjLFFBQVEsSUFBSTtBQUVuRCxNQUFJLFFBQVEsV0FBVyxRQUFRLEdBQUc7QUFDOUIsV0FBTyxXQUFpQixVQUFVLFVBQVUsTUFBTSxTQUFTLGNBQWM7QUFBQSxFQUM3RTtBQUVBLFNBQU8sV0FBaUIsVUFBVSxTQUFTLGdCQUFnQixXQUFXO0FBQzFFOzs7QUN4QkE7QUFHQTtBQVdPLHdCQUF3QixjQUFzQjtBQUNqRCxTQUFPO0FBQUEsSUFDSCxZQUFZLEtBQWE7QUFDckIsVUFBSSxJQUFJLE1BQU0sT0FBTyxJQUFJLE1BQU0sS0FBSztBQUNoQyxlQUFPLElBQUksSUFDUCxJQUFJLFVBQVUsQ0FBQyxHQUNmLGNBQWMsSUFBSSxNQUFNLE1BQU0sU0FBUyxPQUFPLEtBQUssU0FBUyxhQUFhLEVBQUUsQ0FDL0U7QUFBQSxNQUNKO0FBRUEsYUFBTyxJQUFJLElBQUksS0FBSyxjQUFjLFlBQVksQ0FBQztBQUFBLElBQ25EO0FBQUEsRUFDSjtBQUNKO0FBR0EsMEJBQTBCLFVBQTJCO0FBQ2pELFNBQVEsQ0FBQyxRQUFRLE1BQU0sRUFBRSxTQUFTLFFBQVEsSUFBSSxZQUFZLFVBQVUsU0FBUyxJQUFJLFlBQVksVUFBVSxRQUFRO0FBQ25IO0FBRU8sbUJBQW1CLFVBQWtCO0FBQ3hDLFNBQU8saUJBQWlCLFFBQVEsSUFBSSxlQUFlO0FBQ3ZEO0FBRU8sb0JBQW9CLFVBQW1DO0FBQzFELFNBQU8sWUFBWSxTQUFTLGFBQWE7QUFDN0M7QUFFTyx1QkFBdUIsV0FBeUIsUUFBZ0I7QUFDbkUsTUFBSSxDQUFDO0FBQVc7QUFDaEIsYUFBVyxLQUFLLFVBQVUsU0FBUztBQUMvQixRQUFJLFVBQVUsUUFBUSxHQUFHLFdBQVcsT0FBTyxHQUFHO0FBQzFDLGdCQUFVLFFBQVEsS0FBSztBQUFBLElBQzNCO0FBQUEsRUFDSjtBQUNKO0FBRU8sMEJBQTBCLEVBQUUsYUFBYTtBQUM1QyxRQUFNLE1BQU0sVUFBVSxNQUFNLGVBQWUsRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLElBQUksT0FBSyxPQUFPLENBQUMsQ0FBQztBQUM3RSxTQUFPLEVBQUUsTUFBTSxJQUFJLElBQUksUUFBUSxJQUFJLEdBQUc7QUFDMUM7QUFFTyx3QkFBd0IsS0FBVSxFQUFDLE1BQU0sV0FBVSxpQkFBaUIsR0FBRyxHQUFFO0FBQzVFLFFBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLElBQ3pDLE1BQU0sR0FBRyxJQUFJO0FBQUEsbUJBQThCLGVBQWMsSUFBSSxLQUFLLEdBQUcsS0FBSyxRQUFRLEtBQUssVUFBVTtBQUFBLElBQ2pHLFdBQVcsS0FBSyxVQUFVLElBQUksaUJBQWlCO0FBQUEsSUFDL0MsTUFBTSxLQUFLLFVBQVUsSUFBSSxTQUFTO0FBQUEsRUFDdEMsQ0FBQztBQUNELFFBQU0sVUFBVSxTQUFTO0FBQzdCO0FBRU8sK0JBQStCLEtBQVUsT0FBcUI7QUFDakUsTUFBRyxJQUFJLEtBQUs7QUFBSyxXQUFPLGVBQWUsR0FBRztBQUUxQyxNQUFJLFdBQVcsaUJBQWlCLEdBQUc7QUFFbkMsUUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsSUFDekMsTUFBTSxNQUFNLFVBQVUsR0FBRztBQUFBLElBQ3pCLFdBQVcsS0FBSyxVQUFVLElBQUksaUJBQWlCO0FBQUEsSUFDL0MsTUFBTSxLQUFLLFVBQVUsSUFBSSxTQUFTO0FBQUEsRUFDdEMsQ0FBQztBQUNELFFBQU0sVUFBVSxTQUFTO0FBQzdCO0FBRUEsMkJBQWtDLFVBQWtCLGdCQUErQixhQUEyQixXQUFXLGVBQWUsSUFBSTtBQUN4SSxRQUFNLFdBQVcsY0FBYyxrQkFBa0IsZUFBZSxZQUFZLEdBQ3hFLGNBQWMsY0FBYyxRQUFRLEdBQ3BDLGFBQWEsaUJBQWlCLFFBQVE7QUFFMUMsTUFBSTtBQUNKLE1BQUk7QUFDQSxhQUFTLE1BQU0sS0FBSyxtQkFBbUIsVUFBVTtBQUFBLE1BQzdDLFdBQVcsWUFBWTtBQUFBLE1BQ3ZCLFFBQVEsV0FBZ0IsUUFBUTtBQUFBLE1BQ2hDLE9BQU8sYUFBYSxlQUFlO0FBQUEsTUFDbkMsVUFBVSxlQUFlLFFBQVE7QUFBQSxNQUNqQyxRQUFRLEtBQUssT0FBTztBQUFBLElBQ3hCLENBQUM7QUFDRCxlQUFXLFFBQVEsT0FBTztBQUFBLEVBQzlCLFNBQVMsS0FBUDtBQUNFLFFBQUcsSUFBSSxLQUFLLEtBQUk7QUFDWixZQUFNLFdBQVcsZUFBYyxJQUFJLEtBQUssR0FBRztBQUMzQyxZQUFNLFlBQVksV0FBVyxjQUFjLFNBQVMsUUFBUSxHQUFHLFFBQVE7QUFBQSxJQUMzRTtBQUNBLDBCQUFzQixLQUFLLGNBQWM7QUFDekMsV0FBTyxFQUFDLFVBQVUsMkJBQTBCO0FBQUEsRUFDaEQ7QUFFQSxNQUFJLFFBQVEsWUFBWTtBQUNwQixlQUFXLFFBQVEsT0FBTyxZQUFZO0FBQ2xDLFlBQU0sV0FBVyxlQUFtQixJQUFJO0FBQ3hDLFlBQU0sWUFBWSxXQUFXLGNBQWMsU0FBUyxRQUFRLEdBQUcsUUFBUTtBQUFBLElBQzNFO0FBQUEsRUFDSjtBQUVBLFVBQVEsYUFBYSxjQUFjLE9BQU8sV0FBVyxZQUFZLElBQUk7QUFDckUsU0FBTyxFQUFFLFFBQVEsVUFBVSxXQUFXO0FBQzFDOzs7QUN2R0EsMEJBQXdDLFVBQWlCLFVBQWtCLE1BQXFCLFNBQXdCLGdCQUErQixhQUFzRDtBQUV6TSxRQUFNLGlCQUFpQixJQUFJLG9CQUFvQjtBQUMvQyxRQUFNLGVBQWUsS0FBSyxlQUFlLFVBQVUsR0FBRyxRQUFRO0FBRzlELE1BQUksRUFBRSxVQUFVLGVBQWUsTUFBTSxZQUFZLFVBQVUsZ0JBQWdCLGFBQWEsTUFBTSxlQUFlLFdBQVcsQ0FBQztBQUV6SCxNQUFJLENBQUM7QUFDRCxlQUFXO0FBQUEsRUFBSztBQUFBO0FBRXBCLFFBQU0sY0FBYyxlQUFlLFlBQVksSUFBSSxjQUFjLGVBQWUsV0FBVyxRQUFRLENBQUM7QUFFcEcsU0FBTztBQUFBLElBQ0gsZ0JBQWdCLElBQUksY0FBYyxLQUFLLGVBQWUsRUFBRSxjQUFjLFFBQVEsYUFBYSxLQUFLO0FBQUEsRUFDcEc7QUFDSjs7O0FDakJBLDBCQUF3QyxVQUFrQixTQUF3QixnQkFBK0IsYUFBc0Q7QUFDbkssUUFBTSxpQkFBaUIsZUFBZSxHQUFHLEtBQUs7QUFDOUMsTUFBSSxZQUFZLE1BQU0sTUFBTSxTQUFTLGNBQWM7QUFDL0MsV0FBTztBQUFBLE1BQ0gsZ0JBQWdCLElBQUksY0FBYztBQUFBLElBQ3RDO0FBQ0osY0FBWSxNQUFNLE1BQU0sS0FBSyxjQUFjO0FBRTNDLFFBQU0sRUFBRSxRQUFRLGFBQWEsTUFBTSxZQUFZLFVBQVUsZ0JBQWdCLFdBQVc7QUFFcEYsUUFBTSxZQUFZLFlBQVksbUJBQW1CLFNBQVMsU0FBVSxjQUFjO0FBRWxGLE1BQUksUUFBUTtBQUNSLGNBQVUsOEJBQThCLGVBQWUsZ0JBQXFCLE9BQU8sU0FBUyxHQUFHLGdCQUFnQixRQUFRO0FBQUE7QUFFdkgsY0FBVSxpQkFBaUIsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFakUsU0FBTztBQUFBLElBQ0gsZ0JBQWdCLElBQUksY0FBYztBQUFBLEVBQ3RDO0FBQ0o7OztBQ25CQSwwQkFBd0MsVUFBa0IsTUFBcUIsU0FBd0IsZ0JBQStCLGFBQXNEO0FBQ3hMLFFBQU0sV0FBVyxRQUFRLGNBQWMsUUFBUSxLQUFLO0FBRXBELE1BQUcsUUFBUSxXQUFXLFFBQVEsR0FBRTtBQUM1QixXQUFPLFdBQWdCLFVBQVUsVUFBVSxNQUFNLFNBQVMsZ0JBQWdCLFdBQVc7QUFBQSxFQUN6RjtBQUVBLFNBQU8sV0FBZ0IsVUFBVSxTQUFTLGdCQUFnQixXQUFXO0FBQ3pFOzs7QUNYQTs7O0FDQUEsc0JBQStCO0FBQUEsRUFJM0IsWUFBWSxVQUFrQixXQUFXLE1BQU07QUFGL0MsaUJBQXNCLENBQUM7QUFHbkIsU0FBSyxXQUFXLEdBQUcsY0FBYztBQUNqQyxnQkFBWSxLQUFLLFNBQVM7QUFFMUIsWUFBUSxHQUFHLFVBQVUsWUFBWTtBQUM3QixZQUFNLEtBQUssS0FBSztBQUNoQixpQkFBVyxNQUFNLFFBQVEsS0FBSyxDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLEVBQ0w7QUFBQSxRQUVNLFdBQVc7QUFDYixRQUFJLE1BQU0sZUFBTyxXQUFXLEtBQUssUUFBUTtBQUNyQyxXQUFLLFFBQVEsS0FBSyxNQUFNLE1BQU0sZUFBTyxTQUFTLEtBQUssUUFBUSxLQUFLLElBQUk7QUFBQSxFQUM1RTtBQUFBLEVBRUEsT0FBTyxLQUFhLE9BQVk7QUFDNUIsU0FBSyxNQUFNLE9BQU87QUFBQSxFQUN0QjtBQUFBLEVBUUEsS0FBSyxLQUFhLFFBQXVCO0FBQ3JDLFFBQUksT0FBTyxLQUFLLE1BQU07QUFDdEIsUUFBSSxRQUFRLENBQUM7QUFBUSxhQUFPO0FBRTVCLFdBQU8sT0FBTztBQUNkLFNBQUssT0FBTyxLQUFLLElBQUk7QUFFckIsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVBLFFBQVE7QUFDSixlQUFXLEtBQUssS0FBSyxPQUFPO0FBQ3hCLFdBQUssTUFBTSxLQUFLO0FBQ2hCLGFBQU8sS0FBSyxNQUFNO0FBQUEsSUFDdEI7QUFBQSxFQUNKO0FBQUEsRUFFQSxPQUFPO0FBQ0gsV0FBTyxlQUFPLGNBQWMsS0FBSyxVQUFVLEtBQUssS0FBSztBQUFBLEVBQ3pEO0FBQ0o7OztBQ2pETyxJQUFNLFdBQVcsSUFBSSxVQUFVLFdBQVc7QUFTakQscUNBQTRDLFFBQWEsZUFBZ0MsU0FBUyxNQUFNLFNBQU87QUFDM0csYUFBVyxLQUFLLGNBQWM7QUFDMUIsVUFBTSxXQUFXLGNBQWMsa0JBQXFCLE1BQUssYUFBYSxTQUFNO0FBQzVFLFFBQUksTUFBTSxlQUFPLEtBQUssVUFBVSxXQUFXLElBQUksS0FBSyxhQUFhLElBQUk7QUFDakUsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBRUEsU0FBTyxDQUFDO0FBQ1o7OztBRlRBLDBCQUEwQixXQUFtQixXQUFtQjtBQUM1RCxNQUFJLFVBQVUsTUFBTSxLQUFLO0FBQ3JCLGdCQUFZLFVBQVUsS0FBSyxXQUFXLFFBQVEsU0FBUztBQUFBLEVBQzNEO0FBRUEsTUFBSSxDQUFDLFVBQVUsUUFBUSxTQUFTO0FBQzVCLGlCQUFhLE1BQU0sY0FBYyxVQUFVO0FBRS9DLFNBQU87QUFDWDtBQUVBLElBQU0sV0FBeUYsQ0FBQztBQUNoRywwQkFBd0MsVUFBa0IsTUFBcUIsU0FBd0IsZ0JBQStCLGtCQUFrQyxhQUFzRDtBQUMxTixRQUFNLFdBQVcsUUFBUSxlQUFlLE1BQU07QUFFOUMsUUFBTSxXQUFXLGlCQUFpQixVQUFVLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDO0FBRS9FLFFBQU0sV0FBVyxTQUFTLE9BQU8sS0FBSyxVQUFVLFlBQVksU0FBUyxPQUFPLEtBQUssTUFBTTtBQUV2RixNQUFJLENBQUUsT0FBTSxlQUFPLEtBQUssVUFBVSxNQUFNLElBQUksR0FBRyxTQUFTLEdBQUc7QUFDdkQsVUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsTUFDekMsTUFBTTtBQUFBLHlCQUE0QixLQUFLLEdBQUcsQ0FBQyxFQUFFLGVBQWU7QUFBQSxNQUM1RCxXQUFXO0FBQUEsTUFDWCxNQUFNO0FBQUEsSUFDVixDQUFDO0FBQ0QsVUFBTSxVQUFVLFNBQVM7QUFFekIsV0FBTztBQUFBLE1BQ0gsZ0JBQWdCLElBQUksY0FBYyxLQUFLLGlCQUFpQixTQUFTLFdBQVcsbUJBQW1CLGNBQWMsU0FBUyxLQUFLLFFBQVEsUUFBUSxXQUFXLENBQUM7QUFBQSxJQUMzSjtBQUFBLEVBQ0o7QUFFQSxNQUFJO0FBRUosUUFBTSxZQUFZLFNBQVM7QUFDM0IsTUFBSSxDQUFDLGFBQWEsTUFBTSxzQkFBc0IsTUFBTSxVQUFVLFdBQVcsWUFBWSxHQUFHO0FBQ3BGLFVBQU0sRUFBRSxjQUFjLGFBQWEsZUFBZSxNQUFNLGtCQUFrQixVQUFVLFNBQVMsUUFBUSxFQUFFLFlBQVksVUFBVSxnQkFBZ0IsUUFBUSxlQUFlLFFBQVEsRUFBRSxDQUFDO0FBQy9LLGVBQVcsYUFBYSxhQUFhLFdBQVcsYUFBYTtBQUM3RCxXQUFPLFdBQVcsYUFBYTtBQUUvQixnQkFBWSxRQUFRLFVBQVU7QUFFOUIsYUFBUyxZQUFZLEVBQUUsY0FBMkMsV0FBVztBQUM3RSxpQkFBNEI7QUFBQSxFQUNoQyxPQUFPO0FBQ0gsVUFBTSxFQUFFLGNBQWMsZUFBZSxTQUFTO0FBRTlDLFdBQU8sT0FBTyxZQUFZLGNBQWMsV0FBVyxZQUFZO0FBQy9ELGdCQUFZLFFBQVEsVUFBVTtBQUU5QixpQkFBYTtBQUFBLEVBQ2pCO0FBRUEsU0FBTztBQUFBLElBQ0gsZ0JBQWdCO0FBQUEsRUFDcEI7QUFDSjs7O0FHbkVBLHVCQUFzQyxnQkFBMEQ7QUFDNUYsUUFBTSxpQkFBaUIsSUFBSSxjQUFjLGVBQWUsU0FBUztBQUVqRSxpQkFBZSxhQUFjO0FBRTdCLFNBQU87QUFBQSxJQUNIO0FBQUEsSUFDQSxpQkFBaUI7QUFBQSxFQUNyQjtBQUNKOzs7QUNSQTs7O0FDSmUsa0JBQWtCLE1BQWMsTUFBTSxJQUFHO0FBQ3BELFNBQU8sT0FBTyxLQUFLLElBQUksRUFBRSxTQUFTLFFBQVEsRUFBRSxVQUFVLEdBQUcsR0FBRyxFQUFFLFFBQVEsTUFBTSxHQUFHLEVBQUUsUUFBUSxNQUFNLEdBQUc7QUFDdEc7OztBQ0ZBOzs7QUNDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBOzs7QUNFZSxzQkFBVSxRQUFhO0FBQ2xDLFNBQU8sZUFBTyxhQUFhLE1BQUk7QUFDbkM7OztBQ0pBO0FBRUEsNEJBQStCLFFBQWM7QUFDekMsUUFBTSxjQUFhLElBQUksWUFBWSxPQUFPLE1BQU0sVUFBUyxTQUFTLE1BQUksQ0FBQztBQUN2RSxRQUFNLGdCQUFlLElBQUksWUFBWSxTQUFTLGFBQVksQ0FBQyxDQUFDO0FBQzVELFNBQU8sY0FBYTtBQUN4Qjs7O0FDSE8sSUFBTSxjQUFjLENBQUMsUUFBUSxNQUFNO0FBRTFDLGlDQUFnRCxRQUFjLE1BQWE7QUFDdkUsVUFBTztBQUFBLFNBQ0U7QUFDRCxhQUFPLGFBQUssTUFBSTtBQUFBLFNBQ2Y7QUFDRCxhQUFPLGFBQUssTUFBSTtBQUFBO0FBRWhCLGFBQU8sT0FBTztBQUFBO0FBRTFCOzs7QUNWQSx1QkFBZ0M7QUFBQSxRQUd0QixLQUFLLE1BQWM7QUFDckIsVUFBTSxhQUFhLE1BQU0sZ0JBQWdCLElBQUk7QUFDN0MsU0FBSyxRQUFRLElBQUksa0JBQWtCLFVBQVU7QUFFN0MsU0FBSyxxQkFBcUIsS0FBSyxtQkFBbUIsS0FBSyxJQUFJO0FBQzNELFNBQUssd0JBQXdCLEtBQUssc0JBQXNCLEtBQUssSUFBSTtBQUFBLEVBQ3JFO0FBQUEsRUFFUSxtQkFBbUIsZUFBdUIsWUFBb0IsT0FBZTtBQUNqRixXQUFPLFNBQVMsc0JBQXNCLG1CQUFtQjtBQUFBLEVBQzdEO0FBQUEsRUFFUSxtQkFBbUIsZUFBdUIsWUFBb0IsT0FBZTtBQUNqRixXQUFPLEdBQUcsS0FBSyxtQkFBbUIsZUFBZSxZQUFZLEtBQUssNEJBQTRCO0FBQUEsRUFDbEc7QUFBQSxFQUVRLHNCQUFzQixlQUF1QixPQUFlO0FBQ2hFLFdBQU8sU0FBUyxtQkFBbUI7QUFBQSxFQUN2QztBQUFBLEVBRVEsc0JBQXNCLGVBQXVCLE9BQWU7QUFDaEUsV0FBTywwQkFBMEIsS0FBSyxzQkFBc0IsZUFBZSxLQUFLO0FBQUEsRUFDcEY7QUFBQSxFQUVRLGdCQUFnQixNQUFjLGdCQUFnQixNQUFNLGVBQXFGLEtBQUssb0JBQW9CO0FBQ3RLLFFBQUksZUFBZTtBQUNuQixRQUFJLFlBQVksS0FBSyxNQUFNO0FBQzNCLFFBQUk7QUFFSix1QkFBbUI7QUFDZixjQUFRLFVBQVUsTUFBTSxJQUFJLE9BQU8sR0FBRyx3RkFBd0YsR0FBRyxDQUFDO0FBQUEsSUFDdEk7QUFFQSxZQUFRO0FBRVIsV0FBTyxPQUFPO0FBQ1YsWUFBTSxPQUFPLE1BQU0sR0FBRyxLQUFLO0FBQzNCLHNCQUFnQixVQUFVLFVBQVUsR0FBRyxNQUFNLEtBQUs7QUFDbEQsa0JBQVksVUFBVSxVQUFVLE1BQU0sUUFBUSxNQUFNLEdBQUcsTUFBTTtBQUU3RCxVQUFJO0FBRUosVUFBSSxLQUFLLE1BQU0sS0FBSztBQUNoQixxQkFBYSxLQUFLLFVBQVUsQ0FBQyxFQUFFLFFBQVEsUUFBUSxFQUFFLEVBQUUsVUFBVTtBQUFBLE1BQ2pFLE9BQU87QUFDSCxZQUFJLFVBQW9CLENBQUM7QUFFekIsWUFBSSxLQUFLLE1BQU0sS0FBSztBQUNoQixvQkFBVSxLQUFLLE1BQU0sS0FBSyxDQUFDO0FBQzNCLGtCQUFRLE1BQU07QUFDZCxjQUFJLFFBQVE7QUFDUixvQkFBUSxLQUFLLFFBQVEsR0FBRyxNQUFNLEdBQUcsRUFBRSxJQUFJO0FBQUEsUUFDL0MsT0FBTztBQUNILG9CQUFVLEtBQUssTUFBTSxLQUFLLENBQUMsRUFBRSxRQUFRO0FBQUEsUUFDekM7QUFFQSxrQkFBVSxRQUFRLElBQUksT0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sT0FBSyxFQUFFLE1BQU07QUFFekQsWUFBSSxRQUFRLFVBQVUsR0FBRztBQUNyQixjQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUs7QUFDdEIseUJBQWEsUUFBUTtBQUFBLFVBQ3pCLE9BQU87QUFDSCxnQkFBSSxZQUFZLEtBQUssTUFBTSxVQUFVLE1BQU07QUFDM0Msd0JBQVksVUFBVSxVQUFVLFVBQVUsWUFBWSxHQUFHLElBQUksR0FBRyxVQUFVLFNBQVMsQ0FBQztBQUNwRixnQkFBSSxZQUFZLFNBQVMsU0FBUztBQUM5QiwyQkFBYSxRQUFRO0FBQUE7QUFFckIsMkJBQWEsWUFBWSxRQUFRO0FBQUEsVUFDekM7QUFBQSxRQUNKLE9BQU87QUFFSCx1QkFBYSxRQUFRO0FBRXJCLHVCQUFhLEdBQUcsV0FBVyxVQUFVLEdBQUcsV0FBVyxTQUFTLENBQUMsYUFBYSxRQUFRO0FBQUEsUUFDdEY7QUFFQSxxQkFBYSxXQUFXLFFBQVEsUUFBUSxHQUFHO0FBQUEsTUFDL0M7QUFFQSxzQkFBZ0IsYUFBYSxlQUFlLFlBQVksTUFBTSxFQUFFO0FBRWhFLGNBQVE7QUFBQSxJQUNaO0FBRUEsb0JBQWdCO0FBRWhCLFNBQUssTUFBTSxnQkFBZ0I7QUFBQSxFQUMvQjtBQUFBLEVBRVEsZUFBZSxNQUFjLGdCQUFnQixNQUFNLGVBQWlFLEtBQUssdUJBQXVCO0FBQ3BKLFFBQUksZUFBZTtBQUNuQixRQUFJLFlBQVksS0FBSyxNQUFNO0FBQzNCLFFBQUk7QUFFSix1QkFBbUI7QUFDZixjQUFRLFVBQVUsTUFBTSxJQUFJLE9BQU8sT0FBTyw0QkFBNEIsQ0FBQztBQUFBLElBQzNFO0FBRUEsWUFBUTtBQUVSLFdBQU8sT0FBTztBQUNWLHNCQUFnQixVQUFVLFVBQVUsR0FBRyxNQUFNLEtBQUs7QUFDbEQsa0JBQVksVUFBVSxVQUFVLE1BQU0sUUFBUSxNQUFNLEdBQUcsTUFBTTtBQUc3RCxzQkFBZ0IsYUFBYSxlQUFlLE1BQU0sRUFBRTtBQUVwRCxjQUFRO0FBQUEsSUFDWjtBQUVBLG9CQUFnQjtBQUVoQixTQUFLLE1BQU0sZ0JBQWdCO0FBQUEsRUFDL0I7QUFBQSxFQUVRLGlCQUFpQixNQUFnQztBQUNyRCxTQUFLLE1BQU0sZ0JBQWdCLEtBQUssTUFBTSxLQUFLLE1BQU0sYUFBYSxFQUFFLFVBQVUsQ0FBQztBQUFBLEVBQy9FO0FBQUEsRUFFUSxPQUFPLE1BQWlDO0FBQzVDLGVBQVcsQ0FBQyxLQUFLLFVBQVUsT0FBTyxRQUFRLElBQUksR0FBRztBQUM3QyxXQUFLLGlCQUFpQixVQUFRLEtBQUssUUFBUSxJQUFJLE9BQU8sY0FBYyxrQkFBa0IsS0FBSyxHQUFHLElBQUksVUFBVTtBQUN4RyxlQUFPLE1BQU0sS0FBSyxRQUFRLE1BQU07QUFBQSxNQUNwQyxDQUFDLENBQUM7QUFBQSxJQUNOO0FBQUEsRUFDSjtBQUFBLEVBRVEsa0JBQWtCLE1BQWMsUUFBZ0I7QUFDcEQsU0FBSyxpQkFBaUIsVUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLGNBQWMsb0JBQW9CLEtBQUssR0FBRyxJQUFJLFVBQVU7QUFDMUcsYUFBTyxNQUFNLEtBQUssU0FBUyxNQUFNO0FBQUEsSUFDckMsQ0FBQyxDQUFDO0FBQUEsRUFDTjtBQUFBLFFBRWMsaUJBQWdCO0FBQzFCLFFBQUksWUFBWSxLQUFLLE1BQU07QUFDM0IsUUFBSTtBQUVKLHVCQUFtQjtBQUNmLGNBQVEsVUFBVSxNQUFNLGdFQUFnRTtBQUFBLElBQzVGO0FBRUEsWUFBUTtBQUVSLFdBQU8sT0FBTztBQUNWLFlBQU0sY0FBYyxVQUFVLFVBQVUsR0FBRyxNQUFNLEtBQUs7QUFDdEQsWUFBTSxlQUFlLE1BQU0sR0FBRyxVQUFVLE1BQU0sR0FBRyxNQUFNO0FBQ3ZELFlBQU0sYUFBYSxVQUFVLFVBQVUsTUFBTSxRQUFRLE1BQU0sR0FBRyxNQUFNO0FBRXBFLFVBQUksYUFBYSxNQUFNLGtCQUFrQixZQUFXLENBQUMsS0FBSyxJQUFJLENBQUM7QUFFL0QsVUFBRyxjQUFjLElBQUc7QUFDaEIscUJBQWEsV0FBVztBQUFBLE1BQzVCO0FBRUEsWUFBTSxjQUFjLFdBQVcsVUFBVSxHQUFHLFVBQVUsR0FBRyxhQUFhLFdBQVcsVUFBVSxVQUFVO0FBRXJHLGtCQUFZLEdBQUcsY0FBYyxlQUFjLHVCQUF1QixNQUFNLE1BQU0sTUFBTSxLQUFLO0FBRXpGLGNBQVE7QUFBQSxJQUNaO0FBRUEsU0FBSyxNQUFNLGdCQUFnQjtBQUFBLEVBQy9CO0FBQUEsUUFFYyxjQUFhO0FBQ3ZCLFFBQUksWUFBWSxLQUFLLE1BQU07QUFDM0IsUUFBSTtBQUVKLHVCQUFtQjtBQUNmLGNBQVEsVUFBVSxNQUFNLHlDQUF5QztBQUFBLElBQ3JFO0FBRUEsWUFBUTtBQUVSLFdBQU8sT0FBTztBQUNWLFVBQUksY0FBYyxVQUFVLFVBQVUsR0FBRyxNQUFNLEtBQUs7QUFDcEQsVUFBSSxlQUFlLE1BQU0sR0FBRyxVQUFVLE1BQU0sR0FBRyxTQUFVLE9BQU0sTUFBTSxJQUFJLE1BQU07QUFFL0UsWUFBTSxZQUFZLE1BQU0sR0FBRyxJQUFJLFlBQVksUUFBUSxNQUFNLEVBQUU7QUFDM0QsVUFBRyxhQUFZLEtBQUk7QUFDZixZQUFJLGFBQWEsVUFBVSxVQUFVLE1BQU0sUUFBUSxNQUFNLEdBQUcsTUFBTTtBQUVsRSxZQUFHLFdBQVU7QUFDVCxzQkFBWSxjQUFjLHFCQUFxQixlQUFlO0FBQUEsUUFDbEUsT0FBTztBQUNILGdCQUFNLFdBQVcsTUFBTSxXQUFXLFlBQVksQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUN4RCx5QkFBZSwwQkFBMEIsZUFBZSxXQUFXLFVBQVUsR0FBRyxXQUFTLENBQUM7QUFDMUYsc0JBQVksY0FBYyxXQUFXLFVBQVUsV0FBUyxDQUFDO0FBQUEsUUFDN0Q7QUFBQSxNQUNKLE9BQU87QUFDSCxZQUFJLGFBQWEsVUFBVSxVQUFVLE1BQU0sUUFBUSxNQUFNLEdBQUcsU0FBTyxDQUFDO0FBQ3BFLHVCQUFlLGFBQWEsTUFBTSxHQUFHLEVBQUU7QUFFdkMsWUFBSSxhQUFhLE1BQU0sa0JBQWtCLFlBQVcsQ0FBQyxLQUFLLElBQUksQ0FBQztBQUMvRCxZQUFHLGNBQWMsSUFBRztBQUNoQix1QkFBYSxXQUFXLFFBQVEsRUFBRTtBQUFBLFFBQ3RDO0FBRUEsY0FBTSxjQUFjLFdBQVcsVUFBVSxHQUFHLFVBQVU7QUFDdEQsY0FBTSxhQUFhLFlBQVksTUFBTSxxREFBcUQ7QUFFMUYsWUFBRyxhQUFhLElBQUc7QUFDZixnQkFBTSxhQUFhLFdBQVcsVUFBVSxVQUFVO0FBRWxELHNCQUFZLEdBQUcsY0FBYyxlQUFjLHNCQUFzQixZQUFZLFlBQVcsV0FBVyxNQUFNLFdBQVcsS0FBSztBQUFBLFFBQzdILFdBQVUsV0FBVTtBQUNoQixzQkFBWSxjQUFjLHFCQUFxQixlQUFlO0FBQUEsUUFDbEUsT0FBTztBQUNILHNCQUFZLEdBQUcsc0JBQXNCLFlBQVksTUFBTSxRQUFRLENBQUMsRUFBRSxJQUFJLEtBQUssZUFBYztBQUFBLFFBQzdGO0FBQUEsTUFDSjtBQUVBLGNBQVE7QUFBQSxJQUNaO0FBRUEsU0FBSyxNQUFNLGdCQUFnQjtBQUFBLEVBQy9CO0FBQUEsUUFFTSxhQUFhLFlBQXdDO0FBQ3ZELFNBQUssZ0JBQWdCLFVBQVUsU0FBUztBQUN4QyxTQUFLLGdCQUFnQixVQUFVLFdBQVcsS0FBSyxrQkFBa0I7QUFDakUsU0FBSyxnQkFBZ0IsU0FBUztBQUU5QixTQUFLLGVBQWUsVUFBVSxTQUFTO0FBQ3ZDLFNBQUssZUFBZSxVQUFVLFdBQVcsS0FBSyxxQkFBcUI7QUFDbkUsU0FBSyxlQUFlLFNBQVM7QUFFN0IsU0FBSyxrQkFBa0IsVUFBVSxTQUFTO0FBRzFDLFVBQU0sS0FBSyxlQUFlO0FBQzFCLFVBQU0sS0FBSyxZQUFZO0FBRXZCLGtCQUFjLEtBQUssT0FBTyxVQUFVO0FBQUEsRUFDeEM7QUFBQSxFQUVBLGNBQWM7QUFDVixXQUFPLEtBQUssTUFBTSxVQUFVO0FBQUEsRUFDaEM7QUFBQSxlQUVhLHNCQUFzQixNQUFjLFlBQXdDO0FBQ3JGLFVBQU0sVUFBVSxJQUFJLFdBQVc7QUFDL0IsVUFBTSxRQUFRLEtBQUssSUFBSSxPQUFPO0FBQzlCLFVBQU0sUUFBUSxhQUFhLFVBQVU7QUFFckMsV0FBTyxRQUFRLFlBQVk7QUFDM0IsV0FBTyxLQUFLLFVBQVUsR0FBRyxLQUFLLFNBQVMsQ0FBQztBQUFBLEVBQzVDO0FBQ0o7OztBSm5QQSx1QkFBdUIsTUFBYztBQUVqQyxTQUFPLDhFQUE4RSxTQUFTLFdBQVcsaUJBQWlCLE9BQU87QUFDckk7QUFRQSwyQkFBMEMsTUFBcUIsY0FBdUIsYUFBbUQ7QUFDckksU0FBTyxLQUFLLEtBQUs7QUFFakIsUUFBTSxVQUE0QixTQUFTO0FBQUEsSUFDdkMsS0FBSyxhQUFhO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDSixRQUFRLGVBQWUsZUFBZTtBQUFBLFNBQ25DLFVBQVcsZ0JBQWUsT0FBTyxRQUFRLFNBQVM7QUFBQSxJQUU3RCxDQUFDO0FBQUEsSUFDRCxVQUFVLFlBQVk7QUFBQSxJQUN0QixZQUFZO0FBQUEsRUFDaEIsQ0FBQztBQUVELE1BQUk7QUFFSixRQUFNLGVBQWUsTUFBTSxXQUFXLHNCQUFzQixLQUFLLElBQUksRUFBRSxPQUFPLEtBQUssWUFBWSxNQUFNLENBQUM7QUFFdEcsTUFBSTtBQUNBLFVBQU0sRUFBRSxNQUFNLFFBQVEsTUFBTSxXQUFVLGNBQWMsT0FBTztBQUMzRCxhQUFTLE1BQU0sTUFBTSxlQUFlLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxjQUFjLE1BQU0sSUFBSTtBQUFBLEVBQ3ZGLFNBQVMsS0FBUDtBQUNFLFVBQU0sU0FBUSwrQkFBK0IsTUFBTSxHQUFHO0FBRXRELFFBQUksWUFBWSxPQUFPO0FBQ25CLGFBQU0sWUFBYSxjQUFjLFNBQVMsT0FBTSxTQUFTO0FBQ3pELGVBQVMsSUFBSSxjQUFjLE1BQU0sY0FBYyxPQUFNLGFBQWEsQ0FBQztBQUFBLElBQ3ZFO0FBQUEsRUFDSjtBQUVBLFNBQU87QUFDWDs7O0FLWEEsSUFBTSxrQkFBa0IsSUFBSSxVQUFVLGtCQUFrQjtBQUdqRCx5QkFBbUI7QUFBQSxFQXFCdEIsWUFBbUIsV0FBMEIsVUFBeUIsVUFBMEIsT0FBeUIsWUFBc0I7QUFBNUg7QUFBMEI7QUFBeUI7QUFBMEI7QUFBeUI7QUFwQnpILDBCQUFpQyxDQUFDO0FBQzFCLHdCQUFpQyxDQUFDO0FBQ2xDLHVCQUFnQyxDQUFDO0FBQ2pDLHlCQUFnRyxDQUFDO0FBQ3pHLG9CQUFXO0FBQ1gsaUJBQW9CO0FBQUEsTUFDaEIsT0FBTyxDQUFDO0FBQUEsTUFDUixRQUFRLENBQUM7QUFBQSxNQUNULGNBQWMsQ0FBQztBQUFBLElBQ25CO0FBQ0EsOEJBQTBCLENBQUM7QUFDM0IsMEJBQWlDLENBQUM7QUFDbEMsK0JBQW9DLENBQUM7QUFDckMsd0JBQWdDLENBQUM7QUFDakMsdUJBQXdCLENBQUM7QUFPckIsU0FBSyx1QkFBdUIsS0FBSyxxQkFBcUIsS0FBSyxJQUFJO0FBQUEsRUFDbkU7QUFBQSxNQU5JLFlBQVk7QUFDWixXQUFPLEtBQUssU0FBUyxLQUFLO0FBQUEsRUFDOUI7QUFBQSxFQU1BLE1BQU0sS0FBYSxZQUEyQjtBQUMxQyxRQUFJLEtBQUssWUFBWSxLQUFLLE9BQUssRUFBRSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsVUFBVSxLQUFLLEtBQUssVUFBVSxVQUFVLENBQUM7QUFBRztBQUM1RyxTQUFLLFlBQVksS0FBSyxFQUFFLEtBQUssV0FBVyxDQUFDO0FBQUEsRUFDN0M7QUFBQSxFQUVBLE9BQU8sS0FBYSxZQUEyQjtBQUMzQyxRQUFJLEtBQUssYUFBYSxLQUFLLE9BQUssRUFBRSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsVUFBVSxLQUFLLEtBQUssVUFBVSxVQUFVLENBQUM7QUFBRztBQUM3RyxTQUFLLGFBQWEsS0FBSyxFQUFFLEtBQUssV0FBVyxDQUFDO0FBQUEsRUFDOUM7QUFBQSxFQUVBLE9BQU8sTUFBYztBQUNqQixRQUFJLENBQUMsS0FBSyxZQUFZLFNBQVMsSUFBSTtBQUMvQixXQUFLLFlBQVksS0FBSyxJQUFJO0FBQUEsRUFDbEM7QUFBQSxRQUVNLFdBQVcsV0FBbUIsV0FBVyxjQUFjLGtCQUFrQixXQUFXO0FBQ3RGLFFBQUksS0FBSyxhQUFhO0FBQVk7QUFFbEMsVUFBTSxVQUFVLE1BQU0sZUFBTyxLQUFLLFVBQVUsV0FBVyxNQUFNLElBQUk7QUFDakUsUUFBSSxTQUFTO0FBQ1QsV0FBSyxhQUFhLGFBQWE7QUFDL0IsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQUEsRUFFQSxlQUFlLE1BQXFDLFlBQVksS0FBSyxXQUFXO0FBQzVFLFFBQUksT0FBTyxLQUFLLGNBQWMsS0FBSyxPQUFLLEVBQUUsUUFBUSxRQUFRLEVBQUUsUUFBUSxTQUFTO0FBQzdFLFFBQUksQ0FBQyxNQUFNO0FBQ1AsYUFBTyxFQUFFLE1BQU0sTUFBTSxXQUFXLE9BQU8sSUFBSSxlQUFlLFdBQVcsS0FBSyxXQUFXLFFBQVEsU0FBUyxJQUFJLEVBQUU7QUFDNUcsV0FBSyxjQUFjLEtBQUssSUFBSTtBQUFBLElBQ2hDO0FBRUEsV0FBTyxLQUFLO0FBQUEsRUFDaEI7QUFBQSxFQUVBLG1CQUFtQixNQUFxQyxTQUF3QixNQUFxQjtBQUNqRyxXQUFPLEtBQUssZUFBZSxNQUFNLFFBQVEsVUFBVSxNQUFNLElBQUksS0FBSyxZQUFZLEtBQUssWUFBWSxDQUFDO0FBQUEsRUFDcEc7QUFBQSxTQUdlLFdBQVcsTUFBYztBQUNwQyxRQUFJLFNBQVM7QUFDYixRQUFJO0FBRUosVUFBTSxTQUFTLE9BQU8sT0FBTyxnQkFBZ0IsS0FBSztBQUNsRCxXQUFPLE9BQU8sUUFBUSxPQUFPLFNBQVMsR0FBRyxHQUFHO0FBQ3hDLFlBQU0sU0FBUyxNQUFNLElBQUksTUFBTSxFQUFFLFVBQVUsTUFBTTtBQUNqRDtBQUFBLElBQ0o7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLFFBRWMsY0FBYztBQUN4QixVQUFNLFVBQVUsS0FBSyxZQUFZLFNBQVMsS0FBSztBQUMvQyxlQUFXLEtBQUssS0FBSyxlQUFlO0FBQ2hDLFlBQU0sUUFBUSxXQUFXLEVBQUUsUUFBUSxLQUFLO0FBQ3hDLFlBQU0sZUFBZSxRQUFRLFNBQVMsS0FBSyxLQUFLLFNBQVMsT0FBTyxJQUFJLFdBQVcsUUFBUSxTQUFTO0FBQ2hHLFVBQUksTUFBTSxnQkFBZ0IsS0FBSyxFQUFFLE1BQU0sTUFBTSxhQUFhLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSTtBQUVoRixjQUFRLEVBQUU7QUFBQSxhQUNEO0FBQ0QsaUJBQU87QUFDUCxlQUFLLE9BQU8sTUFBTSxNQUFNLFVBQVUsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNqRDtBQUFBLGFBQ0M7QUFDRCxpQkFBTztBQUNQLGVBQUssT0FBTyxNQUFNLE1BQU0sVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3BEO0FBQUEsYUFDQztBQUNELGlCQUFPO0FBQ1AsZUFBSyxNQUFNLE1BQU0sTUFBTSxRQUFRO0FBQy9CO0FBQUE7QUFHUixxQkFBTyxVQUFVLGVBQWUsS0FBSyxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUFBLElBQzFFO0FBQUEsRUFDSjtBQUFBLFFBRU0sWUFBWTtBQUNkLFVBQU0sS0FBSyxZQUFZO0FBRXZCLFVBQU0saUJBQWlCLENBQUMsTUFBc0IsRUFBRSxhQUFhLE1BQU0sT0FBTyxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksT0FBSyxFQUFFLFdBQVcsS0FBSyxJQUFJLEtBQUssRUFBRSxXQUFXLFFBQVEsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJO0FBRXJLLFFBQUksb0JBQW9CO0FBQ3hCLGVBQVcsS0FBSyxLQUFLO0FBQ2pCLDJCQUFxQixnQ0FBZ0MsRUFBRSxPQUFPLGVBQWUsQ0FBQztBQUNsRixlQUFXLEtBQUssS0FBSztBQUNqQiwyQkFBcUIsZ0JBQWdCLEVBQUUsT0FBTyxlQUFlLENBQUM7QUFFbEUsV0FBTyxvQkFBb0IsS0FBSztBQUFBLEVBQ3BDO0FBQUEsRUFFQSxRQUFRLE1BQW9CO0FBQ3hCLFNBQUssZUFBZSxLQUFLLEdBQUcsS0FBSyxjQUFjO0FBQy9DLFNBQUssYUFBYSxLQUFLLEdBQUcsS0FBSyxZQUFZO0FBQzNDLFNBQUssWUFBWSxLQUFLLEdBQUcsS0FBSyxXQUFXO0FBRXpDLGVBQVcsS0FBSyxLQUFLLGVBQWU7QUFDaEMsV0FBSyxjQUFjLEtBQUssaUNBQUssSUFBTCxFQUFRLE9BQU8sRUFBRSxNQUFNLE1BQU0sRUFBRSxFQUFDO0FBQUEsSUFDNUQ7QUFFQSxVQUFNLGNBQWMsQ0FBQyxzQkFBc0Isa0JBQWtCLGNBQWM7QUFFM0UsZUFBVyxLQUFLLGFBQWE7QUFDekIsYUFBTyxPQUFPLEtBQUssSUFBSSxLQUFLLEVBQUU7QUFBQSxJQUNsQztBQUVBLFNBQUssWUFBWSxLQUFLLEdBQUcsS0FBSyxZQUFZLE9BQU8sT0FBSyxDQUFDLEtBQUssWUFBWSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBRXBGLFNBQUssWUFBWSxLQUFLO0FBQ3RCLFNBQUssTUFBTSxNQUFNLEtBQUssR0FBRyxLQUFLLE1BQU0sS0FBSztBQUN6QyxTQUFLLE1BQU0sT0FBTyxLQUFLLEdBQUcsS0FBSyxNQUFNLE1BQU07QUFDM0MsU0FBSyxNQUFNLGFBQWEsS0FBSyxHQUFHLEtBQUssTUFBTSxZQUFZO0FBQUEsRUFDM0Q7QUFBQSxFQUdBLHFCQUFxQixNQUFxQjtBQUN0QyxXQUFPLFlBQVksTUFBTSxLQUFLLEdBQUcsSUFBSTtBQUFBLEVBQ3pDO0FBQ0o7OztBTi9LQSwwQkFBMEIsU0FBd0IsTUFBYyxVQUFrQjtBQUM5RSxNQUFJO0FBQ0EsVUFBTSxFQUFFLEtBQUssV0FBVyxlQUFlLE1BQU0sTUFBSyxtQkFBbUIsUUFBUSxJQUFJO0FBQUEsTUFDN0UsUUFBUSxXQUFnQixJQUFJO0FBQUEsTUFDNUIsT0FBTyxVQUFVLElBQUk7QUFBQSxNQUNyQixVQUFVLGVBQWUsUUFBUTtBQUFBLE1BQ2pDLFFBQVEsTUFBSyxPQUFPO0FBQUEsTUFDcEIsV0FBVztBQUFBLElBQ2YsQ0FBQztBQUVELFdBQU87QUFBQSxNQUNILE1BQU0sTUFBTSxrQkFBa0IsU0FBUyxLQUFVLFdBQVcsVUFBVSxRQUFRLEtBQUssT0FBSyxFQUFFLFdBQVcsT0FBTyxDQUFDLENBQUM7QUFBQSxNQUM5RyxjQUFjLFdBQVcsSUFBSSxPQUFLLGVBQW1CLENBQUMsQ0FBQztBQUFBLElBQzNEO0FBQUEsRUFDSixTQUFTLEtBQVA7QUFDRSwwQkFBc0IsS0FBSyxPQUFPO0FBQUEsRUFDdEM7QUFFQSxTQUFPO0FBQUEsSUFDSCxNQUFNLElBQUksY0FBYztBQUFBLEVBQzVCO0FBQ0o7QUFFQSw0QkFBNEIsU0FBd0IsTUFBYyxlQUF5QixZQUFZLElBQTRCO0FBQy9ILFFBQU0sV0FBVyxDQUFDO0FBQ2xCLFlBQVUsUUFBUSxTQUFTLDZIQUE2SCxVQUFRO0FBQzVKLFFBQUcsUUFBUSxRQUFRLEtBQUssR0FBRyxTQUFTLE9BQU87QUFDdkMsYUFBTyxLQUFLO0FBRWhCLFVBQU0sTUFBTSxRQUFRLEtBQUssSUFBSSxFQUFFO0FBRS9CLFFBQUksT0FBTztBQUNQLFVBQUksUUFBUTtBQUNSLGFBQUssSUFBSSxvQkFBb0IsS0FBSztBQUFBO0FBRWxDLGFBQUssSUFBSSxvQkFBb0IsS0FBSztBQUcxQyxVQUFNLFVBQVUsS0FBSyxHQUFHLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBTSxPQUFPLFlBQVksWUFBWSxJQUFLLEtBQUssSUFBSyxLQUFLLE9BQU8sRUFBRztBQUU5RyxRQUFJLE9BQU8sV0FBVztBQUNsQixvQkFBYyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQUEsSUFDbEMsV0FBVyxTQUFTLFFBQVEsQ0FBQyxLQUFLO0FBQzlCLGFBQU87QUFFWCxVQUFNLEtBQUssS0FBSztBQUNoQixhQUFTLE1BQU07QUFFZixXQUFPLElBQUksY0FBYyxNQUFNLGFBQWEsTUFBTTtBQUFBLEVBQ3RELENBQUM7QUFFRCxNQUFJLFNBQVM7QUFDVCxXQUFPO0FBRVgsTUFBSTtBQUNBLFVBQU0sRUFBRSxNQUFNLFFBQVMsTUFBTSxXQUFVLFFBQVEsSUFBSTtBQUFBLE1BQy9DLEtBQUssYUFBYTtBQUFBLFFBQ2QsUUFBUTtBQUFBLFVBQ0osUUFBUTtBQUFBLFFBQ1o7QUFBQSxNQUNKLENBQUM7QUFBQSxNQUNELFlBQVk7QUFBQSxPQUNULFVBQVUsa0JBQWtCLEVBQ3RDO0FBQ0csY0FBVSxNQUFNLGVBQWUsU0FBUyxNQUFNLEdBQUc7QUFBQSxFQUNyRCxTQUFTLEtBQVA7QUFDRSxtQ0FBK0IsU0FBUyxHQUFHO0FBRTNDLFdBQU8sSUFBSSxjQUFjO0FBQUEsRUFDN0I7QUFFQSxZQUFVLFFBQVEsU0FBUywwQkFBMEIsVUFBUTtBQUN6RCxXQUFPLFNBQVMsS0FBSyxHQUFHLE9BQU8sSUFBSSxjQUFjO0FBQUEsRUFDckQsQ0FBQztBQUVELFNBQU87QUFDWDtBQUVBLDBCQUFpQyxVQUFrQixXQUFtQixXQUFXLFdBQVcsYUFBYSxNQUFNLFlBQVksSUFBSTtBQUMzSCxNQUFJLE9BQU8sSUFBSSxjQUFjLFdBQVcsTUFBTSxlQUFPLFNBQVMsUUFBUSxDQUFDO0FBRXZFLE1BQUksYUFBYSxNQUFNLFlBQVk7QUFFbkMsUUFBTSxnQkFBMEIsQ0FBQyxHQUFHLGVBQXlCLENBQUM7QUFDOUQsU0FBTyxNQUFNLEtBQUssY0FBYyxnRkFBZ0YsT0FBTSxTQUFRO0FBQzFILGlCQUFhLEtBQUssSUFBSSxNQUFNO0FBQzVCLFdBQU8sS0FBSyxHQUFHLEtBQUssS0FBSyxJQUFJLE1BQU0sYUFBYSxLQUFLLElBQUksWUFBWSxlQUFlLFNBQVMsR0FBRyxLQUFLLEVBQUU7QUFBQSxFQUMzRyxDQUFDO0FBRUQsUUFBTSxZQUFZLGNBQWMsSUFBSSxPQUFLLFlBQVksU0FBUyxFQUFFLEtBQUssRUFBRTtBQUN2RSxNQUFJLFdBQVc7QUFDZixTQUFPLE1BQU0sS0FBSyxjQUFjLDhFQUE4RSxPQUFNLFNBQVE7QUFDeEgsZ0JBQVksS0FBSyxJQUFJLE1BQU07QUFDM0IsUUFBRyxhQUFhO0FBQU8sYUFBTyxLQUFLO0FBRW5DLFVBQU0sRUFBRSxNQUFNLGNBQWMsU0FBUyxNQUFNLFdBQVcsS0FBSyxJQUFJLFdBQVcsUUFBUTtBQUNsRixZQUFRLGFBQWEsS0FBSyxHQUFHLElBQUk7QUFDakMsZUFBVztBQUNYLGlCQUFhLEtBQUsscUJBQXFCLFNBQVM7QUFDaEQsV0FBTyxLQUFLLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxLQUFLLEVBQUU7QUFBRTtBQUFBLEVBQ2hELENBQUM7QUFFRCxNQUFJLENBQUMsWUFBWSxXQUFXO0FBQ3hCLFNBQUssb0JBQW9CLFVBQVUsbUJBQW1CO0FBQUEsRUFDMUQ7QUFHQSxRQUFNLGNBQWMsSUFBSSxhQUFhLFdBQVcsUUFBUSxHQUFHLFlBQVcsQ0FBQyxZQUFZLFdBQVcsV0FBVyxRQUFRLENBQUM7QUFFbEgsYUFBVyxRQUFRLGNBQWM7QUFDN0IsY0FBUyxLQUFLLFlBQVksV0FBVyxjQUFjLFNBQVMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUFBLEVBQzVFO0FBR0EsU0FBTyxFQUFFLFlBQVksV0FBVyxNQUFNLEtBQUssSUFBSSxLQUFLLEtBQUssV0FBVyxVQUFVLFVBQVUsR0FBRyxjQUFjLFlBQVksY0FBYyxhQUFhLGNBQWMsSUFBSSxPQUFLLEVBQUUsTUFBTSxNQUFNLFNBQVMsT0FBTyxLQUFLLElBQUksTUFBSyxVQUFVLFdBQVcsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUN6UDtBQUVPLG9CQUFvQixNQUFjO0FBQ3JDLFNBQU8sS0FBSyxHQUFHLFlBQVksSUFBSSxLQUFLLE1BQU0sQ0FBQztBQUMvQzs7O0FEcElBOzs7QVFGQTtBQUNBO0FBQ0E7QUFFQSxJQUFNLFdBQVUsY0FBYyxZQUFZLEdBQUc7QUFBN0MsSUFBZ0QsVUFBVSxDQUFDLFdBQWlCLFNBQVEsUUFBUSxNQUFJO0FBRWpGLDZCQUFVLFVBQWtCO0FBQ3ZDLGFBQVcsTUFBSyxVQUFVLFFBQVE7QUFFbEMsUUFBTSxVQUFTLFNBQVEsUUFBUTtBQUMvQixjQUFZLFFBQVE7QUFFcEIsU0FBTztBQUNYOzs7QUNaQTtBQUdBLHVCQUFpQjtBQUFBLEVBRWIsWUFBWSxXQUF3QjtBQUNoQyxTQUFLLE1BQU0sSUFBSSxtQkFBa0IsU0FBUztBQUFBLEVBQzlDO0FBQUEsUUFFTSxZQUFZLFVBQXlDO0FBQ3ZELFVBQU0sRUFBQyxNQUFNLFdBQVcsT0FBTSxLQUFLLEtBQUssb0JBQW9CLFFBQVE7QUFDcEUsV0FBTyxHQUFHLFFBQVE7QUFBQSxFQUN0QjtBQUNKO0FBRUEsZ0NBQXVDLEVBQUUsU0FBUyxNQUFNLE9BQU8sU0FBa0IsVUFBa0IsV0FBeUI7QUFDeEgsUUFBTSxlQUFlLElBQUksV0FBVyxTQUFTO0FBQzdDLFFBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLElBQ3pDLFdBQVcsWUFBWTtBQUFBLElBQ3ZCLE1BQU07QUFBQSxJQUNOLE1BQU0sR0FBRztBQUFBLEVBQVksZUFBZSxZQUFZLE1BQU0sYUFBYSxZQUFZLEtBQUs7QUFBQSxFQUN4RixDQUFDO0FBQ0QsUUFBTSxVQUFVLFNBQVM7QUFDN0I7QUFFQSwrQkFBc0MsVUFBcUIsVUFBa0IsV0FBeUI7QUFDbEcsUUFBTSxlQUFlLElBQUksV0FBVyxTQUFTO0FBQzdDLGFBQVUsRUFBRSxTQUFTLE1BQU0sT0FBTyxXQUFXLFVBQVM7QUFDbEQsVUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsTUFDekMsV0FBVyxZQUFZO0FBQUEsTUFDdkIsTUFBTTtBQUFBLE1BQ04sTUFBTSxHQUFHO0FBQUEsRUFBWSxlQUFlLFlBQVksTUFBTSxhQUFhLFlBQVksS0FBSztBQUFBLElBQ3hGLENBQUM7QUFDRCxVQUFNLFVBQVUsU0FBUztBQUFBLEVBQzdCO0FBQ0o7OztBVDFCQSxpQ0FBZ0QsVUFBa0IsV0FBbUIsYUFBMkI7QUFDNUcsUUFBTSxPQUFPLE1BQUssTUFBTSxRQUFRLEVBQUUsS0FBSyxRQUFRLE9BQU8sS0FBSyxFQUFFLFFBQVEsbUJBQW1CLEVBQUU7QUFFMUYsUUFBTSxVQUEwQjtBQUFBLElBQzVCLFVBQVU7QUFBQSxJQUNWLE1BQU0sV0FBVyxJQUFJO0FBQUEsSUFDckIsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsS0FBSyxZQUFZO0FBQUEsSUFDakIsV0FBVztBQUFBLEVBQ2Y7QUFFQSxRQUFNLGVBQWUsTUFBSyxTQUFTLFNBQVMsT0FBTyxJQUFJLFNBQVM7QUFDaEUsUUFBTSxrQkFBa0IsU0FBUyxPQUFPLEtBQUs7QUFFN0MsUUFBTSxpQkFBaUIsa0JBQWtCO0FBQ3pDLFFBQU0sRUFBQyxhQUFhLE1BQU0sS0FBSyxpQkFBZ0IsTUFBTSxXQUFXLFVBQVUsV0FBVSxnQkFBZSxPQUFNLFVBQVU7QUFDbkgsU0FBTyxPQUFPLFlBQVksY0FBYSxZQUFZO0FBQ25ELFVBQVEsWUFBWTtBQUVwQixRQUFNLFlBQVcsQ0FBQztBQUNsQixhQUFVLFFBQVEsYUFBWTtBQUMxQixnQkFBWSxRQUFRLElBQUksQ0FBQztBQUN6QixjQUFTLEtBQUssa0JBQWtCLE1BQU0sY0FBYyxTQUFTLElBQUksR0FBRyxXQUFXLENBQUM7QUFBQSxFQUNwRjtBQUVBLFFBQU0sUUFBUSxJQUFJLFNBQVE7QUFDMUIsUUFBTSxFQUFFLElBQUksS0FBSyxhQUFhLEFBQU8sZUFBUSxNQUFXLE9BQU87QUFDL0Qsa0JBQWdCLFVBQVUsVUFBVSxHQUFHO0FBRXZDLFFBQU0sZUFBTyxVQUFVLGdCQUFnQixHQUFHLElBQUk7QUFFOUMsTUFBSSxJQUFJLE1BQU07QUFDVixRQUFJLElBQUksUUFBUSxLQUFLLE1BQU0sYUFBYSxNQUFNLE9BQU8sRUFBRSxJQUFJLElBQUk7QUFDL0QsUUFBSSxRQUFRLGFBQWEsSUFBSSxLQUFLLElBQUk7QUFBQSxFQUMxQztBQUVBLFFBQU0sZUFBTyxVQUFVLGtCQUFrQixRQUFRLElBQUksUUFBUSxFQUFFO0FBRS9ELFNBQU87QUFDWDs7O0FGeENBO0FBRUEsdUJBQXVCLFNBQXdCLFVBQWtCLFdBQWtCLGFBQTJCO0FBQzFHLFFBQU0sT0FBTyxDQUFDLFNBQWlCO0FBQzNCLFVBQU0sS0FBSyxDQUFDLFVBQWlCLFFBQVEsY0FBYyxPQUFLLEVBQUUsRUFBRSxLQUFLLEdBQzdELFFBQVEsR0FBRyxRQUFRLFdBQVcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJO0FBRW5ELFdBQU8sUUFBUSxNQUFNLE1BQU0sSUFBSSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ2hEO0FBQ0EsUUFBTSxZQUFZLE1BQU0sa0JBQWtCLFVBQVUsV0FBVyxXQUFXO0FBQzFFLFFBQU0sT0FBTyxNQUFNLG9CQUFtQixTQUFTO0FBRS9DLFFBQU0sRUFBRSxNQUFNLFNBQVMsS0FBSyxRQUFRLE9BQU8sS0FBSyxPQUFPLEdBQUcsS0FBSyxTQUFTLENBQUM7QUFDekUsY0FBWSxZQUFZO0FBQ3hCLFNBQU87QUFDWDtBQUdBLDBCQUF3QyxNQUFxQixTQUF3QixhQUFzRDtBQUN2SSxRQUFNLGdCQUFnQixLQUFLLFlBQVksR0FBRyxlQUFlLGNBQWMsa0JBQWtCO0FBQ3pGLFFBQU0sRUFBRSxXQUFXLGFBQWEsZUFBZSxjQUFjLGVBQWUsUUFBUSxlQUFlLE1BQU0sR0FBRyxTQUFTLE9BQU8sSUFBSSxRQUFRO0FBQ3hJLFFBQU0sWUFBWSxTQUFTLFNBQVMsT0FBTyxJQUFJLFNBQVMsRUFBRSxRQUFRLFFBQVEsR0FBRztBQUU3RSxjQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU07QUFFMUMsUUFBTSxLQUFLLFFBQVEsY0FBYyxNQUFNLFNBQVMsU0FBUyxDQUFDLEdBQ3RELE9BQU8sQ0FBQyxTQUFpQjtBQUNyQixVQUFNLFFBQVEsUUFBUSxjQUFjLE1BQU0sRUFBRSxFQUFFLEtBQUs7QUFDbkQsV0FBTyxRQUFRLElBQUksU0FBUyxXQUFXO0FBQUEsRUFDM0MsR0FBRyxXQUFXLFFBQVEsZUFBZSxVQUFVO0FBRW5ELFFBQU0sTUFBTSxDQUFDLFlBQVksUUFBUSxXQUFXLEtBQUssSUFBSSxNQUFNLFFBQVEsU0FBUyxVQUFVLFdBQVcsV0FBVyxJQUFJO0FBR2hILGNBQVksbUJBQW1CLFVBQVUsU0FBUyxJQUFJLEVBQUUsUUFDNUQsYUFBYSxhQUFhO0FBQUEsY0FDWixnQ0FBZ0MsV0FBVyxXQUFXLE1BQU07QUFBQSxRQUNsRSxnQkFBZ0I7QUFBQSxvQkFDSjtBQUFBLE1BQ2QsS0FBSyxPQUFPLElBQUksS0FBSyxTQUFTLElBQUksTUFBTSxvQkFBb0I7QUFBQSxJQUM5RDtBQUVBLFNBQU87QUFBQSxJQUNILGdCQUFnQixJQUFJLGNBQWMsTUFBTSxXQUFXLEtBQUssWUFBWSxPQUFPLFdBQVc7QUFBQSxJQUN0RixpQkFBaUI7QUFBQSxFQUNyQjtBQUNKOzs7QVl2REE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFPQSxzQkFBc0IsSUFBUyxNQUFjO0FBRXpDLHNCQUFvQixVQUFlO0FBQy9CLFdBQU8sSUFBSSxTQUFnQjtBQUN2QixZQUFNLGVBQWUsU0FBUyxHQUFHLElBQUk7QUFDckMsYUFBTztBQUFBO0FBQUEsNkVBRTBEO0FBQUE7QUFBQSxrQkFFM0Q7QUFBQTtBQUFBLElBRVY7QUFBQSxFQUNKO0FBRUEsS0FBRyxTQUFTLE1BQU0sYUFBYSxXQUFXLEdBQUcsU0FBUyxNQUFNLFVBQVU7QUFDdEUsS0FBRyxTQUFTLE1BQU0sUUFBUSxXQUFXLEdBQUcsU0FBUyxNQUFNLEtBQUs7QUFDaEU7QUFFQSwyQkFBd0MsTUFBcUIsU0FBd0IsZ0JBQStCLGtCQUFrQyxVQUFrRDtBQUNwTSxRQUFNLGlCQUFpQixpQkFBZ0IsVUFBVSxVQUFVO0FBRzNELFFBQU0sWUFBVyxRQUFRLFdBQVcsY0FBYyxnQkFBZ0IsYUFBYSxJQUFJLElBQUksa0JBQWtCO0FBRXpHLE1BQUksZ0JBQWdCO0FBQ3BCLFFBQU0sS0FBSyxTQUFTO0FBQUEsSUFDaEIsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsU0FBUyxRQUFRLFdBQVcsV0FBVyxnQkFBZ0IsT0FBTztBQUFBLElBQzlELFFBQVEsUUFBUSxXQUFXLFVBQVUsZ0JBQWdCLFVBQVUsSUFBSTtBQUFBLElBQ25FLGFBQWEsUUFBUSxXQUFXLGVBQWUsZ0JBQWdCLGVBQWUsSUFBSTtBQUFBLElBRWxGLFdBQVcsU0FBVSxLQUFLLE1BQU07QUFDNUIsVUFBSSxRQUFRLEtBQUssWUFBWSxJQUFJLEdBQUc7QUFDaEMsd0JBQWdCO0FBQ2hCLFlBQUk7QUFDQSxpQkFBTyxPQUFPLG1CQUFtQixLQUFLLFVBQVUsS0FBSyxFQUFFLFVBQVUsTUFBTSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7QUFBQSxRQUNuRyxTQUFTLEtBQVA7QUFDRSxnQkFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsWUFDekMsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sV0FBVztBQUFBLFVBQ2YsQ0FBQztBQUNELGdCQUFNLFVBQVUsU0FBUztBQUFBLFFBQzdCO0FBQUEsTUFDSjtBQUVBLGFBQU8sT0FBTyxtQkFBbUIsR0FBRyxNQUFNLFdBQVcsR0FBRztBQUFBLElBQzVEO0FBQUEsRUFDSixDQUFDO0FBRUQsUUFBTSxPQUFPLFFBQVEsY0FBYyxhQUFhLGdCQUFnQixZQUFZLFdBQUk7QUFDaEYsTUFBSTtBQUNBLE9BQUcsSUFBSSxDQUFDLE1BQVMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUUxQyxNQUFJLFFBQVEsV0FBVyxlQUFlLGdCQUFnQixjQUFjLElBQUk7QUFDcEUsT0FBRyxJQUFJLFFBQVE7QUFBQSxNQUNYLFNBQVMsQ0FBQyxNQUFXLFFBQVEsQ0FBQztBQUFBLE1BQzlCLFdBQVcsT0FBTyxVQUFVLFdBQVc7QUFBQSxJQUMzQyxDQUFDO0FBRUwsTUFBSSxRQUFRLFdBQVcsU0FBUyxnQkFBZ0IsU0FBUyxJQUFJO0FBQ3pELE9BQUcsSUFBSSxlQUFlO0FBRTFCLE1BQUksUUFBUSxXQUFXLFFBQVEsZ0JBQWdCLFFBQVEsSUFBSTtBQUN2RCxPQUFHLElBQUksY0FBYztBQUV6QixNQUFJLGVBQWUsZ0JBQWdCLE1BQU07QUFDekMsUUFBTSxXQUFXLFFBQVEsY0FBYyxRQUFRLFlBQVk7QUFFM0QsTUFBSSxDQUFDLGNBQWMsT0FBTyxLQUFLLFVBQVU7QUFDckMsUUFBSSxXQUFXLFNBQVMsTUFBTSxNQUFNLE1BQUssS0FBSyxTQUFTLE9BQU8sSUFBSSxRQUFRLElBQUcsTUFBSyxLQUFLLE1BQUssUUFBUSxLQUFLLFlBQVksUUFBUSxDQUFDLEdBQUcsUUFBUTtBQUN6SSxRQUFJLENBQUMsTUFBSyxRQUFRLFFBQVE7QUFDdEIsa0JBQVk7QUFDaEIsVUFBTSxXQUFXLE1BQUssS0FBSyxjQUFjLGlCQUFpQixRQUFRO0FBQ2xFLG1CQUFlLE1BQU0sZUFBTyxTQUFTLFFBQVE7QUFDN0MsVUFBTSxTQUFRLFdBQVcsVUFBVSxRQUFRO0FBQUEsRUFDL0M7QUFFQSxRQUFNLGFBQWEsR0FBRyxPQUFPLFlBQVksR0FBRyxZQUFZLElBQUksY0FBYyxLQUFLLGVBQWU7QUFFOUYsUUFBTSxRQUFRLE1BQU0sZ0JBQWdCLFFBQVEsVUFBVSxZQUFZLEtBQUssZ0JBQWdCLGFBQWEsVUFBVTtBQUU5RyxNQUFJLGVBQWU7QUFDZixRQUFHLFNBQVMsUUFBTztBQUNmLFlBQU0sV0FBVSx5QkFBeUIsUUFBUTtBQUNqRCxlQUFRLE1BQU0sUUFBTztBQUFBLElBQ3pCO0FBQ0EsUUFBRyxNQUFLO0FBQ0osZUFBUSxPQUFPLGFBQWE7QUFBQSxJQUNoQztBQUFBLEVBQ0o7QUFFQSxVQUFRLFNBQVMsZUFBZTtBQUVoQyxRQUFNLFFBQVEsUUFBUSxjQUFjLFNBQVUsZ0JBQWdCLFNBQVMsTUFBTTtBQUM3RSxRQUFNLFVBQVUsb0JBQW9CLFFBQVE7QUFDNUMsV0FBUyxVQUFVLFNBQVEsTUFBTSxPQUFPO0FBRXhDLFlBQVUsWUFBWSxRQUFRLGFBQWEsS0FBSztBQUVoRCxTQUFPO0FBQUEsSUFDSCxnQkFBZ0I7QUFBQSxJQUNoQixpQkFBaUI7QUFBQSxFQUNyQjtBQUNKO0FBR0EsSUFBTSxZQUFZLG1CQUFtQjtBQTZCckMsb0JBQW9CLE9BQWUsT0FBZTtBQUM5QyxRQUFNLENBQUMsUUFBUSxPQUFPLFFBQVEsTUFBTSxNQUFNLGdCQUFnQjtBQUMxRCxRQUFNLFlBQVksTUFBTSxPQUFPLFdBQVcsTUFBTSxNQUFLO0FBQ3JELFNBQU8sQ0FBQyxTQUFRLFdBQVcsV0FBWSxTQUFRLFFBQVEsV0FBVyxNQUFNLE1BQU0sZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO0FBQ3pHO0FBRUEsSUFBTSxnQkFBZ0IsbUJBQW1CO0FBRXpDLCtCQUErQixPQUFlO0FBQzFDLFFBQU0saUJBQWlCLE1BQU0sTUFBTSxHQUFHO0FBQ3RDLE1BQUksZUFBZSxVQUFVO0FBQUcsV0FBTztBQUV2QyxRQUFNLE9BQU8sZUFBZSxNQUFNLGVBQWUsTUFBTSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxRQUFRLEtBQUssR0FBRztBQUV2RixNQUFJLE1BQU0sZUFBTyxXQUFXLGdCQUFnQixPQUFPLE1BQU07QUFDckQsV0FBTztBQUVYLFFBQU0sWUFBWSxNQUFNLGVBQU8sU0FBUyxnQkFBZ0IsZUFBZSxLQUFLLE1BQU07QUFDbEYsUUFBTSxXQUFXLE1BQU0sZUFBTyxTQUFTLGdCQUFnQixlQUFlLEtBQUssTUFBTTtBQUVqRixRQUFNLENBQUMsT0FBTyxNQUFNLFNBQVMsV0FBVyxVQUFVLFNBQVM7QUFDM0QsUUFBTSxZQUFZLEdBQUcsMENBQTBDLDJDQUEyQztBQUMxRyxRQUFNLGVBQU8sVUFBVSxnQkFBZ0IsT0FBTyxRQUFRLFNBQVM7QUFFL0QsU0FBTztBQUNYOzs7QUMxS0EsMkJBQXlDLFVBQWtCLE1BQXFCLFNBQXdCLGdCQUFnQyxrQkFBa0MsYUFBc0Q7QUFDNU4sU0FBTztBQUFBLElBQ0gsZ0JBQWdCLElBQUksY0FBYyxLQUFLLGVBQWUsRUFBRSxhQUFhLFFBQVEsYUFBYSxLQUFLLE1BQU0saUJBQWdCLGFBQWEsZ0JBQWdCLFVBQVUsV0FBVztBQUFBLElBRXZLLGlCQUFpQjtBQUFBLEVBQ3JCO0FBQ0o7QUFFQSxnQ0FBdUMsVUFBeUIsYUFBMkIsaUJBQXlCO0FBQ2hILFFBQU0sb0JBQW9CLE1BQU0sWUFBWSxVQUFVO0FBRXRELFFBQU0sb0JBQW9CLENBQUMscUJBQXFCLDBCQUEwQjtBQUMxRSxRQUFNLGVBQWUsTUFBTTtBQUFDLHNCQUFrQixRQUFRLE9BQUssV0FBVyxTQUFTLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFBRyxXQUFPO0FBQUEsRUFBUTtBQUcvRyxNQUFJLENBQUM7QUFDRCxXQUFPLGFBQWE7QUFFeEIsUUFBTSxjQUFjLElBQUksY0FBYyxNQUFNLGlCQUFpQjtBQUM3RCxNQUFJLGdCQUFnQjtBQUVwQixXQUFTLElBQUksR0FBRyxJQUFJLGtCQUFrQixVQUFVLENBQUMsZUFBZTtBQUM1RCxlQUFXLFNBQVMsU0FBUyxrQkFBa0IsSUFBSSxNQUFPLGlCQUFnQixTQUFTLFdBQVc7QUFFbEcsTUFBRztBQUNDLFdBQU8sYUFBYTtBQUV4QixTQUFPLFNBQVMsZ0NBQWlDO0FBQ3JEOzs7QUNuQ0EsSUFBTSxVQUFVLENBQUMsVUFBVSxPQUFPLFdBQVcsS0FBSztBQUFsRCxJQUFxRCxXQUFXLENBQUMsV0FBVyxNQUFNO0FBQ2xGLElBQU0sb0JBQW9CLENBQUMsU0FBUyxVQUFVLFFBQVEsR0FBRyxTQUFTLEdBQUcsUUFBUTtBQUU3RSxJQUFNLGlCQUFpQjtBQUl2QixJQUFNLHlCQUF5QjtBQUFBLEVBQzNCLHVCQUF1QjtBQUFBLElBQ25CO0FBQUEsSUFDQSxDQUFDLGNBQXNCLFVBQVUsTUFBTSxHQUFHLEVBQUUsSUFBSSxPQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQUEsSUFDOUQsQ0FBQyxDQUFDLEtBQUssTUFBTSxTQUFpQixLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVU7QUFBQSxJQUNuRTtBQUFBLEVBQ0o7QUFBQSxFQUNBLHdCQUF3QjtBQUFBLElBQ3BCO0FBQUEsSUFDQSxDQUFDLGNBQXNCLFVBQVUsTUFBTSxJQUFJLEVBQUUsSUFBSSxPQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQUEsSUFDL0QsQ0FBQyxDQUFDLEtBQUssTUFBTSxRQUFnQixPQUFPLFVBQVUsR0FBRyxLQUFLLE9BQU8sT0FBTyxPQUFPO0FBQUEsSUFDM0U7QUFBQSxFQUNKO0FBQUEsRUFDQSxzQkFBc0I7QUFBQSxJQUNsQjtBQUFBLElBQ0EsQ0FBQyxjQUFzQixVQUFVLE1BQU0sSUFBSSxFQUFFLElBQUksT0FBSyxPQUFPLENBQUMsQ0FBQztBQUFBLElBQy9ELENBQUMsQ0FBQyxLQUFLLE1BQU0sUUFBZ0IsT0FBTyxPQUFPLE9BQU87QUFBQSxJQUNsRDtBQUFBLEVBQ0o7QUFBQSxFQUNBLDBCQUEwQjtBQUFBLElBQ3RCO0FBQUEsSUFDQSxDQUFDLGNBQXNCLFVBQVUsTUFBTSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxFQUFFLElBQUksT0FBSyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsT0FBTyxLQUFLLElBQUk7QUFBQSxJQUM1RyxDQUFDLFNBQW1CLFNBQWlCLFFBQVEsU0FBUyxJQUFJO0FBQUEsSUFDMUQ7QUFBQSxFQUNKO0FBQUEsRUFDQSwwQkFBMEI7QUFBQSxJQUN0QjtBQUFBLElBQ0EsQ0FBQyxjQUFzQixVQUFVLE1BQU0sSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUssV0FBVyxDQUFDLENBQUM7QUFBQSxJQUNwRixDQUFDLFNBQW1CLFFBQWdCLFFBQVEsU0FBUyxHQUFHO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQ0o7QUFFQSxJQUFNLDJCQUEyQixDQUFDLEdBQUcsT0FBTztBQUU1QyxXQUFVLEtBQUssd0JBQXVCO0FBQ2xDLFFBQU0sT0FBTyx1QkFBdUIsR0FBRztBQUV2QyxNQUFHLHlCQUF5QixTQUFTLElBQUk7QUFDckMsNkJBQXlCLEtBQUssQ0FBQztBQUN2QztBQUdPLHVCQUF1QixPQUF1QjtBQUNqRCxVQUFRLE1BQU0sWUFBWSxFQUFFLEtBQUs7QUFFakMsTUFBSSxrQkFBa0IsU0FBUyxLQUFLO0FBQ2hDLFdBQU8sS0FBSztBQUVoQixhQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sYUFBYSxPQUFPLFFBQVEsc0JBQXNCO0FBQ3ZFLFFBQWEsS0FBTSxLQUFLLEtBQUs7QUFDekIsYUFBTyxLQUFLLFVBQWdCLFFBQVMsS0FBSztBQUVsRCxTQUFPLElBQUk7QUFDZjtBQUdBLGtDQUF5QyxNQUFhLGdCQUFvRDtBQUV0RyxhQUFXLEtBQUssZ0JBQWdCO0FBQzVCLFVBQU0sQ0FBQyxZQUFZLGVBQWUsZUFBZSxJQUFJLFFBQVEsS0FBSztBQUNsRSxRQUFJLFlBQThCO0FBRWxDLFFBQUksWUFBWTtBQUNoQixZQUFRO0FBQUEsV0FDQztBQUFBLFdBQ0E7QUFDRCxvQkFBWSxPQUFPLFVBQVU7QUFDN0I7QUFBQSxXQUNDO0FBQUEsV0FDQTtBQUNELG9CQUFZLE9BQU8sVUFBVTtBQUM3QjtBQUFBLFdBQ0M7QUFBQSxXQUNBO0FBQ0Qsb0JBQVksQ0FBQyxPQUFPLFVBQVUsS0FBSztBQUNuQztBQUFBLFdBQ0M7QUFBQSxXQUNBO0FBQ0Qsb0JBQVksT0FBTyxVQUFVO0FBQzdCO0FBQUEsV0FDQztBQUNELG9CQUFZLENBQUMsZUFBZSxLQUFLLEtBQUs7QUFDdEM7QUFBQSxlQUNLO0FBQ0wsY0FBTSxZQUFZLHVCQUF1QjtBQUV6QyxZQUFHLFdBQVU7QUFDVCxzQkFBWSxTQUFTLFFBQVEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxLQUFLO0FBQzdEO0FBQUEsUUFDSjtBQUVBLG9CQUFZO0FBQ1osWUFBSSxtQkFBbUI7QUFDbkIsc0JBQWEsQ0FBQyxRQUFRLEtBQUssS0FBSyxLQUFNLGFBQWE7QUFBQSxpQkFDOUMsT0FBTyxXQUFXO0FBQ3ZCLHNCQUFhLENBQUMsTUFBTSxRQUFRLEtBQUssS0FBTSxnQkFBaUIsU0FBUSxRQUFRO0FBQUEsTUFDaEY7QUFBQTtBQUdKLFFBQUksV0FBVztBQUNYLFVBQUksT0FBTyw4QkFBOEIsT0FBTyxDQUFDLElBQUUsT0FBTyxZQUFZLFlBQVksY0FBYztBQUVoRyxVQUFHLFlBQVk7QUFDWCxnQkFBUSxnQkFBZ0IsS0FBSyxVQUFVLFdBQVc7QUFFdEQsY0FBUSxZQUFZLEtBQUssVUFBVSxLQUFLO0FBRXhDLGFBQU8sQ0FBQyxNQUFNLFNBQVMsYUFBYSxLQUFLO0FBQUEsSUFDN0M7QUFBQSxFQUNKO0FBRUEsU0FBTztBQUNYO0FBRU8scUJBQXFCLE1BQWEsZ0JBQThCO0FBQ25FLFFBQU0sU0FBUyxDQUFDO0FBR2hCLGFBQVcsS0FBSyxnQkFBZ0I7QUFDNUIsVUFBTSxDQUFDLFdBQVcsZUFBZSxJQUFJLFFBQVEsS0FBSztBQUVsRCxRQUFJLHlCQUF5QixTQUFTLE9BQU87QUFDekMsYUFBTyxLQUFLLFdBQVcsS0FBSyxDQUFDO0FBQUEsYUFFeEIsU0FBUyxTQUFTLE9BQU87QUFDOUIsYUFBTyxLQUFLLFVBQVUsU0FBUyxPQUFPLEtBQUs7QUFBQTtBQUczQyxhQUFPLEtBQUssS0FBSztBQUFBLEVBQ3pCO0FBRUEsU0FBTztBQUNYOzs7QUMzSU8sdUNBQXVDLGFBQXFCLGVBQXVCLGdCQUF3QixVQUF5QixhQUEyQixnQkFBaUQsRUFBQyxlQUFzQyxDQUFDLEdBQUc7QUFDOVAsTUFBSSxDQUFDLFlBQVksZUFBZSxLQUFLLE9BQUssRUFBRSxRQUFRLGNBQWM7QUFDOUQsV0FBTztBQUVYLGFBQVcsS0FBSyxZQUFZLGdCQUFnQjtBQUN4QyxRQUFJLEVBQUUsUUFBUTtBQUNWO0FBRUosVUFBTSxnQkFBZ0IsSUFBSSxjQUFjLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtBQUM5RCxVQUFNLFVBQVUsSUFBSSxPQUFPLElBQUkscUJBQXFCLDBCQUEwQixHQUFHLGlCQUFpQixJQUFJLE9BQU8sT0FBTyxxQkFBcUIsc0JBQXNCO0FBRS9KLFFBQUksaUJBQWlCO0FBRXJCLFVBQU0sYUFBYSxNQUFNO0FBQ3JCLHVCQUFpQjtBQUNqQixhQUFPLElBQUksY0FBYyxNQUFNLFlBQVkscUJBQXFCLEVBQUU7QUFBQSxrQkFDNUQsYUFBYSxZQUFXLDRCQUE0QjtBQUFBLHNCQUNoRCxlQUFlLENBQUM7QUFBQTtBQUFBLGNBRXhCO0FBQUEsSUFDTjtBQUVBLGVBQVcsU0FBUyxTQUFTLFNBQVMsVUFBVTtBQUVoRCxRQUFJO0FBQ0EsaUJBQVcsU0FBUyxRQUFRLGdCQUFnQixFQUFFO0FBQUE7QUFFOUMsaUJBQVcsU0FBUyxTQUFTLGdCQUFnQixVQUFVO0FBQUEsRUFFL0Q7QUFFQSxTQUFPO0FBQ1g7OztBQzdCQSxJQUFNLGVBQWM7QUFFcEIsbUJBQWtCLE1BQWM7QUFDNUIsU0FBTyxZQUFZLG1DQUFtQztBQUMxRDtBQUVBLDJCQUF3QyxNQUFxQixTQUF3QixnQkFBK0IsRUFBRSw2QkFBZSxhQUFzRDtBQUN2TCxRQUFNLE9BQU8sUUFBUSxlQUFlLE1BQU0sR0FDdEMsU0FBUyxRQUFRLGVBQWUsUUFBUSxHQUN4QyxZQUFZLFFBQVEsZUFBZSxVQUFVLEdBQzdDLFdBQVcsUUFBUSxlQUFlLFVBQVU7QUFFaEQsUUFBTSxVQUFVLFFBQVEsY0FBYyxXQUFXLFlBQVksU0FBUyxDQUFDLGFBQVksV0FBVyxDQUFDO0FBRS9GLGNBQVksT0FBTyxjQUFhLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDL0MsY0FBWSxtQkFBbUIsVUFBVSxTQUFTLElBQUksRUFBRSxRQUFRLFVBQVMsSUFBSSxDQUFDO0FBRTlFLGNBQVksZUFBZSxLQUFLO0FBQUEsSUFDNUIsTUFBTTtBQUFBLElBQ047QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLFdBQVcsYUFBYSxVQUFVLE1BQU0sR0FBRyxFQUFFLElBQUksT0FBSyxFQUFFLEtBQUssQ0FBQztBQUFBLEVBQ2xFLENBQUM7QUFFRCxRQUFNLGlCQUFpQixrQkFBa0IsSUFBSSxjQUFjO0FBQzNELGlCQUFlLHFCQUFxQixxQkFBcUIsU0FBUztBQUVsRSxTQUFPO0FBQUEsSUFDSDtBQUFBLElBQ0EsaUJBQWlCO0FBQUEsRUFDckI7QUFDSjtBQUVPLDJCQUEwQixVQUF5QixhQUEyQjtBQUNqRixTQUFPLDhCQUE4QixlQUFlLHVCQUF1QixXQUFXLFVBQVUsYUFBYSxPQUFLO0FBQzlHLFdBQU87QUFBQTtBQUFBLG9CQUVLLEVBQUU7QUFBQSxxQkFDRCxFQUFFO0FBQUEsd0JBQ0MsRUFBRSxZQUFZO0FBQUEsc0JBQ2hCLE9BQU8sRUFBRSxXQUFXLFdBQVcsSUFBSSxFQUFFLGFBQWEsRUFBRTtBQUFBLHlCQUNoRCxFQUFFLGFBQWEsRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLEtBQUssR0FBRyxLQUFNO0FBQUE7QUFBQSxFQUVsRixHQUFHLEVBQUMsWUFBWSxLQUFJLENBQUM7QUFDekI7QUFFQSwrQkFBc0MsVUFBZSxXQUFnQjtBQUNqRSxRQUFNLFNBQVMsU0FBUyxLQUFLLGNBQWM7QUFDM0MsUUFBTSxVQUFVLFVBQVUsVUFBVSxVQUFVLE1BQU0sbUJBQW1CLFFBQVEsVUFBVSxTQUFTO0FBRWxHLFdBQVMsWUFBWSxFQUFFO0FBRXZCLFFBQU0sYUFBYSxDQUFDLFFBQWE7QUFDN0IsYUFBUyxTQUFTLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUM5RCxhQUFTLFNBQVMsSUFBSSxLQUFLLFVBQVUsR0FBRyxDQUFDO0FBQUEsRUFDN0M7QUFFQSxNQUFJLENBQUMsVUFBVSxVQUFVLFVBQVUsWUFBWTtBQUMzQyxlQUFXLE1BQU0sVUFBVSxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQUEsV0FFdkMsVUFBVTtBQUNmLGVBQVcsTUFBTSxVQUFVLFNBQVMsR0FBUSxPQUFPLENBQUM7QUFBQSxXQUUvQyxVQUFVO0FBQ2YsZUFBVztBQUFBLE1BQ1AsT0FBTyxPQUFPLFVBQVUsV0FBVyxXQUFXLFVBQVUsVUFBZ0IsUUFBUyxNQUFNO0FBQUEsSUFDM0YsQ0FBQztBQUFBO0FBRUQsYUFBUyxTQUFTLE9BQU8sR0FBRztBQUVoQyxTQUFPO0FBQ1g7OztBQzlFQTtBQVFBLDJCQUF3QyxVQUFrQixNQUFxQixTQUF3QixnQkFBK0Isa0JBQWtDLGFBQXNEO0FBRTFOLFFBQU0sU0FBUyxRQUFRLGNBQWMsVUFBVSxFQUFFLEVBQUUsS0FBSztBQUV4RCxNQUFJLENBQUM7QUFDRCxXQUFPO0FBQUEsTUFDSCxnQkFBZ0IsSUFBSSxjQUFjLEtBQUssZUFBZSxFQUFFLGFBQWEsUUFBUSxhQUFhLEtBQUssTUFBTSxpQkFBZ0IsYUFBYSxnQkFBZ0IsVUFBVSxXQUFXO0FBQUEsTUFFdkssaUJBQWlCO0FBQUEsSUFDckI7QUFHSixRQUFNLE9BQU8sUUFBUSxjQUFjLFFBQVEsTUFBSyxDQUFDLEVBQUUsS0FBSyxHQUFHLFlBQW9CLFFBQVEsZUFBZSxVQUFVLEdBQUcsZUFBdUIsUUFBUSxlQUFlLE9BQU8sR0FBRyxXQUFtQixRQUFRLGVBQWUsVUFBVSxHQUFHLGVBQWUsUUFBUSxXQUFXLE1BQU07QUFFMVEsUUFBTSxVQUFVLFFBQVEsY0FBYyxXQUFXLFlBQVksU0FBUyxDQUFDLGlCQUFnQixZQUFZLFdBQVcsQ0FBQztBQUMvRyxNQUFJLFFBQVEsQ0FBQztBQUViLFFBQU0saUJBQWlCLGFBQWEsVUFBVSxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUs7QUFDOUQsVUFBTSxRQUFRLFdBQVcsS0FBSyxFQUFFLEtBQUssQ0FBQztBQUV0QyxRQUFJLE1BQU0sU0FBUztBQUNmLFlBQU0sS0FBSyxNQUFNLE1BQU0sQ0FBQztBQUU1QixXQUFPLE1BQU0sSUFBSTtBQUFBLEVBQ3JCLENBQUM7QUFFRCxNQUFJO0FBQ0EsWUFBUSxhQUFhLE1BQU0sR0FBRyxFQUFFLElBQUksT0FBSyxFQUFFLEtBQUssQ0FBQztBQUVyRCxjQUFZLGVBQWUsS0FBSztBQUFBLElBQzVCLE1BQU07QUFBQSxJQUNOO0FBQUEsSUFDQTtBQUFBLElBQ0EsV0FBVztBQUFBLElBQ1gsT0FBTyxNQUFNLFVBQVU7QUFBQSxJQUN2QjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSixDQUFDO0FBRUQsVUFBUSxVQUFVLFVBQVUsTUFBTTtBQUVsQyxRQUFNLGlCQUFpQixJQUFJLGNBQWMsS0FBSyxlQUFlLEVBQUU7QUFBQSxvQkFFL0M7QUFBQSxTQUNYLFFBQVEsYUFBYTtBQUFBLDJEQUM2QixVQUFVLE1BQU0saUJBQWdCLGFBQWEsZ0JBQWdCLFVBQVUsV0FBVztBQUV6SSxTQUFPO0FBQUEsSUFDSDtBQUFBLElBQ0EsaUJBQWlCO0FBQUEsRUFDckI7QUFDSjtBQUdPLDJCQUEwQixVQUF5QixhQUEyQjtBQUNqRixTQUFPLDhCQUE4QixtQkFBbUIscUJBQXFCLFFBQVEsVUFBVSxhQUFhLE9BQUs7QUFDN0csV0FBTztBQUFBO0FBQUEscUJBRU0sRUFBRTtBQUFBLHdCQUNDLEVBQUUsWUFBWTtBQUFBLHlCQUNiLEVBQUUsV0FBVyxNQUFNLGFBQWEsR0FBRyxLQUFLLEdBQUcsS0FBSztBQUFBLHNCQUNuRCxFQUFFLE9BQU8sTUFBTSxVQUFRLElBQUksT0FBTyxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQUEsc0JBQ2xELE9BQU8sRUFBRSxXQUFXLFdBQVcsSUFBSSxFQUFFLGFBQWEsRUFBRTtBQUFBLG1CQUN2RCxFQUFFO0FBQUE7QUFBQSxFQUVqQixDQUFDO0FBQ0w7QUFFQSxnQ0FBc0MsVUFBZSxlQUFvQjtBQUVyRSxTQUFPLFNBQVMsS0FBSztBQUVyQixNQUFJLFNBQVMsQ0FBQztBQUVkLE1BQUksY0FBYyxNQUFNO0FBQ3BCLGVBQVcsS0FBSyxjQUFjO0FBQzFCLGFBQU8sS0FBSyxTQUFTLEtBQUssRUFBRTtBQUFBO0FBRWhDLFdBQU8sS0FBSyxHQUFHLE9BQU8sT0FBTyxTQUFTLElBQUksQ0FBQztBQUcvQyxNQUFJLFVBQThCO0FBRWxDLE1BQUksY0FBYyxVQUFVLFFBQVE7QUFDaEMsYUFBUyxZQUFZLFFBQVEsY0FBYyxTQUFTO0FBQ3BELGNBQVUsTUFBTSxtQkFBbUIsUUFBUSxjQUFjLFNBQVM7QUFBQSxFQUN0RTtBQUVBLE1BQUk7QUFFSixNQUFJLFlBQVk7QUFDWixlQUFXLE1BQU0sY0FBYyxPQUFPLEdBQUcsTUFBTTtBQUFBLFdBQzFDLGNBQWM7QUFDbkIsZUFBVyxNQUFNLGNBQWMsU0FBUyxHQUFRLE9BQU87QUFFM0QsTUFBSSxXQUFXLENBQUM7QUFDWixRQUFJLGNBQWMsWUFBWTtBQUMxQixlQUFTLFVBQVUsUUFBUSxFQUFFO0FBQUE7QUFFN0IsaUJBQVcsY0FBYztBQUVqQyxNQUFJO0FBQ0EsUUFBSSxjQUFjO0FBQ2QsZUFBUyxVQUFVLFFBQVE7QUFBQTtBQUUzQixlQUFTLE1BQU0sUUFBUTtBQUNuQzs7O0FDekdBLElBQU0sY0FBYyxJQUFJLFVBQVUsU0FBUztBQUUzQyxvQkFBb0IsU0FBd0IsYUFBMkI7QUFDbkUsU0FBTyxRQUFRLGNBQWMsUUFBUSxnQkFBZ0IsWUFBWSxTQUFTLENBQUM7QUFDL0U7QUFFTyx3QkFBd0IsYUFBcUIsU0FBd0IsYUFBMkI7QUFDbkcsUUFBTSxPQUFPLFdBQVcsU0FBUyxXQUFXLEdBQUcsV0FBVyxRQUFRLGNBQWMsUUFBUSxXQUFXO0FBRW5HLGNBQVksTUFBTSxjQUFjLENBQUM7QUFDakMsY0FBWSxNQUFNLFVBQVUsVUFBVTtBQUN0QyxjQUFZLE9BQU8sUUFBUTtBQUUzQixTQUFPO0FBQUEsSUFDSCxPQUFPLFlBQVksTUFBTTtBQUFBLElBQ3pCLFNBQVMsWUFBWSxNQUFNLFVBQVU7QUFBQSxJQUNyQztBQUFBLEVBQ0o7QUFDSjtBQUVBLDJCQUF3QyxVQUFrQixTQUF3QixnQkFBK0Isa0JBQWtDLGFBQXNEO0FBRXJNLG1CQUFpQixNQUFNLGlCQUFnQixhQUFhLGdCQUFnQixVQUFVLFdBQVc7QUFFekYsTUFBSSxDQUFDLFlBQVksVUFBVSxTQUFTLE1BQU0sY0FBYyxVQUFVLElBQUk7QUFDbEUsV0FBTztBQUFBLE1BQ0gsZ0JBQWdCO0FBQUEsSUFDcEI7QUFFSixRQUFNLFNBQVMsSUFBSSxTQUFTLGdCQUFnQixlQUFlLFlBQVksQ0FBQztBQUN4RSxRQUFNLE9BQU8sWUFBWTtBQUV6QixNQUFJLE9BQU87QUFFWCxhQUFXLEtBQUssT0FBTyxRQUFRO0FBQzNCLFFBQUksRUFBRSxRQUFRLFFBQVE7QUFDbEIsY0FBUSxFQUFFLEtBQUs7QUFBQSxJQUNuQjtBQUFBLEVBQ0o7QUFFQSxTQUFPLEtBQUssS0FBSztBQUVqQixRQUFNLEVBQUUsT0FBTyxTQUFTLGVBQWUsdUJBQXVCLFNBQVMsV0FBVztBQUVsRixNQUFJLENBQUMsTUFBTSxNQUFNLFNBQVMsSUFBSSxHQUFHO0FBQzdCLFVBQU0sU0FBUztBQUFBLEVBQ25CO0FBRUEsU0FBTztBQUFBLElBQ0gsZ0JBQWdCO0FBQUEsRUFDcEI7QUFDSjtBQUVPLDZCQUE2QixXQUFtQjtBQUNuRCxRQUFNLE9BQU8sZ0JBQWdCLFNBQVM7QUFDdEMsYUFBVyxRQUFRLFlBQVksT0FBTztBQUNsQyxVQUFNLE9BQU8sWUFBWSxNQUFNO0FBRS9CLFFBQUksS0FBSyxPQUFPO0FBQ1osV0FBSyxRQUFRO0FBQ2IsYUFBTyxLQUFLO0FBQUEsSUFDaEI7QUFBQSxFQUNKO0FBQ0o7QUFFQSw2QkFBb0MsVUFBdUI7QUFDdkQsTUFBSSxDQUFDLFNBQVEsT0FBTztBQUNoQjtBQUFBLEVBQ0o7QUFFQSxhQUFXLFFBQVEsU0FBUSxhQUFhO0FBQ3BDLFVBQU0sV0FBVyxTQUFTLE9BQU8sS0FBSyxPQUFPO0FBQzdDLFVBQU0sZUFBTyxhQUFhLE1BQU0sU0FBUyxPQUFPLEVBQUU7QUFDbEQsbUJBQU8sY0FBYyxVQUFVLFlBQVksTUFBTSxLQUFLO0FBQUEsRUFDMUQ7QUFDSjtBQUVPLHNCQUFzQjtBQUN6QixjQUFZLE1BQU07QUFDdEI7QUFFQSw2QkFBb0M7QUFDaEMsYUFBVyxRQUFRLFlBQVksT0FBTztBQUNsQyxVQUFNLFdBQVcsU0FBUyxPQUFPLEtBQUssT0FBTztBQUM3QyxVQUFNLGVBQU8sYUFBYSxNQUFNLFNBQVMsT0FBTyxFQUFFO0FBQ2xELG1CQUFPLGNBQWMsVUFBVSxZQUFZLE1BQU0sS0FBSztBQUFBLEVBQzFEO0FBQ0o7OztBQzlGQTtBQUtBLDJCQUF3QyxVQUFrQixTQUF3QixnQkFBK0Isa0JBQWtDLGFBQXNEO0FBRXJNLG1CQUFpQixNQUFNLGlCQUFnQixhQUFhLGdCQUFnQixVQUFVLFdBQVc7QUFFekYsTUFBSSxDQUFDLFlBQVksVUFBVSxTQUFTLE1BQU0sY0FBYyxVQUFVLElBQUk7QUFDbEUsV0FBTztBQUFBLE1BQ0gsZ0JBQWdCO0FBQUEsSUFDcEI7QUFFSixRQUFNLFNBQVMsSUFBSSxTQUFTLGdCQUFnQixlQUFlLFlBQVksQ0FBQztBQUN4RSxRQUFNLE9BQU8sWUFBWTtBQUV6QixNQUFJLE9BQU87QUFFWCxhQUFXLEtBQUssT0FBTyxRQUFRO0FBQzNCLFFBQUksRUFBRSxRQUFRLFFBQVE7QUFDbEIsY0FBUSxFQUFFLEtBQUs7QUFBQSxJQUNuQjtBQUFBLEVBQ0o7QUFFQSxRQUFNLEVBQUUsT0FBTyxNQUFNLFlBQVksZUFBZSx1QkFBdUIsU0FBUyxXQUFXO0FBQzNGLFFBQU0sZUFBZSxZQUFZLE1BQU0sUUFBUSxjQUFjLFNBQVMsZ0RBQWdELENBQUM7QUFFdkgsTUFBSSxDQUFDLFNBQVM7QUFDVixVQUFNLFFBQVE7QUFBQSxFQUNsQixPQUFPO0FBQ0gsV0FBTyxPQUFPLFFBQVEsUUFBUSxhQUFhLE1BQU07QUFFakQsUUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLGFBQWEsSUFBSSxHQUFHO0FBQzNDLGNBQVEsUUFBUSxhQUFhO0FBQUEsSUFDakM7QUFBQSxFQUNKO0FBRUEsU0FBTztBQUFBLElBQ0gsZ0JBQWdCO0FBQUEsRUFDcEI7QUFDSjtBQUVBLHFCQUFxQixNQUFjLE9BQWU7QUFDOUMsUUFBTSxPQUFPLE1BQU0sTUFBTTtBQUFBLElBQ3JCLG1CQUFtQjtBQUFBLE1BQ2YsUUFBUTtBQUFBLE1BQ1IsT0FBTztBQUFBLE1BQ1AsVUFBVTtBQUFBLElBQ2Q7QUFBQSxFQUNKLENBQUM7QUFFRCxRQUFNLFNBQW9CLENBQUM7QUFFM0IsYUFBVyxXQUFXLEtBQUssaUJBQWlCLEtBQUssR0FBRztBQUNoRCxVQUFNLEtBQUssUUFBUSxXQUFXO0FBQzlCLFdBQU8sTUFBTSxRQUFRLFVBQVUsS0FBSztBQUNwQyxZQUFRLE9BQU87QUFBQSxFQUNuQjtBQUVBLFNBQU87QUFBQSxJQUNIO0FBQUEsSUFDQSxNQUFNLEtBQUssVUFBVSxLQUFLLEVBQUUsUUFBUSxjQUFjLEdBQUcsRUFBRSxRQUFRLFNBQVMsR0FBRztBQUFBLEVBQy9FO0FBQ0o7OztBQ25ETyxJQUFNLGFBQWEsQ0FBQyxVQUFVLFVBQVUsU0FBUyxRQUFRLFdBQVcsV0FBVyxRQUFRLFFBQVEsVUFBVSxZQUFZLFVBQVUsUUFBUTtBQUV2SSx3QkFBd0IsVUFBa0IsTUFBcUIsU0FBd0IsZ0JBQStCLGtCQUFrQyxhQUFzRDtBQUNqTixNQUFJO0FBRUosVUFBUSxLQUFLLEdBQUcsWUFBWTtBQUFBLFNBQ25CO0FBQ0QsZUFBUyxVQUFPLFVBQVUsTUFBTSxTQUFTLGdCQUFnQixrQkFBaUIsV0FBVztBQUNyRjtBQUFBLFNBQ0M7QUFDRCxlQUFTLFlBQVEsVUFBVSxTQUFTLGdCQUFnQixrQkFBaUIsV0FBVztBQUNoRjtBQUFBLFNBQ0M7QUFDRCxlQUFTLFlBQVEsVUFBVSxTQUFTLGdCQUFnQixrQkFBaUIsV0FBVztBQUNoRjtBQUFBLFNBQ0M7QUFDRCxlQUFTLFdBQVEsVUFBVSxNQUFNLFNBQVMsZ0JBQWdCLFdBQVc7QUFDckU7QUFBQSxTQUNDO0FBQ0QsZUFBUyxXQUFPLFVBQVUsTUFBTSxTQUFTLGdCQUFnQixXQUFXO0FBQ3BFO0FBQUEsU0FDQztBQUNELGVBQVMsV0FBSyxVQUFVLE1BQU0sU0FBUyxnQkFBZ0Isa0JBQWlCLFdBQVc7QUFDbkY7QUFBQSxTQUNDO0FBQ0QsZUFBUyxZQUFRLE1BQU0sU0FBUyxnQkFBZ0Isa0JBQWlCLFdBQVc7QUFDNUU7QUFBQSxTQUNDO0FBQ0QsZUFBUyxZQUFLLFVBQVUsTUFBTSxTQUFTLGdCQUFnQixrQkFBaUIsV0FBVztBQUNuRjtBQUFBLFNBQ0M7QUFDRCxlQUFTLFFBQVEsY0FBYztBQUMvQjtBQUFBLFNBQ0M7QUFDRCxlQUFTLFlBQUssVUFBVSxNQUFNLFNBQVMsZ0JBQWdCLGtCQUFpQixXQUFXO0FBQ25GO0FBQUEsU0FDQztBQUNELGVBQVMsV0FBTyxNQUFNLFNBQVMsV0FBVztBQUMxQztBQUFBLFNBQ0M7QUFDRCxlQUFTLFlBQVMsTUFBTSxTQUFTLGdCQUFnQixrQkFBaUIsV0FBVztBQUM3RTtBQUFBO0FBRUEsY0FBUSxNQUFNLDRCQUE0QjtBQUFBO0FBR2xELFNBQU87QUFDWDtBQUVPLG1CQUFtQixTQUFpQjtBQUN2QyxTQUFPLFdBQVcsU0FBUyxRQUFRLFlBQVksQ0FBQztBQUNwRDtBQUVBLDZCQUFvQyxVQUF5QixhQUEyQixpQkFBeUI7QUFDN0csZ0JBQWMsV0FBVztBQUV6QixhQUFXLGtCQUF3QixVQUFVLFdBQVc7QUFDeEQsYUFBVyxrQkFBcUIsVUFBVSxXQUFXO0FBQ3JELGFBQVcsU0FBUyxRQUFRLHNCQUFzQixFQUFFLEVBQUUsUUFBUSwwQkFBMEIsRUFBRTtBQUUxRixhQUFXLE1BQU0saUJBQXFCLFVBQVUsYUFBYSxlQUFlO0FBQzVFLFNBQU87QUFDWDtBQUVPLGdDQUFnQyxNQUFjLFVBQWUsV0FBZ0I7QUFDaEYsTUFBSSxRQUFRO0FBQ1IsV0FBTyxnQkFBdUIsVUFBVSxTQUFTO0FBQUE7QUFFakQsV0FBTyxpQkFBb0IsVUFBVSxTQUFTO0FBQ3REO0FBRUEsNkJBQW1DO0FBQy9CLGFBQWlCO0FBQ3JCO0FBRUEsOEJBQW9DO0FBQ2hDLGNBQWtCO0FBQ3RCO0FBRUEsOEJBQXFDLGFBQTJCLGlCQUF3QjtBQUNwRixjQUFZLFNBQVMsb0JBQW9CLFlBQVksU0FBUztBQUNsRTtBQUVBLCtCQUFzQyxhQUEyQixpQkFBd0I7QUFFekY7OztBQzlGQTs7O0FDUEEsbUJBQW1CLE9BQWU7QUFDOUIsTUFBSSxJQUFJO0FBQ1IsYUFBVyxLQUFLLE9BQU87QUFDbkIsU0FBSyxRQUFTLFNBQVEsRUFBRSxXQUFXLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLEVBQUU7QUFBQSxFQUNqRTtBQUNBLFNBQU87QUFDWDtBQUVBLDBCQUEwQixNQUFxQixPQUFnQixNQUFhLFFBQWlCLFdBQXFDO0FBQzlILE1BQUksTUFBTTtBQUNWLGFBQVcsS0FBSyxPQUFPO0FBQ25CLFdBQU8sVUFBVSxJQUFJLElBQUksSUFBSTtBQUFBLEVBQ2pDO0FBQ0EsUUFBTSxJQUFJLFVBQVUsR0FBRyxJQUFJLFNBQVMsQ0FBQztBQUNyQyxRQUFNLEtBQUssT0FBTyxZQUFZLDBCQUF5QjtBQUN2RCxTQUFPLGFBQWEsTUFBTSxJQUFJLE9BQU8sS0FBSyxHQUFHLEdBQUcsTUFBTSxNQUFNO0FBQ2hFO0FBRUEsb0JBQW9CLE1BQWM7QUFDOUIsUUFBTSxNQUFNLEtBQUssUUFBUSxHQUFHO0FBQzVCLFNBQU8sS0FBSyxVQUFVLEdBQUcsR0FBRztBQUM1QixTQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssS0FBSyxTQUFTLEdBQUcsR0FBRztBQUM3QyxXQUFPLEtBQUssVUFBVSxHQUFHLEtBQUssU0FBUyxDQUFDO0FBQUEsRUFDNUM7QUFDQSxTQUFPO0FBQ1g7QUEwQkEsc0JBQXNCLE1BQW9CLFdBQWtCLE1BQWEsU0FBUyxNQUFNLFNBQVMsSUFBSSxjQUFjLEdBQUcsY0FBK0IsQ0FBQyxHQUFvQjtBQUN0SyxRQUFNLFdBQVc7QUFDakIsUUFBTSxLQUFLLEtBQUssT0FBTyxTQUFTO0FBQ2hDLE1BQUksTUFBTSxJQUFJO0FBQ1YsV0FBTztBQUFBLE1BQ0gsTUFBTSxPQUFPLEtBQUssSUFBSTtBQUFBLE1BQUcsT0FBTztBQUFBLElBQ3BDO0FBQUEsRUFDSjtBQUVBLFNBQU8sS0FBSyxLQUFLLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFFakMsU0FBTyxLQUFLLFVBQVUsS0FBSyxDQUFDO0FBRTVCLFFBQU0sTUFBTSxXQUFXLEtBQUssRUFBRTtBQUU5QixTQUFPLEtBQUssVUFBVSxVQUFVLEtBQUssSUFBSSxDQUFDO0FBRTFDLE1BQUk7QUFFSixNQUFJLFFBQVE7QUFDUixVQUFNLE1BQU0sUUFBUSxDQUFDLE1BQU0sS0FBSyxPQUFPLEdBQUcsR0FBRyxJQUFJO0FBQ2pELFFBQUksT0FBTyxJQUFJO0FBQ1gsa0JBQVksS0FBSyxVQUFVLEdBQUcsR0FBRztBQUNqQyxhQUFPLEtBQUssVUFBVSxHQUFHO0FBQ3pCLGFBQU8sS0FBSyxVQUFVLFVBQVUsS0FBSyxJQUFJLENBQUM7QUFBQSxJQUM5QyxPQUNLO0FBQ0QsWUFBTSxXQUFXLEtBQUssT0FBTyxTQUFTO0FBQ3RDLFVBQUksWUFBWSxJQUFJO0FBQ2hCLG9CQUFZO0FBQ1osZUFBTyxJQUFJLGNBQWM7QUFBQSxNQUM3QixPQUNLO0FBQ0Qsb0JBQVksS0FBSyxVQUFVLEdBQUcsUUFBUTtBQUN0QyxlQUFPLEtBQUssVUFBVSxRQUFRO0FBQUEsTUFDbEM7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUVBLGNBQVksS0FBSztBQUFBLElBQ2I7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxFQUNULENBQUM7QUFFRCxNQUFJLFlBQVksTUFBTTtBQUNsQixXQUFPO0FBQUEsTUFDSCxPQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFFQSxTQUFPLGFBQWEsTUFBTSxXQUFXLE1BQU0sUUFBUSxRQUFRLFdBQVc7QUFDMUU7QUFFQSxtQkFBbUIsTUFBYSxNQUFvQjtBQUNoRCxTQUFPLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSztBQUNyQztBQUVBLGlCQUFpQixPQUFpQixNQUFvQjtBQUVsRCxNQUFJLEtBQUssS0FBSyxRQUFRLE1BQU0sRUFBRTtBQUU5QixRQUFNLEtBQUssS0FBSyxRQUFRLE1BQU0sRUFBRTtBQUVoQyxNQUFJLE1BQU0sSUFBSTtBQUNWLFdBQU87QUFBQSxFQUNYO0FBRUEsTUFBSSxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ3JCO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBUSxPQUFPLEtBQUssVUFBVSxFQUFFLENBQUMsSUFBSSxNQUFNLEdBQUc7QUFDaEUsV0FBTyxPQUFPLFFBQVEsT0FBTyxLQUFLLFVBQVUsSUFBSSxDQUFDO0FBQUEsRUFDckQsT0FDSztBQUNELFdBQU87QUFBQSxFQUNYO0FBQ0o7OztBQzVIQTs7O0FDTEE7OztBQ0FBO0FBTUE7QUFJQTs7O0FDUEE7QUFFQSx5QkFBa0M7QUFBQSxFQU85QixZQUFZLFVBQWlCO0FBQ3pCLFNBQUssV0FBVyxTQUFTLE9BQU8sS0FBSyxXQUFXO0FBQUEsRUFDcEQ7QUFBQSxRQUVNLE9BQU07QUFDUixTQUFLLFlBQVksTUFBTSxlQUFPLGFBQWEsS0FBSyxRQUFRO0FBQ3hELFVBQU0sWUFBdUQsQ0FBQztBQUU5RCxRQUFJLFVBQVU7QUFDZCxlQUFVLFVBQVEsS0FBSyxXQUFVO0FBQzdCLFlBQU0sVUFBVSxLQUFLLFVBQVU7QUFDL0IsaUJBQVUsTUFBTSxRQUFRLFFBQU87QUFDM0Isa0JBQVUsS0FBSyxFQUFDLElBQUksV0FBVyxNQUFNLFFBQVEsT0FBTyxLQUFLLEtBQUssSUFBSSxVQUFRLEtBQUksQ0FBQztBQUFBLE1BQ25GO0FBQ0EsZ0JBQVUsS0FBSyxFQUFDLElBQUksV0FBVyxNQUFNLFFBQVEsTUFBTSxLQUFLLElBQUksU0FBTSxDQUFDO0FBQUEsSUFDdkU7QUFFQSxTQUFLLGFBQWEsSUFBSSxXQUFXO0FBQUEsTUFDN0IsUUFBUSxDQUFDLE1BQU07QUFBQSxNQUNmLGFBQWEsQ0FBQyxNQUFNLFFBQVEsS0FBSztBQUFBLElBQ3JDLENBQUM7QUFFRCxVQUFNLEtBQUssV0FBVyxZQUFZLFNBQVM7QUFBQSxFQUMvQztBQUFBLEVBWUEsT0FBTyxNQUFjLFVBQXlFLEVBQUMsT0FBTyxNQUFNLFFBQVEsS0FBSyxtQkFBbUIsTUFBSyxHQUFHLE1BQU0sS0FBb0Q7QUFDMU0sVUFBTSxPQUFZLEtBQUssV0FBVyxPQUFPLE1BQU0sT0FBTztBQUN0RCxRQUFHLENBQUM7QUFBSyxhQUFPO0FBRWhCLGVBQVUsS0FBSyxNQUFLO0FBQ2hCLGlCQUFVLFFBQVEsRUFBRSxPQUFNO0FBQ3RCLFlBQUcsUUFBUSxVQUFVLEVBQUUsS0FBSyxTQUFTLFFBQVEsUUFBTztBQUNoRCxnQkFBTSxZQUFZLEVBQUUsS0FBSyxVQUFVLEdBQUcsUUFBUSxNQUFNO0FBQ3BELGNBQUcsRUFBRSxLQUFLLFFBQVEsUUFBUSxLQUFLLEtBQUssSUFBRztBQUNuQyxjQUFFLE9BQU8sVUFBVSxVQUFVLEdBQUcsVUFBVSxZQUFZLEdBQUcsQ0FBQyxJQUFLLFNBQVEscUJBQXFCO0FBQUEsVUFDaEcsT0FBTztBQUNILGNBQUUsT0FBTztBQUFBLFVBQ2I7QUFDQSxZQUFFLE9BQU8sRUFBRSxLQUFLLEtBQUs7QUFBQSxRQUN6QjtBQUVBLFlBQUksUUFBUSxFQUFFLEtBQUssWUFBWSxHQUFHLFVBQVU7QUFDNUMsWUFBSSxRQUFRLE1BQU0sUUFBUSxJQUFJO0FBQzlCLFlBQUksYUFBYTtBQUVqQixlQUFNLFNBQVMsSUFBRztBQUNkLHFCQUFXLEVBQUUsS0FBSyxVQUFVLFlBQVksYUFBYSxLQUFLLElBQUssSUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVLFFBQVEsWUFBWSxRQUFRLEtBQUssU0FBUyxVQUFVLE1BQU07QUFDckosa0JBQVEsTUFBTSxVQUFVLFFBQVEsS0FBSyxNQUFNO0FBQzNDLHdCQUFjLFFBQVEsS0FBSztBQUMzQixrQkFBUSxNQUFNLFFBQVEsSUFBSTtBQUFBLFFBQzlCO0FBRUEsVUFBRSxPQUFPLFVBQVUsRUFBRSxLQUFLLFVBQVUsVUFBVTtBQUFBLE1BQ2xEO0FBQUEsSUFDSjtBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFQSxRQUFRLE1BQWMsU0FBdUI7QUFDekMsV0FBTyxLQUFLLFdBQVcsWUFBWSxNQUFNLE9BQU87QUFBQSxFQUNwRDtBQUNKOzs7QUNqRmUsaUNBQVU7QUFDckIsU0FBTyxFQUFDLGtCQUFVLGFBQVk7QUFDbEM7OztBQ0ZPLElBQU0sYUFBYSxDQUFDLHVCQUFXO0FBQ3ZCLHFCQUFxQixjQUEyQjtBQUUzRCxVQUFRO0FBQUEsU0FFQztBQUNELGFBQU8sc0JBQWM7QUFBQTtBQUVyQixhQUFPO0FBQUE7QUFFbkI7QUFFTyx3QkFBd0IsY0FBc0I7QUFDakQsUUFBTSxPQUFPLFlBQVksWUFBWTtBQUNyQyxNQUFJO0FBQU0sV0FBTztBQUNqQixTQUFPLE9BQU87QUFDbEI7OztBQ2hCTyxzQkFBc0IsY0FBc0IsV0FBbUI7QUFDbEUsU0FBTyxZQUFZLFNBQVMsU0FBUyxLQUFLLFdBQVcsU0FBUyxZQUFZO0FBQzlFO0FBRUEsNEJBQTJDLGNBQXNCLFVBQWtCLFdBQW1CLFVBQXNDO0FBQ3hJLFFBQU0sY0FBYyxNQUFNLFlBQVksWUFBWTtBQUNsRCxNQUFJO0FBQWEsV0FBTztBQUN4QixTQUFPLGtCQUFrQixVQUFVLFNBQVM7QUFDaEQ7OztBSlNBLDZCQUNFLE1BQ0EsWUFDQTtBQUNBLFNBQU8sTUFBTSxXQUFXLHNCQUFzQixNQUFNLFVBQVU7QUFDOUQsU0FBTztBQUNUO0FBRUEsbUJBQWtCLE1BQWMsU0FBa0IsS0FBYSxNQUFjLFFBQWlCO0FBQzVGLFNBQU8sR0FBRyxVQUFVLDZDQUE2QyxvQkFBb0IsU0FBUyxvQkFBb0IsR0FBRyxrQkFDbEcsU0FBUyxvQkFBb0IsSUFBSSxzQ0FDYixTQUFTLE1BQU0sU0FBUyx3REFBd0Q7QUFBQTtBQUN6SDtBQVlBLDRCQUEyQixVQUFrQixVQUF5QixjQUF1QixTQUFrQixFQUFFLFFBQVEsZUFBZSxVQUFVLGFBQWEsQ0FBQyxTQUFTLGVBQTZHLENBQUMsR0FBb0I7QUFDelMsUUFBTSxVQUE0QixTQUFTO0FBQUEsSUFDekMsS0FBSyxhQUFhO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ04sUUFBUSxlQUFlLGVBQWU7QUFBQSxTQUNuQyxVQUFXLGdCQUFlLE9BQU8sUUFBUSxTQUFTO0FBQUEsSUFFekQsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLElBQ1IsVUFBVTtBQUFBLElBQ1YsWUFBWSxVQUFXLGFBQWEsT0FBTyxXQUFZO0FBQUEsSUFDdkQsWUFBWSxZQUFZLE1BQUssU0FBUyxNQUFLLFFBQVEsUUFBUSxHQUFHLFFBQVE7QUFBQSxFQUN4RSxDQUFDO0FBRUQsTUFBSSxTQUFTLE1BQU0sY0FBYyxZQUFZLE1BQU0sTUFBTSxlQUFPLFNBQVMsUUFBUSxHQUFHLEVBQUUsT0FBTyxLQUFLLFFBQVEsQ0FBQztBQUMzRyxXQUFTLFVBQ1AsUUFDQSxTQUNBLE1BQUssUUFBUSxZQUFZLEdBQ3pCLGNBQ0EsTUFDRjtBQUVBLE1BQUk7QUFDRixVQUFNLEVBQUUsTUFBTSxRQUFRLE1BQU0sV0FBVSxRQUFRLE9BQU87QUFDckQsYUFBUyxjQUFjLE9BQVEsT0FBTSxlQUFlLFlBQVksTUFBTSxHQUFHLEdBQUcsZUFBZSxRQUFRLEtBQUs7QUFBQSxFQUUxRyxTQUFTLEtBQVA7QUFDQSxRQUFJLFlBQVk7QUFDZCxxQ0FBK0IsWUFBWSxHQUFHO0FBQUEsSUFDaEQsT0FBTztBQUNMLHdCQUFrQixHQUFHO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBRUEsTUFBSSxVQUFVO0FBQ1osVUFBTSxlQUFPLGFBQWEsTUFBSyxRQUFRLFFBQVEsQ0FBQztBQUNoRCxVQUFNLGVBQU8sVUFBVSxVQUFVLE1BQU07QUFBQSxFQUN6QztBQUNBLFNBQU87QUFDVDtBQUVBLGlCQUFpQixVQUFrQjtBQUNqQyxTQUFPLFNBQVMsU0FBUyxLQUFLO0FBQ2hDO0FBRUEsb0NBQTJDLGNBQXNCLFdBQXFCLFVBQVUsT0FBTztBQUNyRyxRQUFNLGVBQU8sYUFBYSxjQUFjLFVBQVUsRUFBRTtBQUVwRCxTQUFPLE1BQU0sYUFDWCxVQUFVLEtBQUssY0FDZixVQUFVLEtBQUssZUFBZSxRQUM5QixRQUFRLFlBQVksR0FDcEIsT0FDRjtBQUNGO0FBRU8sc0JBQXNCLFVBQWtCO0FBQzdDLFFBQU0sVUFBVSxNQUFLLFFBQVEsUUFBUTtBQUVyQyxNQUFJLGNBQWMsZUFBZSxTQUFTLFFBQVEsVUFBVSxDQUFDLENBQUM7QUFDNUQsZ0JBQVksTUFBTyxNQUFLLElBQUksT0FBTztBQUFBLFdBQzVCLFdBQVc7QUFDbEIsZ0JBQVksTUFBTSxjQUFjLGFBQWEsS0FBSyxJQUFJLE9BQU87QUFFL0QsU0FBTztBQUNUO0FBRUEsSUFBTSxlQUFlLENBQUM7QUFBdEIsSUFBeUIsYUFBYSxDQUFDO0FBVXZDLDBCQUF5QyxZQUFzQixjQUFzQixXQUFxQixFQUFFLFVBQVUsT0FBTyxTQUFTLGVBQWUsQ0FBQyxHQUFHLGVBQTZHO0FBQ3BRLE1BQUk7QUFDSixRQUFNLGVBQWUsTUFBSyxVQUFVLGFBQWEsWUFBWSxDQUFDO0FBRTlELGlCQUFlLGFBQWEsWUFBWTtBQUN4QyxRQUFNLFlBQVksTUFBSyxRQUFRLFlBQVksRUFBRSxVQUFVLENBQUMsR0FBRyxhQUFhLGFBQWEsY0FBYyxTQUFTLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxFQUFFLFNBQVMsU0FBUztBQUNqSixRQUFNLG1CQUFtQixNQUFLLEtBQUssVUFBVSxJQUFJLFlBQVksR0FBRyxXQUFXLE1BQUssS0FBSyxVQUFVLElBQUksWUFBWTtBQUUvRyxNQUFHLFdBQVcsU0FBUyxnQkFBZ0IsR0FBRTtBQUN2QyxVQUFNLENBQUMsVUFBVSxhQUFhLGVBQWU7QUFBQSxNQUMzQyxNQUFNO0FBQUEsTUFDTixXQUFXO0FBQUEsTUFDWCxNQUFNLFdBQVcsMERBQTBELFdBQVcsTUFBTSxXQUFXLFFBQVEsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLFFBQVEsRUFBRSxLQUFLLE9BQU87QUFBQSxJQUNqSyxDQUFDO0FBQ0QsVUFBTSxVQUFVLFNBQVM7QUFDekIsaUJBQWEsb0JBQW9CO0FBQ2pDLFlBQVEsZ0JBQWdCLEVBQUUsVUFBVSxHQUFHO0FBQ3ZDLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSTtBQUNKLE1BQUksQ0FBQyxhQUFhO0FBQ2hCLFFBQUksQ0FBQyxhQUFhO0FBQ2hCLG1CQUFhLG9CQUFvQixJQUFJLFFBQVEsT0FBSyxhQUFhLENBQUM7QUFBQSxhQUN6RCxhQUFhLDZCQUE2QjtBQUNqRCxZQUFNLGFBQWE7QUFBQSxFQUN2QjtBQUlBLFFBQU0sVUFBVSxDQUFDLFNBQVMsTUFBTSxxQkFBcUIsU0FBUyxNQUFNLHFCQUFzQixhQUFZLE1BQU0sZUFBTyxLQUFLLFVBQVUsV0FBVyxNQUFNLElBQUk7QUFHdkosTUFBSSxTQUFTO0FBQ1gsZ0JBQVksYUFBYSxNQUFNLGVBQU8sS0FBSyxVQUFVLFdBQVcsTUFBTSxJQUFJO0FBQzFFLFFBQUksYUFBYSxNQUFNO0FBQ3JCLFlBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLFFBQzNDLE1BQU07QUFBQSxRQUNOLFdBQVc7QUFBQSxRQUNYLE1BQU0sV0FBVyw4Q0FBOEMsY0FBYyxtQkFBbUIsV0FBVyxHQUFHLEVBQUU7QUFBQSxNQUNsSCxDQUFDO0FBQ0QsWUFBTSxVQUFVLFNBQVM7QUFDekIsbUJBQWEsb0JBQW9CO0FBQ2pDLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxDQUFDO0FBQ0gsWUFBTSxxQkFBcUIsY0FBYyxXQUFXLE9BQU87QUFDN0QsYUFBUyxPQUFPLGtCQUFrQixTQUFTO0FBQUEsRUFDN0M7QUFFQSxNQUFJLFNBQVM7QUFDWCxZQUFRLGdCQUFnQixFQUFFLFVBQVUsVUFBVTtBQUM5QyxjQUFVLFFBQVE7QUFBQSxFQUNwQjtBQUVBLFFBQU0sbUJBQW1CLGFBQWEsTUFBTTtBQUM1QyxNQUFJO0FBQ0YsaUJBQWEsTUFBTTtBQUFBLFdBQ1osQ0FBQyxXQUFXLGFBQWEscUJBQXFCLENBQUUsY0FBYSw2QkFBNkI7QUFDakcsV0FBTyxhQUFhO0FBRXRCLHNCQUFvQixHQUFXO0FBQzdCLFFBQUksTUFBSyxXQUFXLENBQUM7QUFDbkIsVUFBSSxNQUFLLFNBQVMsR0FBRyxVQUFVLEVBQUU7QUFBQSxTQUM5QjtBQUNILFVBQUksRUFBRSxNQUFNLEtBQUs7QUFDZixZQUFJLE1BQUssS0FBSyxNQUFLLFFBQVEsWUFBWSxHQUFHLENBQUM7QUFBQSxNQUM3QyxXQUNTLEVBQUUsTUFBTTtBQUNmLGVBQU8sZUFBZSxDQUFDO0FBQUEsSUFDM0I7QUFFQSxXQUFPLFdBQVcsQ0FBQyxHQUFHLFlBQVksZ0JBQWdCLEdBQUcsR0FBRyxXQUFXLEVBQUUsU0FBUyxTQUFTLGNBQWMsbUJBQW1CLGVBQWUsQ0FBQyxFQUFFLENBQUM7QUFBQSxFQUM3STtBQUVBLE1BQUk7QUFDSixNQUFJLFlBQVk7QUFDZCxlQUFXLE1BQU0sYUFBYSxjQUFjLFVBQVUsV0FBVyxVQUFVO0FBQUEsRUFDN0UsT0FBTztBQUNMLFVBQU0sY0FBYyxNQUFLLEtBQUssVUFBVSxJQUFJLGVBQWUsTUFBTTtBQUNqRSxlQUFXLG9CQUFtQixXQUFXO0FBRXpDLFFBQUksYUFBYTtBQUNmLGlCQUFXLG9CQUFvQixNQUFNLFNBQVMsVUFBVTtBQUN4RDtBQUFBLElBQ0Y7QUFFQSxRQUFJO0FBQ0YsaUJBQVcsTUFBTSxTQUFTLFVBQVU7QUFBQSxJQUN0QyxTQUNRLEtBQVA7QUFDQyxZQUFNLENBQUMsVUFBVSxhQUFhLGVBQWU7QUFBQSxRQUMzQyxNQUFNO0FBQUEsUUFDTixXQUFXO0FBQUEsUUFDWCxNQUFNLEdBQUcsSUFBSSxpQkFBaUIsV0FBVyxPQUFPLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxPQUFPO0FBQUEsTUFDbEYsQ0FBQztBQUNELFlBQU0sVUFBVSxTQUFTO0FBQUEsSUFDMUI7QUFBQSxFQUNIO0FBR0EsZUFBYSxvQkFBb0I7QUFDakMsZUFBYTtBQUdiLFNBQU87QUFDVDtBQUVBLDBCQUFpQyxZQUFvQixjQUFzQixXQUFxQixVQUFVLE9BQU8sU0FBd0IsY0FBeUI7QUFDaEssTUFBSSxDQUFDLFNBQVM7QUFDWixVQUFNLG1CQUFtQixNQUFLLEtBQUssVUFBVSxJQUFJLGFBQWEsWUFBWSxDQUFDO0FBQzNFLFVBQU0sYUFBYSxhQUFhO0FBRWhDLFFBQUksY0FBYztBQUNoQixhQUFPO0FBQUEsYUFDQSxXQUFXLG1CQUFtQjtBQUNyQyxZQUFNLFVBQVMsTUFBTSxXQUFXLGtCQUFrQjtBQUNsRCxtQkFBYSxvQkFBb0I7QUFDakMsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBRUEsU0FBTyxXQUFXLENBQUMsVUFBVSxHQUFHLGNBQWMsV0FBVyxFQUFFLFNBQVMsU0FBUyxhQUFhLENBQUM7QUFDN0Y7QUFFQSwyQkFBa0MsVUFBa0IsU0FBa0I7QUFFcEUsUUFBTSxXQUFXLE1BQUssS0FBSyxZQUFZLFFBQVEsTUFBSyxPQUFPO0FBRTNELFFBQU0sYUFDSixVQUNBLFVBQ0EsUUFBUSxRQUFRLEdBQ2hCLE9BQ0Y7QUFFQSxRQUFNLFdBQVcsTUFBTSxvQkFBbUIsUUFBUTtBQUNsRCxpQkFBTyxPQUFPLFFBQVE7QUFFdEIsU0FBTyxNQUFNLFNBQVMsQ0FBQyxXQUFpQixPQUFPLE9BQUs7QUFDdEQ7QUE4QkEsNkJBQW9DLGFBQXFCLGdCQUF3QiwwQkFBa0MsV0FBcUIsY0FBdUIsU0FBa0IsWUFBMkI7QUFDMU0sUUFBTSxlQUFPLGFBQWEsMEJBQTBCLFVBQVUsRUFBRTtBQUVoRSxRQUFNLG1CQUFtQixpQkFBaUI7QUFDMUMsUUFBTSxlQUFlLFVBQVUsS0FBSztBQUVwQyxRQUFNLGFBQ0osZ0JBQ0Esa0JBQ0EsY0FDQSxTQUNBLEVBQUUsUUFBUSxhQUFhLFlBQVksY0FBYyxZQUFZLE1BQU0sQ0FDckU7QUFFQSxzQkFBb0IsR0FBVztBQUM3QixRQUFJLE1BQUssV0FBVyxDQUFDO0FBQ25CLFVBQUksTUFBSyxTQUFTLEdBQUcsVUFBVSxFQUFFO0FBQUEsU0FDOUI7QUFDSCxVQUFJLEVBQUUsTUFBTSxLQUFLO0FBQ2YsWUFBSSxNQUFLLEtBQUssMEJBQTBCLENBQUM7QUFBQSxNQUUzQyxXQUNTLEVBQUUsTUFBTTtBQUNmLGVBQU8sZUFBZSxDQUFDO0FBQUEsSUFDM0I7QUFFQSxXQUFPLFdBQVcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxXQUFXLEVBQUUsUUFBUSxDQUFDO0FBQUEsRUFDN0Q7QUFFQSxRQUFNLFdBQVcsTUFBTSxvQkFBbUIsZ0JBQWdCO0FBQzFELFNBQU8sVUFBVSxRQUFlLE1BQU0sU0FBUyxZQUFZLEdBQUcsR0FBRztBQUNuRTs7O0FLaFVBLElBQU0sY0FBYztBQUFBLEVBQ2hCLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxFQUNWLFlBQVk7QUFDaEI7QUFFQSw2QkFBNEMsTUFBcUIsU0FBZTtBQUM1RSxRQUFNLFNBQVMsTUFBTSxXQUFXLEtBQUssRUFBRTtBQUN2QyxRQUFNLFFBQVEsSUFBSSxjQUFjO0FBRWhDLGFBQVcsS0FBSyxRQUFRO0FBQ3BCLFVBQU0sWUFBWSxLQUFLLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRztBQUMvQyxZQUFRLEVBQUU7QUFBQSxXQUNEO0FBQ0QsY0FBTSxLQUFLLFNBQVM7QUFDcEI7QUFBQSxXQUNDO0FBQ0QsY0FBTSxVQUFVO0FBQ2hCO0FBQUEsV0FDQztBQUNELGNBQU0sV0FBVztBQUNqQjtBQUFBLFdBQ0M7QUFDRCxjQUFNLFdBQVc7QUFDakI7QUFBQTtBQUVBLGNBQU0sVUFBVSxZQUFZLEVBQUUsUUFBUTtBQUFBO0FBQUEsRUFFbEQ7QUFFQSxTQUFPO0FBQ1g7QUFTQSxpQ0FBd0MsTUFBcUIsTUFBYyxRQUFnQjtBQUN2RixRQUFNLFNBQVMsTUFBTSxlQUFlLEtBQUssSUFBSSxJQUFJO0FBQ2pELFFBQU0sUUFBUSxJQUFJLGNBQWM7QUFFaEMsV0FBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLFFBQVEsS0FBSyxHQUFHO0FBQ3ZDLFFBQUksT0FBTyxNQUFNLE9BQU8sSUFBSTtBQUN4QixZQUFNLEtBQUssS0FBSyxVQUFVLE9BQU8sSUFBSSxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ3ZELFVBQU0sWUFBWSxLQUFLLFVBQVUsT0FBTyxJQUFJLElBQUksT0FBTyxJQUFJLEVBQUU7QUFDN0QsVUFBTSxVQUFVLFNBQVM7QUFBQSxFQUM3QjtBQUVBLFFBQU0sS0FBSyxLQUFLLFVBQVcsUUFBTyxHQUFHLEVBQUUsS0FBRyxNQUFNLENBQUMsQ0FBQztBQUVsRCxTQUFPO0FBQ1g7OztBTjVDQSxxQkFBOEI7QUFBQSxFQUUxQixZQUFtQixRQUE4QixhQUFrQyxXQUEwQixPQUFlO0FBQXpHO0FBQThCO0FBQWtDO0FBQTBCO0FBRDdHLGtCQUFTLENBQUM7QUFBQSxFQUdWO0FBQUEsRUFFUSxlQUFlLFNBQTBCO0FBQzdDLFVBQU0sUUFBUSxJQUFJLGNBQWM7QUFDaEMsVUFBTSxvQkFBb0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBS3hCO0FBRUYsZUFBVyxLQUFLLFNBQVM7QUFDckIsWUFBTSxvQkFBb0I7QUFBQSxvREFBdUQ7QUFDakYsWUFBTSxLQUFLLENBQUM7QUFBQSxJQUNoQjtBQUVBLFVBQU0sb0JBQW9CO0FBQUEsb0JBQXVCO0FBQ2pELFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFUSxRQUFRLFlBQTJCO0FBQ3ZDLFVBQU0sY0FBYyxNQUFNLGdCQUFnQixLQUFLLFlBQVksU0FBUztBQUNwRSxXQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsTUFDUixPQUFPO0FBQUEsUUFDSCxLQUFLLFlBQVksT0FBTyxLQUFLLEtBQUssV0FBVztBQUFBLFFBQzdDLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxXQUFXO0FBQUEsUUFDNUMsQ0FBQyxLQUFVLFVBQWUsS0FBSyxPQUFPLE9BQU8sR0FBRyxLQUFLO0FBQUEsUUFDckQsS0FBSyxZQUFZO0FBQUEsUUFDakIsS0FBSyxZQUFZO0FBQUEsUUFDakIsT0FBSyxRQUFRLEtBQUssWUFBWSxRQUFRO0FBQUEsUUFDdEM7QUFBQSxRQUNBLGNBQWMsQ0FBQztBQUFBLE1BQ25CO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUVRLFlBQVksUUFBa0IsY0FBa0M7QUFDcEUsVUFBTSxRQUFRLElBQUksY0FBYztBQUVoQyxlQUFXLEtBQUssT0FBTyxRQUFRO0FBQzNCLFVBQUksRUFBRSxRQUFRLFFBQVE7QUFDbEIsY0FBTSxLQUFLLEVBQUUsSUFBSTtBQUNqQjtBQUFBLE1BQ0o7QUFFQSxZQUFNLG9CQUFvQixhQUFhLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxnQkFBZ0IsSUFBSTtBQUFBLElBQ2xGO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxRQUVNLFFBQVEsWUFBbUQ7QUFFN0QsVUFBTSxZQUFZLEtBQUssWUFBWSxtQkFBbUIsS0FBSztBQUMzRCxRQUFJO0FBQ0EsYUFBUSxPQUFNLFdBQVcsS0FBSyxRQUFRLFVBQVUsRUFBRSxLQUFLO0FBQzNELFFBQUk7QUFDSixTQUFLLFlBQVksbUJBQW1CLEtBQUssYUFBYSxJQUFJLFFBQVEsT0FBSyxXQUFXLENBQUM7QUFHbkYsU0FBSyxTQUFTLE1BQU0sa0JBQWtCLEtBQUssUUFBUSxZQUFZLEdBQUc7QUFDbEUsVUFBTSxTQUFTLElBQUksU0FBUyxLQUFLLFFBQVEsS0FBSyxXQUFXLE9BQU8sSUFBSTtBQUNwRSxVQUFNLE9BQU8sWUFBWTtBQUV6QixRQUFJLE9BQU8sT0FBTyxVQUFVLEtBQUssT0FBTyxPQUFPLEdBQUcsU0FBUyxRQUFRO0FBQy9ELFlBQU0sV0FBVSxNQUFNLEtBQUs7QUFDM0IsZUFBUyxRQUFPO0FBQ2hCLFdBQUssWUFBWSxtQkFBbUIsS0FBSyxhQUFhO0FBQ3RELGFBQU8sS0FBSztBQUFBLElBQ2hCO0FBRUEsVUFBTSxDQUFDLE1BQU0sWUFBWSxXQUFXLEtBQUssS0FBSyxTQUFTLEdBQUcsWUFBWSxTQUFTLFNBQVMsU0FBUyxRQUM3RixjQUFjLFVBQVUsS0FBSyxXQUFXO0FBQzVDLFVBQU0sZUFBTyxhQUFhLFVBQVUsVUFBVSxFQUFFO0FBRWhELFVBQU0sWUFBVyxLQUFLLGVBQWUsT0FBTyxPQUFPLE9BQU8sT0FBSyxFQUFFLFFBQVEsTUFBTSxFQUFFLElBQUksT0FBSyxFQUFFLElBQUksQ0FBQztBQUNqRyxVQUFNLEVBQUUsT0FBTyxXQUFXLEtBQUssUUFBUSxVQUFVO0FBRWpELFVBQU0sV0FBVyxNQUFNLGNBQWMsUUFBUSxhQUFhLFVBQVUsV0FBVyxLQUFLLE1BQU0sS0FBSyxZQUFZLE9BQU8sU0FBUTtBQUUxSCxVQUFNLFVBQVUsT0FBTyxXQUFpQjtBQUNwQyxVQUFJO0FBQ0EsZUFBTyxLQUFLLFlBQVksUUFBUSxNQUFNLFNBQVMsR0FBRyxNQUFLLENBQUM7QUFBQSxNQUM1RCxTQUFRLEtBQU47QUFDRSxjQUFNLENBQUMsVUFBVSxhQUFhLGVBQWU7QUFBQSxVQUN6QyxXQUFXO0FBQUEsVUFDWCxNQUFNLElBQUk7QUFBQSxVQUNWLE1BQU07QUFBQSxRQUNWLENBQUM7QUFDRCxjQUFNLFVBQVUsU0FBUztBQUFBLE1BQzdCO0FBQUEsSUFDSjtBQUNBLFNBQUssWUFBWSxtQkFBbUIsS0FBSyxhQUFhO0FBQ3RELFVBQU0sWUFBWSxNQUFNLFFBQVEsS0FBSztBQUNyQyxhQUFTLE9BQU87QUFFaEIsV0FBTztBQUFBLEVBQ1g7QUFDSjs7O0FEdkdBLElBQU0sZ0JBQWdCLENBQUMsVUFBVTtBQUMxQixJQUFNLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRTtBQUVyQyw4QkFBOEIsTUFTM0I7QUFDQyxRQUFNLFNBQVEsTUFBTSxLQUFLLEtBQUssa0JBQWtCLENBQUMsSUFBSSxDQUFDO0FBQ3RELFNBQU8sS0FBSyxNQUFNLE1BQUs7QUFDM0I7QUFFQSwwQkFBbUM7QUFBQSxFQUsvQixZQUFvQixhQUFtQyxNQUE2QixPQUFnQjtBQUFoRjtBQUFtQztBQUE2QjtBQUg3RSxzQkFBYSxJQUFJLGNBQWM7QUFFL0Isc0JBQTRFLENBQUM7QUFBQSxFQUVwRjtBQUFBLEVBRUEsV0FBVyxXQUFvQjtBQUMzQixRQUFJLENBQUM7QUFBVztBQUVoQixVQUFNLGNBQWMsS0FBSyxPQUFPLFNBQVM7QUFDekMsUUFBSSxlQUFlO0FBQU07QUFFekIsUUFBSSxLQUFLLFlBQVksT0FBTztBQUN4QixZQUFNLFNBQVEsSUFBSSxjQUFjO0FBQ2hDLGFBQU0sWUFBWSxLQUFLO0FBQ3ZCLGFBQU0sYUFBYSxDQUFDLEdBQUcsS0FBSyxZQUFZLEVBQUUsS0FBSyxXQUFXLE9BQU8sS0FBSyxDQUFDO0FBRXZFLGFBQU0sUUFBUTtBQUVkLHFCQUFPLFVBQVUsS0FBSyxZQUFZLFVBQVUsT0FBTSxVQUFVLEVBQUU7QUFFOUQsWUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsUUFDekMsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsTUFBTSwrQ0FBaUQsS0FBSyxZQUFZO0FBQUEsTUFDNUUsQ0FBQztBQUNELFlBQU0sVUFBVSxTQUFTO0FBQUEsSUFDN0I7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUFBLFFBRU0sYUFBYSxVQUFrQixXQUFtQixVQUFrQixFQUFFLFlBQVksZ0JBQXNFO0FBQzFKLFVBQU0sTUFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLEtBQUssYUFBYSxXQUFXLEtBQUssSUFBSTtBQUMxRSxTQUFLLE9BQU8sTUFBTSxJQUFJLFFBQVEsVUFBVTtBQUV4QyxVQUFNLEtBQUssVUFBVSxLQUFLLElBQUk7QUFDOUIsUUFBRyxLQUFLLFdBQVcsWUFBWSxHQUFFO0FBQzdCLGFBQU87QUFBQSxJQUNYO0FBRUEsVUFBTSxLQUFLLGFBQWEsVUFBVSxXQUFXLEtBQUssTUFBTSxRQUFRO0FBRWhFLFNBQUssV0FBVyxrQ0FBSyxTQUFTLFNBQVcsSUFBSSxPQUFRO0FBRXJELFdBQU87QUFBQSxFQUNYO0FBQUEsUUFFYyxVQUFVLE1BQXFCO0FBQ3pDLFVBQU0sU0FBUyxNQUFNLGVBQWUsS0FBSyxFQUFFO0FBRTNDLFFBQUcsT0FBTyxTQUFTLE9BQU8sS0FBSTtBQUMxQixXQUFLLFlBQVk7QUFDakI7QUFBQSxJQUNKO0FBRUEsZUFBVSxFQUFDLE1BQUssS0FBSSxLQUFJLFdBQVUsT0FBTyxRQUFPO0FBQzVDLFdBQUssV0FBVyxLQUFLLEVBQUMsS0FBSyxPQUFPLFVBQVUsTUFBTSxPQUFNLEtBQUssVUFBVSxPQUFPLEdBQUcsR0FBRyxLQUFJLENBQUM7QUFBQSxJQUM3RjtBQUVBLFNBQUssWUFBWSxLQUFLLFVBQVUsR0FBRyxPQUFPLEtBQUssRUFBRSxLQUFLLEtBQUssVUFBVSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFVBQVU7QUFBQSxFQUNoRztBQUFBLEVBRVEsVUFBVTtBQUNkLFFBQUksQ0FBQyxLQUFLLFdBQVc7QUFBUSxhQUFPLEtBQUs7QUFDekMsVUFBTSxRQUFRLElBQUksY0FBYyxNQUFNLElBQUk7QUFFMUMsZUFBVyxFQUFFLEtBQUssT0FBTyxVQUFVLEtBQUssWUFBWTtBQUNoRCxVQUFJLFVBQVUsTUFBTTtBQUNoQixjQUFNLFFBQVEsT0FBTyxPQUFPLFFBQVE7QUFBQSxNQUN4QyxPQUFPO0FBQ0gsY0FBTSxRQUFRO0FBQUEsTUFDbEI7QUFBQSxJQUNKO0FBRUEsU0FBSyxZQUFZLE1BQU0sVUFBVSxHQUFHLE1BQU0sU0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUUsS0FBSyxLQUFLLFNBQVM7QUFBQSxFQUN2RjtBQUFBLGVBRWEsdUJBQXVCLE1BQXFCO0FBQ3JELFVBQU0sU0FBUSxJQUFJLGNBQWM7QUFDaEMsVUFBTSxRQUFRLElBQUksY0FBYztBQUNoQyxVQUFNLE9BQU0sVUFBVSxJQUFJO0FBRTFCLGVBQVcsUUFBUSxPQUFNLFFBQVEsU0FBUyxHQUFHO0FBQ3pDLFVBQUcsY0FBYyxTQUFTLEtBQUssWUFBWSxDQUFDO0FBQUc7QUFDL0MsYUFBTSxJQUFJLElBQUk7QUFDZCxZQUFNLG9CQUFvQixLQUFLLFVBQVUsWUFBWSxPQUFPO0FBQUEsSUFDaEU7QUFFQSxXQUFNLFFBQVE7QUFFZCxXQUFPLE9BQU0sVUFBVSxLQUFLLEtBQUs7QUFBQSxFQUNyQztBQUFBLEVBRUEsSUFBSSxNQUFjO0FBQ2QsV0FBTyxLQUFLLFdBQVcsS0FBSyxPQUFLLEVBQUUsUUFBUSxJQUFJLEdBQUc7QUFBQSxFQUN0RDtBQUFBLEVBRUEsSUFBSSxNQUFjO0FBQ2QsV0FBTyxLQUFLLFdBQVcsT0FBTyxLQUFLLFdBQVcsVUFBVSxPQUFLLEVBQUUsUUFBUSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUk7QUFBQSxFQUN6RjtBQUFBLEVBRUEsT0FBTyxNQUFjO0FBQ2pCLFVBQU0sV0FBVyxLQUFLLFdBQVcsVUFBVSxPQUFLLEVBQUUsSUFBSSxZQUFZLEtBQUssSUFBSTtBQUUzRSxRQUFJLFlBQVk7QUFDWixhQUFPLEtBQUssV0FBVyxPQUFPLFVBQVUsQ0FBQyxFQUFFLEdBQUc7QUFFbEQsVUFBTSxRQUFRLGlCQUFZLEtBQUssV0FBVyxDQUFDLElBQUksR0FBRyxHQUFHO0FBRXJELFFBQUksQ0FBQyxNQUFNLE1BQU07QUFBSTtBQUVyQixTQUFLLFlBQVksTUFBTTtBQUV2QixXQUFPLE1BQU0sTUFBTSxHQUFHLEtBQUssS0FBSztBQUFBLEVBQ3BDO0FBQUEsRUFFQSxRQUFRLE9BQWU7QUFDbkIsV0FBTyxLQUFLLFdBQVcsT0FBTyxPQUFLLEVBQUUsVUFBVSxRQUFRLEVBQUUsTUFBTSxPQUFPLEtBQUssRUFBRSxJQUFJLE9BQUssRUFBRSxHQUFHO0FBQUEsRUFDL0Y7QUFBQSxFQUVBLGFBQWEsTUFBYyxPQUFzQjtBQUM3QyxVQUFNLE9BQU8sS0FBSyxXQUFXLEtBQUssT0FBSyxFQUFFLFFBQVEsSUFBSTtBQUNyRCxRQUFJO0FBQU0sV0FBSyxRQUFRO0FBQUEsRUFDM0I7QUFBQSxFQUVBLG1CQUFzQixNQUFjLGNBQW9DO0FBQ3BFLFVBQU0sUUFBUSxLQUFLLE9BQU8sSUFBSTtBQUM5QixXQUFPLFVBQVUsT0FBTyxlQUFlLE9BQU87QUFBQSxFQUNsRDtBQUFBLFFBRWMsYUFBYSxVQUFrQixlQUF1QixPQUFlLFVBQWtCO0FBQ2pHLFFBQUksV0FBVyxLQUFLLG1CQUFtQixZQUFZLFNBQVM7QUFDNUQsUUFBSSxDQUFDO0FBQVU7QUFFZixVQUFNLE9BQU8sS0FBSyxtQkFBbUIsUUFBUSxJQUFJO0FBQ2pELFVBQU0sZ0JBQWdCLFNBQVMsWUFBWTtBQUMzQyxRQUFJLGlCQUFpQjtBQUNqQixpQkFBVztBQUVmLFVBQU0sVUFBVSxPQUFLLFFBQVEsUUFBUSxFQUFFLFVBQVUsQ0FBQztBQUVsRCxRQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRSxTQUFTLE9BQU8sR0FBRztBQUNqQyxVQUFJLFdBQVcsS0FBSyxRQUFRO0FBQ3hCLG9CQUFZLFNBQVMsTUFBTSxHQUFHLEVBQUUsSUFBSTtBQUFBLGVBQy9CLENBQUMsY0FBYyxlQUFlLFNBQVMsT0FBTztBQUNuRCxvQkFBWSxPQUFLLFFBQVEsUUFBUTtBQUNyQyxrQkFBWSxNQUFPLFFBQU8sT0FBTyxRQUFPLE9BQU87QUFBQSxJQUNuRDtBQUVBLFFBQUksU0FBUyxNQUFNO0FBQ2YsaUJBQVcsT0FBSyxLQUFLLE9BQUssUUFBUSxRQUFRLEdBQUcsUUFBUTtBQUV6RCxVQUFNLFlBQVksY0FBYyxTQUFTLFFBQVE7QUFFakQsUUFBSSxNQUFNLEtBQUssWUFBWSxXQUFXLFdBQVcsUUFBUSxHQUFHO0FBQ3hELFlBQU0sZ0JBQWdCLE1BQU0sYUFBYSxPQUFPLFVBQVUsVUFBVSxTQUFTO0FBQzdFLFdBQUssYUFBYSxjQUFjLFFBQVEsV0FBVyxLQUFLLElBQUk7QUFFNUQsV0FBSyxXQUFXLHFCQUFxQixJQUFJO0FBQ3pDLFdBQUssV0FBVyxvQkFBb0IsSUFBSTtBQUN4QyxXQUFLLFlBQVksU0FBUyxLQUFLLFdBQVcscUJBQXFCLGNBQWMsVUFBVTtBQUFBLElBRTNGLFdBQVUsaUJBQWlCLGFBQWEsS0FBSyxZQUFZLE9BQU07QUFDM0QscUJBQU8sVUFBVSxVQUFVLEVBQUU7QUFDN0IsWUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsUUFDekMsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsTUFBTTtBQUFBLDRCQUErQixpQkFBaUI7QUFBQSxNQUMxRCxDQUFDO0FBQ0QsWUFBTSxVQUFVLFNBQVM7QUFBQSxJQUM3QixPQUNLO0FBQ0QsWUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsUUFDekMsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsTUFBTTtBQUFBLDhCQUFpQyxpQkFBaUI7QUFBQSxNQUM1RCxDQUFDO0FBQ0QsWUFBTSxVQUFVLFNBQVM7QUFFekIsV0FBSyxhQUFhLElBQUksY0FBYyxVQUFVLFNBQVMsV0FBVyx5QkFBeUIsc0JBQXNCLFlBQVksQ0FBQztBQUFBLElBQ2xJO0FBQUEsRUFDSjtBQUFBLEVBRVEsWUFBWSxPQUFPLFVBQVUsaUJBQWlCLEdBQUc7QUFDckQsVUFBTSxPQUFPLEtBQUssVUFBVSxRQUFRLElBQUksT0FBTztBQUMvQyxRQUFJLFFBQVE7QUFBSSxhQUFPO0FBRXZCLFVBQU0sZ0JBQWlDLENBQUM7QUFFeEMsVUFBTSxTQUFTLEtBQUssVUFBVSxVQUFVLEdBQUcsSUFBSTtBQUMvQyxRQUFJLFdBQVcsS0FBSyxVQUFVLFVBQVUsT0FBTyxDQUFDLEVBQUUsVUFBVTtBQUU1RCxhQUFTLElBQUksR0FBRyxJQUFJLGdCQUFnQixLQUFLO0FBQ3JDLFlBQU0sZ0JBQWdCLFNBQVMsR0FBRyxDQUFDLEVBQUU7QUFFckMsWUFBTSxXQUFXLFdBQVcsV0FBVyxTQUFTLEdBQUcsVUFBVSxDQUFDLEdBQUcsYUFBYTtBQUU5RSxvQkFBYyxLQUFLLFNBQVMsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUVsRCxZQUFNLGdCQUFnQixTQUFTLFVBQVUsV0FBVyxDQUFDLEVBQUUsVUFBVTtBQUNqRSxVQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUUsTUFBTSxLQUFLO0FBQy9CLG1CQUFXO0FBQ1g7QUFBQSxNQUNKO0FBRUEsaUJBQVcsY0FBYyxVQUFVLENBQUMsRUFBRSxVQUFVO0FBQUEsSUFDcEQ7QUFFQSxlQUFXLFNBQVMsVUFBVSxTQUFTLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDdkQsU0FBSyxZQUFZLE9BQU8sUUFBUSxFQUFFLEtBQUssU0FBUyxVQUFVLENBQUM7QUFFM0QsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVRLFdBQVcsWUFBMEI7QUFDekMsUUFBSSxZQUFZLEtBQUssWUFBWTtBQUVqQyxVQUFNLFNBQXVDLENBQUM7QUFDOUMsV0FBTyxXQUFXO0FBQ2QsYUFBTyxRQUFRLFNBQVM7QUFDeEIsa0JBQVksS0FBSyxZQUFZO0FBQUEsSUFDakM7QUFFQSxXQUFPLFFBQVEsR0FBRyxPQUFPLFFBQVEsVUFBVSxDQUFDO0FBRTVDLGVBQVcsQ0FBQyxNQUFNLFVBQVUsUUFBUTtBQUNoQyxXQUFLLFlBQVksS0FBSyxVQUFVLFdBQVcsSUFBSSxTQUFTLEtBQUs7QUFBQSxJQUNqRTtBQUFBLEVBQ0o7QUFDSjs7O0FGNVBBOzs7QVVWQSw4QkFBOEIsTUFPekI7QUFDRCxRQUFNLFNBQVEsTUFBTSxLQUFLLEtBQUssa0JBQWtCLENBQUMsSUFBSSxDQUFDO0FBQ3RELFNBQU8sS0FBSyxNQUFNLE1BQUs7QUFDM0I7QUFFQSwwQkFBbUM7QUFBQSxFQVEvQixZQUFvQixNQUFxQjtBQUFyQjtBQVBwQixzQkFLTSxDQUFDO0FBQUEsRUFJUDtBQUFBLFFBRU0sU0FBUztBQUNYLFVBQU0sU0FBUSxNQUFNLGVBQWUsS0FBSyxLQUFLLEVBQUU7QUFFL0MsZUFBVyxFQUFFLE1BQU0sSUFBSSxJQUFJLElBQUksT0FBTyxRQUFRLFFBQU87QUFDakQsV0FBSyxXQUFXLEtBQUssRUFBRSxNQUFNLE9BQU8sS0FBSyxLQUFLLEtBQUssVUFBVSxJQUFJLEVBQUUsR0FBRyxPQUFPLE1BQU0sS0FBSyxPQUFPLEtBQUssS0FBSyxVQUFVLElBQUksRUFBRSxFQUFFLENBQUM7QUFBQSxJQUNoSTtBQUFBLEVBQ0o7QUFBQSxFQUVRLFFBQVEsS0FBWTtBQUN4QixVQUFNLElBQUksWUFBWTtBQUN0QixVQUFNLFFBQVEsS0FBSyxXQUFXLFVBQVUsT0FBSyxFQUFFLElBQUksR0FBRyxZQUFZLEtBQUssR0FBRztBQUMxRSxXQUFPLFNBQVMsS0FBSyxPQUFNLEtBQUssV0FBVyxPQUFPLE9BQU8sQ0FBQyxFQUFFLE1BQU07QUFBQSxFQUN0RTtBQUFBLEVBRUEsV0FBVyxLQUE2QztBQUNwRCxXQUFPLEtBQUssUUFBUSxHQUFHLEdBQUc7QUFBQSxFQUM5QjtBQUFBLEVBRUEsc0JBQWtDLEtBQWEsUUFBZ0IsSUFBOEI7QUFDekYsVUFBTSxPQUFPLEtBQUssV0FBVyxHQUFHO0FBQ2hDLFdBQU8sT0FBTyxTQUFTLFlBQVksUUFBUTtBQUFBLEVBQy9DO0FBQUEsRUFFQSxjQUEwQixLQUFhLFFBQWdCLElBQXVCO0FBQzFFLFVBQU0sT0FBTyxLQUFLLFdBQVcsR0FBRztBQUNoQyxXQUFPLGdCQUFnQixnQkFBZ0IsS0FBSyxLQUFJO0FBQUEsRUFDcEQ7QUFBQSxFQUVBLFVBQVUsS0FBc0M7QUFDNUMsVUFBTSxRQUFRLEtBQUssUUFBUSxHQUFHLEdBQUc7QUFDakMsV0FBTyxpQkFBaUIsZ0JBQWdCLE1BQU0sS0FBSztBQUFBLEVBQ3ZEO0FBQUEsRUFFQSxXQUFXLEtBQWEsY0FBd0I7QUFDNUMsV0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLEtBQUssWUFBWTtBQUFBLEVBQ3REO0FBQUEsRUFFQSxPQUFPLEtBQWE7QUFDaEIsV0FBTyxLQUFLLFdBQVcsS0FBSyxPQUFLLEVBQUUsSUFBSSxHQUFHLFlBQVksS0FBSyxHQUFHLEtBQUs7QUFBQSxFQUN2RTtBQUFBLEVBRUEsZUFBMkIsS0FBYSxRQUFnQixJQUF1QjtBQUMzRSxVQUFNLE9BQU8sS0FBSyxVQUFVLEdBQUc7QUFDL0IsV0FBTyxPQUFPLFNBQVMsWUFBWSxRQUFRO0FBQUEsRUFDL0M7QUFBQSxFQUVBLGNBQTBCLEtBQWEsUUFBZ0IsSUFBdUI7QUFDMUUsVUFBTSxPQUFPLEtBQUssVUFBVSxHQUFHO0FBQy9CLFdBQU8sT0FBTyxTQUFTLFdBQVcsT0FBTTtBQUFBLEVBQzVDO0FBQUEsRUFFQSxTQUFTLFdBQW1CO0FBQ3hCLFVBQU0sT0FBTyxLQUFLLFdBQVcsS0FBSyxPQUFLLEVBQUUsSUFBSSxHQUFHLFlBQVksS0FBSyxPQUFPO0FBQ3hFLFFBQUksTUFBTSxpQkFBaUI7QUFDdkIsV0FBSyxNQUFNLG9CQUFvQixNQUFNLFNBQVMsRUFBRSxVQUFVO0FBQUEsYUFDckQsTUFBTSxVQUFVLE1BQU07QUFDM0IsV0FBSyxRQUFRLElBQUksY0FBYyxNQUFNLFNBQVM7QUFBQSxJQUNsRCxPQUFPO0FBQ0gsV0FBSyxVQUFVLFNBQVMsU0FBUztBQUFBLElBQ3JDO0FBQUEsRUFDSjtBQUFBLEVBRUEsZUFBZTtBQUNYLFVBQU0sZ0JBQWdCLElBQUksY0FBYztBQUV4QyxlQUFXLEVBQUUsT0FBTyxNQUFNLEtBQUssV0FBVyxLQUFLLFlBQVk7QUFDdkQsZUFBUyxjQUFjLG9CQUFvQixHQUFHO0FBRTlDLFVBQUksVUFBVSxNQUFNO0FBQ2hCLHNCQUFjLEtBQUssR0FBRztBQUFBLE1BQzFCLE9BQU87QUFDSCxzQkFBYyxRQUFRLE9BQU8sT0FBTyxRQUFRO0FBQUEsTUFDaEQ7QUFBQSxJQUNKO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVBLFVBQVUsS0FBYSxPQUFlO0FBQ2xDLFVBQU0sT0FBTyxLQUFLLFdBQVcsS0FBSyxPQUFLLEVBQUUsSUFBSSxHQUFHLFlBQVksS0FBSyxHQUFHO0FBQ3BFLFFBQUk7QUFBTSxhQUFRLEtBQUssUUFBUSxJQUFJLGNBQWMsTUFBTSxLQUFLO0FBRTVELFNBQUssV0FBVyxLQUFLLEVBQUUsS0FBSyxJQUFJLGNBQWMsTUFBTSxHQUFHLEdBQUcsT0FBTyxJQUFJLGNBQWMsTUFBTSxLQUFLLEdBQUcsTUFBTSxLQUFLLE9BQU8sS0FBSyxDQUFDO0FBQUEsRUFDN0g7QUFBQSxFQUVBLE1BQU07QUFDRixVQUFNLFVBQTRDLENBQUM7QUFFbkQsZUFBVyxFQUFFLEtBQUssV0FBVyxLQUFLLFlBQVk7QUFDMUMsVUFBSTtBQUFLLGdCQUFRLElBQUksTUFBTSxVQUFVLE9BQU8sT0FBTyxNQUFNO0FBQUEsSUFDN0Q7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUNKOzs7QVZuR0EsSUFBTSwyQkFBMkIsSUFBSSxPQUFPLHVCQUF1QixXQUFXLEtBQUssR0FBRyxNQUFNLEdBQUc7QUFDL0YsSUFBTSxzQkFBc0I7QUFHNUIsb0NBQTZDLG9CQUFvQjtBQUFBLEVBYzdELFlBQVksY0FBd0I7QUFDaEMsVUFBTTtBQUNOLFNBQUssWUFBWTtBQUNqQixTQUFLLGNBQWM7QUFBQSxFQUN2QjtBQUFBLE1BUkksY0FBYTtBQUNiLFdBQU8sS0FBSyxZQUFZLFdBQVcsUUFBUSxJQUFJLHNCQUFxQjtBQUFBLEVBQ3hFO0FBQUEsRUFRQSxzQkFBc0IsUUFBZ0I7QUFDbEMsZUFBVyxLQUFLLEtBQUssZ0JBQWdCO0FBQ2pDLFVBQUksT0FBTyxVQUFVLEdBQUcsRUFBRSxHQUFHLE1BQU0sS0FBSyxFQUFFLElBQUk7QUFDMUMsZUFBTztBQUFBLE1BQ1g7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBRUEsbUJBQW1CLE9BQWUsS0FBb0I7QUFDbEQsVUFBTSxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQzNCLFFBQUksVUFBVTtBQUNkLGVBQVcsS0FBSyxLQUFLO0FBQ2pCLFlBQU0sUUFBUSxJQUFJLFFBQVEsQ0FBQztBQUMzQixVQUFJLFNBQVMsSUFBSTtBQUNiLGNBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLFVBQ3pDLE1BQU0sZ0RBQWdELElBQUk7QUFBQSxFQUFPLElBQUk7QUFBQSxVQUNyRSxXQUFXO0FBQUEsUUFDZixDQUFDO0FBQ0QsY0FBTSxVQUFVLFNBQVM7QUFDekI7QUFBQSxNQUNKO0FBQ0EsaUJBQVcsUUFBUSxFQUFFO0FBQ3JCLFlBQU0sSUFBSSxVQUFVLFFBQVEsRUFBRSxNQUFNO0FBQUEsSUFDeEM7QUFFQSxXQUFPLFVBQVUsSUFBSSxPQUFPLE9BQU87QUFBQSxFQUN2QztBQUFBLEVBRUEsYUFBYSxNQUFxQjtBQUM5QixRQUFJLEtBQUssWUFBWSxXQUFXLFFBQVEsR0FBRztBQUN2QyxhQUFPLEtBQUssU0FBUyxHQUFHO0FBQUEsSUFDNUI7QUFDQSxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRUEsaUJBQWlCLE1BQXFCO0FBQ2xDLFFBQUksQ0FBQyxLQUFLLFlBQVksV0FBVyxRQUFRLEdBQUc7QUFDeEMsYUFBTztBQUFBLElBQ1g7QUFFQSxXQUFNLFlBQVksS0FBSyxLQUFLLEVBQUUsR0FBRTtBQUM1QixhQUFPLEtBQUssUUFBUSxlQUFlLEdBQUc7QUFBQSxJQUMxQztBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsUUFFTSxXQUFXLE1BQXFCLFNBQXdCLGdCQUErQixnQkFBK0IsY0FBK0Q7QUFDdkwsUUFBSSxLQUFLLFlBQVksV0FBVyxRQUFRLEdBQUc7QUFDdkMsVUFBRztBQUNDLHlCQUFpQixlQUFlLFNBQVMsR0FBRztBQUVoRCxnQkFBVSxlQUFlLGFBQWE7QUFBQSxJQUMxQztBQUVBLFVBQU0sVUFBVSxJQUFJLGNBQWMsS0FBSyxlQUFlLEVBQUUsS0FDcEQsS0FBSyxNQUFNLE9BQ2Y7QUFFQSxRQUFJLGdCQUFnQjtBQUNoQixjQUFRLFNBQVMsTUFBTSxhQUFhLGNBQWMsTUFBTTtBQUFBLElBQzVELE9BQU87QUFDSCxjQUFRLEtBQUssSUFBSTtBQUFBLElBQ3JCO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVBLG9CQUFvQixVQUF5QixlQUFnQyxDQUFDLEdBQUc7QUFDN0UsVUFBTSxhQUF5QixTQUFTLE1BQU0sd0ZBQXdGO0FBRXRJLFFBQUksY0FBYztBQUNkLGFBQU8sRUFBRSxVQUFVLGFBQWE7QUFFcEMsVUFBTSxlQUFlLFNBQVMsVUFBVSxHQUFHLFdBQVcsS0FBSyxFQUFFLEtBQUssU0FBUyxVQUFVLFdBQVcsUUFBUSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBRTdILFVBQU0sY0FBYyxXQUFXLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUssRUFBRSxLQUFLLENBQUM7QUFFakUsaUJBQWEsS0FBSztBQUFBLE1BQ2QsT0FBTyxXQUFXO0FBQUEsTUFDbEIsVUFBVTtBQUFBLElBQ2QsQ0FBQztBQUVELFdBQU8sS0FBSyxvQkFBb0IsY0FBYyxZQUFZO0FBQUEsRUFDOUQ7QUFBQSxFQUVBLGlCQUFpQixhQUE4QixVQUF5QjtBQUNwRSxlQUFXLEtBQUssYUFBYTtBQUN6QixpQkFBVyxNQUFNLEVBQUUsVUFBVTtBQUN6QixtQkFBVyxTQUFTLFdBQVcsTUFBTSxJQUFJLEVBQUUsS0FBSztBQUFBLE1BQ3BEO0FBQUEsSUFDSjtBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFQSxvQkFBb0IsU0FBd0IsV0FBMEI7QUFHbEUsUUFBSSxFQUFFLFVBQVUsaUJBQWlCLEtBQUssb0JBQW9CLFNBQVM7QUFFbkUsZUFBVyxFQUFDLEtBQUksV0FBVSxRQUFRLFlBQVk7QUFDMUMsWUFBTSxLQUFLLElBQUksT0FBTyxRQUFRLEtBQUssSUFBSTtBQUN2QyxpQkFBVyxTQUFTLFFBQVEsSUFBSSxLQUFLO0FBQUEsSUFDekM7QUFFQSxXQUFPLEtBQUssaUJBQWlCLGNBQWMsUUFBUTtBQUFBLEVBQ3ZEO0FBQUEsUUFFTSxjQUFjLFVBQXlCLFNBQXdCLFFBQWMsV0FBbUIsVUFBa0IsYUFBMkIsZ0JBQWdDO0FBQy9LLGVBQVcsTUFBTSxLQUFLLFlBQVksZUFBZSxVQUFVLFFBQU0sVUFBVSxXQUFXO0FBRXRGLGVBQVcsS0FBSyxvQkFBb0IsU0FBUyxRQUFRO0FBRXJELGVBQVcsU0FBUyxRQUFRLHNCQUFzQixrQkFBa0IsRUFBRTtBQUV0RSxlQUFXLFdBQVcsU0FBUztBQUUvQixlQUFXLE1BQU0sS0FBSyxhQUFhLFVBQVUsVUFBVSxXQUFXO0FBRWxFLGVBQVcsTUFBTSxlQUFlLFVBQVUsR0FBRztBQUFBLEVBQWdCLFdBQVc7QUFFeEUsV0FBTztBQUFBLEVBQ1g7QUFBQSxTQUVPLHFCQUFxQixNQUFxQixNQUFxQixnQkFBK0I7QUFDakcsVUFBTSxlQUFlLE1BQU0sS0FBSyxZQUFZO0FBRTVDLFNBQUssVUFBVSxnQkFBZ0IsWUFBWTtBQUMzQyxTQUFLLFVBQVUseUJBQXlCLE9BQUssUUFBUSxZQUFZLENBQUM7QUFFbEUsVUFBTyxnQkFBZ0IsS0FBSyxJQUFJO0FBQ2hDLGtCQUFjLFNBQVMsZ0JBQWdCO0FBRXZDLFdBQU87QUFBQSxFQUNYO0FBQUEsUUFFTSxjQUFjLFVBQWtCLE1BQXFCLFNBQXdCLEVBQUUsZ0JBQWdCLGVBQThFO0FBQy9LLFVBQU0sYUFBYSxJQUFJLGNBQWMsT0FBTyxHQUFHLFVBQVUsVUFBVSxLQUFLLEVBQUU7QUFDMUUsVUFBTSxXQUFXLE9BQU87QUFFeEIsUUFBSSxVQUF5QixrQkFBa0IsTUFBTSxlQUEwQixDQUFDLEdBQUc7QUFFbkYsUUFBSSxTQUFTO0FBQ1QsWUFBTSxFQUFFLGdCQUFnQixvQkFBb0IsTUFBTSxlQUFlLFVBQVUsTUFBTSxZQUFZLGtCQUFrQixJQUFJLGNBQWMsR0FBRyxNQUFNLFdBQVc7QUFDckosaUJBQVc7QUFDWCx3QkFBa0I7QUFBQSxJQUN0QixPQUFPO0FBR0gsWUFBTSxhQUFhLE1BQU0sS0FBSyxXQUFXLE1BQU0sU0FBUyxZQUFZLGdCQUFnQixxQkFBa0IsS0FBSyxhQUFhLGlCQUFnQixVQUFVLFdBQVcsQ0FBQztBQUc5SixZQUFNLFlBQVksS0FBSyxHQUFHLENBQUMsRUFBRTtBQUM3QixVQUFHLGFBQWEsVUFBVSxZQUFZLEdBQUU7QUFDcEMsZUFBTyxXQUFXO0FBQUEsTUFDdEI7QUFFQSxVQUFJLFNBQTJCLFdBQVcsZUFBZSxVQUFVLEdBQUc7QUFFdEUsWUFBTSxVQUFXLFVBQVMsU0FBUyxNQUFNLE1BQU0sS0FBSyxRQUFRLE9BQU8sR0FBRyxFQUFFO0FBRXhFLFlBQU0seUJBQXlCLEtBQUssWUFBWSxHQUFHLG9CQUFvQixTQUFTLEtBQUssY0FBYyxpQkFBaUIsc0JBQXNCO0FBQzFJLHFCQUFlLGVBQWUsbUJBQW1CLHdCQUF3QixTQUFTLEtBQUssV0FBVyxjQUFjLFVBQVUsU0FBUztBQUVuSSxVQUFJLFlBQVksZUFBZSxhQUFhLGVBQWUsUUFBUSxZQUFZLGVBQWUsYUFBYSxlQUFlLFVBQWEsQ0FBQyxNQUFNLGVBQU8sV0FBVyxhQUFhLFFBQVEsR0FBRztBQUNwTCxvQkFBWSxlQUFlLGFBQWEsYUFBYTtBQUVyRCxZQUFJLFFBQVE7QUFDUixnQkFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsWUFDekMsTUFBTSxhQUFhLEtBQUssMEJBQTBCO0FBQUEsS0FBZ0IsS0FBSztBQUFBLEVBQWEsYUFBYTtBQUFBLFlBQ2pHLFdBQVc7QUFBQSxZQUNYLE1BQU07QUFBQSxVQUNWLENBQUM7QUFDRCxnQkFBTSxVQUFVLFNBQVM7QUFBQSxRQUM3QjtBQUNBLGVBQU8sV0FBVztBQUFBLE1BQ3RCO0FBRUEsVUFBSSxDQUFDLFlBQVksZUFBZSxhQUFhLFlBQVk7QUFDckQsb0JBQVksZUFBZSxhQUFhLGFBQWEsRUFBRSxTQUFTLE1BQU0sZUFBTyxLQUFLLGFBQWEsVUFBVSxTQUFTLEVBQUU7QUFFeEgsa0JBQVksYUFBYSxhQUFhLGFBQWEsWUFBWSxlQUFlLGFBQWEsV0FBVztBQUV0RyxZQUFNLEVBQUUsU0FBUyxlQUFlLE1BQU0sYUFBYSxNQUFNLFVBQVUsYUFBYSxVQUFVLGFBQWEsV0FBVyxZQUFZLGVBQWUsYUFBYSxVQUFVO0FBQ3BLLFlBQU0sV0FBVyxJQUFJLGNBQWMsYUFBYSxTQUFTLEtBQUssS0FBSyxDQUFDO0FBR3BFLFlBQU0sZ0JBQWdCLGdCQUFnQixxQkFBcUIsWUFBWSxNQUFNLGNBQWM7QUFFM0YsWUFBTSxTQUFTLGFBQWEsYUFBYSxVQUFVLGFBQWEsV0FBVyxXQUFXLFNBQVMsYUFBYSxXQUFXLEVBQUMsWUFBWSxjQUFhLENBQUM7QUFFbEosaUJBQVcsU0FBUyxXQUFXLEtBQUssU0FBUyxTQUFTO0FBQ3RELHNCQUFnQixZQUFZLFNBQVM7QUFBQSxJQUN6QztBQUVBLFFBQUksbUJBQW9CLFVBQVMsU0FBUyxLQUFLLGlCQUFpQjtBQUM1RCxZQUFNLEVBQUUsV0FBVyxhQUFhO0FBRWhDLGlCQUFXLE1BQU0sS0FBSyxjQUFjLFVBQVUsWUFBWSxVQUFVLEtBQUssS0FBSyxVQUFVLFVBQVUsS0FBSyxLQUFLLFdBQVcsVUFBVSxhQUFhLGNBQWM7QUFDNUosdUJBQWlCLFNBQVMscUJBQXFCLGFBQWE7QUFBQSxJQUNoRTtBQUVBLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFUSxvQkFBb0IsTUFBdUI7QUFDL0MsVUFBTSxPQUFPLEtBQUssWUFBWSxXQUFXLFFBQVE7QUFDakQsUUFBSSxZQUFZLEtBQUssTUFBTTtBQUUzQixRQUFJLE1BQU07QUFDTixrQkFBWSxVQUFVLFNBQVMsR0FBRztBQUFBLElBQ3RDO0FBRUEsYUFBUyxLQUFLLE1BQU07QUFDaEIsVUFBSSxRQUFRLFVBQVUsU0FBUyxHQUFHLEtBQUssRUFBRSxXQUFXLEdBQUcsR0FBRztBQUN0RCxZQUFJLEVBQUUsVUFBVTtBQUFBLE1BQ3BCO0FBRUEsVUFBSSxPQUFPLGFBQWEsVUFBVTtBQUFBLE1BRWxDO0FBQ0EsZ0JBQVUsS0FBSyxDQUFDO0FBQUEsSUFDcEI7QUFFQSxRQUFJLE1BQU07QUFDTixrQkFBWSxVQUFVLFNBQVMsR0FBRztBQUFBLElBQ3RDO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxRQUVNLGFBQWEsTUFBcUIsVUFBa0IsYUFBbUQ7QUFDekcsUUFBSTtBQUVKLFVBQU0sZUFBMkQsQ0FBQztBQUVsRSxXQUFRLFFBQU8sS0FBSyxPQUFPLEtBQUssV0FBVyxNQUFNLElBQUk7QUFHakQsWUFBTSxVQUFVLEtBQUs7QUFDckIsWUFBTSxjQUFjLEtBQUssc0JBQXNCLFFBQVEsS0FBSyxDQUFDO0FBRTdELFVBQUksYUFBYTtBQUNiLGNBQU0sUUFBUSxRQUFRLFFBQVEsWUFBWSxFQUFFLElBQUksWUFBWSxHQUFHO0FBQy9ELGNBQU0sTUFBTSxRQUFRLFVBQVUsS0FBSyxFQUFFLFFBQVEsWUFBWSxFQUFFLElBQUksUUFBUSxZQUFZLEdBQUc7QUFDdEYscUJBQWEsS0FBSyxLQUFLLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFDeEMsZUFBTyxLQUFLLFVBQVUsR0FBRztBQUN6QjtBQUFBLE1BQ0o7QUFHQSxZQUFNLGVBQWUsS0FBSyxVQUFVLEdBQUcsSUFBSTtBQUUzQyxZQUFNLFlBQVksS0FBSyxVQUFVLElBQUk7QUFHckMsWUFBTSxhQUFhLFVBQVUsT0FBTyxZQUFjO0FBRWxELFlBQU0sVUFBVSxVQUFVLFVBQVUsR0FBRyxVQUFVO0FBRWpELFlBQU0sb0JBQW9CLE1BQU0sS0FBSyxjQUFjLFVBQVUsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJO0FBRWxGLFVBQUksUUFBUSxVQUFVLFVBQVUsWUFBWSxpQkFBaUI7QUFFN0QsVUFBSSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsRUFBRSxNQUFNLEtBQUs7QUFDdEMsZ0JBQVEsTUFBTSxVQUFVLEdBQUcsTUFBTSxTQUFTLENBQUM7QUFBQSxNQUMvQztBQUVBLFlBQU0sY0FBYyxVQUFVLFVBQVUsb0JBQW9CLENBQUM7QUFFN0QsVUFBSSxVQUFVLEdBQUcsb0JBQW9CLENBQUMsRUFBRSxNQUFNLEtBQUs7QUFDL0MscUJBQWEsS0FDVCxLQUFLLGFBQWEsS0FBSyxpQkFBaUIsWUFBWSxDQUFDLEdBQ3JELEtBQUssY0FBYyxVQUFVLFNBQVMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUNoRTtBQUVBLGVBQU87QUFDUDtBQUFBLE1BQ0o7QUFHQSxVQUFJO0FBRUosVUFBSSxLQUFLLFdBQVcsU0FBUyxRQUFRLEVBQUUsR0FBRztBQUN0QyxtQ0FBMkIsWUFBWSxRQUFRLE9BQU8sT0FBTztBQUFBLE1BQ2pFLE9BQU87QUFDSCxtQ0FBMkIsTUFBTSxLQUFLLGtCQUFrQixhQUFhLFFBQVEsRUFBRTtBQUMvRSxZQUFJLDRCQUE0QixJQUFJO0FBQ2hDLGdCQUFNLENBQUMsVUFBVSxhQUFhLGVBQWU7QUFBQSxZQUN6QyxNQUFNO0FBQUEsNkNBQWdELHNCQUFzQixRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQUE7QUFBQSxZQUMxRixXQUFXO0FBQUEsVUFDZixDQUFDO0FBQ0QsZ0JBQU0sVUFBVSxTQUFTO0FBQ3pCLHFDQUEyQjtBQUFBLFFBQy9CO0FBQUEsTUFDSjtBQUVBLFlBQU0saUJBQWlCLDRCQUE0QixRQUFRLFlBQVksVUFBVSxHQUFHLHdCQUF3QjtBQUc1RyxZQUFNLGdCQUFnQixZQUFZLFVBQVUsd0JBQXdCO0FBQ3BFLFlBQU0scUJBQXFCLDRCQUE0QixPQUFPLGNBQWMsVUFBVSxXQUFXLGFBQWEsY0FBYyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUk7QUFFNUksbUJBQWEsS0FDVCxLQUFLLGFBQWEsWUFBWSxHQUM5QixLQUFLLGNBQWMsVUFBVSxTQUFTLE9BQU8sRUFBRSxnQkFBZ0IsWUFBWSxDQUFDLENBQ2hGO0FBRUEsYUFBTztBQUFBLElBQ1g7QUFHQSxRQUFJLFlBQVksSUFBSSxjQUFjLEtBQUssZUFBZTtBQUV0RCxlQUFXLEtBQUssY0FBYztBQUMxQixrQkFBWSxLQUFLLGlCQUFpQixXQUFXLE1BQU0sQ0FBQztBQUFBLElBQ3hEO0FBR0EsUUFBRyxhQUFhLFdBQVcsS0FBSyxDQUFDLEtBQUssc0JBQXNCLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRTtBQUN4RSxhQUFPLEtBQUssaUJBQWlCLElBQUk7QUFBQSxJQUNyQztBQUVBLFdBQU8sS0FBSyxhQUFhLEtBQUssaUJBQWlCLFdBQVcsSUFBSSxDQUFDO0FBQUEsRUFFbkU7QUFBQSxFQUVRLHVCQUF1QixNQUFxQjtBQUNoRCxXQUFPLEtBQUssS0FBSztBQUNqQixXQUFPLEtBQUssV0FBVyxvQkFBb0IsTUFBTTtBQUNqRCxXQUFPO0FBQUEsRUFDWDtBQUFBLFFBRU0sT0FBTyxNQUFxQixVQUFrQixhQUEyQjtBQUczRSxXQUFPLEtBQUssUUFBUSxtQkFBbUIsRUFBRTtBQUV6QyxXQUFPLE1BQU0sS0FBSyxhQUFhLE1BQU0sVUFBVSxXQUFXO0FBRzFELFdBQU8sS0FBSyxRQUFRLHVCQUF1QixnRkFBZ0Y7QUFDM0gsV0FBTyxLQUFLLHVCQUF1QixJQUFJO0FBQUEsRUFDM0M7QUFDSjs7O0FXdFlBO0FBT08saUNBQTJCLFNBQVM7QUFBQSxlQUVsQixnQkFBZ0IsTUFBcUIsYUFBMkI7QUFFakYsUUFBSSxZQUFZLE9BQU87QUFDbkIsV0FBSyxxQkFBcUI7QUFBQSxDQUFTO0FBQUEsSUFDdkM7QUFFQSxTQUFLLHFCQUFxQjtBQUFBO0FBQUE7QUFBQSxzQ0FHSSxTQUFTLG9CQUFvQixZQUFZLFFBQVEsb0JBQW9CLFNBQVMsb0JBQW9CLE9BQUssUUFBUSxZQUFZLFFBQVEsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsa0JBV3hKO0FBSVYsUUFBSSxZQUFZLE9BQU87QUFDbkIsV0FBSyxvQkFBb0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUlTLGFBQWEsV0FBVyx3SEFBd0g7QUFBQTtBQUFBO0FBQUEscUNBR3pKLFNBQVMsb0JBQW9CLGNBQWMsZUFBZTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQUk3RTtBQUFBLElBQ1Y7QUFFQSxTQUFLLG9CQUFvQixPQUFPO0FBRWhDLFdBQU87QUFBQSxFQUNYO0FBQUEsZUFFYSxVQUFVLE1BQXFCLGFBQTJCO0FBQ25FLFVBQU0sWUFBWSxNQUFNLGFBQWEsYUFBYSxNQUFNLFlBQVksVUFBVSxZQUFZLEtBQUs7QUFFL0YsV0FBTyxhQUFhLGdCQUFnQixXQUFXLFdBQVc7QUFBQSxFQUM5RDtBQUFBLFNBRU8sY0FBYyxNQUFxQixTQUFrQjtBQUN4RCxRQUFJLFNBQVM7QUFDVCxXQUFLLHFCQUFxQiwwQ0FBMEM7QUFBQSxJQUN4RTtBQUNBLFdBQU87QUFBQSxFQUNYO0FBQUEsU0FFTyxlQUFlLE1BQXFCLFlBQWlCLFVBQWtCO0FBQzFFLFNBQUsscUJBQXFCO0FBQUE7QUFBQTtBQUFBLG9DQUdFLGFBQWEsTUFBTSxhQUFhO0FBQUEsa0NBQ2xDLFNBQVMsb0JBQW9CLFFBQVEsb0JBQW9CLFNBQVMsb0JBQW9CLE9BQUssUUFBUSxRQUFRLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQkFJMUg7QUFFWixTQUFLLG9CQUFvQixVQUFVO0FBRW5DLFdBQU87QUFBQSxFQUNYO0FBQ0o7OztBQ2hGZSxtQkFBbUIsYUFBa0I7QUFDaEQsTUFBSTtBQUNKLFVBQVEsWUFBWSxRQUFRO0FBQUEsU0FDbkI7QUFDRCxhQUFPO0FBQ1A7QUFBQTtBQUVSLFNBQU87QUFDWDs7O0FDTkEsc0JBQStCO0FBQUEsRUFHM0IsWUFBWSxnQkFBc0M7QUFDOUMsU0FBSyxpQkFBaUI7QUFBQSxFQUMxQjtBQUFBLE1BRVksZ0JBQWU7QUFDdkIsV0FBTyxLQUFLLGVBQWUsdUJBQXVCLE9BQU8sS0FBSyxlQUFlLGdCQUFnQjtBQUFBLEVBQ2pHO0FBQUEsUUFFTSxXQUFXLE1BQXFCLE9BQW1CLFFBQWEsVUFBa0IsYUFBMkI7QUFJL0csUUFBSSxDQUFDLE9BQU87QUFDUixhQUFPO0FBQUEsSUFDWDtBQUVBLFFBQUksQ0FBQyxNQUFNLFFBQVEsS0FBSyxHQUFHO0FBQ3ZCLGNBQVEsQ0FBQyxLQUFLO0FBQUEsSUFDbEI7QUFFQSxlQUFXLEtBQUssT0FBTztBQUNuQixZQUFNLFNBQVMsTUFBTSxVQUFVLENBQUM7QUFFaEMsVUFBSSxRQUFRO0FBQ1IsZUFBTyxNQUFNLE9BQU8sTUFBTSxHQUFHLFFBQU0sVUFBVSxXQUFXO0FBQUEsTUFDNUQ7QUFBQSxJQUNKO0FBRUEsV0FBTztBQUFBLEVBQ1g7QUFBQSxRQVNNLFVBQVUsTUFBcUIsUUFBYyxVQUFrQixhQUFrRDtBQUNuSCxXQUFPLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxlQUFlLFFBQU0sVUFBVSxXQUFXO0FBQ2xGLFdBQU87QUFBQSxFQUNYO0FBQUEsUUFTTSxlQUFlLE1BQXFCLFFBQWMsVUFBa0IsYUFBa0Q7QUFDeEgsV0FBTyxNQUFNLEtBQUssV0FBVyxNQUFNLEtBQUssZUFBZSxRQUFNLFVBQVUsV0FBVztBQUNsRixXQUFPO0FBQUEsRUFDWDtBQUNKOzs7QUMzRE8sSUFBTSxZQUFXO0FBQUEsRUFDcEIsU0FBUyxDQUFDO0FBQ2Q7OztBQ1dPLElBQU0sWUFBVyxFQUFFLGtCQUFrQixDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsd0JBQXdCLENBQUMsT0FBTyxFQUFFO0FBQy9GLElBQU0sY0FBYyxJQUFJLFVBQVUsU0FBUTtBQUNuQyxJQUFNLGFBQWEsSUFBSSxnQkFBZ0IsV0FBVztBQUVsRCxtQkFBbUIsTUFBYztBQUNwQyxTQUFPLFVBQVMsUUFBUSxLQUFLLE9BQUssS0FBSyxRQUFjLEdBQUksUUFBUSxJQUFJO0FBQ3pFO0FBRU8sd0JBQXdCLE1BQWdCO0FBQzNDLFNBQU8sS0FBSyxLQUFLLE9BQUssVUFBVSxDQUFDLENBQUM7QUFDdEM7QUFFTyxnQkFBZ0I7QUFDbkIsU0FBTyxVQUFTLGlCQUFpQixTQUFTLFlBQVk7QUFDMUQ7QUFFQSxXQUFXLGVBQWUsVUFBUztBQUNuQyxXQUFXLFlBQVk7QUFDdkIsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsT0FBTztBQUVsQixVQUFvQixVQUFVLFVBQVM7QUFFdkMsdUJBQXVCLE1BQXFCLFlBQTJCLFVBQWtCLFVBQWtCLGVBQXVCLGFBQTJCLGNBQWdEO0FBRXpNLFFBQU0sV0FBVyxJQUFJLGNBQWMsYUFBYSxNQUFNLEtBQUssQ0FBQztBQUM1RCxNQUFHLENBQUMsTUFBTSxTQUFTLGFBQWEsVUFBVSxlQUFlLFVBQVUsRUFBQyxhQUFZLENBQUMsR0FBRTtBQUMvRTtBQUFBLEVBQ0o7QUFFQSxRQUFNLFlBQVksU0FBUyxtQkFBbUIsU0FBUyxTQUFTO0FBRWhFLE1BQUksQ0FBQztBQUFXLFdBQU8sV0FBVyxLQUFLLFNBQVMsWUFBWSxTQUFTLFNBQVM7QUFDOUUsU0FBTyxTQUFTO0FBR2hCLFFBQU0sRUFBRSxXQUFXLGFBQWEsZUFBZSxVQUFVLGVBQWUsV0FBVyxVQUFVLGNBQWMsVUFBVSxLQUFLO0FBRTFILE1BQUksQ0FBQyxNQUFNLGVBQU8sV0FBVyxRQUFRLEdBQUc7QUFDcEMsVUFBTSxlQUFlLDRCQUE0QixxQkFBcUI7QUFFdEUsVUFBTSxNQUFNLFlBQVk7QUFDeEIsV0FBTyxJQUFJLGNBQWMsS0FBSyxpQkFBaUIsYUFBYSxXQUFXLFlBQVksQ0FBQztBQUFBLEVBQ3hGO0FBRUEsUUFBTSxZQUFZLFdBQVcsV0FBVyxRQUFRO0FBRWhELFFBQU0sZ0JBQWdCLE1BQU0sYUFBYSxPQUFPLFVBQVUsVUFBVSxTQUFTO0FBQzdFLE1BQUksWUFBWSxNQUFNLGNBQWMsdUJBQXVCLGNBQWMsT0FBTztBQUVoRixjQUFZLFNBQVMsVUFBVSxxQkFBcUIsY0FBYyxVQUFVO0FBRTVFLGNBQVksU0FBUztBQUdyQixRQUFNLFVBQVUsQUFBVSxpQkFBWSxXQUFXLENBQUMsRUFBRSxHQUFHLEtBQUssT0FBTyxJQUFJO0FBRXZFLE1BQUksUUFBUSxPQUFPO0FBQ2YsVUFBTSxNQUFNLHlCQUF5QixXQUFXLGFBQWEsUUFBUTtBQUNyRSxXQUFPO0FBQUEsRUFDWDtBQUVBLGNBQVksUUFBUTtBQUNwQixRQUFNLFdBQVcsUUFBUSxNQUFNLElBQUksT0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLENBQUM7QUFDMUQsUUFBTSxVQUFVLEFBQVUsaUJBQVksTUFBTSxVQUFVLEdBQUc7QUFFekQsTUFBSSxRQUFRLE9BQU87QUFDZixVQUFNLE1BQU0sdUJBQXVCLFdBQVcsYUFBYSxRQUFRO0FBQ25FLFdBQU87QUFBQSxFQUNYO0FBR0EsUUFBTSxhQUFhLElBQUksY0FBYztBQUVyQyxhQUFXLEtBQUssUUFBUSxPQUFPO0FBQzNCLE1BQUUsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDO0FBQ3pCLFVBQU0sYUFBYSxRQUFRLE1BQU0sS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLE1BQU0sRUFBRSxHQUFHO0FBRWpFLGVBQVcsS0FBSyxVQUFVLFVBQVUsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUM3QyxnQkFBWSxVQUFVLFVBQVUsRUFBRSxHQUFHO0FBRXJDLFFBQUksWUFBWTtBQUNaLGlCQUFXLEtBQUssV0FBVyxJQUFJO0FBQUEsSUFDbkMsT0FBTztBQUNILFlBQU0sZUFBZSxTQUFTLElBQUksRUFBRSxHQUFHO0FBRXZDLFVBQUksZ0JBQWdCLGlCQUFpQixRQUFRLGFBQWEsR0FBRyxZQUFZLEtBQUs7QUFDMUUsbUJBQVcsS0FBSyxZQUFZO0FBQUEsSUFDcEM7QUFBQSxFQUNKO0FBRUEsYUFBVyxLQUFLLFNBQVM7QUFFekIsU0FBTyxNQUFNLFFBQVEsWUFBWSxXQUFXLEtBQUssU0FBUyxVQUFVLEdBQUcsVUFBVSxVQUFVLFdBQVcsV0FBVztBQUNySDtBQUVBLHNCQUE2QixNQUFjLGlCQUF5QixZQUFxQixnQkFBd0IsYUFBMkIsY0FBd0I7QUFDaEssTUFBSSxjQUFjLElBQUksY0FBYyxZQUFZLFdBQVcsSUFBSTtBQUMvRCxnQkFBYyxNQUFNLFFBQVEsYUFBYSxJQUFJLGNBQWMsWUFBWSxlQUFlLEdBQUcsWUFBWSxVQUFVLFlBQVksV0FBVyxZQUFZLFdBQVcsYUFBYSxZQUFZO0FBRXRMLE1BQUcsZUFBZSxNQUFLO0FBQ25CO0FBQUEsRUFDSjtBQUVBLGdCQUFjLE1BQU0sWUFBWSxVQUFVLGFBQWEsWUFBWSxVQUFVLFlBQVksV0FBVyxXQUFXO0FBQy9HLGdCQUFjLE1BQU0sV0FBVyxPQUFPLGFBQWEsWUFBWSxXQUFXLFdBQVc7QUFFckYsZ0JBQWMsTUFBTSxlQUFlLGFBQWEsWUFBWSxTQUFTO0FBRXJFLE1BQUksWUFBWTtBQUNaLFdBQU8sYUFBYSxlQUFlLGFBQWEsZ0JBQWdCLFlBQVksUUFBUTtBQUFBLEVBQ3hGO0FBRUEsZ0JBQWMsTUFBTSxjQUFjLGFBQWEsYUFBYSxlQUFlO0FBRTNFLGdCQUFjLE1BQU0sYUFBYSxVQUFVLGFBQWEsV0FBVztBQUNuRSxnQkFBYyxNQUFNLFlBQVkscUJBQXFCLFdBQVc7QUFDaEUsZ0JBQWEsYUFBYSxjQUFjLGFBQWEsWUFBWSxLQUFLO0FBRXRFLFNBQU87QUFDWDs7O0FDdklBOzs7QUNDQTtBQU1BLDRCQUEyQixXQUFtQixNQUFjLFNBQWtCLFFBQXVCLGFBQXNCO0FBQ3ZILFFBQU0sV0FBVyxTQUFTLE9BQU8sS0FBSyxXQUFXLGtCQUFrQixTQUFTLE9BQU8sS0FBSztBQUN4RixRQUFNLGFBQStCO0FBQUEsSUFDakMsVUFBVTtBQUFBLElBQ1YsZ0JBQWdCLFlBQVk7QUFBQSxJQUM1QixLQUFLLGFBQWE7QUFBQSxNQUNkLFFBQVEsaURBQ0QsU0FDQSxVQUFVLGtCQUFrQixJQUM1QixVQUFVLFdBQVc7QUFBQSxJQUVoQyxDQUFDO0FBQUEsSUFDRCxRQUFRLFlBQVksUUFBUSxLQUFLLFlBQVksQ0FBQyxLQUFLLFlBQVksUUFBUTtBQUFBLElBQ3ZFLFlBQVksVUFBVSxXQUFXO0FBQUEsRUFDckM7QUFFQSxNQUFJLFNBQVMsTUFBTSxlQUFPLFNBQVMsUUFBUTtBQUUzQyxNQUFJO0FBQ0EsYUFBVSxPQUFNLFdBQVUsUUFBUSxVQUFVLEdBQUc7QUFBQSxFQUNuRCxTQUFTLEtBQVA7QUFDRSxzQkFBa0IsR0FBRztBQUFBLEVBQ3pCO0FBRUEsUUFBTSxlQUFPLGFBQWEsV0FBVyxTQUFTLE9BQU8sRUFBRTtBQUN2RCxRQUFNLGVBQU8sVUFBVSxpQkFBaUIsTUFBTTtBQUU5QyxTQUFPO0FBQUEsSUFDSCxVQUFVLE1BQU0sZUFBTyxLQUFLLFVBQVUsU0FBUztBQUFBLEVBQ25EO0FBQ0o7QUFFTyxpQkFBaUIsY0FBc0IsU0FBa0I7QUFDNUQsU0FBTyxhQUFZLGNBQWMsTUFBTSxPQUFPO0FBQ2xEO0FBRU8saUJBQWlCLGNBQXNCLFNBQWtCO0FBQzVELFNBQU8sYUFBWSxjQUFjLE1BQU0sU0FBUyxFQUFFLFFBQVEsY0FBYyxZQUFZLEtBQUssQ0FBQztBQUM5RjtBQUVPLGtCQUFrQixjQUFzQixTQUFrQjtBQUM3RCxTQUFPLGFBQVksY0FBYyxPQUFPLFNBQVMsRUFBRSxRQUFRLGNBQWMsS0FBSyxLQUFLLEdBQUcsWUFBWTtBQUN0RztBQUVPLGtCQUFrQixjQUFzQixTQUFrQjtBQUM3RCxTQUFPLGFBQVksY0FBYyxPQUFPLFNBQVMsRUFBRSxRQUFRLGNBQWMsS0FBSyxNQUFNLFlBQVksS0FBTSxHQUFHLFlBQVk7QUFDekg7OztBQ3BEQTtBQUdBO0FBUUEsNEJBQTBDLGNBQXNCLFNBQWtCO0FBQzlFLFFBQU0sV0FBVyxTQUFTLE9BQU8sS0FBSyxjQUFjLGtCQUFrQixTQUFTLE9BQU8sS0FBSztBQUUzRixRQUFNLEVBQUUsTUFBTSxjQUFjLEtBQUssZUFBZSxNQUFNLFdBQVcsVUFBVSxTQUFTLE9BQU8sS0FBSyxNQUFNLFlBQVk7QUFDbEgsUUFBTSxXQUFXLFNBQVMsTUFBTSxPQUFPLEVBQUUsSUFBSTtBQUM3QyxNQUFJLElBQVM7QUFDYixNQUFJO0FBQ0EsVUFBTSxTQUFTLEFBQU8sZ0JBQVEsTUFBTTtBQUFBLE1BQ2hDO0FBQUEsTUFDQSxLQUFLO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsTUFDTCxZQUFZO0FBQUEsTUFDWixZQUFZO0FBQUEsSUFDaEIsQ0FBQztBQUNELG9CQUFnQixPQUFPLFVBQVUsVUFBVSxHQUFHO0FBQzlDLFNBQUssT0FBTztBQUNaLFVBQU0sT0FBTztBQUFBLEVBQ2pCLFNBQVEsS0FBTjtBQUNFLHFCQUFpQixLQUFLLFVBQVUsR0FBRztBQUNuQyxXQUFPO0FBQUEsTUFDSCxVQUFVO0FBQUEsSUFDZDtBQUFBLEVBQ0o7QUFHQSxRQUFNLG1CQUFtQixHQUFHLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUV0RCxNQUFHLFNBQVE7QUFDUCxPQUFHLElBQUksUUFBUSxLQUFLO0FBQUEsRUFDeEI7QUFFQSxNQUFJLFlBQVksT0FBTyxLQUFLLFlBQVksUUFBUSxHQUFHO0FBQy9DLFFBQUk7QUFDQSxZQUFNLEVBQUUsYUFBTSxjQUFRLE1BQU0sV0FBVSxHQUFHLE1BQU07QUFBQSxRQUMzQyxLQUFLLGFBQWE7QUFBQSxVQUNkLFFBQU87QUFBQSxZQUNILFFBQVEsY0FBYyxPQUFPLGVBQWM7QUFBQSxhQUN4QyxVQUFVLFdBQVcsWUFBWSxJQUFHLFNBQVM7QUFBQSxRQUV4RCxDQUFDO0FBQUEsUUFDRCxRQUFRO0FBQUEsUUFDUixZQUFZO0FBQUEsTUFDaEIsQ0FBQztBQUVELFNBQUcsT0FBTztBQUNWLFVBQUksTUFBSztBQUNMLFdBQUcsTUFBTSxNQUFNLGVBQWUsS0FBSyxNQUFNLElBQUcsR0FBRyxHQUFHLEdBQUc7QUFBQSxNQUN6RDtBQUFBLElBQ0osU0FBUyxLQUFQO0FBQ0UsWUFBTSwyQkFBMkIsS0FBSyxHQUFHLEtBQUssUUFBUTtBQUFBLElBQzFEO0FBQUEsRUFDSjtBQUVBLE1BQUksU0FBUztBQUNULE9BQUcsUUFBUSxhQUFhLEdBQUcsR0FBRztBQUU5QixRQUFJLElBQUksTUFBTTtBQUNWLFVBQUksSUFBSSxRQUFRLEtBQUs7QUFDckIsVUFBSSxRQUFRLGFBQWEsSUFBSSxLQUFLLElBQUk7QUFBQSxJQUMxQztBQUFBLEVBQ0o7QUFFQSxRQUFNLGVBQU8sYUFBYSxjQUFjLFNBQVMsT0FBTyxFQUFFO0FBQzFELFFBQU0sZUFBTyxVQUFVLGtCQUFrQixPQUFPLEdBQUcsSUFBSTtBQUN2RCxRQUFNLGVBQU8sVUFBVSxrQkFBa0IsUUFBUSxJQUFJLFFBQVEsRUFBRTtBQUUvRCxTQUFPLGlDQUNBLGVBREE7QUFBQSxJQUVILFVBQVUsTUFBTSxlQUFPLEtBQUssVUFBVSxTQUFTO0FBQUEsRUFDbkQ7QUFDSjs7O0FDbkZBO0FBRUE7QUFDQTtBQUlBLDhCQUFxQyxXQUFtQixNQUErQixTQUFzRDtBQUN6SSxRQUFNLFdBQVcsU0FBUyxPQUFPLEtBQUssV0FBVyxrQkFBa0IsU0FBUyxPQUFPLEtBQUs7QUFFeEYsUUFBTSxtQkFBbUI7QUFBQSxJQUNyQixVQUFVLE1BQU0sZUFBTyxLQUFLLFVBQVUsU0FBUztBQUFBLEVBQ25EO0FBRUEsUUFBTSxXQUFXLE1BQU0sZUFBTyxTQUFTLFFBQVEsR0FBRyxrQkFBa0IsT0FBSyxRQUFRLFFBQVE7QUFFekYsTUFBSTtBQUNBLFVBQU0sU0FBUyxNQUFNLE1BQUssbUJBQW1CLFVBQVU7QUFBQSxNQUNuRCxXQUFXO0FBQUEsTUFDWCxRQUFRLFdBQVcsSUFBSTtBQUFBLE1BQ3ZCLE9BQU8sVUFBVSxJQUFJO0FBQUEsTUFDckIsUUFBUSxNQUFLLE9BQU87QUFBQSxNQUNwQixVQUFVLGVBQWUsUUFBUTtBQUFBLElBQ3JDLENBQUM7QUFFRCxRQUFJLFFBQVEsWUFBWTtBQUNwQixpQkFBVyxRQUFRLE9BQU8sWUFBWTtBQUNsQyxjQUFNLFdBQVcsZUFBbUIsSUFBSTtBQUN4Qyx5QkFBaUIsY0FBYyxTQUFTLFFBQVEsS0FBSyxNQUFNLGVBQU8sS0FBSyxVQUFVLFdBQVcsTUFBTSxJQUFJO0FBQUEsTUFDMUc7QUFBQSxJQUNKO0FBRUEsUUFBSSxPQUFPLE9BQU87QUFFbEIsUUFBSSxXQUFXLE9BQU8sV0FBVztBQUM3QixvQkFBYyxPQUFPLFdBQVcsZUFBYyxRQUFRLEVBQUUsSUFBSTtBQUM1RCxhQUFPLFVBQVUsVUFBVSxPQUFPLFVBQVUsUUFBUSxJQUFJLE9BQUssT0FBSyxTQUFTLGlCQUFpQixlQUFjLENBQUMsQ0FBQyxJQUFJLGNBQWM7QUFFOUgsY0FBUTtBQUFBLGtFQUF1RSxPQUFPLEtBQUssS0FBSyxVQUFVLE9BQU8sU0FBUyxDQUFDLEVBQUUsU0FBUyxRQUFRO0FBQUEsSUFDbEo7QUFDQSxVQUFNLGVBQU8sYUFBYSxXQUFXLFNBQVMsT0FBTyxFQUFFO0FBQ3ZELFVBQU0sZUFBTyxVQUFVLGlCQUFpQixJQUFJO0FBQUEsRUFDaEQsU0FBUyxLQUFQO0FBQ0UsbUJBQWUsR0FBRztBQUNsQixXQUFPLENBQUM7QUFBQSxFQUNaO0FBRUEsU0FBTztBQUNYOzs7QUh4Q0E7QUFDQTtBQUNBO0FBR0EsSUFBTSxpQkFBaUIsQ0FBQyxNQUFNLFVBQVUsTUFBTSxPQUFPLE9BQU8sT0FBTyxRQUFRLE1BQU07QUFFakYsSUFBTSxtQkFBa0IsSUFBSSxVQUFVLGFBQWE7QUFFbkQsc0NBQXFDLFFBQWM7QUFDL0MsUUFBTSxJQUFJLGlCQUFnQixNQUFNO0FBRWhDLGFBQVcsS0FBSyxHQUFHO0FBQ2YsUUFBSSxJQUFJO0FBRVIsUUFBSSxLQUFLLFlBQVk7QUFDakIsVUFBSSxTQUFTLE9BQU8sS0FBSyxNQUFNO0FBQUEsSUFDbkM7QUFFQSxVQUFNLFdBQVcsY0FBYyxrQkFBa0I7QUFDakQsUUFBSSxNQUFNLGVBQU8sS0FBSyxVQUFVLFdBQVcsSUFBSSxLQUFLLEVBQUUsSUFBSTtBQUN0RCxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFFQSxTQUFPLENBQUM7QUFDWjtBQUdBLHlCQUF3QyxXQUFtQixTQUFrQixpQkFBMEI7QUFDbkcsUUFBTSxNQUFNLE9BQUssUUFBUSxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsWUFBWTtBQUU3RCxNQUFJO0FBQ0osVUFBUTtBQUFBLFNBQ0M7QUFDRCxxQkFBZSxNQUFNLFFBQVEsV0FBVyxPQUFPO0FBQy9DO0FBQUEsU0FDQztBQUNELHFCQUFlLE1BQU0sUUFBUSxXQUFXLE9BQU87QUFDL0M7QUFBQSxTQUNDO0FBQ0QscUJBQWUsTUFBTSxTQUFTLFdBQVcsT0FBTztBQUNoRDtBQUFBLFNBQ0M7QUFDRCxxQkFBZSxNQUFNLFNBQVMsV0FBVyxPQUFPO0FBQ2hEO0FBQUEsU0FDQztBQUFBLFNBQ0E7QUFBQSxTQUNBO0FBQ0QscUJBQWUsTUFBTSxlQUFlLFdBQVcsS0FBSyxPQUFPO0FBQzNEO0FBQUEsU0FDQztBQUNELHFCQUFlLE1BQU0sYUFBWSxXQUFXLE9BQU87QUFDbkQseUJBQW1CO0FBQUE7QUFHM0IsTUFBSSxXQUFXLE1BQU0sZUFBTyxXQUFXLGVBQWUsR0FBRztBQUNyRCxxQkFBZ0IsT0FBTyxXQUFXLFlBQVk7QUFDOUMsV0FBTztBQUFBLEVBQ1g7QUFFQSxNQUFJLENBQUM7QUFDRCxXQUFPO0FBQ2Y7QUFTQSxJQUFNLGNBQWMsYUFBYTtBQUNqQyxJQUFNLFlBQXVCO0FBQUEsRUFBQztBQUFBLElBQzFCLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFVBQVUsY0FBYztBQUFBLEVBQzVCO0FBQUEsRUFDQTtBQUFBLElBQ0ksTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sVUFBVSxjQUFjO0FBQUEsRUFDNUI7QUFBQSxFQUNBO0FBQUEsSUFDSSxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixVQUFVLGNBQWM7QUFBQSxFQUM1QjtBQUFDO0FBRUQsSUFBTSxxQkFBZ0M7QUFBQSxFQUFDO0FBQUEsSUFDbkMsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUNBO0FBQUEsSUFDSSxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsRUFDVjtBQUFBLEVBQ0E7QUFBQSxJQUNJLEtBQUs7QUFBQSxJQUNMLE1BQU07QUFBQSxFQUNWO0FBQUM7QUFFRCxpQ0FBaUMsU0FBa0IsVUFBa0IsU0FBa0I7QUFDbkYsUUFBTSxRQUFRLG1CQUFtQixLQUFLLE9BQUssU0FBUyxTQUFTLEVBQUUsR0FBRyxDQUFDO0FBRW5FLE1BQUksQ0FBQztBQUNEO0FBR0osUUFBTSxXQUFXLFFBQVEsTUFBTSxLQUFLLE1BQU0sU0FBUyxLQUFLLEtBQUssU0FBUyxPQUFPO0FBQzdFLFFBQU0sV0FBVyxPQUFLLEtBQUssVUFBVSxRQUFRO0FBRTdDLE1BQUksV0FBVyxNQUFNLGVBQU8sV0FBVyxRQUFRO0FBQzNDLFdBQU8saUNBQUssUUFBTCxFQUFZLFNBQVM7QUFDcEM7QUFFQSxJQUFJLHNCQUFzQztBQUUxQyxJQUFJLEtBQUssU0FBUyxrQkFBa0I7QUFDaEMsd0JBQXNCO0FBQzFCLHdDQUF3QztBQUNwQyxNQUFJLE9BQU8sdUJBQXVCO0FBQzlCLFdBQU87QUFFWCxNQUFJO0FBQ0EsMEJBQXVCLE9BQU0sU0FBUyxPQUNsQyxtRkFDQTtBQUFBLE1BQ0ksVUFBVSxHQUFXO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQztBQUM3QyxpQkFBTztBQUNYLGNBQU0sSUFBSSxNQUFNLFdBQVc7QUFBQSxNQUMvQjtBQUFBLE1BQ0EsU0FBUyxNQUFPO0FBQUEsSUFDcEIsQ0FDSixHQUFHLEtBQUssRUFBRSxZQUFZLEtBQUs7QUFBQSxFQUUvQixRQUFFO0FBQUEsRUFBUTtBQUdWLFNBQU87QUFDWDtBQUVBLElBQU0sY0FBYyxDQUFDLFNBQVMsT0FBTyxJQUFJLFNBQVMsS0FBSyxJQUFJLFVBQVUsWUFBWTtBQVVqRiwyQkFBMkIsU0FBa0IsVUFBa0IsU0FBa0I7QUFDN0UsTUFBSSxDQUFDLFdBQVcsVUFBVSxXQUFXLEtBQUssT0FBSyxRQUFRLFFBQVEsS0FBSyxhQUFhLENBQUMsWUFBWSxTQUFTLFNBQVMsTUFBTSxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLHVCQUF1QjtBQUNySztBQUVKLFFBQU0sV0FBVyxPQUFLLEtBQUssY0FBYyxpQkFBaUIsU0FBUyxVQUFVLEdBQUcsU0FBUyxTQUFTLENBQUMsQ0FBQztBQUVwRyxNQUFJLFdBQVcsTUFBTSxlQUFPLFdBQVcsUUFBUTtBQUMzQyxXQUFPO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDZDtBQUNSO0FBRUEsMkJBQTJCLFVBQWtCLFNBQWtCLFNBQWtCO0FBQzdFLFFBQU0sZUFBZSxTQUFTLFVBQVUsR0FBRyxTQUFTLFNBQVMsQ0FBQztBQUM5RCxRQUFNLFdBQVcsU0FBUyxPQUFPLEtBQUs7QUFFdEMsTUFBSTtBQUNKLE1BQUksT0FBSyxRQUFRLFlBQVksS0FBSyxhQUFjLFlBQVksV0FBUyxNQUFNLGVBQU8sV0FBVyxRQUFRO0FBQ2pHLFdBQU87QUFBQSxNQUNILE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNkO0FBRUosTUFBSSxXQUFXLENBQUMsU0FBUTtBQUNwQixVQUFNLFVBQVUsY0FBYyxTQUFTLFNBQVMsT0FBTyxLQUFLLFlBQVk7QUFDeEUsV0FBTyxZQUFZLFVBQVUsU0FBUyxLQUFLO0FBQUEsRUFDL0M7QUFDSjtBQUVBLDRCQUE0QixVQUFrQixTQUFrQjtBQUM1RCxNQUFJLENBQUMsU0FBUyxXQUFXLGNBQWM7QUFDbkM7QUFFSixRQUFNLFdBQVcsbUJBQW1CLGlCQUFpQixTQUFTLFVBQVUsQ0FBQyxJQUFLLFFBQUssUUFBUSxRQUFRLElBQUksS0FBSztBQUU1RyxNQUFJLFdBQVcsTUFBTSxlQUFPLFdBQVcsUUFBUTtBQUMzQyxXQUFPO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDZDtBQUNSO0FBRUEsaUNBQWlDLFVBQWtCLFNBQWtCO0FBQ2pFLE1BQUksQ0FBQyxTQUFTLFdBQVcscUJBQXFCO0FBQzFDO0FBRUosUUFBTSxXQUFXLG1CQUFtQixxQ0FBcUMsU0FBUyxVQUFVLEVBQUU7QUFFOUYsTUFBSSxXQUFXLE1BQU0sZUFBTyxXQUFXLFFBQVE7QUFDM0MsV0FBTztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLElBQ2Q7QUFDUjtBQUVBLDZCQUE2QixVQUFrQixTQUFrQjtBQUM3RCxNQUFJLENBQUMsU0FBUyxXQUFXLGdCQUFnQjtBQUNyQztBQUVKLE1BQUksV0FBVyxTQUFTLFVBQVUsRUFBRTtBQUNwQyxNQUFJLFNBQVMsV0FBVyxPQUFPO0FBQzNCLGVBQVcsU0FBUyxVQUFVLENBQUM7QUFBQTtBQUUvQixlQUFXLE1BQU07QUFHckIsUUFBTSxXQUFXLG1CQUFtQixxREFBcUQsU0FBUyxRQUFRLFFBQVEsVUFBVTtBQUU1SCxNQUFJLFdBQVcsTUFBTSxlQUFPLFdBQVcsUUFBUTtBQUMzQyxXQUFPO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDZDtBQUNSO0FBR0EsMkJBQWtDLFNBQWtCLFNBQWtCLFFBQWMsVUFBVSxPQUFnQztBQUMxSCxTQUFPLE1BQU0sYUFBYSxRQUFNLE9BQU8sS0FDbkMsTUFBTSxZQUFZLFFBQU0sU0FBUyxPQUFPLEtBQ3hDLE1BQU0sWUFBWSxTQUFTLFFBQU0sT0FBTyxLQUN4QyxNQUFNLGtCQUFrQixTQUFTLFFBQU0sT0FBTyxLQUM5QyxNQUFNLGNBQWMsUUFBTSxPQUFPLEtBQ2pDLE1BQU0sa0JBQWtCLFFBQU0sT0FBTyxLQUNyQyxVQUFVLEtBQUssT0FBSyxFQUFFLFFBQVEsTUFBSTtBQUMxQztBQU1BLHVCQUE4QixXQUFtQixTQUFrQixTQUFrQixVQUFvQjtBQUVyRyxRQUFNLFlBQVksTUFBTSxZQUFZLFNBQVMsU0FBUyxXQUFXLElBQUk7QUFFckUsTUFBSSxXQUFXO0FBQ1gsYUFBUyxLQUFLLFVBQVUsSUFBSTtBQUM1QixhQUFTLElBQUksTUFBTSxlQUFPLFNBQVMsVUFBVSxRQUFRLENBQUM7QUFDdEQ7QUFBQSxFQUNKO0FBR0EsUUFBTSxrQkFBa0IsU0FBUyxPQUFPLEtBQUs7QUFDN0MsUUFBTSxXQUFXLFNBQVMsT0FBTyxLQUFLO0FBRXRDLFFBQU0sTUFBTSxPQUFLLFFBQVEsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFlBQVk7QUFFN0QsTUFBSSxDQUFDLGVBQWUsU0FBUyxHQUFHLEdBQUc7QUFDL0IsYUFBUyxTQUFTLFFBQVE7QUFDMUI7QUFBQSxFQUNKO0FBRUEsTUFBSSxDQUFDLFFBQVEsUUFBUSxLQUFLLEVBQUUsU0FBUyxHQUFHLEdBQUc7QUFDdkMsYUFBUyxLQUFLLEtBQUs7QUFBQSxFQUN2QixPQUFPO0FBQ0gsYUFBUyxLQUFLLElBQUk7QUFBQSxFQUN0QjtBQUVBLE1BQUksVUFBVTtBQUdkLE1BQUksV0FBWSxTQUFRLE1BQU0sVUFBVSxVQUFVLE1BQU0sdUJBQXNCLFNBQVMsS0FBSyxDQUFDLE1BQU0sVUFBVSxXQUFXLFNBQVMsZUFBZSxJQUFJO0FBQ2hKLGNBQVU7QUFBQSxFQUNkLFdBQVcsT0FBTztBQUNkLGVBQVc7QUFFZixXQUFTLElBQUksTUFBTSxJQUFHLFNBQVMsU0FBUyxTQUFTLE1BQU0sQ0FBQztBQUM1RDs7O0FJelJBOzs7QUNQQTs7O0FDS0EsNEJBQW1DLE9BQWlCLFNBQWtCO0FBQ2xFLFFBQU0sa0JBQWtCLENBQUM7QUFDekIsV0FBUyxLQUFLLE9BQU87QUFDakIsUUFBSSxhQUFhLENBQUM7QUFFbEIsVUFBTSxJQUFJLE1BQU0sV0FBVyxDQUFDLG1CQUFtQixHQUFHLEdBQUcsU0FBUyxRQUFRLEVBQUMsUUFBTyxDQUFDO0FBQy9FLFFBQUksS0FBSyxPQUFPLEVBQUUsZUFBZSxZQUFZO0FBQ3pDLHNCQUFnQixLQUFLLEVBQUUsV0FBVztBQUFBLElBQ3RDLE9BQU87QUFDSCxZQUFNLElBQUksK0NBQStDO0FBQUEsQ0FBSztBQUFBLElBQ2xFO0FBQUEsRUFDSjtBQUVBLFNBQU87QUFDWDtBQUVBLElBQUk7QUFDSiwyQkFBa0MsVUFBa0IsU0FBaUI7QUFDakUsTUFBRyxNQUFNLGVBQU8sV0FBVyxXQUFXLEtBQUssR0FBRTtBQUN6QyxnQkFBWTtBQUFBLEVBQ2hCLE9BQU87QUFDSCxnQkFBWTtBQUFBLEVBQ2hCO0FBQ0EsUUFBTSxhQUFrQixNQUFNLGVBQU8sS0FBSyxVQUFVLFdBQVcsTUFBTSxJQUFJO0FBRXpFLE1BQUcsY0FBYyxzQkFBc0IsQ0FBQztBQUNwQyxXQUFPO0FBRVgsdUJBQXFCO0FBQ3JCLFFBQU0sT0FBTyxNQUFNLFlBQVksVUFBVSxPQUFPO0FBQ2hELFNBQU8sS0FBSztBQUNoQjtBQUVPLDJCQUEwQjtBQUM3QixTQUFPO0FBQ1g7OztBRDNCQSwwQkFBa0M7QUFBQSxFQUc5QixjQUFjO0FBRk4saUJBQWdCLEVBQUUsUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUFFO0FBRy9FLFNBQUssTUFBTSxTQUFTLGdCQUFnQjtBQUFBLEVBQ3hDO0FBQUEsTUFFSSxVQUFVO0FBQ1YsV0FBTyxLQUFLLE1BQU07QUFBQSxFQUN0QjtBQUFBLE1BRUksUUFBUTtBQUNSLFdBQU8sS0FBSyxNQUFNO0FBQUEsRUFDdEI7QUFBQSxNQUVJLFFBQVE7QUFDUixXQUFPLEtBQUssTUFBTTtBQUFBLEVBQ3RCO0FBQUEsRUFFQSxRQUFRLFFBQWMsTUFBYztBQUNoQyxRQUFJLENBQUMsS0FBSyxNQUFNLFVBQVUsS0FBSyxPQUFLLEVBQUUsTUFBTSxVQUFRLEVBQUUsTUFBTSxJQUFJO0FBQzVELFdBQUssTUFBTSxVQUFVLEtBQUssQ0FBQyxRQUFNLElBQUksQ0FBQztBQUFBLEVBQzlDO0FBQUEsRUFFQSxVQUFVLFFBQWM7QUFDcEIsUUFBSSxDQUFDLEtBQUssTUFBTSxZQUFZLFNBQVMsTUFBSTtBQUNyQyxXQUFLLE1BQU0sWUFBWSxLQUFLLE1BQUk7QUFBQSxFQUN4QztBQUFBLEVBRUEsUUFBUSxRQUFjO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLE1BQU0sVUFBVSxTQUFTLE1BQUk7QUFDbkMsV0FBSyxNQUFNLFVBQVUsS0FBSyxNQUFJO0FBQUEsRUFDdEM7QUFBQSxFQUVBLFNBQVM7QUFDTCxXQUFPLGVBQU8sY0FBYyxjQUFhLFVBQVUsS0FBSyxLQUFLO0FBQUEsRUFDakU7QUFBQSxlQUVhLFlBQVk7QUFDckIsUUFBSSxDQUFDLE1BQU0sZUFBTyxXQUFXLEtBQUssUUFBUTtBQUFHO0FBRTdDLFVBQU0sUUFBUSxJQUFJLGNBQWE7QUFDL0IsVUFBTSxRQUFRLE1BQU0sZUFBTyxhQUFhLEtBQUssUUFBUTtBQUVyRCxRQUFJLE1BQU0sTUFBTSxVQUFVLGdCQUFnQjtBQUFHO0FBRTdDLFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFoREE7QUFFVyxBQUZYLGFBRVcsV0FBVyxPQUFLLEtBQUssWUFBWSxtQkFBbUI7OztBREgvRDs7O0FHWkE7OztBQ01PLHFCQUFxQixNQUFjLFVBQWdCO0FBQ3RELFNBQU8sS0FBSyxTQUFTLE1BQU0sUUFBTztBQUN0QztBQVFPLG9CQUFvQixPQUFpQixNQUFjO0FBQ3RELFNBQU8sS0FBSyxZQUFZO0FBRXhCLGFBQVcsUUFBUSxPQUFPO0FBQ3RCLFFBQUksWUFBWSxNQUFLLElBQUksR0FBRztBQUN4QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFDQSxTQUFPO0FBQ1g7QUFPTyx1QkFBdUIsUUFBZ0I7QUFDMUMsU0FBTyxPQUFPLFVBQVUsR0FBRyxPQUFPLFlBQVksR0FBRyxDQUFDO0FBQ3REOzs7QUQxQkEsNkJBQTZCLFdBQXFCLFFBQWMsT0FBcUI7QUFDakYsUUFBTSxjQUFjLE1BQU0sZUFBTyxRQUFRLFVBQVUsS0FBSyxRQUFNLEVBQUUsZUFBZSxLQUFLLENBQUM7QUFFckYsUUFBTSxZQUFVLENBQUM7QUFDakIsYUFBVyxLQUFlLGFBQWE7QUFDbkMsVUFBTSxJQUFJLEVBQUUsTUFBTSxVQUFVLFNBQU87QUFDbkMsUUFBSSxFQUFFLFlBQVksR0FBRztBQUNqQixnQkFBUyxLQUFLLGNBQWMsV0FBVyxVQUFVLEtBQUssS0FBSyxDQUFDO0FBQUEsSUFDaEUsT0FDSztBQUNELFVBQUksV0FBVyxjQUFjLGdCQUFnQixDQUFDLEdBQUc7QUFDN0MsY0FBTSxRQUFRLFNBQVMsVUFBVSxFQUFFO0FBQUEsTUFDdkMsV0FBVyxhQUFhLFNBQVMsVUFBVSxXQUFXLGNBQWMsbUJBQW1CLENBQUMsR0FBRztBQUN2RixjQUFNLFVBQVUsT0FBTztBQUFBLE1BQzNCLE9BQU87QUFDSCxjQUFNLFFBQVEsT0FBTztBQUFBLE1BQ3pCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFFQSxTQUFPLFFBQVEsSUFBSSxTQUFRO0FBQy9CO0FBRUEsMkJBQTBCO0FBQ3RCLFFBQU0sUUFBUSxJQUFJLGFBQWE7QUFDL0IsUUFBTSxRQUFRLElBQUk7QUFBQSxJQUNkLGNBQWMsU0FBUyxRQUFRLElBQUksS0FBSztBQUFBLElBQ3hDLGNBQWMsU0FBUyxNQUFNLElBQUksS0FBSztBQUFBLEVBQzFDLENBQUM7QUFDRCxTQUFPO0FBQ1g7QUFFQSw0QkFBbUMsU0FBdUI7QUFDdEQsU0FBTyxjQUFjLFNBQVEsTUFBTSxVQUFVLENBQUM7QUFDbEQ7QUFFQSw2QkFBb0MsU0FBd0IsT0FBcUI7QUFDN0UsUUFBTSxFQUFFLFNBQVMsZ0JBQWdCO0FBQ2pDLE1BQUksQ0FBQyxRQUFRO0FBQVM7QUFFdEIsUUFBTSxVQUFVLFFBQVEsWUFBWSxPQUFPLENBQUMsSUFBSSxRQUFRO0FBQ3hELFNBQU8sT0FBTyxTQUFTO0FBQUEsSUFDbkIsT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLElBQ1osV0FBVztBQUFBLEVBQ2YsQ0FBQztBQUVELFFBQU0sUUFBa0IsQ0FBQztBQUV6QjtBQUNBLGFBQVMsQ0FBQyxLQUFLLFNBQVMsTUFBTSxPQUFPO0FBRWpDLFVBQUcsUUFBUSxTQUFTLE9BQU8sTUFBTSxDQUFDLElBQUksU0FBUyxNQUFNLGNBQWMsVUFBVSxJQUFJO0FBQzdFO0FBRUosWUFBTSxNQUFNLElBQUksVUFBVSxHQUFHLElBQUksU0FBUyxjQUFjLFVBQVUsS0FBSyxTQUFTLENBQUM7QUFFakYsVUFBRyxPQUFLLFFBQVEsR0FBRyxLQUFLO0FBQ3BCO0FBRUosVUFBSSxRQUFRLFNBQVM7QUFDakIsbUJBQVcsVUFBUSxRQUFRLFNBQVM7QUFDaEMsY0FBSSxJQUFJLFdBQVcsTUFBSSxHQUFHO0FBQ3RCLGtCQUFNO0FBQUEsVUFDVjtBQUNBO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFFQSxVQUFJLFFBQVEsT0FBTztBQUNmLG1CQUFXLFVBQVEsUUFBUSxPQUFPO0FBQzlCLGNBQUksSUFBSSxXQUFXLE1BQUksR0FBRztBQUN0QixrQkFBTSxNQUFNLFFBQVEsTUFBTSxRQUFNLEdBQUc7QUFDbkM7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFFQSxVQUNJLFFBQVEsWUFBWSxLQUFLLFVBQVEsSUFBSSxTQUFTLE1BQUksSUFBSSxDQUFDLEtBQ3ZELFFBQVEsWUFBWSxLQUFLLFdBQVMsSUFBSSxXQUFXLEtBQUssQ0FBQztBQUV2RDtBQUVKLFVBQUksUUFBUSxXQUFXO0FBQ25CLG1CQUFXLFFBQVEsUUFBUSxXQUFXO0FBQ2xDLGNBQUksQ0FBQyxNQUFNLEtBQUssR0FBRztBQUNmO0FBQUEsUUFDUjtBQUFBLE1BQ0o7QUFFQSxVQUFJLENBQUMsUUFBUSxZQUFZO0FBQ3JCLG1CQUFXLFNBQVMsUUFBUSxZQUFZO0FBQ3BDLGdCQUFNLFNBQU8sTUFBTSxRQUFRLFdBQVcsT0FBTztBQUU3QyxjQUFJLElBQUksV0FBVyxNQUFJLEdBQUc7QUFDdEI7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFDQSxZQUFNLEtBQUssR0FBRztBQUFBLElBQ2xCO0FBRUEsTUFBSSxRQUFRO0FBQ1osTUFBSSxRQUFRLE1BQU07QUFDZCxVQUFNLGFBQWEsTUFBTSxXQUFXLGtCQUFrQixRQUFRLE1BQU0sU0FBUyxRQUFRLFdBQVc7QUFDaEcsUUFBRyxDQUFDLFlBQVksU0FBUTtBQUNwQixXQUFLLEtBQUssNkNBQThDLFFBQVEsSUFBSTtBQUFBLElBQ3hFLE9BQU87QUFDSCxjQUFRLE1BQU0sV0FBVyxRQUFRLE9BQU8sT0FBTyxPQUFNO0FBQUEsSUFDekQ7QUFBQSxFQUNKO0FBRUEsTUFBRyxTQUFTLE1BQU0sUUFBTztBQUNyQixVQUFNLFNBQU8sVUFBVSxPQUFPLGdCQUFlO0FBQzdDLFVBQU0sUUFBUSxNQUFJO0FBQ2xCLFVBQU0sZUFBTyxVQUFVLFNBQVMsT0FBTyxLQUFLLFFBQU0sTUFBTSxLQUFLLElBQUksQ0FBQztBQUFBLEVBQ3RFO0FBQ0o7OztBSDVHQSwyQkFBMkIsVUFBa0IsV0FBcUIsRUFBRSxTQUFTLGdCQUFnQixZQUFZLGdCQUFnQixpQkFBNkksQ0FBQyxHQUFHO0FBQ3RRLFFBQU0sZUFBZSxPQUFLLEtBQUssVUFBVSxJQUFJLFFBQVEsR0FBRyxrQkFBa0IsVUFBVSxLQUFLLFdBQVc7QUFFcEcsUUFBTSxPQUFPLE1BQU0sZUFBTyxTQUFTLGNBQWMsTUFBTTtBQUN2RCxRQUFNLFdBQVksY0FBYSxhQUFhLFdBQVcsTUFBTSxVQUFVLEtBQUssTUFBTTtBQUVsRixRQUFNLGNBQWMsa0JBQWtCLElBQUksYUFBYSxVQUFVLEtBQUssTUFBTSxVQUFVLGNBQWMsVUFBVSxJQUFJLFNBQVMsVUFBVSxXQUFXLENBQUM7QUFDakosUUFBTSxZQUFZLFdBQVcsWUFBWSxZQUFZO0FBRXJELFFBQU0sZUFBZSxhQUFhLGVBQWU7QUFDakQsUUFBTSxlQUFnQixNQUFNLE9BQU8sTUFBTSxpQkFBaUIsUUFBUSxVQUFVLEdBQUcsZ0JBQWdCLGFBQWEsWUFBWSxLQUFNLElBQUksY0FBYztBQUNoSixRQUFNLGdCQUFnQixhQUFhLGVBQWU7QUFFbEQsTUFBSSxDQUFDLGNBQWMsYUFBYSxRQUFRO0FBQ3BDLFVBQU0sZUFBTyxVQUFVLGlCQUFpQixhQUFhLGVBQWUsZUFBZSxDQUFDO0FBQ3BGLGFBQVMsT0FBTyxVQUFVLFlBQVksWUFBWTtBQUFBLEVBQ3REO0FBRUEsU0FBTyxFQUFFLGNBQWMsWUFBWTtBQUN2QztBQUVBLHVCQUF1QixRQUFnQjtBQUNuQyxTQUFPLFdBQVUsQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLFNBQVMsUUFBUSxFQUFFLFNBQVMsT0FBTyxhQUFhLEtBQUssQ0FBQztBQUMxRztBQUVBLDhCQUE2QixXQUFxQixRQUFjLE9BQXFCO0FBQ2pGLFFBQU0sY0FBYyxNQUFNLGVBQU8sUUFBUSxVQUFVLEtBQUssUUFBTSxFQUFFLGVBQWUsS0FBSyxDQUFDO0FBRXJGLGFBQVcsS0FBZSxhQUFhO0FBQ25DLFVBQU0sSUFBSSxFQUFFLE1BQU0sVUFBVSxTQUFPO0FBQ25DLFFBQUksRUFBRSxZQUFZLEdBQUc7QUFDakIsWUFBTSxlQUFPLE1BQU0sVUFBVSxLQUFLLE9BQU87QUFDekMsWUFBTSxlQUFjLFdBQVcsVUFBVSxLQUFLLEtBQUs7QUFBQSxJQUN2RCxPQUNLO0FBQ0QsVUFBSSxXQUFXLGNBQWMsZ0JBQWdCLENBQUMsR0FBRztBQUM3QyxjQUFNLFFBQVEsU0FBUyxVQUFVLEVBQUU7QUFDbkMsWUFBSSxNQUFNLHNCQUFzQixVQUFVLEtBQUssTUFBTSxPQUFPO0FBQ3hELGdCQUFNLFlBQVksU0FBUyxXQUFXLEVBQUUsY0FBYyxDQUFDLFlBQVksR0FBRyxjQUFjLFVBQVUsSUFBSSxFQUFFLENBQUM7QUFBQSxNQUM3RyxXQUFXLGFBQWEsU0FBUyxVQUFVLFdBQVcsY0FBYyxtQkFBbUIsQ0FBQyxHQUFHO0FBQ3ZGLGNBQU0sVUFBVSxPQUFPO0FBQ3ZCLGNBQU0sY0FBYyxPQUFPO0FBQUEsTUFDL0IsT0FBTztBQUNILGNBQU0sUUFBUSxPQUFPO0FBQ3JCLGNBQU0sVUFBWSxTQUFTLEtBQUs7QUFBQSxNQUNwQztBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7QUFFQSw4QkFBOEIsU0FBbUI7QUFDN0MsYUFBVyxVQUFRLFNBQVM7QUFDeEIsVUFBTSxjQUFjLE1BQUk7QUFBQSxFQUM1QjtBQUNKO0FBRUEsNkJBQTZCLEdBQVcsT0FBcUI7QUFDekQsUUFBTSxRQUFRLFNBQVM7QUFDdkIsUUFBTSxrQkFBa0IsTUFBTSxFQUFFO0FBQ2hDLFNBQU8sTUFBTSxlQUFjLE9BQU8sSUFBSSxLQUFLO0FBQy9DO0FBS0EsaUNBQXdDLFFBQWMsV0FBc0IsRUFBRSxnQkFBZ0IsWUFBWSxnQkFBZ0IsaUJBQTBILENBQUMsR0FBRztBQUNwUCxRQUFNLGVBQU8sYUFBYSxRQUFNLFVBQVUsRUFBRTtBQUM1QyxTQUFPLE1BQU0sWUFBWSxRQUFNLFdBQVcsRUFBQyxTQUFRLE1BQU0sZ0JBQWdCLFlBQVksZ0JBQWdCLGFBQVksQ0FBQztBQUN0SDtBQUVBLDJCQUFrQyxRQUFjLFdBQXFCLGNBQXdCO0FBQ3pGLFFBQU0sa0JBQWtCLFFBQU0sV0FBVyxFQUFDLGFBQVksQ0FBQztBQUN2RCxlQUFhO0FBQ2pCO0FBRUEsMEJBQWlDLFNBQXdCO0FBQ3JELE1BQUksUUFBUSxDQUFDLE1BQUssU0FBUyxTQUFTLEtBQUssTUFBTSxhQUFhLFVBQVU7QUFFdEUsTUFBSTtBQUFPLFdBQU8sTUFBTSxlQUFlLE1BQU0sT0FBTztBQUNwRCxXQUFTLE1BQU07QUFFZixVQUFRLElBQUksYUFBYTtBQUV6QixjQUFXO0FBRVgsUUFBTSxnQkFBZ0IsQ0FBQyxNQUFNLGNBQWMsU0FBUyxPQUFPLElBQUksS0FBSyxHQUFHLE1BQU0sY0FBYyxTQUFTLEtBQUssSUFBSSxLQUFLLEdBQUcsWUFBWTtBQUVqSSxTQUFPLFlBQVk7QUFDZixlQUFXLEtBQUssZUFBZTtBQUMzQixZQUFNLEVBQUU7QUFBQSxJQUNaO0FBQ0EsVUFBTSxjQUFjLFNBQVEsS0FBSztBQUNqQyxVQUFNLE9BQU87QUFDYixhQUFTLEtBQUs7QUFDZCxpQkFBWTtBQUFBLEVBQ2hCO0FBQ0o7OztBS25IQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7OztBQ0VBO0FBYUEsSUFBTSxvQkFBb0IsQ0FBQztBQVUzQixnQ0FBZ0MsY0FBNEIsV0FBcUIsV0FBVyxJQUFJLFFBQVEsQ0FBQyxHQUFHO0FBQ3hHLFFBQU0sa0JBQWdDLENBQUM7QUFDdkMsUUFBTSxhQUFhLENBQUM7QUFDcEIsYUFBVyxDQUFDLFVBQVUsVUFBVSxPQUFPLFFBQVEsWUFBWSxHQUFHO0FBQzFELGVBQVcsS0FBTSxhQUFZO0FBQ3pCLFVBQUksWUFBWSxZQUFZO0FBQ3hCLFlBQUksQ0FBQyxNQUFNO0FBQ1AsZ0JBQU0sWUFBWSxNQUFNLGVBQU8sS0FBSyxVQUFVLEtBQUssVUFBVSxXQUFXLElBQUk7QUFDaEYsd0JBQWdCLGNBQWMsTUFBTTtBQUFBLE1BQ3hDLE9BQU87QUFDSCx3QkFBZ0IsWUFBWSxNQUFNLGlCQUFzQixPQUFPLFdBQVcsVUFBVSxLQUFLO0FBQUEsTUFDN0Y7QUFBQSxJQUNKLEdBQ0UsQ0FBQztBQUFBLEVBQ1A7QUFFQSxRQUFNLFFBQVEsSUFBSSxVQUFVO0FBQzVCLFNBQU87QUFDWDtBQVFBLGlDQUFpQyxTQUF1QixTQUF1QjtBQUMzRSxhQUFXLFFBQVEsU0FBUztBQUN4QixRQUFJLFFBQVEsWUFBWTtBQUNwQixVQUFJLFFBQVEsU0FBUyxRQUFRO0FBQ3pCLGVBQU87QUFBQSxJQUNmLFdBQ1MsQ0FBQyx3QkFBd0IsUUFBUSxPQUFPLFFBQVEsS0FBSztBQUMxRCxhQUFPO0FBQUEsRUFDZjtBQUVBLFNBQU87QUFDWDtBQVVBLHdCQUF3QixTQUF1QixTQUF1QixTQUFTLElBQWM7QUFDekYsUUFBTSxjQUFjLENBQUM7QUFFckIsYUFBVyxRQUFRLFNBQVM7QUFDeEIsUUFBSSxRQUFRLFlBQVk7QUFDcEIsVUFBSSxRQUFRLFNBQVMsUUFBUSxPQUFPO0FBQ2hDLG9CQUFZLEtBQUssTUFBTTtBQUN2QjtBQUFBLE1BQ0o7QUFBQSxJQUNKLFdBQVcsQ0FBQyxRQUFRLE9BQU87QUFDdkIsa0JBQVksS0FBSyxJQUFJO0FBQ3JCO0FBQUEsSUFDSixPQUNLO0FBQ0QsWUFBTSxTQUFTLGVBQWUsUUFBUSxPQUFPLFFBQVEsT0FBTyxJQUFJO0FBQ2hFLFVBQUksT0FBTyxRQUFRO0FBQ2YsWUFBSTtBQUNBLHNCQUFZLEtBQUssTUFBTTtBQUMzQixvQkFBWSxLQUFLLEdBQUcsTUFBTTtBQUMxQjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUVBLFNBQU87QUFDWDtBQVlBLDJCQUEwQyxVQUFrQixZQUFvQixXQUFtQixXQUFxQixhQUE4QyxTQUFrQjtBQUNwTCxRQUFNLFVBQVUsWUFBWTtBQUU1QixNQUFJLFlBQW9CO0FBQ3hCLE1BQUksU0FBUztBQUVULFFBQUksQ0FBQyxXQUFXLFdBQVksUUFBUSxVQUFVO0FBQzFDLGFBQU8sUUFBUTtBQUVuQixpQkFBYSxNQUFNLGVBQU8sS0FBSyxVQUFVLEtBQUssUUFBUSxNQUFNLFdBQVcsTUFBTSxDQUFDO0FBQzlFLFFBQUksWUFBWTtBQUVaLGdCQUFVLE1BQU0saUJBQWlCLFFBQVEsY0FBYyxTQUFTO0FBRWhFLFVBQUksd0JBQXdCLFFBQVEsY0FBYyxPQUFPO0FBQ3JELGVBQU8sUUFBUTtBQUFBLElBRXZCLFdBQVcsUUFBUSxVQUFVO0FBQ3pCLGFBQU8sUUFBUTtBQUFBLEVBQ3ZCO0FBRUEsUUFBTSxXQUFXO0FBQ2pCLE1BQUksaUJBQWlCO0FBRXJCLE1BQUksQ0FBQyxTQUFTO0FBQ1YsUUFBSSxTQUFTLE1BQU07QUFDZixpQkFBVyxPQUFLLEtBQUssT0FBSyxTQUFTLFVBQVUsSUFBSSxTQUFTLEdBQUcsUUFBUTtBQUFBLGFBRWhFLFNBQVMsTUFBTTtBQUNwQix1QkFBaUI7QUFBQTtBQUdqQixpQkFBVyxTQUFTLFVBQVUsQ0FBQztBQUFBLEVBRXZDLE9BQU87QUFDSCxlQUFXLFFBQVE7QUFDbkIscUJBQWlCLFFBQVE7QUFBQSxFQUM3QjtBQUVBLE1BQUk7QUFDQSxnQkFBWSxZQUFZLEVBQUUsT0FBTyxNQUFNLGVBQWUsUUFBUSxHQUFHLFFBQVEsSUFBSSxRQUFRLE1BQU0sTUFBTSxTQUFTO0FBQUEsT0FDekc7QUFFRCxlQUFXLGFBQWEsUUFBUTtBQUVoQyxVQUFNLFdBQVcsVUFBVSxLQUFLO0FBQ2hDLGlCQUFhLGNBQWMsTUFBTSxlQUFPLEtBQUssVUFBVSxXQUFXLE1BQU0sQ0FBQztBQUV6RSxRQUFJLFlBQVk7QUFDWixZQUFNLFlBQVksa0JBQWtCO0FBQ3BDLFVBQUksYUFBYSx3QkFBd0IsVUFBVSxjQUFjLFVBQVUsV0FBVyxNQUFNLGlCQUFpQixVQUFVLGNBQWMsU0FBUyxDQUFDO0FBQzNJLG9CQUFZLFlBQVk7QUFBQSxXQUN2QjtBQUNELGtCQUFVLFdBQVcsQ0FBQztBQUV0QixvQkFBWSxZQUFZLEVBQUUsT0FBTyxNQUFNLFdBQVcsY0FBYyxTQUFTLFVBQVUsR0FBRyxVQUFVLFdBQVcsU0FBUyxTQUFTLGFBQWEsZUFBZSxVQUFVLGNBQWMsT0FBTyxDQUFDLEdBQUcsY0FBYyxTQUFTLE1BQU0sU0FBUztBQUFBLE1BQ3RPO0FBQUEsSUFDSixPQUNLO0FBQ0Qsa0JBQVksWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLFFBQVEsR0FBRyxNQUFNLFNBQVM7QUFDL0QsWUFBTSxDQUFDLFVBQVUsYUFBYSxlQUFlO0FBQUEsUUFDekMsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsTUFBTSxXQUFXLDBDQUEwQztBQUFBLE1BQy9ELENBQUM7QUFDRCxZQUFNLFVBQVUsU0FBUztBQUFBLElBQzdCO0FBQUEsRUFDSjtBQUVBLFFBQU0sYUFBYSxZQUFZO0FBQy9CLG9CQUFrQixXQUFXLFFBQVE7QUFFckMsU0FBTyxXQUFXO0FBQ3RCOzs7QUR4S0EsSUFBTSxVQUFTO0FBQUEsRUFDWCxhQUFhLENBQUM7QUFBQSxFQUNkLFNBQVM7QUFDYjtBQWFBLDJCQUEyQixVQUFrQixZQUFvQixXQUFtQixXQUFxQixhQUFxQyxZQUFpQjtBQUMzSixRQUFNLGNBQWMsWUFBWTtBQUNoQyxRQUFNLFdBQVcsTUFBTSxZQUFZLE1BQU0sVUFBVTtBQUVuRCxNQUFJO0FBRUosTUFBSSxhQUFhO0FBQ2IsUUFBSSxDQUFDLFdBQVc7QUFDWixhQUFPLFNBQVM7QUFFcEIsUUFBSSxZQUFZLFFBQVEsSUFBSTtBQUN4QixtQkFBYSxNQUFNLGVBQU8sV0FBVyxZQUFZLElBQUk7QUFFckQsVUFBSSxDQUFDO0FBQ0QsZUFBTyxTQUFTO0FBQUEsSUFDeEI7QUFBQSxFQUVKO0FBRUEsUUFBTSxXQUFXO0FBQ2pCLE1BQUksV0FBVSxPQUFLLFFBQVEsUUFBUSxFQUFFLFVBQVUsQ0FBQztBQUVoRCxNQUFJLENBQUMsVUFBUztBQUNWLGVBQVUsY0FBYyxVQUFVO0FBQ2xDLGdCQUFZLE1BQU07QUFBQSxFQUN0QjtBQUVBLE1BQUk7QUFDSixNQUFJLFNBQVMsTUFBTTtBQUNmLGVBQVcsT0FBSyxLQUFLLFdBQVcsUUFBUTtBQUFBO0FBRXhDLGVBQVcsT0FBSyxLQUFLLFVBQVUsSUFBSSxRQUFRO0FBRS9DLE1BQUksQ0FBQyxDQUFDLGNBQWMsVUFBVSxNQUFNLGNBQWMsVUFBVSxTQUFTLEVBQUUsU0FBUyxRQUFPLEdBQUc7QUFDdEYsVUFBTSxhQUFhLE1BQU0sZUFBTyxTQUFTLFFBQVE7QUFDakQsZUFBVyxNQUFNLFVBQVU7QUFDM0IsV0FBTztBQUFBLEVBQ1g7QUFFQSxlQUFhLGNBQWMsTUFBTSxlQUFPLFdBQVcsUUFBUTtBQUMzRCxNQUFJLENBQUMsWUFBWTtBQUNiLFVBQU0sQ0FBQyxVQUFVLGFBQWEsZUFBZTtBQUFBLE1BQ3pDLE1BQU07QUFBQSxNQUNOLFdBQVc7QUFBQSxNQUNYLE1BQU0sV0FBVywwQ0FBMEM7QUFBQSxJQUMvRCxDQUFDO0FBQ0QsVUFBTSxVQUFVLFNBQVM7QUFDekIsZ0JBQVksWUFBWSxFQUFFLE9BQU8sTUFBTTtBQUFBLElBQUUsR0FBRyxNQUFNLElBQUksTUFBTSxTQUFTO0FBQ3JFLFdBQU8sWUFBWSxVQUFVO0FBQUEsRUFDakM7QUFFQSxRQUFNLGVBQWdCLE9BQUssU0FBUyxVQUFVLElBQUcsUUFBUTtBQUN6RCxRQUFNLFlBQVksVUFBVSxLQUFLLE1BQU07QUFDdkMsUUFBTSxVQUFVLFdBQVcsV0FBWSxFQUFDLE1BQU0sZUFBTyxXQUFXLFVBQVUsS0FBSyxNQUFLLGVBQWUsTUFBTSxLQUFLLE1BQU0sc0JBQXNCLFNBQVM7QUFFbkosTUFBSTtBQUNBLFVBQU0sWUFBWSxjQUFjLFdBQVcsWUFBVyxjQUFjLFVBQVUsSUFBSTtBQUd0RixNQUFJLFFBQU8sWUFBWSxjQUFjLENBQUMsU0FBUztBQUMzQyxnQkFBWSxZQUFZLEVBQUUsT0FBTyxRQUFPLFlBQVksV0FBVyxHQUFHO0FBQ2xFLFdBQU8sTUFBTSxZQUFZLFVBQVUsTUFBTSxVQUFVO0FBQUEsRUFDdkQ7QUFFQSxRQUFNLE9BQU8sTUFBTSxTQUFTLFdBQVcsV0FBVyxPQUFPO0FBQ3pELE1BQUksUUFBTyxTQUFTO0FBQ2hCLFFBQUksQ0FBQyxRQUFPLFlBQVksWUFBWTtBQUNoQyxjQUFPLFlBQVksYUFBYSxDQUFDO0FBQUEsSUFDckM7QUFDQSxZQUFPLFlBQVksV0FBVyxLQUFLO0FBQUEsRUFDdkM7QUFFQSxjQUFZLFlBQVksRUFBRSxPQUFPLEtBQUs7QUFDdEMsU0FBTyxNQUFNLEtBQUssVUFBVTtBQUNoQztBQUVBLElBQU0sWUFBWSxDQUFDO0FBRW5CLDRCQUE0QixLQUFhO0FBQ3JDLFFBQU0sWUFBWSxXQUFXLEtBQUssR0FBRztBQUNyQyxRQUFNLFlBQVksU0FBUyxVQUFVO0FBQ3JDLFNBQU8sVUFBVSxLQUFLLFVBQVUsS0FBSztBQUN6QztBQVFBLHdCQUF3QixLQUFhLFNBQWtCO0FBQ25ELFFBQU0sWUFBWSxXQUFXLEtBQUssR0FBRztBQUVyQyxRQUFNLFlBQVksU0FBUyxVQUFVO0FBQ3JDLFFBQU0sY0FBYyxDQUFDO0FBRXJCLG9CQUFrQixZQUFvQixXQUFtQixZQUFpQixHQUFXO0FBQ2pGLFdBQU8sWUFBWSxHQUFHLFlBQVksV0FBVyxXQUFXLGFBQWEsV0FBVyxPQUFPO0FBQUEsRUFDM0Y7QUFFQSxvQkFBa0IsWUFBb0IsV0FBbUIsWUFBaUIsR0FBVyxhQUFhLENBQUMsR0FBRztBQUNsRyxXQUFPLFlBQVksR0FBRyxZQUFZLFdBQVcsV0FBVyxhQUFhLGtDQUFLLGFBQWUsV0FBWTtBQUFBLEVBQ3pHO0FBRUEscUJBQW1CLEdBQVcsY0FBdUIsWUFBaUIsWUFBb0IsV0FBbUIsWUFBaUI7QUFDMUgsZUFBVyxlQUFlLE9BQU87QUFFakMsUUFBSSxDQUFDLGNBQWM7QUFDZixZQUFNLFdBQVcsV0FBVyxRQUFRLE9BQU8sQ0FBQyxJQUFJO0FBQ2hELG1CQUFhLGlDQUNOLGFBRE07QUFBQSxRQUVULFNBQVMsaUNBQUssV0FBVyxVQUFoQixFQUF5QixPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxNQUFNLFNBQVM7QUFBQSxRQUN2RSxNQUFNO0FBQUEsUUFBVSxPQUFPLENBQUM7QUFBQSxRQUFHLE9BQU8sQ0FBQztBQUFBLE1BQ3ZDO0FBQUEsSUFDSjtBQUVBLFdBQU8sU0FBUyxZQUFZLFdBQVcsWUFBWSxHQUFHLFVBQVU7QUFBQSxFQUVwRTtBQUVBLFFBQU0sZUFBZSxPQUFLLEtBQUssVUFBVSxJQUFJLFVBQVUsS0FBSyxNQUFNO0FBQ2xFLFFBQU0sY0FBYyxDQUFDO0FBRXJCLE1BQUk7QUFDQSxVQUFNLFdBQVcsTUFBTSxvQkFBbUIsWUFBWTtBQUV0RCxXQUFPLFNBQVMsVUFBVSxVQUFVLFdBQVcsYUFBYSxzQkFBc0I7QUFBQSxFQUN0RixTQUFTLEdBQVA7QUFDRSxRQUFJO0FBRUosUUFBRyxTQUFRO0FBQ1AsWUFBTSxNQUFNLGtCQUFrQixjQUFjLEdBQUcsR0FBRyxNQUFNLEVBQUUsT0FBTztBQUNqRSxZQUFNLE1BQU0sRUFBRSxLQUFLO0FBQ25CLGtCQUFZLFNBQVMsV0FBVyxlQUFlLDBCQUEwQixFQUFFLFNBQVM7QUFBQSxJQUN4RixPQUFPO0FBQ0gsa0JBQVksU0FBUyxXQUFXLGVBQWUsRUFBRSxNQUFNO0FBQUEsSUFDM0Q7QUFFQSxXQUFPLENBQUMsZUFBb0I7QUFDeEIsaUJBQVcsUUFBUSxRQUFRO0FBQzNCLGlCQUFXLGVBQWUsUUFBUTtBQUFBLElBQ3RDO0FBQUEsRUFFSjtBQUNKO0FBUUEsbUJBQW1CLGNBQXdDLGlCQUF5QjtBQUNoRixRQUFNLFVBQVUsQ0FBQztBQUVqQixTQUFRLGVBQWdCLFVBQW9CLFNBQWtCLE1BQXFDLE9BQStCLFNBQWlDLFNBQWlDLE9BQWMsU0FBa0I7QUFDaE8sVUFBTSxpQkFBaUIsRUFBRSxNQUFNLEdBQUc7QUFFbEMsMEJBQXNCLEtBQVU7QUFDNUIsWUFBTSxXQUFXLEtBQUssV0FBVztBQUNqQyxVQUFJLFlBQVksUUFBUSxTQUFTLFdBQVcsaUJBQWlCLEdBQUc7QUFDNUQsZUFBTyxLQUFLLFVBQVUsS0FBSyxNQUFNLENBQUM7QUFBQSxNQUN0QztBQUNBLGFBQU87QUFBQSxJQUNYO0FBRUEseUJBQXFCLE1BQVc7QUFDNUIscUJBQWUsT0FBTyxhQUFhLElBQUk7QUFBQSxJQUMzQztBQUVBLG1CQUFlLE9BQU8sSUFBSTtBQUN0QixxQkFBZSxRQUFRLGFBQWEsSUFBSTtBQUFBLElBQzVDO0FBQUM7QUFFRCx1QkFBbUIsTUFBTSxJQUFJO0FBQ3pCLFlBQU0sYUFBYSxHQUFHO0FBRXRCLGlCQUFXLEtBQUssS0FBSztBQUNqQix1QkFBZSxRQUFRLE9BQU8sRUFBRSxXQUFXLENBQUMsSUFBSTtBQUFBLE1BQ3BEO0FBQUEsSUFDSjtBQUVBLGtCQUFjLFFBQWtCLFFBQWU7QUFDM0MsaUJBQVcsS0FBSyxRQUFRO0FBQ3BCLHVCQUFlLFFBQVEsSUFBSTtBQUMzQixrQkFBVSxPQUFPLEVBQUU7QUFBQSxNQUN2QjtBQUVBLHFCQUFlLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFBQSxJQUNwQztBQUVBLFFBQUksZUFBb0I7QUFFeEIsYUFBUyxXQUFXLENBQUMsUUFBYyxXQUFvQjtBQUNuRCxxQkFBZSxPQUFPLE1BQUk7QUFDMUIsVUFBSSxVQUFVLE1BQU07QUFDaEIsaUJBQVMsT0FBTyxNQUFNO0FBQUEsTUFDMUI7QUFFQSxhQUFPO0FBQUEsSUFDWDtBQUVBLElBQU0sU0FBVSxTQUFTLE1BQU07QUFDM0IsZUFBUyxTQUFTLFFBQVEsR0FBRztBQUFBLElBQ2pDO0FBRUEsc0JBQWtCLFVBQVUsY0FBYyxPQUFPO0FBQzdDLHFCQUFlLEVBQUUsTUFBTSxVQUFVLFlBQVk7QUFBQSxJQUNqRDtBQUVBLFVBQU0sV0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQSxVQUFVO0FBQUEsSUFDZDtBQUVBLFVBQU0sYUFBYSxRQUFRO0FBRTNCLFdBQU8sRUFBRSxnQkFBZ0IsZUFBZSxNQUFNLGFBQWE7QUFBQSxFQUMvRDtBQUNKOzs7QUV4UUE7QUFJQTtBQVNBLElBQU0sZUFBMkMsQ0FBQztBQVFsRCx1QkFBdUIsS0FBYSxXQUFtQjtBQUNuRCxRQUFNLE9BQU8sT0FBTyxLQUFLLFlBQVk7QUFDckMsYUFBVyxLQUFLLE1BQU07QUFDbEIsVUFBTSxJQUFJLGFBQWE7QUFDdkIsUUFBSSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYTtBQUNwQyxhQUFPO0FBQUEsUUFDSCxZQUFZO0FBQUEsUUFDWixVQUFVO0FBQUEsTUFDZDtBQUFBLEVBQ1I7QUFFQSxTQUFPLENBQUM7QUFDWjtBQU9BLDJCQUEyQixLQUFhO0FBRXBDLFNBQU8sSUFBSSxRQUFRO0FBQ2YsVUFBTSxZQUFZLE9BQUssS0FBSyxTQUFTLE9BQU8sSUFBSSxNQUFNLE1BQU07QUFDNUQsVUFBTSxjQUFjLE9BQU8sU0FBa0IsTUFBTSxlQUFPLFdBQVcsWUFBWSxNQUFNLElBQUksS0FBSztBQUVoRyxVQUFNLFdBQVksT0FBTSxRQUFRLElBQUk7QUFBQSxNQUNoQyxZQUFZLElBQUk7QUFBQSxNQUNoQixZQUFZLElBQUk7QUFBQSxJQUNwQixDQUFDLEdBQUcsT0FBTyxPQUFLLENBQUMsRUFBRSxNQUFNO0FBRXpCLFFBQUk7QUFDQSxhQUFPLE1BQU0sVUFBVTtBQUUzQixVQUFNLFdBQVcsS0FBSyxHQUFHO0FBQUEsRUFDN0I7QUFFQSxTQUFPO0FBQ1g7QUFFQSwrQkFBK0IsU0FBYyxVQUFlLEtBQWEsU0FBa0IsV0FBaUQ7QUFDeEksUUFBTSxZQUFZLElBQUksTUFBTSxHQUFHLEVBQUU7QUFDakMsTUFBSSxFQUFFLFlBQVksYUFBYSxjQUFjLEtBQUssU0FBUztBQUUzRCxNQUFJLENBQUMsVUFBVTtBQUNYLGlCQUFhLE1BQU0sWUFBWSxHQUFHO0FBRWxDLFFBQUksWUFBWTtBQUNaLGlCQUFXO0FBQUEsUUFDUDtBQUFBLFFBQ0EsU0FBUyxDQUFDO0FBQUEsTUFDZDtBQUVBLG1CQUFhLGNBQWM7QUFBQSxJQUMvQjtBQUFBLEVBQ0o7QUFFQSxNQUFJLFVBQVU7QUFDVixXQUFPLE1BQU0sU0FDVCxNQUFNLFlBQVksTUFBTSxZQUFZLFlBQVksSUFBSSxTQUFTLFFBQVEsU0FBUyxTQUFTLE9BQU8sR0FDOUYsU0FDQSxVQUNBLElBQUksVUFBVSxXQUFXLFNBQVMsQ0FBQyxHQUNuQyxTQUNBLFNBQ0o7QUFBQSxFQUNKO0FBQ0o7QUFFQSxJQUFNLFdBQVcsQ0FBQyxlQUFlLGdCQUFnQixRQUFRLFVBQVUsR0FBRyxLQUFLLE9BQU87QUFJbEYsMkJBQTJCLEtBQVUsU0FBaUI7QUFDbEQsTUFBSSxZQUFZLEdBQUcsTUFBTTtBQUV6QixhQUFXLEtBQUssS0FBSztBQUNqQixVQUFNLFNBQVMsRUFBRTtBQUNqQixRQUFJLFlBQVksVUFBVSxRQUFRLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxTQUFTLENBQUMsR0FBRztBQUN0RSxrQkFBWTtBQUNaLFlBQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUVBLFNBQU87QUFDWDtBQUtBLDRCQUE0QixVQUFlLE9BQVksU0FBYyxVQUFlLGFBQWlDO0FBQ2pILE1BQUksV0FBVyxPQUFPLFVBQVUsTUFBTTtBQUV0QyxVQUFRO0FBQUEsU0FDQztBQUFBLFNBQ0E7QUFBQSxTQUNBO0FBQ0QsaUJBQWlCLFNBQVUsS0FBSztBQUNoQyxnQkFBVSxDQUFDLE1BQU0sUUFBUTtBQUN6QjtBQUFBLFNBQ0M7QUFDRCxpQkFBVyxTQUFTO0FBQ3BCLGNBQVEsTUFBTSxZQUFZO0FBQzFCLGdCQUFVLFNBQVMsVUFBVSxTQUFTO0FBQ3RDO0FBQUEsU0FDQztBQUNEO0FBQUE7QUFFQSxVQUFJLE1BQU0sUUFBUSxRQUFRO0FBQ3RCLGtCQUFVLFNBQVMsU0FBUyxLQUFLO0FBRXJDLFVBQUksT0FBTyxZQUFZLFlBQVk7QUFDL0IsWUFBSTtBQUNBLGdCQUFNLFlBQVksTUFBTSxTQUFTLE9BQU8sU0FBUyxRQUFRO0FBQ3pELGNBQUksYUFBYSxPQUFPLGFBQWEsVUFBVTtBQUMzQyxzQkFBVSxVQUFVO0FBQ3BCLHVCQUFXLFVBQVUsU0FBUztBQUFBLFVBQ2xDO0FBQ0ksc0JBQVU7QUFBQSxRQUVsQixTQUFTLEdBQVA7QUFDRSxrQkFBUSwwQ0FBMEMsWUFBWSxDQUFDO0FBQUEsUUFDbkU7QUFBQSxNQUNKO0FBR0EsVUFBSSxvQkFBb0I7QUFDcEIsa0JBQVUsU0FBUyxLQUFLLEtBQUs7QUFBQTtBQUd6QyxNQUFJLENBQUM7QUFDRCxZQUFRLGtDQUFrQyxRQUFRO0FBRXRELFNBQU8sQ0FBQyxPQUFPLFFBQVE7QUFDM0I7QUFZQSw4QkFBOEIsS0FBVSxTQUFpQixjQUFtQixTQUFjLFVBQWUsYUFBaUM7QUFDdEksTUFBSSxDQUFDLElBQUk7QUFDTCxXQUFPO0FBRVgsUUFBTSxlQUFlLElBQUksT0FBTztBQUNoQyxNQUFJLE9BQU8sZUFBZTtBQUMxQixTQUFPLElBQUksT0FBTztBQUVsQixhQUFXLFFBQVEsSUFBSSxRQUFRO0FBQzNCLFVBQU0sQ0FBQyxXQUFXLGVBQWUsV0FBVyxLQUFLLE9BQU87QUFDeEQsY0FBVTtBQUVWLFVBQU0sQ0FBQyxPQUFPLFdBQVcsTUFBTSxhQUFhLElBQUksT0FBTyxPQUFPLFdBQVcsU0FBUyxVQUFVLFdBQVc7QUFFdkcsUUFBRztBQUNDLGFBQU8sRUFBQyxNQUFLO0FBRWpCLGlCQUFhLFFBQVE7QUFBQSxFQUN6QjtBQUVBLE1BQUksY0FBYztBQUNkLFFBQUk7QUFDSixRQUFJO0FBQ0EsaUJBQVcsTUFBTSxhQUFhLGNBQWMsU0FBUyxRQUFRO0FBQUEsSUFDakUsU0FBUyxHQUFQO0FBQ0UsaUJBQVcsZ0NBQWdDLFlBQVksQ0FBQztBQUFBLElBQzVEO0FBRUEsV0FBTyxFQUFDLE9BQU8sT0FBTyxZQUFZLFdBQVcsV0FBVSx1QkFBc0I7QUFBQSxFQUNqRjtBQUVBLFNBQU8sV0FBVztBQUN0QjtBQVlBLHdCQUF3QixZQUFpQixTQUFjLFVBQWUsU0FBaUIsU0FBa0IsV0FBK0I7QUFDcEksUUFBTSxpQkFBaUIsQ0FBQyxVQUFVLFdBQVcsS0FBSyxTQUFTLGNBQWMsQ0FBQyxNQUFZLFdBQVUsTUFBTSxNQUFNLENBQUMsSUFBSSxRQUFTLGtCQUFpQixjQUFjLEVBQUUsWUFBWTtBQUN2SyxRQUFNLFNBQVMsUUFBUTtBQUN2QixNQUFJLFlBQVksV0FBVyxXQUFXLFdBQVcsUUFBUTtBQUN6RCxNQUFJLGFBQWE7QUFFakIsTUFBRyxDQUFDLFdBQVU7QUFDVixpQkFBYTtBQUNiLGdCQUFZLFdBQVcsV0FBVztBQUFBLEVBQ3RDO0FBRUEsUUFBTSxhQUFhO0FBRW5CLFFBQU0sZUFBZSxDQUFDO0FBRXRCLFFBQU0sYUFBYSxNQUFNLGVBQWUsV0FBVyxTQUFTLGNBQWMsU0FBUyxVQUFVLFdBQVc7QUFDeEcsTUFBUyxXQUFZO0FBQU8sV0FBTyxTQUFTLEtBQUssVUFBVTtBQUMzRCxZQUFrQjtBQUVsQixNQUFJLFlBQVksa0JBQWtCLFdBQVcsT0FBTztBQUdwRCxXQUFRLElBQUksR0FBRyxJQUFHLEdBQUcsS0FBSTtBQUNyQixXQUFRLFlBQVksa0JBQWtCLFdBQVcsT0FBTyxHQUFJO0FBQ3hELFlBQU0sY0FBYSxNQUFNLGVBQWUsV0FBVyxTQUFTLGNBQWMsU0FBUyxVQUFVLFdBQVc7QUFDeEcsVUFBUyxZQUFZO0FBQU8sZUFBTyxTQUFTLEtBQUssV0FBVTtBQUMzRCxnQkFBa0I7QUFFbEIsZ0JBQVUsU0FBUyxLQUFLLFFBQVEsVUFBVSxVQUFVLE1BQU0sQ0FBQztBQUMzRCxrQkFBWSxVQUFVO0FBQUEsSUFDMUI7QUFFQSxRQUFHLENBQUMsWUFBVztBQUNYLG1CQUFhO0FBQ2Isa0JBQVksVUFBVTtBQUFBLElBQzFCO0FBQUEsRUFDSjtBQUVBLGNBQVksV0FBVyxRQUFRLGFBQWE7QUFHNUMsTUFBSSxDQUFDLFdBQVc7QUFDWixXQUFPO0FBRVgsUUFBTSxXQUFXLFFBQVEsTUFBTSxHQUFHO0FBQ2xDLFFBQU0sVUFBVSxDQUFDO0FBR2pCLE1BQUk7QUFDSixNQUFJLFVBQVUsYUFBYTtBQUN2QixlQUFXLENBQUMsT0FBTyxhQUFhLE9BQU8sUUFBUSxVQUFVLFdBQVcsR0FBRztBQUNuRSxZQUFNLENBQUMsVUFBVSxZQUFZLE1BQU0sYUFBYSxVQUFVLFNBQVMsUUFBUSxTQUFTLFVBQVUsV0FBVztBQUV6RyxVQUFJLFVBQVU7QUFDVixnQkFBZ0I7QUFDaEI7QUFBQSxNQUNKO0FBRUEsY0FBUSxLQUFLLFFBQVE7QUFBQSxJQUN6QjtBQUFBLEVBQ0o7QUFDSSxZQUFRLEtBQUssR0FBRyxRQUFRO0FBRTVCLE1BQUksQ0FBQyxTQUFTLFVBQVUsY0FBYztBQUNsQyxRQUFJO0FBQ0osUUFBSTtBQUNBLGlCQUFXLE1BQU0sVUFBVSxhQUFhLFVBQVUsU0FBUyxVQUFVLE9BQU87QUFBQSxJQUNoRixTQUFTLEdBQVA7QUFDRSxpQkFBVyxnQ0FBZ0MsWUFBWSxDQUFDO0FBQUEsSUFDNUQ7QUFFQSxRQUFJLE9BQU8sWUFBWTtBQUNuQixjQUFRO0FBQUEsYUFDSCxDQUFDO0FBQ04sY0FBUTtBQUFBLEVBQ2hCO0FBRUEsTUFBSTtBQUNBLFdBQU8sU0FBUyxLQUFLLEVBQUUsTUFBTSxDQUFDO0FBRWxDLFFBQU0sWUFBWSxNQUFNLFVBQVU7QUFFbEMsTUFBSSxhQUFrQjtBQUN0QixNQUFJO0FBQ0Esa0JBQWMsTUFBTSxVQUFVLEtBQUssU0FBUyxVQUFVLFNBQVMsY0FBYyxRQUFRO0FBQUEsRUFDekYsU0FBUyxHQUFQO0FBQ0UsUUFBSTtBQUNBLG9CQUFjLEVBQUUsT0FBTyxFQUFFLFFBQVE7QUFBQTtBQUVqQyxvQkFBYyxFQUFFLE9BQU8sOEJBQThCO0FBQUEsRUFDN0Q7QUFFQSxNQUFJLE9BQU8sZUFBZTtBQUNsQixrQkFBYyxFQUFFLE1BQU0sWUFBWTtBQUFBO0FBRWxDLGtCQUFjLGVBQWU7QUFFckMsWUFBVTtBQUVWLE1BQUksZUFBZTtBQUNmLGFBQVMsS0FBSyxXQUFXO0FBRTdCLFNBQU87QUFDWDs7O0FDblRBLElBQU0sRUFBRSxvQkFBVztBQXVCbkIsSUFBTSxZQUE2QjtBQUFBLEVBQy9CLFdBQVc7QUFBQSxFQUNYLFNBQVM7QUFBQSxFQUNULFlBQVksQ0FBQztBQUNqQjtBQUVBLDZCQUE2QixLQUFhLFNBQWtCO0FBQ3hELE1BQUksTUFBTSxlQUFPLFdBQVcsQUFBVyxtQkFBbUIsR0FBRyxDQUFDLEdBQUc7QUFDN0QsWUFBTyxZQUFZLE9BQU8sQ0FBQztBQUMzQixZQUFPLFlBQVksS0FBSyxLQUFLLE1BQU0sQUFBVyxTQUFTLEtBQUssT0FBTztBQUNuRSxZQUFPLFlBQVksS0FBSyxLQUFLLEFBQVcsVUFBVSxRQUFPLFlBQVksS0FBSyxJQUFJLEdBQUc7QUFBQSxFQUNyRjtBQUNKO0FBRUEsaUNBQWlDLFNBQWtCO0FBQy9DLGFBQVcsS0FBSyxTQUFTLE9BQU87QUFDNUIsUUFBSSxDQUFDLGlCQUFpQixHQUFRLGNBQWMsaUJBQWlCO0FBQ3pELFlBQU0sY0FBYyxHQUFHLE9BQU87QUFBQSxFQUV0QztBQUNKO0FBRUEsZ0NBQWdDO0FBQzVCLGFBQVcsS0FBSyxRQUFPLGFBQWE7QUFDaEMsWUFBTyxZQUFZLEtBQUs7QUFDeEIsV0FBTyxRQUFPLFlBQVk7QUFBQSxFQUM5QjtBQUNKO0FBRUEsMEJBQTBCLGFBQXFCLFFBQWtCO0FBQzdELGFBQVcsU0FBUyxZQUFZO0FBQ2hDLGFBQVcsU0FBUyxRQUFRO0FBQ3hCLGVBQVcsS0FBSyxPQUFPO0FBQ25CLFVBQUksU0FBUyxVQUFVLFNBQVMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxLQUFLLE1BQU07QUFDNUQsZUFBTztBQUFBLElBRWY7QUFBQSxFQUNKO0FBQ0EsU0FBTztBQUNYO0FBRUEsc0JBQXNCLE1BQWMsYUFBeUM7QUFDekUsTUFBSSxXQUFxQjtBQUN6QixNQUFJLFVBQVMsV0FBVyxjQUFjO0FBQ2xDLGdCQUFZLFNBQVM7QUFDckIsVUFBTSxVQUFTLFdBQVcsYUFBYTtBQUN2QyxXQUFPLFVBQVMsV0FBVyxhQUFhLFFBQVE7QUFBQSxFQUNwRCxPQUFPO0FBQ0gsZ0JBQVksU0FBUztBQUNyQixVQUFNLE1BQU07QUFBQSxFQUNoQjtBQUNBLFNBQU8sRUFBRSxLQUFLLFdBQVcsS0FBSztBQUNsQztBQUVBLDhCQUE4QixTQUF3QixVQUFvQixNQUFjO0FBRXBGLE1BQUksUUFBUSxVQUFVLFFBQVE7QUFDMUIsUUFBSSxDQUFDLFFBQVEsUUFBUSxDQUFDLE9BQU8sS0FBSyxRQUFRLElBQUksRUFBRTtBQUM1QyxjQUFRLE9BQU8sUUFBUSxVQUFVLENBQUM7QUFBQSxFQUUxQztBQUNJLFlBQVEsT0FBTztBQUduQixNQUFJLFFBQVE7QUFDUjtBQUdKLFFBQU0sSUFBSSxRQUFRLFVBQVEsVUFBUyxRQUFRLFNBQVMsVUFBVSxJQUFJLENBQUM7QUFDbkUsUUFBTSxJQUFJLFFBQVEsVUFBUSxVQUFTLGdCQUFnQixTQUFTLFVBQVUsSUFBSSxDQUFDO0FBQzNFLFFBQU0sSUFBSSxRQUFRLFVBQVEsVUFBUyxhQUFhLFNBQVMsVUFBVSxJQUFJLENBQUM7QUFFeEUsVUFBUSxnQkFBZ0IsUUFBUSxpQkFBaUIsQ0FBQztBQUNsRCxVQUFRLFFBQVEsUUFBUSxTQUFTLENBQUM7QUFFbEMsUUFBTSxjQUFjLEtBQUssTUFBTSxLQUFLLFVBQVUsUUFBUSxhQUFhLENBQUM7QUFFcEUsV0FBUyxhQUFhO0FBR3RCLFNBQU8sTUFBTTtBQUNULFFBQUksU0FBUyxlQUFlO0FBQ3hCLGVBQVMsYUFBYTtBQUcxQixlQUFXLEtBQUssUUFBUSxlQUFlO0FBQ25DLFVBQUksT0FBTyxRQUFRLGNBQWMsTUFBTSxZQUFZLFFBQVEsY0FBYyxNQUFNLFlBQVksTUFBTSxLQUFLLFVBQVUsUUFBUSxjQUFjLEVBQUUsS0FBSyxLQUFLLFVBQVUsWUFBWSxFQUFFO0FBQ3RLLGlCQUFTLE9BQU8sR0FBRyxRQUFRLGNBQWMsSUFBSSxVQUFTLGNBQWM7QUFBQSxJQUU1RTtBQUVBLGVBQVcsS0FBSyxhQUFhO0FBQ3pCLFVBQUksUUFBUSxjQUFjLE9BQU87QUFDN0IsaUJBQVMsWUFBWSxDQUFDO0FBQUEsSUFFOUI7QUFBQSxFQUNKO0FBQ0o7QUFHQSxxQ0FBcUMsU0FBd0I7QUFDekQsTUFBSSxDQUFDLFFBQVE7QUFDVCxXQUFPLENBQUM7QUFFWixRQUFNLFVBQVUsQ0FBQztBQUVqQixhQUFXLEtBQUssUUFBUSxPQUFPO0FBRTNCLFVBQU0sSUFBSSxRQUFRLE1BQU07QUFDeEIsUUFBSSxNQUFNLFFBQVEsQ0FBQyxHQUFHO0FBQ2xCLGlCQUFXLEtBQUssR0FBRztBQUNmLGdCQUFRLEtBQUssRUFBRSxHQUFHLFFBQVE7QUFBQSxNQUM5QjtBQUFBLElBQ0o7QUFDSSxjQUFRLEtBQUssRUFBRSxRQUFRO0FBQUEsRUFFL0I7QUFFQSxTQUFPO0FBQ1g7QUFHQSxrQ0FBa0MsT0FBaUI7QUFDL0MsYUFBVyxLQUFLO0FBQ1osVUFBTSxlQUFPLGVBQWUsQ0FBQztBQUNyQztBQUVBLDhCQUE4QixTQUF3QixLQUFhLE1BQWM7QUFDN0UsTUFBSSxRQUFRLEtBQUs7QUFDYixVQUFNLGNBQWMsU0FBUyxPQUFPLEtBQUs7QUFFekMsUUFBSSxNQUFNLFlBQVksU0FBUyxVQUFTLFNBQVMsR0FBRyxLQUFLLE1BQU0sZUFBTyxXQUFXLFdBQVc7QUFDeEYsYUFBTztBQUFBLEVBQ2Y7QUFDSjtBQUVBLDZCQUE2QixXQUFtQixXQUFpQjtBQUM3RCxRQUFNLFlBQVksQ0FBQyxhQUFhLE1BQU0sQUFBVyxTQUFTLFdBQVcsVUFBUyxPQUFPLENBQUM7QUFFdEYsWUFBVSxLQUFLLEFBQVcsVUFBVSxVQUFVLElBQUksU0FBUztBQUUzRCxNQUFJLFFBQU87QUFDUCxZQUFPLFlBQVksYUFBYTtBQUVwQyxTQUFPLFVBQVU7QUFDckI7QUFhQSw4QkFBOEIsV0FBcUIsS0FBYSxNQUFjO0FBQzFFLFFBQU0sV0FBVyxNQUFNLE1BQU0sY0FBYyxVQUFVO0FBQ3JELFFBQU0sWUFBWSxVQUFVLEtBQUssTUFBTTtBQUN2QyxNQUFJLGNBQWMsY0FBYyxrQkFBa0I7QUFFbEQsTUFBSTtBQUNKLE1BQUksVUFBUyxXQUFXLE1BQU0sZUFBTyxXQUFXLFdBQVcsR0FBRztBQUUxRCxRQUFJLENBQUMsTUFBTSxlQUFPLFdBQVcsVUFBVSxLQUFLLFdBQVcsTUFBTSxLQUFLLE1BQU0sc0JBQXNCLFNBQVMsR0FBRztBQUN0RyxZQUFNLFlBQVksTUFBTSxNQUFNLGNBQWMsVUFBVSxNQUFNLFNBQVM7QUFDckUsb0JBQWMsTUFBTSxjQUFjLFNBQVM7QUFBQSxJQUUvQyxXQUFXLFFBQU8sWUFBWSxhQUFhO0FBQ3ZDLG9CQUFjLFFBQU8sWUFBWSxXQUFXO0FBQUE7QUFHNUMsb0JBQWMsTUFBTSxjQUFjLFdBQVcsUUFBTyxZQUFZLGFBQWEsRUFBRTtBQUFBLEVBRXZGLFdBQVcsUUFBTyxZQUFZLGFBQWE7QUFDdkMsa0JBQWMsUUFBTyxZQUFZLFdBQVc7QUFBQSxXQUV2QyxDQUFDLFFBQU8sV0FBVyxNQUFNLGVBQU8sV0FBVyxXQUFXO0FBQzNELGtCQUFjLE1BQU0sY0FBYyxXQUFXLFFBQU8sWUFBWSxhQUFhLEVBQUU7QUFBQSxXQUUxRSxhQUFhLFNBQVMsTUFBTTtBQUNqQyxVQUFNLEVBQUUsdUJBQVcsYUFBTSxjQUFRLGFBQWEsS0FBSyxVQUFVO0FBQzdELFdBQU8sZUFBZSxZQUFXLE1BQUssS0FBSTtBQUFBLEVBQzlDLE9BQU87QUFDSCxrQkFBYztBQUFBLEVBQ2xCO0FBRUEsU0FBTztBQUFBLElBQ0g7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFDSjtBQUVBLGdDQUFnQyxpQkFBc0IsVUFBMEI7QUFDNUUsTUFBSSxnQkFBZ0IsY0FBYyxNQUFNO0FBQ3BDLGFBQVMsU0FBUyxnQkFBZ0IsYUFBYSxJQUFJO0FBQ25ELFVBQU0sSUFBSSxRQUFRLFNBQU8sU0FBUyxHQUFHLFVBQVUsR0FBRyxDQUFDO0FBQUEsRUFDdkQsV0FBVyxnQkFBZ0IsY0FBYztBQUNyQyxhQUFTLFVBQVUsS0FBSyxFQUFFLFVBQVUsZ0JBQWdCLGFBQWEsQ0FBQztBQUNsRSxhQUFTLElBQUk7QUFBQSxFQUNqQixPQUFPO0FBQ0gsVUFBTSxVQUFVLGdCQUFnQixlQUFlLEtBQUs7QUFDcEQsUUFBSSxTQUFTO0FBQ1QsZUFBUyxLQUFLLE9BQU87QUFBQSxJQUN6QixPQUFPO0FBQ0gsZUFBUyxJQUFJO0FBQUEsSUFDakI7QUFBQSxFQUNKO0FBRUEsTUFBSSxnQkFBZ0IsYUFBYSxhQUFhO0FBQzFDLFVBQU0sZUFBTyxlQUFlLFNBQVMsYUFBYSxJQUFJO0FBQUEsRUFDMUQ7QUFDSjtBQWlCQSw0QkFBNEIsU0FBd0IsVUFBb0IsV0FBcUIsS0FBYSxNQUFjLFdBQStCO0FBQ25KLFFBQU0sRUFBRSxhQUFhLGFBQWEsTUFBTSxZQUFZLE1BQU0sZUFBZSxXQUFXLEtBQUssSUFBSTtBQUU3RixNQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsUUFBUTtBQUN4QyxXQUFPLFNBQVMsV0FBVyxPQUFPO0FBRXRDLE1BQUk7QUFDQSxVQUFNLFlBQVksTUFBTSxVQUFVO0FBQ2xDLFVBQU0sV0FBVyxNQUFNLFlBQVksVUFBVSxTQUFTLFFBQVEsTUFBTSxRQUFRLE9BQU8sUUFBUSxTQUFTLFFBQVEsU0FBUyxRQUFRLE9BQU8sVUFBUyxPQUFPO0FBQ3BKLGNBQVU7QUFFVixVQUFNLGlCQUNGLFVBQ0EsUUFDSjtBQUFBLEVBQ0osU0FBUyxHQUFQO0FBRUUsVUFBTSxNQUFNLENBQUM7QUFDYixZQUFRLFFBQVE7QUFFaEIsVUFBTSxZQUFZLGFBQWEsS0FBSyxhQUFhO0FBRWpELGdCQUFZLFNBQVMsVUFBVSxVQUFVLEtBQUssVUFBVSxXQUFXLFVBQVUsSUFBSTtBQUNqRixXQUFPO0FBQUEsRUFDWDtBQUVBLFNBQU87QUFDWDtBQUVBLDJCQUEyQixTQUF3QixVQUEwQixLQUFhLFlBQVksU0FBUyxRQUFRLE9BQU8sS0FBSztBQUMvSCxRQUFNLFdBQVcsTUFBTSxlQUFlLFNBQVMsS0FBSyxJQUFJO0FBRXhELFFBQU0sa0JBQWtCLDRCQUE0QixPQUFPO0FBRTNELE1BQUksVUFBVTtBQUNWLGNBQVMsYUFBYSxTQUFTLFVBQVUsaUJBQWlCLGFBQWMsVUFBUyxZQUFZLEtBQUssS0FBSyxFQUFHO0FBQzFHLFVBQU0sUUFBYyxLQUFLLFVBQVMsU0FBUyxTQUFTLFFBQVE7QUFDNUQsdUJBQW1CLGVBQWU7QUFDbEM7QUFBQSxFQUNKO0FBRUEsUUFBTSxZQUFZLE1BQU0sZUFBZSxTQUFTLFVBQVUsSUFBSTtBQUU5RCxRQUFNLFFBQVEsTUFBTSxnQkFBWSxTQUFTLFVBQVUsS0FBSyxVQUFTLFNBQVMsU0FBUztBQUNuRixNQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sYUFBYSxTQUFTLFVBQVUsV0FBVyxLQUFLLE1BQU0sU0FBUztBQUNoRjtBQUVKLHFCQUFtQixlQUFlO0FBQ3RDO0FBRUEsZ0JBQWdCLEtBQWE7QUFDekIsTUFBSSxPQUFPLEtBQUs7QUFDWixVQUFNO0FBQUEsRUFDVjtBQUVBLFNBQU8sbUJBQW1CLEdBQUc7QUFDakM7OztBQy9UQTtBQUdBO0FBQ0E7QUFFQTtBQUVBO0FBSUE7QUFNQSxJQUNJLGdCQUFnQixPQUFPLEVBQUUsVUFBVSxHQUFHLEVBQUU7QUFENUMsSUFFSSxnQkFBZ0IsT0FBTztBQUYzQixJQUdJLGNBQWMsY0FBYyxPQUFPO0FBSHZDLElBS0ksb0JBQW9CLGFBQWEsYUFBYTtBQUxsRCxJQU1JLDRCQUE0QixnQkFBZ0IsZUFBZSxDQUFDLENBQUM7QUFOakUsSUFPSSxpQkFBaUIsRUFBRSxVQUFVLE1BQU0sUUFBUSxNQUFNLFFBQVEsUUFBVyxHQUFHO0FBRTNFLEFBQVUsVUFBUyxVQUFlO0FBQ2xDLEFBQVUsVUFBUyxrQkFBdUI7QUFDMUMsQUFBVSxVQUFTLGlCQUFpQjtBQUVwQyxJQUFJLFdBQVc7QUFBZixJQUFxQjtBQUFyQixJQUFvRTtBQUVwRSxJQUFJO0FBQUosSUFBc0I7QUFFdEIsSUFBTSxjQUFjO0FBQUEsRUFDaEIsbUJBQW1CO0FBQUEsRUFDbkIsb0JBQW9CO0FBQUEsRUFDcEIsMkJBQTJCO0FBQUEsRUFDM0IsYUFBYTtBQUFBLEVBQ2IsZ0JBQWdCO0FBQ3BCO0FBRUEsSUFBSTtBQUNHLGlDQUFnQztBQUNuQyxTQUFPO0FBQ1g7QUFFQSxJQUFNLHlCQUF5QixDQUFDLEdBQUcsY0FBYyxtQkFBbUIsR0FBRyxjQUFjLGdCQUFnQixHQUFHLGNBQWMsaUJBQWlCO0FBQ3ZJLElBQU0sZ0JBQWdCLENBQUMsQ0FBQyxXQUFpQixPQUFLLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLE1BQU07QUFFbEUsSUFBTSxTQUF5QjtBQUFBLE1BQzlCLGVBQWU7QUFDZixXQUFPLG1CQUFtQixjQUFjLGdCQUFnQjtBQUFBLEVBQzVEO0FBQUEsTUFDSSxZQUFZLE9BQU87QUFDbkIsUUFBRyxZQUFZO0FBQU87QUFDdEIsZUFBVztBQUNYLFFBQUksQ0FBQyxPQUFPO0FBQ1Isd0JBQWtCLEFBQVksV0FBVyxNQUFNO0FBQy9DLGNBQVEsSUFBSSxXQUFXO0FBQUEsSUFDM0I7QUFDQSxJQUFVLFVBQVMsVUFBVTtBQUM3QixlQUFXLEtBQUs7QUFBQSxFQUNwQjtBQUFBLE1BQ0ksY0FBYztBQUNkLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFDQSxZQUFZO0FBQUEsUUFDSixVQUE0RTtBQUM1RSxhQUFZO0FBQUEsSUFDaEI7QUFBQSxRQUNJLGtCQUFrQjtBQUNsQixhQUFPO0FBQUEsSUFDWDtBQUFBLFFBQ0ksVUFBVTtBQUNWLGFBQU87QUFBQSxJQUNYO0FBQUEsUUFDSSxhQUFhO0FBQ2IsYUFBTztBQUFBLElBQ1g7QUFBQSxRQUNJLGFBQWE7QUFDYixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxRQUNBLFVBQVU7QUFDVixhQUFPO0FBQUEsSUFDWDtBQUFBLFFBQ0ksVUFBVTtBQUNWLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsY0FBYyxDQUFDO0FBQUEsUUFDWCxVQUFVLE9BQU87QUFDakIsY0FBVSxVQUFVO0FBQ3BCLDBCQUFvQixZQUFZO0FBQzVCLGNBQU0sZUFBZSxNQUFNO0FBQzNCLGNBQU0sZUFBZTtBQUNyQixZQUFJLE9BQU87QUFDUCxnQkFBTSxBQUFVLGtCQUFrQixPQUFPLFdBQVc7QUFBQSxRQUN4RCxPQUFPO0FBQ0gsVUFBVSxxQkFBcUI7QUFBQSxRQUNuQztBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsUUFDSSxZQUFZO0FBQ1osYUFBTyxRQUFVO0FBQUEsSUFDckI7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsUUFDRCxjQUFjLE9BQU87QUFDckIsZ0JBQXFCLG1CQUFtQjtBQUFBLElBQzVDO0FBQUEsUUFDSSxnQkFBZ0I7QUFDaEIsYUFBTyxVQUFxQjtBQUFBLElBQ2hDO0FBQUEsUUFDSSxZQUFZLE9BQU87QUFDbkIsTUFBTSxTQUF3QixnQkFBZ0I7QUFBQSxJQUNsRDtBQUFBLFFBQ0ksY0FBYztBQUNkLGFBQWEsU0FBd0I7QUFBQSxJQUN6QztBQUFBLFFBQ0ksUUFBUSxPQUFPO0FBQ2YsZ0JBQXFCLFFBQVEsU0FBUztBQUN0QyxnQkFBcUIsUUFBUSxLQUFLLEdBQUcsS0FBSztBQUFBLElBQzlDO0FBQUEsUUFDSSxVQUFVO0FBQ1YsYUFBTyxVQUFxQjtBQUFBLElBQ2hDO0FBQUEsUUFDSSxTQUFRO0FBQ1IsYUFBTyxTQUFlO0FBQUEsSUFDMUI7QUFBQSxRQUNJLE9BQU8sT0FBTztBQUNkLGVBQWUsU0FBUztBQUFBLElBQzVCO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTyxDQUFDO0FBQUEsSUFDUixTQUFTLENBQUM7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLGFBQWE7QUFBQSxJQUNiLGFBQWEsQ0FBQztBQUFBLElBQ2QsU0FBUztBQUFBLFFBQ0wsYUFBYTtBQUNiLGFBQU8sQUFBVSxVQUFTO0FBQUEsSUFDOUI7QUFBQSxRQUNJLFdBQVcsT0FBTztBQUNsQixNQUFVLFVBQVMsYUFBYTtBQUFBLElBQ3BDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsYUFBYTtBQUFBLFFBQ0wsWUFBVztBQUNYLGFBQU8sQUFBVSxVQUFTO0FBQUEsSUFDOUI7QUFBQSxRQUNJLFVBQVUsT0FBTTtBQUNoQixNQUFVLFVBQVMsWUFBWTtBQUFBLElBQ25DO0FBQUEsUUFDSSxxQkFBb0I7QUFDcEIsYUFBTyxlQUFlLFNBQVM7QUFBQSxJQUNuQztBQUFBLFFBQ0ksbUJBQW1CLE9BQU07QUFDekIscUJBQWUsU0FBUyxRQUFRO0FBQUEsSUFDcEM7QUFBQSxRQUNJLGtCQUFrQixPQUFlO0FBQ2pDLFVBQUcsWUFBWSxxQkFBcUI7QUFBTztBQUMzQyxrQkFBWSxvQkFBb0I7QUFDaEMsbUJBQWE7QUFBQSxJQUNqQjtBQUFBLFFBQ0ksb0JBQW1CO0FBQ25CLGFBQU8sWUFBWTtBQUFBLElBQ3ZCO0FBQUEsUUFDSSxtQkFBbUIsT0FBZTtBQUNsQyxVQUFHLFlBQVksc0JBQXNCO0FBQU87QUFDNUMsa0JBQVkscUJBQXFCO0FBQ2pDLG1CQUFhO0FBQUEsSUFFakI7QUFBQSxRQUNJLHFCQUFxQjtBQUNyQixhQUFPLFlBQVk7QUFBQSxJQUN2QjtBQUFBLFFBQ0ksMEJBQTBCLE9BQWU7QUFDekMsVUFBRyxZQUFZLDZCQUE2QjtBQUFPO0FBQ25ELGtCQUFZLDRCQUE0QjtBQUN4QyxtQkFBYTtBQUFBLElBRWpCO0FBQUEsUUFDSSw0QkFBNEI7QUFDNUIsYUFBTyxZQUFZO0FBQUEsSUFDdkI7QUFBQSxRQUNJLFlBQVksT0FBZTtBQUMzQixVQUFHLFlBQVksZUFBZTtBQUFPO0FBQ3JDLGtCQUFZLGNBQWM7QUFDMUIsc0JBQWdCO0FBQUEsSUFFcEI7QUFBQSxRQUNJLGNBQWM7QUFDZCxhQUFPLFlBQVk7QUFBQSxJQUN2QjtBQUFBLFFBQ0ksZUFBZSxPQUFlO0FBQzlCLFVBQUcsWUFBWSxrQkFBa0I7QUFBTztBQUN4QyxrQkFBWSxpQkFBaUI7QUFDN0Isc0JBQWdCO0FBQ2hCLHNCQUFnQjtBQUFBLElBRXBCO0FBQUEsUUFDSSxpQkFBaUI7QUFDakIsYUFBTyxZQUFZO0FBQUEsSUFDdkI7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsTUFDUCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxPQUFPO0FBQUEsTUFDUCxPQUFPO0FBQUEsTUFDUCxjQUFjO0FBQUEsTUFDZCxPQUFPLENBQUM7QUFBQSxJQUNaO0FBQUEsRUFDSjtBQUNKO0FBRU8sMkJBQTJCO0FBQzlCLHFCQUFtQjtBQUFBLElBQ2YsYUFBYSxPQUFPLFlBQVksY0FBYztBQUFBLElBQzlDLFdBQVcsYUFBYTtBQUFBLElBQ3hCLFdBQVc7QUFBQSxJQUNYLGVBQWUsT0FBTyxZQUFZLGlCQUFpQjtBQUFBLEVBQ3ZEO0FBQ0o7QUFFTywyQkFBMkI7QUFDOUIscUJBQXlCLFdBQVksS0FBSyxFQUFFLE9BQU8sT0FBTyxZQUFZLGlCQUFpQixLQUFLLENBQUM7QUFDakc7QUFHTyx3QkFBd0I7QUFDM0IsTUFBSSxDQUFDLE9BQU8sWUFBWSxzQkFBc0IsQ0FBQyxPQUFPLFlBQVksbUJBQW1CO0FBQ2pGLG1CQUFlLENBQUMsS0FBSyxLQUFLLFNBQVMsS0FBSztBQUN4QztBQUFBLEVBQ0o7QUFFQSxpQkFBZSxRQUFRO0FBQUEsSUFDbkIsUUFBUSxFQUFFLFFBQVEsT0FBTyxZQUFZLHFCQUFxQixLQUFLLEtBQU0sVUFBVSxLQUFLO0FBQUEsSUFDcEYsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsbUJBQW1CO0FBQUEsSUFDbkIsT0FBTyxJQUFJLFlBQVk7QUFBQSxNQUNuQixhQUFhLE9BQU8sWUFBWSw0QkFBNEIsS0FBSztBQUFBLE1BQ2pFLEtBQUssT0FBTyxZQUFZLG9CQUFvQjtBQUFBLElBQ2hELENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQUVBLGtCQUFrQixJQUFTLE1BQVcsUUFBa0IsQ0FBQyxHQUFHLFlBQStCLFVBQVU7QUFDakcsTUFBRyxDQUFDO0FBQU0sV0FBTztBQUNqQixNQUFJLGVBQWU7QUFDbkIsYUFBVyxLQUFLLE1BQU07QUFDbEIsVUFBTSxVQUFVLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLFFBQUksYUFBYSxVQUFVLFdBQVcsYUFBYSxZQUFZLENBQUMsU0FBUztBQUNyRSxxQkFBZTtBQUNmLFNBQUcsS0FBSyxLQUFLO0FBQUEsSUFDakI7QUFBQSxFQUNKO0FBQ0EsU0FBTztBQUNYO0FBR0EsaUNBQXdDO0FBQ3BDLFFBQU0sWUFBMkIsTUFBTSxZQUFZLE9BQU8sY0FBYyxRQUFRO0FBQ2hGLE1BQUcsYUFBWTtBQUFNO0FBRXJCLE1BQUksVUFBUztBQUNULFdBQU8sT0FBTyxXQUFVLFVBQVMsT0FBTztBQUFBO0FBR3hDLFdBQU8sT0FBTyxXQUFVLFVBQVMsUUFBUTtBQUc3QyxXQUFTLE9BQU8sU0FBUyxVQUFTLE9BQU87QUFFekMsV0FBUyxPQUFPLFNBQVMsVUFBUyxTQUFTLENBQUMsZUFBZSxXQUFXLENBQUM7QUFHdkUsUUFBTSxjQUFjLENBQUMsTUFBYyxVQUFpQixVQUFTLFVBQVUsU0FBVSxRQUFPLFFBQVEsUUFBUSxVQUFTLFFBQVEsTUFBTSxPQUFPLEtBQUs7QUFFM0ksY0FBWSxlQUFlLHNCQUFzQjtBQUNqRCxjQUFZLGFBQWEsYUFBYTtBQUV0QyxXQUFTLE9BQU8sYUFBYSxVQUFTLGFBQWEsQ0FBQyxhQUFhLG9CQUFvQixHQUFHLE1BQU07QUFFOUYsTUFBSSxTQUFTLGFBQWEsVUFBUyxhQUFhLENBQUMscUJBQXFCLHNCQUFzQiwyQkFBMkIsR0FBRyxNQUFNLEdBQUc7QUFDL0gsaUJBQWE7QUFBQSxFQUNqQjtBQUVBLE1BQUksU0FBUyxhQUFhLFVBQVMsYUFBYSxDQUFDLGVBQWUsZ0JBQWdCLEdBQUcsTUFBTSxHQUFHO0FBQ3hGLG9CQUFnQjtBQUFBLEVBQ3BCO0FBRUEsTUFBSSxTQUFTLGFBQWEsVUFBUyxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxHQUFHO0FBQ3pFLG9CQUFnQjtBQUFBLEVBQ3BCO0FBRUEsV0FBUyxPQUFPLE9BQU8sVUFBUyxLQUFLO0FBR3JDLFNBQU8sY0FBYyxVQUFTO0FBRTlCLE1BQUksVUFBUyxTQUFTLGNBQWM7QUFDaEMsV0FBTyxRQUFRLGVBQW9CLE1BQU0sYUFBa0IsVUFBUyxRQUFRLGNBQWMsUUFBUTtBQUFBLEVBQ3RHO0FBR0EsTUFBSSxDQUFDLFNBQVMsT0FBTyxTQUFTLFVBQVMsU0FBUyxDQUFDLFdBQVcsR0FBRyxNQUFNLEtBQUssVUFBUyxhQUFhO0FBQzVGLHdCQUFvQixNQUFNO0FBQUEsRUFDOUI7QUFFQSxNQUFHLE9BQU8sZUFBZSxPQUFPLFFBQVEsU0FBUTtBQUM1QyxpQkFBYSxNQUFNO0FBQUEsRUFDdkI7QUFDSjtBQUVPLDBCQUEwQjtBQUM3QixlQUFhO0FBQ2Isa0JBQWdCO0FBQ2hCLGtCQUFnQjtBQUNwQjs7O0FuRm5VQTs7O0FvRlBBO0FBQ0E7QUFDQTtBQUNBO0FBWUEsaUNBQWlDLFFBQWdCLGtCQUE4RDtBQUMzRyxNQUFJLFdBQVcsbUJBQW1CO0FBRWxDLFFBQU0sZUFBTyxpQkFBaUIsUUFBUTtBQUV0QyxjQUFZO0FBRVosUUFBTSxlQUFPLGlCQUFpQixRQUFRO0FBRXRDLE1BQUksa0JBQWtCO0FBQ2xCLGdCQUFZO0FBQ1osVUFBTSxXQUFXLFdBQVcsaUJBQWlCO0FBRTdDLFFBQUksQ0FBQyxNQUFNLGVBQU8sV0FBVyxRQUFRLEdBQUc7QUFDcEMsWUFBTSxlQUFPLFVBQVUsVUFBVSxpQkFBaUIsS0FBSztBQUFBLElBQzNELFdBQVcsaUJBQWlCLE9BQU87QUFDL0IsWUFBTSxlQUFPLFVBQVUsVUFBVSxNQUFNLGlCQUFpQixNQUFNLE1BQU0sZUFBTyxTQUFTLFVBQVUsTUFBTSxHQUFHLFVBQVUsUUFBUSxDQUFDO0FBQUEsSUFDOUg7QUFBQSxFQUNKO0FBQ0o7QUFNQSxvQ0FBb0M7QUFDaEMsTUFBSTtBQUNKLFFBQU0sa0JBQWtCLGFBQWE7QUFFckMsTUFBSSxNQUFNLGVBQU8sV0FBVyxlQUFlLEdBQUc7QUFDMUMsa0JBQWMsZUFBTyxhQUFhLGVBQWU7QUFBQSxFQUNyRCxPQUFPO0FBQ0gsa0JBQWMsTUFBTSxJQUFJLFFBQVEsU0FBTztBQUNuQyxNQUFXLG9CQUFTLE1BQU0sRUFBRSxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssU0FBUztBQUN0RCxZQUFJO0FBQUssZ0JBQU07QUFDZixZQUFJO0FBQUEsVUFDQSxLQUFLLEtBQUs7QUFBQSxVQUNWLE1BQU0sS0FBSztBQUFBLFFBQ2YsQ0FBQztBQUFBLE1BQ0wsQ0FBQztBQUFBLElBQ0wsQ0FBQztBQUVELG1CQUFPLGNBQWMsaUJBQWlCLFdBQVc7QUFBQSxFQUNyRDtBQUNBLFNBQU87QUFDWDtBQUVBLHVCQUF1QixLQUFLO0FBQ3hCLFFBQU0sU0FBUyxNQUFLLGFBQWEsSUFBSSxNQUFNO0FBQzNDLFNBQU87QUFBQSxJQUNIO0FBQUEsSUFDQSxPQUFPLE1BQWM7QUFDakIsYUFBTyxJQUFJLFFBQVEsU0FBTztBQUN0QixlQUFPLE9BQU8sTUFBVyxHQUFHO0FBQUEsTUFDaEMsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUNBLFFBQVE7QUFDSixhQUFPLE1BQU07QUFBQSxJQUNqQjtBQUFBLEVBQ0o7QUFDSjtBQU9BLCtCQUFzQyxLQUFLO0FBRXZDLE1BQUksQ0FBRSxRQUFTLE1BQU0sU0FBUyxPQUFTLE1BQU0sV0FBVyxlQUFlO0FBQ25FLFdBQU8sTUFBTSxjQUFjLEdBQUc7QUFBQSxFQUNsQztBQUVBLE1BQUksQ0FBQyxPQUFTLE1BQU0sVUFBVSxjQUFjO0FBQ3hDLFVBQU0sU0FBUyxPQUFNLG1CQUFtQixpQ0FBSyxNQUFNLG1CQUFtQixJQUE5QixFQUFpQyxZQUFZLEtBQUssSUFBRyxJQUFJLE1BQU07QUFFdkcsV0FBTztBQUFBLE1BQ0g7QUFBQSxNQUNBLE9BQU8sTUFBTTtBQUNULGVBQU8sT0FBTyxJQUFJO0FBQUEsTUFDdEI7QUFBQSxNQUNBLE9BQU87QUFDSCxlQUFPLE1BQU07QUFBQSxNQUNqQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBRUEsUUFBTSxrQkFBa0IsYUFBYTtBQUFBLElBQ2pDLE1BQU07QUFBQSxJQUFlLE9BQU8sS0FBSyxVQUFVO0FBQUEsTUFDdkMsT0FBTyxPQUFTLE1BQU0sVUFBVTtBQUFBLElBQ3BDLENBQUM7QUFBQSxVQUNLLE1BQU0sTUFBTSxHQUFHLFFBQVE7QUFDekIsYUFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QixpQkFBVyxLQUFLLEtBQUssT0FBTztBQUN4QixjQUFNLElBQUksS0FBSyxNQUFNO0FBQ3JCLFlBQUk7QUFDSixtQkFBVyxLQUF1QixPQUFTLE1BQU0sVUFBVSxPQUFPO0FBQzlELGNBQUksRUFBRSxXQUFXLEVBQUUsU0FBUztBQUN4QixtQkFBTztBQUNQLGdCQUFJLEVBQUUsU0FBUyxVQUFVLEVBQUUsU0FBUyxVQUFVLEVBQUUsU0FBUyxLQUFLLE9BQUssRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEdBQUc7QUFDeEYsZ0JBQUUsV0FBVyxFQUFFO0FBQ2YscUJBQU8sRUFBRTtBQUFBLFlBQ2I7QUFDQTtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQ0EsWUFBSSxDQUFDLE1BQU07QUFDUCxlQUFLLE1BQU0sT0FBTyxHQUFHLENBQUM7QUFDdEIsZ0JBQU0sU0FBTyxTQUFTLFVBQVUsRUFBRTtBQUVsQyxjQUFJLE1BQU0sZUFBTyxPQUFPLE1BQUksR0FBRztBQUMzQixrQkFBTSxrQkFBa0IsTUFBSTtBQUM1QixrQkFBTSxlQUFPLE1BQU0sTUFBSTtBQUFBLFVBQzNCO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFFQSxZQUFNLFdBQVcsT0FBUyxNQUFNLFVBQVUsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxLQUFLLE9BQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDO0FBRTNHLFdBQUssTUFBTSxLQUFLLEdBQUcsUUFBUTtBQUUzQixhQUFPLEtBQUssVUFBVSxJQUFJO0FBQUEsSUFDOUI7QUFBQSxFQUNKLENBQUM7QUFFRCxRQUFNLGNBQWMsTUFBTSxlQUFPLGFBQWEsbUJBQW1CLGNBQWM7QUFFL0UsUUFBTSxrQkFBc0IsTUFBTSxJQUFJLFFBQVEsU0FBTyxBQUFVLGVBQUs7QUFBQSxJQUNoRSxhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxjQUFjLE9BQVMsTUFBTSxVQUFVLFNBQVMsWUFBWSxPQUFPLE1BQU0sWUFBWTtBQUFBLElBQ3JGLGlCQUFpQixPQUFTLE1BQU0sVUFBVTtBQUFBLElBQzFDLFNBQVMsT0FBUyxNQUFNLFVBQVU7QUFBQSxJQUNsQyxTQUFTLE9BQVMsTUFBTSxVQUFVO0FBQUEsRUFDdEMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBRWIsd0JBQXNCLE1BQU0sTUFBTSxTQUFVO0FBQ3hDLFFBQUksa0JBQWtCLE1BQU07QUFBQSxJQUFFO0FBQzlCLFVBQU0sU0FBUyxnQkFBZ0IsTUFBTSxTQUFTLElBQUk7QUFDbEQsVUFBTSxTQUFTLENBQUMsU0FBUztBQUNyQixZQUFNLGFBQWEsZ0JBQWdCLFdBQVc7QUFDOUMsd0JBQWtCLE1BQU0sV0FBVyxNQUFNO0FBQ3pDLGFBQU8sUUFBUSxJQUFJLENBQUMsSUFBSSxRQUFRLFNBQU8sT0FBTyxPQUFPLEtBQUssV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLFFBQVEsU0FBTyxXQUFXLE9BQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFBQSxJQUM1STtBQUNBLFVBQU0sUUFBUSxNQUFNO0FBQUUsYUFBTyxNQUFNO0FBQUcsc0JBQWdCO0FBQUEsSUFBRztBQUN6RCxXQUFPO0FBQUEsTUFDSDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFFQSxNQUFJLE9BQVMsTUFBTSxPQUFPO0FBQ3RCLFdBQU8sYUFBYSxlQUFlLElBQUksUUFBUSxFQUFFLFlBQVksS0FBSyxDQUFDO0FBQUEsRUFDdkUsT0FBTztBQUNILFdBQU8sYUFBYSxlQUFlLElBQUksTUFBTTtBQUFBLEVBQ2pEO0FBQ0o7OztBcEZoS0Esa0NBQWtDLEtBQWMsS0FBZTtBQUMzRCxNQUFJLE9BQVMsYUFBYTtBQUN0QixVQUFNLGdCQUFnQjtBQUFBLEVBQzFCO0FBRUEsU0FBTyxNQUFNLGVBQWUsS0FBSyxHQUFHO0FBQ3hDO0FBRUEsOEJBQThCLEtBQWMsS0FBZTtBQUN2RCxNQUFJLE1BQU0sQUFBVSxPQUFPLElBQUksSUFBSTtBQUduQyxXQUFTLEtBQUssT0FBUyxRQUFRLFNBQVM7QUFDcEMsUUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHO0FBQ25CLFVBQUksRUFBRSxTQUFTLEdBQUcsR0FBRztBQUNqQixZQUFJLEVBQUUsVUFBVSxHQUFHLEVBQUUsU0FBUyxDQUFDO0FBQUEsTUFDbkM7QUFDQSxhQUFPLE1BQU0sY0FBYyxLQUFLLEtBQUssQ0FBQztBQUFBLElBQzFDO0FBQUEsRUFDSjtBQUVBLFFBQU0sWUFBWSxPQUFPLEtBQUssT0FBUyxRQUFRLEtBQUssRUFBRSxLQUFLLE9BQUssSUFBSSxXQUFXLENBQUMsQ0FBQztBQUVqRixNQUFJLFdBQVc7QUFDWCxVQUFNLE1BQU0sT0FBUyxRQUFRLE1BQU0sV0FBVyxLQUFLLEtBQUssR0FBRztBQUFBLEVBQy9EO0FBRUEsUUFBTSxjQUFjLEtBQUssS0FBSyxHQUFHO0FBQ3JDO0FBRUEsNkJBQTZCLEtBQWMsS0FBZSxLQUFhO0FBQ25FLE1BQUksV0FBZ0IsT0FBUyxRQUFRLFlBQVksS0FBSyxPQUFLLElBQUksV0FBVyxDQUFDLENBQUMsS0FBSyxPQUFTLFFBQVEsWUFBWSxLQUFLLE9BQUssSUFBSSxTQUFTLE1BQUksQ0FBQyxDQUFDO0FBRTNJLE1BQUcsQ0FBQyxVQUFVO0FBQ1YsZUFBVSxTQUFTLE9BQVMsUUFBUSxXQUFVO0FBQzFDLFVBQUcsQ0FBQyxNQUFNLE1BQU0sS0FBSyxLQUFLLEdBQUcsR0FBRTtBQUMzQixtQkFBVztBQUNYO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBRUEsTUFBSSxVQUFVO0FBQ1YsVUFBTSxZQUFZLEFBQVUsYUFBYSxLQUFLLFVBQVU7QUFDeEQsV0FBTyxNQUFNLEFBQVUsWUFBWSxLQUFLLEtBQUssVUFBVSxLQUFLLFVBQVUsV0FBVyxVQUFVLElBQUk7QUFBQSxFQUNuRztBQUVBLFFBQU0sQUFBVSxZQUFZLEtBQUssS0FBSyxJQUFJLFVBQVUsQ0FBQyxDQUFDO0FBQzFEO0FBRUEsSUFBSTtBQU1KLHdCQUF3QixRQUFTO0FBQzdCLFFBQU0sTUFBTSxJQUFJLFFBQVE7QUFDeEIsTUFBSSxDQUFDLE9BQVMsTUFBTSxPQUFPO0FBQ3ZCLFFBQUksSUFBUyxZQUFZLENBQUM7QUFBQSxFQUM5QjtBQUNBLEVBQVUsVUFBUyxlQUFlLE9BQU8sS0FBSyxLQUFLLFNBQVMsT0FBUyxXQUFXLFFBQVEsS0FBSyxLQUFLLElBQUk7QUFFdEcsUUFBTSxjQUFjLE1BQU0sYUFBYSxLQUFLLE1BQU07QUFFbEQsYUFBVyxRQUFRLE9BQVMsUUFBUSxjQUFjO0FBQzlDLFVBQU0sS0FBSyxLQUFLLFVBQVUsUUFBUSxNQUFRO0FBQUEsRUFDOUM7QUFDQSxRQUFNLHNCQUFzQixJQUFJO0FBRWhDLE1BQUksSUFBSSxLQUFLLFlBQVk7QUFFekIsUUFBTSxZQUFZLE9BQVMsTUFBTSxJQUFJO0FBRXJDLFVBQVEsSUFBSSwwQkFBMEIsT0FBUyxNQUFNLElBQUk7QUFDN0Q7QUFPQSw0QkFBNEIsS0FBYyxLQUFlO0FBQ3JELE1BQUksSUFBSSxVQUFVLFFBQVE7QUFDdEIsUUFBSSxJQUFJLFFBQVEsaUJBQWlCLGFBQWEsa0JBQWtCLEdBQUc7QUFDL0QsYUFBUyxXQUFXLFdBQVcsS0FBSyxLQUFLLE1BQU0sbUJBQW1CLEtBQUssR0FBRyxDQUFDO0FBQUEsSUFDL0UsT0FBTztBQUNILFVBQUksV0FBVyxhQUFhLE9BQVMsV0FBVyxVQUFVLEVBQUUsTUFBTSxLQUFLLENBQUMsS0FBSyxRQUFRLFVBQVU7QUFDM0YsWUFBSSxLQUFLO0FBQ0wsZ0JBQU0sTUFBTSxHQUFHO0FBQUEsUUFDbkI7QUFDQSxZQUFJLFNBQVM7QUFDYixZQUFJLFFBQVE7QUFDWiwyQkFBbUIsS0FBSyxHQUFHO0FBQUEsTUFDL0IsQ0FBQztBQUFBLElBQ0w7QUFBQSxFQUNKLE9BQU87QUFDSCx1QkFBbUIsS0FBSyxHQUFHO0FBQUEsRUFDL0I7QUFDSjtBQUVBLDRCQUE0QixLQUFLLFFBQVE7QUFDckMsTUFBSSxhQUFhLFVBQVUsT0FBTztBQUM5QixVQUFNLFVBQVUsTUFBTTtBQUFBLEVBQzFCO0FBRUEsUUFBTSxFQUFFLFFBQVEsUUFBUSxVQUFVLE1BQU0sT0FBTyxHQUFHO0FBRWxELGNBQVksRUFBRSxRQUFRLE1BQU07QUFFNUIsU0FBTztBQUNYO0FBRUEsMkJBQTBDLEVBQUUsV0FBVyxNQUFNLGFBQWEsb0JBQW9CLENBQUMsR0FBRztBQUM5RixnQkFBYyxnQkFBZ0I7QUFDOUIsaUJBQWU7QUFDZixRQUFNLGdCQUFnQjtBQUN0QixRQUFNLFNBQVMsVUFBVTtBQUN6QixTQUFPO0FBQ1g7OztBcUY3SE8sSUFBTSxjQUFjLENBQUMsUUFBYSxhQUFhLG1CQUFtQixXQUFhLENBQUMsVUFBVSxHQUFHLFFBQU0sU0FBUyxRQUFRLEVBQUMsU0FBUyxPQUFTLFlBQVcsQ0FBQztBQUUxSixJQUFPLGNBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
