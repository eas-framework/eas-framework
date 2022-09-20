import RequestWarper from "../ProcessURL/RequestWarper.js";
import RequestParser from "./RequestParser.js";
import fileSender from "./Senders/StaticFile/index.js";






export default async function switchContent(warper: RequestWarper){
    const parser = new RequestParser(warper)
    fileSender(parser)
}