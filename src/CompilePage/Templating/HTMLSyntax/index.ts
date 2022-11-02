/**
 * Rewrite HTML syntax
 *
 * ```jsx
 * <div @class={{name: 1, what: 0}} @class={{name2: 1, what2: 0}} @disabled={true}></div>
 * ```
 */
import StringTracker from '../../../SourceTracker/StringTracker/StringTracker.js';

export default async function rewriteHTMLSyntax(content: StringTracker) {
    //TODO: build html syntax convertor
    return content;
}