function io(item: any): item is object {
	return item && typeof item === 'object' && !Array.isArray(item);
}

export default function mergeDeep(target: Record<string, any>, source: Record<string, any>) {
	let output = Object.assign({}, target);
	if (io(target) && io(source)) {
		Object.keys(source).forEach((key) => {
			if (io(source[key])) {
				if (!(key in target)) Object.assign(output, { [key]: source[key] });
				else output[key] = mergeDeep(target[key], source[key]);
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	}
	return output;
}
