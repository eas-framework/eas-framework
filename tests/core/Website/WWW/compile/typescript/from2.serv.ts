import 'reflect-metadata'
import type {me} from './from1.serv'
import {d} from './from1.serv'

console.log('d: ', d)

function logType(target : any, key : string) {
    var t = Reflect.getMetadata("design:type", target, key);
    console.log(`${key} type: ${t.name}`);
  }


export const up: me = {
    a: 1
}

export class Demo {
    @logType
    data: boolean
}