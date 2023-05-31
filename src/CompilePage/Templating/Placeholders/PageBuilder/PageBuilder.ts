import PPath from '../../../../Settings/PPath.js';
import StringTracker from '../../../../SourceTracker/StringTracker/StringTracker.js';
import {SessionBuild} from '../../../Session.js';
import ArrayGetter from './ArrayGetter.js';
import {BaseParserBlock} from './BaseParser.js';
import CRunTime from './CompileRuntime/Compile.js';
import LoadCodeFile from './LoadCodeFile/index.js';
import PageParse from './PageParse.js';
import {checkDynamicSSR, filterInherit} from './utils.js';
import {findFileImport} from '../../../utils.js';
import {directories, ScriptExtension} from '../../../../Settings/ProjectConsts.js';
import easyFS from '../../../../Util/EasyFS.js';
import {SystemLog} from '../../../../Logger/BasicLogger.js';
import ModelNotFoundError from './Errors/ModelNotFound.js';
import PageNotFoundError from './Errors/PageNotFound.js';

export class PageBuilder extends PageParse {
    inheritValues: BaseParserBlock[];
    codeFileScript = new StringTracker();

    constructor(content: StringTracker, public session: SessionBuild, public previous?: PageBuilder) {
        super(content);
    }

    private async addScriptFile() {
        const codeFile = new LoadCodeFile(this, this.content);
        const codeContent = (await codeFile.load())?.stContent;

        if (codeContent) {
            this.codeFileScript = codeContent;
        }
    }

    async build(source: PPath, previousSource: PPath) {
        await this.parseBase();

        /* Checks if the SSR is dynamic and check if it has a dynamic attribute, if not skip this SSR  */
        if (this.session.dynamic && !await checkDynamicSSR(this.base, this.session)) {
            return false;
        }
        this.session.dynamic = false;

        await this.addScriptFile();

        const run = new CRunTime(this.content, this.session, source);
        this.content = await run.compile({}, previousSource);

        this.parsePlaceHolder();
        this.fillPlaceHolders();

        this.parseValues();
        this.fillServerValue();

        this.inheritValues = filterInherit(this.base);
        this.connectBaseInheritToValues();
        this.connectBaseValues();

        await this.connectModel();
    }

    /**
     * Add code from `<content:server>` to the script file place
     */
    private fillServerValue() {
        const serverValue = new ArrayGetter(this.values).pop('server');
        if (serverValue == null) return;

        this.codeFileScript.plus(serverValue);
    }

    /**
     * Fill placeholders with values from previous page
     */
    private fillPlaceHolders() {
        if (!this.previous) return;

        let shift = 0;
        for (const {name, start, end} of this.locations) {
            const value = this.previous.values.find(x => x.key === name)?.value ?? '';
            this.content = this.content.slice(0, start + shift).plus(value, this.content.slice(start + end + shift));
            shift += start + end + (value.length - end); // this diff between the length of old and new value
        }

    }

    private connectBaseValues() {
        for (const {key, value} of this.base.values) {
            this.values.push({
                key,
                value: value instanceof StringTracker ? value : new StringTracker(value.toString())
            });
        }
    }

    /**
     * Connect previous value as inherit values, if the placeholder is 'inherit'
     */
    private connectBaseInheritToValues() {
        if (!this.previous) return;

        const previousValues = new ArrayGetter(this.previous.values);

        for (const {key} of this.inheritValues) {
            const findInherit = previousValues.get(key);

            if (findInherit instanceof StringTracker) {
                this.values.push({value: findInherit, key});
            }
        }
    }

    private async connectModel() {
        const model = new ArrayGetter(this.base.values).popAny('model');
        if (!model || typeof model === 'boolean') return;

        const masterModel = findFileImport(
            model.eq,
            model.topSource,
            directories.Locate.static,
            ScriptExtension.pages.model
        );

        const fileContent = await easyFS.readFile(masterModel.full, 'utf8', true);
        if (fileContent == null) {
            SystemLog.error('building-page-model', new ModelNotFoundError(model.topCharStack, masterModel));
            return;
        }
        await this.session.dependencies.updateDep(masterModel);

        const modelStringTracker = StringTracker.fromST(fileContent, masterModel, model);
        const buildWithModel = new PageBuilder(modelStringTracker, this.session, this);

        await buildWithModel.build(masterModel, model.topSource);

        this.codeFileScript = buildWithModel.codeFileScript.plus(this.codeFileScript);
        this.content = buildWithModel.content;
    }

    static async newPage(page: PPath, session: SessionBuild) {
        const fileContent = await easyFS.readFile(page.full, 'utf8', true);
        if (fileContent == null) {
            SystemLog.error('building-page', new PageNotFoundError(page));
            return;
        }

        const pageStringTracker = StringTracker.fromTextFile(fileContent, page);
        return new PageBuilder(pageStringTracker, session);
    }
}