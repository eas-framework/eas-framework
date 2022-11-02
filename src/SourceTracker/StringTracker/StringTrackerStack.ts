import STSInfo from "./STSInfo.js";

export default class StringTrackerStack {

    constructor(private stack: STSInfo[] = []) {

    }

    get hiddenStack() {
        return this.stack;
    }

    get length() {
        return this.stack.length;
    }

    push(info: STSInfo) {
        this.stack.push(info);
    }

    top() {
        return this.stack.at(-1);
    }

    clone() {
        return new StringTrackerStack([...this.stack]);
    }

    toString() {
        return this.stack.map(info => info.toString()).join(" ->\n");
    }
}

export const EMPTY_STACK = new StringTrackerStack();
Object.freeze(EMPTY_STACK.hiddenStack);