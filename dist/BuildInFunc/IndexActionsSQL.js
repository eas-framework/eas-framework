class CreateWhere {
    where;
    counter;
    sql;
    First;
    values;
    constructor(where, counter = 1) {
        if (!Array.isArray(where)) {
            this.where = where ? [where] : [];
        }
        else {
            this.where = where;
        }
        this.counter = counter;
        this.sql = '';
        this.values = [];
    }
    AddSelect(e) {
        if (!this.First) {
            this.sql += (e.operator ? e.operator.toUpperCase() : 'AND') + ' ';
        }
        else {
            this.First = false;
        }
        this.sql += e.filed + ' ' + (e.sign ? e.sign : '=') + ' ';
        if (e.NotSecure === true) {
            this.sql += e.value;
        }
        else {
            this.sql += '$' + this.counter;
            this.values.push(e.value);
            this.counter++;
        }
        this.sql += ' ';
    }
    Build() {
        if (this.where.length) {
            this.values = [];
            this.sql = ' WHERE ';
            this.First = true;
            for (const e of this.where) {
                if (Array.isArray(e)) {
                    if (!this.First) {
                        this.sql += 'AND ';
                    }
                    this.First = true;
                    this.sql += '(';
                    for (const i of e) {
                        this.AddSelect(i);
                    }
                    this.sql += ') ';
                }
                else {
                    this.AddSelect(e);
                }
            }
        }
    }
    /**
     * RunAndBuild: do all at once
     */
    static RunAndBuild(where, counter = 1) {
        const myWhere = new CreateWhere(where, counter);
        myWhere.Build();
        return {
            sql: myWhere.sql,
            values: myWhere.values
        };
    }
}
class JoinSQL {
    StopChars;
    TablesJoin;
    WhereArray;
    DefaultJoin;
    sqlOutput;
    sqlValues;
    WhereCounter;
    queryFunc;
    constructor(queryFunc, TablesJoin, WhereArray, Options = { StopChars: ' =<>().', DefaultJoin: 'INNER' }) {
        this.StopChars = Options.StopChars;
        this.DefaultJoin = Options.DefaultJoin;
        this.TablesJoin = TablesJoin;
        this.WhereArray = WhereArray;
        this.WhereCounter = 1;
        this.queryFunc = queryFunc;
    }
    setValues(TablesJoin) {
        for (const i in TablesJoin) {
            if (this[i]) {
                this[i] = TablesJoin[i];
            }
        }
    }
    IndexOfTable(table, tables) {
        for (const i in tables) {
            if (tables[i].name == table && !tables[i].used) {
                return Number(i);
            }
        }
        return -1;
    }
    CharTospecialChar(char) {
        const code = char.codePointAt(0);
        let hex = code.toString(16);
        hex = hex.toUpperCase();
        const len = hex.length;
        if (len == 1)
            hex = '000' + hex;
        if (len == 2)
            hex = '00' + hex;
        if (len == 3)
            hex = '0' + hex;
        return '\\u' + hex;
    }
    GetRegex() {
        let text = '';
        for (const i of this.StopChars) {
            if (text) {
                text += '|' + this.CharTospecialChar(i);
            }
            else {
                text += i;
            }
        }
        return eval(`/${text}/`);
    }
    FindTable(text, tables) {
        const splitData = text.trim().split(this.GetRegex());
        for (const i of splitData) {
            const tableIndex = this.IndexOfTable(i, tables);
            if (tableIndex != -1) {
                const table = tables[tableIndex];
                table.used = true;
                return table.name;
            }
        }
        return null;
    }
    /**
     * build sql string
     */
    Build() {
        //get all types and tables
        const tables = [], types = [];
        for (const i of this.TablesJoin.tables) {
            tables.push({ name: i.name });
            if (i.types) {
                for (const a of i.types.split(',')) {
                    if (!a.startsWith('NULL ')) {
                        types.push(i.name + "." + a.trim());
                    }
                    else {
                        types.push(a.trim());
                    }
                }
            }
        }
        tables[0].used = true;
        let sql = `SELECT ${types.toString()} FROM ${tables[0].name} `;
        for (const i of this.TablesJoin.texts) {
            const table = this.FindTable(i, tables);
            if (!table) {
                throw new Error(`Can't find table for join sql: "${i}", table: ${JSON.stringify(tables)}`);
            }
            const tableObject = this.TablesJoin.tables.find((e) => e.name == table);
            sql += `${tableObject.join ? tableObject.join : this.DefaultJoin} JOIN ${table} ON (${i}) `;
        }
        const GetWhere = CreateWhere.RunAndBuild(this.WhereArray, this.WhereCounter);
        sql += GetWhere.sql;
        if (this.TablesJoin.OrderStart) {
            sql += ' ORDER BY ' + this.TablesJoin.OrderStart + ' ASC';
        }
        if (this.TablesJoin.OrderEnd) {
            sql += ' ORDER BY ' + this.TablesJoin.OrderEnd + ' DESC';
        }
        if (this.TablesJoin.limit) {
            sql += ' LIMIT ' + this.TablesJoin.limit;
        }
        this.sqlOutput = sql;
        this.sqlValues = GetWhere.values;
    }
    get sql() {
        return this.sqlOutput;
    }
    get values() {
        return this.sqlValues;
    }
    async Run() {
        return await this.queryFunc(this.sqlOutput, ...this.sqlValues);
    }
    /**
     * build and run
     */
    static RunAndBuild(queryFunc, TablesJoin, ...WhereArray) {
        const Join = new JoinSQL(queryFunc, TablesJoin, WhereArray);
        Join.Build();
        return Join.Run();
    }
}
class ComlexSelect extends JoinSQL {
    SqlString;
    Allvalues;
    AddForBuild;
    ReturnBasicArray;
    ObjectInfo;
    UnionType;
    constructor(queryFunc, UnionType = 'UNION') {
        super(queryFunc);
        this.SqlString = '';
        this.Allvalues = [];
        this.UnionType = UnionType;
        this.AddForBuild = [];
        this.ReturnBasicArray = [];
        this.ObjectInfo = {};
    }
    UNIONSql() {
        if (this.SqlString != '') {
            this.SqlString += ` ${this.UnionType} `;
        }
    }
    AddAsSQl(type, ObjectData) {
        switch (type) {
            case "join":
                ObjectData = ObjectData;
                this.TablesJoin = ObjectData.TablesJoin;
                this.WhereArray = ObjectData.WhereArray;
                if (ObjectData.Options) {
                    if (ObjectData.Options.StopChars)
                        this.StopChars = ObjectData.Options.StopChars;
                    if (ObjectData.Options.DefaultJoin)
                        this.DefaultJoin = ObjectData.Options.DefaultJoin;
                }
                super.Build();
                this.UNIONSql();
                this.SqlString += '(' + this.sql + ')';
                this.Allvalues.push(...this.values);
                this.WhereCounter += this.values.length;
                break;
            case "select": {
                ObjectData = ObjectData;
                const sql = `SELECT ${ObjectData.types ? ObjectData.types.toString() : '*'} FROM ${ObjectData.table}`;
                const addWhere = CreateWhere.RunAndBuild(ObjectData.where, this.WhereCounter);
                this.UNIONSql();
                this.SqlString += '(' + sql + addWhere.sql;
                if (ObjectData.OrderStart) {
                    this.SqlString += ' ORDER BY ' + ObjectData.OrderStart + ' ASC';
                }
                if (ObjectData.OrderEnd) {
                    this.SqlString += ' ORDER BY ' + ObjectData.OrderEnd + ' DESC';
                }
                if (ObjectData.limit) {
                    this.SqlString += ' LIMIT ' + ObjectData.limit;
                }
                this.SqlString += ')';
                this.Allvalues.push(...addWhere.values);
                this.WhereCounter += addWhere.values.length;
                break;
            }
        }
    }
    Add(type, ObjectData) {
        this.AddForBuild.push({
            type,
            ObjectData
        });
    }
    CheckTypes(types) {
        if (!types) {
            return 0;
        }
        if (types == '*') {
            throw new Error("Can't use '*' as select types with ComlexSelect");
        }
        return types.split(',').length;
    }
    SumNumberOfTypes() {
        let sum = 0;
        for (const i of this.AddForBuild) {
            if (i.ObjectData.TablesJoin) {
                const e = i.ObjectData;
                for (const t of e.TablesJoin.tables) {
                    sum += this.CheckTypes(t.types);
                }
            }
            else {
                const e = i.ObjectData;
                sum += this.CheckTypes(e.types);
            }
        }
        return sum;
    }
    RunOnTypesSelect(t, Settings) {
        const fixTypesArray = [];
        let typesSplit = [];
        if (t.types) {
            typesSplit = t.types.split(',');
        }
        for (let i = 0; i < Settings.lastStop; i++) {
            fixTypesArray.push(`NULL as str${i}`);
        }
        const OrginalTypes = t.types;
        for (let b = Settings.lastStop; b < Settings.sum; b++) {
            let v = typesSplit[b - Settings.lastStop];
            if (!v) {
                v = 'NULL';
            }
            else {
                v = v.trim();
                if (v.includes(' as ')) {
                    const sp = v.split(' as ');
                    v = sp[0];
                    Settings.ObjectInfo[b] = sp[1];
                }
                else {
                    Settings.ObjectInfo[b] = v;
                }
            }
            fixTypesArray.push(`${v} as str${b}`);
        }
        t.types = fixTypesArray.toString();
        Settings.lastStop += typesSplit.length;
        return () => {
            t.types = OrginalTypes;
        };
    }
    RunOnTypesJoin(tables, Settings) {
        const OrginalTypesArray = [];
        const pushFirstArray = [];
        for (let i = 0; i < Settings.lastStop; i++) {
            pushFirstArray.push(`NULL as str${i}`);
        }
        for (const t of tables) {
            let typesSplit = [];
            if (t.types) {
                typesSplit = t.types.split(',');
            }
            const OrginalTypes = t.types;
            const fixTypesArray = [];
            let notStop = true;
            for (let b = Settings.lastStop; b < Settings.sum; b++) {
                let v = typesSplit[b - Settings.lastStop];
                if (!v) {
                    Settings.lastStop = b;
                    notStop = false;
                    break;
                }
                else {
                    v = v.trim();
                    if (v.includes(' as ')) {
                        const sp = v.split(' as ');
                        v = sp[0];
                        Settings.ObjectInfo[b] = sp[1];
                    }
                    else {
                        Settings.ObjectInfo[b] = v;
                    }
                }
                fixTypesArray.push(`${v} as str${b}`);
            }
            t.types = fixTypesArray.toString();
            OrginalTypesArray.push(() => {
                t.types = OrginalTypes;
            });
            if (notStop) {
                Settings.lastStop += typesSplit.length;
            }
        }
        const FirstTable = tables[0];
        if (pushFirstArray.length) {
            if (FirstTable.types) {
                FirstTable.types = pushFirstArray.toString() + "," + FirstTable.types;
            }
            else {
                FirstTable.types = pushFirstArray.toString();
            }
        }
        const pushLastArray = [];
        for (let i = Settings.lastStop; i < Settings.sum; i++) {
            pushLastArray.push(`NULL as str${i}`);
        }
        const LastTable = tables[tables.length - 1];
        if (pushLastArray.length) {
            if (LastTable.types) {
                LastTable.types += "," + pushLastArray.toString();
            }
            else {
                LastTable.types = pushLastArray.toString();
            }
        }
        return OrginalTypesArray;
    }
    Build() {
        for (const i of this.ReturnBasicArray) {
            i();
        }
        this.ReturnBasicArray = [];
        const Settings = {
            lastStop: 0,
            sum: this.SumNumberOfTypes(),
            ObjectInfo: {}
        };
        for (const i of this.AddForBuild) {
            if (i.ObjectData.TablesJoin) {
                const e = i.ObjectData;
                this.ReturnBasicArray.push(...this.RunOnTypesJoin(e.TablesJoin.tables, Settings));
            }
            else {
                const e = i.ObjectData;
                this.ReturnBasicArray.push(this.RunOnTypesSelect(e, Settings));
            }
        }
        for (const i of this.AddForBuild) {
            this.AddAsSQl(i.type, i.ObjectData);
        }
        this.ObjectInfo = Settings.ObjectInfo;
    }
    async Run() {
        const Arrayoutput = [];
        const output = await this.queryFunc(this.SqlString, ...this.Allvalues);
        for (const i of output) {
            const o = {};
            for (const k in i) {
                const myKey = this.ObjectInfo[k.substring(3)];
                if (o[myKey] == null) {
                    o[myKey] = i[k];
                }
            }
            Arrayoutput.push(o);
        }
        return Arrayoutput;
    }
}
//INTEGER PRIMARY KEY AUTOINCREMENT
class DBFastActions {
    CreateTable(name, ...values) {
        let sqlBuild = `CREATE TABLE IF NOT EXISTS ${name} (`;
        values = values.filter(x => !x.foreignKey).concat(values.filter(x => !!x.foreignKey));
        for (const i of values) {
            if (i.name) {
                sqlBuild += i.name + ' ';
                switch (i.type) {
                    case "int":
                    case "autoId":
                        sqlBuild += "INTEGER";
                        break;
                    case "float":
                        sqlBuild += "REAL";
                        break;
                    case "blob":
                        sqlBuild += "BLOB";
                        break;
                    case "string":
                    default:
                        sqlBuild += "TEXT";
                        break;
                }
            }
            if (i.type == "autoId" || i.primary) {
                sqlBuild += " PRIMARY KEY";
            }
            if (i.type == "autoId") {
                sqlBuild += " AUTOINCREMENT";
            }
            if (i.notNull) {
                sqlBuild += " NOT NULL";
            }
            if (i.unique) {
                sqlBuild += " UNIQUE";
            }
            if (i.check) {
                sqlBuild += ` CHECK(${i.check})`;
            }
            if (i.default != undefined) {
                sqlBuild += ` DEFAULT (${i.default})`;
            }
            const foreignKeyActions = [];
            if (i.references) {
                sqlBuild += ` REFERENCES ${i.references.tableName}(${i.references.tableKeys.toString()})`;
                foreignKeyActions.push(...i.references.actions);
            }
            if (!i.name && i.foreignKey) {
                sqlBuild += `FOREIGN KEY (${i.foreignKey.names.toString()}) REFERENCES ${i.foreignKey.tableName}(${i.foreignKey.tableKeys.toString()})`;
                foreignKeyActions.push(...i.foreignKey.actions);
            }
            for (const action of foreignKeyActions) {
                sqlBuild += ` ON ${action.name} ${action.todo}`;
            }
            sqlBuild += ',';
        }
        return this.runDB(sqlBuild.substring(0, sqlBuild.length - 1) + ')');
    }
    DeleteTable(name) {
        return this.runDB(`DROP TABLE IF EXISTS ${name}`);
    }
    async Insert(table, values) {
        let sql = 'INSERT INTO ' + table + ' (';
        const array = Object.keys(values);
        for (const i of array) {
            sql += i + ',';
        }
        sql = sql.substring(0, sql.length - 1) + ") VALUES(";
        const outValues = [];
        let count = 1;
        for (const i of array) {
            const s = this.Split2(i, '|');
            if (typeof s != 'object') {
                sql += `$${count}, `;
                outValues.push(values[i]);
                count++;
            }
            else if (values[i] == undefined) {
                sql += s[1] + ', ';
            }
            else {
                sql += `$${count + ' ' + s[1]}, `;
                outValues.push(values[i]);
                count++;
            }
        }
        sql = sql.substring(0, sql.length - 2) + ")";
        return (await this.runDB(sql, ...outValues)).lastInsertRowid;
    }
    async Select(ObjectData) {
        const addWhere = CreateWhere.RunAndBuild(ObjectData.where);
        let sql = `SELECT ${ObjectData.types ? ObjectData.types.toString() : '*'} FROM ${ObjectData.table}` + addWhere.sql;
        if (ObjectData.OrderStart) {
            sql += ' ORDER BY ' + ObjectData.OrderStart + ' ASC';
        }
        if (ObjectData.OrderEnd) {
            sql += ' ORDER BY ' + ObjectData.OrderEnd + ' DESC';
        }
        if (ObjectData.limit) {
            sql += ' LIMIT ' + ObjectData.limit;
        }
        return await this.queryDB(sql, ...addWhere.values);
    }
    async SelectOne(table, types, ...where) {
        return (await this.Select({ table, types, where, limit: 1 }))[0];
    }
    async Delete(table, ...where) {
        const sql = `DELETE FROM ${table}`;
        const addWhere = CreateWhere.RunAndBuild(where);
        return (await this.runDB(sql + addWhere.sql, ...addWhere.values)).changes;
    }
    Split2(text, s) {
        const index = text.indexOf(s);
        if (index == -1) {
            return text;
        }
        const c1 = text.substring(0, index);
        const c2 = text.substring(index + s.length);
        return [c1, c2];
    }
    async Update(table, set, ...where) {
        let sql = `UPDATE ${table} SET `;
        const values = [];
        let count = 1;
        for (const i in set) {
            const s = this.Split2(i, '|');
            if (typeof s != 'object') {
                sql += `${i}=$${count}, `;
                values.push(set[i]);
                count++;
            }
            else if (set[i] == undefined) {
                sql += `${s[0]}=${s[1]}, `;
            }
            else {
                sql += `${s[0]}=$${(Number(i) + 1) + ' ' + s[1]}, `;
                values.push(set[i]);
                count++;
            }
        }
        sql = sql.substring(0, sql.length - 2);
        const addWhere = CreateWhere.RunAndBuild(where, count);
        return (await this.runDB(sql + addWhere.sql, ...(values.concat(addWhere.values)))).changes;
    }
    /**
     * JoinSelect
     */
    JoinSelect(TablesJoin, ...WhereArray) {
        return JoinSQL.RunAndBuild(this.queryDB, TablesJoin, ...WhereArray);
    }
    /**
     * ComlexSelect - select with join and union
     */
    ComlexSelect(UnionType = 'UNION') {
        return new ComlexSelect(this.queryDB, UnionType);
    }
    table(tablaName) {
        return new TableIt(tablaName, this);
    }
    simpleTable(tablaName) {
        return this.table(tablaName).simple;
    }
}
class TableIt {
    tableName;
    connectDataBase;
    simpleTable;
    constructor(tableName, connectDataBase) {
        this.tableName = tableName;
        this.connectDataBase = connectDataBase;
        this.simpleTable = new SimpleTable(this);
    }
    get simple() {
        return this.simpleTable;
    }
    Insert(values) {
        return this.connectDataBase.Insert(this.tableName, values);
    }
    Select(ObjectData) {
        return this.connectDataBase.Select({ table: this.tableName, ...ObjectData });
    }
    SelectOne(types, ...where) {
        return this.connectDataBase.SelectOne(this.tableName, types, ...where);
    }
    Delete(...where) {
        return this.connectDataBase.Delete(this.tableName, ...where);
    }
    Update(set, ...where) {
        return this.connectDataBase.Update(this.tableName, set, ...where);
    }
}
class SimpleTable {
    connectDataBase;
    constructor(connectDataBase) {
        this.connectDataBase = connectDataBase;
    }
    simpleWhere(simpleWhere) {
        const where = [];
        for (const [filed, value] of Object.entries(simpleWhere)) {
            where.push({
                filed,
                value
            });
        }
        return where;
    }
    Insert(values) {
        return this.connectDataBase.Insert(values);
    }
    Select(ObjectData) {
        return this.connectDataBase.Select({
            ...ObjectData,
            where: this.simpleWhere(ObjectData.where)
        });
    }
    SelectOne(types, where) {
        return this.connectDataBase.SelectOne(types, ...this.simpleWhere(where));
    }
    Delete(where) {
        return this.connectDataBase.Delete(...this.simpleWhere(where));
    }
    Update(set, where) {
        return this.connectDataBase.Update(set, ...this.simpleWhere(where));
    }
}
export default DBFastActions;
