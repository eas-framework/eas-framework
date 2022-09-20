import RequestParser from "../../RequestParser.js";
import { sendStaticResource } from "./CustomHooks/index.js";

/**
 * > It sends a static resource to the client (only if it is a static resource)
 * @param {RequestWarper} warper - RequestWarper
 * @returns is that a static resource
 */
export default async function fileSender(parser: RequestParser) {
    const thisStatic = await sendStaticResource(parser.warper)

    if (thisStatic) { // if it is then clear the request resources
       await parser.clear()
    }

    return thisStatic
}