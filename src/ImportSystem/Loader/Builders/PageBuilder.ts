import {createTranspileEnvironment} from './BaseBuilders.js';
import IBuilder from './IBuilder.js';
import PPath from '../../../Settings/PPath.js';
import compileFullPage from '../../../CompilePage/Compile.js';
import STToSourceMapCompute from '../../../SourceTracker/SourceMap/StringTrackerToSourceMap.js';

export default class PageBuilder extends IBuilder<any> {

    async build(file: PPath): Promise<string> {
        const content = await compileFullPage(file);
        const templateContent = createTranspileEnvironment(content.eq, file, []);

        return templateContent + STToSourceMapCompute(content, file).createMapComment();
    }
}