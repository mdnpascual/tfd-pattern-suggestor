import { CategoryData } from "../components/CategoryList";
import { Material, GearPart } from "../data/constants";

const InitializeMaterialData = <T extends CategoryData>(
	data: Record<string, T>,
	localStorageStatusKey: string,
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

	return { categoryStatus: startingMaterialList, materialCount: startingMaterialCount };
};

export default InitializeMaterialData;
