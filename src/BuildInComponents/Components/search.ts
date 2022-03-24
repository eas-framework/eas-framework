import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent, StringMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import JSParser from '../../CompileCode/JSParser'
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import { parse } from 'node-html-parser';
import { makeRecordPath} from './record';

export default async function BuildCode( pathName: string, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo);

    const parser = new JSParser(BetweenTagData, BetweenTagData.extractInfo())
    await parser.findScripts();

    let html = '';

    for (const i of parser.values) {
        if (i.type == 'text') {
            html += i.text.eq;
        }
    }

    const {store, link, current} = makeRecordPath('records/search.serv', dataTag, sessionInfo);
    const searchObject = buildObject(html, dataTag.remove('match') || 'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');

    if(!current){
        store[link] = searchObject;
    } else {
        Object.assign(current.titles,searchObject.titles);

        if(!current.text.includes(searchObject.text)){
            current.text += searchObject.text;
        }
    }

    return {
        compiledString: BetweenTagData
    }
}

function buildObject(html: string, match: string) {
    const root = parse(html, {
        blockTextElements: {
            script: false,
            style: false,
            noscript: false
        }
    });

    const titles: StringMap = {};

    for (const element of root.querySelectorAll(match)) {
        const id = element.attributes['id'];
        titles[id] = element.innerText.trim();
        element.remove();
    }

    return {
        titles,
        text: root.innerText.trim().replace(/[ \n]{2,}/g, ' ').replace(/[\n]/g, ' ')
    }
}