<script lang="ts">
	import { AvgType, District } from '$lib/types';
	import { browser } from '$app/environment';
	import Chart from '$lib/components/chart.svelte';
	import { getDataset } from '$lib/helpers/get-dataset';
	import Selector from '$lib/components/selector.svelte';
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import 'dayjs/locale/ru';
	import Input from '$lib/components/input.svelte';
	import { onMount } from 'svelte';
	import Log from '$lib/components/log.svelte';
	dayjs.extend(customParseFormat);
	dayjs.locale('ru');

	let datasets: Awaited<ReturnType<typeof getDataset>>;
	let avgType: AvgType = AvgType.median;
	let area: string = '1';

	async function setDatasets(area: string, type: AvgType) {
		if (!browser) return;

		datasets = (await getDataset(type)).map((dataset) => ({
			...dataset,
			data: dataset.data.map(({ x, y }) => ({ x, y: y * (+area || 1) }))
		}));
	}

	$: setDatasets(area, avgType);

	onMount(() => {
		const handler = () => setDatasets(area, avgType);

		const i = setInterval(handler, 60 * 60 * 1000);

		window.addEventListener('focus', handler);

		return () => {
			clearInterval(i);
			window.removeEventListener('focus', handler);
		};
	});
</script>

<div class="grid gap-4">
	<div class="flex gap-8">
		<Selector
			label="Тип усреднения"
			id="avgType"
			options={[
				[AvgType.median, 'Медиана'],
				[AvgType.avg, 'Среднее']
			]}
			bind:value={avgType}
		/>

		<Input bind:value={area} id="area" label="Площадь" />
	</div>

	<div>
		{#if browser}
			<Chart
				{datasets}
				options={{
					scales: {
						x: {
							type: 'time',
							time: {
								parser: 'yyyy-MM-dd',
								unit: 'month',
								displayFormats: { quarter: 'MMM YYYY' }
							}
						},
						y: {
							ticks: { callback: (v) => `$${v}` }
						}
					},
					plugins: {
						tooltip: {
							callbacks: {
								title: (i) => {
									// @ts-ignore -- bad types from chart.js
									const d = dayjs(i[0].raw.x, 'YYYY-MM-DD');
									return d.format('DD MMMM' + (dayjs().isSame(d, 'year') ? '' : ' YYYY'));
								},
								label: (i) => {
									const { label } = i.dataset;
									// @ts-ignore -- bad types from chart.js
									const { y } = i.raw;
									return `${label}: $${+y.toFixed(2)}/м²`;
								}
							}
						},
						legend: {
							onClick: (e, item, legend) => {
								const idx = item.datasetIndex;
								if (idx === undefined) return;

								const ci = legend.chart;
								const savedLegend = JSON.parse(
									localStorage.getItem('hidden-chart-legend-items') || '[]'
								);

								const districtName = item.text;
								// @ts-ignore -- bad types from chart.js
								const districtId = District[districtName];

								console.log(districtId);

								if (ci.isDatasetVisible(idx)) {
									ci.hide(idx);
									item.hidden = true;
									savedLegend.push(districtId);
								} else {
									ci.show(idx);
									item.hidden = false;
									savedLegend.splice(savedLegend.indexOf(districtId), 1);
								}
								localStorage.setItem('hidden-chart-legend-items', JSON.stringify(savedLegend));
							}
						}
					}
				}}
			/>
		{/if}
	</div>
	<Log />
</div>
