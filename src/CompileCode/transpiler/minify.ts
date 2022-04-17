import { minify } from '@swc/core';
import StringTracker from '../../EasyDebug/StringTracker';
import { ESBuildPrintErrorStringTracker } from './printMessage';


export async function minifyJS(text: string, tracker: StringTracker){
    try {
        return (await minify(text)).code
    } catch(err) {
        ESBuildPrintErrorStringTracker(tracker, err)
    }
    return text;
}