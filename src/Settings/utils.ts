import { GlobalSettings } from "./GlobalSettings";
const SAFE_DEBUG = 'SafeDebug';

export function getPlugin(name: string): any {
    return GlobalSettings.compile.plugins.find((p: any) => p == name || p.name === name)
}

export function hasPlugin(name: string){
    return getPlugin(name) != null
}

export function safeDebug(){
    return hasPlugin(SAFE_DEBUG)
}