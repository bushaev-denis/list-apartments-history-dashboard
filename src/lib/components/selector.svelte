<script lang="ts">
	import clsx from 'clsx';

	export let options: Array<string> | Array<[string, string]> = [];
	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let onchange:
		| ((event: Event & { currentTarget: EventTarget & HTMLSelectElement }) => void)
		| undefined = undefined;
	let c: string | undefined = undefined;
	export { c as class };
</script>

{#if options}
	<div class="flex items-center gap-2">
		{#if label && $$props.id}
			<label for={$$props.id} class="dark:text-slate-300">{label}:</label>
		{/if}

		<select
			class={clsx('bg-slate-200 dark:bg-slate-500 dark:text-slate-100 rounded px-1 py-0.5', c)}
			bind:value
			on:change={onchange}
		>
			{#each options.map((i) => (Array.isArray(i) ? i : [i, i])) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>
{/if}
