import RequestWarper from "../ProcessURL/RequestWarper";
import RequestParser from "./RequestParser";
import fileSender from "./Senders/StaticFile";






export default async function switchContent(warper: RequestWarper){
    const parser = new RequestParser(warper)
    fileSender(parser)
}