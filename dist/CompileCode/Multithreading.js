import workerPool from 'workerpool';
export default class Multithreading {
    workerPath;
    finderArray = [];
    queue = [];
    constructor(threadCount, workerPath) {
        this.workerPath = workerPath;
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
        const args = this.queue.shift();
        const res = args.shift();
        have.method(args).then(res);
    }
    addThread() {
        const pool = workerPool.pool(this.workerPath);
        //eslint-disable-next-line
        const ThisInstance = this;
        const worker = {
            async method(doMethods, args) {
                worker.working = true;
                const result = [];
                for (const i of doMethods) {
                    result.push(await pool.exec(i, args));
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
     */
    getMethod(doMethods, ...args) {
        const have = this.finderArray.find(x => !x.working);
        if (have) {
            return have.method(doMethods, args);
        }
        let res;
        const wait = new Promise((resolve, reject) => { res = resolve; });
        args.unshift(res);
        this.queue.push(args);
        return wait;
    }
}
//# sourceMappingURL=Multithreading.js.map