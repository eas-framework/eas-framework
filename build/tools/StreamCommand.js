import {exec} from 'child_process';
import process from 'process';

export function StreamCommand(command){
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

export const args = {
    get all(){
        return process.argv.slice(2);
    },

    get first(){
        return process.argv[2];
    }
}