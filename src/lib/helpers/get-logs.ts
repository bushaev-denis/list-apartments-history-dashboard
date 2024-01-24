import { PUBLIC_GH_REPO_URL, PUBLIC_LOG_FILE_NAME } from '$env/static/public';
import dayjs from 'dayjs';

export async function getLogs() {
	const res = await fetch(`${PUBLIC_GH_REPO_URL}/${PUBLIC_LOG_FILE_NAME}`);
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	return ((await res.json()) as Array<{ date: string; content: string }>).map((i) => ({
		date: dayjs(i.date),
		content: i.content
	}));
}
