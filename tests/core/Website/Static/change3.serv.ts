import {getData} from './store.serv'

export function func(){
    return "change(3), data: " + getData();
}