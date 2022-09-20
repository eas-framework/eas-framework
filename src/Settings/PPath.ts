import path from "node:path"
import { SystemError } from "../Logger/ErrorLogger.js"
import { splitFirst } from "../Util/Strings.js"
import { directories, LocateDir, relative } from "./ProjectConsts.js"

class PPathNotFound extends Error {

}

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

    get name() {
        return this.nested.split(path.sep).pop()
    }

    get dirname() {
        const copy = this.clone()
        copy.nested = path.join(path.dirname(this.nested), path.sep)
        return copy
    }

    get ext() {
        return path.extname(this.nested)
    }

    constructor(smallPath: string) {
        this.parse(smallPath)
    }

    static fromNested(locate: LocateDir, nested: string) {
        return new PPath(path.join(locate.virtualName, nested))
    }

    static fromFull(full: string) {
        const [name, rest] = splitFirst(relative(full), path.sep)

        for (const { virtualName, dirName } of Object.values(directories.Locate)) {
            if (name === virtualName) {
                return new PPath(path.join(dirName, rest))
            }
        }

        return null
    }

    private parse(smallPath: string) {
        const [type, rest] = splitFirst(smallPath, path.sep)
        const locate = directories.Locate[type]
        if(locate == null){
            SystemError(
                'error-parsing-ppath',
                new PPathNotFound(`Directories (locate) not found"`, {cause: `parsing the string "${smallPath}"`}),
                true,
                2
            )
        }

        this.locate = locate
        this.nested = rest
    }

    /**
     * Does not create a clone only join
     * @param paths 
     * @returns 
     */
    join(...paths: string[]) {
        this.nested = path.join(this.nested, ...paths)
        return this
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

    clone() {
        const copy = <PPath>Object.create(this)
        copy.locate = this.locate
        copy.nested = this.nested

        return copy
    }
}