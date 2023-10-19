export enum ColorScheme {
	Light = 'light',
	Dark = 'dark'
}

export enum District {
	Ачапняк = 2,
	Арабкир = 3,
	Аван = 4,
	Давидашен = 5,
	Эребуни = 6,
	'Зейтун Канакер' = 7,
	Кентрон = 8,
	'Малатия Себастия' = 9,
	'Нор Норк' = 10,
	Шенгавит = 13,
	'Норк Мараш' = 11,
	Нубарашен = 12
}

export interface Item {
	id: number;
	price: number;
	district: District;
	area: number;
}

export enum AvgType {
	median = 'median',
	avg = 'avg'
}
