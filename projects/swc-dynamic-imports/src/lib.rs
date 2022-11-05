#![feature(box_into_inner)]

use imports::DynamicImports;
use swc_ecma_parser::{EsConfig, Syntax};

mod create_exports;
mod dynamic;
mod exports;
mod visitor;
pub mod imports;
mod utils;
use swc_core::ecma::{
    transforms::testing::test,
    visit::as_folder
};

pub fn get_test_config() -> Syntax {
    let mut config = EsConfig::default();
    config.import_assertions = true;
    Syntax::Es(config)
}


test!(
    get_test_config(),
    |_| as_folder(DynamicImports::default()),
    boo,
    // Input codes
    r#"
//!static/index.page:1:45 -> static/index.page.js:1:41
import {getNumber} from './some.hide.js';
;"#,
    // Output codes after transformed with plugin
    r#""#
);