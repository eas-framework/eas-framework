import path from "path";
import DepCreator from "../ImportSystem/Dependencies/DepCreator.js";
import {GlobalSettings} from "../Settings/GlobalSettings.js";
import PPath from "../Settings/PPath.js";
import {directories} from "../Settings/ProjectConsts.js";
import {StringAnyMap} from "../Settings/types.js";
import {safeDebug} from "../Settings/utils.js";
import SourceMapTracker from "../SourceTracker/SourceMap/SourceMapTracker.js";
import StringTracker from "../SourceTracker/StringTracker/StringTracker.js";
import {pagesStorage, shortNames} from "../Storage/StaticStorage.js";
import EasyFS from "../Util/EasyFS.js";
import createId from "../Util/Strings.js";
import TagDataParser from "./Templating/Components/TagDataParser.js";
import DepManager from '../ImportSystem/Dependencies/DepManager.js';
import JSONStorage from '../Storage/JSONStorage.js';

const ID_MIN_LENGTH = 5;

export type setDataHTMLTag = {
    url: string,
    attributes?: StringAnyMap
}

export type connectorInfo = {
    type: string,
    name: string,
    sendTo: string,
    validator: string[],
    order?: string[],
    notValid?: string,
    message?: string | boolean,
    responseSafe?: boolean
}

export type connectorArray = connectorInfo[]

export type cacheComponent = {
    [key: string]: null | {
        mtimeMs?: number,
        value?: string
    }
}

export type inTagCache = {
    style: string[]
    script: string[]
    scriptModule: string[]
}


/* The SessionBuild class is used to build the head of the page */
export class SessionBuild {
    connectorArray: connectorArray = [];
    private scriptURLSet: setDataHTMLTag[] = [];
    private styleURLSet: setDataHTMLTag[] = [];
    private inScriptStyle: { type: 'script' | 'style' | 'module', path: PPath, value: SourceMapTracker }[] = [];
    headHTML = '';
    cache: inTagCache = {
        style: [],
        script: [],
        scriptModule: []
    };
    cacheComponent: cacheComponent = {};
    compileRunTimeStore: StringAnyMap = {};
    dependencies: DepCreator;
    recordNames: string[] = [];

    get safeDebug() {
        return GlobalSettings.development && safeDebug();
    }

    constructor(public file: PPath, public dynamic = false) {
        this.dependencies = SessionBuild.getPageDepsSession(file);
    }

    static getPageDepsSession(file: PPath){
        return new DepManager(
            new JSONStorage(file.small, pagesStorage[file.small] ??= {})
        ).createSession();
    }

    style(url: string, attributes?: StringAnyMap) {
        if (this.styleURLSet.find(x => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes))) return;
        this.styleURLSet.push({url, attributes});
    }

    script(url: string, attributes?: StringAnyMap) {
        if (this.scriptURLSet.find(x => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes))) return;
        this.scriptURLSet.push({url, attributes});
    }

    record(name: string) {
        if (!this.recordNames.includes(name))
            this.recordNames.push(name);
    }

    addScriptStyle(type: 'script' | 'style' | 'module', file = this.file) {
        let alreadyHave = this.inScriptStyle.find(x => x.type == type && x.path.small == file.small);
        if (!alreadyHave) {
            alreadyHave = {type, path: file, value: new SourceMapTracker()};
            this.inScriptStyle.push(alreadyHave);
        }

        return alreadyHave.value;
    }

    addScriptStylePage(type: 'script' | 'style' | 'module', dataTag: TagDataParser, info: StringTracker) {
        return this.addScriptStyle(type, dataTag.popString('page') ? this.file : info.topSource);
    }


    private static createName(text: string) {
        let length = 0;
        let key: string = null;

        const values = Object.values(shortNames.store);
        while (key == null || values.includes(key)) {
            key = createId(text, ID_MIN_LENGTH + length).substring(length);
            length++;
        }

        return key;
    }

    private async addHeadTags() {
        const wait = [];
        for (const i of this.inScriptStyle) {
            let url = shortNames.have(i.path.nested, () => SessionBuild.createName(i.path.nested)) + '.pub';

            switch (i.type) {
                case 'script':
                    url += '.js';
                    this.script('/' + url, {defer: null});
                    break;
                case 'module':
                    url += '.mjs';
                    this.script('/' + url, {type: 'module'});
                    break;
                case 'style':
                    url += '.css';
                    this.style('/' + url);
                    break;
            }

            const dataWithSource = i.value.computeData(i.path);
            dataWithSource.httpOutput();

            wait.push(
                EasyFS.writeFileAndPath(
                    path.join(directories.Locate.static.compile, url),
                    dataWithSource.dataWithSourceMap(i.type == 'style')
                )
            );
        }

        await Promise.all(wait);
    }

    async buildHead() {
        await this.addHeadTags();

        const makeAttributes = (i: setDataHTMLTag) => i.attributes ? ' ' + Object.keys(i.attributes).map(x => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(' ') : '';

        let buildBundleString = ''; // add scripts add css
        for (const i of this.styleURLSet)
            buildBundleString += `<link rel="stylesheet" href="${i.url}"${makeAttributes(i)}/>`;
        for (const i of this.scriptURLSet)
            buildBundleString += `<script src="${i.url}"${makeAttributes(i)}></script>`;

        return buildBundleString + this.headHTML;
    }

    extends(from: SessionBuild) {
        this.connectorArray.push(...from.connectorArray);
        this.scriptURLSet.push(...from.scriptURLSet);
        this.styleURLSet.push(...from.styleURLSet);

        for (const i of from.inScriptStyle) {
            this.inScriptStyle.push({...i, value: i.value.clone()});
        }

        const copyObjects = ['cacheComponent', 'dependencies'];

        for (const c of copyObjects) {
            Object.assign(this[c], from[c]);
        }

        this.recordNames.push(...from.recordNames.filter(x => !this.recordNames.includes(x)));

        this.headHTML += from.headHTML;
        this.cache.style.push(...from.cache.style);
        this.cache.script.push(...from.cache.script);
        this.cache.scriptModule.push(...from.cache.scriptModule);
    }
}