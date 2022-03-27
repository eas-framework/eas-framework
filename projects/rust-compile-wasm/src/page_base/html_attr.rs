use crate::{
    better_string::{ b_string::BetterString}, actions::base_reader::{find_end_of_q, find_end_of_word},
};

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

lazy_static! {
    pub static ref ESCAPE_START: BetterString = BetterString::new("<%");
    pub static ref ESCAPE_END: BetterString = BetterString::new("%>");
}

#[derive(Serialize, Deserialize)]
pub struct HTMLAttrBlock {
    pub sv: usize,
    pub ev: usize,
    pub sk: usize,
    pub ek: usize,
    pub space: bool,
    pub char: String
}

struct TrimBetterIndex {
    text: BetterString,
    increase_index:usize
}

pub struct HTMLAttr {
    pub values: Vec<HTMLAttrBlock>,
}

impl HTMLAttr {
    pub fn new() -> Self {
        HTMLAttr { 
            values: vec![]
        }
    }

    fn trim_start(text: BetterString) ->  TrimBetterIndex{
        let trim_text = text.trim_start();
        let trim_text_len = trim_text.len();
        
        return TrimBetterIndex {text: trim_text, increase_index: text.len() - trim_text_len}
    }

    fn is_smallest(data: Option<usize>, options: Vec<Option<usize>>) -> bool {
        if data.is_none() {
            return false;
        }

        let data = data.unwrap();
        for i in options {
            if i.is_some() && i.unwrap() < data {
                return false;
            }
        }

        return true;
    }


    fn parse_inside(&mut self,mut text: BetterString, mut add_index: usize){
        let trim_that = HTMLAttr::trim_start(text);
        let space = trim_that.increase_index > 0;
        text = trim_that.text;
        add_index += trim_that.increase_index;

        if text.is_empty() {
            return;
        }

        let index_equals = text.index_of_char(&'=');
        let index_space = text.index_of_char(&' ');
        
        if HTMLAttr::is_smallest(index_equals, vec![index_space]) {
            let index_equals = index_equals.unwrap();
            text = text.substring_start(index_equals+1);

            let char_at = text.at(0);
            if char_at.is_alphabetic() {
                let end_index = find_end_of_word(&text);

                let start = add_index + index_equals+1;
                self.values.push(HTMLAttrBlock { sv: start, ev: start + end_index, sk: add_index, ek: add_index + index_equals, space, char: "".to_owned() });
                self.parse_inside(text.substring_start(end_index), start + end_index);

            } else {
                text = text.substring_start(1);
                let end_index = find_end_of_q(&text, if char_at == '{'{'}'}else{char_at} );

                let start = add_index + index_equals+2;
                self.values.push(HTMLAttrBlock { sv:start, ev: start + end_index-1, sk: add_index, ek: add_index + index_equals, space, char: if char_at == '{' {'"'.to_string()} else{char_at.to_string()} });
                self.parse_inside(text.substring_start(end_index), start + end_index);
            }

        } else {
            let index_space = index_space.unwrap_or(text.len());
            self.values.push(HTMLAttrBlock { sv: 0, ev: 0, sk: add_index, ek: add_index+index_space, space, char: "".to_string() });
            self.parse_inside(text.substring_start(index_space), add_index + index_space);
        }
    }

    pub fn full_parser(&mut self, mut text: BetterString, add_index: usize) {
        let mut index_escape = text.index_of_better(&ESCAPE_START);
        let mut rebuild_text: BetterString = BetterString::new("");

        while index_escape != None {
            rebuild_text = rebuild_text.concat(&text.substring_end(index_escape.unwrap()));
            text = text.substring_start(index_escape.unwrap() + ESCAPE_START.len());

            
            let end_index = text.index_of_better(&ESCAPE_END);
            let end_with_escape;

            if end_index == None {
                end_with_escape = text.len();
            } else {
                end_with_escape = end_index.unwrap() + ESCAPE_END.len();
            }

            rebuild_text = rebuild_text.concat(&BetterString::repeat('_', end_with_escape + ESCAPE_START.len()));

            text = text.substring_start(end_with_escape);
            index_escape = text.index_of_better(&ESCAPE_START);
        }

        self.parse_inside(rebuild_text.concat(&text), add_index);
    }
}