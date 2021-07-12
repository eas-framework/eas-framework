import { ParseTextStream, ReBuildCodeString } from '../ScriptReader/EasyScript.js';
export default class EasySyntax {
    Build;
    async load(code) {
        const parseArray = await ParseTextStream(code);
        this.Build = new ReBuildCodeString(parseArray);
    }
    BuildImportType(type, totype = type) {
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
                let Splited = [];
                if (data[0] == '{') {
                    Splited = data.split('}', 1);
                    Splited[0].Plus('}');
                    Splited[1] = Splited[1]?.split(',').pop();
                }
                else {
                    Splited = data.split(',', 1).reverse();
                }
                Splited = Splited.map(x => x.trim()).filter(x => x.length);
                if (Splited.length == 1) {
                    if (Splited[0][0] == '{') {
                        DataObject = Splited[0];
                    }
                    else {
                        DataObject = `{default:${Splited[0]}}`;
                    }
                }
                else {
                    DataObject = Splited[0];
                    DataObject = `${DataObject.substring(0, DataObject.length - 1)},default:${Splited[1]}}`;
                }
                DataObject = DataObject.replace(/ as /, ':');
            }
            beforeString += `const ${DataObject} = await ${totype}(<||>)`;
            Rematch();
        }
        beforeString += newString;
        this.Build.CodeBuildText = beforeString;
    }
    BuildInOneWord(type, totype = type) {
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
            beforeString += `await ${totype}(<||>)`;
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
            this.replaceWithSpace(text => text.replace(new RegExp(`((?!\\p{L}).)${key}((?!\\p{L}).)`), (...match) => {
                return match[1] + value + match[2];
            }));
        }
    }
    BuildInAsFunction(word, toWord) {
        this.replaceWithSpace(text => text.replace(new RegExp(`((?!\\p{L}).)(${word})([ \\n]*\\()`), (...match) => {
            return match[1] + toWord + match[3];
        }));
    }
    BuildImports(defineData) {
        this.BuildImportType('import', 'require');
        this.BuildImportType('include');
        this.BuildInOneWord('import', 'require');
        this.BuildInOneWord('include');
        this.BuildInAsFunction('import', 'require');
        this.Define(defineData);
    }
    BuiltString() {
        return this.Build.BuildCode();
    }
    static async BuildAndExportImports(code, defineData = {}) {
        const builder = new EasySyntax();
        await builder.load(code);
        builder.BuildImports(defineData);
        return builder.BuiltString();
    }
}
//# sourceMappingURL=EasySyntax.js.map