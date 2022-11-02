import RequestParser from "../../RequestParser.js";
import {sendStaticResource} from "./CustomHooks/index.js";

/**
 * > It sends a static resource to the client (only if it is a static resource)
 * @param {RequestWrapper} wrapper - RequestWrapper
 * @returns is that a static resource
 */
export default async function fileSender(parser: RequestParser) {
    return await sendStaticResource(parser.wrapper);
}