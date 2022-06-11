import {exec} from 'child_process';
import process from 'process';

/**
 * 
 * @param {*} command 
 * @param {import('child_process').ExecOptions} options 
 * @returns 
 */
export function StreamCommand(command, options){
    const stream = exec(command, options);

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
    },
    get production() {
        return process.argv.includes('production');
    }
}