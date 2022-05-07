import { Response } from "../../MainBuild/Types";

function json(data: any){
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this
}

export default function updateResponse(response: Response) {
    response.json = json;
}