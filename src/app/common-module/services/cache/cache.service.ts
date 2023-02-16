import { Injectable } from '@angular/core';
import * as GlobToRegExp from 'glob-to-regexp';
import { LogLevel } from '../../dto/log-level';
import { ICacheHandler } from './i-cache-handler';
import { StorageObject } from './storage-object';

@Injectable({
  providedIn: 'root'
})
export class CacheService implements ICacheHandler {

  logLevel: LogLevel = LogLevel.INFO;

  static generalStorage: any = {};

  constructor() { }

  memorize(key: string, expire: number, closure: () => any) {
    if (!CacheService.generalStorage[key]) {
      return this.__reCalc(key, expire, closure);
    }

    let __storageObject = CacheService.generalStorage[key];
    let currentTime: number = Date.now();
    if (__storageObject.options['exprire'] > 0 && (__storageObject.createdAt + __storageObject.options['exprire']) < currentTime) {
      return this.__reCalc(key, expire, closure);
    }

    return __storageObject.value;
  }

  private __reCalc(key: string, expire: number, closure: () => any) {
    delete CacheService.generalStorage[key];

    let result = closure();

    let __storageObject = new StorageObject();
    __storageObject.key = key;
    __storageObject.value = result;
    __storageObject.options = {};
    if (expire > 0) {
      __storageObject.options = { expire: expire * 1000 }
      __storageObject.expireAfter = __storageObject.createdAt + __storageObject.options.expire;
    }
    CacheService.generalStorage[key] = __storageObject;

    return result;
  }

  deleteKeysWithPattern(pattern: string): void {
    let regex: RegExp = this.__createRegexFromGlob(pattern);
    Object.keys(CacheService.generalStorage).forEach((key: string) => {
      if (regex.test(key)) delete CacheService.generalStorage[key];
    })
  }

  private __createRegexFromGlob(glob: string): RegExp {
    return GlobToRegExp(glob);
  }

  get(key: string) {
    if (!CacheService.generalStorage[key]) {
      return undefined;
    }

    let __storageObject = CacheService.generalStorage[key];
    let currentTime: number = Date.now();
    if (__storageObject.expireAfter && __storageObject.expireAfter < currentTime) {
      if (this.logLevel <= LogLevel.DEBUG) console.debug(`${key} is expired`);
      delete CacheService.generalStorage[key];
      return undefined;
    }

    return __storageObject.value;
  }
}
