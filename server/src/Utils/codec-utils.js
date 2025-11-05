import _ from 'lodash'

/**
 * 對 obj 進行 base64 encode ; utf8
 * @param {*} obj 
 * @returns base64 string || null
 */
export async function encodeSession(obj) {
    if (_.isNil(obj) || _.isEmpty(obj)) return null;
    // Check includes : null, undefined, empty object
    // if (
    //     obj === null ||
    //     obj === undefined ||
    //     (typeof obj === 'object' && Object.keys(obj).length === 0)
    //   )

    try {
        const json = JSON.stringify(obj);
        const base64 = Buffer.from(json, 'utf8').toString('base64');
        return base64;
    } catch (err) {
        console.error("[encodeSession] Encode error:", err);
        return null;
    }
}

/**
 * 對 base64 string 進行 base64 decode ; utf8
 * @param {*} encodedStr 
 * @returns obj || null
 */
export async function decodeSession(encodedStr) {
    if (_.isNil(encodedStr) || !_.isString(encodedStr) || _.isEmpty(encodedStr.trim())) {
        return null;
    }

    try {
        const jsonStr = Buffer.from(encodedStr, 'base64').toString('utf8');
        const obj = JSON.parse(jsonStr);
        return obj;
    } catch (err) {
        console.error("[decodeSession] Decode error:", err);
        return null;
    }
}