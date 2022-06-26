import LocalSql from './localSql'
import {print} from '../OutputInput/Console'

(<any>global).LocalSql = LocalSql;
(<any>global).dump = print;

declare global {
    let LocalSql: LocalSql
    let dump: typeof console
    let __DEBUG__: boolean
}

export {LocalSql, print as dump};