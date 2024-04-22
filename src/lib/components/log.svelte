<script lang="ts">
	import { getLogs } from '$lib/helpers/get-logs';
	import dayjs, { Dayjs } from 'dayjs';
	import { onMount } from 'svelte';
	let logs: Array<{ date: Dayjs; content: string }> = [];

	async function fetchLogs() {
		logs = await getLogs();
	}

	onMount(fetchLogs);
</script>

<div>
	<h3 class="font-semibold text-xl mb-4">Лог</h3>
	<div class="grid gap-1">
		{#each logs.reverse() as log}
			<div class="rounded-xl bg-slate-200 dark:bg-slate-500 px-2 py-4 flex flex-col gap-2">
				<p>{log.content}</p>
				<p class="text-xs self-end">{dayjs(log.date).format('DD.MM.YYYY')}</p>
			</div>
		{/each}
	</div>
</div>
