import {func as change2} from './from2.serv'

export function func(){
    return "this 1, " + change2();
}