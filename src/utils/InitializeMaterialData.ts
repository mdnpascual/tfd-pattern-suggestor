import { CategoryData } from "../components/CategoryList";
import { MaterialUsageData, defaultStartingQuantity } from "../data/constants";

const InitializeMaterialData = <T extends CategoryData>(
	data: Record<string, T>,
	rawData: Record<string, T>[],
	preloadedData: {categoryStatus: Record<string, boolean>, materialCount: any}[],
	localStorageMaterialKey: string
) => {

	const savedMaterialCount = localStorage.getItem(localStorageMaterialKey);
	const materialCount = savedMaterialCount ? JSON.parse(savedMaterialCount) : {};

	const materialList = Object.keys(data).sort();
	const startingMaterialList = materialList.reduce((acc, material) => {
		acc[material] = true;
		return acc;
	}, {} as Record<string, boolean>);

	const startingMaterialCount = materialList.reduce((acc, material) => {
		acc[material] = materialCount[material] ?? 0;
		return acc;
	}, {} as Record<string, number>);


	const materialUsage = Object.entries(startingMaterialList).reduce((acc, [itemName]) => {
		const usage: MaterialUsageData[] = [];

		rawData.forEach((raw, rawIndex) => {
			for (const parent in raw) {
				const parts = raw[parent].parts;
				let parentGoal = 0;
				switch (rawIndex) {
					case 0:
						// Characters
						parentGoal = preloadedData[rawIndex].categoryStatus[parent] ? 0 : 1
						break;
					default:
						// Weapons and Enhancements
						parentGoal = preloadedData[rawIndex].categoryStatus[parent]
							? 0
							: preloadedData[rawIndex].materialCount[parent] === undefined
								? defaultStartingQuantity
								: preloadedData[rawIndex].materialCount[parent];
						break;
				}
				for (const part of parts) {
					if (part.mats?.some(mat => mat.name === itemName)) {
						const endGoal = Math.max(parentGoal - preloadedData[rawIndex].materialCount[part.name], 0)
						usage.push({
							parent: parent,
							part: part.name,
							baseCount: part.mats.find(mat => mat.name === itemName)?.quantity || 0,
							goal: endGoal
						});
					}
				}
			}
		});

		acc[itemName] = usage;
		return acc;
	}, {} as Record<string, MaterialUsageData[]>);

	return { categoryStatus: startingMaterialList, materialCount: startingMaterialCount, materialUsage: materialUsage, bestFarm: data.farmIn  };
};

export default InitializeMaterialData;
