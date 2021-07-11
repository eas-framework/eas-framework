import sourceMapSupport from 'source-map-support'; sourceMapSupport.install();;var __dirname=`D:\\Code\\Projects\\beyond-easy\\tests\\core/Website`,__filename=`D:\\Code\\Projects\\beyond-easy\\tests\\core/Website/Settings.ts`;export default (async (require)=>{var module={exports:{}},exports=module.exports;
"use strict";Object.defineProperty(exports, "__esModule", {value: true});exports. default = {
    "development": false,
    "save-page-ram": true,
    "ignore-types": ["json"],
    "ignore-start-paths": ["/Private"],
    "require-on-start": ["OnStart.serv.ts"],
    "add-compile-syntax": ["JTags", "Razor", "TypeScript"],
    "plugins": [/*"MinAll" */],
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
return module.exports;});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0dGluZ3MudHMiLCJzb3VyY2VzIjpbIkQ6XFxDb2RlXFxQcm9qZWN0c1xcYmV5b25kLWVhc3lcXHRlc3RzXFxjb3JlL1dlYnNpdGUvU2V0dGluZ3MudHMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsIm5hbWVzIjpbXX0=