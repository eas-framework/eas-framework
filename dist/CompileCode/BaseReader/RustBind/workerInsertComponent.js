import workerPool from 'workerpool';
import {insert_component, find_close_char_html_elem, get_errors, find_close_char} from './index.js';
import {SimpleSkip, SkipSpecialTag} from '../Settings.js';

insert_component(JSON.stringify(SkipSpecialTag), JSON.stringify(SimpleSkip));

workerPool.worker({
  FindCloseChar: (...a) => [find_close_char(...a), get_errors()],
  FindCloseCharHTML: (...a) => [find_close_char_html_elem(...a), get_errors()]
});