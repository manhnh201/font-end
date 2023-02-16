import { Base64 } from "js-base64";
import * as _ from "lodash";
import * as CryptoJS from 'crypto-js';

export class CryptoUtils {
    base64Encode: boolean = true;
    secretKey: string = '3JqwE9X*NZhy2BJon8FUgQ4twxifE3_t'

    /**
     * Mã hóa nội dung
     * @param value 
     * @returns 
     */
    encrypt(value: string): string {
        if (_.isEmpty(value)) return value
        let __value: string = value
        __value = CryptoJS.AES.encrypt(value, this.secretKey).toString()
        if (this.base64Encode) {
            __value = Base64.encode(__value)
        }
        return __value
    }

    /**
     * Giải mã nội dung
     * @param value 
     * @returns 
     */
    decrypt(value: string): string | null {
        if (_.isEmpty(value)) return value
        let __value: string | null = value || ''
        if (this.base64Encode) {
            __value = Base64.decode(__value)
        }
        try {
            __value = CryptoJS.AES.decrypt(__value, this.secretKey).toString(CryptoJS.enc.Utf8)
        } catch (e) {
            console.error(e)
            __value = null
        }
        return __value
    }
}