import { ParseTextStream, ReBuildCodeString } from '../ScriptReader/EasyScript.js';
export default class EasySyntax {
    Build;
    async load(code) {
        const parseArray = await ParseTextStream(code);
        this.Build = new ReBuildCodeString(parseArray);
        this.actionStringExport = this.actionStringExport.bind(this);
        this.actionStringExportAll = this.actionStringExportAll.bind(this);
    }
    actionStringImport(replaceToType, dataObject) {
        return `const ${dataObject} = await ${replaceToType}(<||>)`;
    }
    actionStringExport(replaceToType, dataObject) {
        return `${this.actionStringImport(replaceToType, dataObject)};Object.assign(exports, ${dataObject})`;
    }
    actionStringImportAll(replaceToType) {
        return `await ${replaceToType}(<||>)`;
    }
    actionStringExportAll(replaceToType) {
        return `Object.assign(exports, ${this.actionStringImportAll(replaceToType)})`;
    }
    BuildImportType(type, replaceToType = type, actionString = this.actionStringImport) {
        let beforeString = "";
        let newString = this.Build.CodeBuildText;
        let match;
        function Rematch() {
            match = newString.match(new RegExp(`${type}[ \\n]+([\\*]{0,1}[\\p{L}0-9_,\\{\\} \\n]+)[ \\n]+from[ \\n]+<\\|\\|>`, 'u'));
        }
        Rematch();
        while (match) {
            const data = match[1].trim();
            beforeString += newString.substring(0, match.index);
            newString = newString.substring(match.index + match[0].length);
            let DataObject;
            if (data[0] == '*') {
                DataObject = data.substring(1).replace(' as ', '').trimStart();
            }
            else {
                let Spliced = [];
                if (data[0] == '{') {
                    Spliced = data.split('}', 2);
                    Spliced[0] += '}';
                    if (Spliced[1])
                        Spliced[1] = Spliced[1].split(',').pop();
                }
                else {
                    Spliced = data.split(',', 1).reverse();
                }
                Spliced = Spliced.map(x => x.trim()).filter(x => x.length);
                if (Spliced.length == 1) {
                    if (Spliced[0][0] == '{') {
                        DataObject = Spliced[0];
                    }
                    else {
                        DataObject = `{default:${Spliced[0]}}`;
                    }
                }
                else {
                    DataObject = Spliced[0];
                    DataObject = `${DataObject.substring(0, DataObject.length - 1)},default:${Spliced[1]}}`;
                }
                DataObject = DataObject.replace(/ as /, ':');
            }
            beforeString += actionString(replaceToType, DataObject);
            Rematch();
        }
        beforeString += newString;
        this.Build.CodeBuildText = beforeString;
    }
    BuildInOneWord(type, replaceToType = type, actionString = this.actionStringImportAll) {
        let beforeString = "";
        let newString = this.Build.CodeBuildText;
        let match;
        function Rematch() {
            match = newString.match(new RegExp(type + '[ \\n]+<\\|\\|>'));
        }
        Rematch();
        while (match) {
            beforeString += newString.substring(0, match.index);
            newString = newString.substring(match.index + match[0].length);
            beforeString += actionString(replaceToType);
            Rematch();
        }
        beforeString += newString;
        this.Build.CodeBuildText = beforeString;
    }
    replaceWithSpace(func) {
        this.Build.CodeBuildText = func(' ' + this.Build.CodeBuildText).substring(1);
    }
    Define(data) {
        for (const [key, value] of Object.entries(data)) {
            this.replaceWithSpace(text => text.replace(new RegExp(`([^\\p{L}])${key}([^\\p{L}])`, 'gui'), (...match) => {
                return match[1] + value + match[2];
            }));
        }
    }
    BuildInAsFunction(word, toWord) {
        this.replaceWithSpace(text => text.replace(new RegExp(`([^\\p{L}])${word}([ \\n]*\\()`, 'gui'), (...match) => {
            return match[1] + toWord + match[2];
        }));
    }
    BuildImports(defineData) {
        this.BuildImportType('import', 'require');
        this.BuildImportType('export', 'require', this.actionStringExport);
        this.BuildImportType('include');
        this.BuildInOneWord('import', 'require');
        this.BuildInOneWord('export', 'require', this.actionStringExportAll);
        this.BuildInOneWord('include');
        this.BuildInAsFunction('import', 'require');
        this.Define(defineData);
    }
    BuiltString() {
        return this.Build.BuildCode();
    }
    static async BuildAndExportImports(code, defineData = {}) {
        const builder = new EasySyntax();
        await builder.load(` ${code} `);
        builder.BuildImports(defineData);
        code = builder.BuiltString();
        return code.substring(1, code.length - 1);
    }
}
//# sourceMappingURL=EasySyntax.js.map