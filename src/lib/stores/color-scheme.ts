import { ColorScheme } from '$lib/types';
import { derived, writable } from 'svelte/store';

export const systemColorScheme = writable<ColorScheme>(ColorScheme.Light);
export const preferredColorScheme = writable<'system' | ColorScheme>('system');
export const colorScheme = derived([systemColorScheme, preferredColorScheme], ([$s, $p]) =>
	$p === 'system' ? $s : $p
);

export const getQuery = () => matchMedia('(prefers-color-scheme: dark)');

function queryChangeHandler(event: { matches: boolean }) {
	systemColorScheme.set(event.matches ? ColorScheme.Dark : ColorScheme.Light);
}

function storageChangeHandler(event: StorageEvent) {
	if (event.key === 'color-scheme') {
		preferredColorScheme.set(event.newValue as 'system' | ColorScheme);
	}
}

export function setPreferredColorScheme(scheme: 'system' | ColorScheme) {
	localStorage.setItem('color-scheme', scheme);
}

export function onMountHandler() {
	const q = getQuery();

	q.addEventListener('change', queryChangeHandler);
	window.addEventListener('storage', storageChangeHandler);

	return () => {
		q.removeEventListener('change', queryChangeHandler);
		window.removeEventListener('storage', storageChangeHandler);
	};
}

export function init() {
	systemColorScheme.set(getQuery().matches ? ColorScheme.Dark : ColorScheme.Light);
	preferredColorScheme.set(
		(localStorage.getItem('color-scheme') || 'system') as 'system' | ColorScheme
	);
}
