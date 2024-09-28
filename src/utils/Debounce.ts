import { useRef } from "react";

const useDebounce = (callback: Function, delay: number) => {
	const timerRef = useRef<number | null>(null);

	const debounceFn = (...args: any[]) => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = window.setTimeout(() => {
		callback(...args);
		}, delay);
	};

	return debounceFn;
};

export default useDebounce