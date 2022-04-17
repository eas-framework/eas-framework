import {func as change2} from './from2.serv'

const oncRandom = Math.random().toFixed(3)

export function func(){
    return `this 1 --${oncRandom}--, ` + change2();
}