import SourceMapStore from "../EasyDebug/SourceMapStore.js";
import StoreJSON from "../OutputInput/StoreJSON.js";
import { getTypes } from "../RunTimeBuild/SearchFileSystem.js";
import Base64Id from '../StringMethods/Id.js';
import EasyFs from "../OutputInput/EasyFs.js";
const StaticFilesInfo = new StoreJSON('ShortScriptNames');
export class SessionBuild {
    constructor(defaultPath, typeName, debug) {
        this.defaultPath = defaultPath;
        this.typeName = typeName;
        this.debug = debug;
        this.connectorArray = [];
        this.scriptURLSet = [];
        this.styleURLSet = [];
        this.inScriptStyle = [];
        this.headHTML = '';
        this.cache = {
            style: [],
            script: [],
            scriptModule: []
        };
        this.cacheComponent = {};
        this.compileRunTimeStore = {};
    }
    style(url, attributes) {
        if (this.styleURLSet.find(x => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes)))
            return;
        this.styleURLSet.push({ url, attributes });
    }
    script(url, attributes) {
        if (this.scriptURLSet.find(x => x.url == url && JSON.stringify(x.attributes) == JSON.stringify(attributes)))
            return;
        this.scriptURLSet.push({ url, attributes });
    }
    addScriptStyle(type, smallPath = this.defaultPath) {
        let data = this.inScriptStyle.find(x => x.type == type && x.path == smallPath);
        if (!data) {
            data = { type, path: smallPath, value: new SourceMapStore(smallPath, this.debug, type == 'style', true) };
            this.inScriptStyle.push(data);
        }
        return data.value;
    }
    static createName(text) {
        let length = 0;
        let key;
        const values = Object.values(StaticFilesInfo.store);
        while (key == null || values.includes(key)) {
            key = Base64Id(text, 5 + length).substring(length);
            length++;
        }
        return key;
    }
    addHeadTags() {
        const isLogs = this.typeName == getTypes.Logs[2];
        const saveLocation = isLogs ? getTypes.Logs[1] : getTypes.Static[1], addQuery = isLogs ? '?t=l' : '';
        for (const i of this.inScriptStyle) {
            let url = StaticFilesInfo.have(i.path, () => SessionBuild.createName(i.path)) + '.pub';
            switch (i.type) {
                case 'script':
                    url += '.js';
                    this.script('/' + url + addQuery, { defer: null });
                    break;
                case 'module':
                    url += '.mjs';
                    this.script('/' + url + addQuery, { type: 'module' });
                    break;
                case 'style':
                    url += '.css';
                    this.style('/' + url + addQuery);
                    break;
            }
            EasyFs.writeFile(saveLocation + url, i.value.createDataWithMap());
        }
    }
    buildHead() {
        this.addHeadTags();
        const makeAttributes = (i) => i.attributes ? ' ' + Object.keys(i.attributes).map(x => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(' ') : '';
        const addTypeInfo = this.typeName == getTypes.Logs[2] ? '?t=l' : '';
        let buildBundleString = ''; // add scripts add css
        for (const i of this.styleURLSet)
            buildBundleString += `<link rel="stylesheet" href="${i.url + addTypeInfo}"${makeAttributes(i)}/>`;
        for (const i of this.scriptURLSet)
            buildBundleString += `<script src="${i.url + addTypeInfo}"${makeAttributes(i)}></script>`;
        return buildBundleString + this.headHTML;
    }
    extends(from) {
        this.connectorArray.push(...from.connectorArray);
        this.scriptURLSet.push(...from.scriptURLSet);
        this.styleURLSet.push(...from.styleURLSet);
        for (const i of from.inScriptStyle) {
            this.inScriptStyle.push({ ...i, value: i.value.clone() });
        }
        this.headHTML += from.headHTML;
        this.cache.style.push(...from.cache.style);
        this.cache.script.push(...from.cache.script);
        this.cache.scriptModule.push(...from.cache.scriptModule);
        Object.assign(this.cacheComponent, from.cacheComponent);
    }
}
//# sourceMappingURL=Session.js.map