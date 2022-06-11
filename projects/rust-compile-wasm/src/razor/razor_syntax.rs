use std::vec;

use crate::{
    actions::{
        base_actions::{find_min_but, find_min_but_none},
        base_reader::{block_skip_text, find_end_of_def_char, find_end_of_def_word},
    },
    better_string::{b_action::first_non_alphabetic, b_string::BetterString, u_string::UString},
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
    static ref DEFAULT_RAZOR_KEYWORD: BetterString = BetterString::new("@");
    static ref COMMENT_CHAR: char = '*';
    static ref SWITCH: String = String::from("switch");
    static ref CASE: BetterString = BetterString::new("case");
    static ref CASE_DEFAULT: BetterString = BetterString::new("default");
    static ref BREAK: BetterString = BetterString::new("break");
    static ref CODE_BLOCK_WORD: BetterString = BetterString::new("code");
    static ref CODE_BLOCK_START: char = '{';
    static ref CODE_BLOCK_END: char = '}';
    static ref NOT_RAZOR_WORDS: Vec<String> = vec![
        String::from("default"),
        String::from("ConnectHere"),
        String::from("ConnectHereForm")
    ];
    static ref RAZOR_SYNTAX_SMALL: Vec<String> = vec![
        String::from("for"),
        String::from("function"),
        String::from("async"),
        String::from("export")
    ];
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
    static ref LITERAL_SCRIPT: Vec<String> = vec![String::from("debugger")];
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
    pub s_razor_keyword: BetterString,
    pub s_razor_comment_end: BetterString,
    pub s_switch: bool,
    pub s_small_syntax: bool,
    pub s_base_syntax: bool,
    pub s_write_start_with: Vec<BetterString>,
    pub s_handle_write: bool,
    pub s_escape: bool,
    pub s_comment: bool,
    pub s_literal: Vec<String>,
    pub s_add_to_script: Vec<String>,
    pub s_not_razor_words: Vec<String>,
    pub s_razor_code_block_syntax: bool,
}

impl Razor {
    pub fn default() -> Self {
        let mut s_razor_comment_end = COMMENT_CHAR.to_string();
        s_razor_comment_end.push_str(&DEFAULT_RAZOR_KEYWORD.to_string());

        Self {
            values: vec![],
            s_razor_keyword: DEFAULT_RAZOR_KEYWORD.copy(), // @
            s_razor_comment_end: BetterString::new(&s_razor_comment_end), // *@
            s_switch: true,                                // alow switch
            s_small_syntax: true, // small syntax keywords - for function, async, export
            s_base_syntax: true,  // more complex keywords like - if, else, else if, while do
            s_handle_write: true, // alow write - printing syntax like <%= %>
            s_write_start_with: vec![], // if there any, then all write will be ignored, but if they start with one of thous, then they will be printed
            s_escape: true,             // allow escape by doubling keyword - @@
            s_comment: true,            // allow comment - @* *@
            s_literal: vec![], // keyword that will used as code block (not writing) like 'debugger'
            s_add_to_script: vec![], // special keywords that will be handel at build time
            s_not_razor_words: vec![], // escape keywords literally
            s_razor_code_block_syntax: true, // allow code block syntax - @code { }
        }
    }

    pub fn default_false() -> Self {
        Self {
            values: vec![],
            s_razor_keyword: BetterString::new(""),
            s_razor_comment_end: BetterString::new(""),
            s_switch: false,
            s_small_syntax: false,
            s_base_syntax: false,
            s_write_start_with: vec![],
            s_handle_write: false,
            s_escape: false,
            s_comment: true,
            s_literal: vec![],
            s_add_to_script: vec![],
            s_not_razor_words: vec![],
            s_razor_code_block_syntax: false,
        }
    }

