let printMode = true;
export function allowPrint(d) {
    printMode = d;
}
export const print = new Proxy(console, {
    get(target, prop, receiver) {
        if (printMode)
            return target[prop];
        return () => { };
    }
});
//# sourceMappingURL=Console.js.map