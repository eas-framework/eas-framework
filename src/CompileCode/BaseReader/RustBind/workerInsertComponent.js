import workerPool from 'workerpool';
import {insert_component, find_close_char_html_elem, get_errors, find_close_char} from './index.js';
import {SimpleSkip, SkipSpecialTag} from '../Settings.js';

insert_component(JSON.stringify(SkipSpecialTag), JSON.stringify(SimpleSkip));

workerPool.worker({
  FindCloseChar: find_close_char,
  FindCloseCharHTML: find_close_char_html_elem,
  GetErrors: get_errors
});