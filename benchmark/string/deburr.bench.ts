import { deburr as lodashVersion } from "lodash-es";
import { deburr } from "moderndash";
import { bench, describe } from "vitest";

import { randomStringArray } from "../testData.js";

describe("deburr", () => {
    const strings = randomStringArray(100, "avdasfaáäæÅèÊøœßðþłŋĦĲ");

    bench("moderndash", () => {
        for (const str of strings) {
            deburr(str);
        }
    });

    bench("lodash", () => {
        for (const str of strings) {
            lodashVersion(str);
        }
    });
});
