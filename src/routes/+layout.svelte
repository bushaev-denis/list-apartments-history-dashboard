<script lang="ts">
	import '../app.css';
	import { ColorScheme } from '$lib/types';
	import Selector from '$lib/components/selector.svelte';
	import {
		init,
		onMountHandler,
		preferredColorScheme,
		colorScheme,
		setPreferredColorScheme
	} from '$lib/stores/color-scheme';
	import { onMount } from 'svelte';

	if (typeof window !== 'undefined') {
		init();
	}

	onMount(onMountHandler);

	function onChangePreferredColorScheme(
		event: Event & { currentTarget: EventTarget & HTMLSelectElement }
	) {
		setPreferredColorScheme(event.currentTarget.value as ColorScheme);
	}
</script>

<div data-scheme={$colorScheme}>
	<main class="h-screen bg-slate-50 dark:bg-slate-900 p-4">
		<header class="flex justify-end items-center gap-4">
			<a
				href="https://github.com/bushaev-denis/list-apartments-history-dashboard"
				class="[&>img]:w-6"
				target="_blank"
			>
				<img class="dark:hidden" src="/images/github-mark.png" alt="github" />
				<img class="hidden dark:inline" src="/images/github-mark-white.png" alt="github" />
			</a>
			<Selector
				onchange={onChangePreferredColorScheme}
				bind:value={$preferredColorScheme}
				options={[
					['system', '💻 Системная'],
					[ColorScheme.Light, '🌞 Дневная'],
					[ColorScheme.Dark, '🌚 Ночная']
				]}
			/>
		</header>

		<div>
			<slot />
		</div>
	</main>
</div>
