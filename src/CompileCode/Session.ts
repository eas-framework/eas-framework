import SourceMapStore from "../EasyDebug/SourceMapStore";
import StoreJSON from "../OutputInput/StoreJSON";
import { getTypes } from "../RunTimeBuild/SearchFileSystem";
import { StringAnyMap } from "./XMLHelpers/CompileTypes";
import Base64Id from '../StringMethods/Id';
import { SplitFirst } from "../StringMethods/Splitting";
import EasyFs from "../OutputInput/EasyFs";


export type setDataHTMLTag = {
    url: string,
    attributes?: StringAnyMap
}

export type connectorArray = {
    type: string,
    name: string,
    sendTo: string,
    validator: string[],
    order?: string[],
    notValid?: string,
    message?: string | boolean,
    responseSafe?: boolean
}[]

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

const StaticFilesInfo = new StoreJSON('ShortScriptNames');

/* The SessionBuild class is used to build the head of the page */
export class SessionBuild {
    connectorArray: connectorArray = []
    private scriptURLSet: setDataHTMLTag[] = []
    private styleURLSet: setDataHTMLTag[] = []
    private inScriptStyle: { type: 'script' | 'style' | 'module', path: string, value: SourceMapStore }[] = []
    headHTML = ''
    cache: inTagCache = {
        style: [],
        script: [],
        scriptModule: []
    }
    cacheCompileScript = {}
    cacheComponent: cacheComponent = {}
    compileRunTimeStore: StringAnyMap = {}

    constructor(public defaultPath: string, public typeName: string, public debug: boolean) {
    }

    style(url: string, attributes?: StringAnyMap) {
        if (this.styleURLSet.find(x => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes))) return;
        this.styleURLSet.push({ url, attributes });
    }

    script(url: string, attributes?: StringAnyMap) {
        if (this.scriptURLSet.find(x => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes))) return;
        this.scriptURLSet.push({ url, attributes });
    }

    addScriptStyle(type: 'script' | 'style' | 'module', smallPath = this.defaultPath) {
        let data = this.inScriptStyle.find(x => x.type == type && x.path == smallPath);
        if (!data) {
            data = { type, path: smallPath, value: new SourceMapStore(smallPath, this.debug, type == 'style', true) }
            this.inScriptStyle.push(data);
        }

        return data.value
    }


    private static createName(text: string){
        let length = 0;
        let key: string;

        const values = Object.values(StaticFilesInfo.store);
        while(key == null || values.includes(key)){
            key = Base64Id(text, 5 + length).substring(length);
            length++;
        }

        return key;
    }

    private addHeadTags() {
        const isLogs = this.typeName == getTypes.Logs[2]
        for (const i of this.inScriptStyle) {
            const saveLocation = i.path == this.defaultPath && isLogs ? getTypes.Logs[1] : getTypes.Static[1], addQuery = isLogs ? '?t=l' : '';
            let url = StaticFilesInfo.have(i.path, () => SessionBuild.createName(i.path)) + '.pub';

            switch (i.type) {
                case 'script':
                    url += '.js';
                    this.script('/' + url + addQuery, {defer: null})
                    break;
                case 'module':
                    url += '.mjs';
                    this.script('/' + url + addQuery, {type: 'module'})
                    break;
                case 'style':
                    url += '.css';
                    this.style('/' + url + addQuery)
                    break;
            }

            EasyFs.writeFile(saveLocation + url, i.value.createDataWithMap())
        }
    }

    buildHead() {
        this.addHeadTags();
        
        const makeAttributes = (i: setDataHTMLTag) => i.attributes ? ' ' + Object.keys(i.attributes).map(x => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(' ') : '';

        const addTypeInfo = this.typeName == getTypes.Logs[2] ? '?t=l' : '';
        let buildBundleString = ''; // add scripts add css
        for (const i of this.styleURLSet)
            buildBundleString += `<link rel="stylesheet" href="${i.url + addTypeInfo}"${makeAttributes(i)}/>`;
        for (const i of this.scriptURLSet)
            buildBundleString += `<script src="${i.url + addTypeInfo}"${makeAttributes(i)}></script>`;

        return buildBundleString + this.headHTML;
    }

    extends(from: SessionBuild) {
        this.connectorArray.push(...from.connectorArray);
        this.scriptURLSet.push(...from.scriptURLSet);
        this.styleURLSet.push(...from.styleURLSet);

        for (const i of from.inScriptStyle) {
            this.inScriptStyle.push({ ...i, value: i.value.clone() })
        }

        this.headHTML += from.headHTML;
        this.cache.style.push(...from.cache.style);
        this.cache.script.push(...from.cache.script);
        this.cache.scriptModule.push(...from.cache.scriptModule);

        Object.assign(this.cacheComponent, from.cacheComponent);
    }
}