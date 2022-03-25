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
  let markdownCode = BetweenTagData?.eq || "";
  const location = dataTag2.remove("file");
  if (!markdownCode?.trim?.() && location) {
    let filePath = location[0] == "/" ? getTypes.Static[2] + "/" + location : path8.join(path8.dirname(type.extractInfo("<line>")), location);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2pzb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vd2FzbS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1Nlc3Npb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2Vycm9yLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL21hcmtkb3duLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2hlYWQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZS50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvSW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvSW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N0eWxlLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9Db21waWxlU3RhdGUudHMiLCAiLi4vc3JjL01haW5CdWlsZC9JbXBvcnRNb2R1bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TaXRlTWFwLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRmlsZVR5cGVzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9JbXBvcnRGaWxlUnVudGltZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0FwaUNhbGwudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9HZXRQYWdlcy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvTGlzdGVuR3JlZW5Mb2NrLnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwIGFzIFRpbnlBcHAgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9UeXBlcyc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3MsIHJlcXVpcmVTZXR0aW5ncywgYnVpbGRGaXJzdExvYWQsIHBhZ2VJblJhbUFjdGl2YXRlRnVuY30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgZm9ybWlkYWJsZSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCB7IFVwZGF0ZUdyZWVuTG9jayB9IGZyb20gJy4vTGlzdGVuR3JlZW5Mb2NrJztcblxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBjaGFuZ2VVUkxSdWxlcyhyZXEsIHJlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYW5nZVVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGxldCB1cmwgPSBmaWxlQnlVcmwudXJsRml4KHJlcS5wYXRoKTtcblxuICAgIFxuICAgIGZvciAobGV0IGkgb2YgU2V0dGluZ3Mucm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSkge1xuICAgICAgICAgICAgaWYgKGkuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgICAgIGkgPSBpLnN1YnN0cmluZygwLCBpLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgUnVsZUluZGV4ID0gT2JqZWN0LmtleXMoU2V0dGluZ3Mucm91dGluZy5ydWxlcykuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKTtcblxuICAgIGlmIChSdWxlSW5kZXgpIHtcbiAgICAgICAgdXJsID0gYXdhaXQgU2V0dGluZ3Mucm91dGluZy5ydWxlc1tSdWxlSW5kZXhdKHVybCwgcmVxLCByZXMpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIHVybCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbGVyVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCB1cmw6IHN0cmluZykge1xuICAgIGxldCBub3RWYWxpZDogYW55ID0gU2V0dGluZ3Mucm91dGluZy5pZ25vcmVQYXRocy5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpIHx8IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChpID0+IHVybC5lbmRzV2l0aCgnLicraSkpO1xuICAgIFxuICAgIGlmKCFub3RWYWxpZCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsaWQgb2YgU2V0dGluZ3Mucm91dGluZy52YWxpZFBhdGgpeyAvLyBjaGVjayBpZiB1cmwgaXNuJ3QgdmFsaWRcbiAgICAgICAgICAgIGlmKCFhd2FpdCB2YWxpZCh1cmwsIHJlcSwgcmVzKSl7XG4gICAgICAgICAgICAgICAgbm90VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vdFZhbGlkKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IGZpbGVCeVVybC5HZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgdXJsLnN1YnN0cmluZygxKSk7XG59XG5cbmxldCBhcHBPbmxpbmVcblxuLyoqXG4gKiBJdCBzdGFydHMgdGhlIHNlcnZlciBhbmQgdGhlbiBjYWxscyBTdGFydExpc3RpbmdcbiAqIEBwYXJhbSBbU2VydmVyXSAtIFRoZSBzZXJ2ZXIgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIGluIGJ5IHRoZSBjYWxsZXIuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0QXBwKFNlcnZlcj8pIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgVGlueUFwcCgpO1xuICAgIGlmICghU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgYXBwLnVzZSg8YW55PmNvbXByZXNzaW9uKCkpO1xuICAgIH1cbiAgICBmaWxlQnlVcmwuU2V0dGluZ3MuU2Vzc2lvblN0b3JlID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiBTZXR0aW5ncy5taWRkbGV3YXJlLnNlc3Npb24ocmVxLCByZXMsIG5leHQpO1xuXG4gICAgY29uc3QgT3Blbkxpc3RpbmcgPSBhd2FpdCBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpO1xuXG4gICAgZm9yIChjb25zdCBmdW5jIG9mIFNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIGF3YWl0IGZ1bmMoYXBwLCBhcHBPbmxpbmUuc2VydmVyLCBTZXR0aW5ncyk7XG4gICAgfVxuICAgIGF3YWl0IHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpPy4oKVxuXG4gICAgYXBwLmFsbChcIipcIiwgUGFyc2VSZXF1ZXN0KTtcblxuICAgIGF3YWl0IE9wZW5MaXN0aW5nKFNldHRpbmdzLnNlcnZlLnBvcnQpO1xuXG4gICAgY29uc29sZS5sb2coXCJBcHAgbGlzdGluZyBhdCBwb3J0OiBcIiArIFNldHRpbmdzLnNlcnZlLnBvcnQpO1xufVxuXG4vKipcbiAqIElmIHRoZSByZXF1ZXN0IGlzIGEgUE9TVCByZXF1ZXN0LCB0aGVuIHBhcnNlIHRoZSByZXF1ZXN0IGJvZHksIHRoZW4gc2VuZCBpdCB0byByb3V0aW5nIHNldHRpbmdzXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcSAtIFRoZSBpbmNvbWluZyByZXF1ZXN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC0gUmVzcG9uc2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gUGFyc2VSZXF1ZXN0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChyZXEubWV0aG9kID09ICdQT1NUJykge1xuICAgICAgICBpZiAocmVxLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddPy5zdGFydHNXaXRoPy4oJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICAgICAgU2V0dGluZ3MubWlkZGxld2FyZS5ib2R5UGFyc2VyKHJlcSwgcmVzLCAoKSA9PiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybShTZXR0aW5ncy5taWRkbGV3YXJlLmZvcm1pZGFibGUpLnBhcnNlKHJlcSwgKGVyciwgZmllbGRzLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVxLmZpZWxkcyA9IGZpZWxkcztcbiAgICAgICAgICAgICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKSB7XG4gICAgaWYgKGFwcE9ubGluZSAmJiBhcHBPbmxpbmUuY2xvc2UpIHtcbiAgICAgICAgYXdhaXQgYXBwT25saW5lLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZXJ2ZXIsIGxpc3RlbiwgY2xvc2UgfSA9IGF3YWl0IFNlcnZlcihhcHApO1xuXG4gICAgYXBwT25saW5lID0geyBzZXJ2ZXIsIGNsb3NlIH07XG5cbiAgICByZXR1cm4gbGlzdGVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTdGFydFNlcnZlcih7IFNpdGVQYXRoID0gJy4vJywgSHR0cFNlcnZlciA9IFVwZGF0ZUdyZWVuTG9jayB9ID0ge30pIHtcbiAgICBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgPSBTaXRlUGF0aDtcbiAgICBidWlsZEZpcnN0TG9hZCgpO1xuICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIFN0YXJ0QXBwKEh0dHBTZXJ2ZXIpO1xufVxuXG5leHBvcnQgeyBTZXR0aW5ncyB9OyIsICJpbXBvcnQgZnMsIHtEaXJlbnQsIFN0YXRzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4vQ29uc29sZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgcmVzKEJvb2xlYW4oc3RhdCkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7cGF0aCBvZiB0aGUgZmlsZX0gcGF0aCBcbiAqIEBwYXJhbSB7ZmlsZWQgdG8gZ2V0IGZyb20gdGhlIHN0YXQgb2JqZWN0fSBmaWxlZCBcbiAqIEByZXR1cm5zIHRoZSBmaWxlZFxuICovXG5mdW5jdGlvbiBzdGF0KHBhdGg6IHN0cmluZywgZmlsZWQ/OiBzdHJpbmcsIGlnbm9yZUVycm9yPzogYm9vbGVhbiwgZGVmYXVsdFZhbHVlOmFueSA9IHt9KTogUHJvbWlzZTxTdGF0cyB8IGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyICYmICFpZ25vcmVFcnJvcil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlZCAmJiBzdGF0PyBzdGF0W2ZpbGVkXTogc3RhdCB8fCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgZmlsZSBleGlzdHMsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHthbnl9IFtpZlRydWVSZXR1cm49dHJ1ZV0gLSBhbnkgPSB0cnVlXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4aXN0c0ZpbGUocGF0aDogc3RyaW5nLCBpZlRydWVSZXR1cm46IGFueSA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiAoYXdhaXQgc3RhdChwYXRoLCB1bmRlZmluZWQsIHRydWUpKS5pc0ZpbGU/LigpICYmIGlmVHJ1ZVJldHVybjtcbn1cblxuLyoqXG4gKiBJdCBjcmVhdGVzIGEgZGlyZWN0b3J5LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gbWtkaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMubWtkaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgcm1kaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB0byBiZSByZW1vdmVkLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBybWRpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ybWRpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB1bmxpbmtgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gZGVsZXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB1bmxpbmsocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMudW5saW5rKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZXhpc3RzLCBkZWxldGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgb3IgZGlyZWN0b3J5IHRvIGJlIHVubGlua2VkLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bmxpbmtJZkV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKGF3YWl0IGV4aXN0cyhwYXRoKSl7XG4gICAgICAgIHJldHVybiBhd2FpdCB1bmxpbmsocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZGRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9ucyBvYmplY3QsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzXG4gKiB0byBhbiBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBvcHRpb25zIC0ge1xuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gcmVhZGRpcihwYXRoOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nW10gfCBCdWZmZXJbXSB8IERpcmVudFtdPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZGRpcihwYXRoLCBvcHRpb25zLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVzIHx8IFtdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRpcmVjdG9yeSB3YXMgY3JlYXRlZCBvciBub3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1rZGlySWZOb3RFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZighYXdhaXQgZXhpc3RzKHBhdGgpKVxuICAgICAgICByZXR1cm4gYXdhaXQgbWtkaXIocGF0aCk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFdyaXRlIGEgZmlsZSB0byB0aGUgZmlsZSBzeXN0ZW1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge3N0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXd9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogIHN0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy53cml0ZUZpbGUocGF0aCwgY29udGVudCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgd3JpdGVKc29uRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYSBjb250ZW50IGFuZCB3cml0ZXMgdGhlIGNvbnRlbnQgdG8gdGhlIGZpbGUgYXRcbiAqIHRoZSBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHthbnl9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gd3JpdGVKc29uRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB3cml0ZUZpbGUocGF0aCwgSlNPTi5zdHJpbmdpZnkoY29udGVudCkpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9uYWwgZW5jb2RpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAqIHJlc29sdmVzIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIFtlbmNvZGluZz11dGY4XSAtIFRoZSBlbmNvZGluZyBvZiB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcmVhZEZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nID0gJ3V0ZjgnKTogUHJvbWlzZTxzdHJpbmd8YW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZEZpbGUocGF0aCwgPGFueT5lbmNvZGluZywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGRhdGEgfHwgXCJcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEl0IHJlYWRzIGEgSlNPTiBmaWxlIGFuZCByZXR1cm5zIHRoZSBwYXJzZWQgSlNPTiBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2VuY29kaW5nXSAtIFRoZSBlbmNvZGluZyB0byB1c2Ugd2hlbiByZWFkaW5nIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0LlxuICovXG5hc3luYyBmdW5jdGlvbiByZWFkSnNvbkZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nPzpzdHJpbmcpOiBQcm9taXNlPGFueT57XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcmVhZEZpbGUocGF0aCwgZW5jb2RpbmcpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHAgLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IG5lZWRzIHRvIGJlIGNyZWF0ZWQuXG4gKiBAcGFyYW0gW2Jhc2VdIC0gVGhlIGJhc2UgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZVBhdGhSZWFsKHA6c3RyaW5nLCBiYXNlID0gJycpIHtcbiAgICBwID0gcGF0aC5kaXJuYW1lKHApO1xuXG4gICAgaWYgKCFhd2FpdCBleGlzdHMoYmFzZSArIHApKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHAuc3BsaXQoL1xcXFx8XFwvLyk7XG5cbiAgICAgICAgbGV0IHBTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgaWYgKHBTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcFN0cmluZyArPSAnLyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwU3RyaW5nICs9IGk7XG5cbiAgICAgICAgICAgIGF3YWl0IG1rZGlySWZOb3RFeGlzdHMoYmFzZSArIHBTdHJpbmcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vL3R5cGVzXG5leHBvcnQge1xuICAgIERpcmVudFxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLi4uZnMucHJvbWlzZXMsXG4gICAgZXhpc3RzLFxuICAgIGV4aXN0c0ZpbGUsXG4gICAgc3RhdCxcbiAgICBta2RpcixcbiAgICBta2RpcklmTm90RXhpc3RzLFxuICAgIHdyaXRlRmlsZSxcbiAgICB3cml0ZUpzb25GaWxlLFxuICAgIHJlYWRGaWxlLFxuICAgIHJlYWRKc29uRmlsZSxcbiAgICBybWRpcixcbiAgICB1bmxpbmssXG4gICAgdW5saW5rSWZFeGlzdHMsXG4gICAgcmVhZGRpcixcbiAgICBtYWtlUGF0aFJlYWxcbn0iLCAibGV0IHByaW50TW9kZSA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd1ByaW50KGQ6IGJvb2xlYW4pIHtcbiAgICBwcmludE1vZGUgPSBkO1xufVxuXG5leHBvcnQgY29uc3QgcHJpbnQgPSBuZXcgUHJveHkoY29uc29sZSx7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYocHJpbnRNb2RlICYmIHByb3AgIT0gXCJkby1ub3RoaW5nXCIpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICB9XG59KTsiLCAiaW1wb3J0IHtEaXJlbnR9IGZyb20gJ2ZzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7Y3dkfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tICd1cmwnXG5pbXBvcnQgeyBDdXRUaGVMYXN0ICwgU3BsaXRGaXJzdH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuXG5mdW5jdGlvbiBnZXREaXJuYW1lKHVybDogc3RyaW5nKXtcbiAgICByZXR1cm4gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgodXJsKSk7XG59XG5cbmNvbnN0IFN5c3RlbURhdGEgPSBwYXRoLmpvaW4oZ2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpLCAnL1N5c3RlbURhdGEnKTtcblxubGV0IFdlYlNpdGVGb2xkZXJfID0gXCJXZWJTaXRlXCI7XG5cbmNvbnN0IFN0YXRpY05hbWUgPSAnV1dXJywgTG9nc05hbWUgPSAnTG9ncycsIE1vZHVsZXNOYW1lID0gJ25vZGVfbW9kdWxlcyc7XG5cbmNvbnN0IFN0YXRpY0NvbXBpbGUgPSBTeXN0ZW1EYXRhICsgYC8ke1N0YXRpY05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZUxvZ3MgPSBTeXN0ZW1EYXRhICsgYC8ke0xvZ3NOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVNb2R1bGUgPSBTeXN0ZW1EYXRhICsgYC8ke01vZHVsZXNOYW1lfUNvbXBpbGUvYDtcblxuY29uc3Qgd29ya2luZ0RpcmVjdG9yeSA9IGN3ZCgpICsgJy8nO1xuXG5mdW5jdGlvbiBHZXRGdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LFdlYlNpdGVGb2xkZXJfLCAnLycpO1xufVxubGV0IGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcblxuZnVuY3Rpb24gR2V0U291cmNlKG5hbWUpIHtcbiAgICByZXR1cm4gIEdldEZ1bGxXZWJTaXRlUGF0aCgpICsgbmFtZSArICcvJ1xufVxuXG4vKiBBIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgcGF0aHMgb2YgdGhlIGZpbGVzIGluIHRoZSBwcm9qZWN0LiAqL1xuY29uc3QgZ2V0VHlwZXMgPSB7XG4gICAgU3RhdGljOiBbXG4gICAgICAgIEdldFNvdXJjZShTdGF0aWNOYW1lKSxcbiAgICAgICAgU3RhdGljQ29tcGlsZSxcbiAgICAgICAgU3RhdGljTmFtZVxuICAgIF0sXG4gICAgTG9nczogW1xuICAgICAgICBHZXRTb3VyY2UoTG9nc05hbWUpLFxuICAgICAgICBDb21waWxlTG9ncyxcbiAgICAgICAgTG9nc05hbWVcbiAgICBdLFxuICAgIG5vZGVfbW9kdWxlczogW1xuICAgICAgICBHZXRTb3VyY2UoJ25vZGVfbW9kdWxlcycpLFxuICAgICAgICBDb21waWxlTW9kdWxlLFxuICAgICAgICBNb2R1bGVzTmFtZVxuICAgIF0sXG4gICAgZ2V0IFtTdGF0aWNOYW1lXSgpe1xuICAgICAgICByZXR1cm4gZ2V0VHlwZXMuU3RhdGljO1xuICAgIH1cbn1cblxuY29uc3QgcGFnZVR5cGVzID0ge1xuICAgIHBhZ2U6IFwicGFnZVwiLFxuICAgIG1vZGVsOiBcIm1vZGVcIixcbiAgICBjb21wb25lbnQ6IFwiaW50ZVwiXG59XG5cblxuY29uc3QgQmFzaWNTZXR0aW5ncyA9IHtcbiAgICBwYWdlVHlwZXMsXG5cbiAgICBwYWdlVHlwZXNBcnJheTogW10sXG5cbiAgICBwYWdlQ29kZUZpbGU6IHtcbiAgICAgICAgcGFnZTogW3BhZ2VUeXBlcy5wYWdlK1wiLmpzXCIsIHBhZ2VUeXBlcy5wYWdlK1wiLnRzXCJdLFxuICAgICAgICBtb2RlbDogW3BhZ2VUeXBlcy5tb2RlbCtcIi5qc1wiLCBwYWdlVHlwZXMubW9kZWwrXCIudHNcIl0sXG4gICAgICAgIGNvbXBvbmVudDogW3BhZ2VUeXBlcy5jb21wb25lbnQrXCIuanNcIiwgcGFnZVR5cGVzLmNvbXBvbmVudCtcIi50c1wiXVxuICAgIH0sXG5cbiAgICBwYWdlQ29kZUZpbGVBcnJheTogW10sXG5cbiAgICBwYXJ0RXh0ZW5zaW9uczogWydzZXJ2JywgJ2FwaSddLFxuXG4gICAgUmVxRmlsZVR5cGVzOiB7XG4gICAgICAgIGpzOiBcInNlcnYuanNcIixcbiAgICAgICAgdHM6IFwic2Vydi50c1wiLFxuICAgICAgICAnYXBpLXRzJzogXCJhcGkuanNcIixcbiAgICAgICAgJ2FwaS1qcyc6IFwiYXBpLnRzXCJcbiAgICB9LFxuICAgIFJlcUZpbGVUeXBlc0FycmF5OiBbXSxcblxuICAgIGdldCBXZWJTaXRlRm9sZGVyKCkge1xuICAgICAgICByZXR1cm4gV2ViU2l0ZUZvbGRlcl87XG4gICAgfSxcbiAgICBnZXQgZnVsbFdlYlNpdGVQYXRoKCkge1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXztcbiAgICB9LFxuICAgIHNldCBXZWJTaXRlRm9sZGVyKHZhbHVlKSB7XG4gICAgICAgIFdlYlNpdGVGb2xkZXJfID0gdmFsdWU7XG5cbiAgICAgICAgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuICAgICAgICBnZXRUeXBlcy5TdGF0aWNbMF0gPSBHZXRTb3VyY2UoU3RhdGljTmFtZSk7XG4gICAgICAgIGdldFR5cGVzLkxvZ3NbMF0gPSBHZXRTb3VyY2UoTG9nc05hbWUpO1xuICAgIH0sXG4gICAgZ2V0IHRzQ29uZmlnKCl7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfICsgJ3RzY29uZmlnLmpzb24nOyBcbiAgICB9LFxuICAgIGFzeW5jIHRzQ29uZmlnRmlsZSgpIHtcbiAgICAgICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy50c0NvbmZpZykpe1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnRzQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVsYXRpdmUoZnVsbFBhdGg6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKGZ1bGxXZWJTaXRlUGF0aF8sIGZ1bGxQYXRoKVxuICAgIH1cbn1cblxuQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMpO1xuQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGUpLmZsYXQoKTtcbkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERlbGV0ZUluRGlyZWN0b3J5KHBhdGgpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgKDxEaXJlbnRbXT5hbGxJbkZvbGRlcikpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZTtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gcGF0aCArIG4gKyAnLyc7XG4gICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShkaXIpO1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnJtZGlyKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rKHBhdGggKyBuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIEN1dFRoZUxhc3QoJy4nLCBTcGxpdEZpcnN0KCcvJywgc21hbGxQYXRoKS5wb3AoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlQnlTbWFsbFBhdGgoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBnZXRUeXBlc1tTcGxpdEZpcnN0KCcvJywgc21hbGxQYXRoKS5zaGlmdCgpXTtcbn1cblxuXG5cbmV4cG9ydCB7XG4gICAgZ2V0RGlybmFtZSxcbiAgICBTeXN0ZW1EYXRhLFxuICAgIHdvcmtpbmdEaXJlY3RvcnksXG4gICAgZ2V0VHlwZXMsXG4gICAgQmFzaWNTZXR0aW5nc1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmludGVyZmFjZSBnbG9iYWxTdHJpbmc8VD4ge1xuICAgIGluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgbGFzdEluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgc3RhcnRzV2l0aChzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTcGxpdEZpcnN0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHR5cGU6IHN0cmluZywgc3RyaW5nOiBUKTogVFtdIHtcbiAgICBjb25zdCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHR5cGUpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKVxuICAgICAgICByZXR1cm4gW3N0cmluZ107XG5cbiAgICByZXR1cm4gW3N0cmluZy5zdWJzdHJpbmcoMCwgaW5kZXgpLCBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgdHlwZS5sZW5ndGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1dFRoZUxhc3QodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZih0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRlbnNpb248VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RyaW5nOiBUKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbVR5cGUodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHdoaWxlIChzdHJpbmcuc3RhcnRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyh0eXBlLmxlbmd0aCk7XG5cbiAgICB3aGlsZSAoc3RyaW5nLmVuZHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sZW5ndGggLSB0eXBlLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Vic3RyaW5nU3RhcnQ8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RhcnQ6IHN0cmluZywgc3RyaW5nOiBUKTogVCB7XG4gICAgaWYoc3RyaW5nLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdGFydC5sZW5ndGgpO1xuICAgIHJldHVybiBzdHJpbmc7XG59IiwgImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSwgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi8uLi9KU1BhcnNlcic7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dENvZGUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoLCAnPCN7ZGVidWd9JywgJ3tkZWJ1Z30jPicsICdkZWJ1ZyBpbmZvJyk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBjb25zdCBuZXdDb2RlU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoY29kZS5EZWZhdWx0SW5mb1RleHQpO1xuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyQgYDwlez9kZWJ1Z19maWxlP30ke2kudGV4dH0lPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q29kZVN0cmluZztcbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VTY3JpcHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG5cbiAgICBjb25zdCBuZXdDb2RlU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoY29kZS5EZWZhdWx0SW5mb1RleHQpO1xuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0NvZGVTdHJpbmcuUGx1cyQgYHJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3Q29kZVN0cmluZztcbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VEZWJ1Z0xpbmUoY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOnN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihjb2RlLCBwYXRoKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBpLnRleHQgPSBhd2FpdCBQYXJzZVRleHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpLnRleHQgPSBhd2FpdCBQYXJzZVNjcmlwdENvZGUoaS50ZXh0LCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlci5zdGFydCA9IFwiPCVcIjtcbiAgICBwYXJzZXIuZW5kID0gXCIlPlwiO1xuICAgIHJldHVybiBwYXJzZXIuUmVCdWlsZFRleHQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VEZWJ1Z0luZm8oY29kZTpTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGNvZGUsIHBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQWRkRGVidWdJbmZvKGlzb2xhdGU6IGJvb2xlYW4sIHBhZ2VOYW1lOnN0cmluZywgRnVsbFBhdGg6c3RyaW5nLCBTbWFsbFBhdGg6c3RyaW5nLCBjYWNoZToge3ZhbHVlPzogc3RyaW5nfSA9IHt9KXtcbiAgICBpZighY2FjaGUudmFsdWUpXG4gICAgICAgIGNhY2hlLnZhbHVlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxQYXRoLCAndXRmOCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxsRGF0YTogbmV3IFN0cmluZ1RyYWNrZXIoYCR7cGFnZU5hbWV9PGxpbmU+JHtTbWFsbFBhdGh9YCwgaXNvbGF0ZSA/IGA8JXslPiR7Y2FjaGUudmFsdWV9PCV9JT5gOiBjYWNoZS52YWx1ZSksXG4gICAgICAgIHN0cmluZ0luZm86IGA8JSFcXG5ydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KHBhZ2VOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoKX1cXGA7JT5gXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKGZpbGVQYXRoOiBzdHJpbmcsIGlucHV0UGF0aDogc3RyaW5nLCBmb2xkZXI6c3RyaW5nLCBwYWdlVHlwZTpzdHJpbmcsIHBhdGhUeXBlID0gMCkge1xuICAgIGlmIChwYWdlVHlwZSAmJiAhaW5wdXRQYXRoLmVuZHNXaXRoKCcuJyArIHBhZ2VUeXBlKSkge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtpbnB1dFBhdGh9LiR7cGFnZVR5cGV9YDtcbiAgICB9XG5cbiAgICBpZihpbnB1dFBhdGhbMF0gPT0gJ14nKXsgLy8gbG9hZCBmcm9tIHBhY2thZ2VzXG4gICAgICAgIGNvbnN0IFtwYWNrYWdlTmFtZSwgaW5QYXRoXSA9IFNwbGl0Rmlyc3QoJy8nLCAgaW5wdXRQYXRoLnN1YnN0cmluZygxKSk7XG4gICAgICAgIHJldHVybiAocGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3Rvcnk6ICcnKSArIGBub2RlX21vZHVsZXMvJHtwYWNrYWdlTmFtZX0vJHtmb2xkZXJ9LyR7aW5QYXRofWA7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGlucHV0UGF0aFsxXSA9PSAnLycpIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMik7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aC5kaXJuYW1lKGZpbGVQYXRoKX0vJHtpbnB1dFBhdGh9YDtcbiAgICB9IGVsc2UgaWYgKGlucHV0UGF0aFswXSA9PSAnLycpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7Z2V0VHlwZXMuU3RhdGljW3BhdGhUeXBlXX0ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke3BhdGhUeXBlID09IDAgPyB3b3JraW5nRGlyZWN0b3J5ICsgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyICsgJy8nIDogJyd9JHtmb2xkZXJ9LyR7aW5wdXRQYXRofWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKGlucHV0UGF0aCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGF0aFR5cGVzIHtcbiAgICBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyPzogc3RyaW5nLFxuICAgIFNtYWxsUGF0aD86IHN0cmluZyxcbiAgICBGdWxsUGF0aD86IHN0cmluZyxcbiAgICBGdWxsUGF0aENvbXBpbGU/OiBzdHJpbmdcbn1cblxuZnVuY3Rpb24gQ3JlYXRlRmlsZVBhdGgoZmlsZVBhdGg6c3RyaW5nLCBzbWFsbFBhdGg6c3RyaW5nLCBpbnB1dFBhdGg6c3RyaW5nLCBmb2xkZXI6c3RyaW5nLCBwYWdlVHlwZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgU21hbGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoc21hbGxQYXRoLCBpbnB1dFBhdGgsIGZvbGRlciwgcGFnZVR5cGUsIDIpLFxuICAgICAgICBGdWxsUGF0aDogQ3JlYXRlRmlsZVBhdGhPbmVQYXRoKGZpbGVQYXRoLCBpbnB1dFBhdGgsIGZvbGRlciwgcGFnZVR5cGUpLFxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBQYXJzZURlYnVnTGluZSxcbiAgICBDcmVhdGVGaWxlUGF0aCxcbiAgICBQYXJzZURlYnVnSW5mb1xufTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEdlbmVyYXRvciwgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSAnLi9Tb3VyY2VNYXAnO1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcm90ZWN0ZWQgbWFwOiBTb3VyY2VNYXBHZW5lcmF0b3I7XG4gICAgcHJvdGVjdGVkIGZpbGVEaXJOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIGxpbmVDb3VudCA9IDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZmlsZVBhdGg6IHN0cmluZywgcHJvdGVjdGVkIGh0dHBTb3VyY2UgPSB0cnVlLCBwcm90ZWN0ZWQgcmVsYXRpdmUgPSBmYWxzZSwgcHJvdGVjdGVkIGlzQ3NzID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnBvcCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaHR0cFNvdXJjZSlcbiAgICAgICAgICAgIHRoaXMuZmlsZURpck5hbWUgPSBwYXRoLmRpcm5hbWUodGhpcy5maWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFNvdXJjZShzb3VyY2U6IHN0cmluZykge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2Uuc3BsaXQoJzxsaW5lPicpLnBvcCgpLnRyaW0oKTtcblxuICAgICAgICBpZiAodGhpcy5odHRwU291cmNlKSB7XG4gICAgICAgICAgICBpZiAoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoc291cmNlKS5zdWJzdHJpbmcoMSkpKVxuICAgICAgICAgICAgICAgIHNvdXJjZSArPSAnLnNvdXJjZSc7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gU3BsaXRGaXJzdCgnLycsIHNvdXJjZSkucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAgICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZSgodGhpcy5yZWxhdGl2ZSA/ICcnOiAnLycpICsgc291cmNlLnJlcGxhY2UoL1xcXFwvZ2ksICcvJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodGhpcy5maWxlRGlyTmFtZSwgQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzb3VyY2UpO1xuICAgIH1cblxuICAgIGdldFJvd1NvdXJjZU1hcCgpOiBSYXdTb3VyY2VNYXB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC50b0pTT04oKVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRvVVJMQ29tbWVudCh0aGlzLm1hcCwgdGhpcy5pc0Nzcyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VNYXBTdG9yZSBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcml2YXRlIHN0b3JlU3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Mb2FkOiB7IG5hbWU6IHN0cmluZywgZGF0YTogYW55W10gfVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgZGVidWcgPSB0cnVlLCBpc0NzcyA9IGZhbHNlLCBodHRwU291cmNlID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgZmFsc2UsIGlzQ3NzKTtcbiAgICB9XG5cbiAgICBub3RFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uTG9hZC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGFkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTdHJpbmdUcmFja2VyJywgZGF0YTogW3RyYWNrLCB7dGV4dH1dIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuXG4gICAgYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkVGV4dCcsIGRhdGE6IFt0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHRoaXMubGluZUNvdW50ICs9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VVJMU291cmNlTWFwKG1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1hcC5zb3VyY2VzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIG1hcC5zb3VyY2VzW2ldID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKG1hcC5zb3VyY2VzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG5cbiAgICBhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbZnJvbU1hcCwgdHJhY2ssIHRleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGZyb21NYXApKS5lYWNoTWFwcGluZygobSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUluZm8gPSB0cmFjay5nZXRMaW5lKG0ub3JpZ2luYWxMaW5lKS5nZXREYXRhQXJyYXkoKVswXTtcblxuICAgICAgICAgICAgaWYgKG0uc291cmNlID09IHRoaXMuZmlsZVBhdGgpXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBkYXRhSW5mby5saW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSArIHRoaXMubGluZUNvdW50LCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2FkZFRleHQodGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBidWlsZEFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGRhdGEgfSBvZiB0aGlzLmFjdGlvbkxvYWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRUZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRleHQoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBBc1VSTENvbW1lbnQoKSB7XG4gICAgICAgIHRoaXMuYnVpbGRBbGwoKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIubWFwQXNVUkxDb21tZW50KClcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVEYXRhV2l0aE1hcCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5idWlsZEFsbCgpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZztcblxuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZyArIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpO1xuICAgIH1cblxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IFNvdXJjZU1hcFN0b3JlKHRoaXMuZmlsZVBhdGgsIHRoaXMuZGVidWcsIHRoaXMuaXNDc3MsIHRoaXMuaHR0cFNvdXJjZSk7XG4gICAgICAgIGNvcHkuYWN0aW9uTG9hZC5wdXNoKC4uLnRoaXMuYWN0aW9uTG9hZClcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3IgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VUkxDb21tZW50KG1hcDogU291cmNlTWFwR2VuZXJhdG9yLCBpc0Nzcz86IGJvb2xlYW4pIHtcbiAgICBsZXQgbWFwU3RyaW5nID0gYHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20obWFwLnRvU3RyaW5nKCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfWA7XG5cbiAgICBpZiAoaXNDc3MpXG4gICAgICAgIG1hcFN0cmluZyA9IGAvKiMgJHttYXBTdHJpbmd9Ki9gXG4gICAgZWxzZVxuICAgICAgICBtYXBTdHJpbmcgPSAnLy8jICcgKyBtYXBTdHJpbmc7XG5cbiAgICByZXR1cm4gJ1xcclxcbicgKyBtYXBTdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBNZXJnZVNvdXJjZU1hcChnZW5lcmF0ZWRNYXA6IFJhd1NvdXJjZU1hcCwgb3JpZ2luYWxNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG9yaWdpbmFsTWFwKTtcbiAgICBjb25zdCBuZXdNYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKCk7XG4gICAgKGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihnZW5lcmF0ZWRNYXApKS5lYWNoTWFwcGluZyhtID0+IHtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBvcmlnaW5hbC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1ufSlcbiAgICAgICAgaWYoIWxvY2F0aW9uLnNvdXJjZSkgcmV0dXJuO1xuICAgICAgICBuZXdNYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uLFxuICAgICAgICAgICAgICAgIGxpbmU6IG0uZ2VuZXJhdGVkTGluZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uOiBsb2NhdGlvbi5jb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbG9jYXRpb24ubGluZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNvdXJjZTogbG9jYXRpb24uc291cmNlXG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3TWFwO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBCYXNpYyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5cbmNsYXNzIGNyZWF0ZVBhZ2VTb3VyY2VNYXAgZXh0ZW5kcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZSA9IGZhbHNlLCByZWxhdGl2ZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgICAgIHRoaXMubGluZUNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBhZGRNYXBwaW5nRnJvbVRyYWNrKHRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IHRleHQsIGxpbmUsIGluZm8gfSA9IERhdGFBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0ID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3YWl0TmV4dExpbmUgJiYgbGluZSAmJiBpbmZvKSB7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UoaW5mbylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0TWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHN0b3JlTWFwLmdldFJvd1NvdXJjZU1hcCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0V2l0aE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHRleHQuZXEgKyBzdG9yZU1hcC5tYXBBc1VSTENvbW1lbnQoKTtcbn0iLCAiaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgb3V0cHV0TWFwLCBvdXRwdXRXaXRoTWFwIH0gZnJvbSBcIi4vU3RyaW5nVHJhY2tlclRvU291cmNlTWFwXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICB0ZXh0Pzogc3RyaW5nLFxuICAgIGluZm86IHN0cmluZyxcbiAgICBsaW5lPzogbnVtYmVyLFxuICAgIGNoYXI/OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFN0cmluZ0luZGV4ZXJJbmZvIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGxlbmd0aDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlNYXRjaCBleHRlbmRzIEFycmF5PFN0cmluZ1RyYWNrZXI+IHtcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBpbnB1dD86IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyaW5nVHJhY2tlciB7XG4gICAgcHJpdmF0ZSBEYXRhQXJyYXk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mb1tdID0gW107XG4gICAgcHVibGljIEluZm9UZXh0OiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBPbkxpbmUgPSAxO1xuICAgIHB1YmxpYyBPbkNoYXIgPSAxO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBJbmZvVGV4dCB0ZXh0IGluZm8gZm9yIGFsbCBuZXcgc3RyaW5nIHRoYXQgYXJlIGNyZWF0ZWQgaW4gdGhpcyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoSW5mbz86IHN0cmluZyB8IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgdGV4dD86IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIEluZm8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvO1xuICAgICAgICB9IGVsc2UgaWYgKEluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdChJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkFkZEZpbGVUZXh0KHRleHQsIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgZ2V0IGVtcHR5SW5mbygpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldERlZmF1bHQoSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0KSB7XG4gICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvLmluZm87XG4gICAgICAgIHRoaXMuT25MaW5lID0gSW5mby5saW5lO1xuICAgICAgICB0aGlzLk9uQ2hhciA9IEluZm8uY2hhcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGF0YUFycmF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGxhc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IERlZmF1bHRJbmZvVGV4dCgpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICBpZiAoIXRoaXMuRGF0YUFycmF5LmZpbmQoeCA9PiB4LmluZm8pICYmIHRoaXMuSW5mb1RleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiB0aGlzLkluZm9UZXh0LFxuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuT25MaW5lLFxuICAgICAgICAgICAgICAgIGNoYXI6IHRoaXMuT25DaGFyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbdGhpcy5EYXRhQXJyYXkubGVuZ3RoIC0gMV0gPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGZpcnN0IEluZm9UZXh0XG4gICAgICovXG4gICAgZ2V0IFN0YXJ0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5WzBdID8/IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgYXMgb25lIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0IE9uZVN0cmluZygpIHtcbiAgICAgICAgbGV0IGJpZ1N0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGJpZ1N0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmlnU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgc28geW91IGNhbiBjaGVjayBpZiBpdCBlcXVhbCBvciBub3RcbiAgICAgKiB1c2UgbGlrZSB0aGF0OiBteVN0cmluZy5lcSA9PSBcImNvb2xcIlxuICAgICAqL1xuICAgIGdldCBlcSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgaW5mbyBhYm91dCB0aGlzIHRleHRcbiAgICAgKi9cbiAgICBnZXQgbGluZUluZm8oKSB7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgY29uc3QgcyA9IGQuaW5mby5zcGxpdCgnPGxpbmU+Jyk7XG4gICAgICAgIHMucHVzaChCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHMucG9wKCkpO1xuXG4gICAgICAgIHJldHVybiBgJHtzLmpvaW4oJzxsaW5lPicpfToke2QubGluZX06JHtkLmNoYXJ9YDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGxlbmd0aCBvZiB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIGNvcHkgb2YgdGhpcyBzdHJpbmcgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIENsb25lKCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld0RhdGEuQWRkVGV4dEFmdGVyKGkudGV4dCwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBZGRDbG9uZShkYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goLi4uZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLkRhdGFBcnJheS51bnNoaWZ0KC4uLmNvcHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgVGV4dCBGaWxlIFRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRGaWxlVGV4dCh0ZXh0OiBzdHJpbmcsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKSB7XG4gICAgICAgIGxldCBMaW5lQ291bnQgPSAxLCBDaGFyQ291bnQgPSAxO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzaW1wbGUgbWV0aG9mIHRvIGN1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBuZXcgY3V0dGVkIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQ3V0U3RyaW5nKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuXG4gICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucHVzaCguLi50aGlzLkRhdGFBcnJheS5zbGljZShzdGFydCwgZW5kKSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG5cbiAgICAgICAgd2hpbGUgKChsaW1pdCA9PSBudWxsIHx8IGNvdW50ZXIgPCBsaW1pdCkgJiYgaGFzTWF0aD8uWzBdPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IFsuLi5oYXNNYXRoWzBdXS5sZW5ndGgsIGluZGV4ID0gdGhpcy5jaGFyTGVuZ3RoKGhhc01hdGguaW5kZXgpO1xuICAgICAgICAgICAgYWxsU3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4ICsgYWRkTmV4dCxcbiAgICAgICAgICAgICAgICBsZW5ndGhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYWluVGV4dCA9IG1haW5UZXh0LnNsaWNlKGhhc01hdGguaW5kZXggKyBoYXNNYXRoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGpvaW4oYXJyOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBsZXQgYWxsID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgYXJyKXtcbiAgICAgICAgICAgIGFsbC5BZGRDbG9uZShpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXBsYWNlckFzeW5jKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhhd2FpdCBmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBsZXQgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZShsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEpLCBjb2x1bW4gPSBjb2wgPz8gbG9jYXRpb24/LmNvbHVtbiA/PyAwO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKChsaW5lID8/IGxvY2F0aW9uPy5saW5lKSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gc2VhcmNoTGluZS5hdChjb2x1bW4tMSkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICByZXR1cm4gYCR7dGV4dCB8fCBtZXNzYWdlfSwgb24gZmlsZSAtPlxcbiR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrc2VhcmNoTGluZS5leHRyYWN0SW5mbygpfToke2RhdGEubGluZX06JHtkYXRhLmNoYXJ9JHtsb2NhdGlvbj8ubGluZVRleHQgPyAnXFxuTGluZTogXCInICsgbG9jYXRpb24ubGluZVRleHQudHJpbSgpICsgJ1wiJzogJyd9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nV2l0aFRhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dFdpdGhNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbilcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgICAgICByZXR1cm4gb3V0cHV0TWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24sIGh0dHBTb3VyY2UsIHJlbGF0aXZlKVxuICAgIH1cbn0iLCAiaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5jb25zdCBsb2FkUGF0aCA9IHR5cGVvZiBlc2J1aWxkICE9PSAndW5kZWZpbmVkJyA/ICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50Lyc6ICcvLi4vJztcbmNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsICsgbG9hZFBhdGggKyAnYnVpbGQud2FzbScpKSk7XG5jb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuY29uc3Qgd2FzbSA9IHdhc21JbnN0YW5jZS5leHBvcnRzO1xuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbSh0ZXh0LCBzZWFyY2gpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHNlYXJjaCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfY2xvc2VfY2hhcl9odG1sX2VsZW0ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9jbG9zZV9jaGFyKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuLyoqXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9lcnJvcnMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHdhc20uZ2V0X2Vycm9ycyhyZXRwdHIpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IGJsb2NrXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX2Jsb2NrKHRleHQsIGJsb2NrKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChibG9jaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX2Jsb2NrKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tpcF9zcGVjaWFsX3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gc2ltcGxlX3NraXBcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2NvbXBvbmVudChza2lwX3NwZWNpYWxfdGFnLCBzaW1wbGVfc2tpcCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2tpcF9zcGVjaWFsX3RhZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2ltcGxlX3NraXAsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB3YXNtLmluc2VydF9jb21wb25lbnQocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kX3R5cGVcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfb2ZfZGVmKHRleHQsIGVuZF90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmRfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX2RlZihwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHFfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9xKHRleHQsIHFfdHlwZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmZpbmRfZW5kX29mX3EocHRyMCwgbGVuMCwgcV90eXBlLmNvZGVQb2ludEF0KDApKTtcbiAgICByZXR1cm4gcmV0ID4+PiAwO1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzKHRleHQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2VqcyhyZXRwdHIsIHB0cjAsIGxlbjApO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gcmF6b3JfdG9fZWpzX21pbih0ZXh0LCBuYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB3YXNtLnJhem9yX3RvX2Vqc19taW4ocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBzdGFydFxuKiBAcGFyYW0ge3N0cmluZ30gZW5kXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGVqc19wYXJzZSh0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGFydCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgdmFyIHB0cjIgPSBwYXNzU3RyaW5nVG9XYXNtMChlbmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjIgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uZWpzX3BhcnNlKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMiwgbGVuMik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbiIsICJleHBvcnQgY29uc3QgU2ltcGxlU2tpcCA9IFsndGV4dGFyZWEnLCdzY3JpcHQnLCAnc3R5bGUnXTtcbmV4cG9ydCBjb25zdCBTa2lwU3BlY2lhbFRhZyA9IFtbXCIlXCIsIFwiJVwiXSwgW1wiI3tkZWJ1Z31cIiwgXCJ7ZGVidWd9I1wiXV07IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IGZpbmRfZW5kX29mX2RlZiwgZmluZF9lbmRfb2ZfcSwgZmluZF9lbmRfYmxvY2sgfSBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSAnLi4vLi4vc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzJztcbmltcG9ydCB7IGdldERpcm5hbWUsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgd29ya2VyUG9vbCBmcm9tICd3b3JrZXJwb29sJztcbmltcG9ydCB7IGNwdXMgfSBmcm9tICdvcyc7XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmNvbnN0IHBvb2wgPSB3b3JrZXJQb29sLnBvb2woU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL3dhc20vY29tcG9uZW50L3dvcmtlckluc2VydENvbXBvbmVudC5qcycsIHsgbWF4V29ya2VyczogY3B1TGVuZ3RoIH0pO1xuXG5leHBvcnQgY2xhc3MgQmFzZVJlYWRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZW5kIG9mIHF1b3RhdGlvbiBtYXJrcywgc2tpcHBpbmcgdGhpbmdzIGxpa2UgZXNjYXBpbmc6IFwiXFxcXFwiXCJcbiAgICAgKiBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluZEVudE9mUSh0ZXh0OiBzdHJpbmcsIHFUeXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfb2ZfcSh0ZXh0LCBxVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBjaGFyIHNraXBwaW5nIGRhdGEgaW5zaWRlIHF1b3RhdGlvbiBtYXJrc1xuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW5kT2ZEZWYodGV4dDogc3RyaW5nLCBFbmRUeXBlOiBzdHJpbmdbXSB8IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShFbmRUeXBlKSkge1xuICAgICAgICAgICAgRW5kVHlwZSA9IFtFbmRUeXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgSlNPTi5zdHJpbmdpZnkoRW5kVHlwZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhbWUgYXMgJ2ZpbmRFbmRPZkRlZicgb25seSB3aXRoIG9wdGlvbiB0byBjdXN0b20gJ29wZW4nIGFuZCAnY2xvc2UnXG4gICAgICogYGBganNcbiAgICAgKiBGaW5kRW5kT2ZCbG9jayhgY29vbCBcIn1cIiB7IGRhdGEgfSB9IG5leHRgLCAneycsICd9JylcbiAgICAgKiBgYGBcbiAgICAgKiBpdCB3aWxsIHJldHVybiB0aGUgMTggLT4gXCJ9IG5leHRcIlxuICAgICAqICBAcmV0dXJuIHRoZSBpbmRleCBvZiBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgRmluZEVuZE9mQmxvY2sodGV4dDogc3RyaW5nLCBvcGVuOiBzdHJpbmcsIGVuZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX2Jsb2NrKHRleHQsIG9wZW4gKyBlbmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc2VydENvbXBvbmVudEJhc2Uge1xuICAgIFNpbXBsZVNraXA6IHN0cmluZ1tdID0gU2V0dGluZ3MuU2ltcGxlU2tpcDtcbiAgICBTa2lwU3BlY2lhbFRhZzogc3RyaW5nW11bXSA9IFNldHRpbmdzLlNraXBTcGVjaWFsVGFnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmludE5ldz86IGFueSkgeyB9XG5cbiAgICBwcml2YXRlIHByaW50RXJyb3JzKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGVycm9yczogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmludE5ldykgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBKU09OLnBhcnNlKGVycm9ycykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50TmV3KHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuV2FybmluZywgeW91IGRpZG4ndCB3cml0ZSByaWdodCB0aGlzIHRhZzogXCIke2kudHlwZV9uYW1lfVwiLCB1c2VkIGluOiAke3RleHQuYXQoTnVtYmVyKGkuaW5kZXgpKS5saW5lSW5mb31cXG4odGhlIHN5c3RlbSB3aWxsIGF1dG8gY2xvc2UgaXQpYCxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFyKHRleHQ6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IFtwb2ludCwgZXJyb3JzXSA9IGF3YWl0IHBvb2wuZXhlYygnRmluZENsb3NlQ2hhcicsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgRmluZENsb3NlQ2hhckhUTUwodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFySFRNTCcsIFt0ZXh0LmVxLCBTZWFyY2hdKTtcbiAgICAgICAgdGhpcy5wcmludEVycm9ycyh0ZXh0LCBlcnJvcnMpO1xuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG59XG5cbnR5cGUgUGFyc2VCbG9ja3MgPSB7IG5hbWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfVtdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSYXpvclRvRUpTKHRleHQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ1Jhem9yVG9FSlMnLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlNNaW5pKHRleHQ6IHN0cmluZywgZmluZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXJbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKU01pbmknLCBbdGV4dCxmaW5kXSkpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFSlNQYXJzZXIodGV4dDogc3RyaW5nLCBzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IFByb21pc2U8UGFyc2VCbG9ja3M+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBwb29sLmV4ZWMoJ0VKU1BhcnNlcicsIFt0ZXh0LCBzdGFydCwgZW5kXSkpO1xufSIsICJcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cbmludGVyZmFjZSBTcGxpdFRleHQge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICB0eXBlX25hbWU6IHN0cmluZyxcbiAgICBpc19za2lwOiBib29sZWFuXG59XG5cbmNvbnN0IGNwdUxlbmd0aCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY3B1cygpLmxlbmd0aCAvIDIpKTtcbmNvbnN0IHBhcnNlX3N0cmVhbSA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9yZWFkZXIvd29ya2VyLmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQYXJzZVRleHRTdHJlYW0odGV4dDogc3RyaW5nKTogUHJvbWlzZTxTcGxpdFRleHRbXT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdidWlsZF9zdHJlYW0nLCBbdGV4dF0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVuZE9mRGVmU2tpcEJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2ZpbmRfZW5kX29mX2RlZl9za2lwX2Jsb2NrJywgW3RleHQsIEpTT04uc3RyaW5naWZ5KHR5cGVzKV0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIHR5cGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlX3N0cmVhbS5leGVjKCdlbmRfb2ZfYmxvY2snLCBbdGV4dCwgdHlwZXMuam9pbignJyldKTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgQmFzZUVudGl0eUNvZGUge1xuICAgIFJlcGxhY2VBbGwodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZykge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0ZXh0LnNwbGl0KGZpbmQpKSB7XG4gICAgICAgICAgICBuZXdUZXh0ICs9IHJlcGxhY2UgKyBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQuc3Vic3RyaW5nKHJlcGxhY2UubGVuZ3RoKTtcbiAgICB9XG59XG5cblxuYWJzdHJhY3QgY2xhc3MgUmVCdWlsZENvZGVCYXNpYyBleHRlbmRzIEJhc2VFbnRpdHlDb2RlIHtcbiAgICBwdWJsaWMgUGFyc2VBcnJheTogU3BsaXRUZXh0W107XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLlBhcnNlQXJyYXkgPSBQYXJzZUFycmF5O1xuICAgIH1cblxuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgbGV0IE91dFN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgT3V0U3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLlJlcGxhY2VBbGwoT3V0U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cblxuXG50eXBlIERhdGFDb2RlSW5mbyA9IHtcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgaW5wdXRzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgY2xhc3MgUmVCdWlsZENvZGVTdHJpbmcgZXh0ZW5kcyBSZUJ1aWxkQ29kZUJhc2ljIHtcbiAgICBwcml2YXRlIERhdGFDb2RlOiBEYXRhQ29kZUluZm87XG5cbiAgICBjb25zdHJ1Y3RvcihQYXJzZUFycmF5OiBTcGxpdFRleHRbXSkge1xuICAgICAgICBzdXBlcihQYXJzZUFycmF5KTtcbiAgICAgICAgdGhpcy5EYXRhQ29kZSA9IHsgdGV4dDogXCJcIiwgaW5wdXRzOiBbXSB9O1xuICAgICAgICB0aGlzLkNyZWF0ZURhdGFDb2RlKCk7XG4gICAgfVxuXG4gICAgZ2V0IENvZGVCdWlsZFRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFDb2RlLnRleHQ7XG4gICAgfVxuXG4gICAgc2V0IENvZGVCdWlsZFRleHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IEFsbElucHV0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ3JlYXRlRGF0YUNvZGUoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlBhcnNlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChpLmlzX3NraXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gYDx8JHt0aGlzLkRhdGFDb2RlLmlucHV0cy5sZW5ndGh9fCR7aS50eXBlX25hbWUgPz8gJyd9fD5gO1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUuaW5wdXRzLnB1c2goaS50ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS50ZXh0ICs9IGkudGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlmIHRoZSA8fHw+IHN0YXJ0IHdpdGggYSAoKy4pIGxpa2UgdGhhdCBmb3IgZXhhbXBsZSwgXCIrLjx8fD5cIiwgdGhlIHVwZGF0ZSBmdW5jdGlvbiB3aWxsIGdldCB0aGUgbGFzdCBcIlNraXBUZXh0XCIgaW5zdGVhZCBnZXR0aW5nIHRoZSBuZXcgb25lXG4gICAgICogc2FtZSB3aXRoIGEgKC0uKSBqdXN0IGZvciBpZ25vcmluZyBjdXJyZW50IHZhbHVlXG4gICAgICogQHJldHVybnMgdGhlIGJ1aWxkZWQgY29kZVxuICAgICAqL1xuICAgIEJ1aWxkQ29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5EYXRhQ29kZS50ZXh0LnJlcGxhY2UoLzxcXHwoWzAtOV0rKVxcfFtcXHddKlxcfD4vZ2ksIChfLCBnMSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUuaW5wdXRzW2cxXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLlJlcGxhY2VBbGwobmV3U3RyaW5nLCAnPHwtfD4nLCAnPHx8PicpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8gfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCYXNlUmVhZGVyLCBFSlNQYXJzZXIgfSBmcm9tICcuL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL3RyYW5zZm9ybS9FYXN5U2NyaXB0JztcblxuaW50ZXJmYWNlIEpTUGFyc2VyVmFsdWVzIHtcbiAgICB0eXBlOiAndGV4dCcgfCAnc2NyaXB0JyB8ICduby10cmFjaycsXG4gICAgdGV4dDogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU1BhcnNlciB7XG4gICAgcHVibGljIHN0YXJ0OiBzdHJpbmc7XG4gICAgcHVibGljIHRleHQ6IFN0cmluZ1RyYWNrZXI7XG4gICAgcHVibGljIGVuZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWVzOiBKU1BhcnNlclZhbHVlc1tdO1xuXG4gICAgY29uc3RydWN0b3IodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBzdGFydCA9IFwiPCVcIiwgZW5kID0gXCIlPlwiLCB0eXBlID0gJ3NjcmlwdCcpIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBSZXBsYWNlVmFsdWVzKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlQWxsKGZpbmQsIHJlcGxhY2UpO1xuICAgIH1cblxuICAgIGZpbmRFbmRPZkRlZkdsb2JhbCh0ZXh0OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGVxID0gdGV4dC5lcVxuICAgICAgICBjb25zdCBmaW5kID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZXEsIFsnOycsICdcXG4nLCB0aGlzLmVuZF0pO1xuICAgICAgICByZXR1cm4gZmluZCAhPSAtMSA/IGZpbmQgKyAxIDogZXEubGVuZ3RoO1xuICAgIH1cblxuICAgIFNjcmlwdFdpdGhJbmZvKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgV2l0aEluZm8gPSBuZXcgU3RyaW5nVHJhY2tlcih0ZXh0LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgY29uc3QgYWxsU2NyaXB0ID0gdGV4dC5zcGxpdCgnXFxuJyksIGxlbmd0aCA9IGFsbFNjcmlwdC5sZW5ndGg7XG4gICAgICAgIC8vbmV3IGxpbmUgZm9yIGRlYnVnIGFzIG5ldyBsaW5lIHN0YXJ0XG4gICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuXG4gICAgICAgIC8vZmlsZSBuYW1lIGluIGNvbW1lbnRcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNjcmlwdCkge1xuXG4gICAgICAgICAgICBpZihpLmVxLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYC8vISR7aS5saW5lSW5mb31cXG5gKSxcbiAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKGNvdW50ICE9IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFdpdGhJbmZvLlBsdXMoJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gV2l0aEluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZmluZFNjcmlwdHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IEVKU1BhcnNlcih0aGlzLnRleHQuZXEsIHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgc3Vic3RyaW5nID0gdGhpcy50ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGkubmFtZTtcblxuICAgICAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGB3cml0ZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlU2FmZSgke3N1YnN0cmluZ30pO2A7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc2NyaXB0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlYnVnXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgXFxucnVuX3NjcmlwdF9uYW1lID0gXFxgJHtKU1BhcnNlci5maXhUZXh0KHN1YnN0cmluZyl9XFxgO2BcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICduby10cmFjayc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzdWJzdHJpbmcsXG4gICAgICAgICAgICAgICAgdHlwZTogPGFueT50eXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmaXhUZXh0KHRleHQ6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvYC9naSwgJ1xcXFxgJykucmVwbGFjZSgvXFwkL2dpLCAnXFxcXHUwMDI0Jyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFRleHRTaW1wbGVRdW90ZXModGV4dDogU3RyaW5nVHJhY2tlciB8IHN0cmluZyl7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ2ksICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyk7XG4gICAgfVxuXG4gICAgUmVCdWlsZFRleHQoKSB7XG4gICAgICAgIGNvbnN0IGFsbGNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGlmIChpLnRleHQuZXEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpLnR5cGUgPT0gJ25vLXRyYWNrJykge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCAnIScsIGkudGV4dCwgdGhpcy5lbmQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsbGNvZGUuUGx1cyh0aGlzLnN0YXJ0LCBpLnRleHQsIHRoaXMuZW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxjb2RlO1xuICAgIH1cblxuICAgIEJ1aWxkQWxsKGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgcnVuU2NyaXB0ID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy52YWx1ZXNbMF0/LnRleHQ/LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBydW5TY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyRgXFxub3V0X3J1bl9zY3JpcHQudGV4dCs9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1ZyAmJiBpLnR5cGUgPT0gJ3NjcmlwdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgXFxucnVuX3NjcmlwdF9jb2RlPVxcYCR7SlNQYXJzZXIuZml4VGV4dChpLnRleHQpfVxcYDtgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyaXB0V2l0aEluZm8oaS50ZXh0KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzKGkudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHByaW50RXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgPHAgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPiR7bWVzc2FnZX08L3A+YDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgUnVuQW5kRXhwb3J0KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGV4dCwgcGF0aClcbiAgICAgICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG4gICAgICAgIHJldHVybiBwYXJzZXIuQnVpbGRBbGwoaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3BsaXQyRnJvbUVuZCh0ZXh0OiBzdHJpbmcsIHNwbGl0Q2hhcjogc3RyaW5nLCBudW1Ub1NwbGl0RnJvbUVuZCA9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRleHQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0ZXh0W2ldID09IHNwbGl0Q2hhcikge1xuICAgICAgICAgICAgICAgIG51bVRvU3BsaXRGcm9tRW5kLS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1Ub1NwbGl0RnJvbUVuZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0ZXh0LnN1YnN0cmluZygwLCBpKSwgdGV4dC5zdWJzdHJpbmcoaSArIDEpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdGV4dF07XG4gICAgfVxufVxuXG5cbi8vYnVpbGQgc3BlY2lhbCBjbGFzcyBmb3IgcGFyc2VyIGNvbW1lbnRzIC8qKi8gc28geW91IGJlIGFibGUgdG8gYWRkIFJhem9yIGluc2lkZSBvZiBzdHlsZSBvdCBzY3JpcHQgdGFnXG5cbmludGVyZmFjZSBHbG9iYWxSZXBsYWNlQXJyYXkge1xuICAgIHR5cGU6ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBjbGFzcyBFbmFibGVHbG9iYWxSZXBsYWNlIHtcbiAgICBwcml2YXRlIHNhdmVkQnVpbGREYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXlbXSA9IFtdO1xuICAgIHByaXZhdGUgYnVpbGRDb2RlOiBSZUJ1aWxkQ29kZVN0cmluZztcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIHJlcGxhY2VyOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkZFRleHQgPSBcIlwiKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZXIgPSBSZWdFeHAoYCR7YWRkVGV4dH1cXFxcL1xcXFwqIXN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+XFxcXCpcXFxcL3xzeXN0ZW0tLTxcXFxcfGVqc1xcXFx8KFswLTldKVxcXFx8PmApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWQoY29kZTogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYnVpbGRDb2RlID0gbmV3IFJlQnVpbGRDb2RlU3RyaW5nKGF3YWl0IFBhcnNlVGV4dFN0cmVhbShhd2FpdCB0aGlzLkV4dHJhY3RBbmRTYXZlQ29kZShjb2RlKSkpO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXh0cmFjdENvZGUgPSBuZXcgSlNQYXJzZXIoY29kZSwgdGhpcy5wYXRoKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvZGUuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBsZXQgbmV3VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZXh0cmFjdENvZGUudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVkQnVpbGREYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkudGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5ld1RleHQgKz0gYHN5c3RlbS0tPHxlanN8JHtjb3VudGVyKyt9fD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBQYXJzZU91dHNpZGVPZkNvbW1lbnQodGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlcigvc3lzdGVtLS08XFx8ZWpzXFx8KFswLTldKVxcfD4vLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gU3BsaXRUb1JlcGxhY2VbMV07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoaW5kZXguU3RhcnRJbmZvKS5QbHVzJGAke3RoaXMuYWRkVGV4dH0vKiFzeXN0ZW0tLTx8ZWpzfCR7aW5kZXh9fD4qL2A7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBTdGFydEJ1aWxkKCkge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29tbWVudHMgPSBuZXcgSlNQYXJzZXIobmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdGhpcy5idWlsZENvZGUuQ29kZUJ1aWxkVGV4dCksIHRoaXMucGF0aCwgJy8qJywgJyovJyk7XG4gICAgICAgIGF3YWl0IGV4dHJhY3RDb21tZW50cy5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29tbWVudHMudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGkudGV4dCA9IHRoaXMuUGFyc2VPdXRzaWRlT2ZDb21tZW50KGkudGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0ID0gZXh0cmFjdENvbW1lbnRzLlJlQnVpbGRUZXh0KCkuZXE7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29kZS5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlc3RvcmVBc0NvZGUoRGF0YTogR2xvYmFsUmVwbGFjZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihEYXRhLnRleHQuU3RhcnRJbmZvKS5QbHVzJGA8JSR7RGF0YS50eXBlID09ICduby10cmFjaycgPyAnISc6ICcnfSR7RGF0YS50ZXh0fSU+YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgUmVzdG9yZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlcih0aGlzLnJlcGxhY2VyLCAoU3BsaXRUb1JlcGxhY2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFNwbGl0VG9SZXBsYWNlWzFdID8/IFNwbGl0VG9SZXBsYWNlWzJdKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUmVzdG9yZUFzQ29kZSh0aGlzLnNhdmVkQnVpbGREYXRhW2luZGV4XSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgYnVpbGQsIE1lc3NhZ2UsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4vcHJpbnRNZXNzYWdlJztcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5SlModGV4dDogc3RyaW5nLCB0cmFja2VyOiBTdHJpbmdUcmFja2VyKXtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7Y29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKHRleHQsIHttaW5pZnk6IHRydWV9KTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKHRyYWNrZXIsIHdhcm5pbmdzKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKHRyYWNrZXIsIGVycilcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG59IiwgImltcG9ydCB7IGJ1aWxkLCBNZXNzYWdlLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ2NvbXBpbGF0aW9uLWVycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IGAke2Vyci50ZXh0fSwgb24gZmlsZSAtPiAke2ZpbGVQYXRoID8/IGVyci5sb2NhdGlvbi5maWxlfToke2Vycj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHtlcnI/LmxvY2F0aW9uPy5jb2x1bW4gPz8gMH1gXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcCh7ZXJyb3JzfToge2Vycm9yczogIE1lc3NhZ2VbXX0sIHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcCk7XG4gICAgZm9yKGNvbnN0IGVyciBvZiBlcnJvcnMpe1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBvcmlnaW5hbC5vcmlnaW5hbFBvc2l0aW9uRm9yKGVyci5sb2NhdGlvbik7XG4gICAgICAgIGlmKHNvdXJjZS5zb3VyY2UpXG4gICAgICAgICAgICBlcnIubG9jYXRpb24gPSA8YW55PnNvdXJjZTtcbiAgICB9XG4gICAgRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc30sIGZpbGVQYXRoKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3M6IE1lc3NhZ2VbXSwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBmb3IgKGNvbnN0IHdhcm4gb2Ygd2FybmluZ3MpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBgJHt3YXJuLnRleHR9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyB3YXJuLmxvY2F0aW9uLmZpbGV9OiR7d2Fybj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHt3YXJuPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKGJhc2U6IFN0cmluZ1RyYWNrZXIsIHdhcm5pbmdzOiBNZXNzYWdlW10pIHtcbiAgICBmb3IgKGNvbnN0IHdhcm4gb2Ygd2FybmluZ3MpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZSh3YXJuKVxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwge2Vycm9yc306e2Vycm9yczogTWVzc2FnZVtdfSkge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUoZXJyKVxuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGludGVyZmFjZSBQcmV2ZW50TG9nIHtcbiAgICBpZD86IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgZXJyb3JOYW1lOiBzdHJpbmcsXG4gICAgdHlwZT86IFwid2FyblwiIHwgXCJlcnJvclwiXG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nczoge1ByZXZlbnRFcnJvcnM6IHN0cmluZ1tdfSA9IHtcbiAgICBQcmV2ZW50RXJyb3JzOiBbXVxufVxuXG5jb25zdCBQcmV2ZW50RG91YmxlTG9nOiBzdHJpbmdbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgQ2xlYXJXYXJuaW5nID0gKCkgPT4gUHJldmVudERvdWJsZUxvZy5sZW5ndGggPSAwO1xuXG4vKipcbiAqIElmIHRoZSBlcnJvciBpcyBub3QgaW4gdGhlIFByZXZlbnRFcnJvcnMgYXJyYXksIHByaW50IHRoZSBlcnJvclxuICogQHBhcmFtIHtQcmV2ZW50TG9nfSAgLSBgaWRgIC0gVGhlIGlkIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5ld1ByaW50KHtpZCwgdGV4dCwgdHlwZSA9IFwid2FyblwiLCBlcnJvck5hbWV9OiBQcmV2ZW50TG9nKSB7XG4gICAgaWYoIVByZXZlbnREb3VibGVMb2cuaW5jbHVkZXMoaWQgPz8gdGV4dCkgJiYgIVNldHRpbmdzLlByZXZlbnRFcnJvcnMuaW5jbHVkZXMoZXJyb3JOYW1lKSl7XG4gICAgICAgIFByZXZlbnREb3VibGVMb2cucHVzaChpZCA/PyB0ZXh0KTtcbiAgICAgICAgcmV0dXJuIFt0eXBlLCAodGV4dC5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJykgKyBgXFxuXFxuRXJyb3ItQ29kZTogJHtlcnJvck5hbWV9XFxuXFxuYCldO1xuICAgIH1cbiAgICByZXR1cm4gW1wiZG8tbm90aGluZ1wiXVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogc3RyaW5nLCBwYXJhbXM6IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3IgPSBcIiR7c2VsZWN0b3J9XCIsIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke2F3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSl9XG4gICAgICAgIHZhciBleHBvcnRzID0gJHtuYW1lfS5leHBvcnRzO1xuICAgICAgICByZXR1cm4gc2VuZFRvU2VsZWN0b3Ioc2VsZWN0b3IsIG91dF9ydW5fc2NyaXB0LnRleHQpO1xuICAgIH1cXG4ke25hbWV9LmV4cG9ydHMgPSB7fTtgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIGRhdGFUYWcuZ2V0VmFsdWUoJ3BhcmFtcycpLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCdzZWxlY3RvcicpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50KTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBsZXQgUmVzQ29kZSA9IEJldHdlZW5UYWdEYXRhO1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZShcInNlcnZcIik7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUpO1xuXG4gICAgY29uc3QgQmV0d2VlblRhZ0RhdGFFeHRyYWN0ZWQgPSBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCk7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlbWFwOiAnZXh0ZXJuYWwnLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHttYXAsIGNvZGUsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgd2FybmluZ3MpO1xuICAgICAgICBcbiAgICAgICAgUmVzQ29kZSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBtYXApKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke1Jlc0NvZGV9PC9zY3JpcHQ+YFxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBtYXAgPSB0eXBlb2Ygc291cmNlTWFwID09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShzb3VyY2VNYXApOiBzb3VyY2VNYXA7XG5cbiAgICBjb25zdCB0cmFja0NvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICBjb25zdCBzcGxpdExpbmVzID0gdHJhY2tDb2RlLnNwbGl0KCdcXG4nKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBpc01hcCA9IHNwbGl0TGluZXNbbS5nZW5lcmF0ZWRMaW5lIC0gMV07XG4gICAgICAgIGlmICghaXNNYXApIHJldHVybjtcblxuXG4gICAgICAgIGxldCBjaGFyQ291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaXNNYXAuc3Vic3RyaW5nKG0uZ2VuZXJhdGVkQ29sdW1uID8gbS5nZW5lcmF0ZWRDb2x1bW4gLSAxOiAwKS5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICAgICAgaS5pbmZvID0gbS5zb3VyY2U7XG4gICAgICAgICAgICBpLmxpbmUgPSBtLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAgIGkuY2hhciA9IGNoYXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2tDb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBnZW5lcmF0ZWQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbExpbmVzID0gb3JpZ2luYWwuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZW5lcmF0ZWQuZ2V0RGF0YUFycmF5KCkpIHtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ICA9IG9yaWdpbmFsTGluZXNbaXRlbS5saW5lIC0gMV0/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgaXRlbS5pbmZvID0gaW5mbztcbiAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYWNrVG9PcmlnaW5hbChvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG5ld1RyYWNrZXIgPSBhd2FpdCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZSwgc291cmNlTWFwKTtcbiAgICBtZXJnZUluZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyKTtcbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlciwgbXlTb3VyY2U6IHN0cmluZykge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBpZihpdGVtLmluZm8gPT0gbXlTb3VyY2Upe1xuICAgICAgICAgICAgY29uc3Qge2xpbmUsIGNoYXIsIGluZm99ID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXS5hdChpdGVtLmNoYXItMSk/LkRlZmF1bHRJbmZvVGV4dCA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICAgICAgICAgIGl0ZW0ubGluZSA9IGxpbmU7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaXRlbS5jaGFyID0gY2hhcjtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW0uaW5mbykge1xuICAgICAgICAgICAgaXRlbS5pbmZvID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKGl0ZW0uaW5mbykpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsU3NzKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlU2Fzc0luZm9TdHJpbmdUcmFja2VyKG9yaWdpbmFsLCBuZXdUcmFja2VyLCBteVNvdXJjZSk7XG5cbiAgICByZXR1cm4gbmV3VHJhY2tlcjtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCwgdGFnRGF0YU9iamVjdEFycmF5IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEdldFBsdWdpbiwgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCB0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IEJldHdlZW5UYWdEYXRhRXEgPSBCZXR3ZWVuVGFnRGF0YS5lcSwgQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSA9IEJldHdlZW5UYWdEYXRhRXEudHJpbSgpLCBpc01vZGVsID0gdGFnRGF0YS5nZXRWYWx1ZSgndHlwZScpID09ICdtb2R1bGUnLCBpc01vZGVsU3RyaW5nQ2FjaGUgPSBpc01vZGVsID8gJ3NjcmlwdE1vZHVsZScgOiAnc2NyaXB0JztcblxuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLmluY2x1ZGVzKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcbiAgICBzZXNzaW9uSW5mby5jYWNoZVtpc01vZGVsU3RyaW5nQ2FjaGVdLnB1c2goQmV0d2VlblRhZ0RhdGFFcUFzVHJpbSk7XG5cbiAgICBsZXQgcmVzdWx0Q29kZSA9ICcnLCByZXN1bHRNYXA6IHN0cmluZztcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6IHNlc3Npb25JbmZvLmRlYnVnID8gJ2V4dGVybmFsJyA6IGZhbHNlLFxuICAgICAgICAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RzJzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0cyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAnanN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIkpTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0c3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgbWFwLCBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhLmVxLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG5cbiAgICAgICAgcmVzdWx0Q29kZSA9IGNvZGU7XG4gICAgICAgIHJlc3VsdE1hcCA9IG1hcDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCBlcnIpXG4gICAgfVxuXG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoaXNNb2RlbCA/ICdtb2R1bGUnIDogJ3NjcmlwdCcsIHRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHRNYXApIHtcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKEpTT04ucGFyc2UocmVzdWx0TWFwKSwgQmV0d2VlblRhZ0RhdGEsIHJlc3VsdENvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRUZXh0KHJlc3VsdENvZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgc2NyaXB0V2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2NyaXB0V2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgaWYgKGRhdGFUYWcuaGF2ZSgnc3JjJykpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzY3JpcHQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke0JldHdlZW5UYWdEYXRhfTwvc2NyaXB0PmBcbiAgICAgICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnJlbW92ZSgnbGFuZycpIHx8ICdqcyc7XG5cbiAgICBpZiAoZGF0YVRhZy5oYXZlKCdzZXJ2ZXInKSkge1xuICAgICAgICBkYXRhVGFnLnJlbW92ZSgnc2VydmVyJyk7XG4gICAgICAgIHJldHVybiBzY3JpcHRXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjcmlwdFdpdGhDbGllbnQobGFuZ3VhZ2UsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyk7XG59IiwgImltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwIH0gZnJvbSBcInNvdXJjZS1tYXAtanNcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnRcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1wb3J0ZXIob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kRmlsZVVybCh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKHVybFswXSA9PSAnLycgfHwgdXJsWzBdID09ICd+Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKFxuICAgICAgICAgICAgICAgICAgICB1cmwuc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgICAgICBwYXRoVG9GaWxlVVJMKHVybFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZywgU29tZVBsdWdpbnM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nLCBTb21lUGx1Z2luczogYW55KSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIFNvbWVQbHVnaW5zKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiBgJHtlcnIubWVzc2FnZX0sXFxub24gZmlsZSAtPiAke2ZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKX06JHtsaW5lID8/IDB9OiR7Y29sdW1uID8/IDB9YCxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyOiBhbnksIHRyYWNrOiBTdHJpbmdUcmFja2VyKXtcbiAgICBpZihlcnIuc3Bhbi51cmwpIHJldHVybiBQcmludFNhc3NFcnJvcihlcnIpO1xuXG4gICAgZXJyLmxvY2F0aW9uID0gZ2V0U2Fzc0Vycm9yTGluZShlcnIpO1xuXG4gICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICB0ZXh0OiB0cmFjay5kZWJ1Z0xpbmUoZXJyKSxcbiAgICAgICAgZXJyb3JOYW1lOiBlcnI/LnN0YXR1cyA9PSA1ID8gJ3Nhc3Mtd2FybmluZycgOiAnc2Fzcy1lcnJvcicsXG4gICAgICAgIHR5cGU6IGVycj8uc3RhdHVzID09IDUgPyAnd2FybicgOiAnZXJyb3InXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlU2FzcyhsYW5ndWFnZTogc3RyaW5nLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIG91dFN0eWxlID0gQmV0d2VlblRhZ0RhdGEuZXEpIHtcbiAgICBjb25zdCB0aGlzUGFnZSA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSxcbiAgICAgICAgdGhpc1BhZ2VVUkwgPSBwYXRoVG9GaWxlVVJMKHRoaXNQYWdlKSxcbiAgICAgICAgY29tcHJlc3NlZCA9IG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIEluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyk7XG5cbiAgICBsZXQgcmVzdWx0OiBzYXNzLkNvbXBpbGVSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMob3V0U3R5bGUsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgoPGFueT5sYW5ndWFnZSksXG4gICAgICAgICAgICBzdHlsZTogY29tcHJlc3NlZCA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCcsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIodGhpc1BhZ2UpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnRcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFN0eWxlID0gcmVzdWx0Py5jc3MgPz8gb3V0U3R5bGU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmKGVyci5zcGFuLnVybCl7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoZXJyLnNwYW4udXJsKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgcmV0dXJuIHtvdXRTdHlsZTogJ1Nhc3MgRXJyb3IgKHNlZSBjb25zb2xlKSd9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQ/LnNvdXJjZU1hcCAmJiBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHRoaXNQYWdlVVJMLmhyZWYpO1xuICAgIHJldHVybiB7IHJlc3VsdCwgb3V0U3R5bGUsIGNvbXByZXNzZWQgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IHsgY29tcGlsZVNhc3MgfSBmcm9tICcuL3Nhc3MnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKCk7XG4gICAgYXdhaXQgU2F2ZVNlcnZlckNvZGUubG9hZChCZXR3ZWVuVGFnRGF0YS50cmltU3RhcnQoKSwgcGF0aE5hbWUpO1xuXG4gICAgLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgXG4gICAgbGV0IHsgb3V0U3R5bGUsIGNvbXByZXNzZWQgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbywgYXdhaXQgU2F2ZVNlcnZlckNvZGUuU3RhcnRCdWlsZCgpKTtcblxuICAgIGlmICghY29tcHJlc3NlZClcbiAgICAgICAgb3V0U3R5bGUgPSBgXFxuJHtvdXRTdHlsZX1cXG5gO1xuXG4gICAgY29uc3QgcmVTdG9yZURhdGEgPSBTYXZlU2VydmVyQ29kZS5SZXN0b3JlQ29kZShuZXcgU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YS5TdGFydEluZm8sIG91dFN0eWxlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxzdHlsZSR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVTdG9yZURhdGF9PC9zdHlsZT5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgTWluQ3NzIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplcic7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4uL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ3N0eWxlJywgZGF0YVRhZywgIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHQ/LnNvdXJjZU1hcClcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKFNvdXJjZU1hcFN0b3JlLmZpeFVSTFNvdXJjZU1hcCg8YW55PnJlc3VsdC5zb3VyY2VNYXApLCBCZXR3ZWVuVGFnRGF0YSwgb3V0U3R5bGUpO1xuICAgIGVsc2VcbiAgICAgICAgcHVzaFN0eWxlLmFkZFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIHsgdGV4dDogb3V0U3R5bGUgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHN0eWxlV2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc3R5bGVXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucmVtb3ZlKCdsYW5nJykgfHwgJ2Nzcyc7XG5cbiAgICBpZihkYXRhVGFnLmhhdmUoJ3NlcnZlcicpKXtcbiAgICAgICAgZGF0YVRhZy5yZW1vdmUoJ3NlcnZlcicpO1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZVdpdGhDbGllbnQobGFuZ3VhZ2UsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcblxuZnVuY3Rpb24gSW5Gb2xkZXJQYWdlUGF0aChpbnB1dFBhdGg6IHN0cmluZywgc21hbGxQYXRoOnN0cmluZyl7XG4gICAgaWYgKGlucHV0UGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGlucHV0UGF0aFsxXSA9PSAnLycpIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb2xkZXIgPSBwYXRoX25vZGUuZGlybmFtZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIGlmKGZvbGRlcil7XG4gICAgICAgICAgICBmb2xkZXIgKz0gJy8nO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0UGF0aCA9IGZvbGRlciArIGlucHV0UGF0aDtcbiAgICB9IGVsc2UgaWYgKGlucHV0UGF0aFswXSA9PSAnLycpIHtcbiAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWdlVHlwZSA9ICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG4gICAgaWYoIWlucHV0UGF0aC5lbmRzV2l0aChwYWdlVHlwZSkpe1xuICAgICAgICBpbnB1dFBhdGggKz0gcGFnZVR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0UGF0aDtcbn1cblxuY29uc3QgY2FjaGVNYXA6IHsgW2tleTogc3RyaW5nXToge0NvbXBpbGVkRGF0YTogU3RyaW5nVHJhY2tlciwgbmV3U2Vzc2lvbjogU2Vzc2lvbkJ1aWxkfX0gPSB7fTtcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZGF0YVRhZy5nZXRWYWx1ZShcImZyb21cIik7XG5cbiAgICBjb25zdCBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyID0gSW5Gb2xkZXJQYWdlUGF0aChmaWxlcGF0aCwgdHlwZS5leHRyYWN0SW5mbygpKTtcblxuICAgIGNvbnN0IEZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgU21hbGxQYXRoV2l0aG91dEZvbGRlciwgU21hbGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgU21hbGxQYXRoV2l0aG91dEZvbGRlcjtcblxuICAgIGlmICghKGF3YWl0IEVhc3lGcy5zdGF0KEZ1bGxQYXRoLCBudWxsLCB0cnVlKSkuaXNGaWxlPy4oKSkge1xuICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICB0ZXh0OiBgXFxuUGFnZSBub3QgZm91bmQ6ICR7dHlwZS5hdCgwKS5saW5lSW5mb30gLT4gJHtGdWxsUGF0aH1gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAncGFnZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQsIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+UGFnZSBub3QgZm91bmQ6ICR7dHlwZS5saW5lSW5mb30gLT4gJHtTbWFsbFBhdGh9PC9wPmApXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtTbWFsbFBhdGhXaXRob3V0Rm9sZGVyXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb259ID0gYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUoU21hbGxQYXRoV2l0aG91dEZvbGRlciwgZ2V0VHlwZXMuU3RhdGljLCBudWxsLCBwYXRoTmFtZSwgZGF0YVRhZy5yZW1vdmUoJ29iamVjdCcpKTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdID0ge0NvbXBpbGVkRGF0YTo8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb259O1xuICAgICAgICBSZXR1cm5EYXRhID08U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdO1xuICAgXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgdGhpcy5zYXZlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5zYXZlUGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gSlNPTi5wYXJzZShhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCkgfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBrZXkgaXMgaW4gdGhlIHN0b3JlLCByZXR1cm4gdGhlIHZhbHVlLiBJZiBub3QsIGNyZWF0ZSBhIG5ldyB2YWx1ZSwgc3RvcmUgaXQsIGFuZCByZXR1cm4gaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBsb29rIHVwIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0gW2NyZWF0ZV0gLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIGtleSBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgaGF2ZShrZXk6IHN0cmluZywgY3JlYXRlPzogKCkgPT4gc3RyaW5nKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5zdG9yZVtrZXldO1xuICAgICAgICBpZiAoaXRlbSB8fCAhY3JlYXRlKSByZXR1cm4gaXRlbTtcblxuICAgICAgICBpdGVtID0gY3JlYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlKGtleSwgaXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlKCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5zdG9yZSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuL1N0b3JlSlNPTlwiO1xuXG5leHBvcnQgY29uc3QgcGFnZURlcHMgPSBuZXcgU3RvcmVKU09OKCdQYWdlc0luZm8nKVxuXG4vKipcbiAqIENoZWNrIGlmIGFueSBvZiB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZSBwYWdlIGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7U3RyaW5nTnVtYmVyTWFwfSBkZXBlbmRlbmNpZXMgLSBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuIFRoZSBrZXkgaXMgdGhlIHBhdGggdG8gdGhlIGZpbGUsIGFuZFxuICogdGhlIHZhbHVlIGlzIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDpzdHJpbmcsIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0gcGFnZURlcHMuc3RvcmVbcGF0aF0pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGxldCBwID0gaTtcblxuICAgICAgICBpZiAoaSA9PSAndGhpc1BhZ2UnKSB7XG4gICAgICAgICAgICBwID0gcGF0aCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IGRlcGVuZGVuY2llc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICFkZXBlbmRlbmNpZXM7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGlzb2xhdGUoQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbyk7XG5cbiAgICBjb21waWxlZFN0cmluZy5QbHVzJCBgPCV7JT4ke0JldHdlZW5UYWdEYXRhfTwlfSU+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWdpc3RlckV4dGVuc2lvbiBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3Nzcic7XG5pbXBvcnQgeyByZWJ1aWxkRmlsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUsIHsgcmVzb2x2ZSwgY2xlYXJNb2R1bGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9wcmVwcm9jZXNzJztcblxuYXN5bmMgZnVuY3Rpb24gc3NySFRNTChkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBnZXRWID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBndiA9IChuYW1lOiBzdHJpbmcpID0+IGRhdGFUYWcuZ2V0VmFsdWUobmFtZSkudHJpbSgpLFxuICAgICAgICAgICAgdmFsdWUgPSBndignc3NyJyArIENhcGl0YWxpemUobmFtZSkpIHx8IGd2KG5hbWUpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZSA/IGV2YWwoYCgke3ZhbHVlLmNoYXJBdCgwKSA9PSAneycgPyB2YWx1ZSA6IGB7JHt2YWx1ZX19YH0pYCkgOiB7fTtcbiAgICB9O1xuICAgIGNvbnN0IGJ1aWxkUGF0aCA9IGF3YWl0IHJlZ2lzdGVyRXh0ZW5zaW9uKEZ1bGxQYXRoLCBzbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBtb2RlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGJ1aWxkUGF0aCk7XG5cbiAgICBjb25zdCB7IGh0bWwsIGhlYWQgfSA9IG1vZGUuZGVmYXVsdC5yZW5kZXIoZ2V0VigncHJvcHMnKSwgZ2V0Vignb3B0aW9ucycpKTtcbiAgICBzZXNzaW9uSW5mby5oZWFkSFRNTCArPSBoZWFkO1xuICAgIHJldHVybiBodG1sO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucmVtb3ZlKCdmcm9tJyksIGdldFR5cGVzLlN0YXRpY1syXSwgJ3N2ZWx0ZScpO1xuICAgIGNvbnN0IGluV2ViUGF0aCA9IHJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgU21hbGxQYXRoKS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpO1xuXG4gICAgc2Vzc2lvbkluZm8uc3R5bGUoJy8nICsgaW5XZWJQYXRoICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IGlkID0gZGF0YVRhZy5yZW1vdmUoJ2lkJykgfHwgQmFzZTY0SWQoaW5XZWJQYXRoKSxcbiAgICAgICAgaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVRhZy5nZXRWYWx1ZShuYW1lKS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPyBgLCR7bmFtZX06JHt2YWx1ZS5jaGFyQXQoMCkgPT0gJ3snID8gdmFsdWUgOiBgeyR7dmFsdWV9fWB9YCA6ICcnO1xuICAgICAgICB9LCBzZWxlY3RvciA9IGRhdGFUYWcucmVtb3ZlKCdzZWxlY3RvcicpO1xuXG4gICAgY29uc3Qgc3NyID0gIXNlbGVjdG9yICYmIGRhdGFUYWcuaGF2ZSgnc3NyJykgPyBhd2FpdCBzc3JIVE1MKGRhdGFUYWcsIEZ1bGxQYXRoLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKSA6ICcnO1xuXG5cbiAgICBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZSgnbW9kdWxlJywgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAncGFnZScpID8gTGFzdFNtYWxsUGF0aCA6IHR5cGUuZXh0cmFjdEluZm8oKSkuYWRkVGV4dChcbmBpbXBvcnQgQXBwJHtpZH0gZnJvbSAnLyR7aW5XZWJQYXRofSc7XG5jb25zdCB0YXJnZXQke2lkfSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIke3NlbGVjdG9yID8gc2VsZWN0b3IgOiAnIycgKyBpZH1cIik7XG50YXJnZXQke2lkfSAmJiBuZXcgQXBwJHtpZH0oe1xuICAgIHRhcmdldDogdGFyZ2V0JHtpZH1cbiAgICAke2hhdmUoJ3Byb3BzJykgKyBoYXZlKCdvcHRpb25zJyl9JHtzc3IgPyAnLCBoeWRyYXRlOiB0cnVlJyA6ICcnfVxufSk7YCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgc2VsZWN0b3IgPyAnJyA6IGA8ZGl2IGlkPVwiJHtpZH1cIj4ke3Nzcn08L2Rpdj5gKSxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSWQodGV4dDogc3RyaW5nLCBtYXggPSAxMCl7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRleHQpLnRvU3RyaW5nKCdiYXNlNjQnKS5zdWJzdHJpbmcoMCwgbWF4KS5yZXBsYWNlKC9cXCsvLCAnXycpLnJlcGxhY2UoL1xcLy8sICdfJyk7XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0ICB7IENhcGl0YWxpemUsIHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IENvbXBpbGVPcHRpb25zIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgY2xlYXJNb2R1bGUsIHJlc29sdmUgfSBmcm9tIFwiLi4vLi4vcmVkaXJlY3RDSlNcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCB9IGZyb20gXCIuLi8uLi8uLi9FYXN5RGVidWcvU291cmNlTWFwXCI7XG5pbXBvcnQgeyBQcmludFN2ZWx0ZVdhcm4gfSBmcm9tIFwiLi9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWdpc3RlckV4dGVuc2lvbihmaWxlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IG5hbWUgPSBwYXRoLnBhcnNlKGZpbGVQYXRoKS5uYW1lLnJlcGxhY2UoL15cXGQvLCAnXyQmJykucmVwbGFjZSgvW15hLXpBLVowLTlfJF0vZywgJycpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogQ29tcGlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgbmFtZTogQ2FwaXRhbGl6ZShuYW1lKSxcbiAgICAgICAgZ2VuZXJhdGU6ICdzc3InLFxuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBkZXY6IHNlc3Npb25JbmZvLmRlYnVnLFxuICAgICAgICBlcnJvck1vZGU6ICd3YXJuJ1xuICAgIH07XG5cbiAgICBjb25zdCBpblN0YXRpY0ZpbGUgPSBwYXRoLnJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgc21hbGxQYXRoKTtcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpblN0YXRpY0ZpbGU7XG5cbiAgICBjb25zdCBmdWxsSW1wb3J0UGF0aCA9IGZ1bGxDb21waWxlUGF0aCArICcuc3NyLmNqcyc7XG4gICAgY29uc3Qge3N2ZWx0ZUZpbGVzLCBjb2RlLCBtYXAsIGRlcGVuZGVuY2llc30gPSBhd2FpdCBwcmVwcm9jZXNzKGZpbGVQYXRoLCBzbWFsbFBhdGgsZnVsbEltcG9ydFBhdGgsZmFsc2UsJy5zc3IuY2pzJyk7XG4gICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsZGVwZW5kZW5jaWVzKTtcbiAgICBvcHRpb25zLnNvdXJjZW1hcCA9IG1hcDtcblxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgZm9yKGNvbnN0IGZpbGUgb2Ygc3ZlbHRlRmlsZXMpe1xuICAgICAgICBjbGVhck1vZHVsZShyZXNvbHZlKGZpbGUpKTsgLy8gZGVsZXRlIG9sZCBpbXBvcnRzXG4gICAgICAgIHByb21pc2VzLnB1c2gocmVnaXN0ZXJFeHRlbnNpb24oZmlsZSwgQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlKSwgc2Vzc2lvbkluZm8pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBjb25zdCB7IGpzLCBjc3MsIHdhcm5pbmdzIH0gPSBzdmVsdGUuY29tcGlsZShjb2RlLCA8YW55Pm9wdGlvbnMpO1xuICAgIFByaW50U3ZlbHRlV2Fybih3YXJuaW5ncywgZmlsZVBhdGgsIG1hcCk7XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxJbXBvcnRQYXRoLCBqcy5jb2RlKTtcblxuICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSAnLycgKyBpblN0YXRpY0ZpbGUuc3BsaXQoL1xcL3xcXC8vKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICBjc3MuY29kZSArPSB0b1VSTENvbW1lbnQoY3NzLm1hcCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiBmdWxsSW1wb3J0UGF0aDtcbn1cbiIsICJpbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBjcmVhdGVJbXBvcnRlciwgZ2V0U2Fzc0Vycm9yTGluZSwgUHJpbnRTYXNzRXJyb3IsIFByaW50U2Fzc0Vycm9yVHJhY2tlciwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRXh0ZW5zaW9uLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwsIGJhY2tUb09yaWdpbmFsU3NzIH0gZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuXG5hc3luYyBmdW5jdGlvbiBTQVNTU3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChsYW5nID09ICdjc3MnKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcsIFNvbWVQbHVnaW5zKSxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIHNvdXJjZU1hcDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogYXdhaXQgYmFja1RvT3JpZ2luYWxTc3MoY29udGVudCwgY3NzLDxhbnk+IHNvdXJjZU1hcCwgc291cmNlTWFwLnNvdXJjZXMuZmluZCh4ID0+IHguc3RhcnRzV2l0aCgnZGF0YTonKSkpLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBsb2FkZWRVcmxzLm1hcCh4ID0+IGZpbGVVUkxUb1BhdGgoPGFueT54KSlcbiAgICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3JUcmFja2VyKGVyciwgY29udGVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU2NyaXB0U3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10sIHN2ZWx0ZUV4dCA9ICcnKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgY29uc3QgbWFwVG9rZW4gPSB7fTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlcigvKChpbXBvcnQoe3xbIF0qXFwoPyl8KChpbXBvcnRbIF0qdHlwZXxpbXBvcnR8ZXhwb3J0KSh7fFsgXSspW1xcV1xcd10rPyh9fFsgXSspZnJvbSkpKH18WyBdKikpKFtcInwnfGBdKShbXFxXXFx3XSs/KVxcOShbIF0qXFwpKT8vbSwgYXJncyA9PiB7XG4gICAgICAgIGlmKGxhbmcgPT0gJ3RzJyAmJiBhcmdzWzVdLmVuZHNXaXRoKCcgdHlwZScpKVxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCBleHQgPSBleHRuYW1lKGFyZ3NbMTBdLmVxKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcnKVxuICAgICAgICAgICAgaWYgKGxhbmcgPT0gJ3RzJylcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcudHMnKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcuanMnKTtcblxuXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBhcmdzWzFdLlBsdXMoYXJnc1s5XSwgYXJnc1sxMF0sIChleHQgPT0gJy5zdmVsdGUnID8gc3ZlbHRlRXh0IDogJycpLCBhcmdzWzldLCAoYXJnc1sxMV0gPz8gJycpKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcuc3ZlbHRlJykge1xuICAgICAgICAgICAgY29ubmVjdFN2ZWx0ZS5wdXNoKGFyZ3NbMTBdLmVxKTtcbiAgICAgICAgfSBlbHNlIGlmIChsYW5nICE9PSAndHMnIHx8ICFhcmdzWzRdKVxuICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG5cbiAgICAgICAgY29uc3QgaWQgPSB1dWlkKCk7XG4gICAgICAgIG1hcFRva2VuW2lkXSA9IG5ld0RhdGE7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBfX190b0tlblxcYCR7aWR9XFxgYCk7XG4gICAgfSk7XG5cbiAgICBpZiAobGFuZyAhPT0gJ3RzJylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gKGF3YWl0IHRyYW5zZm9ybShjb250ZW50LmVxLCB7IC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIGxvYWRlcjogJ3RzJywgc291cmNlbWFwOiB0cnVlIH0pKTtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IGJhY2tUb09yaWdpbmFsKGNvbnRlbnQsIGNvZGUsIG1hcCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihjb250ZW50LCBlcnIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgIH1cblxuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC9fX190b0tlbmAoW1xcd1xcV10rPylgL21pLCBhcmdzID0+IHtcbiAgICAgICAgcmV0dXJuIG1hcFRva2VuW2FyZ3NbMV0uZXFdID8/IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250ZW50O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcHJvY2VzcyhmdWxsUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2F2ZVBhdGggPSBzbWFsbFBhdGgsIGh0dHBTb3VyY2UgPSB0cnVlLCBzdmVsdGVFeHQgPSAnJykgeyAgICBcbiAgICBsZXQgdGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKHNtYWxsUGF0aCwgYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSk7XG5cbiAgICBsZXQgc2NyaXB0TGFuZyA9ICdqcycsIHN0eWxlTGFuZyA9ICdjc3MnO1xuXG4gICAgY29uc3QgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10gPSBbXSwgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c2NyaXB0KVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+XFxuPykoLio/KShcXG4/PFxcL3NjcmlwdD4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzY3JpcHRMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2pzJztcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBhd2FpdCBTY3JpcHRTdmVsdGUoYXJnc1s3XSwgc2NyaXB0TGFuZywgY29ubmVjdFN2ZWx0ZSwgc3ZlbHRlRXh0KSwgYXJnc1s4XSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHlsZUNvZGUgPSBjb25uZWN0U3ZlbHRlLm1hcCh4ID0+IGBAaW1wb3J0IFwiJHt4fS5jc3NcIjtgKS5qb2luKCcnKTtcbiAgICBsZXQgaGFkU3R5bGUgPSBmYWxzZTtcbiAgICB0ZXh0ID0gYXdhaXQgdGV4dC5yZXBsYWNlckFzeW5jKC8oPHN0eWxlKVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+KSguKj8pKDxcXC9zdHlsZT4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzdHlsZUxhbmcgPSBhcmdzWzRdPy5lcSA/PyAnY3NzJztcbiAgICAgICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXM6IGRlcHMgfSA9IGF3YWl0IFNBU1NTdmVsdGUoYXJnc1s3XSwgc3R5bGVMYW5nLCBmdWxsUGF0aCk7XG4gICAgICAgIGRlcHMgJiYgZGVwZW5kZW5jaWVzLnB1c2goLi4uZGVwcyk7XG4gICAgICAgIGhhZFN0eWxlID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVDb2RlICYmIGNvZGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soc3R5bGVDb2RlKTtcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBjb2RlLCBhcmdzWzhdKTs7XG4gICAgfSk7XG5cbiAgICBpZiAoIWhhZFN0eWxlICYmIHN0eWxlQ29kZSkge1xuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYDxzdHlsZT4ke3N0eWxlQ29kZX08L3N0eWxlPmApO1xuICAgIH1cblxuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBuZXcgU2Vzc2lvbkJ1aWxkKHNtYWxsUGF0aCwgZnVsbFBhdGgpLCBwcm9taXNlcyA9IFtzZXNzaW9uSW5mby5kZXBlbmRlbmNlKHNtYWxsUGF0aCwgZnVsbFBhdGgpXTtcblxuICAgIGZvciAoY29uc3QgZnVsbCBvZiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZnVsbCksIGZ1bGwpKTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7IHNjcmlwdExhbmcsIHN0eWxlTGFuZywgY29kZTogdGV4dC5lcSwgbWFwOiB0ZXh0LlN0cmluZ1RhY2soc2F2ZVBhdGgsIGh0dHBTb3VyY2UpLCBkZXBlbmRlbmNpZXM6IHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgc3ZlbHRlRmlsZXM6IGNvbm5lY3RTdmVsdGUubWFwKHggPT4geFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gKyB4IDogcGF0aC5ub3JtYWxpemUoZnVsbFBhdGggKyAnLy4uLycgKyB4KSkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcGl0YWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVbMF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59XG5cbiIsICJpbXBvcnQgdHlwZSB7IHRhZ0RhdGFPYmplY3RBcnJheX0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuXG5cbmNvbnN0IG51bWJlcnMgPSBbJ251bWJlcicsICdudW0nLCAnaW50ZWdlcicsICdpbnQnXSwgYm9vbGVhbnMgPSBbJ2Jvb2xlYW4nLCAnYm9vbCddO1xuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb24gPSBbJ2VtYWlsJywgJ3N0cmluZycsICd0ZXh0JywgLi4ubnVtYmVycywgLi4uYm9vbGVhbnNdO1xuXG5jb25zdCBlbWFpbFZhbGlkYXRvciA9IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC87XG5cblxuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvblJlZ2V4ID0ge1xuICAgIFwic3RyaW5nLWxlbmd0aC1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLVswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLScpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCB0ZXh0OiBzdHJpbmcpID0+IHRleHQubGVuZ3RoID49IG1pbiAmJiB0ZXh0Lmxlbmd0aCA8PSBtYXgsXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibnVtYmVyLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSsuLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heCxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2Utc3RyaW5nXCI6IFtcbiAgICAgICAgL15zdHJpbmd8dGV4dCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gYFwiJHt4LnRyaW0oKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpfVwiYCksXG4gICAgICAgIChvcHRpb25zOiBzdHJpbmdbXSwgdGV4dDogc3RyaW5nKSA9PiBvcHRpb25zLmluY2x1ZGVzKHRleHQpLFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1udW1iZXJcIjogW1xuICAgICAgICAvXm51bWJlcnxudW18aW50ZWdlcnxpbnQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpLFxuICAgICAgICAob3B0aW9uczogbnVtYmVyW10sIG51bTogbnVtYmVyKSA9PiBvcHRpb25zLmluY2x1ZGVzKG51bSksXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdXG59O1xuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMgPSBbLi4ubnVtYmVyc107XG5cbmZvcihjb25zdCBpIGluIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpe1xuICAgIGNvbnN0IHR5cGUgPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2ldWzNdO1xuXG4gICAgaWYoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKHR5cGUpKVxuICAgICAgICBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMucHVzaChpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVZhbHVlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGBbXCIke3ZhbHVlfVwiXWA7XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBbdGVzdCwgZ2V0QXJnc11dIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpKVxuICAgICAgICBpZiAoKDxSZWdFeHA+dGVzdCkudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gYFtcIiR7bmFtZX1cIiwgJHsoPGFueT5nZXRBcmdzKSh2YWx1ZSl9XWA7XG5cbiAgICByZXR1cm4gYFske3ZhbHVlfV1gO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlVmFsaWRhdGlvbkpTT04oYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IFByb21pc2U8Ym9vbGVhbiB8IHN0cmluZ1tdPiB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnQsIC4uLmVsZW1lbnRBcmdzXSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG4gICAgICAgIGxldCByZXR1cm5Ob3cgPSBmYWxzZTtcblxuICAgICAgICBsZXQgaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgY2FzZSAnYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIU51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWVtYWlsVmFsaWRhdG9yLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhdmVSZWdleCA9IHZhbHVlICE9IG51bGwgJiYgYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtlbGVtZW50XTtcblxuICAgICAgICAgICAgICAgIGlmKGhhdmVSZWdleCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFoYXZlUmVnZXhbMl0oZWxlbWVudEFyZ3MsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICBpc0RlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSBlbGVtZW50LnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFhd2FpdCBlbGVtZW50KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYGZhaWxlZCBhdCAke2l9IGZpbGVkIC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBmaW5kOiBzdHJpbmcsIGRlZmF1bHREYXRhOiBhbnkgPSBudWxsKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW57XG4gICAgY29uc3QgaGF2ZSA9IGRhdGEuaGF2ZShmaW5kKSwgdmFsdWUgPSBkYXRhLnJlbW92ZShmaW5kKTtcblxuICAgIGlmKGhhdmUgJiYgdmFsdWUgIT0gJ2ZhbHNlJykgcmV0dXJuIHZhbHVlIHx8IGhhdmUgICAgXG4gICAgaWYodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcblxuICAgIGlmKCFoYXZlKSByZXR1cm4gZGVmYXVsdERhdGE7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59IiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXCI8cCBzdHlsZT1cXFxcXCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1xcXFxcIj5TeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX08L3A+XCJgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1Zyl7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IGVyci5lcnJvcnNbMF07XG4gICAgICAgICAgICBmaXJzdC5sb2NhdGlvbiAmJiAoZmlyc3QubG9jYXRpb24ubGluZVRleHQgPSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgRXJyb3JUZW1wbGF0ZSh0ZXh0LmRlYnVnTGluZShmaXJzdCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tIFwiLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3RcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5cblxuZXhwb3J0IHR5cGUgc2V0RGF0YUhUTUxUYWcgPSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcFxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JBcnJheSA9IHtcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHNlbmRUbzogc3RyaW5nLFxuICAgIHZhbGlkYXRvcjogc3RyaW5nW10sXG4gICAgb3JkZXI/OiBzdHJpbmdbXSxcbiAgICBub3RWYWxpZD86IHN0cmluZyxcbiAgICBtZXNzYWdlPzogc3RyaW5nIHwgYm9vbGVhbixcbiAgICByZXNwb25zZVNhZmU/OiBib29sZWFuXG59W11cblxuZXhwb3J0IHR5cGUgY2FjaGVDb21wb25lbnQgPSB7XG4gICAgW2tleTogc3RyaW5nXTogbnVsbCB8IHtcbiAgICAgICAgbXRpbWVNcz86IG51bWJlcixcbiAgICAgICAgdmFsdWU/OiBzdHJpbmdcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIGluVGFnQ2FjaGUgPSB7XG4gICAgc3R5bGU6IHN0cmluZ1tdXG4gICAgc2NyaXB0OiBzdHJpbmdbXVxuICAgIHNjcmlwdE1vZHVsZTogc3RyaW5nW11cbn1cblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU2hvcnRTY3JpcHROYW1lcycpO1xuXG4vKiBUaGUgU2Vzc2lvbkJ1aWxkIGNsYXNzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGhlYWQgb2YgdGhlIHBhZ2UgKi9cbmV4cG9ydCBjbGFzcyBTZXNzaW9uQnVpbGQge1xuICAgIGNvbm5lY3RvckFycmF5OiBjb25uZWN0b3JBcnJheSA9IFtdXG4gICAgcHJpdmF0ZSBzY3JpcHRVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgc3R5bGVVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgaW5TY3JpcHRTdHlsZTogeyB0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgcGF0aDogc3RyaW5nLCB2YWx1ZTogU291cmNlTWFwU3RvcmUgfVtdID0gW11cbiAgICBoZWFkSFRNTCA9ICcnXG4gICAgY2FjaGU6IGluVGFnQ2FjaGUgPSB7XG4gICAgICAgIHN0eWxlOiBbXSxcbiAgICAgICAgc2NyaXB0OiBbXSxcbiAgICAgICAgc2NyaXB0TW9kdWxlOiBbXVxuICAgIH1cbiAgICBjYWNoZUNvbXBpbGVTY3JpcHQ6IGFueSA9IHt9XG4gICAgY2FjaGVDb21wb25lbnQ6IGNhY2hlQ29tcG9uZW50ID0ge31cbiAgICBjb21waWxlUnVuVGltZVN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fVxuICAgIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0ge31cbiAgICByZWNvcmROYW1lczogc3RyaW5nW10gPSBbXVxuXG4gICAgZ2V0IHNhZmVEZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWcgJiYgdGhpcy5fc2FmZURlYnVnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGZ1bGxQYXRoOiBzdHJpbmcsIHB1YmxpYyB0eXBlTmFtZT86IHN0cmluZywgcHVibGljIGRlYnVnPzogYm9vbGVhbiwgcHJpdmF0ZSBfc2FmZURlYnVnPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zID0gdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHN0eWxlKHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlVVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHNjcmlwdCh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zY3JpcHRVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHJlY29yZChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKG5hbWUpKVxuICAgICAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcGVuZGVuY2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0pIHJldHVybjtcblxuICAgICAgICBjb25zdCBoYXZlRGVwID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdDtcbiAgICAgICAgaWYgKGhhdmVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0gPSBoYXZlRGVwXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBzbWFsbFBhdGggPSB0aGlzLnNtYWxsUGF0aCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuaW5TY3JpcHRTdHlsZS5maW5kKHggPT4geC50eXBlID09IHR5cGUgJiYgeC5wYXRoID09IHNtYWxsUGF0aCk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IHsgdHlwZSwgcGF0aDogc21hbGxQYXRoLCB2YWx1ZTogbmV3IFNvdXJjZU1hcFN0b3JlKHNtYWxsUGF0aCwgdGhpcy5zYWZlRGVidWcsIHR5cGUgPT0gJ3N0eWxlJywgdHJ1ZSkgfVxuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS52YWx1ZVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlUGFnZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3BhZ2UnKSA/IHRoaXMuc21hbGxQYXRoIDogaW5mby5leHRyYWN0SW5mbygpKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZU5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTdGF0aWNGaWxlc0luZm8uc3RvcmUpO1xuICAgICAgICB3aGlsZSAoa2V5ID09IG51bGwgfHwgdmFsdWVzLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIGtleSA9IEJhc2U2NElkKHRleHQsIDUgKyBsZW5ndGgpLnN1YnN0cmluZyhsZW5ndGgpO1xuICAgICAgICAgICAgbGVuZ3RoKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYWRkSGVhZFRhZ3MoKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VMb2cgPSB0aGlzLnR5cGVOYW1lID09IGdldFR5cGVzLkxvZ3NbMl1cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgY29uc3QgaXNMb2cgPSBwYWdlTG9nICYmIGkucGF0aCA9PSB0aGlzLnNtYWxsUGF0aDtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVMb2NhdGlvbiA9IGlzTG9nID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXSwgYWRkUXVlcnkgPSBpc0xvZyA/ICc/dD1sJyA6ICcnO1xuICAgICAgICAgICAgbGV0IHVybCA9IFN0YXRpY0ZpbGVzSW5mby5oYXZlKGkucGF0aCwgKCkgPT4gU2Vzc2lvbkJ1aWxkLmNyZWF0ZU5hbWUoaS5wYXRoKSkgKyAnLnB1Yic7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2NyaXB0JzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyBkZWZlcjogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtb2R1bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5tanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyB0eXBlOiAnbW9kdWxlJyB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmNzcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUoJy8nICsgdXJsICsgYWRkUXVlcnkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHNhdmVMb2NhdGlvbiArIHVybCwgYXdhaXQgaS52YWx1ZS5jcmVhdGVEYXRhV2l0aE1hcCgpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRIZWFkKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZEhlYWRUYWdzKCk7XG5cbiAgICAgICAgY29uc3QgbWFrZUF0dHJpYnV0ZXMgPSAoaTogc2V0RGF0YUhUTUxUYWcpID0+IGkuYXR0cmlidXRlcyA/ICcgJyArIE9iamVjdC5rZXlzKGkuYXR0cmlidXRlcykubWFwKHggPT4gaS5hdHRyaWJ1dGVzW3hdID8geCArIGA9XCIke2kuYXR0cmlidXRlc1t4XX1cImAgOiB4KS5qb2luKCcgJykgOiAnJztcblxuICAgICAgICBsZXQgYnVpbGRCdW5kbGVTdHJpbmcgPSAnJzsgLy8gYWRkIHNjcmlwdHMgYWRkIGNzc1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zdHlsZVVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIiR7aS51cmx9XCIke21ha2VBdHRyaWJ1dGVzKGkpfS8+YDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuc2NyaXB0VVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxzY3JpcHQgc3JjPVwiJHtpLnVybH1cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Pjwvc2NyaXB0PmA7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkQnVuZGxlU3RyaW5nICsgdGhpcy5oZWFkSFRNTDtcbiAgICB9XG5cbiAgICBleHRlbmRzKGZyb206IFNlc3Npb25CdWlsZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3RvckFycmF5LnB1c2goLi4uZnJvbS5jb25uZWN0b3JBcnJheSk7XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goLi4uZnJvbS5zY3JpcHRVUkxTZXQpO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goLi4uZnJvbS5zdHlsZVVSTFNldCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGZyb20uaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goeyAuLi5pLCB2YWx1ZTogaS52YWx1ZS5jbG9uZSgpIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3B5T2JqZWN0cyA9IFsnY2FjaGVDb21waWxlU2NyaXB0JywgJ2NhY2hlQ29tcG9uZW50JywgJ2RlcGVuZGVuY2llcyddO1xuXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb3B5T2JqZWN0cykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzW2NdLCBmcm9tW2NdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVjb3JkTmFtZXMucHVzaCguLi5mcm9tLnJlY29yZE5hbWVzLmZpbHRlcih4ID0+ICF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKHgpKSk7XG5cbiAgICAgICAgdGhpcy5oZWFkSFRNTCArPSBmcm9tLmhlYWRIVE1MO1xuICAgICAgICB0aGlzLmNhY2hlLnN0eWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0LnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHQpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdE1vZHVsZS5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0TW9kdWxlKTtcbiAgICB9XG5cbiAgICAvL2Jhc2ljIG1ldGhvZHNcbiAgICBCdWlsZFNjcmlwdFdpdGhQcmFtcyhjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBCdWlsZFNjcmlwdChjb2RlLCBpc1RzKCksIHRoaXMpO1xuICAgIH1cbn0iLCAiLy8gQHRzLW5vY2hlY2tcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IGNsZWFyTW9kdWxlIGZyb20gJ2NsZWFyLW1vZHVsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKSwgcmVzb2x2ZSA9IChwYXRoOiBzdHJpbmcpID0+IHJlcXVpcmUucmVzb2x2ZShwYXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUoZmlsZVBhdGgpO1xuICAgIGNsZWFyTW9kdWxlKGZpbGVQYXRoKTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59XG5cbmV4cG9ydCB7XG4gICAgY2xlYXJNb2R1bGUsXG4gICAgcmVzb2x2ZVxufSIsICJpbXBvcnQgeyBXYXJuaW5nIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCB7IHByaW50IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0NvbnNvbGVcIjtcblxuY2xhc3MgcmVMb2NhdGlvbiB7XG4gICAgbWFwOiBQcm9taXNlPFNvdXJjZU1hcENvbnN1bWVyPlxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZU1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIH1cblxuICAgIGFzeW5jIGdldExvY2F0aW9uKGxvY2F0aW9uOiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn0pe1xuICAgICAgICBjb25zdCB7bGluZSwgY29sdW1ufSA9IChhd2FpdCB0aGlzLm1hcCkub3JpZ2luYWxQb3NpdGlvbkZvcihsb2NhdGlvbilcbiAgICAgICAgcmV0dXJuIGAke2xpbmV9OiR7Y29sdW1ufWA7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVFcnJvcih7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9OiBXYXJuaW5nLCBmaWxlUGF0aDogc3RyaW5nLCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IGZpbmRMb2NhdGlvbiA9IG5ldyByZUxvY2F0aW9uKHNvdXJjZU1hcClcbiAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfVxcbiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgfSk7XG4gICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQcmludFN2ZWx0ZVdhcm4od2FybmluZ3M6IFdhcm5pbmdbXSwgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCB7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9IG9mIHdhcm5pbmdzKXtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnc3ZlbHRlLScgKyBjb2RlLFxuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfVxcbiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgICAgIH0pO1xuICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgaGxqcyBmcm9tICdoaWdobGlnaHQuanMnO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuXG5mdW5jdGlvbiBjb2RlV2l0aENvcHkobWQ6IGFueSkge1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZShvcmlnUnVsZTogYW55KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdSZW5kZXJlZCA9IG9yaWdSdWxlKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY29kZS1jb3B5XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb3B5LWNsaXBib2FyZFwiIG9uY2xpY2s9XCJuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0aGlzLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVyVGV4dClcIj5jb3B5PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICR7b3JpZ1JlbmRlcmVkfVxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayk7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBtYXJrRG93blBsdWdpbiA9IEluc2VydENvbXBvbmVudC5HZXRQbHVnaW4oJ21hcmtkb3duJyk7XG5cbiAgICBjb25zdCBobGpzQ2xhc3MgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpKSxcbiAgICAgICAgYnJlYWtzOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2JyZWFrcycsIG1hcmtEb3duUGx1Z2luPy5icmVha3MgPz8gdHJ1ZSkpLFxuICAgICAgICB0eXBvZ3JhcGhlcjogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICd0eXBvZ3JhcGhlcicsIG1hcmtEb3duUGx1Z2luPy50eXBvZ3JhcGhlciA/PyB0cnVlKSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2NvcHktY29kZScsIG1hcmtEb3duUGx1Z2luPy5jb3B5Q29kZSA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGNvZGVXaXRoQ29weSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYXR0cnMnLCBtYXJrRG93blBsdWdpbj8uYXR0cnMgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QXR0cnMpO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2FiYnInLCBtYXJrRG93blBsdWdpbj8uYWJiciA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBYmJyKTtcblxuICAgIGxldCBtYXJrZG93bkNvZGUgPSBCZXR3ZWVuVGFnRGF0YT8uZXEgfHwgJyc7XG4gICAgY29uc3QgbG9jYXRpb24gPSBkYXRhVGFnLnJlbW92ZSgnZmlsZScpO1xuXG4gICAgaWYgKCFtYXJrZG93bkNvZGU/LnRyaW0/LigpICYmIGxvY2F0aW9uKSB7XG4gICAgICAgIGxldCBmaWxlUGF0aCA9IGxvY2F0aW9uWzBdID09ICcvJyA/IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGxvY2F0aW9uOiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpKSwgbG9jYXRpb24pO1xuICAgICAgICBpZiAoIXBhdGguZXh0bmFtZShmaWxlUGF0aCkpXG4gICAgICAgICAgICBmaWxlUGF0aCArPSAnLnNlcnYubWQnXG4gICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCBmaWxlUGF0aCk7XG4gICAgICAgIG1hcmtkb3duQ29kZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7IC8vZ2V0IG1hcmtkb3duIGZyb20gZmlsZVxuICAgICAgICBhd2FpdCBzZXNzaW9uLmRlcGVuZGVuY2UoZmlsZVBhdGgsIGZ1bGxQYXRoKVxuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlckhUTUwgPSBtZC5yZW5kZXIobWFya2Rvd25Db2RlKSwgYnVpbGRIVE1MID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgY29uc3QgdGhlbWUgPSBhd2FpdCBjcmVhdGVBdXRvVGhlbWUoZGF0YVRhZy5yZW1vdmUoJ2NvZGUtdGhlbWUnKSB8fCBtYXJrRG93blBsdWdpbj8uY29kZVRoZW1lIHx8ICdhdG9tLW9uZScpO1xuXG4gICAgaWYgKGhhdmVIaWdobGlnaHQpIHtcbiAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKTtcbiAgICB9XG5cbiAgICBkYXRhVGFnLmFkZENsYXNzKCdtYXJrZG93bi1ib2R5Jyk7XG5cbiAgICBjb25zdCBzdHlsZSA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3RoZW1lJywgbWFya0Rvd25QbHVnaW4/LnRoZW1lID8/ICdhdXRvJyk7XG4gICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC90aGVtZS8nICsgc3R5bGUgKyAnLmNzcyc7XG4gICAgc3R5bGUgIT0gJ25vbmUnICYmIHNlc3Npb24uc3R5bGUoY3NzTGluaylcblxuICAgIGlmIChkYXRhVGFnLmxlbmd0aClcbiAgICAgICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke3JlbmRlckhUTUx9PC9kaXY+YDtcbiAgICBlbHNlXG4gICAgICAgIGJ1aWxkSFRNTC5BZGRUZXh0QWZ0ZXIocmVuZGVySFRNTCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogYnVpbGRIVE1MLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5jb25zdCB0aGVtZUFycmF5ID0gWycnLCAnLWRhcmsnLCAnLWxpZ2h0J107XG5jb25zdCB0aGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bic7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5TWFya2Rvd25UaGVtZSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgb2YgdGhlbWVBcnJheSkge1xuICAgICAgICBjb25zdCBtaW5pID0gKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGVtZVBhdGggKyBpICsgJy5jc3MnKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxuXFwubWFya2Rvd24tYm9keSB7KXwoXi5tYXJrZG93bi1ib2R5IHspL2dtLCAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCArICdwYWRkaW5nOjIwcHg7J1xuICAgICAgICAgICAgfSkgKyBgXG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOi0zMHB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDoxMHB4O1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk6aG92ZXI+ZGl2IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiBhOmZvY3VzIHtcbiAgICAgICAgICAgICAgICBjb2xvcjojNmJiODZhXG4gICAgICAgICAgICB9YDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgLCBzZXREYXRhSFRNTFRhZ30gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSggcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8aGVhZCR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKVxuICAgICAgICAgICAgfUBEZWZhdWx0SW5zZXJ0QnVuZGxlPC9oZWFkPmAsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGJ1aWxkQnVuZGxlU3RyaW5nID0gYXdhaXQgc2Vzc2lvbkluZm8uYnVpbGRIZWFkKCk7XG4gICAgXG4gICAgY29uc3QgYnVuZGxlUGxhY2Vob2xkZXIgPSBbL0BJbnNlcnRCdW5kbGUoOz8pLywgL0BEZWZhdWx0SW5zZXJ0QnVuZGxlKDs/KS9dO1xuICAgIGNvbnN0IHJlbW92ZUJ1bmRsZSA9ICgpID0+IHtidW5kbGVQbGFjZWhvbGRlci5mb3JFYWNoKHggPT4gcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKHgsICcnKSk7IHJldHVybiBwYWdlRGF0YX07XG5cblxuICAgIGlmICghYnVpbGRCdW5kbGVTdHJpbmcpICAvLyB0aGVyZSBpc24ndCBhbnl0aGluZyB0byBidW5kbGVcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgY29uc3QgcmVwbGFjZVdpdGggPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBidWlsZEJ1bmRsZVN0cmluZyk7IC8vIGFkZCBidW5kbGUgdG8gcGFnZVxuICAgIGxldCBidW5kbGVTdWNjZWVkID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZVBsYWNlaG9sZGVyLmxlbmd0aCAmJiAhYnVuZGxlU3VjY2VlZDsgaSsrKVxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGJ1bmRsZVBsYWNlaG9sZGVyW2ldLCAoKSA9PiAoYnVuZGxlU3VjY2VlZCA9IHRydWUpICYmIHJlcGxhY2VXaXRoKTtcblxuICAgIGlmKGJ1bmRsZVN1Y2NlZWQpXG4gICAgICAgIHJldHVybiByZW1vdmVCdW5kbGUoKTtcblxuICAgIHJldHVybiBwYWdlRGF0YS5QbHVzJCBgXFxub3V0X3J1bl9zY3JpcHQudGV4dCs9JyR7cmVwbGFjZVdpdGh9JztgO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgdHlwZSB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGNvbXBpbGVWYWx1ZXMsIG1ha2VWYWxpZGF0aW9uSlNPTiwgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuXG5jb25zdCBzZXJ2ZVNjcmlwdCA9ICcvc2Vydi9jb25uZWN0LmpzJztcblxuZnVuY3Rpb24gdGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAke25hbWV9KC4uLmFyZ3Mpe3JldHVybiBjb25uZWN0b3IoXCIke25hbWV9XCIsIGFyZ3MpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCB7IFNvbWVQbHVnaW5zIH0sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5nZXRWYWx1ZSgnbmFtZScpLFxuICAgICAgICBzZW5kVG8gPSBkYXRhVGFnLmdldFZhbHVlKCdzZW5kVG8nKSxcbiAgICAgICAgdmFsaWRhdG9yOiBzdHJpbmcgPSBkYXRhVGFnLmdldFZhbHVlKCd2YWxpZGF0ZScpLFxuICAgICAgICBub3RWYWxpZDogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ25vdFZhbGlkJyk7XG5cbiAgICBsZXQgbWVzc2FnZSA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ21lc3NhZ2UnKTsgLy8gc2hvdyBlcnJvciBtZXNzYWdlXG4gICAgaWYgKG1lc3NhZ2UgPT09IG51bGwpXG4gICAgICAgIG1lc3NhZ2UgPSBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIik7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7IGFzeW5jOiBudWxsIH0pXG5cbiAgICBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ3NjcmlwdCcsIGRhdGFUYWcsIHR5cGUpLmFkZFRleHQodGVtcGxhdGUobmFtZSkpOyAvLyBhZGQgc2NyaXB0XG5cbiAgICBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Nvbm5lY3QnLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvciAmJiB2YWxpZGF0b3Iuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSlcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkubGVuZ3RoKVxuICAgICAgICByZXR1cm4gcGFnZURhdGE7XG5cbiAgICBsZXQgYnVpbGRPYmplY3QgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9ICdjb25uZWN0JylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGJ1aWxkT2JqZWN0ICs9IGAsXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6XCIke2kubmFtZX1cIixcbiAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6JHt0eXBlb2YgaS5tZXNzYWdlID09ICdzdHJpbmcnID8gYFwiJHtpLm1lc3NhZ2V9XCJgIDogaS5tZXNzYWdlfSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjpbJHsoaS52YWxpZGF0b3IgJiYgaS52YWxpZGF0b3IubWFwKGNvbXBpbGVWYWx1ZXMpLmpvaW4oJywnKSkgfHwgJyd9XVxuICAgICAgICB9YDtcbiAgICB9XG5cbiAgICBidWlsZE9iamVjdCA9IGBbJHtidWlsZE9iamVjdC5zdWJzdHJpbmcoMSl9XWA7XG5cbiAgICBjb25zdCBhZGRTY3JpcHQgPSBgXG4gICAgICAgIGlmKFBvc3Q/LmNvbm5lY3RvckNhbGwpe1xuICAgICAgICAgICAgaWYoYXdhaXQgaGFuZGVsQ29ubmVjdG9yKFwiY29ubmVjdFwiLCBwYWdlLCAke2J1aWxkT2JqZWN0fSkpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWA7XG5cbiAgICBpZiAocGFnZURhdGEuaW5jbHVkZXMoXCJAQ29ubmVjdEhlcmVcIikpXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoL0BDb25uZWN0SGVyZSg7PykvLCAoKSA9PiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBhZGRTY3JpcHQpKTtcbiAgICBlbHNlXG4gICAgICAgIHBhZ2VEYXRhLkFkZFRleHRBZnRlck5vVHJhY2soYWRkU2NyaXB0KTtcblxuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3JBcnJheTogYW55W10pIHtcbiAgICBpZiAoIXRoaXNQYWdlLlBvc3Q/LmNvbm5lY3RvckNhbGwpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuXG4gICAgY29uc3QgaGF2ZSA9IGNvbm5lY3RvckFycmF5LmZpbmQoeCA9PiB4Lm5hbWUgPT0gdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JDYWxsLm5hbWUpO1xuXG4gICAgaWYgKCFoYXZlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cblxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC52YWx1ZXM7XG4gICAgY29uc3QgaXNWYWxpZCA9IGhhdmUudmFsaWRhdG9yLmxlbmd0aCAmJiBhd2FpdCBtYWtlVmFsaWRhdGlvbkpTT04odmFsdWVzLCBoYXZlLnZhbGlkYXRvcik7XG5cbiAgICB0aGlzUGFnZS5zZXRSZXNwb25zZSgnJyk7XG5cbiAgICBjb25zdCBiZXR0ZXJKU09OID0gKG9iajogYW55KSA9PiB7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2UuZW5kKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIH1cblxuICAgIGlmICghaGF2ZS52YWxpZGF0b3IubGVuZ3RoIHx8IGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgaGF2ZS5zZW5kVG8oLi4udmFsdWVzKSk7XG5cbiAgICBlbHNlIGlmIChoYXZlLm5vdFZhbGlkKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGhhdmUubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKSk7XG5cbiAgICBlbHNlIGlmIChoYXZlLm1lc3NhZ2UpXG4gICAgICAgIGJldHRlckpTT04oe1xuICAgICAgICAgICAgZXJyb3I6IHR5cGVvZiBoYXZlLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBoYXZlLm1lc3NhZ2UgOiAoPGFueT5pc1ZhbGlkKS5zaGlmdCgpXG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc3RhdHVzKDQwMCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04sIHBhcnNlVmFsdWVzLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IHNlbmRUbyA9IGRhdGFUYWcucmVtb3ZlKCdzZW5kVG8nKS50cmltKCk7XG5cbiAgICBpZiAoIXNlbmRUbykgIC8vIHNwZWNpYWwgYWN0aW9uIG5vdCBmb3VuZFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8Zm9ybSR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsICBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgICAgICB9PC9mb3JtPmAsXG4gICAgICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgICAgIH1cblxuXG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcucmVtb3ZlKCduYW1lJykudHJpbSgpIHx8IHV1aWQoKSwgdmFsaWRhdG9yOiBzdHJpbmcgPSBkYXRhVGFnLnJlbW92ZSgndmFsaWRhdGUnKSwgb3JkZXJEZWZhdWx0OiBzdHJpbmcgPSBkYXRhVGFnLnJlbW92ZSgnb3JkZXInKSwgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdub3RWYWxpZCcpLCByZXNwb25zZVNhZmUgPSBkYXRhVGFnLmhhdmUoJ3NhZmUnKTtcblxuICAgIGxldCBtZXNzYWdlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnbWVzc2FnZScpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBpZiAobWVzc2FnZSA9PT0gbnVsbClcbiAgICAgICAgbWVzc2FnZSA9IHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIik7XG5cbiAgICBsZXQgb3JkZXIgPSBbXTtcblxuICAgIGNvbnN0IHZhbGlkYXRvckFycmF5ID0gdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHsgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYW4gb3JkZXIgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIFwicHJvcDE6IHN0cmluZywgcHJvcDM6IG51bSwgcHJvcDI6IGJvb2xcIlxuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0Rmlyc3QoJzonLCB4LnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBvcmRlci5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuXG4gICAgICAgIHJldHVybiBzcGxpdC5wb3AoKTtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlckRlZmF1bHQpXG4gICAgICAgIG9yZGVyID0gb3JkZXJEZWZhdWx0LnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpO1xuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzZW5kVG8sXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yQXJyYXksXG4gICAgICAgIG9yZGVyOiBvcmRlci5sZW5ndGggJiYgb3JkZXIsXG4gICAgICAgIG5vdFZhbGlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZXNwb25zZVNhZmVcbiAgICB9KTtcblxuICAgIGlmICghZGF0YVRhZy5oYXZlKCdtZXRob2QnKSkge1xuICAgICAgICBkYXRhVGFnLnB1c2goe1xuICAgICAgICAgICAgbjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ21ldGhvZCcpLFxuICAgICAgICAgICAgdjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ3Bvc3QnKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJFxuICAgICAgICBgPCUhXG5AP0Nvbm5lY3RIZXJlRm9ybSgke3NlbmRUb30pO1xuJT48Zm9ybSR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbm5lY3RvckZvcm1DYWxsXCIgdmFsdWU9XCIke25hbWV9XCIvPiR7YXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKX08L2Zvcm0+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGZvciAoY29uc3QgaSBvZiBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheSkge1xuICAgICAgICBpZiAoaS50eXBlICE9ICdmb3JtJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHNlbmRUb1VuaWNvZGUgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBpLnNlbmRUbykudW5pY29kZS5lcVxuICAgICAgICBjb25zdCBjb25uZWN0ID0gbmV3IFJlZ0V4cChgQENvbm5lY3RIZXJlRm9ybVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXCkoOz8pYCksIGNvbm5lY3REZWZhdWx0ID0gbmV3IFJlZ0V4cChgQFxcXFw/Q29ubmVjdEhlcmVGb3JtXFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgICAgY29uc3Qgc2NyaXB0RGF0YSA9IGRhdGEgPT4ge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGFbMF0uU3RhcnRJbmZvKS5QbHVzJFxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JGb3JtQ2FsbCA9PSBcIiR7aS5uYW1lfVwiKXtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgaGFuZGVsQ29ubmVjdG9yKFwiZm9ybVwiLCBwYWdlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcjpbJHtpLnZhbGlkYXRvcj8ubWFwPy4oY29tcGlsZVZhbHVlcyk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBbJHtpLm9yZGVyPy5tYXA/LihpdGVtID0+IGBcIiR7aXRlbX1cImApPy5qb2luKCcsJykgPz8gJyd9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FmZToke2kucmVzcG9uc2VTYWZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgIH07XG5cbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0LCBzY3JpcHREYXRhKTtcblxuICAgICAgICBpZiAoY291bnRlcilcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZShjb25uZWN0RGVmYXVsdCwgJycpOyAvLyBkZWxldGluZyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdERlZmF1bHQsIHNjcmlwdERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckluZm86IGFueSkge1xuXG4gICAgZGVsZXRlIHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yRm9ybUNhbGw7XG5cbiAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby5vcmRlci5sZW5ndGgpIC8vIHB1c2ggdmFsdWVzIGJ5IHNwZWNpZmljIG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjb25uZWN0b3JJbmZvLm9yZGVyKVxuICAgICAgICAgICAgdmFsdWVzLnB1c2godGhpc1BhZ2UuUG9zdFtpXSk7XG4gICAgZWxzZVxuICAgICAgICB2YWx1ZXMucHVzaCguLi5PYmplY3QudmFsdWVzKHRoaXNQYWdlLlBvc3QpKTtcblxuXG4gICAgbGV0IGlzVmFsaWQ6IGJvb2xlYW4gfCBzdHJpbmdbXSA9IHRydWU7XG5cbiAgICBpZiAoY29ubmVjdG9ySW5mby52YWxpZGF0b3IubGVuZ3RoKSB7IC8vIHZhbGlkYXRlIHZhbHVlc1xuICAgICAgICB2YWx1ZXMgPSBwYXJzZVZhbHVlcyh2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICAgICAgaXNWYWxpZCA9IGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGNvbm5lY3RvckluZm8udmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzcG9uc2U6IGFueTtcblxuICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8uc2VuZFRvKC4uLnZhbHVlcyk7XG4gICAgZWxzZSBpZiAoY29ubmVjdG9ySW5mby5ub3RWYWxpZClcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCk7XG5cbiAgICBpZiAoIWlzVmFsaWQgJiYgIXJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5tZXNzYWdlID09PSB0cnVlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKGNvbm5lY3RvckluZm8ubWVzc2FnZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3BvbnNlID0gY29ubmVjdG9ySW5mby5tZXNzYWdlO1xuXG4gICAgaWYgKHJlc3BvbnNlKVxuICAgICAgICBpZiAoY29ubmVjdG9ySW5mby5zYWZlKVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGVTYWZlKHJlc3BvbnNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpc1BhZ2Uud3JpdGUocmVzcG9uc2UpO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcmVjb3JkU3RvcmUgPSBuZXcgU3RvcmVKU09OKCdSZWNvcmRzJyk7XG5cbmZ1bmN0aW9uIHJlY29yZExpbmsoZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgcmV0dXJuIGRhdGFUYWcucmVtb3ZlKCdsaW5rJyl8fCBzbWFsbFBhdGhUb1BhZ2Uoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZWNvcmRQYXRoKGRlZmF1bHROYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCl7XG4gICAgY29uc3QgbGluayA9IHJlY29yZExpbmsoZGF0YVRhZywgc2Vzc2lvbkluZm8pLCBzYXZlTmFtZSA9IGRhdGFUYWcucmVtb3ZlKCduYW1lJykgfHwgZGVmYXVsdE5hbWU7XG5cbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0gPz89IHt9O1xuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSA/Pz0gJyc7XG4gICAgc2Vzc2lvbkluZm8ucmVjb3JkKHNhdmVOYW1lKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0b3JlOiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV0sXG4gICAgICAgIGN1cnJlbnQ6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXVtsaW5rXSxcbiAgICAgICAgbGlua1xuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGh0bWwgPSBodG1sLnRyaW0oKTtcblxuICAgIGNvbnN0IHtzdG9yZSwgbGlua30gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9yZWNvcmQuc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcblxuICAgIGlmKCFzdG9yZVtsaW5rXS5pbmNsdWRlcyhodG1sKSl7XG4gICAgICAgIHN0b3JlW2xpbmtdICs9IGh0bWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQmVmb3JlUmVCdWlsZChzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgY29uc3QgbmFtZSA9IHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGgpO1xuICAgIGZvcihjb25zdCBzYXZlIGluIHJlY29yZFN0b3JlLnN0b3JlKXtcbiAgICAgICAgY29uc3QgaXRlbSA9IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVdO1xuXG4gICAgICAgIGlmKGl0ZW1bbmFtZV0pe1xuICAgICAgICAgICAgaXRlbVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlbGV0ZSBpdGVtW25hbWVdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjb3JkcyhzZXNzaW9uOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb24uZGVidWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2Ygc2Vzc2lvbi5yZWNvcmROYW1lcykge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyQ29tcGlsZSgpe1xuICAgIHJlY29yZFN0b3JlLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpe1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiByZWNvcmRTdG9yZS5zdG9yZSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIG5hbWUgKyAnLmpzb24nO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKG5hbWUsIGdldFR5cGVzLlN0YXRpY1swXSk7XG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKGZpbGVQYXRoLCByZWNvcmRTdG9yZS5zdG9yZVtuYW1lXSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ01hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdub2RlLWh0bWwtcGFyc2VyJztcbmltcG9ydCB7IG1ha2VSZWNvcmRQYXRofSBmcm9tICcuL3JlY29yZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSggcGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7c3RvcmUsIGxpbmssIGN1cnJlbnR9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvc2VhcmNoLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgY29uc3Qgc2VhcmNoT2JqZWN0ID0gYnVpbGRPYmplY3QoaHRtbCwgZGF0YVRhZy5yZW1vdmUoJ21hdGNoJykgfHwgJ2gxW2lkXSwgaDJbaWRdLCBoM1tpZF0sIGg0W2lkXSwgaDVbaWRdLCBoNltpZF0nKTtcblxuICAgIGlmKCFjdXJyZW50KXtcbiAgICAgICAgc3RvcmVbbGlua10gPSBzZWFyY2hPYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihjdXJyZW50LnRpdGxlcyxzZWFyY2hPYmplY3QudGl0bGVzKTtcblxuICAgICAgICBpZighY3VycmVudC50ZXh0LmluY2x1ZGVzKHNlYXJjaE9iamVjdC50ZXh0KSl7XG4gICAgICAgICAgICBjdXJyZW50LnRleHQgKz0gc2VhcmNoT2JqZWN0LnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0KGh0bWw6IHN0cmluZywgbWF0Y2g6IHN0cmluZykge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJzZShodG1sLCB7XG4gICAgICAgIGJsb2NrVGV4dEVsZW1lbnRzOiB7XG4gICAgICAgICAgICBzY3JpcHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3R5bGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9zY3JpcHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRpdGxlczogU3RyaW5nTWFwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKSkge1xuICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQuYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgdGl0bGVzW2lkXSA9IGVsZW1lbnQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZXMsXG4gICAgICAgIHRleHQ6IHJvb3QuaW5uZXJUZXh0LnRyaW0oKS5yZXBsYWNlKC9bIFxcbl17Mix9L2csICcgJykucmVwbGFjZSgvW1xcbl0vZywgJyAnKVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL0NvbXBvbmVudHMvY2xpZW50JztcbmltcG9ydCBzY3JpcHQgZnJvbSAnLi9Db21wb25lbnRzL3NjcmlwdC9pbmRleCc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9Db21wb25lbnRzL3N0eWxlL2luZGV4JztcbmltcG9ydCBwYWdlIGZyb20gJy4vQ29tcG9uZW50cy9wYWdlJztcbmltcG9ydCBpc29sYXRlIGZyb20gJy4vQ29tcG9uZW50cy9pc29sYXRlJztcbmltcG9ydCBzdmVsdGUgZnJvbSAnLi9Db21wb25lbnRzL3N2ZWx0ZSc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnLi9Db21wb25lbnRzL21hcmtkb3duJztcbmltcG9ydCBoZWFkLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEhlYWQgfSBmcm9tICcuL0NvbXBvbmVudHMvaGVhZCc7XG5pbXBvcnQgY29ubmVjdCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRDb25uZWN0LCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yQ29ubmVjdCB9IGZyb20gJy4vQ29tcG9uZW50cy9jb25uZWN0JztcbmltcG9ydCBmb3JtLCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZEZvcm0sIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JGb3JtIH0gZnJvbSAnLi9Db21wb25lbnRzL2Zvcm0nO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgcmVjb3JkLCB7IHVwZGF0ZVJlY29yZHMsIHBlckNvbXBpbGUgYXMgcGVyQ29tcGlsZVJlY29yZCwgcG9zdENvbXBpbGUgYXMgcG9zdENvbXBpbGVSZWNvcmQsIGRlbGV0ZUJlZm9yZVJlQnVpbGQgfSBmcm9tICcuL0NvbXBvbmVudHMvcmVjb3JkJztcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9Db21wb25lbnRzL3NlYXJjaCc7XG5cbmV4cG9ydCBjb25zdCBBbGxCdWlsZEluID0gW1wiY2xpZW50XCIsIFwic2NyaXB0XCIsIFwic3R5bGVcIiwgXCJwYWdlXCIsIFwiY29ubmVjdFwiLCBcImlzb2xhdGVcIiwgXCJmb3JtXCIsIFwiaGVhZFwiLCBcInN2ZWx0ZVwiLCBcIm1hcmtkb3duXCIsIFwicmVjb3JkXCIsIFwic2VhcmNoXCJdO1xuXG5leHBvcnQgZnVuY3Rpb24gU3RhcnRDb21waWxpbmcocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBsZXQgcmVEYXRhOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+O1xuXG4gICAgc3dpdGNoICh0eXBlLmVxLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSBcImNsaWVudFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY2xpZW50KHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJlY29yZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcmVjb3JkKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNlYXJjaCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBzY3JpcHQoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN0eWxlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdHlsZSggcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGFnZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gcGFnZShwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjb25uZWN0KHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZm9ybVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gZm9ybShwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpc29sYXRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBpc29sYXRlKEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaGVhZFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaGVhZChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdmVsdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN2ZWx0ZSh0eXBlLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1hcmtkb3duXCI6XG4gICAgICAgICAgICByZURhdGEgPSBtYXJrZG93bih0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wb25lbnQgaXMgbm90IGJ1aWxkIHlldFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNJbmNsdWRlKHRhZ25hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBBbGxCdWlsZEluLmluY2x1ZGVzKHRhZ25hbWUudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZykge1xuICAgIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbkluZm8pO1xuXG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdChwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZEZvcm0ocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoL0BDb25uZWN0SGVyZSg7PykvZ2ksICcnKS5yZXBsYWNlKC9AQ29ubmVjdEhlcmVGb3JtKDs/KS9naSwgJycpO1xuXG4gICAgcGFnZURhdGEgPSBhd2FpdCBhZGRGaW5hbGl6ZUJ1aWxkSGVhZChwYWdlRGF0YSwgc2Vzc2lvbkluZm8sIGZ1bGxDb21waWxlUGF0aCk7XG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yU2VydmljZSh0eXBlOiBzdHJpbmcsIHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICh0eXBlID09ICdjb25uZWN0JylcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckNvbm5lY3QodGhpc1BhZ2UsIGNvbm5lY3RvckFycmF5KTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JGb3JtKHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlKCkge1xuICAgIHBlckNvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKSB7XG4gICAgcG9zdENvbXBpbGVSZWNvcmQoKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgXG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBQYXJzZURlYnVnSW5mbywgQ3JlYXRlRmlsZVBhdGgsIFBhdGhUeXBlcywgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQWxsQnVpbGRJbiwgSXNJbmNsdWRlLCBTdGFydENvbXBpbGluZyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgQXJyYXlNYXRjaCB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgdGFnRGF0YU9iamVjdEFzVGV4dCwgQ29tcGlsZUluRmlsZUZ1bmMsIFN0cmluZ0FycmF5T3JPYmplY3QsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBJbnNlcnRDb21wb25lbnRCYXNlLCBCYXNlUmVhZGVyIH0gZnJvbSAnLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgcGF0aE5vZGUgZnJvbSAncGF0aCc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnNlcnRDb21wb25lbnQgZXh0ZW5kcyBJbnNlcnRDb21wb25lbnRCYXNlIHtcbiAgICBwdWJsaWMgZGlyRm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIFBsdWdpbkJ1aWxkOiBBZGRQbHVnaW47XG4gICAgcHVibGljIENvbXBpbGVJbkZpbGU6IENvbXBpbGVJbkZpbGVGdW5jO1xuICAgIHB1YmxpYyBNaWNyb1BsdWdpbnM6IFN0cmluZ0FycmF5T3JPYmplY3Q7XG4gICAgcHVibGljIEdldFBsdWdpbjogKG5hbWU6IHN0cmluZykgPT4gYW55O1xuICAgIHB1YmxpYyBTb21lUGx1Z2luczogKC4uLm5hbWVzOiBzdHJpbmdbXSkgPT4gYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNUczogKCkgPT4gYm9vbGVhbjtcblxuICAgIHByaXZhdGUgcmVnZXhTZWFyY2g6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKFBsdWdpbkJ1aWxkOiBBZGRQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kaXJGb2xkZXIgPSAnQ29tcG9uZW50cyc7XG4gICAgICAgIHRoaXMuUGx1Z2luQnVpbGQgPSBQbHVnaW5CdWlsZDtcbiAgICAgICAgdGhpcy5yZWdleFNlYXJjaCA9IG5ldyBSZWdFeHAoYDwoW1xcXFxwe0x1fV9cXFxcLTowLTldfCR7QWxsQnVpbGRJbi5qb2luKCd8Jyl9KWAsICd1JylcbiAgICB9XG5cbiAgICBGaW5kU3BlY2lhbFRhZ0J5U3RhcnQoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuU2tpcFNwZWNpYWxUYWcpIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcuc3Vic3RyaW5nKDAsIGlbMF0ubGVuZ3RoKSA9PSBpWzBdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdCB0YWtlcyBhIHN0cmluZyBvZiBIVE1MIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUsXG4gICAgICogdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUsIGFuZCB0aGUgY2hhcmFjdGVyIHRoYXQgY29tZXMgYWZ0ZXIgdGhlIGF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSB0ZXh0IHRvIHBhcnNlLlxuICAgICAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6XG4gICAgICovXG4gICAgdGFnRGF0YSh0ZXh0OiBTdHJpbmdUcmFja2VyKTogeyBkYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIG1hcEF0dHJpYnV0ZXM6IFN0cmluZ0FueU1hcCB9IHtcbiAgICAgICAgY29uc3QgdG9rZW5BcnJheSA9IFtdLCBhOiB0YWdEYXRhT2JqZWN0QXJyYXkgPSBbXSwgbWFwQXR0cmlidXRlczogU3RyaW5nQW55TWFwID0ge307XG5cbiAgICAgICAgdGV4dCA9IHRleHQudHJpbSgpLnJlcGxhY2VyKC8oPCUpKFtcXHdcXFddKz8pKCU+KS8sIGRhdGEgPT4ge1xuICAgICAgICAgICAgdG9rZW5BcnJheS5wdXNoKGRhdGFbMl0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFbMV0uUGx1cyhkYXRhWzNdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgdW5Ub2tlbiA9ICh0ZXh0OiBTdHJpbmdUcmFja2VyKSA9PiB0ZXh0LnJlcGxhY2VyKC8oPCUpKCU+KS8sIChkYXRhKSA9PiBkYXRhWzFdLlBsdXModG9rZW5BcnJheS5zaGlmdCgpKS5QbHVzKGRhdGFbMl0pKVxuXG4gICAgICAgIGxldCBmYXN0VGV4dCA9IHRleHQuZXE7XG4gICAgICAgIGNvbnN0IFNraXBUeXBlcyA9IFsnXCInLCBcIidcIiwgJ2AnXSwgQmxvY2tUeXBlcyA9IFtcbiAgICAgICAgICAgIFsneycsICd9J10sXG4gICAgICAgICAgICBbJygnLCAnKSddXG4gICAgICAgIF07XG5cbiAgICAgICAgd2hpbGUgKGZhc3RUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBmYXN0VGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoYXIgPSBmYXN0VGV4dC5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXIgPT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0Q2hhciA9IHRleHQuYXQoaSArIDEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0Q2hhckVxID0gbmV4dENoYXIuZXEsIGF0dHJOYW1lID0gdGV4dC5zdWJzdHJpbmcoMCwgaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlOiBTdHJpbmdUcmFja2VyLCBlbmRJbmRleDogbnVtYmVyLCBibG9ja0VuZDogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU2tpcFR5cGVzLmluY2x1ZGVzKG5leHRDaGFyRXEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVudE9mUShmYXN0VGV4dC5zdWJzdHJpbmcoaSArIDIpLCBuZXh0Q2hhckVxKSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRleHQuc3Vic3RyKGkgKyAyLCBlbmRJbmRleCAtIDIpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGJsb2NrRW5kID0gQmxvY2tUeXBlcy5maW5kKHggPT4geFswXSA9PSBuZXh0Q2hhckVxKT8uWzFdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVuZE9mRGVmKGZhc3RUZXh0LnN1YnN0cmluZyhpICsgMiksIFtuZXh0Q2hhckVxLCBibG9ja0VuZF0pICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGV4dC5zdWJzdHIoaSArIDEsIGVuZEluZGV4ICsgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gZmFzdFRleHQuc3Vic3RyaW5nKGkgKyAxKS5zZWFyY2goLyB8XFxuLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kSW5kZXggPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBmYXN0VGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRleHQuc3Vic3RyKGkgKyAxLCBlbmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Q2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gdW5Ub2tlbihhdHRyTmFtZSksIHYgPSB1blRva2VuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbWFwQXR0cmlidXRlc1tuLmVxXSA9IHYuZXE7XG4gICAgICAgICAgICAgICAgICAgIGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLFxuICAgICAgICAgICAgICAgICAgICAgICAgdixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXI6IG5leHRDaGFyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpICs9IDEgKyBlbmRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoYXIgPT0gJyAnIHx8IGkgPT0gZmFzdFRleHQubGVuZ3RoIC0gMSAmJiArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHVuVG9rZW4odGV4dC5zdWJzdHJpbmcoMCwgaSkpO1xuICAgICAgICAgICAgICAgICAgICBhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbjogblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbWFwQXR0cmlidXRlc1tuLmVxXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmYXN0VGV4dCA9IGZhc3RUZXh0LnN1YnN0cmluZyhpKS50cmltKCk7XG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoaSkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9tZXRob2RzIHRvIHRoZSBhcnJheVxuICAgICAgICBjb25zdCBpbmRleCA9IChuYW1lOiBzdHJpbmcpID0+IGEuZmluZEluZGV4KHggPT4geC5uLmVxID09IG5hbWUpO1xuICAgICAgICBjb25zdCBnZXRWYWx1ZSA9IChuYW1lOiBzdHJpbmcpID0+IGEuZmluZCh0YWcgPT4gdGFnLm4uZXEgPT0gbmFtZSk/LnY/LmVxID8/ICcnO1xuICAgICAgICBjb25zdCByZW1vdmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lSW5kZXggPSBpbmRleChuYW1lKTtcbiAgICAgICAgICAgIGlmIChuYW1lSW5kZXggPT0gLTEpXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgcmV0dXJuIGEuc3BsaWNlKG5hbWVJbmRleCwgMSkucG9wKCkudj8uZXEgPz8gJyc7XG4gICAgICAgIH07XG5cbiAgICAgICAgYS5oYXZlID0gKG5hbWU6IHN0cmluZykgPT4gaW5kZXgobmFtZSkgIT0gLTE7XG4gICAgICAgIGEuZ2V0VmFsdWUgPSBnZXRWYWx1ZTtcbiAgICAgICAgYS5yZW1vdmUgPSByZW1vdmU7XG4gICAgICAgIGEuYWRkQ2xhc3MgPSBjID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBpbmRleCgnY2xhc3MnKTtcbiAgICAgICAgICAgIGlmIChpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKHsgbjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ2NsYXNzJyksIHY6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGMpLCBjaGFyOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnXCInKSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYVtpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLnYubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGMgPSAnICcgKyBjO1xuICAgICAgICAgICAgaXRlbS52LkFkZFRleHRBZnRlcihjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkYXRhOiBhLCBtYXBBdHRyaWJ1dGVzIH07XG4gICAgfVxuXG4gICAgZmluZEluZGV4U2VhcmNoVGFnKHF1ZXJ5OiBzdHJpbmcsIHRhZzogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBhbGwgPSBxdWVyeS5zcGxpdCgnLicpO1xuICAgICAgICBsZXQgY291bnRlciA9IDBcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0YWcuaW5kZXhPZihpKVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgV2FyaW5nLCBjYW4ndCBmaW5kIGFsbCBxdWVyeSBpbiB0YWcgLT4gJHt0YWcuZXF9XFxuJHt0YWcubGluZUluZm99YCxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcInF1ZXJ5LW5vdC1mb3VuZFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHJpbnRbZnVuY05hbWVdKHByaW50VGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIgKz0gaW5kZXggKyBpLmxlbmd0aFxuICAgICAgICAgICAgdGFnID0gdGFnLnN1YnN0cmluZyhpbmRleCArIGkubGVuZ3RoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50ZXIgKyB0YWcuc2VhcmNoKC9cXCB8XFw+LylcbiAgICB9XG5cbiAgICBSZUJ1aWxkVGFnRGF0YShzdHJpbmdJbmZvOiBTdHJpbmdUcmFja2VyRGF0YUluZm8sIGRhdGFUYWdTcGxpdHRlcjogdGFnRGF0YU9iamVjdEFycmF5KSB7XG4gICAgICAgIGxldCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGRhdGFUYWdTcGxpdHRlcikge1xuICAgICAgICAgICAgaWYgKGkudikge1xuICAgICAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMuUGx1cyRgJHtpLm59PSR7aS5jaGFyfSR7aS52fSR7aS5jaGFyfSBgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoaS5uLCAnICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGFUYWdTcGxpdHRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMgPSBuZXcgU3RyaW5nVHJhY2tlcihzdHJpbmdJbmZvLCAnICcpLlBsdXMobmV3QXR0cmlidXRlcy5zdWJzdHJpbmcoMCwgbmV3QXR0cmlidXRlcy5sZW5ndGggLSAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBDaGVja01pbkhUTUwoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBpZiAodGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikpIHtcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgYXN5bmMgUmVCdWlsZFRhZyh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnU3BsaWNlZDogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgU2VuZERhdGFGdW5jOiAodGV4dDogU3RyaW5nVHJhY2tlcikgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEgJiYgdGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikpIHtcbiAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhID0gQmV0d2VlblRhZ0RhdGEuU3BhY2VPbmUoJyAnKTtcblxuICAgICAgICAgICAgZGF0YVRhZyA9IHRoaXMuUmVCdWlsZFRhZ0RhdGEodHlwZS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWdTcGxpY2VkKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhVGFnLmVxLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YVRhZyA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0LCAnICcpLlBsdXMoZGF0YVRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YWdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMoXG4gICAgICAgICAgICAnPCcsIHR5cGUsIGRhdGFUYWdcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSkge1xuICAgICAgICAgICAgdGFnRGF0YS5QbHVzJGA+JHthd2FpdCBTZW5kRGF0YUZ1bmMoQmV0d2VlblRhZ0RhdGEpfTwvJHt0eXBlfT5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFnRGF0YS5QbHVzKCcvPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhZ0RhdGE7XG4gICAgfVxuXG4gICAgZXhwb3J0RGVmYXVsdFZhbHVlcyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgZm91bmRTZXR0ZXJzOiBEZWZhdWx0VmFsdWVzW10gPSBbXSkge1xuICAgICAgICBjb25zdCBpbmRleEJhc2ljOiBBcnJheU1hdGNoID0gZmlsZURhdGEubWF0Y2goL0BkZWZhdWx0WyBdKlxcKChbQS1aYS16MC05e30oKVxcW1xcXV9cXC0kXCInYCUqJnxcXC9cXEAgXFxuXSopXFwpWyBdKlxcWyhbQS1aYS16MC05X1xcLSwkIFxcbl0rKVxcXS8pO1xuXG4gICAgICAgIGlmIChpbmRleEJhc2ljID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4geyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH07XG5cbiAgICAgICAgY29uc3QgV2l0aG91dEJhc2ljID0gZmlsZURhdGEuc3Vic3RyaW5nKDAsIGluZGV4QmFzaWMuaW5kZXgpLlBsdXMoZmlsZURhdGEuc3Vic3RyaW5nKGluZGV4QmFzaWMuaW5kZXggKyBpbmRleEJhc2ljWzBdLmxlbmd0aCkpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5VmFsdWVzID0gaW5kZXhCYXNpY1syXS5lcS5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKTtcblxuICAgICAgICBmb3VuZFNldHRlcnMucHVzaCh7XG4gICAgICAgICAgICB2YWx1ZTogaW5kZXhCYXNpY1sxXSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBhcnJheVZhbHVlc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKFdpdGhvdXRCYXNpYywgZm91bmRTZXR0ZXJzKTtcbiAgICB9XG5cbiAgICBhZGREZWZhdWx0VmFsdWVzKGFycmF5VmFsdWVzOiBEZWZhdWx0VmFsdWVzW10sIGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheVZhbHVlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiZSBvZiBpLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlQWxsKCcjJyArIGJlLCBpLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBwYXJzZUNvbXBvbmVudFByb3BzKHRhZ0RhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgY29tcG9uZW50OiBTdHJpbmdUcmFja2VyKSB7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIGxldCB7IGZpbGVEYXRhLCBmb3VuZFNldHRlcnMgfSA9IHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhjb21wb25lbnQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0YWdEYXRhKSB7XG4gICAgICAgICAgICBpZiAoaS5uLmVxID09ICcmJykge1xuICAgICAgICAgICAgICAgIGxldCByZSA9IGkubi5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgRm91bmRJbmRleDogbnVtYmVyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlLmluY2x1ZGVzKCcmJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSByZS5pbmRleE9mKCcmJyk7XG4gICAgICAgICAgICAgICAgICAgIEZvdW5kSW5kZXggPSB0aGlzLmZpbmRJbmRleFNlYXJjaFRhZyhyZS5zdWJzdHJpbmcoMCwgaW5kZXgpLmVxLCBmaWxlRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJlID0gcmUuc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgRm91bmRJbmRleCA9IGZpbGVEYXRhLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZURhdGFOZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoZmlsZURhdGEuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0RGF0YSA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBGb3VuZEluZGV4KTtcbiAgICAgICAgICAgICAgICBmaWxlRGF0YU5leHQuUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRhLFxuICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihmaWxlRGF0YS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYCAke3JlfT1cIiR7aS52ID8/ICcnfVwiYCxcbiAgICAgICAgICAgICAgICAgICAgKHN0YXJ0RGF0YS5lbmRzV2l0aCgnICcpID8gJycgOiAnICcpLFxuICAgICAgICAgICAgICAgICAgICBmaWxlRGF0YS5zdWJzdHJpbmcoRm91bmRJbmRleClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YU5leHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBpLm4uZXEsIFwiZ2lcIik7XG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKHJlLCBpLnYgPz8gaS5uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBwYXRoOiBzdHJpbmcsIFNtYWxsUGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLlBsdWdpbkJ1aWxkLkJ1aWxkQ29tcG9uZW50KGZpbGVEYXRhLCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgICAgIGZpbGVEYXRhID0gdGhpcy5wYXJzZUNvbXBvbmVudFByb3BzKHRhZ0RhdGEsIGZpbGVEYXRhKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UoLzxcXDpyZWFkZXIoICkqXFwvPi9naSwgQmV0d2VlblRhZ0RhdGEgPz8gJycpO1xuXG4gICAgICAgIHBhdGhOYW1lID0gcGF0aE5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGg7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLlN0YXJ0UmVwbGFjZShmaWxlRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IFBhcnNlRGVidWdJbmZvKGZpbGVEYXRhLCBgJHtwYXRoTmFtZX0gLT5cXG4ke1NtYWxsUGF0aH1gKTtcblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgbWFwQXR0cmlidXRlczogU3RyaW5nQW55TWFwLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcil7XG4gICAgICAgIGNvbnN0IGFkZEF0dHIgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGRhdGEucHVzaCh7bjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwga2V5KSwgdjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgdmFsdWUpfSk7XG4gICAgICAgICAgICBtYXBBdHRyaWJ1dGVzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGltcG9ydFNvdXJjZSA9ICcvJyArIHR5cGUuZXh0cmFjdEluZm8oKTtcbiAgICAgICAgYWRkQXR0cignaW1wb3J0U291cmNlJywgaW1wb3J0U291cmNlKTtcbiAgICAgICAgYWRkQXR0cignaW1wb3J0U291cmNlRGlyZWN0b3J5JywgcGF0aC5kaXJuYW1lKGltcG9ydFNvdXJjZSkpO1xuICAgICAgICBtYXBBdHRyaWJ1dGVzLnJlYWRlciA9IEJldHdlZW5UYWdEYXRhPy5lcTtcbiAgICB9XG5cbiAgICBhc3luYyBpbnNlcnRUYWdEYXRhKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFN0cmluZ1RyYWNrZXIsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH06IHsgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyfSkge1xuICAgICAgICBjb25zdCB7IGRhdGEsIG1hcEF0dHJpYnV0ZXMgfSA9IHRoaXMudGFnRGF0YShkYXRhVGFnKSwgQnVpbGRJbiA9IElzSW5jbHVkZSh0eXBlLmVxKTtcblxuICAgICAgICBsZXQgZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIFNlYXJjaEluQ29tbWVudCA9IHRydWUsIEFsbFBhdGhUeXBlczogUGF0aFR5cGVzID0ge30sIGFkZFN0cmluZ0luZm86IHN0cmluZztcblxuICAgICAgICBpZiAoQnVpbGRJbikgey8vY2hlY2sgaWYgaXQgYnVpbGQgaW4gY29tcG9uZW50XG4gICAgICAgICAgICBjb25zdCB7IGNvbXBpbGVkU3RyaW5nLCBjaGVja0NvbXBvbmVudHMgfSA9IGF3YWl0IFN0YXJ0Q29tcGlsaW5nKCBwYXRoTmFtZSwgdHlwZSwgZGF0YSwgQmV0d2VlblRhZ0RhdGEgPz8gbmV3IFN0cmluZ1RyYWNrZXIoKSwgdGhpcywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgZmlsZURhdGEgPSBjb21waWxlZFN0cmluZztcbiAgICAgICAgICAgIFNlYXJjaEluQ29tbWVudCA9IGNoZWNrQ29tcG9uZW50cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmb2xkZXI6IGJvb2xlYW4gfCBzdHJpbmcgPSBkYXRhLmhhdmUoJ2ZvbGRlcicpO1xuXG4gICAgICAgICAgICBpZiAoZm9sZGVyKVxuICAgICAgICAgICAgICAgIGZvbGRlciA9IGRhdGEucmVtb3ZlKCdmb2xkZXInKSB8fCAnLic7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1BhdGggPSAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgdHlwZS5yZXBsYWNlKC86L2dpLCBcIi9cIikuZXE7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwgPSB0eXBlLmV4dHJhY3RJbmZvKCc8bGluZT4nKSwgcmVsYXRpdmVzRmlsZVBhdGggPSBwYXRoTm9kZS5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCByZWxhdGl2ZXNGaWxlUGF0aFNtYWxsKTtcbiAgICAgICAgICAgIEFsbFBhdGhUeXBlcyA9IENyZWF0ZUZpbGVQYXRoKHJlbGF0aXZlc0ZpbGVQYXRoLCByZWxhdGl2ZXNGaWxlUGF0aFNtYWxsLCB0YWdQYXRoLCB0aGlzLmRpckZvbGRlciwgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMuY29tcG9uZW50KTtcblxuICAgICAgICAgICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID09PSBudWxsIHx8IHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID09PSB1bmRlZmluZWQgJiYgIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEFsbFBhdGhUeXBlcy5GdWxsUGF0aCkpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBDb21wb25lbnQgJHt0eXBlLmVxfSBub3QgZm91bmQhIC0+ICR7cGF0aE5hbWV9XFxuLT4gJHt0eXBlLmxpbmVJbmZvfVxcbiR7QWxsUGF0aFR5cGVzLlNtYWxsUGF0aH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNvbXBvbmVudC1ub3QtZm91bmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlJlQnVpbGRUYWcodHlwZSwgZGF0YVRhZywgZGF0YSwgQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhID0+IHRoaXMuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXT8ubXRpbWVNcylcbiAgICAgICAgICAgICAgICBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IHsgbXRpbWVNczogYXdhaXQgRWFzeUZzLnN0YXQoQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCAnbXRpbWVNcycpIH07IC8vIGFkZCB0byBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICAgICAgICAgIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llc1tBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdLm10aW1lTXNcblxuICAgICAgICAgICAgY29uc3QgeyBhbGxEYXRhLCBzdHJpbmdJbmZvIH0gPSBhd2FpdCBBZGREZWJ1Z0luZm8odHJ1ZSwgcGF0aE5hbWUsIEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0pO1xuICAgICAgICAgICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShhbGxEYXRhLCB0aGlzLmlzVHMoKSk7XG5cbiAgICAgICAgICAgIC8qYWRkIHNwZWNpYWwgYXR0cmlidXRlcyAqL1xuICAgICAgICAgICAgSW5zZXJ0Q29tcG9uZW50LmFkZFNwYWNpYWxBdHRyaWJ1dGVzKGRhdGEsIG1hcEF0dHJpYnV0ZXMsIHR5cGUsIEJldHdlZW5UYWdEYXRhKTtcblxuICAgICAgICAgICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKHNlc3Npb25JbmZvLCBBbGxQYXRoVHlwZXMuRnVsbFBhdGgsIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIHBhdGhOYW1lICsgJyAtPiAnICsgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgbWFwQXR0cmlidXRlcyk7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYmFzZURhdGEuc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLmNsZWFyRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgc3RyaW5nSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChTZWFyY2hJbkNvbW1lbnQgJiYgKGZpbGVEYXRhLmxlbmd0aCA+IDAgfHwgQmV0d2VlblRhZ0RhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IEFsbFBhdGhUeXBlcztcblxuICAgICAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLmJ1aWxkVGFnQmFzaWMoZmlsZURhdGEsIGRhdGEsIEJ1aWxkSW4gPyB0eXBlLmVxIDogRnVsbFBhdGgsIEJ1aWxkSW4gPyB0eXBlLmVxIDogU21hbGxQYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8sIEJldHdlZW5UYWdEYXRhKTtcbiAgICAgICAgICAgIGFkZFN0cmluZ0luZm8gJiYgZmlsZURhdGEuQWRkVGV4dEJlZm9yZU5vVHJhY2soYWRkU3RyaW5nSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDaGVja0RvdWJsZVNwYWNlKC4uLmRhdGE6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBtaW5pID0gdGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIik7XG4gICAgICAgIGxldCBzdGFydERhdGEgPSBkYXRhLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKG1pbmkpIHtcbiAgICAgICAgICAgIHN0YXJ0RGF0YSA9IHN0YXJ0RGF0YS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAobWluaSAmJiBzdGFydERhdGEuZW5kc1dpdGgoJyAnKSAmJiBpLnN0YXJ0c1dpdGgoJyAnKSkge1xuICAgICAgICAgICAgICAgIGkgPSBpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXJ0RGF0YSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIDEgPT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXJ0RGF0YS5QbHVzKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1pbmkpIHtcbiAgICAgICAgICAgIHN0YXJ0RGF0YSA9IHN0YXJ0RGF0YS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXJ0RGF0YTtcbiAgICB9XG5cbiAgICBhc3luYyBTdGFydFJlcGxhY2UoZGF0YTogU3RyaW5nVHJhY2tlciwgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgICAgICBsZXQgZmluZDogbnVtYmVyO1xuXG4gICAgICAgIGNvbnN0IHByb21pc2VCdWlsZDogKFN0cmluZ1RyYWNrZXIgfCBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KVtdID0gW107XG5cbiAgICAgICAgd2hpbGUgKChmaW5kID0gZGF0YS5zZWFyY2godGhpcy5yZWdleFNlYXJjaCkpICE9IC0xKSB7XG5cbiAgICAgICAgICAgIC8vaGVjayBpZiB0aGVyZSBpcyBzcGVjaWFsIHRhZyAtIG5lZWQgdG8gc2tpcCBpdFxuICAgICAgICAgICAgY29uc3QgbG9jU2tpcCA9IGRhdGEuZXE7XG4gICAgICAgICAgICBjb25zdCBzcGVjaWFsU2tpcCA9IHRoaXMuRmluZFNwZWNpYWxUYWdCeVN0YXJ0KGxvY1NraXAudHJpbSgpKTtcblxuICAgICAgICAgICAgaWYgKHNwZWNpYWxTa2lwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBsb2NTa2lwLmluZGV4T2Yoc3BlY2lhbFNraXBbMF0pICsgc3BlY2lhbFNraXBbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9IGxvY1NraXAuc3Vic3RyaW5nKHN0YXJ0KS5pbmRleE9mKHNwZWNpYWxTa2lwWzFdKSArIHN0YXJ0ICsgc3BlY2lhbFNraXBbMV0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKGRhdGEuc3Vic3RyaW5nKDAsIGVuZCkpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgdGhlIHRhZ1xuICAgICAgICAgICAgY29uc3QgY3V0U3RhcnREYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZmluZCk7IC8vPFxuXG4gICAgICAgICAgICBjb25zdCBzdGFydEZyb20gPSBkYXRhLnN1YnN0cmluZyhmaW5kKTtcblxuICAgICAgICAgICAgLy90YWcgdHlwZSBcbiAgICAgICAgICAgIGNvbnN0IHRhZ1R5cGVFbmQgPSBzdGFydEZyb20uc2VhcmNoKCdcXCB8L3xcXD58KDwlKScpO1xuXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlID0gc3RhcnRGcm9tLnN1YnN0cmluZygxLCB0YWdUeXBlRW5kKTtcblxuICAgICAgICAgICAgY29uc3QgZmluZEVuZE9mU21hbGxUYWcgPSBhd2FpdCB0aGlzLkZpbmRDbG9zZUNoYXIoc3RhcnRGcm9tLnN1YnN0cmluZygxKSwgJz4nKSArIDE7XG5cbiAgICAgICAgICAgIGxldCBpblRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcodGFnVHlwZUVuZCArIDEsIGZpbmRFbmRPZlNtYWxsVGFnKTtcblxuICAgICAgICAgICAgY29uc3QgTmV4dFRleHRUYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKGZpbmRFbmRPZlNtYWxsVGFnICsgMSk7XG5cbiAgICAgICAgICAgIGlmIChpblRhZy5hdChpblRhZy5sZW5ndGggLSAxKS5lcSA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICBpblRhZyA9IGluVGFnLnN1YnN0cmluZygwLCBpblRhZy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXJ0RnJvbS5hdChmaW5kRW5kT2ZTbWFsbFRhZyAtIDEpLmVxID09ICcvJykgey8vc21hbGwgdGFnXG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tNaW5IVE1MKGN1dFN0YXJ0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSBOZXh0VGV4dFRhZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9iaWcgdGFnIHdpdGggcmVhZGVyXG4gICAgICAgICAgICBsZXQgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5TaW1wbGVTa2lwLmluY2x1ZGVzKHRhZ1R5cGUuZXEpKSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gTmV4dFRleHRUYWcuaW5kZXhPZignPC8nICsgdGFnVHlwZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IGF3YWl0IHRoaXMuRmluZENsb3NlQ2hhckhUTUwoTmV4dFRleHRUYWcsIHRhZ1R5cGUuZXEpO1xuICAgICAgICAgICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYFxcbldhcm5pbmcsIHlvdSBkaWRuJ3Qgd3JpdGUgcmlnaHQgdGhpcyB0YWc6IFwiJHt0YWdUeXBlfVwiLCB1c2VkIGluOiAke3RhZ1R5cGUuYXQoMCkubGluZUluZm99XFxuKHRoZSBzeXN0ZW0gd2lsbCBhdXRvIGNsb3NlIGl0KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggIT0gbnVsbCAmJiBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoMCwgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcblxuICAgICAgICAgICAgLy9maW5kaW5nIGxhc3QgY2xvc2UgXG4gICAgICAgICAgICBjb25zdCBOZXh0RGF0YUNsb3NlID0gTmV4dFRleHRUYWcuc3Vic3RyaW5nKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBOZXh0RGF0YUFmdGVyQ2xvc2UgPSBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggIT0gbnVsbCA/IE5leHREYXRhQ2xvc2Uuc3Vic3RyaW5nKEJhc2VSZWFkZXIuZmluZEVuZE9mRGVmKE5leHREYXRhQ2xvc2UuZXEsICc+JykgKyAxKSA6IE5leHREYXRhQ2xvc2U7IC8vIHNlYXJjaCBmb3IgdGhlIGNsb3NlIG9mIGEgYmlnIHRhZyBqdXN0IGlmIHRoZSB0YWcgaXMgdmFsaWRcblxuICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgdGhpcy5DaGVja01pbkhUTUwoY3V0U3RhcnREYXRhKSxcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydFRhZ0RhdGEocGF0aE5hbWUsIHRhZ1R5cGUsIGluVGFnLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZGF0YSA9IE5leHREYXRhQWZ0ZXJDbG9zZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IHRleHRCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcHJvbWlzZUJ1aWxkKSB7XG4gICAgICAgICAgICB0ZXh0QnVpbGQgPSB0aGlzLkNoZWNrRG91YmxlU3BhY2UodGV4dEJ1aWxkLCBhd2FpdCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkNoZWNrTWluSFRNTCh0aGlzLkNoZWNrRG91YmxlU3BhY2UodGV4dEJ1aWxkLCBkYXRhKSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIFJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb2RlID0gY29kZS50cmltKCk7XG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoLyU+WyBdKzwlKD8hWz06XSkvLCAnJT48JScpO1xuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9XG5cbiAgICBhc3luYyBJbnNlcnQoZGF0YTogU3RyaW5nVHJhY2tlciwgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vcmVtb3ZpbmcgaHRtbCBjb21tZW50IHRhZ3NcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPCEtLVtcXHdcXFddKz8tLT4vLCAnJyk7XG5cbiAgICAgICAgZGF0YSA9IGF3YWl0IHRoaXMuU3RhcnRSZXBsYWNlKGRhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHJlYWRlciwgcmVwbGFjaW5nIGhpbSB3aXRoICdjb2RlYmFzZSdcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPFxcOnJlYWRlcisoICkqXFwvPi9naSwgJzwldHlwZW9mIHBhZ2UuY29kZWJhc2UgPT0gXCJmdW5jdGlvblwiID8gcGFnZS5jb2RlYmFzZSgpOiB3cml0ZShwYWdlLmNvZGViYXNlKSU+JykgLy8gcmVwbGFjZSBmb3IgaW1wb3J0aW5nIHBhZ2VzIC8gY29tcG9uZW50c1xuICAgICAgICByZXR1cm4gdGhpcy5SZW1vdmVVbm5lY2Vzc2FyeVNwYWNlKGRhdGEpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5mdW5jdGlvbiB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgIGxldCBhID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnN1YnN0cigtNCk7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXRNYWluKGRhdGE6IFN0cmluZ1RyYWNrZXIsIGFycmF5OnN0cmluZ1tdLCBzaW5nOnN0cmluZywgYmlnVGFnPzpib29sZWFuLCBzZWFyY2hGb3I/OmJvb2xlYW4pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGxldCBvdXQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZSBvZiBhcnJheSkge1xuICAgICAgICBvdXQgKz0gdW5pY29kZU1lKHNpbmcpICsgZSArIFwifFwiO1xuICAgIH1cbiAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKDAsIG91dC5sZW5ndGggLSAxKTtcbiAgICBvdXQgPSBgPCgke291dH0pJHtzZWFyY2hGb3IgPyBcIihbXFxcXHB7TH0wLTlfXFxcXC1cXFxcLl0rKVwiOiBcIlwifShcXFxcdTAwMjApKlxcXFx1MDAyRj8+YFxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgbmV3IFJlZ0V4cChvdXQsICd1JyksIHNpbmcsIGJpZ1RhZylcbn1cblxuZnVuY3Rpb24gb3V0VGFnTmFtZShkYXRhOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbmQgPSBkYXRhLmluZGV4T2YoXCI+XCIpO1xuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBlbmQpO1xuICAgIHdoaWxlIChkYXRhLmVuZHNXaXRoKFwiIFwiKSB8fCBkYXRhLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZGF0YS5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXREYXRhIHtcbiAgICB0YWc6IHN0cmluZyxcbiAgICBkYXRhOiBTdHJpbmdUcmFja2VyLFxuICAgIGxvYzogbnVtYmVyLFxufVxuXG5pbnRlcmZhY2UgU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBkYXRhPzogU3RyaW5nVHJhY2tlcixcbiAgICBlcnJvcj86IGJvb2xlYW4sXG4gICAgZm91bmQ/OiBTZWFyY2hDdXREYXRhW11cbn1cblxuLyoqXG4gKiBJdCBzZWFyY2hlcyBmb3IgYSBzcGVjaWZpYyB0YWcgYW5kIHJldHVybnMgdGhlIGRhdGEgaW5zaWRlIG9mIGl0LlxuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSBkYXRhIC0gVGhlIHN0cmluZyB5b3Ugd2FudCB0byBzZWFyY2ggdGhyb3VnaC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBmaW5kQXJyYXkgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2luZyAtIFRoZSBzdHJpbmcgdGhhdCB5b3Ugd2FudCB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIFtiaWdUYWc9dHJ1ZV0gLSBJZiB0cnVlLCB0aGUgZnVuY3Rpb24gd2lsbCBzZWFyY2ggZm9yIHRoZSBlbmQgb2YgdGhlIHRhZy4gSWYgZmFsc2UsIGl0IHdpbGxcbiAqIHNlYXJjaCBmb3IgdGhlIG5leHQgaW5zdGFuY2Ugb2YgdGhlIHRhZy5cbiAqIEBwYXJhbSBvdXRwdXQgLSBUaGUgb3V0cHV0IG9mIHRoZSBzZWFyY2guXG4gKiBAcGFyYW0ge1NlYXJjaEN1dERhdGFbXX0gcmV0dXJuQXJyYXkgLSBBbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgdGFnIG5hbWUsIHRoZSBkYXRhXG4gKiBpbnNpZGUgdGhlIHRhZywgYW5kIHRoZSBsb2NhdGlvbiBvZiB0aGUgdGFnIGluIHRoZSBvcmlnaW5hbCBzdHJpbmcuXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvZiB0aGUgZGF0YSB0aGF0IHdhcyBmb3VuZCwgYW5kIGFuIGFycmF5IG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLlxuICovXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXQoZGF0YTpTdHJpbmdUcmFja2VyLCBmaW5kQXJyYXk6UmVnRXhwLCBzaW5nOnN0cmluZywgYmlnVGFnID0gdHJ1ZSwgb3V0cHV0ID0gbmV3IFN0cmluZ1RyYWNrZXIoKSwgcmV0dXJuQXJyYXk6IFNlYXJjaEN1dERhdGFbXSA9IFtdKTogU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBjb25zdCBkYXRhQ29weSA9IGRhdGE7XG4gICAgY29uc3QgYmUgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgIGlmIChiZSA9PSAtMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogb3V0cHV0LlBsdXMoZGF0YSksIGZvdW5kOiByZXR1cm5BcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG91dHB1dC5QbHVzKGRhdGEuc3Vic3RyaW5nKDAsIGJlKSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoYmUgKyAxKTtcblxuICAgIGNvbnN0IHRhZyA9IG91dFRhZ05hbWUoZGF0YS5lcSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZFN0YXJ0KFwiPlwiLCBkYXRhKSk7XG5cbiAgICBsZXQgaW5UYWdEYXRhO1xuXG4gICAgaWYgKGJpZ1RhZykge1xuICAgICAgICBjb25zdCBlbmQgPSBmaW5kRW5kKFtcIjxcIiArIHRhZywgXCI8L1wiICsgdGFnXSwgZGF0YSk7XG4gICAgICAgIGlmIChlbmQgIT0gLTEpIHtcbiAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmROZXh0ID0gZGF0YS5zZWFyY2goZmluZEFycmF5KTtcbiAgICAgICAgICAgIGlmIChmaW5kTmV4dCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kTmV4dCk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmROZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybkFycmF5LnB1c2goe1xuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgZGF0YTogaW5UYWdEYXRhLFxuICAgICAgICBsb2M6IGJlXG4gICAgfSk7XG5cbiAgICBpZiAoZGF0YUNvcHkgPT0gZGF0YSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgZmluZEFycmF5LCBzaW5nLCBiaWdUYWcsIG91dHB1dCwgcmV0dXJuQXJyYXkpO1xufVxuXG5mdW5jdGlvbiBmaW5kU3RhcnQodHlwZTpzdHJpbmcsIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuICAgIHJldHVybiBkYXRhLmluZGV4T2YodHlwZSkgKyB0eXBlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gZmluZEVuZCh0eXBlczogc3RyaW5nW10sIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuXG4gICAgbGV0IF8wID0gZGF0YS5pbmRleE9mKHR5cGVzWzBdKTtcblxuICAgIGNvbnN0IF8xID0gZGF0YS5pbmRleE9mKHR5cGVzWzFdKTtcblxuICAgIGlmIChfMSA9PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKF8wIDwgXzEgJiYgXzAgIT0gLTEpIHtcbiAgICAgICAgXzArKztcbiAgICAgICAgY29uc3QgbmV4dCA9IF8wICsgZmluZEVuZCh0eXBlcywgZGF0YS5zdWJzdHJpbmcoXzApKSArIHR5cGVzWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG5leHQgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhuZXh0KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXzE7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7XG4gICAgc2VhcmNoRm9yQ3V0TWFpbiBhcyBnZXREYXRhVGFnZXNcbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2VSZWFkZXIgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBnZXREYXRhVGFnZXMgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBDUnVuVGltZSBmcm9tIFwiLi9Db21waWxlXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuXG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7ZGVmaW5lOiB7fX07XG5cbmNvbnN0IHN0cmluZ0F0dHJpYnV0ZXMgPSBbJ1xcJycsICdcIicsICdgJ107XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZUJhc2VQYWdlIHtcbiAgICBwdWJsaWMgY2xlYXJEYXRhOiBTdHJpbmdUcmFja2VyXG4gICAgcHVibGljIHNjcmlwdEZpbGUgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgcHVibGljIHZhbHVlQXJyYXk6IHsga2V5OiBzdHJpbmcsIHZhbHVlOiBTdHJpbmdUcmFja2VyIH1bXSA9IFtdXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvZGU/OiBTdHJpbmdUcmFja2VyLCBwdWJsaWMgaXNUcz86IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkU2V0dGluZ3Moc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgcGFnZVBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIHBhZ2VOYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgY29uc3QgcnVuID0gbmV3IENSdW5UaW1lKHRoaXMuY29kZSwgc2Vzc2lvbkluZm8sIHNtYWxsUGF0aCwgdGhpcy5pc1RzKTtcbiAgICAgICAgdGhpcy5jb2RlID0gYXdhaXQgcnVuLmNvbXBpbGUoYXR0cmlidXRlcyk7XG5cbiAgICAgICAgdGhpcy5wYXJzZUJhc2UodGhpcy5jb2RlKTtcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkQ29kZUZpbGUocGFnZVBhdGgsIHNtYWxsUGF0aCwgdGhpcy5pc1RzLCBzZXNzaW9uSW5mbywgcGFnZU5hbWUpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2FkRGVmaW5lKHsuLi5zZXR0aW5ncy5kZWZpbmUsIC4uLnJ1bi5kZWZpbmV9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlQmFzZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBkYXRhU3BsaXQ6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZXIoL0BcXFtbIF0qKChbQS1aYS16X11bQS1aYS16XzAtOV0qPSgoXCJbXlwiXSpcIil8KGBbXmBdKmApfCgnW14nXSonKXxbQS1aYS16MC05X10rKShbIF0qLD9bIF0qKT8pKilcXF0vLCBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGFTcGxpdCA9IGRhdGFbMV0udHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdoaWxlIChkYXRhU3BsaXQ/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZmluZFdvcmQgPSBkYXRhU3BsaXQuaW5kZXhPZignPScpO1xuXG4gICAgICAgICAgICBsZXQgdGhpc1dvcmQgPSBkYXRhU3BsaXQuc3Vic3RyaW5nKDAsIGZpbmRXb3JkKS50cmltKCkuZXE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzV29yZFswXSA9PSAnLCcpXG4gICAgICAgICAgICAgICAgdGhpc1dvcmQgPSB0aGlzV29yZC5zdWJzdHJpbmcoMSkudHJpbSgpO1xuXG4gICAgICAgICAgICBsZXQgbmV4dFZhbHVlID0gZGF0YVNwbGl0LnN1YnN0cmluZyhmaW5kV29yZCArIDEpO1xuXG4gICAgICAgICAgICBsZXQgdGhpc1ZhbHVlOiBTdHJpbmdUcmFja2VyO1xuXG4gICAgICAgICAgICBjb25zdCBjbG9zZUNoYXIgPSBuZXh0VmFsdWUuYXQoMCkuZXE7XG4gICAgICAgICAgICBpZiAoc3RyaW5nQXR0cmlidXRlcy5pbmNsdWRlcyhjbG9zZUNoYXIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEobmV4dFZhbHVlLmVxLnN1YnN0cmluZygxKSwgY2xvc2VDaGFyKTtcbiAgICAgICAgICAgICAgICB0aGlzVmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKDEsIGVuZEluZGV4KTtcblxuICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoZW5kSW5kZXggKyAxKS50cmltKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gbmV4dFZhbHVlLnNlYXJjaCgvW18gLF0vKTtcblxuICAgICAgICAgICAgICAgIGlmIChlbmRJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzVmFsdWUgPSBuZXh0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzVmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZyhlbmRJbmRleCkudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YVNwbGl0ID0gbmV4dFZhbHVlO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUFycmF5LnB1c2goeyBrZXk6IHRoaXNXb3JkLCB2YWx1ZTogdGhpc1ZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBjb2RlLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZCgpIHtcbiAgICAgICAgaWYoIXRoaXMudmFsdWVBcnJheS5sZW5ndGgpIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdAWycpO1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlIH0gb2YgdGhpcy52YWx1ZUFycmF5KSB7XG4gICAgICAgICAgICBidWlsZC5QbHVzJGAke2tleX09XCIke3ZhbHVlLnJlcGxhY2VBbGwoJ1wiJywgJ1xcXFxcIicpfVwiYDtcbiAgICAgICAgfVxuICAgICAgICBidWlsZC5QbHVzKFwiXVwiKS5QbHVzKHRoaXMuY2xlYXJEYXRhKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBidWlsZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVidWlsZEJhc2VJbmhlcml0YW5jZShjb2RlOiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IHBhcnNlID0gbmV3IFBhcnNlQmFzZVBhZ2UoKTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICBwYXJzZS5wYXJzZUJhc2UoY29kZSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHBhcnNlLmJ5VmFsdWUoJ2luaGVyaXQnKSkge1xuICAgICAgICAgICAgcGFyc2UucG9wKG5hbWUpXG4gICAgICAgICAgICBidWlsZC5QbHVzKGA8QCR7bmFtZX0+PDoke25hbWV9Lz48L0Ake25hbWV9PmApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZS5yZWJ1aWxkKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlLmNsZWFyRGF0YS5QbHVzKGJ1aWxkKTtcbiAgICB9XG5cbiAgICBnZXQobmFtZTogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkgPT09IG5hbWUpPy52YWx1ZVxuICAgIH1cblxuICAgIHBvcChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UodGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5ID09PSBuYW1lKSwgMSlbMF0/LnZhbHVlO1xuICAgIH1cblxuICAgIHBvcEFueShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGF2ZU5hbWUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkudG9Mb3dlckNhc2UoKSA9PSBuYW1lKTtcblxuICAgICAgICBpZiAoaGF2ZU5hbWUgIT0gLTEpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZShoYXZlTmFtZSwgMSlbMF0udmFsdWU7XG5cbiAgICAgICAgY29uc3QgYXNUYWcgPSBnZXREYXRhVGFnZXModGhpcy5jbGVhckRhdGEsIFtuYW1lXSwgJ0AnKTtcblxuICAgICAgICBpZiAoIWFzVGFnLmZvdW5kWzBdKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBhc1RhZy5kYXRhO1xuXG4gICAgICAgIHJldHVybiBhc1RhZy5mb3VuZFswXS5kYXRhLnRyaW0oKTtcbiAgICB9XG5cbiAgICBieVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5maWx0ZXIoeCA9PiB4LnZhbHVlLmVxID09PSB2YWx1ZSkubWFwKHggPT4geC5rZXkpXG4gICAgfVxuXG4gICAgcmVwbGFjZVZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgaGF2ZSA9IHRoaXMudmFsdWVBcnJheS5maW5kKHggPT4geC5rZXkgPT09IG5hbWUpXG4gICAgICAgIGlmIChoYXZlKSBoYXZlLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkQ29kZUZpbGUocGFnZVBhdGg6IHN0cmluZywgcGFnZVNtYWxsUGF0aDogc3RyaW5nLCBpc1RzOiBib29sZWFuLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwYWdlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBoYXZlQ29kZSA9IHRoaXMucG9wQW55KCdjb2RlZmlsZScpPy5lcTtcbiAgICAgICAgaWYgKCFoYXZlQ29kZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLnBvcEFueSgnbGFuZycpPy5lcTtcbiAgICAgICAgaWYgKGhhdmVDb2RlLnRvTG93ZXJDYXNlKCkgPT0gJ2luaGVyaXQnKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYWdlUGF0aDtcblxuICAgICAgICBjb25zdCBoYXZlRXh0ID0gcGF0aC5leHRuYW1lKGhhdmVDb2RlKS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoaGF2ZUV4dCkpIHtcbiAgICAgICAgICAgIGlmICgvKFxcXFx8XFwvKSQvLnRlc3QoaGF2ZUNvZGUpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhZ2VQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGlmICghQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhoYXZlRXh0KSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYXRoLmV4dG5hbWUocGFnZVBhdGgpO1xuICAgICAgICAgICAgaGF2ZUNvZGUgKz0gJy4nICsgKGxhbmcgPyBsYW5nIDogaXNUcyA/ICd0cycgOiAnanMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQ29kZVswXSA9PSAnLicpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocGFnZVBhdGgpLCBoYXZlQ29kZSlcblxuICAgICAgICBjb25zdCBTbWFsbFBhdGggPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGhhdmVDb2RlKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCxoYXZlQ29kZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8oZmFsc2UsIHBhZ2VOYW1lLCBoYXZlQ29kZSwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gYmFzZU1vZGVsRGF0YS5hbGxEYXRhLnJlcGxhY2VBbGwoXCJAXCIsIFwiQEBcIik7XG5cbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjaygnPCUnKTtcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCclPicpO1xuICAgICAgICAgICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgICAgICAgICBpZDogU21hbGxQYXRoLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29kZUZpbGVOb3RGb3VuZCcsXG4gICAgICAgICAgICAgICAgdGV4dDogYFxcbkNvZGUgZmlsZSBub3QgZm91bmQ6ICR7cGFnZVBhdGh9PGxpbmU+JHtTbWFsbFBhdGh9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIocGFnZU5hbWUsIGA8JT1cIjxwIHN0eWxlPVxcXFxcImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XFxcXFwiPkNvZGUgRmlsZSBOb3QgRm91bmQ6ICcke3BhZ2VTbWFsbFBhdGh9JyAtPiAnJHtTbWFsbFBhdGh9JzwvcD5cIiU+YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRTZXR0aW5nKG5hbWUgPSAnZGVmaW5lJywgbGltaXRBcmd1bWVudHMgPSAyKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLmNsZWFyRGF0YS5pbmRleE9mKGBAJHtuYW1lfShgKTtcbiAgICAgICAgaWYgKGhhdmUgPT0gLTEpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBhcmd1bWVudEFycmF5OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoMCwgaGF2ZSk7XG4gICAgICAgIGxldCB3b3JrRGF0YSA9IHRoaXMuY2xlYXJEYXRhLnN1YnN0cmluZyhoYXZlICsgOCkudHJpbVN0YXJ0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW1pdEFyZ3VtZW50czsgaSsrKSB7IC8vIGFyZ3VtZW50cyByZWFkZXIgbG9vcFxuICAgICAgICAgICAgY29uc3QgcXVvdGF0aW9uU2lnbiA9IHdvcmtEYXRhLmF0KDApLmVxO1xuXG4gICAgICAgICAgICBjb25zdCBlbmRRdW90ZSA9IEJhc2VSZWFkZXIuZmluZEVudE9mUSh3b3JrRGF0YS5lcS5zdWJzdHJpbmcoMSksIHF1b3RhdGlvblNpZ24pO1xuXG4gICAgICAgICAgICBhcmd1bWVudEFycmF5LnB1c2god29ya0RhdGEuc3Vic3RyaW5nKDEsIGVuZFF1b3RlKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFmdGVyQXJndW1lbnQgPSB3b3JrRGF0YS5zdWJzdHJpbmcoZW5kUXVvdGUgKyAxKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIGlmIChhZnRlckFyZ3VtZW50LmF0KDApLmVxICE9ICcsJykge1xuICAgICAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd29ya0RhdGEgPSBhZnRlckFyZ3VtZW50LnN1YnN0cmluZygxKS50cmltU3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdvcmtEYXRhID0gd29ya0RhdGEuc3Vic3RyaW5nKHdvcmtEYXRhLmluZGV4T2YoJyknKSArIDEpO1xuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJlZm9yZS50cmltRW5kKCkuUGx1cyh3b3JrRGF0YS50cmltU3RhcnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50QXJyYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRGVmaW5lKG1vcmVEZWZpbmU6IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBsZXQgbGFzdFZhbHVlID0gdGhpcy5sb2FkU2V0dGluZygpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlczogKFN0cmluZ1RyYWNrZXJ8c3RyaW5nKVtdW10gPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcy51bnNoaWZ0KC4uLk9iamVjdC5lbnRyaWVzKG1vcmVEZWZpbmUpKVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQ29udmVydFN5bnRheE1pbmkgfSBmcm9tIFwiLi4vLi4vUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXhcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tIFwiLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmdcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vSlNQYXJzZXJcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1J1blRpbWUge1xuICAgIGRlZmluZSA9IHt9XG4gICAgY29uc3RydWN0b3IocHVibGljIHNjcmlwdDogU3RyaW5nVHJhY2tlciwgcHVibGljIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGlzVHM6IGJvb2xlYW4pIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgdGVtcGxhdGVTY3JpcHQoc2NyaXB0czogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgY29uc3QgX193cml0ZUFycmF5ID0gW11cbiAgICAgICAgdmFyIF9fd3JpdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCl7XG4gICAgICAgICAgICBfX3dyaXRlLnRleHQgKz0gdGV4dDtcbiAgICAgICAgfWApXG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYF9fd3JpdGUgPSB7dGV4dDogJyd9O1xuICAgICAgICAgICAgX193cml0ZUFycmF5LnB1c2goX193cml0ZSk7YClcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMoaSlcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYHJldHVybiBfX3dyaXRlQXJyYXlgKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWV0aG9kcyhhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGNvbnN0IF9fbG9jYWxwYXRoID0gJy8nICsgc21hbGxQYXRoVG9QYWdlKHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0cmluZzogJ3NjcmlwdCxzdHlsZSxkZWZpbmUsc3RvcmUscGFnZV9fZmlsZW5hbWUscGFnZV9fZGlybmFtZSxfX2xvY2FscGF0aCxhdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgIGZ1bmNzOiBbXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zY3JpcHQuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnN0eWxlLmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB0aGlzLmRlZmluZVtTdHJpbmcoa2V5KV0gPSB2YWx1ZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNvbXBpbGVSdW5UaW1lU3RvcmUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5mdWxsUGF0aCxcbiAgICAgICAgICAgICAgICBwYXRoLmRpcm5hbWUodGhpcy5zZXNzaW9uSW5mby5mdWxsUGF0aCksXG4gICAgICAgICAgICAgICAgX19sb2NhbHBhdGgsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1xuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkQ29kZShwYXJzZXI6IEpTUGFyc2VyLCBidWlsZFN0cmluZ3M6IHsgdGV4dDogc3RyaW5nIH1bXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhpLnRleHQpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhidWlsZFN0cmluZ3MucG9wKCkudGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBhc3luYyBjb21waWxlKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgLyogbG9hZCBmcm9tIGNhY2hlICovXG4gICAgICAgIGNvbnN0IGhhdmVDYWNoZSA9IHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXTtcbiAgICAgICAgaWYgKGhhdmVDYWNoZSlcbiAgICAgICAgICAgIHJldHVybiAoYXdhaXQgaGF2ZUNhY2hlKSgpO1xuICAgICAgICBsZXQgZG9Gb3JBbGw6IChyZXNvbHZlOiAoKSA9PiBTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPikgPT4gdm9pZDtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gbmV3IFByb21pc2UociA9PiBkb0ZvckFsbCA9IHIpO1xuXG4gICAgICAgIC8qIHJ1biB0aGUgc2NyaXB0ICovXG4gICAgICAgIHRoaXMuc2NyaXB0ID0gYXdhaXQgQ29udmVydFN5bnRheE1pbmkodGhpcy5zY3JpcHQsIFwiQGNvbXBpbGVcIiwgXCIqXCIpO1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGhpcy5zY3JpcHQsIHRoaXMuc21hbGxQYXRoLCAnPCUqJywgJyU+Jyk7XG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGlmIChwYXJzZXIudmFsdWVzLmxlbmd0aCA9PSAxICYmIHBhcnNlci52YWx1ZXNbMF0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlID0gKCkgPT4gdGhpcy5zY3JpcHQ7XG4gICAgICAgICAgICBkb0ZvckFsbChyZXNvbHZlKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdHlwZSwgZmlsZVBhdGhdID0gU3BsaXRGaXJzdCgnLycsIHRoaXMuc21hbGxQYXRoKSwgdHlwZUFycmF5ID0gZ2V0VHlwZXNbdHlwZV0gPz8gZ2V0VHlwZXMuU3RhdGljLFxuICAgICAgICAgICAgY29tcGlsZVBhdGggPSB0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY29tcC5qcyc7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoZmlsZVBhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlU2NyaXB0KHBhcnNlci52YWx1ZXMuZmlsdGVyKHggPT4geC50eXBlICE9ICd0ZXh0JykubWFwKHggPT4geC50ZXh0KSk7XG4gICAgICAgIGNvbnN0IHsgZnVuY3MsIHN0cmluZyB9ID0gdGhpcy5tZXRob2RzKGF0dHJpYnV0ZXMpXG5cbiAgICAgICAgY29uc3QgdG9JbXBvcnQgPSBhd2FpdCBjb21waWxlSW1wb3J0KHN0cmluZywgY29tcGlsZVBhdGgsIGZpbGVQYXRoLCB0eXBlQXJyYXksIHRoaXMuaXNUcywgdGhpcy5zZXNzaW9uSW5mby5kZWJ1ZywgdGVtcGxhdGUpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGUgPSBhc3luYyAoKSA9PiB0aGlzLnJlYnVpbGRDb2RlKHBhcnNlciwgYXdhaXQgdG9JbXBvcnQoLi4uZnVuY3MpKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gZXhlY3V0ZTsgLy8gc2F2ZSB0aGlzIHRvIGNhY2hlXG4gICAgICAgIGNvbnN0IHRoaXNGaXJzdCA9IGF3YWl0IGV4ZWN1dGUoKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSBcImVzYnVpbGQtd2FzbVwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgaXNUcyB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBwYWdlRGVwcyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHNcIjtcbmltcG9ydCBDdXN0b21JbXBvcnQsIHsgaXNQYXRoQ3VzdG9tIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L2luZGV4XCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5ncywgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkXCI7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9BbGlhc1wiO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvQ29uc29sZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgZm9ybWF0OiAnY2pzJyxcbiAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cycgOiAnanMnLFxuICAgIG1pbmlmeTogY29kZU1pbmlmeSxcbiAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/ICdleHRlcm5hbCcgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBzb3VyY2VmaWxlOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIGRlYnVnOiBcIlwiICsgaXNEZWJ1Z1xuICAgIH1cbiAgfTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7fSk7XG4gIFJlc3VsdCA9IHRlbXBsYXRlKFxuICAgIFJlc3VsdCxcbiAgICBpc0RlYnVnLFxuICAgIHBhdGguZGlybmFtZSh0ZW1wbGF0ZVBhdGgpLFxuICAgIHRlbXBsYXRlUGF0aCxcbiAgICBwYXJhbXNcbiAgKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHsgY29kZSwgd2FybmluZ3MsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKFJlc3VsdCwgT3B0aW9ucyk7XG4gICAgaWYgKG1lcmdlVHJhY2spIHtcbiAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihtZXJnZVRyYWNrLCB3YXJuaW5ncyk7XG4gICAgICBSZXN1bHQgPSAoYXdhaXQgYmFja1RvT3JpZ2luYWwobWVyZ2VUcmFjaywgY29kZSwgbWFwKSkuU3RyaW5nV2l0aFRhY2soc2F2ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBFU0J1aWxkUHJpbnRXYXJuaW5ncyh3YXJuaW5ncywgZmlsZVBhdGgpO1xuICAgICAgUmVzdWx0ID0gY29kZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChtZXJnZVRyYWNrKSB7XG4gICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIobWVyZ2VUcmFjaywgZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3IoZXJyLCBmaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNhdmVQYXRoKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHNhdmVQYXRoLCBSZXN1bHQpO1xuICB9XG4gIHJldHVybiBSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIENoZWNrVHMoRmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gRmlsZVBhdGguZW5kc1dpdGgoXCIudHNcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gIHJldHVybiBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICB0eXBlQXJyYXlbMF0gKyBJblN0YXRpY1BhdGgsXG4gICAgdHlwZUFycmF5WzFdICsgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIsXG4gICAgQ2hlY2tUcyhJblN0YXRpY1BhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRFeHRlbnNpb24oRmlsZVBhdGg6IHN0cmluZykge1xuICBjb25zdCBmaWxlRXh0ID0gcGF0aC5leHRuYW1lKEZpbGVQYXRoKTtcblxuICBpZiAoQmFzaWNTZXR0aW5ncy5wYXJ0RXh0ZW5zaW9ucy5pbmNsdWRlcyhmaWxlRXh0LnN1YnN0cmluZygxKSkpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyAoaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiKVxuICBlbHNlIGlmIChmaWxlRXh0ID09ICcnKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNbaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiXTtcblxuICByZXR1cm4gRmlsZVBhdGg7XG59XG5cbmNvbnN0IFNhdmVkTW9kdWxlcyA9IHt9O1xuXG4vKipcbiAqIExvYWRJbXBvcnQgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCB0byBhIGZpbGUsIGFuZCByZXR1cm5zIHRoZSBtb2R1bGUgdGhhdCBpcyBhdCB0aGF0IHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbXBvcnRGcm9tIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBjcmVhdGVkIHRoaXMgaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IEluU3RhdGljUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IFt1c2VEZXBzXSAtIFRoaXMgaXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gd2l0aG91dENhY2hlIC0gYW4gYXJyYXkgb2YgcGF0aHMgdGhhdCB3aWxsIG5vdCBiZSBjYWNoZWQuXG4gKiBAcmV0dXJucyBUaGUgbW9kdWxlIHRoYXQgd2FzIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBMb2FkSW1wb3J0KGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlOiBzdHJpbmdbXSA9IFtdKSB7XG4gIGxldCBUaW1lQ2hlY2s6IGFueTtcbiAgY29uc3Qgb3JpZ2luYWxQYXRoID0gcGF0aC5ub3JtYWxpemUoSW5TdGF0aWNQYXRoLnRvTG93ZXJDYXNlKCkpO1xuXG4gIEluU3RhdGljUGF0aCA9IEFkZEV4dGVuc2lvbihJblN0YXRpY1BhdGgpO1xuICBjb25zdCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoSW5TdGF0aWNQYXRoKS5zdWJzdHJpbmcoMSksIHRoaXNDdXN0b20gPSBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoLCBleHRlbnNpb24pIHx8ICFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoZXh0ZW5zaW9uKTtcbiAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aCksIGZpbGVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSwgSW5TdGF0aWNQYXRoKTtcblxuICAvL3dhaXQgaWYgdGhpcyBtb2R1bGUgaXMgb24gcHJvY2VzcywgaWYgbm90IGRlY2xhcmUgdGhpcyBhcyBvbiBwcm9jZXNzIG1vZHVsZVxuICBsZXQgcHJvY2Vzc0VuZDogKHY/OiBhbnkpID0+IHZvaWQ7XG4gIGlmICghU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdKVxuICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gcHJvY2Vzc0VuZCA9IHIpO1xuICBlbHNlIGlmIChTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgIGF3YWl0IFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICAvL2J1aWxkIHBhdGhzXG4gIGNvbnN0IHJlQnVpbGQgPSAhcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gfHwgcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gIT0gKFRpbWVDaGVjayA9IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCkpO1xuXG5cbiAgaWYgKHJlQnVpbGQpIHtcbiAgICBUaW1lQ2hlY2sgPSBUaW1lQ2hlY2sgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKTtcbiAgICBpZiAoVGltZUNoZWNrID09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtmdW5jTmFtZSwgcHJpbnRUZXh0XSA9IGNyZWF0ZU5ld1ByaW50KHtcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7SW5TdGF0aWNQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7aW1wb3J0RnJvbX0nYFxuICAgICAgfSk7XG4gICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG51bGxcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXNDdXN0b20pIC8vIG9ubHkgaWYgbm90IGN1c3RvbSBidWlsZFxuICAgICAgYXdhaXQgQnVpbGRTY3JpcHRTbWFsbFBhdGgoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcpO1xuICAgIHBhZ2VEZXBzLnVwZGF0ZShTYXZlZE1vZHVsZXNQYXRoLCBUaW1lQ2hlY2spO1xuICB9XG5cbiAgaWYgKHVzZURlcHMpIHtcbiAgICB1c2VEZXBzW0luU3RhdGljUGF0aF0gPSB7IHRoaXNGaWxlOiBUaW1lQ2hlY2sgfTtcbiAgICB1c2VEZXBzID0gdXNlRGVwc1tJblN0YXRpY1BhdGhdO1xuICB9XG5cbiAgY29uc3QgaW5oZXJpdGFuY2VDYWNoZSA9IHdpdGhvdXRDYWNoZVswXSA9PSBJblN0YXRpY1BhdGg7XG4gIGlmIChpbmhlcml0YW5jZUNhY2hlKVxuICAgIHdpdGhvdXRDYWNoZS5zaGlmdCgpXG4gIGVsc2UgaWYgKCFyZUJ1aWxkICYmIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSAmJiAhKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHJldHVybiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF07XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgucmVsYXRpdmUocCwgdHlwZUFycmF5WzBdKTtcbiAgICBlbHNlIHtcbiAgICAgIGlmIChwWzBdID09IFwiLlwiKSB7XG4gICAgICAgIHAgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKEluU3RhdGljUGF0aCksIHApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocFswXSAhPSBcIi9cIilcbiAgICAgICAgcmV0dXJuIEFsaWFzT3JQYWNrYWdlKHApO1xuICAgIH1cblxuICAgIHJldHVybiBMb2FkSW1wb3J0KGZpbGVQYXRoLCBwLCB0eXBlQXJyYXksIGlzRGVidWcsIHVzZURlcHMsIGluaGVyaXRhbmNlQ2FjaGUgPyB3aXRob3V0Q2FjaGUgOiBbXSk7XG4gIH1cblxuICBsZXQgTXlNb2R1bGU6IGFueTtcbiAgaWYgKHRoaXNDdXN0b20pIHtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGgsIGZpbGVQYXRoLCBleHRlbnNpb24sIHJlcXVpcmVNYXApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlcXVpcmVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsxXSwgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIpO1xuICAgIE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHJlcXVpcmVQYXRoKTtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXApO1xuICB9XG5cbiAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gTXlNb2R1bGU7XG4gIHByb2Nlc3NFbmQ/LigpO1xuXG4gIHJldHVybiBNeU1vZHVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEltcG9ydEZpbGUoaW1wb3J0RnJvbTogc3RyaW5nLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU/OiBzdHJpbmdbXSkge1xuICBpZiAoIWlzRGVidWcpIHtcbiAgICBjb25zdCBoYXZlSW1wb3J0ID0gU2F2ZWRNb2R1bGVzW3BhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aC50b0xvd2VyQ2FzZSgpKV07XG4gICAgaWYgKGhhdmVJbXBvcnQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGhhdmVJbXBvcnQ7XG4gIH1cblxuICByZXR1cm4gTG9hZEltcG9ydChpbXBvcnRGcm9tLCBJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1ZywgdXNlRGVwcywgd2l0aG91dENhY2hlKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVPbmNlKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgZmlsZVBhdGgsXG4gICAgdGVtcEZpbGUsXG4gICAgQ2hlY2tUcyhmaWxlUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBhd2FpdCBNeU1vZHVsZSgocGF0aDogc3RyaW5nKSA9PiBpbXBvcnQocGF0aCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUNqc1NjcmlwdChjb250ZW50OiBzdHJpbmcpIHtcblxuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBgdGVtcC0ke3V1aWQoKX0uY2pzYCk7XG4gIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGVtcEZpbGUsIGNvbnRlbnQpO1xuXG4gIGNvbnN0IG1vZGVsID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIG1vZGVsO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmFrZSBzY3JpcHQgbG9jYXRpb24sIGEgZmlsZSBsb2NhdGlvbiwgYSB0eXBlIGFycmF5LCBhbmQgYSBib29sZWFuIGZvciB3aGV0aGVyIG9yIG5vdCBpdCdzXG4gKiBhIFR5cGVTY3JpcHQgZmlsZS4gSXQgdGhlbiBjb21waWxlcyB0aGUgc2NyaXB0IGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biB0aGUgbW9kdWxlXG4gKiBUaGlzIGlzIGZvciBSdW5UaW1lIENvbXBpbGUgU2NyaXB0c1xuICogQHBhcmFtIHtzdHJpbmd9IGdsb2JhbFByYW1zIC0gc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZyxcbiAqIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY3JpcHRMb2NhdGlvbiAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgc2NyaXB0IHRvIGJlIGNvbXBpbGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSAtIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBmaWxlIGZyb20gdGhlIHN0YXRpYyBmb2xkZXIuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBbc3RyaW5nLCBzdHJpbmddXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVHlwZVNjcmlwdCAtIGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBJZiB0cnVlLCB0aGUgY29kZSB3aWxsIGJlIGNvbXBpbGVkIHdpdGggZGVidWcgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZUNvZGUgLSBUaGUgY29kZSB0aGF0IHdpbGwgYmUgY29tcGlsZWQgYW5kIHNhdmVkIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU1hcENvbW1lbnQgLSBzdHJpbmdcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVJbXBvcnQoZ2xvYmFsUHJhbXM6IHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzVHlwZVNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgbWVyZ2VUcmFjazogU3RyaW5nVHJhY2tlcikge1xuICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgdHlwZUFycmF5WzFdKTtcblxuICBjb25zdCBmdWxsU2F2ZUxvY2F0aW9uID0gc2NyaXB0TG9jYXRpb24gKyBcIi5janNcIjtcbiAgY29uc3QgdGVtcGxhdGVQYXRoID0gdHlwZUFycmF5WzBdICsgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlO1xuXG4gIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHNjcmlwdExvY2F0aW9uLFxuICAgIGZ1bGxTYXZlTG9jYXRpb24sXG4gICAgaXNUeXBlU2NyaXB0LFxuICAgIGlzRGVidWcsXG4gICAgeyBwYXJhbXM6IGdsb2JhbFByYW1zLCBtZXJnZVRyYWNrLCB0ZW1wbGF0ZVBhdGgsIGNvZGVNaW5pZnk6IGZhbHNlIH1cbiAgKTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHApO1xuXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQodGVtcGxhdGVQYXRoLCBwLCB0eXBlQXJyYXksIGlzRGVidWcpO1xuICB9XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoZnVsbFNhdmVMb2NhdGlvbik7XG4gIHJldHVybiBhc3luYyAoLi4uYXJyOiBhbnlbXSkgPT4gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCwgLi4uYXJyKTtcbn0iLCAiaW1wb3J0IHsgU3RyaW5nTWFwIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgTWluaVNlYXJjaCwge1NlYXJjaE9wdGlvbnN9IGZyb20gJ21pbmlzZWFyY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hSZWNvcmQge1xuICAgIHByaXZhdGUgZnVsbFBhdGg6IHN0cmluZ1xuICAgIHByaXZhdGUgaW5kZXhEYXRhOiB7W2tleTogc3RyaW5nXToge1xuICAgICAgICB0aXRsZXM6IFN0cmluZ01hcCxcbiAgICAgICAgdGV4dDogc3RyaW5nXG4gICAgfX1cbiAgICBwcml2YXRlIG1pbmlTZWFyY2g6IE1pbmlTZWFyY2g7XG4gICAgY29uc3RydWN0b3IoZmlsZXBhdGg6IHN0cmluZyl7XG4gICAgICAgIHRoaXMuZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBmaWxlcGF0aCArICcuanNvbidcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKCl7XG4gICAgICAgIHRoaXMuaW5kZXhEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZ1bGxQYXRoKTtcbiAgICAgICAgY29uc3QgdW53cmFwcGVkOiB7aWQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZ31bXSA9IFtdO1xuXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgZm9yKGNvbnN0IHBhdGggaW4gdGhpcy5pbmRleERhdGEpe1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuaW5kZXhEYXRhW3BhdGhdO1xuICAgICAgICAgICAgZm9yKGNvbnN0IGlkIGluIGVsZW1lbnQudGl0bGVzKXtcbiAgICAgICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50aXRsZXNbaWRdLCB1cmw6IGAvJHtwYXRofS8jJHtpZH1gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50ZXh0LCB1cmw6IGAvJHtwYXRofWB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWluaVNlYXJjaCA9IG5ldyBNaW5pU2VhcmNoKHtcbiAgICAgICAgICAgIGZpZWxkczogWyd0ZXh0J10sXG4gICAgICAgICAgICBzdG9yZUZpZWxkczogWydpZCcsICd0ZXh0JywgJ3VybCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubWluaVNlYXJjaC5hZGRBbGwodW53cmFwcGVkKTtcbiAgICB9XG5cbiAgICBzZWFyY2godGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zID0ge2Z1enp5OiB0cnVlfSwgdGFnID0gJ2InKXtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubWluaVNlYXJjaC5zZWFyY2godGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIGlmKCF0YWcpIHJldHVybiBkYXRhO1xuXG4gICAgICAgIGZvcihjb25zdCBpIG9mIGRhdGEpe1xuICAgICAgICAgICAgZm9yKGNvbnN0IHRlcm0gb2YgaS50ZXJtcyl7XG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyID0gaS50ZXh0LnRvTG93ZXJDYXNlKCksIHJlYnVpbGQgPSAnJztcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIGxldCBiZWVuTGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGluZGV4ICE9IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgcmVidWlsZCArPSBpLnRleHQuc3Vic3RyaW5nKGJlZW5MZW5ndGgsIGJlZW5MZW5ndGggKyBpbmRleCkgKyAgYDwke3RhZ30+JHtpLnRleHQuc3Vic3RyaW5nKGluZGV4ICsgYmVlbkxlbmd0aCwgaW5kZXggKyB0ZXJtLmxlbmd0aCArIGJlZW5MZW5ndGgpfTwvJHt0YWd9PmBcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBsb3dlci5zdWJzdHJpbmcoaW5kZXggKyB0ZXJtLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJlZW5MZW5ndGggKz0gaW5kZXggKyB0ZXJtLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGkudGV4dCA9IHJlYnVpbGQgKyBpLnRleHQuc3Vic3RyaW5nKGJlZW5MZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgc3VnZ2VzdCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMpe1xuICAgICAgICByZXR1cm4gdGhpcy5taW5pU2VhcmNoLmF1dG9TdWdnZXN0KHRleHQsIG9wdGlvbnMpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFNlYXJjaFJlY29yZCBmcm9tIFwiLi4vLi4vLi4vQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkXCJcbmltcG9ydCB7U2V0dGluZ3N9ICBmcm9tICcuLi8uLi8uLi9NYWluQnVpbGQvU2VydmVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1NldHRpbmdzLCBTZWFyY2hSZWNvcmR9O1xufSIsICJpbXBvcnQgcGFja2FnZUV4cG9ydCBmcm9tIFwiLi9wYWNrYWdlRXhwb3J0XCI7XG5cbi8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBhbGlhc05hbWVzID0gW3BhY2thZ2VOYW1lXVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoOiBzdHJpbmcpOiBhbnkge1xuXG4gICAgc3dpdGNoIChvcmlnaW5hbFBhdGgpIHtcbiAgICAgICAgLy9AdHMtaWdub3JlLW5leHQtbGluZVxuICAgICAgICBjYXNlIHBhY2thZ2VOYW1lOlxuICAgICAgICAgICAgcmV0dXJuIHBhY2thZ2VFeHBvcnQoKVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFsaWFzT3JQYWNrYWdlKG9yaWdpbmFsUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgaGF2ZSA9IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGhhdmUpIHJldHVybiBoYXZlXG4gICAgcmV0dXJuIGltcG9ydChvcmlnaW5hbFBhdGgpO1xufSIsICJpbXBvcnQgSW1wb3J0QWxpYXMsIHsgYWxpYXNOYW1lcyB9IGZyb20gJy4vQWxpYXMnO1xuaW1wb3J0IEltcG9ydEJ5RXh0ZW5zaW9uLCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi9FeHRlbnNpb24vaW5kZXgnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNQYXRoQ3VzdG9tKG9yaWdpbmFsUGF0aDogc3RyaW5nLCBleHRlbnNpb246IHN0cmluZykge1xuICAgIHJldHVybiBjdXN0b21UeXBlcy5pbmNsdWRlcyhleHRlbnNpb24pIHx8IGFsaWFzTmFtZXMuaW5jbHVkZXMob3JpZ2luYWxQYXRoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ3VzdG9tSW1wb3J0KG9yaWdpbmFsUGF0aDogc3RyaW5nLCBmdWxsUGF0aDogc3RyaW5nLCBleHRlbnNpb246IHN0cmluZywgcmVxdWlyZTogKHA6IHN0cmluZykgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxpYXNFeHBvcnQgPSBhd2FpdCBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGgpO1xuICAgIGlmIChhbGlhc0V4cG9ydCkgcmV0dXJuIGFsaWFzRXhwb3J0O1xuICAgIHJldHVybiBJbXBvcnRCeUV4dGVuc2lvbihmdWxsUGF0aCwgZXh0ZW5zaW9uKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgUmF6b3JUb0VKUywgUmF6b3JUb0VKU01pbmkgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlcic7XG5cblxuY29uc3QgYWRkV3JpdGVNYXAgPSB7XG4gICAgXCJpbmNsdWRlXCI6IFwiYXdhaXQgXCIsXG4gICAgXCJpbXBvcnRcIjogXCJhd2FpdCBcIixcbiAgICBcInRyYW5zZmVyXCI6IFwicmV0dXJuIGF3YWl0IFwiXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXgodGV4dDogU3RyaW5nVHJhY2tlciwgb3B0aW9ucz86IGFueSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlModGV4dC5lcSk7XG4gICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHZhbHVlcykge1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyhpLnN0YXJ0LCBpLmVuZCk7XG4gICAgICAgIHN3aXRjaCAoaS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoc3Vic3RyaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlPSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJlc2NhcGVcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JToke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHthZGRXcml0ZU1hcFtpLm5hbWVdfSR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBidWlsZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0U3ludGF4TWluaSB0YWtlcyB0aGUgY29kZSBhbmQgYSBzZWFyY2ggc3RyaW5nIGFuZCBjb252ZXJ0IGN1cmx5IGJyYWNrZXRzXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IHRleHQgLSBUaGUgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaW5kIC0gVGhlIHN0cmluZyB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IGFkZEVKUyAtIFRoZSBzdHJpbmcgdG8gYWRkIHRvIHRoZSBzdGFydCBvZiB0aGUgZWpzLlxuICogQHJldHVybnMgQSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4TWluaSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaW5kOiBzdHJpbmcsIGFkZEVKUzogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKU01pbmkodGV4dC5lcSwgZmluZCk7XG4gICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgaWYgKHZhbHVlc1tpXSAhPSB2YWx1ZXNbaSArIDFdKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaV0sIHZhbHVlc1tpICsgMV0pKTtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcodmFsdWVzW2kgKyAyXSwgdmFsdWVzW2kgKyAzXSk7XG4gICAgICAgIGJ1aWxkLlBsdXMkYDwlJHthZGRFSlN9JHtzdWJzdHJpbmd9JT5gO1xuICAgIH1cblxuICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcoKHZhbHVlcy5hdCgtMSk/Py0xKSArIDEpKTtcblxuICAgIHJldHVybiBidWlsZDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaW5hbGl6ZUJ1aWxkIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5cblxuZXhwb3J0IGNsYXNzIFBhZ2VUZW1wbGF0ZSBleHRlbmRzIEpTUGFyc2VyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIEFkZFBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmdWxsUGF0aENvbXBpbGU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIHRleHQgPSBhd2FpdCBmaW5hbGl6ZUJ1aWxkKHRleHQsIHNlc3Npb25JbmZvLCBmdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgdHJ5IHtcXG5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IChfcmVxdWlyZSwgX2luY2x1ZGUsIF90cmFuc2ZlciwgcHJpdmF0ZV92YXIsIGhhbmRlbENvbm5lY3RvcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IF9fZmlsZW5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhzZXNzaW9uSW5mby5mdWxsUGF0aCl9XCIsIF9fZGlybmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHBhdGguZGlybmFtZShzZXNzaW9uSW5mby5mdWxsUGF0aCkpfVwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgeyBzZW5kRmlsZSwgd3JpdGVTYWZlLCB3cml0ZSwgZWNobywgc2V0UmVzcG9uc2UsIG91dF9ydW5fc2NyaXB0LCBydW5fc2NyaXB0X25hbWUsIFJlc3BvbnNlLCBSZXF1ZXN0LCBQb3N0LCBRdWVyeSwgU2Vzc2lvbiwgRmlsZXMsIENvb2tpZXMsIFBhZ2VWYXIsIEdsb2JhbFZhcn0gPSBwYWdlLFxuXG4gICAgICAgICAgICAgICAgICAgIHJ1bl9zY3JpcHRfY29kZSA9IHJ1bl9zY3JpcHRfbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHtgKTtcblxuXG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYFxcbn1cbiAgICAgICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdF9maWxlID0gcnVuX3NjcmlwdF9uYW1lLnNwbGl0KC8tPnw8bGluZT4vKS5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9uYW1lICs9ICcgLT4gPGxpbmU+JyArIGUuc3RhY2suc3BsaXQoL1xcXFxuKCApKmF0IC8pWzJdO1xuICAgICAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcke1BhZ2VUZW1wbGF0ZS5wcmludEVycm9yKGA8cD5FcnJvciBwYXRoOiAnICsgcnVuX3NjcmlwdF9uYW1lLnJlcGxhY2UoLzxsaW5lPi9naSwgJzxici8+JykgKyAnPC9wPjxwPkVycm9yIG1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UgKyAnPC9wPmApfSc7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGF0aDogXCIgKyBydW5fc2NyaXB0X25hbWUuc2xpY2UoMCwgLWxhc3RfZmlsZS5sZW5ndGgpLnJlcGxhY2UoLzxsaW5lPi9naSwgJ1xcXFxuJykpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoKX1cIiArIGxhc3RfZmlsZS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbWVzc2FnZTogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcnVubmluZyB0aGlzIGNvZGU6IFxcXFxcIlwiICsgcnVuX3NjcmlwdF9jb2RlICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzdGFjazogXCIgKyBlLnN0YWNrKTtcbiAgICAgICAgICAgICAgICB9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYH19KTt9YCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmdWxsUGF0aENvbXBpbGU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgICAgICBjb25zdCBidWlsdENvZGUgPSBhd2FpdCBQYWdlVGVtcGxhdGUuUnVuQW5kRXhwb3J0KHRleHQsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5kZWJ1Zyk7XG5cbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5BZGRQYWdlVGVtcGxhdGUoYnVpbHRDb2RlLCBmdWxsUGF0aENvbXBpbGUsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgQWRkQWZ0ZXJCdWlsZCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKFwicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgSW5QYWdlVGVtcGxhdGUodGV4dDogU3RyaW5nVHJhY2tlciwgZGF0YU9iamVjdDogYW55LCBmdWxsUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYDwlIXtcbiAgICAgICAgICAgIGNvbnN0IF9wYWdlID0gcGFnZTtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB7Li4uX3BhZ2Uke2RhdGFPYmplY3QgPyAnLCcgKyBkYXRhT2JqZWN0IDogJyd9fTtcbiAgICAgICAgICAgIGNvbnN0IF9fZmlsZW5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhmdWxsUGF0aCl9XCIsIF9fZGlybmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHBhdGguZGlybmFtZShmdWxsUGF0aCkpfVwiO1xuICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgY29uc3QgaW5jbHVkZSA9IChwLCB3aXRoT2JqZWN0KSA9PiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHAsIHdpdGhPYmplY3QpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmZXIgPSAocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0KSA9PiAob3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9LCBfdHJhbnNmZXIocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0LCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UpKTtcbiAgICAgICAgICAgICAgICB7JT5gKTtcblxuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soJzwlIX19fSU+Jyk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufVxuIiwgImltcG9ydCBSYXpvclN5bnRheCBmcm9tICcuL1Jhem9yU3ludGF4J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHZXRTeW50YXgoQ29tcGlsZVR5cGU6IGFueSkge1xuICAgIGxldCBmdW5jOiBhbnk7XG4gICAgc3dpdGNoIChDb21waWxlVHlwZS5uYW1lIHx8IENvbXBpbGVUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJSYXpvclwiOlxuICAgICAgICAgICAgZnVuYyA9IFJhem9yU3ludGF4O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xufSIsICJpbXBvcnQgQWRkU3ludGF4IGZyb20gJy4vU3ludGF4L0luZGV4JztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRQbHVnaW4ge1xuXHRwdWJsaWMgU2V0dGluZ3NPYmplY3Q6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKFNldHRpbmdzT2JqZWN0OiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgICAgICB0aGlzLlNldHRpbmdzT2JqZWN0ID0gU2V0dGluZ3NPYmplY3RcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBkZWZhdWx0U3ludGF4KCl7XG4gICAgICAgIHJldHVybiB0aGlzLlNldHRpbmdzT2JqZWN0LkJhc2ljQ29tcGlsYXRpb25TeW50YXguY29uY2F0KHRoaXMuU2V0dGluZ3NPYmplY3QuQWRkQ29tcGlsZVN5bnRheCk7XG4gICAgfVxuXG4gICAgYXN5bmMgQnVpbGRCYXNpYyh0ZXh0OiBTdHJpbmdUcmFja2VyLCBPRGF0YTpzdHJpbmcgfGFueSwgcGF0aDpzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICAvL2FkZCBTeW50YXhcblxuICAgICAgICBpZiAoIU9EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShPRGF0YSkpIHtcbiAgICAgICAgICAgIE9EYXRhID0gW09EYXRhXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBPRGF0YSkge1xuICAgICAgICAgICAgY29uc3QgU3ludGF4ID0gYXdhaXQgQWRkU3ludGF4KGkpO1xuXG4gICAgICAgICAgICBpZiAoU3ludGF4KSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGF3YWl0IFN5bnRheCh0ZXh0LCBpLCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBwYWdlc1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIHRleHQgPSBhd2FpdCB0aGlzLkJ1aWxkQmFzaWModGV4dCwgdGhpcy5kZWZhdWx0U3ludGF4LCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIGNvbXBvbmVudHNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkQ29tcG9uZW50KHRleHQ6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj57XG4gICAgICAgIHRleHQgPSBhd2FpdCB0aGlzLkJ1aWxkQmFzaWModGV4dCwgdGhpcy5kZWZhdWx0U3ludGF4LCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59IiwgIi8vZ2xvYmFsIHNldHRpbmdzIGZvciBidWlsZCBpbiBjb21wb25lbnRzXG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHtcbiAgICBwbHVnaW5zOiBbXVxufTsiLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4vSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4vU2NyaXB0VGVtcGxhdGUnO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7IENyZWF0ZUZpbGVQYXRoLCBQYXJzZURlYnVnTGluZSwgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0ICogYXMgZXh0cmljYXRlIGZyb20gJy4vWE1MSGVscGVycy9FeHRyaWNhdGUnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEJ1aWxkU2NyaXB0IGZyb20gJy4vdHJhbnNmb3JtL1NjcmlwdCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBCdWlsZFNjcmlwdFNldHRpbmdzIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvU2V0dGluZ3MnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5ncyA9IHsgQWRkQ29tcGlsZVN5bnRheDogW10sIHBsdWdpbnM6IFtdLCBCYXNpY0NvbXBpbGF0aW9uU3ludGF4OiBbJ1Jhem9yJ10gfTtcbmNvbnN0IFBsdWdpbkJ1aWxkID0gbmV3IEFkZFBsdWdpbihTZXR0aW5ncyk7XG5leHBvcnQgY29uc3QgQ29tcG9uZW50cyA9IG5ldyBJbnNlcnRDb21wb25lbnQoUGx1Z2luQnVpbGQpO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0UGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBTZXR0aW5ncy5wbHVnaW5zLmZpbmQoYiA9PiBiID09IG5hbWUgfHwgKDxhbnk+Yik/Lm5hbWUgPT0gbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTb21lUGx1Z2lucyguLi5kYXRhOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBkYXRhLnNvbWUoeCA9PiBHZXRQbHVnaW4oeCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcygpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheC5pbmNsdWRlcygnVHlwZVNjcmlwdCcpO1xufVxuXG5Db21wb25lbnRzLk1pY3JvUGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5Db21wb25lbnRzLkdldFBsdWdpbiA9IEdldFBsdWdpbjtcbkNvbXBvbmVudHMuU29tZVBsdWdpbnMgPSBTb21lUGx1Z2lucztcbkNvbXBvbmVudHMuaXNUcyA9IGlzVHM7XG5cbkJ1aWxkU2NyaXB0U2V0dGluZ3MucGx1Z2lucyA9IFNldHRpbmdzLnBsdWdpbnM7XG5cbmFzeW5jIGZ1bmN0aW9uIG91dFBhZ2UoZGF0YTogU3RyaW5nVHJhY2tlciwgc2NyaXB0RmlsZTogU3RyaW5nVHJhY2tlciwgcGFnZVBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgTGFzdFNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG5cbiAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKGRhdGEsIGlzVHMoKSk7XG4gICAgYXdhaXQgYmFzZURhdGEubG9hZFNldHRpbmdzKHNlc3Npb25JbmZvLCBwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgcGFnZU5hbWUpO1xuXG4gICAgY29uc3QgbW9kZWxOYW1lID0gYmFzZURhdGEucG9wQW55KCdtb2RlbCcpPy5lcTtcblxuICAgIGlmICghbW9kZWxOYW1lKSByZXR1cm4gc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUsIGJhc2VEYXRhLmNsZWFyRGF0YSk7XG4gICAgZGF0YSA9IGJhc2VEYXRhLmNsZWFyRGF0YTtcblxuICAgIC8vaW1wb3J0IG1vZGVsXG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChwYWdlUGF0aCwgTGFzdFNtYWxsUGF0aCwgbW9kZWxOYW1lLCAnTW9kZWxzJywgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMubW9kZWwpOyAvLyBmaW5kIGxvY2F0aW9uIG9mIHRoZSBmaWxlXG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bGxQYXRoKSkge1xuICAgICAgICBjb25zdCBFcnJvck1lc3NhZ2UgPSBgRXJyb3IgbW9kZWwgbm90IGZvdW5kIC0+ICR7bW9kZWxOYW1lfSBhdCBwYWdlICR7cGFnZU5hbWV9YDtcblxuICAgICAgICBwcmludC5lcnJvcihFcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQsIFBhZ2VUZW1wbGF0ZS5wcmludEVycm9yKEVycm9yTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLCBGdWxsUGF0aCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdFxuXG4gICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhmYWxzZSwgcGFnZU5hbWUsIEZ1bGxQYXRoLCBTbWFsbFBhdGgpOyAvLyByZWFkIG1vZGVsXG4gICAgbGV0IG1vZGVsRGF0YSA9IFBhcnNlQmFzZVBhZ2UucmVidWlsZEJhc2VJbmhlcml0YW5jZShiYXNlTW9kZWxEYXRhLmFsbERhdGEpO1xuXG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgbW9kZWxEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICBwYWdlTmFtZSArPSBcIiAtPiBcIiArIFNtYWxsUGF0aDtcblxuICAgIC8vR2V0IHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IGFsbERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ2VzKG1vZGVsRGF0YSwgWycnXSwgJzonLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICBpZiAoYWxsRGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHdpdGhpbiBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgbW9kZWxEYXRhID0gYWxsRGF0YS5kYXRhO1xuICAgIGNvbnN0IHRhZ0FycmF5ID0gYWxsRGF0YS5mb3VuZC5tYXAoeCA9PiB4LnRhZy5zdWJzdHJpbmcoMSkpO1xuICAgIGNvbnN0IG91dERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ2VzKGRhdGEsIHRhZ0FycmF5LCAnQCcpO1xuXG4gICAgaWYgKG91dERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBXaXRoIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvL0J1aWxkIFdpdGggcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbW9kZWxCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgYWxsRGF0YS5mb3VuZCkge1xuICAgICAgICBpLnRhZyA9IGkudGFnLnN1YnN0cmluZygxKTsgLy8gcmVtb3ZpbmcgdGhlICc6J1xuICAgICAgICBjb25zdCBob2xkZXJEYXRhID0gb3V0RGF0YS5mb3VuZC5maW5kKChlKSA9PiBlLnRhZyA9PSAnQCcgKyBpLnRhZyk7XG5cbiAgICAgICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YS5zdWJzdHJpbmcoMCwgaS5sb2MpKTtcbiAgICAgICAgbW9kZWxEYXRhID0gbW9kZWxEYXRhLnN1YnN0cmluZyhpLmxvYyk7XG5cbiAgICAgICAgaWYgKGhvbGRlckRhdGEpIHtcbiAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhob2xkZXJEYXRhLmRhdGEpO1xuICAgICAgICB9IGVsc2UgeyAvLyBUcnkgbG9hZGluZyBkYXRhIGZyb20gcGFnZSBiYXNlXG4gICAgICAgICAgICBjb25zdCBsb2FkRnJvbUJhc2UgPSBiYXNlRGF0YS5nZXQoaS50YWcpO1xuXG4gICAgICAgICAgICBpZiAobG9hZEZyb21CYXNlICYmIGxvYWRGcm9tQmFzZS5lcS50b0xvd2VyQ2FzZSgpICE9ICdpbmhlcml0JylcbiAgICAgICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobG9hZEZyb21CYXNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG91dFBhZ2UobW9kZWxCdWlsZCwgc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUpLCBGdWxsUGF0aCwgcGFnZU5hbWUsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW5zZXJ0KGRhdGE6IHN0cmluZywgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIG5lc3RlZFBhZ2U6IGJvb2xlYW4sIG5lc3RlZFBhZ2VEYXRhOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBsZXQgRGVidWdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGRhdGEpO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgb3V0UGFnZShEZWJ1Z1N0cmluZywgbmV3IFN0cmluZ1RyYWNrZXIoRGVidWdTdHJpbmcuRGVmYXVsdEluZm9UZXh0KSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBsdWdpbkJ1aWxkLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgQ29tcG9uZW50cy5JbnNlcnQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pOyAvLyBhZGQgY29tcG9uZW50c1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYXJzZURlYnVnTGluZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcblxuICAgIGlmIChuZXN0ZWRQYWdlKSB7IC8vIHJldHVybiBTdHJpbmdUcmFja2VyLCBiZWNhdXNlIHRoaXMgaW1wb3J0IHdhcyBmcm9tIHBhZ2VcbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5JblBhZ2VUZW1wbGF0ZShEZWJ1Z1N0cmluZywgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvLmZ1bGxQYXRoKTtcbiAgICB9XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZSwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMoRGVidWdTdHJpbmcpO1xuICAgIERlYnVnU3RyaW5nPSBQYWdlVGVtcGxhdGUuQWRkQWZ0ZXJCdWlsZChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgcmV0dXJuIERlYnVnU3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJ1aWxkSlMsIEJ1aWxkSlNYLCBCdWlsZFRTLCBCdWlsZFRTWCB9IGZyb20gJy4vRm9yU3RhdGljL1NjcmlwdCc7XG5pbXBvcnQgQnVpbGRTdmVsdGUgZnJvbSAnLi9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFN0eWxlU2FzcyB9IGZyb20gJy4vRm9yU3RhdGljL1N0eWxlJztcbmltcG9ydCB7IGdldFR5cGVzLCBTeXN0ZW1EYXRhLCBnZXREaXJuYW1lLCBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgUmVzcG9uc2UsIFJlcXVlc3QgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHByb21wdGx5IGZyb20gJ3Byb21wdGx5JztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcblxuY29uc3QgU3VwcG9ydGVkVHlwZXMgPSBbJ2pzJywgJ3N2ZWx0ZScsICd0cycsICdqc3gnLCAndHN4JywgJ2NzcycsICdzYXNzJywgJ3Njc3MnXTtcblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU3RhdGljRmlsZXMnKTtcblxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG8gPSBTdGF0aWNGaWxlc0luZm8uc3RvcmVbcGF0aF07XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbykge1xuICAgICAgICBsZXQgcCA9IGk7XG5cbiAgICAgICAgaWYgKGkgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgcCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBGaWxlUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IG9baV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICFvO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkRmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZnVsbENvbXBpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKFNtYWxsUGF0aCkuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgZGVwZW5kZW5jaWVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xuICAgIHN3aXRjaCAoZXh0KSB7XG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3NzJzpcbiAgICAgICAgY2FzZSAnc2Fzcyc6XG4gICAgICAgIGNhc2UgJ3Njc3MnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdHlsZVNhc3MoU21hbGxQYXRoLCBleHQsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N2ZWx0ZSc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN2ZWx0ZShTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgZnVsbENvbXBpbGVQYXRoICs9ICcuanMnO1xuICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxDb21waWxlUGF0aCkpIHtcbiAgICAgICAgU3RhdGljRmlsZXNJbmZvLnVwZGF0ZShTbWFsbFBhdGgsIGRlcGVuZGVuY2llcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghaXNEZWJ1ZylcbiAgICAgICAgcmV0dXJuIHRydWU7XG59XG5cbmludGVyZmFjZSBidWlsZEluIHtcbiAgICBwYXRoPzogc3RyaW5nO1xuICAgIGV4dD86IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgaW5TZXJ2ZXI/OiBzdHJpbmc7XG59XG5cbmNvbnN0IHN0YXRpY0ZpbGVzID0gU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL2NsaWVudC8nO1xuY29uc3QgZ2V0U3RhdGljOiBidWlsZEluW10gPSBbe1xuICAgIHBhdGg6IFwic2Vydi90ZW1wLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwiYnVpbGRUZW1wbGF0ZS5qc1wiXG59LFxue1xuICAgIHBhdGg6IFwic2Vydi9jb25uZWN0LmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFrZUNvbm5lY3Rpb24uanNcIlxufV07XG5cbmNvbnN0IGdldFN0YXRpY0ZpbGVzVHlwZTogYnVpbGRJbltdID0gW3tcbiAgICBleHQ6ICcucHViLmpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIubWpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIuY3NzJyxcbiAgICB0eXBlOiAnY3NzJ1xufV07XG5cbmFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkQnlUeXBlKFJlcXVlc3Q6IFJlcXVlc3QsIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmb3VuZCA9IGdldFN0YXRpY0ZpbGVzVHlwZS5maW5kKHggPT4gZmlsZVBhdGguZW5kc1dpdGgoeC5leHQpKTtcblxuICAgIGlmICghZm91bmQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgY29uc3QgYmFzZVBhdGggPSBSZXF1ZXN0LnF1ZXJ5LnQgPT0gJ2wnID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXTtcbiAgICBjb25zdCBpblNlcnZlciA9IHBhdGguam9pbihiYXNlUGF0aCwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoaW5TZXJ2ZXIpKVxuICAgICAgICByZXR1cm4geyAuLi5mb3VuZCwgaW5TZXJ2ZXIgfTtcbn1cblxubGV0IGRlYnVnZ2luZ1dpdGhTb3VyY2U6IG51bGwgfCBib29sZWFuID0gbnVsbDtcblxuaWYgKGFyZ3YuaW5jbHVkZXMoJ2FsbG93U291cmNlRGVidWcnKSlcbiAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gdHJ1ZTtcbmFzeW5jIGZ1bmN0aW9uIGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSB7XG4gICAgaWYgKHR5cGVvZiBkZWJ1Z2dpbmdXaXRoU291cmNlID09ICdib29sZWFuJylcbiAgICAgICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG5cbiAgICB0cnkge1xuICAgICAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gKGF3YWl0IHByb21wdGx5LnByb21wdChcbiAgICAgICAgICAgICdBbGxvdyBkZWJ1Z2dpbmcgSmF2YVNjcmlwdC9DU1MgaW4gc291cmNlIHBhZ2U/IC0gZXhwb3NpbmcgeW91ciBzb3VyY2UgY29kZSAobm8pJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iodjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ3llcycsICdubyddLmluY2x1ZGVzKHYudHJpbSgpLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigneWVzIG9yIG5vJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwICogMzBcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSkudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT0gJ3llcyc7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIH0gY2F0Y2ggeyB9XG5cblxuICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xufVxuXG5jb25zdCBzYWZlRm9sZGVycyA9IFtnZXRUeXBlcy5TdGF0aWNbMl0sIGdldFR5cGVzLkxvZ3NbMl0sICdNb2RlbHMnLCAnQ29tcG9uZW50cyddO1xuLyoqXG4gKiBJZiB0aGUgdXNlciBpcyBpbiBkZWJ1ZyBtb2RlLCBhbmQgdGhlIGZpbGUgaXMgYSBzb3VyY2UgZmlsZSwgYW5kIHRoZSB1c2VyIGNvbW1lbmQgbGluZSBhcmd1bWVudCBoYXZlIGFsbG93U291cmNlRGVidWdcbiAqIHRoZW4gcmV0dXJuIHRoZSBmdWxsIHBhdGggdG8gdGhlIGZpbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGlzIHRoZSBjdXJyZW50IHBhZ2UgYSBkZWJ1ZyBwYWdlP1xuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggb2YgdGhlIGZpbGUgdGhhdCB3YXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZCAtIElmIHRoaXMgcGF0aCBhbHJlYWR5IGJlZW4gY2hlY2tlZFxuICogdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgdHlwZSBvZiB0aGUgZmlsZSBhbmQgdGhlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVuc2FmZURlYnVnKGlzRGVidWc6IGJvb2xlYW4sIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWlzRGVidWcgfHwgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpIHx8IHBhdGguZXh0bmFtZShmaWxlUGF0aCkgIT0gJy5zb3VyY2UnIHx8ICFzYWZlRm9sZGVycy5pbmNsdWRlcyhmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5zaGlmdCgpKSB8fCAhYXdhaXQgYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDcpKTsgLy8gcmVtb3ZpbmcgJy5zb3VyY2UnXG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3R5bGUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGJhc2VGaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA0KTsgLy8gcmVtb3ZpbmcgJy5jc3MnXG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBmaWxlUGF0aDtcblxuICAgIGxldCBleGlzdHM6IGJvb2xlYW47XG4gICAgaWYgKHBhdGguZXh0bmFtZShiYXNlRmlsZVBhdGgpID09ICcuc3ZlbHRlJyAmJiAoY2hlY2tlZCB8fCAoZXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiAhZXhpc3RzKSB7XG4gICAgICAgIGF3YWl0IEJ1aWxkRmlsZShiYXNlRmlsZVBhdGgsIGlzRGVidWcsIGdldFR5cGVzLlN0YXRpY1sxXSArIGJhc2VGaWxlUGF0aClcbiAgICAgICAgcmV0dXJuIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoLCBjaGVja2VkLCBmYWxzZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdGF0aWMoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9zdmVsdGUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDQpICsgKHBhdGguZXh0bmFtZShmaWxlUGF0aCkgPyAnJyA6ICcvaW5kZXgubWpzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnanMnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25Db2RlVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC9jb2RlLXRoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDE4KTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25UaGVtZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L21kL3RoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBsZXQgZmlsZU5hbWUgPSBmaWxlUGF0aC5zdWJzdHJpbmcoMTQpO1xuICAgIGlmIChmaWxlTmFtZS5zdGFydHNXaXRoKCdhdXRvJykpXG4gICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyaW5nKDQpXG4gICAgZWxzZVxuICAgICAgICBmaWxlTmFtZSA9ICctJyArIGZpbGVOYW1lO1xuXG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJyArIGZpbGVOYW1lLnJlcGxhY2UoJy5jc3MnLCAnLm1pbi5jc3MnKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VydmVyQnVpbGQoUmVxdWVzdDogUmVxdWVzdCwgaXNEZWJ1ZzogYm9vbGVhbiwgcGF0aDogc3RyaW5nLCBjaGVja2VkID0gZmFsc2UpOiBQcm9taXNlPG51bGwgfCBidWlsZEluPiB7XG4gICAgcmV0dXJuIGF3YWl0IHN2ZWx0ZVN0YXRpYyhwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBzdmVsdGVTdHlsZShwYXRoLCBjaGVja2VkLCBpc0RlYnVnKSB8fFxuICAgICAgICBhd2FpdCB1bnNhZmVEZWJ1Zyhpc0RlYnVnLCBwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0LCBwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93blRoZW1lKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IG1hcmtkb3duQ29kZVRoZW1lKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGdldFN0YXRpYy5maW5kKHggPT4geC5wYXRoID09IHBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVidWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpICYmIGF3YWl0IEJ1aWxkRmlsZShTbWFsbFBhdGgsIGlzRGVidWcsIGZ1bGxDb21waWxlUGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBSZXF1ZXN0OiBSZXF1ZXN0LCBSZXNwb25zZTogUmVzcG9uc2UpIHtcbiAgICAvL2ZpbGUgYnVpbHQgaW5cbiAgICBjb25zdCBpc0J1aWxkSW4gPSBhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBpc0RlYnVnLCBTbWFsbFBhdGgsIHRydWUpO1xuXG4gICAgaWYgKGlzQnVpbGRJbikge1xuICAgICAgICBSZXNwb25zZS50eXBlKGlzQnVpbGRJbi50eXBlKTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShpc0J1aWxkSW4uaW5TZXJ2ZXIpKTsgLy8gc2VuZGluZyB0aGUgZmlsZVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy9jb21waWxlZCBmaWxlc1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIFNtYWxsUGF0aDtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIFNtYWxsUGF0aDtcblxuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKCFTdXBwb3J0ZWRUeXBlcy5pbmNsdWRlcyhleHQpKSB7XG4gICAgICAgIFJlc3BvbnNlLnNlbmRGaWxlKGZ1bGxQYXRoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChbJ3Nhc3MnLCAnc2NzcycsICdjc3MnXS5pbmNsdWRlcyhleHQpKSB7IC8vIGFkZGluZyB0eXBlXG4gICAgICAgIFJlc3BvbnNlLnR5cGUoJ2NzcycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFJlc3BvbnNlLnR5cGUoJ2pzJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlc1BhdGggPSBmdWxsQ29tcGlsZVBhdGg7XG5cbiAgICAvLyByZS1jb21waWxpbmcgaWYgbmVjZXNzYXJ5IG9uIGRlYnVnIG1vZGVcbiAgICBpZiAoaXNEZWJ1ZyAmJiAoUmVxdWVzdC5xdWVyeS5zb3VyY2UgPT0gJ3RydWUnIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpICYmICFhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpKSkge1xuICAgICAgICByZXNQYXRoID0gZnVsbFBhdGg7XG4gICAgfSBlbHNlIGlmIChleHQgPT0gJ3N2ZWx0ZScpXG4gICAgICAgIHJlc1BhdGggKz0gJy5qcyc7XG5cbiAgICBSZXNwb25zZS5lbmQoYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocmVzUGF0aCwgJ3V0ZjgnKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbn0iLCAiaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50V2FybmluZ3MgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG1vcmVPcHRpb25zPzogVHJhbnNmb3JtT3B0aW9ucykge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG4gICAgY29uc3QgQWRkT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgc291cmNlZmlsZTogaW5wdXRQYXRoICsgJz9zb3VyY2U9dHJ1ZScsXG4gICAgICAgIHNvdXJjZW1hcDogaXNEZWJ1ZyA/ICdpbmxpbmUnOiBmYWxzZSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgdHlwZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgLi4ubW9yZU9wdGlvbnNcbiAgICB9O1xuXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIHdhcm5pbmdzIH0gPSBhd2FpdCB0cmFuc2Zvcm0ocmVzdWx0LCBBZGRPcHRpb25zKTtcbiAgICAgICAgcmVzdWx0ID0gY29kZTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3MsIGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3IoZXJyLCBmdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqcycsIGlzRGVidWcsIHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzJywgaXNEZWJ1ZywgeyBsb2FkZXI6ICd0cycgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqc3gnLCBpc0RlYnVnLCB7IC4uLihHZXRQbHVnaW4oXCJKU1hPcHRpb25zXCIpID8/IHt9KSwgbG9hZGVyOiAnanN4JyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkVFNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzeCcsIGlzRGVidWcsIHsgbG9hZGVyOiAndHN4JywgLi4uKEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pIH0pO1xufVxuIiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gXCJlc2J1aWxkLXdhc21cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCwgTWVyZ2VTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFwiO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlRXJyb3IsIFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpblN0YXRpY1BhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljUGF0aDtcblxuICAgIGNvbnN0IHsgY29kZSwgZGVwZW5kZW5jaWVzLCBtYXAsIHNjcmlwdExhbmcgfSA9IGF3YWl0IHByZXByb2Nlc3MoZnVsbFBhdGgsIGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljUGF0aCk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmdWxsUGF0aC5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpO1xuICAgIGxldCBqczogYW55LCBjc3M6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBzdmVsdGUuY29tcGlsZShjb2RlLCB7XG4gICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgIGRldjogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHNvdXJjZW1hcDogbWFwLFxuICAgICAgICAgICAgY3NzOiBmYWxzZSxcbiAgICAgICAgICAgIGh5ZHJhdGFibGU6IHRydWUsXG4gICAgICAgICAgICBzdmVsdGVQYXRoOiAnL3NlcnYvc3ZlbHRlJ1xuICAgICAgICB9KTtcbiAgICAgICAgUHJpbnRTdmVsdGVXYXJuKG91dHB1dC53YXJuaW5ncywgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIGpzID0gb3V0cHV0LmpzO1xuICAgICAgICBjc3MgPSBvdXRwdXQuY3NzO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIFByaW50U3ZlbHRlRXJyb3IoZXJyLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRoaXNGaWxlOiAwXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICBjb25zdCBzb3VyY2VGaWxlQ2xpZW50ID0ganMubWFwLnNvdXJjZXNbMF0uc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYoaXNEZWJ1Zyl7XG4gICAgICAgIGpzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICB9XG5cbiAgICBpZiAoU29tZVBsdWdpbnMoXCJNaW5KU1wiKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShqcy5jb2RlLCB7XG4gICAgICAgICAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICAgICAgICAgIGxvYWRlcjogPGFueT5zY3JpcHRMYW5nLFxuICAgICAgICAgICAgICAgIHNvdXJjZW1hcDogaXNEZWJ1Z1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGpzLmNvZGUgPSBjb2RlO1xuICAgICAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgICAgIGpzLm1hcCA9IGF3YWl0IE1lcmdlU291cmNlTWFwKEpTT04ucGFyc2UobWFwKSwganMubWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhd2FpdCBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnIsIGpzLm1hcCwgZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAganMuY29kZSArPSB0b1VSTENvbW1lbnQoanMubWFwKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICAgICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5qcycsIGpzLmNvZGUpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5jc3MnLCBjc3MuY29kZSA/PyAnJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZXBlbmRlbmNpZXMsXG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59IiwgImltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyAgY3JlYXRlSW1wb3J0ZXIsIGdldFNhc3NFcnJvckxpbmUsIFByaW50U2Fzc0Vycm9yLCBzYXNzQW5kU291cmNlLCBzYXNzU3R5bGUsIHNhc3NTeW50YXggfSBmcm9tICcuLi8uLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3Nhc3MnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTdHlsZVNhc3MoaW5wdXRQYXRoOiBzdHJpbmcsIHR5cGU6IFwic2Fzc1wiIHwgXCJzY3NzXCIgfCBcImNzc1wiLCBpc0RlYnVnOiBib29sZWFuKTogUHJvbWlzZTx7IFtrZXk6IHN0cmluZ106IG51bWJlciB9PiB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpbnB1dFBhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGlucHV0UGF0aDtcblxuICAgIGNvbnN0IGRlcGVuZGVuY2VPYmplY3QgPSB7XG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGVEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSwgZmlsZURhdGFEaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNhc3MuY29tcGlsZVN0cmluZ0FzeW5jKGZpbGVEYXRhLCB7XG4gICAgICAgICAgICBzb3VyY2VNYXA6IGlzRGVidWcsXG4gICAgICAgICAgICBzeW50YXg6IHNhc3NTeW50YXgodHlwZSksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKHR5cGUsIFNvbWVQbHVnaW5zKSxcbiAgICAgICAgICAgIGxvZ2dlcjogc2Fzcy5Mb2dnZXIuc2lsZW50LFxuICAgICAgICAgICAgaW1wb3J0ZXI6IGNyZWF0ZUltcG9ydGVyKGZ1bGxQYXRoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdD8ubG9hZGVkVXJscykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHJlc3VsdC5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jZU9iamVjdFtCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKV0gPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhID0gcmVzdWx0LmNzcztcblxuICAgICAgICBpZiAoaXNEZWJ1ZyAmJiByZXN1bHQuc291cmNlTWFwKSB7XG4gICAgICAgICAgICBzYXNzQW5kU291cmNlKHJlc3VsdC5zb3VyY2VNYXAsIHBhdGhUb0ZpbGVVUkwoZmlsZURhdGEpLmhyZWYpO1xuICAgICAgICAgICAgcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzID0gcmVzdWx0LnNvdXJjZU1hcC5zb3VyY2VzLm1hcCh4ID0+IHBhdGgucmVsYXRpdmUoZmlsZURhdGFEaXJuYW1lLCBmaWxlVVJMVG9QYXRoKHgpKSArICc/c291cmNlPXRydWUnKTtcblxuICAgICAgICAgICAgZGF0YSArPSBgXFxyXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkocmVzdWx0LnNvdXJjZU1hcCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfSovYDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGlucHV0UGF0aCwgZ2V0VHlwZXMuU3RhdGljWzFdKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBQcmludFNhc3NFcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlcGVuZGVuY2VPYmplY3Rcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGlyZW50IH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgSW5zZXJ0LCBDb21wb25lbnRzLCBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgQ2xlYXJXYXJuaW5nIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnXG5pbXBvcnQgKiBhcyBTZWFyY2hGaWxlU3lzdGVtIGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgUmVxU2NyaXB0IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgU3RhdGljRmlsZXMgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gJy4vQ29tcGlsZVN0YXRlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzJztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCB7IGNyZWF0ZVNpdGVNYXAgfSBmcm9tICcuL1NpdGVNYXAnO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSwgUmVtb3ZlRW5kVHlwZSB9IGZyb20gJy4vRmlsZVR5cGVzJztcbmltcG9ydCB7IHBlckNvbXBpbGUsIHBvc3RDb21waWxlLCBwZXJDb21waWxlUGFnZSwgcG9zdENvbXBpbGVQYWdlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2NyaXB0VGVtcGxhdGUnO1xuXG5hc3luYyBmdW5jdGlvbiBjb21waWxlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBpc0RlYnVnPzogYm9vbGVhbiwgaGFzU2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nKSB7XG4gICAgY29uc3QgRnVsbEZpbGVQYXRoID0gcGF0aC5qb2luKGFycmF5VHlwZVswXSwgZmlsZVBhdGgpLCBGdWxsUGF0aENvbXBpbGUgPSBhcnJheVR5cGVbMV0gKyBmaWxlUGF0aCArICcuY2pzJztcblxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoRnVsbEZpbGVQYXRoLCAndXRmOCcpO1xuICAgIGNvbnN0IEV4Y2x1VXJsID0gKG5lc3RlZFBhZ2UgPyBuZXN0ZWRQYWdlICsgJzxsaW5lPicgOiAnJykgKyBhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aDtcblxuICAgIGNvbnN0IHNlc3Npb25JbmZvID0gaGFzU2Vzc2lvbkluZm8gPz8gbmV3IFNlc3Npb25CdWlsZChhcnJheVR5cGVbMl0gKyAnLycgKyBmaWxlUGF0aCwgRnVsbEZpbGVQYXRoLCBhcnJheVR5cGVbMl0sIGlzRGVidWcsIEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSk7XG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZSgndGhpc1BhZ2UnLCBGdWxsRmlsZVBhdGgpO1xuXG4gICAgYXdhaXQgcGVyQ29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm8sIEZ1bGxQYXRoQ29tcGlsZSk7XG4gICAgY29uc3QgQ29tcGlsZWREYXRhID0gYXdhaXQgSW5zZXJ0KGh0bWwsIEZ1bGxQYXRoQ29tcGlsZSwgQm9vbGVhbihuZXN0ZWRQYWdlKSwgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBhd2FpdCBwb3N0Q29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm8sIEZ1bGxQYXRoQ29tcGlsZSk7XG5cbiAgICBpZiAoIW5lc3RlZFBhZ2UpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShGdWxsUGF0aENvbXBpbGUsIENvbXBpbGVkRGF0YS5TdHJpbmdXaXRoVGFjayhGdWxsUGF0aENvbXBpbGUpKTtcbiAgICAgICAgcGFnZURlcHMudXBkYXRlKFJlbW92ZUVuZFR5cGUoRXhjbHVVcmwpLCBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIHJldHVybiB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm8gfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRmlsZXNJbkZvbGRlcihhcnJheVR5cGU6IHN0cmluZ1tdLCBwYXRoOiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKGFycmF5VHlwZVswXSArIHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMubWtkaXIoYXJyYXlUeXBlWzFdICsgY29ubmVjdCk7XG4gICAgICAgICAgICBhd2FpdCBGaWxlc0luRm9sZGVyKGFycmF5VHlwZSwgY29ubmVjdCArICcvJywgc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoU2VhcmNoRmlsZVN5c3RlbS5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgICAgICBpZiAoYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKGFycmF5VHlwZVsyXSArICcvJyArIGNvbm5lY3QpKSAvL2NoZWNrIGlmIG5vdCBhbHJlYWR5IGNvbXBpbGUgZnJvbSBhICdpbi1maWxlJyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbXBpbGVGaWxlKGNvbm5lY3QsIGFycmF5VHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJheVR5cGUgPT0gU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShTZWFyY2hGaWxlU3lzdGVtLkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFJlcVNjcmlwdCgnUHJvZHVjdGlvbiBMb2FkZXIgLSAnICsgYXJyYXlUeXBlWzJdLCBjb25uZWN0LCBhcnJheVR5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBTdGF0aWNGaWxlcyhjb25uZWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVTY3JpcHRzKHNjcmlwdHM6IHN0cmluZ1tdKSB7XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgYXdhaXQgUmVxU2NyaXB0KCdQcm9kdWN0aW9uIExvYWRlcicsIHBhdGgsIFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljLCBmYWxzZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBDcmVhdGVDb21waWxlKHQ6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHR5cGVzID0gU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlc1t0XTtcbiAgICBhd2FpdCBTZWFyY2hGaWxlU3lzdGVtLkRlbGV0ZUluRGlyZWN0b3J5KHR5cGVzWzFdKTtcbiAgICByZXR1cm4gKCkgPT4gRmlsZXNJbkZvbGRlcih0eXBlcywgJycsIHN0YXRlKTtcbn1cblxuLyoqXG4gKiB3aGVuIHBhZ2UgY2FsbCBvdGhlciBwYWdlO1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGVJbkZpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBzZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgbmVzdGVkUGFnZT86IHN0cmluZywgbmVzdGVkUGFnZURhdGE/OiBzdHJpbmcpIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGgsIGFycmF5VHlwZVsxXSk7XG4gICAgcmV0dXJuIGF3YWl0IGNvbXBpbGVGaWxlKHBhdGgsIGFycmF5VHlwZSwgdHJ1ZSwgc2Vzc2lvbkluZm8sIG5lc3RlZFBhZ2UsIG5lc3RlZFBhZ2VEYXRhKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSkge1xuICAgIGF3YWl0IEZhc3RDb21waWxlSW5GaWxlKHBhdGgsIGFycmF5VHlwZSk7XG4gICAgQ2xlYXJXYXJuaW5nKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlQWxsKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MpIHtcbiAgICBsZXQgc3RhdGUgPSAhYXJndi5pbmNsdWRlcygncmVidWlsZCcpICYmIGF3YWl0IENvbXBpbGVTdGF0ZS5jaGVja0xvYWQoKVxuXG4gICAgaWYgKHN0YXRlKSByZXR1cm4gKCkgPT4gUmVxdWlyZVNjcmlwdHMoc3RhdGUuc2NyaXB0cylcbiAgICBwYWdlRGVwcy5jbGVhcigpO1xuICAgIFxuICAgIHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpXG5cbiAgICBwZXJDb21waWxlKCk7XG5cbiAgICBjb25zdCBhY3RpdmF0ZUFycmF5ID0gW2F3YWl0IENyZWF0ZUNvbXBpbGUoU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5TdGF0aWNbMl0sIHN0YXRlKSwgYXdhaXQgQ3JlYXRlQ29tcGlsZShTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLkxvZ3NbMl0sIHN0YXRlKSwgQ2xlYXJXYXJuaW5nXTtcblxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhY3RpdmF0ZUFycmF5KSB7XG4gICAgICAgICAgICBhd2FpdCBpKCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY3JlYXRlU2l0ZU1hcChFeHBvcnQsIHN0YXRlKTtcbiAgICAgICAgc3RhdGUuZXhwb3J0KClcbiAgICAgICAgcG9zdENvbXBpbGUoKVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGdldFNldHRpbmdzRGF0ZSB9IGZyb20gXCIuLi9NYWluQnVpbGQvSW1wb3J0TW9kdWxlXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbnR5cGUgQ1N0YXRlID0ge1xuICAgIHVwZGF0ZTogbnVtYmVyXG4gICAgcGFnZUFycmF5OiBzdHJpbmdbXVtdLFxuICAgIGltcG9ydEFycmF5OiBzdHJpbmdbXVxuICAgIGZpbGVBcnJheTogc3RyaW5nW11cbn1cblxuLyogVGhpcyBjbGFzcyBpcyB1c2VkIHRvIHN0b3JlIHRoZSBzdGF0ZSBvZiB0aGUgcHJvamVjdCAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZVN0YXRlIHtcbiAgICBwcml2YXRlIHN0YXRlOiBDU3RhdGUgPSB7IHVwZGF0ZTogMCwgcGFnZUFycmF5OiBbXSwgaW1wb3J0QXJyYXk6IFtdLCBmaWxlQXJyYXk6IFtdIH1cbiAgICBzdGF0aWMgZmlsZVBhdGggPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgXCJDb21waWxlU3RhdGUuanNvblwiKVxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnVwZGF0ZSA9IGdldFNldHRpbmdzRGF0ZSgpXG4gICAgfVxuXG4gICAgZ2V0IHNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmltcG9ydEFycmF5XG4gICAgfVxuXG4gICAgZ2V0IHBhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5wYWdlQXJyYXlcbiAgICB9XG5cbiAgICBnZXQgZmlsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmZpbGVBcnJheVxuICAgIH1cblxuICAgIGFkZFBhZ2UocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnBhZ2VBcnJheS5maW5kKHggPT4geFswXSA9PSBwYXRoICYmIHhbMV0gPT0gdHlwZSkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBhZ2VBcnJheS5wdXNoKFtwYXRoLCB0eXBlXSlcbiAgICB9XG5cbiAgICBhZGRJbXBvcnQocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGFkZEZpbGUocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5maWxlQXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZpbGVBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUoQ29tcGlsZVN0YXRlLmZpbGVQYXRoLCB0aGlzLnN0YXRlKVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjaGVja0xvYWQoKSB7XG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5maWxlUGF0aCkpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpXG4gICAgICAgIHN0YXRlLnN0YXRlID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZpbGVQYXRoKVxuXG4gICAgICAgIGlmIChzdGF0ZS5zdGF0ZS51cGRhdGUgIT0gZ2V0U2V0dGluZ3NEYXRlKCkpIHJldHVyblxuXG4gICAgICAgIHJldHVybiBzdGF0ZVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgSW1wb3J0RmlsZSwge0FkZEV4dGVuc2lvbiwgUmVxdWlyZU9uY2V9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge3ByaW50fSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gU3RhcnRSZXF1aXJlKGFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGFycmF5RnVuY1NlcnZlciA9IFtdO1xuICAgIGZvciAobGV0IGkgb2YgYXJyYXkpIHtcbiAgICAgICAgaSA9IEFkZEV4dGVuc2lvbihpKTtcblxuICAgICAgICBjb25zdCBiID0gYXdhaXQgSW1wb3J0RmlsZSgncm9vdCBmb2xkZXIgKFdXVyknLCBpLCBnZXRUeXBlcy5TdGF0aWMsIGlzRGVidWcpO1xuICAgICAgICBpZiAoYiAmJiB0eXBlb2YgYi5TdGFydFNlcnZlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhcnJheUZ1bmNTZXJ2ZXIucHVzaChiLlN0YXJ0U2VydmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByaW50LmxvZyhgQ2FuJ3QgZmluZCBTdGFydFNlcnZlciBmdW5jdGlvbiBhdCBtb2R1bGUgLSAke2l9XFxuYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXlGdW5jU2VydmVyO1xufVxuXG5sZXQgbGFzdFNldHRpbmdzSW1wb3J0OiBudW1iZXI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0U2V0dGluZ3MoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbil7XG4gICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGggKyAnLnRzJykpe1xuICAgICAgICBmaWxlUGF0aCArPSAnLnRzJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlUGF0aCArPSAnLmpzJ1xuICAgIH1cbiAgICBjb25zdCBjaGFuZ2VUaW1lID0gPGFueT5hd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKVxuXG4gICAgaWYoY2hhbmdlVGltZSA9PSBsYXN0U2V0dGluZ3NJbXBvcnQgfHwgIWNoYW5nZVRpbWUpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIFxuICAgIGxhc3RTZXR0aW5nc0ltcG9ydCA9IGNoYW5nZVRpbWU7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IFJlcXVpcmVPbmNlKGZpbGVQYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gZGF0YS5kZWZhdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGluZ3NEYXRlKCl7XG4gICAgcmV0dXJuIGxhc3RTZXR0aW5nc0ltcG9ydFxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSB9IGZyb20gXCIuLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSBcIi4uL01haW5CdWlsZC9TZXR0aW5nc1R5cGVzXCI7XG5pbXBvcnQgRWFzeUZzLCB7IERpcmVudCB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCBDb21waWxlU3RhdGUgZnJvbSBcIi4vQ29tcGlsZVN0YXRlXCI7XG5pbXBvcnQgeyBpc0ZpbGVUeXBlIH0gZnJvbSBcIi4vRmlsZVR5cGVzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxuYXN5bmMgZnVuY3Rpb24gRmlsZXNJbkZvbGRlcihhcnJheVR5cGU6IHN0cmluZ1tdLCBwYXRoOiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKGFycmF5VHlwZVswXSArIHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IHByb21pc2VzID1bXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChGaWxlc0luRm9sZGVyKGFycmF5VHlwZSwgY29ubmVjdCArICcvJywgc3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJheVR5cGUgPT0gZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzY2FuRmlsZXMoKXtcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuU3RhdGljLCAnJywgc3RhdGUpLFxuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLkxvZ3MsICcnLCBzdGF0ZSlcbiAgICBdKVxuICAgIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlYnVnU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKXtcbiAgICByZXR1cm4gY3JlYXRlU2l0ZU1hcChFeHBvcnQsIGF3YWl0IHNjYW5GaWxlcygpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IHsgcm91dGluZywgZGV2ZWxvcG1lbnQgfSA9IEV4cG9ydDtcbiAgICBpZiAoIXJvdXRpbmcuc2l0ZW1hcCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2l0ZW1hcCA9IHJvdXRpbmcuc2l0ZW1hcCA9PT0gdHJ1ZSA/IHt9IDogcm91dGluZy5zaXRlbWFwO1xuICAgIE9iamVjdC5hc3NpZ24oc2l0ZW1hcCwge1xuICAgICAgICBydWxlczogdHJ1ZSxcbiAgICAgICAgdXJsU3RvcDogZmFsc2UsXG4gICAgICAgIGVycm9yUGFnZXM6IGZhbHNlLFxuICAgICAgICB2YWxpZFBhdGg6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhZ2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgdXJsczogLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgXG4gICAgZm9yIChsZXQgW3VybCwgdHlwZV0gb2Ygc3RhdGUucGFnZXMpIHtcblxuICAgICAgICBpZih0eXBlICE9IGdldFR5cGVzLlN0YXRpY1syXSB8fCAhdXJsLmVuZHNXaXRoKCcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdXJsID0gJy8nICsgdXJsLnN1YnN0cmluZygwLCB1cmwubGVuZ3RoIC0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZS5sZW5ndGggLSAxKTtcblxuICAgICAgICBpZihwYXRoLmV4dG5hbWUodXJsKSA9PSAnLnNlcnYnKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudXJsU3RvcCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcudXJsU3RvcCkge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBwYXRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaXRlbWFwLnJ1bGVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy5ydWxlcykge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhd2FpdCByb3V0aW5nLnJ1bGVzW3BhdGhdKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChlbmRzID0+IHVybC5lbmRzV2l0aCgnLicrZW5kcykpIHx8XG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoc3RhcnQgPT4gdXJsLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICApXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiByb3V0aW5nLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgICAgIGlmICghYXdhaXQgZnVuYyh1cmwpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSB1cmxzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzaXRlbWFwLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXJyb3IgaW4gcm91dGluZy5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9ICcvJyArIHJvdXRpbmcuZXJyb3JQYWdlc1tlcnJvcl0ucGF0aDtcblxuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSB1cmxzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYWdlcy5wdXNoKHVybCk7XG4gICAgfVxuXG4gICAgbGV0IHdyaXRlID0gdHJ1ZTtcbiAgICBpZiAoc2l0ZW1hcC5maWxlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVBY3Rpb24gPSBhd2FpdCBJbXBvcnRGaWxlKCdTaXRlbWFwIEltcG9ydCcsIHNpdGVtYXAuZmlsZSwgZ2V0VHlwZXMuU3RhdGljLCBkZXZlbG9wbWVudCk7XG4gICAgICAgIGlmKCFmaWxlQWN0aW9uPy5TaXRlbWFwKXtcbiAgICAgICAgICAgIGR1bXAud2FybignXFwnU2l0ZW1hcFxcJyBmdW5jdGlvbiBub3QgZm91bmQgb24gZmlsZSAtPiAnKyBzaXRlbWFwLmZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3JpdGUgPSBhd2FpdCBmaWxlQWN0aW9uLlNpdGVtYXAocGFnZXMsIHN0YXRlLCBFeHBvcnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYod3JpdGUgJiYgcGFnZXMubGVuZ3RoKXtcbiAgICAgICAgY29uc3QgcGF0aCA9IHdyaXRlID09PSB0cnVlID8gJ3NpdGVtYXAudHh0Jzogd3JpdGU7XG4gICAgICAgIHN0YXRlLmFkZEZpbGUocGF0aCk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZ2V0VHlwZXMuU3RhdGljWzBdICsgcGF0aCwgcGFnZXMuam9pbignXFxuJykpO1xuICAgIH1cbn0iLCAiLyoqXG4gKiBDaGVjayBpZiB0aGUgZmlsZSBuYW1lIGVuZHMgd2l0aCBvbmUgb2YgdGhlIGdpdmVuIGZpbGUgdHlwZXMuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlcyAtIGFuIGFycmF5IG9mIGZpbGUgZXh0ZW5zaW9ucyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpbGVUeXBlKHR5cGVzOiBzdHJpbmdbXSwgbmFtZTogc3RyaW5nKSB7XG4gICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgICBpZiAobmFtZS5lbmRzV2l0aCgnLicgKyB0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGFzdCBkb3QgYW5kIGV2ZXJ5dGhpbmcgYWZ0ZXIgaXQgZnJvbSBhIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgdG8gcmVtb3ZlIHRoZSBlbmQgdHlwZSBmcm9tLlxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRob3V0IHRoZSBsYXN0IGNoYXJhY3Rlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJlbW92ZUVuZFR5cGUoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59IiwgImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBGaWxlcyB9IGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5cbmNvbnN0IEV4cG9ydCA9IHtcbiAgICBQYWdlTG9hZFJhbToge30sXG4gICAgUGFnZVJhbTogdHJ1ZVxufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIHR5cGVBcnJheSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGggdG8gdGhlXG4gKiBmaWxlLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBkaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHthbnl9IERhdGFPYmplY3QgLSBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVBhZ2UoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIERhdGFPYmplY3Q6IGFueSkge1xuICAgIGNvbnN0IFJlcUZpbGVQYXRoID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuICAgIGNvbnN0IHJlc01vZGVsID0gKCkgPT4gUmVxRmlsZVBhdGgubW9kZWwoRGF0YU9iamVjdCk7XG5cbiAgICBsZXQgZmlsZUV4aXN0czogYm9vbGVhbjtcblxuICAgIGlmIChSZXFGaWxlUGF0aCkge1xuICAgICAgICBpZiAoIURhdGFPYmplY3QuaXNEZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuXG4gICAgICAgIGlmIChSZXFGaWxlUGF0aC5kYXRlID09IC0xKSB7XG4gICAgICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoUmVxRmlsZVBhdGgucGF0aCk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUV4aXN0cylcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYgKCFleHRuYW1lKSB7XG4gICAgICAgIGV4dG5hbWUgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICBmaWxlUGF0aCArPSAnLicgKyBleHRuYW1lO1xuICAgIH1cblxuICAgIGxldCBmdWxsUGF0aDogc3RyaW5nO1xuICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzFdID09ICcvJylcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGVQYXRoKVxuICAgIH0gZWxzZVxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIGZpbGVQYXRoKTtcblxuICAgIGlmICghW0Jhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudF0uaW5jbHVkZXMoZXh0bmFtZSkpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0VGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIERhdGFPYmplY3Qud3JpdGUoaW1wb3J0VGV4dCk7XG4gICAgICAgIHJldHVybiBpbXBvcnRUZXh0O1xuICAgIH1cblxuICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKTtcbiAgICBpZiAoIWZpbGVFeGlzdHMpIHtcbiAgICAgICAgY29uc3QgW2Z1bmNOYW1lLCBwcmludFRleHRdID0gY3JlYXRlTmV3UHJpbnQoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtjb3B5UGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgfSk7XG4gICAgICAgIHByaW50W2Z1bmNOYW1lXShwcmludFRleHQpO1xuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiAoKSA9PiB7IH0sIGRhdGU6IC0xLCBwYXRoOiBmdWxsUGF0aCB9O1xuICAgICAgICByZXR1cm4gTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IEZvclNhdmVQYXRoID0gdHlwZUFycmF5WzJdICsgJy8nICsgZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIGV4dG5hbWUubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgcmVCdWlsZCA9IERhdGFPYmplY3QuaXNEZWJ1ZyAmJiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHR5cGVBcnJheVsxXSArIGZpbGVQYXRoICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoRm9yU2F2ZVBhdGgpKTtcblxuICAgIGlmIChyZUJ1aWxkKVxuICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZShmaWxlUGF0aCwgdHlwZUFycmF5KTtcblxuXG4gICAgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0gJiYgIXJlQnVpbGQpIHtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogRXhwb3J0LlBhZ2VMb2FkUmFtW0ZvclNhdmVQYXRoXVswXSB9O1xuICAgICAgICByZXR1cm4gYXdhaXQgTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsKERhdGFPYmplY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bmMgPSBhd2FpdCBMb2FkUGFnZShGb3JTYXZlUGF0aCwgZXh0bmFtZSk7XG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKSB7XG4gICAgICAgIGlmICghRXhwb3J0LlBhZ2VMb2FkUmFtW0ZvclNhdmVQYXRoXSkge1xuICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW0ZvclNhdmVQYXRoXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF1bMF0gPSBmdW5jO1xuICAgIH1cblxuICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGZ1bmMgfTtcbiAgICByZXR1cm4gYXdhaXQgZnVuYyhEYXRhT2JqZWN0KTtcbn1cblxuY29uc3QgR2xvYmFsVmFyID0ge307XG5cbmZ1bmN0aW9uIGdldEZ1bGxQYXRoQ29tcGlsZSh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgcmV0dXJuIHR5cGVBcnJheVsxXSArIFNwbGl0SW5mb1sxXSArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSArICcuY2pzJztcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgcGFnZSB0byBsb2FkLlxuICogQHBhcmFtIGV4dCAtIFRoZSBleHRlbnNpb24gb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2UodXJsOiBzdHJpbmcsIGV4dCA9IEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcblxuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgY29uc3QgTGFzdFJlcXVpcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIF9yZXF1aXJlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlRmlsZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luY2x1ZGUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcsIFdpdGhPYmplY3QgPSB7fSkge1xuICAgICAgICByZXR1cm4gUmVxdWlyZVBhZ2UocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCB7IC4uLldpdGhPYmplY3QsIC4uLkRhdGFPYmplY3QgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3RyYW5zZmVyKHA6IHN0cmluZywgcHJlc2VydmVGb3JtOiBib29sZWFuLCB3aXRoT2JqZWN0OiBhbnksIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSkge1xuICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgPSAnJztcblxuICAgICAgICBpZiAoIXByZXNlcnZlRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgcG9zdERhdGEgPSBEYXRhT2JqZWN0LlJlcXVlc3QuYm9keSA/IHt9IDogbnVsbDtcbiAgICAgICAgICAgIERhdGFPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgLi4uRGF0YU9iamVjdCxcbiAgICAgICAgICAgICAgICBSZXF1ZXN0OiB7IC4uLkRhdGFPYmplY3QuUmVxdWVzdCwgZmlsZXM6IHt9LCBxdWVyeToge30sIGJvZHk6IHBvc3REYXRhIH0sXG4gICAgICAgICAgICAgICAgUG9zdDogcG9zdERhdGEsIFF1ZXJ5OiB7fSwgRmlsZXM6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBEYXRhT2JqZWN0LCBwLCB3aXRoT2JqZWN0KTtcblxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIFNwbGl0SW5mb1sxXSArIFwiLlwiICsgZXh0ICsgJy5janMnKTtcbiAgICBjb25zdCBwcml2YXRlX3ZhciA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoY29tcGlsZWRQYXRoKTtcblxuICAgICAgICByZXR1cm4gTXlNb2R1bGUoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnN0IGRlYnVnX19maWxlbmFtZSA9IHVybCArIFwiLlwiICsgZXh0O1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHBhdGggLT4gXCIsIGRlYnVnX19maWxlbmFtZSwgXCItPlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICBwcmludC5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgcmV0dXJuIChEYXRhT2JqZWN0OiBhbnkpID0+IERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCArPSBgPGRpdiBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+PHA+RXJyb3IgcGF0aDogJHtkZWJ1Z19fZmlsZW5hbWV9PC9wPjxwPkVycm9yIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfTwvcD48L2Rpdj5gO1xuICAgIH1cbn1cbi8qKlxuICogSXQgdGFrZXMgYSBmdW5jdGlvbiB0aGF0IHByZXBhcmUgYSBwYWdlLCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgbG9hZHMgYSBwYWdlXG4gKiBAcGFyYW0gTG9hZFBhZ2VGdW5jIC0gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGluIGEgcGFnZSB0byBleGVjdXRlIG9uXG4gKiBAcGFyYW0ge3N0cmluZ30gcnVuX3NjcmlwdF9uYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjcmlwdCB0byBydW4uXG4gKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKi9cblxuZnVuY3Rpb24gQnVpbGRQYWdlKExvYWRQYWdlRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiB2b2lkLCBydW5fc2NyaXB0X25hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IFBhZ2VWYXIgPSB7fTtcblxuICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKFJlc3BvbnNlOiBSZXNwb25zZSwgUmVxdWVzdDogUmVxdWVzdCwgUG9zdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IG51bGwsIFF1ZXJ5OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBDb29raWVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBTZXNzaW9uOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBGaWxlczogRmlsZXMsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgb3V0X3J1bl9zY3JpcHQgPSB7IHRleHQ6ICcnIH07XG5cbiAgICAgICAgZnVuY3Rpb24gVG9TdHJpbmdJbmZvKHN0cjogYW55KSB7XG4gICAgICAgICAgICBjb25zdCBhc1N0cmluZyA9IHN0cj8udG9TdHJpbmc/LigpO1xuICAgICAgICAgICAgaWYgKGFzU3RyaW5nID09IG51bGwgfHwgYXNTdHJpbmcuc3RhcnRzV2l0aCgnW29iamVjdCBPYmplY3RdJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RyLCBudWxsLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhc1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJlc3BvbnNlKHRleHQ6IGFueSkge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCA9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQgPSAnJykge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGVTYWZlKHN0ciA9ICcnKSB7XG4gICAgICAgICAgICBzdHIgPSBUb1N0cmluZ0luZm8oc3RyKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIHN0cikge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyYjJyArIGkuY2hhckNvZGVBdCgwKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVjaG8oYXJyOiBzdHJpbmdbXSwgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIHdyaXRlU2FmZShwYXJhbXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFyci5hdCgtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVkaXJlY3RQYXRoOiBhbnkgPSBmYWxzZTtcblxuICAgICAgICBSZXNwb25zZS5yZWRpcmVjdCA9IChwYXRoOiBzdHJpbmcsIHN0YXR1cz86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0gU3RyaW5nKHBhdGgpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzKHN0YXR1cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBSZXNwb25zZTtcbiAgICAgICAgfTtcblxuICAgICAgICAoPGFueT5SZXNwb25zZSkucmVsb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QoUmVxdWVzdC51cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VuZEZpbGUoZmlsZVBhdGgsIGRlbGV0ZUFmdGVyID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IHsgZmlsZTogZmlsZVBhdGgsIGRlbGV0ZUFmdGVyIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBEYXRhU2VuZCA9IHtcbiAgICAgICAgICAgIHNlbmRGaWxlLFxuICAgICAgICAgICAgd3JpdGVTYWZlLFxuICAgICAgICAgICAgd3JpdGUsXG4gICAgICAgICAgICBlY2hvLFxuICAgICAgICAgICAgc2V0UmVzcG9uc2UsXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdCxcbiAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFBvc3QsXG4gICAgICAgICAgICBRdWVyeSxcbiAgICAgICAgICAgIFNlc3Npb24sXG4gICAgICAgICAgICBGaWxlcyxcbiAgICAgICAgICAgIENvb2tpZXMsXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgUGFnZVZhcixcbiAgICAgICAgICAgIEdsb2JhbFZhcixcbiAgICAgICAgICAgIGNvZGViYXNlOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgTG9hZFBhZ2VGdW5jKERhdGFTZW5kKTtcblxuICAgICAgICByZXR1cm4geyBvdXRfcnVuX3NjcmlwdDogb3V0X3J1bl9zY3JpcHQudGV4dCwgcmVkaXJlY3RQYXRoIH1cbiAgICB9KVxufVxuXG5leHBvcnQgeyBMb2FkUGFnZSwgQnVpbGRQYWdlLCBnZXRGdWxsUGF0aENvbXBpbGUsIEV4cG9ydCwgU3BsaXRGaXJzdCB9O1xuIiwgImltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEltcG9ydEZpbGUsIEFkZEV4dGVuc2lvbiB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQgeyBjcmVhdGVOZXdQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcblxudHlwZSBSZXF1aXJlRmlsZXMgPSB7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgc3RhdHVzPzogbnVtYmVyXG4gICAgbW9kZWw6IGFueVxuICAgIGRlcGVuZGVuY2llcz86IFN0cmluZ0FueU1hcFxuICAgIHN0YXRpYz86IGJvb2xlYW5cbn1cblxuY29uc3QgQ2FjaGVSZXF1aXJlRmlsZXMgPSB7fTtcblxuLyoqXG4gKiBJdCBtYWtlcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gZGVwZW5kZW5jaWVzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgYXJyYXkgb2YgYmFzZSBwYXRoc1xuICogQHBhcmFtIFtiYXNlUGF0aF0gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGNvbXBpbGVkLlxuICogQHBhcmFtIGNhY2hlIC0gQSBjYWNoZSBvZiB0aGUgbGFzdCB0aW1lIGEgZmlsZSB3YXMgbW9kaWZpZWQuXG4gKiBAcmV0dXJucyBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBTdHJpbmdBbnlNYXAsIHR5cGVBcnJheTogc3RyaW5nW10sIGJhc2VQYXRoID0gJycsIGNhY2hlID0ge30pIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNYXA6IFN0cmluZ0FueU1hcCA9IHt9O1xuICAgIGNvbnN0IHByb21pc2VBbGwgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgcHJvbWlzZUFsbC5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGggPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgICAgIGlmICghY2FjaGVbYmFzZVBhdGhdKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlUGF0aF0gPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBiYXNlUGF0aCwgJ210aW1lTXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbJ3RoaXNGaWxlJ10gPSBjYWNoZVtiYXNlUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFtmaWxlUGF0aF0gPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKDxhbnk+dmFsdWUsIHR5cGVBcnJheSwgZmlsZVBhdGgsIGNhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICApKCkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VBbGwpO1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNYXA7XG59XG5cbi8qKlxuICogSWYgdGhlIG9sZCBkZXBlbmRlbmNpZXMgYW5kIHRoZSBuZXcgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZSwgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmN5IG1hcC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkZXBlbmRlbmN5IHRyZWVzLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIHRoZSBtb2R1bGVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBbcGFyZW50XSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJlbnQgbW9kdWxlLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLiBFYWNoIHN0cmluZyByZXByZXNlbnRzIGEgY2hhbmdlIGluIHRoZSBkZXBlbmRlbmN5XG4gKiB0cmVlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VBcnJheShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCwgcGFyZW50ID0gJycpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgY2hhbmdlQXJyYXkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW5ld0RlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGdldENoYW5nZUFycmF5KG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0sIG5hbWUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaCguLi5jaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZUFycmF5O1xufVxuXG4vKipcbiAqIEl0IGltcG9ydHMgYSBmaWxlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIHBhdGhzIHR5cGVzLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBtYXAgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuXG4gKiBAcmV0dXJucyBUaGUgbW9kZWwgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogUmVxdWlyZUZpbGVzIH0sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBSZXFGaWxlID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IG51bWJlciwgbmV3RGVwczogU3RyaW5nQW55TWFwO1xuICAgIGlmIChSZXFGaWxlKSB7XG5cbiAgICAgICAgaWYgKCFpc0RlYnVnIHx8IGlzRGVidWcgJiYgKFJlcUZpbGUuc3RhdHVzID09IC0xKSlcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBSZXFGaWxlLnBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG5cbiAgICAgICAgICAgIG5ld0RlcHMgPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpO1xuXG4gICAgICAgICAgICBpZiAoY29tcGFyZURlcGVuZGVuY2llc1NhbWUoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoUmVxRmlsZS5zdGF0dXMgPT0gMClcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IHN0YXRpY19tb2R1bGVzID0gZmFsc2U7XG5cbiAgICBpZiAoIVJlcUZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJykge1xuXG4gICAgICAgICAgICBpZiAoZmlsZVBhdGhbMV0gPT0gJy8nKVxuICAgICAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xuXG4gICAgICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSwgX19kaXJuYW1lKSwgZmlsZVBhdGgpO1xuICAgICAgICB9IGVsc2UgaWYgKGZpbGVQYXRoWzBdICE9ICcvJylcbiAgICAgICAgICAgIHN0YXRpY19tb2R1bGVzID0gdHJ1ZTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoID0gUmVxRmlsZS5wYXRoO1xuICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IFJlcUZpbGUuc3RhdGljO1xuICAgIH1cblxuICAgIGlmIChzdGF0aWNfbW9kdWxlcylcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgQWxpYXNPclBhY2thZ2UoY29weVBhdGgpLCBzdGF0dXM6IC0xLCBzdGF0aWM6IHRydWUsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGFkZCBzZXJ2LmpzIG9yIHNlcnYudHMgaWYgbmVlZGVkXG4gICAgICAgIGZpbGVQYXRoID0gQWRkRXh0ZW5zaW9uKGZpbGVQYXRoKTtcblxuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHR5cGVBcnJheVswXSArIGZpbGVQYXRoO1xuICAgICAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcblxuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgaGF2ZU1vZGVsID0gQ2FjaGVSZXF1aXJlRmlsZXNbZmlsZVBhdGhdO1xuICAgICAgICAgICAgaWYgKGhhdmVNb2RlbCAmJiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzID0gbmV3RGVwcyA/PyBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSkpKVxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IGhhdmVNb2RlbDtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0RlcHMgPSBuZXdEZXBzID8/IHt9O1xuXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgSW1wb3J0RmlsZShfX2ZpbGVuYW1lLCBmaWxlUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnLCBuZXdEZXBzLCBoYXZlTW9kZWwgJiYgZ2V0Q2hhbmdlQXJyYXkoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcykpLCBkZXBlbmRlbmNpZXM6IG5ld0RlcHMsIHBhdGg6IGZpbGVQYXRoIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IHt9LCBzdGF0dXM6IDAsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2ZpbGVQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWx0TW9kZWwgPSBMYXN0UmVxdWlyZVtjb3B5UGF0aF07XG4gICAgQ2FjaGVSZXF1aXJlRmlsZXNbYnVpbHRNb2RlbC5wYXRoXSA9IGJ1aWx0TW9kZWw7XG5cbiAgICByZXR1cm4gYnVpbHRNb2RlbC5tb2RlbDtcbn0iLCAiaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgdHJpbVR5cGUsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8vIC0tIHN0YXJ0IG9mIGZldGNoIGZpbGUgKyBjYWNoZSAtLVxuXG50eXBlIGFwaUluZm8gPSB7XG4gICAgcGF0aFNwbGl0OiBudW1iZXIsXG4gICAgZGVwc01hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfVxufVxuXG5jb25zdCBhcGlTdGF0aWNNYXA6IHsgW2tleTogc3RyaW5nXTogYXBpSW5mbyB9ID0ge307XG5cbi8qKlxuICogR2l2ZW4gYSB1cmwsIHJldHVybiB0aGUgc3RhdGljIHBhdGggYW5kIGRhdGEgaW5mbyBpZiB0aGUgdXJsIGlzIGluIHRoZSBzdGF0aWMgbWFwXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHRoZSB1c2VyIGlzIHJlcXVlc3RpbmcuXG4gKiBAcGFyYW0ge251bWJlcn0gcGF0aFNwbGl0IC0gdGhlIG51bWJlciBvZiBzbGFzaGVzIGluIHRoZSB1cmwuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICovXG5mdW5jdGlvbiBnZXRBcGlGcm9tTWFwKHVybDogc3RyaW5nLCBwYXRoU3BsaXQ6IG51bWJlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcGlTdGF0aWNNYXApO1xuICAgIGZvciAoY29uc3QgaSBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IGUgPSBhcGlTdGF0aWNNYXBbaV07XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSAmJiBlLnBhdGhTcGxpdCA9PSBwYXRoU3BsaXQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXRpY1BhdGg6IGksXG4gICAgICAgICAgICAgICAgZGF0YUluZm86IGVcbiAgICAgICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIEFQSSBmaWxlIGZvciBhIGdpdmVuIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIEFQSS5cbiAqIEByZXR1cm5zIFRoZSBwYXRoIHRvIHRoZSBBUEkgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZmluZEFwaVBhdGgodXJsOiBzdHJpbmcpIHtcblxuICAgIHdoaWxlICh1cmwubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UGF0aCA9IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMF0sIHVybCArICcuYXBpJyk7XG4gICAgICAgIGNvbnN0IG1ha2VQcm9taXNlID0gYXN5bmMgKHR5cGU6IHN0cmluZykgPT4gKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHN0YXJ0UGF0aCArICcuJyArIHR5cGUpICYmIHR5cGUpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVUeXBlID0gKGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCd0cycpLFxuICAgICAgICAgICAgbWFrZVByb21pc2UoJ2pzJylcbiAgICAgICAgXSkpLmZpbHRlcih4ID0+IHgpLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKGZpbGVUeXBlKVxuICAgICAgICAgICAgcmV0dXJuIHVybCArICcuYXBpLicgKyBmaWxlVHlwZTtcblxuICAgICAgICB1cmwgPSBDdXRUaGVMYXN0KCcvJywgdXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmw6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYXRoU3BsaXQgPSB1cmwuc3BsaXQoJy8nKS5sZW5ndGg7XG4gICAgbGV0IHsgc3RhdGljUGF0aCwgZGF0YUluZm8gfSA9IGdldEFwaUZyb21NYXAodXJsLCBwYXRoU3BsaXQpO1xuXG4gICAgaWYgKCFkYXRhSW5mbykge1xuICAgICAgICBzdGF0aWNQYXRoID0gYXdhaXQgZmluZEFwaVBhdGgodXJsKTtcblxuICAgICAgICBpZiAoc3RhdGljUGF0aCkge1xuICAgICAgICAgICAgZGF0YUluZm8gPSB7XG4gICAgICAgICAgICAgICAgcGF0aFNwbGl0LFxuICAgICAgICAgICAgICAgIGRlcHNNYXA6IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFwaVN0YXRpY01hcFtzdGF0aWNQYXRoXSA9IGRhdGFJbmZvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGFJbmZvKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBNYWtlQ2FsbChcbiAgICAgICAgICAgIGF3YWl0IFJlcXVpcmVGaWxlKCcvJyArIHN0YXRpY1BhdGgsICdhcGktY2FsbCcsICcnLCBnZXRUeXBlcy5TdGF0aWMsIGRhdGFJbmZvLmRlcHNNYXAsIGlzRGVidWcpLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgdXJsLnN1YnN0cmluZyhzdGF0aWNQYXRoLmxlbmd0aCAtIDYpLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIG5leHRQcmFzZVxuICAgICAgICApO1xuICAgIH1cbn1cbi8vIC0tIGVuZCBvZiBmZXRjaCBmaWxlIC0tXG5jb25zdCBiYW5Xb3JkcyA9IFsndmFsaWRhdGVVUkwnLCAndmFsaWRhdGVGdW5jJywgJ2Z1bmMnLCAnZGVmaW5lJywgLi4uaHR0cC5NRVRIT0RTXTtcbi8qKlxuICogRmluZCB0aGUgQmVzdCBQYXRoXG4gKi9cbmZ1bmN0aW9uIGZpbmRCZXN0VXJsT2JqZWN0KG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcpIHtcbiAgICBsZXQgbWF4TGVuZ3RoID0gMCwgdXJsID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGkubGVuZ3RoO1xuICAgICAgICBpZiAobWF4TGVuZ3RoIDwgbGVuZ3RoICYmIHVybEZyb20uc3RhcnRzV2l0aChpKSAmJiAhYmFuV29yZHMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHVybCA9IGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFBhcnNlIEFuZCBWYWxpZGF0ZSBVUkxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VVUkxEYXRhKHZhbGlkYXRlOiBhbnksIHZhbHVlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGxldCBwdXNoRGF0YSA9IHZhbHVlLCByZXNEYXRhID0gdHJ1ZSwgZXJyb3I6IHN0cmluZztcblxuICAgIHN3aXRjaCAodmFsaWRhdGUpIHtcbiAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgIGNhc2UgcGFyc2VGbG9hdDpcbiAgICAgICAgY2FzZSBwYXJzZUludDpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gKDxhbnk+dmFsaWRhdGUpKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSAhaXNOYU4ocHVzaERhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgICAgIHB1c2hEYXRhID0gdmFsdWUgIT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSB2YWx1ZSA9PSAndHJ1ZScgfHwgdmFsdWUgPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhbnknOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxpZGF0ZSkpXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLmluY2x1ZGVzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFrZVZhbGlkID0gYXdhaXQgdmFsaWRhdGUodmFsdWUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ha2VWYWxpZCAmJiB0eXBlb2YgbWFrZVZhbGlkID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkLnZhbGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaERhdGEgPSBtYWtlVmFsaWQucGFyc2UgPz8gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZDtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yLCBmaWxlZCAtICcgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS50ZXN0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc0RhdGEpXG4gICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRlIGZpbGVkIC0gJyArIHZhbHVlO1xuXG4gICAgcmV0dXJuIFtlcnJvciwgcHVzaERhdGFdO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIHRoZSBVUkwgZGF0YSBhbmQgcGFyc2VzIGl0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IG9iaiAtIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgVVJMIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gVGhlIFVSTCB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSB7YW55fSBkZWZpbmVPYmplY3QgLSBBbGwgdGhlIGRlZmluaXRpb25zIHRoYXQgaGFzIGJlZW4gZm91bmRcbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSBtYWtlTWFzc2FnZSAtIENyZWF0ZSBhbiBlcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBwcm9wZXJ0eS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlZmluaXRpb24ob2JqOiBhbnksIHVybEZyb206IHN0cmluZywgZGVmaW5lT2JqZWN0OiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgbWFrZU1hc3NhZ2U6IChlOiBhbnkpID0+IHN0cmluZykge1xuICAgIGlmICghb2JqLmRlZmluZSlcbiAgICAgICAgcmV0dXJuIHVybEZyb207XG5cbiAgICBjb25zdCB2YWxpZGF0ZUZ1bmMgPSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcbiAgICBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYyA9IG51bGw7XG4gICAgZGVsZXRlIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9iai5kZWZpbmUpIHtcbiAgICAgICAgY29uc3QgW2RhdGFTbGFzaCwgbmV4dFVybEZyb21dID0gU3BsaXRGaXJzdCgnLycsIHVybEZyb20pO1xuICAgICAgICB1cmxGcm9tID0gbmV4dFVybEZyb207XG5cbiAgICAgICAgY29uc3QgW2Vycm9yLCBuZXdEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YShvYmouZGVmaW5lW25hbWVdLCBkYXRhU2xhc2gsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgaWYoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgXG4gICAgICAgIGRlZmluZU9iamVjdFtuYW1lXSA9IG5ld0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgdmFsaWRhdGVGdW5jKGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycgPyB2YWxpZGF0ZTogJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJ307XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybEZyb207XG59XG4vKipcbiAqIFRoZSBmdW5jdGlvbiB3aWxsIHBhcnNlIHRoZSB1cmwgYW5kIGZpbmQgdGhlIGJlc3QgbWF0Y2ggZm9yIHRoZSB1cmxcbiAqIEBwYXJhbSB7YW55fSBmaWxlTW9kdWxlIC0gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRob2QgdGhhdCB5b3Ugd2FudCB0byBjYWxsLlxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSB0aGUgdXJsIHRoYXQgdGhlIHVzZXIgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSAoKSA9PiBQcm9taXNlPGFueT5cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSwgdGhlIHJlcXVlc3QgaXMgcHJvY2Vzc2VkLiBJZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgZmFsc2UsIHRoZSByZXF1ZXN0IGlzIG5vdCBwcm9jZXNzZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIE1ha2VDYWxsKGZpbGVNb2R1bGU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgYWxsb3dFcnJvckluZm8gPSAhR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpICYmIGlzRGVidWcsIG1ha2VNYXNzYWdlID0gKGU6IGFueSkgPT4gKGlzRGVidWcgPyBwcmludC5lcnJvcihlKSA6IG51bGwpICsgKGFsbG93RXJyb3JJbmZvID8gYCwgbWVzc2FnZTogJHtlLm1lc3NhZ2V9YCA6ICcnKTtcbiAgICBjb25zdCBtZXRob2QgPSBSZXF1ZXN0Lm1ldGhvZDtcbiAgICBsZXQgbWV0aG9kT2JqID0gZmlsZU1vZHVsZVttZXRob2RdIHx8IGZpbGVNb2R1bGUuZGVmYXVsdFttZXRob2RdOyAvL0xvYWRpbmcgdGhlIG1vZHVsZSBieSBtZXRob2RcbiAgICBsZXQgaGF2ZU1ldGhvZCA9IHRydWU7XG5cbiAgICBpZighbWV0aG9kT2JqKXtcbiAgICAgICAgaGF2ZU1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBtZXRob2RPYmogPSBmaWxlTW9kdWxlLmRlZmF1bHQgfHwgZmlsZU1vZHVsZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlTWV0aG9kID0gbWV0aG9kT2JqO1xuXG4gICAgY29uc3QgZGVmaW5lT2JqZWN0ID0ge307XG5cbiAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7IC8vIHJvb3QgbGV2ZWwgZGVmaW5pdGlvblxuICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuXG4gICAgbGV0IG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSk7XG5cbiAgICAvL3BhcnNlIHRoZSB1cmwgcGF0aFxuICAgIGZvcihsZXQgaSA9IDA7IGk8IDI7IGkrKyl7XG4gICAgICAgIHdoaWxlICgobmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcbiAgICAgICAgICAgIGlmKCg8YW55PmRhdGFEZWZpbmUpLmVycm9yKSByZXR1cm4gUmVzcG9uc2UuanNvbihkYXRhRGVmaW5lKTtcbiAgICAgICAgICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG4gICAgXG4gICAgICAgICAgICB1cmxGcm9tID0gdHJpbVR5cGUoJy8nLCB1cmxGcm9tLnN1YnN0cmluZyhuZXN0ZWRVUkwubGVuZ3RoKSk7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbmVzdGVkVVJMXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFoYXZlTWV0aG9kKXsgLy8gY2hlY2sgaWYgdGhhdCBhIG1ldGhvZFxuICAgICAgICAgICAgaGF2ZU1ldGhvZCA9IHRydWU7XG4gICAgICAgICAgICBtZXRob2RPYmogPSBtZXRob2RPYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9iaj8uZnVuYyAmJiBtZXRob2RPYmogfHwgYmFzZU1ldGhvZDsgLy8gaWYgdGhlcmUgaXMgYW4gJ2FueScgbWV0aG9kXG5cblxuICAgIGlmICghbWV0aG9kT2JqPy5mdW5jKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsZWZ0RGF0YSA9IHVybEZyb20uc3BsaXQoJy8nKTtcbiAgICBjb25zdCB1cmxEYXRhID0gW107XG5cblxuICAgIGxldCBlcnJvcjogc3RyaW5nO1xuICAgIGlmIChtZXRob2RPYmoudmFsaWRhdGVVUkwpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHZhbGlkYXRlXSBvZiBPYmplY3QuZW50cmllcyhtZXRob2RPYmoudmFsaWRhdGVVUkwpKSB7XG4gICAgICAgICAgICBjb25zdCBbZXJyb3JVUkwsIHB1c2hEYXRhXSA9IGF3YWl0IHBhcnNlVVJMRGF0YSh2YWxpZGF0ZSwgbGVmdERhdGFbaW5kZXhdLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JVUkwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IDxzdHJpbmc+ZXJyb3JVUkw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybERhdGEucHVzaChwdXNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdXJsRGF0YS5wdXNoKC4uLmxlZnREYXRhKTtcblxuICAgIGlmICghZXJyb3IgJiYgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYykge1xuICAgICAgICBsZXQgdmFsaWRhdGU6IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gYXdhaXQgbWV0aG9kT2JqLnZhbGlkYXRlRnVuYyhsZWZ0RGF0YSwgUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3InICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZTtcbiAgICAgICAgZWxzZSBpZiAoIXZhbGlkYXRlKVxuICAgICAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGluZyBVUkwnO1xuICAgIH1cblxuICAgIGlmIChlcnJvcilcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvciB9KTtcblxuICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGxldCBhcGlSZXNwb25zZTogYW55LCBuZXdSZXNwb25zZTogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGFwaVJlc3BvbnNlID0gYXdhaXQgbWV0aG9kT2JqLmZ1bmMoUmVxdWVzdCwgUmVzcG9uc2UsIHVybERhdGEsIGRlZmluZU9iamVjdCwgbGVmdERhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGFsbG93RXJyb3JJbmZvKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiBlLm1lc3NhZ2UgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6ICc1MDAgLSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhcGlSZXNwb25zZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyB0ZXh0OiBhcGlSZXNwb25zZSB9O1xuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSBhcGlSZXNwb25zZTtcblxuICAgIGZpbmFsU3RlcCgpOyAgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgaWYgKG5ld1Jlc3BvbnNlICE9IG51bGwpXG4gICAgICAgIFJlc3BvbnNlLmpzb24obmV3UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5nc30gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIGFzIEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBHZXRGaWxlIGFzIEdldFN0YXRpY0ZpbGUsIHNlcnZlckJ1aWxkIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCAqIGFzIEZ1bmNTY3JpcHQgZnJvbSAnLi9GdW5jdGlvblNjcmlwdCc7XG5pbXBvcnQgTWFrZUFwaUNhbGwgZnJvbSAnLi9BcGlDYWxsJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuY29uc3QgeyBFeHBvcnQgfSA9IEZ1bmNTY3JpcHQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JQYWdlcyB7XG4gICAgbm90Rm91bmQ/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH0sXG4gICAgc2VydmVyRXJyb3I/OiB7XG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgY29kZT86IG51bWJlclxuICAgIH1cbn1cblxuaW50ZXJmYWNlIEdldFBhZ2VzU2V0dGluZ3Mge1xuICAgIENhY2hlRGF5czogbnVtYmVyLFxuICAgIFBhZ2VSYW06IGJvb2xlYW4sXG4gICAgRGV2TW9kZTogYm9vbGVhbixcbiAgICBDb29raWVTZXR0aW5ncz86IGFueSxcbiAgICBDb29raWVzPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgQ29va2llRW5jcnlwdGVyPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgU2Vzc2lvblN0b3JlPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4sXG4gICAgRXJyb3JQYWdlczogRXJyb3JQYWdlc1xufVxuXG5jb25zdCBTZXR0aW5nczogR2V0UGFnZXNTZXR0aW5ncyA9IHtcbiAgICBDYWNoZURheXM6IDEsXG4gICAgUGFnZVJhbTogZmFsc2UsXG4gICAgRGV2TW9kZTogdHJ1ZSxcbiAgICBFcnJvclBhZ2VzOiB7fVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkUGFnZVRvUmFtKHVybDogc3RyaW5nKSB7XG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKEZ1bmNTY3JpcHQuZ2V0RnVsbFBhdGhDb21waWxlKHVybCkpKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdID0gW107XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdID0gYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZSh1cmwpO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzBdLCB1cmwpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZEFsbFBhZ2VzVG9SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHBhZ2VEZXBzLnN0b3JlKSB7XG4gICAgICAgIGlmICghRXh0ZW5zaW9uSW5BcnJheShpLCA8YW55PkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkpKVxuICAgICAgICAgICAgYXdhaXQgTG9hZFBhZ2VUb1JhbShpKTtcblxuICAgIH1cbn1cblxuZnVuY3Rpb24gQ2xlYXJBbGxQYWdlc0Zyb21SYW0oKSB7XG4gICAgZm9yIChjb25zdCBpIGluIEV4cG9ydC5QYWdlTG9hZFJhbSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGRlbGV0ZSBFeHBvcnQuUGFnZUxvYWRSYW1baV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBFeHRlbnNpb25JbkFycmF5KGZpbGVQYXRoOiBzdHJpbmcsIC4uLmFycmF5czogc3RyaW5nW10pIHtcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGguc3Vic3RyaW5nKGZpbGVQYXRoLmxlbmd0aCAtIGkubGVuZ3RoIC0gMSkgPT0gJy4nICsgaSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gR2V0RXJyb3JQYWdlKGNvZGU6IG51bWJlciwgTG9jU2V0dGluZ3M6ICdub3RGb3VuZCcgfCAnc2VydmVyRXJyb3InKSB7XG4gICAgbGV0IGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nO1xuICAgIGlmIChTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXSkge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWM7XG4gICAgICAgIHVybCA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLnBhdGg7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5jb2RlID8/IGNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuTG9ncztcbiAgICAgICAgdXJsID0gJ2UnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdXJsLCBhcnJheVR5cGUsIGNvZGUgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGNvZGU6IG51bWJlcikge1xuICAgIC8vZmlyc3Qgc3RlcCAtIHBhcnNlIGluZm9cbiAgICBpZiAoUmVxdWVzdC5tZXRob2QgPT0gXCJQT1NUXCIpIHtcbiAgICAgICAgaWYgKCFSZXF1ZXN0LmJvZHkgfHwgIU9iamVjdC5rZXlzKFJlcXVlc3QuYm9keSkubGVuZ3RoKVxuICAgICAgICAgICAgUmVxdWVzdC5ib2R5ID0gUmVxdWVzdC5maWVsZHMgfHwge307XG5cbiAgICB9IGVsc2VcbiAgICAgICAgUmVxdWVzdC5ib2R5ID0gZmFsc2U7XG5cblxuICAgIGlmIChSZXF1ZXN0LmNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZXMoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLkNvb2tpZUVuY3J5cHRlcihSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuU2Vzc2lvblN0b3JlKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG5cbiAgICBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXMgfHwge307XG4gICAgUmVxdWVzdC5maWxlcyA9IFJlcXVlc3QuZmlsZXMgfHwge307XG5cbiAgICBjb25zdCBDb3B5Q29va2llcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzKSk7XG4gICAgUmVxdWVzdC5jb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzO1xuXG4gICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMTtcblxuICAgIC8vc2Vjb25kIHN0ZXBcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAxKVxuICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzQ29kZSA9IGNvZGU7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5zaWduZWRDb29raWVzKSB7Ly91cGRhdGUgY29va2llc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gJ29iamVjdCcgJiYgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9IENvcHlDb29raWVzW2ldIHx8IEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSkgIT0gSlNPTi5zdHJpbmdpZnkoQ29weUNvb2tpZXNbaV0pKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNvb2tpZShpLCBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0sIFNldHRpbmdzLkNvb2tpZVNldHRpbmdzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIENvcHlDb29raWVzKSB7Ly9kZWxldGUgbm90IGV4aXRzIGNvb2tpZXNcbiAgICAgICAgICAgIGlmIChSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jbGVhckNvb2tpZShpKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuXG4vL2ZvciBmaW5hbCBzdGVwXG5mdW5jdGlvbiBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdDogUmVxdWVzdCB8IGFueSkge1xuICAgIGlmICghUmVxdWVzdC5maWxlcykgLy9kZWxldGUgZmlsZXNcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBhcnJQYXRoID0gW11cblxuICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LmZpbGVzKSB7XG5cbiAgICAgICAgY29uc3QgZSA9IFJlcXVlc3QuZmlsZXNbaV07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgaW4gZSkge1xuICAgICAgICAgICAgICAgIGFyclBhdGgucHVzaChlW2FdLmZpbGVwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBhcnJQYXRoLnB1c2goZS5maWxlcGF0aCk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyUGF0aDtcbn1cblxuLy9maW5hbCBzdGVwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVSZXF1ZXN0RmlsZXMoYXJyYXk6IHN0cmluZ1tdKSB7XG4gICAgZm9yKGNvbnN0IGUgaW4gYXJyYXkpXG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNVUkxQYXRoQUZpbGUoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIGNvZGU6IG51bWJlcikge1xuICAgIGxldCBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsyXTtcbiAgICBsZXQgZmlsZSA9IGZhbHNlO1xuXG4gICAgaWYgKGNvZGUgPT0gMjAwKSB7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgdXJsO1xuICAgICAgICAvL2NoZWNrIHRoYXQgaXMgbm90IHNlcnZlciBmaWxlXG4gICAgICAgIGlmIChhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBTZXR0aW5ncy5EZXZNb2RlLCB1cmwpIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIGZpbGUgPSB0cnVlO1xuICAgICAgICBlbHNlICAvLyB0aGVuIGl0IGEgc2VydmVyIHBhZ2Ugb3IgZXJyb3IgcGFnZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZmlsZSwgZnVsbFBhZ2VVcmwgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRMb2FkUGFnZShzbWFsbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHBhZ2VBcnJheSA9IFthd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHNtYWxsUGF0aCldO1xuXG4gICAgcGFnZUFycmF5WzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UocGFnZUFycmF5WzBdLCBzbWFsbFBhdGgpO1xuXG4gICAgaWYgKFNldHRpbmdzLlBhZ2VSYW0pXG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdID0gcGFnZUFycmF5O1xuXG4gICAgcmV0dXJuIHBhZ2VBcnJheVsxXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gQnVpbGRQYWdlVVJMKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgbGV0IGZ1bGxQYWdlVXJsOiBzdHJpbmc7XG5cbiAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVswXSArIHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuXG4gICAgICAgIHVybCA9IEVycm9yUGFnZS51cmw7XG4gICAgICAgIGFycmF5VHlwZSA9IEVycm9yUGFnZS5hcnJheVR5cGU7XG4gICAgICAgIGNvZGUgPSBFcnJvclBhZ2UuY29kZTtcblxuICAgICAgICBzbWFsbFBhdGggPSBhcnJheVR5cGVbMl0gKyAnLycgKyB1cmw7XG4gICAgICAgIGZ1bGxQYWdlVXJsID0gdXJsICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoYXJyYXlUeXBlWzBdICsgZnVsbFBhZ2VVcmwpKVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsxXSArIGZ1bGxQYWdlVXJsICsgJy5janMnO1xuXG4gICAgfSBlbHNlXG4gICAgICAgIGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzFdICsgdXJsICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlICsgJy5janMnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXJyYXlUeXBlLFxuICAgICAgICBmdWxsUGFnZVVybCxcbiAgICAgICAgc21hbGxQYXRoLFxuICAgICAgICBjb2RlLFxuICAgICAgICB1cmxcbiAgICB9XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGxvYWQgdGhlIGR5bmFtaWMgcGFnZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gVGhlIGFycmF5IG9mIHR5cGVzIHRoYXQgdGhlIHBhZ2UgaXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbFBhZ2VVcmwgLSBUaGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHNtYWxsUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlIGZpbGUuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFRoZSBzdGF0dXMgY29kZSBvZiB0aGUgcGFnZS5cbiAqIEByZXR1cm5zIFRoZSBEeW5hbWljRnVuYyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byBnZW5lcmF0ZSB0aGUgcGFnZS5cbiAqIFRoZSBjb2RlIGlzIHRoZSBzdGF0dXMgY29kZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBUaGUgZnVsbFBhZ2VVcmwgaXMgdGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIGZ1bGxQYWdlVXJsOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBjb25zdCBTZXROZXdVUkwgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gYXdhaXQgQnVpbGRQYWdlVVJMKGFycmF5VHlwZSwgdXJsLCBzbWFsbFBhdGgsIGNvZGUpO1xuICAgICAgICBzbWFsbFBhdGggPSBidWlsZC5zbWFsbFBhdGgsIHVybCA9IGJ1aWxkLnVybCwgY29kZSA9IGJ1aWxkLmNvZGUsIGZ1bGxQYWdlVXJsID0gYnVpbGQuZnVsbFBhZ2VVcmwsIGFycmF5VHlwZSA9IGJ1aWxkLmFycmF5VHlwZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGV0IER5bmFtaWNGdW5jOiAoLi4uZGF0YTogYW55W10pID0+IGFueTtcbiAgICBpZiAoU2V0dGluZ3MuRGV2TW9kZSAmJiBhd2FpdCBTZXROZXdVUkwoKSAmJiBmdWxsUGFnZVVybCkge1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShzbWFsbFBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZSh1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBhcnJheVR5cGUpO1xuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSkge1xuXG4gICAgICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdKSB7XG4gICAgICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVswXSwgc21hbGxQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoU2V0dGluZ3MuUGFnZVJhbSlcbiAgICAgICAgICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV0gPSBEeW5hbWljRnVuYztcblxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cblxuICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0pXG4gICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cbiAgICBlbHNlIGlmICghU2V0dGluZ3MuUGFnZVJhbSAmJiBhd2FpdCBTZXROZXdVUkwoKSAmJiBmdWxsUGFnZVVybClcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBhd2FpdCBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aCk7XG5cbiAgICBlbHNlIHtcbiAgICAgICAgY29kZSA9IFNldHRpbmdzLkVycm9yUGFnZXMubm90Rm91bmQ/LmNvZGUgPz8gNDA0O1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kICYmIEV4cG9ydC5QYWdlTG9hZFJhbVtnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kLnBhdGhdIHx8IEV4cG9ydC5QYWdlTG9hZFJhbVtnZXRUeXBlcy5Mb2dzWzJdICsgJy9lNDA0J107XG5cbiAgICAgICAgaWYgKEVycm9yUGFnZSlcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXJyb3JQYWdlWzFdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgRHluYW1pY0Z1bmMsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGZ1bGxQYWdlVXJsXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBNYWtlUGFnZVJlc3BvbnNlKER5bmFtaWNSZXNwb25zZTogYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aD8uZmlsZSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gUmVzcG9uc2Uub24oJ2ZpbmlzaCcsIHJlcykpO1xuICAgIH0gZWxzZSBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCkge1xuICAgICAgICBSZXNwb25zZS53cml0ZUhlYWQoMzAyLCB7IExvY2F0aW9uOiBEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoIH0pO1xuICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBSZXNQYWdlID0gRHluYW1pY1Jlc3BvbnNlLm91dF9ydW5fc2NyaXB0LnRyaW0oKTtcbiAgICAgICAgaWYgKFJlc1BhZ2UpIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnNlbmQoUmVzUGFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZXNwb25zZS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoLmRlbGV0ZUFmdGVyKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmtJZkV4aXN0cyhSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHJlcXVlc3QgaXMgbWFkZSB0byBhIHBhZ2UuIFxuICogSXQgd2lsbCBjaGVjayBpZiB0aGUgcGFnZSBleGlzdHMsIGFuZCBpZiBpdCBkb2VzLCBpdCB3aWxsIHJldHVybiB0aGUgcGFnZS4gXG4gKiBJZiBpdCBkb2VzIG5vdCBleGlzdCwgaXQgd2lsbCByZXR1cm4gYSA0MDQgcGFnZVxuICogQHBhcmFtIHtSZXF1ZXN0IHwgYW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlUeXBlIC0gYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoc1xuICogbG9hZGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgb2YgdGhlIHBhZ2UgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHt7IGZpbGU6IGJvb2xlYW4sIGZ1bGxQYWdlVXJsOiBzdHJpbmcgfX0gRmlsZUluZm8gLSB0aGUgZmlsZSBpbmZvIG9mIHRoZSBwYWdlIHRoYXQgaXMgYmVpbmcgYWN0aXZhdGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBudW1iZXJcbiAqIEBwYXJhbSBuZXh0UHJhc2UgLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGFmdGVyIHRoZSBkeW5hbWljIHBhZ2VcbiAqIGlzIGxvYWRlZC5cbiAqIEByZXR1cm5zIE5vdGhpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEFjdGl2YXRlUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UsIGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBGaWxlSW5mbzogYW55LCBjb2RlOiBudW1iZXIsIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgY29uc3QgeyBEeW5hbWljRnVuYywgZnVsbFBhZ2VVcmwsIGNvZGU6IG5ld0NvZGUgfSA9IGF3YWl0IEdldER5bmFtaWNQYWdlKGFycmF5VHlwZSwgdXJsLCBGaWxlSW5mby5mdWxsUGFnZVVybCwgRmlsZUluZm8uZnVsbFBhZ2VVcmwgKyAnLycgKyB1cmwsIGNvZGUpO1xuXG4gICAgaWYgKCFmdWxsUGFnZVVybCB8fCAhRHluYW1pY0Z1bmMgJiYgY29kZSA9PSA1MDApXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5zZW5kU3RhdHVzKG5ld0NvZGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuICAgICAgICBjb25zdCBwYWdlRGF0YSA9IGF3YWl0IER5bmFtaWNGdW5jKFJlc3BvbnNlLCBSZXF1ZXN0LCBSZXF1ZXN0LmJvZHksIFJlcXVlc3QucXVlcnksIFJlcXVlc3QuY29va2llcywgUmVxdWVzdC5zZXNzaW9uLCBSZXF1ZXN0LmZpbGVzLCBTZXR0aW5ncy5EZXZNb2RlKTtcbiAgICAgICAgZmluYWxTdGVwKCk7IC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgICAgICBhd2FpdCBNYWtlUGFnZVJlc3BvbnNlKFxuICAgICAgICAgICAgcGFnZURhdGEsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoZSk7XG4gICAgICAgIFJlcXVlc3QuZXJyb3IgPSBlO1xuXG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IEdldEVycm9yUGFnZSg1MDAsICdzZXJ2ZXJFcnJvcicpO1xuXG4gICAgICAgIER5bmFtaWNQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gRHluYW1pY1BhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55LCB1cmw6IHN0cmluZywgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljLCBjb2RlID0gMjAwKSB7XG4gICAgY29uc3QgRmlsZUluZm8gPSBhd2FpdCBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0LCB1cmwsIGFycmF5VHlwZSwgY29kZSk7XG5cbiAgICBjb25zdCBtYWtlRGVsZXRlQXJyYXkgPSBtYWtlRGVsZXRlUmVxdWVzdEZpbGVzQXJyYXkoUmVxdWVzdClcblxuICAgIGlmIChGaWxlSW5mby5maWxlKSB7XG4gICAgICAgIFNldHRpbmdzLkNhY2hlRGF5cyAmJiBSZXNwb25zZS5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT1cIiArIChTZXR0aW5ncy5DYWNoZURheXMgKiAyNCAqIDYwICogNjApKTtcbiAgICAgICAgYXdhaXQgR2V0U3RhdGljRmlsZSh1cmwsIFNldHRpbmdzLkRldk1vZGUsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0UHJhc2UgPSAoKSA9PiBQYXJzZUJhc2ljSW5mbyhSZXF1ZXN0LCBSZXNwb25zZSwgY29kZSk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgY29uc3QgaXNBcGkgPSBhd2FpdCBNYWtlQXBpQ2FsbChSZXF1ZXN0LCBSZXNwb25zZSwgdXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBuZXh0UHJhc2UpO1xuICAgIGlmICghaXNBcGkgJiYgIWF3YWl0IEFjdGl2YXRlUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgYXJyYXlUeXBlLCB1cmwsIEZpbGVJbmZvLCBjb2RlLCBuZXh0UHJhc2UpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTsgLy8gZGVsZXRlIGZpbGVzXG59XG5cbmZ1bmN0aW9uIHVybEZpeCh1cmw6IHN0cmluZykge1xuICAgIGlmICh1cmwgPT0gJy8nKSB7XG4gICAgICAgIHVybCA9ICcvaW5kZXgnO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbn1cblxuZXhwb3J0IHtcbiAgICBTZXR0aW5ncyxcbiAgICBEeW5hbWljUGFnZSxcbiAgICBMb2FkQWxsUGFnZXNUb1JhbSxcbiAgICBDbGVhckFsbFBhZ2VzRnJvbVJhbSxcbiAgICB1cmxGaXgsXG4gICAgR2V0RXJyb3JQYWdlXG59IiwgImltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0ICogYXMgQnVpbGRTZXJ2ZXIgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IGNvb2tpZVBhcnNlciB9IGZyb20gJ0B0aW55aHR0cC9jb29raWUtcGFyc2VyJztcbmltcG9ydCBjb29raWVFbmNyeXB0ZXIgZnJvbSAnY29va2llLWVuY3J5cHRlcic7XG5pbXBvcnQgeyBhbGxvd1ByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgSW5zZXJ0TW9kZWxzU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IHsgU3RhcnRSZXF1aXJlLCBHZXRTZXR0aW5ncyB9IGZyb20gJy4vSW1wb3J0TW9kdWxlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIGNyZWF0ZU5ld1ByaW50U2V0dGluZ3MgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgTWVtb3J5U2Vzc2lvbiBmcm9tICdtZW1vcnlzdG9yZSc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBkZWJ1Z1NpdGVNYXAgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2l0ZU1hcCc7XG5pbXBvcnQgeyBzZXR0aW5ncyBhcyBkZWZpbmVTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuXG5jb25zdFxuICAgIENvb2tpZXNTZWNyZXQgPSB1dWlkdjQoKS5zdWJzdHJpbmcoMCwgMzIpLFxuICAgIFNlc3Npb25TZWNyZXQgPSB1dWlkdjQoKSxcbiAgICBNZW1vcnlTdG9yZSA9IE1lbW9yeVNlc3Npb24oc2Vzc2lvbiksXG5cbiAgICBDb29raWVzTWlkZGxld2FyZSA9IGNvb2tpZVBhcnNlcihDb29raWVzU2VjcmV0KSxcbiAgICBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlID0gY29va2llRW5jcnlwdGVyKENvb2tpZXNTZWNyZXQsIHt9KSxcbiAgICBDb29raWVTZXR0aW5ncyA9IHsgaHR0cE9ubHk6IHRydWUsIHNpZ25lZDogdHJ1ZSwgbWF4QWdlOiA4NjQwMDAwMCAqIDMwIH07XG5cbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVzID0gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIgPSA8YW55PkNvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llU2V0dGluZ3MgPSBDb29raWVTZXR0aW5ncztcblxubGV0IERldk1vZGVfID0gdHJ1ZSwgY29tcGlsYXRpb25TY2FuOiBQcm9taXNlPCgpID0+IFByb21pc2U8dm9pZD4+LCBTZXNzaW9uU3RvcmU7XG5cbmxldCBmb3JtaWRhYmxlU2VydmVyLCBib2R5UGFyc2VyU2VydmVyO1xuXG5jb25zdCBzZXJ2ZUxpbWl0cyA9IHtcbiAgICBzZXNzaW9uVG90YWxSYW1NQjogMTUwLFxuICAgIHNlc3Npb25UaW1lTWludXRlczogNDAsXG4gICAgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlczogMzAsXG4gICAgZmlsZUxpbWl0TUI6IDEwLFxuICAgIHJlcXVlc3RMaW1pdE1COiA0XG59XG5cbmxldCBwYWdlSW5SYW1BY3RpdmF0ZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCBmdW5jdGlvbiBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKXtcbiAgICByZXR1cm4gcGFnZUluUmFtQWN0aXZhdGU7XG59XG5cbmNvbnN0IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMgPSBbLi4uQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheV07XG5jb25zdCBiYXNlVmFsaWRQYXRoID0gWyhwYXRoOiBzdHJpbmcpID0+IHBhdGguc3BsaXQoJy4nKS5hdCgtMikgIT0gJ3NlcnYnXTsgLy8gaWdub3JpbmcgZmlsZXMgdGhhdCBlbmRzIHdpdGggLnNlcnYuKlxuXG5leHBvcnQgY29uc3QgRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyA9IHtcbiAgICBnZXQgc2V0dGluZ3NQYXRoKCkge1xuICAgICAgICByZXR1cm4gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArIFwiL1NldHRpbmdzXCI7XG4gICAgfSxcbiAgICBzZXQgZGV2ZWxvcG1lbnQodmFsdWUpIHtcbiAgICAgICAgaWYoRGV2TW9kZV8gPT0gdmFsdWUpIHJldHVyblxuICAgICAgICBEZXZNb2RlXyA9IHZhbHVlO1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICBjb21waWxhdGlvblNjYW4gPSBCdWlsZFNlcnZlci5jb21waWxlQWxsKEV4cG9ydCk7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwicHJvZHVjdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5EZXZNb2RlID0gdmFsdWU7XG4gICAgICAgIGFsbG93UHJpbnQodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0IGRldmVsb3BtZW50KCkge1xuICAgICAgICByZXR1cm4gRGV2TW9kZV87XG4gICAgfSxcbiAgICBtaWRkbGV3YXJlOiB7XG4gICAgICAgIGdldCBjb29raWVzKCk6IChyZXE6IFJlcXVlc3QsIF9yZXM6IFJlc3BvbnNlPGFueT4sIG5leHQ/OiBOZXh0RnVuY3Rpb24pID0+IHZvaWQge1xuICAgICAgICAgICAgcmV0dXJuIDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVFbmNyeXB0ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblN0b3JlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZm9ybWlkYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtaWRhYmxlU2VydmVyO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgYm9keVBhcnNlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBib2R5UGFyc2VyU2VydmVyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZWNyZXQ6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llc1NlY3JldDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblNlY3JldDtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGdlbmVyYWw6IHtcbiAgICAgICAgaW1wb3J0T25Mb2FkOiBbXSxcbiAgICAgICAgc2V0IHBhZ2VJblJhbSh2YWx1ZSkge1xuICAgICAgICAgICAgaWYoZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0gIT0gdmFsdWUpe1xuICAgICAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiAoYXdhaXQgY29tcGlsYXRpb25TY2FuKT8uKClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXBhcmF0aW9ucyA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICAgICAgICAgICAgICBhd2FpdCBwcmVwYXJhdGlvbnM/LigpO1xuICAgICAgICAgICAgICAgIGlmICghZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZUJ5VXJsLkxvYWRBbGxQYWdlc1RvUmFtKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZUJ5VXJsLkNsZWFyQWxsUGFnZXNGcm9tUmFtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXQgcGFnZUluUmFtKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21waWxlOiB7XG4gICAgICAgIHNldCBjb21waWxlU3ludGF4KHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4ID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb21waWxlU3ludGF4KCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBpZ25vcmVFcnJvcih2YWx1ZSkge1xuICAgICAgICAgICAgKDxhbnk+Y3JlYXRlTmV3UHJpbnRTZXR0aW5ncykuUHJldmVudEVycm9ycyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgaWdub3JlRXJyb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+Y3JlYXRlTmV3UHJpbnRTZXR0aW5ncykuUHJldmVudEVycm9ycztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHBsdWdpbnModmFsdWUpIHtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnMucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBwbHVnaW5zKCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLnBsdWdpbnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBkZWZpbmUoKXtcbiAgICAgICAgICAgIHJldHVybiBkZWZpbmVTZXR0aW5ncy5kZWZpbmVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGRlZmluZSh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lU2V0dGluZ3MuZGVmaW5lID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmc6IHtcbiAgICAgICAgcnVsZXM6IHt9LFxuICAgICAgICB1cmxTdG9wOiBbXSxcbiAgICAgICAgdmFsaWRQYXRoOiBiYXNlVmFsaWRQYXRoLFxuICAgICAgICBpZ25vcmVUeXBlczogYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyxcbiAgICAgICAgaWdub3JlUGF0aHM6IFtdLFxuICAgICAgICBzaXRlbWFwOiB0cnVlLFxuICAgICAgICBnZXQgZXJyb3JQYWdlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGVycm9yUGFnZXModmFsdWUpIHtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlTGltaXRzOiB7XG4gICAgICAgIGdldCBjYWNoZURheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY2FjaGVEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvb2tpZXNFeHBpcmVzRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZVNldHRpbmdzLm1heEFnZSAvIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgY29va2llc0V4cGlyZXNEYXlzKHZhbHVlKXtcbiAgICAgICAgICAgIENvb2tpZVNldHRpbmdzLm1heEFnZSA9IHZhbHVlICogODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVG90YWxSYW1NQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVG90YWxSYW1NQigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRpbWVNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uVGltZU1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBmaWxlTGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZpbGVMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcmVxdWVzdExpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgICAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHJlcXVlc3RMaW1pdE1CKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZToge1xuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBodHRwMjogZmFsc2UsXG4gICAgICAgIGdyZWVuTG9jazoge1xuICAgICAgICAgICAgc3RhZ2luZzogbnVsbCxcbiAgICAgICAgICAgIGNsdXN0ZXI6IG51bGwsXG4gICAgICAgICAgICBlbWFpbDogbnVsbCxcbiAgICAgICAgICAgIGFnZW50OiBudWxsLFxuICAgICAgICAgICAgYWdyZWVUb1Rlcm1zOiBmYWxzZSxcbiAgICAgICAgICAgIHNpdGVzOiBbXVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtaWRhYmxlKCkge1xuICAgIGZvcm1pZGFibGVTZXJ2ZXIgPSB7XG4gICAgICAgIG1heEZpbGVTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgKiAxMDQ4NTc2LFxuICAgICAgICB1cGxvYWREaXI6IFN5c3RlbURhdGEgKyBcIi9VcGxvYWRGaWxlcy9cIixcbiAgICAgICAgbXVsdGlwbGVzOiB0cnVlLFxuICAgICAgICBtYXhGaWVsZHNTaXplOiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKiAxMDQ4NTc2XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQm9keVBhcnNlcigpIHtcbiAgICBib2R5UGFyc2VyU2VydmVyID0gKDxhbnk+Ym9keVBhcnNlcikuanNvbih7IGxpbWl0OiBFeHBvcnQuc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUIgKyAnbWInIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNlc3Npb24oKSB7XG4gICAgaWYgKCFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzIHx8ICFFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIpIHtcbiAgICAgICAgU2Vzc2lvblN0b3JlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBTZXNzaW9uU3RvcmUgPSBzZXNzaW9uKHtcbiAgICAgICAgY29va2llOiB7IG1heEFnZTogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyAqIDYwICogMTAwMCwgc2FtZVNpdGU6IHRydWUgfSxcbiAgICAgICAgc2VjcmV0OiBTZXNzaW9uU2VjcmV0LFxuICAgICAgICByZXNhdmU6IGZhbHNlLFxuICAgICAgICBzYXZlVW5pbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgIHN0b3JlOiBuZXcgTWVtb3J5U3RvcmUoe1xuICAgICAgICAgICAgY2hlY2tQZXJpb2Q6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgbWF4OiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgKiAxMDQ4NTc2XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvcHlKU09OKHRvOiBhbnksIGpzb246IGFueSwgcnVsZXM6IHN0cmluZ1tdID0gW10sIHJ1bGVzVHlwZTogJ2lnbm9yZScgfCAnb25seScgPSAnaWdub3JlJykge1xuICAgIGlmKCFqc29uKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IGhhc0ltcGxlYXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgaSBpbiBqc29uKSB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGUgPSBydWxlcy5pbmNsdWRlcyhpKTtcbiAgICAgICAgaWYgKHJ1bGVzVHlwZSA9PSAnb25seScgJiYgaW5jbHVkZSB8fCBydWxlc1R5cGUgPT0gJ2lnbm9yZScgJiYgIWluY2x1ZGUpIHtcbiAgICAgICAgICAgIGhhc0ltcGxlYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0b1tpXSA9IGpzb25baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0ltcGxlYXRlZDtcbn1cblxuLy8gcmVhZCB0aGUgc2V0dGluZ3Mgb2YgdGhlIHdlYnNpdGVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlU2V0dGluZ3MoKSB7XG4gICAgY29uc3QgU2V0dGluZ3M6IEV4cG9ydFNldHRpbmdzID0gYXdhaXQgR2V0U2V0dGluZ3MoRXhwb3J0LnNldHRpbmdzUGF0aCwgRGV2TW9kZV8pO1xuICAgIGlmKFNldHRpbmdzID09IG51bGwpIHJldHVybjtcblxuICAgIGlmIChTZXR0aW5ncy5kZXZlbG9wbWVudClcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbERldik7XG5cbiAgICBlbHNlXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxQcm9kKTtcblxuXG4gICAgY29weUpTT04oRXhwb3J0LmNvbXBpbGUsIFNldHRpbmdzLmNvbXBpbGUpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnJvdXRpbmcsIFNldHRpbmdzLnJvdXRpbmcsIFsnaWdub3JlVHlwZXMnLCAndmFsaWRQYXRoJ10pO1xuXG4gICAgLy9jb25jYXQgZGVmYXVsdCB2YWx1ZXMgb2Ygcm91dGluZ1xuICAgIGNvbnN0IGNvbmNhdEFycmF5ID0gKG5hbWU6IHN0cmluZywgYXJyYXk6IGFueVtdKSA9PiBTZXR0aW5ncy5yb3V0aW5nPy5bbmFtZV0gJiYgKEV4cG9ydC5yb3V0aW5nW25hbWVdID0gU2V0dGluZ3Mucm91dGluZ1tuYW1lXS5jb25jYXQoYXJyYXkpKTtcblxuICAgIGNvbmNhdEFycmF5KCdpZ25vcmVUeXBlcycsIGJhc2VSb3V0aW5nSWdub3JlVHlwZXMpO1xuICAgIGNvbmNhdEFycmF5KCd2YWxpZFBhdGgnLCBiYXNlVmFsaWRQYXRoKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnY2FjaGVEYXlzJywgJ2Nvb2tpZXNFeHBpcmVzRGF5cyddLCAnb25seScpO1xuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydzZXNzaW9uVG90YWxSYW1NQicsICdzZXNzaW9uVGltZU1pbnV0ZXMnLCAnc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnZmlsZUxpbWl0TUInLCAncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRCb2R5UGFyc2VyKCk7XG4gICAgfVxuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlLCBTZXR0aW5ncy5zZXJ2ZSk7XG5cbiAgICAvKiAtLS0gcHJvYmxlbWF0aWMgdXBkYXRlcyAtLS0gKi9cbiAgICBFeHBvcnQuZGV2ZWxvcG1lbnQgPSBTZXR0aW5ncy5kZXZlbG9wbWVudFxuXG4gICAgaWYgKFNldHRpbmdzLmdlbmVyYWw/LmltcG9ydE9uTG9hZCkge1xuICAgICAgICBFeHBvcnQuZ2VuZXJhbC5pbXBvcnRPbkxvYWQgPSA8YW55PmF3YWl0IFN0YXJ0UmVxdWlyZSg8YW55PlNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkLCBEZXZNb2RlXyk7XG4gICAgfVxuXG4gICAgLy9uZWVkIHRvIGRvd24gbGFzdGVkIHNvIGl0IHdvbid0IGludGVyZmVyZSB3aXRoICdpbXBvcnRPbkxvYWQnXG4gICAgaWYgKCFjb3B5SlNPTihFeHBvcnQuZ2VuZXJhbCwgU2V0dGluZ3MuZ2VuZXJhbCwgWydwYWdlSW5SYW0nXSwgJ29ubHknKSAmJiBTZXR0aW5ncy5kZXZlbG9wbWVudCkge1xuICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICB9XG5cbiAgICBpZihFeHBvcnQuZGV2ZWxvcG1lbnQgJiYgRXhwb3J0LnJvdXRpbmcuc2l0ZW1hcCl7IC8vIG9uIHByb2R1Y3Rpb24gdGhpcyB3aWxsIGJlIGNoZWNrZWQgYWZ0ZXIgY3JlYXRpbmcgc3RhdGVcbiAgICAgICAgZGVidWdTaXRlTWFwKEV4cG9ydCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGaXJzdExvYWQoKSB7XG4gICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgYnVpbGRCb2R5UGFyc2VyKCk7XG59IiwgImltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHAyIGZyb20gJ2h0dHAyJztcbmltcG9ydCAqIGFzIGNyZWF0ZUNlcnQgZnJvbSAnc2VsZnNpZ25lZCc7XG5pbXBvcnQgKiBhcyBHcmVlbmxvY2sgZnJvbSAnZ3JlZW5sb2NrLWV4cHJlc3MnO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3N9IGZyb20gJy4vU2V0dGluZ3MnXG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEZWxldGVJbkRpcmVjdG9yeSwgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEdyZWVuTG9ja1NpdGUgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuXG4vKipcbiAqIElmIHRoZSBmb2xkZXIgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNcbiAqIGV4aXN0LCB1cGRhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZm9sZGVyIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSBDcmVhdGVJbk5vdEV4aXRzIC0ge1xuICovXG5hc3luYyBmdW5jdGlvbiBUb3VjaFN5c3RlbUZvbGRlcihmb05hbWU6IHN0cmluZywgQ3JlYXRlSW5Ob3RFeGl0czoge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgZXhpdHM/OiBhbnl9KSB7XG4gICAgbGV0IHNhdmVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArIFwiL1N5c3RlbVNhdmUvXCI7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBzYXZlUGF0aCArPSBmb05hbWU7XG5cbiAgICBhd2FpdCBFYXN5RnMubWtkaXJJZk5vdEV4aXN0cyhzYXZlUGF0aCk7XG5cbiAgICBpZiAoQ3JlYXRlSW5Ob3RFeGl0cykge1xuICAgICAgICBzYXZlUGF0aCArPSAnLyc7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gc2F2ZVBhdGggKyBDcmVhdGVJbk5vdEV4aXRzLm5hbWU7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIENyZWF0ZUluTm90RXhpdHMudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKENyZWF0ZUluTm90RXhpdHMuZXhpdHMpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZmlsZVBhdGgsIGF3YWl0IENyZWF0ZUluTm90RXhpdHMuZXhpdHMoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpLCBmaWxlUGF0aCwgc2F2ZVBhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBJdCBnZW5lcmF0ZXMgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBhbmQgc3RvcmVzIGl0IGluIGEgZmlsZS5cbiAqIEByZXR1cm5zIFRoZSBjZXJ0aWZpY2F0ZSBhbmQga2V5IGFyZSBiZWluZyByZXR1cm5lZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gR2V0RGVtb0NlcnRpZmljYXRlKCkge1xuICAgIGxldCBDZXJ0aWZpY2F0ZTogYW55O1xuICAgIGNvbnN0IENlcnRpZmljYXRlUGF0aCA9IFN5c3RlbURhdGEgKyAnL0NlcnRpZmljYXRlLmpzb24nO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKENlcnRpZmljYXRlUGF0aCkpIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBFYXN5RnMucmVhZEpzb25GaWxlKENlcnRpZmljYXRlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgQ2VydGlmaWNhdGUgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgY3JlYXRlQ2VydC5nZW5lcmF0ZShudWxsLCB7IGRheXM6IDM2NTAwIH0sIChlcnIsIGtleXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlzLnByaXZhdGUsXG4gICAgICAgICAgICAgICAgICAgIGNlcnQ6IGtleXMuY2VydFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEVhc3lGcy53cml0ZUpzb25GaWxlKENlcnRpZmljYXRlUGF0aCwgQ2VydGlmaWNhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gQ2VydGlmaWNhdGU7XG59XG5cbmZ1bmN0aW9uIERlZmF1bHRMaXN0ZW4oYXBwKSB7XG4gICAgY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwLmF0dGFjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VydmVyLFxuICAgICAgICBsaXN0ZW4ocG9ydDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIDxhbnk+cmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZSgpIHtcbiAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgZ3JlZW5sb2NrLCBpdCB3aWxsIGNyZWF0ZSBhIHNlcnZlciB0aGF0IHdpbGwgc2VydmUgeW91ciBhcHAgb3ZlciBodHRwc1xuICogQHBhcmFtIGFwcCAtIFRoZSB0aW55SHR0cCBhcHBsaWNhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0aGUgc2VydmVyIG1ldGhvZHNcbiAqL1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gVXBkYXRlR3JlZW5Mb2NrKGFwcCkge1xuXG4gICAgaWYgKCEoU2V0dGluZ3Muc2VydmUuaHR0cDIgfHwgU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrPy5hZ3JlZVRvVGVybXMpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBEZWZhdWx0TGlzdGVuKGFwcCk7XG4gICAgfVxuXG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdyZWVUb1Rlcm1zKSB7XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGh0dHAyLmNyZWF0ZVNlY3VyZVNlcnZlcih7IC4uLmF3YWl0IEdldERlbW9DZXJ0aWZpY2F0ZSgpLCBhbGxvd0hUVFAxOiB0cnVlIH0sIGFwcC5hdHRhY2gpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4ocG9ydCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IFRvdWNoU3lzdGVtRm9sZGVyKFwiZ3JlZW5sb2NrXCIsIHtcbiAgICAgICAgbmFtZTogXCJjb25maWcuanNvblwiLCB2YWx1ZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc2l0ZXM6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlc1xuICAgICAgICB9KSxcbiAgICAgICAgYXN5bmMgZXhpdHMoZmlsZSwgXywgZm9sZGVyKSB7XG4gICAgICAgICAgICBmaWxlID0gSlNPTi5wYXJzZShmaWxlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBmaWxlLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IGZpbGUuc2l0ZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGhhdmU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIDxHcmVlbkxvY2tTaXRlW10+IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5zdWJqZWN0ID09IGUuc3ViamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGF2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5hbHRuYW1lcy5sZW5ndGggIT0gZS5hbHRuYW1lcy5sZW5ndGggfHwgYi5hbHRuYW1lcy5zb21lKHYgPT4gZS5hbHRuYW1lcy5pbmNsdWRlcyh2KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmFsdG5hbWVzID0gYi5hbHRuYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZS5yZW5ld0F0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFoYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGUuc2l0ZXMuc3BsaWNlKGksIGkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gZm9sZGVyICsgXCJsaXZlL1wiICsgZS5zdWJqZWN0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbmV3U2l0ZXMgPSBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMuZmlsdGVyKCh4KSA9PiAhZmlsZS5zaXRlcy5maW5kKGIgPT4gYi5zdWJqZWN0ID09IHguc3ViamVjdCkpO1xuXG4gICAgICAgICAgICBmaWxlLnNpdGVzLnB1c2goLi4ubmV3U2l0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh3b3JraW5nRGlyZWN0b3J5ICsgXCJwYWNrYWdlLmpzb25cIik7XG5cbiAgICBjb25zdCBncmVlbmxvY2tPYmplY3Q6YW55ID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IEdyZWVubG9jay5pbml0KHtcbiAgICAgICAgcGFja2FnZVJvb3Q6IHdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGNvbmZpZ0RpcjogXCJTeXN0ZW1TYXZlL2dyZWVubG9ja1wiLFxuICAgICAgICBwYWNrYWdlQWdlbnQ6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ2VudCB8fCBwYWNrYWdlSW5mby5uYW1lICsgJy8nICsgcGFja2FnZUluZm8udmVyc2lvbixcbiAgICAgICAgbWFpbnRhaW5lckVtYWlsOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suZW1haWwsXG4gICAgICAgIGNsdXN0ZXI6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5jbHVzdGVyLFxuICAgICAgICBzdGFnaW5nOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc3RhZ2luZ1xuICAgIH0pLnJlYWR5KHJlcykpO1xuXG4gICAgZnVuY3Rpb24gQ3JlYXRlU2VydmVyKHR5cGUsIGZ1bmMsIG9wdGlvbnM/KSB7XG4gICAgICAgIGxldCBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGdyZWVubG9ja09iamVjdFt0eXBlXShvcHRpb25zLCBmdW5jKTtcbiAgICAgICAgY29uc3QgbGlzdGVuID0gKHBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3QuaHR0cFNlcnZlcigpO1xuICAgICAgICAgICAgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4gaHR0cFNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtuZXcgUHJvbWlzZShyZXMgPT4gc2VydmVyLmxpc3Rlbig0NDMsIFwiMC4wLjAuMFwiLCByZXMpKSwgbmV3IFByb21pc2UocmVzID0+IGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsIFwiMC4wLjAuMFwiLCByZXMpKV0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgc2VydmVyLmNsb3NlKCk7IENsb3NlaHR0cFNlcnZlcigpOyB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuLFxuICAgICAgICAgICAgY2xvc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwMlNlcnZlcicsIGFwcC5hdHRhY2gsIHsgYWxsb3dIVFRQMTogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRlU2VydmVyKCdodHRwc1NlcnZlcicsIGFwcC5hdHRhY2gpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgc2VydmVyLCB7U2V0dGluZ3N9ICBmcm9tICcuL01haW5CdWlsZC9TZXJ2ZXInO1xuaW1wb3J0IGFzeW5jUmVxdWlyZSBmcm9tICcuL0ltcG9ydEZpbGVzL1NjcmlwdCc7XG5pbXBvcnQge2dldFR5cGVzfSBmcm9tICcuL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSAnLi9CdWlsZEluRnVuYy9TZWFyY2hSZWNvcmQnO1xuZXhwb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tICcuL01haW5CdWlsZC9UeXBlcyc7XG5cbmV4cG9ydCBjb25zdCBBc3luY0ltcG9ydCA9IChwYXRoOnN0cmluZywgaW1wb3J0RnJvbSA9ICdhc3luYyBpbXBvcnQnKSA9PiBhc3luY1JlcXVpcmUoaW1wb3J0RnJvbSwgcGF0aCwgZ2V0VHlwZXMuU3RhdGljLCBTZXR0aW5ncy5kZXZlbG9wbWVudCk7XG5leHBvcnQge1NldHRpbmdzLCBTZWFyY2hSZWNvcmR9O1xuZXhwb3J0IGRl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
