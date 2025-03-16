export type AnyChunk =
  Record<string, string>
| Record<string, Record<string, string>>

export function mergeChunks(a: AnyChunk, b: AnyChunk): AnyChunk {
    const result: Record<string, any> = {};
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const key of keys) {
        if (key in a && key in b) {
            result[key] = mergeValues(a[key], b[key]);
        } else if (key in a) {
            result[key] = a[key];
        } else {
            result[key] = b[key];
        }
    }
    return result as AnyChunk;
}

function mergeValues(v1: AnyChunk | string, v2: AnyChunk | string): AnyChunk | string {
    if (typeof v1 === 'string' && typeof v2 === 'string') {
        return v1 + v2;
    } else if (typeof v1 === 'string' && typeof v2 === 'object') {
        return mergeStringWithRecord(v1, v2 as AnyChunk);
    } else if (typeof v2 === 'string' && typeof v1 === 'object') {
        return mergeRecordWithString(v1 as AnyChunk, v2);
    } else {
        return mergeChunks(v1 as AnyChunk, v2 as AnyChunk);
    }
}

function mergeStringWithRecord(str: string, rec: AnyChunk): AnyChunk {
    const result: Record<string, any> = {};
    for (const key in rec) {
        const value = rec[key];
        if (typeof value === 'string') {
            result[key] = str + value;
        } else {
            result[key] = mergeStringWithRecord(str, value as AnyChunk);
        }
    }
    return result as AnyChunk;
}

function mergeRecordWithString(rec: AnyChunk, str: string): AnyChunk {
    const result: Record<string, any> = {};
    for (const key in rec) {
        const value = rec[key];
        if (typeof value === 'string') {
            result[key] = value + str;
        } else {
            result[key] = mergeRecordWithString(value as AnyChunk, str);
        }
    }
    return result as AnyChunk;
}
