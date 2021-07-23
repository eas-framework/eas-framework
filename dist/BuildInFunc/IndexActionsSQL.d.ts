interface WhereDB {
    filed: string;
    value: any;
    sign?: string;
    operator?: string;
    NotSecure?: boolean;
}
interface JoinTable {
    name: string;
    types?: string;
    join?: string;
}
interface JoinConnect {
    tables: JoinTable[];
    texts: string[];
    limit?: number;
    OrderStart?: string;
    OrderEnd?: string;
}
declare class JoinSQL {
    StopChars: string;
    TablesJoin: JoinConnect;
    WhereArray: (WhereDB | WhereDB[])[];
    DefaultJoin: string;
    private sqlOutput;
    private sqlValues;
    protected WhereCounter: number;
    protected queryFunc: (query: string, ...values: any) => any;
    constructor(queryFunc: (query: string, ...values: any) => any, TablesJoin?: JoinConnect, WhereArray?: (WhereDB | WhereDB[])[], Options?: {
        StopChars: string;
        DefaultJoin: string;
    });
    setValues(TablesJoin?: JoinConnect): void;
    private IndexOfTable;
    private CharTospecialChar;
    private GetRegex;
    private FindTable;
    /**
     * build sql string
     */
    Build(): void;
    protected get sql(): string;
    protected get values(): string[];
    Run(): Promise<any[]>;
    /**
     * build and run
     */
    static RunAndBuild(queryFunc: (query: string, ...values: any) => any, TablesJoin: JoinConnect, ...WhereArray: (WhereDB | WhereDB[])[]): Promise<any[]>;
}
interface JoinSqlInput {
    TablesJoin: JoinConnect;
    WhereArray?: (WhereDB | WhereDB[])[];
    Options?: {
        StopChars: string;
        DefaultJoin: string;
    };
}
interface SelectOption {
    types?: string;
    limit?: number;
    OrderStart?: string;
    OrderEnd?: string;
    where?: (WhereDB | WhereDB[])[];
}
interface SelectOptionsTable extends SelectOption {
    table: string;
}
declare class ComlexSelect extends JoinSQL {
    private SqlString;
    private Allvalues;
    private AddForBuild;
    private ReturnBasicArray;
    private ObjectInfo;
    UnionType: string;
    constructor(queryFunc: (query: string, ...values: any) => any, UnionType?: string);
    private UNIONSql;
    private AddAsSQl;
    Add(type: "join" | "select", ObjectData: JoinSqlInput | SelectOptionsTable): void;
    private CheckTypes;
    private SumNumberOfTypes;
    private RunOnTypesSelect;
    private RunOnTypesJoin;
    Build(): void;
    Run(): Promise<any[]>;
}
interface referencesAction {
    name: 'DELETE' | 'UPDATE';
    todo: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
}
interface references {
    tableName: string;
    tableKeys: string;
    actions?: referencesAction[];
}
interface foreignKey extends references {
    names: string | string[];
    actions: referencesAction[];
}
interface TableValue {
    name?: string;
    type?: "int" | "string" | "float" | "blob" | "autoId";
    notNull?: boolean;
    primary?: boolean;
    unique?: boolean;
    check?: string;
    default?: string;
    references?: references;
    foreignKey?: foreignKey;
}
declare abstract class DBFastActions {
    abstract runDB(text: string, ...values: any): any;
    abstract queryDB(text: string, ...values: any): any;
    CreateTable(name: string, ...values: TableValue[]): any;
    DeleteTable(name: string): any;
    Insert(table: string, values: {
        [key: string]: any;
    }): Promise<any>;
    Select(ObjectData: SelectOptionsTable): Promise<any>;
    SelectOne(table: string, types: string, ...where: (WhereDB | WhereDB[])[]): Promise<any>;
    Delete(table: string, ...where: (WhereDB | WhereDB[])[]): Promise<any>;
    private Split2;
    Update(table: string, set: {
        [key: string]: any;
    }, ...where: (WhereDB | WhereDB[])[]): Promise<any>;
    /**
     * JoinSelect
     */
    JoinSelect(TablesJoin: JoinConnect, ...WhereArray: (WhereDB | WhereDB[])[]): Promise<any[]>;
    /**
     * ComlexSelect - select with join and union
     */
    ComlexSelect(UnionType?: string): ComlexSelect;
    table(tablaName: string): TableIt;
    simpleTable(tablaName: string): SimpleTable;
}
declare class TableIt {
    private tableName;
    private connectDataBase;
    private simpleTable;
    constructor(tableName: string, connectDataBase: DBFastActions);
    get simple(): SimpleTable;
    Insert(values: {
        [key: string]: any;
    }): Promise<any>;
    Select(ObjectData: SelectOption): Promise<any>;
    SelectOne(types: string, ...where: (WhereDB | WhereDB[])[]): Promise<any>;
    Delete(...where: (WhereDB | WhereDB[])[]): Promise<any>;
    Update(set: {
        [key: string]: any;
    }, ...where: (WhereDB | WhereDB[])[]): Promise<any>;
}
interface SimpleSelectOption {
    types?: string;
    limit?: number;
    OrderStart?: string;
    OrderEnd?: string;
    where?: {
        [key: string]: any;
    };
}
declare class SimpleTable {
    private connectDataBase;
    constructor(connectDataBase: TableIt);
    private simpleWhere;
    Insert(values: {
        [key: string]: any;
    }): Promise<any>;
    Select(ObjectData: SimpleSelectOption): Promise<any>;
    SelectOne(types: string, where: {
        [key: string]: any;
    }): Promise<any>;
    Delete(where: {
        [key: string]: any;
    }): Promise<any>;
    Update(set: {
        [key: string]: any;
    }, where: {
        [key: string]: any;
    }): Promise<any>;
}
export default DBFastActions;
