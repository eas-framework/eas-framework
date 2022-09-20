import PPath from "../../Settings/PPath.js";

export default class STSInfo {


    constructor(public source: PPath, public line: number, public column: number){

    }

    toString(){
        return `${this.source.small}:${this.line}:${this.column}`
    }
}