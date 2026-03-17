/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)

import swc from "@rollup/plugin-swc";
import { withFilter } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        withFilter(
            swc({
                swc: {
                    jsc: {
                        parser: { syntax: "typescript", decorators: true },
                        transform: { decoratorVersion: "2022-03" },
                    },
                },
            }),
            { transform: { code: "@" } },
        ),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        globals: true,
        coverage: {
            exclude: ["**/index.ts", "src/type", "test/**", "src/helpers/ArrayTypeUtils.ts"]
        }
    },
});
