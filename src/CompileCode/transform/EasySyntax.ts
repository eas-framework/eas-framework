import path from 'path';
import { customTypes } from '../../ImportFiles/CustomImport/Extension/index';
import { EndOfBlock, EndOfDefSkipBlock, ParseTextStream, ReBuildCodeString } from './EasyScript';

export const SyntaxSettings: { pathAliases: { [key: string]: string } } = {
    pathAliases: {}
}

export default class EasySyntax {
    private Build: ReBuildCodeString;

    async load(code: string) {
        const parseArray = await ParseTextStream(code);
        this.Build = new ReBuildCodeString(parseArray);

        this.actionStringImport = this.actionStringImport.bind(this);
        this.actionStringImportAll = this.actionStringImportAll.bind(this);
        this.actionStringExport = this.actionStringExport.bind(this);
        this.actionStringExportAll = this.actionStringExportAll.bind(this);
    }

    private changeAlias(index: string) {
        let original = this.Build.AllInputs[index]

        for (const start in SyntaxSettings.pathAliases) {
            if (original.substring(1).startsWith(start)) {
                original = original[0] + path.join(SyntaxSettings.pathAliases[start], original.substring(start.length + 1))
                break
            }
        }

        this.Build.AllInputs[index] = original
    }

    private actionStringImport(replaceToType: string, dataObject: string, index: string) {
        this.changeAlias(index);
        return `var ${dataObject} = await ${replaceToType}(<|${index}||>)`;
    }

    private actionStringExport(replaceToType: string, dataObject: string, index: string) {
        let values = dataObject
            .trim()
            .slice(1, - 1) // removing { and }
            .split(',') // splitting by ,
            .map(x => x.split(':').pop()) // getting values from key:value
            .join(',') // {a:b, c:d} -> b,d
        return `{${this.actionStringImport(replaceToType, dataObject, index)};Object.assign(exports, {${values}})}`;
    }

    private actionStringImportAll(replaceToType: string, index: string) {
        this.changeAlias(index);
        return `await ${replaceToType}(<|${index}||>)`;
    }

    private actionStringExportAll(replaceToType: string, index: string) {
        return `Object.assign(exports, ${this.actionStringImportAll(replaceToType, index)})`;
    }

    private BuildImportType(type: string, replaceToType = type, actionString: (replaceToType: string, dataObject: string, index: string) => string = this.actionStringImport) {
        let beforeString = "";
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        /**
         * **ESM Module search**
         * - (\s([\p{L}0-9_]+)\s*,\s*(\{([\p{L}0-9_,\s]*)\}))  - import {a, b}, def from './path'
         * - ((\*\s*as)?\s+([\p{L}0-9_]+)\s)  - import a from './path' **or** import * as a from './path'
         * - (\{([\p{L}0-9_,\s]*)\})  - import {a, b} from './path'
         *
         * **Template**
         * 
         * import(\s+type)?[\s]*
         *
         * **one ot the options**
         * 
         * [\s]*from[\s]*<\|([0-9]+)\|\|>
         */
        function Rematch() {
            match = newString.match(new RegExp(`${type}(\\s+type)?[\\s]*((\\s([\\p{L}0-9_]+)\\s*,\\s*(\\{([\\p{L}0-9_,\\s]*)\\}))|((\\*\\s*as)?\\s+([\\p{L}0-9_]+)\\s)|(\\{([\\p{L}0-9_,\\s]*)\\}))[\\s]*from[\\s]*<\\|([0-9]+)\\|\\|>`, 'u'));
        }

        Rematch();

        while (match) {
            const data = match[2].trim();
            beforeString += newString.substring(0, match.index);
            newString = newString.substring(match.index + match[0].length);

            if (match[1]) { // if this importing of type -> import type {a} from './path'
                Rematch();
                continue;
            }

            let DataObject: string;
            const asToObject = (x: string) => x.replace(/\sas\s/g, ':');

            if (match[10] || data[0] == '*') {// import {a, b} from './path' **or** import * as a from './path'
                DataObject = match[10] && asToObject(match[10]) || match[9];
            } else {

                if (match[4] && match[6]) { // import a, {b} from './path'
                    DataObject = `{default:${match[4]},${asToObject(match[6])}}`
                }
                else if (match[4] ?? match[9]) { // import a from './path'
                    DataObject = `{default:${match[4] ?? match[9]}}`
                }
            }

            beforeString += actionString(replaceToType, DataObject, match[12]); // match[12] - index of import string, for example: <|1||>

            Rematch();
        }

        beforeString += newString;

        this.Build.CodeBuildText = beforeString;
    }

    private BuildInOneWord(type: string, replaceToType = type, actionString: (replaceToType: string, index: string) => string = this.actionStringImportAll) {
        let beforeString = "";
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        function Rematch() {
            match = newString.match(new RegExp(type + '[\\s]*<\\|([0-9]+)\\|\\|>'));
        }

        Rematch();

        while (match) {
            beforeString += newString.substring(0, match.index);
            newString = newString.substring(match.index + match[0].length);


            beforeString += actionString(replaceToType, match[1]);

            Rematch();
        }

        beforeString += newString;

        this.Build.CodeBuildText = beforeString;
    }

    private replaceWithSpace(func: (text: string) => string) {
        this.Build.CodeBuildText = func(' ' + this.Build.CodeBuildText).substring(1);
    }

