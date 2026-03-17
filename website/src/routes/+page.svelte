<script lang="ts">
	import type { PageServerData } from "./$types.js";

	import EditButton from "$components/EditButton.svelte";
	import Meta from "$components/Meta.svelte";

	let { data }: { data: PageServerData } = $props();
</script>

<Meta title="Documentation"/>

<div id="readme">
    {@html data.parsedMarkdown}
</div>

<EditButton href="https://github.com/maxdewald/moderndash/edit/main/README.md"/>