import assert from 'assert';
import '../../src/Settings/index.js';
import BaseParser from '../../src/CompilePage/Templating/Placeholders/PageBuilder/PageParse.js'
import {PageBuilder} from '../../src/CompilePage/Templating/Placeholders/PageBuilder/PageBuilder.js'
import { BaseParserBlock } from '../../src/CompilePage/Templating/Placeholders/PageBuilder/BaseParser.js';
import { websiteModel, websiteSimpleModel } from './contents/pageTemplate.js';
import { MOCK_SESSION, SOURCE_FILE } from './contents/compileRuntime.js';

function rewriteValue(data: BaseParserBlock[]){
    return data.map(x => ({...x, value:  typeof x.value == 'boolean' ? x.value: x.value.eq}))
}

describe("Parse page", () => {

    const parse = new BaseParser(websiteModel)

    it('base values', async() => {
        await parse.parseBase()
        
        assert.equal(
            JSON.stringify(rewriteValue(parse.base.values)),
            '[{"key":"codeFile","value":"inherit","char":"\'"}]'
        )
        
    })


    it('placeholders values', () => {
        parse.parseValues()

        assert.equal(
            JSON.stringify(rewriteValue(parse.values)),
            '[{"key":"insert","value":"\\n    moo\\n    "}]'
        )
        
    })


    it('placeholders', () => {
        parse.parsePlaceHolder()

        assert.equal(
            JSON.stringify(parse.locations),
            '[{"name":"title","start":212,"end":8},{"name":"head","start":578,"end":7},{"name":"body","start":1373,"end":7}]'
        )
        
    })
})

describe("Page builder", () => {

    const page = new PageBuilder(websiteSimpleModel, MOCK_SESSION)

    it('Parse page + compile runtime', async () => {
        assert.notEqual(await page.build(SOURCE_FILE, MOCK_SESSION.file), false)
    })

    it('values',  () => {
        debugger
    })

})