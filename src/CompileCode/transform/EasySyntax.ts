import { ParseTextStream, ReBuildCodeString } from '../ScriptReader/EasyScript';

export default class EasySyntax {
    private Build: ReBuildCodeString;

    async load(code: string) {
        const parseArray = await ParseTextStream(code);
        this.Build = new ReBuildCodeString(parseArray);

        this.actionStringExport = this.actionStringExport.bind(this);
        this.actionStringExportAll = this.actionStringExportAll.bind(this);
    }

    private actionStringImport(replaceToType: string, dataObject: string){
        return `const ${dataObject} = await ${replaceToType}(<||>)`;
    }

    private actionStringExport(replaceToType: string, dataObject: string){
        return `${this.actionStringImport(replaceToType, dataObject)};Object.assign(exports, ${dataObject})`;
    }

    private actionStringImportAll(replaceToType: string){
        return `await ${replaceToType}(<||>)`;
    }

    private actionStringExportAll(replaceToType: string){
        return `Object.assign(exports, ${this.actionStringImportAll(replaceToType)})`;
    }

    private BuildImportType(type: string, replaceToType = type, actionString: (replaceToType: string, dataObject: string) => string = this.actionStringImport) {
        let beforeString = "";
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        function Rematch() {
            match = newString.match(new RegExp(`${type}[ \\n]+([\\*]{0,1}[\\p{L}0-9_,\\{\\} \\n]+)[ \\n]+from[ \\n]+<\\|\\|>`, 'u'));
        }

        Rematch();

        while (match) {
            const data = match[1].trim();
            beforeString += newString.substring(0, match.index);
            newString = newString.substring(match.index + match[0].length);

            let DataObject: string;

            if (data[0] == '*') {
                DataObject = data.substring(1).replace(' as ', '').trimStart();
            } else {
                let Spliced: string[] = [];

                if(data[0] == '{'){
                    Spliced = data.split('}', 2);
                    Spliced[0] += '}';
                    if(Spliced[1])
                        Spliced[1] = Spliced[1].split(',').pop();
                } else {
                    Spliced = data.split(',', 1).reverse();
                }

                Spliced = Spliced.map(x => x.trim()).filter(x => x.length);
                
                if(Spliced.length == 1){
                    if(Spliced[0][0] == '{'){
                        DataObject = Spliced[0];
                    } else {
                        DataObject = `{default:${Spliced[0]}}`;
                    }
                } else {

                    DataObject = Spliced[0];

                    DataObject = `${DataObject.substring(0, DataObject.length - 1)},default:${Spliced[1]}}`;
                }

                DataObject = DataObject.replace(/ as /, ':');
            }

            beforeString +=  actionString(replaceToType, DataObject);

            Rematch();
        }

        beforeString += newString;

        this.Build.CodeBuildText = beforeString;
    }

    private BuildInOneWord(type: string, replaceToType = type, actionString: (replaceToType: string) => string = this.actionStringImportAll) {
        let beforeString = "";
        let newString = this.Build.CodeBuildText;
        let match: RegExpMatchArray;

        function Rematch() {
            match = newString.match(new RegExp(type+'[ \\n]+<\\|\\|>'));
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

    private replaceWithSpace(func: (text: string) => string){
        this.Build.CodeBuildText = func(' ' + this.Build.CodeBuildText).substring(1);
    }

    private Define(data: {[key: string]: string}){
        for(const [key, value] of Object.entries(data)){
            this.replaceWithSpace(text => text.replace(new RegExp(`([^\\p{L}])${key}([^\\p{L}])`, 'gui'), (...match) => {
                return match[1] + value + match[2]
            }));
        }
    }

    private BuildInAsFunction(word: string, toWord: string){
        this.replaceWithSpace(text => text.replace(new RegExp(`([^\\p{L}])${word}([ \\n]*\\()`, 'gui'), (...match) => {
            return match[1] + toWord + match[2]
        }));
    }

    BuildImports(defineData: {[key: string]: string}) {
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

    static async BuildAndExportImports(code: string, defineData: {[key: string]: string} = {}) {
        const builder = new EasySyntax();
        await builder.load(` ${code} `);
        builder.BuildImports(defineData);

        code = builder.BuiltString();
        return code.substring(1, code.length-1);
    }
}