    fn find_first_word<T: UString>(text: &T) -> Option<usize> {
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

    fn skip_it<T: UString>(
        &mut self,
        text: &T,
        split_index: usize,
        add_index: usize,
        space: usize,
    ) {
        self.values.push(RazorBlock {
            name: TEXT.to_string(),
            start: add_index,
            end: split_index + add_index,
        });

        self.builder(
            &text.substring_start(split_index + space),
            add_index + split_index + space,
        );
    }

    fn syntax_end(&mut self, index: usize) {
        self.values.push(RazorBlock {
            start: index - 1,
            end: index,
            name: SCRIPT.to_owned(),
        });
    }

    fn syntax_start<T: UString>(&mut self, text: &T, add_index: usize) -> (T, T, usize, usize) {
        let start_parentheses = first_non_alphabetic(text, '(', vec![' ']);

        let mut text = text.copy();
        let mut next_index = 0;
        if start_parentheses > 0 {
            next_index = start_parentheses as usize + 1;
            text = text.substring_start(next_index);
            let end_parenthesis = block_skip_text(&text, vec!['(', ')']) as usize + 1;
            text = text.substring_start(end_parenthesis);
            next_index += end_parenthesis;
        }

        let start_switch = text.index_of_char(&'{').unwrap() + 1;
        text = text.substring_start(start_switch);

        let connect_index = add_index + next_index + start_switch;

        self.values.push(RazorBlock {
            start: add_index,
            end: connect_index,
            name: SCRIPT.to_owned(),
        });

        let end_main = block_skip_text(&text, vec!['{', '}']) as usize;
        let main_data = text.substring_end(end_main);
        let after_main = text.substring_start(end_main + 1);

        let after_main_index = end_main + connect_index + 1;

        (main_data, after_main, connect_index, after_main_index)
    }

    fn switch_parser<T: UString>(&mut self, text: &T, add_index: usize) {
        let (mut main_data, after_main, mut add_index, after_main_index) =
            self.syntax_start(text, add_index);

        loop {
            let case_index = main_data.index_of_better(&*CASE);
            let default_index = main_data.index_of_better(&*CASE_DEFAULT);

            if case_index == None && default_index == None {
                break;
            }

            let start_case = (find_end_of_def_char(&main_data, &':') + 1) as usize;

            self.values.push(RazorBlock {
                start: add_index,
                end: add_index + start_case,
                name: SCRIPT.to_owned(),
            });

            let next_text = main_data.substring_start(start_case);

            let end_case_break = find_end_of_def_word(&next_text, &*BREAK);
            let end_case_case = find_end_of_def_word(&next_text, &*CASE);

            let end_case_usize = find_min_but(
                vec![next_text.len() as i32, end_case_break, end_case_case],
                -1,
            ) as usize;

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
            name: SCRIPT.to_owned(),
        });

        self.syntax_end(after_main_index);
        self.builder(&after_main, after_main_index);
    }

    fn has_next<T: UString, C: UString>(text: &T, check_vector: &Vec<C>) -> bool {
        for word in check_vector {
            let index = text.index_of_better(word);

            if index != None && text.substring_end(index.unwrap()).trim_start().len() == 0 {
                return true;
            }
        }

        false
    }

    fn long_syntax<T: UString, C: UString>(
        &mut self,
        text: &T,
        add_index: usize,
        check_vector: &Vec<C>,
    ) {
        let (main_data, after_main, add_index, after_main_index) =
            self.syntax_start(text, add_index);

        self.builder(&main_data, add_index);

        self.syntax_end(after_main_index);

        if Razor::has_next(&after_main, check_vector) {
            self.long_syntax(&after_main, after_main_index, check_vector);
            return;
        }

        self.builder(&after_main, after_main_index);
    }

    fn small_syntax<T: UString>(&mut self, text: &T, add_index: usize) {
        let (main_data, after_main, add_index, after_main_index) =
            self.syntax_start(text, add_index);

        self.builder(&main_data, add_index);

        self.syntax_end(after_main_index);
        self.builder(&after_main, after_main_index);
    }

