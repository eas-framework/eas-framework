use crate::{
    actions::base_reader::{
        block_skip_text, find_end_of_def_char, find_end_of_def_word,
    },
    better_string::{b_action::first_non_alphabetic, b_string::BetterString},
};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

struct RazorSyntaxBlock {
    start: String,
    data: Vec<BetterString>,
}

lazy_static! {
    static ref TEXT: String = String::from("text");
    static ref SCRIPT: String = String::from("script");
    static ref RAZOR_CHAR: char = '@';
    static ref COMMENT_CHAR: char = '*';
    static ref COMMENT_END: BetterString =
        BetterString::new(&(COMMENT_CHAR.to_string() + &RAZOR_CHAR.to_string()));
    static ref CASE: BetterString = BetterString::new("case");
    static ref BREAK: BetterString = BetterString::new("break");
    static ref NOT_RAZOR_WORDS: Vec<String> = vec![
        String::from("default"),
        String::from("ConnectHere"),
        String::from("ConnectHereForm")
    ];
    static ref RAZOR_SYNTAX_SMALL: Vec<String> =
        vec![String::from("for"), String::from("function")];
    static ref RAZOR_SYNTAX: Vec<RazorSyntaxBlock> = vec![
        RazorSyntaxBlock {
            start: String::from("if"),
            data: vec![BetterString::new("else if"), BetterString::new("else")]
        },
        RazorSyntaxBlock {
            start: String::from("while"),
            data: vec![BetterString::new("do")]
        }
    ];
    static ref LITERAL_SCRIPT: Vec<String> = vec![
        String::from("debugger")
    ];
    static ref ADD_TO_SCRIPT: Vec<String> = vec![
        String::from("include"),
        String::from("import"),
        String::from("transfer")
    ];
}

#[derive(Serialize, Deserialize)]
pub struct RazorBlock {
    pub name: String, //text, script, comment, literal
    pub start: usize,
    pub end: usize,
}

pub struct Razor {
    pub values: Vec<RazorBlock>,
}

impl Razor {
    pub fn new() -> Self {
        Razor { values: vec![] }
    }

    fn find_first_word(text: &BetterString) -> Option<usize> {
        for i in 0..text.len() {
            let c = text.at(i);

            if !c.is_alphabetic() {
                if i == 0 {
                    return None;
                }
                return Some(i);
            }
        }

        None
    }

    fn skip_it(&mut self, text: &BetterString, split_index: usize, add_index: usize, space: usize) {
        self.values.push(RazorBlock {
            name: TEXT.to_string(),
            start: add_index,
            end: split_index + add_index
        });

        self.builder(&text.substring_start(split_index +space), add_index + split_index +space);
    }

    fn syntax_end(&mut self, index: usize) {
        self.values.push(RazorBlock {
            start: index - 1,
            end: index,
            name: SCRIPT.to_owned()
        });
    }

    fn syntax_start(
        &mut self,
        text: &BetterString,
        add_index: usize,
    ) -> (BetterString, BetterString, usize, usize) {
        let start_parentheses = first_non_alphabetic(text, '(', vec![' ']);

        let mut text = text.clone();
        let mut next_index = 0;
        if start_parentheses > 0 {
            next_index = start_parentheses as usize + 1;
            text = text.substring_start(next_index);
            let end_parenthesis = block_skip_text(&text, vec!['(', ')']) as usize+1;
            text = text.substring_start(end_parenthesis);
            next_index += end_parenthesis;
        }

        let start_switch = text.index_of_char(&'{').unwrap() + 1;
        text = text.substring_start(start_switch);

        let connect_index = add_index + next_index + start_switch;

        self.values.push(RazorBlock {
            start: add_index,
            end: connect_index,
            name: SCRIPT.to_owned()
        });

        let end_main = block_skip_text(&text, vec!['{', '}']) as usize;
        let main_data = text.substring_end(end_main);
        let after_main = text.substring_start(end_main + 1);

        let after_main_index = end_main + connect_index + 1;

        (main_data, after_main, connect_index, after_main_index)
    }

