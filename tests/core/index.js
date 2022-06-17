import sourceMapSupport from 'source-map-support';
import runTest from './testBuild.js';

sourceMapSupport.install({ hookRequire: true });

//activate server
const { default: Server, Settings, waitProductionBuild, PageTimeLogger, GlobalSitemapBuilder } = await import('../../dist/index.js');
await Server({ SitePath: './tests/core/Website' });

PageTimeLogger.event('compile-time', ({ time, file }) => { // event log every time page compile
    console.log(`compile-time: ${time}s ${file}`)
})

function fullTest(name, filter) {
    return runTest(name, GlobalSitemapBuilder, PageTimeLogger, filter, Settings.serve.port)
}

const onlyServer = process.argv.includes('only-server')

// test on development environment
if (!onlyServer)
    await fullTest("test", x => x)

// test on production environment
if (process.argv.includes('production')) {
    Settings.development = false
    await waitProductionBuild()
    await fullTest('production', x => x.debug)
}

// close server if this only a test
if (!onlyServer)
    process.exit(0)