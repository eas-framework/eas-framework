export default class ArrayGetter<T> {
    constructor(public array: { key: string, value: T }[]) {
    }

    get(name: string) {
        return this.array.find(x => x.key === name)?.value;
    }

    getAny(name: string) {
        return this.array.find(x => x.key.toLowerCase() === name)?.value;
    }

    pop(name: string) {
        return this.array.splice(this.array.findIndex(x => x.key === name), 1)[0]?.value;
    }

    popAny(name: string) {
        name = name.toLowerCase();
        const haveName = this.array.findIndex(x => x.key.toLowerCase() == name);

        if (haveName != -1) {
            return this.array.splice(haveName, 1)[0].value;
        }
    }

    replaceValue(name: string, value: T) {
        const have = this.array.find(x => x.key === name);
        if (have) have.value = value;
    }
}