use crate::better_string::b_string::BetterString;

use super::ejs_syntax::EJS;

pub fn rebuild_ejs(text: &str) -> String {
    let better_text = BetterString::new(text);
    let mut builder = EJS::new(BetterString::new("<%"), BetterString::new("%>"));
    builder.builder(better_text.clone(), 0);

    let mut output = String::new();

    for i in builder.values {
        let substring = better_text.substring(i.start, i.end).to_string();

        output += &match i.name.as_str() {
            "text" => substring,
            "script" => format!("<%{}%>", substring),
            "print" => format!("<%={}%>", substring),
            "escape" => format!("<%:{}%>", substring),
            "debug" => format!("<%{{?debug_file?}}{}%>", substring),
            "hide-script" => format!("<%*{}%>", substring),
            _ => "Error".to_owned(),
        }
    }

    output
}

pub fn output_json(text: &str, start: &str, end: &str) -> String {
    let mut builder = EJS::new(BetterString::new(start), BetterString::new(end));
    builder.builder(BetterString::new(text), 0);

    serde_json::to_string(&builder.values).unwrap()
}
