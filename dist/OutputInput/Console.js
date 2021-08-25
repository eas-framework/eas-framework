let DevMode_ = true;
export function SetDevMode(d) {
    DevMode_ = d;
}
export class print {
    static log(...p) {
        if (DevMode_) {
            console.log(p.shift(), ...p);
        }
    }
    static error(...p) {
        if (DevMode_) {
            console.log(p.shift(), ...p);
        }
    }
    static warn(...p) {
        if (DevMode_) {
            console.warn(p.shift(), ...p);
        }
    }
}
