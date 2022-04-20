import path from 'path';
import { customTypes } from '../../ImportFiles/CustomImport/Extension/index';
import { EndOfBlock, EndOfDefSkipBlock, ParseTextStream, ReBuildCodeString } from './EasyScript';

export const SyntaxSettings: {pathAliases: { [key: string]: string }} = {
    pathAliases:  {}
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
        return `${this.actionStringImport(replaceToType, dataObject, index)};Object.assign(exports, ${dataObject})`;
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

        function Rematch() {
            match = newString.match(new RegExp(`${type}[\\s]+([\\*]{0,1}[\\p{L}0-9_,\\{\\}\\s]+)[\\s]+from[\\s]+<\\|([0-9]+)\\|\\|>`, 'u'));
        }

        Rematch();

        while (match) {
            const data = match[1].trim();
            beforeString += newString.substring(0, match.index);
            newString = newString.substring(match.index + match[0].length);

            if (/^type\s/.test(data)) {
                Rematch();
                continue;
            }

            let DataObject: string;

            if (data[0] == '*') {
                DataObject = data.substring(1).replace(' as ', '').trimStart();
            } else {
                let Spliced: string[] = [];

                if (data[0] == '{') {
                    Spliced = data.split('}', 2);
                    Spliced[0] += '}';
                    if (Spliced[1])
                        Spliced[1] = Spliced[1].split(',').pop();
                } else {
                    Spliced = data.split(',', 1).reverse();
                }

                Spliced = Spliced.map(x => x.trim()).filter(x => x.length);

                if (Spliced.length == 1) {
                    if (Spliced[0][0] == '{') {
                        DataObject = Spliced[0];
                    } else {
                        let extension = this.Build.AllInputs[match[2]];
                        extension = extension.substring(extension.lastIndexOf('.') + 1, extension.length - 1);
                        if (customTypes.includes(extension))
                            DataObject = Spliced[0];
                        else
                            DataObject = `{default:${Spliced[0]}}`; //only if this isn't custom import
                    }
                } else {

                    DataObject = Spliced[0];

                    DataObject = `${DataObject.substring(0, DataObject.length - 1)},default:${Spliced[1]}}`;
                }

                DataObject = DataObject.replace(/ as /, ':');
            }

            beforeString += actionString(replaceToType, DataObject, match[2]);

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
            match = newString.match(new RegExp(type + '[\\s]+<\\|([0-9]+)\\|\\|>'));
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
            match = newString.match(/(export[\s]+)(default[\s]+)?([^\s])/u);
        }

        Rematch();

        while (match) {
            let beforeMatch = newString.substring(0, match.index);
            let removeExport = match[0].substring(match[1].length + (match[2] || '').length);
            let afterMatch = newString.substring(match.index + match[0].length - 1);

            if (/^(type|interface)\s/.test(afterMatch)) { // only removing the export, typescript will do the rest
                newString = beforeMatch + afterMatch;
                Rematch();
                continue
            }

            const firstChar = match[3][0], isDefault = Boolean(match[2]);
            if (firstChar == '{') {
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
                const blockMatch = beforeClose.match(/(function|class)[ |\n]+([\p{L}\$_][\p{L}0-9\$_]*)?/u);

                if (blockMatch?.[2]) {
                    const afterClose = afterMatch.substring(closeIndex);

                    newString = `${beforeMatch + removeExport + beforeClose}exports.${isDefault ? 'default' : blockMatch[2]}=${blockMatch[2]}${afterClose}`;
                } else if (isDefault) {
                    newString = beforeMatch + 'exports.default=' + removeExport + afterMatch;
                } else {
                    newString = `${beforeMatch}exports.${beforeClose.split(/ |\n/, 1).pop()}=${removeExport + afterMatch}`;
                }
            }

            Rematch();
        }

        this.Build.CodeBuildText = newString;
    }

    async BuildImports(defineData?: { [key: string]: string }) {
        this.BuildImportType('import', 'require');
        this.BuildImportType('export', 'require', this.actionStringExport);
        this.BuildImportType('include');

        this.BuildInOneWord('import', 'require');
        this.BuildInOneWord('export', 'require', this.actionStringExportAll);
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
        return code.substring(1, code.length - 1);
    }
}