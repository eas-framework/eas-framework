import {func as change3} from './from3.serv'

const oncRandom = Math.random().toFixed(3)

export function func(){
    return `this 2 --${oncRandom}--, ` + change3();
}