import { SitemapBuilder } from "./SitemapBuilder";

const DEFAULT_OPTIONS = { once: false }

type sitemapEvent = 'request' | 'response';
type sitemapFunc = (sitemapBuilder: SitemapBuilder) => Promise<any> | any
type options = { once: boolean }


export default class SitemapEventEmitter {
    private listenersMap: {
        [key: string]: {
            func: sitemapFunc,
            once: boolean
        }[]
    } = {};

    public addListener(event: sitemapEvent, func: sitemapFunc): void;
    public addListener(event: sitemapEvent, options: options, func: sitemapFunc): void;

    public addListener(event: sitemapEvent, options: sitemapFunc | options, func?: sitemapFunc) {
        this.listenersMap[event] ??= [];

        if(typeof options === 'function') {
            func = options;
            options = DEFAULT_OPTIONS;
        }

        this.listenersMap[event].push({
            func,
            once: options.once
        })
    }


    public emit(event: sitemapEvent, sitemapBuilder: SitemapBuilder): Promise<any[]> | any[] {
        if(!this.listenersMap[event])
            return [];

        const results = [];
        for(const listener of this.listenersMap[event]) {
            results.push(
                listener.func(sitemapBuilder)
            );
        }

        this.listenersMap[event] = this.listenersMap[event].filter(x => !x.once)

        return Promise.all(results);
    }

    public listeners(event: sitemapEvent): sitemapFunc[] {
        return this.listenersMap[event]?.map(x => x.func) ?? [];
    }
}