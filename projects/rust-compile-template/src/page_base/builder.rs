use super::{parser::BaseParser, html_attr::{HTMLAttr}};
use crate::better_string::{b_string::BetterString, r_string::RefString};

pub fn page_base(text:&str) -> String{
    let mut parser = BaseParser::new();
    let text_chars: Vec<char> = text.chars().collect();

    let to_json = parser.builder(RefString::new(&text_chars));

    serde_json::to_string(&to_json).unwrap()
}

pub fn attr_json(text:&str) -> String{
    
    let mut parser = HTMLAttr::new();
    let text_chars: Vec<char> = text.chars().collect();

    parser.full_parser(RefString::new(&text_chars), 0);

    serde_json::to_string(&parser.values).unwrap()
}