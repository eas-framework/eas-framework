import workerPool from 'workerpool';


interface finder {
    method: any;
    working: boolean;
}

export default class Multithreading {
    private finderArray: finder[] = [];
    private queue: any[][] = [];


    constructor(threadCount: number, private workerPath: string){
        for(let i = 0; i < threadCount; i++){
            this.addThread();
        }
    }

    /**
     * if the queue is not empty, using available thread on item in the queue
     */
    private available(){
        if(!this.queue.length){
            return;
        }

        const have = this.finderArray.find(x => !x.working);
        if(!have){
            return;
        }

        const doMethods = this.queue.shift();
        const res = doMethods.shift();

        have.method(doMethods.shift()).then(res);
    }

    private addThread(){
        const pool = workerPool.pool(this.workerPath);

        //eslint-disable-next-line
        const ThisInstance = this;

        const worker = {
            async method (doMethods: {[name: string]: any[]}) { 
                worker.working = true;

                const result = [];
                
                for(const [key, value] of Object.entries(doMethods)){
                    result.push(await pool.exec(key, value.map(x => x && typeof x == 'object' ?  JSON.stringify(x): x)))
                }

                worker.working = false;

                ThisInstance.available();

                return result;
            },
            working: false
        }

        this.finderArray.push(worker);
    }

    /**
     * getting available method, or waiting for available thread
     * doMethods {name: array of arguments}
     */
    public getMethod(doMethods: {[name: string]: any[]}){
        const have = this.finderArray.find(x => !x.working);

        if(have){
            return have.method(doMethods);
        }

        let res: any;
        const wait = new Promise((resolve, reject) => {res = resolve;});

        this.queue.push([res, doMethods]);

        return wait;
    }
}