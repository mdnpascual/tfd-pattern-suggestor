import React, { useEffect, useState } from "react";
import MaterialPlanner from "./MaterialPlanner";
import RectangularBox from "./RectangularBox";
import { GearPart, Material } from "../data/constants";

interface CategoryData {
	img: string;
	xOffset: number;
	yOffset: number;
	parts: Array<GearPart>;
	flipHorizontal?: boolean;
	scale?: number;
}

interface CategoryListProps<T> {
	data: Record<string, T>;
	localStorageStatusKey: string;
	localStorageMaterialKey: string;
	withQuantity?: boolean;
}

function CategoryList<T extends CategoryData>({
	data,
	localStorageStatusKey,
	localStorageMaterialKey,
	withQuantity
}: CategoryListProps<T>) {

	const [selected, setSelected] = useState<string>("");
	const [categoryStatus, setCategoryStatus] = useState<Record<string, boolean>>({});
	const [materialCount, setMaterialCount] = useState<Record<string, number>>({});
	const [categoryList, setCategoryList] = useState<string[]>([]);
	const [categoryData, setCategoryData] = useState<Record<string, T>>({});

	useEffect(() => {
		const savedCategoryStatus = localStorage.getItem(localStorageStatusKey);
		const initialCategoryStatus: Record<string, boolean> = savedCategoryStatus
			? JSON.parse(savedCategoryStatus)
			: {};

		const savedMaterialCount = localStorage.getItem(localStorageMaterialKey);
		const initialMaterialCount: Record<string, number> = savedMaterialCount
			? JSON.parse(savedMaterialCount)
			: {};


		const categoryDataCopy = data;
		setCategoryData(categoryDataCopy);
		const categoryListCopy = Object.keys(categoryDataCopy).sort();
		setCategoryList(categoryListCopy);

		setCategoryStatus(
			categoryListCopy.reduce((acc, category) => {
				acc[category] =
				category in initialCategoryStatus
					? initialCategoryStatus[category]
					: false;
				return acc;
			},
		{} as Record<string, boolean>))

		let material: Material[] = [];
		Object.entries(categoryDataCopy).forEach(([key, data]) => {
			data.parts.forEach((part: GearPart) => {
				material.push({ name: part.name, quantity: 1 });
					part.mats?.forEach((mat: Material) => {
				material.push(mat);
				});
			});
		});

		// With Quantity, include the parent Item
		if (withQuantity) {
			Object.entries(categoryDataCopy).forEach(([key, data]) => {
				material.push({ name: key, quantity: 5 });
			});
		}

		material = Array.from(new Set(material.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));
		const materialList = material.map((item) => item.name).sort();
		setMaterialCount(
			materialList.reduce((acc, material) => {
				acc[material] =
				material in initialMaterialCount ? initialMaterialCount[material] : 0;
				return acc;
			}, {} as Record<string, number>)
		)
	}, []);

	const handleSelected = (item: string) => {
		setSelected(item);
	};

	const handleOwned = (item: string) => {
		const savedCategoryStatus = localStorage.getItem(localStorageStatusKey);
		let newCategoryStatus: Record<string, boolean> = savedCategoryStatus
			? JSON.parse(savedCategoryStatus)
			: categoryStatus;
		newCategoryStatus[item] = !newCategoryStatus[item];
		localStorage.setItem(
			localStorageStatusKey,
			JSON.stringify(newCategoryStatus)
		);
		setCategoryStatus(newCategoryStatus);
		setSelected("");
	};

	const handleMatCountChange = (item: string, newCount: number) => {
		const savedMaterialCount = localStorage.getItem(localStorageMaterialKey);
		let newMaterialCount: Record<string, number> = savedMaterialCount
			? JSON.parse(savedMaterialCount)
			: materialCount;
		newMaterialCount[item] = newCount;
		localStorage.setItem(
			localStorageMaterialKey,
			JSON.stringify(newMaterialCount)
		);
		setMaterialCount(newMaterialCount);
	};

	const handleQuantityChange = (item: string, quantity: number) => {
		handleMatCountChange(item, quantity)
	}

	return (
		<div className="rectangular-box-grid">
			{categoryList.map((category) => (
				<div key={category}>
					{selected === category && (
						<div className="category-list-overlay">
							<button
								className="overlay-close-button"
								onClick={() => setSelected("")}>
								X
							</button>
							<MaterialPlanner
								title={category}
								parts={categoryData[category].parts}
								stock={materialCount}
								onMatCountChange={handleMatCountChange}
								onOwned={handleOwned}
								enableMultiple={withQuantity}
								onQuantityChange={withQuantity
									? (quantity) => handleQuantityChange(category, quantity)
									: undefined}
								initialQuantity={withQuantity
									? materialCount[category] || 5
									: undefined
								}
							/>
						</div>
					)}
					<RectangularBox
						title={category}
						backgroundImage={categoryData[category].img}
						xOffset={categoryData[category].xOffset}
						yOffset={categoryData[category].yOffset}
						isDisabled={categoryStatus[category]}
						flipHorizontal={categoryData[category].flipHorizontal}
						scale={categoryData[category].scale}
						onSelect={handleSelected}
						onOwned={handleOwned}
					/>
				</div>
			))}
		</div>
	);
}

export default CategoryList;
