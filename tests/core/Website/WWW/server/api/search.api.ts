import {SearchRecord} from '@eas-framework/server'

const docSearch = new SearchRecord('records/search.serv')
await docSearch.load()

export default {
    GET: {
        define: {
            query: String
        },
        func (Request, Response, _, {query}){
           return docSearch.search(query, {length: 15}).map(x => ({text: x.text, link: x.link}))
        }
    }
}