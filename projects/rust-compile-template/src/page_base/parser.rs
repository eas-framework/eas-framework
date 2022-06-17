use std::cell::Ref;

use crate::{
    actions::base_reader::{ find_end_of_def_char},
    better_string::{ b_string::BetterString, r_string::RefString, u_string::UString},
};

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use super::html_attr::{HTMLAttr, ESCAPE_START, ESCAPE_END};

lazy_static! {
    static ref SEARCH_START: BetterString = BetterString::new("#[");
}

#[derive(Serialize, Deserialize)]

pub struct PageBaseBlock {
    start: usize,
    end: usize,
    key: String,
    char: String
}
#[derive(Serialize, Deserialize)]

pub struct PageBaseJSON {
    pub values: Vec<PageBaseBlock>,
    pub start: usize,
    pub end: usize
}
struct TrimBetterIndex {
    text: RefString,
    increase_index:usize
}

pub struct BaseParser {
    pub values: HTMLAttr,
    pub start: usize,
    pub end: usize
}

impl BaseParser {
    pub fn new() -> Self {
        BaseParser { 
            values: HTMLAttr::new(),
            start: 0,
            end: 0
        }
    }

    fn skip_escape_for_char(mut text: RefString, search: &char) -> i32{
        let mut index_escape = text.index_of_better(&*ESCAPE_START);
        let mut have_end= find_end_of_def_char(&text, search);
        let mut add_index = 0;

        while index_escape != None &&  have_end > index_escape.unwrap() as i32 {
            let substring = index_escape.unwrap() + ESCAPE_START.len();
            text = text.substring_start(substring);
            add_index += substring;

            let end_index = text.index_of_better(&*ESCAPE_END);

            if end_index != None {
                let substring = end_index.unwrap() + ESCAPE_END.len();
                text = text.substring_start(substring);
                add_index += substring;
            } else {
                return (text.len() + add_index)as i32;
            }

            index_escape = text.index_of_better(&*ESCAPE_START);
            have_end= find_end_of_def_char(&text, &']');
        }

        if have_end == -1 {
            return -1;
        }

        add_index as i32 + have_end
    }

    pub fn find_block(&mut self, mut text: RefString) {
        let index = text.index_of_better(&*SEARCH_START);

        if index == None {
            return;
        }

        let start = index.unwrap();
        text = text.substring_start(start + SEARCH_START.len());

        let have_end= BaseParser::skip_escape_for_char(text.copy(), &']');

        if have_end == -1 {
            return;
        }

        let have_end_usize = have_end as usize;
        self.start = start;
        self.end = have_end_usize + 1 + start + SEARCH_START.len();

        self.values.full_parser(text.substring(0, have_end_usize).trim_end(), start +SEARCH_START.len());
    }

    pub fn builder(&mut self, text: RefString) -> PageBaseJSON {
        self.find_block(text.copy());

        let mut values = vec![];

        for i in &self.values.values {
            values.push(PageBaseBlock {
                start: i.sv,
                end: i.ev,
                key: text.substring(i.sk, i.ek).to_string(),
                char: i.char.clone()
            })
        }

        PageBaseJSON {
            values,
            start: self.start,
            end: self.end
        }
    }
}