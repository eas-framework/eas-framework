use serde::Deserialize;
use std::collections::HashMap;
use swc_core::{
    common::{util::take::Take, Span, DUMMY_SP},
    ecma::{
        ast::{Program, *},
        atoms::js_word,
    },
};
use swc_ecma_utils::{
    ident::IdentLike, member_expr, private_ident, quote_ident, quote_str, undefined,
    var::VarCollector, ExprFactory, extract_var_ids,
};

use crate::{
    dynamic::DynamicAsVariable,
    imports::DynamicImports,
    utils::{local_name_for_src, stmt_expr},
};

struct ExportDecValues {
    ident: Ident,
    expr: Option<Expr>
}

#[derive(Deserialize, Debug, Clone)]
pub struct KeyValueExport {
    pub ident: ModuleExportName,
    pub export: ExprStmt,
}

#[derive(Deserialize, Debug, Clone)]
pub struct DynamicExports {
    pub imports: Vec<VarDecl>,
    pub names: Vec<KeyValueExport>,
    pub export_star: Vec<Vec<ExprOrSpread>>,
    pub require_var_name: Ident
}

impl DynamicExports {
    pub fn new(require_var_name: &str) -> Self {
        DynamicExports {
            imports: vec![],
            names: vec![],
            export_star: vec![],
            require_var_name: quote_ident!(require_var_name)
        }
    }

    fn module_name_to_expr(name: &ModuleExportName) -> Expr {
        match name {
            ModuleExportName::Ident(ident) => Expr::Ident(ident.clone()),
            ModuleExportName::Str(str) => Expr::Lit(Lit::Str(str.clone())),
        }
    }

    fn module_name_to_prop(name: &ModuleExportName) -> MemberProp {
        match name {
            ModuleExportName::Ident(ident) => MemberProp::Ident(ident.clone()),
            ModuleExportName::Str(str) => MemberProp::Computed(ComputedPropName {
                expr: Box::new(Expr::Lit(Lit::Str(str.clone()))),
                span: DUMMY_SP
            }),
        }
    }

