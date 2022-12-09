import { name } from '../../../package.json';
import { Settings, SitemapEvents } from '@eas-framework/server';
SitemapEvents.addListener('request', async (sitemapBuilder) => {
    await sitemapBuilder.link({ url: './wow', changefreq: 'daily', priority: 0.8 });
});
Settings.compile.compileSyntax.push("TypeScript");
import { func } from './WWW/server/import/from1.serv.ts';
import { test } from './testImport.ts';
console.log(name, func, test);
export default {
    development: !process.argv.includes('production'),
    general: {
        pageInRam: true,
        // importOnLoad: ["OnStart.serv.ts"]
    },
    compile: {
        compileSyntax: ["TypeScript"],
        ignoreError: [],
        plugins: [],
        define: {
            name: 'cool',
            version: 20
        },
        pathAliases: {
            "@imr/": "/server/import/"
        },
        globals: {
            counter: 10
        }
    },
    routing: {
        rules: {
            "/Examples/User/": (url, req, res) => '/Files/User/Examples/' + url.split('/').pop()
        },
        urlStop: [
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
            file: 'loop/sitemap.xml',
            updateAfterHours: 0 // update sitemap on new request after x hours
        },
        allowExt: ['wasm'],
        ignoreExt: ['json'],
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
        greenLock: {
            agreeToTerms: false,
            email: "example@example.com",
            sites: [{ "subject": "example.com", "altnames": ["example.com", "www.example.com"] }]
        }
    },
    //custom settings - same as above but only active if development is on/off
    implDev: {
    //custom settings for development
    },
    implProd: {
        //custom settings for production
        compile: {
            compileSyntax: ["TypeScript"],
            plugins: ["MinAll"],
            define: {
                name: 'co1ol',
                version: 30
            }
        }
    }
};
