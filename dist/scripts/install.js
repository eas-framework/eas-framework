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
        if (prop == "important")
          return target.error;
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
      StringTack(fullSaveLocation, httpSource, relative) {
        return outputMap(this, fullSaveLocation, httpSource, relative);
      }
    };
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
            .code-copy>div>a{
                margin-top: 25px;
                margin-right: 10px;
                position: relative;
                bottom: -7px;        
            }
            .code-copy>div {
                text-align:right;
                opacity:0;
                height:0;
            }
            .code-copy:hover>div {
                opacity:1;
            }
            .code-copy>div a:focus {
                color:#6bb86a
            }
            `;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL091dHB1dElucHV0L0NvbnNvbGUudHMiLCAiLi4vLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi8uLi9zcmMvU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcudHMiLCAiLi4vLi4vc3JjL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtLnRzIiwgIi4uLy4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwLnRzIiwgIi4uLy4uL3NyYy9FYXN5RGVidWcvU291cmNlTWFwU3RvcmUudHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXAudHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyLnRzIiwgIi4uLy4uL3NyYy9PdXRwdXRJbnB1dC9QcmludE5ldy50cyIsICIuLi8uLi9zcmMvQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyLnRzIiwgIi4uLy4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL21hcmtkb3duLnRzIiwgIi4uLy4uL3NyYy9zY3JpcHRzL2J1aWxkLXNjcmlwdHMudHMiLCAiLi4vLi4vc3JjL3NjcmlwdHMvaW5zdGFsbC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsibGV0IHByaW50TW9kZSA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd1ByaW50KGQ6IGJvb2xlYW4pIHtcbiAgICBwcmludE1vZGUgPSBkO1xufVxuXG5leHBvcnQgY29uc3QgcHJpbnQgPSBuZXcgUHJveHkoY29uc29sZSx7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYocHJvcCA9PSAnaW1wb3J0YW50JylcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuZXJyb3I7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYocHJpbnRNb2RlICYmIHByb3AgIT0gXCJkby1ub3RoaW5nXCIpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICB9XG59KTsiLCAiaW1wb3J0IGZzLCB7RGlyZW50LCBTdGF0c30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIGV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIHJlcyhCb29sZWFuKHN0YXQpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge3BhdGggb2YgdGhlIGZpbGV9IHBhdGggXG4gKiBAcGFyYW0ge2ZpbGVkIHRvIGdldCBmcm9tIHRoZSBzdGF0IG9iamVjdH0gZmlsZWQgXG4gKiBAcmV0dXJucyB0aGUgZmlsZWRcbiAqL1xuZnVuY3Rpb24gc3RhdChwYXRoOiBzdHJpbmcsIGZpbGVkPzogc3RyaW5nLCBpZ25vcmVFcnJvcj86IGJvb2xlYW4sIGRlZmF1bHRWYWx1ZTphbnkgPSB7fSk6IFByb21pc2U8U3RhdHMgfCBhbnk+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICAgICAgICBmcy5zdGF0KHBhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgICAgIGlmKGVyciAmJiAhaWdub3JlRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoZmlsZWQgJiYgc3RhdD8gc3RhdFtmaWxlZF06IHN0YXQgfHwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGZpbGUgZXhpc3RzLCByZXR1cm4gdHJ1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byBjaGVjay5cbiAqIEBwYXJhbSB7YW55fSBbaWZUcnVlUmV0dXJuPXRydWVdIC0gYW55ID0gdHJ1ZVxuICogQHJldHVybnMgQSBib29sZWFuIHZhbHVlLlxuICovXG5hc3luYyBmdW5jdGlvbiBleGlzdHNGaWxlKHBhdGg6IHN0cmluZywgaWZUcnVlUmV0dXJuOiBhbnkgPSB0cnVlKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gKGF3YWl0IHN0YXQocGF0aCwgdW5kZWZpbmVkLCB0cnVlKSkuaXNGaWxlPy4oKSAmJiBpZlRydWVSZXR1cm47XG59XG5cbi8qKlxuICogSXQgY3JlYXRlcyBhIGRpcmVjdG9yeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIG1rZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLm1rZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHJtZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcm1kaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucm1kaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgdW5saW5rYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gdW5saW5rKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnVubGluayhwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGV4aXN0cywgZGVsZXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSB0byBiZSB1bmxpbmtlZC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5saW5rSWZFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZihhd2FpdCBleGlzdHMocGF0aCkpe1xuICAgICAgICByZXR1cm4gYXdhaXQgdW5saW5rKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRkaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbnMgb2JqZWN0LCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHtcbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHJlYWRkaXIocGF0aDogc3RyaW5nLCBvcHRpb25zID0ge30pOiBQcm9taXNlPHN0cmluZ1tdIHwgQnVmZmVyW10gfCBEaXJlbnRbXT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRkaXIocGF0aCwgb3B0aW9ucywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlcyB8fCBbXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkaXJlY3Rvcnkgd2FzIGNyZWF0ZWQgb3Igbm90LlxuICovXG5hc3luYyBmdW5jdGlvbiBta2RpcklmTm90RXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoIWF3YWl0IGV4aXN0cyhwYXRoKSlcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1rZGlyKHBhdGgpO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIGZpbGUgdG8gdGhlIGZpbGUgc3lzdGVtXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHtzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHdyaXRlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6ICBzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3KTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMud3JpdGVGaWxlKHBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHdyaXRlSnNvbkZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGEgY29udGVudCBhbmQgd3JpdGVzIHRoZSBjb250ZW50IHRvIHRoZSBmaWxlIGF0XG4gKiB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7YW55fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSnNvbkZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgd3JpdGVGaWxlKHBhdGgsIEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZEZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbmFsIGVuY29kaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gKiByZXNvbHZlcyB0byB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXQgdGhlIGdpdmVuIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBbZW5jb2Rpbmc9dXRmOF0gLSBUaGUgZW5jb2Rpbmcgb2YgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlYWRGaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZyA9ICd1dGY4Jyk6IFByb21pc2U8c3RyaW5nfGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRGaWxlKHBhdGgsIDxhbnk+ZW5jb2RpbmcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhkYXRhIHx8IFwiXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJdCByZWFkcyBhIEpTT04gZmlsZSBhbmQgcmV0dXJucyB0aGUgcGFyc2VkIEpTT04gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIHtzdHJpbmd9IFtlbmNvZGluZ10gLSBUaGUgZW5jb2RpbmcgdG8gdXNlIHdoZW4gcmVhZGluZyB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZEpzb25GaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZz86c3RyaW5nKTogUHJvbWlzZTxhbnk+e1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHJlYWRGaWxlKHBhdGgsIGVuY29kaW5nKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSBwIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBuZWVkcyB0byBiZSBjcmVhdGVkLlxuICogQHBhcmFtIFtiYXNlXSAtIFRoZSBiYXNlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VQYXRoUmVhbChwOnN0cmluZywgYmFzZSA9ICcnKSB7XG4gICAgcCA9IHBhdGguZGlybmFtZShwKTtcblxuICAgIGlmICghYXdhaXQgZXhpc3RzKGJhc2UgKyBwKSkge1xuICAgICAgICBjb25zdCBhbGwgPSBwLnNwbGl0KC9cXFxcfFxcLy8pO1xuXG4gICAgICAgIGxldCBwU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGlmIChwU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHBTdHJpbmcgKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcFN0cmluZyArPSBpO1xuXG4gICAgICAgICAgICBhd2FpdCBta2RpcklmTm90RXhpc3RzKGJhc2UgKyBwU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy90eXBlc1xuZXhwb3J0IHtcbiAgICBEaXJlbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC4uLmZzLnByb21pc2VzLFxuICAgIGV4aXN0cyxcbiAgICBleGlzdHNGaWxlLFxuICAgIHN0YXQsXG4gICAgbWtkaXIsXG4gICAgbWtkaXJJZk5vdEV4aXN0cyxcbiAgICB3cml0ZUZpbGUsXG4gICAgd3JpdGVKc29uRmlsZSxcbiAgICByZWFkRmlsZSxcbiAgICByZWFkSnNvbkZpbGUsXG4gICAgcm1kaXIsXG4gICAgdW5saW5rLFxuICAgIHVubGlua0lmRXhpc3RzLFxuICAgIHJlYWRkaXIsXG4gICAgbWFrZVBhdGhSZWFsXG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcblxuaW50ZXJmYWNlIGdsb2JhbFN0cmluZzxUPiB7XG4gICAgaW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBsYXN0SW5kZXhPZihzdHJpbmc6IHN0cmluZyk6IG51bWJlcjtcbiAgICBzdGFydHNXaXRoKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0Rmlyc3Q8VCBleHRlbmRzIGdsb2JhbFN0cmluZzxUPj4odHlwZTogc3RyaW5nLCBzdHJpbmc6IFQpOiBUW10ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YodHlwZSk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpXG4gICAgICAgIHJldHVybiBbc3RyaW5nXTtcblxuICAgIHJldHVybiBbc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCksIHN0cmluZy5zdWJzdHJpbmcoaW5kZXggKyB0eXBlLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3V0VGhlTGFzdCh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxhc3RJbmRleE9mKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVuc2lvbjxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdHJpbmc6IFQpIHtcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdHJpbmcubGFzdEluZGV4T2YoJy4nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltVHlwZSh0eXBlOiBzdHJpbmcsIHN0cmluZzogc3RyaW5nKSB7XG4gICAgd2hpbGUgKHN0cmluZy5zdGFydHNXaXRoKHR5cGUpKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHR5cGUubGVuZ3RoKTtcblxuICAgIHdoaWxlIChzdHJpbmcuZW5kc1dpdGgodHlwZSkpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgc3RyaW5nLmxlbmd0aCAtIHR5cGUubGVuZ3RoKTtcblxuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzdHJpbmdTdGFydDxUIGV4dGVuZHMgZ2xvYmFsU3RyaW5nPFQ+PihzdGFydDogc3RyaW5nLCBzdHJpbmc6IFQpOiBUIHtcbiAgICBpZihzdHJpbmcuc3RhcnRzV2l0aChzdGFydCkpXG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cmluZztcbn0iLCAiaW1wb3J0IHtEaXJlbnR9IGZyb20gJ2ZzJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7Y3dkfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmaWxlVVJMVG9QYXRofSBmcm9tICd1cmwnXG5pbXBvcnQgeyBDdXRUaGVMYXN0ICwgU3BsaXRGaXJzdH0gZnJvbSAnLi4vU3RyaW5nTWV0aG9kcy9TcGxpdHRpbmcnO1xuXG5mdW5jdGlvbiBnZXREaXJuYW1lKHVybDogc3RyaW5nKXtcbiAgICByZXR1cm4gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgodXJsKSk7XG59XG5cbmNvbnN0IFN5c3RlbURhdGEgPSBwYXRoLmpvaW4oZ2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpLCAnL1N5c3RlbURhdGEnKTtcblxubGV0IFdlYlNpdGVGb2xkZXJfID0gXCJXZWJTaXRlXCI7XG5cbmNvbnN0IFN0YXRpY05hbWUgPSAnV1dXJywgTG9nc05hbWUgPSAnTG9ncycsIE1vZHVsZXNOYW1lID0gJ25vZGVfbW9kdWxlcyc7XG5cbmNvbnN0IFN0YXRpY0NvbXBpbGUgPSBTeXN0ZW1EYXRhICsgYC8ke1N0YXRpY05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZUxvZ3MgPSBTeXN0ZW1EYXRhICsgYC8ke0xvZ3NOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVNb2R1bGUgPSBTeXN0ZW1EYXRhICsgYC8ke01vZHVsZXNOYW1lfUNvbXBpbGUvYDtcblxuY29uc3Qgd29ya2luZ0RpcmVjdG9yeSA9IGN3ZCgpICsgJy8nO1xuXG5mdW5jdGlvbiBHZXRGdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LFdlYlNpdGVGb2xkZXJfLCAnLycpO1xufVxubGV0IGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcblxuZnVuY3Rpb24gR2V0U291cmNlKG5hbWUpIHtcbiAgICByZXR1cm4gIEdldEZ1bGxXZWJTaXRlUGF0aCgpICsgbmFtZSArICcvJ1xufVxuXG4vKiBBIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgcGF0aHMgb2YgdGhlIGZpbGVzIGluIHRoZSBwcm9qZWN0LiAqL1xuY29uc3QgZ2V0VHlwZXMgPSB7XG4gICAgU3RhdGljOiBbXG4gICAgICAgIEdldFNvdXJjZShTdGF0aWNOYW1lKSxcbiAgICAgICAgU3RhdGljQ29tcGlsZSxcbiAgICAgICAgU3RhdGljTmFtZVxuICAgIF0sXG4gICAgTG9nczogW1xuICAgICAgICBHZXRTb3VyY2UoTG9nc05hbWUpLFxuICAgICAgICBDb21waWxlTG9ncyxcbiAgICAgICAgTG9nc05hbWVcbiAgICBdLFxuICAgIG5vZGVfbW9kdWxlczogW1xuICAgICAgICBHZXRTb3VyY2UoJ25vZGVfbW9kdWxlcycpLFxuICAgICAgICBDb21waWxlTW9kdWxlLFxuICAgICAgICBNb2R1bGVzTmFtZVxuICAgIF0sXG4gICAgZ2V0IFtTdGF0aWNOYW1lXSgpe1xuICAgICAgICByZXR1cm4gZ2V0VHlwZXMuU3RhdGljO1xuICAgIH1cbn1cblxuY29uc3QgcGFnZVR5cGVzID0ge1xuICAgIHBhZ2U6IFwicGFnZVwiLFxuICAgIG1vZGVsOiBcIm1vZGVcIixcbiAgICBjb21wb25lbnQ6IFwiaW50ZVwiXG59XG5cblxuY29uc3QgQmFzaWNTZXR0aW5ncyA9IHtcbiAgICBwYWdlVHlwZXMsXG5cbiAgICBwYWdlVHlwZXNBcnJheTogW10sXG5cbiAgICBwYWdlQ29kZUZpbGU6IHtcbiAgICAgICAgcGFnZTogW3BhZ2VUeXBlcy5wYWdlK1wiLmpzXCIsIHBhZ2VUeXBlcy5wYWdlK1wiLnRzXCJdLFxuICAgICAgICBtb2RlbDogW3BhZ2VUeXBlcy5tb2RlbCtcIi5qc1wiLCBwYWdlVHlwZXMubW9kZWwrXCIudHNcIl0sXG4gICAgICAgIGNvbXBvbmVudDogW3BhZ2VUeXBlcy5jb21wb25lbnQrXCIuanNcIiwgcGFnZVR5cGVzLmNvbXBvbmVudCtcIi50c1wiXVxuICAgIH0sXG5cbiAgICBwYWdlQ29kZUZpbGVBcnJheTogW10sXG5cbiAgICBwYXJ0RXh0ZW5zaW9uczogWydzZXJ2JywgJ2FwaSddLFxuXG4gICAgUmVxRmlsZVR5cGVzOiB7XG4gICAgICAgIGpzOiBcInNlcnYuanNcIixcbiAgICAgICAgdHM6IFwic2Vydi50c1wiLFxuICAgICAgICAnYXBpLXRzJzogXCJhcGkuanNcIixcbiAgICAgICAgJ2FwaS1qcyc6IFwiYXBpLnRzXCJcbiAgICB9LFxuICAgIFJlcUZpbGVUeXBlc0FycmF5OiBbXSxcblxuICAgIGdldCBXZWJTaXRlRm9sZGVyKCkge1xuICAgICAgICByZXR1cm4gV2ViU2l0ZUZvbGRlcl87XG4gICAgfSxcbiAgICBnZXQgZnVsbFdlYlNpdGVQYXRoKCkge1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXztcbiAgICB9LFxuICAgIHNldCBXZWJTaXRlRm9sZGVyKHZhbHVlKSB7XG4gICAgICAgIFdlYlNpdGVGb2xkZXJfID0gdmFsdWU7XG5cbiAgICAgICAgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuICAgICAgICBnZXRUeXBlcy5TdGF0aWNbMF0gPSBHZXRTb3VyY2UoU3RhdGljTmFtZSk7XG4gICAgICAgIGdldFR5cGVzLkxvZ3NbMF0gPSBHZXRTb3VyY2UoTG9nc05hbWUpO1xuICAgIH0sXG4gICAgZ2V0IHRzQ29uZmlnKCl7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfICsgJ3RzY29uZmlnLmpzb24nOyBcbiAgICB9LFxuICAgIGFzeW5jIHRzQ29uZmlnRmlsZSgpIHtcbiAgICAgICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy50c0NvbmZpZykpe1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnRzQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVsYXRpdmUoZnVsbFBhdGg6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKGZ1bGxXZWJTaXRlUGF0aF8sIGZ1bGxQYXRoKVxuICAgIH1cbn1cblxuQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMpO1xuQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGUpLmZsYXQoKTtcbkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERlbGV0ZUluRGlyZWN0b3J5KHBhdGgpIHtcbiAgICBjb25zdCBhbGxJbkZvbGRlciA9IGF3YWl0IEVhc3lGcy5yZWFkZGlyKHBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgKDxEaXJlbnRbXT5hbGxJbkZvbGRlcikpIHtcbiAgICAgICAgY29uc3QgbiA9IGkubmFtZTtcbiAgICAgICAgaWYgKGkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gcGF0aCArIG4gKyAnLyc7XG4gICAgICAgICAgICBhd2FpdCBEZWxldGVJbkRpcmVjdG9yeShkaXIpO1xuICAgICAgICAgICAgYXdhaXQgRWFzeUZzLnJtZGlyKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMudW5saW5rKHBhdGggKyBuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNtYWxsUGF0aFRvUGFnZShzbWFsbFBhdGg6IHN0cmluZyl7XG4gICAgcmV0dXJuIEN1dFRoZUxhc3QoJy4nLCBTcGxpdEZpcnN0KCcvJywgc21hbGxQYXRoKS5wb3AoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlQnlTbWFsbFBhdGgoc21hbGxQYXRoOiBzdHJpbmcpe1xuICAgIHJldHVybiBnZXRUeXBlc1tTcGxpdEZpcnN0KCcvJywgc21hbGxQYXRoKS5zaGlmdCgpXTtcbn1cblxuXG5cbmV4cG9ydCB7XG4gICAgZ2V0RGlybmFtZSxcbiAgICBTeXN0ZW1EYXRhLFxuICAgIHdvcmtpbmdEaXJlY3RvcnksXG4gICAgZ2V0VHlwZXMsXG4gICAgQmFzaWNTZXR0aW5nc1xufSIsICJpbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3IgfSBmcm9tIFwic291cmNlLW1hcFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VUkxDb21tZW50KG1hcDogU291cmNlTWFwR2VuZXJhdG9yLCBpc0Nzcz86IGJvb2xlYW4pIHtcbiAgICBsZXQgbWFwU3RyaW5nID0gYHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCR7QnVmZmVyLmZyb20obWFwLnRvU3RyaW5nKCkpLnRvU3RyaW5nKFwiYmFzZTY0XCIpfWA7XG5cbiAgICBpZiAoaXNDc3MpXG4gICAgICAgIG1hcFN0cmluZyA9IGAvKiMgJHttYXBTdHJpbmd9Ki9gXG4gICAgZWxzZVxuICAgICAgICBtYXBTdHJpbmcgPSAnLy8jICcgKyBtYXBTdHJpbmc7XG5cbiAgICByZXR1cm4gJ1xcclxcbicgKyBtYXBTdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBNZXJnZVNvdXJjZU1hcChnZW5lcmF0ZWRNYXA6IFJhd1NvdXJjZU1hcCwgb3JpZ2luYWxNYXA6IFJhd1NvdXJjZU1hcCkge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG9yaWdpbmFsTWFwKTtcbiAgICBjb25zdCBuZXdNYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKCk7XG4gICAgKGF3YWl0IG5ldyBTb3VyY2VNYXBDb25zdW1lcihnZW5lcmF0ZWRNYXApKS5lYWNoTWFwcGluZyhtID0+IHtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBvcmlnaW5hbC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtsaW5lOiBtLm9yaWdpbmFsTGluZSwgY29sdW1uOiBtLm9yaWdpbmFsQ29sdW1ufSlcbiAgICAgICAgaWYoIWxvY2F0aW9uLnNvdXJjZSkgcmV0dXJuO1xuICAgICAgICBuZXdNYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uLFxuICAgICAgICAgICAgICAgIGxpbmU6IG0uZ2VuZXJhdGVkTGluZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uOiBsb2NhdGlvbi5jb2x1bW4sXG4gICAgICAgICAgICAgICAgbGluZTogbG9jYXRpb24ubGluZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNvdXJjZTogbG9jYXRpb24uc291cmNlXG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3TWFwO1xufSIsICJpbXBvcnQgU3RyaW5nVHJhY2tlciBmcm9tICcuL1N0cmluZ1RyYWNrZXInO1xuaW1wb3J0IHsgU291cmNlTWFwR2VuZXJhdG9yLCBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyIH0gZnJvbSBcInNvdXJjZS1tYXBcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQmFzaWNTZXR0aW5ncywgZ2V0VHlwZXMgfSBmcm9tICcuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQge2ZpbGVVUkxUb1BhdGh9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IFNwbGl0Rmlyc3QgfSBmcm9tICcuLi9TdHJpbmdNZXRob2RzL1NwbGl0dGluZyc7XG5pbXBvcnQgeyB0b1VSTENvbW1lbnQgfSBmcm9tICcuL1NvdXJjZU1hcCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlTWFwQmFzaWMge1xuICAgIHByb3RlY3RlZCBtYXA6IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiAgICBwcm90ZWN0ZWQgZmlsZURpck5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgbGluZUNvdW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmaWxlUGF0aDogc3RyaW5nLCBwcm90ZWN0ZWQgaHR0cFNvdXJjZSA9IHRydWUsIHByb3RlY3RlZCByZWxhdGl2ZSA9IGZhbHNlLCBwcm90ZWN0ZWQgaXNDc3MgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgICAgICAgZmlsZTogZmlsZVBhdGguc3BsaXQoL1xcL3xcXFxcLykucG9wKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFodHRwU291cmNlKVxuICAgICAgICAgICAgdGhpcy5maWxlRGlyTmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zcGxpdCgnPGxpbmU+JykucG9wKCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmh0dHBTb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChCYXNpY1NldHRpbmdzLnBhZ2VUeXBlc0FycmF5LmluY2x1ZGVzKHBhdGguZXh0bmFtZShzb3VyY2UpLnN1YnN0cmluZygxKSkpXG4gICAgICAgICAgICAgICAgc291cmNlICs9ICcuc291cmNlJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBTcGxpdEZpcnN0KCcvJywgc291cmNlKS5wb3AoKSArICc/c291cmNlPXRydWUnO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKCh0aGlzLnJlbGF0aXZlID8gJyc6ICcvJykgKyBzb3VyY2UucmVwbGFjZSgvXFxcXC9naSwgJy8nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0aGlzLmZpbGVEaXJOYW1lLCBCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHNvdXJjZSk7XG4gICAgfVxuXG4gICAgZ2V0Um93U291cmNlTWFwKCk6IFJhd1NvdXJjZU1hcHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLnRvSlNPTigpXG4gICAgfVxuXG4gICAgbWFwQXNVUkxDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdG9VUkxDb21tZW50KHRoaXMubWFwLCB0aGlzLmlzQ3NzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZU1hcFN0b3JlIGV4dGVuZHMgU291cmNlTWFwQmFzaWMge1xuICAgIHByaXZhdGUgc3RvcmVTdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGFjdGlvbkxvYWQ6IHsgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnlbXSB9W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVQYXRoOiBzdHJpbmcsIHByb3RlY3RlZCBkZWJ1ZyA9IHRydWUsIGlzQ3NzID0gZmFsc2UsIGh0dHBTb3VyY2UgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGZpbGVQYXRoLCBodHRwU291cmNlLCBmYWxzZSwgaXNDc3MpO1xuICAgIH1cblxuICAgIG5vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZC5wdXNoKHsgbmFtZTogJ2FkZFN0cmluZ1RyYWNrZXInLCBkYXRhOiBbdHJhY2ssIHt0ZXh0fV0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkU3RyaW5nVHJhY2tlcih0cmFjazogU3RyaW5nVHJhY2tlciwgeyB0ZXh0OiB0ZXh0ID0gdHJhY2suZXEgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IERhdGFBcnJheSA9IHRyYWNrLmdldERhdGFBcnJheSgpLCBsZW5ndGggPSBEYXRhQXJyYXkubGVuZ3RoO1xuICAgICAgICBsZXQgd2FpdE5leHRMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgeyB0ZXh0LCBsaW5lLCBpbmZvIH0gPSBEYXRhQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgd2FpdE5leHRMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2FpdE5leHRMaW5lICYmIGxpbmUgJiYgaW5mbykge1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmUsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogdGhpcy5saW5lQ291bnQsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKGluZm8pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlU3RyaW5nICs9IHRleHQ7XG4gICAgfVxuXG5cbiAgICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRUZXh0JywgZGF0YTogW3RleHRdIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKVxuICAgICAgICAgICAgdGhpcy5saW5lQ291bnQgKz0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy5zdG9yZVN0cmluZyArPSB0ZXh0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmaXhVUkxTb3VyY2VNYXAobWFwOiBSYXdTb3VyY2VNYXApe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWFwLnNvdXJjZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbWFwLnNvdXJjZXNbaV0gPSBCYXNpY1NldHRpbmdzLnJlbGF0aXZlKGZpbGVVUkxUb1BhdGgobWFwLnNvdXJjZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGFkZFNvdXJjZU1hcFdpdGhTdHJpbmdUcmFja2VyKGZyb21NYXA6IFJhd1NvdXJjZU1hcCwgdHJhY2s6IFN0cmluZ1RyYWNrZXIsIHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjdGlvbkxvYWQucHVzaCh7IG5hbWU6ICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcicsIGRhdGE6IFtmcm9tTWFwLCB0cmFjaywgdGV4dF0gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfYWRkU291cmNlTWFwV2l0aFN0cmluZ1RyYWNrZXIoZnJvbU1hcDogUmF3U291cmNlTWFwLCB0cmFjazogU3RyaW5nVHJhY2tlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRUZXh0KHRleHQpO1xuXG4gICAgICAgIChhd2FpdCBuZXcgU291cmNlTWFwQ29uc3VtZXIoZnJvbU1hcCkpLmVhY2hNYXBwaW5nKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5mbyA9IHRyYWNrLmdldExpbmUobS5vcmlnaW5hbExpbmUpLmdldERhdGFBcnJheSgpWzBdO1xuXG4gICAgICAgICAgICBpZiAobS5zb3VyY2UgPT0gdGhpcy5maWxlUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShtLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IGRhdGFJbmZvLmxpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lICsgdGhpcy5saW5lQ291bnQsIGNvbHVtbjogbS5nZW5lcmF0ZWRDb2x1bW4gfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZ2V0U291cmNlKG0uc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogbS5vcmlnaW5hbExpbmUsIGNvbHVtbjogbS5vcmlnaW5hbENvbHVtbiB9LFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogbS5nZW5lcmF0ZWRMaW5lLCBjb2x1bW46IG0uZ2VuZXJhdGVkQ29sdW1uIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYWRkVGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgZGF0YSB9IG9mIHRoaXMuYWN0aW9uTG9hZCkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRTdHJpbmdUcmFja2VyKC4uLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FkZFRleHQnOlxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRTb3VyY2VNYXBXaXRoU3RyaW5nVHJhY2tlciguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEFzVVJMQ29tbWVudCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEFsbCgpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5tYXBBc1VSTENvbW1lbnQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZURhdGFXaXRoTWFwKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkQWxsKCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlU3RyaW5nICsgc3VwZXIubWFwQXNVUkxDb21tZW50KCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgU291cmNlTWFwU3RvcmUodGhpcy5maWxlUGF0aCwgdGhpcy5kZWJ1ZywgdGhpcy5pc0NzcywgdGhpcy5odHRwU291cmNlKTtcbiAgICAgICAgY29weS5hY3Rpb25Mb2FkLnB1c2goLi4udGhpcy5hY3Rpb25Mb2FkKVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFNvdXJjZU1hcEJhc2ljIH0gZnJvbSAnLi4vRWFzeURlYnVnL1NvdXJjZU1hcFN0b3JlJztcblxuY2xhc3MgY3JlYXRlUGFnZVNvdXJjZU1hcCBleHRlbmRzIFNvdXJjZU1hcEJhc2ljIHtcbiAgICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBodHRwU291cmNlID0gZmFsc2UsIHJlbGF0aXZlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZmlsZVBhdGgsIGh0dHBTb3VyY2UsIHJlbGF0aXZlKTtcbiAgICAgICAgdGhpcy5saW5lQ291bnQgPSAxO1xuICAgIH1cblxuICAgIGFkZE1hcHBpbmdGcm9tVHJhY2sodHJhY2s6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgY29uc3QgRGF0YUFycmF5ID0gdHJhY2suZ2V0RGF0YUFycmF5KCksIGxlbmd0aCA9IERhdGFBcnJheS5sZW5ndGg7XG4gICAgICAgIGxldCB3YWl0TmV4dExpbmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCwgbGluZSwgaW5mbyB9ID0gRGF0YUFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIHdhaXROZXh0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdhaXROZXh0TGluZSAmJiBsaW5lICYmIGluZm8pIHtcbiAgICAgICAgICAgICAgICB3YWl0TmV4dExpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IHRoaXMubGluZUNvdW50LCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLmdldFNvdXJjZShpbmZvKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRNYXAodGV4dDogU3RyaW5nVHJhY2tlciwgZmlsZVBhdGg6IHN0cmluZywgaHR0cFNvdXJjZT86IGJvb2xlYW4sIHJlbGF0aXZlPzogYm9vbGVhbil7XG4gICAgY29uc3Qgc3RvcmVNYXAgPSBuZXcgY3JlYXRlUGFnZVNvdXJjZU1hcChmaWxlUGF0aCwgaHR0cFNvdXJjZSwgcmVsYXRpdmUpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gc3RvcmVNYXAuZ2V0Um93U291cmNlTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRXaXRoTWFwKHRleHQ6IFN0cmluZ1RyYWNrZXIsIGZpbGVQYXRoOiBzdHJpbmcpe1xuICAgIGNvbnN0IHN0b3JlTWFwID0gbmV3IGNyZWF0ZVBhZ2VTb3VyY2VNYXAoZmlsZVBhdGgpO1xuICAgIHN0b3JlTWFwLmFkZE1hcHBpbmdGcm9tVHJhY2sodGV4dCk7XG5cbiAgICByZXR1cm4gdGV4dC5lcSArIHN0b3JlTWFwLm1hcEFzVVJMQ29tbWVudCgpO1xufSIsICJpbXBvcnQgeyBCYXNpY1NldHRpbmdzIH0gZnJvbSBcIi4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBvdXRwdXRNYXAsIG91dHB1dFdpdGhNYXAgfSBmcm9tIFwiLi9TdHJpbmdUcmFja2VyVG9Tb3VyY2VNYXBcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgIHRleHQ/OiBzdHJpbmcsXG4gICAgaW5mbzogc3RyaW5nLFxuICAgIGxpbmU/OiBudW1iZXIsXG4gICAgY2hhcj86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3RyaW5nSW5kZXhlckluZm8ge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheU1hdGNoIGV4dGVuZHMgQXJyYXk8U3RyaW5nVHJhY2tlcj4ge1xuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGlucHV0PzogU3RyaW5nVHJhY2tlclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdUcmFja2VyIHtcbiAgICBwcml2YXRlIERhdGFBcnJheTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgSW5mb1RleHQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIE9uTGluZSA9IDE7XG4gICAgcHVibGljIE9uQ2hhciA9IDE7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIEluZm9UZXh0IHRleHQgaW5mbyBmb3IgYWxsIG5ldyBzdHJpbmcgdGhhdCBhcmUgY3JlYXRlZCBpbiB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihJbmZvPzogc3RyaW5nIHwgU3RyaW5nVHJhY2tlckRhdGFJbmZvLCB0ZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgSW5mbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm87XG4gICAgICAgIH0gZWxzZSBpZiAoSW5mbykge1xuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0KEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuQWRkRmlsZVRleHQodGV4dCwgdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXRpYyBnZXQgZW1wdHlJbmZvKCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdChJbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQpIHtcbiAgICAgICAgdGhpcy5JbmZvVGV4dCA9IEluZm8uaW5mbztcbiAgICAgICAgdGhpcy5PbkxpbmUgPSBJbmZvLmxpbmU7XG4gICAgICAgIHRoaXMuT25DaGFyID0gSW5mby5jaGFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRhQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgbGFzdCBJbmZvVGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgRGVmYXVsdEluZm9UZXh0KCk6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgICAgIGlmICghdGhpcy5EYXRhQXJyYXkuZmluZCh4ID0+IHguaW5mbykgJiYgdGhpcy5JbmZvVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IHRoaXMuSW5mb1RleHQsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy5PbkxpbmUsXG4gICAgICAgICAgICAgICAgY2hhcjogdGhpcy5PbkNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheVt0aGlzLkRhdGFBcnJheS5sZW5ndGggLSAxXSA/PyBTdHJpbmdUcmFja2VyLmVtcHR5SW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIEluZm9UZXh0IHRoYXQgYXJlIHNldHRlZCBvbiB0aGUgZmlyc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBnZXQgU3RhcnRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbMF0gPz8gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBhcyBvbmUgc3RyaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgT25lU3RyaW5nKCkge1xuICAgICAgICBsZXQgYmlnU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgYmlnU3RyaW5nICs9IGkudGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiaWdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFsbCB0aGUgdGV4dCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0IGVxdWFsIG9yIG5vdFxuICAgICAqIHVzZSBsaWtlIHRoYXQ6IG15U3RyaW5nLmVxID09IFwiY29vbFwiXG4gICAgICovXG4gICAgZ2V0IGVxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBpbmZvIGFib3V0IHRoaXMgdGV4dFxuICAgICAqL1xuICAgIGdldCBsaW5lSW5mbygpIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBjb25zdCBzID0gZC5pbmZvLnNwbGl0KCc8bGluZT4nKTtcbiAgICAgICAgcy5wdXNoKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoICsgcy5wb3AoKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3Muam9pbignPGxpbmU+Jyl9OiR7ZC5saW5lfToke2QuY2hhcn1gO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbGVuZ3RoIG9mIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkRhdGFBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgY29weSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmUoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgU3RyaW5nVHJhY2tlcih0aGlzLlN0YXJ0SW5mbyk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3RGF0YS5BZGRUZXh0QWZ0ZXIoaS50ZXh0LCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZENsb25lKGRhdGE6IFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkucHVzaCguLi5kYXRhLkRhdGFBcnJheSk7XG5cbiAgICAgICAgdGhpcy5zZXREZWZhdWx0KHtcbiAgICAgICAgICAgIGluZm86IGRhdGEuSW5mb1RleHQsXG4gICAgICAgICAgICBsaW5lOiBkYXRhLk9uTGluZSxcbiAgICAgICAgICAgIGNoYXI6IGRhdGEuT25DaGFyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0ZXh0IGFueSB0aGluZyB0byBjb25uZWN0XG4gICAgICogQHJldHVybnMgY29ubmN0ZWQgc3RyaW5nIHdpdGggYWxsIHRoZSB0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb25jYXQoLi4udGV4dDogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGV4dCkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqIEByZXR1cm5zIHRoaXMgc3RyaW5nIGNsb25lIHBsdXMgdGhlIG5ldyBkYXRhIGNvbm5lY3RlZFxuICAgICAqL1xuICAgIHB1YmxpYyBDbG9uZVBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZ1RyYWNrZXIuY29uY2F0KHRoaXMuQ2xvbmUoKSwgLi4uZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmluZyBvciBhbnkgZGF0YSB0byB0aGlzIHN0cmluZ1xuICAgICAqIEBwYXJhbSBkYXRhIGNhbiBiZSBhbnkgdGhpbmdcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyAobm90IG5ldyBzdHJpbmcpXG4gICAgICovXG4gICAgcHVibGljIFBsdXMoLi4uZGF0YTogYW55W10pOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgbGV0IGxhc3RpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0aW5mbyA9IGkuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkQ2xvbmUoaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKFN0cmluZyhpKSwgbGFzdGluZm8uaW5mbywgbGFzdGluZm8ubGluZSwgbGFzdGluZm8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgc3RyaW5zIG90IG90aGVyIGRhdGEgd2l0aCAnVGVtcGxhdGUgbGl0ZXJhbHMnXG4gICAgICogdXNlZCBsaWtlIHRoaXM6IG15U3RyaW4uJFBsdXMgYHRoaXMgdmVyeSR7Y29vbFN0cmluZ30hYFxuICAgICAqIEBwYXJhbSB0ZXh0cyBhbGwgdGhlIHNwbGl0ZWQgdGV4dFxuICAgICAqIEBwYXJhbSB2YWx1ZXMgYWxsIHRoZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgUGx1cyQodGV4dHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IChTdHJpbmdUcmFja2VyIHwgYW55KVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0VmFsdWU6IFN0cmluZ1RyYWNrZXJEYXRhSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dHNbaV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcblxuICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIodGV4dCwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ1RyYWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcodmFsdWUpLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHRzW3RleHRzLmxlbmd0aCAtIDFdLCBsYXN0VmFsdWU/LmluZm8sIGxhc3RWYWx1ZT8ubGluZSwgbGFzdFZhbHVlPy5jaGFyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBzdHJpbmcgdG8gYWRkXG4gICAgICogQHBhcmFtIGFjdGlvbiB3aGVyZSB0byBhZGQgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gaW5mbyBpbmZvIHRoZSBjb21lIHdpdGggdGhlIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQWRkVGV4dEFjdGlvbih0ZXh0OiBzdHJpbmcsIGFjdGlvbjogXCJwdXNoXCIgfCBcInVuc2hpZnRcIiwgaW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8sIExpbmVDb3VudCA9IDAsIENoYXJDb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlOiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIGRhdGFTdG9yZS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5EYXRhQXJyYXlbYWN0aW9uXSguLi5kYXRhU3RvcmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRBZnRlcih0ZXh0OiBzdHJpbmcsIGluZm8/OiBzdHJpbmcsIGxpbmU/OiBudW1iZXIsIGNoYXI/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5BZGRUZXh0QWN0aW9uKHRleHQsIFwicHVzaFwiLCBpbmZvLCBsaW5lLCBjaGFyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIHRleHQgYXQgdGhlICplbmQqIG9mIHRoZSBzdHJpbmcgd2l0aG91dCB0cmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXJOb1RyYWNrKHRleHQ6IHN0cmluZywgaW5mbyA9ICcnKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nLCBpbmZvID0gJycpIHtcbiAgICAgICAgY29uc3QgY29weSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgY29weS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5EYXRhQXJyYXkudW5zaGlmdCguLi5jb3B5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIFRleHQgRmlsZSBUcmFja2luZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHByaXZhdGUgQWRkRmlsZVRleHQodGV4dDogc3RyaW5nLCBpbmZvID0gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mbykge1xuICAgICAgICBsZXQgTGluZUNvdW50ID0gMSwgQ2hhckNvdW50ID0gMTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICB0aGlzLkRhdGFBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjaGFyLFxuICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgbGluZTogTGluZUNvdW50LFxuICAgICAgICAgICAgICAgIGNoYXI6IENoYXJDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFyQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICBMaW5lQ291bnQrKztcbiAgICAgICAgICAgICAgICBDaGFyQ291bnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2ltcGxlIG1ldGhvZiB0byBjdXQgc3RyaW5nXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBlbmQgXG4gICAgICogQHJldHVybnMgbmV3IGN1dHRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEN1dFN0cmluZyhzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKHRoaXMuU3RhcnRJbmZvKTtcblxuICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnB1c2goLi4udGhpcy5EYXRhQXJyYXkuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyaW5nLWxpa2UgbWV0aG9kLCBtb3JlIGxpa2UganMgY3V0dGluZyBzdHJpbmcsIGlmIHRoZXJlIGlzIG5vdCBwYXJhbWV0ZXJzIGl0IGNvbXBsZXRlIHRvIDBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyaW5nKHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgICAgICBpZiAoaXNOYU4oZW5kKSkge1xuICAgICAgICAgICAgZW5kID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gTWF0aC5hYnMoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hTihzdGFydCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLmFicyhzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic3RyLWxpa2UgbWV0aG9kXG4gICAgICogQHBhcmFtIHN0YXJ0IFxuICAgICAqIEBwYXJhbSBsZW5ndGggXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgcHVibGljIHN1YnN0cihzdGFydDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgbGVuZ3RoICE9IG51bGwgPyBsZW5ndGggKyBzdGFydCA6IGxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpY2UtbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2xpY2Uoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJBdChwb3M6IG51bWJlcikge1xuICAgICAgICBpZiAoIXBvcykge1xuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5DdXRTdHJpbmcocG9zLCBwb3MgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoYXJDb2RlQXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNoYXJDb2RlQXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvZGVQb2ludEF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJBdChwb3MpLk9uZVN0cmluZy5jb2RlUG9pbnRBdCgwKTtcbiAgICB9XG5cbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgICAgICBjaGFyLkRhdGFBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgeWllbGQgY2hhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMaW5lKGxpbmU6IG51bWJlciwgc3RhcnRGcm9tT25lID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCgnXFxuJylbbGluZSAtICtzdGFydEZyb21PbmVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZlcnQgdWZ0LTE2IGxlbmd0aCB0byBjb3VudCBvZiBjaGFyc1xuICAgICAqIEBwYXJhbSBpbmRleCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYXJMZW5ndGgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgaW5kZXggLT0gY2hhci50ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5kZXhPZih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckxlbmd0aCh0aGlzLk9uZVN0cmluZy5pbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdEluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcubGFzdEluZGV4T2YodGV4dCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5pY29kZU1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGEgKz0gXCJcXFxcdVwiICsgKFwiMDAwXCIgKyB2LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHN0cmluZyBhcyB1bmljb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bmljb2RlKCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLkRhdGFBcnJheSkge1xuICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcih0aGlzLnVuaWNvZGVNZShpLnRleHQpLCBpLmluZm8sIGkubGluZSwgaS5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaChyZWdleDogUmVnRXhwIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuc2VhcmNoKHJlZ2V4KSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0c1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5zdGFydHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRzV2l0aChzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmVuZHNXaXRoKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmNsdWRlcyhzZWFyY2g6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nLmluY2x1ZGVzKHNlYXJjaCwgcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0cmluZy5EYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBuZXdTdHJpbmcuRGF0YUFycmF5W2ldO1xuXG4gICAgICAgICAgICBpZiAoZS50ZXh0LnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUudGV4dCA9IGUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1MZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbUVuZCgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBuZXdTdHJpbmcuc2V0RGVmYXVsdCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyaW1TdGFydCgpLnRyaW1FbmQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgU3BhY2VPbmUoYWRkSW5zaWRlPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hdCgwKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5DbG9uZSgpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc3RhcnQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEJlZm9yZShhZGRJbnNpZGUgfHwgc3RhcnQuZXEsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBzdGFydC5EZWZhdWx0SW5mb1RleHQubGluZSwgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZC5lcSkge1xuICAgICAgICAgICAgY29weS5BZGRUZXh0QWZ0ZXIoYWRkSW5zaWRlIHx8IGVuZC5lcSwgZW5kLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBlbmQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIGVuZC5EZWZhdWx0SW5mb1RleHQuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFjdGlvblN0cmluZyhBY3Q6ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIG5ld1N0cmluZy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGkudGV4dCA9IEFjdChpLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVMb3dlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvY2FsZVVwcGVyQ2FzZShsb2NhbGVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9ybWFsaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLm5vcm1hbGl6ZSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFN0cmluZ0luZGV4ZXIocmVnZXg6IFJlZ0V4cCB8IHN0cmluZywgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdJbmRleGVySW5mb1tdIHtcbiAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsIHJlZ2V4LmZsYWdzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU3BsaXQ6IFN0cmluZ0luZGV4ZXJJbmZvW10gPSBbXTtcblxuICAgICAgICBsZXQgbWFpblRleHQgPSB0aGlzLk9uZVN0cmluZywgaGFzTWF0aDogUmVnRXhwTWF0Y2hBcnJheSA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KSwgYWRkTmV4dCA9IDAsIGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgdGhpc1N1YnN0cmluZyA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzU3Vic3RyaW5nLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXNTdWJzdHJpbmcgPSB0aGlzU3Vic3RyaW5nLkN1dFN0cmluZyhpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICBhZGROZXh0ICs9IGluZGV4ICsgbGVuZ3RoO1xuXG4gICAgICAgICAgICBoYXNNYXRoID0gbWFpblRleHQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbFNwbGl0O1xuICAgIH1cblxuICAgIHByaXZhdGUgUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVHJhY2tlcignbicsIHNlYXJjaFZhbHVlKS51bmljb2RlLmVxO1xuICAgIH1cblxuICAgIHB1YmxpYyBzcGxpdChzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCwgbGltaXQ/OiBudW1iZXIpOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHRoaXMuUmVnZXhJblN0cmluZyhzZXBhcmF0b3IpLCBsaW1pdCk7XG4gICAgICAgIGNvbnN0IG5ld1NwbGl0OiBTdHJpbmdUcmFja2VyW10gPSBbXTtcblxuICAgICAgICBsZXQgbmV4dGN1dCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCkpO1xuICAgICAgICAgICAgbmV4dGN1dCA9IGkuaW5kZXggKyBpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1NwbGl0LnB1c2godGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTcGxpdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwZWF0KGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZSh0aGlzLkNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBqb2luKGFycjogU3RyaW5nVHJhY2tlcltdKXtcbiAgICAgICAgbGV0IGFsbCA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG4gICAgICAgIGZvcihjb25zdCBpIG9mIGFycil7XG4gICAgICAgICAgICBhbGwuQWRkQ2xvbmUoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VXaXRoVGltZXMoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nLCBsaW1pdD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbGxTcGxpdGVkID0gdGhpcy5TdHJpbmdJbmRleGVyKHNlYXJjaFZhbHVlLCBsaW1pdCk7XG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSBuZXcgU3RyaW5nVHJhY2tlcigpO1xuXG4gICAgICAgIGxldCBuZXh0Y3V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGFsbFNwbGl0ZWQpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZyA9IG5ld1N0cmluZy5DbG9uZVBsdXMoXG4gICAgICAgICAgICAgICAgdGhpcy5DdXRTdHJpbmcobmV4dGN1dCwgaS5pbmRleCksXG4gICAgICAgICAgICAgICAgcmVwbGFjZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBuZXh0Y3V0ID0gaS5pbmRleCArIGkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3U3RyaW5nLkFkZENsb25lKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSwgc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgPyB1bmRlZmluZWQgOiAxKVxuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlcihzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gU3RyaW5nVHJhY2tlcikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVwbGFjZXJBc3luYyhzZWFyY2hWYWx1ZTogUmVnRXhwLCBmdW5jOiAoZGF0YTogQXJyYXlNYXRjaCkgPT4gUHJvbWlzZTxTdHJpbmdUcmFja2VyPikge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMuQ2xvbmUoKSwgU3BsaXRUb1JlcGxhY2U6IEFycmF5TWF0Y2g7XG4gICAgICAgIGZ1bmN0aW9uIFJlTWF0Y2goKSB7XG4gICAgICAgICAgICBTcGxpdFRvUmVwbGFjZSA9IGNvcHkubWF0Y2goc2VhcmNoVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlTWF0Y2goKTtcblxuICAgICAgICBjb25zdCBuZXdUZXh0ID0gbmV3IFN0cmluZ1RyYWNrZXIoY29weS5TdGFydEluZm8pO1xuXG4gICAgICAgIHdoaWxlIChTcGxpdFRvUmVwbGFjZSkge1xuICAgICAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkuc3Vic3RyaW5nKDAsIFNwbGl0VG9SZXBsYWNlLmluZGV4KSk7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoYXdhaXQgZnVuYyhTcGxpdFRvUmVwbGFjZSkpO1xuXG4gICAgICAgICAgICBjb3B5ID0gY29weS5zdWJzdHJpbmcoU3BsaXRUb1JlcGxhY2UuaW5kZXggKyBTcGxpdFRvUmVwbGFjZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgUmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1RleHQuUGx1cyhjb3B5KTtcblxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZUFsbChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGhUaW1lcyh0aGlzLlJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWUpLCByZXBsYWNlVmFsdWUpXG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHApOiBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBjb25zdCBhbGxNYXRjaHMgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUpO1xuICAgICAgICBjb25zdCBtYXRoQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsTWF0Y2hzKSB7XG4gICAgICAgICAgICBtYXRoQXJyYXkucHVzaCh0aGlzLnN1YnN0cihpLmluZGV4LCBpLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGhBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2goc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IEFycmF5TWF0Y2ggfCBTdHJpbmdUcmFja2VyW10ge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgc2VhcmNoVmFsdWUuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEFsbChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5PbmVTdHJpbmcubWF0Y2goc2VhcmNoVmFsdWUpO1xuXG4gICAgICAgIGlmIChmaW5kID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IFJlc3VsdEFycmF5OiBBcnJheU1hdGNoID0gW107XG5cbiAgICAgICAgUmVzdWx0QXJyYXlbMF0gPSB0aGlzLnN1YnN0cihmaW5kLmluZGV4LCBmaW5kLnNoaWZ0KCkubGVuZ3RoKTtcbiAgICAgICAgUmVzdWx0QXJyYXkuaW5kZXggPSBmaW5kLmluZGV4O1xuICAgICAgICBSZXN1bHRBcnJheS5pbnB1dCA9IHRoaXMuQ2xvbmUoKTtcblxuICAgICAgICBsZXQgbmV4dE1hdGggPSBSZXN1bHRBcnJheVswXS5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBmaW5kKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKGkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZSA9IGZpbmRbaV07XG5cbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKDxhbnk+ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IG5leHRNYXRoLmluZGV4T2YoZSk7XG4gICAgICAgICAgICBSZXN1bHRBcnJheS5wdXNoKG5leHRNYXRoLnN1YnN0cihmaW5kSW5kZXgsIGUubGVuZ3RoKSk7XG4gICAgICAgICAgICBuZXh0TWF0aCA9IG5leHRNYXRoLnN1YnN0cmluZyhmaW5kSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc3VsdEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0SW5mbyh0eXBlID0gJzxsaW5lPicpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5EZWZhdWx0SW5mb1RleHQuaW5mby5zcGxpdCh0eXBlKS5wb3AoKS50cmltKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IGVycm9yIGluZm8gZm9ybSBlcnJvciBtZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIGRlYnVnTGluZSh7IG1lc3NhZ2UsIHRleHQsIGxvY2F0aW9uLCBsaW5lLCBjb2x9OiB7IG1lc3NhZ2U/OiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcsIGxvY2F0aW9uPzogeyBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBsaW5lVGV4dD86IHN0cmluZyB9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXJ9KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUobGluZSA/PyBsb2NhdGlvbj8ubGluZSA/PyAxKSwgY29sdW1uID0gY29sID8/IGxvY2F0aW9uPy5jb2x1bW4gPz8gMDtcbiAgICAgICAgaWYgKHNlYXJjaExpbmUuc3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgICAgICAgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZSgobGluZSA/PyBsb2NhdGlvbj8ubGluZSkgLSAxKTtcbiAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHNlYXJjaExpbmUuYXQoY29sdW1uLTEpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgcmV0dXJuIGAke3RleHQgfHwgbWVzc2FnZX0sIG9uIGZpbGUgLT5cXG4ke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoK3NlYXJjaExpbmUuZXh0cmFjdEluZm8oKX06JHtkYXRhLmxpbmV9OiR7ZGF0YS5jaGFyfSR7bG9jYXRpb24/LmxpbmVUZXh0ID8gJ1xcbkxpbmU6IFwiJyArIGxvY2F0aW9uLmxpbmVUZXh0LnRyaW0oKSArICdcIic6ICcnfWA7XG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1dpdGhUYWNrKGZ1bGxTYXZlTG9jYXRpb246IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBvdXRwdXRXaXRoTWFwKHRoaXMsIGZ1bGxTYXZlTG9jYXRpb24pXG4gICAgfVxuXG4gICAgcHVibGljIFN0cmluZ1RhY2soZnVsbFNhdmVMb2NhdGlvbjogc3RyaW5nLCBodHRwU291cmNlPzogYm9vbGVhbiwgcmVsYXRpdmU/OiBib29sZWFuKXtcbiAgICAgICAgcmV0dXJuIG91dHB1dE1hcCh0aGlzLCBmdWxsU2F2ZUxvY2F0aW9uLCBodHRwU291cmNlLCByZWxhdGl2ZSlcbiAgICB9XG59IiwgImV4cG9ydCBpbnRlcmZhY2UgUHJldmVudExvZyB7XG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGVycm9yTmFtZTogc3RyaW5nLFxuICAgIHR5cGU/OiBcIndhcm5cIiB8IFwiZXJyb3JcIlxufVxuXG5leHBvcnQgY29uc3QgU2V0dGluZ3M6IHtQcmV2ZW50RXJyb3JzOiBzdHJpbmdbXX0gPSB7XG4gICAgUHJldmVudEVycm9yczogW11cbn1cblxuY29uc3QgUHJldmVudERvdWJsZUxvZzogc3RyaW5nW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IENsZWFyV2FybmluZyA9ICgpID0+IFByZXZlbnREb3VibGVMb2cubGVuZ3RoID0gMDtcblxuLyoqXG4gKiBJZiB0aGUgZXJyb3IgaXMgbm90IGluIHRoZSBQcmV2ZW50RXJyb3JzIGFycmF5LCBwcmludCB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7UHJldmVudExvZ30gIC0gYGlkYCAtIFRoZSBpZCBvZiB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdQcmludCh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgICAgIHJldHVybiBbdHlwZSA9PSAnZXJyb3InID8gJ2ltcG9ydGFudCc6IHR5cGUsICh0ZXh0LnJlcGxhY2UoLzxsaW5lPi9naSwgJyAtPiAnKSArIGBcXG5cXG5FcnJvci1Db2RlOiAke2Vycm9yTmFtZX1cXG5cXG5gKV07XG4gICAgfVxuICAgIHJldHVybiBbXCJkby1ub3RoaW5nXCJdXG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1pbkNzcyhjb2RlOiBzdHJpbmcpe1xuICAgIHdoaWxlKGNvZGUuaW5jbHVkZXMoJyAgJykpe1xuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKC8gezJ9L2dpLCAnICcpO1xuICAgIH1cblxuICAgIC8vcmVtb3Zpbmcgc3BhY2VzXG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFxyXFxufFxcbi9naSwgJycpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLywgL2dpLCAnLCcpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLzogL2dpLCAnOicpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLyBcXHsvZ2ksICd7Jyk7XG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFx7IC9naSwgJ3snKTtcbiAgICBjb2RlID0gY29kZS5yZXBsYWNlKC87IC9naSwgJzsnKTtcblxuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1xcL1xcKi4qP1xcKlxcLy9nbXMsICcnKTsgLy8gcmVtb3ZlIGNvbW1lbnRzXG5cbiAgICByZXR1cm4gY29kZS50cmltKCk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IFN0cmluZ051bWJlck1hcCwgQnVpbGRJbkNvbXBvbmVudCwgQnVpbGRTY3JpcHRXaXRob3V0TW9kdWxlIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9Db21waWxlVHlwZXMnO1xuaW1wb3J0IG1hcmtkb3duIGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IGhsanMgZnJvbSAnaGlnaGxpZ2h0LmpzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1ByaW50IH0gZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvUHJpbnROZXcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uLy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQgeyBCYXNpY1NldHRpbmdzLCBnZXRUeXBlcywgd29ya2luZ0RpcmVjdG9yeSB9IGZyb20gJy4uLy4uL1J1blRpbWVCdWlsZC9TZWFyY2hGaWxlU3lzdGVtJztcbmltcG9ydCBhbmNob3IgZnJvbSAnbWFya2Rvd24taXQtYW5jaG9yJztcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ0BzaW5kcmVzb3JodXMvc2x1Z2lmeSc7XG5pbXBvcnQgbWFya2Rvd25JdEF0dHJzIGZyb20gJ21hcmtkb3duLWl0LWF0dHJzJztcbmltcG9ydCBtYXJrZG93bkl0QWJiciBmcm9tICdtYXJrZG93bi1pdC1hYmJyJ1xuaW1wb3J0IE1pbkNzcyBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9Dc3NNaW5pbWl6ZXInO1xuaW1wb3J0IHsgU2Vzc2lvbkJ1aWxkIH0gZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvU2Vzc2lvbic7XG5pbXBvcnQgSW5zZXJ0Q29tcG9uZW50IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL0luc2VydENvbXBvbmVudCc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4uLy4uL091dHB1dElucHV0L0NvbnNvbGUnO1xuaW1wb3J0IFRhZ0RhdGFQYXJzZXIgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvWE1MSGVscGVycy9UYWdEYXRhUGFyc2VyJztcblxuZnVuY3Rpb24gY29kZVdpdGhDb3B5KG1kOiBhbnksIGljb246IHN0cmluZykge1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZShvcmlnUnVsZTogYW55KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdSZW5kZXJlZCA9IG9yaWdSdWxlKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY29kZS1jb3B5XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb3B5LWNsaXBib2FyZFwiIG9uY2xpY2s9XCJtYXJrZG93bkNvcHkodGhpcylcIj4ke2ljb259PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICR7b3JpZ1JlbmRlcmVkfVxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayk7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IFRhZ0RhdGFQYXJzZXIsIEJldHdlZW5UYWdEYXRhOiBTdHJpbmdUcmFja2VyLCBJbnNlcnRDb21wb25lbnQ6IEluc2VydENvbXBvbmVudCwgc2Vzc2lvbjogU2Vzc2lvbkJ1aWxkKTogUHJvbWlzZTxCdWlsZEluQ29tcG9uZW50PiB7XG4gICAgY29uc3QgbWFya0Rvd25QbHVnaW4gPSBJbnNlcnRDb21wb25lbnQuR2V0UGx1Z2luKCdtYXJrZG93bicpO1xuXG4gICAgXG4gICAgY29uc3QgaGxqc0NsYXNzID1kYXRhVGFnLnBvcEJvb2xlYW4oJ2hsanMtY2xhc3MnLCBtYXJrRG93blBsdWdpbj8uaGxqc0NsYXNzID8/IHRydWUpID8gJyBjbGFzcz1cImhsanNcIicgOiAnJztcblxuICAgIGxldCBoYXZlSGlnaGxpZ2h0ID0gZmFsc2U7XG4gICAgY29uc3QgbWQgPSBtYXJrZG93bih7XG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHhodG1sT3V0OiB0cnVlLFxuICAgICAgICBsaW5raWZ5OiBkYXRhVGFnLnBvcEJvb2xlYW4oJ2xpbmtpZnknLCBtYXJrRG93blBsdWdpbj8ubGlua2lmeSksXG4gICAgICAgIGJyZWFrczogZGF0YVRhZy5wb3BCb29sZWFuKCdicmVha3MnLCBtYXJrRG93blBsdWdpbj8uYnJlYWtzID8/IHRydWUpLFxuICAgICAgICB0eXBvZ3JhcGhlcjogZGF0YVRhZy5wb3BCb29sZWFuKCd0eXBvZ3JhcGhlcicsIG1hcmtEb3duUGx1Z2luPy50eXBvZ3JhcGhlciA/PyB0cnVlKSxcblxuICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAgICAgICAgICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICAgICAgICAgICAgICBoYXZlSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwcmUke2hsanNDbGFzc30+PGNvZGU+JHtobGpzLmhpZ2hsaWdodChzdHIsIHsgbGFuZ3VhZ2U6IGxhbmcsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pLnZhbHVlfTwvY29kZT48L3ByZT5gO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZnVuY05hbWUsIHByaW50VGV4dF0gPSBjcmVhdGVOZXdQcmludCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWFya2Rvd24tcGFyc2VyJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBwcmludFtmdW5jTmFtZV0ocHJpbnRUZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7bWQudXRpbHMuZXNjYXBlSHRtbChzdHIpfTwvY29kZT48L3ByZT5gO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb3B5ID0gZGF0YVRhZy5wb3BBbnlEZWZhdWx0KCdjb3B5LWNvZGUnLCBtYXJrRG93blBsdWdpbj8uY29weUNvZGUgPz8gJ1x1RDgzRFx1RENDQicpO1xuICAgIGlmIChjb3B5KVxuICAgICAgICBtZC51c2UoKG06YW55KT0+IGNvZGVXaXRoQ29weShtLCBjb3B5KSk7XG5cbiAgICBpZiAoZGF0YVRhZy5wb3BCb29sZWFuKCdoZWFkZXItbGluaycsIG1hcmtEb3duUGx1Z2luPy5oZWFkZXJMaW5rID8/IHRydWUpKVxuICAgICAgICBtZC51c2UoYW5jaG9yLCB7XG4gICAgICAgICAgICBzbHVnaWZ5OiAoczogYW55KSA9PiBzbHVnaWZ5KHMpLFxuICAgICAgICAgICAgcGVybWFsaW5rOiBhbmNob3IucGVybWFsaW5rLmhlYWRlckxpbmsoKVxuICAgICAgICB9KTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ2F0dHJzJywgbWFya0Rvd25QbHVnaW4/LmF0dHJzID8/IHRydWUpKVxuICAgICAgICBtZC51c2UobWFya2Rvd25JdEF0dHJzKTtcblxuICAgIGlmIChkYXRhVGFnLnBvcEJvb2xlYW4oJ2FiYnInLCBtYXJrRG93blBsdWdpbj8uYWJiciA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBYmJyKTtcblxuICAgIGxldCBtYXJrZG93bkNvZGUgPSBCZXR3ZWVuVGFnRGF0YT8uZXEgfHwgJyc7XG4gICAgY29uc3QgbG9jYXRpb24gPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ2ZpbGUnLCAnLi9tYXJrZG93bicpO1xuXG4gICAgaWYgKCFtYXJrZG93bkNvZGU/LnRyaW0/LigpICYmIGxvY2F0aW9uKSB7XG4gICAgICAgIGxldCBmaWxlUGF0aCA9IGxvY2F0aW9uWzBdID09ICcvJyA/IHBhdGguam9pbihnZXRUeXBlcy5TdGF0aWNbMl0sIGxvY2F0aW9uKTogcGF0aC5qb2luKHBhdGguZGlybmFtZSh0eXBlLmV4dHJhY3RJbmZvKCc8bGluZT4nKSksIGxvY2F0aW9uKTtcbiAgICAgICAgaWYgKCFwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKVxuICAgICAgICAgICAgZmlsZVBhdGggKz0gJy5zZXJ2Lm1kJ1xuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgICBtYXJrZG93bkNvZGUgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoZnVsbFBhdGgpOyAvL2dldCBtYXJrZG93biBmcm9tIGZpbGVcbiAgICAgICAgYXdhaXQgc2Vzc2lvbi5kZXBlbmRlbmNlKGZpbGVQYXRoLCBmdWxsUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJIVE1MID0gbWQucmVuZGVyKG1hcmtkb3duQ29kZSksIGJ1aWxkSFRNTCA9IG5ldyBTdHJpbmdUcmFja2VyKHR5cGUuRGVmYXVsdEluZm9UZXh0KTtcblxuICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgY3JlYXRlQXV0b1RoZW1lKGRhdGFUYWcucG9wU3RyaW5nKCdjb2RlLXRoZW1lJykgfHwgbWFya0Rvd25QbHVnaW4/LmNvZGVUaGVtZSB8fCAnYXRvbS1vbmUnKTtcblxuICAgIGlmIChoYXZlSGlnaGxpZ2h0KSB7XG4gICAgICAgIGlmKHRoZW1lICE9ICdub25lJyl7XG4gICAgICAgICAgICBjb25zdCBjc3NMaW5rID0gJy9zZXJ2L21kL2NvZGUtdGhlbWUvJyArIHRoZW1lICsgJy5jc3MnO1xuICAgICAgICAgICAgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKTtcbiAgICAgICAgfVxuICAgICAgICBpZihjb3B5KXtcbiAgICAgICAgICAgIHNlc3Npb24uc2NyaXB0KCcvc2Vydi9tZC5qcycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGF0YVRhZy5hZGRDbGFzcygnbWFya2Rvd24tYm9keScpO1xuXG4gICAgY29uc3Qgc3R5bGUgPSBkYXRhVGFnLnBvcEFueURlZmF1bHQoJ3RoZW1lJywgIG1hcmtEb3duUGx1Z2luPy50aGVtZSA/PyAnYXV0bycpO1xuICAgIGNvbnN0IGNzc0xpbmsgPSAnL3NlcnYvbWQvdGhlbWUvJyArIHN0eWxlICsgJy5jc3MnO1xuICAgIHN0eWxlICE9ICdub25lJyAmJiBzZXNzaW9uLnN0eWxlKGNzc0xpbmspXG5cbiAgICBidWlsZEhUTUwuUGx1cyRgPGRpdiR7ZGF0YVRhZy5yZWJ1aWxkU3BhY2UoKX0+JHtyZW5kZXJIVE1MfTwvZGl2PmA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogYnVpbGRIVE1MLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5jb25zdCB0aGVtZUFycmF5ID0gWycnLCAnLWRhcmsnLCAnLWxpZ2h0J107XG5jb25zdCB0aGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bic7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5TWFya2Rvd25UaGVtZSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgb2YgdGhlbWVBcnJheSkge1xuICAgICAgICBjb25zdCBtaW5pID0gKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGVtZVBhdGggKyBpICsgJy5jc3MnKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxuXFwubWFya2Rvd24tYm9keSB7KXwoXi5tYXJrZG93bi1ib2R5IHspL2dtLCAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCArICdwYWRkaW5nOjIwcHg7J1xuICAgICAgICAgICAgfSkgKyBgXG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdj5he1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDI1cHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgICAgICBib3R0b206IC03cHg7ICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk+ZGl2IHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOnJpZ2h0O1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk6aG92ZXI+ZGl2IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiBhOmZvY3VzIHtcbiAgICAgICAgICAgICAgICBjb2xvcjojNmJiODZhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBgO1xuICAgICAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKHRoZW1lUGF0aCArIGkgKyAnLm1pbi5jc3MnLCBNaW5Dc3MobWluaSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTdGFydCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKSB7XG4gICAgY29uc3QgW2JlZm9yZSwgYWZ0ZXIsIGxhc3RdID0gdGV4dDEuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKVxuICAgIGNvbnN0IGFkZEJlZm9yZSA9IHRleHQxW2JlZm9yZS5sZW5ndGhdID09ICd9JyA/ICd9JzogJyovJztcbiAgICByZXR1cm4gW2JlZm9yZSArYWRkQmVmb3JlLCAnLmhsanN7JyArIChsYXN0ID8/IGFmdGVyKSwgJy5obGpzeycgKyB0ZXh0Mi5zcGxpdCgvKH18XFwqXFwvKS5obGpzey8pLnBvcCgpXTtcbn1cblxuY29uc3QgY29kZVRoZW1lUGF0aCA9IHdvcmtpbmdEaXJlY3RvcnkgKyAnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXV0b1RoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXJrTGlnaHRTcGxpdCA9IHRoZW1lLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhcmtMaWdodFNwbGl0Lmxlbmd0aCA9PSAxKSByZXR1cm4gdGhlbWU7XG5cbiAgICBjb25zdCBuYW1lID0gZGFya0xpZ2h0U3BsaXRbMl0gfHwgZGFya0xpZ2h0U3BsaXQuc2xpY2UoMCwgMikuam9pbignficpLnJlcGxhY2UoJy8nLCAnLScpO1xuXG4gICAgaWYgKGF3YWl0IEVhc3lGcy5leGlzdHNGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnKSlcbiAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICBjb25zdCBsaWdodFRleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzBdICsgJy5jc3MnKTtcbiAgICBjb25zdCBkYXJrVGV4dCA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShjb2RlVGhlbWVQYXRoICsgZGFya0xpZ2h0U3BsaXRbMV0gKyAnLmNzcycpO1xuXG4gICAgY29uc3QgW3N0YXJ0LCBkYXJrLCBsaWdodF0gPSBzcGxpdFN0YXJ0KGRhcmtUZXh0LCBsaWdodFRleHQpO1xuICAgIGNvbnN0IGRhcmtMaWdodCA9IGAke3N0YXJ0fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXske2Rhcmt9fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpsaWdodCl7JHtsaWdodH19YDtcbiAgICBhd2FpdCBFYXN5RnMud3JpdGVGaWxlKGNvZGVUaGVtZVBhdGggKyBuYW1lICsgJy5jc3MnLCBkYXJrTGlnaHQpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9Db2RlVGhlbWUoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUF1dG9UaGVtZSgnYXRvbS1vbmUtbGlnaHR8YXRvbS1vbmUtZGFya3xhdG9tLW9uZScpXG59IiwgImltcG9ydCB7IGF1dG9Db2RlVGhlbWUsIG1pbmlmeU1hcmtkb3duVGhlbWUgfSBmcm9tIFwiLi4vQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93blwiO1xuYXdhaXQgbWluaWZ5TWFya2Rvd25UaGVtZSgpO1xuYXdhaXQgYXV0b0NvZGVUaGVtZSgpOyIsICJpbXBvcnQgeyBjaGRpciwgY3dkIH0gZnJvbSBcInByb2Nlc3NcIjtcbmNvbnN0IHBhdGhUaGlzID0gY3dkKCkuc3BsaXQoJy8nKTtcblxuZnVuY3Rpb24gY2hlY2tCYXNlKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAocGF0aFRoaXMuYXQoLWluZGV4KSA9PSAnbm9kZV9tb2R1bGVzJykge1xuICAgICAgICBjaGRpcignLi4vJy5yZXBlYXQoaW5kZXgpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmlmICghY2hlY2tCYXNlKDIpKVxuICAgIGNoZWNrQmFzZSgzKTtcblxuaW1wb3J0KCcuL2J1aWxkLXNjcmlwdHMuanMnKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxXQU1TO0FBTmI7QUFBQTtBQUFBLElBQUksWUFBWTtBQU1ULElBQU0sUUFBUSxJQUFJLE1BQU0sU0FBUTtBQUFBLE1BQ25DLElBQUksUUFBUSxNQUFNLFVBQVU7QUFDeEIsWUFBRyxRQUFRO0FBQ1AsaUJBQU8sT0FBTztBQUVsQixZQUFHLGFBQWEsUUFBUTtBQUNwQixpQkFBTyxPQUFPO0FBQ2xCLGVBQU8sTUFBTTtBQUFBLFFBQUM7QUFBQSxNQUNsQjtBQUFBLElBQ0osQ0FBQztBQUFBO0FBQUE7OztBQ2ZEO0FBRUE7QUFFQSxnQkFBZ0IsT0FBK0I7QUFDM0MsU0FBTyxJQUFJLFFBQVEsU0FBTztBQUN0QixPQUFHLEtBQUssT0FBTSxDQUFDLEtBQUssVUFBUztBQUN6QixVQUFJLFFBQVEsS0FBSSxDQUFDO0FBQUEsSUFDckIsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMO0FBUUEsY0FBYyxPQUFjLE9BQWdCLGFBQXVCLGVBQW1CLENBQUMsR0FBd0I7QUFDM0csU0FBTyxJQUFJLFFBQVEsU0FBTztBQUN0QixPQUFHLEtBQUssT0FBTSxDQUFDLEtBQUssVUFBUztBQUN6QixVQUFHLE9BQU8sQ0FBQyxhQUFZO0FBQ25CLGNBQU0sTUFBTSxHQUFHO0FBQUEsTUFDbkI7QUFDQSxVQUFJLFNBQVMsUUFBTSxNQUFLLFNBQVEsU0FBUSxZQUFZO0FBQUEsSUFDeEQsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMO0FBUUEsMEJBQTBCLE9BQWMsZUFBb0IsTUFBdUI7QUFDL0UsU0FBUSxPQUFNLEtBQUssT0FBTSxRQUFXLElBQUksR0FBRyxTQUFTLEtBQUs7QUFDN0Q7QUFPQSxlQUFlLE9BQStCO0FBQzFDLFNBQU8sSUFBSSxRQUFRLFNBQU87QUFDdEIsT0FBRyxNQUFNLE9B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QU0sZ0JBQWdCO0FBQzFELFFBQU0sWUFBWSxNQUFNLE9BQU8sV0FBVyxNQUFNLE1BQUs7QUFDckQsU0FBTyxDQUFDLFNBQVEsV0FBVyxXQUFZLFNBQVEsUUFBUSxXQUFXLE1BQU0sTUFBTSxnQkFBZ0IsRUFBRSxJQUFJLENBQUM7QUFDekc7QUFJQSwrQkFBK0IsT0FBZTtBQUMxQyxRQUFNLGlCQUFpQixNQUFNLE1BQU0sR0FBRztBQUN0QyxNQUFJLGVBQWUsVUFBVTtBQUFHLFdBQU87QUFFdkMsUUFBTSxPQUFPLGVBQWUsTUFBTSxlQUFlLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEVBQUUsUUFBUSxLQUFLLEdBQUc7QUFFdkYsTUFBSSxNQUFNLGVBQU8sV0FBVyxnQkFBZ0IsT0FBTyxNQUFNO0FBQ3JELFdBQU87QUFFWCxRQUFNLFlBQVksTUFBTSxlQUFPLFNBQVMsZ0JBQWdCLGVBQWUsS0FBSyxNQUFNO0FBQ2xGLFFBQU0sV0FBVyxNQUFNLGVBQU8sU0FBUyxnQkFBZ0IsZUFBZSxLQUFLLE1BQU07QUFFakYsUUFBTSxDQUFDLE9BQU8sTUFBTSxTQUFTLFdBQVcsVUFBVSxTQUFTO0FBQzNELFFBQU0sWUFBWSxHQUFHLDBDQUEwQywyQ0FBMkM7QUFDMUcsUUFBTSxlQUFPLFVBQVUsZ0JBQWdCLE9BQU8sUUFBUSxTQUFTO0FBRS9ELFNBQU87QUFDWDtBQUdPLHlCQUF5QjtBQUM1QixTQUFPLGdCQUFnQix1Q0FBdUM7QUFDbEU7QUF6TEEsSUE2SE0sWUFDQSxXQW1DQTtBQWpLTjtBQUFBO0FBQUE7QUFJQTtBQUVBO0FBQ0E7QUFLQTtBQUdBO0FBOEdBLElBQU0sYUFBYSxDQUFDLElBQUksU0FBUyxRQUFRO0FBQ3pDLElBQU0sWUFBWSxtQkFBbUI7QUFtQ3JDLElBQU0sZ0JBQWdCLG1CQUFtQjtBQUFBO0FBQUE7OztBQ2pLekM7QUFBQTtBQUFBO0FBQUE7QUFDQSxVQUFNLG9CQUFvQjtBQUMxQixVQUFNLGNBQWM7QUFBQTtBQUFBOzs7QUNGcEI7QUFDQSxJQUFNLFdBQVcsS0FBSSxFQUFFLE1BQU0sR0FBRztBQUVoQyxtQkFBbUIsT0FBZTtBQUM5QixNQUFJLFNBQVMsR0FBRyxDQUFDLEtBQUssS0FBSyxnQkFBZ0I7QUFDdkMsVUFBTSxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFFQSxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ1osWUFBVSxDQUFDO0FBRWY7IiwKICAibmFtZXMiOiBbXQp9Cg==
