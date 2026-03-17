import { deburr } from "@string/deburr";

test("removes diacritics from a string", () => {
    expect(deburr("Mëtàl Hëàd")).toEqual("Metal Head");
    expect(deburr("Pokémón")).toEqual("Pokemon");
    expect(deburr("résumé")).toEqual("resume");
});

test("converts Latin-1 Supplement ligatures and special letters", () => {
    expect(deburr("Hællæ, hva skjera?")).toEqual("Haellae, hva skjera?");
    expect(deburr("Æthelred")).toEqual("AEthelred");
    expect(deburr("Straße")).toEqual("Strasse");
    expect(deburr("Ørsted")).toEqual("Orsted");
    expect(deburr("Ðjango")).toEqual("Django");
    expect(deburr("Þor")).toEqual("Thor");
});

test("converts Latin Extended-A ligatures and special letters", () => {
    expect(deburr("Œuvre")).toEqual("OEuvre");
    expect(deburr("Łódź")).toEqual("Lodz");
    expect(deburr("Đồng")).toEqual("Dong");
    expect(deburr("Ħal Far")).toEqual("Hal Far");
    expect(deburr("Ŋambe")).toEqual("Nambe");
});

test("handles mixed diacritics and ligatures", () => {
    expect(deburr("crème brûlée")).toEqual("creme brulee");
    expect(deburr("Ångström")).toEqual("Angstrom");
    expect(deburr("naïve café résumé")).toEqual("naive cafe resume");
});

test("returns the input string if it has no diacritics", () => {
    expect(deburr("hello")).toEqual("hello");
    expect(deburr("world")).toEqual("world");
});
