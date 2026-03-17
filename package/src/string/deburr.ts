/** Sparse array indexed by char code for O(1) ligature lookups. */
const ligatures: Record<number, string> = {
    0xC6: "AE", 0xE6: "ae",
    0xD0: "D",  0xF0: "d",
    0xD8: "O",  0xF8: "o",
    0xDE: "Th", 0xFE: "th",
    0xDF: "ss",
    0x110: "D",  0x111: "d",
    0x126: "H",  0x127: "h",
    0x131: "i",
    0x132: "IJ", 0x133: "ij",
    0x138: "k",
    0x13F: "L",  0x140: "l",
    0x141: "L",  0x142: "l",
    0x149: "'n",
    0x14A: "N",  0x14B: "n",
    0x152: "OE", 0x153: "oe",
    0x166: "T",  0x167: "t",
    0x17F: "s",
};

/**
 * Deburrs a string by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @example
 * deburr('déjà vu')
 * // => 'deja vu'
 * @param str The string to deburr.
 * @returns Returns the deburred string.
 */
export function deburr(str: string): string {
    const nfd = str.normalize("NFD");
    let result = "";
    for (let i = 0; i < nfd.length; i++) {
        const code = nfd.charCodeAt(i);
        if (code >= 0x300 && code <= 0x36F) continue;
        result += ligatures[code] ?? nfd[i];
    }
    return result;
}
