export default {
    "development": true, // development mode, if off, then is optimize for production
    "save-page-ram": true,
    "ignore-types": ["json"], // ignore file extension (auto ignore common server files)
    "ignore-start-paths": ["/Private"],
    "require-on-start": ["OnStart.serv.ts"],
    "add-compile-syntax": ["JTags", "Razor", "TypeScript"],
    "prevent-compilation-error": [], //""close-tag" | "querys-not-found" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" | "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning"
    "plugins": [], // "MinAll" | "MinHTML" | "MinCss" | "MinSass" | "MinJS" | "MinTS" | "MinJSX" | "MinTSX"...
    "cache-days": 3,
    "rules": {
        "/Examples/User/": (req, res, url) => '/Files/User/Examples/' + url.split('/').pop()
    },
    "stop-url-check": [ // make sure any path after x remains same as x, for example /admin/editUsers/34234/cool => /admin/editUsers
        "/User/Files"
    ],
    "error-pages": {
        NotFound: {
            path: "errors/e404"
        }
    },
    "request-limit-mb": 4,
    "upload-files-size-limit-mb": 100,
    "session-time-minutes": 30,
    "cookies-expires-days": 1,
    "serve": {
        "port": 8080,
        "http2": false,
        "greenlock": { // for production
            "agreeToTerms": false,
            "email": "example@example.com",
            "sites": [{ "subject": "example.com", "altnames": ["example.com", "www.example.com"] }]
        }
    },

    //custom settings - same as above but only active if development is on/off
    "on-dev": {
        //custom settings for development
    }, 
    "on-production": {
        //custom settings for production
        "ignore-types": ["json", "xml"],
        "plugins": ["MinAll" ],
        "cookies-expires-days": 10,
        "serve": {
            "port": 80,
            "http2": false
        }
    }
}