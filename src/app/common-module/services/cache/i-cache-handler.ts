export interface ICacheHandler {
    memorize(key: string, expire: number, closure: () => any): any;
    deleteKeysWithPattern(key: string): void;
    get(key: string): any;
}