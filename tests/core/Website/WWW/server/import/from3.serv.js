import * as all from '@eas-framework/server';
const oncRandom = Math.random().toFixed(3);
export function func() {
    console.log(all);
    return ` this 3 --${oncRandom}--`;
}
