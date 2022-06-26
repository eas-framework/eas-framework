import path from "node:path"
import { splitFirst } from "../Util/Strings"
import { directories, LocateDir, relative } from "./ProjectConsts"

export default class PPath {
    public locate: LocateDir
    public nested: string

    get small() {
        return path.join(this.locate.virtualName, this.nested)
    }

    get full() {
        return path.join(this.locate.source, this.nested)
    }

    get compile() {
        return path.join(this.locate.compile, this.nested)
    }

    get name(){
        return this.nested.split(path.sep).pop()
    }

    get dirname(){
        return new PPath(path.dirname(this.small))
    }

    constructor(smallPath: string) {
        this.parse(smallPath)
    }

    static fromNested(locate: LocateDir, nested: string){
        return new PPath(path.join(locate.virtualName, nested))
    }

    static fromFull(full: string) {
        const [name, rest] = splitFirst(relative(full), path.sep)

        for(const {virtualName, dirName} of Object.values(directories.Locate)){
            if(name === virtualName){
                return new PPath(path.join(dirName, rest))
            }
        }
        
        return null
    }

    private parse(smallPath: string) {
        const [type, rest] = splitFirst(smallPath,  path.sep)
        const locate = directories.Locate[type]

        this.locate = locate
        this.nested = rest
    }

    join(...paths: string[]) {
        this.nested = path.join(this.nested, ...paths)
    }
    
    relativeSmall(small: string) {
        return path.relative(this.small, small)
    }

    relativeFull(full: string) {
        return path.relative(this.full, full)
    }

    relativeCompile(compile: string) {
        return path.relative(this.compile, compile)
    }

    toString() {
        return this.small
    }
}