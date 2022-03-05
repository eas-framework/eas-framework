let printMode = true;

export function allowPrint(d: boolean) {
    printMode = d;
}

export const print = new Proxy(console,{
    get(target, prop, receiver) {
        if(printMode)
            return target[prop];
        return () => {}
    }
});