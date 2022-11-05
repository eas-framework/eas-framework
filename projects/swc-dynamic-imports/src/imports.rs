use serde::Deserialize;
use swc_core::{
    common::{ util::take::Take, Span, DUMMY_SP,},
    ecma::{
        ast::{Program, *},
        atoms::{js_word},
    },
};

use crate::{exports::DynamicExports, dynamic::DynamicAsVariable, utils::async_importer};



#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DynamicImports {
    pub import_method: String,
    pub stop_method: String,
    pub stop_method_to_keyword: String,
    pub exports: DynamicExports
}

impl Default for DynamicImports {
    fn default() -> Self {
        DynamicImports {
            import_method: "require".to_string(),
            stop_method: "stop".to_string(),
            stop_method_to_keyword: "return".to_string(),
            exports: DynamicExports::new("require")
        }
    }
}

impl DynamicImports {

    /**
     * Change the module -> on export/import
     * return {bool}: remove this module
     */
    pub fn visit_mut_module_item_like(&mut self, decl: &mut ModuleItem) -> bool {

        let mut remove_this = false;
        match decl {
            ModuleItem::ModuleDecl(model) => {
                let change = match model {
                    ModuleDecl::Import(import) => {
                        Some(ModuleItem::Stmt(self.visit_mut_import_dec_like(import)))
                    }

                    ModuleDecl::ExportNamed(name) => {
                        self.exports.export_name_decl(name);
                        None
                    }

                    ModuleDecl::ExportDefaultDecl(default) => {
                        let value = self.exports.export_default_decl(default);

                        if value == None {
                            None
                        } else {
                            Some(ModuleItem::Stmt(value.unwrap()))
                        }
                    }

                    ModuleDecl::ExportDefaultExpr(expr) => {
                        self.exports.export_default_expr(expr);
                        None
                    }

                    ModuleDecl::ExportDecl(expr) => {
                        Some(self.exports.export_decl(expr))
                    }

                    ModuleDecl::ExportAll(expr) => {
                        self.exports.export_all(expr);
                        None
                    }

                    _ => None
                };

                if change != None {
                    *decl = change.unwrap();
                } else {
                    remove_this = true;
                }

            }
            _ => ()
        }

        remove_this

    }

    /**
     * Handel import statement
     * import Default, {a as b, c} from "next"
     * import * as d from "next"
     * import "more"
     */
    pub fn visit_mut_import_dec_like(&mut self, orig: &mut ImportDecl) -> Stmt {
        let mut args = vec![ExprOrSpread {
            expr: Box::new(Expr::Lit(Lit::Str(orig.src.clone().into()))),
            spread: None,
        }];

        if orig.asserts != None {
            args.push(ExprOrSpread {
                expr: Box::new(orig.asserts.take().unwrap().into()),
                spread: None,
            })
        }

        let importer_expr_await = async_importer(args, &self.import_method);

        let mut vars_props: Vec<ObjectPatProp> = vec![];
        let mut namespace_variable = None;

        for specifier in orig.specifiers.to_owned() {
            let variable_export = match specifier {
                ImportSpecifier::Default(import) => {
                    DynamicAsVariable::KeyValue(ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident(Ident::new(js_word!("default"), DUMMY_SP)),
                        value: Box::new(Pat::Expr(Box::new(Expr::Ident(import.local)))),
                    }))
                }

                ImportSpecifier::Named(import) => {
                    DynamicAsVariable::KeyValue(if import.imported == None {
                        ObjectPatProp::Assign(AssignPatProp {
                            key: import.local,
                            span: import.span,
                            value: None,
                        })
                    } else {
                        let value = match import.imported.unwrap() {
                            ModuleExportName::Ident(ident) => Pat::Ident(ident.into()),
                            ModuleExportName::Str(str) => {
                                Pat::Expr(Box::new(Expr::Lit(str.into())))
                            }
                        };

                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(import.local),
                            value: Box::new(value),
                        })
                    })
                }

                ImportSpecifier::Namespace(import) => DynamicAsVariable::Var(VarDeclarator {
                    definite: false,
                    init: Some(importer_expr_await.to_owned()),
                    name: Pat::Ident(import.local.into()),
                    span: import.span,
                }),
            };

            match variable_export {
                DynamicAsVariable::KeyValue(prop) => {
                    vars_props.push(prop);
                }
                DynamicAsVariable::Var(var) => {
                    namespace_variable = Some(var);
                }
            }
        }

        // empty import -> import "next" -> await require("next")
        if namespace_variable == None && vars_props.len() == 0 {
            return Stmt::Expr(ExprStmt {
                expr: importer_expr_await,
                span: orig.span
            });
        }

        //variable -> var {a} = await require("next")
        Stmt::Decl(Decl::Var(VarDecl {
            kind: VarDeclKind::Var,
            declare: false,
            span: orig.span,
            decls: vec![namespace_variable.unwrap_or(VarDeclarator {
                definite: false,
                init: Some(importer_expr_await),
                span: DUMMY_SP,
                name: Pat::Object(ObjectPat {
                    optional: false,
                    type_ann: None,
                    span: DUMMY_SP,
                    props: vars_props,
                }),
            })],
        }))
    }

    /**
     * replace the function import to require
     */
    pub fn visit_mut_call_expr_like(&mut self, orig: &mut CallExpr) {
        match &mut orig.callee {
            Callee::Import(import) => {
                orig.callee = Callee::Expr(Box::new(Expr::Ident(Ident::new(
                    self.import_method.to_owned().into(),
                    import.span,
                ))));
            }
            _ => (),
        }
    }

    pub fn import_meta(&mut self, orig: &mut MemberExpr) {
        orig.obj = Box::new(Expr::Ident(self.exports.require_var_name.clone()))
    }

    pub fn stop_method_to_return_ident(&mut self, orig: &mut Ident) -> bool {
        if self.stop_method.len() > 0 && orig.sym.to_string() == self.stop_method {
            orig.sym = self.stop_method_to_keyword.to_owned().into();
            return true;
        }

        false
    }

}
