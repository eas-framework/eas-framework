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
interface SelectOptions {
    table: string;
    types?: string;
    limit?: number;
    OrderStart?: string;
    OrderEnd?: string;
    where?: (WhereDB | WhereDB[])[];
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
    Add(type: "join" | "select", ObjectData: JoinSqlInput | SelectOptions): void;
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
    Select(ObjectData: SelectOptions): Promise<any>;
    SelectOne(table: any, types: any, ...where: (WhereDB | WhereDB[])[]): Promise<any>;
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
}
export default DBFastActions;
