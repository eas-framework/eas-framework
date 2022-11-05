import workerPool from 'workerpool';
import {
    ejs_parse,
    find_close_char,
    find_close_char_html_elem,
    get_errors,
    html_attr_parser,
    insert_component,
    page_base_parser,
    razor_to_ejs,
    razor_to_ejs_compile,
    razor_to_ejs_min
} from './index.js';
import {SimpleSkip, SkipSpecialTag} from './Settings.js';

insert_component(JSON.stringify(SkipSpecialTag), JSON.stringify(SimpleSkip));

workerPool.worker({
    FindCloseChar: (...a) => [find_close_char(...a), get_errors()],
    FindCloseCharHTML: (...a) => [find_close_char_html_elem(...a), get_errors()],
    RazorToEJS: razor_to_ejs,
    RazorToEJSMini: razor_to_ejs_min,
    RazorToEJSCompile: razor_to_ejs_compile,
    EJSParser: ejs_parse,
    HTMLAttrParser: html_attr_parser,
    PageBaseParser: page_base_parser
});