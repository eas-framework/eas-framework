import PPath from "../../Settings/PPath";

export default class STSInfo {


    constructor(public source: PPath, public line: number, public column: number){

    }

    toString(){
        return `${this.source.small}:${this.line}:${this.column}`
    }
}