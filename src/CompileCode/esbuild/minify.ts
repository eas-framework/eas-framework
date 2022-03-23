import { build, Message, transform } from 'esbuild-wasm';
import StringTracker from '../../EasyDebug/StringTracker';
import { ESBuildPrintErrorStringTracker, ESBuildPrintWarningsStringTracker } from './printMessage';


export async function minifyJS(text: string, tracker: StringTracker){
    try {
        const {code, warnings} = await transform(text, {minify: true});
        ESBuildPrintWarningsStringTracker(tracker, warnings);
        return code;
    } catch(err) {
        ESBuildPrintErrorStringTracker(tracker, err)
    }
    return text;
}