import { Injectable } from '@angular/core';
import { CryptoUtils } from '../crypto/crypto.utils'
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  keepKeys: string[] = ['lang'];
  /**
   * Có thực hiện mã hóa dữ liệu hay không
   */
  encrypt: boolean = true;
  crypto: CryptoUtils = new CryptoUtils()

  constructor() { }

  setItem(key: string, value?: string) {
    if (value) {
      localStorage.setItem(key, this.encrypt ? this.crypto.encrypt(value) : value)
    }
  }

  getItem(key: string) {
    let value = localStorage.getItem(key)
    if (value) {
      return this.encrypt ? this.crypto.decrypt(value) : value
    }
    return null
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear(regex?: RegExp) {
    let removeKeys: string[] = []
    for (let idx = 0; idx <= localStorage.length; idx++) {
      let key = localStorage.key(idx) || ''
      if (regex !== undefined) {
        if (regex.test(key)) {
          removeKeys.push(key)
        }
      } else {
        if (this.keepKeys.includes(key)) continue;
        removeKeys.push(key)
      }
    }
    removeKeys.forEach((key: string) => {
      localStorage.removeItem(key)
    })
  }
}
