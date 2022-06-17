#![allow(dead_code)]
#![feature(once_cell)]

mod actions;
mod html_search;
mod page_base;
pub mod razor;
pub mod ejs;
pub mod better_string;
use better_string::b_string::BetterString;
use html_search::builder::InsertComponent;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
use lazy_static::lazy_static;
use std::sync::{ Mutex};

lazy_static!{
    static ref COMPONENT_BUILDER: Mutex<InsertComponent> = Mutex::new(InsertComponent::new(vec![], vec![]));
}

#[wasm_bindgen]
pub fn find_close_char_html_elem(text: &str, search: &str) -> i32 {
    COMPONENT_BUILDER.lock().unwrap().public_html_element(text, search)
}

#[wasm_bindgen]
pub fn find_close_char(text: &str, search: &str) -> i32 {
    COMPONENT_BUILDER.lock().unwrap().find_close_char(text, search)
}

#[wasm_bindgen]
pub fn get_errors() -> String {
    let mut comp = COMPONENT_BUILDER.lock().unwrap();
    let copy_string = serde_json::to_string(&comp.error_vec).unwrap();
    comp.clear();

    copy_string
}

#[wasm_bindgen]
pub fn find_end_block(text: &str, block: &str) -> i32 {
    let block_chars = block.chars().collect::<Vec<char>>();
    actions::base_reader::block_skip_text(&BetterString::new(text), block_chars)
}

#[wasm_bindgen]
pub fn insert_component(skip_special_tag: &str, simple_skip: &str) {
    let skip:Vec<Vec<String>> = serde_json::from_str(skip_special_tag).unwrap();
    let simple: Vec<String> = serde_json::from_str(simple_skip).unwrap();

    let mut comp = COMPONENT_BUILDER.lock().unwrap();

    comp.skip_special_tag = skip.iter().map(|x| x.iter().map(|b| BetterString::new(b)).collect()).collect();
    comp.simple_skip = simple.iter().map(|x| BetterString::new(x)).collect();
}

fn parse_end_type(end_type: &str) -> Vec<BetterString>{
    let end_t: Vec<String> = serde_json::from_str(end_type).unwrap();
    let as_better: Vec<BetterString>= end_t.iter().map(|x| BetterString::new(x)).collect();
    as_better
}

#[wasm_bindgen]
pub fn find_end_of_def(text: &str, end_type: &str) -> i32{
    let mut copy: Vec<&BetterString>  = vec![];
    let vec_better = parse_end_type(end_type);

    for i in vec_better.iter() {
        copy.push(&i);
    }


    actions::base_reader::find_end_of_def(&BetterString::new(text), copy)
}

#[wasm_bindgen]
pub fn find_end_of_q(text: &str, q_type: char) -> usize {
    actions::base_reader::find_end_of_q(&BetterString::new(text), q_type)
}

#[wasm_bindgen]
pub fn razor_to_ejs(text: &str) -> String {
    razor::builder::output_json_runtime(text)
}

#[wasm_bindgen]
pub fn razor_to_ejs_compile(text: &str) -> String {
    razor::builder::output_json_compile(text)
}

#[wasm_bindgen]
pub fn razor_to_ejs_min(text: &str, name: &str) -> String {
    razor::builder::output_mini_json(text, name)
}

#[wasm_bindgen]
pub fn ejs_parse(text: &str, start: &str, end: &str) -> String {
    ejs::builder::output_json(text, start, end)
}

#[wasm_bindgen]
pub fn page_base_parser(text: &str) -> String{
    page_base::builder::page_base(text)
}

#[wasm_bindgen]
pub fn html_attr_parser(text: &str) -> String{
    page_base::builder::attr_json(text)
}