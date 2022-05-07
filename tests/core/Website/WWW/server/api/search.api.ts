import { SearchRecord } from '@eas-framework/server'

const docSearch = new SearchRecord('records/search.serv')
await docSearch.load()

const mapResult = (d: any[]) => d.map(x => ({ text: x.text, link: x.link }))

export default {
    GET: {
        define: {
            query: String
        },
        count: {
            define: {
                number: Number
            },
            func(Request, Response, _, { query, number }) {
                return Math.min(number, mapResult(docSearch.search(query, { length: 15 })).length)
            }
        },
        first: {
            func(Request, Response, _, { query }) {
                return mapResult(docSearch.search(query, { length: 15 })).pop() || 'Not found'
            }
        },
        func(Request, Response, _, { query }) {
            return mapResult(docSearch.search(query, { length: 15 }))
        }
    }
}