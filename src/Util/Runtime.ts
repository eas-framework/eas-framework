import { splitFirst } from "./Strings.js"

/**
 * It takes a number, and returns the location of the function call that is that many levels up the
 * stack
 * @param {number} goBack - number
 * @returns The location of the error.
 */
 export function getLocationStack(goBack: number) {
    const [_, stack] = splitFirst(new Error().stack, 'at ')
    const location = stack.split('\n')[goBack]

    return location && splitFirst(location, 'at ').pop().trim() || ''
}