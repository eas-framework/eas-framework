import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import JSParser from '../../CompileCode/JSParser'
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import { CutTheLast, SplitFirst } from '../../StringMethods/Splitting';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import StoreJSON from '../../OutputInput/StoreJSON';
import path from 'path';

const recordStore = new StoreJSON('Records');

function recordLink(dataTag: tagDataObjectArray, sessionInfo: SessionBuild) {
    return dataTag.remove('link')|| CutTheLast('.', SplitFirst('/', sessionInfo.smallPath).pop());
}

export function makeRecordPath(defaultName: string, dataTag: tagDataObjectArray, sessionInfo: SessionBuild){
    const link = recordLink(dataTag, sessionInfo), saveName = dataTag.remove('name') || defaultName;

    recordStore.store[saveName] ??= {};
    recordStore.store[saveName][link] ??= '';
    sessionInfo.record(saveName);

    return {
        store: recordStore.store[saveName],
        current: recordStore.store[saveName][link],
        link
    };
}

export default async function BuildCode(pathName: string, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo);

    const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo())
    await parser.findScripts();

    let html = '';

    for (const i of parser.values) {
        if (i.type == 'text') {
            html += i.text.eq;
        }
    }

    html = html.trim();

    const {store, link} = makeRecordPath('records/record.serv', dataTag, sessionInfo);

    if(!store[link].includes(html)){
        store[link] += html;
    }

    return {
        compiledString: BetweenTagData
    }
}

export function updateRecords(session: SessionBuild) {
    if (!session.debug) {
        return;
    }
    
    for (const name of session.recordNames) {
        const path = getTypes.Static[0] + name + '.json';
        EasyFs.writeJsonFile(path, recordStore.store[name])
    }
}

export function perCompile(){
    recordStore.clear();
}

export async function postCompile(){
    for (const name in recordStore.store) {
        const filePath = getTypes.Static[0] + name + '.json';
        const dirname = path.dirname(name);
        if(dirname) await EasyFs.makePathReal(dirname, getTypes.Static[0]);
        EasyFs.writeJsonFile(filePath, recordStore.store[name]);
    }
}