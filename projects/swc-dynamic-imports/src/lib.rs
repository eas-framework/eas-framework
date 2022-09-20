mod create_exports;
mod dynamic;
mod exports;
mod imports;
mod utils;
use std::task::Context;

use crate::imports::DynamicImports;
use create_exports::CreateExports;
use serde_json::Value;
use swc_core::{
    common::DUMMY_SP,
    ecma::{
        ast::{Program, *},
        transforms::{base::fixer::paren_remover, testing::test},
        visit::{as_folder, VisitMut, VisitMutWith},
    },
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};
use swc_ecma_ast::ModuleItem;

use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_utils::quote_ident;

#[plugin_transform]
fn dynamic_import(mut program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let mut imports = DynamicImports::default();

    let plugin_config: Value = serde_json::from_str(
        &metadata
            .get_transform_plugin_config()
            .expect("failed to get plugin config for dynamic eas syntax"),
    )
    .expect("Should provide plugin config");

    imports.import_method = plugin_config["importMethod"]
        .as_str()
        .unwrap_or(&imports.import_method)
        .to_string();
    imports.exports.require_var_name = quote_ident!(imports.import_method.clone());

    imports.stop_method = plugin_config["stopMethod"]
        .as_str()
        .unwrap_or(&imports.stop_method)
        .to_string();
    imports.stop_method_to_keyword = plugin_config["stopMethodToKeyword"]
        .as_str()
        .unwrap_or(&imports.stop_method_to_keyword)
        .to_string();

    program.visit_mut_with(&mut imports);
    program
}

impl VisitMut for DynamicImports {
    fn visit_mut_module(&mut self, modules: &mut Module) {
        let mut save: Vec<ModuleItem> = vec![];

        for module in &mut modules.body {
            if !self.visit_mut_module_item_like(module) {
                VisitMutWith::visit_mut_children_with(module, self);
                save.push(module.clone());
            }
        }

        let mut new_exports = CreateExports::new(&self.exports);
        new_exports.export_all();

        new_exports.modules.append(&mut save);
        modules.body = new_exports.modules;
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        self.visit_mut_call_expr_like(call);
        VisitMutWith::visit_mut_children_with(call, self);
    }

    fn visit_mut_expr_stmt(&mut self, expr: &mut ExprStmt) {
        if let Expr::Call(call) = &mut *expr.expr {
            if let Callee::Expr(callee) = &mut call.callee {
                if let Expr::Ident(call_identify) = &mut **callee {
                    if self.stop_method_to_return_ident(call_identify) && call.args.len() == 0 {
                        expr.expr = callee.clone();
                    }
                }
            }
        }

        VisitMutWith::visit_mut_children_with(expr, self);
    }

    fn visit_mut_member_expr(&mut self, expr: &mut MemberExpr){
        if let Expr::MetaProp(_) = *expr.obj {
            self.import_meta(expr)
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        self.stop_method_to_return_ident(ident);
        VisitMutWith::visit_mut_children_with(ident, self);
    }
}

fn get_test_config() -> Syntax {
    let mut config = EsConfig::default();
    config.import_assertions = true;
    Syntax::Es(config)
}

test!(
    get_test_config(),
    |_| as_folder(DynamicImports::default()),
    boo,
    // Input codes
    r#"import Moo, {a as bb, cc} from './ddd' assert {type: "json"}
    Moo()
    a()
    bb()
    cc()
    import 'fff'
    await import('jdrjj')
    stop(2)
    stop
    
    export const v = 9
    export {a, b, c} from 'ddd'
    export {e as k}
    export default function me(){
    
    }"#,
    // Output codes after transformed with plugin
    r#""#
);