    fn switch_parser(&mut self, text: &BetterString, add_index: usize) {
        let (mut main_data, after_main, mut add_index, after_main_index) =
            self.syntax_start(&text, add_index);

        loop {
            let case = main_data.index_of_better(&CASE);

            if case == None {
                break;
            }

            let start_case = (find_end_of_def_char(&main_data, &':') + 1) as usize;

            self.values.push(RazorBlock {
                start: add_index,
                end: add_index + start_case,
                name: SCRIPT.to_owned()
            });

            let next_text = main_data.substring_start(start_case);

            let mut end_case = find_end_of_def_word(&next_text, &CASE);

            if end_case == -1 {
                end_case = find_end_of_def_word(&next_text, &BREAK);

                if end_case == -1 {
                    end_case = next_text.len() as i32;
                }
            }

            let end_case_usize = end_case as usize;

            self.builder(
                &next_text.substring_end(end_case_usize),
                add_index + start_case,
            );
            main_data = next_text.substring_start(end_case_usize);
            add_index += start_case + end_case_usize;
        }

        self.values.push(RazorBlock {
            start: add_index,
            end: add_index + main_data.len(),
            name: SCRIPT.to_owned()
        });

        self.syntax_end(after_main_index);
        self.builder(&after_main, after_main_index);
    }

    fn has_next(text: &BetterString, check_vector: &Vec<BetterString>) -> bool {
        for word in check_vector {
            let index = text.index_of_better(word);

            if index != None
                && text
                    .substring_end(index.unwrap())
                    .trim_start()
                    .len()
                    == 0
            {
                return true;
            }
        }

        false
    }

    fn long_syntax(
        &mut self,
        text: &BetterString,
        add_index: usize,
        check_vector: &Vec<BetterString>,
    ) {
        let (main_data, after_main, add_index, after_main_index) =
            self.syntax_start(&text, add_index);

        self.builder(&main_data, add_index);

        self.syntax_end(after_main_index);

        if Razor::has_next(&after_main, check_vector) {
            self.long_syntax(&after_main, after_main_index, check_vector);
            return;
        }

        self.builder(&after_main, after_main_index);
    }

    fn small_syntax(&mut self, text: &BetterString, add_index: usize) {
        let (main_data, after_main, add_index, after_main_index) =
            self.syntax_start(&text, add_index);

        self.builder(&main_data, add_index);

        self.syntax_end(after_main_index);
        self.builder(&after_main, after_main_index);
    }

    fn handel_write(&mut self, text: &BetterString, add_index: usize, mut name: &str) {
        let escape_script = text.at(0) == ':';
        let escape_script_usize = escape_script as usize;
        let is_parenthesis = text.at(escape_script_usize) == '(';

        if name == "auto" {
            name = if escape_script {
                "escape"
            } else {
                "print"
            }
        }

        if is_parenthesis {
            let text = text.substring_start(escape_script_usize + 1);
            let end_index = block_skip_text(&text, vec!['(', ')']) as usize;
            let start = escape_script_usize + 1 + add_index;
            self.values.push(RazorBlock {
                start,
                end: start + end_index,
                name: name.to_owned(),
            });

            self.builder(&text.substring_start(end_index + 1), start + end_index + 1);
            return;
        }

        let mut i = escape_script_usize;
        let length = text.len();
        while i < length {
            let char = text.at(i);
            if char == '(' || char == '[' {
                i += block_skip_text(
                    &text.substring_start(i + 1),
                    vec![char, if char == '(' { ')' } else { ']' }],
                ) as usize
                    + 1;
            } else if !char.is_alphabetic() && (!char.is_ascii_digit() || escape_script_usize == i) && char != '_' && char != '$' && ((char == '?' && text.at(i + 1) != '.')
                    || (char == '.' && !text.at(i + 1).is_alphabetic())
                    || char != '.' && char != '?')
            {
                self.values.push(RazorBlock {
                    start: escape_script_usize + add_index,
                    end: i + add_index,
                    name: name.to_owned(),
                });

                let substring = i + (if char == ';' { 1 } else { 0 });
                self.builder(&text.substring_start(substring), substring + add_index);
                return;
            }

            i += 1;
        }

        self.values.push(RazorBlock {
            start: escape_script_usize + add_index,
            end: i + add_index,
            name: name.to_owned(),
        });
    }

