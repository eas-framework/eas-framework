use swc_core::ecma::{
    transforms::testing::test,
    visit::as_folder
};

use swc_dynamic_imports::imports::DynamicImports;

test!(
    swc_dynamic_imports::get_test_config(),
    |_| as_folder(DynamicImports::default()),
    boo,
    // Input codes
    r#"
//!static/index.page:1:45 -> static/index.page.js:1:41
"dwdwd"
import {getNumber} from './some.hide.js';
;"#,
    // Output codes after transformed with plugin
    r#""#
);