import type { GenericObject } from "@type/GenericObject";
import type { PlainObject } from "@type/PlainObject.js";
import type { Call, Objects } from "hotscript";

import { isPlainObject } from "@validate/isPlainObject.js";

const validPathRegex = /^[^.[\]]+(?:\.[^.[\]]+)*(?:\[\d+])*(?:\.[^.[\]]+(?:\[\d+])*)*$/;
const pathSplitRegex = /\.|(?=\[)/g;
const matchBracketsRegex = /[[\]]/g;

// eslint-disable-next-line @typescript-eslint/ban-types
type Paths<TObj> = Call<Objects.AllPaths, TObj> | string & {};
type UpdateObj<TObj, TPath extends string, TVal> =
    TPath extends `.${infer TRest}` ? UpdateObj<TObj, TRest, TVal>
        : TPath extends `${infer TKey}[${infer TIndex}]${infer TRest}`
            ? Call<Objects.Update<TKey, UpdateArray<Call<Objects.Get<TKey>, TObj>, TIndex, TRest, TVal>>, TObj>
            : Call<Objects.Update<TPath, TVal>, TObj>;

// Bracket paths create arrays at runtime, replacing any non-array value.
// Objects.Update treats numeric path components as object keys instead.
type UpdateArray<TArray, TIndex extends string, TPath extends string, TVal> =
    TArray extends readonly unknown[]
        ? TIndex extends keyof TArray
            ? { [K in keyof TArray]: K extends TIndex ? UpdateObj<TArray[K], TPath, TVal> : TArray[K] }
            : (TArray[number] | UpdateObj<TArray[number], TPath, TVal>)[]
        : UpdateObj<{}, TPath, TVal>[];

/**
 * Sets the value at path of object. If a portion of path doesn’t exist, it’s created.
 * 
 * @example
 * const obj = { a: { b: 2 } };
 * set(obj, 'a.c', 1);
 * // => { a: { b: 2, c: 1 } }
 * 
 * // `[number]` can be used to access array elements
 * set(obj, 'a.c[0]', 'hello');
 * // => { a: { b: 2, c: ['hello'] } }
 * 
 * // numbers with dots are treated as keys
 * set(obj, 'a.c.0.d', 'world');
 * // => { a: { b: 2, c: { 0: { d: 'world' } } }
 * 
 * // supports numbers in keys
 * set(obj, 'a.e0.a', 1);
 * // => { a: { e0: { a: 1 } } }
 * 
 * @param obj The object to modify.
 * @param path The path of the property to set.
 * @param value The value to set.
 * @template TObj The type of the object.
 * @template TPath The type of the object path.
 * @template TVal The type of the value to set.
 * @returns The modified object.
 */

export function set<TObj extends GenericObject, TPath extends Paths<TObj>, TVal>(obj: TObj, path: TPath, value: TVal): UpdateObj<TObj, TPath, TVal> {
    if (!validPathRegex.test(path))
        throw new Error("Invalid path, look at the examples for the correct format.");

    const pathParts = (path as string).split(pathSplitRegex);
    let currentObj: PlainObject = obj;

    for (let index = 0; index < pathParts.length; index++) {
        const key = pathParts[index].replace(matchBracketsRegex, "");

        if (key === "__proto__")
            return obj as UpdateObj<TObj, TPath, TVal>;

        if (index === pathParts.length - 1) {
            currentObj[key] = value;
            break;
        }

        const nextElementInArray = pathParts[index + 1].startsWith("[");
        const nextElementInObject = !nextElementInArray;

        if (nextElementInArray && !Array.isArray(currentObj[key])) {
            currentObj[key] = [];
        }

        if (nextElementInObject && !isPlainObject(currentObj[key])) {
            currentObj[key] = {};
        }
        
        currentObj = currentObj[key] as PlainObject;
    }

    return obj as UpdateObj<TObj, TPath, TVal>;
}
