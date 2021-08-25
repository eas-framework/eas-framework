import {StreamCommand, args} from './tools/StreamCommand.js';

await StreamCommand(`npm run writeGitLabCi "${args.first}"`);
await StreamCommand('npm run build production');
await StreamCommand(`npm run push "${args.first}"`);
await StreamCommand('npm run build');
