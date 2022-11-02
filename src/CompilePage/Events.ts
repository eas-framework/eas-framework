import PPath from '../Settings/PPath.js';
import {SessionBuild} from './Session.js';
import StringTracker from '../SourceTracker/StringTracker/StringTracker.js';

export async function pageBuildStart(pagePath: PPath, session: SessionBuild) {

}

export async function pageBuildHTMLStage1(content: StringTracker, session: SessionBuild) {
    return content;
}

export async function pageBuildHTMLStage2(content: StringTracker, session: SessionBuild) {
    return content;
}

export async function pageBuildHTMLStage3(content: StringTracker, session: SessionBuild) {
    return content;
}