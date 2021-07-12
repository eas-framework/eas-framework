import {exec} from 'child_process';
import process from 'process';

function StreamCommand(command){
    const stream = exec(command);

    let resolve;
    const promise = new Promise(res => resolve = res);

    stream.stdout.pipe(process.stdout);
    
    stream.stderr.pipe(process.stdout);
    
    stream.on('exit', function () {
        resolve();
    });
    
   return promise;
}

console.log(process.argv[2])
await StreamCommand('git add .');
await StreamCommand(`git commit -am "${process.argv[2] ?? "Fix bug - " + new Date().toLocaleString()}"`);
await StreamCommand('git push');