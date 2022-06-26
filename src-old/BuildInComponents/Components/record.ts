import StringTracker from '../../EasyDebug/StringTracker';
import { BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import JSParser from '../../CompileCode/JSParser'
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import { CutTheLast, SplitFirst } from '../../StringMethods/Splitting';
import { BasicSettings, getTypes, smallPathToPage } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import StoreJSON from '../../OutputInput/StoreJSON';
import path from 'path';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

const recordStore = new StoreJSON('Records');

function recordLink(dataTag: TagDataParser, sessionInfo: SessionBuild) {
    return dataTag.popAnyDefault('link', smallPathToPage(sessionInfo.smallPath));
}

export function makeRecordPath(defaultName: string, dataTag: TagDataParser, sessionInfo: SessionBuild) {
    const link = recordLink(dataTag, sessionInfo), saveName = dataTag.popAnyDefault('name', defaultName);

    recordStore.store[saveName] ??= {};
    recordStore.store[saveName][link] ??= '';
    sessionInfo.record(saveName);

    return {
        store: recordStore.store[saveName],
        current: recordStore.store[saveName][link],
        link
    };
}

export default async function BuildCode(pathName: string, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo);

    if (!sessionInfo.smallPath.endsWith('.' + BasicSettings.pageTypes.page)) // do not allow this for compiling component alone
        return {
            compiledString: BetweenTagData
        }

    const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo())
    await parser.findScripts();

    let html = '';

    for (const i of parser.values) {
        if (i.type == 'text') {
            html += i.text.eq;
        }
    }

    html = html.trim();

    const { store, link } = makeRecordPath('records/record.serv', dataTag, sessionInfo);

    if (!store[link].includes(html)) {
        store[link] += html;
    }

    return {
        compiledString: BetweenTagData
    }
}

export function deleteBeforeReBuild(smallPath: string) {
    const name = smallPathToPage(smallPath);
    for (const save in recordStore.store) {
        const item = recordStore.store[save];

        if (item[name]) {
            item[name] = undefined;
            delete item[name];
        }
    }
}

export async function updateRecords(session: SessionBuild) {
    if (!session.debug) {
        return;
    }

    for (const name of session.recordNames) {
        const filePath = getTypes.Static[0] + name + '.json';
        await EasyFs.makePathReal(name, getTypes.Static[0]);
        EasyFs.writeJsonFile(filePath, recordStore.store[name]);
    }
}

export function perCompile() {
    recordStore.clear();
}

export async function postCompile() {
    for (const name in recordStore.store) {
        const filePath = getTypes.Static[0] + name + '.json';
        await EasyFs.makePathReal(name, getTypes.Static[0]);
        EasyFs.writeJsonFile(filePath, recordStore.store[name]);
    }
}