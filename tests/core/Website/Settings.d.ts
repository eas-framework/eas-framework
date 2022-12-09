declare const _default: {
    development: boolean;
    general: {
        pageInRam: boolean;
    };
    compile: {
        compileSyntax: string[];
        ignoreError: any[];
        plugins: any[];
        define: {
            name: string;
            version: number;
        };
        pathAliases: {
            "@imr/": string;
        };
        globals: {
            counter: number;
        };
    };
    routing: {
        rules: {
            "/Examples/User/": (url: any, req: any, res: any) => string;
        };
        urlStop: string[];
        errorPages: {};
        sitemap: {
            file: string;
            updateAfterHours: number;
        };
        allowExt: string[];
        ignoreExt: string[];
        ignorePaths: string[];
        validPath: ((url: any, req: any, res: any) => boolean)[];
    };
    serveLimits: {
        cacheDays: number;
        fileLimitMB: number;
        requestLimitMB: number;
        cookiesExpiresDays: number;
        sessionTotalRamMB: number;
        sessionTimeMinutes: number;
        sessionCheckPeriodMinutes: number;
    };
    serve: {
        port: number;
        http2: boolean;
        greenLock: {
            agreeToTerms: boolean;
            email: string;
            sites: {
                subject: string;
                altnames: string[];
            }[];
        };
    };
    implDev: {};
    implProd: {
        compile: {
            compileSyntax: string[];
            plugins: string[];
            define: {
                name: string;
                version: number;
            };
        };
    };
};
export default _default;
