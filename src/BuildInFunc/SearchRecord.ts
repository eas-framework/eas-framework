import { StringMap } from "../CompileCode/XMLHelpers/CompileTypes";
import EasyFs from "../OutputInput/EasyFs";
import { getTypes } from "../RunTimeBuild/SearchFileSystem";
import MiniSearch, {SearchOptions} from 'minisearch';

export default class SearchRecord {
    private fullPath: string
    private indexData: {[key: string]: {
        titles: StringMap,
        text: string
    }}
    private miniSearch: MiniSearch;
    constructor(filepath: string){
        this.fullPath = getTypes.Static[0] + filepath
    }

    async load(){
        this.indexData = await EasyFs.readJsonFile(this.fullPath);
        const unwrapped: {id: number, text: string, url: string}[] = [];

        let counter = 0;
        for(const path in this.indexData){
            const element = this.indexData[path];
            for(const id in element.titles){
                unwrapped.push({id: counter++, text: element.titles[id], url: `/${path}/#${id}`});
            }
            unwrapped.push({id: counter++, text: element.text, url: `/${path}`});
        }

        this.miniSearch = new MiniSearch({
            fields: ['text'],
            storeFields: ['id', 'text', 'url']
        });

        this.miniSearch.addAll(unwrapped);
    }

    search(text: string, options: SearchOptions = {fuzzy: true}, tag = 'b'){
        const data = this.miniSearch.search(text, options);
        if(!tag) return data;

        for(const i of data){
            for(const term of i.terms){
                let lower = i.text.toLowerCase(), rebuild = '';
                let index = lower.indexOf(term);
                let beenLength = 0;

                while(index != -1){
                    rebuild += i.text.substring(beenLength, beenLength + index) +  `<${tag}>${i.text.substring(index + beenLength, index + term.length + beenLength)}</${tag}>`
                    lower = lower.substring(index + term.length);
                    beenLength += index + term.length;
                    index = lower.indexOf(term);
                }

                i.text = rebuild + i.text.substring(beenLength);
            }
        }

        return data;
    }

    suggest(text: string, options: SearchOptions){
        return this.miniSearch.autoSuggest(text, options);
    }
}