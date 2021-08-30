import {getData} from './store.serv'

export function func(){
    return "change(8), data: " + getData();
}