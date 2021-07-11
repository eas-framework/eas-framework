import {
  Options as TransformOptions,
  transform
} from "sucrase";
import { RawSourceMap } from "sucrase/dist/computeSourceMap";
import { minify } from "terser";
import { PrintIfNew } from "../OutputInput/PrintNew";
import EasyFs from "../OutputInput/EasyFs";
import {
  BasicSettings,
  PagesInfo,
  UpdatePageDependency,
  SystemData
} from "../RunTimeBuild/SearchFileSystem";
import EasySyntax from "../CompileCode/transform/EasySyntax";
import JSParser from "../CompileCode/JSParser";
import path from "path";
import { isTs } from "../CompileCode/InsertModels";
import StringTracker from "../EasyDebug/StringTracker";
import { SourceMapConsumer, SourceMapGenerator } from "source-map";
import ImportWithoutCache from '../ImportFiles/ImportWithoutCache';

function ReplaceBefore(
  code: string,
  defineData: { [key: string]: string },
) {
  code = EasySyntax.BuildAndExportImports(code, defineData);
  return code;
}

function template(code: string, isDebug: boolean, dir: string, file: string) {
  return `${isDebug ? "import sourceMapSupport from 'source-map-support'; sourceMapSupport.install();" : ''};var __dirname=\`${JSParser.fixText(dir)
    }\`,__filename=\`${JSParser.fixText(file)
    }\`;export default (async (require)=>{var module={exports:{}},exports=module.exports;\n${code}\nreturn module.exports;});`;
}

async function shiftLineSourceMap(map: RawSourceMap): Promise<string> {
  map.file =  map.file.split(/\/|\\/).pop(); // only the name;

  const data = await SourceMapConsumer.with<string>(map, null, (consumer) => {
    const newMap = new SourceMapGenerator();
    consumer.eachMapping(function (m) {
      newMap.addMapping({
        source: map.file,
        original: { line: m.originalLine, column: m.originalColumn },
        generated: { line: m.generatedLine + 1, column: m.generatedColumn }
      });
    });
    return newMap.toJSON().mappings;
  });

  map.mappings = data;
  return JSON.stringify(map);
}

/**
 *
 * @param text
 * @param type
 * @returns
 */
async function BuildScript(
  filepath: string,
  savepath: string | null,
  isTypescript: boolean,
  isDebug: boolean,
): Promise<string> {
  const Options: TransformOptions = {
    transforms: ["imports"],
    sourceMapOptions: {
      compiledFilename: savepath ?? filepath,
    },
    filePath: filepath
  },
    define = {
      debug: "" + isDebug,
    };

  if (isTypescript) {
    Options.transforms.push("typescript");
  }

  let Result = ReplaceBefore(
    await EasyFs.readFile(filepath),
    define,
  ),
    sourceMap: string;

  try {
    const { code, sourceMap: map } = transform(Result, Options);
    Result = code;
    sourceMap = await shiftLineSourceMap(map);
  } catch (err) {
    PrintIfNew({
      errorName: "compilation-error",
      text: `${err.message}, on file -> ${filepath}`,
    });
  }

  Result = template(
    new StringTracker(filepath, Result).eq,
    isDebug,
    path.dirname(filepath),
    filepath,
  );

  if (isDebug) {
    Result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," +
      Buffer.from(sourceMap).toString("base64");
  } else {
    Result = (await minify(Result, { module: false })).code;
  }

  if (savepath) {
    await EasyFs.makePathReal(path.dirname(savepath));
    await EasyFs.writeFile(savepath, Result);
  }
  return Result;
}

function CheckTs(FilePath: string) {
  return FilePath.endsWith(".ts");
}

export async function BuildScriptSmallPath(
  InStaticPath: string,
  typeArray: string[],
  isDebug = false,
) {
  await EasyFs.makePathReal(InStaticPath, typeArray[1]);

  return await BuildScript(
    typeArray[0] + InStaticPath,
    typeArray[1] + InStaticPath + ".js",
    CheckTs(InStaticPath),
    isDebug,
  );
}

export function AddExtension(FilePath: string) {
  if (!BasicSettings.ReqFileTypesArray.find((x) => FilePath.endsWith(x))) {
    FilePath =
      FilePath.substring(0, FilePath.length - path.extname(FilePath).length) +
      "." + BasicSettings.ReqFileTypes[isTs() ? "ts" : "js"];
  }

  return FilePath;
}

const SavedModules = {};

export default async function LoadImport(
  InStaticPath: string,
  typeArray: string[],
  isDebug = false,
) {
  let TimeCheck: any;

  const SavedModulesPath = path.join(typeArray[2], InStaticPath),
    filePath = typeArray[0] + InStaticPath;

  if (!PagesInfo[SavedModulesPath] || PagesInfo[SavedModulesPath] != (TimeCheck = await EasyFs.stat(filePath, "mtimeMs"))) {
    await BuildScriptSmallPath(InStaticPath, typeArray, isDebug);
    UpdatePageDependency(
      SavedModulesPath,
      TimeCheck ?? await EasyFs.stat(filePath, "mtimeMs"),
    );
  } else if (SavedModules[SavedModulesPath]) {
    return SavedModules[SavedModulesPath];
  }

  function requireMap(p: string) {
    if(path.isAbsolute(p)){
      p = path.normalize(p).substring(path.normalize(typeArray[0]).length);
  } else {
      if (p[0] == ".") {
          const dirPath = path.dirname(InStaticPath);
          p = (dirPath != "/" ? dirPath + "/" : "") + p;
      }
      else if (p[0] != "/") {
          return import(p);
      }
  }

    p = AddExtension(p);

    return LoadImport(p, typeArray, isDebug);
  }

  const requirePath = path.join(typeArray[1], InStaticPath + ".js");

  let MyModule = await ImportWithoutCache(requirePath, async requirePath => await import('file:///' + requirePath));

  MyModule = await MyModule.default(requireMap);

  SavedModules[SavedModulesPath] = MyModule;
  return MyModule;
}

export function ImportFile(
  InStaticPath: string,
  typeArray: string[],
  isDebug = false,
) {
  if (!isDebug) {
    return SavedModules[typeArray[2] + "\\" + InStaticPath];
  }
  return LoadImport(InStaticPath, typeArray, isDebug);
}

export async function RequireOnce(filePath: string, isDebug: boolean) {
  const code = await BuildScript(
    filePath,
    null,
    CheckTs(filePath),
    isDebug,
  );

  const tempFile = path.join(SystemData, 'temp.js');
  await EasyFs.writeFile(tempFile, code);


  const MyModule = await ImportWithoutCache(tempFile, async requirePath => await import('file:///' + requirePath));
  
  return await MyModule.default((path: string) => import(path));
}