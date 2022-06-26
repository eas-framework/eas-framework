import { Request, Response } from "../MainBuild/Types";
import updateResponse from "./HTTP/Response";

export default function updateRequestAttributes(req: Request, res: Response){
    updateResponse(res);
}