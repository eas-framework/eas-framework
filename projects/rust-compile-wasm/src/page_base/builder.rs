use super::{parser::BaseParser, html_attr::{HTMLAttr}};
use crate::better_string::b_string::BetterString;

pub fn page_base(text:&str) -> String{
    let mut parser = BaseParser::new();
    let to_json = parser.builder(BetterString::new(text));

    serde_json::to_string(&to_json).unwrap()
}

pub fn attr_json(text:&str) -> String{
    
    let mut parser = HTMLAttr::new();
    parser.full_parser(BetterString::new(text), 0);

    serde_json::to_string(&parser.values).unwrap()
}