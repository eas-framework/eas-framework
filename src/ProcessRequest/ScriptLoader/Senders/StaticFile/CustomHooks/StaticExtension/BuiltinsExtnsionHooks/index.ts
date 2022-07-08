import path from "node:path"
import compileSvelte from "../../../../../../../Compilers/Svelte/Client"
import DepCreator from "../../../../../../../ImportSystem/Dependencies/DepCreator"
import PPath from "../../../../../../../Settings/PPath"
import { compileJS, compileJSX, compileTS, compileTSX } from "./Compilers/Script"
import { compileSass } from "./Compilers/Style"

export const SUPPORTED_TYPES = ['js', 'ts', 'jsx', 'tsx', 'svelte', 'css', 'sass', 'scss'];

export async function compileByExtension(file: PPath, depSession: DepCreator) {
    const ext = file.ext.substring(1).toLowerCase()

    switch (ext) {
        case 'js':
            await compileJS(file, depSession)
            break
        case 'ts':
            await compileTS(file, depSession)
            break
        case 'jsx':
            await compileJSX(file, depSession)
            break
        case 'tsx':
            await compileTSX(file, depSession)
            break
        case 'svelte':
            await compileSvelte(file, depSession)
            break
        case 'css':
        case 'sass':
        case 'scss':
            await compileSass(file, depSession, ext)
            break
    }
}