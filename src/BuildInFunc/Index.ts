import LocalSql from './localSql'
import fetch from 'node-fetch';

(<any>global).fetch = fetch;
(<any>global).LocalSql = LocalSql;

declare global {
    let LocalSql: LocalSql
}

export {LocalSql};