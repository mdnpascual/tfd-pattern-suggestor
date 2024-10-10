const GetLocalStorageItem = <T>(key: string, defaultValue: T): T => {
	const item = localStorage.getItem(key);
	if (item === null) {
		return defaultValue;
	}
	try {
		return JSON.parse(item) as T;
	} catch {
		return defaultValue;
	}
};

export default GetLocalStorageItem;