    /**
     * push export variables names, and import / export statements
     */
    fn push_specifiers(&mut self, specifiers: &Vec<ExportSpecifier>, import_object: &Ident) {
        let obj = Box::new(Expr::Ident(import_object.clone()));

        for specifier in specifiers.to_owned() {
            match specifier {
                ExportSpecifier::Named(export) => {
                    let expr = if export.exported.is_none() {
                        Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: obj.clone(),
                            prop: DynamicExports::module_name_to_prop(&export.orig),
                        })
                    } else {

                        match export.exported.unwrap() {
                            ModuleExportName::Ident(ident) => Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                            obj: obj.clone(),
                                prop: MemberProp::Ident(ident),
                            }),
                            ModuleExportName::Str(str) => Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: obj.clone(),
                                prop: MemberProp::Computed(ComputedPropName {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Lit(Lit::Str(str))),
                                }),
                            }),
                        }
                    };

                    let export_stmt = ExprStmt {
                        span: export.span,
                        expr: Box::new(expr),
                    };

                    self.names.push(KeyValueExport {
                        ident: export.orig,
                        export: export_stmt,
                    });
                }

                ExportSpecifier::Namespace(export) => {
                    let export = ExprStmt {
                        span: export.span,
                        expr: Box::new(match export.name {
                            ModuleExportName::Ident(ident) => Expr::Ident(ident),
                            ModuleExportName::Str(ident) => Expr::Lit(Lit::Str(ident)),
                        }),
                    };

                    self.names.push(KeyValueExport {
                        ident: ModuleExportName::Ident(Ident::from_ident(&self.require_var_name)),
                        export,
                    });
                }

                _ => (),
            };
        }
    }

    fn export_ident(&mut self, orig: &mut NamedExport) {
        for specifier in &orig.specifiers {
            match specifier {
                ExportSpecifier::Named(export) => {
                    let export_stmt = ExprStmt {
                        span: export.span,
                        expr: Box::new(DynamicExports::module_name_to_expr(&export.orig)),
                    };

                    self.names.push(KeyValueExport {
                        ident: export.exported.clone().unwrap_or(export.orig.clone()),
                        export: export_stmt,
                    });
                }

                _ => (),
            };
        }
    }

    pub fn export_name_decl(&mut self, orig: &mut NamedExport) {
        if orig.type_only {
            return;
        }

        if orig.src.is_none() {
            return self.export_ident(orig);
        }

        let src = orig.src.take().unwrap();
        let require_var_name = private_ident!(local_name_for_src(&src.value));
        let mut args = vec![ExprOrSpread {
            expr: Box::new(src.into()),
            spread: None,
        }];

        if orig.asserts != None {
            args.push(ExprOrSpread {
                expr: Box::new(orig.asserts.take().unwrap().into()),
                spread: None,
            })
        }

        /**
         * create the `require` caller ->
         * import "Ffff" -> require("Ffff")
         */
        let importer = CallExpr {
            span: orig.span.to_owned(),
            callee: Callee::Expr(Box::new(Expr::Ident(self.require_var_name.clone()))),
            args,
            type_args: None,
        };

        //make async
        let importer_await = AwaitExpr {
            arg: Box::new(Expr::Call(importer)),
            span: DUMMY_SP,
        };

        let importer_expr_await = Box::new(Expr::Await(importer_await));

        self.push_specifiers(&orig.specifiers, &require_var_name);
        //variable -> var {a} = await require("next")
        self.imports.push(VarDecl {
            kind: VarDeclKind::Var,
            declare: false,
            span: DUMMY_SP,
            decls: vec![VarDeclarator {
                definite: false,
                init: Some(importer_expr_await),
                span: DUMMY_SP,
                name: Pat::Ident(Ident::from_ident(&require_var_name).into()),
            }],
        });
    }

    pub fn default_ident() -> Ident{
        quote_ident!("default")
    }

    pub fn push_key_value(&mut self, key: &Ident, value: &Ident) {
        self.names.push(
            KeyValueExport { ident: ModuleExportName::Ident(key.clone()), export: ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Ident(value.clone()))
            } }
        )
    }

    pub fn export_default_decl(&mut self, orig: &mut ExportDefaultDecl) -> Option<Stmt>{
        let mut ident = private_ident!("_default");
        let mut expr = None;

        match &mut orig.decl {
            DefaultDecl::Class(class) => {
                if class.ident == None {
                    class.ident = Some(ident.clone());
                } else {
                    ident = class.ident.clone().unwrap();
                }

                expr = Some(Stmt::Decl(Decl::Class(ClassDecl {
                    ident: ident.clone(),
                    declare: false,
                    class: class.class.clone()
                })));
            }

            DefaultDecl::Fn(func) => {
                if func.ident == None {
                    func.ident = Some(ident.clone());
                } else {
                    ident = func.ident.clone().unwrap();
                }

                expr = Some(Stmt::Decl(Decl::Fn(FnDecl {
                    ident: ident.clone(),
                    declare: false,
                    function: func.function.clone()
                })));
            }

            _ => (),
        }

        if expr != None {
            self.push_key_value(&DynamicExports::default_ident(),&ident);
        }

        expr
    }
    pub fn export_decl(&mut self, orig: &mut ExportDecl) -> ModuleItem {


        let ok = match &mut orig.decl {
            Decl::Class(class) => {
                self.push_key_value(&class.ident,&class.ident);

                true
            }

            Decl::Fn(func) => {
                self.push_key_value(&func.ident,&func.ident);
                true
            }

            Decl::Var(var) => {
                for ident in extract_var_ids(var) {
                    self.push_key_value(&ident,&ident);
                }
                true
            }

            _ => false,
        };

        if ok {
            ModuleItem::Stmt(Stmt::Decl(orig.decl.clone()))
        } else {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(orig.clone()))
        }
    }

    pub fn export_default_expr(&mut self, expr: &mut ExportDefaultExpr){
        self.names.push(KeyValueExport { ident: ModuleExportName::Ident(
            DynamicExports::default_ident()
        ), export: ExprStmt { span: DUMMY_SP, expr: expr.expr.clone() } })
        
    }

    pub fn export_all(&mut self, expr: &mut ExportAll){
        let mut args = vec![ExprOrSpread {
            expr:Box::new(Expr::Lit(Lit::Str(expr.src.clone()))),
            spread: None
        }];

        if expr.asserts.is_some() {
            args.push(ExprOrSpread {
                expr: Box::new(Expr::Object(expr.asserts.clone().unwrap())),
                spread: None
            });
        }
        self.export_star.push(args);
    }
}
