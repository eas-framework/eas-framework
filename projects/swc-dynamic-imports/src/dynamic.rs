use swc_ecma_ast::{ObjectPatProp, VarDeclarator};

pub enum DynamicAsVariable {
    KeyValue(ObjectPatProp),
    Var(VarDeclarator)
}