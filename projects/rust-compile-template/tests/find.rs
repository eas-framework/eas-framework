use std::fs;
use std::env;


#[test]
fn check_build() {

    let file = env::current_dir().unwrap().as_path().to_str().unwrap().to_string();

    let contents = fs::read_to_string(file+"/tests/texts/big.html").unwrap();

    let parser = rust_assembly::find_close_char_html_elem(&contents, "head");

    println!("index {:?}, array:  {:?}", parser, rust_assembly::get_errors());

    let next_next: String = contents.chars().skip(parser as usize).collect();
    
    println!("{:?}",next_next);
}