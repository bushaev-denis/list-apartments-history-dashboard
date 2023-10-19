<script lang="ts">
	import clsx from 'clsx';
	import { onMount } from 'svelte';

	type ChangeEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let onchange: ((event: ChangeEvent) => void) | undefined = undefined;
	let c: string | undefined = undefined;
	export { c as class };
	export let id: string | undefined = undefined;

	function _onChange(e: ChangeEvent) {
		window.localStorage.setItem(`input-${id}-value`, e.currentTarget.value);
		onchange?.(e);
	}

	onMount(() => {
		const currentValue = window.localStorage.getItem(`input-${id}-value`);
		if (currentValue) {
			value = currentValue;
		}
	});
</script>

<div class="flex items-center gap-2">
	{#if label && id}
		<label for={id} class="dark:text-slate-300">{label}:</label>
	{/if}

	<input
		class={clsx('bg-slate-200 dark:bg-slate-500 dark:text-slate-100 rounded px-1 py-0.5', c)}
		bind:value
		on:change={_onChange}
		{id}
	/>
</div>
