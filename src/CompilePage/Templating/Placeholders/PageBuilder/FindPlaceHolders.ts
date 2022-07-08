import StringTracker, { ArrayMatch } from "../../../../SourceTracker/StringTracker/StringTracker";
const PLACE_HOLDER_TEXT = ':'
const VALUE_TEXT = 'content:'
const ALLOWED_NAME = '[a-z_-][A-Z0-9_-]'

export type PlaceHolder = {
    name: string,
    start: number,
    end: number
}

export class FindPlaceHolderNames{
    public static regex = FindPlaceHolderNames.placeholderRegex(ALLOWED_NAME)
    public locations: PlaceHolder[] = []

    find(code: string){
        const start = code.search(FindPlaceHolderNames.regex)

        if (start == -1) {
            return
        }

        const next = code.slice(start+ 1 + PLACE_HOLDER_TEXT.length) // 1 for '<'
        const end = next.search(/\/>/)

        if (end == -1) {
            throw new Error('Invalid PlaceHolder: ' + code)
        }

        this.locations.push({
            name: next.slice(0, end).trimEnd(),
            start,
            end: end + 2 // 2 for '/>'
        })

        this.find(next.slice(end))

        return this.locations
    }

    static placeholderRegex(name: string){
        return new RegExp(`<${PLACE_HOLDER_TEXT+name}\\s*/>`, 'g')
    }
}

export type PlaceholderValue = {
    key: string,
    value: StringTracker
}

export class FindPlaceholderValues {
    public static regex = FindPlaceholderValues.valueRegex(ALLOWED_NAME)

    public clearCode: StringTracker = new StringTracker()
    public values: PlaceholderValue[] = []

    find(code: StringTracker){
        const value = <ArrayMatch>code.match(FindPlaceholderValues.regex)

        if(value == null){
            this.clearCode.plus(code)
            return
        }

        this.clearCode.plus(code.slice(0, value.index))
        this.values.push({
            key: value[1].eq,
            value: value[2]
        })
        this.find(code.slice(value.index + value[0].length))

        return this.values
    }

    static valueRegex(name: string){
        return new RegExp(`<${VALUE_TEXT}(${name})\\s*>(.*?)</${VALUE_TEXT}\\1\\s*>`, 'g')
    }
}