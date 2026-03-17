<script lang="ts">
	import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
	import { capitalize } from "moderndash";
	import Fa from "svelte-fa";

	let { categoryName, entries }: { categoryName: string; entries: string[] } = $props();

	let isOpen = $state(true);
</script>

<div>
	<button type="button" class="font-semibold mb-4 tracking-tight text-slate-900 flex items-center cursor-pointer text-lg select-none w-full"
		onclick={() => (isOpen = !isOpen)}
	>
		<span class="mr-3">
			<Fa icon={isOpen ? faChevronDown : faChevronRight}/>
		</span>
		{capitalize(categoryName)}
	</button>
    {#if isOpen}
        <div>
            {#each entries as entry}
                <div class="ml-[0.4rem] pl-7 border-l-2 border-gray-200 hover:border-cyan-300 py-[0.3rem]">
                    <a href="/docs/{entry.toLowerCase()}" class="text-slate-900 hover:text-slate-800">
                        {entry}
                    </a>
                </div>
            {/each}
        </div>
    {/if}
</div>
