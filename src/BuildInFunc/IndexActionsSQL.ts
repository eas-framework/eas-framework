interface WhereDB {
    filed: string
    value: any
    sign?: string
    operator?: string
    NotSecure?: boolean
}

class CreateWhere {
    where: (WhereDB | WhereDB[])[]
    counter: number
    sql: string
    First: boolean
    values: any[]

    private constructor(where: (WhereDB | WhereDB[])[], counter = 1) {
        if (!Array.isArray(where)) {
            this.where = where ? [where]: [];
        } else {
            this.where = where;
        }
        this.counter = counter;
        this.sql = '';
        this.values = [];
    }
    private AddSelect(e: WhereDB) {
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
    private Build() {
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
    public static RunAndBuild(where: (WhereDB | WhereDB[])[], counter = 1) {
        const myWhere = new CreateWhere(where, counter);
        myWhere.Build();
        return {
            sql: myWhere.sql,
            values: myWhere.values
        };
    }
}

interface JoinTable {
    name: string,
    types?: string,
    join?: string //join type: INNER / OUTER (default INNER)
}

interface JoinConnect {
    tables: JoinTable[],
    texts: string[],
    limit?: number,
    OrderStart?: string,
    OrderEnd?: string
}

interface TableJoinSystem {
    used?: boolean
    name: string
}


class JoinSQL {
    StopChars: string;
    TablesJoin: JoinConnect;
    WhereArray: (WhereDB | WhereDB[])[];
    DefaultJoin: string;
    private sqlOutput;
    private sqlValues;
    protected WhereCounter: number;
    protected queryFunc: (query: string, ...values: any) => any;

    constructor(queryFunc: (query: string, ...values: any) => any, TablesJoin?: JoinConnect, WhereArray?: (WhereDB | WhereDB[])[], Options = { StopChars: ' =<>().', DefaultJoin: 'INNER' }) {
        this.StopChars = Options.StopChars;
        this.DefaultJoin = Options.DefaultJoin;
        this.TablesJoin = TablesJoin;
        this.WhereArray = WhereArray;
        this.WhereCounter = 1;
        this.queryFunc = queryFunc;
    }

    public setValues(TablesJoin?: JoinConnect) {
        for (const i in TablesJoin) {
            if (this[i]) {
                this[i] = TablesJoin[i];
            }
        }
    }

    private IndexOfTable(table: string, tables: TableJoinSystem[]): number {
        for (const i in tables) {
            if (tables[i].name == table && !tables[i].used) {
                return Number(i);
            }
        }
        return -1;
    }

    private CharTospecialChar(char: string): string {
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

    private GetRegex(): RegExp {
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

    private FindTable(text: string, tables: TableJoinSystem[]): string {
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
    public Build(): void {
        //get all types and tables
        const tables: TableJoinSystem[] = [], types: string[] = [];

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

    protected get sql(): string {
        return this.sqlOutput;
    }

    protected get values(): string[] {
        return this.sqlValues;
    }

    public async Run(): Promise<any[]> {
        return await this.queryFunc(this.sqlOutput, ...this.sqlValues);
    }
    /**
     * build and run
     */
    public static RunAndBuild(queryFunc: (query: string, ...values: any) => any, TablesJoin: JoinConnect, ...WhereArray: (WhereDB | WhereDB[])[]): Promise<any[]> {
        const Join = new JoinSQL(queryFunc, TablesJoin, WhereArray);
        Join.Build();
        return Join.Run();
    }
}

interface JoinSqlInput {
    TablesJoin: JoinConnect,
    WhereArray?: (WhereDB | WhereDB[])[],
    Options?: {
        StopChars: string,
        DefaultJoin: string
    }
}

interface SelectOptions {
    table: string,
    types?: string,
    limit?: number,
    OrderStart?: string,
    OrderEnd?: string
    where?: (WhereDB | WhereDB[])[]
}

interface ComlexSelectAddForBuild {
    type: "join" | "select",
    ObjectData: JoinSqlInput | SelectOptions
}

class ComlexSelect extends JoinSQL {
    private SqlString: string
    private Allvalues: string[]
    private AddForBuild: ComlexSelectAddForBuild[]
    private ReturnBasicArray: (() => void)[]
    private ObjectInfo: any
    public UnionType: string

    constructor(queryFunc: (query: string, ...values: any) => any, UnionType = 'UNION') {
        super(queryFunc);
        this.SqlString = '';
        this.Allvalues = [];
        this.UnionType = UnionType;
        this.AddForBuild = [];
        this.ReturnBasicArray = [];
        this.ObjectInfo = {};
    }

    private UNIONSql() {
        if (this.SqlString != '') {
            this.SqlString += ` ${this.UnionType} `;
        }
    }

    private AddAsSQl(type: "join" | "select", ObjectData: JoinSqlInput | SelectOptions) {
        switch (type) {
            case "join":
                ObjectData = <JoinSqlInput>ObjectData;
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
                ObjectData = <SelectOptions>ObjectData;

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

    public Add(type: "join" | "select", ObjectData: JoinSqlInput | SelectOptions) {
        this.AddForBuild.push({
            type,
            ObjectData
        });
    }

    private CheckTypes(types: string): number {
        if (!types) {
            return 0;
        }
        if (types == '*') {
            throw new Error("Can't use '*' as select types with ComlexSelect");
        }
        return types.split(',').length;
    }

    private SumNumberOfTypes() {
        let sum = 0;
        for (const i of (<any[]>this.AddForBuild)) {
            if (i.ObjectData.TablesJoin) {
                const e = <JoinSqlInput>i.ObjectData;
                for (const t of e.TablesJoin.tables) {
                    sum += this.CheckTypes(t.types);
                }
            }
            else {
                const e = <SelectOptions>i.ObjectData;
                sum += this.CheckTypes(e.types);
            }
        }
        return sum;
    }

    private RunOnTypesSelect(t: SelectOptions, Settings: { lastStop: number, sum: number, ObjectInfo: any }): () => void {
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

    private RunOnTypesJoin(tables: JoinTable[], Settings: { lastStop: number, sum: number, ObjectInfo: any }) {
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

        for (const i of (<any[]>this.AddForBuild)) {
            if (i.ObjectData.TablesJoin) {
                const e = <JoinSqlInput>i.ObjectData;
                this.ReturnBasicArray.push(...this.RunOnTypesJoin(e.TablesJoin.tables, Settings));
            }
            else {
                const e = <SelectOptions>i.ObjectData;
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

interface referencesAction {
    name: 'DELETE' | 'UPDATE'
    todo: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE"
}

interface references {
    tableName: string,
    tableKeys: string,
    actions?: referencesAction[]

}

interface foreignKey extends references{
    names: string | string[],
    actions: referencesAction[]
}

//INTEGER, TEXT, REAL, blob
interface TableValue {
    name?: string,
    type?: "int" | "string" | "float" | "blob" | "autoId",
    notNull?: boolean
    primary?: boolean,
    unique?: boolean,
    check?: string,
    default?: string,
    references?: references,
    foreignKey?: foreignKey
}

//INTEGER PRIMARY KEY AUTOINCREMENT


abstract class DBFastActions {

    abstract runDB(text: string, ...values: any);

    abstract queryDB(text: string, ...values: any);

    CreateTable(name: string, ...values: TableValue[]) {
        let sqlBuild = `CREATE TABLE IF NOT EXISTS ${name} (`;

        values = values.filter(x => !x.foreignKey).concat(values.filter(x => !!x.foreignKey));
    
        for (const i of values) {

            if(i.name){
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
                sqlBuild += " AUTOINCREMENT"
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
                sqlBuild += ` DEFAULT ${i.default}`;
            }

            const foreignKeyActions: referencesAction[] = [];
            if(i.references){
                sqlBuild += ` REFERENCES ${i.references.tableName}(${i.references.tableKeys.toString()})`;
                foreignKeyActions.push(...i.references.actions);
            }

            if(!i.name && i.foreignKey){
                sqlBuild += `FOREIGN KEY (${i.foreignKey.names.toString()}) REFERENCES ${i.foreignKey.tableName}(${i.foreignKey.tableKeys.toString()})`;

                foreignKeyActions.push(...i.foreignKey.actions);
            }

            for(const action of foreignKeyActions){
                sqlBuild += ` ON ${action.name} ${action.todo}`;
            }

            sqlBuild += ',';
        }
    
        return this.runDB(sqlBuild.substring(0, sqlBuild.length -1) + ')');
    }

    DeleteTable(name: string){
        return this.runDB(`DROP TABLE IF EXISTS ${name}`);
    }

    async Insert(table: string, values: { [key: string]: any }) {
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
            } else {
                sql += `$${count + ' ' + s[1]}, `;
                outValues.push(values[i]);
                count++;
            }
        }

        sql = sql.substring(0, sql.length - 2) + ")";
        return (await this.runDB(sql, ...outValues)).lastInsertRowid;
    }

    async Select(ObjectData: SelectOptions) {
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

    async SelectOne(table, types, ...where: (WhereDB | WhereDB[])[]) {
        return (await this.Select({ table, types, where, limit: 1 }))[0];
    }

    async Delete(table: string, ...where: (WhereDB | WhereDB[])[]) {
        const sql = `DELETE FROM ${table}`;
        const addWhere = CreateWhere.RunAndBuild(where);
        return (await this.runDB(sql + addWhere.sql, ...addWhere.values)).changes;
    }

    private Split2(text: string, s: string) {
        const index = text.indexOf(s);
        if (index == -1) {
            return text;
        }
        const c1 = text.substring(0, index);
        const c2 = text.substring(index + s.length);
        return [c1, c2];
    }

    public async Update(table: string, set: { [key: string]: any }, ...where: (WhereDB | WhereDB[])[]) {
        let sql = `UPDATE ${table} SET `;
        const values = [];
        let count = 1;

        for (const i in set) {
            const s = this.Split2(i, '|');
            if (typeof s != 'object') {
                sql += `${i}=$${count}, `;
                values.push(set[i]);
                count++;
            } else if (set[i] == undefined) {
                sql += `${s[0]}=${s[1]}, `;
            } else {
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
    public JoinSelect(TablesJoin: JoinConnect, ...WhereArray: (WhereDB | WhereDB[])[]) {
        return JoinSQL.RunAndBuild(this.queryDB, TablesJoin, ...WhereArray);
    }
    /**
     * ComlexSelect - select with join and union
     */
    public ComlexSelect(UnionType = 'UNION') {
        return new ComlexSelect(this.queryDB, UnionType);
    }
}

export default DBFastActions;