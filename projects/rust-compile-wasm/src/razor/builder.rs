use super::razor_syntax::Razor;
use super::mini_razor::MiniRazor;
use crate::better_string::b_string::BetterString;
use crate::better_string::u_string::UString;
use std::collections::HashMap;
use lazy_static::lazy_static;

lazy_static!{
    static ref ADD_RAZOR: HashMap<String, String>= HashMap::from([("include".to_owned(), "await ".to_owned()), ("import".to_owned(), "await ".to_owned())]);
}

pub fn make_values(text: &str) -> (BetterString, Razor) {
    let text_as_better = BetterString::new(text);
    let mut data_builder = Razor::new();
    data_builder.builder(&text_as_better, 0);
    data_builder.optimize();
    (text_as_better, data_builder)
}

pub fn convert_ejs(text: &str) -> String {
    let (text_as_better, data_builder) = make_values(text);
    let mut re_build_text = String::new();

    for i in data_builder.values {
        let cut_text = text_as_better.substring(i.start, i.end).to_string();
        re_build_text += &match i.name.as_str() {
            "text" => cut_text,
            "script" => format!("<%{}%>", cut_text),
            "print" => format!("<%={}%>", cut_text),
            "escape" => format!("<%:{}%>", cut_text),
            "compile" => format!("<%*{}%>", cut_text),
            _ => format!("<%{}{}%>", ADD_RAZOR.get(&i.name).unwrap(),cut_text)
        };
    }

    re_build_text
}


pub fn convert_ejs_mini(text: &str, name: &str) -> String {
    let mut data_builder = MiniRazor::new(name);
    let text_as_better = BetterString::new(text);

    data_builder.builder(&text_as_better, 0);

    let mut re_build_text = String::new();
    let mut i = 0;
    let length =  data_builder.values.len();
    while i < length {
        re_build_text += &text_as_better.substring(data_builder.values[i], data_builder.values[i+1]).to_string();
        re_build_text += &format!("<%{}%>", text_as_better.substring(data_builder.values[i+2], data_builder.values[i+3]).to_string());
        i += 4;
    }

    re_build_text += &text_as_better.substring_start(data_builder.values[i-1]+1).to_string();


    re_build_text
}

pub fn output_json(text: &str) -> String {
    let (_, data_builder) = make_values(text);

    serde_json::to_string(&data_builder.values).unwrap()
}

pub fn output_mini_json(text: &str, name: &str) -> String {
    let mut data_builder = MiniRazor::new(name);
    let text_as_better = BetterString::new(text);
    data_builder.builder(&text_as_better, 0);

    serde_json::to_string(&data_builder.values).unwrap()
}