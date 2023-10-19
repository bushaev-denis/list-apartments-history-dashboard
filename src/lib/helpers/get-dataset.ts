import { PUBLIC_DATA_FILE_PATH } from '$env/static/public';
import { AvgType, District } from '$lib/types';

type Dataset = {
	label: string;
	data: { x: string; y: number }[];
	hidden: boolean;
};

export async function getDataset(type: AvgType) {
	const res = await fetch(PUBLIC_DATA_FILE_PATH);

	if (!res.ok) {
		throw new Error(res.statusText);
	}

	const json = (await res.json()) as Record<string, Array<[string, number, number]>>;

	const hiddenItems = JSON.parse(localStorage.getItem('hidden-chart-legend-items') || '[]');

	return Object.values(District)
		.map((districtId) => {
			const districtData = json[districtId];
			if (!districtData) return;

			return {
				label: District[districtId as District],
				data: districtData.map(([date, avg, median]) => ({
					x: date,
					y: type === 'avg' ? avg : median
				})),
				hidden: hiddenItems.includes(districtId)
			};
		})
		.filter((i): i is Dataset => typeof i !== 'undefined');
}
