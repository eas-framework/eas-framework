import LocalSql from './localSql'

(<any>global).LocalSql = LocalSql;

declare global {
    let LocalSql: LocalSql
}

export {LocalSql};