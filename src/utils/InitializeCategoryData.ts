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
		acc[category] =
		category in categoryStatus
			? categoryStatus[category]
			: false;
		return acc;
	}, {} as Record<string, boolean>)

	let material: Material[] = [];
	Object.entries(data).forEach(([key, data]) => {
		material.push({
			name: key,
			quantity: 0
		})
		data.parts.forEach((part: GearPart) => {
			material.push({ name: part.name, quantity: 1 });
				part.mats?.forEach((mat: Material) => {
					material.push(mat);
			});
		});
	});

	material = Array.from(new Set(material.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));
		const materialList = material.map((item) => item.name).sort();
		const startingMaterialCount = materialList.reduce((acc, material) => {
			acc[material] =
			material in materialCount ? materialCount[material] : 0;
			return acc;
		}, {} as Record<string, number>)

	if (Object.keys(categoryStatus).length === 0) {
		localStorage.setItem(
			localStorageStatusKey,
			JSON.stringify(startingCategoryList)
		);
	}

	if (Object.keys(materialCount).length === 0) {
		localStorage.setItem(
			localStorageMaterialKey,
			JSON.stringify(startingMaterialCount)
		);
	}

	return { categoryStatus: startingCategoryList, materialCount: startingMaterialCount };
}

export default InitializeCategoryData