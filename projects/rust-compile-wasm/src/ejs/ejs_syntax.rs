use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use crate::{actions::base_reader::find_end_of_def, better_string::b_string::BetterString};

lazy_static! {
    static ref END_LINE: BetterString = BetterString::new("\n");
    static ref END_CHAR: BetterString = BetterString::new(";");
    static ref DEBUG: BetterString = BetterString::new("{?debug_file?}");
}

#[derive(Serialize, Deserialize)]
pub struct EJSBlock {
    pub name: String, //text, script, print, escape, debug, no-track
    pub start: usize,
    pub end: usize,
}

pub struct EJS {
    pub values: Vec<EJSBlock>,
    start_script: BetterString,
    end_script: BetterString,
}

impl EJS {
    pub fn new(start_script: BetterString, end_script: BetterString) -> Self {
        EJS {
            values: vec![],
            start_script,
            end_script,
        }
    }

    pub fn insert_script(&mut self, mut text: BetterString, mut add_index: usize) {
        if text.is_empty() {
            return;
        }

        let mut add_start = 0;

        let mut name = "script".to_string();

        let first_char = text.at(0);

        if first_char == '#' {
            // ignore comments
            return;
        }
        if first_char == '=' || first_char == ':' {
            let name_print;
            if first_char == '=' {
                name_print = "print".to_owned()
            } else {
                name_print = "escape".to_owned()
            }

            add_index += 1;
            text = text.substring_start(1);
            let find_print = find_end_of_def(&text, vec![&END_CHAR, &END_LINE, &self.end_script]);
            let find_print_usize;

            if find_print == -1 {
                find_print_usize = text.len();
            } else {
                find_print_usize = find_print as usize;
            }

            self.values.push(EJSBlock {
                start: add_index + add_start,
                end: add_index + find_print_usize,
                name: name_print,
            });

            text = text.substring_start(find_print_usize + 1);

            if text.is_empty() {
                return;
            }

            add_index += find_print_usize + 1;
        }

        if first_char == '!' {
            // not track scripts
            add_start += 1;
            name = "no-track".to_owned();
        }

        if text.starts_with(&DEBUG) {
            // debug info
            add_start += DEBUG.len();
            name = "debug".to_owned();
        }

        self.values.push(EJSBlock {
            start: add_index + add_start,
            end: add_index + text.len(),
            name,
        });
    }

    pub fn builder(&mut self, mut text: BetterString, mut add_index: usize) {
        if text.is_empty() {
            return;
        }

        let start = text.index_of_better(&self.start_script);

        if start == None {
            self.values.push(EJSBlock {
                start: add_index,
                end: add_index + text.len(),
                name: "text".to_owned(),
            });
            return;
        }

        let start_num = start.unwrap();

        self.values.push(EJSBlock {
            start: add_index,
            end: add_index + start_num,
            name: "text".to_owned(),
        });

        let substring = start_num + self.start_script.len();
        text = text.substring_start(substring);
        add_index += substring;

        let end = text.index_of_better(&self.end_script).unwrap_or(text.len());

        self.insert_script(text.substring_end(end), add_index); // insert script block

        let substring = end + self.end_script.len();
        self.builder(text.substring_start(substring), add_index + substring);
    }
}
