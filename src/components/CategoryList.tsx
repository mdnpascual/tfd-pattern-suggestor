import React, { useEffect, useState } from "react";
import MaterialPlanner from "./MaterialPlanner";
import RectangularBox from "./RectangularBox";
import { GearPart } from "../data/constants";
import InitializeCategoryData from "../utils/InitializeCategoryData";
import MaterialBox from "./MaterialBox";

export interface CategoryData {
	img: string;
	xOffset: number;
	yOffset: number;
	parts: Array<GearPart>;
	scale?: number;
}

interface CategoryListProps<T> {
	data: Record<string, T>;
	localStorageStatusKey: string;
	localStorageMaterialKey: string;
	preloadedData: any,
	withQuantity?: boolean;
	disableOwnership?: boolean;
	useMaterialBox?: boolean;
}

const defaultStartingQuantity = 5;

const CategoryList = <T extends CategoryData>({
	data,
	localStorageStatusKey,
	localStorageMaterialKey,
	preloadedData,
	withQuantity,
	disableOwnership,
	useMaterialBox
}: CategoryListProps<T>) => {
	console.log(data);
	console.log(localStorageStatusKey);
	console.log(localStorageMaterialKey);
	console.log(preloadedData);
	console.log(withQuantity);
	console.log(disableOwnership);
	console.log(useMaterialBox);
	const [selected, setSelected] = useState<string>("");
	const [categoryStatus, setCategoryStatus] = useState<Record<string, boolean>>({});
	const [materialCount, setMaterialCount] = useState<Record<string, number>>({});
	const [categoryList, setCategoryList] = useState<string[]>([]);
	const [categoryData, setCategoryData] = useState<Record<string, T>>({});

	useEffect(() => {
		if(Object.keys(preloadedData).length > 0){
			setCategoryStatus(preloadedData.categoryStatus)
			setCategoryList(Object.keys(preloadedData.categoryStatus).sort())
			setCategoryData(data)
			setMaterialCount(preloadedData.materialCount)
		}
	}, [preloadedData]);

	useEffect(() => {
		const currentData = InitializeCategoryData(data, localStorageStatusKey, localStorageMaterialKey)
		setCategoryStatus(currentData.categoryStatus)
		setCategoryList(Object.keys(currentData.categoryStatus).sort())
		setCategoryData(data)
		setMaterialCount(currentData.materialCount)
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
		<div className={`${useMaterialBox ? 'material' : 'rectangular'}-box-grid`}>
			{categoryList.map((category) => (
				<div key={category}>
					{selected === category && (
						<div className="category-list-overlay">
							<div className="category-list-content">
								<button
									id={`${category.replaceAll(" ", "-")}-close-material-button`}
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
										? materialCount[category] ?? defaultStartingQuantity
										: undefined
									}
									disableOwnership={disableOwnership}
								/>
							</div>
						</div>
					)}
					{!useMaterialBox && (<RectangularBox
						title={category}
						backgroundImage={categoryData[category].img}
						xOffset={categoryData[category].xOffset}
						yOffset={categoryData[category].yOffset}
						isDisabled={categoryStatus[category]}
						scale={categoryData[category].scale}
						onSelect={handleSelected}
						onOwned={handleOwned}
						disableOwnership={disableOwnership}
					/>)}
					{useMaterialBox && (<MaterialBox
						title={category}
						backgroundImage={categoryData[category].img}
						xOffset={categoryData[category].xOffset}
						yOffset={categoryData[category].yOffset}
						scale={categoryData[category].scale}
						onSelect={handleSelected}
						onOwned={handleOwned}
						disableOwnership={disableOwnership}
					/>)}
				</div>
			))}
		</div>
	);
}

export default CategoryList;
