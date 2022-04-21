import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';
import { ParseDebugInfo, CreateFilePath, PathTypes, AddDebugInfo } from './XMLHelpers/CodeInfoAndDebug';
import { AllBuildIn, IsInclude, StartCompiling } from '../BuildInComponents/index';
import StringTracker, { StringTrackerDataInfo, ArrayMatch } from '../EasyDebug/StringTracker';
import AddPlugin from '../Plugins/Index';
import {CompileInFileFunc, StringArrayOrObject, StringAnyMap } from './XMLHelpers/CompileTypes';
import { createNewPrint } from '../OutputInput/Logger';
import { InsertComponentBase, BaseReader, pool } from './BaseReader/Reader';
import pathNode from 'path';
import ParseBasePage from './CompileScript/PageBase';
import { SessionBuild } from './Session';
import { print } from '../OutputInput/Console';
import path from 'path';
import TagDataParser from './XMLHelpers/TagDataParser';


interface DefaultValues {
    value: StringTracker,
    elements: string[]
}

const searchSpecificComponents = new RegExp(`<([\\p{Lu}_\\-:0-9]|${AllBuildIn.join('|')})`, 'u')
const searchAllComponents = /<[\p{L}_\-:0-9]/u


export default class InsertComponent extends InsertComponentBase {
    public dirFolder: string;
    public PluginBuild: AddPlugin;
    public CompileInFile: CompileInFileFunc;
    public MicroPlugins: StringArrayOrObject;
    public GetPlugin: (name: string) => any;
    public SomePlugins: (...names: string[]) => boolean;
    public isTs: () => boolean;


    get regexSearch(){
        return this.SomePlugins("MinHTML", "MinAll") ? searchAllComponents: searchSpecificComponents
    }

    constructor(PluginBuild: AddPlugin) {
        super();
        this.dirFolder = 'Components';
        this.PluginBuild = PluginBuild;
    }

    FindSpecialTagByStart(string: string) {
        for (const i of this.SkipSpecialTag) {
            if (string.substring(0, i[0].length) == i[0]) {
                return i;
            }
        }
    }

    findIndexSearchTag(query: string, tag: StringTracker) {
        const all = query.split('.');
        let counter = 0
        for (const i of all) {
            const index = tag.indexOf(i)
            if (index == -1) {
                const [funcName, printText] = createNewPrint({
                    text: `Waring, can't find all query in tag -><color>${tag.eq}\n${tag.lineInfo}`,
                    errorName: "query-not-found"
                });
                print[funcName](printText);
                break
            }
            counter += index + i.length
            tag = tag.substring(index + i.length)
        }

        return counter + tag.search(/\ |\>/)
    }

    CheckMinHTML(code: StringTracker) {
        if (this.SomePlugins("MinHTML", "MinAll")) {
            code = code.SpaceOne(' ');
        }
        return code;
    }

    CheckMinHTMLText(code: StringTracker) {
        if (!this.SomePlugins("MinHTML", "MinAll")) {
            return code;
        }

        while(/[ \n]{2,}/.test(code.eq)){
            code = code.replace(/[ \n]{2,}/gi, ' ')
        }
    
        return code;
    }

    async ReBuildTag(type: StringTracker, dataTag: StringTracker, dataTagSpliced: TagDataParser, BetweenTagData: StringTracker, SendDataFunc: (text: StringTracker) => Promise<StringTracker>) {
        if (this.SomePlugins("MinHTML", "MinAll")) {
            if(BetweenTagData)
                BetweenTagData = BetweenTagData.SpaceOne(' ');

            dataTag = dataTagSpliced.rebuildSpace();
        }

        const tagData = new StringTracker(type.DefaultInfoText).Plus(
            '<', type, dataTag
        )

        if (BetweenTagData) {
            tagData.Plus$`>${await SendDataFunc(BetweenTagData)}</${type}>`;
        } else {
            tagData.Plus('/>');
        }

        return tagData;
    }

