<script lang="ts">
	import { MetaTags } from "svelte-meta-tags";

	import icon from "$assets/moderndashIcon.svg?url";
	import logo from "$assets/moderndashLogo.svg?url";

	import { page } from "$app/stores";

	let { title = "", description = "ModernDash is a modern and lightweight alternative to utility libraries like Lodash. It provides important functions while encouraging use of native JS where possible." }: { title?: string; description?: string } = $props();

	let fullTitle = $derived(title ? `${title} | ModernDash` : "ModernDash");
</script>

<MetaTags
    title={fullTitle}
    {description}
    canonical={`https://moderndash.io${$page.url.pathname.toLowerCase()}`}
    openGraph={{
        images: [
            {
                url: icon,
                alt: "ModernDash Icon"
            }
        ]
    }}
    twitter={{
        cardType: "summary_large_image",
        image: logo,
        imageAlt: "ModernDash Logo"
    }}
/>
