import assert from 'assert';
import '../../src/Settings/index.js';
import BaseParser from '../../src/CompilePage/Templating/Placeholders/PageBuilder/PageParse.js';
import {BaseParserBlock} from '../../src/CompilePage/Templating/Placeholders/PageBuilder/BaseParser.js';
import {getWebsiteModel} from './contents/pageTemplate.js';
import fullPageBuilder from '../../src/CompilePage/Templating/Placeholders/PageBuilder/index.js';
import indexPageBuildOutput from './contents/sample-website/src/index.page.expected-output.js';
import {GlobalSettings} from '../../src/Settings/GlobalSettings.js';
import {getMockSession} from './contents/compileRuntime.js';
import {getMockPage, setDirectoriesToSampleWebsite} from './contents/mock-website.js';

function rewriteValue(data: BaseParserBlock[]) {
    return data.map(x => ({...x, value: typeof x.value == 'boolean' ? x.value : x.value.eq}));
}

describe("Parse page", () => {

    const parse = new BaseParser(getWebsiteModel());

    it('base values', async () => {
        GlobalSettings.development = true;

        await parse.parseBase();

        assert.equal(
            JSON.stringify(rewriteValue(parse.base.values)),
            '[{"key":"codeFile","value":"inherit","char":"\'"}]'
        );

    });


    it('placeholders values', () => {
        GlobalSettings.development = true;

        parse.parseValues();

        assert.equal(
            JSON.stringify(rewriteValue(parse.values)),
            '[{"key":"insert","value":"\\n    moo\\n    "}]'
        );

    });


    it('placeholders', () => {
        GlobalSettings.development = true;

        parse.parsePlaceHolder();

        assert.equal(
            JSON.stringify(parse.locations),
            '[{"name":"title","start":212,"end":10},{"name":"head","start":576,"end":9},{"name":"body","start":1371,"end":9}]'
        );

    });
});

describe("Page builder", () => {
    setDirectoriesToSampleWebsite();
    it('Build with template', async () => {
        GlobalSettings.development = true;

        const page = await fullPageBuilder(getMockPage(), getMockSession());

        assert.equal(indexPageBuildOutput, page.eq);
    });
});