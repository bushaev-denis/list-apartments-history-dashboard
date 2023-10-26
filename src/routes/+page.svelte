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
	dayjs.extend(customParseFormat);
	dayjs.locale('ru');

	let datasets: Awaited<ReturnType<typeof getDataset>>;
	let avgType: AvgType = AvgType.median;
	let area: string = '1';

	async function setDatasets(area: string, type: AvgType) {
		if (!browser) return;

		datasets = (await getDataset(type)).map((dataset) => ({
			...dataset,
			data: dataset.data.map((i) => ({ ...i, y: i.y * (+area || 1) }))
		}));
	}

	$: setDatasets(area, avgType);

	onMount(() => {
		const handler = () => setDatasets(area, avgType);

		const i = setInterval(handler, 60 * 60 * 1000)

		window.addEventListener('focus', handler)

		return () => {
			clearInterval(i);
			window.removeEventListener('focus', handler)
		}
	})

	// TODO: remove
	function remarkDays() {
		const d = +dayjs().diff(dayjs('2023-10-17'), 'day');
		const p = new Intl.PluralRules('ru');
		const w = { zero: 'дней', two: 'дня', one: 'день', few: 'дня', many: 'дней', other: 'дней' };
		return `${d} ${w[p.select(d)]}`;
	}
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
								parser: 'yyyy-mm-dd',
								unit: 'month',
								displayFormats: { day: 'DD MMM', quarter: 'MMM YYYY' }
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
									const d = dayjs(i[0].label, 'YYYY-MM-DD');
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
								if (!idx) return;

								const ci = legend.chart;
								const savedLegend = JSON.parse(
									localStorage.getItem('hidden-chart-legend-items') || '[]'
								);

								const districtName = item.text;
								// @ts-ignore -- bad types from chart.js
								const districtId = District[districtName];

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
		<div
			class="text-slate-900/75 dark:text-slate-100/75 italic text-xs border-l-4 border-orange-400 px-4 pb-2"
		>
			<p class="text-xl text-orange-500">⚠️</p>
			<p>Ремарка, почему это выглядит как будто-бы что-то не работает:</p>
			<p>
				Данных пока мало (всего за {remarkDays()}) но они будут обновляться каждый день
			</p>
			<p class="opacity-50">// TODO: убрать, когда эта ремарка будет ненужна</p>
		</div>
	</div>
</div>