    fn handel_write<T: UString>(&mut self, text: &T, add_index: usize, mut name: &str) {
        if self.s_write_start_with.len() > 0
            && !self.s_write_start_with.iter().any(|x| text.starts_with(x))
        {
            self.values.push(RazorBlock {
                start: add_index - 1,
                end: add_index,
                name: TEXT.to_string(),
            });

            return self.builder(text, add_index);
        }

        let escape_script = text.at(0) == ':';
        let escape_script_usize = escape_script as usize;
        let is_parenthesis = text.at(escape_script_usize) == '(';

        if name == "auto" {
            name = if escape_script { "escape" } else { "print" }
        }

        if is_parenthesis {
            let text = text.substring_start(escape_script_usize + 1);
            let end_index = block_skip_text(&text, vec!['(', ')']) as usize;
            let start = escape_script_usize + 1 + add_index;
            self.values.push(RazorBlock {
                start,
                end: start + end_index,
                name: name.to_string(),
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
            } else if !char.is_alphabetic()
                && (!char.is_ascii_digit() || escape_script_usize == i)
                && char != '_'
                && char != '$'
                && ((char == '?' && text.at(i + 1) != '.')
                    || (char == '.' && !text.at(i + 1).is_alphabetic())
                    || char != '.' && char != '?')
            {
                self.values.push(RazorBlock {
                    start: escape_script_usize + add_index,
                    end: i + add_index,
                    name: name.to_string(),
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
            name: name.to_string(),
        });
    }

    pub fn code_block<T: UString>(&mut self, next_text: &T, mut add_index: usize) -> bool {
        if !next_text.starts_with(&*CODE_BLOCK_WORD) {
            return false;
        }

        let mut next_text = next_text.substring_start(CODE_BLOCK_WORD.len());
        if !Razor::has_next(
            &next_text,
            &vec![BetterString::new(&CODE_BLOCK_START.to_string())],
        ) {
            return false;
        }

        let start_block = next_text.index_of_char(&CODE_BLOCK_START).unwrap() + 1;
        next_text = next_text.substring_start(start_block);
        add_index += start_block + CODE_BLOCK_WORD.len();

        let end_main = block_skip_text(
            &next_text,
            vec![CODE_BLOCK_START.to_owned(), CODE_BLOCK_END.to_owned()],
        ) as usize;
        let end_index = add_index + end_main;

        self.values.push(RazorBlock {
            name: SCRIPT.to_string(),
            start: add_index,
            end: end_index,
        });

        self.builder(&next_text.substring_start(end_main + 1), end_index + 1);

        true
    }

    pub fn builder<T: UString>(&mut self, text: &T, mut add_index: usize) {
        let index = text.index_of_better(&self.s_razor_keyword);

        if index == None {
            self.values.push(RazorBlock {
                name: TEXT.to_string(),
                start: add_index,
                end: text.len() + add_index,
            });

            return;
        }

        let index = index.unwrap() as usize;
        let after_razor_keyword = index + self.s_razor_keyword.len();

        let razor_keyword_place = &text.substring(
            after_razor_keyword,
            after_razor_keyword + self.s_razor_keyword.len(),
        );
        if self.s_escape && self.s_razor_keyword.eq(razor_keyword_place) {
            // escape character @@
            self.skip_it(
                text,
                after_razor_keyword,
                add_index,
                self.s_razor_keyword.len(),
            );
            return;
        }

        if self.s_comment && COMMENT_CHAR.eq(&text.at(after_razor_keyword)) {
            // comment
            self.values.push(RazorBlock {
                name: TEXT.to_string(),
                start: add_index,
                end: index + add_index,
            });

            add_index += after_razor_keyword + 1;
            let text = text.substring_start(after_razor_keyword + 1);
            let index = text.index_of_better(&self.s_razor_comment_end);
            let num_index;

            if index == None {
                num_index = text.len();
            } else {
                num_index = index.unwrap();
            }

            let next_text = text.substring_start(num_index + self.s_razor_keyword.len() + 1);

            if next_text.len() > 0 {
                self.builder(
                    &next_text,
                    add_index + num_index + self.s_razor_keyword.len() + 1,
                );
            }
            return;
        }

        self.values.push(RazorBlock {
            // add text before razor sign
            name: TEXT.to_string(),
            start: add_index,
            end: index + add_index,
        });

        add_index += after_razor_keyword;

        let next_text_with_sign = text.substring_start(index);
        let next_text = next_text_with_sign.substring_start(self.s_razor_keyword.len());
        let first_word_index = Razor::find_first_word(&next_text);

        if first_word_index != None {
            let index = first_word_index.unwrap();
            let first_word = next_text.substring_end(index);
            let first_word_string = first_word.to_string();

            if self.s_not_razor_words.contains(&first_word_string) {
                self.skip_it(
                    &next_text_with_sign,
                    first_word.len() + 1,
                    add_index - self.s_razor_keyword.len(),
                    0,
                );
                return;
            }

            if self.s_switch && SWITCH.eq(&first_word_string) {
                self.switch_parser(&next_text, add_index);
                return;
            }

            if self.s_small_syntax && RAZOR_SYNTAX_SMALL.contains(&first_word_string) {
                self.small_syntax(&next_text, add_index);
                return;
            }

            if self.s_base_syntax {
                let syntax = RAZOR_SYNTAX.iter().find(|x| x.start == first_word_string);

                if syntax.is_some() {
                    self.long_syntax(&next_text, add_index, &syntax.unwrap().data);
                    return;
                }
            }

            if self.s_literal.contains(&first_word_string) {
                let end = add_index + first_word.len();
                self.values.push(RazorBlock {
                    name: SCRIPT.to_owned(),
                    start: add_index,
                    end,
                });
                self.builder(&next_text.substring_start(first_word.len()), end);
                return;
            }

            if self.s_add_to_script.contains(&first_word_string) {
                self.handel_write(&next_text, add_index, &first_word_string);
                return;
            }
        }

        if self.s_razor_code_block_syntax && self.code_block(&next_text, add_index) {
            return;
        }

        if self.s_handle_write {
            self.handel_write(&next_text, add_index, "auto");
        } else {
            self.builder(&next_text, add_index);
        }
    }

    pub fn optimize(&mut self) {
        let mut i = 0;
        let len_values = self.values.len();

        if len_values == 0 {
            return;
        }

        let real_len = len_values - 1;

        let mut optimize_v = vec![];
        let mut has_changes = false;

        while i < real_len {
            let value = &self.values[i];
            let next = &self.values[i + 1];

            if next.name == value.name && value.end == next.start {
                // connect close scripts
                optimize_v.push(RazorBlock {
                    name: next.name.to_string(),
                    start: value.start,
                    end: next.end,
                });
                i += 2;
                has_changes = true;
                continue;
            }

            if value.start == value.end {
                // ignore empty blocks
                i += 1;
                continue;
            }

            optimize_v.push(RazorBlock {
                // push all other blocks
                name: value.name.to_string(),
                start: value.start,
                end: value.end,
            });
            i += 1;
        }

        if i == real_len {
            let last = self.values.last().unwrap();
            optimize_v.push(RazorBlock {
                name: last.name.to_string(),
                start: last.start,
                end: last.end,
            });
        }

        self.values = optimize_v;

        if has_changes {
            // optimize again, for better result
            self.optimize();
        }
    }
}
