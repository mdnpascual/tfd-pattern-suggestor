import { CategoryData } from "../components/CategoryList";
import { Material, GearPart } from "../data/constants";

const InitializeCategoryData = <T extends CategoryData>(
	data: Record<string, T>,
	localStorageStatusKey: string,
	localStorageMaterialKey: string
) => {
	const savedCategoryStatus = localStorage.getItem(localStorageStatusKey);
	const categoryStatus = savedCategoryStatus ? JSON.parse(savedCategoryStatus) : {};

	const savedMaterialCount = localStorage.getItem(localStorageMaterialKey);
	const materialCount = savedMaterialCount ? JSON.parse(savedMaterialCount) : {};

	const categoryList = Object.keys(data).sort();
	const startingCategoryList = categoryList.reduce((acc, category) => {
		acc[category] = categoryStatus[category] ?? false;
		return acc;
	}, {} as Record<string, boolean>);

	const materialSet = new Set<string>();
	categoryList.forEach((category) => {
		materialSet.add(JSON.stringify({ name: category, quantity: 0 }));
		data[category].parts.forEach((part: GearPart) => {
			materialSet.add(JSON.stringify({ name: part.name, quantity: 1 }));
			part.mats?.forEach((mat: Material) => materialSet.add(JSON.stringify(mat)));
		});
	});

	const materialList = Array.from(materialSet).map((item) => JSON.parse(item).name).sort();

	const startingMaterialCount = materialList.reduce((acc, material) => {
		acc[material] = materialCount[material] === undefined ? (
			categoryList.includes(material)
				? (localStorageStatusKey === 'characterStatus'
					? 1 // Default count for characters
					: 5 // Default count for weapons
				)
				: 0
		) : materialCount[material];
		return acc;
	}, {} as Record<string, number>);

	if (Object.keys(categoryStatus).length === 0) {
		localStorage.setItem(localStorageStatusKey, JSON.stringify(startingCategoryList));
	}

	if (Object.keys(materialCount).length === 0) {
		localStorage.setItem(localStorageMaterialKey, JSON.stringify(startingMaterialCount));
	}

	return { categoryStatus: startingCategoryList, materialCount: startingMaterialCount };
};

export default InitializeCategoryData;
