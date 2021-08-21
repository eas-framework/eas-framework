export default {
    "development": true,
    "save-page-ram": true,
    "ignore-types": ["json"],
    "ignore-start-paths": ["/Private"],
    "require-on-start": ["OnStart.serv.ts"],
    "add-compile-syntax": ["JTags", "Razor", "TypeScript"],
    "plugins": [/*"MinAll"*/],
    "cache-days": 3,
    "rules": {
        "/Examples/User/": (req, res, url) => '/Files/User/Examples/' + url.split('/').pop()
    },
    "stop-url-check": [
        "/User/Files"
    ],
    "error-pages": {
        NotFound: {
            path: "errors/e404"
        }
    },
    "request-limit-mb": 4,
    "upload-files-size-limit-mb": 100,
    "session-time-minutes": 0,
    "cookies-expires-days": 1,
    "serve": {
        "port": 8080,
        "http2": false,
        "greenlock": {
            "agreeToTerms": false,
            "email": "example@example.com",
            "sites": [{ "subject": "example.com", "altnames": ["example.com", "www.example.com"] }]
        }
    }
}