    exportDefaultValues(fileData: StringTracker, foundSetters: DefaultValues[] = []) {
        const indexBasic: ArrayMatch = fileData.match(/@default[ ]*\(([A-Za-z0-9{}()\[\]_\-$"'`%*&|\/\@ \n]*)\)[ ]*\[([A-Za-z0-9_\-,$ \n]+)\]/);

        if (indexBasic == null)
            return { fileData, foundSetters };

        const WithoutBasic = fileData.substring(0, indexBasic.index).Plus(fileData.substring(indexBasic.index + indexBasic[0].length));

        const arrayValues = indexBasic[2].eq.split(',').map(x => x.trim());

        foundSetters.push({
            value: indexBasic[1],
            elements: arrayValues
        });

        return this.exportDefaultValues(WithoutBasic, foundSetters);
    }

    addDefaultValues(arrayValues: DefaultValues[], fileData: StringTracker) {
        for (const i of arrayValues) {
            for (const be of i.elements) {
                fileData = fileData.replaceAll('~' + be, i.value);
            }
        }

        return fileData;
    }

    parseComponentProps(tagData: TagDataParser, component: StringTracker) {

        // eslint-disable-next-line
        let { fileData, foundSetters } = this.exportDefaultValues(component);

        for (const {key,value} of tagData.valueArray) {
            const re = new RegExp("\\~" + key, "gi");
            fileData = fileData.replace(re, value);
        }

        return this.addDefaultValues(foundSetters, fileData);
    }

    async buildTagBasic(fileData: StringTracker, tagData: TagDataParser, path: string, SmallPath: string, pathName: string, sessionInfo: SessionBuild, BetweenTagData?: StringTracker) {
        fileData = await this.PluginBuild.BuildComponent(fileData, path, pathName, sessionInfo);

        fileData = this.parseComponentProps(tagData, fileData);

        fileData = fileData.replace(/<\:reader( )*\/>/gi, BetweenTagData ?? '');

        pathName = pathName + ' -> ' + SmallPath;

        fileData = await this.StartReplace(fileData, pathName, sessionInfo);

        fileData = await ParseDebugInfo(fileData, `${pathName} ->\n${SmallPath}`);

        return fileData;
    }

    static addSpacialAttributes(data: TagDataParser, type: StringTracker, BetweenTagData: StringTracker) {
        const importSource = '/' + type.extractInfo();

        data.pushValue('importSource', importSource)
        data.pushValue('importSourceDirectory', path.dirname(importSource))

        const  mapAttributes = data.map();
        mapAttributes.reader = BetweenTagData?.eq;

        return mapAttributes;
    }

    async insertTagData(pathName: string, type: StringTracker, dataTag: StringTracker, { BetweenTagData, sessionInfo }: { sessionInfo: SessionBuild, BetweenTagData?: StringTracker }) {
        const dataParser = new TagDataParser(dataTag), BuildIn = IsInclude(type.eq);
        await dataParser.parser();

        let fileData: StringTracker, SearchInComment = true, AllPathTypes: PathTypes = {}, addStringInfo: string;

        if (BuildIn) {//check if it build in component
            const { compiledString, checkComponents } = await StartCompiling(pathName, type, dataParser, BetweenTagData ?? new StringTracker(), this, sessionInfo);
            fileData = compiledString;
            SearchInComment = checkComponents;
        } else {

            //rebuild formatted component
            const ReBuildTag = () => this.ReBuildTag(type, dataTag, dataParser, BetweenTagData, BetweenTagData => this.StartReplace(BetweenTagData, pathName, sessionInfo));

            //check if component not starts with upper case
            const firstChar = type.at(0).eq
            if(firstChar != firstChar.toUpperCase()){
                return ReBuildTag()
            }

            let folder: boolean | string = dataParser.popHaveDefault('folder', '.');

            const tagPath = (folder ? folder + '/' : '') + type.replace(/:/gi, "/").eq;

            const relativesFilePathSmall = type.extractInfo(), relativesFilePath = pathNode.join(BasicSettings.fullWebSitePath, relativesFilePathSmall);
            AllPathTypes = CreateFilePath(relativesFilePath, relativesFilePathSmall, tagPath, this.dirFolder, BasicSettings.pageTypes.component);

            if (sessionInfo.cacheComponent[AllPathTypes.SmallPath] === null || sessionInfo.cacheComponent[AllPathTypes.SmallPath] === undefined && !await EasyFs.existsFile(AllPathTypes.FullPath)) {
                sessionInfo.cacheComponent[AllPathTypes.SmallPath] = null;

                if (folder) {
                    const [funcName, printText] = createNewPrint({
                        text: `Component ${type.eq} not found! -><color>${pathName}\n-> ${type.lineInfo}\n${AllPathTypes.SmallPath}`,
                        errorName: "component-not-found",
                        type: 'error'
                    });
                    print[funcName](printText);
                }
                return ReBuildTag()
            }

            if (!sessionInfo.cacheComponent[AllPathTypes.SmallPath]?.mtimeMs)
                sessionInfo.cacheComponent[AllPathTypes.SmallPath] = { mtimeMs: await EasyFs.stat(AllPathTypes.FullPath, 'mtimeMs') }; // add to dependenceObject

            sessionInfo.dependencies[AllPathTypes.SmallPath] = sessionInfo.cacheComponent[AllPathTypes.SmallPath].mtimeMs

            const { allData, stringInfo } = await AddDebugInfo(true, pathName, AllPathTypes.FullPath, AllPathTypes.SmallPath, sessionInfo.cacheComponent[AllPathTypes.SmallPath]);
            const baseData = new ParseBasePage(sessionInfo, allData, this.isTs());

            /*add special attributes */
            const mapAttributes = InsertComponent.addSpacialAttributes(dataParser, type, BetweenTagData);

            await baseData.loadSettings(AllPathTypes.FullPath, AllPathTypes.SmallPath, pathName + ' -> ' + AllPathTypes.SmallPath, {attributes: mapAttributes});

            fileData = baseData.scriptFile.Plus(baseData.clearData);
            addStringInfo = sessionInfo.debug && stringInfo;
        }

        if (SearchInComment && (fileData.length > 0 || BetweenTagData)) {
            const { SmallPath, FullPath } = AllPathTypes;

            fileData = await this.buildTagBasic(fileData, dataParser, BuildIn ? type.eq : FullPath, BuildIn ? type.eq : SmallPath, pathName, sessionInfo, BetweenTagData);
            addStringInfo && fileData.AddTextBeforeNoTrack(addStringInfo);
        }

        return fileData;
    }

    private CheckDoubleSpace(...data: StringTracker[]) {
        const mini = this.SomePlugins("MinHTML", "MinAll");
        let startData = data.shift();

        if (mini) {
            startData = startData.SpaceOne(' ');
        }

        for (let i of data) {
            if (mini && startData.endsWith(' ') && i.startsWith(' ')) {
                i = i.trimStart();
            }

            if (typeof startData == 'string') {
                1 == 1;
            }
            startData.Plus(i);
        }

        if (mini) {
            startData = startData.SpaceOne(' ');
        }

        return startData;
    }

    async StartReplace(data: StringTracker, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker> {
        let find: number;

        const promiseBuild: (StringTracker | Promise<StringTracker>)[] = [];

        while ((find = data.search(this.regexSearch)) != -1) {

            //heck if there is special tag - need to skip it
            const locSkip = data.eq;
            const specialSkip = this.FindSpecialTagByStart(locSkip.trim());

            if (specialSkip) {
                const start = locSkip.indexOf(specialSkip[0]) + specialSkip[0].length;
                const end = locSkip.substring(start).indexOf(specialSkip[1]) + start + specialSkip[1].length;
                promiseBuild.push(data.substring(0, end));
                data = data.substring(end);
                continue;
            }

            //finding the tag
            const cutStartData = data.substring(0, find); //<

            const startFrom = data.substring(find);

            //tag type 
            const tagTypeEnd = startFrom.search('\ |/|\>|(<%)');

            const tagType = startFrom.substring(1, tagTypeEnd);

            const findEndOfSmallTag = await this.FindCloseChar(startFrom.substring(1), '>') + 1;

            let inTag = startFrom.substring(tagTypeEnd, findEndOfSmallTag);

            if (inTag.at(inTag.length - 1).eq == '/') {
                inTag = inTag.substring(0, inTag.length - 1);
            }

            const NextTextTag = startFrom.substring(findEndOfSmallTag + 1);

            if (startFrom.at(findEndOfSmallTag - 1).eq == '/') {//small tag
                promiseBuild.push(
                    this.CheckMinHTML(this.CheckMinHTMLText(cutStartData)),
                    this.insertTagData(pathName, tagType, inTag, { sessionInfo })
                );

                data = NextTextTag;
                continue;
            }

            //big tag with reader
            let BetweenTagDataCloseIndex;

            if (this.SimpleSkip.includes(tagType.eq)) {
                BetweenTagDataCloseIndex = NextTextTag.indexOf('</' + tagType);
            } else {
                BetweenTagDataCloseIndex = await this.FindCloseCharHTML(NextTextTag, tagType.eq);
                if (BetweenTagDataCloseIndex == -1) {
                    const [funcName, printText] = createNewPrint({
                        text: `\nWarning, you didn't write right this tag: "${tagType}", used in: ${tagType.at(0).lineInfo}\n(the system will auto close it)`,
                        errorName: "close-tag"
                    });
                    print[funcName](printText);
                    BetweenTagDataCloseIndex = null;
                }
            }

            const BetweenTagData = BetweenTagDataCloseIndex != null && NextTextTag.substring(0, BetweenTagDataCloseIndex);

            //finding last close 
            const NextDataClose = NextTextTag.substring(BetweenTagDataCloseIndex);
            const NextDataAfterClose = BetweenTagDataCloseIndex != null ? NextDataClose.substring(BaseReader.findEndOfDef(NextDataClose.eq, '>') + 1) : NextDataClose; // search for the close of a big tag just if the tag is valid

            promiseBuild.push(
                this.CheckMinHTML(cutStartData),
                this.insertTagData(pathName, tagType, inTag, { BetweenTagData, sessionInfo })
            );

            data = NextDataAfterClose;
        }


        let textBuild = new StringTracker(data.DefaultInfoText);

        for (const i of promiseBuild) {
            textBuild = this.CheckDoubleSpace(textBuild, await i);
        }

        //If this only text then delete double spacing
        if(promiseBuild.length === 0 && !this.FindSpecialTagByStart(data.eq.trim())){
            data = this.CheckMinHTMLText(data)
        }

        return this.CheckMinHTML(this.CheckDoubleSpace(textBuild, data));

    }

    private RemoveUnnecessarySpace(code: StringTracker) {
        code = code.trim();
        code = code.replaceAll(/%>[ ]+<%(?![=:])/, '%><%');
        return code;
    }

    async Insert(data: StringTracker, pathName: string, sessionInfo: SessionBuild) {

        //removing html comment tags
        data = data.replace(/<!--[\w\W]+?-->/, '');

        data = await this.StartReplace(data, pathName, sessionInfo);

        //if there is a reader, replacing him with 'codebase'
        data = data.replace(/<\:reader+( )*\/>/gi, '<%typeof page.codebase == "function" ? page.codebase(): write(page.codebase)%>') // replace for importing pages / components
        return this.RemoveUnnecessarySpace(data);
    }
}