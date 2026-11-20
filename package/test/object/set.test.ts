import { set } from "@object/set.js";

test("set a value", () => {
    const obj = { a: { b: 2 } };
    const updatedObj = set(obj, "a.c", 1);

    expectTypeOf(updatedObj).toEqualTypeOf<{ a: { b: number; c: number } }>();
    expect(obj).toEqual({ a: { b: 2, c: 1 } });

    const updatedObj2 = set(obj, "a.c.d", 1);
    expectTypeOf(updatedObj2).toEqualTypeOf<{ a: { b: number; c: { d: number } } }>();
    expect(obj).toEqual({ a: { b: 2, c: { d: 1 } } });
});

test("set a value with array path", () => {
    const obj = { a: { b: 2, c: [1, 2] } };
    set(obj, "a.c[2]", 1);
    expect(obj).toEqual({ a: { b: 2, c: [1, 2, 1] } });

    set(obj, "a.d[0].c", 3);
    expect(obj).toEqual({ a: { b: 2, c: [1, 2, 1], d: [{ c: 3 }] } });

    set(obj, "a[0].c", 3);
    expect(obj).toEqual({ a: [{ c: 3 }] });
});

test("infer an array when replacing a primitive", () => {
    const obj = { a: 1 };
    const updatedObj = set(obj, "a[0]", 4);
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: number[] }>();
    expect(obj).toEqual({ a: [4] });
});

test("infer an array when replacing an object", () => {
    const updatedObj = set({ a: { b: 2 }, untouched: true }, "a[0]", "hello");
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: string[]; untouched: boolean }>();
    expect(updatedObj).toEqual({ a: ["hello"], untouched: true });
});

test("infer nested values in a newly created array", () => {
    const updatedObj = set({ a: { b: 2 } }, "a.c[0].d", "hello");
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: { b: number; c: { d: string }[] } }>();
    expect(updatedObj).toEqual({ a: { b: 2, c: [{ d: "hello" }] } });
});

test("infer nested arrays", () => {
    const updatedObj = set({ a: false }, "a[0][0]", 4);
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: number[][] }>();
    expect(updatedObj).toEqual({ a: [[4]] });
});

test("preserve existing array element types", () => {
    const updatedObj = set({ a: [1, 2] }, "a[0]", "hello");
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: (number | string)[] }>();
    expect(updatedObj).toEqual({ a: ["hello", 2] });
});

test("preserve tuple elements outside the updated index", () => {
    const obj: { a: [number, string] } = { a: [1, "hello"] };
    const updatedObj = set(obj, "a[0]", true);
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: [boolean, string] }>();
    expect(updatedObj).toEqual({ a: [true, "hello"] });
});

test("keep dotted numeric keys as object properties", () => {
    const updatedObj = set({ a: {} }, "a.0", 4);
    expectTypeOf(updatedObj).toEqualTypeOf<{ a: { 0: number } }>();
    expect(updatedObj).toEqual({ a: { 0: 4 } });
});

test("throw error on incorrect path format", () => {
    const obj = { a: { b: 2 } };
    expect(() => set(obj, "a.c[1", 1)).toThrow();
    expect(() => set(obj, "a.c.", 1)).toThrow();
});

test("allow _ and $ in path", () => {
    const obj = { a: { b: 2 } };
    expect(() => set(obj, "a.c_1", 1)).not.toThrow();
    expect(() => set(obj, "a.c-$1", 1)).not.toThrow();
});

test("silently skip __proto__ to prevent prototype pollution", () => {
    const obj = { a: { b: 2 } };
    const result = set(obj, "__proto__.polluted", "yes");
    expect(result).toBe(obj);

    set(obj, "a.__proto__.b", "yes");
    expect(obj).toEqual({ a: { b: 2 } });

    expect(({} as any).polluted).toBeUndefined();
});

test("allow legitimate constructor and prototype keys", () => {
    const obj1 = { a: {} };
    set(obj1, "a.constructor", "val");
    expect((obj1 as any).a.constructor).toBe("val");

    const obj2 = { a: {} };
    set(obj2, "a.prototype.b", "val");
    expect((obj2 as any).a.prototype.b).toBe("val");

    // Verify no pollution occurred
    expect(({} as any).polluted).toBeUndefined();
});
