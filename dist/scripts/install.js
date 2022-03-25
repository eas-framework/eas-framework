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
        if (printMode && prop != "do-nothing")
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
    init_Splitting();
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
var init_SourceMap = __esm({
  "src/EasyDebug/SourceMap.ts"() {
  }
});

// src/EasyDebug/SourceMapStore.ts
import { SourceMapGenerator as SourceMapGenerator2, SourceMapConsumer as SourceMapConsumer2 } from "source-map";
import path3 from "path";
var SourceMapBasic;
var init_SourceMapStore = __esm({
  "src/EasyDebug/SourceMapStore.ts"() {
    init_SearchFileSystem();
    init_Splitting();
    init_SourceMap();
    SourceMapBasic = class {
      constructor(filePath, httpSource = true, relative = false, isCss = false) {
        this.filePath = filePath;
        this.httpSource = httpSource;
        this.relative = relative;
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
    init_Console();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL091dHB1dElucHV0L0NvbnNvbGUudHMiLCAiLi4vLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi8uLi9zcmMvU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcudHMiLCAiLi4vLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtLnRzIiwgIi4uLy4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwLnRzIiwgIi4uLy4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUudHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXAudHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyLnRzIiwgIi4uLy4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlcnYtY29ubmVjdC9pbmRleC50cyIsICIuLi8uLi9zcmMvT3V0cHV0SW5wdXQvUHJpbnROZXcudHMiLCAiLi4vLi4vc3JjL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplci50cyIsICIuLi8uLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93bi50cyIsICIuLi8uLi9zcmMvc2NyaXB0cy9idWlsZC1zY3JpcHRzLnRzIiwgIi4uLy4uL3NyYy9zY3JpcHRzL2luc3RhbGwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImxldCBwcmludE1vZGUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dQcmludChkOiBib29sZWFuKSB7XG4gICAgcHJpbnRNb2RlID0gZDtcbn1cblxuZXhwb3J0IGNvbnN0IHByaW50ID0gbmV3IFByb3h5KGNvbnNvbGUse1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmKHByaW50TW9kZSAmJiBwcm9wICE9IFwiZG8tbm90aGluZ1wiKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgfVxufSk7IiwgImltcG9ydCBmcywge0RpcmVudCwgU3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICByZXMoQm9vbGVhbihzdGF0KSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtwYXRoIG9mIHRoZSBmaWxlfSBwYXRoIFxuICogQHBhcmFtIHtmaWxlZCB0byBnZXQgZnJvbSB0aGUgc3RhdCBvYmplY3R9IGZpbGVkIFxuICogQHJldHVybnMgdGhlIGZpbGVkXG4gKi9cbmZ1bmN0aW9uIHN0YXQocGF0aDogc3RyaW5nLCBmaWxlZD86IHN0cmluZywgaWdub3JlRXJyb3I/OiBib29sZWFuLCBkZWZhdWx0VmFsdWU6YW55ID0ge30pOiBQcm9taXNlPFN0YXRzIHwgYW55PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMuc3RhdChwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnIgJiYgIWlnbm9yZUVycm9yKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKGZpbGVkICYmIHN0YXQ/IHN0YXRbZmlsZWRdOiBzdGF0IHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBmaWxlIGV4aXN0cywgcmV0dXJuIHRydWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2FueX0gW2lmVHJ1ZVJldHVybj10cnVlXSAtIGFueSA9IHRydWVcbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhpc3RzRmlsZShwYXRoOiBzdHJpbmcsIGlmVHJ1ZVJldHVybjogYW55ID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIChhd2FpdCBzdGF0KHBhdGgsIHVuZGVmaW5lZCwgdHJ1ZSkpLmlzRmlsZT8uKCkgJiYgaWZUcnVlUmV0dXJuO1xufVxuXG4vKipcbiAqIEl0IGNyZWF0ZXMgYSBkaXJlY3RvcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5ta2RpcihwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGBybWRpcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJtZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJtZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHVubGlua2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYm9vbGVhblxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy51bmxpbmsocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBleGlzdHMsIGRlbGV0ZSBpdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gYmUgdW5saW5rZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVubGlua0lmRXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoYXdhaXQgZXhpc3RzKHBhdGgpKXtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVubGluayhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGByZWFkZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25zIG9iamVjdCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIG9wdGlvbnMgLSB7XG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiByZWFkZGlyKHBhdGg6IHN0cmluZywgb3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXSB8IEJ1ZmZlcltdIHwgRGlyZW50W10+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHBhdGgsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgeW91IHdhbnQgdG8gY3JlYXRlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5IHdhcyBjcmVhdGVkIG9yIG5vdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWtkaXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIGlmKCFhd2FpdCBleGlzdHMocGF0aCkpXG4gICAgICAgIHJldHVybiBhd2FpdCBta2RpcihwYXRoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogV3JpdGUgYSBmaWxlIHRvIHRoZSBmaWxlIHN5c3RlbVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlld30gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiAgc3RyaW5nIHwgTm9kZUpTLkFycmF5QnVmZmVyVmlldyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZShwYXRoLCBjb250ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGB3cml0ZUpzb25GaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhIGNvbnRlbnQgYW5kIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZSBhdFxuICogdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0ge2FueX0gY29udGVudCAtIFRoZSBjb250ZW50IHRvIHdyaXRlIHRvIHRoZSBmaWxlLlxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiB3cml0ZUpzb25GaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBKU09OLnN0cmluZ2lmeShjb250ZW50KSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBwYXRoIGFuZCBhbiBvcHRpb25hbCBlbmNvZGluZyBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICogcmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gW2VuY29kaW5nPXV0ZjhdIC0gVGhlIGVuY29kaW5nIG9mIHRoZSBmaWxlLiBEZWZhdWx0cyB0byB1dGY4LlxuICogQHJldHVybnMgQSBwcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWFkRmlsZShwYXRoOnN0cmluZywgZW5jb2RpbmcgPSAndXRmOCcpOiBQcm9taXNlPHN0cmluZ3xhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCA8YW55PmVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZGF0YSB8fCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSXQgcmVhZHMgYSBKU09OIGZpbGUgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBKU09OIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW5jb2RpbmddIC0gVGhlIGVuY29kaW5nIHRvIHVzZSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uRmlsZShwYXRoOnN0cmluZywgZW5jb2Rpbmc/OnN0cmluZyk6IFByb21pc2U8YW55PntcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZShwYXRoLCBlbmNvZGluZykpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge307XG59XG5cbi8qKlxuICogSWYgdGhlIHBhdGggZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gKiBAcGFyYW0gcCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBbYmFzZV0gLSBUaGUgYmFzZSBwYXRoIHRvIHRoZSBmaWxlLlxuICovXG5hc3luYyBmdW5jdGlvbiBtYWtlUGF0aFJlYWwocDpzdHJpbmcsIGJhc2UgPSAnJykge1xuICAgIHAgPSBwYXRoLmRpcm5hbWUocCk7XG5cbiAgICBpZiAoIWF3YWl0IGV4aXN0cyhiYXNlICsgcCkpIHtcbiAgICAgICAgY29uc3QgYWxsID0gcC5zcGxpdCgvXFxcXHxcXC8vKTtcblxuICAgICAgICBsZXQgcFN0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsKSB7XG4gICAgICAgICAgICBpZiAocFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwU3RyaW5nICs9ICcvJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBTdHJpbmcgKz0gaTtcblxuICAgICAgICAgICAgYXdhaXQgbWtkaXJJZk5vdEV4aXN0cyhiYXNlICsgcFN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vdHlwZXNcbmV4cG9ydCB7XG4gICAgRGlyZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5mcy5wcm9taXNlcyxcbiAgICBleGlzdHMsXG4gICAgZXhpc3RzRmlsZSxcbiAgICBzdGF0LFxuICAgIG1rZGlyLFxuICAgIG1rZGlySWZOb3RFeGlzdHMsXG4gICAgd3JpdGVGaWxlLFxuICAgIHdyaXRlSnNvbkZpbGUsXG4gICAgcmVhZEZpbGUsXG4gICAgcmVhZEpzb25GaWxlLFxuICAgIHJtZGlyLFxuICAgIHVubGluayxcbiAgICB1bmxpbmtJZkV4aXN0cyxcbiAgICByZWFkZGlyLFxuICAgIG1ha2VQYXRoUmVhbFxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5cbmludGVyZmFjZSBnbG9iYWxTdHJpbmc8VD4ge1xuICAgIGluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgbGFzdEluZGV4T2Yoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXI7XG4gICAgc3RhcnRzV2l0aChzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTcGxpdEZpcnN0PFQgZXh0ZW5kcyBnbG9iYWxTdHJpbmc8VD4+KHR5cGU6IHN0cmluZywgc3RyaW5nOiBUKTogVFtdIHtcbiAgICBjb25zdCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHR5cGUpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKVxuICAgICAgICByZXR1cm4gW3N0cmluZ107XG5cbiAgICByZXR1cm4gW3N0cmluZy5zdWJzdHJpbmcoMCwgaW5kZXgpLCBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgdHlwZS5sZW5ndGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1dFRoZUxhc3QodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sYXN0SW5kZXhPZih0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRlbnNpb248VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RyaW5nOiBUKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoc3RyaW5nLmxhc3RJbmRleE9mKCcuJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbVR5cGUodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIHdoaWxlIChzdHJpbmcuc3RhcnRzV2l0aCh0eXBlKSlcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyh0eXBlLmxlbmd0aCk7XG5cbiAgICB3aGlsZSAoc3RyaW5nLmVuZHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0cmluZy5sZW5ndGggLSB0eXBlLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Vic3RyaW5nU3RhcnQ8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4oc3RhcnQ6IHN0cmluZywgc3RyaW5nOiBUKTogVCB7XG4gICAgaWYoc3RyaW5nLnN0YXJ0c1dpdGgoc3RhcnQpKVxuICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdGFydC5sZW5ndGgpO1xuICAgIHJldHVybiBzdHJpbmc7XG59IiwgImltcG9ydCB7RGlyZW50fSBmcm9tICdmcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge2N3ZH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgQ3V0VGhlTGFzdCAsIFNwbGl0Rmlyc3R9IGZyb20gJy4uL1N0cmluZ01ldGhvZHMvU3BsaXR0aW5nJztcblxuZnVuY3Rpb24gZ2V0RGlybmFtZSh1cmw6IHN0cmluZyl7XG4gICAgcmV0dXJuIHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKHVybCkpO1xufVxuXG5jb25zdCBTeXN0ZW1EYXRhID0gcGF0aC5qb2luKGdldERpcm5hbWUoaW1wb3J0Lm1ldGEudXJsKSwgJy9TeXN0ZW1EYXRhJyk7XG5cbmxldCBXZWJTaXRlRm9sZGVyXyA9IFwiV2ViU2l0ZVwiO1xuXG5jb25zdCBTdGF0aWNOYW1lID0gJ1dXVycsIExvZ3NOYW1lID0gJ0xvZ3MnLCBNb2R1bGVzTmFtZSA9ICdub2RlX21vZHVsZXMnO1xuXG5jb25zdCBTdGF0aWNDb21waWxlID0gU3lzdGVtRGF0YSArIGAvJHtTdGF0aWNOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVMb2dzID0gU3lzdGVtRGF0YSArIGAvJHtMb2dzTmFtZX1Db21waWxlL2A7XG5jb25zdCBDb21waWxlTW9kdWxlID0gU3lzdGVtRGF0YSArIGAvJHtNb2R1bGVzTmFtZX1Db21waWxlL2A7XG5cbmNvbnN0IHdvcmtpbmdEaXJlY3RvcnkgPSBjd2QoKSArICcvJztcblxuZnVuY3Rpb24gR2V0RnVsbFdlYlNpdGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSxXZWJTaXRlRm9sZGVyXywgJy8nKTtcbn1cbmxldCBmdWxsV2ViU2l0ZVBhdGhfID0gR2V0RnVsbFdlYlNpdGVQYXRoKCk7XG5cbmZ1bmN0aW9uIEdldFNvdXJjZShuYW1lKSB7XG4gICAgcmV0dXJuICBHZXRGdWxsV2ViU2l0ZVBhdGgoKSArIG5hbWUgKyAnLydcbn1cblxuLyogQSBvYmplY3QgdGhhdCBjb250YWlucyBhbGwgdGhlIHBhdGhzIG9mIHRoZSBmaWxlcyBpbiB0aGUgcHJvamVjdC4gKi9cbmNvbnN0IGdldFR5cGVzID0ge1xuICAgIFN0YXRpYzogW1xuICAgICAgICBHZXRTb3VyY2UoU3RhdGljTmFtZSksXG4gICAgICAgIFN0YXRpY0NvbXBpbGUsXG4gICAgICAgIFN0YXRpY05hbWVcbiAgICBdLFxuICAgIExvZ3M6IFtcbiAgICAgICAgR2V0U291cmNlKExvZ3NOYW1lKSxcbiAgICAgICAgQ29tcGlsZUxvZ3MsXG4gICAgICAgIExvZ3NOYW1lXG4gICAgXSxcbiAgICBub2RlX21vZHVsZXM6IFtcbiAgICAgICAgR2V0U291cmNlKCdub2RlX21vZHVsZXMnKSxcbiAgICAgICAgQ29tcGlsZU1vZHVsZSxcbiAgICAgICAgTW9kdWxlc05hbWVcbiAgICBdLFxuICAgIGdldCBbU3RhdGljTmFtZV0oKXtcbiAgICAgICAgcmV0dXJuIGdldFR5cGVzLlN0YXRpYztcbiAgICB9XG59XG5cbmNvbnN0IHBhZ2VUeXBlcyA9IHtcbiAgICBwYWdlOiBcInBhZ2VcIixcbiAgICBtb2RlbDogXCJtb2RlXCIsXG4gICAgY29tcG9uZW50OiBcImludGVcIlxufVxuXG5cbmNvbnN0IEJhc2ljU2V0dGluZ3MgPSB7XG4gICAgcGFnZVR5cGVzLFxuXG4gICAgcGFnZVR5cGVzQXJyYXk6IFtdLFxuXG4gICAgcGFnZUNvZGVGaWxlOiB7XG4gICAgICAgIHBhZ2U6IFtwYWdlVHlwZXMucGFnZStcIi5qc1wiLCBwYWdlVHlwZXMucGFnZStcIi50c1wiXSxcbiAgICAgICAgbW9kZWw6IFtwYWdlVHlwZXMubW9kZWwrXCIuanNcIiwgcGFnZVR5cGVzLm1vZGVsK1wiLnRzXCJdLFxuICAgICAgICBjb21wb25lbnQ6IFtwYWdlVHlwZXMuY29tcG9uZW50K1wiLmpzXCIsIHBhZ2VUeXBlcy5jb21wb25lbnQrXCIudHNcIl1cbiAgICB9LFxuXG4gICAgcGFnZUNvZGVGaWxlQXJyYXk6IFtdLFxuXG4gICAgcGFydEV4dGVuc2lvbnM6IFsnc2VydicsICdhcGknXSxcblxuICAgIFJlcUZpbGVUeXBlczoge1xuICAgICAgICBqczogXCJzZXJ2LmpzXCIsXG4gICAgICAgIHRzOiBcInNlcnYudHNcIixcbiAgICAgICAgJ2FwaS10cyc6IFwiYXBpLmpzXCIsXG4gICAgICAgICdhcGktanMnOiBcImFwaS50c1wiXG4gICAgfSxcbiAgICBSZXFGaWxlVHlwZXNBcnJheTogW10sXG5cbiAgICBnZXQgV2ViU2l0ZUZvbGRlcigpIHtcbiAgICAgICAgcmV0dXJuIFdlYlNpdGVGb2xkZXJfO1xuICAgIH0sXG4gICAgZ2V0IGZ1bGxXZWJTaXRlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bGxXZWJTaXRlUGF0aF87XG4gICAgfSxcbiAgICBzZXQgV2ViU2l0ZUZvbGRlcih2YWx1ZSkge1xuICAgICAgICBXZWJTaXRlRm9sZGVyXyA9IHZhbHVlO1xuXG4gICAgICAgIGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcbiAgICAgICAgZ2V0VHlwZXMuU3RhdGljWzBdID0gR2V0U291cmNlKFN0YXRpY05hbWUpO1xuICAgICAgICBnZXRUeXBlcy5Mb2dzWzBdID0gR2V0U291cmNlKExvZ3NOYW1lKTtcbiAgICB9LFxuICAgIGdldCB0c0NvbmZpZygpe1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXyArICd0c2NvbmZpZy5qc29uJzsgXG4gICAgfSxcbiAgICBhc3luYyB0c0NvbmZpZ0ZpbGUoKSB7XG4gICAgICAgIGlmKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKHRoaXMudHNDb25maWcpKXtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBFYXN5RnMucmVhZEZpbGUodGhpcy50c0NvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbGF0aXZlKGZ1bGxQYXRoOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShmdWxsV2ViU2l0ZVBhdGhfLCBmdWxsUGF0aClcbiAgICB9XG59XG5cbkJhc2ljU2V0dGluZ3MucGFnZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZVR5cGVzKTtcbkJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MucGFnZUNvZGVGaWxlKS5mbGF0KCk7XG5CYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlc0FycmF5ID0gT2JqZWN0LnZhbHVlcyhCYXNpY1NldHRpbmdzLlJlcUZpbGVUeXBlcyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBEZWxldGVJbkRpcmVjdG9yeShwYXRoKSB7XG4gICAgY29uc3QgYWxsSW5Gb2xkZXIgPSBhd2FpdCBFYXN5RnMucmVhZGRpcihwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgZm9yIChjb25zdCBpIG9mICg8RGlyZW50W10+YWxsSW5Gb2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpLm5hbWU7XG4gICAgICAgIGlmIChpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGggKyBuICsgJy8nO1xuICAgICAgICAgICAgYXdhaXQgRGVsZXRlSW5EaXJlY3RvcnkoZGlyKTtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy5ybWRpcihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnVubGluayhwYXRoICsgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbWFsbFBhdGhUb1BhZ2Uoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBDdXRUaGVMYXN0KCcuJywgU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkucG9wKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZUJ5U21hbGxQYXRoKHNtYWxsUGF0aDogc3RyaW5nKXtcbiAgICByZXR1cm4gZ2V0VHlwZXNbU3BsaXRGaXJzdCgnLycsIHNtYWxsUGF0aCkuc2hpZnQoKV07XG59XG5cblxuXG5leHBvcnQge1xuICAgIGdldERpcm5hbWUsXG4gICAgU3lzdGVtRGF0YSxcbiAgICB3b3JraW5nRGlyZWN0b3J5LFxuICAgIGdldFR5cGVzLFxuICAgIEJhc2ljU2V0dGluZ3Ncbn0iLCAiaW1wb3J0IHsgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVVJMQ29tbWVudChtYXA6IFNvdXJjZU1hcEdlbmVyYXRvciwgaXNDc3M/OiBib29sZWFuKSB7XG4gICAgbGV0IG1hcFN0cmluZyA9IGBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwke0J1ZmZlci5mcm9tKG1hcC50b1N0cmluZygpKS50b1N0cmluZyhcImJhc2U2NFwiKX1gO1xuXG4gICAgaWYgKGlzQ3NzKVxuICAgICAgICBtYXBTdHJpbmcgPSBgLyojICR7bWFwU3RyaW5nfSovYFxuICAgIGVsc2VcbiAgICAgICAgbWFwU3RyaW5nID0gJy8vIyAnICsgbWFwU3RyaW5nO1xuXG4gICAgcmV0dXJuICdcXHJcXG4nICsgbWFwU3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gTWVyZ2VTb3VyY2VNYXAoZ2VuZXJhdGVkTWFwOiBSYXdTb3VyY2VNYXAsIG9yaWdpbmFsTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihvcmlnaW5hbE1hcCk7XG4gICAgY29uc3QgbmV3TWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcigpO1xuICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZ2VuZXJhdGVkTWFwKSkuZWFjaE1hcHBpbmcobSA9PiB7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gb3JpZ2luYWwub3JpZ2luYWxQb3NpdGlvbkZvcih7bGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbn0pXG4gICAgICAgIGlmKCFsb2NhdGlvbi5zb3VyY2UpIHJldHVybjtcbiAgICAgICAgbmV3TWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgICAgICAgICBsaW5lOiBtLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgICAgICAgIGNvbHVtbjogbG9jYXRpb24uY29sdW1uLFxuICAgICAgICAgICAgICAgIGxpbmU6IGxvY2F0aW9uLmxpbmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3VyY2U6IGxvY2F0aW9uLnNvdXJjZVxuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ld01hcDtcbn0iLCAiaW1wb3J0IFN0cmluZ1RyYWNrZXIgZnJvbSAnLi9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEdlbmVyYXRvciwgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gXCJzb3VyY2UtbWFwXCI7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIGdldFR5cGVzIH0gZnJvbSAnLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBTcGxpdEZpcnN0IH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuaW1wb3J0IHsgdG9VUkxDb21tZW50IH0gZnJvbSAnLi9Tb3VyY2VNYXAnO1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcm90ZWN0ZWQgbWFwOiBTb3VyY2VNYXBHZW5lcmF0b3I7XG4gICAgcHJvdGVjdGVkIGZpbGVEaXJOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIGxpbmVDb3VudCA9IDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZmlsZVBhdGg6IHN0cmluZywgcHJvdGVjdGVkIGh0dHBTb3VyY2UgPSB0cnVlLCBwcm90ZWN0ZWQgcmVsYXRpdmUgPSBmYWxzZSwgcHJvdGVjdGVkIGlzQ3NzID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLnNwbGl0KC9cXC98XFxcXC8pLnBvcCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaHR0cFNvdXJjZSlcbiAgICAgICAgICAgIHRoaXMuZmlsZURpck5hbWUgPSBwYXRoLmRpcm5hbWUodGhpcy5maWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFNvdXJjZShzb3VyY2U6IHN0cmluZykge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2Uuc3BsaXQoJzxsaW5lPicpLnBvcCgpLnRyaW0oKTtcblxuICAgICAgICBpZiAodGhpcy5odHRwU291cmNlKSB7XG4gICAgICAgICAgICBpZiAoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheS5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoc291cmNlKS5zdWJzdHJpbmcoMSkpKVxuICAgICAgICAgICAgICAgIHNvdXJjZSArPSAnLnNvdXJjZSc7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gU3BsaXRGaXJzdCgnLycsIHNvdXJjZSkucG9wKCkgKyAnP3NvdXJjZT10cnVlJztcbiAgICAgICAgICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZSgodGhpcy5yZWxhdGl2ZSA/ICcnOiAnLycpICsgc291cmNlLnJlcGxhY2UoL1xcXFwvZ2ksICcvJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodGhpcy5maWxlRGlyTmFtZSwgQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGggKyBzb3VyY2UpO1xuICAgIH1cblxuICAgIGdldFJvd1NvdXJjZU1hcCgpOiBSYXdTb3VyY2VNYXB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC50b0pTT04oKVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRvVVJMQ29tbWVudCh0aGlzLm1hcCwgdGhpcy5pc0Nzcyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VNYXBTdG9yZSBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBwcml2YXRlIHN0b3JlU3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Mb2FkOiB7IG5hbWU6IHN0cmluZywgZGF0YTogYW55W10gfVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgZGVidWcgPSB0cnVlLCBpc0NzcyA9IGZhbHNlLCBodHRwU291cmNlID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihmaWxlUGF0aCwgaHR0cFNvdXJjZSwgZmFsc2UsIGlzQ3NzKTtcbiAgICB9XG5cbiAgICBub3RFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uTG9hZC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGFkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTdHJpbmdUcmFja2VyJywgZGF0YTogW3RyYWNrLCB7dGV4dH1dIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFN0cmluZ1RyYWNrZXIodHJhY2s6IFN0cmluZ1RyYWNrZXIsIHsgdGV4dDogdGV4dCA9IHRyYWNrLmVxIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICBjb25zdCBEYXRhQXJyYXkgPSB0cmFjay5nZXREYXRhQXJyYXkoKSwgbGVuZ3RoID0gRGF0YUFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGV0IHdhaXROZXh0TGluZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuXG4gICAgYWRkVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkVGV4dCcsIGRhdGE6IFt0ZXh0XSB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHRoaXMubGluZUNvdW50ICs9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICAgIHRoaXMuc3RvcmVTdHJpbmcgKz0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZml4VVJMU291cmNlTWFwKG1hcDogUmF3U291cmNlTWFwKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1hcC5zb3VyY2VzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIG1hcC5zb3VyY2VzW2ldID0gQmFzaWNTZXR0aW5ncy5yZWxhdGl2ZShmaWxlVVJMVG9QYXRoKG1hcC5zb3VyY2VzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG5cbiAgICBhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcihmcm9tTWFwOiBSYXdTb3VyY2VNYXAsIHRyYWNrOiBTdHJpbmdUcmFja2VyLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb2FkLnB1c2goeyBuYW1lOiAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbZnJvbU1hcCwgdHJhY2ssIHRleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2FkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkVGV4dCh0ZXh0KTtcblxuICAgICAgICAoYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKGZyb21NYXApKS5lYWNoTWFwcGluZygobSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUluZm8gPSB0cmFjay5nZXRMaW5lKG0ub3JpZ2luYWxMaW5lKS5nZXREYXRhQXJyYXkoKVswXTtcblxuICAgICAgICAgICAgaWYgKG0uc291cmNlID09IHRoaXMuZmlsZVBhdGgpXG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UobS5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiBkYXRhSW5mby5saW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSArIHRoaXMubGluZUNvdW50LCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IG0ub3JpZ2luYWxMaW5lLCBjb2x1bW46IG0ub3JpZ2luYWxDb2x1bW4gfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IG0uZ2VuZXJhdGVkTGluZSwgY29sdW1uOiBtLmdlbmVyYXRlZENvbHVtbiB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2FkZFRleHQodGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBidWlsZEFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGRhdGEgfSBvZiB0aGlzLmFjdGlvbkxvYWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRUZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRleHQoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXInOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBBc1VSTENvbW1lbnQoKSB7XG4gICAgICAgIHRoaXMuYnVpbGRBbGwoKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIubWFwQXNVUkxDb21tZW50KClcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVEYXRhV2l0aE1hcCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5idWlsZEFsbCgpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZztcblxuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVN0cmluZyArIHN1cGVyLm1hcEFzVVJMQ29tbWVudCgpO1xuICAgIH1cblxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IFNvdXJjZU1hcFN0b3JlKHRoaXMuZmlsZVBhdGgsIHRoaXMuZGVidWcsIHRoaXMuaXNDc3MsIHRoaXMuaHR0cFNvdXJjZSk7XG4gICAgICAgIGNvcHkuYWN0aW9uTG9hZC5wdXNoKC4uLnRoaXMuYWN0aW9uTG9hZClcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuLi9FYXN5RGVidWcvU3RyaW5nVHJhY2tlcic7XG5pbXBvcnQgeyBTb3VyY2VNYXBCYXNpYyB9IGZyb20gJy4uL0Vhc3lEZWJ1Zy9Tb3VyY2VNYXBTdG9yZSc7XG5cbmNsYXNzIGNyZWF0ZVBhZ2VTb3VyY2VNYXAgZXh0ZW5kcyBTb3VyY2VNYXBCYXNpYyB7XG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZSA9IGZhbHNlLCByZWxhdGl2ZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCByZWxhdGl2ZSk7XG4gICAgICAgIHRoaXMubGluZUNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBhZGRNYXBwaW5nRnJvbVRyYWNrKHRyYWNrOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IHRleHQsIGxpbmUsIGluZm8gfSA9IERhdGFBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0ID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3YWl0TmV4dExpbmUgJiYgbGluZSAmJiBpbmZvKSB7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiB0aGlzLmxpbmVDb3VudCwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5nZXRTb3VyY2UoaW5mbylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0TWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHN0b3JlTWFwLmdldFJvd1NvdXJjZU1hcCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0cHV0V2l0aE1hcCh0ZXh0OiBTdHJpbmdUcmFja2VyLCBmaWxlUGF0aDogc3RyaW5nKXtcbiAgICBjb25zdCBzdG9yZU1hcCA9IG5ldyBjcmVhdGVQYWdlU291cmNlTWFwKGZpbGVQYXRoKTtcbiAgICBzdG9yZU1hcC5hZGRNYXBwaW5nRnJvbVRyYWNrKHRleHQpO1xuXG4gICAgcmV0dXJuIHRleHQuZXEgKyBzdG9yZU1hcC5tYXBBc1VSTENvbW1lbnQoKTtcbn0iLCAiaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgb3V0cHV0TWFwLCBvdXRwdXRXaXRoTWFwIH0gZnJvbSBcIi4vU3RyaW5nVHJhY2tlclRvU291cmNlTWFwXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nVHJhY2tlckRhdGFJbmZvIHtcbiAgICB0ZXh0Pzogc3RyaW5nLFxuICAgIGluZm86IHN0cmluZyxcbiAgICBsaW5lPzogbnVtYmVyLFxuICAgIGNoYXI/OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFN0cmluZ0luZGV4ZXJJbmZvIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGxlbmd0aDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlNYXRjaCBleHRlbmRzIEFycmF5PFN0cmluZ1RyYWNrZXI+IHtcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBpbnB1dD86IFN0cmluZ1RyYWNrZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyaW5nVHJhY2tlciB7XG4gICAgcHJpdmF0ZSBEYXRhQXJyYXk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mb1tdID0gW107XG4gICAgcHVibGljIEluZm9UZXh0OiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBPbkxpbmUgPSAxO1xuICAgIHB1YmxpYyBPbkNoYXIgPSAxO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBJbmZvVGV4dCB0ZXh0IGluZm8gZm9yIGFsbCBuZXcgc3RyaW5nIHRoYXQgYXJlIGNyZWF0ZWQgaW4gdGhpcyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoSW5mbz86IHN0cmluZyB8IFN0cmluZ1RyYWNrZXJEYXRhSW5mbywgdGV4dD86IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIEluZm8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvO1xuICAgICAgICB9IGVsc2UgaWYgKEluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdChJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkFkZEZpbGVUZXh0KHRleHQsIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgZ2V0IGVtcHR5SW5mbygpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldERlZmF1bHQoSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0KSB7XG4gICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvLmluZm87XG4gICAgICAgIHRoaXMuT25MaW5lID0gSW5mby5saW5lO1xuICAgICAgICB0aGlzLk9uQ2hhciA9IEluZm8uY2hhcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGF0YUFycmF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGxhc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IERlZmF1bHRJbmZvVGV4dCgpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICBpZiAoIXRoaXMuRGF0YUFycmF5LmZpbmQoeCA9PiB4LmluZm8pICYmIHRoaXMuSW5mb1RleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiB0aGlzLkluZm9UZXh0LFxuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuT25MaW5lLFxuICAgICAgICAgICAgICAgIGNoYXI6IHRoaXMuT25DaGFyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbdGhpcy5EYXRhQXJyYXkubGVuZ3RoIC0gMV0gPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGZpcnN0IEluZm9UZXh0XG4gICAgICovXG4gICAgZ2V0IFN0YXJ0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5WzBdID8/IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgYXMgb25lIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0IE9uZVN0cmluZygpIHtcbiAgICAgICAgbGV0IGJpZ1N0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGJpZ1N0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmlnU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgc28geW91IGNhbiBjaGVjayBpZiBpdCBlcXVhbCBvciBub3RcbiAgICAgKiB1c2UgbGlrZSB0aGF0OiBteVN0cmluZy5lcSA9PSBcImNvb2xcIlxuICAgICAqL1xuICAgIGdldCBlcSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgaW5mbyBhYm91dCB0aGlzIHRleHRcbiAgICAgKi9cbiAgICBnZXQgbGluZUluZm8oKSB7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgY29uc3QgcyA9IGQuaW5mby5zcGxpdCgnPGxpbmU+Jyk7XG4gICAgICAgIHMucHVzaChCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHMucG9wKCkpO1xuXG4gICAgICAgIHJldHVybiBgJHtzLmpvaW4oJzxsaW5lPicpfToke2QubGluZX06JHtkLmNoYXJ9YDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGxlbmd0aCBvZiB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIGNvcHkgb2YgdGhpcyBzdHJpbmcgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIENsb25lKCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld0RhdGEuQWRkVGV4dEFmdGVyKGkudGV4dCwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBZGRDbG9uZShkYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goLi4uZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLkRhdGFBcnJheS51bnNoaWZ0KC4uLmNvcHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgVGV4dCBGaWxlIFRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRGaWxlVGV4dCh0ZXh0OiBzdHJpbmcsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKSB7XG4gICAgICAgIGxldCBMaW5lQ291bnQgPSAxLCBDaGFyQ291bnQgPSAxO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzaW1wbGUgbWV0aG9mIHRvIGN1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBuZXcgY3V0dGVkIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQ3V0U3RyaW5nKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuXG4gICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucHVzaCguLi50aGlzLkRhdGFBcnJheS5zbGljZShzdGFydCwgZW5kKSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0SW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5sYXN0SW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bmljb2RlTWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYSA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgYSArPSBcIlxcXFx1XCIgKyAoXCIwMDBcIiArIHYuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVuaWNvZGUoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKHRoaXMudW5pY29kZU1lKGkudGV4dCksIGkuaW5mbywgaS5saW5lLCBpLmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VhcmNoKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5zZWFyY2gocmVnZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuZW5kc1dpdGgoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGluY2x1ZGVzKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuaW5jbHVkZXMoc2VhcmNoLCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1TdGFydCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltRW5kKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCkudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTcGFjZU9uZShhZGRJbnNpZGU/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmF0KDApO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmF0KHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLkNsb25lKCkudHJpbSgpO1xuXG4gICAgICAgIGlmIChzdGFydC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QmVmb3JlKGFkZEluc2lkZSB8fCBzdGFydC5lcSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmluZm8sIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5saW5lLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kLmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRBZnRlcihhZGRJbnNpZGUgfHwgZW5kLmVxLCBlbmQuRGVmYXVsdEluZm9UZXh0LmluZm8sIGVuZC5EZWZhdWx0SW5mb1RleHQubGluZSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cblxuICAgIHByaXZhdGUgQWN0aW9uU3RyaW5nKEFjdDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbmV3U3RyaW5nLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgaS50ZXh0ID0gQWN0KGkudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZUxvd2VyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlVXBwZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3JtYWxpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMubm9ybWFsaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgU3RyaW5nSW5kZXhlcihyZWdleDogUmVnRXhwIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ0luZGV4ZXJJbmZvW10ge1xuICAgICAgICBpZiAocmVnZXggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgcmVnZXguZmxhZ3MucmVwbGFjZSgnZycsICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTcGxpdDogU3RyaW5nSW5kZXhlckluZm9bXSA9IFtdO1xuXG4gICAgICAgIGxldCBtYWluVGV4dCA9IHRoaXMuT25lU3RyaW5nLCBoYXNNYXRoOiBSZWdFeHBNYXRjaEFycmF5ID0gbWFpblRleHQubWF0Y2gocmVnZXgpLCBhZGROZXh0ID0gMCwgY291bnRlciA9IDA7XG5cbiAgICAgICAgd2hpbGUgKChsaW1pdCA9PSBudWxsIHx8IGNvdW50ZXIgPCBsaW1pdCkgJiYgaGFzTWF0aD8uWzBdPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IFsuLi5oYXNNYXRoWzBdXS5sZW5ndGgsIGluZGV4ID0gdGhpcy5jaGFyTGVuZ3RoKGhhc01hdGguaW5kZXgpO1xuICAgICAgICAgICAgYWxsU3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4ICsgYWRkTmV4dCxcbiAgICAgICAgICAgICAgICBsZW5ndGhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYWluVGV4dCA9IG1haW5UZXh0LnNsaWNlKGhhc01hdGguaW5kZXggKyBoYXNNYXRoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGFkZE5leHQgKz0gaW5kZXggKyBsZW5ndGg7XG5cbiAgICAgICAgICAgIGhhc01hdGggPSBtYWluVGV4dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3BsaXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBSZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUcmFja2VyKCduJywgc2VhcmNoVmFsdWUpLnVuaWNvZGUuZXE7XG4gICAgfVxuXG4gICAgcHVibGljIHNwbGl0KHNlcGFyYXRvcjogc3RyaW5nIHwgUmVnRXhwLCBsaW1pdD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIodGhpcy5SZWdleEluU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0KTtcbiAgICAgICAgY29uc3QgbmV3U3BsaXQ6IFN0cmluZ1RyYWNrZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSk7XG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3BsaXQucHVzaCh0aGlzLkN1dFN0cmluZyhuZXh0Y3V0KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1NwbGl0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBlYXQoY291bnQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGpvaW4oYXJyOiBTdHJpbmdUcmFja2VyW10pe1xuICAgICAgICBsZXQgYWxsID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgZm9yKGNvbnN0IGkgb2YgYXJyKXtcbiAgICAgICAgICAgIGFsbC5BZGRDbG9uZShpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXBsYWNlckFzeW5jKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBQcm9taXNlPFN0cmluZ1RyYWNrZXI+KSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhhd2FpdCBmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzdWx0QXJyYXk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3RJbmZvKHR5cGUgPSAnPGxpbmU+Jyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLnNwbGl0KHR5cGUpLnBvcCgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZXJyb3IgaW5mbyBmb3JtIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVidWdMaW5lKHsgbWVzc2FnZSwgdGV4dCwgbG9jYXRpb24sIGxpbmUsIGNvbH06IHsgbWVzc2FnZT86IHN0cmluZywgdGV4dD86IHN0cmluZywgbG9jYXRpb24/OiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGxpbmVUZXh0Pzogc3RyaW5nIH0sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcn0pOiBzdHJpbmcge1xuICAgICAgICBsZXQgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZShsaW5lID8/IGxvY2F0aW9uPy5saW5lID8/IDEpLCBjb2x1bW4gPSBjb2wgPz8gbG9jYXRpb24/LmNvbHVtbiA/PyAwO1xuICAgICAgICBpZiAoc2VhcmNoTGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgICAgICBzZWFyY2hMaW5lID0gdGhpcy5nZXRMaW5lKChsaW5lID8/IGxvY2F0aW9uPy5saW5lKSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gc2VhcmNoTGluZS5hdChjb2x1bW4tMSkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICByZXR1cm4gYCR7dGV4dCB8fCBtZXNzYWdlfSwgb24gZmlsZSAtPlxcbiR7QmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgrc2VhcmNoTGluZS5leHRyYWN0SW5mbygpfToke2RhdGEubGluZX06JHtkYXRhLmNoYXJ9JHtsb2NhdGlvbj8ubGluZVRleHQgPyAnXFxuTGluZTogXCInICsgbG9jYXRpb24ubGluZVRleHQudHJpbSgpICsgJ1wiJzogJyd9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nV2l0aFRhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dFdpdGhNYXAodGhpcywgZnVsbFNhdmVMb2NhdGlvbilcbiAgICB9XG5cbiAgICBwdWJsaWMgU3RyaW5nVGFjayhmdWxsU2F2ZUxvY2F0aW9uOiBzdHJpbmcsIGh0dHBTb3VyY2U/OiBib29sZWFuLCByZWxhdGl2ZT86IGJvb2xlYW4pe1xuICAgICAgICByZXR1cm4gb3V0cHV0TWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24sIGh0dHBTb3VyY2UsIHJlbGF0aXZlKVxuICAgIH1cbn0iLCAiaW1wb3J0IHR5cGUgeyB0YWdEYXRhT2JqZWN0QXJyYXl9IGZyb20gJy4uLy4uLy4uL0NvbXBpbGVDb2RlL1hNTEhlbHBlcnMvQ29tcGlsZVR5cGVzJztcblxuXG5jb25zdCBudW1iZXJzID0gWydudW1iZXInLCAnbnVtJywgJ2ludGVnZXInLCAnaW50J10sIGJvb2xlYW5zID0gWydib29sZWFuJywgJ2Jvb2wnXTtcbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uID0gWydlbWFpbCcsICdzdHJpbmcnLCAndGV4dCcsIC4uLm51bWJlcnMsIC4uLmJvb2xlYW5zXTtcblxuY29uc3QgZW1haWxWYWxpZGF0b3IgPSAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvO1xuXG5cblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25SZWdleCA9IHtcbiAgICBcInN0cmluZy1sZW5ndGgtcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy1bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy0nKS5tYXAoeCA9PiBOdW1iZXIoeCkpLFxuICAgICAgICAoW21pbiwgbWF4XSwgdGV4dDogc3RyaW5nKSA9PiB0ZXh0Lmxlbmd0aCA+PSBtaW4gJiYgdGV4dC5sZW5ndGggPD0gbWF4LFxuICAgICAgICBcInN0cmluZ1wiXG4gICAgXSxcbiAgICBcIm51bWJlci1yYW5nZVwiOiBbXG4gICAgICAgIC9eWzAtOV0rLi5bMC05XSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJy4uJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIG51bTogbnVtYmVyKSA9PiBudW0gPj0gbWluICYmIG51bSA8PSBtYXgsXG4gICAgICAgIFwibnVtYmVyXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLXN0cmluZ1wiOiBbXG4gICAgICAgIC9ec3RyaW5nfHRleHQrWyBdKj0+WyBdKihcXHw/W158XSspKyQvLFxuICAgICAgICAodmFsaWRhdG9yOiBzdHJpbmcpID0+IHZhbGlkYXRvci5zcGxpdCgnPT4nKS5wb3AoKS5zcGxpdCgnfCcpLm1hcCh4ID0+IGBcIiR7eC50cmltKCkucmVwbGFjZSgvXCIvZ2ksICdcXFxcXCInKX1cImApLFxuICAgICAgICAob3B0aW9uczogc3RyaW5nW10sIHRleHQ6IHN0cmluZykgPT4gb3B0aW9ucy5pbmNsdWRlcyh0ZXh0KSxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJtdWx0aXBsZS1jaG9pY2UtbnVtYmVyXCI6IFtcbiAgICAgICAgL15udW1iZXJ8bnVtfGludGVnZXJ8aW50K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKSxcbiAgICAgICAgKG9wdGlvbnM6IG51bWJlcltdLCBudW06IG51bWJlcikgPT4gb3B0aW9ucy5pbmNsdWRlcyhudW0pLFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXVxufTtcblxuY29uc3QgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzID0gWy4uLm51bWJlcnNdO1xuXG5mb3IoY29uc3QgaSBpbiBidWlsdEluQ29ubmVjdGlvblJlZ2V4KXtcbiAgICBjb25zdCB0eXBlID0gYnVpbHRJbkNvbm5lY3Rpb25SZWdleFtpXVszXTtcblxuICAgIGlmKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyh0eXBlKSlcbiAgICAgICAgYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLnB1c2goaSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVWYWx1ZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIGlmIChidWlsdEluQ29ubmVjdGlvbi5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBgW1wiJHt2YWx1ZX1cIl1gO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgW3Rlc3QsIGdldEFyZ3NdXSBvZiBPYmplY3QuZW50cmllcyhidWlsdEluQ29ubmVjdGlvblJlZ2V4KSlcbiAgICAgICAgaWYgKCg8UmVnRXhwPnRlc3QpLnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIGBbXCIke25hbWV9XCIsICR7KDxhbnk+Z2V0QXJncykodmFsdWUpfV1gO1xuXG4gICAgcmV0dXJuIGBbJHt2YWx1ZX1dYDtcbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVZhbGlkYXRpb25KU09OKGFyZ3M6IGFueVtdLCB2YWxpZGF0b3JBcnJheTogYW55W10pOiBQcm9taXNlPGJvb2xlYW4gfCBzdHJpbmdbXT4ge1xuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50LCAuLi5lbGVtZW50QXJnc10gPSB2YWxpZGF0b3JBcnJheVtpXSwgdmFsdWUgPSBhcmdzW2ldO1xuICAgICAgICBsZXQgcmV0dXJuTm93ID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdudW0nOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICBjYXNlICdpbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIHJldHVybk5vdyA9ICFlbWFpbFZhbGlkYXRvci50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXZlUmVnZXggPSB2YWx1ZSAhPSBudWxsICYmIGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbZWxlbWVudF07XG5cbiAgICAgICAgICAgICAgICBpZihoYXZlUmVnZXgpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhaGF2ZVJlZ2V4WzJdKGVsZW1lbnRBcmdzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gZWxlbWVudC50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhYXdhaXQgZWxlbWVudCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0dXJuTm93KSB7XG4gICAgICAgICAgICBsZXQgaW5mbyA9IGBmYWlsZWQgYXQgJHtpfSBmaWxlZCAtICR7aXNEZWZhdWx0ID8gcmV0dXJuTm93IDogJ2V4cGVjdGVkICcgKyBlbGVtZW50fWA7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRBcmdzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBpbmZvICs9IGAsIGFyZ3VtZW50czogJHtKU09OLnN0cmluZ2lmeShlbGVtZW50QXJncyl9YDtcblxuICAgICAgICAgICAgaW5mbyArPSBgLCBpbnB1dDogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIFtpbmZvLCBlbGVtZW50LCBlbGVtZW50QXJncywgdmFsdWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVZhbHVlcyhhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IHBhcnNlZCA9IFtdO1xuXG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsaWRhdG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgW2VsZW1lbnRdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcblxuICAgICAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb25OdW1iZXJzLmluY2x1ZGVzKGVsZW1lbnQpKVxuICAgICAgICAgICAgcGFyc2VkLnB1c2gocGFyc2VGbG9hdCh2YWx1ZSkpO1xuXG4gICAgICAgIGVsc2UgaWYgKGJvb2xlYW5zLmluY2x1ZGVzKGVsZW1lbnQpKVxuICAgICAgICAgICAgcGFyc2VkLnB1c2godmFsdWUgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZSk7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFyc2VkLnB1c2godmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGE6IHRhZ0RhdGFPYmplY3RBcnJheSwgZmluZDogc3RyaW5nLCBkZWZhdWx0RGF0YTogYW55ID0gbnVsbCk6IHN0cmluZyB8IG51bGwgfCBib29sZWFue1xuICAgIGNvbnN0IGhhdmUgPSBkYXRhLmhhdmUoZmluZCksIHZhbHVlID0gZGF0YS5yZW1vdmUoZmluZCk7XG5cbiAgICBpZihoYXZlICYmIHZhbHVlICE9ICdmYWxzZScpIHJldHVybiB2YWx1ZSB8fCBoYXZlICAgIFxuICAgIGlmKHZhbHVlID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZighaGF2ZSkgcmV0dXJuIGRlZmF1bHREYXRhO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xufSIsICJleHBvcnQgaW50ZXJmYWNlIFByZXZlbnRMb2cge1xuICAgIGlkPzogc3RyaW5nLFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBlcnJvck5hbWU6IHN0cmluZyxcbiAgICB0eXBlPzogXCJ3YXJuXCIgfCBcImVycm9yXCJcbn1cblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzOiB7UHJldmVudEVycm9yczogc3RyaW5nW119ID0ge1xuICAgIFByZXZlbnRFcnJvcnM6IFtdXG59XG5cbmNvbnN0IFByZXZlbnREb3VibGVMb2c6IHN0cmluZ1tdID0gW107XG5cbmV4cG9ydCBjb25zdCBDbGVhcldhcm5pbmcgPSAoKSA9PiBQcmV2ZW50RG91YmxlTG9nLmxlbmd0aCA9IDA7XG5cbi8qKlxuICogSWYgdGhlIGVycm9yIGlzIG5vdCBpbiB0aGUgUHJldmVudEVycm9ycyBhcnJheSwgcHJpbnQgdGhlIGVycm9yXG4gKiBAcGFyYW0ge1ByZXZlbnRMb2d9ICAtIGBpZGAgLSBUaGUgaWQgb2YgdGhlIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmV3UHJpbnQoe2lkLCB0ZXh0LCB0eXBlID0gXCJ3YXJuXCIsIGVycm9yTmFtZX06IFByZXZlbnRMb2cpIHtcbiAgICBpZighUHJldmVudERvdWJsZUxvZy5pbmNsdWRlcyhpZCA/PyB0ZXh0KSAmJiAhU2V0dGluZ3MuUHJldmVudEVycm9ycy5pbmNsdWRlcyhlcnJvck5hbWUpKXtcbiAgICAgICAgUHJldmVudERvdWJsZUxvZy5wdXNoKGlkID8/IHRleHQpO1xuICAgICAgICByZXR1cm4gW3R5cGUsICh0ZXh0LnJlcGxhY2UoLzxsaW5lPi9naSwgJyAtPiAnKSArIGBcXG5cXG5FcnJvci1Db2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKV07XG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1pbkNzcyhjb2RlOiBzdHJpbmcpe1xuICAgIHdoaWxlKGNvZGUuaW5jbHVkZXMoJyAgJykpe1xuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKC8gezJ9L2dpLCAnICcpO1xuICAgIH1cblxuICAgIC8vcmVtb3Zpbmcgc3BhY2VzXG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFxyXFxufFxcbi9naSwgJycpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLywgL2dpLCAnLCcpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLzogL2dpLCAnOicpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLyBcXHsvZ2ksICd7Jyk7XG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFx7IC9naSwgJ3snKTtcbiAgICBjb2RlID0gY29kZS5yZXBsYWNlKC87IC9naSwgJzsnKTtcblxuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1xcL1xcKi4qP1xcKlxcLy9nbXMsICcnKTsgLy8gcmVtb3ZlIGNvbW1lbnRzXG5cbiAgICByZXR1cm4gY29kZS50cmltKCk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgaGxqcyBmcm9tICdoaWdobGlnaHQuanMnO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCB3b3JraW5nRGlyZWN0b3J5IH0gZnJvbSAnLi4vLi4vUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0nO1xuaW1wb3J0IGFuY2hvciBmcm9tICdtYXJrZG93bi1pdC1hbmNob3InO1xuaW1wb3J0IHNsdWdpZnkgZnJvbSAnQHNpbmRyZXNvcmh1cy9zbHVnaWZ5JztcbmltcG9ydCBtYXJrZG93bkl0QXR0cnMgZnJvbSAnbWFya2Rvd24taXQtYXR0cnMnO1xuaW1wb3J0IG1hcmtkb3duSXRBYmJyIGZyb20gJ21hcmtkb3duLWl0LWFiYnInXG5pbXBvcnQgTWluQ3NzIGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplcic7XG5pbXBvcnQgeyBTZXNzaW9uQnVpbGQgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9TZXNzaW9uJztcbmltcG9ydCBJbnNlcnRDb21wb25lbnQgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvSW5zZXJ0Q29tcG9uZW50JztcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvQ29uc29sZSc7XG5cbmZ1bmN0aW9uIGNvZGVXaXRoQ29weShtZDogYW55KSB7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJDb2RlKG9yaWdSdWxlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ1JlbmRlcmVkID0gb3JpZ1J1bGUoLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb2RlLWNvcHlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2NvcHktY2xpcGJvYXJkXCIgb25jbGljaz1cIm5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRoaXMucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0KVwiPmNvcHk8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgJHtvcmlnUmVuZGVyZWR9XG4gICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrID0gcmVuZGVyQ29kZShtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrKTtcbiAgICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuZmVuY2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBCdWlsZENvZGUodHlwZTogU3RyaW5nVHJhY2tlciwgZGF0YVRhZzogdGFnRGF0YU9iamVjdEFycmF5LCBCZXR3ZWVuVGFnRGF0YTogU3RyaW5nVHJhY2tlciwgSW5zZXJ0Q29tcG9uZW50OiBJbnNlcnRDb21wb25lbnQsIHNlc3Npb246IFNlc3Npb25CdWlsZCk6IFByb21pc2U8QnVpbGRJbkNvbXBvbmVudD4ge1xuICAgIGNvbnN0IG1hcmtEb3duUGx1Z2luID0gSW5zZXJ0Q29tcG9uZW50LkdldFBsdWdpbignbWFya2Rvd24nKTtcblxuICAgIGNvbnN0IGhsanNDbGFzcyA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSkpLFxuICAgICAgICBicmVha3M6IEJvb2xlYW4ocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYnJlYWtzJywgbWFya0Rvd25QbHVnaW4/LmJyZWFrcyA/PyB0cnVlKSksXG4gICAgICAgIHR5cG9ncmFwaGVyOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3R5cG9ncmFwaGVyJywgbWFya0Rvd25QbHVnaW4/LnR5cG9ncmFwaGVyID8/IHRydWUpKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWFya2Rvd24tcGFyc2VyJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnY29weS1jb2RlJywgbWFya0Rvd25QbHVnaW4/LmNvcHlDb2RlID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoY29kZVdpdGhDb3B5KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdhdHRycycsIG1hcmtEb3duUGx1Z2luPy5hdHRycyA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBdHRycyk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYWJicicsIG1hcmtEb3duUGx1Z2luPy5hYmJyID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEFiYnIpO1xuXG4gICAgbGV0IG1hcmtkb3duQ29kZSA9IEJldHdlZW5UYWdEYXRhPy5lcTtcbiAgICBpZiAoIW1hcmtkb3duQ29kZSkge1xuICAgICAgICBsZXQgZmlsZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHR5cGUuZXh0cmFjdEluZm8oJzxsaW5lPicpKSwgZGF0YVRhZy5yZW1vdmUoJ2ZpbGUnKSk7XG4gICAgICAgIGlmICghcGF0aC5leHRuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgIGZpbGVQYXRoICs9ICcuc2Vydi5tZCdcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oQmFzaWNTZXR0aW5ncy5mdWxsV2ViU2l0ZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgbWFya2Rvd25Db2RlID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGZ1bGxQYXRoKTsgLy9nZXQgbWFya2Rvd24gZnJvbSBmaWxlXG4gICAgICAgIGF3YWl0IHNlc3Npb24uZGVwZW5kZW5jZShmaWxlUGF0aCwgZnVsbFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySFRNTCA9IG1kLnJlbmRlcihtYXJrZG93bkNvZGUpLCBidWlsZEhUTUwgPSBuZXcgU3RyaW5nVHJhY2tlcih0eXBlLkRlZmF1bHRJbmZvVGV4dCk7XG5cbiAgICBjb25zdCB0aGVtZSA9IGF3YWl0IGNyZWF0ZUF1dG9UaGVtZShkYXRhVGFnLnJlbW92ZSgnY29kZS10aGVtZScpIHx8IG1hcmtEb3duUGx1Z2luPy5jb2RlVGhlbWUgfHwgJ2F0b20tb25lJyk7XG5cbiAgICBpZiAoaGF2ZUhpZ2hsaWdodCkge1xuICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICBzZXNzaW9uLnN0eWxlKGNzc0xpbmspO1xuICAgIH1cblxuICAgIGRhdGFUYWcuYWRkQ2xhc3MoJ21hcmtkb3duLWJvZHknKTtcblxuICAgIGNvbnN0IHN0eWxlID0gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAndGhlbWUnLCBtYXJrRG93blBsdWdpbj8udGhlbWUgPz8gJ2F1dG8nKTtcbiAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL3RoZW1lLycgKyBzdHlsZSArICcuY3NzJztcbiAgICBzdHlsZSAhPSAnbm9uZScgJiYgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKVxuXG4gICAgaWYgKGRhdGFUYWcubGVuZ3RoKVxuICAgICAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7SW5zZXJ0Q29tcG9uZW50LlJlQnVpbGRUYWdEYXRhKEJldHdlZW5UYWdEYXRhLkRlZmF1bHRJbmZvVGV4dCwgZGF0YVRhZyl9PiR7cmVuZGVySFRNTH08L2Rpdj5gO1xuICAgIGVsc2VcbiAgICAgICAgYnVpbGRIVE1MLkFkZFRleHRBZnRlcihyZW5kZXJIVE1MKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGVkU3RyaW5nOiBidWlsZEhUTUwsXG4gICAgICAgIGNoZWNrQ29tcG9uZW50czogZmFsc2VcbiAgICB9XG59XG5cbmNvbnN0IHRoZW1lQXJyYXkgPSBbJycsICctZGFyaycsICctbGlnaHQnXTtcbmNvbnN0IHRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pZnlNYXJrZG93blRoZW1lKCkge1xuICAgIGZvciAoY29uc3QgaSBvZiB0aGVtZUFycmF5KSB7XG4gICAgICAgIGNvbnN0IG1pbmkgPSAoYXdhaXQgRWFzeUZzLnJlYWRGaWxlKHRoZW1lUGF0aCArIGkgKyAnLmNzcycpKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXG5cXC5tYXJrZG93bi1ib2R5IHspfCheLm1hcmtkb3duLWJvZHkgeykvZ20sIChtYXRjaDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoICsgJ3BhZGRpbmc6MjBweDsnXG4gICAgICAgICAgICB9KSArIGBcbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206LTMwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OjEwcHg7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTowO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLmNvZGUtY29weTpob3Zlcj5kaXYge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IGE6Zm9jdXMge1xuICAgICAgICAgICAgICAgIGNvbG9yOiM2YmI4NmFcbiAgICAgICAgICAgIH1gO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCB7IGF1dG9Db2RlVGhlbWUsIG1pbmlmeU1hcmtkb3duVGhlbWUgfSBmcm9tIFwiLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93blwiO1xuYXdhaXQgbWluaWZ5TWFya2Rvd25UaGVtZSgpO1xuYXdhaXQgYXV0b0NvZGVUaGVtZSgpOyIsICJpbXBvcnQgeyBjaGRpciwgY3dkIH0gZnJvbSBcInByb2Nlc3NcIjtcbmNvbnN0IHBhdGhUaGlzID0gY3dkKCkuc3BsaXQoJy8nKTtcblxuZnVuY3Rpb24gY2hlY2tCYXNlKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAocGF0aFRoaXMuYXQoLWluZGV4KSA9PSAnbm9kZV9tb2R1bGVzJykge1xuICAgICAgICBjaGRpcignLi4vJy5yZXBlYXQoaW5kZXgpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmlmICghY2hlY2tCYXNlKDIpKVxuICAgIGNoZWNrQmFzZSgzKTtcblxuaW1wb3J0KCcuL2J1aWxkLXNjcmlwdHMuanMnKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxXQU1TO0FBTmI7QUFBQTtBQUFBLElBQUksWUFBWTtBQU1ULElBQU0sUUFBUSxJQUFJLE1BQU0sU0FBUTtBQUFBLE1BQ25DLElBQUksUUFBUSxNQUFNLFVBQVU7QUFDeEIsWUFBRyxhQUFhLFFBQVE7QUFDcEIsaUJBQU8sT0FBTztBQUNsQixlQUFPLE1BQU07QUFBQSxRQUFDO0FBQUEsTUFDbEI7QUFBQSxJQUNKLENBQUM7QUFBQTtBQUFBOzs7QUNaRDtBQUVBO0FBRUEsZ0JBQWdCLE9BQStCO0FBQzNDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxLQUFLLE9BQU0sQ0FBQyxLQUFLLFVBQVM7QUFDekIsVUFBSSxRQUFRLEtBQUksQ0FBQztBQUFBLElBQ3JCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQVFBLGNBQWMsT0FBYyxPQUFnQixhQUF1QixlQUFtQixDQUFDLEdBQXdCO0FBQzNHLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxLQUFLLE9BQU0sQ0FBQyxLQUFLLFVBQVM7QUFDekIsVUFBRyxPQUFPLENBQUMsYUFBWTtBQUNuQixjQUFNLE1BQU0sR0FBRztBQUFBLE1BQ25CO0FBQ0EsVUFBSSxTQUFTLFFBQU0sTUFBSyxTQUFRLFNBQVEsWUFBWTtBQUFBLElBQ3hELENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQVFBLDBCQUEwQixPQUFjLGVBQW9CLE1BQXVCO0FBQy9FLFNBQVEsT0FBTSxLQUFLLE9BQU0sUUFBVyxJQUFJLEdBQUcsU0FBUyxLQUFLO0FBQzdEO0FBT0EsZUFBZSxPQUErQjtBQUMxQyxTQUFPLElBQUksUUFBUSxTQUFPO0FBQ3RCLE9BQUcs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
