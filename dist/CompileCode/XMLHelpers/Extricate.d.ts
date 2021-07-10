import StringTracker from '../../EasyDebug/StringTracker';
declare function searchForReplace(data: StringTracker, find: string, tag: string, output?: StringTracker): any;
declare function searchForCutMain(data: StringTracker, array: string[], sing: string, bigTag?: boolean, searchFor?: boolean): SearchCutOutput;
interface SearchCutData {
    tag: string;
    data: StringTracker;
    loc: number;
}
interface SearchCutOutput {
    data?: StringTracker;
    error?: boolean;
    found?: SearchCutData[];
}
export { searchForReplace as replaceTages, searchForCutMain as getDataTages };
