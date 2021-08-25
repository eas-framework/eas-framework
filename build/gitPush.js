import {StreamCommand, args} from './tools/StreamCommand.js';

await StreamCommand('git add .');
await StreamCommand(`git commit -am "${args.first ?? "Fix bug - " + new Date().toLocaleString()}"`);
await StreamCommand('git push');