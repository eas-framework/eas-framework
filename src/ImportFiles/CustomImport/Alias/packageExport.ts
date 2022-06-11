import { GlobalSitemapBuilder, sitemapEventEmitter } from "../../../CompileCode/XMLHelpers/SitemapBuilder";
import SearchRecord from "../../../Global/SearchRecord"
import {Settings}  from '../../../MainBuild/Server';
import { PageTimeLogger } from "../../../OutputInput/Logger";

export default function(){
    return {Settings, SearchRecord, PageTimeLogger, SitemapEvents: sitemapEventEmitter, GlobalSitemapBuilder};
}