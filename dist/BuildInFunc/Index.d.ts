import LocalSql from './localSql';
import { print } from '../OutputInput/Console';
declare global {
    let LocalSql: LocalSql;
    let dump: typeof console;
}
export { LocalSql, print as dump };
