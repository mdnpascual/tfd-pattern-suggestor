type Requirements = Record<string, number>;
type Probabilities = Record<string, number>;
type Results = Record<string, Record<string, number>>;

export interface PercentileDisplayProps {
	percentiles: number[];
	values: number[];
}

const convertToPercentileDisplayProps = (data: Results): PercentileDisplayProps => {
	const percentiles = new Set<number>();

	for (const blueprint in data) {
		Object.keys(data[blueprint]).forEach((percentile) => percentiles.add(parseFloat(percentile)));
	}

	const sortedPercentiles = Array.from(percentiles).sort((a, b) => a - b);

	const values = sortedPercentiles.map((percentile) =>
		Math.max(...Object.values(data).map((item) => item[`${percentile.toFixed(2)}th percentile`] || 0))
	);

	return { percentiles: sortedPercentiles, values };
};

const formatPercentile = (percentile: number): string => {
	return (percentile * 100).toFixed(2);
};

const binomialCoefficient = (() => {
	const cache = new Map<string, number>();

	return (n: number, k: number): number => {
		if (k > n) return 0;
		if (k === 0 || k === n) return 1;

		const key = `${n},${k}`;
		if (cache.has(key)) return cache.get(key)!;

		let coefficient = 1;
		for (let i = 1; i <= k; i++) {
			coefficient *= (n - (k - i)) / i;
		}

		cache.set(key, coefficient);
		return coefficient;
	};
})();

const calculateNegativeBinomialQuantile = (
	successes: number,
	probability: number,
	percentile: number
): number => {
	let cumulativeProbability = 0;
	let trials = successes;

	while (cumulativeProbability < percentile) {
		const probabilityOfExactTrials =
			binomialCoefficient(trials - 1, successes - 1) *
			Math.pow(probability, successes) *
			Math.pow(1 - probability, trials - successes);
		cumulativeProbability += probabilityOfExactTrials;
		trials++;
	}

	return trials;
};

const calculateRolls = (
	probabilities: Probabilities,
	requirements: Requirements,
	percentiles: number[]
): PercentileDisplayProps => {
	const results: Results = {};

	for (const [item, probability] of Object.entries(probabilities)) {
		const requiredQuantity = requirements[item];
		if (requiredQuantity) {
			results[item] = {};

			for (const percentile of percentiles) {
				const formattedPercentile = `${formatPercentile(percentile)}th percentile`;
				const rollsNeeded = calculateNegativeBinomialQuantile(requiredQuantity, probability, percentile);
				results[item][formattedPercentile] = rollsNeeded;
			}
		}
	}

	return convertToPercentileDisplayProps(results);
};

export default calculateRolls;