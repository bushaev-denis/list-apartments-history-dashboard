import { PUBLIC_DATA_FILE_PATH } from '$env/static/public';
import { AvgType, District } from '$lib/types';

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
				data: districtData.map((item) => ({
					x: `${item[0]} 00:00:00`,
					y: item[type === AvgType.avg ? 1 : 2]
				})),
				hidden: hiddenItems.includes(districtId)
			};
		})
		.filter((i) => typeof i !== 'undefined');
}
