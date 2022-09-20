use serde::Deserialize;
use std::collections::HashMap;
use swc_common::{Mark, DUMMY_SP};
use swc_core::{
    common::{util::take::Take, Span},
    ecma::{
        ast::{Program, *},
        atoms::js_word,
    },
};
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    extract_var_ids, ident::IdentLike, member_expr, private_ident, quote_ident, quote_str,
    undefined, var::VarCollector, ExprFactory,
};

use crate::{exports::DynamicExports, utils::async_importer};

fn create_export_star() {}

pub struct CreateExports {
    ident_export: Ident,
    exports: DynamicExports,
    ident_create_export: Ident,
    export_star_ident: Ident,
    pub modules: Vec<ModuleItem>,
}

impl CreateExports {
    pub fn new(exports: &DynamicExports) -> Self {
        CreateExports {
            exports: exports.clone(),
            ident_export: quote_ident!("exports"),
            ident_create_export: private_ident!("_export"),
            export_star_ident: private_ident!("_exportStar"),
            modules: vec![],
        }
    }

    fn async_importer_str(&self, args: Vec<ExprOrSpread>) -> Box<Expr> {
        async_importer(&DUMMY_SP, args, &self.exports.require_var_name.sym)
    }

    fn create_export_all(&mut self, args: Vec<ExprOrSpread>) {
        let require = self.async_importer_str(args);

        let module = helper_expr!(export_star, "exportStar").as_call(
            DUMMY_SP,
            vec![
                ExprOrSpread {
                    expr: require,
                    spread: None,
                },
                ExprOrSpread {
                    expr: Box::new(Expr::Ident(self.ident_export.clone())),
                    spread: None,
                },
            ],
        );

        self.modules.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            expr: Box::new(module),
            span: DUMMY_SP,
        })))
    }

    fn add_var_dev(&mut self, var: VarDecl) {
        self.modules
            .push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))))
    }

    fn create_key_value_export(&mut self) {
        let mut props = vec![];

        for key_value in self.exports.names.clone() {
            let key = match key_value.ident {
                ModuleExportName::Ident(ident) => PropName::Ident(ident),
                ModuleExportName::Str(str) => PropName::Str(str),
            };

            props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: Box::new(Expr::Arrow(ArrowExpr {
                    body: BlockStmtOrExpr::Expr(key_value.export.expr),
                    is_async: false,
                    is_generator: false,
                    params: vec![],
                    return_type: None,
                    span: DUMMY_SP,
                    type_params: None,
                })),
            }))))
        }

        let exports = CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::Ident(self.ident_create_export.clone()))),
            args: vec![
                ExprOrSpread {
                    expr: Box::new(Expr::Ident(self.ident_export.clone())),
                    spread: None,
                },
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props,
                    })),
                },
            ],
            type_args: None,
        };

        self.modules
        .push(ModuleItem::Stmt(Stmt::Expr(            
            ExprStmt {
            expr: Box::new(Expr::Call(exports)),
            span: DUMMY_SP
        })));
    }

    pub fn export_all(&mut self) {
        for export_args in self.exports.export_star.clone() {
            self.create_export_all(export_args);
        }

        if self.exports.export_star.len() > 0 {
            //add exportStar
        }

        for var in self.exports.imports.clone() {
            self.add_var_dev(var);
        }

        self.create_key_value_export();        
    }
}
