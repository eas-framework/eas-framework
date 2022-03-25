import { StringMap } from "../CompileCode/XMLHelpers/CompileTypes";
import EasyFs from "../OutputInput/EasyFs";
import { getTypes } from "../RunTimeBuild/SearchFileSystem";
import MiniSearch, {SearchOptions, SearchResult} from 'minisearch';

export default class SearchRecord {
    private fullPath: string
    private indexData: {[key: string]: {
        titles: StringMap,
        text: string
    }}
    private miniSearch: MiniSearch;
    constructor(filepath: string){
        this.fullPath = getTypes.Static[0] + filepath + '.json'
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

        await this.miniSearch.addAllAsync(unwrapped);
    }

/**
 * It searches for a string and returns an array of matches
 * @param text - The text to search for.
 * @param options - length - maximum length - *not cutting half words*
 * 
 * addAfterMaxLength - add text if a text result reach the maximum length, for example '...'
 * @param tag - The tag to wrap around the founded search terms.
 * @returns An array of objects, each object containing the `text` of the search result, `link` to the page, and an array of
 * objects containing the terms and the index of the term in the text.
 */
    search(text: string, options: SearchOptions & {length?: number, addAfterMaxLength?: string} = {fuzzy: true, length: 200, addAfterMaxLength: '...'}, tag = 'b'): (SearchResult & {text: string, url: string})[]{
        const data = <any>this.miniSearch.search(text, options);
        if(!tag) return data;

        for(const i of data){
            for(const term of i.terms){
                if(options.length && i.text.length > options.length){
                    const substring = i.text.substring(0, options.length);
                    if(i.text[options.length].trim() != ''){
                        i.text = substring.substring(0, substring.lastIndexOf(' ')) + (options.addAfterMaxLength ?? '');
                    } else {
                        i.text = substring.trim();
                    }
                }
                
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