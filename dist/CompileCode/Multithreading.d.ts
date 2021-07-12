export default class Multithreading {
    private workerPath;
    private finderArray;
    private queue;
    constructor(threadCount: number, workerPath: string);
    /**
     * if the queue is not empty, using available thread on item in the queue
     */
    private available;
    private addThread;
    /**
     * getting available method, or waiting for available thread
     */
    getMethod(doMethods: string[], ...args: any[]): any;
}
