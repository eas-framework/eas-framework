use std::fs;
use std::env;

#[test]
fn check_build() {

    let file = env::current_dir().unwrap().as_path().to_str().unwrap().to_string();

    let contents = fs::read_to_string(file+"/tests/texts/ejs.html").unwrap();

    let rebuild = rust_assembly::ejs::builder::rebuild_ejs(&contents);

    println!("before {} after: {}", contents, rebuild);
}