    pub fn builder(&mut self, text: &BetterString, mut add_index: usize) {
        let index = text.index_of_char(&RAZOR_CHAR);

        if index == None {
            self.values.push(RazorBlock {
                name: TEXT.to_string(),
                start: add_index,
                end: text.len() + add_index
            });

            return;
        }

        let index = index.unwrap() as usize;

        if RAZOR_CHAR.eq(&text.at(index + 1)) {
            // escape character @@
            self.skip_it(&text, index+1, add_index, 1);
            return;
        }

        if COMMENT_CHAR.eq(&text.at(index + 1)) {
            // comment
            self.values.push(RazorBlock {
                name: TEXT.to_string(),
                start: add_index,
                end: index + add_index
            });

            add_index += index+2;
            let text = text.substring_start(index+2);
            let index = text.index_of_better(&COMMENT_END);
            let num_index;

            if index == None {
                num_index = text.len();
            } else {
                num_index = index.unwrap();
            }

            let next_text = text.substring_start(num_index + 2);

            if next_text.len() > 0 {
                self.builder(&next_text, add_index + num_index + 2);
            }
            return;
        }

        self.values.push(RazorBlock {
            // add text before razor sign
            name: TEXT.to_string(),
            start: add_index,
            end: index + add_index
        });

        add_index +=  index + 1;

        let next_text_with_sign = text.substring_start(index );
        let next_text = next_text_with_sign.substring_start( 1);
        let first_word_index = Razor::find_first_word(&next_text);

        if first_word_index != None {
            let index = first_word_index.unwrap();
            let first_word = next_text.substring_end(index);
            let first_word_string = first_word.to_string();

            if NOT_RAZOR_WORDS.contains(&first_word_string) {
                self.skip_it(&next_text_with_sign, first_word.len()+1, add_index-1, 0);
                return;
            }

            if first_word_string == "switch" {
                self.switch_parser(&next_text, add_index);
                return;
            }

            if RAZOR_SYNTAX_SMALL.contains(&first_word_string) {
                self.small_syntax(&next_text, add_index);
                return;
            }

            let syntax = RAZOR_SYNTAX.iter().find(|x| x.start == first_word_string);

            if syntax.is_some() {
                self.long_syntax(&next_text, add_index, &syntax.unwrap().data);
                return;
            }

            if LITERAL_SCRIPT.contains(&first_word_string) {
                let end = add_index + first_word.len();
                self.values.push(RazorBlock {
                    name: SCRIPT.to_owned(),
                    start: add_index,
                    end
                });
                self.builder(&next_text.substring_start(first_word.len()), end);
                return;
            }

            if ADD_TO_SCRIPT.contains(&first_word_string) {
                self.handel_write(&next_text, add_index , &first_word_string);
                return;
            }
        }

        if next_text.at(0) == '{' {
            let next_text = next_text.substring_start(1);
            let end_main = block_skip_text(&next_text, vec!['{', '}']) as usize;
            let end_index = add_index + 1 + end_main;

            self.values.push(RazorBlock {
                name: SCRIPT.to_owned(),
                start: add_index + 1,
                end: end_index,
            });

            self.builder(&next_text.substring_start(end_main+1), end_index+1);
            return;
        }

        self.handel_write(&next_text, add_index , "auto");
    }

    pub fn optimize(&mut self) {
        let mut i = 0;
        let len_values = self.values.len();

        if len_values == 0 {
            return;
        }

        let real_len = len_values - 1;

        let mut optimize_v = vec![];

        while i < real_len {
            let value = &self.values[i];
            let next = &self.values[i + 1];

            let script = SCRIPT.to_owned();
            if value.name == script && next.name == value.name && value.end == next.start { // connect close scripts
                optimize_v.push(RazorBlock {
                    name: script,
                    start: value.start,
                    end: next.end,
                });
                i += 2;
                continue;
            }

            if value.start ==value.end && (value.name == script || value.name == TEXT.to_owned()) { // ignore empty blocks
                i += 1;
                continue;
            }

            optimize_v.push(RazorBlock { // push all other blocks
                name: value.name.to_owned(),
                start: value.start,
                end: value.end,
            });
            i += 1;
        }

        if i == real_len {
            let last = self.values.last().unwrap();
            optimize_v.push(RazorBlock {
                name: last.name.to_owned(),
                start: last.start,
                end: last.end,
            });
        } 

        self.values = optimize_v;
    }
}
