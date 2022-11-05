import {find_end_block, find_end_of_def, find_end_of_q} from '../../StaticFiles/wasm/component/index.js';

export type ParseBlocks = { name: string, start: number, end: number }[]


/**
 * Find the end of quotation marks, skipping things like escaping: "\\""
 * @return the index of end
 */
export function findEntOfQ(text: string, qType: string): number {
    return find_end_of_q(text, qType);
}

/**
 * Find char skipping data inside quotation marks
 * @return the index of end
 */
export function findEndOfDef(text: string, EndType: string[] | string): number {
    if (!Array.isArray(EndType)) {
        EndType = [EndType];
    }

    return find_end_of_def(text, JSON.stringify(EndType));
}

/**
 * Same as 'findEndOfDef' only with option to custom 'open' and 'close'
 * ```js
 * FindEndOfBlock(`cool "}" { data } } next`, '{', '}')
 * ```
 * it will return the 18 -> "} next"
 *  @return the index of end
 */
export function findEndOfBlock(text: string, open: string, end: string): number {
    return find_end_block(text, open + end);
}