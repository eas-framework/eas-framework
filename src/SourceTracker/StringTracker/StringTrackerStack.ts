import STSInfo from "./STSInfo";

export default class StringTrackerStack {

    constructor(private stack: STSInfo[] = []) {

    }

    get length(){
        return this.stack.length
    }

    push(info: STSInfo) {
        this.stack.push(info)
    }

    top(){
        return this.stack.at(-1)
    }

    clone(){
        return new StringTrackerStack([...this.stack])
    }

    toString(){
        return this.stack.map(info => info.toString()).join("->\n")
    }
}