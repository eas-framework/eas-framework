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
function exists(path21) {
  return new Promise((res) => {
    fs.stat(path21, (err, stat2) => {
      res(Boolean(stat2));
    });
  });
}
function stat(path21, filed, ignoreError, defaultValue = {}) {
  return new Promise((res) => {
    fs.stat(path21, (err, stat2) => {
      if (err && !ignoreError) {
        print.error(err);
      }
      res(filed && stat2 ? stat2[filed] : stat2 || defaultValue);
    });
  });
}
async function existsFile(path21, ifTrueReturn = true) {
  return (await stat(path21, void 0, true)).isFile?.() && ifTrueReturn;
}
function mkdir(path21) {
  return new Promise((res) => {
    fs.mkdir(path21, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function rmdir(path21) {
  return new Promise((res) => {
    fs.rmdir(path21, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function unlink(path21) {
  return new Promise((res) => {
    fs.unlink(path21, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function unlinkIfExists(path21) {
  if (await exists(path21)) {
    return await unlink(path21);
  }
  return false;
}
function readdir(path21, options = {}) {
  return new Promise((res) => {
    fs.readdir(path21, options, (err, files) => {
      if (err) {
        print.error(err);
      }
      res(files || []);
    });
  });
}
async function mkdirIfNotExists(path21) {
  if (!await exists(path21))
    return await mkdir(path21);
  return false;
}
function writeFile(path21, content) {
  return new Promise((res) => {
    fs.writeFile(path21, content, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function writeJsonFile(path21, content) {
  try {
    return await writeFile(path21, JSON.stringify(content));
  } catch (err) {
    print.error(err);
  }
  return false;
}
function readFile(path21, encoding = "utf8") {
  return new Promise((res) => {
    fs.readFile(path21, encoding, (err, data) => {
      if (err) {
        print.error(err);
      }
      res(data || "");
    });
  });
}
async function readJsonFile(path21, encoding) {
  try {
    return JSON.parse(await readFile(path21, encoding));
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
async function DeleteInDirectory(path21) {
  const allInFolder = await EasyFs_default.readdir(path21, { withFileTypes: true });
  for (const i of allInFolder) {
    const n = i.name;
    if (i.isDirectory()) {
      const dir = path21 + n + "/";
      await DeleteInDirectory(dir);
      await EasyFs_default.rmdir(dir);
    } else {
      await EasyFs_default.unlink(path21 + n);
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
    return `${text || message}, on file -> ${BasicSettings.fullWebSitePath + searchLine.extractInfo()}:${data.line}:${data.char}${location?.lineText ? 'Line: "' + location.lineText : '"'}`;
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
  constructor(text, path21, start = "<%", end = "%>", type = "script") {
    this.start = start;
    this.text = text;
    this.end = end;
    this.type = type;
    this.path = path21;
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
  static async RunAndExport(text, path21, isDebug) {
    const parser = new JSParser(text, path21);
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
  async load(code, path21) {
    this.buildCode = new ReBuildCodeString(await ParseTextStream(await this.ExtractAndSaveCode(code)));
    this.path = path21;
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
async function ParseTextCode(code, path21) {
  const parser = new JSParser(code, path21, "<#{debug}", "{debug}#>", "debug info");
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
async function ParseScriptCode(code, path21) {
  const parser = new JSParser(code, path21, "<#{debug}", "{debug}#>", "debug info");
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
async function ParseDebugLine(code, path21) {
  const parser = new JSParser(code, path21);
  await parser.findScripts();
  for (const i of parser.values) {
    if (i.type == "text") {
      i.text = await ParseTextCode(i.text, path21);
    } else {
      i.text = await ParseScriptCode(i.text, path21);
    }
  }
  parser.start = "<%";
  parser.end = "%>";
  return parser.ReBuildText();
}
async function ParseDebugInfo(code, path21) {
  return await ParseScriptCode(code, path21);
}
async function AddDebugInfo(pageName, FullPath2, SmallPath, cache = {}) {
  if (!cache.value)
    cache.value = await EasyFs_default.readFile(FullPath2, "utf8");
  return {
    allData: new StringTracker(`${pageName}<line>${SmallPath}`, cache.value),
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
function PrintIfNew({ id, text, type = "warn", errorName }) {
  if (!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)) {
    print[type](text.replace(/<line>/gi, " -> "), `

Error code: ${errorName}

`);
    PreventDoubleLog.push(id ?? text);
  }
}

// src/CompileCode/esbuild/printMessage.ts
function ESBuildPrintError({ errors }, filePath) {
  for (const err of errors) {
    PrintIfNew({
      type: "error",
      errorName: "compilation-error",
      text: `${err.text}, on file -> ${filePath ?? err.location.file}:${err?.location?.line ?? 0}:${err?.location?.column ?? 0}`
    });
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
    PrintIfNew({
      type: "warn",
      errorName: warn.pluginName,
      text: `${warn.text} on file -> ${filePath ?? warn.location.file}:${warn?.location?.line ?? 0}:${warn?.location?.column ?? 0}`
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
function ESBuildPrintErrorStringTracker(base, { errors }) {
  for (const err of errors) {
    PrintIfNew({
      errorName: "compilation-error",
      text: base.debugLine(err)
    });
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
async function template(BuildScriptWithoutModule, name2, params, selector, mainCode, path21, isDebug) {
  const parse2 = await JSParser.RunAndExport(mainCode, path21, isDebug);
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
  PrintIfNew({
    text: `${err.message},
on file -> ${fileURLToPath5(err.span.url)}:${line ?? 0}:${column ?? 0}`,
    errorName: err?.status == 5 ? "sass-warning" : "sass-error",
    type: err?.status == 5 ? "warn" : "error"
  });
}
function PrintSassErrorTracker(err, track) {
  if (err.span.url)
    return PrintSassError(err);
  err.location = getSassErrorLine(err);
  PrintIfNew({
    text: track.debugLine(err),
    errorName: err?.status == 5 ? "sass-warning" : "sass-error",
    type: err?.status == 5 ? "warn" : "error"
  });
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
    const FullPath2 = fileURLToPath5(err.span.url);
    await sessionInfo2.dependence(BasicSettings.relative(FullPath2), FullPath2);
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
async function CheckDependencyChange(path21, dependencies = pageDeps.store[path21]) {
  for (const i in dependencies) {
    let p = i;
    if (i == "thisPage") {
      p = path21 + "." + BasicSettings.pageTypes.page;
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

// src/ImportFiles/CustomImport/Extension/json.ts
function json_default(path21) {
  return EasyFs_default.readJsonFile(path21);
}

// src/ImportFiles/CustomImport/Extension/wasm.ts
import { promises as promises2 } from "fs";
async function wasm_default(path21) {
  const wasmModule2 = new WebAssembly.Module(await promises2.readFile(path21));
  const wasmInstance2 = new WebAssembly.Instance(wasmModule2, {});
  return wasmInstance2.exports;
}

// src/ImportFiles/CustomImport/Extension/index.ts
var customTypes = ["json", "wasm"];
async function ImportByExtension(path21, type) {
  switch (type) {
    case "json":
      return json_default(path21);
    case "wasm":
      return wasm_default(path21);
    default:
      return import(path21);
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
  async addHeadTags() {
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
      EasyFs_default.writeFile(saveLocation + url, await i.value.createDataWithMap());
    }
  }
  async buildHead() {
    await this.addHeadTags();
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
var resolve = (path21) => require2.resolve(path21);
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
  PrintIfNew({
    errorName: "svelte-" + code,
    type: "error",
    text: `${message}
${frame}
${filePath}:${await findLocation.getLocation(start)}`
  });
}
async function PrintSvelteWarn(warnings, filePath, sourceMap) {
  const findLocation = new reLocation(sourceMap);
  for (const { message, code, start, frame } of warnings) {
    PrintIfNew({
      errorName: "svelte-" + code,
      type: "warn",
      text: `${message}
${frame}
${filePath}:${await findLocation.getLocation(start)}`
    });
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
    this.fullPath = getTypes.Static[0] + filepath;
  }
  async load() {
    this.indexData = await EasyFs_default.readJsonFile(this.fullPath);
    const unwrapped = [];
    let counter = 0;
    for (const path21 in this.indexData) {
      const element = this.indexData[path21];
      for (const id in element.titles) {
        unwrapped.push({ id: counter++, text: element.titles[id], url: `/${path21}/#${id}` });
      }
      unwrapped.push({ id: counter++, text: element.text, url: `/${path21}` });
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
        while (index != -1) {
          rebuild += lower.substring(0, index) + `<${tag}>${i.text.substring(index + rebuild.length, index + term.length + rebuild.length)}</${tag}>`;
          lower = lower.substring(index + term.length);
          index = lower.indexOf(term);
        }
        i.text = rebuild + lower;
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
  return await MyModule((path21) => import(path21));
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
      const baseModelData = await AddDebugInfo(pageName, haveCode, SmallPath);
      this.scriptFile = baseModelData.allData.replaceAll("@", "@@");
      this.scriptFile.AddTextBeforeNoTrack("<%");
      this.scriptFile.AddTextAfterNoTrack("%>");
      sessionInfo2.debug && this.scriptFile.AddTextBeforeNoTrack(baseModelData.stringInfo);
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
  async buildTagBasic(fileData, tagData, path21, SmallPath, pathName, sessionInfo2, BetweenTagData) {
    fileData = await this.PluginBuild.BuildComponent(fileData, path21, pathName, sessionInfo2);
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
import path12 from "path";
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
                const __filename = "${JSParser.fixTextSimpleQuotes(sessionInfo2.fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path12.dirname(sessionInfo2.fullPath))}";
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
            const __filename = "${JSParser.fixTextSimpleQuotes(fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path12.dirname(fullPath))}";
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
  async BuildBasic(text, OData, path21, pathName, sessionInfo2) {
    if (!OData) {
      return text;
    }
    if (!Array.isArray(OData)) {
      OData = [OData];
    }
    for (const i of OData) {
      const Syntax = await GetSyntax(i);
      if (Syntax) {
        text = await Syntax(text, i, path21, pathName, sessionInfo2);
      }
    }
    return text;
  }
  async BuildPage(text, path21, pathName, sessionInfo2) {
    text = await this.BuildBasic(text, this.defaultSyntax, path21, pathName, sessionInfo2);
    return text;
  }
  async BuildComponent(text, path21, pathName, sessionInfo2) {
    text = await this.BuildBasic(text, this.defaultSyntax, path21, pathName, sessionInfo2);
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
import path14 from "path";

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
import path13 from "path";
import { fileURLToPath as fileURLToPath7, pathToFileURL as pathToFileURL3 } from "url";
async function BuildStyleSass(inputPath, type, isDebug) {
  const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
  const dependenceObject = {
    thisFile: await EasyFs_default.stat(fullPath, "mtimeMs")
  };
  const fileData = await EasyFs_default.readFile(fullPath), fileDataDirname = path13.dirname(fullPath);
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
      result.sourceMap.sources = result.sourceMap.sources.map((x) => path13.relative(fileDataDirname, fileURLToPath7(x)) + "?source=true");
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
async function CheckDependencyChange2(path21) {
  const o = StaticFilesInfo2.store[path21];
  for (const i in o) {
    let p = i;
    if (i == "thisFile") {
      p = getTypes.Static[2] + "/" + path21;
    }
    const FilePath = BasicSettings.fullWebSitePath + p;
    if (await EasyFs_default.stat(FilePath, "mtimeMs", true) != o[i]) {
      return true;
    }
  }
  return !o;
}
async function BuildFile(SmallPath, isDebug, fullCompilePath) {
  const ext = path14.extname(SmallPath).substring(1).toLowerCase();
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
  const inServer = path14.join(basePath, filePath);
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
  if (!isDebug || GetPlugin("SafeDebug") || path14.extname(filePath) != ".source" || !safeFolders.includes(filePath.split(/\/|\\/).shift()) || !await askDebuggingWithSource())
    return;
  const fullPath = path14.join(BasicSettings.fullWebSitePath, filePath.substring(0, filePath.length - 7));
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
  if (path14.extname(baseFilePath) == ".svelte" && (checked || (exists2 = await EasyFs_default.existsFile(fullPath))))
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
  const fullPath = workingDirectory + "node_modules" + filePath.substring(4) + (path14.extname(filePath) ? "" : "/index.mjs");
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
async function serverBuild(Request, isDebug, path21, checked = false) {
  return await svelteStatic(path21, checked) || await svelteStyle(path21, checked, isDebug) || await unsafeDebug(isDebug, path21, checked) || await serverBuildByType(Request, path21, checked) || await markdownTheme(path21, checked) || await markdownCodeTheme(path21, checked) || getStatic.find((x) => x.path == path21);
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
  const ext = path14.extname(SmallPath).substring(1).toLowerCase();
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
import path17 from "path";

// src/RunTimeBuild/CompileState.ts
import path15 from "path";

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
  addPage(path21, type) {
    if (!this.state.pageArray.find((x) => x[0] == path21 && x[1] == type))
      this.state.pageArray.push([path21, type]);
  }
  addImport(path21) {
    if (!this.state.importArray.includes(path21))
      this.state.importArray.push(path21);
  }
  addFile(path21) {
    if (!this.state.fileArray.includes(path21))
      this.state.fileArray.push(path21);
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
CompileState.filePath = path15.join(SystemData, "CompileState.json");

// src/RunTimeBuild/SearchPages.ts
import { argv as argv2 } from "process";

// src/RunTimeBuild/SiteMap.ts
import path16 from "path";

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
async function FilesInFolder(arrayType, path21, state) {
  const allInFolder = await EasyFs_default.readdir(arrayType[0] + path21, { withFileTypes: true });
  const promises3 = [];
  for (const i of allInFolder) {
    const n = i.name, connect = path21 + n;
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
      if (path16.extname(url) == ".serv")
        continue;
      if (sitemap.urlStop) {
        for (const path21 in routing.urlStop) {
          if (url.startsWith(path21)) {
            url = path21;
          }
          break;
        }
      }
      if (sitemap.rules) {
        for (const path21 in routing.rules) {
          if (url.startsWith(path21)) {
            url = await routing.rules[path21](url);
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
          const path21 = "/" + routing.errorPages[error].path;
          if (url.startsWith(path21)) {
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
    const path21 = write === true ? "sitemap.txt" : write;
    state.addFile(path21);
    await EasyFs_default.writeFile(getTypes.Static[0] + path21, pages.join("\n"));
  }
}

// src/RunTimeBuild/SearchPages.ts
async function compileFile(filePath, arrayType, isDebug, hasSessionInfo, nestedPage, nestedPageData) {
  const FullFilePath = path17.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + ".cjs";
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
async function FilesInFolder2(arrayType, path21, state) {
  const allInFolder = await EasyFs_default.readdir(arrayType[0] + path21, { withFileTypes: true });
  for (const i of allInFolder) {
    const n = i.name, connect = path21 + n;
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
  for (const path21 of scripts) {
    await LoadImport("Production Loader", path21, getTypes.Static, false);
  }
}
async function CreateCompile(t, state) {
  const types = getTypes[t];
  await DeleteInDirectory(types[1]);
  return () => FilesInFolder2(types, "", state);
}
async function FastCompileInFile(path21, arrayType, sessionInfo2, nestedPage, nestedPageData) {
  await EasyFs_default.makePathReal(path21, arrayType[1]);
  return await compileFile(path21, arrayType, true, sessionInfo2, nestedPage, nestedPageData);
}
async function FastCompile(path21, arrayType) {
  await FastCompileInFile(path21, arrayType);
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
import path19 from "path";

// src/RunTimeBuild/ImportFileRuntime.ts
import path18 from "path";
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
      filePath = path18.join(path18.relative(typeArray[0], __dirname), filePath);
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
  let extname2 = path19.extname(filePath).substring(1);
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
    fullPath = path19.join(__dirname, filePath);
  } else
    fullPath = path19.join(typeArray[0], filePath);
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
  const compiledPath = path19.join(typeArray[1], SplitInfo[1] + "." + ext + ".cjs");
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
    Response.redirect = (path21, status) => {
      redirectPath = String(path21);
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
import path20 from "path";
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
    const startPath = path20.join(getTypes.Static[0], url + ".api");
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
var baseValidPath = [(path21) => path21.split(".").at(-2) != "serv"];
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
          const path21 = folder + "live/" + e.subject;
          if (await EasyFs_default.exists(path21)) {
            await DeleteInDirectory(path21);
            await EasyFs_default.rmdir(path21);
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
  let url = urlFix(req.url);
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
async function StartServer({ SitePath = "Website", HttpServer = UpdateGreenLock } = {}) {
  BasicSettings.WebSiteFolder = SitePath;
  buildFirstLoad();
  await requireSettings();
  StartApp(HttpServer);
}

// src/index.ts
var AsyncImport = (path21, importFrom = "async import") => LoadImport(importFrom, path21, getTypes.Static, Export.development);
var src_default = StartServer;
export {
  AsyncImport,
  SearchRecord,
  Export as Settings,
  src_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2pzb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vd2FzbS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1Nlc3Npb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2Vycm9yLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL21hcmtkb3duLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2hlYWQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZS50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvSW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvSW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N0eWxlLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9Db21waWxlU3RhdGUudHMiLCAiLi4vc3JjL01haW5CdWlsZC9JbXBvcnRNb2R1bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TaXRlTWFwLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRmlsZVR5cGVzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9JbXBvcnRGaWxlUnVudGltZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0FwaUNhbGwudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9HZXRQYWdlcy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvTGlzdGVuR3JlZW5Mb2NrLnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwIGFzIFRpbnlBcHAgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9UeXBlcyc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3MsIHJlcXVpcmVTZXR0aW5ncywgYnVpbGRGaXJzdExvYWQsIHBhZ2VJblJhbUFjdGl2YXRlRnVuY30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgZm9ybWlkYWJsZSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCB7IFVwZGF0ZUdyZWVuTG9jayB9IGZyb20gJy4vTGlzdGVuR3JlZW5Mb2NrJztcblxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBjaGFuZ2VVUkxSdWxlcyhyZXEsIHJlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYW5nZVVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGxldCB1cmwgPSBmaWxlQnlVcmwudXJsRml4KHJlcS51cmwpO1xuXG4gICAgXG4gICAgZm9yIChsZXQgaSBvZiBTZXR0aW5ncy5yb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpKSB7XG4gICAgICAgICAgICBpZiAoaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuc3Vic3RyaW5nKDAsIGkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSdWxlSW5kZXggPSBPYmplY3Qua2V5cyhTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzKS5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpO1xuXG4gICAgaWYgKFJ1bGVJbmRleCkge1xuICAgICAgICB1cmwgPSBhd2FpdCBTZXR0aW5ncy5yb3V0aW5nLnJ1bGVzW1J1bGVJbmRleF0odXJsLCByZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZXJVUkxSdWxlcyhyZXEsIHJlcywgdXJsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZXJVUkxSdWxlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHVybDogc3RyaW5nKSB7XG4gICAgbGV0IG5vdFZhbGlkOiBhbnkgPSBTZXR0aW5ncy5yb3V0aW5nLmlnbm9yZVBhdGhzLmZpbmQoaSA9PiB1cmwuc3RhcnRzV2l0aChpKSkgfHwgU2V0dGluZ3Mucm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGkgPT4gdXJsLmVuZHNXaXRoKCcuJytpKSk7XG4gICAgXG4gICAgaWYoIW5vdFZhbGlkKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWxpZCBvZiBTZXR0aW5ncy5yb3V0aW5nLnZhbGlkUGF0aCl7IC8vIGNoZWNrIGlmIHVybCBpc24ndCB2YWxpZFxuICAgICAgICAgICAgaWYoIWF3YWl0IHZhbGlkKHVybCwgcmVxLCByZXMpKXtcbiAgICAgICAgICAgICAgICBub3RWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm90VmFsaWQpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gZmlsZUJ5VXJsLkdldEVycm9yUGFnZSg0MDQsICdub3RGb3VuZCcpO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCBFcnJvclBhZ2UudXJsLCBFcnJvclBhZ2UuYXJyYXlUeXBlLCBFcnJvclBhZ2UuY29kZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgZmlsZUJ5VXJsLkR5bmFtaWNQYWdlKHJlcSwgcmVzLCB1cmwuc3Vic3RyaW5nKDEpKTtcbn1cblxubGV0IGFwcE9ubGluZVxuXG4vKipcbiAqIEl0IHN0YXJ0cyB0aGUgc2VydmVyIGFuZCB0aGVuIGNhbGxzIFN0YXJ0TGlzdGluZ1xuICogQHBhcmFtIFtTZXJ2ZXJdIC0gVGhlIHNlcnZlciBvYmplY3QgdGhhdCBpcyBwYXNzZWQgaW4gYnkgdGhlIGNhbGxlci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gU3RhcnRBcHAoU2VydmVyPykge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBUaW55QXBwKCk7XG4gICAgaWYgKCFTZXR0aW5ncy5zZXJ2ZS5odHRwMikge1xuICAgICAgICBhcHAudXNlKDxhbnk+Y29tcHJlc3Npb24oKSk7XG4gICAgfVxuICAgIGZpbGVCeVVybC5TZXR0aW5ncy5TZXNzaW9uU3RvcmUgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IFNldHRpbmdzLm1pZGRsZXdhcmUuc2Vzc2lvbihyZXEsIHJlcywgbmV4dCk7XG5cbiAgICBjb25zdCBPcGVuTGlzdGluZyA9IGF3YWl0IFN0YXJ0TGlzdGluZyhhcHAsIFNlcnZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgU2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgYXdhaXQgZnVuYyhhcHAsIGFwcE9ubGluZS5zZXJ2ZXIsIFNldHRpbmdzKTtcbiAgICB9XG4gICAgYXdhaXQgcGFnZUluUmFtQWN0aXZhdGVGdW5jKCk/LigpXG5cbiAgICBhcHAuYWxsKFwiKlwiLCBQYXJzZVJlcXVlc3QpO1xuXG4gICAgYXdhaXQgT3Blbkxpc3RpbmcoU2V0dGluZ3Muc2VydmUucG9ydCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcCBsaXN0aW5nIGF0IHBvcnQ6IFwiICsgU2V0dGluZ3Muc2VydmUucG9ydCk7XG59XG5cbi8qKlxuICogSWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIHJlcXVlc3QsIHRoZW4gcGFyc2UgdGhlIHJlcXVlc3QgYm9keSwgdGhlbiBzZW5kIGl0IHRvIHJvdXRpbmcgc2V0dGluZ3NcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC0gVGhlIGluY29taW5nIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLSBSZXNwb25zZVxuICovXG5hc3luYyBmdW5jdGlvbiBQYXJzZVJlcXVlc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT0gJ1BPU1QnKSB7XG4gICAgICAgIGlmIChyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10/LnN0YXJ0c1dpdGg/LignYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICBTZXR0aW5ncy5taWRkbGV3YXJlLmJvZHlQYXJzZXIocmVxLCByZXMsICgpID0+IHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKFNldHRpbmdzLm1pZGRsZXdhcmUuZm9ybWlkYWJsZSkucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmRTZXR0aW5ncyhyZXEsIHJlcyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpIHtcbiAgICBpZiAoYXBwT25saW5lICYmIGFwcE9ubGluZS5jbG9zZSkge1xuICAgICAgICBhd2FpdCBhcHBPbmxpbmUuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcnZlciwgbGlzdGVuLCBjbG9zZSB9ID0gYXdhaXQgU2VydmVyKGFwcCk7XG5cbiAgICBhcHBPbmxpbmUgPSB7IHNlcnZlciwgY2xvc2UgfTtcblxuICAgIHJldHVybiBsaXN0ZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0U2VydmVyKHsgU2l0ZVBhdGggPSAnV2Vic2l0ZScsIEh0dHBTZXJ2ZXIgPSBVcGRhdGVHcmVlbkxvY2sgfSA9IHt9KSB7XG4gICAgQmFzaWNTZXR0aW5ncy5XZWJTaXRlRm9sZGVyID0gU2l0ZVBhdGg7XG4gICAgYnVpbGRGaXJzdExvYWQoKTtcbiAgICBhd2FpdCByZXF1aXJlU2V0dGluZ3MoKTtcbiAgICBTdGFydEFwcChIdHRwU2VydmVyKTtcbn1cblxuZXhwb3J0IHsgU2V0dGluZ3MgfTsiLCAiaW1wb3J0IGZzLCB7RGlyZW50LCBTdGF0c30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIGV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIHJlcyhCb29sZWFuKHN0YXQpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge3BhdGggb2YgdGhlIGZpbGV9IHBhdGggXG4gKiBAcGFyYW0ge2ZpbGVkIHRvIGdldCBmcm9tIHRoZSBzdGF0IG9iamVjdH0gZmlsZWQgXG4gKiBAcmV0dXJucyB0aGUgZmlsZWRcbiAqL1xuZnVuY3Rpb24gc3RhdChwYXRoOiBzdHJpbmcsIGZpbGVkPzogc3RyaW5nLCBpZ25vcmVFcnJvcj86IGJvb2xlYW4sIGRlZmF1bHRWYWx1ZTphbnkgPSB7fSk6IFByb21pc2U8U3RhdHMgfCBhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIGlmKGVyciAmJiAhaWdub3JlRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZWQgJiYgc3RhdD8gc3RhdFtmaWxlZF06IHN0YXQgfHwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGZpbGUgZXhpc3RzLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjaGVjay5cbiAqIEBwYXJhbSB7YW55fSBbaWZUcnVlUmV0dXJuPXRydWVdIC0gYW55ID0gdHJ1ZVxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiBleGlzdHNGaWxlKHBhdGg6IHN0cmluZywgaWZUcnVlUmV0dXJuOiBhbnkgPSB0cnVlKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gKGF3YWl0IHN0YXQocGF0aCwgdW5kZWZpbmVkLCB0cnVlKSkuaXNGaWxlPy4oKSAmJiBpZlRydWVSZXR1cm47XG59XG5cbi8qKlxuICogSXQgY3JlYXRlcyBhIGRpcmVjdG9yeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIG1rZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLm1rZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHJtZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcm1kaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucm1kaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgdW5saW5rYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gdW5saW5rKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnVubGluayhwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGV4aXN0cywgZGVsZXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSB0byBiZSB1bmxpbmtlZC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5saW5rSWZFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZihhd2FpdCBleGlzdHMocGF0aCkpe1xuICAgICAgICByZXR1cm4gYXdhaXQgdW5saW5rKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRkaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbnMgb2JqZWN0LCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHtcbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHJlYWRkaXIocGF0aDogc3RyaW5nLCBvcHRpb25zID0ge30pOiBQcm9taXNlPHN0cmluZ1tdIHwgQnVmZmVyW10gfCBEaXJlbnRbXT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRkaXIocGF0aCwgb3B0aW9ucywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlcyB8fCBbXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkaXJlY3Rvcnkgd2FzIGNyZWF0ZWQgb3Igbm90LlxuICovXG5hc3luYyBmdW5jdGlvbiBta2RpcklmTm90RXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoIWF3YWl0IGV4aXN0cyhwYXRoKSlcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1rZGlyKHBhdGgpO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIGZpbGUgdG8gdGhlIGZpbGUgc3lzdGVtXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHtzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHdyaXRlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6ICBzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3KTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMud3JpdGVGaWxlKHBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHdyaXRlSnNvbkZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGEgY29udGVudCBhbmQgd3JpdGVzIHRoZSBjb250ZW50IHRvIHRoZSBmaWxlIGF0XG4gKiB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7YW55fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSnNvbkZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgd3JpdGVGaWxlKHBhdGgsIEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZEZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbmFsIGVuY29kaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gKiByZXNvbHZlcyB0byB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXQgdGhlIGdpdmVuIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBbZW5jb2Rpbmc9dXRmOF0gLSBUaGUgZW5jb2Rpbmcgb2YgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlYWRGaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZyA9ICd1dGY4Jyk6IFByb21pc2U8c3RyaW5nfGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRGaWxlKHBhdGgsIDxhbnk+ZW5jb2RpbmcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhkYXRhIHx8IFwiXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJdCByZWFkcyBhIEpTT04gZmlsZSBhbmQgcmV0dXJucyB0aGUgcGFyc2VkIEpTT04gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIHtzdHJpbmd9IFtlbmNvZGluZ10gLSBUaGUgZW5jb2RpbmcgdG8gdXNlIHdoZW4gcmVhZGluZyB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZEpzb25GaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZz86c3RyaW5nKTogUHJvbWlzZTxhbnk+e1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHJlYWRGaWxlKHBhdGgsIGVuY29kaW5nKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSBwIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBuZWVkcyB0byBiZSBjcmVhdGVkLlxuICogQHBhcmFtIFtiYXNlXSAtIFRoZSBiYXNlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VQYXRoUmVhbChwOnN0cmluZywgYmFzZSA9ICcnKSB7XG4gICAgcCA9IHBhdGguZGlybmFtZShwKTtcblxuICAgIGlmICghYXdhaXQgZXhpc3RzKGJhc2UgKyBwKSkge1xuICAgICAgICBjb25zdCBhbGwgPSBwLnNwbGl0KC9cXFxcfFxcLy8pO1xuXG4gICAgICAgIGxldCBwU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGlmIChwU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHBTdHJpbmcgKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcFN0cmluZyArPSBpO1xuXG4gICAgICAgICAgICBhd2FpdCBta2RpcklmTm90RXhpc3RzKGJhc2UgKyBwU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy90eXBlc1xuZXhwb3J0IHtcbiAgICBEaXJlbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC4uLmZzLnByb21pc2VzLFxuICAgIGV4aXN0cyxcbiAgICBleGlzdHNGaWxlLFxuICAgIHN0YXQsXG4gICAgbWtkaXIsXG4gICAgbWtkaXJJZk5vdEV4aXN0cyxcbiAgICB3cml0ZUZpbGUsXG4gICAgd3JpdGVKc29uRmlsZSxcbiAgICByZWFkRmlsZSxcbiAgICByZWFkSnNvbkZpbGUsXG4gICAgcm1kaXIsXG4gICAgdW5saW5rLFxuICAgIHVubGlua0lmRXhpc3RzLFxuICAgIHJlYWRkaXIsXG4gICAgbWFrZVBhdGhSZWFsXG59IiwgImxldCBwcmludE1vZGUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dQcmludChkOiBib29sZWFuKSB7XG4gICAgcHJpbnRNb2RlID0gZDtcbn1cblxuZXhwb3J0IGNvbnN0IHByaW50ID0gbmV3IFByb3h5KGNvbnNvbGUse1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmKHByaW50TW9kZSlcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQge0RpcmVudH0gZnJvbSAnZnMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtjd2R9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gJ3VybCdcbmltcG9ydCB7IEN1dFRoZUxhc3QgLCBTcGxpdEZpcnN0fSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gQ3V0VGhlTGFzdCgnLicsIFNwbGl0Rmlyc3QoJy8nLCBzbWFsbFBhdGgpLnBvcCgpKTtcbn1cblxuXG5leHBvcnQge1xuICAgIGdldERpcm5hbWUsXG4gICAgU3lzdGVtRGF0YSxcbiAgICB3b3JraW5nRGlyZWN0b3J5LFxuICAgIGdldFR5cGVzLFxuICAgIEJhc2ljU2V0dGluZ3Ncbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5pbnRlcmZhY2UgZ2xvYmFsU3RyaW5nPFQ+IHtcbiAgICBpbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIGxhc3RJbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIHN0YXJ0c1dpdGgoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3BsaXRGaXJzdDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+Pih0eXBlOiBzdHJpbmcsIHN0cmluZzogVCk6IFRbXSB7XG4gICAgY29uc3QgaW5kZXggPSBzdHJpbmcuaW5kZXhPZih0eXBlKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSlcbiAgICAgICAgcmV0dXJuIFtzdHJpbmddO1xuXG4gICAgcmV0dXJuIFtzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGV4KSwgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIHR5cGUubGVuZ3RoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDdXRUaGVMYXN0KHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YodHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0ZW5zaW9uPFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0cmluZzogVCkge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1UeXBlKHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICB3aGlsZSAoc3RyaW5nLnN0YXJ0c1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcodHlwZS5sZW5ndGgpO1xuXG4gICAgd2hpbGUgKHN0cmluZy5lbmRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGVuZ3RoIC0gdHlwZS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0cmluZ1N0YXJ0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0YXJ0OiBzdHJpbmcsIHN0cmluZzogVCk6IFQge1xuICAgIGlmKHN0cmluZy5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vLi4vSlNQYXJzZXInO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVRleHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGA8JXs/ZGVidWdfZmlsZT99JHtpLnRleHR9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlU2NyaXB0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGBydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdMaW5lKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VUZXh0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZXIuc3RhcnQgPSBcIjwlXCI7XG4gICAgcGFyc2VyLmVuZCA9IFwiJT5cIjtcbiAgICByZXR1cm4gcGFyc2VyLlJlQnVpbGRUZXh0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdJbmZvKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IFBhcnNlU2NyaXB0Q29kZShjb2RlLCBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEFkZERlYnVnSW5mbyhwYWdlTmFtZTpzdHJpbmcsIEZ1bGxQYXRoOnN0cmluZywgU21hbGxQYXRoOnN0cmluZywgY2FjaGU6IHt2YWx1ZT86IHN0cmluZ30gPSB7fSl7XG4gICAgaWYoIWNhY2hlLnZhbHVlKVxuICAgICAgICBjYWNoZS52YWx1ZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsUGF0aCwgJ3V0ZjgnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbERhdGE6IG5ldyBTdHJpbmdUcmFja2VyKGAke3BhZ2VOYW1lfTxsaW5lPiR7U21hbGxQYXRofWAsIGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCguLi5kYXRhLkRhdGFBcnJheSk7XG5cbiAgICAgICAgdGhpcy5zZXREZWZhdWx0KHtcbiAgICAgICAgICAgIGluZm86IGRhdGEuSW5mb1RleHQsXG4gICAgICAgICAgICBsaW5lOiBkYXRhLk9uTGluZSxcbiAgICAgICAgICAgIGNoYXI6IGRhdGEuT25DaGFyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IGFueSB0aGluZyB0byBjb25uZWN0XG4gICAgICogQHJldHVybnMgY29ubmN0ZWQgc3RyaW5nIHdpdGggYWxsIHRoZSB0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb25jYXQoLi4udGV4dDogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dCkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIGNsb25lIHBsdXMgdGhlIG5ldyBkYXRhIGNvbm5lY3RlZFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZVBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZ1RyYWNrZXIuY29uY2F0KHRoaXMuQ2xvbmUoKSwgLi4uZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmluZyBvciBhbnkgZGF0YSB0byB0aGlzIHN0cmluZ1xuICAgICAqIEBwYXJhbSBkYXRhIGNhbiBiZSBhbnkgdGhpbmdcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyAobm90IG5ldyBzdHJpbmcpXG4gICAgICovXG4gICAgcHVibGljIFBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0aW5mbyA9IGkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSwgbGFzdGluZm8uaW5mbywgbGFzdGluZm8ubGluZSwgbGFzdGluZm8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5zIG90IG90aGVyIGRhdGEgd2l0aCAnVGVtcGxhdGUgbGl0ZXJhbHMnXG4gICAgICogdXNlZCBsaWtlIHRoaXM6IG15U3RyaW4uJFBsdXMgYHRoaXMgdmVyeSR7Y29vbFN0cmluZ30hYFxuICAgICAqIEBwYXJhbSB0ZXh0cyBhbGwgdGhlIHNwbGl0ZWQgdGV4dFxuICAgICAqIEBwYXJhbSB2YWx1ZXMgYWxsIHRoZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyQodGV4dHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgYW55KVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0VmFsdWU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dHNbaV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcblxuICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dCwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcodmFsdWUpLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHRzW3RleHRzLmxlbmd0aCAtIDFdLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBzdHJpbmcgdG8gYWRkXG4gICAgICogQHBhcmFtIGFjdGlvbiB3aGVyZSB0byBhZGQgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gaW5mbyBpbmZvIHRoZSBjb21lIHdpdGggdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQWRkVGV4dEFjdGlvbih0ZXh0OiBzdHJpbmcsIGFjdGlvbjogXCJwdXNoXCIgfCBcInVuc2hpZnRcIiwgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8sIExpbmVDb3VudCA9IDAsIENoYXJDb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlOiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIGRhdGFTdG9yZS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5EYXRhQXJyYXlbYWN0aW9uXSguLi5kYXRhU3RvcmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlcih0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwicHVzaFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmcgd2l0aG91dCB0cmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXJOb1RyYWNrKHRleHQ6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZSh0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwidW5zaGlmdFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gKiBAcGFyYW0gdGV4dCBcbiAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY29weSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgY29weS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5wdXNoKC4uLnRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN1YnN0cmluZy1saWtlIG1ldGhvZCwgbW9yZSBsaWtlIGpzIGN1dHRpbmcgc3RyaW5nLCBpZiB0aGVyZSBpcyBub3QgcGFyYW1ldGVycyBpdCBjb21wbGV0ZSB0byAwXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGlzTmFOKGVuZCkpIHtcbiAgICAgICAgICAgIGVuZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZCA9IE1hdGguYWJzKGVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOYU4oc3RhcnQpKSB7XG4gICAgICAgICAgICBzdGFydCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5hYnMoc3RhcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ3V0U3RyaW5nKHN0YXJ0LCBlbmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN1YnN0ci1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHIoc3RhcnQ6IG51bWJlciwgbGVuZ3RoPzogbnVtYmVyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGxlbmd0aCAhPSBudWxsID8gbGVuZ3RoICsgc3RhcnQgOiBsZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNsaWNlLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHNsaWNlKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kIDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGFyQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCFwb3MpIHtcbiAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuQ3V0U3RyaW5nKHBvcywgcG9zICsgMSk7XG4gICAgfVxuXG4gICAgcHVibGljIGF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGFyQ29kZUF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jaGFyQ29kZUF0KDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb2RlUG9pbnRBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY29kZVBvaW50QXQoMCk7XG4gICAgfVxuXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYXIgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICAgICAgY2hhci5EYXRhQXJyYXkucHVzaChpKTtcbiAgICAgICAgICAgIHlpZWxkIGNoYXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TGluZShsaW5lOiBudW1iZXIsIHN0YXJ0RnJvbU9uZSA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXQoJ1xcbicpW2xpbmUgLSArc3RhcnRGcm9tT25lXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb252ZXJ0IHVmdC0xNiBsZW5ndGggdG8gY291bnQgb2YgY2hhcnNcbiAgICAgKiBAcGFyYW0gaW5kZXggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGFyTGVuZ3RoKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGluZGV4IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIGluZGV4IC09IGNoYXIudGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoaW5kZXggPD0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuaW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxhc3RJbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmxhc3RJbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBhID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoZSBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdW5pY29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRUZXh0QWZ0ZXIodGhpcy51bmljb2RlTWUoaS50ZXh0KSwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWFyY2gocmVnZXg6IFJlZ0V4cCB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLnNlYXJjaChyZWdleCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuc3RhcnRzV2l0aChzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kc1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5lbmRzV2l0aChzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5jbHVkZXMoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5pbmNsdWRlcyhzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVN0YXJ0KCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1FbmQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1FbmQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1SaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKS50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIFNwYWNlT25lKGFkZEluc2lkZT86IHN0cmluZykge1xuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuYXQoMCk7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuYXQodGhpcy5sZW5ndGggLSAxKTtcbiAgICAgICAgY29uc3QgY29weSA9IHRoaXMuQ2xvbmUoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHN0YXJ0LmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRCZWZvcmUoYWRkSW5zaWRlIHx8IHN0YXJ0LmVxLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuaW5mbywgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEFmdGVyKGFkZEluc2lkZSB8fCBlbmQuZXEsIGVuZC5EZWZhdWx0SW5mb1RleHQuaW5mbywgZW5kLkRlZmF1bHRJbmZvVGV4dC5saW5lLCBlbmQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBY3Rpb25TdHJpbmcoQWN0OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBuZXdTdHJpbmcuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBpLnRleHQgPSBBY3QoaS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlTG93ZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlTG93ZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVVcHBlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVVcHBlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1VwcGVyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b1VwcGVyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb3dlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy5ub3JtYWxpemUoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBTdHJpbmdJbmRleGVyKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKTogU3RyaW5nSW5kZXhlckluZm9bXSB7XG4gICAgICAgIGlmIChyZWdleCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4LCByZWdleC5mbGFncy5yZXBsYWNlKCdnJywgJycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbFNwbGl0OiBTdHJpbmdJbmRleGVySW5mb1tdID0gW107XG5cbiAgICAgICAgbGV0IG1haW5UZXh0ID0gdGhpcy5PbmVTdHJpbmcsIGhhc01hdGg6IFJlZ0V4cE1hdGNoQXJyYXkgPSBtYWluVGV4dC5tYXRjaChyZWdleCksIGFkZE5leHQgPSAwLCBjb3VudGVyID0gMDtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgYWRkTmV4dCArPSBpbmRleCArIGxlbmd0aDtcblxuICAgICAgICAgICAgaGFzTWF0aCA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxTcGxpdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCkge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoJ24nLCBzZWFyY2hWYWx1ZSkudW5pY29kZS5lcTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3BsaXQoc2VwYXJhdG9yOiBzdHJpbmcgfCBSZWdFeHAsIGxpbWl0PzogbnVtYmVyKTogU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgY29uc3QgYWxsU3BsaXRlZCA9IHRoaXMuU3RyaW5nSW5kZXhlcih0aGlzLlJlZ2V4SW5TdHJpbmcoc2VwYXJhdG9yKSwgbGltaXQpO1xuICAgICAgICBjb25zdCBuZXdTcGxpdDogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxTcGxpdGVkKSB7XG4gICAgICAgICAgICBuZXdTcGxpdC5wdXNoKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQsIGkuaW5kZXgpKTtcbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTcGxpdC5wdXNoKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3BsaXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGVhdChjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgam9pbihhcnI6IFN0cmluZ1RyYWNrZXJbXSl7XG4gICAgICAgIGxldCBhbGwgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICBmb3IoY29uc3QgaSBvZiBhcnIpe1xuICAgICAgICAgICAgYWxsLkFkZENsb25lKGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBsYWNlV2l0aFRpbWVzKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYWxsU3BsaXRlZCA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSwgbGltaXQpO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxTcGxpdGVkKSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuQ2xvbmVQbHVzKFxuICAgICAgICAgICAgICAgIHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQsIGkuaW5kZXgpLFxuICAgICAgICAgICAgICAgIHJlcGxhY2VWYWx1ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZShzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUsIHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwID8gdW5kZWZpbmVkIDogMSlcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZXIoc2VhcmNoVmFsdWU6IFJlZ0V4cCwgZnVuYzogKGRhdGE6IEFycmF5TWF0Y2gpID0+IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgbGV0IGNvcHkgPSB0aGlzLkNsb25lKCksIFNwbGl0VG9SZXBsYWNlOiBBcnJheU1hdGNoO1xuICAgICAgICBmdW5jdGlvbiBSZU1hdGNoKCkge1xuICAgICAgICAgICAgU3BsaXRUb1JlcGxhY2UgPSBjb3B5Lm1hdGNoKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBSZU1hdGNoKCk7XG5cbiAgICAgICAgY29uc3QgbmV3VGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGNvcHkuU3RhcnRJbmZvKTtcblxuICAgICAgICB3aGlsZSAoU3BsaXRUb1JlcGxhY2UpIHtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhjb3B5LnN1YnN0cmluZygwLCBTcGxpdFRvUmVwbGFjZS5pbmRleCkpO1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGZ1bmMoU3BsaXRUb1JlcGxhY2UpKTtcblxuICAgICAgICAgICAgY29weSA9IGNvcHkuc3Vic3RyaW5nKFNwbGl0VG9SZXBsYWNlLmluZGV4ICsgU3BsaXRUb1JlcGxhY2VbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIFJlTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdUZXh0LlBsdXMoY29weSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJlcGxhY2VyQXN5bmMoc2VhcmNoVmFsdWU6IFJlZ0V4cCwgZnVuYzogKGRhdGE6IEFycmF5TWF0Y2gpID0+IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pIHtcbiAgICAgICAgbGV0IGNvcHkgPSB0aGlzLkNsb25lKCksIFNwbGl0VG9SZXBsYWNlOiBBcnJheU1hdGNoO1xuICAgICAgICBmdW5jdGlvbiBSZU1hdGNoKCkge1xuICAgICAgICAgICAgU3BsaXRUb1JlcGxhY2UgPSBjb3B5Lm1hdGNoKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBSZU1hdGNoKCk7XG5cbiAgICAgICAgY29uc3QgbmV3VGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGNvcHkuU3RhcnRJbmZvKTtcblxuICAgICAgICB3aGlsZSAoU3BsaXRUb1JlcGxhY2UpIHtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhjb3B5LnN1YnN0cmluZygwLCBTcGxpdFRvUmVwbGFjZS5pbmRleCkpO1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGF3YWl0IGZ1bmMoU3BsaXRUb1JlcGxhY2UpKTtcblxuICAgICAgICAgICAgY29weSA9IGNvcHkuc3Vic3RyaW5nKFNwbGl0VG9SZXBsYWNlLmluZGV4ICsgU3BsaXRUb1JlcGxhY2VbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIFJlTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdUZXh0LlBsdXMoY29weSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlKVxuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaEFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgY29uc3QgYWxsTWF0Y2hzID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgY29uc3QgbWF0aEFycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbE1hdGNocykge1xuICAgICAgICAgICAgbWF0aEFycmF5LnB1c2godGhpcy5zdWJzdHIoaS5pbmRleCwgaS5sZW5ndGgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXRoQXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBBcnJheU1hdGNoIHwgU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwICYmIHNlYXJjaFZhbHVlLmdsb2JhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hBbGwoc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuT25lU3RyaW5nLm1hdGNoKHNlYXJjaFZhbHVlKTtcblxuICAgICAgICBpZiAoZmluZCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBSZXN1bHRBcnJheTogQXJyYXlNYXRjaCA9IFtdO1xuXG4gICAgICAgIFJlc3VsdEFycmF5WzBdID0gdGhpcy5zdWJzdHIoZmluZC5pbmRleCwgZmluZC5zaGlmdCgpLmxlbmd0aCk7XG4gICAgICAgIFJlc3VsdEFycmF5LmluZGV4ID0gZmluZC5pbmRleDtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5wdXQgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgbGV0IG5leHRNYXRoID0gUmVzdWx0QXJyYXlbMF0uQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmluZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKE51bWJlcihpKSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGUgPSBmaW5kW2ldO1xuXG4gICAgICAgICAgICBpZiAoZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVzdWx0QXJyYXkucHVzaCg8YW55PmUpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmaW5kSW5kZXggPSBuZXh0TWF0aC5pbmRleE9mKGUpO1xuICAgICAgICAgICAgUmVzdWx0QXJyYXkucHVzaChuZXh0TWF0aC5zdWJzdHIoZmluZEluZGV4LCBlLmxlbmd0aCkpO1xuICAgICAgICAgICAgbmV4dE1hdGggPSBuZXh0TWF0aC5zdWJzdHJpbmcoZmluZEluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZXN1bHRBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0cmFjdEluZm8odHlwZSA9ICc8bGluZT4nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8uc3BsaXQodHlwZSkucG9wKCkudHJpbSgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBlcnJvciBpbmZvIGZvcm0gZXJyb3IgbWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBkZWJ1Z0xpbmUoeyBtZXNzYWdlLCB0ZXh0LCBsb2NhdGlvbiwgbGluZSwgY29sfTogeyBtZXNzYWdlPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBsb2NhdGlvbj86IHsgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgbGluZVRleHQ/OiBzdHJpbmcgfSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyfSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUgPz8gbG9jYXRpb24/LmxpbmUgPz8gMSksIGNvbHVtbiA9IGNvbCA/PyBsb2NhdGlvbj8uY29sdW1uID8/IDA7XG4gICAgICAgIGlmIChzZWFyY2hMaW5lLnN0YXJ0c1dpdGgoJy8vJykpIHtcbiAgICAgICAgICAgIHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUoKGxpbmUgPz8gbG9jYXRpb24/LmxpbmUpIC0gMSk7XG4gICAgICAgICAgICBjb2x1bW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBzZWFyY2hMaW5lLmF0KGNvbHVtbi0xKS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIHJldHVybiBgJHt0ZXh0IHx8IG1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrc2VhcmNoTGluZS5leHRyYWN0SW5mbygpfToke2RhdGEubGluZX06JHtkYXRhLmNoYXJ9JHtsb2NhdGlvbj8ubGluZVRleHQgPyAnXFxMaW5lOiBcIicgKyBsb2NhdGlvbi5saW5lVGV4dDogJ1wiJ31gO1xuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdXaXRoVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gb3V0cHV0V2l0aE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uKVxuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgICAgIHJldHVybiBvdXRwdXRNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbiwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpXG4gICAgfVxufSIsICJpbXBvcnQge3Byb21pc2VzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmNvbnN0IGxvYWRQYXRoID0gdHlwZW9mIGVzYnVpbGQgIT09ICd1bmRlZmluZWQnID8gJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvJzogJy8uLi8nO1xuY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwgKyBsb2FkUGF0aCArICdidWlsZC53YXNtJykpKTtcbmNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG5jb25zdCB3YXNtID0gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5sZXQgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldFVpbnQ4TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQ4TWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQ4TWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RW5jb2RlciA6IFRleHRFbmNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgbFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbShwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXIodGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXIocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxubGV0IGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRJbnQzMk1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRJbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRJbnQzMk1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dERlY29kZXIgOiBUZXh0RGVjb2RlcjtcblxubGV0IGNhY2hlZFRleHREZWNvZGVyID0gbmV3IGxUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG4vKipcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2Vycm9ycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5nZXRfZXJyb3JzKHJldHB0cik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gYmxvY2tcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfYmxvY2sodGV4dCwgYmxvY2spIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGJsb2NrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfYmxvY2socHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSBza2lwX3NwZWNpYWxfdGFnXG4qIEBwYXJhbSB7c3RyaW5nfSBzaW1wbGVfc2tpcFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfY29tcG9uZW50KHNraXBfc3BlY2lhbF90YWcsIHNpbXBsZV9za2lwKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChza2lwX3NwZWNpYWxfdGFnLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzaW1wbGVfc2tpcCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHdhc20uaW5zZXJ0X2NvbXBvbmVudChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgZW5kX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZF90eXBlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfZGVmKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gcV90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX3EodGV4dCwgcV90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfcShwdHIwLCBsZW4wLCBxX3R5cGUuY29kZVBvaW50QXQoMCkpO1xuICAgIHJldHVybiByZXQgPj4+IDA7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanModGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanNfbWluKHRleHQsIG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKG5hbWUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzX21pbihyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZWpzX3BhcnNlKHRleHQsIHN0YXJ0LCBlbmQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHN0YXJ0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMiA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5lanNfcGFyc2UocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwdHIyLCBsZW4yKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBjb25zdCBTaW1wbGVTa2lwID0gWyd0ZXh0YXJlYScsJ3NjcmlwdCcsICdzdHlsZSddO1xuZXhwb3J0IGNvbnN0IFNraXBTcGVjaWFsVGFnID0gW1tcIiVcIiwgXCIlXCJdLCBbXCIje2RlYnVnfVwiLCBcIntkZWJ1Z30jXCJdXTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgZmluZF9lbmRfb2ZfZGVmLCBmaW5kX2VuZF9vZl9xLCBmaW5kX2VuZF9ibG9jayB9IGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyc7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMnO1xuaW1wb3J0IHsgZ2V0RGlybmFtZSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBlbmQgb2YgcXVvdGF0aW9uIG1hcmtzLCBza2lwcGluZyB0aGluZ3MgbGlrZSBlc2NhcGluZzogXCJcXFxcXCJcIlxuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW50T2ZRKHRleHQ6IHN0cmluZywgcVR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9xKHRleHQsIHFUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGNoYXIgc2tpcHBpbmcgZGF0YSBpbnNpZGUgcXVvdGF0aW9uIG1hcmtzXG4gICAgICogQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIGZpbmRFbmRPZkRlZih0ZXh0OiBzdHJpbmcsIEVuZFR5cGU6IHN0cmluZ1tdIHwgc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KEVuZFR5cGUpKSB7XG4gICAgICAgICAgICBFbmRUeXBlID0gW0VuZFR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBKU09OLnN0cmluZ2lmeShFbmRUeXBlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2FtZSBhcyAnZmluZEVuZE9mRGVmJyBvbmx5IHdpdGggb3B0aW9uIHRvIGN1c3RvbSAnb3BlbicgYW5kICdjbG9zZSdcbiAgICAgKiBgYGBqc1xuICAgICAqIEZpbmRFbmRPZkJsb2NrKGBjb29sIFwifVwiIHsgZGF0YSB9IH0gbmV4dGAsICd7JywgJ30nKVxuICAgICAqIGBgYFxuICAgICAqIGl0IHdpbGwgcmV0dXJuIHRoZSAxOCAtPiBcIn0gbmV4dFwiXG4gICAgICogIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBGaW5kRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIG9wZW46IHN0cmluZywgZW5kOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfYmxvY2sodGV4dCwgb3BlbiArIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgU2ltcGxlU2tpcDogc3RyaW5nW10gPSBTZXR0aW5ncy5TaW1wbGVTa2lwO1xuICAgIFNraXBTcGVjaWFsVGFnOiBzdHJpbmdbXVtdID0gU2V0dGluZ3MuU2tpcFNwZWNpYWxUYWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW50TmV3PzogYW55KSB7IH1cblxuICAgIHByaXZhdGUgcHJpbnRFcnJvcnModGV4dDogU3RyaW5nVHJhY2tlciwgZXJyb3JzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByaW50TmV3KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIEpTT04ucGFyc2UoZXJyb3JzKS5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXcoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7aS50eXBlX25hbWV9XCIsIHVzZWQgaW46ICR7dGV4dC5hdChOdW1iZXIoaS5pbmRleCkpLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXIodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFyJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFySFRNTCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXJIVE1MJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cbn1cblxudHlwZSBQYXJzZUJsb2NrcyA9IHsgbmFtZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciB9W11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlModGV4dDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKUycsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKU01pbmkodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTTWluaScsIFt0ZXh0LGZpbmRdKSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVKU1BhcnNlcih0ZXh0OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnRUpTUGFyc2VyJywgW3RleHQsIHN0YXJ0LCBlbmRdKSk7XG59IiwgIlxuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuaW50ZXJmYWNlIFNwbGl0VGV4dCB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHR5cGVfbmFtZTogc3RyaW5nLFxuICAgIGlzX3NraXA6IGJvb2xlYW5cbn1cblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcGFyc2Vfc3RyZWFtID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL3JlYWRlci93b3JrZXIuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dFN0cmVhbSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFNwbGl0VGV4dFtdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2J1aWxkX3N0cmVhbScsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZEZWZTa2lwQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZmluZF9lbmRfb2ZfZGVmX3NraXBfYmxvY2snLCBbdGV4dCwgSlNPTi5zdHJpbmdpZnkodHlwZXMpXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2VuZF9vZl9ibG9jaycsIFt0ZXh0LCB0eXBlcy5qb2luKCcnKV0pO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgUmVwbGFjZUFsbCh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQuc3BsaXQoZmluZCkpIHtcbiAgICAgICAgICAgIG5ld1RleHQgKz0gcmVwbGFjZSArIGk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dC5zdWJzdHJpbmcocmVwbGFjZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuXG5hYnN0cmFjdCBjbGFzcyBSZUJ1aWxkQ29kZUJhc2ljIGV4dGVuZHMgQmFzZUVudGl0eUNvZGUge1xuICAgIHB1YmxpYyBQYXJzZUFycmF5OiBTcGxpdFRleHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuUGFyc2VBcnJheSA9IFBhcnNlQXJyYXk7XG4gICAgfVxuXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBsZXQgT3V0U3RyaW5nID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBPdXRTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUmVwbGFjZUFsbChPdXRTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuXG5cbnR5cGUgRGF0YUNvZGVJbmZvID0ge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbnB1dHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBjbGFzcyBSZUJ1aWxkQ29kZVN0cmluZyBleHRlbmRzIFJlQnVpbGRDb2RlQmFzaWMge1xuICAgIHByaXZhdGUgRGF0YUNvZGU6IERhdGFDb2RlSW5mbztcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKFBhcnNlQXJyYXkpO1xuICAgICAgICB0aGlzLkRhdGFDb2RlID0geyB0ZXh0OiBcIlwiLCBpbnB1dHM6IFtdIH07XG4gICAgICAgIHRoaXMuQ3JlYXRlRGF0YUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgQ29kZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUudGV4dDtcbiAgICB9XG5cbiAgICBzZXQgQ29kZUJ1aWxkVGV4dCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgQWxsSW5wdXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDcmVhdGVEYXRhQ29kZSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGkuaXNfc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBgPHwke3RoaXMuRGF0YUNvZGUuaW5wdXRzLmxlbmd0aH18JHtpLnR5cGVfbmFtZSA/PyAnJ318PmA7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS5pbnB1dHMucHVzaChpLnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIDx8fD4gc3RhcnQgd2l0aCBhICgrLikgbGlrZSB0aGF0IGZvciBleGFtcGxlLCBcIisuPHx8PlwiLCB0aGUgdXBkYXRlIGZ1bmN0aW9uIHdpbGwgZ2V0IHRoZSBsYXN0IFwiU2tpcFRleHRcIiBpbnN0ZWFkIGdldHRpbmcgdGhlIG5ldyBvbmVcbiAgICAgKiBzYW1lIHdpdGggYSAoLS4pIGp1c3QgZm9yIGlnbm9yaW5nIGN1cnJlbnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB0aGUgYnVpbGRlZCBjb2RlXG4gICAgICovXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkRhdGFDb2RlLnRleHQucmVwbGFjZSgvPFxcfChbMC05XSspXFx8W1xcd10qXFx8Pi9naSwgKF8sIGcxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHNbZzFdO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuUmVwbGFjZUFsbChuZXdTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIGlmKGkuZXEudHJpbSgpLmxlbmd0aClcbiAgICAgICAgICAgICAgICBXaXRoSW5mby5QbHVzKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgLy8hJHtpLmxpbmVJbmZvfVxcbmApLFxuICAgICAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiAoY291bnQgIT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBXaXRoSW5mbztcbiAgICB9XG5cbiAgICBhc3luYyBmaW5kU2NyaXB0cygpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXdhaXQgRUpTUGFyc2VyKHRoaXMudGV4dC5lcSwgdGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGxldCBzdWJzdHJpbmcgPSB0aGlzLnRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gaS5uYW1lO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlKCR7c3Vic3RyaW5nfSk7YDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGVTYWZlKCR7c3Vic3RyaW5nfSk7YDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVidWdcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGBcXG5ydW5fc2NyaXB0X25hbWUgPSBcXGAke0pTUGFyc2VyLmZpeFRleHQoc3Vic3RyaW5nKX1cXGA7YFxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ25vLXRyYWNrJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IHN1YnN0cmluZyxcbiAgICAgICAgICAgICAgICB0eXBlOiA8YW55PnR5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFRleHQodGV4dDogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9gL2dpLCAnXFxcXGAnKS5yZXBsYWNlKC9cXCQvZ2ksICdcXFxcdTAwMjQnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dFNpbXBsZVF1b3Rlcyh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKTtcbiAgICB9XG5cbiAgICBSZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgY29uc3QgYWxsY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkudHlwZSA9PSAnbm8tdHJhY2snKSB7XG4gICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKHRoaXMuc3RhcnQsICchJywgaS50ZXh0LCB0aGlzLmVuZCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKHRoaXMuc3RhcnQsIGkudGV4dCwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbGNvZGU7XG4gICAgfVxuXG4gICAgQnVpbGRBbGwoaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBydW5TY3JpcHQgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcblxuICAgICAgICBpZiAoIXRoaXMudmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzJGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpc0RlYnVnICYmIGkudHlwZSA9PSAnc2NyaXB0Jykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBcXG5ydW5fc2NyaXB0X2NvZGU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2ApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TY3JpcHRXaXRoSW5mbyhpLnRleHQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoaS50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcHJpbnRFcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+JHttZXNzYWdlfTwvcD5gO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBSdW5BbmRFeHBvcnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcih0ZXh0LCBwYXRoKVxuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5CdWlsZEFsbChpc0RlYnVnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzcGxpdDJGcm9tRW5kKHRleHQ6IHN0cmluZywgc3BsaXRDaGFyOiBzdHJpbmcsIG51bVRvU3BsaXRGcm9tRW5kID0gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGV4dC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT0gc3BsaXRDaGFyKSB7XG4gICAgICAgICAgICAgICAgbnVtVG9TcGxpdEZyb21FbmQtLTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG51bVRvU3BsaXRGcm9tRW5kID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3RleHQuc3Vic3RyaW5nKDAsIGkpLCB0ZXh0LnN1YnN0cmluZyhpICsgMSldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcbiAgICB9XG59XG5cblxuLy9idWlsZCBzcGVjaWFsIGNsYXNzIGZvciBwYXJzZXIgY29tbWVudHMgLyoqLyBzbyB5b3UgYmUgYWJsZSB0byBhZGQgUmF6b3IgaW5zaWRlIG9mIHN0eWxlIG90IHNjcmlwdCB0YWdcblxuaW50ZXJmYWNlIEdsb2JhbFJlcGxhY2VBcnJheSB7XG4gICAgdHlwZTogJ3NjcmlwdCcgfCAnbm8tdHJhY2snLFxuICAgIHRleHQ6IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGNsYXNzIEVuYWJsZUdsb2JhbFJlcGxhY2Uge1xuICAgIHByaXZhdGUgc2F2ZWRCdWlsZERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheVtdID0gW107XG4gICAgcHJpdmF0ZSBidWlsZENvZGU6IFJlQnVpbGRDb2RlU3RyaW5nO1xuICAgIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVwbGFjZXI6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRkVGV4dCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlciA9IFJlZ0V4cChgJHthZGRUZXh0fVxcXFwvXFxcXCohc3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5cXFxcKlxcXFwvfHN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+YCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5idWlsZENvZGUgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcoYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGF3YWl0IHRoaXMuRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGUpKSk7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBFeHRyYWN0QW5kU2F2ZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29kZSA9IG5ldyBKU1BhcnNlcihjb2RlLCB0aGlzLnBhdGgpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29kZS5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29kZS52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRCdWlsZERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGkudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBgc3lzdGVtLS08fGVqc3wke2NvdW50ZXIrK318PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFBhcnNlT3V0c2lkZU9mQ29tbWVudCh0ZXh0OiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2VyKC9zeXN0ZW0tLTxcXHxlanNcXHwoWzAtOV0pXFx8Pi8sIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBTcGxpdFRvUmVwbGFjZVsxXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihpbmRleC5TdGFydEluZm8pLlBsdXMkYCR7dGhpcy5hZGRUZXh0fS8qIXN5c3RlbS0tPHxlanN8JHtpbmRleH18PiovYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIFN0YXJ0QnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb21tZW50cyA9IG5ldyBKU1BhcnNlcihuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0KSwgdGhpcy5wYXRoLCAnLyonLCAnKi8nKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvbW1lbnRzLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb21tZW50cy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gdGhpcy5QYXJzZU91dHNpZGVPZkNvbW1lbnQoaS50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQgPSBleHRyYWN0Q29tbWVudHMuUmVCdWlsZFRleHQoKS5lcTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2RlLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVzdG9yZUFzQ29kZShEYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKERhdGEudGV4dC5TdGFydEluZm8pLlBsdXMkYDwlJHtEYXRhLnR5cGUgPT0gJ25vLXRyYWNrJyA/ICchJzogJyd9JHtEYXRhLnRleHR9JT5gO1xuICAgIH1cblxuICAgIHB1YmxpYyBSZXN0b3JlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2VyKHRoaXMucmVwbGFjZXIsIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIoU3BsaXRUb1JlcGxhY2VbMV0gPz8gU3BsaXRUb1JlcGxhY2VbMl0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5SZXN0b3JlQXNDb2RlKHRoaXMuc2F2ZWRCdWlsZERhdGFbaW5kZXhdKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBidWlsZCwgTWVzc2FnZSwgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi9wcmludE1lc3NhZ2UnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlKUyh0ZXh0OiBzdHJpbmcsIHRyYWNrZXI6IFN0cmluZ1RyYWNrZXIpe1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCB3YXJuaW5nc30gPSBhd2FpdCB0cmFuc2Zvcm0odGV4dCwge21pbmlmeTogdHJ1ZX0pO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIodHJhY2tlciwgd2FybmluZ3MpO1xuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodHJhY2tlciwgZXJyKVxuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbn0iLCAiaW1wb3J0IHsgYnVpbGQsIE1lc3NhZ2UsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSAnc291cmNlLW1hcCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYCR7ZXJyLnRleHR9LCBvbiBmaWxlIC0+ICR7ZmlsZVBhdGggPz8gZXJyLmxvY2F0aW9uLmZpbGV9OiR7ZXJyPy5sb2NhdGlvbj8ubGluZSA/PyAwfToke2Vycj8ubG9jYXRpb24/LmNvbHVtbiA/PyAwfWBcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3Qgc291cmNlID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcihlcnIubG9jYXRpb24pO1xuICAgICAgICBpZihzb3VyY2Uuc291cmNlKVxuICAgICAgICAgICAgZXJyLmxvY2F0aW9uID0gPGFueT5zb3VyY2U7XG4gICAgfVxuICAgIEVTQnVpbGRQcmludEVycm9yKHtlcnJvcnN9LCBmaWxlUGF0aCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzOiBNZXNzYWdlW10sIGZpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBgJHt3YXJuLnRleHR9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyB3YXJuLmxvY2F0aW9uLmZpbGV9OiR7d2Fybj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHt3YXJuPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwgd2FybmluZ3M6IE1lc3NhZ2VbXSkge1xuICAgIGZvciAoY29uc3Qgd2FybiBvZiB3YXJuaW5ncykge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogd2Fybi5wbHVnaW5OYW1lLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUod2FybilcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwge2Vycm9yc306e2Vycm9yczogTWVzc2FnZVtdfSkge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZShlcnIpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwgImltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcblxuZXhwb3J0IGludGVyZmFjZSBQcmV2ZW50TG9nIHtcbiAgICBpZD86IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgZXJyb3JOYW1lOiBzdHJpbmcsXG4gICAgdHlwZT86IFwid2FyblwiIHwgXCJlcnJvclwiXG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nczoge1ByZXZlbnRFcnJvcnM6IHN0cmluZ1tdfSA9IHtcbiAgICBQcmV2ZW50RXJyb3JzOiBbXVxufVxuXG5jb25zdCBQcmV2ZW50RG91YmxlTG9nOiBzdHJpbmdbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgQ2xlYXJXYXJuaW5nID0gKCkgPT4gUHJldmVudERvdWJsZUxvZy5sZW5ndGggPSAwO1xuXG4vKipcbiAqIElmIHRoZSBlcnJvciBpcyBub3QgaW4gdGhlIFByZXZlbnRFcnJvcnMgYXJyYXksIHByaW50IHRoZSBlcnJvclxuICogQHBhcmFtIHtQcmV2ZW50TG9nfSAgLSBgaWRgIC0gVGhlIGlkIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByaW50SWZOZXcoe2lkLCB0ZXh0LCB0eXBlID0gXCJ3YXJuXCIsIGVycm9yTmFtZX06IFByZXZlbnRMb2cpIHtcbiAgICBpZighUHJldmVudERvdWJsZUxvZy5pbmNsdWRlcyhpZCA/PyB0ZXh0KSAmJiAhU2V0dGluZ3MuUHJldmVudEVycm9ycy5pbmNsdWRlcyhlcnJvck5hbWUpKXtcbiAgICAgICAgcHJpbnRbdHlwZV0odGV4dC5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJyksIGBcXG5cXG5FcnJvciBjb2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKTtcbiAgICAgICAgUHJldmVudERvdWJsZUxvZy5wdXNoKGlkID8/IHRleHQpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogc3RyaW5nLCBwYXJhbXM6IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3IgPSBcIiR7c2VsZWN0b3J9XCIsIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke2F3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSl9XG4gICAgICAgIHZhciBleHBvcnRzID0gJHtuYW1lfS5leHBvcnRzO1xuICAgICAgICByZXR1cm4gc2VuZFRvU2VsZWN0b3Ioc2VsZWN0b3IsIG91dF9ydW5fc2NyaXB0LnRleHQpO1xuICAgIH1cXG4ke25hbWV9LmV4cG9ydHMgPSB7fTtgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIGRhdGFUYWcuZ2V0VmFsdWUoJ3BhcmFtcycpLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCdzZWxlY3RvcicpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6ICdleHRlcm5hbCcsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIilcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICdqc3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge21hcCwgY29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG4gICAgICAgIFxuICAgICAgICBSZXNDb2RlID0gU2F2ZVNlcnZlckNvZGUuUmVzdG9yZUNvZGUoYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIG1hcCkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4vU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG1hcCA9IHR5cGVvZiBzb3VyY2VNYXAgPT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHNvdXJjZU1hcCk6IHNvdXJjZU1hcDtcblxuICAgIGNvbnN0IHRyYWNrQ29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIGNvbnN0IHNwbGl0TGluZXMgPSB0cmFja0NvZGUuc3BsaXQoJ1xcbicpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGlzTWFwID0gc3BsaXRMaW5lc1ttLmdlbmVyYXRlZExpbmUgLSAxXTtcbiAgICAgICAgaWYgKCFpc01hcCkgcmV0dXJuO1xuXG5cbiAgICAgICAgbGV0IGNoYXJDb3VudCA9IDE7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBpc01hcC5zdWJzdHJpbmcobS5nZW5lcmF0ZWRDb2x1bW4gPyBtLmdlbmVyYXRlZENvbHVtbiAtIDE6IDApLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgICAgICBpLmluZm8gPSBtLnNvdXJjZTtcbiAgICAgICAgICAgIGkubGluZSA9IG0ub3JpZ2luYWxMaW5lO1xuICAgICAgICAgICAgaS5jaGFyID0gY2hhckNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFja0NvZGU7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlcikge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIpO1xuICAgIHJldHVybiBuZXdUcmFja2VyO1xufVxuXG5mdW5jdGlvbiBtZXJnZVNhc3NJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgZ2VuZXJhdGVkOiBTdHJpbmdUcmFja2VyLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxMaW5lcyA9IG9yaWdpbmFsLnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ2VuZXJhdGVkLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgIGlmKGl0ZW0uaW5mbyA9PSBteVNvdXJjZSl7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBvcmlnaW5hbExpbmVzW2l0ZW0ubGluZSAtIDFdLmF0KGl0ZW0uY2hhci0xKT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgICAgIGl0ZW0uaW5mbyA9IGluZm87XG4gICAgICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbS5pbmZvKSB7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgoaXRlbS5pbmZvKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja1RvT3JpZ2luYWxTc3Mob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXAsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuZXdUcmFja2VyID0gYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIHNvdXJjZU1hcCk7XG4gICAgbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIsIG15U291cmNlKTtcblxuICAgIHJldHVybiBuZXdUcmFja2VyO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4uL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUVxID0gQmV0d2VlblRhZ0RhdGEuZXEsIEJldHdlZW5UYWdEYXRhRXFBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YUVxLnRyaW0oKSwgaXNNb2RlbCA9IHRhZ0RhdGEuZ2V0VmFsdWUoJ3R5cGUnKSA9PSAnbW9kdWxlJywgaXNNb2RlbFN0cmluZ0NhY2hlID0gaXNNb2RlbCA/ICdzY3JpcHRNb2R1bGUnIDogJ3NjcmlwdCc7XG5cbiAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5pbmNsdWRlcyhCZXR3ZWVuVGFnRGF0YUVxQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5wdXNoKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pO1xuXG4gICAgbGV0IHJlc3VsdENvZGUgPSAnJywgcmVzdWx0TWFwOiBzdHJpbmc7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlbWFwOiBzZXNzaW9uSW5mby5kZWJ1ZyA/ICdleHRlcm5hbCcgOiBmYWxzZSxcbiAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ2pzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJKU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0c3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiVFNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IG1hcCwgY29kZSwgd2FybmluZ3MgfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YS5lcSwgQWRkT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgd2FybmluZ3MpO1xuXG4gICAgICAgIHJlc3VsdENvZGUgPSBjb2RlO1xuICAgICAgICByZXN1bHRNYXAgPSBtYXA7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgZXJyKVxuICAgIH1cblxuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKGlzTW9kZWwgPyAnbW9kdWxlJyA6ICdzY3JpcHQnLCB0YWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0TWFwKSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihKU09OLnBhcnNlKHJlc3VsdE1hcCksIEJldHdlZW5UYWdEYXRhLCByZXN1bHRDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwdXNoU3R5bGUuYWRkVGV4dChyZXN1bHRDb2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHNjcmlwdFdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNjcmlwdFdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGlmIChkYXRhVGFnLmhhdmUoJ3NyYycpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtCZXR3ZWVuVGFnRGF0YX08L3NjcmlwdD5gXG4gICAgICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5yZW1vdmUoJ2xhbmcnKSB8fCAnanMnO1xuXG4gICAgaWYgKGRhdGFUYWcuaGF2ZSgnc2VydmVyJykpIHtcbiAgICAgICAgZGF0YVRhZy5yZW1vdmUoJ3NlcnZlcicpO1xuICAgICAgICByZXR1cm4gc2NyaXB0V2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JpcHRXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwIH0gZnJvbSBcInNvdXJjZS1tYXAtanNcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1wb3J0ZXIob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kRmlsZVVybCh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKHVybFswXSA9PSAnLycgfHwgdXJsWzBdID09ICd+Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKFxuICAgICAgICAgICAgICAgICAgICB1cmwuc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgICAgICBwYXRoVG9GaWxlVVJMKHVybFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZywgU29tZVBsdWdpbnM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nLCBTb21lUGx1Z2luczogYW55KSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIFNvbWVQbHVnaW5zKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIHRleHQ6IGAke2Vyci5tZXNzYWdlfSxcXG5vbiBmaWxlIC0+ICR7ZmlsZVVSTFRvUGF0aChlcnIuc3Bhbi51cmwpfToke2xpbmUgPz8gMH06JHtjb2x1bW4gPz8gMH1gLFxuICAgICAgICBlcnJvck5hbWU6IGVycj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgdHlwZTogZXJyPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnI6IGFueSwgdHJhY2s6IFN0cmluZ1RyYWNrZXIpe1xuICAgIGlmKGVyci5zcGFuLnVybCkgcmV0dXJuIFByaW50U2Fzc0Vycm9yKGVycik7XG5cbiAgICBlcnIubG9jYXRpb24gPSBnZXRTYXNzRXJyb3JMaW5lKGVycik7XG4gICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIHRleHQ6IHRyYWNrLmRlYnVnTGluZShlcnIpLFxuICAgICAgICBlcnJvck5hbWU6IGVycj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgdHlwZTogZXJyPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVTYXNzKGxhbmd1YWdlOiBzdHJpbmcsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKTtcblxuICAgIGxldCByZXN1bHQ6IHNhc3MuQ29tcGlsZVJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhvdXRTdHlsZSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBzZXNzaW9uSW5mby5kZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCg8YW55Pmxhbmd1YWdlKSxcbiAgICAgICAgICAgIHN0eWxlOiBjb21wcmVzc2VkID8gJ2NvbXByZXNzZWQnIDogJ2V4cGFuZGVkJyxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcih0aGlzUGFnZSksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudFxuICAgICAgICB9KTtcbiAgICAgICAgb3V0U3R5bGUgPSByZXN1bHQ/LmNzcyA/PyBvdXRTdHlsZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKGVyci5zcGFuLnVybCk7XG4gICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICBQcmludFNhc3NFcnJvclRyYWNrZXIoZXJyLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgIHJldHVybiB7b3V0U3R5bGU6ICdTYXNzIEVycm9yIChzZWUgY29uc29sZSknfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQ/LmxvYWRlZFVybHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHJlc3VsdC5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoPGFueT5maWxlKTtcbiAgICAgICAgICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCksIEZ1bGxQYXRoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0Py5zb3VyY2VNYXAgJiYgc2Fzc0FuZFNvdXJjZShyZXN1bHQuc291cmNlTWFwLCB0aGlzUGFnZVVSTC5ocmVmKTtcbiAgICByZXR1cm4geyByZXN1bHQsIG91dFN0eWxlLCBjb21wcmVzc2VkIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgRW5hYmxlR2xvYmFsUmVwbGFjZSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZyxwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3QgU2F2ZVNlcnZlckNvZGUgPSBuZXcgRW5hYmxlR2xvYmFsUmVwbGFjZSgpO1xuICAgIGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLmxvYWQoQmV0d2VlblRhZ0RhdGEudHJpbVN0YXJ0KCksIHBhdGhOYW1lKTtcblxuICAgIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGxldCB7IG91dFN0eWxlLCBjb21wcmVzc2VkIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8sIGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKSk7XG5cbiAgICBpZiAoIWNvbXByZXNzZWQpXG4gICAgICAgIG91dFN0eWxlID0gYFxcbiR7b3V0U3R5bGV9XFxuYDtcblxuICAgIGNvbnN0IHJlU3RvcmVEYXRhID0gU2F2ZVNlcnZlckNvZGUuUmVzdG9yZUNvZGUobmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvLCBvdXRTdHlsZSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c3R5bGUke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke3JlU3RvcmVEYXRhfTwvc3R5bGU+YFxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgdGFnRGF0YU9iamVjdEFycmF5IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgTWluQ3NzIGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplcic7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4uL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgU291cmNlTWFwU3RvcmUgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcbmltcG9ydCB7IGNvbXBpbGVTYXNzIH0gZnJvbSAnLi9zYXNzJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3Qgb3V0U3R5bGVBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YS5lcS50cmltKCk7XG4gICAgaWYgKHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLmluY2x1ZGVzKG91dFN0eWxlQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGUuc3R5bGUucHVzaChvdXRTdHlsZUFzVHJpbSk7XG5cbiAgICBjb25zdCB7IHJlc3VsdCwgb3V0U3R5bGUgfSA9IGF3YWl0IGNvbXBpbGVTYXNzKGxhbmd1YWdlLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwdXNoU3R5bGUgPSBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZVBhZ2UoJ3N0eWxlJywgZGF0YVRhZywgIEJldHdlZW5UYWdEYXRhKTtcblxuICAgIGlmIChyZXN1bHQ/LnNvdXJjZU1hcClcbiAgICAgICAgcHVzaFN0eWxlLmFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKFNvdXJjZU1hcFN0b3JlLmZpeFVSTFNvdXJjZU1hcCg8YW55PnJlc3VsdC5zb3VyY2VNYXApLCBCZXR3ZWVuVGFnRGF0YSwgb3V0U3R5bGUpO1xuICAgIGVsc2VcbiAgICAgICAgcHVzaFN0eWxlLmFkZFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIHsgdGV4dDogb3V0U3R5bGUgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHN0eWxlV2l0aFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc3R5bGVXaXRoQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGRhdGFUYWcucmVtb3ZlKCdsYW5nJykgfHwgJ2Nzcyc7XG5cbiAgICBpZihkYXRhVGFnLmhhdmUoJ3NlcnZlcicpKXtcbiAgICAgICAgZGF0YVRhZy5yZW1vdmUoJ3NlcnZlcicpO1xuICAgICAgICByZXR1cm4gc3R5bGVXaXRoU2VydmVyKGxhbmd1YWdlLCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZVdpdGhDbGllbnQobGFuZ3VhZ2UsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIFN0cmluZ0FueU1hcCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoX25vZGUgZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZUluRmlsZSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIEluRm9sZGVyUGFnZVBhdGgoaW5wdXRQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcpe1xuICAgIGlmIChpbnB1dFBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChpbnB1dFBhdGhbMV0gPT0gJy8nKSB7XG4gICAgICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9sZGVyID0gcGF0aF9ub2RlLmRpcm5hbWUoc21hbGxQYXRoKTtcblxuICAgICAgICBpZihmb2xkZXIpe1xuICAgICAgICAgICAgZm9sZGVyICs9ICcvJztcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBmb2xkZXIgKyBpbnB1dFBhdGg7XG4gICAgfSBlbHNlIGlmIChpbnB1dFBhdGhbMF0gPT0gJy8nKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFnZVR5cGUgPSAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgIGlmKCFpbnB1dFBhdGguZW5kc1dpdGgocGFnZVR5cGUpKXtcbiAgICAgICAgaW5wdXRQYXRoICs9IHBhZ2VUeXBlO1xuICAgIH1cblxuICAgIHJldHVybiBpbnB1dFBhdGg7XG59XG5cbmNvbnN0IGNhY2hlTWFwOiB7IFtrZXk6IHN0cmluZ106IHtDb21waWxlZERhdGE6IFN0cmluZ1RyYWNrZXIsIG5ld1Nlc3Npb246IFNlc3Npb25CdWlsZH19ID0ge307XG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBmaWxlcGF0aCA9IGRhdGFUYWcuZ2V0VmFsdWUoXCJmcm9tXCIpO1xuXG4gICAgY29uc3QgU21hbGxQYXRoV2l0aG91dEZvbGRlciA9IEluRm9sZGVyUGFnZVBhdGgoZmlsZXBhdGgsIHR5cGUuZXh0cmFjdEluZm8oKSk7XG5cbiAgICBjb25zdCBGdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXIsIFNtYWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI7XG5cbiAgICBpZiAoIShhd2FpdCBFYXN5RnMuc3RhdChGdWxsUGF0aCwgbnVsbCwgdHJ1ZSkpLmlzRmlsZT8uKCkpIHtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICB0ZXh0OiBgXFxuUGFnZSBub3QgZm91bmQ6ICR7dHlwZS5hdCgwKS5saW5lSW5mb30gLT4gJHtGdWxsUGF0aH1gLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAncGFnZS1ub3QtZm91bmQnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgYDxwIHN0eWxlPVwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcIj5QYWdlIG5vdCBmb3VuZDogJHt0eXBlLmxpbmVJbmZvfSAtPiAke1NtYWxsUGF0aH08L3A+YClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgUmV0dXJuRGF0YTogU3RyaW5nVHJhY2tlcjtcblxuICAgIGNvbnN0IGhhdmVDYWNoZSA9IGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdO1xuICAgIGlmICghaGF2ZUNhY2hlIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShudWxsLCBoYXZlQ2FjaGUubmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgIGNvbnN0IHsgQ29tcGlsZWREYXRhLCBzZXNzaW9uSW5mbzogbmV3U2Vzc2lvbn0gPSBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShTbWFsbFBhdGhXaXRob3V0Rm9sZGVyLCBnZXRUeXBlcy5TdGF0aWMsIG51bGwsIHBhdGhOYW1lLCBkYXRhVGFnLnJlbW92ZSgnb2JqZWN0JykpO1xuICAgICAgICBuZXdTZXNzaW9uLmRlcGVuZGVuY2llc1tTbWFsbFBhdGhdID0gbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG4gICAgICAgIGRlbGV0ZSBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcy50aGlzUGFnZTtcblxuICAgICAgICBzZXNzaW9uSW5mby5leHRlbmRzKG5ld1Nlc3Npb24pXG5cbiAgICAgICAgY2FjaGVNYXBbU21hbGxQYXRoV2l0aG91dEZvbGRlcl0gPSB7Q29tcGlsZWREYXRhOjxTdHJpbmdUcmFja2VyPkNvbXBpbGVkRGF0YSwgbmV3U2Vzc2lvbn07XG4gICAgICAgIFJldHVybkRhdGEgPTxTdHJpbmdUcmFja2VyPkNvbXBpbGVkRGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgbmV3U2Vzc2lvbiB9ID0gY2FjaGVNYXBbU21hbGxQYXRoV2l0aG91dEZvbGRlcl07XG4gICBcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsIG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIFJldHVybkRhdGEgPSBDb21waWxlZERhdGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IFJldHVybkRhdGFcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcblxuLyogSXQncyBhIEpTT04gZmlsZSBtYW5hZ2VyICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZUpTT04ge1xuICAgIHByaXZhdGUgc2F2ZVBhdGg6IHN0cmluZztcbiAgICBzdG9yZTogU3RyaW5nQW55TWFwID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBhdXRvTG9hZCA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5zYXZlUGF0aCA9IGAke1N5c3RlbURhdGF9LyR7ZmlsZVBhdGh9Lmpzb25gO1xuICAgICAgICBhdXRvTG9hZCAmJiB0aGlzLmxvYWRGaWxlKCk7XG5cbiAgICAgICAgcHJvY2Vzcy5vbignU0lHSU5UJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHByb2Nlc3MuZXhpdCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb2Nlc3Mub24oJ2V4aXQnLCB0aGlzLnNhdmUuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZEZpbGUoKSB7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnNhdmVQYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBKU09OLnBhcnNlKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnNhdmVQYXRoKSB8fCAne30nKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGtleSBpcyBpbiB0aGUgc3RvcmUsIHJldHVybiB0aGUgdmFsdWUuIElmIG5vdCwgY3JlYXRlIGEgbmV3IHZhbHVlLCBzdG9yZSBpdCwgYW5kIHJldHVybiBpdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIGxvb2sgdXAgaW4gdGhlIHN0b3JlLlxuICAgICAqIEBwYXJhbSBbY3JlYXRlXSAtIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc3RyaW5nLlxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBvZiB0aGUga2V5IGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBoYXZlKGtleTogc3RyaW5nLCBjcmVhdGU/OiAoKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0b3JlW2tleV07XG4gICAgICAgIGlmIChpdGVtIHx8ICFjcmVhdGUpIHJldHVybiBpdGVtO1xuXG4gICAgICAgIGl0ZW0gPSBjcmVhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoa2V5LCBpdGVtKTtcblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHRoaXMuc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVbaV0gPSB1bmRlZmluZWRcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0b3JlW2ldXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmUoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZSh0aGlzLnNhdmVQYXRoLCB0aGlzLnN0b3JlKTtcbiAgICB9XG59IiwgImltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi9FYXN5RnNcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4vU3RvcmVKU09OXCI7XG5cbmV4cG9ydCBjb25zdCBwYWdlRGVwcyA9IG5ldyBTdG9yZUpTT04oJ1BhZ2VzSW5mbycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYW55IG9mIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhlIHBhZ2UgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBwYWdlLlxuICogQHBhcmFtIHtTdHJpbmdOdW1iZXJNYXB9IGRlcGVuZGVuY2llcyAtIEEgbWFwIG9mIGRlcGVuZGVuY2llcy4gVGhlIGtleSBpcyB0aGUgcGF0aCB0byB0aGUgZmlsZSwgYW5kXG4gKiB0aGUgdmFsdWUgaXMgdGhlIGxhc3QgbW9kaWZpZWQgdGltZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOnN0cmluZywgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSBwYWdlRGVwcy5zdG9yZVtwYXRoXSkge1xuICAgIGZvciAoY29uc3QgaSBpbiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzUGFnZScpIHtcbiAgICAgICAgICAgIHAgPSBwYXRoICsgXCIuXCIgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCAgKyBwO1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLnN0YXQoRmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSkgIT0gZGVwZW5kZW5jaWVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gIWRlcGVuZGVuY2llcztcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlcik6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEuU3RhcnRJbmZvKTtcblxuICAgIGNvbXBpbGVkU3RyaW5nLlBsdXMkIGA8JXslPiR7QmV0d2VlblRhZ0RhdGF9PCV9JT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IHJlbGF0aXZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlZ2lzdGVyRXh0ZW5zaW9uIGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyJztcbmltcG9ydCB7IHJlYnVpbGRGaWxlIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvU3RhdGljRmlsZXMnO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSwgeyByZXNvbHZlLCBjbGVhck1vZHVsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IENhcGl0YWxpemUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MnO1xuXG5hc3luYyBmdW5jdGlvbiBzc3JIVE1MKGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgRnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGNvbnN0IGdldFYgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGd2ID0gKG5hbWU6IHN0cmluZykgPT4gZGF0YVRhZy5nZXRWYWx1ZShuYW1lKS50cmltKCksXG4gICAgICAgICAgICB2YWx1ZSA9IGd2KCdzc3InICsgQ2FwaXRhbGl6ZShuYW1lKSkgfHwgZ3YobmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gZXZhbChgKCR7dmFsdWUuY2hhckF0KDApID09ICd7JyA/IHZhbHVlIDogYHske3ZhbHVlfX1gfSlgKSA6IHt9O1xuICAgIH07XG4gICAgY29uc3QgYnVpbGRQYXRoID0gYXdhaXQgcmVnaXN0ZXJFeHRlbnNpb24oRnVsbFBhdGgsIHNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoYnVpbGRQYXRoKTtcblxuICAgIGNvbnN0IHsgaHRtbCwgaGVhZCB9ID0gbW9kZS5kZWZhdWx0LnJlbmRlcihnZXRWKCdwcm9wcycpLCBnZXRWKCdvcHRpb25zJykpO1xuICAgIHNlc3Npb25JbmZvLmhlYWRIVE1MICs9IGhlYWQ7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IExhc3RTbWFsbFBhdGggPSB0eXBlLmV4dHJhY3RJbmZvKCksIExhc3RGdWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgTGFzdFNtYWxsUGF0aDtcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKExhc3RGdWxsUGF0aCwgTGFzdFNtYWxsUGF0aCwgZGF0YVRhZy5yZW1vdmUoJ2Zyb20nKSwgZ2V0VHlwZXMuU3RhdGljWzJdLCAnc3ZlbHRlJyk7XG4gICAgY29uc3QgaW5XZWJQYXRoID0gcmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBTbWFsbFBhdGgpLnJlcGxhY2UoL1xcXFwvZ2ksICcvJyk7XG5cbiAgICBzZXNzaW9uSW5mby5zdHlsZSgnLycgKyBpbldlYlBhdGggKyAnLmNzcycpO1xuXG4gICAgY29uc3QgaWQgPSBkYXRhVGFnLnJlbW92ZSgnaWQnKSB8fCBCYXNlNjRJZChpbldlYlBhdGgpLFxuICAgICAgICBoYXZlID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhVGFnLmdldFZhbHVlKG5hbWUpLnRyaW0oKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IGAsJHtuYW1lfToke3ZhbHVlLmNoYXJBdCgwKSA9PSAneycgPyB2YWx1ZSA6IGB7JHt2YWx1ZX19YH1gIDogJyc7XG4gICAgICAgIH0sIHNlbGVjdG9yID0gZGF0YVRhZy5yZW1vdmUoJ3NlbGVjdG9yJyk7XG5cbiAgICBjb25zdCBzc3IgPSAhc2VsZWN0b3IgJiYgZGF0YVRhZy5oYXZlKCdzc3InKSA/IGF3YWl0IHNzckhUTUwoZGF0YVRhZywgRnVsbFBhdGgsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pIDogJyc7XG5cblxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlKCdtb2R1bGUnLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdwYWdlJykgPyBMYXN0U21hbGxQYXRoIDogdHlwZS5leHRyYWN0SW5mbygpKS5hZGRUZXh0KFxuYGltcG9ydCBBcHAke2lkfSBmcm9tICcvJHtpbldlYlBhdGh9JztcbmNvbnN0IHRhcmdldCR7aWR9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiR7c2VsZWN0b3IgPyBzZWxlY3RvciA6ICcjJyArIGlkfVwiKTtcbnRhcmdldCR7aWR9ICYmIG5ldyBBcHAke2lkfSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQke2lkfVxuICAgICR7aGF2ZSgncHJvcHMnKSArIGhhdmUoJ29wdGlvbnMnKX0ke3NzciA/ICcsIGh5ZHJhdGU6IHRydWUnIDogJyd9XG59KTtgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBzZWxlY3RvciA/ICcnIDogYDxkaXYgaWQ9XCIke2lkfVwiPiR7c3NyfTwvZGl2PmApLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJZCh0ZXh0OiBzdHJpbmcsIG1heCA9IDEwKXtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odGV4dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnN1YnN0cmluZygwLCBtYXgpLnJlcGxhY2UoL1xcKy8sICdfJykucmVwbGFjZSgvXFwvLywgJ18nKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgIHsgQ2FwaXRhbGl6ZSwgcHJlcHJvY2VzcyB9IGZyb20gXCIuL3ByZXByb2Nlc3NcIjtcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgQ29tcGlsZU9wdGlvbnMgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IGNsZWFyTW9kdWxlLCByZXNvbHZlIH0gZnJvbSBcIi4uLy4uL3JlZGlyZWN0Q0pTXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFwiO1xuaW1wb3J0IHsgUHJpbnRTdmVsdGVXYXJuIH0gZnJvbSBcIi4vZXJyb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJFeHRlbnNpb24oZmlsZVBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBuYW1lID0gcGF0aC5wYXJzZShmaWxlUGF0aCkubmFtZS5yZXBsYWNlKC9eXFxkLywgJ18kJicpLnJlcGxhY2UoL1teYS16QS1aMC05XyRdL2csICcnKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IENvbXBpbGVPcHRpb25zID0ge1xuICAgICAgICBmaWxlbmFtZTogZmlsZVBhdGgsXG4gICAgICAgIG5hbWU6IENhcGl0YWxpemUobmFtZSksXG4gICAgICAgIGdlbmVyYXRlOiAnc3NyJyxcbiAgICAgICAgZm9ybWF0OiAnY2pzJyxcbiAgICAgICAgZGV2OiBzZXNzaW9uSW5mby5kZWJ1ZyxcbiAgICAgICAgZXJyb3JNb2RlOiAnd2FybidcbiAgICB9O1xuXG4gICAgY29uc3QgaW5TdGF0aWNGaWxlID0gcGF0aC5yZWxhdGl2ZShnZXRUeXBlcy5TdGF0aWNbMl0sIHNtYWxsUGF0aCk7XG4gICAgY29uc3QgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNGaWxlO1xuXG4gICAgY29uc3QgZnVsbEltcG9ydFBhdGggPSBmdWxsQ29tcGlsZVBhdGggKyAnLnNzci5janMnO1xuICAgIGNvbnN0IHtzdmVsdGVGaWxlcywgY29kZSwgbWFwLCBkZXBlbmRlbmNpZXN9ID0gYXdhaXQgcHJlcHJvY2VzcyhmaWxlUGF0aCwgc21hbGxQYXRoLGZ1bGxJbXBvcnRQYXRoLGZhbHNlLCcuc3NyLmNqcycpO1xuICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLGRlcGVuZGVuY2llcyk7XG4gICAgb3B0aW9ucy5zb3VyY2VtYXAgPSBtYXA7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgIGZvcihjb25zdCBmaWxlIG9mIHN2ZWx0ZUZpbGVzKXtcbiAgICAgICAgY2xlYXJNb2R1bGUocmVzb2x2ZShmaWxlKSk7IC8vIGRlbGV0ZSBvbGQgaW1wb3J0c1xuICAgICAgICBwcm9taXNlcy5wdXNoKHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGUsIEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZmlsZSksIHNlc3Npb25JbmZvKSlcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgY29uc3QgeyBqcywgY3NzLCB3YXJuaW5ncyB9ID0gc3ZlbHRlLmNvbXBpbGUoY29kZSwgPGFueT5vcHRpb25zKTtcbiAgICBQcmludFN2ZWx0ZVdhcm4od2FybmluZ3MsIGZpbGVQYXRoLCBtYXApO1xuXG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsSW1wb3J0UGF0aCwganMuY29kZSk7XG5cbiAgICBpZiAoY3NzLmNvZGUpIHtcbiAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gJy8nICsgaW5TdGF0aWNGaWxlLnNwbGl0KC9cXC98XFwvLykucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAgY3NzLmNvZGUgKz0gdG9VUkxDb21tZW50KGNzcy5tYXAsIHRydWUpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5jc3MnLCBjc3MuY29kZSA/PyAnJyk7XG5cbiAgICByZXR1cm4gZnVsbEltcG9ydFBhdGg7XG59XG4iLCAiaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgc2FzcyBmcm9tICdzYXNzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBjcmVhdGVJbXBvcnRlciwgZ2V0U2Fzc0Vycm9yTGluZSwgUHJpbnRTYXNzRXJyb3IsIFByaW50U2Fzc0Vycm9yVHJhY2tlciwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRXh0ZW5zaW9uLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwsIGJhY2tUb09yaWdpbmFsU3NzIH0gZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuXG5hc3luYyBmdW5jdGlvbiBTQVNTU3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZykge1xuICAgIGlmIChsYW5nID09ICdjc3MnKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjc3MsIHNvdXJjZU1hcCwgbG9hZGVkVXJscyB9ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoY29udGVudC5lcSwge1xuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KDxhbnk+bGFuZyksXG4gICAgICAgICAgICBzdHlsZTogc2Fzc1N0eWxlKGxhbmcsIFNvbWVQbHVnaW5zKSxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIHNvdXJjZU1hcDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogYXdhaXQgYmFja1RvT3JpZ2luYWxTc3MoY29udGVudCwgY3NzLDxhbnk+IHNvdXJjZU1hcCwgc291cmNlTWFwLnNvdXJjZXMuZmluZCh4ID0+IHguc3RhcnRzV2l0aCgnZGF0YTonKSkpLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBsb2FkZWRVcmxzLm1hcCh4ID0+IGZpbGVVUkxUb1BhdGgoPGFueT54KSlcbiAgICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3JUcmFja2VyKGVyciwgY29udGVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU2NyaXB0U3ZlbHRlKGNvbnRlbnQ6IFN0cmluZ1RyYWNrZXIsIGxhbmc6IHN0cmluZywgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10sIHN2ZWx0ZUV4dCA9ICcnKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgY29uc3QgbWFwVG9rZW4gPSB7fTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlcigvKChpbXBvcnQoe3xbIF0qXFwoPyl8KChpbXBvcnRbIF0qdHlwZXxpbXBvcnR8ZXhwb3J0KSh7fFsgXSspW1xcV1xcd10rPyh9fFsgXSspZnJvbSkpKH18WyBdKikpKFtcInwnfGBdKShbXFxXXFx3XSs/KVxcOShbIF0qXFwpKT8vbSwgYXJncyA9PiB7XG4gICAgICAgIGlmKGxhbmcgPT0gJ3RzJyAmJiBhcmdzWzVdLmVuZHNXaXRoKCcgdHlwZScpKVxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIFxuICAgICAgICBjb25zdCBleHQgPSBleHRuYW1lKGFyZ3NbMTBdLmVxKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcnKVxuICAgICAgICAgICAgaWYgKGxhbmcgPT0gJ3RzJylcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcudHMnKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcmdzWzEwXS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCcuanMnKTtcblxuXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBhcmdzWzFdLlBsdXMoYXJnc1s5XSwgYXJnc1sxMF0sIChleHQgPT0gJy5zdmVsdGUnID8gc3ZlbHRlRXh0IDogJycpLCBhcmdzWzldLCAoYXJnc1sxMV0gPz8gJycpKTtcblxuICAgICAgICBpZiAoZXh0ID09ICcuc3ZlbHRlJykge1xuICAgICAgICAgICAgY29ubmVjdFN2ZWx0ZS5wdXNoKGFyZ3NbMTBdLmVxKTtcbiAgICAgICAgfSBlbHNlIGlmIChsYW5nICE9PSAndHMnIHx8ICFhcmdzWzRdKVxuICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG5cbiAgICAgICAgY29uc3QgaWQgPSB1dWlkKCk7XG4gICAgICAgIG1hcFRva2VuW2lkXSA9IG5ld0RhdGE7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBfX190b0tlblxcYCR7aWR9XFxgYCk7XG4gICAgfSk7XG5cbiAgICBpZiAobGFuZyAhPT0gJ3RzJylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gKGF3YWl0IHRyYW5zZm9ybShjb250ZW50LmVxLCB7IC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIGxvYWRlcjogJ3RzJywgc291cmNlbWFwOiB0cnVlIH0pKTtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IGJhY2tUb09yaWdpbmFsKGNvbnRlbnQsIGNvZGUsIG1hcCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihjb250ZW50LCBlcnIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgIH1cblxuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VyKC9fX190b0tlbmAoW1xcd1xcV10rPylgL21pLCBhcmdzID0+IHtcbiAgICAgICAgcmV0dXJuIG1hcFRva2VuW2FyZ3NbMV0uZXFdID8/IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250ZW50O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcHJvY2VzcyhmdWxsUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgc2F2ZVBhdGggPSBzbWFsbFBhdGgsIGh0dHBTb3VyY2UgPSB0cnVlLCBzdmVsdGVFeHQgPSAnJykgeyAgICBcbiAgICBsZXQgdGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKHNtYWxsUGF0aCwgYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKSk7XG5cbiAgICBsZXQgc2NyaXB0TGFuZyA9ICdqcycsIHN0eWxlTGFuZyA9ICdjc3MnO1xuXG4gICAgY29uc3QgY29ubmVjdFN2ZWx0ZTogc3RyaW5nW10gPSBbXSwgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHRleHQgPSBhd2FpdCB0ZXh0LnJlcGxhY2VyQXN5bmMoLyg8c2NyaXB0KVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+XFxuPykoLio/KShcXG4/PFxcL3NjcmlwdD4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzY3JpcHRMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2pzJztcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBhd2FpdCBTY3JpcHRTdmVsdGUoYXJnc1s3XSwgc2NyaXB0TGFuZywgY29ubmVjdFN2ZWx0ZSwgc3ZlbHRlRXh0KSwgYXJnc1s4XSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHlsZUNvZGUgPSBjb25uZWN0U3ZlbHRlLm1hcCh4ID0+IGBAaW1wb3J0IFwiJHt4fS5jc3NcIjtgKS5qb2luKCcnKTtcbiAgICBsZXQgaGFkU3R5bGUgPSBmYWxzZTtcbiAgICB0ZXh0ID0gYXdhaXQgdGV4dC5yZXBsYWNlckFzeW5jKC8oPHN0eWxlKVsgXSooIGxhbmc9KCd8XCIpPyhbQS1aYS16XSspKCd8XCIpPyk/WyBdKig+KSguKj8pKDxcXC9zdHlsZT4pL3MsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICBzdHlsZUxhbmcgPSBhcmdzWzRdPy5lcSA/PyAnY3NzJztcbiAgICAgICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXM6IGRlcHMgfSA9IGF3YWl0IFNBU1NTdmVsdGUoYXJnc1s3XSwgc3R5bGVMYW5nLCBmdWxsUGF0aCk7XG4gICAgICAgIGRlcHMgJiYgZGVwZW5kZW5jaWVzLnB1c2goLi4uZGVwcyk7XG4gICAgICAgIGhhZFN0eWxlID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVDb2RlICYmIGNvZGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soc3R5bGVDb2RlKTtcbiAgICAgICAgcmV0dXJuIGFyZ3NbMV0uUGx1cyhhcmdzWzZdLCBjb2RlLCBhcmdzWzhdKTs7XG4gICAgfSk7XG5cbiAgICBpZiAoIWhhZFN0eWxlICYmIHN0eWxlQ29kZSkge1xuICAgICAgICB0ZXh0LkFkZFRleHRBZnRlck5vVHJhY2soYDxzdHlsZT4ke3N0eWxlQ29kZX08L3N0eWxlPmApO1xuICAgIH1cblxuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBuZXcgU2Vzc2lvbkJ1aWxkKHNtYWxsUGF0aCwgZnVsbFBhdGgpLCBwcm9taXNlcyA9IFtzZXNzaW9uSW5mby5kZXBlbmRlbmNlKHNtYWxsUGF0aCwgZnVsbFBhdGgpXTtcblxuICAgIGZvciAoY29uc3QgZnVsbCBvZiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoZnVsbCksIGZ1bGwpKTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7IHNjcmlwdExhbmcsIHN0eWxlTGFuZywgY29kZTogdGV4dC5lcSwgbWFwOiB0ZXh0LlN0cmluZ1RhY2soc2F2ZVBhdGgsIGh0dHBTb3VyY2UpLCBkZXBlbmRlbmNpZXM6IHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcywgc3ZlbHRlRmlsZXM6IGNvbm5lY3RTdmVsdGUubWFwKHggPT4geFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gKyB4IDogcGF0aC5ub3JtYWxpemUoZnVsbFBhdGggKyAnLy4uLycgKyB4KSkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcGl0YWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVbMF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59XG5cbiIsICJpbXBvcnQgdHlwZSB7IHRhZ0RhdGFPYmplY3RBcnJheX0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuXG5cbmNvbnN0IG51bWJlcnMgPSBbJ251bWJlcicsICdudW0nLCAnaW50ZWdlcicsICdpbnQnXSwgYm9vbGVhbnMgPSBbJ2Jvb2xlYW4nLCAnYm9vbCddO1xuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb24gPSBbJ2VtYWlsJywgJ3N0cmluZycsICd0ZXh0JywgLi4ubnVtYmVycywgLi4uYm9vbGVhbnNdO1xuXG5jb25zdCBlbWFpbFZhbGlkYXRvciA9IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC87XG5cblxuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvblJlZ2V4ID0ge1xuICAgIFwic3RyaW5nLWxlbmd0aC1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLVswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLScpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCB0ZXh0OiBzdHJpbmcpID0+IHRleHQubGVuZ3RoID49IG1pbiAmJiB0ZXh0Lmxlbmd0aCA8PSBtYXgsXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibnVtYmVyLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSsuLlswLTldKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnLi4nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgbnVtOiBudW1iZXIpID0+IG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heCxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2Utc3RyaW5nXCI6IFtcbiAgICAgICAgL15zdHJpbmd8dGV4dCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gYFwiJHt4LnRyaW0oKS5yZXBsYWNlKC9cIi9naSwgJ1xcXFxcIicpfVwiYCksXG4gICAgICAgIChvcHRpb25zOiBzdHJpbmdbXSwgdGV4dDogc3RyaW5nKSA9PiBvcHRpb25zLmluY2x1ZGVzKHRleHQpLFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1udW1iZXJcIjogW1xuICAgICAgICAvXm51bWJlcnxudW18aW50ZWdlcnxpbnQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpLFxuICAgICAgICAob3B0aW9uczogbnVtYmVyW10sIG51bTogbnVtYmVyKSA9PiBvcHRpb25zLmluY2x1ZGVzKG51bSksXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdXG59O1xuXG5jb25zdCBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMgPSBbLi4ubnVtYmVyc107XG5cbmZvcihjb25zdCBpIGluIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpe1xuICAgIGNvbnN0IHR5cGUgPSBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2ldWzNdO1xuXG4gICAgaWYoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKHR5cGUpKVxuICAgICAgICBidWlsdEluQ29ubmVjdGlvbk51bWJlcnMucHVzaChpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVZhbHVlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGBbXCIke3ZhbHVlfVwiXWA7XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBbdGVzdCwgZ2V0QXJnc11dIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWx0SW5Db25uZWN0aW9uUmVnZXgpKVxuICAgICAgICBpZiAoKDxSZWdFeHA+dGVzdCkudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gYFtcIiR7bmFtZX1cIiwgJHsoPGFueT5nZXRBcmdzKSh2YWx1ZSl9XWA7XG5cbiAgICByZXR1cm4gYFske3ZhbHVlfV1gO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlVmFsaWRhdGlvbkpTT04oYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IFByb21pc2U8Ym9vbGVhbiB8IHN0cmluZ1tdPiB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnQsIC4uLmVsZW1lbnRBcmdzXSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG4gICAgICAgIGxldCByZXR1cm5Ob3cgPSBmYWxzZTtcblxuICAgICAgICBsZXQgaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgY2FzZSAnYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIU51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWVtYWlsVmFsaWRhdG9yLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhdmVSZWdleCA9IHZhbHVlICE9IG51bGwgJiYgYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtlbGVtZW50XTtcblxuICAgICAgICAgICAgICAgIGlmKGhhdmVSZWdleCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFoYXZlUmVnZXhbMl0oZWxlbWVudEFyZ3MsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICBpc0RlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSBlbGVtZW50LnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFhd2FpdCBlbGVtZW50KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Ob3cpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gYGZhaWxlZCBhdCAke2l9IGZpbGVkIC0gJHtpc0RlZmF1bHQgPyByZXR1cm5Ob3cgOiAnZXhwZWN0ZWQgJyArIGVsZW1lbnR9YDtcblxuICAgICAgICAgICAgaWYoZWxlbWVudEFyZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGluZm8gKz0gYCwgYXJndW1lbnRzOiAke0pTT04uc3RyaW5naWZ5KGVsZW1lbnRBcmdzKX1gO1xuXG4gICAgICAgICAgICBpbmZvICs9IGAsIGlucHV0OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gW2luZm8sIGVsZW1lbnQsIGVsZW1lbnRBcmdzLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVmFsdWVzKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyc2VkID0gW107XG5cblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudF0gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuXG4gICAgICAgIGlmIChidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaChwYXJzZUZsb2F0KHZhbHVlKSk7XG5cbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbnMuaW5jbHVkZXMoZWxlbWVudCkpXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJzZWQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBmaW5kOiBzdHJpbmcsIGRlZmF1bHREYXRhOiBhbnkgPSBudWxsKTogc3RyaW5nIHwgbnVsbCB8IGJvb2xlYW57XG4gICAgY29uc3QgaGF2ZSA9IGRhdGEuaGF2ZShmaW5kKSwgdmFsdWUgPSBkYXRhLnJlbW92ZShmaW5kKTtcblxuICAgIGlmKGhhdmUgJiYgdmFsdWUgIT0gJ2ZhbHNlJykgcmV0dXJuIHZhbHVlIHx8IGhhdmUgICAgXG4gICAgaWYodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcblxuICAgIGlmKCFoYXZlKSByZXR1cm4gZGVmYXVsdERhdGE7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59IiwgImltcG9ydCB7VHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSAnLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tICcuLi9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vSlNQYXJzZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vU2Vzc2lvbic7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tICcuL0Vhc3lTeW50YXgnO1xuXG5mdW5jdGlvbiBFcnJvclRlbXBsYXRlKGluZm86IHN0cmluZyl7XG4gICAgcmV0dXJuIGBtb2R1bGUuZXhwb3J0cyA9ICgpID0+IChEYXRhT2JqZWN0KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gXCI8cCBzdHlsZT1cXFxcXCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1xcXFxcIj5TeW50YXggRXJyb3I6ICR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhpbmZvLnJlcGxhY2VBbGwoJ1xcbicsICc8YnIvPicpKX08L3A+XCJgO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRleHQgXG4gKiBAcGFyYW0gdHlwZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBpc1R5cGVzY3JpcHQ6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG5cbiAgICBjb25zdCBPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cyc6ICdqcycsXG4gICAgICAgIHNvdXJjZW1hcDogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIHNvdXJjZWZpbGU6IHNlc3Npb25JbmZvLnNtYWxsUGF0aCxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBkZWJ1ZzogJycgKyBzZXNzaW9uSW5mby5kZWJ1Z1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQ6IFN0cmluZ1RyYWNrZXJcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCBtYXAsIHdhcm5pbmdzfSA9IGF3YWl0IHRyYW5zZm9ybShhd2FpdCBFYXN5U3ludGF4LkJ1aWxkQW5kRXhwb3J0SW1wb3J0cyh0ZXh0LmVxKSwgT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcih0ZXh0LCB3YXJuaW5ncyk7XG4gICAgICAgIHJlc3VsdCA9IG1hcCA/IGF3YWl0IGJhY2tUb09yaWdpbmFsKHRleHQsIGNvZGUsIG1hcCk6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodGV4dCwgZXJyKTtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gdGV4dC5kZWJ1Z0xpbmUoZXJyKTtcblxuICAgICAgICBpZihzZXNzaW9uSW5mby5kZWJ1ZylcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIEVycm9yVGVtcGxhdGUoZXJyb3JNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBFYXN5RnMucmVhZEpzb25GaWxlKHBhdGgpO1xufSIsICJpbXBvcnQgeyBwcm9taXNlcyB9IGZyb20gXCJmc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUocGF0aCkpO1xuICAgIGNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG4gICAgcmV0dXJuIHdhc21JbnN0YW5jZS5leHBvcnRzO1xufSIsICJpbXBvcnQganNvbiBmcm9tIFwiLi9qc29uXCI7XG5pbXBvcnQgd2FzbSBmcm9tIFwiLi93YXNtXCI7XG5cbmV4cG9ydCBjb25zdCBjdXN0b21UeXBlcyA9IFtcImpzb25cIiwgXCJ3YXNtXCJdO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBJbXBvcnRCeUV4dGVuc2lvbihwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZyl7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICAgICAgcmV0dXJuIGpzb24ocGF0aClcbiAgICAgICAgY2FzZSBcIndhc21cIjpcbiAgICAgICAgICAgIHJldHVybiB3YXNtKHBhdGgpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGltcG9ydChwYXRoKVxuICAgIH1cbn0iLCAiaW1wb3J0IHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2luZGV4JztcbmltcG9ydCB7IEJhc2VSZWFkZXIgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBFbmRPZkJsb2NrLCBFbmRPZkRlZlNraXBCbG9jaywgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vRWFzeVNjcmlwdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhc3lTeW50YXgge1xuICAgIHByaXZhdGUgQnVpbGQ6IFJlQnVpbGRDb2RlU3RyaW5nO1xuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFyc2VBcnJheSA9IGF3YWl0IFBhcnNlVGV4dFN0cmVhbShjb2RlKTtcbiAgICAgICAgdGhpcy5CdWlsZCA9IG5ldyBSZUJ1aWxkQ29kZVN0cmluZyhwYXJzZUFycmF5KTtcblxuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsID0gdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0ltcG9ydChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYGNvbnN0ICR7ZGF0YU9iamVjdH0gPSBhd2FpdCAke3JlcGxhY2VUb1R5cGV9KDx8JHtpbmRleH18fD4pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0V4cG9ydChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZSwgZGF0YU9iamVjdCwgaW5kZXgpfTtPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7ZGF0YU9iamVjdH0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0ltcG9ydEFsbChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBhd2FpdCAke3JlcGxhY2VUb1R5cGV9KDx8JHtpbmRleH18fD4pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblN0cmluZ0V4cG9ydEFsbChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBPYmplY3QuYXNzaWduKGV4cG9ydHMsICR7dGhpcy5hY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZSwgaW5kZXgpfSlgO1xuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbXBvcnRUeXBlKHR5cGU6IHN0cmluZywgcmVwbGFjZVRvVHlwZSA9IHR5cGUsIGFjdGlvblN0cmluZzogKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgZGF0YU9iamVjdDogc3RyaW5nLCBpbmRleDogc3RyaW5nKSA9PiBzdHJpbmcgPSB0aGlzLmFjdGlvblN0cmluZ0ltcG9ydCkge1xuICAgICAgICBsZXQgYmVmb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaChuZXcgUmVnRXhwKGAke3R5cGV9WyBcXFxcbl0rKFtcXFxcKl17MCwxfVtcXFxccHtMfTAtOV8sXFxcXHtcXFxcfSBcXFxcbl0rKVsgXFxcXG5dK2Zyb21bIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+YCwgJ3UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGxldCBEYXRhT2JqZWN0OiBzdHJpbmc7XG5cbiAgICAgICAgICAgIGlmIChkYXRhWzBdID09ICcqJykge1xuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBkYXRhLnN1YnN0cmluZygxKS5yZXBsYWNlKCcgYXMgJywgJycpLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgU3BsaWNlZDogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhWzBdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnfScsIDIpO1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkWzBdICs9ICd9JztcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICBTcGxpY2VkWzFdID0gU3BsaWNlZFsxXS5zcGxpdCgnLCcpLnBvcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFNwbGljZWQgPSBkYXRhLnNwbGl0KCcsJywgMSkucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFNwbGljZWQgPSBTcGxpY2VkLm1hcCh4ID0+IHgudHJpbSgpKS5maWx0ZXIoeCA9PiB4Lmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoU3BsaWNlZFswXVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBTcGxpY2VkWzBdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbiA9IHRoaXMuQnVpbGQuQWxsSW5wdXRzW21hdGNoWzJdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvbi5zdWJzdHJpbmcoZXh0ZW5zaW9uLmxhc3RJbmRleE9mKCcuJykgKyAxLCBleHRlbnNpb24ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VzdG9tVHlwZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gYHtkZWZhdWx0OiR7U3BsaWNlZFswXX19YDsgLy9vbmx5IGlmIHRoaXMgaXNuJ3QgY3VzdG9tIGltcG9ydFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcblxuICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gYCR7RGF0YU9iamVjdC5zdWJzdHJpbmcoMCwgRGF0YU9iamVjdC5sZW5ndGggLSAxKX0sZGVmYXVsdDoke1NwbGljZWRbMV19fWA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IERhdGFPYmplY3QucmVwbGFjZSgvIGFzIC8sICc6Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBhY3Rpb25TdHJpbmcocmVwbGFjZVRvVHlwZSwgRGF0YU9iamVjdCwgbWF0Y2hbMl0pO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nO1xuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IGJlZm9yZVN0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW5PbmVXb3JkKHR5cGU6IHN0cmluZywgcmVwbGFjZVRvVHlwZSA9IHR5cGUsIGFjdGlvblN0cmluZzogKHJlcGxhY2VUb1R5cGU6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnRBbGwpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cCh0eXBlICsgJ1sgXFxcXG5dKzxcXFxcfChbMC05XSspXFxcXHxcXFxcfD4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcblxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIG1hdGNoWzFdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBsYWNlV2l0aFNwYWNlKGZ1bmM6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBmdW5jKCcgJyArIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCkuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgRGVmaW5lKGRhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZVdpdGhTcGFjZSh0ZXh0ID0+IHRleHQucmVwbGFjZShuZXcgUmVnRXhwKGAoW15cXFxccHtMfV0pJHtrZXl9KFteXFxcXHB7TH1dKWAsICdndWknKSwgKC4uLm1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdICsgdmFsdWUgKyBtYXRjaFsyXVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluQXNGdW5jdGlvbih3b3JkOiBzdHJpbmcsIHRvV29yZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZVdpdGhTcGFjZSh0ZXh0ID0+IHRleHQucmVwbGFjZShuZXcgUmVnRXhwKGAoW15cXFxccHtMfV0pJHt3b3JkfShbIFxcXFxuXSpcXFxcKClgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdICsgdG9Xb3JkICsgbWF0Y2hbMl1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwb3J0VmFyaWFibGUoKXtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dDtcbiAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5O1xuXG4gICAgICAgIGZ1bmN0aW9uIFJlbWF0Y2goKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG5ld1N0cmluZy5tYXRjaCgvKGV4cG9ydFsgXFxuXSspKHZhcnxsZXR8Y29uc3QpWyBcXG5dKyhbXFxwe0x9XFwkX11bXFxwe0x9MC05XFwkX10qKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGJlZm9yZU1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVFeHBvcnQgPSBtYXRjaFswXS5zdWJzdHJpbmcobWF0Y2hbMV0ubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2xvc2VJbmRleCA9IGF3YWl0IEVuZE9mRGVmU2tpcEJsb2NrKGFmdGVyTWF0Y2gsWyc7JywgJ1xcbiddKTtcblxuICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgY2xvc2VJbmRleCA9IGFmdGVyTWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGJlZm9yZUNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgY2xvc2VJbmRleCksIGFmdGVyQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZyhjbG9zZUluZGV4KTtcblxuICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2ggKyByZW1vdmVFeHBvcnQrIGJlZm9yZUNsb3NlfTtleHBvcnRzLiR7bWF0Y2hbM119PSR7bWF0Y2hbM119JHthZnRlckNsb3NlfWA7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQnVpbGQuQ29kZUJ1aWxkVGV4dCA9IG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydEJsb2NrKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKShkZWZhdWx0WyBcXG5dKyk/KFteIFxcbl0pL3UpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgbGV0IGJlZm9yZU1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCArIChtYXRjaFsyXSB8fCAnJykubGVuZ3RoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBmaXJzdENoYXIgPSBtYXRjaFszXVswXSwgaXNEZWZhdWx0ID0gQm9vbGVhbihtYXRjaFsyXSk7XG4gICAgICAgICAgICBpZihmaXJzdENoYXI9PSAneycpe1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBhd2FpdCBFbmRPZkJsb2NrKGFmdGVyTWF0Y2gsIFsneycsICd9J10pO1xuICAgICAgICAgICAgICAgICAgICBiZWZvcmVNYXRjaCArPSBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3JlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGVuZEluZGV4KzEpfSlgO1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArIGFmdGVyTWF0Y2guc3Vic3RyaW5nKGVuZEluZGV4KzEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGFmdGVyTWF0Y2ggPSBuZXdTdHJpbmcuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoLTEpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUV4cG9ydCA9IHJlbW92ZUV4cG9ydC5zbGljZSgwLCAtMSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2xvc2VJbmRleCA9IGF3YWl0IEVuZE9mRGVmU2tpcEJsb2NrKGFmdGVyTWF0Y2gsWyc7JywgJ1xcbiddKTtcbiAgICAgICAgICAgICAgICBpZihjbG9zZUluZGV4ID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VJbmRleCA9IGFmdGVyTWF0Y2gudHJpbUVuZCgpLmxlbmd0aFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZUNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoMCwgY2xvc2VJbmRleCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2tNYXRjaCA9IGJlZm9yZUNsb3NlLm1hdGNoKC8oZnVuY3Rpb258Y2xhc3MpWyB8XFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKik/L3UpO1xuXG4gICAgICAgICAgICAgICAgaWYoYmxvY2tNYXRjaD8uWzJdKXsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFmdGVyQ2xvc2UgPSBhZnRlck1hdGNoLnN1YnN0cmluZyhjbG9zZUluZGV4KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX1leHBvcnRzLiR7aXNEZWZhdWx0ID8gJ2RlZmF1bHQnOiBibG9ja01hdGNoWzJdfT0ke2Jsb2NrTWF0Y2hbMl19JHthZnRlckNsb3NlfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzRGVmYXVsdCl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9IGJlZm9yZU1hdGNoICsgJ2V4cG9ydHMuZGVmYXVsdD0nICsgcmVtb3ZlRXhwb3J0ICsgYWZ0ZXJNYXRjaDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaH1leHBvcnRzLiR7YmVmb3JlQ2xvc2Uuc3BsaXQoLyB8XFxuLywgMSkucG9wKCl9PSR7cmVtb3ZlRXhwb3J0KyBhZnRlck1hdGNofWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgYXN5bmMgQnVpbGRJbXBvcnRzKGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnZXhwb3J0JywgJ3JlcXVpcmUnLCB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydCk7XG4gICAgICAgIHRoaXMuQnVpbGRJbXBvcnRUeXBlKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEluT25lV29yZCgnZXhwb3J0JywgJ3JlcXVpcmUnLCB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2luY2x1ZGUnKTtcblxuICAgICAgICB0aGlzLkJ1aWxkSW5Bc0Z1bmN0aW9uKCdpbXBvcnQnLCAncmVxdWlyZScpO1xuXG4gICAgICAgIC8vZXNtIHRvIGNqcyAtIGV4cG9ydFxuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydFZhcmlhYmxlKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZXhwb3J0QmxvY2soKTtcblxuICAgICAgICBkZWZpbmVEYXRhICYmIHRoaXMuRGVmaW5lKGRlZmluZURhdGEpO1xuICAgIH1cblxuICAgIEJ1aWx0U3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5CdWlsZC5CdWlsZENvZGUoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGU6IHN0cmluZywgZGVmaW5lRGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBFYXN5U3ludGF4KCk7XG4gICAgICAgIGF3YWl0IGJ1aWxkZXIubG9hZChgICR7Y29kZX0gYCk7XG4gICAgICAgIGF3YWl0IGJ1aWxkZXIuQnVpbGRJbXBvcnRzKGRlZmluZURhdGEpO1xuXG4gICAgICAgIGNvZGUgPSBidWlsZGVyLkJ1aWx0U3RyaW5nKCk7XG4gICAgICAgIHJldHVybiBjb2RlLnN1YnN0cmluZygxLCBjb2RlLmxlbmd0aCAtIDEpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdG9yZUpTT04gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlSlNPTlwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTWFwLCBTdHJpbmdOdW1iZXJNYXAsIHRhZ0RhdGFPYmplY3RBcnJheSB9IGZyb20gXCIuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5pbXBvcnQgQmFzZTY0SWQgZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9JZCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gXCIuLi9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlcnYtY29ubmVjdFwiO1xuaW1wb3J0IHsgaXNUcyB9IGZyb20gXCIuL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IEJ1aWxkU2NyaXB0IGZyb20gXCIuL3RyYW5zZm9ybS9TY3JpcHRcIjtcblxuXG5leHBvcnQgdHlwZSBzZXREYXRhSFRNTFRhZyA9IHtcbiAgICB1cmw6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwXG59XG5cbmV4cG9ydCB0eXBlIGNvbm5lY3RvckFycmF5ID0ge1xuICAgIHR5cGU6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgc2VuZFRvOiBzdHJpbmcsXG4gICAgdmFsaWRhdG9yOiBzdHJpbmdbXSxcbiAgICBvcmRlcj86IHN0cmluZ1tdLFxuICAgIG5vdFZhbGlkPzogc3RyaW5nLFxuICAgIG1lc3NhZ2U/OiBzdHJpbmcgfCBib29sZWFuLFxuICAgIHJlc3BvbnNlU2FmZT86IGJvb2xlYW5cbn1bXVxuXG5leHBvcnQgdHlwZSBjYWNoZUNvbXBvbmVudCA9IHtcbiAgICBba2V5OiBzdHJpbmddOiBudWxsIHwge1xuICAgICAgICBtdGltZU1zPzogbnVtYmVyLFxuICAgICAgICB2YWx1ZT86IHN0cmluZ1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgaW5UYWdDYWNoZSA9IHtcbiAgICBzdHlsZTogc3RyaW5nW11cbiAgICBzY3JpcHQ6IHN0cmluZ1tdXG4gICAgc2NyaXB0TW9kdWxlOiBzdHJpbmdbXVxufVxuXG5jb25zdCBTdGF0aWNGaWxlc0luZm8gPSBuZXcgU3RvcmVKU09OKCdTaG9ydFNjcmlwdE5hbWVzJyk7XG5cbi8qIFRoZSBTZXNzaW9uQnVpbGQgY2xhc3MgaXMgdXNlZCB0byBidWlsZCB0aGUgaGVhZCBvZiB0aGUgcGFnZSAqL1xuZXhwb3J0IGNsYXNzIFNlc3Npb25CdWlsZCB7XG4gICAgY29ubmVjdG9yQXJyYXk6IGNvbm5lY3RvckFycmF5ID0gW11cbiAgICBwcml2YXRlIHNjcmlwdFVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBzdHlsZVVSTFNldDogc2V0RGF0YUhUTUxUYWdbXSA9IFtdXG4gICAgcHJpdmF0ZSBpblNjcmlwdFN0eWxlOiB7IHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBTb3VyY2VNYXBTdG9yZSB9W10gPSBbXVxuICAgIGhlYWRIVE1MID0gJydcbiAgICBjYWNoZTogaW5UYWdDYWNoZSA9IHtcbiAgICAgICAgc3R5bGU6IFtdLFxuICAgICAgICBzY3JpcHQ6IFtdLFxuICAgICAgICBzY3JpcHRNb2R1bGU6IFtdXG4gICAgfVxuICAgIGNhY2hlQ29tcGlsZVNjcmlwdDogYW55ID0ge31cbiAgICBjYWNoZUNvbXBvbmVudDogY2FjaGVDb21wb25lbnQgPSB7fVxuICAgIGNvbXBpbGVSdW5UaW1lU3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9XG4gICAgZGVwZW5kZW5jaWVzOiBTdHJpbmdOdW1iZXJNYXAgPSB7fVxuICAgIHJlY29yZE5hbWVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICBnZXQgc2FmZURlYnVnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWJ1ZyAmJiB0aGlzLl9zYWZlRGVidWc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNtYWxsUGF0aDogc3RyaW5nLCBwdWJsaWMgZnVsbFBhdGg6IHN0cmluZywgcHVibGljIHR5cGVOYW1lPzogc3RyaW5nLCBwdWJsaWMgZGVidWc/OiBib29sZWFuLCBwcml2YXRlIF9zYWZlRGVidWc/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuQnVpbGRTY3JpcHRXaXRoUHJhbXMgPSB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc3R5bGUodXJsOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0eWxlVVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgc2NyaXB0KHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcmlwdFVSTFNldC5maW5kKHggPT4geC51cmwgPT0gdXJsICYmIEpTT04uc3RyaW5naWZ5KHguYXR0cmlidXRlcykgPT0gSlNPTi5zdHJpbmdpZnkoYXR0cmlidXRlcykpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2NyaXB0VVJMU2V0LnB1c2goeyB1cmwsIGF0dHJpYnV0ZXMgfSk7XG4gICAgfVxuXG4gICAgcmVjb3JkKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVwZW5kZW5jZShzbWFsbFBhdGg6IHN0cmluZywgZnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNtYWxsUGF0aCkge1xuICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhhdmVEZXAgPSBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCBudWxsKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0O1xuICAgICAgICBpZiAoaGF2ZURlcCkge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXNbc21hbGxQYXRoXSA9IGhhdmVEZXBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGUodHlwZTogJ3NjcmlwdCcgfCAnc3R5bGUnIHwgJ21vZHVsZScsIHNtYWxsUGF0aCA9IHRoaXMuc21hbGxQYXRoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5pblNjcmlwdFN0eWxlLmZpbmQoeCA9PiB4LnR5cGUgPT0gdHlwZSAmJiB4LnBhdGggPT0gc21hbGxQYXRoKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0geyB0eXBlLCBwYXRoOiBzbWFsbFBhdGgsIHZhbHVlOiBuZXcgU291cmNlTWFwU3RvcmUoc21hbGxQYXRoLCB0aGlzLnNhZmVEZWJ1ZywgdHlwZSA9PSAnc3R5bGUnLCB0cnVlKSB9XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaChkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhLnZhbHVlXG4gICAgfVxuXG4gICAgYWRkU2NyaXB0U3R5bGVQYWdlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIGluZm86IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NyaXB0U3R5bGUodHlwZSwgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAncGFnZScpID8gdGhpcy5zbWFsbFBhdGggOiBpbmZvLmV4dHJhY3RJbmZvKCkpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlTmFtZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGxldCBrZXk6IHN0cmluZztcblxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKFN0YXRpY0ZpbGVzSW5mby5zdG9yZSk7XG4gICAgICAgIHdoaWxlIChrZXkgPT0gbnVsbCB8fCB2YWx1ZXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAga2V5ID0gQmFzZTY0SWQodGV4dCwgNSArIGxlbmd0aCkuc3Vic3RyaW5nKGxlbmd0aCk7XG4gICAgICAgICAgICBsZW5ndGgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRIZWFkVGFncygpIHtcbiAgICAgICAgY29uc3QgaXNMb2dzID0gdGhpcy50eXBlTmFtZSA9PSBnZXRUeXBlcy5Mb2dzWzJdXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVMb2NhdGlvbiA9IGkucGF0aCA9PSB0aGlzLnNtYWxsUGF0aCAmJiBpc0xvZ3MgPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdLCBhZGRRdWVyeSA9IGlzTG9ncyA/ICc/dD1sJyA6ICcnO1xuICAgICAgICAgICAgbGV0IHVybCA9IFN0YXRpY0ZpbGVzSW5mby5oYXZlKGkucGF0aCwgKCkgPT4gU2Vzc2lvbkJ1aWxkLmNyZWF0ZU5hbWUoaS5wYXRoKSkgKyAnLnB1Yic7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2NyaXB0JzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyBkZWZlcjogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtb2R1bGUnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5tanMnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdCgnLycgKyB1cmwgKyBhZGRRdWVyeSwgeyB0eXBlOiAnbW9kdWxlJyB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLmNzcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUoJy8nICsgdXJsICsgYWRkUXVlcnkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBFYXN5RnMud3JpdGVGaWxlKHNhdmVMb2NhdGlvbiArIHVybCwgYXdhaXQgaS52YWx1ZS5jcmVhdGVEYXRhV2l0aE1hcCgpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRIZWFkKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZEhlYWRUYWdzKCk7XG5cbiAgICAgICAgY29uc3QgbWFrZUF0dHJpYnV0ZXMgPSAoaTogc2V0RGF0YUhUTUxUYWcpID0+IGkuYXR0cmlidXRlcyA/ICcgJyArIE9iamVjdC5rZXlzKGkuYXR0cmlidXRlcykubWFwKHggPT4gaS5hdHRyaWJ1dGVzW3hdID8geCArIGA9XCIke2kuYXR0cmlidXRlc1t4XX1cImAgOiB4KS5qb2luKCcgJykgOiAnJztcblxuICAgICAgICBjb25zdCBhZGRUeXBlSW5mbyA9IHRoaXMudHlwZU5hbWUgPT0gZ2V0VHlwZXMuTG9nc1syXSA/ICc/dD1sJyA6ICcnO1xuICAgICAgICBsZXQgYnVpbGRCdW5kbGVTdHJpbmcgPSAnJzsgLy8gYWRkIHNjcmlwdHMgYWRkIGNzc1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zdHlsZVVSTFNldClcbiAgICAgICAgICAgIGJ1aWxkQnVuZGxlU3RyaW5nICs9IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIiR7aS51cmwgKyBhZGRUeXBlSW5mb31cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Lz5gO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zY3JpcHRVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPHNjcmlwdCBzcmM9XCIke2kudXJsICsgYWRkVHlwZUluZm99XCIke21ha2VBdHRyaWJ1dGVzKGkpfT48L3NjcmlwdD5gO1xuXG4gICAgICAgIHJldHVybiBidWlsZEJ1bmRsZVN0cmluZyArIHRoaXMuaGVhZEhUTUw7XG4gICAgfVxuXG4gICAgZXh0ZW5kcyhmcm9tOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3JBcnJheS5wdXNoKC4uLmZyb20uY29ubmVjdG9yQXJyYXkpO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKC4uLmZyb20uc2NyaXB0VVJMU2V0KTtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKC4uLmZyb20uc3R5bGVVUkxTZXQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBmcm9tLmluU2NyaXB0U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5TY3JpcHRTdHlsZS5wdXNoKHsgLi4uaSwgdmFsdWU6IGkudmFsdWUuY2xvbmUoKSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29weU9iamVjdHMgPSBbJ2NhY2hlQ29tcGlsZVNjcmlwdCcsICdjYWNoZUNvbXBvbmVudCcsICdkZXBlbmRlbmNpZXMnXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29weU9iamVjdHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpc1tjXSwgZnJvbVtjXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29yZE5hbWVzLnB1c2goLi4uZnJvbS5yZWNvcmROYW1lcy5maWx0ZXIoeCA9PiAhdGhpcy5yZWNvcmROYW1lcy5pbmNsdWRlcyh4KSkpO1xuXG4gICAgICAgIHRoaXMuaGVhZEhUTUwgKz0gZnJvbS5oZWFkSFRNTDtcbiAgICAgICAgdGhpcy5jYWNoZS5zdHlsZS5wdXNoKC4uLmZyb20uY2FjaGUuc3R5bGUpO1xuICAgICAgICB0aGlzLmNhY2hlLnNjcmlwdC5wdXNoKC4uLmZyb20uY2FjaGUuc2NyaXB0KTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHRNb2R1bGUucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdE1vZHVsZSk7XG4gICAgfVxuXG4gICAgLy9iYXNpYyBtZXRob2RzXG4gICAgQnVpbGRTY3JpcHRXaXRoUHJhbXMoY29kZTogU3RyaW5nVHJhY2tlcil7XG4gICAgICAgIHJldHVybiBCdWlsZFNjcmlwdChjb2RlLCBpc1RzKCksIHRoaXMpOyAgXG4gICAgfVxufSIsICIvLyBAdHMtbm9jaGVja1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgY2xlYXJNb2R1bGUgZnJvbSAnY2xlYXItbW9kdWxlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpLCByZXNvbHZlID0gKHBhdGg6IHN0cmluZykgPT4gcmVxdWlyZS5yZXNvbHZlKHBhdGgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGZpbGVQYXRoID0gcGF0aC5ub3JtYWxpemUoZmlsZVBhdGgpO1xuXG4gICAgY29uc3QgbW9kdWxlID0gcmVxdWlyZShmaWxlUGF0aCk7XG4gICAgY2xlYXJNb2R1bGUoZmlsZVBhdGgpO1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn1cblxuZXhwb3J0IHtcbiAgICBjbGVhck1vZHVsZSxcbiAgICByZXNvbHZlXG59IiwgImltcG9ydCB7IFdhcm5pbmcgfSBmcm9tIFwic3ZlbHRlL3R5cGVzL2NvbXBpbGVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmNsYXNzIHJlTG9jYXRpb24ge1xuICAgIG1hcDogUHJvbWlzZTxTb3VyY2VNYXBDb25zdW1lcj5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCl7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRMb2NhdGlvbihsb2NhdGlvbjoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KXtcbiAgICAgICAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSAoYXdhaXQgdGhpcy5tYXApLm9yaWdpbmFsUG9zaXRpb25Gb3IobG9jYXRpb24pXG4gICAgICAgIHJldHVybiBgJHtsaW5lfToke2NvbHVtbn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFByaW50U3ZlbHRlRXJyb3IoeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfTogV2FybmluZywgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApXG4gICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIGVycm9yTmFtZTogJ3N2ZWx0ZS0nICsgY29kZSxcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfVxcbiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQcmludFN2ZWx0ZVdhcm4od2FybmluZ3M6IFdhcm5pbmdbXSwgZmlsZVBhdGg6IHN0cmluZywgc291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBmaW5kTG9jYXRpb24gPSBuZXcgcmVMb2NhdGlvbihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCB7IG1lc3NhZ2UsIGNvZGUsIHN0YXJ0LCBmcmFtZSB9IG9mIHdhcm5pbmdzKXtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICB0ZXh0OiBgJHttZXNzYWdlfVxcbiR7ZnJhbWV9XFxuJHtmaWxlUGF0aH06JHthd2FpdCBmaW5kTG9jYXRpb24uZ2V0TG9jYXRpb24oc3RhcnQpfWBcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IGhsanMgZnJvbSAnaGlnaGxpZ2h0LmpzJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IGFuY2hvciBmcm9tICdtYXJrZG93bi1pdC1hbmNob3InO1xuaW1wb3J0IHNsdWdpZnkgZnJvbSAnQHNpbmRyZXNvcmh1cy9zbHVnaWZ5JztcbmltcG9ydCBtYXJrZG93bkl0QXR0cnMgZnJvbSAnbWFya2Rvd24taXQtYXR0cnMnO1xuaW1wb3J0IG1hcmtkb3duSXRBYmJyIGZyb20gJ21hcmtkb3duLWl0LWFiYnInXG5pbXBvcnQgTWluQ3NzIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZnVuY3Rpb24gY29kZVdpdGhDb3B5KG1kOiBhbnkpIHtcblxuICAgIGZ1bmN0aW9uIHJlbmRlckNvZGUob3JpZ1J1bGU6IGFueSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnUmVuZGVyZWQgPSBvcmlnUnVsZSguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNvZGUtY29weVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29weS1jbGlwYm9hcmRcIiBvbmNsaWNrPVwibmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGhpcy5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lclRleHQpXCI+Y29weTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke29yaWdSZW5kZXJlZH1cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2sgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmNvZGVfYmxvY2spO1xuICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbWFya0Rvd25QbHVnaW4gPSBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKCdtYXJrZG93bicpO1xuXG4gICAgY29uc3QgaGxqc0NsYXNzID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnaGxqcy1jbGFzcycsIG1hcmtEb3duUGx1Z2luPy5obGpzQ2xhc3MgPz8gdHJ1ZSkgPyAnIGNsYXNzPVwiaGxqc1wiJyA6ICcnO1xuXG4gICAgbGV0IGhhdmVIaWdobGlnaHQgPSBmYWxzZTtcbiAgICBjb25zdCBtZCA9IG1hcmtkb3duKHtcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgeGh0bWxPdXQ6IHRydWUsXG4gICAgICAgIGxpbmtpZnk6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnbGlua2lmeScsIG1hcmtEb3duUGx1Z2luPy5saW5raWZ5KSksXG4gICAgICAgIGJyZWFrczogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdicmVha3MnLCBtYXJrRG93blBsdWdpbj8uYnJlYWtzID8/IHRydWUpKSxcbiAgICAgICAgdHlwb2dyYXBoZXI6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAndHlwb2dyYXBoZXInLCBtYXJrRG93blBsdWdpbj8udHlwb2dyYXBoZXIgPz8gdHJ1ZSkpLFxuXG4gICAgICAgIGhpZ2hsaWdodDogZnVuY3Rpb24gKHN0ciwgbGFuZykge1xuICAgICAgICAgICAgaWYgKGxhbmcgJiYgaGxqcy5nZXRMYW5ndWFnZShsYW5nKSkge1xuICAgICAgICAgICAgICAgIGhhdmVIaWdobGlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke2hsanMuaGlnaGxpZ2h0KHN0ciwgeyBsYW5ndWFnZTogbGFuZywgaWdub3JlSWxsZWdhbHM6IHRydWUgfSkudmFsdWV9PC9jb2RlPjwvcHJlPmA7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogJ21hcmtkb3duLXBhcnNlcidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHttZC51dGlscy5lc2NhcGVIdG1sKHN0cil9PC9jb2RlPjwvcHJlPmA7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdjb3B5LWNvZGUnLCBtYXJrRG93blBsdWdpbj8uY29weUNvZGUgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShjb2RlV2l0aENvcHkpO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2hlYWRlci1saW5rJywgbWFya0Rvd25QbHVnaW4/LmhlYWRlckxpbmsgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShhbmNob3IsIHtcbiAgICAgICAgICAgIHNsdWdpZnk6IChzOiBhbnkpID0+IHNsdWdpZnkocyksXG4gICAgICAgICAgICBwZXJtYWxpbms6IGFuY2hvci5wZXJtYWxpbmsuaGVhZGVyTGluaygpXG4gICAgICAgIH0pO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2F0dHJzJywgbWFya0Rvd25QbHVnaW4/LmF0dHJzID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEF0dHJzKTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdhYmJyJywgbWFya0Rvd25QbHVnaW4/LmFiYnIgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QWJicik7XG5cbiAgICBsZXQgbWFya2Rvd25Db2RlID0gQmV0d2VlblRhZ0RhdGE/LmVxO1xuICAgIGlmICghbWFya2Rvd25Db2RlKSB7XG4gICAgICAgIGxldCBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUodHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JykpLCBkYXRhVGFnLnJlbW92ZSgnZmlsZScpKTtcbiAgICAgICAgaWYgKCFwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKVxuICAgICAgICAgICAgZmlsZVBhdGggKz0gJy5zZXJ2Lm1kJ1xuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgICBtYXJrZG93bkNvZGUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpOyAvL2dldCBtYXJrZG93biBmcm9tIGZpbGVcbiAgICAgICAgYXdhaXQgc2Vzc2lvbi5kZXBlbmRlbmNlKGZpbGVQYXRoLCBmdWxsUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJIVE1MID0gbWQucmVuZGVyKG1hcmtkb3duQ29kZSksIGJ1aWxkSFRNTCA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgY3JlYXRlQXV0b1RoZW1lKGRhdGFUYWcucmVtb3ZlKCdjb2RlLXRoZW1lJykgfHwgbWFya0Rvd25QbHVnaW4/LmNvZGVUaGVtZSB8fCAnYXRvbS1vbmUnKTtcblxuICAgIGlmIChoYXZlSGlnaGxpZ2h0KSB7XG4gICAgICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvY29kZS10aGVtZS8nICsgdGhlbWUgKyAnLmNzcyc7XG4gICAgICAgIHNlc3Npb24uc3R5bGUoY3NzTGluayk7XG4gICAgfVxuXG4gICAgZGF0YVRhZy5hZGRDbGFzcygnbWFya2Rvd24tYm9keScpO1xuXG4gICAgY29uc3Qgc3R5bGUgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICd0aGVtZScsIG1hcmtEb3duUGx1Z2luPy50aGVtZSA/PyAnYXV0bycpO1xuICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvdGhlbWUvJyArIHN0eWxlICsgJy5jc3MnO1xuICAgIHN0eWxlICE9ICdub25lJyAmJiBzZXNzaW9uLnN0eWxlKGNzc0xpbmspXG5cbiAgICBpZiAoZGF0YVRhZy5sZW5ndGgpXG4gICAgICAgIGJ1aWxkSFRNTC5QbHVzJGA8ZGl2JHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtyZW5kZXJIVE1MfTwvZGl2PmA7XG4gICAgZWxzZVxuICAgICAgICBidWlsZEhUTUwuQWRkVGV4dEFmdGVyKHJlbmRlckhUTUwpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IGJ1aWxkSFRNTCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuY29uc3QgdGhlbWVBcnJheSA9IFsnJywgJy1kYXJrJywgJy1saWdodCddO1xuY29uc3QgdGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24nO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmlmeU1hcmtkb3duVGhlbWUoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIHRoZW1lQXJyYXkpIHtcbiAgICAgICAgY29uc3QgbWluaSA9IChhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhlbWVQYXRoICsgaSArICcuY3NzJykpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcblxcLm1hcmtkb3duLWJvZHkgeyl8KF4ubWFya2Rvd24tYm9keSB7KS9nbSwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2ggKyAncGFkZGluZzoyMHB4OydcbiAgICAgICAgICAgIH0pICsgYFxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYge1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246cmlnaHQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTotMzBweDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6MTBweDtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5OmhvdmVyPmRpdiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eToxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weT5kaXYgYTpmb2N1cyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IzZiYjg2YVxuICAgICAgICAgICAgfWA7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUodGhlbWVQYXRoICsgaSArICcubWluLmNzcycsIE1pbkNzcyhtaW5pKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzcGxpdFN0YXJ0KHRleHQxOiBzdHJpbmcsIHRleHQyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBbYmVmb3JlLCBhZnRlciwgbGFzdF0gPSB0ZXh0MS5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pXG4gICAgY29uc3QgYWRkQmVmb3JlID0gdGV4dDFbYmVmb3JlLmxlbmd0aF0gPT0gJ30nID8gJ30nOiAnKi8nO1xuICAgIHJldHVybiBbYmVmb3JlICthZGRCZWZvcmUsICcuaGxqc3snICsgKGxhc3QgPz8gYWZ0ZXIpLCAnLmhsanN7JyArIHRleHQyLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LykucG9wKCldO1xufVxuXG5jb25zdCBjb2RlVGhlbWVQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3N0eWxlcy8nO1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVBdXRvVGhlbWUodGhlbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGRhcmtMaWdodFNwbGl0ID0gdGhlbWUuc3BsaXQoJ3wnKTtcbiAgICBpZiAoZGFya0xpZ2h0U3BsaXQubGVuZ3RoID09IDEpIHJldHVybiB0aGVtZTtcblxuICAgIGNvbnN0IG5hbWUgPSBkYXJrTGlnaHRTcGxpdFsyXSB8fCBkYXJrTGlnaHRTcGxpdC5zbGljZSgwLCAyKS5qb2luKCd+JykucmVwbGFjZSgnLycsICctJyk7XG5cbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoY29kZVRoZW1lUGF0aCArIG5hbWUgKyAnLmNzcycpKVxuICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgIGNvbnN0IGxpZ2h0VGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMF0gKyAnLmNzcycpO1xuICAgIGNvbnN0IGRhcmtUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFsxXSArICcuY3NzJyk7XG5cbiAgICBjb25zdCBbc3RhcnQsIGRhcmssIGxpZ2h0XSA9IHNwbGl0U3RhcnQoZGFya1RleHQsIGxpZ2h0VGV4dCk7XG4gICAgY29uc3QgZGFya0xpZ2h0ID0gYCR7c3RhcnR9QG1lZGlhKHByZWZlcnMtY29sb3Itc2NoZW1lOmRhcmspeyR7ZGFya319QG1lZGlhKHByZWZlcnMtY29sb3Itc2NoZW1lOmxpZ2h0KXske2xpZ2h0fX1gO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoY29kZVRoZW1lUGF0aCArIG5hbWUgKyAnLmNzcycsIGRhcmtMaWdodCk7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXV0b0NvZGVUaGVtZSgpIHtcbiAgICByZXR1cm4gY3JlYXRlQXV0b1RoZW1lKCdhdG9tLW9uZS1saWdodHxhdG9tLW9uZS1kYXJrfGF0b20tb25lJylcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkICwgc2V0RGF0YUhUTUxUYWd9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsICBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGhlYWQke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbylcbiAgICAgICAgICAgIH1ARGVmYXVsdEluc2VydEJ1bmRsZTwvaGVhZD5gLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBidWlsZEJ1bmRsZVN0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLmJ1aWxkSGVhZCgpO1xuICAgIFxuICAgIGNvbnN0IGJ1bmRsZVBsYWNlaG9sZGVyID0gWy9ASW5zZXJ0QnVuZGxlKDs/KS8sIC9ARGVmYXVsdEluc2VydEJ1bmRsZSg7PykvXTtcbiAgICBjb25zdCByZW1vdmVCdW5kbGUgPSAoKSA9PiB7YnVuZGxlUGxhY2Vob2xkZXIuZm9yRWFjaCh4ID0+IHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSh4LCAnJykpOyByZXR1cm4gcGFnZURhdGF9O1xuXG5cbiAgICBpZiAoIWJ1aWxkQnVuZGxlU3RyaW5nKSAgLy8gdGhlcmUgaXNuJ3QgYW55dGhpbmcgdG8gYnVuZGxlXG4gICAgICAgIHJldHVybiByZW1vdmVCdW5kbGUoKTtcblxuICAgIGNvbnN0IHJlcGxhY2VXaXRoID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYnVpbGRCdW5kbGVTdHJpbmcpOyAvLyBhZGQgYnVuZGxlIHRvIHBhZ2VcbiAgICBsZXQgYnVuZGxlU3VjY2VlZCA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGVQbGFjZWhvbGRlci5sZW5ndGggJiYgIWJ1bmRsZVN1Y2NlZWQ7IGkrKylcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihidW5kbGVQbGFjZWhvbGRlcltpXSwgKCkgPT4gKGJ1bmRsZVN1Y2NlZWQgPSB0cnVlKSAmJiByZXBsYWNlV2l0aCk7XG5cbiAgICBpZihidW5kbGVTdWNjZWVkKVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGEuUGx1cyQgYFxcbm91dF9ydW5fc2NyaXB0LnRleHQrPScke3JlcGxhY2VXaXRofSc7YDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHR5cGUgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBjb21waWxlVmFsdWVzLCBtYWtlVmFsaWRhdGlvbkpTT04sIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcblxuY29uc3Qgc2VydmVTY3JpcHQgPSAnL3NlcnYvY29ubmVjdC5qcyc7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgZnVuY3Rpb24gJHtuYW1lfSguLi5hcmdzKXtyZXR1cm4gY29ubmVjdG9yKFwiJHtuYW1lfVwiLCBhcmdzKX1gO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgeyBTb21lUGx1Z2lucyB9LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbmFtZSA9IGRhdGFUYWcuZ2V0VmFsdWUoJ25hbWUnKSxcbiAgICAgICAgc2VuZFRvID0gZGF0YVRhZy5nZXRWYWx1ZSgnc2VuZFRvJyksXG4gICAgICAgIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5nZXRWYWx1ZSgndmFsaWRhdGUnKSxcbiAgICAgICAgbm90VmFsaWQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdub3RWYWxpZCcpO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdtZXNzYWdlJyk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlID09PSBudWxsKVxuICAgICAgICBtZXNzYWdlID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgIVNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpO1xuXG4gICAgICAgIHNlc3Npb25JbmZvLnNjcmlwdChzZXJ2ZVNjcmlwdCwgeyBhc3luYzogbnVsbCB9KVxuXG4gICAgc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKS5hZGRUZXh0KHRlbXBsYXRlKG5hbWUpKTsgLy8gYWRkIHNjcmlwdFxuXG4gICAgc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geC50cmltKCkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGEsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogdHJ1ZVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgbGV0IGJ1aWxkT2JqZWN0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2Ygc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkpIHtcbiAgICAgICAgaWYgKGkudHlwZSAhPSAnY29ubmVjdCcpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBidWlsZE9iamVjdCArPSBgLFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOlwiJHtpLm5hbWV9XCIsXG4gICAgICAgICAgICBzZW5kVG86JHtpLnNlbmRUb30sXG4gICAgICAgICAgICBub3RWYWxpZDogJHtpLm5vdFZhbGlkIHx8ICdudWxsJ30sXG4gICAgICAgICAgICBtZXNzYWdlOiR7dHlwZW9mIGkubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGBcIiR7aS5tZXNzYWdlfVwiYCA6IGkubWVzc2FnZX0sXG4gICAgICAgICAgICB2YWxpZGF0b3I6WyR7KGkudmFsaWRhdG9yICYmIGkudmFsaWRhdG9yLm1hcChjb21waWxlVmFsdWVzKS5qb2luKCcsJykpIHx8ICcnfV1cbiAgICAgICAgfWA7XG4gICAgfVxuXG4gICAgYnVpbGRPYmplY3QgPSBgWyR7YnVpbGRPYmplY3Quc3Vic3RyaW5nKDEpfV1gO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gYFxuICAgICAgICBpZihQb3N0Py5jb25uZWN0b3JDYWxsKXtcbiAgICAgICAgICAgIGlmKGF3YWl0IGhhbmRlbENvbm5lY3RvcihcImNvbm5lY3RcIiwgcGFnZSwgJHtidWlsZE9iamVjdH0pKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1gO1xuXG4gICAgaWYgKHBhZ2VEYXRhLmluY2x1ZGVzKFwiQENvbm5lY3RIZXJlXCIpKVxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKC9AQ29ubmVjdEhlcmUoOz8pLywgKCkgPT4gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYWRkU2NyaXB0KSk7XG4gICAgZWxzZVxuICAgICAgICBwYWdlRGF0YS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGFkZFNjcmlwdCk7XG5cbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yQXJyYXk6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzUGFnZS5Qb3N0Py5jb25uZWN0b3JDYWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cblxuICAgIGNvbnN0IGhhdmUgPSBjb25uZWN0b3JBcnJheS5maW5kKHggPT4geC5uYW1lID09IHRoaXNQYWdlLlBvc3QuY29ubmVjdG9yQ2FsbC5uYW1lKTtcblxuICAgIGlmICghaGF2ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwudmFsdWVzO1xuICAgIGNvbnN0IGlzVmFsaWQgPSBoYXZlLnZhbGlkYXRvci5sZW5ndGggJiYgYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgaGF2ZS52YWxpZGF0b3IpO1xuXG4gICAgdGhpc1BhZ2Uuc2V0UmVzcG9uc2UoJycpO1xuXG4gICAgY29uc3QgYmV0dGVySlNPTiA9IChvYmo6IGFueSkgPT4ge1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhdmUudmFsaWRhdG9yLmxlbmd0aCB8fCBpc1ZhbGlkID09PSB0cnVlKVxuICAgICAgICBiZXR0ZXJKU09OKGF3YWl0IGhhdmUuc2VuZFRvKC4uLnZhbHVlcykpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5ub3RWYWxpZClcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLm5vdFZhbGlkKC4uLjxhbnk+aXNWYWxpZCkpO1xuXG4gICAgZWxzZSBpZiAoaGF2ZS5tZXNzYWdlKVxuICAgICAgICBiZXR0ZXJKU09OKHtcbiAgICAgICAgICAgIGVycm9yOiB0eXBlb2YgaGF2ZS5tZXNzYWdlID09ICdzdHJpbmcnID8gaGF2ZS5tZXNzYWdlIDogKDxhbnk+aXNWYWxpZCkuc2hpZnQoKVxuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIHRoaXNQYWdlLlJlc3BvbnNlLnN0YXR1cyg0MDApO1xuXG4gICAgcmV0dXJuIHRydWU7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVZhbHVlcywgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBjb25zdCBzZW5kVG8gPSBkYXRhVGFnLnJlbW92ZSgnc2VuZFRvJykudHJpbSgpO1xuXG4gICAgaWYgKCFzZW5kVG8pICAvLyBzcGVjaWFsIGFjdGlvbiBub3QgZm91bmRcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPGZvcm0ke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCAgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICAgICAgfTwvZm9ybT5gLFxuICAgICAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgICAgICB9XG5cblxuICAgIGNvbnN0IG5hbWUgPSBkYXRhVGFnLnJlbW92ZSgnbmFtZScpLnRyaW0oKSB8fCB1dWlkKCksIHZhbGlkYXRvcjogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ3ZhbGlkYXRlJyksIG9yZGVyRGVmYXVsdDogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ29yZGVyJyksIG5vdFZhbGlkOiBzdHJpbmcgPSBkYXRhVGFnLnJlbW92ZSgnbm90VmFsaWQnKSwgcmVzcG9uc2VTYWZlID0gZGF0YVRhZy5oYXZlKCdzYWZlJyk7XG5cbiAgICBsZXQgbWVzc2FnZSA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ21lc3NhZ2UnKTsgLy8gc2hvdyBlcnJvciBtZXNzYWdlXG4gICAgaWYgKG1lc3NhZ2UgPT09IG51bGwpXG4gICAgICAgIG1lc3NhZ2UgPSBzZXNzaW9uSW5mby5kZWJ1ZyAmJiAhSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiU2FmZURlYnVnXCIpO1xuXG4gICAgbGV0IG9yZGVyID0gW107XG5cbiAgICBjb25zdCB2YWxpZGF0b3JBcnJheSA9IHZhbGlkYXRvciAmJiB2YWxpZGF0b3Iuc3BsaXQoJywnKS5tYXAoeCA9PiB7IC8vIENoZWNraW5nIGlmIHRoZXJlIGlzIGFuIG9yZGVyIGluZm9ybWF0aW9uLCBmb3IgZXhhbXBsZSBcInByb3AxOiBzdHJpbmcsIHByb3AzOiBudW0sIHByb3AyOiBib29sXCJcbiAgICAgICAgY29uc3Qgc3BsaXQgPSBTcGxpdEZpcnN0KCc6JywgeC50cmltKCkpO1xuXG4gICAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAxKVxuICAgICAgICAgICAgb3JkZXIucHVzaChzcGxpdC5zaGlmdCgpKTtcblxuICAgICAgICByZXR1cm4gc3BsaXQucG9wKCk7XG4gICAgfSk7XG5cbiAgICBpZiAob3JkZXJEZWZhdWx0KVxuICAgICAgICBvcmRlciA9IG9yZGVyRGVmYXVsdC5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKTtcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2VuZFRvLFxuICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvckFycmF5LFxuICAgICAgICBvcmRlcjogb3JkZXIubGVuZ3RoICYmIG9yZGVyLFxuICAgICAgICBub3RWYWxpZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgcmVzcG9uc2VTYWZlXG4gICAgfSk7XG5cbiAgICBpZiAoIWRhdGFUYWcuaGF2ZSgnbWV0aG9kJykpIHtcbiAgICAgICAgZGF0YVRhZy5wdXNoKHtcbiAgICAgICAgICAgIG46IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdtZXRob2QnKSxcbiAgICAgICAgICAgIHY6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdwb3N0JylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGlsZWRTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRcbiAgICAgICAgYDwlIVxuQD9Db25uZWN0SGVyZUZvcm0oJHtzZW5kVG99KTtcbiU+PGZvcm0ke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT5cbiAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjb25uZWN0b3JGb3JtQ2FsbFwiIHZhbHVlPVwiJHtuYW1lfVwiLz4ke2F3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyl9PC9mb3JtPmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZyxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkubGVuZ3RoKVxuICAgICAgICByZXR1cm4gcGFnZURhdGE7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2Ygc2Vzc2lvbkluZm8uY29ubmVjdG9yQXJyYXkpIHtcbiAgICAgICAgaWYgKGkudHlwZSAhPSAnZm9ybScpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzZW5kVG9Vbmljb2RlID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgaS5zZW5kVG8pLnVuaWNvZGUuZXFcbiAgICAgICAgY29uc3QgY29ubmVjdCA9IG5ldyBSZWdFeHAoYEBDb25uZWN0SGVyZUZvcm1cXFxcKFsgXSoke3NlbmRUb1VuaWNvZGV9WyBdKlxcXFwpKDs/KWApLCBjb25uZWN0RGVmYXVsdCA9IG5ldyBSZWdFeHAoYEBcXFxcP0Nvbm5lY3RIZXJlRm9ybVxcXFwoWyBdKiR7c2VuZFRvVW5pY29kZX1bIF0qXFxcXCkoOz8pYCk7XG5cbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0IHNjcmlwdERhdGEgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihkYXRhWzBdLlN0YXJ0SW5mbykuUGx1cyRcbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgaWYoUG9zdD8uY29ubmVjdG9yRm9ybUNhbGwgPT0gXCIke2kubmFtZX1cIil7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGhhbmRlbENvbm5lY3RvcihcImZvcm1cIiwgcGFnZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdFZhbGlkOiAke2kubm90VmFsaWQgfHwgJ251bGwnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3I6WyR7aS52YWxpZGF0b3I/Lm1hcD8uKGNvbXBpbGVWYWx1ZXMpPy5qb2luKCcsJykgPz8gJyd9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogWyR7aS5vcmRlcj8ubWFwPy4oaXRlbSA9PiBgXCIke2l0ZW19XCJgKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhZmU6JHtpLnJlc3BvbnNlU2FmZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICB9O1xuXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoY29ubmVjdCwgc2NyaXB0RGF0YSk7XG5cbiAgICAgICAgaWYgKGNvdW50ZXIpXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoY29ubmVjdERlZmF1bHQsICcnKTsgLy8gZGVsZXRpbmcgZGVmYXVsdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3REZWZhdWx0LCBzY3JpcHREYXRhKTtcblxuICAgIH1cblxuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRlbENvbm5lY3Rvcih0aGlzUGFnZTogYW55LCBjb25uZWN0b3JJbmZvOiBhbnkpIHtcblxuICAgIGRlbGV0ZSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckZvcm1DYWxsO1xuXG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8ub3JkZXIubGVuZ3RoKSAvLyBwdXNoIHZhbHVlcyBieSBzcGVjaWZpYyBvcmRlclxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY29ubmVjdG9ySW5mby5vcmRlcilcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRoaXNQYWdlLlBvc3RbaV0pO1xuICAgIGVsc2VcbiAgICAgICAgdmFsdWVzLnB1c2goLi4uT2JqZWN0LnZhbHVlcyh0aGlzUGFnZS5Qb3N0KSk7XG5cblxuICAgIGxldCBpc1ZhbGlkOiBib29sZWFuIHwgc3RyaW5nW10gPSB0cnVlO1xuXG4gICAgaWYgKGNvbm5lY3RvckluZm8udmFsaWRhdG9yLmxlbmd0aCkgeyAvLyB2YWxpZGF0ZSB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcGFyc2VWYWx1ZXModmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgICAgIGlzVmFsaWQgPSBhd2FpdCBtYWtlVmFsaWRhdGlvbkpTT04odmFsdWVzLCBjb25uZWN0b3JJbmZvLnZhbGlkYXRvcik7XG4gICAgfVxuXG4gICAgbGV0IHJlc3BvbnNlOiBhbnk7XG5cbiAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjb25uZWN0b3JJbmZvLnNlbmRUbyguLi52YWx1ZXMpO1xuICAgIGVsc2UgaWYgKGNvbm5lY3RvckluZm8ubm90VmFsaWQpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpO1xuXG4gICAgaWYgKCFpc1ZhbGlkICYmICFyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8ubWVzc2FnZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShjb25uZWN0b3JJbmZvLm1lc3NhZ2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXNwb25zZSA9IGNvbm5lY3RvckluZm8ubWVzc2FnZTtcblxuICAgIGlmIChyZXNwb25zZSlcbiAgICAgICAgaWYgKGNvbm5lY3RvckluZm8uc2FmZSlcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlU2FmZShyZXNwb25zZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXNQYWdlLndyaXRlKHJlc3BvbnNlKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IFN0b3JlSlNPTiBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZUpTT04nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHJlY29yZFN0b3JlID0gbmV3IFN0b3JlSlNPTignUmVjb3JkcycpO1xuXG5mdW5jdGlvbiByZWNvcmRMaW5rKGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuICAgIHJldHVybiBkYXRhVGFnLnJlbW92ZSgnbGluaycpfHwgc21hbGxQYXRoVG9QYWdlKHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmVjb3JkUGF0aChkZWZhdWx0TmFtZTogc3RyaW5nLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpe1xuICAgIGNvbnN0IGxpbmsgPSByZWNvcmRMaW5rKGRhdGFUYWcsIHNlc3Npb25JbmZvKSwgc2F2ZU5hbWUgPSBkYXRhVGFnLnJlbW92ZSgnbmFtZScpIHx8IGRlZmF1bHROYW1lO1xuXG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdID8/PSB7fTtcbiAgICByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10gPz89ICcnO1xuICAgIHNlc3Npb25JbmZvLnJlY29yZChzYXZlTmFtZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdG9yZTogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdLFxuICAgICAgICBjdXJyZW50OiByZWNvcmRTdG9yZS5zdG9yZVtzYXZlTmFtZV1bbGlua10sXG4gICAgICAgIGxpbmtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUocGF0aE5hbWU6IHN0cmluZywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIEJldHdlZW5UYWdEYXRhID0gYXdhaXQgSW5zZXJ0Q29tcG9uZW50LlN0YXJ0UmVwbGFjZShCZXR3ZWVuVGFnRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcihCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEuZXh0cmFjdEluZm8oKSlcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgIGxldCBodG1sID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaHRtbCArPSBpLnRleHQuZXE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBodG1sID0gaHRtbC50cmltKCk7XG5cbiAgICBjb25zdCB7c3RvcmUsIGxpbmt9ID0gbWFrZVJlY29yZFBhdGgoJ3JlY29yZHMvcmVjb3JkLnNlcnYnLCBkYXRhVGFnLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBpZighc3RvcmVbbGlua10uaW5jbHVkZXMoaHRtbCkpe1xuICAgICAgICBzdG9yZVtsaW5rXSArPSBodG1sO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJlZm9yZVJlQnVpbGQoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IG5hbWUgPSBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoKTtcbiAgICBmb3IoY29uc3Qgc2F2ZSBpbiByZWNvcmRTdG9yZS5zdG9yZSl7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSByZWNvcmRTdG9yZS5zdG9yZVtzYXZlXTtcblxuICAgICAgICBpZihpdGVtW25hbWVdKXtcbiAgICAgICAgICAgIGl0ZW1bbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkZWxldGUgaXRlbVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlY29yZHMoc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uLmRlYnVnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIHNlc3Npb24ucmVjb3JkTmFtZXMpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlckNvbXBpbGUoKXtcbiAgICByZWNvcmRTdG9yZS5jbGVhcigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGUoKXtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBuYW1lICsgJy5qc29uJztcbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChuYW1lLCBnZXRUeXBlcy5TdGF0aWNbMF0pO1xuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShmaWxlUGF0aCwgcmVjb3JkU3RvcmUuc3RvcmVbbmFtZV0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInXG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5pbXBvcnQgeyBtYWtlUmVjb3JkUGF0aH0gZnJvbSAnLi9yZWNvcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUoIHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qge3N0b3JlLCBsaW5rLCBjdXJyZW50fSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3NlYXJjaC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgIGNvbnN0IHNlYXJjaE9iamVjdCA9IGJ1aWxkT2JqZWN0KGh0bWwsIGRhdGFUYWcucmVtb3ZlKCdtYXRjaCcpIHx8ICdoMVtpZF0sIGgyW2lkXSwgaDNbaWRdLCBoNFtpZF0sIGg1W2lkXSwgaDZbaWRdJyk7XG5cbiAgICBpZighY3VycmVudCl7XG4gICAgICAgIHN0b3JlW2xpbmtdID0gc2VhcmNoT2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY3VycmVudC50aXRsZXMsc2VhcmNoT2JqZWN0LnRpdGxlcyk7XG5cbiAgICAgICAgaWYoIWN1cnJlbnQudGV4dC5pbmNsdWRlcyhzZWFyY2hPYmplY3QudGV4dCkpe1xuICAgICAgICAgICAgY3VycmVudC50ZXh0ICs9IHNlYXJjaE9iamVjdC50ZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhXG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZE9iamVjdChodG1sOiBzdHJpbmcsIG1hdGNoOiBzdHJpbmcpIHtcbiAgICBjb25zdCByb290ID0gcGFyc2UoaHRtbCwge1xuICAgICAgICBibG9ja1RleHRFbGVtZW50czoge1xuICAgICAgICAgICAgc2NyaXB0OiBmYWxzZSxcbiAgICAgICAgICAgIHN0eWxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vc2NyaXB0OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aXRsZXM6IFN0cmluZ01hcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChtYXRjaCkpIHtcbiAgICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmF0dHJpYnV0ZXNbJ2lkJ107XG4gICAgICAgIHRpdGxlc1tpZF0gPSBlbGVtZW50LmlubmVyVGV4dC50cmltKCk7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGVzLFxuICAgICAgICB0ZXh0OiByb290LmlubmVyVGV4dC50cmltKCkucmVwbGFjZSgvWyBcXG5dezIsfS9nLCAnICcpLnJlcGxhY2UoL1tcXG5dL2csICcgJylcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9Db21wb25lbnRzL2NsaWVudCc7XG5pbXBvcnQgc2NyaXB0IGZyb20gJy4vQ29tcG9uZW50cy9zY3JpcHQvaW5kZXgnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vQ29tcG9uZW50cy9zdHlsZS9pbmRleCc7XG5pbXBvcnQgcGFnZSBmcm9tICcuL0NvbXBvbmVudHMvcGFnZSc7XG5pbXBvcnQgaXNvbGF0ZSBmcm9tICcuL0NvbXBvbmVudHMvaXNvbGF0ZSc7XG5pbXBvcnQgc3ZlbHRlIGZyb20gJy4vQ29tcG9uZW50cy9zdmVsdGUnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJy4vQ29tcG9uZW50cy9tYXJrZG93bic7XG5pbXBvcnQgaGVhZCwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRIZWFkIH0gZnJvbSAnLi9Db21wb25lbnRzL2hlYWQnO1xuaW1wb3J0IGNvbm5lY3QsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkQ29ubmVjdCwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckNvbm5lY3QgfSBmcm9tICcuL0NvbXBvbmVudHMvY29ubmVjdCc7XG5pbXBvcnQgZm9ybSwgeyBhZGRGaW5hbGl6ZUJ1aWxkIGFzIGFkZEZpbmFsaXplQnVpbGRGb3JtLCBoYW5kZWxDb25uZWN0b3IgYXMgaGFuZGVsQ29ubmVjdG9yRm9ybSB9IGZyb20gJy4vQ29tcG9uZW50cy9mb3JtJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHJlY29yZCwgeyB1cGRhdGVSZWNvcmRzLCBwZXJDb21waWxlIGFzIHBlckNvbXBpbGVSZWNvcmQsIHBvc3RDb21waWxlIGFzIHBvc3RDb21waWxlUmVjb3JkLCBkZWxldGVCZWZvcmVSZUJ1aWxkIH0gZnJvbSAnLi9Db21wb25lbnRzL3JlY29yZCc7XG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vQ29tcG9uZW50cy9zZWFyY2gnO1xuXG5leHBvcnQgY29uc3QgQWxsQnVpbGRJbiA9IFtcImNsaWVudFwiLCBcInNjcmlwdFwiLCBcInN0eWxlXCIsIFwicGFnZVwiLCBcImNvbm5lY3RcIiwgXCJpc29sYXRlXCIsIFwiZm9ybVwiLCBcImhlYWRcIiwgXCJzdmVsdGVcIiwgXCJtYXJrZG93blwiLCBcInJlY29yZFwiLCBcInNlYXJjaFwiXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFN0YXJ0Q29tcGlsaW5nKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgbGV0IHJlRGF0YTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PjtcblxuICAgIHN3aXRjaCAodHlwZS5lcS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgXCJjbGllbnRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNsaWVudChwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyZWNvcmRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHJlY29yZCggcGF0aE5hbWUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VhcmNoXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzZWFyY2goIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2NyaXB0KCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3R5bGUoIHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBhZ2VcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHBhZ2UocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gY29ubmVjdCh0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZvcm1cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGZvcm0ocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXNvbGF0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gaXNvbGF0ZShCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGhlYWQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3ZlbHRlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBzdmVsdGUodHlwZSwgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtYXJrZG93blwiOlxuICAgICAgICAgICAgcmVEYXRhID0gbWFya2Rvd24odHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ29tcG9uZW50IGlzIG5vdCBidWlsZCB5ZXRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzSW5jbHVkZSh0YWduYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gQWxsQnVpbGRJbi5pbmNsdWRlcyh0YWduYW1lLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluYWxpemVCdWlsZChwYWdlRGF0YTogU3RyaW5nVHJhY2tlciwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB1cGRhdGVSZWNvcmRzKHNlc3Npb25JbmZvKTtcblxuICAgIHBhZ2VEYXRhID0gYWRkRmluYWxpemVCdWlsZENvbm5lY3QocGFnZURhdGEsIHNlc3Npb25JbmZvKTtcbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRGb3JtKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKC9AQ29ubmVjdEhlcmUoOz8pL2dpLCAnJykucmVwbGFjZSgvQENvbm5lY3RIZXJlRm9ybSg7PykvZ2ksICcnKTtcblxuICAgIHBhZ2VEYXRhID0gYXdhaXQgYWRkRmluYWxpemVCdWlsZEhlYWQocGFnZURhdGEsIHNlc3Npb25JbmZvLCBmdWxsQ29tcGlsZVBhdGgpO1xuICAgIHJldHVybiBwYWdlRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRlbENvbm5lY3RvclNlcnZpY2UodHlwZTogc3RyaW5nLCB0aGlzUGFnZTogYW55LCBjb25uZWN0b3JBcnJheTogYW55W10pIHtcbiAgICBpZiAodHlwZSA9PSAnY29ubmVjdCcpXG4gICAgICAgIHJldHVybiBoYW5kZWxDb25uZWN0b3JDb25uZWN0KHRoaXNQYWdlLCBjb25uZWN0b3JBcnJheSk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gaGFuZGVsQ29ubmVjdG9yRm9ybSh0aGlzUGFnZSwgY29ubmVjdG9yQXJyYXkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGVyQ29tcGlsZSgpIHtcbiAgICBwZXJDb21waWxlUmVjb3JkKClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlKCkge1xuICAgIHBvc3RDb21waWxlUmVjb3JkKClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKXtcbiAgICBzZXNzaW9uSW5mby5kZWJ1ZyAmJiBkZWxldGVCZWZvcmVSZUJ1aWxkKHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZVBhZ2Uoc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgZnVsbENvbXBpbGVQYXRoOiBzdHJpbmcpe1xuICAgIFxufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgUGFyc2VEZWJ1Z0luZm8sIENyZWF0ZUZpbGVQYXRoLCBQYXRoVHlwZXMsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCB7IEFsbEJ1aWxkSW4sIElzSW5jbHVkZSwgU3RhcnRDb21waWxpbmcgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciwgeyBTdHJpbmdUcmFja2VyRGF0YUluZm8sIEFycmF5TWF0Y2ggfSBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIHRhZ0RhdGFPYmplY3RBc1RleHQsIENvbXBpbGVJbkZpbGVGdW5jLCBTdHJpbmdBcnJheU9yT2JqZWN0LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBJbnNlcnRDb21wb25lbnRCYXNlLCBCYXNlUmVhZGVyIH0gZnJvbSAnLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgcGF0aE5vZGUgZnJvbSAncGF0aCc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcblxuaW50ZXJmYWNlIERlZmF1bHRWYWx1ZXMge1xuICAgIHZhbHVlOiBTdHJpbmdUcmFja2VyLFxuICAgIGVsZW1lbnRzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnNlcnRDb21wb25lbnQgZXh0ZW5kcyBJbnNlcnRDb21wb25lbnRCYXNlIHtcbiAgICBwdWJsaWMgZGlyRm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIFBsdWdpbkJ1aWxkOiBBZGRQbHVnaW47XG4gICAgcHVibGljIENvbXBpbGVJbkZpbGU6IENvbXBpbGVJbkZpbGVGdW5jO1xuICAgIHB1YmxpYyBNaWNyb1BsdWdpbnM6IFN0cmluZ0FycmF5T3JPYmplY3Q7XG4gICAgcHVibGljIEdldFBsdWdpbjogKG5hbWU6IHN0cmluZykgPT4gYW55O1xuICAgIHB1YmxpYyBTb21lUGx1Z2luczogKC4uLm5hbWVzOiBzdHJpbmdbXSkgPT4gYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNUczogKCkgPT4gYm9vbGVhbjtcblxuICAgIHByaXZhdGUgcmVnZXhTZWFyY2g6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKFBsdWdpbkJ1aWxkOiBBZGRQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoUHJpbnRJZk5ldyk7XG4gICAgICAgIHRoaXMuZGlyRm9sZGVyID0gJ0NvbXBvbmVudHMnO1xuICAgICAgICB0aGlzLlBsdWdpbkJ1aWxkID0gUGx1Z2luQnVpbGQ7XG4gICAgICAgIHRoaXMucmVnZXhTZWFyY2ggPSBuZXcgUmVnRXhwKGA8KFtcXFxccHtMdX1fXFxcXC06MC05XXwke0FsbEJ1aWxkSW4uam9pbignfCcpfSlgLCAndScpXG4gICAgfVxuXG4gICAgRmluZFNwZWNpYWxUYWdCeVN0YXJ0KHN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLlNraXBTcGVjaWFsVGFnKSB7XG4gICAgICAgICAgICBpZiAoc3RyaW5nLnN1YnN0cmluZygwLCBpWzBdLmxlbmd0aCkgPT0gaVswXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXQgdGFrZXMgYSBzdHJpbmcgb2YgSFRNTCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlLFxuICAgICAqIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLCBhbmQgdGhlIGNoYXJhY3RlciB0aGF0IGNvbWVzIGFmdGVyIHRoZSBhdHRyaWJ1dGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IHRleHQgLSBUaGUgdGV4dCB0byBwYXJzZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICAgICAqL1xuICAgIHRhZ0RhdGEodGV4dDogU3RyaW5nVHJhY2tlcik6IHsgZGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBtYXBBdHRyaWJ1dGVzOiBTdHJpbmdBbnlNYXAgfSB7XG4gICAgICAgIGNvbnN0IHRva2VuQXJyYXkgPSBbXSwgYTogdGFnRGF0YU9iamVjdEFycmF5ID0gW10sIG1hcEF0dHJpYnV0ZXM6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgICAgIHRleHQgPSB0ZXh0LnRyaW0oKS5yZXBsYWNlcigvKDwlKShbXFx3XFxXXSs/KSglPikvLCBkYXRhID0+IHtcbiAgICAgICAgICAgIHRva2VuQXJyYXkucHVzaChkYXRhWzJdKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhWzFdLlBsdXMoZGF0YVszXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHVuVG9rZW4gPSAodGV4dDogU3RyaW5nVHJhY2tlcikgPT4gdGV4dC5yZXBsYWNlcigvKDwlKSglPikvLCAoZGF0YSkgPT4gZGF0YVsxXS5QbHVzKHRva2VuQXJyYXkuc2hpZnQoKSkuUGx1cyhkYXRhWzJdKSlcblxuICAgICAgICBsZXQgZmFzdFRleHQgPSB0ZXh0LmVxO1xuICAgICAgICBjb25zdCBTa2lwVHlwZXMgPSBbJ1wiJywgXCInXCIsICdgJ10sIEJsb2NrVHlwZXMgPSBbXG4gICAgICAgICAgICBbJ3snLCAnfSddLFxuICAgICAgICAgICAgWycoJywgJyknXVxuICAgICAgICBdO1xuXG4gICAgICAgIHdoaWxlIChmYXN0VGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgZmFzdFRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyID0gZmFzdFRleHQuY2hhckF0KGkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFyID09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dENoYXIgPSB0ZXh0LmF0KGkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dENoYXJFcSA9IG5leHRDaGFyLmVxLCBhdHRyTmFtZSA9IHRleHQuc3Vic3RyaW5nKDAsIGkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZTogU3RyaW5nVHJhY2tlciwgZW5kSW5kZXg6IG51bWJlciwgYmxvY2tFbmQ6IHN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNraXBUeXBlcy5pbmNsdWRlcyhuZXh0Q2hhckVxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEoZmFzdFRleHQuc3Vic3RyaW5nKGkgKyAyKSwgbmV4dENoYXJFcSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0ZXh0LnN1YnN0cihpICsgMiwgZW5kSW5kZXggLSAyKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChibG9ja0VuZCA9IEJsb2NrVHlwZXMuZmluZCh4ID0+IHhbMF0gPT0gbmV4dENoYXJFcSk/LlsxXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihmYXN0VGV4dC5zdWJzdHJpbmcoaSArIDIpLCBbbmV4dENoYXJFcSwgYmxvY2tFbmRdKSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRleHQuc3Vic3RyKGkgKyAxLCBlbmRJbmRleCArIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGZhc3RUZXh0LnN1YnN0cmluZyhpICsgMSkuc2VhcmNoKC8gfFxcbi8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gZmFzdFRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0ZXh0LnN1YnN0cihpICsgMSwgZW5kSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dENoYXIgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHVuVG9rZW4oYXR0ck5hbWUpLCB2ID0gdW5Ub2tlbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcEF0dHJpYnV0ZXNbbi5lcV0gPSB2LmVxO1xuICAgICAgICAgICAgICAgICAgICBhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHYsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyOiBuZXh0Q2hhclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxICsgZW5kSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGFyID09ICcgJyB8fCBpID09IGZhc3RUZXh0Lmxlbmd0aCAtIDEgJiYgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSB1blRva2VuKHRleHQuc3Vic3RyaW5nKDAsIGkpKTtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG46IG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcEF0dHJpYnV0ZXNbbi5lcV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmFzdFRleHQgPSBmYXN0VGV4dC5zdWJzdHJpbmcoaSkudHJpbSgpO1xuICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKGkpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vbWV0aG9kcyB0byB0aGUgYXJyYXlcbiAgICAgICAgY29uc3QgaW5kZXggPSAobmFtZTogc3RyaW5nKSA9PiBhLmZpbmRJbmRleCh4ID0+IHgubi5lcSA9PSBuYW1lKTtcbiAgICAgICAgY29uc3QgZ2V0VmFsdWUgPSAobmFtZTogc3RyaW5nKSA9PiBhLmZpbmQodGFnID0+IHRhZy5uLmVxID09IG5hbWUpPy52Py5lcSA/PyAnJztcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmFtZUluZGV4ID0gaW5kZXgobmFtZSk7XG4gICAgICAgICAgICBpZiAobmFtZUluZGV4ID09IC0xKVxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIHJldHVybiBhLnNwbGljZShuYW1lSW5kZXgsIDEpLnBvcCgpLnY/LmVxID8/ICcnO1xuICAgICAgICB9O1xuXG4gICAgICAgIGEuaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IGluZGV4KG5hbWUpICE9IC0xO1xuICAgICAgICBhLmdldFZhbHVlID0gZ2V0VmFsdWU7XG4gICAgICAgIGEucmVtb3ZlID0gcmVtb3ZlO1xuICAgICAgICBhLmFkZENsYXNzID0gYyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gaW5kZXgoJ2NsYXNzJyk7XG4gICAgICAgICAgICBpZiAoaSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGEucHVzaCh7IG46IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdjbGFzcycpLCB2OiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjKSwgY2hhcjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ1wiJykgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFbaV07XG4gICAgICAgICAgICBpZiAoaXRlbS52Lmxlbmd0aClcbiAgICAgICAgICAgICAgICBjID0gJyAnICsgYztcbiAgICAgICAgICAgIGl0ZW0udi5BZGRUZXh0QWZ0ZXIoYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZGF0YTogYSwgbWFwQXR0cmlidXRlcyB9O1xuICAgIH1cblxuICAgIGZpbmRJbmRleFNlYXJjaFRhZyhxdWVyeTogc3RyaW5nLCB0YWc6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcXVlcnkuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGFnLmluZGV4T2YoaSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgV2FyaW5nLCBjYW4ndCBmaW5kIGFsbCBxdWVyeSBpbiB0YWcgLT4gJHt0YWcuZXF9XFxuJHt0YWcubGluZUluZm99YCxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcInF1ZXJ5LW5vdC1mb3VuZFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIgKz0gaW5kZXggKyBpLmxlbmd0aFxuICAgICAgICAgICAgdGFnID0gdGFnLnN1YnN0cmluZyhpbmRleCArIGkubGVuZ3RoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50ZXIgKyB0YWcuc2VhcmNoKC9cXCB8XFw+LylcbiAgICB9XG5cbiAgICBSZUJ1aWxkVGFnRGF0YShzdHJpbmdJbmZvOiBTdHJpbmdUcmFja2VyRGF0YUluZm8sIGRhdGFUYWdTcGxpdHRlcjogdGFnRGF0YU9iamVjdEFycmF5KSB7XG4gICAgICAgIGxldCBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGRhdGFUYWdTcGxpdHRlcikge1xuICAgICAgICAgICAgaWYgKGkudikge1xuICAgICAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMuUGx1cyRgJHtpLm59PSR7aS5jaGFyfSR7aS52fSR7aS5jaGFyfSBgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMoaS5uLCAnICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGFUYWdTcGxpdHRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld0F0dHJpYnV0ZXMgPSBuZXcgU3RyaW5nVHJhY2tlcihzdHJpbmdJbmZvLCAnICcpLlBsdXMobmV3QXR0cmlidXRlcy5zdWJzdHJpbmcoMCwgbmV3QXR0cmlidXRlcy5sZW5ndGggLSAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBDaGVja01pbkhUTUwoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBpZiAodGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikpIHtcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgYXN5bmMgUmVCdWlsZFRhZyh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnU3BsaWNlZDogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgU2VuZERhdGFGdW5jOiAodGV4dDogU3RyaW5nVHJhY2tlcikgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEgJiYgdGhpcy5Tb21lUGx1Z2lucyhcIk1pbkhUTUxcIiwgXCJNaW5BbGxcIikpIHtcbiAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhID0gQmV0d2VlblRhZ0RhdGEuU3BhY2VPbmUoJyAnKTtcblxuICAgICAgICAgICAgZGF0YVRhZyA9IHRoaXMuUmVCdWlsZFRhZ0RhdGEodHlwZS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWdTcGxpY2VkKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhVGFnLmVxLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YVRhZyA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0LCAnICcpLlBsdXMoZGF0YVRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YWdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMoXG4gICAgICAgICAgICAnPCcsIHR5cGUsIGRhdGFUYWdcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChCZXR3ZWVuVGFnRGF0YSkge1xuICAgICAgICAgICAgdGFnRGF0YS5QbHVzJGA+JHthd2FpdCBTZW5kRGF0YUZ1bmMoQmV0d2VlblRhZ0RhdGEpfTwvJHt0eXBlfT5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFnRGF0YS5QbHVzKCcvPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhZ0RhdGE7XG4gICAgfVxuXG4gICAgZXhwb3J0RGVmYXVsdFZhbHVlcyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgZm91bmRTZXR0ZXJzOiBEZWZhdWx0VmFsdWVzW10gPSBbXSkge1xuICAgICAgICBjb25zdCBpbmRleEJhc2ljOiBBcnJheU1hdGNoID0gZmlsZURhdGEubWF0Y2goL0BkZWZhdWx0WyBdKlxcKChbQS1aYS16MC05e30oKVxcW1xcXV9cXC0kXCInYCUqJnxcXC9cXEAgXFxuXSopXFwpWyBdKlxcWyhbQS1aYS16MC05X1xcLSwkIFxcbl0rKVxcXS8pO1xuXG4gICAgICAgIGlmIChpbmRleEJhc2ljID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4geyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH07XG5cbiAgICAgICAgY29uc3QgV2l0aG91dEJhc2ljID0gZmlsZURhdGEuc3Vic3RyaW5nKDAsIGluZGV4QmFzaWMuaW5kZXgpLlBsdXMoZmlsZURhdGEuc3Vic3RyaW5nKGluZGV4QmFzaWMuaW5kZXggKyBpbmRleEJhc2ljWzBdLmxlbmd0aCkpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5VmFsdWVzID0gaW5kZXhCYXNpY1syXS5lcS5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKTtcblxuICAgICAgICBmb3VuZFNldHRlcnMucHVzaCh7XG4gICAgICAgICAgICB2YWx1ZTogaW5kZXhCYXNpY1sxXSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBhcnJheVZhbHVlc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5leHBvcnREZWZhdWx0VmFsdWVzKFdpdGhvdXRCYXNpYywgZm91bmRTZXR0ZXJzKTtcbiAgICB9XG5cbiAgICBhZGREZWZhdWx0VmFsdWVzKGFycmF5VmFsdWVzOiBEZWZhdWx0VmFsdWVzW10sIGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheVZhbHVlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiZSBvZiBpLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlQWxsKCcjJyArIGJlLCBpLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBwYXJzZUNvbXBvbmVudFByb3BzKHRhZ0RhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgY29tcG9uZW50OiBTdHJpbmdUcmFja2VyKSB7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIGxldCB7IGZpbGVEYXRhLCBmb3VuZFNldHRlcnMgfSA9IHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhjb21wb25lbnQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0YWdEYXRhKSB7XG4gICAgICAgICAgICBpZiAoaS5uLmVxID09ICcmJykge1xuICAgICAgICAgICAgICAgIGxldCByZSA9IGkubi5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgRm91bmRJbmRleDogbnVtYmVyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlLmluY2x1ZGVzKCcmJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSByZS5pbmRleE9mKCcmJyk7XG4gICAgICAgICAgICAgICAgICAgIEZvdW5kSW5kZXggPSB0aGlzLmZpbmRJbmRleFNlYXJjaFRhZyhyZS5zdWJzdHJpbmcoMCwgaW5kZXgpLmVxLCBmaWxlRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJlID0gcmUuc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgRm91bmRJbmRleCA9IGZpbGVEYXRhLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZURhdGFOZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoZmlsZURhdGEuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0RGF0YSA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBGb3VuZEluZGV4KTtcbiAgICAgICAgICAgICAgICBmaWxlRGF0YU5leHQuUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRhLFxuICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihmaWxlRGF0YS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYCAke3JlfT1cIiR7aS52ID8/ICcnfVwiYCxcbiAgICAgICAgICAgICAgICAgICAgKHN0YXJ0RGF0YS5lbmRzV2l0aCgnICcpID8gJycgOiAnICcpLFxuICAgICAgICAgICAgICAgICAgICBmaWxlRGF0YS5zdWJzdHJpbmcoRm91bmRJbmRleClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YU5leHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcIlxcXFx+XCIgKyBpLm4uZXEsIFwiZ2lcIik7XG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKHJlLCBpLnYgPz8gaS5uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZERlZmF1bHRWYWx1ZXMoZm91bmRTZXR0ZXJzLCBmaWxlRGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYnVpbGRUYWdCYXNpYyhmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgdGFnRGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBwYXRoOiBzdHJpbmcsIFNtYWxsUGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLlBsdWdpbkJ1aWxkLkJ1aWxkQ29tcG9uZW50KGZpbGVEYXRhLCBwYXRoLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgICAgIGZpbGVEYXRhID0gdGhpcy5wYXJzZUNvbXBvbmVudFByb3BzKHRhZ0RhdGEsIGZpbGVEYXRhKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGZpbGVEYXRhLnJlcGxhY2UoLzxcXDpyZWFkZXIoICkqXFwvPi9naSwgQmV0d2VlblRhZ0RhdGEgPz8gJycpO1xuXG4gICAgICAgIHBhdGhOYW1lID0gcGF0aE5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGg7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLlN0YXJ0UmVwbGFjZShmaWxlRGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IFBhcnNlRGVidWdJbmZvKGZpbGVEYXRhLCBgJHtwYXRoTmFtZX0gLT5cXG4ke1NtYWxsUGF0aH1gKTtcblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5zZXJ0VGFnRGF0YShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiBTdHJpbmdUcmFja2VyLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9OiB7IHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIEJldHdlZW5UYWdEYXRhPzogU3RyaW5nVHJhY2tlcn0pIHtcbiAgICAgICAgY29uc3QgeyBkYXRhLCBtYXBBdHRyaWJ1dGVzIH0gPSB0aGlzLnRhZ0RhdGEoZGF0YVRhZyksIEJ1aWxkSW4gPSBJc0luY2x1ZGUodHlwZS5lcSk7XG5cbiAgICAgICAgbGV0IGZpbGVEYXRhOiBTdHJpbmdUcmFja2VyLCBTZWFyY2hJbkNvbW1lbnQgPSB0cnVlLCBBbGxQYXRoVHlwZXM6IFBhdGhUeXBlcyA9IHt9LCBhZGRTdHJpbmdJbmZvOiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKEJ1aWxkSW4pIHsvL2NoZWNrIGlmIGl0IGJ1aWxkIGluIGNvbXBvbmVudFxuICAgICAgICAgICAgY29uc3QgeyBjb21waWxlZFN0cmluZywgY2hlY2tDb21wb25lbnRzIH0gPSBhd2FpdCBTdGFydENvbXBpbGluZyggcGF0aE5hbWUsIHR5cGUsIGRhdGEsIEJldHdlZW5UYWdEYXRhID8/IG5ldyBTdHJpbmdUcmFja2VyKCksIHRoaXMsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGZpbGVEYXRhID0gY29tcGlsZWRTdHJpbmc7XG4gICAgICAgICAgICBTZWFyY2hJbkNvbW1lbnQgPSBjaGVja0NvbXBvbmVudHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZm9sZGVyOiBib29sZWFuIHwgc3RyaW5nID0gZGF0YS5oYXZlKCdmb2xkZXInKTtcblxuICAgICAgICAgICAgaWYgKGZvbGRlcilcbiAgICAgICAgICAgICAgICBmb2xkZXIgPSBkYXRhLnJlbW92ZSgnZm9sZGVyJykgfHwgJy4nO1xuXG4gICAgICAgICAgICBjb25zdCB0YWdQYXRoID0gKGZvbGRlciA/IGZvbGRlciArICcvJyA6ICcnKSArIHR5cGUucmVwbGFjZSgvOi9naSwgXCIvXCIpLmVxO1xuXG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZXNGaWxlUGF0aFNtYWxsID0gdHlwZS5leHRyYWN0SW5mbygnPGxpbmU+JyksIHJlbGF0aXZlc0ZpbGVQYXRoID0gcGF0aE5vZGUuam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCk7XG4gICAgICAgICAgICBBbGxQYXRoVHlwZXMgPSBDcmVhdGVGaWxlUGF0aChyZWxhdGl2ZXNGaWxlUGF0aCwgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCwgdGFnUGF0aCwgdGhpcy5kaXJGb2xkZXIsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gbnVsbCB8fCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9PT0gdW5kZWZpbmVkICYmICFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShBbGxQYXRoVHlwZXMuRnVsbFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBDb21wb25lbnQgJHt0eXBlLmVxfSBub3QgZm91bmQhIC0+ICR7cGF0aE5hbWV9XFxuLT4gJHt0eXBlLmxpbmVJbmZvfVxcbiR7QWxsUGF0aFR5cGVzLlNtYWxsUGF0aH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNvbXBvbmVudC1ub3QtZm91bmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuUmVCdWlsZFRhZyh0eXBlLCBkYXRhVGFnLCBkYXRhLCBCZXR3ZWVuVGFnRGF0YSwgQmV0d2VlblRhZ0RhdGEgPT4gdGhpcy5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdPy5tdGltZU1zKVxuICAgICAgICAgICAgICAgIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0geyBtdGltZU1zOiBhd2FpdCBFYXN5RnMuc3RhdChBbGxQYXRoVHlwZXMuRnVsbFBhdGgsICdtdGltZU1zJykgfTsgLy8gYWRkIHRvIGRlcGVuZGVuY2VPYmplY3RcblxuICAgICAgICAgICAgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzW0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0gc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0ubXRpbWVNc1xuXG4gICAgICAgICAgICBjb25zdCB7IGFsbERhdGEsIHN0cmluZ0luZm8gfSA9IGF3YWl0IEFkZERlYnVnSW5mbyhwYXRoTmFtZSwgQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSk7XG4gICAgICAgICAgICBjb25zdCBiYXNlRGF0YSA9IG5ldyBQYXJzZUJhc2VQYWdlKGFsbERhdGEsIHRoaXMuaXNUcygpKTtcbiAgICAgICAgICAgIGF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbywgQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCBwYXRoTmFtZSArICcgLT4gJyArIEFsbFBhdGhUeXBlcy5TbWFsbFBhdGgsIG1hcEF0dHJpYnV0ZXMpO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGJhc2VEYXRhLnNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyA9IHNlc3Npb25JbmZvLmRlYnVnICYmIHN0cmluZ0luZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU2VhcmNoSW5Db21tZW50ICYmIChmaWxlRGF0YS5sZW5ndGggPiAwIHx8IEJldHdlZW5UYWdEYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBBbGxQYXRoVHlwZXM7XG5cbiAgICAgICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5idWlsZFRhZ0Jhc2ljKGZpbGVEYXRhLCBkYXRhLCBCdWlsZEluID8gdHlwZS5lcSA6IEZ1bGxQYXRoLCBCdWlsZEluID8gdHlwZS5lcSA6IFNtYWxsUGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvLCBCZXR3ZWVuVGFnRGF0YSk7XG4gICAgICAgICAgICBhZGRTdHJpbmdJbmZvICYmIGZpbGVEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGFkZFN0cmluZ0luZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQ2hlY2tEb3VibGVTcGFjZSguLi5kYXRhOiBTdHJpbmdUcmFja2VyW10pIHtcbiAgICAgICAgY29uc3QgbWluaSA9IHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpO1xuICAgICAgICBsZXQgc3RhcnREYXRhID0gZGF0YS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKG1pbmkgJiYgc3RhcnREYXRhLmVuZHNXaXRoKCcgJykgJiYgaS5zdGFydHNXaXRoKCcgJykpIHtcbiAgICAgICAgICAgICAgICBpID0gaS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAxID09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydERhdGEuUGx1cyhpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBzdGFydERhdGEgPSBzdGFydERhdGEuU3BhY2VPbmUoJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydERhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgU3RhcnRSZXBsYWNlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgbGV0IGZpbmQ6IG51bWJlcjtcblxuICAgICAgICBjb25zdCBwcm9taXNlQnVpbGQ6IChTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPilbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgoZmluZCA9IGRhdGEuc2VhcmNoKHRoaXMucmVnZXhTZWFyY2gpKSAhPSAtMSkge1xuXG4gICAgICAgICAgICAvL2hlY2sgaWYgdGhlcmUgaXMgc3BlY2lhbCB0YWcgLSBuZWVkIHRvIHNraXAgaXRcbiAgICAgICAgICAgIGNvbnN0IGxvY1NraXAgPSBkYXRhLmVxO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbFNraXAgPSB0aGlzLkZpbmRTcGVjaWFsVGFnQnlTdGFydChsb2NTa2lwLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChzcGVjaWFsU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbG9jU2tpcC5pbmRleE9mKHNwZWNpYWxTa2lwWzBdKSArIHNwZWNpYWxTa2lwWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBsb2NTa2lwLnN1YnN0cmluZyhzdGFydCkuaW5kZXhPZihzcGVjaWFsU2tpcFsxXSkgKyBzdGFydCArIHNwZWNpYWxTa2lwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChkYXRhLnN1YnN0cmluZygwLCBlbmQpKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9maW5kaW5nIHRoZSB0YWdcbiAgICAgICAgICAgIGNvbnN0IGN1dFN0YXJ0RGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmQpOyAvLzxcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRGcm9tID0gZGF0YS5zdWJzdHJpbmcoZmluZCk7XG5cbiAgICAgICAgICAgIC8vdGFnIHR5cGUgXG4gICAgICAgICAgICBjb25zdCB0YWdUeXBlRW5kID0gc3RhcnRGcm9tLnNlYXJjaCgnXFwgfC98XFw+fCg8JSknKTtcblxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZSA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSwgdGFnVHlwZUVuZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRFbmRPZlNtYWxsVGFnID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFyKHN0YXJ0RnJvbS5zdWJzdHJpbmcoMSksICc+JykgKyAxO1xuXG4gICAgICAgICAgICBsZXQgaW5UYWcgPSBzdGFydEZyb20uc3Vic3RyaW5nKHRhZ1R5cGVFbmQgKyAxLCBmaW5kRW5kT2ZTbWFsbFRhZyk7XG5cbiAgICAgICAgICAgIGNvbnN0IE5leHRUZXh0VGFnID0gc3RhcnRGcm9tLnN1YnN0cmluZyhmaW5kRW5kT2ZTbWFsbFRhZyArIDEpO1xuXG4gICAgICAgICAgICBpZiAoaW5UYWcuYXQoaW5UYWcubGVuZ3RoIC0gMSkuZXEgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgaW5UYWcgPSBpblRhZy5zdWJzdHJpbmcoMCwgaW5UYWcubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGFydEZyb20uYXQoZmluZEVuZE9mU21hbGxUYWcgLSAxKS5lcSA9PSAnLycpIHsvL3NtYWxsIHRhZ1xuICAgICAgICAgICAgICAgIHByb21pc2VCdWlsZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydFRhZ0RhdGEocGF0aE5hbWUsIHRhZ1R5cGUsIGluVGFnLCB7ICBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gTmV4dFRleHRUYWc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYmlnIHRhZyB3aXRoIHJlYWRlclxuICAgICAgICAgICAgbGV0IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU2ltcGxlU2tpcC5pbmNsdWRlcyh0YWdUeXBlLmVxKSkge1xuICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IE5leHRUZXh0VGFnLmluZGV4T2YoJzwvJyArIHRhZ1R5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBhd2FpdCB0aGlzLkZpbmRDbG9zZUNoYXJIVE1MKE5leHRUZXh0VGFnLCB0YWdUeXBlLmVxKTtcbiAgICAgICAgICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYFxcbldhcm5pbmcsIHlvdSBkaWRuJ3Qgd3JpdGUgcmlnaHQgdGhpcyB0YWc6IFwiJHt0YWdUeXBlfVwiLCB1c2VkIGluOiAke3RhZ1R5cGUuYXQoMCkubGluZUluZm99XFxuKHRoZSBzeXN0ZW0gd2lsbCBhdXRvIGNsb3NlIGl0KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6IFwiY2xvc2UtdGFnXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsICYmIE5leHRUZXh0VGFnLnN1YnN0cmluZygwLCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXgpO1xuXG4gICAgICAgICAgICAvL2ZpbmRpbmcgbGFzdCBjbG9zZSBcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQ2xvc2UgPSBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IE5leHREYXRhQWZ0ZXJDbG9zZSA9IEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCAhPSBudWxsID8gTmV4dERhdGFDbG9zZS5zdWJzdHJpbmcoQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoTmV4dERhdGFDbG9zZS5lcSwgJz4nKSArIDEpIDogTmV4dERhdGFDbG9zZTsgLy8gc2VhcmNoIGZvciB0aGUgY2xvc2Ugb2YgYSBiaWcgdGFnIGp1c3QgaWYgdGhlIHRhZyBpcyB2YWxpZFxuXG4gICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLkNoZWNrTWluSFRNTChjdXRTdGFydERhdGEpLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VGFnRGF0YShwYXRoTmFtZSwgdGFnVHlwZSwgaW5UYWcsIHsgQmV0d2VlblRhZ0RhdGEsIHNlc3Npb25JbmZvIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkYXRhID0gTmV4dERhdGFBZnRlckNsb3NlO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgdGV4dEJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwcm9taXNlQnVpbGQpIHtcbiAgICAgICAgICAgIHRleHRCdWlsZCA9IHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGF3YWl0IGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tNaW5IVE1MKHRoaXMuQ2hlY2tEb3VibGVTcGFjZSh0ZXh0QnVpbGQsIGRhdGEpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgUmVtb3ZlVW5uZWNlc3NhcnlTcGFjZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnRyaW0oKTtcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbCgvJT5bIF0rPCUoPyFbPTpdKS8sICclPjwlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIEluc2VydChkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9yZW1vdmluZyBodG1sIGNvbW1lbnQgdGFnc1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88IS0tW1xcd1xcV10rPy0tPi8sICcnKTtcblxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZGF0YSwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgcmVhZGVyLCByZXBsYWNpbmcgaGltIHdpdGggJ2NvZGViYXNlJ1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKyggKSpcXC8+L2dpLCAnPCV0eXBlb2YgcGFnZS5jb2RlYmFzZSA9PSBcImZ1bmN0aW9uXCIgPyBwYWdlLmNvZGViYXNlKCk6IHdyaXRlKHBhZ2UuY29kZWJhc2UpJT4nKSAvLyByZXBsYWNlIGZvciBpbXBvcnRpbmcgcGFnZXMgLyBjb21wb25lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLlJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoZGF0YSk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmZ1bmN0aW9uIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dE1haW4oZGF0YTogU3RyaW5nVHJhY2tlciwgYXJyYXk6c3RyaW5nW10sIHNpbmc6c3RyaW5nLCBiaWdUYWc/OmJvb2xlYW4sIHNlYXJjaEZvcj86Ym9vbGVhbik6IFNlYXJjaEN1dE91dHB1dCB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBlIG9mIGFycmF5KSB7XG4gICAgICAgIG91dCArPSB1bmljb2RlTWUoc2luZykgKyBlICsgXCJ8XCI7XG4gICAgfVxuICAgIG91dCA9IG91dC5zdWJzdHJpbmcoMCwgb3V0Lmxlbmd0aCAtIDEpO1xuICAgIG91dCA9IGA8KCR7b3V0fSkke3NlYXJjaEZvciA/IFwiKFtcXFxccHtMfTAtOV9cXFxcLVxcXFwuXSspXCI6IFwiXCJ9KFxcXFx1MDAyMCkqXFxcXHUwMDJGPz5gXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBuZXcgUmVnRXhwKG91dCwgJ3UnKSwgc2luZywgYmlnVGFnKVxufVxuXG5mdW5jdGlvbiBvdXRUYWdOYW1lKGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IGVuZCA9IGRhdGEuaW5kZXhPZihcIj5cIik7XG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgd2hpbGUgKGRhdGEuZW5kc1dpdGgoXCIgXCIpIHx8IGRhdGEuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuaW50ZXJmYWNlIFNlYXJjaEN1dERhdGEge1xuICAgIHRhZzogc3RyaW5nLFxuICAgIGRhdGE6IFN0cmluZ1RyYWNrZXIsXG4gICAgbG9jOiBudW1iZXIsXG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGRhdGE/OiBTdHJpbmdUcmFja2VyLFxuICAgIGVycm9yPzogYm9vbGVhbixcbiAgICBmb3VuZD86IFNlYXJjaEN1dERhdGFbXVxufVxuXG4vKipcbiAqIEl0IHNlYXJjaGVzIGZvciBhIHNwZWNpZmljIHRhZyBhbmQgcmV0dXJucyB0aGUgZGF0YSBpbnNpZGUgb2YgaXQuXG4gKiBAcGFyYW0ge1N0cmluZ1RyYWNrZXJ9IGRhdGEgLSBUaGUgc3RyaW5nIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHtSZWdFeHB9IGZpbmRBcnJheSAtIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nIC0gVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gW2JpZ1RhZz10cnVlXSAtIElmIHRydWUsIHRoZSBmdW5jdGlvbiB3aWxsIHNlYXJjaCBmb3IgdGhlIGVuZCBvZiB0aGUgdGFnLiBJZiBmYWxzZSwgaXQgd2lsbFxuICogc2VhcmNoIGZvciB0aGUgbmV4dCBpbnN0YW5jZSBvZiB0aGUgdGFnLlxuICogQHBhcmFtIG91dHB1dCAtIFRoZSBvdXRwdXQgb2YgdGhlIHNlYXJjaC5cbiAqIEBwYXJhbSB7U2VhcmNoQ3V0RGF0YVtdfSByZXR1cm5BcnJheSAtIEFuIGFycmF5IG9mIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSB0YWcgbmFtZSwgdGhlIGRhdGFcbiAqIGluc2lkZSB0aGUgdGFnLCBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YWcgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLCBhbmQgYW4gYXJyYXkgb2YgdGhlIGRhdGEgdGhhdCB3YXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEZvckN1dChkYXRhOlN0cmluZ1RyYWNrZXIsIGZpbmRBcnJheTpSZWdFeHAsIHNpbmc6c3RyaW5nLCBiaWdUYWcgPSB0cnVlLCBvdXRwdXQgPSBuZXcgU3RyaW5nVHJhY2tlcigpLCByZXR1cm5BcnJheTogU2VhcmNoQ3V0RGF0YVtdID0gW10pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGNvbnN0IGRhdGFDb3B5ID0gZGF0YTtcbiAgICBjb25zdCBiZSA9IGRhdGEuc2VhcmNoKGZpbmRBcnJheSk7XG4gICAgaWYgKGJlID09IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBvdXRwdXQuUGx1cyhkYXRhKSwgZm91bmQ6IHJldHVybkFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb3V0cHV0LlBsdXMoZGF0YS5zdWJzdHJpbmcoMCwgYmUpKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhiZSArIDEpO1xuXG4gICAgY29uc3QgdGFnID0gb3V0VGFnTmFtZShkYXRhLmVxKTtcblxuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcblxuICAgIGxldCBpblRhZ0RhdGE7XG5cbiAgICBpZiAoYmlnVGFnKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZpbmRFbmQoW1wiPFwiICsgdGFnLCBcIjwvXCIgKyB0YWddLCBkYXRhKTtcbiAgICAgICAgaWYgKGVuZCAhPSAtMSkge1xuICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmRTdGFydChcIj5cIiwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluZE5leHQgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgICAgICAgICAgaWYgKGZpbmROZXh0ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW5UYWdEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGZpbmROZXh0KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuQXJyYXkucHVzaCh7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICBkYXRhOiBpblRhZ0RhdGEsXG4gICAgICAgIGxvYzogYmVcbiAgICB9KTtcblxuICAgIGlmIChkYXRhQ29weSA9PSBkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaEZvckN1dChkYXRhLCBmaW5kQXJyYXksIHNpbmcsIGJpZ1RhZywgb3V0cHV0LCByZXR1cm5BcnJheSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydCh0eXBlOnN0cmluZywgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG4gICAgcmV0dXJuIGRhdGEuaW5kZXhPZih0eXBlKSArIHR5cGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kKHR5cGVzOiBzdHJpbmdbXSwgZGF0YTpTdHJpbmdUcmFja2VyKSB7XG5cbiAgICBsZXQgXzAgPSBkYXRhLmluZGV4T2YodHlwZXNbMF0pO1xuXG4gICAgY29uc3QgXzEgPSBkYXRhLmluZGV4T2YodHlwZXNbMV0pO1xuXG4gICAgaWYgKF8xID09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXzAgPCBfMSAmJiBfMCAhPSAtMSkge1xuICAgICAgICBfMCsrO1xuICAgICAgICBjb25zdCBuZXh0ID0gXzAgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhfMCkpICsgdHlwZXNbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV4dCArIGZpbmRFbmQodHlwZXMsIGRhdGEuc3Vic3RyaW5nKG5leHQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfMTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBzZWFyY2hGb3JDdXRNYWluIGFzIGdldERhdGFUYWdlc1xufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgQmFzZVJlYWRlciB9IGZyb20gJy4uL0Jhc2VSZWFkZXIvUmVhZGVyJztcbmltcG9ydCB7IGdldERhdGFUYWdlcyB9IGZyb20gXCIuLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZVwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwLCBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tICcuLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBBZGREZWJ1Z0luZm8gfSBmcm9tICcuLi9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgQ1J1blRpbWUgZnJvbSBcIi4vQ29tcGlsZVwiO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSBcIi4uL1Nlc3Npb25cIjtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0ge2RlZmluZToge319O1xuXG5jb25zdCBzdHJpbmdBdHRyaWJ1dGVzID0gWydcXCcnLCAnXCInLCAnYCddO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VCYXNlUGFnZSB7XG4gICAgcHVibGljIGNsZWFyRGF0YTogU3RyaW5nVHJhY2tlclxuICAgIHB1YmxpYyBzY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIHB1YmxpYyB2YWx1ZUFycmF5OiB7IGtleTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlciB9W10gPSBbXVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2RlPzogU3RyaW5nVHJhY2tlciwgcHVibGljIGlzVHM/OiBib29sZWFuKSB7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHBhZ2VQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGNvbnN0IHJ1biA9IG5ldyBDUnVuVGltZSh0aGlzLmNvZGUsIHNlc3Npb25JbmZvLCBzbWFsbFBhdGgsIHRoaXMuaXNUcyk7XG4gICAgICAgIHRoaXMuY29kZSA9IGF3YWl0IHJ1bi5jb21waWxlKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHRoaXMucGFyc2VCYXNlKHRoaXMuY29kZSk7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZENvZGVGaWxlKHBhZ2VQYXRoLCBzbWFsbFBhdGgsIHRoaXMuaXNUcywgc2Vzc2lvbkluZm8sIHBhZ2VOYW1lKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9hZERlZmluZSh7Li4uc2V0dGluZ3MuZGVmaW5lLCAuLi5ydW4uZGVmaW5lfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZUJhc2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgZGF0YVNwbGl0OiBTdHJpbmdUcmFja2VyO1xuXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VyKC9AXFxbWyBdKigoW0EtWmEtel9dW0EtWmEtel8wLTldKj0oKFwiW15cIl0qXCIpfChgW15gXSpgKXwoJ1teJ10qJyl8W0EtWmEtejAtOV9dKykoWyBdKiw/WyBdKik/KSopXFxdLywgZGF0YSA9PiB7XG4gICAgICAgICAgICBkYXRhU3BsaXQgPSBkYXRhWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3aGlsZSAoZGF0YVNwbGl0Py5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmRXb3JkID0gZGF0YVNwbGl0LmluZGV4T2YoJz0nKTtcblxuICAgICAgICAgICAgbGV0IHRoaXNXb3JkID0gZGF0YVNwbGl0LnN1YnN0cmluZygwLCBmaW5kV29yZCkudHJpbSgpLmVxO1xuXG4gICAgICAgICAgICBpZiAodGhpc1dvcmRbMF0gPT0gJywnKVxuICAgICAgICAgICAgICAgIHRoaXNXb3JkID0gdGhpc1dvcmQuc3Vic3RyaW5nKDEpLnRyaW0oKTtcblxuICAgICAgICAgICAgbGV0IG5leHRWYWx1ZSA9IGRhdGFTcGxpdC5zdWJzdHJpbmcoZmluZFdvcmQgKyAxKTtcblxuICAgICAgICAgICAgbGV0IHRoaXNWYWx1ZTogU3RyaW5nVHJhY2tlcjtcblxuICAgICAgICAgICAgY29uc3QgY2xvc2VDaGFyID0gbmV4dFZhbHVlLmF0KDApLmVxO1xuICAgICAgICAgICAgaWYgKHN0cmluZ0F0dHJpYnV0ZXMuaW5jbHVkZXMoY2xvc2VDaGFyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKG5leHRWYWx1ZS5lcS5zdWJzdHJpbmcoMSksIGNsb3NlQ2hhcik7XG4gICAgICAgICAgICAgICAgdGhpc1ZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZygxLCBlbmRJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSkudHJpbSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IG5leHRWYWx1ZS5zZWFyY2goL1tfICxdLyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZW5kSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1ZhbHVlID0gbmV4dFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1ZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZygwLCBlbmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoZW5kSW5kZXgpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGFTcGxpdCA9IG5leHRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVBcnJheS5wdXNoKHsga2V5OiB0aGlzV29yZCwgdmFsdWU6IHRoaXNWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gY29kZS50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGQoKSB7XG4gICAgICAgIGlmKCF0aGlzLnZhbHVlQXJyYXkubGVuZ3RoKSByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnQFsnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHsga2V5LCB2YWx1ZSB9IG9mIHRoaXMudmFsdWVBcnJheSkge1xuICAgICAgICAgICAgYnVpbGQuUGx1cyRgJHtrZXl9PVwiJHt2YWx1ZS5yZXBsYWNlQWxsKCdcIicsICdcXFxcXCInKX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgYnVpbGQuUGx1cyhcIl1cIikuUGx1cyh0aGlzLmNsZWFyRGF0YSk7XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYnVpbGQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoY29kZTogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBwYXJzZSA9IG5ldyBQYXJzZUJhc2VQYWdlKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgcGFyc2UucGFyc2VCYXNlKGNvZGUpO1xuXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwYXJzZS5ieVZhbHVlKCdpbmhlcml0JykpIHtcbiAgICAgICAgICAgIHBhcnNlLnBvcChuYW1lKVxuICAgICAgICAgICAgYnVpbGQuUGx1cyhgPEAke25hbWV9Pjw6JHtuYW1lfS8+PC9AJHtuYW1lfT5gKVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2UucmVidWlsZCgpO1xuXG4gICAgICAgIHJldHVybiBwYXJzZS5jbGVhckRhdGEuUGx1cyhidWlsZCk7XG4gICAgfVxuXG4gICAgZ2V0KG5hbWU6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKT8udmFsdWVcbiAgICB9XG5cbiAgICBwb3AobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleSA9PT0gbmFtZSksIDEpWzBdPy52YWx1ZTtcbiAgICB9XG5cbiAgICBwb3BBbnkobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhhdmVOYW1lID0gdGhpcy52YWx1ZUFycmF5LmZpbmRJbmRleCh4ID0+IHgua2V5LnRvTG93ZXJDYXNlKCkgPT0gbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhdmVOYW1lICE9IC0xKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVBcnJheS5zcGxpY2UoaGF2ZU5hbWUsIDEpWzBdLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFzVGFnID0gZ2V0RGF0YVRhZ2VzKHRoaXMuY2xlYXJEYXRhLCBbbmFtZV0sICdAJyk7XG5cbiAgICAgICAgaWYgKCFhc1RhZy5mb3VuZFswXSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gYXNUYWcuZGF0YTtcblxuICAgICAgICByZXR1cm4gYXNUYWcuZm91bmRbMF0uZGF0YS50cmltKCk7XG4gICAgfVxuXG4gICAgYnlWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuZmlsdGVyKHggPT4geC52YWx1ZS5lcSA9PT0gdmFsdWUpLm1hcCh4ID0+IHgua2V5KVxuICAgIH1cblxuICAgIHJlcGxhY2VWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLnZhbHVlQXJyYXkuZmluZCh4ID0+IHgua2V5ID09PSBuYW1lKVxuICAgICAgICBpZiAoaGF2ZSkgaGF2ZS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbG9hZENvZGVGaWxlKHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VTbWFsbFBhdGg6IHN0cmluZywgaXNUczogYm9vbGVhbiwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgcGFnZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgaGF2ZUNvZGUgPSB0aGlzLnBvcEFueSgnY29kZWZpbGUnKT8uZXE7XG4gICAgICAgIGlmICghaGF2ZUNvZGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsYW5nID0gdGhpcy5wb3BBbnkoJ2xhbmcnKT8uZXE7XG4gICAgICAgIGlmIChoYXZlQ29kZS50b0xvd2VyQ2FzZSgpID09ICdpbmhlcml0JylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGFnZVBhdGg7XG5cbiAgICAgICAgY29uc3QgaGF2ZUV4dCA9IHBhdGguZXh0bmFtZShoYXZlQ29kZSkuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgIGlmICghWydqcycsICd0cyddLmluY2x1ZGVzKGhhdmVFeHQpKSB7XG4gICAgICAgICAgICBpZiAoLyhcXFxcfFxcLykkLy50ZXN0KGhhdmVDb2RlKSlcbiAgICAgICAgICAgICAgICBoYXZlQ29kZSArPSBwYWdlUGF0aC5zcGxpdCgnLycpLnBvcCgpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIUJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMoaGF2ZUV4dCkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGF0aC5leHRuYW1lKHBhZ2VQYXRoKTtcbiAgICAgICAgICAgIGhhdmVDb2RlICs9ICcuJyArIChsYW5nID8gbGFuZyA6IGlzVHMgPyAndHMnIDogJ2pzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGF2ZUNvZGVbMF0gPT0gJy4nKVxuICAgICAgICAgICAgaGF2ZUNvZGUgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHBhZ2VQYXRoKSwgaGF2ZUNvZGUpXG5cbiAgICAgICAgY29uc3QgU21hbGxQYXRoID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShoYXZlQ29kZSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsaGF2ZUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKHBhZ2VOYW1lLCBoYXZlQ29kZSwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gYmFzZU1vZGVsRGF0YS5hbGxEYXRhLnJlcGxhY2VBbGwoXCJAXCIsIFwiQEBcIik7XG5cbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjaygnPCUnKTtcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCclPicpO1xuICAgICAgICAgICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgdGhpcy5zY3JpcHRGaWxlLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgIGlkOiBTbWFsbFBhdGgsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdjb2RlRmlsZU5vdEZvdW5kJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBgXFxuQ29kZSBmaWxlIG5vdCBmb3VuZDogJHtwYWdlUGF0aH08bGluZT4ke1NtYWxsUGF0aH1gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zY3JpcHRGaWxlID0gbmV3IFN0cmluZ1RyYWNrZXIocGFnZU5hbWUsIGA8JT1cIjxwIHN0eWxlPVxcXFxcImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XFxcXFwiPkNvZGUgRmlsZSBOb3QgRm91bmQ6ICcke3BhZ2VTbWFsbFBhdGh9JyAtPiAnJHtTbWFsbFBhdGh9JzwvcD5cIiU+YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRTZXR0aW5nKG5hbWUgPSAnZGVmaW5lJywgbGltaXRBcmd1bWVudHMgPSAyKSB7XG4gICAgICAgIGNvbnN0IGhhdmUgPSB0aGlzLmNsZWFyRGF0YS5pbmRleE9mKGBAJHtuYW1lfShgKTtcbiAgICAgICAgaWYgKGhhdmUgPT0gLTEpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBhcmd1bWVudEFycmF5OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoMCwgaGF2ZSk7XG4gICAgICAgIGxldCB3b3JrRGF0YSA9IHRoaXMuY2xlYXJEYXRhLnN1YnN0cmluZyhoYXZlICsgOCkudHJpbVN0YXJ0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW1pdEFyZ3VtZW50czsgaSsrKSB7IC8vIGFyZ3VtZW50cyByZWFkZXIgbG9vcFxuICAgICAgICAgICAgY29uc3QgcXVvdGF0aW9uU2lnbiA9IHdvcmtEYXRhLmF0KDApLmVxO1xuXG4gICAgICAgICAgICBjb25zdCBlbmRRdW90ZSA9IEJhc2VSZWFkZXIuZmluZEVudE9mUSh3b3JrRGF0YS5lcS5zdWJzdHJpbmcoMSksIHF1b3RhdGlvblNpZ24pO1xuXG4gICAgICAgICAgICBhcmd1bWVudEFycmF5LnB1c2god29ya0RhdGEuc3Vic3RyaW5nKDEsIGVuZFF1b3RlKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFmdGVyQXJndW1lbnQgPSB3b3JrRGF0YS5zdWJzdHJpbmcoZW5kUXVvdGUgKyAxKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIGlmIChhZnRlckFyZ3VtZW50LmF0KDApLmVxICE9ICcsJykge1xuICAgICAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd29ya0RhdGEgPSBhZnRlckFyZ3VtZW50LnN1YnN0cmluZygxKS50cmltU3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdvcmtEYXRhID0gd29ya0RhdGEuc3Vic3RyaW5nKHdvcmtEYXRhLmluZGV4T2YoJyknKSArIDEpO1xuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJlZm9yZS50cmltRW5kKCkuUGx1cyh3b3JrRGF0YS50cmltU3RhcnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50QXJyYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRGVmaW5lKG1vcmVEZWZpbmU6IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBsZXQgbGFzdFZhbHVlID0gdGhpcy5sb2FkU2V0dGluZygpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlczogKFN0cmluZ1RyYWNrZXJ8c3RyaW5nKVtdW10gPSBPYmplY3QuZW50cmllcyhtb3JlRGVmaW5lKTtcbiAgICAgICAgd2hpbGUgKGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFsdWVzLnVuc2hpZnQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhID0gdGhpcy5jbGVhckRhdGEucmVwbGFjZUFsbChgOiR7bmFtZX06YCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmVcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgY29tcGlsZUltcG9ydCB9IGZyb20gXCIuLi8uLi9JbXBvcnRGaWxlcy9TY3JpcHRcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQ29udmVydFN5bnRheE1pbmkgfSBmcm9tIFwiLi4vLi4vUGx1Z2lucy9TeW50YXgvUmF6b3JTeW50YXhcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzLCBzbWFsbFBhdGhUb1BhZ2UgfSBmcm9tIFwiLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IEN1dFRoZUxhc3QsIFNwbGl0Rmlyc3QgfSBmcm9tIFwiLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmdcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vSlNQYXJzZXJcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1J1blRpbWUge1xuICAgIGRlZmluZSA9IHt9XG4gICAgY29uc3RydWN0b3IocHVibGljIHNjcmlwdDogU3RyaW5nVHJhY2tlciwgcHVibGljIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGlzVHM6IGJvb2xlYW4pIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgdGVtcGxhdGVTY3JpcHQoc2NyaXB0czogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhgY29uc3QgX193cml0ZUFycmF5ID0gW11cbiAgICAgICAgdmFyIF9fd3JpdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGUodGV4dCl7XG4gICAgICAgICAgICBfX3dyaXRlLnRleHQgKz0gdGV4dDtcbiAgICAgICAgfWApXG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHNjcmlwdHMpIHtcbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYF9fd3JpdGUgPSB7dGV4dDogJyd9O1xuICAgICAgICAgICAgX193cml0ZUFycmF5LnB1c2goX193cml0ZSk7YClcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMoaSlcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYHJldHVybiBfX3dyaXRlQXJyYXlgKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWV0aG9kcyhhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGNvbnN0IF9fbG9jYWxwYXRoID0gJy8nICsgc21hbGxQYXRoVG9QYWdlKHRoaXMuc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0cmluZzogJ3NjcmlwdCxzdHlsZSxkZWZpbmUsc3RvcmUscGFnZV9fZmlsZW5hbWUscGFnZV9fZGlybmFtZSxfX2xvY2FscGF0aCxhdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgIGZ1bmNzOiBbXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zY3JpcHQuYmluZCh0aGlzLnNlc3Npb25JbmZvKSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLnN0eWxlLmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB0aGlzLmRlZmluZVtTdHJpbmcoa2V5KV0gPSB2YWx1ZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNvbXBpbGVSdW5UaW1lU3RvcmUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5mdWxsUGF0aCxcbiAgICAgICAgICAgICAgICBwYXRoLmRpcm5hbWUodGhpcy5zZXNzaW9uSW5mby5mdWxsUGF0aCksXG4gICAgICAgICAgICAgICAgX19sb2NhbHBhdGgsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1xuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkQ29kZShwYXJzZXI6IEpTUGFyc2VyLCBidWlsZFN0cmluZ3M6IHsgdGV4dDogc3RyaW5nIH1bXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhpLnRleHQpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVpbGQuQWRkVGV4dEFmdGVyTm9UcmFjayhidWlsZFN0cmluZ3MucG9wKCkudGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBhc3luYyBjb21waWxlKGF0dHJpYnV0ZXM/OiBTdHJpbmdBbnlNYXApOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcbiAgICAgICAgLyogbG9hZCBmcm9tIGNhY2hlICovXG4gICAgICAgIGNvbnN0IGhhdmVDYWNoZSA9IHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXTtcbiAgICAgICAgaWYgKGhhdmVDYWNoZSlcbiAgICAgICAgICAgIHJldHVybiAoYXdhaXQgaGF2ZUNhY2hlKSgpO1xuICAgICAgICBsZXQgZG9Gb3JBbGw6IChyZXNvbHZlOiAoKSA9PiBTdHJpbmdUcmFja2VyIHwgUHJvbWlzZTxTdHJpbmdUcmFja2VyPikgPT4gdm9pZDtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gbmV3IFByb21pc2UociA9PiBkb0ZvckFsbCA9IHIpO1xuXG4gICAgICAgIC8qIHJ1biB0aGUgc2NyaXB0ICovXG4gICAgICAgIHRoaXMuc2NyaXB0ID0gYXdhaXQgQ29udmVydFN5bnRheE1pbmkodGhpcy5zY3JpcHQsIFwiQGNvbXBpbGVcIiwgXCIqXCIpO1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIodGhpcy5zY3JpcHQsIHRoaXMuc21hbGxQYXRoLCAnPCUqJywgJyU+Jyk7XG4gICAgICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGlmIChwYXJzZXIudmFsdWVzLmxlbmd0aCA9PSAxICYmIHBhcnNlci52YWx1ZXNbMF0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlID0gKCkgPT4gdGhpcy5zY3JpcHQ7XG4gICAgICAgICAgICBkb0ZvckFsbChyZXNvbHZlKTtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY3JpcHQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdHlwZSwgZmlsZVBhdGhdID0gU3BsaXRGaXJzdCgnLycsIHRoaXMuc21hbGxQYXRoKSwgdHlwZUFycmF5ID0gZ2V0VHlwZXNbdHlwZV0gPz8gZ2V0VHlwZXMuU3RhdGljLFxuICAgICAgICAgICAgY29tcGlsZVBhdGggPSB0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY29tcC5qcyc7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoZmlsZVBhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlU2NyaXB0KHBhcnNlci52YWx1ZXMuZmlsdGVyKHggPT4geC50eXBlICE9ICd0ZXh0JykubWFwKHggPT4geC50ZXh0KSk7XG4gICAgICAgIGNvbnN0IHsgZnVuY3MsIHN0cmluZyB9ID0gdGhpcy5tZXRob2RzKGF0dHJpYnV0ZXMpXG5cbiAgICAgICAgY29uc3QgdG9JbXBvcnQgPSBhd2FpdCBjb21waWxlSW1wb3J0KHN0cmluZywgY29tcGlsZVBhdGgsIGZpbGVQYXRoLCB0eXBlQXJyYXksIHRoaXMuaXNUcywgdGhpcy5zZXNzaW9uSW5mby5kZWJ1ZywgdGVtcGxhdGUpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGUgPSBhc3luYyAoKSA9PiB0aGlzLnJlYnVpbGRDb2RlKHBhcnNlciwgYXdhaXQgdG9JbXBvcnQoLi4uZnVuY3MpKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jYWNoZUNvbXBpbGVTY3JpcHRbdGhpcy5zbWFsbFBhdGhdID0gZXhlY3V0ZTsgLy8gc2F2ZSB0aGlzIHRvIGNhY2hlXG4gICAgICAgIGNvbnN0IHRoaXNGaXJzdCA9IGF3YWl0IGV4ZWN1dGUoKTtcbiAgICAgICAgZG9Gb3JBbGwoZXhlY3V0ZSlcblxuICAgICAgICByZXR1cm4gdGhpc0ZpcnN0O1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSBcImVzYnVpbGQtd2FzbVwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgRWFzeVN5bnRheCBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXhcIjtcbmltcG9ydCBKU1BhcnNlciBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBpc1RzIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVsc1wiO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuL3JlZGlyZWN0Q0pTJztcbmltcG9ydCB7IFN0cmluZ0FueU1hcCB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHBhZ2VEZXBzIH0gZnJvbSBcIi4uL091dHB1dElucHV0L1N0b3JlRGVwc1wiO1xuaW1wb3J0IEN1c3RvbUltcG9ydCwgeyBpc1BhdGhDdXN0b20gfSBmcm9tIFwiLi9DdXN0b21JbXBvcnQvaW5kZXhcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yLCBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzLCBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gXCIuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgYmFja1RvT3JpZ2luYWwgfSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWRcIjtcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L0FsaWFzXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIFJlcGxhY2VCZWZvcmUoXG4gIGNvZGU6IHN0cmluZyxcbiAgZGVmaW5lRGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSxcbikge1xuICBjb2RlID0gYXdhaXQgRWFzeVN5bnRheC5CdWlsZEFuZEV4cG9ydEltcG9ydHMoY29kZSwgZGVmaW5lRGF0YSk7XG4gIHJldHVybiBjb2RlO1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZShjb2RlOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGRpcjogc3RyaW5nLCBmaWxlOiBzdHJpbmcsIHBhcmFtcz86IHN0cmluZykge1xuICByZXR1cm4gYCR7aXNEZWJ1ZyA/IFwicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1wiIDogJyd9dmFyIF9fZGlybmFtZT1cIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhkaXIpXG4gICAgfVwiLF9fZmlsZW5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZmlsZSlcbiAgICB9XCI7bW9kdWxlLmV4cG9ydHMgPSAoYXN5bmMgKHJlcXVpcmUke3BhcmFtcyA/ICcsJyArIHBhcmFtcyA6ICcnfSk9Pnt2YXIgbW9kdWxlPXtleHBvcnRzOnt9fSxleHBvcnRzPW1vZHVsZS5leHBvcnRzOyR7Y29kZX1cXG5yZXR1cm4gbW9kdWxlLmV4cG9ydHM7fSk7YDtcbn1cblxuXG4vKipcbiAqIEl0IHRha2VzIGEgZmlsZSBwYXRoLCBhbmQgcmV0dXJucyB0aGUgY29tcGlsZWQgY29kZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbH0gc2F2ZVBhdGggLSBUaGUgcGF0aCB0byBzYXZlIHRoZSBjb21waWxlZCBmaWxlIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBpc1R5cGVzY3JpcHQgLSBib29sZWFuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuLFxuICogQHBhcmFtICAtIGZpbGVQYXRoOiBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjb21waWxlLlxuICogQHJldHVybnMgVGhlIHJlc3VsdCBvZiB0aGUgc2NyaXB0LlxuICovXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChmaWxlUGF0aDogc3RyaW5nLCBzYXZlUGF0aDogc3RyaW5nIHwgbnVsbCwgaXNUeXBlc2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCB7IHBhcmFtcywgdGVtcGxhdGVQYXRoID0gZmlsZVBhdGgsIGNvZGVNaW5pZnkgPSAhaXNEZWJ1ZywgbWVyZ2VUcmFjayB9OiB7IGNvZGVNaW5pZnk/OiBib29sZWFuLCB0ZW1wbGF0ZVBhdGg/OiBzdHJpbmcsIHBhcmFtcz86IHN0cmluZywgbWVyZ2VUcmFjaz86IFN0cmluZ1RyYWNrZXIgfSA9IHt9KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICBmb3JtYXQ6ICdjanMnLFxuICAgIGxvYWRlcjogaXNUeXBlc2NyaXB0ID8gJ3RzJyA6ICdqcycsXG4gICAgbWluaWZ5OiBjb2RlTWluaWZ5LFxuICAgIHNvdXJjZW1hcDogaXNEZWJ1ZyA/IChtZXJnZVRyYWNrID8gJ2V4dGVybmFsJyA6ICdpbmxpbmUnKSA6IGZhbHNlLFxuICAgIHNvdXJjZWZpbGU6IHNhdmVQYXRoICYmIHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKHNhdmVQYXRoKSwgZmlsZVBhdGgpLFxuICAgIGRlZmluZToge1xuICAgICAgZGVidWc6IFwiXCIgKyBpc0RlYnVnXG4gICAgfVxuICB9O1xuXG4gIGxldCBSZXN1bHQgPSBhd2FpdCBSZXBsYWNlQmVmb3JlKG1lcmdlVHJhY2s/LmVxIHx8IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCksIHt9KTtcbiAgUmVzdWx0ID0gdGVtcGxhdGUoXG4gICAgUmVzdWx0LFxuICAgIGlzRGVidWcsXG4gICAgcGF0aC5kaXJuYW1lKHRlbXBsYXRlUGF0aCksXG4gICAgdGVtcGxhdGVQYXRoLFxuICAgIHBhcmFtc1xuICApO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb2RlLCB3YXJuaW5ncywgbWFwIH0gPSBhd2FpdCB0cmFuc2Zvcm0oUmVzdWx0LCBPcHRpb25zKTtcbiAgICBpZiAobWVyZ2VUcmFjaykge1xuICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKG1lcmdlVHJhY2ssIHdhcm5pbmdzKTtcbiAgICAgIFJlc3VsdCA9IChhd2FpdCBiYWNrVG9PcmlnaW5hbChtZXJnZVRyYWNrLCBjb2RlLCBtYXApKS5TdHJpbmdXaXRoVGFjayhzYXZlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzLCBmaWxlUGF0aCk7XG4gICAgICBSZXN1bHQgPSBjb2RlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKG1lcmdlVHJhY2spIHtcbiAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihtZXJnZVRyYWNrLCBlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBFU0J1aWxkUHJpbnRFcnJvcihlcnIsIGZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc2F2ZVBhdGgpIHtcbiAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKHBhdGguZGlybmFtZShzYXZlUGF0aCkpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoc2F2ZVBhdGgsIFJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIFJlc3VsdDtcbn1cblxuZnVuY3Rpb24gQ2hlY2tUcyhGaWxlUGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBGaWxlUGF0aC5lbmRzV2l0aChcIi50c1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChJblN0YXRpY1BhdGgsIHR5cGVBcnJheVsxXSk7XG5cbiAgcmV0dXJuIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIHR5cGVBcnJheVswXSArIEluU3RhdGljUGF0aCxcbiAgICB0eXBlQXJyYXlbMV0gKyBJblN0YXRpY1BhdGggKyBcIi5janNcIixcbiAgICBDaGVja1RzKEluU3RhdGljUGF0aCksXG4gICAgaXNEZWJ1ZyxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFkZEV4dGVuc2lvbihGaWxlUGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbGVFeHQgPSBwYXRoLmV4dG5hbWUoRmlsZVBhdGgpO1xuXG4gIGlmIChCYXNpY1NldHRpbmdzLnBhcnRFeHRlbnNpb25zLmluY2x1ZGVzKGZpbGVFeHQuc3Vic3RyaW5nKDEpKSlcbiAgICBGaWxlUGF0aCArPSBcIi5cIiArIChpc1RzKCkgPyBcInRzXCIgOiBcImpzXCIpXG4gIGVsc2UgaWYgKGZpbGVFeHQgPT0gJycpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyBCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc1tpc1RzKCkgPyBcInRzXCIgOiBcImpzXCJdO1xuXG4gIHJldHVybiBGaWxlUGF0aDtcbn1cblxuY29uc3QgU2F2ZWRNb2R1bGVzID0ge307XG5cbi8qKlxuICogTG9hZEltcG9ydCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIHRvIGEgZmlsZSwgYW5kIHJldHVybnMgdGhlIG1vZHVsZSB0aGF0IGlzIGF0IHRoYXQgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IGltcG9ydEZyb20gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGNyZWF0ZWQgdGhpcyBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gSW5TdGF0aWNQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gW3VzZURlcHNdIC0gVGhpcyBpcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB3aXRob3V0Q2FjaGUgLSBhbiBhcnJheSBvZiBwYXRocyB0aGF0IHdpbGwgbm90IGJlIGNhY2hlZC5cbiAqIEByZXR1cm5zIFRoZSBtb2R1bGUgdGhhdCB3YXMgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIExvYWRJbXBvcnQoaW1wb3J0RnJvbTogc3RyaW5nLCBJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlLCB1c2VEZXBzPzogU3RyaW5nQW55TWFwLCB3aXRob3V0Q2FjaGU6IHN0cmluZ1tdID0gW10pIHtcbiAgbGV0IFRpbWVDaGVjazogYW55O1xuICBjb25zdCBvcmlnaW5hbFBhdGggPSBwYXRoLm5vcm1hbGl6ZShJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSk7XG5cbiAgSW5TdGF0aWNQYXRoID0gQWRkRXh0ZW5zaW9uKEluU3RhdGljUGF0aCk7XG4gIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShJblN0YXRpY1BhdGgpLnN1YnN0cmluZygxKSwgdGhpc0N1c3RvbSA9IGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGgsIGV4dGVuc2lvbikgfHwgIVsnanMnLCAndHMnXS5pbmNsdWRlcyhleHRlbnNpb24pO1xuICBjb25zdCBTYXZlZE1vZHVsZXNQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoKSwgZmlsZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBJblN0YXRpY1BhdGgpO1xuXG4gIC8vd2FpdCBpZiB0aGlzIG1vZHVsZSBpcyBvbiBwcm9jZXNzLCBpZiBub3QgZGVjbGFyZSB0aGlzIGFzIG9uIHByb2Nlc3MgbW9kdWxlXG4gIGxldCBwcm9jZXNzRW5kOiAodj86IGFueSkgPT4gdm9pZDtcbiAgaWYgKCFTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0pXG4gICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbmV3IFByb21pc2UociA9PiBwcm9jZXNzRW5kID0gcik7XG4gIGVsc2UgaWYgKFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgYXdhaXQgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gIC8vYnVpbGQgcGF0aHNcbiAgY29uc3QgcmVCdWlsZCA9ICFwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSB8fCBwYWdlRGVwcy5zdG9yZVtTYXZlZE1vZHVsZXNQYXRoXSAhPSAoVGltZUNoZWNrID0gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKSk7XG5cblxuICBpZiAocmVCdWlsZCkge1xuICAgIFRpbWVDaGVjayA9IFRpbWVDaGVjayA/PyBhd2FpdCBFYXN5RnMuc3RhdChmaWxlUGF0aCwgXCJtdGltZU1zXCIsIHRydWUsIG51bGwpO1xuICAgIGlmIChUaW1lQ2hlY2sgPT0gbnVsbCkge1xuICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke0luU3RhdGljUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke2ltcG9ydEZyb219J2BcbiAgICAgIH0pXG4gICAgICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBudWxsXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzQ3VzdG9tKSAvLyBvbmx5IGlmIG5vdCBjdXN0b20gYnVpbGRcbiAgICAgIGF3YWl0IEJ1aWxkU2NyaXB0U21hbGxQYXRoKEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnKTtcbiAgICBwYWdlRGVwcy51cGRhdGUoU2F2ZWRNb2R1bGVzUGF0aCwgVGltZUNoZWNrKTtcbiAgfVxuXG4gIGlmICh1c2VEZXBzKSB7XG4gICAgdXNlRGVwc1tJblN0YXRpY1BhdGhdID0geyB0aGlzRmlsZTogVGltZUNoZWNrIH07XG4gICAgdXNlRGVwcyA9IHVzZURlcHNbSW5TdGF0aWNQYXRoXTtcbiAgfVxuXG4gIGNvbnN0IGluaGVyaXRhbmNlQ2FjaGUgPSB3aXRob3V0Q2FjaGVbMF0gPT0gSW5TdGF0aWNQYXRoO1xuICBpZiAoaW5oZXJpdGFuY2VDYWNoZSlcbiAgICB3aXRob3V0Q2FjaGUuc2hpZnQoKVxuICBlbHNlIGlmICghcmVCdWlsZCAmJiBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gJiYgIShTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKSlcbiAgICByZXR1cm4gU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShJblN0YXRpY1BhdGgpLCBwKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydChmaWxlUGF0aCwgcCwgdHlwZUFycmF5LCBpc0RlYnVnLCB1c2VEZXBzLCBpbmhlcml0YW5jZUNhY2hlID8gd2l0aG91dENhY2hlIDogW10pO1xuICB9XG5cbiAgbGV0IE15TW9kdWxlOiBhbnk7XG4gIGlmICh0aGlzQ3VzdG9tKSB7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoLCBmaWxlUGF0aCwgZXh0ZW5zaW9uLCByZXF1aXJlTWFwKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByZXF1aXJlUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIEluU3RhdGljUGF0aCArIFwiLmNqc1wiKTtcbiAgICBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShyZXF1aXJlUGF0aCk7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwKTtcbiAgfVxuXG4gIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IE15TW9kdWxlO1xuICBwcm9jZXNzRW5kPy4oKTtcblxuICByZXR1cm4gTXlNb2R1bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJbXBvcnRGaWxlKGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlPzogc3RyaW5nW10pIHtcbiAgaWYgKCFpc0RlYnVnKSB7XG4gICAgY29uc3QgaGF2ZUltcG9ydCA9IFNhdmVkTW9kdWxlc1twYXRoLmpvaW4odHlwZUFycmF5WzJdLCBJblN0YXRpY1BhdGgudG9Mb3dlckNhc2UoKSldO1xuICAgIGlmIChoYXZlSW1wb3J0ICE9PSB1bmRlZmluZWQpIHJldHVybiBoYXZlSW1wb3J0O1xuICB9XG5cbiAgcmV0dXJuIExvYWRJbXBvcnQoaW1wb3J0RnJvbSwgSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcsIHVzZURlcHMsIHdpdGhvdXRDYWNoZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlT25jZShmaWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG5cbiAgY29uc3QgdGVtcEZpbGUgPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgYHRlbXAtJHt1dWlkKCl9LmNqc2ApO1xuXG4gIGF3YWl0IEJ1aWxkU2NyaXB0KFxuICAgIGZpbGVQYXRoLFxuICAgIHRlbXBGaWxlLFxuICAgIENoZWNrVHMoZmlsZVBhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG5cbiAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gYXdhaXQgTXlNb2R1bGUoKHBhdGg6IHN0cmluZykgPT4gaW1wb3J0KHBhdGgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVDanNTY3JpcHQoY29udGVudDogc3RyaW5nKSB7XG5cbiAgY29uc3QgdGVtcEZpbGUgPSBwYXRoLmpvaW4oU3lzdGVtRGF0YSwgYHRlbXAtJHt1dWlkKCl9LmNqc2ApO1xuICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRlbXBGaWxlLCBjb250ZW50KTtcblxuICBjb25zdCBtb2RlbCA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZSh0ZW1wRmlsZSk7XG4gIEVhc3lGcy51bmxpbmsodGVtcEZpbGUpO1xuXG4gIHJldHVybiBtb2RlbDtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZha2Ugc2NyaXB0IGxvY2F0aW9uLCBhIGZpbGUgbG9jYXRpb24sIGEgdHlwZSBhcnJheSwgYW5kIGEgYm9vbGVhbiBmb3Igd2hldGhlciBvciBub3QgaXQnc1xuICogYSBUeXBlU2NyaXB0IGZpbGUuIEl0IHRoZW4gY29tcGlsZXMgdGhlIHNjcmlwdCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gdGhlIG1vZHVsZVxuICogVGhpcyBpcyBmb3IgUnVuVGltZSBDb21waWxlIFNjcmlwdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBnbG9iYWxQcmFtcyAtIHN0cmluZywgc2NyaXB0TG9jYXRpb246IHN0cmluZywgaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlOiBzdHJpbmcsXG4gKiB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc1R5cGVTY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIGZpbGVDb2RlOiBzdHJpbmcsICBzb3VyY2VNYXBDb21tZW50OlxuICogc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc2NyaXB0TG9jYXRpb24gLSBUaGUgbG9jYXRpb24gb2YgdGhlIHNjcmlwdCB0byBiZSBjb21waWxlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUgLSBUaGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgZmlsZSBmcm9tIHRoZSBzdGF0aWMgZm9sZGVyLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gW3N0cmluZywgc3RyaW5nXVxuICogQHBhcmFtIHtib29sZWFufSBpc1R5cGVTY3JpcHQgLSBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gSWYgdHJ1ZSwgdGhlIGNvZGUgd2lsbCBiZSBjb21waWxlZCB3aXRoIGRlYnVnIGluZm9ybWF0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVDb2RlIC0gVGhlIGNvZGUgdGhhdCB3aWxsIGJlIGNvbXBpbGVkIGFuZCBzYXZlZCB0byB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VNYXBDb21tZW50IC0gc3RyaW5nXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlSW1wb3J0KGdsb2JhbFByYW1zOiBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc1R5cGVTY3JpcHQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4sIG1lcmdlVHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmUsIHR5cGVBcnJheVsxXSk7XG5cbiAgY29uc3QgZnVsbFNhdmVMb2NhdGlvbiA9IHNjcmlwdExvY2F0aW9uICsgXCIuY2pzXCI7XG4gIGNvbnN0IHRlbXBsYXRlUGF0aCA9IHR5cGVBcnJheVswXSArIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBzY3JpcHRMb2NhdGlvbixcbiAgICBmdWxsU2F2ZUxvY2F0aW9uLFxuICAgIGlzVHlwZVNjcmlwdCxcbiAgICBpc0RlYnVnLFxuICAgIHsgcGFyYW1zOiBnbG9iYWxQcmFtcywgbWVyZ2VUcmFjaywgdGVtcGxhdGVQYXRoLCBjb2RlTWluaWZ5OiBmYWxzZSB9XG4gICk7XG5cbiAgZnVuY3Rpb24gcmVxdWlyZU1hcChwOiBzdHJpbmcpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHApKVxuICAgICAgcCA9IHBhdGgucmVsYXRpdmUocCwgdHlwZUFycmF5WzBdKTtcbiAgICBlbHNlIHtcbiAgICAgIGlmIChwWzBdID09IFwiLlwiKSB7XG4gICAgICAgIHAgPSBwYXRoLmpvaW4oaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCBwKTtcblxuICAgICAgfVxuICAgICAgZWxzZSBpZiAocFswXSAhPSBcIi9cIilcbiAgICAgICAgcmV0dXJuIEFsaWFzT3JQYWNrYWdlKHApO1xuICAgIH1cblxuICAgIHJldHVybiBMb2FkSW1wb3J0KHRlbXBsYXRlUGF0aCwgcCwgdHlwZUFycmF5LCBpc0RlYnVnKTtcbiAgfVxuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGZ1bGxTYXZlTG9jYXRpb24pO1xuICByZXR1cm4gYXN5bmMgKC4uLmFycjogYW55W10pID0+IGF3YWl0IE15TW9kdWxlKHJlcXVpcmVNYXAsIC4uLmFycik7XG59IiwgImltcG9ydCB7IFN0cmluZ01hcCB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IE1pbmlTZWFyY2gsIHtTZWFyY2hPcHRpb25zfSBmcm9tICdtaW5pc2VhcmNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoUmVjb3JkIHtcbiAgICBwcml2YXRlIGZ1bGxQYXRoOiBzdHJpbmdcbiAgICBwcml2YXRlIGluZGV4RGF0YToge1trZXk6IHN0cmluZ106IHtcbiAgICAgICAgdGl0bGVzOiBTdHJpbmdNYXAsXG4gICAgICAgIHRleHQ6IHN0cmluZ1xuICAgIH19XG4gICAgcHJpdmF0ZSBtaW5pU2VhcmNoOiBNaW5pU2VhcmNoO1xuICAgIGNvbnN0cnVjdG9yKGZpbGVwYXRoOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgZmlsZXBhdGhcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKCl7XG4gICAgICAgIHRoaXMuaW5kZXhEYXRhID0gYXdhaXQgRWFzeUZzLnJlYWRKc29uRmlsZSh0aGlzLmZ1bGxQYXRoKTtcbiAgICAgICAgY29uc3QgdW53cmFwcGVkOiB7aWQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZ31bXSA9IFtdO1xuXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgZm9yKGNvbnN0IHBhdGggaW4gdGhpcy5pbmRleERhdGEpe1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuaW5kZXhEYXRhW3BhdGhdO1xuICAgICAgICAgICAgZm9yKGNvbnN0IGlkIGluIGVsZW1lbnQudGl0bGVzKXtcbiAgICAgICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50aXRsZXNbaWRdLCB1cmw6IGAvJHtwYXRofS8jJHtpZH1gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bndyYXBwZWQucHVzaCh7aWQ6IGNvdW50ZXIrKywgdGV4dDogZWxlbWVudC50ZXh0LCB1cmw6IGAvJHtwYXRofWB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWluaVNlYXJjaCA9IG5ldyBNaW5pU2VhcmNoKHtcbiAgICAgICAgICAgIGZpZWxkczogWyd0ZXh0J10sXG4gICAgICAgICAgICBzdG9yZUZpZWxkczogWydpZCcsICd0ZXh0JywgJ3VybCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubWluaVNlYXJjaC5hZGRBbGwodW53cmFwcGVkKTtcbiAgICB9XG5cbiAgICBzZWFyY2godGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zID0ge2Z1enp5OiB0cnVlfSwgdGFnID0gJ2InKXtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubWluaVNlYXJjaC5zZWFyY2godGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIGlmKCF0YWcpIHJldHVybiBkYXRhO1xuXG4gICAgICAgIGZvcihjb25zdCBpIG9mIGRhdGEpe1xuICAgICAgICAgICAgZm9yKGNvbnN0IHRlcm0gb2YgaS50ZXJtcyl7XG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyID0gaS50ZXh0LnRvTG93ZXJDYXNlKCksIHJlYnVpbGQgPSAnJztcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoaW5kZXggIT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICByZWJ1aWxkICs9IGxvd2VyLnN1YnN0cmluZygwLCBpbmRleCkgKyAgYDwke3RhZ30+JHtpLnRleHQuc3Vic3RyaW5nKGluZGV4ICsgcmVidWlsZC5sZW5ndGgsIGluZGV4ICsgdGVybS5sZW5ndGggKyByZWJ1aWxkLmxlbmd0aCl9PC8ke3RhZ30+YFxuICAgICAgICAgICAgICAgICAgICBsb3dlciA9IGxvd2VyLnN1YnN0cmluZyhpbmRleCArIHRlcm0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsb3dlci5pbmRleE9mKHRlcm0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGkudGV4dCA9IHJlYnVpbGQgKyBsb3dlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHN1Z2dlc3QodGV4dDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluaVNlYXJjaC5hdXRvU3VnZ2VzdCh0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG59IiwgImltcG9ydCBTZWFyY2hSZWNvcmQgZnJvbSBcIi4uLy4uLy4uL0J1aWxkSW5GdW5jL1NlYXJjaFJlY29yZFwiXG5pbXBvcnQge1NldHRpbmdzfSAgZnJvbSAnLi4vLi4vLi4vTWFpbkJ1aWxkL1NlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbn0iLCAiaW1wb3J0IHBhY2thZ2VFeHBvcnQgZnJvbSBcIi4vcGFja2FnZUV4cG9ydFwiO1xuXG4vL0B0cy1pZ25vcmUtbmV4dC1saW5lXG5leHBvcnQgY29uc3QgYWxpYXNOYW1lcyA9IFtwYWNrYWdlTmFtZV1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aDogc3RyaW5nKTogYW55IHtcblxuICAgIHN3aXRjaCAob3JpZ2luYWxQYXRoKSB7XG4gICAgICAgIC8vQHRzLWlnbm9yZS1uZXh0LWxpbmVcbiAgICAgICAgY2FzZSBwYWNrYWdlTmFtZTpcbiAgICAgICAgICAgIHJldHVybiBwYWNrYWdlRXhwb3J0KClcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGlhc09yUGFja2FnZShvcmlnaW5hbFBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGhhdmUgPSBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGgpO1xuICAgIGlmIChoYXZlKSByZXR1cm4gaGF2ZVxuICAgIHJldHVybiBpbXBvcnQob3JpZ2luYWxQYXRoKTtcbn0iLCAiaW1wb3J0IEltcG9ydEFsaWFzLCB7IGFsaWFzTmFtZXMgfSBmcm9tICcuL0FsaWFzJztcbmltcG9ydCBJbXBvcnRCeUV4dGVuc2lvbiwgeyBjdXN0b21UeXBlcyB9IGZyb20gJy4vRXh0ZW5zaW9uL2luZGV4JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGF0aEN1c3RvbShvcmlnaW5hbFBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY3VzdG9tVHlwZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSB8fCBhbGlhc05hbWVzLmluY2x1ZGVzKG9yaWdpbmFsUGF0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEN1c3RvbUltcG9ydChvcmlnaW5hbFBhdGg6IHN0cmluZywgZnVsbFBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcsIHJlcXVpcmU6IChwOiBzdHJpbmcpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsaWFzRXhwb3J0ID0gYXdhaXQgSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoYWxpYXNFeHBvcnQpIHJldHVybiBhbGlhc0V4cG9ydDtcbiAgICByZXR1cm4gSW1wb3J0QnlFeHRlbnNpb24oZnVsbFBhdGgsIGV4dGVuc2lvbik7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFJhem9yVG9FSlMsIFJhem9yVG9FSlNNaW5pIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQmFzZVJlYWRlci9SZWFkZXInO1xuXG5cbmNvbnN0IGFkZFdyaXRlTWFwID0ge1xuICAgIFwiaW5jbHVkZVwiOiBcImF3YWl0IFwiLFxuICAgIFwiaW1wb3J0XCI6IFwiYXdhaXQgXCIsXG4gICAgXCJ0cmFuc2ZlclwiOiBcInJldHVybiBhd2FpdCBcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDb252ZXJ0U3ludGF4KHRleHQ6IFN0cmluZ1RyYWNrZXIsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTKHRleHQuZXEpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gdGV4dC5zdWJzdHJpbmcoaS5zdGFydCwgaS5lbmQpO1xuICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzKHN1YnN0cmluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicHJpbnRcIjpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JT0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU6JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkV3JpdGVNYXBbaS5uYW1lXX0ke3N1YnN0cmluZ30lPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59XG5cbi8qKlxuICogQ29udmVydFN5bnRheE1pbmkgdGFrZXMgdGhlIGNvZGUgYW5kIGEgc2VhcmNoIHN0cmluZyBhbmQgY29udmVydCBjdXJseSBicmFja2V0c1xuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSB0ZXh0IC0gVGhlIHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmluZCAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhZGRFSlMgLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgc3RhcnQgb2YgdGhlIGVqcy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheE1pbmkodGV4dDogU3RyaW5nVHJhY2tlciwgZmluZDogc3RyaW5nLCBhZGRFSlM6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFJhem9yVG9FSlNNaW5pKHRleHQuZXEsIGZpbmQpO1xuICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgIGlmICh2YWx1ZXNbaV0gIT0gdmFsdWVzW2kgKyAxXSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXModGV4dC5zdWJzdHJpbmcodmFsdWVzW2ldLCB2YWx1ZXNbaSArIDFdKSk7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpICsgMl0sIHZhbHVlc1tpICsgM10pO1xuICAgICAgICBidWlsZC5QbHVzJGA8JSR7YWRkRUpTfSR7c3Vic3RyaW5nfSU+YDtcbiAgICB9XG5cbiAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKCh2YWx1ZXMuYXQoLTEpPz8tMSkgKyAxKSk7XG5cbiAgICByZXR1cm4gYnVpbGQ7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmluYWxpemVCdWlsZCB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuXG5cbmV4cG9ydCBjbGFzcyBQYWdlVGVtcGxhdGUgZXh0ZW5kcyBKU1BhcnNlciB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBBZGRQYWdlVGVtcGxhdGUodGV4dDogU3RyaW5nVHJhY2tlciwgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcblxuICAgICAgICB0ZXh0ID0gYXdhaXQgZmluYWxpemVCdWlsZCh0ZXh0LCBzZXNzaW9uSW5mbywgZnVsbFBhdGhDb21waWxlKTtcblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soYHRyeSB7XFxuYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGBcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSAoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3IpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoc2Vzc2lvbkluZm8uZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoc2Vzc2lvbkluZm8uZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5jbHVkZSA9IChwLCB3aXRoT2JqZWN0KSA9PiBfaW5jbHVkZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHAsIHdpdGhPYmplY3QpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlID0geyBleHBvcnRzOiB7fSB9LFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgICAgICAgICAgICAgIHsgc2VuZEZpbGUsIHdyaXRlU2FmZSwgd3JpdGUsIGVjaG8sIHNldFJlc3BvbnNlLCBvdXRfcnVuX3NjcmlwdCwgcnVuX3NjcmlwdF9uYW1lLCBSZXNwb25zZSwgUmVxdWVzdCwgUG9zdCwgUXVlcnksIFNlc3Npb24sIEZpbGVzLCBDb29raWVzLCBQYWdlVmFyLCBHbG9iYWxWYXJ9ID0gcGFnZSxcblxuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X2NvZGUgPSBydW5fc2NyaXB0X25hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmZXIgPSAocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0KSA9PiAob3V0X3J1bl9zY3JpcHQgPSB7dGV4dDogJyd9LCBfdHJhbnNmZXIocCwgcHJlc2VydmVGb3JtLCB3aXRoT2JqZWN0LCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UpKTtcbiAgICAgICAgICAgICAgICB7YCk7XG5cblxuXG4gICAgICAgIGlmIChzZXNzaW9uSW5mby5kZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBcXG59XG4gICAgICAgICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RfZmlsZSA9IHJ1bl9zY3JpcHRfbmFtZS5zcGxpdCgvLT58PGxpbmU+LykucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSArPSAnIC0+IDxsaW5lPicgKyBlLnN0YWNrLnNwbGl0KC9cXFxcbiggKSphdCAvKVsyXTtcbiAgICAgICAgICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSAnJHtQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihgPHA+RXJyb3IgcGF0aDogJyArIHJ1bl9zY3JpcHRfbmFtZS5yZXBsYWNlKC88bGluZT4vZ2ksICc8YnIvPicpICsgJzwvcD48cD5FcnJvciBtZXNzYWdlOiAnICsgZS5tZXNzYWdlICsgJzwvcD5gKX0nO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBhdGg6IFwiICsgcnVuX3NjcmlwdF9uYW1lLnNsaWNlKDAsIC1sYXN0X2ZpbGUubGVuZ3RoKS5yZXBsYWNlKC88bGluZT4vZ2ksICdcXFxcbicpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCl9XCIgKyBsYXN0X2ZpbGUudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIG1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJ1bm5pbmcgdGhpcyBjb2RlOiBcXFxcXCJcIiArIHJ1bl9zY3JpcHRfY29kZSArICdcIicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc3RhY2s6IFwiICsgZS5zdGFjayk7XG4gICAgICAgICAgICAgICAgfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGB9fSk7fWApO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbHRDb2RlID0gYXdhaXQgUGFnZVRlbXBsYXRlLlJ1bkFuZEV4cG9ydCh0ZXh0LCBzZXNzaW9uSW5mby5mdWxsUGF0aCwgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuQWRkUGFnZVRlbXBsYXRlKGJ1aWx0Q29kZSwgZnVsbFBhdGhDb21waWxlLCBzZXNzaW9uSW5mbyk7XG4gICAgfVxuXG4gICAgc3RhdGljIEFkZEFmdGVyQnVpbGQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIEluUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGRhdGFPYmplY3Q6IGFueSwgZnVsbFBhdGg6IHN0cmluZykge1xuICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGA8JSF7XG4gICAgICAgICAgICBjb25zdCBfcGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gey4uLl9wYWdlJHtkYXRhT2JqZWN0ID8gJywnICsgZGF0YU9iamVjdCA6ICcnfX07XG4gICAgICAgICAgICBjb25zdCBfX2ZpbGVuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZnVsbFBhdGgpfVwiLCBfX2Rpcm5hbWUgPSBcIiR7SlNQYXJzZXIuZml4VGV4dFNpbXBsZVF1b3RlcyhwYXRoLmRpcm5hbWUoZnVsbFBhdGgpKX1cIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSAocCkgPT4gX3JlcXVpcmUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwKTtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAgeyU+YCk7XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKCc8JSF9fX0lPicpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgUmF6b3JTeW50YXggZnJvbSAnLi9SYXpvclN5bnRheCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2V0U3ludGF4KENvbXBpbGVUeXBlOiBhbnkpIHtcbiAgICBsZXQgZnVuYzogYW55O1xuICAgIHN3aXRjaCAoQ29tcGlsZVR5cGUubmFtZSB8fCBDb21waWxlVHlwZSkge1xuICAgICAgICBjYXNlIFwiUmF6b3JcIjpcbiAgICAgICAgICAgIGZ1bmMgPSBSYXpvclN5bnRheDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbn0iLCAiaW1wb3J0IEFkZFN5bnRheCBmcm9tICcuL1N5bnRheC9JbmRleCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkUGx1Z2luIHtcblx0cHVibGljIFNldHRpbmdzT2JqZWN0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihTZXR0aW5nc09iamVjdDoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICAgICAgdGhpcy5TZXR0aW5nc09iamVjdCA9IFNldHRpbmdzT2JqZWN0XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZGVmYXVsdFN5bnRheCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5TZXR0aW5nc09iamVjdC5CYXNpY0NvbXBpbGF0aW9uU3ludGF4LmNvbmNhdCh0aGlzLlNldHRpbmdzT2JqZWN0LkFkZENvbXBpbGVTeW50YXgpO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkQmFzaWModGV4dDogU3RyaW5nVHJhY2tlciwgT0RhdGE6c3RyaW5nIHxhbnksIHBhdGg6c3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgLy9hZGQgU3ludGF4XG5cbiAgICAgICAgaWYgKCFPRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoT0RhdGEpKSB7XG4gICAgICAgICAgICBPRGF0YSA9IFtPRGF0YV07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgT0RhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IFN5bnRheCA9IGF3YWl0IEFkZFN5bnRheChpKTtcblxuICAgICAgICAgICAgaWYgKFN5bnRheCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBhd2FpdCBTeW50YXgodGV4dCwgaSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgcGFnZXNcbiAgICAgKiBAcGFyYW0gdGV4dCBhbGwgdGhlIGNvZGVcbiAgICAgKiBAcGFyYW0gcGF0aCBmaWxlIGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHBhdGhOYW1lIGZpbGUgbG9jYXRpb24gd2l0aG91dCBzdGFydCBmb2xkZXIgKHNtYWxsIHBhdGgpXG4gICAgICogQHJldHVybnMgY29tcGlsZWQgY29kZVxuICAgICAqL1xuICAgIGFzeW5jIEJ1aWxkUGFnZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwbHVnaW5zIGZvciBjb21wb25lbnRzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZENvbXBvbmVudCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHBhdGhOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+e1xuICAgICAgICB0ZXh0ID0gYXdhaXQgdGhpcy5CdWlsZEJhc2ljKHRleHQsIHRoaXMuZGVmYXVsdFN5bnRheCwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxufSIsICIvL2dsb2JhbCBzZXR0aW5ncyBmb3IgYnVpbGQgaW4gY29tcG9uZW50c1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7XG4gICAgcGx1Z2luczogW11cbn07IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuL1NjcmlwdFRlbXBsYXRlJztcbmltcG9ydCBBZGRQbHVnaW4gZnJvbSAnLi4vUGx1Z2lucy9JbmRleCc7XG5pbXBvcnQgeyBDcmVhdGVGaWxlUGF0aCwgUGFyc2VEZWJ1Z0xpbmUsIEFkZERlYnVnSW5mbyB9IGZyb20gJy4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCAqIGFzIGV4dHJpY2F0ZSBmcm9tICcuL1hNTEhlbHBlcnMvRXh0cmljYXRlJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tICcuL3RyYW5zZm9ybS9TY3JpcHQnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgQnVpbGRTY3JpcHRTZXR0aW5ncyB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzJztcbmltcG9ydCBQYXJzZUJhc2VQYWdlIGZyb20gJy4vQ29tcGlsZVNjcmlwdC9QYWdlQmFzZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuXG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSB7IEFkZENvbXBpbGVTeW50YXg6IFtdLCBwbHVnaW5zOiBbXSwgQmFzaWNDb21waWxhdGlvblN5bnRheDogWydSYXpvciddIH07XG5jb25zdCBQbHVnaW5CdWlsZCA9IG5ldyBBZGRQbHVnaW4oU2V0dGluZ3MpO1xuZXhwb3J0IGNvbnN0IENvbXBvbmVudHMgPSBuZXcgSW5zZXJ0Q29tcG9uZW50KFBsdWdpbkJ1aWxkKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldFBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gU2V0dGluZ3MucGx1Z2lucy5maW5kKGIgPT4gYiA9PSBuYW1lIHx8ICg8YW55PmIpPy5uYW1lID09IG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU29tZVBsdWdpbnMoLi4uZGF0YTogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gZGF0YS5zb21lKHggPT4gR2V0UGx1Z2luKHgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHMoKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLkFkZENvbXBpbGVTeW50YXguaW5jbHVkZXMoJ1R5cGVTY3JpcHQnKTtcbn1cblxuQ29tcG9uZW50cy5NaWNyb1BsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuQ29tcG9uZW50cy5HZXRQbHVnaW4gPSBHZXRQbHVnaW47XG5Db21wb25lbnRzLlNvbWVQbHVnaW5zID0gU29tZVBsdWdpbnM7XG5Db21wb25lbnRzLmlzVHMgPSBpc1RzO1xuXG5CdWlsZFNjcmlwdFNldHRpbmdzLnBsdWdpbnMgPSBTZXR0aW5ncy5wbHVnaW5zO1xuXG5hc3luYyBmdW5jdGlvbiBvdXRQYWdlKGRhdGE6IFN0cmluZ1RyYWNrZXIsIHNjcmlwdEZpbGU6IFN0cmluZ1RyYWNrZXIsIHBhZ2VQYXRoOiBzdHJpbmcsIHBhZ2VOYW1lOiBzdHJpbmcsIExhc3RTbWFsbFBhdGg6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuXG4gICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShkYXRhLCBpc1RzKCkpO1xuICAgIGF3YWl0IGJhc2VEYXRhLmxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbywgcGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIHBhZ2VOYW1lKTtcblxuICAgIGNvbnN0IG1vZGVsTmFtZSA9IGJhc2VEYXRhLnBvcEFueSgnbW9kZWwnKT8uZXE7XG5cbiAgICBpZiAoIW1vZGVsTmFtZSkgcmV0dXJuIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlLCBiYXNlRGF0YS5jbGVhckRhdGEpO1xuICAgIGRhdGEgPSBiYXNlRGF0YS5jbGVhckRhdGE7XG5cbiAgICAvL2ltcG9ydCBtb2RlbFxuICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQ3JlYXRlRmlsZVBhdGgocGFnZVBhdGgsIExhc3RTbWFsbFBhdGgsIG1vZGVsTmFtZSwgJ01vZGVscycsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLm1vZGVsKTsgLy8gZmluZCBsb2NhdGlvbiBvZiB0aGUgZmlsZVxuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdWxsUGF0aCkpIHtcbiAgICAgICAgY29uc3QgRXJyb3JNZXNzYWdlID0gYEVycm9yIG1vZGVsIG5vdCBmb3VuZCAtPiAke21vZGVsTmFtZX0gYXQgcGFnZSAke3BhZ2VOYW1lfWA7XG5cbiAgICAgICAgcHJpbnQuZXJyb3IoRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0LCBQYWdlVGVtcGxhdGUucHJpbnRFcnJvcihFcnJvck1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKFNtYWxsUGF0aCwgRnVsbFBhdGgpOyAvLyBjaGVjayBwYWdlIGNoYW5nZWQgZGF0ZSwgZm9yIGRlcGVuZGVuY2VPYmplY3RcblxuICAgIGNvbnN0IGJhc2VNb2RlbERhdGEgPSBhd2FpdCBBZGREZWJ1Z0luZm8ocGFnZU5hbWUsIEZ1bGxQYXRoLCBTbWFsbFBhdGgpOyAvLyByZWFkIG1vZGVsXG4gICAgbGV0IG1vZGVsRGF0YSA9IFBhcnNlQmFzZVBhZ2UucmVidWlsZEJhc2VJbmhlcml0YW5jZShiYXNlTW9kZWxEYXRhLmFsbERhdGEpO1xuXG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgbW9kZWxEYXRhLkFkZFRleHRCZWZvcmVOb1RyYWNrKGJhc2VNb2RlbERhdGEuc3RyaW5nSW5mbyk7XG5cbiAgICBwYWdlTmFtZSArPSBcIiAtPiBcIiArIFNtYWxsUGF0aDtcblxuICAgIC8vR2V0IHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IGFsbERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ2VzKG1vZGVsRGF0YSwgWycnXSwgJzonLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICBpZiAoYWxsRGF0YS5lcnJvcikge1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHdpdGhpbiBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgbW9kZWxEYXRhID0gYWxsRGF0YS5kYXRhO1xuICAgIGNvbnN0IHRhZ0FycmF5ID0gYWxsRGF0YS5mb3VuZC5tYXAoeCA9PiB4LnRhZy5zdWJzdHJpbmcoMSkpO1xuICAgIGNvbnN0IG91dERhdGEgPSBleHRyaWNhdGUuZ2V0RGF0YVRhZ2VzKGRhdGEsIHRhZ0FycmF5LCAnQCcpO1xuXG4gICAgaWYgKG91dERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBXaXRoIG1vZGVsIC0+XCIsIG1vZGVsTmFtZSwgXCJhdCBwYWdlOiBcIiwgcGFnZU5hbWUpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvL0J1aWxkIFdpdGggcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbW9kZWxCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgYWxsRGF0YS5mb3VuZCkge1xuICAgICAgICBpLnRhZyA9IGkudGFnLnN1YnN0cmluZygxKTsgLy8gcmVtb3ZpbmcgdGhlICc6J1xuICAgICAgICBjb25zdCBob2xkZXJEYXRhID0gb3V0RGF0YS5mb3VuZC5maW5kKChlKSA9PiBlLnRhZyA9PSAnQCcgKyBpLnRhZyk7XG5cbiAgICAgICAgbW9kZWxCdWlsZC5QbHVzKG1vZGVsRGF0YS5zdWJzdHJpbmcoMCwgaS5sb2MpKTtcbiAgICAgICAgbW9kZWxEYXRhID0gbW9kZWxEYXRhLnN1YnN0cmluZyhpLmxvYyk7XG5cbiAgICAgICAgaWYgKGhvbGRlckRhdGEpIHtcbiAgICAgICAgICAgIG1vZGVsQnVpbGQuUGx1cyhob2xkZXJEYXRhLmRhdGEpO1xuICAgICAgICB9IGVsc2UgeyAvLyBUcnkgbG9hZGluZyBkYXRhIGZyb20gcGFnZSBiYXNlXG4gICAgICAgICAgICBjb25zdCBsb2FkRnJvbUJhc2UgPSBiYXNlRGF0YS5nZXQoaS50YWcpO1xuXG4gICAgICAgICAgICBpZiAobG9hZEZyb21CYXNlICYmIGxvYWRGcm9tQmFzZS5lcS50b0xvd2VyQ2FzZSgpICE9ICdpbmhlcml0JylcbiAgICAgICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMobG9hZEZyb21CYXNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG91dFBhZ2UobW9kZWxCdWlsZCwgc2NyaXB0RmlsZS5QbHVzKGJhc2VEYXRhLnNjcmlwdEZpbGUpLCBGdWxsUGF0aCwgcGFnZU5hbWUsIFNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW5zZXJ0KGRhdGE6IHN0cmluZywgZnVsbFBhdGhDb21waWxlOiBzdHJpbmcsIG5lc3RlZFBhZ2U6IGJvb2xlYW4sIG5lc3RlZFBhZ2VEYXRhOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBsZXQgRGVidWdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcihzZXNzaW9uSW5mby5zbWFsbFBhdGgsIGRhdGEpO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgb3V0UGFnZShEZWJ1Z1N0cmluZywgbmV3IFN0cmluZ1RyYWNrZXIoRGVidWdTdHJpbmcuRGVmYXVsdEluZm9UZXh0KSwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBsdWdpbkJ1aWxkLkJ1aWxkUGFnZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgQ29tcG9uZW50cy5JbnNlcnQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pOyAvLyBhZGQgY29tcG9uZW50c1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYXJzZURlYnVnTGluZShEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uc21hbGxQYXRoKTtcblxuICAgIGlmIChuZXN0ZWRQYWdlKSB7IC8vIHJldHVybiBTdHJpbmdUcmFja2VyLCBiZWNhdXNlIHRoaXMgaW1wb3J0IHdhcyBmcm9tIHBhZ2VcbiAgICAgICAgcmV0dXJuIFBhZ2VUZW1wbGF0ZS5JblBhZ2VUZW1wbGF0ZShEZWJ1Z1N0cmluZywgbmVzdGVkUGFnZURhdGEsIHNlc3Npb25JbmZvLmZ1bGxQYXRoKTtcbiAgICB9XG5cbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZSwgc2Vzc2lvbkluZm8pO1xuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgc2Vzc2lvbkluZm8uQnVpbGRTY3JpcHRXaXRoUHJhbXMoRGVidWdTdHJpbmcpO1xuICAgIERlYnVnU3RyaW5nPSBQYWdlVGVtcGxhdGUuQWRkQWZ0ZXJCdWlsZChEZWJ1Z1N0cmluZywgc2Vzc2lvbkluZm8uZGVidWcpO1xuXG4gICAgcmV0dXJuIERlYnVnU3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJ1aWxkSlMsIEJ1aWxkSlNYLCBCdWlsZFRTLCBCdWlsZFRTWCB9IGZyb20gJy4vRm9yU3RhdGljL1NjcmlwdCc7XG5pbXBvcnQgQnVpbGRTdmVsdGUgZnJvbSAnLi9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudCc7XG5pbXBvcnQgeyBCdWlsZFN0eWxlU2FzcyB9IGZyb20gJy4vRm9yU3RhdGljL1N0eWxlJztcbmltcG9ydCB7IGdldFR5cGVzLCBTeXN0ZW1EYXRhLCBnZXREaXJuYW1lLCBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgUmVzcG9uc2UsIFJlcXVlc3QgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHByb21wdGx5IGZyb20gJ3Byb21wdGx5JztcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcblxuY29uc3QgU3VwcG9ydGVkVHlwZXMgPSBbJ2pzJywgJ3N2ZWx0ZScsICd0cycsICdqc3gnLCAndHN4JywgJ2NzcycsICdzYXNzJywgJ3Njc3MnXTtcblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU3RhdGljRmlsZXMnKTtcblxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG8gPSBTdGF0aWNGaWxlc0luZm8uc3RvcmVbcGF0aF07XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbykge1xuICAgICAgICBsZXQgcCA9IGk7XG5cbiAgICAgICAgaWYgKGkgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgcCA9IGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBGaWxlUGF0aCA9IEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IG9baV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICFvO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkRmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgZnVsbENvbXBpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKFNtYWxsUGF0aCkuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgZGVwZW5kZW5jaWVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xuICAgIHN3aXRjaCAoZXh0KSB7XG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlMoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkSlNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkVFNYKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3NzJzpcbiAgICAgICAgY2FzZSAnc2Fzcyc6XG4gICAgICAgIGNhc2UgJ3Njc3MnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdHlsZVNhc3MoU21hbGxQYXRoLCBleHQsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N2ZWx0ZSc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFN2ZWx0ZShTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgZnVsbENvbXBpbGVQYXRoICs9ICcuanMnO1xuICAgIH1cblxuICAgIGlmIChpc0RlYnVnICYmIGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxDb21waWxlUGF0aCkpIHtcbiAgICAgICAgU3RhdGljRmlsZXNJbmZvLnVwZGF0ZShTbWFsbFBhdGgsIGRlcGVuZGVuY2llcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghaXNEZWJ1ZylcbiAgICAgICAgcmV0dXJuIHRydWU7XG59XG5cbmludGVyZmFjZSBidWlsZEluIHtcbiAgICBwYXRoPzogc3RyaW5nO1xuICAgIGV4dD86IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgaW5TZXJ2ZXI/OiBzdHJpbmc7XG59XG5cbmNvbnN0IHN0YXRpY0ZpbGVzID0gU3lzdGVtRGF0YSArICcvLi4vc3RhdGljL2NsaWVudC8nO1xuY29uc3QgZ2V0U3RhdGljOiBidWlsZEluW10gPSBbe1xuICAgIHBhdGg6IFwic2Vydi90ZW1wLmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwiYnVpbGRUZW1wbGF0ZS5qc1wiXG59LFxue1xuICAgIHBhdGg6IFwic2Vydi9jb25uZWN0LmpzXCIsXG4gICAgdHlwZTogXCJqc1wiLFxuICAgIGluU2VydmVyOiBzdGF0aWNGaWxlcyArIFwibWFrZUNvbm5lY3Rpb24uanNcIlxufV07XG5cbmNvbnN0IGdldFN0YXRpY0ZpbGVzVHlwZTogYnVpbGRJbltdID0gW3tcbiAgICBleHQ6ICcucHViLmpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIubWpzJyxcbiAgICB0eXBlOiAnanMnXG59LFxue1xuICAgIGV4dDogJy5wdWIuY3NzJyxcbiAgICB0eXBlOiAnY3NzJ1xufV07XG5cbmFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkQnlUeXBlKFJlcXVlc3Q6IFJlcXVlc3QsIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmb3VuZCA9IGdldFN0YXRpY0ZpbGVzVHlwZS5maW5kKHggPT4gZmlsZVBhdGguZW5kc1dpdGgoeC5leHQpKTtcblxuICAgIGlmICghZm91bmQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgY29uc3QgYmFzZVBhdGggPSBSZXF1ZXN0LnF1ZXJ5LnQgPT0gJ2wnID8gZ2V0VHlwZXMuTG9nc1sxXSA6IGdldFR5cGVzLlN0YXRpY1sxXTtcbiAgICBjb25zdCBpblNlcnZlciA9IHBhdGguam9pbihiYXNlUGF0aCwgZmlsZVBhdGgpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoaW5TZXJ2ZXIpKVxuICAgICAgICByZXR1cm4geyAuLi5mb3VuZCwgaW5TZXJ2ZXIgfTtcbn1cblxubGV0IGRlYnVnZ2luZ1dpdGhTb3VyY2U6IG51bGwgfCBib29sZWFuID0gbnVsbDtcblxuaWYgKGFyZ3YuaW5jbHVkZXMoJ2FsbG93U291cmNlRGVidWcnKSlcbiAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gdHJ1ZTtcbmFzeW5jIGZ1bmN0aW9uIGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSB7XG4gICAgaWYgKHR5cGVvZiBkZWJ1Z2dpbmdXaXRoU291cmNlID09ICdib29sZWFuJylcbiAgICAgICAgcmV0dXJuIGRlYnVnZ2luZ1dpdGhTb3VyY2U7XG5cbiAgICB0cnkge1xuICAgICAgICBkZWJ1Z2dpbmdXaXRoU291cmNlID0gKGF3YWl0IHByb21wdGx5LnByb21wdChcbiAgICAgICAgICAgICdBbGxvdyBkZWJ1Z2dpbmcgSmF2YVNjcmlwdC9DU1MgaW4gc291cmNlIHBhZ2U/IC0gZXhwb3NpbmcgeW91ciBzb3VyY2UgY29kZSAobm8pJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iodjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ3llcycsICdubyddLmluY2x1ZGVzKHYudHJpbSgpLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigneWVzIG9yIG5vJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwICogMzBcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSkudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT0gJ3llcyc7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIH0gY2F0Y2ggeyB9XG5cblxuICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xufVxuXG5jb25zdCBzYWZlRm9sZGVycyA9IFtnZXRUeXBlcy5TdGF0aWNbMl0sIGdldFR5cGVzLkxvZ3NbMl0sICdNb2RlbHMnLCAnQ29tcG9uZW50cyddO1xuLyoqXG4gKiBJZiB0aGUgdXNlciBpcyBpbiBkZWJ1ZyBtb2RlLCBhbmQgdGhlIGZpbGUgaXMgYSBzb3VyY2UgZmlsZSwgYW5kIHRoZSB1c2VyIGNvbW1lbmQgbGluZSBhcmd1bWVudCBoYXZlIGFsbG93U291cmNlRGVidWdcbiAqIHRoZW4gcmV0dXJuIHRoZSBmdWxsIHBhdGggdG8gdGhlIGZpbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGlzIHRoZSBjdXJyZW50IHBhZ2UgYSBkZWJ1ZyBwYWdlP1xuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggb2YgdGhlIGZpbGUgdGhhdCB3YXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZCAtIElmIHRoaXMgcGF0aCBhbHJlYWR5IGJlZW4gY2hlY2tlZFxuICogdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgdHlwZSBvZiB0aGUgZmlsZSBhbmQgdGhlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVuc2FmZURlYnVnKGlzRGVidWc6IGJvb2xlYW4sIGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWlzRGVidWcgfHwgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpIHx8IHBhdGguZXh0bmFtZShmaWxlUGF0aCkgIT0gJy5zb3VyY2UnIHx8ICFzYWZlRm9sZGVycy5pbmNsdWRlcyhmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5zaGlmdCgpKSB8fCAhYXdhaXQgYXNrRGVidWdnaW5nV2l0aFNvdXJjZSgpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDcpKTsgLy8gcmVtb3ZpbmcgJy5zb3VyY2UnXG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3R5bGUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IGJhc2VGaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA0KTsgLy8gcmVtb3ZpbmcgJy5jc3MnXG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBmaWxlUGF0aDtcblxuICAgIGxldCBleGlzdHM6IGJvb2xlYW47XG4gICAgaWYgKHBhdGguZXh0bmFtZShiYXNlRmlsZVBhdGgpID09ICcuc3ZlbHRlJyAmJiAoY2hlY2tlZCB8fCAoZXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiAhZXhpc3RzKSB7XG4gICAgICAgIGF3YWl0IEJ1aWxkRmlsZShiYXNlRmlsZVBhdGgsIGlzRGVidWcsIGdldFR5cGVzLlN0YXRpY1sxXSArIGJhc2VGaWxlUGF0aClcbiAgICAgICAgcmV0dXJuIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoLCBjaGVja2VkLCBmYWxzZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzdmVsdGVTdGF0aWMoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9zdmVsdGUvJykpXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZ1bGxQYXRoID0gd29ya2luZ0RpcmVjdG9yeSArICdub2RlX21vZHVsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDQpICsgKHBhdGguZXh0bmFtZShmaWxlUGF0aCkgPyAnJyA6ICcvaW5kZXgubWpzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnanMnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25Db2RlVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC9jb2RlLXRoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMnICsgZmlsZVBhdGguc3Vic3RyaW5nKDE4KTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25UaGVtZShmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFmaWxlUGF0aC5zdGFydHNXaXRoKCdzZXJ2L21kL3RoZW1lLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBsZXQgZmlsZU5hbWUgPSBmaWxlUGF0aC5zdWJzdHJpbmcoMTQpO1xuICAgIGlmIChmaWxlTmFtZS5zdGFydHNXaXRoKCdhdXRvJykpXG4gICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyaW5nKDQpXG4gICAgZWxzZVxuICAgICAgICBmaWxlTmFtZSA9ICctJyArIGZpbGVOYW1lO1xuXG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJyArIGZpbGVOYW1lLnJlcGxhY2UoJy5jc3MnLCAnLm1pbi5jc3MnKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjc3MnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VydmVyQnVpbGQoUmVxdWVzdDogUmVxdWVzdCwgaXNEZWJ1ZzogYm9vbGVhbiwgcGF0aDogc3RyaW5nLCBjaGVja2VkID0gZmFsc2UpOiBQcm9taXNlPG51bGwgfCBidWlsZEluPiB7XG4gICAgcmV0dXJuIGF3YWl0IHN2ZWx0ZVN0YXRpYyhwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBzdmVsdGVTdHlsZShwYXRoLCBjaGVja2VkLCBpc0RlYnVnKSB8fFxuICAgICAgICBhd2FpdCB1bnNhZmVEZWJ1Zyhpc0RlYnVnLCBwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0LCBwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93blRoZW1lKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGF3YWl0IG1hcmtkb3duQ29kZVRoZW1lKHBhdGgsIGNoZWNrZWQpIHx8XG4gICAgICAgIGdldFN0YXRpYy5maW5kKHggPT4geC5wYXRoID09IHBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVidWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpICYmIGF3YWl0IEJ1aWxkRmlsZShTbWFsbFBhdGgsIGlzRGVidWcsIGZ1bGxDb21waWxlUGF0aCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBSZXF1ZXN0OiBSZXF1ZXN0LCBSZXNwb25zZTogUmVzcG9uc2UpIHtcbiAgICAvL2ZpbGUgYnVpbHQgaW5cbiAgICBjb25zdCBpc0J1aWxkSW4gPSBhd2FpdCBzZXJ2ZXJCdWlsZChSZXF1ZXN0LCBpc0RlYnVnLCBTbWFsbFBhdGgsIHRydWUpO1xuXG4gICAgaWYgKGlzQnVpbGRJbikge1xuICAgICAgICBSZXNwb25zZS50eXBlKGlzQnVpbGRJbi50eXBlKTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShpc0J1aWxkSW4uaW5TZXJ2ZXIpKTsgLy8gc2VuZGluZyB0aGUgZmlsZVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy9jb21waWxlZCBmaWxlc1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIFNtYWxsUGF0aDtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIFNtYWxsUGF0aDtcblxuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKCFTdXBwb3J0ZWRUeXBlcy5pbmNsdWRlcyhleHQpKSB7XG4gICAgICAgIFJlc3BvbnNlLnNlbmRGaWxlKGZ1bGxQYXRoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChbJ3Nhc3MnLCAnc2NzcycsICdjc3MnXS5pbmNsdWRlcyhleHQpKSB7IC8vIGFkZGluZyB0eXBlXG4gICAgICAgIFJlc3BvbnNlLnR5cGUoJ2NzcycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFJlc3BvbnNlLnR5cGUoJ2pzJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlc1BhdGggPSBmdWxsQ29tcGlsZVBhdGg7XG5cbiAgICAvLyByZS1jb21waWxpbmcgaWYgbmVjZXNzYXJ5IG9uIGRlYnVnIG1vZGVcbiAgICBpZiAoaXNEZWJ1ZyAmJiAoUmVxdWVzdC5xdWVyeS5zb3VyY2UgPT0gJ3RydWUnIHx8IGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShTbWFsbFBhdGgpICYmICFhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpKSkge1xuICAgICAgICByZXNQYXRoID0gZnVsbFBhdGg7XG4gICAgfSBlbHNlIGlmIChleHQgPT0gJ3N2ZWx0ZScpXG4gICAgICAgIHJlc1BhdGggKz0gJy5qcyc7XG5cbiAgICBSZXNwb25zZS5lbmQoYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocmVzUGF0aCwgJ3V0ZjgnKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbn0iLCAiaW1wb3J0IHsgU29tZVBsdWdpbnMsIEdldFBsdWdpbiB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50V2FybmluZ3MgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL3ByaW50TWVzc2FnZSc7XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG1vcmVPcHRpb25zPzogVHJhbnNmb3JtT3B0aW9ucykge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG4gICAgY29uc3QgQWRkT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgc291cmNlZmlsZTogaW5wdXRQYXRoICsgJz9zb3VyY2U9dHJ1ZScsXG4gICAgICAgIHNvdXJjZW1hcDogaXNEZWJ1ZyA/ICdpbmxpbmUnOiBmYWxzZSxcbiAgICAgICAgbWluaWZ5OiBTb21lUGx1Z2lucyhcIk1pblwiICsgdHlwZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKSwgLi4ubW9yZU9wdGlvbnNcbiAgICB9O1xuXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUsIHdhcm5pbmdzIH0gPSBhd2FpdCB0cmFuc2Zvcm0ocmVzdWx0LCBBZGRPcHRpb25zKTtcbiAgICAgICAgcmVzdWx0ID0gY29kZTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3Mod2FybmluZ3MsIGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3IoZXJyLCBmdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGgsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqcycsIGlzRGVidWcsIHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzJywgaXNEZWJ1ZywgeyBsb2FkZXI6ICd0cycgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZEpTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICdqc3gnLCBpc0RlYnVnLCB7IC4uLihHZXRQbHVnaW4oXCJKU1hPcHRpb25zXCIpID8/IHt9KSwgbG9hZGVyOiAnanN4JyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkVFNYKGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aCwgJ3RzeCcsIGlzRGVidWcsIHsgbG9hZGVyOiAndHN4JywgLi4uKEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pIH0pO1xufVxuIiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgeyBTb21lUGx1Z2lucyB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gXCJlc2J1aWxkLXdhc21cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2VcIjtcbmltcG9ydCB7IHRvVVJMQ29tbWVudCwgTWVyZ2VTb3VyY2VNYXAgfSBmcm9tIFwiLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IHsgUHJpbnRTdmVsdGVFcnJvciwgUHJpbnRTdmVsdGVXYXJuIH0gZnJvbSBcIi4vZXJyb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGluU3RhdGljUGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5TdGF0aWNQYXRoO1xuXG4gICAgY29uc3QgeyBjb2RlLCBkZXBlbmRlbmNpZXMsIG1hcCwgc2NyaXB0TGFuZyB9ID0gYXdhaXQgcHJlcHJvY2VzcyhmdWxsUGF0aCwgZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgaW5TdGF0aWNQYXRoKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZ1bGxQYXRoLnNwbGl0KC9cXC98XFwvLykucG9wKCk7XG4gICAgbGV0IGpzOiBhbnksIGNzczogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgZGV2OiBpc0RlYnVnLFxuICAgICAgICAgICAgc291cmNlbWFwOiBtYXAsXG4gICAgICAgICAgICBjc3M6IGZhbHNlLFxuICAgICAgICAgICAgaHlkcmF0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHN2ZWx0ZVBhdGg6ICcvc2Vydi9zdmVsdGUnXG4gICAgICAgIH0pO1xuICAgICAgICBQcmludFN2ZWx0ZVdhcm4ob3V0cHV0Lndhcm5pbmdzLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAganMgPSBvdXRwdXQuanM7XG4gICAgICAgIGNzcyA9IG91dHB1dC5jc3M7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgUHJpbnRTdmVsdGVFcnJvcihlcnIsIGZ1bGxQYXRoLCBtYXApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGhpc0ZpbGU6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHNvdXJjZUZpbGVDbGllbnQgPSBqcy5tYXAuc291cmNlc1swXS5zdWJzdHJpbmcoMSk7XG5cbiAgICBpZihpc0RlYnVnKXtcbiAgICAgICAganMubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgIH1cblxuICAgIGlmIChTb21lUGx1Z2lucyhcIk1pbkpTXCIpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKGpzLmNvZGUsIHtcbiAgICAgICAgICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgICAgICAgICAgbG9hZGVyOiA8YW55PnNjcmlwdExhbmcsXG4gICAgICAgICAgICAgICAgc291cmNlbWFwOiBpc0RlYnVnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAganMuY29kZSA9IGNvZGU7XG4gICAgICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICAgICAganMubWFwID0gYXdhaXQgTWVyZ2VTb3VyY2VNYXAoSlNPTi5wYXJzZShtYXApLCBqcy5tYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGF3YWl0IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwKGVyciwganMubWFwLCBmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICBqcy5jb2RlICs9IHRvVVJMQ29tbWVudChqcy5tYXApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgICAgICBjc3MubWFwLnNvdXJjZXNbMF0gPSBzb3VyY2VGaWxlQ2xpZW50O1xuICAgICAgICAgICAgY3NzLmNvZGUgKz0gdG9VUkxDb21tZW50KGNzcy5tYXAsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpblN0YXRpY1BhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmpzJywganMuY29kZSk7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmdWxsQ29tcGlsZVBhdGggKyAnLmNzcycsIGNzcy5jb2RlID8/ICcnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlcGVuZGVuY2llcyxcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn0iLCAiaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkx9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgIGNyZWF0ZUltcG9ydGVyLCBnZXRTYXNzRXJyb3JMaW5lLCBQcmludFNhc3NFcnJvciwgc2Fzc0FuZFNvdXJjZSwgc2Fzc1N0eWxlLCBzYXNzU3ludGF4IH0gZnJvbSAnLi4vLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU3R5bGVTYXNzKGlucHV0UGF0aDogc3RyaW5nLCB0eXBlOiBcInNhc3NcIiB8IFwic2Nzc1wiIHwgXCJjc3NcIiwgaXNEZWJ1ZzogYm9vbGVhbik6IFByb21pc2U8eyBba2V5OiBzdHJpbmddOiBudW1iZXIgfT4ge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgaW5wdXRQYXRoLCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBpbnB1dFBhdGg7XG5cbiAgICBjb25zdCBkZXBlbmRlbmNlT2JqZWN0ID0ge1xuICAgICAgICB0aGlzRmlsZTogYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJylcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCksIGZpbGVEYXRhRGlybmFtZSA9IHBhdGguZGlybmFtZShmdWxsUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhmaWxlRGF0YSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBpc0RlYnVnLFxuICAgICAgICAgICAgc3ludGF4OiBzYXNzU3ludGF4KHR5cGUpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZSh0eXBlLCBTb21lUGx1Z2lucyksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudCxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcihmdWxsUGF0aCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQ/LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aCg8YW55PmZpbGUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2VPYmplY3RbQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShGdWxsUGF0aCldID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5jc3M7XG5cbiAgICAgICAgaWYgKGlzRGVidWcgJiYgcmVzdWx0LnNvdXJjZU1hcCkge1xuICAgICAgICAgICAgc2Fzc0FuZFNvdXJjZShyZXN1bHQuc291cmNlTWFwLCBwYXRoVG9GaWxlVVJMKGZpbGVEYXRhKS5ocmVmKTtcbiAgICAgICAgICAgIHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcyA9IHJlc3VsdC5zb3VyY2VNYXAuc291cmNlcy5tYXAoeCA9PiBwYXRoLnJlbGF0aXZlKGZpbGVEYXRhRGlybmFtZSwgZmlsZVVSTFRvUGF0aCh4KSkgKyAnP3NvdXJjZT10cnVlJyk7XG5cbiAgICAgICAgICAgIGRhdGEgKz0gYFxcclxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5zb3VyY2VNYXApKS50b1N0cmluZyhcImJhc2U2NFwiKX0qL2A7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChpbnB1dFBhdGgsIGdldFR5cGVzLlN0YXRpY1sxXSk7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCBkYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgUHJpbnRTYXNzRXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBkZXBlbmRlbmNlT2JqZWN0XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERpcmVudCB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IEluc2VydCwgQ29tcG9uZW50cywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IENsZWFyV2FybmluZyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3J1xuaW1wb3J0ICogYXMgU2VhcmNoRmlsZVN5c3RlbSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFJlcVNjcmlwdCBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IFN0YXRpY0ZpbGVzIGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tICcuL0NvbXBpbGVTdGF0ZSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSwgcGFnZURlcHMgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVTaXRlTWFwIH0gZnJvbSAnLi9TaXRlTWFwJztcbmltcG9ydCB7IGlzRmlsZVR5cGUsIFJlbW92ZUVuZFR5cGUgfSBmcm9tICcuL0ZpbGVUeXBlcyc7XG5pbXBvcnQgeyBwZXJDb21waWxlLCBwb3N0Q29tcGlsZSwgcGVyQ29tcGlsZVBhZ2UsIHBvc3RDb21waWxlUGFnZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzJztcbmltcG9ydCB7IFBhZ2VUZW1wbGF0ZSB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL1NjcmlwdFRlbXBsYXRlJztcblxuYXN5bmMgZnVuY3Rpb24gY29tcGlsZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgaXNEZWJ1Zz86IGJvb2xlYW4sIGhhc1Nlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZykge1xuICAgIGNvbnN0IEZ1bGxGaWxlUGF0aCA9IHBhdGguam9pbihhcnJheVR5cGVbMF0sIGZpbGVQYXRoKSwgRnVsbFBhdGhDb21waWxlID0gYXJyYXlUeXBlWzFdICsgZmlsZVBhdGggKyAnLmNqcyc7XG5cbiAgICBjb25zdCBodG1sID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKEZ1bGxGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICBjb25zdCBFeGNsdVVybCA9IChuZXN0ZWRQYWdlID8gbmVzdGVkUGFnZSArICc8bGluZT4nIDogJycpICsgYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGg7XG5cbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IGhhc1Nlc3Npb25JbmZvID8/IG5ldyBTZXNzaW9uQnVpbGQoYXJyYXlUeXBlWzJdICsgJy8nICsgZmlsZVBhdGgsIEZ1bGxGaWxlUGF0aCwgYXJyYXlUeXBlWzJdLCBpc0RlYnVnLCBHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikpO1xuICAgIGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoJ3RoaXNQYWdlJywgRnVsbEZpbGVQYXRoKTtcblxuICAgIGF3YWl0IHBlckNvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuICAgIGNvbnN0IENvbXBpbGVkRGF0YSA9IGF3YWl0IEluc2VydChodG1sLCBGdWxsUGF0aENvbXBpbGUsIEJvb2xlYW4obmVzdGVkUGFnZSksIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgYXdhaXQgcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvLCBGdWxsUGF0aENvbXBpbGUpO1xuXG4gICAgaWYgKCFuZXN0ZWRQYWdlKSB7XG4gICAgICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoRnVsbFBhdGhDb21waWxlLCBDb21waWxlZERhdGEuU3RyaW5nV2l0aFRhY2soRnVsbFBhdGhDb21waWxlKSk7XG4gICAgICAgIHBhZ2VEZXBzLnVwZGF0ZShSZW1vdmVFbmRUeXBlKEV4Y2x1VXJsKSwgc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBDb21waWxlZERhdGEsIHNlc3Npb25JbmZvIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgPERpcmVudFtdPmFsbEluRm9sZGVyKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWUsIGNvbm5lY3QgPSBwYXRoICsgbjtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLm1rZGlyKGFycmF5VHlwZVsxXSArIGNvbm5lY3QpO1xuICAgICAgICAgICAgYXdhaXQgRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0ZpbGVUeXBlKFNlYXJjaEZpbGVTeXN0ZW0uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IENoZWNrRGVwZW5kZW5jeUNoYW5nZShhcnJheVR5cGVbMl0gKyAnLycgKyBjb25uZWN0KSkgLy9jaGVjayBpZiBub3QgYWxyZWFkeSBjb21waWxlIGZyb20gYSAnaW4tZmlsZScgY2FsbFxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb21waWxlRmlsZShjb25uZWN0LCBhcnJheVR5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljICYmIGlzRmlsZVR5cGUoU2VhcmNoRmlsZVN5c3RlbS5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyIC0gJyArIGFycmF5VHlwZVsyXSwgY29ubmVjdCwgYXJyYXlUeXBlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZpbGUoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgU3RhdGljRmlsZXMoY29ubmVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBSZXF1aXJlU2NyaXB0cyhzY3JpcHRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBzY3JpcHRzKSB7XG4gICAgICAgIGF3YWl0IFJlcVNjcmlwdCgnUHJvZHVjdGlvbiBMb2FkZXInLCBwYXRoLCBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpYywgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gQ3JlYXRlQ29tcGlsZSh0OiBzdHJpbmcsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB0eXBlcyA9IFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXNbdF07XG4gICAgYXdhaXQgU2VhcmNoRmlsZVN5c3RlbS5EZWxldGVJbkRpcmVjdG9yeSh0eXBlc1sxXSk7XG4gICAgcmV0dXJuICgpID0+IEZpbGVzSW5Gb2xkZXIodHlwZXMsICcnLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogd2hlbiBwYWdlIGNhbGwgb3RoZXIgcGFnZTtcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEZhc3RDb21waWxlSW5GaWxlKHBhdGg6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgc2Vzc2lvbkluZm8/OiBTZXNzaW9uQnVpbGQsIG5lc3RlZFBhZ2U/OiBzdHJpbmcsIG5lc3RlZFBhZ2VEYXRhPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLCBhcnJheVR5cGVbMV0pO1xuICAgIHJldHVybiBhd2FpdCBjb21waWxlRmlsZShwYXRoLCBhcnJheVR5cGUsIHRydWUsIHNlc3Npb25JbmZvLCBuZXN0ZWRQYWdlLCBuZXN0ZWRQYWdlRGF0YSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10pIHtcbiAgICBhd2FpdCBGYXN0Q29tcGlsZUluRmlsZShwYXRoLCBhcnJheVR5cGUpO1xuICAgIENsZWFyV2FybmluZygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUFsbChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzKSB7XG4gICAgbGV0IHN0YXRlID0gIWFyZ3YuaW5jbHVkZXMoJ3JlYnVpbGQnKSAmJiBhd2FpdCBDb21waWxlU3RhdGUuY2hlY2tMb2FkKClcblxuICAgIGlmIChzdGF0ZSkgcmV0dXJuICgpID0+IFJlcXVpcmVTY3JpcHRzKHN0YXRlLnNjcmlwdHMpXG4gICAgcGFnZURlcHMuY2xlYXIoKTtcbiAgICBcbiAgICBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuXG4gICAgcGVyQ29tcGlsZSgpO1xuXG4gICAgY29uc3QgYWN0aXZhdGVBcnJheSA9IFthd2FpdCBDcmVhdGVDb21waWxlKFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuU3RhdGljWzJdLCBzdGF0ZSksIGF3YWl0IENyZWF0ZUNvbXBpbGUoU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5Mb2dzWzJdLCBzdGF0ZSksIENsZWFyV2FybmluZ107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWN0aXZhdGVBcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgaSgpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmV4cG9ydCgpXG4gICAgICAgIHBvc3RDb21waWxlKClcbiAgICB9XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBnZXRTZXR0aW5nc0RhdGUgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL0ltcG9ydE1vZHVsZVwiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBTeXN0ZW1EYXRhIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG50eXBlIENTdGF0ZSA9IHtcbiAgICB1cGRhdGU6IG51bWJlclxuICAgIHBhZ2VBcnJheTogc3RyaW5nW11bXSxcbiAgICBpbXBvcnRBcnJheTogc3RyaW5nW11cbiAgICBmaWxlQXJyYXk6IHN0cmluZ1tdXG59XG5cbi8qIFRoaXMgY2xhc3MgaXMgdXNlZCB0byBzdG9yZSB0aGUgc3RhdGUgb2YgdGhlIHByb2plY3QgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVTdGF0ZSB7XG4gICAgcHJpdmF0ZSBzdGF0ZTogQ1N0YXRlID0geyB1cGRhdGU6IDAsIHBhZ2VBcnJheTogW10sIGltcG9ydEFycmF5OiBbXSwgZmlsZUFycmF5OiBbXSB9XG4gICAgc3RhdGljIGZpbGVQYXRoID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIFwiQ29tcGlsZVN0YXRlLmpzb25cIilcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS51cGRhdGUgPSBnZXRTZXR0aW5nc0RhdGUoKVxuICAgIH1cblxuICAgIGdldCBzY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5pbXBvcnRBcnJheVxuICAgIH1cblxuICAgIGdldCBwYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUucGFnZUFycmF5XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5maWxlQXJyYXlcbiAgICB9XG5cbiAgICBhZGRQYWdlKHBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5wYWdlQXJyYXkuZmluZCh4ID0+IHhbMF0gPT0gcGF0aCAmJiB4WzFdID09IHR5cGUpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wYWdlQXJyYXkucHVzaChbcGF0aCwgdHlwZV0pXG4gICAgfVxuXG4gICAgYWRkSW1wb3J0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW1wb3J0QXJyYXkuaW5jbHVkZXMocGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmltcG9ydEFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBhZGRGaWxlKHBhdGg6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZmlsZUFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWxlQXJyYXkucHVzaChwYXRoKVxuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIEVhc3lGcy53cml0ZUpzb25GaWxlKENvbXBpbGVTdGF0ZS5maWxlUGF0aCwgdGhpcy5zdGF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tMb2FkKCkge1xuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMuZmlsZVBhdGgpKSByZXR1cm5cblxuICAgICAgICBjb25zdCBzdGF0ZSA9IG5ldyBDb21waWxlU3RhdGUoKVxuICAgICAgICBzdGF0ZS5zdGF0ZSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5maWxlUGF0aClcblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICE9IGdldFNldHRpbmdzRGF0ZSgpKSByZXR1cm5cblxuICAgICAgICByZXR1cm4gc3RhdGVcbiAgICB9XG59IiwgImltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEltcG9ydEZpbGUsIHtBZGRFeHRlbnNpb24sIFJlcXVpcmVPbmNlfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFN0YXJ0UmVxdWlyZShhcnJheTogc3RyaW5nW10sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBhcnJheUZ1bmNTZXJ2ZXIgPSBbXTtcbiAgICBmb3IgKGxldCBpIG9mIGFycmF5KSB7XG4gICAgICAgIGkgPSBBZGRFeHRlbnNpb24oaSk7XG5cbiAgICAgICAgY29uc3QgYiA9IGF3YWl0IEltcG9ydEZpbGUoJ3Jvb3QgZm9sZGVyIChXV1cpJywgaSwgZ2V0VHlwZXMuU3RhdGljLCBpc0RlYnVnKTtcbiAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIuU3RhcnRTZXJ2ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJyYXlGdW5jU2VydmVyLnB1c2goYi5TdGFydFNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmludC5sb2coYENhbid0IGZpbmQgU3RhcnRTZXJ2ZXIgZnVuY3Rpb24gYXQgbW9kdWxlIC0gJHtpfVxcbmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RnVuY1NlcnZlcjtcbn1cblxubGV0IGxhc3RTZXR0aW5nc0ltcG9ydDogbnVtYmVyO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdldFNldHRpbmdzKGZpbGVQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pe1xuICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoICsgJy50cycpKXtcbiAgICAgICAgZmlsZVBhdGggKz0gJy50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggKz0gJy5qcydcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlVGltZSA9IDxhbnk+YXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbClcblxuICAgIGlmKGNoYW5nZVRpbWUgPT0gbGFzdFNldHRpbmdzSW1wb3J0IHx8ICFjaGFuZ2VUaW1lKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsYXN0U2V0dGluZ3NJbXBvcnQgPSBjaGFuZ2VUaW1lO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBSZXF1aXJlT25jZShmaWxlUGF0aCwgaXNEZWJ1Zyk7XG4gICAgcmV0dXJuIGRhdGEuZGVmYXVsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmdzRGF0ZSgpe1xuICAgIHJldHVybiBsYXN0U2V0dGluZ3NJbXBvcnRcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEltcG9ydEZpbGUgfSBmcm9tIFwiLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gXCIuLi9NYWluQnVpbGQvU2V0dGluZ3NUeXBlc1wiO1xuaW1wb3J0IEVhc3lGcywgeyBEaXJlbnQgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgQ29tcGlsZVN0YXRlIGZyb20gXCIuL0NvbXBpbGVTdGF0ZVwiO1xuaW1wb3J0IHsgaXNGaWxlVHlwZSB9IGZyb20gXCIuL0ZpbGVUeXBlc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tIFwiLi9TZWFyY2hGaWxlU3lzdGVtXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlOiBzdHJpbmdbXSwgcGF0aDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihhcnJheVR5cGVbMF0gKyBwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9W107XG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goRmlsZXNJbkZvbGRlcihhcnJheVR5cGUsIGNvbm5lY3QgKyAnLycsIHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZFBhZ2UoY29ubmVjdCwgYXJyYXlUeXBlWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09IGdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkSW1wb3J0KGNvbm5lY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2NhbkZpbGVzKCl7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBGaWxlc0luRm9sZGVyKGdldFR5cGVzLlN0YXRpYywgJycsIHN0YXRlKSxcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5Mb2dzLCAnJywgc3RhdGUpXG4gICAgXSlcbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWJ1Z1NpdGVNYXAoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyl7XG4gICAgcmV0dXJuIGNyZWF0ZVNpdGVNYXAoRXhwb3J0LCBhd2FpdCBzY2FuRmlsZXMoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3MsIHN0YXRlOiBDb21waWxlU3RhdGUpIHtcbiAgICBjb25zdCB7IHJvdXRpbmcsIGRldmVsb3BtZW50IH0gPSBFeHBvcnQ7XG4gICAgaWYgKCFyb3V0aW5nLnNpdGVtYXApIHJldHVybjtcblxuICAgIGNvbnN0IHNpdGVtYXAgPSByb3V0aW5nLnNpdGVtYXAgPT09IHRydWUgPyB7fSA6IHJvdXRpbmcuc2l0ZW1hcDtcbiAgICBPYmplY3QuYXNzaWduKHNpdGVtYXAsIHtcbiAgICAgICAgcnVsZXM6IHRydWUsXG4gICAgICAgIHVybFN0b3A6IGZhbHNlLFxuICAgICAgICBlcnJvclBhZ2VzOiBmYWxzZSxcbiAgICAgICAgdmFsaWRQYXRoOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWdlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHVybHM6IC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIFxuICAgIGZvciAobGV0IFt1cmwsIHR5cGVdIG9mIHN0YXRlLnBhZ2VzKSB7XG5cbiAgICAgICAgaWYodHlwZSAhPSBnZXRUeXBlcy5TdGF0aWNbMl0gfHwgIXVybC5lbmRzV2l0aCgnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHVybCA9ICcvJyArIHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgaWYocGF0aC5leHRuYW1lKHVybCkgPT0gJy5zZXJ2JylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnVybFN0b3ApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnVybFN0b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gcGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2l0ZW1hcC5ydWxlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoIGluIHJvdXRpbmcucnVsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXdhaXQgcm91dGluZy5ydWxlc1twYXRoXSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICByb3V0aW5nLmlnbm9yZVR5cGVzLmZpbmQoZW5kcyA9PiB1cmwuZW5kc1dpdGgoJy4nK2VuZHMpKSB8fFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVQYXRocy5maW5kKHN0YXJ0ID0+IHVybC5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpdGVtYXAudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2Ygcm91dGluZy52YWxpZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWF3YWl0IGZ1bmModXJsKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2l0ZW1hcC5lcnJvclBhZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVycm9yIGluIHJvdXRpbmcuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSAnLycgKyByb3V0aW5nLmVycm9yUGFnZXNbZXJyb3JdLnBhdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgdXJscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFnZXMucHVzaCh1cmwpO1xuICAgIH1cblxuICAgIGxldCB3cml0ZSA9IHRydWU7XG4gICAgaWYgKHNpdGVtYXAuZmlsZSkge1xuICAgICAgICBjb25zdCBmaWxlQWN0aW9uID0gYXdhaXQgSW1wb3J0RmlsZSgnU2l0ZW1hcCBJbXBvcnQnLCBzaXRlbWFwLmZpbGUsIGdldFR5cGVzLlN0YXRpYywgZGV2ZWxvcG1lbnQpO1xuICAgICAgICBpZighZmlsZUFjdGlvbj8uU2l0ZW1hcCl7XG4gICAgICAgICAgICBkdW1wLndhcm4oJ1xcJ1NpdGVtYXBcXCcgZnVuY3Rpb24gbm90IGZvdW5kIG9uIGZpbGUgLT4gJysgc2l0ZW1hcC5maWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdyaXRlID0gYXdhaXQgZmlsZUFjdGlvbi5TaXRlbWFwKHBhZ2VzLCBzdGF0ZSwgRXhwb3J0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKHdyaXRlICYmIHBhZ2VzLmxlbmd0aCl7XG4gICAgICAgIGNvbnN0IHBhdGggPSB3cml0ZSA9PT0gdHJ1ZSA/ICdzaXRlbWFwLnR4dCc6IHdyaXRlO1xuICAgICAgICBzdGF0ZS5hZGRGaWxlKHBhdGgpO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGdldFR5cGVzLlN0YXRpY1swXSArIHBhdGgsIHBhZ2VzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG59IiwgIi8qKlxuICogQ2hlY2sgaWYgdGhlIGZpbGUgbmFtZSBlbmRzIHdpdGggb25lIG9mIHRoZSBnaXZlbiBmaWxlIHR5cGVzLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXMgLSBhbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaWxlVHlwZSh0eXBlczogc3RyaW5nW10sIG5hbWU6IHN0cmluZykge1xuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoJy4nICsgdHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxhc3QgZG90IGFuZCBldmVyeXRoaW5nIGFmdGVyIGl0IGZyb20gYSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHJlbW92ZSB0aGUgZW5kIHR5cGUgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aG91dCB0aGUgbGFzdCBjaGFyYWN0ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZW1vdmVFbmRUeXBlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEZhc3RDb21waWxlIH0gZnJvbSAnLi9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB7IEZpbGVzIH0gZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgeyBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IEltcG9ydFdpdGhvdXRDYWNoZSBmcm9tICcuLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IFJlcXVpcmVGaWxlIGZyb20gJy4vSW1wb3J0RmlsZVJ1bnRpbWUnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IENoZWNrRGVwZW5kZW5jeUNoYW5nZSB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5cbmNvbnN0IEV4cG9ydCA9IHtcbiAgICBQYWdlTG9hZFJhbToge30sXG4gICAgUGFnZVJhbTogdHJ1ZVxufVxuXG4vKipcbiAqIEl0IGxvYWRzIGEgcGFnZSBhbmQgcmV0dXJucyB0aGUgbW9kZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gVGhlIHR5cGVBcnJheSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGggdG8gdGhlXG4gKiBmaWxlLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBkaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWlyZWQgc28gZmFyLlxuICogQHBhcmFtIHthbnl9IERhdGFPYmplY3QgLSBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcGFnZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVBhZ2UoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIERhdGFPYmplY3Q6IGFueSkge1xuICAgIGNvbnN0IFJlcUZpbGVQYXRoID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuICAgIGNvbnN0IHJlc01vZGVsID0gKCkgPT4gUmVxRmlsZVBhdGgubW9kZWwoRGF0YU9iamVjdCk7XG5cbiAgICBsZXQgZmlsZUV4aXN0czogYm9vbGVhbjtcblxuICAgIGlmIChSZXFGaWxlUGF0aCkge1xuICAgICAgICBpZiAoIURhdGFPYmplY3QuaXNEZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiByZXNNb2RlbCgpO1xuXG4gICAgICAgIGlmIChSZXFGaWxlUGF0aC5kYXRlID09IC0xKSB7XG4gICAgICAgICAgICBmaWxlRXhpc3RzID0gYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoUmVxRmlsZVBhdGgucGF0aCk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUV4aXN0cylcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYgKCFleHRuYW1lKSB7XG4gICAgICAgIGV4dG5hbWUgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlO1xuICAgICAgICBmaWxlUGF0aCArPSAnLicgKyBleHRuYW1lO1xuICAgIH1cblxuICAgIGxldCBmdWxsUGF0aDogc3RyaW5nO1xuICAgIGlmIChmaWxlUGF0aFswXSA9PSAnLicpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzFdID09ICcvJylcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGVQYXRoKVxuICAgIH0gZWxzZVxuICAgICAgICBmdWxsUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMF0sIGZpbGVQYXRoKTtcblxuICAgIGlmICghW0Jhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLmNvbXBvbmVudF0uaW5jbHVkZXMoZXh0bmFtZSkpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0VGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIERhdGFPYmplY3Qud3JpdGUoaW1wb3J0VGV4dCk7XG4gICAgICAgIHJldHVybiBpbXBvcnRUZXh0O1xuICAgIH1cblxuICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKTtcbiAgICBpZiAoIWZpbGVFeGlzdHMpIHtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICB0ZXh0OiBgSW1wb3J0ICcke2NvcHlQYXRofScgZG9lcyBub3QgZXhpc3RzIGZyb20gJyR7X19maWxlbmFtZX0nYFxuICAgICAgICB9KVxuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiAoKSA9PiB7IH0sIGRhdGU6IC0xLCBwYXRoOiBmdWxsUGF0aCB9O1xuICAgICAgICByZXR1cm4gTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IEZvclNhdmVQYXRoID0gdHlwZUFycmF5WzJdICsgJy8nICsgZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIGV4dG5hbWUubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgcmVCdWlsZCA9IERhdGFPYmplY3QuaXNEZWJ1ZyAmJiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHR5cGVBcnJheVsxXSArIGZpbGVQYXRoICsgJy5janMnKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoRm9yU2F2ZVBhdGgpKTtcblxuICAgIGlmIChyZUJ1aWxkKVxuICAgICAgICBhd2FpdCBGYXN0Q29tcGlsZShmaWxlUGF0aCwgdHlwZUFycmF5KTtcblxuXG4gICAgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0gJiYgIXJlQnVpbGQpIHtcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogRXhwb3J0LlBhZ2VMb2FkUmFtW0ZvclNhdmVQYXRoXVswXSB9O1xuICAgICAgICByZXR1cm4gYXdhaXQgTGFzdFJlcXVpcmVbY29weVBhdGhdLm1vZGVsKERhdGFPYmplY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bmMgPSBhd2FpdCBMb2FkUGFnZShGb3JTYXZlUGF0aCwgZXh0bmFtZSk7XG4gICAgaWYgKEV4cG9ydC5QYWdlUmFtKSB7XG4gICAgICAgIGlmICghRXhwb3J0LlBhZ2VMb2FkUmFtW0ZvclNhdmVQYXRoXSkge1xuICAgICAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW0ZvclNhdmVQYXRoXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF1bMF0gPSBmdW5jO1xuICAgIH1cblxuICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IGZ1bmMgfTtcbiAgICByZXR1cm4gYXdhaXQgZnVuYyhEYXRhT2JqZWN0KTtcbn1cblxuY29uc3QgR2xvYmFsVmFyID0ge307XG5cbmZ1bmN0aW9uIGdldEZ1bGxQYXRoQ29tcGlsZSh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IFNwbGl0SW5mbyA9IFNwbGl0Rmlyc3QoJy8nLCB1cmwpO1xuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgcmV0dXJuIHR5cGVBcnJheVsxXSArIFNwbGl0SW5mb1sxXSArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSArICcuY2pzJztcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgcGFnZSB0byBsb2FkLlxuICogQHBhcmFtIGV4dCAtIFRoZSBleHRlbnNpb24gb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2UodXJsOiBzdHJpbmcsIGV4dCA9IEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcblxuICAgIGNvbnN0IHR5cGVBcnJheSA9IGdldFR5cGVzW1NwbGl0SW5mb1swXV07XG4gICAgY29uc3QgTGFzdFJlcXVpcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIF9yZXF1aXJlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBSZXF1aXJlRmlsZShwLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHR5cGVBcnJheSwgTGFzdFJlcXVpcmUsIERhdGFPYmplY3QuaXNEZWJ1Zyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luY2x1ZGUoX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgRGF0YU9iamVjdDogYW55LCBwOiBzdHJpbmcsIFdpdGhPYmplY3QgPSB7fSkge1xuICAgICAgICByZXR1cm4gUmVxdWlyZVBhZ2UocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCB7IC4uLldpdGhPYmplY3QsIC4uLkRhdGFPYmplY3QgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3RyYW5zZmVyKHA6IHN0cmluZywgcHJlc2VydmVGb3JtOiBib29sZWFuLCB3aXRoT2JqZWN0OiBhbnksIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSkge1xuICAgICAgICBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgPSAnJztcblxuICAgICAgICBpZiAoIXByZXNlcnZlRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgcG9zdERhdGEgPSBEYXRhT2JqZWN0LlJlcXVlc3QuYm9keSA/IHt9IDogbnVsbDtcbiAgICAgICAgICAgIERhdGFPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgLi4uRGF0YU9iamVjdCxcbiAgICAgICAgICAgICAgICBSZXF1ZXN0OiB7IC4uLkRhdGFPYmplY3QuUmVxdWVzdCwgZmlsZXM6IHt9LCBxdWVyeToge30sIGJvZHk6IHBvc3REYXRhIH0sXG4gICAgICAgICAgICAgICAgUG9zdDogcG9zdERhdGEsIFF1ZXJ5OiB7fSwgRmlsZXM6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBEYXRhT2JqZWN0LCBwLCB3aXRoT2JqZWN0KTtcblxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMV0sIFNwbGl0SW5mb1sxXSArIFwiLlwiICsgZXh0ICsgJy5janMnKTtcbiAgICBjb25zdCBwcml2YXRlX3ZhciA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUoY29tcGlsZWRQYXRoKTtcblxuICAgICAgICByZXR1cm4gTXlNb2R1bGUoX3JlcXVpcmUsIF9pbmNsdWRlLCBfdHJhbnNmZXIsIHByaXZhdGVfdmFyLCBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnN0IGRlYnVnX19maWxlbmFtZSA9IHVybCArIFwiLlwiICsgZXh0O1xuICAgICAgICBwcmludC5lcnJvcihcIkVycm9yIHBhdGggLT4gXCIsIGRlYnVnX19maWxlbmFtZSwgXCItPlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICBwcmludC5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgcmV0dXJuIChEYXRhT2JqZWN0OiBhbnkpID0+IERhdGFPYmplY3Qub3V0X3J1bl9zY3JpcHQudGV4dCArPSBgPGRpdiBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+PHA+RXJyb3IgcGF0aDogJHtkZWJ1Z19fZmlsZW5hbWV9PC9wPjxwPkVycm9yIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfTwvcD48L2Rpdj5gO1xuICAgIH1cbn1cbi8qKlxuICogSXQgdGFrZXMgYSBmdW5jdGlvbiB0aGF0IHByZXBhcmUgYSBwYWdlLCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgbG9hZHMgYSBwYWdlXG4gKiBAcGFyYW0gTG9hZFBhZ2VGdW5jIC0gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGluIGEgcGFnZSB0byBleGVjdXRlIG9uXG4gKiBAcGFyYW0ge3N0cmluZ30gcnVuX3NjcmlwdF9uYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjcmlwdCB0byBydW4uXG4gKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKi9cblxuZnVuY3Rpb24gQnVpbGRQYWdlKExvYWRQYWdlRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiB2b2lkLCBydW5fc2NyaXB0X25hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IFBhZ2VWYXIgPSB7fTtcblxuICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24gKFJlc3BvbnNlOiBSZXNwb25zZSwgUmVxdWVzdDogUmVxdWVzdCwgUG9zdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IG51bGwsIFF1ZXJ5OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBDb29raWVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBTZXNzaW9uOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBGaWxlczogRmlsZXMsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgb3V0X3J1bl9zY3JpcHQgPSB7IHRleHQ6ICcnIH07XG5cbiAgICAgICAgZnVuY3Rpb24gVG9TdHJpbmdJbmZvKHN0cjogYW55KSB7XG4gICAgICAgICAgICBjb25zdCBhc1N0cmluZyA9IHN0cj8udG9TdHJpbmc/LigpO1xuICAgICAgICAgICAgaWYgKGFzU3RyaW5nID09IG51bGwgfHwgYXNTdHJpbmcuc3RhcnRzV2l0aCgnW29iamVjdCBPYmplY3RdJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RyLCBudWxsLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhc1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJlc3BvbnNlKHRleHQ6IGFueSkge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCA9IFRvU3RyaW5nSW5mbyh0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQgPSAnJykge1xuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gd3JpdGVTYWZlKHN0ciA9ICcnKSB7XG4gICAgICAgICAgICBzdHIgPSBUb1N0cmluZ0luZm8oc3RyKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIHN0cikge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyYjJyArIGkuY2hhckNvZGVBdCgwKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVjaG8oYXJyOiBzdHJpbmdbXSwgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIHdyaXRlU2FmZShwYXJhbXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFyci5hdCgtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVkaXJlY3RQYXRoOiBhbnkgPSBmYWxzZTtcblxuICAgICAgICBSZXNwb25zZS5yZWRpcmVjdCA9IChwYXRoOiBzdHJpbmcsIHN0YXR1cz86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmVkaXJlY3RQYXRoID0gU3RyaW5nKHBhdGgpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVzcG9uc2Uuc3RhdHVzKHN0YXR1cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBSZXNwb25zZTtcbiAgICAgICAgfTtcblxuICAgICAgICAoPGFueT5SZXNwb25zZSkucmVsb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QoUmVxdWVzdC51cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VuZEZpbGUoZmlsZVBhdGgsIGRlbGV0ZUFmdGVyID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IHsgZmlsZTogZmlsZVBhdGgsIGRlbGV0ZUFmdGVyIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBEYXRhU2VuZCA9IHtcbiAgICAgICAgICAgIHNlbmRGaWxlLFxuICAgICAgICAgICAgd3JpdGVTYWZlLFxuICAgICAgICAgICAgd3JpdGUsXG4gICAgICAgICAgICBlY2hvLFxuICAgICAgICAgICAgc2V0UmVzcG9uc2UsXG4gICAgICAgICAgICBvdXRfcnVuX3NjcmlwdCxcbiAgICAgICAgICAgIHJ1bl9zY3JpcHRfbmFtZSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFBvc3QsXG4gICAgICAgICAgICBRdWVyeSxcbiAgICAgICAgICAgIFNlc3Npb24sXG4gICAgICAgICAgICBGaWxlcyxcbiAgICAgICAgICAgIENvb2tpZXMsXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgUGFnZVZhcixcbiAgICAgICAgICAgIEdsb2JhbFZhcixcbiAgICAgICAgICAgIGNvZGViYXNlOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgTG9hZFBhZ2VGdW5jKERhdGFTZW5kKTtcblxuICAgICAgICByZXR1cm4geyBvdXRfcnVuX3NjcmlwdDogb3V0X3J1bl9zY3JpcHQudGV4dCwgcmVkaXJlY3RQYXRoIH1cbiAgICB9KVxufVxuXG5leHBvcnQgeyBMb2FkUGFnZSwgQnVpbGRQYWdlLCBnZXRGdWxsUGF0aENvbXBpbGUsIEV4cG9ydCwgU3BsaXRGaXJzdCB9OyIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBJbXBvcnRGaWxlLCBBZGRFeHRlbnNpb24gfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQWxpYXNPclBhY2thZ2UgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMnO1xuXG50eXBlIFJlcXVpcmVGaWxlcyA9IHtcbiAgICBwYXRoOiBzdHJpbmdcbiAgICBzdGF0dXM/OiBudW1iZXJcbiAgICBtb2RlbDogYW55XG4gICAgZGVwZW5kZW5jaWVzPzogU3RyaW5nQW55TWFwXG4gICAgc3RhdGljPzogYm9vbGVhblxufVxuXG5jb25zdCBDYWNoZVJlcXVpcmVGaWxlcyA9IHt9O1xuXG4vKipcbiAqIEl0IG1ha2VzIGEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBkZXBlbmRlbmNpZXMgLSBUaGUgb2xkIGRlcGVuZGVuY2llcyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSBhcnJheSBvZiBiYXNlIHBhdGhzXG4gKiBAcGFyYW0gW2Jhc2VQYXRoXSAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgY29tcGlsZWQuXG4gKiBAcGFyYW0gY2FjaGUgLSBBIGNhY2hlIG9mIHRoZSBsYXN0IHRpbWUgYSBmaWxlIHdhcyBtb2RpZmllZC5cbiAqIEByZXR1cm5zIEEgbWFwIG9mIGRlcGVuZGVuY2llcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZURlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IFN0cmluZ0FueU1hcCwgdHlwZUFycmF5OiBzdHJpbmdbXSwgYmFzZVBhdGggPSAnJywgY2FjaGUgPSB7fSkge1xuICAgIGNvbnN0IGRlcGVuZGVuY2llc01hcDogU3RyaW5nQW55TWFwID0ge307XG4gICAgY29uc3QgcHJvbWlzZUFsbCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ZpbGVQYXRoLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBwcm9taXNlQWxsLnB1c2goKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aCA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWNoZVtiYXNlUGF0aF0pXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2Jhc2VQYXRoXSA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIGJhc2VQYXRoLCAnbXRpbWVNcycsIHRydWUpO1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFsndGhpc0ZpbGUnXSA9IGNhY2hlW2Jhc2VQYXRoXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzTWFwW2ZpbGVQYXRoXSA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoPGFueT52YWx1ZSwgdHlwZUFycmF5LCBmaWxlUGF0aCwgY2FjaGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICkoKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZUFsbCk7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llc01hcDtcbn1cblxuLyoqXG4gKiBJZiB0aGUgb2xkIGRlcGVuZGVuY2llcyBhbmQgdGhlIG5ldyBkZXBlbmRlbmNpZXMgYXJlIHRoZSBzYW1lLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG9sZERlcHMgLSBUaGUgb2xkIGRlcGVuZGVuY3kgbWFwLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZS5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwczogU3RyaW5nQW55TWFwLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXApIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2xkRGVwcykge1xuICAgICAgICBpZiAobmFtZSA9PSAndGhpc0ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAobmV3RGVwc1tuYW1lXSAhPSBvbGREZXBzW25hbWVdKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghY29tcGFyZURlcGVuZGVuY2llc1NhbWUob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGRlcGVuZGVuY3kgdHJlZXMsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbmFtZXMgb2YgdGhlIG1vZHVsZXMgdGhhdCBoYXZlIGNoYW5nZWRcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gbmV3RGVwcyAtIFRoZSBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIFtwYXJlbnRdIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmVudCBtb2R1bGUuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MuIEVhY2ggc3RyaW5nIHJlcHJlc2VudHMgYSBjaGFuZ2UgaW4gdGhlIGRlcGVuZGVuY3lcbiAqIHRyZWUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYW5nZUFycmF5KG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwLCBwYXJlbnQgPSAnJyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBjaGFuZ2VBcnJheSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghbmV3RGVwc1tuYW1lXSkge1xuICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaChuYW1lKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlID0gZ2V0Q2hhbmdlQXJyYXkob2xkRGVwc1tuYW1lXSwgbmV3RGVwc1tuYW1lXSwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKC4uLmNoYW5nZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlQXJyYXk7XG59XG5cbi8qKlxuICogSXQgaW1wb3J0cyBhIGZpbGUgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19maWxlbmFtZSAtIFRoZSBmaWxlbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfX2Rpcm5hbWUgLSBUaGUgZGlyZWN0b3J5IG9mIHRoZSBmaWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZUFycmF5IC0gcGF0aHMgdHlwZXMuXG4gKiBAcGFyYW0gTGFzdFJlcXVpcmUgLSBBIG1hcCBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW5cbiAqIEByZXR1cm5zIFRoZSBtb2RlbCB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBMYXN0UmVxdWlyZTogeyBba2V5OiBzdHJpbmddOiBSZXF1aXJlRmlsZXMgfSwgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IFJlcUZpbGUgPSBMYXN0UmVxdWlyZVtmaWxlUGF0aF07XG5cbiAgICBsZXQgZmlsZUV4aXN0czogbnVtYmVyLCBuZXdEZXBzOiBTdHJpbmdBbnlNYXA7XG4gICAgaWYgKFJlcUZpbGUpIHtcblxuICAgICAgICBpZiAoIWlzRGVidWcgfHwgaXNEZWJ1ZyAmJiAoUmVxRmlsZS5zdGF0dXMgPT0gLTEpKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5zdGF0KHR5cGVBcnJheVswXSArIFJlcUZpbGUucGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcbiAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcblxuICAgICAgICAgICAgbmV3RGVwcyA9IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSk7XG5cbiAgICAgICAgICAgIGlmIChjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShSZXFGaWxlLmRlcGVuZGVuY2llcywgbmV3RGVwcykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG5cbiAgICAgICAgfSBlbHNlIGlmIChSZXFGaWxlLnN0YXR1cyA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIFJlcUZpbGUubW9kZWw7XG4gICAgfVxuXG4gICAgY29uc3QgY29weVBhdGggPSBmaWxlUGF0aDtcbiAgICBsZXQgc3RhdGljX21vZHVsZXMgPSBmYWxzZTtcblxuICAgIGlmICghUmVxRmlsZSkge1xuICAgICAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKSB7XG5cbiAgICAgICAgICAgIGlmIChmaWxlUGF0aFsxXSA9PSAnLycpXG4gICAgICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMik7XG5cbiAgICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHBhdGgucmVsYXRpdmUodHlwZUFycmF5WzBdLCBfX2Rpcm5hbWUpLCBmaWxlUGF0aCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmlsZVBhdGhbMF0gIT0gJy8nKVxuICAgICAgICAgICAgc3RhdGljX21vZHVsZXMgPSB0cnVlO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDEpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZVBhdGggPSBSZXFGaWxlLnBhdGg7XG4gICAgICAgIHN0YXRpY19tb2R1bGVzID0gUmVxRmlsZS5zdGF0aWM7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRpY19tb2R1bGVzKVxuICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBhd2FpdCBBbGlhc09yUGFja2FnZShjb3B5UGF0aCksIHN0YXR1czogLTEsIHN0YXRpYzogdHJ1ZSwgcGF0aDogZmlsZVBhdGggfTtcbiAgICBlbHNlIHtcbiAgICAgICAgLy8gYWRkIHNlcnYuanMgb3Igc2Vydi50cyBpZiBuZWVkZWRcbiAgICAgICAgZmlsZVBhdGggPSBBZGRFeHRlbnNpb24oZmlsZVBhdGgpO1xuXG4gICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gdHlwZUFycmF5WzBdICsgZmlsZVBhdGg7XG4gICAgICAgIGZpbGVFeGlzdHMgPSBmaWxlRXhpc3RzID8/IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIDApO1xuXG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBoYXZlTW9kZWwgPSBDYWNoZVJlcXVpcmVGaWxlc1tmaWxlUGF0aF07XG4gICAgICAgICAgICBpZiAoaGF2ZU1vZGVsICYmIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIG5ld0RlcHMgPSBuZXdEZXBzID8/IGF3YWl0IG1ha2VEZXBlbmRlbmNpZXMoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgdHlwZUFycmF5KSkpXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0gaGF2ZU1vZGVsO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3RGVwcyA9IG5ld0RlcHMgPz8ge307XG5cbiAgICAgICAgICAgICAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBhd2FpdCBJbXBvcnRGaWxlKF9fZmlsZW5hbWUsIGZpbGVQYXRoLCB0eXBlQXJyYXksIGlzRGVidWcsIG5ld0RlcHMsIGhhdmVNb2RlbCAmJiBnZXRDaGFuZ2VBcnJheShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzKSksIGRlcGVuZGVuY2llczogbmV3RGVwcywgcGF0aDogZmlsZVBhdGggfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDoge30sIHN0YXR1czogMCwgcGF0aDogZmlsZVBhdGggfTtcbiAgICAgICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdpbXBvcnQtbm90LWV4aXN0cycsXG4gICAgICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtmaWxlUGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBidWlsdE1vZGVsID0gTGFzdFJlcXVpcmVbY29weVBhdGhdO1xuICAgIENhY2hlUmVxdWlyZUZpbGVzW2J1aWx0TW9kZWwucGF0aF0gPSBidWlsdE1vZGVsO1xuXG4gICAgcmV0dXJuIGJ1aWx0TW9kZWwubW9kZWw7XG59IiwgImltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IEN1dFRoZUxhc3QsIHRyaW1UeXBlLCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuXG4vLyAtLSBzdGFydCBvZiBmZXRjaCBmaWxlICsgY2FjaGUgLS1cblxudHlwZSBhcGlJbmZvID0ge1xuICAgIHBhdGhTcGxpdDogbnVtYmVyLFxuICAgIGRlcHNNYXA6IHsgW2tleTogc3RyaW5nXTogYW55IH1cbn1cblxuY29uc3QgYXBpU3RhdGljTWFwOiB7IFtrZXk6IHN0cmluZ106IGFwaUluZm8gfSA9IHt9O1xuXG4vKipcbiAqIEdpdmVuIGEgdXJsLCByZXR1cm4gdGhlIHN0YXRpYyBwYXRoIGFuZCBkYXRhIGluZm8gaWYgdGhlIHVybCBpcyBpbiB0aGUgc3RhdGljIG1hcFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB0aGUgdXNlciBpcyByZXF1ZXN0aW5nLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhdGhTcGxpdCAtIHRoZSBudW1iZXIgb2Ygc2xhc2hlcyBpbiB0aGUgdXJsLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAqL1xuZnVuY3Rpb24gZ2V0QXBpRnJvbU1hcCh1cmw6IHN0cmluZywgcGF0aFNwbGl0OiBudW1iZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXBpU3RhdGljTWFwKTtcbiAgICBmb3IgKGNvbnN0IGkgb2Yga2V5cykge1xuICAgICAgICBjb25zdCBlID0gYXBpU3RhdGljTWFwW2ldO1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoaSkgJiYgZS5wYXRoU3BsaXQgPT0gcGF0aFNwbGl0KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNQYXRoOiBpLFxuICAgICAgICAgICAgICAgIGRhdGFJbmZvOiBlXG4gICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBBUEkgZmlsZSBmb3IgYSBnaXZlbiBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBBUEkuXG4gKiBAcmV0dXJucyBUaGUgcGF0aCB0byB0aGUgQVBJIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZpbmRBcGlQYXRoKHVybDogc3RyaW5nKSB7XG5cbiAgICB3aGlsZSAodXJsLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzdGFydFBhdGggPSBwYXRoLmpvaW4oZ2V0VHlwZXMuU3RhdGljWzBdLCB1cmwgKyAnLmFwaScpO1xuICAgICAgICBjb25zdCBtYWtlUHJvbWlzZSA9IGFzeW5jICh0eXBlOiBzdHJpbmcpID0+IChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShzdGFydFBhdGggKyAnLicgKyB0eXBlKSAmJiB0eXBlKTtcblxuICAgICAgICBjb25zdCBmaWxlVHlwZSA9IChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgndHMnKSxcbiAgICAgICAgICAgIG1ha2VQcm9taXNlKCdqcycpXG4gICAgICAgIF0pKS5maWx0ZXIoeCA9PiB4KS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChmaWxlVHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1cmwgKyAnLmFwaS4nICsgZmlsZVR5cGU7XG5cbiAgICAgICAgdXJsID0gQ3V0VGhlTGFzdCgnLycsIHVybCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIG5leHRQcmFzZTogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aFNwbGl0ID0gdXJsLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgIGxldCB7IHN0YXRpY1BhdGgsIGRhdGFJbmZvIH0gPSBnZXRBcGlGcm9tTWFwKHVybCwgcGF0aFNwbGl0KTtcblxuICAgIGlmICghZGF0YUluZm8pIHtcbiAgICAgICAgc3RhdGljUGF0aCA9IGF3YWl0IGZpbmRBcGlQYXRoKHVybCk7XG5cbiAgICAgICAgaWYgKHN0YXRpY1BhdGgpIHtcbiAgICAgICAgICAgIGRhdGFJbmZvID0ge1xuICAgICAgICAgICAgICAgIHBhdGhTcGxpdCxcbiAgICAgICAgICAgICAgICBkZXBzTWFwOiB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcGlTdGF0aWNNYXBbc3RhdGljUGF0aF0gPSBkYXRhSW5mbztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhSW5mbykge1xuICAgICAgICByZXR1cm4gYXdhaXQgTWFrZUNhbGwoXG4gICAgICAgICAgICBhd2FpdCBSZXF1aXJlRmlsZSgnLycgKyBzdGF0aWNQYXRoLCAnYXBpLWNhbGwnLCAnJywgZ2V0VHlwZXMuU3RhdGljLCBkYXRhSW5mby5kZXBzTWFwLCBpc0RlYnVnKSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIHVybC5zdWJzdHJpbmcoc3RhdGljUGF0aC5sZW5ndGggLSA2KSxcbiAgICAgICAgICAgIGlzRGVidWcsXG4gICAgICAgICAgICBuZXh0UHJhc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4vLyAtLSBlbmQgb2YgZmV0Y2ggZmlsZSAtLVxuY29uc3QgYmFuV29yZHMgPSBbJ3ZhbGlkYXRlVVJMJywgJ3ZhbGlkYXRlRnVuYycsICdmdW5jJywgJ2RlZmluZScsIC4uLmh0dHAuTUVUSE9EU107XG4vKipcbiAqIEZpbmQgdGhlIEJlc3QgUGF0aFxuICovXG5mdW5jdGlvbiBmaW5kQmVzdFVybE9iamVjdChvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nKSB7XG4gICAgbGV0IG1heExlbmd0aCA9IDAsIHVybCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBpLmxlbmd0aDtcbiAgICAgICAgaWYgKG1heExlbmd0aCA8IGxlbmd0aCAmJiB1cmxGcm9tLnN0YXJ0c1dpdGgoaSkgJiYgIWJhbldvcmRzLmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBsZW5ndGg7XG4gICAgICAgICAgICB1cmwgPSBpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBQYXJzZSBBbmQgVmFsaWRhdGUgVVJMXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlVVJMRGF0YSh2YWxpZGF0ZTogYW55LCB2YWx1ZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBsZXQgcHVzaERhdGEgPSB2YWx1ZSwgcmVzRGF0YSA9IHRydWUsIGVycm9yOiBzdHJpbmc7XG5cbiAgICBzd2l0Y2ggKHZhbGlkYXRlKSB7XG4gICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICBjYXNlIHBhcnNlRmxvYXQ6XG4gICAgICAgIGNhc2UgcGFyc2VJbnQ6XG4gICAgICAgICAgICBwdXNoRGF0YSA9ICg8YW55PnZhbGlkYXRlKSh2YWx1ZSk7XG4gICAgICAgICAgICByZXNEYXRhID0gIWlzTmFOKHB1c2hEYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICBwdXNoRGF0YSA9IHZhbHVlICE9ICdmYWxzZSc7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXNEYXRhID0gdmFsdWUgPT0gJ3RydWUnIHx8IHZhbHVlID09ICdmYWxzZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdGUpKVxuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSB2YWxpZGF0ZS5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ha2VWYWxpZCA9IGF3YWl0IHZhbGlkYXRlKHZhbHVlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWtlVmFsaWQgJiYgdHlwZW9mIG1ha2VWYWxpZCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IG1ha2VWYWxpZC52YWxpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hEYXRhID0gbWFrZVZhbGlkLnBhcnNlID8/IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQ7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvciwgZmlsZWQgLSAnICsgbWFrZU1hc3NhZ2UoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUudGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNEYXRhKVxuICAgICAgICBlcnJvciA9ICdFcnJvciB2YWxpZGF0ZSBmaWxlZCAtICcgKyB2YWx1ZTtcblxuICAgIHJldHVybiBbZXJyb3IsIHB1c2hEYXRhXTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyB0aGUgVVJMIGRhdGEgYW5kIHBhcnNlcyBpdCBpbnRvIGFuIG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBvYmogLSB0aGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIFVSTCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIFRoZSBVUkwgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0ge2FueX0gZGVmaW5lT2JqZWN0IC0gQWxsIHRoZSBkZWZpbml0aW9ucyB0aGF0IGhhcyBiZWVuIGZvdW5kXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0gbWFrZU1hc3NhZ2UgLSBDcmVhdGUgYW4gZXJyb3IgbWVzc2FnZVxuICogQHJldHVybnMgQSBzdHJpbmcgb3IgYW4gb2JqZWN0IHdpdGggYW4gZXJyb3IgcHJvcGVydHkuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZWZpbml0aW9uKG9iajogYW55LCB1cmxGcm9tOiBzdHJpbmcsIGRlZmluZU9iamVjdDogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIG1ha2VNYXNzYWdlOiAoZTogYW55KSA9PiBzdHJpbmcpIHtcbiAgICBpZiAoIW9iai5kZWZpbmUpXG4gICAgICAgIHJldHVybiB1cmxGcm9tO1xuXG4gICAgY29uc3QgdmFsaWRhdGVGdW5jID0gb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG4gICAgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmMgPSBudWxsO1xuICAgIGRlbGV0ZSBvYmouZGVmaW5lLnZhbGlkYXRlRnVuYztcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvYmouZGVmaW5lKSB7XG4gICAgICAgIGNvbnN0IFtkYXRhU2xhc2gsIG5leHRVcmxGcm9tXSA9IFNwbGl0Rmlyc3QoJy8nLCB1cmxGcm9tKTtcbiAgICAgICAgdXJsRnJvbSA9IG5leHRVcmxGcm9tO1xuXG4gICAgICAgIGNvbnN0IFtlcnJvciwgbmV3RGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEob2JqLmRlZmluZVtuYW1lXSwgZGF0YVNsYXNoLCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuXG4gICAgICAgIGlmKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHtlcnJvcn07XG4gICAgICAgIFxuICAgICAgICBkZWZpbmVPYmplY3RbbmFtZV0gPSBuZXdEYXRhO1xuICAgIH1cblxuICAgIGlmICh2YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IHZhbGlkYXRlRnVuYyhkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHlwZW9mIHZhbGlkYXRlID09ICdzdHJpbmcnID8gdmFsaWRhdGU6ICdFcnJvciB2YWxpZGF0aW5nIFVSTCd9O1xuICAgIH1cblxuICAgIHJldHVybiB1cmxGcm9tO1xufVxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gd2lsbCBwYXJzZSB0aGUgdXJsIGFuZCBmaW5kIHRoZSBiZXN0IG1hdGNoIGZvciB0aGUgdXJsXG4gKiBAcGFyYW0ge2FueX0gZmlsZU1vZHVsZSAtIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgbWV0aG9kIHRoYXQgeW91IHdhbnQgdG8gY2FsbC5cbiAqIEBwYXJhbSB7YW55fSBSZXF1ZXN0IC0gVGhlIHJlcXVlc3Qgb2JqZWN0LlxuICogQHBhcmFtIHthbnl9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxGcm9tIC0gdGhlIHVybCB0aGF0IHRoZSB1c2VyIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIGJvb2xlYW4sXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gKCkgPT4gUHJvbWlzZTxhbnk+XG4gKiBAcmV0dXJucyBhIGJvb2xlYW4gdmFsdWUuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUsIHRoZSByZXF1ZXN0IGlzIHByb2Nlc3NlZC4gSWYgdGhlIGZ1bmN0aW9uXG4gKiByZXR1cm5zIGZhbHNlLCB0aGUgcmVxdWVzdCBpcyBub3QgcHJvY2Vzc2VkLlxuICovXG5hc3luYyBmdW5jdGlvbiBNYWtlQ2FsbChmaWxlTW9kdWxlOiBhbnksIFJlcXVlc3Q6IGFueSwgUmVzcG9uc2U6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGFsbG93RXJyb3JJbmZvID0gIUdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSAmJiBpc0RlYnVnLCBtYWtlTWFzc2FnZSA9IChlOiBhbnkpID0+IChpc0RlYnVnID8gcHJpbnQuZXJyb3IoZSkgOiBudWxsKSArIChhbGxvd0Vycm9ySW5mbyA/IGAsIG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfWAgOiAnJyk7XG4gICAgY29uc3QgbWV0aG9kID0gUmVxdWVzdC5tZXRob2Q7XG4gICAgbGV0IG1ldGhvZE9iaiA9IGZpbGVNb2R1bGVbbWV0aG9kXSB8fCBmaWxlTW9kdWxlLmRlZmF1bHRbbWV0aG9kXTsgLy9Mb2FkaW5nIHRoZSBtb2R1bGUgYnkgbWV0aG9kXG4gICAgbGV0IGhhdmVNZXRob2QgPSB0cnVlO1xuXG4gICAgaWYoIW1ldGhvZE9iail7XG4gICAgICAgIGhhdmVNZXRob2QgPSBmYWxzZTtcbiAgICAgICAgbWV0aG9kT2JqID0gZmlsZU1vZHVsZS5kZWZhdWx0IHx8IGZpbGVNb2R1bGU7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZU1ldGhvZCA9IG1ldGhvZE9iajtcblxuICAgIGNvbnN0IGRlZmluZU9iamVjdCA9IHt9O1xuXG4gICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpOyAvLyByb290IGxldmVsIGRlZmluaXRpb25cbiAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcblxuICAgIGxldCBuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pO1xuXG4gICAgLy9wYXJzZSB0aGUgdXJsIHBhdGhcbiAgICBmb3IobGV0IGkgPSAwOyBpPCAyOyBpKyspe1xuICAgICAgICB3aGlsZSAoKG5lc3RlZFVSTCA9IGZpbmRCZXN0VXJsT2JqZWN0KG1ldGhvZE9iaiwgdXJsRnJvbSkpKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRGVmaW5lID0gYXdhaXQgbWFrZURlZmluaXRpb24obWV0aG9kT2JqLCB1cmxGcm9tLCBkZWZpbmVPYmplY3QsIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG4gICAgICAgICAgICBpZigoPGFueT5kYXRhRGVmaW5lKS5lcnJvcikgcmV0dXJuIFJlc3BvbnNlLmpzb24oZGF0YURlZmluZSk7XG4gICAgICAgICAgICB1cmxGcm9tID0gPHN0cmluZz5kYXRhRGVmaW5lO1xuICAgIFxuICAgICAgICAgICAgdXJsRnJvbSA9IHRyaW1UeXBlKCcvJywgdXJsRnJvbS5zdWJzdHJpbmcobmVzdGVkVVJMLmxlbmd0aCkpO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW25lc3RlZFVSTF07XG4gICAgICAgIH1cblxuICAgICAgICBpZighaGF2ZU1ldGhvZCl7IC8vIGNoZWNrIGlmIHRoYXQgYSBtZXRob2RcbiAgICAgICAgICAgIGhhdmVNZXRob2QgPSB0cnVlO1xuICAgICAgICAgICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqW21ldGhvZF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXRob2RPYmogPSBtZXRob2RPYmo/LmZ1bmMgJiYgbWV0aG9kT2JqIHx8IGJhc2VNZXRob2Q7IC8vIGlmIHRoZXJlIGlzIGFuICdhbnknIG1ldGhvZFxuXG5cbiAgICBpZiAoIW1ldGhvZE9iaj8uZnVuYylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgbGVmdERhdGEgPSB1cmxGcm9tLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgdXJsRGF0YSA9IFtdO1xuXG5cbiAgICBsZXQgZXJyb3I6IHN0cmluZztcbiAgICBpZiAobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCB2YWxpZGF0ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0aG9kT2JqLnZhbGlkYXRlVVJMKSkge1xuICAgICAgICAgICAgY29uc3QgW2Vycm9yVVJMLCBwdXNoRGF0YV0gPSBhd2FpdCBwYXJzZVVSTERhdGEodmFsaWRhdGUsIGxlZnREYXRhW2luZGV4XSwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yVVJMKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSA8c3RyaW5nPmVycm9yVVJMO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cmxEYXRhLnB1c2gocHVzaERhdGEpO1xuICAgICAgICB9XG4gICAgfSBlbHNlXG4gICAgICAgIHVybERhdGEucHVzaCguLi5sZWZ0RGF0YSk7XG5cbiAgICBpZiAoIWVycm9yICYmIG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZGF0ZSA9IGF3YWl0IG1ldGhvZE9iai52YWxpZGF0ZUZ1bmMobGVmdERhdGEsIFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSAnRXJyb3Igb24gZnVuY3Rpb24gdmFsaWRhdG9yJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIGVycm9yID0gdmFsaWRhdGU7XG4gICAgICAgIGVsc2UgaWYgKCF2YWxpZGF0ZSlcbiAgICAgICAgICAgIGVycm9yID0gJ0Vycm9yIHZhbGlkYXRpbmcgVVJMJztcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgZXJyb3IgfSk7XG5cbiAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBsZXQgYXBpUmVzcG9uc2U6IGFueSwgbmV3UmVzcG9uc2U6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBhcGlSZXNwb25zZSA9IGF3YWl0IG1ldGhvZE9iai5mdW5jKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmxEYXRhLCBkZWZpbmVPYmplY3QsIGxlZnREYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChhbGxvd0Vycm9ySW5mbylcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogZS5tZXNzYWdlIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IGVycm9yOiAnNTAwIC0gSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYXBpUmVzcG9uc2UgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgdGV4dDogYXBpUmVzcG9uc2UgfTtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0gYXBpUmVzcG9uc2U7XG5cbiAgICBmaW5hbFN0ZXAoKTsgIC8vIHNhdmUgY29va2llcyArIGNvZGVcblxuICAgIGlmIChuZXdSZXNwb25zZSAhPSBudWxsKVxuICAgICAgICBSZXNwb25zZS5qc29uKG5ld1Jlc3BvbnNlKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIEJhc2ljU2V0dGluZ3N9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSBhcyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgR2V0RmlsZSBhcyBHZXRTdGF0aWNGaWxlLCBzZXJ2ZXJCdWlsZCB9IGZyb20gJy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgKiBhcyBGdW5jU2NyaXB0IGZyb20gJy4vRnVuY3Rpb25TY3JpcHQnO1xuaW1wb3J0IE1ha2VBcGlDYWxsIGZyb20gJy4vQXBpQ2FsbCc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmNvbnN0IHsgRXhwb3J0IH0gPSBGdW5jU2NyaXB0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yUGFnZXMge1xuICAgIG5vdEZvdW5kPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9LFxuICAgIHNlcnZlckVycm9yPzoge1xuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGNvZGU/OiBudW1iZXJcbiAgICB9XG59XG5cbmludGVyZmFjZSBHZXRQYWdlc1NldHRpbmdzIHtcbiAgICBDYWNoZURheXM6IG51bWJlcixcbiAgICBQYWdlUmFtOiBib29sZWFuLFxuICAgIERldk1vZGU6IGJvb2xlYW4sXG4gICAgQ29va2llU2V0dGluZ3M/OiBhbnksXG4gICAgQ29va2llcz86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIENvb2tpZUVuY3J5cHRlcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIFNlc3Npb25TdG9yZT86ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+LFxuICAgIEVycm9yUGFnZXM6IEVycm9yUGFnZXNcbn1cblxuY29uc3QgU2V0dGluZ3M6IEdldFBhZ2VzU2V0dGluZ3MgPSB7XG4gICAgQ2FjaGVEYXlzOiAxLFxuICAgIFBhZ2VSYW06IGZhbHNlLFxuICAgIERldk1vZGU6IHRydWUsXG4gICAgRXJyb3JQYWdlczoge31cbn1cblxuYXN5bmMgZnVuY3Rpb24gTG9hZFBhZ2VUb1JhbSh1cmw6IHN0cmluZykge1xuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShGdW5jU2NyaXB0LmdldEZ1bGxQYXRoQ29tcGlsZSh1cmwpKSkge1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXSA9IFtdO1xuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSA9IGF3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2UodXJsKTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShFeHBvcnQuUGFnZUxvYWRSYW1bdXJsXVswXSwgdXJsKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRBbGxQYWdlc1RvUmFtKCkge1xuICAgIGZvciAoY29uc3QgaSBpbiBwYWdlRGVwcy5zdG9yZSkge1xuICAgICAgICBpZiAoIUV4dGVuc2lvbkluQXJyYXkoaSwgPGFueT5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5KSlcbiAgICAgICAgICAgIGF3YWl0IExvYWRQYWdlVG9SYW0oaSk7XG5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIENsZWFyQWxsUGFnZXNGcm9tUmFtKCkge1xuICAgIGZvciAoY29uc3QgaSBpbiBFeHBvcnQuUGFnZUxvYWRSYW0pIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBkZWxldGUgRXhwb3J0LlBhZ2VMb2FkUmFtW2ldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gRXh0ZW5zaW9uSW5BcnJheShmaWxlUGF0aDogc3RyaW5nLCAuLi5hcnJheXM6IHN0cmluZ1tdKSB7XG4gICAgZmlsZVBhdGggPSBmaWxlUGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgIGZvciAoY29uc3QgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhcnJheSkge1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoLnN1YnN0cmluZyhmaWxlUGF0aC5sZW5ndGggLSBpLmxlbmd0aCAtIDEpID09ICcuJyArIGkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIEdldEVycm9yUGFnZShjb2RlOiBudW1iZXIsIExvY1NldHRpbmdzOiAnbm90Rm91bmQnIHwgJ3NlcnZlckVycm9yJykge1xuICAgIGxldCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZztcbiAgICBpZiAoU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10pIHtcbiAgICAgICAgYXJyYXlUeXBlID0gZ2V0VHlwZXMuU3RhdGljO1xuICAgICAgICB1cmwgPSBTZXR0aW5ncy5FcnJvclBhZ2VzW0xvY1NldHRpbmdzXS5wYXRoO1xuICAgICAgICBjb2RlID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10uY29kZSA/PyBjb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLkxvZ3M7XG4gICAgICAgIHVybCA9ICdlJyArIGNvZGU7XG4gICAgfVxuICAgIHJldHVybiB7IHVybCwgYXJyYXlUeXBlLCBjb2RlIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUGFyc2VCYXNpY0luZm8oUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBjb2RlOiBudW1iZXIpIHtcbiAgICAvL2ZpcnN0IHN0ZXAgLSBwYXJzZSBpbmZvXG4gICAgaWYgKFJlcXVlc3QubWV0aG9kID09IFwiUE9TVFwiKSB7XG4gICAgICAgIGlmICghUmVxdWVzdC5ib2R5IHx8ICFPYmplY3Qua2V5cyhSZXF1ZXN0LmJvZHkpLmxlbmd0aClcbiAgICAgICAgICAgIFJlcXVlc3QuYm9keSA9IFJlcXVlc3QuZmllbGRzIHx8IHt9O1xuXG4gICAgfSBlbHNlXG4gICAgICAgIFJlcXVlc3QuYm9keSA9IGZhbHNlO1xuXG5cbiAgICBpZiAoUmVxdWVzdC5jbG9zZWQpXG4gICAgICAgIHJldHVybjtcblxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVzKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShuZXh0ID0+IFNldHRpbmdzLlNlc3Npb25TdG9yZShSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuXG4gICAgUmVxdWVzdC5zaWduZWRDb29raWVzID0gUmVxdWVzdC5zaWduZWRDb29raWVzIHx8IHt9O1xuICAgIFJlcXVlc3QuZmlsZXMgPSBSZXF1ZXN0LmZpbGVzIHx8IHt9O1xuXG4gICAgY29uc3QgQ29weUNvb2tpZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFJlcXVlc3Quc2lnbmVkQ29va2llcykpO1xuICAgIFJlcXVlc3QuY29va2llcyA9IFJlcXVlc3Quc2lnbmVkQ29va2llcztcblxuICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDE7XG5cbiAgICAvL3NlY29uZCBzdGVwXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMSlcbiAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1c0NvZGUgPSBjb2RlO1xuXG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3Quc2lnbmVkQ29va2llcykgey8vdXBkYXRlIGNvb2tpZXNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldICE9ICdvYmplY3QnICYmIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSBDb3B5Q29va2llc1tpXSB8fCBKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0pICE9IEpTT04uc3RyaW5naWZ5KENvcHlDb29raWVzW2ldKSlcbiAgICAgICAgICAgICAgICBSZXNwb25zZS5jb29raWUoaSwgUmVxdWVzdC5zaWduZWRDb29raWVzW2ldLCBTZXR0aW5ncy5Db29raWVTZXR0aW5ncyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBDb3B5Q29va2llcykgey8vZGVsZXRlIG5vdCBleGl0cyBjb29raWVzXG4gICAgICAgICAgICBpZiAoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY2xlYXJDb29raWUoaSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9mb3IgZmluYWwgc3RlcFxuZnVuY3Rpb24gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnkpIHtcbiAgICBpZiAoIVJlcXVlc3QuZmlsZXMpIC8vZGVsZXRlIGZpbGVzXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgY29uc3QgYXJyUGF0aCA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gUmVxdWVzdC5maWxlcykge1xuXG4gICAgICAgIGNvbnN0IGUgPSBSZXF1ZXN0LmZpbGVzW2ldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIGluIGUpIHtcbiAgICAgICAgICAgICAgICBhcnJQYXRoLnB1c2goZVthXS5maWxlcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGUuZmlsZXBhdGgpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGFyclBhdGg7XG59XG5cbi8vZmluYWwgc3RlcFxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUmVxdWVzdEZpbGVzKGFycmF5OiBzdHJpbmdbXSkge1xuICAgIGZvcihjb25zdCBlIGluIGFycmF5KVxuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGlzVVJMUGF0aEFGaWxlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIHVybDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdLCBjb2RlOiBudW1iZXIpIHtcbiAgICBsZXQgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMl07XG4gICAgbGV0IGZpbGUgPSBmYWxzZTtcblxuICAgIGlmIChjb2RlID09IDIwMCkge1xuICAgICAgICBmdWxsUGFnZVVybCA9IGdldFR5cGVzLlN0YXRpY1swXSArIHVybDtcbiAgICAgICAgLy9jaGVjayB0aGF0IGlzIG5vdCBzZXJ2ZXIgZmlsZVxuICAgICAgICBpZiAoYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgU2V0dGluZ3MuRGV2TW9kZSwgdXJsKSB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkpXG4gICAgICAgICAgICBmaWxlID0gdHJ1ZTtcbiAgICAgICAgZWxzZSAgLy8gdGhlbiBpdCBhIHNlcnZlciBwYWdlIG9yIGVycm9yIHBhZ2VcbiAgICAgICAgICAgIGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzJdO1xuICAgIH1cblxuICAgIHJldHVybiB7IGZpbGUsIGZ1bGxQYWdlVXJsIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYWdlQXJyYXkgPSBbYXdhaXQgRnVuY1NjcmlwdC5Mb2FkUGFnZShzbWFsbFBhdGgpXTtcblxuICAgIHBhZ2VBcnJheVsxXSA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKHBhZ2VBcnJheVswXSwgc21hbGxQYXRoKTtcblxuICAgIGlmIChTZXR0aW5ncy5QYWdlUmFtKVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSA9IHBhZ2VBcnJheTtcblxuICAgIHJldHVybiBwYWdlQXJyYXlbMV07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIEJ1aWxkUGFnZVVSTChhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGxldCBmdWxsUGFnZVVybDogc3RyaW5nO1xuXG4gICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShhcnJheVR5cGVbMF0gKyB1cmwgKyAnLicgKyBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSkge1xuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBHZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcblxuICAgICAgICB1cmwgPSBFcnJvclBhZ2UudXJsO1xuICAgICAgICBhcnJheVR5cGUgPSBFcnJvclBhZ2UuYXJyYXlUeXBlO1xuICAgICAgICBjb2RlID0gRXJyb3JQYWdlLmNvZGU7XG5cbiAgICAgICAgc21hbGxQYXRoID0gYXJyYXlUeXBlWzJdICsgJy8nICsgdXJsO1xuICAgICAgICBmdWxsUGFnZVVybCA9IHVybCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGFycmF5VHlwZVswXSArIGZ1bGxQYWdlVXJsKSlcbiAgICAgICAgICAgIGZ1bGxQYWdlVXJsID0gbnVsbDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMV0gKyBmdWxsUGFnZVVybCArICcuY2pzJztcblxuICAgIH0gZWxzZVxuICAgICAgICBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsxXSArIHVybCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSArICcuY2pzJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFycmF5VHlwZSxcbiAgICAgICAgZnVsbFBhZ2VVcmwsXG4gICAgICAgIHNtYWxsUGF0aCxcbiAgICAgICAgY29kZSxcbiAgICAgICAgdXJsXG4gICAgfVxufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBsb2FkIHRoZSBkeW5hbWljIHBhZ2VcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIFRoZSBhcnJheSBvZiB0eXBlcyB0aGF0IHRoZSBwYWdlIGlzLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdGhhdCB3YXMgcmVxdWVzdGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZ1bGxQYWdlVXJsIC0gVGhlIGZ1bGwgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzbWFsbFBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZSBmaWxlLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBUaGUgc3RhdHVzIGNvZGUgb2YgdGhlIHBhZ2UuXG4gKiBAcmV0dXJucyBUaGUgRHluYW1pY0Z1bmMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgdG8gZ2VuZXJhdGUgdGhlIHBhZ2UuXG4gKiBUaGUgY29kZSBpcyB0aGUgc3RhdHVzIGNvZGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICogVGhlIGZ1bGxQYWdlVXJsIGlzIHRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldER5bmFtaWNQYWdlKGFycmF5VHlwZTogc3RyaW5nW10sIHVybDogc3RyaW5nLCBmdWxsUGFnZVVybDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgY29kZTogbnVtYmVyKSB7XG4gICAgY29uc3QgU2V0TmV3VVJMID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBidWlsZCA9IGF3YWl0IEJ1aWxkUGFnZVVSTChhcnJheVR5cGUsIHVybCwgc21hbGxQYXRoLCBjb2RlKTtcbiAgICAgICAgc21hbGxQYXRoID0gYnVpbGQuc21hbGxQYXRoLCB1cmwgPSBidWlsZC51cmwsIGNvZGUgPSBidWlsZC5jb2RlLCBmdWxsUGFnZVVybCA9IGJ1aWxkLmZ1bGxQYWdlVXJsLCBhcnJheVR5cGUgPSBidWlsZC5hcnJheVR5cGU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBEeW5hbWljRnVuYzogKC4uLmRhdGE6IGFueVtdKSA9PiBhbnk7XG4gICAgaWYgKFNldHRpbmdzLkRldk1vZGUgJiYgYXdhaXQgU2V0TmV3VVJMKCkgJiYgZnVsbFBhZ2VVcmwpIHtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYWdlVXJsKSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2Uoc21hbGxQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUodXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSwgYXJyYXlUeXBlKTtcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0pIHtcblxuICAgICAgICAgICAgaWYgKCFFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXSkge1xuICAgICAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UoRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMF0sIHNtYWxsUGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKFNldHRpbmdzLlBhZ2VSYW0pXG4gICAgICAgICAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdID0gRHluYW1pY0Z1bmM7XG5cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIER5bmFtaWNGdW5jID0gRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV07XG5cblxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG5cbiAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdKVxuICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG4gICAgZWxzZSBpZiAoIVNldHRpbmdzLlBhZ2VSYW0gJiYgYXdhaXQgU2V0TmV3VVJMKCkgJiYgZnVsbFBhZ2VVcmwpXG4gICAgICAgIER5bmFtaWNGdW5jID0gYXdhaXQgQnVpbGRMb2FkUGFnZShzbWFsbFBhdGgpO1xuXG4gICAgZWxzZSB7XG4gICAgICAgIGNvZGUgPSBTZXR0aW5ncy5FcnJvclBhZ2VzLm5vdEZvdW5kPy5jb2RlID8/IDQwNDtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gU2V0dGluZ3MuRXJyb3JQYWdlcy5ub3RGb3VuZCAmJiBFeHBvcnQuUGFnZUxvYWRSYW1bZ2V0VHlwZXMuU3RhdGljWzJdICsgJy8nICsgU2V0dGluZ3MuRXJyb3JQYWdlcy5ub3RGb3VuZC5wYXRoXSB8fCBFeHBvcnQuUGFnZUxvYWRSYW1bZ2V0VHlwZXMuTG9nc1syXSArICcvZTQwNCddO1xuXG4gICAgICAgIGlmIChFcnJvclBhZ2UpXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IEVycm9yUGFnZVsxXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZnVsbFBhZ2VVcmwgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIER5bmFtaWNGdW5jLFxuICAgICAgICBjb2RlLFxuICAgICAgICBmdWxsUGFnZVVybFxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gTWFrZVBhZ2VSZXNwb25zZShEeW5hbWljUmVzcG9uc2U6IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlIHwgYW55KSB7XG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGg/LmZpbGUpIHtcbiAgICAgICAgUmVzcG9uc2Uuc2VuZEZpbGUoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IFJlc3BvbnNlLm9uKCdmaW5pc2gnLCByZXMpKTtcbiAgICB9IGVsc2UgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGgpIHtcbiAgICAgICAgUmVzcG9uc2Uud3JpdGVIZWFkKDMwMiwgeyBMb2NhdGlvbjogRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aCB9KTtcbiAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgUmVzUGFnZSA9IER5bmFtaWNSZXNwb25zZS5vdXRfcnVuX3NjcmlwdC50cmltKCk7XG4gICAgICAgIGlmIChSZXNQYWdlKSB7XG4gICAgICAgICAgICBSZXNwb25zZS5zZW5kKFJlc1BhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUmVzcG9uc2UuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoRHluYW1pY1Jlc3BvbnNlLnJlZGlyZWN0UGF0aC5kZWxldGVBZnRlcikge1xuICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rSWZFeGlzdHMoUmVzcG9uc2UucmVkaXJlY3RQYXRoLmZpbGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gYSBwYWdlLiBcbiAqIEl0IHdpbGwgY2hlY2sgaWYgdGhlIHBhZ2UgZXhpc3RzLCBhbmQgaWYgaXQgZG9lcywgaXQgd2lsbCByZXR1cm4gdGhlIHBhZ2UuIFxuICogSWYgaXQgZG9lcyBub3QgZXhpc3QsIGl0IHdpbGwgcmV0dXJuIGEgNDA0IHBhZ2VcbiAqIEBwYXJhbSB7UmVxdWVzdCB8IGFueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7UmVzcG9uc2V9IFJlc3BvbnNlIC0gVGhlIHJlc3BvbnNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5VHlwZSAtIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBjb250YWlucyB0aGUgcGF0aHNcbiAqIGxvYWRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIG9mIHRoZSBwYWdlIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7eyBmaWxlOiBib29sZWFuLCBmdWxsUGFnZVVybDogc3RyaW5nIH19IEZpbGVJbmZvIC0gdGhlIGZpbGUgaW5mbyBvZiB0aGUgcGFnZSB0aGF0IGlzIGJlaW5nIGFjdGl2YXRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gbnVtYmVyXG4gKiBAcGFyYW0gbmV4dFByYXNlIC0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBhZnRlciB0aGUgZHluYW1pYyBwYWdlXG4gKiBpcyBsb2FkZWQuXG4gKiBAcmV0dXJucyBOb3RoaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBBY3RpdmF0ZVBhZ2UoUmVxdWVzdDogUmVxdWVzdCB8IGFueSwgUmVzcG9uc2U6IFJlc3BvbnNlLCBhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgRmlsZUluZm86IGFueSwgY29kZTogbnVtYmVyLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IHsgRHluYW1pY0Z1bmMsIGZ1bGxQYWdlVXJsLCBjb2RlOiBuZXdDb2RlIH0gPSBhd2FpdCBHZXREeW5hbWljUGFnZShhcnJheVR5cGUsIHVybCwgRmlsZUluZm8uZnVsbFBhZ2VVcmwsIEZpbGVJbmZvLmZ1bGxQYWdlVXJsICsgJy8nICsgdXJsLCBjb2RlKTtcblxuICAgIGlmICghZnVsbFBhZ2VVcmwgfHwgIUR5bmFtaWNGdW5jICYmIGNvZGUgPT0gNTAwKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2Uuc2VuZFN0YXR1cyhuZXdDb2RlKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbmFsU3RlcCA9IGF3YWl0IG5leHRQcmFzZSgpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cbiAgICAgICAgY29uc3QgcGFnZURhdGEgPSBhd2FpdCBEeW5hbWljRnVuYyhSZXNwb25zZSwgUmVxdWVzdCwgUmVxdWVzdC5ib2R5LCBSZXF1ZXN0LnF1ZXJ5LCBSZXF1ZXN0LmNvb2tpZXMsIFJlcXVlc3Quc2Vzc2lvbiwgUmVxdWVzdC5maWxlcywgU2V0dGluZ3MuRGV2TW9kZSk7XG4gICAgICAgIGZpbmFsU3RlcCgpOyAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICAgICAgYXdhaXQgTWFrZVBhZ2VSZXNwb25zZShcbiAgICAgICAgICAgIHBhZ2VEYXRhLFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIHByaW50LmVycm9yKGUpO1xuICAgICAgICBSZXF1ZXN0LmVycm9yID0gZTtcblxuICAgICAgICBjb25zdCBFcnJvclBhZ2UgPSBHZXRFcnJvclBhZ2UoNTAwLCAnc2VydmVyRXJyb3InKTtcblxuICAgICAgICBEeW5hbWljUGFnZShSZXF1ZXN0LCBSZXNwb25zZSwgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIER5bmFtaWNQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSwgdXJsOiBzdHJpbmcsIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYywgY29kZSA9IDIwMCkge1xuICAgIGNvbnN0IEZpbGVJbmZvID0gYXdhaXQgaXNVUkxQYXRoQUZpbGUoUmVxdWVzdCwgdXJsLCBhcnJheVR5cGUsIGNvZGUpO1xuXG4gICAgY29uc3QgbWFrZURlbGV0ZUFycmF5ID0gbWFrZURlbGV0ZVJlcXVlc3RGaWxlc0FycmF5KFJlcXVlc3QpXG5cbiAgICBpZiAoRmlsZUluZm8uZmlsZSkge1xuICAgICAgICBTZXR0aW5ncy5DYWNoZURheXMgJiYgUmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcIm1heC1hZ2U9XCIgKyAoU2V0dGluZ3MuQ2FjaGVEYXlzICogMjQgKiA2MCAqIDYwKSk7XG4gICAgICAgIGF3YWl0IEdldFN0YXRpY0ZpbGUodXJsLCBTZXR0aW5ncy5EZXZNb2RlLCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFByYXNlID0gKCkgPT4gUGFyc2VCYXNpY0luZm8oUmVxdWVzdCwgUmVzcG9uc2UsIGNvZGUpOyAvLyBwYXJzZSBkYXRhIGZyb20gbWV0aG9kcyAtIHBvc3QsIGdldC4uLiArIGNvb2tpZXMsIHNlc3Npb24uLi5cblxuICAgIGNvbnN0IGlzQXBpID0gYXdhaXQgTWFrZUFwaUNhbGwoUmVxdWVzdCwgUmVzcG9uc2UsIHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgbmV4dFByYXNlKTtcbiAgICBpZiAoIWlzQXBpICYmICFhd2FpdCBBY3RpdmF0ZVBhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIGFycmF5VHlwZSwgdXJsLCBGaWxlSW5mbywgY29kZSwgbmV4dFByYXNlKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgZGVsZXRlUmVxdWVzdEZpbGVzKG1ha2VEZWxldGVBcnJheSk7IC8vIGRlbGV0ZSBmaWxlc1xufVxuXG5mdW5jdGlvbiB1cmxGaXgodXJsOiBzdHJpbmcpIHtcbiAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5sYXN0SW5kZXhPZignPycpKSB8fCB1cmw7XG5cbiAgICBpZiAodXJsID09ICcvJykge1xuICAgICAgICB1cmwgPSAnL2luZGV4JztcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHVybCk7XG59XG5cbmV4cG9ydCB7XG4gICAgU2V0dGluZ3MsXG4gICAgRHluYW1pY1BhZ2UsXG4gICAgTG9hZEFsbFBhZ2VzVG9SYW0sXG4gICAgQ2xlYXJBbGxQYWdlc0Zyb21SYW0sXG4gICAgdXJsRml4LFxuICAgIEdldEVycm9yUGFnZVxufSIsICJpbXBvcnQgKiBhcyBmaWxlQnlVcmwgZnJvbSAnLi4vUnVuVGltZUJ1aWxkL0dldFBhZ2VzJztcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCAqIGFzIEJ1aWxkU2VydmVyIGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hQYWdlcyc7XG5pbXBvcnQgeyBjb29raWVQYXJzZXIgfSBmcm9tICdAdGlueWh0dHAvY29va2llLXBhcnNlcic7XG5pbXBvcnQgY29va2llRW5jcnlwdGVyIGZyb20gJ2Nvb2tpZS1lbmNyeXB0ZXInO1xuaW1wb3J0IHsgYWxsb3dQcmludCB9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IHNlc3Npb24gZnJvbSAnZXhwcmVzcy1zZXNzaW9uJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEluc2VydE1vZGVsc1NldHRpbmdzIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCB7IFN0YXJ0UmVxdWlyZSwgR2V0U2V0dGluZ3MgfSBmcm9tICcuL0ltcG9ydE1vZHVsZSc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBQcmludElmTmV3U2V0dGluZ3MgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgTWVtb3J5U2Vzc2lvbiBmcm9tICdtZW1vcnlzdG9yZSc7XG5pbXBvcnQgeyBFeHBvcnRTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5pbXBvcnQgeyBkZWJ1Z1NpdGVNYXAgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2l0ZU1hcCc7XG5pbXBvcnQgeyBzZXR0aW5ncyBhcyBkZWZpbmVTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuXG5jb25zdFxuICAgIENvb2tpZXNTZWNyZXQgPSB1dWlkdjQoKS5zdWJzdHJpbmcoMCwgMzIpLFxuICAgIFNlc3Npb25TZWNyZXQgPSB1dWlkdjQoKSxcbiAgICBNZW1vcnlTdG9yZSA9IE1lbW9yeVNlc3Npb24oc2Vzc2lvbiksXG5cbiAgICBDb29raWVzTWlkZGxld2FyZSA9IGNvb2tpZVBhcnNlcihDb29raWVzU2VjcmV0KSxcbiAgICBDb29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlID0gY29va2llRW5jcnlwdGVyKENvb2tpZXNTZWNyZXQsIHt9KSxcbiAgICBDb29raWVTZXR0aW5ncyA9IHsgaHR0cE9ubHk6IHRydWUsIHNpZ25lZDogdHJ1ZSwgbWF4QWdlOiA4NjQwMDAwMCAqIDMwIH07XG5cbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVzID0gPGFueT5Db29raWVzTWlkZGxld2FyZTtcbmZpbGVCeVVybC5TZXR0aW5ncy5Db29raWVFbmNyeXB0ZXIgPSA8YW55PkNvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llU2V0dGluZ3MgPSBDb29raWVTZXR0aW5ncztcblxubGV0IERldk1vZGVfID0gdHJ1ZSwgY29tcGlsYXRpb25TY2FuOiBQcm9taXNlPCgpID0+IFByb21pc2U8dm9pZD4+LCBTZXNzaW9uU3RvcmU7XG5cbmxldCBmb3JtaWRhYmxlU2VydmVyLCBib2R5UGFyc2VyU2VydmVyO1xuXG5jb25zdCBzZXJ2ZUxpbWl0cyA9IHtcbiAgICBzZXNzaW9uVG90YWxSYW1NQjogMTUwLFxuICAgIHNlc3Npb25UaW1lTWludXRlczogNDAsXG4gICAgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlczogMzAsXG4gICAgZmlsZUxpbWl0TUI6IDEwLFxuICAgIHJlcXVlc3RMaW1pdE1COiA0XG59XG5cbmxldCBwYWdlSW5SYW1BY3RpdmF0ZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCBmdW5jdGlvbiBwYWdlSW5SYW1BY3RpdmF0ZUZ1bmMoKXtcbiAgICByZXR1cm4gcGFnZUluUmFtQWN0aXZhdGU7XG59XG5cbmNvbnN0IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMgPSBbLi4uQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgLi4uQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheV07XG5jb25zdCBiYXNlVmFsaWRQYXRoID0gWyhwYXRoOiBzdHJpbmcpID0+IHBhdGguc3BsaXQoJy4nKS5hdCgtMikgIT0gJ3NlcnYnXTsgLy8gaWdub3JpbmcgZmlsZXMgdGhhdCBlbmRzIHdpdGggLnNlcnYuKlxuXG5leHBvcnQgY29uc3QgRXhwb3J0OiBFeHBvcnRTZXR0aW5ncyA9IHtcbiAgICBnZXQgc2V0dGluZ3NQYXRoKCkge1xuICAgICAgICByZXR1cm4gd29ya2luZ0RpcmVjdG9yeSArIEJhc2ljU2V0dGluZ3MuV2ViU2l0ZUZvbGRlciArIFwiL1NldHRpbmdzXCI7XG4gICAgfSxcbiAgICBzZXQgZGV2ZWxvcG1lbnQodmFsdWUpIHtcbiAgICAgICAgaWYoRGV2TW9kZV8gPT0gdmFsdWUpIHJldHVyblxuICAgICAgICBEZXZNb2RlXyA9IHZhbHVlO1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICBjb21waWxhdGlvblNjYW4gPSBCdWlsZFNlcnZlci5jb21waWxlQWxsKEV4cG9ydCk7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwicHJvZHVjdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5EZXZNb2RlID0gdmFsdWU7XG4gICAgICAgIGFsbG93UHJpbnQodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0IGRldmVsb3BtZW50KCkge1xuICAgICAgICByZXR1cm4gRGV2TW9kZV87XG4gICAgfSxcbiAgICBtaWRkbGV3YXJlOiB7XG4gICAgICAgIGdldCBjb29raWVzKCk6IChyZXE6IFJlcXVlc3QsIF9yZXM6IFJlc3BvbnNlPGFueT4sIG5leHQ/OiBOZXh0RnVuY3Rpb24pID0+IHZvaWQge1xuICAgICAgICAgICAgcmV0dXJuIDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVFbmNyeXB0ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblN0b3JlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZm9ybWlkYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtaWRhYmxlU2VydmVyO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgYm9keVBhcnNlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBib2R5UGFyc2VyU2VydmVyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZWNyZXQ6IHtcbiAgICAgICAgZ2V0IGNvb2tpZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llc1NlY3JldDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gU2Vzc2lvblNlY3JldDtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGdlbmVyYWw6IHtcbiAgICAgICAgaW1wb3J0T25Mb2FkOiBbXSxcbiAgICAgICAgc2V0IHBhZ2VJblJhbSh2YWx1ZSkge1xuICAgICAgICAgICAgaWYoZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0gIT0gdmFsdWUpe1xuICAgICAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhc3luYyAoKSA9PiAoYXdhaXQgY29tcGlsYXRpb25TY2FuKT8uKClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXBhcmF0aW9ucyA9IGF3YWl0IGNvbXBpbGF0aW9uU2NhbjtcbiAgICAgICAgICAgICAgICBhd2FpdCBwcmVwYXJhdGlvbnM/LigpO1xuICAgICAgICAgICAgICAgIGlmICghZmlsZUJ5VXJsLlNldHRpbmdzLlBhZ2VSYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZUJ5VXJsLkxvYWRBbGxQYWdlc1RvUmFtKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZUJ5VXJsLkNsZWFyQWxsUGFnZXNGcm9tUmFtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXQgcGFnZUluUmFtKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21waWxlOiB7XG4gICAgICAgIHNldCBjb21waWxlU3ludGF4KHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4ID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb21waWxlU3ludGF4KCkge1xuICAgICAgICAgICAgcmV0dXJuIEluc2VydE1vZGVsc1NldHRpbmdzLkFkZENvbXBpbGVTeW50YXg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBpZ25vcmVFcnJvcih2YWx1ZSkge1xuICAgICAgICAgICAgKDxhbnk+UHJpbnRJZk5ld1NldHRpbmdzKS5QcmV2ZW50RXJyb3JzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBpZ25vcmVFcnJvcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoPGFueT5QcmludElmTmV3U2V0dGluZ3MpLlByZXZlbnRFcnJvcnM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBwbHVnaW5zKHZhbHVlKSB7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zLnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgcGx1Z2lucygpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5wbHVnaW5zO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgZGVmaW5lKCl7XG4gICAgICAgICAgICByZXR1cm4gZGVmaW5lU2V0dGluZ3MuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHNldCBkZWZpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIGRlZmluZVNldHRpbmdzLmRlZmluZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5nOiB7XG4gICAgICAgIHJ1bGVzOiB7fSxcbiAgICAgICAgdXJsU3RvcDogW10sXG4gICAgICAgIHZhbGlkUGF0aDogYmFzZVZhbGlkUGF0aCxcbiAgICAgICAgaWdub3JlVHlwZXM6IGJhc2VSb3V0aW5nSWdub3JlVHlwZXMsXG4gICAgICAgIGlnbm9yZVBhdGhzOiBbXSxcbiAgICAgICAgc2l0ZW1hcDogdHJ1ZSxcbiAgICAgICAgZ2V0IGVycm9yUGFnZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBlcnJvclBhZ2VzKHZhbHVlKSB7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRXJyb3JQYWdlcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZUxpbWl0czoge1xuICAgICAgICBnZXQgY2FjaGVEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNhY2hlRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuQ2FjaGVEYXlzID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb29raWVzRXhwaXJlc0RheXMoKXtcbiAgICAgICAgICAgIHJldHVybiBDb29raWVTZXR0aW5ncy5tYXhBZ2UgLyA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGNvb2tpZXNFeHBpcmVzRGF5cyh2YWx1ZSl7XG4gICAgICAgICAgICBDb29raWVTZXR0aW5ncy5tYXhBZ2UgPSB2YWx1ZSAqIDg2NDAwMDAwO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgc2Vzc2lvblRvdGFsUmFtTUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRvdGFsUmFtTUIoKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25UaW1lTWludXRlcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvblRpbWVNaW51dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZmlsZUxpbWl0TUIodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuZmlsZUxpbWl0TUIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmaWxlTGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5maWxlTGltaXRNQjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHJlcXVlc3RMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICAgICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldCByZXF1ZXN0TGltaXRNQigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmU6IHtcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgaHR0cDI6IGZhbHNlLFxuICAgICAgICBncmVlbkxvY2s6IHtcbiAgICAgICAgICAgIHN0YWdpbmc6IG51bGwsXG4gICAgICAgICAgICBjbHVzdGVyOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICBhZ2VudDogbnVsbCxcbiAgICAgICAgICAgIGFncmVlVG9UZXJtczogZmFsc2UsXG4gICAgICAgICAgICBzaXRlczogW11cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybWlkYWJsZSgpIHtcbiAgICBmb3JtaWRhYmxlU2VydmVyID0ge1xuICAgICAgICBtYXhGaWxlU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLmZpbGVMaW1pdE1CICogMTA0ODU3NixcbiAgICAgICAgdXBsb2FkRGlyOiBTeXN0ZW1EYXRhICsgXCIvVXBsb2FkRmlsZXMvXCIsXG4gICAgICAgIG11bHRpcGxlczogdHJ1ZSxcbiAgICAgICAgbWF4RmllbGRzU2l6ZTogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICogMTA0ODU3NlxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJvZHlQYXJzZXIoKSB7XG4gICAgYm9keVBhcnNlclNlcnZlciA9ICg8YW55PmJvZHlQYXJzZXIpLmpzb24oeyBsaW1pdDogRXhwb3J0LnNlcnZlTGltaXRzLnJlcXVlc3RMaW1pdE1CICsgJ21iJyB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZXNzaW9uKCkge1xuICAgIGlmICghRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyB8fCAhRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CKSB7XG4gICAgICAgIFNlc3Npb25TdG9yZSA9IChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2Vzc2lvblN0b3JlID0gc2Vzc2lvbih7XG4gICAgICAgIGNvb2tpZTogeyBtYXhBZ2U6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgKiA2MCAqIDEwMDAsIHNhbWVTaXRlOiB0cnVlIH0sXG4gICAgICAgIHNlY3JldDogU2Vzc2lvblNlY3JldCxcbiAgICAgICAgcmVzYXZlOiBmYWxzZSxcbiAgICAgICAgc2F2ZVVuaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzdG9yZTogbmV3IE1lbW9yeVN0b3JlKHtcbiAgICAgICAgICAgIGNoZWNrUGVyaW9kOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgIG1heDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CICogMTA0ODU3NlxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb3B5SlNPTih0bzogYW55LCBqc29uOiBhbnksIHJ1bGVzOiBzdHJpbmdbXSA9IFtdLCBydWxlc1R5cGU6ICdpZ25vcmUnIHwgJ29ubHknID0gJ2lnbm9yZScpIHtcbiAgICBpZighanNvbikgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBoYXNJbXBsZWF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGkgaW4ganNvbikge1xuICAgICAgICBjb25zdCBpbmNsdWRlID0gcnVsZXMuaW5jbHVkZXMoaSk7XG4gICAgICAgIGlmIChydWxlc1R5cGUgPT0gJ29ubHknICYmIGluY2x1ZGUgfHwgcnVsZXNUeXBlID09ICdpZ25vcmUnICYmICFpbmNsdWRlKSB7XG4gICAgICAgICAgICBoYXNJbXBsZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdG9baV0gPSBqc29uW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNJbXBsZWF0ZWQ7XG59XG5cbi8vIHJlYWQgdGhlIHNldHRpbmdzIG9mIHRoZSB3ZWJzaXRlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IFNldHRpbmdzOiBFeHBvcnRTZXR0aW5ncyA9IGF3YWl0IEdldFNldHRpbmdzKEV4cG9ydC5zZXR0aW5nc1BhdGgsIERldk1vZGVfKTtcbiAgICBpZihTZXR0aW5ncyA9PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAoU2V0dGluZ3MuZGV2ZWxvcG1lbnQpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oU2V0dGluZ3MsIFNldHRpbmdzLmltcGxEZXYpO1xuXG4gICAgZWxzZVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsUHJvZCk7XG5cblxuICAgIGNvcHlKU09OKEV4cG9ydC5jb21waWxlLCBTZXR0aW5ncy5jb21waWxlKTtcblxuICAgIGNvcHlKU09OKEV4cG9ydC5yb3V0aW5nLCBTZXR0aW5ncy5yb3V0aW5nLCBbJ2lnbm9yZVR5cGVzJywgJ3ZhbGlkUGF0aCddKTtcblxuICAgIC8vY29uY2F0IGRlZmF1bHQgdmFsdWVzIG9mIHJvdXRpbmdcbiAgICBjb25zdCBjb25jYXRBcnJheSA9IChuYW1lOiBzdHJpbmcsIGFycmF5OiBhbnlbXSkgPT4gU2V0dGluZ3Mucm91dGluZz8uW25hbWVdICYmIChFeHBvcnQucm91dGluZ1tuYW1lXSA9IFNldHRpbmdzLnJvdXRpbmdbbmFtZV0uY29uY2F0KGFycmF5KSk7XG5cbiAgICBjb25jYXRBcnJheSgnaWdub3JlVHlwZXMnLCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzKTtcbiAgICBjb25jYXRBcnJheSgndmFsaWRQYXRoJywgYmFzZVZhbGlkUGF0aCk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2NhY2hlRGF5cycsICdjb29raWVzRXhwaXJlc0RheXMnXSwgJ29ubHknKTtcblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsnc2Vzc2lvblRvdGFsUmFtTUInLCAnc2Vzc2lvblRpbWVNaW51dGVzJywgJ3Nlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMnXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICB9XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ2ZpbGVMaW1pdE1CJywgJ3JlcXVlc3RMaW1pdE1CJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkQm9keVBhcnNlcigpO1xuICAgIH1cblxuICAgIGNvcHlKU09OKEV4cG9ydC5zZXJ2ZSwgU2V0dGluZ3Muc2VydmUpO1xuXG4gICAgLyogLS0tIHByb2JsZW1hdGljIHVwZGF0ZXMgLS0tICovXG4gICAgRXhwb3J0LmRldmVsb3BtZW50ID0gU2V0dGluZ3MuZGV2ZWxvcG1lbnRcblxuICAgIGlmIChTZXR0aW5ncy5nZW5lcmFsPy5pbXBvcnRPbkxvYWQpIHtcbiAgICAgICAgRXhwb3J0LmdlbmVyYWwuaW1wb3J0T25Mb2FkID0gPGFueT5hd2FpdCBTdGFydFJlcXVpcmUoPGFueT5TZXR0aW5ncy5nZW5lcmFsLmltcG9ydE9uTG9hZCwgRGV2TW9kZV8pO1xuICAgIH1cblxuICAgIC8vbmVlZCB0byBkb3duIGxhc3RlZCBzbyBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aCAnaW1wb3J0T25Mb2FkJ1xuICAgIGlmICghY29weUpTT04oRXhwb3J0LmdlbmVyYWwsIFNldHRpbmdzLmdlbmVyYWwsIFsncGFnZUluUmFtJ10sICdvbmx5JykgJiYgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgcGFnZUluUmFtQWN0aXZhdGUgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgfVxuXG4gICAgaWYoRXhwb3J0LmRldmVsb3BtZW50ICYmIEV4cG9ydC5yb3V0aW5nLnNpdGVtYXApeyAvLyBvbiBwcm9kdWN0aW9uIHRoaXMgd2lsbCBiZSBjaGVja2VkIGFmdGVyIGNyZWF0aW5nIHN0YXRlXG4gICAgICAgIGRlYnVnU2l0ZU1hcChFeHBvcnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlyc3RMb2FkKCkge1xuICAgIGJ1aWxkU2Vzc2lvbigpO1xuICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIGJ1aWxkQm9keVBhcnNlcigpO1xufSIsICJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMic7XG5pbXBvcnQgKiBhcyBjcmVhdGVDZXJ0IGZyb20gJ3NlbGZzaWduZWQnO1xuaW1wb3J0ICogYXMgR3JlZW5sb2NrIGZyb20gJ2dyZWVubG9jay1leHByZXNzJztcbmltcG9ydCB7RXhwb3J0IGFzIFNldHRpbmdzfSBmcm9tICcuL1NldHRpbmdzJ1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRGVsZXRlSW5EaXJlY3RvcnksIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBHcmVlbkxvY2tTaXRlIH0gZnJvbSAnLi9TZXR0aW5nc1R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgZm9sZGVyIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0LiBJZiB0aGUgZmlsZSBkb2VzXG4gKiBleGlzdCwgdXBkYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZvbGRlciB0byBjcmVhdGUuXG4gKiBAcGFyYW0gQ3JlYXRlSW5Ob3RFeGl0cyAtIHtcbiAqL1xuYXN5bmMgZnVuY3Rpb24gVG91Y2hTeXN0ZW1Gb2xkZXIoZm9OYW1lOiBzdHJpbmcsIENyZWF0ZUluTm90RXhpdHM6IHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGV4aXRzPzogYW55fSkge1xuICAgIGxldCBzYXZlUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyBcIi9TeXN0ZW1TYXZlL1wiO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgc2F2ZVBhdGggKz0gZm9OYW1lO1xuXG4gICAgYXdhaXQgRWFzeUZzLm1rZGlySWZOb3RFeGlzdHMoc2F2ZVBhdGgpO1xuXG4gICAgaWYgKENyZWF0ZUluTm90RXhpdHMpIHtcbiAgICAgICAgc2F2ZVBhdGggKz0gJy8nO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHNhdmVQYXRoICsgQ3JlYXRlSW5Ob3RFeGl0cy5uYW1lO1xuXG4gICAgICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBDcmVhdGVJbk5vdEV4aXRzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZpbGVQYXRoLCBhd2FpdCBDcmVhdGVJbk5vdEV4aXRzLmV4aXRzKGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKSwgZmlsZVBhdGgsIHNhdmVQYXRoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSXQgZ2VuZXJhdGVzIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgYW5kIHN0b3JlcyBpdCBpbiBhIGZpbGUuXG4gKiBAcmV0dXJucyBUaGUgY2VydGlmaWNhdGUgYW5kIGtleSBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIEdldERlbW9DZXJ0aWZpY2F0ZSgpIHtcbiAgICBsZXQgQ2VydGlmaWNhdGU6IGFueTtcbiAgICBjb25zdCBDZXJ0aWZpY2F0ZVBhdGggPSBTeXN0ZW1EYXRhICsgJy9DZXJ0aWZpY2F0ZS5qc29uJztcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShDZXJ0aWZpY2F0ZVBhdGgpKSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gRWFzeUZzLnJlYWRKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIENlcnRpZmljYXRlID0gYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUNlcnQuZ2VuZXJhdGUobnVsbCwgeyBkYXlzOiAzNjUwMCB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5cy5wcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBFYXN5RnMud3JpdGVKc29uRmlsZShDZXJ0aWZpY2F0ZVBhdGgsIENlcnRpZmljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIENlcnRpZmljYXRlO1xufVxuXG5mdW5jdGlvbiBEZWZhdWx0TGlzdGVuKGFwcCkge1xuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5hdHRhY2gpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgbGlzdGVuKHBvcnQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCA8YW55PnJlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIGdyZWVubG9jaywgaXQgd2lsbCBjcmVhdGUgYSBzZXJ2ZXIgdGhhdCB3aWxsIHNlcnZlIHlvdXIgYXBwIG92ZXIgaHR0cHNcbiAqIEBwYXJhbSBhcHAgLSBUaGUgdGlueUh0dHAgYXBwbGljYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdGhlIHNlcnZlciBtZXRob2RzXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFVwZGF0ZUdyZWVuTG9jayhhcHApIHtcblxuICAgIGlmICghKFNldHRpbmdzLnNlcnZlLmh0dHAyIHx8IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jaz8uYWdyZWVUb1Rlcm1zKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgRGVmYXVsdExpc3RlbihhcHApO1xuICAgIH1cblxuICAgIGlmICghU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFncmVlVG9UZXJtcykge1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwMi5jcmVhdGVTZWN1cmVTZXJ2ZXIoeyAuLi5hd2FpdCBHZXREZW1vQ2VydGlmaWNhdGUoKSwgYWxsb3dIVFRQMTogdHJ1ZSB9LCBhcHAuYXR0YWNoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VydmVyLFxuICAgICAgICAgICAgbGlzdGVuKHBvcnQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBUb3VjaFN5c3RlbUZvbGRlcihcImdyZWVubG9ja1wiLCB7XG4gICAgICAgIG5hbWU6IFwiY29uZmlnLmpzb25cIiwgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpdGVzOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXNcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGV4aXRzKGZpbGUsIF8sIGZvbGRlcikge1xuICAgICAgICAgICAgZmlsZSA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmlsZS5zaXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBmaWxlLnNpdGVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiA8R3JlZW5Mb2NrU2l0ZVtdPiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuc3ViamVjdCA9PSBlLnN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuYWx0bmFtZXMubGVuZ3RoICE9IGUuYWx0bmFtZXMubGVuZ3RoIHx8IGIuYWx0bmFtZXMuc29tZSh2ID0+IGUuYWx0bmFtZXMuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5hbHRuYW1lcyA9IGIuYWx0bmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUucmVuZXdBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGF2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnNpdGVzLnNwbGljZShpLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGZvbGRlciArIFwibGl2ZS9cIiArIGUuc3ViamVjdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0cyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NpdGVzID0gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzLmZpbHRlcigoeCkgPT4gIWZpbGUuc2l0ZXMuZmluZChiID0+IGIuc3ViamVjdCA9PSB4LnN1YmplY3QpKTtcblxuICAgICAgICAgICAgZmlsZS5zaXRlcy5wdXNoKC4uLm5ld1NpdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUod29ya2luZ0RpcmVjdG9yeSArIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgZ3JlZW5sb2NrT2JqZWN0OmFueSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBHcmVlbmxvY2suaW5pdCh7XG4gICAgICAgIHBhY2thZ2VSb290OiB3b3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBjb25maWdEaXI6IFwiU3lzdGVtU2F2ZS9ncmVlbmxvY2tcIixcbiAgICAgICAgcGFja2FnZUFnZW50OiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suYWdlbnQgfHwgcGFja2FnZUluZm8ubmFtZSArICcvJyArIHBhY2thZ2VJbmZvLnZlcnNpb24sXG4gICAgICAgIG1haW50YWluZXJFbWFpbDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmVtYWlsLFxuICAgICAgICBjbHVzdGVyOiBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2suY2x1c3RlcixcbiAgICAgICAgc3RhZ2luZzogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnN0YWdpbmdcbiAgICB9KS5yZWFkeShyZXMpKTtcblxuICAgIGZ1bmN0aW9uIENyZWF0ZVNlcnZlcih0eXBlLCBmdW5jLCBvcHRpb25zPykge1xuICAgICAgICBsZXQgQ2xvc2VodHRwU2VydmVyID0gKCkgPT4geyB9O1xuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBncmVlbmxvY2tPYmplY3RbdHlwZV0ob3B0aW9ucywgZnVuYyk7XG4gICAgICAgIGNvbnN0IGxpc3RlbiA9IChwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwU2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0Lmh0dHBTZXJ2ZXIoKTtcbiAgICAgICAgICAgIENsb3NlaHR0cFNlcnZlciA9ICgpID0+IGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UocmVzID0+IHNlcnZlci5saXN0ZW4oNDQzLCBcIjAuMC4wLjBcIiwgcmVzKSksIG5ldyBQcm9taXNlKHJlcyA9PiBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBcIjAuMC4wLjBcIiwgcmVzKSldKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHNlcnZlci5jbG9zZSgpOyBDbG9zZWh0dHBTZXJ2ZXIoKTsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3RlbixcbiAgICAgICAgICAgIGNsb3NlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cDJTZXJ2ZXInLCBhcHAuYXR0YWNoLCB7IGFsbG93SFRUUDE6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0ZVNlcnZlcignaHR0cHNTZXJ2ZXInLCBhcHAuYXR0YWNoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHNlcnZlciwge1NldHRpbmdzfSAgZnJvbSAnLi9NYWluQnVpbGQvU2VydmVyJztcbmltcG9ydCBhc3luY1JlcXVpcmUgZnJvbSAnLi9JbXBvcnRGaWxlcy9TY3JpcHQnO1xuaW1wb3J0IHtnZXRUeXBlc30gZnJvbSAnLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gJy4vQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkJztcbmV4cG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9NYWluQnVpbGQvVHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQXN5bmNJbXBvcnQgPSAocGF0aDpzdHJpbmcsIGltcG9ydEZyb20gPSAnYXN5bmMgaW1wb3J0JykgPT4gYXN5bmNSZXF1aXJlKGltcG9ydEZyb20sIHBhdGgsIGdldFR5cGVzLlN0YXRpYywgU2V0dGluZ3MuZGV2ZWxvcG1lbnQpO1xuZXhwb3J0IHtTZXR0aW5ncywgU2VhcmNoUmVjb3JkfTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7OztBQ0ZBOzs7QUNBQSxJQUFJLFlBQVk7QUFFVCxvQkFBb0IsR0FBWTtBQUNuQyxjQUFZO0FBQ2hCO0FBRU8sSUFBTSxRQUFRLElBQUksTUFBTSxTQUFRO0FBQUEsRUFDbkMsSUFBSSxRQUFRLE1BQU0sVUFBVTtBQUN4QixRQUFHO0FBQ0MsYUFBTyxPQUFPO0FBQ2xCLFdBQU8sTUFBTTtBQUFBLElBQUM7QUFBQSxFQUNsQjtBQUNKLENBQUM7OztBRFZEO0FBRUEsZ0JBQWdCLFFBQStCO0FBQzNDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxLQUFLLFFBQU0sQ0FBQyxLQUFLLFVBQVM7QUFDekIs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
