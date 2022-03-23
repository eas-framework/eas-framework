var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// src/OutputInput/Console.ts
var printMode, print;
var init_Console = __esm({
  "src/OutputInput/Console.ts"() {
    printMode = true;
    print = new Proxy(console, {
      get(target, prop, receiver) {
        if (printMode)
          return target[prop];
        return () => {
        };
      }
    });
  }
});

// src/OutputInput/EasyFs.ts
import fs, { Dirent } from "fs";
import path from "path";
function exists(path4) {
  return new Promise((res) => {
    fs.stat(path4, (err, stat2) => {
      res(Boolean(stat2));
    });
  });
}
function stat(path4, filed, ignoreError, defaultValue = {}) {
  return new Promise((res) => {
    fs.stat(path4, (err, stat2) => {
      if (err && !ignoreError) {
        print.error(err);
      }
      res(filed && stat2 ? stat2[filed] : stat2 || defaultValue);
    });
  });
}
async function existsFile(path4, ifTrueReturn = true) {
  return (await stat(path4, void 0, true)).isFile?.() && ifTrueReturn;
}
function mkdir(path4) {
  return new Promise((res) => {
    fs.mkdir(path4, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function rmdir(path4) {
  return new Promise((res) => {
    fs.rmdir(path4, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function unlink(path4) {
  return new Promise((res) => {
    fs.unlink(path4, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function unlinkIfExists(path4) {
  if (await exists(path4)) {
    return await unlink(path4);
  }
  return false;
}
function readdir(path4, options = {}) {
  return new Promise((res) => {
    fs.readdir(path4, options, (err, files) => {
      if (err) {
        print.error(err);
      }
      res(files || []);
    });
  });
}
async function mkdirIfNotExists(path4) {
  if (!await exists(path4))
    return await mkdir(path4);
  return false;
}
function writeFile(path4, content) {
  return new Promise((res) => {
    fs.writeFile(path4, content, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function writeJsonFile(path4, content) {
  try {
    return await writeFile(path4, JSON.stringify(content));
  } catch (err) {
    print.error(err);
  }
  return false;
}
function readFile(path4, encoding = "utf8") {
  return new Promise((res) => {
    fs.readFile(path4, encoding, (err, data) => {
      if (err) {
        print.error(err);
      }
      res(data || "");
    });
  });
}
async function readJsonFile(path4, encoding) {
  try {
    return JSON.parse(await readFile(path4, encoding));
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
var EasyFs_default;
var init_EasyFs = __esm({
  "src/OutputInput/EasyFs.ts"() {
    init_Console();
    EasyFs_default = __spreadProps(__spreadValues({}, fs.promises), {
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
  }
});

// src/RunTimeBuild/SearchFileSystem.ts
import { cwd } from "process";
import path2 from "path";
import { fileURLToPath } from "url";
function getDirname(url) {
  return path2.dirname(fileURLToPath(url));
}
function GetFullWebSitePath() {
  return path2.join(workingDirectory, WebSiteFolder_, "/");
}
function GetSource(name) {
  return GetFullWebSitePath() + name + "/";
}
var SystemData, WebSiteFolder_, StaticName, LogsName, ModulesName, StaticCompile, CompileLogs, CompileModule, workingDirectory, fullWebSitePath_, getTypes, pageTypes, BasicSettings;
var init_SearchFileSystem = __esm({
  "src/RunTimeBuild/SearchFileSystem.ts"() {
    init_EasyFs();
    SystemData = path2.join(getDirname(import.meta.url), "/SystemData");
    WebSiteFolder_ = "WebSite";
    StaticName = "WWW";
    LogsName = "Logs";
    ModulesName = "node_modules";
    StaticCompile = SystemData + `/${StaticName}Compile/`;
    CompileLogs = SystemData + `/${LogsName}Compile/`;
    CompileModule = SystemData + `/${ModulesName}Compile/`;
    workingDirectory = cwd() + "/";
    fullWebSitePath_ = GetFullWebSitePath();
    getTypes = {
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
    pageTypes = {
      page: "page",
      model: "mode",
      component: "inte"
    };
    BasicSettings = {
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
  }
});

// src/StringMethods/Splitting.ts
function SplitFirst(type, string) {
  const index = string.indexOf(type);
  if (index == -1)
    return [string];
  return [string.substring(0, index), string.substring(index + type.length)];
}
var init_Splitting = __esm({
  "src/StringMethods/Splitting.ts"() {
  }
});

// src/EasyDebug/SourceMapStore.ts
import { SourceMapGenerator, SourceMapConsumer } from "source-map-js";
import path3 from "path";
var SourceMapBasic;
var init_SourceMapStore = __esm({
  "src/EasyDebug/SourceMapStore.ts"() {
    init_SearchFileSystem();
    init_Splitting();
    SourceMapBasic = class {
      constructor(filePath, httpSource = true, relative = false, isCss = false) {
        this.filePath = filePath;
        this.httpSource = httpSource;
        this.relative = relative;
        this.isCss = isCss;
        this.lineCount = 0;
        this.map = new SourceMapGenerator({
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
        let mapString = `sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(this.map.toString()).toString("base64")}`;
        if (this.isCss)
          mapString = `/*# ${mapString}*/`;
        else
          mapString = "//# " + mapString;
        return "\r\n" + mapString;
      }
    };
  }
});

// src/EasyDebug/StringTrackerToSourceMap.ts
function outputMap(text, filePath, httpSource, relative) {
  const storeMap = new createPageSourceMap(filePath, httpSource, relative);
  storeMap.addMappingFromTrack(text);
  return storeMap.getRowSourceMap();
}
function outputWithMap(text, filePath) {
  const storeMap = new createPageSourceMap(filePath);
  storeMap.addMappingFromTrack(text);
  return text.eq + storeMap.mapAsURLComment();
}
var createPageSourceMap;
var init_StringTrackerToSourceMap = __esm({
  "src/EasyDebug/StringTrackerToSourceMap.ts"() {
    init_SourceMapStore();
    createPageSourceMap = class extends SourceMapBasic {
      constructor(filePath, httpSource = false, relative = false) {
        super(filePath, httpSource, relative);
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
  }
});

// src/EasyDebug/StringTracker.ts
var StringTracker;
var init_StringTracker = __esm({
  "src/EasyDebug/StringTracker.ts"() {
    init_SearchFileSystem();
    init_StringTrackerToSourceMap();
    StringTracker = class {
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
      debugLine({ message, text, location, line, col, sassStack }) {
        if (sassStack) {
          const loc = sassStack.match(/[0-9]+:[0-9]+/)[0].split(":").map((x) => Number(x));
          line = loc[0];
          col = loc[1];
        }
        let searchLine = this.getLine(line ?? location?.line ?? 1), column = col ?? location?.column ?? 0;
        if (searchLine.startsWith("//")) {
          searchLine = this.getLine((line ?? location?.line) - 1);
          column = 0;
        }
        const data = searchLine.DefaultInfoText;
        return `${text || message}, on file -> ${BasicSettings.fullWebSitePath}${data.info.split("<line>").shift()}:${data.line}:${column}`;
      }
      StringWithTack(fullSaveLocation) {
        return outputWithMap(this, fullSaveLocation);
      }
      StringTack(fullSaveLocation, httpSource, relative) {
        return outputMap(this, fullSaveLocation, httpSource, relative);
      }
    };
  }
});

// src/BuildInComponents/Components/serv-connect/index.ts
var numbers, booleans, builtInConnection, builtInConnectionRegex, builtInConnectionNumbers;
var init_serv_connect = __esm({
  "src/BuildInComponents/Components/serv-connect/index.ts"() {
    numbers = ["number", "num", "integer", "int"];
    booleans = ["boolean", "bool"];
    builtInConnection = ["email", "string", "text", ...numbers, ...booleans];
    builtInConnectionRegex = {
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
    builtInConnectionNumbers = [...numbers];
    for (const i in builtInConnectionRegex) {
      const type = builtInConnectionRegex[i][3];
      if (builtInConnectionNumbers.includes(type))
        builtInConnectionNumbers.push(i);
    }
  }
});

// src/OutputInput/PrintNew.ts
var init_PrintNew = __esm({
  "src/OutputInput/PrintNew.ts"() {
    init_Console();
  }
});

// src/CompileCode/CssMinimizer.ts
function MinCss(code) {
  while (code.includes("  ")) {
    code = code.replace(/ {2}/gi, " ");
  }
  code = code.replace(/\r\n|\n/gi, "");
  code = code.replace(/, /gi, ",");
  code = code.replace(/: /gi, ":");
  code = code.replace(/ \{/gi, "{");
  code = code.replace(/\{ /gi, "{");
  code = code.replace(/; /gi, ";");
  code = code.replace(/\/\*.*?\*\//gms, "");
  return code.trim();
}
var init_CssMinimizer = __esm({
  "src/CompileCode/CssMinimizer.ts"() {
  }
});

// src/BuildInComponents/Components/markdown.ts
import markdown from "markdown-it";
import hljs from "highlight.js";
import anchor from "markdown-it-anchor";
import slugify from "@sindresorhus/slugify";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAbbr from "markdown-it-abbr";
async function minifyMarkdownTheme() {
  for (const i of themeArray) {
    const mini = (await EasyFs_default.readFile(themePath + i + ".css")).replace(/(\n\.markdown-body {)|(^.markdown-body {)/gm, (match) => {
      return match + "padding:20px;";
    }) + `
            .code-copy>div {
                text-align:right;
                margin-bottom:-30px;
                margin-right:10px;
                opacity:0;
            }
            .code-copy:hover>div {
                opacity:1;
            }
            .code-copy>div a:focus {
                color:#6bb86a
            }`;
    await EasyFs_default.writeFile(themePath + i + ".min.css", MinCss(mini));
  }
}
function splitStart(text1, text2) {
  const [before, after, last] = text1.split(/(}|\*\/).hljs{/);
  const addBefore = text1[before.length] == "}" ? "}" : "*/";
  return [before + addBefore, ".hljs{" + (last ?? after), ".hljs{" + text2.split(/(}|\*\/).hljs{/).pop()];
}
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
function autoCodeTheme() {
  return createAutoTheme("atom-one-light|atom-one-dark|atom-one");
}
var themeArray, themePath, codeThemePath;
var init_markdown = __esm({
  "src/BuildInComponents/Components/markdown.ts"() {
    init_StringTracker();
    init_serv_connect();
    init_PrintNew();
    init_EasyFs();
    init_SearchFileSystem();
    init_CssMinimizer();
    themeArray = ["", "-dark", "-light"];
    themePath = workingDirectory + "node_modules/github-markdown-css/github-markdown";
    codeThemePath = workingDirectory + "node_modules/highlight.js/styles/";
  }
});

// src/scripts/build-scripts.ts
var build_scripts_exports = {};
var init_build_scripts = __esm({
  async "src/scripts/build-scripts.ts"() {
    init_markdown();
    await minifyMarkdownTheme();
    await autoCodeTheme();
  }
});

// src/scripts/install.ts
import { chdir, cwd as cwd2 } from "process";
var pathThis = cwd2().split("/");
function checkBase(index) {
  if (pathThis.at(-index) == "node_modules") {
    chdir("../".repeat(index));
    return true;
  }
}
if (!checkBase(2))
  checkBase(3);
init_build_scripts();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL091dHB1dElucHV0L0NvbnNvbGUudHMiLCAiLi4vLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi8uLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vLi4vc3JjL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nLnRzIiwgIi4uLy4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUudHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXAudHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyLnRzIiwgIi4uLy4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlcnYtY29ubmVjdC9pbmRleC50cyIsICIuLi8uLi9zcmMvT3V0cHV0SW5wdXQvUHJpbnROZXcudHMiLCAiLi4vLi4vc3JjL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplci50cyIsICIuLi8uLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93bi50cyIsICIuLi8uLi9zcmMvc2NyaXB0cy9idWlsZC1zY3JpcHRzLnRzIiwgIi4uLy4uL3NyYy9zY3JpcHRzL2luc3RhbGwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImxldCBwcmludE1vZGUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dQcmludChkOiBib29sZWFuKSB7XG4gICAgcHJpbnRNb2RlID0gZDtcbn1cblxuZXhwb3J0IGNvbnN0IHByaW50ID0gbmV3IFByb3h5KGNvbnNvbGUse1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmKHByaW50TW9kZSlcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQgZnMsIHtEaXJlbnQsIFN0YXRzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4vQ29uc29sZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgcmVzKEJvb2xlYW4oc3RhdCkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7cGF0aCBvZiB0aGUgZmlsZX0gcGF0aCBcbiAqIEBwYXJhbSB7ZmlsZWQgdG8gZ2V0IGZyb20gdGhlIHN0YXQgb2JqZWN0fSBmaWxlZCBcbiAqIEByZXR1cm5zIHRoZSBmaWxlZFxuICovXG5mdW5jdGlvbiBzdGF0KHBhdGg6IHN0cmluZywgZmlsZWQ/OiBzdHJpbmcsIGlnbm9yZUVycm9yPzogYm9vbGVhbiwgZGVmYXVsdFZhbHVlOmFueSA9IHt9KTogUHJvbWlzZTxTdGF0cyB8IGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyICYmICFpZ25vcmVFcnJvcil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlZCAmJiBzdGF0PyBzdGF0W2ZpbGVkXTogc3RhdCB8fCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgZmlsZSBleGlzdHMsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHthbnl9IFtpZlRydWVSZXR1cm49dHJ1ZV0gLSBhbnkgPSB0cnVlXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4aXN0c0ZpbGUocGF0aDogc3RyaW5nLCBpZlRydWVSZXR1cm46IGFueSA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiAoYXdhaXQgc3RhdChwYXRoLCB1bmRlZmluZWQsIHRydWUpKS5pc0ZpbGU/LigpICYmIGlmVHJ1ZVJldHVybjtcbn1cblxuLyoqXG4gKiBJdCBjcmVhdGVzIGEgZGlyZWN0b3J5LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gbWtkaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMubWtkaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgcm1kaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB0byBiZSByZW1vdmVkLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBybWRpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ybWRpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB1bmxpbmtgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gZGVsZXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB1bmxpbmsocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMudW5saW5rKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZXhpc3RzLCBkZWxldGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgb3IgZGlyZWN0b3J5IHRvIGJlIHVubGlua2VkLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1bmxpbmtJZkV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKGF3YWl0IGV4aXN0cyhwYXRoKSl7XG4gICAgICAgIHJldHVybiBhd2FpdCB1bmxpbmsocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZGRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9ucyBvYmplY3QsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzXG4gKiB0byBhbiBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBvcHRpb25zIC0ge1xuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gcmVhZGRpcihwYXRoOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nW10gfCBCdWZmZXJbXSB8IERpcmVudFtdPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZGRpcihwYXRoLCBvcHRpb25zLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVzIHx8IFtdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIGNyZWF0ZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGRpcmVjdG9yeSB3YXMgY3JlYXRlZCBvciBub3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1rZGlySWZOb3RFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZighYXdhaXQgZXhpc3RzKHBhdGgpKVxuICAgICAgICByZXR1cm4gYXdhaXQgbWtkaXIocGF0aCk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFdyaXRlIGEgZmlsZSB0byB0aGUgZmlsZSBzeXN0ZW1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge3N0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXd9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogIHN0cmluZyB8IE5vZGVKUy5BcnJheUJ1ZmZlclZpZXcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy53cml0ZUZpbGUocGF0aCwgY29udGVudCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgd3JpdGVKc29uRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYSBjb250ZW50IGFuZCB3cml0ZXMgdGhlIGNvbnRlbnQgdG8gdGhlIGZpbGUgYXRcbiAqIHRoZSBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHthbnl9IGNvbnRlbnQgLSBUaGUgY29udGVudCB0byB3cml0ZSB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gd3JpdGVKc29uRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB3cml0ZUZpbGUocGF0aCwgSlNPTi5zdHJpbmdpZnkoY29udGVudCkpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkRmlsZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcGF0aCBhbmQgYW4gb3B0aW9uYWwgZW5jb2RpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAqIHJlc29sdmVzIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIFtlbmNvZGluZz11dGY4XSAtIFRoZSBlbmNvZGluZyBvZiB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcmVhZEZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nID0gJ3V0ZjgnKTogUHJvbWlzZTxzdHJpbmd8YW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucmVhZEZpbGUocGF0aCwgPGFueT5lbmNvZGluZywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGRhdGEgfHwgXCJcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEl0IHJlYWRzIGEgSlNPTiBmaWxlIGFuZCByZXR1cm5zIHRoZSBwYXJzZWQgSlNPTiBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2VuY29kaW5nXSAtIFRoZSBlbmNvZGluZyB0byB1c2Ugd2hlbiByZWFkaW5nIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0LlxuICovXG5hc3luYyBmdW5jdGlvbiByZWFkSnNvbkZpbGUocGF0aDpzdHJpbmcsIGVuY29kaW5nPzpzdHJpbmcpOiBQcm9taXNlPGFueT57XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgcmVhZEZpbGUocGF0aCwgZW5jb2RpbmcpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdFxuICogQHBhcmFtIHAgLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IG5lZWRzIHRvIGJlIGNyZWF0ZWQuXG4gKiBAcGFyYW0gW2Jhc2VdIC0gVGhlIGJhc2UgcGF0aCB0byB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFrZVBhdGhSZWFsKHA6c3RyaW5nLCBiYXNlID0gJycpIHtcbiAgICBwID0gcGF0aC5kaXJuYW1lKHApO1xuXG4gICAgaWYgKCFhd2FpdCBleGlzdHMoYmFzZSArIHApKSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHAuc3BsaXQoL1xcXFx8XFwvLyk7XG5cbiAgICAgICAgbGV0IHBTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbCkge1xuICAgICAgICAgICAgaWYgKHBTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcFN0cmluZyArPSAnLyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwU3RyaW5nICs9IGk7XG5cbiAgICAgICAgICAgIGF3YWl0IG1rZGlySWZOb3RFeGlzdHMoYmFzZSArIHBTdHJpbmcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vL3R5cGVzXG5leHBvcnQge1xuICAgIERpcmVudFxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLi4uZnMucHJvbWlzZXMsXG4gICAgZXhpc3RzLFxuICAgIGV4aXN0c0ZpbGUsXG4gICAgc3RhdCxcbiAgICBta2RpcixcbiAgICBta2RpcklmTm90RXhpc3RzLFxuICAgIHdyaXRlRmlsZSxcbiAgICB3cml0ZUpzb25GaWxlLFxuICAgIHJlYWRGaWxlLFxuICAgIHJlYWRKc29uRmlsZSxcbiAgICBybWRpcixcbiAgICB1bmxpbmssXG4gICAgdW5saW5rSWZFeGlzdHMsXG4gICAgcmVhZGRpcixcbiAgICBtYWtlUGF0aFJlYWxcbn0iLCAiaW1wb3J0IHtEaXJlbnR9IGZyb20gJ2ZzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7Y3dkfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tICd1cmwnXG5cbmZ1bmN0aW9uIGdldERpcm5hbWUodXJsOiBzdHJpbmcpe1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aCh1cmwpKTtcbn1cblxuY29uc3QgU3lzdGVtRGF0YSA9IHBhdGguam9pbihnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCksICcvU3lzdGVtRGF0YScpO1xuXG5sZXQgV2ViU2l0ZUZvbGRlcl8gPSBcIldlYlNpdGVcIjtcblxuY29uc3QgU3RhdGljTmFtZSA9ICdXV1cnLCBMb2dzTmFtZSA9ICdMb2dzJywgTW9kdWxlc05hbWUgPSAnbm9kZV9tb2R1bGVzJztcblxuY29uc3QgU3RhdGljQ29tcGlsZSA9IFN5c3RlbURhdGEgKyBgLyR7U3RhdGljTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTG9ncyA9IFN5c3RlbURhdGEgKyBgLyR7TG9nc05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZU1vZHVsZSA9IFN5c3RlbURhdGEgKyBgLyR7TW9kdWxlc05hbWV9Q29tcGlsZS9gO1xuXG5jb25zdCB3b3JraW5nRGlyZWN0b3J5ID0gY3dkKCkgKyAnLyc7XG5cbmZ1bmN0aW9uIEdldEZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksV2ViU2l0ZUZvbGRlcl8sICcvJyk7XG59XG5sZXQgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuXG5mdW5jdGlvbiBHZXRTb3VyY2UobmFtZSkge1xuICAgIHJldHVybiAgR2V0RnVsbFdlYlNpdGVQYXRoKCkgKyBuYW1lICsgJy8nXG59XG5cbi8qIEEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBwYXRocyBvZiB0aGUgZmlsZXMgaW4gdGhlIHByb2plY3QuICovXG5jb25zdCBnZXRUeXBlcyA9IHtcbiAgICBTdGF0aWM6IFtcbiAgICAgICAgR2V0U291cmNlKFN0YXRpY05hbWUpLFxuICAgICAgICBTdGF0aWNDb21waWxlLFxuICAgICAgICBTdGF0aWNOYW1lXG4gICAgXSxcbiAgICBMb2dzOiBbXG4gICAgICAgIEdldFNvdXJjZShMb2dzTmFtZSksXG4gICAgICAgIENvbXBpbGVMb2dzLFxuICAgICAgICBMb2dzTmFtZVxuICAgIF0sXG4gICAgbm9kZV9tb2R1bGVzOiBbXG4gICAgICAgIEdldFNvdXJjZSgnbm9kZV9tb2R1bGVzJyksXG4gICAgICAgIENvbXBpbGVNb2R1bGUsXG4gICAgICAgIE1vZHVsZXNOYW1lXG4gICAgXSxcbiAgICBnZXQgW1N0YXRpY05hbWVdKCl7XG4gICAgICAgIHJldHVybiBnZXRUeXBlcy5TdGF0aWM7XG4gICAgfVxufVxuXG5jb25zdCBwYWdlVHlwZXMgPSB7XG4gICAgcGFnZTogXCJwYWdlXCIsXG4gICAgbW9kZWw6IFwibW9kZVwiLFxuICAgIGNvbXBvbmVudDogXCJpbnRlXCJcbn1cblxuXG5jb25zdCBCYXNpY1NldHRpbmdzID0ge1xuICAgIHBhZ2VUeXBlcyxcblxuICAgIHBhZ2VUeXBlc0FycmF5OiBbXSxcblxuICAgIHBhZ2VDb2RlRmlsZToge1xuICAgICAgICBwYWdlOiBbcGFnZVR5cGVzLnBhZ2UrXCIuanNcIiwgcGFnZVR5cGVzLnBhZ2UrXCIudHNcIl0sXG4gICAgICAgIG1vZGVsOiBbcGFnZVR5cGVzLm1vZGVsK1wiLmpzXCIsIHBhZ2VUeXBlcy5tb2RlbCtcIi50c1wiXSxcbiAgICAgICAgY29tcG9uZW50OiBbcGFnZVR5cGVzLmNvbXBvbmVudCtcIi5qc1wiLCBwYWdlVHlwZXMuY29tcG9uZW50K1wiLnRzXCJdXG4gICAgfSxcblxuICAgIHBhZ2VDb2RlRmlsZUFycmF5OiBbXSxcblxuICAgIHBhcnRFeHRlbnNpb25zOiBbJ3NlcnYnLCAnYXBpJ10sXG5cbiAgICBSZXFGaWxlVHlwZXM6IHtcbiAgICAgICAganM6IFwic2Vydi5qc1wiLFxuICAgICAgICB0czogXCJzZXJ2LnRzXCIsXG4gICAgICAgICdhcGktdHMnOiBcImFwaS5qc1wiLFxuICAgICAgICAnYXBpLWpzJzogXCJhcGkudHNcIlxuICAgIH0sXG4gICAgUmVxRmlsZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgZ2V0IFdlYlNpdGVGb2xkZXIoKSB7XG4gICAgICAgIHJldHVybiBXZWJTaXRlRm9sZGVyXztcbiAgICB9LFxuICAgIGdldCBmdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfO1xuICAgIH0sXG4gICAgc2V0IFdlYlNpdGVGb2xkZXIodmFsdWUpIHtcbiAgICAgICAgV2ViU2l0ZUZvbGRlcl8gPSB2YWx1ZTtcblxuICAgICAgICBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG4gICAgICAgIGdldFR5cGVzLlN0YXRpY1swXSA9IEdldFNvdXJjZShTdGF0aWNOYW1lKTtcbiAgICAgICAgZ2V0VHlwZXMuTG9nc1swXSA9IEdldFNvdXJjZShMb2dzTmFtZSk7XG4gICAgfSxcbiAgICBnZXQgdHNDb25maWcoKXtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF8gKyAndHNjb25maWcuanNvbic7IFxuICAgIH0sXG4gICAgYXN5bmMgdHNDb25maWdGaWxlKCkge1xuICAgICAgICBpZihhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZSh0aGlzLnRzQ29uZmlnKSl7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoaXMudHNDb25maWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxhdGl2ZShmdWxsUGF0aDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZnVsbFdlYlNpdGVQYXRoXywgZnVsbFBhdGgpXG4gICAgfVxufVxuXG5CYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VUeXBlcyk7XG5CYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZUFycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLnBhZ2VDb2RlRmlsZSkuZmxhdCgpO1xuQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5SZXFGaWxlVHlwZXMpO1xuXG5hc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgZ2V0RGlybmFtZSxcbiAgICBTeXN0ZW1EYXRhLFxuICAgIHdvcmtpbmdEaXJlY3RvcnksXG4gICAgRGVsZXRlSW5EaXJlY3RvcnksXG4gICAgZ2V0VHlwZXMsXG4gICAgQmFzaWNTZXR0aW5nc1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmludGVyZmFjZSBnbG9iYWxTdHJpbmc8VD4ge1xuICAgIGluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgbGFzdEluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgc3RhcnRzV2l0aChzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTcGxpdEZpcnN0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHR5cGU6IHN0cmluZywgc3RyaW5nOiBUKTogVFtdIHtcbiAgICBjb25zdCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHR5cGUpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKVxuICAgICAgICByZXR1cm4gW3N0cmluZ107XG5cbiAgICByZXR1cm4gW3N0cmluZy5zdWJzdHJpbmcoMCwgaW5kZXgpLCBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgdHlwZS5sZW5ndGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1dFRoZUxhc3QodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZih0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRlbnNpb248VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RyaW5nOiBUKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbVR5cGUodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHdoaWxlIChzdHJpbmcuc3RhcnRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyh0eXBlLmxlbmd0aCk7XG5cbiAgICB3aGlsZSAoc3RyaW5nLmVuZHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sZW5ndGggLSB0eXBlLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Vic3RyaW5nU3RhcnQ8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RhcnQ6IHN0cmluZywgc3RyaW5nOiBUKTogVCB7XG4gICAgaWYoc3RyaW5nLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdGFydC5sZW5ndGgpO1xuICAgIHJldHVybiBzdHJpbmc7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4vU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBHZW5lcmF0b3IsIFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tIFwic291cmNlLW1hcC1qc1wiO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcyB9IGZyb20gJy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgU3BsaXRGaXJzdCB9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgcHJvdGVjdGVkIG1hcDogU291cmNlTWFwR2VuZXJhdG9yO1xuICAgIHByb3RlY3RlZCBmaWxlRGlyTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBsaW5lQ291bnQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBodHRwU291cmNlID0gdHJ1ZSwgcHJvdGVjdGVkIHJlbGF0aXZlID0gZmFsc2UsIHByb3RlY3RlZCBpc0NzcyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgICAgICAgICBmaWxlOiBmaWxlUGF0aC5zcGxpdCgvXFwvfFxcXFwvKS5wb3AoKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWh0dHBTb3VyY2UpXG4gICAgICAgICAgICB0aGlzLmZpbGVEaXJOYW1lID0gcGF0aC5kaXJuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTb3VyY2Uoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgICAgc291cmNlID0gc291cmNlLnNwbGl0KCc8bGluZT4nKS5wb3AoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaHR0cFNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkuaW5jbHVkZXMocGF0aC5leHRuYW1lKHNvdXJjZSkuc3Vic3RyaW5nKDEpKSlcbiAgICAgICAgICAgICAgICBzb3VyY2UgKz0gJy5zb3VyY2UnO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IFNwbGl0Rmlyc3QoJy8nLCBzb3VyY2UpLnBvcCgpICsgJz9zb3VyY2U9dHJ1ZSc7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUoKHRoaXMucmVsYXRpdmUgPyAnJzogJy8nKSArIHNvdXJjZS5yZXBsYWNlKC9cXFxcL2dpLCAnLycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRoaXMuZmlsZURpck5hbWUsIEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgc291cmNlKTtcbiAgICB9XG5cbiAgICBnZXRSb3dTb3VyY2VNYXAoKTogUmF3U291cmNlTWFwe1xuICAgICAgICByZXR1cm4gKDxhbnk+dGhpcy5tYXApLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICBsZXQgbWFwU3RyaW5nID0gYHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20odGhpcy5tYXAudG9TdHJpbmcoKSkudG9TdHJpbmcoXCJiYXNlNjRcIil9YDtcblxuICAgICAgICBpZiAodGhpcy5pc0NzcylcbiAgICAgICAgICAgIG1hcFN0cmluZyA9IGAvKiMgJHttYXBTdHJpbmd9Ki9gXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1hcFN0cmluZyA9ICcvLyMgJyArIG1hcFN0cmluZztcblxuICAgICAgICByZXR1cm4gJ1xcclxcbicgKyBtYXBTdHJpbmc7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VNYXBTdG9yZSBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcml2YXRlIHN0b3JlU3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Mb2FkOiB7IG5hbWU6IHN0cmluZywgZGF0YTogYW55W10gfVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgZGVidWcgPSB0cnVlLCBpc0NzcyA9IGZhbHNlLCBodHRwU291cmNlID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgZmFsc2UsIGlzQ3NzKTtcbiAgICB9XG5cbiAgICBub3RFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uTG9hZC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGFkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTdHJpbmdUcmFja2VyJywgZGF0YTogW3RyYWNrLCB7dGV4dH1dIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuXG4gICAgYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkVGV4dCcsIGRhdGE6IFt0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHRoaXMubGluZUNvdW50ICs9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VVJMU291cmNlTWFwKG1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1hcC5zb3VyY2VzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIG1hcC5zb3VyY2VzW2ldID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKG1hcC5zb3VyY2VzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG5cbiAgICBhc3luYyBhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbZnJvbU1hcCwgdHJhY2ssIHRleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkuZWFjaE1hcHBpbmcoKG0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFJbmZvID0gdHJhY2suZ2V0TGluZShtLm9yaWdpbmFsTGluZSkuZ2V0RGF0YUFycmF5KClbMF07XG5cbiAgICAgICAgICAgIGlmIChtLnNvdXJjZSA9PSB0aGlzLmZpbGVQYXRoKVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogZGF0YUluZm8ubGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUgKyB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1uIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiBtLmdlbmVyYXRlZExpbmUsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hZGRUZXh0KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRBbGwoKSB7XG4gICAgICAgIGZvciAoY29uc3QgeyBuYW1lLCBkYXRhIH0gb2YgdGhpcy5hY3Rpb25Mb2FkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkVGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRUZXh0KC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyJzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICB0aGlzLmJ1aWxkQWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpXG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YVdpdGhNYXAoKSB7XG4gICAgICAgIHRoaXMuYnVpbGRBbGwoKTtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVTdHJpbmcgKyBzdXBlci5tYXBBc1VSTENvbW1lbnQoKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBTb3VyY2VNYXBTdG9yZSh0aGlzLmZpbGVQYXRoLCB0aGlzLmRlYnVnLCB0aGlzLmlzQ3NzLCB0aGlzLmh0dHBTb3VyY2UpO1xuICAgICAgICBjb3B5LmFjdGlvbkxvYWQucHVzaCguLi50aGlzLmFjdGlvbkxvYWQpXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwQmFzaWMgfSBmcm9tICcuLi9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUnO1xuXG5jbGFzcyBjcmVhdGVQYWdlU291cmNlTWFwIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2UgPSBmYWxzZSwgcmVsYXRpdmUgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgICAgICB0aGlzLmxpbmVDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgYWRkTWFwcGluZ0Zyb21UcmFjayh0cmFjazogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dHB1dE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgc3RvcmVNYXAuYWRkTWFwcGluZ0Zyb21UcmFjayh0ZXh0KTtcblxuICAgIHJldHVybiBzdG9yZU1hcC5nZXRSb3dTb3VyY2VNYXAoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dHB1dFdpdGhNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZyl7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCk7XG4gICAgc3RvcmVNYXAuYWRkTWFwcGluZ0Zyb21UcmFjayh0ZXh0KTtcblxuICAgIHJldHVybiB0ZXh0LmVxICsgc3RvcmVNYXAubWFwQXNVUkxDb21tZW50KCk7XG59IiwgImltcG9ydCB7IEJhc2ljU2V0dGluZ3MgfSBmcm9tIFwiLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IG91dHB1dE1hcCwgb3V0cHV0V2l0aE1hcCB9IGZyb20gXCIuL1N0cmluZ1RyYWNrZXJUb1NvdXJjZU1hcFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgdGV4dD86IHN0cmluZyxcbiAgICBpbmZvOiBzdHJpbmcsXG4gICAgbGluZT86IG51bWJlcixcbiAgICBjaGFyPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTdHJpbmdJbmRleGVySW5mbyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5TWF0Y2ggZXh0ZW5kcyBBcnJheTxTdHJpbmdUcmFja2VyPiB7XG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgaW5wdXQ/OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmluZ1RyYWNrZXIge1xuICAgIHByaXZhdGUgRGF0YUFycmF5OiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuICAgIHB1YmxpYyBJbmZvVGV4dDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgT25MaW5lID0gMTtcbiAgICBwdWJsaWMgT25DaGFyID0gMTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gSW5mb1RleHQgdGV4dCBpbmZvIGZvciBhbGwgbmV3IHN0cmluZyB0aGF0IGFyZSBjcmVhdGVkIGluIHRoaXMgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKEluZm8/OiBzdHJpbmcgfCBTdHJpbmdUcmFja2VyRGF0YUluZm8sIHRleHQ/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBJbmZvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mbztcbiAgICAgICAgfSBlbHNlIGlmIChJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHQoSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgdGhpcy5BZGRGaWxlVGV4dCh0ZXh0LCB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhdGljIGdldCBlbXB0eUluZm8oKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXREZWZhdWx0KEluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dCkge1xuICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mby5pbmZvO1xuICAgICAgICB0aGlzLk9uTGluZSA9IEluZm8ubGluZTtcbiAgICAgICAgdGhpcy5PbkNoYXIgPSBJbmZvLmNoYXI7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERhdGFBcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBsYXN0IEluZm9UZXh0XG4gICAgICovXG4gICAgcHVibGljIGdldCBEZWZhdWx0SW5mb1RleHQoKTogU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICAgICAgaWYgKCF0aGlzLkRhdGFBcnJheS5maW5kKHggPT4geC5pbmZvKSAmJiB0aGlzLkluZm9UZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5mbzogdGhpcy5JbmZvVGV4dCxcbiAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLk9uTGluZSxcbiAgICAgICAgICAgICAgICBjaGFyOiB0aGlzLk9uQ2hhclxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5W3RoaXMuRGF0YUFycmF5Lmxlbmd0aCAtIDFdID8/IFN0cmluZ1RyYWNrZXIuZW1wdHlJbmZvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgSW5mb1RleHQgdGhhdCBhcmUgc2V0dGVkIG9uIHRoZSBmaXJzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIGdldCBTdGFydEluZm8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVswXSA/PyB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IGFzIG9uZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCBPbmVTdHJpbmcoKSB7XG4gICAgICAgIGxldCBiaWdTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBiaWdTdHJpbmcgKz0gaS50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpZ1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYWxsIHRoZSB0ZXh0IHNvIHlvdSBjYW4gY2hlY2sgaWYgaXQgZXF1YWwgb3Igbm90XG4gICAgICogdXNlIGxpa2UgdGhhdDogbXlTdHJpbmcuZXEgPT0gXCJjb29sXCJcbiAgICAgKi9cbiAgICBnZXQgZXEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGluZm8gYWJvdXQgdGhpcyB0ZXh0XG4gICAgICovXG4gICAgZ2V0IGxpbmVJbmZvKCkge1xuICAgICAgICBjb25zdCBkID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGNvbnN0IHMgPSBkLmluZm8uc3BsaXQoJzxsaW5lPicpO1xuICAgICAgICBzLnB1c2goQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzLnBvcCgpKTtcblxuICAgICAgICByZXR1cm4gYCR7cy5qb2luKCc8bGluZT4nKX06JHtkLmxpbmV9OiR7ZC5jaGFyfWA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBsZW5ndGggb2YgdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5Lmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyBjb3B5IG9mIHRoaXMgc3RyaW5nIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZSgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdEYXRhLkFkZFRleHRBZnRlcihpLnRleHQsIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgQWRkQ2xvbmUoZGF0YTogU3RyaW5nVHJhY2tlcikge1xuICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKC4uLmRhdGEuRGF0YUFycmF5KTtcblxuICAgICAgICB0aGlzLnNldERlZmF1bHQoe1xuICAgICAgICAgICAgaW5mbzogZGF0YS5JbmZvVGV4dCxcbiAgICAgICAgICAgIGxpbmU6IGRhdGEuT25MaW5lLFxuICAgICAgICAgICAgY2hhcjogZGF0YS5PbkNoYXJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgYW55IHRoaW5nIHRvIGNvbm5lY3RcbiAgICAgKiBAcmV0dXJucyBjb25uY3RlZCBzdHJpbmcgd2l0aCBhbGwgdGhlIHRleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvbmNhdCguLi50ZXh0OiBhbnlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0ZXh0KSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGRhdGEgXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgY2xvbmUgcGx1cyB0aGUgbmV3IGRhdGEgY29ubmVjdGVkXG4gICAgICovXG4gICAgcHVibGljIENsb25lUGx1cyguLi5kYXRhOiBhbnlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICByZXR1cm4gU3RyaW5nVHJhY2tlci5jb25jYXQodGhpcy5DbG9uZSgpLCAuLi5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5nIG9yIGFueSBkYXRhIHRvIHRoaXMgc3RyaW5nXG4gICAgICogQHBhcmFtIGRhdGEgY2FuIGJlIGFueSB0aGluZ1xuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIChub3QgbmV3IHN0cmluZylcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyguLi5kYXRhOiBhbnlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIGxhc3RpbmZvID0gaS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKGkpLCBsYXN0aW5mby5pbmZvLCBsYXN0aW5mby5saW5lLCBsYXN0aW5mby5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbnMgb3Qgb3RoZXIgZGF0YSB3aXRoICdUZW1wbGF0ZSBsaXRlcmFscydcbiAgICAgKiB1c2VkIGxpa2UgdGhpczogbXlTdHJpbi4kUGx1cyBgdGhpcyB2ZXJ5JHtjb29sU3RyaW5nfSFgXG4gICAgICogQHBhcmFtIHRleHRzIGFsbCB0aGUgc3BsaXRlZCB0ZXh0XG4gICAgICogQHBhcmFtIHZhbHVlcyBhbGwgdGhlIHZhbHVlc1xuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzJCh0ZXh0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogKFN0cmluZ1RyYWNrZXIgfCBhbnkpW10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0c1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVzW2ldO1xuXG4gICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0LCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyh2YWx1ZSksIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dHNbdGV4dHMubGVuZ3RoIC0gMV0sIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IHN0cmluZyB0byBhZGRcbiAgICAgKiBAcGFyYW0gYWN0aW9uIHdoZXJlIHRvIGFkZCB0aGUgdGV4dFxuICAgICAqIEBwYXJhbSBpbmZvIGluZm8gdGhlIGNvbWUgd2l0aCB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRUZXh0QWN0aW9uKHRleHQ6IHN0cmluZywgYWN0aW9uOiBcInB1c2hcIiB8IFwidW5zaGlmdFwiLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbywgTGluZUNvdW50ID0gMCwgQ2hhckNvdW50ID0gMSk6IHZvaWQge1xuICAgICAgICBjb25zdCBkYXRhU3RvcmU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mb1tdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFsuLi50ZXh0XSkge1xuICAgICAgICAgICAgZGF0YVN0b3JlLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkRhdGFBcnJheVthY3Rpb25dKC4uLmRhdGFTdG9yZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKiBAcGFyYW0gaW5mbyBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJwdXNoXCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZyB3aXRob3V0IHRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlck5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm86ICcnLFxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QmVmb3JlKHRleHQ6IHN0cmluZywgaW5mbz86IHN0cmluZywgbGluZT86IG51bWJlciwgY2hhcj86IG51bWJlcikge1xuICAgICAgICB0aGlzLkFkZFRleHRBY3Rpb24odGV4dCwgXCJ1bnNoaWZ0XCIsIGluZm8sIGxpbmUsIGNoYXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAqIGFkZCB0ZXh0IGF0IHRoZSAqc3RhcnQqIG9mIHRoZSBzdHJpbmdcbiAqIEBwYXJhbSB0ZXh0IFxuICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmVOb1RyYWNrKHRleHQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjb3B5ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICBjb3B5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkudW5zaGlmdCguLi5jb3B5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIFRleHQgRmlsZSBUcmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHByaXZhdGUgQWRkRmlsZVRleHQodGV4dDogc3RyaW5nLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbykge1xuICAgICAgICBsZXQgTGluZUNvdW50ID0gMSwgQ2hhckNvdW50ID0gMTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2ltcGxlIG1ldGhvZiB0byBjdXQgc3RyaW5nXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgbmV3IGN1dHRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEN1dFN0cmluZyhzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcblxuICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnB1c2goLi4udGhpcy5EYXRhQXJyYXkuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIHdoaWxlICgobGltaXQgPT0gbnVsbCB8fCBjb3VudGVyIDwgbGltaXQpICYmIGhhc01hdGg/LlswXT8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBbLi4uaGFzTWF0aFswXV0ubGVuZ3RoLCBpbmRleCA9IHRoaXMuY2hhckxlbmd0aChoYXNNYXRoLmluZGV4KTtcbiAgICAgICAgICAgIGFsbFNwbGl0LnB1c2goe1xuICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCArIGFkZE5leHQsXG4gICAgICAgICAgICAgICAgbGVuZ3RoXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFpblRleHQgPSBtYWluVGV4dC5zbGljZShoYXNNYXRoLmluZGV4ICsgaGFzTWF0aFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IGVycm9yIGluZm8gZm9ybSBlcnJvciBtZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIGRlYnVnTGluZSh7IG1lc3NhZ2UsIHRleHQsIGxvY2F0aW9uLCBsaW5lLCBjb2wsIHNhc3NTdGFjayB9OiB7IHNhc3NTdGFjaz86IHN0cmluZywgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyIH0pOiBzdHJpbmcge1xuICAgICAgICBpZiAoc2Fzc1N0YWNrKSB7XG4gICAgICAgICAgICBjb25zdCBsb2MgPSBzYXNzU3RhY2subWF0Y2goL1swLTldKzpbMC05XSsvKVswXS5zcGxpdCgnOicpLm1hcCh4ID0+IE51bWJlcih4KSk7XG4gICAgICAgICAgICBsaW5lID0gbG9jWzBdO1xuICAgICAgICAgICAgY29sID0gbG9jWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSA/PyBsb2NhdGlvbj8ubGluZSA/PyAxKSwgY29sdW1uID0gY29sID8/IGxvY2F0aW9uPy5jb2x1bW4gPz8gMDtcbiAgICAgICAgaWYgKHNlYXJjaExpbmUuc3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgICAgICAgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZSgobGluZSA/PyBsb2NhdGlvbj8ubGluZSkgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHNlYXJjaExpbmUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICByZXR1cm4gYCR7dGV4dCB8fCBtZXNzYWdlfSwgb24gZmlsZSAtPiAke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRofSR7ZGF0YS5pbmZvLnNwbGl0KCc8bGluZT4nKS5zaGlmdCgpfToke2RhdGEubGluZX06JHtjb2x1bW59YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nV2l0aFRhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dFdpdGhNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbilcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgICAgICByZXR1cm4gb3V0cHV0TWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24sIGh0dHBTb3VyY2UsIHJlbGF0aXZlKVxuICAgIH1cbn0iLCAiaW1wb3J0IHR5cGUgeyB0YWdEYXRhT2JqZWN0QXJyYXl9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuXG5jb25zdCBudW1iZXJzID0gWydudW1iZXInLCAnbnVtJywgJ2ludGVnZXInLCAnaW50J10sIGJvb2xlYW5zID0gWydib29sZWFuJywgJ2Jvb2wnXTtcbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uID0gWydlbWFpbCcsICdzdHJpbmcnLCAndGV4dCcsIC4uLm51bWJlcnMsIC4uLmJvb2xlYW5zXTtcblxuY29uc3QgZW1haWxWYWxpZGF0b3IgPSAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvO1xuXG5cblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25SZWdleCA9IHtcbiAgICBcInN0cmluZy1sZW5ndGgtcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy1bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy0nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgdGV4dDogc3RyaW5nKSA9PiB0ZXh0Lmxlbmd0aCA+PSBtaW4gJiYgdGV4dC5sZW5ndGggPD0gbWF4LFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLi5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLXN0cmluZ1wiOiBbXG4gICAgICAgIC9ec3RyaW5nfHRleHQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IGBcIiR7eC50cmltKCkucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKX1cImApLFxuICAgICAgICAob3B0aW9uczogc3RyaW5nW10sIHRleHQ6IHN0cmluZykgPT4gb3B0aW9ucy5pbmNsdWRlcyh0ZXh0KSxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2UtbnVtYmVyXCI6IFtcbiAgICAgICAgL15udW1iZXJ8bnVtfGludGVnZXJ8aW50K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKSxcbiAgICAgICAgKG9wdGlvbnM6IG51bWJlcltdLCBudW06IG51bWJlcikgPT4gb3B0aW9ucy5pbmNsdWRlcyhudW0pLFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXVxufTtcblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzID0gWy4uLm51bWJlcnNdO1xuXG5mb3IoY29uc3QgaSBpbiBidWlsdEluQ29ubmVjdGlvblJlZ2V4KXtcbiAgICBjb25zdCB0eXBlID0gYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtpXVszXTtcblxuICAgIGlmKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyh0eXBlKSlcbiAgICAgICAgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLnB1c2goaSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVWYWx1ZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIGlmIChidWlsdEluQ29ubmVjdGlvbi5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBgW1wiJHt2YWx1ZX1cIl1gO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgW3Rlc3QsIGdldEFyZ3NdXSBvZiBPYmplY3QuZW50cmllcyhidWlsdEluQ29ubmVjdGlvblJlZ2V4KSlcbiAgICAgICAgaWYgKCg8UmVnRXhwPnRlc3QpLnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIGBbXCIke25hbWV9XCIsICR7KDxhbnk+Z2V0QXJncykodmFsdWUpfV1gO1xuXG4gICAgcmV0dXJuIGBbJHt2YWx1ZX1dYDtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVZhbGlkYXRpb25KU09OKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBQcm9taXNlPGJvb2xlYW4gfCBzdHJpbmdbXT4ge1xuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50LCAuLi5lbGVtZW50QXJnc10gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuICAgICAgICBsZXQgcmV0dXJuTm93ID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdudW0nOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICBjYXNlICdpbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFlbWFpbFZhbGlkYXRvci50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXZlUmVnZXggPSB2YWx1ZSAhPSBudWxsICYmIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbZWxlbWVudF07XG5cbiAgICAgICAgICAgICAgICBpZihoYXZlUmVnZXgpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhaGF2ZVJlZ2V4WzJdKGVsZW1lbnRBcmdzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gZWxlbWVudC50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhYXdhaXQgZWxlbWVudCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0dXJuTm93KSB7XG4gICAgICAgICAgICBsZXQgaW5mbyA9IGBmYWlsZWQgYXQgJHtpfSBmaWxlZCAtICR7aXNEZWZhdWx0ID8gcmV0dXJuTm93IDogJ2V4cGVjdGVkICcgKyBlbGVtZW50fWA7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRBcmdzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBpbmZvICs9IGAsIGFyZ3VtZW50czogJHtKU09OLnN0cmluZ2lmeShlbGVtZW50QXJncyl9YDtcblxuICAgICAgICAgICAgaW5mbyArPSBgLCBpbnB1dDogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIFtpbmZvLCBlbGVtZW50LCBlbGVtZW50QXJncywgdmFsdWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVZhbHVlcyhhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IHBhcnNlZCA9IFtdO1xuXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnRdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcblxuICAgICAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKGVsZW1lbnQpKVxuICAgICAgICAgICAgcGFyc2VkLnB1c2gocGFyc2VGbG9hdCh2YWx1ZSkpO1xuXG4gICAgICAgIGVsc2UgaWYgKGJvb2xlYW5zLmluY2x1ZGVzKGVsZW1lbnQpKVxuICAgICAgICAgICAgcGFyc2VkLnB1c2godmFsdWUgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZSk7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFyc2VkLnB1c2godmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgZmluZDogc3RyaW5nLCBkZWZhdWx0RGF0YTogYW55ID0gbnVsbCk6IHN0cmluZyB8IG51bGwgfCBib29sZWFue1xuICAgIGNvbnN0IGhhdmUgPSBkYXRhLmhhdmUoZmluZCksIHZhbHVlID0gZGF0YS5yZW1vdmUoZmluZCk7XG5cbiAgICBpZihoYXZlICYmIHZhbHVlICE9ICdmYWxzZScpIHJldHVybiB2YWx1ZSB8fCBoYXZlICAgIFxuICAgIGlmKHZhbHVlID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZighaGF2ZSkgcmV0dXJuIGRlZmF1bHREYXRhO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xufSIsICJpbXBvcnQgeyBwcmludCB9IGZyb20gJy4vQ29uc29sZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBQcmludElmTmV3KHtpZCwgdGV4dCwgdHlwZSA9IFwid2FyblwiLCBlcnJvck5hbWV9OiBQcmV2ZW50TG9nKSB7XG4gICAgaWYoIVByZXZlbnREb3VibGVMb2cuaW5jbHVkZXMoaWQgPz8gdGV4dCkgJiYgIVNldHRpbmdzLlByZXZlbnRFcnJvcnMuaW5jbHVkZXMoZXJyb3JOYW1lKSl7XG4gICAgICAgIHByaW50W3R5cGVdKHRleHQucmVwbGFjZSgvPGxpbmU+L2dpLCAnIC0+ICcpLCBgXFxuXFxuRXJyb3IgY29kZTogJHtlcnJvck5hbWV9XFxuXFxuYCk7XG4gICAgICAgIFByZXZlbnREb3VibGVMb2cucHVzaChpZCA/PyB0ZXh0KTtcbiAgICB9XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWluQ3NzKGNvZGU6IHN0cmluZyl7XG4gICAgd2hpbGUoY29kZS5pbmNsdWRlcygnICAnKSl7XG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLyB7Mn0vZ2ksICcgJyk7XG4gICAgfVxuXG4gICAgLy9yZW1vdmluZyBzcGFjZXNcbiAgICBjb2RlID0gY29kZS5yZXBsYWNlKC9cXHJcXG58XFxuL2dpLCAnJyk7XG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvLCAvZ2ksICcsJyk7XG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvOiAvZ2ksICc6Jyk7XG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvIFxcey9naSwgJ3snKTtcbiAgICBjb2RlID0gY29kZS5yZXBsYWNlKC9cXHsgL2dpLCAneycpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLzsgL2dpLCAnOycpO1xuXG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFwvXFwqLio/XFwqXFwvL2dtcywgJycpOyAvLyByZW1vdmUgY29tbWVudHNcblxuICAgIHJldHVybiBjb2RlLnRyaW0oKTtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi4vLi4vRWFzeURlYnVnL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgdGFnRGF0YU9iamVjdEFycmF5LCBTdHJpbmdOdW1iZXJNYXAsIEJ1aWxkSW5Db21wb25lbnQsIEJ1aWxkU2NyaXB0V2l0aG91dE1vZHVsZSB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcbmltcG9ydCBtYXJrZG93biBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCBobGpzIGZyb20gJ2hpZ2hsaWdodC5qcyc7XG5pbXBvcnQgeyBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuIH0gZnJvbSAnLi9zZXJ2LWNvbm5lY3QvaW5kZXgnO1xuaW1wb3J0IHsgUHJpbnRJZk5ldyB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L1ByaW50TmV3JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEVhc3lGcyBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9FYXN5RnMnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55KSB7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJDb2RlKG9yaWdSdWxlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ1JlbmRlcmVkID0gb3JpZ1J1bGUoLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb2RlLWNvcHlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2NvcHktY2xpcGJvYXJkXCIgb25jbGljaz1cIm5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRoaXMucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0KVwiPmNvcHk8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgJHtvcmlnUmVuZGVyZWR9XG4gICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrKTtcbiAgICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuZmVuY2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIGNvbnN0IGhsanNDbGFzcyA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSkpLFxuICAgICAgICBicmVha3M6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSksXG4gICAgICAgIHR5cG9ncmFwaGVyOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3R5cG9ncmFwaGVyJywgbWFya0Rvd25QbHVnaW4/LnR5cG9ncmFwaGVyID8/IHRydWUpKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBQcmludElmTmV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGVycixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck5hbWU6ICdtYXJrZG93bi1wYXJzZXInXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoY29kZVdpdGhDb3B5KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYWJicicsIG1hcmtEb3duUGx1Z2luPy5hYmJyID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEFiYnIpO1xuXG4gICAgbGV0IG1hcmtkb3duQ29kZSA9IEJldHdlZW5UYWdEYXRhPy5lcTtcbiAgICBpZiAoIW1hcmtkb3duQ29kZSkge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpKSwgZGF0YVRhZy5yZW1vdmUoJ2ZpbGUnKSk7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnJlbW92ZSgnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICBzZXNzaW9uLnN0eWxlKGNzc0xpbmspO1xuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAndGhlbWUnLCBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgaWYgKGRhdGFUYWcubGVuZ3RoKVxuICAgICAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuICAgIGVsc2VcbiAgICAgICAgYnVpbGRIVE1MLkFkZFRleHRBZnRlcihyZW5kZXJIVE1MKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBidWlsZEhUTUwsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cbmNvbnN0IHRoZW1lQXJyYXkgPSBbJycsICctZGFyaycsICctbGlnaHQnXTtcbmNvbnN0IHRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlNYXJrZG93blRoZW1lKCkge1xuICAgIGZvciAoY29uc3QgaSBvZiB0aGVtZUFycmF5KSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSAoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoZW1lUGF0aCArIGkgKyAnLmNzcycpKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXG5cXC5tYXJrZG93bi1ib2R5IHspfCheLm1hcmtkb3duLWJvZHkgeykvZ20sIChtYXRjaDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoICsgJ3BhZGRpbmc6MjBweDsnXG4gICAgICAgICAgICB9KSArIGBcbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206LTMwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OjEwcHg7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTowO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weTpob3Zlcj5kaXYge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IGE6Zm9jdXMge1xuICAgICAgICAgICAgICAgIGNvbG9yOiM2YmI4NmFcbiAgICAgICAgICAgIH1gO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCB7IGF1dG9Db2RlVGhlbWUsIG1pbmlmeU1hcmtkb3duVGhlbWUgfSBmcm9tIFwiLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93blwiO1xuYXdhaXQgbWluaWZ5TWFya2Rvd25UaGVtZSgpO1xuYXdhaXQgYXV0b0NvZGVUaGVtZSgpOyIsICJpbXBvcnQgeyBjaGRpciwgY3dkIH0gZnJvbSBcInByb2Nlc3NcIjtcbmNvbnN0IHBhdGhUaGlzID0gY3dkKCkuc3BsaXQoJy8nKTtcblxuZnVuY3Rpb24gY2hlY2tCYXNlKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAocGF0aFRoaXMuYXQoLWluZGV4KSA9PSAnbm9kZV9tb2R1bGVzJykge1xuICAgICAgICBjaGRpcignLi4vJy5yZXBlYXQoaW5kZXgpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmlmICghY2hlY2tCYXNlKDIpKVxuICAgIGNoZWNrQmFzZSgzKTtcblxuaW1wb3J0KCcuL2J1aWxkLXNjcmlwdHMuanMnKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxXQU1TO0FBTmI7QUFBQTtBQUFBLElBQUksWUFBWTtBQU1ULElBQU0sUUFBUSxJQUFJLE1BQU0sU0FBUTtBQUFBLE1BQ25DLElBQUksUUFBUSxNQUFNLFVBQVU7QUFDeEIsWUFBRztBQUNDLGlCQUFPLE9BQU87QUFDbEIsZUFBTyxNQUFNO0FBQUEsUUFBQztBQUFBLE1BQ2xCO0FBQUEsSUFDSixDQUFDO0FBQUE7QUFBQTs7O0FDWkQ7QUFFQTtBQUVBLGdCQUFnQixPQUErQjtBQUMzQyxTQUFPLElBQUksUUFBUSxTQUFPO0FBQ3RCLE9BQUcsS0FBSyxPQUFNLENBQUMsS0FBSyxVQUFTO0FBQ3pCLFVBQUksUUFBUSxLQUFJLENBQUM7QUFBQSxJQUNyQixDQUFDO0FBQUEs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
