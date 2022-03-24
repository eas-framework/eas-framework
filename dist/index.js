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
var AsyncImport = (path21, importFrom = "async import") => LoadImport(importFrom, path21, getTypes.Static, Export.development);
var src_default = StartServer;
export {
  AsyncImport,
  SearchRecord,
  Export as Settings,
  src_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL01haW5CdWlsZC9TZXJ2ZXIudHMiLCAiLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvQ29uc29sZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcudHMiLCAiLi4vc3JjL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZS50cyIsICIuLi9zcmMvRWFzeURlYnVnL1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcC50cyIsICIuLi9zcmMvRWFzeURlYnVnL1N0cmluZ1RyYWNrZXIudHMiLCAiLi4vc3JjL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyIsICIuLi9zcmMvc3RhdGljL3dhc20vY29tcG9uZW50L1NldHRpbmdzLmpzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9CYXNlUmVhZGVyL1JlYWRlci50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTY3JpcHQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL0pTUGFyc2VyLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeS50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UudHMiLCAiLi4vc3JjL091dHB1dElucHV0L1ByaW50TmV3LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2NsaWVudC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvc2VydmVyLnRzIiwgIi4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwTG9hZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zY3JpcHQvY2xpZW50LnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NjcmlwdC9pbmRleC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9zYXNzLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3N0eWxlL3NlcnZlci50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdHlsZS9jbGllbnQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvcGFnZS50cyIsICIuLi9zcmMvT3V0cHV0SW5wdXQvU3RvcmVKU09OLnRzIiwgIi4uL3NyYy9PdXRwdXRJbnB1dC9TdG9yZURlcHMudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvaXNvbGF0ZS50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zdmVsdGUudHMiLCAiLi4vc3JjL1N0cmluZ01ldGhvZHMvSWQudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0ZvclN0YXRpYy9TdmVsdGUvc3NyLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3ByZXByb2Nlc3MudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc2Vydi1jb25uZWN0L2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS90cmFuc2Zvcm0vU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvRXh0ZW5zaW9uL2pzb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL0N1c3RvbUltcG9ydC9FeHRlbnNpb24vd2FzbS50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleC50cyIsICIuLi9zcmMvQ29tcGlsZUNvZGUvdHJhbnNmb3JtL0Vhc3lTeW50YXgudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1Nlc3Npb24udHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL3JlZGlyZWN0Q0pTLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2Vycm9yLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL21hcmtkb3duLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL2hlYWQudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvY29ubmVjdC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9mb3JtLnRzIiwgIi4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3JlY29yZC50cyIsICIuLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZWFyY2gudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL2luZGV4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQudHMiLCAiLi4vc3JjL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvRXh0cmljYXRlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L0NvbXBpbGUudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1NjcmlwdC50cyIsICIuLi9zcmMvQnVpbGRJbkZ1bmMvU2VhcmNoUmVjb3JkLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvQWxpYXMvcGFja2FnZUV4cG9ydC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzL2luZGV4LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9DdXN0b21JbXBvcnQvaW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4LnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZS50cyIsICIuLi9zcmMvUGx1Z2lucy9TeW50YXgvSW5kZXgudHMiLCAiLi4vc3JjL1BsdWdpbnMvSW5kZXgudHMiLCAiLi4vc3JjL0J1aWxkSW5Db21wb25lbnRzL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMudHMiLCAiLi4vc3JjL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzLnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU2NyaXB0LnRzIiwgIi4uL3NyYy9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL2NsaWVudC50cyIsICIuLi9zcmMvSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N0eWxlLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9Db21waWxlU3RhdGUudHMiLCAiLi4vc3JjL01haW5CdWlsZC9JbXBvcnRNb2R1bGUudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9TaXRlTWFwLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRmlsZVR5cGVzLnRzIiwgIi4uL3NyYy9SdW5UaW1lQnVpbGQvRnVuY3Rpb25TY3JpcHQudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9JbXBvcnRGaWxlUnVudGltZS50cyIsICIuLi9zcmMvUnVuVGltZUJ1aWxkL0FwaUNhbGwudHMiLCAiLi4vc3JjL1J1blRpbWVCdWlsZC9HZXRQYWdlcy50cyIsICIuLi9zcmMvTWFpbkJ1aWxkL1NldHRpbmdzLnRzIiwgIi4uL3NyYy9NYWluQnVpbGQvTGlzdGVuR3JlZW5Mb2NrLnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwIGFzIFRpbnlBcHAgfSBmcm9tICdAdGlueWh0dHAvYXBwJztcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSAnLi9UeXBlcyc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IHtFeHBvcnQgYXMgU2V0dGluZ3MsIHJlcXVpcmVTZXR0aW5ncywgYnVpbGRGaXJzdExvYWQsIHBhZ2VJblJhbUFjdGl2YXRlRnVuY30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCAqIGFzIGZpbGVCeVVybCBmcm9tICcuLi9SdW5UaW1lQnVpbGQvR2V0UGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgZm9ybWlkYWJsZSBmcm9tICdmb3JtaWRhYmxlJztcbmltcG9ydCB7IFVwZGF0ZUdyZWVuTG9jayB9IGZyb20gJy4vTGlzdGVuR3JlZW5Mb2NrJztcblxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBjaGFuZ2VVUkxSdWxlcyhyZXEsIHJlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYW5nZVVSTFJ1bGVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGxldCB1cmwgPSBmaWxlQnlVcmwudXJsRml4KHJlcS5wYXRoKTtcblxuICAgIFxuICAgIGZvciAobGV0IGkgb2YgU2V0dGluZ3Mucm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChpKSkge1xuICAgICAgICAgICAgaWYgKGkuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgICAgIGkgPSBpLnN1YnN0cmluZygwLCBpLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgUnVsZUluZGV4ID0gT2JqZWN0LmtleXMoU2V0dGluZ3Mucm91dGluZy5ydWxlcykuZmluZChpID0+IHVybC5zdGFydHNXaXRoKGkpKTtcblxuICAgIGlmIChSdWxlSW5kZXgpIHtcbiAgICAgICAgdXJsID0gYXdhaXQgU2V0dGluZ3Mucm91dGluZy5ydWxlc1tSdWxlSW5kZXhdKHVybCwgcmVxLCByZXMpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVyVVJMUnVsZXMocmVxLCByZXMsIHVybCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbGVyVVJMUnVsZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCB1cmw6IHN0cmluZykge1xuICAgIGxldCBub3RWYWxpZDogYW55ID0gU2V0dGluZ3Mucm91dGluZy5pZ25vcmVQYXRocy5maW5kKGkgPT4gdXJsLnN0YXJ0c1dpdGgoaSkpIHx8IFNldHRpbmdzLnJvdXRpbmcuaWdub3JlVHlwZXMuZmluZChpID0+IHVybC5lbmRzV2l0aCgnLicraSkpO1xuICAgIFxuICAgIGlmKCFub3RWYWxpZCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsaWQgb2YgU2V0dGluZ3Mucm91dGluZy52YWxpZFBhdGgpeyAvLyBjaGVjayBpZiB1cmwgaXNuJ3QgdmFsaWRcbiAgICAgICAgICAgIGlmKCFhd2FpdCB2YWxpZCh1cmwsIHJlcSwgcmVzKSl7XG4gICAgICAgICAgICAgICAgbm90VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vdFZhbGlkKSB7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IGZpbGVCeVVybC5HZXRFcnJvclBhZ2UoNDA0LCAnbm90Rm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgRXJyb3JQYWdlLnVybCwgRXJyb3JQYWdlLmFycmF5VHlwZSwgRXJyb3JQYWdlLmNvZGUpO1xuICAgIH1cblxuICAgIGF3YWl0IGZpbGVCeVVybC5EeW5hbWljUGFnZShyZXEsIHJlcywgdXJsLnN1YnN0cmluZygxKSk7XG59XG5cbmxldCBhcHBPbmxpbmVcblxuLyoqXG4gKiBJdCBzdGFydHMgdGhlIHNlcnZlciBhbmQgdGhlbiBjYWxscyBTdGFydExpc3RpbmdcbiAqIEBwYXJhbSBbU2VydmVyXSAtIFRoZSBzZXJ2ZXIgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIGluIGJ5IHRoZSBjYWxsZXIuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFN0YXJ0QXBwKFNlcnZlcj8pIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgVGlueUFwcCgpO1xuICAgIGlmICghU2V0dGluZ3Muc2VydmUuaHR0cDIpIHtcbiAgICAgICAgYXBwLnVzZSg8YW55PmNvbXByZXNzaW9uKCkpO1xuICAgIH1cbiAgICBmaWxlQnlVcmwuU2V0dGluZ3MuU2Vzc2lvblN0b3JlID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiBTZXR0aW5ncy5taWRkbGV3YXJlLnNlc3Npb24ocmVxLCByZXMsIG5leHQpO1xuXG4gICAgY29uc3QgT3Blbkxpc3RpbmcgPSBhd2FpdCBTdGFydExpc3RpbmcoYXBwLCBTZXJ2ZXIpO1xuXG4gICAgZm9yIChjb25zdCBmdW5jIG9mIFNldHRpbmdzLmdlbmVyYWwuaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIGF3YWl0IGZ1bmMoYXBwLCBhcHBPbmxpbmUuc2VydmVyLCBTZXR0aW5ncyk7XG4gICAgfVxuICAgIGF3YWl0IHBhZ2VJblJhbUFjdGl2YXRlRnVuYygpPy4oKVxuXG4gICAgYXBwLmFsbChcIipcIiwgUGFyc2VSZXF1ZXN0KTtcblxuICAgIGF3YWl0IE9wZW5MaXN0aW5nKFNldHRpbmdzLnNlcnZlLnBvcnQpO1xuXG4gICAgY29uc29sZS5sb2coXCJBcHAgbGlzdGluZyBhdCBwb3J0OiBcIiArIFNldHRpbmdzLnNlcnZlLnBvcnQpO1xufVxuXG4vKipcbiAqIElmIHRoZSByZXF1ZXN0IGlzIGEgUE9TVCByZXF1ZXN0LCB0aGVuIHBhcnNlIHRoZSByZXF1ZXN0IGJvZHksIHRoZW4gc2VuZCBpdCB0byByb3V0aW5nIHNldHRpbmdzXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcSAtIFRoZSBpbmNvbWluZyByZXF1ZXN0LlxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC0gUmVzcG9uc2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gUGFyc2VSZXF1ZXN0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgIGlmIChyZXEubWV0aG9kID09ICdQT1NUJykge1xuICAgICAgICBpZiAocmVxLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddPy5zdGFydHNXaXRoPy4oJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICAgICAgU2V0dGluZ3MubWlkZGxld2FyZS5ib2R5UGFyc2VyKHJlcSwgcmVzLCAoKSA9PiByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybShTZXR0aW5ncy5taWRkbGV3YXJlLmZvcm1pZGFibGUpLnBhcnNlKHJlcSwgKGVyciwgZmllbGRzLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVxLmZpZWxkcyA9IGZpZWxkcztcbiAgICAgICAgICAgICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0QW5kU2V0dGluZ3MocmVxLCByZXMpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gU3RhcnRMaXN0aW5nKGFwcCwgU2VydmVyKSB7XG4gICAgaWYgKGFwcE9ubGluZSAmJiBhcHBPbmxpbmUuY2xvc2UpIHtcbiAgICAgICAgYXdhaXQgYXBwT25saW5lLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZXJ2ZXIsIGxpc3RlbiwgY2xvc2UgfSA9IGF3YWl0IFNlcnZlcihhcHApO1xuXG4gICAgYXBwT25saW5lID0geyBzZXJ2ZXIsIGNsb3NlIH07XG5cbiAgICByZXR1cm4gbGlzdGVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTdGFydFNlcnZlcih7IFNpdGVQYXRoID0gJy4vJywgSHR0cFNlcnZlciA9IFVwZGF0ZUdyZWVuTG9jayB9ID0ge30pIHtcbiAgICBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgPSBTaXRlUGF0aDtcbiAgICBidWlsZEZpcnN0TG9hZCgpO1xuICAgIGF3YWl0IHJlcXVpcmVTZXR0aW5ncygpO1xuICAgIFN0YXJ0QXBwKEh0dHBTZXJ2ZXIpO1xufVxuXG5leHBvcnQgeyBTZXR0aW5ncyB9OyIsICJpbXBvcnQgZnMsIHtEaXJlbnQsIFN0YXRzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4vQ29uc29sZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgcmVzKEJvb2xlYW4oc3RhdCkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7cGF0aCBvZiB0aGUgZmlsZX0gcGF0aCBcbiAqIEBwYXJhbSB7ZmlsZWQgdG8gZ2V0IGZyb20gdGhlIHN0YXQgb2JqZWN0fSBmaWxlZCBcbiAqIEByZXR1cm5zIHRoZSBmaWxlZFxuICovXG5mdW5jdGlvbiBzdGF0KHBhdGg6IHN0cmluZywgZmlsZWQ/OiBzdHJpbmcsIGlnbm9yZUVycm9yPzogYm9vbGVhbiwgZGVmYXVsdFZhbHVlOmFueSA9IHt9KTogUHJvbWlzZTxTdGF0cyB8IGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyICYmICFpZ25vcmVFcnJvcil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlZCAmJiBzdGF0PyBzdGF0W2ZpbGVkXTogc3RhdCB8fCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgZmlsZSBleGlzdHMsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHthbnl9IFtpZlRydWVSZXR1cm49dHJ1ZV0gLSBhbnkgPSB0cnVlXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4aXN0c0ZpbGUocGF0aDogc3RyaW5nLCBpZlRydWVSZXR1cm46IGFueSA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiAoYXdhaXQgc3RhdChwYXRoLCB1bmRlZmluZWQsIHRydWUpKS5pc0ZpbGU/LigpICYmIGlmVHJ1ZVJldHVybjtcbn1cblxuLyoqXG4gKiBJdCBjcmVhdGVzIGEgZGlyZWN0b3J5LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gbWtkaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMubWtkaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgcm1kaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB0byBiZSByZW1vdmVkLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBybWRpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ybWRpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB1bmxpbmtgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gZGVsZXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB1bmxpbmsocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMudW5saW5rKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZXhpc3RzLCBkZWxldGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgb3IgZGlyZWN0b3J5IHRvIGJlIHVubGlua2VkLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bmxpbmtJZkV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKGF3YWl0IGV4aXN0cyhwYXRoKSl7XG4gICAgICAgIHJldHVybiBhd2FpdCB1bmxpbmsocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZGRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9ucyBvYmplY3QsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzXG4gKiB0byBhbiBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBvcHRpb25zIC0ge1xuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gcmVhZGRpcihwYXRoOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nW10gfCBCdWZmZXJbXSB8IERpcmVudFtdPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZGRpcihwYXRoLCBvcHRpb25zLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVzIHx8IFtdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRpcmVjdG9yeSB3YXMgY3JlYXRlZCBvciBub3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1rZGlySWZOb3RFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZighYXdhaXQgZXhpc3RzKHBhdGgpKVxuICAgICAgICByZXR1cm4gYXdhaXQgbWtkaXIocGF0aCk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFdyaXRlIGEgZmlsZSB0byB0aGUgZmlsZSBzeXN0ZW1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge3N0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXd9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogIHN0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy53cml0ZUZpbGUocGF0aCwgY29udGVudCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgd3JpdGVKc29uRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYSBjb250ZW50IGFuZCB3cml0ZXMgdGhlIGNvbnRlbnQgdG8gdGhlIGZpbGUgYXRcbiAqIHRoZSBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHthbnl9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gd3JpdGVKc29uRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB3cml0ZUZpbGUocGF0aCwgSlNPTi5zdHJpbmdpZnkoY29udGVudCkpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9uYWwgZW5jb2RpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAqIHJlc29sdmVzIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIFtlbmNvZGluZz11dGY4XSAtIFRoZSBlbmNvZGluZyBvZiB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcmVhZEZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nID0gJ3V0ZjgnKTogUHJvbWlzZTxzdHJpbmd8YW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZEZpbGUocGF0aCwgPGFueT5lbmNvZGluZywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGRhdGEgfHwgXCJcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEl0IHJlYWRzIGEgSlNPTiBmaWxlIGFuZCByZXR1cm5zIHRoZSBwYXJzZWQgSlNPTiBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2VuY29kaW5nXSAtIFRoZSBlbmNvZGluZyB0byB1c2Ugd2hlbiByZWFkaW5nIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0LlxuICovXG5hc3luYyBmdW5jdGlvbiByZWFkSnNvbkZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nPzpzdHJpbmcpOiBQcm9taXNlPGFueT57XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcmVhZEZpbGUocGF0aCwgZW5jb2RpbmcpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHAgLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IG5lZWRzIHRvIGJlIGNyZWF0ZWQuXG4gKiBAcGFyYW0gW2Jhc2VdIC0gVGhlIGJhc2UgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZVBhdGhSZWFsKHA6c3RyaW5nLCBiYXNlID0gJycpIHtcbiAgICBwID0gcGF0aC5kaXJuYW1lKHApO1xuXG4gICAgaWYgKCFhd2FpdCBleGlzdHMoYmFzZSArIHApKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHAuc3BsaXQoL1xcXFx8XFwvLyk7XG5cbiAgICAgICAgbGV0IHBTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgaWYgKHBTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcFN0cmluZyArPSAnLyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwU3RyaW5nICs9IGk7XG5cbiAgICAgICAgICAgIGF3YWl0IG1rZGlySWZOb3RFeGlzdHMoYmFzZSArIHBTdHJpbmcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vL3R5cGVzXG5leHBvcnQge1xuICAgIERpcmVudFxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLi4uZnMucHJvbWlzZXMsXG4gICAgZXhpc3RzLFxuICAgIGV4aXN0c0ZpbGUsXG4gICAgc3RhdCxcbiAgICBta2RpcixcbiAgICBta2RpcklmTm90RXhpc3RzLFxuICAgIHdyaXRlRmlsZSxcbiAgICB3cml0ZUpzb25GaWxlLFxuICAgIHJlYWRGaWxlLFxuICAgIHJlYWRKc29uRmlsZSxcbiAgICBybWRpcixcbiAgICB1bmxpbmssXG4gICAgdW5saW5rSWZFeGlzdHMsXG4gICAgcmVhZGRpcixcbiAgICBtYWtlUGF0aFJlYWxcbn0iLCAibGV0IHByaW50TW9kZSA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd1ByaW50KGQ6IGJvb2xlYW4pIHtcbiAgICBwcmludE1vZGUgPSBkO1xufVxuXG5leHBvcnQgY29uc3QgcHJpbnQgPSBuZXcgUHJveHkoY29uc29sZSx7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYocHJpbnRNb2RlKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgfVxufSk7IiwgImltcG9ydCB7RGlyZW50fSBmcm9tICdmcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge2N3ZH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCAsIFNwbGl0Rmlyc3R9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcblxuZnVuY3Rpb24gZ2V0RGlybmFtZSh1cmw6IHN0cmluZyl7XG4gICAgcmV0dXJuIHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKHVybCkpO1xufVxuXG5jb25zdCBTeXN0ZW1EYXRhID0gcGF0aC5qb2luKGdldERpcm5hbWUoaW1wb3J0Lm1ldGEudXJsKSwgJy9TeXN0ZW1EYXRhJyk7XG5cbmxldCBXZWJTaXRlRm9sZGVyXyA9IFwiV2ViU2l0ZVwiO1xuXG5jb25zdCBTdGF0aWNOYW1lID0gJ1dXVycsIExvZ3NOYW1lID0gJ0xvZ3MnLCBNb2R1bGVzTmFtZSA9ICdub2RlX21vZHVsZXMnO1xuXG5jb25zdCBTdGF0aWNDb21waWxlID0gU3lzdGVtRGF0YSArIGAvJHtTdGF0aWNOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVMb2dzID0gU3lzdGVtRGF0YSArIGAvJHtMb2dzTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTW9kdWxlID0gU3lzdGVtRGF0YSArIGAvJHtNb2R1bGVzTmFtZX1Db21waWxlL2A7XG5cbmNvbnN0IHdvcmtpbmdEaXJlY3RvcnkgPSBjd2QoKSArICcvJztcblxuZnVuY3Rpb24gR2V0RnVsbFdlYlNpdGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSxXZWJTaXRlRm9sZGVyXywgJy8nKTtcbn1cbmxldCBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG5cbmZ1bmN0aW9uIEdldFNvdXJjZShuYW1lKSB7XG4gICAgcmV0dXJuICBHZXRGdWxsV2ViU2l0ZVBhdGgoKSArIG5hbWUgKyAnLydcbn1cblxuLyogQSBvYmplY3QgdGhhdCBjb250YWlucyBhbGwgdGhlIHBhdGhzIG9mIHRoZSBmaWxlcyBpbiB0aGUgcHJvamVjdC4gKi9cbmNvbnN0IGdldFR5cGVzID0ge1xuICAgIFN0YXRpYzogW1xuICAgICAgICBHZXRTb3VyY2UoU3RhdGljTmFtZSksXG4gICAgICAgIFN0YXRpY0NvbXBpbGUsXG4gICAgICAgIFN0YXRpY05hbWVcbiAgICBdLFxuICAgIExvZ3M6IFtcbiAgICAgICAgR2V0U291cmNlKExvZ3NOYW1lKSxcbiAgICAgICAgQ29tcGlsZUxvZ3MsXG4gICAgICAgIExvZ3NOYW1lXG4gICAgXSxcbiAgICBub2RlX21vZHVsZXM6IFtcbiAgICAgICAgR2V0U291cmNlKCdub2RlX21vZHVsZXMnKSxcbiAgICAgICAgQ29tcGlsZU1vZHVsZSxcbiAgICAgICAgTW9kdWxlc05hbWVcbiAgICBdLFxuICAgIGdldCBbU3RhdGljTmFtZV0oKXtcbiAgICAgICAgcmV0dXJuIGdldFR5cGVzLlN0YXRpYztcbiAgICB9XG59XG5cbmNvbnN0IHBhZ2VUeXBlcyA9IHtcbiAgICBwYWdlOiBcInBhZ2VcIixcbiAgICBtb2RlbDogXCJtb2RlXCIsXG4gICAgY29tcG9uZW50OiBcImludGVcIlxufVxuXG5cbmNvbnN0IEJhc2ljU2V0dGluZ3MgPSB7XG4gICAgcGFnZVR5cGVzLFxuXG4gICAgcGFnZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgcGFnZUNvZGVGaWxlOiB7XG4gICAgICAgIHBhZ2U6IFtwYWdlVHlwZXMucGFnZStcIi5qc1wiLCBwYWdlVHlwZXMucGFnZStcIi50c1wiXSxcbiAgICAgICAgbW9kZWw6IFtwYWdlVHlwZXMubW9kZWwrXCIuanNcIiwgcGFnZVR5cGVzLm1vZGVsK1wiLnRzXCJdLFxuICAgICAgICBjb21wb25lbnQ6IFtwYWdlVHlwZXMuY29tcG9uZW50K1wiLmpzXCIsIHBhZ2VUeXBlcy5jb21wb25lbnQrXCIudHNcIl1cbiAgICB9LFxuXG4gICAgcGFnZUNvZGVGaWxlQXJyYXk6IFtdLFxuXG4gICAgcGFydEV4dGVuc2lvbnM6IFsnc2VydicsICdhcGknXSxcblxuICAgIFJlcUZpbGVUeXBlczoge1xuICAgICAgICBqczogXCJzZXJ2LmpzXCIsXG4gICAgICAgIHRzOiBcInNlcnYudHNcIixcbiAgICAgICAgJ2FwaS10cyc6IFwiYXBpLmpzXCIsXG4gICAgICAgICdhcGktanMnOiBcImFwaS50c1wiXG4gICAgfSxcbiAgICBSZXFGaWxlVHlwZXNBcnJheTogW10sXG5cbiAgICBnZXQgV2ViU2l0ZUZvbGRlcigpIHtcbiAgICAgICAgcmV0dXJuIFdlYlNpdGVGb2xkZXJfO1xuICAgIH0sXG4gICAgZ2V0IGZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF87XG4gICAgfSxcbiAgICBzZXQgV2ViU2l0ZUZvbGRlcih2YWx1ZSkge1xuICAgICAgICBXZWJTaXRlRm9sZGVyXyA9IHZhbHVlO1xuXG4gICAgICAgIGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcbiAgICAgICAgZ2V0VHlwZXMuU3RhdGljWzBdID0gR2V0U291cmNlKFN0YXRpY05hbWUpO1xuICAgICAgICBnZXRUeXBlcy5Mb2dzWzBdID0gR2V0U291cmNlKExvZ3NOYW1lKTtcbiAgICB9LFxuICAgIGdldCB0c0NvbmZpZygpe1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXyArICd0c2NvbmZpZy5qc29uJzsgXG4gICAgfSxcbiAgICBhc3luYyB0c0NvbmZpZ0ZpbGUoKSB7XG4gICAgICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMudHNDb25maWcpKXtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy50c0NvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbGF0aXZlKGZ1bGxQYXRoOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShmdWxsV2ViU2l0ZVBhdGhfLCBmdWxsUGF0aClcbiAgICB9XG59XG5cbkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzKTtcbkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlKS5mbGF0KCk7XG5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlcyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBDdXRUaGVMYXN0KCcuJywgU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkucG9wKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZUJ5U21hbGxQYXRoKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gZ2V0VHlwZXNbU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkuc2hpZnQoKV07XG59XG5cblxuXG5leHBvcnQge1xuICAgIGdldERpcm5hbWUsXG4gICAgU3lzdGVtRGF0YSxcbiAgICB3b3JraW5nRGlyZWN0b3J5LFxuICAgIGdldFR5cGVzLFxuICAgIEJhc2ljU2V0dGluZ3Ncbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5pbnRlcmZhY2UgZ2xvYmFsU3RyaW5nPFQ+IHtcbiAgICBpbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIGxhc3RJbmRleE9mKHN0cmluZzogc3RyaW5nKTogbnVtYmVyO1xuICAgIHN0YXJ0c1dpdGgoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3BsaXRGaXJzdDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+Pih0eXBlOiBzdHJpbmcsIHN0cmluZzogVCk6IFRbXSB7XG4gICAgY29uc3QgaW5kZXggPSBzdHJpbmcuaW5kZXhPZih0eXBlKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSlcbiAgICAgICAgcmV0dXJuIFtzdHJpbmddO1xuXG4gICAgcmV0dXJuIFtzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGV4KSwgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIHR5cGUubGVuZ3RoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDdXRUaGVMYXN0KHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGFzdEluZGV4T2YodHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0ZW5zaW9uPFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0cmluZzogVCkge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1UeXBlKHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICB3aGlsZSAoc3RyaW5nLnN0YXJ0c1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcodHlwZS5sZW5ndGgpO1xuXG4gICAgd2hpbGUgKHN0cmluZy5lbmRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBzdHJpbmcubGVuZ3RoIC0gdHlwZS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0cmluZ1N0YXJ0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHN0YXJ0OiBzdHJpbmcsIHN0cmluZzogVCk6IFQge1xuICAgIGlmKHN0cmluZy5zdGFydHNXaXRoKHN0YXJ0KSlcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyaW5nO1xufSIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4vLi4vSlNQYXJzZXInO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuXG5hc3luYyBmdW5jdGlvbiBQYXJzZVRleHRDb2RlKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCwgJzwje2RlYnVnfScsICd7ZGVidWd9Iz4nLCAnZGVidWcgaW5mbycpO1xuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGA8JXs/ZGVidWdfZmlsZT99JHtpLnRleHR9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlU2NyaXB0Q29kZShjb2RlOlN0cmluZ1RyYWNrZXIsIHBhdGg6c3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKGNvZGUsIHBhdGgsICc8I3tkZWJ1Z30nLCAne2RlYnVnfSM+JywgJ2RlYnVnIGluZm8nKTtcbiAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuXG4gICAgY29uc3QgbmV3Q29kZVN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKGNvZGUuRGVmYXVsdEluZm9UZXh0KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbmV3Q29kZVN0cmluZy5QbHVzKGkudGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb2RlU3RyaW5nLlBsdXMkIGBydW5fc2NyaXB0X25hbWU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvZGVTdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdMaW5lKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDpzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoY29kZSwgcGF0aCk7XG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgcGFyc2VyLnZhbHVlcykge1xuICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VUZXh0Q29kZShpLnRleHQsIHBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaS50ZXh0ID0gYXdhaXQgUGFyc2VTY3JpcHRDb2RlKGkudGV4dCwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZXIuc3RhcnQgPSBcIjwlXCI7XG4gICAgcGFyc2VyLmVuZCA9IFwiJT5cIjtcbiAgICByZXR1cm4gcGFyc2VyLlJlQnVpbGRUZXh0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlRGVidWdJbmZvKGNvZGU6U3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IFBhcnNlU2NyaXB0Q29kZShjb2RlLCBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEFkZERlYnVnSW5mbyhwYWdlTmFtZTpzdHJpbmcsIEZ1bGxQYXRoOnN0cmluZywgU21hbGxQYXRoOnN0cmluZywgY2FjaGU6IHt2YWx1ZT86IHN0cmluZ30gPSB7fSl7XG4gICAgaWYoIWNhY2hlLnZhbHVlKVxuICAgICAgICBjYWNoZS52YWx1ZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsUGF0aCwgJ3V0ZjgnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbERhdGE6IG5ldyBTdHJpbmdUcmFja2VyKGAke3BhZ2VOYW1lfTxsaW5lPiR7U21hbGxQYXRofWAsIGNhY2hlLnZhbHVlKSxcbiAgICAgICAgc3RyaW5nSW5mbzogYDwlIVxcbnJ1bl9zY3JpcHRfbmFtZT1cXGAke0pTUGFyc2VyLmZpeFRleHQocGFnZU5hbWUgKyAnIC0+ICcgKyBTbWFsbFBhdGgpfVxcYDslPmBcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGg6IHN0cmluZywgaW5wdXRQYXRoOiBzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOnN0cmluZywgcGF0aFR5cGUgPSAwKSB7XG4gICAgaWYgKHBhZ2VUeXBlICYmICFpbnB1dFBhdGguZW5kc1dpdGgoJy4nICsgcGFnZVR5cGUpKSB7XG4gICAgICAgIGlucHV0UGF0aCA9IGAke2lucHV0UGF0aH0uJHtwYWdlVHlwZX1gO1xuICAgIH1cblxuICAgIGlmKGlucHV0UGF0aFswXSA9PSAnXicpeyAvLyBsb2FkIGZyb20gcGFja2FnZXNcbiAgICAgICAgY29uc3QgW3BhY2thZ2VOYW1lLCBpblBhdGhdID0gU3BsaXRGaXJzdCgnLycsICBpbnB1dFBhdGguc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgcmV0dXJuIChwYXRoVHlwZSA9PSAwID8gd29ya2luZ0RpcmVjdG9yeTogJycpICsgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS8ke2ZvbGRlcn0vJHtpblBhdGh9YDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGggPSBgJHtwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfS8ke2lucHV0UGF0aH1gO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBgJHtnZXRUeXBlcy5TdGF0aWNbcGF0aFR5cGVdfSR7aW5wdXRQYXRofWA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRQYXRoID0gYCR7cGF0aFR5cGUgPT0gMCA/IHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyAnLycgOiAnJ30ke2ZvbGRlcn0vJHtpbnB1dFBhdGh9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoaW5wdXRQYXRoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXRoVHlwZXMge1xuICAgIFNtYWxsUGF0aFdpdGhvdXRGb2xkZXI/OiBzdHJpbmcsXG4gICAgU21hbGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoPzogc3RyaW5nLFxuICAgIEZ1bGxQYXRoQ29tcGlsZT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBDcmVhdGVGaWxlUGF0aChmaWxlUGF0aDpzdHJpbmcsIHNtYWxsUGF0aDpzdHJpbmcsIGlucHV0UGF0aDpzdHJpbmcsIGZvbGRlcjpzdHJpbmcsIHBhZ2VUeXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBTbWFsbFBhdGg6IENyZWF0ZUZpbGVQYXRoT25lUGF0aChzbWFsbFBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSwgMiksXG4gICAgICAgIEZ1bGxQYXRoOiBDcmVhdGVGaWxlUGF0aE9uZVBhdGgoZmlsZVBhdGgsIGlucHV0UGF0aCwgZm9sZGVyLCBwYWdlVHlwZSksXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBhcnNlRGVidWdMaW5lLFxuICAgIENyZWF0ZUZpbGVQYXRoLFxuICAgIFBhcnNlRGVidWdJbmZvXG59OyIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VSTENvbW1lbnQobWFwOiBTb3VyY2VNYXBHZW5lcmF0b3IsIGlzQ3NzPzogYm9vbGVhbikge1xuICAgIGxldCBtYXBTdHJpbmcgPSBgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShtYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgIGlmIChpc0NzcylcbiAgICAgICAgbWFwU3RyaW5nID0gYC8qIyAke21hcFN0cmluZ30qL2BcbiAgICBlbHNlXG4gICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgIHJldHVybiAnXFxyXFxuJyArIG1hcFN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE1lcmdlU291cmNlTWFwKGdlbmVyYXRlZE1hcDogUmF3U291cmNlTWFwLCBvcmlnaW5hbE1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIob3JpZ2luYWxNYXApO1xuICAgIGNvbnN0IG5ld01hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGdlbmVyYXRlZE1hcCkpLmVhY2hNYXBwaW5nKG0gPT4ge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG9yaWdpbmFsLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe2xpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW59KVxuICAgICAgICBpZighbG9jYXRpb24uc291cmNlKSByZXR1cm47XG4gICAgICAgIG5ld01hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IGxvY2F0aW9uLmNvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBsb2NhdGlvbi5saW5lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiBsb2NhdGlvbi5zb3VyY2VcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdNYXA7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCguLi5kYXRhLkRhdGFBcnJheSk7XG5cbiAgICAgICAgdGhpcy5zZXREZWZhdWx0KHtcbiAgICAgICAgICAgIGluZm86IGRhdGEuSW5mb1RleHQsXG4gICAgICAgICAgICBsaW5lOiBkYXRhLk9uTGluZSxcbiAgICAgICAgICAgIGNoYXI6IGRhdGEuT25DaGFyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IGFueSB0aGluZyB0byBjb25uZWN0XG4gICAgICogQHJldHVybnMgY29ubmN0ZWQgc3RyaW5nIHdpdGggYWxsIHRoZSB0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb25jYXQoLi4udGV4dDogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dCkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIGNsb25lIHBsdXMgdGhlIG5ldyBkYXRhIGNvbm5lY3RlZFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZVBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZ1RyYWNrZXIuY29uY2F0KHRoaXMuQ2xvbmUoKSwgLi4uZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmluZyBvciBhbnkgZGF0YSB0byB0aGlzIHN0cmluZ1xuICAgICAqIEBwYXJhbSBkYXRhIGNhbiBiZSBhbnkgdGhpbmdcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyAobm90IG5ldyBzdHJpbmcpXG4gICAgICovXG4gICAgcHVibGljIFBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0aW5mbyA9IGkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSwgbGFzdGluZm8uaW5mbywgbGFzdGluZm8ubGluZSwgbGFzdGluZm8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5zIG90IG90aGVyIGRhdGEgd2l0aCAnVGVtcGxhdGUgbGl0ZXJhbHMnXG4gICAgICogdXNlZCBsaWtlIHRoaXM6IG15U3RyaW4uJFBsdXMgYHRoaXMgdmVyeSR7Y29vbFN0cmluZ30hYFxuICAgICAqIEBwYXJhbSB0ZXh0cyBhbGwgdGhlIHNwbGl0ZWQgdGV4dFxuICAgICAqIEBwYXJhbSB2YWx1ZXMgYWxsIHRoZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyQodGV4dHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgYW55KVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0VmFsdWU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dHNbaV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcblxuICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dCwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcodmFsdWUpLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHRzW3RleHRzLmxlbmd0aCAtIDFdLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBzdHJpbmcgdG8gYWRkXG4gICAgICogQHBhcmFtIGFjdGlvbiB3aGVyZSB0byBhZGQgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gaW5mbyBpbmZvIHRoZSBjb21lIHdpdGggdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQWRkVGV4dEFjdGlvbih0ZXh0OiBzdHJpbmcsIGFjdGlvbjogXCJwdXNoXCIgfCBcInVuc2hpZnRcIiwgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8sIExpbmVDb3VudCA9IDAsIENoYXJDb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlOiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIGRhdGFTdG9yZS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5EYXRhQXJyYXlbYWN0aW9uXSguLi5kYXRhU3RvcmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlcih0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwicHVzaFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmcgd2l0aG91dCB0cmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXJOb1RyYWNrKHRleHQ6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZSh0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwidW5zaGlmdFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gKiBAcGFyYW0gdGV4dCBcbiAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY29weSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgY29weS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnVuc2hpZnQoLi4uY29weSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZXh0IEZpbGUgVHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZEZpbGVUZXh0KHRleHQ6IHN0cmluZywgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pIHtcbiAgICAgICAgbGV0IExpbmVDb3VudCA9IDEsIENoYXJDb3VudCA9IDE7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNpbXBsZSBtZXRob2YgdG8gY3V0IHN0cmluZ1xuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIG5ldyBjdXR0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBDdXRTdHJpbmcoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5wdXNoKC4uLnRoaXMuRGF0YUFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN1YnN0cmluZy1saWtlIG1ldGhvZCwgbW9yZSBsaWtlIGpzIGN1dHRpbmcgc3RyaW5nLCBpZiB0aGVyZSBpcyBub3QgcGFyYW1ldGVycyBpdCBjb21wbGV0ZSB0byAwXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cmluZyhzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGlzTmFOKGVuZCkpIHtcbiAgICAgICAgICAgIGVuZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZCA9IE1hdGguYWJzKGVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOYU4oc3RhcnQpKSB7XG4gICAgICAgICAgICBzdGFydCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5hYnMoc3RhcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ3V0U3RyaW5nKHN0YXJ0LCBlbmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN1YnN0ci1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHIoc3RhcnQ6IG51bWJlciwgbGVuZ3RoPzogbnVtYmVyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGxlbmd0aCAhPSBudWxsID8gbGVuZ3RoICsgc3RhcnQgOiBsZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNsaWNlLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHNsaWNlKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kIDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGFyQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCFwb3MpIHtcbiAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuQ3V0U3RyaW5nKHBvcywgcG9zICsgMSk7XG4gICAgfVxuXG4gICAgcHVibGljIGF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGFyQ29kZUF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jaGFyQ29kZUF0KDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb2RlUG9pbnRBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY29kZVBvaW50QXQoMCk7XG4gICAgfVxuXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYXIgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICAgICAgY2hhci5EYXRhQXJyYXkucHVzaChpKTtcbiAgICAgICAgICAgIHlpZWxkIGNoYXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TGluZShsaW5lOiBudW1iZXIsIHN0YXJ0RnJvbU9uZSA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXQoJ1xcbicpW2xpbmUgLSArc3RhcnRGcm9tT25lXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb252ZXJ0IHVmdC0xNiBsZW5ndGggdG8gY291bnQgb2YgY2hhcnNcbiAgICAgKiBAcGFyYW0gaW5kZXggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGFyTGVuZ3RoKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGluZGV4IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIGluZGV4IC09IGNoYXIudGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoaW5kZXggPD0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuaW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxhc3RJbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmxhc3RJbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBhID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoZSBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdW5pY29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRUZXh0QWZ0ZXIodGhpcy51bmljb2RlTWUoaS50ZXh0KSwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWFyY2gocmVnZXg6IFJlZ0V4cCB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLnNlYXJjaChyZWdleCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuc3RhcnRzV2l0aChzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kc1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5lbmRzV2l0aChzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5jbHVkZXMoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5pbmNsdWRlcyhzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVN0YXJ0KCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1FbmQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1FbmQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1SaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKS50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIFNwYWNlT25lKGFkZEluc2lkZT86IHN0cmluZykge1xuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuYXQoMCk7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuYXQodGhpcy5sZW5ndGggLSAxKTtcbiAgICAgICAgY29uc3QgY29weSA9IHRoaXMuQ2xvbmUoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHN0YXJ0LmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRCZWZvcmUoYWRkSW5zaWRlIHx8IHN0YXJ0LmVxLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuaW5mbywgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEFmdGVyKGFkZEluc2lkZSB8fCBlbmQuZXEsIGVuZC5EZWZhdWx0SW5mb1RleHQuaW5mbywgZW5kLkRlZmF1bHRJbmZvVGV4dC5saW5lLCBlbmQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBY3Rpb25TdHJpbmcoQWN0OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBuZXdTdHJpbmcuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBpLnRleHQgPSBBY3QoaS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlTG93ZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlTG93ZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVVcHBlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVVcHBlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1VwcGVyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b1VwcGVyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb3dlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy5ub3JtYWxpemUoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBTdHJpbmdJbmRleGVyKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKTogU3RyaW5nSW5kZXhlckluZm9bXSB7XG4gICAgICAgIGlmIChyZWdleCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4LCByZWdleC5mbGFncy5yZXBsYWNlKCdnJywgJycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbFNwbGl0OiBTdHJpbmdJbmRleGVySW5mb1tdID0gW107XG5cbiAgICAgICAgbGV0IG1haW5UZXh0ID0gdGhpcy5PbmVTdHJpbmcsIGhhc01hdGg6IFJlZ0V4cE1hdGNoQXJyYXkgPSBtYWluVGV4dC5tYXRjaChyZWdleCksIGFkZE5leHQgPSAwLCBjb3VudGVyID0gMDtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgYWRkTmV4dCArPSBpbmRleCArIGxlbmd0aDtcblxuICAgICAgICAgICAgaGFzTWF0aCA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxTcGxpdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCkge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoJ24nLCBzZWFyY2hWYWx1ZSkudW5pY29kZS5lcTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3BsaXQoc2VwYXJhdG9yOiBzdHJpbmcgfCBSZWdFeHAsIGxpbWl0PzogbnVtYmVyKTogU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgY29uc3QgYWxsU3BsaXRlZCA9IHRoaXMuU3RyaW5nSW5kZXhlcih0aGlzLlJlZ2V4SW5TdHJpbmcoc2VwYXJhdG9yKSwgbGltaXQpO1xuICAgICAgICBjb25zdCBuZXdTcGxpdDogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxTcGxpdGVkKSB7XG4gICAgICAgICAgICBuZXdTcGxpdC5wdXNoKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQsIGkuaW5kZXgpKTtcbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTcGxpdC5wdXNoKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3BsaXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGVhdChjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgam9pbihhcnI6IFN0cmluZ1RyYWNrZXJbXSl7XG4gICAgICAgIGxldCBhbGwgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuICAgICAgICBmb3IoY29uc3QgaSBvZiBhcnIpe1xuICAgICAgICAgICAgYWxsLkFkZENsb25lKGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBsYWNlV2l0aFRpbWVzKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYWxsU3BsaXRlZCA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSwgbGltaXQpO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxTcGxpdGVkKSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcuQ2xvbmVQbHVzKFxuICAgICAgICAgICAgICAgIHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQsIGkuaW5kZXgpLFxuICAgICAgICAgICAgICAgIHJlcGxhY2VWYWx1ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZShzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUsIHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwID8gdW5kZWZpbmVkIDogMSlcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZXIoc2VhcmNoVmFsdWU6IFJlZ0V4cCwgZnVuYzogKGRhdGE6IEFycmF5TWF0Y2gpID0+IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgbGV0IGNvcHkgPSB0aGlzLkNsb25lKCksIFNwbGl0VG9SZXBsYWNlOiBBcnJheU1hdGNoO1xuICAgICAgICBmdW5jdGlvbiBSZU1hdGNoKCkge1xuICAgICAgICAgICAgU3BsaXRUb1JlcGxhY2UgPSBjb3B5Lm1hdGNoKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBSZU1hdGNoKCk7XG5cbiAgICAgICAgY29uc3QgbmV3VGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGNvcHkuU3RhcnRJbmZvKTtcblxuICAgICAgICB3aGlsZSAoU3BsaXRUb1JlcGxhY2UpIHtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhjb3B5LnN1YnN0cmluZygwLCBTcGxpdFRvUmVwbGFjZS5pbmRleCkpO1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGZ1bmMoU3BsaXRUb1JlcGxhY2UpKTtcblxuICAgICAgICAgICAgY29weSA9IGNvcHkuc3Vic3RyaW5nKFNwbGl0VG9SZXBsYWNlLmluZGV4ICsgU3BsaXRUb1JlcGxhY2VbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIFJlTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdUZXh0LlBsdXMoY29weSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJlcGxhY2VyQXN5bmMoc2VhcmNoVmFsdWU6IFJlZ0V4cCwgZnVuYzogKGRhdGE6IEFycmF5TWF0Y2gpID0+IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pIHtcbiAgICAgICAgbGV0IGNvcHkgPSB0aGlzLkNsb25lKCksIFNwbGl0VG9SZXBsYWNlOiBBcnJheU1hdGNoO1xuICAgICAgICBmdW5jdGlvbiBSZU1hdGNoKCkge1xuICAgICAgICAgICAgU3BsaXRUb1JlcGxhY2UgPSBjb3B5Lm1hdGNoKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBSZU1hdGNoKCk7XG5cbiAgICAgICAgY29uc3QgbmV3VGV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGNvcHkuU3RhcnRJbmZvKTtcblxuICAgICAgICB3aGlsZSAoU3BsaXRUb1JlcGxhY2UpIHtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhjb3B5LnN1YnN0cmluZygwLCBTcGxpdFRvUmVwbGFjZS5pbmRleCkpO1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGF3YWl0IGZ1bmMoU3BsaXRUb1JlcGxhY2UpKTtcblxuICAgICAgICAgICAgY29weSA9IGNvcHkuc3Vic3RyaW5nKFNwbGl0VG9SZXBsYWNlLmluZGV4ICsgU3BsaXRUb1JlcGxhY2VbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIFJlTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdUZXh0LlBsdXMoY29weSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1RleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlKVxuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaEFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgY29uc3QgYWxsTWF0Y2hzID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgY29uc3QgbWF0aEFycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbE1hdGNocykge1xuICAgICAgICAgICAgbWF0aEFycmF5LnB1c2godGhpcy5zdWJzdHIoaS5pbmRleCwgaS5sZW5ndGgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXRoQXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBBcnJheU1hdGNoIHwgU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwICYmIHNlYXJjaFZhbHVlLmdsb2JhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hBbGwoc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuT25lU3RyaW5nLm1hdGNoKHNlYXJjaFZhbHVlKTtcblxuICAgICAgICBpZiAoZmluZCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBSZXN1bHRBcnJheTogQXJyYXlNYXRjaCA9IFtdO1xuXG4gICAgICAgIFJlc3VsdEFycmF5WzBdID0gdGhpcy5zdWJzdHIoZmluZC5pbmRleCwgZmluZC5zaGlmdCgpLmxlbmd0aCk7XG4gICAgICAgIFJlc3VsdEFycmF5LmluZGV4ID0gZmluZC5pbmRleDtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5wdXQgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgbGV0IG5leHRNYXRoID0gUmVzdWx0QXJyYXlbMF0uQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZmluZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKE51bWJlcihpKSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGUgPSBmaW5kW2ldO1xuXG4gICAgICAgICAgICBpZiAoZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVzdWx0QXJyYXkucHVzaCg8YW55PmUpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmaW5kSW5kZXggPSBuZXh0TWF0aC5pbmRleE9mKGUpO1xuICAgICAgICAgICAgUmVzdWx0QXJyYXkucHVzaChuZXh0TWF0aC5zdWJzdHIoZmluZEluZGV4LCBlLmxlbmd0aCkpO1xuICAgICAgICAgICAgbmV4dE1hdGggPSBuZXh0TWF0aC5zdWJzdHJpbmcoZmluZEluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZXN1bHRBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0cmFjdEluZm8odHlwZSA9ICc8bGluZT4nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8uc3BsaXQodHlwZSkucG9wKCkudHJpbSgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBlcnJvciBpbmZvIGZvcm0gZXJyb3IgbWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBkZWJ1Z0xpbmUoeyBtZXNzYWdlLCB0ZXh0LCBsb2NhdGlvbiwgbGluZSwgY29sfTogeyBtZXNzYWdlPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBsb2NhdGlvbj86IHsgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgbGluZVRleHQ/OiBzdHJpbmcgfSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyfSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKGxpbmUgPz8gbG9jYXRpb24/LmxpbmUgPz8gMSksIGNvbHVtbiA9IGNvbCA/PyBsb2NhdGlvbj8uY29sdW1uID8/IDA7XG4gICAgICAgIGlmIChzZWFyY2hMaW5lLnN0YXJ0c1dpdGgoJy8vJykpIHtcbiAgICAgICAgICAgIHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUoKGxpbmUgPz8gbG9jYXRpb24/LmxpbmUpIC0gMSk7XG4gICAgICAgICAgICBjb2x1bW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBzZWFyY2hMaW5lLmF0KGNvbHVtbi0xKS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIHJldHVybiBgJHt0ZXh0IHx8IG1lc3NhZ2V9LCBvbiBmaWxlIC0+ICR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrc2VhcmNoTGluZS5leHRyYWN0SW5mbygpfToke2RhdGEubGluZX06JHtkYXRhLmNoYXJ9JHtsb2NhdGlvbj8ubGluZVRleHQgPyAnXFxMaW5lOiBcIicgKyBsb2NhdGlvbi5saW5lVGV4dDogJ1wiJ31gO1xuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdXaXRoVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gb3V0cHV0V2l0aE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uKVxuICAgIH1cblxuICAgIHB1YmxpYyBTdHJpbmdUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgICAgIHJldHVybiBvdXRwdXRNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbiwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpXG4gICAgfVxufSIsICJpbXBvcnQge3Byb21pc2VzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmNvbnN0IGxvYWRQYXRoID0gdHlwZW9mIGVzYnVpbGQgIT09ICd1bmRlZmluZWQnID8gJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvJzogJy8uLi8nO1xuY29uc3Qgd2FzbU1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwgKyBsb2FkUGF0aCArICdidWlsZC53YXNtJykpKTtcbmNvbnN0IHdhc21JbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZSh3YXNtTW9kdWxlLCB7fSk7XG5jb25zdCB3YXNtID0gd2FzbUluc3RhbmNlLmV4cG9ydHM7XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5sZXQgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldFVpbnQ4TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQ4TWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQ4TWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RW5jb2RlciA6IFRleHRFbmNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgbFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXJfaHRtbF9lbGVtKHRleHQsIHNlYXJjaCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAodGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VhcmNoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9jbG9zZV9jaGFyX2h0bWxfZWxlbShwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2Nsb3NlX2NoYXIodGV4dCwgc2VhcmNoKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWFyY2gsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcmV0ID0gd2FzbS5maW5kX2Nsb3NlX2NoYXIocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxubGV0IGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRJbnQzMk1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRJbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRJbnQzMk1lbW9yeTA7XG59XG5cbmNvbnN0IGxUZXh0RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dERlY29kZXIgOiBUZXh0RGVjb2RlcjtcblxubGV0IGNhY2hlZFRleHREZWNvZGVyID0gbmV3IGxUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG4vKipcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2Vycm9ycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5nZXRfZXJyb3JzKHJldHB0cik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gYmxvY2tcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZF9lbmRfYmxvY2sodGV4dCwgYmxvY2spIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGJsb2NrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfYmxvY2socHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSBza2lwX3NwZWNpYWxfdGFnXG4qIEBwYXJhbSB7c3RyaW5nfSBzaW1wbGVfc2tpcFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfY29tcG9uZW50KHNraXBfc3BlY2lhbF90YWcsIHNpbXBsZV9za2lwKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChza2lwX3NwZWNpYWxfdGFnLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChzaW1wbGVfc2tpcCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHdhc20uaW5zZXJ0X2NvbXBvbmVudChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRfdHlwZVxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2VuZF9vZl9kZWYodGV4dCwgZW5kX3R5cGUpIHtcbiAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZF90eXBlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfZGVmKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gcV90eXBlXG4qIEByZXR1cm5zIHtudW1iZXJ9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfZW5kX29mX3EodGV4dCwgcV90eXBlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHJldCA9IHdhc20uZmluZF9lbmRfb2ZfcShwdHIwLCBsZW4wLCBxX3R5cGUuY29kZVBvaW50QXQoMCkpO1xuICAgIHJldHVybiByZXQgPj4+IDA7XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanModGV4dCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHRleHQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzKHJldHB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICB9XG59XG5cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYXpvcl90b19lanNfbWluKHRleHQsIG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKG5hbWUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20ucmF6b3JfdG9fZWpzX21pbihyZXRwdHIsIHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpO1xuICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgfVxufVxuXG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0XG4qIEBwYXJhbSB7c3RyaW5nfSBlbmRcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZWpzX3BhcnNlKHRleHQsIHN0YXJ0LCBlbmQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0ZXh0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHN0YXJ0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKGVuZCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMiA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5lanNfcGFyc2UocmV0cHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwdHIyLCBsZW4yKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgIH1cbn1cblxuIiwgImV4cG9ydCBjb25zdCBTaW1wbGVTa2lwID0gWyd0ZXh0YXJlYScsJ3NjcmlwdCcsICdzdHlsZSddO1xuZXhwb3J0IGNvbnN0IFNraXBTcGVjaWFsVGFnID0gW1tcIiVcIiwgXCIlXCJdLCBbXCIje2RlYnVnfVwiLCBcIntkZWJ1Z30jXCJdXTsiLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgZmluZF9lbmRfb2ZfZGVmLCBmaW5kX2VuZF9vZl9xLCBmaW5kX2VuZF9ibG9jayB9IGZyb20gJy4uLy4uL3N0YXRpYy93YXNtL2NvbXBvbmVudC9pbmRleC5qcyc7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvU2V0dGluZ3MuanMnO1xuaW1wb3J0IHsgZ2V0RGlybmFtZSwgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB3b3JrZXJQb29sIGZyb20gJ3dvcmtlcnBvb2wnO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcG9vbCA9IHdvcmtlclBvb2wucG9vbChTeXN0ZW1EYXRhICsgJy8uLi9zdGF0aWMvd2FzbS9jb21wb25lbnQvd29ya2VySW5zZXJ0Q29tcG9uZW50LmpzJywgeyBtYXhXb3JrZXJzOiBjcHVMZW5ndGggfSk7XG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBlbmQgb2YgcXVvdGF0aW9uIG1hcmtzLCBza2lwcGluZyB0aGluZ3MgbGlrZSBlc2NhcGluZzogXCJcXFxcXCJcIlxuICAgICAqIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBmaW5kRW50T2ZRKHRleHQ6IHN0cmluZywgcVR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBmaW5kX2VuZF9vZl9xKHRleHQsIHFUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGNoYXIgc2tpcHBpbmcgZGF0YSBpbnNpZGUgcXVvdGF0aW9uIG1hcmtzXG4gICAgICogQHJldHVybiB0aGUgaW5kZXggb2YgZW5kXG4gICAgICovXG4gICAgc3RhdGljIGZpbmRFbmRPZkRlZih0ZXh0OiBzdHJpbmcsIEVuZFR5cGU6IHN0cmluZ1tdIHwgc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KEVuZFR5cGUpKSB7XG4gICAgICAgICAgICBFbmRUeXBlID0gW0VuZFR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmRfZW5kX29mX2RlZih0ZXh0LCBKU09OLnN0cmluZ2lmeShFbmRUeXBlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2FtZSBhcyAnZmluZEVuZE9mRGVmJyBvbmx5IHdpdGggb3B0aW9uIHRvIGN1c3RvbSAnb3BlbicgYW5kICdjbG9zZSdcbiAgICAgKiBgYGBqc1xuICAgICAqIEZpbmRFbmRPZkJsb2NrKGBjb29sIFwifVwiIHsgZGF0YSB9IH0gbmV4dGAsICd7JywgJ30nKVxuICAgICAqIGBgYFxuICAgICAqIGl0IHdpbGwgcmV0dXJuIHRoZSAxOCAtPiBcIn0gbmV4dFwiXG4gICAgICogIEByZXR1cm4gdGhlIGluZGV4IG9mIGVuZFxuICAgICAqL1xuICAgIHN0YXRpYyBGaW5kRW5kT2ZCbG9jayh0ZXh0OiBzdHJpbmcsIG9wZW46IHN0cmluZywgZW5kOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmluZF9lbmRfYmxvY2sodGV4dCwgb3BlbiArIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgU2ltcGxlU2tpcDogc3RyaW5nW10gPSBTZXR0aW5ncy5TaW1wbGVTa2lwO1xuICAgIFNraXBTcGVjaWFsVGFnOiBzdHJpbmdbXVtdID0gU2V0dGluZ3MuU2tpcFNwZWNpYWxUYWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW50TmV3PzogYW55KSB7IH1cblxuICAgIHByaXZhdGUgcHJpbnRFcnJvcnModGV4dDogU3RyaW5nVHJhY2tlciwgZXJyb3JzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByaW50TmV3KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIEpTT04ucGFyc2UoZXJyb3JzKS5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXcoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7aS50eXBlX25hbWV9XCIsIHVzZWQgaW46ICR7dGV4dC5hdChOdW1iZXIoaS5pbmRleCkpLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjbG9zZS10YWdcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIEZpbmRDbG9zZUNoYXIodGV4dDogU3RyaW5nVHJhY2tlciwgU2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3BvaW50LCBlcnJvcnNdID0gYXdhaXQgcG9vbC5leGVjKCdGaW5kQ2xvc2VDaGFyJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBGaW5kQ2xvc2VDaGFySFRNTCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBTZWFyY2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcG9pbnQsIGVycm9yc10gPSBhd2FpdCBwb29sLmV4ZWMoJ0ZpbmRDbG9zZUNoYXJIVE1MJywgW3RleHQuZXEsIFNlYXJjaF0pO1xuICAgICAgICB0aGlzLnByaW50RXJyb3JzKHRleHQsIGVycm9ycyk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH1cbn1cblxudHlwZSBQYXJzZUJsb2NrcyA9IHsgbmFtZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciB9W11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJhem9yVG9FSlModGV4dDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnUmF6b3JUb0VKUycsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmF6b3JUb0VKU01pbmkodGV4dDogc3RyaW5nLCBmaW5kOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcG9vbC5leGVjKCdSYXpvclRvRUpTTWluaScsIFt0ZXh0LGZpbmRdKSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEVKU1BhcnNlcih0ZXh0OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogUHJvbWlzZTxQYXJzZUJsb2Nrcz4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHBvb2wuZXhlYygnRUpTUGFyc2VyJywgW3RleHQsIHN0YXJ0LCBlbmRdKSk7XG59IiwgIlxuaW1wb3J0IHdvcmtlclBvb2wgZnJvbSAnd29ya2VycG9vbCc7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuaW50ZXJmYWNlIFNwbGl0VGV4dCB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHR5cGVfbmFtZTogc3RyaW5nLFxuICAgIGlzX3NraXA6IGJvb2xlYW5cbn1cblxuY29uc3QgY3B1TGVuZ3RoID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjcHVzKCkubGVuZ3RoIC8gMikpO1xuY29uc3QgcGFyc2Vfc3RyZWFtID0gd29ya2VyUG9vbC5wb29sKFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy93YXNtL3JlYWRlci93b3JrZXIuanMnLCB7IG1heFdvcmtlcnM6IGNwdUxlbmd0aCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBhcnNlVGV4dFN0cmVhbSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPFNwbGl0VGV4dFtdPiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2J1aWxkX3N0cmVhbScsIFt0ZXh0XSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRW5kT2ZEZWZTa2lwQmxvY2sodGV4dDogc3RyaW5nLCB0eXBlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZV9zdHJlYW0uZXhlYygnZmluZF9lbmRfb2ZfZGVmX3NraXBfYmxvY2snLCBbdGV4dCwgSlNPTi5zdHJpbmdpZnkodHlwZXMpXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBFbmRPZkJsb2NrKHRleHQ6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gYXdhaXQgcGFyc2Vfc3RyZWFtLmV4ZWMoJ2VuZF9vZl9ibG9jaycsIFt0ZXh0LCB0eXBlcy5qb2luKCcnKV0pO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCYXNlRW50aXR5Q29kZSB7XG4gICAgUmVwbGFjZUFsbCh0ZXh0OiBzdHJpbmcsIGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQuc3BsaXQoZmluZCkpIHtcbiAgICAgICAgICAgIG5ld1RleHQgKz0gcmVwbGFjZSArIGk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dC5zdWJzdHJpbmcocmVwbGFjZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuXG5hYnN0cmFjdCBjbGFzcyBSZUJ1aWxkQ29kZUJhc2ljIGV4dGVuZHMgQmFzZUVudGl0eUNvZGUge1xuICAgIHB1YmxpYyBQYXJzZUFycmF5OiBTcGxpdFRleHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuUGFyc2VBcnJheSA9IFBhcnNlQXJyYXk7XG4gICAgfVxuXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBsZXQgT3V0U3RyaW5nID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5QYXJzZUFycmF5KSB7XG4gICAgICAgICAgICBPdXRTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUmVwbGFjZUFsbChPdXRTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuXG5cbnR5cGUgRGF0YUNvZGVJbmZvID0ge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbnB1dHM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBjbGFzcyBSZUJ1aWxkQ29kZVN0cmluZyBleHRlbmRzIFJlQnVpbGRDb2RlQmFzaWMge1xuICAgIHByaXZhdGUgRGF0YUNvZGU6IERhdGFDb2RlSW5mbztcblxuICAgIGNvbnN0cnVjdG9yKFBhcnNlQXJyYXk6IFNwbGl0VGV4dFtdKSB7XG4gICAgICAgIHN1cGVyKFBhcnNlQXJyYXkpO1xuICAgICAgICB0aGlzLkRhdGFDb2RlID0geyB0ZXh0OiBcIlwiLCBpbnB1dHM6IFtdIH07XG4gICAgICAgIHRoaXMuQ3JlYXRlRGF0YUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgQ29kZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUNvZGUudGV4dDtcbiAgICB9XG5cbiAgICBzZXQgQ29kZUJ1aWxkVGV4dCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgQWxsSW5wdXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBDcmVhdGVEYXRhQ29kZSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuUGFyc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGkuaXNfc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuRGF0YUNvZGUudGV4dCArPSBgPHwke3RoaXMuRGF0YUNvZGUuaW5wdXRzLmxlbmd0aH18JHtpLnR5cGVfbmFtZSA/PyAnJ318PmA7XG4gICAgICAgICAgICAgICAgdGhpcy5EYXRhQ29kZS5pbnB1dHMucHVzaChpLnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGFDb2RlLnRleHQgKz0gaS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIDx8fD4gc3RhcnQgd2l0aCBhICgrLikgbGlrZSB0aGF0IGZvciBleGFtcGxlLCBcIisuPHx8PlwiLCB0aGUgdXBkYXRlIGZ1bmN0aW9uIHdpbGwgZ2V0IHRoZSBsYXN0IFwiU2tpcFRleHRcIiBpbnN0ZWFkIGdldHRpbmcgdGhlIG5ldyBvbmVcbiAgICAgKiBzYW1lIHdpdGggYSAoLS4pIGp1c3QgZm9yIGlnbm9yaW5nIGN1cnJlbnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB0aGUgYnVpbGRlZCBjb2RlXG4gICAgICovXG4gICAgQnVpbGRDb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkRhdGFDb2RlLnRleHQucmVwbGFjZSgvPFxcfChbMC05XSspXFx8W1xcd10qXFx8Pi9naSwgKF8sIGcxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EYXRhQ29kZS5pbnB1dHNbZzFdO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuUmVwbGFjZUFsbChuZXdTdHJpbmcsICc8fC18PicsICc8fHw+Jyk7XG4gICAgfVxufVxuIiwgImltcG9ydCBTdHJpbmdUcmFja2VyLCB7IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJhc2VSZWFkZXIsIEVKU1BhcnNlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgUGFyc2VUZXh0U3RyZWFtLCBSZUJ1aWxkQ29kZVN0cmluZyB9IGZyb20gJy4vdHJhbnNmb3JtL0Vhc3lTY3JpcHQnO1xuXG5pbnRlcmZhY2UgSlNQYXJzZXJWYWx1ZXMge1xuICAgIHR5cGU6ICd0ZXh0JyB8ICdzY3JpcHQnIHwgJ25vLXRyYWNrJyxcbiAgICB0ZXh0OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTUGFyc2VyIHtcbiAgICBwdWJsaWMgc3RhcnQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dDogU3RyaW5nVHJhY2tlcjtcbiAgICBwdWJsaWMgZW5kOiBzdHJpbmc7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZXM6IEpTUGFyc2VyVmFsdWVzW107XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcsIHN0YXJ0ID0gXCI8JVwiLCBlbmQgPSBcIiU+XCIsIHR5cGUgPSAnc2NyaXB0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIFJlcGxhY2VWYWx1ZXMoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0LnJlcGxhY2VBbGwoZmluZCwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZmluZEVuZE9mRGVmR2xvYmFsKHRleHQ6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgZXEgPSB0ZXh0LmVxXG4gICAgICAgIGNvbnN0IGZpbmQgPSBCYXNlUmVhZGVyLmZpbmRFbmRPZkRlZihlcSwgWyc7JywgJ1xcbicsIHRoaXMuZW5kXSk7XG4gICAgICAgIHJldHVybiBmaW5kICE9IC0xID8gZmluZCArIDEgOiBlcS5sZW5ndGg7XG4gICAgfVxuXG4gICAgU2NyaXB0V2l0aEluZm8odGV4dDogU3RyaW5nVHJhY2tlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBXaXRoSW5mbyA9IG5ldyBTdHJpbmdUcmFja2VyKHRleHQuU3RhcnRJbmZvKTtcblxuICAgICAgICBjb25zdCBhbGxTY3JpcHQgPSB0ZXh0LnNwbGl0KCdcXG4nKSwgbGVuZ3RoID0gYWxsU2NyaXB0Lmxlbmd0aDtcbiAgICAgICAgLy9uZXcgbGluZSBmb3IgZGVidWcgYXMgbmV3IGxpbmUgc3RhcnRcbiAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG5cbiAgICAgICAgLy9maWxlIG5hbWUgaW4gY29tbWVudFxuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU2NyaXB0KSB7XG5cbiAgICAgICAgICAgIGlmKGkuZXEudHJpbSgpLmxlbmd0aClcbiAgICAgICAgICAgICAgICBXaXRoSW5mby5QbHVzKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgLy8hJHtpLmxpbmVJbmZvfVxcbmApLFxuICAgICAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiAoY291bnQgIT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgV2l0aEluZm8uUGx1cygnXFxuJyk7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBXaXRoSW5mbztcbiAgICB9XG5cbiAgICBhc3luYyBmaW5kU2NyaXB0cygpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXdhaXQgRUpTUGFyc2VyKHRoaXMudGV4dC5lcSwgdGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGxldCBzdWJzdHJpbmcgPSB0aGlzLnRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gaS5uYW1lO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGkubmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgICAgICAgICBzdWJzdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpLlBsdXMkYHdyaXRlKCR7c3Vic3RyaW5nfSk7YDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZXNjYXBlXCI6XG4gICAgICAgICAgICAgICAgICAgIHN1YnN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCkuUGx1cyRgd3JpdGVTYWZlKCR7c3Vic3RyaW5nfSk7YDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVidWdcIjpcbiAgICAgICAgICAgICAgICAgICAgc3Vic3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJGBcXG5ydW5fc2NyaXB0X25hbWUgPSBcXGAke0pTUGFyc2VyLmZpeFRleHQoc3Vic3RyaW5nKX1cXGA7YFxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ25vLXRyYWNrJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IHN1YnN0cmluZyxcbiAgICAgICAgICAgICAgICB0eXBlOiA8YW55PnR5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGZpeFRleHQodGV4dDogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcL2dpLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9gL2dpLCAnXFxcXGAnKS5yZXBsYWNlKC9cXCQvZ2ksICdcXFxcdTAwMjQnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VGV4dFNpbXBsZVF1b3Rlcyh0ZXh0OiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXC9naSwgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKTtcbiAgICB9XG5cbiAgICBSZUJ1aWxkVGV4dCgpIHtcbiAgICAgICAgY29uc3QgYWxsY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMudmFsdWVzWzBdPy50ZXh0Py5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkudGV4dC5lcSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBhbGxjb2RlLlBsdXMoaS50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkudHlwZSA9PSAnbm8tdHJhY2snKSB7XG4gICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKHRoaXMuc3RhcnQsICchJywgaS50ZXh0LCB0aGlzLmVuZCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxsY29kZS5QbHVzKHRoaXMuc3RhcnQsIGkudGV4dCwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbGNvZGU7XG4gICAgfVxuXG4gICAgQnVpbGRBbGwoaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBydW5TY3JpcHQgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLnZhbHVlc1swXT8udGV4dD8uU3RhcnRJbmZvKTtcblxuICAgICAgICBpZiAoIXRoaXMudmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJ1blNjcmlwdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS50ZXh0LmVxICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blNjcmlwdC5QbHVzJGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz1cXGAke0pTUGFyc2VyLmZpeFRleHQoaS50ZXh0KX1cXGA7YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpc0RlYnVnICYmIGkudHlwZSA9PSAnc2NyaXB0Jykge1xuICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHQuUGx1cyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGBcXG5ydW5fc2NyaXB0X2NvZGU9XFxgJHtKU1BhcnNlci5maXhUZXh0KGkudGV4dCl9XFxgO2ApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TY3JpcHRXaXRoSW5mbyhpLnRleHQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuU2NyaXB0LlBsdXMoaS50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcnVuU2NyaXB0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcHJpbnRFcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+JHttZXNzYWdlfTwvcD5gO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBSdW5BbmRFeHBvcnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBKU1BhcnNlcih0ZXh0LCBwYXRoKVxuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5CdWlsZEFsbChpc0RlYnVnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzcGxpdDJGcm9tRW5kKHRleHQ6IHN0cmluZywgc3BsaXRDaGFyOiBzdHJpbmcsIG51bVRvU3BsaXRGcm9tRW5kID0gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGV4dC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT0gc3BsaXRDaGFyKSB7XG4gICAgICAgICAgICAgICAgbnVtVG9TcGxpdEZyb21FbmQtLTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG51bVRvU3BsaXRGcm9tRW5kID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3RleHQuc3Vic3RyaW5nKDAsIGkpLCB0ZXh0LnN1YnN0cmluZyhpICsgMSldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcbiAgICB9XG59XG5cblxuLy9idWlsZCBzcGVjaWFsIGNsYXNzIGZvciBwYXJzZXIgY29tbWVudHMgLyoqLyBzbyB5b3UgYmUgYWJsZSB0byBhZGQgUmF6b3IgaW5zaWRlIG9mIHN0eWxlIG90IHNjcmlwdCB0YWdcblxuaW50ZXJmYWNlIEdsb2JhbFJlcGxhY2VBcnJheSB7XG4gICAgdHlwZTogJ3NjcmlwdCcgfCAnbm8tdHJhY2snLFxuICAgIHRleHQ6IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGNsYXNzIEVuYWJsZUdsb2JhbFJlcGxhY2Uge1xuICAgIHByaXZhdGUgc2F2ZWRCdWlsZERhdGE6IEdsb2JhbFJlcGxhY2VBcnJheVtdID0gW107XG4gICAgcHJpdmF0ZSBidWlsZENvZGU6IFJlQnVpbGRDb2RlU3RyaW5nO1xuICAgIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVwbGFjZXI6IFJlZ0V4cDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRkVGV4dCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlciA9IFJlZ0V4cChgJHthZGRUZXh0fVxcXFwvXFxcXCohc3lzdGVtLS08XFxcXHxlanNcXFxcfChbMC05XSlcXFxcfD5cXFxcKlxcXFwvfHN5c3RlbS0tPFxcXFx8ZWpzXFxcXHwoWzAtOV0pXFxcXHw+YCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZChjb2RlOiBTdHJpbmdUcmFja2VyLCBwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5idWlsZENvZGUgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcoYXdhaXQgUGFyc2VUZXh0U3RyZWFtKGF3YWl0IHRoaXMuRXh0cmFjdEFuZFNhdmVDb2RlKGNvZGUpKSk7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBFeHRyYWN0QW5kU2F2ZUNvZGUoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBleHRyYWN0Q29kZSA9IG5ldyBKU1BhcnNlcihjb2RlLCB0aGlzLnBhdGgpO1xuICAgICAgICBhd2FpdCBleHRyYWN0Q29kZS5maW5kU2NyaXB0cygpO1xuXG4gICAgICAgIGxldCBuZXdUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBleHRyYWN0Q29kZS52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBpLnRleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRCdWlsZERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGkudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbmV3VGV4dCArPSBgc3lzdGVtLS08fGVqc3wke2NvdW50ZXIrK318PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFBhcnNlT3V0c2lkZU9mQ29tbWVudCh0ZXh0OiBTdHJpbmdUcmFja2VyKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2VyKC9zeXN0ZW0tLTxcXHxlanNcXHwoWzAtOV0pXFx8Pi8sIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBTcGxpdFRvUmVwbGFjZVsxXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihpbmRleC5TdGFydEluZm8pLlBsdXMkYCR7dGhpcy5hZGRUZXh0fS8qIXN5c3RlbS0tPHxlanN8JHtpbmRleH18PiovYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIFN0YXJ0QnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhY3RDb21tZW50cyA9IG5ldyBKU1BhcnNlcihuZXcgU3RyaW5nVHJhY2tlcihudWxsLCB0aGlzLmJ1aWxkQ29kZS5Db2RlQnVpbGRUZXh0KSwgdGhpcy5wYXRoLCAnLyonLCAnKi8nKTtcbiAgICAgICAgYXdhaXQgZXh0cmFjdENvbW1lbnRzLmZpbmRTY3JpcHRzKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGV4dHJhY3RDb21tZW50cy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgaS50ZXh0ID0gdGhpcy5QYXJzZU91dHNpZGVPZkNvbW1lbnQoaS50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRDb2RlLkNvZGVCdWlsZFRleHQgPSBleHRyYWN0Q29tbWVudHMuUmVCdWlsZFRleHQoKS5lcTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2RlLkJ1aWxkQ29kZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVzdG9yZUFzQ29kZShEYXRhOiBHbG9iYWxSZXBsYWNlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKERhdGEudGV4dC5TdGFydEluZm8pLlBsdXMkYDwlJHtEYXRhLnR5cGUgPT0gJ25vLXRyYWNrJyA/ICchJzogJyd9JHtEYXRhLnRleHR9JT5gO1xuICAgIH1cblxuICAgIHB1YmxpYyBSZXN0b3JlQ29kZShjb2RlOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2VyKHRoaXMucmVwbGFjZXIsIChTcGxpdFRvUmVwbGFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIoU3BsaXRUb1JlcGxhY2VbMV0gPz8gU3BsaXRUb1JlcGxhY2VbMl0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5SZXN0b3JlQXNDb2RlKHRoaXMuc2F2ZWRCdWlsZERhdGFbaW5kZXhdKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBidWlsZCwgTWVzc2FnZSwgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi9wcmludE1lc3NhZ2UnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlKUyh0ZXh0OiBzdHJpbmcsIHRyYWNrZXI6IFN0cmluZ1RyYWNrZXIpe1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtjb2RlLCB3YXJuaW5nc30gPSBhd2FpdCB0cmFuc2Zvcm0odGV4dCwge21pbmlmeTogdHJ1ZX0pO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIodHJhY2tlciwgd2FybmluZ3MpO1xuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIodHJhY2tlciwgZXJyKVxuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbn0iLCAiaW1wb3J0IHsgYnVpbGQsIE1lc3NhZ2UsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSAnc291cmNlLW1hcCc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3Ioe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBmaWxlUGF0aD86IHN0cmluZykge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29tcGlsYXRpb24tZXJyb3InLFxuICAgICAgICAgICAgdGV4dDogYCR7ZXJyLnRleHR9LCBvbiBmaWxlIC0+ICR7ZmlsZVBhdGggPz8gZXJyLmxvY2F0aW9uLmZpbGV9OiR7ZXJyPy5sb2NhdGlvbj8ubGluZSA/PyAwfToke2Vycj8ubG9jYXRpb24/LmNvbHVtbiA/PyAwfWBcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRVNCdWlsZFByaW50RXJyb3JTb3VyY2VNYXAoe2Vycm9yc306IHtlcnJvcnM6ICBNZXNzYWdlW119LCBzb3VyY2VNYXA6IFJhd1NvdXJjZU1hcCwgZmlsZVBhdGg/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApO1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgY29uc3Qgc291cmNlID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcihlcnIubG9jYXRpb24pO1xuICAgICAgICBpZihzb3VyY2Uuc291cmNlKVxuICAgICAgICAgICAgZXJyLmxvY2F0aW9uID0gPGFueT5zb3VyY2U7XG4gICAgfVxuICAgIEVTQnVpbGRQcmludEVycm9yKHtlcnJvcnN9LCBmaWxlUGF0aCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzOiBNZXNzYWdlW10sIGZpbGVQYXRoPzogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCB3YXJuIG9mIHdhcm5pbmdzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiB3YXJuLnBsdWdpbk5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBgJHt3YXJuLnRleHR9IG9uIGZpbGUgLT4gJHtmaWxlUGF0aCA/PyB3YXJuLmxvY2F0aW9uLmZpbGV9OiR7d2Fybj8ubG9jYXRpb24/LmxpbmUgPz8gMH06JHt3YXJuPy5sb2NhdGlvbj8uY29sdW1uID8/IDB9YFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwgd2FybmluZ3M6IE1lc3NhZ2VbXSkge1xuICAgIGZvciAoY29uc3Qgd2FybiBvZiB3YXJuaW5ncykge1xuICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuJyxcbiAgICAgICAgICAgIGVycm9yTmFtZTogd2Fybi5wbHVnaW5OYW1lLFxuICAgICAgICAgICAgdGV4dDogYmFzZS5kZWJ1Z0xpbmUod2FybilcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoYmFzZTogU3RyaW5nVHJhY2tlciwge2Vycm9yc306e2Vycm9yczogTWVzc2FnZVtdfSkge1xuICAgIGZvcihjb25zdCBlcnIgb2YgZXJyb3JzKXtcbiAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICBlcnJvck5hbWU6ICdjb21waWxhdGlvbi1lcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBiYXNlLmRlYnVnTGluZShlcnIpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwgImltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcblxuZXhwb3J0IGludGVyZmFjZSBQcmV2ZW50TG9nIHtcbiAgICBpZD86IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgZXJyb3JOYW1lOiBzdHJpbmcsXG4gICAgdHlwZT86IFwid2FyblwiIHwgXCJlcnJvclwiXG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nczoge1ByZXZlbnRFcnJvcnM6IHN0cmluZ1tdfSA9IHtcbiAgICBQcmV2ZW50RXJyb3JzOiBbXVxufVxuXG5jb25zdCBQcmV2ZW50RG91YmxlTG9nOiBzdHJpbmdbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgQ2xlYXJXYXJuaW5nID0gKCkgPT4gUHJldmVudERvdWJsZUxvZy5sZW5ndGggPSAwO1xuXG4vKipcbiAqIElmIHRoZSBlcnJvciBpcyBub3QgaW4gdGhlIFByZXZlbnRFcnJvcnMgYXJyYXksIHByaW50IHRoZSBlcnJvclxuICogQHBhcmFtIHtQcmV2ZW50TG9nfSAgLSBgaWRgIC0gVGhlIGlkIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByaW50SWZOZXcoe2lkLCB0ZXh0LCB0eXBlID0gXCJ3YXJuXCIsIGVycm9yTmFtZX06IFByZXZlbnRMb2cpIHtcbiAgICBpZighUHJldmVudERvdWJsZUxvZy5pbmNsdWRlcyhpZCA/PyB0ZXh0KSAmJiAhU2V0dGluZ3MuUHJldmVudEVycm9ycy5pbmNsdWRlcyhlcnJvck5hbWUpKXtcbiAgICAgICAgcHJpbnRbdHlwZV0odGV4dC5yZXBsYWNlKC88bGluZT4vZ2ksICcgLT4gJyksIGBcXG5cXG5FcnJvciBjb2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKTtcbiAgICAgICAgUHJldmVudERvdWJsZUxvZy5wdXNoKGlkID8/IHRleHQpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBKU1BhcnNlciBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcidcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgbWluaWZ5SlMgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9lc2J1aWxkL21pbmlmeSc7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L3RlbXAuanMnO1xuXG5hc3luYyBmdW5jdGlvbiB0ZW1wbGF0ZShCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGU6IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSwgbmFtZTogc3RyaW5nLCBwYXJhbXM6IHN0cmluZywgc2VsZWN0b3I6IHN0cmluZywgbWFpbkNvZGU6IFN0cmluZ1RyYWNrZXIsIHBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbnN0IHBhcnNlID0gYXdhaXQgSlNQYXJzZXIuUnVuQW5kRXhwb3J0KG1haW5Db2RlLCBwYXRoLCBpc0RlYnVnKTtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKS5QbHVzJCBgZnVuY3Rpb24gJHtuYW1lfSh7JHtwYXJhbXN9fSwgc2VsZWN0b3IgPSBcIiR7c2VsZWN0b3J9XCIsIG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSl7XG4gICAgICAgIGNvbnN0IHt3cml0ZSwgd3JpdGVTYWZlLCBzZXRSZXNwb25zZSwgc2VuZFRvU2VsZWN0b3J9ID0gbmV3IGJ1aWxkVGVtcGxhdGUob3V0X3J1bl9zY3JpcHQpO1xuICAgICAgICAke2F3YWl0IEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZShwYXJzZSl9XG4gICAgICAgIHZhciBleHBvcnRzID0gJHtuYW1lfS5leHBvcnRzO1xuICAgICAgICByZXR1cm4gc2VuZFRvU2VsZWN0b3Ioc2VsZWN0b3IsIG91dF9ydW5fc2NyaXB0LnRleHQpO1xuICAgIH1cXG4ke25hbWV9LmV4cG9ydHMgPSB7fTtgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgc2Vzc2lvbkluZm8uc2NyaXB0KHNlcnZlU2NyaXB0LCB7YXN5bmM6IG51bGx9KTtcblxuICAgIGxldCBzY3JpcHRJbmZvID0gYXdhaXQgdGVtcGxhdGUoXG4gICAgICAgIHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIGRhdGFUYWcuZ2V0VmFsdWUoJ3BhcmFtcycpLFxuICAgICAgICBkYXRhVGFnLmdldFZhbHVlKCdzZWxlY3RvcicpLFxuICAgICAgICBCZXR3ZWVuVGFnRGF0YSxcbiAgICAgICAgcGF0aE5hbWUsXG4gICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmICFJbnNlcnRDb21wb25lbnQuU29tZVBsdWdpbnMoXCJTYWZlRGVidWdcIilcbiAgICApO1xuXG4gICAgY29uc3QgYWRkU2NyaXB0ID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzY3JpcHQnLCBkYXRhVGFnLCB0eXBlKTtcbiAgICBpZiAoSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluSlNcIikgfHwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKFwiTWluQWxsXCIpKSB7XG4gICAgICAgIGFkZFNjcmlwdC5hZGRUZXh0KGF3YWl0IG1pbmlmeUpTKHNjcmlwdEluZm8uZXEsIEJldHdlZW5UYWdEYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkU2NyaXB0LmFkZFN0cmluZ1RyYWNrZXIoc2NyaXB0SW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBFbmFibGVHbG9iYWxSZXBsYWNlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSlNQYXJzZXInO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgR2V0UGx1Z2luLCBTb21lUGx1Z2lucyB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIsIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcExvYWQnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGxldCBSZXNDb2RlID0gQmV0d2VlblRhZ0RhdGE7XG5cbiAgICBjb25zdCBTYXZlU2VydmVyQ29kZSA9IG5ldyBFbmFibGVHbG9iYWxSZXBsYWNlKFwic2VydlwiKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSk7XG5cbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUV4dHJhY3RlZCA9IGF3YWl0IFNhdmVTZXJ2ZXJDb2RlLlN0YXJ0QnVpbGQoKTtcblxuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCksXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkpIHx8IFNvbWVQbHVnaW5zKFwiTWluQWxsXCIpLFxuICAgICAgICBzb3VyY2VtYXA6ICdleHRlcm5hbCcsXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIilcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ3RzJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnanN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICdqc3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHN4JztcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEFkZE9wdGlvbnMsIEdldFBsdWdpbihcIlRTWE9wdGlvbnNcIikgPz8ge30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge21hcCwgY29kZSwgd2FybmluZ3N9ID0gYXdhaXQgdHJhbnNmb3JtKEJldHdlZW5UYWdEYXRhRXh0cmFjdGVkLCBBZGRPcHRpb25zKTtcbiAgICAgICAgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB3YXJuaW5ncyk7XG4gICAgICAgIFxuICAgICAgICBSZXNDb2RlID0gU2F2ZVNlcnZlckNvZGUuUmVzdG9yZUNvZGUoYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIG1hcCkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoQmV0d2VlblRhZ0RhdGEsIGVycilcbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHNjcmlwdCR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7UmVzQ29kZX08L3NjcmlwdD5gXG4gICAgfTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4vU3RyaW5nVHJhY2tlclwiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTb3VyY2VNYXBUb1N0cmluZ1RyYWNrZXIoY29kZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyB8IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG1hcCA9IHR5cGVvZiBzb3VyY2VNYXAgPT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHNvdXJjZU1hcCk6IHNvdXJjZU1hcDtcblxuICAgIGNvbnN0IHRyYWNrQ29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGNvZGUpO1xuICAgIGNvbnN0IHNwbGl0TGluZXMgPSB0cmFja0NvZGUuc3BsaXQoJ1xcbicpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGlzTWFwID0gc3BsaXRMaW5lc1ttLmdlbmVyYXRlZExpbmUgLSAxXTtcbiAgICAgICAgaWYgKCFpc01hcCkgcmV0dXJuO1xuXG5cbiAgICAgICAgbGV0IGNoYXJDb3VudCA9IDE7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBpc01hcC5zdWJzdHJpbmcobS5nZW5lcmF0ZWRDb2x1bW4gPyBtLmdlbmVyYXRlZENvbHVtbiAtIDE6IDApLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgICAgICBpLmluZm8gPSBtLnNvdXJjZTtcbiAgICAgICAgICAgIGkubGluZSA9IG0ub3JpZ2luYWxMaW5lO1xuICAgICAgICAgICAgaS5jaGFyID0gY2hhckNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFja0NvZGU7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGdlbmVyYXRlZDogU3RyaW5nVHJhY2tlcikge1xuICAgIGNvbnN0IG9yaWdpbmFsTGluZXMgPSBvcmlnaW5hbC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGdlbmVyYXRlZC5nZXREYXRhQXJyYXkoKSkge1xuICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gID0gb3JpZ2luYWxMaW5lc1tpdGVtLmxpbmUgLSAxXT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICBpdGVtLmxpbmUgPSBsaW5lO1xuICAgICAgICBpdGVtLmluZm8gPSBpbmZvO1xuICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJhY2tUb09yaWdpbmFsKG9yaWdpbmFsOiBTdHJpbmdUcmFja2VyLCBjb2RlOiBzdHJpbmcsIHNvdXJjZU1hcDogc3RyaW5nIHwgUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgbmV3VHJhY2tlciA9IGF3YWl0IFNvdXJjZU1hcFRvU3RyaW5nVHJhY2tlcihjb2RlLCBzb3VyY2VNYXApO1xuICAgIG1lcmdlSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIpO1xuICAgIHJldHVybiBuZXdUcmFja2VyO1xufVxuXG5mdW5jdGlvbiBtZXJnZVNhc3NJbmZvU3RyaW5nVHJhY2tlcihvcmlnaW5hbDogU3RyaW5nVHJhY2tlciwgZ2VuZXJhdGVkOiBTdHJpbmdUcmFja2VyLCBteVNvdXJjZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxMaW5lcyA9IG9yaWdpbmFsLnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ2VuZXJhdGVkLmdldERhdGFBcnJheSgpKSB7XG4gICAgICAgIGlmKGl0ZW0uaW5mbyA9PSBteVNvdXJjZSl7XG4gICAgICAgICAgICBjb25zdCB7bGluZSwgY2hhciwgaW5mb30gPSBvcmlnaW5hbExpbmVzW2l0ZW0ubGluZSAtIDFdLmF0KGl0ZW0uY2hhci0xKT8uRGVmYXVsdEluZm9UZXh0ID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgICAgICAgICAgaXRlbS5saW5lID0gbGluZTtcbiAgICAgICAgICAgIGl0ZW0uaW5mbyA9IGluZm87XG4gICAgICAgICAgICBpdGVtLmNoYXIgPSBjaGFyO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbS5pbmZvKSB7XG4gICAgICAgICAgICBpdGVtLmluZm8gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgoaXRlbS5pbmZvKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja1RvT3JpZ2luYWxTc3Mob3JpZ2luYWw6IFN0cmluZ1RyYWNrZXIsIGNvZGU6IHN0cmluZywgc291cmNlTWFwOiBzdHJpbmcgfCBSYXdTb3VyY2VNYXAsIG15U291cmNlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuZXdUcmFja2VyID0gYXdhaXQgU291cmNlTWFwVG9TdHJpbmdUcmFja2VyKGNvZGUsIHNvdXJjZU1hcCk7XG4gICAgbWVyZ2VTYXNzSW5mb1N0cmluZ1RyYWNrZXIob3JpZ2luYWwsIG5ld1RyYWNrZXIsIG15U291cmNlKTtcblxuICAgIHJldHVybiBuZXdUcmFja2VyO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBCdWlsZEluQ29tcG9uZW50LCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm0gfSBmcm9tICdlc2J1aWxkLXdhc20nO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4uL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4sIFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUobGFuZ3VhZ2U6IHN0cmluZywgdGFnRGF0YTogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBCZXR3ZWVuVGFnRGF0YUVxID0gQmV0d2VlblRhZ0RhdGEuZXEsIEJldHdlZW5UYWdEYXRhRXFBc1RyaW0gPSBCZXR3ZWVuVGFnRGF0YUVxLnRyaW0oKSwgaXNNb2RlbCA9IHRhZ0RhdGEuZ2V0VmFsdWUoJ3R5cGUnKSA9PSAnbW9kdWxlJywgaXNNb2RlbFN0cmluZ0NhY2hlID0gaXNNb2RlbCA/ICdzY3JpcHRNb2R1bGUnIDogJ3NjcmlwdCc7XG5cbiAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5pbmNsdWRlcyhCZXR3ZWVuVGFnRGF0YUVxQXNUcmltKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgICAgIH07XG4gICAgc2Vzc2lvbkluZm8uY2FjaGVbaXNNb2RlbFN0cmluZ0NhY2hlXS5wdXNoKEJldHdlZW5UYWdEYXRhRXFBc1RyaW0pO1xuXG4gICAgbGV0IHJlc3VsdENvZGUgPSAnJywgcmVzdWx0TWFwOiBzdHJpbmc7XG5cbiAgICBjb25zdCBBZGRPcHRpb25zOiBUcmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VmaWxlOiBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICBtaW5pZnk6IFNvbWVQbHVnaW5zKFwiTWluXCIgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSxcbiAgICAgICAgc291cmNlbWFwOiBzZXNzaW9uSW5mby5kZWJ1ZyA/ICdleHRlcm5hbCcgOiBmYWxzZSxcbiAgICAgICAgLi4uR2V0UGx1Z2luKFwidHJhbnNmb3JtT3B0aW9uc1wiKVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBzd2l0Y2ggKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBjYXNlICd0cyc6XG4gICAgICAgICAgICAgICAgQWRkT3B0aW9ucy5sb2FkZXIgPSAndHMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdqc3gnOlxuICAgICAgICAgICAgICAgIEFkZE9wdGlvbnMubG9hZGVyID0gJ2pzeCc7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihBZGRPcHRpb25zLCBHZXRQbHVnaW4oXCJKU1hPcHRpb25zXCIpID8/IHt9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndHN4JzpcbiAgICAgICAgICAgICAgICBBZGRPcHRpb25zLmxvYWRlciA9ICd0c3gnO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oQWRkT3B0aW9ucywgR2V0UGx1Z2luKFwiVFNYT3B0aW9uc1wiKSA/PyB7fSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IG1hcCwgY29kZSwgd2FybmluZ3MgfSA9IGF3YWl0IHRyYW5zZm9ybShCZXR3ZWVuVGFnRGF0YS5lcSwgQWRkT3B0aW9ucyk7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgd2FybmluZ3MpO1xuXG4gICAgICAgIHJlc3VsdENvZGUgPSBjb2RlO1xuICAgICAgICByZXN1bHRNYXAgPSBtYXA7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlcihCZXR3ZWVuVGFnRGF0YSwgZXJyKVxuICAgIH1cblxuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKGlzTW9kZWwgPyAnbW9kdWxlJyA6ICdzY3JpcHQnLCB0YWdEYXRhLCBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0TWFwKSB7XG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihKU09OLnBhcnNlKHJlc3VsdE1hcCksIEJldHdlZW5UYWdEYXRhLCByZXN1bHRDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwdXNoU3R5bGUuYWRkVGV4dChyZXN1bHRDb2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgIH07XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHNjcmlwdFdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNjcmlwdFdpdGhDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGlmIChkYXRhVGFnLmhhdmUoJ3NyYycpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGA8c2NyaXB0JHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtCZXR3ZWVuVGFnRGF0YX08L3NjcmlwdD5gXG4gICAgICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZGF0YVRhZy5yZW1vdmUoJ2xhbmcnKSB8fCAnanMnO1xuXG4gICAgaWYgKGRhdGFUYWcuaGF2ZSgnc2VydmVyJykpIHtcbiAgICAgICAgZGF0YVRhZy5yZW1vdmUoJ3NlcnZlcicpO1xuICAgICAgICByZXR1cm4gc2NyaXB0V2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JpcHRXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8pO1xufSIsICJpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwIH0gZnJvbSBcInNvdXJjZS1tYXAtanNcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uXCI7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gXCIuLi8uLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1wb3J0ZXIob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kRmlsZVVybCh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKHVybFswXSA9PSAnLycgfHwgdXJsWzBdID09ICd+Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKFxuICAgICAgICAgICAgICAgICAgICB1cmwuc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgICAgICBwYXRoVG9GaWxlVVJMKHVybFswXSA9PSAnLycgPyBnZXRUeXBlcy5TdGF0aWNbMF0gOiBnZXRUeXBlcy5ub2RlX21vZHVsZXNbMF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsLCBwYXRoVG9GaWxlVVJMKG9yaWdpbmFsUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2U6IHN0cmluZywgU29tZVBsdWdpbnM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoWydzY3NzJywgJ3Nhc3MnXS5pbmNsdWRlcyhsYW5ndWFnZSkgPyBTb21lUGx1Z2lucyhcIk1pbkFsbFwiLCBcIk1pblNhc3NcIikgOiBTb21lUGx1Z2lucyhcIk1pbkNzc1wiLCBcIk1pbkFsbFwiKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhc3NTdHlsZShsYW5ndWFnZTogc3RyaW5nLCBTb21lUGx1Z2luczogYW55KSB7XG4gICAgcmV0dXJuIG1pbmlmeVBsdWdpblNhc3MobGFuZ3VhZ2UsIFNvbWVQbHVnaW5zKSA/ICdjb21wcmVzc2VkJyA6ICdleHBhbmRlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzU3ludGF4KGxhbmd1YWdlOiAnc2FzcycgfCAnc2NzcycgfCAnY3NzJykge1xuICAgIHJldHVybiBsYW5ndWFnZSA9PSAnc2FzcycgPyAnaW5kZW50ZWQnIDogbGFuZ3VhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXNzQW5kU291cmNlKHNvdXJjZU1hcDogUmF3U291cmNlTWFwLCBzb3VyY2U6IHN0cmluZykge1xuICAgIGlmICghc291cmNlTWFwKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpIGluIHNvdXJjZU1hcC5zb3VyY2VzKSB7XG4gICAgICAgIGlmIChzb3VyY2VNYXAuc291cmNlc1tpXS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgICBzb3VyY2VNYXAuc291cmNlc1tpXSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhc3NFcnJvckxpbmUoeyBzYXNzU3RhY2sgfSkge1xuICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICByZXR1cm4geyBsaW5lOiBsb2NbMF0sIGNvbHVtbjogbG9jWzFdIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yKGVycjogYW55LCB7bGluZSwgY29sdW1ufSA9IGdldFNhc3NFcnJvckxpbmUoZXJyKSl7XG4gICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIHRleHQ6IGAke2Vyci5tZXNzYWdlfSxcXG5vbiBmaWxlIC0+ICR7ZmlsZVVSTFRvUGF0aChlcnIuc3Bhbi51cmwpfToke2xpbmUgPz8gMH06JHtjb2x1bW4gPz8gMH1gLFxuICAgICAgICBlcnJvck5hbWU6IGVycj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgdHlwZTogZXJyPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnI6IGFueSwgdHJhY2s6IFN0cmluZ1RyYWNrZXIpe1xuICAgIGlmKGVyci5zcGFuLnVybCkgcmV0dXJuIFByaW50U2Fzc0Vycm9yKGVycik7XG5cbiAgICBlcnIubG9jYXRpb24gPSBnZXRTYXNzRXJyb3JMaW5lKGVycik7XG4gICAgUHJpbnRJZk5ldyh7XG4gICAgICAgIHRleHQ6IHRyYWNrLmRlYnVnTGluZShlcnIpLFxuICAgICAgICBlcnJvck5hbWU6IGVycj8uc3RhdHVzID09IDUgPyAnc2Fzcy13YXJuaW5nJyA6ICdzYXNzLWVycm9yJyxcbiAgICAgICAgdHlwZTogZXJyPy5zdGF0dXMgPT0gNSA/ICd3YXJuJyA6ICdlcnJvcidcbiAgICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVTYXNzKGxhbmd1YWdlOiBzdHJpbmcsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgb3V0U3R5bGUgPSBCZXR3ZWVuVGFnRGF0YS5lcSkge1xuICAgIGNvbnN0IHRoaXNQYWdlID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpLFxuICAgICAgICB0aGlzUGFnZVVSTCA9IHBhdGhUb0ZpbGVVUkwodGhpc1BhZ2UpLFxuICAgICAgICBjb21wcmVzc2VkID0gbWluaWZ5UGx1Z2luU2FzcyhsYW5ndWFnZSwgSW5zZXJ0Q29tcG9uZW50LlNvbWVQbHVnaW5zKTtcblxuICAgIGxldCByZXN1bHQ6IHNhc3MuQ29tcGlsZVJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCBzYXNzLmNvbXBpbGVTdHJpbmdBc3luYyhvdXRTdHlsZSwge1xuICAgICAgICAgICAgc291cmNlTWFwOiBzZXNzaW9uSW5mby5kZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCg8YW55Pmxhbmd1YWdlKSxcbiAgICAgICAgICAgIHN0eWxlOiBjb21wcmVzc2VkID8gJ2NvbXByZXNzZWQnIDogJ2V4cGFuZGVkJyxcbiAgICAgICAgICAgIGltcG9ydGVyOiBjcmVhdGVJbXBvcnRlcih0aGlzUGFnZSksXG4gICAgICAgICAgICBsb2dnZXI6IHNhc3MuTG9nZ2VyLnNpbGVudFxuICAgICAgICB9KTtcbiAgICAgICAgb3V0U3R5bGUgPSByZXN1bHQ/LmNzcyA/PyBvdXRTdHlsZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYoZXJyLnNwYW4udXJsKXtcbiAgICAgICAgICAgIGNvbnN0IEZ1bGxQYXRoID0gZmlsZVVSTFRvUGF0aChlcnIuc3Bhbi51cmwpO1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKEZ1bGxQYXRoKSwgRnVsbFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgUHJpbnRTYXNzRXJyb3JUcmFja2VyKGVyciwgQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICByZXR1cm4ge291dFN0eWxlOiAnU2FzcyBFcnJvciAoc2VlIGNvbnNvbGUpJ31cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiByZXN1bHQubG9hZGVkVXJscykge1xuICAgICAgICAgICAgY29uc3QgRnVsbFBhdGggPSBmaWxlVVJMVG9QYXRoKDxhbnk+ZmlsZSk7XG4gICAgICAgICAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpLCBGdWxsUGF0aClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdD8uc291cmNlTWFwICYmIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgdGhpc1BhZ2VVUkwuaHJlZik7XG4gICAgcmV0dXJuIHsgcmVzdWx0LCBvdXRTdHlsZSwgY29tcHJlc3NlZCB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IEVuYWJsZUdsb2JhbFJlcGxhY2UgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9KU1BhcnNlcic7XG5pbXBvcnQgeyBjb21waWxlU2FzcyB9IGZyb20gJy4vc2Fzcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKGxhbmd1YWdlOiBzdHJpbmcscGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcblxuICAgIGNvbnN0IFNhdmVTZXJ2ZXJDb2RlID0gbmV3IEVuYWJsZUdsb2JhbFJlcGxhY2UoKTtcbiAgICBhd2FpdCBTYXZlU2VydmVyQ29kZS5sb2FkKEJldHdlZW5UYWdEYXRhLnRyaW1TdGFydCgpLCBwYXRoTmFtZSk7XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBsZXQgeyBvdXRTdHlsZSwgY29tcHJlc3NlZCB9ID0gYXdhaXQgY29tcGlsZVNhc3MobGFuZ3VhZ2UsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvLCBhd2FpdCBTYXZlU2VydmVyQ29kZS5TdGFydEJ1aWxkKCkpO1xuXG4gICAgaWYgKCFjb21wcmVzc2VkKVxuICAgICAgICBvdXRTdHlsZSA9IGBcXG4ke291dFN0eWxlfVxcbmA7XG5cbiAgICBjb25zdCByZVN0b3JlRGF0YSA9IFNhdmVTZXJ2ZXJDb2RlLlJlc3RvcmVDb2RlKG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbywgb3V0U3R5bGUpKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCkuUGx1cyRgPHN0eWxlJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHtyZVN0b3JlRGF0YX08L3N0eWxlPmBcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIHRhZ0RhdGFPYmplY3RBcnJheSB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IFNvdXJjZU1hcFN0b3JlIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5pbXBvcnQgeyBjb21waWxlU2FzcyB9IGZyb20gJy4vc2Fzcyc7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShsYW5ndWFnZTogc3RyaW5nLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG91dFN0eWxlQXNUcmltID0gQmV0d2VlblRhZ0RhdGEuZXEudHJpbSgpO1xuICAgIGlmIChzZXNzaW9uSW5mby5jYWNoZS5zdHlsZS5pbmNsdWRlcyhvdXRTdHlsZUFzVHJpbSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIoKVxuICAgICAgICB9O1xuICAgIHNlc3Npb25JbmZvLmNhY2hlLnN0eWxlLnB1c2gob3V0U3R5bGVBc1RyaW0pO1xuXG4gICAgY29uc3QgeyByZXN1bHQsIG91dFN0eWxlIH0gPSBhd2FpdCBjb21waWxlU2FzcyhsYW5ndWFnZSwgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcHVzaFN0eWxlID0gc2Vzc2lvbkluZm8uYWRkU2NyaXB0U3R5bGVQYWdlKCdzdHlsZScsIGRhdGFUYWcsICBCZXR3ZWVuVGFnRGF0YSk7XG5cbiAgICBpZiAocmVzdWx0Py5zb3VyY2VNYXApXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihTb3VyY2VNYXBTdG9yZS5maXhVUkxTb3VyY2VNYXAoPGFueT5yZXN1bHQuc291cmNlTWFwKSwgQmV0d2VlblRhZ0RhdGEsIG91dFN0eWxlKTtcbiAgICBlbHNlXG4gICAgICAgIHB1c2hTdHlsZS5hZGRTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLCB7IHRleHQ6IG91dFN0eWxlIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9O1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBzdHlsZVdpdGhTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHN0eWxlV2l0aENsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBkYXRhVGFnLnJlbW92ZSgnbGFuZycpIHx8ICdjc3MnO1xuXG4gICAgaWYoZGF0YVRhZy5oYXZlKCdzZXJ2ZXInKSl7XG4gICAgICAgIGRhdGFUYWcucmVtb3ZlKCdzZXJ2ZXInKTtcbiAgICAgICAgcmV0dXJuIHN0eWxlV2l0aFNlcnZlcihsYW5ndWFnZSwgcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVXaXRoQ2xpZW50KGxhbmd1YWdlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aF9ub2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuaW1wb3J0IHsgRmFzdENvbXBpbGVJbkZpbGUgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5mdW5jdGlvbiBJbkZvbGRlclBhZ2VQYXRoKGlucHV0UGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6c3RyaW5nKXtcbiAgICBpZiAoaW5wdXRQYXRoWzBdID09ICcuJykge1xuICAgICAgICBpZiAoaW5wdXRQYXRoWzFdID09ICcvJykge1xuICAgICAgICAgICAgaW5wdXRQYXRoID0gaW5wdXRQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0UGF0aCA9IGlucHV0UGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvbGRlciA9IHBhdGhfbm9kZS5kaXJuYW1lKHNtYWxsUGF0aCk7XG5cbiAgICAgICAgaWYoZm9sZGVyKXtcbiAgICAgICAgICAgIGZvbGRlciArPSAnLyc7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRQYXRoID0gZm9sZGVyICsgaW5wdXRQYXRoO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRQYXRoWzBdID09ICcvJykge1xuICAgICAgICBpbnB1dFBhdGggPSBpbnB1dFBhdGguc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhZ2VUeXBlID0gJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICBpZighaW5wdXRQYXRoLmVuZHNXaXRoKHBhZ2VUeXBlKSl7XG4gICAgICAgIGlucHV0UGF0aCArPSBwYWdlVHlwZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5wdXRQYXRoO1xufVxuXG5jb25zdCBjYWNoZU1hcDogeyBba2V5OiBzdHJpbmddOiB7Q29tcGlsZWREYXRhOiBTdHJpbmdUcmFja2VyLCBuZXdTZXNzaW9uOiBTZXNzaW9uQnVpbGR9fSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgZmlsZXBhdGggPSBkYXRhVGFnLmdldFZhbHVlKFwiZnJvbVwiKTtcblxuICAgIGNvbnN0IFNtYWxsUGF0aFdpdGhvdXRGb2xkZXIgPSBJbkZvbGRlclBhZ2VQYXRoKGZpbGVwYXRoLCB0eXBlLmV4dHJhY3RJbmZvKCkpO1xuXG4gICAgY29uc3QgRnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyLCBTbWFsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBTbWFsbFBhdGhXaXRob3V0Rm9sZGVyO1xuXG4gICAgaWYgKCEoYXdhaXQgRWFzeUZzLnN0YXQoRnVsbFBhdGgsIG51bGwsIHRydWUpKS5pc0ZpbGU/LigpKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdGV4dDogYFxcblBhZ2Ugbm90IGZvdW5kOiAke3R5cGUuYXQoMCkubGluZUluZm99IC0+ICR7RnVsbFBhdGh9YCxcbiAgICAgICAgICAgIGVycm9yTmFtZTogJ3BhZ2Utbm90LWZvdW5kJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQsIGA8cCBzdHlsZT1cImNvbG9yOnJlZDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1zaXplOjE2cHg7XCI+UGFnZSBub3QgZm91bmQ6ICR7dHlwZS5saW5lSW5mb30gLT4gJHtTbWFsbFBhdGh9PC9wPmApXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IFJldHVybkRhdGE6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICBjb25zdCBoYXZlQ2FjaGUgPSBjYWNoZU1hcFtTbWFsbFBhdGhXaXRob3V0Rm9sZGVyXTtcbiAgICBpZiAoIWhhdmVDYWNoZSB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UobnVsbCwgaGF2ZUNhY2hlLm5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBjb25zdCB7IENvbXBpbGVkRGF0YSwgc2Vzc2lvbkluZm86IG5ld1Nlc3Npb259ID0gYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUoU21hbGxQYXRoV2l0aG91dEZvbGRlciwgZ2V0VHlwZXMuU3RhdGljLCBudWxsLCBwYXRoTmFtZSwgZGF0YVRhZy5yZW1vdmUoJ29iamVjdCcpKTtcbiAgICAgICAgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXNbU21hbGxQYXRoXSA9IG5ld1Nlc3Npb24uZGVwZW5kZW5jaWVzLnRoaXNQYWdlO1xuICAgICAgICBkZWxldGUgbmV3U2Vzc2lvbi5kZXBlbmRlbmNpZXMudGhpc1BhZ2U7XG5cbiAgICAgICAgc2Vzc2lvbkluZm8uZXh0ZW5kcyhuZXdTZXNzaW9uKVxuXG4gICAgICAgIGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdID0ge0NvbXBpbGVkRGF0YTo8U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGEsIG5ld1Nlc3Npb259O1xuICAgICAgICBSZXR1cm5EYXRhID08U3RyaW5nVHJhY2tlcj5Db21waWxlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBDb21waWxlZERhdGEsIG5ld1Nlc3Npb24gfSA9IGNhY2hlTWFwW1NtYWxsUGF0aFdpdGhvdXRGb2xkZXJdO1xuICAgXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Vzc2lvbkluZm8uZGVwZW5kZW5jaWVzLCBuZXdTZXNzaW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIHNlc3Npb25JbmZvLmV4dGVuZHMobmV3U2Vzc2lvbilcblxuICAgICAgICBSZXR1cm5EYXRhID0gQ29tcGlsZWREYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBSZXR1cm5EYXRhXG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IFN5c3RlbURhdGEgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5cbi8qIEl0J3MgYSBKU09OIGZpbGUgbWFuYWdlciAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmVKU09OIHtcbiAgICBwcml2YXRlIHNhdmVQYXRoOiBzdHJpbmc7XG4gICAgc3RvcmU6IFN0cmluZ0FueU1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgYXV0b0xvYWQgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVBhdGggPSBgJHtTeXN0ZW1EYXRhfS8ke2ZpbGVQYXRofS5qc29uYDtcbiAgICAgICAgYXV0b0xvYWQgJiYgdGhpcy5sb2FkRmlsZSgpO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgdGhpcy5zYXZlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgICAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy5zYXZlUGF0aCkpXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gSlNPTi5wYXJzZShhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy5zYXZlUGF0aCkgfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBrZXkgaXMgaW4gdGhlIHN0b3JlLCByZXR1cm4gdGhlIHZhbHVlLiBJZiBub3QsIGNyZWF0ZSBhIG5ldyB2YWx1ZSwgc3RvcmUgaXQsIGFuZCByZXR1cm4gaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBsb29rIHVwIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0gW2NyZWF0ZV0gLSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIGtleSBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgaGF2ZShrZXk6IHN0cmluZywgY3JlYXRlPzogKCkgPT4gc3RyaW5nKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5zdG9yZVtrZXldO1xuICAgICAgICBpZiAoaXRlbSB8fCAhY3JlYXRlKSByZXR1cm4gaXRlbTtcblxuICAgICAgICBpdGVtID0gY3JlYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlKGtleSwgaXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlKCkge1xuICAgICAgICByZXR1cm4gRWFzeUZzLndyaXRlSnNvbkZpbGUodGhpcy5zYXZlUGF0aCwgdGhpcy5zdG9yZSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBTdHJpbmdOdW1iZXJNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4vRWFzeUZzXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuL1N0b3JlSlNPTlwiO1xuXG5leHBvcnQgY29uc3QgcGFnZURlcHMgPSBuZXcgU3RvcmVKU09OKCdQYWdlc0luZm8nKVxuXG4vKipcbiAqIENoZWNrIGlmIGFueSBvZiB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZSBwYWdlIGhhdmUgY2hhbmdlZFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7U3RyaW5nTnVtYmVyTWFwfSBkZXBlbmRlbmNpZXMgLSBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuIFRoZSBrZXkgaXMgdGhlIHBhdGggdG8gdGhlIGZpbGUsIGFuZFxuICogdGhlIHZhbHVlIGlzIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgb2YgdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBDaGVja0RlcGVuZGVuY3lDaGFuZ2UocGF0aDpzdHJpbmcsIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0gcGFnZURlcHMuc3RvcmVbcGF0aF0pIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGxldCBwID0gaTtcblxuICAgICAgICBpZiAoaSA9PSAndGhpc1BhZ2UnKSB7XG4gICAgICAgICAgICBwID0gcGF0aCArIFwiLlwiICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEZpbGVQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggICsgcDtcbiAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5zdGF0KEZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUpICE9IGRlcGVuZGVuY2llc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICFkZXBlbmRlbmNpZXM7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGlzb2xhdGUoQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBjb21waWxlZFN0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKEJldHdlZW5UYWdEYXRhLlN0YXJ0SW5mbyk7XG5cbiAgICBjb21waWxlZFN0cmluZy5QbHVzJCBgPCV7JT4ke0JldHdlZW5UYWdEYXRhfTwlfSU+YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGggfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvZGVJbmZvQW5kRGVidWcnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMsIFN5c3RlbURhdGEgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uLy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWdpc3RlckV4dGVuc2lvbiBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9Gb3JTdGF0aWMvU3ZlbHRlL3Nzcic7XG5pbXBvcnQgeyByZWJ1aWxkRmlsZSB9IGZyb20gJy4uLy4uL0ltcG9ydEZpbGVzL1N0YXRpY0ZpbGVzJztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUsIHsgcmVzb2x2ZSwgY2xlYXJNb2R1bGUgfSBmcm9tICcuLi8uLi9JbXBvcnRGaWxlcy9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBDYXBpdGFsaXplIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvRm9yU3RhdGljL1N2ZWx0ZS9wcmVwcm9jZXNzJztcblxuYXN5bmMgZnVuY3Rpb24gc3NySFRNTChkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEZ1bGxQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBjb25zdCBnZXRWID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBndiA9IChuYW1lOiBzdHJpbmcpID0+IGRhdGFUYWcuZ2V0VmFsdWUobmFtZSkudHJpbSgpLFxuICAgICAgICAgICAgdmFsdWUgPSBndignc3NyJyArIENhcGl0YWxpemUobmFtZSkpIHx8IGd2KG5hbWUpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZSA/IGV2YWwoYCgke3ZhbHVlLmNoYXJBdCgwKSA9PSAneycgPyB2YWx1ZSA6IGB7JHt2YWx1ZX19YH0pYCkgOiB7fTtcbiAgICB9O1xuICAgIGNvbnN0IGJ1aWxkUGF0aCA9IGF3YWl0IHJlZ2lzdGVyRXh0ZW5zaW9uKEZ1bGxQYXRoLCBzbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBtb2RlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGJ1aWxkUGF0aCk7XG5cbiAgICBjb25zdCB7IGh0bWwsIGhlYWQgfSA9IG1vZGUuZGVmYXVsdC5yZW5kZXIoZ2V0VigncHJvcHMnKSwgZ2V0Vignb3B0aW9ucycpKTtcbiAgICBzZXNzaW9uSW5mby5oZWFkSFRNTCArPSBoZWFkO1xuICAgIHJldHVybiBodG1sO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZSh0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBMYXN0U21hbGxQYXRoID0gdHlwZS5leHRyYWN0SW5mbygpLCBMYXN0RnVsbFBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIExhc3RTbWFsbFBhdGg7XG4gICAgY29uc3QgeyBTbWFsbFBhdGgsIEZ1bGxQYXRoIH0gPSBDcmVhdGVGaWxlUGF0aChMYXN0RnVsbFBhdGgsIExhc3RTbWFsbFBhdGgsIGRhdGFUYWcucmVtb3ZlKCdmcm9tJyksIGdldFR5cGVzLlN0YXRpY1syXSwgJ3N2ZWx0ZScpO1xuICAgIGNvbnN0IGluV2ViUGF0aCA9IHJlbGF0aXZlKGdldFR5cGVzLlN0YXRpY1syXSwgU21hbGxQYXRoKS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpO1xuXG4gICAgc2Vzc2lvbkluZm8uc3R5bGUoJy8nICsgaW5XZWJQYXRoICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IGlkID0gZGF0YVRhZy5yZW1vdmUoJ2lkJykgfHwgQmFzZTY0SWQoaW5XZWJQYXRoKSxcbiAgICAgICAgaGF2ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVRhZy5nZXRWYWx1ZShuYW1lKS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPyBgLCR7bmFtZX06JHt2YWx1ZS5jaGFyQXQoMCkgPT0gJ3snID8gdmFsdWUgOiBgeyR7dmFsdWV9fWB9YCA6ICcnO1xuICAgICAgICB9LCBzZWxlY3RvciA9IGRhdGFUYWcucmVtb3ZlKCdzZWxlY3RvcicpO1xuXG4gICAgY29uc3Qgc3NyID0gIXNlbGVjdG9yICYmIGRhdGFUYWcuaGF2ZSgnc3NyJykgPyBhd2FpdCBzc3JIVE1MKGRhdGFUYWcsIEZ1bGxQYXRoLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKSA6ICcnO1xuXG5cbiAgICBzZXNzaW9uSW5mby5hZGRTY3JpcHRTdHlsZSgnbW9kdWxlJywgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAncGFnZScpID8gTGFzdFNtYWxsUGF0aCA6IHR5cGUuZXh0cmFjdEluZm8oKSkuYWRkVGV4dChcbmBpbXBvcnQgQXBwJHtpZH0gZnJvbSAnLyR7aW5XZWJQYXRofSc7XG5jb25zdCB0YXJnZXQke2lkfSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIke3NlbGVjdG9yID8gc2VsZWN0b3IgOiAnIycgKyBpZH1cIik7XG50YXJnZXQke2lkfSAmJiBuZXcgQXBwJHtpZH0oe1xuICAgIHRhcmdldDogdGFyZ2V0JHtpZH1cbiAgICAke2hhdmUoJ3Byb3BzJykgKyBoYXZlKCdvcHRpb25zJyl9JHtzc3IgPyAnLCBoeWRyYXRlOiB0cnVlJyA6ICcnfVxufSk7YCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgc2VsZWN0b3IgPyAnJyA6IGA8ZGl2IGlkPVwiJHtpZH1cIj4ke3Nzcn08L2Rpdj5gKSxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiB0cnVlXG4gICAgfVxufVxuXG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSWQodGV4dDogc3RyaW5nLCBtYXggPSAxMCl7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRleHQpLnRvU3RyaW5nKCdiYXNlNjQnKS5zdWJzdHJpbmcoMCwgbWF4KS5yZXBsYWNlKC9cXCsvLCAnXycpLnJlcGxhY2UoL1xcLy8sICdfJyk7XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvblwiO1xuaW1wb3J0ICB7IENhcGl0YWxpemUsIHByZXByb2Nlc3MgfSBmcm9tIFwiLi9wcmVwcm9jZXNzXCI7XG5pbXBvcnQgKiBhcyBzdmVsdGUgZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IENvbXBpbGVPcHRpb25zIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgeyBjbGVhck1vZHVsZSwgcmVzb2x2ZSB9IGZyb20gXCIuLi8uLi9yZWRpcmVjdENKU1wiO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGZpbGVQYXRoOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgY29uc3QgbmFtZSA9IHBhdGgucGFyc2UoZmlsZVBhdGgpLm5hbWUucmVwbGFjZSgvXlxcZC8sICdfJCYnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8kXS9nLCAnJyk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHtcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgICAgICBuYW1lOiBDYXBpdGFsaXplKG5hbWUpLFxuICAgICAgICBnZW5lcmF0ZTogJ3NzcicsXG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGRldjogc2Vzc2lvbkluZm8uZGVidWcsXG4gICAgICAgIGVycm9yTW9kZTogJ3dhcm4nXG4gICAgfTtcblxuICAgIGNvbnN0IGluU3RhdGljRmlsZSA9IHBhdGgucmVsYXRpdmUoZ2V0VHlwZXMuU3RhdGljWzJdLCBzbWFsbFBhdGgpO1xuICAgIGNvbnN0IGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljRmlsZTtcblxuICAgIGNvbnN0IGZ1bGxJbXBvcnRQYXRoID0gZnVsbENvbXBpbGVQYXRoICsgJy5zc3IuY2pzJztcbiAgICBjb25zdCB7c3ZlbHRlRmlsZXMsIGNvZGUsIG1hcCwgZGVwZW5kZW5jaWVzfSA9IGF3YWl0IHByZXByb2Nlc3MoZmlsZVBhdGgsIHNtYWxsUGF0aCxmdWxsSW1wb3J0UGF0aCxmYWxzZSwnLnNzci5janMnKTtcbiAgICBPYmplY3QuYXNzaWduKHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyxkZXBlbmRlbmNpZXMpO1xuICAgIG9wdGlvbnMuc291cmNlbWFwID0gbWFwO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBmb3IoY29uc3QgZmlsZSBvZiBzdmVsdGVGaWxlcyl7XG4gICAgICAgIGNsZWFyTW9kdWxlKHJlc29sdmUoZmlsZSkpOyAvLyBkZWxldGUgb2xkIGltcG9ydHNcbiAgICAgICAgcHJvbWlzZXMucHVzaChyZWdpc3RlckV4dGVuc2lvbihmaWxlLCBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGUpLCBzZXNzaW9uSW5mbykpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGNvbnN0IHsganMsIGNzcywgd2FybmluZ3MgfSA9IHN2ZWx0ZS5jb21waWxlKGNvZGUsIDxhbnk+b3B0aW9ucyk7XG4gICAgUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzLCBmaWxlUGF0aCwgbWFwKTtcblxuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbEltcG9ydFBhdGgsIGpzLmNvZGUpO1xuXG4gICAgaWYgKGNzcy5jb2RlKSB7XG4gICAgICAgIGNzcy5tYXAuc291cmNlc1swXSA9ICcvJyArIGluU3RhdGljRmlsZS5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCArICcuY3NzJywgY3NzLmNvZGUgPz8gJycpO1xuXG4gICAgcmV0dXJuIGZ1bGxJbXBvcnRQYXRoO1xufVxuIiwgImltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBTb21lUGx1Z2lucywgR2V0UGx1Z2luIH0gZnJvbSAnLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uLy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCAqIGFzIHN2ZWx0ZSBmcm9tICdzdmVsdGUvY29tcGlsZXInO1xuaW1wb3J0IHsgZGlybmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNhc3MgZnJvbSAnc2Fzcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIHBhdGhUb0ZpbGVVUkwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgY3JlYXRlSW1wb3J0ZXIsIGdldFNhc3NFcnJvckxpbmUsIFByaW50U2Fzc0Vycm9yLCBQcmludFNhc3NFcnJvclRyYWNrZXIsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEV4dGVuc2lvbiwgU3BsaXRGaXJzdCB9IGZyb20gJy4uLy4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciB9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlJztcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsLCBiYWNrVG9PcmlnaW5hbFNzcyB9IGZyb20gJy4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkJztcblxuYXN5bmMgZnVuY3Rpb24gU0FTU1N2ZWx0ZShjb250ZW50OiBTdHJpbmdUcmFja2VyLCBsYW5nOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICBpZiAobGFuZyA9PSAnY3NzJylcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICAgICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgY3NzLCBzb3VyY2VNYXAsIGxvYWRlZFVybHMgfSA9IGF3YWl0IHNhc3MuY29tcGlsZVN0cmluZ0FzeW5jKGNvbnRlbnQuZXEsIHtcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCg8YW55PmxhbmcpLFxuICAgICAgICAgICAgc3R5bGU6IHNhc3NTdHlsZShsYW5nLCBTb21lUGx1Z2lucyksXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnQsXG4gICAgICAgICAgICBzb3VyY2VNYXA6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IGF3YWl0IGJhY2tUb09yaWdpbmFsU3NzKGNvbnRlbnQsIGNzcyw8YW55PiBzb3VyY2VNYXAsIHNvdXJjZU1hcC5zb3VyY2VzLmZpbmQoeCA9PiB4LnN0YXJ0c1dpdGgoJ2RhdGE6JykpKSxcbiAgICAgICAgICAgIGRlcGVuZGVuY2llczogbG9hZGVkVXJscy5tYXAoeCA9PiBmaWxlVVJMVG9QYXRoKDxhbnk+eCkpXG4gICAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIFByaW50U2Fzc0Vycm9yVHJhY2tlcihlcnIsIGNvbnRlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IG5ldyBTdHJpbmdUcmFja2VyKClcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFNjcmlwdFN2ZWx0ZShjb250ZW50OiBTdHJpbmdUcmFja2VyLCBsYW5nOiBzdHJpbmcsIGNvbm5lY3RTdmVsdGU6IHN0cmluZ1tdLCBzdmVsdGVFeHQgPSAnJyk6IFByb21pc2U8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGNvbnN0IG1hcFRva2VuID0ge307XG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZXIoLygoaW1wb3J0KHt8WyBdKlxcKD8pfCgoaW1wb3J0WyBdKnR5cGV8aW1wb3J0fGV4cG9ydCkoe3xbIF0rKVtcXFdcXHddKz8ofXxbIF0rKWZyb20pKSh9fFsgXSopKShbXCJ8J3xgXSkoW1xcV1xcd10rPylcXDkoWyBdKlxcKSk/L20sIGFyZ3MgPT4ge1xuICAgICAgICBpZihsYW5nID09ICd0cycgJiYgYXJnc1s1XS5lbmRzV2l0aCgnIHR5cGUnKSlcbiAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZXh0ID0gZXh0bmFtZShhcmdzWzEwXS5lcSk7XG5cbiAgICAgICAgaWYgKGV4dCA9PSAnJylcbiAgICAgICAgICAgIGlmIChsYW5nID09ICd0cycpXG4gICAgICAgICAgICAgICAgYXJnc1sxMF0uQWRkVGV4dEFmdGVyTm9UcmFjaygnLnRzJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXJnc1sxMF0uQWRkVGV4dEFmdGVyTm9UcmFjaygnLmpzJyk7XG5cblxuICAgICAgICBjb25zdCBuZXdEYXRhID0gYXJnc1sxXS5QbHVzKGFyZ3NbOV0sIGFyZ3NbMTBdLCAoZXh0ID09ICcuc3ZlbHRlJyA/IHN2ZWx0ZUV4dCA6ICcnKSwgYXJnc1s5XSwgKGFyZ3NbMTFdID8/ICcnKSk7XG5cbiAgICAgICAgaWYgKGV4dCA9PSAnLnN2ZWx0ZScpIHtcbiAgICAgICAgICAgIGNvbm5lY3RTdmVsdGUucHVzaChhcmdzWzEwXS5lcSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGFuZyAhPT0gJ3RzJyB8fCAhYXJnc1s0XSlcbiAgICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuXG4gICAgICAgIGNvbnN0IGlkID0gdXVpZCgpO1xuICAgICAgICBtYXBUb2tlbltpZF0gPSBuZXdEYXRhO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBgX19fdG9LZW5cXGAke2lkfVxcYGApO1xuICAgIH0pO1xuXG4gICAgaWYgKGxhbmcgIT09ICd0cycpXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IChhd2FpdCB0cmFuc2Zvcm0oY29udGVudC5lcSwgeyAuLi5HZXRQbHVnaW4oXCJ0cmFuc2Zvcm1PcHRpb25zXCIpLCBsb2FkZXI6ICd0cycsIHNvdXJjZW1hcDogdHJ1ZSB9KSk7XG4gICAgICAgIGNvbnRlbnQgPSBhd2FpdCBiYWNrVG9PcmlnaW5hbChjb250ZW50LCBjb2RlLCBtYXApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIoY29udGVudCwgZXJyKTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICB9XG5cbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlcigvX19fdG9LZW5gKFtcXHdcXFddKz8pYC9taSwgYXJncyA9PiB7XG4gICAgICAgIHJldHVybiBtYXBUb2tlblthcmdzWzFdLmVxXSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udGVudDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByZXByb2Nlc3MoZnVsbFBhdGg6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIHNhdmVQYXRoID0gc21hbGxQYXRoLCBodHRwU291cmNlID0gdHJ1ZSwgc3ZlbHRlRXh0ID0gJycpIHsgICAgXG4gICAgbGV0IHRleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihzbWFsbFBhdGgsIGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCkpO1xuXG4gICAgbGV0IHNjcmlwdExhbmcgPSAnanMnLCBzdHlsZUxhbmcgPSAnY3NzJztcblxuICAgIGNvbnN0IGNvbm5lY3RTdmVsdGU6IHN0cmluZ1tdID0gW10sIGRlcGVuZGVuY2llczogc3RyaW5nW10gPSBbXTtcbiAgICB0ZXh0ID0gYXdhaXQgdGV4dC5yZXBsYWNlckFzeW5jKC8oPHNjcmlwdClbIF0qKCBsYW5nPSgnfFwiKT8oW0EtWmEtel0rKSgnfFwiKT8pP1sgXSooPlxcbj8pKC4qPykoXFxuPzxcXC9zY3JpcHQ+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc2NyaXB0TGFuZyA9IGFyZ3NbNF0/LmVxID8/ICdqcyc7XG4gICAgICAgIHJldHVybiBhcmdzWzFdLlBsdXMoYXJnc1s2XSwgYXdhaXQgU2NyaXB0U3ZlbHRlKGFyZ3NbN10sIHNjcmlwdExhbmcsIGNvbm5lY3RTdmVsdGUsIHN2ZWx0ZUV4dCksIGFyZ3NbOF0pO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc3R5bGVDb2RlID0gY29ubmVjdFN2ZWx0ZS5tYXAoeCA9PiBgQGltcG9ydCBcIiR7eH0uY3NzXCI7YCkuam9pbignJyk7XG4gICAgbGV0IGhhZFN0eWxlID0gZmFsc2U7XG4gICAgdGV4dCA9IGF3YWl0IHRleHQucmVwbGFjZXJBc3luYygvKDxzdHlsZSlbIF0qKCBsYW5nPSgnfFwiKT8oW0EtWmEtel0rKSgnfFwiKT8pP1sgXSooPikoLio/KSg8XFwvc3R5bGU+KS9zLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgc3R5bGVMYW5nID0gYXJnc1s0XT8uZXEgPz8gJ2Nzcyc7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgZGVwZW5kZW5jaWVzOiBkZXBzIH0gPSBhd2FpdCBTQVNTU3ZlbHRlKGFyZ3NbN10sIHN0eWxlTGFuZywgZnVsbFBhdGgpO1xuICAgICAgICBkZXBzICYmIGRlcGVuZGVuY2llcy5wdXNoKC4uLmRlcHMpO1xuICAgICAgICBoYWRTdHlsZSA9IHRydWU7XG4gICAgICAgIHN0eWxlQ29kZSAmJiBjb2RlLkFkZFRleHRCZWZvcmVOb1RyYWNrKHN0eWxlQ29kZSk7XG4gICAgICAgIHJldHVybiBhcmdzWzFdLlBsdXMoYXJnc1s2XSwgY29kZSwgYXJnc1s4XSk7O1xuICAgIH0pO1xuXG4gICAgaWYgKCFoYWRTdHlsZSAmJiBzdHlsZUNvZGUpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGA8c3R5bGU+JHtzdHlsZUNvZGV9PC9zdHlsZT5gKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHNlc3Npb25JbmZvID0gbmV3IFNlc3Npb25CdWlsZChzbWFsbFBhdGgsIGZ1bGxQYXRoKSwgcHJvbWlzZXMgPSBbc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShzbWFsbFBhdGgsIGZ1bGxQYXRoKV07XG5cbiAgICBmb3IgKGNvbnN0IGZ1bGwgb2YgZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2goc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZ1bGwpLCBmdWxsKSk7XG4gICAgfVxuXG5cbiAgICByZXR1cm4geyBzY3JpcHRMYW5nLCBzdHlsZUxhbmcsIGNvZGU6IHRleHQuZXEsIG1hcDogdGV4dC5TdHJpbmdUYWNrKHNhdmVQYXRoLCBodHRwU291cmNlKSwgZGVwZW5kZW5jaWVzOiBzZXNzaW9uSW5mby5kZXBlbmRlbmNpZXMsIHN2ZWx0ZUZpbGVzOiBjb25uZWN0U3ZlbHRlLm1hcCh4ID0+IHhbMF0gPT0gJy8nID8gZ2V0VHlwZXMuU3RhdGljWzBdICsgeCA6IHBhdGgubm9ybWFsaXplKGZ1bGxQYXRoICsgJy8uLi8nICsgeCkpIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDYXBpdGFsaXplKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBuYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1xufVxuXG4iLCAiaW1wb3J0IHR5cGUgeyB0YWdEYXRhT2JqZWN0QXJyYXl9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuXG5jb25zdCBudW1iZXJzID0gWydudW1iZXInLCAnbnVtJywgJ2ludGVnZXInLCAnaW50J10sIGJvb2xlYW5zID0gWydib29sZWFuJywgJ2Jvb2wnXTtcbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uID0gWydlbWFpbCcsICdzdHJpbmcnLCAndGV4dCcsIC4uLm51bWJlcnMsIC4uLmJvb2xlYW5zXTtcblxuY29uc3QgZW1haWxWYWxpZGF0b3IgPSAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvO1xuXG5cblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25SZWdleCA9IHtcbiAgICBcInN0cmluZy1sZW5ndGgtcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy1bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy0nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgdGV4dDogc3RyaW5nKSA9PiB0ZXh0Lmxlbmd0aCA+PSBtaW4gJiYgdGV4dC5sZW5ndGggPD0gbWF4LFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLi5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLXN0cmluZ1wiOiBbXG4gICAgICAgIC9ec3RyaW5nfHRleHQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IGBcIiR7eC50cmltKCkucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKX1cImApLFxuICAgICAgICAob3B0aW9uczogc3RyaW5nW10sIHRleHQ6IHN0cmluZykgPT4gb3B0aW9ucy5pbmNsdWRlcyh0ZXh0KSxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2UtbnVtYmVyXCI6IFtcbiAgICAgICAgL15udW1iZXJ8bnVtfGludGVnZXJ8aW50K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKSxcbiAgICAgICAgKG9wdGlvbnM6IG51bWJlcltdLCBudW06IG51bWJlcikgPT4gb3B0aW9ucy5pbmNsdWRlcyhudW0pLFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXVxufTtcblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzID0gWy4uLm51bWJlcnNdO1xuXG5mb3IoY29uc3QgaSBpbiBidWlsdEluQ29ubmVjdGlvblJlZ2V4KXtcbiAgICBjb25zdCB0eXBlID0gYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtpXVszXTtcblxuICAgIGlmKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyh0eXBlKSlcbiAgICAgICAgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLnB1c2goaSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVWYWx1ZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIGlmIChidWlsdEluQ29ubmVjdGlvbi5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBgW1wiJHt2YWx1ZX1cIl1gO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgW3Rlc3QsIGdldEFyZ3NdXSBvZiBPYmplY3QuZW50cmllcyhidWlsdEluQ29ubmVjdGlvblJlZ2V4KSlcbiAgICAgICAgaWYgKCg8UmVnRXhwPnRlc3QpLnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIGBbXCIke25hbWV9XCIsICR7KDxhbnk+Z2V0QXJncykodmFsdWUpfV1gO1xuXG4gICAgcmV0dXJuIGBbJHt2YWx1ZX1dYDtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVZhbGlkYXRpb25KU09OKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBQcm9taXNlPGJvb2xlYW4gfCBzdHJpbmdbXT4ge1xuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50LCAuLi5lbGVtZW50QXJnc10gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuICAgICAgICBsZXQgcmV0dXJuTm93ID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdudW0nOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICBjYXNlICdpbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFlbWFpbFZhbGlkYXRvci50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXZlUmVnZXggPSB2YWx1ZSAhPSBudWxsICYmIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbZWxlbWVudF07XG5cbiAgICAgICAgICAgICAgICBpZihoYXZlUmVnZXgpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhaGF2ZVJlZ2V4WzJdKGVsZW1lbnRBcmdzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gZWxlbWVudC50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhYXdhaXQgZWxlbWVudCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0dXJuTm93KSB7XG4gICAgICAgICAgICBsZXQgaW5mbyA9IGBmYWlsZWQgYXQgJHtpfSBmaWxlZCAtICR7aXNEZWZhdWx0ID8gcmV0dXJuTm93IDogJ2V4cGVjdGVkICcgKyBlbGVtZW50fWA7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRBcmdzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBpbmZvICs9IGAsIGFyZ3VtZW50czogJHtKU09OLnN0cmluZ2lmeShlbGVtZW50QXJncyl9YDtcblxuICAgICAgICAgICAgaW5mbyArPSBgLCBpbnB1dDogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIFtpbmZvLCBlbGVtZW50LCBlbGVtZW50QXJncywgdmFsdWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVZhbHVlcyhhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IHBhcnNlZCA9IFtdO1xuXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnRdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcblxuICAgICAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKGVsZW1lbnQpKVxuICAgICAgICAgICAgcGFyc2VkLnB1c2gocGFyc2VGbG9hdCh2YWx1ZSkpO1xuXG4gICAgICAgIGVsc2UgaWYgKGJvb2xlYW5zLmluY2x1ZGVzKGVsZW1lbnQpKVxuICAgICAgICAgICAgcGFyc2VkLnB1c2godmFsdWUgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZSk7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFyc2VkLnB1c2godmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgZmluZDogc3RyaW5nLCBkZWZhdWx0RGF0YTogYW55ID0gbnVsbCk6IHN0cmluZyB8IG51bGwgfCBib29sZWFue1xuICAgIGNvbnN0IGhhdmUgPSBkYXRhLmhhdmUoZmluZCksIHZhbHVlID0gZGF0YS5yZW1vdmUoZmluZCk7XG5cbiAgICBpZihoYXZlICYmIHZhbHVlICE9ICdmYWxzZScpIHJldHVybiB2YWx1ZSB8fCBoYXZlICAgIFxuICAgIGlmKHZhbHVlID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZighaGF2ZSkgcmV0dXJuIGRlZmF1bHREYXRhO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xufSIsICJpbXBvcnQge1RyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gJ2VzYnVpbGQtd2FzbSc7XG5pbXBvcnQgeyBiYWNrVG9PcmlnaW5hbCB9IGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkJztcbmltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU3RyaW5nVHJhY2tlciwgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSAnLi4vZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uL0pTUGFyc2VyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uL1Nlc3Npb24nO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSAnLi9FYXN5U3ludGF4JztcblxuZnVuY3Rpb24gRXJyb3JUZW1wbGF0ZShpbmZvOiBzdHJpbmcpe1xuICAgIHJldHVybiBgbW9kdWxlLmV4cG9ydHMgPSAoKSA9PiAoRGF0YU9iamVjdCkgPT4gRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ICs9IFwiPHAgc3R5bGU9XFxcXFwiY29sb3I6cmVkO3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MTZweDtcXFxcXCI+U3ludGF4IEVycm9yOiAke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoaW5mby5yZXBsYWNlQWxsKCdcXG4nLCAnPGJyLz4nKSl9PC9wPlwiYDtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0ZXh0IFxuICogQHBhcmFtIHR5cGUgXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQodGV4dDogU3RyaW5nVHJhY2tlciwgaXNUeXBlc2NyaXB0OiBib29sZWFuLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgdGV4dCA9IHRleHQudHJpbSgpO1xuXG4gICAgY29uc3QgT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucyA9IHtcbiAgICAgICAgZm9ybWF0OiAnY2pzJyxcbiAgICAgICAgbG9hZGVyOiBpc1R5cGVzY3JpcHQgPyAndHMnOiAnanMnLFxuICAgICAgICBzb3VyY2VtYXA6IHNlc3Npb25JbmZvLmRlYnVnLFxuICAgICAgICBzb3VyY2VmaWxlOiBzZXNzaW9uSW5mby5zbWFsbFBhdGgsXG4gICAgICAgIGRlZmluZToge1xuICAgICAgICAgICAgZGVidWc6ICcnICsgc2Vzc2lvbkluZm8uZGVidWdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgcmVzdWx0OiBTdHJpbmdUcmFja2VyXG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7Y29kZSwgbWFwLCB3YXJuaW5nc30gPSBhd2FpdCB0cmFuc2Zvcm0oYXdhaXQgRWFzeVN5bnRheC5CdWlsZEFuZEV4cG9ydEltcG9ydHModGV4dC5lcSksIE9wdGlvbnMpO1xuICAgICAgICBFU0J1aWxkUHJpbnRXYXJuaW5nc1N0cmluZ1RyYWNrZXIodGV4dCwgd2FybmluZ3MpO1xuICAgICAgICByZXN1bHQgPSBtYXAgPyBhd2FpdCBiYWNrVG9PcmlnaW5hbCh0ZXh0LCBjb2RlLCBtYXApOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBjb2RlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyKHRleHQsIGVycik7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IHRleHQuZGVidWdMaW5lKGVycik7XG5cbiAgICAgICAgaWYoc2Vzc2lvbkluZm8uZGVidWcpXG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCBFcnJvclRlbXBsYXRlKGVycm9yTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59IiwgImltcG9ydCBFYXN5RnMgZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gRWFzeUZzLnJlYWRKc29uRmlsZShwYXRoKTtcbn0iLCAiaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKHBhdGgpKTtcbiAgICBjb25zdCB3YXNtSW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2Uod2FzbU1vZHVsZSwge30pO1xuICAgIHJldHVybiB3YXNtSW5zdGFuY2UuZXhwb3J0cztcbn0iLCAiaW1wb3J0IGpzb24gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHdhc20gZnJvbSBcIi4vd2FzbVwiO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tVHlwZXMgPSBbXCJqc29uXCIsIFwid2FzbVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gSW1wb3J0QnlFeHRlbnNpb24ocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpe1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIHJldHVybiBqc29uKHBhdGgpXG4gICAgICAgIGNhc2UgXCJ3YXNtXCI6XG4gICAgICAgICAgICByZXR1cm4gd2FzbShwYXRoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnQocGF0aClcbiAgICB9XG59IiwgImltcG9ydCB7IGN1c3RvbVR5cGVzIH0gZnJvbSAnLi4vLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0V4dGVuc2lvbi9pbmRleCc7XG5pbXBvcnQgeyBCYXNlUmVhZGVyIH0gZnJvbSAnLi4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHsgRW5kT2ZCbG9jaywgRW5kT2ZEZWZTa2lwQmxvY2ssIFBhcnNlVGV4dFN0cmVhbSwgUmVCdWlsZENvZGVTdHJpbmcgfSBmcm9tICcuL0Vhc3lTY3JpcHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXN5U3ludGF4IHtcbiAgICBwcml2YXRlIEJ1aWxkOiBSZUJ1aWxkQ29kZVN0cmluZztcblxuICAgIGFzeW5jIGxvYWQoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlQXJyYXkgPSBhd2FpdCBQYXJzZVRleHRTdHJlYW0oY29kZSk7XG4gICAgICAgIHRoaXMuQnVpbGQgPSBuZXcgUmVCdWlsZENvZGVTdHJpbmcocGFyc2VBcnJheSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQgPSB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmluZ0V4cG9ydEFsbCA9IHRoaXMuYWN0aW9uU3RyaW5nRXhwb3J0QWxsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjb25zdCAke2RhdGFPYmplY3R9ID0gYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnQocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBkYXRhT2JqZWN0OiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0KHJlcGxhY2VUb1R5cGUsIGRhdGFPYmplY3QsIGluZGV4KX07T2JqZWN0LmFzc2lnbihleHBvcnRzLCAke2RhdGFPYmplY3R9KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdJbXBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgYXdhaXQgJHtyZXBsYWNlVG9UeXBlfSg8fCR7aW5kZXh9fHw+KWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3Rpb25TdHJpbmdFeHBvcnRBbGwocmVwbGFjZVRvVHlwZTogc3RyaW5nLCBpbmRleDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBgT2JqZWN0LmFzc2lnbihleHBvcnRzLCAke3RoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKHJlcGxhY2VUb1R5cGUsIGluZGV4KX0pYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIEJ1aWxkSW1wb3J0VHlwZSh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGRhdGFPYmplY3Q6IHN0cmluZywgaW5kZXg6IHN0cmluZykgPT4gc3RyaW5nID0gdGhpcy5hY3Rpb25TdHJpbmdJbXBvcnQpIHtcbiAgICAgICAgbGV0IGJlZm9yZVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChgJHt0eXBlfVsgXFxcXG5dKyhbXFxcXCpdezAsMX1bXFxcXHB7TH0wLTlfLFxcXFx7XFxcXH0gXFxcXG5dKylbIFxcXFxuXStmcm9tWyBcXFxcbl0rPFxcXFx8KFswLTldKylcXFxcfFxcXFx8PmAsICd1JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmcuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgRGF0YU9iamVjdDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gZGF0YS5zdWJzdHJpbmcoMSkucmVwbGFjZSgnIGFzICcsICcnKS50cmltU3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFNwbGljZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVswXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZCA9IGRhdGEuc3BsaXQoJ30nLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFswXSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGxpY2VkWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3BsaWNlZFsxXSA9IFNwbGljZWRbMV0uc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTcGxpY2VkID0gZGF0YS5zcGxpdCgnLCcsIDEpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBTcGxpY2VkID0gU3BsaWNlZC5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4geC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwbGljZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwbGljZWRbMF1bMF0gPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhT2JqZWN0ID0gU3BsaWNlZFswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSB0aGlzLkJ1aWxkLkFsbElucHV0c1ttYXRjaFsyXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24uc3Vic3RyaW5nKGV4dGVuc2lvbi5sYXN0SW5kZXhPZignLicpICsgMSwgZXh0ZW5zaW9uLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGB7ZGVmYXVsdDoke1NwbGljZWRbMF19fWA7IC8vb25seSBpZiB0aGlzIGlzbid0IGN1c3RvbSBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IFNwbGljZWRbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgRGF0YU9iamVjdCA9IGAke0RhdGFPYmplY3Quc3Vic3RyaW5nKDAsIERhdGFPYmplY3QubGVuZ3RoIC0gMSl9LGRlZmF1bHQ6JHtTcGxpY2VkWzFdfX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERhdGFPYmplY3QgPSBEYXRhT2JqZWN0LnJlcGxhY2UoLyBhcyAvLCAnOicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmVTdHJpbmcgKz0gYWN0aW9uU3RyaW5nKHJlcGxhY2VUb1R5cGUsIERhdGFPYmplY3QsIG1hdGNoWzJdKTtcblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZztcblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBiZWZvcmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBCdWlsZEluT25lV29yZCh0eXBlOiBzdHJpbmcsIHJlcGxhY2VUb1R5cGUgPSB0eXBlLCBhY3Rpb25TdHJpbmc6IChyZXBsYWNlVG9UeXBlOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHN0cmluZyA9IHRoaXMuYWN0aW9uU3RyaW5nSW1wb3J0QWxsKSB7XG4gICAgICAgIGxldCBiZWZvcmVTdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAodHlwZSArICdbIFxcXFxuXSs8XFxcXHwoWzAtOV0rKVxcXFx8XFxcXHw+JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmVtYXRjaCgpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cblxuICAgICAgICAgICAgYmVmb3JlU3RyaW5nICs9IGFjdGlvblN0cmluZyhyZXBsYWNlVG9UeXBlLCBtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgIFJlbWF0Y2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZVN0cmluZyArPSBuZXdTdHJpbmc7XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gYmVmb3JlU3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhTcGFjZShmdW5jOiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gZnVuYygnICcgKyB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQpLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIERlZmluZShkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7a2V5fShbXlxcXFxwe0x9XSlgLCAnZ3VpJyksICguLi5tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHZhbHVlICsgbWF0Y2hbMl1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgQnVpbGRJbkFzRnVuY3Rpb24od29yZDogc3RyaW5nLCB0b1dvcmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlcGxhY2VXaXRoU3BhY2UodGV4dCA9PiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFteXFxcXHB7TH1dKSR7d29yZH0oWyBcXFxcbl0qXFxcXCgpYCwgJ2d1aScpLCAoLi4ubWF0Y2gpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXSArIHRvV29yZCArIG1hdGNoWzJdXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFZhcmlhYmxlKCl7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQ7XG4gICAgICAgIGxldCBtYXRjaDogUmVnRXhwTWF0Y2hBcnJheTtcblxuICAgICAgICBmdW5jdGlvbiBSZW1hdGNoKCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBuZXdTdHJpbmcubWF0Y2goLyhleHBvcnRbIFxcbl0rKSh2YXJ8bGV0fGNvbnN0KVsgXFxuXSsoW1xccHtMfVxcJF9dW1xccHtMfTAtOVxcJF9dKikvdSk7XG4gICAgICAgIH1cblxuICAgICAgICBSZW1hdGNoKCk7XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRXhwb3J0ID0gbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG5cbiAgICAgICAgICAgIGlmKGNsb3NlSW5kZXggPT0gLTEpe1xuICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpLCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG5cbiAgICAgICAgICAgIG5ld1N0cmluZyA9IGAke2JlZm9yZU1hdGNoICsgcmVtb3ZlRXhwb3J0KyBiZWZvcmVDbG9zZX07ZXhwb3J0cy4ke21hdGNoWzNdfT0ke21hdGNoWzNdfSR7YWZ0ZXJDbG9zZX1gO1xuXG4gICAgICAgICAgICBSZW1hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkJ1aWxkLkNvZGVCdWlsZFRleHQgPSBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRCbG9jaygpe1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0O1xuICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmVtYXRjaCgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gbmV3U3RyaW5nLm1hdGNoKC8oZXhwb3J0WyBcXG5dKykoZGVmYXVsdFsgXFxuXSspPyhbXiBcXG5dKS91KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlbWF0Y2goKTtcblxuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBiZWZvcmVNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZUV4cG9ydCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGggKyAobWF0Y2hbMl0gfHwgJycpLmxlbmd0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGFyID0gbWF0Y2hbM11bMF0sIGlzRGVmYXVsdCA9IEJvb2xlYW4obWF0Y2hbMl0pO1xuICAgICAgICAgICAgaWYoZmlyc3RDaGFyPT0gJ3snKXtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJNYXRjaCA9IG5ld1N0cmluZy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyAnZXhwb3J0cy5kZWZhdWx0PScgKyByZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gYXdhaXQgRW5kT2ZCbG9jayhhZnRlck1hdGNoLCBbJ3snLCAnfSddKTtcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlTWF0Y2ggKz0gYE9iamVjdC5hc3NpZ24oZXhwb3J0cywgJHtyZW1vdmVFeHBvcnQgKyBhZnRlck1hdGNoLnN1YnN0cmluZygwLCBlbmRJbmRleCsxKX0pYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYmVmb3JlTWF0Y2ggKyBhZnRlck1hdGNoLnN1YnN0cmluZyhlbmRJbmRleCsxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck1hdGNoID0gbmV3U3RyaW5nLnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICByZW1vdmVFeHBvcnQgPSByZW1vdmVFeHBvcnQuc2xpY2UoMCwgLTEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlSW5kZXggPSBhd2FpdCBFbmRPZkRlZlNraXBCbG9jayhhZnRlck1hdGNoLFsnOycsICdcXG4nXSk7XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VJbmRleCA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSW5kZXggPSBhZnRlck1hdGNoLnRyaW1FbmQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVDbG9zZSA9IGFmdGVyTWF0Y2guc3Vic3RyaW5nKDAsIGNsb3NlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBiZWZvcmVDbG9zZS5tYXRjaCgvKGZ1bmN0aW9ufGNsYXNzKVsgfFxcbl0rKFtcXHB7TH1cXCRfXVtcXHB7TH0wLTlcXCRfXSopPy91KTtcblxuICAgICAgICAgICAgICAgIGlmKGJsb2NrTWF0Y2g/LlsyXSl7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckNsb3NlID0gYWZ0ZXJNYXRjaC5zdWJzdHJpbmcoY2xvc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBgJHtiZWZvcmVNYXRjaCArIHJlbW92ZUV4cG9ydCsgYmVmb3JlQ2xvc2V9ZXhwb3J0cy4ke2lzRGVmYXVsdCA/ICdkZWZhdWx0JzogYmxvY2tNYXRjaFsyXX09JHtibG9ja01hdGNoWzJdfSR7YWZ0ZXJDbG9zZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpc0RlZmF1bHQpe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgPSBiZWZvcmVNYXRjaCArICdleHBvcnRzLmRlZmF1bHQ9JyArIHJlbW92ZUV4cG9ydCArIGFmdGVyTWF0Y2g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nID0gYCR7YmVmb3JlTWF0Y2h9ZXhwb3J0cy4ke2JlZm9yZUNsb3NlLnNwbGl0KC8gfFxcbi8sIDEpLnBvcCgpfT0ke3JlbW92ZUV4cG9ydCsgYWZ0ZXJNYXRjaH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVtYXRjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5CdWlsZC5Db2RlQnVpbGRUZXh0ID0gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIEJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW1wb3J0JywgJ3JlcXVpcmUnKTtcbiAgICAgICAgdGhpcy5CdWlsZEltcG9ydFR5cGUoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnQpO1xuICAgICAgICB0aGlzLkJ1aWxkSW1wb3J0VHlwZSgnaW5jbHVkZScpO1xuXG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2ltcG9ydCcsICdyZXF1aXJlJyk7XG4gICAgICAgIHRoaXMuQnVpbGRJbk9uZVdvcmQoJ2V4cG9ydCcsICdyZXF1aXJlJywgdGhpcy5hY3Rpb25TdHJpbmdFeHBvcnRBbGwpO1xuICAgICAgICB0aGlzLkJ1aWxkSW5PbmVXb3JkKCdpbmNsdWRlJyk7XG5cbiAgICAgICAgdGhpcy5CdWlsZEluQXNGdW5jdGlvbignaW1wb3J0JywgJ3JlcXVpcmUnKTtcblxuICAgICAgICAvL2VzbSB0byBjanMgLSBleHBvcnRcbiAgICAgICAgYXdhaXQgdGhpcy5leHBvcnRWYXJpYWJsZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmV4cG9ydEJsb2NrKCk7XG5cbiAgICAgICAgZGVmaW5lRGF0YSAmJiB0aGlzLkRlZmluZShkZWZpbmVEYXRhKTtcbiAgICB9XG5cbiAgICBCdWlsdFN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQnVpbGQuQnVpbGRDb2RlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIEJ1aWxkQW5kRXhwb3J0SW1wb3J0cyhjb2RlOiBzdHJpbmcsIGRlZmluZURhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgRWFzeVN5bnRheCgpO1xuICAgICAgICBhd2FpdCBidWlsZGVyLmxvYWQoYCAke2NvZGV9IGApO1xuICAgICAgICBhd2FpdCBidWlsZGVyLkJ1aWxkSW1wb3J0cyhkZWZpbmVEYXRhKTtcblxuICAgICAgICBjb2RlID0gYnVpbGRlci5CdWlsdFN0cmluZygpO1xuICAgICAgICByZXR1cm4gY29kZS5zdWJzdHJpbmcoMSwgY29kZS5sZW5ndGggLSAxKTtcbiAgICB9XG59IiwgImltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZUpTT05cIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAsIFN0cmluZ01hcCwgU3RyaW5nTnVtYmVyTWFwLCB0YWdEYXRhT2JqZWN0QXJyYXkgfSBmcm9tIFwiLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlc1wiO1xuaW1wb3J0IEJhc2U2NElkIGZyb20gJy4uL1N0cmluZ01ldGhvZHMvSWQnO1xuaW1wb3J0IEVhc3lGcyBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvRWFzeUZzXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tIFwiLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9zZXJ2LWNvbm5lY3RcIjtcbmltcG9ydCB7IGlzVHMgfSBmcm9tIFwiLi9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBCdWlsZFNjcmlwdCBmcm9tIFwiLi90cmFuc2Zvcm0vU2NyaXB0XCI7XG5cblxuZXhwb3J0IHR5cGUgc2V0RGF0YUhUTUxUYWcgPSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcFxufVxuXG5leHBvcnQgdHlwZSBjb25uZWN0b3JBcnJheSA9IHtcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHNlbmRUbzogc3RyaW5nLFxuICAgIHZhbGlkYXRvcjogc3RyaW5nW10sXG4gICAgb3JkZXI/OiBzdHJpbmdbXSxcbiAgICBub3RWYWxpZD86IHN0cmluZyxcbiAgICBtZXNzYWdlPzogc3RyaW5nIHwgYm9vbGVhbixcbiAgICByZXNwb25zZVNhZmU/OiBib29sZWFuXG59W11cblxuZXhwb3J0IHR5cGUgY2FjaGVDb21wb25lbnQgPSB7XG4gICAgW2tleTogc3RyaW5nXTogbnVsbCB8IHtcbiAgICAgICAgbXRpbWVNcz86IG51bWJlcixcbiAgICAgICAgdmFsdWU/OiBzdHJpbmdcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIGluVGFnQ2FjaGUgPSB7XG4gICAgc3R5bGU6IHN0cmluZ1tdXG4gICAgc2NyaXB0OiBzdHJpbmdbXVxuICAgIHNjcmlwdE1vZHVsZTogc3RyaW5nW11cbn1cblxuY29uc3QgU3RhdGljRmlsZXNJbmZvID0gbmV3IFN0b3JlSlNPTignU2hvcnRTY3JpcHROYW1lcycpO1xuXG4vKiBUaGUgU2Vzc2lvbkJ1aWxkIGNsYXNzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGhlYWQgb2YgdGhlIHBhZ2UgKi9cbmV4cG9ydCBjbGFzcyBTZXNzaW9uQnVpbGQge1xuICAgIGNvbm5lY3RvckFycmF5OiBjb25uZWN0b3JBcnJheSA9IFtdXG4gICAgcHJpdmF0ZSBzY3JpcHRVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgc3R5bGVVUkxTZXQ6IHNldERhdGFIVE1MVGFnW10gPSBbXVxuICAgIHByaXZhdGUgaW5TY3JpcHRTdHlsZTogeyB0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgcGF0aDogc3RyaW5nLCB2YWx1ZTogU291cmNlTWFwU3RvcmUgfVtdID0gW11cbiAgICBoZWFkSFRNTCA9ICcnXG4gICAgY2FjaGU6IGluVGFnQ2FjaGUgPSB7XG4gICAgICAgIHN0eWxlOiBbXSxcbiAgICAgICAgc2NyaXB0OiBbXSxcbiAgICAgICAgc2NyaXB0TW9kdWxlOiBbXVxuICAgIH1cbiAgICBjYWNoZUNvbXBpbGVTY3JpcHQ6IGFueSA9IHt9XG4gICAgY2FjaGVDb21wb25lbnQ6IGNhY2hlQ29tcG9uZW50ID0ge31cbiAgICBjb21waWxlUnVuVGltZVN0b3JlOiBTdHJpbmdBbnlNYXAgPSB7fVxuICAgIGRlcGVuZGVuY2llczogU3RyaW5nTnVtYmVyTWFwID0ge31cbiAgICByZWNvcmROYW1lczogc3RyaW5nW10gPSBbXVxuXG4gICAgZ2V0IHNhZmVEZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWcgJiYgdGhpcy5fc2FmZURlYnVnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzbWFsbFBhdGg6IHN0cmluZywgcHVibGljIGZ1bGxQYXRoOiBzdHJpbmcsIHB1YmxpYyB0eXBlTmFtZT86IHN0cmluZywgcHVibGljIGRlYnVnPzogYm9vbGVhbiwgcHJpdmF0ZSBfc2FmZURlYnVnPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLkJ1aWxkU2NyaXB0V2l0aFByYW1zID0gdGhpcy5CdWlsZFNjcmlwdFdpdGhQcmFtcy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHN0eWxlKHVybDogc3RyaW5nLCBhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlVVJMU2V0LmZpbmQoeCA9PiB4LnVybCA9PSB1cmwgJiYgSlNPTi5zdHJpbmdpZnkoeC5hdHRyaWJ1dGVzKSA9PSBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdHlsZVVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHNjcmlwdCh1cmw6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBpZiAodGhpcy5zY3JpcHRVUkxTZXQuZmluZCh4ID0+IHgudXJsID09IHVybCAmJiBKU09OLnN0cmluZ2lmeSh4LmF0dHJpYnV0ZXMpID09IEpTT04uc3RyaW5naWZ5KGF0dHJpYnV0ZXMpKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnNjcmlwdFVSTFNldC5wdXNoKHsgdXJsLCBhdHRyaWJ1dGVzIH0pO1xuICAgIH1cblxuICAgIHJlY29yZChuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZE5hbWVzLmluY2x1ZGVzKG5hbWUpKVxuICAgICAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcGVuZGVuY2Uoc21hbGxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoID0gQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzbWFsbFBhdGgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0pIHJldHVybjtcblxuICAgICAgICBjb25zdCBoYXZlRGVwID0gYXdhaXQgRWFzeUZzLnN0YXQoZnVsbFBhdGgsICdtdGltZU1zJywgdHJ1ZSwgbnVsbCk7IC8vIGNoZWNrIHBhZ2UgY2hhbmdlZCBkYXRlLCBmb3IgZGVwZW5kZW5jZU9iamVjdDtcbiAgICAgICAgaWYgKGhhdmVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzW3NtYWxsUGF0aF0gPSBoYXZlRGVwXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlKHR5cGU6ICdzY3JpcHQnIHwgJ3N0eWxlJyB8ICdtb2R1bGUnLCBzbWFsbFBhdGggPSB0aGlzLnNtYWxsUGF0aCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuaW5TY3JpcHRTdHlsZS5maW5kKHggPT4geC50eXBlID09IHR5cGUgJiYgeC5wYXRoID09IHNtYWxsUGF0aCk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IHsgdHlwZSwgcGF0aDogc21hbGxQYXRoLCB2YWx1ZTogbmV3IFNvdXJjZU1hcFN0b3JlKHNtYWxsUGF0aCwgdGhpcy5zYWZlRGVidWcsIHR5cGUgPT0gJ3N0eWxlJywgdHJ1ZSkgfVxuICAgICAgICAgICAgdGhpcy5pblNjcmlwdFN0eWxlLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS52YWx1ZVxuICAgIH1cblxuICAgIGFkZFNjcmlwdFN0eWxlUGFnZSh0eXBlOiAnc2NyaXB0JyB8ICdzdHlsZScgfCAnbW9kdWxlJywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBpbmZvOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjcmlwdFN0eWxlKHR5cGUsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3BhZ2UnKSA/IHRoaXMuc21hbGxQYXRoIDogaW5mby5leHRyYWN0SW5mbygpKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZU5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTdGF0aWNGaWxlc0luZm8uc3RvcmUpO1xuICAgICAgICB3aGlsZSAoa2V5ID09IG51bGwgfHwgdmFsdWVzLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIGtleSA9IEJhc2U2NElkKHRleHQsIDUgKyBsZW5ndGgpLnN1YnN0cmluZyhsZW5ndGgpO1xuICAgICAgICAgICAgbGVuZ3RoKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYWRkSGVhZFRhZ3MoKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VMb2cgPSB0aGlzLnR5cGVOYW1lID09IGdldFR5cGVzLkxvZ3NbMl1cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuaW5TY3JpcHRTdHlsZSkge1xuICAgICAgICAgICAgY29uc3QgaXNMb2cgPSBwYWdlTG9nICYmIGkucGF0aCA9PSB0aGlzLnNtYWxsUGF0aDtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVMb2NhdGlvbiA9IGlzTG9nPyBnZXRUeXBlcy5Mb2dzWzFdIDogZ2V0VHlwZXMuU3RhdGljWzFdLCBhZGRRdWVyeSA9IGlzTG9nID8gJz90PWwnIDogJyc7XG4gICAgICAgICAgICBsZXQgdXJsID0gU3RhdGljRmlsZXNJbmZvLmhhdmUoaS5wYXRoLCAoKSA9PiBTZXNzaW9uQnVpbGQuY3JlYXRlTmFtZShpLnBhdGgpKSArICcucHViJztcblxuICAgICAgICAgICAgc3dpdGNoIChpLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy5qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IGRlZmVyOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLm1qcyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0KCcvJyArIHVybCArIGFkZFF1ZXJ5LCB7IHR5cGU6ICdtb2R1bGUnIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0eWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcuY3NzJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZSgnLycgKyB1cmwgKyBhZGRRdWVyeSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEVhc3lGcy53cml0ZUZpbGUoc2F2ZUxvY2F0aW9uICsgdXJsLCBhd2FpdCBpLnZhbHVlLmNyZWF0ZURhdGFXaXRoTWFwKCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBidWlsZEhlYWQoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRkSGVhZFRhZ3MoKTtcblxuICAgICAgICBjb25zdCBtYWtlQXR0cmlidXRlcyA9IChpOiBzZXREYXRhSFRNTFRhZykgPT4gaS5hdHRyaWJ1dGVzID8gJyAnICsgT2JqZWN0LmtleXMoaS5hdHRyaWJ1dGVzKS5tYXAoeCA9PiBpLmF0dHJpYnV0ZXNbeF0gPyB4ICsgYD1cIiR7aS5hdHRyaWJ1dGVzW3hdfVwiYCA6IHgpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgICAgIGxldCBidWlsZEJ1bmRsZVN0cmluZyA9ICcnOyAvLyBhZGQgc2NyaXB0cyBhZGQgY3NzXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnN0eWxlVVJMU2V0KVxuICAgICAgICAgICAgYnVpbGRCdW5kbGVTdHJpbmcgKz0gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtpLnVybH1cIiR7bWFrZUF0dHJpYnV0ZXMoaSl9Lz5gO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5zY3JpcHRVUkxTZXQpXG4gICAgICAgICAgICBidWlsZEJ1bmRsZVN0cmluZyArPSBgPHNjcmlwdCBzcmM9XCIke2kudXJsfVwiJHttYWtlQXR0cmlidXRlcyhpKX0+PC9zY3JpcHQ+YDtcblxuICAgICAgICByZXR1cm4gYnVpbGRCdW5kbGVTdHJpbmcgKyB0aGlzLmhlYWRIVE1MO1xuICAgIH1cblxuICAgIGV4dGVuZHMoZnJvbTogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yQXJyYXkucHVzaCguLi5mcm9tLmNvbm5lY3RvckFycmF5KTtcbiAgICAgICAgdGhpcy5zY3JpcHRVUkxTZXQucHVzaCguLi5mcm9tLnNjcmlwdFVSTFNldCk7XG4gICAgICAgIHRoaXMuc3R5bGVVUkxTZXQucHVzaCguLi5mcm9tLnN0eWxlVVJMU2V0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZnJvbS5pblNjcmlwdFN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLmluU2NyaXB0U3R5bGUucHVzaCh7IC4uLmksIHZhbHVlOiBpLnZhbHVlLmNsb25lKCkgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcHlPYmplY3RzID0gWydjYWNoZUNvbXBpbGVTY3JpcHQnLCAnY2FjaGVDb21wb25lbnQnLCAnZGVwZW5kZW5jaWVzJ107XG5cbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNvcHlPYmplY3RzKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXNbY10sIGZyb21bY10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvcmROYW1lcy5wdXNoKC4uLmZyb20ucmVjb3JkTmFtZXMuZmlsdGVyKHggPT4gIXRoaXMucmVjb3JkTmFtZXMuaW5jbHVkZXMoeCkpKTtcblxuICAgICAgICB0aGlzLmhlYWRIVE1MICs9IGZyb20uaGVhZEhUTUw7XG4gICAgICAgIHRoaXMuY2FjaGUuc3R5bGUucHVzaCguLi5mcm9tLmNhY2hlLnN0eWxlKTtcbiAgICAgICAgdGhpcy5jYWNoZS5zY3JpcHQucHVzaCguLi5mcm9tLmNhY2hlLnNjcmlwdCk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NyaXB0TW9kdWxlLnB1c2goLi4uZnJvbS5jYWNoZS5zY3JpcHRNb2R1bGUpO1xuICAgIH1cblxuICAgIC8vYmFzaWMgbWV0aG9kc1xuICAgIEJ1aWxkU2NyaXB0V2l0aFByYW1zKGNvZGU6IFN0cmluZ1RyYWNrZXIpe1xuICAgICAgICByZXR1cm4gQnVpbGRTY3JpcHQoY29kZSwgaXNUcygpLCB0aGlzKTsgIFxuICAgIH1cbn0iLCAiLy8gQHRzLW5vY2hlY2tcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IGNsZWFyTW9kdWxlIGZyb20gJ2NsZWFyLW1vZHVsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKSwgcmVzb2x2ZSA9IChwYXRoOiBzdHJpbmcpID0+IHJlcXVpcmUucmVzb2x2ZShwYXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUoZmlsZVBhdGgpO1xuICAgIGNsZWFyTW9kdWxlKGZpbGVQYXRoKTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59XG5cbmV4cG9ydCB7XG4gICAgY2xlYXJNb2R1bGUsXG4gICAgcmVzb2x2ZVxufSIsICJpbXBvcnQgeyBXYXJuaW5nIH0gZnJvbSBcInN2ZWx0ZS90eXBlcy9jb21waWxlci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSBcIi4uLy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3XCI7XG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3IgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuXG5jbGFzcyByZUxvY2F0aW9uIHtcbiAgICBtYXA6IFByb21pc2U8U291cmNlTWFwQ29uc3VtZXI+XG4gICAgY29uc3RydWN0b3Ioc291cmNlTWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXApXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0TG9jYXRpb24obG9jYXRpb246IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfSl7XG4gICAgICAgIGNvbnN0IHtsaW5lLCBjb2x1bW59ID0gKGF3YWl0IHRoaXMubWFwKS5vcmlnaW5hbFBvc2l0aW9uRm9yKGxvY2F0aW9uKVxuICAgICAgICByZXR1cm4gYCR7bGluZX06JHtjb2x1bW59YDtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQcmludFN2ZWx0ZUVycm9yKHsgbWVzc2FnZSwgY29kZSwgc3RhcnQsIGZyYW1lIH06IFdhcm5pbmcsIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKVxuICAgIFByaW50SWZOZXcoe1xuICAgICAgICBlcnJvck5hbWU6ICdzdmVsdGUtJyArIGNvZGUsXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGAke21lc3NhZ2V9XFxuJHtmcmFtZX1cXG4ke2ZpbGVQYXRofToke2F3YWl0IGZpbmRMb2NhdGlvbi5nZXRMb2NhdGlvbihzdGFydCl9YFxuICAgIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUHJpbnRTdmVsdGVXYXJuKHdhcm5pbmdzOiBXYXJuaW5nW10sIGZpbGVQYXRoOiBzdHJpbmcsIHNvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gICAgY29uc3QgZmluZExvY2F0aW9uID0gbmV3IHJlTG9jYXRpb24oc291cmNlTWFwKTtcbiAgICBmb3IoY29uc3QgeyBtZXNzYWdlLCBjb2RlLCBzdGFydCwgZnJhbWUgfSBvZiB3YXJuaW5ncyl7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgZXJyb3JOYW1lOiAnc3ZlbHRlLScgKyBjb2RlLFxuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgdGV4dDogYCR7bWVzc2FnZX1cXG4ke2ZyYW1lfVxcbiR7ZmlsZVBhdGh9OiR7YXdhaXQgZmluZExvY2F0aW9uLmdldExvY2F0aW9uKHN0YXJ0KX1gXG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55KSB7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJDb2RlKG9yaWdSdWxlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ1JlbmRlcmVkID0gb3JpZ1J1bGUoLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb2RlLWNvcHlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2NvcHktY2xpcGJvYXJkXCIgb25jbGljaz1cIm5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRoaXMucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0KVwiPmNvcHk8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgJHtvcmlnUmVuZGVyZWR9XG4gICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrKTtcbiAgICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuZmVuY2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIGNvbnN0IGhsanNDbGFzcyA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSkpLFxuICAgICAgICBicmVha3M6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSksXG4gICAgICAgIHR5cG9ncmFwaGVyOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3R5cG9ncmFwaGVyJywgbWFya0Rvd25QbHVnaW4/LnR5cG9ncmFwaGVyID8/IHRydWUpKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGVycixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdtYXJrZG93bi1wYXJzZXInXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoY29kZVdpdGhDb3B5KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYWJicicsIG1hcmtEb3duUGx1Z2luPy5hYmJyID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEFiYnIpO1xuXG4gICAgbGV0IG1hcmtkb3duQ29kZSA9IEJldHdlZW5UYWdEYXRhPy5lcTtcbiAgICBpZiAoIW1hcmtkb3duQ29kZSkge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpKSwgZGF0YVRhZy5yZW1vdmUoJ2ZpbGUnKSk7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnJlbW92ZSgnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICBzZXNzaW9uLnN0eWxlKGNzc0xpbmspO1xuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAndGhlbWUnLCBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgaWYgKGRhdGFUYWcubGVuZ3RoKVxuICAgICAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuICAgIGVsc2VcbiAgICAgICAgYnVpbGRIVE1MLkFkZFRleHRBZnRlcihyZW5kZXJIVE1MKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBidWlsZEhUTUwsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cbmNvbnN0IHRoZW1lQXJyYXkgPSBbJycsICctZGFyaycsICctbGlnaHQnXTtcbmNvbnN0IHRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlNYXJrZG93blRoZW1lKCkge1xuICAgIGZvciAoY29uc3QgaSBvZiB0aGVtZUFycmF5KSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSAoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoZW1lUGF0aCArIGkgKyAnLmNzcycpKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXG5cXC5tYXJrZG93bi1ib2R5IHspfCheLm1hcmtkb3duLWJvZHkgeykvZ20sIChtYXRjaDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoICsgJ3BhZGRpbmc6MjBweDsnXG4gICAgICAgICAgICB9KSArIGBcbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206LTMwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OjEwcHg7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTowO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weTpob3Zlcj5kaXYge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IGE6Zm9jdXMge1xuICAgICAgICAgICAgICAgIGNvbG9yOiM2YmI4NmFcbiAgICAgICAgICAgIH1gO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBCYXNlNjRJZCBmcm9tICcuLi8uLi9TdHJpbmdNZXRob2RzL0lkJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCAsIHNldERhdGFIVE1MVGFnfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCAgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxoZWFkJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pXG4gICAgICAgICAgICB9QERlZmF1bHRJbnNlcnRCdW5kbGU8L2hlYWQ+YCxcbiAgICAgICAgY2hlY2tDb21wb25lbnRzOiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgYnVpbGRCdW5kbGVTdHJpbmcgPSBhd2FpdCBzZXNzaW9uSW5mby5idWlsZEhlYWQoKTtcbiAgICBcbiAgICBjb25zdCBidW5kbGVQbGFjZWhvbGRlciA9IFsvQEluc2VydEJ1bmRsZSg7PykvLCAvQERlZmF1bHRJbnNlcnRCdW5kbGUoOz8pL107XG4gICAgY29uc3QgcmVtb3ZlQnVuZGxlID0gKCkgPT4ge2J1bmRsZVBsYWNlaG9sZGVyLmZvckVhY2goeCA9PiBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2UoeCwgJycpKTsgcmV0dXJuIHBhZ2VEYXRhfTtcblxuXG4gICAgaWYgKCFidWlsZEJ1bmRsZVN0cmluZykgIC8vIHRoZXJlIGlzbid0IGFueXRoaW5nIHRvIGJ1bmRsZVxuICAgICAgICByZXR1cm4gcmVtb3ZlQnVuZGxlKCk7XG5cbiAgICBjb25zdCByZXBsYWNlV2l0aCA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGJ1aWxkQnVuZGxlU3RyaW5nKTsgLy8gYWRkIGJ1bmRsZSB0byBwYWdlXG4gICAgbGV0IGJ1bmRsZVN1Y2NlZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlUGxhY2Vob2xkZXIubGVuZ3RoICYmICFidW5kbGVTdWNjZWVkOyBpKyspXG4gICAgICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZXIoYnVuZGxlUGxhY2Vob2xkZXJbaV0sICgpID0+IChidW5kbGVTdWNjZWVkID0gdHJ1ZSkgJiYgcmVwbGFjZVdpdGgpO1xuXG4gICAgaWYoYnVuZGxlU3VjY2VlZClcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1bmRsZSgpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhLlBsdXMkIGBcXG5vdXRfcnVuX3NjcmlwdC50ZXh0Kz0nJHtyZXBsYWNlV2l0aH0nO2A7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB0eXBlIHsgdGFnRGF0YU9iamVjdEFycmF5LCBCdWlsZEluQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgY29tcGlsZVZhbHVlcywgbWFrZVZhbGlkYXRpb25KU09OLCBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmNvbnN0IHNlcnZlU2NyaXB0ID0gJy9zZXJ2L2Nvbm5lY3QuanMnO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7bmFtZX0oLi4uYXJncyl7cmV0dXJuIGNvbm5lY3RvcihcIiR7bmFtZX1cIiwgYXJncyl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIHsgU29tZVBsdWdpbnMgfSwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG5hbWUgPSBkYXRhVGFnLmdldFZhbHVlKCduYW1lJyksXG4gICAgICAgIHNlbmRUbyA9IGRhdGFUYWcuZ2V0VmFsdWUoJ3NlbmRUbycpLFxuICAgICAgICB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcuZ2V0VmFsdWUoJ3ZhbGlkYXRlJyksXG4gICAgICAgIG5vdFZhbGlkOiBzdHJpbmcgPSBkYXRhVGFnLnJlbW92ZSgnbm90VmFsaWQnKTtcblxuICAgIGxldCBtZXNzYWdlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnbWVzc2FnZScpOyAvLyBzaG93IGVycm9yIG1lc3NhZ2VcbiAgICBpZiAobWVzc2FnZSA9PT0gbnVsbClcbiAgICAgICAgbWVzc2FnZSA9IHNlc3Npb25JbmZvLmRlYnVnICYmICFTb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKTtcblxuICAgICAgICBzZXNzaW9uSW5mby5zY3JpcHQoc2VydmVTY3JpcHQsIHsgYXN5bmM6IG51bGwgfSlcblxuICAgIHNlc3Npb25JbmZvLmFkZFNjcmlwdFN0eWxlUGFnZSgnc2NyaXB0JywgZGF0YVRhZywgdHlwZSkuYWRkVGV4dCh0ZW1wbGF0ZShuYW1lKSk7IC8vIGFkZCBzY3JpcHRcblxuICAgIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5LnB1c2goe1xuICAgICAgICB0eXBlOiAnY29ubmVjdCcsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yICYmIHZhbGlkYXRvci5zcGxpdCgnLCcpLm1hcCh4ID0+IHgudHJpbSgpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmc6IEJldHdlZW5UYWdEYXRhLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IHRydWVcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaW5hbGl6ZUJ1aWxkKHBhZ2VEYXRhOiBTdHJpbmdUcmFja2VyLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgaWYgKCFzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYWdlRGF0YTtcblxuICAgIGxldCBidWlsZE9iamVjdCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gJ2Nvbm5lY3QnKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgYnVpbGRPYmplY3QgKz0gYCxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTpcIiR7aS5uYW1lfVwiLFxuICAgICAgICAgICAgc2VuZFRvOiR7aS5zZW5kVG99LFxuICAgICAgICAgICAgbm90VmFsaWQ6ICR7aS5ub3RWYWxpZCB8fCAnbnVsbCd9LFxuICAgICAgICAgICAgbWVzc2FnZToke3R5cGVvZiBpLm1lc3NhZ2UgPT0gJ3N0cmluZycgPyBgXCIke2kubWVzc2FnZX1cImAgOiBpLm1lc3NhZ2V9LFxuICAgICAgICAgICAgdmFsaWRhdG9yOlskeyhpLnZhbGlkYXRvciAmJiBpLnZhbGlkYXRvci5tYXAoY29tcGlsZVZhbHVlcykuam9pbignLCcpKSB8fCAnJ31dXG4gICAgICAgIH1gO1xuICAgIH1cblxuICAgIGJ1aWxkT2JqZWN0ID0gYFske2J1aWxkT2JqZWN0LnN1YnN0cmluZygxKX1dYDtcblxuICAgIGNvbnN0IGFkZFNjcmlwdCA9IGBcbiAgICAgICAgaWYoUG9zdD8uY29ubmVjdG9yQ2FsbCl7XG4gICAgICAgICAgICBpZihhd2FpdCBoYW5kZWxDb25uZWN0b3IoXCJjb25uZWN0XCIsIHBhZ2UsICR7YnVpbGRPYmplY3R9KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9YDtcblxuICAgIGlmIChwYWdlRGF0YS5pbmNsdWRlcyhcIkBDb25uZWN0SGVyZVwiKSlcbiAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcigvQENvbm5lY3RIZXJlKDs/KS8sICgpID0+IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGFkZFNjcmlwdCkpO1xuICAgIGVsc2VcbiAgICAgICAgcGFnZURhdGEuQWRkVGV4dEFmdGVyTm9UcmFjayhhZGRTY3JpcHQpO1xuXG4gICAgcmV0dXJuIHBhZ2VEYXRhO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGVsQ29ubmVjdG9yKHRoaXNQYWdlOiBhbnksIGNvbm5lY3RvckFycmF5OiBhbnlbXSkge1xuICAgIGlmICghdGhpc1BhZ2UuUG9zdD8uY29ubmVjdG9yQ2FsbClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICBjb25zdCBoYXZlID0gY29ubmVjdG9yQXJyYXkuZmluZCh4ID0+IHgubmFtZSA9PSB0aGlzUGFnZS5Qb3N0LmNvbm5lY3RvckNhbGwubmFtZSk7XG5cbiAgICBpZiAoIWhhdmUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JDYWxsLnZhbHVlcztcbiAgICBjb25zdCBpc1ZhbGlkID0gaGF2ZS52YWxpZGF0b3IubGVuZ3RoICYmIGF3YWl0IG1ha2VWYWxpZGF0aW9uSlNPTih2YWx1ZXMsIGhhdmUudmFsaWRhdG9yKTtcblxuICAgIHRoaXNQYWdlLnNldFJlc3BvbnNlKCcnKTtcblxuICAgIGNvbnN0IGJldHRlckpTT04gPSAob2JqOiBhbnkpID0+IHtcbiAgICAgICAgdGhpc1BhZ2UuUmVzcG9uc2Uuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5lbmQoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gICAgfVxuXG4gICAgaWYgKCFoYXZlLnZhbGlkYXRvci5sZW5ndGggfHwgaXNWYWxpZCA9PT0gdHJ1ZSlcbiAgICAgICAgYmV0dGVySlNPTihhd2FpdCBoYXZlLnNlbmRUbyguLi52YWx1ZXMpKTtcblxuICAgIGVsc2UgaWYgKGhhdmUubm90VmFsaWQpXG4gICAgICAgIGJldHRlckpTT04oYXdhaXQgaGF2ZS5ub3RWYWxpZCguLi48YW55PmlzVmFsaWQpKTtcblxuICAgIGVsc2UgaWYgKGhhdmUubWVzc2FnZSlcbiAgICAgICAgYmV0dGVySlNPTih7XG4gICAgICAgICAgICBlcnJvcjogdHlwZW9mIGhhdmUubWVzc2FnZSA9PSAnc3RyaW5nJyA/IGhhdmUubWVzc2FnZSA6ICg8YW55PmlzVmFsaWQpLnNoaWZ0KClcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICB0aGlzUGFnZS5SZXNwb25zZS5zdGF0dXMoNDAwKTtcblxuICAgIHJldHVybiB0cnVlO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNvbXBpbGVWYWx1ZXMsIG1ha2VWYWxpZGF0aW9uSlNPTiwgcGFyc2VWYWx1ZXMsIHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4gfSBmcm9tICcuL3NlcnYtY29ubmVjdC9pbmRleCc7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkQ29kZShwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgY29uc3Qgc2VuZFRvID0gZGF0YVRhZy5yZW1vdmUoJ3NlbmRUbycpLnRyaW0oKTtcblxuICAgIGlmICghc2VuZFRvKSAgLy8gc3BlY2lhbCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlZFN0cmluZzogbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkYDxmb3JtJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgIHNlc3Npb25JbmZvKVxuICAgICAgICAgICAgICAgIH08L2Zvcm0+YCxcbiAgICAgICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICAgICAgfVxuXG5cbiAgICBjb25zdCBuYW1lID0gZGF0YVRhZy5yZW1vdmUoJ25hbWUnKS50cmltKCkgfHwgdXVpZCgpLCB2YWxpZGF0b3I6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCd2YWxpZGF0ZScpLCBvcmRlckRlZmF1bHQ6IHN0cmluZyA9IGRhdGFUYWcucmVtb3ZlKCdvcmRlcicpLCBub3RWYWxpZDogc3RyaW5nID0gZGF0YVRhZy5yZW1vdmUoJ25vdFZhbGlkJyksIHJlc3BvbnNlU2FmZSA9IGRhdGFUYWcuaGF2ZSgnc2FmZScpO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdtZXNzYWdlJyk7IC8vIHNob3cgZXJyb3IgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlID09PSBudWxsKVxuICAgICAgICBtZXNzYWdlID0gc2Vzc2lvbkluZm8uZGVidWcgJiYgIUluc2VydENvbXBvbmVudC5Tb21lUGx1Z2lucyhcIlNhZmVEZWJ1Z1wiKTtcblxuICAgIGxldCBvcmRlciA9IFtdO1xuXG4gICAgY29uc3QgdmFsaWRhdG9yQXJyYXkgPSB2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnNwbGl0KCcsJykubWFwKHggPT4geyAvLyBDaGVja2luZyBpZiB0aGVyZSBpcyBhbiBvcmRlciBpbmZvcm1hdGlvbiwgZm9yIGV4YW1wbGUgXCJwcm9wMTogc3RyaW5nLCBwcm9wMzogbnVtLCBwcm9wMjogYm9vbFwiXG4gICAgICAgIGNvbnN0IHNwbGl0ID0gU3BsaXRGaXJzdCgnOicsIHgudHJpbSgpKTtcblxuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIG9yZGVyLnB1c2goc3BsaXQuc2hpZnQoKSk7XG5cbiAgICAgICAgcmV0dXJuIHNwbGl0LnBvcCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKG9yZGVyRGVmYXVsdClcbiAgICAgICAgb3JkZXIgPSBvcmRlckRlZmF1bHQuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICBzZXNzaW9uSW5mby5jb25uZWN0b3JBcnJheS5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNlbmRUbyxcbiAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JBcnJheSxcbiAgICAgICAgb3JkZXI6IG9yZGVyLmxlbmd0aCAmJiBvcmRlcixcbiAgICAgICAgbm90VmFsaWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlc3BvbnNlU2FmZVxuICAgIH0pO1xuXG4gICAgaWYgKCFkYXRhVGFnLmhhdmUoJ21ldGhvZCcpKSB7XG4gICAgICAgIGRhdGFUYWcucHVzaCh7XG4gICAgICAgICAgICBuOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnbWV0aG9kJyksXG4gICAgICAgICAgICB2OiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAncG9zdCcpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBpbGVkU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpLlBsdXMkXG4gICAgICAgIGA8JSFcbkA/Q29ubmVjdEhlcmVGb3JtKCR7c2VuZFRvfSk7XG4lPjxmb3JtJHtJbnNlcnRDb21wb25lbnQuUmVCdWlsZFRhZ0RhdGEoQmV0d2VlblRhZ0RhdGEuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnKX0+XG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY29ubmVjdG9yRm9ybUNhbGxcIiB2YWx1ZT1cIiR7bmFtZX1cIi8+JHthd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pfTwvZm9ybT5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZWRTdHJpbmcsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHNlc3Npb25JbmZvLmNvbm5lY3RvckFycmF5KSB7XG4gICAgICAgIGlmIChpLnR5cGUgIT0gJ2Zvcm0nKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc2VuZFRvVW5pY29kZSA9IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsIGkuc2VuZFRvKS51bmljb2RlLmVxXG4gICAgICAgIGNvbnN0IGNvbm5lY3QgPSBuZXcgUmVnRXhwKGBAQ29ubmVjdEhlcmVGb3JtXFxcXChbIF0qJHtzZW5kVG9Vbmljb2RlfVsgXSpcXFxcKSg7PylgKSwgY29ubmVjdERlZmF1bHQgPSBuZXcgUmVnRXhwKGBAXFxcXD9Db25uZWN0SGVyZUZvcm1cXFxcKFsgXSoke3NlbmRUb1VuaWNvZGV9WyBdKlxcXFwpKDs/KWApO1xuXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgICAgICBjb25zdCBzY3JpcHREYXRhID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoZGF0YVswXS5TdGFydEluZm8pLlBsdXMkXG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgIGlmKFBvc3Q/LmNvbm5lY3RvckZvcm1DYWxsID09IFwiJHtpLm5hbWV9XCIpe1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBoYW5kZWxDb25uZWN0b3IoXCJmb3JtXCIsIHBhZ2UsIFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRUbzoke2kuc2VuZFRvfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RWYWxpZDogJHtpLm5vdFZhbGlkIHx8ICdudWxsJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yOlske2kudmFsaWRhdG9yPy5tYXA/Lihjb21waWxlVmFsdWVzKT8uam9pbignLCcpID8/ICcnfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IFske2kub3JkZXI/Lm1hcD8uKGl0ZW0gPT4gYFwiJHtpdGVtfVwiYCk/LmpvaW4oJywnKSA/PyAnJ31dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6JHt0eXBlb2YgaS5tZXNzYWdlID09ICdzdHJpbmcnID8gYFwiJHtpLm1lc3NhZ2V9XCJgIDogaS5tZXNzYWdlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYWZlOiR7aS5yZXNwb25zZVNhZmV9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfWBcbiAgICAgICAgfTtcblxuICAgICAgICBwYWdlRGF0YSA9IHBhZ2VEYXRhLnJlcGxhY2VyKGNvbm5lY3QsIHNjcmlwdERhdGEpO1xuXG4gICAgICAgIGlmIChjb3VudGVyKVxuICAgICAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlKGNvbm5lY3REZWZhdWx0LCAnJyk7IC8vIGRlbGV0aW5nIGRlZmF1bHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFnZURhdGEgPSBwYWdlRGF0YS5yZXBsYWNlcihjb25uZWN0RGVmYXVsdCwgc2NyaXB0RGF0YSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3IodGhpc1BhZ2U6IGFueSwgY29ubmVjdG9ySW5mbzogYW55KSB7XG5cbiAgICBkZWxldGUgdGhpc1BhZ2UuUG9zdC5jb25uZWN0b3JGb3JtQ2FsbDtcblxuICAgIGxldCB2YWx1ZXMgPSBbXTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLm9yZGVyLmxlbmd0aCkgLy8gcHVzaCB2YWx1ZXMgYnkgc3BlY2lmaWMgb3JkZXJcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNvbm5lY3RvckluZm8ub3JkZXIpXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzUGFnZS5Qb3N0W2ldKTtcbiAgICBlbHNlXG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLk9iamVjdC52YWx1ZXModGhpc1BhZ2UuUG9zdCkpO1xuXG5cbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiB8IHN0cmluZ1tdID0gdHJ1ZTtcblxuICAgIGlmIChjb25uZWN0b3JJbmZvLnZhbGlkYXRvci5sZW5ndGgpIHsgLy8gdmFsaWRhdGUgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHBhcnNlVmFsdWVzKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgICAgICBpc1ZhbGlkID0gYXdhaXQgbWFrZVZhbGlkYXRpb25KU09OKHZhbHVlcywgY29ubmVjdG9ySW5mby52YWxpZGF0b3IpO1xuICAgIH1cblxuICAgIGxldCByZXNwb25zZTogYW55O1xuXG4gICAgaWYgKGlzVmFsaWQgPT09IHRydWUpXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY29ubmVjdG9ySW5mby5zZW5kVG8oLi4udmFsdWVzKTtcbiAgICBlbHNlIGlmIChjb25uZWN0b3JJbmZvLm5vdFZhbGlkKVxuICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RvckluZm8ubm90VmFsaWQoLi4uPGFueT5pc1ZhbGlkKTtcblxuICAgIGlmICghaXNWYWxpZCAmJiAhcmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLm1lc3NhZ2UgPT09IHRydWUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUoY29ubmVjdG9ySW5mby5tZXNzYWdlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzcG9uc2UgPSBjb25uZWN0b3JJbmZvLm1lc3NhZ2U7XG5cbiAgICBpZiAocmVzcG9uc2UpXG4gICAgICAgIGlmIChjb25uZWN0b3JJbmZvLnNhZmUpXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZVNhZmUocmVzcG9uc2UpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzUGFnZS53cml0ZShyZXNwb25zZSk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgZ2V0VHlwZXMsIHNtYWxsUGF0aFRvUGFnZSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBTdG9yZUpTT04gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvU3RvcmVKU09OJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCByZWNvcmRTdG9yZSA9IG5ldyBTdG9yZUpTT04oJ1JlY29yZHMnKTtcblxuZnVuY3Rpb24gcmVjb3JkTGluayhkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpIHtcbiAgICByZXR1cm4gZGF0YVRhZy5yZW1vdmUoJ2xpbmsnKXx8IHNtYWxsUGF0aFRvUGFnZShzZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVJlY29yZFBhdGgoZGVmYXVsdE5hbWU6IHN0cmluZywgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKXtcbiAgICBjb25zdCBsaW5rID0gcmVjb3JkTGluayhkYXRhVGFnLCBzZXNzaW9uSW5mbyksIHNhdmVOYW1lID0gZGF0YVRhZy5yZW1vdmUoJ25hbWUnKSB8fCBkZWZhdWx0TmFtZTtcblxuICAgIHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSA/Pz0ge307XG4gICAgcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdID8/PSAnJztcbiAgICBzZXNzaW9uSW5mby5yZWNvcmQoc2F2ZU5hbWUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RvcmU6IHJlY29yZFN0b3JlLnN0b3JlW3NhdmVOYW1lXSxcbiAgICAgICAgY3VycmVudDogcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZU5hbWVdW2xpbmtdLFxuICAgICAgICBsaW5rXG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHBhdGhOYW1lOiBzdHJpbmcsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG5cbiAgICBCZXR3ZWVuVGFnRGF0YSA9IGF3YWl0IEluc2VydENvbXBvbmVudC5TdGFydFJlcGxhY2UoQmV0d2VlblRhZ0RhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgSlNQYXJzZXIoQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhLmV4dHJhY3RJbmZvKCkpXG4gICAgYXdhaXQgcGFyc2VyLmZpbmRTY3JpcHRzKCk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIHBhcnNlci52YWx1ZXMpIHtcbiAgICAgICAgaWYgKGkudHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gaS50ZXh0LmVxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaHRtbCA9IGh0bWwudHJpbSgpO1xuXG4gICAgY29uc3Qge3N0b3JlLCBsaW5rfSA9IG1ha2VSZWNvcmRQYXRoKCdyZWNvcmRzL3JlY29yZC5zZXJ2JywgZGF0YVRhZywgc2Vzc2lvbkluZm8pO1xuXG4gICAgaWYoIXN0b3JlW2xpbmtdLmluY2x1ZGVzKGh0bWwpKXtcbiAgICAgICAgc3RvcmVbbGlua10gKz0gaHRtbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogQmV0d2VlblRhZ0RhdGFcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVCZWZvcmVSZUJ1aWxkKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICBjb25zdCBuYW1lID0gc21hbGxQYXRoVG9QYWdlKHNtYWxsUGF0aCk7XG4gICAgZm9yKGNvbnN0IHNhdmUgaW4gcmVjb3JkU3RvcmUuc3RvcmUpe1xuICAgICAgICBjb25zdCBpdGVtID0gcmVjb3JkU3RvcmUuc3RvcmVbc2F2ZV07XG5cbiAgICAgICAgaWYoaXRlbVtuYW1lXSl7XG4gICAgICAgICAgICBpdGVtW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIGl0ZW1bbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVSZWNvcmRzKHNlc3Npb246IFNlc3Npb25CdWlsZCkge1xuICAgIGlmICghc2Vzc2lvbi5kZWJ1Zykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzZXNzaW9uLnJlY29yZE5hbWVzKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJDb21waWxlKCl7XG4gICAgcmVjb3JkU3RvcmUuY2xlYXIoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3RDb21waWxlKCl7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHJlY29yZFN0b3JlLnN0b3JlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzBdICsgbmFtZSArICcuanNvbic7XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwobmFtZSwgZ2V0VHlwZXMuU3RhdGljWzBdKTtcbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoZmlsZVBhdGgsIHJlY29yZFN0b3JlLnN0b3JlW25hbWVdKTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgQnVpbGRJbkNvbXBvbmVudCwgU3RyaW5nTWFwIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEpTUGFyc2VyIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyJ1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInO1xuaW1wb3J0IHsgbWFrZVJlY29yZFBhdGh9IGZyb20gJy4vcmVjb3JkJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKCBwYXRoTmFtZTogc3RyaW5nLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuXG4gICAgQmV0d2VlblRhZ0RhdGEgPSBhd2FpdCBJbnNlcnRDb21wb25lbnQuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pO1xuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKEJldHdlZW5UYWdEYXRhLCBCZXR3ZWVuVGFnRGF0YS5leHRyYWN0SW5mbygpKVxuICAgIGF3YWl0IHBhcnNlci5maW5kU2NyaXB0cygpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgIGlmIChpLnR5cGUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBodG1sICs9IGkudGV4dC5lcTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHtzdG9yZSwgbGluaywgY3VycmVudH0gPSBtYWtlUmVjb3JkUGF0aCgncmVjb3Jkcy9zZWFyY2guc2VydicsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICBjb25zdCBzZWFyY2hPYmplY3QgPSBidWlsZE9iamVjdChodG1sLCBkYXRhVGFnLnJlbW92ZSgnbWF0Y2gnKSB8fCAnaDFbaWRdLCBoMltpZF0sIGgzW2lkXSwgaDRbaWRdLCBoNVtpZF0sIGg2W2lkXScpO1xuXG4gICAgaWYoIWN1cnJlbnQpe1xuICAgICAgICBzdG9yZVtsaW5rXSA9IHNlYXJjaE9iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuYXNzaWduKGN1cnJlbnQudGl0bGVzLHNlYXJjaE9iamVjdC50aXRsZXMpO1xuXG4gICAgICAgIGlmKCFjdXJyZW50LnRleHQuaW5jbHVkZXMoc2VhcmNoT2JqZWN0LnRleHQpKXtcbiAgICAgICAgICAgIGN1cnJlbnQudGV4dCArPSBzZWFyY2hPYmplY3QudGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBCZXR3ZWVuVGFnRGF0YVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRPYmplY3QoaHRtbDogc3RyaW5nLCBtYXRjaDogc3RyaW5nKSB7XG4gICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwsIHtcbiAgICAgICAgYmxvY2tUZXh0RWxlbWVudHM6IHtcbiAgICAgICAgICAgIHNjcmlwdDogZmFsc2UsXG4gICAgICAgICAgICBzdHlsZTogZmFsc2UsXG4gICAgICAgICAgICBub3NjcmlwdDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdGl0bGVzOiBTdHJpbmdNYXAgPSB7fTtcblxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGwobWF0Y2gpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5hdHRyaWJ1dGVzWydpZCddO1xuICAgICAgICB0aXRsZXNbaWRdID0gZWxlbWVudC5pbm5lclRleHQudHJpbSgpO1xuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlcyxcbiAgICAgICAgdGV4dDogcm9vdC5pbm5lclRleHQudHJpbSgpLnJlcGxhY2UoL1sgXFxuXXsyLH0vZywgJyAnKS5yZXBsYWNlKC9bXFxuXS9nLCAnICcpXG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyB0YWdEYXRhT2JqZWN0QXJyYXksIEJ1aWxkSW5Db21wb25lbnQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vQ29tcG9uZW50cy9jbGllbnQnO1xuaW1wb3J0IHNjcmlwdCBmcm9tICcuL0NvbXBvbmVudHMvc2NyaXB0L2luZGV4JztcbmltcG9ydCBzdHlsZSBmcm9tICcuL0NvbXBvbmVudHMvc3R5bGUvaW5kZXgnO1xuaW1wb3J0IHBhZ2UgZnJvbSAnLi9Db21wb25lbnRzL3BhZ2UnO1xuaW1wb3J0IGlzb2xhdGUgZnJvbSAnLi9Db21wb25lbnRzL2lzb2xhdGUnO1xuaW1wb3J0IHN2ZWx0ZSBmcm9tICcuL0NvbXBvbmVudHMvc3ZlbHRlJztcbmltcG9ydCBtYXJrZG93biBmcm9tICcuL0NvbXBvbmVudHMvbWFya2Rvd24nO1xuaW1wb3J0IGhlYWQsIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkSGVhZCB9IGZyb20gJy4vQ29tcG9uZW50cy9oZWFkJztcbmltcG9ydCBjb25uZWN0LCB7IGFkZEZpbmFsaXplQnVpbGQgYXMgYWRkRmluYWxpemVCdWlsZENvbm5lY3QsIGhhbmRlbENvbm5lY3RvciBhcyBoYW5kZWxDb25uZWN0b3JDb25uZWN0IH0gZnJvbSAnLi9Db21wb25lbnRzL2Nvbm5lY3QnO1xuaW1wb3J0IGZvcm0sIHsgYWRkRmluYWxpemVCdWlsZCBhcyBhZGRGaW5hbGl6ZUJ1aWxkRm9ybSwgaGFuZGVsQ29ubmVjdG9yIGFzIGhhbmRlbENvbm5lY3RvckZvcm0gfSBmcm9tICcuL0NvbXBvbmVudHMvZm9ybSc7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCByZWNvcmQsIHsgdXBkYXRlUmVjb3JkcywgcGVyQ29tcGlsZSBhcyBwZXJDb21waWxlUmVjb3JkLCBwb3N0Q29tcGlsZSBhcyBwb3N0Q29tcGlsZVJlY29yZCwgZGVsZXRlQmVmb3JlUmVCdWlsZCB9IGZyb20gJy4vQ29tcG9uZW50cy9yZWNvcmQnO1xuaW1wb3J0IHNlYXJjaCBmcm9tICcuL0NvbXBvbmVudHMvc2VhcmNoJztcblxuZXhwb3J0IGNvbnN0IEFsbEJ1aWxkSW4gPSBbXCJjbGllbnRcIiwgXCJzY3JpcHRcIiwgXCJzdHlsZVwiLCBcInBhZ2VcIiwgXCJjb25uZWN0XCIsIFwiaXNvbGF0ZVwiLCBcImZvcm1cIiwgXCJoZWFkXCIsIFwic3ZlbHRlXCIsIFwibWFya2Rvd25cIiwgXCJyZWNvcmRcIiwgXCJzZWFyY2hcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGFydENvbXBpbGluZyhwYXRoTmFtZTogc3RyaW5nLCB0eXBlOiBTdHJpbmdUcmFja2VyLCBkYXRhVGFnOiB0YWdEYXRhT2JqZWN0QXJyYXksIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGxldCByZURhdGE6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD47XG5cbiAgICBzd2l0Y2ggKHR5cGUuZXEudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlIFwiY2xpZW50XCI6XG4gICAgICAgICAgICByZURhdGEgPSBjbGllbnQocGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmVjb3JkXCI6XG4gICAgICAgICAgICByZURhdGEgPSByZWNvcmQoIHBhdGhOYW1lLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNlYXJjaFwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc2VhcmNoKCBwYXRoTmFtZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHNjcmlwdCggcGF0aE5hbWUsIHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IHN0eWxlKCBwYXRoTmFtZSwgdHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwYWdlXCI6XG4gICAgICAgICAgICByZURhdGEgPSBwYWdlKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGNvbm5lY3QodHlwZSwgZGF0YVRhZywgQmV0d2VlblRhZ0RhdGEsIEluc2VydENvbXBvbmVudCwgc2Vzc2lvbkluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtXCI6XG4gICAgICAgICAgICByZURhdGEgPSBmb3JtKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImlzb2xhdGVcIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IGlzb2xhdGUoQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJoZWFkXCI6XG4gICAgICAgICAgICByZURhdGEgPSBoZWFkKHBhdGhOYW1lLCB0eXBlLCBkYXRhVGFnLCBCZXR3ZWVuVGFnRGF0YSwgSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN2ZWx0ZVwiOlxuICAgICAgICAgICAgcmVEYXRhID0gc3ZlbHRlKHR5cGUsIGRhdGFUYWcsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWFya2Rvd25cIjpcbiAgICAgICAgICAgIHJlRGF0YSA9IG1hcmtkb3duKHR5cGUsIGRhdGFUYWcsIEJldHdlZW5UYWdEYXRhLCBJbnNlcnRDb21wb25lbnQsIHNlc3Npb25JbmZvKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBvbmVudCBpcyBub3QgYnVpbGQgeWV0XCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0luY2x1ZGUodGFnbmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEFsbEJ1aWxkSW4uaW5jbHVkZXModGFnbmFtZS50b0xvd2VyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmFsaXplQnVpbGQocGFnZURhdGE6IFN0cmluZ1RyYWNrZXIsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdXBkYXRlUmVjb3JkcyhzZXNzaW9uSW5mbyk7XG5cbiAgICBwYWdlRGF0YSA9IGFkZEZpbmFsaXplQnVpbGRDb25uZWN0KHBhZ2VEYXRhLCBzZXNzaW9uSW5mbyk7XG4gICAgcGFnZURhdGEgPSBhZGRGaW5hbGl6ZUJ1aWxkRm9ybShwYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIHBhZ2VEYXRhID0gcGFnZURhdGEucmVwbGFjZSgvQENvbm5lY3RIZXJlKDs/KS9naSwgJycpLnJlcGxhY2UoL0BDb25uZWN0SGVyZUZvcm0oOz8pL2dpLCAnJyk7XG5cbiAgICBwYWdlRGF0YSA9IGF3YWl0IGFkZEZpbmFsaXplQnVpbGRIZWFkKHBhZ2VEYXRhLCBzZXNzaW9uSW5mbywgZnVsbENvbXBpbGVQYXRoKTtcbiAgICByZXR1cm4gcGFnZURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kZWxDb25uZWN0b3JTZXJ2aWNlKHR5cGU6IHN0cmluZywgdGhpc1BhZ2U6IGFueSwgY29ubmVjdG9yQXJyYXk6IGFueVtdKSB7XG4gICAgaWYgKHR5cGUgPT0gJ2Nvbm5lY3QnKVxuICAgICAgICByZXR1cm4gaGFuZGVsQ29ubmVjdG9yQ29ubmVjdCh0aGlzUGFnZSwgY29ubmVjdG9yQXJyYXkpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGhhbmRlbENvbm5lY3RvckZvcm0odGhpc1BhZ2UsIGNvbm5lY3RvckFycmF5KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBlckNvbXBpbGUoKSB7XG4gICAgcGVyQ29tcGlsZVJlY29yZCgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3N0Q29tcGlsZSgpIHtcbiAgICBwb3N0Q29tcGlsZVJlY29yZCgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwZXJDb21waWxlUGFnZShzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZyl7XG4gICAgc2Vzc2lvbkluZm8uZGVidWcgJiYgZGVsZXRlQmVmb3JlUmVCdWlsZChzZXNzaW9uSW5mby5zbWFsbFBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9zdENvbXBpbGVQYWdlKHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIGZ1bGxDb21waWxlUGF0aDogc3RyaW5nKXtcbiAgICBcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7IFBhcnNlRGVidWdJbmZvLCBDcmVhdGVGaWxlUGF0aCwgUGF0aFR5cGVzLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgeyBBbGxCdWlsZEluLCBJc0luY2x1ZGUsIFN0YXJ0Q29tcGlsaW5nIH0gZnJvbSAnLi4vQnVpbGRJbkNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIsIHsgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBBcnJheU1hdGNoIH0gZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IEFkZFBsdWdpbiBmcm9tICcuLi9QbHVnaW5zL0luZGV4JztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCB0YWdEYXRhT2JqZWN0QXNUZXh0LCBDb21waWxlSW5GaWxlRnVuYywgU3RyaW5nQXJyYXlPck9iamVjdCwgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyBQcmludElmTmV3IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHsgSW5zZXJ0Q29tcG9uZW50QmFzZSwgQmFzZVJlYWRlciB9IGZyb20gJy4vQmFzZVJlYWRlci9SZWFkZXInO1xuaW1wb3J0IHBhdGhOb2RlIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFBhcnNlQmFzZVBhZ2UgZnJvbSAnLi9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4vU2Vzc2lvbic7XG5cbmludGVyZmFjZSBEZWZhdWx0VmFsdWVzIHtcbiAgICB2YWx1ZTogU3RyaW5nVHJhY2tlcixcbiAgICBlbGVtZW50czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zZXJ0Q29tcG9uZW50IGV4dGVuZHMgSW5zZXJ0Q29tcG9uZW50QmFzZSB7XG4gICAgcHVibGljIGRpckZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBQbHVnaW5CdWlsZDogQWRkUGx1Z2luO1xuICAgIHB1YmxpYyBDb21waWxlSW5GaWxlOiBDb21waWxlSW5GaWxlRnVuYztcbiAgICBwdWJsaWMgTWljcm9QbHVnaW5zOiBTdHJpbmdBcnJheU9yT2JqZWN0O1xuICAgIHB1YmxpYyBHZXRQbHVnaW46IChuYW1lOiBzdHJpbmcpID0+IGFueTtcbiAgICBwdWJsaWMgU29tZVBsdWdpbnM6ICguLi5uYW1lczogc3RyaW5nW10pID0+IGJvb2xlYW47XG4gICAgcHVibGljIGlzVHM6ICgpID0+IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIHJlZ2V4U2VhcmNoOiBSZWdFeHA7XG5cbiAgICBjb25zdHJ1Y3RvcihQbHVnaW5CdWlsZDogQWRkUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKFByaW50SWZOZXcpO1xuICAgICAgICB0aGlzLmRpckZvbGRlciA9ICdDb21wb25lbnRzJztcbiAgICAgICAgdGhpcy5QbHVnaW5CdWlsZCA9IFBsdWdpbkJ1aWxkO1xuICAgICAgICB0aGlzLnJlZ2V4U2VhcmNoID0gbmV3IFJlZ0V4cChgPChbXFxcXHB7THV9X1xcXFwtOjAtOV18JHtBbGxCdWlsZEluLmpvaW4oJ3wnKX0pYCwgJ3UnKVxuICAgIH1cblxuICAgIEZpbmRTcGVjaWFsVGFnQnlTdGFydChzdHJpbmc6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5Ta2lwU3BlY2lhbFRhZykge1xuICAgICAgICAgICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgaVswXS5sZW5ndGgpID09IGlbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0IHRha2VzIGEgc3RyaW5nIG9mIEhUTUwgYW5kIHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB0aGF0IGNvbnRhaW4gdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSxcbiAgICAgKiB0aGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSwgYW5kIHRoZSBjaGFyYWN0ZXIgdGhhdCBjb21lcyBhZnRlciB0aGUgYXR0cmlidXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSB0ZXh0IC0gVGhlIHRleHQgdG8gcGFyc2UuXG4gICAgICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcbiAgICAgKi9cbiAgICB0YWdEYXRhKHRleHQ6IFN0cmluZ1RyYWNrZXIpOiB7IGRhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgbWFwQXR0cmlidXRlczogU3RyaW5nQW55TWFwIH0ge1xuICAgICAgICBjb25zdCB0b2tlbkFycmF5ID0gW10sIGE6IHRhZ0RhdGFPYmplY3RBcnJheSA9IFtdLCBtYXBBdHRyaWJ1dGVzOiBTdHJpbmdBbnlNYXAgPSB7fTtcblxuICAgICAgICB0ZXh0ID0gdGV4dC50cmltKCkucmVwbGFjZXIoLyg8JSkoW1xcd1xcV10rPykoJT4pLywgZGF0YSA9PiB7XG4gICAgICAgICAgICB0b2tlbkFycmF5LnB1c2goZGF0YVsyXSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVsxXS5QbHVzKGRhdGFbM10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB1blRva2VuID0gKHRleHQ6IFN0cmluZ1RyYWNrZXIpID0+IHRleHQucmVwbGFjZXIoLyg8JSkoJT4pLywgKGRhdGEpID0+IGRhdGFbMV0uUGx1cyh0b2tlbkFycmF5LnNoaWZ0KCkpLlBsdXMoZGF0YVsyXSkpXG5cbiAgICAgICAgbGV0IGZhc3RUZXh0ID0gdGV4dC5lcTtcbiAgICAgICAgY29uc3QgU2tpcFR5cGVzID0gWydcIicsIFwiJ1wiLCAnYCddLCBCbG9ja1R5cGVzID0gW1xuICAgICAgICAgICAgWyd7JywgJ30nXSxcbiAgICAgICAgICAgIFsnKCcsICcpJ11cbiAgICAgICAgXTtcblxuICAgICAgICB3aGlsZSAoZmFzdFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGZhc3RUZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhciA9IGZhc3RUZXh0LmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhciA9PSAnPScpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRDaGFyID0gdGV4dC5hdChpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRDaGFyRXEgPSBuZXh0Q2hhci5lcSwgYXR0ck5hbWUgPSB0ZXh0LnN1YnN0cmluZygwLCBpKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWU6IFN0cmluZ1RyYWNrZXIsIGVuZEluZGV4OiBudW1iZXIsIGJsb2NrRW5kOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTa2lwVHlwZXMuaW5jbHVkZXMobmV4dENoYXJFcSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gQmFzZVJlYWRlci5maW5kRW50T2ZRKGZhc3RUZXh0LnN1YnN0cmluZyhpICsgMiksIG5leHRDaGFyRXEpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGV4dC5zdWJzdHIoaSArIDIsIGVuZEluZGV4IC0gMik7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoYmxvY2tFbmQgPSBCbG9ja1R5cGVzLmZpbmQoeCA9PiB4WzBdID09IG5leHRDaGFyRXEpPy5bMV0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gQmFzZVJlYWRlci5maW5kRW5kT2ZEZWYoZmFzdFRleHQuc3Vic3RyaW5nKGkgKyAyKSwgW25leHRDaGFyRXEsIGJsb2NrRW5kXSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0ZXh0LnN1YnN0cihpICsgMSwgZW5kSW5kZXggKyAxKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBmYXN0VGV4dC5zdWJzdHJpbmcoaSArIDEpLnNlYXJjaCgvIHxcXG4vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRJbmRleCA9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGZhc3RUZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGV4dC5zdWJzdHIoaSArIDEsIGVuZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRDaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSB1blRva2VuKGF0dHJOYW1lKSwgdiA9IHVuVG9rZW4odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBtYXBBdHRyaWJ1dGVzW24uZXFdID0gdi5lcTtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4sXG4gICAgICAgICAgICAgICAgICAgICAgICB2LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcjogbmV4dENoYXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMSArIGVuZEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnICcgfHwgaSA9PSBmYXN0VGV4dC5sZW5ndGggLSAxICYmICsraSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gdW5Ub2tlbih0ZXh0LnN1YnN0cmluZygwLCBpKSk7XG4gICAgICAgICAgICAgICAgICAgIGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuOiBuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBtYXBBdHRyaWJ1dGVzW24uZXFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZhc3RUZXh0ID0gZmFzdFRleHQuc3Vic3RyaW5nKGkpLnRyaW0oKTtcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZyhpKS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL21ldGhvZHMgdG8gdGhlIGFycmF5XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKG5hbWU6IHN0cmluZykgPT4gYS5maW5kSW5kZXgoeCA9PiB4Lm4uZXEgPT0gbmFtZSk7XG4gICAgICAgIGNvbnN0IGdldFZhbHVlID0gKG5hbWU6IHN0cmluZykgPT4gYS5maW5kKHRhZyA9PiB0YWcubi5lcSA9PSBuYW1lKT8udj8uZXEgPz8gJyc7XG4gICAgICAgIGNvbnN0IHJlbW92ZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVJbmRleCA9IGluZGV4KG5hbWUpO1xuICAgICAgICAgICAgaWYgKG5hbWVJbmRleCA9PSAtMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICByZXR1cm4gYS5zcGxpY2UobmFtZUluZGV4LCAxKS5wb3AoKS52Py5lcSA/PyAnJztcbiAgICAgICAgfTtcblxuICAgICAgICBhLmhhdmUgPSAobmFtZTogc3RyaW5nKSA9PiBpbmRleChuYW1lKSAhPSAtMTtcbiAgICAgICAgYS5nZXRWYWx1ZSA9IGdldFZhbHVlO1xuICAgICAgICBhLnJlbW92ZSA9IHJlbW92ZTtcbiAgICAgICAgYS5hZGRDbGFzcyA9IGMgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IGluZGV4KCdjbGFzcycpO1xuICAgICAgICAgICAgaWYgKGkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goeyBuOiBuZXcgU3RyaW5nVHJhY2tlcihudWxsLCAnY2xhc3MnKSwgdjogbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgYyksIGNoYXI6IG5ldyBTdHJpbmdUcmFja2VyKG51bGwsICdcIicpIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0udi5sZW5ndGgpXG4gICAgICAgICAgICAgICAgYyA9ICcgJyArIGM7XG4gICAgICAgICAgICBpdGVtLnYuQWRkVGV4dEFmdGVyKGMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRhdGE6IGEsIG1hcEF0dHJpYnV0ZXMgfTtcbiAgICB9XG5cbiAgICBmaW5kSW5kZXhTZWFyY2hUYWcocXVlcnk6IHN0cmluZywgdGFnOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHF1ZXJ5LnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMFxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRhZy5pbmRleE9mKGkpXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYFdhcmluZywgY2FuJ3QgZmluZCBhbGwgcXVlcnkgaW4gdGFnIC0+ICR7dGFnLmVxfVxcbiR7dGFnLmxpbmVJbmZvfWAsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJxdWVyeS1ub3QtZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyICs9IGluZGV4ICsgaS5sZW5ndGhcbiAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoaW5kZXggKyBpLmxlbmd0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudGVyICsgdGFnLnNlYXJjaCgvXFwgfFxcPi8pXG4gICAgfVxuXG4gICAgUmVCdWlsZFRhZ0RhdGEoc3RyaW5nSW5mbzogU3RyaW5nVHJhY2tlckRhdGFJbmZvLCBkYXRhVGFnU3BsaXR0ZXI6IHRhZ0RhdGFPYmplY3RBcnJheSkge1xuICAgICAgICBsZXQgbmV3QXR0cmlidXRlcyA9IG5ldyBTdHJpbmdUcmFja2VyKHN0cmluZ0luZm8pO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhVGFnU3BsaXR0ZXIpIHtcbiAgICAgICAgICAgIGlmIChpLnYpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzLlBsdXMkYCR7aS5ufT0ke2kuY2hhcn0ke2kudn0ke2kuY2hhcn0gYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlcy5QbHVzKGkubiwgJyAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhVGFnU3BsaXR0ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdBdHRyaWJ1dGVzID0gbmV3IFN0cmluZ1RyYWNrZXIoc3RyaW5nSW5mbywgJyAnKS5QbHVzKG5ld0F0dHJpYnV0ZXMuc3Vic3RyaW5nKDAsIG5ld0F0dHJpYnV0ZXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0F0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgQ2hlY2tNaW5IVE1MKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5TcGFjZU9uZSgnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cblxuICAgIGFzeW5jIFJlQnVpbGRUYWcodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgZGF0YVRhZ1NwbGljZWQ6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIFNlbmREYXRhRnVuYzogKHRleHQ6IFN0cmluZ1RyYWNrZXIpID0+IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pIHtcbiAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhICYmIHRoaXMuU29tZVBsdWdpbnMoXCJNaW5IVE1MXCIsIFwiTWluQWxsXCIpKSB7XG4gICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YSA9IEJldHdlZW5UYWdEYXRhLlNwYWNlT25lKCcgJyk7XG5cbiAgICAgICAgICAgIGRhdGFUYWcgPSB0aGlzLlJlQnVpbGRUYWdEYXRhKHR5cGUuRGVmYXVsdEluZm9UZXh0LCBkYXRhVGFnU3BsaWNlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVRhZy5lcS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFUYWcgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCwgJyAnKS5QbHVzKGRhdGFUYWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFnRGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KS5QbHVzKFxuICAgICAgICAgICAgJzwnLCB0eXBlLCBkYXRhVGFnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoQmV0d2VlblRhZ0RhdGEpIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cyRgPiR7YXdhaXQgU2VuZERhdGFGdW5jKEJldHdlZW5UYWdEYXRhKX08LyR7dHlwZX0+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ0RhdGEuUGx1cygnLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWdEYXRhO1xuICAgIH1cblxuICAgIGV4cG9ydERlZmF1bHRWYWx1ZXMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIGZvdW5kU2V0dGVyczogRGVmYXVsdFZhbHVlc1tdID0gW10pIHtcbiAgICAgICAgY29uc3QgaW5kZXhCYXNpYzogQXJyYXlNYXRjaCA9IGZpbGVEYXRhLm1hdGNoKC9AZGVmYXVsdFsgXSpcXCgoW0EtWmEtejAtOXt9KClcXFtcXF1fXFwtJFwiJ2AlKiZ8XFwvXFxAIFxcbl0qKVxcKVsgXSpcXFsoW0EtWmEtejAtOV9cXC0sJCBcXG5dKylcXF0vKTtcblxuICAgICAgICBpZiAoaW5kZXhCYXNpYyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZURhdGEsIGZvdW5kU2V0dGVycyB9O1xuXG4gICAgICAgIGNvbnN0IFdpdGhvdXRCYXNpYyA9IGZpbGVEYXRhLnN1YnN0cmluZygwLCBpbmRleEJhc2ljLmluZGV4KS5QbHVzKGZpbGVEYXRhLnN1YnN0cmluZyhpbmRleEJhc2ljLmluZGV4ICsgaW5kZXhCYXNpY1swXS5sZW5ndGgpKTtcblxuICAgICAgICBjb25zdCBhcnJheVZhbHVlcyA9IGluZGV4QmFzaWNbMl0uZXEuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG5cbiAgICAgICAgZm91bmRTZXR0ZXJzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGluZGV4QmFzaWNbMV0sXG4gICAgICAgICAgICBlbGVtZW50czogYXJyYXlWYWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RGVmYXVsdFZhbHVlcyhXaXRob3V0QmFzaWMsIGZvdW5kU2V0dGVycyk7XG4gICAgfVxuXG4gICAgYWRkRGVmYXVsdFZhbHVlcyhhcnJheVZhbHVlczogRGVmYXVsdFZhbHVlc1tdLCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXlWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmUgb2YgaS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZUFsbCgnIycgKyBiZSwgaS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZURhdGE7XG4gICAgfVxuXG4gICAgcGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIGNvbXBvbmVudDogU3RyaW5nVHJhY2tlcikge1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBsZXQgeyBmaWxlRGF0YSwgZm91bmRTZXR0ZXJzIH0gPSB0aGlzLmV4cG9ydERlZmF1bHRWYWx1ZXMoY29tcG9uZW50KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGFnRGF0YSkge1xuICAgICAgICAgICAgaWYgKGkubi5lcSA9PSAnJicpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmUgPSBpLm4uc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IEZvdW5kSW5kZXg6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIGlmIChyZS5pbmNsdWRlcygnJicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcmUuaW5kZXhPZignJicpO1xuICAgICAgICAgICAgICAgICAgICBGb3VuZEluZGV4ID0gdGhpcy5maW5kSW5kZXhTZWFyY2hUYWcocmUuc3Vic3RyaW5nKDAsIGluZGV4KS5lcSwgZmlsZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZSA9IHJlLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEZvdW5kSW5kZXggPSBmaWxlRGF0YS5zZWFyY2goL1xcIHxcXD4vKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVEYXRhTmV4dCA9IG5ldyBTdHJpbmdUcmFja2VyKGZpbGVEYXRhLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydERhdGEgPSBmaWxlRGF0YS5zdWJzdHJpbmcoMCwgRm91bmRJbmRleCk7XG4gICAgICAgICAgICAgICAgZmlsZURhdGFOZXh0LlBsdXMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0cmluZ1RyYWNrZXIoZmlsZURhdGEuRGVmYXVsdEluZm9UZXh0KS5QbHVzJGAgJHtyZX09XCIke2kudiA/PyAnJ31cImAsXG4gICAgICAgICAgICAgICAgICAgIChzdGFydERhdGEuZW5kc1dpdGgoJyAnKSA/ICcnIDogJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZURhdGEuc3Vic3RyaW5nKEZvdW5kSW5kZXgpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGFOZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoXCJcXFxcflwiICsgaS5uLmVxLCBcImdpXCIpO1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gZmlsZURhdGEucmVwbGFjZShyZSwgaS52ID8/IGkubik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5hZGREZWZhdWx0VmFsdWVzKGZvdW5kU2V0dGVycywgZmlsZURhdGEpO1xuICAgIH1cblxuICAgIGFzeW5jIGJ1aWxkVGFnQmFzaWMoZmlsZURhdGE6IFN0cmluZ1RyYWNrZXIsIHRhZ0RhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgcGF0aDogc3RyaW5nLCBTbWFsbFBhdGg6IHN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCwgQmV0d2VlblRhZ0RhdGE/OiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5QbHVnaW5CdWlsZC5CdWlsZENvbXBvbmVudChmaWxlRGF0YSwgcGF0aCwgcGF0aE5hbWUsIHNlc3Npb25JbmZvKTtcblxuICAgICAgICBmaWxlRGF0YSA9IHRoaXMucGFyc2VDb21wb25lbnRQcm9wcyh0YWdEYXRhLCBmaWxlRGF0YSk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBmaWxlRGF0YS5yZXBsYWNlKC88XFw6cmVhZGVyKCApKlxcLz4vZ2ksIEJldHdlZW5UYWdEYXRhID8/ICcnKTtcblxuICAgICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lICsgJyAtPiAnICsgU21hbGxQYXRoO1xuXG4gICAgICAgIGZpbGVEYXRhID0gYXdhaXQgdGhpcy5TdGFydFJlcGxhY2UoZmlsZURhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgZmlsZURhdGEgPSBhd2FpdCBQYXJzZURlYnVnSW5mbyhmaWxlRGF0YSwgYCR7cGF0aE5hbWV9IC0+XFxuJHtTbWFsbFBhdGh9YCk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVEYXRhO1xuICAgIH1cblxuICAgIGFzeW5jIGluc2VydFRhZ0RhdGEocGF0aE5hbWU6IHN0cmluZywgdHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogU3RyaW5nVHJhY2tlciwgeyBCZXR3ZWVuVGFnRGF0YSwgc2Vzc2lvbkluZm8gfTogeyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBCZXR3ZWVuVGFnRGF0YT86IFN0cmluZ1RyYWNrZXJ9KSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YSwgbWFwQXR0cmlidXRlcyB9ID0gdGhpcy50YWdEYXRhKGRhdGFUYWcpLCBCdWlsZEluID0gSXNJbmNsdWRlKHR5cGUuZXEpO1xuXG4gICAgICAgIGxldCBmaWxlRGF0YTogU3RyaW5nVHJhY2tlciwgU2VhcmNoSW5Db21tZW50ID0gdHJ1ZSwgQWxsUGF0aFR5cGVzOiBQYXRoVHlwZXMgPSB7fSwgYWRkU3RyaW5nSW5mbzogc3RyaW5nO1xuXG4gICAgICAgIGlmIChCdWlsZEluKSB7Ly9jaGVjayBpZiBpdCBidWlsZCBpbiBjb21wb25lbnRcbiAgICAgICAgICAgIGNvbnN0IHsgY29tcGlsZWRTdHJpbmcsIGNoZWNrQ29tcG9uZW50cyB9ID0gYXdhaXQgU3RhcnRDb21waWxpbmcoIHBhdGhOYW1lLCB0eXBlLCBkYXRhLCBCZXR3ZWVuVGFnRGF0YSA/PyBuZXcgU3RyaW5nVHJhY2tlcigpLCB0aGlzLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICBmaWxlRGF0YSA9IGNvbXBpbGVkU3RyaW5nO1xuICAgICAgICAgICAgU2VhcmNoSW5Db21tZW50ID0gY2hlY2tDb21wb25lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvbGRlcjogYm9vbGVhbiB8IHN0cmluZyA9IGRhdGEuaGF2ZSgnZm9sZGVyJyk7XG5cbiAgICAgICAgICAgIGlmIChmb2xkZXIpXG4gICAgICAgICAgICAgICAgZm9sZGVyID0gZGF0YS5yZW1vdmUoJ2ZvbGRlcicpIHx8ICcuJztcblxuICAgICAgICAgICAgY29uc3QgdGFnUGF0aCA9IChmb2xkZXIgPyBmb2xkZXIgKyAnLycgOiAnJykgKyB0eXBlLnJlcGxhY2UoLzovZ2ksIFwiL1wiKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVzRmlsZVBhdGhTbWFsbCA9IHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpLCByZWxhdGl2ZXNGaWxlUGF0aCA9IHBhdGhOb2RlLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwpO1xuICAgICAgICAgICAgQWxsUGF0aFR5cGVzID0gQ3JlYXRlRmlsZVBhdGgocmVsYXRpdmVzRmlsZVBhdGgsIHJlbGF0aXZlc0ZpbGVQYXRoU21hbGwsIHRhZ1BhdGgsIHRoaXMuZGlyRm9sZGVyLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnQpO1xuXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPT09IG51bGwgfHwgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0gPT09IHVuZGVmaW5lZCAmJiAhYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoQWxsUGF0aFR5cGVzLkZ1bGxQYXRoKSkge1xuICAgICAgICAgICAgICAgIHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChmb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgQ29tcG9uZW50ICR7dHlwZS5lcX0gbm90IGZvdW5kISAtPiAke3BhdGhOYW1lfVxcbi0+ICR7dHlwZS5saW5lSW5mb31cXG4ke0FsbFBhdGhUeXBlcy5TbWFsbFBhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTmFtZTogXCJjb21wb25lbnQtbm90LWZvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlJlQnVpbGRUYWcodHlwZSwgZGF0YVRhZywgZGF0YSwgQmV0d2VlblRhZ0RhdGEsIEJldHdlZW5UYWdEYXRhID0+IHRoaXMuU3RhcnRSZXBsYWNlKEJldHdlZW5UYWdEYXRhLCBwYXRoTmFtZSwgc2Vzc2lvbkluZm8pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXT8ubXRpbWVNcylcbiAgICAgICAgICAgICAgICBzZXNzaW9uSW5mby5jYWNoZUNvbXBvbmVudFtBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IHsgbXRpbWVNczogYXdhaXQgRWFzeUZzLnN0YXQoQWxsUGF0aFR5cGVzLkZ1bGxQYXRoLCAnbXRpbWVNcycpIH07IC8vIGFkZCB0byBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICAgICAgICAgIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llc1tBbGxQYXRoVHlwZXMuU21hbGxQYXRoXSA9IHNlc3Npb25JbmZvLmNhY2hlQ29tcG9uZW50W0FsbFBhdGhUeXBlcy5TbWFsbFBhdGhdLm10aW1lTXNcblxuICAgICAgICAgICAgY29uc3QgeyBhbGxEYXRhLCBzdHJpbmdJbmZvIH0gPSBhd2FpdCBBZGREZWJ1Z0luZm8ocGF0aE5hbWUsIEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgc2Vzc2lvbkluZm8uY2FjaGVDb21wb25lbnRbQWxsUGF0aFR5cGVzLlNtYWxsUGF0aF0pO1xuICAgICAgICAgICAgY29uc3QgYmFzZURhdGEgPSBuZXcgUGFyc2VCYXNlUGFnZShhbGxEYXRhLCB0aGlzLmlzVHMoKSk7XG4gICAgICAgICAgICBhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3Moc2Vzc2lvbkluZm8sIEFsbFBhdGhUeXBlcy5GdWxsUGF0aCwgQWxsUGF0aFR5cGVzLlNtYWxsUGF0aCwgcGF0aE5hbWUgKyAnIC0+ICcgKyBBbGxQYXRoVHlwZXMuU21hbGxQYXRoLCBtYXBBdHRyaWJ1dGVzKTtcblxuICAgICAgICAgICAgZmlsZURhdGEgPSBiYXNlRGF0YS5zY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICAgICAgICAgIGFkZFN0cmluZ0luZm8gPSBzZXNzaW9uSW5mby5kZWJ1ZyAmJiBzdHJpbmdJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFNlYXJjaEluQ29tbWVudCAmJiAoZmlsZURhdGEubGVuZ3RoID4gMCB8fCBCZXR3ZWVuVGFnRGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgU21hbGxQYXRoLCBGdWxsUGF0aCB9ID0gQWxsUGF0aFR5cGVzO1xuXG4gICAgICAgICAgICBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuYnVpbGRUYWdCYXNpYyhmaWxlRGF0YSwgZGF0YSwgQnVpbGRJbiA/IHR5cGUuZXEgOiBGdWxsUGF0aCwgQnVpbGRJbiA/IHR5cGUuZXEgOiBTbWFsbFBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbywgQmV0d2VlblRhZ0RhdGEpO1xuICAgICAgICAgICAgYWRkU3RyaW5nSW5mbyAmJiBmaWxlRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhhZGRTdHJpbmdJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlRGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIENoZWNrRG91YmxlU3BhY2UoLi4uZGF0YTogU3RyaW5nVHJhY2tlcltdKSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSB0aGlzLlNvbWVQbHVnaW5zKFwiTWluSFRNTFwiLCBcIk1pbkFsbFwiKTtcbiAgICAgICAgbGV0IHN0YXJ0RGF0YSA9IGRhdGEuc2hpZnQoKTtcblxuICAgICAgICBpZiAobWluaSkge1xuICAgICAgICAgICAgc3RhcnREYXRhID0gc3RhcnREYXRhLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChtaW5pICYmIHN0YXJ0RGF0YS5lbmRzV2l0aCgnICcpICYmIGkuc3RhcnRzV2l0aCgnICcpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RhcnREYXRhID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgMSA9PSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnREYXRhLlBsdXMoaSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWluaSkge1xuICAgICAgICAgICAgc3RhcnREYXRhID0gc3RhcnREYXRhLlNwYWNlT25lKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhcnREYXRhO1xuICAgIH1cblxuICAgIGFzeW5jIFN0YXJ0UmVwbGFjZShkYXRhOiBTdHJpbmdUcmFja2VyLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIGxldCBmaW5kOiBudW1iZXI7XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZUJ1aWxkOiAoU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pW10gPSBbXTtcblxuICAgICAgICB3aGlsZSAoKGZpbmQgPSBkYXRhLnNlYXJjaCh0aGlzLnJlZ2V4U2VhcmNoKSkgIT0gLTEpIHtcblxuICAgICAgICAgICAgLy9oZWNrIGlmIHRoZXJlIGlzIHNwZWNpYWwgdGFnIC0gbmVlZCB0byBza2lwIGl0XG4gICAgICAgICAgICBjb25zdCBsb2NTa2lwID0gZGF0YS5lcTtcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpYWxTa2lwID0gdGhpcy5GaW5kU3BlY2lhbFRhZ0J5U3RhcnQobG9jU2tpcC50cmltKCkpO1xuXG4gICAgICAgICAgICBpZiAoc3BlY2lhbFNraXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGxvY1NraXAuaW5kZXhPZihzcGVjaWFsU2tpcFswXSkgKyBzcGVjaWFsU2tpcFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gbG9jU2tpcC5zdWJzdHJpbmcoc3RhcnQpLmluZGV4T2Yoc3BlY2lhbFNraXBbMV0pICsgc3RhcnQgKyBzcGVjaWFsU2tpcFsxXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goZGF0YS5zdWJzdHJpbmcoMCwgZW5kKSk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGVuZCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZmluZGluZyB0aGUgdGFnXG4gICAgICAgICAgICBjb25zdCBjdXRTdGFydERhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kKTsgLy88XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0RnJvbSA9IGRhdGEuc3Vic3RyaW5nKGZpbmQpO1xuXG4gICAgICAgICAgICAvL3RhZyB0eXBlIFxuICAgICAgICAgICAgY29uc3QgdGFnVHlwZUVuZCA9IHN0YXJ0RnJvbS5zZWFyY2goJ1xcIHwvfFxcPnwoPCUpJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ1R5cGUgPSBzdGFydEZyb20uc3Vic3RyaW5nKDEsIHRhZ1R5cGVFbmQpO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kRW5kT2ZTbWFsbFRhZyA9IGF3YWl0IHRoaXMuRmluZENsb3NlQ2hhcihzdGFydEZyb20uc3Vic3RyaW5nKDEpLCAnPicpICsgMTtcblxuICAgICAgICAgICAgbGV0IGluVGFnID0gc3RhcnRGcm9tLnN1YnN0cmluZyh0YWdUeXBlRW5kICsgMSwgZmluZEVuZE9mU21hbGxUYWcpO1xuXG4gICAgICAgICAgICBjb25zdCBOZXh0VGV4dFRhZyA9IHN0YXJ0RnJvbS5zdWJzdHJpbmcoZmluZEVuZE9mU21hbGxUYWcgKyAxKTtcblxuICAgICAgICAgICAgaWYgKGluVGFnLmF0KGluVGFnLmxlbmd0aCAtIDEpLmVxID09ICcvJykge1xuICAgICAgICAgICAgICAgIGluVGFnID0gaW5UYWcuc3Vic3RyaW5nKDAsIGluVGFnLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhcnRGcm9tLmF0KGZpbmRFbmRPZlNtYWxsVGFnIC0gMSkuZXEgPT0gJy8nKSB7Ly9zbWFsbCB0YWdcbiAgICAgICAgICAgICAgICBwcm9taXNlQnVpbGQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja01pbkhUTUwoY3V0U3RhcnREYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRUYWdEYXRhKHBhdGhOYW1lLCB0YWdUeXBlLCBpblRhZywgeyAgc2Vzc2lvbkluZm8gfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IE5leHRUZXh0VGFnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JpZyB0YWcgd2l0aCByZWFkZXJcbiAgICAgICAgICAgIGxldCBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLlNpbXBsZVNraXAuaW5jbHVkZXModGFnVHlwZS5lcSkpIHtcbiAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBOZXh0VGV4dFRhZy5pbmRleE9mKCc8LycgKyB0YWdUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4ID0gYXdhaXQgdGhpcy5GaW5kQ2xvc2VDaGFySFRNTChOZXh0VGV4dFRhZywgdGFnVHlwZS5lcSk7XG4gICAgICAgICAgICAgICAgaWYgKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBcXG5XYXJuaW5nLCB5b3UgZGlkbid0IHdyaXRlIHJpZ2h0IHRoaXMgdGFnOiBcIiR7dGFnVHlwZX1cIiwgdXNlZCBpbjogJHt0YWdUeXBlLmF0KDApLmxpbmVJbmZvfVxcbih0aGUgc3lzdGVtIHdpbGwgYXV0byBjbG9zZSBpdClgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiBcImNsb3NlLXRhZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgQmV0d2VlblRhZ0RhdGEgPSBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggIT0gbnVsbCAmJiBOZXh0VGV4dFRhZy5zdWJzdHJpbmcoMCwgQmV0d2VlblRhZ0RhdGFDbG9zZUluZGV4KTtcblxuICAgICAgICAgICAgLy9maW5kaW5nIGxhc3QgY2xvc2UgXG4gICAgICAgICAgICBjb25zdCBOZXh0RGF0YUNsb3NlID0gTmV4dFRleHRUYWcuc3Vic3RyaW5nKEJldHdlZW5UYWdEYXRhQ2xvc2VJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBOZXh0RGF0YUFmdGVyQ2xvc2UgPSBCZXR3ZWVuVGFnRGF0YUNsb3NlSW5kZXggIT0gbnVsbCA/IE5leHREYXRhQ2xvc2Uuc3Vic3RyaW5nKEJhc2VSZWFkZXIuZmluZEVuZE9mRGVmKE5leHREYXRhQ2xvc2UuZXEsICc+JykgKyAxKSA6IE5leHREYXRhQ2xvc2U7IC8vIHNlYXJjaCBmb3IgdGhlIGNsb3NlIG9mIGEgYmlnIHRhZyBqdXN0IGlmIHRoZSB0YWcgaXMgdmFsaWRcblxuICAgICAgICAgICAgcHJvbWlzZUJ1aWxkLnB1c2goXG4gICAgICAgICAgICAgICAgdGhpcy5DaGVja01pbkhUTUwoY3V0U3RhcnREYXRhKSxcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydFRhZ0RhdGEocGF0aE5hbWUsIHRhZ1R5cGUsIGluVGFnLCB7IEJldHdlZW5UYWdEYXRhLCBzZXNzaW9uSW5mbyB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZGF0YSA9IE5leHREYXRhQWZ0ZXJDbG9zZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IHRleHRCdWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKGRhdGEuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcHJvbWlzZUJ1aWxkKSB7XG4gICAgICAgICAgICB0ZXh0QnVpbGQgPSB0aGlzLkNoZWNrRG91YmxlU3BhY2UodGV4dEJ1aWxkLCBhd2FpdCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkNoZWNrTWluSFRNTCh0aGlzLkNoZWNrRG91YmxlU3BhY2UodGV4dEJ1aWxkLCBkYXRhKSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIFJlbW92ZVVubmVjZXNzYXJ5U3BhY2UoY29kZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb2RlID0gY29kZS50cmltKCk7XG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoLyU+WyBdKzwlKD8hWz06XSkvLCAnJT48JScpO1xuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9XG5cbiAgICBhc3luYyBJbnNlcnQoZGF0YTogU3RyaW5nVHJhY2tlciwgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vcmVtb3ZpbmcgaHRtbCBjb21tZW50IHRhZ3NcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPCEtLVtcXHdcXFddKz8tLT4vLCAnJyk7XG5cbiAgICAgICAgZGF0YSA9IGF3YWl0IHRoaXMuU3RhcnRSZXBsYWNlKGRhdGEsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG5cbiAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHJlYWRlciwgcmVwbGFjaW5nIGhpbSB3aXRoICdjb2RlYmFzZSdcbiAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvPFxcOnJlYWRlcisoICkqXFwvPi9naSwgJzwldHlwZW9mIHBhZ2UuY29kZWJhc2UgPT0gXCJmdW5jdGlvblwiID8gcGFnZS5jb2RlYmFzZSgpOiB3cml0ZShwYWdlLmNvZGViYXNlKSU+JykgLy8gcmVwbGFjZSBmb3IgaW1wb3J0aW5nIHBhZ2VzIC8gY29tcG9uZW50c1xuICAgICAgICByZXR1cm4gdGhpcy5SZW1vdmVVbm5lY2Vzc2FyeVNwYWNlKGRhdGEpO1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuXG5mdW5jdGlvbiB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgIGxldCBhID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnN1YnN0cigtNCk7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXRNYWluKGRhdGE6IFN0cmluZ1RyYWNrZXIsIGFycmF5OnN0cmluZ1tdLCBzaW5nOnN0cmluZywgYmlnVGFnPzpib29sZWFuLCBzZWFyY2hGb3I/OmJvb2xlYW4pOiBTZWFyY2hDdXRPdXRwdXQge1xuICAgIGxldCBvdXQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZSBvZiBhcnJheSkge1xuICAgICAgICBvdXQgKz0gdW5pY29kZU1lKHNpbmcpICsgZSArIFwifFwiO1xuICAgIH1cbiAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKDAsIG91dC5sZW5ndGggLSAxKTtcbiAgICBvdXQgPSBgPCgke291dH0pJHtzZWFyY2hGb3IgPyBcIihbXFxcXHB7TH0wLTlfXFxcXC1cXFxcLl0rKVwiOiBcIlwifShcXFxcdTAwMjApKlxcXFx1MDAyRj8+YFxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgbmV3IFJlZ0V4cChvdXQsICd1JyksIHNpbmcsIGJpZ1RhZylcbn1cblxuZnVuY3Rpb24gb3V0VGFnTmFtZShkYXRhOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbmQgPSBkYXRhLmluZGV4T2YoXCI+XCIpO1xuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBlbmQpO1xuICAgIHdoaWxlIChkYXRhLmVuZHNXaXRoKFwiIFwiKSB8fCBkYXRhLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZGF0YS5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmludGVyZmFjZSBTZWFyY2hDdXREYXRhIHtcbiAgICB0YWc6IHN0cmluZyxcbiAgICBkYXRhOiBTdHJpbmdUcmFja2VyLFxuICAgIGxvYzogbnVtYmVyLFxufVxuXG5pbnRlcmZhY2UgU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBkYXRhPzogU3RyaW5nVHJhY2tlcixcbiAgICBlcnJvcj86IGJvb2xlYW4sXG4gICAgZm91bmQ/OiBTZWFyY2hDdXREYXRhW11cbn1cblxuLyoqXG4gKiBJdCBzZWFyY2hlcyBmb3IgYSBzcGVjaWZpYyB0YWcgYW5kIHJldHVybnMgdGhlIGRhdGEgaW5zaWRlIG9mIGl0LlxuICogQHBhcmFtIHtTdHJpbmdUcmFja2VyfSBkYXRhIC0gVGhlIHN0cmluZyB5b3Ugd2FudCB0byBzZWFyY2ggdGhyb3VnaC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBmaW5kQXJyYXkgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2luZyAtIFRoZSBzdHJpbmcgdGhhdCB5b3Ugd2FudCB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIFtiaWdUYWc9dHJ1ZV0gLSBJZiB0cnVlLCB0aGUgZnVuY3Rpb24gd2lsbCBzZWFyY2ggZm9yIHRoZSBlbmQgb2YgdGhlIHRhZy4gSWYgZmFsc2UsIGl0IHdpbGxcbiAqIHNlYXJjaCBmb3IgdGhlIG5leHQgaW5zdGFuY2Ugb2YgdGhlIHRhZy5cbiAqIEBwYXJhbSBvdXRwdXQgLSBUaGUgb3V0cHV0IG9mIHRoZSBzZWFyY2guXG4gKiBAcGFyYW0ge1NlYXJjaEN1dERhdGFbXX0gcmV0dXJuQXJyYXkgLSBBbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgdGFnIG5hbWUsIHRoZSBkYXRhXG4gKiBpbnNpZGUgdGhlIHRhZywgYW5kIHRoZSBsb2NhdGlvbiBvZiB0aGUgdGFnIGluIHRoZSBvcmlnaW5hbCBzdHJpbmcuXG4gKiBAcmV0dXJucyBBIHN0cmluZyBvZiB0aGUgZGF0YSB0aGF0IHdhcyBmb3VuZCwgYW5kIGFuIGFycmF5IG9mIHRoZSBkYXRhIHRoYXQgd2FzIGZvdW5kLlxuICovXG5mdW5jdGlvbiBzZWFyY2hGb3JDdXQoZGF0YTpTdHJpbmdUcmFja2VyLCBmaW5kQXJyYXk6UmVnRXhwLCBzaW5nOnN0cmluZywgYmlnVGFnID0gdHJ1ZSwgb3V0cHV0ID0gbmV3IFN0cmluZ1RyYWNrZXIoKSwgcmV0dXJuQXJyYXk6IFNlYXJjaEN1dERhdGFbXSA9IFtdKTogU2VhcmNoQ3V0T3V0cHV0IHtcbiAgICBjb25zdCBkYXRhQ29weSA9IGRhdGE7XG4gICAgY29uc3QgYmUgPSBkYXRhLnNlYXJjaChmaW5kQXJyYXkpO1xuICAgIGlmIChiZSA9PSAtMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogb3V0cHV0LlBsdXMoZGF0YSksIGZvdW5kOiByZXR1cm5BcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG91dHB1dC5QbHVzKGRhdGEuc3Vic3RyaW5nKDAsIGJlKSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoYmUgKyAxKTtcblxuICAgIGNvbnN0IHRhZyA9IG91dFRhZ05hbWUoZGF0YS5lcSk7XG5cbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZmluZFN0YXJ0KFwiPlwiLCBkYXRhKSk7XG5cbiAgICBsZXQgaW5UYWdEYXRhO1xuXG4gICAgaWYgKGJpZ1RhZykge1xuICAgICAgICBjb25zdCBlbmQgPSBmaW5kRW5kKFtcIjxcIiArIHRhZywgXCI8L1wiICsgdGFnXSwgZGF0YSk7XG4gICAgICAgIGlmIChlbmQgIT0gLTEpIHtcbiAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhmaW5kU3RhcnQoXCI+XCIsIGRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmROZXh0ID0gZGF0YS5zZWFyY2goZmluZEFycmF5KTtcbiAgICAgICAgICAgIGlmIChmaW5kTmV4dCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGluVGFnRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpblRhZ0RhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBmaW5kTmV4dCk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGZpbmROZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybkFycmF5LnB1c2goe1xuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgZGF0YTogaW5UYWdEYXRhLFxuICAgICAgICBsb2M6IGJlXG4gICAgfSk7XG5cbiAgICBpZiAoZGF0YUNvcHkgPT0gZGF0YSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWFyY2hGb3JDdXQoZGF0YSwgZmluZEFycmF5LCBzaW5nLCBiaWdUYWcsIG91dHB1dCwgcmV0dXJuQXJyYXkpO1xufVxuXG5mdW5jdGlvbiBmaW5kU3RhcnQodHlwZTpzdHJpbmcsIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuICAgIHJldHVybiBkYXRhLmluZGV4T2YodHlwZSkgKyB0eXBlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gZmluZEVuZCh0eXBlczogc3RyaW5nW10sIGRhdGE6U3RyaW5nVHJhY2tlcikge1xuXG4gICAgbGV0IF8wID0gZGF0YS5pbmRleE9mKHR5cGVzWzBdKTtcblxuICAgIGNvbnN0IF8xID0gZGF0YS5pbmRleE9mKHR5cGVzWzFdKTtcblxuICAgIGlmIChfMSA9PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKF8wIDwgXzEgJiYgXzAgIT0gLTEpIHtcbiAgICAgICAgXzArKztcbiAgICAgICAgY29uc3QgbmV4dCA9IF8wICsgZmluZEVuZCh0eXBlcywgZGF0YS5zdWJzdHJpbmcoXzApKSArIHR5cGVzWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG5leHQgKyBmaW5kRW5kKHR5cGVzLCBkYXRhLnN1YnN0cmluZyhuZXh0KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXzE7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7XG4gICAgc2VhcmNoRm9yQ3V0TWFpbiBhcyBnZXREYXRhVGFnZXNcbn1cbiIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IEJhc2VSZWFkZXIgfSBmcm9tICcuLi9CYXNlUmVhZGVyL1JlYWRlcic7XG5pbXBvcnQgeyBnZXREYXRhVGFnZXMgfSBmcm9tIFwiLi4vWE1MSGVscGVycy9FeHRyaWNhdGVcIjtcbmltcG9ydCB7IFN0cmluZ0FueU1hcCwgU3RyaW5nTnVtYmVyTWFwIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IHsgQWRkRGVidWdJbmZvIH0gZnJvbSAnLi4vWE1MSGVscGVycy9Db2RlSW5mb0FuZERlYnVnJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ld1wiO1xuaW1wb3J0IENSdW5UaW1lIGZyb20gXCIuL0NvbXBpbGVcIjtcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gXCIuLi9TZXNzaW9uXCI7XG5cbmV4cG9ydCBjb25zdCBzZXR0aW5ncyA9IHtkZWZpbmU6IHt9fTtcblxuY29uc3Qgc3RyaW5nQXR0cmlidXRlcyA9IFsnXFwnJywgJ1wiJywgJ2AnXTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlQmFzZVBhZ2Uge1xuICAgIHB1YmxpYyBjbGVhckRhdGE6IFN0cmluZ1RyYWNrZXJcbiAgICBwdWJsaWMgc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBwdWJsaWMgdmFsdWVBcnJheTogeyBrZXk6IHN0cmluZywgdmFsdWU6IFN0cmluZ1RyYWNrZXIgfVtdID0gW11cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29kZT86IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBpc1RzPzogYm9vbGVhbikge1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncyhzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwYWdlUGF0aDogc3RyaW5nLCBzbWFsbFBhdGg6IHN0cmluZywgcGFnZU5hbWU6IHN0cmluZywgYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBydW4gPSBuZXcgQ1J1blRpbWUodGhpcy5jb2RlLCBzZXNzaW9uSW5mbywgc21hbGxQYXRoLCB0aGlzLmlzVHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSBhd2FpdCBydW4uY29tcGlsZShhdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLnBhcnNlQmFzZSh0aGlzLmNvZGUpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRDb2RlRmlsZShwYWdlUGF0aCwgc21hbGxQYXRoLCB0aGlzLmlzVHMsIHNlc3Npb25JbmZvLCBwYWdlTmFtZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvYWREZWZpbmUoey4uLnNldHRpbmdzLmRlZmluZSwgLi4ucnVuLmRlZmluZX0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VCYXNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgbGV0IGRhdGFTcGxpdDogU3RyaW5nVHJhY2tlcjtcblxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlcigvQFxcW1sgXSooKFtBLVphLXpfXVtBLVphLXpfMC05XSo9KChcIlteXCJdKlwiKXwoYFteYF0qYCl8KCdbXiddKicpfFtBLVphLXowLTlfXSspKFsgXSosP1sgXSopPykqKVxcXS8sIGRhdGEgPT4ge1xuICAgICAgICAgICAgZGF0YVNwbGl0ID0gZGF0YVsxXS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGRhdGFTcGxpdD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBmaW5kV29yZCA9IGRhdGFTcGxpdC5pbmRleE9mKCc9Jyk7XG5cbiAgICAgICAgICAgIGxldCB0aGlzV29yZCA9IGRhdGFTcGxpdC5zdWJzdHJpbmcoMCwgZmluZFdvcmQpLnRyaW0oKS5lcTtcblxuICAgICAgICAgICAgaWYgKHRoaXNXb3JkWzBdID09ICcsJylcbiAgICAgICAgICAgICAgICB0aGlzV29yZCA9IHRoaXNXb3JkLnN1YnN0cmluZygxKS50cmltKCk7XG5cbiAgICAgICAgICAgIGxldCBuZXh0VmFsdWUgPSBkYXRhU3BsaXQuc3Vic3RyaW5nKGZpbmRXb3JkICsgMSk7XG5cbiAgICAgICAgICAgIGxldCB0aGlzVmFsdWU6IFN0cmluZ1RyYWNrZXI7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQ2hhciA9IG5leHRWYWx1ZS5hdCgwKS5lcTtcbiAgICAgICAgICAgIGlmIChzdHJpbmdBdHRyaWJ1dGVzLmluY2x1ZGVzKGNsb3NlQ2hhcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IEJhc2VSZWFkZXIuZmluZEVudE9mUShuZXh0VmFsdWUuZXEuc3Vic3RyaW5nKDEpLCBjbG9zZUNoYXIpO1xuICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoMSwgZW5kSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbmV4dFZhbHVlLnN1YnN0cmluZyhlbmRJbmRleCArIDEpLnRyaW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBuZXh0VmFsdWUuc2VhcmNoKC9bXyAsXS8pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNWYWx1ZSA9IG5leHRWYWx1ZS5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSBuZXh0VmFsdWUuc3Vic3RyaW5nKGVuZEluZGV4KS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhU3BsaXQgPSBuZXh0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQXJyYXkucHVzaCh7IGtleTogdGhpc1dvcmQsIHZhbHVlOiB0aGlzVmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGNvZGUudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWJ1aWxkKCkge1xuICAgICAgICBpZighdGhpcy52YWx1ZUFycmF5Lmxlbmd0aCkgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFN0cmluZ1RyYWNrZXIobnVsbCwgJ0BbJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGtleSwgdmFsdWUgfSBvZiB0aGlzLnZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMkYCR7a2V5fT1cIiR7dmFsdWUucmVwbGFjZUFsbCgnXCInLCAnXFxcXFwiJyl9XCJgO1xuICAgICAgICB9XG4gICAgICAgIGJ1aWxkLlBsdXMoXCJdXCIpLlBsdXModGhpcy5jbGVhckRhdGEpO1xuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGJ1aWxkO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWJ1aWxkQmFzZUluaGVyaXRhbmNlKGNvZGU6IFN0cmluZ1RyYWNrZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgcGFyc2UgPSBuZXcgUGFyc2VCYXNlUGFnZSgpO1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIHBhcnNlLnBhcnNlQmFzZShjb2RlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcGFyc2UuYnlWYWx1ZSgnaW5oZXJpdCcpKSB7XG4gICAgICAgICAgICBwYXJzZS5wb3AobmFtZSlcbiAgICAgICAgICAgIGJ1aWxkLlBsdXMoYDxAJHtuYW1lfT48OiR7bmFtZX0vPjwvQCR7bmFtZX0+YClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlLnJlYnVpbGQoKTtcblxuICAgICAgICByZXR1cm4gcGFyc2UuY2xlYXJEYXRhLlBsdXMoYnVpbGQpO1xuICAgIH1cblxuICAgIGdldChuYW1lOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSk/LnZhbHVlXG4gICAgfVxuXG4gICAgcG9wKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LnNwbGljZSh0aGlzLnZhbHVlQXJyYXkuZmluZEluZGV4KHggPT4geC5rZXkgPT09IG5hbWUpLCAxKVswXT8udmFsdWU7XG4gICAgfVxuXG4gICAgcG9wQW55KG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoYXZlTmFtZSA9IHRoaXMudmFsdWVBcnJheS5maW5kSW5kZXgoeCA9PiB4LmtleS50b0xvd2VyQ2FzZSgpID09IG5hbWUpO1xuXG4gICAgICAgIGlmIChoYXZlTmFtZSAhPSAtMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlQXJyYXkuc3BsaWNlKGhhdmVOYW1lLCAxKVswXS52YWx1ZTtcblxuICAgICAgICBjb25zdCBhc1RhZyA9IGdldERhdGFUYWdlcyh0aGlzLmNsZWFyRGF0YSwgW25hbWVdLCAnQCcpO1xuXG4gICAgICAgIGlmICghYXNUYWcuZm91bmRbMF0pIHJldHVybjtcblxuICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IGFzVGFnLmRhdGE7XG5cbiAgICAgICAgcmV0dXJuIGFzVGFnLmZvdW5kWzBdLmRhdGEudHJpbSgpO1xuICAgIH1cblxuICAgIGJ5VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUFycmF5LmZpbHRlcih4ID0+IHgudmFsdWUuZXEgPT09IHZhbHVlKS5tYXAoeCA9PiB4LmtleSlcbiAgICB9XG5cbiAgICByZXBsYWNlVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy52YWx1ZUFycmF5LmZpbmQoeCA9PiB4LmtleSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGhhdmUpIGhhdmUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb2RlRmlsZShwYWdlUGF0aDogc3RyaW5nLCBwYWdlU21hbGxQYXRoOiBzdHJpbmcsIGlzVHM6IGJvb2xlYW4sIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQsIHBhZ2VOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhhdmVDb2RlID0gdGhpcy5wb3BBbnkoJ2NvZGVmaWxlJyk/LmVxO1xuICAgICAgICBpZiAoIWhhdmVDb2RlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbGFuZyA9IHRoaXMucG9wQW55KCdsYW5nJyk/LmVxO1xuICAgICAgICBpZiAoaGF2ZUNvZGUudG9Mb3dlckNhc2UoKSA9PSAnaW5oZXJpdCcpXG4gICAgICAgICAgICBoYXZlQ29kZSA9IHBhZ2VQYXRoO1xuXG4gICAgICAgIGNvbnN0IGhhdmVFeHQgPSBwYXRoLmV4dG5hbWUoaGF2ZUNvZGUpLnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIVsnanMnLCAndHMnXS5pbmNsdWRlcyhoYXZlRXh0KSkge1xuICAgICAgICAgICAgaWYgKC8oXFxcXHxcXC8pJC8udGVzdChoYXZlQ29kZSkpXG4gICAgICAgICAgICAgICAgaGF2ZUNvZGUgKz0gcGFnZVBhdGguc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKGhhdmVFeHQpKVxuICAgICAgICAgICAgICAgIGhhdmVDb2RlICs9IHBhdGguZXh0bmFtZShwYWdlUGF0aCk7XG4gICAgICAgICAgICBoYXZlQ29kZSArPSAnLicgKyAobGFuZyA/IGxhbmcgOiBpc1RzID8gJ3RzJyA6ICdqcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhdmVDb2RlWzBdID09ICcuJylcbiAgICAgICAgICAgIGhhdmVDb2RlID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWdlUGF0aCksIGhhdmVDb2RlKVxuXG4gICAgICAgIGNvbnN0IFNtYWxsUGF0aCA9IEJhc2ljU2V0dGluZ3MucmVsYXRpdmUoaGF2ZUNvZGUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGF3YWl0IHNlc3Npb25JbmZvLmRlcGVuZGVuY2UoU21hbGxQYXRoLGhhdmVDb2RlKSkge1xuICAgICAgICAgICAgY29uc3QgYmFzZU1vZGVsRGF0YSA9IGF3YWl0IEFkZERlYnVnSW5mbyhwYWdlTmFtZSwgaGF2ZUNvZGUsIFNtYWxsUGF0aCk7IC8vIHJlYWQgbW9kZWxcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IGJhc2VNb2RlbERhdGEuYWxsRGF0YS5yZXBsYWNlQWxsKFwiQFwiLCBcIkBAXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEJlZm9yZU5vVHJhY2soJzwlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEZpbGUuQWRkVGV4dEFmdGVyTm9UcmFjaygnJT4nKTtcbiAgICAgICAgICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIHRoaXMuc2NyaXB0RmlsZS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICBpZDogU21hbGxQYXRoLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnY29kZUZpbGVOb3RGb3VuZCcsXG4gICAgICAgICAgICAgICAgdGV4dDogYFxcbkNvZGUgZmlsZSBub3QgZm91bmQ6ICR7cGFnZVBhdGh9PGxpbmU+JHtTbWFsbFBhdGh9YFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NyaXB0RmlsZSA9IG5ldyBTdHJpbmdUcmFja2VyKHBhZ2VOYW1lLCBgPCU9XCI8cCBzdHlsZT1cXFxcXCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1xcXFxcIj5Db2RlIEZpbGUgTm90IEZvdW5kOiAnJHtwYWdlU21hbGxQYXRofScgLT4gJyR7U21hbGxQYXRofSc8L3A+XCIlPmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU2V0dGluZyhuYW1lID0gJ2RlZmluZScsIGxpbWl0QXJndW1lbnRzID0gMikge1xuICAgICAgICBjb25zdCBoYXZlID0gdGhpcy5jbGVhckRhdGEuaW5kZXhPZihgQCR7bmFtZX0oYCk7XG4gICAgICAgIGlmIChoYXZlID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYXJndW1lbnRBcnJheTogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgY29uc3QgYmVmb3JlID0gdGhpcy5jbGVhckRhdGEuc3Vic3RyaW5nKDAsIGhhdmUpO1xuICAgICAgICBsZXQgd29ya0RhdGEgPSB0aGlzLmNsZWFyRGF0YS5zdWJzdHJpbmcoaGF2ZSArIDgpLnRyaW1TdGFydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXRBcmd1bWVudHM7IGkrKykgeyAvLyBhcmd1bWVudHMgcmVhZGVyIGxvb3BcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhdGlvblNpZ24gPSB3b3JrRGF0YS5hdCgwKS5lcTtcblxuICAgICAgICAgICAgY29uc3QgZW5kUXVvdGUgPSBCYXNlUmVhZGVyLmZpbmRFbnRPZlEod29ya0RhdGEuZXEuc3Vic3RyaW5nKDEpLCBxdW90YXRpb25TaWduKTtcblxuICAgICAgICAgICAgYXJndW1lbnRBcnJheS5wdXNoKHdvcmtEYXRhLnN1YnN0cmluZygxLCBlbmRRdW90ZSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhZnRlckFyZ3VtZW50ID0gd29ya0RhdGEuc3Vic3RyaW5nKGVuZFF1b3RlICsgMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJBcmd1bWVudC5hdCgwKS5lcSAhPSAnLCcpIHtcbiAgICAgICAgICAgICAgICB3b3JrRGF0YSA9IGFmdGVyQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtEYXRhID0gYWZ0ZXJBcmd1bWVudC5zdWJzdHJpbmcoMSkudHJpbVN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrRGF0YSA9IHdvcmtEYXRhLnN1YnN0cmluZyh3b3JrRGF0YS5pbmRleE9mKCcpJykgKyAxKTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEgPSBiZWZvcmUudHJpbUVuZCgpLlBsdXMod29ya0RhdGEudHJpbVN0YXJ0KCkpO1xuXG4gICAgICAgIHJldHVybiBhcmd1bWVudEFycmF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZERlZmluZShtb3JlRGVmaW5lOiBTdHJpbmdBbnlNYXApIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMubG9hZFNldHRpbmcoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXM6IChTdHJpbmdUcmFja2VyfHN0cmluZylbXVtdID0gT2JqZWN0LmVudHJpZXMobW9yZURlZmluZSk7XG4gICAgICAgIHdoaWxlIChsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlcy51bnNoaWZ0KGxhc3RWYWx1ZSk7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB0aGlzLmxvYWRTZXR0aW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSA9IHRoaXMuY2xlYXJEYXRhLnJlcGxhY2VBbGwoYDoke25hbWV9OmAsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCAiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBTb3VyY2VNYXBTdG9yZSBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGNvbXBpbGVJbXBvcnQgfSBmcm9tIFwiLi4vLi4vSW1wb3J0RmlsZXMvU2NyaXB0XCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IENvbnZlcnRTeW50YXhNaW5pIH0gZnJvbSBcIi4uLy4uL1BsdWdpbnMvU3ludGF4L1Jhem9yU3ludGF4XCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgc21hbGxQYXRoVG9QYWdlIH0gZnJvbSBcIi4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCBTcGxpdEZpcnN0IH0gZnJvbSBcIi4uLy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nXCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0pTUGFyc2VyXCI7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tIFwiLi4vU2Vzc2lvblwiO1xuaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSBcIi4uL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENSdW5UaW1lIHtcbiAgICBkZWZpbmUgPSB7fVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzY3JpcHQ6IFN0cmluZ1RyYWNrZXIsIHB1YmxpYyBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkLCBwdWJsaWMgc21hbGxQYXRoOiBzdHJpbmcsIHB1YmxpYyBpc1RzOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHRlbXBsYXRlU2NyaXB0KHNjcmlwdHM6IFN0cmluZ1RyYWNrZXJbXSkge1xuICAgICAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYGNvbnN0IF9fd3JpdGVBcnJheSA9IFtdXG4gICAgICAgIHZhciBfX3dyaXRlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlKHRleHQpe1xuICAgICAgICAgICAgX193cml0ZS50ZXh0ICs9IHRleHQ7XG4gICAgICAgIH1gKVxuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGBfX3dyaXRlID0ge3RleHQ6ICcnfTtcbiAgICAgICAgICAgIF9fd3JpdGVBcnJheS5wdXNoKF9fd3JpdGUpO2ApXG4gICAgICAgICAgICBidWlsZC5QbHVzKGkpXG4gICAgICAgIH1cblxuICAgICAgICBidWlsZC5BZGRUZXh0QWZ0ZXJOb1RyYWNrKGByZXR1cm4gX193cml0ZUFycmF5YCk7XG4gICAgICAgIHJldHVybiBidWlsZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ldGhvZHMoYXR0cmlidXRlcz86IFN0cmluZ0FueU1hcCkge1xuICAgICAgICBjb25zdCBfX2xvY2FscGF0aCA9ICcvJyArIHNtYWxsUGF0aFRvUGFnZSh0aGlzLnNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHJpbmc6ICdzY3JpcHQsc3R5bGUsZGVmaW5lLHN0b3JlLHBhZ2VfX2ZpbGVuYW1lLHBhZ2VfX2Rpcm5hbWUsX19sb2NhbHBhdGgsYXR0cmlidXRlcycsXG4gICAgICAgICAgICBmdW5jczogW1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uc2NyaXB0LmJpbmQodGhpcy5zZXNzaW9uSW5mbyksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5zdHlsZS5iaW5kKHRoaXMuc2Vzc2lvbkluZm8pLFxuICAgICAgICAgICAgICAgIChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kZWZpbmVbU3RyaW5nKGtleSldID0gdmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSW5mby5jb21waWxlUnVuVGltZVN0b3JlLFxuICAgICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgsXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHRoaXMuc2Vzc2lvbkluZm8uZnVsbFBhdGgpLFxuICAgICAgICAgICAgICAgIF9fbG9jYWxwYXRoLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZENvZGUocGFyc2VyOiBKU1BhcnNlciwgYnVpbGRTdHJpbmdzOiB7IHRleHQ6IHN0cmluZyB9W10pIHtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBwYXJzZXIudmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoaS50eXBlID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMoaS50ZXh0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1aWxkLkFkZFRleHRBZnRlck5vVHJhY2soYnVpbGRTdHJpbmdzLnBvcCgpLnRleHQpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVpbGQ7XG4gICAgfVxuXG4gICAgYXN5bmMgY29tcGlsZShhdHRyaWJ1dGVzPzogU3RyaW5nQW55TWFwKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPiB7XG4gICAgICAgIC8qIGxvYWQgZnJvbSBjYWNoZSAqL1xuICAgICAgICBjb25zdCBoYXZlQ2FjaGUgPSB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF07XG4gICAgICAgIGlmIChoYXZlQ2FjaGUpXG4gICAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhdmVDYWNoZSkoKTtcbiAgICAgICAgbGV0IGRvRm9yQWxsOiAocmVzb2x2ZTogKCkgPT4gU3RyaW5nVHJhY2tlciB8IFByb21pc2U8U3RyaW5nVHJhY2tlcj4pID0+IHZvaWQ7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gZG9Gb3JBbGwgPSByKTtcblxuICAgICAgICAvKiBydW4gdGhlIHNjcmlwdCAqL1xuICAgICAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IENvbnZlcnRTeW50YXhNaW5pKHRoaXMuc2NyaXB0LCBcIkBjb21waWxlXCIsIFwiKlwiKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEpTUGFyc2VyKHRoaXMuc2NyaXB0LCB0aGlzLnNtYWxsUGF0aCwgJzwlKicsICclPicpO1xuICAgICAgICBhd2FpdCBwYXJzZXIuZmluZFNjcmlwdHMoKTtcblxuICAgICAgICBpZiAocGFyc2VyLnZhbHVlcy5sZW5ndGggPT0gMSAmJiBwYXJzZXIudmFsdWVzWzBdLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgY29uc3QgcmVzb2x2ZSA9ICgpID0+IHRoaXMuc2NyaXB0O1xuICAgICAgICAgICAgZG9Gb3JBbGwocmVzb2x2ZSk7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvLmNhY2hlQ29tcGlsZVNjcmlwdFt0aGlzLnNtYWxsUGF0aF0gPSByZXNvbHZlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW3R5cGUsIGZpbGVQYXRoXSA9IFNwbGl0Rmlyc3QoJy8nLCB0aGlzLnNtYWxsUGF0aCksIHR5cGVBcnJheSA9IGdldFR5cGVzW3R5cGVdID8/IGdldFR5cGVzLlN0YXRpYyxcbiAgICAgICAgICAgIGNvbXBpbGVQYXRoID0gdHlwZUFycmF5WzFdICsgZmlsZVBhdGggKyAnLmNvbXAuanMnO1xuICAgICAgICBhd2FpdCBFYXN5RnMubWFrZVBhdGhSZWFsKGZpbGVQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZVNjcmlwdChwYXJzZXIudmFsdWVzLmZpbHRlcih4ID0+IHgudHlwZSAhPSAndGV4dCcpLm1hcCh4ID0+IHgudGV4dCkpO1xuICAgICAgICBjb25zdCB7IGZ1bmNzLCBzdHJpbmcgfSA9IHRoaXMubWV0aG9kcyhhdHRyaWJ1dGVzKVxuXG4gICAgICAgIGNvbnN0IHRvSW1wb3J0ID0gYXdhaXQgY29tcGlsZUltcG9ydChzdHJpbmcsIGNvbXBpbGVQYXRoLCBmaWxlUGF0aCwgdHlwZUFycmF5LCB0aGlzLmlzVHMsIHRoaXMuc2Vzc2lvbkluZm8uZGVidWcsIHRlbXBsYXRlKTtcblxuICAgICAgICBjb25zdCBleGVjdXRlID0gYXN5bmMgKCkgPT4gdGhpcy5yZWJ1aWxkQ29kZShwYXJzZXIsIGF3YWl0IHRvSW1wb3J0KC4uLmZ1bmNzKSk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8uY2FjaGVDb21waWxlU2NyaXB0W3RoaXMuc21hbGxQYXRoXSA9IGV4ZWN1dGU7IC8vIHNhdmUgdGhpcyB0byBjYWNoZVxuICAgICAgICBjb25zdCB0aGlzRmlyc3QgPSBhd2FpdCBleGVjdXRlKCk7XG4gICAgICAgIGRvRm9yQWxsKGV4ZWN1dGUpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNGaXJzdDtcbiAgICB9XG59IiwgImltcG9ydCB7IFRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybSB9IGZyb20gXCJlc2J1aWxkLXdhc21cIjtcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tIFwiLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgU3lzdGVtRGF0YSB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IEVhc3lTeW50YXggZnJvbSBcIi4uL0NvbXBpbGVDb2RlL3RyYW5zZm9ybS9FYXN5U3ludGF4XCI7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSBcIi4uL0NvbXBpbGVDb2RlL0pTUGFyc2VyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgaXNUcyB9IGZyb20gXCIuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHNcIjtcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi9yZWRpcmVjdENKUyc7XG5pbXBvcnQgeyBTdHJpbmdBbnlNYXAgfSBmcm9tICcuLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBwYWdlRGVwcyB9IGZyb20gXCIuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHNcIjtcbmltcG9ydCBDdXN0b21JbXBvcnQsIHsgaXNQYXRoQ3VzdG9tIH0gZnJvbSBcIi4vQ3VzdG9tSW1wb3J0L2luZGV4XCI7XG5pbXBvcnQgeyBFU0J1aWxkUHJpbnRFcnJvciwgRVNCdWlsZFByaW50RXJyb3JTdHJpbmdUcmFja2VyLCBFU0J1aWxkUHJpbnRXYXJuaW5ncywgRVNCdWlsZFByaW50V2FybmluZ3NTdHJpbmdUcmFja2VyIH0gZnJvbSBcIi4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tIFwiLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXJcIjtcbmltcG9ydCB7IGJhY2tUb09yaWdpbmFsIH0gZnJvbSBcIi4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBMb2FkXCI7XG5pbXBvcnQgeyBBbGlhc09yUGFja2FnZSB9IGZyb20gXCIuL0N1c3RvbUltcG9ydC9BbGlhc1wiO1xuXG5hc3luYyBmdW5jdGlvbiBSZXBsYWNlQmVmb3JlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGRlZmluZURhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sXG4pIHtcbiAgY29kZSA9IGF3YWl0IEVhc3lTeW50YXguQnVpbGRBbmRFeHBvcnRJbXBvcnRzKGNvZGUsIGRlZmluZURhdGEpO1xuICByZXR1cm4gY29kZTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoY29kZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2lzRGVidWcgPyBcInJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcIiA6ICcnfXZhciBfX2Rpcm5hbWU9XCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoZGlyKVxuICAgIH1cIixfX2ZpbGVuYW1lPVwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZpbGUpXG4gICAgfVwiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlJHtwYXJhbXMgPyAnLCcgKyBwYXJhbXMgOiAnJ30pPT57dmFyIG1vZHVsZT17ZXhwb3J0czp7fX0sZXhwb3J0cz1tb2R1bGUuZXhwb3J0czske2NvZGV9XFxucmV0dXJuIG1vZHVsZS5leHBvcnRzO30pO2A7XG59XG5cblxuLyoqXG4gKiBJdCB0YWtlcyBhIGZpbGUgcGF0aCwgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIGNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBpbGUuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bGx9IHNhdmVQYXRoIC0gVGhlIHBhdGggdG8gc2F2ZSB0aGUgY29tcGlsZWQgZmlsZSB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlc2NyaXB0IC0gYm9vbGVhblxuICogQHBhcmFtIHtib29sZWFufSBpc0RlYnVnIC0gYm9vbGVhbixcbiAqIEBwYXJhbSAgLSBmaWxlUGF0aDogVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIHNjcmlwdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQnVpbGRTY3JpcHQoZmlsZVBhdGg6IHN0cmluZywgc2F2ZVBhdGg6IHN0cmluZyB8IG51bGwsIGlzVHlwZXNjcmlwdDogYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgeyBwYXJhbXMsIHRlbXBsYXRlUGF0aCA9IGZpbGVQYXRoLCBjb2RlTWluaWZ5ID0gIWlzRGVidWcsIG1lcmdlVHJhY2sgfTogeyBjb2RlTWluaWZ5PzogYm9vbGVhbiwgdGVtcGxhdGVQYXRoPzogc3RyaW5nLCBwYXJhbXM/OiBzdHJpbmcsIG1lcmdlVHJhY2s/OiBTdHJpbmdUcmFja2VyIH0gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgZm9ybWF0OiAnY2pzJyxcbiAgICBsb2FkZXI6IGlzVHlwZXNjcmlwdCA/ICd0cycgOiAnanMnLFxuICAgIG1pbmlmeTogY29kZU1pbmlmeSxcbiAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAobWVyZ2VUcmFjayA/ICdleHRlcm5hbCcgOiAnaW5saW5lJykgOiBmYWxzZSxcbiAgICBzb3VyY2VmaWxlOiBzYXZlUGF0aCAmJiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShzYXZlUGF0aCksIGZpbGVQYXRoKSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIGRlYnVnOiBcIlwiICsgaXNEZWJ1Z1xuICAgIH1cbiAgfTtcblxuICBsZXQgUmVzdWx0ID0gYXdhaXQgUmVwbGFjZUJlZm9yZShtZXJnZVRyYWNrPy5lcSB8fCBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgpLCB7fSk7XG4gIFJlc3VsdCA9IHRlbXBsYXRlKFxuICAgIFJlc3VsdCxcbiAgICBpc0RlYnVnLFxuICAgIHBhdGguZGlybmFtZSh0ZW1wbGF0ZVBhdGgpLFxuICAgIHRlbXBsYXRlUGF0aCxcbiAgICBwYXJhbXNcbiAgKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHsgY29kZSwgd2FybmluZ3MsIG1hcCB9ID0gYXdhaXQgdHJhbnNmb3JtKFJlc3VsdCwgT3B0aW9ucyk7XG4gICAgaWYgKG1lcmdlVHJhY2spIHtcbiAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzU3RyaW5nVHJhY2tlcihtZXJnZVRyYWNrLCB3YXJuaW5ncyk7XG4gICAgICBSZXN1bHQgPSAoYXdhaXQgYmFja1RvT3JpZ2luYWwobWVyZ2VUcmFjaywgY29kZSwgbWFwKSkuU3RyaW5nV2l0aFRhY2soc2F2ZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBFU0J1aWxkUHJpbnRXYXJuaW5ncyh3YXJuaW5ncywgZmlsZVBhdGgpO1xuICAgICAgUmVzdWx0ID0gY29kZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChtZXJnZVRyYWNrKSB7XG4gICAgICBFU0J1aWxkUHJpbnRFcnJvclN0cmluZ1RyYWNrZXIobWVyZ2VUcmFjaywgZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRVNCdWlsZFByaW50RXJyb3IoZXJyLCBmaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNhdmVQYXRoKSB7XG4gICAgYXdhaXQgRWFzeUZzLm1ha2VQYXRoUmVhbChwYXRoLmRpcm5hbWUoc2F2ZVBhdGgpKTtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHNhdmVQYXRoLCBSZXN1bHQpO1xuICB9XG4gIHJldHVybiBSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIENoZWNrVHMoRmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gRmlsZVBhdGguZW5kc1dpdGgoXCIudHNcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGg6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNEZWJ1ZyA9IGZhbHNlKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoSW5TdGF0aWNQYXRoLCB0eXBlQXJyYXlbMV0pO1xuXG4gIHJldHVybiBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICB0eXBlQXJyYXlbMF0gKyBJblN0YXRpY1BhdGgsXG4gICAgdHlwZUFycmF5WzFdICsgSW5TdGF0aWNQYXRoICsgXCIuY2pzXCIsXG4gICAgQ2hlY2tUcyhJblN0YXRpY1BhdGgpLFxuICAgIGlzRGVidWcsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRFeHRlbnNpb24oRmlsZVBhdGg6IHN0cmluZykge1xuICBjb25zdCBmaWxlRXh0ID0gcGF0aC5leHRuYW1lKEZpbGVQYXRoKTtcblxuICBpZiAoQmFzaWNTZXR0aW5ncy5wYXJ0RXh0ZW5zaW9ucy5pbmNsdWRlcyhmaWxlRXh0LnN1YnN0cmluZygxKSkpXG4gICAgRmlsZVBhdGggKz0gXCIuXCIgKyAoaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiKVxuICBlbHNlIGlmIChmaWxlRXh0ID09ICcnKVxuICAgIEZpbGVQYXRoICs9IFwiLlwiICsgQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNbaXNUcygpID8gXCJ0c1wiIDogXCJqc1wiXTtcblxuICByZXR1cm4gRmlsZVBhdGg7XG59XG5cbmNvbnN0IFNhdmVkTW9kdWxlcyA9IHt9O1xuXG4vKipcbiAqIExvYWRJbXBvcnQgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCB0byBhIGZpbGUsIGFuZCByZXR1cm5zIHRoZSBtb2R1bGUgdGhhdCBpcyBhdCB0aGF0IHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbXBvcnRGcm9tIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBjcmVhdGVkIHRoaXMgaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IEluU3RhdGljUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IFt1c2VEZXBzXSAtIFRoaXMgaXMgYSBtYXAgb2YgZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gd2l0aG91dENhY2hlIC0gYW4gYXJyYXkgb2YgcGF0aHMgdGhhdCB3aWxsIG5vdCBiZSBjYWNoZWQuXG4gKiBAcmV0dXJucyBUaGUgbW9kdWxlIHRoYXQgd2FzIGltcG9ydGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBMb2FkSW1wb3J0KGltcG9ydEZyb206IHN0cmluZywgSW5TdGF0aWNQYXRoOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIGlzRGVidWcgPSBmYWxzZSwgdXNlRGVwcz86IFN0cmluZ0FueU1hcCwgd2l0aG91dENhY2hlOiBzdHJpbmdbXSA9IFtdKSB7XG4gIGxldCBUaW1lQ2hlY2s6IGFueTtcbiAgY29uc3Qgb3JpZ2luYWxQYXRoID0gcGF0aC5ub3JtYWxpemUoSW5TdGF0aWNQYXRoLnRvTG93ZXJDYXNlKCkpO1xuXG4gIEluU3RhdGljUGF0aCA9IEFkZEV4dGVuc2lvbihJblN0YXRpY1BhdGgpO1xuICBjb25zdCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoSW5TdGF0aWNQYXRoKS5zdWJzdHJpbmcoMSksIHRoaXNDdXN0b20gPSBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoLCBleHRlbnNpb24pIHx8ICFbJ2pzJywgJ3RzJ10uaW5jbHVkZXMoZXh0ZW5zaW9uKTtcbiAgY29uc3QgU2F2ZWRNb2R1bGVzUGF0aCA9IHBhdGguam9pbih0eXBlQXJyYXlbMl0sIEluU3RhdGljUGF0aCksIGZpbGVQYXRoID0gcGF0aC5qb2luKHR5cGVBcnJheVswXSwgSW5TdGF0aWNQYXRoKTtcblxuICAvL3dhaXQgaWYgdGhpcyBtb2R1bGUgaXMgb24gcHJvY2VzcywgaWYgbm90IGRlY2xhcmUgdGhpcyBhcyBvbiBwcm9jZXNzIG1vZHVsZVxuICBsZXQgcHJvY2Vzc0VuZDogKHY/OiBhbnkpID0+IHZvaWQ7XG4gIGlmICghU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdKVxuICAgIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXSA9IG5ldyBQcm9taXNlKHIgPT4gcHJvY2Vzc0VuZCA9IHIpO1xuICBlbHNlIGlmIChTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgIGF3YWl0IFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICAvL2J1aWxkIHBhdGhzXG4gIGNvbnN0IHJlQnVpbGQgPSAhcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gfHwgcGFnZURlcHMuc3RvcmVbU2F2ZWRNb2R1bGVzUGF0aF0gIT0gKFRpbWVDaGVjayA9IGF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCBcIm10aW1lTXNcIiwgdHJ1ZSwgbnVsbCkpO1xuXG5cbiAgaWYgKHJlQnVpbGQpIHtcbiAgICBUaW1lQ2hlY2sgPSBUaW1lQ2hlY2sgPz8gYXdhaXQgRWFzeUZzLnN0YXQoZmlsZVBhdGgsIFwibXRpbWVNc1wiLCB0cnVlLCBudWxsKTtcbiAgICBpZiAoVGltZUNoZWNrID09IG51bGwpIHtcbiAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgIGVycm9yTmFtZTogJ2ltcG9ydC1ub3QtZXhpc3RzJyxcbiAgICAgICAgdGV4dDogYEltcG9ydCAnJHtJblN0YXRpY1BhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtpbXBvcnRGcm9tfSdgXG4gICAgICB9KVxuICAgICAgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdID0gbnVsbFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpc0N1c3RvbSkgLy8gb25seSBpZiBub3QgY3VzdG9tIGJ1aWxkXG4gICAgICBhd2FpdCBCdWlsZFNjcmlwdFNtYWxsUGF0aChJblN0YXRpY1BhdGgsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gICAgcGFnZURlcHMudXBkYXRlKFNhdmVkTW9kdWxlc1BhdGgsIFRpbWVDaGVjayk7XG4gIH1cblxuICBpZiAodXNlRGVwcykge1xuICAgIHVzZURlcHNbSW5TdGF0aWNQYXRoXSA9IHsgdGhpc0ZpbGU6IFRpbWVDaGVjayB9O1xuICAgIHVzZURlcHMgPSB1c2VEZXBzW0luU3RhdGljUGF0aF07XG4gIH1cblxuICBjb25zdCBpbmhlcml0YW5jZUNhY2hlID0gd2l0aG91dENhY2hlWzBdID09IEluU3RhdGljUGF0aDtcbiAgaWYgKGluaGVyaXRhbmNlQ2FjaGUpXG4gICAgd2l0aG91dENhY2hlLnNoaWZ0KClcbiAgZWxzZSBpZiAoIXJlQnVpbGQgJiYgU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdICYmICEoU2F2ZWRNb2R1bGVzW1NhdmVkTW9kdWxlc1BhdGhdIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgcmV0dXJuIFNhdmVkTW9kdWxlc1tTYXZlZE1vZHVsZXNQYXRoXTtcblxuICBmdW5jdGlvbiByZXF1aXJlTWFwKHA6IHN0cmluZykge1xuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUocCkpXG4gICAgICBwID0gcGF0aC5yZWxhdGl2ZShwLCB0eXBlQXJyYXlbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHBbMF0gPT0gXCIuXCIpIHtcbiAgICAgICAgcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoSW5TdGF0aWNQYXRoKSwgcCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwWzBdICE9IFwiL1wiKVxuICAgICAgICByZXR1cm4gQWxpYXNPclBhY2thZ2UocCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIExvYWRJbXBvcnQoZmlsZVBhdGgsIHAsIHR5cGVBcnJheSwgaXNEZWJ1ZywgdXNlRGVwcywgaW5oZXJpdGFuY2VDYWNoZSA/IHdpdGhvdXRDYWNoZSA6IFtdKTtcbiAgfVxuXG4gIGxldCBNeU1vZHVsZTogYW55O1xuICBpZiAodGhpc0N1c3RvbSkge1xuICAgIE15TW9kdWxlID0gYXdhaXQgQ3VzdG9tSW1wb3J0KG9yaWdpbmFsUGF0aCwgZmlsZVBhdGgsIGV4dGVuc2lvbiwgcmVxdWlyZU1hcCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVxdWlyZVBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBJblN0YXRpY1BhdGggKyBcIi5janNcIik7XG4gICAgTXlNb2R1bGUgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUocmVxdWlyZVBhdGgpO1xuICAgIE15TW9kdWxlID0gYXdhaXQgTXlNb2R1bGUocmVxdWlyZU1hcCk7XG4gIH1cblxuICBTYXZlZE1vZHVsZXNbU2F2ZWRNb2R1bGVzUGF0aF0gPSBNeU1vZHVsZTtcbiAgcHJvY2Vzc0VuZD8uKCk7XG5cbiAgcmV0dXJuIE15TW9kdWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSW1wb3J0RmlsZShpbXBvcnRGcm9tOiBzdHJpbmcsIEluU3RhdGljUGF0aDogc3RyaW5nLCB0eXBlQXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnID0gZmFsc2UsIHVzZURlcHM/OiBTdHJpbmdBbnlNYXAsIHdpdGhvdXRDYWNoZT86IHN0cmluZ1tdKSB7XG4gIGlmICghaXNEZWJ1Zykge1xuICAgIGNvbnN0IGhhdmVJbXBvcnQgPSBTYXZlZE1vZHVsZXNbcGF0aC5qb2luKHR5cGVBcnJheVsyXSwgSW5TdGF0aWNQYXRoLnRvTG93ZXJDYXNlKCkpXTtcbiAgICBpZiAoaGF2ZUltcG9ydCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaGF2ZUltcG9ydDtcbiAgfVxuXG4gIHJldHVybiBMb2FkSW1wb3J0KGltcG9ydEZyb20sIEluU3RhdGljUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnLCB1c2VEZXBzLCB3aXRob3V0Q2FjaGUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZU9uY2UoZmlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcblxuICBhd2FpdCBCdWlsZFNjcmlwdChcbiAgICBmaWxlUGF0aCxcbiAgICB0ZW1wRmlsZSxcbiAgICBDaGVja1RzKGZpbGVQYXRoKSxcbiAgICBpc0RlYnVnLFxuICApO1xuXG4gIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKHRlbXBGaWxlKTtcbiAgRWFzeUZzLnVubGluayh0ZW1wRmlsZSk7XG5cbiAgcmV0dXJuIGF3YWl0IE15TW9kdWxlKChwYXRoOiBzdHJpbmcpID0+IGltcG9ydChwYXRoKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZXF1aXJlQ2pzU2NyaXB0KGNvbnRlbnQ6IHN0cmluZykge1xuXG4gIGNvbnN0IHRlbXBGaWxlID0gcGF0aC5qb2luKFN5c3RlbURhdGEsIGB0ZW1wLSR7dXVpZCgpfS5janNgKTtcbiAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0ZW1wRmlsZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kZWwgPSBhd2FpdCBJbXBvcnRXaXRob3V0Q2FjaGUodGVtcEZpbGUpO1xuICBFYXN5RnMudW5saW5rKHRlbXBGaWxlKTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBmYWtlIHNjcmlwdCBsb2NhdGlvbiwgYSBmaWxlIGxvY2F0aW9uLCBhIHR5cGUgYXJyYXksIGFuZCBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgb3Igbm90IGl0J3NcbiAqIGEgVHlwZVNjcmlwdCBmaWxlLiBJdCB0aGVuIGNvbXBpbGVzIHRoZSBzY3JpcHQgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIHRoZSBtb2R1bGVcbiAqIFRoaXMgaXMgZm9yIFJ1blRpbWUgQ29tcGlsZSBTY3JpcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2xvYmFsUHJhbXMgLSBzdHJpbmcsIHNjcmlwdExvY2F0aW9uOiBzdHJpbmcsIGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZTogc3RyaW5nLFxuICogdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBmaWxlQ29kZTogc3RyaW5nLCAgc291cmNlTWFwQ29tbWVudDpcbiAqIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNjcmlwdExvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBzY3JpcHQgdG8gYmUgY29tcGlsZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGUgZnJvbSB0aGUgc3RhdGljIGZvbGRlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFtzdHJpbmcsIHN0cmluZ11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNUeXBlU2NyaXB0IC0gYm9vbGVhbiwgaXNEZWJ1ZzogYm9vbGVhbiwgZmlsZUNvZGU6IHN0cmluZywgIHNvdXJjZU1hcENvbW1lbnQ6XG4gKiBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWJ1ZyAtIElmIHRydWUsIHRoZSBjb2RlIHdpbGwgYmUgY29tcGlsZWQgd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlQ29kZSAtIFRoZSBjb2RlIHRoYXQgd2lsbCBiZSBjb21waWxlZCBhbmQgc2F2ZWQgdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTWFwQ29tbWVudCAtIHN0cmluZ1xuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGlsZUltcG9ydChnbG9iYWxQcmFtczogc3RyaW5nLCBzY3JpcHRMb2NhdGlvbjogc3RyaW5nLCBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgaXNUeXBlU2NyaXB0OiBib29sZWFuLCBpc0RlYnVnOiBib29sZWFuLCBtZXJnZVRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNMb2NhdGlvblJlbGF0aXZlLCB0eXBlQXJyYXlbMV0pO1xuXG4gIGNvbnN0IGZ1bGxTYXZlTG9jYXRpb24gPSBzY3JpcHRMb2NhdGlvbiArIFwiLmNqc1wiO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0eXBlQXJyYXlbMF0gKyBpblN0YXRpY0xvY2F0aW9uUmVsYXRpdmU7XG5cbiAgYXdhaXQgQnVpbGRTY3JpcHQoXG4gICAgc2NyaXB0TG9jYXRpb24sXG4gICAgZnVsbFNhdmVMb2NhdGlvbixcbiAgICBpc1R5cGVTY3JpcHQsXG4gICAgaXNEZWJ1ZyxcbiAgICB7IHBhcmFtczogZ2xvYmFsUHJhbXMsIG1lcmdlVHJhY2ssIHRlbXBsYXRlUGF0aCwgY29kZU1pbmlmeTogZmFsc2UgfVxuICApO1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmVNYXAocDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShwKSlcbiAgICAgIHAgPSBwYXRoLnJlbGF0aXZlKHAsIHR5cGVBcnJheVswXSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAocFswXSA9PSBcIi5cIikge1xuICAgICAgICBwID0gcGF0aC5qb2luKGluU3RhdGljTG9jYXRpb25SZWxhdGl2ZSwgcCk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHBbMF0gIT0gXCIvXCIpXG4gICAgICAgIHJldHVybiBBbGlhc09yUGFja2FnZShwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTG9hZEltcG9ydCh0ZW1wbGF0ZVBhdGgsIHAsIHR5cGVBcnJheSwgaXNEZWJ1Zyk7XG4gIH1cblxuICBjb25zdCBNeU1vZHVsZSA9IGF3YWl0IEltcG9ydFdpdGhvdXRDYWNoZShmdWxsU2F2ZUxvY2F0aW9uKTtcbiAgcmV0dXJuIGFzeW5jICguLi5hcnI6IGFueVtdKSA9PiBhd2FpdCBNeU1vZHVsZShyZXF1aXJlTWFwLCAuLi5hcnIpO1xufSIsICJpbXBvcnQgeyBTdHJpbmdNYXAgfSBmcm9tIFwiLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgZ2V0VHlwZXMgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCBNaW5pU2VhcmNoLCB7U2VhcmNoT3B0aW9uc30gZnJvbSAnbWluaXNlYXJjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFJlY29yZCB7XG4gICAgcHJpdmF0ZSBmdWxsUGF0aDogc3RyaW5nXG4gICAgcHJpdmF0ZSBpbmRleERhdGE6IHtba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIHRpdGxlczogU3RyaW5nTWFwLFxuICAgICAgICB0ZXh0OiBzdHJpbmdcbiAgICB9fVxuICAgIHByaXZhdGUgbWluaVNlYXJjaDogTWluaVNlYXJjaDtcbiAgICBjb25zdHJ1Y3RvcihmaWxlcGF0aDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5mdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGZpbGVwYXRoXG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZCgpe1xuICAgICAgICB0aGlzLmluZGV4RGF0YSA9IGF3YWl0IEVhc3lGcy5yZWFkSnNvbkZpbGUodGhpcy5mdWxsUGF0aCk7XG4gICAgICAgIGNvbnN0IHVud3JhcHBlZDoge2lkOiBudW1iZXIsIHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmd9W10gPSBbXTtcblxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGZvcihjb25zdCBwYXRoIGluIHRoaXMuaW5kZXhEYXRhKXtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmluZGV4RGF0YVtwYXRoXTtcbiAgICAgICAgICAgIGZvcihjb25zdCBpZCBpbiBlbGVtZW50LnRpdGxlcyl7XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGl0bGVzW2lkXSwgdXJsOiBgLyR7cGF0aH0vIyR7aWR9YH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW53cmFwcGVkLnB1c2goe2lkOiBjb3VudGVyKyssIHRleHQ6IGVsZW1lbnQudGV4dCwgdXJsOiBgLyR7cGF0aH1gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2ggPSBuZXcgTWluaVNlYXJjaCh7XG4gICAgICAgICAgICBmaWVsZHM6IFsndGV4dCddLFxuICAgICAgICAgICAgc3RvcmVGaWVsZHM6IFsnaWQnLCAndGV4dCcsICd1cmwnXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1pbmlTZWFyY2guYWRkQWxsKHVud3JhcHBlZCk7XG4gICAgfVxuXG4gICAgc2VhcmNoKHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyA9IHtmdXp6eTogdHJ1ZX0sIHRhZyA9ICdiJyl7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLm1pbmlTZWFyY2guc2VhcmNoKHRleHQsIG9wdGlvbnMpO1xuICAgICAgICBpZighdGFnKSByZXR1cm4gZGF0YTtcblxuICAgICAgICBmb3IoY29uc3QgaSBvZiBkYXRhKXtcbiAgICAgICAgICAgIGZvcihjb25zdCB0ZXJtIG9mIGkudGVybXMpe1xuICAgICAgICAgICAgICAgIGxldCBsb3dlciA9IGkudGV4dC50b0xvd2VyQ2FzZSgpLCByZWJ1aWxkID0gJyc7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGluZGV4ICE9IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgcmVidWlsZCArPSBsb3dlci5zdWJzdHJpbmcoMCwgaW5kZXgpICsgIGA8JHt0YWd9PiR7aS50ZXh0LnN1YnN0cmluZyhpbmRleCArIHJlYnVpbGQubGVuZ3RoLCBpbmRleCArIHRlcm0ubGVuZ3RoICsgcmVidWlsZC5sZW5ndGgpfTwvJHt0YWd9PmBcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBsb3dlci5zdWJzdHJpbmcoaW5kZXggKyB0ZXJtLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbG93ZXIuaW5kZXhPZih0ZXJtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpLnRleHQgPSByZWJ1aWxkICsgbG93ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBzdWdnZXN0KHRleHQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyl7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbmlTZWFyY2guYXV0b1N1Z2dlc3QodGV4dCwgb3B0aW9ucyk7XG4gICAgfVxufSIsICJpbXBvcnQgU2VhcmNoUmVjb3JkIGZyb20gXCIuLi8uLi8uLi9CdWlsZEluRnVuYy9TZWFyY2hSZWNvcmRcIlxuaW1wb3J0IHtTZXR0aW5nc30gIGZyb20gJy4uLy4uLy4uL01haW5CdWlsZC9TZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG59IiwgImltcG9ydCBwYWNrYWdlRXhwb3J0IGZyb20gXCIuL3BhY2thZ2VFeHBvcnRcIjtcblxuLy9AdHMtaWdub3JlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGFsaWFzTmFtZXMgPSBbcGFja2FnZU5hbWVdXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRBbGlhcyhvcmlnaW5hbFBhdGg6IHN0cmluZyk6IGFueSB7XG5cbiAgICBzd2l0Y2ggKG9yaWdpbmFsUGF0aCkge1xuICAgICAgICAvL0B0cy1pZ25vcmUtbmV4dC1saW5lXG4gICAgICAgIGNhc2UgcGFja2FnZU5hbWU6XG4gICAgICAgICAgICByZXR1cm4gcGFja2FnZUV4cG9ydCgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXNPclBhY2thZ2Uob3JpZ2luYWxQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXZlID0gSW1wb3J0QWxpYXMob3JpZ2luYWxQYXRoKTtcbiAgICBpZiAoaGF2ZSkgcmV0dXJuIGhhdmVcbiAgICByZXR1cm4gaW1wb3J0KG9yaWdpbmFsUGF0aCk7XG59IiwgImltcG9ydCBJbXBvcnRBbGlhcywgeyBhbGlhc05hbWVzIH0gZnJvbSAnLi9BbGlhcyc7XG5pbXBvcnQgSW1wb3J0QnlFeHRlbnNpb24sIHsgY3VzdG9tVHlwZXMgfSBmcm9tICcuL0V4dGVuc2lvbi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhDdXN0b20ob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGN1c3RvbVR5cGVzLmluY2x1ZGVzKGV4dGVuc2lvbikgfHwgYWxpYXNOYW1lcy5pbmNsdWRlcyhvcmlnaW5hbFBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBDdXN0b21JbXBvcnQob3JpZ2luYWxQYXRoOiBzdHJpbmcsIGZ1bGxQYXRoOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nLCByZXF1aXJlOiAocDogc3RyaW5nKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGlhc0V4cG9ydCA9IGF3YWl0IEltcG9ydEFsaWFzKG9yaWdpbmFsUGF0aCk7XG4gICAgaWYgKGFsaWFzRXhwb3J0KSByZXR1cm4gYWxpYXNFeHBvcnQ7XG4gICAgcmV0dXJuIEltcG9ydEJ5RXh0ZW5zaW9uKGZ1bGxQYXRoLCBleHRlbnNpb24pO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi8uLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBSYXpvclRvRUpTLCBSYXpvclRvRUpTTWluaSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Jhc2VSZWFkZXIvUmVhZGVyJztcblxuXG5jb25zdCBhZGRXcml0ZU1hcCA9IHtcbiAgICBcImluY2x1ZGVcIjogXCJhd2FpdCBcIixcbiAgICBcImltcG9ydFwiOiBcImF3YWl0IFwiLFxuICAgIFwidHJhbnNmZXJcIjogXCJyZXR1cm4gYXdhaXQgXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQ29udmVydFN5bnRheCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBvcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdmFsdWVzID0gYXdhaXQgUmF6b3JUb0VKUyh0ZXh0LmVxKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGkgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHN1YnN0cmluZyA9IHRleHQuc3Vic3RyaW5nKGkuc3RhcnQsIGkuZW5kKTtcbiAgICAgICAgc3dpdGNoIChpLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyhzdWJzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNjcmlwdFwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlJHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCU9JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVzY2FwZVwiOlxuICAgICAgICAgICAgICAgIGJ1aWxkLlBsdXMkYDwlOiR7c3Vic3RyaW5nfSU+YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZFdyaXRlTWFwW2kubmFtZV19JHtzdWJzdHJpbmd9JT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuXG4vKipcbiAqIENvbnZlcnRTeW50YXhNaW5pIHRha2VzIHRoZSBjb2RlIGFuZCBhIHNlYXJjaCBzdHJpbmcgYW5kIGNvbnZlcnQgY3VybHkgYnJhY2tldHNcbiAqIEBwYXJhbSB7U3RyaW5nVHJhY2tlcn0gdGV4dCAtIFRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbmQgLSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWRkRUpTIC0gVGhlIHN0cmluZyB0byBhZGQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlanMuXG4gKiBAcmV0dXJucyBBIHN0cmluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENvbnZlcnRTeW50YXhNaW5pKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbmQ6IHN0cmluZywgYWRkRUpTOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBSYXpvclRvRUpTTWluaSh0ZXh0LmVxLCBmaW5kKTtcbiAgICBjb25zdCBidWlsZCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICBpZiAodmFsdWVzW2ldICE9IHZhbHVlc1tpICsgMV0pXG4gICAgICAgICAgICBidWlsZC5QbHVzKHRleHQuc3Vic3RyaW5nKHZhbHVlc1tpXSwgdmFsdWVzW2kgKyAxXSkpO1xuICAgICAgICBjb25zdCBzdWJzdHJpbmcgPSB0ZXh0LnN1YnN0cmluZyh2YWx1ZXNbaSArIDJdLCB2YWx1ZXNbaSArIDNdKTtcbiAgICAgICAgYnVpbGQuUGx1cyRgPCUke2FkZEVKU30ke3N1YnN0cmluZ30lPmA7XG4gICAgfVxuXG4gICAgYnVpbGQuUGx1cyh0ZXh0LnN1YnN0cmluZygodmFsdWVzLmF0KC0xKT8/LTEpICsgMSkpO1xuXG4gICAgcmV0dXJuIGJ1aWxkO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbmFsaXplQnVpbGQgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgSlNQYXJzZXIgZnJvbSAnLi9KU1BhcnNlcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuL1Nlc3Npb24nO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcblxuXG5leHBvcnQgY2xhc3MgUGFnZVRlbXBsYXRlIGV4dGVuZHMgSlNQYXJzZXIge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgQWRkUGFnZVRlbXBsYXRlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG5cbiAgICAgICAgdGV4dCA9IGF3YWl0IGZpbmFsaXplQnVpbGQodGV4dCwgc2Vzc2lvbkluZm8sIGZ1bGxQYXRoQ29tcGlsZSk7XG5cbiAgICAgICAgaWYgKHNlc3Npb25JbmZvLmRlYnVnKSB7XG4gICAgICAgICAgICB0ZXh0LkFkZFRleHRCZWZvcmVOb1RyYWNrKGB0cnkge1xcbmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKHNlc3Npb25JbmZvLmZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKHNlc3Npb25JbmZvLmZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWlyZSA9IChwKSA9PiBfcmVxdWlyZShfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHBhZ2UsIHApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGUgPSAocCwgd2l0aE9iamVjdCkgPT4gX2luY2x1ZGUoX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlLCBwLCB3aXRoT2JqZWN0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgICAgICAgICAgICB7IHNlbmRGaWxlLCB3cml0ZVNhZmUsIHdyaXRlLCBlY2hvLCBzZXRSZXNwb25zZSwgb3V0X3J1bl9zY3JpcHQsIHJ1bl9zY3JpcHRfbmFtZSwgUmVzcG9uc2UsIFJlcXVlc3QsIFBvc3QsIFF1ZXJ5LCBTZXNzaW9uLCBGaWxlcywgQ29va2llcywgUGFnZVZhciwgR2xvYmFsVmFyfSA9IHBhZ2UsXG5cbiAgICAgICAgICAgICAgICAgICAgcnVuX3NjcmlwdF9jb2RlID0gcnVuX3NjcmlwdF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyID0gKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCkgPT4gKG91dF9ydW5fc2NyaXB0ID0ge3RleHQ6ICcnfSwgX3RyYW5zZmVyKHAsIHByZXNlcnZlRm9ybSwgd2l0aE9iamVjdCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAge2ApO1xuXG5cblxuICAgICAgICBpZiAoc2Vzc2lvbkluZm8uZGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgXFxufVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0X2ZpbGUgPSBydW5fc2NyaXB0X25hbWUuc3BsaXQoLy0+fDxsaW5lPi8pLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBydW5fc2NyaXB0X25hbWUgKz0gJyAtPiA8bGluZT4nICsgZS5zdGFjay5zcGxpdCgvXFxcXG4oICkqYXQgLylbMl07XG4gICAgICAgICAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gJyR7UGFnZVRlbXBsYXRlLnByaW50RXJyb3IoYDxwPkVycm9yIHBhdGg6ICcgKyBydW5fc2NyaXB0X25hbWUucmVwbGFjZSgvPGxpbmU+L2dpLCAnPGJyLz4nKSArICc8L3A+PHA+RXJyb3IgbWVzc2FnZTogJyArIGUubWVzc2FnZSArICc8L3A+YCl9JztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXRoOiBcIiArIHJ1bl9zY3JpcHRfbmFtZS5zbGljZSgwLCAtbGFzdF9maWxlLmxlbmd0aCkucmVwbGFjZSgvPGxpbmU+L2dpLCAnXFxcXG4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMoQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgpfVwiICsgbGFzdF9maWxlLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBtZXNzYWdlOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBydW5uaW5nIHRoaXMgY29kZTogXFxcXFwiXCIgKyBydW5fc2NyaXB0X2NvZGUgKyAnXCInKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN0YWNrOiBcIiArIGUuc3RhY2spO1xuICAgICAgICAgICAgICAgIH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjayhgfX0pO31gKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgQnVpbGRQYWdlKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgICAgIGNvbnN0IGJ1aWx0Q29kZSA9IGF3YWl0IFBhZ2VUZW1wbGF0ZS5SdW5BbmRFeHBvcnQodGV4dCwgc2Vzc2lvbkluZm8uZnVsbFBhdGgsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgICAgICByZXR1cm4gUGFnZVRlbXBsYXRlLkFkZFBhZ2VUZW1wbGF0ZShidWlsdENvZGUsIGZ1bGxQYXRoQ29tcGlsZSwgc2Vzc2lvbkluZm8pO1xuICAgIH1cblxuICAgIHN0YXRpYyBBZGRBZnRlckJ1aWxkKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAgICAgIHRleHQuQWRkVGV4dEJlZm9yZU5vVHJhY2soXCJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBJblBhZ2VUZW1wbGF0ZSh0ZXh0OiBTdHJpbmdUcmFja2VyLCBkYXRhT2JqZWN0OiBhbnksIGZ1bGxQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dC5BZGRUZXh0QmVmb3JlTm9UcmFjayhgPCUhe1xuICAgICAgICAgICAgY29uc3QgX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHsuLi5fcGFnZSR7ZGF0YU9iamVjdCA/ICcsJyArIGRhdGFPYmplY3QgOiAnJ319O1xuICAgICAgICAgICAgY29uc3QgX19maWxlbmFtZSA9IFwiJHtKU1BhcnNlci5maXhUZXh0U2ltcGxlUXVvdGVzKGZ1bGxQYXRoKX1cIiwgX19kaXJuYW1lID0gXCIke0pTUGFyc2VyLmZpeFRleHRTaW1wbGVRdW90ZXMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSl9XCI7XG4gICAgICAgICAgICBjb25zdCByZXF1aXJlID0gKHApID0+IF9yZXF1aXJlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCk7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlID0gKHAsIHdpdGhPYmplY3QpID0+IF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSwgcCwgd2l0aE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2ZlciA9IChwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QpID0+IChvdXRfcnVuX3NjcmlwdCA9IHt0ZXh0OiAnJ30sIF90cmFuc2ZlcihwLCBwcmVzZXJ2ZUZvcm0sIHdpdGhPYmplY3QsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgcGFnZSkpO1xuICAgICAgICAgICAgICAgIHslPmApO1xuXG4gICAgICAgIHRleHQuQWRkVGV4dEFmdGVyTm9UcmFjaygnPCUhfX19JT4nKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IFJhem9yU3ludGF4IGZyb20gJy4vUmF6b3JTeW50YXgnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdldFN5bnRheChDb21waWxlVHlwZTogYW55KSB7XG4gICAgbGV0IGZ1bmM6IGFueTtcbiAgICBzd2l0Y2ggKENvbXBpbGVUeXBlLm5hbWUgfHwgQ29tcGlsZVR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlJhem9yXCI6XG4gICAgICAgICAgICBmdW5jID0gUmF6b3JTeW50YXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59IiwgImltcG9ydCBBZGRTeW50YXggZnJvbSAnLi9TeW50YXgvSW5kZXgnO1xuaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZFBsdWdpbiB7XG5cdHB1YmxpYyBTZXR0aW5nc09iamVjdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoU2V0dGluZ3NPYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgICAgIHRoaXMuU2V0dGluZ3NPYmplY3QgPSBTZXR0aW5nc09iamVjdFxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRlZmF1bHRTeW50YXgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2V0dGluZ3NPYmplY3QuQmFzaWNDb21waWxhdGlvblN5bnRheC5jb25jYXQodGhpcy5TZXR0aW5nc09iamVjdC5BZGRDb21waWxlU3ludGF4KTtcbiAgICB9XG5cbiAgICBhc3luYyBCdWlsZEJhc2ljKHRleHQ6IFN0cmluZ1RyYWNrZXIsIE9EYXRhOnN0cmluZyB8YW55LCBwYXRoOnN0cmluZywgcGF0aE5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IFNlc3Npb25CdWlsZCkge1xuXG4gICAgICAgIC8vYWRkIFN5bnRheFxuXG4gICAgICAgIGlmICghT0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KE9EYXRhKSkge1xuICAgICAgICAgICAgT0RhdGEgPSBbT0RhdGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIE9EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBTeW50YXggPSBhd2FpdCBBZGRTeW50YXgoaSk7XG5cbiAgICAgICAgICAgIGlmIChTeW50YXgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gYXdhaXQgU3ludGF4KHRleHQsIGksIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHBsdWdpbnMgZm9yIHBhZ2VzXG4gICAgICogQHBhcmFtIHRleHQgYWxsIHRoZSBjb2RlXG4gICAgICogQHBhcmFtIHBhdGggZmlsZSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSBwYXRoTmFtZSBmaWxlIGxvY2F0aW9uIHdpdGhvdXQgc3RhcnQgZm9sZGVyIChzbWFsbCBwYXRoKVxuICAgICAqIEByZXR1cm5zIGNvbXBpbGVkIGNvZGVcbiAgICAgKi9cbiAgICBhc3luYyBCdWlsZFBhZ2UodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgcGx1Z2lucyBmb3IgY29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB0ZXh0IGFsbCB0aGUgY29kZVxuICAgICAqIEBwYXJhbSBwYXRoIGZpbGUgbG9jYXRpb25cbiAgICAgKiBAcGFyYW0gcGF0aE5hbWUgZmlsZSBsb2NhdGlvbiB3aXRob3V0IHN0YXJ0IGZvbGRlciAoc21hbGwgcGF0aClcbiAgICAgKiBAcmV0dXJucyBjb21waWxlZCBjb2RlXG4gICAgICovXG4gICAgYXN5bmMgQnVpbGRDb21wb25lbnQodGV4dDogU3RyaW5nVHJhY2tlciwgcGF0aDogc3RyaW5nLCBwYXRoTmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxTdHJpbmdUcmFja2VyPntcbiAgICAgICAgdGV4dCA9IGF3YWl0IHRoaXMuQnVpbGRCYXNpYyh0ZXh0LCB0aGlzLmRlZmF1bHRTeW50YXgsIHBhdGgsIHBhdGhOYW1lLCBzZXNzaW9uSW5mbyk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn0iLCAiLy9nbG9iYWwgc2V0dGluZ3MgZm9yIGJ1aWxkIGluIGNvbXBvbmVudHNcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0ge1xuICAgIHBsdWdpbnM6IFtdXG59OyIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi9JbnNlcnRDb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZVRlbXBsYXRlIH0gZnJvbSAnLi9TY3JpcHRUZW1wbGF0ZSc7XG5pbXBvcnQgQWRkUGx1Z2luIGZyb20gJy4uL1BsdWdpbnMvSW5kZXgnO1xuaW1wb3J0IHsgQ3JlYXRlRmlsZVBhdGgsIFBhcnNlRGVidWdMaW5lLCBBZGREZWJ1Z0luZm8gfSBmcm9tICcuL1hNTEhlbHBlcnMvQ29kZUluZm9BbmREZWJ1Zyc7XG5pbXBvcnQgKiBhcyBleHRyaWNhdGUgZnJvbSAnLi9YTUxIZWxwZXJzL0V4dHJpY2F0ZSc7XG5pbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgQnVpbGRTY3JpcHQgZnJvbSAnLi90cmFuc2Zvcm0vU2NyaXB0JztcbmltcG9ydCB7IFNldHRpbmdzIGFzIEJ1aWxkU2NyaXB0U2V0dGluZ3MgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cy9TZXR0aW5ncyc7XG5pbXBvcnQgUGFyc2VCYXNlUGFnZSBmcm9tICcuL0NvbXBpbGVTY3JpcHQvUGFnZUJhc2UnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi9TZXNzaW9uJztcblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzID0geyBBZGRDb21waWxlU3ludGF4OiBbXSwgcGx1Z2luczogW10sIEJhc2ljQ29tcGlsYXRpb25TeW50YXg6IFsnUmF6b3InXSB9O1xuY29uc3QgUGx1Z2luQnVpbGQgPSBuZXcgQWRkUGx1Z2luKFNldHRpbmdzKTtcbmV4cG9ydCBjb25zdCBDb21wb25lbnRzID0gbmV3IEluc2VydENvbXBvbmVudChQbHVnaW5CdWlsZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRQbHVnaW4obmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFNldHRpbmdzLnBsdWdpbnMuZmluZChiID0+IGIgPT0gbmFtZSB8fCAoPGFueT5iKT8ubmFtZSA9PSBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNvbWVQbHVnaW5zKC4uLmRhdGE6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGRhdGEuc29tZSh4ID0+IEdldFBsdWdpbih4KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RzKCkge1xuICAgIHJldHVybiBTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4LmluY2x1ZGVzKCdUeXBlU2NyaXB0Jyk7XG59XG5cbkNvbXBvbmVudHMuTWljcm9QbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcbkNvbXBvbmVudHMuR2V0UGx1Z2luID0gR2V0UGx1Z2luO1xuQ29tcG9uZW50cy5Tb21lUGx1Z2lucyA9IFNvbWVQbHVnaW5zO1xuQ29tcG9uZW50cy5pc1RzID0gaXNUcztcblxuQnVpbGRTY3JpcHRTZXR0aW5ncy5wbHVnaW5zID0gU2V0dGluZ3MucGx1Z2lucztcblxuYXN5bmMgZnVuY3Rpb24gb3V0UGFnZShkYXRhOiBTdHJpbmdUcmFja2VyLCBzY3JpcHRGaWxlOiBTdHJpbmdUcmFja2VyLCBwYWdlUGF0aDogc3RyaW5nLCBwYWdlTmFtZTogc3RyaW5nLCBMYXN0U21hbGxQYXRoOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+IHtcblxuICAgIGNvbnN0IGJhc2VEYXRhID0gbmV3IFBhcnNlQmFzZVBhZ2UoZGF0YSwgaXNUcygpKTtcbiAgICBhd2FpdCBiYXNlRGF0YS5sb2FkU2V0dGluZ3Moc2Vzc2lvbkluZm8sIHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBwYWdlTmFtZSk7XG5cbiAgICBjb25zdCBtb2RlbE5hbWUgPSBiYXNlRGF0YS5wb3BBbnkoJ21vZGVsJyk/LmVxO1xuXG4gICAgaWYgKCFtb2RlbE5hbWUpIHJldHVybiBzY3JpcHRGaWxlLlBsdXMoYmFzZURhdGEuc2NyaXB0RmlsZSwgYmFzZURhdGEuY2xlYXJEYXRhKTtcbiAgICBkYXRhID0gYmFzZURhdGEuY2xlYXJEYXRhO1xuXG4gICAgLy9pbXBvcnQgbW9kZWxcbiAgICBjb25zdCB7IFNtYWxsUGF0aCwgRnVsbFBhdGggfSA9IENyZWF0ZUZpbGVQYXRoKHBhZ2VQYXRoLCBMYXN0U21hbGxQYXRoLCBtb2RlbE5hbWUsICdNb2RlbHMnLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5tb2RlbCk7IC8vIGZpbmQgbG9jYXRpb24gb2YgdGhlIGZpbGVcblxuICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVsbFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IEVycm9yTWVzc2FnZSA9IGBFcnJvciBtb2RlbCBub3QgZm91bmQgLT4gJHttb2RlbE5hbWV9IGF0IHBhZ2UgJHtwYWdlTmFtZX1gO1xuXG4gICAgICAgIHByaW50LmVycm9yKEVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcihkYXRhLkRlZmF1bHRJbmZvVGV4dCwgUGFnZVRlbXBsYXRlLnByaW50RXJyb3IoRXJyb3JNZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc2Vzc2lvbkluZm8uZGVwZW5kZW5jZShTbWFsbFBhdGgsIEZ1bGxQYXRoKTsgLy8gY2hlY2sgcGFnZSBjaGFuZ2VkIGRhdGUsIGZvciBkZXBlbmRlbmNlT2JqZWN0XG5cbiAgICBjb25zdCBiYXNlTW9kZWxEYXRhID0gYXdhaXQgQWRkRGVidWdJbmZvKHBhZ2VOYW1lLCBGdWxsUGF0aCwgU21hbGxQYXRoKTsgLy8gcmVhZCBtb2RlbFxuICAgIGxldCBtb2RlbERhdGEgPSBQYXJzZUJhc2VQYWdlLnJlYnVpbGRCYXNlSW5oZXJpdGFuY2UoYmFzZU1vZGVsRGF0YS5hbGxEYXRhKTtcblxuICAgIHNlc3Npb25JbmZvLmRlYnVnICYmIG1vZGVsRGF0YS5BZGRUZXh0QmVmb3JlTm9UcmFjayhiYXNlTW9kZWxEYXRhLnN0cmluZ0luZm8pO1xuXG4gICAgcGFnZU5hbWUgKz0gXCIgLT4gXCIgKyBTbWFsbFBhdGg7XG5cbiAgICAvL0dldCBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBhbGxEYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdlcyhtb2RlbERhdGEsIFsnJ10sICc6JywgZmFsc2UsIHRydWUpO1xuXG4gICAgaWYgKGFsbERhdGEuZXJyb3IpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciB3aXRoaW4gbW9kZWwgLT5cIiwgbW9kZWxOYW1lLCBcImF0IHBhZ2U6IFwiLCBwYWdlTmFtZSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1vZGVsRGF0YSA9IGFsbERhdGEuZGF0YTtcbiAgICBjb25zdCB0YWdBcnJheSA9IGFsbERhdGEuZm91bmQubWFwKHggPT4geC50YWcuc3Vic3RyaW5nKDEpKTtcbiAgICBjb25zdCBvdXREYXRhID0gZXh0cmljYXRlLmdldERhdGFUYWdlcyhkYXRhLCB0YWdBcnJheSwgJ0AnKTtcblxuICAgIGlmIChvdXREYXRhLmVycm9yKSB7XG4gICAgICAgIHByaW50LmVycm9yKFwiRXJyb3IgV2l0aCBtb2RlbCAtPlwiLCBtb2RlbE5hbWUsIFwiYXQgcGFnZTogXCIsIHBhZ2VOYW1lKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy9CdWlsZCBXaXRoIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1vZGVsQnVpbGQgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIGFsbERhdGEuZm91bmQpIHtcbiAgICAgICAgaS50YWcgPSBpLnRhZy5zdWJzdHJpbmcoMSk7IC8vIHJlbW92aW5nIHRoZSAnOidcbiAgICAgICAgY29uc3QgaG9sZGVyRGF0YSA9IG91dERhdGEuZm91bmQuZmluZCgoZSkgPT4gZS50YWcgPT0gJ0AnICsgaS50YWcpO1xuXG4gICAgICAgIG1vZGVsQnVpbGQuUGx1cyhtb2RlbERhdGEuc3Vic3RyaW5nKDAsIGkubG9jKSk7XG4gICAgICAgIG1vZGVsRGF0YSA9IG1vZGVsRGF0YS5zdWJzdHJpbmcoaS5sb2MpO1xuXG4gICAgICAgIGlmIChob2xkZXJEYXRhKSB7XG4gICAgICAgICAgICBtb2RlbEJ1aWxkLlBsdXMoaG9sZGVyRGF0YS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHsgLy8gVHJ5IGxvYWRpbmcgZGF0YSBmcm9tIHBhZ2UgYmFzZVxuICAgICAgICAgICAgY29uc3QgbG9hZEZyb21CYXNlID0gYmFzZURhdGEuZ2V0KGkudGFnKTtcblxuICAgICAgICAgICAgaWYgKGxvYWRGcm9tQmFzZSAmJiBsb2FkRnJvbUJhc2UuZXEudG9Mb3dlckNhc2UoKSAhPSAnaW5oZXJpdCcpXG4gICAgICAgICAgICAgICAgbW9kZWxCdWlsZC5QbHVzKGxvYWRGcm9tQmFzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbEJ1aWxkLlBsdXMobW9kZWxEYXRhKTtcblxuICAgIHJldHVybiBhd2FpdCBvdXRQYWdlKG1vZGVsQnVpbGQsIHNjcmlwdEZpbGUuUGx1cyhiYXNlRGF0YS5zY3JpcHRGaWxlKSwgRnVsbFBhdGgsIHBhZ2VOYW1lLCBTbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEluc2VydChkYXRhOiBzdHJpbmcsIGZ1bGxQYXRoQ29tcGlsZTogc3RyaW5nLCBuZXN0ZWRQYWdlOiBib29sZWFuLCBuZXN0ZWRQYWdlRGF0YTogc3RyaW5nLCBzZXNzaW9uSW5mbzogU2Vzc2lvbkJ1aWxkKSB7XG4gICAgbGV0IERlYnVnU3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoc2Vzc2lvbkluZm8uc21hbGxQYXRoLCBkYXRhKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IG91dFBhZ2UoRGVidWdTdHJpbmcsIG5ldyBTdHJpbmdUcmFja2VyKERlYnVnU3RyaW5nLkRlZmF1bHRJbmZvVGV4dCksIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCwgc2Vzc2lvbkluZm8pO1xuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQbHVnaW5CdWlsZC5CdWlsZFBhZ2UoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmZ1bGxQYXRoLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IENvbXBvbmVudHMuSW5zZXJ0KERlYnVnU3RyaW5nLCBzZXNzaW9uSW5mby5zbWFsbFBhdGgsIHNlc3Npb25JbmZvKTsgLy8gYWRkIGNvbXBvbmVudHNcblxuICAgIERlYnVnU3RyaW5nID0gYXdhaXQgUGFyc2VEZWJ1Z0xpbmUoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLnNtYWxsUGF0aCk7XG5cbiAgICBpZiAobmVzdGVkUGFnZSkgeyAvLyByZXR1cm4gU3RyaW5nVHJhY2tlciwgYmVjYXVzZSB0aGlzIGltcG9ydCB3YXMgZnJvbSBwYWdlXG4gICAgICAgIHJldHVybiBQYWdlVGVtcGxhdGUuSW5QYWdlVGVtcGxhdGUoRGVidWdTdHJpbmcsIG5lc3RlZFBhZ2VEYXRhLCBzZXNzaW9uSW5mby5mdWxsUGF0aCk7XG4gICAgfVxuXG4gICAgRGVidWdTdHJpbmcgPSBhd2FpdCBQYWdlVGVtcGxhdGUuQnVpbGRQYWdlKERlYnVnU3RyaW5nLCBmdWxsUGF0aENvbXBpbGUsIHNlc3Npb25JbmZvKTtcbiAgICBEZWJ1Z1N0cmluZyA9IGF3YWl0IHNlc3Npb25JbmZvLkJ1aWxkU2NyaXB0V2l0aFByYW1zKERlYnVnU3RyaW5nKTtcbiAgICBEZWJ1Z1N0cmluZz0gUGFnZVRlbXBsYXRlLkFkZEFmdGVyQnVpbGQoRGVidWdTdHJpbmcsIHNlc3Npb25JbmZvLmRlYnVnKTtcblxuICAgIHJldHVybiBEZWJ1Z1N0cmluZztcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCdWlsZEpTLCBCdWlsZEpTWCwgQnVpbGRUUywgQnVpbGRUU1ggfSBmcm9tICcuL0ZvclN0YXRpYy9TY3JpcHQnO1xuaW1wb3J0IEJ1aWxkU3ZlbHRlIGZyb20gJy4vRm9yU3RhdGljL1N2ZWx0ZS9jbGllbnQnO1xuaW1wb3J0IHsgQnVpbGRTdHlsZVNhc3MgfSBmcm9tICcuL0ZvclN0YXRpYy9TdHlsZSc7XG5pbXBvcnQgeyBnZXRUeXBlcywgU3lzdGVtRGF0YSwgZ2V0RGlybmFtZSwgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFJlc3BvbnNlLCBSZXF1ZXN0IH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBHZXRQbHVnaW4gfSBmcm9tICcuLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwcm9tcHRseSBmcm9tICdwcm9tcHRseSc7XG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgU3RvcmVKU09OIGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlSlNPTic7XG5cbmNvbnN0IFN1cHBvcnRlZFR5cGVzID0gWydqcycsICdzdmVsdGUnLCAndHMnLCAnanN4JywgJ3RzeCcsICdjc3MnLCAnc2FzcycsICdzY3NzJ107XG5cbmNvbnN0IFN0YXRpY0ZpbGVzSW5mbyA9IG5ldyBTdG9yZUpTT04oJ1N0YXRpY0ZpbGVzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIENoZWNrRGVwZW5kZW5jeUNoYW5nZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvID0gU3RhdGljRmlsZXNJbmZvLnN0b3JlW3BhdGhdO1xuXG4gICAgZm9yIChjb25zdCBpIGluIG8pIHtcbiAgICAgICAgbGV0IHAgPSBpO1xuXG4gICAgICAgIGlmIChpID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIHAgPSBnZXRUeXBlcy5TdGF0aWNbMl0gKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRmlsZVBhdGggPSBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHA7XG4gICAgICAgIGlmIChhd2FpdCBFYXN5RnMuc3RhdChGaWxlUGF0aCwgJ210aW1lTXMnLCB0cnVlKSAhPSBvW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAhbztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZEZpbGUoU21hbGxQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4sIGZ1bGxDb21waWxlUGF0aD86IHN0cmluZykge1xuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShTbWFsbFBhdGgpLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBzd2l0Y2ggKGV4dCkge1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTKFNtYWxsUGF0aCwgaXNEZWJ1Zyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHMnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRUUyhTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZEpTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RzeCc6XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMgPSBhd2FpdCBCdWlsZFRTWChTbWFsbFBhdGgsIGlzRGVidWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIGNhc2UgJ3Nhc3MnOlxuICAgICAgICBjYXNlICdzY3NzJzpcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA9IGF3YWl0IEJ1aWxkU3R5bGVTYXNzKFNtYWxsUGF0aCwgZXh0LCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmVsdGUnOlxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzID0gYXdhaXQgQnVpbGRTdmVsdGUoU21hbGxQYXRoLCBpc0RlYnVnKTtcbiAgICAgICAgICAgIGZ1bGxDb21waWxlUGF0aCArPSAnLmpzJztcbiAgICB9XG5cbiAgICBpZiAoaXNEZWJ1ZyAmJiBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsQ29tcGlsZVBhdGgpKSB7XG4gICAgICAgIFN0YXRpY0ZpbGVzSW5mby51cGRhdGUoU21hbGxQYXRoLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGVidWcpXG4gICAgICAgIHJldHVybiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgYnVpbGRJbiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICBleHQ/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGluU2VydmVyPzogc3RyaW5nO1xufVxuXG5jb25zdCBzdGF0aWNGaWxlcyA9IFN5c3RlbURhdGEgKyAnLy4uL3N0YXRpYy9jbGllbnQvJztcbmNvbnN0IGdldFN0YXRpYzogYnVpbGRJbltdID0gW3tcbiAgICBwYXRoOiBcInNlcnYvdGVtcC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcImJ1aWxkVGVtcGxhdGUuanNcIlxufSxcbntcbiAgICBwYXRoOiBcInNlcnYvY29ubmVjdC5qc1wiLFxuICAgIHR5cGU6IFwianNcIixcbiAgICBpblNlcnZlcjogc3RhdGljRmlsZXMgKyBcIm1ha2VDb25uZWN0aW9uLmpzXCJcbn1dO1xuXG5jb25zdCBnZXRTdGF0aWNGaWxlc1R5cGU6IGJ1aWxkSW5bXSA9IFt7XG4gICAgZXh0OiAnLnB1Yi5qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLm1qcycsXG4gICAgdHlwZTogJ2pzJ1xufSxcbntcbiAgICBleHQ6ICcucHViLmNzcycsXG4gICAgdHlwZTogJ2Nzcydcbn1dO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXJCdWlsZEJ5VHlwZShSZXF1ZXN0OiBSZXF1ZXN0LCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgY29uc3QgZm91bmQgPSBnZXRTdGF0aWNGaWxlc1R5cGUuZmluZCh4ID0+IGZpbGVQYXRoLmVuZHNXaXRoKHguZXh0KSk7XG5cbiAgICBpZiAoIWZvdW5kKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGNvbnN0IGJhc2VQYXRoID0gUmVxdWVzdC5xdWVyeS50ID09ICdsJyA/IGdldFR5cGVzLkxvZ3NbMV0gOiBnZXRUeXBlcy5TdGF0aWNbMV07XG4gICAgY29uc3QgaW5TZXJ2ZXIgPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGlmIChjaGVja2VkIHx8IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGluU2VydmVyKSlcbiAgICAgICAgcmV0dXJuIHsgLi4uZm91bmQsIGluU2VydmVyIH07XG59XG5cbmxldCBkZWJ1Z2dpbmdXaXRoU291cmNlOiBudWxsIHwgYm9vbGVhbiA9IG51bGw7XG5cbmlmIChhcmd2LmluY2x1ZGVzKCdhbGxvd1NvdXJjZURlYnVnJykpXG4gICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IHRydWU7XG5hc3luYyBmdW5jdGlvbiBhc2tEZWJ1Z2dpbmdXaXRoU291cmNlKCkge1xuICAgIGlmICh0eXBlb2YgZGVidWdnaW5nV2l0aFNvdXJjZSA9PSAnYm9vbGVhbicpXG4gICAgICAgIHJldHVybiBkZWJ1Z2dpbmdXaXRoU291cmNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWdnaW5nV2l0aFNvdXJjZSA9IChhd2FpdCBwcm9tcHRseS5wcm9tcHQoXG4gICAgICAgICAgICAnQWxsb3cgZGVidWdnaW5nIEphdmFTY3JpcHQvQ1NTIGluIHNvdXJjZSBwYWdlPyAtIGV4cG9zaW5nIHlvdXIgc291cmNlIGNvZGUgKG5vKScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKHY6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWyd5ZXMnLCAnbm8nXS5pbmNsdWRlcyh2LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3llcyBvciBubycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwXG4gICAgICAgICAgICB9XG4gICAgICAgICkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09ICd5ZXMnO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB9IGNhdGNoIHsgfVxuXG5cbiAgICByZXR1cm4gZGVidWdnaW5nV2l0aFNvdXJjZTtcbn1cblxuY29uc3Qgc2FmZUZvbGRlcnMgPSBbZ2V0VHlwZXMuU3RhdGljWzJdLCBnZXRUeXBlcy5Mb2dzWzJdLCAnTW9kZWxzJywgJ0NvbXBvbmVudHMnXTtcbi8qKlxuICogSWYgdGhlIHVzZXIgaXMgaW4gZGVidWcgbW9kZSwgYW5kIHRoZSBmaWxlIGlzIGEgc291cmNlIGZpbGUsIGFuZCB0aGUgdXNlciBjb21tZW5kIGxpbmUgYXJndW1lbnQgaGF2ZSBhbGxvd1NvdXJjZURlYnVnXG4gKiB0aGVuIHJldHVybiB0aGUgZnVsbCBwYXRoIHRvIHRoZSBmaWxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBpcyB0aGUgY3VycmVudCBwYWdlIGEgZGVidWcgcGFnZT9cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRoYXQgd2FzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSBJZiB0aGlzIHBhdGggYWxyZWFkeSBiZWVuIGNoZWNrZWRcbiAqIHRoZSBmaWxlLlxuICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGZpbGUgYW5kIHRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bnNhZmVEZWJ1Zyhpc0RlYnVnOiBib29sZWFuLCBmaWxlUGF0aDogc3RyaW5nLCBjaGVja2VkOiBib29sZWFuKSB7XG4gICAgaWYgKCFpc0RlYnVnIHx8IEdldFBsdWdpbihcIlNhZmVEZWJ1Z1wiKSB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpICE9ICcuc291cmNlJyB8fCAhc2FmZUZvbGRlcnMuaW5jbHVkZXMoZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykuc2hpZnQoKSkgfHwgIWF3YWl0IGFza0RlYnVnZ2luZ1dpdGhTb3VyY2UoKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSA3KSk7IC8vIHJlbW92aW5nICcuc291cmNlJ1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgaW5TZXJ2ZXI6IGZ1bGxQYXRoXG4gICAgICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN2ZWx0ZVN0eWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlRmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGVuZ3RoIC0gNCk7IC8vIHJlbW92aW5nICcuY3NzJ1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgZmlsZVBhdGg7XG5cbiAgICBsZXQgZXhpc3RzOiBib29sZWFuO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoYmFzZUZpbGVQYXRoKSA9PSAnLnN2ZWx0ZScgJiYgKGNoZWNrZWQgfHwgKGV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZ1bGxQYXRoKSkpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBpblNlcnZlcjogZnVsbFBhdGhcbiAgICAgICAgfVxuXG4gICAgaWYgKGlzRGVidWcgJiYgIWV4aXN0cykge1xuICAgICAgICBhd2FpdCBCdWlsZEZpbGUoYmFzZUZpbGVQYXRoLCBpc0RlYnVnLCBnZXRUeXBlcy5TdGF0aWNbMV0gKyBiYXNlRmlsZVBhdGgpXG4gICAgICAgIHJldHVybiBzdmVsdGVTdHlsZShmaWxlUGF0aCwgY2hlY2tlZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3ZlbHRlU3RhdGljKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvc3ZlbHRlLycpKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZyg0KSArIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID8gJycgOiAnL2luZGV4Lm1qcycpO1xuXG4gICAgaWYgKGNoZWNrZWQgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhdGgpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2pzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duQ29kZVRoZW1lKGZpbGVQYXRoOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIWZpbGVQYXRoLnN0YXJ0c1dpdGgoJ3NlcnYvbWQvY29kZS10aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzJyArIGZpbGVQYXRoLnN1YnN0cmluZygxOCk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVGhlbWUoZmlsZVBhdGg6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAgIGlmICghZmlsZVBhdGguc3RhcnRzV2l0aCgnc2Vydi9tZC90aGVtZS8nKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGZpbGVOYW1lID0gZmlsZVBhdGguc3Vic3RyaW5nKDE0KTtcbiAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXV0bycpKVxuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyg0KVxuICAgIGVsc2VcbiAgICAgICAgZmlsZU5hbWUgPSAnLScgKyBmaWxlTmFtZTtcblxuXG4gICAgY29uc3QgZnVsbFBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bicgKyBmaWxlTmFtZS5yZXBsYWNlKCcuY3NzJywgJy5taW4uY3NzJyk7XG5cbiAgICBpZiAoY2hlY2tlZCB8fCBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY3NzJyxcbiAgICAgICAgICAgIGluU2VydmVyOiBmdWxsUGF0aFxuICAgICAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlckJ1aWxkKFJlcXVlc3Q6IFJlcXVlc3QsIGlzRGVidWc6IGJvb2xlYW4sIHBhdGg6IHN0cmluZywgY2hlY2tlZCA9IGZhbHNlKTogUHJvbWlzZTxudWxsIHwgYnVpbGRJbj4ge1xuICAgIHJldHVybiBhd2FpdCBzdmVsdGVTdGF0aWMocGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc3ZlbHRlU3R5bGUocGF0aCwgY2hlY2tlZCwgaXNEZWJ1ZykgfHxcbiAgICAgICAgYXdhaXQgdW5zYWZlRGVidWcoaXNEZWJ1ZywgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgc2VydmVyQnVpbGRCeVR5cGUoUmVxdWVzdCwgcGF0aCwgY2hlY2tlZCkgfHxcbiAgICAgICAgYXdhaXQgbWFya2Rvd25UaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBhd2FpdCBtYXJrZG93bkNvZGVUaGVtZShwYXRoLCBjaGVja2VkKSB8fFxuICAgICAgICBnZXRTdGF0aWMuZmluZCh4ID0+IHgucGF0aCA9PSBwYXRoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYnVpbGRGaWxlKFNtYWxsUGF0aDogc3RyaW5nLCBmdWxsQ29tcGlsZVBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiBhd2FpdCBCdWlsZEZpbGUoU21hbGxQYXRoLCBpc0RlYnVnLCBmdWxsQ29tcGlsZVBhdGgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0RmlsZShTbWFsbFBhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgUmVxdWVzdDogUmVxdWVzdCwgUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgLy9maWxlIGJ1aWx0IGluXG4gICAgY29uc3QgaXNCdWlsZEluID0gYXdhaXQgc2VydmVyQnVpbGQoUmVxdWVzdCwgaXNEZWJ1ZywgU21hbGxQYXRoLCB0cnVlKTtcblxuICAgIGlmIChpc0J1aWxkSW4pIHtcbiAgICAgICAgUmVzcG9uc2UudHlwZShpc0J1aWxkSW4udHlwZSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZChhd2FpdCBFYXN5RnMucmVhZEZpbGUoaXNCdWlsZEluLmluU2VydmVyKSk7IC8vIHNlbmRpbmcgdGhlIGZpbGVcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vY29tcGlsZWQgZmlsZXNcbiAgICBjb25zdCBmdWxsQ29tcGlsZVBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMV0gKyBTbWFsbFBhdGg7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBTbWFsbFBhdGg7XG5cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoU21hbGxQYXRoKS5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmICghU3VwcG9ydGVkVHlwZXMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICBSZXNwb25zZS5zZW5kRmlsZShmdWxsUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10uaW5jbHVkZXMoZXh0KSkgeyAvLyBhZGRpbmcgdHlwZVxuICAgICAgICBSZXNwb25zZS50eXBlKCdjc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBSZXNwb25zZS50eXBlKCdqcycpO1xuICAgIH1cblxuICAgIGxldCByZXNQYXRoID0gZnVsbENvbXBpbGVQYXRoO1xuXG4gICAgLy8gcmUtY29tcGlsaW5nIGlmIG5lY2Vzc2FyeSBvbiBkZWJ1ZyBtb2RlXG4gICAgaWYgKGlzRGVidWcgJiYgKFJlcXVlc3QucXVlcnkuc291cmNlID09ICd0cnVlJyB8fCBhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoU21hbGxQYXRoKSAmJiAhYXdhaXQgQnVpbGRGaWxlKFNtYWxsUGF0aCwgaXNEZWJ1ZywgZnVsbENvbXBpbGVQYXRoKSkpIHtcbiAgICAgICAgcmVzUGF0aCA9IGZ1bGxQYXRoO1xuICAgIH0gZWxzZSBpZiAoZXh0ID09ICdzdmVsdGUnKVxuICAgICAgICByZXNQYXRoICs9ICcuanMnO1xuXG4gICAgUmVzcG9uc2UuZW5kKGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHJlc1BhdGgsICd1dGY4JykpOyAvLyBzZW5kaW5nIHRoZSBmaWxlXG59IiwgImltcG9ydCB7IFNvbWVQbHVnaW5zLCBHZXRQbHVnaW4gfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRNb2RlbHMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtIH0gZnJvbSAnZXNidWlsZC13YXNtJztcbmltcG9ydCB7IGdldFR5cGVzIH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgRVNCdWlsZFByaW50RXJyb3IsIEVTQnVpbGRQcmludFdhcm5pbmdzIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvZXNidWlsZC9wcmludE1lc3NhZ2UnO1xuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFNjcmlwdChpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBtb3JlT3B0aW9ucz86IFRyYW5zZm9ybU9wdGlvbnMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuICAgIGNvbnN0IEFkZE9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZWZpbGU6IGlucHV0UGF0aCArICc/c291cmNlPXRydWUnLFxuICAgICAgICBzb3VyY2VtYXA6IGlzRGVidWcgPyAnaW5saW5lJzogZmFsc2UsXG4gICAgICAgIG1pbmlmeTogU29tZVBsdWdpbnMoXCJNaW5cIiArIHR5cGUudG9VcHBlckNhc2UoKSkgfHwgU29tZVBsdWdpbnMoXCJNaW5BbGxcIiksXG4gICAgICAgIC4uLkdldFBsdWdpbihcInRyYW5zZm9ybU9wdGlvbnNcIiksIC4uLm1vcmVPcHRpb25zXG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjb2RlLCB3YXJuaW5ncyB9ID0gYXdhaXQgdHJhbnNmb3JtKHJlc3VsdCwgQWRkT3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdCA9IGNvZGU7XG4gICAgICAgIEVTQnVpbGRQcmludFdhcm5pbmdzKHdhcm5pbmdzLCBmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIEVTQnVpbGRQcmludEVycm9yKGVyciwgZnVsbFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkSlMoaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanMnLCBpc0RlYnVnLCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRUUyhpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0cycsIGlzRGVidWcsIHsgbG9hZGVyOiAndHMnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRKU1goaW5TdGF0aWNQYXRoOiBzdHJpbmcsIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gQnVpbGRTY3JpcHQoaW5TdGF0aWNQYXRoLCAnanN4JywgaXNEZWJ1ZywgeyAuLi4oR2V0UGx1Z2luKFwiSlNYT3B0aW9uc1wiKSA/PyB7fSksIGxvYWRlcjogJ2pzeCcgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZFRTWChpblN0YXRpY1BhdGg6IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbikge1xuICAgIHJldHVybiBCdWlsZFNjcmlwdChpblN0YXRpY1BhdGgsICd0c3gnLCBpc0RlYnVnLCB7IGxvYWRlcjogJ3RzeCcsIC4uLihHZXRQbHVnaW4oXCJUU1hPcHRpb25zXCIpID8/IHt9KSB9KTtcbn1cbiIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gXCIuLi8uLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgc3ZlbHRlIGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcIi4vcHJlcHJvY2Vzc1wiO1xuaW1wb3J0IHsgU29tZVBsdWdpbnMgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tIFwiZXNidWlsZC13YXNtXCI7XG5pbXBvcnQgRWFzeUZzIGZyb20gXCIuLi8uLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnNcIjtcbmltcG9ydCB7IEVTQnVpbGRQcmludEVycm9yU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBpbGVDb2RlL2VzYnVpbGQvcHJpbnRNZXNzYWdlXCI7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQsIE1lcmdlU291cmNlTWFwIH0gZnJvbSBcIi4uLy4uLy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBcIjtcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tIFwiLi4vLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXdcIjtcbmltcG9ydCB7IFByaW50U3ZlbHRlRXJyb3IsIFByaW50U3ZlbHRlV2FybiB9IGZyb20gXCIuL2Vycm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEJ1aWxkU2NyaXB0KGluU3RhdGljUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyBpblN0YXRpY1BhdGgsIGZ1bGxDb21waWxlUGF0aCA9IGdldFR5cGVzLlN0YXRpY1sxXSArIGluU3RhdGljUGF0aDtcblxuICAgIGNvbnN0IHsgY29kZSwgZGVwZW5kZW5jaWVzLCBtYXAsIHNjcmlwdExhbmcgfSA9IGF3YWl0IHByZXByb2Nlc3MoZnVsbFBhdGgsIGdldFR5cGVzLlN0YXRpY1syXSArICcvJyArIGluU3RhdGljUGF0aCk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmdWxsUGF0aC5zcGxpdCgvXFwvfFxcLy8pLnBvcCgpO1xuICAgIGxldCBqczogYW55LCBjc3M6IGFueTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBzdmVsdGUuY29tcGlsZShjb2RlLCB7XG4gICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgIGRldjogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHNvdXJjZW1hcDogbWFwLFxuICAgICAgICAgICAgY3NzOiBmYWxzZSxcbiAgICAgICAgICAgIGh5ZHJhdGFibGU6IHRydWUsXG4gICAgICAgICAgICBzdmVsdGVQYXRoOiAnL3NlcnYvc3ZlbHRlJ1xuICAgICAgICB9KTtcbiAgICAgICAgUHJpbnRTdmVsdGVXYXJuKG91dHB1dC53YXJuaW5ncywgZnVsbFBhdGgsIG1hcCk7XG4gICAgICAgIGpzID0gb3V0cHV0LmpzO1xuICAgICAgICBjc3MgPSBvdXRwdXQuY3NzO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIFByaW50U3ZlbHRlRXJyb3IoZXJyLCBmdWxsUGF0aCwgbWFwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRoaXNGaWxlOiAwXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICBjb25zdCBzb3VyY2VGaWxlQ2xpZW50ID0ganMubWFwLnNvdXJjZXNbMF0uc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYoaXNEZWJ1Zyl7XG4gICAgICAgIGpzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICB9XG5cbiAgICBpZiAoU29tZVBsdWdpbnMoXCJNaW5KU1wiKSB8fCBTb21lUGx1Z2lucyhcIk1pbkFsbFwiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGF3YWl0IHRyYW5zZm9ybShqcy5jb2RlLCB7XG4gICAgICAgICAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICAgICAgICAgIGxvYWRlcjogPGFueT5zY3JpcHRMYW5nLFxuICAgICAgICAgICAgICAgIHNvdXJjZW1hcDogaXNEZWJ1Z1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGpzLmNvZGUgPSBjb2RlO1xuICAgICAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgICAgIGpzLm1hcCA9IGF3YWl0IE1lcmdlU291cmNlTWFwKEpTT04ucGFyc2UobWFwKSwganMubWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhd2FpdCBFU0J1aWxkUHJpbnRFcnJvclNvdXJjZU1hcChlcnIsIGpzLm1hcCwgZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAganMuY29kZSArPSB0b1VSTENvbW1lbnQoanMubWFwKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjc3MuY29kZSkge1xuICAgICAgICAgICAgY3NzLm1hcC5zb3VyY2VzWzBdID0gc291cmNlRmlsZUNsaWVudDtcbiAgICAgICAgICAgIGNzcy5jb2RlICs9IHRvVVJMQ29tbWVudChjc3MubWFwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5TdGF0aWNQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5qcycsIGpzLmNvZGUpO1xuICAgIGF3YWl0IEVhc3lGcy53cml0ZUZpbGUoZnVsbENvbXBpbGVQYXRoICsgJy5jc3MnLCBjc3MuY29kZSA/PyAnJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZXBlbmRlbmNpZXMsXG4gICAgICAgIHRoaXNGaWxlOiBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnKVxuICAgIH07XG59IiwgImltcG9ydCBzYXNzIGZyb20gJ3Nhc3MnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IFNvbWVQbHVnaW5zIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBwYXRoVG9GaWxlVVJMfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ICBjcmVhdGVJbXBvcnRlciwgZ2V0U2Fzc0Vycm9yTGluZSwgUHJpbnRTYXNzRXJyb3IsIHNhc3NBbmRTb3VyY2UsIHNhc3NTdHlsZSwgc2Fzc1N5bnRheCB9IGZyb20gJy4uLy4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvc3R5bGUvc2Fzcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCdWlsZFN0eWxlU2FzcyhpbnB1dFBhdGg6IHN0cmluZywgdHlwZTogXCJzYXNzXCIgfCBcInNjc3NcIiB8IFwiY3NzXCIsIGlzRGVidWc6IGJvb2xlYW4pOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0+IHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGdldFR5cGVzLlN0YXRpY1swXSArIGlucHV0UGF0aCwgZnVsbENvbXBpbGVQYXRoID0gZ2V0VHlwZXMuU3RhdGljWzFdICsgaW5wdXRQYXRoO1xuXG4gICAgY29uc3QgZGVwZW5kZW5jZU9iamVjdCA9IHtcbiAgICAgICAgdGhpc0ZpbGU6IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycpXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpLCBmaWxlRGF0YURpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2Fzcy5jb21waWxlU3RyaW5nQXN5bmMoZmlsZURhdGEsIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcDogaXNEZWJ1ZyxcbiAgICAgICAgICAgIHN5bnRheDogc2Fzc1N5bnRheCh0eXBlKSxcbiAgICAgICAgICAgIHN0eWxlOiBzYXNzU3R5bGUodHlwZSwgU29tZVBsdWdpbnMpLFxuICAgICAgICAgICAgbG9nZ2VyOiBzYXNzLkxvZ2dlci5zaWxlbnQsXG4gICAgICAgICAgICBpbXBvcnRlcjogY3JlYXRlSW1wb3J0ZXIoZnVsbFBhdGgpLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0Py5sb2FkZWRVcmxzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcmVzdWx0LmxvYWRlZFVybHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBGdWxsUGF0aCA9IGZpbGVVUkxUb1BhdGgoPGFueT5maWxlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNlT2JqZWN0W0Jhc2ljU2V0dGluZ3MucmVsYXRpdmUoRnVsbFBhdGgpXSA9IGF3YWl0IEVhc3lGcy5zdGF0KGZ1bGxQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuY3NzO1xuXG4gICAgICAgIGlmIChpc0RlYnVnICYmIHJlc3VsdC5zb3VyY2VNYXApIHtcbiAgICAgICAgICAgIHNhc3NBbmRTb3VyY2UocmVzdWx0LnNvdXJjZU1hcCwgcGF0aFRvRmlsZVVSTChmaWxlRGF0YSkuaHJlZik7XG4gICAgICAgICAgICByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMgPSByZXN1bHQuc291cmNlTWFwLnNvdXJjZXMubWFwKHggPT4gcGF0aC5yZWxhdGl2ZShmaWxlRGF0YURpcm5hbWUsIGZpbGVVUkxUb1BhdGgoeCkpICsgJz9zb3VyY2U9dHJ1ZScpO1xuXG4gICAgICAgICAgICBkYXRhICs9IGBcXHJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJHtCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXN1bHQuc291cmNlTWFwKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9Ki9gO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwoaW5wdXRQYXRoLCBnZXRUeXBlcy5TdGF0aWNbMV0pO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGZ1bGxDb21waWxlUGF0aCwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIFByaW50U2Fzc0Vycm9yKGVycik7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwZW5kZW5jZU9iamVjdFxufSIsICJpbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBEaXJlbnQgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBJbnNlcnQsIENvbXBvbmVudHMsIEdldFBsdWdpbiB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgeyBDbGVhcldhcm5pbmcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldydcbmltcG9ydCAqIGFzIFNlYXJjaEZpbGVTeXN0ZW0gZnJvbSAnLi9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBSZXFTY3JpcHQgZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBTdGF0aWNGaWxlcyBmcm9tICcuLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDb21waWxlU3RhdGUgZnJvbSAnLi9Db21waWxlU3RhdGUnO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UsIHBhZ2VEZXBzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvU3RvcmVEZXBzJztcbmltcG9ydCB7IEV4cG9ydFNldHRpbmdzIH0gZnJvbSAnLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHsgY3JlYXRlU2l0ZU1hcCB9IGZyb20gJy4vU2l0ZU1hcCc7XG5pbXBvcnQgeyBpc0ZpbGVUeXBlLCBSZW1vdmVFbmRUeXBlIH0gZnJvbSAnLi9GaWxlVHlwZXMnO1xuaW1wb3J0IHsgcGVyQ29tcGlsZSwgcG9zdENvbXBpbGUsIHBlckNvbXBpbGVQYWdlLCBwb3N0Q29tcGlsZVBhZ2UgfSBmcm9tICcuLi9CdWlsZEluQ29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlVGVtcGxhdGUgfSBmcm9tICcuLi9Db21waWxlQ29kZS9TY3JpcHRUZW1wbGF0ZSc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIGlzRGVidWc/OiBib29sZWFuLCBoYXNTZXNzaW9uSW5mbz86IFNlc3Npb25CdWlsZCwgbmVzdGVkUGFnZT86IHN0cmluZywgbmVzdGVkUGFnZURhdGE/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBGdWxsRmlsZVBhdGggPSBwYXRoLmpvaW4oYXJyYXlUeXBlWzBdLCBmaWxlUGF0aCksIEZ1bGxQYXRoQ29tcGlsZSA9IGFycmF5VHlwZVsxXSArIGZpbGVQYXRoICsgJy5janMnO1xuXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShGdWxsRmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgY29uc3QgRXhjbHVVcmwgPSAobmVzdGVkUGFnZSA/IG5lc3RlZFBhZ2UgKyAnPGxpbmU+JyA6ICcnKSArIGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBoYXNTZXNzaW9uSW5mbyA/PyBuZXcgU2Vzc2lvbkJ1aWxkKGFycmF5VHlwZVsyXSArICcvJyArIGZpbGVQYXRoLCBGdWxsRmlsZVBhdGgsIGFycmF5VHlwZVsyXSwgaXNEZWJ1ZywgR2V0UGx1Z2luKFwiU2FmZURlYnVnXCIpKTtcbiAgICBhd2FpdCBzZXNzaW9uSW5mby5kZXBlbmRlbmNlKCd0aGlzUGFnZScsIEZ1bGxGaWxlUGF0aCk7XG5cbiAgICBhd2FpdCBwZXJDb21waWxlUGFnZShzZXNzaW9uSW5mbywgRnVsbFBhdGhDb21waWxlKTtcbiAgICBjb25zdCBDb21waWxlZERhdGEgPSBhd2FpdCBJbnNlcnQoaHRtbCwgRnVsbFBhdGhDb21waWxlLCBCb29sZWFuKG5lc3RlZFBhZ2UpLCBuZXN0ZWRQYWdlRGF0YSwgc2Vzc2lvbkluZm8pO1xuICAgIGF3YWl0IHBvc3RDb21waWxlUGFnZShzZXNzaW9uSW5mbywgRnVsbFBhdGhDb21waWxlKTtcblxuICAgIGlmICghbmVzdGVkUGFnZSkge1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKEZ1bGxQYXRoQ29tcGlsZSwgQ29tcGlsZWREYXRhLlN0cmluZ1dpdGhUYWNrKEZ1bGxQYXRoQ29tcGlsZSkpO1xuICAgICAgICBwYWdlRGVwcy51cGRhdGUoUmVtb3ZlRW5kVHlwZShFeGNsdVVybCksIHNlc3Npb25JbmZvLmRlcGVuZGVuY2llcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgQ29tcGlsZWREYXRhLCBzZXNzaW9uSW5mbyB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgZm9yIChjb25zdCBpIG9mIDxEaXJlbnRbXT5hbGxJbkZvbGRlcikge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lLCBjb25uZWN0ID0gcGF0aCArIG47XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ta2RpcihhcnJheVR5cGVbMV0gKyBjb25uZWN0KTtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNGaWxlVHlwZShTZWFyY2hGaWxlU3lzdGVtLkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIG4pKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkUGFnZShjb25uZWN0LCBhcnJheVR5cGVbMl0pO1xuICAgICAgICAgICAgICAgIGlmIChhd2FpdCBDaGVja0RlcGVuZGVuY3lDaGFuZ2UoYXJyYXlUeXBlWzJdICsgJy8nICsgY29ubmVjdCkpIC8vY2hlY2sgaWYgbm90IGFscmVhZHkgY29tcGlsZSBmcm9tIGEgJ2luLWZpbGUnIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29tcGlsZUZpbGUoY29ubmVjdCwgYXJyYXlUeXBlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpYyAmJiBpc0ZpbGVUeXBlKFNlYXJjaEZpbGVTeXN0ZW0uQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRJbXBvcnQoY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgUmVxU2NyaXB0KCdQcm9kdWN0aW9uIExvYWRlciAtICcgKyBhcnJheVR5cGVbMl0sIGNvbm5lY3QsIGFycmF5VHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGaWxlKGNvbm5lY3QpO1xuICAgICAgICAgICAgICAgIGF3YWl0IFN0YXRpY0ZpbGVzKGNvbm5lY3QsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gUmVxdWlyZVNjcmlwdHMoc2NyaXB0czogc3RyaW5nW10pIHtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2Ygc2NyaXB0cykge1xuICAgICAgICBhd2FpdCBSZXFTY3JpcHQoJ1Byb2R1Y3Rpb24gTG9hZGVyJywgcGF0aCwgU2VhcmNoRmlsZVN5c3RlbS5nZXRUeXBlcy5TdGF0aWMsIGZhbHNlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIENyZWF0ZUNvbXBpbGUodDogc3RyaW5nLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgdHlwZXMgPSBTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzW3RdO1xuICAgIGF3YWl0IFNlYXJjaEZpbGVTeXN0ZW0uRGVsZXRlSW5EaXJlY3RvcnkodHlwZXNbMV0pO1xuICAgIHJldHVybiAoKSA9PiBGaWxlc0luRm9sZGVyKHR5cGVzLCAnJywgc3RhdGUpO1xufVxuXG4vKipcbiAqIHdoZW4gcGFnZSBjYWxsIG90aGVyIHBhZ2U7XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBGYXN0Q29tcGlsZUluRmlsZShwYXRoOiBzdHJpbmcsIGFycmF5VHlwZTogc3RyaW5nW10sIHNlc3Npb25JbmZvPzogU2Vzc2lvbkJ1aWxkLCBuZXN0ZWRQYWdlPzogc3RyaW5nLCBuZXN0ZWRQYWdlRGF0YT86IHN0cmluZykge1xuICAgIGF3YWl0IEVhc3lGcy5tYWtlUGF0aFJlYWwocGF0aCwgYXJyYXlUeXBlWzFdKTtcbiAgICByZXR1cm4gYXdhaXQgY29tcGlsZUZpbGUocGF0aCwgYXJyYXlUeXBlLCB0cnVlLCBzZXNzaW9uSW5mbywgbmVzdGVkUGFnZSwgbmVzdGVkUGFnZURhdGEpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gRmFzdENvbXBpbGUocGF0aDogc3RyaW5nLCBhcnJheVR5cGU6IHN0cmluZ1tdKSB7XG4gICAgYXdhaXQgRmFzdENvbXBpbGVJbkZpbGUocGF0aCwgYXJyYXlUeXBlKTtcbiAgICBDbGVhcldhcm5pbmcoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBpbGVBbGwoRXhwb3J0OiBFeHBvcnRTZXR0aW5ncykge1xuICAgIGxldCBzdGF0ZSA9ICFhcmd2LmluY2x1ZGVzKCdyZWJ1aWxkJykgJiYgYXdhaXQgQ29tcGlsZVN0YXRlLmNoZWNrTG9hZCgpXG5cbiAgICBpZiAoc3RhdGUpIHJldHVybiAoKSA9PiBSZXF1aXJlU2NyaXB0cyhzdGF0ZS5zY3JpcHRzKVxuICAgIHBhZ2VEZXBzLmNsZWFyKCk7XG4gICAgXG4gICAgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcblxuICAgIHBlckNvbXBpbGUoKTtcblxuICAgIGNvbnN0IGFjdGl2YXRlQXJyYXkgPSBbYXdhaXQgQ3JlYXRlQ29tcGlsZShTZWFyY2hGaWxlU3lzdGVtLmdldFR5cGVzLlN0YXRpY1syXSwgc3RhdGUpLCBhd2FpdCBDcmVhdGVDb21waWxlKFNlYXJjaEZpbGVTeXN0ZW0uZ2V0VHlwZXMuTG9nc1syXSwgc3RhdGUpLCBDbGVhcldhcm5pbmddO1xuXG4gICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFjdGl2YXRlQXJyYXkpIHtcbiAgICAgICAgICAgIGF3YWl0IGkoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgc3RhdGUpO1xuICAgICAgICBzdGF0ZS5leHBvcnQoKVxuICAgICAgICBwb3N0Q29tcGlsZSgpXG4gICAgfVxufSIsICJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZ2V0U2V0dGluZ3NEYXRlIH0gZnJvbSBcIi4uL01haW5CdWlsZC9JbXBvcnRNb2R1bGVcIjtcbmltcG9ydCBFYXN5RnMgZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IHsgU3lzdGVtRGF0YSB9IGZyb20gXCIuL1NlYXJjaEZpbGVTeXN0ZW1cIjtcblxudHlwZSBDU3RhdGUgPSB7XG4gICAgdXBkYXRlOiBudW1iZXJcbiAgICBwYWdlQXJyYXk6IHN0cmluZ1tdW10sXG4gICAgaW1wb3J0QXJyYXk6IHN0cmluZ1tdXG4gICAgZmlsZUFycmF5OiBzdHJpbmdbXVxufVxuXG4vKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gc3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBwcm9qZWN0ICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlU3RhdGUge1xuICAgIHByaXZhdGUgc3RhdGU6IENTdGF0ZSA9IHsgdXBkYXRlOiAwLCBwYWdlQXJyYXk6IFtdLCBpbXBvcnRBcnJheTogW10sIGZpbGVBcnJheTogW10gfVxuICAgIHN0YXRpYyBmaWxlUGF0aCA9IHBhdGguam9pbihTeXN0ZW1EYXRhLCBcIkNvbXBpbGVTdGF0ZS5qc29uXCIpXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUudXBkYXRlID0gZ2V0U2V0dGluZ3NEYXRlKClcbiAgICB9XG5cbiAgICBnZXQgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuaW1wb3J0QXJyYXlcbiAgICB9XG5cbiAgICBnZXQgcGFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnBhZ2VBcnJheVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZmlsZUFycmF5XG4gICAgfVxuXG4gICAgYWRkUGFnZShwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucGFnZUFycmF5LmZpbmQoeCA9PiB4WzBdID09IHBhdGggJiYgeFsxXSA9PSB0eXBlKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucGFnZUFycmF5LnB1c2goW3BhdGgsIHR5cGVdKVxuICAgIH1cblxuICAgIGFkZEltcG9ydChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmltcG9ydEFycmF5LmluY2x1ZGVzKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbXBvcnRBcnJheS5wdXNoKHBhdGgpXG4gICAgfVxuXG4gICAgYWRkRmlsZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmZpbGVBcnJheS5pbmNsdWRlcyhwYXRoKSlcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmlsZUFycmF5LnB1c2gocGF0aClcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICAgIHJldHVybiBFYXN5RnMud3JpdGVKc29uRmlsZShDb21waWxlU3RhdGUuZmlsZVBhdGgsIHRoaXMuc3RhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNoZWNrTG9hZCgpIHtcbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLmZpbGVQYXRoKSkgcmV0dXJuXG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQ29tcGlsZVN0YXRlKClcbiAgICAgICAgc3RhdGUuc3RhdGUgPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHRoaXMuZmlsZVBhdGgpXG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAhPSBnZXRTZXR0aW5nc0RhdGUoKSkgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxufSIsICJpbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBJbXBvcnRGaWxlLCB7QWRkRXh0ZW5zaW9uLCBSZXF1aXJlT25jZX0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7cHJpbnR9IGZyb20gJy4uL091dHB1dElucHV0L0NvbnNvbGUnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTdGFydFJlcXVpcmUoYXJyYXk6IHN0cmluZ1tdLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgY29uc3QgYXJyYXlGdW5jU2VydmVyID0gW107XG4gICAgZm9yIChsZXQgaSBvZiBhcnJheSkge1xuICAgICAgICBpID0gQWRkRXh0ZW5zaW9uKGkpO1xuXG4gICAgICAgIGNvbnN0IGIgPSBhd2FpdCBJbXBvcnRGaWxlKCdyb290IGZvbGRlciAoV1dXKScsIGksIGdldFR5cGVzLlN0YXRpYywgaXNEZWJ1Zyk7XG4gICAgICAgIGlmIChiICYmIHR5cGVvZiBiLlN0YXJ0U2VydmVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFycmF5RnVuY1NlcnZlci5wdXNoKGIuU3RhcnRTZXJ2ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpbnQubG9nKGBDYW4ndCBmaW5kIFN0YXJ0U2VydmVyIGZ1bmN0aW9uIGF0IG1vZHVsZSAtICR7aX1cXG5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheUZ1bmNTZXJ2ZXI7XG59XG5cbmxldCBsYXN0U2V0dGluZ3NJbXBvcnQ6IG51bWJlcjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHZXRTZXR0aW5ncyhmaWxlUGF0aDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuKXtcbiAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmaWxlUGF0aCArICcudHMnKSl7XG4gICAgICAgIGZpbGVQYXRoICs9ICcudHMnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoICs9ICcuanMnXG4gICAgfVxuICAgIGNvbnN0IGNoYW5nZVRpbWUgPSA8YW55PmF3YWl0IEVhc3lGcy5zdGF0KGZpbGVQYXRoLCAnbXRpbWVNcycsIHRydWUsIG51bGwpXG5cbiAgICBpZihjaGFuZ2VUaW1lID09IGxhc3RTZXR0aW5nc0ltcG9ydCB8fCAhY2hhbmdlVGltZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgXG4gICAgbGFzdFNldHRpbmdzSW1wb3J0ID0gY2hhbmdlVGltZTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgUmVxdWlyZU9uY2UoZmlsZVBhdGgsIGlzRGVidWcpO1xuICAgIHJldHVybiBkYXRhLmRlZmF1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nc0RhdGUoKXtcbiAgICByZXR1cm4gbGFzdFNldHRpbmdzSW1wb3J0XG59IiwgImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJbXBvcnRGaWxlIH0gZnJvbSBcIi4uL0ltcG9ydEZpbGVzL1NjcmlwdFwiO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tIFwiLi4vTWFpbkJ1aWxkL1NldHRpbmdzVHlwZXNcIjtcbmltcG9ydCBFYXN5RnMsIHsgRGlyZW50IH0gZnJvbSBcIi4uL091dHB1dElucHV0L0Vhc3lGc1wiO1xuaW1wb3J0IENvbXBpbGVTdGF0ZSBmcm9tIFwiLi9Db21waWxlU3RhdGVcIjtcbmltcG9ydCB7IGlzRmlsZVR5cGUgfSBmcm9tIFwiLi9GaWxlVHlwZXNcIjtcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSBcIi4vU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5hc3luYyBmdW5jdGlvbiBGaWxlc0luRm9sZGVyKGFycmF5VHlwZTogc3RyaW5nW10sIHBhdGg6IHN0cmluZywgc3RhdGU6IENvbXBpbGVTdGF0ZSkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIoYXJyYXlUeXBlWzBdICsgcGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuXG4gICAgY29uc3QgcHJvbWlzZXMgPVtdO1xuICAgIGZvciAoY29uc3QgaSBvZiA8RGlyZW50W10+YWxsSW5Gb2xkZXIpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZSwgY29ubmVjdCA9IHBhdGggKyBuO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEZpbGVzSW5Gb2xkZXIoYXJyYXlUeXBlLCBjb25uZWN0ICsgJy8nLCBzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzRmlsZVR5cGUoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSwgbikpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRQYWdlKGNvbm5lY3QsIGFycmF5VHlwZVsyXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFycmF5VHlwZSA9PSBnZXRUeXBlcy5TdGF0aWMgJiYgaXNGaWxlVHlwZShCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5LCBuKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFkZEltcG9ydChjb25uZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkRmlsZShjb25uZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNjYW5GaWxlcygpe1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IENvbXBpbGVTdGF0ZSgpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgRmlsZXNJbkZvbGRlcihnZXRUeXBlcy5TdGF0aWMsICcnLCBzdGF0ZSksXG4gICAgICAgIEZpbGVzSW5Gb2xkZXIoZ2V0VHlwZXMuTG9ncywgJycsIHN0YXRlKVxuICAgIF0pXG4gICAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVidWdTaXRlTWFwKEV4cG9ydDogRXhwb3J0U2V0dGluZ3Mpe1xuICAgIHJldHVybiBjcmVhdGVTaXRlTWFwKEV4cG9ydCwgYXdhaXQgc2NhbkZpbGVzKCkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2l0ZU1hcChFeHBvcnQ6IEV4cG9ydFNldHRpbmdzLCBzdGF0ZTogQ29tcGlsZVN0YXRlKSB7XG4gICAgY29uc3QgeyByb3V0aW5nLCBkZXZlbG9wbWVudCB9ID0gRXhwb3J0O1xuICAgIGlmICghcm91dGluZy5zaXRlbWFwKSByZXR1cm47XG5cbiAgICBjb25zdCBzaXRlbWFwID0gcm91dGluZy5zaXRlbWFwID09PSB0cnVlID8ge30gOiByb3V0aW5nLnNpdGVtYXA7XG4gICAgT2JqZWN0LmFzc2lnbihzaXRlbWFwLCB7XG4gICAgICAgIHJ1bGVzOiB0cnVlLFxuICAgICAgICB1cmxTdG9wOiBmYWxzZSxcbiAgICAgICAgZXJyb3JQYWdlczogZmFsc2UsXG4gICAgICAgIHZhbGlkUGF0aDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFnZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICB1cmxzOiAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBcbiAgICBmb3IgKGxldCBbdXJsLCB0eXBlXSBvZiBzdGF0ZS5wYWdlcykge1xuXG4gICAgICAgIGlmKHR5cGUgIT0gZ2V0VHlwZXMuU3RhdGljWzJdIHx8ICF1cmwuZW5kc1dpdGgoJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB1cmwgPSAnLycgKyB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmKHBhdGguZXh0bmFtZSh1cmwpID09ICcuc2VydicpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAoc2l0ZW1hcC51cmxTdG9wKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gcm91dGluZy51cmxTdG9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpdGVtYXAucnVsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiByb3V0aW5nLnJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGF3YWl0IHJvdXRpbmcucnVsZXNbcGF0aF0odXJsKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcm91dGluZy5pZ25vcmVUeXBlcy5maW5kKGVuZHMgPT4gdXJsLmVuZHNXaXRoKCcuJytlbmRzKSkgfHxcbiAgICAgICAgICAgIHJvdXRpbmcuaWdub3JlUGF0aHMuZmluZChzdGFydCA9PiB1cmwuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChzaXRlbWFwLnZhbGlkUGF0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHJvdXRpbmcudmFsaWRQYXRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhd2FpdCBmdW5jKHVybCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpdGVtYXAuZXJyb3JQYWdlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlcnJvciBpbiByb3V0aW5nLmVycm9yUGFnZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gJy8nICsgcm91dGluZy5lcnJvclBhZ2VzW2Vycm9yXS5wYXRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVybHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VzLnB1c2godXJsKTtcbiAgICB9XG5cbiAgICBsZXQgd3JpdGUgPSB0cnVlO1xuICAgIGlmIChzaXRlbWFwLmZpbGUpIHtcbiAgICAgICAgY29uc3QgZmlsZUFjdGlvbiA9IGF3YWl0IEltcG9ydEZpbGUoJ1NpdGVtYXAgSW1wb3J0Jywgc2l0ZW1hcC5maWxlLCBnZXRUeXBlcy5TdGF0aWMsIGRldmVsb3BtZW50KTtcbiAgICAgICAgaWYoIWZpbGVBY3Rpb24/LlNpdGVtYXApe1xuICAgICAgICAgICAgZHVtcC53YXJuKCdcXCdTaXRlbWFwXFwnIGZ1bmN0aW9uIG5vdCBmb3VuZCBvbiBmaWxlIC0+ICcrIHNpdGVtYXAuZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3cml0ZSA9IGF3YWl0IGZpbGVBY3Rpb24uU2l0ZW1hcChwYWdlcywgc3RhdGUsIEV4cG9ydCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZih3cml0ZSAmJiBwYWdlcy5sZW5ndGgpe1xuICAgICAgICBjb25zdCBwYXRoID0gd3JpdGUgPT09IHRydWUgPyAnc2l0ZW1hcC50eHQnOiB3cml0ZTtcbiAgICAgICAgc3RhdGUuYWRkRmlsZShwYXRoKTtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShnZXRUeXBlcy5TdGF0aWNbMF0gKyBwYXRoLCBwYWdlcy5qb2luKCdcXG4nKSk7XG4gICAgfVxufSIsICIvKipcbiAqIENoZWNrIGlmIHRoZSBmaWxlIG5hbWUgZW5kcyB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gZmlsZSB0eXBlcy5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVzIC0gYW4gYXJyYXkgb2YgZmlsZSBleHRlbnNpb25zIHRvIG1hdGNoLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZVR5cGUodHlwZXM6IHN0cmluZ1tdLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCcuJyArIHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsYXN0IGRvdCBhbmQgZXZlcnl0aGluZyBhZnRlciBpdCBmcm9tIGEgc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byByZW1vdmUgdGhlIGVuZCB0eXBlIGZyb20uXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGhvdXQgdGhlIGxhc3QgY2hhcmFjdGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUmVtb3ZlRW5kVHlwZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZignLicpKTtcbn0iLCAiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBGYXN0Q29tcGlsZSB9IGZyb20gJy4vU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnQHRpbnlodHRwL2FwcCc7XG5pbXBvcnQgeyBGaWxlcyB9IGZyb20gJ2Zvcm1pZGFibGUnO1xuaW1wb3J0IHsgaGFuZGVsQ29ubmVjdG9yU2VydmljZSB9IGZyb20gJy4uL0J1aWxkSW5Db21wb25lbnRzL2luZGV4JztcbmltcG9ydCBJbXBvcnRXaXRob3V0Q2FjaGUgZnJvbSAnLi4vSW1wb3J0RmlsZXMvcmVkaXJlY3RDSlMnO1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCwgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBSZXF1aXJlRmlsZSBmcm9tICcuL0ltcG9ydEZpbGVSdW50aW1lJztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgeyBDaGVja0RlcGVuZGVuY3lDaGFuZ2UgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9TdG9yZURlcHMnO1xuXG5jb25zdCBFeHBvcnQgPSB7XG4gICAgUGFnZUxvYWRSYW06IHt9LFxuICAgIFBhZ2VSYW06IHRydWVcbn1cblxuLyoqXG4gKiBJdCBsb2FkcyBhIHBhZ2UgYW5kIHJldHVybnMgdGhlIG1vZGVsLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIFRoZSB0eXBlQXJyYXkgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGNvbnRhaW5zIHRoZSBwYXRoIHRvIHRoZVxuICogZmlsZS5cbiAqIEBwYXJhbSBMYXN0UmVxdWlyZSAtIEEgZGljdGlvbmFyeSBvZiBhbGwgdGhlIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlcXVpcmVkIHNvIGZhci5cbiAqIEBwYXJhbSB7YW55fSBEYXRhT2JqZWN0IC0gVGhlIGRhdGEgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhZ2UuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFJlcXVpcmVQYWdlKGZpbGVQYXRoOiBzdHJpbmcsIF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIHR5cGVBcnJheTogc3RyaW5nW10sIExhc3RSZXF1aXJlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBSZXFGaWxlUGF0aCA9IExhc3RSZXF1aXJlW2ZpbGVQYXRoXTtcbiAgICBjb25zdCByZXNNb2RlbCA9ICgpID0+IFJlcUZpbGVQYXRoLm1vZGVsKERhdGFPYmplY3QpO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBpZiAoUmVxRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKCFEYXRhT2JqZWN0LmlzRGVidWcpXG4gICAgICAgICAgICByZXR1cm4gcmVzTW9kZWwoKTtcblxuICAgICAgICBpZiAoUmVxRmlsZVBhdGguZGF0ZSA9PSAtMSkge1xuICAgICAgICAgICAgZmlsZUV4aXN0cyA9IGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKFJlcUZpbGVQYXRoLnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWZpbGVFeGlzdHMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc01vZGVsKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICghZXh0bmFtZSkge1xuICAgICAgICBleHRuYW1lID0gQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZTtcbiAgICAgICAgZmlsZVBhdGggKz0gJy4nICsgZXh0bmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFBhdGg6IHN0cmluZztcbiAgICBpZiAoZmlsZVBhdGhbMF0gPT0gJy4nKSB7XG4gICAgICAgIGlmIChmaWxlUGF0aFsxXSA9PSAnLycpXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlUGF0aClcbiAgICB9IGVsc2VcbiAgICAgICAgZnVsbFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzBdLCBmaWxlUGF0aCk7XG5cbiAgICBpZiAoIVtCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlLCBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5jb21wb25lbnRdLmluY2x1ZGVzKGV4dG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpO1xuICAgICAgICBEYXRhT2JqZWN0LndyaXRlKGltcG9ydFRleHQpO1xuICAgICAgICByZXR1cm4gaW1wb3J0VGV4dDtcbiAgICB9XG5cbiAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGF0aCk7XG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICAgIFByaW50SWZOZXcoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm4nLFxuICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgdGV4dDogYEltcG9ydCAnJHtjb3B5UGF0aH0nIGRvZXMgbm90IGV4aXN0cyBmcm9tICcke19fZmlsZW5hbWV9J2BcbiAgICAgICAgfSlcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogKCkgPT4geyB9LCBkYXRlOiAtMSwgcGF0aDogZnVsbFBhdGggfTtcbiAgICAgICAgcmV0dXJuIExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbDtcbiAgICB9XG5cbiAgICBjb25zdCBGb3JTYXZlUGF0aCA9IHR5cGVBcnJheVsyXSArICcvJyArIGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sZW5ndGggLSBleHRuYW1lLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IHJlQnVpbGQgPSBEYXRhT2JqZWN0LmlzRGVidWcgJiYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0eXBlQXJyYXlbMV0gKyBmaWxlUGF0aCArICcuY2pzJykgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKEZvclNhdmVQYXRoKSk7XG5cbiAgICBpZiAocmVCdWlsZClcbiAgICAgICAgYXdhaXQgRmFzdENvbXBpbGUoZmlsZVBhdGgsIHR5cGVBcnJheSk7XG5cblxuICAgIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdICYmICFyZUJ1aWxkKSB7XG4gICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF1bMF0gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IExhc3RSZXF1aXJlW2NvcHlQYXRoXS5tb2RlbChEYXRhT2JqZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jID0gYXdhaXQgTG9hZFBhZ2UoRm9yU2F2ZVBhdGgsIGV4dG5hbWUpO1xuICAgIGlmIChFeHBvcnQuUGFnZVJhbSkge1xuICAgICAgICBpZiAoIUV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0pIHtcbiAgICAgICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtGb3JTYXZlUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bRm9yU2F2ZVBhdGhdWzBdID0gZnVuYztcbiAgICB9XG5cbiAgICBMYXN0UmVxdWlyZVtjb3B5UGF0aF0gPSB7IG1vZGVsOiBmdW5jIH07XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMoRGF0YU9iamVjdCk7XG59XG5cbmNvbnN0IEdsb2JhbFZhciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRGdWxsUGF0aENvbXBpbGUodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBTcGxpdEluZm8gPSBTcGxpdEZpcnN0KCcvJywgdXJsKTtcbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIHJldHVybiB0eXBlQXJyYXlbMV0gKyBTcGxpdEluZm9bMV0gKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UgKyAnLmNqcyc7XG59XG5cbi8qKlxuICogSXQgbG9hZHMgYSBwYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIHBhZ2UgdG8gbG9hZC5cbiAqIEBwYXJhbSBleHQgLSBUaGUgZXh0ZW5zaW9uIG9mIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlKHVybDogc3RyaW5nLCBleHQgPSBCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcy5wYWdlKSB7XG4gICAgY29uc3QgU3BsaXRJbmZvID0gU3BsaXRGaXJzdCgnLycsIHVybCk7XG5cbiAgICBjb25zdCB0eXBlQXJyYXkgPSBnZXRUeXBlc1tTcGxpdEluZm9bMF1dO1xuICAgIGNvbnN0IExhc3RSZXF1aXJlID0ge307XG5cbiAgICBmdW5jdGlvbiBfcmVxdWlyZShfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnksIHA6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gUmVxdWlyZUZpbGUocCwgX19maWxlbmFtZSwgX19kaXJuYW1lLCB0eXBlQXJyYXksIExhc3RSZXF1aXJlLCBEYXRhT2JqZWN0LmlzRGVidWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmNsdWRlKF9fZmlsZW5hbWU6IHN0cmluZywgX19kaXJuYW1lOiBzdHJpbmcsIERhdGFPYmplY3Q6IGFueSwgcDogc3RyaW5nLCBXaXRoT2JqZWN0ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIFJlcXVpcmVQYWdlKHAsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgdHlwZUFycmF5LCBMYXN0UmVxdWlyZSwgeyAuLi5XaXRoT2JqZWN0LCAuLi5EYXRhT2JqZWN0IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF90cmFuc2ZlcihwOiBzdHJpbmcsIHByZXNlcnZlRm9ybTogYm9vbGVhbiwgd2l0aE9iamVjdDogYW55LCBfX2ZpbGVuYW1lOiBzdHJpbmcsIF9fZGlybmFtZTogc3RyaW5nLCBEYXRhT2JqZWN0OiBhbnkpIHtcbiAgICAgICAgRGF0YU9iamVjdC5vdXRfcnVuX3NjcmlwdC50ZXh0ID0gJyc7XG5cbiAgICAgICAgaWYgKCFwcmVzZXJ2ZUZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3REYXRhID0gRGF0YU9iamVjdC5SZXF1ZXN0LmJvZHkgPyB7fSA6IG51bGw7XG4gICAgICAgICAgICBEYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFPYmplY3QsXG4gICAgICAgICAgICAgICAgUmVxdWVzdDogeyAuLi5EYXRhT2JqZWN0LlJlcXVlc3QsIGZpbGVzOiB7fSwgcXVlcnk6IHt9LCBib2R5OiBwb3N0RGF0YSB9LFxuICAgICAgICAgICAgICAgIFBvc3Q6IHBvc3REYXRhLCBRdWVyeToge30sIEZpbGVzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pbmNsdWRlKF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgRGF0YU9iamVjdCwgcCwgd2l0aE9iamVjdCk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjb21waWxlZFBhdGggPSBwYXRoLmpvaW4odHlwZUFycmF5WzFdLCBTcGxpdEluZm9bMV0gKyBcIi5cIiArIGV4dCArICcuY2pzJyk7XG4gICAgY29uc3QgcHJpdmF0ZV92YXIgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IE15TW9kdWxlID0gYXdhaXQgSW1wb3J0V2l0aG91dENhY2hlKGNvbXBpbGVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIE15TW9kdWxlKF9yZXF1aXJlLCBfaW5jbHVkZSwgX3RyYW5zZmVyLCBwcml2YXRlX3ZhciwgaGFuZGVsQ29ubmVjdG9yU2VydmljZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBkZWJ1Z19fZmlsZW5hbWUgPSB1cmwgKyBcIi5cIiArIGV4dDtcbiAgICAgICAgcHJpbnQuZXJyb3IoXCJFcnJvciBwYXRoIC0+IFwiLCBkZWJ1Z19fZmlsZW5hbWUsIFwiLT5cIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgcHJpbnQuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgIHJldHVybiAoRGF0YU9iamVjdDogYW55KSA9PiBEYXRhT2JqZWN0Lm91dF9ydW5fc2NyaXB0LnRleHQgKz0gYDxkaXYgc3R5bGU9XCJjb2xvcjpyZWQ7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtc2l6ZToxNnB4O1wiPjxwPkVycm9yIHBhdGg6ICR7ZGVidWdfX2ZpbGVuYW1lfTwvcD48cD5FcnJvciBtZXNzYWdlOiAke2UubWVzc2FnZX08L3A+PC9kaXY+YDtcbiAgICB9XG59XG4vKipcbiAqIEl0IHRha2VzIGEgZnVuY3Rpb24gdGhhdCBwcmVwYXJlIGEgcGFnZSwgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIGEgcGFnZVxuICogQHBhcmFtIExvYWRQYWdlRnVuYyAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBpbiBhIHBhZ2UgdG8gZXhlY3V0ZSBvblxuICogQHBhcmFtIHtzdHJpbmd9IHJ1bl9zY3JpcHRfbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY3JpcHQgdG8gcnVuLlxuICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICovXG5cbmZ1bmN0aW9uIEJ1aWxkUGFnZShMb2FkUGFnZUZ1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gdm9pZCwgcnVuX3NjcmlwdF9uYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBQYWdlVmFyID0ge307XG5cbiAgICByZXR1cm4gKGFzeW5jIGZ1bmN0aW9uIChSZXNwb25zZTogUmVzcG9uc2UsIFJlcXVlc3Q6IFJlcXVlc3QsIFBvc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCBudWxsLCBRdWVyeTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgQ29va2llczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgU2Vzc2lvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgRmlsZXM6IEZpbGVzLCBpc0RlYnVnOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG91dF9ydW5fc2NyaXB0ID0geyB0ZXh0OiAnJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nSW5mbyhzdHI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgYXNTdHJpbmcgPSBzdHI/LnRvU3RyaW5nPy4oKTtcbiAgICAgICAgICAgIGlmIChhc1N0cmluZyA9PSBudWxsIHx8IGFzU3RyaW5nLnN0YXJ0c1dpdGgoJ1tvYmplY3QgT2JqZWN0XScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0ciwgbnVsbCwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSZXNwb25zZSh0ZXh0OiBhbnkpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgPSBUb1N0cmluZ0luZm8odGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3cml0ZSh0ZXh0ID0gJycpIHtcbiAgICAgICAgICAgIG91dF9ydW5fc2NyaXB0LnRleHQgKz0gVG9TdHJpbmdJbmZvKHRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyaXRlU2FmZShzdHIgPSAnJykge1xuICAgICAgICAgICAgc3RyID0gVG9TdHJpbmdJbmZvKHN0cik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9ICcmIycgKyBpLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlY2hvKGFycjogc3RyaW5nW10sIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBvdXRfcnVuX3NjcmlwdC50ZXh0ICs9IGFycltpXTtcbiAgICAgICAgICAgICAgICB3cml0ZVNhZmUocGFyYW1zW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQudGV4dCArPSBhcnIuYXQoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZGlyZWN0UGF0aDogYW55ID0gZmFsc2U7XG5cbiAgICAgICAgUmVzcG9uc2UucmVkaXJlY3QgPSAocGF0aDogc3RyaW5nLCBzdGF0dXM/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJlZGlyZWN0UGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3BvbnNlLnN0YXR1cyhzdGF0dXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVzcG9uc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+UmVzcG9uc2UpLnJlbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIFJlc3BvbnNlLnJlZGlyZWN0KFJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGaWxlKGZpbGVQYXRoLCBkZWxldGVBZnRlciA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZWRpcmVjdFBhdGggPSB7IGZpbGU6IGZpbGVQYXRoLCBkZWxldGVBZnRlciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgRGF0YVNlbmQgPSB7XG4gICAgICAgICAgICBzZW5kRmlsZSxcbiAgICAgICAgICAgIHdyaXRlU2FmZSxcbiAgICAgICAgICAgIHdyaXRlLFxuICAgICAgICAgICAgZWNobyxcbiAgICAgICAgICAgIHNldFJlc3BvbnNlLFxuICAgICAgICAgICAgb3V0X3J1bl9zY3JpcHQsXG4gICAgICAgICAgICBydW5fc2NyaXB0X25hbWUsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBQb3N0LFxuICAgICAgICAgICAgUXVlcnksXG4gICAgICAgICAgICBTZXNzaW9uLFxuICAgICAgICAgICAgRmlsZXMsXG4gICAgICAgICAgICBDb29raWVzLFxuICAgICAgICAgICAgaXNEZWJ1ZyxcbiAgICAgICAgICAgIFBhZ2VWYXIsXG4gICAgICAgICAgICBHbG9iYWxWYXIsXG4gICAgICAgICAgICBjb2RlYmFzZTogJydcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IExvYWRQYWdlRnVuYyhEYXRhU2VuZCk7XG5cbiAgICAgICAgcmV0dXJuIHsgb3V0X3J1bl9zY3JpcHQ6IG91dF9ydW5fc2NyaXB0LnRleHQsIHJlZGlyZWN0UGF0aCB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHsgTG9hZFBhZ2UsIEJ1aWxkUGFnZSwgZ2V0RnVsbFBhdGhDb21waWxlLCBFeHBvcnQsIFNwbGl0Rmlyc3QgfTsiLCAiaW1wb3J0IHsgU3RyaW5nQW55TWFwIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgSW1wb3J0RmlsZSwgQWRkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFsaWFzT3JQYWNrYWdlIH0gZnJvbSAnLi4vSW1wb3J0RmlsZXMvQ3VzdG9tSW1wb3J0L0FsaWFzJztcblxudHlwZSBSZXF1aXJlRmlsZXMgPSB7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgc3RhdHVzPzogbnVtYmVyXG4gICAgbW9kZWw6IGFueVxuICAgIGRlcGVuZGVuY2llcz86IFN0cmluZ0FueU1hcFxuICAgIHN0YXRpYz86IGJvb2xlYW5cbn1cblxuY29uc3QgQ2FjaGVSZXF1aXJlRmlsZXMgPSB7fTtcblxuLyoqXG4gKiBJdCBtYWtlcyBhIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gZGVwZW5kZW5jaWVzIC0gVGhlIG9sZCBkZXBlbmRlbmNpZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlQXJyYXkgLSBUaGUgYXJyYXkgb2YgYmFzZSBwYXRoc1xuICogQHBhcmFtIFtiYXNlUGF0aF0gLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGNvbXBpbGVkLlxuICogQHBhcmFtIGNhY2hlIC0gQSBjYWNoZSBvZiB0aGUgbGFzdCB0aW1lIGEgZmlsZSB3YXMgbW9kaWZpZWQuXG4gKiBAcmV0dXJucyBBIG1hcCBvZiBkZXBlbmRlbmNpZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBTdHJpbmdBbnlNYXAsIHR5cGVBcnJheTogc3RyaW5nW10sIGJhc2VQYXRoID0gJycsIGNhY2hlID0ge30pIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNYXA6IFN0cmluZ0FueU1hcCA9IHt9O1xuICAgIGNvbnN0IHByb21pc2VBbGwgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgcHJvbWlzZUFsbC5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVBhdGggPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgICAgIGlmICghY2FjaGVbYmFzZVBhdGhdKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlUGF0aF0gPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBiYXNlUGF0aCwgJ210aW1lTXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNNYXBbJ3RoaXNGaWxlJ10gPSBjYWNoZVtiYXNlUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc01hcFtmaWxlUGF0aF0gPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKDxhbnk+dmFsdWUsIHR5cGVBcnJheSwgZmlsZVBhdGgsIGNhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICApKCkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VBbGwpO1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNYXA7XG59XG5cbi8qKlxuICogSWYgdGhlIG9sZCBkZXBlbmRlbmNpZXMgYW5kIHRoZSBuZXcgZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZSwgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBvbGREZXBzIC0gVGhlIG9sZCBkZXBlbmRlbmN5IG1hcC5cbiAqIEBwYXJhbSB7U3RyaW5nQW55TWFwfSBuZXdEZXBzIC0gVGhlIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcmV0dXJucyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRlcGVuZGVuY2llcyBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHM6IFN0cmluZ0FueU1hcCwgbmV3RGVwczogU3RyaW5nQW55TWFwKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIG9sZERlcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJ3RoaXNGaWxlJykge1xuICAgICAgICAgICAgaWYgKG5ld0RlcHNbbmFtZV0gIT0gb2xkRGVwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbXBhcmVEZXBlbmRlbmNpZXNTYW1lKG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkZXBlbmRlbmN5IHRyZWVzLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIHRoZSBtb2R1bGVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge1N0cmluZ0FueU1hcH0gb2xkRGVwcyAtIFRoZSBvbGQgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIHtTdHJpbmdBbnlNYXB9IG5ld0RlcHMgLSBUaGUgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBbcGFyZW50XSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJlbnQgbW9kdWxlLlxuICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLiBFYWNoIHN0cmluZyByZXByZXNlbnRzIGEgY2hhbmdlIGluIHRoZSBkZXBlbmRlbmN5XG4gKiB0cmVlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VBcnJheShvbGREZXBzOiBTdHJpbmdBbnlNYXAsIG5ld0RlcHM6IFN0cmluZ0FueU1hcCwgcGFyZW50ID0gJycpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgY2hhbmdlQXJyYXkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBvbGREZXBzKSB7XG4gICAgICAgIGlmIChuYW1lID09ICd0aGlzRmlsZScpIHtcbiAgICAgICAgICAgIGlmIChuZXdEZXBzW25hbWVdICE9IG9sZERlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW5ld0RlcHNbbmFtZV0pIHtcbiAgICAgICAgICAgIGNoYW5nZUFycmF5LnB1c2gobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGdldENoYW5nZUFycmF5KG9sZERlcHNbbmFtZV0sIG5ld0RlcHNbbmFtZV0sIG5hbWUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlQXJyYXkucHVzaCguLi5jaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZUFycmF5O1xufVxuXG4vKipcbiAqIEl0IGltcG9ydHMgYSBmaWxlIGFuZCByZXR1cm5zIHRoZSBtb2RlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICogQHBhcmFtIHtzdHJpbmd9IF9fZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX19kaXJuYW1lIC0gVGhlIGRpcmVjdG9yeSBvZiB0aGUgZmlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBleGVjdXRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHR5cGVBcnJheSAtIHBhdGhzIHR5cGVzLlxuICogQHBhcmFtIExhc3RSZXF1aXJlIC0gQSBtYXAgb2YgYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZXF1aXJlZCBzbyBmYXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuXG4gKiBAcmV0dXJucyBUaGUgbW9kZWwgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gUmVxdWlyZUZpbGUoZmlsZVBhdGg6IHN0cmluZywgX19maWxlbmFtZTogc3RyaW5nLCBfX2Rpcm5hbWU6IHN0cmluZywgdHlwZUFycmF5OiBzdHJpbmdbXSwgTGFzdFJlcXVpcmU6IHsgW2tleTogc3RyaW5nXTogUmVxdWlyZUZpbGVzIH0sIGlzRGVidWc6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBSZXFGaWxlID0gTGFzdFJlcXVpcmVbZmlsZVBhdGhdO1xuXG4gICAgbGV0IGZpbGVFeGlzdHM6IG51bWJlciwgbmV3RGVwczogU3RyaW5nQW55TWFwO1xuICAgIGlmIChSZXFGaWxlKSB7XG5cbiAgICAgICAgaWYgKCFpc0RlYnVnIHx8IGlzRGVidWcgJiYgKFJlcUZpbGUuc3RhdHVzID09IC0xKSlcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIGZpbGVFeGlzdHMgPSBhd2FpdCBFYXN5RnMuc3RhdCh0eXBlQXJyYXlbMF0gKyBSZXFGaWxlLnBhdGgsICdtdGltZU1zJywgdHJ1ZSwgMCk7XG4gICAgICAgIGlmIChmaWxlRXhpc3RzKSB7XG5cbiAgICAgICAgICAgIG5ld0RlcHMgPSBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKFJlcUZpbGUuZGVwZW5kZW5jaWVzLCB0eXBlQXJyYXkpO1xuXG4gICAgICAgICAgICBpZiAoY29tcGFyZURlcGVuZGVuY2llc1NhbWUoUmVxRmlsZS5kZXBlbmRlbmNpZXMsIG5ld0RlcHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoUmVxRmlsZS5zdGF0dXMgPT0gMClcbiAgICAgICAgICAgIHJldHVybiBSZXFGaWxlLm1vZGVsO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcHlQYXRoID0gZmlsZVBhdGg7XG4gICAgbGV0IHN0YXRpY19tb2R1bGVzID0gZmFsc2U7XG5cbiAgICBpZiAoIVJlcUZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoWzBdID09ICcuJykge1xuXG4gICAgICAgICAgICBpZiAoZmlsZVBhdGhbMV0gPT0gJy8nKVxuICAgICAgICAgICAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xuXG4gICAgICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwYXRoLnJlbGF0aXZlKHR5cGVBcnJheVswXSwgX19kaXJuYW1lKSwgZmlsZVBhdGgpO1xuICAgICAgICB9IGVsc2UgaWYgKGZpbGVQYXRoWzBdICE9ICcvJylcbiAgICAgICAgICAgIHN0YXRpY19tb2R1bGVzID0gdHJ1ZTtcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZygxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGVQYXRoID0gUmVxRmlsZS5wYXRoO1xuICAgICAgICBzdGF0aWNfbW9kdWxlcyA9IFJlcUZpbGUuc3RhdGljO1xuICAgIH1cblxuICAgIGlmIChzdGF0aWNfbW9kdWxlcylcbiAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgQWxpYXNPclBhY2thZ2UoY29weVBhdGgpLCBzdGF0dXM6IC0xLCBzdGF0aWM6IHRydWUsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGFkZCBzZXJ2LmpzIG9yIHNlcnYudHMgaWYgbmVlZGVkXG4gICAgICAgIGZpbGVQYXRoID0gQWRkRXh0ZW5zaW9uKGZpbGVQYXRoKTtcblxuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHR5cGVBcnJheVswXSArIGZpbGVQYXRoO1xuICAgICAgICBmaWxlRXhpc3RzID0gZmlsZUV4aXN0cyA/PyBhd2FpdCBFYXN5RnMuc3RhdChmdWxsUGF0aCwgJ210aW1lTXMnLCB0cnVlLCAwKTtcblxuICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgaGF2ZU1vZGVsID0gQ2FjaGVSZXF1aXJlRmlsZXNbZmlsZVBhdGhdO1xuICAgICAgICAgICAgaWYgKGhhdmVNb2RlbCAmJiBjb21wYXJlRGVwZW5kZW5jaWVzU2FtZShoYXZlTW9kZWwuZGVwZW5kZW5jaWVzLCBuZXdEZXBzID0gbmV3RGVwcyA/PyBhd2FpdCBtYWtlRGVwZW5kZW5jaWVzKGhhdmVNb2RlbC5kZXBlbmRlbmNpZXMsIHR5cGVBcnJheSkpKVxuICAgICAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IGhhdmVNb2RlbDtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0RlcHMgPSBuZXdEZXBzID8/IHt9O1xuXG4gICAgICAgICAgICAgICAgTGFzdFJlcXVpcmVbY29weVBhdGhdID0geyBtb2RlbDogYXdhaXQgSW1wb3J0RmlsZShfX2ZpbGVuYW1lLCBmaWxlUGF0aCwgdHlwZUFycmF5LCBpc0RlYnVnLCBuZXdEZXBzLCBoYXZlTW9kZWwgJiYgZ2V0Q2hhbmdlQXJyYXkoaGF2ZU1vZGVsLmRlcGVuZGVuY2llcywgbmV3RGVwcykpLCBkZXBlbmRlbmNpZXM6IG5ld0RlcHMsIHBhdGg6IGZpbGVQYXRoIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIExhc3RSZXF1aXJlW2NvcHlQYXRoXSA9IHsgbW9kZWw6IHt9LCBzdGF0dXM6IDAsIHBhdGg6IGZpbGVQYXRoIH07XG4gICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybicsXG4gICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnaW1wb3J0LW5vdC1leGlzdHMnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGBJbXBvcnQgJyR7ZmlsZVBhdGh9JyBkb2VzIG5vdCBleGlzdHMgZnJvbSAnJHtfX2ZpbGVuYW1lfSdgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYnVpbHRNb2RlbCA9IExhc3RSZXF1aXJlW2NvcHlQYXRoXTtcbiAgICBDYWNoZVJlcXVpcmVGaWxlc1tidWlsdE1vZGVsLnBhdGhdID0gYnVpbHRNb2RlbDtcblxuICAgIHJldHVybiBidWlsdE1vZGVsLm1vZGVsO1xufSIsICJpbXBvcnQgUmVxdWlyZUZpbGUgZnJvbSAnLi9JbXBvcnRGaWxlUnVudGltZSc7XG5pbXBvcnQgeyBnZXRUeXBlcyB9IGZyb20gJy4vU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyBDdXRUaGVMYXN0LCB0cmltVHlwZSwgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgR2V0UGx1Z2luIH0gZnJvbSAnLi4vQ29tcGlsZUNvZGUvSW5zZXJ0TW9kZWxzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcblxuLy8gLS0gc3RhcnQgb2YgZmV0Y2ggZmlsZSArIGNhY2hlIC0tXG5cbnR5cGUgYXBpSW5mbyA9IHtcbiAgICBwYXRoU3BsaXQ6IG51bWJlcixcbiAgICBkZXBzTWFwOiB7IFtrZXk6IHN0cmluZ106IGFueSB9XG59XG5cbmNvbnN0IGFwaVN0YXRpY01hcDogeyBba2V5OiBzdHJpbmddOiBhcGlJbmZvIH0gPSB7fTtcblxuLyoqXG4gKiBHaXZlbiBhIHVybCwgcmV0dXJuIHRoZSBzdGF0aWMgcGF0aCBhbmQgZGF0YSBpbmZvIGlmIHRoZSB1cmwgaXMgaW4gdGhlIHN0YXRpYyBtYXBcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgdGhlIHVzZXIgaXMgcmVxdWVzdGluZy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXRoU3BsaXQgLSB0aGUgbnVtYmVyIG9mIHNsYXNoZXMgaW4gdGhlIHVybC5cbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6XG4gKi9cbmZ1bmN0aW9uIGdldEFwaUZyb21NYXAodXJsOiBzdHJpbmcsIHBhdGhTcGxpdDogbnVtYmVyKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFwaVN0YXRpY01hcCk7XG4gICAgZm9yIChjb25zdCBpIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgZSA9IGFwaVN0YXRpY01hcFtpXTtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGkpICYmIGUucGF0aFNwbGl0ID09IHBhdGhTcGxpdClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdGljUGF0aDogaSxcbiAgICAgICAgICAgICAgICBkYXRhSW5mbzogZVxuICAgICAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogRmluZCB0aGUgQVBJIGZpbGUgZm9yIGEgZ2l2ZW4gVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiB0aGUgQVBJLlxuICogQHJldHVybnMgVGhlIHBhdGggdG8gdGhlIEFQSSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBmaW5kQXBpUGF0aCh1cmw6IHN0cmluZykge1xuXG4gICAgd2hpbGUgKHVybC5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQYXRoID0gcGF0aC5qb2luKGdldFR5cGVzLlN0YXRpY1swXSwgdXJsICsgJy5hcGknKTtcbiAgICAgICAgY29uc3QgbWFrZVByb21pc2UgPSBhc3luYyAodHlwZTogc3RyaW5nKSA9PiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoc3RhcnRQYXRoICsgJy4nICsgdHlwZSkgJiYgdHlwZSk7XG5cbiAgICAgICAgY29uc3QgZmlsZVR5cGUgPSAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgbWFrZVByb21pc2UoJ3RzJyksXG4gICAgICAgICAgICBtYWtlUHJvbWlzZSgnanMnKVxuICAgICAgICBdKSkuZmlsdGVyKHggPT4geCkuc2hpZnQoKTtcblxuICAgICAgICBpZiAoZmlsZVR5cGUpXG4gICAgICAgICAgICByZXR1cm4gdXJsICsgJy5hcGkuJyArIGZpbGVUeXBlO1xuXG4gICAgICAgIHVybCA9IEN1dFRoZUxhc3QoJy8nLCB1cmwpO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIHVybDogc3RyaW5nLCBpc0RlYnVnOiBib29sZWFuLCBuZXh0UHJhc2U6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHBhdGhTcGxpdCA9IHVybC5zcGxpdCgnLycpLmxlbmd0aDtcbiAgICBsZXQgeyBzdGF0aWNQYXRoLCBkYXRhSW5mbyB9ID0gZ2V0QXBpRnJvbU1hcCh1cmwsIHBhdGhTcGxpdCk7XG5cbiAgICBpZiAoIWRhdGFJbmZvKSB7XG4gICAgICAgIHN0YXRpY1BhdGggPSBhd2FpdCBmaW5kQXBpUGF0aCh1cmwpO1xuXG4gICAgICAgIGlmIChzdGF0aWNQYXRoKSB7XG4gICAgICAgICAgICBkYXRhSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBwYXRoU3BsaXQsXG4gICAgICAgICAgICAgICAgZGVwc01hcDoge31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBpU3RhdGljTWFwW3N0YXRpY1BhdGhdID0gZGF0YUluZm87XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YUluZm8pIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IE1ha2VDYWxsKFxuICAgICAgICAgICAgYXdhaXQgUmVxdWlyZUZpbGUoJy8nICsgc3RhdGljUGF0aCwgJ2FwaS1jYWxsJywgJycsIGdldFR5cGVzLlN0YXRpYywgZGF0YUluZm8uZGVwc01hcCwgaXNEZWJ1ZyksXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICB1cmwuc3Vic3RyaW5nKHN0YXRpY1BhdGgubGVuZ3RoIC0gNiksXG4gICAgICAgICAgICBpc0RlYnVnLFxuICAgICAgICAgICAgbmV4dFByYXNlXG4gICAgICAgICk7XG4gICAgfVxufVxuLy8gLS0gZW5kIG9mIGZldGNoIGZpbGUgLS1cbmNvbnN0IGJhbldvcmRzID0gWyd2YWxpZGF0ZVVSTCcsICd2YWxpZGF0ZUZ1bmMnLCAnZnVuYycsICdkZWZpbmUnLCAuLi5odHRwLk1FVEhPRFNdO1xuLyoqXG4gKiBGaW5kIHRoZSBCZXN0IFBhdGhcbiAqL1xuZnVuY3Rpb24gZmluZEJlc3RVcmxPYmplY3Qob2JqOiBhbnksIHVybEZyb206IHN0cmluZykge1xuICAgIGxldCBtYXhMZW5ndGggPSAwLCB1cmwgPSAnJztcblxuICAgIGZvciAoY29uc3QgaSBpbiBvYmopIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaS5sZW5ndGg7XG4gICAgICAgIGlmIChtYXhMZW5ndGggPCBsZW5ndGggJiYgdXJsRnJvbS5zdGFydHNXaXRoKGkpICYmICFiYW5Xb3Jkcy5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgICAgbWF4TGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICAgICAgdXJsID0gaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogUGFyc2UgQW5kIFZhbGlkYXRlIFVSTFxuICovXG5hc3luYyBmdW5jdGlvbiBwYXJzZVVSTERhdGEodmFsaWRhdGU6IGFueSwgdmFsdWU6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCBtYWtlTWFzc2FnZTogKGU6IGFueSkgPT4gc3RyaW5nKSB7XG4gICAgbGV0IHB1c2hEYXRhID0gdmFsdWUsIHJlc0RhdGEgPSB0cnVlLCBlcnJvcjogc3RyaW5nO1xuXG4gICAgc3dpdGNoICh2YWxpZGF0ZSkge1xuICAgICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgY2FzZSBwYXJzZUZsb2F0OlxuICAgICAgICBjYXNlIHBhcnNlSW50OlxuICAgICAgICAgICAgcHVzaERhdGEgPSAoPGFueT52YWxpZGF0ZSkodmFsdWUpO1xuICAgICAgICAgICAgcmVzRGF0YSA9ICFpc05hTihwdXNoRGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBCb29sZWFuOlxuICAgICAgICAgICAgcHVzaERhdGEgPSB2YWx1ZSAhPSAnZmFsc2UnO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcmVzRGF0YSA9IHZhbHVlID09ICd0cnVlJyB8fCB2YWx1ZSA9PSAnZmFsc2UnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2FueSc6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbGlkYXRlKSlcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gdmFsaWRhdGUuaW5jbHVkZXModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWtlVmFsaWQgPSBhd2FpdCB2YWxpZGF0ZSh2YWx1ZSwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWFrZVZhbGlkICYmIHR5cGVvZiBtYWtlVmFsaWQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBtYWtlVmFsaWQudmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoRGF0YSA9IG1ha2VWYWxpZC5wYXJzZSA/PyB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gbWFrZVZhbGlkO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9ICdFcnJvciBvbiBmdW5jdGlvbiB2YWxpZGF0b3IsIGZpbGVkIC0gJyArIG1ha2VNYXNzYWdlKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodmFsaWRhdGUgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IHZhbGlkYXRlLnRlc3QodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghcmVzRGF0YSlcbiAgICAgICAgZXJyb3IgPSAnRXJyb3IgdmFsaWRhdGUgZmlsZWQgLSAnICsgdmFsdWU7XG5cbiAgICByZXR1cm4gW2Vycm9yLCBwdXNoRGF0YV07XG59XG5cbi8qKlxuICogSXQgdGFrZXMgdGhlIFVSTCBkYXRhIGFuZCBwYXJzZXMgaXQgaW50byBhbiBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gb2JqIC0gdGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBVUkwgZGVmaW5pdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHVybEZyb20gLSBUaGUgVVJMIHRoYXQgd2FzIHBhc3NlZCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHthbnl9IGRlZmluZU9iamVjdCAtIEFsbCB0aGUgZGVmaW5pdGlvbnMgdGhhdCBoYXMgYmVlbiBmb3VuZFxuICogQHBhcmFtIHthbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge2FueX0gUmVzcG9uc2UgLSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogQHBhcmFtIG1ha2VNYXNzYWdlIC0gQ3JlYXRlIGFuIGVycm9yIG1lc3NhZ2VcbiAqIEByZXR1cm5zIEEgc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIGFuIGVycm9yIHByb3BlcnR5LlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlRGVmaW5pdGlvbihvYmo6IGFueSwgdXJsRnJvbTogc3RyaW5nLCBkZWZpbmVPYmplY3Q6IGFueSwgUmVxdWVzdDogYW55LCBSZXNwb25zZTogYW55LCBtYWtlTWFzc2FnZTogKGU6IGFueSkgPT4gc3RyaW5nKSB7XG4gICAgaWYgKCFvYmouZGVmaW5lKVxuICAgICAgICByZXR1cm4gdXJsRnJvbTtcblxuICAgIGNvbnN0IHZhbGlkYXRlRnVuYyA9IG9iai5kZWZpbmUudmFsaWRhdGVGdW5jO1xuICAgIG9iai5kZWZpbmUudmFsaWRhdGVGdW5jID0gbnVsbDtcbiAgICBkZWxldGUgb2JqLmRlZmluZS52YWxpZGF0ZUZ1bmM7XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb2JqLmRlZmluZSkge1xuICAgICAgICBjb25zdCBbZGF0YVNsYXNoLCBuZXh0VXJsRnJvbV0gPSBTcGxpdEZpcnN0KCcvJywgdXJsRnJvbSk7XG4gICAgICAgIHVybEZyb20gPSBuZXh0VXJsRnJvbTtcblxuICAgICAgICBjb25zdCBbZXJyb3IsIG5ld0RhdGFdID0gYXdhaXQgcGFyc2VVUkxEYXRhKG9iai5kZWZpbmVbbmFtZV0sIGRhdGFTbGFzaCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTtcblxuICAgICAgICBpZihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB7ZXJyb3J9O1xuICAgICAgICBcbiAgICAgICAgZGVmaW5lT2JqZWN0W25hbWVdID0gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBpZiAodmFsaWRhdGVGdW5jKSB7XG4gICAgICAgIGxldCB2YWxpZGF0ZTogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSBhd2FpdCB2YWxpZGF0ZUZ1bmMoZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvcicgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHR5cGVvZiB2YWxpZGF0ZSA9PSAnc3RyaW5nJyA/IHZhbGlkYXRlOiAnRXJyb3IgdmFsaWRhdGluZyBVUkwnfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsRnJvbTtcbn1cbi8qKlxuICogVGhlIGZ1bmN0aW9uIHdpbGwgcGFyc2UgdGhlIHVybCBhbmQgZmluZCB0aGUgYmVzdCBtYXRjaCBmb3IgdGhlIHVybFxuICogQHBhcmFtIHthbnl9IGZpbGVNb2R1bGUgLSB0aGUgbW9kdWxlIHRoYXQgY29udGFpbnMgdGhlIG1ldGhvZCB0aGF0IHlvdSB3YW50IHRvIGNhbGwuXG4gKiBAcGFyYW0ge2FueX0gUmVxdWVzdCAtIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAqIEBwYXJhbSB7YW55fSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsRnJvbSAtIHRoZSB1cmwgdGhhdCB0aGUgdXNlciByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRGVidWcgLSBib29sZWFuLFxuICogQHBhcmFtIG5leHRQcmFzZSAtICgpID0+IFByb21pc2U8YW55PlxuICogQHJldHVybnMgYSBib29sZWFuIHZhbHVlLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlLCB0aGUgcmVxdWVzdCBpcyBwcm9jZXNzZWQuIElmIHRoZSBmdW5jdGlvblxuICogcmV0dXJucyBmYWxzZSwgdGhlIHJlcXVlc3QgaXMgbm90IHByb2Nlc3NlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gTWFrZUNhbGwoZmlsZU1vZHVsZTogYW55LCBSZXF1ZXN0OiBhbnksIFJlc3BvbnNlOiBhbnksIHVybEZyb206IHN0cmluZywgaXNEZWJ1ZzogYm9vbGVhbiwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCBhbGxvd0Vycm9ySW5mbyA9ICFHZXRQbHVnaW4oXCJTYWZlRGVidWdcIikgJiYgaXNEZWJ1ZywgbWFrZU1hc3NhZ2UgPSAoZTogYW55KSA9PiAoaXNEZWJ1ZyA/IHByaW50LmVycm9yKGUpIDogbnVsbCkgKyAoYWxsb3dFcnJvckluZm8gPyBgLCBtZXNzYWdlOiAke2UubWVzc2FnZX1gIDogJycpO1xuICAgIGNvbnN0IG1ldGhvZCA9IFJlcXVlc3QubWV0aG9kO1xuICAgIGxldCBtZXRob2RPYmogPSBmaWxlTW9kdWxlW21ldGhvZF0gfHwgZmlsZU1vZHVsZS5kZWZhdWx0W21ldGhvZF07IC8vTG9hZGluZyB0aGUgbW9kdWxlIGJ5IG1ldGhvZFxuICAgIGxldCBoYXZlTWV0aG9kID0gdHJ1ZTtcblxuICAgIGlmKCFtZXRob2RPYmope1xuICAgICAgICBoYXZlTWV0aG9kID0gZmFsc2U7XG4gICAgICAgIG1ldGhvZE9iaiA9IGZpbGVNb2R1bGUuZGVmYXVsdCB8fCBmaWxlTW9kdWxlO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2VNZXRob2QgPSBtZXRob2RPYmo7XG5cbiAgICBjb25zdCBkZWZpbmVPYmplY3QgPSB7fTtcblxuICAgIGNvbnN0IGRhdGFEZWZpbmUgPSBhd2FpdCBtYWtlRGVmaW5pdGlvbihtZXRob2RPYmosIHVybEZyb20sIGRlZmluZU9iamVjdCwgUmVxdWVzdCwgUmVzcG9uc2UsIG1ha2VNYXNzYWdlKTsgLy8gcm9vdCBsZXZlbCBkZWZpbml0aW9uXG4gICAgaWYoKDxhbnk+ZGF0YURlZmluZSkuZXJyb3IpIHJldHVybiBSZXNwb25zZS5qc29uKGRhdGFEZWZpbmUpO1xuICAgIHVybEZyb20gPSA8c3RyaW5nPmRhdGFEZWZpbmU7XG5cbiAgICBsZXQgbmVzdGVkVVJMID0gZmluZEJlc3RVcmxPYmplY3QobWV0aG9kT2JqLCB1cmxGcm9tKTtcblxuICAgIC8vcGFyc2UgdGhlIHVybCBwYXRoXG4gICAgZm9yKGxldCBpID0gMDsgaTwgMjsgaSsrKXtcbiAgICAgICAgd2hpbGUgKChuZXN0ZWRVUkwgPSBmaW5kQmVzdFVybE9iamVjdChtZXRob2RPYmosIHVybEZyb20pKSkge1xuICAgICAgICAgICAgY29uc3QgZGF0YURlZmluZSA9IGF3YWl0IG1ha2VEZWZpbml0aW9uKG1ldGhvZE9iaiwgdXJsRnJvbSwgZGVmaW5lT2JqZWN0LCBSZXF1ZXN0LCBSZXNwb25zZSwgbWFrZU1hc3NhZ2UpO1xuICAgICAgICAgICAgaWYoKDxhbnk+ZGF0YURlZmluZSkuZXJyb3IpIHJldHVybiBSZXNwb25zZS5qc29uKGRhdGFEZWZpbmUpO1xuICAgICAgICAgICAgdXJsRnJvbSA9IDxzdHJpbmc+ZGF0YURlZmluZTtcbiAgICBcbiAgICAgICAgICAgIHVybEZyb20gPSB0cmltVHlwZSgnLycsIHVybEZyb20uc3Vic3RyaW5nKG5lc3RlZFVSTC5sZW5ndGgpKTtcbiAgICAgICAgICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9ialtuZXN0ZWRVUkxdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWhhdmVNZXRob2QpeyAvLyBjaGVjayBpZiB0aGF0IGEgbWV0aG9kXG4gICAgICAgICAgICBoYXZlTWV0aG9kID0gdHJ1ZTtcbiAgICAgICAgICAgIG1ldGhvZE9iaiA9IG1ldGhvZE9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWV0aG9kT2JqID0gbWV0aG9kT2JqPy5mdW5jICYmIG1ldGhvZE9iaiB8fCBiYXNlTWV0aG9kOyAvLyBpZiB0aGVyZSBpcyBhbiAnYW55JyBtZXRob2RcblxuXG4gICAgaWYgKCFtZXRob2RPYmo/LmZ1bmMpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGxlZnREYXRhID0gdXJsRnJvbS5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHVybERhdGEgPSBbXTtcblxuXG4gICAgbGV0IGVycm9yOiBzdHJpbmc7XG4gICAgaWYgKG1ldGhvZE9iai52YWxpZGF0ZVVSTCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgdmFsaWRhdGVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGhvZE9iai52YWxpZGF0ZVVSTCkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtlcnJvclVSTCwgcHVzaERhdGFdID0gYXdhaXQgcGFyc2VVUkxEYXRhKHZhbGlkYXRlLCBsZWZ0RGF0YVtpbmRleF0sIFJlcXVlc3QsIFJlc3BvbnNlLCBtYWtlTWFzc2FnZSk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvclVSTCkge1xuICAgICAgICAgICAgICAgIGVycm9yID0gPHN0cmluZz5lcnJvclVSTDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXJsRGF0YS5wdXNoKHB1c2hEYXRhKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZVxuICAgICAgICB1cmxEYXRhLnB1c2goLi4ubGVmdERhdGEpO1xuXG4gICAgaWYgKCFlcnJvciAmJiBtZXRob2RPYmoudmFsaWRhdGVGdW5jKSB7XG4gICAgICAgIGxldCB2YWxpZGF0ZTogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSBhd2FpdCBtZXRob2RPYmoudmFsaWRhdGVGdW5jKGxlZnREYXRhLCBSZXF1ZXN0LCBSZXNwb25zZSwgdXJsRGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlID0gJ0Vycm9yIG9uIGZ1bmN0aW9uIHZhbGlkYXRvcicgKyBtYWtlTWFzc2FnZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGUgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICBlcnJvciA9IHZhbGlkYXRlO1xuICAgICAgICBlbHNlIGlmICghdmFsaWRhdGUpXG4gICAgICAgICAgICBlcnJvciA9ICdFcnJvciB2YWxpZGF0aW5nIFVSTCc7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yKVxuICAgICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yIH0pO1xuXG4gICAgY29uc3QgZmluYWxTdGVwID0gYXdhaXQgbmV4dFByYXNlKCk7IC8vIHBhcnNlIGRhdGEgZnJvbSBtZXRob2RzIC0gcG9zdCwgZ2V0Li4uICsgY29va2llcywgc2Vzc2lvbi4uLlxuXG4gICAgbGV0IGFwaVJlc3BvbnNlOiBhbnksIG5ld1Jlc3BvbnNlOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgYXBpUmVzcG9uc2UgPSBhd2FpdCBtZXRob2RPYmouZnVuYyhSZXF1ZXN0LCBSZXNwb25zZSwgdXJsRGF0YSwgZGVmaW5lT2JqZWN0LCBsZWZ0RGF0YSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoYWxsb3dFcnJvckluZm8pXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IHsgZXJyb3I6IGUubWVzc2FnZSB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0geyBlcnJvcjogJzUwMCAtIEludGVybmFsIFNlcnZlciBFcnJvcicgfTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFwaVJlc3BvbnNlID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSB7IHRleHQ6IGFwaVJlc3BvbnNlIH07XG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgICBuZXdSZXNwb25zZSA9IGFwaVJlc3BvbnNlO1xuXG4gICAgZmluYWxTdGVwKCk7ICAvLyBzYXZlIGNvb2tpZXMgKyBjb2RlXG5cbiAgICBpZiAobmV3UmVzcG9uc2UgIT0gbnVsbClcbiAgICAgICAgUmVzcG9uc2UuanNvbihuZXdSZXNwb25zZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn0iLCAiaW1wb3J0IEVhc3lGcyBmcm9tICcuLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCB7IGdldFR5cGVzLCBCYXNpY1NldHRpbmdzfSBmcm9tICcuL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgRmFzdENvbXBpbGUgYXMgRmFzdENvbXBpbGUgfSBmcm9tICcuL1NlYXJjaFBhZ2VzJztcbmltcG9ydCB7IEdldEZpbGUgYXMgR2V0U3RhdGljRmlsZSwgc2VydmVyQnVpbGQgfSBmcm9tICcuLi9JbXBvcnRGaWxlcy9TdGF0aWNGaWxlcyc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0ICogYXMgRnVuY1NjcmlwdCBmcm9tICcuL0Z1bmN0aW9uU2NyaXB0JztcbmltcG9ydCBNYWtlQXBpQ2FsbCBmcm9tICcuL0FwaUNhbGwnO1xuaW1wb3J0IHsgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlLCBwYWdlRGVwcyB9IGZyb20gJy4uL091dHB1dElucHV0L1N0b3JlRGVwcyc7XG5jb25zdCB7IEV4cG9ydCB9ID0gRnVuY1NjcmlwdDtcblxuZXhwb3J0IGludGVyZmFjZSBFcnJvclBhZ2VzIHtcbiAgICBub3RGb3VuZD86IHtcbiAgICAgICAgcGF0aDogc3RyaW5nLFxuICAgICAgICBjb2RlPzogbnVtYmVyXG4gICAgfSxcbiAgICBzZXJ2ZXJFcnJvcj86IHtcbiAgICAgICAgcGF0aDogc3RyaW5nLFxuICAgICAgICBjb2RlPzogbnVtYmVyXG4gICAgfVxufVxuXG5pbnRlcmZhY2UgR2V0UGFnZXNTZXR0aW5ncyB7XG4gICAgQ2FjaGVEYXlzOiBudW1iZXIsXG4gICAgUGFnZVJhbTogYm9vbGVhbixcbiAgICBEZXZNb2RlOiBib29sZWFuLFxuICAgIENvb2tpZVNldHRpbmdzPzogYW55LFxuICAgIENvb2tpZXM/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBDb29raWVFbmNyeXB0ZXI/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBTZXNzaW9uU3RvcmU/OiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PixcbiAgICBFcnJvclBhZ2VzOiBFcnJvclBhZ2VzXG59XG5cbmNvbnN0IFNldHRpbmdzOiBHZXRQYWdlc1NldHRpbmdzID0ge1xuICAgIENhY2hlRGF5czogMSxcbiAgICBQYWdlUmFtOiBmYWxzZSxcbiAgICBEZXZNb2RlOiB0cnVlLFxuICAgIEVycm9yUGFnZXM6IHt9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvYWRQYWdlVG9SYW0odXJsOiBzdHJpbmcpIHtcbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoRnVuY1NjcmlwdC5nZXRGdWxsUGF0aENvbXBpbGUodXJsKSkpIHtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF0gPSBbXTtcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0gPSBhd2FpdCBGdW5jU2NyaXB0LkxvYWRQYWdlKHVybCk7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVt1cmxdWzFdID0gRnVuY1NjcmlwdC5CdWlsZFBhZ2UoRXhwb3J0LlBhZ2VMb2FkUmFtW3VybF1bMF0sIHVybCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBMb2FkQWxsUGFnZXNUb1JhbSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gcGFnZURlcHMuc3RvcmUpIHtcbiAgICAgICAgaWYgKCFFeHRlbnNpb25JbkFycmF5KGksIDxhbnk+QmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSkpXG4gICAgICAgICAgICBhd2FpdCBMb2FkUGFnZVRvUmFtKGkpO1xuXG4gICAgfVxufVxuXG5mdW5jdGlvbiBDbGVhckFsbFBhZ2VzRnJvbVJhbSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gRXhwb3J0LlBhZ2VMb2FkUmFtKSB7XG4gICAgICAgIEV4cG9ydC5QYWdlTG9hZFJhbVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGVsZXRlIEV4cG9ydC5QYWdlTG9hZFJhbVtpXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIEV4dGVuc2lvbkluQXJyYXkoZmlsZVBhdGg6IHN0cmluZywgLi4uYXJyYXlzOiBzdHJpbmdbXSkge1xuICAgIGZpbGVQYXRoID0gZmlsZVBhdGgudG9Mb3dlckNhc2UoKTtcbiAgICBmb3IgKGNvbnN0IGFycmF5IG9mIGFycmF5cykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aC5zdWJzdHJpbmcoZmlsZVBhdGgubGVuZ3RoIC0gaS5sZW5ndGggLSAxKSA9PSAnLicgKyBpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBHZXRFcnJvclBhZ2UoY29kZTogbnVtYmVyLCBMb2NTZXR0aW5nczogJ25vdEZvdW5kJyB8ICdzZXJ2ZXJFcnJvcicpIHtcbiAgICBsZXQgYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmc7XG4gICAgaWYgKFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdKSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGdldFR5cGVzLlN0YXRpYztcbiAgICAgICAgdXJsID0gU2V0dGluZ3MuRXJyb3JQYWdlc1tMb2NTZXR0aW5nc10ucGF0aDtcbiAgICAgICAgY29kZSA9IFNldHRpbmdzLkVycm9yUGFnZXNbTG9jU2V0dGluZ3NdLmNvZGUgPz8gY29kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVR5cGUgPSBnZXRUeXBlcy5Mb2dzO1xuICAgICAgICB1cmwgPSAnZScgKyBjb2RlO1xuICAgIH1cbiAgICByZXR1cm4geyB1cmwsIGFycmF5VHlwZSwgY29kZSB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIFBhcnNlQmFzaWNJbmZvKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSwgY29kZTogbnVtYmVyKSB7XG4gICAgLy9maXJzdCBzdGVwIC0gcGFyc2UgaW5mb1xuICAgIGlmIChSZXF1ZXN0Lm1ldGhvZCA9PSBcIlBPU1RcIikge1xuICAgICAgICBpZiAoIVJlcXVlc3QuYm9keSB8fCAhT2JqZWN0LmtleXMoUmVxdWVzdC5ib2R5KS5sZW5ndGgpXG4gICAgICAgICAgICBSZXF1ZXN0LmJvZHkgPSBSZXF1ZXN0LmZpZWxkcyB8fCB7fTtcblxuICAgIH0gZWxzZVxuICAgICAgICBSZXF1ZXN0LmJvZHkgPSBmYWxzZTtcblxuXG4gICAgaWYgKFJlcXVlc3QuY2xvc2VkKVxuICAgICAgICByZXR1cm47XG5cblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuQ29va2llcyhSZXF1ZXN0LCBSZXNwb25zZSwgbmV4dCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKG5leHQgPT4gU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyKFJlcXVlc3QsIFJlc3BvbnNlLCBuZXh0KSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UobmV4dCA9PiBTZXR0aW5ncy5TZXNzaW9uU3RvcmUoUmVxdWVzdCwgUmVzcG9uc2UsIG5leHQpKTtcblxuICAgIFJlcXVlc3Quc2lnbmVkQ29va2llcyA9IFJlcXVlc3Quc2lnbmVkQ29va2llcyB8fCB7fTtcbiAgICBSZXF1ZXN0LmZpbGVzID0gUmVxdWVzdC5maWxlcyB8fCB7fTtcblxuICAgIGNvbnN0IENvcHlDb29raWVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShSZXF1ZXN0LnNpZ25lZENvb2tpZXMpKTtcbiAgICBSZXF1ZXN0LmNvb2tpZXMgPSBSZXF1ZXN0LnNpZ25lZENvb2tpZXM7XG5cbiAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gMjAxO1xuXG4gICAgLy9zZWNvbmQgc3RlcFxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChSZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDEpXG4gICAgICAgICAgICBSZXNwb25zZS5zdGF0dXNDb2RlID0gY29kZTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBSZXF1ZXN0LnNpZ25lZENvb2tpZXMpIHsvL3VwZGF0ZSBjb29raWVzXG4gICAgICAgICAgICBpZiAodHlwZW9mIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSAhPSAnb2JqZWN0JyAmJiBSZXF1ZXN0LnNpZ25lZENvb2tpZXNbaV0gIT0gQ29weUNvb2tpZXNbaV0gfHwgSlNPTi5zdHJpbmdpZnkoUmVxdWVzdC5zaWduZWRDb29raWVzW2ldKSAhPSBKU09OLnN0cmluZ2lmeShDb3B5Q29va2llc1tpXSkpXG4gICAgICAgICAgICAgICAgUmVzcG9uc2UuY29va2llKGksIFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSwgU2V0dGluZ3MuQ29va2llU2V0dGluZ3MpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gQ29weUNvb2tpZXMpIHsvL2RlbGV0ZSBub3QgZXhpdHMgY29va2llc1xuICAgICAgICAgICAgaWYgKFJlcXVlc3Quc2lnbmVkQ29va2llc1tpXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIFJlc3BvbnNlLmNsZWFyQ29va2llKGkpO1xuXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vZm9yIGZpbmFsIHN0ZXBcbmZ1bmN0aW9uIG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55KSB7XG4gICAgaWYgKCFSZXF1ZXN0LmZpbGVzKSAvL2RlbGV0ZSBmaWxlc1xuICAgICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IGFyclBhdGggPSBbXVxuXG4gICAgZm9yIChjb25zdCBpIGluIFJlcXVlc3QuZmlsZXMpIHtcblxuICAgICAgICBjb25zdCBlID0gUmVxdWVzdC5maWxlc1tpXTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBpbiBlKSB7XG4gICAgICAgICAgICAgICAgYXJyUGF0aC5wdXNoKGVbYV0uZmlsZXBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGFyclBhdGgucHVzaChlLmZpbGVwYXRoKTtcblxuICAgIH1cblxuICAgIHJldHVybiBhcnJQYXRoO1xufVxuXG4vL2ZpbmFsIHN0ZXBcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJlcXVlc3RGaWxlcyhhcnJheTogc3RyaW5nW10pIHtcbiAgICBmb3IoY29uc3QgZSBpbiBhcnJheSlcbiAgICAgICAgYXdhaXQgRWFzeUZzLnVubGlua0lmRXhpc3RzKGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpc1VSTFBhdGhBRmlsZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCB1cmw6IHN0cmluZywgYXJyYXlUeXBlOiBzdHJpbmdbXSwgY29kZTogbnVtYmVyKSB7XG4gICAgbGV0IGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzJdO1xuICAgIGxldCBmaWxlID0gZmFsc2U7XG5cbiAgICBpZiAoY29kZSA9PSAyMDApIHtcbiAgICAgICAgZnVsbFBhZ2VVcmwgPSBnZXRUeXBlcy5TdGF0aWNbMF0gKyB1cmw7XG4gICAgICAgIC8vY2hlY2sgdGhhdCBpcyBub3Qgc2VydmVyIGZpbGVcbiAgICAgICAgaWYgKGF3YWl0IHNlcnZlckJ1aWxkKFJlcXVlc3QsIFNldHRpbmdzLkRldk1vZGUsIHVybCkgfHwgYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoZnVsbFBhZ2VVcmwpKVxuICAgICAgICAgICAgZmlsZSA9IHRydWU7XG4gICAgICAgIGVsc2UgIC8vIHRoZW4gaXQgYSBzZXJ2ZXIgcGFnZSBvciBlcnJvciBwYWdlXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IGFycmF5VHlwZVsyXTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBmaWxlLCBmdWxsUGFnZVVybCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBCdWlsZExvYWRQYWdlKHNtYWxsUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFnZUFycmF5ID0gW2F3YWl0IEZ1bmNTY3JpcHQuTG9hZFBhZ2Uoc21hbGxQYXRoKV07XG5cbiAgICBwYWdlQXJyYXlbMV0gPSBGdW5jU2NyaXB0LkJ1aWxkUGFnZShwYWdlQXJyYXlbMF0sIHNtYWxsUGF0aCk7XG5cbiAgICBpZiAoU2V0dGluZ3MuUGFnZVJhbSlcbiAgICAgICAgRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF0gPSBwYWdlQXJyYXk7XG5cbiAgICByZXR1cm4gcGFnZUFycmF5WzFdO1xufVxuXG5hc3luYyBmdW5jdGlvbiBCdWlsZFBhZ2VVUkwoYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIHNtYWxsUGF0aDogc3RyaW5nLCBjb2RlOiBudW1iZXIpIHtcbiAgICBsZXQgZnVsbFBhZ2VVcmw6IHN0cmluZztcblxuICAgIGlmICghYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoYXJyYXlUeXBlWzBdICsgdXJsICsgJy4nICsgQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMucGFnZSkpIHtcbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gR2V0RXJyb3JQYWdlKDQwNCwgJ25vdEZvdW5kJyk7XG5cbiAgICAgICAgdXJsID0gRXJyb3JQYWdlLnVybDtcbiAgICAgICAgYXJyYXlUeXBlID0gRXJyb3JQYWdlLmFycmF5VHlwZTtcbiAgICAgICAgY29kZSA9IEVycm9yUGFnZS5jb2RlO1xuXG4gICAgICAgIHNtYWxsUGF0aCA9IGFycmF5VHlwZVsyXSArICcvJyArIHVybDtcbiAgICAgICAgZnVsbFBhZ2VVcmwgPSB1cmwgKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2U7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShhcnJheVR5cGVbMF0gKyBmdWxsUGFnZVVybCkpXG4gICAgICAgICAgICBmdWxsUGFnZVVybCA9IG51bGw7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bGxQYWdlVXJsID0gYXJyYXlUeXBlWzFdICsgZnVsbFBhZ2VVcmwgKyAnLmNqcyc7XG5cbiAgICB9IGVsc2VcbiAgICAgICAgZnVsbFBhZ2VVcmwgPSBhcnJheVR5cGVbMV0gKyB1cmwgKyBcIi5cIiArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UgKyAnLmNqcyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhcnJheVR5cGUsXG4gICAgICAgIGZ1bGxQYWdlVXJsLFxuICAgICAgICBzbWFsbFBhdGgsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIHVybFxuICAgIH1cbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gbG9hZCB0aGUgZHluYW1pYyBwYWdlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBUaGUgYXJyYXkgb2YgdHlwZXMgdGhhdCB0aGUgcGFnZSBpcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRoYXQgd2FzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsUGFnZVVybCAtIFRoZSBmdWxsIHBhdGggdG8gdGhlIHBhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gc21hbGxQYXRoIC0gVGhlIHBhdGggdG8gdGhlIHBhZ2UgZmlsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gVGhlIHN0YXR1cyBjb2RlIG9mIHRoZSBwYWdlLlxuICogQHJldHVybnMgVGhlIER5bmFtaWNGdW5jIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIGdlbmVyYXRlIHRoZSBwYWdlLlxuICogVGhlIGNvZGUgaXMgdGhlIHN0YXR1cyBjb2RlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAqIFRoZSBmdWxsUGFnZVVybCBpcyB0aGUgZnVsbCBwYXRoIHRvIHRoZSBwYWdlLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREeW5hbWljUGFnZShhcnJheVR5cGU6IHN0cmluZ1tdLCB1cmw6IHN0cmluZywgZnVsbFBhZ2VVcmw6IHN0cmluZywgc21hbGxQYXRoOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIGNvbnN0IFNldE5ld1VSTCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBhd2FpdCBCdWlsZFBhZ2VVUkwoYXJyYXlUeXBlLCB1cmwsIHNtYWxsUGF0aCwgY29kZSk7XG4gICAgICAgIHNtYWxsUGF0aCA9IGJ1aWxkLnNtYWxsUGF0aCwgdXJsID0gYnVpbGQudXJsLCBjb2RlID0gYnVpbGQuY29kZSwgZnVsbFBhZ2VVcmwgPSBidWlsZC5mdWxsUGFnZVVybCwgYXJyYXlUeXBlID0gYnVpbGQuYXJyYXlUeXBlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQgRHluYW1pY0Z1bmM6ICguLi5kYXRhOiBhbnlbXSkgPT4gYW55O1xuICAgIGlmIChTZXR0aW5ncy5EZXZNb2RlICYmIGF3YWl0IFNldE5ld1VSTCgpICYmIGZ1bGxQYWdlVXJsKSB7XG5cbiAgICAgICAgaWYgKCFhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShmdWxsUGFnZVVybCkgfHwgYXdhaXQgQ2hlY2tEZXBlbmRlbmN5Q2hhbmdlKHNtYWxsUGF0aCkpIHtcbiAgICAgICAgICAgIGF3YWl0IEZhc3RDb21waWxlKHVybCArICcuJyArIEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzLnBhZ2UsIGFycmF5VHlwZSk7XG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdKSB7XG5cbiAgICAgICAgICAgIGlmICghRXhwb3J0LlBhZ2VMb2FkUmFtW3NtYWxsUGF0aF1bMV0pIHtcbiAgICAgICAgICAgICAgICBEeW5hbWljRnVuYyA9IEZ1bmNTY3JpcHQuQnVpbGRQYWdlKEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzBdLCBzbWFsbFBhdGgpO1xuICAgICAgICAgICAgICAgIGlmIChTZXR0aW5ncy5QYWdlUmFtKVxuICAgICAgICAgICAgICAgICAgICBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXSA9IER5bmFtaWNGdW5jO1xuXG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICBEeW5hbWljRnVuYyA9IEV4cG9ydC5QYWdlTG9hZFJhbVtzbWFsbFBhdGhdWzFdO1xuXG5cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoKTtcblxuXG4gICAgfSBlbHNlIGlmIChFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXSlcbiAgICAgICAgRHluYW1pY0Z1bmMgPSBFeHBvcnQuUGFnZUxvYWRSYW1bc21hbGxQYXRoXVsxXTtcblxuICAgIGVsc2UgaWYgKCFTZXR0aW5ncy5QYWdlUmFtICYmIGF3YWl0IFNldE5ld1VSTCgpICYmIGZ1bGxQYWdlVXJsKVxuICAgICAgICBEeW5hbWljRnVuYyA9IGF3YWl0IEJ1aWxkTG9hZFBhZ2Uoc21hbGxQYXRoKTtcblxuICAgIGVsc2Uge1xuICAgICAgICBjb2RlID0gU2V0dGluZ3MuRXJyb3JQYWdlcy5ub3RGb3VuZD8uY29kZSA/PyA0MDQ7XG4gICAgICAgIGNvbnN0IEVycm9yUGFnZSA9IFNldHRpbmdzLkVycm9yUGFnZXMubm90Rm91bmQgJiYgRXhwb3J0LlBhZ2VMb2FkUmFtW2dldFR5cGVzLlN0YXRpY1syXSArICcvJyArIFNldHRpbmdzLkVycm9yUGFnZXMubm90Rm91bmQucGF0aF0gfHwgRXhwb3J0LlBhZ2VMb2FkUmFtW2dldFR5cGVzLkxvZ3NbMl0gKyAnL2U0MDQnXTtcblxuICAgICAgICBpZiAoRXJyb3JQYWdlKVxuICAgICAgICAgICAgRHluYW1pY0Z1bmMgPSBFcnJvclBhZ2VbMV07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bGxQYWdlVXJsID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBEeW5hbWljRnVuYyxcbiAgICAgICAgY29kZSxcbiAgICAgICAgZnVsbFBhZ2VVcmxcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIE1ha2VQYWdlUmVzcG9uc2UoRHluYW1pY1Jlc3BvbnNlOiBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSB8IGFueSkge1xuICAgIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoPy5maWxlKSB7XG4gICAgICAgIFJlc3BvbnNlLnNlbmRGaWxlKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGguZmlsZSk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBSZXNwb25zZS5vbignZmluaXNoJywgcmVzKSk7XG4gICAgfSBlbHNlIGlmIChEeW5hbWljUmVzcG9uc2UucmVkaXJlY3RQYXRoKSB7XG4gICAgICAgIFJlc3BvbnNlLndyaXRlSGVhZCgzMDIsIHsgTG9jYXRpb246IER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGggfSk7XG4gICAgICAgIFJlc3BvbnNlLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IFJlc1BhZ2UgPSBEeW5hbWljUmVzcG9uc2Uub3V0X3J1bl9zY3JpcHQudHJpbSgpO1xuICAgICAgICBpZiAoUmVzUGFnZSkge1xuICAgICAgICAgICAgUmVzcG9uc2Uuc2VuZChSZXNQYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFJlc3BvbnNlLmVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKER5bmFtaWNSZXNwb25zZS5yZWRpcmVjdFBhdGguZGVsZXRlQWZ0ZXIpIHtcbiAgICAgICAgYXdhaXQgRWFzeUZzLnVubGlua0lmRXhpc3RzKFJlc3BvbnNlLnJlZGlyZWN0UGF0aC5maWxlKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIGEgcmVxdWVzdCBpcyBtYWRlIHRvIGEgcGFnZS4gXG4gKiBJdCB3aWxsIGNoZWNrIGlmIHRoZSBwYWdlIGV4aXN0cywgYW5kIGlmIGl0IGRvZXMsIGl0IHdpbGwgcmV0dXJuIHRoZSBwYWdlLiBcbiAqIElmIGl0IGRvZXMgbm90IGV4aXN0LCBpdCB3aWxsIHJldHVybiBhIDQwNCBwYWdlXG4gKiBAcGFyYW0ge1JlcXVlc3QgfCBhbnl9IFJlcXVlc3QgLSBUaGUgcmVxdWVzdCBvYmplY3QuXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSBSZXNwb25zZSAtIFRoZSByZXNwb25zZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVR5cGUgLSBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgY29udGFpbnMgdGhlIHBhdGhzXG4gKiBsb2FkZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiB0aGUgcGFnZSB0aGF0IHdhcyByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0ge3sgZmlsZTogYm9vbGVhbiwgZnVsbFBhZ2VVcmw6IHN0cmluZyB9fSBGaWxlSW5mbyAtIHRoZSBmaWxlIGluZm8gb2YgdGhlIHBhZ2UgdGhhdCBpcyBiZWluZyBhY3RpdmF0ZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIG51bWJlclxuICogQHBhcmFtIG5leHRQcmFzZSAtIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS4gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGR5bmFtaWMgcGFnZVxuICogaXMgbG9hZGVkLlxuICogQHJldHVybnMgTm90aGluZy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gQWN0aXZhdGVQYWdlKFJlcXVlc3Q6IFJlcXVlc3QgfCBhbnksIFJlc3BvbnNlOiBSZXNwb25zZSwgYXJyYXlUeXBlOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsIEZpbGVJbmZvOiBhbnksIGNvZGU6IG51bWJlciwgbmV4dFByYXNlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcbiAgICBjb25zdCB7IER5bmFtaWNGdW5jLCBmdWxsUGFnZVVybCwgY29kZTogbmV3Q29kZSB9ID0gYXdhaXQgR2V0RHluYW1pY1BhZ2UoYXJyYXlUeXBlLCB1cmwsIEZpbGVJbmZvLmZ1bGxQYWdlVXJsLCBGaWxlSW5mby5mdWxsUGFnZVVybCArICcvJyArIHVybCwgY29kZSk7XG5cbiAgICBpZiAoIWZ1bGxQYWdlVXJsIHx8ICFEeW5hbWljRnVuYyAmJiBjb2RlID09IDUwMClcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLnNlbmRTdGF0dXMobmV3Q29kZSk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBmaW5hbFN0ZXAgPSBhd2FpdCBuZXh0UHJhc2UoKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG4gICAgICAgIGNvbnN0IHBhZ2VEYXRhID0gYXdhaXQgRHluYW1pY0Z1bmMoUmVzcG9uc2UsIFJlcXVlc3QsIFJlcXVlc3QuYm9keSwgUmVxdWVzdC5xdWVyeSwgUmVxdWVzdC5jb29raWVzLCBSZXF1ZXN0LnNlc3Npb24sIFJlcXVlc3QuZmlsZXMsIFNldHRpbmdzLkRldk1vZGUpO1xuICAgICAgICBmaW5hbFN0ZXAoKTsgLy8gc2F2ZSBjb29raWVzICsgY29kZVxuXG4gICAgICAgIGF3YWl0IE1ha2VQYWdlUmVzcG9uc2UoXG4gICAgICAgICAgICBwYWdlRGF0YSxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICBwcmludC5lcnJvcihlKTtcbiAgICAgICAgUmVxdWVzdC5lcnJvciA9IGU7XG5cbiAgICAgICAgY29uc3QgRXJyb3JQYWdlID0gR2V0RXJyb3JQYWdlKDUwMCwgJ3NlcnZlckVycm9yJyk7XG5cbiAgICAgICAgRHluYW1pY1BhZ2UoUmVxdWVzdCwgUmVzcG9uc2UsIEVycm9yUGFnZS51cmwsIEVycm9yUGFnZS5hcnJheVR5cGUsIEVycm9yUGFnZS5jb2RlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBEeW5hbWljUGFnZShSZXF1ZXN0OiBSZXF1ZXN0IHwgYW55LCBSZXNwb25zZTogUmVzcG9uc2UgfCBhbnksIHVybDogc3RyaW5nLCBhcnJheVR5cGUgPSBnZXRUeXBlcy5TdGF0aWMsIGNvZGUgPSAyMDApIHtcbiAgICBjb25zdCBGaWxlSW5mbyA9IGF3YWl0IGlzVVJMUGF0aEFGaWxlKFJlcXVlc3QsIHVybCwgYXJyYXlUeXBlLCBjb2RlKTtcblxuICAgIGNvbnN0IG1ha2VEZWxldGVBcnJheSA9IG1ha2VEZWxldGVSZXF1ZXN0RmlsZXNBcnJheShSZXF1ZXN0KVxuXG4gICAgaWYgKEZpbGVJbmZvLmZpbGUpIHtcbiAgICAgICAgU2V0dGluZ3MuQ2FjaGVEYXlzICYmIFJlc3BvbnNlLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJtYXgtYWdlPVwiICsgKFNldHRpbmdzLkNhY2hlRGF5cyAqIDI0ICogNjAgKiA2MCkpO1xuICAgICAgICBhd2FpdCBHZXRTdGF0aWNGaWxlKHVybCwgU2V0dGluZ3MuRGV2TW9kZSwgUmVxdWVzdCwgUmVzcG9uc2UpO1xuICAgICAgICBkZWxldGVSZXF1ZXN0RmlsZXMobWFrZURlbGV0ZUFycmF5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRQcmFzZSA9ICgpID0+IFBhcnNlQmFzaWNJbmZvKFJlcXVlc3QsIFJlc3BvbnNlLCBjb2RlKTsgLy8gcGFyc2UgZGF0YSBmcm9tIG1ldGhvZHMgLSBwb3N0LCBnZXQuLi4gKyBjb29raWVzLCBzZXNzaW9uLi4uXG5cbiAgICBjb25zdCBpc0FwaSA9IGF3YWl0IE1ha2VBcGlDYWxsKFJlcXVlc3QsIFJlc3BvbnNlLCB1cmwsIFNldHRpbmdzLkRldk1vZGUsIG5leHRQcmFzZSk7XG4gICAgaWYgKCFpc0FwaSAmJiAhYXdhaXQgQWN0aXZhdGVQYWdlKFJlcXVlc3QsIFJlc3BvbnNlLCBhcnJheVR5cGUsIHVybCwgRmlsZUluZm8sIGNvZGUsIG5leHRQcmFzZSkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGRlbGV0ZVJlcXVlc3RGaWxlcyhtYWtlRGVsZXRlQXJyYXkpOyAvLyBkZWxldGUgZmlsZXNcbn1cblxuZnVuY3Rpb24gdXJsRml4KHVybDogc3RyaW5nKSB7XG4gICAgaWYgKHVybCA9PSAnLycpIHtcbiAgICAgICAgdXJsID0gJy9pbmRleCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh1cmwpO1xufVxuXG5leHBvcnQge1xuICAgIFNldHRpbmdzLFxuICAgIER5bmFtaWNQYWdlLFxuICAgIExvYWRBbGxQYWdlc1RvUmFtLFxuICAgIENsZWFyQWxsUGFnZXNGcm9tUmFtLFxuICAgIHVybEZpeCxcbiAgICBHZXRFcnJvclBhZ2Vcbn0iLCAiaW1wb3J0ICogYXMgZmlsZUJ5VXJsIGZyb20gJy4uL1J1blRpbWVCdWlsZC9HZXRQYWdlcyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnksIFN5c3RlbURhdGEgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgKiBhcyBCdWlsZFNlcnZlciBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoUGFnZXMnO1xuaW1wb3J0IHsgY29va2llUGFyc2VyIH0gZnJvbSAnQHRpbnlodHRwL2Nvb2tpZS1wYXJzZXInO1xuaW1wb3J0IGNvb2tpZUVuY3J5cHRlciBmcm9tICdjb29raWUtZW5jcnlwdGVyJztcbmltcG9ydCB7IGFsbG93UHJpbnQgfSBmcm9tICcuLi9PdXRwdXRJbnB1dC9Db25zb2xlJztcbmltcG9ydCBzZXNzaW9uIGZyb20gJ2V4cHJlc3Mtc2Vzc2lvbic7XG5pbXBvcnQgeyBTZXR0aW5ncyBhcyBJbnNlcnRNb2RlbHNTZXR0aW5ncyB9IGZyb20gJy4uL0NvbXBpbGVDb2RlL0luc2VydE1vZGVscyc7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgeyBTdGFydFJlcXVpcmUsIEdldFNldHRpbmdzIH0gZnJvbSAnLi9JbXBvcnRNb2R1bGUnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ0B0aW55aHR0cC9hcHAnO1xuaW1wb3J0IHsgU2V0dGluZ3MgYXMgUHJpbnRJZk5ld1NldHRpbmdzIH0gZnJvbSAnLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IE1lbW9yeVNlc3Npb24gZnJvbSAnbWVtb3J5c3RvcmUnO1xuaW1wb3J0IHsgRXhwb3J0U2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzVHlwZXMnO1xuaW1wb3J0IHsgZGVidWdTaXRlTWFwIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NpdGVNYXAnO1xuaW1wb3J0IHsgc2V0dGluZ3MgYXMgZGVmaW5lU2V0dGluZ3MgfSBmcm9tICcuLi9Db21waWxlQ29kZS9Db21waWxlU2NyaXB0L1BhZ2VCYXNlJztcblxuY29uc3RcbiAgICBDb29raWVzU2VjcmV0ID0gdXVpZHY0KCkuc3Vic3RyaW5nKDAsIDMyKSxcbiAgICBTZXNzaW9uU2VjcmV0ID0gdXVpZHY0KCksXG4gICAgTWVtb3J5U3RvcmUgPSBNZW1vcnlTZXNzaW9uKHNlc3Npb24pLFxuXG4gICAgQ29va2llc01pZGRsZXdhcmUgPSBjb29raWVQYXJzZXIoQ29va2llc1NlY3JldCksXG4gICAgQ29va2llRW5jcnlwdGVyTWlkZGxld2FyZSA9IGNvb2tpZUVuY3J5cHRlcihDb29raWVzU2VjcmV0LCB7fSksXG4gICAgQ29va2llU2V0dGluZ3MgPSB7IGh0dHBPbmx5OiB0cnVlLCBzaWduZWQ6IHRydWUsIG1heEFnZTogODY0MDAwMDAgKiAzMCB9O1xuXG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llcyA9IDxhbnk+Q29va2llc01pZGRsZXdhcmU7XG5maWxlQnlVcmwuU2V0dGluZ3MuQ29va2llRW5jcnlwdGVyID0gPGFueT5Db29raWVFbmNyeXB0ZXJNaWRkbGV3YXJlO1xuZmlsZUJ5VXJsLlNldHRpbmdzLkNvb2tpZVNldHRpbmdzID0gQ29va2llU2V0dGluZ3M7XG5cbmxldCBEZXZNb2RlXyA9IHRydWUsIGNvbXBpbGF0aW9uU2NhbjogUHJvbWlzZTwoKSA9PiBQcm9taXNlPHZvaWQ+PiwgU2Vzc2lvblN0b3JlO1xuXG5sZXQgZm9ybWlkYWJsZVNlcnZlciwgYm9keVBhcnNlclNlcnZlcjtcblxuY29uc3Qgc2VydmVMaW1pdHMgPSB7XG4gICAgc2Vzc2lvblRvdGFsUmFtTUI6IDE1MCxcbiAgICBzZXNzaW9uVGltZU1pbnV0ZXM6IDQwLFxuICAgIHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXM6IDMwLFxuICAgIGZpbGVMaW1pdE1COiAxMCxcbiAgICByZXF1ZXN0TGltaXRNQjogNFxufVxuXG5sZXQgcGFnZUluUmFtQWN0aXZhdGU6ICgpID0+IFByb21pc2U8dm9pZD47XG5leHBvcnQgZnVuY3Rpb24gcGFnZUluUmFtQWN0aXZhdGVGdW5jKCl7XG4gICAgcmV0dXJuIHBhZ2VJblJhbUFjdGl2YXRlO1xufVxuXG5jb25zdCBiYXNlUm91dGluZ0lnbm9yZVR5cGVzID0gWy4uLkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXksIC4uLkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXldO1xuY29uc3QgYmFzZVZhbGlkUGF0aCA9IFsocGF0aDogc3RyaW5nKSA9PiBwYXRoLnNwbGl0KCcuJykuYXQoLTIpICE9ICdzZXJ2J107IC8vIGlnbm9yaW5nIGZpbGVzIHRoYXQgZW5kcyB3aXRoIC5zZXJ2LipcblxuZXhwb3J0IGNvbnN0IEV4cG9ydDogRXhwb3J0U2V0dGluZ3MgPSB7XG4gICAgZ2V0IHNldHRpbmdzUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtpbmdEaXJlY3RvcnkgKyBCYXNpY1NldHRpbmdzLldlYlNpdGVGb2xkZXIgKyBcIi9TZXR0aW5nc1wiO1xuICAgIH0sXG4gICAgc2V0IGRldmVsb3BtZW50KHZhbHVlKSB7XG4gICAgICAgIGlmKERldk1vZGVfID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgRGV2TW9kZV8gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgY29tcGlsYXRpb25TY2FuID0gQnVpbGRTZXJ2ZXIuY29tcGlsZUFsbChFeHBvcnQpO1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBcInByb2R1Y3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuRGV2TW9kZSA9IHZhbHVlO1xuICAgICAgICBhbGxvd1ByaW50KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldCBkZXZlbG9wbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIERldk1vZGVfO1xuICAgIH0sXG4gICAgbWlkZGxld2FyZToge1xuICAgICAgICBnZXQgY29va2llcygpOiAocmVxOiBSZXF1ZXN0LCBfcmVzOiBSZXNwb25zZTxhbnk+LCBuZXh0PzogTmV4dEZ1bmN0aW9uKSA9PiB2b2lkIHtcbiAgICAgICAgICAgIHJldHVybiA8YW55PkNvb2tpZXNNaWRkbGV3YXJlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llRW5jcnlwdGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZUVuY3J5cHRlck1pZGRsZXdhcmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TdG9yZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZvcm1pZGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWlkYWJsZVNlcnZlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGJvZHlQYXJzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keVBhcnNlclNlcnZlcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VjcmV0OiB7XG4gICAgICAgIGdldCBjb29raWVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXNTZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzZXNzaW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb25TZWNyZXQ7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBnZW5lcmFsOiB7XG4gICAgICAgIGltcG9ydE9uTG9hZDogW10sXG4gICAgICAgIHNldCBwYWdlSW5SYW0odmFsdWUpIHtcbiAgICAgICAgICAgIGlmKGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtICE9IHZhbHVlKXtcbiAgICAgICAgICAgICAgICBmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXN5bmMgKCkgPT4gKGF3YWl0IGNvbXBpbGF0aW9uU2Nhbik/LigpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtID0gdmFsdWU7XG4gICAgICAgICAgICBwYWdlSW5SYW1BY3RpdmF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVwYXJhdGlvbnMgPSBhd2FpdCBjb21waWxhdGlvblNjYW47XG4gICAgICAgICAgICAgICAgYXdhaXQgcHJlcGFyYXRpb25zPy4oKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVCeVVybC5TZXR0aW5ncy5QYWdlUmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVCeVVybC5Mb2FkQWxsUGFnZXNUb1JhbSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVCeVVybC5DbGVhckFsbFBhZ2VzRnJvbVJhbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBhZ2VJblJhbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlQnlVcmwuU2V0dGluZ3MuUGFnZVJhbTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcGlsZToge1xuICAgICAgICBzZXQgY29tcGlsZVN5bnRheCh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MuQWRkQ29tcGlsZVN5bnRheCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29tcGlsZVN5bnRheCgpIHtcbiAgICAgICAgICAgIHJldHVybiBJbnNlcnRNb2RlbHNTZXR0aW5ncy5BZGRDb21waWxlU3ludGF4O1xuICAgICAgICB9LFxuICAgICAgICBzZXQgaWdub3JlRXJyb3IodmFsdWUpIHtcbiAgICAgICAgICAgICg8YW55PlByaW50SWZOZXdTZXR0aW5ncykuUHJldmVudEVycm9ycyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgaWdub3JlRXJyb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+UHJpbnRJZk5ld1NldHRpbmdzKS5QcmV2ZW50RXJyb3JzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgcGx1Z2lucyh2YWx1ZSkge1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucy5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHBsdWdpbnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5zZXJ0TW9kZWxzU2V0dGluZ3MucGx1Z2lucztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGRlZmluZSgpe1xuICAgICAgICAgICAgcmV0dXJuIGRlZmluZVNldHRpbmdzLmRlZmluZVxuICAgICAgICB9LFxuICAgICAgICBzZXQgZGVmaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICBkZWZpbmVTZXR0aW5ncy5kZWZpbmUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZzoge1xuICAgICAgICBydWxlczoge30sXG4gICAgICAgIHVybFN0b3A6IFtdLFxuICAgICAgICB2YWxpZFBhdGg6IGJhc2VWYWxpZFBhdGgsXG4gICAgICAgIGlnbm9yZVR5cGVzOiBiYXNlUm91dGluZ0lnbm9yZVR5cGVzLFxuICAgICAgICBpZ25vcmVQYXRoczogW10sXG4gICAgICAgIHNpdGVtYXA6IHRydWUsXG4gICAgICAgIGdldCBlcnJvclBhZ2VzKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5FcnJvclBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgZXJyb3JQYWdlcyh2YWx1ZSkge1xuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkVycm9yUGFnZXMgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVMaW1pdHM6IHtcbiAgICAgICAgZ2V0IGNhY2hlRGF5cygpe1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVCeVVybC5TZXR0aW5ncy5DYWNoZURheXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBjYWNoZURheXModmFsdWUpe1xuICAgICAgICAgICAgZmlsZUJ5VXJsLlNldHRpbmdzLkNhY2hlRGF5cyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY29va2llc0V4cGlyZXNEYXlzKCl7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llU2V0dGluZ3MubWF4QWdlIC8gODY0MDAwMDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBjb29raWVzRXhwaXJlc0RheXModmFsdWUpe1xuICAgICAgICAgICAgQ29va2llU2V0dGluZ3MubWF4QWdlID0gdmFsdWUgKiA4NjQwMDAwMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IHNlc3Npb25Ub3RhbFJhbU1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25Ub3RhbFJhbU1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZFNlc3Npb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25Ub3RhbFJhbU1CKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvblRvdGFsUmFtTUI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uVGltZU1pbnV0ZXModmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYoc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLnNlc3Npb25UaW1lTWludXRlcyA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25UaW1lTWludXRlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCBzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgPT0gdmFsdWUpIHJldHVyblxuICAgICAgICAgICAgc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcyA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuc2Vzc2lvbkNoZWNrUGVyaW9kTWludXRlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0IGZpbGVMaW1pdE1CKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CID09IHZhbHVlKSByZXR1cm5cbiAgICAgICAgICAgIHNlcnZlTGltaXRzLmZpbGVMaW1pdE1CID0gdmFsdWU7XG4gICAgICAgICAgICBidWlsZEZvcm1pZGFibGUoKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgZmlsZUxpbWl0TUIoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMuZmlsZUxpbWl0TUI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCByZXF1ZXN0TGltaXRNQih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZihzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiA9PSB2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgICBzZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiA9IHZhbHVlO1xuICAgICAgICAgICAgYnVpbGRGb3JtaWRhYmxlKCk7XG4gICAgICAgICAgICBidWlsZEJvZHlQYXJzZXIoKTtcblxuICAgICAgICB9LFxuICAgICAgICBnZXQgcmVxdWVzdExpbWl0TUIoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVMaW1pdHMucmVxdWVzdExpbWl0TUI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlOiB7XG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGh0dHAyOiBmYWxzZSxcbiAgICAgICAgZ3JlZW5Mb2NrOiB7XG4gICAgICAgICAgICBzdGFnaW5nOiBudWxsLFxuICAgICAgICAgICAgY2x1c3RlcjogbnVsbCxcbiAgICAgICAgICAgIGVtYWlsOiBudWxsLFxuICAgICAgICAgICAgYWdlbnQ6IG51bGwsXG4gICAgICAgICAgICBhZ3JlZVRvVGVybXM6IGZhbHNlLFxuICAgICAgICAgICAgc2l0ZXM6IFtdXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZvcm1pZGFibGUoKSB7XG4gICAgZm9ybWlkYWJsZVNlcnZlciA9IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5maWxlTGltaXRNQiAqIDEwNDg1NzYsXG4gICAgICAgIHVwbG9hZERpcjogU3lzdGVtRGF0YSArIFwiL1VwbG9hZEZpbGVzL1wiLFxuICAgICAgICBtdWx0aXBsZXM6IHRydWUsXG4gICAgICAgIG1heEZpZWxkc1NpemU6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiAqIDEwNDg1NzZcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRCb2R5UGFyc2VyKCkge1xuICAgIGJvZHlQYXJzZXJTZXJ2ZXIgPSAoPGFueT5ib2R5UGFyc2VyKS5qc29uKHsgbGltaXQ6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5yZXF1ZXN0TGltaXRNQiArICdtYicgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2Vzc2lvbigpIHtcbiAgICBpZiAoIUV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVGltZU1pbnV0ZXMgfHwgIUV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQikge1xuICAgICAgICBTZXNzaW9uU3RvcmUgPSAocmVxLCByZXMsIG5leHQpID0+IG5leHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFNlc3Npb25TdG9yZSA9IHNlc3Npb24oe1xuICAgICAgICBjb29raWU6IHsgbWF4QWdlOiBFeHBvcnQuc2VydmVMaW1pdHMuc2Vzc2lvblRpbWVNaW51dGVzICogNjAgKiAxMDAwLCBzYW1lU2l0ZTogdHJ1ZSB9LFxuICAgICAgICBzZWNyZXQ6IFNlc3Npb25TZWNyZXQsXG4gICAgICAgIHJlc2F2ZTogZmFsc2UsXG4gICAgICAgIHNhdmVVbmluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgICAgc3RvcmU6IG5ldyBNZW1vcnlTdG9yZSh7XG4gICAgICAgICAgICBjaGVja1BlcmlvZDogRXhwb3J0LnNlcnZlTGltaXRzLnNlc3Npb25DaGVja1BlcmlvZE1pbnV0ZXMgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgICBtYXg6IEV4cG9ydC5zZXJ2ZUxpbWl0cy5zZXNzaW9uVG90YWxSYW1NQiAqIDEwNDg1NzZcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY29weUpTT04odG86IGFueSwganNvbjogYW55LCBydWxlczogc3RyaW5nW10gPSBbXSwgcnVsZXNUeXBlOiAnaWdub3JlJyB8ICdvbmx5JyA9ICdpZ25vcmUnKSB7XG4gICAgaWYoIWpzb24pIHJldHVybiBmYWxzZTtcbiAgICBsZXQgaGFzSW1wbGVhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBpIGluIGpzb24pIHtcbiAgICAgICAgY29uc3QgaW5jbHVkZSA9IHJ1bGVzLmluY2x1ZGVzKGkpO1xuICAgICAgICBpZiAocnVsZXNUeXBlID09ICdvbmx5JyAmJiBpbmNsdWRlIHx8IHJ1bGVzVHlwZSA9PSAnaWdub3JlJyAmJiAhaW5jbHVkZSkge1xuICAgICAgICAgICAgaGFzSW1wbGVhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvW2ldID0ganNvbltpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzSW1wbGVhdGVkO1xufVxuXG4vLyByZWFkIHRoZSBzZXR0aW5ncyBvZiB0aGUgd2Vic2l0ZVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVTZXR0aW5ncygpIHtcbiAgICBjb25zdCBTZXR0aW5nczogRXhwb3J0U2V0dGluZ3MgPSBhd2FpdCBHZXRTZXR0aW5ncyhFeHBvcnQuc2V0dGluZ3NQYXRoLCBEZXZNb2RlXyk7XG4gICAgaWYoU2V0dGluZ3MgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgaWYgKFNldHRpbmdzLmRldmVsb3BtZW50KVxuICAgICAgICBPYmplY3QuYXNzaWduKFNldHRpbmdzLCBTZXR0aW5ncy5pbXBsRGV2KTtcblxuICAgIGVsc2VcbiAgICAgICAgT2JqZWN0LmFzc2lnbihTZXR0aW5ncywgU2V0dGluZ3MuaW1wbFByb2QpO1xuXG5cbiAgICBjb3B5SlNPTihFeHBvcnQuY29tcGlsZSwgU2V0dGluZ3MuY29tcGlsZSk7XG5cbiAgICBjb3B5SlNPTihFeHBvcnQucm91dGluZywgU2V0dGluZ3Mucm91dGluZywgWydpZ25vcmVUeXBlcycsICd2YWxpZFBhdGgnXSk7XG5cbiAgICAvL2NvbmNhdCBkZWZhdWx0IHZhbHVlcyBvZiByb3V0aW5nXG4gICAgY29uc3QgY29uY2F0QXJyYXkgPSAobmFtZTogc3RyaW5nLCBhcnJheTogYW55W10pID0+IFNldHRpbmdzLnJvdXRpbmc/LltuYW1lXSAmJiAoRXhwb3J0LnJvdXRpbmdbbmFtZV0gPSBTZXR0aW5ncy5yb3V0aW5nW25hbWVdLmNvbmNhdChhcnJheSkpO1xuXG4gICAgY29uY2F0QXJyYXkoJ2lnbm9yZVR5cGVzJywgYmFzZVJvdXRpbmdJZ25vcmVUeXBlcyk7XG4gICAgY29uY2F0QXJyYXkoJ3ZhbGlkUGF0aCcsIGJhc2VWYWxpZFBhdGgpO1xuXG4gICAgY29weUpTT04oRXhwb3J0LnNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydjYWNoZURheXMnLCAnY29va2llc0V4cGlyZXNEYXlzJ10sICdvbmx5Jyk7XG5cbiAgICBpZiAoY29weUpTT04oc2VydmVMaW1pdHMsIFNldHRpbmdzLnNlcnZlTGltaXRzLCBbJ3Nlc3Npb25Ub3RhbFJhbU1CJywgJ3Nlc3Npb25UaW1lTWludXRlcycsICdzZXNzaW9uQ2hlY2tQZXJpb2RNaW51dGVzJ10sICdvbmx5JykpIHtcbiAgICAgICAgYnVpbGRTZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvcHlKU09OKHNlcnZlTGltaXRzLCBTZXR0aW5ncy5zZXJ2ZUxpbWl0cywgWydmaWxlTGltaXRNQicsICdyZXF1ZXN0TGltaXRNQiddLCAnb25seScpKSB7XG4gICAgICAgIGJ1aWxkRm9ybWlkYWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChjb3B5SlNPTihzZXJ2ZUxpbWl0cywgU2V0dGluZ3Muc2VydmVMaW1pdHMsIFsncmVxdWVzdExpbWl0TUInXSwgJ29ubHknKSkge1xuICAgICAgICBidWlsZEJvZHlQYXJzZXIoKTtcbiAgICB9XG5cbiAgICBjb3B5SlNPTihFeHBvcnQuc2VydmUsIFNldHRpbmdzLnNlcnZlKTtcblxuICAgIC8qIC0tLSBwcm9ibGVtYXRpYyB1cGRhdGVzIC0tLSAqL1xuICAgIEV4cG9ydC5kZXZlbG9wbWVudCA9IFNldHRpbmdzLmRldmVsb3BtZW50XG5cbiAgICBpZiAoU2V0dGluZ3MuZ2VuZXJhbD8uaW1wb3J0T25Mb2FkKSB7XG4gICAgICAgIEV4cG9ydC5nZW5lcmFsLmltcG9ydE9uTG9hZCA9IDxhbnk+YXdhaXQgU3RhcnRSZXF1aXJlKDxhbnk+U2V0dGluZ3MuZ2VuZXJhbC5pbXBvcnRPbkxvYWQsIERldk1vZGVfKTtcbiAgICB9XG5cbiAgICAvL25lZWQgdG8gZG93biBsYXN0ZWQgc28gaXQgd29uJ3QgaW50ZXJmZXJlIHdpdGggJ2ltcG9ydE9uTG9hZCdcbiAgICBpZiAoIWNvcHlKU09OKEV4cG9ydC5nZW5lcmFsLCBTZXR0aW5ncy5nZW5lcmFsLCBbJ3BhZ2VJblJhbSddLCAnb25seScpICYmIFNldHRpbmdzLmRldmVsb3BtZW50KSB7XG4gICAgICAgIHBhZ2VJblJhbUFjdGl2YXRlID0gYXdhaXQgY29tcGlsYXRpb25TY2FuO1xuICAgIH1cblxuICAgIGlmKEV4cG9ydC5kZXZlbG9wbWVudCAmJiBFeHBvcnQucm91dGluZy5zaXRlbWFwKXsgLy8gb24gcHJvZHVjdGlvbiB0aGlzIHdpbGwgYmUgY2hlY2tlZCBhZnRlciBjcmVhdGluZyBzdGF0ZVxuICAgICAgICBkZWJ1Z1NpdGVNYXAoRXhwb3J0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZpcnN0TG9hZCgpIHtcbiAgICBidWlsZFNlc3Npb24oKTtcbiAgICBidWlsZEZvcm1pZGFibGUoKTtcbiAgICBidWlsZEJvZHlQYXJzZXIoKTtcbn0iLCAiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cDIgZnJvbSAnaHR0cDInO1xuaW1wb3J0ICogYXMgY3JlYXRlQ2VydCBmcm9tICdzZWxmc2lnbmVkJztcbmltcG9ydCAqIGFzIEdyZWVubG9jayBmcm9tICdncmVlbmxvY2stZXhwcmVzcyc7XG5pbXBvcnQge0V4cG9ydCBhcyBTZXR0aW5nc30gZnJvbSAnLi9TZXR0aW5ncydcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IERlbGV0ZUluRGlyZWN0b3J5LCB3b3JraW5nRGlyZWN0b3J5LCBTeXN0ZW1EYXRhIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHsgR3JlZW5Mb2NrU2l0ZSB9IGZyb20gJy4vU2V0dGluZ3NUeXBlcyc7XG5cbi8qKlxuICogSWYgdGhlIGZvbGRlciBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXQuIElmIHRoZSBmaWxlIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdC4gSWYgdGhlIGZpbGUgZG9lc1xuICogZXhpc3QsIHVwZGF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IGZvTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmb2xkZXIgdG8gY3JlYXRlLlxuICogQHBhcmFtIENyZWF0ZUluTm90RXhpdHMgLSB7XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIFRvdWNoU3lzdGVtRm9sZGVyKGZvTmFtZTogc3RyaW5nLCBDcmVhdGVJbk5vdEV4aXRzOiB7bmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBleGl0cz86IGFueX0pIHtcbiAgICBsZXQgc2F2ZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgXCIvU3lzdGVtU2F2ZS9cIjtcblxuICAgIGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHNhdmVQYXRoKTtcblxuICAgIHNhdmVQYXRoICs9IGZvTmFtZTtcblxuICAgIGF3YWl0IEVhc3lGcy5ta2RpcklmTm90RXhpc3RzKHNhdmVQYXRoKTtcblxuICAgIGlmIChDcmVhdGVJbk5vdEV4aXRzKSB7XG4gICAgICAgIHNhdmVQYXRoICs9ICcvJztcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBzYXZlUGF0aCArIENyZWF0ZUluTm90RXhpdHMubmFtZTtcblxuICAgICAgICBpZiAoIWF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmaWxlUGF0aCwgQ3JlYXRlSW5Ob3RFeGl0cy52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoQ3JlYXRlSW5Ob3RFeGl0cy5leGl0cykge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShmaWxlUGF0aCwgYXdhaXQgQ3JlYXRlSW5Ob3RFeGl0cy5leGl0cyhhd2FpdCBFYXN5RnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JyksIGZpbGVQYXRoLCBzYXZlUGF0aCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEl0IGdlbmVyYXRlcyBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGFuZCBzdG9yZXMgaXQgaW4gYSBmaWxlLlxuICogQHJldHVybnMgVGhlIGNlcnRpZmljYXRlIGFuZCBrZXkgYXJlIGJlaW5nIHJldHVybmVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBHZXREZW1vQ2VydGlmaWNhdGUoKSB7XG4gICAgbGV0IENlcnRpZmljYXRlOiBhbnk7XG4gICAgY29uc3QgQ2VydGlmaWNhdGVQYXRoID0gU3lzdGVtRGF0YSArICcvQ2VydGlmaWNhdGUuanNvbic7XG5cbiAgICBpZiAoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUoQ2VydGlmaWNhdGVQYXRoKSkge1xuICAgICAgICBDZXJ0aWZpY2F0ZSA9IEVhc3lGcy5yZWFkSnNvbkZpbGUoQ2VydGlmaWNhdGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBDZXJ0aWZpY2F0ZSA9IGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICBjcmVhdGVDZXJ0LmdlbmVyYXRlKG51bGwsIHsgZGF5czogMzY1MDAgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleXMucHJpdmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgY2VydDoga2V5cy5jZXJ0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRWFzeUZzLndyaXRlSnNvbkZpbGUoQ2VydGlmaWNhdGVQYXRoLCBDZXJ0aWZpY2F0ZSk7XG4gICAgfVxuICAgIHJldHVybiBDZXJ0aWZpY2F0ZTtcbn1cblxuZnVuY3Rpb24gRGVmYXVsdExpc3RlbihhcHApIHtcbiAgICBjb25zdCBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHAuYXR0YWNoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZXJ2ZXIsXG4gICAgICAgIGxpc3Rlbihwb3J0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgPGFueT5yZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIElmIHlvdSB3YW50IHRvIHVzZSBncmVlbmxvY2ssIGl0IHdpbGwgY3JlYXRlIGEgc2VydmVyIHRoYXQgd2lsbCBzZXJ2ZSB5b3VyIGFwcCBvdmVyIGh0dHBzXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHRpbnlIdHRwIGFwcGxpY2F0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRoZSBzZXJ2ZXIgbWV0aG9kc1xuICovXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBVcGRhdGVHcmVlbkxvY2soYXBwKSB7XG5cbiAgICBpZiAoIShTZXR0aW5ncy5zZXJ2ZS5odHRwMiB8fCBTZXR0aW5ncy5zZXJ2ZS5ncmVlbkxvY2s/LmFncmVlVG9UZXJtcykpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IERlZmF1bHRMaXN0ZW4oYXBwKTtcbiAgICB9XG5cbiAgICBpZiAoIVNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5hZ3JlZVRvVGVybXMpIHtcbiAgICAgICAgY29uc3Qgc2VydmVyID0gaHR0cDIuY3JlYXRlU2VjdXJlU2VydmVyKHsgLi4uYXdhaXQgR2V0RGVtb0NlcnRpZmljYXRlKCksIGFsbG93SFRUUDE6IHRydWUgfSwgYXBwLmF0dGFjaCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlcnZlcixcbiAgICAgICAgICAgIGxpc3Rlbihwb3J0KSB7XG4gICAgICAgICAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgVG91Y2hTeXN0ZW1Gb2xkZXIoXCJncmVlbmxvY2tcIiwge1xuICAgICAgICBuYW1lOiBcImNvbmZpZy5qc29uXCIsIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzaXRlczogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzXG4gICAgICAgIH0pLFxuICAgICAgICBhc3luYyBleGl0cyhmaWxlLCBfLCBmb2xkZXIpIHtcbiAgICAgICAgICAgIGZpbGUgPSBKU09OLnBhcnNlKGZpbGUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbGUuc2l0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlID0gZmlsZS5zaXRlc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgaGF2ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgPEdyZWVuTG9ja1NpdGVbXT4gU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLnNpdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLnN1YmplY3QgPT0gZS5zdWJqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLmFsdG5hbWVzLmxlbmd0aCAhPSBlLmFsdG5hbWVzLmxlbmd0aCB8fCBiLmFsdG5hbWVzLnNvbWUodiA9PiBlLmFsdG5hbWVzLmluY2x1ZGVzKHYpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuYWx0bmFtZXMgPSBiLmFsdG5hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlLnJlbmV3QXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWhhdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5zaXRlcy5zcGxpY2UoaSwgaSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBmb2xkZXIgKyBcImxpdmUvXCIgKyBlLnN1YmplY3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHMocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnJtZGlyKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdTaXRlcyA9IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zaXRlcy5maWx0ZXIoKHgpID0+ICFmaWxlLnNpdGVzLmZpbmQoYiA9PiBiLnN1YmplY3QgPT0geC5zdWJqZWN0KSk7XG5cbiAgICAgICAgICAgIGZpbGUuc2l0ZXMucHVzaCguLi5uZXdTaXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShmaWxlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFja2FnZUluZm8gPSBhd2FpdCBFYXN5RnMucmVhZEpzb25GaWxlKHdvcmtpbmdEaXJlY3RvcnkgKyBcInBhY2thZ2UuanNvblwiKTtcblxuICAgIGNvbnN0IGdyZWVubG9ja09iamVjdDphbnkgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gR3JlZW5sb2NrLmluaXQoe1xuICAgICAgICBwYWNrYWdlUm9vdDogd29ya2luZ0RpcmVjdG9yeSxcbiAgICAgICAgY29uZmlnRGlyOiBcIlN5c3RlbVNhdmUvZ3JlZW5sb2NrXCIsXG4gICAgICAgIHBhY2thZ2VBZ2VudDogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmFnZW50IHx8IHBhY2thZ2VJbmZvLm5hbWUgKyAnLycgKyBwYWNrYWdlSW5mby52ZXJzaW9uLFxuICAgICAgICBtYWludGFpbmVyRW1haWw6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5lbWFpbCxcbiAgICAgICAgY2x1c3RlcjogU2V0dGluZ3Muc2VydmUuZ3JlZW5Mb2NrLmNsdXN0ZXIsXG4gICAgICAgIHN0YWdpbmc6IFNldHRpbmdzLnNlcnZlLmdyZWVuTG9jay5zdGFnaW5nXG4gICAgfSkucmVhZHkocmVzKSk7XG5cbiAgICBmdW5jdGlvbiBDcmVhdGVTZXJ2ZXIodHlwZSwgZnVuYywgb3B0aW9ucz8pIHtcbiAgICAgICAgbGV0IENsb3NlaHR0cFNlcnZlciA9ICgpID0+IHsgfTtcbiAgICAgICAgY29uc3Qgc2VydmVyID0gZ3JlZW5sb2NrT2JqZWN0W3R5cGVdKG9wdGlvbnMsIGZ1bmMpO1xuICAgICAgICBjb25zdCBsaXN0ZW4gPSAocG9ydCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGdyZWVubG9ja09iamVjdC5odHRwU2VydmVyKCk7XG4gICAgICAgICAgICBDbG9zZWh0dHBTZXJ2ZXIgPSAoKSA9PiBodHRwU2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW25ldyBQcm9taXNlKHJlcyA9PiBzZXJ2ZXIubGlzdGVuKDQ0MywgXCIwLjAuMC4wXCIsIHJlcykpLCBuZXcgUHJvbWlzZShyZXMgPT4gaHR0cFNlcnZlci5saXN0ZW4ocG9ydCwgXCIwLjAuMC4wXCIsIHJlcykpXSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBzZXJ2ZXIuY2xvc2UoKTsgQ2xvc2VodHRwU2VydmVyKCk7IH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZXJ2ZXIsXG4gICAgICAgICAgICBsaXN0ZW4sXG4gICAgICAgICAgICBjbG9zZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFNldHRpbmdzLnNlcnZlLmh0dHAyKSB7XG4gICAgICAgIHJldHVybiBDcmVhdGVTZXJ2ZXIoJ2h0dHAyU2VydmVyJywgYXBwLmF0dGFjaCwgeyBhbGxvd0hUVFAxOiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdGVTZXJ2ZXIoJ2h0dHBzU2VydmVyJywgYXBwLmF0dGFjaCk7XG4gICAgfVxufVxuIiwgImltcG9ydCBzZXJ2ZXIsIHtTZXR0aW5nc30gIGZyb20gJy4vTWFpbkJ1aWxkL1NlcnZlcic7XG5pbXBvcnQgYXN5bmNSZXF1aXJlIGZyb20gJy4vSW1wb3J0RmlsZXMvU2NyaXB0JztcbmltcG9ydCB7Z2V0VHlwZXN9IGZyb20gJy4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IFNlYXJjaFJlY29yZCBmcm9tICcuL0J1aWxkSW5GdW5jL1NlYXJjaFJlY29yZCc7XG5leHBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gJy4vTWFpbkJ1aWxkL1R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEFzeW5jSW1wb3J0ID0gKHBhdGg6c3RyaW5nLCBpbXBvcnRGcm9tID0gJ2FzeW5jIGltcG9ydCcpID0+IGFzeW5jUmVxdWlyZShpbXBvcnRGcm9tLCBwYXRoLCBnZXRUeXBlcy5TdGF0aWMsIFNldHRpbmdzLmRldmVsb3BtZW50KTtcbmV4cG9ydCB7U2V0dGluZ3MsIFNlYXJjaFJlY29yZH07XG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBOzs7QUNGQTs7O0FDQUEsSUFBSSxZQUFZO0FBRVQsb0JBQW9CLEdBQVk7QUFDbkMsY0FBWTtBQUNoQjtBQUVPLElBQU0sUUFBUSxJQUFJLE1BQU0sU0FBUTtBQUFBLEVBQ25DLElBQUksUUFBUSxNQUFNLFVBQVU7QUFDeEIsUUFBRztBQUNDLGFBQU8sT0FBTztBQUNsQixXQUFPLE1BQU07QUFBQSxJQUFDO0FBQUEsRUFDbEI7QUFDSixDQUFDOzs7QURWRDtBQUVBLGdCQUFnQixRQUErQjtBQUMzQyxTQUFPLElBQUksUUFBUSxTQUFPO0FBQ3RCLE9BQUcs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
