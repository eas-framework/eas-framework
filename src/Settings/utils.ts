import { GlobalSettings } from "./GlobalSettings";


export function getPlugin(name: string): any {
    return GlobalSettings.compile.plugins.find((p: any) => p == name || p.name === name)
}

export function hasPlugin(name: string){
    return getPlugin(name) != null
}