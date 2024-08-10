type Requirements = Record<string, number>;
type Probabilities = Record<string, number>;
type Results = Record<string, Record<string, number>>;

export interface PercentileDisplayProps {
	percentiles: number[];
	values: number[];
}

const convertToPercentileDisplayProps = (data: Record<string, Record<string, number>>): PercentileDisplayProps => {
	const percentilesSet = new Set<string>();

	for (const blueprint in data) {
		Object.keys(data[blueprint]).forEach(percentile => percentilesSet.add(percentile));
	}

	const percentiles = Array.from(percentilesSet).map(p => parseFloat(p)).sort((a, b) => a - b);

	const values = percentiles.map(percentile => {
		const formattedPercentile = `${formatPercentile(percentile / 100)}th percentile`;
		return Math.max(...Object.values(data).map(item => item[formattedPercentile] || 0));
	});

	return { percentiles, values };
}

const formatPercentile = (percentile: number) => {
	const value = percentile * 100;

	if (Number.isInteger(value)) {
		return value.toFixed(0);
	}

	const decimalPlaces = value % 1 === 0 ? 0 : value.toString().split('.')[1].length;

	return value.toFixed(Math.min(decimalPlaces, 2));  // Cap to 2 decimal places
}

const binomialCoefficient = (n: number, k: number): number => {
	if (k > n) return 0;
	if (k === 0 || k === n) return 1;

	let coefficient = 1;
	for (let i = 1; i <= k; i++) {
		coefficient *= (n - (k - i)) / i;
	}
	return coefficient;
}

const calculateNegativeBinomialQuantile = (
	successes: number,
	probability: number,
	percentile: number
): number => {
	let cumulativeProbability = 0;
	let trials = 0;

	while (cumulativeProbability < percentile) {
		trials++;
		const probabilityOfExactTrials =
		binomialCoefficient(trials - 1, successes - 1) *
		Math.pow(probability, successes) *
		Math.pow(1 - probability, trials - successes);
		cumulativeProbability += probabilityOfExactTrials;
	}

	return trials;
}

const calculateRolls = (
	probabilities: Probabilities,
	requirements: Requirements,
	percentiles: number[]
): PercentileDisplayProps  => {
	const results: Results = {};
	for (const [stuff, probability] of Object.entries(probabilities)) {
		if (requirements[stuff]) {
			const desiredQuantity = requirements[stuff];
			results[stuff] = {};

			for (const percentile of percentiles) {
				const rollsNeeded = calculateNegativeBinomialQuantile(
					desiredQuantity,
					probability,
					percentile
				);
				results[stuff][`${formatPercentile(percentile)}th percentile`] =
				rollsNeeded;
			}
		}
	}
	return convertToPercentileDisplayProps(results);
}

export default calculateRolls;