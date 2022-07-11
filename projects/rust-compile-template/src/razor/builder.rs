use super::mini_razor::MiniRazor;
use super::razor_syntax::Razor;
use super::razor_syntax::RazorBlock;
use crate::better_string::b_string::BetterString;
use crate::better_string::r_string::RefString;
use crate::better_string::u_string::UString;
use lazy_static::lazy_static;
use std::collections::HashMap;
use once_cell::sync::Lazy;
use std::sync::{Mutex, MutexGuard};
/*Basic Methods */

pub fn output_razor_blocks<T>(
    text: &str,
    mut data_builder: MutexGuard<Razor>,
    func: &dyn Fn(&Vec<RazorBlock>) -> T,
) -> T {
    let chars: Vec<char> = text.chars().collect();
    let text_as_ref = RefString::new(&chars);
    data_builder.builder(&text_as_ref, 0);
    data_builder.optimize();

    let return_values = func(&data_builder.values);
    data_builder.values = vec![];
    return_values
}

lazy_static! {
    static ref ADD_RAZOR: HashMap<String, String> = HashMap::from([
        ("include".to_owned(), "await ".to_owned()),
        ("import".to_owned(), "await ".to_owned()),
        ("default".to_owned(), "attr_".to_owned())
    ]);
}

pub fn transpile_to_ejs<T: UString>(
    text_as_better: &T,
    data_builder_values: &Vec<RazorBlock>,
) -> String {
    let mut re_build_text = String::new();

    for i in data_builder_values {
        let cut_text = text_as_better.substring(i.start, i.end).to_string();

        re_build_text += &match i.name.as_str() {
            "text" => cut_text,
            "script" => format!("<%{}%>", cut_text),
            "print" => format!("<%={}%>", cut_text),
            "escape" => format!("<%:{}%>", cut_text),
            "compile" => format!("<%*{}%>", cut_text),
            _ => format!(
                "<%{}{}%>",
                ADD_RAZOR.get(&i.name).unwrap_or(&"".to_owned()),
                cut_text
            ),
        };
    }

    re_build_text
}

/*Razor runtime */
static RAZOR_RUNTIME: Lazy<Mutex<Razor>> = Lazy::new(|| {
    let mut data_builder: Razor = Razor::default();
    data_builder.s_comment = false;

    data_builder.s_add_to_script = vec![
        String::from("include"),
        String::from("import"),
        String::from("transfer"),
        String::from("stop"),
    ];
    data_builder.s_literal = vec![String::from("debugger")];

    data_builder.s_write_start_with = vec![
        BetterString::new("("),
        BetterString::new(":("),
        BetterString::new("stop("),
        BetterString::new("include("),
        BetterString::new("import("),
        BetterString::new("transfer("),
        BetterString::new("debugger"),
    ];

    Mutex::new(data_builder)
});

//**razor runtime**
pub fn convert_ejs_runtime(text: &str) -> String {
    let chars: Vec<char> = text.chars().collect();
    let text_as_ref = RefString::new(&chars);

    output_razor_blocks(text, RAZOR_RUNTIME.lock().unwrap(), &|values| {
        transpile_to_ejs(&text_as_ref, values)
    })
}

pub fn output_json_runtime(text: &str) -> String {
    output_razor_blocks(text, RAZOR_RUNTIME.lock().unwrap(), &|values| {
        serde_json::to_string(values).unwrap()
    })
}

//**mini razor**
pub fn convert_ejs_mini(text: &str, name: &str) -> String {
    let mut data_builder = MiniRazor::new(name);
    let text_as_better = BetterString::new(text);

    data_builder.builder(&text_as_better, 0);

    let mut re_build_text = String::new();
    let mut i = 0;
    let length = data_builder.values.len();
    while i < length {
        re_build_text += &text_as_better
            .substring(data_builder.values[i], data_builder.values[i + 1])
            .to_string();
        re_build_text += &format!(
            "<%{}%>",
            text_as_better
                .substring(data_builder.values[i + 2], data_builder.values[i + 3])
                .to_string()
        );
        i += 4;
    }

    re_build_text += &text_as_better
        .substring_start(data_builder.values[i - 1] + 1)
        .to_string();

    re_build_text
}

pub fn output_mini_json(text: &str, name: &str) -> String {
    let mut data_builder = MiniRazor::new(name);
    let text_chars: Vec<char> = text.chars().collect();
    let text_as_ref = RefString::new(&text_chars);
    data_builder.builder(&text_as_ref, 0);

    serde_json::to_string(&data_builder.values).unwrap()
}

/*Razor compile */
static RAZOR_COMPILE: Lazy<Mutex<Razor>> = Lazy::new(|| {
    let mut data_builder: Razor = Razor::default();
    data_builder.s_razor_keyword = BetterString::new("#");
    data_builder.s_comment = false;
    data_builder.s_add_to_script = vec![String::from("default"),String::from("define")];
    data_builder.s_literal = vec![String::from("debugger")];

    data_builder.s_write_start_with = vec![
        BetterString::new("("),
        BetterString::new(":("),
        BetterString::new("define("),
        BetterString::new("default("),
        BetterString::new("debugger")
    ];

    Mutex::new(data_builder)
});

//**compile razor**
pub fn convert_ejs_compile(text: &str) -> String {
    let chars: Vec<char> = text.chars().collect();
    let text_as_ref = RefString::new(&chars);

    output_razor_blocks(text, RAZOR_COMPILE.lock().unwrap(), &|values| {
        transpile_to_ejs(&text_as_ref, values)
    })
}

pub fn output_json_compile(text: &str) -> String {
    output_razor_blocks(text, RAZOR_COMPILE.lock().unwrap(), &|values| {
        serde_json::to_string(values).unwrap()
    })
}