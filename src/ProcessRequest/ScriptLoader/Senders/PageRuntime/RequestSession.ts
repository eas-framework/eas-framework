import DataWriter from '../../../../RuntimeUtils/DataWriter.js';
import {Request, Response} from '../../../types.js';
import {StringAnyMap} from '../../../../Settings/types.js';
import PageRequestParser from './PageRequestParser.js';

function createPageWrite() {
    const out_run_script = {text: ''};

    function writeFunc(text: string, override?: boolean) {
        if (override) {
            out_run_script.text = text;
        } else {
            out_run_script.text += text;
        }
    }

    const writer = new DataWriter(writeFunc);
    return {
        out_run_script,
        echo: writer.echo,
        setResponse: writer.setResponse,
        write: writer.write,
        writeSafe: writer.writeSafe
    };
}

type pageMethod = Function & { PageVar: any };
const GlobalVar = {};

function createPageVars(parser: PageRequestParser, page: pageMethod) {
    const wrapper = parser.parser.wrapper;
    page.PageVar ??= {};

    wrapper.res.redirect = parser.redirect;
    wrapper.res.sendFile = <any>parser.sendFile;
    wrapper.res.reload = parser.reload;

    return {
        Request: wrapper.req,
        Response: wrapper.res,
        Query: wrapper.req.query,
        Post: wrapper.req.body,
        Files: wrapper.req.files,
        Cookies: wrapper.req.signedCookies,
        run_script_name: wrapper.path.nested,
        PageVar: page.PageVar,
        GlobalVar,
    };
}


export default function createPageSession(parser: PageRequestParser, page: pageMethod): PageSession {
    return <any>{
        ...createPageWrite(),
        ...createPageVars(parser, page)
    };
}

export type PageSession = {
    Request: Request,
    Response: Response,
    Query: Request['query'],
    Post: Request['body'],
    Files: Request['files'],
    Cookies: Request['signedCookies'],
    run_script_name: string,
    PageVar: StringAnyMap,
    GlobalVar: StringAnyMap,
    out_run_script: { text: string },
    echo: InstanceType<typeof DataWriter>['echo'],
    setResponse: InstanceType<typeof DataWriter>['setResponse'],
    write: InstanceType<typeof DataWriter>['write'],
    writeSafe: InstanceType<typeof DataWriter>['writeSafe']
} & StringAnyMap