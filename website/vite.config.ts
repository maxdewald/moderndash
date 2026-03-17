import type { UserConfig } from "vite";

import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

const config: UserConfig = {
    plugins: [tailwindcss(), sveltekit()],
    optimizeDeps: {
        exclude: ["svelte-fa", "svelte-meta-tags"]
    },
    build: {
        minify: true,
        sourcemap: true,
        target: "esnext"
    }
};

export default config;
