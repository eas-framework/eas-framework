let DevMode_ = true;

export function SetDevMode(d: boolean) {
    DevMode_ = d;
}

export class print {
    static log(...p:any) {
        if (DevMode_) {
            console.log(p.shift(), ...p);
        }
    }

    static error(...p:any) {
        if (DevMode_) {
            console.log(p.shift(), ...p);
        }
    }

    static warn(...p:any) {
        if (DevMode_) {
            console.warn(p.shift(), ...p);
        }
    }
}
