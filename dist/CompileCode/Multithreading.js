import workerPool from 'workerpool';
export default class Multithreading {
    constructor(threadCount, workerPath) {
        this.workerPath = workerPath;
        this.finderArray = [];
        this.queue = [];
        for (let i = 0; i < threadCount; i++) {
            this.addThread();
        }
    }
    /**
     * if the queue is not empty, using available thread on item in the queue
     */
    available() {
        if (!this.queue.length) {
            return;
        }
        const have = this.finderArray.find(x => !x.working);
        if (!have) {
            return;
        }
        const doMethods = this.queue.shift();
        const res = doMethods.shift();
        have.method(doMethods.shift()).then(res);
    }
    addThread() {
        const pool = workerPool.pool(this.workerPath, {
            minWorkers: 1,
            maxWorkers: 1
        });
        //eslint-disable-next-line
        const ThisInstance = this;
        const worker = {
            async method(doMethods) {
                worker.working = true;
                const result = [];
                for (const [key, value] of Object.entries(doMethods)) {
                    result.push(await pool.exec(key, value.map(x => x && typeof x == 'object' ? JSON.stringify(x) : x)));
                }
                worker.working = false;
                ThisInstance.available();
                return result;
            },
            working: false
        };
        this.finderArray.push(worker);
    }
    /**
     * getting available method, or waiting for available thread
     * doMethods {name: array of arguments}
     */
    getMethod(doMethods) {
        const have = this.finderArray.find(x => !x.working);
        if (have) {
            return have.method(doMethods);
        }
        let res;
        const wait = new Promise((resolve, reject) => { res = resolve; });
        this.queue.push([res, doMethods]);
        return wait;
    }
}
//# sourceMappingURL=Multithreading.js.map