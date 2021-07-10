mod actions;
mod builder;
use builder::InsertComponent;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
use lazy_static::lazy_static;
use std::sync::{ Mutex};

lazy_static!{
    static ref component_builder: Mutex<InsertComponent> = Mutex::new(InsertComponent::new(vec![], vec![]));
}

#[wasm_bindgen]
pub fn find_close_char(text: &str, search: &str, open: &str, close: &str, char_before_end: &str, as_big_tag: bool) -> i32{
    component_builder.lock().unwrap().find_close_char(text, search, open, close, &char_before_end.chars().next().unwrap(), as_big_tag, 0)
}

#[wasm_bindgen]
pub fn find_close_char_html_elem(text: &str, search: &str) -> i32{
    component_builder.lock().unwrap().public_html_element(text, search)
}

#[wasm_bindgen]
pub fn attribute(text: &str) -> String {
    serde_json::to_string(&InsertComponent::get_attribute(text)).unwrap()
}

#[wasm_bindgen]
pub fn get_errors() -> String {
    let mut comp = component_builder.lock().unwrap();
    let copy_string = serde_json::to_string(&comp.error_vec).unwrap();
    comp.clear();

    copy_string
}


#[wasm_bindgen]
pub fn insert_component(skip_special_tag: &str, simple_skip: &str) {
    let skip:Vec<Vec<String>> = serde_json::from_str(skip_special_tag).unwrap();
    let simple: Vec<String> = serde_json::from_str(simple_skip).unwrap();

    let mut comp = component_builder.lock().unwrap();

    comp.skip_special_tag = skip;
    comp.simple_skip = simple;
}

#[wasm_bindgen]
pub fn find_end_of_def(text: &str, end_type: &str) -> i32{
    let end_t: Vec<String> = serde_json::from_str(end_type).unwrap();

    let mut copy: Vec<&str>  = vec![];

    for i in end_t.iter() {
        copy.push(&i);
    }

    actions::base_reader::find_end_of_def(text, copy)
}

#[wasm_bindgen]
pub fn find_end_of_q(text: &str, q_type: char) -> usize {
    actions::base_reader::find_end_of_q(text, q_type)
}