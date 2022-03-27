export default {
    development: true, // development mode, if off, then is optimize for production

    general: {
        pageInRam: false,
        // importOnLoad: ["OnStart.serv.ts"]
    },

    compile: {
        compileSyntax: ["TypeScript"],
        ignoreError: [], //"close-tag" | "querys-not-found" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" | "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning"
        plugins: [], // "MinAll" | "MinHTML" | "MinCss" | "MinSass" | "MinJS" | "MinTS" | "MinJSX" | "MinTSX"...
        define: { // global define
            name: 'cool',
            version: 20
        }
    },

    routing: {
        rules: {
            "/Examples/User/": (url, req, res) => '/Files/User/Examples/' + url.split('/').pop()
        },
        urlStop: [ // make sure any path after x remains same as x, for example /admin/editUsers/34234/cool => /admin/editUsers
            "/User/Files"
        ],
        errorPages: {
            // notFound: {
            //     code: 404,
            //     path: "errors/e404"
            // },
            // serverError: {
            //     code: 500,
            //     path: "errors/e500"

            // }
        },
        sitemap: {
            // file: 'SmaP.serv.ts'
        },
        ignoreTypes: ["json"], // ignore file extension (auto ignore common server files)
        ignorePaths: ["/Private"],
        validPath: [(url, req, res) => url.substring(3, 5) != 'hi'] // check url path, if one of the methods return false, then the server returns a 404
    }, 
    serveLimits: {
        cacheDays: 0,
        fileLimitMB: 10,
        requestLimitMB: 4,
        cookiesExpiresDays: 1,
        sessionTotalRamMB: 150,
        sessionTimeMinutes: 40,
        sessionCheckPeriodMinutes: 30,
    },
    serve: {
        port: 8080,
        http2: false,
        greenLock: { // for production
            agreeToTerms: false,
            email: "example@example.com",
            sites: [{ "subject": "example.com", "altnames": ["example.com", "www.example.com"] }]
        }
    },
    //custom settings - same as above but only active if development is on/off
    implDev: {
        //custom settings for development
    }, 
    impProd: {
        //custom settings for production
    }
}