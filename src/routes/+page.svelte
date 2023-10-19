<script lang="ts">
	import { AvgType, District } from '$lib/types';
	import { browser } from '$app/environment';
	import Chart from '$lib/components/chart.svelte';
	import { getDataset } from '$lib/helpers/get-dataset';
	import Selector from '$lib/components/selector.svelte';
	import dayjs from 'dayjs';

	let type: AvgType = AvgType.median;
</script>

<div class="grid gap-4">
	<Selector
		label="Тип усреднения"
		id="type"
		options={[
			[AvgType.median, 'Медиана'],
			[AvgType.avg, 'Среднее']
		]}
		bind:value={type}
	/>

	<div>
		{#if browser}
			{#await getDataset(type) then datasets}
				<Chart
					{datasets}
					options={{
						scales: {
							y: {
								ticks: {
									callback: (v) => `$${v}`
								}
							}
						},
						plugins: {
							tooltip: {
								callbacks: {
									title: (i) => dayjs(i[0].label).format('DD.MM.YYYY')
								}
							},
							legend: {
								onClick: (e, item, legend) => {
									const index = item.datasetIndex;
									const ci = legend.chart;
									const savedLegend = JSON.parse(
										localStorage.getItem('hidden-chart-legend-items') || '[]'
									);
									if (ci.isDatasetVisible(index)) {
										ci.hide(index);
										item.hidden = true;
										console.log(item);
										savedLegend.push(District[item.text]);
									} else {
										ci.show(index);
										item.hidden = false;
										savedLegend.splice(savedLegend.indexOf(District[item.text]), 1);
									}
									localStorage.setItem('hidden-chart-legend-items', JSON.stringify(savedLegend));
								}
							}
						}
					}}
				/>
			{/await}
		{/if}
	</div>
</div>
