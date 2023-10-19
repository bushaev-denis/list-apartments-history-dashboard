<script lang="ts">
	import clsx from 'clsx';
	import { onMount } from 'svelte';

	type ChangeEvent = Event & { currentTarget: EventTarget & HTMLSelectElement };

	export let options: Array<string> | Array<[string, string]> = [];
	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let onchange: ((event: ChangeEvent) => void) | undefined = undefined;
	let c: string | undefined = undefined;
	export { c as class };
	export let id: string | undefined = undefined;
	export let useLocalStorage = false;

	function _onChange(e: ChangeEvent) {
		useLocalStorage && window.localStorage.setItem(`select-${id}-value`, e.currentTarget.value);
		onchange?.(e);
	}

	onMount(() => {
		if (!useLocalStorage) return;
		const currentValue = window.localStorage.getItem(`select-${id}-value`);
		if (currentValue) {
			value = currentValue;
		}
	});
</script>

{#if options}
	<div class="flex items-center gap-2">
		{#if label && id}
			<label for={id} class="dark:text-slate-300">{label}:</label>
		{/if}

		<select
			class={clsx('bg-slate-200 dark:bg-slate-500 dark:text-slate-100 rounded px-1 py-0.5', c)}
			bind:value
			on:change={_onChange}
			{id}
		>
			{#each options.map((i) => (Array.isArray(i) ? i : [i, i])) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>
{/if}
