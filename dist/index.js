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
    return `${text || message}, on file ->
${BasicSettings.fullWebSitePath + data.searchLine.extractInfo()}:${data.line}:${data.char}${location?.lineText ? '\nLine: "' + location.lineText.trim() + '"' : ""}`;
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

// src/CompileCode/transpiler/minify.ts
import { minify } from "@swc/core";

// src/CompileCode/transpiler/printMessage.ts
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

// src/CompileCode/transpiler/printMessage.ts
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
      return `${dataError.errorCode}, on file ->
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
  return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${JSParser.printError(`Syntax Error: ${info.replaceAll("\n", "<br/>")}`)}\``;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc3BpbGVyL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcExvYWQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L2xvYWQtb3B0aW9ucy50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5ncy50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2NyaXB0L2luZGV4LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2VydmVyLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9wYWdlLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZUpTT04udHMiLCAiLi4vc3JjL091dHB1dElucHV0L1N0b3JlRGVwcy50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9pc29sYXRlLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N2ZWx0ZS50cyIsICIuLi9zcmMvU3RyaW5nTWV0aG9kcy9JZC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9zc3IudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvcHJlcHJvY2Vzcy50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL1NjcmlwdC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9qc29uLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL3dhc20udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vaW5kZXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9TZXNzaW9uLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9lcnJvci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93bi50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9oZWFkLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlcnYtY29ubmVjdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3QvY29ubmVjdC1ub2RlLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2Nvbm5lY3QudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvZm9ybS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9yZWNvcmQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2VhcmNoLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0V4dHJpY2F0ZS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9QYWdlQmFzZS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvQ29tcGlsZVNjcmlwdC9Db21waWxlLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9TY3JpcHQudHMiLCAiLi4vc3JjL0dsb2JhbC9TZWFyY2hSZWNvcmQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9BbGlhcy9wYWNrYWdlRXhwb3J0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvaW5kZXgudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9pbmRleC50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvU2NyaXB0VGVtcGxhdGUudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L0luZGV4LnRzIiwgIi4uL3NyYy9QbHVnaW5zL0luZGV4LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncy50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcy50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1NjcmlwdC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdHlsZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvQ29tcGlsZVN0YXRlLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvSW1wb3J0TW9kdWxlLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2l0ZU1hcC50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0ZpbGVUeXBlcy50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0Z1bmN0aW9uU2NyaXB0LnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvSW1wb3J0RmlsZVJ1bnRpbWUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9BcGlDYWxsLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvR2V0UGFnZXMudHMiLCAiLi4vc3JjL01haW5CdWlsZC9TZXR0aW5ncy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL0xpc3RlbkdyZWVuTG9jay50cyIsICIuLi9zcmMvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEFwcCBhcyBUaW55QXBwIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vVHlwZXMnO1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzLCByZXF1aXJlU2V0dGluZ3MsIGJ1aWxkRmlyc3RMb2FkLCBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmN9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IGZvcm1pZGFibGUgZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgeyBVcGRhdGVHcmVlbkxvY2sgfSBmcm9tICcuL0xpc3RlbkdyZWVuTG9jayc7XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEFuZFNldHRpbmdzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgY2hhbmdlVVJMUnVsZXMocmVxLCByZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGFuZ2VVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBsZXQgdXJsID0gZmlsZUJ5VXJsLnVybEZpeChyZXEucGF0aCk7XG5cbiAgICBcbiAgICBmb3IgKGxldCBpIG9mIFNldHRpbmdzLnJvdXRpbmcudXJsU3RvcCkge1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkpIHtcbiAgICAgICAgICAgIGlmIChpLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS5zdWJzdHJpbmcoMCwgaS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBmaWxlclVSTFJ1bGVzKHJlcSwgcmVzLCBpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IFJ1bGVJbmRleCA9IE9iamVjdC5rZXlzKFNldHRpbmdzLnJvdXRpbmcucnVsZXMpLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSk7XG5cbiAgICBpZiAoUnVsZUluZGV4KSB7XG4gICAgICAgIHVybCA9IGF3YWl0IFNldHRpbmdzLnJvdXRpbmcucnVsZXNbUnVsZUluZGV4XSh1cmwsIHJlcSwgcmVzKTtcbiAgICB9XG5cbiAgICBhd2FpdCBmaWxlclVSTFJ1bGVzKHJlcSwgcmVzLCB1cmwpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaWxlclVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgdXJsOiBzdHJpbmcpIHtcbiAgICBsZXQgbm90VmFsaWQ6IGFueSA9IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKSB8fCBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoaSA9PiB1cmwuZW5kc1dpdGgoJy4nK2kpKTtcbiAgICBcbiAgICBpZighbm90VmFsaWQpIHtcbiAgICAgICAgZm9yKGNvbnN0IHZhbGlkIG9mIFNldHRpbmdzLnJvdXRpbmcudmFsaWRQYXRoKXsgLy8gY2hlY2sgaWYgdXJsIGlzbid0IHZhbGlkXG4gICAgICAgICAgICBpZighYXdhaXQgdmFsaWQodXJsLCByZXEsIHJlcykpe1xuICAgICAgICAgICAgICAgIG5vdFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub3RWYWxpZCkge1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBmaWxlQnlVcmwuR2V0RXJyb3JQYWdlKDQwNCwgJ25vdEZvdW5kJyk7XG4gICAgICAgIHJldHVybiBhd2FpdCBmaWxlQnlVcmwuRHluYW1pY1BhZ2UocmVxLCByZXMsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBmaWxlQnlVcmwuRHluYW1pY1BhZ2UocmVxLCByZXMsIHVybC5zdWJzdHJpbmcoMSkpO1xufVxuXG5sZXQgYXBwT25saW5lXG5cbi8qKlxuICogSXQgc3RhcnRzIHRoZSBzZXJ2ZXIgYW5kIHRoZW4gY2FsbHMgU3RhcnRMaXN0aW5nXG4gKiBAcGFyYW0gW1NlcnZlcl0gLSBUaGUgc2VydmVyIG9iamVjdCB0aGF0IGlzIHBhc3NlZCBpbiBieSB0aGUgY2FsbGVyLlxuICovXG5hc3luYyBmdW5jdGlvbiBTdGFydEFwcChTZXJ2ZXI/KSB7XG4gICAgY29uc3QgYXBwID0gbmV3IFRpbnlBcHAoKTtcbiAgICBpZiAoIVNldHRpbmdzLnNlcnZlLmh0dHAyKSB7XG4gICAgICAgIGFwcC51c2UoPGFueT5jb21wcmVzc2lvbigpKTtcbiAgICB9XG4gICAgZmlsZUJ5VXJsLlNldHRpbmdzLlNlc3Npb25TdG9yZSA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4gU2V0dGluZ3MubWlkZGxld2FyZS5zZXNzaW9uKHJlcSwgcmVzLCBuZXh0KTtcblxuICAgIGNvbnN0IE9wZW5MaXN0aW5nID0gYXdhaXQgU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKTtcblxuICAgIGZvciAoY29uc3QgZnVuYyBvZiBTZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCkge1xuICAgICAgICBhd2FpdCBmdW5jKGFwcCwgYXBwT25saW5lLnNlcnZlciwgU2V0dGluZ3MpO1xuICAgIH1cbiAgICBhd2FpdCBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKT8uKClcblxuICAgIGFwcC5hbGwoXCIqXCIsIFBhcnNlUmVxdWVzdCk7XG5cbiAgICBhd2FpdCBPcGVuTGlzdGluZyhTZXR0aW5ncy5zZXJ2ZS5wb3J0KTtcblxuICAgIGNvbnNvbGUubG9nKFwiQXBwIGxpc3RpbmcgYXQgcG9ydDogXCIgKyBTZXR0aW5ncy5zZXJ2ZS5wb3J0KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcmVxdWVzdCBpcyBhIFBPU1QgcmVxdWVzdCwgdGhlbiBwYXJzZSB0aGUgcmVxdWVzdCBib2R5LCB0aGVuIHNlbmQgaXQgdG8gcm91dGluZyBzZXR0aW5nc1xuICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLSBUaGUgaW5jb21pbmcgcmVxdWVzdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlcyAtIFJlc3BvbnNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlUmVxdWVzdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAocmVxLm1ldGhvZCA9PSAnUE9TVCcpIHtcbiAgICAgICAgaWYgKHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXT8uc3RhcnRzV2l0aD8uKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgICAgIFNldHRpbmdzLm1pZGRsZXdhcmUuYm9keVBhcnNlcihyZXEsIHJlcywgKCkgPT4gcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgZm9ybWlkYWJsZS5JbmNvbWluZ0Zvcm0oU2V0dGluZ3MubWlkZGxld2FyZS5mb3JtaWRhYmxlKS5wYXJzZShyZXEsIChlcnIsIGZpZWxkcywgZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdEFuZFNldHRpbmdzKHJlcSwgcmVzKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcikge1xuICAgIGlmIChhcHBPbmxpbmUgJiYgYXBwT25saW5lLmNsb3NlKSB7XG4gICAgICAgIGF3YWl0IGFwcE9ubGluZS5jbG9zZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VydmVyLCBsaXN0ZW4sIGNsb3NlIH0gPSBhd2FpdCBTZXJ2ZXIoYXBwKTtcblxuICAgIGFwcE9ubGluZSA9IHsgc2VydmVyLCBjbG9zZSB9O1xuXG4gICAgcmV0dXJuIGxpc3Rlbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU3RhcnRTZXJ2ZXIoeyBTaXRlUGF0aCA9ICcuLycsIEh0dHBTZXJ2ZXIgPSBVcGRhdGVHcmVlbkxvY2sgfSA9IHt9KSB7XG4gICAgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyID0gU2l0ZVBhdGg7XG4gICAgYnVpbGRGaXJzdExvYWQoKTtcbiAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICBTdGFydEFwcChIdHRwU2VydmVyKTtcbn1cblxuZXhwb3J0IHsgU2V0dGluZ3MgfTsiLCAiaW1wb3J0IGZzLCB7RGlyZW50LCBTdGF0c30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIGV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIHJlcyhCb29sZWFuKHN0YXQpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge3BhdGggb2YgdGhlIGZpbGV9IHBhdGggXG4gKiBAcGFyYW0ge2ZpbGVkIHRvIGdldCBmcm9tIHRoZSBzdGF0IG9iamVjdH0gZmlsZWQgXG4gKiBAcmV0dXJucyB0aGUgZmlsZWRcbiAqL1xuZnVuY3Rpb24gc3RhdChwYXRoOiBzdHJpbmcsIGZpbGVkPzogc3RyaW5nLCBpZ25vcmVFcnJvcj86IGJvb2xlYW4sIGRlZmF1bHRWYWx1ZTphbnkgPSB7fSk6IFByb21pc2U8U3RhdHMgfCBhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIGlmKGVyciAmJiAhaWdub3JlRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZWQgJiYgc3RhdD8gc3RhdFtmaWxlZF06IHN0YXQgfHwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGZpbGUgZXhpc3RzLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjaGVjay5cbiAqIEBwYXJhbSB7YW55fSBbaWZUcnVlUmV0dXJuPXRydWVdIC0gYW55ID0gdHJ1ZVxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiBleGlzdHNGaWxlKHBhdGg6IHN0cmluZywgaWZUcnVlUmV0dXJuOiBhbnkgPSB0cnVlKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gKGF3YWl0IHN0YXQocGF0aCwgdW5kZWZpbmVkLCB0cnVlKSkuaXNGaWxlPy4oKSAmJiBpZlRydWVSZXR1cm47XG59XG5cbi8qKlxuICogSXQgY3JlYXRlcyBhIGRpcmVjdG9yeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIG1rZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLm1rZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHJtZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcm1kaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucm1kaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgdW5saW5rYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gdW5saW5rKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnVubGluayhwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGV4aXN0cywgZGVsZXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSB0byBiZSB1bmxpbmtlZC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5saW5rSWZFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZihhd2FpdCBleGlzdHMocGF0aCkpe1xuICAgICAgICByZXR1cm4gYXdhaXQgdW5saW5rKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRkaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbnMgb2JqZWN0LCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHtcbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHJlYWRkaXIocGF0aDogc3RyaW5nLCBvcHRpb25zID0ge30pOiBQcm9taXNlPHN0cmluZ1tdIHwgQnVmZmVyW10gfCBEaXJlbnRbXT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRkaXIocGF0aCwgb3B0aW9ucywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlcyB8fCBbXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkaXJlY3Rvcnkgd2FzIGNyZWF0ZWQgb3Igbm90LlxuICovXG5hc3luYyBmdW5jdGlvbiBta2RpcklmTm90RXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoIWF3YWl0IGV4aXN0cyhwYXRoKSlcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1rZGlyKHBhdGgpO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIGZpbGUgdG8gdGhlIGZpbGUgc3lzdGVtXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHtzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHdyaXRlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6ICBzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3KTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMud3JpdGVGaWxlKHBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHdyaXRlSnNvbkZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGEgY29udGVudCBhbmQgd3JpdGVzIHRoZSBjb250ZW50IHRvIHRoZSBmaWxlIGF0XG4gKiB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7YW55fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSnNvbkZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgd3JpdGVGaWxlKHBhdGgsIEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZEZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbmFsIGVuY29kaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gKiByZXNvbHZlcyB0byB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXQgdGhlIGdpdmVuIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBbZW5jb2Rpbmc9dXRmOF0gLSBUaGUgZW5jb2Rpbmcgb2YgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlYWRGaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZyA9ICd1dGY4Jyk6IFByb21pc2U8c3RyaW5nfGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRGaWxlKHBhdGgsIDxhbnk+ZW5jb2RpbmcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhkYXRhIHx8IFwiXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJdCByZWFkcyBhIEpTT04gZmlsZSBhbmQgcmV0dXJucyB0aGUgcGFyc2VkIEpTT04gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIHtzdHJpbmd9IFtlbmNvZGluZ10gLSBUaGUgZW5jb2RpbmcgdG8gdXNlIHdoZW4gcmVhZGluZyB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZEpzb25GaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZz86c3RyaW5nKTogUHJvbWlzZTxhbnk+e1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHJlYWRGaWxlKHBhdGgsIGVuY29kaW5nKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSBwIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBuZWVkcyB0byBiZSBjcmVhdGVkLlxuICogQHBhcmFtIFtiYXNlXSAtIFRoZSBiYXNlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VQYXRoUmVhbChwOnN0cmluZywgYmFzZSA9ICcnKSB7XG4gICAgcCA9IHBhdGguZGlybmFtZShwKTtcblxuICAgIGlmICghYXdhaXQgZXhpc3RzKGJhc2UgKyBwKSkge1xuICAgICAgICBjb25zdCBhbGwgPSBwLnNwbGl0KC9cXFxcfFxcLy8pO1xuXG4gICAgICAgIGxldCBwU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGlmIChwU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHBTdHJpbmcgKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcFN0cmluZyArPSBpO1xuXG4gICAgICAgICAgICBhd2FpdCBta2RpcklmTm90RXhpc3RzKGJhc2UgKyBwU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy90eXBlc1xuZXhwb3J0IHtcbiAgICBEaXJlbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC4uLmZzLnByb21pc2VzLFxuICAgIGV4aXN0cyxcbiAgICBleGlzdHNGaWxlLFxuICAgIHN0YXQsXG4gICAgbWtkaXIsXG4gICAgbWtkaXJJZk5vdEV4aXN0cyxcbiAgICB3cml0ZUZpbGUsXG4gICAgd3JpdGVKc29uRmlsZSxcbiAgICByZWFkRmlsZSxcbiAgICByZWFkSnNvbkZpbGUsXG4gICAgcm1kaXIsXG4gICAgdW5saW5rLFxuICAgIHVubGlua0lmRXhpc3RzLFxuICAgIHJlYWRkaXIsXG4gICAgbWFrZVBhdGhSZWFsXG59IiwgImxldCBwcmludE1vZGUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dQcmludChkOiBib29sZWFuKSB7XG4gICAgcHJpbnRNb2RlID0gZDtcbn1cblxuZXhwb3J0IGNvbnN0IHByaW50ID0gbmV3IFByb3h5KGNvbnNvbGUse1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmKHByb3AgPT0gJ2ltcG9ydGFudCcpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmVycm9yO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmKHByaW50TW9kZSAmJiBwcm9wICE9IFwiZG8tbm90aGluZ1wiKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgfVxufSk7IiwgImltcG9ydCB7RGlyZW50fSBmcm9tICdmcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge2N3ZH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCAsIFNwbGl0Rmlyc3R9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcblxuZnVuY3Rpb24gZ2V0RGlybmFtZSh1cmw6IHN0cmluZyl7XG4gICAgcmV0dXJuIHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKHVybCkpO1xufVxuXG5jb25zdCBTeXN0ZW1EYXRhID0gcGF0aC5qb2luKGdldERpcm5hbWUoaW1wb3J0Lm1ldGEudXJsKSwgJy9TeXN0ZW1EYXRhJyk7XG5cbmxldCBXZWJTaXRlRm9sZGVyXyA9IFwiV2ViU2l0ZVwiO1xuXG5jb25zdCBTdGF0aWNOYW1lID0gJ1dXVycsIExvZ3NOYW1lID0gJ0xvZ3MnLCBNb2R1bGVzTmFtZSA9ICdub2RlX21vZHVsZXMnO1xuXG5jb25zdCBTdGF0aWNDb21waWxlID0gU3lzdGVtRGF0YSArIGAvJHtTdGF0aWNOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVMb2dzID0gU3lzdGVtRGF0YSArIGAvJHtMb2dzTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTW9kdWxlID0gU3lzdGVtRGF0YSArIGAvJHtNb2R1bGVzTmFtZX1Db21waWxlL2A7XG5cbmNvbnN0IHdvcmtpbmdEaXJlY3RvcnkgPSBjd2QoKSArICcvJztcblxuZnVuY3Rpb24gR2V0RnVsbFdlYlNpdGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSxXZWJTaXRlRm9sZGVyXywgJy8nKTtcbn1cbmxldCBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG5cbmZ1bmN0aW9uIEdldFNvdXJjZShuYW1lKSB7XG4gICAgcmV0dXJuICBHZXRGdWxsV2ViU2l0ZVBhdGgoKSArIG5hbWUgKyAnLydcbn1cblxuLyogQSBvYmplY3QgdGhhdCBjb250YWlucyBhbGwgdGhlIHBhdGhzIG9mIHRoZSBmaWxlcyBpbiB0aGUgcHJvamVjdC4gKi9cbmNvbnN0IGdldFR5cGVzID0ge1xuICAgIFN0YXRpYzogW1xuICAgICAgICBHZXRTb3VyY2UoU3RhdGljTmFtZSksXG4gICAgICAgIFN0YXRpY0NvbXBpbGUsXG4gICAgICAgIFN0YXRpY05hbWVcbiAgICBdLFxuICAgIExvZ3M6IFtcbiAgICAgICAgR2V0U291cmNlKExvZ3NOYW1lKSxcbiAgICAgICAgQ29tcGlsZUxvZ3MsXG4gICAgICAgIExvZ3NOYW1lXG4gICAgXSxcbiAgICBub2RlX21vZHVsZXM6IFtcbiAgICAgICAgR2V0U291cmNlKCdub2RlX21vZHVsZXMnKSxcbiAgICAgICAgQ29tcGlsZU1vZHVsZSxcbiAgICAgICAgTW9kdWxlc05hbWVcbiAgICBdLFxuICAgIGdldCBbU3RhdGljTmFtZV0oKXtcbiAgICAgICAgcmV0dXJuIGdldFR5cGVzLlN0YXRpYztcbiAgICB9XG59XG5cbmNvbnN0IHBhZ2VUeXBlcyA9IHtcbiAgICBwYWdlOiBcInBhZ2VcIixcbiAgICBtb2RlbDogXCJtb2RlXCIsXG4gICAgY29tcG9uZW50OiBcImludGVcIlxufVxuXG5cbmNvbnN0IEJhc2ljU2V0dGluZ3MgPSB7XG4gICAgcGFnZVR5cGVzLFxuXG4gICAgcGFnZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgcGFnZUNvZGVGaWxlOiB7XG4gICAgICAgIHBhZ2U6IFtwYWdlVHlwZXMucGFnZStcIi5qc1wiLCBwYWdlVHlwZXMucGFnZStcIi50c1wiXSxcbiAgICAgICAgbW9kZWw6IFtwYWdlVHlwZXMubW9kZWwrXCIuanNcIiwgcGFnZVR5cGVzLm1vZGVsK1wiLnRzXCJdLFxuICAgICAgICBjb21wb25lbnQ6IFtwYWdlVHlwZXMuY29tcG9uZW50K1wiLmpzXCIsIHBhZ2VUeXBlcy5jb21wb25lbnQrXCIudHNcIl1cbiAgICB9LFxuXG4gICAgcGFnZUNvZGVGaWxlQXJyYXk6IFtdLFxuXG4gICAgcGFydEV4dGVuc2lvbnM6IFsnc2VydicsICdhcGknXSxcblxuICAgIFJlcUZpbGVUeXBlczoge1xuICAgICAgICBqczogXCJzZXJ2LmpzXCIsXG4gICAgICAgIHRzOiBcInNlcnYudHNcIixcbiAgICAgICAgJ2FwaS10cyc6IFwiYXBpLmpzXCIsXG4gICAgICAgICdhcGktanMnOiBcImFwaS50c1wiXG4gICAgfSxcbiAgICBSZXFGaWxlVHlwZXNBcnJheTogW10sXG5cbiAgICBnZXQgV2ViU2l0ZUZvbGRlcigpIHtcbiAgICAgICAgcmV0dXJuIFdlYlNpdGVGb2xkZXJfO1xuICAgIH0sXG4gICAgZ2V0IGZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF87XG4gICAgfSxcbiAgICBzZXQgV2ViU2l0ZUZvbGRlcih2YWx1ZSkge1xuICAgICAgICBXZWJTaXRlRm9sZGVyXyA9IHZhbHVlO1xuXG4gICAgICAgIGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcbiAgICAgICAgZ2V0VHlwZXMuU3RhdGljWzBdID0gR2V0U291cmNlKFN0YXRpY05hbWUpO1xuICAgICAgICBnZXRUeXBlcy5Mb2dzWzBdID0gR2V0U291cmNlKExvZ3NOYW1lKTtcbiAgICB9LFxuICAgIGdldCB0c0NvbmZpZygpe1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXyArICd0c2NvbmZpZy5qc29uJzsgXG4gICAgfSxcbiAgICBhc3luYyB0c0NvbmZpZ0ZpbGUoKSB7XG4gICAgICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMudHNDb25maWcpKXtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy50c0NvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbGF0aXZlKGZ1bGxQYXRoOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShmdWxsV2ViU2l0ZVBhdGhfLCBmdWxsUGF0aClcbiAgICB9XG59XG5cbkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzKTtcbkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlKS5mbGF0KCk7XG5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlcyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBDdXRUaGVMYXN0KCcuJywgU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkucG9wKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZUJ5U21hbGxQYXRoKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gZ2V0VHlwZXNbU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkuc2hpZnQoKV07XG59XG5cblxuXG5leHBvcnQge1xuICAgIGdldERpcm5hbWUsXG4gICAgU3lzdGVtRGF0YSxcbiAgICB3b3JraW5nRGlyZWN0b3J5LFxuICAgIGdldFR5cGVzLFxuICAgIEJhc2ljU2V0dGluZ3Ncbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5pbnRlcmZhY2UgZ2xvYmFsU3RyaW5nPFQ+IHtcbiAgICBpbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIGxhc3RJbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIHN0YXJ0c1dpdGgoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3BsaXRGaXJzdDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+Pih0eXBlOiBzdHJpbmcsIHN0cmluZzogVCk6IFRbXSB7XG4gICAgY29uc3QgaW5kZXggPSBzdHJpbmcuaW5kZXhPZih0eXBlKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSlcbiAgICAgICAgcmV0dXJuIFtzdHJpbmddO1xuXG4gICAgcmV0dXJuIFtzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGV4KSwgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIHR5cGUubGVuZ3RoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDdXRUaGVMYXN0KHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YodHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0ZW5zaW9uPFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0cmluZzogVCkge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1UeXBlKHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICB3aGlsZSAoc3RyaW5nLnN0YXJ0c1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcodHlwZS5sZW5ndGgpO1xuXG4gICAgd2hpbGUgKHN0cmluZy5lbmRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGVuZ3RoIC0gdHlwZS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0cmluZ1N0YXJ0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0YXJ0OiBzdHJpbmcsIHN0cmluZzogVCk6IFQge1xuICAgIGlmKHN0cmluZy5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vLi4vSlNQYXJzZXInO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVRleHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGA8JXs/ZGVidWdfZmlsZT99JHtpLnRleHR9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlU2NyaXB0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGBydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdMaW5lKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VUZXh0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZXIuc3RhcnQgPSBcIjwlXCI7XG4gICAgcGFyc2VyLmVuZCA9IFwiJT5cIjtcbiAgICByZXR1cm4gcGFyc2VyLlJlQnVpbGRUZXh0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdJbmZvKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IFBhcnNlU2NyaXB0Q29kZShjb2RlLCBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEFkZERlYnVnSW5mbyhpc29sYXRlOiBib29sZWFuLCBwYWdlTmFtZTpzdHJpbmcsIEZ1bGxQYXRoOnN0cmluZywgU21hbGxQYXRoOnN0cmluZywgY2FjaGU6IHt2YWx1ZT86IHN0cmluZ30gPSB7fSl7XG4gICAgaWYoIWNhY2hlLnZhbHVlKVxuICAgICAgICBjYWNoZS52YWx1ZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsUGF0aCwgJ3V0ZjgnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbERhdGE6IG5ldyBTdHJpbmdUcmFja2VyKGAke3BhZ2VOYW1lfTxsaW5lPiR7U21hbGxQYXRofWAsIGlzb2xhdGUgPyBgPCV7JT4ke2NhY2hlLnZhbHVlfTwlfSU+YDogY2FjaGUudmFsdWUpLFxuICAgICAgICBzdHJpbmdJbmZvOiBgPCUhXFxucnVuX3NjcmlwdF9uYW1lPVxcYCR7SlNQYXJzZXIuZml4VGV4dChwYWdlTmFtZSArICcgLT4gJyArIFNtYWxsUGF0aCl9XFxgOyU+YFxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aDogc3RyaW5nLCBpbnB1dFBhdGg6IHN0cmluZywgZm9sZGVyOnN0cmluZywgcGFnZVR5cGU6c3RyaW5nLCBwYXRoVHlwZSA9IDApIHtcbiAgICBpZiAocGFnZVR5cGUgJiYgIWlucHV0UGF0aC5lbmRzV2l0aCgnLicgKyBwYWdlVHlwZSkpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7aW5wdXRQYXRofS4ke3BhZ2VUeXBlfWA7XG4gICAgfVxuXG4gICAgaWYoaW5wdXRQYXRoWzBdID09ICdeJyl7IC8vIGxvYWQgZnJvbSBwYWNrYWdlc1xuICAgICAgICBjb25zdCBbcGFja2FnZU5hbWUsIGluUGF0aF0gPSBTcGxpdEZpcnN0KCcvJywgIGlucHV0UGF0aC5zdWJzdHJpbmcoMSkpO1xuICAgICAgICByZXR1cm4gKHBhdGhUeXBlID09IDAgPyB3b3JraW5nRGlyZWN0b3J5OiAnJykgKyBgbm9kZV9tb2R1bGVzLyR7cGFja2FnZU5hbWV9LyR7Zm9sZGVyfS8ke2luUGF0aH1gO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChpbnB1dFBhdGhbMV0gPT0gJy8nKSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDIpO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGAke3BhdGguZGlybmFtZShmaWxlUGF0aCl9LyR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIGlmIChpbnB1dFBhdGhbMF0gPT0gJy8nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2dldFR5cGVzLlN0YXRpY1twYXRoVHlwZV19JHtpbnB1dFBhdGh9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArICcvJyA6ICcnfSR7Zm9sZGVyfS8ke2lucHV0UGF0aH1gO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZShpbnB1dFBhdGgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGhUeXBlcyB7XG4gICAgU21hbGxQYXRoV2l0aG91dEZvbGRlcj86IHN0cmluZyxcbiAgICBTbWFsbFBhdGg/OiBzdHJpbmcsXG4gICAgRnVsbFBhdGg/OiBzdHJpbmcsXG4gICAgRnVsbFBhdGhDb21waWxlPzogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIENyZWF0ZUZpbGVQYXRoKGZpbGVQYXRoOnN0cmluZywgc21hbGxQYXRoOnN0cmluZywgaW5wdXRQYXRoOnN0cmluZywgZm9sZGVyOnN0cmluZywgcGFnZVR5cGU6IHN0cmluZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIFNtYWxsUGF0aDogQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKHNtYWxsUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlLCAyKSxcbiAgICAgICAgRnVsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChmaWxlUGF0aCwgaW5wdXRQYXRoLCBmb2xkZXIsIHBhZ2VUeXBlKSxcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUGFyc2VEZWJ1Z0xpbmUsXG4gICAgQ3JlYXRlRmlsZVBhdGgsXG4gICAgUGFyc2VEZWJ1Z0luZm9cbn07IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4vU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBHZW5lcmF0b3IsIFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gJy4vU291cmNlTWFwJztcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJvdGVjdGVkIG1hcDogU291cmNlTWFwR2VuZXJhdG9yO1xuICAgIHByb3RlY3RlZCBmaWxlRGlyTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBsaW5lQ291bnQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBodHRwU291cmNlID0gdHJ1ZSwgcHJvdGVjdGVkIHJlbGF0aXZlID0gZmFsc2UsIHByb3RlY3RlZCBpc0NzcyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgICAgICAgICBmaWxlOiBmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5wb3AoKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWh0dHBTb3VyY2UpXG4gICAgICAgICAgICB0aGlzLmZpbGVEaXJOYW1lID0gcGF0aC5kaXJuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTb3VyY2Uoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgICAgc291cmNlID0gc291cmNlLnNwbGl0KCc8bGluZT4nKS5wb3AoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaHR0cFNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMocGF0aC5leHRuYW1lKHNvdXJjZSkuc3Vic3RyaW5nKDEpKSlcbiAgICAgICAgICAgICAgICBzb3VyY2UgKz0gJy5zb3VyY2UnO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IFNwbGl0Rmlyc3QoJy8nLCBzb3VyY2UpLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoKHRoaXMucmVsYXRpdmUgPyAnJzogJy8nKSArIHNvdXJjZS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRoaXMuZmlsZURpck5hbWUsIEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc291cmNlKTtcbiAgICB9XG5cbiAgICBnZXRSb3dTb3VyY2VNYXAoKTogUmF3U291cmNlTWFwe1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAudG9KU09OKClcbiAgICB9XG5cbiAgICBtYXBBc1VSTENvbW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0b1VSTENvbW1lbnQodGhpcy5tYXAsIHRoaXMuaXNDc3MpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlTWFwU3RvcmUgZXh0ZW5kcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJpdmF0ZSBzdG9yZVN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgYWN0aW9uTG9hZDogeyBuYW1lOiBzdHJpbmcsIGRhdGE6IGFueVtdIH1bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgcHJvdGVjdGVkIGRlYnVnID0gdHJ1ZSwgaXNDc3MgPSBmYWxzZSwgaHR0cFNvdXJjZSA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIGZhbHNlLCBpc0Nzcyk7XG4gICAgfVxuXG4gICAgbm90RW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvbkxvYWQubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBhZGRTdHJpbmdUcmFja2VyKHRyYWNrOiBTdHJpbmdUcmFja2VyLCB7IHRleHQ6IHRleHQgPSB0cmFjay5lcSB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU3RyaW5nVHJhY2tlcicsIGRhdGE6IFt0cmFjaywge3RleHR9XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRTdHJpbmdUcmFja2VyKHRyYWNrOiBTdHJpbmdUcmFja2VyLCB7IHRleHQ6IHRleHQgPSB0cmFjay5lcSB9ID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFRleHQodGV4dCk7XG5cbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IHRleHQsIGxpbmUsIGluZm8gfSA9IERhdGFBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0ID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3YWl0TmV4dExpbmUgJiYgbGluZSAmJiBpbmZvKSB7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UoaW5mbylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cblxuICAgIGFkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFRleHQnLCBkYXRhOiBbdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVidWcpXG4gICAgICAgICAgICB0aGlzLmxpbmVDb3VudCArPSB0ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxO1xuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFVSTFNvdXJjZU1hcChtYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtYXAuc291cmNlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBtYXAuc291cmNlc1tpXSA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZmlsZVVSTFRvUGF0aChtYXAuc291cmNlc1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuXG4gICAgYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyJywgZGF0YTogW2Zyb21NYXAsIHRyYWNrLCB0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFRleHQodGV4dCk7XG5cbiAgICAgICAgKGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihmcm9tTWFwKSkuZWFjaE1hcHBpbmcoKG0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFJbmZvID0gdHJhY2suZ2V0TGluZShtLm9yaWdpbmFsTGluZSkuZ2V0RGF0YUFycmF5KClbMF07XG5cbiAgICAgICAgICAgIGlmIChtLnNvdXJjZSA9PSB0aGlzLmZpbGVQYXRoKVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogZGF0YUluZm8ubGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUgKyB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hZGRUZXh0KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYnVpbGRBbGwoKSB7XG4gICAgICAgIGZvciAoY29uc3QgeyBuYW1lLCBkYXRhIH0gb2YgdGhpcy5hY3Rpb25Mb2FkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkVGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRUZXh0KC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICB0aGlzLmJ1aWxkQWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpXG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlRGF0YVdpdGhNYXAoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYnVpbGRBbGwoKTtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmcgKyBzdXBlci5tYXBBc1VSTENvbW1lbnQoKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBTb3VyY2VNYXBTdG9yZSh0aGlzLmZpbGVQYXRoLCB0aGlzLmRlYnVnLCB0aGlzLmlzQ3NzLCB0aGlzLmh0dHBTb3VyY2UpO1xuICAgICAgICBjb3B5LmFjdGlvbkxvYWQucHVzaCguLi50aGlzLmFjdGlvbkxvYWQpXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVVJMQ29tbWVudChtYXA6IFNvdXJjZU1hcEdlbmVyYXRvciwgaXNDc3M/OiBib29sZWFuKSB7XG4gICAgbGV0IG1hcFN0cmluZyA9IGBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKG1hcC50b1N0cmluZygpKS50b1N0cmluZyhcImJhc2U2NFwiKX1gO1xuXG4gICAgaWYgKGlzQ3NzKVxuICAgICAgICBtYXBTdHJpbmcgPSBgLyojICR7bWFwU3RyaW5nfSovYFxuICAgIGVsc2VcbiAgICAgICAgbWFwU3RyaW5nID0gJy8vIyAnICsgbWFwU3RyaW5nO1xuXG4gICAgcmV0dXJuICdcXHJcXG4nICsgbWFwU3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gTWVyZ2VTb3VyY2VNYXAoZ2VuZXJhdGVkTWFwOiBSYXdTb3VyY2VNYXAsIG9yaWdpbmFsTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihvcmlnaW5hbE1hcCk7XG4gICAgY29uc3QgbmV3TWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcigpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZ2VuZXJhdGVkTWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcih7bGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbn0pXG4gICAgICAgIGlmKCFsb2NhdGlvbi5zb3VyY2UpIHJldHVybjtcbiAgICAgICAgbmV3TWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBtLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbG9jYXRpb24uY29sdW1uLFxuICAgICAgICAgICAgICAgIGxpbmU6IGxvY2F0aW9uLmxpbmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3VyY2U6IGxvY2F0aW9uLnNvdXJjZVxuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ld01hcDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwQmFzaWMgfSBmcm9tICcuLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuXG5jbGFzcyBjcmVhdGVQYWdlU291cmNlTWFwIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2UgPSBmYWxzZSwgcmVsYXRpdmUgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgICAgICB0aGlzLmxpbmVDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgYWRkTWFwcGluZ0Zyb21UcmFjayh0cmFjazogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dHB1dE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgc3RvcmVNYXAuYWRkTWFwcGluZ0Zyb21UcmFjayh0ZXh0KTtcblxuICAgIHJldHVybiBzdG9yZU1hcC5nZXRSb3dTb3VyY2VNYXAoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dHB1dFdpdGhNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZyl7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCk7XG4gICAgc3RvcmVNYXAuYWRkTWFwcGluZ0Zyb21UcmFjayh0ZXh0KTtcblxuICAgIHJldHVybiB0ZXh0LmVxICsgc3RvcmVNYXAubWFwQXNVUkxDb21tZW50KCk7XG59IiwgImltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IG91dHB1dE1hcCwgb3V0cHV0V2l0aE1hcCB9IGZyb20gXCIuL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgdGV4dD86IHN0cmluZyxcbiAgICBpbmZvOiBzdHJpbmcsXG4gICAgbGluZT86IG51bWJlcixcbiAgICBjaGFyPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTdHJpbmdJbmRleGVySW5mbyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5TWF0Y2ggZXh0ZW5kcyBBcnJheTxTdHJpbmdUcmFja2VyPiB7XG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgaW5wdXQ/OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmluZ1RyYWNrZXIge1xuICAgIHByaXZhdGUgRGF0YUFycmF5OiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuICAgIHB1YmxpYyBJbmZvVGV4dDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgT25MaW5lID0gMTtcbiAgICBwdWJsaWMgT25DaGFyID0gMTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gSW5mb1RleHQgdGV4dCBpbmZvIGZvciBhbGwgbmV3IHN0cmluZyB0aGF0IGFyZSBjcmVhdGVkIGluIHRoaXMgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKEluZm8/OiBzdHJpbmcgfCBTdHJpbmdUcmFja2VyRGF0YUluZm8sIHRleHQ/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBJbmZvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mbztcbiAgICAgICAgfSBlbHNlIGlmIChJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHQoSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgdGhpcy5BZGRGaWxlVGV4dCh0ZXh0LCB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhdGljIGdldCBlbXB0eUluZm8oKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXREZWZhdWx0KEluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dCkge1xuICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mby5pbmZvO1xuICAgICAgICB0aGlzLk9uTGluZSA9IEluZm8ubGluZTtcbiAgICAgICAgdGhpcy5PbkNoYXIgPSBJbmZvLmNoYXI7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERhdGFBcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBsYXN0IEluZm9UZXh0XG4gICAgICovXG4gICAgcHVibGljIGdldCBEZWZhdWx0SW5mb1RleHQoKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgaWYgKCF0aGlzLkRhdGFBcnJheS5maW5kKHggPT4geC5pbmZvKSAmJiB0aGlzLkluZm9UZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5mbzogdGhpcy5JbmZvVGV4dCxcbiAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLk9uTGluZSxcbiAgICAgICAgICAgICAgICBjaGFyOiB0aGlzLk9uQ2hhclxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5W3RoaXMuRGF0YUFycmF5Lmxlbmd0aCAtIDFdID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBmaXJzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIGdldCBTdGFydEluZm8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVswXSA/PyB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IGFzIG9uZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCBPbmVTdHJpbmcoKSB7XG4gICAgICAgIGxldCBiaWdTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBiaWdTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpZ1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IHNvIHlvdSBjYW4gY2hlY2sgaWYgaXQgZXF1YWwgb3Igbm90XG4gICAgICogdXNlIGxpa2UgdGhhdDogbXlTdHJpbmcuZXEgPT0gXCJjb29sXCJcbiAgICAgKi9cbiAgICBnZXQgZXEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGluZm8gYWJvdXQgdGhpcyB0ZXh0XG4gICAgICovXG4gICAgZ2V0IGxpbmVJbmZvKCkge1xuICAgICAgICBjb25zdCBkID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGNvbnN0IHMgPSBkLmluZm8uc3BsaXQoJzxsaW5lPicpO1xuICAgICAgICBzLnB1c2goQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzLnBvcCgpKTtcblxuICAgICAgICByZXR1cm4gYCR7cy5qb2luKCc8bGluZT4nKX06JHtkLmxpbmV9OiR7ZC5jaGFyfWA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBsZW5ndGggb2YgdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5Lmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyBjb3B5IG9mIHRoaXMgc3RyaW5nIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZSgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdEYXRhLkFkZFRleHRBZnRlcihpLnRleHQsIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQWRkQ2xvbmUoZGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICB0aGlzLkRhdGFBcnJheSA9IHRoaXMuRGF0YUFycmF5LmNvbmNhdChkYXRhLkRhdGFBcnJheSk7XG5cbiAgICAgICAgdGhpcy5zZXREZWZhdWx0KHtcbiAgICAgICAgICAgIGluZm86IGRhdGEuSW5mb1RleHQsXG4gICAgICAgICAgICBsaW5lOiBkYXRhLk9uTGluZSxcbiAgICAgICAgICAgIGNoYXI6IGRhdGEuT25DaGFyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IGFueSB0aGluZyB0byBjb25uZWN0XG4gICAgICogQHJldHVybnMgY29ubmN0ZWQgc3RyaW5nIHdpdGggYWxsIHRoZSB0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb25jYXQoLi4udGV4dDogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dCkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIGNsb25lIHBsdXMgdGhlIG5ldyBkYXRhIGNvbm5lY3RlZFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZVBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZ1RyYWNrZXIuY29uY2F0KHRoaXMuQ2xvbmUoKSwgLi4uZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmluZyBvciBhbnkgZGF0YSB0byB0aGlzIHN0cmluZ1xuICAgICAqIEBwYXJhbSBkYXRhIGNhbiBiZSBhbnkgdGhpbmdcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyAobm90IG5ldyBzdHJpbmcpXG4gICAgICovXG4gICAgcHVibGljIFBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0aW5mbyA9IGkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSwgbGFzdGluZm8uaW5mbywgbGFzdGluZm8ubGluZSwgbGFzdGluZm8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5zIG90IG90aGVyIGRhdGEgd2l0aCAnVGVtcGxhdGUgbGl0ZXJhbHMnXG4gICAgICogdXNlZCBsaWtlIHRoaXM6IG15U3RyaW4uJFBsdXMgYHRoaXMgdmVyeSR7Y29vbFN0cmluZ30hYFxuICAgICAqIEBwYXJhbSB0ZXh0cyBhbGwgdGhlIHNwbGl0ZWQgdGV4dFxuICAgICAqIEBwYXJhbSB2YWx1ZXMgYWxsIHRoZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyQodGV4dHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgYW55KVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0VmFsdWU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dHNbaV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcblxuICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dCwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcodmFsdWUpLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHRzW3RleHRzLmxlbmd0aCAtIDFdLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBzdHJpbmcgdG8gYWRkXG4gICAgICogQHBhcmFtIGFjdGlvbiB3aGVyZSB0byBhZGQgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gaW5mbyBpbmZvIHRoZSBjb21lIHdpdGggdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQWRkVGV4dEFjdGlvbih0ZXh0OiBzdHJpbmcsIGFjdGlvbjogXCJwdXNoXCIgfCBcInVuc2hpZnRcIiwgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8sIExpbmVDb3VudCA9IDAsIENoYXJDb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlOiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIGRhdGFTdG9yZS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5EYXRhQXJyYXlbYWN0aW9uXSguLi5kYXRhU3RvcmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlcih0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwicHVzaFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmcgd2l0aG91dCB0cmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXJOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nLCBpbmZvID0gJycpIHtcbiAgICAgICAgY29uc3QgY29weSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgY29weS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkudW5zaGlmdCguLi5jb3B5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIFRleHQgRmlsZSBUcmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHByaXZhdGUgQWRkRmlsZVRleHQodGV4dDogc3RyaW5nLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbykge1xuICAgICAgICBsZXQgTGluZUNvdW50ID0gMSwgQ2hhckNvdW50ID0gMTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2ltcGxlIG1ldGhvZiB0byBjdXQgc3RyaW5nXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgbmV3IGN1dHRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEN1dFN0cmluZyhzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcblxuICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5ID0gbmV3U3RyaW5nLkRhdGFBcnJheS5jb25jYXQodGhpcy5EYXRhQXJyYXkuc2xpY2Uoc3RhcnQsIGVuZCkpXG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG4gICAgICAgIGxldCB0aGlzU3Vic3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIHdoaWxlICgobGltaXQgPT0gbnVsbCB8fCBjb3VudGVyIDwgbGltaXQpICYmIGhhc01hdGg/LlswXT8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBbLi4uaGFzTWF0aFswXV0ubGVuZ3RoLCBpbmRleCA9IHRoaXNTdWJzdHJpbmcuY2hhckxlbmd0aChoYXNNYXRoLmluZGV4KTtcbiAgICAgICAgICAgIGFsbFNwbGl0LnB1c2goe1xuICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCArIGFkZE5leHQsXG4gICAgICAgICAgICAgICAgbGVuZ3RoXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFpblRleHQgPSBtYWluVGV4dC5zbGljZShoYXNNYXRoLmluZGV4ICsgaGFzTWF0aFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpc1N1YnN0cmluZyA9IHRoaXNTdWJzdHJpbmcuQ3V0U3RyaW5nKGluZGV4ICsgbGVuZ3RoKTtcbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGpvaW4oYXJyOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBsZXQgYWxsID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgYXJyKXtcbiAgICAgICAgICAgIGFsbC5BZGRDbG9uZShpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXBsYWNlckFzeW5jKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhhd2FpdCBmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIHB1YmxpYyBvcmlnaW5hbFBvc2l0aW9uRm9yKGxpbmU6bnVtYmVyLCBjb2x1bW46bnVtYmVyKXtcbiAgICAgICAgbGV0IHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSk7XG4gICAgICAgIGlmIChzZWFyY2hMaW5lLnN0YXJ0c1dpdGgoJy8vJykpIHtcbiAgICAgICAgICAgIHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uc2VhcmNoTGluZS5hdChjb2x1bW4tMSkuRGVmYXVsdEluZm9UZXh0LFxuICAgICAgICAgICAgc2VhcmNoTGluZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBlcnJvciBpbmZvIGZvcm0gZXJyb3IgbWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBkZWJ1Z0xpbmUoeyBtZXNzYWdlLCB0ZXh0LCBsb2NhdGlvbiwgbGluZSwgY29sfTogeyBtZXNzYWdlPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBsb2NhdGlvbj86IHsgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgbGluZVRleHQ/OiBzdHJpbmcgfSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyfSk6IHN0cmluZyB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5vcmlnaW5hbFBvc2l0aW9uRm9yKGxpbmUgPz8gbG9jYXRpb24/LmxpbmUgPz8gMSwgY29sID8/IGxvY2F0aW9uPy5jb2x1bW4gPz8gMClcblxuICAgICAgICByZXR1cm4gYCR7dGV4dCB8fCBtZXNzYWdlfSwgb24gZmlsZSAtPlxcbiR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrZGF0YS5zZWFyY2hMaW5lLmV4dHJhY3RJbmZvKCl9OiR7ZGF0YS5saW5lfToke2RhdGEuY2hhcn0ke2xvY2F0aW9uPy5saW5lVGV4dCA/ICdcXG5MaW5lOiBcIicgKyBsb2NhdGlvbi5saW5lVGV4dC50cmltKCkgKyAnXCInOiAnJ31gO1xuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdXaXRoVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gb3V0cHV0V2l0aE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uKVxuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgICAgIHJldHVybiBvdXRwdXRNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbiwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpXG4gICAgfVxufSIsICJpbXBvcnQge3Byb21pc2VzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmNvbnN0IGxvYWRQYXRoID0gdHlwZW9mIGVzYnVpbGQgIT09ICd1bmRlZmluZWQnID8gJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvJzogJy8uLi8nO1xuY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwgKyBsb2FkUGF0aCArICdidWlsZC53YXNtJykpKTtcbmNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG5jb25zdCB3YXNtID0gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5sZXQgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldFVpbnQ4TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQ4TWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQ4TWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RW5jb2RlciA6IFRleHRFbmNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgbFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbShwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXIodGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXIocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxubGV0IGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRJbnQzMk1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRJbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRJbnQzMk1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dERlY29kZXIgOiBUZXh0RGVjb2RlcjtcblxubGV0IGNhY2hlZFRleHREZWNvZGVyID0gbmV3IGxUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG4vKipcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2Vycm9ycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5nZXRfZXJyb3JzKHJldHB0cik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gYmxvY2tcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfYmxvY2sodGV4dCwgYmxvY2spIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGJsb2NrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfYmxvY2socHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSBza2lwX3NwZWNpYWxfdGFnXG4qIEBwYXJhbSB7c3RyaW5nfSBzaW1wbGVfc2tpcFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfY29tcG9uZW50KHNraXBfc3BlY2lhbF90YWcsIHNpbXBsZV9za2lwKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChza2lwX3NwZWNpYWxfdGFnLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzaW1wbGVfc2tpcCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHdhc20uaW5zZXJ0X2NvbXBvbmVudChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgZW5kX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZF90eXBlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfZGVmKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gcV90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX3EodGV4dCwgcV90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfcShwdHIwLCBsZW4wLCBxX3R5cGUuY29kZVBvaW50QXQoMCkpO1xuICAgIHJldHVybiByZXQgPj4+IDA7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanModGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanNfbWluKHRleHQsIG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKG5hbWUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzX21pbihyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZWpzX3BhcnNlKHRleHQsIHN0YXJ0LCBlbmQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHN0YXJ0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMiA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5lanNfcGFyc2UocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwdHIyLCBsZW4yKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHBhZ2VfYmFzZV9wYXJzZXIodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucGFnZV9iYXNlX3BhcnNlcihyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gaHRtbF9hdHRyX3BhcnNlcih0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5odG1sX2F0dHJfcGFyc2VyKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbiIsICJleHBvcnQgY29uc3QgU2ltcGxlU2tpcCA9IFsndGV4dGFyZWEnLCdzY3JpcHQnLCAnc3R5bGUnXTtcbmV4cG9ydCBjb25zdCBTa2lwU3BlY2lhbFRhZyA9IFtbXCIlXCIsIFwiJVwiXSwgW1wiI3tkZWJ1Z31cIiwgXCJ7ZGVidWd9I1wiXV07IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IGZpbmRfZW5kX29mX2RlZiwgZmluZF9lbmRfb2ZfcSwgZmluZF9lbmRfYmxvY2sgfSBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzJztcbmltcG9ydCB7IGdldERpcm5hbWUsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgd29ya2VyUG9vbCBmcm9tICd3b3JrZXJwb29sJztcbmltcG9ydCB7IGNwdXMgfSBmcm9tICdvcyc7XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmV4cG9ydCBjb25zdCBwb29sID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC93b3JrZXJJbnNlcnRDb21wb25lbnQuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGNsYXNzIEJhc2VSZWFkZXIge1xuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIGVuZCBvZiBxdW90YXRpb24gbWFya3MsIHNraXBwaW5nIHRoaW5ncyBsaWtlIGVzY2FwaW5nOiBcIlxcXFxcIlwiXG4gICAgICogQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIGZpbmRFbnRPZlEodGV4dDogc3RyaW5nLCBxVHlwZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX29mX3EodGV4dCwgcVR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgY2hhciBza2lwcGluZyBkYXRhIGluc2lkZSBxdW90YXRpb24gbWFya3NcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVuZE9mRGVmKHRleHQ6IHN0cmluZywgRW5kVHlwZTogc3RyaW5nW10gfCBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoRW5kVHlwZSkpIHtcbiAgICAgICAgICAgIEVuZFR5cGUgPSBbRW5kVHlwZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfZGVmKHRleHQsIEpTT04uc3RyaW5naWZ5KEVuZFR5cGUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYW1lIGFzICdmaW5kRW5kT2ZEZWYnIG9ubHkgd2l0aCBvcHRpb24gdG8gY3VzdG9tICdvcGVuJyBhbmQgJ2Nsb3NlJ1xuICAgICAqIGBgYGpzXG4gICAgICogRmluZEVuZE9mQmxvY2soYGNvb2wgXCJ9XCIgeyBkYXRhIH0gfSBuZXh0YCwgJ3snLCAnfScpXG4gICAgICogYGBgXG4gICAgICogaXQgd2lsbCByZXR1cm4gdGhlIDE4IC0+IFwifSBuZXh0XCJcbiAgICAgKiAgQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIEZpbmRFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgb3Blbjogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9ibG9jayh0ZXh0LCBvcGVuICsgZW5kKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnNlcnRDb21wb25lbnRCYXNlIHtcbiAgICBTaW1wbGVTa2lwOiBzdHJpbmdbXSA9IFNldHRpbmdzLlNpbXBsZVNraXA7XG4gICAgU2tpcFNwZWNpYWxUYWc6IHN0cmluZ1tdW10gPSBTZXR0aW5ncy5Ta2lwU3BlY2lhbFRhZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbnROZXc/OiBhbnkpIHsgfVxuXG4gICAgcHJpdmF0ZSBwcmludEVycm9ycyh0ZXh0OiBTdHJpbmdUcmFja2VyLCBlcnJvcnM6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMucHJpbnROZXcpIHJldHVybjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgSlNPTi5wYXJzZShlcnJvcnMpLnJldmVyc2UoKSkge1xuICAgICAgICAgICAgdGhpcy5wcmludE5ldyh7XG4gICAgICAgICAgICAgICAgdGV4dDogYFxcbldhcm5pbmcsIHlvdSBkaWRuJ3Qgd3JpdGUgcmlnaHQgdGhpcyB0YWc6IFwiJHtpLnR5cGVfbmFtZX1cIiwgdXNlZCBpbjogJHt0ZXh0LmF0KE51bWJlcihpLmluZGV4KSkubGluZUluZm99XFxuKHRoZSBzeXN0ZW0gd2lsbCBhdXRvIGNsb3NlIGl0KWAsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNsb3NlLXRhZ1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXInLCBbdGV4dC5lcSwgU2VhcmNoXSk7XG4gICAgICAgIHRoaXMucHJpbnRFcnJvcnModGV4dCwgZXJyb3JzKTtcblxuICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXJIVE1MKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhckhUTUwnLCBbdGV4dC5lcSwgU2VhcmNoXSk7XG4gICAgICAgIHRoaXMucHJpbnRFcnJvcnModGV4dCwgZXJyb3JzKTtcblxuICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgfVxufVxuXG50eXBlIFBhcnNlQmxvY2tzID0geyBuYW1lOiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyIH1bXVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKUyh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFBhcnNlQmxvY2tzPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTJywgW3RleHRdKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTTWluaSh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyW10+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlNNaW5pJywgW3RleHQsZmluZF0pKTtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRUpTUGFyc2VyKHRleHQ6IHN0cmluZywgc3RhcnQ6IHN0cmluZywgZW5kOiBzdHJpbmcpOiBQcm9taXNlPFBhcnNlQmxvY2tzPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdFSlNQYXJzZXInLCBbdGV4dCwgc3RhcnQsIGVuZF0pKTtcbn0iLCAiXG5pbXBvcnQgd29ya2VyUG9vbCBmcm9tICd3b3JrZXJwb29sJztcbmltcG9ydCB7IGNwdXMgfSBmcm9tICdvcyc7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuXG5pbnRlcmZhY2UgU3BsaXRUZXh0IHtcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgdHlwZV9uYW1lOiBzdHJpbmcsXG4gICAgaXNfc2tpcDogYm9vbGVhblxufVxuXG5jb25zdCBjcHVMZW5ndGggPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGNwdXMoKS5sZW5ndGggLyAyKSk7XG5jb25zdCBwYXJzZV9zdHJlYW0gPSB3b3JrZXJQb29sLnBvb2woU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL3dhc20vcmVhZGVyL3dvcmtlci5qcycsIHsgbWF4V29ya2VyczogY3B1TGVuZ3RoIH0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUGFyc2VUZXh0U3RyZWFtKHRleHQ6IHN0cmluZyk6IFByb21pc2U8U3BsaXRUZXh0W10+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnYnVpbGRfc3RyZWFtJywgW3RleHRdKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkRlZlNraXBCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdmaW5kX2VuZF9vZl9kZWZfc2tpcF9ibG9jaycsIFt0ZXh0LCBKU09OLnN0cmluZ2lmeSh0eXBlcyldKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZW5kX29mX2Jsb2NrJywgW3RleHQsIHR5cGVzLmpvaW4oJycpXSk7XG59XG5cbmFic3RyYWN0IGNsYXNzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBSZXBsYWNlQWxsKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG5ld1RleHQgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dC5zcGxpdChmaW5kKSkge1xuICAgICAgICAgICAgbmV3VGV4dCArPSByZXBsYWNlICsgaTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdUZXh0LnN1YnN0cmluZyhyZXBsYWNlLmxlbmd0aCk7XG4gICAgfVxufVxuXG5cbmFic3RyYWN0IGNsYXNzIFJlQnVpbGRDb2RlQmFzaWMgZXh0ZW5kcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgcHVibGljIFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdO1xuXG4gICAgY29uc3RydWN0b3IoUGFyc2VBcnJheTogU3BsaXRUZXh0W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5QYXJzZUFycmF5ID0gUGFyc2VBcnJheTtcbiAgICB9XG5cbiAgICBCdWlsZENvZGUoKSB7XG4gICAgICAgIGxldCBPdXRTdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIE91dFN0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5SZXBsYWNlQWxsKE91dFN0cmluZywgJzx8LXw+JywgJzx8fD4nKTtcbiAgICB9XG59XG5cblxudHlwZSBEYXRhQ29kZUluZm8gPSB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGlucHV0czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGNsYXNzIFJlQnVpbGRDb2RlU3RyaW5nIGV4dGVuZHMgUmVCdWlsZENvZGVCYXNpYyB7XG4gICAgcHJpdmF0ZSBEYXRhQ29kZTogRGF0YUNvZGVJbmZvO1xuXG4gICAgY29uc3RydWN0b3IoUGFyc2VBcnJheTogU3BsaXRUZXh0W10pIHtcbiAgICAgICAgc3VwZXIoUGFyc2VBcnJheSk7XG4gICAgICAgIHRoaXMuRGF0YUNvZGUgPSB7IHRleHQ6IFwiXCIsIGlucHV0czogW10gfTtcbiAgICAgICAgdGhpcy5DcmVhdGVEYXRhQ29kZSgpO1xuICAgIH1cblxuICAgIGdldCBDb2RlQnVpbGRUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS50ZXh0O1xuICAgIH1cblxuICAgIHNldCBDb2RlQnVpbGRUZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBBbGxJbnB1dHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLmlucHV0cztcbiAgICB9XG5cbiAgICBwcml2YXRlIENyZWF0ZURhdGFDb2RlKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19za2lwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGA8fCR7dGhpcy5EYXRhQ29kZS5pbnB1dHMubGVuZ3RofXwke2kudHlwZV9uYW1lID8/ICcnfXw+YDtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLmlucHV0cy5wdXNoKGkudGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpZiB0aGUgPHx8PiBzdGFydCB3aXRoIGEgKCsuKSBsaWtlIHRoYXQgZm9yIGV4YW1wbGUsIFwiKy48fHw+XCIsIHRoZSB1cGRhdGUgZnVuY3Rpb24gd2lsbCBnZXQgdGhlIGxhc3QgXCJTa2lwVGV4dFwiIGluc3RlYWQgZ2V0dGluZyB0aGUgbmV3IG9uZVxuICAgICAqIHNhbWUgd2l0aCBhICgtLikganVzdCBmb3IgaWdub3JpbmcgY3VycmVudCB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHRoZSBidWlsZGVkIGNvZGVcbiAgICAgKi9cbiAgICBCdWlsZENvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuRGF0YUNvZGUudGV4dC5yZXBsYWNlKC88XFx8KFswLTldKylcXHxbXFx3XSpcXHw+L2dpLCAoXywgZzEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLmlucHV0c1tnMV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5SZXBsYWNlQWxsKG5ld1N0cmluZywgJzx8LXw+JywgJzx8fD4nKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQmFzZVJlYWRlciwgRUpTUGFyc2VyIH0gZnJvbSAnLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBQYXJzZVRleHRTdHJlYW0sIFJlQnVpbGRDb2RlU3RyaW5nIH0gZnJvbSAnLi90cmFuc2Zvcm0vRWFzeVNjcmlwdCc7XG5cbmludGVyZmFjZSBKU1BhcnNlclZhbHVlcyB7XG4gICAgdHlwZTogJ3RleHQnIHwgJ3NjcmlwdCcgfCAnbm8tdHJhY2snLFxuICAgIHRleHQ6IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNQYXJzZXIge1xuICAgIHB1YmxpYyBzdGFydDogc3RyaW5nO1xuICAgIHB1YmxpYyB0ZXh0OiBTdHJpbmdUcmFja2VyO1xuICAgIHB1YmxpYyBlbmQ6IHN0cmluZztcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBwYXRoOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlczogSlNQYXJzZXJWYWx1ZXNbXTtcblxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgc3RhcnQgPSBcIjwlXCIsIGVuZCA9IFwiJT5cIiwgdHlwZSA9ICdzY3JpcHQnKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgUmVwbGFjZVZhbHVlcyhmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLnRleHQucmVwbGFjZUFsbChmaW5kLCByZXBsYWNlKTtcbiAgICB9XG5cbiAgICBmaW5kRW5kT2ZEZWZHbG9iYWwodGV4dDogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBlcSA9IHRleHQuZXFcbiAgICAgICAgY29uc3QgZmluZCA9IEJhc2VSZWFkZXIuZmluZEVuZE9mRGVmKGVxLCBbJzsnLCAnXFxuJywgdGhpcy5lbmRdKTtcbiAgICAgICAgcmV0dXJuIGZpbmQgIT0gLTEgPyBmaW5kICsgMSA6IGVxLmxlbmd0aDtcbiAgICB9XG5cbiAgICBTY3JpcHRXaXRoSW5mbyh0ZXh0OiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IFdpdGhJbmZvID0gbmV3IFN0cmluZ1RyYWNrZXIodGV4dC5TdGFydEluZm8pO1xuXG4gICAgICAgIGNvbnN0IGFsbFNjcmlwdCA9IHRleHQuc3BsaXQoJ1xcbicpLCBsZW5ndGggPSBhbGxTY3JpcHQubGVuZ3RoO1xuICAgICAgICAvL25ldyBsaW5lIGZvciBkZWJ1ZyBhcyBuZXcgbGluZSBzdGFydFxuICAgICAgICBXaXRoSW5mby5QbHVzKCdcXG4nKTtcblxuICAgICAgICAvL2ZpbGUgbmFtZSBpbiBjb21tZW50XG4gICAgICAgIGxldCBjb3VudCA9IDE7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxTY3JpcHQpIHtcblxuICAgICAgICAgICAgaWYoaS5lcS50cmltKCkubGVuZ3RoKVxuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGAvLyEke2kubGluZUluZm99XFxuYCksXG4gICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmIChjb3VudCAhPSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBXaXRoSW5mby5QbHVzKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFdpdGhJbmZvO1xuICAgIH1cblxuICAgIGFzeW5jIGZpbmRTY3JpcHRzKCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBFSlNQYXJzZXIodGhpcy50ZXh0LmVxLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgbGV0IHN1YnN0cmluZyA9IHRoaXMudGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBpLm5hbWU7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGUoJHtzdWJzdHJpbmd9KTtgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlc2NhcGVcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZVNhZmUoJHtzdWJzdHJpbmd9KTtgO1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWJ1Z1wiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYFxcbnJ1bl9zY3JpcHRfbmFtZSA9IFxcYCR7SlNQYXJzZXIuZml4VGV4dChzdWJzdHJpbmcpfVxcYDtgXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnbm8tdHJhY2snO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogc3Vic3RyaW5nLFxuICAgICAgICAgICAgICAgIHR5cGU6IDxhbnk+dHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dCh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL2AvZ2ksICdcXFxcYCcpLnJlcGxhY2UoL1xcdTAwMjQvZ2ksICdcXFxcdTAwMjQnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dFNpbXBsZVF1b3Rlcyh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKTtcbiAgICB9XG5cbiAgICBSZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgY29uc3QgYWxsY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkudHlwZSA9PSAnbm8tdHJhY2snKSB7XG4gICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKHRoaXMuc3RhcnQsICchJywgaS50ZXh0LCB0aGlzLmVuZCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKHRoaXMuc3RhcnQsIGkudGV4dCwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbGNvZGU7XG4gICAgfVxuXG4gICAgQnVpbGRBbGwoaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBydW5TY3JpcHQgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcblxuICAgICAgICBpZiAoIXRoaXMudmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzJGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpc0RlYnVnICYmIGkudHlwZSA9PSAnc2NyaXB0Jykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBcXG5ydW5fc2NyaXB0X2NvZGU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2ApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TY3JpcHRXaXRoSW5mbyhpLnRleHQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoaS50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcHJpbnRFcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+JHtKU1BhcnNlci5maXhUZXh0KG1lc3NhZ2UpfTwvcD5gO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBSdW5BbmRFeHBvcnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcih0ZXh0LCBwYXRoKVxuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5CdWlsZEFsbChpc0RlYnVnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzcGxpdDJGcm9tRW5kKHRleHQ6IHN0cmluZywgc3BsaXRDaGFyOiBzdHJpbmcsIG51bVRvU3BsaXRGcm9tRW5kID0gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGV4dC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT0gc3BsaXRDaGFyKSB7XG4gICAgICAgICAgICAgICAgbnVtVG9TcGxpdEZyb21FbmQtLTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG51bVRvU3BsaXRGcm9tRW5kID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3RleHQuc3Vic3RyaW5nKDAsIGkpLCB0ZXh0LnN1YnN0cmluZyhpICsgMSldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcbiAgICB9XG59XG5cblxuLy9idWlsZCBzcGVjaWFsIGNsYXNzIGZvciBwYXJzZXIgY29tbWVudHMgLyoqLyBzbyB5b3UgYmUgYWJsZSB0byBhZGQgUmF6b3IgaW5zaWRlIG9mIHN0eWxlIG90IHNjcmlwdCB0YWdcblxuaW50ZXJmYWNlIEdsb2JhbFJlcGxhY2VBcnJheSB7XG4gICAgdHlwZTogJ3NjcmlwdCcgfCAnbm8tdHJhY2snLFxuICAgIHRleHQ6IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGNsYXNzIEVuYWJsZUdsb2JhbFJlcGxhY2Uge1xuICAgIHByaXZhdGUgc2F2ZWRCdWlsZERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheVtdID0gW107XG4gICAgcHJpdmF0ZSBidWlsZENvZGU6IFJlQnVpbGRDb2RlU3RyaW5nO1xuICAgIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVwbGFjZXI6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRkVGV4dCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlciA9IFJlZ0V4cChgJHthZGRUZXh0fVxcXFwvXFxcXCohc3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5cXFxcKlxcXFwvfHN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+YCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5idWlsZENvZGUgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcoYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGF3YWl0IHRoaXMuRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGUpKSk7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBFeHRyYWN0QW5kU2F2ZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29kZSA9IG5ldyBKU1BhcnNlcihjb2RlLCB0aGlzLnBhdGgpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29kZS5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29kZS52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRCdWlsZERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGkudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBgc3lzdGVtLS08fGVqc3wke2NvdW50ZXIrK318PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFBhcnNlT3V0c2lkZU9mQ29tbWVudCh0ZXh0OiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2VyKC9zeXN0ZW0tLTxcXHxlanNcXHwoWzAtOV0pXFx8Pi8sIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBTcGxpdFRvUmVwbGFjZVsxXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihpbmRleC5TdGFydEluZm8pLlBsdXMkYCR7dGhpcy5hZGRUZXh0fS8qIXN5c3RlbS0tPHxlanN8JHtpbmRleH18PiovYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIFN0YXJ0QnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb21tZW50cyA9IG5ldyBKU1BhcnNlcihuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0KSwgdGhpcy5wYXRoLCAnLyonLCAnKi8nKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvbW1lbnRzLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb21tZW50cy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gdGhpcy5QYXJzZU91dHNpZGVPZkNvbW1lbnQoaS50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQgPSBleHRyYWN0Q29tbWVudHMuUmVCdWlsZFRleHQoKS5lcTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2RlLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVzdG9yZUFzQ29kZShEYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKERhdGEudGV4dC5TdGFydEluZm8pLlBsdXMkYDwlJHtEYXRhLnR5cGUgPT0gJ25vLXRyYWNrJyA/ICchJzogJyd9JHtEYXRhLnRleHR9JT5gO1xuICAgIH1cblxuICAgIHB1YmxpYyBSZXN0b3JlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2VyKHRoaXMucmVwbGFjZXIsIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIoU3BsaXRUb1JlcGxhY2VbMV0gPz8gU3BsaXRUb1JlcGxhY2VbMl0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5SZXN0b3JlQXNDb2RlKHRoaXMuc2F2ZWRCdWlsZERhdGFbaW5kZXhdKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBtaW5pZnkgfSBmcm9tICdAc3djL2NvcmUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi9wcmludE1lc3NhZ2UnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlKUyh0ZXh0OiBzdHJpbmcsIHRyYWNrZXI6IFN0cmluZ1RyYWNrZXIpe1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgbWluaWZ5KHRleHQpKS5jb2RlXG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKHRyYWNrZXIsIGVycilcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU1dDRXJyb3IoZXJyOiB7bWVzc2FnZTogc3RyaW5nLCBzdGFjazogc3RyaW5nLCBjb2RlOiBzdHJpbmd9LCBjaGFuZ2VMb2NhdGlvbnMgPSAobGluZTogbnVtYmVyLCBjaGFyOiBudW1iZXIsIGluZm86IHN0cmluZykgPT4ge3JldHVybiB7bGluZSwgY2hhciwgaW5mb319KXtcbiAgICBjb25zdCBzcGxpdERhdGE6c3RyaW5nW10gPSBlcnIuc3RhY2sudHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBlcnJvckZpbGVBc0luZGV4ID0gc3BsaXREYXRhLnJldmVyc2UoKS5maW5kSW5kZXgoKHg6c3RyaW5nKSA9PiB4LmluY2x1ZGVzKCcvLyEnKSlcblxuICAgIGlmKGVycm9yRmlsZUFzSW5kZXggPT0gLTEpe1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgvKDtbMC05XW0pKC4qPylcXFswbTooWzAtOV0rKTooWzAtOV0rKVxcXS8sIChfLCBzdGFydCwgZmlsZSwgZzEsIGcyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBjaGFuZ2VMb2NhdGlvbnMoTnVtYmVyKGcxKSwgTnVtYmVyKGcyKSwgZmlsZSlcbiAgICAgICAgICAgIHJldHVybiBgJHtzdGFydH0ke2luZm99OiR7bGluZX06JHtjaGFyfV1gXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogZXJyLmNvZGUsXG4gICAgICAgICAgICBlcnJvckxpbmVzOiBzcGxpdERhdGFbMF0sXG4gICAgICAgICAgICBlcnJvckZpbGU6IHNwbGl0RGF0YVswXSxcbiAgICAgICAgICAgIHNpbXBsZU1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICBmdWxsTWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JGaWxlID0gc3BsaXREYXRhW2Vycm9yRmlsZUFzSW5kZXhdLnNwbGl0KCcvLyEnKS5wb3AoKVxuICAgIGNvbnN0IGVycm9yTGluZXMgPSBzcGxpdERhdGEuc2xpY2Uoc3BsaXREYXRhLmxlbmd0aCAtIGVycm9yRmlsZUFzSW5kZXgsIC0gMykubWFwKHggPT4gIHguc3Vic3RyaW5nKHguaW5kZXhPZignXHUyNTAyJykrMSkpLmpvaW4oJ1xcbicpO1xuXG4gICAgbGV0IGVycm9yQ29kZTpzdHJpbmcgPSBzcGxpdERhdGEuYXQoLTIpO1xuICAgIGVycm9yQ29kZSA9IGVycm9yQ29kZS5zdWJzdHJpbmcoZXJyb3JDb2RlLmluZGV4T2YoJ2AnKSkuc3BsaXQoJ1swbScpLnNoaWZ0KCkudHJpbSgpO1xuXG4gICAgY29uc3QgZGF0YUVycm9yID0ge1xuICAgICAgICBnZXQgc2ltcGxlTWVzc2FnZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGAke2RhdGFFcnJvci5lcnJvckNvZGV9LCBvbiBmaWxlIC0+XFxuJHtkYXRhRXJyb3IuZXJyb3JGaWxlfWBcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZ1bGxNZXNzYWdlKCl7XG4gICAgICAgICAgICByZXR1cm4gYCR7ZGF0YUVycm9yLnNpbXBsZU1lc3NhZ2V9XFxuTGluZXM6ICR7ZGF0YUVycm9yLmVycm9yTGluZXN9YFxuICAgICAgICB9LFxuICAgICAgICBlcnJvckZpbGUsXG4gICAgICAgIGVycm9yTGluZXMsXG4gICAgICAgIGVycm9yQ29kZVxuICAgIH1cbiAgICByZXR1cm4gZGF0YUVycm9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvcihlcnI6IGFueSkge1xuICAgIGNvbnN0IHBhcnNlRXJyb3IgPSBwYXJzZVNXQ0Vycm9yKGVycik7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgIHRleHQ6IHBhcnNlRXJyb3IuZnVsbE1lc3NhZ2VcbiAgICB9KTtcbiAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICByZXR1cm4gcGFyc2VFcnJvcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwKGVycjogYW55LCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgc291cmNlRmlsZT86IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcCk7XG4gICAgXG4gICAgY29uc3QgcGFyc2VFcnJvciA9IHBhcnNlU1dDRXJyb3IoZXJyLCAobGluZSwgY29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcih7bGluZSwgY29sdW1ufSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbmU6IHBvc2l0aW9uLmxpbmUsXG4gICAgICAgICAgICBjaGFyOiBwb3NpdGlvbi5jb2x1bW4sXG4gICAgICAgICAgICBpbmZvOiBzb3VyY2VGaWxlID8/IHBvc2l0aW9uLnNvdXJjZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgdGV4dDogcGFyc2VFcnJvci5mdWxsTWVzc2FnZVxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgIHJldHVybiBwYXJzZUVycm9yO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwgZXJyOiBhbnkpIHtcblxuICAgIGNvbnN0IHBhcnNlRXJyb3IgPSBwYXJzZVNXQ0Vycm9yKGVyciwgKGxpbmUsIGNvbHVtbiwgaW5mbykgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGJhc2Uub3JpZ2luYWxQb3NpdGlvbkZvcihsaW5lLCBjb2x1bW4pXG4gICAgICAgIHJldHVybiA8YW55PntcbiAgICAgICAgICAgIC4uLnBvc2l0aW9uLFxuICAgICAgICAgICAgaW5mbzogcG9zaXRpb24uc2VhcmNoTGluZS5leHRyYWN0SW5mbygpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICB0ZXh0OiBwYXJzZUVycm9yLmZ1bGxNZXNzYWdlXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgcmV0dXJuIHBhcnNlRXJyb3I7XG59XG5cbiIsICJleHBvcnQgaW50ZXJmYWNlIFByZXZlbnRMb2cge1xuICAgIGlkPzogc3RyaW5nLFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBlcnJvck5hbWU6IHN0cmluZyxcbiAgICB0eXBlPzogXCJ3YXJuXCIgfCBcImVycm9yXCJcbn1cblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzOiB7UHJldmVudEVycm9yczogc3RyaW5nW119ID0ge1xuICAgIFByZXZlbnRFcnJvcnM6IFtdXG59XG5cbmNvbnN0IFByZXZlbnREb3VibGVMb2c6IHN0cmluZ1tdID0gW107XG5cbmV4cG9ydCBjb25zdCBDbGVhcldhcm5pbmcgPSAoKSA9PiBQcmV2ZW50RG91YmxlTG9nLmxlbmd0aCA9IDA7XG5cbi8qKlxuICogSWYgdGhlIGVycm9yIGlzIG5vdCBpbiB0aGUgUHJldmVudEVycm9ycyBhcnJheSwgcHJpbnQgdGhlIGVycm9yXG4gKiBAcGFyYW0ge1ByZXZlbnRMb2d9ICAtIGBpZGAgLSBUaGUgaWQgb2YgdGhlIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmV3UHJpbnQoe2lkLCB0ZXh0LCB0eXBlID0gXCJ3YXJuXCIsIGVycm9yTmFtZX06IFByZXZlbnRMb2cpIHtcbiAgICBpZighUHJldmVudERvdWJsZUxvZy5pbmNsdWRlcyhpZCA/PyB0ZXh0KSAmJiAhU2V0dGluZ3MuUHJldmVudEVycm9ycy5pbmNsdWRlcyhlcnJvck5hbWUpKXtcbiAgICAgICAgUHJldmVudERvdWJsZUxvZy5wdXNoKGlkID8/IHRleHQpO1xuICAgICAgICByZXR1cm4gW3R5cGUgPT0gJ2Vycm9yJyA/ICdpbXBvcnRhbnQnOiB0eXBlLCAodGV4dC5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJykgKyBgXFxuXFxuRXJyb3ItQ29kZTogJHtlcnJvck5hbWV9XFxuXFxuYCldO1xuICAgIH1cbiAgICByZXR1cm4gW1wiZG8tbm90aGluZ1wiXVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IG1pbmlmeUpTIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9taW5pZnknO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuY29uc3Qgc2VydmVTY3JpcHQgPSAnL3NlcnYvdGVtcC5qcyc7XG5cbmFzeW5jIGZ1bmN0aW9uIHRlbXBsYXRlKEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZTogQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlLCBuYW1lOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBwYXJhbXM6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIHNlbGVjdG9yOiBzdHJpbmcsIG1haW5Db2RlOiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IEpTUGFyc2VyLlJ1bkFuZEV4cG9ydChtYWluQ29kZSwgcGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyQgYGZ1bmN0aW9uICR7bmFtZX0oeyR7cGFyYW1zfX0sIHNlbGVjdG9yJHtzZWxlY3RvciA/IGAgPSBcIiR7c2VsZWN0b3J9XCJgOiAnJ30sIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke2F3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSl9XG4gICAgICAgIHZhciBleHBvcnRzID0gJHtuYW1lfS5leHBvcnRzO1xuICAgICAgICByZXR1cm4gc2VuZFRvU2VsZWN0b3Ioc2VsZWN0b3IsIG91dF9ydW5fc2NyaXB0LnRleHQpO1xuICAgIH1cXG4ke25hbWV9LmV4cG9ydHMgPSB7fTtgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwge2FzeW5jOiBudWxsfSk7XG5cbiAgICBsZXQgc2NyaXB0SW5mbyA9IGF3YWl0IHRlbXBsYXRlKFxuICAgICAgICBzZXNzaW9uSW5mby5CdWlsZFNjcmlwdFdpdGhQcmFtcyxcbiAgICAgICAgZGF0YVRhZy5wb3BBbnlUcmFja2VyKCduYW1lJywgJ2Nvbm5lY3QnKSxcbiAgICAgICAgZGF0YVRhZy5wb3BBbnlUcmFja2VyKCdwYXJhbXMnLCAnJyksXG4gICAgICAgIGRhdGFUYWcucG9wQW55RGVmYXVsdCgnc2VsZWN0b3InLCAnJyksXG4gICAgICAgIEJldHdlZW5UYWdEYXRhLFxuICAgICAgICBwYXRoTmFtZSxcbiAgICAgICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgIUluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKVxuICAgICk7XG5cbiAgICBjb25zdCBhZGRTY3JpcHQgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ3NjcmlwdCcsIGRhdGFUYWcsIHR5cGUpO1xuICAgIGlmIChJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJNaW5KU1wiKSB8fCBJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJNaW5BbGxcIikpIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFRleHQoYXdhaXQgbWluaWZ5SlMoc2NyaXB0SW5mby5lcSwgQmV0d2VlblRhZ0RhdGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhZGRTY3JpcHQuYWRkU3RyaW5nVHJhY2tlcihzY3JpcHRJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4vU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG1hcCA9IHR5cGVvZiBzb3VyY2VNYXAgPT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHNvdXJjZU1hcCk6IHNvdXJjZU1hcDtcblxuICAgIGNvbnN0IHRyYWNrQ29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIGNvbnN0IHNwbGl0TGluZXMgPSB0cmFja0NvZGUuc3BsaXQoJ1xcbicpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGlzTWFwID0gc3BsaXRMaW5lc1ttLmdlbmVyYXRlZExpbmUgLSAxXTtcbiAgICAgICAgaWYgKCFpc01hcCkgcmV0dXJuO1xuXG5cbiAgICAgICAgbGV0IGNoYXJDb3VudCA9IDE7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBpc01hcC5zdWJzdHJpbmcobS5nZW5lcmF0ZWRDb2x1bW4gPyBtLmdlbmVyYXRlZENvbHVtbiAtIDE6IDApLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgICAgICBpLmluZm8gPSBtLnNvdXJjZTtcbiAgICAgICAgICAgIGkubGluZSA9IG0ub3JpZ2luYWxMaW5lO1xuICAgICAgICAgICAgaS5jaGFyID0gY2hhckNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFja0NvZGU7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlcikge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIpO1xuICAgIHJldHVybiBuZXdUcmFja2VyO1xufVxuXG5mdW5jdGlvbiBtZXJnZVNhc3NJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgZ2VuZXJhdGVkOiBTdHJpbmdUcmFja2VyLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxMaW5lcyA9IG9yaWdpbmFsLnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ2VuZXJhdGVkLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgIGlmKGl0ZW0uaW5mbyA9PSBteVNvdXJjZSl7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBvcmlnaW5hbExpbmVzW2l0ZW0ubGluZSAtIDFdLmF0KGl0ZW0uY2hhci0xKT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgICAgIGl0ZW0uaW5mbyA9IGluZm87XG4gICAgICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbS5pbmZvKSB7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgoaXRlbS5pbmZvKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja1RvT3JpZ2luYWxTc3Mob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXAsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuZXdUcmFja2VyID0gYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIHNvdXJjZU1hcCk7XG4gICAgbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIsIG15U291cmNlKTtcblxuICAgIHJldHVybiBuZXdUcmFja2VyO1xufSIsICJpbXBvcnQgeyBPcHRpb25zIGFzIFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSwgSnNjQ29uZmlnIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBDb21tb25qcywgRGVjb3JhdG9ycywgZXNUYXJnZXQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3NldHRpbmdzJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zcGlsZXJXaXRoT3B0aW9ucyhCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgbGFuZ3VhZ2U6IHN0cmluZywgc291cmNlTWFwczogYm9vbGVhbiwgQmV0d2VlblRhZ0RhdGFTdHJpbmcgPSBCZXR3ZWVuVGFnRGF0YS5lcSwgb3B0aW9ucz86IEpzY0NvbmZpZykge1xuXG4gICAgbGV0IHJlc3VsdENvZGUgPSAnJywgcmVzdWx0TWFwOiBzdHJpbmc7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0gQ29tbW9uanMoe1xuICAgICAgICBmaWxlbmFtZTogQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgbGFuZ3VhZ2UudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIHNvdXJjZU1hcHMsXG4gICAgICAgIGpzYzoge1xuICAgICAgICAgICAgdGFyZ2V0OiBlc1RhcmdldCxcbiAgICAgICAgICAgIC4uLm9wdGlvbnNcbiAgICAgICAgfSxcbiAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKVxuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIERlY29yYXRvcnMoQWRkT3B0aW9ucy5qc2MpLnBhcnNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3ludGF4OiAndHlwZXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcIlRTT3B0aW9uc1wiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmpzYy5wYXJzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ2VjbWFzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICBqc3g6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcIkpTWE9wdGlvbnNcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgRGVjb3JhdG9ycyhBZGRPcHRpb25zLmpzYykucGFyc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICBzeW50YXg6ICdlY21hc2NyaXB0JyxcbiAgICAgICAgICAgICAgICAgICAganN4OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAuLi5HZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBtYXAsIGNvZGUgfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YVN0cmluZywgQWRkT3B0aW9ucyk7XG5cbiAgICAgICAgcmVzdWx0Q29kZSA9IGNvZGU7XG4gICAgICAgIHJlc3VsdE1hcCA9IG1hcDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcmVzdWx0Q29kZSwgcmVzdWx0TWFwIH1cbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0sIEpzY0NvbmZpZyB9IGZyb20gJ0Bzd2MvY29yZSc7XG5cblxuZXhwb3J0IGNvbnN0IGVzVGFyZ2V0ID0gJ2VzMjAyMic7XG5cbmV4cG9ydCBmdW5jdGlvbiBEZWNvcmF0b3JzKGRhdGE6IEpzY0NvbmZpZyl7XG4gICAgZGF0YS50cmFuc2Zvcm0gPSB7XG4gICAgICAgIGxlZ2FjeURlY29yYXRvcjogdHJ1ZSxcbiAgICAgICAgZGVjb3JhdG9yTWV0YWRhdGE6IHRydWVcbiAgICB9XG4gICAgZGF0YS5wYXJzZXIuZGVjb3JhdG9ycyA9IHRydWVcbiAgICByZXR1cm4gZGF0YVxufVxuXG5leHBvcnQgZnVuY3Rpb24gVHJhbnNmb3JtSlNDKGRhdGE/OiBKc2NDb25maWcpOiBKc2NDb25maWd7XG4gICAgcmV0dXJuIERlY29yYXRvcnMoe1xuICAgICAgICB0YXJnZXQ6IGVzVGFyZ2V0LFxuICAgICAgICAuLi5kYXRhXG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbW1vbmpzKGRhdGE6IFRyYW5zZm9ybU9wdGlvbnMpe1xuICAgIGRhdGEubW9kdWxlID0ge1xuICAgICAgICB0eXBlOiAnY29tbW9uanMnLFxuICAgICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgICAgICBzdHJpY3RNb2RlOiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcbmltcG9ydCB7IHRyYW5zcGlsZXJXaXRoT3B0aW9ucyB9IGZyb20gJy4vbG9hZC1vcHRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBsZXQgUmVzQ29kZSA9IEJldHdlZW5UYWdEYXRhO1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZShcInNlcnZcIik7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUpO1xuXG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFeHRyYWN0ZWQgPSBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCk7XG5cbiAgICBjb25zdCB7cmVzdWx0Q29kZSwgcmVzdWx0TWFwfSA9IGF3YWl0IHRyYW5zcGlsZXJXaXRoT3B0aW9ucyhCZXR3ZWVuVGFnRGF0YSwgbGFuZ3VhZ2UsIGZhbHNlLCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCwge3ByZXNlcnZlQWxsQ29tbWVudHM6IHRydWV9KVxuICAgIFJlc0NvZGUgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIocmVzdWx0Q29kZSwgcmVzdWx0TWFwKSk7XG4gXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke1Jlc0NvZGV9PC9zY3JpcHQ+YFxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsICB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcbmltcG9ydCB7IHRyYW5zcGlsZXJXaXRoT3B0aW9ucyB9IGZyb20gJy4vbG9hZC1vcHRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHRhZ0RhdGE6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IEJldHdlZW5UYWdEYXRhRXEgPSBCZXR3ZWVuVGFnRGF0YS5lcSwgQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSA9IEJldHdlZW5UYWdEYXRhRXEudHJpbSgpLCBpc01vZGVsID0gdGFnRGF0YS5wb3BTdHJpbmcoJ3R5cGUnKSA9PSAnbW9kdWxlJywgaXNNb2RlbFN0cmluZ0NhY2hlID0gaXNNb2RlbCA/ICdzY3JpcHRNb2R1bGUnIDogJ3NjcmlwdCc7XG5cbiAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5pbmNsdWRlcyhCZXR3ZWVuVGFnRGF0YUVxQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5wdXNoKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pO1xuXG4gICAgY29uc3Qge3Jlc3VsdENvZGUsIHJlc3VsdE1hcH0gPSBhd2FpdCB0cmFuc3BpbGVyV2l0aE9wdGlvbnMoQmV0d2VlblRhZ0RhdGEsIGxhbmd1YWdlLCBzZXNzaW9uSW5mby5kZWJ1ZylcbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoaXNNb2RlbCA/ICdtb2R1bGUnIDogJ3NjcmlwdCcsIHRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHRNYXApIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKEpTT04ucGFyc2UocmVzdWx0TWFwKSwgQmV0d2VlblRhZ0RhdGEsIHJlc3VsdENvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRUZXh0KHJlc3VsdENvZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHNjcmlwdFdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNjcmlwdFdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgaWYgKGRhdGFUYWcuZXhpc3RzKCdzcmMnKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtCZXR3ZWVuVGFnRGF0YX08L3NjcmlwdD5gXG4gICAgICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdsYW5nJywgJ2pzJyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdzZXJ2ZXInKSkge1xuICAgICAgICByZXR1cm4gc2NyaXB0V2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NyaXB0V2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltcG9ydGVyKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZEZpbGVVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh1cmxbMF0gPT0gJy8nIHx8IHVybFswXSA9PSAnficpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChcbiAgICAgICAgICAgICAgICAgICAgdXJsLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFRvRmlsZVVSTCh1cmxbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdIDogZ2V0VHlwZXMubm9kZV9tb2R1bGVzWzBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKHVybCwgcGF0aFRvRmlsZVVSTChvcmlnaW5hbFBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFsnc2NzcycsICdzYXNzJ10uaW5jbHVkZXMobGFuZ3VhZ2UpID8gU29tZVBsdWdpbnMoXCJNaW5BbGxcIiwgXCJNaW5TYXNzXCIpIDogU29tZVBsdWdpbnMoXCJNaW5Dc3NcIiwgXCJNaW5BbGxcIikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3R5bGUobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBtaW5pZnlQbHVnaW5TYXNzKGxhbmd1YWdlKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPiAke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsICB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG91dFN0eWxlQXNUcmltID0gQmV0d2VlblRhZ0RhdGEuZXEudHJpbSgpO1xuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZS5zdHlsZS5pbmNsdWRlcyhvdXRTdHlsZUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLnB1c2gob3V0U3R5bGVBc1RyaW0pO1xuXG4gICAgY29uc3QgeyByZXN1bHQsIG91dFN0eWxlIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHB1c2hTdHlsZSA9IHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc3R5bGUnLCBkYXRhVGFnLCAgQmV0d2VlblRhZ0RhdGEpO1xuXG4gICAgaWYgKHJlc3VsdD8uc291cmNlTWFwKVxuICAgICAgICBwdXNoU3R5bGUuYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoU291cmNlTWFwU3RvcmUuZml4VVJMU291cmNlTWFwKDxhbnk+cmVzdWx0LnNvdXJjZU1hcCksIEJldHdlZW5UYWdEYXRhLCBvdXRTdHlsZSk7XG4gICAgZWxzZVxuICAgICAgICBwdXNoU3R5bGUuYWRkU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgeyB0ZXh0OiBvdXRTdHlsZSB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHN0eWxlV2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc3R5bGVXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2xhbmcnLCAnY3NzJyk7XG5cbiAgICBpZihkYXRhVGFnLnBvcEJvb2xlYW4oJ3NlcnZlcicpKXtcbiAgICAgICAgcmV0dXJuIHN0eWxlV2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlV2l0aENsaWVudChsYW5ndWFnZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IHBhdGhfbm9kZS5qb2luKHNtYWxsUGF0aCwgJy8uLi8nLCBpbnB1dFBhdGgpO1xuICAgIH1cblxuICAgIGlmICghcGF0aF9ub2RlLmV4dG5hbWUoaW5wdXRQYXRoKSlcbiAgICAgICAgaW5wdXRQYXRoICs9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7IENvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkIH0gfSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdChcImZyb21cIik7XG5cbiAgICBjb25zdCBpblN0YXRpYyA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHNtYWxsUGF0aFRvUGFnZSh0eXBlLmV4dHJhY3RJbmZvKCkpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWMsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHRleHQ6IGBcXG5QYWdlIG5vdCBmb3VuZDogJHt0eXBlLmF0KDApLmxpbmVJbmZvfSAtPiAke0Z1bGxQYXRofWAsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdwYWdlLW5vdC1mb3VuZCcsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBKU1BhcnNlci5wcmludEVycm9yKGBQYWdlIG5vdCBmb3VuZDogJHtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKHR5cGUubGluZUluZm8pfSAtPiAke1NtYWxsUGF0aH1gKSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgUmV0dXJuRGF0YTogU3RyaW5nVHJhY2tlcjtcblxuICAgIGNvbnN0IGhhdmVDYWNoZSA9IGNhY2hlTWFwW2luU3RhdGljXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb24gfSA9IGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKGluU3RhdGljLCBnZXRUeXBlcy5TdGF0aWMsIHsgbmVzdGVkUGFnZTogcGF0aE5hbWUsIG5lc3RlZFBhZ2VEYXRhOiBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdvYmplY3QnKSB9KTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW2luU3RhdGljXSA9IHsgQ29tcGlsZWREYXRhOiA8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb24gfTtcbiAgICAgICAgUmV0dXJuRGF0YSA9IDxTdHJpbmdUcmFja2VyPkNvbXBpbGVkRGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgbmV3U2Vzc2lvbiB9ID0gY2FjaGVNYXBbaW5TdGF0aWNdO1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5zYXZlUGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gSlNPTi5wYXJzZShhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCkgfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBrZXkgaXMgaW4gdGhlIHN0b3JlLCByZXR1cm4gdGhlIHZhbHVlLiBJZiBub3QsIGNyZWF0ZSBhIG5ldyB2YWx1ZSwgc3RvcmUgaXQsIGFuZCByZXR1cm4gaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBsb29rIHVwIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0gW2NyZWF0ZV0gLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIGtleSBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgaGF2ZShrZXk6IHN0cmluZywgY3JlYXRlPzogKCkgPT4gc3RyaW5nKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5zdG9yZVtrZXldO1xuICAgICAgICBpZiAoaXRlbSB8fCAhY3JlYXRlKSByZXR1cm4gaXRlbTtcblxuICAgICAgICBpdGVtID0gY3JlYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlKGtleSwgaXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKHRoaXMuc2F2ZVBhdGgsIHRoaXMuc3RvcmUpO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuL0Vhc3lGc1wiO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tIFwiLi9TdG9yZUpTT05cIjtcblxuZXhwb3J0IGNvbnN0IHBhZ2VEZXBzID0gbmV3IFN0b3JlSlNPTignUGFnZXNJbmZvJylcblxuLyoqXG4gKiBDaGVjayBpZiBhbnkgb2YgdGhlIGRlcGVuZGVuY2llcyBvZiB0aGUgcGFnZSBoYXZlIGNoYW5nZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge1N0cmluZ051bWJlck1hcH0gZGVwZW5kZW5jaWVzIC0gQSBtYXAgb2YgZGVwZW5kZW5jaWVzLiBUaGUga2V5IGlzIHRoZSBwYXRoIHRvIHRoZSBmaWxlLCBhbmRcbiAqIHRoZSB2YWx1ZSBpcyB0aGUgbGFzdCBtb2RpZmllZCB0aW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHBhdGg6c3RyaW5nLCBkZXBlbmRlbmNpZXM6IFN0cmluZ051bWJlck1hcCA9IHBhZ2VEZXBzLnN0b3JlW3BhdGhdKSB7XG4gICAgZm9yIChjb25zdCBpIGluIGRlcGVuZGVuY2llcykge1xuICAgICAgICBjb25zdCBGaWxlUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICArICAoaSA9PSAndGhpc1BhZ2UnID8gcGF0aDogaSk7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBkZXBlbmRlbmNpZXNbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiAhZGVwZW5kZW5jaWVzO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBpc29sYXRlKEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8pO1xuXG4gICAgY29tcGlsZWRTdHJpbmcuUGx1cyQgYDwleyU+JHtCZXR3ZWVuVGFnRGF0YX08JX0lPmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZyxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHJlbGF0aXZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlZ2lzdGVyRXh0ZW5zaW9uIGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyJztcbmltcG9ydCB7IHJlYnVpbGRGaWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSwgeyByZXNvbHZlLCBjbGVhck1vZHVsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2FwaXRhbGl6ZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvcHJlcHJvY2Vzcyc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuXG5hc3luYyBmdW5jdGlvbiBzc3JIVE1MKGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBnZXRWID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBndiA9IChuYW1lOiBzdHJpbmcpID0+IGRhdGFUYWcucG9wQW55RGVmYXVsdChuYW1lLCcnKS50cmltKCksXG4gICAgICAgICAgICB2YWx1ZSA9IGd2KCdzc3InICsgQ2FwaXRhbGl6ZShuYW1lKSkgfHwgZ3YobmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gZXZhbChgKHske3ZhbHVlfX0pYCkgOiB7fTtcbiAgICB9O1xuICAgIGNvbnN0IGJ1aWxkUGF0aCA9IGF3YWl0IHJlZ2lzdGVyRXh0ZW5zaW9uKEZ1bGxQYXRoLCBzbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBtb2RlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGJ1aWxkUGF0aCk7XG5cbiAgICBjb25zdCB7IGh0bWwsIGhlYWQgfSA9IG1vZGUuZGVmYXVsdC5yZW5kZXIoZ2V0VigncHJvcHMnKSwgZ2V0Vignb3B0aW9ucycpKTtcbiAgICBzZXNzaW9uSW5mby5oZWFkSFRNTCArPSBoZWFkO1xuICAgIHJldHVybiBodG1sO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgTGFzdFNtYWxsUGF0aCA9IHR5cGUuZXh0cmFjdEluZm8oKSwgTGFzdEZ1bGxQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBMYXN0U21hbGxQYXRoO1xuICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQ3JlYXRlRmlsZVBhdGgoTGFzdEZ1bGxQYXRoLCBMYXN0U21hbGxQYXRoLCBkYXRhVGFnLnBvcEhhdmVEZWZhdWx0KCdmcm9tJyksIGdldFR5cGVzLlN0YXRpY1syXSwgJ3N2ZWx0ZScpO1xuICAgIGNvbnN0IGluV2ViUGF0aCA9IHJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgU21hbGxQYXRoKS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpO1xuXG4gICAgc2Vzc2lvbkluZm8uc3R5bGUoJy8nICsgaW5XZWJQYXRoICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IGlkID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdpZCcsIEJhc2U2NElkKGluV2ViUGF0aCkpLFxuICAgICAgICBoYXZlID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQobmFtZSwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IGAsJHtuYW1lfTp7JHt2YWx1ZX19YCA6ICcnO1xuICAgICAgICB9LCBzZWxlY3RvciA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3NlbGVjdG9yJyk7XG5cbiAgICBjb25zdCBzc3IgPSAhc2VsZWN0b3IgJiYgZGF0YVRhZy5wb3BCb29sZWFuKCdzc3InKSA/IGF3YWl0IHNzckhUTUwoZGF0YVRhZywgRnVsbFBhdGgsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pIDogJyc7XG5cblxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnbW9kdWxlJywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dChcbmBpbXBvcnQgQXBwJHtpZH0gZnJvbSAnLyR7aW5XZWJQYXRofSc7XG5jb25zdCB0YXJnZXQke2lkfSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIke3NlbGVjdG9yID8gc2VsZWN0b3IgOiAnIycgKyBpZH1cIik7XG50YXJnZXQke2lkfSAmJiBuZXcgQXBwJHtpZH0oe1xuICAgIHRhcmdldDogdGFyZ2V0JHtpZH1cbiAgICAke2hhdmUoJ3Byb3BzJykgKyBoYXZlKCdvcHRpb25zJyl9JHtzc3IgPyAnLCBoeWRyYXRlOiB0cnVlJyA6ICcnfVxufSk7YCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgc2VsZWN0b3IgPyAnJyA6IGA8ZGl2IGlkPVwiJHtpZH1cIj4ke3Nzcn08L2Rpdj5gKSxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSWQodGV4dDogc3RyaW5nLCBtYXggPSAxMCl7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRleHQpLnRvU3RyaW5nKCdiYXNlNjQnKS5zdWJzdHJpbmcoMCwgbWF4KS5yZXBsYWNlKC9cXCsvLCAnXycpLnJlcGxhY2UoL1xcLy8sICdfJyk7XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0ICB7IENhcGl0YWxpemUsIHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IENvbXBpbGVPcHRpb25zIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY2xlYXJNb2R1bGUsIHJlc29sdmUgfSBmcm9tIFwiLi4vLi4vcmVkaXJlY3RDSlNcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWdpc3RlckV4dGVuc2lvbihmaWxlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IG5hbWUgPSBwYXRoLnBhcnNlKGZpbGVQYXRoKS5uYW1lLnJlcGxhY2UoL15cXGQvLCAnXyQmJykucmVwbGFjZSgvW15hLXpBLVowLTlfJF0vZywgJycpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogQ29tcGlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgbmFtZTogQ2FwaXRhbGl6ZShuYW1lKSxcbiAgICAgICAgZ2VuZXJhdGU6ICdzc3InLFxuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBkZXY6IHNlc3Npb25JbmZvLmRlYnVnLFxuICAgICAgICBlcnJvck1vZGU6ICd3YXJuJ1xuICAgIH07XG5cbiAgICBjb25zdCBpblN0YXRpY0ZpbGUgPSBwYXRoLnJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgc21hbGxQYXRoKTtcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY0ZpbGU7XG5cbiAgICBjb25zdCBmdWxsSW1wb3J0UGF0aCA9IGZ1bGxDb21waWxlUGF0aCArICcuc3NyLmNqcyc7XG4gICAgY29uc3Qge3N2ZWx0ZUZpbGVzLCBjb2RlLCBtYXAsIGRlcGVuZGVuY2llc30gPSBhd2FpdCBwcmVwcm9jZXNzKGZpbGVQYXRoLCBzbWFsbFBhdGgsZnVsbEltcG9ydFBhdGgsZmFsc2UsJy5zc3IuY2pzJyk7XG4gICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsZGVwZW5kZW5jaWVzKTtcbiAgICBvcHRpb25zLnNvdXJjZW1hcCA9IG1hcDtcblxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgZm9yKGNvbnN0IGZpbGUgb2Ygc3ZlbHRlRmlsZXMpe1xuICAgICAgICBjbGVhck1vZHVsZShyZXNvbHZlKGZpbGUpKTsgLy8gZGVsZXRlIG9sZCBpbXBvcnRzXG4gICAgICAgIHByb21pc2VzLnB1c2gocmVnaXN0ZXJFeHRlbnNpb24oZmlsZSwgQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlKSwgc2Vzc2lvbkluZm8pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBjb25zdCB7IGpzLCBjc3MsIHdhcm5pbmdzIH0gPSBzdmVsdGUuY29tcGlsZShjb2RlLCA8YW55Pm9wdGlvbnMpO1xuICAgIFByaW50U3ZlbHRlV2Fybih3YXJuaW5ncywgZmlsZVBhdGgsIG1hcCk7XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSAnLycgKyBpblN0YXRpY0ZpbGUuc3BsaXQoL1xcL3xcXC8vKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiBmdWxsSW1wb3J0UGF0aDtcbn1cbiIsICJpbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdAc3djL2NvcmUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IGRpcm5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgUHJpbnRTYXNzRXJyb3JUcmFja2VyLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFeHRlbnNpb24sIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS90cmFuc3BpbGVyL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCwgYmFja1RvT3JpZ2luYWxTc3MgfSBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZCc7XG5pbXBvcnQgeyBlc1RhcmdldCwgVHJhbnNmb3JtSlNDIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9zZXR0aW5ncyc7XG5cbmFzeW5jIGZ1bmN0aW9uIFNBU1NTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcpLFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBhd2FpdCBiYWNrVG9PcmlnaW5hbFNzcyhjb250ZW50LCBjc3MsPGFueT4gc291cmNlTWFwLCBzb3VyY2VNYXAuc291cmNlcy5maW5kKHggPT4geC5zdGFydHNXaXRoKCdkYXRhOicpKSksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGxvYWRlZFVybHMubWFwKHggPT4gZmlsZVVSTFRvUGF0aCg8YW55PngpKVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTY3JpcHRTdmVsdGUoY29udGVudDogU3RyaW5nVHJhY2tlciwgbGFuZzogc3RyaW5nLCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSwgc3ZlbHRlRXh0ID0gJycpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICBjb25zdCBtYXBUb2tlbiA9IHt9O1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC8oKGltcG9ydCh7fFsgXSpcXCg/KXwoKGltcG9ydFsgXSp0eXBlfGltcG9ydHxleHBvcnQpKHt8WyBdKylbXFxXXFx3XSs/KH18WyBdKylmcm9tKSkofXxbIF0qKSkoW1wifCd8YF0pKFtcXFdcXHddKz8pXFw5KFsgXSpcXCkpPy9tLCBhcmdzID0+IHtcbiAgICAgICAgaWYobGFuZyA9PSAndHMnICYmIGFyZ3NbNV0uZW5kc1dpdGgoJyB0eXBlJykpXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoYXJnc1sxMF0uZXEpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJycpXG4gICAgICAgICAgICBpZiAobGFuZyA9PSAndHMnKVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy50cycpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFyZ3NbMTBdLkFkZFRleHRBZnRlck5vVHJhY2soJy5qcycpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGFyZ3NbMV0uUGx1cyhhcmdzWzldLCBhcmdzWzEwXSwgKGV4dCA9PSAnLnN2ZWx0ZScgPyBzdmVsdGVFeHQgOiAnJyksIGFyZ3NbOV0sIChhcmdzWzExXSA/PyAnJykpO1xuXG4gICAgICAgIGlmIChleHQgPT0gJy5zdmVsdGUnKSB7XG4gICAgICAgICAgICBjb25uZWN0U3ZlbHRlLnB1c2goYXJnc1sxMF0uZXEpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhbmcgIT09ICd0cycgfHwgIWFyZ3NbNF0pXG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcblxuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgbWFwVG9rZW5baWRdID0gbmV3RGF0YTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYF9fX3RvS2VuXFxgJHtpZH1cXGBgKTtcbiAgICB9KTtcblxuICAgIGlmIChsYW5nICE9PSAndHMnKVxuICAgICAgICByZXR1cm4gY29udGVudDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSAoYXdhaXQgdHJhbnNmb3JtKGNvbnRlbnQuZXEsIHsgXG4gICAgICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICAgICAgcGFyc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJ3R5cGVzY3JpcHQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzb3VyY2VNYXBzOiB0cnVlLFxuICAgICAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgXG4gICAgfSkpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgYmFja1RvT3JpZ2luYWwoY29udGVudCwgY29kZSwgbWFwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKGNvbnRlbnQsIGVycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgfVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoL19fX3RvS2VuYChbXFx3XFxXXSs/KWAvbWksIGFyZ3MgPT4ge1xuICAgICAgICByZXR1cm4gbWFwVG9rZW5bYXJnc1sxXS5lcV0gPz8gbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwcm9jZXNzKGZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzYXZlUGF0aCA9IHNtYWxsUGF0aCwgaHR0cFNvdXJjZSA9IHRydWUsIHN2ZWx0ZUV4dCA9ICcnKSB7ICAgIFxuICAgIGxldCB0ZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoc21hbGxQYXRoLCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpKTtcblxuICAgIGxldCBzY3JpcHRMYW5nID0gJ2pzJywgc3R5bGVMYW5nID0gJ2Nzcyc7XG5cbiAgICBjb25zdCBjb25uZWN0U3ZlbHRlOiBzdHJpbmdbXSA9IFtdLCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzY3JpcHQpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc2NyaXB0PikvcywgYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIHNjcmlwdExhbmcgPSBhcmdzWzRdPy5lcSA/PyAnanMnO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGF3YWl0IFNjcmlwdFN2ZWx0ZShhcmdzWzddLCBzY3JpcHRMYW5nLCBjb25uZWN0U3ZlbHRlLCBzdmVsdGVFeHQpLCBhcmdzWzhdKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0eWxlQ29kZSA9IGNvbm5lY3RTdmVsdGUubWFwKHggPT4gYEBpbXBvcnQgXCIke3h9LmNzc1wiO2ApLmpvaW4oJycpO1xuICAgIGxldCBoYWRTdHlsZSA9IGZhbHNlO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c3R5bGUpWyBdKiggbGFuZz0oJ3xcIik/KFtBLVphLXpdKykoJ3xcIik/KT9bIF0qKD5cXG4/KSguKj8pKFxcbj88XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGlmKHN0eWxlTGFuZyA9PSAnY3NzJykgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llczogZGVwcyB9ID0gYXdhaXQgU0FTU1N2ZWx0ZShhcmdzWzddLCBzdHlsZUxhbmcsIGZ1bGxQYXRoKTtcbiAgICAgICAgZGVwcyAmJiBkZXBlbmRlbmNpZXMucHVzaCguLi5kZXBzKTtcbiAgICAgICAgaGFkU3R5bGUgPSB0cnVlO1xuICAgICAgICBzdHlsZUNvZGUgJiYgY29kZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhzdHlsZUNvZGUpO1xuICAgICAgICByZXR1cm4gYXJnc1sxXS5QbHVzKGFyZ3NbNl0sIGNvZGUsIGFyZ3NbOF0pOztcbiAgICB9KTtcblxuICAgIGlmICghaGFkU3R5bGUgJiYgc3R5bGVDb2RlKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgPHN0eWxlPiR7c3R5bGVDb2RlfTwvc3R5bGU+YCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IG5ldyBTZXNzaW9uQnVpbGQoc21hbGxQYXRoLCBmdWxsUGF0aCksIHByb21pc2VzID0gW3Nlc3Npb25JbmZvLmRlcGVuZGVuY2Uoc21hbGxQYXRoLCBmdWxsUGF0aCldO1xuXG4gICAgZm9yIChjb25zdCBmdWxsIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICBwcm9taXNlcy5wdXNoKHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmdWxsKSwgZnVsbCkpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHsgc2NyaXB0TGFuZywgc3R5bGVMYW5nLCBjb2RlOiB0ZXh0LmVxLCBtYXA6IHRleHQuU3RyaW5nVGFjayhzYXZlUGF0aCwgaHR0cFNvdXJjZSksIGRlcGVuZGVuY2llczogc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBzdmVsdGVGaWxlczogY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiB4WzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1swXSArIHggOiBwYXRoLm5vcm1hbGl6ZShmdWxsUGF0aCArICcvLi4vJyArIHgpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2FwaXRhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn1cblxuIiwgImltcG9ydCB7IE9wdGlvbnMgYXMgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnQHN3Yy9jb3JlJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSAnLi9FYXN5U3ludGF4JztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBDb21tb25qcywgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoL3dpbjMyJztcblxuZnVuY3Rpb24gRXJyb3JUZW1wbGF0ZShpbmZvOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBgbW9kdWxlLmV4cG9ydHMgPSAoKSA9PiAoRGF0YU9iamVjdCkgPT4gRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFxcYCR7SlNQYXJzZXIucHJpbnRFcnJvcihgU3ludGF4IEVycm9yOiAke2luZm8ucmVwbGFjZUFsbCgnXFxuJywgJzxici8+Jyl9YCl9XFxgYDtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0ZXh0IFxuICogQHBhcmFtIHR5cGUgXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNUeXBlc2NyaXB0OiBib29sZWFuLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgdGV4dCA9IHRleHQudHJpbSgpO1xuXG4gICAgY29uc3QgT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IENvbW1vbmpzKHtcbiAgICAgICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgICAgICAgcGFyc2VyOiB7XG4gICAgICAgICAgICAgICAgc3ludGF4OiBpc1R5cGVzY3JpcHQgPyAndHlwZXNjcmlwdCcgOiAnZWNtYXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKChpc1R5cGVzY3JpcHQgPyAnVFMnIDogJ0pTJykgKyBcIk9wdGlvbnNcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIGZpbGVuYW1lOiBzZXNzaW9uSW5mby5zbWFsbFBhdGgsXG4gICAgICAgIHNvdXJjZU1hcHM6IHRydWVcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIGNvbnN0IHNjcmlwdERlZmluZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKHRleHQuZXEsIHsgZGVidWc6ICcnICsgc2Vzc2lvbkluZm8uZGVidWcgfSk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShzY3JpcHREZWZpbmUsIE9wdGlvbnMpO1xuICAgICAgICByZXN1bHQgPSBtYXAgPyBhd2FpdCBiYWNrVG9PcmlnaW5hbCh0ZXh0LCBjb2RlLCBtYXApIDogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgY29kZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlID0gRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKHRleHQsIGVycik7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICBwYXJzZS5lcnJvckZpbGUgPSAgQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShwYXJzZS5lcnJvckZpbGUpXG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBFcnJvclRlbXBsYXRlKHBhcnNlLnNpbXBsZU1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCAgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tIFwiLi9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXJcIjtcblxuXG5leHBvcnQgdHlwZSBzZXREYXRhSFRNTFRhZyA9IHtcbiAgICB1cmw6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwXG59XG5cbmV4cG9ydCB0eXBlIGNvbm5lY3RvckluZm8gPSB7XG4gICAgdHlwZTogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBzZW5kVG86IHN0cmluZyxcbiAgICB2YWxpZGF0b3I6IHN0cmluZ1tdLFxuICAgIG9yZGVyPzogc3RyaW5nW10sXG4gICAgbm90VmFsaWQ/OiBzdHJpbmcsXG4gICAgbWVzc2FnZT86IHN0cmluZyB8IGJvb2xlYW4sXG4gICAgcmVzcG9uc2VTYWZlPzogYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JBcnJheSA9IGNvbm5lY3RvckluZm9bXVxuXG5leHBvcnQgdHlwZSBjYWNoZUNvbXBvbmVudCA9IHtcbiAgICBba2V5OiBzdHJpbmddOiBudWxsIHwge1xuICAgICAgICBtdGltZU1zPzogbnVtYmVyLFxuICAgICAgICB2YWx1ZT86IHN0cmluZ1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgaW5UYWdDYWNoZSA9IHtcbiAgICBzdHlsZTogc3RyaW5nW11cbiAgICBzY3JpcHQ6IHN0cmluZ1tdXG4gICAgc2NyaXB0TW9kdWxlOiBzdHJpbmdbXVxufVxuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTaG9ydFNjcmlwdE5hbWVzJyk7XG5cbi8qIFRoZSBTZXNzaW9uQnVpbGQgY2xhc3MgaXMgdXNlZCB0byBidWlsZCB0aGUgaGVhZCBvZiB0aGUgcGFnZSAqL1xuZXhwb3J0IGNsYXNzIFNlc3Npb25CdWlsZCB7XG4gICAgY29ubmVjdG9yQXJyYXk6IGNvbm5lY3RvckFycmF5ID0gW11cbiAgICBwcml2YXRlIHNjcmlwdFVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBzdHlsZVVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBpblNjcmlwdFN0eWxlOiB7IHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBTb3VyY2VNYXBTdG9yZSB9W10gPSBbXVxuICAgIGhlYWRIVE1MID0gJydcbiAgICBjYWNoZTogaW5UYWdDYWNoZSA9IHtcbiAgICAgICAgc3R5bGU6IFtdLFxuICAgICAgICBzY3JpcHQ6IFtdLFxuICAgICAgICBzY3JpcHRNb2R1bGU6IFtdXG4gICAgfVxuICAgIGNhY2hlQ29tcGlsZVNjcmlwdDogYW55ID0ge31cbiAgICBjYWNoZUNvbXBvbmVudDogY2FjaGVDb21wb25lbnQgPSB7fVxuICAgIGNvbXBpbGVSdW5UaW1lU3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9XG4gICAgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSB7fVxuICAgIHJlY29yZE5hbWVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICBnZXQgc2FmZURlYnVnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWJ1ZyAmJiB0aGlzLl9zYWZlRGVidWc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNtYWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgZnVsbFBhdGg6IHN0cmluZywgcHVibGljIHR5cGVOYW1lPzogc3RyaW5nLCBwdWJsaWMgZGVidWc/OiBib29sZWFuLCBwcml2YXRlIF9zYWZlRGVidWc/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMgPSB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc3R5bGUodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgc2NyaXB0KHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcmlwdFVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgcmVjb3JkKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVwZW5kZW5jZShzbWFsbFBhdGg6IHN0cmluZywgZnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aCkge1xuICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEZXAgPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0O1xuICAgICAgICBpZiAoaGF2ZURlcCkge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSA9IGhhdmVEZXBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGUodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHNtYWxsUGF0aCA9IHRoaXMuc21hbGxQYXRoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5pblNjcmlwdFN0eWxlLmZpbmQoeCA9PiB4LnR5cGUgPT0gdHlwZSAmJiB4LnBhdGggPT0gc21hbGxQYXRoKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0geyB0eXBlLCBwYXRoOiBzbWFsbFBhdGgsIHZhbHVlOiBuZXcgU291cmNlTWFwU3RvcmUoc21hbGxQYXRoLCB0aGlzLnNhZmVEZWJ1ZywgdHlwZSA9PSAnc3R5bGUnLCB0cnVlKSB9XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaChkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhLnZhbHVlXG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGVQYWdlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIGRhdGFUYWcucG9wU3RyaW5nKCdwYWdlJykgPyB0aGlzLnNtYWxsUGF0aCA6IGluZm8uZXh0cmFjdEluZm8oKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVOYW1lKHRleHQ6IHN0cmluZykge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU3RhdGljRmlsZXNJbmZvLnN0b3JlKTtcbiAgICAgICAgd2hpbGUgKGtleSA9PSBudWxsIHx8IHZhbHVlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSBCYXNlNjRJZCh0ZXh0LCA1ICsgbGVuZ3RoKS5zdWJzdHJpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZEhlYWRUYWdzKCkge1xuICAgICAgICBjb25zdCBwYWdlTG9nID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTG9nID0gcGFnZUxvZyAmJiBpLnBhdGggPT0gdGhpcy5zbWFsbFBhdGg7XG4gICAgICAgICAgICBjb25zdCBzYXZlTG9jYXRpb24gPSBpc0xvZyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV0sIGFkZFF1ZXJ5ID0gaXNMb2cgPyAnP3Q9bCcgOiAnJztcbiAgICAgICAgICAgIGxldCB1cmwgPSBTdGF0aWNGaWxlc0luZm8uaGF2ZShpLnBhdGgsICgpID0+IFNlc3Npb25CdWlsZC5jcmVhdGVOYW1lKGkucGF0aCkpICsgJy5wdWInO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgZGVmZXI6IG51bGwgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcubWpzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JpcHQoJy8nICsgdXJsICsgYWRkUXVlcnksIHsgdHlwZTogJ21vZHVsZScgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5jc3MnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlKCcvJyArIHVybCArIGFkZFF1ZXJ5KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShzYXZlTG9jYXRpb24gKyB1cmwsIGF3YWl0IGkudmFsdWUuY3JlYXRlRGF0YVdpdGhNYXAoKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkSGVhZCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRIZWFkVGFncygpO1xuXG4gICAgICAgIGNvbnN0IG1ha2VBdHRyaWJ1dGVzID0gKGk6IHNldERhdGFIVE1MVGFnKSA9PiBpLmF0dHJpYnV0ZXMgPyAnICcgKyBPYmplY3Qua2V5cyhpLmF0dHJpYnV0ZXMpLm1hcCh4ID0+IGkuYXR0cmlidXRlc1t4XSA/IHggKyBgPVwiJHtpLmF0dHJpYnV0ZXNbeF19XCJgIDogeCkuam9pbignICcpIDogJyc7XG5cbiAgICAgICAgbGV0IGJ1aWxkQnVuZGxlU3RyaW5nID0gJyc7IC8vIGFkZCBzY3JpcHRzIGFkZCBjc3NcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc3R5bGVVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0vPmA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNjcmlwdFVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8c2NyaXB0IHNyYz1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfT48L3NjcmlwdD5gO1xuXG4gICAgICAgIHJldHVybiBidWlsZEJ1bmRsZVN0cmluZyArIHRoaXMuaGVhZEhUTUw7XG4gICAgfVxuXG4gICAgZXh0ZW5kcyhmcm9tOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3JBcnJheS5wdXNoKC4uLmZyb20uY29ubmVjdG9yQXJyYXkpO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKC4uLmZyb20uc2NyaXB0VVJMU2V0KTtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKC4uLmZyb20uc3R5bGVVUkxTZXQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBmcm9tLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKHsgLi4uaSwgdmFsdWU6IGkudmFsdWUuY2xvbmUoKSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29weU9iamVjdHMgPSBbJ2NhY2hlQ29tcGlsZVNjcmlwdCcsICdjYWNoZUNvbXBvbmVudCcsICdkZXBlbmRlbmNpZXMnXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29weU9iamVjdHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpc1tjXSwgZnJvbVtjXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2goLi4uZnJvbS5yZWNvcmROYW1lcy5maWx0ZXIoeCA9PiAhdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyh4KSkpO1xuXG4gICAgICAgIHRoaXMuaGVhZEhUTUwgKz0gZnJvbS5oZWFkSFRNTDtcbiAgICAgICAgdGhpcy5jYWNoZS5zdHlsZS5wdXNoKC4uLmZyb20uY2FjaGUuc3R5bGUpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdC5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0KTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHRNb2R1bGUucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdE1vZHVsZSk7XG4gICAgfVxuXG4gICAgLy9iYXNpYyBtZXRob2RzXG4gICAgQnVpbGRTY3JpcHRXaXRoUHJhbXMoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gQnVpbGRTY3JpcHQoY29kZSwgaXNUcygpLCB0aGlzKTtcbiAgICB9XG59IiwgIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCBjbGVhck1vZHVsZSBmcm9tICdjbGVhci1tb2R1bGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCksIHJlc29sdmUgPSAocGF0aDogc3RyaW5nKSA9PiByZXF1aXJlLnJlc29sdmUocGF0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGZpbGVQYXRoKTtcbiAgICBjbGVhck1vZHVsZShmaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufVxuXG5leHBvcnQge1xuICAgIGNsZWFyTW9kdWxlLFxuICAgIHJlc29sdmVcbn0iLCAiaW1wb3J0IHsgV2FybmluZyB9IGZyb20gXCJzdmVsdGUvdHlwZXMvY29tcGlsZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5cbmNsYXNzIHJlTG9jYXRpb24ge1xuICAgIG1hcDogUHJvbWlzZTxTb3VyY2VNYXBDb25zdW1lcj5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRMb2NhdGlvbihsb2NhdGlvbjoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KXtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSAoYXdhaXQgdGhpcy5tYXApLm9yaWdpbmFsUG9zaXRpb25Gb3IobG9jYXRpb24pXG4gICAgICAgIHJldHVybiBgJHtsaW5lfToke2NvbHVtbn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlRXJyb3IoeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfTogV2FybmluZywgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xuICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcic7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICdAc2luZHJlc29yaHVzL3NsdWdpZnknO1xuaW1wb3J0IG1hcmtkb3duSXRBdHRycyBmcm9tICdtYXJrZG93bi1pdC1hdHRycyc7XG5pbXBvcnQgbWFya2Rvd25JdEFiYnIgZnJvbSAnbWFya2Rvd24taXQtYWJicidcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55LCBpY29uOiBzdHJpbmcpIHtcblxuICAgIGZ1bmN0aW9uIHJlbmRlckNvZGUob3JpZ1J1bGU6IGFueSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnUmVuZGVyZWQgPSBvcmlnUnVsZSguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNvZGUtY29weVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29weS1jbGlwYm9hcmRcIiBvbmNsaWNrPVwibWFya2Rvd25Db3B5KHRoaXMpXCI+JHtpY29ufTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke29yaWdSZW5kZXJlZH1cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2sgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2spO1xuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIFxuICAgIGNvbnN0IGhsanNDbGFzcyA9ZGF0YVRhZy5wb3BCb29sZWFuKCdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogZGF0YVRhZy5wb3BCb29sZWFuKCdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpLFxuICAgICAgICBicmVha3M6IGRhdGFUYWcucG9wQm9vbGVhbignYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSxcbiAgICAgICAgdHlwb2dyYXBoZXI6IGRhdGFUYWcucG9wQm9vbGVhbigndHlwb2dyYXBoZXInLCBtYXJrRG93blBsdWdpbj8udHlwb2dyYXBoZXIgPz8gdHJ1ZSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29weSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/ICdcdUQ4M0RcdURDQ0InKTtcbiAgICBpZiAoY29weSlcbiAgICAgICAgbWQudXNlKChtOmFueSk9PiBjb2RlV2l0aENvcHkobSwgY29weSkpO1xuXG4gICAgaWYgKGRhdGFUYWcucG9wQm9vbGVhbignaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdhYmJyJywgbWFya0Rvd25QbHVnaW4/LmFiYnIgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QWJicik7XG5cbiAgICBsZXQgbWFya2Rvd25Db2RlID0gQmV0d2VlblRhZ0RhdGE/LmVxIHx8ICcnO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdmaWxlJywgJy4vbWFya2Rvd24nKTtcblxuICAgIGlmICghbWFya2Rvd25Db2RlPy50cmltPy4oKSAmJiBsb2NhdGlvbikge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBsb2NhdGlvblswXSA9PSAnLycgPyBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzJdLCBsb2NhdGlvbik6IHBhdGguam9pbihwYXRoLmRpcm5hbWUodHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JykpLCBsb2NhdGlvbik7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnBvcFN0cmluZygnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBpZih0aGVtZSAhPSAnbm9uZScpe1xuICAgICAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY29weSl7XG4gICAgICAgICAgICBzZXNzaW9uLnNjcmlwdCgnL3NlcnYvbWQuanMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCd0aGVtZScsICBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXY+YXtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAtN3B4OyAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8aGVhZCR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2UtaW50ZWdlclwiOiBbXG4gICAgICAgIC9eWzAtOV0rLi5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZS1mbG9hdFwiOiBbXG4gICAgICAgIC9eWzAtOV0rXFwuWzAtOV0rLi5bMC05XStcXC5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLXN0cmluZ1wiOiBbXG4gICAgICAgIC9ec3RyaW5nfHRleHQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IGBcIiR7eC50cmltKCkucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKX1cImApLFxuICAgICAgICAob3B0aW9uczogc3RyaW5nW10sIHRleHQ6IHN0cmluZykgPT4gb3B0aW9ucy5pbmNsdWRlcyh0ZXh0KSxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2UtbnVtYmVyXCI6IFtcbiAgICAgICAgL15udW1iZXJ8bnVtfGludGVnZXJ8aW50K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKSxcbiAgICAgICAgKG9wdGlvbnM6IG51bWJlcltdLCBudW06IG51bWJlcikgPT4gb3B0aW9ucy5pbmNsdWRlcyhudW0pLFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXVxufTtcblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzID0gWy4uLm51bWJlcnNdO1xuXG5mb3IoY29uc3QgaSBpbiBidWlsdEluQ29ubmVjdGlvblJlZ2V4KXtcbiAgICBjb25zdCB0eXBlID0gYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtpXVszXTtcblxuICAgIGlmKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyh0eXBlKSlcbiAgICAgICAgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLnB1c2goaSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVWYWx1ZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIGlmIChidWlsdEluQ29ubmVjdGlvbi5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBgW1wiJHt2YWx1ZX1cIl1gO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgW3Rlc3QsIGdldEFyZ3NdXSBvZiBPYmplY3QuZW50cmllcyhidWlsdEluQ29ubmVjdGlvblJlZ2V4KSlcbiAgICAgICAgaWYgKCg8UmVnRXhwPnRlc3QpLnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIGBbXCIke25hbWV9XCIsICR7KDxhbnk+Z2V0QXJncykodmFsdWUpfV1gO1xuXG4gICAgcmV0dXJuIGBbJHt2YWx1ZX1dYDtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVZhbGlkYXRpb25KU09OKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBQcm9taXNlPGJvb2xlYW4gfCBzdHJpbmdbXT4ge1xuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50LCAuLi5lbGVtZW50QXJnc10gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuICAgICAgICBsZXQgcmV0dXJuTm93OiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdudW0nOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICBjYXNlICdpbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFlbWFpbFZhbGlkYXRvci50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXZlUmVnZXggPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdmFsdWUgPT0gbnVsbCB8fCAhaGF2ZVJlZ2V4WzJdKGVsZW1lbnRBcmdzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICghZWxlbWVudC50ZXN0KHZhbHVlKSkgJiYgJ3JlZ2V4IC0gJyArIHZhbHVlO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICghYXdhaXQgZWxlbWVudCh2YWx1ZSkpICYmICdmdW5jdGlvbiAtICcgKyAoZWxlbWVudC5uYW1lIHx8ICdhbm9ueW1vdXMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYFZhbGlkYXRpb24gZmFpbGVkIGF0IGZpbGVkICR7TnVtYmVyKGkpKzF9IC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn0iLCAiaW1wb3J0IHsgY29ubmVjdG9ySW5mbywgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb25cIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQ2FwaXRhbGl6ZSB9IGZyb20gXCIuLi8uLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uKGNvbm5lY3ROYW1lOiBzdHJpbmcsIGNvbm5lY3RvckNhbGw6IHN0cmluZywgY29ubmVjdGlvblR5cGU6IHN0cmluZywgcGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGJ1aWxkQXJndW1lbnRzOiAoaW5mbzogY29ubmVjdG9ySW5mbykgPT4gc3RyaW5nLCB7cmV0dXJuRGF0YX06IHtyZXR1cm5EYXRhPzogYm9vbGVhbn0gPSB7fSkge1xuICAgIGlmICghc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkuZmluZCh4ID0+IHgudHlwZSA9PSBjb25uZWN0aW9uVHlwZSkpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9IGNvbm5lY3Rpb25UeXBlKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc2VuZFRvVW5pY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGkubmFtZSkudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQCR7Y29ubmVjdE5hbWV9XFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKSwgY29ubmVjdERlZmF1bHQgPSBuZXcgUmVnRXhwKGBAXFxcXD8ke2Nvbm5lY3ROYW1lfVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXClgKTtcblxuICAgICAgICBsZXQgaGFkUmVwbGFjZW1lbnQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBzY3JpcHREYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgaGFkUmVwbGFjZW1lbnQgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYGlmKFBvc3Q/LiR7Y29ubmVjdG9yQ2FsbH0gPT0gXCIke2kubmFtZX1cIil7XG4gICAgICAgICAgICAgICAgJHtyZXR1cm5EYXRhID8gJ3JldHVybiAnOiAnJ31hd2FpdCBoYW5kZWxDb25uZWN0b3IoXCIke2Nvbm5lY3Rpb25UeXBlfVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgJHtidWlsZEFyZ3VtZW50cyhpKX1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfWApXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoaGFkUmVwbGFjZW1lbnQpXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoY29ubmVjdERlZmF1bHQsICcnKTsgLy8gZGVsZXRpbmcgZGVmYXVsdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3REZWZhdWx0LCBzY3JpcHREYXRhKTtcblxuICAgIH1cblxuICAgIHJldHVybiBwYWdlRGF0YTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgY29ubmVjdG9ySW5mbywgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL1RhZ0RhdGFQYXJzZXInO1xuaW1wb3J0IHsgYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9jb25uZWN0LW5vZGUnO1xuXG5jb25zdCBzZXJ2ZVNjcmlwdCA9ICcvc2Vydi9jb25uZWN0LmpzJztcblxuZnVuY3Rpb24gdGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAke25hbWV9KC4uLmFyZ3Mpe3JldHVybiBjb25uZWN0b3IoXCIke25hbWV9XCIsIGFyZ3MpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgeyBTb21lUGx1Z2lucyB9LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25hbWUnKSxcbiAgICAgICAgc2VuZFRvID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnc2VuZFRvJyksXG4gICAgICAgIHZhbGlkYXRvciA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksXG4gICAgICAgIG5vdFZhbGlkID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnbm90VmFsaWQnKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ21lc3NhZ2UnLCBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcblxuICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwgeyBhc3luYzogbnVsbCB9KVxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dCh0ZW1wbGF0ZShuYW1lKSk7IC8vIGFkZCBzY3JpcHRcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiAnY29ubmVjdCcsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBCZXR3ZWVuVGFnRGF0YSB8fCBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgY29tcGlsZWRTdHJpbmcuQWRkVGV4dEJlZm9yZU5vVHJhY2soYDwlIUBAP0Nvbm5lY3RIZXJlKCR7bmFtZX0pJT5gKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gYWRkRmluYWxpemVCdWlsZEFueUNvbm5lY3Rpb24oJ0Nvbm5lY3RIZXJlJywgJ2Nvbm5lY3RvckNhbGw/Lm5hbWUnLCAnY29ubmVjdCcsIHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgaSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6XCIke2kubmFtZX1cIixcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6JHt0eXBlb2YgaS5tZXNzYWdlID09ICdzdHJpbmcnID8gYFwiJHtpLm1lc3NhZ2V9XCJgIDogaS5tZXNzYWdlfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHsoaS52YWxpZGF0b3IgJiYgaS52YWxpZGF0b3IubWFwKGNvbXBpbGVWYWx1ZXMpLmpvaW4oJywnKSkgfHwgJyd9XVxuICAgICAgICB9YFxuICAgIH0sIHtyZXR1cm5EYXRhOiB0cnVlfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3I6IGFueSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC52YWx1ZXM7XG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbm5lY3Rvci52YWxpZGF0b3IubGVuZ3RoICYmIGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3Rvci52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbm5lY3Rvci52YWxpZGF0b3IubGVuZ3RoIHx8IGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgY29ubmVjdG9yLnNlbmRUbyguLi52YWx1ZXMpKTtcblxuICAgIGVsc2UgaWYgKGNvbm5lY3Rvci5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBjb25uZWN0b3Iubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKSk7XG5cbiAgICBlbHNlIGlmIChjb25uZWN0b3IubWVzc2FnZSlcbiAgICAgICAgYmV0dGVySlNPTih7XG4gICAgICAgICAgICBlcnJvcjogdHlwZW9mIGNvbm5lY3Rvci5tZXNzYWdlID09ICdzdHJpbmcnID8gY29ubmVjdG9yLm1lc3NhZ2UgOiAoPGFueT5pc1ZhbGlkKS5zaGlmdCgpXG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc3RhdHVzKDQwMCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVZhbHVlcyB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5pbXBvcnQgeyBhZGRGaW5hbGl6ZUJ1aWxkQW55Q29ubmVjdGlvbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2Nvbm5lY3Qtbm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IHNlbmRUbyA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnc2VuZFRvJywgJycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtkYXRhVGFnLnJlYnVpbGRTcGFjZSgpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgICAgICB9PC9mb3JtPmAsXG4gICAgICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgICAgIH1cblxuXG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbmFtZScsIHV1aWQoKSkudHJpbSgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5wb3BIYXZlRGVmYXVsdCgnb3JkZXInKSwgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucG9wSGF2ZURlZmF1bHQoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcucG9wQm9vbGVhbignc2FmZScpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGRhdGFUYWcucG9wQW55RGVmYXVsdCgnbWVzc2FnZScsIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIikpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBsZXQgb3JkZXIgPSBbXTtcblxuICAgIGNvbnN0IHZhbGlkYXRvckFycmF5ID0gdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHsgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYW4gb3JkZXIgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIFwicHJvcDE6IHN0cmluZywgcHJvcDM6IG51bSwgcHJvcDI6IGJvb2xcIlxuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0Rmlyc3QoJzonLCB4LnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBvcmRlci5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuXG4gICAgICAgIHJldHVybiBzcGxpdC5wb3AoKTtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlckRlZmF1bHQpXG4gICAgICAgIG9yZGVyID0gb3JkZXJEZWZhdWx0LnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yQXJyYXksXG4gICAgICAgIG9yZGVyOiBvcmRlci5sZW5ndGggJiYgb3JkZXIsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZXNwb25zZVNhZmVcbiAgICB9KTtcblxuICAgIGRhdGFUYWcucHVzaFZhbHVlKCdtZXRob2QnLCAncG9zdCcpO1xuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtuYW1lfSlcbiU+PGZvcm0ke2RhdGFUYWcucmVidWlsZFNwYWNlKCl9PlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbm5lY3RvckZvcm1DYWxsXCIgdmFsdWU9XCIke25hbWV9XCIvPiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGFkZEZpbmFsaXplQnVpbGRBbnlDb25uZWN0aW9uKCdDb25uZWN0SGVyZUZvcm0nLCAnY29ubmVjdG9yRm9ybUNhbGwnLCAnZm9ybScsIHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgaSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgb3JkZXI6IFske2kub3JkZXI/Lm1hcD8uKGl0ZW0gPT4gYFwiJHtpdGVtfVwiYCk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICB9YFxuICAgIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9ySW5mbzogYW55KSB7XG5cbiAgICBkZWxldGUgdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JGb3JtQ2FsbDtcblxuICAgIGxldCB2YWx1ZXMgPSBbXTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLm9yZGVyLmxlbmd0aCkgLy8gcHVzaCB2YWx1ZXMgYnkgc3BlY2lmaWMgb3JkZXJcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNvbm5lY3RvckluZm8ub3JkZXIpXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzUGFnZS5Qb3N0W2ldKTtcbiAgICBlbHNlXG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLk9iamVjdC52YWx1ZXModGhpc1BhZ2UuUG9zdCkpO1xuXG5cbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiB8IHN0cmluZ1tdID0gdHJ1ZTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLnZhbGlkYXRvci5sZW5ndGgpIHsgLy8gdmFsaWRhdGUgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHBhcnNlVmFsdWVzKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgICAgICBpc1ZhbGlkID0gYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgIH1cblxuICAgIGxldCByZXNwb25zZTogYW55O1xuXG4gICAgaWYgKGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5zZW5kVG8oLi4udmFsdWVzKTtcbiAgICBlbHNlIGlmIChjb25uZWN0b3JJbmZvLm5vdFZhbGlkKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8ubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKTtcblxuICAgIGlmIChpc1ZhbGlkICYmICFyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8ubWVzc2FnZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShpc1ZhbGlkWzBdKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzcG9uc2UgPSBjb25uZWN0b3JJbmZvLm1lc3NhZ2U7XG5cbiAgICBpZiAocmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLnNhZmUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUocmVzcG9uc2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZShyZXNwb25zZSk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmNvbnN0IHJlY29yZFN0b3JlID0gbmV3IFN0b3JlSlNPTignUmVjb3JkcycpO1xuXG5mdW5jdGlvbiByZWNvcmRMaW5rKGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdsaW5rJywgc21hbGxQYXRoVG9QYWdlKHNlc3Npb25JbmZvLnNtYWxsUGF0aCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVJlY29yZFBhdGgoZGVmYXVsdE5hbWU6IHN0cmluZywgZGF0YVRhZzogVGFnRGF0YVBhcnNlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGxpbmsgPSByZWNvcmRMaW5rKGRhdGFUYWcsIHNlc3Npb25JbmZvKSwgc2F2ZU5hbWUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ25hbWUnLCBkZWZhdWx0TmFtZSk7XG5cbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0gPz89IHt9O1xuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSA/Pz0gJyc7XG4gICAgc2Vzc2lvbkluZm8ucmVjb3JkKHNhdmVOYW1lKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0b3JlOiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0sXG4gICAgICAgIGN1cnJlbnQ6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSxcbiAgICAgICAgbGlua1xuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc2Vzc2lvbkluZm8uc21hbGxQYXRoLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSAvLyBkbyBub3QgYWxsb3cgdGhpcyBmb3IgY29tcGlsaW5nIGNvbXBvbmVudCBhbG9uZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgICAgIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBodG1sID0gaHRtbC50cmltKCk7XG5cbiAgICBjb25zdCB7IHN0b3JlLCBsaW5rIH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9yZWNvcmQuc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc3RvcmVbbGlua10uaW5jbHVkZXMoaHRtbCkpIHtcbiAgICAgICAgc3RvcmVbbGlua10gKz0gaHRtbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVCZWZvcmVSZUJ1aWxkKHNtYWxsUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbmFtZSA9IHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGgpO1xuICAgIGZvciAoY29uc3Qgc2F2ZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBpdGVtID0gcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZV07XG5cbiAgICAgICAgaWYgKGl0ZW1bbmFtZV0pIHtcbiAgICAgICAgICAgIGl0ZW1bbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkZWxldGUgaXRlbVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uLmRlYnVnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgb2Ygc2Vzc2lvbi5yZWNvcmROYW1lcykge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyQ29tcGlsZSgpIHtcbiAgICByZWNvcmRTdG9yZS5jbGVhcigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHJlY29yZFN0b3JlLnN0b3JlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ01hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdub2RlLWh0bWwtcGFyc2VyJztcbmltcG9ydCB7IG1ha2VSZWNvcmRQYXRoIH0gZnJvbSAnLi9yZWNvcmQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBUYWdEYXRhUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmICghc2Vzc2lvbkluZm8uc21hbGxQYXRoLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSAvLyBkbyBub3QgYWxsb3cgdGhpcyBmb3IgY29tcGlsaW5nIGNvbXBvbmVudCBhbG9uZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgICAgIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IHN0b3JlLCBsaW5rLCBjdXJyZW50IH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9zZWFyY2guc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBzZWFyY2hPYmplY3QgPSBidWlsZE9iamVjdChodG1sLCBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ21hdGNoJywgJ2gxW2lkXSwgaDJbaWRdLCBoM1tpZF0sIGg0W2lkXSwgaDVbaWRdLCBoNltpZF0nKSk7XG5cbiAgICBpZiAoIWN1cnJlbnQpIHtcbiAgICAgICAgc3RvcmVbbGlua10gPSBzZWFyY2hPYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihjdXJyZW50LnRpdGxlcywgc2VhcmNoT2JqZWN0LnRpdGxlcyk7XG5cbiAgICAgICAgaWYgKCFjdXJyZW50LnRleHQuaW5jbHVkZXMoc2VhcmNoT2JqZWN0LnRleHQpKSB7XG4gICAgICAgICAgICBjdXJyZW50LnRleHQgKz0gc2VhcmNoT2JqZWN0LnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0KGh0bWw6IHN0cmluZywgbWF0Y2g6IHN0cmluZykge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJzZShodG1sLCB7XG4gICAgICAgIGJsb2NrVGV4dEVsZW1lbnRzOiB7XG4gICAgICAgICAgICBzY3JpcHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3R5bGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9zY3JpcHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRpdGxlczogU3RyaW5nTWFwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKSkge1xuICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQuYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgdGl0bGVzW2lkXSA9IGVsZW1lbnQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZXMsXG4gICAgICAgIHRleHQ6IHJvb3QuaW5uZXJUZXh0LnRyaW0oKS5yZXBsYWNlKC9bIFxcbl17Mix9L2csICcgJykucmVwbGFjZSgvW1xcbl0vZywgJyAnKVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9Db21wb25lbnRzL2NsaWVudCc7XG5pbXBvcnQgc2NyaXB0IGZyb20gJy4vQ29tcG9uZW50cy9zY3JpcHQvaW5kZXgnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vQ29tcG9uZW50cy9zdHlsZS9pbmRleCc7XG5pbXBvcnQgcGFnZSBmcm9tICcuL0NvbXBvbmVudHMvcGFnZSc7XG5pbXBvcnQgaXNvbGF0ZSBmcm9tICcuL0NvbXBvbmVudHMvaXNvbGF0ZSc7XG5pbXBvcnQgc3ZlbHRlIGZyb20gJy4vQ29tcG9uZW50cy9zdmVsdGUnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJy4vQ29tcG9uZW50cy9tYXJrZG93bic7XG5pbXBvcnQgaGVhZCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRIZWFkIH0gZnJvbSAnLi9Db21wb25lbnRzL2hlYWQnO1xuaW1wb3J0IGNvbm5lY3QsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdCwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckNvbm5lY3QgfSBmcm9tICcuL0NvbXBvbmVudHMvY29ubmVjdCc7XG5pbXBvcnQgZm9ybSwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRGb3JtLCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yRm9ybSB9IGZyb20gJy4vQ29tcG9uZW50cy9mb3JtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHJlY29yZCwgeyB1cGRhdGVSZWNvcmRzLCBwZXJDb21waWxlIGFzIHBlckNvbXBpbGVSZWNvcmQsIHBvc3RDb21waWxlIGFzIHBvc3RDb21waWxlUmVjb3JkLCBkZWxldGVCZWZvcmVSZUJ1aWxkIH0gZnJvbSAnLi9Db21wb25lbnRzL3JlY29yZCc7XG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vQ29tcG9uZW50cy9zZWFyY2gnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZXhwb3J0IGNvbnN0IEFsbEJ1aWxkSW4gPSBbXCJjbGllbnRcIiwgXCJzY3JpcHRcIiwgXCJzdHlsZVwiLCBcInBhZ2VcIiwgXCJjb25uZWN0XCIsIFwiaXNvbGF0ZVwiLCBcImZvcm1cIiwgXCJoZWFkXCIsIFwic3ZlbHRlXCIsIFwibWFya2Rvd25cIiwgXCJyZWNvcmRcIiwgXCJzZWFyY2hcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGFydENvbXBpbGluZyhwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBUYWdEYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBsZXQgcmVEYXRhOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+O1xuXG4gICAgc3dpdGNoICh0eXBlLmVxLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSBcImNsaWVudFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY2xpZW50KHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJlY29yZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcmVjb3JkKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNlYXJjaCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBzY3JpcHQoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3R5bGUoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwYWdlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBwYWdlKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNvbm5lY3QodHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtXCI6XG4gICAgICAgICAgICByZURhdGEgPSBmb3JtKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImlzb2xhdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGlzb2xhdGUoQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJoZWFkXCI6XG4gICAgICAgICAgICByZURhdGEgPSBoZWFkKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN2ZWx0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3ZlbHRlKHR5cGUsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWFya2Rvd25cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IG1hcmtkb3duKHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBvbmVudCBpcyBub3QgYnVpbGQgeWV0XCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0luY2x1ZGUodGFnbmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEFsbEJ1aWxkSW4uaW5jbHVkZXModGFnbmFtZS50b0xvd2VyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdXBkYXRlUmVjb3JkcyhzZXNzaW9uSW5mbyk7XG5cbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRDb25uZWN0KHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkRm9ybShwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSgvQENvbm5lY3RIZXJlKDs/KS9naSwgJycpLnJlcGxhY2UoL0BDb25uZWN0SGVyZUZvcm0oOz8pL2dpLCAnJyk7XG5cbiAgICBwYWdlRGF0YSA9IGF3YWl0IGFkZEZpbmFsaXplQnVpbGRIZWFkKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgZnVsbENvbXBpbGVQYXRoKTtcbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKHR5cGU6IHN0cmluZywgdGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yOiBhbnkpIHtcbiAgICBpZiAodHlwZSA9PSAnY29ubmVjdCcpXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JDb25uZWN0KHRoaXNQYWdlLCBjb25uZWN0b3IpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckZvcm0odGhpc1BhZ2UsIGNvbm5lY3Rvcik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgXG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBQYXJzZURlYnVnSW5mbywgQ3JlYXRlRmlsZVBhdGgsIFBhdGhUeXBlcywgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQWxsQnVpbGRJbiwgSXNJbmNsdWRlLCBTdGFydENvbXBpbGluZyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgQXJyYXlNYXRjaCB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQge0NvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciwgcG9vbCB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGFnRGF0YVBhcnNlciBmcm9tICcuL1hNTEhlbHBlcnMvVGFnRGF0YVBhcnNlcic7XG5cblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc2VydENvbXBvbmVudCBleHRlbmRzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIHB1YmxpYyBkaXJGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbjtcbiAgICBwdWJsaWMgQ29tcGlsZUluRmlsZTogQ29tcGlsZUluRmlsZUZ1bmM7XG4gICAgcHVibGljIE1pY3JvUGx1Z2luczogU3RyaW5nQXJyYXlPck9iamVjdDtcbiAgICBwdWJsaWMgR2V0UGx1Z2luOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XG4gICAgcHVibGljIFNvbWVQbHVnaW5zOiAoLi4ubmFtZXM6IHN0cmluZ1tdKSA9PiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1RzOiAoKSA9PiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZWdleFNlYXJjaDogUmVnRXhwO1xuXG4gICAgY29uc3RydWN0b3IoUGx1Z2luQnVpbGQ6IEFkZFBsdWdpbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBTZW5kRGF0YUZ1bmM6ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSAmJiB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKSkge1xuICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YS5TcGFjZU9uZSgnICcpO1xuXG4gICAgICAgICAgICBkYXRhVGFnID0gZGF0YVRhZ1NwbGljZWQucmVidWlsZFNwYWNlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiBUYWdEYXRhUGFyc2VyLCBjb21wb25lbnQ6IFN0cmluZ1RyYWNrZXIpIHtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9ID0gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKGNvbXBvbmVudCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7a2V5LHZhbHVlfSBvZiB0YWdEYXRhLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBrZXksIFwiZ2lcIik7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UocmUsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogVGFnRGF0YVBhcnNlciwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhOiBUYWdEYXRhUGFyc2VyLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBpbXBvcnRTb3VyY2UgPSAnLycgKyB0eXBlLmV4dHJhY3RJbmZvKCk7XG5cbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZScsIGltcG9ydFNvdXJjZSlcbiAgICAgICAgZGF0YS5wdXNoVmFsdWUoJ2ltcG9ydFNvdXJjZURpcmVjdG9yeScsIHBhdGguZGlybmFtZShpbXBvcnRTb3VyY2UpKVxuXG4gICAgICAgIGNvbnN0ICBtYXBBdHRyaWJ1dGVzID0gZGF0YS5tYXAoKTtcbiAgICAgICAgbWFwQXR0cmlidXRlcy5yZWFkZXIgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG5cbiAgICAgICAgcmV0dXJuIG1hcEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlciB9KSB7XG4gICAgICAgIGNvbnN0IGRhdGFQYXJzZXIgPSBuZXcgVGFnRGF0YVBhcnNlcihkYXRhVGFnKSwgQnVpbGRJbiA9IElzSW5jbHVkZSh0eXBlLmVxKTtcbiAgICAgICAgYXdhaXQgZGF0YVBhcnNlci5wYXJzZXIoKTtcblxuICAgICAgICBsZXQgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaEluQ29tbWVudCA9IHRydWUsIEFsbFBhdGhUeXBlczogUGF0aFR5cGVzID0ge30sIGFkZFN0cmluZ0luZm86IHN0cmluZztcblxuICAgICAgICBpZiAoQnVpbGRJbikgey8vY2hlY2sgaWYgaXQgYnVpbGQgaW4gY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCB7IGNvbXBpbGVkU3RyaW5nLCBjaGVja0NvbXBvbmVudHMgfSA9IGF3YWl0IFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lLCB0eXBlLCBkYXRhUGFyc2VyLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGFQYXJzZXIucG9wSGF2ZURlZmF1bHQoJ2ZvbGRlcicsICcuJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2Uoc2Vzc2lvbkluZm8sIGFsbERhdGEsIHRoaXMuaXNUcygpKTtcblxuICAgICAgICAgICAgLyphZGQgc3BlY2lhbCBhdHRyaWJ1dGVzICovXG4gICAgICAgICAgICBjb25zdCBtYXBBdHRyaWJ1dGVzID0gSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGFQYXJzZXIsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCB7YXR0cmlidXRlczogbWFwQXR0cmlidXRlc30pO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhUGFyc2VyLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke3RhZ1R5cGV9XCIsIHVzZWQgaW46ICR7dGFnVHlwZS5hdCgwKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBwb29sIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ3MgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBDUnVuVGltZSBmcm9tIFwiLi9Db21waWxlXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5cbmNvbnN0IGlnbm9yZUluaGVyaXQgPSBbJ2NvZGVmaWxlJ107XG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7IGRlZmluZToge30gfTtcblxuYXN5bmMgZnVuY3Rpb24gUGFnZUJhc2VQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICBjaGFyOiBzdHJpbmdcbiAgICB9W11cbn0+IHtcbiAgICBjb25zdCBwYXJzZSA9IGF3YWl0IHBvb2wuZXhlYygnUGFnZUJhc2VQYXJzZXInLCBbdGV4dF0pO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBhcnNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsIGNoYXI/OiBzdHJpbmcgfVtdID0gW11cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIG5vbkR5bmFtaWMoaXNEeW5hbWljOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghaXNEeW5hbWljKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGF2ZUR5bmFtaWMgPSB0aGlzLnBvcEFueSgnZHluYW1pYycpO1xuICAgICAgICBpZiAoaGF2ZUR5bmFtaWMgIT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgICAgICBwYXJzZS5jbGVhckRhdGEgPSB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgICAgIHBhcnNlLnZhbHVlQXJyYXkgPSBbLi4udGhpcy52YWx1ZUFycmF5LCB7IGtleTogJ2R5bmFtaWMnLCB2YWx1ZTogdHJ1ZSB9XTtcblxuICAgICAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHBhcnNlLmNsZWFyRGF0YS5lcSk7XG5cbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnZHluYW1pYy1zc3ItaW1wb3J0JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQWRkaW5nIFxcJ2R5bmFtaWNcXCcgYXR0cmlidXRlIHRvIGZpbGUgJyArIHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgeyBhdHRyaWJ1dGVzLCBkeW5hbWljQ2hlY2t9OiB7IGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXAsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCB0aGlzLnNlc3Npb25JbmZvLCBzbWFsbFBhdGgsIHRoaXMuaXNUcyk7XG4gICAgICAgIHRoaXMuY29kZSA9IGF3YWl0IHJ1bi5jb21waWxlKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGFyc2VCYXNlKHRoaXMuY29kZSk7XG4gICAgICAgIGlmKHRoaXMubm9uRHluYW1pYyhkeW5hbWljQ2hlY2spKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkQ29kZUZpbGUocGFnZVBhdGgsIHNtYWxsUGF0aCwgdGhpcy5pc1RzLCBwYWdlTmFtZSk7XG5cbiAgICAgICAgdGhpcy5sb2FkRGVmaW5lKHsgLi4uc2V0dGluZ3MuZGVmaW5lLCAuLi5ydW4uZGVmaW5lIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gYXdhaXQgUGFnZUJhc2VQYXJzZXIoY29kZS5lcSk7XG5cbiAgICAgICAgaWYocGFyc2VyLnN0YXJ0ID09IHBhcnNlci5lbmQpe1xuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBjb2RlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGNvbnN0IHtjaGFyLGVuZCxrZXksc3RhcnR9IG9mIHBhcnNlci52YWx1ZXMpe1xuICAgICAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goe2tleSwgdmFsdWU6IHN0YXJ0ID09PSBlbmQgPyB0cnVlOiBjb2RlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgY2hhcn0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUuc3Vic3RyaW5nKDAsIHBhcnNlci5zdGFydCkuUGx1cyhjb2RlLnN1YnN0cmluZyhwYXJzZXIuZW5kKSkudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZiAoIXRoaXMudmFsdWVBcnJheS5sZW5ndGgpIHJldHVybiB0aGlzLmNsZWFyRGF0YTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnQFsnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSwgY2hhciB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9PSR7Y2hhcn0ke3ZhbHVlfSR7Y2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9IGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkLnN1YnN0cmluZygwLCBidWlsZC5sZW5ndGgtMSkuUGx1cygnXVxcbicpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGF3YWl0IHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBpZihpZ25vcmVJbmhlcml0LmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcGFyc2UucG9wKG5hbWUpXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGA8QCR7bmFtZX0+PDoke25hbWV9Lz48L0Ake25hbWV9PmApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZS5yZWJ1aWxkKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlLmNsZWFyRGF0YS5QbHVzKGJ1aWxkKTtcbiAgICB9XG5cbiAgICBnZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3AobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleSA9PT0gbmFtZSksIDEpWzBdPy52YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BBbnkobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmVOYW1lID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LnRvTG93ZXJDYXNlKCkgPT0gbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhdmVOYW1lICE9IC0xKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaGF2ZU5hbWUsIDEpWzBdLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFzVGFnID0gZ2V0RGF0YVRhZ3ModGhpcy5jbGVhckRhdGEsIFtuYW1lXSwgJ0AnKTtcblxuICAgICAgICBpZiAoIWFzVGFnLmZvdW5kWzBdKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBhc1RhZy5kYXRhO1xuXG4gICAgICAgIHJldHVybiBhc1RhZy5mb3VuZFswXS5kYXRhLnRyaW0oKTtcbiAgICB9XG5cbiAgICBieVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maWx0ZXIoeCA9PiB4LnZhbHVlICE9PSB0cnVlICYmIHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBkZWZhdWx0VmFsdWVQb3BBbnk8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IFQpOiBzdHJpbmcgfCBUIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wb3BBbnkobmFtZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlPy5lcTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5kZWZhdWx0VmFsdWVQb3BBbnkoJ2NvZGVmaWxlJywgJ2luaGVyaXQnKTtcbiAgICAgICAgaWYgKCFoYXZlQ29kZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLmRlZmF1bHRWYWx1ZVBvcEFueSgnbGFuZycsICdqcycpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gaGF2ZUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYWdlUGF0aDtcblxuICAgICAgICBjb25zdCBoYXZlRXh0ID0gcGF0aC5leHRuYW1lKGhhdmVDb2RlKS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoaGF2ZUV4dCkpIHtcbiAgICAgICAgICAgIGlmICgvKFxcXFx8XFwvKSQvLnRlc3QoaGF2ZUNvZGUpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhZ2VQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGlmICghQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhoYXZlRXh0KSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYXRoLmV4dG5hbWUocGFnZVBhdGgpO1xuICAgICAgICAgICAgaGF2ZUNvZGUgKz0gJy4nICsgKGxhbmcgPyBsYW5nIDogaXNUcyA/ICd0cycgOiAnanMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQ29kZVswXSA9PSAnLicpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocGFnZVBhdGgpLCBoYXZlQ29kZSlcblxuICAgICAgICBjb25zdCBTbWFsbFBhdGggPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGhhdmVDb2RlKTtcblxuICAgICAgICBpZiAoYXdhaXQgdGhpcy5zZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgaGF2ZUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IGJhc2VNb2RlbERhdGEuYWxsRGF0YS5yZXBsYWNlQWxsKFwiQFwiLCBcIkBAXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soJzwlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEFmdGVyTm9UcmFjaygnJT4nKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcgJiYgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgfSBlbHNlIGlmKG9yaWdpbmFsVmFsdWUgPT0gJ2luaGVyaXQnICYmIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcpe1xuICAgICAgICAgICAgRWFzeUZzLndyaXRlRmlsZShoYXZlQ29kZSwgJycpO1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NyZWF0ZS1jb2RlLWZpbGUnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgY3JlYXRlZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlLWZpbGUtbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcihwYWdlTmFtZSwgSlNQYXJzZXIucHJpbnRFcnJvcihgQ29kZSBGaWxlIE5vdCBGb3VuZDogJyR7cGFnZVNtYWxsUGF0aH0nIC0+ICcke1NtYWxsUGF0aH0nYCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgc3RyaW5nKVtdW10gPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcy51bnNoaWZ0KC4uLk9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpKVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IENvbnZlcnRTeW50YXhNaW5pIH0gZnJvbSBcIi4uLy4uL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4XCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSBcIi4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENSdW5UaW1lIHtcbiAgICBkZWZpbmUgPSB7fVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzY3JpcHQ6IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBpc1RzOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHRlbXBsYXRlU2NyaXB0KHNjcmlwdHM6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG5fX3dyaXRlID0ge3RleHQ6ICcnfTtfX3dyaXRlQXJyYXkudW5zaGlmdChfX3dyaXRlKTtgKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhpKVxuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxucmV0dXJuIF9fd3JpdGVBcnJheWApO1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXRob2RzKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgY29uc3QgX19sb2NhbHBhdGggPSAnLycgKyBzbWFsbFBhdGhUb1BhZ2UodGhpcy5zZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RyaW5nOiAnc2NyaXB0LHN0eWxlLGRlZmluZSxzdG9yZSxwYWdlX19maWxlbmFtZSxwYWdlX19kaXJuYW1lLF9fbG9jYWxwYXRoLGF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgZnVuY3M6IFtcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnNjcmlwdC5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc3R5bGUuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHRoaXMuZGVmaW5lW1N0cmluZyhrZXkpXSA9IHZhbHVlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY29tcGlsZVJ1blRpbWVTdG9yZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoLFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLnNlc3Npb25JbmZvLmZ1bGxQYXRoKSxcbiAgICAgICAgICAgICAgICBfX2xvY2FscGF0aCxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzIHx8IHt9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGRDb2RlKHBhcnNlcjogSlNQYXJzZXIsIGJ1aWxkU3RyaW5nczogeyB0ZXh0OiBzdHJpbmcgfVtdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKGkudGV4dClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGJ1aWxkU3RyaW5ncy5wb3AoKS50ZXh0LCBpLnRleHQuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIGFzeW5jIGNvbXBpbGUoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgICAgICAvKiBsb2FkIGZyb20gY2FjaGUgKi9cbiAgICAgICAgY29uc3QgaGF2ZUNhY2hlID0gdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdO1xuICAgICAgICBpZiAoaGF2ZUNhY2hlKVxuICAgICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXZlQ2FjaGUpKHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKS5mdW5jcyk7XG4gICAgICAgIGxldCBkb0ZvckFsbDogKHJlc29sdmU6IChmdW5jczogYW55W10pID0+IFN0cmluZ1RyYWNrZXIgfCBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSA9PiB2b2lkO1xuICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IGRvRm9yQWxsID0gcik7XG5cbiAgICAgICAgLyogcnVuIHRoZSBzY3JpcHQgKi9cbiAgICAgICAgdGhpcy5zY3JpcHQgPSBhd2FpdCBDb252ZXJ0U3ludGF4TWluaSh0aGlzLnNjcmlwdCwgXCJAY29tcGlsZVwiLCBcIipcIik7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcih0aGlzLnNjcmlwdCwgdGhpcy5zbWFsbFBhdGgsICc8JSonLCAnJT4nKTtcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgaWYgKHBhcnNlci52YWx1ZXMubGVuZ3RoID09IDEgJiYgcGFyc2VyLnZhbHVlc1swXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiB0aGlzLnNjcmlwdDtcbiAgICAgICAgICAgIGRvRm9yQWxsKHJlc29sdmUpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFt0eXBlLCBmaWxlUGF0aF0gPSBTcGxpdEZpcnN0KCcvJywgdGhpcy5zbWFsbFBhdGgpLCB0eXBlQXJyYXkgPSBnZXRUeXBlc1t0eXBlXSA/PyBnZXRUeXBlcy5TdGF0aWMsXG4gICAgICAgICAgICBjb21waWxlUGF0aCA9IHR5cGVBcnJheVsxXSArIGZpbGVQYXRoICsgJy5jb21wLmpzJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChmaWxlUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVTY3JpcHQocGFyc2VyLnZhbHVlcy5maWx0ZXIoeCA9PiB4LnR5cGUgIT0gJ3RleHQnKS5tYXAoeCA9PiB4LnRleHQpKTtcbiAgICAgICAgY29uc3QgeyBmdW5jcywgc3RyaW5nIH0gPSB0aGlzLm1ldGhvZHMoYXR0cmlidXRlcylcblxuICAgICAgICBjb25zdCB0b0ltcG9ydCA9IGF3YWl0IGNvbXBpbGVJbXBvcnQoc3RyaW5nLCBjb21waWxlUGF0aCwgZmlsZVBhdGgsIHR5cGVBcnJheSwgdGhpcy5pc1RzLCB0aGlzLnNlc3Npb25JbmZvLmRlYnVnLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgY29uc3QgZXhlY3V0ZSA9IGFzeW5jIChmdW5jczogYW55W10pID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVidWlsZENvZGUocGFyc2VyLCBhd2FpdCB0b0ltcG9ydCguLi5mdW5jcykpO1xuICAgICAgICAgICAgfSBjYXRjaChlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBlcnIsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IGV4ZWN1dGU7IC8vIHNhdmUgdGhpcyB0byBjYWNoZVxuICAgICAgICBjb25zdCB0aGlzRmlyc3QgPSBhd2FpdCBleGVjdXRlKGZ1bmNzKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdAc3djL2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBpc1RzIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHBhZ2VEZXBzIH0gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlRGVwc1wiO1xuaW1wb3J0IEN1c3RvbUltcG9ydCwgeyBpc1BhdGhDdXN0b20gfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvaW5kZXhcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yLCBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwgfSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWRcIjtcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L0FsaWFzXCI7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9Db25zb2xlXCI7XG5pbXBvcnQgeyBDb21tb25qcywgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBDb21tb25qcyh7XG4gICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgcGFyc2VyOiB7XG4gICAgICAgIHN5bnRheDogaXNUeXBlc2NyaXB0ID8gXCJ0eXBlc2NyaXB0XCIgOiBcImVjbWFzY3JpcHRcIixcbiAgICAgICAgLi4uR2V0UGx1Z2luKChpc1R5cGVzY3JpcHQgPyAnVFMnIDogJ0pTJykgKyBcIk9wdGlvbnNcIilcbiAgICAgIH1cbiAgICB9KSxcbiAgICBtaW5pZnk6IGNvZGVNaW5pZnksXG4gICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgIHNvdXJjZU1hcHM6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/IHRydWUgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBvdXRwdXRQYXRoOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKVxuICB9KTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7IGRlYnVnOiBcIlwiICsgaXNEZWJ1ZyB9KTtcbiAgUmVzdWx0ID0gdGVtcGxhdGUoXG4gICAgUmVzdWx0LFxuICAgIGlzRGVidWcsXG4gICAgcGF0aC5kaXJuYW1lKHRlbXBsYXRlUGF0aCksXG4gICAgdGVtcGxhdGVQYXRoLFxuICAgIHBhcmFtc1xuICApO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShSZXN1bHQsIE9wdGlvbnMpO1xuICAgIFJlc3VsdCA9IG1lcmdlVHJhY2sgJiYgbWFwICYmIChhd2FpdCBiYWNrVG9PcmlnaW5hbChtZXJnZVRyYWNrLCBjb2RlLCBtYXApKS5TdHJpbmdXaXRoVGFjayhzYXZlUGF0aCkgfHwgY29kZTtcblxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNhdmVQYXRoKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHNhdmVQYXRoLCBSZXN1bHQpO1xuICB9XG4gIHJldHVybiBSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIENoZWNrVHMoRmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gRmlsZVBhdGguZW5kc1dpdGgoXCIudHNcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gIHJldHVybiBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICB0eXBlQXJyYXlbMF0gKyBJblN0YXRpY1BhdGgsXG4gICAgdHlwZUFycmF5WzFdICsgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIsXG4gICAgQ2hlY2tUcyhJblN0YXRpY1BhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRFeHRlbnNpb24oRmlsZVBhdGg6IHN0cmluZykge1xuICBjb25zdCBmaWxlRXh0ID0gcGF0aC5leHRuYW1lKEZpbGVQYXRoKTtcblxuICBpZiAoQmFzaWNTZXR0aW5ncy5wYXJ0RXh0ZW5zaW9ucy5pbmNsdWRlcyhmaWxlRXh0LnN1YnN0cmluZygxKSkpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyAoaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiKVxuICBlbHNlIGlmIChmaWxlRXh0ID09ICcnKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNbaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiXTtcblxuICByZXR1cm4gRmlsZVBhdGg7XG59XG5cbmNvbnN0IFNhdmVkTW9kdWxlcyA9IHt9LCBQcmVwYXJlTWFwID0ge307XG5cbi8qKlxuICogTG9hZEltcG9ydCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIHRvIGEgZmlsZSwgYW5kIHJldHVybnMgdGhlIG1vZHVsZSB0aGF0IGlzIGF0IHRoYXQgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IGltcG9ydEZyb20gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGNyZWF0ZWQgdGhpcyBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gSW5TdGF0aWNQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gW3VzZURlcHNdIC0gVGhpcyBpcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB3aXRob3V0Q2FjaGUgLSBhbiBhcnJheSBvZiBwYXRocyB0aGF0IHdpbGwgbm90IGJlIGNhY2hlZC5cbiAqIEByZXR1cm5zIFRoZSBtb2R1bGUgdGhhdCB3YXMgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIExvYWRJbXBvcnQoaW1wb3J0RnJvbTogc3RyaW5nLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgeyBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHMsIHdpdGhvdXRDYWNoZSA9IFtdLCBvbmx5UHJlcGFyZSB9OiB7IGlzRGVidWc6IGJvb2xlYW4sIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZT86IHN0cmluZ1tdLCBvbmx5UHJlcGFyZT86IGJvb2xlYW4gfSkge1xuICBsZXQgVGltZUNoZWNrOiBhbnk7XG4gIGNvbnN0IG9yaWdpbmFsUGF0aCA9IHBhdGgubm9ybWFsaXplKEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcblxuICBJblN0YXRpY1BhdGggPSBBZGRFeHRlbnNpb24oSW5TdGF0aWNQYXRoKTtcbiAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKEluU3RhdGljUGF0aCkuc3Vic3RyaW5nKDEpLCB0aGlzQ3VzdG9tID0gaXNQYXRoQ3VzdG9tKG9yaWdpbmFsUGF0aCwgZXh0ZW5zaW9uKSB8fCAhWydqcycsICd0cyddLmluY2x1ZGVzKGV4dGVuc2lvbik7XG4gIGNvbnN0IFNhdmVkTW9kdWxlc1BhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgpLCBmaWxlUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIEluU3RhdGljUGF0aCk7XG5cbiAgLy93YWl0IGlmIHRoaXMgbW9kdWxlIGlzIG9uIHByb2Nlc3MsIGlmIG5vdCBkZWNsYXJlIHRoaXMgYXMgb24gcHJvY2VzcyBtb2R1bGVcbiAgbGV0IHByb2Nlc3NFbmQ6ICh2PzogYW55KSA9PiB2b2lkO1xuICBpZiAoIW9ubHlQcmVwYXJlKSB7XG4gICAgaWYgKCFTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0pXG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IHByb2Nlc3NFbmQgPSByKTtcbiAgICBlbHNlIGlmIChTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgYXdhaXQgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuICB9XG5cblxuICAvL2J1aWxkIHBhdGhzXG4gIGNvbnN0IHJlQnVpbGQgPSAhcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gfHwgcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gIT0gKFRpbWVDaGVjayA9IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCkpO1xuXG5cbiAgaWYgKHJlQnVpbGQpIHtcbiAgICBUaW1lQ2hlY2sgPSBUaW1lQ2hlY2sgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKTtcbiAgICBpZiAoVGltZUNoZWNrID09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7SW5TdGF0aWNQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7aW1wb3J0RnJvbX0nYFxuICAgICAgfSk7XG4gICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG51bGxcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXNDdXN0b20pIC8vIG9ubHkgaWYgbm90IGN1c3RvbSBidWlsZFxuICAgICAgYXdhaXQgQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcpO1xuICAgIHBhZ2VEZXBzLnVwZGF0ZShTYXZlZE1vZHVsZXNQYXRoLCBUaW1lQ2hlY2spO1xuICB9XG5cbiAgaWYgKHVzZURlcHMpIHtcbiAgICB1c2VEZXBzW0luU3RhdGljUGF0aF0gPSB7IHRoaXNGaWxlOiBUaW1lQ2hlY2sgfTtcbiAgICB1c2VEZXBzID0gdXNlRGVwc1tJblN0YXRpY1BhdGhdO1xuICB9XG5cbiAgY29uc3QgaW5oZXJpdGFuY2VDYWNoZSA9IHdpdGhvdXRDYWNoZVswXSA9PSBJblN0YXRpY1BhdGg7XG4gIGlmIChpbmhlcml0YW5jZUNhY2hlKVxuICAgIHdpdGhvdXRDYWNoZS5zaGlmdCgpXG4gIGVsc2UgaWYgKCFyZUJ1aWxkICYmIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSAmJiAhKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHJldHVybiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgucmVsYXRpdmUocCwgdHlwZUFycmF5WzBdKTtcbiAgICBlbHNlIHtcbiAgICAgIGlmIChwWzBdID09IFwiLlwiKSB7XG4gICAgICAgIHAgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKEluU3RhdGljUGF0aCksIHApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocFswXSAhPSBcIi9cIilcbiAgICAgICAgcmV0dXJuIEFsaWFzT3JQYWNrYWdlKHApO1xuICAgIH1cblxuICAgIHJldHVybiBMb2FkSW1wb3J0KGZpbGVQYXRoLCBwLCB0eXBlQXJyYXksIHsgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlOiBpbmhlcml0YW5jZUNhY2hlID8gd2l0aG91dENhY2hlIDogW10gfSk7XG4gIH1cblxuICBsZXQgTXlNb2R1bGU6IGFueTtcbiAgaWYgKHRoaXNDdXN0b20pIHtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGgsIGZpbGVQYXRoLCBleHRlbnNpb24sIHJlcXVpcmVNYXApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlcXVpcmVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIpO1xuICAgIE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHJlcXVpcmVQYXRoKTtcblxuICAgIGlmIChvbmx5UHJlcGFyZSkgeyAvLyBvbmx5IHByZXBhcmUgdGhlIG1vZHVsZSB3aXRob3V0IGFjdGl2ZWx5IGltcG9ydGluZyBpdFxuICAgICAgUHJlcGFyZU1hcFtTYXZlZE1vZHVsZXNQYXRoXSA9ICgpID0+IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE15TW9kdWxlID0gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gIH1cblxuICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBNeU1vZHVsZTtcbiAgcHJvY2Vzc0VuZD8uKCk7XG5cbiAgcmV0dXJuIE15TW9kdWxlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0RmlsZShpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZT86IHN0cmluZ1tdKSB7XG4gIGlmICghaXNEZWJ1Zykge1xuICAgIGNvbnN0IFNhdmVkTW9kdWxlc1BhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG4gICAgY29uc3QgaGF2ZUltcG9ydCA9IFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICAgIGlmIChoYXZlSW1wb3J0ICE9IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiBoYXZlSW1wb3J0O1xuICAgIGVsc2UgaWYgKFByZXBhcmVNYXBbU2F2ZWRNb2R1bGVzUGF0aF0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IGF3YWl0IFByZXBhcmVNYXBbU2F2ZWRNb2R1bGVzUGF0aF0oKTtcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG1vZHVsZTtcbiAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIExvYWRJbXBvcnQoaW1wb3J0RnJvbSwgSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIHsgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZU9uY2UoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBmaWxlUGF0aCxcbiAgICB0ZW1wRmlsZSxcbiAgICBDaGVja1RzKGZpbGVQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIGF3YWl0IE15TW9kdWxlKChwYXRoOiBzdHJpbmcpID0+IGltcG9ydChwYXRoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlQ2pzU2NyaXB0KGNvbnRlbnQ6IHN0cmluZykge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0ZW1wRmlsZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kZWwgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBmYWtlIHNjcmlwdCBsb2NhdGlvbiwgYSBmaWxlIGxvY2F0aW9uLCBhIHR5cGUgYXJyYXksIGFuZCBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgb3Igbm90IGl0J3NcbiAqIGEgVHlwZVNjcmlwdCBmaWxlLiBJdCB0aGVuIGNvbXBpbGVzIHRoZSBzY3JpcHQgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIHRoZSBtb2R1bGVcbiAqIFRoaXMgaXMgZm9yIFJ1blRpbWUgQ29tcGlsZSBTY3JpcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2xvYmFsUHJhbXMgLSBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLFxuICogdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNjcmlwdExvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBzY3JpcHQgdG8gYmUgY29tcGlsZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGUgZnJvbSB0aGUgc3RhdGljIGZvbGRlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFtzdHJpbmcsIHN0cmluZ11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlU2NyaXB0IC0gYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIElmIHRydWUsIHRoZSBjb2RlIHdpbGwgYmUgY29tcGlsZWQgd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlQ29kZSAtIFRoZSBjb2RlIHRoYXQgd2lsbCBiZSBjb21waWxlZCBhbmQgc2F2ZWQgdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTWFwQ29tbWVudCAtIHN0cmluZ1xuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUltcG9ydChnbG9iYWxQcmFtczogc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBtZXJnZVRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCB0eXBlQXJyYXlbMV0pO1xuXG4gIGNvbnN0IGZ1bGxTYXZlTG9jYXRpb24gPSBzY3JpcHRMb2NhdGlvbiArIFwiLmNqc1wiO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0eXBlQXJyYXlbMF0gKyBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgc2NyaXB0TG9jYXRpb24sXG4gICAgZnVsbFNhdmVMb2NhdGlvbixcbiAgICBpc1R5cGVTY3JpcHQsXG4gICAgaXNEZWJ1ZyxcbiAgICB7IHBhcmFtczogZ2xvYmFsUHJhbXMsIG1lcmdlVHJhY2ssIHRlbXBsYXRlUGF0aCwgY29kZU1pbmlmeTogZmFsc2UgfVxuICApO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgcCk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydCh0ZW1wbGF0ZVBhdGgsIHAsIHR5cGVBcnJheSwgeyBpc0RlYnVnIH0pO1xuICB9XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoZnVsbFNhdmVMb2NhdGlvbik7XG4gIHJldHVybiBhc3luYyAoLi4uYXJyOiBhbnlbXSkgPT4gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCwgLi4uYXJyKTtcbn0iLCAiaW1wb3J0IHsgU3RyaW5nTWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgTWluaVNlYXJjaCwge1NlYXJjaE9wdGlvbnMsIFNlYXJjaFJlc3VsdH0gZnJvbSAnbWluaXNlYXJjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFJlY29yZCB7XG4gICAgcHJpdmF0ZSBmdWxsUGF0aDogc3RyaW5nXG4gICAgcHJpdmF0ZSBpbmRleERhdGE6IHtba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIHRpdGxlczogU3RyaW5nTWFwLFxuICAgICAgICB0ZXh0OiBzdHJpbmdcbiAgICB9fVxuICAgIHByaXZhdGUgbWluaVNlYXJjaDogTWluaVNlYXJjaDtcbiAgICBjb25zdHJ1Y3RvcihmaWxlcGF0aDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5mdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGZpbGVwYXRoICsgJy5qc29uJ1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoKXtcbiAgICAgICAgdGhpcy5pbmRleERhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZnVsbFBhdGgpO1xuICAgICAgICBjb25zdCB1bndyYXBwZWQ6IHtpZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nfVtdID0gW107XG5cbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IoY29uc3QgcGF0aCBpbiB0aGlzLmluZGV4RGF0YSl7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5pbmRleERhdGFbcGF0aF07XG4gICAgICAgICAgICBmb3IoY29uc3QgaWQgaW4gZWxlbWVudC50aXRsZXMpe1xuICAgICAgICAgICAgICAgIHVud3JhcHBlZC5wdXNoKHtpZDogY291bnRlcisrLCB0ZXh0OiBlbGVtZW50LnRpdGxlc1tpZF0sIHVybDogYC8ke3BhdGh9IyR7aWR9YH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGV4dCwgdXJsOiBgLyR7cGF0aH1gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2ggPSBuZXcgTWluaVNlYXJjaCh7XG4gICAgICAgICAgICBmaWVsZHM6IFsndGV4dCddLFxuICAgICAgICAgICAgc3RvcmVGaWVsZHM6IFsnaWQnLCAndGV4dCcsICd1cmwnXVxuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLm1pbmlTZWFyY2guYWRkQWxsQXN5bmModW53cmFwcGVkKTtcbiAgICB9XG5cbi8qKlxuICogSXQgc2VhcmNoZXMgZm9yIGEgc3RyaW5nIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIG1hdGNoZXNcbiAqIEBwYXJhbSB0ZXh0IC0gVGhlIHRleHQgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSBvcHRpb25zIC0gbGVuZ3RoIC0gbWF4aW11bSBsZW5ndGggLSAqbm90IGN1dHRpbmcgaGFsZiB3b3JkcypcbiAqIFxuICogYWRkQWZ0ZXJNYXhMZW5ndGggLSBhZGQgdGV4dCBpZiBhIHRleHQgcmVzdWx0IHJlYWNoIHRoZSBtYXhpbXVtIGxlbmd0aCwgZm9yIGV4YW1wbGUgJy4uLidcbiAqIEBwYXJhbSB0YWcgLSBUaGUgdGFnIHRvIHdyYXAgYXJvdW5kIHRoZSBmb3VuZGVkIHNlYXJjaCB0ZXJtcy5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIG9iamVjdHMsIGVhY2ggb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGB0ZXh0YCBvZiB0aGUgc2VhcmNoIHJlc3VsdCwgYGxpbmtgIHRvIHRoZSBwYWdlLCBhbmQgYW4gYXJyYXkgb2ZcbiAqIG9iamVjdHMgY29udGFpbmluZyB0aGUgdGVybXMgYW5kIHRoZSBpbmRleCBvZiB0aGUgdGVybSBpbiB0aGUgdGV4dC5cbiAqL1xuICAgIHNlYXJjaCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgJiB7bGVuZ3RoPzogbnVtYmVyLCBhZGRBZnRlck1heExlbmd0aD86IHN0cmluZ30gPSB7ZnV6enk6IHRydWUsIGxlbmd0aDogMjAwLCBhZGRBZnRlck1heExlbmd0aDogJy4uLid9LCB0YWcgPSAnYicpOiAoU2VhcmNoUmVzdWx0ICYge3RleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9KVtde1xuICAgICAgICBjb25zdCBkYXRhID0gPGFueT50aGlzLm1pbmlTZWFyY2guc2VhcmNoKHRleHQsIG9wdGlvbnMpO1xuICAgICAgICBpZighdGFnKSByZXR1cm4gZGF0YTtcblxuICAgICAgICBmb3IoY29uc3QgaSBvZiBkYXRhKXtcbiAgICAgICAgICAgIGZvcihjb25zdCB0ZXJtIG9mIGkudGVybXMpe1xuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubGVuZ3RoICYmIGkudGV4dC5sZW5ndGggPiBvcHRpb25zLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IGkudGV4dC5zdWJzdHJpbmcoMCwgb3B0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZihpLnRleHRbb3B0aW9ucy5sZW5ndGhdLnRyaW0oKSAhPSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLnRleHQgPSBzdWJzdHJpbmcuc3Vic3RyaW5nKDAsIHN1YnN0cmluZy5sYXN0SW5kZXhPZignICcpKSArIChvcHRpb25zLmFkZEFmdGVyTWF4TGVuZ3RoID8/ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IHN1YnN0cmluZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkudGV4dCA9IGkudGV4dC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBsb3dlciA9IGkudGV4dC50b0xvd2VyQ2FzZSgpLCByZWJ1aWxkID0gJyc7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICBsZXQgYmVlbkxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShpbmRleCAhPSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHJlYnVpbGQgKz0gaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoLCBiZWVuTGVuZ3RoICsgaW5kZXgpICsgIGA8JHt0YWd9PiR7aS50ZXh0LnN1YnN0cmluZyhpbmRleCArIGJlZW5MZW5ndGgsIGluZGV4ICsgdGVybS5sZW5ndGggKyBiZWVuTGVuZ3RoKX08LyR7dGFnfT5gXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbG93ZXIuc3Vic3RyaW5nKGluZGV4ICsgdGVybS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBiZWVuTGVuZ3RoICs9IGluZGV4ICsgdGVybS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpLnRleHQgPSByZWJ1aWxkICsgaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHN1Z2dlc3QodGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluaVNlYXJjaC5hdXRvU3VnZ2VzdCh0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG59IiwgImltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSBcIi4uLy4uLy4uL0dsb2JhbC9TZWFyY2hSZWNvcmRcIlxuaW1wb3J0IHtTZXR0aW5nc30gIGZyb20gJy4uLy4uLy4uL01haW5CdWlsZC9TZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG59IiwgImltcG9ydCBwYWNrYWdlRXhwb3J0IGZyb20gXCIuL3BhY2thZ2VFeHBvcnRcIjtcblxuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGFsaWFzTmFtZXMgPSBbcGFja2FnZU5hbWVdXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGg6IHN0cmluZyk6IGFueSB7XG5cbiAgICBzd2l0Y2ggKG9yaWdpbmFsUGF0aCkge1xuICAgICAgICAvL0B0cy1pZ25vcmUtbmV4dC1saW5lXG4gICAgICAgIGNhc2UgcGFja2FnZU5hbWU6XG4gICAgICAgICAgICByZXR1cm4gcGFja2FnZUV4cG9ydCgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXNPclBhY2thZ2Uob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXZlID0gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoaGF2ZSkgcmV0dXJuIGhhdmVcbiAgICByZXR1cm4gaW1wb3J0KG9yaWdpbmFsUGF0aCk7XG59IiwgImltcG9ydCBJbXBvcnRBbGlhcywgeyBhbGlhc05hbWVzIH0gZnJvbSAnLi9BbGlhcyc7XG5pbXBvcnQgSW1wb3J0QnlFeHRlbnNpb24sIHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuL0V4dGVuc2lvbi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikgfHwgYWxpYXNOYW1lcy5pbmNsdWRlcyhvcmlnaW5hbFBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nLCByZXF1aXJlOiAocDogc3RyaW5nKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGlhc0V4cG9ydCA9IGF3YWl0IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGFsaWFzRXhwb3J0KSByZXR1cm4gYWxpYXNFeHBvcnQ7XG4gICAgcmV0dXJuIEltcG9ydEJ5RXh0ZW5zaW9uKGZ1bGxQYXRoLCBleHRlbnNpb24pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBSYXpvclRvRUpTLCBSYXpvclRvRUpTTWluaSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyJztcblxuXG5jb25zdCBhZGRXcml0ZU1hcCA9IHtcbiAgICBcImluY2x1ZGVcIjogXCJhd2FpdCBcIixcbiAgICBcImltcG9ydFwiOiBcImF3YWl0IFwiLFxuICAgIFwidHJhbnNmZXJcIjogXCJyZXR1cm4gYXdhaXQgXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBvcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKUyh0ZXh0LmVxKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhzdWJzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU9JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlOiR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZFdyaXRlTWFwW2kubmFtZV19JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuXG4vKipcbiAqIENvbnZlcnRTeW50YXhNaW5pIHRha2VzIHRoZSBjb2RlIGFuZCBhIHNlYXJjaCBzdHJpbmcgYW5kIGNvbnZlcnQgY3VybHkgYnJhY2tldHNcbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbmQgLSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWRkRUpTIC0gVGhlIHN0cmluZyB0byBhZGQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlanMuXG4gKiBAcmV0dXJucyBBIHN0cmluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXhNaW5pKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbmQ6IHN0cmluZywgYWRkRUpTOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTTWluaSh0ZXh0LmVxLCBmaW5kKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICBpZiAodmFsdWVzW2ldICE9IHZhbHVlc1tpICsgMV0pXG4gICAgICAgICAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpXSwgdmFsdWVzW2kgKyAxXSkpO1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaSArIDJdLCB2YWx1ZXNbaSArIDNdKTtcbiAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZEVKU30ke3N1YnN0cmluZ30lPmA7XG4gICAgfVxuXG4gICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZygodmFsdWVzLmF0KC0xKT8/LTEpICsgMSkpO1xuXG4gICAgcmV0dXJuIGJ1aWxkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBvb2wgfSBmcm9tIFwiLi4vQmFzZVJlYWRlci9SZWFkZXJcIjtcblxuYXN5bmMgZnVuY3Rpb24gSFRNTEF0dHJQYXJzZXIodGV4dDogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgc2s6IG51bWJlcixcbiAgICBlazogbnVtYmVyLFxuICAgIHN2OiBudW1iZXIsXG4gICAgZXY6IG51bWJlcixcbiAgICBzcGFjZTogYm9vbGVhbixcbiAgICBjaGFyOiBzdHJpbmdcbn1bXT4ge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgcG9vbC5leGVjKCdIVE1MQXR0clBhcnNlcicsIFt0ZXh0XSlcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJzZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ0RhdGFQYXJzZXIge1xuICAgIHZhbHVlQXJyYXk6IHtcbiAgICAgICAga2V5PzogU3RyaW5nVHJhY2tlclxuICAgICAgICB2YWx1ZTogU3RyaW5nVHJhY2tlciB8IHRydWUsXG4gICAgICAgIHNwYWNlOiBib29sZWFuLFxuICAgICAgICBjaGFyPzogc3RyaW5nXG4gICAgfVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGV4dDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VyKCkge1xuICAgICAgICBjb25zdCBwYXJzZSA9IGF3YWl0IEhUTUxBdHRyUGFyc2VyKHRoaXMudGV4dC5lcSk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGNoYXIsIGVrLCBldiwgc2ssIHNwYWNlLCBzdiB9IG9mIHBhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGNoYXIsIHNwYWNlLCBrZXk6IHRoaXMudGV4dC5zdWJzdHJpbmcoc2ssIGVrKSwgdmFsdWU6IHN2ID09IGV2ID8gdHJ1ZSA6IHRoaXMudGV4dC5zdWJzdHJpbmcoc3YsIGV2KSB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3BJdGVtKGtleTogc3RyaW5nKXtcbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LmVxLnRvTG93ZXJDYXNlKCkgPT0ga2V5KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09IC0xID8gbnVsbDogdGhpcy52YWx1ZUFycmF5LnNwbGljZShpbmRleCwgMSkuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBwb3BUcmFja2VyKGtleTogc3RyaW5nKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0VHJhY2tlcjxUID0gc3RyaW5nPihrZXk6IHN0cmluZywgdmFsdWU6IFQgPSA8YW55PicnKTogU3RyaW5nVHJhY2tlciB8IG51bGwgfCBUIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMucG9wVHJhY2tlcihrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlUcmFja2VyPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFRyYWNrZXIoa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gZGF0YS5lcTogdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wU3RyaW5nKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucG9wSXRlbShrZXkpPy52YWx1ZVxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyID8gdmFsdWUuZXEgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BCb29sZWFuKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMucG9wU3RyaW5nKGtleSkgPz8gZGVmYXVsdFZhbHVlKVxuICAgIH1cblxuICAgIGV4aXN0cyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleS5lcS50b0xvd2VyQ2FzZSgpID09IGtleSkgIT0gbnVsbFxuICAgIH1cblxuICAgIHBvcEhhdmVEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdib29sZWFuJyA/IHZhbHVlIDogZGF0YTtcbiAgICB9XG5cbiAgICBwb3BBbnlEZWZhdWx0PFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCB2YWx1ZTogVCA9IDxhbnk+JycpOiBzdHJpbmcgfCBudWxsIHwgVCB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBvcFN0cmluZyhrZXkpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YTogdmFsdWU7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSAnY2xhc3MnKTtcbiAgICAgICAgaWYgKGhhdmU/LnZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcilcbiAgICAgICAgICAgIGhhdmUudmFsdWUuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcgKyBjbGFzc05hbWUpLnRyaW1TdGFydCgpO1xuICAgICAgICBlbHNlIGlmIChoYXZlPy52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaGF2ZS52YWx1ZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hWYWx1ZSgnY2xhc3MnLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVidWlsZFNwYWNlKCkge1xuICAgICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgdmFsdWUsIGNoYXIsIGtleSwgc3BhY2UgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIHNwYWNlICYmIG5ld0F0dHJpYnV0ZXMuQWRkVGV4dEFmdGVyTm9UcmFjaygnICcpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzJGAke2tleX09JHtjaGFyfSR7dmFsdWV9JHtjaGFyfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBwdXNoVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkuZXEudG9Mb3dlckNhc2UoKSA9PSBrZXkpO1xuICAgICAgICBpZiAoaGF2ZSkgcmV0dXJuIChoYXZlLnZhbHVlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpKTtcblxuICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwga2V5KSwgdmFsdWU6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKSwgY2hhcjogJ1wiJywgc3BhY2U6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgbWFwKCkge1xuICAgICAgICBjb25zdCBhdHRyTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IHRydWUgfSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSBhdHRyTWFwW2tleS5lcV0gPSB2YWx1ZSA9PT0gdHJ1ZSA/IHRydWUgOiB2YWx1ZS5lcTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyTWFwO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0X2ZpbGUgPSBydW5fc2NyaXB0X25hbWUuc3BsaXQoLy0+fDxsaW5lPi8pLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPGxpbmU+L2dpLCAnPGJyLz4nKSArICc8L3A+PHA+RXJyb3IgbWVzc2FnZTogJyArIGUubWVzc2FnZSArICc8L3A+YCl9JztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXRoOiBcIiArIHJ1bl9zY3JpcHRfbmFtZS5zbGljZSgwLCAtbGFzdF9maWxlLmxlbmd0aCkucmVwbGFjZSgvPGxpbmU+L2dpLCAnXFxcXG4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgpfVwiICsgbGFzdF9maWxlLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBtZXNzYWdlOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBydW5uaW5nIHRoaXMgY29kZTogXFxcXFwiXCIgKyBydW5fc2NyaXB0X2NvZGUgKyAnXCInKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN0YWNrOiBcIiArIGUuc3RhY2spO1xuICAgICAgICAgICAgICAgIH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgfX0pO31gKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbHRDb2RlID0gYXdhaXQgUGFnZVRlbXBsYXRlLlJ1bkFuZEV4cG9ydCh0ZXh0LCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuQWRkUGFnZVRlbXBsYXRlKGJ1aWx0Q29kZSwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHN0YXRpYyBBZGRBZnRlckJ1aWxkKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBJblBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBkYXRhT2JqZWN0OiBhbnksIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhe1xuICAgICAgICAgICAgY29uc3QgX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHsuLi5fcGFnZSR7ZGF0YU9iamVjdCA/ICcsJyArIGRhdGFPYmplY3QgOiAnJ319O1xuICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHslPmApO1xuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjaygnPCUhfX19JT4nKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFJhem9yU3ludGF4IGZyb20gJy4vUmF6b3JTeW50YXgnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdldFN5bnRheChDb21waWxlVHlwZTogYW55KSB7XG4gICAgbGV0IGZ1bmM6IGFueTtcbiAgICBzd2l0Y2ggKENvbXBpbGVUeXBlLm5hbWUgfHwgQ29tcGlsZVR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlJhem9yXCI6XG4gICAgICAgICAgICBmdW5jID0gUmF6b3JTeW50YXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59IiwgImltcG9ydCBBZGRTeW50YXggZnJvbSAnLi9TeW50YXgvSW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZFBsdWdpbiB7XG5cdHB1YmxpYyBTZXR0aW5nc09iamVjdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoU2V0dGluZ3NPYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgICAgIHRoaXMuU2V0dGluZ3NPYmplY3QgPSBTZXR0aW5nc09iamVjdFxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRlZmF1bHRTeW50YXgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2V0dGluZ3NPYmplY3QuQmFzaWNDb21waWxhdGlvblN5bnRheC5jb25jYXQodGhpcy5TZXR0aW5nc09iamVjdC5BZGRDb21waWxlU3ludGF4KTtcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEJhc2ljKHRleHQ6IFN0cmluZ1RyYWNrZXIsIE9EYXRhOnN0cmluZyB8YW55LCBwYXRoOnN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vYWRkIFN5bnRheFxuXG4gICAgICAgIGlmICghT0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KE9EYXRhKSkge1xuICAgICAgICAgICAgT0RhdGEgPSBbT0RhdGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIE9EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBTeW50YXggPSBhd2FpdCBBZGRTeW50YXgoaSk7XG5cbiAgICAgICAgICAgIGlmIChTeW50YXgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gYXdhaXQgU3ludGF4KHRleHQsIGksIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIHBhZ2VzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgY29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRDb21wb25lbnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn0iLCAiLy9nbG9iYWwgc2V0dGluZ3MgZm9yIGJ1aWxkIGluIGNvbXBvbmVudHNcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0ge1xuICAgIHBsdWdpbnM6IFtdXG59OyIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGgsIFBhcnNlRGVidWdMaW5lLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgKiBhcyBleHRyaWNhdGUgZnJvbSAnLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSAnLi90cmFuc2Zvcm0vU2NyaXB0JztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEJ1aWxkU2NyaXB0U2V0dGluZ3MgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncyc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IGZpbmFsaXplQnVpbGQgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHsgQWRkQ29tcGlsZVN5bnRheDogW10sIHBsdWdpbnM6IFtdLCBCYXNpY0NvbXBpbGF0aW9uU3ludGF4OiBbJ1Jhem9yJ10gfTtcbmNvbnN0IFBsdWdpbkJ1aWxkID0gbmV3IEFkZFBsdWdpbihTZXR0aW5ncyk7XG5leHBvcnQgY29uc3QgQ29tcG9uZW50cyA9IG5ldyBJbnNlcnRDb21wb25lbnQoUGx1Z2luQnVpbGQpO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0UGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBTZXR0aW5ncy5wbHVnaW5zLmZpbmQoYiA9PiBiID09IG5hbWUgfHwgKDxhbnk+Yik/Lm5hbWUgPT0gbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTb21lUGx1Z2lucyguLi5kYXRhOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBkYXRhLnNvbWUoeCA9PiBHZXRQbHVnaW4oeCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcygpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheC5pbmNsdWRlcygnVHlwZVNjcmlwdCcpO1xufVxuXG5Db21wb25lbnRzLk1pY3JvUGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5Db21wb25lbnRzLkdldFBsdWdpbiA9IEdldFBsdWdpbjtcbkNvbXBvbmVudHMuU29tZVBsdWdpbnMgPSBTb21lUGx1Z2lucztcbkNvbXBvbmVudHMuaXNUcyA9IGlzVHM7XG5cbkJ1aWxkU2NyaXB0U2V0dGluZ3MucGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5cbmFzeW5jIGZ1bmN0aW9uIG91dFBhZ2UoZGF0YTogU3RyaW5nVHJhY2tlciwgc2NyaXB0RmlsZTogU3RyaW5nVHJhY2tlciwgcGFnZVBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBkeW5hbWljQ2hlY2s/OiBib29sZWFuKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG5cbiAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKHNlc3Npb25JbmZvLCBkYXRhLCBpc1RzKCkpO1xuICAgIGlmKCFhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3MocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIHBhZ2VOYW1lLCB7ZHluYW1pY0NoZWNrfSkpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWxOYW1lID0gYmFzZURhdGEuZGVmYXVsdFZhbHVlUG9wQW55KCdtb2RlbCcsICd3ZWJzaXRlJyk7XG5cbiAgICBpZiAoIW1vZGVsTmFtZSkgcmV0dXJuIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlLCBiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgIGRhdGEgPSBiYXNlRGF0YS5jbGVhckRhdGE7XG5cbiAgICAvL2ltcG9ydCBtb2RlbFxuICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQ3JlYXRlRmlsZVBhdGgocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIG1vZGVsTmFtZSwgJ01vZGVscycsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLm1vZGVsKTsgLy8gZmluZCBsb2NhdGlvbiBvZiB0aGUgZmlsZVxuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdWxsUGF0aCkpIHtcbiAgICAgICAgY29uc3QgRXJyb3JNZXNzYWdlID0gYEVycm9yIG1vZGVsIG5vdCBmb3VuZCAtPiAke21vZGVsTmFtZX0gYXQgcGFnZSAke3BhZ2VOYW1lfWA7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0LCBQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihFcnJvck1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgRnVsbFBhdGgpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3RcblxuICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBGdWxsUGF0aCwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgIGxldCBtb2RlbERhdGEgPSBhd2FpdCBQYXJzZUJhc2VQYWdlLnJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoYmFzZU1vZGVsRGF0YS5hbGxEYXRhKTtcblxuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIG1vZGVsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgcGFnZU5hbWUgKz0gXCIgLT4gXCIgKyBTbWFsbFBhdGg7XG5cbiAgICAvL0dldCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBhbGxEYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdzKG1vZGVsRGF0YSwgWycnXSwgJzonLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICBpZiAoYWxsRGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHdpdGhpbiBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgbW9kZWxEYXRhID0gYWxsRGF0YS5kYXRhO1xuICAgIGNvbnN0IHRhZ0FycmF5ID0gYWxsRGF0YS5mb3VuZC5tYXAoeCA9PiB4LnRhZy5zdWJzdHJpbmcoMSkpO1xuICAgIGNvbnN0IG91dERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ3MoZGF0YSwgdGFnQXJyYXksICdAJyk7XG5cbiAgICBpZiAob3V0RGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIFdpdGggbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vQnVpbGQgV2l0aCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBtb2RlbEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBhbGxEYXRhLmZvdW5kKSB7XG4gICAgICAgIGkudGFnID0gaS50YWcuc3Vic3RyaW5nKDEpOyAvLyByZW1vdmluZyB0aGUgJzonXG4gICAgICAgIGNvbnN0IGhvbGRlckRhdGEgPSBvdXREYXRhLmZvdW5kLmZpbmQoKGUpID0+IGUudGFnID09ICdAJyArIGkudGFnKTtcblxuICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhLnN1YnN0cmluZygwLCBpLmxvYykpO1xuICAgICAgICBtb2RlbERhdGEgPSBtb2RlbERhdGEuc3Vic3RyaW5nKGkubG9jKTtcblxuICAgICAgICBpZiAoaG9sZGVyRGF0YSkge1xuICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGhvbGRlckRhdGEuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFRyeSBsb2FkaW5nIGRhdGEgZnJvbSBwYWdlIGJhc2VcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGcm9tQmFzZSA9IGJhc2VEYXRhLmdldChpLnRhZyk7XG5cbiAgICAgICAgICAgIGlmIChsb2FkRnJvbUJhc2UgJiYgbG9hZEZyb21CYXNlICE9PSB0cnVlICYmIGxvYWRGcm9tQmFzZS5lcS50b0xvd2VyQ2FzZSgpICE9ICdpbmhlcml0JylcbiAgICAgICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobG9hZEZyb21CYXNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG91dFBhZ2UobW9kZWxCdWlsZCwgc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUpLCBGdWxsUGF0aCwgcGFnZU5hbWUsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW5zZXJ0KGRhdGE6IHN0cmluZywgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIG5lc3RlZFBhZ2U6IGJvb2xlYW4sIG5lc3RlZFBhZ2VEYXRhOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pIHtcbiAgICBsZXQgRGVidWdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGRhdGEpO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgb3V0UGFnZShEZWJ1Z1N0cmluZywgbmV3IFN0cmluZ1RyYWNrZXIoRGVidWdTdHJpbmcuRGVmYXVsdEluZm9UZXh0KSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbywgZHluYW1pY0NoZWNrKTtcblxuICAgIGlmKERlYnVnU3RyaW5nID09IG51bGwpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQbHVnaW5CdWlsZC5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IENvbXBvbmVudHMuSW5zZXJ0KERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBmaW5hbGl6ZUJ1aWxkKERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mbywgZnVsbFBhdGhDb21waWxlKTtcbiAgICBcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zKERlYnVnU3RyaW5nKTtcbiAgICBEZWJ1Z1N0cmluZz0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgIHJldHVybiBEZWJ1Z1N0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCdWlsZEpTLCBCdWlsZEpTWCwgQnVpbGRUUywgQnVpbGRUU1ggfSBmcm9tICcuL0ZvclN0YXRpYy9TY3JpcHQnO1xuaW1wb3J0IEJ1aWxkU3ZlbHRlIGZyb20gJy4vRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTdHlsZVNhc3MgfSBmcm9tICcuL0ZvclN0YXRpYy9TdHlsZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgU3lzdGVtRGF0YSwgZ2V0RGlybmFtZSwgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFJlc3BvbnNlLCBSZXF1ZXN0IH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwcm9tcHRseSBmcm9tICdwcm9tcHRseSc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5cbmNvbnN0IFN1cHBvcnRlZFR5cGVzID0gWydqcycsICdzdmVsdGUnLCAndHMnLCAnanN4JywgJ3RzeCcsICdjc3MnLCAnc2FzcycsICdzY3NzJ107XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1N0YXRpY0ZpbGVzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvID0gU3RhdGljRmlsZXNJbmZvLnN0b3JlW3BhdGhdO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG8pIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIHAgPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBvW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAhbztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGZ1bGxDb21waWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBzd2l0Y2ggKGV4dCkge1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIGNhc2UgJ3Nhc3MnOlxuICAgICAgICBjYXNlICdzY3NzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3R5bGVTYXNzKFNtYWxsUGF0aCwgZXh0LCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmVsdGUnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdmVsdGUoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGZ1bGxDb21waWxlUGF0aCArPSAnLmpzJztcbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsQ29tcGlsZVBhdGgpKSB7XG4gICAgICAgIFN0YXRpY0ZpbGVzSW5mby51cGRhdGUoU21hbGxQYXRoLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGVidWcpXG4gICAgICAgIHJldHVybiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgYnVpbGRJbiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICBleHQ/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGluU2VydmVyPzogc3RyaW5nO1xufVxuXG5jb25zdCBzdGF0aWNGaWxlcyA9IFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy9jbGllbnQvJztcbmNvbnN0IGdldFN0YXRpYzogYnVpbGRJbltdID0gW3tcbiAgICBwYXRoOiBcInNlcnYvdGVtcC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcImJ1aWxkVGVtcGxhdGUuanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvY29ubmVjdC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1ha2VDb25uZWN0aW9uLmpzXCJcbn0sXG57XG4gICAgcGF0aDogXCJzZXJ2L21kLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFya2Rvd25Db3B5LmpzXCJcbn1dO1xuXG5jb25zdCBnZXRTdGF0aWNGaWxlc1R5cGU6IGJ1aWxkSW5bXSA9IFt7XG4gICAgZXh0OiAnLnB1Yi5qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLm1qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLmNzcycsXG4gICAgdHlwZTogJ2Nzcydcbn1dO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0OiBSZXF1ZXN0LCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgY29uc3QgZm91bmQgPSBnZXRTdGF0aWNGaWxlc1R5cGUuZmluZCh4ID0+IGZpbGVQYXRoLmVuZHNXaXRoKHguZXh0KSk7XG5cbiAgICBpZiAoIWZvdW5kKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGNvbnN0IGJhc2VQYXRoID0gUmVxdWVzdC5xdWVyeS50ID09ICdsJyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV07XG4gICAgY29uc3QgaW5TZXJ2ZXIgPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGluU2VydmVyKSlcbiAgICAgICAgcmV0dXJuIHsgLi4uZm91bmQsIGluU2VydmVyIH07XG59XG5cbmxldCBkZWJ1Z2dpbmdXaXRoU291cmNlOiBudWxsIHwgYm9vbGVhbiA9IG51bGw7XG5cbmlmIChhcmd2LmluY2x1ZGVzKCdhbGxvd1NvdXJjZURlYnVnJykpXG4gICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IHRydWU7XG5hc3luYyBmdW5jdGlvbiBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkge1xuICAgIGlmICh0eXBlb2YgZGVidWdnaW5nV2l0aFNvdXJjZSA9PSAnYm9vbGVhbicpXG4gICAgICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IChhd2FpdCBwcm9tcHRseS5wcm9tcHQoXG4gICAgICAgICAgICAnQWxsb3cgZGVidWdnaW5nIEphdmFTY3JpcHQvQ1NTIGluIHNvdXJjZSBwYWdlPyAtIGV4cG9zaW5nIHlvdXIgc291cmNlIGNvZGUgKG5vKScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKHY6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWyd5ZXMnLCAnbm8nXS5pbmNsdWRlcyh2LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3llcyBvciBubycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwXG4gICAgICAgICAgICB9XG4gICAgICAgICkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09ICd5ZXMnO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB9IGNhdGNoIHsgfVxuXG5cbiAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcbn1cblxuY29uc3Qgc2FmZUZvbGRlcnMgPSBbZ2V0VHlwZXMuU3RhdGljWzJdLCBnZXRUeXBlcy5Mb2dzWzJdLCAnTW9kZWxzJywgJ0NvbXBvbmVudHMnXTtcbi8qKlxuICogSWYgdGhlIHVzZXIgaXMgaW4gZGVidWcgbW9kZSwgYW5kIHRoZSBmaWxlIGlzIGEgc291cmNlIGZpbGUsIGFuZCB0aGUgdXNlciBjb21tZW5kIGxpbmUgYXJndW1lbnQgaGF2ZSBhbGxvd1NvdXJjZURlYnVnXG4gKiB0aGVuIHJldHVybiB0aGUgZnVsbCBwYXRoIHRvIHRoZSBmaWxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBpcyB0aGUgY3VycmVudCBwYWdlIGEgZGVidWcgcGFnZT9cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRoYXQgd2FzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSBJZiB0aGlzIHBhdGggYWxyZWFkeSBiZWVuIGNoZWNrZWRcbiAqIHRoZSBmaWxlLlxuICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGZpbGUgYW5kIHRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bnNhZmVEZWJ1Zyhpc0RlYnVnOiBib29sZWFuLCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFpc0RlYnVnIHx8IEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpICE9ICcuc291cmNlJyB8fCAhc2FmZUZvbGRlcnMuaW5jbHVkZXMoZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykuc2hpZnQoKSkgfHwgIWF3YWl0IGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA3KSk7IC8vIHJlbW92aW5nICcuc291cmNlJ1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlRmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNCk7IC8vIHJlbW92aW5nICcuY3NzJ1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgZmlsZVBhdGg7XG5cbiAgICBsZXQgZXhpc3RzOiBib29sZWFuO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoYmFzZUZpbGVQYXRoKSA9PSAnLnN2ZWx0ZScgJiYgKGNoZWNrZWQgfHwgKGV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSkpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgIWV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgT3B0aW9ucyBhcyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0sIFBhcnNlckNvbmZpZyB9IGZyb20gJ0Bzd2MvY29yZSc7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgZXNUYXJnZXQsIFRyYW5zZm9ybUpTQyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3MnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBwYXJzZXI/OiBQYXJzZXJDb25maWcsIG9wdGlvbnNOYW1lPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpbnB1dFBhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGlucHV0UGF0aDtcbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmaWxlbmFtZTogZnVsbFBhdGgsXG4gICAgICAgIHNvdXJjZUZpbGVOYW1lOiBpbnB1dFBhdGggKyAnP3NvdXJjZT10cnVlJyxcbiAgICAgICAganNjOiBUcmFuc2Zvcm1KU0Moe1xuICAgICAgICAgICAgcGFyc2VyOiB7XG4gICAgICAgICAgICAgICAgLi4ucGFyc2VyLFxuICAgICAgICAgICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksXG4gICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKG9wdGlvbnNOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgdHlwZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlTWFwczogaXNEZWJ1ZyA/ICdpbmxpbmUnIDogZmFsc2VcbiAgICB9O1xuXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSAoYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucykpLmNvZGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGVycik7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqcycsIGlzRGVidWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgc3ludGF4OiAndHlwZXNjcmlwdCcsIGRlY29yYXRvcnM6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqc3gnLCBpc0RlYnVnLCB7IHN5bnRheDogJ2VjbWFzY3JpcHQnLCBqc3g6IHRydWUgfSwgJ0pTWE9wdGlvbnMnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkVFNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzeCcsIGlzRGVidWcsIHsgc3ludGF4OiAndHlwZXNjcmlwdCcsIHRzeDogdHJ1ZSwgZGVjb3JhdG9yczogdHJ1ZSwgfSwgJ1RTWE9wdGlvbnMnKTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gXCJAc3djL2NvcmVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvdHJhbnNwaWxlci9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCwgTWVyZ2VTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlRXJyb3IsIFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5pbXBvcnQgeyBlc1RhcmdldCwgVHJhbnNmb3JtSlNDIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL3RyYW5zcGlsZXIvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGluU3RhdGljUGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNQYXRoO1xuXG4gICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXMsIG1hcCwgc2NyaXB0TGFuZyB9ID0gYXdhaXQgcHJlcHJvY2VzcyhmdWxsUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5TdGF0aWNQYXRoKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZ1bGxQYXRoLnNwbGl0KC9cXC98XFwvLykucG9wKCk7XG4gICAgbGV0IGpzOiBhbnksIGNzczogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgZGV2OiBpc0RlYnVnLFxuICAgICAgICAgICAgc291cmNlbWFwOiBtYXAsXG4gICAgICAgICAgICBjc3M6IGZhbHNlLFxuICAgICAgICAgICAgaHlkcmF0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHN2ZWx0ZVBhdGg6ICcvc2Vydi9zdmVsdGUnXG4gICAgICAgIH0pO1xuICAgICAgICBQcmludFN2ZWx0ZVdhcm4ob3V0cHV0Lndhcm5pbmdzLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAganMgPSBvdXRwdXQuanM7XG4gICAgICAgIGNzcyA9IG91dHB1dC5jc3M7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgUHJpbnRTdmVsdGVFcnJvcihlcnIsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGhpc0ZpbGU6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHNvdXJjZUZpbGVDbGllbnQgPSBqcy5tYXAuc291cmNlc1swXS5zdWJzdHJpbmcoMSk7XG5cbiAgICBpZihpc0RlYnVnKXtcbiAgICAgICAganMubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgIH1cblxuICAgIGlmIChTb21lUGx1Z2lucyhcIk1pbkpTXCIpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKGpzLmNvZGUsIHtcbiAgICAgICAgICAgICAgICBqc2M6IFRyYW5zZm9ybUpTQyh7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlcjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeW50YXg6IHNjcmlwdExhbmcgPT0gJ2pzJyA/ICdlY21hc2NyaXB0JzogJ3R5cGVzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uR2V0UGx1Z2luKHNjcmlwdExhbmcudG9VcHBlckNhc2UoKSArXCJPcHRpb25zXCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgICAgICAgICAgc291cmNlTWFwczogaXNEZWJ1Z1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGpzLmNvZGUgPSBjb2RlO1xuICAgICAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgICAgIGpzLm1hcCA9IGF3YWl0IE1lcmdlU291cmNlTWFwKEpTT04ucGFyc2UobWFwKSwganMubWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhd2FpdCBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnIsIGpzLm1hcCwgZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAganMuY29kZSArPSB0b1VSTENvbW1lbnQoanMubWFwKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICAgICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5qcycsIGpzLmNvZGUpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5jc3MnLCBjc3MuY29kZSA/PyAnJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZXBlbmRlbmNpZXMsXG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59IiwgImltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyAgY3JlYXRlSW1wb3J0ZXIsIGdldFNhc3NFcnJvckxpbmUsIFByaW50U2Fzc0Vycm9yLCBzYXNzQW5kU291cmNlLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTdHlsZVNhc3MoaW5wdXRQYXRoOiBzdHJpbmcsIHR5cGU6IFwic2Fzc1wiIHwgXCJzY3NzXCIgfCBcImNzc1wiLCBpc0RlYnVnOiBib29sZWFuKTogUHJvbWlzZTx7IFtrZXk6IHN0cmluZ106IG51bWJlciB9PiB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpbnB1dFBhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGlucHV0UGF0aDtcblxuICAgIGNvbnN0IGRlcGVuZGVuY2VPYmplY3QgPSB7XG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGVEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSwgZmlsZURhdGFEaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNhc3MuY29tcGlsZVN0cmluZ0FzeW5jKGZpbGVEYXRhLCB7XG4gICAgICAgICAgICBzb3VyY2VNYXA6IGlzRGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgodHlwZSksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKHR5cGUpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnQsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoPGFueT5maWxlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNlT2JqZWN0W0Jhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpXSA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuY3NzO1xuXG4gICAgICAgIGlmIChpc0RlYnVnICYmIHJlc3VsdC5zb3VyY2VNYXApIHtcbiAgICAgICAgICAgIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgcGF0aFRvRmlsZVVSTChmaWxlRGF0YSkuaHJlZik7XG4gICAgICAgICAgICByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMgPSByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMubWFwKHggPT4gcGF0aC5yZWxhdGl2ZShmaWxlRGF0YURpcm5hbWUsIGZpbGVVUkxUb1BhdGgoeCkpICsgJz9zb3VyY2U9dHJ1ZScpO1xuXG4gICAgICAgICAgICBkYXRhICs9IGBcXHJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXN1bHQuc291cmNlTWFwKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9Ki9gO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIFByaW50U2Fzc0Vycm9yKGVycik7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwZW5kZW5jZU9iamVjdFxufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEaXJlbnQgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBJbnNlcnQsIENvbXBvbmVudHMsIEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBDbGVhcldhcm5pbmcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldydcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIERlbGV0ZUluRGlyZWN0b3J5LCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgUmVxU2NyaXB0IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgU3RhdGljRmlsZXMgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gJy4vQ29tcGlsZVN0YXRlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCB7IGNyZWF0ZVNpdGVNYXAgfSBmcm9tICcuL1NpdGVNYXAnO1xuaW1wb3J0IHsgZXh0ZW5zaW9uSXMsIGlzRmlsZVR5cGUsIFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgeyBwZXJDb21waWxlLCBwb3N0Q29tcGlsZSwgcGVyQ29tcGlsZVBhZ2UsIHBvc3RDb21waWxlUGFnZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuYXN5bmMgZnVuY3Rpb24gY29tcGlsZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgeyBpc0RlYnVnLCBoYXNTZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEsIGR5bmFtaWNDaGVjayB9OiB7IGlzRGVidWc/OiBib29sZWFuLCBoYXNTZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgbmVzdGVkUGFnZT86IHN0cmluZywgbmVzdGVkUGFnZURhdGE/OiBzdHJpbmcsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgRnVsbEZpbGVQYXRoID0gcGF0aC5qb2luKGFycmF5VHlwZVswXSwgZmlsZVBhdGgpLCBGdWxsUGF0aENvbXBpbGUgPSBhcnJheVR5cGVbMV0gKyBmaWxlUGF0aCArICcuY2pzJztcblxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbEZpbGVQYXRoLCAndXRmOCcpO1xuICAgIGNvbnN0IEV4Y2x1VXJsID0gKG5lc3RlZFBhZ2UgPyBuZXN0ZWRQYWdlICsgJzxsaW5lPicgOiAnJykgKyBhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aDtcblxuICAgIGNvbnN0IHNlc3Npb25JbmZvID0gaGFzU2Vzc2lvbkluZm8gPz8gbmV3IFNlc3Npb25CdWlsZChhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aCwgRnVsbEZpbGVQYXRoLCBhcnJheVR5cGVbMl0sIGlzRGVidWcsIEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSk7XG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZSgndGhpc1BhZ2UnLCBGdWxsRmlsZVBhdGgpO1xuXG4gICAgYXdhaXQgcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm8sIEZ1bGxQYXRoQ29tcGlsZSk7XG4gICAgY29uc3QgQ29tcGlsZWREYXRhID0gKGF3YWl0IEluc2VydChodG1sLCBGdWxsUGF0aENvbXBpbGUsIEJvb2xlYW4obmVzdGVkUGFnZSksIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgZHluYW1pY0NoZWNrKSkgPz8gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICBhd2FpdCBwb3N0Q29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm8sIEZ1bGxQYXRoQ29tcGlsZSk7XG5cbiAgICBpZiAoIW5lc3RlZFBhZ2UgJiYgQ29tcGlsZWREYXRhLmxlbmd0aCkge1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKEZ1bGxQYXRoQ29tcGlsZSwgQ29tcGlsZWREYXRhLlN0cmluZ1dpdGhUYWNrKEZ1bGxQYXRoQ29tcGlsZSkpO1xuICAgICAgICBwYWdlRGVwcy51cGRhdGUoRXhjbHVVcmwsIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgQ29tcGlsZWREYXRhLCBzZXNzaW9uSW5mbyB9O1xufVxuXG5mdW5jdGlvbiBSZXF1aXJlU2NyaXB0KHNjcmlwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFJlcVNjcmlwdCgnUHJvZHVjdGlvbiBMb2FkZXInLCBzY3JpcHQsIGdldFR5cGVzLlN0YXRpYywgeyBpc0RlYnVnOiBmYWxzZSwgb25seVByZXBhcmU6IHRydWUgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLm1rZGlyKGFycmF5VHlwZVsxXSArIGNvbm5lY3QpO1xuICAgICAgICAgICAgYXdhaXQgRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgICAgIGlmIChhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoYXJyYXlUeXBlWzJdICsgJy8nICsgY29ubmVjdCkpIC8vY2hlY2sgaWYgbm90IGFscmVhZHkgY29tcGlsZSBmcm9tIGEgJ2luLWZpbGUnIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29tcGlsZUZpbGUoY29ubmVjdCwgYXJyYXlUeXBlLCB7IGR5bmFtaWNDaGVjazogIWV4dGVuc2lvbklzKG4sIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJheVR5cGUgPT0gZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgUmVxdWlyZVNjcmlwdChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBTdGF0aWNGaWxlcyhjb25uZWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVTY3JpcHRzKHNjcmlwdHM6IHN0cmluZ1tdKSB7XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgYXdhaXQgUmVxdWlyZVNjcmlwdChwYXRoKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIENyZWF0ZUNvbXBpbGUodDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgdHlwZXMgPSBnZXRUeXBlc1t0XTtcbiAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeSh0eXBlc1sxXSk7XG4gICAgcmV0dXJuICgpID0+IEZpbGVzSW5Gb2xkZXIodHlwZXMsICcnLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogd2hlbiBwYWdlIGNhbGwgb3RoZXIgcGFnZTtcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlSW5GaWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgIHsgaGFzU2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhLCBkeW5hbWljQ2hlY2sgfTogeyBoYXNTZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgbmVzdGVkUGFnZT86IHN0cmluZywgbmVzdGVkUGFnZURhdGE/OiBzdHJpbmcsIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLCBhcnJheVR5cGVbMV0pO1xuICAgIHJldHVybiBhd2FpdCBjb21waWxlRmlsZShwYXRoLCBhcnJheVR5cGUsIHtpc0RlYnVnOnRydWUsIGhhc1Nlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSwgZHluYW1pY0NoZWNrfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIGR5bmFtaWNDaGVjaz86IGJvb2xlYW4pIHtcbiAgICBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShwYXRoLCBhcnJheVR5cGUsIHtkeW5hbWljQ2hlY2t9KTtcbiAgICBDbGVhcldhcm5pbmcoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVBbGwoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncykge1xuICAgIGxldCBzdGF0ZSA9ICFhcmd2LmluY2x1ZGVzKCdyZWJ1aWxkJykgJiYgYXdhaXQgQ29tcGlsZVN0YXRlLmNoZWNrTG9hZCgpXG5cbiAgICBpZiAoc3RhdGUpIHJldHVybiAoKSA9PiBSZXF1aXJlU2NyaXB0cyhzdGF0ZS5zY3JpcHRzKVxuICAgIHBhZ2VEZXBzLmNsZWFyKCk7XG5cbiAgICBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuXG4gICAgcGVyQ29tcGlsZSgpO1xuXG4gICAgY29uc3QgYWN0aXZhdGVBcnJheSA9IFthd2FpdCBDcmVhdGVDb21waWxlKGdldFR5cGVzLlN0YXRpY1syXSwgc3RhdGUpLCBhd2FpdCBDcmVhdGVDb21waWxlKGdldFR5cGVzLkxvZ3NbMl0sIHN0YXRlKSwgQ2xlYXJXYXJuaW5nXTtcblxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhY3RpdmF0ZUFycmF5KSB7XG4gICAgICAgICAgICBhd2FpdCBpKCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY3JlYXRlU2l0ZU1hcChFeHBvcnQsIHN0YXRlKTtcbiAgICAgICAgc3RhdGUuZXhwb3J0KClcbiAgICAgICAgcGFnZURlcHMuc2F2ZSgpO1xuICAgICAgICBwb3N0Q29tcGlsZSgpXG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZ2V0U2V0dGluZ3NEYXRlIH0gZnJvbSBcIi4uL01haW5CdWlsZC9JbXBvcnRNb2R1bGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxudHlwZSBDU3RhdGUgPSB7XG4gICAgdXBkYXRlOiBudW1iZXJcbiAgICBwYWdlQXJyYXk6IHN0cmluZ1tdW10sXG4gICAgaW1wb3J0QXJyYXk6IHN0cmluZ1tdXG4gICAgZmlsZUFycmF5OiBzdHJpbmdbXVxufVxuXG4vKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gc3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBwcm9qZWN0ICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlU3RhdGUge1xuICAgIHByaXZhdGUgc3RhdGU6IENTdGF0ZSA9IHsgdXBkYXRlOiAwLCBwYWdlQXJyYXk6IFtdLCBpbXBvcnRBcnJheTogW10sIGZpbGVBcnJheTogW10gfVxuICAgIHN0YXRpYyBmaWxlUGF0aCA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBcIkNvbXBpbGVTdGF0ZS5qc29uXCIpXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUudXBkYXRlID0gZ2V0U2V0dGluZ3NEYXRlKClcbiAgICB9XG5cbiAgICBnZXQgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXlcbiAgICB9XG5cbiAgICBnZXQgcGFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnBhZ2VBcnJheVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZmlsZUFycmF5XG4gICAgfVxuXG4gICAgYWRkUGFnZShwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucGFnZUFycmF5LmZpbmQoeCA9PiB4WzBdID09IHBhdGggJiYgeFsxXSA9PSB0eXBlKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucGFnZUFycmF5LnB1c2goW3BhdGgsIHR5cGVdKVxuICAgIH1cblxuICAgIGFkZEltcG9ydChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmltcG9ydEFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgYWRkRmlsZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmZpbGVBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmlsZUFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZShDb21waWxlU3RhdGUuZmlsZVBhdGgsIHRoaXMuc3RhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNoZWNrTG9hZCgpIHtcbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLmZpbGVQYXRoKSkgcmV0dXJuXG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcbiAgICAgICAgc3RhdGUuc3RhdGUgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZmlsZVBhdGgpXG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAhPSBnZXRTZXR0aW5nc0RhdGUoKSkgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxufSIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBJbXBvcnRGaWxlLCB7QWRkRXh0ZW5zaW9uLCBSZXF1aXJlT25jZX0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7cHJpbnR9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTdGFydFJlcXVpcmUoYXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYXJyYXlGdW5jU2VydmVyID0gW107XG4gICAgZm9yIChsZXQgaSBvZiBhcnJheSkge1xuICAgICAgICBpID0gQWRkRXh0ZW5zaW9uKGkpO1xuXG4gICAgICAgIGNvbnN0IGIgPSBhd2FpdCBJbXBvcnRGaWxlKCdyb290IGZvbGRlciAoV1dXKScsIGksIGdldFR5cGVzLlN0YXRpYywge2lzRGVidWd9KTtcbiAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIuU3RhcnRTZXJ2ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJyYXlGdW5jU2VydmVyLnB1c2goYi5TdGFydFNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmludC5sb2coYENhbid0IGZpbmQgU3RhcnRTZXJ2ZXIgZnVuY3Rpb24gYXQgbW9kdWxlIC0gJHtpfVxcbmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RnVuY1NlcnZlcjtcbn1cblxubGV0IGxhc3RTZXR0aW5nc0ltcG9ydDogbnVtYmVyO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldFNldHRpbmdzKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pe1xuICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoICsgJy50cycpKXtcbiAgICAgICAgZmlsZVBhdGggKz0gJy50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggKz0gJy5qcydcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlVGltZSA9IDxhbnk+YXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbClcblxuICAgIGlmKGNoYW5nZVRpbWUgPT0gbGFzdFNldHRpbmdzSW1wb3J0IHx8ICFjaGFuZ2VUaW1lKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsYXN0U2V0dGluZ3NJbXBvcnQgPSBjaGFuZ2VUaW1lO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBSZXF1aXJlT25jZShmaWxlUGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIGRhdGEuZGVmYXVsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmdzRGF0ZSgpe1xuICAgIHJldHVybiBsYXN0U2V0dGluZ3NJbXBvcnRcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEltcG9ydEZpbGUgfSBmcm9tIFwiLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gXCIuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcywgeyBEaXJlbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gXCIuL0NvbXBpbGVTdGF0ZVwiO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSB9IGZyb20gXCIuL0ZpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9W107XG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2NhbkZpbGVzKCl7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLlN0YXRpYywgJycsIHN0YXRlKSxcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5Mb2dzLCAnJywgc3RhdGUpXG4gICAgXSlcbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWJ1Z1NpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyl7XG4gICAgcmV0dXJuIGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBhd2FpdCBzY2FuRmlsZXMoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB7IHJvdXRpbmcsIGRldmVsb3BtZW50IH0gPSBFeHBvcnQ7XG4gICAgaWYgKCFyb3V0aW5nLnNpdGVtYXApIHJldHVybjtcblxuICAgIGNvbnN0IHNpdGVtYXAgPSByb3V0aW5nLnNpdGVtYXAgPT09IHRydWUgPyB7fSA6IHJvdXRpbmcuc2l0ZW1hcDtcbiAgICBPYmplY3QuYXNzaWduKHNpdGVtYXAsIHtcbiAgICAgICAgcnVsZXM6IHRydWUsXG4gICAgICAgIHVybFN0b3A6IGZhbHNlLFxuICAgICAgICBlcnJvclBhZ2VzOiBmYWxzZSxcbiAgICAgICAgdmFsaWRQYXRoOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWdlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHVybHM6IC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGZvciAobGV0IFt1cmwsIHR5cGVdIG9mIHN0YXRlLnBhZ2VzKSB7XG5cbiAgICAgICAgaWYodHlwZSAhPSBnZXRUeXBlcy5TdGF0aWNbMl0gfHwgIXVybC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHVybCA9ICcvJyArIHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgaWYocGF0aC5leHRuYW1lKHVybCkgPT0gJy5zZXJ2JylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnVybFN0b3ApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gcGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2l0ZW1hcC5ydWxlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcucnVsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXdhaXQgcm91dGluZy5ydWxlc1twYXRoXSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoZW5kcyA9PiB1cmwuZW5kc1dpdGgoJy4nK2VuZHMpKSB8fFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVQYXRocy5maW5kKHN0YXJ0ID0+IHVybC5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2Ygcm91dGluZy52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWF3YWl0IGZ1bmModXJsKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2l0ZW1hcC5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVycm9yIGluIHJvdXRpbmcuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSAnLycgKyByb3V0aW5nLmVycm9yUGFnZXNbZXJyb3JdLnBhdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFnZXMucHVzaCh1cmwpO1xuICAgIH1cblxuICAgIGxldCB3cml0ZSA9IHRydWU7XG4gICAgaWYgKHNpdGVtYXAuZmlsZSkge1xuICAgICAgICBjb25zdCBmaWxlQWN0aW9uID0gYXdhaXQgSW1wb3J0RmlsZSgnU2l0ZW1hcCBJbXBvcnQnLCBzaXRlbWFwLmZpbGUsIGdldFR5cGVzLlN0YXRpYywgZGV2ZWxvcG1lbnQpO1xuICAgICAgICBpZighZmlsZUFjdGlvbj8uU2l0ZW1hcCl7XG4gICAgICAgICAgICBkdW1wLndhcm4oJ1xcJ1NpdGVtYXBcXCcgZnVuY3Rpb24gbm90IGZvdW5kIG9uIGZpbGUgLT4gJysgc2l0ZW1hcC5maWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdyaXRlID0gYXdhaXQgZmlsZUFjdGlvbi5TaXRlbWFwKHBhZ2VzLCBzdGF0ZSwgRXhwb3J0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKHdyaXRlICYmIHBhZ2VzLmxlbmd0aCl7XG4gICAgICAgIGNvbnN0IHBhdGggPSB3cml0ZSA9PT0gdHJ1ZSA/ICdzaXRlbWFwLnR4dCc6IHdyaXRlO1xuICAgICAgICBzdGF0ZS5hZGRGaWxlKHBhdGgpO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGdldFR5cGVzLlN0YXRpY1swXSArIHBhdGgsIHBhZ2VzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG59IiwgIi8qKlxuICogR2l2ZW4gYSBmaWxlIG5hbWUgYW5kIGFuIGV4dGVuc2lvbiwgcmV0dXJuIHRydWUgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggdGhlIGV4dGVuc2lvblxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHRuYW1lIC0gdGhlIGV4dGVuc2lvbiB0byBjaGVjayBmb3IuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbnNpb25JcyhuYW1lOiBzdHJpbmcsIGV4dG5hbWU6IHN0cmluZyl7XG4gICAgcmV0dXJuIG5hbWUuZW5kc1dpdGgoJy4nICsgZXh0bmFtZSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggb25lIG9mIHRoZSBnaXZlbiBmaWxlIHR5cGVzLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXMgLSBhbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaWxlVHlwZSh0eXBlczogc3RyaW5nW10sIG5hbWU6IHN0cmluZykge1xuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbklzKG5hbWUsdHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxhc3QgZG90IGFuZCBldmVyeXRoaW5nIGFmdGVyIGl0IGZyb20gYSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHJlbW92ZSB0aGUgZW5kIHR5cGUgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aG91dCB0aGUgbGFzdCBjaGFyYWN0ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZW1vdmVFbmRUeXBlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufSIsICJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgRmlsZXMgfSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5cbmNvbnN0IEV4cG9ydCA9IHtcbiAgICBQYWdlTG9hZFJhbToge30sXG4gICAgUGFnZVJhbTogdHJ1ZVxufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIHR5cGVBcnJheSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGggdG8gdGhlXG4gKiBmaWxlLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBkaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHthbnl9IERhdGFPYmplY3QgLSBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVBhZ2UoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIERhdGFPYmplY3Q6IGFueSkge1xuICAgIGNvbnN0IFJlcUZpbGVQYXRoID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuICAgIGNvbnN0IHJlc01vZGVsID0gKCkgPT4gUmVxRmlsZVBhdGgubW9kZWwoRGF0YU9iamVjdCk7XG5cbiAgICBsZXQgZmlsZUV4aXN0czogYm9vbGVhbjtcblxuICAgIGlmIChSZXFGaWxlUGF0aCkge1xuICAgICAgICBpZiAoIURhdGFPYmplY3QuaXNEZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuXG4gICAgICAgIGlmIChSZXFGaWxlUGF0aC5kYXRlID09IC0xKSB7XG4gICAgICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoUmVxRmlsZVBhdGgucGF0aCk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUV4aXN0cylcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYgKCFleHRuYW1lKSB7XG4gICAgICAgIGV4dG5hbWUgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICBmaWxlUGF0aCArPSAnLicgKyBleHRuYW1lO1xuICAgIH1cblxuICAgIGxldCBmdWxsUGF0aDogc3RyaW5nO1xuICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZVBhdGgpO1xuICAgICBlbHNlXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKCFbQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMuY29tcG9uZW50XS5pbmNsdWRlcyhleHRuYW1lKSkge1xuICAgICAgICBjb25zdCBpbXBvcnRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTtcbiAgICAgICAgRGF0YU9iamVjdC53cml0ZShpbXBvcnRUZXh0KTtcbiAgICAgICAgcmV0dXJuIGltcG9ydFRleHQ7XG4gICAgfVxuXG4gICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpO1xuICAgIGlmICghZmlsZUV4aXN0cykge1xuICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2NvcHlQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6ICgpID0+IHsgfSwgZGF0ZTogLTEsIHBhdGg6IGZ1bGxQYXRoIH07XG4gICAgICAgIHJldHVybiBMYXN0UmVxdWlyZVtjb3B5UGF0aF0ubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgaW5TdGF0aWNQYXRoID0gIHBhdGgucmVsYXRpdmUodHlwZUFycmF5WzBdLGZ1bGxQYXRoKTtcbiAgICBjb25zdCBTbWFsbFBhdGggPSB0eXBlQXJyYXlbMl0gKyAnLycgKyBpblN0YXRpY1BhdGg7XG4gICAgY29uc3QgcmVCdWlsZCA9IERhdGFPYmplY3QuaXNEZWJ1ZyAmJiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHR5cGVBcnJheVsxXSArICcvJyAraW5TdGF0aWNQYXRoICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoaW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGV4dG5hbWUgIT0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXSAmJiAhcmVCdWlsZCkge1xuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBFeHBvcnQuUGFnZUxvYWRSYW1bU21hbGxQYXRoXVswXSB9O1xuICAgICAgICByZXR1cm4gYXdhaXQgTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsKERhdGFPYmplY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bmMgPSBhd2FpdCBMb2FkUGFnZShTbWFsbFBhdGgsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKSB7XG4gICAgICAgIGlmICghRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtTbWFsbFBhdGhdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW1NtYWxsUGF0aF1bMF0gPSBmdW5jO1xuICAgIH1cblxuICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGZ1bmMgfTtcbiAgICByZXR1cm4gYXdhaXQgZnVuYyhEYXRhT2JqZWN0KTtcbn1cblxuY29uc3QgR2xvYmFsVmFyID0ge307XG5cbmZ1bmN0aW9uIGdldEZ1bGxQYXRoQ29tcGlsZSh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgcmV0dXJuIHR5cGVBcnJheVsxXSArIFNwbGl0SW5mb1sxXSArICcuY2pzJztcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgcGFnZSB0byBsb2FkLlxuICogQHBhcmFtIGV4dCAtIFRoZSBleHRlbnNpb24gb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2UodXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcblxuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgY29uc3QgTGFzdFJlcXVpcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIF9yZXF1aXJlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlRmlsZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luY2x1ZGUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcsIFdpdGhPYmplY3QgPSB7fSkge1xuICAgICAgICByZXR1cm4gUmVxdWlyZVBhZ2UocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCB7IC4uLldpdGhPYmplY3QsIC4uLkRhdGFPYmplY3QgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3RyYW5zZmVyKHA6IHN0cmluZywgcHJlc2VydmVGb3JtOiBib29sZWFuLCB3aXRoT2JqZWN0OiBhbnksIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSkge1xuICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgPSAnJztcblxuICAgICAgICBpZiAoIXByZXNlcnZlRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgcG9zdERhdGEgPSBEYXRhT2JqZWN0LlJlcXVlc3QuYm9keSA/IHt9IDogbnVsbDtcbiAgICAgICAgICAgIERhdGFPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgLi4uRGF0YU9iamVjdCxcbiAgICAgICAgICAgICAgICBSZXF1ZXN0OiB7IC4uLkRhdGFPYmplY3QuUmVxdWVzdCwgZmlsZXM6IHt9LCBxdWVyeToge30sIGJvZHk6IHBvc3REYXRhIH0sXG4gICAgICAgICAgICAgICAgUG9zdDogcG9zdERhdGEsIFF1ZXJ5OiB7fSwgRmlsZXM6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBEYXRhT2JqZWN0LCBwLCB3aXRoT2JqZWN0KTtcblxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIFNwbGl0SW5mb1sxXSArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsZXQgZXJyb3JUZXh0OiBzdHJpbmc7XG5cbiAgICAgICAgaWYoaXNEZWJ1Zyl7XG4gICAgICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHBhdGggLT4gXCIsIFJlbW92ZUVuZFR5cGUodXJsKSwgXCItPlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgICBlcnJvclRleHQgPSBKU1BhcnNlci5wcmludEVycm9yKGBFcnJvciBwYXRoOiAke3VybH08YnIvPkVycm9yIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gSlNQYXJzZXIucHJpbnRFcnJvcihgRXJyb3IgY29kZTogJHtlLmNvZGV9YClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiB7XG4gICAgICAgICAgICBEYXRhT2JqZWN0LlJlcXVlc3QuZXJyb3IgPSBlO1xuICAgICAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGVycm9yVGV4dDtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuLyoqXG4gKiBJdCB0YWtlcyBhIGZ1bmN0aW9uIHRoYXQgcHJlcGFyZSBhIHBhZ2UsIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBsb2FkcyBhIHBhZ2VcbiAqIEBwYXJhbSBMb2FkUGFnZUZ1bmMgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgaW4gYSBwYWdlIHRvIGV4ZWN1dGUgb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBydW5fc2NyaXB0X25hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2NyaXB0IHRvIHJ1bi5cbiAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuXG5mdW5jdGlvbiBCdWlsZFBhZ2UoTG9hZFBhZ2VGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IHZvaWQsIHJ1bl9zY3JpcHRfbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgUGFnZVZhciA9IHt9O1xuXG4gICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiAoUmVzcG9uc2U6IFJlc3BvbnNlLCBSZXF1ZXN0OiBSZXF1ZXN0LCBQb3N0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgbnVsbCwgUXVlcnk6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIENvb2tpZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIFNlc3Npb246IHsgW2tleTogc3RyaW5nXTogYW55IH0sIEZpbGVzOiBGaWxlcywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBvdXRfcnVuX3NjcmlwdCA9IHsgdGV4dDogJycgfTtcblxuICAgICAgICBmdW5jdGlvbiBUb1N0cmluZ0luZm8oc3RyOiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzU3RyaW5nID0gc3RyPy50b1N0cmluZz8uKCk7XG4gICAgICAgICAgICBpZiAoYXNTdHJpbmcgPT0gbnVsbCB8fCBhc1N0cmluZy5zdGFydHNXaXRoKCdbb2JqZWN0IE9iamVjdF0nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdHIsIG51bGwsIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UmVzcG9uc2UodGV4dDogYW55KSB7XG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ID0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCA9ICcnKSB7XG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB3cml0ZVNhZmUoc3RyID0gJycpIHtcbiAgICAgICAgICAgIHN0ciA9IFRvU3RyaW5nSW5mbyhzdHIpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2Ygc3RyKSB7XG4gICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSAnJiMnICsgaS5jaGFyQ29kZUF0KDApICsgJzsnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZWNobyhhcnI6IHN0cmluZ1tdLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgd3JpdGVTYWZlKHBhcmFtc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyLmF0KC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWRpcmVjdFBhdGg6IGFueSA9IGZhbHNlO1xuXG4gICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0ID0gKHBhdGg6IHN0cmluZywgc3RhdHVzPzogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSBTdHJpbmcocGF0aCk7XG4gICAgICAgICAgICBpZiAoc3RhdHVzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5zdGF0dXMoc3RhdHVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFJlc3BvbnNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICg8YW55PlJlc3BvbnNlKS5yZWxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBSZXNwb25zZS5yZWRpcmVjdChSZXF1ZXN0LnVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW5kRmlsZShmaWxlUGF0aCwgZGVsZXRlQWZ0ZXIgPSBmYWxzZSkge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0geyBmaWxlOiBmaWxlUGF0aCwgZGVsZXRlQWZ0ZXIgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IERhdGFTZW5kID0ge1xuICAgICAgICAgICAgc2VuZEZpbGUsXG4gICAgICAgICAgICB3cml0ZVNhZmUsXG4gICAgICAgICAgICB3cml0ZSxcbiAgICAgICAgICAgIGVjaG8sXG4gICAgICAgICAgICBzZXRSZXNwb25zZSxcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LFxuICAgICAgICAgICAgcnVuX3NjcmlwdF9uYW1lLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUG9zdCxcbiAgICAgICAgICAgIFF1ZXJ5LFxuICAgICAgICAgICAgU2Vzc2lvbixcbiAgICAgICAgICAgIEZpbGVzLFxuICAgICAgICAgICAgQ29va2llcyxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBQYWdlVmFyLFxuICAgICAgICAgICAgR2xvYmFsVmFyLFxuICAgICAgICAgICAgY29kZWJhc2U6ICcnXG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBMb2FkUGFnZUZ1bmMoRGF0YVNlbmQpO1xuXG4gICAgICAgIHJldHVybiB7IG91dF9ydW5fc2NyaXB0OiBvdXRfcnVuX3NjcmlwdC50ZXh0LCByZWRpcmVjdFBhdGggfVxuICAgIH0pXG59XG5cbmV4cG9ydCB7IExvYWRQYWdlLCBCdWlsZFBhZ2UsIGdldEZ1bGxQYXRoQ29tcGlsZSwgRXhwb3J0LCBTcGxpdEZpcnN0IH07XG4iLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSwgQWRkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9BbGlhcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuXG50eXBlIFJlcXVpcmVGaWxlcyA9IHtcbiAgICBwYXRoOiBzdHJpbmdcbiAgICBzdGF0dXM/OiBudW1iZXJcbiAgICBtb2RlbDogYW55XG4gICAgZGVwZW5kZW5jaWVzPzogU3RyaW5nQW55TWFwXG4gICAgc3RhdGljPzogYm9vbGVhblxufVxuXG5jb25zdCBDYWNoZVJlcXVpcmVGaWxlcyA9IHt9O1xuXG4vKipcbiAqIEl0IG1ha2VzIGEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBkZXBlbmRlbmNpZXMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSBhcnJheSBvZiBiYXNlIHBhdGhzXG4gKiBAcGFyYW0gW2Jhc2VQYXRoXSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgY29tcGlsZWQuXG4gKiBAcGFyYW0gY2FjaGUgLSBBIGNhY2hlIG9mIHRoZSBsYXN0IHRpbWUgYSBmaWxlIHdhcyBtb2RpZmllZC5cbiAqIEByZXR1cm5zIEEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IFN0cmluZ0FueU1hcCwgdHlwZUFycmF5OiBzdHJpbmdbXSwgYmFzZVBhdGggPSAnJywgY2FjaGUgPSB7fSkge1xuICAgIGNvbnN0IGRlcGVuZGVuY2llc01hcDogU3RyaW5nQW55TWFwID0ge307XG4gICAgY29uc3QgcHJvbWlzZUFsbCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ZpbGVQYXRoLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBwcm9taXNlQWxsLnB1c2goKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aCA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWNoZVtiYXNlUGF0aF0pXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2Jhc2VQYXRoXSA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIGJhc2VQYXRoLCAnbXRpbWVNcycsIHRydWUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFsndGhpc0ZpbGUnXSA9IGNhY2hlW2Jhc2VQYXRoXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwW2ZpbGVQYXRoXSA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoPGFueT52YWx1ZSwgdHlwZUFycmF5LCBmaWxlUGF0aCwgY2FjaGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICkoKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZUFsbCk7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llc01hcDtcbn1cblxuLyoqXG4gKiBJZiB0aGUgb2xkIGRlcGVuZGVuY2llcyBhbmQgdGhlIG5ldyBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY3kgbWFwLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZS5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXApIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGRlcGVuZGVuY3kgdHJlZXMsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbmFtZXMgb2YgdGhlIG1vZHVsZXMgdGhhdCBoYXZlIGNoYW5nZWRcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIFtwYXJlbnRdIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmVudCBtb2R1bGUuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MuIEVhY2ggc3RyaW5nIHJlcHJlc2VudHMgYSBjaGFuZ2UgaW4gdGhlIGRlcGVuZGVuY3lcbiAqIHRyZWUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYW5nZUFycmF5KG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwLCBwYXJlbnQgPSAnJyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBjaGFuZ2VBcnJheSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghbmV3RGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChuYW1lKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlID0gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKC4uLmNoYW5nZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlQXJyYXk7XG59XG5cbi8qKlxuICogSXQgaW1wb3J0cyBhIGZpbGUgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gcGF0aHMgdHlwZXMuXG4gKiBAcGFyYW0gTGFzdFJlcXVpcmUgLSBBIG1hcCBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW5cbiAqIEByZXR1cm5zIFRoZSBtb2RlbCB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBMYXN0UmVxdWlyZTogeyBba2V5OiBzdHJpbmddOiBSZXF1aXJlRmlsZXMgfSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IFJlcUZpbGUgPSBMYXN0UmVxdWlyZVtmaWxlUGF0aF07XG5cbiAgICBsZXQgZmlsZUV4aXN0czogbnVtYmVyLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXA7XG4gICAgaWYgKFJlcUZpbGUpIHtcblxuICAgICAgICBpZiAoIWlzRGVidWcgfHwgaXNEZWJ1ZyAmJiAoUmVxRmlsZS5zdGF0dXMgPT0gLTEpKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIFJlcUZpbGUucGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcblxuICAgICAgICAgICAgbmV3RGVwcyA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSk7XG5cbiAgICAgICAgICAgIGlmIChjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShSZXFGaWxlLmRlcGVuZGVuY2llcywgbmV3RGVwcykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgfSBlbHNlIGlmIChSZXFGaWxlLnN0YXR1cyA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgc3RhdGljX21vZHVsZXMgPSBmYWxzZTtcblxuICAgIGlmICghUmVxRmlsZSkge1xuICAgICAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKVxuICAgICAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5yZWxhdGl2ZSh0eXBlQXJyYXlbMF0sIF9fZGlybmFtZSksIGZpbGVQYXRoKTtcblxuICAgICAgICBlbHNlIGlmIChmaWxlUGF0aFswXSAhPSAnLycpXG4gICAgICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IHRydWU7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCA9IFJlcUZpbGUucGF0aDtcbiAgICAgICAgc3RhdGljX21vZHVsZXMgPSBSZXFGaWxlLnN0YXRpYztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGljX21vZHVsZXMpXG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEFsaWFzT3JQYWNrYWdlKGNvcHlQYXRoKSwgc3RhdHVzOiAtMSwgc3RhdGljOiB0cnVlLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgIGVsc2Uge1xuICAgICAgICAvLyBhZGQgc2Vydi5qcyBvciBzZXJ2LnRzIGlmIG5lZWRlZFxuICAgICAgICBmaWxlUGF0aCA9IEFkZEV4dGVuc2lvbihmaWxlUGF0aCk7XG5cbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSB0eXBlQXJyYXlbMF0gKyBmaWxlUGF0aDtcbiAgICAgICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVNb2RlbCA9IENhY2hlUmVxdWlyZUZpbGVzW2ZpbGVQYXRoXTtcbiAgICAgICAgICAgIGlmIChoYXZlTW9kZWwgJiYgY29tcGFyZURlcGVuZGVuY2llc1NhbWUoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcyA9IG5ld0RlcHMgPz8gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpKSlcbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSBoYXZlTW9kZWw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdEZXBzID0gbmV3RGVwcyA/PyB7fTtcblxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEltcG9ydEZpbGUoX19maWxlbmFtZSwgZmlsZVBhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgbmV3RGVwcywgaGF2ZU1vZGVsICYmIGdldENoYW5nZUFycmF5KGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKSwgZGVwZW5kZW5jaWVzOiBuZXdEZXBzLCBwYXRoOiBmaWxlUGF0aCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiB7fSwgc3RhdHVzOiAwLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtmaWxlUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBidWlsdE1vZGVsID0gTGFzdFJlcXVpcmVbY29weVBhdGhdO1xuICAgIENhY2hlUmVxdWlyZUZpbGVzW2J1aWx0TW9kZWwucGF0aF0gPSBidWlsdE1vZGVsO1xuXG4gICAgcmV0dXJuIGJ1aWx0TW9kZWwubW9kZWw7XG59IiwgImltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIHRyaW1UeXBlLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuXG4vLyAtLSBzdGFydCBvZiBmZXRjaCBmaWxlICsgY2FjaGUgLS1cblxudHlwZSBhcGlJbmZvID0ge1xuICAgIHBhdGhTcGxpdDogbnVtYmVyLFxuICAgIGRlcHNNYXA6IHsgW2tleTogc3RyaW5nXTogYW55IH1cbn1cblxuY29uc3QgYXBpU3RhdGljTWFwOiB7IFtrZXk6IHN0cmluZ106IGFwaUluZm8gfSA9IHt9O1xuXG4vKipcbiAqIEdpdmVuIGEgdXJsLCByZXR1cm4gdGhlIHN0YXRpYyBwYXRoIGFuZCBkYXRhIGluZm8gaWYgdGhlIHVybCBpcyBpbiB0aGUgc3RhdGljIG1hcFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB0aGUgdXNlciBpcyByZXF1ZXN0aW5nLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhdGhTcGxpdCAtIHRoZSBudW1iZXIgb2Ygc2xhc2hlcyBpbiB0aGUgdXJsLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAqL1xuZnVuY3Rpb24gZ2V0QXBpRnJvbU1hcCh1cmw6IHN0cmluZywgcGF0aFNwbGl0OiBudW1iZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXBpU3RhdGljTWFwKTtcbiAgICBmb3IgKGNvbnN0IGkgb2Yga2V5cykge1xuICAgICAgICBjb25zdCBlID0gYXBpU3RhdGljTWFwW2ldO1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkgJiYgZS5wYXRoU3BsaXQgPT0gcGF0aFNwbGl0KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNQYXRoOiBpLFxuICAgICAgICAgICAgICAgIGRhdGFJbmZvOiBlXG4gICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBBUEkgZmlsZSBmb3IgYSBnaXZlbiBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBBUEkuXG4gKiBAcmV0dXJucyBUaGUgcGF0aCB0byB0aGUgQVBJIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZpbmRBcGlQYXRoKHVybDogc3RyaW5nKSB7XG5cbiAgICB3aGlsZSAodXJsLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzdGFydFBhdGggPSBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzBdLCB1cmwgKyAnLmFwaScpO1xuICAgICAgICBjb25zdCBtYWtlUHJvbWlzZSA9IGFzeW5jICh0eXBlOiBzdHJpbmcpID0+IChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShzdGFydFBhdGggKyAnLicgKyB0eXBlKSAmJiB0eXBlKTtcblxuICAgICAgICBjb25zdCBmaWxlVHlwZSA9IChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgndHMnKSxcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCdqcycpXG4gICAgICAgIF0pKS5maWx0ZXIoeCA9PiB4KS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChmaWxlVHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1cmwgKyAnLmFwaS4nICsgZmlsZVR5cGU7XG5cbiAgICAgICAgdXJsID0gQ3V0VGhlTGFzdCgnLycsIHVybCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aFNwbGl0ID0gdXJsLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgIGxldCB7IHN0YXRpY1BhdGgsIGRhdGFJbmZvIH0gPSBnZXRBcGlGcm9tTWFwKHVybCwgcGF0aFNwbGl0KTtcblxuICAgIGlmICghZGF0YUluZm8pIHtcbiAgICAgICAgc3RhdGljUGF0aCA9IGF3YWl0IGZpbmRBcGlQYXRoKHVybCk7XG5cbiAgICAgICAgaWYgKHN0YXRpY1BhdGgpIHtcbiAgICAgICAgICAgIGRhdGFJbmZvID0ge1xuICAgICAgICAgICAgICAgIHBhdGhTcGxpdCxcbiAgICAgICAgICAgICAgICBkZXBzTWFwOiB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcGlTdGF0aWNNYXBbc3RhdGljUGF0aF0gPSBkYXRhSW5mbztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhSW5mbykge1xuICAgICAgICByZXR1cm4gYXdhaXQgTWFrZUNhbGwoXG4gICAgICAgICAgICBhd2FpdCBSZXF1aXJlRmlsZSgnLycgKyBzdGF0aWNQYXRoLCAnYXBpLWNhbGwnLCAnJywgZ2V0VHlwZXMuU3RhdGljLCBkYXRhSW5mby5kZXBzTWFwLCBpc0RlYnVnKSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIHVybC5zdWJzdHJpbmcoc3RhdGljUGF0aC5sZW5ndGggLSA2KSxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBuZXh0UHJhc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4vLyAtLSBlbmQgb2YgZmV0Y2ggZmlsZSAtLVxuY29uc3QgYmFuV29yZHMgPSBbJ3ZhbGlkYXRlVVJMJywgJ3ZhbGlkYXRlRnVuYycsICdmdW5jJywgJ2RlZmluZScsIC4uLmh0dHAuTUVUSE9EU107XG4vKipcbiAqIEZpbmQgdGhlIEJlc3QgUGF0aFxuICovXG5mdW5jdGlvbiBmaW5kQmVzdFVybE9iamVjdChvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nKSB7XG4gICAgbGV0IG1heExlbmd0aCA9IDAsIHVybCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBpLmxlbmd0aDtcbiAgICAgICAgaWYgKG1heExlbmd0aCA8IGxlbmd0aCAmJiB1cmxGcm9tLnN0YXJ0c1dpdGgoaSkgJiYgIWJhbldvcmRzLmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBsZW5ndGg7XG4gICAgICAgICAgICB1cmwgPSBpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBQYXJzZSBBbmQgVmFsaWRhdGUgVVJMXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlVVJMRGF0YSh2YWxpZGF0ZTogYW55LCB2YWx1ZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBsZXQgcHVzaERhdGEgPSB2YWx1ZSwgcmVzRGF0YSA9IHRydWUsIGVycm9yOiBzdHJpbmc7XG5cbiAgICBzd2l0Y2ggKHZhbGlkYXRlKSB7XG4gICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICBjYXNlIHBhcnNlRmxvYXQ6XG4gICAgICAgIGNhc2UgcGFyc2VJbnQ6XG4gICAgICAgICAgICBwdXNoRGF0YSA9ICg8YW55PnZhbGlkYXRlKSh2YWx1ZSk7XG4gICAgICAgICAgICByZXNEYXRhID0gIWlzTmFOKHB1c2hEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICBwdXNoRGF0YSA9IHZhbHVlICE9ICdmYWxzZSc7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXNEYXRhID0gdmFsdWUgPT0gJ3RydWUnIHx8IHZhbHVlID09ICdmYWxzZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdGUpKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ha2VWYWxpZCA9IGF3YWl0IHZhbGlkYXRlKHZhbHVlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWtlVmFsaWQgJiYgdHlwZW9mIG1ha2VWYWxpZCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZC52YWxpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hEYXRhID0gbWFrZVZhbGlkLnBhcnNlID8/IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQ7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvciwgZmllbGQgLSAnICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUudGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNEYXRhKVxuICAgICAgICBlcnJvciA9ICdWYWxpZGF0aW9uIGVycm9yIHdpdGggdmFsdWUgXCInICsgdmFsdWUgKyAnXCInO1xuXG4gICAgcmV0dXJuIFtlcnJvciwgcHVzaERhdGFdO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIHRoZSBVUkwgZGF0YSBhbmQgcGFyc2VzIGl0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IG9iaiAtIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgVVJMIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gVGhlIFVSTCB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSB7YW55fSBkZWZpbmVPYmplY3QgLSBBbGwgdGhlIGRlZmluaXRpb25zIHRoYXQgaGFzIGJlZW4gZm91bmRcbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSBtYWtlTWFzc2FnZSAtIENyZWF0ZSBhbiBlcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBwcm9wZXJ0eS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlZmluaXRpb24ob2JqOiBhbnksIHVybEZyb206IHN0cmluZywgZGVmaW5lT2JqZWN0OiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGlmICghb2JqLmRlZmluZSlcbiAgICAgICAgcmV0dXJuIHVybEZyb207XG5cbiAgICBjb25zdCB2YWxpZGF0ZUZ1bmMgPSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcbiAgICBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYyA9IG51bGw7XG4gICAgZGVsZXRlIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9iai5kZWZpbmUpIHtcbiAgICAgICAgY29uc3QgW2RhdGFTbGFzaCwgbmV4dFVybEZyb21dID0gU3BsaXRGaXJzdCgnLycsIHVybEZyb20pO1xuICAgICAgICB1cmxGcm9tID0gbmV4dFVybEZyb207XG5cbiAgICAgICAgY29uc3QgW2Vycm9yLCBuZXdEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YShvYmouZGVmaW5lW25hbWVdLCBkYXRhU2xhc2gsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgaWYoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgXG4gICAgICAgIGRlZmluZU9iamVjdFtuYW1lXSA9IG5ld0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgdmFsaWRhdGVGdW5jKGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycgPyB2YWxpZGF0ZTogJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJ307XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybEZyb20gfHwgJyc7XG59XG4vKipcbiAqIFRoZSBmdW5jdGlvbiB3aWxsIHBhcnNlIHRoZSB1cmwgYW5kIGZpbmQgdGhlIGJlc3QgbWF0Y2ggZm9yIHRoZSB1cmxcbiAqIEBwYXJhbSB7YW55fSBmaWxlTW9kdWxlIC0gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRob2QgdGhhdCB5b3Ugd2FudCB0byBjYWxsLlxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSB0aGUgdXJsIHRoYXQgdGhlIHVzZXIgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSAoKSA9PiBQcm9taXNlPGFueT5cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSwgdGhlIHJlcXVlc3QgaXMgcHJvY2Vzc2VkLiBJZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgZmFsc2UsIHRoZSByZXF1ZXN0IGlzIG5vdCBwcm9jZXNzZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIE1ha2VDYWxsKGZpbGVNb2R1bGU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxsb3dFcnJvckluZm8gPSAhR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpICYmIGlzRGVidWcsIG1ha2VNYXNzYWdlID0gKGU6IGFueSkgPT4gKGlzRGVidWcgPyBwcmludC5lcnJvcihlKSA6IG51bGwpICsgKGFsbG93RXJyb3JJbmZvID8gYCwgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCA6ICcnKTtcbiAgICBjb25zdCBtZXRob2QgPSBSZXF1ZXN0Lm1ldGhvZDtcbiAgICBsZXQgbWV0aG9kT2JqID0gZmlsZU1vZHVsZVttZXRob2RdIHx8IGZpbGVNb2R1bGUuZGVmYXVsdFttZXRob2RdOyAvL0xvYWRpbmcgdGhlIG1vZHVsZSBieSBtZXRob2RcbiAgICBsZXQgaGF2ZU1ldGhvZCA9IHRydWU7XG5cbiAgICBpZighbWV0aG9kT2JqKXtcbiAgICAgICAgaGF2ZU1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBtZXRob2RPYmogPSBmaWxlTW9kdWxlLmRlZmF1bHQgfHwgZmlsZU1vZHVsZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlTWV0aG9kID0gbWV0aG9kT2JqO1xuXG4gICAgY29uc3QgZGVmaW5lT2JqZWN0ID0ge307XG5cbiAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7IC8vIHJvb3QgbGV2ZWwgZGVmaW5pdGlvblxuICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuXG4gICAgbGV0IG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSk7XG5cbiAgICAvL3BhcnNlIHRoZSB1cmwgcGF0aFxuICAgIGZvcihsZXQgaSA9IDA7IGk8IDI7IGkrKyl7XG4gICAgICAgIHdoaWxlICgobmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcbiAgICAgICAgICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICAgICAgICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG4gICAgXG4gICAgICAgICAgICB1cmxGcm9tID0gdHJpbVR5cGUoJy8nLCB1cmxGcm9tLnN1YnN0cmluZyhuZXN0ZWRVUkwubGVuZ3RoKSk7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbmVzdGVkVVJMXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFoYXZlTWV0aG9kKXsgLy8gY2hlY2sgaWYgdGhhdCBhIG1ldGhvZFxuICAgICAgICAgICAgaGF2ZU1ldGhvZCA9IHRydWU7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9iaj8uZnVuYyAmJiBtZXRob2RPYmogfHwgYmFzZU1ldGhvZDsgLy8gaWYgdGhlcmUgaXMgYW4gJ2FueScgbWV0aG9kXG5cblxuICAgIGlmICghbWV0aG9kT2JqPy5mdW5jKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsZWZ0RGF0YSA9IHVybEZyb20uc3BsaXQoJy8nKTtcbiAgICBjb25zdCB1cmxEYXRhID0gW107XG5cblxuICAgIGxldCBlcnJvcjogc3RyaW5nO1xuICAgIGlmIChtZXRob2RPYmoudmFsaWRhdGVVUkwpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHZhbGlkYXRlXSBvZiBPYmplY3QuZW50cmllcyhtZXRob2RPYmoudmFsaWRhdGVVUkwpKSB7XG4gICAgICAgICAgICBjb25zdCBbZXJyb3JVUkwsIHB1c2hEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YSh2YWxpZGF0ZSwgbGVmdERhdGFbaW5kZXhdLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JVUkwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IDxzdHJpbmc+ZXJyb3JVUkw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybERhdGEucHVzaChwdXNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdXJsRGF0YS5wdXNoKC4uLmxlZnREYXRhKTtcblxuICAgIGlmICghZXJyb3IgJiYgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYyhsZWZ0RGF0YSwgUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZTtcbiAgICAgICAgZWxzZSBpZiAoIXZhbGlkYXRlKVxuICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGluZyBVUkwnO1xuICAgIH1cblxuICAgIGlmIChlcnJvcilcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvciB9KTtcblxuICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGxldCBhcGlSZXNwb25zZTogYW55LCBuZXdSZXNwb25zZTogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGFwaVJlc3BvbnNlID0gYXdhaXQgbWV0aG9kT2JqLmZ1bmMoUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEsIGRlZmluZU9iamVjdCwgbGVmdERhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGFsbG93RXJyb3JJbmZvKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiBlLm1lc3NhZ2UgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6ICc1MDAgLSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhcGlSZXNwb25zZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyB0ZXh0OiBhcGlSZXNwb25zZSB9O1xuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSBhcGlSZXNwb25zZSB8fCBuZXdSZXNwb25zZTtcblxuICAgIGZpbmFsU3RlcCgpOyAgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgaWYgKG5ld1Jlc3BvbnNlICE9IG51bGwpXG4gICAgICAgIFJlc3BvbnNlLmpzb24obmV3UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSBhcyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgR2V0RmlsZSBhcyBHZXRTdGF0aWNGaWxlLCBzZXJ2ZXJCdWlsZCB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgKiBhcyBGdW5jU2NyaXB0IGZyb20gJy4vRnVuY3Rpb25TY3JpcHQnO1xuaW1wb3J0IE1ha2VBcGlDYWxsIGZyb20gJy4vQXBpQ2FsbCc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmNvbnN0IHsgRXhwb3J0IH0gPSBGdW5jU2NyaXB0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yUGFnZXMge1xuICAgIG5vdEZvdW5kPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9LFxuICAgIHNlcnZlckVycm9yPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9XG59XG5cbmludGVyZmFjZSBHZXRQYWdlc1NldHRpbmdzIHtcbiAgICBDYWNoZURheXM6IG51bWJlcixcbiAgICBEZXZNb2RlOiBib29sZWFuLFxuICAgIENvb2tpZVNldHRpbmdzPzogYW55LFxuICAgIENvb2tpZXM/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBDb29raWVFbmNyeXB0ZXI/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBTZXNzaW9uU3RvcmU/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBFcnJvclBhZ2VzOiBFcnJvclBhZ2VzXG59XG5cbmNvbnN0IFNldHRpbmdzOiBHZXRQYWdlc1NldHRpbmdzID0ge1xuICAgIENhY2hlRGF5czogMSxcbiAgICBEZXZNb2RlOiB0cnVlLFxuICAgIEVycm9yUGFnZXM6IHt9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlVG9SYW0odXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVuY1NjcmlwdC5nZXRGdWxsUGF0aENvbXBpbGUodXJsKSkpIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF0gPSBbXTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0gPSBhd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHVybCwgaXNEZWJ1Zyk7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UoRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0sIHVybCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkQWxsUGFnZXNUb1JhbShpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHBhZ2VEZXBzLnN0b3JlKSB7XG4gICAgICAgIGlmICghRXh0ZW5zaW9uSW5BcnJheShpLCA8YW55PkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkpKVxuICAgICAgICAgICAgYXdhaXQgTG9hZFBhZ2VUb1JhbShpLCBpc0RlYnVnKTtcblxuICAgIH1cbn1cblxuZnVuY3Rpb24gQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIEV4cG9ydC5QYWdlTG9hZFJhbSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGRlbGV0ZSBFeHBvcnQuUGFnZUxvYWRSYW1baV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBFeHRlbnNpb25JbkFycmF5KGZpbGVQYXRoOiBzdHJpbmcsIC4uLmFycmF5czogc3RyaW5nW10pIHtcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGguc3Vic3RyaW5nKGZpbGVQYXRoLmxlbmd0aCAtIGkubGVuZ3RoIC0gMSkgPT0gJy4nICsgaSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gR2V0RXJyb3JQYWdlKGNvZGU6IG51bWJlciwgTG9jU2V0dGluZ3M6ICdub3RGb3VuZCcgfCAnc2VydmVyRXJyb3InKSB7XG4gICAgbGV0IGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nO1xuICAgIGlmIChTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXSkge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWM7XG4gICAgICAgIHVybCA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLnBhdGg7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5jb2RlID8/IGNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuTG9ncztcbiAgICAgICAgdXJsID0gJ2UnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdXJsLCBhcnJheVR5cGUsIGNvZGUgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGNvZGU6IG51bWJlcikge1xuICAgIC8vZmlyc3Qgc3RlcCAtIHBhcnNlIGluZm9cbiAgICBpZiAoUmVxdWVzdC5tZXRob2QgPT0gXCJQT1NUXCIpIHtcbiAgICAgICAgaWYgKCFSZXF1ZXN0LmJvZHkgfHwgIU9iamVjdC5rZXlzKFJlcXVlc3QuYm9keSkubGVuZ3RoKVxuICAgICAgICAgICAgUmVxdWVzdC5ib2R5ID0gUmVxdWVzdC5maWVsZHMgfHwge307XG5cbiAgICB9IGVsc2VcbiAgICAgICAgUmVxdWVzdC5ib2R5ID0gZmFsc2U7XG5cblxuICAgIGlmIChSZXF1ZXN0LmNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZXMoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZUVuY3J5cHRlcihSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuU2Vzc2lvblN0b3JlKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG5cbiAgICBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgfHwge307XG4gICAgUmVxdWVzdC5maWxlcyA9IFJlcXVlc3QuZmlsZXMgfHwge307XG5cbiAgICBjb25zdCBDb3B5Q29va2llcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzKSk7XG5cbiAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gMjAxO1xuXG4gICAgLy9zZWNvbmQgc3RlcFxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChSZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDEpXG4gICAgICAgICAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gY29kZTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LnNpZ25lZENvb2tpZXMpIHsvL3VwZGF0ZSBjb29raWVzXG4gICAgICAgICAgICBpZiAodHlwZW9mIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSAnb2JqZWN0JyAmJiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gQ29weUNvb2tpZXNbaV0gfHwgSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldKSAhPSBKU09OLnN0cmluZ2lmeShDb3B5Q29va2llc1tpXSkpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY29va2llKGksIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSwgU2V0dGluZ3MuQ29va2llU2V0dGluZ3MpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gQ29weUNvb2tpZXMpIHsvL2RlbGV0ZSBub3QgZXhpdHMgY29va2llc1xuICAgICAgICAgICAgaWYgKFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNsZWFyQ29va2llKGkpO1xuXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vZm9yIGZpbmFsIHN0ZXBcbmZ1bmN0aW9uIG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55KSB7XG4gICAgaWYgKCFSZXF1ZXN0LmZpbGVzKSAvL2RlbGV0ZSBmaWxlc1xuICAgICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IGFyclBhdGggPSBbXVxuXG4gICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3QuZmlsZXMpIHtcblxuICAgICAgICBjb25zdCBlID0gUmVxdWVzdC5maWxlc1tpXTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBpbiBlKSB7XG4gICAgICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGVbYV0uZmlsZXBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGFyclBhdGgucHVzaChlLmZpbGVwYXRoKTtcblxuICAgIH1cblxuICAgIHJldHVybiBhcnJQYXRoO1xufVxuXG4vL2ZpbmFsIHN0ZXBcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJlcXVlc3RGaWxlcyhhcnJheTogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IGUgaW4gYXJyYXkpXG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNVUkxQYXRoQUZpbGUoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgdXJsOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGlmIChjb2RlID09IDIwMCkge1xuICAgICAgICBjb25zdCBmdWxsUGFnZVVybCA9IGdldFR5cGVzLlN0YXRpY1swXSArIHVybDtcbiAgICAgICAgLy9jaGVjayB0aGF0IGlzIG5vdCBzZXJ2ZXIgZmlsZVxuICAgICAgICBpZiAoYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgU2V0dGluZ3MuRGV2TW9kZSwgdXJsKSB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgICAgICByZXR1cm4gZnVsbFBhZ2VVcmw7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aDogc3RyaW5nLCBmaXJzdEZ1bmM/OiBhbnkpIHtcbiAgICBjb25zdCBwYWdlQXJyYXkgPSBbZmlyc3RGdW5jID8/IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2Uoc21hbGxQYXRoLCBTZXR0aW5ncy5EZXZNb2RlKV07XG5cbiAgICBwYWdlQXJyYXlbMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShwYWdlQXJyYXlbMF0sIHNtYWxsUGF0aCk7XG5cbiAgICBpZiAoRXhwb3J0LlBhZ2VSYW0pXG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdID0gcGFnZUFycmF5O1xuXG4gICAgcmV0dXJuIHBhZ2VBcnJheVsxXTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gbG9hZCB0aGUgZHluYW1pYyBwYWdlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBUaGUgYXJyYXkgb2YgdHlwZXMgdGhhdCB0aGUgcGFnZSBpcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsUGFnZVVybCAtIFRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gc21hbGxQYXRoIC0gVGhlIHBhdGggdG8gdGhlIHBhZ2UgZmlsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gVGhlIHN0YXR1cyBjb2RlIG9mIHRoZSBwYWdlLlxuICogQHJldHVybnMgVGhlIER5bmFtaWNGdW5jIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIGdlbmVyYXRlIHRoZSBwYWdlLlxuICogVGhlIGNvZGUgaXMgdGhlIHN0YXR1cyBjb2RlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAqIFRoZSBmdWxsUGFnZVVybCBpcyB0aGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREeW5hbWljUGFnZShhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW5TdGF0aWMgPSB1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgIGNvbnN0IHNtYWxsUGF0aCA9IGFycmF5VHlwZVsyXSArICcvJyArIGluU3RhdGljO1xuICAgIGxldCBmdWxsUGFnZVVybCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc21hbGxQYXRoO1xuXG4gICAgbGV0IER5bmFtaWNGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IGFueTtcbiAgICBpZiAoU2V0dGluZ3MuRGV2TW9kZSAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpIHtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVsxXSArIGluU3RhdGljICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2Uoc21hbGxQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUodXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgYXJyYXlUeXBlKTtcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlsxXSlcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCwgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0/LlswXSk7XG5cbiAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdPy5bMV0pXG4gICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICBlbHNlIGlmICghRXhwb3J0LlBhZ2VSYW0gJiYgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKVxuICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoLCBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXT8uWzBdKTtcblxuICAgIGVsc2UgaWYgKGFycmF5VHlwZSAhPSBnZXRUeXBlcy5Mb2dzKSB7XG4gICAgICAgIGNvbnN0IHsgYXJyYXlUeXBlLCBjb2RlLCB1cmwgfSA9IEdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlLCB1cmwsIGNvZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIER5bmFtaWNGdW5jLFxuICAgICAgICBjb2RlLFxuICAgICAgICBmdWxsUGFnZVVybFxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTWFrZVBhZ2VSZXNwb25zZShEeW5hbWljUmVzcG9uc2U6IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55KSB7XG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGg/LmZpbGUpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IFJlc3BvbnNlLm9uKCdmaW5pc2gnLCByZXMpKTtcbiAgICB9IGVsc2UgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGgpIHtcbiAgICAgICAgUmVzcG9uc2Uud3JpdGVIZWFkKDMwMiwgeyBMb2NhdGlvbjogRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCB9KTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgUmVzUGFnZSA9IER5bmFtaWNSZXNwb25zZS5vdXRfcnVuX3NjcmlwdC50cmltKCk7XG4gICAgICAgIGlmIChSZXNQYWdlKSB7XG4gICAgICAgICAgICBSZXNwb25zZS5zZW5kKFJlc1BhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5kZWxldGVBZnRlcikge1xuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gYSBwYWdlLiBcbiAqIEl0IHdpbGwgY2hlY2sgaWYgdGhlIHBhZ2UgZXhpc3RzLCBhbmQgaWYgaXQgZG9lcywgaXQgd2lsbCByZXR1cm4gdGhlIHBhZ2UuIFxuICogSWYgaXQgZG9lcyBub3QgZXhpc3QsIGl0IHdpbGwgcmV0dXJuIGEgNDA0IHBhZ2VcbiAqIEBwYXJhbSB7UmVxdWVzdCB8IGFueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aHNcbiAqIGxvYWRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBwYWdlIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7eyBmaWxlOiBib29sZWFuLCBmdWxsUGFnZVVybDogc3RyaW5nIH19IEZpbGVJbmZvIC0gdGhlIGZpbGUgaW5mbyBvZiB0aGUgcGFnZSB0aGF0IGlzIGJlaW5nIGFjdGl2YXRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gbnVtYmVyXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBhZnRlciB0aGUgZHluYW1pYyBwYWdlXG4gKiBpcyBsb2FkZWQuXG4gKiBAcmV0dXJucyBOb3RoaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBBY3RpdmF0ZVBhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgY29kZTogbnVtYmVyLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IHsgRHluYW1pY0Z1bmMsIGZ1bGxQYWdlVXJsLCBjb2RlOiBuZXdDb2RlIH0gPSBhd2FpdCBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgY29kZSk7XG5cbiAgICBpZiAoIWZ1bGxQYWdlVXJsIHx8ICFEeW5hbWljRnVuYyAmJiBjb2RlID09IDUwMClcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLnNlbmRTdGF0dXMobmV3Q29kZSk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG4gICAgICAgIGNvbnN0IHBhZ2VEYXRhID0gYXdhaXQgRHluYW1pY0Z1bmMoUmVzcG9uc2UsIFJlcXVlc3QsIFJlcXVlc3QuYm9keSwgUmVxdWVzdC5xdWVyeSwgUmVxdWVzdC5jb29raWVzLCBSZXF1ZXN0LnNlc3Npb24sIFJlcXVlc3QuZmlsZXMsIFNldHRpbmdzLkRldk1vZGUpO1xuICAgICAgICBmaW5hbFN0ZXAoKTsgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgICAgIGF3YWl0IE1ha2VQYWdlUmVzcG9uc2UoXG4gICAgICAgICAgICBwYWdlRGF0YSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICBwcmludC5lcnJvcihlKTtcbiAgICAgICAgUmVxdWVzdC5lcnJvciA9IGU7XG5cbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gR2V0RXJyb3JQYWdlKDUwMCwgJ3NlcnZlckVycm9yJyk7XG5cbiAgICAgICAgRHluYW1pY1BhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBEeW5hbWljUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnksIHVybDogc3RyaW5nLCBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWMsIGNvZGUgPSAyMDApIHtcbiAgICBjb25zdCBGaWxlSW5mbyA9IGF3YWl0IGlzVVJMUGF0aEFGaWxlKFJlcXVlc3QsIHVybCwgY29kZSk7XG5cbiAgICBjb25zdCBtYWtlRGVsZXRlQXJyYXkgPSBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdClcblxuICAgIGlmIChGaWxlSW5mbykge1xuICAgICAgICBTZXR0aW5ncy5DYWNoZURheXMgJiYgUmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcIm1heC1hZ2U9XCIgKyAoU2V0dGluZ3MuQ2FjaGVEYXlzICogMjQgKiA2MCAqIDYwKSk7XG4gICAgICAgIGF3YWl0IEdldFN0YXRpY0ZpbGUodXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFByYXNlID0gKCkgPT4gUGFyc2VCYXNpY0luZm8oUmVxdWVzdCwgUmVzcG9uc2UsIGNvZGUpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGNvbnN0IGlzQXBpID0gYXdhaXQgTWFrZUFwaUNhbGwoUmVxdWVzdCwgUmVzcG9uc2UsIHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgbmV4dFByYXNlKTtcbiAgICBpZiAoIWlzQXBpICYmICFhd2FpdCBBY3RpdmF0ZVBhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIGFycmF5VHlwZSwgdXJsLCBjb2RlLCBuZXh0UHJhc2UpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTsgLy8gZGVsZXRlIGZpbGVzXG59XG5cbmZ1bmN0aW9uIHVybEZpeCh1cmw6IHN0cmluZykge1xuICAgIGlmICh1cmwgPT0gJy8nKSB7XG4gICAgICAgIHVybCA9ICcvaW5kZXgnO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbn1cblxuZXhwb3J0IHtcbiAgICBTZXR0aW5ncyxcbiAgICBEeW5hbWljUGFnZSxcbiAgICBMb2FkQWxsUGFnZXNUb1JhbSxcbiAgICBDbGVhckFsbFBhZ2VzRnJvbVJhbSxcbiAgICB1cmxGaXgsXG4gICAgR2V0RXJyb3JQYWdlXG59IiwgImltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0ICogYXMgQnVpbGRTZXJ2ZXIgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IGNvb2tpZVBhcnNlciB9IGZyb20gJ0B0aW55aHR0cC9jb29raWUtcGFyc2VyJztcbmltcG9ydCBjb29raWVFbmNyeXB0ZXIgZnJvbSAnY29va2llLWVuY3J5cHRlcic7XG5pbXBvcnQgeyBhbGxvd1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgSW5zZXJ0TW9kZWxzU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IHsgU3RhcnRSZXF1aXJlLCBHZXRTZXR0aW5ncyB9IGZyb20gJy4vSW1wb3J0TW9kdWxlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIGNyZWF0ZU5ld1ByaW50U2V0dGluZ3MgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgTWVtb3J5U2Vzc2lvbiBmcm9tICdtZW1vcnlzdG9yZSc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBkZWJ1Z1NpdGVNYXAgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2l0ZU1hcCc7XG5pbXBvcnQgeyBzZXR0aW5ncyBhcyBkZWZpbmVTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHtFeHBvcnQgYXMgRXhwb3J0UmFtfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQnXG5cbmNvbnN0XG4gICAgQ29va2llc1NlY3JldCA9IHV1aWR2NCgpLnN1YnN0cmluZygwLCAzMiksXG4gICAgU2Vzc2lvblNlY3JldCA9IHV1aWR2NCgpLFxuICAgIE1lbW9yeVN0b3JlID0gTWVtb3J5U2Vzc2lvbihzZXNzaW9uKSxcblxuICAgIENvb2tpZXNNaWRkbGV3YXJlID0gY29va2llUGFyc2VyKENvb2tpZXNTZWNyZXQpLFxuICAgIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmUgPSBjb29raWVFbmNyeXB0ZXIoQ29va2llc1NlY3JldCwge30pLFxuICAgIENvb2tpZVNldHRpbmdzID0geyBodHRwT25seTogdHJ1ZSwgc2lnbmVkOiB0cnVlLCBtYXhBZ2U6IDg2NDAwMDAwICogMzAgfTtcblxuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZXMgPSA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZUVuY3J5cHRlciA9IDxhbnk+Q29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVTZXR0aW5ncyA9IENvb2tpZVNldHRpbmdzO1xuXG5sZXQgRGV2TW9kZV8gPSB0cnVlLCBjb21waWxhdGlvblNjYW46IFByb21pc2U8KCkgPT4gUHJvbWlzZTx2b2lkPj4sIFNlc3Npb25TdG9yZTtcblxubGV0IGZvcm1pZGFibGVTZXJ2ZXIsIGJvZHlQYXJzZXJTZXJ2ZXI7XG5cbmNvbnN0IHNlcnZlTGltaXRzID0ge1xuICAgIHNlc3Npb25Ub3RhbFJhbU1COiAxNTAsXG4gICAgc2Vzc2lvblRpbWVNaW51dGVzOiA0MCxcbiAgICBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzOiAzMCxcbiAgICBmaWxlTGltaXRNQjogMTAsXG4gICAgcmVxdWVzdExpbWl0TUI6IDRcbn1cblxubGV0IHBhZ2VJblJhbUFjdGl2YXRlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpe1xuICAgIHJldHVybiBwYWdlSW5SYW1BY3RpdmF0ZTtcbn1cblxuY29uc3QgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyA9IFsuLi5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCAuLi5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5XTtcbmNvbnN0IGJhc2VWYWxpZFBhdGggPSBbKHBhdGg6IHN0cmluZykgPT4gcGF0aC5zcGxpdCgnLicpLmF0KC0yKSAhPSAnc2VydiddOyAvLyBpZ25vcmluZyBmaWxlcyB0aGF0IGVuZHMgd2l0aCAuc2Vydi4qXG5cbmV4cG9ydCBjb25zdCBFeHBvcnQ6IEV4cG9ydFNldHRpbmdzID0ge1xuICAgIGdldCBzZXR0aW5nc1BhdGgoKSB7XG4gICAgICAgIHJldHVybiB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgXCIvU2V0dGluZ3NcIjtcbiAgICB9LFxuICAgIHNldCBkZXZlbG9wbWVudCh2YWx1ZSkge1xuICAgICAgICBpZihEZXZNb2RlXyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgIERldk1vZGVfID0gdmFsdWU7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uU2NhbiA9IEJ1aWxkU2VydmVyLmNvbXBpbGVBbGwoRXhwb3J0KTtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkRldk1vZGUgPSB2YWx1ZTtcbiAgICAgICAgYWxsb3dQcmludCh2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXQgZGV2ZWxvcG1lbnQoKSB7XG4gICAgICAgIHJldHVybiBEZXZNb2RlXztcbiAgICB9LFxuICAgIG1pZGRsZXdhcmU6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKTogKHJlcTogUmVxdWVzdCwgX3JlczogUmVzcG9uc2U8YW55PiwgbmV4dD86IE5leHRGdW5jdGlvbikgPT4gdm9pZCB7XG4gICAgICAgICAgICByZXR1cm4gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZUVuY3J5cHRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU3RvcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmb3JtaWRhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1pZGFibGVTZXJ2ZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBib2R5UGFyc2VyKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvZHlQYXJzZXJTZXJ2ZXI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlY3JldDoge1xuICAgICAgICBnZXQgY29va2llcygpIHtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzU2VjcmV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uU2VjcmV0O1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZ2VuZXJhbDoge1xuICAgICAgICBpbXBvcnRPbkxvYWQ6IFtdLFxuICAgICAgICBzZXQgcGFnZUluUmFtKHZhbHVlKSB7XG4gICAgICAgICAgICBFeHBvcnRSYW0uUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlcGFyYXRpb25zID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgICAgICAgICAgICAgIGF3YWl0IHByZXBhcmF0aW9ucz8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVCeVVybC5Mb2FkQWxsUGFnZXNUb1JhbShFeHBvcnQuZGV2ZWxvcG1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVCeVVybC5DbGVhckFsbFBhZ2VzRnJvbVJhbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBhZ2VJblJhbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBFeHBvcnRSYW0uUGFnZVJhbTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcGlsZToge1xuICAgICAgICBzZXQgY29tcGlsZVN5bnRheCh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29tcGlsZVN5bnRheCgpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4O1xuICAgICAgICB9LFxuICAgICAgICBzZXQgaWdub3JlRXJyb3IodmFsdWUpIHtcbiAgICAgICAgICAgICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlnbm9yZUVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBwbHVnaW5zKHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgcGx1Z2lucygpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZGVmaW5lKCl7XG4gICAgICAgICAgICByZXR1cm4gZGVmaW5lU2V0dGluZ3MuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHNldCBkZWZpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIGRlZmluZVNldHRpbmdzLmRlZmluZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5nOiB7XG4gICAgICAgIHJ1bGVzOiB7fSxcbiAgICAgICAgdXJsU3RvcDogW10sXG4gICAgICAgIHZhbGlkUGF0aDogYmFzZVZhbGlkUGF0aCxcbiAgICAgICAgaWdub3JlVHlwZXM6IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMsXG4gICAgICAgIGlnbm9yZVBhdGhzOiBbXSxcbiAgICAgICAgc2l0ZW1hcDogdHJ1ZSxcbiAgICAgICAgZ2V0IGVycm9yUGFnZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBlcnJvclBhZ2VzKHZhbHVlKSB7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZUxpbWl0czoge1xuICAgICAgICBnZXQgY2FjaGVEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNhY2hlRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVzRXhwaXJlc0RheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVTZXR0aW5ncy5tYXhBZ2UgLyA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNvb2tpZXNFeHBpcmVzRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBDb29raWVTZXR0aW5ncy5tYXhBZ2UgPSB2YWx1ZSAqIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRvdGFsUmFtTUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRvdGFsUmFtTUIoKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25UaW1lTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRpbWVNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZmlsZUxpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmaWxlTGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHJlcXVlc3RMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICAgICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCByZXF1ZXN0TGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmU6IHtcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgaHR0cDI6IGZhbHNlLFxuICAgICAgICBncmVlbkxvY2s6IHtcbiAgICAgICAgICAgIHN0YWdpbmc6IG51bGwsXG4gICAgICAgICAgICBjbHVzdGVyOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICBhZ2VudDogbnVsbCxcbiAgICAgICAgICAgIGFncmVlVG9UZXJtczogZmFsc2UsXG4gICAgICAgICAgICBzaXRlczogW11cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybWlkYWJsZSgpIHtcbiAgICBmb3JtaWRhYmxlU2VydmVyID0ge1xuICAgICAgICBtYXhGaWxlU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLmZpbGVMaW1pdE1CICogMTA0ODU3NixcbiAgICAgICAgdXBsb2FkRGlyOiBTeXN0ZW1EYXRhICsgXCIvVXBsb2FkRmlsZXMvXCIsXG4gICAgICAgIG11bHRpcGxlczogdHJ1ZSxcbiAgICAgICAgbWF4RmllbGRzU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICogMTA0ODU3NlxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJvZHlQYXJzZXIoKSB7XG4gICAgYm9keVBhcnNlclNlcnZlciA9ICg8YW55PmJvZHlQYXJzZXIpLmpzb24oeyBsaW1pdDogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICsgJ21iJyB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZXNzaW9uKCkge1xuICAgIGlmICghRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyB8fCAhRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CKSB7XG4gICAgICAgIFNlc3Npb25TdG9yZSA9IChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2Vzc2lvblN0b3JlID0gc2Vzc2lvbih7XG4gICAgICAgIGNvb2tpZTogeyBtYXhBZ2U6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgKiA2MCAqIDEwMDAsIHNhbWVTaXRlOiB0cnVlIH0sXG4gICAgICAgIHNlY3JldDogU2Vzc2lvblNlY3JldCxcbiAgICAgICAgcmVzYXZlOiBmYWxzZSxcbiAgICAgICAgc2F2ZVVuaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzdG9yZTogbmV3IE1lbW9yeVN0b3JlKHtcbiAgICAgICAgICAgIGNoZWNrUGVyaW9kOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgIG1heDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CICogMTA0ODU3NlxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb3B5SlNPTih0bzogYW55LCBqc29uOiBhbnksIHJ1bGVzOiBzdHJpbmdbXSA9IFtdLCBydWxlc1R5cGU6ICdpZ25vcmUnIHwgJ29ubHknID0gJ2lnbm9yZScpIHtcbiAgICBpZighanNvbikgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBoYXNJbXBsZWF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGkgaW4ganNvbikge1xuICAgICAgICBjb25zdCBpbmNsdWRlID0gcnVsZXMuaW5jbHVkZXMoaSk7XG4gICAgICAgIGlmIChydWxlc1R5cGUgPT0gJ29ubHknICYmIGluY2x1ZGUgfHwgcnVsZXNUeXBlID09ICdpZ25vcmUnICYmICFpbmNsdWRlKSB7XG4gICAgICAgICAgICBoYXNJbXBsZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdG9baV0gPSBqc29uW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNJbXBsZWF0ZWQ7XG59XG5cbi8vIHJlYWQgdGhlIHNldHRpbmdzIG9mIHRoZSB3ZWJzaXRlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IFNldHRpbmdzOiBFeHBvcnRTZXR0aW5ncyA9IGF3YWl0IEdldFNldHRpbmdzKEV4cG9ydC5zZXR0aW5nc1BhdGgsIERldk1vZGVfKTtcbiAgICBpZihTZXR0aW5ncyA9PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxEZXYpO1xuXG4gICAgZWxzZVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsUHJvZCk7XG5cblxuICAgIGNvcHlKU09OKEV4cG9ydC5jb21waWxlLCBTZXR0aW5ncy5jb21waWxlKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5yb3V0aW5nLCBTZXR0aW5ncy5yb3V0aW5nLCBbJ2lnbm9yZVR5cGVzJywgJ3ZhbGlkUGF0aCddKTtcblxuICAgIC8vY29uY2F0IGRlZmF1bHQgdmFsdWVzIG9mIHJvdXRpbmdcbiAgICBjb25zdCBjb25jYXRBcnJheSA9IChuYW1lOiBzdHJpbmcsIGFycmF5OiBhbnlbXSkgPT4gU2V0dGluZ3Mucm91dGluZz8uW25hbWVdICYmIChFeHBvcnQucm91dGluZ1tuYW1lXSA9IFNldHRpbmdzLnJvdXRpbmdbbmFtZV0uY29uY2F0KGFycmF5KSk7XG5cbiAgICBjb25jYXRBcnJheSgnaWdub3JlVHlwZXMnLCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzKTtcbiAgICBjb25jYXRBcnJheSgndmFsaWRQYXRoJywgYmFzZVZhbGlkUGF0aCk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2NhY2hlRGF5cycsICdjb29raWVzRXhwaXJlc0RheXMnXSwgJ29ubHknKTtcblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnc2Vzc2lvblRvdGFsUmFtTUInLCAnc2Vzc2lvblRpbWVNaW51dGVzJywgJ3Nlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMnXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2ZpbGVMaW1pdE1CJywgJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuICAgIH1cblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZSwgU2V0dGluZ3Muc2VydmUpO1xuXG4gICAgLyogLS0tIHByb2JsZW1hdGljIHVwZGF0ZXMgLS0tICovXG4gICAgRXhwb3J0LmRldmVsb3BtZW50ID0gU2V0dGluZ3MuZGV2ZWxvcG1lbnRcblxuICAgIGlmIChTZXR0aW5ncy5nZW5lcmFsPy5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgRXhwb3J0LmdlbmVyYWwuaW1wb3J0T25Mb2FkID0gPGFueT5hd2FpdCBTdGFydFJlcXVpcmUoPGFueT5TZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCwgRGV2TW9kZV8pO1xuICAgIH1cblxuICAgIC8vbmVlZCB0byBkb3duIGxhc3RlZCBzbyBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aCAnaW1wb3J0T25Mb2FkJ1xuICAgIGlmICghY29weUpTT04oRXhwb3J0LmdlbmVyYWwsIFNldHRpbmdzLmdlbmVyYWwsIFsncGFnZUluUmFtJ10sICdvbmx5JykgJiYgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgfVxuXG4gICAgaWYoRXhwb3J0LmRldmVsb3BtZW50ICYmIEV4cG9ydC5yb3V0aW5nLnNpdGVtYXApeyAvLyBvbiBwcm9kdWN0aW9uIHRoaXMgd2lsbCBiZSBjaGVja2VkIGFmdGVyIGNyZWF0aW5nIHN0YXRlXG4gICAgICAgIGRlYnVnU2l0ZU1hcChFeHBvcnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlyc3RMb2FkKCkge1xuICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIGJ1aWxkQm9keVBhcnNlcigpO1xufSIsICJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMic7XG5pbXBvcnQgKiBhcyBjcmVhdGVDZXJ0IGZyb20gJ3NlbGZzaWduZWQnO1xuaW1wb3J0ICogYXMgR3JlZW5sb2NrIGZyb20gJ2dyZWVubG9jay1leHByZXNzJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGVsZXRlSW5EaXJlY3RvcnksIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBHcmVlbkxvY2tTaXRlIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgZm9sZGVyIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2VzXG4gKiBleGlzdCwgdXBkYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZvbGRlciB0byBjcmVhdGUuXG4gKiBAcGFyYW0gQ3JlYXRlSW5Ob3RFeGl0cyAtIHtcbiAqL1xuYXN5bmMgZnVuY3Rpb24gVG91Y2hTeXN0ZW1Gb2xkZXIoZm9OYW1lOiBzdHJpbmcsIENyZWF0ZUluTm90RXhpdHM6IHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGV4aXRzPzogYW55fSkge1xuICAgIGxldCBzYXZlUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyBcIi9TeXN0ZW1TYXZlL1wiO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgc2F2ZVBhdGggKz0gZm9OYW1lO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgaWYgKENyZWF0ZUluTm90RXhpdHMpIHtcbiAgICAgICAgc2F2ZVBhdGggKz0gJy8nO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHNhdmVQYXRoICsgQ3JlYXRlSW5Ob3RFeGl0cy5uYW1lO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBDcmVhdGVJbk5vdEV4aXRzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBhd2FpdCBDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKSwgZmlsZVBhdGgsIHNhdmVQYXRoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSXQgZ2VuZXJhdGVzIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgYW5kIHN0b3JlcyBpdCBpbiBhIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgY2VydGlmaWNhdGUgYW5kIGtleSBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldERlbW9DZXJ0aWZpY2F0ZSgpIHtcbiAgICBsZXQgQ2VydGlmaWNhdGU6IGFueTtcbiAgICBjb25zdCBDZXJ0aWZpY2F0ZVBhdGggPSBTeXN0ZW1EYXRhICsgJy9DZXJ0aWZpY2F0ZS5qc29uJztcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShDZXJ0aWZpY2F0ZVBhdGgpKSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gRWFzeUZzLnJlYWRKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUNlcnQuZ2VuZXJhdGUobnVsbCwgeyBkYXlzOiAzNjUwMCB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5cy5wcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgsIENlcnRpZmljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIENlcnRpZmljYXRlO1xufVxuXG5mdW5jdGlvbiBEZWZhdWx0TGlzdGVuKGFwcCkge1xuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5hdHRhY2gpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgbGlzdGVuKHBvcnQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCA8YW55PnJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIGdyZWVubG9jaywgaXQgd2lsbCBjcmVhdGUgYSBzZXJ2ZXIgdGhhdCB3aWxsIHNlcnZlIHlvdXIgYXBwIG92ZXIgaHR0cHNcbiAqIEBwYXJhbSBhcHAgLSBUaGUgdGlueUh0dHAgYXBwbGljYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdGhlIHNlcnZlciBtZXRob2RzXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFVwZGF0ZUdyZWVuTG9jayhhcHApIHtcblxuICAgIGlmICghKFNldHRpbmdzLnNlcnZlLmh0dHAyIHx8IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jaz8uYWdyZWVUb1Rlcm1zKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgRGVmYXVsdExpc3RlbihhcHApO1xuICAgIH1cblxuICAgIGlmICghU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFncmVlVG9UZXJtcykge1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwMi5jcmVhdGVTZWN1cmVTZXJ2ZXIoeyAuLi5hd2FpdCBHZXREZW1vQ2VydGlmaWNhdGUoKSwgYWxsb3dIVFRQMTogdHJ1ZSB9LCBhcHAuYXR0YWNoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuKHBvcnQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBUb3VjaFN5c3RlbUZvbGRlcihcImdyZWVubG9ja1wiLCB7XG4gICAgICAgIG5hbWU6IFwiY29uZmlnLmpzb25cIiwgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpdGVzOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXNcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGV4aXRzKGZpbGUsIF8sIGZvbGRlcikge1xuICAgICAgICAgICAgZmlsZSA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmlsZS5zaXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBmaWxlLnNpdGVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiA8R3JlZW5Mb2NrU2l0ZVtdPiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuc3ViamVjdCA9PSBlLnN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuYWx0bmFtZXMubGVuZ3RoICE9IGUuYWx0bmFtZXMubGVuZ3RoIHx8IGIuYWx0bmFtZXMuc29tZSh2ID0+IGUuYWx0bmFtZXMuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5hbHRuYW1lcyA9IGIuYWx0bmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUucmVuZXdBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGF2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnNpdGVzLnNwbGljZShpLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGZvbGRlciArIFwibGl2ZS9cIiArIGUuc3ViamVjdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NpdGVzID0gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzLmZpbHRlcigoeCkgPT4gIWZpbGUuc2l0ZXMuZmluZChiID0+IGIuc3ViamVjdCA9PSB4LnN1YmplY3QpKTtcblxuICAgICAgICAgICAgZmlsZS5zaXRlcy5wdXNoKC4uLm5ld1NpdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUod29ya2luZ0RpcmVjdG9yeSArIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgZ3JlZW5sb2NrT2JqZWN0OmFueSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBHcmVlbmxvY2suaW5pdCh7XG4gICAgICAgIHBhY2thZ2VSb290OiB3b3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBjb25maWdEaXI6IFwiU3lzdGVtU2F2ZS9ncmVlbmxvY2tcIixcbiAgICAgICAgcGFja2FnZUFnZW50OiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdlbnQgfHwgcGFja2FnZUluZm8ubmFtZSArICcvJyArIHBhY2thZ2VJbmZvLnZlcnNpb24sXG4gICAgICAgIG1haW50YWluZXJFbWFpbDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmVtYWlsLFxuICAgICAgICBjbHVzdGVyOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suY2x1c3RlcixcbiAgICAgICAgc3RhZ2luZzogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnN0YWdpbmdcbiAgICB9KS5yZWFkeShyZXMpKTtcblxuICAgIGZ1bmN0aW9uIENyZWF0ZVNlcnZlcih0eXBlLCBmdW5jLCBvcHRpb25zPykge1xuICAgICAgICBsZXQgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4geyB9O1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3RbdHlwZV0ob3B0aW9ucywgZnVuYyk7XG4gICAgICAgIGNvbnN0IGxpc3RlbiA9IChwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwU2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0Lmh0dHBTZXJ2ZXIoKTtcbiAgICAgICAgICAgIENsb3NlaHR0cFNlcnZlciA9ICgpID0+IGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UocmVzID0+IHNlcnZlci5saXN0ZW4oNDQzLCBcIjAuMC4wLjBcIiwgcmVzKSksIG5ldyBQcm9taXNlKHJlcyA9PiBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBcIjAuMC4wLjBcIiwgcmVzKSldKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHNlcnZlci5jbG9zZSgpOyBDbG9zZWh0dHBTZXJ2ZXIoKTsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3RlbixcbiAgICAgICAgICAgIGNsb3NlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cDJTZXJ2ZXInLCBhcHAuYXR0YWNoLCB7IGFsbG93SFRUUDE6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cHNTZXJ2ZXInLCBhcHAuYXR0YWNoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHNlcnZlciwge1NldHRpbmdzfSAgZnJvbSAnLi9NYWluQnVpbGQvU2VydmVyJztcbmltcG9ydCBhc3luY1JlcXVpcmUgZnJvbSAnLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHtnZXRUeXBlc30gZnJvbSAnLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gJy4vR2xvYmFsL1NlYXJjaFJlY29yZCc7XG5leHBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vTWFpbkJ1aWxkL1R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEFzeW5jSW1wb3J0ID0gKHBhdGg6c3RyaW5nLCBpbXBvcnRGcm9tID0gJ2FzeW5jIGltcG9ydCcpID0+IGFzeW5jUmVxdWlyZShpbXBvcnRGcm9tLCBwYXRoLCBnZXRUeXBlcy5TdGF0aWMsIHtpc0RlYnVnOiBTZXR0aW5ncy5kZXZlbG9wbWVudH0pO1xuZXhwb3J0IHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7OztBQ0ZBOzs7QUNBQSxJQUFJLFlBQVk7QUFFVCxvQkFBb0IsR0FBWTtBQUNuQyxjQUFZO0FBQ2hCO0FBRU8sSUFBTSxRQUFRLElBQUksTUFBTSxTQUFRO0FBQUEsRUFDbkMsSUFBSSxRQUFRLE1BQU0sVUFBVTtBQUN4QixRQUFHLFFBQVE7QUFDUCxhQUFPLE9BQU87QUFFbEIsUUFBRyxhQUFhLFFBQVE7QUFDcEIsYUFBTyxPQUFPO0FBQ2xCLFdBQU8sTUFBTTtBQUFBLElBQUM7QUFBQSxFQUNsQjtBQUNKLENBQUM7OztBRGJEO0FBRUEsZ0JBQWdCLFFBQStCO0FBQzNDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxLQUFLLFFBQU0sQ0FBQyxLQUFLLFVBQVM7QUFDekIsVUFBSSxRQUFRLEtBQUksQ0FBQztBQUFBLElBQ3JCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQVFBLGNBQWMsUUFBYyxPQUFnQixhQUF1QixlQUFtQixDQUFDLEdBQXdCO0FBQzNHLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxLQUFLLFFBQU0sQ0FBQyxLQUFLLFVBQVM7QUFDekIsVUFBRyxPQUFPLENBQUMsYUFBWTtBQUNuQixjQUFNLE1BQU0sR0FBRztBQUFBLE1BQ25CO0FBQ0EsVUFBSSxTQUFTLFFBQU0sTUFBSyxTQUFRLFNBQVEsWUFBWTtBQUFBLElBQ3hELENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQVFBLDBCQUEwQixRQUFjLGVBQW9CLE1BQXVCO0FBQy9FLFNBQVEsT0FBTSxLQUFLLFFBQU0sUUFBVyxJQUFJLEdBQUcsU0FBUyxLQUFLO0FBQzdEO0FBT0EsZUFBZSxRQUErQjtBQUMxQyxTQUFPLElBQUksUUFBUSxT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
