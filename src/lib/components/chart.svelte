<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import 'chart.js/auto';
	import 'chartjs-adapter-date-fns';

	import { ru } from 'date-fns/locale';
	// @ts-ignore
	import autocolors from 'chartjs-plugin-autocolors';
	import Chart from 'chart.js/auto';
	import { colorScheme } from '$lib/stores/color-scheme';
	import type { ColorScheme } from '$lib/types';
	import mergeDeep from '$lib/helpers/deep-merge';

	Chart.register(autocolors);

	export let datasets: any;
	export let options: Line['$$prop_def']['options'] | undefined = undefined;

	const colors: Record<ColorScheme, { text: string; line: string }> = {
		light: {
			text: 'rgb(71,85,105)',
			line: 'rgb(203,213,225)'
		},
		dark: {
			text: 'rgb(203,213,225)',
			line: 'rgb(71,85,105)'
		}
	};

	$: theme = colors[$colorScheme];
</script>

<div>
	<Line
		data={{ datasets }}
		width={'100%'}
		height={'400px'}
		options={mergeDeep(
			{
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'month',
							displayFormats: { day: 'DD MMM', quarter: 'MMM YYYY' }
						},
						grid: { color: theme.line, tickColor: theme.line },
						ticks: { backdropColor: theme.line },
						border: { color: theme.line }
					},
					y: {
						grid: { color: theme.line, tickColor: theme.line },
						ticks: {
							color: theme.text,
							backdropColor: theme.line
						},
						border: { color: theme.line }
					}
				},
				plugins: {
					legend: {
						position: 'bottom',
						labels: { color: theme.text }
					},
					colors: { enabled: false }
				},
				adapters: { date: { locale: ru } }
			},
			options || {}
		)}
	/>
</div>
