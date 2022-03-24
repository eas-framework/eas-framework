import {SearchRecord} from '@eas-framework/server';

const search = new SearchRecord('records/search.serv.json')
await search.load();


export default function(text: string){
    return search.search(text);
}