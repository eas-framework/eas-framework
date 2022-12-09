declare const _default: {
    GET: {
        define: {
            query: StringConstructor;
        };
        count: {
            define: {
                number: NumberConstructor;
            };
            func(Request: any, Response: any, _: any, { query, number }: {
                query: any;
                number: any;
            }): number;
        };
        first: {
            func(Request: any, Response: any, _: any, { query }: {
                query: any;
            }): {
                text: any;
                link: any;
            } | "Not found";
        };
        func(Request: any, Response: any, _: any, { query }: {
            query: any;
        }): {
            text: any;
            link: any;
        }[];
    };
};
export default _default;
