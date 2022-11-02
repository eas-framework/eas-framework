import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker.js";
import {FindPlaceHolderNames, FindPlaceholderValues, PlaceHolder, PlaceholderValue} from "./FindPlaceHolders.js";
import BaseParser from "./BaseParser.js";

export default class PageParse {
    base: BaseParser;
    locations: PlaceHolder[];
    values: PlaceholderValue[];

    constructor(public content: StringTracker) {
    }

    async parseBase() {
        this.base = new BaseParser();
        await this.base.parse(this.content);

        this.content = this.base.clearCode;
    }

    parsePlaceHolder() {
        this.locations = new FindPlaceHolderNames().find(this.content.eq);
    }

    parseValues() {
        this.values = new FindPlaceholderValues().find(this.content);
    }
}