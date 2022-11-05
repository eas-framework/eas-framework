use swc_common::Span;
use swc_core::{ecma::atoms::JsWord, common::DUMMY_SP};
use inflector::cases::camelcase::to_camel_case;
use swc_ecma_ast::{Expr, ExprStmt, Stmt, CallExpr, ExprOrSpread, AwaitExpr, Ident, Callee};

pub fn local_name_for_src(src: &JsWord) -> JsWord {
    if !src.contains('/') {
        return format!("_{}", to_camel_case(src)).into();
    }

    format!("_{}", to_camel_case(src.split('/').last().unwrap())).into()
}

pub fn stmt_expr(expr: Expr) -> Stmt{
    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(expr)
    })
}

pub fn async_importer(args: Vec<ExprOrSpread>, import_method: &str) -> Box<Expr>{

    let importer = CallExpr {
        span: DUMMY_SP,

        callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
            import_method.to_owned().into(),
            DUMMY_SP,
        )))),
        args,
        type_args: None,
    };

    let importer_await = AwaitExpr {
        arg: Box::new(Expr::Call(importer)),
        span: DUMMY_SP,
    };

    Box::new(Expr::Await(importer_await))
}