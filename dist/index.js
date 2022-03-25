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
    return [type, text.replace(/<line>/gi, " -> ") + `

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
    ResCode = SaveServerCode.RestoreCode(await SourceMapToStringTracker(code, map));
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
    let p = i;
    if (i == "thisPage") {
      p = path22 + "." + BasicSettings.pageTypes.page;
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
    const [funcName, printText] = createNewPrint({
      text: `
Page not found: ${type.at(0).lineInfo} -> ${FullPath2}`,
      errorName: "page-not-found",
      type: "error"
    });
    print[funcName](printText);
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
  text = await text.replacerAsync(/(<style)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>)(.*?)(<\/style>)/s, async (args) => {
    styleLang = args[4]?.eq ?? "css";
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
    const location = dataTag2.remove("file");
    let filePath = location[0] == "/" ? getTypes.Static[0] + location : path8.join(path8.dirname(type.extractInfo("<line>")), location);
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
var recordStore = new StoreJSON("Records");
function recordLink(dataTag2, sessionInfo2) {
  return dataTag2.remove("link") || smallPathToPage(sessionInfo2.smallPath);
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
        unwrapped.push({ id: counter++, text: element.titles[id], url: `/${path22}/#${id}` });
      }
      unwrapped.push({ id: counter++, text: element.text, url: `/${path22}` });
    }
    this.miniSearch = new MiniSearch({
      fields: ["text"],
      storeFields: ["id", "text", "url"]
    });
    this.miniSearch.addAll(unwrapped);
  }
  search(text, options = { fuzzy: true }, tag = "b") {
    const data = this.miniSearch.search(text, options);
    if (!tag)
      return data;
    for (const i of data) {
      for (const term of i.terms) {
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
    if (mergeTrack) {
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
async function LoadImport(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache = []) {
  let TimeCheck;
  const originalPath = path9.normalize(InStaticPath.toLowerCase());
  InStaticPath = AddExtension(InStaticPath);
  const extension = path9.extname(InStaticPath).substring(1), thisCustom = isPathCustom(originalPath, extension) || !["js", "ts"].includes(extension);
  const SavedModulesPath = path9.join(typeArray[2], InStaticPath), filePath = path9.join(typeArray[0], InStaticPath);
  let processEnd;
  if (!SavedModules[SavedModulesPath])
    SavedModules[SavedModulesPath] = new Promise((r) => processEnd = r);
  else if (SavedModules[SavedModulesPath] instanceof Promise)
    await SavedModules[SavedModulesPath];
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
    return LoadImport(filePath, p, typeArray, isDebug, useDeps, inheritanceCache ? withoutCache : []);
  }
  let MyModule;
  if (thisCustom) {
    MyModule = await CustomImport(originalPath, filePath, extension, requireMap);
  } else {
    const requirePath = path9.join(typeArray[1], InStaticPath + ".cjs");
    MyModule = await redirectCJS_default(requirePath);
    MyModule = await MyModule(requireMap);
  }
  SavedModules[SavedModulesPath] = MyModule;
  processEnd?.();
  return MyModule;
}
function ImportFile(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache) {
  if (!isDebug) {
    const haveImport = SavedModules[path9.join(typeArray[2], InStaticPath.toLowerCase())];
    if (haveImport !== void 0)
      return haveImport;
  }
  return LoadImport(importFrom, InStaticPath, typeArray, isDebug, useDeps, withoutCache);
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
    const { funcs, string } = this.methods(attributes);
    const toImport = await compileImport(string, compilePath, filePath, typeArray, this.isTs, this.sessionInfo.debug, template4);
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
    if (await sessionInfo2.dependence(SmallPath, haveCode)) {
      const baseModelData = await AddDebugInfo(false, pageName, haveCode, SmallPath);
      this.scriptFile = baseModelData.allData.replaceAll("@", "@@");
      this.scriptFile.AddTextBeforeNoTrack("<%");
      this.scriptFile.AddTextAfterNoTrack("%>");
      sessionInfo2.debug && this.scriptFile.AddTextBeforeNoTrack(baseModelData.stringInfo);
    } else {
      const [funcName, printText] = createNewPrint({
        id: SmallPath,
        type: "error",
        errorName: "codeFileNotFound",
        text: `
Code file not found: ${pagePath}<line>${SmallPath}`
      });
      print[funcName](printText);
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
import path12 from "path";
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
  static addSpacialAttributes(data, mapAttributes, type, BetweenTagData) {
    const addAttr = (key, value2) => {
      data.push({ n: new StringTracker(null, key), v: new StringTracker(null, value2) });
      mapAttributes[key] = value2;
    };
    const importSource = "/" + type.extractInfo();
    addAttr("importSource", importSource);
    addAttr("importSourceDirectory", path12.dirname(importSource));
    mapAttributes.reader = BetweenTagData?.eq;
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
          const [funcName, printText] = createNewPrint({
            text: `Component ${type.eq} not found! -> ${pathName}
-> ${type.lineInfo}
${AllPathTypes.SmallPath}`,
            errorName: "component-not-found",
            type: "error"
          });
          print[funcName](printText);
        }
        return this.ReBuildTag(type, dataTag2, data, BetweenTagData, (BetweenTagData2) => this.StartReplace(BetweenTagData2, pathName, sessionInfo2));
      }
      if (!sessionInfo2.cacheComponent[AllPathTypes.SmallPath]?.mtimeMs)
        sessionInfo2.cacheComponent[AllPathTypes.SmallPath] = { mtimeMs: await EasyFs_default.stat(AllPathTypes.FullPath, "mtimeMs") };
      sessionInfo2.dependencies[AllPathTypes.SmallPath] = sessionInfo2.cacheComponent[AllPathTypes.SmallPath].mtimeMs;
      const { allData, stringInfo } = await AddDebugInfo(true, pathName, AllPathTypes.FullPath, AllPathTypes.SmallPath, sessionInfo2.cacheComponent[AllPathTypes.SmallPath]);
      const baseData = new ParseBasePage(allData, this.isTs());
      InsertComponent.addSpacialAttributes(data, mapAttributes, type, BetweenTagData);
      await baseData.loadSettings(sessionInfo2, AllPathTypes.FullPath, AllPathTypes.SmallPath, pathName + " -> " + AllPathTypes.SmallPath, mapAttributes);
      fileData = baseData.scriptFile.Plus(baseData.clearData);
      addStringInfo = sessionInfo2.debug && stringInfo;
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
  const baseModelData = await AddDebugInfo(false, pageName, FullPath2, SmallPath);
  let modelData = ParseBasePage.rebuildBaseInheritance(baseModelData.allData);
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
async function compileFile(filePath, arrayType, isDebug, hasSessionInfo, nestedPage, nestedPageData) {
  const FullFilePath = path18.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + ".cjs";
  const html2 = await EasyFs_default.readFile(FullFilePath, "utf8");
  const ExcluUrl = (nestedPage ? nestedPage + "<line>" : "") + arrayType[2] + "/" + filePath;
  const sessionInfo2 = hasSessionInfo ?? new SessionBuild(arrayType[2] + "/" + filePath, FullFilePath, arrayType[2], isDebug, GetPlugin("SafeDebug"));
  await sessionInfo2.dependence("thisPage", FullFilePath);
  await perCompilePage(sessionInfo2, FullPathCompile);
  const CompiledData = await Insert(html2, FullPathCompile, Boolean(nestedPage), nestedPageData, sessionInfo2);
  await postCompilePage(sessionInfo2, FullPathCompile);
  if (!nestedPage) {
    await EasyFs_default.writeFile(FullPathCompile, CompiledData.StringWithTack(FullPathCompile));
    pageDeps.update(RemoveEndType(ExcluUrl), sessionInfo2.dependencies);
  }
  return { CompiledData, sessionInfo: sessionInfo2 };
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
  for (const path22 of scripts) {
    await LoadImport("Production Loader", path22, getTypes.Static, false);
  }
}
async function CreateCompile(t, state) {
  const types = getTypes[t];
  await DeleteInDirectory(types[1]);
  return () => FilesInFolder2(types, "", state);
}
async function FastCompileInFile(path22, arrayType, sessionInfo2, nestedPage, nestedPageData) {
  await EasyFs_default.makePathReal(path22, arrayType[1]);
  return await compileFile(path22, arrayType, true, sessionInfo2, nestedPage, nestedPageData);
}
async function FastCompile(path22, arrayType) {
  await FastCompileInFile(path22, arrayType);
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
  const ForSavePath = typeArray[2] + "/" + filePath.substring(0, filePath.length - extname2.length - 1);
  const reBuild = DataObject.isDebug && (!await EasyFs_default.existsFile(typeArray[1] + filePath + ".cjs") || await CheckDependencyChange(ForSavePath));
  if (reBuild)
    await FastCompile(filePath, typeArray);
  if (Export2.PageLoadRam[ForSavePath] && !reBuild) {
    LastRequire[copyPath] = { model: Export2.PageLoadRam[ForSavePath][0] };
    return await LastRequire[copyPath].model(DataObject);
  }
  const func = await LoadPage(ForSavePath, extname2);
  if (Export2.PageRam) {
    if (!Export2.PageLoadRam[ForSavePath]) {
      Export2.PageLoadRam[ForSavePath] = [];
    }
    Export2.PageLoadRam[ForSavePath][0] = func;
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
var { Export: Export3 } = FunctionScript_exports;
var Settings4 = {
  CacheDays: 1,
  PageRam: false,
  DevMode: true,
  ErrorPages: {}
};
async function LoadPageToRam(url) {
  if (await EasyFs_default.existsFile(getFullPathCompile(url))) {
    Export3.PageLoadRam[url] = [];
    Export3.PageLoadRam[url][0] = await LoadPage(url);
    Export3.PageLoadRam[url][1] = BuildPage(Export3.PageLoadRam[url][0], url);
  }
}
async function LoadAllPagesToRam() {
  for (const i in pageDeps.store) {
    if (!ExtensionInArray(i, BasicSettings.ReqFileTypesArray))
      await LoadPageToRam(i);
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
    Export3.PageLoadRam[smallPath2] = pageArray;
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
    } else if (Export3.PageLoadRam[smallPath2]) {
      if (!Export3.PageLoadRam[smallPath2][1]) {
        DynamicFunc = BuildPage(Export3.PageLoadRam[smallPath2][0], smallPath2);
        if (Settings4.PageRam)
          Export3.PageLoadRam[smallPath2][1] = DynamicFunc;
      } else
        DynamicFunc = Export3.PageLoadRam[smallPath2][1];
    } else
      DynamicFunc = await BuildLoadPage(smallPath2);
  } else if (Export3.PageLoadRam[smallPath2])
    DynamicFunc = Export3.PageLoadRam[smallPath2][1];
  else if (!Settings4.PageRam && await SetNewURL() && fullPageUrl)
    DynamicFunc = await BuildLoadPage(smallPath2);
  else {
    code = Settings4.ErrorPages.notFound?.code ?? 404;
    const ErrorPage = Settings4.ErrorPages.notFound && Export3.PageLoadRam[getTypes.Static[2] + "/" + Settings4.ErrorPages.notFound.path] || Export3.PageLoadRam[getTypes.Logs[2] + "/e404"];
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
var AsyncImport = (path22, importFrom = "async import") => LoadImport(importFrom, path22, getTypes.Static, Export.development);
var src_default = StartServer;
export {
  AsyncImport,
  SearchRecord,
  Export as Settings,
  src_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2pzb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vd2FzbS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1Nlc3Npb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2Vycm9yLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL21hcmtkb3duLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2hlYWQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZS50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvSW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvSW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N0eWxlLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9Db21waWxlU3RhdGUudHMiLCAiLi4vc3JjL01haW5CdWlsZC9JbXBvcnRNb2R1bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TaXRlTWFwLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRmlsZVR5cGVzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9JbXBvcnRGaWxlUnVudGltZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0FwaUNhbGwudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9HZXRQYWdlcy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvTGlzdGVuR3JlZW5Mb2NrLnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwIGFzIFRpbnlBcHAgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9UeXBlcyc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3MsIHJlcXVpcmVTZXR0aW5ncywgYnVpbGRGaXJzdExvYWQsIHBhZ2VJblJhbUFjdGl2YXRlRnVuY30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgZm9ybWlkYWJsZSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCB7IFVwZGF0ZUdyZWVuTG9jayB9IGZyb20gJy4vTGlzdGVuR3JlZW5Mb2NrJztcblxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBjaGFuZ2VVUkxSdWxlcyhyZXEsIHJlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYW5nZVVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGxldCB1cmwgPSBmaWxlQnlVcmwudXJsRml4KHJlcS5wYXRoKTtcblxuICAgIFxuICAgIGZvciAobGV0IGkgb2YgU2V0dGluZ3Mucm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSkge1xuICAgICAgICAgICAgaWYgKGkuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgICAgIGkgPSBpLnN1YnN0cmluZygwLCBpLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgUnVsZUluZGV4ID0gT2JqZWN0LmtleXMoU2V0dGluZ3Mucm91dGluZy5ydWxlcykuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKTtcblxuICAgIGlmIChSdWxlSW5kZXgpIHtcbiAgICAgICAgdXJsID0gYXdhaXQgU2V0dGluZ3Mucm91dGluZy5ydWxlc1tSdWxlSW5kZXhdKHVybCwgcmVxLCByZXMpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIHVybCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbGVyVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCB1cmw6IHN0cmluZykge1xuICAgIGxldCBub3RWYWxpZDogYW55ID0gU2V0dGluZ3Mucm91dGluZy5pZ25vcmVQYXRocy5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpIHx8IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChpID0+IHVybC5lbmRzV2l0aCgnLicraSkpO1xuICAgIFxuICAgIGlmKCFub3RWYWxpZCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsaWQgb2YgU2V0dGluZ3Mucm91dGluZy52YWxpZFBhdGgpeyAvLyBjaGVjayBpZiB1cmwgaXNuJ3QgdmFsaWRcbiAgICAgICAgICAgIGlmKCFhd2FpdCB2YWxpZCh1cmwsIHJlcSwgcmVzKSl7XG4gICAgICAgICAgICAgICAgbm90VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vdFZhbGlkKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IGZpbGVCeVVybC5HZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgdXJsLnN1YnN0cmluZygxKSk7XG59XG5cbmxldCBhcHBPbmxpbmVcblxuLyoqXG4gKiBJdCBzdGFydHMgdGhlIHNlcnZlciBhbmQgdGhlbiBjYWxscyBTdGFydExpc3RpbmdcbiAqIEBwYXJhbSBbU2VydmVyXSAtIFRoZSBzZXJ2ZXIgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIGluIGJ5IHRoZSBjYWxsZXIuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0QXBwKFNlcnZlcj8pIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgVGlueUFwcCgpO1xuICAgIGlmICghU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgYXBwLnVzZSg8YW55PmNvbXByZXNzaW9uKCkpO1xuICAgIH1cbiAgICBmaWxlQnlVcmwuU2V0dGluZ3MuU2Vzc2lvblN0b3JlID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiBTZXR0aW5ncy5taWRkbGV3YXJlLnNlc3Npb24ocmVxLCByZXMsIG5leHQpO1xuXG4gICAgY29uc3QgT3Blbkxpc3RpbmcgPSBhd2FpdCBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpO1xuXG4gICAgZm9yIChjb25zdCBmdW5jIG9mIFNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIGF3YWl0IGZ1bmMoYXBwLCBhcHBPbmxpbmUuc2VydmVyLCBTZXR0aW5ncyk7XG4gICAgfVxuICAgIGF3YWl0IHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpPy4oKVxuXG4gICAgYXBwLmFsbChcIipcIiwgUGFyc2VSZXF1ZXN0KTtcblxuICAgIGF3YWl0IE9wZW5MaXN0aW5nKFNldHRpbmdzLnNlcnZlLnBvcnQpO1xuXG4gICAgY29uc29sZS5sb2coXCJBcHAgbGlzdGluZyBhdCBwb3J0OiBcIiArIFNldHRpbmdzLnNlcnZlLnBvcnQpO1xufVxuXG4vKipcbiAqIElmIHRoZSByZXF1ZXN0IGlzIGEgUE9TVCByZXF1ZXN0LCB0aGVuIHBhcnNlIHRoZSByZXF1ZXN0IGJvZHksIHRoZW4gc2VuZCBpdCB0byByb3V0aW5nIHNldHRpbmdzXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcSAtIFRoZSBpbmNvbWluZyByZXF1ZXN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC0gUmVzcG9uc2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gUGFyc2VSZXF1ZXN0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChyZXEubWV0aG9kID09ICdQT1NUJykge1xuICAgICAgICBpZiAocmVxLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddPy5zdGFydHNXaXRoPy4oJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICAgICAgU2V0dGluZ3MubWlkZGxld2FyZS5ib2R5UGFyc2VyKHJlcSwgcmVzLCAoKSA9PiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybShTZXR0aW5ncy5taWRkbGV3YXJlLmZvcm1pZGFibGUpLnBhcnNlKHJlcSwgKGVyciwgZmllbGRzLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVxLmZpZWxkcyA9IGZpZWxkcztcbiAgICAgICAgICAgICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKSB7XG4gICAgaWYgKGFwcE9ubGluZSAmJiBhcHBPbmxpbmUuY2xvc2UpIHtcbiAgICAgICAgYXdhaXQgYXBwT25saW5lLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZXJ2ZXIsIGxpc3RlbiwgY2xvc2UgfSA9IGF3YWl0IFNlcnZlcihhcHApO1xuXG4gICAgYXBwT25saW5lID0geyBzZXJ2ZXIsIGNsb3NlIH07XG5cbiAgICByZXR1cm4gbGlzdGVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTdGFydFNlcnZlcih7IFNpdGVQYXRoID0gJy4vJywgSHR0cFNlcnZlciA9IFVwZGF0ZUdyZWVuTG9jayB9ID0ge30pIHtcbiAgICBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgPSBTaXRlUGF0aDtcbiAgICBidWlsZEZpcnN0TG9hZCgpO1xuICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIFN0YXJ0QXBwKEh0dHBTZXJ2ZXIpO1xufVxuXG5leHBvcnQgeyBTZXR0aW5ncyB9OyIsICJpbXBvcnQgZnMsIHtEaXJlbnQsIFN0YXRzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4vQ29uc29sZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgcmVzKEJvb2xlYW4oc3RhdCkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7cGF0aCBvZiB0aGUgZmlsZX0gcGF0aCBcbiAqIEBwYXJhbSB7ZmlsZWQgdG8gZ2V0IGZyb20gdGhlIHN0YXQgb2JqZWN0fSBmaWxlZCBcbiAqIEByZXR1cm5zIHRoZSBmaWxlZFxuICovXG5mdW5jdGlvbiBzdGF0KHBhdGg6IHN0cmluZywgZmlsZWQ/OiBzdHJpbmcsIGlnbm9yZUVycm9yPzogYm9vbGVhbiwgZGVmYXVsdFZhbHVlOmFueSA9IHt9KTogUHJvbWlzZTxTdGF0cyB8IGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyICYmICFpZ25vcmVFcnJvcil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlZCAmJiBzdGF0PyBzdGF0W2ZpbGVkXTogc3RhdCB8fCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgZmlsZSBleGlzdHMsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHthbnl9IFtpZlRydWVSZXR1cm49dHJ1ZV0gLSBhbnkgPSB0cnVlXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4aXN0c0ZpbGUocGF0aDogc3RyaW5nLCBpZlRydWVSZXR1cm46IGFueSA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiAoYXdhaXQgc3RhdChwYXRoLCB1bmRlZmluZWQsIHRydWUpKS5pc0ZpbGU/LigpICYmIGlmVHJ1ZVJldHVybjtcbn1cblxuLyoqXG4gKiBJdCBjcmVhdGVzIGEgZGlyZWN0b3J5LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gbWtkaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMubWtkaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgcm1kaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB0byBiZSByZW1vdmVkLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBybWRpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ybWRpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB1bmxpbmtgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gZGVsZXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB1bmxpbmsocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMudW5saW5rKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZXhpc3RzLCBkZWxldGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgb3IgZGlyZWN0b3J5IHRvIGJlIHVubGlua2VkLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bmxpbmtJZkV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKGF3YWl0IGV4aXN0cyhwYXRoKSl7XG4gICAgICAgIHJldHVybiBhd2FpdCB1bmxpbmsocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZGRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9ucyBvYmplY3QsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzXG4gKiB0byBhbiBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBvcHRpb25zIC0ge1xuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gcmVhZGRpcihwYXRoOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nW10gfCBCdWZmZXJbXSB8IERpcmVudFtdPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZGRpcihwYXRoLCBvcHRpb25zLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVzIHx8IFtdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRpcmVjdG9yeSB3YXMgY3JlYXRlZCBvciBub3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1rZGlySWZOb3RFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZighYXdhaXQgZXhpc3RzKHBhdGgpKVxuICAgICAgICByZXR1cm4gYXdhaXQgbWtkaXIocGF0aCk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFdyaXRlIGEgZmlsZSB0byB0aGUgZmlsZSBzeXN0ZW1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge3N0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXd9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogIHN0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy53cml0ZUZpbGUocGF0aCwgY29udGVudCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgd3JpdGVKc29uRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYSBjb250ZW50IGFuZCB3cml0ZXMgdGhlIGNvbnRlbnQgdG8gdGhlIGZpbGUgYXRcbiAqIHRoZSBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHthbnl9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gd3JpdGVKc29uRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB3cml0ZUZpbGUocGF0aCwgSlNPTi5zdHJpbmdpZnkoY29udGVudCkpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9uYWwgZW5jb2RpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAqIHJlc29sdmVzIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIFtlbmNvZGluZz11dGY4XSAtIFRoZSBlbmNvZGluZyBvZiB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcmVhZEZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nID0gJ3V0ZjgnKTogUHJvbWlzZTxzdHJpbmd8YW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZEZpbGUocGF0aCwgPGFueT5lbmNvZGluZywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGRhdGEgfHwgXCJcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEl0IHJlYWRzIGEgSlNPTiBmaWxlIGFuZCByZXR1cm5zIHRoZSBwYXJzZWQgSlNPTiBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2VuY29kaW5nXSAtIFRoZSBlbmNvZGluZyB0byB1c2Ugd2hlbiByZWFkaW5nIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0LlxuICovXG5hc3luYyBmdW5jdGlvbiByZWFkSnNvbkZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nPzpzdHJpbmcpOiBQcm9taXNlPGFueT57XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcmVhZEZpbGUocGF0aCwgZW5jb2RpbmcpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHAgLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IG5lZWRzIHRvIGJlIGNyZWF0ZWQuXG4gKiBAcGFyYW0gW2Jhc2VdIC0gVGhlIGJhc2UgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZVBhdGhSZWFsKHA6c3RyaW5nLCBiYXNlID0gJycpIHtcbiAgICBwID0gcGF0aC5kaXJuYW1lKHApO1xuXG4gICAgaWYgKCFhd2FpdCBleGlzdHMoYmFzZSArIHApKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHAuc3BsaXQoL1xcXFx8XFwvLyk7XG5cbiAgICAgICAgbGV0IHBTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgaWYgKHBTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcFN0cmluZyArPSAnLyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwU3RyaW5nICs9IGk7XG5cbiAgICAgICAgICAgIGF3YWl0IG1rZGlySWZOb3RFeGlzdHMoYmFzZSArIHBTdHJpbmcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vL3R5cGVzXG5leHBvcnQge1xuICAgIERpcmVudFxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLi4uZnMucHJvbWlzZXMsXG4gICAgZXhpc3RzLFxuICAgIGV4aXN0c0ZpbGUsXG4gICAgc3RhdCxcbiAgICBta2RpcixcbiAgICBta2RpcklmTm90RXhpc3RzLFxuICAgIHdyaXRlRmlsZSxcbiAgICB3cml0ZUpzb25GaWxlLFxuICAgIHJlYWRGaWxlLFxuICAgIHJlYWRKc29uRmlsZSxcbiAgICBybWRpcixcbiAgICB1bmxpbmssXG4gICAgdW5saW5rSWZFeGlzdHMsXG4gICAgcmVhZGRpcixcbiAgICBtYWtlUGF0aFJlYWxcbn0iLCAibGV0IHByaW50TW9kZSA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd1ByaW50KGQ6IGJvb2xlYW4pIHtcbiAgICBwcmludE1vZGUgPSBkO1xufVxuXG5leHBvcnQgY29uc3QgcHJpbnQgPSBuZXcgUHJveHkoY29uc29sZSx7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYocHJpbnRNb2RlICYmIHByb3AgIT0gXCJkby1ub3RoaW5nXCIpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICB9XG59KTsiLCAiaW1wb3J0IHtEaXJlbnR9IGZyb20gJ2ZzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7Y3dkfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tICd1cmwnXG5pbXBvcnQgeyBDdXRUaGVMYXN0ICwgU3BsaXRGaXJzdH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuXG5mdW5jdGlvbiBnZXREaXJuYW1lKHVybDogc3RyaW5nKXtcbiAgICByZXR1cm4gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgodXJsKSk7XG59XG5cbmNvbnN0IFN5c3RlbURhdGEgPSBwYXRoLmpvaW4oZ2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpLCAnL1N5c3RlbURhdGEnKTtcblxubGV0IFdlYlNpdGVGb2xkZXJfID0gXCJXZWJTaXRlXCI7XG5cbmNvbnN0IFN0YXRpY05hbWUgPSAnV1dXJywgTG9nc05hbWUgPSAnTG9ncycsIE1vZHVsZXNOYW1lID0gJ25vZGVfbW9kdWxlcyc7XG5cbmNvbnN0IFN0YXRpY0NvbXBpbGUgPSBTeXN0ZW1EYXRhICsgYC8ke1N0YXRpY05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZUxvZ3MgPSBTeXN0ZW1EYXRhICsgYC8ke0xvZ3NOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVNb2R1bGUgPSBTeXN0ZW1EYXRhICsgYC8ke01vZHVsZXNOYW1lfUNvbXBpbGUvYDtcblxuY29uc3Qgd29ya2luZ0RpcmVjdG9yeSA9IGN3ZCgpICsgJy8nO1xuXG5mdW5jdGlvbiBHZXRGdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LFdlYlNpdGVGb2xkZXJfLCAnLycpO1xufVxubGV0IGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcblxuZnVuY3Rpb24gR2V0U291cmNlKG5hbWUpIHtcbiAgICByZXR1cm4gIEdldEZ1bGxXZWJTaXRlUGF0aCgpICsgbmFtZSArICcvJ1xufVxuXG4vKiBBIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgcGF0aHMgb2YgdGhlIGZpbGVzIGluIHRoZSBwcm9qZWN0LiAqL1xuY29uc3QgZ2V0VHlwZXMgPSB7XG4gICAgU3RhdGljOiBbXG4gICAgICAgIEdldFNvdXJjZShTdGF0aWNOYW1lKSxcbiAgICAgICAgU3RhdGljQ29tcGlsZSxcbiAgICAgICAgU3RhdGljTmFtZVxuICAgIF0sXG4gICAgTG9nczogW1xuICAgICAgICBHZXRTb3VyY2UoTG9nc05hbWUpLFxuICAgICAgICBDb21waWxlTG9ncyxcbiAgICAgICAgTG9nc05hbWVcbiAgICBdLFxuICAgIG5vZGVfbW9kdWxlczogW1xuICAgICAgICBHZXRTb3VyY2UoJ25vZGVfbW9kdWxlcycpLFxuICAgICAgICBDb21waWxlTW9kdWxlLFxuICAgICAgICBNb2R1bGVzTmFtZVxuICAgIF0sXG4gICAgZ2V0IFtTdGF0aWNOYW1lXSgpe1xuICAgICAgICByZXR1cm4gZ2V0VHlwZXMuU3RhdGljO1xuICAgIH1cbn1cblxuY29uc3QgcGFnZVR5cGVzID0ge1xuICAgIHBhZ2U6IFwicGFnZVwiLFxuICAgIG1vZGVsOiBcIm1vZGVcIixcbiAgICBjb21wb25lbnQ6IFwiaW50ZVwiXG59XG5cblxuY29uc3QgQmFzaWNTZXR0aW5ncyA9IHtcbiAgICBwYWdlVHlwZXMsXG5cbiAgICBwYWdlVHlwZXNBcnJheTogW10sXG5cbiAgICBwYWdlQ29kZUZpbGU6IHtcbiAgICAgICAgcGFnZTogW3BhZ2VUeXBlcy5wYWdlK1wiLmpzXCIsIHBhZ2VUeXBlcy5wYWdlK1wiLnRzXCJdLFxuICAgICAgICBtb2RlbDogW3BhZ2VUeXBlcy5tb2RlbCtcIi5qc1wiLCBwYWdlVHlwZXMubW9kZWwrXCIudHNcIl0sXG4gICAgICAgIGNvbXBvbmVudDogW3BhZ2VUeXBlcy5jb21wb25lbnQrXCIuanNcIiwgcGFnZVR5cGVzLmNvbXBvbmVudCtcIi50c1wiXVxuICAgIH0sXG5cbiAgICBwYWdlQ29kZUZpbGVBcnJheTogW10sXG5cbiAgICBwYXJ0RXh0ZW5zaW9uczogWydzZXJ2JywgJ2FwaSddLFxuXG4gICAgUmVxRmlsZVR5cGVzOiB7XG4gICAgICAgIGpzOiBcInNlcnYuanNcIixcbiAgICAgICAgdHM6IFwic2Vydi50c1wiLFxuICAgICAgICAnYXBpLXRzJzogXCJhcGkuanNcIixcbiAgICAgICAgJ2FwaS1qcyc6IFwiYXBpLnRzXCJcbiAgICB9LFxuICAgIFJlcUZpbGVUeXBlc0FycmF5OiBbXSxcblxuICAgIGdldCBXZWJTaXRlRm9sZGVyKCkge1xuICAgICAgICByZXR1cm4gV2ViU2l0ZUZvbGRlcl87XG4gICAgfSxcbiAgICBnZXQgZnVsbFdlYlNpdGVQYXRoKCkge1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXztcbiAgICB9LFxuICAgIHNldCBXZWJTaXRlRm9sZGVyKHZhbHVlKSB7XG4gICAgICAgIFdlYlNpdGVGb2xkZXJfID0gdmFsdWU7XG5cbiAgICAgICAgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuICAgICAgICBnZXRUeXBlcy5TdGF0aWNbMF0gPSBHZXRTb3VyY2UoU3RhdGljTmFtZSk7XG4gICAgICAgIGdldFR5cGVzLkxvZ3NbMF0gPSBHZXRTb3VyY2UoTG9nc05hbWUpO1xuICAgIH0sXG4gICAgZ2V0IHRzQ29uZmlnKCl7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfICsgJ3RzY29uZmlnLmpzb24nOyBcbiAgICB9LFxuICAgIGFzeW5jIHRzQ29uZmlnRmlsZSgpIHtcbiAgICAgICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy50c0NvbmZpZykpe1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnRzQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVsYXRpdmUoZnVsbFBhdGg6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKGZ1bGxXZWJTaXRlUGF0aF8sIGZ1bGxQYXRoKVxuICAgIH1cbn1cblxuQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMpO1xuQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGUpLmZsYXQoKTtcbkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERlbGV0ZUluRGlyZWN0b3J5KHBhdGgpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgKDxEaXJlbnRbXT5hbGxJbkZvbGRlcikpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZTtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gcGF0aCArIG4gKyAnLyc7XG4gICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShkaXIpO1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnJtZGlyKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rKHBhdGggKyBuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIEN1dFRoZUxhc3QoJy4nLCBTcGxpdEZpcnN0KCcvJywgc21hbGxQYXRoKS5wb3AoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlQnlTbWFsbFBhdGgoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBnZXRUeXBlc1tTcGxpdEZpcnN0KCcvJywgc21hbGxQYXRoKS5zaGlmdCgpXTtcbn1cblxuXG5cbmV4cG9ydCB7XG4gICAgZ2V0RGlybmFtZSxcbiAgICBTeXN0ZW1EYXRhLFxuICAgIHdvcmtpbmdEaXJlY3RvcnksXG4gICAgZ2V0VHlwZXMsXG4gICAgQmFzaWNTZXR0aW5nc1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmludGVyZmFjZSBnbG9iYWxTdHJpbmc8VD4ge1xuICAgIGluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgbGFzdEluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgc3RhcnRzV2l0aChzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTcGxpdEZpcnN0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHR5cGU6IHN0cmluZywgc3RyaW5nOiBUKTogVFtdIHtcbiAgICBjb25zdCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHR5cGUpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKVxuICAgICAgICByZXR1cm4gW3N0cmluZ107XG5cbiAgICByZXR1cm4gW3N0cmluZy5zdWJzdHJpbmcoMCwgaW5kZXgpLCBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgdHlwZS5sZW5ndGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1dFRoZUxhc3QodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZih0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRlbnNpb248VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RyaW5nOiBUKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbVR5cGUodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHdoaWxlIChzdHJpbmcuc3RhcnRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyh0eXBlLmxlbmd0aCk7XG5cbiAgICB3aGlsZSAoc3RyaW5nLmVuZHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sZW5ndGggLSB0eXBlLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Vic3RyaW5nU3RhcnQ8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RhcnQ6IHN0cmluZywgc3RyaW5nOiBUKTogVCB7XG4gICAgaWYoc3RyaW5nLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdGFydC5sZW5ndGgpO1xuICAgIHJldHVybiBzdHJpbmc7XG59IiwgImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSwgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi8uLi9KU1BhcnNlcic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBjb25zdCBuZXdDb2RlU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoY29kZS5EZWZhdWx0SW5mb1RleHQpO1xuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyQgYDwlez9kZWJ1Z19maWxlP30ke2kudGV4dH0lPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q29kZVN0cmluZztcbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VTY3JpcHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG5cbiAgICBjb25zdCBuZXdDb2RlU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoY29kZS5EZWZhdWx0SW5mb1RleHQpO1xuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyQgYHJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3Q29kZVN0cmluZztcbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VEZWJ1Z0xpbmUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBpLnRleHQgPSBhd2FpdCBQYXJzZVRleHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpLnRleHQgPSBhd2FpdCBQYXJzZVNjcmlwdENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlci5zdGFydCA9IFwiPCVcIjtcbiAgICBwYXJzZXIuZW5kID0gXCIlPlwiO1xuICAgIHJldHVybiBwYXJzZXIuUmVCdWlsZFRleHQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VEZWJ1Z0luZm8oY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGNvZGUsIHBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQWRkRGVidWdJbmZvKGlzb2xhdGU6IGJvb2xlYW4sIHBhZ2VOYW1lOnN0cmluZywgRnVsbFBhdGg6c3RyaW5nLCBTbWFsbFBhdGg6c3RyaW5nLCBjYWNoZToge3ZhbHVlPzogc3RyaW5nfSA9IHt9KXtcbiAgICBpZighY2FjaGUudmFsdWUpXG4gICAgICAgIGNhY2hlLnZhbHVlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxQYXRoLCAndXRmOCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxsRGF0YTogbmV3IFN0cmluZ1RyYWNrZXIoYCR7cGFnZU5hbWV9PGxpbmU+JHtTbWFsbFBhdGh9YCwgaXNvbGF0ZSA/IGA8JXslPiR7Y2FjaGUudmFsdWV9PCV9JT5gOiBjYWNoZS52YWx1ZSksXG4gICAgICAgIHN0cmluZ0luZm86IGA8JSFcXG5ydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KHBhZ2VOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoKX1cXGA7JT5gXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKGZpbGVQYXRoOiBzdHJpbmcsIGlucHV0UGF0aDogc3RyaW5nLCBmb2xkZXI6c3RyaW5nLCBwYWdlVHlwZTpzdHJpbmcsIHBhdGhUeXBlID0gMCkge1xuICAgIGlmIChwYWdlVHlwZSAmJiAhaW5wdXRQYXRoLmVuZHNXaXRoKCcuJyArIHBhZ2VUeXBlKSkge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtpbnB1dFBhdGh9LiR7cGFnZVR5cGV9YDtcbiAgICB9XG5cbiAgICBpZihpbnB1dFBhdGhbMF0gPT0gJ14nKXsgLy8gbG9hZCBmcm9tIHBhY2thZ2VzXG4gICAgICAgIGNvbnN0IFtwYWNrYWdlTmFtZSwgaW5QYXRoXSA9IFNwbGl0Rmlyc3QoJy8nLCAgaW5wdXRQYXRoLnN1YnN0cmluZygxKSk7XG4gICAgICAgIHJldHVybiAocGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3Rvcnk6ICcnKSArIGBub2RlX21vZHVsZXMvJHtwYWNrYWdlTmFtZX0vJHtmb2xkZXJ9LyR7aW5QYXRofWA7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGlucHV0UGF0aFsxXSA9PSAnLycpIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMik7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aC5kaXJuYW1lKGZpbGVQYXRoKX0vJHtpbnB1dFBhdGh9YDtcbiAgICB9IGVsc2UgaWYgKGlucHV0UGF0aFswXSA9PSAnLycpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7Z2V0VHlwZXMuU3RhdGljW3BhdGhUeXBlXX0ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke3BhdGhUeXBlID09IDAgPyB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgJy8nIDogJyd9JHtmb2xkZXJ9LyR7aW5wdXRQYXRofWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKGlucHV0UGF0aCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGF0aFR5cGVzIHtcbiAgICBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyPzogc3RyaW5nLFxuICAgIFNtYWxsUGF0aD86IHN0cmluZyxcbiAgICBGdWxsUGF0aD86IHN0cmluZyxcbiAgICBGdWxsUGF0aENvbXBpbGU/OiBzdHJpbmdcbn1cblxuZnVuY3Rpb24gQ3JlYXRlRmlsZVBhdGgoZmlsZVBhdGg6c3RyaW5nLCBzbWFsbFBhdGg6c3RyaW5nLCBpbnB1dFBhdGg6c3RyaW5nLCBmb2xkZXI6c3RyaW5nLCBwYWdlVHlwZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgU21hbGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoc21hbGxQYXRoLCBpbnB1dFBhdGgsIGZvbGRlciwgcGFnZVR5cGUsIDIpLFxuICAgICAgICBGdWxsUGF0aDogQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKGZpbGVQYXRoLCBpbnB1dFBhdGgsIGZvbGRlciwgcGFnZVR5cGUpLFxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBQYXJzZURlYnVnTGluZSxcbiAgICBDcmVhdGVGaWxlUGF0aCxcbiAgICBQYXJzZURlYnVnSW5mb1xufTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEdlbmVyYXRvciwgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSAnLi9Tb3VyY2VNYXAnO1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcm90ZWN0ZWQgbWFwOiBTb3VyY2VNYXBHZW5lcmF0b3I7XG4gICAgcHJvdGVjdGVkIGZpbGVEaXJOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIGxpbmVDb3VudCA9IDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZmlsZVBhdGg6IHN0cmluZywgcHJvdGVjdGVkIGh0dHBTb3VyY2UgPSB0cnVlLCBwcm90ZWN0ZWQgcmVsYXRpdmUgPSBmYWxzZSwgcHJvdGVjdGVkIGlzQ3NzID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnBvcCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaHR0cFNvdXJjZSlcbiAgICAgICAgICAgIHRoaXMuZmlsZURpck5hbWUgPSBwYXRoLmRpcm5hbWUodGhpcy5maWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFNvdXJjZShzb3VyY2U6IHN0cmluZykge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2Uuc3BsaXQoJzxsaW5lPicpLnBvcCgpLnRyaW0oKTtcblxuICAgICAgICBpZiAodGhpcy5odHRwU291cmNlKSB7XG4gICAgICAgICAgICBpZiAoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoc291cmNlKS5zdWJzdHJpbmcoMSkpKVxuICAgICAgICAgICAgICAgIHNvdXJjZSArPSAnLnNvdXJjZSc7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gU3BsaXRGaXJzdCgnLycsIHNvdXJjZSkucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAgICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZSgodGhpcy5yZWxhdGl2ZSA/ICcnOiAnLycpICsgc291cmNlLnJlcGxhY2UoL1xcXFwvZ2ksICcvJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodGhpcy5maWxlRGlyTmFtZSwgQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzb3VyY2UpO1xuICAgIH1cblxuICAgIGdldFJvd1NvdXJjZU1hcCgpOiBSYXdTb3VyY2VNYXB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC50b0pTT04oKVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRvVVJMQ29tbWVudCh0aGlzLm1hcCwgdGhpcy5pc0Nzcyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VNYXBTdG9yZSBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcml2YXRlIHN0b3JlU3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Mb2FkOiB7IG5hbWU6IHN0cmluZywgZGF0YTogYW55W10gfVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgZGVidWcgPSB0cnVlLCBpc0NzcyA9IGZhbHNlLCBodHRwU291cmNlID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgZmFsc2UsIGlzQ3NzKTtcbiAgICB9XG5cbiAgICBub3RFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uTG9hZC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGFkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTdHJpbmdUcmFja2VyJywgZGF0YTogW3RyYWNrLCB7dGV4dH1dIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuXG4gICAgYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkVGV4dCcsIGRhdGE6IFt0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHRoaXMubGluZUNvdW50ICs9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VVJMU291cmNlTWFwKG1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1hcC5zb3VyY2VzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIG1hcC5zb3VyY2VzW2ldID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKG1hcC5zb3VyY2VzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG5cbiAgICBhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbZnJvbU1hcCwgdHJhY2ssIHRleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGZyb21NYXApKS5lYWNoTWFwcGluZygobSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUluZm8gPSB0cmFjay5nZXRMaW5lKG0ub3JpZ2luYWxMaW5lKS5nZXREYXRhQXJyYXkoKVswXTtcblxuICAgICAgICAgICAgaWYgKG0uc291cmNlID09IHRoaXMuZmlsZVBhdGgpXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBkYXRhSW5mby5saW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSArIHRoaXMubGluZUNvdW50LCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2FkZFRleHQodGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBidWlsZEFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGRhdGEgfSBvZiB0aGlzLmFjdGlvbkxvYWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRUZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRleHQoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBBc1VSTENvbW1lbnQoKSB7XG4gICAgICAgIHRoaXMuYnVpbGRBbGwoKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIubWFwQXNVUkxDb21tZW50KClcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVEYXRhV2l0aE1hcCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5idWlsZEFsbCgpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZztcblxuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZyArIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpO1xuICAgIH1cblxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IFNvdXJjZU1hcFN0b3JlKHRoaXMuZmlsZVBhdGgsIHRoaXMuZGVidWcsIHRoaXMuaXNDc3MsIHRoaXMuaHR0cFNvdXJjZSk7XG4gICAgICAgIGNvcHkuYWN0aW9uTG9hZC5wdXNoKC4uLnRoaXMuYWN0aW9uTG9hZClcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3IgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VUkxDb21tZW50KG1hcDogU291cmNlTWFwR2VuZXJhdG9yLCBpc0Nzcz86IGJvb2xlYW4pIHtcbiAgICBsZXQgbWFwU3RyaW5nID0gYHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20obWFwLnRvU3RyaW5nKCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfWA7XG5cbiAgICBpZiAoaXNDc3MpXG4gICAgICAgIG1hcFN0cmluZyA9IGAvKiMgJHttYXBTdHJpbmd9Ki9gXG4gICAgZWxzZVxuICAgICAgICBtYXBTdHJpbmcgPSAnLy8jICcgKyBtYXBTdHJpbmc7XG5cbiAgICByZXR1cm4gJ1xcclxcbicgKyBtYXBTdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBNZXJnZVNvdXJjZU1hcChnZW5lcmF0ZWRNYXA6IFJhd1NvdXJjZU1hcCwgb3JpZ2luYWxNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG9yaWdpbmFsTWFwKTtcbiAgICBjb25zdCBuZXdNYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKCk7XG4gICAgKGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihnZW5lcmF0ZWRNYXApKS5lYWNoTWFwcGluZyhtID0+IHtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBvcmlnaW5hbC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1ufSlcbiAgICAgICAgaWYoIWxvY2F0aW9uLnNvdXJjZSkgcmV0dXJuO1xuICAgICAgICBuZXdNYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uLFxuICAgICAgICAgICAgICAgIGxpbmU6IG0uZ2VuZXJhdGVkTGluZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uOiBsb2NhdGlvbi5jb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbG9jYXRpb24ubGluZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNvdXJjZTogbG9jYXRpb24uc291cmNlXG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3TWFwO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBCYXNpYyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5cbmNsYXNzIGNyZWF0ZVBhZ2VTb3VyY2VNYXAgZXh0ZW5kcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZSA9IGZhbHNlLCByZWxhdGl2ZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgICAgIHRoaXMubGluZUNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBhZGRNYXBwaW5nRnJvbVRyYWNrKHRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IHRleHQsIGxpbmUsIGluZm8gfSA9IERhdGFBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0ID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3YWl0TmV4dExpbmUgJiYgbGluZSAmJiBpbmZvKSB7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UoaW5mbylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0TWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHN0b3JlTWFwLmdldFJvd1NvdXJjZU1hcCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0V2l0aE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHRleHQuZXEgKyBzdG9yZU1hcC5tYXBBc1VSTENvbW1lbnQoKTtcbn0iLCAiaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgb3V0cHV0TWFwLCBvdXRwdXRXaXRoTWFwIH0gZnJvbSBcIi4vU3RyaW5nVHJhY2tlclRvU291cmNlTWFwXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICB0ZXh0Pzogc3RyaW5nLFxuICAgIGluZm86IHN0cmluZyxcbiAgICBsaW5lPzogbnVtYmVyLFxuICAgIGNoYXI/OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFN0cmluZ0luZGV4ZXJJbmZvIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGxlbmd0aDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlNYXRjaCBleHRlbmRzIEFycmF5PFN0cmluZ1RyYWNrZXI+IHtcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBpbnB1dD86IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyaW5nVHJhY2tlciB7XG4gICAgcHJpdmF0ZSBEYXRhQXJyYXk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mb1tdID0gW107XG4gICAgcHVibGljIEluZm9UZXh0OiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBPbkxpbmUgPSAxO1xuICAgIHB1YmxpYyBPbkNoYXIgPSAxO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBJbmZvVGV4dCB0ZXh0IGluZm8gZm9yIGFsbCBuZXcgc3RyaW5nIHRoYXQgYXJlIGNyZWF0ZWQgaW4gdGhpcyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoSW5mbz86IHN0cmluZyB8IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgdGV4dD86IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIEluZm8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvO1xuICAgICAgICB9IGVsc2UgaWYgKEluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdChJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkFkZEZpbGVUZXh0KHRleHQsIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgZ2V0IGVtcHR5SW5mbygpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldERlZmF1bHQoSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0KSB7XG4gICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvLmluZm87XG4gICAgICAgIHRoaXMuT25MaW5lID0gSW5mby5saW5lO1xuICAgICAgICB0aGlzLk9uQ2hhciA9IEluZm8uY2hhcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGF0YUFycmF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGxhc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IERlZmF1bHRJbmZvVGV4dCgpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICBpZiAoIXRoaXMuRGF0YUFycmF5LmZpbmQoeCA9PiB4LmluZm8pICYmIHRoaXMuSW5mb1RleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiB0aGlzLkluZm9UZXh0LFxuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuT25MaW5lLFxuICAgICAgICAgICAgICAgIGNoYXI6IHRoaXMuT25DaGFyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbdGhpcy5EYXRhQXJyYXkubGVuZ3RoIC0gMV0gPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGZpcnN0IEluZm9UZXh0XG4gICAgICovXG4gICAgZ2V0IFN0YXJ0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5WzBdID8/IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgYXMgb25lIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0IE9uZVN0cmluZygpIHtcbiAgICAgICAgbGV0IGJpZ1N0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGJpZ1N0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmlnU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgc28geW91IGNhbiBjaGVjayBpZiBpdCBlcXVhbCBvciBub3RcbiAgICAgKiB1c2UgbGlrZSB0aGF0OiBteVN0cmluZy5lcSA9PSBcImNvb2xcIlxuICAgICAqL1xuICAgIGdldCBlcSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgaW5mbyBhYm91dCB0aGlzIHRleHRcbiAgICAgKi9cbiAgICBnZXQgbGluZUluZm8oKSB7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgY29uc3QgcyA9IGQuaW5mby5zcGxpdCgnPGxpbmU+Jyk7XG4gICAgICAgIHMucHVzaChCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHMucG9wKCkpO1xuXG4gICAgICAgIHJldHVybiBgJHtzLmpvaW4oJzxsaW5lPicpfToke2QubGluZX06JHtkLmNoYXJ9YDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGxlbmd0aCBvZiB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIGNvcHkgb2YgdGhpcyBzdHJpbmcgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIENsb25lKCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld0RhdGEuQWRkVGV4dEFmdGVyKGkudGV4dCwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBZGRDbG9uZShkYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goLi4uZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLkRhdGFBcnJheS51bnNoaWZ0KC4uLmNvcHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgVGV4dCBGaWxlIFRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRGaWxlVGV4dCh0ZXh0OiBzdHJpbmcsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKSB7XG4gICAgICAgIGxldCBMaW5lQ291bnQgPSAxLCBDaGFyQ291bnQgPSAxO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzaW1wbGUgbWV0aG9mIHRvIGN1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBuZXcgY3V0dGVkIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQ3V0U3RyaW5nKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuXG4gICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucHVzaCguLi50aGlzLkRhdGFBcnJheS5zbGljZShzdGFydCwgZW5kKSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG5cbiAgICAgICAgd2hpbGUgKChsaW1pdCA9PSBudWxsIHx8IGNvdW50ZXIgPCBsaW1pdCkgJiYgaGFzTWF0aD8uWzBdPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IFsuLi5oYXNNYXRoWzBdXS5sZW5ndGgsIGluZGV4ID0gdGhpcy5jaGFyTGVuZ3RoKGhhc01hdGguaW5kZXgpO1xuICAgICAgICAgICAgYWxsU3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4ICsgYWRkTmV4dCxcbiAgICAgICAgICAgICAgICBsZW5ndGhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYWluVGV4dCA9IG1haW5UZXh0LnNsaWNlKGhhc01hdGguaW5kZXggKyBoYXNNYXRoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGpvaW4oYXJyOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBsZXQgYWxsID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgYXJyKXtcbiAgICAgICAgICAgIGFsbC5BZGRDbG9uZShpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXBsYWNlckFzeW5jKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhhd2FpdCBmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBsZXQgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZShsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEpLCBjb2x1bW4gPSBjb2wgPz8gbG9jYXRpb24/LmNvbHVtbiA/PyAwO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKChsaW5lID8/IGxvY2F0aW9uPy5saW5lKSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gc2VhcmNoTGluZS5hdChjb2x1bW4tMSkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICByZXR1cm4gYCR7dGV4dCB8fCBtZXNzYWdlfSwgb24gZmlsZSAtPlxcbiR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrc2VhcmNoTGluZS5leHRyYWN0SW5mbygpfToke2RhdGEubGluZX06JHtkYXRhLmNoYXJ9JHtsb2NhdGlvbj8ubGluZVRleHQgPyAnXFxuTGluZTogXCInICsgbG9jYXRpb24ubGluZVRleHQudHJpbSgpICsgJ1wiJzogJyd9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nV2l0aFRhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dFdpdGhNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbilcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgICAgICByZXR1cm4gb3V0cHV0TWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24sIGh0dHBTb3VyY2UsIHJlbGF0aXZlKVxuICAgIH1cbn0iLCAiaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5jb25zdCBsb2FkUGF0aCA9IHR5cGVvZiBlc2J1aWxkICE9PSAndW5kZWZpbmVkJyA/ICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50Lyc6ICcvLi4vJztcbmNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsICsgbG9hZFBhdGggKyAnYnVpbGQud2FzbScpKSk7XG5jb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuY29uc3Qgd2FzbSA9IHdhc21JbnN0YW5jZS5leHBvcnRzO1xuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbSh0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuLyoqXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9lcnJvcnMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHdhc20uZ2V0X2Vycm9ycyhyZXRwdHIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGJsb2NrXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX2Jsb2NrKHRleHQsIGJsb2NrKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChibG9jaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX2Jsb2NrKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tpcF9zcGVjaWFsX3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gc2ltcGxlX3NraXBcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2NvbXBvbmVudChza2lwX3NwZWNpYWxfdGFnLCBzaW1wbGVfc2tpcCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2tpcF9zcGVjaWFsX3RhZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2ltcGxlX3NraXAsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB3YXNtLmluc2VydF9jb21wb25lbnQocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfZGVmKHRleHQsIGVuZF90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmRfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX2RlZihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHFfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9xKHRleHQsIHFfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX3EocHRyMCwgbGVuMCwgcV90eXBlLmNvZGVQb2ludEF0KDApKTtcbiAgICByZXR1cm4gcmV0ID4+PiAwO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2VqcyhyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzX21pbih0ZXh0LCBuYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2Vqc19taW4ocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzdGFydFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGVqc19wYXJzZSh0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGFydCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjIgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjIgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uZWpzX3BhcnNlKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMiwgbGVuMik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbiIsICJleHBvcnQgY29uc3QgU2ltcGxlU2tpcCA9IFsndGV4dGFyZWEnLCdzY3JpcHQnLCAnc3R5bGUnXTtcbmV4cG9ydCBjb25zdCBTa2lwU3BlY2lhbFRhZyA9IFtbXCIlXCIsIFwiJVwiXSwgW1wiI3tkZWJ1Z31cIiwgXCJ7ZGVidWd9I1wiXV07IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IGZpbmRfZW5kX29mX2RlZiwgZmluZF9lbmRfb2ZfcSwgZmluZF9lbmRfYmxvY2sgfSBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzJztcbmltcG9ydCB7IGdldERpcm5hbWUsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgd29ya2VyUG9vbCBmcm9tICd3b3JrZXJwb29sJztcbmltcG9ydCB7IGNwdXMgfSBmcm9tICdvcyc7XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmNvbnN0IHBvb2wgPSB3b3JrZXJQb29sLnBvb2woU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50L3dvcmtlckluc2VydENvbXBvbmVudC5qcycsIHsgbWF4V29ya2VyczogY3B1TGVuZ3RoIH0pO1xuXG5leHBvcnQgY2xhc3MgQmFzZVJlYWRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZW5kIG9mIHF1b3RhdGlvbiBtYXJrcywgc2tpcHBpbmcgdGhpbmdzIGxpa2UgZXNjYXBpbmc6IFwiXFxcXFwiXCJcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVudE9mUSh0ZXh0OiBzdHJpbmcsIHFUeXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShFbmRUeXBlKSkge1xuICAgICAgICAgICAgRW5kVHlwZSA9IFtFbmRUeXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgSlNPTi5zdHJpbmdpZnkoRW5kVHlwZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhbWUgYXMgJ2ZpbmRFbmRPZkRlZicgb25seSB3aXRoIG9wdGlvbiB0byBjdXN0b20gJ29wZW4nIGFuZCAnY2xvc2UnXG4gICAgICogYGBganNcbiAgICAgKiBGaW5kRW5kT2ZCbG9jayhgY29vbCBcIn1cIiB7IGRhdGEgfSB9IG5leHRgLCAneycsICd9JylcbiAgICAgKiBgYGBcbiAgICAgKiBpdCB3aWxsIHJldHVybiB0aGUgMTggLT4gXCJ9IG5leHRcIlxuICAgICAqICBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgRmluZEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCBvcGVuOiBzdHJpbmcsIGVuZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX2Jsb2NrKHRleHQsIG9wZW4gKyBlbmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIFNpbXBsZVNraXA6IHN0cmluZ1tdID0gU2V0dGluZ3MuU2ltcGxlU2tpcDtcbiAgICBTa2lwU3BlY2lhbFRhZzogc3RyaW5nW11bXSA9IFNldHRpbmdzLlNraXBTcGVjaWFsVGFnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmludE5ldz86IGFueSkgeyB9XG5cbiAgICBwcml2YXRlIHByaW50RXJyb3JzKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGVycm9yczogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmludE5ldykgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBKU09OLnBhcnNlKGVycm9ycykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50TmV3KHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke2kudHlwZV9uYW1lfVwiLCB1c2VkIGluOiAke3RleHQuYXQoTnVtYmVyKGkuaW5kZXgpKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFyKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhcicsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhckhUTUwodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFySFRNTCcsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG59XG5cbnR5cGUgUGFyc2VCbG9ja3MgPSB7IG5hbWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfVtdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTKHRleHQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlMnLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlNNaW5pKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXJbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKU01pbmknLCBbdGV4dCxmaW5kXSkpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFSlNQYXJzZXIodGV4dDogc3RyaW5nLCBzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ0VKU1BhcnNlcicsIFt0ZXh0LCBzdGFydCwgZW5kXSkpO1xufSIsICJcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cbmludGVyZmFjZSBTcGxpdFRleHQge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICB0eXBlX25hbWU6IHN0cmluZyxcbiAgICBpc19za2lwOiBib29sZWFuXG59XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmNvbnN0IHBhcnNlX3N0cmVhbSA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9yZWFkZXIvd29ya2VyLmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQYXJzZVRleHRTdHJlYW0odGV4dDogc3RyaW5nKTogUHJvbWlzZTxTcGxpdFRleHRbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdidWlsZF9zdHJlYW0nLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mRGVmU2tpcEJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2ZpbmRfZW5kX29mX2RlZl9za2lwX2Jsb2NrJywgW3RleHQsIEpTT04uc3RyaW5naWZ5KHR5cGVzKV0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdlbmRfb2ZfYmxvY2snLCBbdGV4dCwgdHlwZXMuam9pbignJyldKTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgQmFzZUVudGl0eUNvZGUge1xuICAgIFJlcGxhY2VBbGwodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZykge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0ZXh0LnNwbGl0KGZpbmQpKSB7XG4gICAgICAgICAgICBuZXdUZXh0ICs9IHJlcGxhY2UgKyBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQuc3Vic3RyaW5nKHJlcGxhY2UubGVuZ3RoKTtcbiAgICB9XG59XG5cblxuYWJzdHJhY3QgY2xhc3MgUmVCdWlsZENvZGVCYXNpYyBleHRlbmRzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBwdWJsaWMgUGFyc2VBcnJheTogU3BsaXRUZXh0W107XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLlBhcnNlQXJyYXkgPSBQYXJzZUFycmF5O1xuICAgIH1cblxuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgbGV0IE91dFN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgT3V0U3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLlJlcGxhY2VBbGwoT3V0U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cblxuXG50eXBlIERhdGFDb2RlSW5mbyA9IHtcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgaW5wdXRzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgY2xhc3MgUmVCdWlsZENvZGVTdHJpbmcgZXh0ZW5kcyBSZUJ1aWxkQ29kZUJhc2ljIHtcbiAgICBwcml2YXRlIERhdGFDb2RlOiBEYXRhQ29kZUluZm87XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcihQYXJzZUFycmF5KTtcbiAgICAgICAgdGhpcy5EYXRhQ29kZSA9IHsgdGV4dDogXCJcIiwgaW5wdXRzOiBbXSB9O1xuICAgICAgICB0aGlzLkNyZWF0ZURhdGFDb2RlKCk7XG4gICAgfVxuXG4gICAgZ2V0IENvZGVCdWlsZFRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLnRleHQ7XG4gICAgfVxuXG4gICAgc2V0IENvZGVCdWlsZFRleHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IEFsbElucHV0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ3JlYXRlRGF0YUNvZGUoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChpLmlzX3NraXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gYDx8JHt0aGlzLkRhdGFDb2RlLmlucHV0cy5sZW5ndGh9fCR7aS50eXBlX25hbWUgPz8gJyd9fD5gO1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUuaW5wdXRzLnB1c2goaS50ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlmIHRoZSA8fHw+IHN0YXJ0IHdpdGggYSAoKy4pIGxpa2UgdGhhdCBmb3IgZXhhbXBsZSwgXCIrLjx8fD5cIiwgdGhlIHVwZGF0ZSBmdW5jdGlvbiB3aWxsIGdldCB0aGUgbGFzdCBcIlNraXBUZXh0XCIgaW5zdGVhZCBnZXR0aW5nIHRoZSBuZXcgb25lXG4gICAgICogc2FtZSB3aXRoIGEgKC0uKSBqdXN0IGZvciBpZ25vcmluZyBjdXJyZW50IHZhbHVlXG4gICAgICogQHJldHVybnMgdGhlIGJ1aWxkZWQgY29kZVxuICAgICAqL1xuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5EYXRhQ29kZS50ZXh0LnJlcGxhY2UoLzxcXHwoWzAtOV0rKVxcfFtcXHddKlxcfD4vZ2ksIChfLCBnMSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzW2cxXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLlJlcGxhY2VBbGwobmV3U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8gfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBFSlNQYXJzZXIgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL3RyYW5zZm9ybS9FYXN5U2NyaXB0JztcblxuaW50ZXJmYWNlIEpTUGFyc2VyVmFsdWVzIHtcbiAgICB0eXBlOiAndGV4dCcgfCAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU1BhcnNlciB7XG4gICAgcHVibGljIHN0YXJ0OiBzdHJpbmc7XG4gICAgcHVibGljIHRleHQ6IFN0cmluZ1RyYWNrZXI7XG4gICAgcHVibGljIGVuZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWVzOiBKU1BhcnNlclZhbHVlc1tdO1xuXG4gICAgY29uc3RydWN0b3IodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBzdGFydCA9IFwiPCVcIiwgZW5kID0gXCIlPlwiLCB0eXBlID0gJ3NjcmlwdCcpIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBSZXBsYWNlVmFsdWVzKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlQWxsKGZpbmQsIHJlcGxhY2UpO1xuICAgIH1cblxuICAgIGZpbmRFbmRPZkRlZkdsb2JhbCh0ZXh0OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGVxID0gdGV4dC5lcVxuICAgICAgICBjb25zdCBmaW5kID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZXEsIFsnOycsICdcXG4nLCB0aGlzLmVuZF0pO1xuICAgICAgICByZXR1cm4gZmluZCAhPSAtMSA/IGZpbmQgKyAxIDogZXEubGVuZ3RoO1xuICAgIH1cblxuICAgIFNjcmlwdFdpdGhJbmZvKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgV2l0aEluZm8gPSBuZXcgU3RyaW5nVHJhY2tlcih0ZXh0LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsU2NyaXB0ID0gdGV4dC5zcGxpdCgnXFxuJyksIGxlbmd0aCA9IGFsbFNjcmlwdC5sZW5ndGg7XG4gICAgICAgIC8vbmV3IGxpbmUgZm9yIGRlYnVnIGFzIG5ldyBsaW5lIHN0YXJ0XG4gICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuXG4gICAgICAgIC8vZmlsZSBuYW1lIGluIGNvbW1lbnRcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNjcmlwdCkge1xuXG4gICAgICAgICAgICBpZihpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlU2FmZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlYnVnXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgXFxucnVuX3NjcmlwdF9uYW1lID0gXFxgJHtKU1BhcnNlci5maXhUZXh0KHN1YnN0cmluZyl9XFxgO2BcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzdWJzdHJpbmcsXG4gICAgICAgICAgICAgICAgdHlwZTogPGFueT50eXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0KHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvYC9naSwgJ1xcXFxgJykucmVwbGFjZSgvXFwkL2dpLCAnXFxcXHUwMDI0Jyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFRleHRTaW1wbGVRdW90ZXModGV4dDogU3RyaW5nVHJhY2tlciB8IHN0cmluZyl7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyk7XG4gICAgfVxuXG4gICAgUmVCdWlsZFRleHQoKSB7XG4gICAgICAgIGNvbnN0IGFsbGNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpLnR5cGUgPT0gJ25vLXRyYWNrJykge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCAnIScsIGkudGV4dCwgdGhpcy5lbmQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCBpLnRleHQsIHRoaXMuZW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxjb2RlO1xuICAgIH1cblxuICAgIEJ1aWxkQWxsKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcnVuU2NyaXB0ID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyRgXFxub3V0X3J1bl9zY3JpcHQudGV4dCs9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1ZyAmJiBpLnR5cGUgPT0gJ3NjcmlwdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgXFxucnVuX3NjcmlwdF9jb2RlPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyaXB0V2l0aEluZm8oaS50ZXh0KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHByaW50RXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgPHAgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPiR7bWVzc2FnZX08L3A+YDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgUnVuQW5kRXhwb3J0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGV4dCwgcGF0aClcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG4gICAgICAgIHJldHVybiBwYXJzZXIuQnVpbGRBbGwoaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3BsaXQyRnJvbUVuZCh0ZXh0OiBzdHJpbmcsIHNwbGl0Q2hhcjogc3RyaW5nLCBudW1Ub1NwbGl0RnJvbUVuZCA9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRleHQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0ZXh0W2ldID09IHNwbGl0Q2hhcikge1xuICAgICAgICAgICAgICAgIG51bVRvU3BsaXRGcm9tRW5kLS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1Ub1NwbGl0RnJvbUVuZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0ZXh0LnN1YnN0cmluZygwLCBpKSwgdGV4dC5zdWJzdHJpbmcoaSArIDEpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdGV4dF07XG4gICAgfVxufVxuXG5cbi8vYnVpbGQgc3BlY2lhbCBjbGFzcyBmb3IgcGFyc2VyIGNvbW1lbnRzIC8qKi8gc28geW91IGJlIGFibGUgdG8gYWRkIFJhem9yIGluc2lkZSBvZiBzdHlsZSBvdCBzY3JpcHQgdGFnXG5cbmludGVyZmFjZSBHbG9iYWxSZXBsYWNlQXJyYXkge1xuICAgIHR5cGU6ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBjbGFzcyBFbmFibGVHbG9iYWxSZXBsYWNlIHtcbiAgICBwcml2YXRlIHNhdmVkQnVpbGREYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXlbXSA9IFtdO1xuICAgIHByaXZhdGUgYnVpbGRDb2RlOiBSZUJ1aWxkQ29kZVN0cmluZztcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIHJlcGxhY2VyOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkZFRleHQgPSBcIlwiKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZXIgPSBSZWdFeHAoYCR7YWRkVGV4dH1cXFxcL1xcXFwqIXN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+XFxcXCpcXFxcL3xzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PmApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoY29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYnVpbGRDb2RlID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKGF3YWl0IFBhcnNlVGV4dFN0cmVhbShhd2FpdCB0aGlzLkV4dHJhY3RBbmRTYXZlQ29kZShjb2RlKSkpO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvZGUgPSBuZXcgSlNQYXJzZXIoY29kZSwgdGhpcy5wYXRoKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvZGUuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvZGUudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVkQnVpbGREYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkudGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gYHN5c3RlbS0tPHxlanN8JHtjb3VudGVyKyt9fD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBQYXJzZU91dHNpZGVPZkNvbW1lbnQodGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlcigvc3lzdGVtLS08XFx8ZWpzXFx8KFswLTldKVxcfD4vLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gU3BsaXRUb1JlcGxhY2VbMV07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoaW5kZXguU3RhcnRJbmZvKS5QbHVzJGAke3RoaXMuYWRkVGV4dH0vKiFzeXN0ZW0tLTx8ZWpzfCR7aW5kZXh9fD4qL2A7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBTdGFydEJ1aWxkKCkge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29tbWVudHMgPSBuZXcgSlNQYXJzZXIobmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCksIHRoaXMucGF0aCwgJy8qJywgJyovJyk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb21tZW50cy5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29tbWVudHMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGkudGV4dCA9IHRoaXMuUGFyc2VPdXRzaWRlT2ZDb21tZW50KGkudGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0ID0gZXh0cmFjdENvbW1lbnRzLlJlQnVpbGRUZXh0KCkuZXE7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29kZS5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlc3RvcmVBc0NvZGUoRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihEYXRhLnRleHQuU3RhcnRJbmZvKS5QbHVzJGA8JSR7RGF0YS50eXBlID09ICduby10cmFjaycgPyAnISc6ICcnfSR7RGF0YS50ZXh0fSU+YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgUmVzdG9yZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlcih0aGlzLnJlcGxhY2VyLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFNwbGl0VG9SZXBsYWNlWzFdID8/IFNwbGl0VG9SZXBsYWNlWzJdKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUmVzdG9yZUFzQ29kZSh0aGlzLnNhdmVkQnVpbGREYXRhW2luZGV4XSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgYnVpbGQsIE1lc3NhZ2UsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4vcHJpbnRNZXNzYWdlJztcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5SlModGV4dDogc3RyaW5nLCB0cmFja2VyOiBTdHJpbmdUcmFja2VyKXtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7Y29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKHRleHQsIHttaW5pZnk6IHRydWV9KTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKHRyYWNrZXIsIHdhcm5pbmdzKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKHRyYWNrZXIsIGVycilcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG59IiwgImltcG9ydCB7IGJ1aWxkLCBNZXNzYWdlLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IGAke2Vyci50ZXh0fSwgb24gZmlsZSAtPiAke2ZpbGVQYXRoID8/IGVyci5sb2NhdGlvbi5maWxlfToke2Vycj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHtlcnI/LmxvY2F0aW9uPy5jb2x1bW4gPz8gMH1gXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcCh7ZXJyb3JzfToge2Vycm9yczogIE1lc3NhZ2VbXX0sIHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcCk7XG4gICAgZm9yKGNvbnN0IGVyciBvZiBlcnJvcnMpe1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBvcmlnaW5hbC5vcmlnaW5hbFBvc2l0aW9uRm9yKGVyci5sb2NhdGlvbik7XG4gICAgICAgIGlmKHNvdXJjZS5zb3VyY2UpXG4gICAgICAgICAgICBlcnIubG9jYXRpb24gPSA8YW55PnNvdXJjZTtcbiAgICB9XG4gICAgRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc30sIGZpbGVQYXRoKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3M6IE1lc3NhZ2VbXSwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBmb3IgKGNvbnN0IHdhcm4gb2Ygd2FybmluZ3MpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBgJHt3YXJuLnRleHR9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyB3YXJuLmxvY2F0aW9uLmZpbGV9OiR7d2Fybj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHt3YXJuPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIHdhcm5pbmdzOiBNZXNzYWdlW10pIHtcbiAgICBmb3IgKGNvbnN0IHdhcm4gb2Ygd2FybmluZ3MpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZSh3YXJuKVxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwge2Vycm9yc306e2Vycm9yczogTWVzc2FnZVtdfSkge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUoZXJyKVxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGludGVyZmFjZSBQcmV2ZW50TG9nIHtcbiAgICBpZD86IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgZXJyb3JOYW1lOiBzdHJpbmcsXG4gICAgdHlwZT86IFwid2FyblwiIHwgXCJlcnJvclwiXG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nczoge1ByZXZlbnRFcnJvcnM6IHN0cmluZ1tdfSA9IHtcbiAgICBQcmV2ZW50RXJyb3JzOiBbXVxufVxuXG5jb25zdCBQcmV2ZW50RG91YmxlTG9nOiBzdHJpbmdbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgQ2xlYXJXYXJuaW5nID0gKCkgPT4gUHJldmVudERvdWJsZUxvZy5sZW5ndGggPSAwO1xuXG4vKipcbiAqIElmIHRoZSBlcnJvciBpcyBub3QgaW4gdGhlIFByZXZlbnRFcnJvcnMgYXJyYXksIHByaW50IHRoZSBlcnJvclxuICogQHBhcmFtIHtQcmV2ZW50TG9nfSAgLSBgaWRgIC0gVGhlIGlkIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5ld1ByaW50KHtpZCwgdGV4dCwgdHlwZSA9IFwid2FyblwiLCBlcnJvck5hbWV9OiBQcmV2ZW50TG9nKSB7XG4gICAgaWYoIVByZXZlbnREb3VibGVMb2cuaW5jbHVkZXMoaWQgPz8gdGV4dCkgJiYgIVNldHRpbmdzLlByZXZlbnRFcnJvcnMuaW5jbHVkZXMoZXJyb3JOYW1lKSl7XG4gICAgICAgIFByZXZlbnREb3VibGVMb2cucHVzaChpZCA/PyB0ZXh0KTtcbiAgICAgICAgcmV0dXJuIFt0eXBlLCAodGV4dC5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJykgKyBgXFxuXFxuRXJyb3ItQ29kZTogJHtlcnJvck5hbWV9XFxuXFxuYCldO1xuICAgIH1cbiAgICByZXR1cm4gW1wiZG8tbm90aGluZ1wiXVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogc3RyaW5nLCBwYXJhbXM6IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3IgPSBcIiR7c2VsZWN0b3J9XCIsIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke2F3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSl9XG4gICAgICAgIHZhciBleHBvcnRzID0gJHtuYW1lfS5leHBvcnRzO1xuICAgICAgICByZXR1cm4gc2VuZFRvU2VsZWN0b3Ioc2VsZWN0b3IsIG91dF9ydW5fc2NyaXB0LnRleHQpO1xuICAgIH1cXG4ke25hbWV9LmV4cG9ydHMgPSB7fTtgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIGRhdGFUYWcuZ2V0VmFsdWUoJ3BhcmFtcycpLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCdzZWxlY3RvcicpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50KTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBsZXQgUmVzQ29kZSA9IEJldHdlZW5UYWdEYXRhO1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZShcInNlcnZcIik7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUpO1xuXG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFeHRyYWN0ZWQgPSBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCk7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlbWFwOiAnZXh0ZXJuYWwnLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHttYXAsIGNvZGUsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgd2FybmluZ3MpO1xuICAgICAgICBcbiAgICAgICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBtYXApKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke1Jlc0NvZGV9PC9zY3JpcHQ+YFxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBtYXAgPSB0eXBlb2Ygc291cmNlTWFwID09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShzb3VyY2VNYXApOiBzb3VyY2VNYXA7XG5cbiAgICBjb25zdCB0cmFja0NvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICBjb25zdCBzcGxpdExpbmVzID0gdHJhY2tDb2RlLnNwbGl0KCdcXG4nKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBpc01hcCA9IHNwbGl0TGluZXNbbS5nZW5lcmF0ZWRMaW5lIC0gMV07XG4gICAgICAgIGlmICghaXNNYXApIHJldHVybjtcblxuXG4gICAgICAgIGxldCBjaGFyQ291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaXNNYXAuc3Vic3RyaW5nKG0uZ2VuZXJhdGVkQ29sdW1uID8gbS5nZW5lcmF0ZWRDb2x1bW4gLSAxOiAwKS5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICAgICAgaS5pbmZvID0gbS5zb3VyY2U7XG4gICAgICAgICAgICBpLmxpbmUgPSBtLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAgIGkuY2hhciA9IGNoYXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2tDb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ICA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgaXRlbS5pbmZvID0gaW5mbztcbiAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYWNrVG9PcmlnaW5hbChvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG5ld1RyYWNrZXIgPSBhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZSwgc291cmNlTWFwKTtcbiAgICBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyKTtcbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlciwgbXlTb3VyY2U6IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBpZihpdGVtLmluZm8gPT0gbXlTb3VyY2Upe1xuICAgICAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXS5hdChpdGVtLmNoYXItMSk/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW0uaW5mbykge1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKGl0ZW0uaW5mbykpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsU3NzKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyLCBteVNvdXJjZSk7XG5cbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgdGFnRGF0YU9iamVjdEFycmF5IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCB0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IEJldHdlZW5UYWdEYXRhRXEgPSBCZXR3ZWVuVGFnRGF0YS5lcSwgQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSA9IEJldHdlZW5UYWdEYXRhRXEudHJpbSgpLCBpc01vZGVsID0gdGFnRGF0YS5nZXRWYWx1ZSgndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6IHNlc3Npb25JbmZvLmRlYnVnID8gJ2V4dGVybmFsJyA6IGZhbHNlLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgbWFwLCBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhLmVxLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG5cbiAgICAgICAgcmVzdWx0Q29kZSA9IGNvZGU7XG4gICAgICAgIHJlc3VsdE1hcCA9IG1hcDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoaXNNb2RlbCA/ICdtb2R1bGUnIDogJ3NjcmlwdCcsIHRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHRNYXApIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKEpTT04ucGFyc2UocmVzdWx0TWFwKSwgQmV0d2VlblRhZ0RhdGEsIHJlc3VsdENvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRUZXh0KHJlc3VsdENvZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgaWYgKGRhdGFUYWcuaGF2ZSgnc3JjJykpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke0JldHdlZW5UYWdEYXRhfTwvc2NyaXB0PmBcbiAgICAgICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnJlbW92ZSgnbGFuZycpIHx8ICdqcyc7XG5cbiAgICBpZiAoZGF0YVRhZy5oYXZlKCdzZXJ2ZXInKSkge1xuICAgICAgICBkYXRhVGFnLnJlbW92ZSgnc2VydmVyJyk7XG4gICAgICAgIHJldHVybiBzY3JpcHRXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjcmlwdFdpdGhDbGllbnQobGFuZ3VhZ2UsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG59IiwgImltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwIH0gZnJvbSBcInNvdXJjZS1tYXAtanNcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1wb3J0ZXIob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kRmlsZVVybCh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKHVybFswXSA9PSAnLycgfHwgdXJsWzBdID09ICd+Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKFxuICAgICAgICAgICAgICAgICAgICB1cmwuc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgICAgICBwYXRoVG9GaWxlVVJMKHVybFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZywgU29tZVBsdWdpbnM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nLCBTb21lUGx1Z2luczogYW55KSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIFNvbWVQbHVnaW5zKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPiAke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIG91dFN0eWxlID0gQmV0d2VlblRhZ0RhdGEuZXEpIHtcbiAgICBjb25zdCB0aGlzUGFnZSA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgdGhpc1BhZ2VVUkwgPSBwYXRoVG9GaWxlVVJMKHRoaXNQYWdlKSxcbiAgICAgICAgY29tcHJlc3NlZCA9IG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKCk7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YS50cmltU3RhcnQoKSwgcGF0aE5hbWUpO1xuXG4gICAgLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgXG4gICAgbGV0IHsgb3V0U3R5bGUsIGNvbXByZXNzZWQgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVTdG9yZURhdGF9PC9zdHlsZT5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgTWluQ3NzIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplcic7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4uL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ3N0eWxlJywgZGF0YVRhZywgIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHQ/LnNvdXJjZU1hcClcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKFNvdXJjZU1hcFN0b3JlLmZpeFVSTFNvdXJjZU1hcCg8YW55PnJlc3VsdC5zb3VyY2VNYXApLCBCZXR3ZWVuVGFnRGF0YSwgb3V0U3R5bGUpO1xuICAgIGVsc2VcbiAgICAgICAgcHVzaFN0eWxlLmFkZFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIHsgdGV4dDogb3V0U3R5bGUgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHN0eWxlV2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc3R5bGVXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucmVtb3ZlKCdsYW5nJykgfHwgJ2Nzcyc7XG5cbiAgICBpZihkYXRhVGFnLmhhdmUoJ3NlcnZlcicpKXtcbiAgICAgICAgZGF0YVRhZy5yZW1vdmUoJ3NlcnZlcicpO1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZVdpdGhDbGllbnQobGFuZ3VhZ2UsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcblxuZnVuY3Rpb24gSW5Gb2xkZXJQYWdlUGF0aChpbnB1dFBhdGg6IHN0cmluZywgc21hbGxQYXRoOnN0cmluZyl7XG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGlucHV0UGF0aFsxXSA9PSAnLycpIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb2xkZXIgPSBwYXRoX25vZGUuZGlybmFtZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIGlmKGZvbGRlcil7XG4gICAgICAgICAgICBmb2xkZXIgKz0gJy8nO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGZvbGRlciArIGlucHV0UGF0aDtcbiAgICB9IGVsc2UgaWYgKGlucHV0UGF0aFswXSA9PSAnLycpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWdlVHlwZSA9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgaWYoIWlucHV0UGF0aC5lbmRzV2l0aChwYWdlVHlwZSkpe1xuICAgICAgICBpbnB1dFBhdGggKz0gcGFnZVR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0UGF0aDtcbn1cblxuY29uc3QgY2FjaGVNYXA6IHsgW2tleTogc3RyaW5nXToge0NvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkfX0gPSB7fTtcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5nZXRWYWx1ZShcImZyb21cIik7XG5cbiAgICBjb25zdCBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyID0gSW5Gb2xkZXJQYWdlUGF0aChmaWxlcGF0aCwgdHlwZS5leHRyYWN0SW5mbygpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgU21hbGxQYXRoV2l0aG91dEZvbGRlciwgU21hbGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgU21hbGxQYXRoV2l0aG91dEZvbGRlcjtcblxuICAgIGlmICghKGF3YWl0IEVhc3lGcy5zdGF0KEZ1bGxQYXRoLCBudWxsLCB0cnVlKSkuaXNGaWxlPy4oKSkge1xuICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICB0ZXh0OiBgXFxuUGFnZSBub3QgZm91bmQ6ICR7dHlwZS5hdCgwKS5saW5lSW5mb30gLT4gJHtGdWxsUGF0aH1gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAncGFnZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQsIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+UGFnZSBub3QgZm91bmQ6ICR7dHlwZS5saW5lSW5mb30gLT4gJHtTbWFsbFBhdGh9PC9wPmApXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtTbWFsbFBhdGhXaXRob3V0Rm9sZGVyXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb259ID0gYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUoU21hbGxQYXRoV2l0aG91dEZvbGRlciwgZ2V0VHlwZXMuU3RhdGljLCBudWxsLCBwYXRoTmFtZSwgZGF0YVRhZy5yZW1vdmUoJ29iamVjdCcpKTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdID0ge0NvbXBpbGVkRGF0YTo8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb259O1xuICAgICAgICBSZXR1cm5EYXRhID08U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdO1xuICAgXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgdGhpcy5zYXZlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5zYXZlUGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gSlNPTi5wYXJzZShhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCkgfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBrZXkgaXMgaW4gdGhlIHN0b3JlLCByZXR1cm4gdGhlIHZhbHVlLiBJZiBub3QsIGNyZWF0ZSBhIG5ldyB2YWx1ZSwgc3RvcmUgaXQsIGFuZCByZXR1cm4gaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBsb29rIHVwIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0gW2NyZWF0ZV0gLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIGtleSBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgaGF2ZShrZXk6IHN0cmluZywgY3JlYXRlPzogKCkgPT4gc3RyaW5nKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5zdG9yZVtrZXldO1xuICAgICAgICBpZiAoaXRlbSB8fCAhY3JlYXRlKSByZXR1cm4gaXRlbTtcblxuICAgICAgICBpdGVtID0gY3JlYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlKGtleSwgaXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlKCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5zdG9yZSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuL1N0b3JlSlNPTlwiO1xuXG5leHBvcnQgY29uc3QgcGFnZURlcHMgPSBuZXcgU3RvcmVKU09OKCdQYWdlc0luZm8nKVxuXG4vKipcbiAqIENoZWNrIGlmIGFueSBvZiB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZSBwYWdlIGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7U3RyaW5nTnVtYmVyTWFwfSBkZXBlbmRlbmNpZXMgLSBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuIFRoZSBrZXkgaXMgdGhlIHBhdGggdG8gdGhlIGZpbGUsIGFuZFxuICogdGhlIHZhbHVlIGlzIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDpzdHJpbmcsIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0gcGFnZURlcHMuc3RvcmVbcGF0aF0pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGxldCBwID0gaTtcblxuICAgICAgICBpZiAoaSA9PSAndGhpc1BhZ2UnKSB7XG4gICAgICAgICAgICBwID0gcGF0aCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IGRlcGVuZGVuY2llc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICFkZXBlbmRlbmNpZXM7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGlzb2xhdGUoQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbyk7XG5cbiAgICBjb21waWxlZFN0cmluZy5QbHVzJCBgPCV7JT4ke0JldHdlZW5UYWdEYXRhfTwlfSU+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWdpc3RlckV4dGVuc2lvbiBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3Nzcic7XG5pbXBvcnQgeyByZWJ1aWxkRmlsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUsIHsgcmVzb2x2ZSwgY2xlYXJNb2R1bGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9wcmVwcm9jZXNzJztcblxuYXN5bmMgZnVuY3Rpb24gc3NySFRNTChkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBnZXRWID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBndiA9IChuYW1lOiBzdHJpbmcpID0+IGRhdGFUYWcuZ2V0VmFsdWUobmFtZSkudHJpbSgpLFxuICAgICAgICAgICAgdmFsdWUgPSBndignc3NyJyArIENhcGl0YWxpemUobmFtZSkpIHx8IGd2KG5hbWUpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZSA/IGV2YWwoYCgke3ZhbHVlLmNoYXJBdCgwKSA9PSAneycgPyB2YWx1ZSA6IGB7JHt2YWx1ZX19YH0pYCkgOiB7fTtcbiAgICB9O1xuICAgIGNvbnN0IGJ1aWxkUGF0aCA9IGF3YWl0IHJlZ2lzdGVyRXh0ZW5zaW9uKEZ1bGxQYXRoLCBzbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBtb2RlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGJ1aWxkUGF0aCk7XG5cbiAgICBjb25zdCB7IGh0bWwsIGhlYWQgfSA9IG1vZGUuZGVmYXVsdC5yZW5kZXIoZ2V0VigncHJvcHMnKSwgZ2V0Vignb3B0aW9ucycpKTtcbiAgICBzZXNzaW9uSW5mby5oZWFkSFRNTCArPSBoZWFkO1xuICAgIHJldHVybiBodG1sO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucmVtb3ZlKCdmcm9tJyksIGdldFR5cGVzLlN0YXRpY1syXSwgJ3N2ZWx0ZScpO1xuICAgIGNvbnN0IGluV2ViUGF0aCA9IHJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgU21hbGxQYXRoKS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpO1xuXG4gICAgc2Vzc2lvbkluZm8uc3R5bGUoJy8nICsgaW5XZWJQYXRoICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IGlkID0gZGF0YVRhZy5yZW1vdmUoJ2lkJykgfHwgQmFzZTY0SWQoaW5XZWJQYXRoKSxcbiAgICAgICAgaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVRhZy5nZXRWYWx1ZShuYW1lKS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPyBgLCR7bmFtZX06JHt2YWx1ZS5jaGFyQXQoMCkgPT0gJ3snID8gdmFsdWUgOiBgeyR7dmFsdWV9fWB9YCA6ICcnO1xuICAgICAgICB9LCBzZWxlY3RvciA9IGRhdGFUYWcucmVtb3ZlKCdzZWxlY3RvcicpO1xuXG4gICAgY29uc3Qgc3NyID0gIXNlbGVjdG9yICYmIGRhdGFUYWcuaGF2ZSgnc3NyJykgPyBhd2FpdCBzc3JIVE1MKGRhdGFUYWcsIEZ1bGxQYXRoLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKSA6ICcnO1xuXG5cbiAgICBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZSgnbW9kdWxlJywgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAncGFnZScpID8gTGFzdFNtYWxsUGF0aCA6IHR5cGUuZXh0cmFjdEluZm8oKSkuYWRkVGV4dChcbmBpbXBvcnQgQXBwJHtpZH0gZnJvbSAnLyR7aW5XZWJQYXRofSc7XG5jb25zdCB0YXJnZXQke2lkfSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIke3NlbGVjdG9yID8gc2VsZWN0b3IgOiAnIycgKyBpZH1cIik7XG50YXJnZXQke2lkfSAmJiBuZXcgQXBwJHtpZH0oe1xuICAgIHRhcmdldDogdGFyZ2V0JHtpZH1cbiAgICAke2hhdmUoJ3Byb3BzJykgKyBoYXZlKCdvcHRpb25zJyl9JHtzc3IgPyAnLCBoeWRyYXRlOiB0cnVlJyA6ICcnfVxufSk7YCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgc2VsZWN0b3IgPyAnJyA6IGA8ZGl2IGlkPVwiJHtpZH1cIj4ke3Nzcn08L2Rpdj5gKSxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSWQodGV4dDogc3RyaW5nLCBtYXggPSAxMCl7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRleHQpLnRvU3RyaW5nKCdiYXNlNjQnKS5zdWJzdHJpbmcoMCwgbWF4KS5yZXBsYWNlKC9cXCsvLCAnXycpLnJlcGxhY2UoL1xcLy8sICdfJyk7XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0ICB7IENhcGl0YWxpemUsIHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IENvbXBpbGVPcHRpb25zIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY2xlYXJNb2R1bGUsIHJlc29sdmUgfSBmcm9tIFwiLi4vLi4vcmVkaXJlY3RDSlNcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWdpc3RlckV4dGVuc2lvbihmaWxlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IG5hbWUgPSBwYXRoLnBhcnNlKGZpbGVQYXRoKS5uYW1lLnJlcGxhY2UoL15cXGQvLCAnXyQmJykucmVwbGFjZSgvW15hLXpBLVowLTlfJF0vZywgJycpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogQ29tcGlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgbmFtZTogQ2FwaXRhbGl6ZShuYW1lKSxcbiAgICAgICAgZ2VuZXJhdGU6ICdzc3InLFxuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBkZXY6IHNlc3Npb25JbmZvLmRlYnVnLFxuICAgICAgICBlcnJvck1vZGU6ICd3YXJuJ1xuICAgIH07XG5cbiAgICBjb25zdCBpblN0YXRpY0ZpbGUgPSBwYXRoLnJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgc21hbGxQYXRoKTtcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY0ZpbGU7XG5cbiAgICBjb25zdCBmdWxsSW1wb3J0UGF0aCA9IGZ1bGxDb21waWxlUGF0aCArICcuc3NyLmNqcyc7XG4gICAgY29uc3Qge3N2ZWx0ZUZpbGVzLCBjb2RlLCBtYXAsIGRlcGVuZGVuY2llc30gPSBhd2FpdCBwcmVwcm9jZXNzKGZpbGVQYXRoLCBzbWFsbFBhdGgsZnVsbEltcG9ydFBhdGgsZmFsc2UsJy5zc3IuY2pzJyk7XG4gICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsZGVwZW5kZW5jaWVzKTtcbiAgICBvcHRpb25zLnNvdXJjZW1hcCA9IG1hcDtcblxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgZm9yKGNvbnN0IGZpbGUgb2Ygc3ZlbHRlRmlsZXMpe1xuICAgICAgICBjbGVhck1vZHVsZShyZXNvbHZlKGZpbGUpKTsgLy8gZGVsZXRlIG9sZCBpbXBvcnRzXG4gICAgICAgIHByb21pc2VzLnB1c2gocmVnaXN0ZXJFeHRlbnNpb24oZmlsZSwgQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlKSwgc2Vzc2lvbkluZm8pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBjb25zdCB7IGpzLCBjc3MsIHdhcm5pbmdzIH0gPSBzdmVsdGUuY29tcGlsZShjb2RlLCA8YW55Pm9wdGlvbnMpO1xuICAgIFByaW50U3ZlbHRlV2Fybih3YXJuaW5ncywgZmlsZVBhdGgsIG1hcCk7XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSAnLycgKyBpblN0YXRpY0ZpbGUuc3BsaXQoL1xcL3xcXC8vKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiBmdWxsSW1wb3J0UGF0aDtcbn1cbiIsICJpbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBjcmVhdGVJbXBvcnRlciwgZ2V0U2Fzc0Vycm9yTGluZSwgUHJpbnRTYXNzRXJyb3IsIFByaW50U2Fzc0Vycm9yVHJhY2tlciwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRXh0ZW5zaW9uLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwsIGJhY2tUb09yaWdpbmFsU3NzIH0gZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuXG5hc3luYyBmdW5jdGlvbiBTQVNTU3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChsYW5nID09ICdjc3MnKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcsIFNvbWVQbHVnaW5zKSxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIHNvdXJjZU1hcDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogYXdhaXQgYmFja1RvT3JpZ2luYWxTc3MoY29udGVudCwgY3NzLDxhbnk+IHNvdXJjZU1hcCwgc291cmNlTWFwLnNvdXJjZXMuZmluZCh4ID0+IHguc3RhcnRzV2l0aCgnZGF0YTonKSkpLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBsb2FkZWRVcmxzLm1hcCh4ID0+IGZpbGVVUkxUb1BhdGgoPGFueT54KSlcbiAgICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3JUcmFja2VyKGVyciwgY29udGVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU2NyaXB0U3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10sIHN2ZWx0ZUV4dCA9ICcnKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgY29uc3QgbWFwVG9rZW4gPSB7fTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlcigvKChpbXBvcnQoe3xbIF0qXFwoPyl8KChpbXBvcnRbIF0qdHlwZXxpbXBvcnR8ZXhwb3J0KSh7fFsgXSspW1xcV1xcd10rPyh9fFsgXSspZnJvbSkpKH18WyBdKikpKFtcInwnfGBdKShbXFxXXFx3XSs/KVxcOShbIF0qXFwpKT8vbSwgYXJncyA9PiB7XG4gICAgICAgIGlmKGxhbmcgPT0gJ3RzJyAmJiBhcmdzWzVdLmVuZHNXaXRoKCcgdHlwZScpKVxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCBleHQgPSBleHRuYW1lKGFyZ3NbMTBdLmVxKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcnKVxuICAgICAgICAgICAgaWYgKGxhbmcgPT0gJ3RzJylcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcudHMnKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcuanMnKTtcblxuXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBhcmdzWzFdLlBsdXMoYXJnc1s5XSwgYXJnc1sxMF0sIChleHQgPT0gJy5zdmVsdGUnID8gc3ZlbHRlRXh0IDogJycpLCBhcmdzWzldLCAoYXJnc1sxMV0gPz8gJycpKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcuc3ZlbHRlJykge1xuICAgICAgICAgICAgY29ubmVjdFN2ZWx0ZS5wdXNoKGFyZ3NbMTBdLmVxKTtcbiAgICAgICAgfSBlbHNlIGlmIChsYW5nICE9PSAndHMnIHx8ICFhcmdzWzRdKVxuICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG5cbiAgICAgICAgY29uc3QgaWQgPSB1dWlkKCk7XG4gICAgICAgIG1hcFRva2VuW2lkXSA9IG5ld0RhdGE7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBfX190b0tlblxcYCR7aWR9XFxgYCk7XG4gICAgfSk7XG5cbiAgICBpZiAobGFuZyAhPT0gJ3RzJylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gKGF3YWl0IHRyYW5zZm9ybShjb250ZW50LmVxLCB7IC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIGxvYWRlcjogJ3RzJywgc291cmNlbWFwOiB0cnVlIH0pKTtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IGJhY2tUb09yaWdpbmFsKGNvbnRlbnQsIGNvZGUsIG1hcCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihjb250ZW50LCBlcnIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgIH1cblxuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC9fX190b0tlbmAoW1xcd1xcV10rPylgL21pLCBhcmdzID0+IHtcbiAgICAgICAgcmV0dXJuIG1hcFRva2VuW2FyZ3NbMV0uZXFdID8/IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250ZW50O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcHJvY2VzcyhmdWxsUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2F2ZVBhdGggPSBzbWFsbFBhdGgsIGh0dHBTb3VyY2UgPSB0cnVlLCBzdmVsdGVFeHQgPSAnJykgeyAgICBcbiAgICBsZXQgdGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKHNtYWxsUGF0aCwgYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSk7XG5cbiAgICBsZXQgc2NyaXB0TGFuZyA9ICdqcycsIHN0eWxlTGFuZyA9ICdjc3MnO1xuXG4gICAgY29uc3QgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10gPSBbXSwgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c2NyaXB0KVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+XFxuPykoLio/KShcXG4/PFxcL3NjcmlwdD4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzY3JpcHRMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2pzJztcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBhd2FpdCBTY3JpcHRTdmVsdGUoYXJnc1s3XSwgc2NyaXB0TGFuZywgY29ubmVjdFN2ZWx0ZSwgc3ZlbHRlRXh0KSwgYXJnc1s4XSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHlsZUNvZGUgPSBjb25uZWN0U3ZlbHRlLm1hcCh4ID0+IGBAaW1wb3J0IFwiJHt4fS5jc3NcIjtgKS5qb2luKCcnKTtcbiAgICBsZXQgaGFkU3R5bGUgPSBmYWxzZTtcbiAgICB0ZXh0ID0gYXdhaXQgdGV4dC5yZXBsYWNlckFzeW5jKC8oPHN0eWxlKVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+KSguKj8pKDxcXC9zdHlsZT4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzdHlsZUxhbmcgPSBhcmdzWzRdPy5lcSA/PyAnY3NzJztcbiAgICAgICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXM6IGRlcHMgfSA9IGF3YWl0IFNBU1NTdmVsdGUoYXJnc1s3XSwgc3R5bGVMYW5nLCBmdWxsUGF0aCk7XG4gICAgICAgIGRlcHMgJiYgZGVwZW5kZW5jaWVzLnB1c2goLi4uZGVwcyk7XG4gICAgICAgIGhhZFN0eWxlID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVDb2RlICYmIGNvZGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soc3R5bGVDb2RlKTtcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBjb2RlLCBhcmdzWzhdKTs7XG4gICAgfSk7XG5cbiAgICBpZiAoIWhhZFN0eWxlICYmIHN0eWxlQ29kZSkge1xuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYDxzdHlsZT4ke3N0eWxlQ29kZX08L3N0eWxlPmApO1xuICAgIH1cblxuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBuZXcgU2Vzc2lvbkJ1aWxkKHNtYWxsUGF0aCwgZnVsbFBhdGgpLCBwcm9taXNlcyA9IFtzZXNzaW9uSW5mby5kZXBlbmRlbmNlKHNtYWxsUGF0aCwgZnVsbFBhdGgpXTtcblxuICAgIGZvciAoY29uc3QgZnVsbCBvZiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZnVsbCksIGZ1bGwpKTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7IHNjcmlwdExhbmcsIHN0eWxlTGFuZywgY29kZTogdGV4dC5lcSwgbWFwOiB0ZXh0LlN0cmluZ1RhY2soc2F2ZVBhdGgsIGh0dHBTb3VyY2UpLCBkZXBlbmRlbmNpZXM6IHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgc3ZlbHRlRmlsZXM6IGNvbm5lY3RTdmVsdGUubWFwKHggPT4geFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gKyB4IDogcGF0aC5ub3JtYWxpemUoZnVsbFBhdGggKyAnLy4uLycgKyB4KSkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcGl0YWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVbMF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59XG5cbiIsICJpbXBvcnQgdHlwZSB7IHRhZ0RhdGFPYmplY3RBcnJheX0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuXG5cbmNvbnN0IG51bWJlcnMgPSBbJ251bWJlcicsICdudW0nLCAnaW50ZWdlcicsICdpbnQnXSwgYm9vbGVhbnMgPSBbJ2Jvb2xlYW4nLCAnYm9vbCddO1xuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb24gPSBbJ2VtYWlsJywgJ3N0cmluZycsICd0ZXh0JywgLi4ubnVtYmVycywgLi4uYm9vbGVhbnNdO1xuXG5jb25zdCBlbWFpbFZhbGlkYXRvciA9IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC87XG5cblxuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvblJlZ2V4ID0ge1xuICAgIFwic3RyaW5nLWxlbmd0aC1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLVswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLScpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCB0ZXh0OiBzdHJpbmcpID0+IHRleHQubGVuZ3RoID49IG1pbiAmJiB0ZXh0Lmxlbmd0aCA8PSBtYXgsXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibnVtYmVyLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSsuLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heCxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2Utc3RyaW5nXCI6IFtcbiAgICAgICAgL15zdHJpbmd8dGV4dCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gYFwiJHt4LnRyaW0oKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpfVwiYCksXG4gICAgICAgIChvcHRpb25zOiBzdHJpbmdbXSwgdGV4dDogc3RyaW5nKSA9PiBvcHRpb25zLmluY2x1ZGVzKHRleHQpLFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1udW1iZXJcIjogW1xuICAgICAgICAvXm51bWJlcnxudW18aW50ZWdlcnxpbnQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpLFxuICAgICAgICAob3B0aW9uczogbnVtYmVyW10sIG51bTogbnVtYmVyKSA9PiBvcHRpb25zLmluY2x1ZGVzKG51bSksXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdXG59O1xuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMgPSBbLi4ubnVtYmVyc107XG5cbmZvcihjb25zdCBpIGluIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpe1xuICAgIGNvbnN0IHR5cGUgPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2ldWzNdO1xuXG4gICAgaWYoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKHR5cGUpKVxuICAgICAgICBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMucHVzaChpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVZhbHVlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGBbXCIke3ZhbHVlfVwiXWA7XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBbdGVzdCwgZ2V0QXJnc11dIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpKVxuICAgICAgICBpZiAoKDxSZWdFeHA+dGVzdCkudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gYFtcIiR7bmFtZX1cIiwgJHsoPGFueT5nZXRBcmdzKSh2YWx1ZSl9XWA7XG5cbiAgICByZXR1cm4gYFske3ZhbHVlfV1gO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlVmFsaWRhdGlvbkpTT04oYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IFByb21pc2U8Ym9vbGVhbiB8IHN0cmluZ1tdPiB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnQsIC4uLmVsZW1lbnRBcmdzXSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG4gICAgICAgIGxldCByZXR1cm5Ob3cgPSBmYWxzZTtcblxuICAgICAgICBsZXQgaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgY2FzZSAnYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIU51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWVtYWlsVmFsaWRhdG9yLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhdmVSZWdleCA9IHZhbHVlICE9IG51bGwgJiYgYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtlbGVtZW50XTtcblxuICAgICAgICAgICAgICAgIGlmKGhhdmVSZWdleCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFoYXZlUmVnZXhbMl0oZWxlbWVudEFyZ3MsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICBpc0RlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSBlbGVtZW50LnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFhd2FpdCBlbGVtZW50KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYGZhaWxlZCBhdCAke2l9IGZpbGVkIC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBmaW5kOiBzdHJpbmcsIGRlZmF1bHREYXRhOiBhbnkgPSBudWxsKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW57XG4gICAgY29uc3QgaGF2ZSA9IGRhdGEuaGF2ZShmaW5kKSwgdmFsdWUgPSBkYXRhLnJlbW92ZShmaW5kKTtcblxuICAgIGlmKGhhdmUgJiYgdmFsdWUgIT0gJ2ZhbHNlJykgcmV0dXJuIHZhbHVlIHx8IGhhdmUgICAgXG4gICAgaWYodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcblxuICAgIGlmKCFoYXZlKSByZXR1cm4gZGVmYXVsdERhdGE7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59IiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXCI8cCBzdHlsZT1cXFxcXCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1xcXFxcIj5TeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX08L3A+XCJgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IGVyci5lcnJvcnNbMF07XG4gICAgICAgICAgICBmaXJzdC5sb2NhdGlvbiAmJiAoZmlyc3QubG9jYXRpb24ubGluZVRleHQgPSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZSh0ZXh0LmRlYnVnTGluZShmaXJzdCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tIFwiLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3RcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5cblxuZXhwb3J0IHR5cGUgc2V0RGF0YUhUTUxUYWcgPSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcFxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JBcnJheSA9IHtcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHNlbmRUbzogc3RyaW5nLFxuICAgIHZhbGlkYXRvcjogc3RyaW5nW10sXG4gICAgb3JkZXI/OiBzdHJpbmdbXSxcbiAgICBub3RWYWxpZD86IHN0cmluZyxcbiAgICBtZXNzYWdlPzogc3RyaW5nIHwgYm9vbGVhbixcbiAgICByZXNwb25zZVNhZmU/OiBib29sZWFuXG59W11cblxuZXhwb3J0IHR5cGUgY2FjaGVDb21wb25lbnQgPSB7XG4gICAgW2tleTogc3RyaW5nXTogbnVsbCB8IHtcbiAgICAgICAgbXRpbWVNcz86IG51bWJlcixcbiAgICAgICAgdmFsdWU/OiBzdHJpbmdcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIGluVGFnQ2FjaGUgPSB7XG4gICAgc3R5bGU6IHN0cmluZ1tdXG4gICAgc2NyaXB0OiBzdHJpbmdbXVxuICAgIHNjcmlwdE1vZHVsZTogc3RyaW5nW11cbn1cblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU2hvcnRTY3JpcHROYW1lcycpO1xuXG4vKiBUaGUgU2Vzc2lvbkJ1aWxkIGNsYXNzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGhlYWQgb2YgdGhlIHBhZ2UgKi9cbmV4cG9ydCBjbGFzcyBTZXNzaW9uQnVpbGQge1xuICAgIGNvbm5lY3RvckFycmF5OiBjb25uZWN0b3JBcnJheSA9IFtdXG4gICAgcHJpdmF0ZSBzY3JpcHRVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgc3R5bGVVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgaW5TY3JpcHRTdHlsZTogeyB0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgcGF0aDogc3RyaW5nLCB2YWx1ZTogU291cmNlTWFwU3RvcmUgfVtdID0gW11cbiAgICBoZWFkSFRNTCA9ICcnXG4gICAgY2FjaGU6IGluVGFnQ2FjaGUgPSB7XG4gICAgICAgIHN0eWxlOiBbXSxcbiAgICAgICAgc2NyaXB0OiBbXSxcbiAgICAgICAgc2NyaXB0TW9kdWxlOiBbXVxuICAgIH1cbiAgICBjYWNoZUNvbXBpbGVTY3JpcHQ6IGFueSA9IHt9XG4gICAgY2FjaGVDb21wb25lbnQ6IGNhY2hlQ29tcG9uZW50ID0ge31cbiAgICBjb21waWxlUnVuVGltZVN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fVxuICAgIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0ge31cbiAgICByZWNvcmROYW1lczogc3RyaW5nW10gPSBbXVxuXG4gICAgZ2V0IHNhZmVEZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWcgJiYgdGhpcy5fc2FmZURlYnVnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGZ1bGxQYXRoOiBzdHJpbmcsIHB1YmxpYyB0eXBlTmFtZT86IHN0cmluZywgcHVibGljIGRlYnVnPzogYm9vbGVhbiwgcHJpdmF0ZSBfc2FmZURlYnVnPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zID0gdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHN0eWxlKHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlVVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHNjcmlwdCh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zY3JpcHRVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHJlY29yZChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKG5hbWUpKVxuICAgICAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcGVuZGVuY2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0pIHJldHVybjtcblxuICAgICAgICBjb25zdCBoYXZlRGVwID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdDtcbiAgICAgICAgaWYgKGhhdmVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0gPSBoYXZlRGVwXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBzbWFsbFBhdGggPSB0aGlzLnNtYWxsUGF0aCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuaW5TY3JpcHRTdHlsZS5maW5kKHggPT4geC50eXBlID09IHR5cGUgJiYgeC5wYXRoID09IHNtYWxsUGF0aCk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IHsgdHlwZSwgcGF0aDogc21hbGxQYXRoLCB2YWx1ZTogbmV3IFNvdXJjZU1hcFN0b3JlKHNtYWxsUGF0aCwgdGhpcy5zYWZlRGVidWcsIHR5cGUgPT0gJ3N0eWxlJywgdHJ1ZSkgfVxuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS52YWx1ZVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlUGFnZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3BhZ2UnKSA/IHRoaXMuc21hbGxQYXRoIDogaW5mby5leHRyYWN0SW5mbygpKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZU5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTdGF0aWNGaWxlc0luZm8uc3RvcmUpO1xuICAgICAgICB3aGlsZSAoa2V5ID09IG51bGwgfHwgdmFsdWVzLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIGtleSA9IEJhc2U2NElkKHRleHQsIDUgKyBsZW5ndGgpLnN1YnN0cmluZyhsZW5ndGgpO1xuICAgICAgICAgICAgbGVuZ3RoKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYWRkSGVhZFRhZ3MoKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VMb2cgPSB0aGlzLnR5cGVOYW1lID09IGdldFR5cGVzLkxvZ3NbMl1cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgY29uc3QgaXNMb2cgPSBwYWdlTG9nICYmIGkucGF0aCA9PSB0aGlzLnNtYWxsUGF0aDtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVMb2NhdGlvbiA9IGlzTG9nID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXSwgYWRkUXVlcnkgPSBpc0xvZyA/ICc/dD1sJyA6ICcnO1xuICAgICAgICAgICAgbGV0IHVybCA9IFN0YXRpY0ZpbGVzSW5mby5oYXZlKGkucGF0aCwgKCkgPT4gU2Vzc2lvbkJ1aWxkLmNyZWF0ZU5hbWUoaS5wYXRoKSkgKyAnLnB1Yic7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2NyaXB0JzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyBkZWZlcjogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtb2R1bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5tanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyB0eXBlOiAnbW9kdWxlJyB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmNzcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUoJy8nICsgdXJsICsgYWRkUXVlcnkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHNhdmVMb2NhdGlvbiArIHVybCwgYXdhaXQgaS52YWx1ZS5jcmVhdGVEYXRhV2l0aE1hcCgpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRIZWFkKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZEhlYWRUYWdzKCk7XG5cbiAgICAgICAgY29uc3QgbWFrZUF0dHJpYnV0ZXMgPSAoaTogc2V0RGF0YUhUTUxUYWcpID0+IGkuYXR0cmlidXRlcyA/ICcgJyArIE9iamVjdC5rZXlzKGkuYXR0cmlidXRlcykubWFwKHggPT4gaS5hdHRyaWJ1dGVzW3hdID8geCArIGA9XCIke2kuYXR0cmlidXRlc1t4XX1cImAgOiB4KS5qb2luKCcgJykgOiAnJztcblxuICAgICAgICBsZXQgYnVpbGRCdW5kbGVTdHJpbmcgPSAnJzsgLy8gYWRkIHNjcmlwdHMgYWRkIGNzc1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zdHlsZVVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfS8+YDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc2NyaXB0VVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxzY3JpcHQgc3JjPVwiJHtpLnVybH1cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Pjwvc2NyaXB0PmA7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkQnVuZGxlU3RyaW5nICsgdGhpcy5oZWFkSFRNTDtcbiAgICB9XG5cbiAgICBleHRlbmRzKGZyb206IFNlc3Npb25CdWlsZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3RvckFycmF5LnB1c2goLi4uZnJvbS5jb25uZWN0b3JBcnJheSk7XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goLi4uZnJvbS5zY3JpcHRVUkxTZXQpO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goLi4uZnJvbS5zdHlsZVVSTFNldCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGZyb20uaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goeyAuLi5pLCB2YWx1ZTogaS52YWx1ZS5jbG9uZSgpIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3B5T2JqZWN0cyA9IFsnY2FjaGVDb21waWxlU2NyaXB0JywgJ2NhY2hlQ29tcG9uZW50JywgJ2RlcGVuZGVuY2llcyddO1xuXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb3B5T2JqZWN0cykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzW2NdLCBmcm9tW2NdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaCguLi5mcm9tLnJlY29yZE5hbWVzLmZpbHRlcih4ID0+ICF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKHgpKSk7XG5cbiAgICAgICAgdGhpcy5oZWFkSFRNTCArPSBmcm9tLmhlYWRIVE1MO1xuICAgICAgICB0aGlzLmNhY2hlLnN0eWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0LnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHQpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdE1vZHVsZS5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0TW9kdWxlKTtcbiAgICB9XG5cbiAgICAvL2Jhc2ljIG1ldGhvZHNcbiAgICBCdWlsZFNjcmlwdFdpdGhQcmFtcyhjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBCdWlsZFNjcmlwdChjb2RlLCBpc1RzKCksIHRoaXMpO1xuICAgIH1cbn0iLCAiLy8gQHRzLW5vY2hlY2tcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IGNsZWFyTW9kdWxlIGZyb20gJ2NsZWFyLW1vZHVsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKSwgcmVzb2x2ZSA9IChwYXRoOiBzdHJpbmcpID0+IHJlcXVpcmUucmVzb2x2ZShwYXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUoZmlsZVBhdGgpO1xuICAgIGNsZWFyTW9kdWxlKGZpbGVQYXRoKTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59XG5cbmV4cG9ydCB7XG4gICAgY2xlYXJNb2R1bGUsXG4gICAgcmVzb2x2ZVxufSIsICJpbXBvcnQgeyBXYXJuaW5nIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuY2xhc3MgcmVMb2NhdGlvbiB7XG4gICAgbWFwOiBQcm9taXNlPFNvdXJjZU1hcENvbnN1bWVyPlxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZU1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIH1cblxuICAgIGFzeW5jIGdldExvY2F0aW9uKGxvY2F0aW9uOiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn0pe1xuICAgICAgICBjb25zdCB7bGluZSwgY29sdW1ufSA9IChhd2FpdCB0aGlzLm1hcCkub3JpZ2luYWxQb3NpdGlvbkZvcihsb2NhdGlvbilcbiAgICAgICAgcmV0dXJuIGAke2xpbmV9OiR7Y29sdW1ufWA7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVFcnJvcih7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9OiBXYXJuaW5nLCBmaWxlUGF0aDogc3RyaW5nLCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IGZpbmRMb2NhdGlvbiA9IG5ldyByZUxvY2F0aW9uKHNvdXJjZU1hcClcbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfVxcbiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQcmludFN2ZWx0ZVdhcm4od2FybmluZ3M6IFdhcm5pbmdbXSwgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCB7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9IG9mIHdhcm5pbmdzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnc3ZlbHRlLScgKyBjb2RlLFxuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfVxcbiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgaGxqcyBmcm9tICdoaWdobGlnaHQuanMnO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuXG5mdW5jdGlvbiBjb2RlV2l0aENvcHkobWQ6IGFueSkge1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZShvcmlnUnVsZTogYW55KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdSZW5kZXJlZCA9IG9yaWdSdWxlKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY29kZS1jb3B5XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb3B5LWNsaXBib2FyZFwiIG9uY2xpY2s9XCJuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0aGlzLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVyVGV4dClcIj5jb3B5PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICR7b3JpZ1JlbmRlcmVkfVxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayk7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBtYXJrRG93blBsdWdpbiA9IEluc2VydENvbXBvbmVudC5HZXRQbHVnaW4oJ21hcmtkb3duJyk7XG5cbiAgICBjb25zdCBobGpzQ2xhc3MgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpKSxcbiAgICAgICAgYnJlYWtzOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2JyZWFrcycsIG1hcmtEb3duUGx1Z2luPy5icmVha3MgPz8gdHJ1ZSkpLFxuICAgICAgICB0eXBvZ3JhcGhlcjogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICd0eXBvZ3JhcGhlcicsIG1hcmtEb3duUGx1Z2luPy50eXBvZ3JhcGhlciA/PyB0cnVlKSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2NvcHktY29kZScsIG1hcmtEb3duUGx1Z2luPy5jb3B5Q29kZSA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGNvZGVXaXRoQ29weSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYXR0cnMnLCBtYXJrRG93blBsdWdpbj8uYXR0cnMgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QXR0cnMpO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2FiYnInLCBtYXJrRG93blBsdWdpbj8uYWJiciA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBYmJyKTtcblxuICAgIGxldCBtYXJrZG93bkNvZGUgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG4gICAgaWYgKCFtYXJrZG93bkNvZGUpIHtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBkYXRhVGFnLnJlbW92ZSgnZmlsZScpO1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBsb2NhdGlvblswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gKyBsb2NhdGlvbjogcGF0aC5qb2luKHBhdGguZGlybmFtZSh0eXBlLmV4dHJhY3RJbmZvKCc8bGluZT4nKSksIGxvY2F0aW9uKTtcbiAgICAgICAgaWYgKCFwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKVxuICAgICAgICAgICAgZmlsZVBhdGggKz0gJy5zZXJ2Lm1kJ1xuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgICBtYXJrZG93bkNvZGUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpOyAvL2dldCBtYXJrZG93biBmcm9tIGZpbGVcbiAgICAgICAgYXdhaXQgc2Vzc2lvbi5kZXBlbmRlbmNlKGZpbGVQYXRoLCBmdWxsUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJIVE1MID0gbWQucmVuZGVyKG1hcmtkb3duQ29kZSksIGJ1aWxkSFRNTCA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgY3JlYXRlQXV0b1RoZW1lKGRhdGFUYWcucmVtb3ZlKCdjb2RlLXRoZW1lJykgfHwgbWFya0Rvd25QbHVnaW4/LmNvZGVUaGVtZSB8fCAnYXRvbS1vbmUnKTtcblxuICAgIGlmIChoYXZlSGlnaGxpZ2h0KSB7XG4gICAgICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvY29kZS10aGVtZS8nICsgdGhlbWUgKyAnLmNzcyc7XG4gICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgfVxuXG4gICAgZGF0YVRhZy5hZGRDbGFzcygnbWFya2Rvd24tYm9keScpO1xuXG4gICAgY29uc3Qgc3R5bGUgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICd0aGVtZScsIG1hcmtEb3duUGx1Z2luPy50aGVtZSA/PyAnYXV0bycpO1xuICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvdGhlbWUvJyArIHN0eWxlICsgJy5jc3MnO1xuICAgIHN0eWxlICE9ICdub25lJyAmJiBzZXNzaW9uLnN0eWxlKGNzc0xpbmspXG5cbiAgICBpZiAoZGF0YVRhZy5sZW5ndGgpXG4gICAgICAgIGJ1aWxkSFRNTC5QbHVzJGA8ZGl2JHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtyZW5kZXJIVE1MfTwvZGl2PmA7XG4gICAgZWxzZVxuICAgICAgICBidWlsZEhUTUwuQWRkVGV4dEFmdGVyKHJlbmRlckhUTUwpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYge1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246cmlnaHQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTotMzBweDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6MTBweDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfWA7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGhlbWVQYXRoICsgaSArICcubWluLmNzcycsIE1pbkNzcyhtaW5pKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzcGxpdFN0YXJ0KHRleHQxOiBzdHJpbmcsIHRleHQyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBbYmVmb3JlLCBhZnRlciwgbGFzdF0gPSB0ZXh0MS5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pXG4gICAgY29uc3QgYWRkQmVmb3JlID0gdGV4dDFbYmVmb3JlLmxlbmd0aF0gPT0gJ30nID8gJ30nOiAnKi8nO1xuICAgIHJldHVybiBbYmVmb3JlICthZGRCZWZvcmUsICcuaGxqc3snICsgKGxhc3QgPz8gYWZ0ZXIpLCAnLmhsanN7JyArIHRleHQyLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LykucG9wKCldO1xufVxuXG5jb25zdCBjb2RlVGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3N0eWxlcy8nO1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVBdXRvVGhlbWUodGhlbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGRhcmtMaWdodFNwbGl0ID0gdGhlbWUuc3BsaXQoJ3wnKTtcbiAgICBpZiAoZGFya0xpZ2h0U3BsaXQubGVuZ3RoID09IDEpIHJldHVybiB0aGVtZTtcblxuICAgIGNvbnN0IG5hbWUgPSBkYXJrTGlnaHRTcGxpdFsyXSB8fCBkYXJrTGlnaHRTcGxpdC5zbGljZSgwLCAyKS5qb2luKCd+JykucmVwbGFjZSgnLycsICctJyk7XG5cbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoY29kZVRoZW1lUGF0aCArIG5hbWUgKyAnLmNzcycpKVxuICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgIGNvbnN0IGxpZ2h0VGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMF0gKyAnLmNzcycpO1xuICAgIGNvbnN0IGRhcmtUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFsxXSArICcuY3NzJyk7XG5cbiAgICBjb25zdCBbc3RhcnQsIGRhcmssIGxpZ2h0XSA9IHNwbGl0U3RhcnQoZGFya1RleHQsIGxpZ2h0VGV4dCk7XG4gICAgY29uc3QgZGFya0xpZ2h0ID0gYCR7c3RhcnR9QG1lZGlhKHByZWZlcnMtY29sb3Itc2NoZW1lOmRhcmspeyR7ZGFya319QG1lZGlhKHByZWZlcnMtY29sb3Itc2NoZW1lOmxpZ2h0KXske2xpZ2h0fX1gO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoY29kZVRoZW1lUGF0aCArIG5hbWUgKyAnLmNzcycsIGRhcmtMaWdodCk7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXV0b0NvZGVUaGVtZSgpIHtcbiAgICByZXR1cm4gY3JlYXRlQXV0b1RoZW1lKCdhdG9tLW9uZS1saWdodHxhdG9tLW9uZS1kYXJrfGF0b20tb25lJylcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGhlYWQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgIH1ARGVmYXVsdEluc2VydEJ1bmRsZTwvaGVhZD5gLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBidWlsZEJ1bmRsZVN0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLmJ1aWxkSGVhZCgpO1xuICAgIFxuICAgIGNvbnN0IGJ1bmRsZVBsYWNlaG9sZGVyID0gWy9ASW5zZXJ0QnVuZGxlKDs/KS8sIC9ARGVmYXVsdEluc2VydEJ1bmRsZSg7PykvXTtcbiAgICBjb25zdCByZW1vdmVCdW5kbGUgPSAoKSA9PiB7YnVuZGxlUGxhY2Vob2xkZXIuZm9yRWFjaCh4ID0+IHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSh4LCAnJykpOyByZXR1cm4gcGFnZURhdGF9O1xuXG5cbiAgICBpZiAoIWJ1aWxkQnVuZGxlU3RyaW5nKSAgLy8gdGhlcmUgaXNuJ3QgYW55dGhpbmcgdG8gYnVuZGxlXG4gICAgICAgIHJldHVybiByZW1vdmVCdW5kbGUoKTtcblxuICAgIGNvbnN0IHJlcGxhY2VXaXRoID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYnVpbGRCdW5kbGVTdHJpbmcpOyAvLyBhZGQgYnVuZGxlIHRvIHBhZ2VcbiAgICBsZXQgYnVuZGxlU3VjY2VlZCA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGVQbGFjZWhvbGRlci5sZW5ndGggJiYgIWJ1bmRsZVN1Y2NlZWQ7IGkrKylcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihidW5kbGVQbGFjZWhvbGRlcltpXSwgKCkgPT4gKGJ1bmRsZVN1Y2NlZWQgPSB0cnVlKSAmJiByZXBsYWNlV2l0aCk7XG5cbiAgICBpZihidW5kbGVTdWNjZWVkKVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGEuUGx1cyQgYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPScke3JlcGxhY2VXaXRofSc7YDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHR5cGUgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04sIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcblxuY29uc3Qgc2VydmVTY3JpcHQgPSAnL3NlcnYvY29ubmVjdC5qcyc7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgZnVuY3Rpb24gJHtuYW1lfSguLi5hcmdzKXtyZXR1cm4gY29ubmVjdG9yKFwiJHtuYW1lfVwiLCBhcmdzKX1gO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgeyBTb21lUGx1Z2lucyB9LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcuZ2V0VmFsdWUoJ25hbWUnKSxcbiAgICAgICAgc2VuZFRvID0gZGF0YVRhZy5nZXRWYWx1ZSgnc2VuZFRvJyksXG4gICAgICAgIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5nZXRWYWx1ZSgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdub3RWYWxpZCcpO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdtZXNzYWdlJyk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlID09PSBudWxsKVxuICAgICAgICBtZXNzYWdlID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgIVNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwgeyBhc3luYzogbnVsbCB9KVxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KHRlbXBsYXRlKG5hbWUpKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGEsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgbGV0IGJ1aWxkT2JqZWN0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2Ygc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkpIHtcbiAgICAgICAgaWYgKGkudHlwZSAhPSAnY29ubmVjdCcpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBidWlsZE9iamVjdCArPSBgLFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOlwiJHtpLm5hbWV9XCIsXG4gICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICBub3RWYWxpZDogJHtpLm5vdFZhbGlkIHx8ICdudWxsJ30sXG4gICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICB2YWxpZGF0b3I6WyR7KGkudmFsaWRhdG9yICYmIGkudmFsaWRhdG9yLm1hcChjb21waWxlVmFsdWVzKS5qb2luKCcsJykpIHx8ICcnfV1cbiAgICAgICAgfWA7XG4gICAgfVxuXG4gICAgYnVpbGRPYmplY3QgPSBgWyR7YnVpbGRPYmplY3Quc3Vic3RyaW5nKDEpfV1gO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gYFxuICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JDYWxsKXtcbiAgICAgICAgICAgIGlmKGF3YWl0IGhhbmRlbENvbm5lY3RvcihcImNvbm5lY3RcIiwgcGFnZSwgJHtidWlsZE9iamVjdH0pKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1gO1xuXG4gICAgaWYgKHBhZ2VEYXRhLmluY2x1ZGVzKFwiQENvbm5lY3RIZXJlXCIpKVxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKC9AQ29ubmVjdEhlcmUoOz8pLywgKCkgPT4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYWRkU2NyaXB0KSk7XG4gICAgZWxzZVxuICAgICAgICBwYWdlRGF0YS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGFkZFNjcmlwdCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yQXJyYXk6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzUGFnZS5Qb3N0Py5jb25uZWN0b3JDYWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cblxuICAgIGNvbnN0IGhhdmUgPSBjb25uZWN0b3JBcnJheS5maW5kKHggPT4geC5uYW1lID09IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC5uYW1lKTtcblxuICAgIGlmICghaGF2ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwudmFsdWVzO1xuICAgIGNvbnN0IGlzVmFsaWQgPSBoYXZlLnZhbGlkYXRvci5sZW5ndGggJiYgYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgaGF2ZS52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhdmUudmFsaWRhdG9yLmxlbmd0aCB8fCBpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGhhdmUuc2VuZFRvKC4uLnZhbHVlcykpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCkpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5tZXNzYWdlKVxuICAgICAgICBiZXR0ZXJKU09OKHtcbiAgICAgICAgICAgIGVycm9yOiB0eXBlb2YgaGF2ZS5tZXNzYWdlID09ICdzdHJpbmcnID8gaGF2ZS5tZXNzYWdlIDogKDxhbnk+aXNWYWxpZCkuc2hpZnQoKVxuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnN0YXR1cyg0MDApO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVZhbHVlcywgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBjb25zdCBzZW5kVG8gPSBkYXRhVGFnLnJlbW92ZSgnc2VuZFRvJykudHJpbSgpO1xuXG4gICAgaWYgKCFzZW5kVG8pICAvLyBzcGVjaWFsIGFjdGlvbiBub3QgZm91bmRcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGZvcm0ke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCAgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICAgICAgfTwvZm9ybT5gLFxuICAgICAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgICAgICB9XG5cblxuICAgIGNvbnN0IG5hbWUgPSBkYXRhVGFnLnJlbW92ZSgnbmFtZScpLnRyaW0oKSB8fCB1dWlkKCksIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ29yZGVyJyksIG5vdFZhbGlkOiBzdHJpbmcgPSBkYXRhVGFnLnJlbW92ZSgnbm90VmFsaWQnKSwgcmVzcG9uc2VTYWZlID0gZGF0YVRhZy5oYXZlKCdzYWZlJyk7XG5cbiAgICBsZXQgbWVzc2FnZSA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ21lc3NhZ2UnKTsgLy8gc2hvdyBlcnJvciBtZXNzYWdlXG4gICAgaWYgKG1lc3NhZ2UgPT09IG51bGwpXG4gICAgICAgIG1lc3NhZ2UgPSBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpO1xuXG4gICAgbGV0IG9yZGVyID0gW107XG5cbiAgICBjb25zdCB2YWxpZGF0b3JBcnJheSA9IHZhbGlkYXRvciAmJiB2YWxpZGF0b3Iuc3BsaXQoJywnKS5tYXAoeCA9PiB7IC8vIENoZWNraW5nIGlmIHRoZXJlIGlzIGFuIG9yZGVyIGluZm9ybWF0aW9uLCBmb3IgZXhhbXBsZSBcInByb3AxOiBzdHJpbmcsIHByb3AzOiBudW0sIHByb3AyOiBib29sXCJcbiAgICAgICAgY29uc3Qgc3BsaXQgPSBTcGxpdEZpcnN0KCc6JywgeC50cmltKCkpO1xuXG4gICAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAxKVxuICAgICAgICAgICAgb3JkZXIucHVzaChzcGxpdC5zaGlmdCgpKTtcblxuICAgICAgICByZXR1cm4gc3BsaXQucG9wKCk7XG4gICAgfSk7XG5cbiAgICBpZiAob3JkZXJEZWZhdWx0KVxuICAgICAgICBvcmRlciA9IG9yZGVyRGVmYXVsdC5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKTtcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvckFycmF5LFxuICAgICAgICBvcmRlcjogb3JkZXIubGVuZ3RoICYmIG9yZGVyLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgcmVzcG9uc2VTYWZlXG4gICAgfSk7XG5cbiAgICBpZiAoIWRhdGFUYWcuaGF2ZSgnbWV0aG9kJykpIHtcbiAgICAgICAgZGF0YVRhZy5wdXNoKHtcbiAgICAgICAgICAgIG46IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdtZXRob2QnKSxcbiAgICAgICAgICAgIHY6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdwb3N0JylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtzZW5kVG99KTtcbiU+PGZvcm0ke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT5cbiAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjb25uZWN0b3JGb3JtQ2FsbFwiIHZhbHVlPVwiJHtuYW1lfVwiLz4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyl9PC9mb3JtPmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZyxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkubGVuZ3RoKVxuICAgICAgICByZXR1cm4gcGFnZURhdGE7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2Ygc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkpIHtcbiAgICAgICAgaWYgKGkudHlwZSAhPSAnZm9ybScpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzZW5kVG9Vbmljb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgaS5zZW5kVG8pLnVuaWNvZGUuZXFcbiAgICAgICAgY29uc3QgY29ubmVjdCA9IG5ldyBSZWdFeHAoYEBDb25uZWN0SGVyZUZvcm1cXFxcKFsgXSoke3NlbmRUb1VuaWNvZGV9WyBdKlxcXFwpKDs/KWApLCBjb25uZWN0RGVmYXVsdCA9IG5ldyBSZWdFeHAoYEBcXFxcP0Nvbm5lY3RIZXJlRm9ybVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXCkoOz8pYCk7XG5cbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0IHNjcmlwdERhdGEgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihkYXRhWzBdLlN0YXJ0SW5mbykuUGx1cyRcbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgaWYoUG9zdD8uY29ubmVjdG9yRm9ybUNhbGwgPT0gXCIke2kubmFtZX1cIil7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGhhbmRlbENvbm5lY3RvcihcImZvcm1cIiwgcGFnZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3I6WyR7aS52YWxpZGF0b3I/Lm1hcD8uKGNvbXBpbGVWYWx1ZXMpPy5qb2luKCcsJykgPz8gJyd9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogWyR7aS5vcmRlcj8ubWFwPy4oaXRlbSA9PiBgXCIke2l0ZW19XCJgKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhZmU6JHtpLnJlc3BvbnNlU2FmZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICB9O1xuXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdCwgc2NyaXB0RGF0YSk7XG5cbiAgICAgICAgaWYgKGNvdW50ZXIpXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoY29ubmVjdERlZmF1bHQsICcnKTsgLy8gZGVsZXRpbmcgZGVmYXVsdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3REZWZhdWx0LCBzY3JpcHREYXRhKTtcblxuICAgIH1cblxuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3JJbmZvOiBhbnkpIHtcblxuICAgIGRlbGV0ZSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckZvcm1DYWxsO1xuXG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8ub3JkZXIubGVuZ3RoKSAvLyBwdXNoIHZhbHVlcyBieSBzcGVjaWZpYyBvcmRlclxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY29ubmVjdG9ySW5mby5vcmRlcilcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRoaXNQYWdlLlBvc3RbaV0pO1xuICAgIGVsc2VcbiAgICAgICAgdmFsdWVzLnB1c2goLi4uT2JqZWN0LnZhbHVlcyh0aGlzUGFnZS5Qb3N0KSk7XG5cblxuICAgIGxldCBpc1ZhbGlkOiBib29sZWFuIHwgc3RyaW5nW10gPSB0cnVlO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8udmFsaWRhdG9yLmxlbmd0aCkgeyAvLyB2YWxpZGF0ZSB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcGFyc2VWYWx1ZXModmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgICAgIGlzVmFsaWQgPSBhd2FpdCBtYWtlVmFsaWRhdGlvbkpTT04odmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgfVxuXG4gICAgbGV0IHJlc3BvbnNlOiBhbnk7XG5cbiAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLnNlbmRUbyguLi52YWx1ZXMpO1xuICAgIGVsc2UgaWYgKGNvbm5lY3RvckluZm8ubm90VmFsaWQpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpO1xuXG4gICAgaWYgKCFpc1ZhbGlkICYmICFyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8ubWVzc2FnZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShjb25uZWN0b3JJbmZvLm1lc3NhZ2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXNwb25zZSA9IGNvbm5lY3RvckluZm8ubWVzc2FnZTtcblxuICAgIGlmIChyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8uc2FmZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShyZXNwb25zZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlKHJlc3BvbnNlKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlY29yZFN0b3JlID0gbmV3IFN0b3JlSlNPTignUmVjb3JkcycpO1xuXG5mdW5jdGlvbiByZWNvcmRMaW5rKGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBkYXRhVGFnLnJlbW92ZSgnbGluaycpfHwgc21hbGxQYXRoVG9QYWdlKHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmVjb3JkUGF0aChkZWZhdWx0TmFtZTogc3RyaW5nLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpe1xuICAgIGNvbnN0IGxpbmsgPSByZWNvcmRMaW5rKGRhdGFUYWcsIHNlc3Npb25JbmZvKSwgc2F2ZU5hbWUgPSBkYXRhVGFnLnJlbW92ZSgnbmFtZScpIHx8IGRlZmF1bHROYW1lO1xuXG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdID8/PSB7fTtcbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10gPz89ICcnO1xuICAgIHNlc3Npb25JbmZvLnJlY29yZChzYXZlTmFtZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdG9yZTogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdLFxuICAgICAgICBjdXJyZW50OiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10sXG4gICAgICAgIGxpbmtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBodG1sID0gaHRtbC50cmltKCk7XG5cbiAgICBjb25zdCB7c3RvcmUsIGxpbmt9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvcmVjb3JkLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZighc3RvcmVbbGlua10uaW5jbHVkZXMoaHRtbCkpe1xuICAgICAgICBzdG9yZVtsaW5rXSArPSBodG1sO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IG5hbWUgPSBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoKTtcbiAgICBmb3IoY29uc3Qgc2F2ZSBpbiByZWNvcmRTdG9yZS5zdG9yZSl7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSByZWNvcmRTdG9yZS5zdG9yZVtzYXZlXTtcblxuICAgICAgICBpZihpdGVtW25hbWVdKXtcbiAgICAgICAgICAgIGl0ZW1bbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkZWxldGUgaXRlbVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uLmRlYnVnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIHNlc3Npb24ucmVjb3JkTmFtZXMpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlckNvbXBpbGUoKXtcbiAgICByZWNvcmRTdG9yZS5jbGVhcigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKXtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5pbXBvcnQgeyBtYWtlUmVjb3JkUGF0aH0gZnJvbSAnLi9yZWNvcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qge3N0b3JlLCBsaW5rLCBjdXJyZW50fSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3NlYXJjaC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IHNlYXJjaE9iamVjdCA9IGJ1aWxkT2JqZWN0KGh0bWwsIGRhdGFUYWcucmVtb3ZlKCdtYXRjaCcpIHx8ICdoMVtpZF0sIGgyW2lkXSwgaDNbaWRdLCBoNFtpZF0sIGg1W2lkXSwgaDZbaWRdJyk7XG5cbiAgICBpZighY3VycmVudCl7XG4gICAgICAgIHN0b3JlW2xpbmtdID0gc2VhcmNoT2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY3VycmVudC50aXRsZXMsc2VhcmNoT2JqZWN0LnRpdGxlcyk7XG5cbiAgICAgICAgaWYoIWN1cnJlbnQudGV4dC5pbmNsdWRlcyhzZWFyY2hPYmplY3QudGV4dCkpe1xuICAgICAgICAgICAgY3VycmVudC50ZXh0ICs9IHNlYXJjaE9iamVjdC50ZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZE9iamVjdChodG1sOiBzdHJpbmcsIG1hdGNoOiBzdHJpbmcpIHtcbiAgICBjb25zdCByb290ID0gcGFyc2UoaHRtbCwge1xuICAgICAgICBibG9ja1RleHRFbGVtZW50czoge1xuICAgICAgICAgICAgc2NyaXB0OiBmYWxzZSxcbiAgICAgICAgICAgIHN0eWxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vc2NyaXB0OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aXRsZXM6IFN0cmluZ01hcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChtYXRjaCkpIHtcbiAgICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmF0dHJpYnV0ZXNbJ2lkJ107XG4gICAgICAgIHRpdGxlc1tpZF0gPSBlbGVtZW50LmlubmVyVGV4dC50cmltKCk7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGVzLFxuICAgICAgICB0ZXh0OiByb290LmlubmVyVGV4dC50cmltKCkucmVwbGFjZSgvWyBcXG5dezIsfS9nLCAnICcpLnJlcGxhY2UoL1tcXG5dL2csICcgJylcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9Db21wb25lbnRzL2NsaWVudCc7XG5pbXBvcnQgc2NyaXB0IGZyb20gJy4vQ29tcG9uZW50cy9zY3JpcHQvaW5kZXgnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vQ29tcG9uZW50cy9zdHlsZS9pbmRleCc7XG5pbXBvcnQgcGFnZSBmcm9tICcuL0NvbXBvbmVudHMvcGFnZSc7XG5pbXBvcnQgaXNvbGF0ZSBmcm9tICcuL0NvbXBvbmVudHMvaXNvbGF0ZSc7XG5pbXBvcnQgc3ZlbHRlIGZyb20gJy4vQ29tcG9uZW50cy9zdmVsdGUnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJy4vQ29tcG9uZW50cy9tYXJrZG93bic7XG5pbXBvcnQgaGVhZCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRIZWFkIH0gZnJvbSAnLi9Db21wb25lbnRzL2hlYWQnO1xuaW1wb3J0IGNvbm5lY3QsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdCwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckNvbm5lY3QgfSBmcm9tICcuL0NvbXBvbmVudHMvY29ubmVjdCc7XG5pbXBvcnQgZm9ybSwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRGb3JtLCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yRm9ybSB9IGZyb20gJy4vQ29tcG9uZW50cy9mb3JtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHJlY29yZCwgeyB1cGRhdGVSZWNvcmRzLCBwZXJDb21waWxlIGFzIHBlckNvbXBpbGVSZWNvcmQsIHBvc3RDb21waWxlIGFzIHBvc3RDb21waWxlUmVjb3JkLCBkZWxldGVCZWZvcmVSZUJ1aWxkIH0gZnJvbSAnLi9Db21wb25lbnRzL3JlY29yZCc7XG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vQ29tcG9uZW50cy9zZWFyY2gnO1xuXG5leHBvcnQgY29uc3QgQWxsQnVpbGRJbiA9IFtcImNsaWVudFwiLCBcInNjcmlwdFwiLCBcInN0eWxlXCIsIFwicGFnZVwiLCBcImNvbm5lY3RcIiwgXCJpc29sYXRlXCIsIFwiZm9ybVwiLCBcImhlYWRcIiwgXCJzdmVsdGVcIiwgXCJtYXJrZG93blwiLCBcInJlY29yZFwiLCBcInNlYXJjaFwiXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgbGV0IHJlRGF0YTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PjtcblxuICAgIHN3aXRjaCAodHlwZS5lcS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgXCJjbGllbnRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNsaWVudChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyZWNvcmRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHJlY29yZCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VhcmNoXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzZWFyY2goIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2NyaXB0KCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3R5bGUoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBhZ2VcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHBhZ2UocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY29ubmVjdCh0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZvcm1cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGZvcm0ocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXNvbGF0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGhlYWQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3ZlbHRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdmVsdGUodHlwZSwgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtYXJrZG93blwiOlxuICAgICAgICAgICAgcmVEYXRhID0gbWFya2Rvd24odHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ29tcG9uZW50IGlzIG5vdCBidWlsZCB5ZXRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzSW5jbHVkZSh0YWduYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gQWxsQnVpbGRJbi5pbmNsdWRlcyh0YWduYW1lLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB1cGRhdGVSZWNvcmRzKHNlc3Npb25JbmZvKTtcblxuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZENvbm5lY3QocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRGb3JtKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKC9AQ29ubmVjdEhlcmUoOz8pL2dpLCAnJykucmVwbGFjZSgvQENvbm5lY3RIZXJlRm9ybSg7PykvZ2ksICcnKTtcblxuICAgIHBhZ2VEYXRhID0gYXdhaXQgYWRkRmluYWxpemVCdWlsZEhlYWQocGFnZURhdGEsIHNlc3Npb25JbmZvLCBmdWxsQ29tcGlsZVBhdGgpO1xuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRlbENvbm5lY3RvclNlcnZpY2UodHlwZTogc3RyaW5nLCB0aGlzUGFnZTogYW55LCBjb25uZWN0b3JBcnJheTogYW55W10pIHtcbiAgICBpZiAodHlwZSA9PSAnY29ubmVjdCcpXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JDb25uZWN0KHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gaGFuZGVsQ29ubmVjdG9yRm9ybSh0aGlzUGFnZSwgY29ubmVjdG9yQXJyYXkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZSgpIHtcbiAgICBwZXJDb21waWxlUmVjb3JkKClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlKCkge1xuICAgIHBvc3RDb21waWxlUmVjb3JkKClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKXtcbiAgICBzZXNzaW9uSW5mby5kZWJ1ZyAmJiBkZWxldGVCZWZvcmVSZUJ1aWxkKHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIFxufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgUGFyc2VEZWJ1Z0luZm8sIENyZWF0ZUZpbGVQYXRoLCBQYXRoVHlwZXMsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEFsbEJ1aWxkSW4sIElzSW5jbHVkZSwgU3RhcnRDb21waWxpbmcgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8sIEFycmF5TWF0Y2ggfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIHRhZ0RhdGFPYmplY3RBc1RleHQsIENvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmludGVyZmFjZSBEZWZhdWx0VmFsdWVzIHtcbiAgICB2YWx1ZTogU3RyaW5nVHJhY2tlcixcbiAgICBlbGVtZW50czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50IGV4dGVuZHMgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgcHVibGljIGRpckZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBQbHVnaW5CdWlsZDogQWRkUGx1Z2luO1xuICAgIHB1YmxpYyBDb21waWxlSW5GaWxlOiBDb21waWxlSW5GaWxlRnVuYztcbiAgICBwdWJsaWMgTWljcm9QbHVnaW5zOiBTdHJpbmdBcnJheU9yT2JqZWN0O1xuICAgIHB1YmxpYyBHZXRQbHVnaW46IChuYW1lOiBzdHJpbmcpID0+IGFueTtcbiAgICBwdWJsaWMgU29tZVBsdWdpbnM6ICguLi5uYW1lczogc3RyaW5nW10pID0+IGJvb2xlYW47XG4gICAgcHVibGljIGlzVHM6ICgpID0+IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIHJlZ2V4U2VhcmNoOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3RvcihQbHVnaW5CdWlsZDogQWRkUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGlyRm9sZGVyID0gJ0NvbXBvbmVudHMnO1xuICAgICAgICB0aGlzLlBsdWdpbkJ1aWxkID0gUGx1Z2luQnVpbGQ7XG4gICAgICAgIHRoaXMucmVnZXhTZWFyY2ggPSBuZXcgUmVnRXhwKGA8KFtcXFxccHtMdX1fXFxcXC06MC05XXwke0FsbEJ1aWxkSW4uam9pbignfCcpfSlgLCAndScpXG4gICAgfVxuXG4gICAgRmluZFNwZWNpYWxUYWdCeVN0YXJ0KHN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlNraXBTcGVjaWFsVGFnKSB7XG4gICAgICAgICAgICBpZiAoc3RyaW5nLnN1YnN0cmluZygwLCBpWzBdLmxlbmd0aCkgPT0gaVswXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXQgdGFrZXMgYSBzdHJpbmcgb2YgSFRNTCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlLFxuICAgICAqIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLCBhbmQgdGhlIGNoYXJhY3RlciB0aGF0IGNvbWVzIGFmdGVyIHRoZSBhdHRyaWJ1dGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IHRleHQgLSBUaGUgdGV4dCB0byBwYXJzZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICAgICAqL1xuICAgIHRhZ0RhdGEodGV4dDogU3RyaW5nVHJhY2tlcik6IHsgZGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBtYXBBdHRyaWJ1dGVzOiBTdHJpbmdBbnlNYXAgfSB7XG4gICAgICAgIGNvbnN0IHRva2VuQXJyYXkgPSBbXSwgYTogdGFnRGF0YU9iamVjdEFycmF5ID0gW10sIG1hcEF0dHJpYnV0ZXM6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgICAgIHRleHQgPSB0ZXh0LnRyaW0oKS5yZXBsYWNlcigvKDwlKShbXFx3XFxXXSs/KSglPikvLCBkYXRhID0+IHtcbiAgICAgICAgICAgIHRva2VuQXJyYXkucHVzaChkYXRhWzJdKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhWzFdLlBsdXMoZGF0YVszXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHVuVG9rZW4gPSAodGV4dDogU3RyaW5nVHJhY2tlcikgPT4gdGV4dC5yZXBsYWNlcigvKDwlKSglPikvLCAoZGF0YSkgPT4gZGF0YVsxXS5QbHVzKHRva2VuQXJyYXkuc2hpZnQoKSkuUGx1cyhkYXRhWzJdKSlcblxuICAgICAgICBsZXQgZmFzdFRleHQgPSB0ZXh0LmVxO1xuICAgICAgICBjb25zdCBTa2lwVHlwZXMgPSBbJ1wiJywgXCInXCIsICdgJ10sIEJsb2NrVHlwZXMgPSBbXG4gICAgICAgICAgICBbJ3snLCAnfSddLFxuICAgICAgICAgICAgWycoJywgJyknXVxuICAgICAgICBdO1xuXG4gICAgICAgIHdoaWxlIChmYXN0VGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgZmFzdFRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyID0gZmFzdFRleHQuY2hhckF0KGkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFyID09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dENoYXIgPSB0ZXh0LmF0KGkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dENoYXJFcSA9IG5leHRDaGFyLmVxLCBhdHRyTmFtZSA9IHRleHQuc3Vic3RyaW5nKDAsIGkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZTogU3RyaW5nVHJhY2tlciwgZW5kSW5kZXg6IG51bWJlciwgYmxvY2tFbmQ6IHN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNraXBUeXBlcy5pbmNsdWRlcyhuZXh0Q2hhckVxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEoZmFzdFRleHQuc3Vic3RyaW5nKGkgKyAyKSwgbmV4dENoYXJFcSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0ZXh0LnN1YnN0cihpICsgMiwgZW5kSW5kZXggLSAyKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChibG9ja0VuZCA9IEJsb2NrVHlwZXMuZmluZCh4ID0+IHhbMF0gPT0gbmV4dENoYXJFcSk/LlsxXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihmYXN0VGV4dC5zdWJzdHJpbmcoaSArIDIpLCBbbmV4dENoYXJFcSwgYmxvY2tFbmRdKSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRleHQuc3Vic3RyKGkgKyAxLCBlbmRJbmRleCArIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGZhc3RUZXh0LnN1YnN0cmluZyhpICsgMSkuc2VhcmNoKC8gfFxcbi8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gZmFzdFRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0ZXh0LnN1YnN0cihpICsgMSwgZW5kSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dENoYXIgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHVuVG9rZW4oYXR0ck5hbWUpLCB2ID0gdW5Ub2tlbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcEF0dHJpYnV0ZXNbbi5lcV0gPSB2LmVxO1xuICAgICAgICAgICAgICAgICAgICBhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHYsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyOiBuZXh0Q2hhclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxICsgZW5kSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGFyID09ICcgJyB8fCBpID09IGZhc3RUZXh0Lmxlbmd0aCAtIDEgJiYgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSB1blRva2VuKHRleHQuc3Vic3RyaW5nKDAsIGkpKTtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG46IG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcEF0dHJpYnV0ZXNbbi5lcV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmFzdFRleHQgPSBmYXN0VGV4dC5zdWJzdHJpbmcoaSkudHJpbSgpO1xuICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKGkpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vbWV0aG9kcyB0byB0aGUgYXJyYXlcbiAgICAgICAgY29uc3QgaW5kZXggPSAobmFtZTogc3RyaW5nKSA9PiBhLmZpbmRJbmRleCh4ID0+IHgubi5lcSA9PSBuYW1lKTtcbiAgICAgICAgY29uc3QgZ2V0VmFsdWUgPSAobmFtZTogc3RyaW5nKSA9PiBhLmZpbmQodGFnID0+IHRhZy5uLmVxID09IG5hbWUpPy52Py5lcSA/PyAnJztcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmFtZUluZGV4ID0gaW5kZXgobmFtZSk7XG4gICAgICAgICAgICBpZiAobmFtZUluZGV4ID09IC0xKVxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIHJldHVybiBhLnNwbGljZShuYW1lSW5kZXgsIDEpLnBvcCgpLnY/LmVxID8/ICcnO1xuICAgICAgICB9O1xuXG4gICAgICAgIGEuaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IGluZGV4KG5hbWUpICE9IC0xO1xuICAgICAgICBhLmdldFZhbHVlID0gZ2V0VmFsdWU7XG4gICAgICAgIGEucmVtb3ZlID0gcmVtb3ZlO1xuICAgICAgICBhLmFkZENsYXNzID0gYyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gaW5kZXgoJ2NsYXNzJyk7XG4gICAgICAgICAgICBpZiAoaSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGEucHVzaCh7IG46IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdjbGFzcycpLCB2OiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjKSwgY2hhcjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ1wiJykgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFbaV07XG4gICAgICAgICAgICBpZiAoaXRlbS52Lmxlbmd0aClcbiAgICAgICAgICAgICAgICBjID0gJyAnICsgYztcbiAgICAgICAgICAgIGl0ZW0udi5BZGRUZXh0QWZ0ZXIoYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZGF0YTogYSwgbWFwQXR0cmlidXRlcyB9O1xuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgUmVCdWlsZFRhZ0RhdGEoc3RyaW5nSW5mbzogU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBkYXRhVGFnU3BsaXR0ZXI6IHRhZ0RhdGFPYmplY3RBcnJheSkge1xuICAgICAgICBsZXQgbmV3QXR0cmlidXRlcyA9IG5ldyBTdHJpbmdUcmFja2VyKHN0cmluZ0luZm8pO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhVGFnU3BsaXR0ZXIpIHtcbiAgICAgICAgICAgIGlmIChpLnYpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMkYCR7aS5ufT0ke2kuY2hhcn0ke2kudn0ke2kuY2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzKGkubiwgJyAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhVGFnU3BsaXR0ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoc3RyaW5nSW5mbywgJyAnKS5QbHVzKG5ld0F0dHJpYnV0ZXMuc3Vic3RyaW5nKDAsIG5ld0F0dHJpYnV0ZXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0F0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIFNlbmREYXRhRnVuYzogKHRleHQ6IFN0cmluZ1RyYWNrZXIpID0+IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pIHtcbiAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhICYmIHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhLlNwYWNlT25lKCcgJyk7XG5cbiAgICAgICAgICAgIGRhdGFUYWcgPSB0aGlzLlJlQnVpbGRUYWdEYXRhKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnU3BsaWNlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIGNvbXBvbmVudDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBsZXQgeyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH0gPSB0aGlzLmV4cG9ydERlZmF1bHRWYWx1ZXMoY29tcG9uZW50KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGFnRGF0YSkge1xuICAgICAgICAgICAgaWYgKGkubi5lcSA9PSAnJicpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmUgPSBpLm4uc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IEZvdW5kSW5kZXg6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIGlmIChyZS5pbmNsdWRlcygnJicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcmUuaW5kZXhPZignJicpO1xuICAgICAgICAgICAgICAgICAgICBGb3VuZEluZGV4ID0gdGhpcy5maW5kSW5kZXhTZWFyY2hUYWcocmUuc3Vic3RyaW5nKDAsIGluZGV4KS5lcSwgZmlsZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZSA9IHJlLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEZvdW5kSW5kZXggPSBmaWxlRGF0YS5zZWFyY2goL1xcIHxcXD4vKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVEYXRhTmV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGZpbGVEYXRhLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydERhdGEgPSBmaWxlRGF0YS5zdWJzdHJpbmcoMCwgRm91bmRJbmRleCk7XG4gICAgICAgICAgICAgICAgZmlsZURhdGFOZXh0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIoZmlsZURhdGEuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGAgJHtyZX09XCIke2kudiA/PyAnJ31cImAsXG4gICAgICAgICAgICAgICAgICAgIChzdGFydERhdGEuZW5kc1dpdGgoJyAnKSA/ICcnIDogJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZURhdGEuc3Vic3RyaW5nKEZvdW5kSW5kZXgpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGFOZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoXCJcXFxcflwiICsgaS5uLmVxLCBcImdpXCIpO1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZShyZSwgaS52ID8/IGkubik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5hZGREZWZhdWx0VmFsdWVzKGZvdW5kU2V0dGVycywgZmlsZURhdGEpO1xuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkVGFnQmFzaWMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIHRhZ0RhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIG1hcEF0dHJpYnV0ZXM6IFN0cmluZ0FueU1hcCwgdHlwZTogU3RyaW5nVHJhY2tlciwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpe1xuICAgICAgICBjb25zdCBhZGRBdHRyID0gKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBkYXRhLnB1c2goe246IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGtleSksIHY6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIHZhbHVlKX0pO1xuICAgICAgICAgICAgbWFwQXR0cmlidXRlc1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbXBvcnRTb3VyY2UgPSAnLycgKyB0eXBlLmV4dHJhY3RJbmZvKCk7XG4gICAgICAgIGFkZEF0dHIoJ2ltcG9ydFNvdXJjZScsIGltcG9ydFNvdXJjZSk7XG4gICAgICAgIGFkZEF0dHIoJ2ltcG9ydFNvdXJjZURpcmVjdG9yeScsIHBhdGguZGlybmFtZShpbXBvcnRTb3VyY2UpKTtcbiAgICAgICAgbWFwQXR0cmlidXRlcy5yZWFkZXIgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlcn0pIHtcbiAgICAgICAgY29uc3QgeyBkYXRhLCBtYXBBdHRyaWJ1dGVzIH0gPSB0aGlzLnRhZ0RhdGEoZGF0YVRhZyksIEJ1aWxkSW4gPSBJc0luY2x1ZGUodHlwZS5lcSk7XG5cbiAgICAgICAgbGV0IGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCBTZWFyY2hJbkNvbW1lbnQgPSB0cnVlLCBBbGxQYXRoVHlwZXM6IFBhdGhUeXBlcyA9IHt9LCBhZGRTdHJpbmdJbmZvOiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKEJ1aWxkSW4pIHsvL2NoZWNrIGlmIGl0IGJ1aWxkIGluIGNvbXBvbmVudFxuICAgICAgICAgICAgY29uc3QgeyBjb21waWxlZFN0cmluZywgY2hlY2tDb21wb25lbnRzIH0gPSBhd2FpdCBTdGFydENvbXBpbGluZyggcGF0aE5hbWUsIHR5cGUsIGRhdGEsIEJldHdlZW5UYWdEYXRhID8/IG5ldyBTdHJpbmdUcmFja2VyKCksIHRoaXMsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGZpbGVEYXRhID0gY29tcGlsZWRTdHJpbmc7XG4gICAgICAgICAgICBTZWFyY2hJbkNvbW1lbnQgPSBjaGVja0NvbXBvbmVudHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZm9sZGVyOiBib29sZWFuIHwgc3RyaW5nID0gZGF0YS5oYXZlKCdmb2xkZXInKTtcblxuICAgICAgICAgICAgaWYgKGZvbGRlcilcbiAgICAgICAgICAgICAgICBmb2xkZXIgPSBkYXRhLnJlbW92ZSgnZm9sZGVyJykgfHwgJy4nO1xuXG4gICAgICAgICAgICBjb25zdCB0YWdQYXRoID0gKGZvbGRlciA/IGZvbGRlciArICcvJyA6ICcnKSArIHR5cGUucmVwbGFjZSgvOi9naSwgXCIvXCIpLmVxO1xuXG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZXNGaWxlUGF0aFNtYWxsID0gdHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JyksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5SZUJ1aWxkVGFnKHR5cGUsIGRhdGFUYWcsIGRhdGEsIEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSA9PiB0aGlzLlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0/Lm10aW1lTXMpXG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSB7IG10aW1lTXM6IGF3YWl0IEVhc3lGcy5zdGF0KEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgJ210aW1lTXMnKSB9OyAvLyBhZGQgdG8gZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgICAgICAgICBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXNbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXS5tdGltZU1zXG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWxsRGF0YSwgc3RyaW5nSW5mbyB9ID0gYXdhaXQgQWRkRGVidWdJbmZvKHRydWUsIHBhdGhOYW1lLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2UoYWxsRGF0YSwgdGhpcy5pc1RzKCkpO1xuXG4gICAgICAgICAgICAvKmFkZCBzcGVjaWFsIGF0dHJpYnV0ZXMgKi9cbiAgICAgICAgICAgIEluc2VydENvbXBvbmVudC5hZGRTcGFjaWFsQXR0cmlidXRlcyhkYXRhLCBtYXBBdHRyaWJ1dGVzLCB0eXBlLCBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbywgQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCBwYXRoTmFtZSArICcgLT4gJyArIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIG1hcEF0dHJpYnV0ZXMpO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQgKyAxLCBmaW5kRW5kT2ZTbWFsbFRhZyk7XG5cbiAgICAgICAgICAgIGNvbnN0IE5leHRUZXh0VGFnID0gc3RhcnRGcm9tLnN1YnN0cmluZyhmaW5kRW5kT2ZTbWFsbFRhZyArIDEpO1xuXG4gICAgICAgICAgICBpZiAoaW5UYWcuYXQoaW5UYWcubGVuZ3RoIC0gMSkuZXEgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgaW5UYWcgPSBpblRhZy5zdWJzdHJpbmcoMCwgaW5UYWcubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGFydEZyb20uYXQoZmluZEVuZE9mU21hbGxUYWcgLSAxKS5lcSA9PSAnLycpIHsvL3NtYWxsIHRhZ1xuICAgICAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydFRhZ0RhdGEocGF0aE5hbWUsIHRhZ1R5cGUsIGluVGFnLCB7ICBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gTmV4dFRleHRUYWc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYmlnIHRhZyB3aXRoIHJlYWRlclxuICAgICAgICAgICAgbGV0IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU2ltcGxlU2tpcC5pbmNsdWRlcyh0YWdUeXBlLmVxKSkge1xuICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IE5leHRUZXh0VGFnLmluZGV4T2YoJzwvJyArIHRhZ1R5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBhd2FpdCB0aGlzLkZpbmRDbG9zZUNoYXJIVE1MKE5leHRUZXh0VGFnLCB0YWdUeXBlLmVxKTtcbiAgICAgICAgICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7dGFnVHlwZX1cIiwgdXNlZCBpbjogJHt0YWdUeXBlLmF0KDApLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNsb3NlLXRhZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEJldHdlZW5UYWdEYXRhID0gQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ICE9IG51bGwgJiYgTmV4dFRleHRUYWcuc3Vic3RyaW5nKDAsIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIC8vZmluZGluZyBsYXN0IGNsb3NlIFxuICAgICAgICAgICAgY29uc3QgTmV4dERhdGFDbG9zZSA9IE5leHRUZXh0VGFnLnN1YnN0cmluZyhCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgTmV4dERhdGFBZnRlckNsb3NlID0gQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ICE9IG51bGwgPyBOZXh0RGF0YUNsb3NlLnN1YnN0cmluZyhCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihOZXh0RGF0YUNsb3NlLmVxLCAnPicpICsgMSkgOiBOZXh0RGF0YUNsb3NlOyAvLyBzZWFyY2ggZm9yIHRoZSBjbG9zZSBvZiBhIGJpZyB0YWcganVzdCBpZiB0aGUgdGFnIGlzIHZhbGlkXG5cbiAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKFxuICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRUYWdEYXRhKHBhdGhOYW1lLCB0YWdUeXBlLCBpblRhZywgeyBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGRhdGEgPSBOZXh0RGF0YUFmdGVyQ2xvc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCB0ZXh0QnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihkYXRhLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHByb21pc2VCdWlsZCkge1xuICAgICAgICAgICAgdGV4dEJ1aWxkID0gdGhpcy5DaGVja0RvdWJsZVNwYWNlKHRleHRCdWlsZCwgYXdhaXQgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DaGVja01pbkhUTUwodGhpcy5DaGVja0RvdWJsZVNwYWNlKHRleHRCdWlsZCwgZGF0YSkpO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZW1vdmVVbm5lY2Vzc2FyeVNwYWNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29kZSA9IGNvZGUudHJpbSgpO1xuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlQWxsKC8lPlsgXSs8JSg/IVs9Ol0pLywgJyU+PCUnKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgYXN5bmMgSW5zZXJ0KGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICAvL3JlbW92aW5nIGh0bWwgY29tbWVudCB0YWdzXG4gICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoLzwhLS1bXFx3XFxXXSs/LS0+LywgJycpO1xuXG4gICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLlN0YXJ0UmVwbGFjZShkYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgICAgIC8vaWYgdGhlcmUgaXMgYSByZWFkZXIsIHJlcGxhY2luZyBoaW0gd2l0aCAnY29kZWJhc2UnXG4gICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoLzxcXDpyZWFkZXIrKCApKlxcLz4vZ2ksICc8JXR5cGVvZiBwYWdlLmNvZGViYXNlID09IFwiZnVuY3Rpb25cIiA/IHBhZ2UuY29kZWJhc2UoKTogd3JpdGUocGFnZS5jb2RlYmFzZSklPicpIC8vIHJlcGxhY2UgZm9yIGltcG9ydGluZyBwYWdlcyAvIGNvbXBvbmVudHNcbiAgICAgICAgcmV0dXJuIHRoaXMuUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShkYXRhKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuZnVuY3Rpb24gdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBsZXQgYSA9IFwiXCI7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTQpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gc2VhcmNoRm9yQ3V0TWFpbihkYXRhOiBTdHJpbmdUcmFja2VyLCBhcnJheTpzdHJpbmdbXSwgc2luZzpzdHJpbmcsIGJpZ1RhZz86Ym9vbGVhbiwgc2VhcmNoRm9yPzpib29sZWFuKTogU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBsZXQgb3V0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGUgb2YgYXJyYXkpIHtcbiAgICAgICAgb3V0ICs9IHVuaWNvZGVNZShzaW5nKSArIGUgKyBcInxcIjtcbiAgICB9XG4gICAgb3V0ID0gb3V0LnN1YnN0cmluZygwLCBvdXQubGVuZ3RoIC0gMSk7XG4gICAgb3V0ID0gYDwoJHtvdXR9KSR7c2VhcmNoRm9yID8gXCIoW1xcXFxwe0x9MC05X1xcXFwtXFxcXC5dKylcIjogXCJcIn0oXFxcXHUwMDIwKSpcXFxcdTAwMkY/PmBcbiAgICByZXR1cm4gc2VhcmNoRm9yQ3V0KGRhdGEsIG5ldyBSZWdFeHAob3V0LCAndScpLCBzaW5nLCBiaWdUYWcpXG59XG5cbmZ1bmN0aW9uIG91dFRhZ05hbWUoZGF0YTogc3RyaW5nKSB7XG4gICAgY29uc3QgZW5kID0gZGF0YS5pbmRleE9mKFwiPlwiKTtcbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICB3aGlsZSAoZGF0YS5lbmRzV2l0aChcIiBcIikgfHwgZGF0YS5lbmRzV2l0aChcIi9cIikpIHtcbiAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGRhdGEubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuXG5pbnRlcmZhY2UgU2VhcmNoQ3V0RGF0YSB7XG4gICAgdGFnOiBzdHJpbmcsXG4gICAgZGF0YTogU3RyaW5nVHJhY2tlcixcbiAgICBsb2M6IG51bWJlcixcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dE91dHB1dCB7XG4gICAgZGF0YT86IFN0cmluZ1RyYWNrZXIsXG4gICAgZXJyb3I/OiBib29sZWFuLFxuICAgIGZvdW5kPzogU2VhcmNoQ3V0RGF0YVtdXG59XG5cbi8qKlxuICogSXQgc2VhcmNoZXMgZm9yIGEgc3BlY2lmaWMgdGFnIGFuZCByZXR1cm5zIHRoZSBkYXRhIGluc2lkZSBvZiBpdC5cbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gZGF0YSAtIFRoZSBzdHJpbmcgeW91IHdhbnQgdG8gc2VhcmNoIHRocm91Z2guXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZmluZEFycmF5IC0gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHNpbmcgLSBUaGUgc3RyaW5nIHRoYXQgeW91IHdhbnQgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSBbYmlnVGFnPXRydWVdIC0gSWYgdHJ1ZSwgdGhlIGZ1bmN0aW9uIHdpbGwgc2VhcmNoIGZvciB0aGUgZW5kIG9mIHRoZSB0YWcuIElmIGZhbHNlLCBpdCB3aWxsXG4gKiBzZWFyY2ggZm9yIHRoZSBuZXh0IGluc3RhbmNlIG9mIHRoZSB0YWcuXG4gKiBAcGFyYW0gb3V0cHV0IC0gVGhlIG91dHB1dCBvZiB0aGUgc2VhcmNoLlxuICogQHBhcmFtIHtTZWFyY2hDdXREYXRhW119IHJldHVybkFycmF5IC0gQW4gYXJyYXkgb2Ygb2JqZWN0cyB0aGF0IGNvbnRhaW4gdGhlIHRhZyBuYW1lLCB0aGUgZGF0YVxuICogaW5zaWRlIHRoZSB0YWcsIGFuZCB0aGUgbG9jYXRpb24gb2YgdGhlIHRhZyBpbiB0aGUgb3JpZ2luYWwgc3RyaW5nLlxuICogQHJldHVybnMgQSBzdHJpbmcgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQsIGFuZCBhbiBhcnJheSBvZiB0aGUgZGF0YSB0aGF0IHdhcyBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gc2VhcmNoRm9yQ3V0KGRhdGE6U3RyaW5nVHJhY2tlciwgZmluZEFycmF5OlJlZ0V4cCwgc2luZzpzdHJpbmcsIGJpZ1RhZyA9IHRydWUsIG91dHB1dCA9IG5ldyBTdHJpbmdUcmFja2VyKCksIHJldHVybkFycmF5OiBTZWFyY2hDdXREYXRhW10gPSBbXSk6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgY29uc3QgZGF0YUNvcHkgPSBkYXRhO1xuICAgIGNvbnN0IGJlID0gZGF0YS5zZWFyY2goZmluZEFycmF5KTtcbiAgICBpZiAoYmUgPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGE6IG91dHB1dC5QbHVzKGRhdGEpLCBmb3VuZDogcmV0dXJuQXJyYXlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvdXRwdXQuUGx1cyhkYXRhLnN1YnN0cmluZygwLCBiZSkpO1xuXG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGJlICsgMSk7XG5cbiAgICBjb25zdCB0YWcgPSBvdXRUYWdOYW1lKGRhdGEuZXEpO1xuXG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuXG4gICAgbGV0IGluVGFnRGF0YTtcblxuICAgIGlmIChiaWdUYWcpIHtcbiAgICAgICAgY29uc3QgZW5kID0gZmluZEVuZChbXCI8XCIgKyB0YWcsIFwiPC9cIiArIHRhZ10sIGRhdGEpO1xuICAgICAgICBpZiAoZW5kICE9IC0xKSB7XG4gICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGVuZCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZFN0YXJ0KFwiPlwiLCBkYXRhKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmaW5kTmV4dCA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgICAgICAgICBpZiAoZmluZE5leHQgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZmluZE5leHQpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kTmV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm5BcnJheS5wdXNoKHtcbiAgICAgICAgdGFnOiB0YWcsXG4gICAgICAgIGRhdGE6IGluVGFnRGF0YSxcbiAgICAgICAgbG9jOiBiZVxuICAgIH0pO1xuXG4gICAgaWYgKGRhdGFDb3B5ID09IGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VhcmNoRm9yQ3V0KGRhdGEsIGZpbmRBcnJheSwgc2luZywgYmlnVGFnLCBvdXRwdXQsIHJldHVybkFycmF5KTtcbn1cblxuZnVuY3Rpb24gZmluZFN0YXJ0KHR5cGU6c3RyaW5nLCBkYXRhOlN0cmluZ1RyYWNrZXIpIHtcbiAgICByZXR1cm4gZGF0YS5pbmRleE9mKHR5cGUpICsgdHlwZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGZpbmRFbmQodHlwZXM6IHN0cmluZ1tdLCBkYXRhOlN0cmluZ1RyYWNrZXIpIHtcblxuICAgIGxldCBfMCA9IGRhdGEuaW5kZXhPZih0eXBlc1swXSk7XG5cbiAgICBjb25zdCBfMSA9IGRhdGEuaW5kZXhPZih0eXBlc1sxXSk7XG5cbiAgICBpZiAoXzEgPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChfMCA8IF8xICYmIF8wICE9IC0xKSB7XG4gICAgICAgIF8wKys7XG4gICAgICAgIGNvbnN0IG5leHQgPSBfMCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKF8wKSkgKyB0eXBlc1swXS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBuZXh0ICsgZmluZEVuZCh0eXBlcywgZGF0YS5zdWJzdHJpbmcobmV4dCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF8xO1xuICAgIH1cbn1cblxuXG5leHBvcnQge1xuICAgIHNlYXJjaEZvckN1dE1haW4gYXMgZ2V0RGF0YVRhZ2VzXG59XG4iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgZ2V0RGF0YVRhZ2VzIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvRXh0cmljYXRlXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ051bWJlck1hcCB9IGZyb20gJy4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEFkZERlYnVnSW5mbyB9IGZyb20gJy4uL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgQ1J1blRpbWUgZnJvbSBcIi4vQ29tcGlsZVwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uL1Nlc3Npb25cIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0ge2RlZmluZToge319O1xuXG5jb25zdCBzdHJpbmdBdHRyaWJ1dGVzID0gWydcXCcnLCAnXCInLCAnYCddO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB9W10gPSBbXVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2RlPzogU3RyaW5nVHJhY2tlciwgcHVibGljIGlzVHM/OiBib29sZWFuKSB7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHBhZ2VQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGNvbnN0IHJ1biA9IG5ldyBDUnVuVGltZSh0aGlzLmNvZGUsIHNlc3Npb25JbmZvLCBzbWFsbFBhdGgsIHRoaXMuaXNUcyk7XG4gICAgICAgIHRoaXMuY29kZSA9IGF3YWl0IHJ1bi5jb21waWxlKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHRoaXMucGFyc2VCYXNlKHRoaXMuY29kZSk7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZENvZGVGaWxlKHBhZ2VQYXRoLCBzbWFsbFBhdGgsIHRoaXMuaXNUcywgc2Vzc2lvbkluZm8sIHBhZ2VOYW1lKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9hZERlZmluZSh7Li4uc2V0dGluZ3MuZGVmaW5lLCAuLi5ydW4uZGVmaW5lfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZUJhc2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgZGF0YVNwbGl0OiBTdHJpbmdUcmFja2VyO1xuXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VyKC9AXFxbWyBdKigoW0EtWmEtel9dW0EtWmEtel8wLTldKj0oKFwiW15cIl0qXCIpfChgW15gXSpgKXwoJ1teJ10qJyl8W0EtWmEtejAtOV9dKykoWyBdKiw/WyBdKik/KSopXFxdLywgZGF0YSA9PiB7XG4gICAgICAgICAgICBkYXRhU3BsaXQgPSBkYXRhWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3aGlsZSAoZGF0YVNwbGl0Py5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmRXb3JkID0gZGF0YVNwbGl0LmluZGV4T2YoJz0nKTtcblxuICAgICAgICAgICAgbGV0IHRoaXNXb3JkID0gZGF0YVNwbGl0LnN1YnN0cmluZygwLCBmaW5kV29yZCkudHJpbSgpLmVxO1xuXG4gICAgICAgICAgICBpZiAodGhpc1dvcmRbMF0gPT0gJywnKVxuICAgICAgICAgICAgICAgIHRoaXNXb3JkID0gdGhpc1dvcmQuc3Vic3RyaW5nKDEpLnRyaW0oKTtcblxuICAgICAgICAgICAgbGV0IG5leHRWYWx1ZSA9IGRhdGFTcGxpdC5zdWJzdHJpbmcoZmluZFdvcmQgKyAxKTtcblxuICAgICAgICAgICAgbGV0IHRoaXNWYWx1ZTogU3RyaW5nVHJhY2tlcjtcblxuICAgICAgICAgICAgY29uc3QgY2xvc2VDaGFyID0gbmV4dFZhbHVlLmF0KDApLmVxO1xuICAgICAgICAgICAgaWYgKHN0cmluZ0F0dHJpYnV0ZXMuaW5jbHVkZXMoY2xvc2VDaGFyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKG5leHRWYWx1ZS5lcS5zdWJzdHJpbmcoMSksIGNsb3NlQ2hhcik7XG4gICAgICAgICAgICAgICAgdGhpc1ZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZygxLCBlbmRJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSkudHJpbSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IG5leHRWYWx1ZS5zZWFyY2goL1tfICxdLyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZW5kSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1ZhbHVlID0gbmV4dFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1ZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZygwLCBlbmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoZW5kSW5kZXgpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGFTcGxpdCA9IG5leHRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVBcnJheS5wdXNoKHsga2V5OiB0aGlzV29yZCwgdmFsdWU6IHRoaXNWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gY29kZS50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGQoKSB7XG4gICAgICAgIGlmKCF0aGlzLnZhbHVlQXJyYXkubGVuZ3RoKSByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnQFsnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9PVwiJHt2YWx1ZS5yZXBsYWNlQWxsKCdcIicsICdcXFxcXCInKX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgYnVpbGQuUGx1cyhcIl1cIikuUGx1cyh0aGlzLmNsZWFyRGF0YSk7XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYnVpbGQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoY29kZTogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgcGFyc2UucGFyc2VCYXNlKGNvZGUpO1xuXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwYXJzZS5ieVZhbHVlKCdpbmhlcml0JykpIHtcbiAgICAgICAgICAgIHBhcnNlLnBvcChuYW1lKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhgPEAke25hbWV9Pjw6JHtuYW1lfS8+PC9AJHtuYW1lfT5gKVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgIHJldHVybiBwYXJzZS5jbGVhckRhdGEuUGx1cyhidWlsZCk7XG4gICAgfVxuXG4gICAgZ2V0KG5hbWU6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3AobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleSA9PT0gbmFtZSksIDEpWzBdPy52YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BBbnkobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmVOYW1lID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LnRvTG93ZXJDYXNlKCkgPT0gbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhdmVOYW1lICE9IC0xKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaGF2ZU5hbWUsIDEpWzBdLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFzVGFnID0gZ2V0RGF0YVRhZ2VzKHRoaXMuY2xlYXJEYXRhLCBbbmFtZV0sICdAJyk7XG5cbiAgICAgICAgaWYgKCFhc1RhZy5mb3VuZFswXSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYXNUYWcuZGF0YTtcblxuICAgICAgICByZXR1cm4gYXNUYWcuZm91bmRbMF0uZGF0YS50cmltKCk7XG4gICAgfVxuXG4gICAgYnlWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmlsdGVyKHggPT4geC52YWx1ZS5lcSA9PT0gdmFsdWUpLm1hcCh4ID0+IHgua2V5KVxuICAgIH1cblxuICAgIHJlcGxhY2VWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKVxuICAgICAgICBpZiAoaGF2ZSkgaGF2ZS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbG9hZENvZGVGaWxlKHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VTbWFsbFBhdGg6IHN0cmluZywgaXNUczogYm9vbGVhbiwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgcGFnZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgaGF2ZUNvZGUgPSB0aGlzLnBvcEFueSgnY29kZWZpbGUnKT8uZXE7XG4gICAgICAgIGlmICghaGF2ZUNvZGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsYW5nID0gdGhpcy5wb3BBbnkoJ2xhbmcnKT8uZXE7XG4gICAgICAgIGlmIChoYXZlQ29kZS50b0xvd2VyQ2FzZSgpID09ICdpbmhlcml0JylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGFnZVBhdGg7XG5cbiAgICAgICAgY29uc3QgaGF2ZUV4dCA9IHBhdGguZXh0bmFtZShoYXZlQ29kZSkuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgIGlmICghWydqcycsICd0cyddLmluY2x1ZGVzKGhhdmVFeHQpKSB7XG4gICAgICAgICAgICBpZiAoLyhcXFxcfFxcLykkLy50ZXN0KGhhdmVDb2RlKSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYWdlUGF0aC5zcGxpdCgnLycpLnBvcCgpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIUJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMoaGF2ZUV4dCkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGF0aC5leHRuYW1lKHBhZ2VQYXRoKTtcbiAgICAgICAgICAgIGhhdmVDb2RlICs9ICcuJyArIChsYW5nID8gbGFuZyA6IGlzVHMgPyAndHMnIDogJ2pzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGF2ZUNvZGVbMF0gPT0gJy4nKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHBhZ2VQYXRoKSwgaGF2ZUNvZGUpXG5cbiAgICAgICAgY29uc3QgU21hbGxQYXRoID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShoYXZlQ29kZSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsaGF2ZUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKGZhbHNlLCBwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IGJhc2VNb2RlbERhdGEuYWxsRGF0YS5yZXBsYWNlQWxsKFwiQFwiLCBcIkBAXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soJzwlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEFmdGVyTm9UcmFjaygnJT4nKTtcbiAgICAgICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgaWQ6IFNtYWxsUGF0aCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvZGVGaWxlTm90Rm91bmQnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5Db2RlIGZpbGUgbm90IGZvdW5kOiAke3BhZ2VQYXRofTxsaW5lPiR7U21hbGxQYXRofWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKHBhZ2VOYW1lLCBgPCU9XCI8cCBzdHlsZT1cXFxcXCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1xcXFxcIj5Db2RlIEZpbGUgTm90IEZvdW5kOiAnJHtwYWdlU21hbGxQYXRofScgLT4gJyR7U21hbGxQYXRofSc8L3A+XCIlPmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyfHN0cmluZylbXVtdID0gT2JqZWN0LmVudHJpZXMobW9yZURlZmluZSk7XG4gICAgICAgIHdoaWxlIChsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlcy51bnNoaWZ0KGxhc3RWYWx1ZSk7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IHRoaXMuY2xlYXJEYXRhLnJlcGxhY2VBbGwoYDoke25hbWV9OmAsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGNvbXBpbGVJbXBvcnQgfSBmcm9tIFwiLi4vLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IENvbnZlcnRTeW50YXhNaW5pIH0gZnJvbSBcIi4uLy4uL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4XCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSBcIi4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENSdW5UaW1lIHtcbiAgICBkZWZpbmUgPSB7fVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzY3JpcHQ6IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBpc1RzOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHRlbXBsYXRlU2NyaXB0KHNjcmlwdHM6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBfX3dyaXRlID0ge3RleHQ6ICcnfTtcbiAgICAgICAgICAgIF9fd3JpdGVBcnJheS5wdXNoKF9fd3JpdGUpO2ApXG4gICAgICAgICAgICBidWlsZC5QbHVzKGkpXG4gICAgICAgIH1cblxuICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGByZXR1cm4gX193cml0ZUFycmF5YCk7XG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ldGhvZHMoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBfX2xvY2FscGF0aCA9ICcvJyArIHNtYWxsUGF0aFRvUGFnZSh0aGlzLnNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHJpbmc6ICdzY3JpcHQsc3R5bGUsZGVmaW5lLHN0b3JlLHBhZ2VfX2ZpbGVuYW1lLHBhZ2VfX2Rpcm5hbWUsX19sb2NhbHBhdGgsYXR0cmlidXRlcycsXG4gICAgICAgICAgICBmdW5jczogW1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc2NyaXB0LmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zdHlsZS5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kZWZpbmVbU3RyaW5nKGtleSldID0gdmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jb21waWxlUnVuVGltZVN0b3JlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgpLFxuICAgICAgICAgICAgICAgIF9fbG9jYWxwYXRoLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZENvZGUocGFyc2VyOiBKU1BhcnNlciwgYnVpbGRTdHJpbmdzOiB7IHRleHQ6IHN0cmluZyB9W10pIHtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoaS50ZXh0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYnVpbGRTdHJpbmdzLnBvcCgpLnRleHQpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgYXN5bmMgY29tcGlsZShhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIC8qIGxvYWQgZnJvbSBjYWNoZSAqL1xuICAgICAgICBjb25zdCBoYXZlQ2FjaGUgPSB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF07XG4gICAgICAgIGlmIChoYXZlQ2FjaGUpXG4gICAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhdmVDYWNoZSkoKTtcbiAgICAgICAgbGV0IGRvRm9yQWxsOiAocmVzb2x2ZTogKCkgPT4gU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pID0+IHZvaWQ7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gZG9Gb3JBbGwgPSByKTtcblxuICAgICAgICAvKiBydW4gdGhlIHNjcmlwdCAqL1xuICAgICAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IENvbnZlcnRTeW50YXhNaW5pKHRoaXMuc2NyaXB0LCBcIkBjb21waWxlXCIsIFwiKlwiKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRoaXMuc2NyaXB0LCB0aGlzLnNtYWxsUGF0aCwgJzwlKicsICclPicpO1xuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBpZiAocGFyc2VyLnZhbHVlcy5sZW5ndGggPT0gMSAmJiBwYXJzZXIudmFsdWVzWzBdLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgY29uc3QgcmVzb2x2ZSA9ICgpID0+IHRoaXMuc2NyaXB0O1xuICAgICAgICAgICAgZG9Gb3JBbGwocmVzb2x2ZSk7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSByZXNvbHZlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW3R5cGUsIGZpbGVQYXRoXSA9IFNwbGl0Rmlyc3QoJy8nLCB0aGlzLnNtYWxsUGF0aCksIHR5cGVBcnJheSA9IGdldFR5cGVzW3R5cGVdID8/IGdldFR5cGVzLlN0YXRpYyxcbiAgICAgICAgICAgIGNvbXBpbGVQYXRoID0gdHlwZUFycmF5WzFdICsgZmlsZVBhdGggKyAnLmNvbXAuanMnO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGZpbGVQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZVNjcmlwdChwYXJzZXIudmFsdWVzLmZpbHRlcih4ID0+IHgudHlwZSAhPSAndGV4dCcpLm1hcCh4ID0+IHgudGV4dCkpO1xuICAgICAgICBjb25zdCB7IGZ1bmNzLCBzdHJpbmcgfSA9IHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKVxuXG4gICAgICAgIGNvbnN0IHRvSW1wb3J0ID0gYXdhaXQgY29tcGlsZUltcG9ydChzdHJpbmcsIGNvbXBpbGVQYXRoLCBmaWxlUGF0aCwgdHlwZUFycmF5LCB0aGlzLmlzVHMsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIHRlbXBsYXRlKTtcblxuICAgICAgICBjb25zdCBleGVjdXRlID0gYXN5bmMgKCkgPT4gdGhpcy5yZWJ1aWxkQ29kZShwYXJzZXIsIGF3YWl0IHRvSW1wb3J0KC4uLmZ1bmNzKSk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IGV4ZWN1dGU7IC8vIHNhdmUgdGhpcyB0byBjYWNoZVxuICAgICAgICBjb25zdCB0aGlzRmlyc3QgPSBhd2FpdCBleGVjdXRlKCk7XG4gICAgICAgIGRvRm9yQWxsKGV4ZWN1dGUpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNGaXJzdDtcbiAgICB9XG59IiwgImltcG9ydCB7IFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gXCJlc2J1aWxkLXdhc21cIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5U3ludGF4IGZyb20gXCIuLi9Db21waWxlQ29kZS90cmFuc2Zvcm0vRWFzeVN5bnRheFwiO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gXCIuLi9Db21waWxlQ29kZS9KU1BhcnNlclwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgSW1wb3J0V2l0aG91dENhY2hlIGZyb20gJy4vcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgcGFnZURlcHMgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzXCI7XG5pbXBvcnQgQ3VzdG9tSW1wb3J0LCB7IGlzUGF0aEN1c3RvbSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9pbmRleFwiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3MsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZVwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCB9IGZyb20gXCIuLi9FYXN5RGVidWcvU291cmNlTWFwTG9hZFwiO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvQWxpYXNcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuYXN5bmMgZnVuY3Rpb24gUmVwbGFjZUJlZm9yZShcbiAgY29kZTogc3RyaW5nLFxuICBkZWZpbmVEYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LFxuKSB7XG4gIGNvZGUgPSBhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlLCBkZWZpbmVEYXRhKTtcbiAgcmV0dXJuIGNvZGU7XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGNvZGU6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZGlyOiBzdHJpbmcsIGZpbGU6IHN0cmluZywgcGFyYW1zPzogc3RyaW5nKSB7XG4gIHJldHVybiBgJHtpc0RlYnVnID8gXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIgOiAnJ312YXIgX19kaXJuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGRpcilcbiAgICB9XCIsX19maWxlbmFtZT1cIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhmaWxlKVxuICAgIH1cIjttb2R1bGUuZXhwb3J0cyA9IChhc3luYyAocmVxdWlyZSR7cGFyYW1zID8gJywnICsgcGFyYW1zIDogJyd9KT0+e3ZhciBtb2R1bGU9e2V4cG9ydHM6e319LGV4cG9ydHM9bW9kdWxlLmV4cG9ydHM7JHtjb2RlfVxcbnJldHVybiBtb2R1bGUuZXhwb3J0czt9KTtgO1xufVxuXG5cbi8qKlxuICogSXQgdGFrZXMgYSBmaWxlIHBhdGgsIGFuZCByZXR1cm5zIHRoZSBjb21waWxlZCBjb2RlLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBjb21waWxlLlxuICogQHBhcmFtIHtzdHJpbmcgfCBudWxsfSBzYXZlUGF0aCAtIFRoZSBwYXRoIHRvIHNhdmUgdGhlIGNvbXBpbGVkIGZpbGUgdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZXNjcmlwdCAtIGJvb2xlYW5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gIC0gZmlsZVBhdGg6IFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcmV0dXJucyBUaGUgcmVzdWx0IG9mIHRoZSBzY3JpcHQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGZpbGVQYXRoOiBzdHJpbmcsIHNhdmVQYXRoOiBzdHJpbmcgfCBudWxsLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIHsgcGFyYW1zLCB0ZW1wbGF0ZVBhdGggPSBmaWxlUGF0aCwgY29kZU1pbmlmeSA9ICFpc0RlYnVnLCBtZXJnZVRyYWNrIH06IHsgY29kZU1pbmlmeT86IGJvb2xlYW4sIHRlbXBsYXRlUGF0aD86IHN0cmluZywgcGFyYW1zPzogc3RyaW5nLCBtZXJnZVRyYWNrPzogU3RyaW5nVHJhY2tlciB9ID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgIGZvcm1hdDogJ2NqcycsXG4gICAgbG9hZGVyOiBpc1R5cGVzY3JpcHQgPyAndHMnIDogJ2pzJyxcbiAgICBtaW5pZnk6IGNvZGVNaW5pZnksXG4gICAgc291cmNlbWFwOiBpc0RlYnVnID8gKG1lcmdlVHJhY2sgPyAnZXh0ZXJuYWwnIDogJ2lubGluZScpIDogZmFsc2UsXG4gICAgc291cmNlZmlsZTogc2F2ZVBhdGggJiYgcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpLCBmaWxlUGF0aCksXG4gICAgZGVmaW5lOiB7XG4gICAgICBkZWJ1ZzogXCJcIiArIGlzRGVidWdcbiAgICB9XG4gIH07XG5cbiAgbGV0IFJlc3VsdCA9IGF3YWl0IFJlcGxhY2VCZWZvcmUobWVyZ2VUcmFjaz8uZXEgfHwgYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZpbGVQYXRoKSwge30pO1xuICBSZXN1bHQgPSB0ZW1wbGF0ZShcbiAgICBSZXN1bHQsXG4gICAgaXNEZWJ1ZyxcbiAgICBwYXRoLmRpcm5hbWUodGVtcGxhdGVQYXRoKSxcbiAgICB0ZW1wbGF0ZVBhdGgsXG4gICAgcGFyYW1zXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvZGUsIHdhcm5pbmdzLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShSZXN1bHQsIE9wdGlvbnMpO1xuICAgIGlmIChtZXJnZVRyYWNrKSB7XG4gICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIobWVyZ2VUcmFjaywgd2FybmluZ3MpO1xuICAgICAgUmVzdWx0ID0gKGF3YWl0IGJhY2tUb09yaWdpbmFsKG1lcmdlVHJhY2ssIGNvZGUsIG1hcCkpLlN0cmluZ1dpdGhUYWNrKHNhdmVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3MsIGZpbGVQYXRoKTtcbiAgICAgIFJlc3VsdCA9IGNvZGU7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzYXZlUGF0aCkge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShzYXZlUGF0aCwgUmVzdWx0KTtcbiAgfVxuICByZXR1cm4gUmVzdWx0O1xufVxuXG5mdW5jdGlvbiBDaGVja1RzKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEZpbGVQYXRoLmVuZHNXaXRoKFwiLnRzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSkge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKEluU3RhdGljUGF0aCwgdHlwZUFycmF5WzFdKTtcblxuICByZXR1cm4gYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgdHlwZUFycmF5WzBdICsgSW5TdGF0aWNQYXRoLFxuICAgIHR5cGVBcnJheVsxXSArIEluU3RhdGljUGF0aCArIFwiLmNqc1wiLFxuICAgIENoZWNrVHMoSW5TdGF0aWNQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkRXh0ZW5zaW9uKEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlsZUV4dCA9IHBhdGguZXh0bmFtZShGaWxlUGF0aCk7XG5cbiAgaWYgKEJhc2ljU2V0dGluZ3MucGFydEV4dGVuc2lvbnMuaW5jbHVkZXMoZmlsZUV4dC5zdWJzdHJpbmcoMSkpKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgKGlzVHMoKSA/IFwidHNcIiA6IFwianNcIilcbiAgZWxzZSBpZiAoZmlsZUV4dCA9PSAnJylcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzW2lzVHMoKSA/IFwidHNcIiA6IFwianNcIl07XG5cbiAgcmV0dXJuIEZpbGVQYXRoO1xufVxuXG5jb25zdCBTYXZlZE1vZHVsZXMgPSB7fTtcblxuLyoqXG4gKiBMb2FkSW1wb3J0IGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggdG8gYSBmaWxlLCBhbmQgcmV0dXJucyB0aGUgbW9kdWxlIHRoYXQgaXMgYXQgdGhhdCBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1wb3J0RnJvbSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY3JlYXRlZCB0aGlzIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBJblN0YXRpY1BhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBbdXNlRGVwc10gLSBUaGlzIGlzIGEgbWFwIG9mIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHdpdGhvdXRDYWNoZSAtIGFuIGFycmF5IG9mIHBhdGhzIHRoYXQgd2lsbCBub3QgYmUgY2FjaGVkLlxuICogQHJldHVybnMgVGhlIG1vZHVsZSB0aGF0IHdhcyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gTG9hZEltcG9ydChpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZTogc3RyaW5nW10gPSBbXSkge1xuICBsZXQgVGltZUNoZWNrOiBhbnk7XG4gIGNvbnN0IG9yaWdpbmFsUGF0aCA9IHBhdGgubm9ybWFsaXplKEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKTtcblxuICBJblN0YXRpY1BhdGggPSBBZGRFeHRlbnNpb24oSW5TdGF0aWNQYXRoKTtcbiAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKEluU3RhdGljUGF0aCkuc3Vic3RyaW5nKDEpLCB0aGlzQ3VzdG9tID0gaXNQYXRoQ3VzdG9tKG9yaWdpbmFsUGF0aCwgZXh0ZW5zaW9uKSB8fCAhWydqcycsICd0cyddLmluY2x1ZGVzKGV4dGVuc2lvbik7XG4gIGNvbnN0IFNhdmVkTW9kdWxlc1BhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgpLCBmaWxlUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIEluU3RhdGljUGF0aCk7XG5cbiAgLy93YWl0IGlmIHRoaXMgbW9kdWxlIGlzIG9uIHByb2Nlc3MsIGlmIG5vdCBkZWNsYXJlIHRoaXMgYXMgb24gcHJvY2VzcyBtb2R1bGVcbiAgbGV0IHByb2Nlc3NFbmQ6ICh2PzogYW55KSA9PiB2b2lkO1xuICBpZiAoIVNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSlcbiAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBuZXcgUHJvbWlzZShyID0+IHByb2Nlc3NFbmQgPSByKTtcbiAgZWxzZSBpZiAoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICBhd2FpdCBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgLy9idWlsZCBwYXRoc1xuICBjb25zdCByZUJ1aWxkID0gIXBhZ2VEZXBzLnN0b3JlW1NhdmVkTW9kdWxlc1BhdGhdIHx8IHBhZ2VEZXBzLnN0b3JlW1NhdmVkTW9kdWxlc1BhdGhdICE9IChUaW1lQ2hlY2sgPSBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpKTtcblxuXG4gIGlmIChyZUJ1aWxkKSB7XG4gICAgVGltZUNoZWNrID0gVGltZUNoZWNrID8/IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCk7XG4gICAgaWYgKFRpbWVDaGVjayA9PSBudWxsKSB7XG4gICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke0luU3RhdGljUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke2ltcG9ydEZyb219J2BcbiAgICAgIH0pO1xuICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBudWxsXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzQ3VzdG9tKSAvLyBvbmx5IGlmIG5vdCBjdXN0b20gYnVpbGRcbiAgICAgIGF3YWl0IEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnKTtcbiAgICBwYWdlRGVwcy51cGRhdGUoU2F2ZWRNb2R1bGVzUGF0aCwgVGltZUNoZWNrKTtcbiAgfVxuXG4gIGlmICh1c2VEZXBzKSB7XG4gICAgdXNlRGVwc1tJblN0YXRpY1BhdGhdID0geyB0aGlzRmlsZTogVGltZUNoZWNrIH07XG4gICAgdXNlRGVwcyA9IHVzZURlcHNbSW5TdGF0aWNQYXRoXTtcbiAgfVxuXG4gIGNvbnN0IGluaGVyaXRhbmNlQ2FjaGUgPSB3aXRob3V0Q2FjaGVbMF0gPT0gSW5TdGF0aWNQYXRoO1xuICBpZiAoaW5oZXJpdGFuY2VDYWNoZSlcbiAgICB3aXRob3V0Q2FjaGUuc2hpZnQoKVxuICBlbHNlIGlmICghcmVCdWlsZCAmJiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gJiYgIShTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKSlcbiAgICByZXR1cm4gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShJblN0YXRpY1BhdGgpLCBwKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydChmaWxlUGF0aCwgcCwgdHlwZUFycmF5LCBpc0RlYnVnLCB1c2VEZXBzLCBpbmhlcml0YW5jZUNhY2hlID8gd2l0aG91dENhY2hlIDogW10pO1xuICB9XG5cbiAgbGV0IE15TW9kdWxlOiBhbnk7XG4gIGlmICh0aGlzQ3VzdG9tKSB7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoLCBmaWxlUGF0aCwgZXh0ZW5zaW9uLCByZXF1aXJlTWFwKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByZXF1aXJlUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIEluU3RhdGljUGF0aCArIFwiLmNqc1wiKTtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShyZXF1aXJlUGF0aCk7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwKTtcbiAgfVxuXG4gIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IE15TW9kdWxlO1xuICBwcm9jZXNzRW5kPy4oKTtcblxuICByZXR1cm4gTXlNb2R1bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJbXBvcnRGaWxlKGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10pIHtcbiAgaWYgKCFpc0RlYnVnKSB7XG4gICAgY29uc3QgaGF2ZUltcG9ydCA9IFNhdmVkTW9kdWxlc1twYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSldO1xuICAgIGlmIChoYXZlSW1wb3J0ICE9PSB1bmRlZmluZWQpIHJldHVybiBoYXZlSW1wb3J0O1xuICB9XG5cbiAgcmV0dXJuIExvYWRJbXBvcnQoaW1wb3J0RnJvbSwgSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcsIHVzZURlcHMsIHdpdGhvdXRDYWNoZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlT25jZShmaWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG5cbiAgY29uc3QgdGVtcEZpbGUgPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgYHRlbXAtJHt1dWlkKCl9LmNqc2ApO1xuXG4gIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIGZpbGVQYXRoLFxuICAgIHRlbXBGaWxlLFxuICAgIENoZWNrVHMoZmlsZVBhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gYXdhaXQgTXlNb2R1bGUoKHBhdGg6IHN0cmluZykgPT4gaW1wb3J0KHBhdGgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVDanNTY3JpcHQoY29udGVudDogc3RyaW5nKSB7XG5cbiAgY29uc3QgdGVtcEZpbGUgPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgYHRlbXAtJHt1dWlkKCl9LmNqc2ApO1xuICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRlbXBGaWxlLCBjb250ZW50KTtcblxuICBjb25zdCBtb2RlbCA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBtb2RlbDtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZha2Ugc2NyaXB0IGxvY2F0aW9uLCBhIGZpbGUgbG9jYXRpb24sIGEgdHlwZSBhcnJheSwgYW5kIGEgYm9vbGVhbiBmb3Igd2hldGhlciBvciBub3QgaXQnc1xuICogYSBUeXBlU2NyaXB0IGZpbGUuIEl0IHRoZW4gY29tcGlsZXMgdGhlIHNjcmlwdCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gdGhlIG1vZHVsZVxuICogVGhpcyBpcyBmb3IgUnVuVGltZSBDb21waWxlIFNjcmlwdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBnbG9iYWxQcmFtcyAtIHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsXG4gKiB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc1R5cGVTY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc2NyaXB0TG9jYXRpb24gLSBUaGUgbG9jYXRpb24gb2YgdGhlIHNjcmlwdCB0byBiZSBjb21waWxlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUgLSBUaGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgZmlsZSBmcm9tIHRoZSBzdGF0aWMgZm9sZGVyLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gW3N0cmluZywgc3RyaW5nXVxuICogQHBhcmFtIHtib29sZWFufSBpc1R5cGVTY3JpcHQgLSBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gSWYgdHJ1ZSwgdGhlIGNvZGUgd2lsbCBiZSBjb21waWxlZCB3aXRoIGRlYnVnIGluZm9ybWF0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVDb2RlIC0gVGhlIGNvZGUgdGhhdCB3aWxsIGJlIGNvbXBpbGVkIGFuZCBzYXZlZCB0byB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VNYXBDb21tZW50IC0gc3RyaW5nXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlSW1wb3J0KGdsb2JhbFByYW1zOiBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc1R5cGVTY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIG1lcmdlVHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHR5cGVBcnJheVsxXSk7XG5cbiAgY29uc3QgZnVsbFNhdmVMb2NhdGlvbiA9IHNjcmlwdExvY2F0aW9uICsgXCIuY2pzXCI7XG4gIGNvbnN0IHRlbXBsYXRlUGF0aCA9IHR5cGVBcnJheVswXSArIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBzY3JpcHRMb2NhdGlvbixcbiAgICBmdWxsU2F2ZUxvY2F0aW9uLFxuICAgIGlzVHlwZVNjcmlwdCxcbiAgICBpc0RlYnVnLFxuICAgIHsgcGFyYW1zOiBnbG9iYWxQcmFtcywgbWVyZ2VUcmFjaywgdGVtcGxhdGVQYXRoLCBjb2RlTWluaWZ5OiBmYWxzZSB9XG4gICk7XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgucmVsYXRpdmUocCwgdHlwZUFycmF5WzBdKTtcbiAgICBlbHNlIHtcbiAgICAgIGlmIChwWzBdID09IFwiLlwiKSB7XG4gICAgICAgIHAgPSBwYXRoLmpvaW4oaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCBwKTtcblxuICAgICAgfVxuICAgICAgZWxzZSBpZiAocFswXSAhPSBcIi9cIilcbiAgICAgICAgcmV0dXJuIEFsaWFzT3JQYWNrYWdlKHApO1xuICAgIH1cblxuICAgIHJldHVybiBMb2FkSW1wb3J0KHRlbXBsYXRlUGF0aCwgcCwgdHlwZUFycmF5LCBpc0RlYnVnKTtcbiAgfVxuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGZ1bGxTYXZlTG9jYXRpb24pO1xuICByZXR1cm4gYXN5bmMgKC4uLmFycjogYW55W10pID0+IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXAsIC4uLmFycik7XG59IiwgImltcG9ydCB7IFN0cmluZ01hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IE1pbmlTZWFyY2gsIHtTZWFyY2hPcHRpb25zfSBmcm9tICdtaW5pc2VhcmNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoUmVjb3JkIHtcbiAgICBwcml2YXRlIGZ1bGxQYXRoOiBzdHJpbmdcbiAgICBwcml2YXRlIGluZGV4RGF0YToge1trZXk6IHN0cmluZ106IHtcbiAgICAgICAgdGl0bGVzOiBTdHJpbmdNYXAsXG4gICAgICAgIHRleHQ6IHN0cmluZ1xuICAgIH19XG4gICAgcHJpdmF0ZSBtaW5pU2VhcmNoOiBNaW5pU2VhcmNoO1xuICAgIGNvbnN0cnVjdG9yKGZpbGVwYXRoOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgZmlsZXBhdGggKyAnLmpzb24nXG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZCgpe1xuICAgICAgICB0aGlzLmluZGV4RGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5mdWxsUGF0aCk7XG4gICAgICAgIGNvbnN0IHVud3JhcHBlZDoge2lkOiBudW1iZXIsIHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9W10gPSBbXTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGZvcihjb25zdCBwYXRoIGluIHRoaXMuaW5kZXhEYXRhKXtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmluZGV4RGF0YVtwYXRoXTtcbiAgICAgICAgICAgIGZvcihjb25zdCBpZCBpbiBlbGVtZW50LnRpdGxlcyl7XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGl0bGVzW2lkXSwgdXJsOiBgLyR7cGF0aH0vIyR7aWR9YH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGV4dCwgdXJsOiBgLyR7cGF0aH1gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2ggPSBuZXcgTWluaVNlYXJjaCh7XG4gICAgICAgICAgICBmaWVsZHM6IFsndGV4dCddLFxuICAgICAgICAgICAgc3RvcmVGaWVsZHM6IFsnaWQnLCAndGV4dCcsICd1cmwnXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2guYWRkQWxsKHVud3JhcHBlZCk7XG4gICAgfVxuXG4gICAgc2VhcmNoKHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyA9IHtmdXp6eTogdHJ1ZX0sIHRhZyA9ICdiJyl7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLm1pbmlTZWFyY2guc2VhcmNoKHRleHQsIG9wdGlvbnMpO1xuICAgICAgICBpZighdGFnKSByZXR1cm4gZGF0YTtcblxuICAgICAgICBmb3IoY29uc3QgaSBvZiBkYXRhKXtcbiAgICAgICAgICAgIGZvcihjb25zdCB0ZXJtIG9mIGkudGVybXMpe1xuICAgICAgICAgICAgICAgIGxldCBsb3dlciA9IGkudGV4dC50b0xvd2VyQ2FzZSgpLCByZWJ1aWxkID0gJyc7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICBsZXQgYmVlbkxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShpbmRleCAhPSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHJlYnVpbGQgKz0gaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoLCBiZWVuTGVuZ3RoICsgaW5kZXgpICsgIGA8JHt0YWd9PiR7aS50ZXh0LnN1YnN0cmluZyhpbmRleCArIGJlZW5MZW5ndGgsIGluZGV4ICsgdGVybS5sZW5ndGggKyBiZWVuTGVuZ3RoKX08LyR7dGFnfT5gXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbG93ZXIuc3Vic3RyaW5nKGluZGV4ICsgdGVybS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBiZWVuTGVuZ3RoICs9IGluZGV4ICsgdGVybS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpLnRleHQgPSByZWJ1aWxkICsgaS50ZXh0LnN1YnN0cmluZyhiZWVuTGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHN1Z2dlc3QodGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluaVNlYXJjaC5hdXRvU3VnZ2VzdCh0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG59IiwgImltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSBcIi4uLy4uLy4uL0J1aWxkSW5GdW5jL1NlYXJjaFJlY29yZFwiXG5pbXBvcnQge1NldHRpbmdzfSAgZnJvbSAnLi4vLi4vLi4vTWFpbkJ1aWxkL1NlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbn0iLCAiaW1wb3J0IHBhY2thZ2VFeHBvcnQgZnJvbSBcIi4vcGFja2FnZUV4cG9ydFwiO1xuXG4vL0B0cy1pZ25vcmUtbmV4dC1saW5lXG5leHBvcnQgY29uc3QgYWxpYXNOYW1lcyA9IFtwYWNrYWdlTmFtZV1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aDogc3RyaW5nKTogYW55IHtcblxuICAgIHN3aXRjaCAob3JpZ2luYWxQYXRoKSB7XG4gICAgICAgIC8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbiAgICAgICAgY2FzZSBwYWNrYWdlTmFtZTpcbiAgICAgICAgICAgIHJldHVybiBwYWNrYWdlRXhwb3J0KClcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGlhc09yUGFja2FnZShvcmlnaW5hbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGhhdmUgPSBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGgpO1xuICAgIGlmIChoYXZlKSByZXR1cm4gaGF2ZVxuICAgIHJldHVybiBpbXBvcnQob3JpZ2luYWxQYXRoKTtcbn0iLCAiaW1wb3J0IEltcG9ydEFsaWFzLCB7IGFsaWFzTmFtZXMgfSBmcm9tICcuL0FsaWFzJztcbmltcG9ydCBJbXBvcnRCeUV4dGVuc2lvbiwgeyBjdXN0b21UeXBlcyB9IGZyb20gJy4vRXh0ZW5zaW9uL2luZGV4JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY3VzdG9tVHlwZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSB8fCBhbGlhc05hbWVzLmluY2x1ZGVzKG9yaWdpbmFsUGF0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGg6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcsIHJlcXVpcmU6IChwOiBzdHJpbmcpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsaWFzRXhwb3J0ID0gYXdhaXQgSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoYWxpYXNFeHBvcnQpIHJldHVybiBhbGlhc0V4cG9ydDtcbiAgICByZXR1cm4gSW1wb3J0QnlFeHRlbnNpb24oZnVsbFBhdGgsIGV4dGVuc2lvbik7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFJhem9yVG9FSlMsIFJhem9yVG9FSlNNaW5pIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQmFzZVJlYWRlci9SZWFkZXInO1xuXG5cbmNvbnN0IGFkZFdyaXRlTWFwID0ge1xuICAgIFwiaW5jbHVkZVwiOiBcImF3YWl0IFwiLFxuICAgIFwiaW1wb3J0XCI6IFwiYXdhaXQgXCIsXG4gICAgXCJ0cmFuc2ZlclwiOiBcInJldHVybiBhd2FpdCBcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4KHRleHQ6IFN0cmluZ1RyYWNrZXIsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTKHRleHQuZXEpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKHN1YnN0cmluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JT0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU6JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkV3JpdGVNYXBbaS5uYW1lXX0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59XG5cbi8qKlxuICogQ29udmVydFN5bnRheE1pbmkgdGFrZXMgdGhlIGNvZGUgYW5kIGEgc2VhcmNoIHN0cmluZyBhbmQgY29udmVydCBjdXJseSBicmFja2V0c1xuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSB0ZXh0IC0gVGhlIHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmluZCAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhZGRFSlMgLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgc3RhcnQgb2YgdGhlIGVqcy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheE1pbmkodGV4dDogU3RyaW5nVHJhY2tlciwgZmluZDogc3RyaW5nLCBhZGRFSlM6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlNNaW5pKHRleHQuZXEsIGZpbmQpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgIGlmICh2YWx1ZXNbaV0gIT0gdmFsdWVzW2kgKyAxXSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcodmFsdWVzW2ldLCB2YWx1ZXNbaSArIDFdKSk7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpICsgMl0sIHZhbHVlc1tpICsgM10pO1xuICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkRUpTfSR7c3Vic3RyaW5nfSU+YDtcbiAgICB9XG5cbiAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKCh2YWx1ZXMuYXQoLTEpPz8tMSkgKyAxKSk7XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmluYWxpemVCdWlsZCB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuXG5cbmV4cG9ydCBjbGFzcyBQYWdlVGVtcGxhdGUgZXh0ZW5kcyBKU1BhcnNlciB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBBZGRQYWdlVGVtcGxhdGUodGV4dDogU3RyaW5nVHJhY2tlciwgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICB0ZXh0ID0gYXdhaXQgZmluYWxpemVCdWlsZCh0ZXh0LCBzZXNzaW9uSW5mbywgZnVsbFBhdGhDb21waWxlKTtcblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYHRyeSB7XFxuYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGBcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSAoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3IpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoc2Vzc2lvbkluZm8uZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoc2Vzc2lvbkluZm8uZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5jbHVkZSA9IChwLCB3aXRoT2JqZWN0KSA9PiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHAsIHdpdGhPYmplY3QpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlID0geyBleHBvcnRzOiB7fSB9LFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgICAgICAgICAgICAgIHsgc2VuZEZpbGUsIHdyaXRlU2FmZSwgd3JpdGUsIGVjaG8sIHNldFJlc3BvbnNlLCBvdXRfcnVuX3NjcmlwdCwgcnVuX3NjcmlwdF9uYW1lLCBSZXNwb25zZSwgUmVxdWVzdCwgUG9zdCwgUXVlcnksIFNlc3Npb24sIEZpbGVzLCBDb29raWVzLCBQYWdlVmFyLCBHbG9iYWxWYXJ9ID0gcGFnZSxcblxuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X2NvZGUgPSBydW5fc2NyaXB0X25hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmZXIgPSAocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0KSA9PiAob3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9LCBfdHJhbnNmZXIocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0LCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UpKTtcbiAgICAgICAgICAgICAgICB7YCk7XG5cblxuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG59XG4gICAgICAgICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RfZmlsZSA9IHJ1bl9zY3JpcHRfbmFtZS5zcGxpdCgvLT58PGxpbmU+LykucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSArPSAnIC0+IDxsaW5lPicgKyBlLnN0YWNrLnNwbGl0KC9cXFxcbiggKSphdCAvKVsyXTtcbiAgICAgICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSAnJHtQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihgPHA+RXJyb3IgcGF0aDogJyArIHJ1bl9zY3JpcHRfbmFtZS5yZXBsYWNlKC88bGluZT4vZ2ksICc8YnIvPicpICsgJzwvcD48cD5FcnJvciBtZXNzYWdlOiAnICsgZS5tZXNzYWdlICsgJzwvcD5gKX0nO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBhdGg6IFwiICsgcnVuX3NjcmlwdF9uYW1lLnNsaWNlKDAsIC1sYXN0X2ZpbGUubGVuZ3RoKS5yZXBsYWNlKC88bGluZT4vZ2ksICdcXFxcbicpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCl9XCIgKyBsYXN0X2ZpbGUudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIG1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJ1bm5pbmcgdGhpcyBjb2RlOiBcXFxcXCJcIiArIHJ1bl9zY3JpcHRfY29kZSArICdcIicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc3RhY2s6IFwiICsgZS5zdGFjayk7XG4gICAgICAgICAgICAgICAgfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGB9fSk7fWApO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbHRDb2RlID0gYXdhaXQgUGFnZVRlbXBsYXRlLlJ1bkFuZEV4cG9ydCh0ZXh0LCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuQWRkUGFnZVRlbXBsYXRlKGJ1aWx0Q29kZSwgZnVsbFBhdGhDb21waWxlLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgc3RhdGljIEFkZEFmdGVyQnVpbGQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIEluUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGRhdGFPYmplY3Q6IGFueSwgZnVsbFBhdGg6IHN0cmluZykge1xuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGA8JSF7XG4gICAgICAgICAgICBjb25zdCBfcGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gey4uLl9wYWdlJHtkYXRhT2JqZWN0ID8gJywnICsgZGF0YU9iamVjdCA6ICcnfX07XG4gICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAgeyU+YCk7XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCc8JSF9fX0lPicpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgUmF6b3JTeW50YXggZnJvbSAnLi9SYXpvclN5bnRheCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2V0U3ludGF4KENvbXBpbGVUeXBlOiBhbnkpIHtcbiAgICBsZXQgZnVuYzogYW55O1xuICAgIHN3aXRjaCAoQ29tcGlsZVR5cGUubmFtZSB8fCBDb21waWxlVHlwZSkge1xuICAgICAgICBjYXNlIFwiUmF6b3JcIjpcbiAgICAgICAgICAgIGZ1bmMgPSBSYXpvclN5bnRheDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbn0iLCAiaW1wb3J0IEFkZFN5bnRheCBmcm9tICcuL1N5bnRheC9JbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkUGx1Z2luIHtcblx0cHVibGljIFNldHRpbmdzT2JqZWN0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihTZXR0aW5nc09iamVjdDoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICAgICAgdGhpcy5TZXR0aW5nc09iamVjdCA9IFNldHRpbmdzT2JqZWN0XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZGVmYXVsdFN5bnRheCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5TZXR0aW5nc09iamVjdC5CYXNpY0NvbXBpbGF0aW9uU3ludGF4LmNvbmNhdCh0aGlzLlNldHRpbmdzT2JqZWN0LkFkZENvbXBpbGVTeW50YXgpO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkQmFzaWModGV4dDogU3RyaW5nVHJhY2tlciwgT0RhdGE6c3RyaW5nIHxhbnksIHBhdGg6c3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9hZGQgU3ludGF4XG5cbiAgICAgICAgaWYgKCFPRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoT0RhdGEpKSB7XG4gICAgICAgICAgICBPRGF0YSA9IFtPRGF0YV07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgT0RhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IFN5bnRheCA9IGF3YWl0IEFkZFN5bnRheChpKTtcblxuICAgICAgICAgICAgaWYgKFN5bnRheCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBhd2FpdCBTeW50YXgodGV4dCwgaSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgcGFnZXNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBjb21wb25lbnRzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZENvbXBvbmVudCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufSIsICIvL2dsb2JhbCBzZXR0aW5ncyBmb3IgYnVpbGQgaW4gY29tcG9uZW50c1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7XG4gICAgcGx1Z2luczogW11cbn07IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuL1NjcmlwdFRlbXBsYXRlJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCwgUGFyc2VEZWJ1Z0xpbmUsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCAqIGFzIGV4dHJpY2F0ZSBmcm9tICcuL1hNTEhlbHBlcnMvRXh0cmljYXRlJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tICcuL3RyYW5zZm9ybS9TY3JpcHQnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgQnVpbGRTY3JpcHRTZXR0aW5ncyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzJztcbmltcG9ydCBQYXJzZUJhc2VQYWdlIGZyb20gJy4vQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7IEFkZENvbXBpbGVTeW50YXg6IFtdLCBwbHVnaW5zOiBbXSwgQmFzaWNDb21waWxhdGlvblN5bnRheDogWydSYXpvciddIH07XG5jb25zdCBQbHVnaW5CdWlsZCA9IG5ldyBBZGRQbHVnaW4oU2V0dGluZ3MpO1xuZXhwb3J0IGNvbnN0IENvbXBvbmVudHMgPSBuZXcgSW5zZXJ0Q29tcG9uZW50KFBsdWdpbkJ1aWxkKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldFBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MucGx1Z2lucy5maW5kKGIgPT4gYiA9PSBuYW1lIHx8ICg8YW55PmIpPy5uYW1lID09IG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU29tZVBsdWdpbnMoLi4uZGF0YTogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gZGF0YS5zb21lKHggPT4gR2V0UGx1Z2luKHgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHMoKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLkFkZENvbXBpbGVTeW50YXguaW5jbHVkZXMoJ1R5cGVTY3JpcHQnKTtcbn1cblxuQ29tcG9uZW50cy5NaWNyb1BsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuQ29tcG9uZW50cy5HZXRQbHVnaW4gPSBHZXRQbHVnaW47XG5Db21wb25lbnRzLlNvbWVQbHVnaW5zID0gU29tZVBsdWdpbnM7XG5Db21wb25lbnRzLmlzVHMgPSBpc1RzO1xuXG5CdWlsZFNjcmlwdFNldHRpbmdzLnBsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuXG5hc3luYyBmdW5jdGlvbiBvdXRQYWdlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHNjcmlwdEZpbGU6IFN0cmluZ1RyYWNrZXIsIHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuXG4gICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShkYXRhLCBpc1RzKCkpO1xuICAgIGF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbywgcGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIHBhZ2VOYW1lKTtcblxuICAgIGNvbnN0IG1vZGVsTmFtZSA9IGJhc2VEYXRhLnBvcEFueSgnbW9kZWwnKT8uZXE7XG5cbiAgICBpZiAoIW1vZGVsTmFtZSkgcmV0dXJuIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlLCBiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgIGRhdGEgPSBiYXNlRGF0YS5jbGVhckRhdGE7XG5cbiAgICAvL2ltcG9ydCBtb2RlbFxuICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQ3JlYXRlRmlsZVBhdGgocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIG1vZGVsTmFtZSwgJ01vZGVscycsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLm1vZGVsKTsgLy8gZmluZCBsb2NhdGlvbiBvZiB0aGUgZmlsZVxuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdWxsUGF0aCkpIHtcbiAgICAgICAgY29uc3QgRXJyb3JNZXNzYWdlID0gYEVycm9yIG1vZGVsIG5vdCBmb3VuZCAtPiAke21vZGVsTmFtZX0gYXQgcGFnZSAke3BhZ2VOYW1lfWA7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0LCBQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihFcnJvck1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgRnVsbFBhdGgpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3RcblxuICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBGdWxsUGF0aCwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgIGxldCBtb2RlbERhdGEgPSBQYXJzZUJhc2VQYWdlLnJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoYmFzZU1vZGVsRGF0YS5hbGxEYXRhKTtcblxuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIG1vZGVsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgcGFnZU5hbWUgKz0gXCIgLT4gXCIgKyBTbWFsbFBhdGg7XG5cbiAgICAvL0dldCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBhbGxEYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdlcyhtb2RlbERhdGEsIFsnJ10sICc6JywgZmFsc2UsIHRydWUpO1xuXG4gICAgaWYgKGFsbERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciB3aXRoaW4gbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1vZGVsRGF0YSA9IGFsbERhdGEuZGF0YTtcbiAgICBjb25zdCB0YWdBcnJheSA9IGFsbERhdGEuZm91bmQubWFwKHggPT4geC50YWcuc3Vic3RyaW5nKDEpKTtcbiAgICBjb25zdCBvdXREYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdlcyhkYXRhLCB0YWdBcnJheSwgJ0AnKTtcblxuICAgIGlmIChvdXREYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgV2l0aCBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy9CdWlsZCBXaXRoIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1vZGVsQnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIGFsbERhdGEuZm91bmQpIHtcbiAgICAgICAgaS50YWcgPSBpLnRhZy5zdWJzdHJpbmcoMSk7IC8vIHJlbW92aW5nIHRoZSAnOidcbiAgICAgICAgY29uc3QgaG9sZGVyRGF0YSA9IG91dERhdGEuZm91bmQuZmluZCgoZSkgPT4gZS50YWcgPT0gJ0AnICsgaS50YWcpO1xuXG4gICAgICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEuc3Vic3RyaW5nKDAsIGkubG9jKSk7XG4gICAgICAgIG1vZGVsRGF0YSA9IG1vZGVsRGF0YS5zdWJzdHJpbmcoaS5sb2MpO1xuXG4gICAgICAgIGlmIChob2xkZXJEYXRhKSB7XG4gICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMoaG9sZGVyRGF0YS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHsgLy8gVHJ5IGxvYWRpbmcgZGF0YSBmcm9tIHBhZ2UgYmFzZVxuICAgICAgICAgICAgY29uc3QgbG9hZEZyb21CYXNlID0gYmFzZURhdGEuZ2V0KGkudGFnKTtcblxuICAgICAgICAgICAgaWYgKGxvYWRGcm9tQmFzZSAmJiBsb2FkRnJvbUJhc2UuZXEudG9Mb3dlckNhc2UoKSAhPSAnaW5oZXJpdCcpXG4gICAgICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGxvYWRGcm9tQmFzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhKTtcblxuICAgIHJldHVybiBhd2FpdCBvdXRQYWdlKG1vZGVsQnVpbGQsIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlKSwgRnVsbFBhdGgsIHBhZ2VOYW1lLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEluc2VydChkYXRhOiBzdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBuZXN0ZWRQYWdlOiBib29sZWFuLCBuZXN0ZWRQYWdlRGF0YTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgbGV0IERlYnVnU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBkYXRhKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IG91dFBhZ2UoRGVidWdTdHJpbmcsIG5ldyBTdHJpbmdUcmFja2VyKERlYnVnU3RyaW5nLkRlZmF1bHRJbmZvVGV4dCksIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQbHVnaW5CdWlsZC5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IENvbXBvbmVudHMuSW5zZXJ0KERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYWdlVGVtcGxhdGUuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBmdWxsUGF0aENvbXBpbGUsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zKERlYnVnU3RyaW5nKTtcbiAgICBEZWJ1Z1N0cmluZz0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgIHJldHVybiBEZWJ1Z1N0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCdWlsZEpTLCBCdWlsZEpTWCwgQnVpbGRUUywgQnVpbGRUU1ggfSBmcm9tICcuL0ZvclN0YXRpYy9TY3JpcHQnO1xuaW1wb3J0IEJ1aWxkU3ZlbHRlIGZyb20gJy4vRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTdHlsZVNhc3MgfSBmcm9tICcuL0ZvclN0YXRpYy9TdHlsZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgU3lzdGVtRGF0YSwgZ2V0RGlybmFtZSwgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFJlc3BvbnNlLCBSZXF1ZXN0IH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwcm9tcHRseSBmcm9tICdwcm9tcHRseSc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5cbmNvbnN0IFN1cHBvcnRlZFR5cGVzID0gWydqcycsICdzdmVsdGUnLCAndHMnLCAnanN4JywgJ3RzeCcsICdjc3MnLCAnc2FzcycsICdzY3NzJ107XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1N0YXRpY0ZpbGVzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvID0gU3RhdGljRmlsZXNJbmZvLnN0b3JlW3BhdGhdO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG8pIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIHAgPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBvW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAhbztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGZ1bGxDb21waWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBzd2l0Y2ggKGV4dCkge1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIGNhc2UgJ3Nhc3MnOlxuICAgICAgICBjYXNlICdzY3NzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3R5bGVTYXNzKFNtYWxsUGF0aCwgZXh0LCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmVsdGUnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdmVsdGUoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGZ1bGxDb21waWxlUGF0aCArPSAnLmpzJztcbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsQ29tcGlsZVBhdGgpKSB7XG4gICAgICAgIFN0YXRpY0ZpbGVzSW5mby51cGRhdGUoU21hbGxQYXRoLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGVidWcpXG4gICAgICAgIHJldHVybiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgYnVpbGRJbiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICBleHQ/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGluU2VydmVyPzogc3RyaW5nO1xufVxuXG5jb25zdCBzdGF0aWNGaWxlcyA9IFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy9jbGllbnQvJztcbmNvbnN0IGdldFN0YXRpYzogYnVpbGRJbltdID0gW3tcbiAgICBwYXRoOiBcInNlcnYvdGVtcC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcImJ1aWxkVGVtcGxhdGUuanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvY29ubmVjdC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1ha2VDb25uZWN0aW9uLmpzXCJcbn1dO1xuXG5jb25zdCBnZXRTdGF0aWNGaWxlc1R5cGU6IGJ1aWxkSW5bXSA9IFt7XG4gICAgZXh0OiAnLnB1Yi5qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLm1qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLmNzcycsXG4gICAgdHlwZTogJ2Nzcydcbn1dO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0OiBSZXF1ZXN0LCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgY29uc3QgZm91bmQgPSBnZXRTdGF0aWNGaWxlc1R5cGUuZmluZCh4ID0+IGZpbGVQYXRoLmVuZHNXaXRoKHguZXh0KSk7XG5cbiAgICBpZiAoIWZvdW5kKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGNvbnN0IGJhc2VQYXRoID0gUmVxdWVzdC5xdWVyeS50ID09ICdsJyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV07XG4gICAgY29uc3QgaW5TZXJ2ZXIgPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGluU2VydmVyKSlcbiAgICAgICAgcmV0dXJuIHsgLi4uZm91bmQsIGluU2VydmVyIH07XG59XG5cbmxldCBkZWJ1Z2dpbmdXaXRoU291cmNlOiBudWxsIHwgYm9vbGVhbiA9IG51bGw7XG5cbmlmIChhcmd2LmluY2x1ZGVzKCdhbGxvd1NvdXJjZURlYnVnJykpXG4gICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IHRydWU7XG5hc3luYyBmdW5jdGlvbiBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkge1xuICAgIGlmICh0eXBlb2YgZGVidWdnaW5nV2l0aFNvdXJjZSA9PSAnYm9vbGVhbicpXG4gICAgICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IChhd2FpdCBwcm9tcHRseS5wcm9tcHQoXG4gICAgICAgICAgICAnQWxsb3cgZGVidWdnaW5nIEphdmFTY3JpcHQvQ1NTIGluIHNvdXJjZSBwYWdlPyAtIGV4cG9zaW5nIHlvdXIgc291cmNlIGNvZGUgKG5vKScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKHY6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWyd5ZXMnLCAnbm8nXS5pbmNsdWRlcyh2LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3llcyBvciBubycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwXG4gICAgICAgICAgICB9XG4gICAgICAgICkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09ICd5ZXMnO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB9IGNhdGNoIHsgfVxuXG5cbiAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcbn1cblxuY29uc3Qgc2FmZUZvbGRlcnMgPSBbZ2V0VHlwZXMuU3RhdGljWzJdLCBnZXRUeXBlcy5Mb2dzWzJdLCAnTW9kZWxzJywgJ0NvbXBvbmVudHMnXTtcbi8qKlxuICogSWYgdGhlIHVzZXIgaXMgaW4gZGVidWcgbW9kZSwgYW5kIHRoZSBmaWxlIGlzIGEgc291cmNlIGZpbGUsIGFuZCB0aGUgdXNlciBjb21tZW5kIGxpbmUgYXJndW1lbnQgaGF2ZSBhbGxvd1NvdXJjZURlYnVnXG4gKiB0aGVuIHJldHVybiB0aGUgZnVsbCBwYXRoIHRvIHRoZSBmaWxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBpcyB0aGUgY3VycmVudCBwYWdlIGEgZGVidWcgcGFnZT9cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRoYXQgd2FzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSBJZiB0aGlzIHBhdGggYWxyZWFkeSBiZWVuIGNoZWNrZWRcbiAqIHRoZSBmaWxlLlxuICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGZpbGUgYW5kIHRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bnNhZmVEZWJ1Zyhpc0RlYnVnOiBib29sZWFuLCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFpc0RlYnVnIHx8IEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpICE9ICcuc291cmNlJyB8fCAhc2FmZUZvbGRlcnMuaW5jbHVkZXMoZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykuc2hpZnQoKSkgfHwgIWF3YWl0IGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA3KSk7IC8vIHJlbW92aW5nICcuc291cmNlJ1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlRmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNCk7IC8vIHJlbW92aW5nICcuY3NzJ1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgZmlsZVBhdGg7XG5cbiAgICBsZXQgZXhpc3RzOiBib29sZWFuO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoYmFzZUZpbGVQYXRoKSA9PSAnLnN2ZWx0ZScgJiYgKGNoZWNrZWQgfHwgKGV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSkpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgIWV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludFdhcm5pbmdzIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBtb3JlT3B0aW9ucz86IFRyYW5zZm9ybU9wdGlvbnMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IGlucHV0UGF0aCArICc/c291cmNlPXRydWUnLFxuICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAnaW5saW5lJzogZmFsc2UsXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIC4uLm1vcmVPcHRpb25zXG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IGNvZGU7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzLCBmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZnVsbFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanMnLCBpc0RlYnVnLCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgbG9hZGVyOiAndHMnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanN4JywgaXNEZWJ1ZywgeyAuLi4oR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSksIGxvYWRlcjogJ2pzeCcgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0c3gnLCBpc0RlYnVnLCB7IGxvYWRlcjogJ3RzeCcsIC4uLihHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KSB9KTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tIFwiZXNidWlsZC13YXNtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQsIE1lcmdlU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZUVycm9yLCBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5TdGF0aWNQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY1BhdGg7XG5cbiAgICBjb25zdCB7IGNvZGUsIGRlcGVuZGVuY2llcywgbWFwLCBzY3JpcHRMYW5nIH0gPSBhd2FpdCBwcmVwcm9jZXNzKGZ1bGxQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBpblN0YXRpY1BhdGgpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnVsbFBhdGguc3BsaXQoL1xcL3xcXC8vKS5wb3AoKTtcbiAgICBsZXQganM6IGFueSwgY3NzOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwge1xuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXY6IGlzRGVidWcsXG4gICAgICAgICAgICBzb3VyY2VtYXA6IG1hcCxcbiAgICAgICAgICAgIGNzczogZmFsc2UsXG4gICAgICAgICAgICBoeWRyYXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3ZlbHRlUGF0aDogJy9zZXJ2L3N2ZWx0ZSdcbiAgICAgICAgfSk7XG4gICAgICAgIFByaW50U3ZlbHRlV2FybihvdXRwdXQud2FybmluZ3MsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICBqcyA9IG91dHB1dC5qcztcbiAgICAgICAgY3NzID0gb3V0cHV0LmNzcztcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBQcmludFN2ZWx0ZUVycm9yKGVyciwgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aGlzRmlsZTogMFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgY29uc3Qgc291cmNlRmlsZUNsaWVudCA9IGpzLm1hcC5zb3VyY2VzWzBdLnN1YnN0cmluZygxKTtcblxuICAgIGlmKGlzRGVidWcpe1xuICAgICAgICBqcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgfVxuXG4gICAgaWYgKFNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oanMuY29kZSwge1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb2FkZXI6IDxhbnk+c2NyaXB0TGFuZyxcbiAgICAgICAgICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqcy5jb2RlID0gY29kZTtcbiAgICAgICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgICAgICBqcy5tYXAgPSBhd2FpdCBNZXJnZVNvdXJjZU1hcChKU09OLnBhcnNlKG1hcCksIGpzLm1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXdhaXQgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoZXJyLCBqcy5tYXAsIGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgIGpzLmNvZGUgKz0gdG9VUkxDb21tZW50KGpzLm1hcCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3NzLmNvZGUpIHtcbiAgICAgICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9IHNvdXJjZUZpbGVDbGllbnQ7XG4gICAgICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuanMnLCBqcy5jb2RlKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVwZW5kZW5jaWVzLFxuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufSIsICJpbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkx9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgIGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgc2Fzc0FuZFNvdXJjZSwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU3R5bGVTYXNzKGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBcInNhc3NcIiB8IFwic2Nzc1wiIHwgXCJjc3NcIiwgaXNEZWJ1ZzogYm9vbGVhbik6IFByb21pc2U8eyBba2V5OiBzdHJpbmddOiBudW1iZXIgfT4ge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG5cbiAgICBjb25zdCBkZXBlbmRlbmNlT2JqZWN0ID0ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCksIGZpbGVEYXRhRGlybmFtZSA9IHBhdGguZGlybmFtZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhmaWxlRGF0YSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBpc0RlYnVnLFxuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KHR5cGUpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZSh0eXBlLCBTb21lUGx1Z2lucyksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQ/LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2VPYmplY3RbQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCldID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5jc3M7XG5cbiAgICAgICAgaWYgKGlzRGVidWcgJiYgcmVzdWx0LnNvdXJjZU1hcCkge1xuICAgICAgICAgICAgc2Fzc0FuZFNvdXJjZShyZXN1bHQuc291cmNlTWFwLCBwYXRoVG9GaWxlVVJMKGZpbGVEYXRhKS5ocmVmKTtcbiAgICAgICAgICAgIHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcyA9IHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcy5tYXAoeCA9PiBwYXRoLnJlbGF0aXZlKGZpbGVEYXRhRGlybmFtZSwgZmlsZVVSTFRvUGF0aCh4KSkgKyAnP3NvdXJjZT10cnVlJyk7XG5cbiAgICAgICAgICAgIGRhdGEgKz0gYFxcclxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5zb3VyY2VNYXApKS50b1N0cmluZyhcImJhc2U2NFwiKX0qL2A7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCBkYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBkZXBlbmRlbmNlT2JqZWN0XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERpcmVudCB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IEluc2VydCwgQ29tcG9uZW50cywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IENsZWFyV2FybmluZyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3J1xuaW1wb3J0ICogYXMgU2VhcmNoRmlsZVN5c3RlbSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFJlcVNjcmlwdCBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IFN0YXRpY0ZpbGVzIGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tICcuL0NvbXBpbGVTdGF0ZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVTaXRlTWFwIH0gZnJvbSAnLi9TaXRlTWFwJztcbmltcG9ydCB7IGlzRmlsZVR5cGUsIFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgeyBwZXJDb21waWxlLCBwb3N0Q29tcGlsZSwgcGVyQ29tcGlsZVBhZ2UsIHBvc3RDb21waWxlUGFnZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlJztcblxuYXN5bmMgZnVuY3Rpb24gY29tcGlsZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgaXNEZWJ1Zz86IGJvb2xlYW4sIGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZykge1xuICAgIGNvbnN0IEZ1bGxGaWxlUGF0aCA9IHBhdGguam9pbihhcnJheVR5cGVbMF0sIGZpbGVQYXRoKSwgRnVsbFBhdGhDb21waWxlID0gYXJyYXlUeXBlWzFdICsgZmlsZVBhdGggKyAnLmNqcyc7XG5cbiAgICBjb25zdCBodG1sID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICBjb25zdCBFeGNsdVVybCA9IChuZXN0ZWRQYWdlID8gbmVzdGVkUGFnZSArICc8bGluZT4nIDogJycpICsgYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGg7XG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IGhhc1Nlc3Npb25JbmZvID8/IG5ldyBTZXNzaW9uQnVpbGQoYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGgsIEZ1bGxGaWxlUGF0aCwgYXJyYXlUeXBlWzJdLCBpc0RlYnVnLCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikpO1xuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoJ3RoaXNQYWdlJywgRnVsbEZpbGVQYXRoKTtcblxuICAgIGF3YWl0IHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuICAgIGNvbnN0IENvbXBpbGVkRGF0YSA9IGF3YWl0IEluc2VydChodG1sLCBGdWxsUGF0aENvbXBpbGUsIEJvb2xlYW4obmVzdGVkUGFnZSksIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgYXdhaXQgcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgaWYgKCFuZXN0ZWRQYWdlKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoRnVsbFBhdGhDb21waWxlLCBDb21waWxlZERhdGEuU3RyaW5nV2l0aFRhY2soRnVsbFBhdGhDb21waWxlKSk7XG4gICAgICAgIHBhZ2VEZXBzLnVwZGF0ZShSZW1vdmVFbmRUeXBlKEV4Y2x1VXJsKSwgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLm1rZGlyKGFycmF5VHlwZVsxXSArIGNvbm5lY3QpO1xuICAgICAgICAgICAgYXdhaXQgRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKFNlYXJjaEZpbGVTeXN0ZW0uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShhcnJheVR5cGVbMl0gKyAnLycgKyBjb25uZWN0KSkgLy9jaGVjayBpZiBub3QgYWxyZWFkeSBjb21waWxlIGZyb20gYSAnaW4tZmlsZScgY2FsbFxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb21waWxlRmlsZShjb25uZWN0LCBhcnJheVR5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoU2VhcmNoRmlsZVN5c3RlbS5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyIC0gJyArIGFycmF5VHlwZVsyXSwgY29ubmVjdCwgYXJyYXlUeXBlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgU3RhdGljRmlsZXMoY29ubmVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlU2NyaXB0cyhzY3JpcHRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBzY3JpcHRzKSB7XG4gICAgICAgIGF3YWl0IFJlcVNjcmlwdCgnUHJvZHVjdGlvbiBMb2FkZXInLCBwYXRoLCBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpYywgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQ3JlYXRlQ29tcGlsZSh0OiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB0eXBlcyA9IFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXNbdF07XG4gICAgYXdhaXQgU2VhcmNoRmlsZVN5c3RlbS5EZWxldGVJbkRpcmVjdG9yeSh0eXBlc1sxXSk7XG4gICAgcmV0dXJuICgpID0+IEZpbGVzSW5Gb2xkZXIodHlwZXMsICcnLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogd2hlbiBwYWdlIGNhbGwgb3RoZXIgcGFnZTtcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlSW5GaWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgc2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLCBhcnJheVR5cGVbMV0pO1xuICAgIHJldHVybiBhd2FpdCBjb21waWxlRmlsZShwYXRoLCBhcnJheVR5cGUsIHRydWUsIHNlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10pIHtcbiAgICBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShwYXRoLCBhcnJheVR5cGUpO1xuICAgIENsZWFyV2FybmluZygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUFsbChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKSB7XG4gICAgbGV0IHN0YXRlID0gIWFyZ3YuaW5jbHVkZXMoJ3JlYnVpbGQnKSAmJiBhd2FpdCBDb21waWxlU3RhdGUuY2hlY2tMb2FkKClcblxuICAgIGlmIChzdGF0ZSkgcmV0dXJuICgpID0+IFJlcXVpcmVTY3JpcHRzKHN0YXRlLnNjcmlwdHMpXG4gICAgcGFnZURlcHMuY2xlYXIoKTtcbiAgICBcbiAgICBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuXG4gICAgcGVyQ29tcGlsZSgpO1xuXG4gICAgY29uc3QgYWN0aXZhdGVBcnJheSA9IFthd2FpdCBDcmVhdGVDb21waWxlKFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljWzJdLCBzdGF0ZSksIGF3YWl0IENyZWF0ZUNvbXBpbGUoU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5Mb2dzWzJdLCBzdGF0ZSksIENsZWFyV2FybmluZ107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWN0aXZhdGVBcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgaSgpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmV4cG9ydCgpXG4gICAgICAgIHBvc3RDb21waWxlKClcbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBnZXRTZXR0aW5nc0RhdGUgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG50eXBlIENTdGF0ZSA9IHtcbiAgICB1cGRhdGU6IG51bWJlclxuICAgIHBhZ2VBcnJheTogc3RyaW5nW11bXSxcbiAgICBpbXBvcnRBcnJheTogc3RyaW5nW11cbiAgICBmaWxlQXJyYXk6IHN0cmluZ1tdXG59XG5cbi8qIFRoaXMgY2xhc3MgaXMgdXNlZCB0byBzdG9yZSB0aGUgc3RhdGUgb2YgdGhlIHByb2plY3QgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVTdGF0ZSB7XG4gICAgcHJpdmF0ZSBzdGF0ZTogQ1N0YXRlID0geyB1cGRhdGU6IDAsIHBhZ2VBcnJheTogW10sIGltcG9ydEFycmF5OiBbXSwgZmlsZUFycmF5OiBbXSB9XG4gICAgc3RhdGljIGZpbGVQYXRoID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIFwiQ29tcGlsZVN0YXRlLmpzb25cIilcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGUgPSBnZXRTZXR0aW5nc0RhdGUoKVxuICAgIH1cblxuICAgIGdldCBzY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5pbXBvcnRBcnJheVxuICAgIH1cblxuICAgIGdldCBwYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUucGFnZUFycmF5XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5maWxlQXJyYXlcbiAgICB9XG5cbiAgICBhZGRQYWdlKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5wYWdlQXJyYXkuZmluZCh4ID0+IHhbMF0gPT0gcGF0aCAmJiB4WzFdID09IHR5cGUpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wYWdlQXJyYXkucHVzaChbcGF0aCwgdHlwZV0pXG4gICAgfVxuXG4gICAgYWRkSW1wb3J0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW1wb3J0QXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmltcG9ydEFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBhZGRGaWxlKHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZmlsZUFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWxlQXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKENvbXBpbGVTdGF0ZS5maWxlUGF0aCwgdGhpcy5zdGF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tMb2FkKCkge1xuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuZmlsZVBhdGgpKSByZXR1cm5cblxuICAgICAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuICAgICAgICBzdGF0ZS5zdGF0ZSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5maWxlUGF0aClcblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICE9IGdldFNldHRpbmdzRGF0ZSgpKSByZXR1cm5cblxuICAgICAgICByZXR1cm4gc3RhdGVcbiAgICB9XG59IiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEltcG9ydEZpbGUsIHtBZGRFeHRlbnNpb24sIFJlcXVpcmVPbmNlfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0UmVxdWlyZShhcnJheTogc3RyaW5nW10sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBhcnJheUZ1bmNTZXJ2ZXIgPSBbXTtcbiAgICBmb3IgKGxldCBpIG9mIGFycmF5KSB7XG4gICAgICAgIGkgPSBBZGRFeHRlbnNpb24oaSk7XG5cbiAgICAgICAgY29uc3QgYiA9IGF3YWl0IEltcG9ydEZpbGUoJ3Jvb3QgZm9sZGVyIChXV1cpJywgaSwgZ2V0VHlwZXMuU3RhdGljLCBpc0RlYnVnKTtcbiAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIuU3RhcnRTZXJ2ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJyYXlGdW5jU2VydmVyLnB1c2goYi5TdGFydFNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmludC5sb2coYENhbid0IGZpbmQgU3RhcnRTZXJ2ZXIgZnVuY3Rpb24gYXQgbW9kdWxlIC0gJHtpfVxcbmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RnVuY1NlcnZlcjtcbn1cblxubGV0IGxhc3RTZXR0aW5nc0ltcG9ydDogbnVtYmVyO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldFNldHRpbmdzKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pe1xuICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoICsgJy50cycpKXtcbiAgICAgICAgZmlsZVBhdGggKz0gJy50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggKz0gJy5qcydcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlVGltZSA9IDxhbnk+YXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbClcblxuICAgIGlmKGNoYW5nZVRpbWUgPT0gbGFzdFNldHRpbmdzSW1wb3J0IHx8ICFjaGFuZ2VUaW1lKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsYXN0U2V0dGluZ3NJbXBvcnQgPSBjaGFuZ2VUaW1lO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBSZXF1aXJlT25jZShmaWxlUGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIGRhdGEuZGVmYXVsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmdzRGF0ZSgpe1xuICAgIHJldHVybiBsYXN0U2V0dGluZ3NJbXBvcnRcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEltcG9ydEZpbGUgfSBmcm9tIFwiLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gXCIuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcywgeyBEaXJlbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gXCIuL0NvbXBpbGVTdGF0ZVwiO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSB9IGZyb20gXCIuL0ZpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9W107XG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2NhbkZpbGVzKCl7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLlN0YXRpYywgJycsIHN0YXRlKSxcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5Mb2dzLCAnJywgc3RhdGUpXG4gICAgXSlcbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWJ1Z1NpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyl7XG4gICAgcmV0dXJuIGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBhd2FpdCBzY2FuRmlsZXMoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB7IHJvdXRpbmcsIGRldmVsb3BtZW50IH0gPSBFeHBvcnQ7XG4gICAgaWYgKCFyb3V0aW5nLnNpdGVtYXApIHJldHVybjtcblxuICAgIGNvbnN0IHNpdGVtYXAgPSByb3V0aW5nLnNpdGVtYXAgPT09IHRydWUgPyB7fSA6IHJvdXRpbmcuc2l0ZW1hcDtcbiAgICBPYmplY3QuYXNzaWduKHNpdGVtYXAsIHtcbiAgICAgICAgcnVsZXM6IHRydWUsXG4gICAgICAgIHVybFN0b3A6IGZhbHNlLFxuICAgICAgICBlcnJvclBhZ2VzOiBmYWxzZSxcbiAgICAgICAgdmFsaWRQYXRoOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWdlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHVybHM6IC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGZvciAobGV0IFt1cmwsIHR5cGVdIG9mIHN0YXRlLnBhZ2VzKSB7XG5cbiAgICAgICAgaWYodHlwZSAhPSBnZXRUeXBlcy5TdGF0aWNbMl0gfHwgIXVybC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHVybCA9ICcvJyArIHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgaWYocGF0aC5leHRuYW1lKHVybCkgPT0gJy5zZXJ2JylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnVybFN0b3ApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gcGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2l0ZW1hcC5ydWxlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcucnVsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXdhaXQgcm91dGluZy5ydWxlc1twYXRoXSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoZW5kcyA9PiB1cmwuZW5kc1dpdGgoJy4nK2VuZHMpKSB8fFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVQYXRocy5maW5kKHN0YXJ0ID0+IHVybC5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2Ygcm91dGluZy52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWF3YWl0IGZ1bmModXJsKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2l0ZW1hcC5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVycm9yIGluIHJvdXRpbmcuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSAnLycgKyByb3V0aW5nLmVycm9yUGFnZXNbZXJyb3JdLnBhdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFnZXMucHVzaCh1cmwpO1xuICAgIH1cblxuICAgIGxldCB3cml0ZSA9IHRydWU7XG4gICAgaWYgKHNpdGVtYXAuZmlsZSkge1xuICAgICAgICBjb25zdCBmaWxlQWN0aW9uID0gYXdhaXQgSW1wb3J0RmlsZSgnU2l0ZW1hcCBJbXBvcnQnLCBzaXRlbWFwLmZpbGUsIGdldFR5cGVzLlN0YXRpYywgZGV2ZWxvcG1lbnQpO1xuICAgICAgICBpZighZmlsZUFjdGlvbj8uU2l0ZW1hcCl7XG4gICAgICAgICAgICBkdW1wLndhcm4oJ1xcJ1NpdGVtYXBcXCcgZnVuY3Rpb24gbm90IGZvdW5kIG9uIGZpbGUgLT4gJysgc2l0ZW1hcC5maWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdyaXRlID0gYXdhaXQgZmlsZUFjdGlvbi5TaXRlbWFwKHBhZ2VzLCBzdGF0ZSwgRXhwb3J0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKHdyaXRlICYmIHBhZ2VzLmxlbmd0aCl7XG4gICAgICAgIGNvbnN0IHBhdGggPSB3cml0ZSA9PT0gdHJ1ZSA/ICdzaXRlbWFwLnR4dCc6IHdyaXRlO1xuICAgICAgICBzdGF0ZS5hZGRGaWxlKHBhdGgpO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGdldFR5cGVzLlN0YXRpY1swXSArIHBhdGgsIHBhZ2VzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG59IiwgIi8qKlxuICogQ2hlY2sgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggb25lIG9mIHRoZSBnaXZlbiBmaWxlIHR5cGVzLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXMgLSBhbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaWxlVHlwZSh0eXBlczogc3RyaW5nW10sIG5hbWU6IHN0cmluZykge1xuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoJy4nICsgdHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxhc3QgZG90IGFuZCBldmVyeXRoaW5nIGFmdGVyIGl0IGZyb20gYSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHJlbW92ZSB0aGUgZW5kIHR5cGUgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aG91dCB0aGUgbGFzdCBjaGFyYWN0ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZW1vdmVFbmRUeXBlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufSIsICJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgRmlsZXMgfSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgUmVxdWlyZUZpbGUgZnJvbSAnLi9JbXBvcnRGaWxlUnVudGltZSc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuXG5jb25zdCBFeHBvcnQgPSB7XG4gICAgUGFnZUxvYWRSYW06IHt9LFxuICAgIFBhZ2VSYW06IHRydWVcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSB0eXBlQXJyYXkgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoIHRvIHRoZVxuICogZmlsZS5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgZGljdGlvbmFyeSBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7YW55fSBEYXRhT2JqZWN0IC0gVGhlIGRhdGEgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVQYWdlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBSZXFGaWxlUGF0aCA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcbiAgICBjb25zdCByZXNNb2RlbCA9ICgpID0+IFJlcUZpbGVQYXRoLm1vZGVsKERhdGFPYmplY3QpO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBpZiAoUmVxRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKCFEYXRhT2JqZWN0LmlzRGVidWcpXG4gICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcblxuICAgICAgICBpZiAoUmVxRmlsZVBhdGguZGF0ZSA9PSAtMSkge1xuICAgICAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKFJlcUZpbGVQYXRoLnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWZpbGVFeGlzdHMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICghZXh0bmFtZSkge1xuICAgICAgICBleHRuYW1lID0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgZmlsZVBhdGggKz0gJy4nICsgZXh0bmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFBhdGg6IHN0cmluZztcbiAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFsxXSA9PSAnLycpXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlUGF0aClcbiAgICB9IGVsc2VcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoIVtCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnRdLmluY2x1ZGVzKGV4dG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICBEYXRhT2JqZWN0LndyaXRlKGltcG9ydFRleHQpO1xuICAgICAgICByZXR1cm4gaW1wb3J0VGV4dDtcbiAgICB9XG5cbiAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCk7XG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7Y29weVBhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtfX2ZpbGVuYW1lfSdgXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogKCkgPT4geyB9LCBkYXRlOiAtMSwgcGF0aDogZnVsbFBhdGggfTtcbiAgICAgICAgcmV0dXJuIExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBGb3JTYXZlUGF0aCA9IHR5cGVBcnJheVsyXSArICcvJyArIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSBleHRuYW1lLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IHJlQnVpbGQgPSBEYXRhT2JqZWN0LmlzRGVidWcgJiYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKEZvclNhdmVQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoZmlsZVBhdGgsIHR5cGVBcnJheSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdICYmICFyZUJ1aWxkKSB7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF1bMF0gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbChEYXRhT2JqZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jID0gYXdhaXQgTG9hZFBhZ2UoRm9yU2F2ZVBhdGgsIGV4dG5hbWUpO1xuICAgIGlmIChFeHBvcnQuUGFnZVJhbSkge1xuICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdWzBdID0gZnVuYztcbiAgICB9XG5cbiAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBmdW5jIH07XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMoRGF0YU9iamVjdCk7XG59XG5cbmNvbnN0IEdsb2JhbFZhciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRGdWxsUGF0aENvbXBpbGUodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIHJldHVybiB0eXBlQXJyYXlbMV0gKyBTcGxpdEluZm9bMV0gKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UgKyAnLmNqcyc7XG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIHBhZ2UgdG8gbG9hZC5cbiAqIEBwYXJhbSBleHQgLSBUaGUgZXh0ZW5zaW9uIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlKHVybDogc3RyaW5nLCBleHQgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG5cbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIGNvbnN0IExhc3RSZXF1aXJlID0ge307XG5cbiAgICBmdW5jdGlvbiBfcmVxdWlyZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gUmVxdWlyZUZpbGUocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmNsdWRlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nLCBXaXRoT2JqZWN0ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVQYWdlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgeyAuLi5XaXRoT2JqZWN0LCAuLi5EYXRhT2JqZWN0IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF90cmFuc2ZlcihwOiBzdHJpbmcsIHByZXNlcnZlRm9ybTogYm9vbGVhbiwgd2l0aE9iamVjdDogYW55LCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ID0gJyc7XG5cbiAgICAgICAgaWYgKCFwcmVzZXJ2ZUZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3REYXRhID0gRGF0YU9iamVjdC5SZXF1ZXN0LmJvZHkgPyB7fSA6IG51bGw7XG4gICAgICAgICAgICBEYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFPYmplY3QsXG4gICAgICAgICAgICAgICAgUmVxdWVzdDogeyAuLi5EYXRhT2JqZWN0LlJlcXVlc3QsIGZpbGVzOiB7fSwgcXVlcnk6IHt9LCBib2R5OiBwb3N0RGF0YSB9LFxuICAgICAgICAgICAgICAgIFBvc3Q6IHBvc3REYXRhLCBRdWVyeToge30sIEZpbGVzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgRGF0YU9iamVjdCwgcCwgd2l0aE9iamVjdCk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBTcGxpdEluZm9bMV0gKyBcIi5cIiArIGV4dCArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBkZWJ1Z19fZmlsZW5hbWUgPSB1cmwgKyBcIi5cIiArIGV4dDtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBwYXRoIC0+IFwiLCBkZWJ1Z19fZmlsZW5hbWUsIFwiLT5cIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gYDxkaXYgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPjxwPkVycm9yIHBhdGg6ICR7ZGVidWdfX2ZpbGVuYW1lfTwvcD48cD5FcnJvciBtZXNzYWdlOiAke2UubWVzc2FnZX08L3A+PC9kaXY+YDtcbiAgICB9XG59XG4vKipcbiAqIEl0IHRha2VzIGEgZnVuY3Rpb24gdGhhdCBwcmVwYXJlIGEgcGFnZSwgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIGEgcGFnZVxuICogQHBhcmFtIExvYWRQYWdlRnVuYyAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBpbiBhIHBhZ2UgdG8gZXhlY3V0ZSBvblxuICogQHBhcmFtIHtzdHJpbmd9IHJ1bl9zY3JpcHRfbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY3JpcHQgdG8gcnVuLlxuICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5cbmZ1bmN0aW9uIEJ1aWxkUGFnZShMb2FkUGFnZUZ1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gdm9pZCwgcnVuX3NjcmlwdF9uYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBQYWdlVmFyID0ge307XG5cbiAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChSZXNwb25zZTogUmVzcG9uc2UsIFJlcXVlc3Q6IFJlcXVlc3QsIFBvc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCBudWxsLCBRdWVyeTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgQ29va2llczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgU2Vzc2lvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRmlsZXM6IEZpbGVzLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG91dF9ydW5fc2NyaXB0ID0geyB0ZXh0OiAnJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nSW5mbyhzdHI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgYXNTdHJpbmcgPSBzdHI/LnRvU3RyaW5nPy4oKTtcbiAgICAgICAgICAgIGlmIChhc1N0cmluZyA9PSBudWxsIHx8IGFzU3RyaW5nLnN0YXJ0c1dpdGgoJ1tvYmplY3QgT2JqZWN0XScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0ciwgbnVsbCwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSZXNwb25zZSh0ZXh0OiBhbnkpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0ID0gJycpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlU2FmZShzdHIgPSAnJykge1xuICAgICAgICAgICAgc3RyID0gVG9TdHJpbmdJbmZvKHN0cik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcmIycgKyBpLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlY2hvKGFycjogc3RyaW5nW10sIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFycltpXTtcbiAgICAgICAgICAgICAgICB3cml0ZVNhZmUocGFyYW1zW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnIuYXQoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZGlyZWN0UGF0aDogYW55ID0gZmFsc2U7XG5cbiAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QgPSAocGF0aDogc3RyaW5nLCBzdGF0dXM/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1cyhzdGF0dXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVzcG9uc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+UmVzcG9uc2UpLnJlbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0KFJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGaWxlKGZpbGVQYXRoLCBkZWxldGVBZnRlciA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSB7IGZpbGU6IGZpbGVQYXRoLCBkZWxldGVBZnRlciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRGF0YVNlbmQgPSB7XG4gICAgICAgICAgICBzZW5kRmlsZSxcbiAgICAgICAgICAgIHdyaXRlU2FmZSxcbiAgICAgICAgICAgIHdyaXRlLFxuICAgICAgICAgICAgZWNobyxcbiAgICAgICAgICAgIHNldFJlc3BvbnNlLFxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQsXG4gICAgICAgICAgICBydW5fc2NyaXB0X25hbWUsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBQb3N0LFxuICAgICAgICAgICAgUXVlcnksXG4gICAgICAgICAgICBTZXNzaW9uLFxuICAgICAgICAgICAgRmlsZXMsXG4gICAgICAgICAgICBDb29raWVzLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIFBhZ2VWYXIsXG4gICAgICAgICAgICBHbG9iYWxWYXIsXG4gICAgICAgICAgICBjb2RlYmFzZTogJydcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IExvYWRQYWdlRnVuYyhEYXRhU2VuZCk7XG5cbiAgICAgICAgcmV0dXJuIHsgb3V0X3J1bl9zY3JpcHQ6IG91dF9ydW5fc2NyaXB0LnRleHQsIHJlZGlyZWN0UGF0aCB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHsgTG9hZFBhZ2UsIEJ1aWxkUGFnZSwgZ2V0RnVsbFBhdGhDb21waWxlLCBFeHBvcnQsIFNwbGl0Rmlyc3QgfTtcbiIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBJbXBvcnRGaWxlLCBBZGRFeHRlbnNpb24gfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5cbnR5cGUgUmVxdWlyZUZpbGVzID0ge1xuICAgIHBhdGg6IHN0cmluZ1xuICAgIHN0YXR1cz86IG51bWJlclxuICAgIG1vZGVsOiBhbnlcbiAgICBkZXBlbmRlbmNpZXM/OiBTdHJpbmdBbnlNYXBcbiAgICBzdGF0aWM/OiBib29sZWFuXG59XG5cbmNvbnN0IENhY2hlUmVxdWlyZUZpbGVzID0ge307XG5cbi8qKlxuICogSXQgbWFrZXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IGRlcGVuZGVuY2llcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzIG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIGFycmF5IG9mIGJhc2UgcGF0aHNcbiAqIEBwYXJhbSBbYmFzZVBhdGhdIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBpcyBiZWluZyBjb21waWxlZC5cbiAqIEBwYXJhbSBjYWNoZSAtIEEgY2FjaGUgb2YgdGhlIGxhc3QgdGltZSBhIGZpbGUgd2FzIG1vZGlmaWVkLlxuICogQHJldHVybnMgQSBtYXAgb2YgZGVwZW5kZW5jaWVzLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlRGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llczogU3RyaW5nQW55TWFwLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBiYXNlUGF0aCA9ICcnLCBjYWNoZSA9IHt9KSB7XG4gICAgY29uc3QgZGVwZW5kZW5jaWVzTWFwOiBTdHJpbmdBbnlNYXAgPSB7fTtcbiAgICBjb25zdCBwcm9taXNlQWxsID0gW107XG4gICAgZm9yIChjb25zdCBbZmlsZVBhdGgsIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgIHByb21pc2VBbGwucHVzaCgoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhY2hlW2Jhc2VQYXRoXSlcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVbYmFzZVBhdGhdID0gYXdhaXQgRWFzeUZzLnN0YXQodHlwZUFycmF5WzBdICsgYmFzZVBhdGgsICdtdGltZU1zJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwWyd0aGlzRmlsZSddID0gY2FjaGVbYmFzZVBhdGhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbZmlsZVBhdGhdID0gYXdhaXQgbWFrZURlcGVuZGVuY2llcyg8YW55PnZhbHVlLCB0eXBlQXJyYXksIGZpbGVQYXRoLCBjYWNoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKSgpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlQWxsKTtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzTWFwO1xufVxuXG4vKipcbiAqIElmIHRoZSBvbGQgZGVwZW5kZW5jaWVzIGFuZCB0aGUgbmV3IGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jeSBtYXAuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLlxuICovXG5mdW5jdGlvbiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShvbGREZXBzW25hbWVdLCBuZXdEZXBzW25hbWVdKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gZGVwZW5kZW5jeSB0cmVlcywgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBuYW1lcyBvZiB0aGUgbW9kdWxlcyB0aGF0IGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0gW3BhcmVudF0gLSBUaGUgbmFtZSBvZiB0aGUgcGFyZW50IG1vZHVsZS5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncy4gRWFjaCBzdHJpbmcgcmVwcmVzZW50cyBhIGNoYW5nZSBpbiB0aGUgZGVwZW5kZW5jeVxuICogdHJlZS5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXAsIHBhcmVudCA9ICcnKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNoYW5nZUFycmF5ID0gW107XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFuZXdEZXBzW25hbWVdKSB7XG4gICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBnZXRDaGFuZ2VBcnJheShvbGREZXBzW25hbWVdLCBuZXdEZXBzW25hbWVdLCBuYW1lKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2goLi4uY2hhbmdlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFuZ2VBcnJheTtcbn1cblxuLyoqXG4gKiBJdCBpbXBvcnRzIGEgZmlsZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2ZpbGVuYW1lIC0gVGhlIGZpbGVuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZGlybmFtZSAtIFRoZSBkaXJlY3Rvcnkgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBwYXRocyB0eXBlcy5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgbWFwIG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhblxuICogQHJldHVybnMgVGhlIG1vZGVsIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IFJlcXVpcmVGaWxlcyB9LCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgUmVxRmlsZSA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcblxuICAgIGxldCBmaWxlRXhpc3RzOiBudW1iZXIsIG5ld0RlcHM6IFN0cmluZ0FueU1hcDtcbiAgICBpZiAoUmVxRmlsZSkge1xuXG4gICAgICAgIGlmICghaXNEZWJ1ZyB8fCBpc0RlYnVnICYmIChSZXFGaWxlLnN0YXR1cyA9PSAtMSkpXG4gICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcblxuICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLnN0YXQodHlwZUFycmF5WzBdICsgUmVxRmlsZS5wYXRoLCAnbXRpbWVNcycsIHRydWUsIDApO1xuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuXG4gICAgICAgICAgICBuZXdEZXBzID0gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhSZXFGaWxlLmRlcGVuZGVuY2llcywgdHlwZUFycmF5KTtcblxuICAgICAgICAgICAgaWYgKGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCBuZXdEZXBzKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcblxuICAgICAgICB9IGVsc2UgaWYgKFJlcUZpbGUuc3RhdHVzID09IDApXG4gICAgICAgICAgICByZXR1cm4gUmVxRmlsZS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3B5UGF0aCA9IGZpbGVQYXRoO1xuICAgIGxldCBzdGF0aWNfbW9kdWxlcyA9IGZhbHNlO1xuXG4gICAgaWYgKCFSZXFGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpIHtcblxuICAgICAgICAgICAgaWYgKGZpbGVQYXRoWzFdID09ICcvJylcbiAgICAgICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygyKTtcblxuICAgICAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5yZWxhdGl2ZSh0eXBlQXJyYXlbMF0sIF9fZGlybmFtZSksIGZpbGVQYXRoKTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWxlUGF0aFswXSAhPSAnLycpXG4gICAgICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IHRydWU7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCA9IFJlcUZpbGUucGF0aDtcbiAgICAgICAgc3RhdGljX21vZHVsZXMgPSBSZXFGaWxlLnN0YXRpYztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGljX21vZHVsZXMpXG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEFsaWFzT3JQYWNrYWdlKGNvcHlQYXRoKSwgc3RhdHVzOiAtMSwgc3RhdGljOiB0cnVlLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgIGVsc2Uge1xuICAgICAgICAvLyBhZGQgc2Vydi5qcyBvciBzZXJ2LnRzIGlmIG5lZWRlZFxuICAgICAgICBmaWxlUGF0aCA9IEFkZEV4dGVuc2lvbihmaWxlUGF0aCk7XG5cbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSB0eXBlQXJyYXlbMF0gKyBmaWxlUGF0aDtcbiAgICAgICAgZmlsZUV4aXN0cyA9IGZpbGVFeGlzdHMgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVNb2RlbCA9IENhY2hlUmVxdWlyZUZpbGVzW2ZpbGVQYXRoXTtcbiAgICAgICAgICAgIGlmIChoYXZlTW9kZWwgJiYgY29tcGFyZURlcGVuZGVuY2llc1NhbWUoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcyA9IG5ld0RlcHMgPz8gYXdhaXQgbWFrZURlcGVuZGVuY2llcyhoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpKSlcbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSBoYXZlTW9kZWw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdEZXBzID0gbmV3RGVwcyA/PyB7fTtcblxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGF3YWl0IEltcG9ydEZpbGUoX19maWxlbmFtZSwgZmlsZVBhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgbmV3RGVwcywgaGF2ZU1vZGVsICYmIGdldENoYW5nZUFycmF5KGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKSwgZGVwZW5kZW5jaWVzOiBuZXdEZXBzLCBwYXRoOiBmaWxlUGF0aCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiB7fSwgc3RhdHVzOiAwLCBwYXRoOiBmaWxlUGF0aCB9O1xuICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtmaWxlUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBidWlsdE1vZGVsID0gTGFzdFJlcXVpcmVbY29weVBhdGhdO1xuICAgIENhY2hlUmVxdWlyZUZpbGVzW2J1aWx0TW9kZWwucGF0aF0gPSBidWlsdE1vZGVsO1xuXG4gICAgcmV0dXJuIGJ1aWx0TW9kZWwubW9kZWw7XG59IiwgImltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIHRyaW1UeXBlLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuXG4vLyAtLSBzdGFydCBvZiBmZXRjaCBmaWxlICsgY2FjaGUgLS1cblxudHlwZSBhcGlJbmZvID0ge1xuICAgIHBhdGhTcGxpdDogbnVtYmVyLFxuICAgIGRlcHNNYXA6IHsgW2tleTogc3RyaW5nXTogYW55IH1cbn1cblxuY29uc3QgYXBpU3RhdGljTWFwOiB7IFtrZXk6IHN0cmluZ106IGFwaUluZm8gfSA9IHt9O1xuXG4vKipcbiAqIEdpdmVuIGEgdXJsLCByZXR1cm4gdGhlIHN0YXRpYyBwYXRoIGFuZCBkYXRhIGluZm8gaWYgdGhlIHVybCBpcyBpbiB0aGUgc3RhdGljIG1hcFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB0aGUgdXNlciBpcyByZXF1ZXN0aW5nLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhdGhTcGxpdCAtIHRoZSBudW1iZXIgb2Ygc2xhc2hlcyBpbiB0aGUgdXJsLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAqL1xuZnVuY3Rpb24gZ2V0QXBpRnJvbU1hcCh1cmw6IHN0cmluZywgcGF0aFNwbGl0OiBudW1iZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXBpU3RhdGljTWFwKTtcbiAgICBmb3IgKGNvbnN0IGkgb2Yga2V5cykge1xuICAgICAgICBjb25zdCBlID0gYXBpU3RhdGljTWFwW2ldO1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkgJiYgZS5wYXRoU3BsaXQgPT0gcGF0aFNwbGl0KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNQYXRoOiBpLFxuICAgICAgICAgICAgICAgIGRhdGFJbmZvOiBlXG4gICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBBUEkgZmlsZSBmb3IgYSBnaXZlbiBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBBUEkuXG4gKiBAcmV0dXJucyBUaGUgcGF0aCB0byB0aGUgQVBJIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZpbmRBcGlQYXRoKHVybDogc3RyaW5nKSB7XG5cbiAgICB3aGlsZSAodXJsLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzdGFydFBhdGggPSBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzBdLCB1cmwgKyAnLmFwaScpO1xuICAgICAgICBjb25zdCBtYWtlUHJvbWlzZSA9IGFzeW5jICh0eXBlOiBzdHJpbmcpID0+IChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShzdGFydFBhdGggKyAnLicgKyB0eXBlKSAmJiB0eXBlKTtcblxuICAgICAgICBjb25zdCBmaWxlVHlwZSA9IChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgndHMnKSxcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCdqcycpXG4gICAgICAgIF0pKS5maWx0ZXIoeCA9PiB4KS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChmaWxlVHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1cmwgKyAnLmFwaS4nICsgZmlsZVR5cGU7XG5cbiAgICAgICAgdXJsID0gQ3V0VGhlTGFzdCgnLycsIHVybCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aFNwbGl0ID0gdXJsLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgIGxldCB7IHN0YXRpY1BhdGgsIGRhdGFJbmZvIH0gPSBnZXRBcGlGcm9tTWFwKHVybCwgcGF0aFNwbGl0KTtcblxuICAgIGlmICghZGF0YUluZm8pIHtcbiAgICAgICAgc3RhdGljUGF0aCA9IGF3YWl0IGZpbmRBcGlQYXRoKHVybCk7XG5cbiAgICAgICAgaWYgKHN0YXRpY1BhdGgpIHtcbiAgICAgICAgICAgIGRhdGFJbmZvID0ge1xuICAgICAgICAgICAgICAgIHBhdGhTcGxpdCxcbiAgICAgICAgICAgICAgICBkZXBzTWFwOiB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcGlTdGF0aWNNYXBbc3RhdGljUGF0aF0gPSBkYXRhSW5mbztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhSW5mbykge1xuICAgICAgICByZXR1cm4gYXdhaXQgTWFrZUNhbGwoXG4gICAgICAgICAgICBhd2FpdCBSZXF1aXJlRmlsZSgnLycgKyBzdGF0aWNQYXRoLCAnYXBpLWNhbGwnLCAnJywgZ2V0VHlwZXMuU3RhdGljLCBkYXRhSW5mby5kZXBzTWFwLCBpc0RlYnVnKSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIHVybC5zdWJzdHJpbmcoc3RhdGljUGF0aC5sZW5ndGggLSA2KSxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBuZXh0UHJhc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4vLyAtLSBlbmQgb2YgZmV0Y2ggZmlsZSAtLVxuY29uc3QgYmFuV29yZHMgPSBbJ3ZhbGlkYXRlVVJMJywgJ3ZhbGlkYXRlRnVuYycsICdmdW5jJywgJ2RlZmluZScsIC4uLmh0dHAuTUVUSE9EU107XG4vKipcbiAqIEZpbmQgdGhlIEJlc3QgUGF0aFxuICovXG5mdW5jdGlvbiBmaW5kQmVzdFVybE9iamVjdChvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nKSB7XG4gICAgbGV0IG1heExlbmd0aCA9IDAsIHVybCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBpLmxlbmd0aDtcbiAgICAgICAgaWYgKG1heExlbmd0aCA8IGxlbmd0aCAmJiB1cmxGcm9tLnN0YXJ0c1dpdGgoaSkgJiYgIWJhbldvcmRzLmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBsZW5ndGg7XG4gICAgICAgICAgICB1cmwgPSBpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBQYXJzZSBBbmQgVmFsaWRhdGUgVVJMXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlVVJMRGF0YSh2YWxpZGF0ZTogYW55LCB2YWx1ZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBsZXQgcHVzaERhdGEgPSB2YWx1ZSwgcmVzRGF0YSA9IHRydWUsIGVycm9yOiBzdHJpbmc7XG5cbiAgICBzd2l0Y2ggKHZhbGlkYXRlKSB7XG4gICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICBjYXNlIHBhcnNlRmxvYXQ6XG4gICAgICAgIGNhc2UgcGFyc2VJbnQ6XG4gICAgICAgICAgICBwdXNoRGF0YSA9ICg8YW55PnZhbGlkYXRlKSh2YWx1ZSk7XG4gICAgICAgICAgICByZXNEYXRhID0gIWlzTmFOKHB1c2hEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICBwdXNoRGF0YSA9IHZhbHVlICE9ICdmYWxzZSc7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXNEYXRhID0gdmFsdWUgPT0gJ3RydWUnIHx8IHZhbHVlID09ICdmYWxzZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdGUpKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ha2VWYWxpZCA9IGF3YWl0IHZhbGlkYXRlKHZhbHVlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWtlVmFsaWQgJiYgdHlwZW9mIG1ha2VWYWxpZCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZC52YWxpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hEYXRhID0gbWFrZVZhbGlkLnBhcnNlID8/IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQ7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvciwgZmlsZWQgLSAnICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUudGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNEYXRhKVxuICAgICAgICBlcnJvciA9ICdFcnJvciB2YWxpZGF0ZSBmaWxlZCAtICcgKyB2YWx1ZTtcblxuICAgIHJldHVybiBbZXJyb3IsIHB1c2hEYXRhXTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyB0aGUgVVJMIGRhdGEgYW5kIHBhcnNlcyBpdCBpbnRvIGFuIG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBvYmogLSB0aGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIFVSTCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIFRoZSBVUkwgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0ge2FueX0gZGVmaW5lT2JqZWN0IC0gQWxsIHRoZSBkZWZpbml0aW9ucyB0aGF0IGhhcyBiZWVuIGZvdW5kXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0gbWFrZU1hc3NhZ2UgLSBDcmVhdGUgYW4gZXJyb3IgbWVzc2FnZVxuICogQHJldHVybnMgQSBzdHJpbmcgb3IgYW4gb2JqZWN0IHdpdGggYW4gZXJyb3IgcHJvcGVydHkuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZWZpbml0aW9uKG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGRlZmluZU9iamVjdDogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBpZiAoIW9iai5kZWZpbmUpXG4gICAgICAgIHJldHVybiB1cmxGcm9tO1xuXG4gICAgY29uc3QgdmFsaWRhdGVGdW5jID0gb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG4gICAgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmMgPSBudWxsO1xuICAgIGRlbGV0ZSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvYmouZGVmaW5lKSB7XG4gICAgICAgIGNvbnN0IFtkYXRhU2xhc2gsIG5leHRVcmxGcm9tXSA9IFNwbGl0Rmlyc3QoJy8nLCB1cmxGcm9tKTtcbiAgICAgICAgdXJsRnJvbSA9IG5leHRVcmxGcm9tO1xuXG4gICAgICAgIGNvbnN0IFtlcnJvciwgbmV3RGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEob2JqLmRlZmluZVtuYW1lXSwgZGF0YVNsYXNoLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgIGlmKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHtlcnJvcn07XG4gICAgICAgIFxuICAgICAgICBkZWZpbmVPYmplY3RbbmFtZV0gPSBuZXdEYXRhO1xuICAgIH1cblxuICAgIGlmICh2YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IHZhbGlkYXRlRnVuYyhkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnID8gdmFsaWRhdGU6ICdFcnJvciB2YWxpZGF0aW5nIFVSTCd9O1xuICAgIH1cblxuICAgIHJldHVybiB1cmxGcm9tO1xufVxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gd2lsbCBwYXJzZSB0aGUgdXJsIGFuZCBmaW5kIHRoZSBiZXN0IG1hdGNoIGZvciB0aGUgdXJsXG4gKiBAcGFyYW0ge2FueX0gZmlsZU1vZHVsZSAtIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgbWV0aG9kIHRoYXQgeW91IHdhbnQgdG8gY2FsbC5cbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gdGhlIHVybCB0aGF0IHRoZSB1c2VyIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gKCkgPT4gUHJvbWlzZTxhbnk+XG4gKiBAcmV0dXJucyBhIGJvb2xlYW4gdmFsdWUuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUsIHRoZSByZXF1ZXN0IGlzIHByb2Nlc3NlZC4gSWYgdGhlIGZ1bmN0aW9uXG4gKiByZXR1cm5zIGZhbHNlLCB0aGUgcmVxdWVzdCBpcyBub3QgcHJvY2Vzc2VkLlxuICovXG5hc3luYyBmdW5jdGlvbiBNYWtlQ2FsbChmaWxlTW9kdWxlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsbG93RXJyb3JJbmZvID0gIUdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSAmJiBpc0RlYnVnLCBtYWtlTWFzc2FnZSA9IChlOiBhbnkpID0+IChpc0RlYnVnID8gcHJpbnQuZXJyb3IoZSkgOiBudWxsKSArIChhbGxvd0Vycm9ySW5mbyA/IGAsIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWAgOiAnJyk7XG4gICAgY29uc3QgbWV0aG9kID0gUmVxdWVzdC5tZXRob2Q7XG4gICAgbGV0IG1ldGhvZE9iaiA9IGZpbGVNb2R1bGVbbWV0aG9kXSB8fCBmaWxlTW9kdWxlLmRlZmF1bHRbbWV0aG9kXTsgLy9Mb2FkaW5nIHRoZSBtb2R1bGUgYnkgbWV0aG9kXG4gICAgbGV0IGhhdmVNZXRob2QgPSB0cnVlO1xuXG4gICAgaWYoIW1ldGhvZE9iail7XG4gICAgICAgIGhhdmVNZXRob2QgPSBmYWxzZTtcbiAgICAgICAgbWV0aG9kT2JqID0gZmlsZU1vZHVsZS5kZWZhdWx0IHx8IGZpbGVNb2R1bGU7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZU1ldGhvZCA9IG1ldGhvZE9iajtcblxuICAgIGNvbnN0IGRlZmluZU9iamVjdCA9IHt9O1xuXG4gICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpOyAvLyByb290IGxldmVsIGRlZmluaXRpb25cbiAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcblxuICAgIGxldCBuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pO1xuXG4gICAgLy9wYXJzZSB0aGUgdXJsIHBhdGhcbiAgICBmb3IobGV0IGkgPSAwOyBpPCAyOyBpKyspe1xuICAgICAgICB3aGlsZSAoKG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSkpKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG4gICAgICAgICAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgICAgICAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuICAgIFxuICAgICAgICAgICAgdXJsRnJvbSA9IHRyaW1UeXBlKCcvJywgdXJsRnJvbS5zdWJzdHJpbmcobmVzdGVkVVJMLmxlbmd0aCkpO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW25lc3RlZFVSTF07XG4gICAgICAgIH1cblxuICAgICAgICBpZighaGF2ZU1ldGhvZCl7IC8vIGNoZWNrIGlmIHRoYXQgYSBtZXRob2RcbiAgICAgICAgICAgIGhhdmVNZXRob2QgPSB0cnVlO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW21ldGhvZF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXRob2RPYmogPSBtZXRob2RPYmo/LmZ1bmMgJiYgbWV0aG9kT2JqIHx8IGJhc2VNZXRob2Q7IC8vIGlmIHRoZXJlIGlzIGFuICdhbnknIG1ldGhvZFxuXG5cbiAgICBpZiAoIW1ldGhvZE9iaj8uZnVuYylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgbGVmdERhdGEgPSB1cmxGcm9tLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgdXJsRGF0YSA9IFtdO1xuXG5cbiAgICBsZXQgZXJyb3I6IHN0cmluZztcbiAgICBpZiAobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCB2YWxpZGF0ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSkge1xuICAgICAgICAgICAgY29uc3QgW2Vycm9yVVJMLCBwdXNoRGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEodmFsaWRhdGUsIGxlZnREYXRhW2luZGV4XSwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yVVJMKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSA8c3RyaW5nPmVycm9yVVJMO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cmxEYXRhLnB1c2gocHVzaERhdGEpO1xuICAgICAgICB9XG4gICAgfSBlbHNlXG4gICAgICAgIHVybERhdGEucHVzaCguLi5sZWZ0RGF0YSk7XG5cbiAgICBpZiAoIWVycm9yICYmIG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMobGVmdERhdGEsIFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIGVycm9yID0gdmFsaWRhdGU7XG4gICAgICAgIGVsc2UgaWYgKCF2YWxpZGF0ZSlcbiAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJztcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgZXJyb3IgfSk7XG5cbiAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBsZXQgYXBpUmVzcG9uc2U6IGFueSwgbmV3UmVzcG9uc2U6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBhcGlSZXNwb25zZSA9IGF3YWl0IG1ldGhvZE9iai5mdW5jKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhLCBkZWZpbmVPYmplY3QsIGxlZnREYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChhbGxvd0Vycm9ySW5mbylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogZS5tZXNzYWdlIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiAnNTAwIC0gSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYXBpUmVzcG9uc2UgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgdGV4dDogYXBpUmVzcG9uc2UgfTtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0gYXBpUmVzcG9uc2U7XG5cbiAgICBmaW5hbFN0ZXAoKTsgIC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgIGlmIChuZXdSZXNwb25zZSAhPSBudWxsKVxuICAgICAgICBSZXNwb25zZS5qc29uKG5ld1Jlc3BvbnNlKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3N9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSBhcyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgR2V0RmlsZSBhcyBHZXRTdGF0aWNGaWxlLCBzZXJ2ZXJCdWlsZCB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgKiBhcyBGdW5jU2NyaXB0IGZyb20gJy4vRnVuY3Rpb25TY3JpcHQnO1xuaW1wb3J0IE1ha2VBcGlDYWxsIGZyb20gJy4vQXBpQ2FsbCc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmNvbnN0IHsgRXhwb3J0IH0gPSBGdW5jU2NyaXB0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yUGFnZXMge1xuICAgIG5vdEZvdW5kPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9LFxuICAgIHNlcnZlckVycm9yPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9XG59XG5cbmludGVyZmFjZSBHZXRQYWdlc1NldHRpbmdzIHtcbiAgICBDYWNoZURheXM6IG51bWJlcixcbiAgICBQYWdlUmFtOiBib29sZWFuLFxuICAgIERldk1vZGU6IGJvb2xlYW4sXG4gICAgQ29va2llU2V0dGluZ3M/OiBhbnksXG4gICAgQ29va2llcz86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIENvb2tpZUVuY3J5cHRlcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIFNlc3Npb25TdG9yZT86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIEVycm9yUGFnZXM6IEVycm9yUGFnZXNcbn1cblxuY29uc3QgU2V0dGluZ3M6IEdldFBhZ2VzU2V0dGluZ3MgPSB7XG4gICAgQ2FjaGVEYXlzOiAxLFxuICAgIFBhZ2VSYW06IGZhbHNlLFxuICAgIERldk1vZGU6IHRydWUsXG4gICAgRXJyb3JQYWdlczoge31cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2VUb1JhbSh1cmw6IHN0cmluZykge1xuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdW5jU2NyaXB0LmdldEZ1bGxQYXRoQ29tcGlsZSh1cmwpKSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXSA9IFtdO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSA9IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2UodXJsKTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSwgdXJsKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRBbGxQYWdlc1RvUmFtKCkge1xuICAgIGZvciAoY29uc3QgaSBpbiBwYWdlRGVwcy5zdG9yZSkge1xuICAgICAgICBpZiAoIUV4dGVuc2lvbkluQXJyYXkoaSwgPGFueT5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5KSlcbiAgICAgICAgICAgIGF3YWl0IExvYWRQYWdlVG9SYW0oaSk7XG5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIENsZWFyQWxsUGFnZXNGcm9tUmFtKCkge1xuICAgIGZvciAoY29uc3QgaSBpbiBFeHBvcnQuUGFnZUxvYWRSYW0pIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBkZWxldGUgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gRXh0ZW5zaW9uSW5BcnJheShmaWxlUGF0aDogc3RyaW5nLCAuLi5hcnJheXM6IHN0cmluZ1tdKSB7XG4gICAgZmlsZVBhdGggPSBmaWxlUGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgIGZvciAoY29uc3QgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheSkge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoLnN1YnN0cmluZyhmaWxlUGF0aC5sZW5ndGggLSBpLmxlbmd0aCAtIDEpID09ICcuJyArIGkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIEdldEVycm9yUGFnZShjb2RlOiBudW1iZXIsIExvY1NldHRpbmdzOiAnbm90Rm91bmQnIHwgJ3NlcnZlckVycm9yJykge1xuICAgIGxldCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZztcbiAgICBpZiAoU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10pIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljO1xuICAgICAgICB1cmwgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5wYXRoO1xuICAgICAgICBjb2RlID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10uY29kZSA/PyBjb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLkxvZ3M7XG4gICAgICAgIHVybCA9ICdlJyArIGNvZGU7XG4gICAgfVxuICAgIHJldHVybiB7IHVybCwgYXJyYXlUeXBlLCBjb2RlIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VCYXNpY0luZm8oUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBjb2RlOiBudW1iZXIpIHtcbiAgICAvL2ZpcnN0IHN0ZXAgLSBwYXJzZSBpbmZvXG4gICAgaWYgKFJlcXVlc3QubWV0aG9kID09IFwiUE9TVFwiKSB7XG4gICAgICAgIGlmICghUmVxdWVzdC5ib2R5IHx8ICFPYmplY3Qua2V5cyhSZXF1ZXN0LmJvZHkpLmxlbmd0aClcbiAgICAgICAgICAgIFJlcXVlc3QuYm9keSA9IFJlcXVlc3QuZmllbGRzIHx8IHt9O1xuXG4gICAgfSBlbHNlXG4gICAgICAgIFJlcXVlc3QuYm9keSA9IGZhbHNlO1xuXG5cbiAgICBpZiAoUmVxdWVzdC5jbG9zZWQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVzKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLlNlc3Npb25TdG9yZShSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuXG4gICAgUmVxdWVzdC5zaWduZWRDb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzIHx8IHt9O1xuICAgIFJlcXVlc3QuZmlsZXMgPSBSZXF1ZXN0LmZpbGVzIHx8IHt9O1xuXG4gICAgY29uc3QgQ29weUNvb2tpZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llcykpO1xuICAgIFJlcXVlc3QuY29va2llcyA9IFJlcXVlc3Quc2lnbmVkQ29va2llcztcblxuICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDE7XG5cbiAgICAvL3NlY29uZCBzdGVwXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMSlcbiAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSBjb2RlO1xuXG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3Quc2lnbmVkQ29va2llcykgey8vdXBkYXRlIGNvb2tpZXNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9ICdvYmplY3QnICYmIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSBDb3B5Q29va2llc1tpXSB8fCBKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0pICE9IEpTT04uc3RyaW5naWZ5KENvcHlDb29raWVzW2ldKSlcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jb29raWUoaSwgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldLCBTZXR0aW5ncy5Db29raWVTZXR0aW5ncyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBDb3B5Q29va2llcykgey8vZGVsZXRlIG5vdCBleGl0cyBjb29raWVzXG4gICAgICAgICAgICBpZiAoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY2xlYXJDb29raWUoaSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9mb3IgZmluYWwgc3RlcFxuZnVuY3Rpb24gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnkpIHtcbiAgICBpZiAoIVJlcXVlc3QuZmlsZXMpIC8vZGVsZXRlIGZpbGVzXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgY29uc3QgYXJyUGF0aCA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5maWxlcykge1xuXG4gICAgICAgIGNvbnN0IGUgPSBSZXF1ZXN0LmZpbGVzW2ldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIGluIGUpIHtcbiAgICAgICAgICAgICAgICBhcnJQYXRoLnB1c2goZVthXS5maWxlcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGUuZmlsZXBhdGgpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGFyclBhdGg7XG59XG5cbi8vZmluYWwgc3RlcFxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUmVxdWVzdEZpbGVzKGFycmF5OiBzdHJpbmdbXSkge1xuICAgIGZvcihjb25zdCBlIGluIGFycmF5KVxuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGlzVVJMUGF0aEFGaWxlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIHVybDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBjb2RlOiBudW1iZXIpIHtcbiAgICBsZXQgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMl07XG4gICAgbGV0IGZpbGUgPSBmYWxzZTtcblxuICAgIGlmIChjb2RlID09IDIwMCkge1xuICAgICAgICBmdWxsUGFnZVVybCA9IGdldFR5cGVzLlN0YXRpY1swXSArIHVybDtcbiAgICAgICAgLy9jaGVjayB0aGF0IGlzIG5vdCBzZXJ2ZXIgZmlsZVxuICAgICAgICBpZiAoYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgU2V0dGluZ3MuRGV2TW9kZSwgdXJsKSB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgICAgICBmaWxlID0gdHJ1ZTtcbiAgICAgICAgZWxzZSAgLy8gdGhlbiBpdCBhIHNlcnZlciBwYWdlIG9yIGVycm9yIHBhZ2VcbiAgICAgICAgICAgIGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzJdO1xuICAgIH1cblxuICAgIHJldHVybiB7IGZpbGUsIGZ1bGxQYWdlVXJsIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYWdlQXJyYXkgPSBbYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZShzbWFsbFBhdGgpXTtcblxuICAgIHBhZ2VBcnJheVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKHBhZ2VBcnJheVswXSwgc21hbGxQYXRoKTtcblxuICAgIGlmIChTZXR0aW5ncy5QYWdlUmFtKVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSA9IHBhZ2VBcnJheTtcblxuICAgIHJldHVybiBwYWdlQXJyYXlbMV07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkUGFnZVVSTChhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGxldCBmdWxsUGFnZVVybDogc3RyaW5nO1xuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShhcnJheVR5cGVbMF0gKyB1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSkge1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBHZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcblxuICAgICAgICB1cmwgPSBFcnJvclBhZ2UudXJsO1xuICAgICAgICBhcnJheVR5cGUgPSBFcnJvclBhZ2UuYXJyYXlUeXBlO1xuICAgICAgICBjb2RlID0gRXJyb3JQYWdlLmNvZGU7XG5cbiAgICAgICAgc21hbGxQYXRoID0gYXJyYXlUeXBlWzJdICsgJy8nICsgdXJsO1xuICAgICAgICBmdWxsUGFnZVVybCA9IHVybCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVswXSArIGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIGZ1bGxQYWdlVXJsID0gbnVsbDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMV0gKyBmdWxsUGFnZVVybCArICcuY2pzJztcblxuICAgIH0gZWxzZVxuICAgICAgICBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsxXSArIHVybCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSArICcuY2pzJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFycmF5VHlwZSxcbiAgICAgICAgZnVsbFBhZ2VVcmwsXG4gICAgICAgIHNtYWxsUGF0aCxcbiAgICAgICAgY29kZSxcbiAgICAgICAgdXJsXG4gICAgfVxufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBsb2FkIHRoZSBkeW5hbWljIHBhZ2VcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIFRoZSBhcnJheSBvZiB0eXBlcyB0aGF0IHRoZSBwYWdlIGlzLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZ1bGxQYWdlVXJsIC0gVGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzbWFsbFBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZSBmaWxlLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBUaGUgc3RhdHVzIGNvZGUgb2YgdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBUaGUgRHluYW1pY0Z1bmMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgdG8gZ2VuZXJhdGUgdGhlIHBhZ2UuXG4gKiBUaGUgY29kZSBpcyB0aGUgc3RhdHVzIGNvZGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICogVGhlIGZ1bGxQYWdlVXJsIGlzIHRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldER5bmFtaWNQYWdlKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBmdWxsUGFnZVVybDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgY29uc3QgU2V0TmV3VVJMID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBidWlsZCA9IGF3YWl0IEJ1aWxkUGFnZVVSTChhcnJheVR5cGUsIHVybCwgc21hbGxQYXRoLCBjb2RlKTtcbiAgICAgICAgc21hbGxQYXRoID0gYnVpbGQuc21hbGxQYXRoLCB1cmwgPSBidWlsZC51cmwsIGNvZGUgPSBidWlsZC5jb2RlLCBmdWxsUGFnZVVybCA9IGJ1aWxkLmZ1bGxQYWdlVXJsLCBhcnJheVR5cGUgPSBidWlsZC5hcnJheVR5cGU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBEeW5hbWljRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiBhbnk7XG4gICAgaWYgKFNldHRpbmdzLkRldk1vZGUgJiYgYXdhaXQgU2V0TmV3VVJMKCkgJiYgZnVsbFBhZ2VVcmwpIHtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2Uoc21hbGxQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUodXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgYXJyYXlUeXBlKTtcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0pIHtcblxuICAgICAgICAgICAgaWYgKCFFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXSkge1xuICAgICAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMF0sIHNtYWxsUGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKFNldHRpbmdzLlBhZ2VSYW0pXG4gICAgICAgICAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdID0gRHluYW1pY0Z1bmM7XG5cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cblxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG5cbiAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdKVxuICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG4gICAgZWxzZSBpZiAoIVNldHRpbmdzLlBhZ2VSYW0gJiYgYXdhaXQgU2V0TmV3VVJMKCkgJiYgZnVsbFBhZ2VVcmwpXG4gICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgZWxzZSB7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kPy5jb2RlID8/IDQwNDtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gU2V0dGluZ3MuRXJyb3JQYWdlcy5ub3RGb3VuZCAmJiBFeHBvcnQuUGFnZUxvYWRSYW1bZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgU2V0dGluZ3MuRXJyb3JQYWdlcy5ub3RGb3VuZC5wYXRoXSB8fCBFeHBvcnQuUGFnZUxvYWRSYW1bZ2V0VHlwZXMuTG9nc1syXSArICcvZTQwNCddO1xuXG4gICAgICAgIGlmIChFcnJvclBhZ2UpXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IEVycm9yUGFnZVsxXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIER5bmFtaWNGdW5jLFxuICAgICAgICBjb2RlLFxuICAgICAgICBmdWxsUGFnZVVybFxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTWFrZVBhZ2VSZXNwb25zZShEeW5hbWljUmVzcG9uc2U6IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55KSB7XG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGg/LmZpbGUpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IFJlc3BvbnNlLm9uKCdmaW5pc2gnLCByZXMpKTtcbiAgICB9IGVsc2UgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGgpIHtcbiAgICAgICAgUmVzcG9uc2Uud3JpdGVIZWFkKDMwMiwgeyBMb2NhdGlvbjogRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCB9KTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgUmVzUGFnZSA9IER5bmFtaWNSZXNwb25zZS5vdXRfcnVuX3NjcmlwdC50cmltKCk7XG4gICAgICAgIGlmIChSZXNQYWdlKSB7XG4gICAgICAgICAgICBSZXNwb25zZS5zZW5kKFJlc1BhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5kZWxldGVBZnRlcikge1xuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gYSBwYWdlLiBcbiAqIEl0IHdpbGwgY2hlY2sgaWYgdGhlIHBhZ2UgZXhpc3RzLCBhbmQgaWYgaXQgZG9lcywgaXQgd2lsbCByZXR1cm4gdGhlIHBhZ2UuIFxuICogSWYgaXQgZG9lcyBub3QgZXhpc3QsIGl0IHdpbGwgcmV0dXJuIGEgNDA0IHBhZ2VcbiAqIEBwYXJhbSB7UmVxdWVzdCB8IGFueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aHNcbiAqIGxvYWRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBwYWdlIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7eyBmaWxlOiBib29sZWFuLCBmdWxsUGFnZVVybDogc3RyaW5nIH19IEZpbGVJbmZvIC0gdGhlIGZpbGUgaW5mbyBvZiB0aGUgcGFnZSB0aGF0IGlzIGJlaW5nIGFjdGl2YXRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gbnVtYmVyXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBhZnRlciB0aGUgZHluYW1pYyBwYWdlXG4gKiBpcyBsb2FkZWQuXG4gKiBAcmV0dXJucyBOb3RoaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBBY3RpdmF0ZVBhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgRmlsZUluZm86IGFueSwgY29kZTogbnVtYmVyLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IHsgRHluYW1pY0Z1bmMsIGZ1bGxQYWdlVXJsLCBjb2RlOiBuZXdDb2RlIH0gPSBhd2FpdCBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgRmlsZUluZm8uZnVsbFBhZ2VVcmwsIEZpbGVJbmZvLmZ1bGxQYWdlVXJsICsgJy8nICsgdXJsLCBjb2RlKTtcblxuICAgIGlmICghZnVsbFBhZ2VVcmwgfHwgIUR5bmFtaWNGdW5jICYmIGNvZGUgPT0gNTAwKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2Uuc2VuZFN0YXR1cyhuZXdDb2RlKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cbiAgICAgICAgY29uc3QgcGFnZURhdGEgPSBhd2FpdCBEeW5hbWljRnVuYyhSZXNwb25zZSwgUmVxdWVzdCwgUmVxdWVzdC5ib2R5LCBSZXF1ZXN0LnF1ZXJ5LCBSZXF1ZXN0LmNvb2tpZXMsIFJlcXVlc3Quc2Vzc2lvbiwgUmVxdWVzdC5maWxlcywgU2V0dGluZ3MuRGV2TW9kZSk7XG4gICAgICAgIGZpbmFsU3RlcCgpOyAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICAgICAgYXdhaXQgTWFrZVBhZ2VSZXNwb25zZShcbiAgICAgICAgICAgIHBhZ2VEYXRhLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIHByaW50LmVycm9yKGUpO1xuICAgICAgICBSZXF1ZXN0LmVycm9yID0gZTtcblxuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBHZXRFcnJvclBhZ2UoNTAwLCAnc2VydmVyRXJyb3InKTtcblxuICAgICAgICBEeW5hbWljUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIER5bmFtaWNQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYywgY29kZSA9IDIwMCkge1xuICAgIGNvbnN0IEZpbGVJbmZvID0gYXdhaXQgaXNVUkxQYXRoQUZpbGUoUmVxdWVzdCwgdXJsLCBhcnJheVR5cGUsIGNvZGUpO1xuXG4gICAgY29uc3QgbWFrZURlbGV0ZUFycmF5ID0gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3QpXG5cbiAgICBpZiAoRmlsZUluZm8uZmlsZSkge1xuICAgICAgICBTZXR0aW5ncy5DYWNoZURheXMgJiYgUmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcIm1heC1hZ2U9XCIgKyAoU2V0dGluZ3MuQ2FjaGVEYXlzICogMjQgKiA2MCAqIDYwKSk7XG4gICAgICAgIGF3YWl0IEdldFN0YXRpY0ZpbGUodXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFByYXNlID0gKCkgPT4gUGFyc2VCYXNpY0luZm8oUmVxdWVzdCwgUmVzcG9uc2UsIGNvZGUpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGNvbnN0IGlzQXBpID0gYXdhaXQgTWFrZUFwaUNhbGwoUmVxdWVzdCwgUmVzcG9uc2UsIHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgbmV4dFByYXNlKTtcbiAgICBpZiAoIWlzQXBpICYmICFhd2FpdCBBY3RpdmF0ZVBhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIGFycmF5VHlwZSwgdXJsLCBGaWxlSW5mbywgY29kZSwgbmV4dFByYXNlKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7IC8vIGRlbGV0ZSBmaWxlc1xufVxuXG5mdW5jdGlvbiB1cmxGaXgodXJsOiBzdHJpbmcpIHtcbiAgICBpZiAodXJsID09ICcvJykge1xuICAgICAgICB1cmwgPSAnL2luZGV4JztcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHVybCk7XG59XG5cbmV4cG9ydCB7XG4gICAgU2V0dGluZ3MsXG4gICAgRHluYW1pY1BhZ2UsXG4gICAgTG9hZEFsbFBhZ2VzVG9SYW0sXG4gICAgQ2xlYXJBbGxQYWdlc0Zyb21SYW0sXG4gICAgdXJsRml4LFxuICAgIEdldEVycm9yUGFnZVxufSIsICJpbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCAqIGFzIEJ1aWxkU2VydmVyIGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBjb29raWVQYXJzZXIgfSBmcm9tICdAdGlueWh0dHAvY29va2llLXBhcnNlcic7XG5pbXBvcnQgY29va2llRW5jcnlwdGVyIGZyb20gJ2Nvb2tpZS1lbmNyeXB0ZXInO1xuaW1wb3J0IHsgYWxsb3dQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHNlc3Npb24gZnJvbSAnZXhwcmVzcy1zZXNzaW9uJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEluc2VydE1vZGVsc1NldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCB7IFN0YXJ0UmVxdWlyZSwgR2V0U2V0dGluZ3MgfSBmcm9tICcuL0ltcG9ydE1vZHVsZSc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBjcmVhdGVOZXdQcmludFNldHRpbmdzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IE1lbW9yeVNlc3Npb24gZnJvbSAnbWVtb3J5c3RvcmUnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgZGVidWdTaXRlTWFwIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NpdGVNYXAnO1xuaW1wb3J0IHsgc2V0dGluZ3MgYXMgZGVmaW5lU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcblxuY29uc3RcbiAgICBDb29raWVzU2VjcmV0ID0gdXVpZHY0KCkuc3Vic3RyaW5nKDAsIDMyKSxcbiAgICBTZXNzaW9uU2VjcmV0ID0gdXVpZHY0KCksXG4gICAgTWVtb3J5U3RvcmUgPSBNZW1vcnlTZXNzaW9uKHNlc3Npb24pLFxuXG4gICAgQ29va2llc01pZGRsZXdhcmUgPSBjb29raWVQYXJzZXIoQ29va2llc1NlY3JldCksXG4gICAgQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZSA9IGNvb2tpZUVuY3J5cHRlcihDb29raWVzU2VjcmV0LCB7fSksXG4gICAgQ29va2llU2V0dGluZ3MgPSB7IGh0dHBPbmx5OiB0cnVlLCBzaWduZWQ6IHRydWUsIG1heEFnZTogODY0MDAwMDAgKiAzMCB9O1xuXG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llcyA9IDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyID0gPGFueT5Db29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZVNldHRpbmdzID0gQ29va2llU2V0dGluZ3M7XG5cbmxldCBEZXZNb2RlXyA9IHRydWUsIGNvbXBpbGF0aW9uU2NhbjogUHJvbWlzZTwoKSA9PiBQcm9taXNlPHZvaWQ+PiwgU2Vzc2lvblN0b3JlO1xuXG5sZXQgZm9ybWlkYWJsZVNlcnZlciwgYm9keVBhcnNlclNlcnZlcjtcblxuY29uc3Qgc2VydmVMaW1pdHMgPSB7XG4gICAgc2Vzc2lvblRvdGFsUmFtTUI6IDE1MCxcbiAgICBzZXNzaW9uVGltZU1pbnV0ZXM6IDQwLFxuICAgIHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM6IDMwLFxuICAgIGZpbGVMaW1pdE1COiAxMCxcbiAgICByZXF1ZXN0TGltaXRNQjogNFxufVxuXG5sZXQgcGFnZUluUmFtQWN0aXZhdGU6ICgpID0+IFByb21pc2U8dm9pZD47XG5leHBvcnQgZnVuY3Rpb24gcGFnZUluUmFtQWN0aXZhdGVGdW5jKCl7XG4gICAgcmV0dXJuIHBhZ2VJblJhbUFjdGl2YXRlO1xufVxuXG5jb25zdCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzID0gWy4uLkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXldO1xuY29uc3QgYmFzZVZhbGlkUGF0aCA9IFsocGF0aDogc3RyaW5nKSA9PiBwYXRoLnNwbGl0KCcuJykuYXQoLTIpICE9ICdzZXJ2J107IC8vIGlnbm9yaW5nIGZpbGVzIHRoYXQgZW5kcyB3aXRoIC5zZXJ2LipcblxuZXhwb3J0IGNvbnN0IEV4cG9ydDogRXhwb3J0U2V0dGluZ3MgPSB7XG4gICAgZ2V0IHNldHRpbmdzUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyBcIi9TZXR0aW5nc1wiO1xuICAgIH0sXG4gICAgc2V0IGRldmVsb3BtZW50KHZhbHVlKSB7XG4gICAgICAgIGlmKERldk1vZGVfID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgRGV2TW9kZV8gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgY29tcGlsYXRpb25TY2FuID0gQnVpbGRTZXJ2ZXIuY29tcGlsZUFsbChFeHBvcnQpO1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBcInByb2R1Y3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRGV2TW9kZSA9IHZhbHVlO1xuICAgICAgICBhbGxvd1ByaW50KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldCBkZXZlbG9wbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIERldk1vZGVfO1xuICAgIH0sXG4gICAgbWlkZGxld2FyZToge1xuICAgICAgICBnZXQgY29va2llcygpOiAocmVxOiBSZXF1ZXN0LCBfcmVzOiBSZXNwb25zZTxhbnk+LCBuZXh0PzogTmV4dEZ1bmN0aW9uKSA9PiB2b2lkIHtcbiAgICAgICAgICAgIHJldHVybiA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llRW5jcnlwdGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TdG9yZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZvcm1pZGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWlkYWJsZVNlcnZlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGJvZHlQYXJzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keVBhcnNlclNlcnZlcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VjcmV0OiB7XG4gICAgICAgIGdldCBjb29raWVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXNTZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBnZW5lcmFsOiB7XG4gICAgICAgIGltcG9ydE9uTG9hZDogW10sXG4gICAgICAgIHNldCBwYWdlSW5SYW0odmFsdWUpIHtcbiAgICAgICAgICAgIGlmKGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtICE9IHZhbHVlKXtcbiAgICAgICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXN5bmMgKCkgPT4gKGF3YWl0IGNvbXBpbGF0aW9uU2Nhbik/LigpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtID0gdmFsdWU7XG4gICAgICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVwYXJhdGlvbnMgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgICAgICAgICAgICAgYXdhaXQgcHJlcGFyYXRpb25zPy4oKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVCeVVybC5Mb2FkQWxsUGFnZXNUb1JhbSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVCeVVybC5DbGVhckFsbFBhZ2VzRnJvbVJhbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBhZ2VJblJhbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcGlsZToge1xuICAgICAgICBzZXQgY29tcGlsZVN5bnRheCh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29tcGlsZVN5bnRheCgpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4O1xuICAgICAgICB9LFxuICAgICAgICBzZXQgaWdub3JlRXJyb3IodmFsdWUpIHtcbiAgICAgICAgICAgICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlnbm9yZUVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuICg8YW55PmNyZWF0ZU5ld1ByaW50U2V0dGluZ3MpLlByZXZlbnRFcnJvcnM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBwbHVnaW5zKHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgcGx1Z2lucygpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZGVmaW5lKCl7XG4gICAgICAgICAgICByZXR1cm4gZGVmaW5lU2V0dGluZ3MuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHNldCBkZWZpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIGRlZmluZVNldHRpbmdzLmRlZmluZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5nOiB7XG4gICAgICAgIHJ1bGVzOiB7fSxcbiAgICAgICAgdXJsU3RvcDogW10sXG4gICAgICAgIHZhbGlkUGF0aDogYmFzZVZhbGlkUGF0aCxcbiAgICAgICAgaWdub3JlVHlwZXM6IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMsXG4gICAgICAgIGlnbm9yZVBhdGhzOiBbXSxcbiAgICAgICAgc2l0ZW1hcDogdHJ1ZSxcbiAgICAgICAgZ2V0IGVycm9yUGFnZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBlcnJvclBhZ2VzKHZhbHVlKSB7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZUxpbWl0czoge1xuICAgICAgICBnZXQgY2FjaGVEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNhY2hlRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVzRXhwaXJlc0RheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVTZXR0aW5ncy5tYXhBZ2UgLyA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNvb2tpZXNFeHBpcmVzRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBDb29raWVTZXR0aW5ncy5tYXhBZ2UgPSB2YWx1ZSAqIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRvdGFsUmFtTUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRvdGFsUmFtTUIoKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25UaW1lTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRpbWVNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZmlsZUxpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmaWxlTGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHJlcXVlc3RMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICAgICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCByZXF1ZXN0TGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmU6IHtcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgaHR0cDI6IGZhbHNlLFxuICAgICAgICBncmVlbkxvY2s6IHtcbiAgICAgICAgICAgIHN0YWdpbmc6IG51bGwsXG4gICAgICAgICAgICBjbHVzdGVyOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICBhZ2VudDogbnVsbCxcbiAgICAgICAgICAgIGFncmVlVG9UZXJtczogZmFsc2UsXG4gICAgICAgICAgICBzaXRlczogW11cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybWlkYWJsZSgpIHtcbiAgICBmb3JtaWRhYmxlU2VydmVyID0ge1xuICAgICAgICBtYXhGaWxlU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLmZpbGVMaW1pdE1CICogMTA0ODU3NixcbiAgICAgICAgdXBsb2FkRGlyOiBTeXN0ZW1EYXRhICsgXCIvVXBsb2FkRmlsZXMvXCIsXG4gICAgICAgIG11bHRpcGxlczogdHJ1ZSxcbiAgICAgICAgbWF4RmllbGRzU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICogMTA0ODU3NlxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJvZHlQYXJzZXIoKSB7XG4gICAgYm9keVBhcnNlclNlcnZlciA9ICg8YW55PmJvZHlQYXJzZXIpLmpzb24oeyBsaW1pdDogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICsgJ21iJyB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZXNzaW9uKCkge1xuICAgIGlmICghRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyB8fCAhRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CKSB7XG4gICAgICAgIFNlc3Npb25TdG9yZSA9IChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2Vzc2lvblN0b3JlID0gc2Vzc2lvbih7XG4gICAgICAgIGNvb2tpZTogeyBtYXhBZ2U6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgKiA2MCAqIDEwMDAsIHNhbWVTaXRlOiB0cnVlIH0sXG4gICAgICAgIHNlY3JldDogU2Vzc2lvblNlY3JldCxcbiAgICAgICAgcmVzYXZlOiBmYWxzZSxcbiAgICAgICAgc2F2ZVVuaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzdG9yZTogbmV3IE1lbW9yeVN0b3JlKHtcbiAgICAgICAgICAgIGNoZWNrUGVyaW9kOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgIG1heDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CICogMTA0ODU3NlxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb3B5SlNPTih0bzogYW55LCBqc29uOiBhbnksIHJ1bGVzOiBzdHJpbmdbXSA9IFtdLCBydWxlc1R5cGU6ICdpZ25vcmUnIHwgJ29ubHknID0gJ2lnbm9yZScpIHtcbiAgICBpZighanNvbikgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBoYXNJbXBsZWF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGkgaW4ganNvbikge1xuICAgICAgICBjb25zdCBpbmNsdWRlID0gcnVsZXMuaW5jbHVkZXMoaSk7XG4gICAgICAgIGlmIChydWxlc1R5cGUgPT0gJ29ubHknICYmIGluY2x1ZGUgfHwgcnVsZXNUeXBlID09ICdpZ25vcmUnICYmICFpbmNsdWRlKSB7XG4gICAgICAgICAgICBoYXNJbXBsZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdG9baV0gPSBqc29uW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNJbXBsZWF0ZWQ7XG59XG5cbi8vIHJlYWQgdGhlIHNldHRpbmdzIG9mIHRoZSB3ZWJzaXRlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IFNldHRpbmdzOiBFeHBvcnRTZXR0aW5ncyA9IGF3YWl0IEdldFNldHRpbmdzKEV4cG9ydC5zZXR0aW5nc1BhdGgsIERldk1vZGVfKTtcbiAgICBpZihTZXR0aW5ncyA9PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxEZXYpO1xuXG4gICAgZWxzZVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsUHJvZCk7XG5cblxuICAgIGNvcHlKU09OKEV4cG9ydC5jb21waWxlLCBTZXR0aW5ncy5jb21waWxlKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5yb3V0aW5nLCBTZXR0aW5ncy5yb3V0aW5nLCBbJ2lnbm9yZVR5cGVzJywgJ3ZhbGlkUGF0aCddKTtcblxuICAgIC8vY29uY2F0IGRlZmF1bHQgdmFsdWVzIG9mIHJvdXRpbmdcbiAgICBjb25zdCBjb25jYXRBcnJheSA9IChuYW1lOiBzdHJpbmcsIGFycmF5OiBhbnlbXSkgPT4gU2V0dGluZ3Mucm91dGluZz8uW25hbWVdICYmIChFeHBvcnQucm91dGluZ1tuYW1lXSA9IFNldHRpbmdzLnJvdXRpbmdbbmFtZV0uY29uY2F0KGFycmF5KSk7XG5cbiAgICBjb25jYXRBcnJheSgnaWdub3JlVHlwZXMnLCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzKTtcbiAgICBjb25jYXRBcnJheSgndmFsaWRQYXRoJywgYmFzZVZhbGlkUGF0aCk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2NhY2hlRGF5cycsICdjb29raWVzRXhwaXJlc0RheXMnXSwgJ29ubHknKTtcblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnc2Vzc2lvblRvdGFsUmFtTUInLCAnc2Vzc2lvblRpbWVNaW51dGVzJywgJ3Nlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMnXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2ZpbGVMaW1pdE1CJywgJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuICAgIH1cblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZSwgU2V0dGluZ3Muc2VydmUpO1xuXG4gICAgLyogLS0tIHByb2JsZW1hdGljIHVwZGF0ZXMgLS0tICovXG4gICAgRXhwb3J0LmRldmVsb3BtZW50ID0gU2V0dGluZ3MuZGV2ZWxvcG1lbnRcblxuICAgIGlmIChTZXR0aW5ncy5nZW5lcmFsPy5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgRXhwb3J0LmdlbmVyYWwuaW1wb3J0T25Mb2FkID0gPGFueT5hd2FpdCBTdGFydFJlcXVpcmUoPGFueT5TZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCwgRGV2TW9kZV8pO1xuICAgIH1cblxuICAgIC8vbmVlZCB0byBkb3duIGxhc3RlZCBzbyBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aCAnaW1wb3J0T25Mb2FkJ1xuICAgIGlmICghY29weUpTT04oRXhwb3J0LmdlbmVyYWwsIFNldHRpbmdzLmdlbmVyYWwsIFsncGFnZUluUmFtJ10sICdvbmx5JykgJiYgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgfVxuXG4gICAgaWYoRXhwb3J0LmRldmVsb3BtZW50ICYmIEV4cG9ydC5yb3V0aW5nLnNpdGVtYXApeyAvLyBvbiBwcm9kdWN0aW9uIHRoaXMgd2lsbCBiZSBjaGVja2VkIGFmdGVyIGNyZWF0aW5nIHN0YXRlXG4gICAgICAgIGRlYnVnU2l0ZU1hcChFeHBvcnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlyc3RMb2FkKCkge1xuICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIGJ1aWxkQm9keVBhcnNlcigpO1xufSIsICJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMic7XG5pbXBvcnQgKiBhcyBjcmVhdGVDZXJ0IGZyb20gJ3NlbGZzaWduZWQnO1xuaW1wb3J0ICogYXMgR3JlZW5sb2NrIGZyb20gJ2dyZWVubG9jay1leHByZXNzJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGVsZXRlSW5EaXJlY3RvcnksIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBHcmVlbkxvY2tTaXRlIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgZm9sZGVyIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2VzXG4gKiBleGlzdCwgdXBkYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZvbGRlciB0byBjcmVhdGUuXG4gKiBAcGFyYW0gQ3JlYXRlSW5Ob3RFeGl0cyAtIHtcbiAqL1xuYXN5bmMgZnVuY3Rpb24gVG91Y2hTeXN0ZW1Gb2xkZXIoZm9OYW1lOiBzdHJpbmcsIENyZWF0ZUluTm90RXhpdHM6IHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGV4aXRzPzogYW55fSkge1xuICAgIGxldCBzYXZlUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyBcIi9TeXN0ZW1TYXZlL1wiO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgc2F2ZVBhdGggKz0gZm9OYW1lO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgaWYgKENyZWF0ZUluTm90RXhpdHMpIHtcbiAgICAgICAgc2F2ZVBhdGggKz0gJy8nO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHNhdmVQYXRoICsgQ3JlYXRlSW5Ob3RFeGl0cy5uYW1lO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBDcmVhdGVJbk5vdEV4aXRzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBhd2FpdCBDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKSwgZmlsZVBhdGgsIHNhdmVQYXRoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSXQgZ2VuZXJhdGVzIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgYW5kIHN0b3JlcyBpdCBpbiBhIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgY2VydGlmaWNhdGUgYW5kIGtleSBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldERlbW9DZXJ0aWZpY2F0ZSgpIHtcbiAgICBsZXQgQ2VydGlmaWNhdGU6IGFueTtcbiAgICBjb25zdCBDZXJ0aWZpY2F0ZVBhdGggPSBTeXN0ZW1EYXRhICsgJy9DZXJ0aWZpY2F0ZS5qc29uJztcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShDZXJ0aWZpY2F0ZVBhdGgpKSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gRWFzeUZzLnJlYWRKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUNlcnQuZ2VuZXJhdGUobnVsbCwgeyBkYXlzOiAzNjUwMCB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5cy5wcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgsIENlcnRpZmljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIENlcnRpZmljYXRlO1xufVxuXG5mdW5jdGlvbiBEZWZhdWx0TGlzdGVuKGFwcCkge1xuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5hdHRhY2gpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgbGlzdGVuKHBvcnQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCA8YW55PnJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIGdyZWVubG9jaywgaXQgd2lsbCBjcmVhdGUgYSBzZXJ2ZXIgdGhhdCB3aWxsIHNlcnZlIHlvdXIgYXBwIG92ZXIgaHR0cHNcbiAqIEBwYXJhbSBhcHAgLSBUaGUgdGlueUh0dHAgYXBwbGljYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdGhlIHNlcnZlciBtZXRob2RzXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFVwZGF0ZUdyZWVuTG9jayhhcHApIHtcblxuICAgIGlmICghKFNldHRpbmdzLnNlcnZlLmh0dHAyIHx8IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jaz8uYWdyZWVUb1Rlcm1zKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgRGVmYXVsdExpc3RlbihhcHApO1xuICAgIH1cblxuICAgIGlmICghU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFncmVlVG9UZXJtcykge1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwMi5jcmVhdGVTZWN1cmVTZXJ2ZXIoeyAuLi5hd2FpdCBHZXREZW1vQ2VydGlmaWNhdGUoKSwgYWxsb3dIVFRQMTogdHJ1ZSB9LCBhcHAuYXR0YWNoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuKHBvcnQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBUb3VjaFN5c3RlbUZvbGRlcihcImdyZWVubG9ja1wiLCB7XG4gICAgICAgIG5hbWU6IFwiY29uZmlnLmpzb25cIiwgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpdGVzOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXNcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGV4aXRzKGZpbGUsIF8sIGZvbGRlcikge1xuICAgICAgICAgICAgZmlsZSA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmlsZS5zaXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBmaWxlLnNpdGVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiA8R3JlZW5Mb2NrU2l0ZVtdPiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuc3ViamVjdCA9PSBlLnN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuYWx0bmFtZXMubGVuZ3RoICE9IGUuYWx0bmFtZXMubGVuZ3RoIHx8IGIuYWx0bmFtZXMuc29tZSh2ID0+IGUuYWx0bmFtZXMuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5hbHRuYW1lcyA9IGIuYWx0bmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUucmVuZXdBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGF2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnNpdGVzLnNwbGljZShpLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGZvbGRlciArIFwibGl2ZS9cIiArIGUuc3ViamVjdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NpdGVzID0gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzLmZpbHRlcigoeCkgPT4gIWZpbGUuc2l0ZXMuZmluZChiID0+IGIuc3ViamVjdCA9PSB4LnN1YmplY3QpKTtcblxuICAgICAgICAgICAgZmlsZS5zaXRlcy5wdXNoKC4uLm5ld1NpdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUod29ya2luZ0RpcmVjdG9yeSArIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgZ3JlZW5sb2NrT2JqZWN0OmFueSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBHcmVlbmxvY2suaW5pdCh7XG4gICAgICAgIHBhY2thZ2VSb290OiB3b3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBjb25maWdEaXI6IFwiU3lzdGVtU2F2ZS9ncmVlbmxvY2tcIixcbiAgICAgICAgcGFja2FnZUFnZW50OiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdlbnQgfHwgcGFja2FnZUluZm8ubmFtZSArICcvJyArIHBhY2thZ2VJbmZvLnZlcnNpb24sXG4gICAgICAgIG1haW50YWluZXJFbWFpbDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmVtYWlsLFxuICAgICAgICBjbHVzdGVyOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suY2x1c3RlcixcbiAgICAgICAgc3RhZ2luZzogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnN0YWdpbmdcbiAgICB9KS5yZWFkeShyZXMpKTtcblxuICAgIGZ1bmN0aW9uIENyZWF0ZVNlcnZlcih0eXBlLCBmdW5jLCBvcHRpb25zPykge1xuICAgICAgICBsZXQgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4geyB9O1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3RbdHlwZV0ob3B0aW9ucywgZnVuYyk7XG4gICAgICAgIGNvbnN0IGxpc3RlbiA9IChwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwU2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0Lmh0dHBTZXJ2ZXIoKTtcbiAgICAgICAgICAgIENsb3NlaHR0cFNlcnZlciA9ICgpID0+IGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UocmVzID0+IHNlcnZlci5saXN0ZW4oNDQzLCBcIjAuMC4wLjBcIiwgcmVzKSksIG5ldyBQcm9taXNlKHJlcyA9PiBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBcIjAuMC4wLjBcIiwgcmVzKSldKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHNlcnZlci5jbG9zZSgpOyBDbG9zZWh0dHBTZXJ2ZXIoKTsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3RlbixcbiAgICAgICAgICAgIGNsb3NlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cDJTZXJ2ZXInLCBhcHAuYXR0YWNoLCB7IGFsbG93SFRUUDE6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cHNTZXJ2ZXInLCBhcHAuYXR0YWNoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHNlcnZlciwge1NldHRpbmdzfSAgZnJvbSAnLi9NYWluQnVpbGQvU2VydmVyJztcbmltcG9ydCBhc3luY1JlcXVpcmUgZnJvbSAnLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHtnZXRUeXBlc30gZnJvbSAnLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gJy4vQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkJztcbmV4cG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9NYWluQnVpbGQvVHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQXN5bmNJbXBvcnQgPSAocGF0aDpzdHJpbmcsIGltcG9ydEZyb20gPSAnYXN5bmMgaW1wb3J0JykgPT4gYXN5bmNSZXF1aXJlKGltcG9ydEZyb20sIHBhdGgsIGdldFR5cGVzLlN0YXRpYywgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpO1xuZXhwb3J0IHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFB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
