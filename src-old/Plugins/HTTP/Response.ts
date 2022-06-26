import { Response } from "../../MainBuild/Types";

function json(data: any){
    this.type('json');
    this.end(JSON.stringify(data));
    return this
}

export default function updateResponse(response: Response) {
    response.json = json;
}