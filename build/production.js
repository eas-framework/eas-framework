import {StreamCommand, args} from './tools/StreamCommand.js';

await StreamCommand('npm run build production');
await StreamCommand(`npm run commit "${args.first}"`);
args.all.includes('publish') && await StreamCommand(`npm publish`);
await StreamCommand('npm run build');
