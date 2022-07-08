import path from "node:path"

export function normalize(file: string) {
    file = file.toLowerCase()
    file = path.normalize(file)
    return file
}