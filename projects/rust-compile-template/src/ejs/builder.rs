use crate::better_string::{u_string::UString, b_string::BetterString, r_string::RefString};

use super::ejs_syntax::EJS;

pub fn rebuild_ejs(text: &str) -> String {
    let chars = text.chars().collect();
    let better_text = RefString::new(&chars);
    let mut builder = EJS::new(BetterString::new("<%"), BetterString::new("%>"));
    builder.builder(&better_text, 0);

    let mut output = String::new();

    for i in builder.values {
        let substring = better_text.substring(i.start, i.end).to_string();

        // println!("current: {}, type: {}, all: {}", &substring, i.name, output);

        output += &match i.name.as_str() {
            "text" => substring,
            "script" => format!("<%{}%>", substring),
            "print" => format!("<%={}%>", substring),
            "escape" => format!("<%:{}%>", substring),
            "debug" => format!("<%{{?debug_file?}}{}%>", substring),
            "no-track" => format!("<%!{}%>", substring),
            _ => "Error".to_owned(),
        };

    }

    output
}

pub fn output_json(text: &str, start: &str, end: &str) -> String {
    let mut builder = EJS::new(BetterString::new(start), BetterString::new(end));
    let chars: Vec<char> = text.chars().collect();
    builder.builder(&RefString::new(&chars), 0);

    serde_json::to_string(&builder.values).unwrap()
}
