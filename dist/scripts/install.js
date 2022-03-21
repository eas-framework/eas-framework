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
function exists(path3) {
  return new Promise((res) => {
    fs.stat(path3, (err, stat2) => {
      res(Boolean(stat2));
    });
  });
}
function stat(path3, filed, ignoreError, defaultValue = {}) {
  return new Promise((res) => {
    fs.stat(path3, (err, stat2) => {
      if (err && !ignoreError) {
        print.error(err);
      }
      res(filed && stat2 ? stat2[filed] : stat2 || defaultValue);
    });
  });
}
async function existsFile(path3, ifTrueReturn = true) {
  return (await stat(path3, null, true)).isFile?.() && ifTrueReturn;
}
function mkdir(path3) {
  return new Promise((res) => {
    fs.mkdir(path3, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function rmdir(path3) {
  return new Promise((res) => {
    fs.rmdir(path3, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
function unlink(path3) {
  return new Promise((res) => {
    fs.unlink(path3, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function unlinkIfExists(path3) {
  if (await exists(path3)) {
    return await unlink(path3);
  }
  return false;
}
function readdir(path3, options = {}) {
  return new Promise((res) => {
    fs.readdir(path3, options, (err, files) => {
      if (err) {
        print.error(err);
      }
      res(files || []);
    });
  });
}
async function mkdirIfNotExists(path3) {
  if (!await exists(path3))
    return await mkdir(path3);
  return false;
}
function writeFile(path3, content) {
  return new Promise((res) => {
    fs.writeFile(path3, content, (err) => {
      if (err) {
        print.error(err);
      }
      res(!err);
    });
  });
}
async function writeJsonFile(path3, content) {
  try {
    return await writeFile(path3, JSON.stringify(content));
  } catch (err) {
    print.error(err);
  }
  return false;
}
function readFile(path3, encoding = "utf8") {
  return new Promise((res) => {
    fs.readFile(path3, encoding, (err, data) => {
      if (err) {
        print.error(err);
      }
      res(data || "");
    });
  });
}
async function readJsonFile(path3, encoding) {
  try {
    return JSON.parse(await readFile(path3, encoding));
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

// src/EasyDebug/StringTracker.ts
var StringTracker;
var init_StringTracker = __esm({
  "src/EasyDebug/StringTracker.ts"() {
    init_SearchFileSystem();
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
          nextMath = nextMath.substring(findIndex + e.length);
        }
        return ResultArray;
      }
      toString() {
        return this.OneString;
      }
      extractInfo(type = "<line>") {
        return this.DefaultInfoText.info.split(type).pop().trim();
      }
      debugLine({ message, loc, line, col, sassStack }) {
        if (sassStack) {
          const loc2 = sassStack.match(/[0-9]+:[0-9]+/)[0].split(":").map((x) => Number(x));
          line = loc2[0];
          col = loc2[1];
        }
        let searchLine = this.getLine(line ?? loc?.line ?? 1), column = col ?? loc?.column ?? 0;
        if (searchLine.startsWith("//")) {
          searchLine = this.getLine((line ?? loc?.line) - 1);
          column = 0;
        }
        const data = searchLine.DefaultInfoText;
        return `${message}, on file -> ${BasicSettings.fullWebSitePath}${data.info.split("<line>").shift()}:${data.line}:${column}`;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL091dHB1dElucHV0L0NvbnNvbGUudHMiLCAiLi4vLi4vc3JjL091dHB1dElucHV0L0Vhc3lGcy50cyIsICIuLi8uLi9zcmMvUnVuVGltZUJ1aWxkL1NlYXJjaEZpbGVTeXN0ZW0udHMiLCAiLi4vLi4vc3JjL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyLnRzIiwgIi4uLy4uL3NyYy9CdWlsZEluQ29tcG9uZW50cy9Db21wb25lbnRzL3NlcnYtY29ubmVjdC9pbmRleC50cyIsICIuLi8uLi9zcmMvT3V0cHV0SW5wdXQvUHJpbnROZXcudHMiLCAiLi4vLi4vc3JjL0NvbXBpbGVDb2RlL0Nzc01pbmltaXplci50cyIsICIuLi8uLi9zcmMvQnVpbGRJbkNvbXBvbmVudHMvQ29tcG9uZW50cy9tYXJrZG93bi50cyIsICIuLi8uLi9zcmMvc2NyaXB0cy9idWlsZC1zY3JpcHRzLnRzIiwgIi4uLy4uL3NyYy9zY3JpcHRzL2luc3RhbGwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImxldCBwcmludE1vZGUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dQcmludChkOiBib29sZWFuKSB7XG4gICAgcHJpbnRNb2RlID0gZDtcbn1cblxuZXhwb3J0IGNvbnN0IHByaW50ID0gbmV3IFByb3h5KGNvbnNvbGUse1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmKHByaW50TW9kZSlcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgIH1cbn0pOyIsICJpbXBvcnQgZnMsIHtEaXJlbnQsIFN0YXRzfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJy4vQ29uc29sZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgcmVzKEJvb2xlYW4oc3RhdCkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7cGF0aCBvZiB0aGUgZmlsZX0gcGF0aCBcbiAqIEBwYXJhbSB7ZmlsZWQgdG8gZ2V0IGZyb20gdGhlIHN0YXQgb2JqZWN0fSBmaWxlZCBcbiAqIEByZXR1cm5zIHRoZSBmaWxlZFxuICovXG5mdW5jdGlvbiBzdGF0KHBhdGg6IHN0cmluZywgZmlsZWQ/OiBzdHJpbmcsIGlnbm9yZUVycm9yPzogYm9vbGVhbiwgZGVmYXVsdFZhbHVlOmFueSA9IHt9KTogUHJvbWlzZTxTdGF0cyB8IGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnN0YXQocGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyICYmICFpZ25vcmVFcnJvcil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlZCAmJiBzdGF0PyBzdGF0W2ZpbGVkXTogc3RhdCB8fCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgZmlsZSBleGlzdHMsIHJldHVybiB0cnVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHthbnl9IFtpZlRydWVSZXR1cm49dHJ1ZV0gLSBhbnkgPSB0cnVlXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4aXN0c0ZpbGUocGF0aDogc3RyaW5nLCBpZlRydWVSZXR1cm46IGFueSA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiAoYXdhaXQgc3RhdChwYXRoLCBudWxsLCB0cnVlKSkuaXNGaWxlPy4oKSAmJiBpZlRydWVSZXR1cm47XG59XG5cbi8qKlxuICogSXQgY3JlYXRlcyBhIGRpcmVjdG9yeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIG1rZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLm1rZGlyKHBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHJtZGlyYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcm1kaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMucm1kaXIocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzKCFlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBgdW5saW5rYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gdW5saW5rKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnVubGluayhwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgIHByaW50LmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMoIWVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGV4aXN0cywgZGVsZXRlIGl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSB0byBiZSB1bmxpbmtlZC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdW5saW5rSWZFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICBpZihhd2FpdCBleGlzdHMocGF0aCkpe1xuICAgICAgICByZXR1cm4gYXdhaXQgdW5saW5rKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogYHJlYWRkaXJgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbnMgb2JqZWN0LCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSB3YW50IHRvIHJlYWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHtcbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHJlYWRkaXIocGF0aDogc3RyaW5nLCBvcHRpb25zID0ge30pOiBQcm9taXNlPHN0cmluZ1tdIHwgQnVmZmVyW10gfCBEaXJlbnRbXT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRkaXIocGF0aCwgb3B0aW9ucywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhmaWxlcyB8fCBbXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIElmIHRoZSBwYXRoIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB5b3Ugd2FudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkaXJlY3Rvcnkgd2FzIGNyZWF0ZWQgb3Igbm90LlxuICovXG5hc3luYyBmdW5jdGlvbiBta2RpcklmTm90RXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgaWYoIWF3YWl0IGV4aXN0cyhwYXRoKSlcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1rZGlyKHBhdGgpO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIGZpbGUgdG8gdGhlIGZpbGUgc3lzdGVtXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHlvdSB3YW50IHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIHtzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHdyaXRlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6ICBzdHJpbmcgfCBOb2RlSlMuQXJyYXlCdWZmZXJWaWV3KTogUHJvbWlzZTxib29sZWFuPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzID0+IHtcbiAgICAgICAgZnMud3JpdGVGaWxlKHBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyghZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogYHdyaXRlSnNvbkZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGEgY29udGVudCBhbmQgd3JpdGVzIHRoZSBjb250ZW50IHRvIHRoZSBmaWxlIGF0XG4gKiB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB7YW55fSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gd3JpdGUgdG8gdGhlIGZpbGUuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdmFsdWUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSnNvbkZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgd3JpdGVGaWxlKHBhdGgsIEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBgcmVhZEZpbGVgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHBhdGggYW5kIGFuIG9wdGlvbmFsIGVuY29kaW5nIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gKiByZXNvbHZlcyB0byB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXQgdGhlIGdpdmVuIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZC5cbiAqIEBwYXJhbSBbZW5jb2Rpbmc9dXRmOF0gLSBUaGUgZW5jb2Rpbmcgb2YgdGhlIGZpbGUuIERlZmF1bHRzIHRvIHV0ZjguXG4gKiBAcmV0dXJucyBBIHByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlYWRGaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZyA9ICd1dGY4Jyk6IFByb21pc2U8c3RyaW5nfGFueT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgIGZzLnJlYWRGaWxlKHBhdGgsIDxhbnk+ZW5jb2RpbmcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICAgICAgcHJpbnQuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyhkYXRhIHx8IFwiXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJdCByZWFkcyBhIEpTT04gZmlsZSBhbmQgcmV0dXJucyB0aGUgcGFyc2VkIEpTT04gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgZmlsZSB5b3Ugd2FudCB0byByZWFkLlxuICogQHBhcmFtIHtzdHJpbmd9IFtlbmNvZGluZ10gLSBUaGUgZW5jb2RpbmcgdG8gdXNlIHdoZW4gcmVhZGluZyB0aGUgZmlsZS4gRGVmYXVsdHMgdG8gdXRmOC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZEpzb25GaWxlKHBhdGg6c3RyaW5nLCBlbmNvZGluZz86c3RyaW5nKTogUHJvbWlzZTxhbnk+e1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHJlYWRGaWxlKHBhdGgsIGVuY29kaW5nKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgICBwcmludC5lcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXRcbiAqIEBwYXJhbSBwIC0gVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBuZWVkcyB0byBiZSBjcmVhdGVkLlxuICogQHBhcmFtIFtiYXNlXSAtIFRoZSBiYXNlIHBhdGggdG8gdGhlIGZpbGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VQYXRoUmVhbChwOnN0cmluZywgYmFzZSA9ICcnKSB7XG4gICAgcCA9IHBhdGguZGlybmFtZShwKTtcblxuICAgIGlmICghYXdhaXQgZXhpc3RzKGJhc2UgKyBwKSkge1xuICAgICAgICBjb25zdCBhbGwgPSBwLnNwbGl0KC9cXFxcfFxcLy8pO1xuXG4gICAgICAgIGxldCBwU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGlmIChwU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHBTdHJpbmcgKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcFN0cmluZyArPSBpO1xuXG4gICAgICAgICAgICBhd2FpdCBta2RpcklmTm90RXhpc3RzKGJhc2UgKyBwU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy90eXBlc1xuZXhwb3J0IHtcbiAgICBEaXJlbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC4uLmZzLnByb21pc2VzLFxuICAgIGV4aXN0cyxcbiAgICBleGlzdHNGaWxlLFxuICAgIHN0YXQsXG4gICAgbWtkaXIsXG4gICAgbWtkaXJJZk5vdEV4aXN0cyxcbiAgICB3cml0ZUZpbGUsXG4gICAgd3JpdGVKc29uRmlsZSxcbiAgICByZWFkRmlsZSxcbiAgICByZWFkSnNvbkZpbGUsXG4gICAgcm1kaXIsXG4gICAgdW5saW5rLFxuICAgIHVubGlua0lmRXhpc3RzLFxuICAgIHJlYWRkaXIsXG4gICAgbWFrZVBhdGhSZWFsXG59IiwgImltcG9ydCB7RGlyZW50fSBmcm9tICdmcyc7XG5pbXBvcnQgRWFzeUZzIGZyb20gJy4uL091dHB1dElucHV0L0Vhc3lGcyc7XG5pbXBvcnQge2N3ZH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ZmlsZVVSTFRvUGF0aH0gZnJvbSAndXJsJ1xuXG5mdW5jdGlvbiBnZXREaXJuYW1lKHVybDogc3RyaW5nKXtcbiAgICByZXR1cm4gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgodXJsKSk7XG59XG5cbmNvbnN0IFN5c3RlbURhdGEgPSBwYXRoLmpvaW4oZ2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpLCAnL1N5c3RlbURhdGEnKTtcblxubGV0IFdlYlNpdGVGb2xkZXJfID0gXCJXZWJTaXRlXCI7XG5cbmNvbnN0IFN0YXRpY05hbWUgPSAnV1dXJywgTG9nc05hbWUgPSAnTG9ncycsIE1vZHVsZXNOYW1lID0gJ25vZGVfbW9kdWxlcyc7XG5cbmNvbnN0IFN0YXRpY0NvbXBpbGUgPSBTeXN0ZW1EYXRhICsgYC8ke1N0YXRpY05hbWV9Q29tcGlsZS9gO1xuY29uc3QgQ29tcGlsZUxvZ3MgPSBTeXN0ZW1EYXRhICsgYC8ke0xvZ3NOYW1lfUNvbXBpbGUvYDtcbmNvbnN0IENvbXBpbGVNb2R1bGUgPSBTeXN0ZW1EYXRhICsgYC8ke01vZHVsZXNOYW1lfUNvbXBpbGUvYDtcblxuY29uc3Qgd29ya2luZ0RpcmVjdG9yeSA9IGN3ZCgpICsgJy8nO1xuXG5mdW5jdGlvbiBHZXRGdWxsV2ViU2l0ZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LFdlYlNpdGVGb2xkZXJfLCAnLycpO1xufVxubGV0IGZ1bGxXZWJTaXRlUGF0aF8gPSBHZXRGdWxsV2ViU2l0ZVBhdGgoKTtcblxuZnVuY3Rpb24gR2V0U291cmNlKG5hbWUpIHtcbiAgICByZXR1cm4gIEdldEZ1bGxXZWJTaXRlUGF0aCgpICsgbmFtZSArICcvJ1xufVxuXG4vKiBBIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgcGF0aHMgb2YgdGhlIGZpbGVzIGluIHRoZSBwcm9qZWN0LiAqL1xuY29uc3QgZ2V0VHlwZXMgPSB7XG4gICAgU3RhdGljOiBbXG4gICAgICAgIEdldFNvdXJjZShTdGF0aWNOYW1lKSxcbiAgICAgICAgU3RhdGljQ29tcGlsZSxcbiAgICAgICAgU3RhdGljTmFtZVxuICAgIF0sXG4gICAgTG9nczogW1xuICAgICAgICBHZXRTb3VyY2UoTG9nc05hbWUpLFxuICAgICAgICBDb21waWxlTG9ncyxcbiAgICAgICAgTG9nc05hbWVcbiAgICBdLFxuICAgIG5vZGVfbW9kdWxlczogW1xuICAgICAgICBHZXRTb3VyY2UoJ25vZGVfbW9kdWxlcycpLFxuICAgICAgICBDb21waWxlTW9kdWxlLFxuICAgICAgICBNb2R1bGVzTmFtZVxuICAgIF0sXG4gICAgZ2V0IFtTdGF0aWNOYW1lXSgpe1xuICAgICAgICByZXR1cm4gZ2V0VHlwZXMuU3RhdGljO1xuICAgIH1cbn1cblxuY29uc3QgcGFnZVR5cGVzID0ge1xuICAgIHBhZ2U6IFwicGFnZVwiLFxuICAgIG1vZGVsOiBcIm1vZGVcIixcbiAgICBjb21wb25lbnQ6IFwiaW50ZVwiXG59XG5cblxuY29uc3QgQmFzaWNTZXR0aW5ncyA9IHtcbiAgICBwYWdlVHlwZXMsXG5cbiAgICBwYWdlVHlwZXNBcnJheTogW10sXG5cbiAgICBwYWdlQ29kZUZpbGU6IHtcbiAgICAgICAgcGFnZTogW3BhZ2VUeXBlcy5wYWdlK1wiLmpzXCIsIHBhZ2VUeXBlcy5wYWdlK1wiLnRzXCJdLFxuICAgICAgICBtb2RlbDogW3BhZ2VUeXBlcy5tb2RlbCtcIi5qc1wiLCBwYWdlVHlwZXMubW9kZWwrXCIudHNcIl0sXG4gICAgICAgIGNvbXBvbmVudDogW3BhZ2VUeXBlcy5jb21wb25lbnQrXCIuanNcIiwgcGFnZVR5cGVzLmNvbXBvbmVudCtcIi50c1wiXVxuICAgIH0sXG5cbiAgICBwYWdlQ29kZUZpbGVBcnJheTogW10sXG5cbiAgICBwYXJ0RXh0ZW5zaW9uczogWydzZXJ2JywgJ2FwaSddLFxuXG4gICAgUmVxRmlsZVR5cGVzOiB7XG4gICAgICAgIGpzOiBcInNlcnYuanNcIixcbiAgICAgICAgdHM6IFwic2Vydi50c1wiLFxuICAgICAgICAnYXBpLXRzJzogXCJhcGkuanNcIixcbiAgICAgICAgJ2FwaS1qcyc6IFwiYXBpLnRzXCJcbiAgICB9LFxuICAgIFJlcUZpbGVUeXBlc0FycmF5OiBbXSxcblxuICAgIGdldCBXZWJTaXRlRm9sZGVyKCkge1xuICAgICAgICByZXR1cm4gV2ViU2l0ZUZvbGRlcl87XG4gICAgfSxcbiAgICBnZXQgZnVsbFdlYlNpdGVQYXRoKCkge1xuICAgICAgICByZXR1cm4gZnVsbFdlYlNpdGVQYXRoXztcbiAgICB9LFxuICAgIHNldCBXZWJTaXRlRm9sZGVyKHZhbHVlKSB7XG4gICAgICAgIFdlYlNpdGVGb2xkZXJfID0gdmFsdWU7XG5cbiAgICAgICAgZnVsbFdlYlNpdGVQYXRoXyA9IEdldEZ1bGxXZWJTaXRlUGF0aCgpO1xuICAgICAgICBnZXRUeXBlcy5TdGF0aWNbMF0gPSBHZXRTb3VyY2UoU3RhdGljTmFtZSk7XG4gICAgICAgIGdldFR5cGVzLkxvZ3NbMF0gPSBHZXRTb3VyY2UoTG9nc05hbWUpO1xuICAgIH0sXG4gICAgZ2V0IHRzQ29uZmlnKCl7XG4gICAgICAgIHJldHVybiBmdWxsV2ViU2l0ZVBhdGhfICsgJ3RzY29uZmlnLmpzb24nOyBcbiAgICB9LFxuICAgIGFzeW5jIHRzQ29uZmlnRmlsZSgpIHtcbiAgICAgICAgaWYoYXdhaXQgRWFzeUZzLmV4aXN0c0ZpbGUodGhpcy50c0NvbmZpZykpe1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGlzLnRzQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVsYXRpdmUoZnVsbFBhdGg6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKGZ1bGxXZWJTaXRlUGF0aF8sIGZ1bGxQYXRoKVxuICAgIH1cbn1cblxuQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXNBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlVHlwZXMpO1xuQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGVBcnJheSA9IE9iamVjdC52YWx1ZXMoQmFzaWNTZXR0aW5ncy5wYWdlQ29kZUZpbGUpLmZsYXQoKTtcbkJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzQXJyYXkgPSBPYmplY3QudmFsdWVzKEJhc2ljU2V0dGluZ3MuUmVxRmlsZVR5cGVzKTtcblxuYXN5bmMgZnVuY3Rpb24gRGVsZXRlSW5EaXJlY3RvcnkocGF0aCkge1xuICAgIGNvbnN0IGFsbEluRm9sZGVyID0gYXdhaXQgRWFzeUZzLnJlYWRkaXIocGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgaSBvZiAoPERpcmVudFtdPmFsbEluRm9sZGVyKSkge1xuICAgICAgICBjb25zdCBuID0gaS5uYW1lO1xuICAgICAgICBpZiAoaS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoICsgbiArICcvJztcbiAgICAgICAgICAgIGF3YWl0IERlbGV0ZUluRGlyZWN0b3J5KGRpcik7XG4gICAgICAgICAgICBhd2FpdCBFYXN5RnMucm1kaXIoZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IEVhc3lGcy51bmxpbmsocGF0aCArIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIGdldERpcm5hbWUsXG4gICAgU3lzdGVtRGF0YSxcbiAgICB3b3JraW5nRGlyZWN0b3J5LFxuICAgIERlbGV0ZUluRGlyZWN0b3J5LFxuICAgIGdldFR5cGVzLFxuICAgIEJhc2ljU2V0dGluZ3Ncbn0iLCAiaW1wb3J0IHsgQmFzaWNTZXR0aW5ncyB9IGZyb20gXCIuLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ1RyYWNrZXJEYXRhSW5mbyB7XG4gICAgdGV4dD86IHN0cmluZyxcbiAgICBpbmZvOiBzdHJpbmcsXG4gICAgbGluZT86IG51bWJlcixcbiAgICBjaGFyPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTdHJpbmdJbmRleGVySW5mbyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5TWF0Y2ggZXh0ZW5kcyBBcnJheTxTdHJpbmdUcmFja2VyPiB7XG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgaW5wdXQ/OiBTdHJpbmdUcmFja2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmluZ1RyYWNrZXIge1xuICAgIHByaXZhdGUgRGF0YUFycmF5OiBTdHJpbmdUcmFja2VyRGF0YUluZm9bXSA9IFtdO1xuICAgIHB1YmxpYyBJbmZvVGV4dDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgT25MaW5lID0gMTtcbiAgICBwdWJsaWMgT25DaGFyID0gMTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gSW5mb1RleHQgdGV4dCBpbmZvIGZvciBhbGwgbmV3IHN0cmluZyB0aGF0IGFyZSBjcmVhdGVkIGluIHRoaXMgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKEluZm8/OiBzdHJpbmcgfCBTdHJpbmdUcmFja2VyRGF0YUluZm8sIHRleHQ/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBJbmZvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLkluZm9UZXh0ID0gSW5mbztcbiAgICAgICAgfSBlbHNlIGlmIChJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHQoSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgdGhpcy5BZGRGaWxlVGV4dCh0ZXh0LCB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0IGVtcHR5SW5mbygpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgY2hhcjogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldERlZmF1bHQoSW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0KSB7XG4gICAgICAgIHRoaXMuSW5mb1RleHQgPSBJbmZvLmluZm87XG4gICAgICAgIHRoaXMuT25MaW5lID0gSW5mby5saW5lO1xuICAgICAgICB0aGlzLk9uQ2hhciA9IEluZm8uY2hhcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGF0YUFycmF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGxhc3QgSW5mb1RleHRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IERlZmF1bHRJbmZvVGV4dCgpOiBTdHJpbmdUcmFja2VyRGF0YUluZm8ge1xuICAgICAgICBpZiAoIXRoaXMuRGF0YUFycmF5LmZpbmQoeCA9PiB4LmluZm8pICYmIHRoaXMuSW5mb1RleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiB0aGlzLkluZm9UZXh0LFxuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuT25MaW5lLFxuICAgICAgICAgICAgICAgIGNoYXI6IHRoaXMuT25DaGFyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXlbdGhpcy5EYXRhQXJyYXkubGVuZ3RoIC0gMV0gPz8gU3RyaW5nVHJhY2tlci5lbXB0eUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBJbmZvVGV4dCB0aGF0IGFyZSBzZXR0ZWQgb24gdGhlIGZpcnN0IEluZm9UZXh0XG4gICAgICovXG4gICAgZ2V0IFN0YXJ0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0YUFycmF5WzBdID8/IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgYXMgb25lIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0IE9uZVN0cmluZygpIHtcbiAgICAgICAgbGV0IGJpZ1N0cmluZyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGJpZ1N0cmluZyArPSBpLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmlnU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbGwgdGhlIHRleHQgc28geW91IGNhbiBjaGVjayBpZiBpdCBlcXVhbCBvciBub3RcbiAgICAgKiB1c2UgbGlrZSB0aGF0OiBteVN0cmluZy5lcSA9PSBcImNvb2xcIlxuICAgICAqL1xuICAgIGdldCBlcSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuT25lU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgaW5mbyBhYm91dCB0aGlzIHRleHRcbiAgICAgKi9cbiAgICBnZXQgbGluZUluZm8oKSB7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgY29uc3QgcyA9IGQuaW5mby5zcGxpdCgnPGxpbmU+Jyk7XG4gICAgICAgIHMucHVzaChCYXNpY1NldHRpbmdzLmZ1bGxXZWJTaXRlUGF0aCArIHMucG9wKCkpO1xuXG4gICAgICAgIHJldHVybiBgJHtzLmpvaW4oJzxsaW5lPicpfToke2QubGluZX06JHtkLmNoYXJ9YDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGxlbmd0aCBvZiB0aGUgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRhQXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIGNvcHkgb2YgdGhpcyBzdHJpbmcgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIENsb25lKCk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld0RhdGEuQWRkVGV4dEFmdGVyKGkudGV4dCwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBZGRDbG9uZShkYXRhOiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goLi4uZGF0YS5EYXRhQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdCh7XG4gICAgICAgICAgICBpbmZvOiBkYXRhLkluZm9UZXh0LFxuICAgICAgICAgICAgbGluZTogZGF0YS5PbkxpbmUsXG4gICAgICAgICAgICBjaGFyOiBkYXRhLk9uQ2hhclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gdGV4dCBhbnkgdGhpbmcgdG8gY29ubmVjdFxuICAgICAqIEByZXR1cm5zIGNvbm5jdGVkIHN0cmluZyB3aXRoIGFsbCB0aGUgdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uY2F0KC4uLnRleHQ6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgU3RyaW5nVHJhY2tlcikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZy5BZGRDbG9uZShpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkFkZFRleHRBZnRlcihTdHJpbmcoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKiBAcmV0dXJucyB0aGlzIHN0cmluZyBjbG9uZSBwbHVzIHRoZSBuZXcgZGF0YSBjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgQ2xvbmVQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIHJldHVybiBTdHJpbmdUcmFja2VyLmNvbmNhdCh0aGlzLkNsb25lKCksIC4uLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBzdHJpbmcgb3IgYW55IGRhdGEgdG8gdGhpcyBzdHJpbmdcbiAgICAgKiBAcGFyYW0gZGF0YSBjYW4gYmUgYW55IHRoaW5nXG4gICAgICogQHJldHVybnMgdGhpcyBzdHJpbmcgKG5vdCBuZXcgc3RyaW5nKVxuICAgICAqL1xuICAgIHB1YmxpYyBQbHVzKC4uLmRhdGE6IGFueVtdKTogU3RyaW5nVHJhY2tlciB7XG4gICAgICAgIGxldCBsYXN0aW5mbyA9IHRoaXMuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgbGFzdGluZm8gPSBpLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZENsb25lKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZFRleHRBZnRlcihTdHJpbmcoaSksIGxhc3RpbmZvLmluZm8sIGxhc3RpbmZvLmxpbmUsIGxhc3RpbmZvLmNoYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHN0cmlucyBvdCBvdGhlciBkYXRhIHdpdGggJ1RlbXBsYXRlIGxpdGVyYWxzJ1xuICAgICAqIHVzZWQgbGlrZSB0aGlzOiBteVN0cmluLiRQbHVzIGB0aGlzIHZlcnkke2Nvb2xTdHJpbmd9IWBcbiAgICAgKiBAcGFyYW0gdGV4dHMgYWxsIHRoZSBzcGxpdGVkIHRleHRcbiAgICAgKiBAcGFyYW0gdmFsdWVzIGFsbCB0aGUgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIFBsdXMkKHRleHRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiAoU3RyaW5nVHJhY2tlciB8IGFueSlbXSk6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBsZXQgbGFzdFZhbHVlOiBTdHJpbmdUcmFja2VyRGF0YUluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dDtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRoaXMuQWRkVGV4dEFmdGVyKHRleHQsIGxhc3RWYWx1ZT8uaW5mbywgbGFzdFZhbHVlPy5saW5lLCBsYXN0VmFsdWU/LmNoYXIpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRDbG9uZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWUuRGVmYXVsdEluZm9UZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRUZXh0QWZ0ZXIoU3RyaW5nKHZhbHVlKSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkFkZFRleHRBZnRlcih0ZXh0c1t0ZXh0cy5sZW5ndGggLSAxXSwgbGFzdFZhbHVlPy5pbmZvLCBsYXN0VmFsdWU/LmxpbmUsIGxhc3RWYWx1ZT8uY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgc3RyaW5nIHRvIGFkZFxuICAgICAqIEBwYXJhbSBhY3Rpb24gd2hlcmUgdG8gYWRkIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIGluZm8gaW5mbyB0aGUgY29tZSB3aXRoIHRoZSBzdHJpbmdcbiAgICAgKi9cbiAgICBwcml2YXRlIEFkZFRleHRBY3Rpb24odGV4dDogc3RyaW5nLCBhY3Rpb246IFwicHVzaFwiIHwgXCJ1bnNoaWZ0XCIsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvLCBMaW5lQ291bnQgPSAwLCBDaGFyQ291bnQgPSAxKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZTogU3RyaW5nVHJhY2tlckRhdGFJbmZvW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgWy4uLnRleHRdKSB7XG4gICAgICAgICAgICBkYXRhU3RvcmUucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvLFxuICAgICAgICAgICAgICAgIGxpbmU6IExpbmVDb3VudCxcbiAgICAgICAgICAgICAgICBjaGFyOiBDaGFyQ291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhckNvdW50Kys7XG5cbiAgICAgICAgICAgIGlmIChjaGFyID09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgTGluZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgQ2hhckNvdW50ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRGF0YUFycmF5W2FjdGlvbl0oLi4uZGF0YVN0b3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKmVuZCogb2YgdGhlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB0ZXh0IFxuICAgICAqIEBwYXJhbSBpbmZvIFxuICAgICAqL1xuICAgIHB1YmxpYyBBZGRUZXh0QWZ0ZXIodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInB1c2hcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCB0ZXh0IGF0IHRoZSAqZW5kKiBvZiB0aGUgc3RyaW5nIHdpdGhvdXQgdHJhY2tpbmdcbiAgICAgKiBAcGFyYW0gdGV4dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgQWRkVGV4dEFmdGVyTm9UcmFjayh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbzogJycsXG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBjaGFyOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgdGV4dCBhdCB0aGUgKnN0YXJ0KiBvZiB0aGUgc3RyaW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHVibGljIEFkZFRleHRCZWZvcmUodGV4dDogc3RyaW5nLCBpbmZvPzogc3RyaW5nLCBsaW5lPzogbnVtYmVyLCBjaGFyPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuQWRkVGV4dEFjdGlvbih0ZXh0LCBcInVuc2hpZnRcIiwgaW5mbywgbGluZSwgY2hhcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICogYWRkIHRleHQgYXQgdGhlICpzdGFydCogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHRleHQgXG4gKi9cbiAgICBwdWJsaWMgQWRkVGV4dEJlZm9yZU5vVHJhY2sodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIGNvcHkucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogY2hhcixcbiAgICAgICAgICAgICAgICBpbmZvOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIGNoYXI6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLkRhdGFBcnJheS51bnNoaWZ0KC4uLmNvcHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgVGV4dCBGaWxlIFRyYWNraW5nXG4gICAgICogQHBhcmFtIHRleHQgXG4gICAgICogQHBhcmFtIGluZm8gXG4gICAgICovXG4gICAgcHJpdmF0ZSBBZGRGaWxlVGV4dCh0ZXh0OiBzdHJpbmcsIGluZm8gPSB0aGlzLkRlZmF1bHRJbmZvVGV4dC5pbmZvKSB7XG4gICAgICAgIGxldCBMaW5lQ291bnQgPSAxLCBDaGFyQ291bnQgPSAxO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbLi4udGV4dF0pIHtcbiAgICAgICAgICAgIHRoaXMuRGF0YUFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICBsaW5lOiBMaW5lQ291bnQsXG4gICAgICAgICAgICAgICAgY2hhcjogQ2hhckNvdW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYXJDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY2hhciA9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIExpbmVDb3VudCsrO1xuICAgICAgICAgICAgICAgIENoYXJDb3VudCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzaW1wbGUgbWV0aG9mIHRvIGN1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGVuZCBcbiAgICAgKiBAcmV0dXJucyBuZXcgY3V0dGVkIHN0cmluZ1xuICAgICAqL1xuICAgIHByaXZhdGUgQ3V0U3RyaW5nKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpOiBTdHJpbmdUcmFja2VyIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIodGhpcy5TdGFydEluZm8pO1xuXG4gICAgICAgIG5ld1N0cmluZy5EYXRhQXJyYXkucHVzaCguLi50aGlzLkRhdGFBcnJheS5zbGljZShzdGFydCwgZW5kKSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHJpbmctbGlrZSBtZXRob2QsIG1vcmUgbGlrZSBqcyBjdXR0aW5nIHN0cmluZywgaWYgdGhlcmUgaXMgbm90IHBhcmFtZXRlcnMgaXQgY29tcGxldGUgdG8gMFxuICAgICAqL1xuICAgIHB1YmxpYyBzdWJzdHJpbmcoc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpc05hTihlbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLmFicyhlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmFOKHN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGguYWJzKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdWJzdHItbGlrZSBtZXRob2RcbiAgICAgKiBAcGFyYW0gc3RhcnQgXG4gICAgICogQHBhcmFtIGxlbmd0aCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3Vic3RyKHN0YXJ0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFN0cmluZ1RyYWNrZXIge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCBsZW5ndGggIT0gbnVsbCA/IGxlbmd0aCArIHN0YXJ0IDogbGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbGljZS1saWtlIG1ldGhvZFxuICAgICAqIEBwYXJhbSBzdGFydCBcbiAgICAgKiBAcGFyYW0gZW5kIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGljZShzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckF0KHBvczogbnVtYmVyKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLkN1dFN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hhckNvZGVBdChwb3M6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQocG9zKS5PbmVTdHJpbmcuY2hhckNvZGVBdCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29kZVBvaW50QXQocG9zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhckF0KHBvcykuT25lU3RyaW5nLmNvZGVQb2ludEF0KDApO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcbiAgICAgICAgICAgIGNoYXIuRGF0YUFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICB5aWVsZCBjaGFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldExpbmUobGluZTogbnVtYmVyLCBzdGFydEZyb21PbmUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0KCdcXG4nKVtsaW5lIC0gK3N0YXJ0RnJvbU9uZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29udmVydCB1ZnQtMTYgbGVuZ3RoIHRvIGNvdW50IG9mIGNoYXJzXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hhckxlbmd0aChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBpbmRleCAtPSBjaGFyLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGluZGV4T2YodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJMZW5ndGgodGhpcy5PbmVTdHJpbmcuaW5kZXhPZih0ZXh0KSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxhc3RJbmRleE9mKHRleHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLmxhc3RJbmRleE9mKHRleHQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gc3RyaW5nIGFzIHVuaWNvZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIHVuaWNvZGVNZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBhID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICAgICAgICBhICs9IFwiXFxcXHVcIiArIChcIjAwMFwiICsgdi5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoZSBzdHJpbmcgYXMgdW5pY29kZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdW5pY29kZSgpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gbmV3IFN0cmluZ1RyYWNrZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5EYXRhQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld1N0cmluZy5BZGRUZXh0QWZ0ZXIodGhpcy51bmljb2RlTWUoaS50ZXh0KSwgaS5pbmZvLCBpLmxpbmUsIGkuY2hhcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWFyY2gocmVnZXg6IFJlZ0V4cCB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyTGVuZ3RoKHRoaXMuT25lU3RyaW5nLnNlYXJjaChyZWdleCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydHNXaXRoKHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5PbmVTdHJpbmcuc3RhcnRzV2l0aChzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kc1dpdGgoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5lbmRzV2l0aChzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5jbHVkZXMoc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZy5pbmNsdWRlcyhzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpbVN0YXJ0KCkge1xuICAgICAgICBjb25zdCBuZXdTdHJpbmcgPSB0aGlzLkNsb25lKCk7XG4gICAgICAgIG5ld1N0cmluZy5zZXREZWZhdWx0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTdHJpbmcuRGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbmV3U3RyaW5nLkRhdGFBcnJheVtpXTtcblxuICAgICAgICAgICAgaWYgKGUudGV4dC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHJpbmcuRGF0YUFycmF5LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnRleHQgPSBlLnRleHQudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1FbmQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgbmV3U3RyaW5nLnNldERlZmF1bHQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gbmV3U3RyaW5nLkRhdGFBcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ld1N0cmluZy5EYXRhQXJyYXlbaV07XG5cbiAgICAgICAgICAgIGlmIChlLnRleHQudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyaW5nLkRhdGFBcnJheS5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS50ZXh0ID0gZS50ZXh0LnRyaW1FbmQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaW1SaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJpbUVuZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmltKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmltU3RhcnQoKS50cmltRW5kKCk7XG4gICAgfVxuXG4gICAgcHVibGljIFNwYWNlT25lKGFkZEluc2lkZT86IHN0cmluZykge1xuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuYXQoMCk7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuYXQodGhpcy5sZW5ndGggLSAxKTtcbiAgICAgICAgY29uc3QgY29weSA9IHRoaXMuQ2xvbmUoKS50cmltKCk7XG5cbiAgICAgICAgaWYgKHN0YXJ0LmVxKSB7XG4gICAgICAgICAgICBjb3B5LkFkZFRleHRCZWZvcmUoYWRkSW5zaWRlIHx8IHN0YXJ0LmVxLCBzdGFydC5EZWZhdWx0SW5mb1RleHQuaW5mbywgc3RhcnQuRGVmYXVsdEluZm9UZXh0LmxpbmUsIHN0YXJ0LkRlZmF1bHRJbmZvVGV4dC5jaGFyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQuZXEpIHtcbiAgICAgICAgICAgIGNvcHkuQWRkVGV4dEFmdGVyKGFkZEluc2lkZSB8fCBlbmQuZXEsIGVuZC5EZWZhdWx0SW5mb1RleHQuaW5mbywgZW5kLkRlZmF1bHRJbmZvVGV4dC5saW5lLCBlbmQuRGVmYXVsdEluZm9UZXh0LmNoYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBBY3Rpb25TdHJpbmcoQWN0OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3U3RyaW5nID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBuZXdTdHJpbmcuRGF0YUFycmF5KSB7XG4gICAgICAgICAgICBpLnRleHQgPSBBY3QoaS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHRvTG9jYWxlTG93ZXJDYXNlKGxvY2FsZXM/OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5BY3Rpb25TdHJpbmcocyA9PiBzLnRvTG9jYWxlTG93ZXJDYXNlKGxvY2FsZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb2NhbGVVcHBlckNhc2UobG9jYWxlcz86IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb2NhbGVVcHBlckNhc2UobG9jYWxlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1VwcGVyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy50b1VwcGVyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Mb3dlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkFjdGlvblN0cmluZyhzID0+IHMudG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWN0aW9uU3RyaW5nKHMgPT4gcy5ub3JtYWxpemUoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBTdHJpbmdJbmRleGVyKHJlZ2V4OiBSZWdFeHAgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKTogU3RyaW5nSW5kZXhlckluZm9bXSB7XG4gICAgICAgIGlmIChyZWdleCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4LCByZWdleC5mbGFncy5yZXBsYWNlKCdnJywgJycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbFNwbGl0OiBTdHJpbmdJbmRleGVySW5mb1tdID0gW107XG5cbiAgICAgICAgbGV0IG1haW5UZXh0ID0gdGhpcy5PbmVTdHJpbmcsIGhhc01hdGg6IFJlZ0V4cE1hdGNoQXJyYXkgPSBtYWluVGV4dC5tYXRjaChyZWdleCksIGFkZE5leHQgPSAwLCBjb3VudGVyID0gMDtcblxuICAgICAgICB3aGlsZSAoKGxpbWl0ID09IG51bGwgfHwgY291bnRlciA8IGxpbWl0KSAmJiBoYXNNYXRoPy5bMF0/Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gWy4uLmhhc01hdGhbMF1dLmxlbmd0aCwgaW5kZXggPSB0aGlzLmNoYXJMZW5ndGgoaGFzTWF0aC5pbmRleCk7XG4gICAgICAgICAgICBhbGxTcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXggKyBhZGROZXh0LFxuICAgICAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1haW5UZXh0ID0gbWFpblRleHQuc2xpY2UoaGFzTWF0aC5pbmRleCArIGhhc01hdGhbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgYWRkTmV4dCArPSBpbmRleCArIGxlbmd0aDtcblxuICAgICAgICAgICAgaGFzTWF0aCA9IG1haW5UZXh0Lm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxTcGxpdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFJlZ2V4SW5TdHJpbmcoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCkge1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RyYWNrZXIoJ24nLCBzZWFyY2hWYWx1ZSkudW5pY29kZS5lcTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3BsaXQoc2VwYXJhdG9yOiBzdHJpbmcgfCBSZWdFeHAsIGxpbWl0PzogbnVtYmVyKTogU3RyaW5nVHJhY2tlcltdIHtcbiAgICAgICAgY29uc3QgYWxsU3BsaXRlZCA9IHRoaXMuU3RyaW5nSW5kZXhlcih0aGlzLlJlZ2V4SW5TdHJpbmcoc2VwYXJhdG9yKSwgbGltaXQpO1xuICAgICAgICBjb25zdCBuZXdTcGxpdDogU3RyaW5nVHJhY2tlcltdID0gW107XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxTcGxpdGVkKSB7XG4gICAgICAgICAgICBuZXdTcGxpdC5wdXNoKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQsIGkuaW5kZXgpKTtcbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTcGxpdC5wdXNoKHRoaXMuQ3V0U3RyaW5nKG5leHRjdXQpKTtcblxuICAgICAgICByZXR1cm4gbmV3U3BsaXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGVhdChjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5ld1N0cmluZyA9IHRoaXMuQ2xvbmUoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZVdpdGhUaW1lcyhzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwLCByZXBsYWNlVmFsdWU6IFN0cmluZ1RyYWNrZXIgfCBzdHJpbmcsIGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFsbFNwbGl0ZWQgPSB0aGlzLlN0cmluZ0luZGV4ZXIoc2VhcmNoVmFsdWUsIGxpbWl0KTtcbiAgICAgICAgbGV0IG5ld1N0cmluZyA9IG5ldyBTdHJpbmdUcmFja2VyKCk7XG5cbiAgICAgICAgbGV0IG5leHRjdXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYWxsU3BsaXRlZCkge1xuICAgICAgICAgICAgbmV3U3RyaW5nID0gbmV3U3RyaW5nLkNsb25lUGx1cyhcbiAgICAgICAgICAgICAgICB0aGlzLkN1dFN0cmluZyhuZXh0Y3V0LCBpLmluZGV4KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG5leHRjdXQgPSBpLmluZGV4ICsgaS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdTdHJpbmcuQWRkQ2xvbmUodGhpcy5DdXRTdHJpbmcobmV4dGN1dCkpO1xuXG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2Uoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCwgcmVwbGFjZVZhbHVlOiBTdHJpbmdUcmFja2VyIHwgc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoVGltZXModGhpcy5SZWdleEluU3RyaW5nKHNlYXJjaFZhbHVlKSwgcmVwbGFjZVZhbHVlLCBzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IHVuZGVmaW5lZCA6IDEpXG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VyKHNlYXJjaFZhbHVlOiBSZWdFeHAsIGZ1bmM6IChkYXRhOiBBcnJheU1hdGNoKSA9PiBTdHJpbmdUcmFja2VyKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdGhpcy5DbG9uZSgpLCBTcGxpdFRvUmVwbGFjZTogQXJyYXlNYXRjaDtcbiAgICAgICAgZnVuY3Rpb24gUmVNYXRjaCgpIHtcbiAgICAgICAgICAgIFNwbGl0VG9SZXBsYWNlID0gY29weS5tYXRjaChzZWFyY2hWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVNYXRjaCgpO1xuXG4gICAgICAgIGNvbnN0IG5ld1RleHQgPSBuZXcgU3RyaW5nVHJhY2tlcihjb3B5LlN0YXJ0SW5mbyk7XG5cbiAgICAgICAgd2hpbGUgKFNwbGl0VG9SZXBsYWNlKSB7XG4gICAgICAgICAgICBuZXdUZXh0LlBsdXMoY29weS5zdWJzdHJpbmcoMCwgU3BsaXRUb1JlcGxhY2UuaW5kZXgpKTtcbiAgICAgICAgICAgIG5ld1RleHQuUGx1cyhmdW5jKFNwbGl0VG9SZXBsYWNlKSk7XG5cbiAgICAgICAgICAgIGNvcHkgPSBjb3B5LnN1YnN0cmluZyhTcGxpdFRvUmVwbGFjZS5pbmRleCArIFNwbGl0VG9SZXBsYWNlWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBSZU1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGV4dC5QbHVzKGNvcHkpO1xuXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBsYWNlQWxsKHNlYXJjaFZhbHVlOiBzdHJpbmcgfCBSZWdFeHAsIHJlcGxhY2VWYWx1ZTogU3RyaW5nVHJhY2tlciB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aFRpbWVzKHRoaXMuUmVnZXhJblN0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hBbGwoc2VhcmNoVmFsdWU6IHN0cmluZyB8IFJlZ0V4cCk6IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGNvbnN0IGFsbE1hdGNocyA9IHRoaXMuU3RyaW5nSW5kZXhlcihzZWFyY2hWYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1hdGhBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBhbGxNYXRjaHMpIHtcbiAgICAgICAgICAgIG1hdGhBcnJheS5wdXNoKHRoaXMuc3Vic3RyKGkuaW5kZXgsIGkubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0aEFycmF5O1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaChzZWFyY2hWYWx1ZTogc3RyaW5nIHwgUmVnRXhwKTogQXJyYXlNYXRjaCB8IFN0cmluZ1RyYWNrZXJbXSB7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoQWxsKHNlYXJjaFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLk9uZVN0cmluZy5tYXRjaChzZWFyY2hWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGZpbmQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgUmVzdWx0QXJyYXk6IEFycmF5TWF0Y2ggPSBbXTtcblxuICAgICAgICBSZXN1bHRBcnJheVswXSA9IHRoaXMuc3Vic3RyKGZpbmQuaW5kZXgsIGZpbmQuc2hpZnQoKS5sZW5ndGgpO1xuICAgICAgICBSZXN1bHRBcnJheS5pbmRleCA9IGZpbmQuaW5kZXg7XG4gICAgICAgIFJlc3VsdEFycmF5LmlucHV0ID0gdGhpcy5DbG9uZSgpO1xuXG4gICAgICAgIGxldCBuZXh0TWF0aCA9IFJlc3VsdEFycmF5WzBdLkNsb25lKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpIGluIGZpbmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihOdW1iZXIoaSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlID0gZmluZFtpXTtcblxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2goPGFueT5lKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmluZEluZGV4ID0gbmV4dE1hdGguaW5kZXhPZihlKTtcbiAgICAgICAgICAgIFJlc3VsdEFycmF5LnB1c2gobmV4dE1hdGguc3Vic3RyKGZpbmRJbmRleCwgZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIG5leHRNYXRoID0gbmV4dE1hdGguc3Vic3RyaW5nKGZpbmRJbmRleCArIGUubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZXN1bHRBcnJheTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk9uZVN0cmluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0cmFjdEluZm8odHlwZSA9ICc8bGluZT4nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGVmYXVsdEluZm9UZXh0LmluZm8uc3BsaXQodHlwZSkucG9wKCkudHJpbSgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBlcnJvciBpbmZvIGZvcm0gZXJyb3IgbWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBkZWJ1Z0xpbmUoeyBtZXNzYWdlLCBsb2MsIGxpbmUsIGNvbCwgc2Fzc1N0YWNrIH06IHsgc2Fzc1N0YWNrPzogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGxvYz86IHsgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciB9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXIgfSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChzYXNzU3RhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IGxvYyA9IHNhc3NTdGFjay5tYXRjaCgvWzAtOV0rOlswLTldKy8pWzBdLnNwbGl0KCc6JykubWFwKHggPT4gTnVtYmVyKHgpKTtcbiAgICAgICAgICAgIGxpbmUgPSBsb2NbMF07XG4gICAgICAgICAgICBjb2wgPSBsb2NbMV07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VhcmNoTGluZSA9IHRoaXMuZ2V0TGluZShsaW5lID8/IGxvYz8ubGluZSA/PyAxKSwgY29sdW1uID0gY29sID8/IGxvYz8uY29sdW1uID8/IDA7XG4gICAgICAgIGlmIChzZWFyY2hMaW5lLnN0YXJ0c1dpdGgoJy8vJykpIHtcbiAgICAgICAgICAgIHNlYXJjaExpbmUgPSB0aGlzLmdldExpbmUoKGxpbmUgPz8gbG9jPy5saW5lKSAtIDEpO1xuICAgICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gc2VhcmNoTGluZS5EZWZhdWx0SW5mb1RleHQ7XG4gICAgICAgIHJldHVybiBgJHttZXNzYWdlfSwgb24gZmlsZSAtPiAke0Jhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRofSR7ZGF0YS5pbmZvLnNwbGl0KCc8bGluZT4nKS5zaGlmdCgpfToke2RhdGEubGluZX06JHtjb2x1bW59YDtcbiAgICB9XG59IiwgImltcG9ydCB0eXBlIHsgdGFnRGF0YU9iamVjdEFycmF5fSBmcm9tICcuLi8uLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5cblxuY29uc3QgbnVtYmVycyA9IFsnbnVtYmVyJywgJ251bScsICdpbnRlZ2VyJywgJ2ludCddLCBib29sZWFucyA9IFsnYm9vbGVhbicsICdib29sJ107XG5jb25zdCBidWlsdEluQ29ubmVjdGlvbiA9IFsnZW1haWwnLCAnc3RyaW5nJywgJ3RleHQnLCAuLi5udW1iZXJzLCAuLi5ib29sZWFuc107XG5cbmNvbnN0IGVtYWlsVmFsaWRhdG9yID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLztcblxuXG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXggPSB7XG4gICAgXCJzdHJpbmctbGVuZ3RoLXJhbmdlXCI6IFtcbiAgICAgICAgL15bMC05XSstWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCctJykubWFwKHggPT4gTnVtYmVyKHgpKSxcbiAgICAgICAgKFttaW4sIG1heF0sIHRleHQ6IHN0cmluZykgPT4gdGV4dC5sZW5ndGggPj0gbWluICYmIHRleHQubGVuZ3RoIDw9IG1heCxcbiAgICAgICAgXCJzdHJpbmdcIlxuICAgIF0sXG4gICAgXCJudW1iZXItcmFuZ2VcIjogW1xuICAgICAgICAvXlswLTldKy4uWzAtOV0rJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCcuLicpLm1hcCh4ID0+IE51bWJlcih4KSksXG4gICAgICAgIChbbWluLCBtYXhdLCBudW06IG51bWJlcikgPT4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4LFxuICAgICAgICBcIm51bWJlclwiXG4gICAgXSxcbiAgICBcIm11bHRpcGxlLWNob2ljZS1zdHJpbmdcIjogW1xuICAgICAgICAvXnN0cmluZ3x0ZXh0K1sgXSo9PlsgXSooXFx8P1tefF0rKSskLyxcbiAgICAgICAgKHZhbGlkYXRvcjogc3RyaW5nKSA9PiB2YWxpZGF0b3Iuc3BsaXQoJz0+JykucG9wKCkuc3BsaXQoJ3wnKS5tYXAoeCA9PiBgXCIke3gudHJpbSgpLnJlcGxhY2UoL1wiL2dpLCAnXFxcXFwiJyl9XCJgKSxcbiAgICAgICAgKG9wdGlvbnM6IHN0cmluZ1tdLCB0ZXh0OiBzdHJpbmcpID0+IG9wdGlvbnMuaW5jbHVkZXModGV4dCksXG4gICAgICAgIFwic3RyaW5nXCJcbiAgICBdLFxuICAgIFwibXVsdGlwbGUtY2hvaWNlLW51bWJlclwiOiBbXG4gICAgICAgIC9ebnVtYmVyfG51bXxpbnRlZ2VyfGludCtbIF0qPT5bIF0qKFxcfD9bXnxdKykrJC8sXG4gICAgICAgICh2YWxpZGF0b3I6IHN0cmluZykgPT4gdmFsaWRhdG9yLnNwbGl0KCc9PicpLnBvcCgpLnNwbGl0KCd8JykubWFwKHggPT4gcGFyc2VGbG9hdCh4KSksXG4gICAgICAgIChvcHRpb25zOiBudW1iZXJbXSwgbnVtOiBudW1iZXIpID0+IG9wdGlvbnMuaW5jbHVkZXMobnVtKSxcbiAgICAgICAgXCJudW1iZXJcIlxuICAgIF1cbn07XG5cbmNvbnN0IGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycyA9IFsuLi5udW1iZXJzXTtcblxuZm9yKGNvbnN0IGkgaW4gYnVpbHRJbkNvbm5lY3Rpb25SZWdleCl7XG4gICAgY29uc3QgdHlwZSA9IGJ1aWx0SW5Db25uZWN0aW9uUmVnZXhbaV1bM107XG5cbiAgICBpZihidWlsdEluQ29ubmVjdGlvbk51bWJlcnMuaW5jbHVkZXModHlwZSkpXG4gICAgICAgIGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5wdXNoKGkpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVmFsdWVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG5cbiAgICBpZiAoYnVpbHRJbkNvbm5lY3Rpb24uaW5jbHVkZXModmFsdWUpKVxuICAgICAgICByZXR1cm4gYFtcIiR7dmFsdWV9XCJdYDtcblxuICAgIGZvciAoY29uc3QgW25hbWUsIFt0ZXN0LCBnZXRBcmdzXV0gb2YgT2JqZWN0LmVudHJpZXMoYnVpbHRJbkNvbm5lY3Rpb25SZWdleCkpXG4gICAgICAgIGlmICgoPFJlZ0V4cD50ZXN0KS50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiBgW1wiJHtuYW1lfVwiLCAkeyg8YW55PmdldEFyZ3MpKHZhbHVlKX1dYDtcblxuICAgIHJldHVybiBgWyR7dmFsdWV9XWA7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VWYWxpZGF0aW9uSlNPTihhcmdzOiBhbnlbXSwgdmFsaWRhdG9yQXJyYXk6IGFueVtdKTogUHJvbWlzZTxib29sZWFuIHwgc3RyaW5nW10+IHtcblxuICAgIGZvciAoY29uc3QgaSBpbiB2YWxpZGF0b3JBcnJheSkge1xuICAgICAgICBjb25zdCBbZWxlbWVudCwgLi4uZWxlbWVudEFyZ3NdID0gdmFsaWRhdG9yQXJyYXlbaV0sIHZhbHVlID0gYXJnc1tpXTtcbiAgICAgICAgbGV0IHJldHVybk5vdyA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBpc0RlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgY2FzZSAnbnVtJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICBjYXNlICdib29sJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgICAgY2FzZSAnaW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICAgICAgICByZXR1cm5Ob3cgPSAhZW1haWxWYWxpZGF0b3IudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGF2ZVJlZ2V4ID0gdmFsdWUgIT0gbnVsbCAmJiBidWlsdEluQ29ubmVjdGlvblJlZ2V4W2VsZW1lbnRdO1xuXG4gICAgICAgICAgICAgICAgaWYoaGF2ZVJlZ2V4KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWhhdmVSZWdleFsyXShlbGVtZW50QXJncywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybk5vdyA9IGVsZW1lbnQudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuTm93ID0gIWF3YWl0IGVsZW1lbnQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk5vdykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSBgZmFpbGVkIGF0ICR7aX0gZmlsZWQgLSAke2lzRGVmYXVsdCA/IHJldHVybk5vdyA6ICdleHBlY3RlZCAnICsgZWxlbWVudH1gO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50QXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaW5mbyArPSBgLCBhcmd1bWVudHM6ICR7SlNPTi5zdHJpbmdpZnkoZWxlbWVudEFyZ3MpfWA7XG5cbiAgICAgICAgICAgIGluZm8gKz0gYCwgaW5wdXQ6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBbaW5mbywgZWxlbWVudCwgZWxlbWVudEFyZ3MsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VWYWx1ZXMoYXJnczogYW55W10sIHZhbGlkYXRvckFycmF5OiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBwYXJzZWQgPSBbXTtcblxuXG4gICAgZm9yIChjb25zdCBpIGluIHZhbGlkYXRvckFycmF5KSB7XG4gICAgICAgIGNvbnN0IFtlbGVtZW50XSA9IHZhbGlkYXRvckFycmF5W2ldLCB2YWx1ZSA9IGFyZ3NbaV07XG5cbiAgICAgICAgaWYgKGJ1aWx0SW5Db25uZWN0aW9uTnVtYmVycy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHBhcnNlRmxvYXQodmFsdWUpKTtcblxuICAgICAgICBlbHNlIGlmIChib29sZWFucy5pbmNsdWRlcyhlbGVtZW50KSlcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcnNlZC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhOiB0YWdEYXRhT2JqZWN0QXJyYXksIGZpbmQ6IHN0cmluZywgZGVmYXVsdERhdGE6IGFueSA9IG51bGwpOiBzdHJpbmcgfCBudWxsIHwgYm9vbGVhbntcbiAgICBjb25zdCBoYXZlID0gZGF0YS5oYXZlKGZpbmQpLCB2YWx1ZSA9IGRhdGEucmVtb3ZlKGZpbmQpO1xuXG4gICAgaWYoaGF2ZSAmJiB2YWx1ZSAhPSAnZmFsc2UnKSByZXR1cm4gdmFsdWUgfHwgaGF2ZSAgICBcbiAgICBpZih2YWx1ZSA9PT0gJ2ZhbHNlJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYoIWhhdmUpIHJldHVybiBkZWZhdWx0RGF0YTtcblxuICAgIHJldHVybiB2YWx1ZTtcbn0iLCAiaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL0NvbnNvbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByZXZlbnRMb2cge1xuICAgIGlkPzogc3RyaW5nLFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBlcnJvck5hbWU6IHN0cmluZyxcbiAgICB0eXBlPzogXCJ3YXJuXCIgfCBcImVycm9yXCJcbn1cblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzOiB7UHJldmVudEVycm9yczogc3RyaW5nW119ID0ge1xuICAgIFByZXZlbnRFcnJvcnM6IFtdXG59XG5cbmNvbnN0IFByZXZlbnREb3VibGVMb2c6IHN0cmluZ1tdID0gW107XG5cbmV4cG9ydCBjb25zdCBDbGVhcldhcm5pbmcgPSAoKSA9PiBQcmV2ZW50RG91YmxlTG9nLmxlbmd0aCA9IDA7XG5cbi8qKlxuICogSWYgdGhlIGVycm9yIGlzIG5vdCBpbiB0aGUgUHJldmVudEVycm9ycyBhcnJheSwgcHJpbnQgdGhlIGVycm9yXG4gKiBAcGFyYW0ge1ByZXZlbnRMb2d9ICAtIGBpZGAgLSBUaGUgaWQgb2YgdGhlIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUHJpbnRJZk5ldyh7aWQsIHRleHQsIHR5cGUgPSBcIndhcm5cIiwgZXJyb3JOYW1lfTogUHJldmVudExvZykge1xuICAgIGlmKCFQcmV2ZW50RG91YmxlTG9nLmluY2x1ZGVzKGlkID8/IHRleHQpICYmICFTZXR0aW5ncy5QcmV2ZW50RXJyb3JzLmluY2x1ZGVzKGVycm9yTmFtZSkpe1xuICAgICAgICBwcmludFt0eXBlXSh0ZXh0LnJlcGxhY2UoLzxsaW5lPi9naSwgJyAtPiAnKSwgYFxcblxcbkVycm9yIGNvZGU6ICR7ZXJyb3JOYW1lfVxcblxcbmApO1xuICAgICAgICBQcmV2ZW50RG91YmxlTG9nLnB1c2goaWQgPz8gdGV4dCk7XG4gICAgfVxufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1pbkNzcyhjb2RlOiBzdHJpbmcpe1xuICAgIHdoaWxlKGNvZGUuaW5jbHVkZXMoJyAgJykpe1xuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKC8gezJ9L2dpLCAnICcpO1xuICAgIH1cblxuICAgIC8vcmVtb3Zpbmcgc3BhY2VzXG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFxyXFxufFxcbi9naSwgJycpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLywgL2dpLCAnLCcpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLzogL2dpLCAnOicpO1xuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoLyBcXHsvZ2ksICd7Jyk7XG4gICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFx7IC9naSwgJ3snKTtcbiAgICBjb2RlID0gY29kZS5yZXBsYWNlKC87IC9naSwgJzsnKTtcblxuICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1xcL1xcKi4qP1xcKlxcLy9nbXMsICcnKTsgLy8gcmVtb3ZlIGNvbW1lbnRzXG5cbiAgICByZXR1cm4gY29kZS50cmltKCk7XG59IiwgImltcG9ydCBTdHJpbmdUcmFja2VyIGZyb20gJy4uLy4uL0Vhc3lEZWJ1Zy9TdHJpbmdUcmFja2VyJztcbmltcG9ydCB7IHRhZ0RhdGFPYmplY3RBcnJheSwgU3RyaW5nTnVtYmVyTWFwLCBCdWlsZEluQ29tcG9uZW50LCBCdWlsZFNjcmlwdFdpdGhvdXRNb2R1bGUgfSBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9YTUxIZWxwZXJzL0NvbXBpbGVUeXBlcyc7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgaGxqcyBmcm9tICdoaWdobGlnaHQuanMnO1xuaW1wb3J0IHsgcGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbiB9IGZyb20gJy4vc2Vydi1jb25uZWN0L2luZGV4JztcbmltcG9ydCB7IFByaW50SWZOZXcgfSBmcm9tICcuLi8uLi9PdXRwdXRJbnB1dC9QcmludE5ldyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFYXN5RnMgZnJvbSAnLi4vLi4vT3V0cHV0SW5wdXQvRWFzeUZzJztcbmltcG9ydCB7IEJhc2ljU2V0dGluZ3MsIHdvcmtpbmdEaXJlY3RvcnkgfSBmcm9tICcuLi8uLi9SdW5UaW1lQnVpbGQvU2VhcmNoRmlsZVN5c3RlbSc7XG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcic7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICdAc2luZHJlc29yaHVzL3NsdWdpZnknO1xuaW1wb3J0IG1hcmtkb3duSXRBdHRycyBmcm9tICdtYXJrZG93bi1pdC1hdHRycyc7XG5pbXBvcnQgbWFya2Rvd25JdEFiYnIgZnJvbSAnbWFya2Rvd24taXQtYWJicidcbmltcG9ydCBNaW5Dc3MgZnJvbSAnLi4vLi4vQ29tcGlsZUNvZGUvQ3NzTWluaW1pemVyJztcbmltcG9ydCB7IFNlc3Npb25CdWlsZCB9IGZyb20gJy4uLy4uL0NvbXBpbGVDb2RlL1Nlc3Npb24nO1xuaW1wb3J0IEluc2VydENvbXBvbmVudCBmcm9tICcuLi8uLi9Db21waWxlQ29kZS9JbnNlcnRDb21wb25lbnQnO1xuXG5mdW5jdGlvbiBjb2RlV2l0aENvcHkobWQ6IGFueSkge1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZShvcmlnUnVsZTogYW55KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdSZW5kZXJlZCA9IG9yaWdSdWxlKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY29kZS1jb3B5XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb3B5LWNsaXBib2FyZFwiIG9uY2xpY2s9XCJuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0aGlzLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVyVGV4dClcIj5jb3B5PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICR7b3JpZ1JlbmRlcmVkfVxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IHJlbmRlckNvZGUobWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayk7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSByZW5kZXJDb2RlKG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gQnVpbGRDb2RlKHR5cGU6IFN0cmluZ1RyYWNrZXIsIGRhdGFUYWc6IHRhZ0RhdGFPYmplY3RBcnJheSwgQmV0d2VlblRhZ0RhdGE6IFN0cmluZ1RyYWNrZXIsIEluc2VydENvbXBvbmVudDogSW5zZXJ0Q29tcG9uZW50LCBzZXNzaW9uOiBTZXNzaW9uQnVpbGQpOiBQcm9taXNlPEJ1aWxkSW5Db21wb25lbnQ+IHtcbiAgICBjb25zdCBtYXJrRG93blBsdWdpbiA9IEluc2VydENvbXBvbmVudC5HZXRQbHVnaW4oJ21hcmtkb3duJyk7XG5cbiAgICBjb25zdCBobGpzQ2xhc3MgPSBwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdobGpzLWNsYXNzJywgbWFya0Rvd25QbHVnaW4/LmhsanNDbGFzcyA/PyB0cnVlKSA/ICcgY2xhc3M9XCJobGpzXCInIDogJyc7XG5cbiAgICBsZXQgaGF2ZUhpZ2hsaWdodCA9IGZhbHNlO1xuICAgIGNvbnN0IG1kID0gbWFya2Rvd24oe1xuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICB4aHRtbE91dDogdHJ1ZSxcbiAgICAgICAgbGlua2lmeTogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICdsaW5raWZ5JywgbWFya0Rvd25QbHVnaW4/LmxpbmtpZnkpKSxcbiAgICAgICAgYnJlYWtzOiBCb29sZWFuKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2JyZWFrcycsIG1hcmtEb3duUGx1Z2luPy5icmVha3MgPz8gdHJ1ZSkpLFxuICAgICAgICB0eXBvZ3JhcGhlcjogQm9vbGVhbihwYXJzZVRhZ0RhdGFTdHJpbmdCb29sZWFuKGRhdGFUYWcsICd0eXBvZ3JhcGhlcicsIG1hcmtEb3duUGx1Z2luPy50eXBvZ3JhcGhlciA/PyB0cnVlKSksXG5cbiAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoc3RyLCBsYW5nKSB7XG4gICAgICAgICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gICAgICAgICAgICAgICAgaGF2ZUhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cHJlJHtobGpzQ2xhc3N9Pjxjb2RlPiR7aGxqcy5oaWdobGlnaHQoc3RyLCB7IGxhbmd1YWdlOiBsYW5nLCBpZ25vcmVJbGxlZ2FsczogdHJ1ZSB9KS52YWx1ZX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJpbnRJZk5ldyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JOYW1lOiAnbWFya2Rvd24tcGFyc2VyJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgPHByZSR7aGxqc0NsYXNzfT48Y29kZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwoc3RyKX08L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2NvcHktY29kZScsIG1hcmtEb3duUGx1Z2luPy5jb3B5Q29kZSA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGNvZGVXaXRoQ29weSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnaGVhZGVyLWxpbmsnLCBtYXJrRG93blBsdWdpbj8uaGVhZGVyTGluayA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKGFuY2hvciwge1xuICAgICAgICAgICAgc2x1Z2lmeTogKHM6IGFueSkgPT4gc2x1Z2lmeShzKSxcbiAgICAgICAgICAgIHBlcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKClcbiAgICAgICAgfSk7XG5cbiAgICBpZiAocGFyc2VUYWdEYXRhU3RyaW5nQm9vbGVhbihkYXRhVGFnLCAnYXR0cnMnLCBtYXJrRG93blBsdWdpbj8uYXR0cnMgPz8gdHJ1ZSkpXG4gICAgICAgIG1kLnVzZShtYXJrZG93bkl0QXR0cnMpO1xuXG4gICAgaWYgKHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ2FiYnInLCBtYXJrRG93blBsdWdpbj8uYWJiciA/PyB0cnVlKSlcbiAgICAgICAgbWQudXNlKG1hcmtkb3duSXRBYmJyKTtcblxuICAgIGxldCBtYXJrZG93bkNvZGUgPSBCZXR3ZWVuVGFnRGF0YT8uZXE7XG4gICAgaWYgKCFtYXJrZG93bkNvZGUpIHtcbiAgICAgICAgbGV0IGZpbGVQYXRoID0gcGF0aC5qb2luKHBhdGguZGlybmFtZSh0eXBlLmV4dHJhY3RJbmZvKCc8bGluZT4nKSksIGRhdGFUYWcucmVtb3ZlKCdmaWxlJykpO1xuICAgICAgICBpZiAoIXBhdGguZXh0bmFtZShmaWxlUGF0aCkpXG4gICAgICAgICAgICBmaWxlUGF0aCArPSAnLnNlcnYubWQnXG4gICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKEJhc2ljU2V0dGluZ3MuZnVsbFdlYlNpdGVQYXRoLCBmaWxlUGF0aCk7XG4gICAgICAgIG1hcmtkb3duQ29kZSA9IGF3YWl0IEVhc3lGcy5yZWFkRmlsZShmdWxsUGF0aCk7IC8vZ2V0IG1hcmtkb3duIGZyb20gZmlsZVxuICAgICAgICBhd2FpdCBzZXNzaW9uLmRlcGVuZGVuY2UoZmlsZVBhdGgsIGZ1bGxQYXRoKVxuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlckhUTUwgPSBtZC5yZW5kZXIobWFya2Rvd25Db2RlKSwgYnVpbGRIVE1MID0gbmV3IFN0cmluZ1RyYWNrZXIodHlwZS5EZWZhdWx0SW5mb1RleHQpO1xuXG4gICAgY29uc3QgdGhlbWUgPSBhd2FpdCBjcmVhdGVBdXRvVGhlbWUoZGF0YVRhZy5yZW1vdmUoJ2NvZGUtdGhlbWUnKSB8fCBtYXJrRG93blBsdWdpbj8uY29kZVRoZW1lIHx8ICdhdG9tLW9uZScpO1xuXG4gICAgaWYgKGhhdmVIaWdobGlnaHQpIHtcbiAgICAgICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC9jb2RlLXRoZW1lLycgKyB0aGVtZSArICcuY3NzJztcbiAgICAgICAgc2Vzc2lvbi5zdHlsZShjc3NMaW5rKTtcbiAgICB9XG5cbiAgICBkYXRhVGFnLmFkZENsYXNzKCdtYXJrZG93bi1ib2R5Jyk7XG5cbiAgICBjb25zdCBzdHlsZSA9IHBhcnNlVGFnRGF0YVN0cmluZ0Jvb2xlYW4oZGF0YVRhZywgJ3RoZW1lJywgbWFya0Rvd25QbHVnaW4/LnRoZW1lID8/ICdhdXRvJyk7XG4gICAgY29uc3QgY3NzTGluayA9ICcvc2Vydi9tZC90aGVtZS8nICsgc3R5bGUgKyAnLmNzcyc7XG4gICAgc3R5bGUgIT0gJ25vbmUnICYmIHNlc3Npb24uc3R5bGUoY3NzTGluaylcblxuICAgIGlmIChkYXRhVGFnLmxlbmd0aClcbiAgICAgICAgYnVpbGRIVE1MLlBsdXMkYDxkaXYke0luc2VydENvbXBvbmVudC5SZUJ1aWxkVGFnRGF0YShCZXR3ZWVuVGFnRGF0YS5EZWZhdWx0SW5mb1RleHQsIGRhdGFUYWcpfT4ke3JlbmRlckhUTUx9PC9kaXY+YDtcbiAgICBlbHNlXG4gICAgICAgIGJ1aWxkSFRNTC5BZGRUZXh0QWZ0ZXIocmVuZGVySFRNTCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlZFN0cmluZzogYnVpbGRIVE1MLFxuICAgICAgICBjaGVja0NvbXBvbmVudHM6IGZhbHNlXG4gICAgfVxufVxuXG5jb25zdCB0aGVtZUFycmF5ID0gWycnLCAnLWRhcmsnLCAnLWxpZ2h0J107XG5jb25zdCB0aGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9naXRodWItbWFya2Rvd24tY3NzL2dpdGh1Yi1tYXJrZG93bic7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWluaWZ5TWFya2Rvd25UaGVtZSgpIHtcbiAgICBmb3IgKGNvbnN0IGkgb2YgdGhlbWVBcnJheSkge1xuICAgICAgICBjb25zdCBtaW5pID0gKGF3YWl0IEVhc3lGcy5yZWFkRmlsZSh0aGVtZVBhdGggKyBpICsgJy5jc3MnKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxuXFwubWFya2Rvd24tYm9keSB7KXwoXi5tYXJrZG93bi1ib2R5IHspL2dtLCAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCArICdwYWRkaW5nOjIwcHg7J1xuICAgICAgICAgICAgfSkgKyBgXG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjpyaWdodDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOi0zMHB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDoxMHB4O1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5jb2RlLWNvcHk6aG92ZXI+ZGl2IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuY29kZS1jb3B5PmRpdiBhOmZvY3VzIHtcbiAgICAgICAgICAgICAgICBjb2xvcjojNmJiODZhXG4gICAgICAgICAgICB9YDtcbiAgICAgICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZSh0aGVtZVBhdGggKyBpICsgJy5taW4uY3NzJywgTWluQ3NzKG1pbmkpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RhcnQodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZykge1xuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyLCBsYXN0XSA9IHRleHQxLnNwbGl0KC8ofXxcXCpcXC8pLmhsanN7LylcbiAgICBjb25zdCBhZGRCZWZvcmUgPSB0ZXh0MVtiZWZvcmUubGVuZ3RoXSA9PSAnfScgPyAnfSc6ICcqLyc7XG4gICAgcmV0dXJuIFtiZWZvcmUgK2FkZEJlZm9yZSwgJy5obGpzeycgKyAobGFzdCA/PyBhZnRlciksICcuaGxqc3snICsgdGV4dDIuc3BsaXQoLyh9fFxcKlxcLykuaGxqc3svKS5wb3AoKV07XG59XG5cbmNvbnN0IGNvZGVUaGVtZVBhdGggPSB3b3JraW5nRGlyZWN0b3J5ICsgJ25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3R5bGVzLyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1dG9UaGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGFya0xpZ2h0U3BsaXQgPSB0aGVtZS5zcGxpdCgnfCcpO1xuICAgIGlmIChkYXJrTGlnaHRTcGxpdC5sZW5ndGggPT0gMSkgcmV0dXJuIHRoZW1lO1xuXG4gICAgY29uc3QgbmFtZSA9IGRhcmtMaWdodFNwbGl0WzJdIHx8IGRhcmtMaWdodFNwbGl0LnNsaWNlKDAsIDIpLmpvaW4oJ34nKS5yZXBsYWNlKCcvJywgJy0nKTtcblxuICAgIGlmIChhd2FpdCBFYXN5RnMuZXhpc3RzRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJykpXG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgY29uc3QgbGlnaHRUZXh0ID0gYXdhaXQgRWFzeUZzLnJlYWRGaWxlKGNvZGVUaGVtZVBhdGggKyBkYXJrTGlnaHRTcGxpdFswXSArICcuY3NzJyk7XG4gICAgY29uc3QgZGFya1RleHQgPSBhd2FpdCBFYXN5RnMucmVhZEZpbGUoY29kZVRoZW1lUGF0aCArIGRhcmtMaWdodFNwbGl0WzFdICsgJy5jc3MnKTtcblxuICAgIGNvbnN0IFtzdGFydCwgZGFyaywgbGlnaHRdID0gc3BsaXRTdGFydChkYXJrVGV4dCwgbGlnaHRUZXh0KTtcbiAgICBjb25zdCBkYXJrTGlnaHQgPSBgJHtzdGFydH1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7JHtkYXJrfX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6bGlnaHQpeyR7bGlnaHR9fWA7XG4gICAgYXdhaXQgRWFzeUZzLndyaXRlRmlsZShjb2RlVGhlbWVQYXRoICsgbmFtZSArICcuY3NzJywgZGFya0xpZ2h0KTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvQ29kZVRoZW1lKCkge1xuICAgIHJldHVybiBjcmVhdGVBdXRvVGhlbWUoJ2F0b20tb25lLWxpZ2h0fGF0b20tb25lLWRhcmt8YXRvbS1vbmUnKVxufSIsICJpbXBvcnQgeyBhdXRvQ29kZVRoZW1lLCBtaW5pZnlNYXJrZG93blRoZW1lIH0gZnJvbSBcIi4uL0J1aWxkSW5Db21wb25lbnRzL0NvbXBvbmVudHMvbWFya2Rvd25cIjtcbmF3YWl0IG1pbmlmeU1hcmtkb3duVGhlbWUoKTtcbmF3YWl0IGF1dG9Db2RlVGhlbWUoKTsiLCAiaW1wb3J0IHsgY2hkaXIsIGN3ZCB9IGZyb20gXCJwcm9jZXNzXCI7XG5jb25zdCBwYXRoVGhpcyA9IGN3ZCgpLnNwbGl0KCcvJyk7XG5cbmZ1bmN0aW9uIGNoZWNrQmFzZShpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHBhdGhUaGlzLmF0KC1pbmRleCkgPT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgICAgY2hkaXIoJy4uLycucmVwZWF0KGluZGV4KSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5pZiAoIWNoZWNrQmFzZSgyKSlcbiAgICBjaGVja0Jhc2UoMyk7XG5cbmltcG9ydCgnLi9idWlsZC1zY3JpcHRzLmpzJyk7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElB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
