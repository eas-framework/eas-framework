let DevMode_ = true;
export function SetDevMode(d) {
    DevMode_ = d;
}
export const print = new Proxy(console, {
    get(target, prop, receiver) {
        if (true)
            return target[prop];
        return () => { };
    }
});
//# sourceMappingURL=Console.js.map