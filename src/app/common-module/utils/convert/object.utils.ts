import * as _ from "lodash"

export class ObjectUtils {
    /**
     * Gộp các record có cùng giá trị key
     * @param key 
     * @param data 
     * @returns 
     */
    static mergeDataByKey(key: string, data: any[], options?: { labelKey: string, valueKey: string }) {
        let __data: any = {}
        data.forEach((item) => {
            const __key = item[key].toString()
            if (!__data[__key]) {
                __data[__key] = {}
                __data[__key][key] = item[key]
            }
            if (options) {
                __data[__key][item[options.labelKey]] = item[options.valueKey]
            } else {
                _.assign(__data[__key], item)
            }
        })
        return Object.values(__data)
    }
}