    private Define(data: { [key: string]: string }) {
        for (const [key, value] of Object.entries(data)) {
            this.replaceWithSpace(text => text.replace(new RegExp(`([^\\p{L}])${key}([^\\p{L}])`, 'gui'), (...match) => {
                return match[1] + value + match[2]
            }));
        }
    }

    private BuildInAsFunction(word: string, toWord: string) {
        this.replaceWithSpace(text => text.replace(new RegExp(`([^\\p{L}])${word}([\\s]*\\()`, 'gui'), (...match) => {
            return match[1] + toWord + match[2]
        }));
    }

    /**
     * export * from './path'
     */
    private async exportAnyFrom(require = 'require') {
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        function Rematch() {
            match = newString.match(/export\s*\*\s*from\s*<\|([0-9]+)\|\|>/);
        }

        Rematch();

        while (match) {
            const beforeMatch = newString.substring(0, match.index);
            const afterMatch = newString.substring(match.index + match[0].length);
            const index = match[1]

            newString = beforeMatch + this.actionStringExportAll(require, index) + afterMatch

            Rematch();
        }

        this.Build.CodeBuildText = newString;
    }

    private async exportVariable() {
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        function Rematch() {
            match = newString.match(/(export[\s]+)(var|let|const)[\s]+([\p{L}\$_][\p{L}0-9\$_]*)/u);
        }

        Rematch();

        while (match) {
            const beforeMatch = newString.substring(0, match.index);
            const removeExport = match[0].substring(match[1].length);
            const afterMatch = newString.substring(match.index + match[0].length);

            let closeIndex = await EndOfDefSkipBlock(afterMatch, [';', '\n']);

            if (closeIndex == -1) {
                closeIndex = afterMatch.length
            }

            const beforeClose = afterMatch.substring(0, closeIndex), afterClose = afterMatch.substring(closeIndex);
            newString = `${beforeMatch + removeExport + beforeClose};exports.${match[3]}=${match[3]}${afterClose}`;

            Rematch();
        }

        this.Build.CodeBuildText = newString;
    }

    private async exportBlock() {
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        function Rematch() {
            match = newString.match(/(export[\s]+)(default[\s|{|\[|\(][\s]*)?([^\s])/u);
        }

        Rematch();

        while (match) {
            let beforeMatch = newString.substring(0, match.index);
            let removeExport = match[0].substring(match[1].length + (match[2] || ' ').length - 1);
            let afterMatch = newString.substring(match.index + match[0].length - 1);

            if (/^(type|interface)\s/.test(afterMatch)) { // only removing the export, typescript will do the rest
                newString = beforeMatch + afterMatch;
                Rematch();
                continue
            }

            const firstChar = match[3][0], isDefault = Boolean(match[2]);
            if (firstChar == '{' || match[2]?.at?.(-1) == '{') {
                afterMatch = afterMatch.substring(1);

                if (isDefault) {
                    newString = beforeMatch + 'exports.default=' + removeExport + afterMatch;
                } else {
                    const endIndex = await EndOfBlock(afterMatch, ['{', '}']);
                    beforeMatch += `Object.assign(exports, ${removeExport + afterMatch.substring(0, endIndex + 1)})`;
                    newString = beforeMatch + afterMatch.substring(endIndex + 1);
                }
            } else {
                removeExport = removeExport.slice(0, -1);

                let closeIndex = await EndOfDefSkipBlock(afterMatch, [';', '\n']);
                if (closeIndex == -1) {
                    closeIndex = afterMatch.trimEnd().length
                }

                const beforeClose = afterMatch.substring(0, closeIndex);
                const blockMatch = beforeClose.match(/(function|class)[\s]+([\p{L}\$_][\p{L}0-9\$_]*)?/u);

                if (blockMatch?.[2]) {
                    const afterClose = afterMatch.substring(closeIndex);

                    newString = `${beforeMatch + removeExport + beforeClose}exports.${isDefault ? 'default' : blockMatch[2]}=${blockMatch[2]}${afterClose}`;
                } else if (isDefault) {
                    newString = beforeMatch + 'exports.default=' + removeExport + afterMatch;
                } else {
                    newString = `${beforeMatch}exports.${beforeClose.split(/\s/, 1).pop()}=${removeExport + afterMatch}`;
                }
            }

            Rematch();
        }

        this.Build.CodeBuildText = newString;
    }

    async BuildImports(defineData?: { [key: string]: string }) {
        this.BuildImportType('import', 'require');

        this.exportAnyFrom('require');
        this.BuildImportType('export', 'require', this.actionStringExport);
        this.BuildImportType('include');

        this.BuildInOneWord('import', 'require');
        this.BuildInOneWord('include');

        this.BuildInAsFunction('import', 'require');

        //esm to cjs - export
        await this.exportVariable();
        await this.exportBlock();

        defineData && this.Define(defineData);
    }

    BuiltString() {
        return this.Build.BuildCode();
    }

    static async BuildAndExportImports(code: string, defineData?: { [key: string]: string }) {
        const builder = new EasySyntax();
        await builder.load(` ${code} `);
        await builder.BuildImports(defineData);

        code = builder.BuiltString();
        return code.substring(1).trimEnd();
    }
}