use std::fs;
use std::env;

#[test]
fn check_build() {

    let file = env::current_dir().unwrap().as_path().to_str().unwrap().to_string();

    let contents = fs::read_to_string(file+"/tests/texts/page_base.html").unwrap();

    let parsed = rust_assembly::page_base_parser(&contents,);

    println!("contents {} after: {}", contents, parsed);
}